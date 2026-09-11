from app.models.property import BaseProperty as Property
from app.models.property_owner import OwnerProperty as PropertyOwnerDetails
from app.models.property_agent import PropertyAgentDetails
from app.models.property_builder import PropertyBuilderDetails
from app.models.property_pm import PropertyManagementProperty
from app.models.property_media import PropertyMedia
from app.models.property_document import PropertyDocument


__all__ = [
    "BaseProperty",
    "PropertyMedia",
    "PropertyDocument",
    "OwnerProperty",
    "PropertyAgentDetails",
    "PropertyBuilderDetails",
    "PropertyManagementProperty",
]