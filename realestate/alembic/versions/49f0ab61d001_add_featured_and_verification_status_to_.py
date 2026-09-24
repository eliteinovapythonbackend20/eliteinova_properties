"""add featured and verification_status to properties

Revision ID: 49f0ab61d001
Revises: c1f3a9d2e701
Create Date: 2026-09-23 12:23:10.347710

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49f0ab61d001'
down_revision: Union[str, None] = 'c1f3a9d2e701'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'properties',
        sa.Column('featured', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.add_column(
        'properties',
        sa.Column('verification_status', sa.String(length=20), nullable=False, server_default='Not Verified'),
    )


def downgrade() -> None:
    op.drop_column('properties', 'verification_status')
    op.drop_column('properties', 'featured')
