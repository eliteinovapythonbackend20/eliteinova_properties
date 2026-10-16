import unittest

from app.models.property import BaseProperty
from app.repositories.property_repository import PropertyRepository


class PropertyRelationshipTests(unittest.TestCase):
    def test_property_model_exposes_media_and_detail_relationships(self):
        self.assertTrue(hasattr(BaseProperty, "media"))
        self.assertTrue(hasattr(BaseProperty, "documents"))
        # owner_details/agent_details/builder_details/property_management_details
        # (4 separate tables) were replaced by one property_contact_persons
        # table, discriminated by vendor_type - see app.models.property_contact.
        self.assertTrue(hasattr(BaseProperty, "contact_person"))

    def test_property_data_is_sanitized_before_model_creation(self):
        repo = PropertyRepository.__new__(PropertyRepository)
        property_data = {
            "posted_by": "owner",
            "listing_purpose": "rent",
            "property_category": "individual",
            "property_title": "Test property",
            "owner_name": "Jane Doe",
            "preferred_contact_method": ["sms"],
        }

        sanitized = repo._sanitize_property_data(property_data)

        self.assertEqual(sanitized["property_title"], "Test property")
        self.assertNotIn("owner_name", sanitized)
        self.assertNotIn("preferred_contact_method", sanitized)


if __name__ == "__main__":
    unittest.main()
