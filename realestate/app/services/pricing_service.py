from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
import logging

from app.models.property_pricing import PricingRule
from app.models.property_payments import PropertyCategory, ListingPurpose, PricingDetails

logger = logging.getLogger(__name__)

class PricingService:
    def __init__(self, db_session: AsyncSession):  # Changed to AsyncSession
        self.db = db_session
    
    async def calculate_price(self, category: PropertyCategory, purpose: ListingPurpose,
                       expected_price: Optional[float] = None, 
                       ground_size: Optional[float] = None) -> PricingDetails:
        
        # Determine what value to compare
        compare_value = None
        if purpose == ListingPurpose.SELL and category == PropertyCategory.LAND_PLOT:
            compare_value = ground_size
        else:
            compare_value = expected_price

        print(f"before query execute")
        
        # Handle fixed price rules (for rent, lease)
        if compare_value is None:
            # Changed: Async query using select()
            stmt = select(PricingRule).where(
                PricingRule.property_category == category.value,
                PricingRule.listing_purpose == purpose.value,
                PricingRule.rule_type == "fixed",
                PricingRule.is_active == True
            )
            result = await self.db.execute(stmt)  # Added await
            fixed_rule = result.scalar_one_or_none()  # Changed from .first()
            
            if fixed_rule:
                # Calculate GST
                amount_with_gst = self.calculate_gst_amount(fixed_rule.amount)
                return PricingDetails(
                    amount_inr=amount_with_gst,
                    amount_paise=int(amount_with_gst * 100),
                    rule_applied=f"{category.value} {purpose.value} - Fixed",
                    description=fixed_rule.description
                )
            raise ValueError(f"Price not configured for {category.value} - {purpose.value}")
        
        # Find matching range rule
        # Changed: Async query
        stmt = select(PricingRule).where(
            PricingRule.property_category == category.value,
            PricingRule.listing_purpose == purpose.value,
            PricingRule.is_active == True
        ).order_by(PricingRule.priority.desc(), PricingRule.min_value.asc())
        
        result = await self.db.execute(stmt)  # Added await
        rules = result.scalars().all()  # Changed from .all()
        
        for rule in rules:
            if rule.rule_type in ["range", "slab"]:
                min_val = rule.min_value if rule.min_value is not None else float('-inf')
                max_val = rule.max_value if rule.max_value is not None else float('inf')
                
                if min_val <= compare_value <= max_val:
                    # Calculate GST
                    amount_with_gst = self.calculate_gst_amount(rule.amount)
                    return PricingDetails(
                        amount_inr=amount_with_gst,
                        amount_paise=int(amount_with_gst * 100),
                        rule_applied=f"{category.value} {purpose.value}",
                        description=rule.description
                    )
        
        # Check for default rule
        # Changed: Async query
        stmt = select(PricingRule).where(
            PricingRule.property_category == category.value,
            PricingRule.listing_purpose == purpose.value,
            PricingRule.min_value.is_(None),
            PricingRule.max_value.is_(None),
            PricingRule.is_active == True
        )
        result = await self.db.execute(stmt)  # Added await
        default_rule = result.scalar_one_or_none()  # Changed from .first()

        if default_rule:
            # Calculate GST
            amount_with_gst = self.calculate_gst_amount(default_rule.amount)
            return PricingDetails(
                amount_inr=amount_with_gst,
                amount_paise=int(amount_with_gst * 100),
                rule_applied=f"{category.value} {purpose.value} - Default",
                description=default_rule.description
            )
        
        raise ValueError(f"No pricing rule found for {category.value} - {purpose.value}")

    def calculate_gst_amount(self, amount: float) -> float:
        """Calculate GST (18%) and return total amount"""
        gst_amount = amount * 0.18 
        total_amount = amount + gst_amount
        return total_amount