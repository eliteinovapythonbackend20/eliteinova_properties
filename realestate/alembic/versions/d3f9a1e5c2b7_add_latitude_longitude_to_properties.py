"""add latitude and longitude to properties

Revision ID: d3f9a1e5c2b7
Revises: 49f0ab61d001
Create Date: 2026-09-23 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3f9a1e5c2b7'
down_revision: Union[str, None] = '49f0ab61d001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('properties', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('properties', sa.Column('longitude', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('properties', 'longitude')
    op.drop_column('properties', 'latitude')
