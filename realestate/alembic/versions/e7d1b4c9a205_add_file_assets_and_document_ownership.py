"""add file_assets, user_documents and document versioning to property_documents

Creates the shared physical-file table, the user-owned document table, and the
versioning/verification columns on property_documents. Backfills all existing
rows so that nothing is discarded:

- every stored file gets a file_assets row that points at its existing URL;
  no object is moved, renamed, re-uploaded or deleted;
- vendor documents from property_documents (property_id NULL) and from the
  vendor_profile role JSONB "documents" blobs become user_documents rows,
  keeping their original value in legacy_document_type and their source in
  legacy_source/legacy_ref;
- the legacy rows themselves are left untouched except for the new columns.

Downgrade drops only the new schema. The original columns and JSONB blobs are
never modified by this revision, so they remain the untouched source.

Revision ID: e7d1b4c9a205
Revises: c4a8e2d10f57
Create Date: 2026-10-06 00:00:00.000000

"""
from datetime import datetime, timezone
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.core.document_catalog import UNCLASSIFIED, resolve_document_key
from app.core.storage.locator import parse_file_url

# revision identifiers, used by Alembic.
revision: str = 'e7d1b4c9a205'
down_revision: Union[str, None] = 'c4a8e2d10f57'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Profile photos and logos are media, not documents. Phase 1 does not migrate
# them (user_media is a later phase); they stay in the JSONB blobs untouched.
MEDIA_BLOB_KEYS = {'profile_photo', 'passport_photo', 'company_logo', 'agency_logo'}
ROLE_BLOB_COLUMNS = ('agency_details', 'builder_details', 'pm_details', 'owner_details')


def _to_utc(value):
    if value is None:
        return datetime.fromtimestamp(0, tz=timezone.utc)
    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value)
        except ValueError:
            return datetime.fromtimestamp(0, tz=timezone.utc)
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def _get_or_create_asset(conn, *, file_url, original_name, mime_type, size_bytes, visibility):
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
            "VALUES (:p, :b, :k, :name, :mime, :size, :vis, 'active', :url) RETURNING id"
        ),
        {
            'p': locator.storage_provider,
            'b': locator.bucket,
            'k': locator.storage_key,
            'name': (original_name or 'unnamed')[:255],
            'mime': mime_type,
            'size': size_bytes,
            'vis': visibility,
            'url': file_url,
        },
    ).scalar_one()


def _assign_versions(candidates):
    """candidates: list of dicts with 'sort_at'. Sets version, is_current and status in place."""
    candidates.sort(key=lambda c: (c['sort_at'], c['sort_id']))
    last = len(candidates) - 1
    for index, candidate in enumerate(candidates):
        candidate['version'] = index + 1
        candidate['is_current'] = index == last
        candidate['status'] = 'legacy' if index == last else 'superseded'


