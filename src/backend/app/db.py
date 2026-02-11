import os
from sqlalchemy import create_engine, Column, String, Float, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get DB URL from environment
DATABASE_URL = os.getenv("POSTGRES_URL")

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
