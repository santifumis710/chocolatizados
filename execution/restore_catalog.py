
import csv
import os
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"

# Lista maestra de productos reconstruida
products = [
    # --- BASICOS ---
    # (Box de Chocolates y Tableta Grande eliminados)


    # --- SIMPLES CHICOS ---
    {
        "id": 10,
        "name": "Simples Chicos (Caja x120)",
        "price": 55700,
        "category": "Simples Chicos",
        "description": "Caja por 120 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/10-simples-chicos-120.jpg"
    },
    {
        "id": 11,
        "name": "Simples Chicos (Caja x250)",
        "price": 114800,
        "category": "Simples Chicos",
        "description": "Caja por 250 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/11-simples-chicos-250.jpg"
    },
    {
        "id": 12,
        "name": "Simples Chicos (Bolsita Tul x2)",
        "price": 2800,
        "category": "Simples Chicos",
        "description": "Bolsita de tul con 2 unidades. Mínimo 10 pedidos.",
        "allows_customization": "FALSE",
        "min_quantity": 10,
        "image_url": "/images/products/12-simples-chicos-tul-2.jpg"
    },

    # --- SIMPLES GRANDES ---
    {
        "id": 13,
        "name": "Simples Grandes (Caja x26)",
        "price": 22000,
        "category": "Simples Grandes",
        "description": "Caja por 26 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/13-simples-grandes-26.jpg"
    },
    {
        "id": 14,
        "name": "Simples Grandes (Caja x64)",
        "price": 53200,
        "category": "Simples Grandes",
        "description": "Caja por 64 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/14-simples-grandes-64.jpg"
    },
    {
        "id": 15,
        "name": "Simples Grandes (Caja x140)",
        "price": 115000,
        "category": "Simples Grandes",
        "description": "Caja por 140 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/15-simples-grandes-140.jpg"
    },
    {
        "id": 16,
        "name": "Simples Grandes (Bolsita Tul x2)",
        "price": 2150,
        "category": "Simples Grandes",
        "description": "Bolsita de tul con 2 unidades. Mínimo 15 pedidos.",
        "allows_customization": "FALSE",
        "min_quantity": 15,
        "image_url": "/images/products/16-simples-grandes-tul-2.jpg"
    },
    {
        "id": 17,
        "name": "Simples Grandes (Bolsita Tul x8)",
        "price": 7000,
        "category": "Simples Grandes",
        "description": "Bolsita de tul con 8 unidades. Mínimo 8 pedidos.",
        "allows_customization": "FALSE",
        "min_quantity": 8,
        "image_url": "/images/products/17-simples-grandes-tul-8.jpg"
    },
    
    # --- TABLETAS CHICAS ---
    {
        "id": 19,
        "name": "Tabletas Chicas (Caja x9)",
        "price": 15500,
        "category": "Tabletas Chicas",
        "description": "Caja por 9 unidades",
        "allows_customization": "FALSE",
        "min_quantity": 1,
        "image_url": "/images/products/19-tabletas-chicas-9.jpg"
    },
    {
        "id": 20,
        "name": "Tabletas Chicas (Bolsita Tul x2)",
        "price": 3800,
        "category": "Tabletas Chicas",
        "description": "Bolsita de tul con 2 unidades",
        "allows_customization": "FALSE",
        "min_quantity": 1,
        "image_url": "/images/products/20-tabletas-chicas-tul-2.jpg"
    },

    # --- BOMBONES RELLENOS ---
    {
        "id": 21,
        "name": "Bombones Rellenos (Caja x25)",
        "price": 28000,
        "category": "Bombones Rellenos",
        "description": "Caja por 25 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/bombones-rellenos.jpg"
    },
    {
        "id": 22,
        "name": "Bombones Rellenos (Caja x60)",
        "price": 66200,
        "category": "Bombones Rellenos",
        "description": "Caja por 60 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/bombones-rellenos.jpg"
    },
    {
        "id": 23,
        "name": "Bombones Rellenos (Bolsita Tul x2)",
        "price": 2700,
        "category": "Bombones Rellenos",
        "description": "Bolsitas de tul con 2 unidades. Mínimo 15 pedidos.",
        "allows_customization": "FALSE",
        "min_quantity": 15,
        "image_url": "/images/products/bombones-rellenos.jpg"
    },
    {
        "id": 24,
        "name": "Bombones Rellenos (Bolsita Tul x8)",
        "price": 9300,
        "category": "Bombones Rellenos",
        "description": "Bolsitas de tul con 8 unidades. Mínimo 8 pedidos.",
        "allows_customization": "FALSE",
        "min_quantity": 8,
        "image_url": "/images/products/bombones-rellenos.jpg"
    },

    # --- BARRITAS RELLENAS ---
    {
        "id": 25,
        "name": "Barritas Rellenas (Caja x6)",
        "price": 17500,
        "category": "Barritas Rellenas",
        "description": "Caja por 6 unidades",
        "allows_customization": "TRUE",
        "min_quantity": 1,
        "image_url": "/images/products/25-barritas-rellenas-6.jpg"
    },

    # --- TABLETAS ---
    {
        "id": 26,
        "name": "Tableta Individual",
        "price": 5800,
        "category": "Tabletas",
        "description": "Tableta de chocolate individual",
        "allows_customization": "FALSE",
        "min_quantity": 1,
        "image_url": "/images/products/tableta-leche.jpg"
    }
]

def restore_catalog():
    print("🧹 Regenerating clean CSV catalog...")
    
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    fieldnames = ["id", "name", "price", "category", "weight_g", "dimensions", "description", "image_url", "allows_customization", "min_quantity"]
    
    with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for p in products:
            # Fill defaults for missing fields
            full_p = {
                "id": p["id"],
                "name": p["name"],
                "price": p["price"],
                "category": p["category"],
                "weight_g": p.get("weight_g", ""),
                "dimensions": p.get("dimensions", ""),
                "description": p.get("description", ""),
                "image_url": p.get("image_url", ""),
                "allows_customization": p["allows_customization"],
                "min_quantity": p.get("min_quantity", 1)
            }
            writer.writerow(full_p)
            
    print(f"✅ Created catalog with {len(products)} clean products")

if __name__ == "__main__":
    restore_catalog()
