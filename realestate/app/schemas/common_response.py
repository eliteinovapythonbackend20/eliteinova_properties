"""Generic {success, data, message} envelope - the shape nearly every
controller in this app already builds by hand via
strip_none_values({"success": True, "data": ..., "message": ...}).
Declaring it once, parameterized by the payload's own type, replaces that
repeated raw-dict construction with an explicit, validated response object
wherever that envelope is used.
"""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None


class DataResponse(BaseModel, Generic[T]):
    """A bare {data: ...} envelope, no success/message - matches the handful
    of routes that only ever built that shape (never conflate with
    SuccessResponse, which would add a success key nothing today returns)."""

    data: Optional[T] = None


class SimpleSuccessResponse(BaseModel):
    """A bare {success: true} - what a delete/unlink route returns when there
    is no payload to send back."""

    success: bool = True


class DeletedResult(BaseModel):
    """The {deleted: true} payload several delete routes nest under data."""

    deleted: bool = True


class FileUrlResult(BaseModel):
    """The {fileUrl: ...} payload a few small upload routes return instead
    of the full resource (e.g. a profile photo/logo upload, where the caller
    already has everything else and only needs the new URL)."""

    model_config = ConfigDict(populate_by_name=True)
    file_url: str = Field(alias="fileUrl")


class ViewUrlResult(BaseModel):
    """The {viewUrl: ...} payload every 'mint a signed URL on demand' route
    returns - distinct from FileUrlResult's 'fileUrl' key, never the same
    key by coincidence (see each call site's own key literally)."""

    model_config = ConfigDict(populate_by_name=True)
    view_url: str = Field(alias="viewUrl")


class SuccessMessageResponse(BaseModel):
    """A bare {success, message} - what a few delete/release routes return
    when there is no payload but the message itself matters (e.g. shown as
    a toast), unlike SimpleSuccessResponse which has no message at all."""

    success: bool = True
    message: str


class UrlResult(BaseModel):
    """The {url: ...} payload a signed-URL route returns under 'data' -
    distinct from ViewUrlResult's 'viewUrl' key, never the same key by
    coincidence (see each call site's own key literally)."""

    url: str


class PaginationMeta(BaseModel):
    """The {total, page, limit, total_pages, has_next, has_previous} block
    several admin list services build by hand (e.g. AdminCustomerService.
    _paginate) - snake_case as-is, since those services never ran this
    dict through a camelCase conversion."""

    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_previous: bool
