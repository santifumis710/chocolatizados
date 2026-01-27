"""
sync_google_sheets.py

Script para descargar productos desde Google Sheets y guardar en CSV.
Luego ejecuta sync_sheets_to_frontend.py para generar JSON.

Uso:
    python execution/sync_google_sheets.py

Requiere:
    - credentials.json (OAuth 2.0)
    - Variables en .env: GOOGLE_SHEETS_ID, GOOGLE_SHEETS_RANGE
"""

import os
import csv
import sys
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv

# Intentar importar Google Sheets
try:
    from google.auth.transport.requests import Request
    from google.oauth2.service_account import Credentials
    from google.oauth2 import service_account
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    HAS_GOOGLE = True
except ImportError:
    HAS_GOOGLE = False
    print("⚠️  Google Sheets API no instalada. Instala: pip install google-auth-oauthlib google-api-python-client")

# Cargar variables de entorno
load_dotenv()

GOOGLE_SHEETS_ID = os.getenv("GOOGLE_SHEETS_ID", "1bSDk6XMsg1DD_QwqTbfMSBlmjrSgkvyKGmqG2l7CH94")
GOOGLE_SHEETS_RANGE = os.getenv("GOOGLE_SHEETS_RANGE", "Productos!A1:I100")
CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials.json")
TOKEN_PATH = "token.json"

# Rutas
SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"
CREDENTIALS_FULL_PATH = SCRIPT_DIR / CREDENTIALS_PATH
TOKEN_FULL_PATH = SCRIPT_DIR / TOKEN_PATH

# Scope para Google Sheets (solo lectura)
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]


def get_google_sheets_service():
    """
    Obtener servicio autenticado de Google Sheets.
    Usa OAuth 2.0 con credenciales.json
    """
    if not HAS_GOOGLE:
        raise ImportError("Google API client no disponible")

    creds = None

    # Cargar token guardado si existe
    if TOKEN_FULL_PATH.exists():
        from google.auth.transport.requests import Request
        creds = Credentials.from_authorized_user_file(TOKEN_FULL_PATH, SCOPES)

    # Si no hay token válido, crear nuevo
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FULL_PATH.exists():
                raise FileNotFoundError(
                    f"❌ {CREDENTIALS_FULL_PATH} no encontrado.\n"
                    f"Descarga credentials.json desde Google Cloud Console:\n"
                    f"https://console.cloud.google.com/apis/credentials"
                )
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FULL_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Guardar token para futuro uso
        with open(TOKEN_FULL_PATH, "w") as token:
            token.write(creds.to_json())

    return build("sheets", "v4", credentials=creds)


def download_products_from_sheets(service) -> List[Dict]:
    """
    Descargar productos desde Google Sheets
    """
    print(f"📥 Descargando desde: {GOOGLE_SHEETS_RANGE}")

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=GOOGLE_SHEETS_ID, range=GOOGLE_SHEETS_RANGE)
        .execute()
    )

    values = result.get("values", [])

    if not values:
        print("❌ No hay datos en Google Sheets")
        return []

    # Primera fila = encabezados
    headers = values[0]
    products = []

    for row_idx, row in enumerate(values[1:], start=2):
        # Rellenar celdas vacías
        while len(row) < len(headers):
            row.append("")

        product = {}
        for col_idx, header in enumerate(headers):
            value = row[col_idx] if col_idx < len(row) else ""
            product[header.strip()] = value.strip()

        products.append(product)

    print(f"✅ Descargados {len(products)} productos")
    return products


def validate_product(product: Dict, row_num: int) -> bool:
    """
    Validar que el producto tenga los campos requeridos
    """
    required_fields = [
        "id",
        "name",
        "price",
        "category",
        "weight_g",
        "dimensions",
        "allows_customization",
    ]

    missing = [f for f in required_fields if not product.get(f)]

    if missing:
        print(f"⚠️  Fila {row_num}: Faltan campos {missing}")
        return False

    # Validar price es número
    try:
        float(product["price"])
    except ValueError:
        print(
            f"⚠️  Fila {row_num}: 'price' debe ser número, encontrado: {product['price']}"
        )
        return False

    # Validar allow_customization es TRUE/FALSE
    if product["allows_customization"].upper() not in ["TRUE", "FALSE", "1", "0"]:
        print(
            f"⚠️  Fila {row_num}: 'allows_customization' debe ser TRUE/FALSE, encontrado: {product['allows_customization']}"
        )
        return False

    return True


def save_to_csv(products: List[Dict]):
    """
    Guardar productos en CSV
    """
    if not products:
        print("❌ No hay productos para guardar")
        return False

    # Crear directorio si no existe
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=products[0].keys())
            writer.writeheader()
            writer.writerows(products)

        print(f"✅ Guardado: {CSV_PATH}")
        return True
    except Exception as e:
        print(f"❌ Error guardando CSV: {e}")
        return False


def run_sheets_sync():
    """
    Sincronizar Google Sheets → CSV → JSON
    """
    print("\n" + "=" * 50)
    print("🔄 SINCRONIZACIÓN GOOGLE SHEETS")
    print("=" * 50 + "\n")

    try:
        # Conectar a Google Sheets
        print("🔐 Autenticando con Google Sheets...")
        service = get_google_sheets_service()
        print("✅ Autenticación exitosa\n")

        # Descargar productos
        products = download_products_from_sheets(service)

        if not products:
            print("❌ No hay productos para procesar")
            return False

        # Validar productos
        print(f"\n📋 Validando {len(products)} productos...")
        valid_products = []

        for idx, product in enumerate(products, start=2):
            if validate_product(product, idx):
                # Normalizar campo allow_customization
                customization = product["allows_customization"].upper()
                product["allows_customization"] = "TRUE" if customization in [
                    "TRUE",
                    "1",
                ] else "FALSE"

                valid_products.append(product)

        print(f"✅ {len(valid_products)}/{len(products)} productos válidos\n")

        if not valid_products:
            print("❌ No hay productos válidos para guardar")
            return False

        # Guardar a CSV
        if not save_to_csv(valid_products):
            return False

        # Ejecutar sync_sheets_to_frontend.py
        print("\n📊 Ejecutando sync_sheets_to_frontend.py...")
        import subprocess

        result = subprocess.run(
            [
                sys.executable,
                str(SCRIPT_DIR / "execution" / "sync_sheets_to_frontend.py"),
            ],
            cwd=str(SCRIPT_DIR),
            capture_output=True,
            text=True,
        )

        print(result.stdout)
        if result.stderr:
            print(result.stderr)

        if result.returncode == 0:
            print("\n" + "=" * 50)
            print("✅ SINCRONIZACIÓN COMPLETADA")
            print("=" * 50)
            return True
        else:
            print("\n⚠️  Error en sync_sheets_to_frontend.py")
            return False

    except FileNotFoundError as e:
        print(f"❌ Archivo no encontrado: {e}")
        print(f"   Coloca credentials.json en la raíz del proyecto")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    success = run_sheets_sync()
    sys.exit(0 if success else 1)
