"""Pydantic schemas exposed by the API."""

from pydantic import BaseModel, Field
from typing import Optional


class Product(BaseModel):
    """Producto del catálogo."""
    id: int
    name: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0)
    category: str
    weight_g: Optional[str | int] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    allows_customization: bool = False
    is_visible: bool = True
