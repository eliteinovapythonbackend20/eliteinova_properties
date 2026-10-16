"""add TOTP two-factor fields to users

Revision ID: c4a8e2d10f57
Revises: b3f7c1a9d245
Create Date: 2026-10-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c4a8e2d10f57'
down_revision: Union[str, None] = 'b3f7c1a9d245'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column('totp_enabled', sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.add_column('users', sa.Column('totp_secret', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('totp_verified_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('totp_last_counter', sa.BigInteger(), nullable=True))
    op.add_column(
        'users',
        sa.Column('totp_recovery_code_hashes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )


def downgrade() -> None:
    op.drop_column('users', 'totp_recovery_code_hashes')
    op.drop_column('users', 'totp_last_counter')
    op.drop_column('users', 'totp_verified_at')
    op.drop_column('users', 'totp_secret')
    op.drop_column('users', 'totp_enabled')
