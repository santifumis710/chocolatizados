import os
import json
from app.db import SessionLocal, ProductModel

def seed_products():
    """
    Checks if the products table is empty.
    If empty, populates it from src/backend/data/products.json.
    """
    db = SessionLocal()
    try:
        # Check if products already exist
        if db.query(ProductModel).first():
            # Database already has data, no need to seed
            return

        print("🌱 Seeding database with initial products...")
        
        # Path to products.json (in src/backend/data)
        # We are in src/backend/app/utils.py
        # root is src/backend
        backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(backend_root, "data", "products.json")
        
        if not os.path.exists(json_path):
            print(f"⚠️ Products JSON not found at: {json_path}")
            return
            
        with open(json_path, "r", encoding="utf-8") as f:
            products_data = json.load(f)
            
        count = 0
        for p in products_data:
            # Double check existence (redundant but safe)
            if db.query(ProductModel).filter(ProductModel.id == p["id"]).first():
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
        print(f"✅ Automatically seeded {count} products to Database.")
        
    except Exception as e:
        print(f"❌ Automatic seeding failed: {e}")
        # Don't raise, just log error so app can still start
    finally:
        db.close()
