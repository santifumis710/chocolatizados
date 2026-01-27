"""
FastAPI Models para Chocolatizados

Modelos Pydantic para validación de datos del carrito.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class CategoryEnum(str, Enum):
    """Categorías de productos."""
    OSCURO = "Oscuro"
    BLANCO = "Blanco"
    CON_LECHE = "Con Leche"
    RELLENO = "Relleno"
    PERSONALIZADO = "Personalizado"


class Product(BaseModel):
    """Modelo de producto desde Google Sheets."""
    id: int
    name: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0)
    category: str
    weight_g: Optional[str | int] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    allows_customization: bool = False
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Chocolate Oscuro 70%",
                "price": 8.50,
                "category": "Oscuro",
                "weight_g": 200,
                "dimensions": "10x10x5 cm",
                "description": "Delicioso chocolate oscuro",
                "image_url": "https://example.com/dark.jpg",
                "allows_customization": False
            }
        }


class CartItem(BaseModel):
    """Item en el carrito (antes de checkout)."""
    product_id: int
    name: str
    price: float
    quantity: int = Field(..., gt=0, le=100)
    allows_customization: bool = False
    customization_text: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "product_id": 1,
                "name": "Chocolate Oscuro 70%",
                "price": 8.50,
                "quantity": 2,
                "allows_customization": True,
                "customization_text": "Quiero un diseño dorado con letras blancas"
            }
        }


class CheckoutRequest(BaseModel):
    """Datos para generar link WhatsApp."""
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_phone: str = Field(..., min_length=10, max_length=20)  # +54 9 342 5334765
    customer_email: str = Field(..., max_length=255)
    delivery_address: Optional[str] = Field(None, max_length=500)
    items: List[CartItem] = Field(..., min_items=1)
    notes: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "customer_name": "Juan Pérez",
                "customer_phone": "+54 9 342 1234567",
                "customer_email": "juan@email.com",
                "delivery_address": "Calle 123, Dpto 4",
                "items": [
                    {
                        "product_id": 1,
                        "name": "Chocolate Oscuro 70%",
                        "price": 8.50,
                        "quantity": 2,
                        "allows_customization": False,
                        "customization_text": None
                    }
                ],
                "notes": "Entrega rápida si es posible"
            }
        }


class WhatsAppLinkResponse(BaseModel):
    """Respuesta con link de WhatsApp."""
    whatsapp_link: str
    message_preview: str
    total_price: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "whatsapp_link": "https://wa.me/5493425334765?text=...",
                "message_preview": "Hola! 🍫 Nuevo pedido en Chocolatizados...",
                "total_price": 25.50
            }
        }
