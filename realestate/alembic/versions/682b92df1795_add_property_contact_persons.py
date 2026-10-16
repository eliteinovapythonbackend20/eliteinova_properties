"""add property_contact_persons (unified replacement for owner_properties/
agent_properties/builder_properties/property_management_properties)

Additive only: creates the new table, nothing else. The 4 existing
role-specific tables are untouched and still the live source of truth -
backfill, read/write cutover, and eventually dropping them are separate,
later migrations once the new table has been verified.

Revision ID: 682b92df1795
Revises: a7e2c9d4f5b1
Create Date: 2026-10-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '682b92df1795'
down_revision: Union[str, None] = 'a7e2c9d4f5b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'property_contact_persons',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('vendor_type', sa.String(length=50), nullable=False),

        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column('designation', sa.String(length=200), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(length=50), nullable=True),
        sa.Column('aadhaar_number', sa.String(length=50), nullable=True),
        sa.Column('pan_number', sa.String(length=20), nullable=True),
        sa.Column('mobile', sa.String(length=30), nullable=True),
        sa.Column('whatsapp_number', sa.String(length=30), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),

        sa.Column('address_line1', sa.Text(), nullable=True),
        sa.Column('address_line2', sa.Text(), nullable=True),
        sa.Column('office_address', sa.Text(), nullable=True),
        sa.Column('city', sa.String(length=200), nullable=True),
        sa.Column('district', sa.String(length=200), nullable=True),
        sa.Column('state', sa.String(length=200), nullable=True),
        sa.Column('pincode', sa.String(length=20), nullable=True),
        sa.Column('landmark', sa.String(length=200), nullable=True),

        sa.Column('signature', sa.Text(), nullable=True),
        sa.Column('signature_date', sa.Date(), nullable=True),
        sa.Column('signature_place', sa.String(length=255), nullable=True),
        sa.Column('declaration_accepted', sa.Boolean(), nullable=False, server_default=sa.text('false')),

        sa.Column('bank_details', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column('social_links', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column('role_details', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'{}'::jsonb")),

        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),

        sa.CheckConstraint(
            "vendor_type IN ('OWNER', 'AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT')",
            name='ck_property_contact_persons_vendor_type',
        ),
    )
    op.create_index('ix_property_contact_persons_id', 'property_contact_persons', ['id'])
    op.create_index('ix_property_contact_persons_user_id', 'property_contact_persons', ['user_id'])
    op.create_index('ix_property_contact_persons_vendor_type', 'property_contact_persons', ['vendor_type'])


def downgrade() -> None:
    op.drop_index('ix_property_contact_persons_vendor_type', table_name='property_contact_persons')
    op.drop_index('ix_property_contact_persons_user_id', table_name='property_contact_persons')
    op.drop_index('ix_property_contact_persons_id', table_name='property_contact_persons')
    op.drop_table('property_contact_persons')
