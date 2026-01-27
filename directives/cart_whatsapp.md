# Carrito de Compras + Integración WhatsApp

## Goal
Permitir que los clientes agreguen productos a un carrito, personalicen envoltorios para productos permitidos, y envíen el pedido a través de WhatsApp (+54 9 342 5334765) **sin persistencia en base de datos** (solo en localStorage).

## Inputs
- **Google Sheets CSV:** Catálogo de productos (importado manualmente desde Sheets en formato CSV)
  - Columnas: Nombre | Dimensiones | Peso(g) | Precio | Categoría | Permite Personalización | Descripción | Imagen URL
- **Datos del Cliente:** Nombre, teléfono, email (ingresados en checkout)
- **Items del Carrito:** product_id, cantidad, customization_text (si aplica)

## Outputs
- **Link WhatsApp:** `https://wa.me/{numero}?text={mensaje_pedido_codificado}`
- **Carrito Persistente:** localStorage (cliente)
- **Sin base de datos:** No se almacenan órdenes

## Tools/Scripts to Use
- `execution/sync_sheets_to_frontend.py` - Importar CSV y exportar JSON para frontend
- `execution/setup_whatsapp_service.py` - Generar link WhatsApp con datos del pedido
- Frontend: React hooks (`useCart`), components (Cart, Checkout, WhatsApp button)

## Process

### Phase 1: Setup Catálogo
1. Usuario crea Google Sheet "Chocolatizados Catálogo" con columnas:
   - **Nombre:** Chocolate Oscuro 70%
   - **Dimensiones:** 10x10x5 cm
   - **Peso (g):** 200
   - **Precio:** $8.50
   - **Categoría:** Oscuro
   - **Permite Personalización:** Sí/No
   - **Descripción:** Delicioso chocolate oscuro (opcional)
   - **Imagen URL:** https://example.com/imagen.jpg (opcional)

2. Exportar Google Sheet como CSV y guardar en `.tmp/productos.csv`

3. Ejecutar `execution/sync_sheets_to_frontend.py`:
   - Lee CSV
   - Valida campos requeridos (Nombre, Precio, Categoría, Permite Personalización)
   - Exporta a JSON: `products.json`
   - Copia JSON a frontend para que lee en tiempo de compilación

### Phase 2: Estructura Frontend (React + TypeScript)

#### Componentes:
- **ProductGrid.tsx:** Renderiza grilla de productos desde `products.json`
  - Card por producto: nombre, imagen, precio, descripción
  - Botón "Agregar al carrito"

- **CartWidget.tsx:** Ícono del carrito en navegación, muestra cantidad de items

- **CartSidebar.tsx:** Panel deslizable con items del carrito
  - Mostrar cantidad, precio unitario, subtotal
  - Botones para cambiar cantidad, eliminar
  - Botón "Continuar al checkout"

- **CheckoutForm.tsx:** Formulario antes de enviar a WhatsApp
  - Campos: Nombre, Teléfono, Email, Dirección (opcional)
  - Validación básica
  - Botón "Enviar Pedido a WhatsApp"

- **OrderReview.tsx:** Resumen final antes de generar link
  - Tabla de items + cantidades + precios
  - Total
  - Botón "Confirmar y Abrir WhatsApp"

- **WhatsAppButton.tsx:** Botón que abre link WhatsApp
  - `onClick` → redirige a `https://wa.me/...?text=...`

#### Storage (localStorage):
```json
{
  "cart": [
    {
      "product_id": 1,
      "name": "Chocolate Oscuro 70%",
      "price": 8.50,
      "quantity": 2,
      "allows_customization": true,
      "customization_text": "Quiero un marco dorado con letras blancas"
    }
  ],
  "last_updated": "2026-01-22T10:30:00Z"
}
```

### Phase 3: Flujo de Checkout (Sin Backend)

