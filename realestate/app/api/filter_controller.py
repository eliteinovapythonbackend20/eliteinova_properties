from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user_optional
from app.core.database import get_db
from app.core.response_utils import strip_none_values
from app.repositories.property_repository import PropertyRepository
from app.schemas.property_filter import PropertyFilter
from app.services.filter_service import FilterService

router = APIRouter()


async def get_filter_service(db: AsyncSession = Depends(get_db)) -> FilterService:
    return FilterService(PropertyRepository(db))


@router.post("/search", status_code=status.HTTP_200_OK)
async def search_properties_post(
    filters: PropertyFilter,
    service: FilterService = Depends(get_filter_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    """Advanced property search. Public - anonymous visitors may browse."""
    return strip_none_values(await service.search(filters))


@router.get("/search")
async def search_properties_get(
    request: Request,
    service: FilterService = Depends(get_filter_service),
):
    """Same as POST /search but reads flat query params (camelCase or snake_case)."""
    params: Dict[str, Any] = {}
    for key, value in request.query_params.multi_items():
        if key in params:
            existing = params[key]
            params[key] = existing + [value] if isinstance(existing, list) else [existing, value]
        else:
            params[key] = value
    filters = PropertyFilter.model_validate(params)
    return strip_none_values(await service.search(filters))


@router.get("/category/sub_category")
async def get_properties_by_sub_category(
    sub_category: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    service: FilterService = Depends(get_filter_service),
):
    if not sub_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="sub_category parameter is required",
        )
    return strip_none_values(
        await service.get_sub_category_data(sub_category=sub_category, page=page, limit=limit)
    )
