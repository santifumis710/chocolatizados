# 🔐 Descargar credentials.json - Guía Visual

## Paso a Paso (con imágenes guía)

### 1️⃣ Abre Google Cloud Console

**URL:** https://console.cloud.google.com/

Deberías ver algo así:

```
┌─────────────────────────────────────┐
│  Google Cloud Console               │
│  [Mi proyecto ▼]  [Proyecto...]    │
└─────────────────────────────────────┘
```

---

### 2️⃣ Selecciona o Crea Proyecto

En la esquina superior izquierda, haz clic en **"Mi proyecto ▼"**

Si no ves "Chocolatizados":
1. Click en **"NUEVO PROYECTO"**
2. Nombre: `Chocolatizados`
3. Click **"CREAR"** (espera 1 minuto)
4. Selecciona el proyecto cuando aparezca

---

### 3️⃣ Habilita las APIs

En el buscador superior, escribe: **`Google Sheets API`**

1. Click en el primer resultado
2. Click en **"HABILITAR"**
3. Espera que se habilite

Repite para: **`Google Drive API`**

---

### 4️⃣ Crea Credenciales OAuth

En el menú izquierdo, haz click en **"Credenciales"**

Deberías ver:

```
┌─────────────────────────────────┐
│  + CREAR CREDENCIALES           │
│  Credenciales existentes:       │
│  (lista vacía o con otras)      │
└─────────────────────────────────┘
```

Click en **"+ CREAR CREDENCIALES"**

Se abre un menú:
```
┌─────────────────────────────┐
│ ¿Qué tipo de aplicación?   │
├─────────────────────────────┤
│ ○ Web Application           │
│ ○ Aplicación de escritorio │ ← SELECCIONA ESTA
│ ○ Otros                     │
└─────────────────────────────┘
```

Selecciona: **"Aplicación de escritorio"**

Click en **"CREAR"**

---

### 5️⃣ Descarga el JSON

Se abre un popup:

```
┌──────────────────────────────────┐
│  Credencial creada               │
│                                  │
│  Tu credencial OAuth 2.0 está   │
│  lista.                          │
│                                  │
│  [⬇️ DESCARGAR] [COPIAR]        │
└──────────────────────────────────┘
```

Click en **"⬇️ DESCARGAR"**

Se descarga un archivo similar a:
```
client_secret_xxxxxxxxx.json
```

---

### 6️⃣ Renombra el Archivo

El archivo descargado probablemente se llama algo como:
```
client_secret_123456789.json
```

**Renómbralo a:**
```
credentials.json
```

**Cómo renombrar:**
1. Click derecho en el archivo
2. Click en **"Renombrar"**
3. Borra el nombre actual
4. Escribe: `credentials.json`
5. Presiona Enter

---

### 7️⃣ Muévelo a tu Proyecto

El archivo debe estar en:
```
c:\Users\fumis\Workspace\Chocolatizados Project\credentials.json
```

**Cómo hacerlo:**

**Opción A: Cortar y Pegar**
1. Click derecho en `credentials.json`
2. Click en **"Cortar"**
3. Abre la carpeta: `c:\Users\fumis\Workspace\Chocolatizados Project\`
4. Click derecho en el espacio vacío
5. Click en **"Pegar"**

**Opción B: Copiar en Terminal**
```powershell
# Si el archivo está en Descargas:
Move-Item -Path "$env:USERPROFILE\Downloads\credentials.json" -Destination "c:\Users\fumis\Workspace\Chocolatizados Project\" -Force
```

---

## ✅ Verificar que Está Correcto

Una vez movido, abre PowerShell en la carpeta del proyecto:

```powershell
cd "c:\Users\fumis\Workspace\Chocolatizados Project"
Test-Path "credentials.json"
```

Deberías ver:
```
True
```

Si ves `False`, el archivo no está en el lugar correcto.

---

## 🚀 Ahora Carga los Productos

Una vez que `credentials.json` esté en su lugar:

```powershell
python execution/upload_to_google_sheets.py
```

**Primera ejecución:** Se abrirá una ventana de Google para permitir acceso
- Selecciona tu cuenta
- Click en **"Permitir"**
- Se guardará `token.json` automáticamente

**Resultado esperado:**
```
==================================================
📤 CARGAR PRODUCTOS A GOOGLE SHEETS
==================================================

📖 Leyendo productos.csv...
✅ 10 productos leídos

🔐 Autenticando...
(Se abre ventana de Google)

✅ Conectado

🧹 Limpiando Google Sheets...
📤 Cargando 10 productos...
✅ 10 productos cargados a Google Sheets
📊 URL: https://docs.google.com/spreadsheets/d/1bSDk...

==================================================
✅ CARGA COMPLETADA
==================================================
```

---

## 🎉 ¡Listo!

Ahora tu Google Sheets tiene 10 productos.

**Próximos pasos:**

1. Abre Google Sheets: https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/edit
2. Edita un precio (ej: 8.5 → 10.0)
3. Ejecuta en PowerShell:
   ```powershell
   python execution/sync_google_sheets.py
   ```
4. Recarga: http://localhost:3000
5. ✅ ¡El precio está actualizado!

---

## ❌ Si algo falla

### Error: "FileNotFoundError: credentials.json"
**Solución:** El archivo no está en la carpeta correcta
```powershell
# Verifica su ubicación:
cd "c:\Users\fumis\Workspace\Chocolatizados Project"
Get-ChildItem credentials.json
```

### Error: "PermissionDenied / Unauthorized"
**Solución:** 
1. Borra el archivo `token.json` (si existe)
2. Vuelve a ejecutar `python execution/upload_to_google_sheets.py`
3. Autoriza en el popup de Google

### Error: "Invalid spreadsheet ID"
**Solución:** Verifica que el ID en `.env` sea correcto:
```
GOOGLE_SHEETS_ID=1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94
```

---

## 📞 Google Cloud Console - Acceso Rápido

**Si perdiste el proyecto:**

1. Abre: https://console.cloud.google.com/
2. Click en el selector de proyectos (arriba a la izquierda)
3. Busca "Chocolatizados"
4. Click para seleccionarlo

**Si no lo ves:**
1. Clic en **"NUEVO PROYECTO"**
2. Nombre: `Chocolatizados`
3. Click en **"CREAR"**
4. Espera 1 minuto y recarga

---

## 🎓 Resumen

```
1. Google Cloud Console
2. Crear OAuth tipo "Desktop"
3. Descargar JSON
4. Renombrar a credentials.json
5. Mover a: c:\Users\fumis\Workspace\Chocolatizados Project\
6. Ejecutar: python execution/upload_to_google_sheets.py
7. ✅ Listo!
```

---

**Tiempo estimado:** 5 minutos

**¿Listo?** Abre Google Cloud Console: https://console.cloud.google.com/
