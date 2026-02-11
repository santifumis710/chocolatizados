import os
import json
from app.db import SessionLocal, ProductModel

def seed_products():
    """
    Checks if the products table is empty.
    If empty, populates it from products.json.
    Returns a dict with status and debug info.
    """
    db = SessionLocal()
    logs = []
    try:
        logs.append(f"CWD: {os.getcwd()}")
        
        # Check if products already exist
        if db.query(ProductModel).first():
            logs.append("Database already has data, skipping seed.")
            return {"status": "skipped", "message": "Database already populated", "logs": logs}

        logs.append("🌱 Seeding database...")
        
        # Try multiple paths for robustness in Vercel
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        paths_to_try = [
            os.path.join(base_dir, "data", "products.json"),
            os.path.join(os.getcwd(), "src", "backend", "data", "products.json"),
            os.path.join(os.getcwd(), "data", "products.json"),
            "products.json" # If in root
        ]
        
        json_path = None
        for p in paths_to_try:
            logs.append(f"Checking: {p}")
            if os.path.exists(p):
                json_path = p
                logs.append(f"✅ Found at: {p}")
                break
        
        if not json_path:
            logs.append("❌ Products JSON not found in any location.")
            return {"status": "error", "message": "JSON file not found", "logs": logs}
            
        with open(json_path, "r", encoding="utf-8") as f:
            products_data = json.load(f)
            
        count = 0
        for p in products_data:
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
        logs.append(f"✅ Seeded {count} products.")
        return {"status": "success", "count": count, "logs": logs}
        
    except Exception as e:
        logs.append(f"❌ Error: {str(e)}")
        return {"status": "error", "message": str(e), "logs": logs}
    finally:
        db.close()
