# 🚀 GUÍA RÁPIDA: Chocolatizados - Carrito Online + WhatsApp

## ¡Listo para empezar! 🍫

Tu proyecto está 100% configurado. Solo necesitas seguir estos pasos:

---

## PASO 1️⃣: Preparar el Catálogo

### 1.1 Crear Google Sheet

Ve a [Google Sheets](https://sheets.google.com) y crea una hoja llamada **"Chocolatizados Catálogo"**

**Columnas requeridas:**
```
A: Nombre
B: Dimensiones
C: Peso (g)
D: Precio
E: Categoría
F: Permite Personalización
G: Descripción (opcional)
H: Imagen URL (opcional)
```

### 1.2 Agregar Productos

Ejemplo:
| Nombre | Dimensiones | Peso (g) | Precio | Categoría | Permite Personalización |
|--------|-------------|----------|--------|-----------|------------------------|
| Chocolate Oscuro 70% | 10x10x5 cm | 200 | $8.50 | Oscuro | No |
| Box Personalizado | 20x15x10 cm | 300 | $25.00 | Personalizado | Sí |

**Archivo de ejemplo:** Ver `.tmp/productos_ejemplo.csv`

### 1.3 Descargar como CSV

En Google Sheets:
- Click en **File**
- **Download** → **Comma-separated values (.csv)**
- Guardar en: `Chocolatizados Project/.tmp/productos.csv`

---

## PASO 2️⃣: Sincronizar Catálogo

```bash
# Ir al directorio del proyecto
cd "Chocolatizados Project"

# Ejecutar script de sincronización
python execution/sync_sheets_to_frontend.py
```

**Resultado:**
- ✅ Genera `src/frontend/public/products.json`
- ✅ Valida todos los productos
- ✅ Backup en `.tmp/products.json`

---

## PASO 3️⃣: Setup Frontend (Next.js)

```bash
# Ir a carpeta frontend
cd src/frontend

# Crear proyecto Next.js (si no existe)
npx create-next-app@latest . --typescript --tailwind --eslint --no-git

# Instalar dependencias
npm install

# Copiar archivos del proyecto
# (Los componentes ya están creados en src/frontend/components/, etc.)

# Correr servidor de desarrollo
npm run dev
```

Acceder: **http://localhost:3000**

Deberías ver:
- 🍫 Navegación con logo "Chocolatizados"
- 📦 Grilla de productos (desde products.json)
- 🛒 Carrito con badge

---

## PASO 4️⃣: Setup Backend (FastAPI)

```bash
# Volver a carpeta principal
cd ../..

# Instalar dependencias Python
pip install -r requirements.txt

# Crear archivo .env.local (copiar de .env)
copy .env .env.local

# (Opcional) Configurar base de datos en .env.local
# Por ahora, no es necesaria para MVP

# Correr servidor FastAPI
cd src/backend
uvicorn main:app --reload --port 8000
```

Acceder: **http://localhost:8000/docs** (Swagger API)

Probar endpoint:
```
GET http://localhost:8000/api/whatsapp/test
```

Debe retornar:
```json
{
  "status": "ok",
  "business_phone": "5493425334765",
  "business_name": "Chocolatizados",
  "message": "Chocolatizados WhatsApp Integration OK"
}
```

---

## PASO 5️⃣: Probar Flujo Completo

1. **Abre** http://localhost:3000
2. **Agrega** productos al carrito
3. **Abre carrito** (botón 🛒)
4. **Va a checkout** (botón "Continuar al checkout")
5. **Ingresa datos:**
   - Nombre: Tu nombre
   - Teléfono: Tu número WhatsApp
   - Email: Tu email
   - Dirección: (opcional)
6. **Clic** "Enviar a WhatsApp"
7. ✅ **Se abre WhatsApp** con mensaje pre-rellenado
8. **Envía mensaje** manualmente

---

## 🎨 Personalización

### Cambiar Colores

Editar `src/frontend/theme.ts`:

```typescript
export const colors = {
  primary: "#A64C3E",      // Rojo oscuro
  secondary: "#C4B5A0",    // Oro
  background: "#F5E6D3",   // Crema
  // ...
};
```

### Agregar Imágenes de Productos

1. Guardar imágenes en: `src/frontend/public/images/products/`
2. En Google Sheet, agregar URL:
   ```
   https://tudominio.com/images/products/producto.jpg
   ```
3. O usar path relativo:
   ```
   /images/products/producto.jpg
   ```

---

## 📱 Estructura Archivos Generados

```
src/frontend/
├── pages/
│   └── index.tsx                 ✅ Home principal
├── components/
│   ├── ProductCard.tsx           ✅ Tarjeta de producto
│   ├── CartWidget.tsx            ✅ Ícono carrito
│   ├── CartSidebar.tsx           ✅ Panel carrito
│   ├── CheckoutModal.tsx         ✅ Modal checkout
│   └── index.ts                  ✅ Exportaciones
├── hooks/
│   ├── useCart.ts                ✅ Hook carrito
│   └── index.ts                  ✅ Exportaciones
├── utils/
│   ├── whatsapp.ts               ✅ Funciones WhatsApp
│   └── index.ts                  ✅ Exportaciones
├── theme.ts                      ✅ Colores y estilos
├── public/
│   └── products.json             ✅ Catálogo (generado)
└── next.config.js                ✅ Config Next.js

src/backend/
├── main.py                       ✅ FastAPI app
├── app/
│   ├── models/
│   │   └── schemas.py            ✅ Modelos Pydantic
│   └── routes/
│       └── whatsapp.py           ✅ Endpoints WhatsApp
└── requirements.txt              ✅ Dependencias
```

---

## 🔐 Variables de Entorno (.env)

```env
# WhatsApp
WHATSAPP_BUSINESS_PHONE=5493425334765

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# FastAPI
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true
```

---

## 🐛 Troubleshooting

### Problema: "products.json no encontrado"
**Solución:** Ejecutar `python execution/sync_sheets_to_frontend.py`

### Problema: CORS error en frontend
**Solución:** Backend FastAPI tiene CORS habilitado para `localhost:3000` en `main.py`

### Problema: WhatsApp no abre
**Solución:** Verificar que el número teléfono en `.env` sea correcto (sin espacios)

### Problema: Campo personalización no aparece
**Solución:** En Google Sheet, columna "Permite Personalización" debe tener "Sí" o "No"

---

## ✅ Checklist Final

- [ ] Google Sheet creada con productos
- [ ] CSV descargado en `.tmp/productos.csv`
- [ ] `sync_sheets_to_frontend.py` ejecutado ✅
- [ ] Frontend Next.js iniciado (`npm run dev`)
- [ ] Backend FastAPI iniciado (`uvicorn main:app --reload`)
- [ ] `http://localhost:3000` abre sin errores
- [ ] Productos aparecen en pantalla
- [ ] Carrito funciona (agregar/eliminar items)
- [ ] Checkout modal abre
- [ ] Botón WhatsApp abre la app/web

---

## 🚀 Deploy (Futuro)

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Heroku/Railway)
```bash
heroku login
heroku create tu-app
git push heroku main
```

---

## 📞 Número WhatsApp Configurado

**Chocolatizados:** +54 9 342 5334765

Este número recibirá todos los pedidos cuando clientes hagan click en "Enviar a WhatsApp"

---

## 🎯 Próximas Mejoras

- [ ] Agregar integración de pago (Stripe)
- [ ] Dashboard para visualizar pedidos
- [ ] Notificaciones por email
- [ ] Historial de órdenes
- [ ] Autenticación opcional (para clientes frecuentes)

---

## 📚 Documentación Completa

- **Directiva:** Ver `directives/cart_whatsapp.md`
- **README:** Ver `README.md`
- **Instrucciones IA:** Ver `AGENTS.md` y `GEMINI.md`

---

**¡Listo para vender chocolates!** 🍫✨

Si tienes dudas, revisa los comentarios en el código o consulta los archivos `.md` en la carpeta `directives/`
