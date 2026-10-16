from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship
from app.core.database import Base


class PropertyContactPerson(Base):
    """Replaces owner_properties/agent_properties/builder_properties/
    property_management_properties with one table, discriminated by
    vendor_type. Fields every role shares (or that are simple typed
    scalars) stay flat columns; fields that are optional-per-role and never
    queried into individually (bank details, social links, the
    company/RERA/GST/experience/preferred-contact cluster) live in grouped
    JSONB blobs - see contact_person_dto.py for the per-role required-field
    validation that used to live as ad-hoc checks in service methods.
    """
    __tablename__ = "property_contact_persons"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, unique=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    # Values match app.schemas.property_enums.PostedBy exactly (OWNER/AGENT/
    # BUILDER/PROPERTY_MANAGEMENT) - same plain-String-not-native-enum
    # convention as BaseProperty.posted_by.
    vendor_type = Column(String(50), nullable=False, index=True)

    # Shared identity / contact
    name = Column(String(255), nullable=True)
    designation = Column(String(200), nullable=True)  # Builder/PM only
    date_of_birth = Column(Date, nullable=True)  # Owner/Agent only
    gender = Column(String(50), nullable=True)  # Owner/Agent only
    aadhaar_number = Column(String(50), nullable=True)
    pan_number = Column(String(20), nullable=True)  # not Agent
    mobile = Column(String(30), nullable=True)
    whatsapp_number = Column(String(30), nullable=True)  # Builder/PM only
    email = Column(String(255), nullable=True)

    # Address
    address_line1 = Column(Text, nullable=True)  # Owner/Agent only
    address_line2 = Column(Text, nullable=True)  # Owner/Agent only
    office_address = Column(Text, nullable=True)  # Agent/Builder/PM only
    city = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    state = Column(String(200), nullable=True)
    pincode = Column(String(20), nullable=True)
    landmark = Column(String(200), nullable=True)  # Builder/PM only

    # Declaration
    signature = Column(Text, nullable=True)
    signature_date = Column(Date, nullable=True)
    signature_place = Column(String(255), nullable=True)
    declaration_accepted = Column(Boolean, nullable=False, default=False)

    # Grouped, optional-per-role, never-filtered-on concern blobs.
    # MutableDict.as_mutable wraps these so an in-place mutation like
    # `row.bank_details['bankName'] = x` is tracked and flushed - a plain
    # JSONB column would silently miss that (SQLAlchemy only sees dict
    # identity, not content, change) unless the whole dict is reassigned.
    # Same pattern VendorProfile already uses for its own role-extra blobs
    # (app/models/vendor_profile.py).
    # bank_details: {bankName, accountHolderName, accountNumber, ifscCode, upiId} - all 4 roles.
    bank_details = Column(MutableDict.as_mutable(JSONB), nullable=False, default=dict)
    # social_links: {website, facebook, instagram, linkedin, youtube} - Agent/Builder/PM only.
    social_links = Column(MutableDict.as_mutable(JSONB), nullable=False, default=dict)
    # role_details shape depends on vendor_type - see contact_person_dto.py:
    #   OWNER: {preferredContactMethod, preferredContactTime, additionalNote}
    #   AGENT: {companyName, reraRegistrationNumber, gstNumber, experience, activeListing, serviceArea}
    #   BUILDER / PROPERTY_MANAGEMENT: {companyName, companyRegNumber, companyWebsite,
    #     companyDescription, reraRegistrationNumber, gstNumber, experience, serviceArea}
    role_details = Column(MutableDict.as_mutable(JSONB), nullable=False, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    property = relationship("BaseProperty", back_populates="contact_person")


# Routes every legacy per-role field name (from the 4 old tables' vocabulary,
# both the create-path's and the edit-path's slightly different spellings -
# e.g. 'owner_name'/'agent_name'/'name' all mean the same thing; Builder/PM's
# edit path already translates 'vendor_city' -> 'city' upstream, but the
# create path still passes the untranslated 'vendor_city' key, so both are
# listed here) onto this table's flat columns or one of its 3 JSONB blobs.
# One table replacing four, but callers that already speak the old
# vocabulary don't all need rewriting at once.
CONTACT_FIELD_ROUTES = {
    # identity / contact -> flat columns
    'owner_name': ('flat', 'name'), 
    'agent_name': ('flat', 'name'), 
    'name': ('flat', 'name'),
    'designation': ('flat', 'designation'),
    'date_of_birth': ('flat', 'date_of_birth'),
    'gender': ('flat', 'gender'),
    'aadhaar_number': ('flat', 'aadhaar_number'),
    'pan_number': ('flat', 'pan_number'),
    'mobile': ('flat', 'mobile'),
    'whatsapp_number': ('flat', 'whatsapp_number'),
    'email_id': ('flat', 'email'), 'email': ('flat', 'email'),
    'address_line1': ('flat', 'address_line1'),
    'address_line2': ('flat', 'address_line2'),
    'office_address': ('flat', 'office_address'),
    'city': ('flat', 'city'), 'vendor_city': ('flat', 'city'), 'owner_city': ('flat', 'city'),
    'district': ('flat', 'district'), 'vendor_district': ('flat', 'district'), 'owner_district': ('flat', 'district'),
    'state': ('flat', 'state'), 'vendor_state': ('flat', 'state'), 'owner_state': ('flat', 'state'),
    'pincode': ('flat', 'pincode'), 'vendor_pincode': ('flat', 'pincode'), 'owner_pin_code': ('flat', 'pincode'),
    'landmark': ('flat', 'landmark'), 'vendor_landmark': ('flat', 'landmark'),
    'signature': ('flat', 'signature'),
    'signature_date': ('flat', 'signature_date'),
    'signature_place': ('flat', 'signature_place'),
    'declaration_accepted': ('flat', 'declaration_accepted'),

    # bank_details JSONB
    'bank_name': ('bank', 'bankName'),
    'account_holder_name': ('bank', 'accountHolderName'),
    'account_number': ('bank', 'accountNumber'),
    'ifsc_code': ('bank', 'ifscCode'),
    'upi_id': ('bank', 'upiId'),

    # social_links JSONB
    'website': ('social', 'website'),
    'facebook': ('social', 'facebook'),
    'instagram': ('social', 'instagram'),
    'linkedin': ('social', 'linkedin'),
    'youtube': ('social', 'youtube'),

    # role_details JSONB - shape depends on vendor_type, but the key names
    # never collide across roles so one routing table still works for all.
    'agency_name': ('role', 'companyName'), 'company_name': ('role', 'companyName'),
    'rera_registration_number': ('role', 'reraRegistrationNumber'),
    'gst_number': ('role', 'gstNumber'),
    'experience': ('role', 'experience'),
    'active_listing': ('role', 'activeListing'),
    'service_area': ('role', 'serviceArea'),
    'company_reg_number': ('role', 'companyRegNumber'),
    'company_website': ('role', 'companyWebsite'),
    'company_description': ('role', 'companyDescription'),
    'preferred_contact_method': ('role', 'preferredContactMethod'),
    'preferred_contact_time': ('role', 'preferredContactTime'),
    'additionalnote': ('role', 'additionalNote'),
}

_BLOB_ATTR = {'bank': 'bank_details', 'social': 'social_links', 'role': 'role_details'}


def apply_contact_fields(obj: "PropertyContactPerson", data: dict) -> None:
    """Routes a flat legacy-vocabulary dict (e.g. property_data or
    vendor_data, as built by property_repository.py / property_service.py)
    onto obj's flat columns and grouped JSONB blobs. Unknown keys and None
    values are skipped - same behaviour as the old per-table
    hasattr-gated setattr loop."""
    for key, value in data.items():
        if value is None:
            continue
        route = CONTACT_FIELD_ROUTES.get(key)
        if not route:
            continue
        bucket, target = route
        if bucket == 'flat':
            setattr(obj, target, value)
            continue
        blob_attr = _BLOB_ATTR[bucket]
        blob = getattr(obj, blob_attr) or {}
        if target == 'preferredContactTime' and not isinstance(value, list):
            value = [value]
        blob[target] = value
        setattr(obj, blob_attr, blob)  # reassign so a freshly-built {} (not yet flushed) is tracked too
