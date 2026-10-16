"""link property_media to file_assets (property media is always property-specific)

Adds file_asset_id to property_media, the same foundation user_documents and
property_documents already have, and backfills it for every existing row so
each stored image/video gets its own file_assets row. Property media is never
reusable across properties and is never a USER_MEDIA reference - this column
only gives it versioning/audit parity with documents, nothing more. No object
is moved, renamed, re-uploaded or deleted.

Revision ID: f29da775bea8
Revises: d7a2c4e8f1b6
Create Date: 2026-10-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.core.storage.locator import parse_file_url

# revision identifiers, used by Alembic.
revision: str = 'f29da775bea8'
down_revision: Union[str, None] = 'd7a2c4e8f1b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _get_or_create_asset(conn, *, file_url, original_name, mime_type, size_bytes):
    if not file_url:
        return None  # no stored file: the legacy row keeps its data, no asset is invented
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
            "VALUES (:p, :b, :k, :name, :mime, :size, 'public', 'active', :url) RETURNING id"
        ),
        {
            'p': locator.storage_provider,
            'b': locator.bucket,
            'k': locator.storage_key,
            'name': (original_name or 'unnamed')[:255],
            'mime': mime_type,
            'size': size_bytes,
            'url': file_url,
        },
    ).scalar_one()


def upgrade() -> None:
    op.add_column('property_media', sa.Column('file_asset_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_property_media_file_asset_id', 'property_media', 'file_assets',
        ['file_asset_id'], ['id'], ondelete='RESTRICT',
    )
    op.create_index('ix_property_media_file_asset_id', 'property_media', ['file_asset_id'])

    conn = op.get_bind()
    rows = conn.execute(sa.text(
        "SELECT id, file_name, mime_type, file_url, file_size_kb FROM property_media ORDER BY id"
    )).mappings().all()
    for row in rows:
        asset_id = _get_or_create_asset(
            conn,
            file_url=row['file_url'],
            original_name=row['file_name'],
            mime_type=row['mime_type'],
            size_bytes=(row['file_size_kb'] or 0) * 1024 if row['file_size_kb'] is not None else None,
        )
        if asset_id is not None:
            conn.execute(
                sa.text("UPDATE property_media SET file_asset_id = :a WHERE id = :id"),
                {'a': asset_id, 'id': row['id']},
            )


def downgrade() -> None:
    # Physical files are never touched by this revision. Only the new column is removed.
    op.drop_index('ix_property_media_file_asset_id', table_name='property_media')
    op.drop_constraint('fk_property_media_file_asset_id', 'property_media', type_='foreignkey')
    op.drop_column('property_media', 'file_asset_id')
