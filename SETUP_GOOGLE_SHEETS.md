# ⚙️ Configurar Google Sheets Sync

## Paso 1: Crear Proyecto Google Cloud

1. Abre [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos (arriba a la izquierda)
3. Clic en **"NUEVO PROYECTO"**
4. Nombre: `Chocolatizados`
5. Clic en **"CREAR"** (espera ~1 minuto)

## Paso 2: Habilitar APIs

1. En la barra de búsqueda, escribe: `Google Sheets API`
2. Haz clic en el resultado
3. Clic en **"HABILITAR"**
4. Repite para: `Google Drive API`

## Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **"Credenciales"** (menú izquierdo)
2. Clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"Aplicación de escritorio"**
4. Dale un nombre: `Chocolatizados App`
5. Clic en **"CREAR"**
6. Clic en el botón descargar (icono ⬇️)
7. **Rename** el archivo a `credentials.json`
8. **Mueve** `credentials.json` a la raíz del proyecto:
   ```
   c:\Users\fumis\Workspace\Chocolatizados Project\credentials.json
   ```

## Paso 4: Verificar Google Sheets

Tu Google Sheets está configurado en `.env`:
- **ID:** `1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94`
- **URL:** https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/edit

**Estructura esperada (Sheet "Productos"):**

| id | name | price | category | weight_g | dimensions | description | image_url | allows_customization |
|-|-|-|-|-|-|-|-|-|
| 1 | Chocolate Oscuro 70% | 8.5 | Clásico | 100 | 10x5cm | Excelente... | | FALSE |
| 2 | Box Personalizado 6 | 25.0 | Boxes | 500 | 15x15cm | ... | | TRUE |

**Notas importantes:**
- ✅ Primera fila = encabezados (deben coincidir exactamente)
- ✅ Precio = número (8.5, no "$8.5")
- ✅ allows_customization = TRUE o FALSE (mayúsculas)
- ✅ ID = números enteros únicos (1, 2, 3...)

## Paso 5: Instalar Dependencias (si falta)

```powershell
pip install google-auth-oauthlib google-api-python-client
```

## Paso 6: Primera Ejecución

```powershell
cd c:\Users\fumis\Workspace\Chocolatizados Project
python execution/sync_google_sheets.py
```

**Primera vez:** Se abrirá ventana de Google para permitir acceso → Permite → Se guardará `token.json`

**Resultado esperado:**
```
==================================================
🔄 SINCRONIZACIÓN GOOGLE SHEETS
==================================================

🔐 Autenticando con Google Sheets...
✅ Autenticación exitosa

📥 Descargando desde: Productos!A1:I100
✅ Descargados 10 productos

📋 Validando 10 productos...
✅ 10/10 productos válidos

✅ Guardado: .tmp\productos.csv

📊 Ejecutando sync_sheets_to_frontend.py...
✅ Chocolate Oscuro 70% - $8.5
✅ Chocolate Blanco Premium - $7.5
...
✅ Exportado: src\frontend\public\products.json (10 productos)

==================================================
✅ SINCRONIZACIÓN COMPLETADA
==================================================
```

## Paso 7: Automatizar (Opcional)

Para que se ejecute cada vez que cambies precios en Google Sheets:

### Windows (Task Scheduler)
```powershell
# Crear tarea programada cada 5 minutos
$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 365)
$action = New-ScheduledTaskAction -Execute "python.exe" -Argument "c:\path\execution\sync_google_sheets.py"
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "ChocolatizadosSync" -Description "Sync Google Sheets"
```

### macOS / Linux (cron)
```bash
*/5 * * * * cd /path/to/project && python execution/sync_google_sheets.py
```

## Flujo de Uso

1. 📊 **Edita precio en Google Sheets**
2. 🔄 **Ejecuta:** `python execution/sync_google_sheets.py`
3. 📁 **Actualiza:** `productos.csv` y `products.json`
4. 🌐 **Frontend recarga** automáticamente (hot reload)
5. ✅ **Precio actualizado** en web

## Troubleshooting

| Error | Solución |
|-------|----------|
| `FileNotFoundError: credentials.json` | Descarga credentials.json desde Google Cloud Console |
| `Unauthorized` | Primera ejecución: permite acceso en popup |
| `INVALID_ARGUMENT` | Verifica nombre de Sheet sea exactamente "Productos" |
| `Empty data` | Verifica que Google Sheets tenga datos en A1:I100 |

## Archivos Creados

- ✅ `execution/sync_google_sheets.py` - Script de sincronización
- ✅ `directives/google_sheets_sync.md` - Documentación
- ✅ `credentials.json` - OAuth (lo descargaste)
- ✅ `token.json` - Se crea automáticamente en primera ejecución
- ✅ `.env` - Variables actualizadas

## ¿Necesitas ayuda?

Ejecuta cualquier momento:
```bash
python execution/sync_google_sheets.py
```

El script te dará feedback claro si hay errores.

---

**Estado:** ✅ Sistema de sincronización listo para configurar