**Opción A (MVP Simple - Recomendado):**
1. Cliente agrega productos → guardados en localStorage
2. Cliente abre panel del carrito → ve items
3. Cliente hace clic "Ir a Checkout" → modal/página con form
4. Completa datos (nombre, teléfono, email, dirección)
5. Resumen del pedido aparece
6. Clic "Confirmar y Enviar a WhatsApp" → **genera link + abre WhatsApp**
7. WhatsApp abre con mensaje pre-rellenado
8. Cliente envía mensaje manualmente
9. Carrito se vacía en localStorage (limpieza)

**Mensaje WhatsApp (template):**
```
Hola! 🍫 Nuevo pedido en Chocolatizados

👤 Cliente: {nombre}
📞 Teléfono: {teléfono}
📧 Email: {email}

📦 Pedido:
  • {producto1} x{qty} = ${precio}
  • {producto2} x{qty} = ${precio}
  [+ más items]

💰 Total: ${total}
📍 Dirección: {dirección}

[si hay items personalizados]
✨ Personalizaciones:
  • {producto_personalizable}: {texto_cliente}

✅ Por favor confirma el pedido
```

### Phase 4: Ruta FastAPI (Opcional, solo si hay backend)

Si en el futuro se quiere agregar backend para logs/analytics:
```
POST /api/whatsapp/generate-link
{
  "customer_name": "Juan",
  "customer_phone": "+54 9 342 1234567",
  "customer_email": "juan@email.com",
  "delivery_address": "Calle 123, Dpto 4",
  "items": [
    {
      "product_id": 1,
      "name": "Chocolate Oscuro",
      "quantity": 2,
      "price": 8.50,
      "customization_text": "Quiero texto dorado"
    }
  ]
}

Response:
{
  "whatsapp_link": "https://wa.me/5493425334765?text=...",
  "message_preview": "Hola! 🍫 Nuevo pedido..."
}
```

## Data Structure (Frontend TypeScript)

```typescript
// types/Product.ts
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  weight_g: number;
  dimensions: string;
  description?: string;
  image_url?: string;
  allows_customization: boolean;
}

// types/CartItem.ts
interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  allows_customization: boolean;
  customization_text?: string;  // Solo si allows_customization=true
}

// types/Order.ts (estructura para WhatsApp)
interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address?: string;
  items: CartItem[];
  total_price: number;
}
```

## Edge Cases

- **Productos sin imagen:** Usar placeholder genérico
- **Campo customización:** Límite 500 caracteres
- **Teléfono:** Validar formato (mínimo 10 dígitos después de código país)
- **Carrito vacío:** No permitir checkout
- **Stale checkout:** Si usuario vuelve después de días, cart sigue en localStorage
- **Mobile:** WhatsApp link funciona perfecto en mobile (abre app nativa)
- **Desktop sin WhatsApp:** Aviso al usuario que descargue o use web.whatsapp.com

## Implementation Checklist

### CSV → Frontend
- [ ] Google Sheet creada con columnas definidas
- [ ] CSV exportado a `.tmp/productos.csv`
- [ ] `sync_sheets_to_frontend.py` ejecutado
- [ ] `products.json` en frontend (`src/frontend/public/products.json`)

### Frontend Components
- [ ] ProductGrid.tsx (renderiza productos)
- [ ] CartWidget.tsx (ícono con cantidad)
- [ ] CartSidebar.tsx (panel del carrito)
- [ ] CheckoutForm.tsx (form datos cliente)
- [ ] OrderReview.tsx (resumen)
- [ ] WhatsAppButton.tsx (botón que abre link)

### Hooks
- [ ] useCart.ts (addItem, removeItem, updateQuantity, clearCart)
- [ ] useLocalStorage.ts (abstracción de localStorage)

### Utils
- [ ] whatsapp.ts (función generador de link WhatsApp)
- [ ] validation.ts (validar email, teléfono)

## WhatsApp Number Configuration

**Negocio:** Chocolatizados
**Teléfono:** +54 9 342 5334765
**Configurar en:** `.env` → `WHATSAPP_BUSINESS_PHONE=5493425334765`

## Status
- ⏳ Esperando CSV de productos
- ⏳ Frontend components en desarrollo
- ✅ Directiva definida
