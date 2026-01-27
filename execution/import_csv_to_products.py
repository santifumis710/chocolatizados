"""
import_csv_to_products.py

Script simple para convertir CSV local a products.json
Sin dependencias de Google Cloud, completamente gratis

Uso:
    python execution/import_csv_to_products.py

El CSV debe estar en: .tmp/productos.csv

Estructura esperada del CSV:
    id, name, price, category, weight_g, dimensions, description, image_url, allows_customization
"""

import csv
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"
JSON_OUTPUT = SCRIPT_DIR / "src" / "frontend" / "public" / "products.json"
JSON_BACKUP = SCRIPT_DIR / ".tmp" / "products.json"


def read_csv(csv_file: Path) -> list:
    """Leer CSV y retornar lista de productos"""
    if not csv_file.exists():
        print(f"❌ Error: No se encuentra {csv_file}")
        print(f"   Coloca el CSV en: {csv_file}")
        return []

    encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'utf-8-sig']

    for encoding in encodings_to_try:
        products = []
        try:
            print(f"   Intentando leer con encoding: {encoding}")
            with open(csv_file, "r", encoding=encoding) as f:
                reader = csv.DictReader(f)
                if not reader.fieldnames:
                    # Si falla, podría ser por encoding o archivo vacío.
                    # Pero si lee vacío, no lanza error de decoding necesariamente.
                    # Continuamos si es vacío.
                    if encoding == encodings_to_try[-1]:
                         print("❌ Error: CSV vacío o sin encabezados")
                         return []
                    continue

                for row_num, row in enumerate(reader, start=2):
                    # Validar campos requeridos
                    if not row.get("id") or not row.get("name"):
                         # Esto podría ser una fila vacía
                        continue

                    # Procesar precio
                    try:
                        price = float(row.get("price", 0))
                    except ValueError:
                        print(f"⚠️  Fila {row_num}: Precio inválido '{row.get('price')}', usando 0")
                        price = 0

                    # Procesar allows_customization
                    customization = str(row.get("allows_customization", "FALSE")).upper()
                    allows_customization = customization in ["TRUE", "1", "YES"]

                    # Procesar min_quantity
                    try:
                        min_quantity = int(row.get("min_quantity", 1))
                    except ValueError:
                        min_quantity = 1

                    product = {
                        "id": int(row["id"]),
                        "name": row.get("name", "").strip(),
                        "price": price,
                        "category": row.get("category", "").strip(),
                        "weight_g": row.get("weight_g", "").strip(),
                        "dimensions": row.get("dimensions", "").strip(),
                        "description": row.get("description", "").strip(),
                        "image_url": row.get("image_url", "").strip() or None,
                        "options": row.get("options", "").strip() or None,
                        "allows_customization": allows_customization,
                        "min_quantity": min_quantity
                    }

                    products.append(product)
            
            # Si llegamos aquí sin excepción, terminamos y retornamos
            return sorted(products, key=lambda x: x["id"])

        except UnicodeDecodeError:
            print(f"⚠️  Fallo encoding {encoding}, reintentando...")
            continue
        except Exception as e:
            # Otros errores (ej. formato CSV mal)
            print(f"❌ Error leyendo CSV ({encoding}): {e}")
            # Si no es error de encoding, quizás no deberíamos reintentar, pero...
            # vamos a seguir probando otros encodings por si acaso.
            if encoding == encodings_to_try[-1]:
                return []
            continue
            
    return []


def save_json(products: list, output_file: Path, backup_file: Path) -> bool:
    """Guardar productos en JSON"""
    if not products:
        print("❌ No hay productos para guardar")
        return False

    try:
        # Guardar en output principal
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)

        # Guardar backup
        backup_file.parent.mkdir(parents=True, exist_ok=True)
        with open(backup_file, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)

        print(f"✅ Guardado: {output_file}")
        print(f"✅ Backup: {backup_file}")
        return True

    except Exception as e:
        print(f"❌ Error guardando JSON: {e}")
        return False


def main():
    print("\n" + "=" * 60)
    print("📥 IMPORTAR CSV → products.json")
    print("=" * 60 + "\n")

    # Leer CSV
    print(f"📖 Leyendo: {CSV_PATH}")
    products = read_csv(CSV_PATH)

    if not products:
        print("\n❌ No se pudieron procesar productos")
        return False

    print(f"✅ {len(products)} productos leídos\n")

    # Mostrar resumen
    print("📋 Productos importados:")
    for product in products:
        status = "✨ (personalizable)" if product["allows_customization"] else ""
        print(f"   {product['id']:2d}. {product['name']:30s} ${product['price']:6.2f} {status}")

    print()

    # Guardar JSON
    if save_json(products, JSON_OUTPUT, JSON_BACKUP):
        print("\n" + "=" * 60)
        print("✅ IMPORTACIÓN COMPLETADA")
        print("=" * 60)
        print(f"\n✨ {len(products)} productos listos en products.json")
        print("🌐 Frontend se actualiza automáticamente (hot reload)")
        return True
    else:
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
