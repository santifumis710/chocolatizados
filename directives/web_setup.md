# Web Development Setup & Deployment

## Goal
Build and deploy the Chocolatizados e-commerce platform with a Next.js frontend, FastAPI backend, and PostgreSQL database. Support for custom chocolate product catalog and order management.

## Inputs
- **Product List:** CSV or JSON file with chocolate products, descriptions, images, pricing
- **Design Requirements:** Brand colors, logo, content for key pages (home, about, contact)
- **User Stories:** How customers browse, customize, and purchase chocolates

## Tools/Scripts to Use
- `execution/init_nextjs.py` - Initialize Next.js project structure
- `execution/init_fastapi.py` - Initialize FastAPI backend scaffolding
- `execution/load_products.py` - Import product catalog into database
- `execution/image_optimizer.py` - Resize and optimize product images

## Outputs
- **Frontend:** Running Next.js dev server at `http://localhost:3000`
- **Backend:** Running FastAPI at `http://localhost:8000`
- **Database:** PostgreSQL with Chocolatizados schema (products, orders, users)
- **Source Code:** Version-controlled in `src/frontend/` and `src/backend/`

## Process

### Phase 1: Initialize Project Structure
1. Run `execution/init_nextjs.py` to scaffold the frontend project with:
   - Pages: Home, Products, Product Detail, Cart, Checkout, Order Confirmation
   - Components: Navigation, Product Card, Cart Widget, etc.
   - Styling: Tailwind CSS setup
   
2. Run `execution/init_fastapi.py` to scaffold the backend with:
   - Models: Product, Order, Customer, Review
   - Routes: `/api/products`, `/api/orders`, `/api/customers`
   - Database: SQLAlchemy ORM setup for PostgreSQL

3. Create database schema for:
   - Products (id, name, description, category, price, image_url, is_customizable, customization_fields)
   - Orders (id, customer_id, product_ids, total_price, status, created_at)
   - Customers (id, email, name, phone, address)
   - Reviews (id, product_id, customer_id, rating, comment)

### Phase 2: Product Catalog Integration
1. Wait for user to provide product list (CSV/JSON)
2. Run `execution/load_products.py` to:
   - Parse product file
   - Validate against schema (required fields: name, price, description, category)
   - Optimize images with `execution/image_optimizer.py`
   - Insert into PostgreSQL with proper relationships
   
3. Create frontend product grid that:
   - Displays products with images, prices, descriptions
   - Filters by category
   - Shows customization options for eligible products

### Phase 3: Core Features
1. **Product Browsing:** Display products by category, search, filtering
2. **Shopping Cart:** Add/remove items, quantity adjustment, persistent storage
3. **Checkout:** Customer info, address, payment method (Stripe integration)
4. **Orders:** Place, track, view order history

### Phase 4: Customization Logic
- *Pending product list from user*
- Define if "personalized" means:
  - Text customization (names, messages on wrapping)
  - Design selection (chocolate patterns, flavors)
  - Quantity/bundling (gift boxes, sets)

## Edge Cases & Notes
- **Images:** All product images must be optimized for web (max 500KB, responsive)
- **Database Migrations:** Use Alembic for schema version control
- **CORS:** Configure FastAPI CORS for Next.js at `localhost:3000`
- **Environment:** Use `.env` for all credentials and API URLs
- **Testing:** Backend endpoints with pytest, frontend with Jest/React Testing Library

## Status
- ⏳ Awaiting product catalog file from user
- ✅ Project structure initialized
- 🔄 Next: Import products and build product page
