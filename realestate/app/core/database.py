import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings
import ssl


db_url = settings.DATABASE_URL

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif not db_url.startswith("postgresql+asyncpg://"):
    raise ValueError("DATABASE_URL must be a PostgreSQL connection string")

# ssl_context = ssl.create_default_context()


engine = create_async_engine(
    db_url,
    echo=settings.DATABASE_ECHO,
    poolclass=NullPool, 
    pool_pre_ping=True,
    # connect_args = {"ssl":ssl_context},
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            # `async with` handles closing automatically, but explicitly calling it is safe
            await session.close()

# Initialize database
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Close database connection
async def close_db():
    await engine.dispose()


# Dev

# app/core/database.py

# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
# from sqlalchemy.orm import declarative_base
# from sqlalchemy.pool import NullPool, AsyncAdaptedQueuePool
# from app.core.config import settings

# # Create async engine
# engine = create_async_engine(
#     settings.DATABASE_URL,
#     echo=settings.DATABASE_ECHO,
#     pool_size=settings.DATABASE_POOL_SIZE,
#     max_overflow=settings.DATABASE_MAX_OVERFLOW,
#     pool_pre_ping=True,
#     pool_recycle=3600,
# )

# # Create async session factory
# AsyncSessionLocal = async_sessionmaker(
#     engine,
#     class_=AsyncSession,
#     expire_on_commit=False,
#     autocommit=False,
#     autoflush=False,
# )

# # Base class for models
# Base = declarative_base()

# # Dependency to get DB session
# async def get_db() -> AsyncSession: # type: ignore
#     async with AsyncSessionLocal() as session:
#         try:
#             yield session
#         finally:
#             await session.close()

# # Initialize database
# async def init_db():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

# # Close database connection
# async def close_db():
#     await engine.dispose()