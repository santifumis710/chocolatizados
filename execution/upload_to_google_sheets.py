"""
upload_to_google_sheets.py

Script para cargar productos iniciales a Google Sheets.
Útil para la primera vez cuando quieres llenar el Sheet con los productos CSV.

Uso:
    python execution/upload_to_google_sheets.py

Requiere:
    - credentials.json (OAuth 2.0)
    - .tmp/productos.csv (datos)
"""

import os
import csv
import sys
from pathlib import Path
from dotenv import load_dotenv

try:
    from google.oauth2.service_account import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build

    HAS_GOOGLE = True
except ImportError:
    HAS_GOOGLE = False
    print("⚠️  Google API no instalada. Instala: pip install google-auth-oauthlib google-api-python-client")

load_dotenv()

GOOGLE_SHEETS_ID = os.getenv("GOOGLE_SHEETS_ID", "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94")
CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials.json")
TOKEN_PATH = "token.json"

SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"
CREDENTIALS_FULL_PATH = SCRIPT_DIR / CREDENTIALS_PATH
TOKEN_FULL_PATH = SCRIPT_DIR / TOKEN_PATH

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def get_google_sheets_service():
    """Obtener servicio autenticado"""
    creds = None

    if TOKEN_FULL_PATH.exists():
        from google.auth.transport.requests import Request

        creds = Credentials.from_authorized_user_file(TOKEN_FULL_PATH, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FULL_PATH.exists():
                raise FileNotFoundError(f"credentials.json no encontrado en {CREDENTIALS_FULL_PATH}")
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FULL_PATH, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FULL_PATH, "w") as token:
            token.write(creds.to_json())

    return build("sheets", "v4", credentials=creds)


def read_csv_products():
    """Leer productos desde CSV"""
    if not CSV_PATH.exists():
        print(f"❌ No encontrado: {CSV_PATH}")
        return None

    products = []
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(row)

    return products


def upload_to_sheets(service, products):
    """Cargar productos a Google Sheets"""
    if not products:
        print("❌ No hay productos para cargar")
        return False

    # Preparar datos
    headers = list(products[0].keys())
    values = [headers]

    for product in products:
        row = [product.get(header, "") for header in headers]
        values.append(row)

    # Limpiar y cargar
    try:
        # Limpiar la hoja primero
        print("🧹 Limpiando Google Sheets...")
        service.spreadsheets().values().clear(
            spreadsheetId=GOOGLE_SHEETS_ID,
            range="Productos!A1:Z1000",
        ).execute()

        # Cargar datos
        print(f"📤 Cargando {len(products)} productos...")
        service.spreadsheets().values().update(
            spreadsheetId=GOOGLE_SHEETS_ID,
            range="Productos!A1",
            valueInputOption="RAW",
            body={"values": values},
        ).execute()

        print(f"✅ {len(products)} productos cargados a Google Sheets")
        print(f"📊 URL: https://docs.google.com/spreadsheets/d/{GOOGLE_SHEETS_ID}/edit")
        return True

    except Exception as e:
        print(f"❌ Error cargando: {e}")
        return False


if __name__ == "__main__":
    if not HAS_GOOGLE:
        sys.exit(1)

    print("\n" + "=" * 50)
    print("📤 CARGAR PRODUCTOS A GOOGLE SHEETS")
    print("=" * 50 + "\n")

    try:
        # Leer CSV
        print("📖 Leyendo productos.csv...")
        products = read_csv_products()

        if not products:
            sys.exit(1)

        print(f"✅ {len(products)} productos leídos\n")

        # Conectar
        print("🔐 Autenticando...")
        service = get_google_sheets_service()
        print("✅ Conectado\n")

        # Cargar
        success = upload_to_sheets(service, products)

        if success:
            print("\n" + "=" * 50)
            print("✅ CARGA COMPLETADA")
            print("=" * 50)
        else:
            sys.exit(1)

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
