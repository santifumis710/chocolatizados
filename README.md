# Chocolatizados - E-Commerce + WhatsApp

Plataforma minimalista y sostenible para vender chocolates personalizados directamente a través de WhatsApp.

**Lema:** "Lo que quieras decir decilo con chocolates 🍫"  
**Status:** ✅ Producción  
**Costo:** 🆓 100% Gratuito  

---

## 📋 Stack Tecnológico

- **Frontend:** Next.js 14.2.35 (React) + TypeScript + Tailwind CSS
- **Backend:** FastAPI 0.104.1 (Python)
- **Catálogo:** CSV Manual (No requiere autenticación, cero costos)
- **Integración:** WhatsApp (link wa.me simplificado)
- **Persistencia:** localStorage (carrito)

---

## 🎨 Paleta de Colores (Chocolatizados)

```
🔴 Rojo/Chocolate:      #A64C3E
🟡 Crema/Beige:         #F5E6D3
🟫 Oro/Tan:             #C4B5A0
⚫ Texto Oscuro:        #333333
⚪ Blanco:              #FFFFFF
```

Basada en logo y referencia: [Mast Market](https://mastmarket.com)

---

## 🚀 Setup Rápido

### 1. Preparar Catálogo (CSV)

**Opción A: Descargar desde Google Sheets**
1. Abre tu Google Sheets
2. Archivo → Descargar → Valores separados por comas (.csv)
3. Guarda como: `.tmp/productos.csv`

**Estructura del CSV:**
```
id,name,price,category,weight_g,dimensions,description,image_url,allows_customization
1,Bombones Clásicos,25.99,Bombones,200,15x10x5cm,Deliciosos bombones...,https://imagen.jpg,TRUE
2,Trufas Premium,35.00,Trufas,150,12x8x4cm,Trufas artesanales...,https://imagen.jpg,TRUE
```

**Importar a products.json:**
```bash
python execution/import_csv_to_products.py
```

Genera: `src/frontend/public/products.json`

### 2. Setup Frontend (Next.js)

```bash
cd src/frontend
npm install
npm run dev
```

Accede: `http://localhost:3000`

### 3. Setup Backend (FastAPI)

```bash
cd src/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Accede: `http://localhost:8000/docs` (Swagger API)
   ↓
4. Continúa comprando o va a checkout
   ↓
5. Ingresa datos: Nombre, Teléfono WhatsApp, Email, Dirección (opt)
   ↓
6. Clic "Enviar a WhatsApp"
   ↓
7. Se abre WhatsApp con mensaje pre-rellenado
   ↓
8. Cliente envía el mensaje manualmente
   ↓
9. Recibidor confirma en WhatsApp
   ↓
10. Carrito se limpia
```

---

## 📂 Estructura de Directorios

```
Chocolatizados Project/
├── .env                           # Variables de entorno
├── .env.example                   # Plantilla .env
├── .gitignore                     # Archivos ignorados
├── requirements.txt               # Dependencias Python
│
├── AGENTS.md                      # Instrucciones para IA
├── GEMINI.md                      # Instrucciones para IA (copia)
│
├── directives/                    # SOPs (Procedimientos)
│   ├── cart_whatsapp.md          # Directiva de carrito
│   └── web_setup.md              # Setup del proyecto
│
├── execution/                     # Scripts Python
│   ├── sync_sheets_to_frontend.py # CSV → JSON
│   ├── init_fastapi.py           # Setup FastAPI
│   └── ...más scripts
│
├── src/
│   ├── frontend/                 # Next.js (React)
│   │   ├── pages/
│   │   │   └── index.tsx         # Home page
│   │   ├── components/           # Componentes React
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartWidget.tsx
│   │   │   ├── CartSidebar.tsx
│   │   │   └── CheckoutModal.tsx
│   │   ├── hooks/
│   │   │   └── useCart.ts        # Hook carrito
│   │   ├── utils/
│   │   │   └── whatsapp.ts       # Utilidades WhatsApp
│   │   ├── theme.ts              # Colores y estilos
│   │   ├── public/
│   │   │   └── products.json     # Catálogo (generado)
│   │   └── package.json
│   │
│   └── backend/                  # FastAPI (Python)
│       ├── main.py               # App FastAPI
│       ├── app/
│       │   ├── models/
│       │   │   └── schemas.py    # Modelos Pydantic
│       │   └── routes/
│       │       └── whatsapp.py   # Endpoints WhatsApp
│       ├── requirements.txt
│       └── .env.example
│
└── .tmp/                         # Intermedios (no versionados)
    ├── productos.csv            # CSV de Google Sheets
    └── products.json            # Backup JSON
```

---

## 🔑 Variables de Entorno (.env)

```env
# WhatsApp
WHATSAPP_BUSINESS_PHONE=5493425334765  # +54 9 342 5334765

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# FastAPI
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true
```

---

## 🛠️ Componentes React

### ProductCard
Tarjeta individual de producto con:
- Imagen
- Nombre, categoría, descripción
- Precio, peso, dimensiones
- Personalización (si aplica)
- Botón "Agregar al carrito"

### CartWidget
Ícono del carrito en navegación con badge de cantidad

### CartSidebar
Panel deslizable con:
- Items del carrito
- Resumen de precios
- Botones para modificar cantidades
- Botón "Ir a checkout"

### CheckoutModal
Modal para ingresar datos del cliente:
- Nombre, email, teléfono, dirección
- Validación de formulario
- Botón "Enviar a WhatsApp"

---

## 🪝 Custom Hooks

### useCart
Maneja el carrito con localStorage:
- `addItem(item)` - Agregar producto
- `removeItem(product_id)` - Eliminar
- `updateQuantity(product_id, qty)` - Cambiar cantidad
- `clearCart()` - Vaciar carrito
- `total` - Total del carrito
- `itemCount` - Cantidad de items

---

## 📡 API Endpoints (Opcional Backend)

### POST `/api/whatsapp/generate-link`
Genera link de WhatsApp con pedido

**Request:**
```json
{
  "customer_name": "Juan Pérez",
  "customer_phone": "+54 9 342 1234567",
  "customer_email": "juan@email.com",
  "delivery_address": "Calle 123, Dpto 4",
  "items": [
    {
      "product_id": 1,
      "name": "Chocolate Oscuro",
      "price": 8.50,
      "quantity": 2,
      "allows_customization": false,
      "customization_text": null
    }
  ],
  "notes": "Entrega urgente"
}
```

**Response:**
```json
{
  "whatsapp_link": "https://wa.me/5493425334765?text=...",
  "message_preview": "Hola! 🍫 Nuevo pedido en Chocolatizados...",
  "total_price": 25.50
}
```

### GET `/api/whatsapp/test`
Verificar configuración

---

## 🎯 Próximos Pasos

- [ ] Crear Google Sheet del catálogo
- [ ] Exportar CSV y correr `sync_sheets_to_frontend.py`
- [ ] Agregar imágenes a `src/frontend/public/images/products/`
- [ ] Setup Next.js frontend
- [ ] Setup FastAPI backend
- [ ] Probar flujo completo
- [ ] Deploy (Vercel para frontend, Heroku/Railway para backend)

---

## 📝 Notas

- **Sin login:** Clientes compran sin crear cuenta
- **Sin persistencia BD:** MVP solo usa localStorage
- **WhatsApp link:** Método simple sin API oficial
- **CSV manual:** Actualizar catálogo desde Google Sheets
- **Mobile-first:** Optimizado para mobile

---

## 🔗 Referencias

- Diseño inspirado: [Mast Market](https://mastmarket.com/)
- Lema: "Lo que quieras decir decilo con chocolates 🍫"
- Next.js: https://nextjs.org/
- FastAPI: https://fastapi.tiangolo.com/
- WhatsApp: https://wa.me/ (format)

---

**Creado con ❤️ para Chocolatizados**
