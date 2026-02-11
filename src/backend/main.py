"""
FastAPI Application - Chocolatizados
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Chocolatizados API",
    description="API para vender chocolates personalizados",
    version="1.0.0",
)

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    from app.db import init_db
    from app.utils import seed_products
    
    init_db()
    result = seed_products()
    print(f"🌱 Startup Seed Result: {result}")

@app.get("/api/seed")
async def manual_seed():
    """Manually trigger product seeding for debugging"""
    from app.utils import seed_products
    return seed_products()

# CORS Configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://chocolatizados.vercel.app",
        "https://chocolatizados-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Chocolatizados API",
        "docs": "http://localhost:8000/docs",
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "Chocolatizados API",
    }


# Import routes
# Import routes
try:
    from app.routes import whatsapp
    app.include_router(whatsapp.router)
except Exception as e:
    print(f"⚠️ Whatsapp Routes disabled: {type(e).__name__}")

try:
    from app.routes import products
    app.include_router(products.router)
except Exception as e:
    print(f"⚠️ Products Routes disabled: {type(e).__name__}")

try:
    from app.routes import orders
    app.include_router(orders.router)
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"⚠️ Orders Routes disabled: {type(e).__name__}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("FASTAPI_HOST", "0.0.0.0"),
        port=int(os.getenv("FASTAPI_PORT", 8000)),
        reload=False,
    )
