"""Regression tests for bugs found during the registration -> login ->
vendor posting -> files -> filters audit. Each test is named after the bug
it guards against and would have failed before the corresponding fix.
"""
from datetime import datetime, timedelta

import pytest

from app.core.security import Security
from app.services.auth_service import AuthService
from app.repositories.profile_repository import VendorProfileRepository, _to_snake_case


# ---------------------------------------------------------------------------
# Fakes shared by the auth tests below - lightweight stand-ins, not a DB.
# ---------------------------------------------------------------------------

class FakeUser:
    def __init__(self, user_id="EP202608C00001", email="vendor@example.com", role="vendor", vendor_types=None):
        self.id = user_id
        self.email = email
        self.role = role
        self.vendor_types = vendor_types or ["OWNER"]
        self.is_active = True
        self.is_verified = False
        self.status = "ACTIVE"
        self.created_at = datetime.utcnow()
        self.name = None
        self.phoneNumber = None


class FakeVendorProfile:
    full_name = "Vendor Name"


class FakeCustomer:
    full_name = "Customer Name"


class FakeUserRepository:
    def __init__(self, user):
        self.user = user
        self.saved_tokens = []

    async def get_user_by_email(self, email):
        return self.user if email == self.user.email else None

    async def get_customer_by_user_id(self, user_id):
        return FakeCustomer() if self.user.role == "user" else None

    async def save_verification_token(self, user_id, token_hash, expires_at):
        self.saved_tokens.append((user_id, token_hash, expires_at))

    async def create_user(self, data):
        return self.user

    async def update_last_login(self, user_id):
        return None


class FakeVendorRepository:
    async def get_vendor_profile(self, user_id):
        return FakeVendorProfile()


class FakeEmailService:
    def __init__(self):
        self.sent = []

    async def send_verification_email(self, email, verification_token, user_name):
        self.sent.append(("verification", email, user_name))
        return True

    async def send_password_reset_email(self, email, reset_token, user_name):
        self.sent.append(("reset", email, user_name))
        return True


# ---------------------------------------------------------------------------
# Bug: Security.refresh_access_token(user) was called with an ORM User
# object, but the method does user.get(...) - AttributeError on every call
# to POST /api/auth/refresh.
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_refresh_access_token_does_not_crash_on_orm_user():
    user = FakeUser()
    service = AuthService(user_repository=FakeUserRepository(user), vendor_profile_repository=None)

    refresh_token = Security.create_refresh_token({"sub": user.email})

    result = await service.refresh_access_token(refresh_token)

    assert "accessToken" in result
    decoded = Security.decode_token(result["accessToken"])
    assert decoded["user_id"] == user.id
    assert "vendor_types" not in decoded  # dropped: never read back from the token


# ---------------------------------------------------------------------------
# Bug: register_user / send_password_reset_email / send_verification_email
# referenced both `customer` and `vendor` unconditionally when only one
# branch of `if user.role == "user" / elif user.role == "vendor"` ever ran -
# UnboundLocalError on every call, swallowed by a bare except so emails
# silently never sent.
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_send_password_reset_email_does_not_crash_for_vendor():
    user = FakeUser(role="vendor")
    email_service = FakeEmailService()
    service = AuthService(
        user_repository=FakeUserRepository(user),
        vendor_profile_repository=FakeVendorRepository(),
        email_service=email_service,
    )

    await service.send_password_reset_email(user.email, "some-token")

    assert email_service.sent == [("reset", user.email, "Vendor Name")]


@pytest.mark.asyncio
async def test_send_password_reset_email_does_not_crash_for_customer():
    user = FakeUser(role="user", email="customer@example.com")
    email_service = FakeEmailService()
    service = AuthService(
        user_repository=FakeUserRepository(user),
        vendor_profile_repository=FakeVendorRepository(),
        email_service=email_service,
    )

    await service.send_password_reset_email(user.email, "some-token")

    assert email_service.sent == [("reset", user.email, "Customer Name")]


@pytest.mark.asyncio
async def test_send_verification_email_does_not_crash_for_vendor():
    user = FakeUser(role="vendor")
    email_service = FakeEmailService()
    repository = FakeUserRepository(user)
    service = AuthService(
        user_repository=repository,
        vendor_profile_repository=FakeVendorRepository(),
        email_service=email_service,
    )

    class _UserByIdRepo(FakeUserRepository):
        async def get_user_by_id(self, user_id):
            return self.user

    service.user_repository = _UserByIdRepo(user)

    await service.send_verification_email(user.email, user.id)

    assert email_service.sent == [("verification", user.email, "Vendor Name")]


