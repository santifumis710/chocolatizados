#!/usr/bin/env python3
"""
Sincronizar CSV de Google Sheets a JSON para frontend.

Descarga manual: Google Sheets → File → Download → CSV
Luego ejecutar este script para procesar y exportar a frontend.
"""

import csv
import json
from pathlib import Path
from typing import List, Dict

def validate_product(row: Dict) -> bool:
    """Validar que el producto tenga campos requeridos."""
    required = ["Nombre", "Precio", "Categoría", "Permite Personalización"]
    return all(row.get(field, "").strip() for field in required)

def parse_boolean(value: str) -> bool:
    """Convertir 'Sí', 'Yes', 'true' a boolean."""
    return value.strip().lower() in ["sí", "yes", "true", "1", "si"]

def parse_price(value: str) -> float:
    """Convertir precio string a float."""
    try:
        # Remove currency symbols and whitespace
        price_str = value.strip().replace("$", "").replace(",", ".").strip()
        return float(price_str)
    except ValueError:
        raise ValueError(f"Invalid price format: {value}")

def load_csv(csv_path: Path) -> List[Dict]:
    """Cargar CSV y retornar lista de diccionarios."""
    products = []
    
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        if not reader.fieldnames:
            raise ValueError("CSV está vacío o mal formateado")
        
        for idx, row in enumerate(reader, start=2):
            # Validar
            if not validate_product(row):
                print(f"⚠️  Fila {idx}: Campos requeridos faltantes, saltando...")
                continue
            
            try:
                product = {
                    "id": idx - 1,  # ID único
                    "name": row["Nombre"].strip(),
                    "price": parse_price(row["Precio"]),
                    "category": row["Categoría"].strip(),
                    "weight_g": int(row.get("Peso (g)", "0")) if row.get("Peso (g)", "").strip() else 0,
                    "dimensions": row.get("Dimensiones", "").strip(),
                    "description": row.get("Descripción", "").strip(),
                    "image_url": row.get("Imagen URL", "").strip(),
                    "allows_customization": parse_boolean(row.get("Permite Personalización", "No")),
                }
                products.append(product)
                print(f"✅ {product['name']} - ${product['price']}")
            
            except Exception as e:
                print(f"❌ Fila {idx}: Error al procesar - {e}")
                continue
    
    return products

def export_json(products: List[Dict], output_path: Path) -> None:
    """Exportar productos a JSON."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Exportado: {output_path} ({len(products)} productos)")

def main():
    """Ejecutar sincronización CSV → JSON."""
    import sys
    
    # Rutas
    csv_path = Path(".tmp/productos.csv")
    output_path = Path("src/frontend/public/products.json")
    
    # Permitir argumento custom
    if len(sys.argv) > 1:
        csv_path = Path(sys.argv[1])
    
    print("=" * 60)
    print("📋 Sincronizando Catálogo: CSV → JSON")
    print("=" * 60)
    
    try:
        print(f"\n📂 Leyendo: {csv_path}")
        products = load_csv(csv_path)
        
        if not products:
            print("⚠️  No hay productos válidos en el CSV")
            return False
        
        print(f"\n📤 Exportando {len(products)} productos...")
        export_json(products, output_path)
        
        # También guardar en Backend (para Vercel)
        backend_path = Path("src/backend/data/products.json")
        export_json(products, backend_path)
        
        # También guardar en .tmp para referencia
        export_json(products, Path(".tmp/products.json"))
        
        print("\n" + "=" * 60)
        print("✅ Sincronización completada exitosamente!")
        print("=" * 60)
        print(f"\n📍 Ubicaciones:")
        print(f"   Frontend: {output_path}")
        print(f"   Backend:  {backend_path}")
        print(f"   Backup:   .tmp/products.json")
        print(f"\n💡 Próximo paso: Agregar imágenes a src/frontend/public/images/products/")
        
        return True
    
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nUso: python execution/sync_sheets_to_frontend.py [ruta_csv]")
        print("Por defecto busca en: .tmp/productos.csv")
        return False

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
