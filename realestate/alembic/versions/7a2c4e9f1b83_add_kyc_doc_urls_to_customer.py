"""add kyc document url columns to customer

Revision ID: 7a2c4e9f1b83
Revises: 34721b5d7b39
Create Date: 2026-09-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7a2c4e9f1b83'
down_revision: Union[str, None] = '34721b5d7b39'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('customer', sa.Column('aadhaar_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('pan_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('gst_doc_url', sa.String(length=500), nullable=True))
    op.add_column('customer', sa.Column('rera_doc_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('customer', 'rera_doc_url')
    op.drop_column('customer', 'gst_doc_url')
    op.drop_column('customer', 'pan_doc_url')
    op.drop_column('customer', 'aadhaar_doc_url')