# ---------------------------------------------------------------------------
# Domain-isolation refactor: ProfileService.update_vendor_property_with_files
# (and its 5 file-processing helpers) were deleted. profile_controller.py's
# PUT /{vendor_type}/properties/{property_id} route now delegates to
# PropertyService.update_property instead, which owns this file/vendor-detail
# processing correctly (it's Property-domain data). This also fixes a live
# bug: the deleted method called self._update_vendor_details_from_data(...),
# a method ProfileService never defined - every update carrying any
# non-file field crashed with a 500 after a rollback. PropertyService has
# its own correctly-defined _update_vendor_details_from_data, so the route
# no longer crashes.
# ---------------------------------------------------------------------------

def test_profile_service_no_longer_owns_property_file_processing():
    from app.services.profile_service import ProfileService

    for name in (
        "update_vendor_property_with_files",
        "_process_vendor_profile_images_update",
        "_process_property_images_update",
        "_process_property_video_update",
        "_process_vendor_documents_update",
        "_process_property_documents_update",
    ):
        assert not hasattr(ProfileService, name), f"{name} should have moved off ProfileService"


def test_property_service_owns_update_property_and_its_vendor_details_helper():
    from app.services.property_service import PropertyService

    assert callable(getattr(PropertyService, "update_property", None))
    assert callable(getattr(PropertyService, "_update_vendor_details_from_data", None))


# ---------------------------------------------------------------------------
# Bug: DELETE /profile/profile-file/{file_path} deleted whatever path a
# client passed in with no ownership check - any vendor could delete any
# other vendor's stored file by URL.
# ---------------------------------------------------------------------------

class _FakeProfileRepoForOwnership:
    def __init__(self, profile=None, documents=None):
        self._profile = profile
        self._documents = documents or []

    async def get_vendor_profile(self, user_id):
        return self._profile


class _FakeDoc:
    def __init__(self, file_url):
        self.file_url = file_url


@pytest.mark.asyncio
async def test_user_owns_profile_file_true_for_own_profile_picture():
    from app.services.profile_service import ProfileService

    class _Profile:
        profile_picture = "vendor/EP1/profile_images/profile_primary_abc.webp"
        company_logo_url = None

    service = ProfileService.__new__(ProfileService)
    service.vendor_profile_repository = _FakeProfileRepoForOwnership(profile=_Profile())

    assert await service._user_owns_profile_file("EP1", _Profile.profile_picture, []) is True


@pytest.mark.asyncio
async def test_user_owns_profile_file_false_for_someone_elses_file():
    from app.services.profile_service import ProfileService

    class _Profile:
        profile_picture = "vendor/EP1/profile_images/profile_primary_abc.webp"
        company_logo_url = None

    service = ProfileService.__new__(ProfileService)
    service.vendor_profile_repository = _FakeProfileRepoForOwnership(profile=_Profile())

    other_vendors_file = "vendor/EP2/profile_images/profile_primary_xyz.webp"
    assert await service._user_owns_profile_file("EP1", other_vendors_file, []) is False


@pytest.mark.asyncio
async def test_user_owns_profile_file_true_for_own_document():
    from app.services.profile_service import ProfileService

    class _Profile:
        profile_picture = None
        company_logo_url = None

    doc = _FakeDoc("vendor/EP1/documents/aadhaar_card_00_abc.pdf")
    service = ProfileService.__new__(ProfileService)
    service.vendor_profile_repository = _FakeProfileRepoForOwnership(profile=_Profile())

    assert await service._user_owns_profile_file("EP1", doc.file_url, [doc]) is True


# ---------------------------------------------------------------------------
# Bug: photo/logo upload+delete on the persistent vendor profile wrote to
# the wrong table (the latest posted property's detail row) instead of
# VendorProfile, and used camelCase-ish keys with no matching column -
# uploads silently never showed up after refresh.
# ---------------------------------------------------------------------------

