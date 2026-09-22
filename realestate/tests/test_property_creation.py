import pytest

from app.services.field_mapping_service import FieldMappingService
from app.models.property import BaseProperty
from app.repositories.property_repository import PropertyRepository
from app.services.property_service import PropertyService
from app.core.response_utils import strip_none_values

map_frontend_to_db_fields = FieldMappingService().map_frontend_to_db_fields


class DummyRepository:
    db = None

    def __init__(self):
        self.calls = []

    async def create_property(self, posted_by, property_data, user_id=None):
        self.calls.append((posted_by, property_data))

        class PropertyStub:
            id = 1

        return PropertyStub()

    async def get_property_by_id(self, property_id):
        return None

    async def get_property_with_relations(self, property_id):
        return None

    async def delete_property_image_by_order(self, property_id, image_index):
        self.calls.append(("delete_property_image_by_order", property_id, image_index))
        return image_index == 0  # only "index 0 exists" for this fake

    async def set_cover_image(self, property_id, media_id):
        self.calls.append(("set_cover_image", property_id, media_id))
        if media_id != 1:
            return None

        class MediaStub:
            id = media_id
            file_url = "http://example.com/cover.jpg"
            is_primary = True

        return MediaStub()

    async def delete_property_video(self, property_id):
        self.calls.append(("delete_property_video", property_id))

    async def commit(self):
        return None

    async def rollback(self):
        return None


@pytest.mark.asyncio
async def test_create_property_accepts_and_forwards_user_id():
    repo = DummyRepository()
    service = PropertyService(repo)

    await service.create_property(
        posted_by="OWNER",
        property_data={"property_title": "Test Property"},
        separated_files={},
        user_id="EP202608C00001",
    )

    assert repo.calls[0][0] == "OWNER"
    assert repo.calls[0][1]["user_id"] == "EP202608C00001"


def test_sanitize_property_data_keeps_user_and_posted_by_fields():
    repo = PropertyRepository(db=None)

    sanitized = repo._sanitize_property_data(
        {
            "posted_by": "owner",
            "user_id": "EP202608C00001",
            "property_title": "Test Property",
        }
    )

    assert sanitized["posted_by"] == "owner"
    assert sanitized["user_id"] == "EP202608C00001"


def test_base_property_can_be_initialized_from_sanitized_payload():
    repo = PropertyRepository(db=None)

    sanitized = repo._sanitize_property_data(
        {
            "posted_by": "owner",
            "user_id": "EP202608C00001",
            "listing_purpose": "rent",
            "property_category": "apartment",
            "property_title": "Test Property",
        }
    )

    property_obj = BaseProperty(**sanitized)

    assert property_obj.user_id == "EP202608C00001"
    assert property_obj.posted_by == "owner"
    assert property_obj.listing_purpose == "rent"
    assert property_obj.property_category == "apartment"


def test_map_frontend_to_db_fields_keeps_yes_no_values_as_strings():
    mapped = map_frontend_to_db_fields(
        {
            "parking": "Yes",
            "petFriendly": "No",
            "declarationAccepted": True,
        }
    )

    assert mapped["parking"] == "Yes"
    assert mapped["pet_friendly"] == "No"
    assert mapped["declaration_accepted"] is True


def test_map_frontend_to_db_fields_converts_security_deposit_to_number():
    # Numeric coercion now happens in FieldMappingService, not
    # PropertyRepository._sanitize_property_data (which is a pure column
    # whitelist - see test_sanitize_property_data_keeps_user_and_posted_by_fields).
    mapped = map_frontend_to_db_fields({"securityDeposit": "70000"})

    assert mapped["security_deposit"] == 70000


def test_sanitize_property_data_does_not_convert_types():
    repo = PropertyRepository(db=None)

    sanitized = repo._sanitize_property_data(
        {
            "security_deposit": "70000",
        }
    )

    assert sanitized["security_deposit"] == "70000"


@pytest.mark.asyncio
async def test_get_property_raw_delegates_to_light_repository_fetch():
    repo = DummyRepository()
    service = PropertyService(repo)

    result = await service.get_property_raw("PROP-1")

    assert result is None  # DummyRepository.get_property_by_id returns None


@pytest.mark.asyncio
async def test_get_property_with_relations_raw_delegates_to_repository():
    repo = DummyRepository()
    service = PropertyService(repo)

    result = await service.get_property_with_relations_raw("PROP-1")

    assert result is None  # DummyRepository.get_property_with_relations returns None


