#!/usr/bin/env python3
"""
Script de setup automático para Chocolatizados
Ejecuta: python setup_auto.py
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(cmd, description="", shell=False):
    """Ejecutar comando y mostrar resultado"""
    if description:
        print(f"\n{'='*60}")
        print(f"⚙️  {description}")
        print(f"{'='*60}")

    try:
        if isinstance(cmd, str):
            result = subprocess.run(cmd, shell=True, check=False)
        else:
            result = subprocess.run(cmd, check=False)

        if result.returncode == 0:
            print(f"✅ {description or cmd}")
            return True
        else:
            print(f"⚠️  {description or cmd} (código: {result.returncode})")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("\n" + "=" * 60)
    print("🍫 CHOCOLATIZADOS - SETUP AUTOMÁTICO")
    print("=" * 60)

    root_dir = Path(__file__).parent

    # 1. Verificar Python
    print(f"\n✅ Python: {sys.version.split()[0]}")

    # 2. Crear .env.local si no existe
    env_file = root_dir / ".env.local"
    if not env_file.exists():
        print("\n📝 Creando .env.local...")
        env_content = """WHATSAPP_BUSINESS_PHONE=5493425334765
NEXT_PUBLIC_API_URL=http://localhost:8000
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true
"""
        env_file.write_text(env_content)
        print("✅ .env.local creado")

    # 3. Verificar Node.js
    print("\n📋 Verificando dependencias...")
    node_ok = run_command("node --version", "Node.js", shell=True)
    npm_ok = run_command("npm --version", "npm", shell=True)

    if not node_ok or not npm_ok:
        print("\n⚠️  Node.js no instalado. Ve a https://nodejs.org/")
        print("   Instalalo e intenta de nuevo.")
        return False

    # 4. Verificar catálogo
    csv_file = root_dir / ".tmp" / "productos.csv"
    if not csv_file.exists():
        print(f"\n❌ Archivo no encontrado: {csv_file}")
        return False
    print(f"✅ Catálogo encontrado: {csv_file}")

    # 5. Setup Frontend
    frontend_dir = root_dir / "src" / "frontend"
    print(f"\n📦 Setup Frontend ({frontend_dir})...")

    if (frontend_dir / "node_modules").exists():
        print("✅ node_modules ya existe, saltando npm install")
    else:
        print("📥 Instalando dependencias npm...")
        if not run_command(f"cd {frontend_dir} && npm install"):
            print("⚠️  Considera ejecutar: cd src/frontend && npm install")

    # 6. Verificar products.json
    products_file = frontend_dir / "public" / "products.json"
    if not products_file.exists():
        print("\n⚠️  products.json no encontrado")
        print("    Ejecutando sync...")
        run_command(
            f"python execution/sync_sheets_to_frontend.py",
            "Sincronizando catálogo...",
        )
    else:
        print(f"✅ Catálogo sincronizado: {products_file.relative_to(root_dir)}")

    # 7. Instrucciones finales
    print("\n" + "=" * 60)
    print("✅ SETUP COMPLETADO!")
    print("=" * 60)

    print("\n📚 Próximos pasos:\n")
    print("1️⃣  FRONTEND (Terminal 1):")
    print(
        "   cd src/frontend"
    )
    print("   npm run dev")
    print("   → Abre: http://localhost:3000\n")

    print("2️⃣  BACKEND (Terminal 2):")
    print("   pip install -r src/backend/requirements.txt")
    print("   cd src/backend")
    print("   uvicorn main:app --reload --port 8000")
    print("   → Abre: http://localhost:8000/docs\n")

    print("3️⃣  PRUEBA EL FLUJO:")
    print("   • Agrega productos al carrito")
    print("   • Va a checkout")
    print("   • Envía a WhatsApp ✅\n")

    print("=" * 60)
    print("📖 Documentación: lee QUICK_START.md")
    print("=" * 60 + "\n")

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
