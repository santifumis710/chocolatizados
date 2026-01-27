import json
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

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
    items: List[dict] # Simplified for flexibility, or use strict CartItem
    total: float

class Order(OrderCreate):
    id: str
    date: str
    status: str # 'pending', 'completed', 'cancelled'

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"]
)

# Path to orders.json in src/backend/data/orders.json
# Assuming we are running from src/backend
ORDERS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "orders.json")

def read_orders():
    if not os.path.exists(ORDERS_FILE):
        return []
    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return data
        except json.JSONDecodeError:
            return []

def save_orders(orders_data):
    # Ensure directory exists
    os.makedirs(os.path.dirname(ORDERS_FILE), exist_ok=True)
    with open(ORDERS_FILE, "w", encoding="utf-8") as f:
        json.dump(orders_data, f, indent=2, ensure_ascii=False)

@router.get("/", response_model=List[Order])
async def get_orders():
    """Get all orders"""
    return read_orders()

@router.post("/", response_model=Order)
async def create_order(order_in: OrderCreate):
    """Create a new order"""
    orders = read_orders()
    
    new_order = {
        "id": str(uuid.uuid4()),
        "date": datetime.now().isoformat(),
        "status": "pending",
        **order_in.dict()
    }
    
    orders.append(new_order)
    save_orders(orders)
    return new_order

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str = Body(..., embed=True)):
    """Update order status"""
    orders = read_orders()
    
    for i, o in enumerate(orders):
        if o["id"] == order_id:
            orders[i]["status"] = status
            save_orders(orders)
            return orders[i]
            
    raise HTTPException(status_code=404, detail="Order not found")

@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """Delete an order"""
    orders = read_orders()
    
    initial_len = len(orders)
    orders = [o for o in orders if o["id"] != order_id]
    
    if len(orders) == initial_len:
         raise HTTPException(status_code=404, detail="Order not found")
         
    save_orders(orders)
    return {"message": "Order deleted successfully"}