@pytest.mark.asyncio
async def test_delete_property_image_by_order_delegates_and_commits():
    repo = DummyRepository()
    service = PropertyService(repo)

    deleted = await service.delete_property_image_by_order("PROP-1", 0)

    assert deleted is True
    assert ("delete_property_image_by_order", "PROP-1", 0) in repo.calls


@pytest.mark.asyncio
async def test_set_property_cover_raw_returns_none_when_not_found():
    repo = DummyRepository()
    service = PropertyService(repo)

    result = await service.set_property_cover_raw("PROP-1", media_id=999)

    assert result is None


@pytest.mark.asyncio
async def test_set_property_cover_raw_returns_media_on_success():
    repo = DummyRepository()
    service = PropertyService(repo)

    result = await service.set_property_cover_raw("PROP-1", media_id=1)

    assert result.id == 1
    assert result.is_primary is True


@pytest.mark.asyncio
async def test_delete_property_video_raw_delegates_and_commits():
    repo = DummyRepository()
    service = PropertyService(repo)

    await service.delete_property_video_raw("PROP-1")

    assert ("delete_property_video", "PROP-1") in repo.calls


# ---------------------------------------------------------------------------
# Bug: PropertyRepository.update_vendor_detail's live signature had no
# property_id param, but three callers (vendor profile-image processing
# during create/update, vendor-detail-field processing during create/update,
# and the standalone /vendor/profile-image route) all passed property_id= -
# every one crashed with TypeError. Also: the old update_vendor_profile_image
# route had no property_id at all and blasted every listing's poster photo
# to the same value - fixed to scope by property_id, since a vendor can
# have a different poster photo per listing.
# ---------------------------------------------------------------------------

import inspect


def test_update_vendor_detail_accepts_property_id():
    sig = inspect.signature(PropertyRepository.update_vendor_detail)
    assert "property_id" in sig.parameters


class FakeVendorProfileImageRepository:
    db = None

    def __init__(self, property_obj):
        self._property = property_obj
        self.calls = []

    async def get_property_by_id(self, property_id):
        return self._property if property_id == self._property.id else None

    async def update_vendor_profile_image(self, user_id, db_column, image_url, property_id):
        self.calls.append(("update_vendor_profile_image", user_id, db_column, image_url, property_id))

    async def update_vendor_detail(self, user_id, posted_by, update_data, property_id=None):
        self.calls.append(("update_vendor_detail", user_id, posted_by, update_data, property_id))

    async def get_vendor_detail_for_property(self, property_id, posted_by, user_id):
        self.calls.append(("get_vendor_detail_for_property", property_id, posted_by, user_id))

        class DetailStub:
            profile_photo_url = "http://example.com/old.jpg"

        return DetailStub()

    async def commit(self):
        return None

    async def rollback(self):
        return None


class FakeVendorImageFileService:
    def __init__(self):
        self.deleted_urls = []

    async def upload_vendor_profile_image(self, file, user_id, field_name):
        return {"file_url": "http://example.com/new.jpg"}

    async def delete_files(self, urls):
        self.deleted_urls.extend(urls)


class PropertyStub:
    def __init__(self, id, user_id, posted_by):
        self.id = id
        self.user_id = user_id
        self.posted_by = posted_by


@pytest.mark.asyncio
async def test_update_vendor_profile_image_is_scoped_to_one_property():
    prop = PropertyStub(id="PROP-1", user_id="EP1", posted_by="OWNER")
    repo = FakeVendorProfileImageRepository(prop)
    service = PropertyService(repo, file_service=FakeVendorImageFileService())

    await service.update_vendor_profile_image(
        user_id="EP1", property_id="PROP-1", image=object(), field_name="profilePhoto"
    )

    image_call = next(c for c in repo.calls if c[0] == "update_vendor_profile_image")
    assert image_call[1:] == ("EP1", "profile_photo_url", "http://example.com/new.jpg", "PROP-1")

    detail_call = next(c for c in repo.calls if c[0] == "update_vendor_detail")
    assert detail_call[1:] == ("EP1", "OWNER", {"profile_photo_url": "http://example.com/new.jpg"}, "PROP-1")


@pytest.mark.asyncio
async def test_update_vendor_profile_image_rejects_someone_elses_property():
    from app.schemas.property_error import PropertyPermissionError

    prop = PropertyStub(id="PROP-1", user_id="OTHER_USER", posted_by="OWNER")
    repo = FakeVendorProfileImageRepository(prop)
    service = PropertyService(repo, file_service=FakeVendorImageFileService())

    with pytest.raises(PropertyPermissionError):
        await service.update_vendor_profile_image(
            user_id="EP1", property_id="PROP-1", image=object(), field_name="profilePhoto"
        )


