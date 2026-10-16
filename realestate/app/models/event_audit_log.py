import enum

from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from app.core.database import Base


class EventStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"


EVENT_STATUSES = tuple(s.value for s in EventStatus)


class EventAuditLog(Base):
    """One application-wide activity record, shown as the admin "Recent Activities" feed.

    Reads as: [actor] + [activity] + [status], e.g. "Neha Gupta listed KYC Documents" -> COMPLETED.

    user_id and property_id are first-class navigation keys (filter by user or by
    property). They are foreign keys that go to NULL when the user or property is
    deleted, so the activity row itself survives. The entity_type/entity_id pair
    names the affected record (e.g. a document version).
    """

    __tablename__ = "event_audit_log"

    id = Column(Integer, primary_key=True, index=True)

    # Who the activity is about: the user who performed or owns the action.
    user_id = Column(String(20), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    # The related property, when the activity concerns one.
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="SET NULL"), nullable=True, index=True)

    actor_user_id = Column(String(20), nullable=True, index=True)
    actor_display_name = Column(String(255), nullable=True)
    actor_type = Column(String(30), nullable=False)  # user | vendor | admin | system (role of the actor)

    event_type = Column(String(60), nullable=False, index=True)    # machine identifier, e.g. LEADS_RECEIVED
    event_action = Column(String(40), nullable=False)              # verb that occurred, e.g. received
    display_message = Column(String(500), nullable=False)          # human-readable line for the feed

    entity_type = Column(String(40), nullable=True, index=True)    # property | document | lead | project ...
    entity_id = Column(String(64), nullable=True)

    # Named `metadata` in the database; `metadata` itself is reserved on declarative models.
    event_metadata = Column("metadata", JSONB, nullable=True)

    status = Column(String(20), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED')",
            name="ck_event_audit_log_status",
        ),
    )
