import json
import os
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.schemas import Product
from app.db import get_db, ProductModel

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)

@router.get("/", response_model=List[Product])
async def get_products(db: Session = Depends(get_db)):
    """Get all products from DB"""
    products = db.query(ProductModel).order_by(ProductModel.id).all()
    return products

@router.post("/", response_model=Product)
async def create_product(product: Product, db: Session = Depends(get_db)):
    """Create a new product in DB"""
    # Check if ID exists
    existing = db.query(ProductModel).filter(ProductModel.id == product.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this ID already exists")
    
    new_product = ProductModel(
        id=product.id,
        name=product.name,
        price=product.price,
        category=product.category,
        weight_g=str(product.weight_g) if product.weight_g else None,
        dimensions=product.dimensions,
        description=product.description,
        image_url=product.image_url,
        allows_customization=product.allows_customization,
        is_visible=product.is_visible,
        # Default fallback for new fields if not in schema yet
        min_quantity=1 
    )
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: int, product_update: Product, db: Session = Depends(get_db)):
    """Update a product in DB"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
            
    # Update fields
    product.name = product_update.name
    product.price = product_update.price
    product.category = product_update.category
    product.weight_g = str(product_update.weight_g) if product_update.weight_g else None
    product.dimensions = product_update.dimensions
    product.description = product_update.description
    product.image_url = product_update.image_url
    product.allows_customization = product_update.allows_customization
    product.is_visible = product_update.is_visible
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product from DB"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
         
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
