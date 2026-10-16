"""allow the office ('O') letter in the user id format check

Revision ID: f4a1c7e9b3d8
Revises: 83e45d6871ca
Create Date: 2026-10-08 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'f4a1c7e9b3d8'
down_revision: Union[str, None] = '83e45d6871ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('check_user_id_format', 'users', type_='check')
    op.create_check_constraint(
        'check_user_id_format',
        'users',
        "id ~ '^EP[0-9]{6}[CVAO][0-9]{5}$'",
    )


def downgrade() -> None:
    op.drop_constraint('check_user_id_format', 'users', type_='check')
    op.create_check_constraint(
        'check_user_id_format',
        'users',
        "id ~ '^EP[0-9]{6}[CVA][0-9]{5}$'",
    )
