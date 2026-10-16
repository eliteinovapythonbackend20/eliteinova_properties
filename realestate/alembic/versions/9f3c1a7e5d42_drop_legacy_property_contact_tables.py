"""drop owner_properties/agent_properties/builder_properties/
property_management_properties - fully replaced by property_contact_persons
(682b92df1795), which every live read/write path has been using since the
cutover in app.repositories.property_repository /
app.repositories.admin_dashboard_repository / app.core.response_utils.

Preceded by tools/backfill_property_contact_persons.py, run and verified
(99/99 rows backfilled, 0 drift re-checked immediately before this
migration) - nothing in these 4 tables is not already in property_contact_persons.

downgrade() recreates the 4 tables' SCHEMA exactly (so a rollback doesn't
leave the ORM models pointing at nonexistent tables), but CANNOT restore
their DATA - a DROP is not reversible that way. If this needs to be undone
with data intact, restore from a DB backup/snapshot taken before this
migration instead of relying on downgrade().

Revision ID: 9f3c1a7e5d42
Revises: 682b92df1795
Create Date: 2026-10-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9f3c1a7e5d42'
down_revision: Union[str, None] = '682b92df1795'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('owner_properties')
    op.drop_table('agent_properties')
    op.drop_table('builder_properties')
    op.drop_table('property_management_properties')


def downgrade() -> None:
    """Recreates schema only - see module docstring. Restore from a DB
    backup taken before this migration if the data itself is needed back."""
    op.create_table(
        'owner_properties',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('owner_name', sa.String(length=255), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(length=50), nullable=True),
        sa.Column('aadhaar_number', sa.String(length=50), nullable=True),
        sa.Column('pan_number', sa.String(length=50), nullable=True),
        sa.Column('mobile', sa.String(length=20), nullable=True),
        sa.Column('email_id', sa.String(length=255), nullable=True),
        sa.Column('address_line1', sa.Text(), nullable=True),
        sa.Column('address_line2', sa.Text(), nullable=True),
        sa.Column('owner_city', sa.String(length=100), nullable=True),
        sa.Column('owner_district', sa.String(length=100), nullable=True),
        sa.Column('owner_state', sa.String(length=100), nullable=True),
        sa.Column('owner_pin_code', sa.String(length=20), nullable=True),
        sa.Column('preferred_contact_method', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('preferred_contact_time', sa.String(length=100), nullable=True),
        sa.Column('bank_name', sa.String(length=255), nullable=True),
        sa.Column('account_holder_name', sa.String(length=255), nullable=True),
        sa.Column('account_number', sa.String(length=50), nullable=True),
        sa.Column('ifsc_code', sa.String(length=50), nullable=True),
        sa.Column('upi_id', sa.String(length=255), nullable=True),
        sa.Column('signature', sa.Text(), nullable=True),
        sa.Column('signature_date', sa.Date(), nullable=True),
        sa.Column('signature_place', sa.String(length=255), nullable=True),
        sa.Column('declaration_accepted', sa.Boolean(), nullable=True),
        sa.Column('additionalnote', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_owner_properties_id', 'owner_properties', ['id'])
    op.create_index('ix_owner_properties_user_id', 'owner_properties', ['user_id'])

    op.create_table(
        'agent_properties',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('agent_name', sa.String(length=255), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(length=50), nullable=True),
        sa.Column('mobile', sa.String(length=20), nullable=True),
        sa.Column('email_id', sa.String(length=255), nullable=True),
        sa.Column('office_address', sa.Text(), nullable=True),
        sa.Column('address_line1', sa.Text(), nullable=True),
        sa.Column('address_line2', sa.Text(), nullable=True),
        sa.Column('agency_name', sa.String(length=255), nullable=True),
        sa.Column('rera_registration_number', sa.String(length=255), nullable=True),
        sa.Column('gst_number', sa.String(length=50), nullable=True),
        sa.Column('experience', sa.Integer(), nullable=True),
        sa.Column('active_listing', sa.Integer(), nullable=True),
        sa.Column('service_area', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('aadhaar_number', sa.String(length=20), nullable=True),
        sa.Column('website', sa.Text(), nullable=True),
        sa.Column('facebook', sa.Text(), nullable=True),
        sa.Column('instagram', sa.Text(), nullable=True),
        sa.Column('linkedin', sa.Text(), nullable=True),
        sa.Column('youtube', sa.Text(), nullable=True),
        sa.Column('bank_name', sa.String(length=255), nullable=True),
        sa.Column('account_holder_name', sa.String(length=255), nullable=True),
        sa.Column('account_number', sa.String(length=50), nullable=True),
        sa.Column('ifsc_code', sa.String(length=50), nullable=True),
        sa.Column('upi_id', sa.String(length=255), nullable=True),
        sa.Column('signature', sa.Text(), nullable=True),
        sa.Column('signature_date', sa.Date(), nullable=True),
        sa.Column('signature_place', sa.String(length=255), nullable=True),
        sa.Column('declaration_accepted', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_agent_properties_id', 'agent_properties', ['id'])
    op.create_index('ix_agent_properties_user_id', 'agent_properties', ['user_id'])

    op.create_table(
        'builder_properties',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('designation', sa.String(length=200), nullable=False),
        sa.Column('mobile', sa.String(length=30), nullable=False),
        sa.Column('whatsapp_number', sa.String(length=30), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('rera_registration_number', sa.String(length=50), nullable=False),
        sa.Column('gst_number', sa.String(length=50), nullable=True),
        sa.Column('experience', sa.Integer(), nullable=True),
        sa.Column('aadhaar_number', sa.String(length=20), nullable=False),
        sa.Column('pan_number', sa.String(length=20), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('company_reg_number', sa.String(length=100), nullable=False),
        sa.Column('company_website', sa.Text(), nullable=True),
        sa.Column('company_description', sa.Text(), nullable=True),
        sa.Column('service_area', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('office_address', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=200), nullable=False),
        sa.Column('district', sa.String(length=200), nullable=False),
        sa.Column('state', sa.String(length=200), nullable=False),
        sa.Column('pincode', sa.String(length=20), nullable=False),
        sa.Column('landmark', sa.String(length=200), nullable=False),
        sa.Column('website', sa.Text(), nullable=True),
        sa.Column('facebook', sa.Text(), nullable=True),
        sa.Column('instagram', sa.Text(), nullable=True),
        sa.Column('linkedin', sa.Text(), nullable=True),
        sa.Column('youtube', sa.Text(), nullable=True),
        sa.Column('bank_name', sa.String(length=255), nullable=True),
        sa.Column('account_holder_name', sa.String(length=255), nullable=True),
        sa.Column('account_number', sa.String(length=50), nullable=True),
        sa.Column('ifsc_code', sa.String(length=50), nullable=True),
        sa.Column('upi_id', sa.String(length=255), nullable=True),
        sa.Column('signature', sa.Text(), nullable=True),
        sa.Column('signature_date', sa.Date(), nullable=True),
        sa.Column('signature_place', sa.String(length=255), nullable=True),
        sa.Column('declaration_accepted', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_builder_properties_id', 'builder_properties', ['id'])
    op.create_index('ix_builder_properties_user_id', 'builder_properties', ['user_id'])

    op.create_table(
        'property_management_properties',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('designation', sa.String(length=200), nullable=False),
        sa.Column('mobile', sa.String(length=30), nullable=False),
        sa.Column('whatsapp_number', sa.String(length=30), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('company_reg_number', sa.String(length=100), nullable=False),
        sa.Column('company_website', sa.Text(), nullable=True),
        sa.Column('company_description', sa.Text(), nullable=True),
        sa.Column('rera_registration_number', sa.String(length=50), nullable=False),
        sa.Column('gst_number', sa.String(length=50), nullable=True),
        sa.Column('experience', sa.Integer(), nullable=True),
        sa.Column('aadhaar_number', sa.String(length=20), nullable=False),
        sa.Column('pan_number', sa.String(length=20), nullable=False),
        sa.Column('office_address', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=200), nullable=False),
        sa.Column('district', sa.String(length=200), nullable=False),
        sa.Column('state', sa.String(length=200), nullable=False),
        sa.Column('pincode', sa.String(length=20), nullable=False),
        sa.Column('landmark', sa.String(length=200), nullable=False),
        sa.Column('service_area', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('website', sa.Text(), nullable=True),
        sa.Column('facebook', sa.Text(), nullable=True),
        sa.Column('instagram', sa.Text(), nullable=True),
        sa.Column('linkedin', sa.Text(), nullable=True),
        sa.Column('youtube', sa.Text(), nullable=True),
        sa.Column('bank_name', sa.String(length=255), nullable=True),
        sa.Column('account_holder_name', sa.String(length=255), nullable=True),
        sa.Column('account_number', sa.String(length=50), nullable=True),
        sa.Column('ifsc_code', sa.String(length=50), nullable=True),
        sa.Column('upi_id', sa.String(length=255), nullable=True),
        sa.Column('signature', sa.Text(), nullable=True),
        sa.Column('signature_date', sa.Date(), nullable=True),
        sa.Column('signature_place', sa.String(length=255), nullable=True),
        sa.Column('declaration_accepted', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_property_management_properties_id', 'property_management_properties', ['id'])
    op.create_index('ix_property_management_properties_user_id', 'property_management_properties', ['user_id'])
