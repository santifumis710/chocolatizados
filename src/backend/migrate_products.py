import os
import sys
import json

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.db import init_db, SessionLocal, ProductModel

def migrate_products():
    print("🚀 Starting Product Migration...")
    
    # 1. Initialize Table
    try:
        init_db()
    except Exception as e:
        print(f"❌ Failed to init DB: {e}")
        return

    # 2. Read JSON
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "products.json")
    if not os.path.exists(json_path):
        print(f"❌ JSON not found at: {json_path}")
        return
        
    with open(json_path, "r", encoding="utf-8") as f:
        products_data = json.load(f)
        
    print(f"📋 Found {len(products_data)} products in JSON.")
    
    # 3. Insert into DB
    db = SessionLocal()
    try:
        count = 0
        for p in products_data:
            # Check if exists
            existing = db.query(ProductModel).filter(ProductModel.id == p["id"]).first()
            if existing:
                print(f"   ⚠️  Skipping ID {p['id']} (already exists)")
                continue
                
            new_product = ProductModel(
                id=p["id"],
                name=p["name"],
                price=p["price"],
                category=p["category"],
                weight_g=str(p.get("weight_g", "")),
                dimensions=p.get("dimensions"),
                description=p.get("description"),
                image_url=p.get("image_url"),
                allows_customization=p.get("allows_customization", False),
                is_visible=p.get("is_visible", True),
                min_quantity=p.get("min_quantity", 1),
                options=p.get("options"),
                image_position=p.get("image_position")
            )
            db.add(new_product)
            count += 1
            
        db.commit()
        print(f"✅ Successfully migrated {count} new products to Database!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_products()
