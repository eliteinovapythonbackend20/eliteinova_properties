"""add slot_key to property_documents (one version chain per logical file slot)

Existing property document rows form one chain per document_key, because the
Phase 1 backfill grouped them that way. Their slot_key is set to the document_key
so that chain is kept. New uploads get their own slot, so several files under one
key (e.g. property_supporting_documents) stay independent.

Revision ID: b8d2f4a6c913
Revises: a9c3e5f7b1d2
Create Date: 2026-10-06 19:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b8d2f4a6c913'
down_revision: Union[str, None] = 'a9c3e5f7b1d2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('property_documents', sa.Column('slot_key', sa.String(length=64), nullable=True))
    op.create_index('ix_property_documents_slot_key', 'property_documents', ['slot_key'])
    op.execute(
        "UPDATE property_documents SET slot_key = document_key "
        "WHERE property_id IS NOT NULL AND document_key IS NOT NULL AND slot_key IS NULL"
    )


def downgrade() -> None:
    op.drop_index('ix_property_documents_slot_key', table_name='property_documents')
    op.drop_column('property_documents', 'slot_key')
