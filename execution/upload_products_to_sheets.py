"""
upload_products_to_sheets.py

Script para llenar el Google Sheets con productos desde CSV local

Usa OAuth 2.0 Web Application Flow

Uso:
    python execution/upload_products_to_sheets.py
"""

import csv
import gspread
import os
import json
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials as OAuth2Credentials
import pickle

SCRIPT_DIR = Path(__file__).parent.parent
CSV_FILE = SCRIPT_DIR / ".tmp" / "PARA_GOOGLE_SHEETS.csv"
SHEETS_ID = "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94"
TOKEN_FILE = SCRIPT_DIR / "token.json"

# Buscar credenciales
CRED_FILES = [
    SCRIPT_DIR / "client_secret_739613748692-366sr8rkd4sktsjhlb63dt2ekveclvv9.apps.googleusercontent.com.json"
]

def find_credentials():
    """Buscar archivo de credenciales"""
    for cred_file in CRED_FILES:
        if cred_file.exists():
            return str(cred_file)
    
    # Alternativa: buscar cualquier client_secret_*.json
    for file in SCRIPT_DIR.glob("client_secret_*.json"):
        return str(file)
    
    return None

def get_oauth_credentials(creds_path: str):
    """Obtener credenciales OAuth 2.0"""
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    creds = None
    
    # Si existe token guardado, usarlo
    if TOKEN_FILE.exists():
        print(f"📝 Usando token guardado...")
        creds = OAuth2Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        if creds.valid:
            return creds
    
    # Si no hay token válido, hacer flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print(f"🔄 Refrescando token...")
            creds.refresh(Request())
        else:
            print(f"🔐 Iniciando autenticación OAuth...")
            print(f"   ⚠️ Se abrirá tu navegador para autorizar")
            print(f"   Asegúrate de haber configurado estos Redirect URIs en Google Cloud:\n")
            print(f"   ✓ http://localhost:8080")
            print(f"   ✓ http://127.0.0.1:8080\n")
            
            try:
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                creds = flow.run_local_server(port=8080, open_browser=True)
            except Exception as e:
                print(f"   ⚠️ Error con puerto 8080: {e}")
                print(f"   Intentando con puerto alternativo...")
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                creds = flow.run_local_server(port=0, open_browser=True)
        
        # Guardar token para próxima vez
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        print(f"✅ Token guardado en: {TOKEN_FILE}\n")
    
    return creds

def read_csv(csv_path: Path) -> list:
    """Leer datos del CSV"""
    if not csv_path.exists():
        print(f"❌ Error: No se encuentra {csv_path}")
        return []
    
    data = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
        print(f"✅ {len(data)} productos leídos del CSV")
        return data
    except Exception as e:
        print(f"❌ Error leyendo CSV: {e}")
        return []

def upload_to_sheets(creds, sheet_id: str, data: list) -> bool:
    """Subir datos a Google Sheets"""
    try:
        # Autorizar cliente
        client = gspread.authorize(creds)
        
        # Abrir la hoja
        print(f"📖 Abriendo Google Sheets...")
        sheet = client.open_by_key(sheet_id)
        worksheet = sheet.get_worksheet(0)  # Primera hoja por índice
        
        # Limpiar contenido existente
        print("🗑️ Limpiando hoja existente...")
        worksheet.clear()
        
        # Preparar encabezados
        headers = ["id", "name", "price", "category", "weight_g", "dimensions", 
                   "description", "image_url", "allows_customization"]
        
        # Preparar rows con datos
        rows = [headers]
        for product in data:
            row = [
                str(product.get("id", "")),
                str(product.get("name", "")),
                str(product.get("price", "")),
                str(product.get("category", "")),
                str(product.get("weight_g", "")),
                str(product.get("dimensions", "")),
                str(product.get("description", "")),
                str(product.get("image_url", "")),
                str(product.get("allows_customization", ""))
            ]
            rows.append(row)
        
        # Subir datos en lotes
        print(f"📤 Subiendo {len(data)} productos...")
        worksheet.append_rows(rows, value_input_option='RAW')
        
        print(f"✅ Datos subidos exitosamente!")
        print(f"🌐 Abre: https://docs.google.com/spreadsheets/d/{sheet_id}")
        return True
        
    except Exception as e:
        print(f"❌ Error subiendo a Sheets: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "="*60)
    print("📤 SUBIR PRODUCTOS A GOOGLE SHEETS")
    print("="*60 + "\n")
    
    # Buscar credenciales
    creds_path = find_credentials()
    if not creds_path:
        print("❌ No se encontraron credenciales (client_secret_*.json)")
        print("   Descárgalas de Google Cloud Console y colócalas en la raíz del proyecto")
        return False
    
    print(f"✅ Credenciales encontradas: {Path(creds_path).name}\n")
    
    # Obtener credenciales OAuth
    try:
        creds = get_oauth_credentials(creds_path)
    except Exception as e:
        print(f"❌ Error en autenticación: {e}")
        return False
    
    # Leer CSV
    data = read_csv(CSV_FILE)
    if not data:
        return False
    
    print()
    
    # Subir a Sheets
    success = upload_to_sheets(creds, SHEETS_ID, data)
    
    if success:
        print("\n" + "="*60)
        print("✅ ¡COMPLETADO!")
        print("="*60)
        print("\n🎉 Google Sheets actualizado con 10 productos")
        print("📝 Ahora puedes editar en:")
        print("   https://docs.google.com/spreadsheets/d/1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94")
        print("\n💡 Próximo flujo:")
        print("   1. Edita en Google Sheets")
        print("   2. Descarga como CSV")
        print("   3. Coloca en: .tmp/productos.csv")
        print("   4. Ejecuta: python execution/import_csv_to_products.py")
        print("   5. Web actualizada ✅\n")
    
    return success

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
