from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from sqlalchemy.engine import make_url
from app.core.config import settings
import ssl


db_url = settings.DATABASE_URL


# Convert PostgreSQL URL to asyncpg URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace(
        "postgres://",
        "postgresql+asyncpg://",
        1
    )

elif db_url.startswith("postgresql://"):
    db_url = db_url.replace(
        "postgresql://",
        "postgresql+asyncpg://",
        1
    )

elif not db_url.startswith("postgresql+asyncpg://"):
    raise ValueError(
        "DATABASE_URL must be a PostgreSQL connection string"
    )


# Remove PostgreSQL/libpq parameters that should not
# be passed to asyncpg as connection arguments
url = make_url(db_url)

url = url.difference_update_query([
    "sslmode",
    "channel_binding",
])

db_url = url.render_as_string(hide_password=False)


# SSL configuration for asyncpg
ssl_context = ssl.create_default_context()


engine = create_async_engine(
    db_url,
    echo=settings.DATABASE_ECHO,
    poolclass=NullPool,
    pool_pre_ping=True,
    connect_args={
        "ssl": ssl_context,
    },
)


AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    await engine.dispose()
