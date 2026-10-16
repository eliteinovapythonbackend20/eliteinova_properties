from typing import Any, Optional


async def resolve_display_name(user_repository: Any, vendor_profile_repository: Any, user_id: str) -> Optional[str]:
    customer = await user_repository.get_customer_by_user_id(user_id)
    if customer and customer.full_name:
        return customer.full_name

    vendor = await vendor_profile_repository.get_vendor_profile(user_id)
    if vendor and vendor.full_name:
        return vendor.full_name

    return None


async def resolve_avatar_url(user_repository: Any, vendor_profile_repository: Any, user_id: str, vendor_types: Any) -> Optional[str]:
    """vendor_types is accepted for call-site compatibility but no longer used:
    the vendor-profile JSON blobs no longer carry a file location (manual
    review of the legacy data is complete - see
    scripts/register_legacy_user_media.py), so the only source for a vendor's
    avatar is their current USER_MEDIA profile photo."""
    customer = await user_repository.get_customer_by_user_id(user_id)
    if customer and customer.profile_picture:
        return customer.profile_picture

    from app.models.file_asset import FileAsset
    from app.services.user_media_service import current_user_media

    db = getattr(vendor_profile_repository, "db", None)
    if db is not None:
        media = await current_user_media(db, user_id, "profile_photo")
        if media is not None:
            asset = await db.get(FileAsset, media.file_asset_id)
            if asset is not None and asset.file_url:
                return asset.file_url

    return None


async def resolve_phone_number(user_repository: Any, vendor_profile_repository: Any, user_id: str) -> Optional[str]:
    customer = await user_repository.get_customer_by_user_id(user_id)
    if customer and customer.phone_number:
        return customer.phone_number

    vendor = await vendor_profile_repository.get_vendor_profile(user_id)
    if vendor and vendor.phone_number:
        return vendor.phone_number

    return None
