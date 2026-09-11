"""add_user_id_to_properties

Revision ID: a1a7bcc60748
Revises: 7b6e75375387
Create Date: 2026-08-03 12:14:18.957825

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1a7bcc60748'
down_revision: Union[str, None] = '7b6e75375387'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
