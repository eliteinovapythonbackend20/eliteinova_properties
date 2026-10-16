"""add user_media and property_user_media (reusable user media and property references)

Creates two tables only; no existing row changes. Legacy media references in vendor JSON are
registered by a separate, reviewed script (not here), so this migration stays schema-only.

Revision ID: d7a2c4e8f1b6
Revises: c5e9a1b7d304
Create Date: 2026-10-07 09:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'd7a2c4e8f1b6'
down_revision: Union[str, None] = 'c5e9a1b7d304'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_media',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('media_type', sa.String(length=30), nullable=False),
        sa.Column('file_asset_id', sa.Integer(), sa.ForeignKey('file_assets.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='verified'),
        sa.Column('is_current', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "media_type IN ('profile_photo', 'company_logo', 'agency_logo', 'business_logo')",
            name='ck_user_media_type',
        ),
        sa.CheckConstraint("status IN ('verified', 'superseded', 'legacy', 'deleted')", name='ck_user_media_status'),
    )
    op.create_index('ix_user_media_id', 'user_media', ['id'])
    op.create_index('ix_user_media_user_id', 'user_media', ['user_id'])
    op.create_index('ix_user_media_file_asset_id', 'user_media', ['file_asset_id'])
    op.create_index(
        'uq_user_media_current', 'user_media', ['user_id', 'media_type'],
        unique=True, postgresql_where=sa.text('is_current'),
    )

    op.create_table(
        'property_user_media',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_media_id', sa.Integer(), sa.ForeignKey('user_media.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('purpose', sa.String(length=30), nullable=False),
        sa.Column('created_by', sa.String(length=20), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "purpose IN ('profile_photo', 'company_logo', 'agency_logo', 'business_logo')",
            name='ck_property_user_media_purpose',
        ),
    )
    op.create_index('ix_property_user_media_id', 'property_user_media', ['id'])
    op.create_index('ix_property_user_media_property_id', 'property_user_media', ['property_id'])
    op.create_index('ix_property_user_media_user_media_id', 'property_user_media', ['user_media_id'])
    op.create_index(
        'uq_property_user_media_purpose', 'property_user_media', ['property_id', 'purpose'], unique=True,
    )


def downgrade() -> None:
    op.drop_table('property_user_media')
    op.drop_table('user_media')
