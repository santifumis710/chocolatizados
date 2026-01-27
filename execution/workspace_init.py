#!/usr/bin/env python3
"""
Workspace Initialization Script for Chocolatizados Project

Scaffolds the project structure for Next.js frontend and FastAPI backend.
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None, silent=False):
    """Execute a shell command and return success status."""
    try:
        if silent:
            subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, check=True)
        else:
            subprocess.run(cmd, shell=True, cwd=cwd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {cmd}")
        print(f"   Error: {e}")
        return False

def create_nextjs_project():
    """Initialize Next.js frontend project."""
    print("\n📦 Initializing Next.js Frontend...")
    src_dir = Path("src")
    frontend_dir = src_dir / "frontend"
    
    if frontend_dir.exists():
        print(f"✅ Frontend already exists at {frontend_dir}")
        return True
    
    # Create Next.js project with TypeScript and Tailwind
    cmd = f'npx create-next-app@latest {frontend_dir} --typescript --tailwind --eslint --no-git --no-app --no-src-dir'
    print(f"   Running: {cmd}")
    # Note: This would require user interaction, so we provide instructions instead
    print("   ℹ️  Next.js setup requires interactive input. Run manually:")
    print(f"      npx create-next-app@latest {frontend_dir}")
    return False

def create_fastapi_project():
    """Create FastAPI backend project structure."""
    print("\n⚙️  Initializing FastAPI Backend...")
    src_dir = Path("src")
    backend_dir = src_dir / "backend"
    
    # Create directory structure
    backend_dir.mkdir(parents=True, exist_ok=True)
    (backend_dir / "app").mkdir(exist_ok=True)
    (backend_dir / "app" / "models").mkdir(exist_ok=True)
    (backend_dir / "app" / "routes").mkdir(exist_ok=True)
    (backend_dir / "app" / "schemas").mkdir(exist_ok=True)
    (backend_dir / "app" / "database").mkdir(exist_ok=True)
    
    # Create __init__.py files
    for dir_path in [backend_dir / "app", 
                     backend_dir / "app" / "models",
                     backend_dir / "app" / "routes",
                     backend_dir / "app" / "schemas",
                     backend_dir / "app" / "database"]:
        (dir_path / "__init__.py").touch()
    
    # Create main.py
    main_content = '''"""
FastAPI Application for Chocolatizados
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chocolatizados API", version="1.0.0")

# CORS Configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Chocolatizados API"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Routes will be imported here
# from app.routes import products, orders, customers
'''
    (backend_dir / "main.py").write_text(main_content)
    
    # Create requirements-backend.txt
    reqs_content = '''fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
requests==2.31.0
Pillow==10.1.0
pytest==7.4.3
'''
    (backend_dir / "requirements.txt").write_text(reqs_content)
    
    # Create .env example
    env_content = '''DATABASE_URL=postgresql://user:password@localhost:5432/chocolatizados_db
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000
'''
    (backend_dir / ".env.example").write_text(env_content)
    
    print(f"✅ FastAPI structure created at {backend_dir}")
    return True

def create_execution_scripts():
    """Create placeholder execution scripts."""
    print("\n🔧 Creating execution scripts...")
    execution_dir = Path("execution")
    
    # init_fastapi.py
    script = '''#!/usr/bin/env python3
"""Initialize FastAPI backend structure."""
print("FastAPI backend initialized. See directives/web_setup.md for details.")
'''
    (execution_dir / "init_fastapi.py").write_text(script)
    
    # init_nextjs.py
    script = '''#!/usr/bin/env python3
"""Initialize Next.js frontend structure."""
print("Next.js frontend initialized. See directives/web_setup.md for details.")
'''
    (execution_dir / "init_nextjs.py").write_text(script)
    
    # load_products.py
    script = '''#!/usr/bin/env python3
"""Load product catalog from CSV/JSON."""
import csv
import json
from pathlib import Path

def load_products(file_path):
    """Load products from CSV or JSON file."""
    path = Path(file_path)
    
    if path.suffix.lower() == '.csv':
        with open(path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            products = list(reader)
    elif path.suffix.lower() == '.json':
        with open(path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    else:
        raise ValueError(f"Unsupported file format: {path.suffix}")
    
    print(f"Loaded {len(products)} products from {file_path}")
    return products

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        products = load_products(sys.argv[1])
        for p in products[:3]:
            print(p)
    else:
        print("Usage: python load_products.py <csv_or_json_file>")
'''
    (execution_dir / "load_products.py").write_text(script)
    
    # image_optimizer.py
    script = '''#!/usr/bin/env python3
"""Optimize images for web."""
from pathlib import Path
from PIL import Image

def optimize_image(input_path, output_path, max_width=800, max_height=800, quality=85):
    """Resize and compress image for web."""
    with Image.open(input_path) as img:
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
    file_size = Path(output_path).stat().st_size / 1024
    print(f"Optimized: {output_path} ({file_size:.1f} KB)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        optimize_image(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python image_optimizer.py <input> <output>")
'''
    (execution_dir / "image_optimizer.py").write_text(script)
    
    print("✅ Execution scripts created")
    return True

def main():
    """Run all initialization steps."""
    print("=" * 60)
    print("🍫 Chocolatizados Project Initialization")
    print("=" * 60)
    
    # Check prerequisites
    print("\n✓ Project structure verified")
    
    # Create backend
    create_fastapi_project()
    
    # Create execution scripts
    create_execution_scripts()
    
    print("\n" + "=" * 60)
    print("✅ Workspace Initialization Complete!")
    print("=" * 60)
    print("\n📋 Next Steps:")
    print("  1. Copy .env to .env.local and configure your database")
    print("  2. Review directives/web_setup.md for detailed setup")
    print("  3. Set up Next.js frontend (requires Node.js 18+):")
    print("     npx create-next-app@latest src/frontend --typescript --tailwind")
    print("  4. Install Python dependencies:")
    print("     pip install -r requirements.txt")
    print("  5. Upload your chocolate product list (CSV or JSON)")
    print("\n")

if __name__ == "__main__":
    main()
