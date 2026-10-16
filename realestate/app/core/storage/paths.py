# app/core/storage/paths.py
#
# Object keys by ownership context. The key says where a file belongs; the
# document type inside it says what the file is. The same type (e.g. aadhaar)
# gets a different key depending on whose document it is.
#
#   PUBLIC bucket   users/{uid}/media/{type}/...      properties/{pid}/media/{type}/...
#                   properties/{pid}/contact-person/media/{type}/...
#   PRIVATE bucket  users/{uid}/documents/{type}/...  properties/{pid}/documents/{type}/...
#                   properties/{pid}/contact-person/documents/{type}/...
#
# Keys are built here only. Storage providers receive the key and never decide it.
# Existing objects keep the URL they were stored under; only new uploads use these.

import uuid
from typing import Optional

# Identity documents that the property form submits for a contact person. The
# canonical keys from app.core.document_catalog. They are never the uploader's own.
CONTACT_IDENTITY_KEYS = frozenset({"aadhaar_card", "pan_card", "id_card", "address_proof"})


def _unique(extension: str = "pdf") -> str:
    return f"{uuid.uuid4().hex}.{extension}"


def user_document_key(user_id: str, document_type: str, extension: str = "pdf") -> str:
    return f"users/{user_id}/documents/{document_type}/{_unique(extension)}"


def property_document_key(property_id: str, document_type: str, extension: str = "pdf") -> str:
    return f"properties/{property_id}/documents/{document_type}/{_unique(extension)}"


def contact_person_document_key(property_id: str, document_type: str, extension: str = "pdf") -> str:
    return f"properties/{property_id}/contact-person/documents/{document_type}/{_unique(extension)}"


def user_media_key(user_id: str, media_type: str, extension: str) -> str:
    return f"users/{user_id}/media/{media_type}/{_unique(extension)}"


def property_media_key(property_id: str, media_type: str, extension: str) -> str:
    return f"properties/{property_id}/media/{media_type}/{_unique(extension)}"


def contact_person_media_key(property_id: str, media_type: str, extension: str) -> str:
    """A contact person's media for this property - public, like any other
    media, but linked to property_id through the database, never inferred
    from this path."""
    return f"properties/{property_id}/contact-person/media/{media_type}/{_unique(extension)}"


def is_contact_identity(canonical_key: Optional[str]) -> bool:
    return canonical_key in CONTACT_IDENTITY_KEYS
