"""add contact_person_media and drop the legacy poster-photo/logo columns

Adds the new CONTACT_PERSON -> MEDIA layer: contact_person_media, keyed by
property_id (never inferred from the GCS path), public (never admin-gated the
way a contact-person DOCUMENT is). Backfills every existing value from the 7
legacy columns (profile_photo_url / agency_logo_url / company_logo_url on
agent_properties, builder_properties, owner_properties,
property_management_properties) into it as status='legacy', is_current=true,
each getting its own file_assets row pointing at its existing URL - no object
is moved, renamed, re-uploaded or deleted. Only then are the legacy columns
dropped.

Revision ID: 83e45d6871ca
Revises: f29da775bea8
Create Date: 2026-10-07 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.core.storage.locator import parse_file_url

# revision identifiers, used by Alembic.
revision: str = '83e45d6871ca'
down_revision: Union[str, None] = 'f29da775bea8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# (table, column, media_type)
_LEGACY_COLUMNS = (
    ('agent_properties', 'profile_photo_url', 'profile_photo'),
    ('agent_properties', 'agency_logo_url', 'agency_logo'),
    ('builder_properties', 'profile_photo_url', 'profile_photo'),
    ('builder_properties', 'company_logo_url', 'company_logo'),
    ('owner_properties', 'profile_photo_url', 'profile_photo'),
    ('property_management_properties', 'profile_photo_url', 'profile_photo'),
    ('property_management_properties', 'company_logo_url', 'company_logo'),
)


def _get_or_create_asset(conn, *, file_url):
    locator = parse_file_url(file_url)
    row = conn.execute(
        sa.text(
            "SELECT id FROM file_assets "
            "WHERE storage_provider = :p AND bucket IS NOT DISTINCT FROM :b AND storage_key = :k"
        ),
        {'p': locator.storage_provider, 'b': locator.bucket, 'k': locator.storage_key},
    ).first()
    if row:
        return row[0]
    return conn.execute(
        sa.text(
            "INSERT INTO file_assets (storage_provider, bucket, storage_key, original_name, mime_type, "
            "size_bytes, visibility, status, file_url) "
            "VALUES (:p, :b, :k, :name, NULL, NULL, 'public', 'active', :url) RETURNING id"
        ),
        {'p': locator.storage_provider, 'b': locator.bucket, 'k': locator.storage_key,
         'name': 'legacy', 'url': file_url},
    ).scalar_one()


def upgrade() -> None:
    op.create_table(
        'contact_person_media',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False),
        sa.Column('media_type', sa.String(length=30), nullable=False),
        sa.Column('file_asset_id', sa.Integer(), sa.ForeignKey('file_assets.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='verified'),
        sa.Column('is_current', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "media_type IN ('profile_photo', 'agency_logo', 'company_logo')",
            name='ck_contact_person_media_type',
        ),
        sa.CheckConstraint("status IN ('verified', 'superseded', 'legacy', 'deleted')", name='ck_contact_person_media_status'),
    )
    op.create_index('ix_contact_person_media_id', 'contact_person_media', ['id'])
    op.create_index('ix_contact_person_media_property_id', 'contact_person_media', ['property_id'])
    op.create_index('ix_contact_person_media_file_asset_id', 'contact_person_media', ['file_asset_id'])
    op.create_index(
        'uq_contact_person_media_current', 'contact_person_media', ['property_id', 'media_type'],
        unique=True, postgresql_where=sa.text('is_current'),
    )

    conn = op.get_bind()
    migrated = 0
    for table, column, media_type in _LEGACY_COLUMNS:
        rows = conn.execute(sa.text(
            f"SELECT property_id, {column} AS url FROM {table} WHERE {column} IS NOT NULL"
        )).mappings().all()
        for row in rows:
            asset_id = _get_or_create_asset(conn, file_url=row['url'])
            conn.execute(
                sa.text(
                    "INSERT INTO contact_person_media (property_id, media_type, file_asset_id, version, "
                    "status, is_current) VALUES (:p, :m, :a, 1, 'legacy', true)"
                ),
                {'p': row['property_id'], 'm': media_type, 'a': asset_id},
            )
            migrated += 1
    if migrated:
        print(f"83e45d6871ca: migrated {migrated} legacy poster-photo/logo values into contact_person_media")

    for table, column, _media_type in _LEGACY_COLUMNS:
        op.drop_column(table, column)


def downgrade() -> None:
    # The legacy columns are not restored with data - this revision only ever
    # moves values forward. Physical files are never touched either way.
    op.add_column('agent_properties', sa.Column('profile_photo_url', sa.String(length=500), nullable=True))
    op.add_column('agent_properties', sa.Column('agency_logo_url', sa.String(length=500), nullable=True))
    op.add_column('builder_properties', sa.Column('profile_photo_url', sa.String(length=500), nullable=True))
    op.add_column('builder_properties', sa.Column('company_logo_url', sa.String(length=500), nullable=True))
    op.add_column('owner_properties', sa.Column('profile_photo_url', sa.String(length=500), nullable=True))
    op.add_column('property_management_properties', sa.Column('profile_photo_url', sa.String(length=500), nullable=True))
    op.add_column('property_management_properties', sa.Column('company_logo_url', sa.String(length=500), nullable=True))

    op.drop_index('uq_contact_person_media_current', table_name='contact_person_media')
    op.drop_index('ix_contact_person_media_file_asset_id', table_name='contact_person_media')
    op.drop_index('ix_contact_person_media_property_id', table_name='contact_person_media')
    op.drop_index('ix_contact_person_media_id', table_name='contact_person_media')
    op.drop_table('contact_person_media')
