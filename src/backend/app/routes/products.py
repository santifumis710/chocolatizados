import json
import os
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import Product

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)

# Path to the products.json file in src/backend/data
# Assuming we are running from src/backend/app/routes
# We want: src/backend/data/products.json
PRODUCTS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "products.json")

def read_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return data
        except json.JSONDecodeError:
            return []

def save_products(products_data):
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump(products_data, f, indent=2, ensure_ascii=False)

@router.get("/", response_model=List[Product])
async def get_products():
    """Get all products"""
    return read_products()

@router.post("/", response_model=Product)
async def create_product(product: Product):
    """Create a new product"""
    products = read_products()
    
    # Check if ID exists
    if any(p["id"] == product.id for p in products):
        raise HTTPException(status_code=400, detail="Product with this ID already exists")
    
    products.append(product.dict())
    save_products(products)
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: int, product_update: Product):
    """Update a product"""
    products = read_products()
    
    for i, p in enumerate(products):
        if p["id"] == product_id:
            # Update fields
            products[i] = product_update.dict()
            save_products(products)
            return product_update
            
    raise HTTPException(status_code=404, detail="Product not found")

@router.delete("/{product_id}")
async def delete_product(product_id: int):
    """Delete a product"""
    products = read_products()
    
    initial_len = len(products)
    products = [p for p in products if p["id"] != product_id]
    
    if len(products) == initial_len:
         raise HTTPException(status_code=404, detail="Product not found")
         
    save_products(products)
    return {"message": "Product deleted successfully"}
