import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Body, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db import get_db, OrderModel

class CartItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    allows_customization: bool
    customization_text: Optional[str] = None
    min_quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    items: List[dict] 
    total: float

class Order(OrderCreate):
    id: str
    date: datetime
    status: str 

    class Config:
        from_attributes = True

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"]
)

@router.get("", response_model=List[Order])
@router.get("/", response_model=List[Order])
async def get_orders(db: Session = Depends(get_db)):
    """Get all orders"""
    return db.query(OrderModel).all()

@router.post("/", response_model=Order)
async def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    new_order = OrderModel(
        id=str(uuid.uuid4()),
        date=datetime.now(),
        status="pending",
        **order_in.dict()
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Update order status"""
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status
    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}")
async def delete_order(order_id: str, db: Session = Depends(get_db)):
    """Delete an order"""
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
          
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}
