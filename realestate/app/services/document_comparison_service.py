# app/services/document_comparison_service.py
#
# Read-only comparison of the legacy vendor-document data (JSONB "documents"
# blobs and property_documents rows with no property) against user_documents.
# Used to validate the read switch before user_documents becomes the normal read
# source. Writes nothing.

from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.document_catalog import DocumentLevel, level_for, resolve_document_key
from app.core.storage.locator import parse_file_url
from app.models.file_asset import FileAsset
from app.models.property_document import PropertyDocument
from app.models.user_document import UserDocument
from app.models.vendor_profile import VendorProfile

ROLE_BLOB_COLUMNS = ("agency_details", "builder_details", "pm_details", "owner_details")
MEDIA_KEYS = {"profile_photo", "passport_photo", "company_logo", "agency_logo"}
ACCEPTED_STATUSES = {"legacy", "pending", "verified"}


def _locator_matches(asset: FileAsset, stored_url: str) -> bool:
    locator = parse_file_url(stored_url)
    return (
        asset.storage_provider == locator.storage_provider
        and asset.storage_key == locator.storage_key
        and (asset.bucket or None) == (locator.bucket or None)
    )


async def compare_vendor_documents(db: AsyncSession) -> Dict[str, Any]:
    checked = 0
    matched = 0
    mismatches: List[Dict[str, Any]] = []

    def report(source: str, user_id: str, key: str, reason: str, stored: Optional[str]) -> None:
        mismatches.append({"source": source, "user_id": user_id, "document_key": key, "reason": reason, "stored_url": stored})

    # 1. JSONB blob documents (vendor_profile role blobs)
    profiles = (await db.execute(select(VendorProfile))).scalars().all()
    for profile in profiles:
        for column in ROLE_BLOB_COLUMNS:
            documents = (getattr(profile, column) or {}).get("documents") or {}
            for doc_type, meta in documents.items():
                if doc_type in MEDIA_KEYS or not meta or not meta.get("storedPath"):
                    continue
                checked += 1
                source = f"vendor_profile.{column}"
                stored = meta["storedPath"]
                key = resolve_document_key(doc_type, property_scoped=False)
                if level_for(key) != DocumentLevel.USER_DOCUMENT:
                    report(source, profile.user_id, key, "key is not a user-level document", stored)
                    continue
                rows = (await db.execute(
                    select(UserDocument, FileAsset)
                    .join(FileAsset, FileAsset.id == UserDocument.file_asset_id)
                    .where(UserDocument.user_id == profile.user_id, UserDocument.document_key == key)
                )).all()
                match = next(((r, a) for r, a in rows if _locator_matches(a, stored)), None)
                if match is None:
                    report(source, profile.user_id, key, "no user_documents version points at this stored file", stored)
                    continue
                row, asset = match
                if row.status not in ACCEPTED_STATUSES:
                    report(source, profile.user_id, key, f"unexpected status '{row.status}'", stored)
                    continue
                matched += 1

    # 2. property_documents rows with no property (legacy vendor documents)
    vendor_rows = (await db.execute(
        select(PropertyDocument).where(PropertyDocument.property_id.is_(None))
    )).scalars().all()
    for doc in vendor_rows:
        checked += 1
        key = resolve_document_key(doc.document_type, property_scoped=False)
        if not doc.file_url:
            report("property_documents", doc.user_id, key, "legacy row has no stored file (left in legacy storage)", None)
            continue
        row = (await db.execute(
            select(UserDocument).where(
                UserDocument.user_id == doc.user_id,
                UserDocument.document_key == key,
                UserDocument.legacy_source == "property_documents",
                UserDocument.legacy_ref == str(doc.id),
            )
        )).scalar_one_or_none()
        if row is None:
            report("property_documents", doc.user_id, key, "no user_documents row for this legacy document", doc.file_url)
            continue
        asset = await db.get(FileAsset, row.file_asset_id)
        if asset is None or not _locator_matches(asset, doc.file_url):
            report("property_documents", doc.user_id, key, "storage location differs", doc.file_url)
            continue
        matched += 1

    return {"checked": checked, "matched": matched, "mismatch_count": len(mismatches), "mismatches": mismatches}
