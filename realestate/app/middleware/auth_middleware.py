# from fastapi import Request, HTTPException, status
# from fastapi.security import HTTPBearer
# from starlette.middleware.base import BaseHTTPMiddleware
# from starlette.responses import JSONResponse
# from typing import Optional, List, Dict, Any
# import re
# from app.core.security import Security
# from app.repositories.user_repository import UserRepository
# from app.core.database import AsyncSessionLocal

# # Public routes that don't require authentication
# PUBLIC_ROUTES = [
#     r"^/api/v1/auth/register",
#     r"^/api/v1/auth/login",
#     r"^/api/v1/auth/refresh",
#     r"^/api/v1/auth/forgot-password",
#     r"^/api/v1/auth/reset-password",
#     r"^/api/v1/auth/verify-email",
#     r"^/api/v1/auth/resend-verification",
#     r"^/docs",
#     r"^/redoc",
#     r"^/openapi.json",
#     r"^/health",
#     r"^/$",
#     r"^/api/v1/properties/?$",  # GET properties (public)
#     r"^/api/v1/properties/filter",
#     r"^/api/v1/properties/by-posted-by",
#     r"^/api/v1/properties/by-category",
#     r"^/api/v1/properties/by-property-type",
#     r"^/api/v1/properties/by-purpose",
#     r"^/api/v1/properties/\d+/?$",  # GET single property
# ]

# class AuthMiddleware(BaseHTTPMiddleware):
#     """
#     Middleware for JWT authentication.
#     Validates tokens on protected routes.
#     """
    
#     def __init__(self, app, excluded_paths: Optional[List[str]] = None):
#         super().__init__(app)
#         self.excluded_paths = excluded_paths or []
#         self.security = HTTPBearer(auto_error=False)
    
#     def is_public_route(self, path: str, method: str) -> bool:
#         """Check if route is public"""
#         if method == "OPTIONS":
#             return True

#         all_public = PUBLIC_ROUTES + self.excluded_paths
        
#         for pattern in all_public:
#             if re.match(pattern, path):
#                 # Allow GET requests to public endpoints
#                 if method == "GET":
#                     return True
#                 # For non-GET, check if it's a specific public path
#                 if path.startswith("/api/v1/auth/"):
#                     return True
#                 if path.startswith("/docs") or path.startswith("/redoc"):
#                     return True
#                 if path.startswith("/openapi.json"):
#                     return True
#         return False
    
#     async def dispatch(self, request: Request, call_next):
#         """Process request through middleware"""
        
#         path = request.url.path
#         method = request.method
        
#         # Skip auth for public routes
#         if self.is_public_route(path, method):
#             response = await call_next(request)
#             return response
        
#         # Get authorization header
#         auth_header = request.headers.get("Authorization")
        
#         if not auth_header:
#             return JSONResponse(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 content={
#                     "detail": "Authentication required",
#                     "code": "UNAUTHORIZED"
#                 },
#                 headers={"WWW-Authenticate": "Bearer"}
#             )
        
#         try:
#             # Extract token
#             if " " not in auth_header:
#                 return JSONResponse(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     content={
#                         "detail": "Invalid token format. Use 'Bearer <token>'",
#                         "code": "INVALID_TOKEN_FORMAT"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
            
#             scheme, token = auth_header.split()
            
#             if scheme.lower() != "bearer":
#                 return JSONResponse(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     content={
#                         "detail": "Invalid authentication scheme. Use Bearer",
#                         "code": "INVALID_SCHEME"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
            
#             # Validate token - THIS CAN RAISE HTTPException
#             try:
#                 payload = Security.decode_token(token)
#             except HTTPException as e:
#                 # Catch HTTPException from decode_token and return proper response
#                 return JSONResponse(
#                     status_code=e.status_code,
#                     content={
#                         "detail": e.detail,
#                         "code": "TOKEN_ERROR"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
#             except Exception as e:
#                 # Catch any other token validation errors
#                 return JSONResponse(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     content={
#                         "detail": str(e) or "Invalid token",
#                         "code": "INVALID_TOKEN"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
            
#             # Check token type
#             if payload.get("type") != "access":
#                 return JSONResponse(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     content={
#                         "detail": "Invalid token type",
#                         "code": "INVALID_TOKEN_TYPE"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
            
