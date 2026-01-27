#!/usr/bin/env bash
# Script de setup automático (para Linux/Mac)
# En Windows PowerShell, seguir pasos en QUICK_START.md

set -e

echo "🍫 Chocolatizados - Setup Automático"
echo "===================================="
echo ""

# 1. Crear ambiente Python virtual
echo "1️⃣  Creando ambiente Python virtual..."
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Setup Frontend
echo ""
echo "2️⃣  Setup Frontend (Next.js)..."
cd src/frontend
npm install
cd ../..

# 3. Crear ejemplo de productos
echo ""
echo "3️⃣  Preparando ejemplo de catálogo..."
cp .tmp/productos_ejemplo.csv .tmp/productos.csv

# 4. Sincronizar catálogo
echo ""
echo "4️⃣  Sincronizando catálogo..."
python execution/sync_sheets_to_frontend.py

# 5. Instrucciones finales
echo ""
echo "✅ Setup completado!"
echo ""
echo "Para iniciar:"
echo ""
echo "Terminal 1 - Frontend:"
echo "  cd src/frontend && npm run dev"
echo ""
echo "Terminal 2 - Backend:"
echo "  cd src/backend && uvicorn main:app --reload --port 8000"
echo ""
echo "Luego abre: http://localhost:3000"
echo ""
echo "📚 Más info: lee QUICK_START.md"
