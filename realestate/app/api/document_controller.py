# app/api/document_controller.py
#
# HTTP surface for the document foundation:
#   user_router    /api/v1/users/me/documents       the caller's own documents
#   admin_router   /api/v1/admin/documents          verification (user and property
#                                                   versions), history, migration check
#   stream_router  /uploads/{path}                  guarded public media (private paths refused)
#                  /api/v1/documents/stream         signed-token stream for private files
#
# Controllers only parse input and shape output. Rules live in the services.

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin, require_authenticated
from app.core.database import get_db
from app.core.storage.local_storage import LocalStorage
from app.core.storage_factory import StorageFactory
from app.models.file_asset import FileAsset
from app.models.property_document import PropertyDocument
from app.models.user_document import UserDocument
from app.repositories.document_repository import UserDocumentRepository
from app.schemas.common_response import SuccessMessageResponse, SuccessResponse, UrlResult
from app.schemas.document_card import DocumentVersionView, MigrationComparisonResult, PropertyDocumentVersionView
from app.services.document_access_service import DocumentAccessService
from app.services.document_comparison_service import compare_vendor_documents
from app.services.document_verification_service import DocumentVerificationService
from app.services.property_document_service import PropertyDocumentService
from app.services.user_document_service import UserDocumentService

user_router = APIRouter(prefix="/api/v1/users/me/documents", tags=["User Documents"])
admin_router = APIRouter(prefix="/api/v1/admin/documents", tags=["Admin Documents"])
stream_router = APIRouter(tags=["Document Access"])


class RejectRequest(BaseModel):
    reason: str = Field(..., min_length=1, max_length=2000)


def _version_view(row: UserDocument, asset: Optional[FileAsset] = None) -> Dict[str, Any]:
    """What the API returns for a version. Never the stored URL or any signed URL."""
    return {
        "id": row.id,
        "documentKey": row.document_key,
        "version": row.version,
        "status": row.status,
        "isCurrent": row.is_current,
        "rejectionReason": row.rejection_reason,
        "verifiedAt": row.verified_at.isoformat() if row.verified_at else None,
        "verifiedBy": row.verified_by,
        "originalName": asset.original_name if asset else None,
        "mimeType": asset.mime_type if asset else None,
        "sizeBytes": asset.size_bytes if asset else None,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
    }


def _property_version_view(row: PropertyDocument) -> Dict[str, Any]:
    """A property document version. Never the stored URL or any signed URL."""
    return {
        "id": row.id,
        "propertyId": row.property_id,
        "userId": row.user_id,
        "documentKey": row.document_key or row.document_type,
        "version": row.version,
        "status": row.status,
        "isCurrent": row.is_current,
        "rejectionReason": row.rejection_reason,
        "verifiedAt": row.verified_at.isoformat() if row.verified_at else None,
        "verifiedBy": row.verified_by,
        "fileName": row.file_name,
        "mimeType": row.mime_type,
        "createdAt": row.created_at.isoformat() if row.created_at else None,
    }


# ---------------------------------------------------------------------------
# User documents
# ---------------------------------------------------------------------------

