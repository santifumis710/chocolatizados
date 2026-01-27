"""
FastAPI Routes para WhatsApp

Endpoints para generar links de WhatsApp con pedidos.
"""

from fastapi import APIRouter, HTTPException
from urllib.parse import quote
from typing import List
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Importar schemas (ajustar ruta si es necesario)
try:
    from app.models.schemas import CheckoutRequest, WhatsAppLinkResponse, CartItem
except ImportError:
    # Fallback para imports relativos
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).parent.parent.parent))
    from app.models.schemas import CheckoutRequest, WhatsAppLinkResponse, CartItem

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

# Número de teléfono del negocio (sin caracteres especiales)
WHATSAPP_BUSINESS_PHONE = os.getenv("WHATSAPP_BUSINESS_PHONE", "5493426158358")
BUSINESS_NAME = "Chocolatizados"


def calculate_total(items: List[CartItem]) -> float:
    """Calcular total del pedido."""
    return sum(item.price * item.quantity for item in items)


def format_cart_message(
    customer_name: str,
    customer_phone: str,
    customer_email: str,
    items: List[CartItem],
    delivery_address: str,
    total_price: float,
    notes: str = None
) -> str:
    """
    Genera mensaje de pedido para WhatsApp.
    
    Template estándar de Chocolatizados.
    """
    
    message = f"""Hola! 🍫 Nuevo pedido en {BUSINESS_NAME}

👤 Cliente: {customer_name}
📞 Teléfono: {customer_phone}
📧 Email: {customer_email}

📦 Pedido:"""
    
    # Items del carrito
    for idx, item in enumerate(items, 1):
        subtotal = item.price * item.quantity
        message += f"\n  {idx}. {item.name}"
        message += f"\n     Cantidad: {item.quantity} x ${item.price:.2f} = ${subtotal:.2f}"
        
        # Personalizaciones
        if item.allows_customization and item.customization_text:
            message += f"\n     ✨ Personalización: {item.customization_text}"
    
    message += f"\n\n💰 Total: ${total_price:.2f}"
    
    # Dirección de entrega
    if delivery_address:
        message += f"\n📍 Dirección: {delivery_address}"
    
    # Notas adicionales
    if notes:
        message += f"\n📝 Notas: {notes}"
    
    message += "\n\n✅ Por favor confirma el pedido por este medio"
    message += "\n\nLo que quieras decir decilo con chocolates 🍫"
    
    return message


@router.post("/generate-link", response_model=WhatsAppLinkResponse)
async def generate_whatsapp_link(checkout: CheckoutRequest) -> WhatsAppLinkResponse:
    """
    Genera link de WhatsApp con pedido pre-rellenado.
    
    Flujo:
    1. Frontend envía datos del carrito + cliente
    2. Backend genera mensaje formateado
    3. Backend retorna URL de WhatsApp
    4. Frontend abre link en nueva pestaña
    5. Usuario confirma manualmente en WhatsApp
    
    Nota: Este endpoint NO persiste datos en BD.
    """
    
    try:
        # Validar que haya items
        if not checkout.items:
            raise HTTPException(status_code=400, detail="El carrito está vacío")
        
        # Calcular total
        total_price = calculate_total(checkout.items)
        
        # Generar mensaje
        message = format_cart_message(
            customer_name=checkout.customer_name,
            customer_phone=checkout.customer_phone,
            customer_email=checkout.customer_email,
            items=checkout.items,
            delivery_address=checkout.delivery_address or "No especificada",
            total_price=total_price,
            notes=checkout.notes
        )
        
        # URL encode del mensaje
        encoded_message = quote(message)
        
        # Link de WhatsApp
        whatsapp_link = f"https://wa.me/{WHATSAPP_BUSINESS_PHONE}?text={encoded_message}"
        
        return WhatsAppLinkResponse(
            whatsapp_link=whatsapp_link,
            message_preview=message,
            total_price=total_price
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando link WhatsApp: {str(e)}"
        )


@router.get("/test")
async def test_whatsapp():
    """
    Endpoint de prueba para verificar configuración.
    """
    return {
        "status": "ok",
        "business_phone": WHATSAPP_BUSINESS_PHONE,
        "business_name": BUSINESS_NAME,
        "message": "Chocolatizados WhatsApp Integration OK"
    }
