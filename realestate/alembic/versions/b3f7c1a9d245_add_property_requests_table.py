"""add property_requests table

Backs the customer-facing "Requested Properties" tab and the admin
dashboard's Purchase Requests / Rental Requests modules (previously 100%
mock data, no backend). One shared table for both request_type values
("purchase" | "rental"), matching this codebase's existing
CustomerRequirement precedent (buyer/tenant not split - same shape,
different field subset in use). See app.models.property_request's docstring
for the full rationale.

Revision ID: b3f7c1a9d245
Revises: 9d4f6b2e8a71
Create Date: 2026-10-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b3f7c1a9d245'
down_revision: Union[str, None] = '9d4f6b2e8a71'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'property_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(length=20), nullable=False),
        sa.Column('property_id', sa.String(length=20), nullable=False),
        sa.Column('request_type', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='new'),
        sa.Column('status_history', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('requested_amount', sa.Float(), nullable=True),
        sa.Column('budget_min', sa.Float(), nullable=True),
        sa.Column('budget_max', sa.Float(), nullable=True),
        sa.Column('preferred_date', sa.Date(), nullable=True),
        sa.Column('timeline', sa.String(length=50), nullable=True),
        sa.Column('occupant_type', sa.String(length=50), nullable=True),
        sa.Column('occupants_count', sa.Integer(), nullable=True),
        sa.Column('employment_type', sa.String(length=50), nullable=True),
        sa.Column('company_name', sa.String(length=255), nullable=True),
        sa.Column('monthly_income', sa.Float(), nullable=True),
        sa.Column('financing_required', sa.Boolean(), nullable=True),
        sa.Column('site_visit_requested', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('site_visit_date', sa.Date(), nullable=True),
        sa.Column('is_urgent', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_property_requests_user_id', 'property_requests', ['user_id'])
    op.create_index('ix_property_requests_property_id', 'property_requests', ['property_id'])
    op.create_index('ix_property_requests_request_type', 'property_requests', ['request_type'])
    op.create_index('ix_property_requests_status', 'property_requests', ['status'])


def downgrade() -> None:
    op.drop_index('ix_property_requests_status', table_name='property_requests')
    op.drop_index('ix_property_requests_request_type', table_name='property_requests')
    op.drop_index('ix_property_requests_property_id', table_name='property_requests')
    op.drop_index('ix_property_requests_user_id', table_name='property_requests')
    op.drop_table('property_requests')