def upgrade() -> None:
    op.create_table(
        'file_assets',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('storage_provider', sa.String(length=20), nullable=False),
        sa.Column('bucket', sa.String(length=255), nullable=True),
        sa.Column('storage_key', sa.String(length=1000), nullable=False),
        sa.Column('original_name', sa.String(length=255), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=True),
        sa.Column('size_bytes', sa.BigInteger(), nullable=True),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('visibility', sa.String(length=10), server_default='private', nullable=False),
        sa.Column('status', sa.String(length=20), server_default='active', nullable=False),
        sa.Column('file_url', sa.String(length=1000), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('storage_provider', 'bucket', 'storage_key', name='uq_file_assets_locator'),
        sa.CheckConstraint("visibility IN ('public', 'private')", name='ck_file_assets_visibility'),
        sa.CheckConstraint("status IN ('active', 'deleted', 'orphaned')", name='ck_file_assets_status'),
    )
    op.create_index('ix_file_assets_id', 'file_assets', ['id'])

    op.create_table(
        'user_documents',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_asset_id', sa.Integer(), sa.ForeignKey('file_assets.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('document_key', sa.String(length=100), nullable=False),
        sa.Column('version', sa.Integer(), server_default='1', nullable=False),
        sa.Column('status', sa.String(length=20), server_default='pending', nullable=False),
        sa.Column('is_current', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('verified_by', sa.String(length=20), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('legacy_source', sa.String(length=50), nullable=True),
        sa.Column('legacy_document_type', sa.String(length=100), nullable=True),
        sa.Column('legacy_ref', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('user_id', 'document_key', 'version', name='uq_user_documents_version'),
        sa.CheckConstraint(
            "status IN ('pending', 'verified', 'rejected', 'superseded', 'legacy', 'deleted')",
            name='ck_user_documents_status',
        ),
    )
    op.create_index('ix_user_documents_id', 'user_documents', ['id'])
    op.create_index('ix_user_documents_user_id', 'user_documents', ['user_id'])
    op.create_index('ix_user_documents_file_asset_id', 'user_documents', ['file_asset_id'])
    op.create_index(
        'uq_user_documents_current', 'user_documents', ['user_id', 'document_key'],
        unique=True, postgresql_where=sa.text('is_current'),
    )

    op.add_column('property_documents', sa.Column('file_asset_id', sa.Integer(), nullable=True))
    op.add_column('property_documents', sa.Column('document_key', sa.String(length=100), nullable=True))
    op.add_column('property_documents', sa.Column('version', sa.Integer(), server_default='1', nullable=False))
    op.add_column('property_documents', sa.Column('status', sa.String(length=20), server_default='legacy', nullable=False))
    op.add_column('property_documents', sa.Column('is_current', sa.Boolean(), server_default=sa.true(), nullable=False))
    op.add_column('property_documents', sa.Column('verified_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('property_documents', sa.Column('verified_by', sa.String(length=20), nullable=True))
    op.add_column('property_documents', sa.Column('rejection_reason', sa.Text(), nullable=True))
    op.create_foreign_key(
        'fk_property_documents_file_asset_id', 'property_documents', 'file_assets',
        ['file_asset_id'], ['id'], ondelete='RESTRICT',
    )
    op.create_foreign_key(
        'fk_property_documents_verified_by', 'property_documents', 'users',
        ['verified_by'], ['id'], ondelete='SET NULL',
    )
    op.create_index('ix_property_documents_file_asset_id', 'property_documents', ['file_asset_id'])

    # Phase 1 backfill. Set the new status default for rows written after this point.
    conn = op.get_bind()
    _backfill_property_documents(conn)
    _backfill_user_documents(conn)

    op.alter_column('property_documents', 'status', server_default='pending')


def _backfill_property_documents(conn) -> None:
    rows = conn.execute(sa.text(
        "SELECT id, user_id, property_id, document_type, file_name, mime_type, file_url, "
        "file_size_kb, is_public, created_at FROM property_documents ORDER BY id"
    )).mappings().all()

    groups = {}
    for row in rows:
        scoped = row['property_id'] is not None
        key = resolve_document_key(row['document_type'], property_scoped=scoped)
        asset_id = _get_or_create_asset(
            conn,
            file_url=row['file_url'],
            original_name=row['file_name'],
            mime_type=row['mime_type'],
            size_bytes=(row['file_size_kb'] or 0) * 1024 if row['file_size_kb'] is not None else None,
            visibility='public' if row['is_public'] else 'private',
        )
        candidate = {
            'id': row['id'],
            'sort_at': _to_utc(row['created_at']),
            'sort_id': row['id'],
            'asset_id': asset_id,
            'key': key,
        }
        if scoped:
            groups.setdefault(('property', row['property_id'], key), []).append(candidate)
        else:
            groups.setdefault(('vendor', row['user_id'], key), []).append(candidate)

    # Property-level rows: version within each property + key, latest is current.
    for group_key, candidates in groups.items():
        if group_key[0] != 'property':
            continue
        _assign_versions(candidates)
    # Vendor rows keep their own version history here; they are also carried into
    # user_documents by _backfill_user_documents, which assigns its own versions.
    for group_key, candidates in groups.items():
        if group_key[0] != 'vendor':
            continue
        _assign_versions(candidates)

    for group_candidates in groups.values():
        for c in group_candidates:
            conn.execute(
                sa.text(
                    "UPDATE property_documents SET file_asset_id = :a, document_key = :k, "
                    "version = :v, status = :s, is_current = :cur WHERE id = :id"
                ),
                {'a': c['asset_id'], 'k': c['key'], 'v': c['version'], 's': c['status'],
                 'cur': c['is_current'], 'id': c['id']},
            )


def _backfill_user_documents(conn) -> None:
    candidates = {}

    for row in conn.execute(sa.text(
        "SELECT id, user_id, document_type, file_name, mime_type, file_url, file_size_kb, created_at "
        "FROM property_documents WHERE property_id IS NULL"
    )).mappings().all():
        key = resolve_document_key(row['document_type'], property_scoped=False)
        candidates.setdefault((row['user_id'], key), []).append({
            'sort_at': _to_utc(row['created_at']),
            'sort_id': f"0-{row['id']}",
            'source': 'property_documents',
            'ref': str(row['id']),
            'legacy_type': row['document_type'],
            'file_url': row['file_url'],
            'name': row['file_name'],
            'mime': row['mime_type'],
            'size': (row['file_size_kb'] or 0) * 1024 if row['file_size_kb'] is not None else None,
        })

    for row in conn.execute(sa.text(
        f"SELECT id, user_id, {', '.join(ROLE_BLOB_COLUMNS)} FROM vendor_profile"
    )).mappings().all():
        for column in ROLE_BLOB_COLUMNS:
            blob = row[column] or {}
            documents = blob.get('documents') or {}
            for doc_type, meta in documents.items():
                if doc_type in MEDIA_BLOB_KEYS or not meta or not meta.get('storedPath'):
                    continue
                key = resolve_document_key(doc_type, property_scoped=False)
                candidates.setdefault((row['user_id'], key), []).append({
                    'sort_at': _to_utc(meta.get('uploadedAt')),
                    'sort_id': f"1-{row['id']}-{column}-{doc_type}",
                    'source': f'vendor_profile.{column}',
                    'ref': f'{column}:{doc_type}',
                    'legacy_type': doc_type,
                    'file_url': meta.get('storedPath'),
                    'name': meta.get('fileName'),
                    'mime': meta.get('mimeType'),
                    'size': (meta.get('fileSizeKb') or 0) * 1024 if meta.get('fileSizeKb') is not None else None,
                })

    skipped_without_file = 0
    for (user_id, key), items in candidates.items():
        # Versions are assigned over every candidate, so skipping a row without a
        # file must not renumber the rest. Filter before assigning.
        skipped_without_file += sum(1 for i in items if not i['file_url'])
        items = [i for i in items if i['file_url']]
        _assign_versions(items)
        for item in items:
            asset_id = _get_or_create_asset(
                conn,
                file_url=item['file_url'],
                original_name=item['name'],
                mime_type=item['mime'],
                size_bytes=item['size'],
                visibility='private',
            )
            conn.execute(
                sa.text(
                    "INSERT INTO user_documents (user_id, file_asset_id, document_key, version, status, "
                    "is_current, legacy_source, legacy_document_type, legacy_ref, created_at, updated_at) "
                    "VALUES (:u, :a, :k, :v, :s, :cur, :src, :lt, :ref, :ts, :ts)"
                ),
                {
                    'u': user_id, 'a': asset_id, 'k': key, 'v': item['version'], 's': item['status'],
                    'cur': item['is_current'], 'src': item['source'], 'lt': item['legacy_type'],
                    'ref': item['ref'], 'ts': item['sort_at'],
                },
            )

    # Report what could not be carried over, so nothing is dropped silently.
    if skipped_without_file:
        print(f"e7d1b4c9a205: {skipped_without_file} vendor document rows have no file_url; left in legacy storage")
    unclassified = conn.execute(sa.text(
        "SELECT count(*) FROM user_documents WHERE document_key = :u"
    ), {'u': UNCLASSIFIED}).scalar_one()
    if unclassified:
        print(f"e7d1b4c9a205: {unclassified} vendor documents are unclassified; see user_documents.legacy_document_type")


def downgrade() -> None:
    # Physical files are never touched by this revision. Only the new schema is removed.
    op.alter_column('property_documents', 'status', server_default='legacy')
    op.drop_index('ix_property_documents_file_asset_id', table_name='property_documents')
    op.drop_constraint('fk_property_documents_verified_by', 'property_documents', type_='foreignkey')
    op.drop_constraint('fk_property_documents_file_asset_id', 'property_documents', type_='foreignkey')
    for column in ('rejection_reason', 'verified_by', 'verified_at', 'is_current', 'status', 'version',
                   'document_key', 'file_asset_id'):
        op.drop_column('property_documents', column)

    op.drop_index('uq_user_documents_current', table_name='user_documents')
    op.drop_index('ix_user_documents_file_asset_id', table_name='user_documents')
    op.drop_index('ix_user_documents_user_id', table_name='user_documents')
    op.drop_index('ix_user_documents_id', table_name='user_documents')
    op.drop_table('user_documents')

    op.drop_index('ix_file_assets_id', table_name='file_assets')
    op.drop_table('file_assets')
