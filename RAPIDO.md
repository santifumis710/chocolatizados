# 🍫 CHOCOLATIZADOS - TODO ACTUALIZADO

## ✅ Lo Que Ya Está Hecho

### Visual Updates
- ✅ **Logo profesional** en el header (reemplazó el emoji 🍫)
- ✅ Frontend corriendo en **http://localhost:3000**
- ✅ 10 productos visibles en el catálogo
- ✅ Carrito funcional
- ✅ Checkout con WhatsApp

### Backend
- ✅ FastAPI en **http://localhost:8000**
- ✅ API endpoints listos
- ✅ WhatsApp integration completa

### Google Sheets Integration (NEW)
- ✅ Script `sync_google_sheets.py` - Descarga de Sheets
- ✅ Script `upload_to_google_sheets.py` - Carga a Sheets  
- ✅ Dependencias instaladas (google-auth-oauthlib, google-api-python-client)
- ✅ Variables de entorno configuradas en `.env`

---

## 🚀 3 Pasos Para Activar Google Sheets

### 1️⃣ Google Cloud Setup (5 min)

**Sigue:** [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

En resumen:
```
Google Cloud Console
  ↓
Crea proyecto "Chocolatizados"
  ↓
Habilita: Google Sheets API + Google Drive API
  ↓
Crea OAuth 2.0 credentials (tipo: Desktop)
  ↓
Descarga como JSON → Renombra a credentials.json
  ↓
Mueve a raíz del proyecto
```

### 2️⃣ Cargar Productos (1 min)

```powershell
python execution/upload_to_google_sheets.py
```

Toma los 10 productos de `.tmp/productos.csv` y los carga a tu Google Sheets.

### 3️⃣ Sincronizar Cambios (1 min cada vez)

```powershell
python execution/sync_google_sheets.py
```

Cuando edites precios en Google Sheets, este comando:
1. Descarga los datos
2. Valida todo
3. Actualiza `productos.csv`
4. Genera `products.json`
5. Frontend se recarga automáticamente

---

## 📊 Sistema de Sincronización

```
Google Sheets (edita aquí)
        ↓
python sync_google_sheets.py
        ↓
.tmp/productos.csv (intermedio)
        ↓
src/frontend/public/products.json
        ↓
http://localhost:3000 (actualizado ✅)
```

---

## 🎯 Caso de Uso Típico

### Día 1: Setup
```powershell
# 1. Descarga credentials.json desde Google Cloud
# 2. Coloca en raíz del proyecto
# 3. Carga los productos iniciales:
python execution/upload_to_google_sheets.py
```

### Día 2+: Actualizar Precios
```powershell
# En Google Sheets:
# - Edita el precio (ej: 8.5 → 10.0)
# - Ejecuta:
python execution/sync_google_sheets.py
# - ¡Listo! La web se actualiza automáticamente
```

---

## 📁 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `execution/sync_google_sheets.py` | Descarga de Google Sheets |
| `execution/upload_to_google_sheets.py` | Carga a Google Sheets |
| `SETUP_GOOGLE_SHEETS.md` | **Guía paso a paso** ← LEER PRIMERO |
| `GOOGLE_SHEETS_INTEGRATION.md` | Cambios técnicos realizados |
| `directives/google_sheets_sync.md` | Documentación completa |
| `.env` | Variables de configuración |
| `credentials.json` | OAuth (descarga tú mismo) |

---

## ✨ Lo Que Verás

### En la Web (http://localhost:3000)
```
┌─────────────────────────────────────┐
│  [LOGO] Chocolatizados              │
│  Lo que quieras decir con chocolates │
└─────────────────────────────────────┘

Chocolate Premium Personalizado
Selecciona tus favoritos y personaliza

[Chocolate Oscuro 70%] [Box 6]    [Box 12] ...
  $8.50                 $25.00     $45.00
  
  🛒 1 items in cart
```

### En Google Sheets
```
https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/

Sheet: "Productos"
| id | name                | price | category | ... |
|----|------------------- |-------|----------|-----|
| 1  | Chocolate Oscuro 70%| 8.5   | Clásico  | ... |
| 2  | Box Personalizado 6 | 25.0  | Boxes    | ... |
| ...
```

---

## 🔐 Seguridad

**No subas a GitHub:**
- `credentials.json` ← Tus credenciales OAuth
- `token.json` ← Token guardado

Ambos en `.gitignore` ✅

---

## 🎓 Documentación Disponible

```
SETUP_GOOGLE_SHEETS.md
├─ Paso 1: Crear proyecto Google Cloud
├─ Paso 2: Habilitar APIs
├─ Paso 3: Crear credenciales OAuth
├─ Paso 4: Verificar estructura Google Sheets
├─ Paso 5: Instalar dependencias
├─ Paso 6: Primera ejecución
├─ Paso 7: Automatizar (opcional)
└─ Troubleshooting

GOOGLE_SHEETS_INTEGRATION.md
├─ Resumen de cambios
├─ Scripts nuevos
├─ Archivos modificados
└─ Próximos pasos

directives/google_sheets_sync.md
├─ SOP completa
├─ Flujo de datos
├─ Validaciones
├─ Edge cases
└─ Automatización
```

---

## 🎉 Estado Final

```
FRONTEND
  http://localhost:3000            ✅ Activo
  Logo en header                   ✅ Visible
  10 productos                     ✅ Cargados
  Carrito funcional                ✅ Listo
  Checkout con WhatsApp            ✅ Listo

BACKEND
  http://localhost:8000            ✅ Activo
  API endpoints                    ✅ Listos
  WhatsApp integration             ✅ Funcional

GOOGLE SHEETS
  Sincronización scripts           ✅ Listos
  Dependencias instaladas          ✅ Completas
  Variables de entorno             ✅ Configuradas
  Documentación                    ✅ Completa
  
SEGURIDAD
  .gitignore actualizado           ✅ Completo
  Credenciales protegidas          ✅ Seguro
```

---

## 🚀 Próximo Paso

**Lee:** [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

⏱️ Tiempo estimado: **5 minutos**

---

**¿Listo?** 🍫

Abre http://localhost:3000 y vende chocolates con estilo!