@pytest.mark.asyncio
async def test_delete_vendor_profile_image_deletes_storage_and_clears_this_property_only():
    prop = PropertyStub(id="PROP-1", user_id="EP1", posted_by="OWNER")
    repo = FakeVendorProfileImageRepository(prop)
    file_service = FakeVendorImageFileService()
    service = PropertyService(repo, file_service=file_service)

    await service.delete_vendor_profile_image(user_id="EP1", property_id="PROP-1", field_name="profilePhoto")

    assert file_service.deleted_urls == ["http://example.com/old.jpg"]
    image_call = next(c for c in repo.calls if c[0] == "update_vendor_profile_image")
    assert image_call[1:] == ("EP1", "profile_photo_url", None, "PROP-1")


class _FakeDocument:
    def __init__(self, doc_id=1, user_id="EP1", property_id="PROP-1", file_url="documents/EP1/PROP-1/documents/x.pdf"):
        self.id = doc_id
        self.user_id = user_id
        self.property_id = property_id
        self.file_url = file_url


class _FakeDocumentRepository:
    def __init__(self, document=None):
        self._document = document

    async def get_document_by_id(self, document_id):
        return self._document


class _FakePrivateStorage:
    def __init__(self):
        self.calls = []

    async def generate_signed_url(self, file_url, expiration=3600):
        self.calls.append((file_url, expiration))
        return f"https://signed.example.com/{file_url}?exp={expiration}"


class _FakeFileServiceForViewUrl:
    def __init__(self):
        self.private_storage = _FakePrivateStorage()


@pytest.mark.asyncio
async def test_get_document_view_url_allows_owner():
    doc = _FakeDocument(user_id="EP1")
    service = PropertyService(_FakeDocumentRepository(doc), file_service=_FakeFileServiceForViewUrl())

    url = await service.get_document_view_url(doc.id, {"user_id": "EP1", "role": "vendor"})

    assert url.startswith("https://signed.example.com/")
    assert service.file_service.private_storage.calls == [(doc.file_url, 600)]


@pytest.mark.asyncio
async def test_get_document_view_url_allows_admin_for_someone_elses_document():
    doc = _FakeDocument(user_id="EP1")
    service = PropertyService(_FakeDocumentRepository(doc), file_service=_FakeFileServiceForViewUrl())

    url = await service.get_document_view_url(doc.id, {"user_id": "ADMIN1", "role": "admin"})

    assert url.startswith("https://signed.example.com/")


@pytest.mark.asyncio
async def test_get_document_view_url_rejects_non_owner_non_admin():
    from app.schemas.property_error import PropertyError

    doc = _FakeDocument(user_id="EP1")
    service = PropertyService(_FakeDocumentRepository(doc), file_service=_FakeFileServiceForViewUrl())

    with pytest.raises(PropertyError) as exc_info:
        await service.get_document_view_url(doc.id, {"user_id": "EP2", "role": "vendor"})
    assert exc_info.value.status_code == 403
    assert service.file_service.private_storage.calls == []


@pytest.mark.asyncio
async def test_get_document_view_url_404_for_missing_document():
    from app.schemas.property_error import PropertyError

    service = PropertyService(_FakeDocumentRepository(None), file_service=_FakeFileServiceForViewUrl())

    with pytest.raises(PropertyError) as exc_info:
        await service.get_document_view_url(999, {"user_id": "EP1", "role": "vendor"})
    assert exc_info.value.status_code == 404


def test_file_service_splits_public_and_private_storage_instances():
    from app.services.file_service import FileService
    from app.core.storage_factory import StorageFactory

    StorageFactory.reset()
    try:
        fs = FileService()
        assert fs.public_storage is not None
        assert fs.private_storage is not None
    finally:
        StorageFactory.reset()


def test_strip_none_values_removes_null_fields_from_payloads():
    payload = {
        "name": "Demo",
        "description": None,
        "items": [
            {"title": "One", "value": None},
            {"title": "Two", "value": "ok"},
        ],
    }

    cleaned = strip_none_values(payload)

    assert cleaned == {
        "name": "Demo",
        "items": [
            {"title": "One"},
            {"title": "Two", "value": "ok"},
        ],
    }
