"""Canonical property filter schema.

Wire format is camelCase JSON (aliases). Every field here maps to a real column on
``app.models.property.BaseProperty`` - see ``FilterService._build_query`` for the SQL.
Legacy / per-family payload shapes are folded into the canonical shape by the
``_fold_legacy_shapes`` validator so the frontend adapters have leeway.
"""

import re
from typing import List, Optional, Tuple

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def parse_bhk_token(token: str) -> Optional[Tuple[int, bool]]:
    """Parse one BHK/bathroom-count token into (count, is_open_ended).

    Tokens come from the vendor-facing BHK pills as-is (e.g. "studio",
    "2bhk", "4 BHK+", "4+") - case and whitespace vary, and "studio" has no
    digit to extract at all, so it's matched by name as 0 rather than being
    dropped. Returns None for anything with no recognizable count (e.g.
    garbage/unrecognized input), so callers can ignore it instead of raising.
    """
    normalized = str(token).strip().lower()
    if normalized == "studio":
        return 0, False
    nums = re.findall(r"\d+", normalized)
    if not nums:
        return None
    return int(nums[0]), "+" in normalized


def bhk_token_to_int(token) -> Optional[int]:
    """Single-value counterpart of parse_bhk_token, for storing one BHK
    pick (e.g. a property's own bedroom count at creation) as a plain int -
    the open-ended "+" doesn't matter here, only the number itself does.
    """
    if token is None or token == "":
        return None
    if isinstance(token, int):
        return token
    parsed = parse_bhk_token(token)
    return parsed[0] if parsed else None


