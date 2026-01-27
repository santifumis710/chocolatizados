# 🚀 CHOCOLATIZADOS - LISTO PARA USAR

## ✅ Todo está 100% configurado

Tu plataforma Chocolatizados está **completamente lista**. Solo necesitas ejecutar 2 comandos en 2 terminales diferentes.

---

## 🎯 PASO 1: Instalar dependencias de Backend

En PowerShell:

```powershell
pip install -r src/backend/requirements.txt
```

Espera a que termine (tarda ~30 segundos)

---

## 🎯 PASO 2: Iniciar FRONTEND

**Abre una NUEVA terminal** (Terminal 1) y ejecuta:

```powershell
cd src/frontend
npm run dev
```

Verás algo como:
```
> next dev
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

**Abre en tu navegador:** `http://localhost:3000`

✅ **Deberías ver tu tienda de chocolates!**

---

## 🎯 PASO 3: Iniciar BACKEND

**Abre OTRA terminal** (Terminal 2) y ejecuta:

```powershell
cd src/backend
uvicorn main:app --reload --port 8000
```

Verás:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## ✅ TODO ESTÁ LISTO

Ahora tienes:

- ✅ **Frontend:** http://localhost:3000 (Tienda de chocolates)
- ✅ **Backend:** http://localhost:8000/docs (API)
- ✅ **Catálogo:** 10 productos listos
- ✅ **WhatsApp:** Configurado en +54 9 342 5334765

---

## 🛒 PRUEBA EL FLUJO

1. **Abre** http://localhost:3000
2. **Agrega** un chocolate al carrito (click en "Agregar al carrito")
3. **Abre** el carrito (botón 🛒)
4. **Click** en "Continuar al checkout"
5. **Completa formulario:**
   - Nombre: Tu nombre
   - Teléfono: Tu número WhatsApp
   - Email: Tu email
   - Dirección: (opcional)
6. **Click** "Enviar a WhatsApp"
7. ✅ **Se abre WhatsApp** con tu pedido pre-rellenado

---

## 📁 QUÉ SE CREÓ AUTOMÁTICAMENTE

```
✅ src/frontend/
   ├── components/          4 componentes React
   ├── hooks/useCart.ts     Carrito con localStorage
   ├── utils/whatsapp.ts    Generador de links
   ├── pages/index.tsx      Home principal
   ├── public/products.json 10 productos (desde CSV)
   ├── app/                 App directory de Next.js
   ├── tailwind.config.js   Colores Chocolatizados
   └── node_modules/        Dependencias npm

✅ src/backend/
   ├── main.py              FastAPI app
   ├── app/models/          Modelos Pydantic
   ├── app/routes/          Endpoints WhatsApp
   └── requirements.txt     Dependencias Python

✅ .tmp/
   ├── productos.csv        Tu catálogo
   └── products.json        JSON generado

✅ .env.local               Variables de entorno
```

---

## 🎨 PALETA DE COLORES (LISTA)

```
🔴 Primario:    #A64C3E (Rojo oscuro/Chocolate)
🟡 Secundario:  #C4B5A0 (Oro/Tan)
🟡 Fondo:       #F5E6D3 (Crema)
```

Basada en tu logo Chocolatizados

---

## 📦 PRODUCTOS PRECARGADOS

Se crearon automáticamente 10 productos:

1. Chocolate Oscuro 70% - $8.50
2. Chocolate Blanco Premium - $7.50
3. Chocolate con Leche Clásico - $9.00
4. Trufa Rellena de Frambuesa - $5.00
5. **Box Personalizado 6 Chocolates - $25.00** ✨ (personalizable)
6. **Box Personalizado 12 Chocolates - $45.00** ✨ (personalizable)
7. Chocolate Oscuro con Almendras - $9.50
8. **Chocolate Blanco con Frutos Rojos - $8.50** ✨ (personalizable)
9. Chocolate con Avellanas - $10.00
10. Bombones Surtidos - $35.00

Los marcados con ✨ permiten personalizaciones

---

## ⚡ COMANDOS RÁPIDOS

```powershell
# Terminal 1 - Frontend (desde src/frontend)
npm run dev         # Iniciar servidor dev
npm run build       # Build para producción
npm run lint        # Verificar código

# Terminal 2 - Backend (desde src/backend)
uvicorn main:app --reload --port 8000
```

---

## 🆘 SI ALGO FALLA

### Frontend no inicia
```powershell
cd src/frontend
npm install
npm run dev
```

### Backend no inicia
```powershell
pip install -r src/backend/requirements.txt
cd src/backend
uvicorn main:app --reload --port 8000
```

### puerto 3000 en uso
```powershell
# Cambiar puerto:
npm run dev -- -p 3001
```

### puerto 8000 en uso
```powershell
# Cambiar puerto:
uvicorn main:app --reload --port 8001
```

---

## 📚 DOCUMENTACIÓN

- **START_HERE.md** - Bienvenida
- **QUICK_START.md** - Guía detallada
- **PROJECT_STATUS.md** - Resumen visual
- **README.md** - Documentación técnica
- **directives/cart_whatsapp.md** - Flujo de compra

---

## 🎯 CUSTOMIZACIÓN

### Cambiar Productos

Edita `.tmp/productos.csv` y ejecuta:
```powershell
python execution/sync_sheets_to_frontend.py
```

### Cambiar Colores

Edita `src/frontend/theme.ts` (más info en README.md)

### Agregar Imágenes

Coloca imágenes en `src/frontend/public/images/products/` y actualiza el CSV con la URL

---

## 🚀 DEPLOY (FUTURO)

### Frontend (Vercel)
```powershell
npm install -g vercel
vercel deploy
```

### Backend (Railway/Heroku)
Sigue instrucciones en README.md

---

## 📞 INFORMACIÓN

- **Empresa:** Chocolatizados
- **Lema:** "Lo que quieras decir decilo con chocolates 🍫"
- **WhatsApp:** +54 9 342 5334765
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000

---

## ✨ RESUMEN

```
Tu plataforma tiene:

✅ Carrito de compras funcional
✅ 10 productos precargados
✅ Personalización de envoltorios
✅ Integración WhatsApp
✅ Diseño minimalista profesional
✅ Mobile-first responsive
✅ Backend API ready
✅ Sin login requerido
✅ 100% funcional

Todo listo para vender! 🍫
```

---

## 🎉 ¡A VENDER CHOCOLATES!

```powershell
# Terminal 1
cd src/frontend && npm run dev

# Terminal 2  
pip install -r src/backend/requirements.txt
cd src/backend && uvicorn main:app --reload

# Abre http://localhost:3000 ✅
```

---

**Creado con ❤️ | Next.js + FastAPI | 2026**
