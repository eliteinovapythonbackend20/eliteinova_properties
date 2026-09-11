import pytest

from app.api.property_controller import map_frontend_to_db_fields
from app.models.property import BaseProperty
from app.repositories.property_repository import PropertyRepository
from app.services.property_service import PropertyService
from app.core.response_utils import strip_none_values


class DummyRepository:
    def __init__(self):
        self.calls = []

    async def create_property(self, posted_by, property_data):
        self.calls.append((posted_by, property_data))

        class PropertyStub:
            id = 1

        return PropertyStub()

    async def get_property_with_relations(self, property_id):
        return None

    async def rollback(self):
        return None


@pytest.mark.asyncio
async def test_create_property_accepts_and_forwards_user_id():
    repo = DummyRepository()
    service = PropertyService(repo)

    await service.create_property(
        posted_by="owner",
        property_data={"property_title": "Test Property"},
        user_id="EP202608C00001",
    )

    assert repo.calls[0][0] == "owner"
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


def test_sanitize_property_data_converts_security_deposit_to_number():
    repo = PropertyRepository(db=None)

    sanitized = repo._sanitize_property_data(
        {
            "security_deposit": "70000",
        }
    )

    assert sanitized["security_deposit"] == 70000


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
