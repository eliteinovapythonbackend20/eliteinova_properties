from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import engine, Base
from app.api import admin_controller, auth_controller, filter_controller, profile_controller, property_controller
from app.middleware.auth_middleware import AuthMiddleware
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.api import payment_controller
from app.api import admin_dashboard_controller



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Real Estate API...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database connected and tables ready")
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise
    yield
    print("Shutting down...")
    await engine.dispose()
    print("Database connections closed")

app = FastAPI(
    title="Real Estate API",
    description="Property Listing API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["WWW-Authenticate"],
    max_age=3600
)
app.add_middleware(
    AuthMiddleware,
    excluded_paths=[
        r"^/api/v1/auth/register",
        r"^/api/v1/auth/login",
        r"^/api/v1/auth/refresh",
        r"^/api/v1/auth/forgot-password",
        r"^/api/v1/auth/reset-password",
        r"^/docs",
        r"^/redoc",
        r"^/openapi.json",
        r"^/health",
        r"^/api/v1/properties/?$",  # GET properties (public)
        r"^/api/v1/properties/by-category",
        r"^/api/v1/properties/by-property-type",
        r"^/api/v1/properties/by-purpose",
        r"^/api/v1/properties/[A-Za-z0-9]+/?$",  # GET single property (string IDs like EP202608I00001)
        r"^/api/v1/filters/",  # public search + browse (GET and POST)
    ]
)
app.include_router(
    auth_controller.router,
    prefix="/api/v1",  # This will make it /api/v1/auth/register, /api/v1/auth/login
    tags=["Authentication"]
)
app.include_router(property_controller.router, prefix="/api/v1/properties", tags=["Properties"])

app.include_router(filter_controller.router, prefix="/api/v1/filters", tags=["Filters"])

app.include_router(profile_controller.router, prefix="/api/v1/profile", tags=["Profile"])

app.include_router(admin_controller.router, prefix="/api/v1/admin", tags=["Admin"])

app.include_router(payment_controller.router,prefix="/api/v1/payments", tags=["payment"])

app.include_router(admin_dashboard_controller.router, prefix="/api/v1/admin/dashboard", tags=["Admin Dashboard"])
@app.get("/")
async def root():
    return {
        "message": "Real Estate APP is running!",
        "version": "2.0.0",
        "docs": "/docs",
        "endpoints": {
            "create": "POST /api/v1/properties",
            "list": "GET /api/v1/properties?page=1&limit=20",
            "details": "GET /api/v1/properties/{id}",
            "update": "PUT /api/v1/properties/{id}",
            "delete": "DELETE /api/v1/properties/{id}"
        }
    }