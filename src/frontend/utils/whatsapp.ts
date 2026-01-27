/**
 * Utilidad: generateWhatsAppLink
 * 
 * Genera un link de WhatsApp con el mensaje del pedido pre-rellenado
 * Se puede usar en Frontend (sin backend) o llamando al backend
 */

import { CartItem } from "@/hooks/useCart";

export interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address?: string;
  items: CartItem[];
  notes?: string;
}

const BUSINESS_PHONE = "5493426158358"; // +54 9 3426 15-8358
const BUSINESS_NAME = "Chocolatizados";

/**
 * Genera el mensaje de pedido para WhatsApp
 */
export const generateOrderMessage = (data: CheckoutData): string => {
  const { customer_name, customer_phone, customer_email, items, delivery_address, notes } = data;

  let message = `Hola! 🍫 Nuevo pedido en ${BUSINESS_NAME}\n\n`;
  message += `👤 Cliente: ${customer_name}\n`;
  message += `📞 Teléfono: ${customer_phone}\n`;
  message += `📧 Email: ${customer_email}\n\n`;

  message += `📦 Pedido:\n`;
  items.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    message += `  ${idx + 1}. ${item.name}\n`;
    message += `     Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;

    if (item.allows_customization && item.customization_text) {
      message += `     ✨ Personalización: ${item.customization_text}\n`;
    }
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\n💰 Total: $${total.toFixed(2)}\n`;

  if (delivery_address) {
    message += `📍 Dirección: ${delivery_address}\n`;
  }

  if (notes) {
    message += `📝 Notas: ${notes}\n`;
  }

  message += `\n✅ Por favor confirma el pedido por este medio`;
  message += `\n\nLo que quieras decir decilo con chocolates 🍫`;

  return message;
};

/**
 * Genera el link de WhatsApp con el mensaje
 */
export const generateWhatsAppLink = (data: CheckoutData): string => {
  const message = generateOrderMessage(data);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;
};

/**
 * Abre el link de WhatsApp en una nueva ventana
 */
export const openWhatsAppLink = (data: CheckoutData): void => {
  const link = generateWhatsAppLink(data);
  window.open(link, "_blank", "width=600,height=700");
};

/**
 * (Opcional) Llama al backend para generar el link
 * Solo si quieres logging/analytics del servidor
 */
export const generateWhatsAppLinkFromBackend = async (
  data: CheckoutData,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
): Promise<string> => {
  const response = await fetch(`${baseUrl}/api/whatsapp/generate-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error generando link de WhatsApp");
  }

  const result = await response.json();
  return result.whatsapp_link;
};

/**
 * Genera mensaje SIMPLE de pedido para WhatsApp (Formato usuario)
 */
export const generateSimpleOrderMessage = (items: CartItem[], total: number): string => {
  // Emojis en Unicode para asegurar compatibilidad y evitar signos de pregunta
  const EMOJI_WAVE = "\uD83D\uDC4B";      // 👋
  const EMOJI_CLIPBOARD = "\uD83D\uDCCB"; // 📋
  const EMOJI_MONEY = "\uD83D\uDCB0";     // 💰
  const EMOJI_PERSON = "\uD83D\uDC64";    // 👤
  const EMOJI_CALENDAR = "\uD83D\uDCC5";  // 📅
  const EMOJI_CARD = "\uD83D\uDCB3";      // 💳

  let message = `Hola! ${EMOJI_WAVE} Quiero realizar el siguiente pedido:\n\n`;
  message += `${EMOJI_CLIPBOARD} Detalle:\n\n`;

  items.forEach((item) => {
    let desc = "";
    if (item.customization_text) {
      desc = ` (${item.customization_text})`;
    }

    message += `${item.quantity}x ${item.name}${desc}\n`;
  });

  message += `\n${EMOJI_MONEY} Total: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n\n`;

  message += `${EMOJI_PERSON} Nombre: \n`;
  message += `${EMOJI_CALENDAR} Fecha de retiro: \n`;
  message += `${EMOJI_CARD} Método de pago: \n`;

  message += `\nQuedo a la espera de confirmación!`;

  return message;
};

export const openSimpleWhatsAppLink = (items: CartItem[], total: number): void => {
  const message = generateSimpleOrderMessage(items, total);

  // Aseguramos que el mensaje esté codificado correctamente para URL (UTF-8)
  // Usamos api.whatsapp.com que suele manejar mejor los caracteres especiales que wa.me
  const encodedMessage = encodeURIComponent(message);
  const link = `https://api.whatsapp.com/send?phone=${BUSINESS_PHONE}&text=${encodedMessage}`;

  window.open(link, "_blank");
};
