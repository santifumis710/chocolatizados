import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.db import init_db, SessionLocal, OrderModel
from sqlalchemy import text

def test_connection():
    try:
        init_db()
        db = SessionLocal()
        # Test query
        result = db.execute(text("SELECT 1"))
        print("\n✅ Database Connection Successful!")
        print(f"   Result: {result.fetchone()}")
        
        # Check if table exists
        orders_count = db.query(OrderModel).count()
        print(f"✅ Orders Table Access Successful! (Current count: {orders_count})")
        
        db.close()
    except Exception as e:
        print(f"\n❌ Database Connection Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_connection()
