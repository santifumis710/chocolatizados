
import csv
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
CSV_PATH = SCRIPT_DIR / ".tmp" / "productos.csv"

def detect_min_quantity(description):
    """Attempt to extract minimum quantity from description"""
    if not description:
        return 1
    
    # Patterns to look for: "Mínimo 15", "minimo 8", etc.
    # Case insensitive
    match = re.search(r'm[íi]nimo\s+(\d+)', description, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return 1

def migrate_csv():
    if not CSV_PATH.exists():
        print(f"❌ Error: {CSV_PATH} not found")
        return

    print(f"📖 Reading {CSV_PATH}...")
    
    products = []
    
    # Robust reading (copied from import script logic)
    encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'utf-8-sig']
    encoding_used = 'utf-8'
    
    read_success = False
    
    for encoding in encodings_to_try:
        try:
            with open(CSV_PATH, "r", encoding=encoding) as f:
                reader = csv.DictReader(f)
                if not reader.fieldnames:
                    continue
                
                # Check directly here if we can read rows
                for row in reader:
                    products.append(row)
                
                encoding_used = encoding
                read_success = True
                break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Error checking {encoding}: {e}")
            continue

    if not read_success:
        print("❌ Could not read CSV with any encoding")
        return

    print(f"✅ Read {len(products)} products (Encoding: {encoding_used})")

    # Update products
    updated_products = []
    
    # Get initial fieldnames, filtering out None (caused by trailing commas in CSV)
    initial_keys = [k for k in products[0].keys() if k is not None]
    fieldnames = list(initial_keys)
    
    if "min_quantity" not in fieldnames:
        print("✨ Adding 'min_quantity' column...")
        fieldnames.append("min_quantity")
    
    updates_count = 0
    
    for p in products:
        # Clean dictionary of None keys
        clean_p = {k: v for k, v in p.items() if k is not None}
        
        current_min = clean_p.get("min_quantity")
        
        # If column didn't exist or is empty, calculate it
        if not current_min:
            new_min = detect_min_quantity(clean_p.get("description", ""))
            clean_p["min_quantity"] = new_min
            if new_min > 1:
                updates_count += 1
                print(f"   🔹 ID {clean_p.get('id')}: Set Min Quantity = {new_min} (from desc: '{clean_p.get('description')}')")
        
        updated_products.append(clean_p)

    # Write back
    try:
        with open(CSV_PATH, "w", encoding="utf-8", newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_products)
        print(f"✅ Migration complete. Updated {updates_count} products with min requirements.")
    except Exception as e:
        print(f"❌ Error writing CSV: {e}")

if __name__ == "__main__":
    migrate_csv()