#             # Check if user exists and is active
#             user_id = payload.get("user_id")
#             if not user_id:
#                 return JSONResponse(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     content={
#                         "detail": "Invalid token payload",
#                         "code": "INVALID_TOKEN"
#                     },
#                     headers={"WWW-Authenticate": "Bearer"}
#                 )
            
#             # Verify user in database
#             try:
#                 async with AsyncSessionLocal() as db:
#                     user_repo = UserRepository(db)
#                     user = await user_repo.get_user_by_id(user_id)
                    
#                     if not user:
#                         return JSONResponse(
#                             status_code=status.HTTP_401_UNAUTHORIZED,
#                             content={
#                                 "detail": "User not found",
#                                 "code": "USER_NOT_FOUND"
#                             },
#                             headers={"WWW-Authenticate": "Bearer"}
#                         )
                    
#                     if not user.is_active:
#                         return JSONResponse(
#                             status_code=status.HTTP_403_FORBIDDEN,
#                             content={
#                                 "detail": "Account is deactivated",
#                                 "code": "ACCOUNT_INACTIVE"
#                             }
#                         )
#             except Exception as db_error:
#                 print(f"Database error in auth middleware: {db_error}")
#                 return JSONResponse(
#                     status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                     content={
#                         "detail": "Database error occurred",
#                         "code": "DB_ERROR"
#                     }
#                 )
            
#             # Store user info in request state
#             request.state.user = {
#                 "user_id": user_id,
#                 "email": payload.get("email"),
#                 "role": payload.get("role"),
#                 "payload": payload
#             }
            
#             # Continue to endpoint
#             response = await call_next(request)
#             return response
            
#         except ValueError as e:
#             # Invalid token format
#             return JSONResponse(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 content={
#                     "detail": "Invalid token format",
#                     "code": "INVALID_TOKEN_FORMAT"
#                 },
#                 headers={"WWW-Authenticate": "Bearer"}
#             )
#         except HTTPException as e:
#             # Re-raise HTTP exceptions (should not happen due to our handling above)
#             # But if it does, return proper response
#             return JSONResponse(
#                 status_code=e.status_code,
#                 content={
#                     "detail": e.detail,
#                     "code": "HTTP_EXCEPTION"
#                 },
#                 headers={"WWW-Authenticate": "Bearer"}
#             )
#         except Exception as e:
#             print(f"Unexpected error in AuthMiddleware: {e}")
#             import traceback
#             traceback.print_exc()
#             return JSONResponse(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 content={
#                     "detail": "Authentication error occurred",
#                     "code": "AUTH_ERROR"
#                 }
#             )














from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import Optional, List
import re
from app.core.security import Security
from app.repositories.user_repository import UserRepository
from app.core.database import AsyncSessionLocal

