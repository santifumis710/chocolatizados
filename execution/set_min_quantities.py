
import csv
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"

def set_min_quantities():
    if not CSV_PATH.exists():
        print("CSV not found")
        return

    # Read data
    products = []
    fieldnames = []
    
    # Try reading with different encodings
    for encoding in ['latin-1', 'utf-8', 'cp1252']:
        try:
            with open(CSV_PATH, 'r', encoding=encoding) as f:
                reader = csv.DictReader(f)
                fieldnames = reader.fieldnames
                products = list(reader)
            print(f"Successfully read with {encoding}")
            break
        except Exception:
            continue
            
    if not products:
        print("Failed to read products")
        return

    # Add min_quantity column if missing
    if 'min_quantity' not in fieldnames:
        fieldnames.append('min_quantity')

    updated_count = 0
    
    for p in products:
        # Defaults
        if 'min_quantity' not in p or not p['min_quantity']:
            p['min_quantity'] = 1
            
        desc = p.get('description', '').lower()
        name = p.get('name', '').lower()
        
        # Specific rules based on user request
        if "mínimo 15" in desc or "minimo 15" in desc:
            p['min_quantity'] = 15
            updated_count += 1
        elif "mínimo 8" in desc or "minimo 8" in desc:
            p['min_quantity'] = 8
            updated_count += 1
        # Fallback for old items that might need it
        elif "bolsitas de tul" in desc and "2 unidades" in desc and "rellenos" in name:
             p['min_quantity'] = 15 # Case logic override
             updated_count += 1

    # Write back
    with open(CSV_PATH, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)
        
    print(f"Updated {updated_count} products with min quantities.")

if __name__ == "__main__":
    set_min_quantities()
