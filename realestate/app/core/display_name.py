from typing import Any, Optional


async def resolve_display_name(user_repository: Any, vendor_profile_repository: Any, user_id: str) -> Optional[str]:
    customer = await user_repository.get_customer_by_user_id(user_id)
    if customer and customer.full_name:
        return customer.full_name

    vendor = await vendor_profile_repository.get_vendor_profile(user_id)
    if vendor and vendor.full_name:
        return vendor.full_name

    return None


async def resolve_phone_number(user_repository: Any, vendor_profile_repository: Any, user_id: str) -> Optional[str]:
    customer = await user_repository.get_customer_by_user_id(user_id)
    if customer and customer.phone_number:
        return customer.phone_number

    vendor = await vendor_profile_repository.get_vendor_profile(user_id)
    if vendor and vendor.phone_number:
        return vendor.phone_number

    return None
