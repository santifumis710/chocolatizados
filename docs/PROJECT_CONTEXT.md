# Chocolatizados — Project Context for AI Assistants

> **Purpose:** This document gives a complete project snapshot so you can skip reading individual files. Created: 2026-05-08. Verify with `git log` or file reads if something seems stale.

---

## What This Is

An e-commerce web app for **Chocolatizados**, an Argentine artisanal chocolate brand run by Mariela (18+ years in business). Customers browse chocolate products, add to cart, fill a checkout form, and get **redirected to WhatsApp** with their order pre-filled in a message. No payment processing — it's a catalog + lead-generation tool that funnels into WhatsApp conversations.

WhatsApp number: `5493426158358` (Mariela's business line)
Instagram: https://www.instagram.com/chocolatizados/
Live URL: https://chocolatizados.vercel.app

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, React 18 |
| Styling | Custom `theme.ts` tokens + inline styles. Tailwind is installed but **barely used** |
| Fonts | Google Fonts: Source Sans 3, Playfair Display |
| Backend | FastAPI (Python 3.12), SQLAlchemy ORM |
| Database | PostgreSQL (Vercel Postgres) |
| Deployment | Vercel (frontend + backend serverless) |
| Cart persistence | Browser `localStorage` |

---

## Directory Structure (Active Files Only)

```
/ (project root = Next.js root)
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Main storefront (1 big file, ~600 lines)
│   ├── globals.css             # Minimal global CSS
│   └── admin/
│       ├── layout.tsx          # Admin layout wrapper
│       ├── login/page.tsx      # Admin login (password-based)
│       ├── page.tsx            # Admin dashboard (products/orders/stats tabs)
│       ├── ProductModal.tsx    # Create/edit product modal
│       ├── OrdersTable.tsx     # Orders list with status filters
│       └── StatsView.tsx       # Basic stats view
├── components/
│   ├── ProductCard.tsx         # Grid card (image + name + price)
│   ├── ProductDetail.tsx       # Right-side panel (flavor/filling/qty/notes)
│   ├── CartSidebar.tsx         # Right-side cart panel
│   ├── CartWidget.tsx          # Cart icon + badge in header
│   ├── CategoryShowcase.tsx    # Horizontal category cards with flavor swatches
│   └── index.ts                # Re-exports
├── hooks/
│   ├── useCart.ts              # Cart logic (localStorage-backed)
│   └── index.ts
├── services/
│   └── api.ts                  # All API calls (fetchProducts, createOrder, etc.)
├── utils/
│   └── whatsapp.ts             # WhatsApp URL helpers (UNUSED — see Issues)
├── data/
│   └── productTypes.ts         # Hardcoded category definitions for CategoryShowcase
├── theme.ts                    # Design tokens: colors, spacing, typography, shadows
├── tailwind.config.js          # Installed but mostly unused
├── postcss.config.js
├── tsconfig.json
├── package.json
├── vercel.json                 # { rewrites: [{ /api/(.*) → /api/index.py }] }
├── api/
│   ├── index.py                # Vercel serverless entry: imports src/backend/main.py
│   └── requirements.txt        # Duplicate of src/backend/requirements.txt
├── src/backend/
│   ├── main.py                 # FastAPI app creation, CORS, route registration
│   ├── requirements.txt        # fastapi, uvicorn, sqlalchemy, psycopg2-binary, etc.
│   ├── data/products.json      # Seed data (~25 products)
│   ├── migrate_products.py     # One-off migration script (no longer needed)
│   ├── test_db.py              # Dev DB test script (no longer needed)
│   └── app/
│       ├── db.py               # SQLAlchemy engine, ProductModel, OrderModel
│       ├── utils.py            # seed_products() — fills DB from products.json if empty
│       ├── models/schemas.py   # Pydantic schemas: Product, CartItem, CheckoutRequest, etc.
│       └── routes/
│           ├── products.py     # CRUD: GET/POST/PUT/DELETE /api/products
│           ├── orders.py       # CRUD: GET/POST/PUT/DELETE /api/orders
│           └── whatsapp.py     # POST /api/whatsapp/generate-link (UNUSED by frontend)
└── public/
    ├── logo.jpg
    ├── favicon.png
    ├── products.json           # STALE leftover from old static approach (ignored)
    └── images/
        ├── hero_madre_16_9.jpg
        ├── marie.jpg           # Photo of Mariela
        ├── hero-pattern-v2.png # Decorative hero background
        └── products/           # ~80 product images (real photos + AI-generated pastels)
```

---

## Data Flow (User Purchase)

```
1. Page load → GET /api/products/ → products rendered in grid
2. User clicks product → ProductDetail panel opens (right slide-in)
3. User picks: quantity + flavors (mandatory) + fillings if "Bombones Rellenos" + notes
4. "Agregar al carrito" → cart saved to localStorage → toast notification
5. Cart icon → CartSidebar → "Continuar por WhatsApp" → CheckoutModal
6. CheckoutModal Step 1: name + phone + email (validated)
7. CheckoutModal Step 2: confirmation message → "Enviar a WhatsApp"
8. app/page.tsx handleCheckoutComplete():
   a. POST /api/orders  (saves to DB)
   b. Builds WhatsApp URL with items list
   c. window.location.href = whatsapp URL  (redirects current tab)
   d. clearCart()
```

---

## Backend API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List all visible products |
| POST | `/api/products/` | Create product (admin) |
| PUT | `/api/products/{id}` | Update product (admin) |
| DELETE | `/api/products/{id}` | Delete product (admin) |
| GET | `/api/orders` | List all orders (admin) |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/{id}/status` | Update order status (admin) |
| DELETE | `/api/orders/{id}` | Delete order (admin) |
| POST | `/api/whatsapp/generate-link` | Generate WhatsApp URL (**UNUSED by frontend**) |
| GET | `/api/debug_env` | Debug info (**should be removed in prod**) |
| GET | `/seed` | Manual DB seed trigger (**should be removed in prod**) |

---

## Database Models

### `ProductModel` (table: `products`)
```
id              Integer PK
name            String
price           Float
category        String       ("Simples Chicos", "Simples Grandes", "Bombones Rellenos",
                              "Tabletas Chicas", "Tabletas", "Barritas Rellenas")
weight_g        String nullable
dimensions      String nullable
description     Text nullable
image_url       String nullable   (relative path like /images/products/xxx.png)
allows_customization Boolean default False
is_visible      Boolean default True
min_quantity    Integer default 1
options         String nullable   (format: "Label|price, Label2|price2")
image_position  String nullable   (CSS object-position, e.g. "center 70%")
```

### `OrderModel` (table: `orders`)
```
id              String PK (UUID)
date            DateTime
status          String ("pending", "confirmed", "delivered", etc.)
customer_name   String
customer_phone  String
customer_email  String nullable
delivery_address Text nullable
notes           Text nullable
items           JSON (array of cart items)
total           Float
```

---

## Environment Variables

| Var | Where | Purpose |
|---|---|---|
| `POSTGRES_URL` / `DATABASE_URL` / `POSTGRES_PRISMA_URL` | Backend | PostgreSQL connection string |
| `WHATSAPP_BUSINESS_PHONE` | Backend | Default `5493426158358` |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend base URL (empty = relative, works on Vercel) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Frontend | Admin panel password (default `admin123`) |

---

## Design Tokens (`theme.ts`)

```ts
colors.primary   = "#A83A2B"   // Brand Red (chocolate)
colors.secondary = "#CDAA7D"   // Brand Gold/Tan
colors.background= "#F5E6D3"   // Brand Cream
colors.text      = "#333333"
colors.white     = "#FFFFFF"
colors.error     = "#D32F2F"
colors.border    = "#DDD9CF"
```

---

## Product Catalog (from `src/backend/data/products.json`)

~25 products across 6 categories. Key fields per product:
- Bulk boxes (x26, x64, x120, x140, x250 units) — allows_customization: true
- Individual bolsitas tul (x2, x5, x8) — min_quantity: 10
- Barritas Rellenas (x6)
- Tableta Individual
- All prices in ARS pesos (e.g. 55700, 114800)

---

## Known Issues & Problems

### 🔴 Critical

1. **Admin auth is insecure**: Password stored in `localStorage`, compared against `NEXT_PUBLIC_ADMIN_PASSWORD` (frontend env var visible in bundle). Anyone with devtools can find it. Should be replaced with server-side session auth.

2. **Debug endpoints in production**: `GET /api/debug_env` and `GET /seed` are exposed. These should be removed or protected.

### 🟡 Architecture / Design Debt

3. **`/api/whatsapp/generate-link` is dead code**: The frontend builds the WhatsApp URL directly in `app/page.tsx:handleCheckoutComplete()` and never calls this backend endpoint. Either use the backend endpoint or delete it.

4. **Duplicate WhatsApp message logic**: WhatsApp message formatting exists in both `src/backend/app/routes/whatsapp.py` (unused) and `app/page.tsx` (used). They're not identical — the backend version is more structured.

5. **`utils/whatsapp.ts` is likely dead**: Utility functions for WhatsApp URL generation at the root level, but the actual message building happens inline in `page.tsx`.

6. **`data/productTypes.ts` duplicates DB data**: Product categories, weights, and image paths are hardcoded in this file for the `CategoryShowcase` component. If product categories change in the DB, this file won't update automatically.

7. **`app/page.tsx` is too large**: ~600 lines. The header, hero section, category filter, product grid, and all modal state live in one component. Should be split.

8. **Inline styles everywhere**: Despite Tailwind being installed, all styling is done via inline `style={{}}` objects. This makes the code verbose and hard to maintain.

9. **`public/products.json`**: Stale leftover from before the DB was implemented. No code reads it in production.

### 🟢 Junk Files to Delete

```
/token.json                    # Google OAuth token — abandoned Google Sheets integration
/.tmp/                         # All temp scripts and CSVs (already gitignored)
/_docs/                        # Old agent prompts (AGENTS.md, GEMINI.md) for other AIs
/directives/                   # AI prompt files for image generation workflows
/execution/                    # One-off dev scripts (import CSV, sync sheets, etc.)
/api/debug_simple.py           # Debug script
/api/requirements.txt          # Duplicate of src/backend/requirements.txt
/src/backend/test_db.py        # Dev script
/src/backend/migrate_products.py # One-off migration (already run)
/ACTIVAR_GOOGLE_SHEETS.md      # Abandoned Google Sheets docs
/DESCARGAR_CREDENTIALS.md      # Abandoned Google Sheets docs
/GOOGLE_SHEETS_INTEGRATION.md  # Abandoned Google Sheets docs
/SETUP_GOOGLE_SHEETS.md        # Abandoned Google Sheets docs
/INDICE.md                     # Old project index for AI agents
/LISTO.md                      # Old status doc
/RAPIDO.md                     # Old quick-ref doc
/VERIFICACION.md               # Old verification doc
/START_HERE.md                 # Old setup guide
/Procfile                      # Railway deployment (now on Vercel)
/foto dia de la madre.jpeg     # Raw photo in root
/logo chocolatizados.jpg       # Raw photo in root
/catalogo/                     # Raw catalog photos (gitignored)
/public/products.json          # Stale static fallback
```

---

## Improvement Opportunities (for Opus to evaluate)

1. **Split `app/page.tsx`** into `Header`, `Hero`, `Storefront` components
2. **Replace inline styles with Tailwind** — Tailwind is already installed
3. **Use the backend WhatsApp endpoint** (or delete it if keeping frontend-only)
4. **Secure admin panel** — server-side auth, not localStorage password
5. **Remove debug/seed endpoints** from production
6. **Delete the ~30 junk files** listed above
7. **Make CategoryShowcase data-driven** — fetch categories from DB instead of hardcoding in `productTypes.ts`
8. **Product detail panel** shows no product image — only text + flavor/filling selection. Could show the product image.
9. **No loading states in admin** — admin actions don't have proper loading/error feedback
10. **`options` field format** (`"Label|price, Label2|price2"`) is fragile string parsing — could be a proper JSON array
11. **Cart does not handle the case where a product's price changes** between sessions (stale localStorage)

---

## What Works Well (Don't Break)

- WhatsApp redirect flow (tested and working in production)
- `useCart.ts` — robust, handles min_quantity, customization deduplication
- Product seeding on first deploy (`app/utils.py:seed_products()`)
- `vercel.json` rewrites routing (took several iterations to get right — don't change carelessly)
- Mobile responsive layout (2-column grid on mobile)
- Toast notification on add-to-cart
- Admin product visibility toggle (`is_visible`)
- Flavor/filling validation in `ProductDetail.tsx` (required before adding to cart)
