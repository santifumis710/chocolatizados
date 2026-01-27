# 📋 Resumen de Cambios - Google Sheets Integration

## ✅ Completado

### 1. Logo en Header
- ✅ Copiado `logo chocolatizados.jpg` a `src/frontend/public/logo.jpg`
- ✅ Actualizado `app/page.tsx` para mostrar el logo en lugar del emoji 🍫
- ✅ Frontend reiniciado automáticamente

**Resultado:** Logo profesional en el header izquierdo

---

### 2. Directiva Google Sheets
- ✅ Creado: `directives/google_sheets_sync.md`
- ✅ Documentación completa del flujo
- ✅ Estructura esperada de Google Sheets
- ✅ Validaciones y edge cases

**Ubicación:** [directives/google_sheets_sync.md](directives/google_sheets_sync.md)

---

### 3. Scripts de Ejecución

#### a) `sync_google_sheets.py`
```bash
python execution/sync_google_sheets.py
```

**Qué hace:**
1. Autentica con Google Sheets (OAuth 2.0)
2. Descarga datos de tu Google Sheets
3. Valida todos los productos
4. Guarda en `.tmp/productos.csv`
5. Ejecuta automáticamente `sync_sheets_to_frontend.py`
6. Genera `src/frontend/public/products.json`

**Primera ejecución:** Se abrirá ventana de Google → Permite acceso → Se guardará `token.json`

#### b) `upload_to_google_sheets.py`
```bash
python execution/upload_to_google_sheets.py
```

**Qué hace:**
- Carga los productos actuales de `.tmp/productos.csv` a Google Sheets
- Útil para inicializar el Sheet con los 10 productos

---

### 4. Configuración
- ✅ Actualizado `.env` con:
  - `GOOGLE_SHEETS_ID`
  - `GOOGLE_SHEETS_RANGE`
  - `GOOGLE_CREDENTIALS_PATH`
- ✅ Actualizado `.gitignore` para excluir:
  - `credentials.json`
  - `token.json`
- ✅ Actualizado `requirements.txt` con dependencias de Google:
  - `google-auth-oauthlib`
  - `google-auth-httplib2`
  - `google-api-python-client`

---

### 5. Guía de Setup
- ✅ Creado: `SETUP_GOOGLE_SHEETS.md`
- ✅ Paso a paso para crear proyecto Google Cloud
- ✅ Instrucciones para descargar `credentials.json`
- ✅ Troubleshooting completo

**Ubicación:** [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

---

## 🔄 Flujo de Sincronización

```
Google Sheets (Master)
      ↓
sync_google_sheets.py (Descarga)
      ↓
.tmp/productos.csv (Intermedio)
      ↓
sync_sheets_to_frontend.py (Convierte)
      ↓
src/frontend/public/products.json (Frontend)
      ↓
Página web ✅ (Actualizada automáticamente)
```

---

## 🎯 Cómo Usar

### Primero: Configurar Google Cloud

Sigue [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md):
1. Crear proyecto en Google Cloud
2. Habilitar APIs
3. Descargar `credentials.json`
4. Colocar en raíz del proyecto

### Luego: Instalar Dependencias

```powershell
pip install -r requirements.txt
```

### Opción A: Cargar productos iniciales a Google Sheets

```powershell
python execution/upload_to_google_sheets.py
```

Esto toma los 10 productos actuales de `.tmp/productos.csv` y los carga a tu Google Sheets.

### Opción B: Descargar desde Google Sheets

```powershell
python execution/sync_google_sheets.py
```

Descarga todos los productos de Google Sheets y los sincroniza con la web.

---

## 📊 Estructura Google Sheets Esperada

**Sheet:** "Productos" (primera hoja)

| id | name | price | category | weight_g | dimensions | description | image_url | allows_customization |
|-|-|-|-|-|-|-|-|-|
| 1 | Chocolate Oscuro 70% | 8.5 | Clásico | 100 | 10x5cm | ... | | FALSE |
| 2 | Box Personalizado 6 | 25.0 | Boxes | 500 | 15x15cm | ... | | TRUE |

**Notas:**
- ✅ Encabezados en primera fila (DEBEN coincidir)
- ✅ Precio: número (8.5, no "$8.5")
- ✅ allows_customization: TRUE o FALSE
- ✅ ID: números enteros únicos

---

## 🚀 Automatización (Futuro)

Puedes ejecutar `sync_google_sheets.py` en un scheduler para sincronizar automáticamente cada X minutos:

### Windows (Task Scheduler)
```powershell
# Crear tarea programada
$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 5)
$action = New-ScheduledTaskAction -Execute "python.exe" -Argument "C:\...\execution\sync_google_sheets.py"
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "ChocolatizadosSync"
```

### Linux/macOS (cron)
```bash
*/5 * * * * cd /path && python execution/sync_google_sheets.py
```

---

## 📁 Archivos Creados/Modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `execution/sync_google_sheets.py` | ✨ Nuevo | Descarga de Google Sheets |
| `execution/upload_to_google_sheets.py` | ✨ Nuevo | Carga a Google Sheets |
| `directives/google_sheets_sync.md` | ✨ Nuevo | Documentación técnica |
| `SETUP_GOOGLE_SHEETS.md` | ✨ Nuevo | Guía de configuración |
| `src/frontend/public/logo.jpg` | ✨ Nuevo | Logo en header |
| `src/frontend/app/page.tsx` | 📝 Modificado | Logo en lugar de emoji |
| `next.config.js` | 📝 Modificado | Removido opción inválida |
| `.env` | 📝 Modificado | Variables Google Sheets |
| `.gitignore` | 📝 Modificado | Excluye credenciales |
| `requirements.txt` | 📝 Modificado | Dependencias Google |

---

## ✨ Próximos Pasos

1. **Seguir SETUP_GOOGLE_SHEETS.md** para configurar Google Cloud
2. **Descargar credentials.json** y colocar en raíz
3. **Ejecutar:** `python execution/upload_to_google_sheets.py` (cargar iniciales)
4. **Verificar:** Google Sheets tenga los 10 productos
5. **Editar precios** en Google Sheets
6. **Ejecutar:** `python execution/sync_google_sheets.py`
7. **Verificar:** Precios actualizados en http://localhost:3001 ✅

---

## 🎨 Estado Actual

- ✅ **Logo:** Visible en header (profesional)
- ✅ **Frontend:** http://localhost:3000 (reiniciado)
- ✅ **Backend:** http://localhost:8000 (activo)
- ✅ **Productos:** 10 en catálogo
- ✅ **Google Sheets:** Listo para usar
- ✅ **Scripts:** Listos para ejecutar

**¿Necesitas ayuda?** Lee [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)