def test_field_aliases_map_photo_and_logo_keys_to_real_columns():
    assert _to_snake_case("profilePhotoUrl") == "profile_photo_url"  # sanity check on the generic converter
    from app.repositories.profile_repository import _FIELD_ALIASES

    assert _FIELD_ALIASES["profile_photo_url"] == "profile_picture"
    assert _FIELD_ALIASES["agency_logo_url"] == "company_logo_url"


# ---------------------------------------------------------------------------
# Bug: UserCreate had no `district` field, so a registration payload's
# district was silently dropped by Pydantic even though Customer/VendorProfile
# both persist it.
# ---------------------------------------------------------------------------

def test_user_create_schema_accepts_district():
    from app.schemas.auth import UserCreate

    payload = UserCreate(
        email="new@example.com",
        password="Password123",
        fullName="New User",
        district="Chennai",
    )
    assert payload.district == "Chennai"


# ---------------------------------------------------------------------------
# Bug: FileService had no server-side type/size validation - any direct API
# call could upload an oversized or wrong-type file regardless of what the
# frontend forms enforce.
# ---------------------------------------------------------------------------

class _FakeUploadFile:
    def __init__(self, content: bytes, content_type: str, filename: str = "test.bin"):
        self.filename = filename
        self.content_type = content_type
        self._content = content
        self.file = self

    async def read(self):
        return self._content

    def seek(self, pos):
        return None


@pytest.mark.asyncio
async def test_validate_upload_rejects_oversized_image():
    from app.services.file_service import FileService
    from fastapi import HTTPException

    service = FileService.__new__(FileService)
    big_file = _FakeUploadFile(b"x" * (11 * 1024 * 1024), "image/jpeg")

    with pytest.raises(HTTPException) as exc_info:
        await service._validate_upload(big_file, "image")
    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_validate_upload_rejects_non_pdf_document():
    from app.services.file_service import FileService
    from fastapi import HTTPException

    service = FileService.__new__(FileService)
    bad_doc = _FakeUploadFile(b"not a pdf", "application/octet-stream", filename="malware.exe")

    with pytest.raises(HTTPException) as exc_info:
        await service._validate_upload(bad_doc, "document")
    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_validate_upload_accepts_small_pdf_document():
    from app.services.file_service import FileService

    service = FileService.__new__(FileService)
    good_doc = _FakeUploadFile(b"%PDF-1.4 ...", "application/pdf", filename="aadhaar.pdf")

    await service._validate_upload(good_doc, "document")  # should not raise


# ---------------------------------------------------------------------------
# Bug: yes/no columns (pet_friendly, garden_space, ...) had no normalization -
# a JS boolean or a lowercase/word variant became the literal string "True"/
# "true", which FilterService's case-insensitive comparison (func.lower(col)
# == str(value).lower()) can never match against the filter's "yes"/"no",
# silently making that property unfilterable on the field with no error.
# ---------------------------------------------------------------------------

from app.services.field_mapping_service import FieldMappingService

FILTER_YES_NO_COLUMNS = {
    "pet_friendly", "garden_space", "terrace", "balcony", "smoking_allowed",
    "food_included", "kitchen_access", "utilities_included", "electricity_available",
}


@pytest.mark.parametrize(
    "frontend_key,db_column,raw_value,expected",
    [
        ("petFriendly", "pet_friendly", True, "Yes"),
        ("petFriendly", "pet_friendly", False, "No"),
        ("petFriendly", "pet_friendly", "true", "Yes"),
        ("petFriendly", "pet_friendly", "FALSE", "No"),
        ("petFriendly", "pet_friendly", "Yes", "Yes"),
        ("kitchenAccess", "kitchen_access", True, "Yes"),
        ("utilitiesIncluded", "utilities_included", False, "No"),
    ],
)
def test_yes_no_fields_round_trip_to_yes_or_no(frontend_key, db_column, raw_value, expected):
    mapped = FieldMappingService().map_frontend_to_db_fields({frontend_key: raw_value})

    assert mapped[db_column] == expected
    # This is exactly what FilterService._YESNO_FIELDS compares against
    # (filter_service.py:196-200: func.lower(column) == str(value).lower()) -
    # confirm a "petFriendly=Yes" filter request would actually match a row
    # written from a boolean True.
    assert mapped[db_column].lower() == expected.lower()


def test_yes_no_field_list_matches_filter_service_yesno_fields():
    # Every column FilterService is willing to filter on as yes/no must also
    # go through the write-side normalizer, or the two silently drift apart
    # again the way `kitchen_access` previously did.
    assert FILTER_YES_NO_COLUMNS.issubset(set(FieldMappingService.YES_NO_FIELDS))


