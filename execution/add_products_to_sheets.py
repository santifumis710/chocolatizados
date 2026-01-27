#!/usr/bin/env python3
"""
Agregar nuevos productos a Google Sheets
"""

import os
import csv
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import gspread

BASE_DIR = Path(__file__).parent.parent
TOKEN_FILE = BASE_DIR / "token.json"
CSV_FILE = BASE_DIR / ".tmp" / "simples_chicos.csv"
SHEETS_ID = "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94"

print("=" * 60)
print("📤 AGREGAR PRODUCTOS A GOOGLE SHEETS")
print("=" * 60)

try:
    # Cargar token
    print(f"📝 Cargando token...")
    creds = Credentials.from_authorized_user_file(TOKEN_FILE)
    
    if creds.expired:
        print("🔄 Refrescando token...")
        creds.refresh(Request())
    
    # Autorizar y abrir sheet
    print(f"🔐 Autorizando con Google Sheets API...")
    client = gspread.authorize(creds)
    sheet = client.open_by_key(SHEETS_ID)
    worksheet = sheet.get_worksheet(0)
    
    # Leer CSV
    print(f"📖 Leyendo CSV: {CSV_FILE}")
    products = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(row)
    
    print(f"✅ {len(products)} productos para agregar")
    
    # Agregar filas
    print(f"📤 Agregando a Google Sheets...")
    rows = []
    for product in products:
        row = [
            product['id'],
            product['name'],
            product['price'],
            product['category'],
            product['weight_g'],
            product['dimensions'],
            product['description'],
            product['image_url'],
            product['allows_customization']
        ]
        rows.append(row)
    
    worksheet.append_rows(rows, value_input_option='RAW')
    
    print(f"✅ Productos agregados exitosamente!")
    print(f"🌐 Revisa: https://docs.google.com/spreadsheets/d/{SHEETS_ID}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
