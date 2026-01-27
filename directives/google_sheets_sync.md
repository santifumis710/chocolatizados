# Google Sheets Sync - Directiva

## Objetivo

Sincronizar productos desde Google Sheets hacia `productos.csv` y `products.json` de forma automática. Permite actualizar precios y productos desde Google Sheets y que se reflejen en tiempo real en la web.

## Flujo de Datos

```
Google Sheets (master data)
        ↓
sync_google_sheets.py (script)
        ↓
.tmp/productos.csv (intermedio)
        ↓
src/frontend/public/products.json (frontend)
        ↓
Página web ✅
```

## Requisitos

- **Cuenta Google** con acceso a Google Sheets
- **OAuth 2.0** para acceso a la API de Google Sheets
- **Dependencias Python:**
  - `google-auth-oauthlib`
  - `google-auth-httplib2`
  - `google-api-python-client`
  - `python-dotenv`

## Configuración

### 1. Crear proyecto Google Cloud

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto: "Chocolatizados"
3. Habilitar APIs:
   - Google Sheets API
   - Google Drive API
4. Crear credenciales OAuth 2.0:
   - Tipo: Desktop application
   - Descargar como JSON → guardar en `credentials.json`

### 2. Configurar Google Sheets

**URL:** https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94/edit?usp=sharing

**Estructura esperada (Sheet "Productos"):**

| id | name | price | category | weight_g | dimensions | description | image_url | allows_customization |
|---|---|---|---|---|---|---|---|---|
| 1 | Chocolate Oscuro 70% | 8.5 | Clásico | 100 | 10x5cm | ... | ... | FALSE |
| 2 | Box Personalizado 6 | 25.0 | Boxes | 500 | 15x15cm | ... | ... | TRUE |

**Notas:**
- Primera fila: encabezados (DEBE coinciddir con los nombres de columna esperados)
- Precio: número (8.5, no "$8.5")
- allows_customization: TRUE o FALSE (mayúsculas)
- ID: números enteros únicos

## Ejecución

### Manual (local)
```bash
python execution/sync_google_sheets.py
```

### Variables de Entorno (.env)

```
GOOGLE_SHEETS_ID=1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94
GOOGLE_SHEETS_RANGE=Productos!A1:I100
GOOGLE_CREDENTIALS_PATH=credentials.json
```

## Output

### Éxito
```
✅ Conectado a Google Sheets
✅ Descargados 10 productos
✅ Guardado: .tmp/productos.csv
✅ Generado: src/frontend/public/products.json
```

### Error Común

**Error:** "FileNotFoundError: credentials.json"
- **Solución:** Crear proyecto Google Cloud (ver Configuración)

**Error:** "Unauthorized"
- **Solución:** Ejecutar script → permitir acceso en popup → se guardará token.json

## Automatización (Futuro)

```bash
# Ejecutar cada 5 minutos (cron/scheduler)
*/5 * * * * cd /ruta && python execution/sync_google_sheets.py
```

## Archivos Relacionados

- `execution/sync_google_sheets.py` - Script de descarga
- `execution/sync_sheets_to_frontend.py` - Conversión CSV → JSON (ya existente)
- `.env` - Variables de entorno
- `credentials.json` - OAuth (no commit, en .gitignore)
- `token.json` - Token guardado (no commit, en .gitignore)

## Flujo Paso a Paso

1. Usuario edita precio en Google Sheets
2. Ejecuta: `python execution/sync_google_sheets.py`
3. Script descarga datos → guarda en `.tmp/productos.csv`
4. Ejecuta automáticamente `sync_sheets_to_frontend.py`
5. Genera `products.json`
6. Frontend recarga automáticamente (hot reload en dev)
7. Precio actualizado en web ✅

## Validación

Script valida:
- ✅ Acceso a Google Sheets
- ✅ Presencia de todas las columnas requeridas
- ✅ Precios son números
- ✅ IDs únicos
- ✅ allow_customization es TRUE/FALSE
- ✅ Archivos guardados correctamente

## Edge Cases

| Caso | Comportamiento |
|------|----------------|
| Fila con ID vacío | Se asigna automáticamente |
| Precio vacío | Default: 0.00 (requiere validación manual) |
| allow_customization diferente | Se convierte a TRUE/FALSE |
| Google Sheets no accesible | Error claro, no sobrescribe datos |
| Conexión interrumpida | Reintentar o fallar gracefully |
