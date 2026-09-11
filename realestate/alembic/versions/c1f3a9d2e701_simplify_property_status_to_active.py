"""simplify property status to Active/Inactive

Revision ID: c1f3a9d2e701
Revises: f202525b009b
Create Date: 2026-09-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c1f3a9d2e701'
down_revision: Union[str, None] = 'f202525b009b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Collapse every legacy status value onto Active / Inactive.
    op.execute(
        "UPDATE properties SET status = 'Active' "
        "WHERE status IS NULL OR status NOT IN ('Active', 'Inactive')"
    )
    op.alter_column(
        'properties',
        'status',
        existing_type=sa.VARCHAR(length=20),
        nullable=False,
        server_default='Active',
    )


def downgrade() -> None:
    op.alter_column(
        'properties',
        'status',
        existing_type=sa.VARCHAR(length=20),
        nullable=True,
        server_default=None,
    )
