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
├── app/
│   ├── layout.tsx              # Root layout (next/font, metadata, imports globals.css)
│   ├── page.tsx                # Storefront orchestrator: data fetch + cart/modal state
│   ├── globals.css             # Tailwind directives + .hero-* / .toast / .product-grid
│   └── admin/
│       ├── layout.tsx          # Auth gate (redirects to /admin/login if no token)
│       ├── login/page.tsx      # Login form → POST /api/admin/login
│       ├── page.tsx            # Tabbed dashboard (products / orders / stats)
│       ├── ProductModal.tsx
│       ├── OrdersTable.tsx
│       └── StatsView.tsx
├── components/
│   ├── Header.tsx              # Sticky header: logo, social icons, CartWidget
│   ├── Hero.tsx                # Three image+text rows
│   ├── Storefront.tsx          # Catalog title + product grid + loading/empty
│   ├── ProductCard.tsx
│   ├── ProductDetail.tsx       # Right-slide panel: qty, flavors, fillings, notes
│   ├── CartSidebar.tsx
│   ├── CartWidget.tsx
│   ├── CheckoutModal.tsx       # Two-step form (info → confirmation → WhatsApp)
│   ├── CategoryShowcase.tsx    # Fetches /api/categories on mount
│   └── index.ts
├── hooks/
│   ├── useCart.ts              # localStorage-backed cart with min_quantity handling
│   └── index.ts
├── services/
│   └── api.ts                  # fetchProducts, fetchCategories, login, adminFetch helpers
├── tailwind.config.js          # Color/spacing/typography tokens (single source of truth)
├── postcss.config.js
├── tsconfig.json
├── package.json
├── .env.example                # Documents ADMIN_PASSWORD etc.
├── vercel.json                 # { rewrites: [{ /api/(.*) → /api/index.py }] }
├── .vercelignore               # Excludes assets-raw/, docs/ from build upload
├── api/
│   └── index.py                # Vercel serverless entry: imports src/backend/main.py
├── requirements.txt            # Python deps used by Vercel
├── src/backend/
│   ├── main.py                 # FastAPI app, CORS, route registration
│   ├── requirements.txt        # Backend deps (kept in sync with root requirements.txt)
│   ├── data/
│   │   ├── products.json       # Seed data (~25 products) — used on cold start when DB empty
│   │   └── categories.json     # Category metadata served by /api/categories
│   └── app/
│       ├── db.py               # SQLAlchemy engine, ProductModel, OrderModel
│       ├── utils.py            # seed_products() — fills DB from products.json if empty
│       ├── auth.py             # HMAC-SHA256 token issue/verify, require_admin dependency
│       ├── models/schemas.py   # Just `Product` schema now
│       └── routes/
│           ├── products.py     # CRUD /api/products (mutations require admin)
│           ├── orders.py       # CRUD /api/orders (POST is public, others require admin)
│           ├── auth.py         # POST /api/admin/login → bearer token
│           └── categories.py   # GET /api/categories (read-only, JSON-backed)
├── assets-raw/                 # Originals not shipped to Vercel (.vercelignore'd)
└── public/
    ├── logo.jpg
    ├── favicon.png
    └── images/
        ├── hero_madre_16_9.jpg
        ├── marie.jpg
        ├── hero-pattern-v2.png
        └── products/           # ~80 product images
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

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | – | Health check |
| GET | `/api/products` | – | List all products |
| POST | `/api/products/` | admin | Create product |
| PUT | `/api/products/{id}` | admin | Update product |
| DELETE | `/api/products/{id}` | admin | Delete product |
| GET | `/api/orders` | admin | List all orders |
| POST | `/api/orders` | – | Create order (customer checkout) |
| PUT | `/api/orders/{id}/status` | admin | Update order status |
| DELETE | `/api/orders/{id}` | admin | Delete order |
| POST | `/api/admin/login` | – | Validates ADMIN_PASSWORD, returns bearer token |
| GET | `/api/categories` | – | Category metadata (weight/size/flavor preview images) |

Admin auth flow: client POSTs `{password}` to `/api/admin/login` → backend issues an HMAC-SHA256-signed bearer token (7-day TTL). The HMAC key is derived from `ADMIN_PASSWORD`, so rotating the password invalidates every outstanding session. `services/api.ts:adminFetch` attaches `Authorization: Bearer <token>` to admin-only calls and redirects to `/admin/login` on a 401.

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
| `ADMIN_PASSWORD` | Backend | Admin panel password — backend validates and issues HMAC tokens. Rotating it invalidates every outstanding session. |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend base URL (empty = relative, works on Vercel) |

---

## Design Tokens (`tailwind.config.js`)

```js
colors.primary    = "#A83A2B"  // Brand Red (chocolate)
colors.secondary  = "#CDAA7D"  // Brand Gold/Tan
colors.background = "#F5E6D3"  // Brand Cream
colors.text       = "#333333"
colors.textLight  = "#666666"
colors.error      = "#D32F2F"
colors.success    = "#388E3C"
colors.border     = "#DDD9CF"

fontFamily.sans  = var(--font-source-sans)
fontFamily.serif = var(--font-playfair)
```

Spacing follows Tailwind defaults (`p-1`=4px, `p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `p-12`=48px). `text-xl` and `text-2xl` are overridden to match the prior design (24px / 32px).

---

## Product Catalog (from `src/backend/data/products.json`)

~25 products across 6 categories. Key fields per product:
- Bulk boxes (x26, x64, x120, x140, x250 units) — allows_customization: true
- Individual bolsitas tul (x2, x5, x8) — min_quantity: 10
- Barritas Rellenas (x6)
- Tableta Individual
- All prices in ARS pesos (e.g. 55700, 114800)

---

## Known Issues & Improvement Opportunities

1. **Product detail panel shows no product image** — only text + flavor/filling selection. The product photo would help visual confirmation.
2. **No loading/error states in admin** — admin actions show `alert()` rather than inline feedback.
3. **`options` field format** (`"Label|price, Label2|price2"`) is fragile string parsing. Promoting to JSON array would also let admin edit it cleanly.
4. **Cart doesn't handle product price changes between sessions** (stale localStorage).
5. **Category metadata is JSON-on-disk** (`src/backend/data/categories.json`). Promoting to a DB table + admin UI is the natural next step if Mariela ever needs to edit it without a deploy.

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
