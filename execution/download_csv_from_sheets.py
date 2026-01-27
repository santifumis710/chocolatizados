#!/usr/bin/env python3
"""
Descargar CSV desde Google Sheets usando OAuth
"""

import os
import sys
import csv
from pathlib import Path

# Configurar rutas
BASE_DIR = Path(__file__).parent.parent
TOKEN_FILE = BASE_DIR / "token.json"
CREDS_FILE = BASE_DIR / "client_secret_739613748692-366sr8rkd4sktsjhlb63dt2ekveclvv9.apps.googleusercontent.com.json"
OUTPUT_CSV = BASE_DIR / ".tmp" / "productos.csv"
SHEETS_ID = "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94"

# Crear .tmp si no existe
OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("📥 DESCARGAR CSV DESDE GOOGLE SHEETS")
print("=" * 60)

try:
    import gspread
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    
    # Cargar token guardado
    if not TOKEN_FILE.exists():
        print(f"❌ Token no encontrado: {TOKEN_FILE}")
        sys.exit(1)
    
    print(f"📝 Cargando token...")
    creds = Credentials.from_authorized_user_file(TOKEN_FILE)
    
    # Refrescar si es necesario
    if creds.expired:
        print("🔄 Refrescando token...")
        creds.refresh(Request())
    
    # Autorizar cliente
    print(f"🔐 Autorizando con Google Sheets API...")
    client = gspread.authorize(creds)
    
    # Abrir sheet
    print(f"📖 Abriendo Google Sheets...")
    sheet = client.open_by_key(SHEETS_ID)
    worksheet = sheet.get_worksheet(0)
    
    # Obtener todos los datos
    print(f"📊 Obteniendo datos...")
    data = worksheet.get_all_values()
    
    if not data:
        print(f"⚠️ No hay datos en el sheet")
        sys.exit(1)
    
    # Guardar como CSV
    print(f"💾 Guardando CSV en: {OUTPUT_CSV}")
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(data)
    
    print(f"✅ CSV descargado exitosamente!")
    print(f"📋 Filas: {len(data)} (encabezado + {len(data) - 1} productos)")
    print(f"💡 Próximo paso: python execution/import_csv_to_products.py")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
