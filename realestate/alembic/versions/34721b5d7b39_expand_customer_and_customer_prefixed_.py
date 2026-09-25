"""expand customer and customer-prefixed tables

Revision ID: 34721b5d7b39
Revises: d3f9a1e5c2b7
Create Date: 2026-09-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34721b5d7b39'
down_revision: Union[str, None] = 'd3f9a1e5c2b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # customer
    op.add_column('customer', sa.Column('pincode', sa.String(length=10), nullable=True))
    op.add_column('customer', sa.Column('customer_type', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('date_of_birth', sa.Date(), nullable=True))
    op.add_column('customer', sa.Column('gender', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('marital_status', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('alternate_phone', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('occupation', sa.String(length=100), nullable=True))
    op.add_column('customer', sa.Column('employment_type', sa.String(length=50), nullable=True))
    op.add_column('customer', sa.Column('company_name', sa.String(length=255), nullable=True))
    op.add_column('customer', sa.Column('designation', sa.String(length=100), nullable=True))
    op.add_column('customer', sa.Column('annual_income', sa.Float(), nullable=True))
    op.add_column('customer', sa.Column('email_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('phone_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('kyc_status', sa.String(length=20), nullable=False, server_default='pending'))
    op.add_column('customer', sa.Column('kyc_aadhaar_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('kyc_pan_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('kyc_gst_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('kyc_rera_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('preferred_contact_channel', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('preferred_contact_time', sa.String(length=20), nullable=True))
    op.add_column('customer', sa.Column('preferred_language', sa.String(length=50), nullable=True))
    op.add_column('customer', sa.Column('newsletter_opt_in', sa.Boolean(), nullable=False, server_default=sa.false()))

    # customer_requirements
    op.add_column('customer_requirements', sa.Column('pincode', sa.String(length=10), nullable=True))
    op.add_column('customer_requirements', sa.Column('tenant_type', sa.String(length=50), nullable=True))
    op.add_column('customer_requirements', sa.Column('family_size', sa.Integer(), nullable=True))
    op.add_column('customer_requirements', sa.Column('move_in_date', sa.Date(), nullable=True))
    op.add_column('customer_requirements', sa.Column('rental_duration', sa.String(length=20), nullable=True))
    op.add_column('customer_requirements', sa.Column('parking_required', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer_requirements', sa.Column('pets_allowed', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer_requirements', sa.Column('status', sa.String(length=20), nullable=False, server_default='active'))
    op.execute("UPDATE customer_requirements SET status = CASE WHEN is_active THEN 'active' ELSE 'expired' END")
    op.drop_column('customer_requirements', 'is_active')

    # customer_saved_properties
    op.add_column('customer_saved_properties', sa.Column('notes', sa.Text(), nullable=True))

    # customer_wishlist
    op.add_column('customer_wishlist', sa.Column('price_at_add', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('customer_wishlist', 'price_at_add')

    op.drop_column('customer_saved_properties', 'notes')

    op.add_column('customer_requirements', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()))
    op.execute("UPDATE customer_requirements SET is_active = (status = 'active')")
    op.drop_column('customer_requirements', 'status')
    op.drop_column('customer_requirements', 'pets_allowed')
    op.drop_column('customer_requirements', 'parking_required')
    op.drop_column('customer_requirements', 'rental_duration')
    op.drop_column('customer_requirements', 'move_in_date')
    op.drop_column('customer_requirements', 'family_size')
    op.drop_column('customer_requirements', 'tenant_type')
    op.drop_column('customer_requirements', 'pincode')

    op.drop_column('customer', 'newsletter_opt_in')
    op.drop_column('customer', 'preferred_language')
    op.drop_column('customer', 'preferred_contact_time')
    op.drop_column('customer', 'preferred_contact_channel')
    op.drop_column('customer', 'kyc_rera_verified')
    op.drop_column('customer', 'kyc_gst_verified')
    op.drop_column('customer', 'kyc_pan_verified')
    op.drop_column('customer', 'kyc_aadhaar_verified')
    op.drop_column('customer', 'kyc_status')
    op.drop_column('customer', 'phone_verified')
    op.drop_column('customer', 'email_verified')
    op.drop_column('customer', 'annual_income')
    op.drop_column('customer', 'designation')
    op.drop_column('customer', 'company_name')
    op.drop_column('customer', 'employment_type')
    op.drop_column('customer', 'occupation')
    op.drop_column('customer', 'alternate_phone')
    op.drop_column('customer', 'marital_status')
    op.drop_column('customer', 'gender')
    op.drop_column('customer', 'date_of_birth')
    op.drop_column('customer', 'customer_type')
    op.drop_column('customer', 'pincode')