# ---------------------------------------------------------------------------
# Bug: nearby_places is a JSONB column but was missing from ARRAY_FIELDS, so
# a comma-separated string input stored as a JSON scalar instead of an
# array - any future `@>` containment filter on it (matching the pattern
# every other JSONB field already uses) would silently match zero rows.
# ---------------------------------------------------------------------------

def test_nearby_places_comma_string_becomes_a_list():
    mapped = FieldMappingService().map_frontend_to_db_fields(
        {"nearbyPlaces": "Hospital, Police Station"}
    )

    assert mapped["nearby_places"] == ["Hospital", "Police Station"]


def test_nearby_places_list_input_passes_through():
    mapped = FieldMappingService().map_frontend_to_db_fields(
        {"nearbyPlaces": ["Hospital", "Police Station"]}
    )

    assert mapped["nearby_places"] == ["Hospital", "Police Station"]


def test_nearby_places_defaults_to_empty_list_when_absent():
    mapped = FieldMappingService().map_frontend_to_db_fields({"propertyTitle": "Test"})

    assert mapped["nearby_places"] == []


# ---------------------------------------------------------------------------
# Domain-isolation refactor: ProfileService.get_vendor_properties /
# search_vendor_properties / get_vendor_property_detail were deleted -
# profile_controller.py now composes PropertyService (raw fetch) with
# ProfileService.format_property_list / assert_owns_property (formatting +
# ownership) instead. These guard the two orchestration helpers that replaced
# them, without needing to fake ProfileService.to_response's full ~140-field
# attribute surface.
# ---------------------------------------------------------------------------

class FakeProperty:
    def __init__(self, id, user_id, posted_by):
        self.id = id
        self.user_id = user_id
        self.posted_by = posted_by


def test_assert_owns_property_passes_for_matching_owner_and_role():
    from app.services.profile_service import ProfileService
    from app.schemas.property_enums import PostedBy

    service = ProfileService.__new__(ProfileService)
    prop = FakeProperty(id=1, user_id="EP1", posted_by=PostedBy.OWNER.value)

    assert service.assert_owns_property(prop, "EP1", PostedBy.OWNER) is prop


@pytest.mark.parametrize(
    "prop",
    [
        None,
        FakeProperty(id=1, user_id="OTHER_USER", posted_by="OWNER"),
        FakeProperty(id=1, user_id="EP1", posted_by="AGENT"),
    ],
)
def test_assert_owns_property_raises_404_for_missing_or_mismatched_property(prop):
    from app.services.profile_service import ProfileService
    from app.schemas.property_enums import PostedBy
    from fastapi import HTTPException

    service = ProfileService.__new__(ProfileService)

    with pytest.raises(HTTPException) as exc_info:
        service.assert_owns_property(prop, "EP1", PostedBy.OWNER)
    assert exc_info.value.status_code == 404


def test_format_property_list_builds_data_and_pagination_from_raw_rows():
    from app.services.profile_service import ProfileService

    service = ProfileService.__new__(ProfileService)
    service.to_response = lambda p: {"id": p}  # stub out the big formatter itself

    result = service.format_property_list(["prop-a", "prop-b"], total_count=42, skip=20, limit=20)

    assert result == {
        "data": [{"id": "prop-a"}, {"id": "prop-b"}],
        "pagination": {"total": 42, "page": 2, "limit": 20, "totalPages": 3},
    }


def test_format_property_list_skips_falsy_rows():
    from app.services.profile_service import ProfileService

    service = ProfileService.__new__(ProfileService)
    service.to_response = lambda p: {"id": p}

    result = service.format_property_list(["prop-a", None], total_count=1, skip=0, limit=20)

    assert result["data"] == [{"id": "prop-a"}]


# ---------------------------------------------------------------------------
# Bug: Owner profile edit silently lost data. `preferredMethods`/`preferredTimes`
# had no entry in VendorProfileRepository._FIELD_ALIASES (they didn't match the
# real `preferred_contact_method`/`preferred_contact_time` columns after generic
# camelCase->snake_case conversion), and `dateOfBirth`/`additionalNotes` had no
# storage at all - unlike Agent/Builder/Property-Management, Owner had no
# ROLE_EXTRA_SCHEMA/ROLE_EXTRA_COLUMN entry to hold role-only fields in a JSONB
# blob. Both are now fixed (profile_repository._FIELD_ALIASES, and
# app.schemas.vendor_profile_details.OwnerProfileExtra / vendor_profile.owner_details).
# ---------------------------------------------------------------------------

