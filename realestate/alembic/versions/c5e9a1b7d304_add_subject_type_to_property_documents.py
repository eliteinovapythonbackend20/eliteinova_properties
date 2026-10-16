"""add subject_type to property_documents (PROPERTY vs CONTACT_PERSON)

Existing property document rows are PROPERTY. Rows that were wrongly stored as a
contact person's identity under a user's account are NOT moved here: they cannot be
identified reliably from the file, so they go to manual review.

Revision ID: c5e9a1b7d304
Revises: b8d2f4a6c913
Create Date: 2026-10-06 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c5e9a1b7d304'
down_revision: Union[str, None] = 'b8d2f4a6c913'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'property_documents',
        sa.Column('subject_type', sa.String(length=20), nullable=False, server_default='PROPERTY'),
    )
    op.create_index('ix_property_documents_subject_type', 'property_documents', ['subject_type'])
    op.create_check_constraint(
        'ck_property_documents_subject_type',
        'property_documents',
        "subject_type IN ('PROPERTY', 'CONTACT_PERSON')",
    )


def downgrade() -> None:
    op.drop_constraint('ck_property_documents_subject_type', 'property_documents', type_='check')
    op.drop_index('ix_property_documents_subject_type', table_name='property_documents')
    op.drop_column('property_documents', 'subject_type')
