"""add event_audit_log (application-wide activity feed)

Creates one common table for activities across the application, read by the admin
Recent Activities feed. Creates a new table only; no existing row changes.
user_id and property_id are foreign keys set to NULL on delete, so the history survives deletion of the records it refers to.

Revision ID: a9c3e5f7b1d2
Revises: e7d1b4c9a205
Create Date: 2026-10-06 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a9c3e5f7b1d2'
down_revision: Union[str, None] = 'e7d1b4c9a205'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'event_audit_log',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String(length=20), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('property_id', sa.String(length=20), sa.ForeignKey('properties.id', ondelete='SET NULL'), nullable=True),
        sa.Column('actor_user_id', sa.String(length=20), nullable=True),
        sa.Column('actor_display_name', sa.String(length=255), nullable=True),
        sa.Column('actor_type', sa.String(length=30), nullable=False),
        sa.Column('event_type', sa.String(length=60), nullable=False),
        sa.Column('event_action', sa.String(length=40), nullable=False),
        sa.Column('display_message', sa.String(length=500), nullable=False),
        sa.Column('entity_type', sa.String(length=40), nullable=True),
        sa.Column('entity_id', sa.String(length=64), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint(
            "status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED')",
            name='ck_event_audit_log_status',
        ),
    )
    op.create_index('ix_event_audit_log_id', 'event_audit_log', ['id'])
    op.create_index('ix_event_audit_log_user_id', 'event_audit_log', ['user_id'])
    op.create_index('ix_event_audit_log_property_id', 'event_audit_log', ['property_id'])
    op.create_index('ix_event_audit_log_actor_user_id', 'event_audit_log', ['actor_user_id'])
    op.create_index('ix_event_audit_log_event_type', 'event_audit_log', ['event_type'])
    op.create_index('ix_event_audit_log_entity_type', 'event_audit_log', ['entity_type'])
    op.create_index('ix_event_audit_log_status', 'event_audit_log', ['status'])
    op.create_index('ix_event_audit_log_created_at', 'event_audit_log', ['created_at'])


def downgrade() -> None:
    op.drop_table('event_audit_log')
