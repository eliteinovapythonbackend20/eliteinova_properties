# app/core/document_catalog.py
#
# Canonical document keys and their ownership level.
#
# Pipeline:
#   raw key (frontend field, legacy DB value)
#     -> resolve_document_key()      canonical key
#     -> DOCUMENT_CATALOG[key]       ownership level
#     -> user_documents / property_documents row -> file_assets
#
# Nothing here touches storage. The catalog only classifies.

from enum import Enum
from typing import Dict, Optional

from app.core.file_mappings import DOC_TYPE_MAPPING


class DocumentLevel(str, Enum):
    USER_DOCUMENT = "USER_DOCUMENT"
    USER_MEDIA = "USER_MEDIA"
    PROPERTY_DOCUMENT = "PROPERTY_DOCUMENT"
    PROPERTY_MEDIA = "PROPERTY_MEDIA"
    LOAN_DOCUMENT = "LOAN_DOCUMENT"
    LOAN_PARTNER_DOCUMENT = "LOAN_PARTNER_DOCUMENT"
    INSURANCE_DOCUMENT = "INSURANCE_DOCUMENT"
    INSURANCE_PARTNER_DOCUMENT = "INSURANCE_PARTNER_DOCUMENT"


# Stored when a raw value cannot be classified. The raw value is kept in
# legacy_document_type, so nothing is lost; the key just marks the row for review.
UNCLASSIFIED = "unclassified"

_CATALOG_SPEC: Dict[DocumentLevel, tuple] = {
    DocumentLevel.USER_DOCUMENT: (
        "id_card", "aadhaar_card", "pan_card", "address_proof", "office_address_proof",
        "gst_certificate", "company_pan_card", "company_registration", "cin_llpin",
        "authorized_signatory_id", "authorization_letter", "trade_license",
        "rera_registration_certificate", "business_registration_certificate",
        # Not in the locked list. Kept as a user-level company document and
        # flagged for confirmation in the Phase 1 report.
        "company_profile_brochure",
    ),
    DocumentLevel.USER_MEDIA: (
        "profile_photo", "company_logo", "agency_logo", "business_logo", "company_profile_image",
    ),
    DocumentLevel.PROPERTY_DOCUMENT: (
        "floor_plan", "sale_deed", "property_tax_receipt", "rental_agreement", "lease_agreement",
        "sale_agreement", "ownership_document", "encumbrance_certificate", "occupancy_certificate",
        "completion_certificate", "building_approval_plan", "fire_safety_certificate",
        "health_certificate", "patta_chitta", "hostel_license", "project_rera_certificate",
        "project_brochure", "property_supporting_documents", "other_property_documents",
    ),
    DocumentLevel.PROPERTY_MEDIA: (
        "cover_image", "property_images", "property_video", "project_images", "project_video",
    ),
    DocumentLevel.LOAN_DOCUMENT: (
        "bank_statement", "audited_financials", "itr_documents", "bank_authorization",
        "company_authorization_letter", "loan_application_document", "loan_supporting_documents",
        "loan_sanction_letter", "loan_agreement", "valuation_report", "other_loan_documents",
    ),
    DocumentLevel.LOAN_PARTNER_DOCUMENT: (
        "dsa_id_proof", "bank_employee_id_card", "representative_id_proof",
        "representative_employee_id_card", "bank_authorization_document",
        "partner_authorization_letter", "partner_company_registration",
    ),
    DocumentLevel.INSURANCE_DOCUMENT: (
        "insurance_application_document", "insurance_authorization", "insurance_policy",
        "inspection_report", "claim_document", "cancelled_cheque",
        "insurance_supporting_documents", "other_insurance_documents",
    ),
    DocumentLevel.INSURANCE_PARTNER_DOCUMENT: (
        "insurance_agent_id", "insurance_agent_license", "insurance_employee_id_card",
        "insurance_representative_id", "insurance_partner_authorization",
        "insurance_agency_authorization",
        # The locked spec lists this under both INSURANCE_DOCUMENT and
        # INSURANCE_PARTNER_DOCUMENT. A key can have one level, so it sits here
        # (partner appointment). Flagged in the Phase 1 report.
        "company_appointment_letter",
        "other_partner_documents",
    ),
}

DOCUMENT_CATALOG: Dict[str, Optional[DocumentLevel]] = {
    key: level for level, keys in _CATALOG_SPEC.items() for key in keys
}
DOCUMENT_CATALOG[UNCLASSIFIED] = None