class RangeFilter(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    min: Optional[float] = None
    max: Optional[float] = None

    @field_validator("min", "max", mode="before")
    @classmethod
    def _blank_to_none(cls, v):
        if v in ("", None):
            return None
        try:
            return float(str(v).replace(",", "").strip())
        except (TypeError, ValueError):
            return None

    def is_empty(self) -> bool:
        return self.min is None and self.max is None


def _as_list(value) -> Optional[List[str]]:
    if value in (None, "", []):
        return None
    if isinstance(value, (list, tuple, set)):
        out = [str(v).strip() for v in value if str(v).strip()]
        return out or None
    return [str(value).strip()]


class PropertyFilter(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    # ---- taxonomy ----
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    posted_by: Optional[List[str]] = Field(None, alias="postedBy")
    property_type: Optional[str] = Field(None, alias="propertyType")
    sub_category: Optional[str] = Field(None, alias="subCategory")

    # ---- location ----
    preferred_location: Optional[str] = Field(None, alias="preferredLocation")
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    # ---- rooms ----
    bedrooms: Optional[List[str]] = None
    bathrooms: Optional[List[str]] = None
    furnishing_status: Optional[str] = Field(None, alias="furnishingStatus")
    facing_direction: Optional[str] = Field(None, alias="facingDirection")
    parking: Optional[str] = None

    # ---- money (ranges) ----
    price: Optional[RangeFilter] = None                       # -> expected_price
    security_deposit: Optional[RangeFilter] = Field(None, alias="securityDeposit")
    maintenance: Optional[RangeFilter] = None                 # -> maintenance_amount

    # ---- area (ranges) ----
    built_up_area: Optional[RangeFilter] = Field(None, alias="builtUpArea")
    carpet_area: Optional[RangeFilter] = Field(None, alias="carpetArea")
    land_area: Optional[RangeFilter] = Field(None, alias="landArea")
    area_unit: Optional[str] = Field(None, alias="areaUnit")

    # ---- JSONB array "contains" ----
    amenities: Optional[List[str]] = None
    interior_features: Optional[List[str]] = Field(None, alias="interiorFeatures")
    appliance_included: Optional[List[str]] = Field(None, alias="applianceIncluded")
    selected_feature: Optional[List[str]] = Field(None, alias="selectedFeature")
    room_type: Optional[List[str]] = Field(None, alias="roomType")
    sharing_type: Optional[List[str]] = Field(None, alias="sharingType")
    tenant_type: Optional[List[str]] = Field(None, alias="tenantType")

    # ---- yes / no flags ----
    pet_friendly: Optional[str] = Field(None, alias="petFriendly")
    garden_space: Optional[str] = Field(None, alias="gardenSpace")
    terrace: Optional[str] = None
    balcony: Optional[str] = None
    smoking_allowed: Optional[str] = Field(None, alias="smokingAllowed")
    food_included: Optional[str] = Field(None, alias="foodIncluded")
    kitchen_access: Optional[str] = Field(None, alias="kitchenAccess")
    utilities_included: Optional[str] = Field(None, alias="utilitiesIncluded")
    electricity_available: Optional[str] = Field(None, alias="electricityAvailable")

    # ---- sell / lease ----
    ownership_type: Optional[str] = Field(None, alias="ownershipType")
    property_age: Optional[int] = Field(None, alias="propertyAge")
    property_condition: Optional[str] = Field(None, alias="propertyCondition")
    loan_outstanding: Optional[str] = Field(None, alias="loanOutstanding")
    available_from: Optional[str] = Field(None, alias="availableFrom")
    minimum_duration: Optional[str] = Field(None, alias="minimumDuration")

    # ---- commercial ----
    commercial_type: Optional[str] = Field(None, alias="commercialType")
    business_type: Optional[str] = Field(None, alias="businessType")
    zoning_type: Optional[str] = Field(None, alias="zoningType")
    estimated_footfall: Optional[str] = Field(None, alias="estimatedFootfall")

    # ---- hostel ----
    hostel_type: Optional[str] = Field(None, alias="hostelType")
    hostel_category: Optional[str] = Field(None, alias="hostelCategory")
    gender_type: Optional[str] = Field(None, alias="genderType")
    bathroom_type: Optional[str] = Field(None, alias="bathroomType")
    food_type: Optional[str] = Field(None, alias="foodType")

    # ---- land ----
    land_shape: Optional[str] = Field(None, alias="landShape")
    soil_type: Optional[str] = Field(None, alias="soilType")
    water_source: Optional[str] = Field(None, alias="waterSource")

    # ---- pagination / sort ----
    page: int = 1
    limit: int = 20
    sort_by: str = Field("created_at", alias="sortBy")
    sort_order: str = Field("desc", alias="sortOrder")

    # ------------------------------------------------------------------
    @model_validator(mode="before")
    @classmethod
    def _fold_legacy_shapes(cls, data):
        if not isinstance(data, dict):
            return data
        d = dict(data)

        def pick(*keys):
            for k in keys:
                if k in d and d[k] not in (None, "", [], {}):
                    return d[k]
            return None

        # range aliases -> canonical range objects
        def range_from(*, obj_keys=(), min_keys=(), max_keys=()):
            obj = pick(*obj_keys)
            if isinstance(obj, dict) and (obj.get("min") not in (None, "") or obj.get("max") not in (None, "")):
                return {"min": obj.get("min"), "max": obj.get("max")}
            lo, hi = pick(*min_keys), pick(*max_keys)
            if lo not in (None, "") or hi not in (None, ""):
                return {"min": lo, "max": hi}
            return None

        price = range_from(
            obj_keys=("price", "budgetRange", "monthlyRentBudget", "leaseBudget"),
            min_keys=("priceMin", "minPrice", "minRent", "minLeaseAmount", "minSellPrice"),
            max_keys=("priceMax", "maxPrice", "maxRent", "maxLeaseAmount", "maxSellPrice"),
        )
        if price:
            d["price"] = price

        land = range_from(
            obj_keys=("landArea", "plotSize"),
            min_keys=("landAreaMin", "plotAreaMin"),
            max_keys=("landAreaMax", "plotAreaMax"),
        )
        if land:
            d["landArea"] = land

        bua = range_from(obj_keys=("builtUpArea",), min_keys=("builtUpAreaMin",), max_keys=("builtUpAreaMax",))
        if bua:
            d["builtUpArea"] = bua
        ca = range_from(obj_keys=("carpetArea",), min_keys=("carpetAreaMin",), max_keys=("carpetAreaMax",))
        if ca:
            d["carpetArea"] = ca
        sd = range_from(
            obj_keys=("securityDeposit", "advanceDeposit"),
            min_keys=("securityDepositMin", "refundableDeposit"),
            max_keys=("securityDepositMax",),
        )
        if sd:
            d["securityDeposit"] = sd

        # scalar aliases
        if "moveInDate" in d and not d.get("availableFrom"):
            d["availableFrom"] = d["moveInDate"]
        if "rentalDuration" in d and not d.get("minimumDuration"):
            d["minimumDuration"] = d["rentalDuration"]
        if "minRentalDuration" in d and not d.get("minimumDuration"):
            d["minimumDuration"] = d["minRentalDuration"]
        if "minStayDuration" in d and not d.get("minimumDuration"):
            d["minimumDuration"] = d["minStayDuration"]
        if "purpose" in d and not d.get("listingPurpose"):
            d["listingPurpose"] = d["purpose"]
        if "locality" in d and not d.get("preferredLocation"):
            d["preferredLocation"] = d["locality"]
        if "furnishingType" in d and not d.get("furnishingStatus"):
            d["furnishingStatus"] = d["furnishingType"]
        if "facing" in d and not d.get("facingDirection"):
            d["facingDirection"] = d["facing"]

        # list-ish
        for key in ("bedrooms", "bathrooms", "postedBy", "amenities", "interiorFeatures",
                    "applianceIncluded", "selectedFeature", "roomType", "sharingType",
                    "tenantType", "occupancyType", "occupancyDetails"):
            if key in d:
                d[key] = _as_list(d[key])
        if d.get("occupancyType") and not d.get("tenantType"):
            d["tenantType"] = d["occupancyType"]
        if d.get("occupancyDetails") and not d.get("tenantType"):
            d["tenantType"] = d["occupancyDetails"]

        return d

    @field_validator("property_category", "listing_purpose", mode="before")
    @classmethod
    def _upper_enum(cls, v):
        if isinstance(v, str) and v.strip():
            u = v.strip().upper().replace(" ", "_").replace("&", "").replace("__", "_")
            aliases = {"BUY": "SELL", "LAND_&_PLOTS": "LAND_PLOT", "LAND_PLOTS": "LAND_PLOT",
                       "LAND_AND_PLOT": "LAND_PLOT", "LAND_AND_PLOTS": "LAND_PLOT"}
            return aliases.get(u, u)
        return v

    @field_validator("posted_by", mode="before")
    @classmethod
    def _upper_posted_by(cls, v):
        items = _as_list(v)
        if not items:
            return None
        norm = {"OWNER": "OWNER", "AGENT": "AGENT", "BUILDER": "BUILDER",
                "PROPERTY MANAGEMENT": "PROPERTY_MANAGEMENT",
                "PROPERTY_MANAGEMENT": "PROPERTY_MANAGEMENT", "WARDEN": "OWNER"}
        return [norm.get(i.strip().upper(), i.strip().upper()) for i in items]

    @field_validator("page", "limit", mode="before")
    @classmethod
    def _int_bounds(cls, v):
        try:
            return int(v)
        except (TypeError, ValueError):
            return 1

    def bhk_ints(self, field: str):
        """Return (exact_ints, min_plus) for the bedrooms/bathrooms string list."""
        raw = getattr(self, field) or []
        exact, plus = set(), set()
        for token in raw:
            parsed = parse_bhk_token(token)
            if parsed is None:
                continue
            n, is_plus = parsed
            (plus if is_plus else exact).add(n)
        min_plus = min(plus) if plus else None
        if min_plus is not None:
            exact = {n for n in exact if n < min_plus}
        return sorted(exact), min_plus
