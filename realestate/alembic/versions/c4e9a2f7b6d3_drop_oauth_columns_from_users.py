"""drop oauth columns from users

Revision ID: c4e9a2f7b6d3
Revises: b3f6c8a1d7e2
Create Date: 2026-10-14 00:00:00.000000

AuthService.oauth_login was a dead TODO stub (fabricated a fake email from
the auth code, never actually exchanged it with a provider) with no UI entry
point calling it on either frontend. OAuth login is not going to be
implemented, so the route, schema, service method, repository methods
(create_oauth_user/get_by_oauth_provider), and these two backing columns are
all removed together rather than left as unreachable dead code.

Verified before writing this migration: zero users have oauth_provider or
oauth_provider_id set, so there is nothing to lose.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = 'c4e9a2f7b6d3'
down_revision: Union[str, None] = 'b3f6c8a1d7e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('users', 'oauth_provider')
    op.drop_column('users', 'oauth_provider_id')


def downgrade() -> None:
    op.add_column('users', sa.Column('oauth_provider_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('oauth_provider', sa.String(length=50), nullable=True))
