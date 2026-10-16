"""add password reset otp fields to users

Revision ID: a7e2c9d4f5b1
Revises: f4a1c7e9b3d8
Create Date: 2026-10-09 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7e2c9d4f5b1'
down_revision: Union[str, None] = 'f4a1c7e9b3d8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('reset_otp_sent_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column(
        'users',
        sa.Column('reset_otp_attempts', sa.Integer(), server_default='0', nullable=False),
    )


def downgrade() -> None:
    op.drop_column('users', 'reset_otp_attempts')
    op.drop_column('users', 'reset_otp_sent_at')