class _FakeAsyncDb:
    def __init__(self):
        self.flushed = False
        self.refreshed = False

    async def flush(self):
        self.flushed = True

    async def refresh(self, obj):
        self.refreshed = True

    async def execute(self, *args, **kwargs):
        raise AssertionError("get_vendor_profile should be monkeypatched, not hit the DB")


@pytest.mark.asyncio
async def test_owner_profile_update_writes_preferred_contact_columns():
    from app.models.vendor_profile import VendorProfile
    from app.repositories.profile_repository import VendorProfileRepository

    profile = VendorProfile()
    profile.owner_details = {}

    repo = VendorProfileRepository.__new__(VendorProfileRepository)
    repo.db = _FakeAsyncDb()
    repo.get_vendor_profile = lambda user_id: _async_return(profile)

    updated = await repo.update_vendor_profile(
        "EP1", "OWNER",
        {"preferredMethods": ["phone", "email"], "preferredTimes": ["morning"]},
    )

    assert updated.preferred_contact_method == ["phone", "email"]
    assert updated.preferred_contact_time == ["morning"]


@pytest.mark.asyncio
async def test_owner_profile_update_writes_date_of_birth_and_notes_to_owner_details():
    from app.models.vendor_profile import VendorProfile
    from app.repositories.profile_repository import VendorProfileRepository

    profile = VendorProfile()
    profile.owner_details = {}

    repo = VendorProfileRepository.__new__(VendorProfileRepository)
    repo.db = _FakeAsyncDb()
    repo.get_vendor_profile = lambda user_id: _async_return(profile)

    updated = await repo.update_vendor_profile(
        "EP1", "OWNER",
        {"dateOfBirth": "15-06-1985", "additionalNotes": "Call after 6pm"},
    )

    assert updated.owner_details == {"date_of_birth": "15-06-1985", "additional_note": "Call after 6pm"}


async def _async_return(value):
    return value


def test_to_profile_response_flattens_owner_details_for_owner_role():
    from app.services.profile_service import ProfileService

    class _Profile:
        id = 1
        user_id = "EP1"
        full_name = "Jane Owner"
        phone_number = "9999999999"
        whatsapp_number = None
        gender = "female"
        profile_picture = None
        company_logo_url = None
        company_name = None
        address = city = district = state = country = pincode = None
        aadhar_number = "1234"
        pan_number = None
        bank_name = account_holder_name = account_number = ifsc_code = upi_id = None
        website = facebook = instagram = linkedin = youtube = None
        preferred_contact_method = ["phone"]
        preferred_contact_time = ["morning"]
        agency_details = {}
        builder_details = {}
        pm_details = {}
        owner_details = {"date_of_birth": "15-06-1985", "additional_note": "Call after 6pm"}

    service = ProfileService.__new__(ProfileService)
    result = service._to_profile_response(_Profile(), "OWNER")

    assert result["dateOfBirth"] == "15-06-1985"
    assert result["additionalNotes"] == "Call after 6pm"
    assert result["aadhaarNumber"] == "1234"
    assert result["preferredContactMethod"] == ["phone"]


def test_to_profile_response_flattens_agency_details_for_agent_role():
    from app.services.profile_service import ProfileService

    class _Profile:
        id = 1
        user_id = "EP1"
        full_name = "John Agent"
        phone_number = whatsapp_number = gender = None
        profile_picture = company_logo_url = company_name = None
        address = city = district = state = country = pincode = None
        aadhar_number = pan_number = None
        bank_name = account_holder_name = account_number = ifsc_code = upi_id = None
        website = facebook = instagram = linkedin = youtube = None
        preferred_contact_method = preferred_contact_time = None
        agency_details = {"rera_registration_number": "RERA123", "gst_number": "GST456"}
        builder_details = {}
        pm_details = {}
        owner_details = {}

    service = ProfileService.__new__(ProfileService)
    result = service._to_profile_response(_Profile(), "AGENT")

    assert result["reraRegistrationNumber"] == "RERA123"
    assert result["gstNumber"] == "GST456"