# Public routes that don't require authentication
PUBLIC_ROUTES = [
    r"^/api/v1/auth/register",
    r"^/api/v1/auth/login",
    r"^/api/v1/auth/refresh",
    r"^/api/v1/auth/forgot-password",
    r"^/api/v1/auth/reset-password",
    r"^/api/v1/auth/verify-email",
    r"^/api/v1/auth/resend-verification",
    r"^/api/v1/auth/test-email-config",
    r"^/docs",
    r"^/redoc",
    r"^/openapi.json",
    r"^/health",
    r"^/$",
    r"^/api/v1/properties/?$",
    r"^/api/v1/properties/\d+/?$",
    r"^/api/v1/properties/by-category",
    r"^/api/v1/properties/by-property-type",
    r"^/api/v1/properties/by-purpose",
    r"^/api/v1/filters/",
]

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware for JWT authentication.
    Validates tokens on protected routes.
    """
    
    def __init__(self, app, excluded_paths: Optional[List[str]] = None):
        super().__init__(app)
        self.excluded_paths = excluded_paths or []
        self.security = HTTPBearer(auto_error=False)
    
    def is_public_route(self, path: str, method: str) -> bool:
        """Check if route is public"""
        if method == "OPTIONS":
            return True

        all_public = PUBLIC_ROUTES + self.excluded_paths
        
        for pattern in all_public:
            if re.match(pattern, path):
                if method == "GET":
                    return True
                if path.startswith("/api/v1/auth/"):
                    return True
                if path.startswith("/api/v1/filters/"):
                    return True
                if path.startswith("/docs") or path.startswith("/redoc"):
                    return True
                if path.startswith("/openapi.json"):
                    return True
        return False
    
    async def dispatch(self, request: Request, call_next):
        """Process request through middleware"""
        
        path = request.url.path
        method = request.method
        origin = request.headers.get("origin")
        
        # Helper to create error responses with CORS headers
        def create_error_response(status_code, content, headers=None):
            response_headers = {
                "WWW-Authenticate": "Bearer",
                "Access-Control-Allow-Origin": origin or "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            }
            if headers:
                response_headers.update(headers)
            return JSONResponse(
                status_code=status_code,
                content=content,
                headers=response_headers
            )
        
        # Skip auth for public routes
        if self.is_public_route(path, method):
            response = await call_next(request)
            if origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
        
        # Get authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return create_error_response(
                status.HTTP_401_UNAUTHORIZED,
                {
                    "detail": "Authentication required",
                    "code": "UNAUTHORIZED"
                }
            )
        
        try:
            if " " not in auth_header:
                return create_error_response(
                    status.HTTP_401_UNAUTHORIZED,
                    {
                        "detail": "Invalid token format. Use 'Bearer <token>'",
                        "code": "INVALID_TOKEN_FORMAT"
                    }
                )
            
            scheme, token = auth_header.split()
            
            if scheme.lower() != "bearer":
                return create_error_response(
                    status.HTTP_401_UNAUTHORIZED,
                    {
                        "detail": "Invalid authentication scheme. Use Bearer",
                        "code": "INVALID_SCHEME"
                    }
                )
            
            try:
                payload = Security.decode_token(token)
            except HTTPException as e:
                return create_error_response(
                    e.status_code,
                    {
                        "detail": e.detail,
                        "code": "TOKEN_ERROR"
                    }
                )
            except Exception as e:
                return create_error_response(
                    status.HTTP_401_UNAUTHORIZED,
                    {
                        "detail": str(e) or "Invalid token",
                        "code": "INVALID_TOKEN"
                    }
                )
            
            # Check token type
            if payload.get("type") != "access":
                return create_error_response(
                    status.HTTP_401_UNAUTHORIZED,
                    {
                        "detail": "Invalid token type",
                        "code": "INVALID_TOKEN_TYPE"
                    }
                )
            
            user_id = payload.get("user_id")
            if not user_id:
                return create_error_response(
                    status.HTTP_401_UNAUTHORIZED,
                    {
                        "detail": "Invalid token payload",
                        "code": "INVALID_TOKEN"
                    }
                )
            
            try:
                async with AsyncSessionLocal() as db:
                    user_repo = UserRepository(db)
                    user = await user_repo.get_user_by_id(user_id)
                    
                    if not user:
                        return create_error_response(
                            status.HTTP_401_UNAUTHORIZED,
                            {
                                "detail": "User not found",
                                "code": "USER_NOT_FOUND"
                            }
                        )
                    
                    if not user.is_active:
                        return create_error_response(
                            status.HTTP_403_FORBIDDEN,
                            {
                                "detail": "Account is deactivated",
                                "code": "ACCOUNT_INACTIVE"
                            }
                        )
            except Exception as db_error:
                print(f"Database error in auth middleware: {db_error}")
                return create_error_response(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    {
                        "detail": "Database error occurred",
                        "code": "DB_ERROR"
                    }
                )
            
            # Store user info in request state
            request.state.user = {
                "user_id": user_id,
                "role": payload.get("role"),
                "payload": payload
            }
            
            # Continue to endpoint
            response = await call_next(request)
            
            # Add CORS headers to successful response
            if origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
            
            return response
            
        except ValueError as e:
            return create_error_response(
                status.HTTP_401_UNAUTHORIZED,
                {
                    "detail": "Invalid token format",
                    "code": "INVALID_TOKEN_FORMAT"
                }
            )
        except Exception as e:
            print(f"Unexpected error in AuthMiddleware: {e}")
            import traceback
            traceback.print_exc()
            return create_error_response(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                {
                    "detail": "Authentication error occurred",
                    "code": "AUTH_ERROR"
                }
            )