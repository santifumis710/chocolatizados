#!/usr/bin/env python3
"""
Reemplazar todos los Simples Chicos en Google Sheets
"""

import csv
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import gspread

BASE_DIR = Path(__file__).parent.parent
TOKEN_FILE = BASE_DIR / "token.json"
SHEETS_ID = "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94"

print("=" * 60)
print("🔄 REEMPLAZAR SIMPLES CHICOS EN GOOGLE SHEETS")
print("=" * 60)

try:
    # Cargar token
    print(f"📝 Cargando token...")
    creds = Credentials.from_authorized_user_file(TOKEN_FILE)
    
    if creds.expired:
        print("🔄 Refrescando token...")
        creds.refresh(Request())
    
    # Autorizar y abrir sheet
    print(f"🔐 Autorizando...")
    client = gspread.authorize(creds)
    sheet = client.open_by_key(SHEETS_ID)
    worksheet = sheet.get_worksheet(0)
    
    # Obtener todas las filas
    all_values = worksheet.get_all_values()
    
    # Mantener solo productos que NO sean Simples Chicos (ids 11-19)
    headers = all_values[0]
    filtered_rows = [all_values[0]]  # Mantener encabezado
    
    for row in all_values[1:]:
        if row and row[0]:  # Si tiene contenido
            try:
                prod_id = int(row[0])
                # Mantener si NO está entre 11 y 19
                if prod_id < 11 or prod_id > 19:
                    filtered_rows.append(row)
            except:
                pass
    
    print(f"📊 Limpiando {len(all_values) - len(filtered_rows)} filas de Simples Chicos")
    
    # Reemplazar contenido
    worksheet.clear()
    worksheet.append_rows(filtered_rows, value_input_option='RAW')
    
    # Agregar nuevos productos
    CSV_FILE = BASE_DIR / ".tmp" / "simples_chicos_v2.csv"
    new_products = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            new_products.append([
                row['id'],
                row['name'],
                row['price'],
                row['category'],
                row['weight_g'],
                row['dimensions'],
                row['description'],
                row['image_url'],
                row['allows_customization'],
                row['options']
            ])
    
    print(f"➕ Agregando {len(new_products)} nuevos Simples Chicos")
    worksheet.append_rows(new_products, value_input_option='RAW')
    
    print(f"✅ Reemplazo completado!")
    print(f"🌐 Total: {len(filtered_rows) - 1 + len(new_products)} productos")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
