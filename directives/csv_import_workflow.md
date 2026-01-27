# CSV Import Workflow

**Status:** ✅ ACTIVE (Production)  
**Cost:** 🆓 Completely Free  
**Complexity:** ⚡ Simple & Reliable  

---

## Overview

Este es el flujo **simple, sostenible y GRATIS** para administrar productos:

1. **Editas productos** en Google Sheets (gratuito, versión online)
2. **Descargas como CSV** (función nativa de Google Sheets)
3. **Colocas el archivo** en `.tmp/productos.csv`
4. **Ejecutas el script** que importa al sitio web
5. **Listo** ✅ - El sitio se actualiza automáticamente

---

## Step by Step

### 1️⃣ Editar Productos en Google Sheets

Abre tu Google Sheets: [Tu enlace de Google Sheets]

Estructura de columnas:
```
id | name | price | category | weight_g | dimensions | description | image_url | allows_customization
```

**Ejemplo de fila:**
```
1 | Bombones Clásicos | 25.99 | Bombones | 200 | 15x10x5cm | Deliciosos bombones de chocolate... | https://url-imagen.jpg | TRUE
```

**Notas importantes:**
- **id:** Número único (1, 2, 3...)
- **price:** Número con decimales (10.50, 25.99)
- **allows_customization:** TRUE o FALSE (para productos personalizables)
- **image_url:** URL completa de la imagen o vacío
- Los demás campos pueden estar vacíos

---

### 2️⃣ Descargar CSV desde Google Sheets

En Google Sheets:
1. Menú → **Archivo** → **Descargar**
2. Selecciona → **Valores separados por comas (.csv)**
3. Se descargará un archivo: `Spreadsheet.csv`

```
📥 Descargado: C:\Users\tu-usuario\Downloads\Spreadsheet.csv
```

---

### 3️⃣ Colocar el Archivo

1. Abre el archivo descargado con un editor de texto (Notepad)
2. **Copia TODO el contenido**
3. Navega a: `Chocolatizados Project/.tmp/`
4. Crea un archivo: `productos.csv`
5. **Pega el contenido** y guarda

```
📍 Ubicación final: Chocolatizados Project/.tmp/productos.csv
```

**Alternativa (Copy-Paste automático):**
```bash
# En PowerShell:
Copy-Item "C:\Users\tu-usuario\Downloads\Spreadsheet.csv" `
          "C:\Users\fumis\Workspace\Chocolatizados Project\.tmp\productos.csv"
```

---

### 4️⃣ Ejecutar el Script de Importación

Abre terminal en `Chocolatizados Project/`:

```bash
# Opción A: Con Python directamente
python execution/import_csv_to_products.py

# Opción B: Con alias de PowerShell (si está configurado)
python execution/import_csv_to_products.py
```

**Esperado:**
```
============================================================
📥 IMPORTAR CSV → products.json
============================================================

📖 Leyendo: C:\...\Chocolatizados Project\.tmp\productos.csv
✅ 10 productos leídos

📋 Productos importados:
    1. Bombones Clásicos        $ 25.99 ✨ (personalizable)
    2. Trufas Premium           $ 35.00
    ...

✅ Guardado: ...src/frontend/public/products.json
✅ Backup: .../.tmp/products.json

============================================================
✅ IMPORTACIÓN COMPLETADA
============================================================

✨ 10 productos listos en products.json
🌐 Frontend se actualiza automáticamente (hot reload)
```

---

### 5️⃣ Verificar en Web

1. Abre: http://localhost:3000
2. Deberías ver los productos actualizados
3. **Carrito funciona automáticamente**
4. **WhatsApp integrado funciona**

---

## Qué hace el script `import_csv_to_products.py`

```
CSV → Valida formato
    ↓
Convierte tipos (price a float, customization a boolean)
    ↓
Ordena por ID
    ↓
Guarda en products.json (frontend)
    ↓
Guarda backup en .tmp/ (seguridad)
    ↓
Listo ✅
```

---

## Errores Comunes & Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `.tmp/productos.csv` no existe | No colocaste el archivo | Verifica la ruta exacta |
| Precios muestran como 0 | Columna `price` vacía o formato inválido | Rellena precios correctamente |
| Producto omitido (⚠️ msg) | Falta `id` o `name` | Completa los campos obligatorios |
| JSON no se actualiza en web | Frontend no detecta cambios | Presiona F5 en el navegador |

---

## Flujo Completado ✅

```
🔄 Ciclo Completo:

   📊 Google Sheets (editas)
        ↓ Descargas CSV
   💾 .tmp/productos.csv
        ↓ Ejecutas script
   📦 src/frontend/public/products.json
        ↓ Frontend carga
   🌐 http://localhost:3000
        ↓ Usuarios ven productos
   🛒 Carrito + WhatsApp
        ↓
   ✅ Venta completada
```

---

## Ventajas de este Flujo

✅ **100% Gratuito** - Cero costos, sin cloud lock-in  
✅ **Simple** - 4 pasos, no requiere configuración  
✅ **Sostenible** - Google Sheets es estable (Google no desaparece)  
✅ **Rápido** - Cambios en segundos  
✅ **Sin dependencias** - No necesita APIs ni autenticación  
✅ **Completo control** - Tú controlas tu data  
✅ **Fácil backup** - CSV es accesible y portable  

---

## Próximos Pasos

1. ✅ **Descarga tu Google Sheets como CSV**
2. ✅ **Colócalo en `.tmp/productos.csv`**
3. ✅ **Ejecuta el script**
4. ✅ **Verifica en http://localhost:3000**

**¡Listo! Tu tienda de Chocolatizados está lista para vender.**

---

## Automatizar (Opcional Avanzado)

Para usuarios técnicos: Puedes crear un `.bat` o `.ps1` que baje automáticamente desde Google Sheets:

```powershell
# download_and_import.ps1
$url = "https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv"
Invoke-WebRequest -Uri $url -OutFile ".tmp/productos.csv"
python execution/import_csv_to_products.py
```

Pero por ahora, el **manual es suficiente y más seguro**.

---

## Soporte

Si tienes dudas:
1. Verifica que `productos.csv` esté en la carpeta correcta
2. Abre el CSV con Notepad para verificar el formato
3. Corre el script nuevamente
4. Presiona F5 en el navegador para recargar

**El flujo es simple porque queremos que sea sostenible.** ✅
