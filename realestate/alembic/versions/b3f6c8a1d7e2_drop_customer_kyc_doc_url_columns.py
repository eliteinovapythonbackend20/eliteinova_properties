"""drop customer kyc doc url columns

Revision ID: b3f6c8a1d7e2
Revises: 9f3c1a7e5d42
Create Date: 2026-10-14 00:00:00.000000

aadhaar_doc_url/pan_doc_url/gst_doc_url stored a raw file URL directly on
Customer, bypassing the file_asset_id reference architecture every other
document in the system uses (UserDocument -> FileAsset). The actual files
now live in user_documents (document_key aadhaar_card/pan_card/
gst_certificate), referenced the same way vendor KYC docs already are - see
app.services.customer_service.build_kyc_documents/upload_kyc_document.

rera_doc_url and kyc_rera_verified are dropped outright, not migrated: RERA
registration is a property/project-level certificate, not something a
buyer/tenant customer has personally, so it was never a legitimate customer
KYC document type.

Verified before writing this migration: both live customer rows have NULL
in all four columns, so there is nothing to backfill.

Downgrade recreates the columns (all NULL/false) but cannot restore data -
none existed at the time this migration was written, but this is still not
a true rollback if rows were populated after upgrading.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = 'b3f6c8a1d7e2'
down_revision: Union[str, None] = '9f3c1a7e5d42'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('customer', 'aadhaar_doc_url')
    op.drop_column('customer', 'pan_doc_url')
    op.drop_column('customer', 'gst_doc_url')
    op.drop_column('customer', 'rera_doc_url')
    op.drop_column('customer', 'kyc_rera_verified')


def downgrade() -> None:
    op.add_column('customer', sa.Column('kyc_rera_verified', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('customer', sa.Column('rera_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('gst_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('pan_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('aadhaar_doc_url', sa.String(length=500), nullable=True))
