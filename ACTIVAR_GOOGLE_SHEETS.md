# 🔧 Activar Google Sheets

## Paso 1: Descargar credentials.json

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona o crea proyecto "Chocolatizados"
3. Ve a **Credenciales** (menú izquierdo)
4. Busca la aplicación OAuth 2.0 tipo "Desktop"
5. Haz clic en el botón descargar (⬇️)
6. Se descarga un JSON
7. **Renómbralo a `credentials.json`**
8. **Muévelo a la raíz del proyecto:**
   ```
   c:\Users\fumis\Workspace\Chocolatizados Project\credentials.json
   ```

Si no tienes OAuth creado, sigue: https://support.google.com/cloud/answer/6158849

---

## Paso 2: Carga los Productos

```powershell
python execution/upload_to_google_sheets.py
```

**Resultado esperado:**
```
==================================================
📤 CARGAR PRODUCTOS A GOOGLE SHEETS
==================================================

📖 Leyendo productos.csv...
✅ 10 productos leídos

🔐 Autenticando...
✅ Conectado

🧹 Limpiando Google Sheets...
📤 Cargando 10 productos...
✅ 10 productos cargados a Google Sheets
📊 URL: https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/edit

==================================================
✅ CARGA COMPLETADA
==================================================
```

---

## Paso 3: Verifica en Google Sheets

Abre: https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/edit

Deberías ver tu hoja "Productos" con 10 productos.

---

## Paso 4: Edita Precios y Sincroniza

Cuando quieras actualizar precios:

1. **Edita en Google Sheets** (ej: cambiar precio de 8.5 a 10.0)
2. **Ejecuta:**
```powershell
python execution/sync_google_sheets.py
```
3. **¡Listo!** La web se actualiza automáticamente

---

## 🛒 Carrito de Compras

El carrito **ya está 100% funcional**:

✅ **Agregar al carrito** - Botón en cada producto
✅ **Ver carrito** - Click en 🛒 en el header
✅ **Cambiar cantidad** - En el carrito
✅ **Quitar productos** - En el carrito
✅ **Checkout** - Llenar formulario
✅ **WhatsApp** - Enviar orden directo

---

## 📁 Archivos Movidos

Los archivos menos frecuentes están ahora en **`_docs/`**:
- COMPLETADO_UPDATE.md
- QUICK_START.md
- INSTRUCCIONES_FINALES.md
- AGENTS.md
- GEMINI.md
- PROJECT_STATUS.md
- setup.sh
- setup_auto.py

---

## 📖 Documentación Principal

```
README.md                      ← Documentación técnica
START_HERE.md                  ← Bienvenida y guía general
RAPIDO.md                      ← Resumen rápido
SETUP_GOOGLE_SHEETS.md         ← Configuración detallada
GOOGLE_SHEETS_INTEGRATION.md   ← Cambios técnicos
directives/                    ← SOPs y procedimientos
execution/                     ← Scripts Python
```

---

## ✨ Estado Actual

```
✅ Frontend: http://localhost:3000 (con logo)
✅ Backend: http://localhost:8000
✅ Carrito: 100% funcional
✅ Productos: 10 en catálogo
✅ Google Sheets: Listo para usar (necesita credentials.json)
```

---

## 🎯 Próximos Pasos

1. **AHORA:** Descarga `credentials.json` de Google Cloud
2. **LUEGO:** Ejecuta `python execution/upload_to_google_sheets.py`
3. **DESPUÉS:** Edita precios en Google Sheets y sincroniza con `sync_google_sheets.py`

---

**¿Necesitas más detalles?** Lee `SETUP_GOOGLE_SHEETS.md`
