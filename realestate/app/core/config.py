import os
from typing import Optional, List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

current_profile = os.getenv("ENVIRONMENT", "development")
env_filename = f".env.{current_profile}"

if not os.path.exists(env_filename):
    env_filename = ".env"


class Settings(BaseSettings):

    APP_NAME: str = "Eliteinova Property"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development" 
    
    # Database
    DATABASE_URL: str = ""
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40
    DATABASE_ECHO: bool = False

    # JWT Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    #Email
    SMTP_USERNAME: str="eliteinovapythonbackend20@gmail.com"
    SMTP_PASSWORD: str="nrfoszsdctajdnje"
    SMTP_FROM_EMAIL: str="eliteinovapythonbackend20@gmail.com"
    SMTP_PORT: int=465
    SMTP_FROM_NAME: str
    SMTP_HOST: str="smtp.gmail.com"
    SMTP_USE_TLS: bool=True
    SMTP_USE_SSL: bool=False
    SMTP_TIMEOUT: int

    FRONTEND_URL: str=""

    RESET_TOKEN_EXPIRE_HOURS: int = 1
    VERIFICATION_TOKEN_EXPIRE_HOURS: int = 1


    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    
    # GCS
    GCS_BUCKET_NAME: str = "property-bucket"
    GCS_UPLOAD_WORKERS: int = 10
    GCS_PROJECT_ID: Optional[str] = None
    GCS_CREDENTIALS_PATH: Optional[str] = None
    
    # Image Compression
    IMAGE_MAX_WIDTH: int = 1200
    IMAGE_MAX_HEIGHT: int = 1200
    IMAGE_QUALITY: int = 80
    IMAGE_FORMAT: str = "WEBP"
    IMAGE_THUMBNAIL_SIZE: int = 300
    
    # Cache Settings
    CACHE_IMAGES_SECONDS: int = 31536000   
    CACHE_VIDEOS_SECONDS: int = 604800     
    CACHE_DOCUMENTS_SECONDS: int = 86400   
    CACHE_PROFILE_IMAGES_SECONDS: int = 31536000  
    
    # Storage Classes
    STORAGE_IMAGES: str = "STANDARD"
    STORAGE_VIDEOS: str = "STANDARD"
    STORAGE_DOCUMENTS: str = "NEARLINE"
    STORAGE_PROFILE_IMAGES: str = "STANDARD"

    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = "*"
    CORS_ALLOW_CREDENTIALS: bool = False
    ALLOWED_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    ALLOWED_HEADERS: List[str] = ["*"]

    # Storage Selection
    STORAGE_TYPE: str = "cloudinary"
    LOCAL_STORAGE_PATH: str = "./uploads"

    # Validator to cleanly parse comma-separated string domains into a Python list
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[str, List[str]]:
        if isinstance(v, str) and v != "*":
            return [item.strip() for item in v.split(",") if item.strip()]
        return v
    
    # 💡 THIS WAS THE MISSING LINK: Tell Pydantic to read our dynamically chosen profile file
    model_config = SettingsConfigDict(
        env_file=env_filename,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore" # Prevents crashing if extra unwanted variables exist in your .env
    )

# Instantiate the settings cleanly
settings = Settings()