@user_router.get("", response_model=SuccessResponse[List[DocumentVersionView]])
async def list_my_documents(
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    service = UserDocumentService(db)
    rows = await service.list_current(current_user["user_id"])
    return SuccessResponse[List[DocumentVersionView]](
        data=[DocumentVersionView.model_validate(_version_view(r)) for r in rows]
    )


@user_router.get("/{document_key}", response_model=SuccessResponse[DocumentVersionView])
async def get_my_document(
    document_key: str,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    service = UserDocumentService(db)
    row = await service.get_current(current_user["user_id"], document_key)
    return SuccessResponse[DocumentVersionView](data=DocumentVersionView.model_validate(_version_view(row)))


@user_router.post("/{document_key}", response_model=SuccessResponse[DocumentVersionView])
async def upload_my_document(
    document_key: str,
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    """Upload a new version. It is pending until an admin verifies it; the
    live version stays live meanwhile."""
    service = UserDocumentService(db)
    row = await service.upload_version(user_id=current_user["user_id"], raw_key=document_key, file=file)
    return SuccessResponse[DocumentVersionView](
        data=DocumentVersionView.model_validate(_version_view(row)), message="Uploaded for verification"
    )


@user_router.delete("/{document_key}", response_model=SuccessMessageResponse)
async def delete_my_document(
    document_key: str,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    service = UserDocumentService(db)
    await service.release(user_id=current_user["user_id"], raw_key=document_key)
    return SuccessMessageResponse(message="Document removed. Its history is kept.")


@user_router.get("/{document_key}/access-url", response_model=SuccessResponse[UrlResult])
async def my_document_access_url(
    document_key: str,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    db: AsyncSession = Depends(get_db),
):
    """A short-lived signed URL, minted on this call only."""
    service = UserDocumentService(db)
    url = await service.access_url(requester=current_user, raw_key=document_key)
    return SuccessResponse[UrlResult](data=UrlResult(url=url))


# ---------------------------------------------------------------------------
# Admin: verification, history, access, migration check
# ---------------------------------------------------------------------------

@admin_router.get("/users/{user_id}", response_model=SuccessResponse[List[DocumentVersionView]])
async def admin_user_document_history(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Every version of every document for a user, including superseded ones."""
    rows = await UserDocumentRepository(db).list_versions(user_id)
    out = []
    for row in rows:
        asset = await db.get(FileAsset, row.file_asset_id)
        out.append(DocumentVersionView.model_validate(_version_view(row, asset)))
    return SuccessResponse[List[DocumentVersionView]](data=out)


@admin_router.get("/versions/{document_id}/access-url", response_model=SuccessResponse[UrlResult])
async def admin_version_access_url(
    document_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    row = await UserDocumentRepository(db).get(document_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document version not found")
    url = await DocumentAccessService(db).issue_user_document_url(requester=current_user, row=row)
    return SuccessResponse[UrlResult](data=UrlResult(url=url))


@admin_router.post("/versions/{document_id}/verify", response_model=SuccessResponse[DocumentVersionView])
async def admin_verify_version(
    document_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    row = await DocumentVerificationService(db).verify(admin=current_user, document_id=document_id)
    return SuccessResponse[DocumentVersionView](data=DocumentVersionView.model_validate(_version_view(row)))


@admin_router.post("/versions/{document_id}/reject", response_model=SuccessResponse[DocumentVersionView])
async def admin_reject_version(
    document_id: int,
    body: RejectRequest,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    row = await DocumentVerificationService(db).reject(
        admin=current_user, document_id=document_id, reason=body.reason
    )
    return SuccessResponse[DocumentVersionView](data=DocumentVersionView.model_validate(_version_view(row)))


@admin_router.post(
    "/property-versions/{document_id}/verify",
    response_model=SuccessResponse[PropertyDocumentVersionView],
)
async def admin_verify_property_version(
    document_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Verify a pending property document. The previous live version is superseded and kept."""
    row = await PropertyDocumentService(db).verify(admin=current_user, document_id=document_id)
    return SuccessResponse[PropertyDocumentVersionView](
        data=PropertyDocumentVersionView.model_validate(_property_version_view(row))
    )


@admin_router.post(
    "/property-versions/{document_id}/reject",
    response_model=SuccessResponse[PropertyDocumentVersionView],
)
async def admin_reject_property_version(
    document_id: int,
    body: RejectRequest,
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Reject a pending property document with a reason. The live version stays live."""
    row = await PropertyDocumentService(db).reject(
        admin=current_user, document_id=document_id, reason=body.reason
    )
    return SuccessResponse[PropertyDocumentVersionView](
        data=PropertyDocumentVersionView.model_validate(_property_version_view(row))
    )


@admin_router.get("/migration-comparison", response_model=SuccessResponse[MigrationComparisonResult])
async def admin_migration_comparison(
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Read-only check of legacy JSONB/property document data against user_documents."""
    result = await compare_vendor_documents(db)
    return SuccessResponse[MigrationComparisonResult](data=MigrationComparisonResult.model_validate(result))


# ---------------------------------------------------------------------------
# Serving files
# ---------------------------------------------------------------------------

@stream_router.get("/uploads/{path:path}")
async def serve_public_upload(path: str, db: AsyncSession = Depends(get_db)):
    """Serves public media from local storage. Anything recorded as a private
    document is refused, whatever is_public says. The /uploads static mount is
    gone, so this is the only route to these files."""
    storage = StorageFactory.get_storage("public")
    if not isinstance(storage, LocalStorage):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if await DocumentAccessService(db).is_private_local_key(path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    full = storage.path_for_key(path)
    if full is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return FileResponse(full)


@stream_router.get("/api/v1/documents/stream")
async def stream_private_document(token: str, db: AsyncSession = Depends(get_db)):
    """Streams a private file to a holder of a valid, unexpired signed token."""
    path = await DocumentAccessService(db).stream_path(token)
    _, claims = LocalStorage.read_stream_token(token)
    if claims.get("kind") == "media":
        # Media may be cached by the browser for 7 days; the signed URL is still short-lived.
        return FileResponse(path, headers={"Cache-Control": "private, max-age=604800", "Content-Disposition": "inline"})
    return FileResponse(path, headers={"Cache-Control": "no-store", "Content-Disposition": "inline"})
