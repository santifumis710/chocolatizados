import os
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON, Text, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get DB URL from environment (check multiple common names)
DATABASE_URL = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL") or os.getenv("POSTGRES_PRISMA_URL")

# Ensure URL starts with postgresql:// for SQLAlchemy
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create SQLAlchemy engine
# pool_pre_ping=True helps with connection drops
engine = create_engine(DATABASE_URL, pool_pre_ping=True) if DATABASE_URL else None

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    date = Column(DateTime)
    status = Column(String, default="pending")
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String, nullable=True)
    delivery_address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    items = Column(JSON) # Store items as JSON
    total = Column(Float)

class ProductModel(Base):
    __tablename__ = "products"

    # Original JSON used integer IDs, we can keep them as integers or strings.
    # Let's use Integer to match schemas.py
    id = Column(Integer, primary_key=True, index=True) 
    
    name = Column(String, index=True)
    price = Column(Float)
    category = Column(String)
    weight_g = Column(String, nullable=True) # JSON has mixed types sometimes
    dimensions = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    allows_customization = Column(Boolean, default=False)
    is_visible = Column(Boolean, default=True)
    min_quantity = Column(Integer, default=1)
    options = Column(String, nullable=True) # Stored as string "Option1|100, Option2|200"
    image_position = Column(String, nullable=True)

def init_db():
    if engine:
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized")
    else:
        print("⚠️ No DATABASE_URL found. Database not initialized.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
