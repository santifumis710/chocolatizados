
import csv
import os

file_path = '.tmp/productos.csv'

# New products to add
new_products = [
    {
        "name": "Bombones Rellenos (Caja x25)",
        "price": 28000,
        "category": "Bombones Rellenos",
        "weight_g": 0,
        "dimensions": "",
        "description": "Caja por 25 unidades",
        "image_url": "",
        "allows_customization": "TRUE"
    },
    {
        "name": "Bombones Rellenos (Caja x60)",
        "price": 66200,
        "category": "Bombones Rellenos",
        "weight_g": 0,
        "dimensions": "",
        "description": "Caja por 60 unidades",
        "image_url": "",
        "allows_customization": "TRUE"
    },
    {
        "name": "Bombones Rellenos (Bolsita Tul x2)",
        "price": 2700,
        "category": "Bombones Rellenos",
        "weight_g": 0,
        "dimensions": "",
        "description": "Bolsitas de tul con 2 unidades. Mínimo 15 pedidos.",
        "image_url": "",
        "allows_customization": "FALSE"
    },
    {
        "name": "Bombones Rellenos (Bolsita Tul x8)",
        "price": 9300,
        "category": "Bombones Rellenos",
        "weight_g": 0,
        "dimensions": "",
        "description": "Bolsitas de tul con 8 unidades. Mínimo 8 pedidos.",
        "image_url": "",
        "allows_customization": "FALSE"
    }
]

# Read existing file to find max ID using robust encoding check
max_id = 0
header = []
file_encoding = 'utf-8'

if os.path.exists(file_path):
    encodings = ['utf-8', 'latin-1', 'cp1252']
    for enc in encodings:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                reader = csv.reader(f)
                try:
                    header = next(reader) # Read header
                    for row in reader:
                        if row:
                            try:
                                current_id = int(row[0])
                                if current_id > max_id:
                                    max_id = current_id
                            except ValueError:
                                pass
                    file_encoding = enc
                    break
                except StopIteration:
                    # Empty file
                    break
        except UnicodeDecodeError:
            continue
else:
    header = ["id", "name", "price", "category", "weight_g", "dimensions", "description", "image_url", "allows_customization"]

print(f"Detected encoding: {file_encoding}, Max ID: {max_id}")

# Append new products
# We use the detected encoding to append
with open(file_path, 'a', newline='', encoding=file_encoding) as f:
    writer = csv.writer(f)
    if max_id == 0 and not os.path.exists(file_path):
         writer.writerow(header)

    for p in new_products:
        max_id += 1
        row = [
            max_id,
            p["name"],
            p["price"],
            p["category"],
            p["weight_g"],
            p["dimensions"],
            p["description"],
            p["image_url"],
            p["allows_customization"]
        ]
        writer.writerow(row)

print(f"Added {len(new_products)} products. Last ID: {max_id}")