# Legacy values (already stored in property_documents.document_type) and the
# frontend's own snake_case variants that map straight onto a canonical key.
LEGACY_ALIASES: Dict[str, str] = {
    "aadhaar_card": "aadhaar_card",
    "pan_card": "pan_card",
    "gst_certificate": "gst_certificate",
    "trade_license": "trade_license",
    "business_registration_certificate": "business_registration_certificate",
    "company_pan_card": "company_pan_card",
    "company_registration_certificate": "company_registration",
    "company_address_proof": "office_address_proof",
    "authorized_signatory_id_proof": "authorized_signatory_id",
    "id_proof": "id_card",
    "company_profile_brochure": "company_profile_brochure",
    "projectBrochures": "project_brochure",
    "project_brochure": "project_brochure",
    "sale_deed": "sale_deed",
    "patta_chitta": "patta_chitta",
    "property_tax_receipt": "property_tax_receipt",
    "encumbrance_certificate": "encumbrance_certificate",
    "occupancy_certificate": "occupancy_certificate",
    "completion_certificate": "completion_certificate",
    "building_approval_plan": "building_approval_plan",
    "floor_plan": "floor_plan",
    "rental_agreement": "rental_agreement",
    "lease_agreement": "lease_agreement",
    "sale_agreement": "sale_agreement",
    "ownership_document": "ownership_document",
    "fire_safety_certificate": "fire_safety_certificate",
    "health_certificate": "health_certificate",
    "hostel_license": "hostel_license",
}

# RERA is the one key whose meaning depends on context. The stored value does
# not say whether it is the business registration or a project registration, so
# the owning scope decides: attached to a property means project RERA,
# otherwise the user's RERA registration.
_RERA_KEYS = {"rera_certificate", "reraCertificate"}  # legacy value + its frontend field name

# The generic "other" value is only classifiable as a property document. A
# user-level row with this value cannot be placed, so it is flagged.
_OTHER_KEYS = {"other_supporting_document"}

# Confirmed: additionalDocs is a property document. It has no user-level meaning, so
# it is only classified when a property is known; otherwise it stays unclassified.
_PROPERTY_ONLY_KEYS = {"additionalDocs": "property_supporting_documents"}

def resolve_document_key(raw: Optional[str], *, property_scoped: bool) -> str:
    """Return the canonical key for a raw key or legacy value.

    `property_scoped` is True when the row belongs to a property, False when it
    belongs to a user. Unresolvable input returns UNCLASSIFIED so the caller can
    keep the raw value and flag the row. It never guesses a level.
    """
    if not raw:
        return UNCLASSIFIED
    if DOCUMENT_CATALOG.get(raw) is not None:
        return raw
    if raw in _RERA_KEYS or raw.lower().endswith("rera"):
        return "project_rera_certificate" if property_scoped else "rera_registration_certificate"
    if raw in _OTHER_KEYS:
        return "property_supporting_documents" if property_scoped else UNCLASSIFIED
    if raw in _PROPERTY_ONLY_KEYS:
        return _PROPERTY_ONLY_KEYS[raw] if property_scoped else UNCLASSIFIED
    # profilePhoto/agencyLogo/companyLogo never reach here: the create/update-property
    # controller extracts them into dedicated multipart parts before this runs, and they go
    # straight to contact_person_media_service - never PropertyDocument, never this catalog.
    # Frontend field names first go through DOC_TYPE_MAPPING (aadhaarCardDoc -> aadhaar_card).
    snake = DOC_TYPE_MAPPING.get(raw)
    if snake and snake != raw:
        return resolve_document_key(snake, property_scoped=property_scoped)
    return LEGACY_ALIASES.get(raw, UNCLASSIFIED)


def level_for(key: str) -> Optional[DocumentLevel]:
    return DOCUMENT_CATALOG.get(key)


_ACRONYMS = {"pan", "gst", "rera", "id", "cin", "llpin", "itr", "ec"}


def document_label(key: str) -> str:
    """Readable name for a canonical key, e.g. pan_card -> 'PAN Card'. Used in activity messages."""
    words = (key or "").replace("-", "_").split("_")
    return " ".join(w.upper() if w.lower() in _ACRONYMS else w.capitalize() for w in words if w)
