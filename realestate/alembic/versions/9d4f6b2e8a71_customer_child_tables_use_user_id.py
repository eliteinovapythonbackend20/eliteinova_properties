"""re-point customer child tables at users.id instead of customer.id, revert
speculative CustomerRequirement fields

Architecture correction: users with the USER role ARE the customers: the
same person can act as buyer or tenant, so every table hanging off a
customer's activity (requirements, saved properties, wishlist, property
views) must reference `users.id` (the EP... string id) directly, not
`customer.id` (an internal integer PK that must never be used as an FK
target or exposed in the API). `customer.id` itself is untouched by this
migration - only the four child tables' FK column changes.

Also reverts CustomerRequirement fields added in 34721b5d7b39 that were
speculative ahead of an actual requirements-form design: drops the
tenant-specific columns and reverts `status` back to the original
`is_active` boolean. CustomerRequirement backs a future requirement-filter
page only - its final field set isn't decided yet.

These four tables have zero rows in every environment this has been applied
to so far, so this is a straight drop+add (no data migration needed).

Revision ID: 9d4f6b2e8a71
Revises: 7a2c4e9f1b83
Create Date: 2026-09-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9d4f6b2e8a71'
down_revision: Union[str, None] = '7a2c4e9f1b83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ---- customer_requirements: customer_id -> user_id ----
    op.drop_constraint('customer_requirements_customer_id_fkey', 'customer_requirements', type_='foreignkey')
    op.drop_index('ix_customer_requirements_customer_id', table_name='customer_requirements')
    op.drop_column('customer_requirements', 'customer_id')
    op.add_column('customer_requirements', sa.Column('user_id', sa.String(length=20), nullable=False))
    op.create_index('ix_customer_requirements_user_id', 'customer_requirements', ['user_id'])
    op.create_foreign_key(
        'customer_requirements_user_id_fkey', 'customer_requirements', 'users',
        ['user_id'], ['id'], ondelete='CASCADE',
    )

    # ---- customer_requirements: revert speculative fields ----
    op.drop_column('customer_requirements', 'pincode')
    op.drop_column('customer_requirements', 'tenant_type')
    op.drop_column('customer_requirements', 'family_size')
    op.drop_column('customer_requirements', 'move_in_date')
    op.drop_column('customer_requirements', 'rental_duration')
    op.drop_column('customer_requirements', 'parking_required')
    op.drop_column('customer_requirements', 'pets_allowed')
    op.drop_column('customer_requirements', 'status')
    op.add_column('customer_requirements', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()))

    # ---- customer_saved_properties: customer_id -> user_id ----
    op.drop_constraint('uq_customer_saved_property', 'customer_saved_properties', type_='unique')
    op.drop_constraint('customer_saved_properties_customer_id_fkey', 'customer_saved_properties', type_='foreignkey')
    op.drop_index('ix_customer_saved_properties_customer_id', table_name='customer_saved_properties')
    op.drop_column('customer_saved_properties', 'customer_id')
    op.add_column('customer_saved_properties', sa.Column('user_id', sa.String(length=20), nullable=False))
    op.create_index('ix_customer_saved_properties_user_id', 'customer_saved_properties', ['user_id'])
    op.create_foreign_key(
        'customer_saved_properties_user_id_fkey', 'customer_saved_properties', 'users',
        ['user_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_saved_property', 'customer_saved_properties', ['user_id', 'property_id'])

    # ---- customer_wishlist: customer_id -> user_id ----
    op.drop_constraint('uq_customer_wishlist_property', 'customer_wishlist', type_='unique')
    op.drop_constraint('customer_wishlist_customer_id_fkey', 'customer_wishlist', type_='foreignkey')
    op.drop_index('ix_customer_wishlist_customer_id', table_name='customer_wishlist')
    op.drop_column('customer_wishlist', 'customer_id')
    op.add_column('customer_wishlist', sa.Column('user_id', sa.String(length=20), nullable=False))
    op.create_index('ix_customer_wishlist_user_id', 'customer_wishlist', ['user_id'])
    op.create_foreign_key(
        'customer_wishlist_user_id_fkey', 'customer_wishlist', 'users',
        ['user_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_wishlist_property', 'customer_wishlist', ['user_id', 'property_id'])

    # ---- customer_property_views: customer_id -> user_id ----
    op.drop_constraint('uq_customer_property_view', 'customer_property_views', type_='unique')
    op.drop_constraint('customer_property_views_customer_id_fkey', 'customer_property_views', type_='foreignkey')
    op.drop_index('ix_customer_property_views_customer_id', table_name='customer_property_views')
    op.drop_column('customer_property_views', 'customer_id')
    op.add_column('customer_property_views', sa.Column('user_id', sa.String(length=20), nullable=False))
    op.create_index('ix_customer_property_views_user_id', 'customer_property_views', ['user_id'])
    op.create_foreign_key(
        'customer_property_views_user_id_fkey', 'customer_property_views', 'users',
        ['user_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_property_view', 'customer_property_views', ['user_id', 'property_id'])


def downgrade() -> None:
    # ---- customer_property_views: user_id -> customer_id ----
    op.drop_constraint('uq_customer_property_view', 'customer_property_views', type_='unique')
    op.drop_constraint('customer_property_views_user_id_fkey', 'customer_property_views', type_='foreignkey')
    op.drop_index('ix_customer_property_views_user_id', table_name='customer_property_views')
    op.drop_column('customer_property_views', 'user_id')
    op.add_column('customer_property_views', sa.Column('customer_id', sa.Integer(), nullable=False))
    op.create_index('ix_customer_property_views_customer_id', 'customer_property_views', ['customer_id'])
    op.create_foreign_key(
        'customer_property_views_customer_id_fkey', 'customer_property_views', 'customer',
        ['customer_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_property_view', 'customer_property_views', ['customer_id', 'property_id'])

    # ---- customer_wishlist: user_id -> customer_id ----
    op.drop_constraint('uq_customer_wishlist_property', 'customer_wishlist', type_='unique')
    op.drop_constraint('customer_wishlist_user_id_fkey', 'customer_wishlist', type_='foreignkey')
    op.drop_index('ix_customer_wishlist_user_id', table_name='customer_wishlist')
    op.drop_column('customer_wishlist', 'user_id')
    op.add_column('customer_wishlist', sa.Column('customer_id', sa.Integer(), nullable=False))
    op.create_index('ix_customer_wishlist_customer_id', 'customer_wishlist', ['customer_id'])
    op.create_foreign_key(
        'customer_wishlist_customer_id_fkey', 'customer_wishlist', 'customer',
        ['customer_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_wishlist_property', 'customer_wishlist', ['customer_id', 'property_id'])

    # ---- customer_saved_properties: user_id -> customer_id ----
    op.drop_constraint('uq_customer_saved_property', 'customer_saved_properties', type_='unique')
    op.drop_constraint('customer_saved_properties_user_id_fkey', 'customer_saved_properties', type_='foreignkey')
    op.drop_index('ix_customer_saved_properties_user_id', table_name='customer_saved_properties')
    op.drop_column('customer_saved_properties', 'user_id')
    op.add_column('customer_saved_properties', sa.Column('customer_id', sa.Integer(), nullable=False))
    op.create_index('ix_customer_saved_properties_customer_id', 'customer_saved_properties', ['customer_id'])
    op.create_foreign_key(
        'customer_saved_properties_customer_id_fkey', 'customer_saved_properties', 'customer',
        ['customer_id'], ['id'], ondelete='CASCADE',
    )
    op.create_unique_constraint('uq_customer_saved_property', 'customer_saved_properties', ['customer_id', 'property_id'])

    # ---- customer_requirements: re-add speculative fields ----
    op.drop_column('customer_requirements', 'is_active')
    op.add_column('customer_requirements', sa.Column('status', sa.String(length=20), nullable=False, server_default='active'))
    op.add_column('customer_requirements', sa.Column('pets_allowed', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer_requirements', sa.Column('parking_required', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer_requirements', sa.Column('rental_duration', sa.String(length=20), nullable=True))
    op.add_column('customer_requirements', sa.Column('move_in_date', sa.Date(), nullable=True))
    op.add_column('customer_requirements', sa.Column('family_size', sa.Integer(), nullable=True))
    op.add_column('customer_requirements', sa.Column('tenant_type', sa.String(length=50), nullable=True))
    op.add_column('customer_requirements', sa.Column('pincode', sa.String(length=10), nullable=True))

    # ---- customer_requirements: user_id -> customer_id ----
    op.drop_constraint('customer_requirements_user_id_fkey', 'customer_requirements', type_='foreignkey')
    op.drop_index('ix_customer_requirements_user_id', table_name='customer_requirements')
    op.drop_column('customer_requirements', 'user_id')
    op.add_column('customer_requirements', sa.Column('customer_id', sa.Integer(), nullable=False))
    op.create_index('ix_customer_requirements_customer_id', 'customer_requirements', ['customer_id'])
    op.create_foreign_key(
        'customer_requirements_customer_id_fkey', 'customer_requirements', 'customer',
        ['customer_id'], ['id'], ondelete='CASCADE',
    )
