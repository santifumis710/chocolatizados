"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartWidget } from "@/components/CartWidget";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ProductDetail } from "@/components/ProductDetail";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { useCart, CartItem } from "@/hooks/useCart";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { createOrder, fetchProducts } from "@/services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  allows_customization: boolean;
  weight_g?: number;
  dimensions?: string;
  options?: string;
  min_quantity?: number;
  image_position?: string;
  is_visible?: boolean;
}

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: colors.primary,
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        transition: "transform 0.2s ease",
        transform: isHovered ? "scale(1.2)" : "scale(1)",
        padding: spacing.xs
      }}
    >
      {/* Clone child to enforce size if needed, or just allow child to control it */}
      {children}
    </a>
  );
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { cart, addItem, removeItem, updateQuantity, clearCart, itemCount, total } = useCart();

  const [toastState, setToastState] = useState<'hidden' | 'visible' | 'closing'>('hidden');

  useEffect(() => {
    // Cargar productos desde la API
    fetchProducts()
      .then((data: Product[]) => {
        // Filter out invisible products
        const visibleProducts = data.filter(p => p.is_visible !== false);
        setProducts(visibleProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleAddToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    addItem({ ...item, quantity });

    // Toast logic
    setToastState('visible');

    // Start closing after 4.5s
    setTimeout(() => {
      setToastState('closing');
    }, 4500);

    // Completely hide after 5s (animation finish)
    setTimeout(() => {
      setToastState('hidden');
    }, 5000);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutComplete = async (data: any) => {
    try {
      // 1. Save Order to Backend
      await createOrder({
        ...data,
        total: total
      });

      // 2. Generate WhatsApp Message
      const itemsList = data.items.map((item: any) =>
        `${item.quantity}x ${item.name}${item.customization_text ? ` (${item.customization_text})` : ''}`
      ).join('\n');

      const waveEmoji = String.fromCodePoint(0x1F44B);
      const clipboardEmoji = String.fromCodePoint(0x1F4CB);
      const moneyBagEmoji = String.fromCodePoint(0x1F4B0);
      const bustInSilhouetteEmoji = String.fromCodePoint(0x1F464);

      const messageContent = `Hola Marie! ${waveEmoji} Quiero realizar el siguiente pedido:\n\n` +
        `${clipboardEmoji} Detalle:\n\n` +
        `${itemsList}\n\n` +
        `${moneyBagEmoji} Total: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n\n` +
        `${bustInSilhouetteEmoji} Nombre: ${data.customer_name}`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=5493426158358&text=${encodeURIComponent(messageContent)}`;

      // 3. Open WhatsApp (Redirect current tab)
      // On mobile, window.open is often blocked if not direct user action
      window.location.href = whatsappUrl;

      // 4. Clear Cart and Close
      clearCart();
      setCheckoutOpen(false);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Hubo un error guardando el pedido, pero te redirigiremos a WhatsApp.");

      // Fallback: Open WhatsApp anyway
      const itemsList = data.items.map((item: any) =>
        `${item.quantity}x ${item.name}`
      ).join('\n');

      const waveEmoji = String.fromCodePoint(0x1F44B);
      const clipboardEmoji = String.fromCodePoint(0x1F4CB);
      const moneyBagEmoji = String.fromCodePoint(0x1F4B0);
      const bustInSilhouetteEmoji = String.fromCodePoint(0x1F464);

      const messageContent = `Hola Marie! ${waveEmoji} Quiero realizar el siguiente pedido:\n\n` +
        `${clipboardEmoji} Detalle:\n\n` +
        `${itemsList}\n\n` +
        `${moneyBagEmoji} Total: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n\n` +
        `${bustInSilhouetteEmoji} Nombre: ${data.customer_name}`;

      window.location.href = `https://api.whatsapp.com/send?phone=5493426158358&text=${encodeURIComponent(messageContent)}`;
      clearCart();
      setCheckoutOpen(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        fontFamily: typography.fontFamily,
        color: colors.text,
      }}
    >
      {/* Header */}
      <style dangerouslySetInnerHTML={{
        __html: `
              /* Estilos Globales para Móvil */
              @media (max-width: 768px) {
                .desktop-only { display: none !important; }
                .mobile-only { display: block !important; }
                
                /* Grid de Productos: 2 columnas en móvil */
                .product-grid {
                   grid-template-columns: repeat(2, 1fr) !important;
                   gap: ${spacing.sm} !important;
                }
              }

              @media (min-width: 769px) {
                .desktop-only { display: block !important; }
                .mobile-only { display: none !important; }
                
                .product-grid {
                   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                   gap: ${spacing.lg};
                }
              }

              .hero-background {
                background-color: #CDAA7D; /* User requested R:206 G:170 B:125 */
                color: ${colors.white};
                padding: ${spacing.xxl} 0;
                position: relative;
                overflow: hidden; /* Ensure pseudo-element doesn't overflow */
              }

              /* Use pseudo-element for background image to control opacity independently */
              .hero-background::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/images/hero-pattern-v2.png'), url('/images/hero-pattern-v2.png');
                background-size: contain, contain;
                background-position: left center, right center;
                background-repeat: no-repeat, no-repeat;
                opacity: 0.3; /* Lower opacity as requested */
                z-index: 1;
              }

              /* Content wrapper to stay on top */
              .hero-content-wrapper {
                position: relative;
                z-index: 2;
                max-width: 1200px;
                margin: 0 auto;
              }
              
              .hero-row { display: flex; flex-wrap: wrap; }
              .hero-col { flex: 1 1 500px; } /* Wraps at 500px */
              .hero-text-left { padding: 40px 40px 40px 0; display: flex; flex-direction: column; justify-content: center; } /* Text 1: No Left Padding */
              .hero-text-right { padding: 40px 0 40px 40px; display: flex; flex-direction: column; justify-content: center; } /* Text 2: No Right Padding */
              .hero-img { height: auto; width: 100%; display: block; }

              @media (max-width: 768px) {
                .hero-background::before {
                  background-image: url('/images/hero-pattern-v2.png');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                }
                .hero-row { flex-direction: column !important; }
                .hero-col { flex: 1 1 auto; }
                .hero-text-left, .hero-text-right { padding: 15px 20px; } /* Restore padding on mobile */
              }

              /* Toast Animation */
              @keyframes slideUpFadeIn {
                from { transform: translateX(-50%) translateY(100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
              }
              @keyframes slideDownFadeOut {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(100%); opacity: 0; }
              }

              .toast-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: ${colors.primary};
                color: ${colors.white};
                padding: ${spacing.md} ${spacing.lg};
                border-radius: 50px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 2000;
                font-size: ${typography.sizes.base};
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: ${spacing.sm};
                white-space: nowrap;
              }

              .toast-entering {
                animation: slideUpFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .toast-exiting {
                animation: slideDownFadeOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }

              @media (max-width: 768px) {
                .toast-notification {
                  width: auto;
                  max-width: 90%;
                  justify-content: center;
                  white-space: nowrap;
                  border-radius: 50px;
                }
              }
            `}} />

      {/* Toast Notification */}
      {toastState !== 'hidden' && (
        <div
          className={`toast-notification ${toastState === 'visible' ? 'toast-entering' : 'toast-exiting'}`}
        >
          <span>✅</span>
          Producto agregado al carrito
        </div>
      )}

      {/* Header */}
      <header
        style={{
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          padding: spacing.md,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Top Row: Logo & Icons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}>
            {/* Left: Logo + Desktop Slogan */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <img
                src="/logo.jpg"
                alt="Chocolatizados Logo"
                style={{
                  height: "60px", // Slightly smaller for mobile safety
                  width: "auto",
                  borderRadius: "8px",
                }}
              />
              {/* Slogan Removed */}
            </div>

            {/* Right: Social Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: spacing.sm }}>
              <SocialIcon href="https://www.instagram.com/chocolatizados/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </SocialIcon>
              <SocialIcon href={`https://api.whatsapp.com/send?phone=5493426158358&text=Hola%20Marie,%20quiero%20chocolates!`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </SocialIcon>

              <CartWidget itemCount={itemCount} onClick={() => setCartOpen(!cartOpen)} />
            </div>
          </div>

          {/* Mobile Slogan Removed */}
        </div>
      </header>

      {/* ... (Rest of layout) ... */}

      {/* Hero Section */}
      <section className="hero-background">
        <div className="hero-content-wrapper">
          {/* Content unchanged, styles handled by class above */}

          {/* Row 1: Image Left | Text Right */}
          <div className="hero-row" style={{ flexDirection: "row" }}>
            <div className="hero-col">
              <img src="/images/products/hero-tabletas.jpg" alt="Chocolate artesanal" className="hero-img" style={{ borderRadius: "16px" }} />
            </div>
            <div className="hero-col hero-text-right">
              <p style={{
                fontSize: typography.sizes.lg,
                lineHeight: 1.8,
                fontStyle: "italic",
                textAlign: "justify",
                textIndent: spacing.xl,
                margin: 0
              }}>
                Cuando una persona o empresa quiere agasajar a sus invitados o clientes, nada mejor que hacerlo con un producto tentador como es el chocolate... personalizando su envoltorio. Mas allá de lo emotivo, endulzarle el día a alguien querido es un acto totalmente grato, tanto para el que recibe el regalo como para el que lo brinda.
              </p>
            </div>
          </div>

          {/* Row 2 (New): Text Left | Image Right */}
          <div className="hero-row" style={{ flexDirection: "row-reverse" }}>
            <div className="hero-col" style={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/images/marie.jpg"
                alt="Mariela"
                className="hero-img"
                style={{
                  borderRadius: "16px",
                  maxWidth: "70%",
                  height: "auto"
                }}
              />
            </div>
            <div className="hero-col hero-text-left">
              <p style={{
                fontSize: typography.sizes.lg,
                lineHeight: 1.8,
                fontStyle: "italic",
                textAlign: "justify",
                textIndent: spacing.xl,
                margin: 0
              }}>
                Soy Mariela, la persona detrás de Chocolatizados. Hace mas de 18 años nació este emprendimiento, que permite transformar chocolate verdadero en momentos únicos. Mi intención es lograr que lo que quieras decir, lo digas con chocolates.
              </p>
            </div>
          </div>

          {/* Row 3: Image Left | Text Right */}
          <div className="hero-row" style={{ flexDirection: "row" }}>
            <div className="hero-col">
              <img src="/images/products/hero-bombones.jpg" alt="Bombones premium" className="hero-img" style={{ borderRadius: "16px" }} />
            </div>
            <div className="hero-col hero-text-right">
              <p style={{
                fontSize: typography.sizes.lg,
                lineHeight: 1.8,
                fontStyle: "italic",
                textAlign: "justify",
                textIndent: spacing.xl,
                margin: 0
              }}>
                Elegí chocolate de verdad! El chocolate genuino y el baño de reposteria pueden parecer similares a primera vista, pero sus diferencias son significativas, podés reconocerlo porque el verdadero chocolate no deja una sensación de grasitud en el paladar, es rígido, crocante y brilloso, tiene un sabor y aroma diferencial... y se funde de manera agradable en tu boca.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Category Showcase */}
      < CategoryShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: ${spacing.xl};
        }
        @media (max-width: 768px) {
          .main-content {
            padding: ${spacing.sm} !important; /* Restore small padding for margins */
          }
          .product-grid {
             gap: ${spacing.sm} !important; /* Standard gap */
          }
        }
      `}} />
      < main className="main-content">
        <div style={{ marginBottom: spacing.lg }}>
          <h2 style={{ color: colors.primary, fontSize: typography.sizes.xl, fontWeight: "900" }}>
            {selectedCategory ? `Catálogo: ${selectedCategory}` : "Catálogo Completo"}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: `1px solid ${colors.primary}`,
                color: colors.primary,
                borderRadius: "20px",
                cursor: "pointer",
                marginTop: spacing.sm
              }}
            >
              ← Ver todos
            </button>
          )}
        </div>

        {
          loading ? (
            <div
              style={{
                textAlign: "center",
                padding: spacing.xl,
                fontSize: typography.sizes.lg,
                color: colors.textLight,
              }}
            >
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: spacing.xl,
                fontSize: typography.sizes.lg,
                color: colors.textLight,
              }}
            >
              No hay productos disponibles en esta categoría.
            </div>
          ) : (
            <div className="product-grid" style={{ display: "grid" }}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image_url={product.image_url}
                  imagePosition={product.image_position}
                  onSelect={setSelectedProductId}
                />
              ))}
            </div>
          )
        }
      </main >

      {/* Product Detail Panel */}
      {
        selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
            onAddToCart={handleAddToCart}
          />
        )
      }

      {/* Cart Sidebar */}
      {
        cartOpen && (
          <CartSidebar
            items={cart}
            total={total}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onCheckout={handleCheckout}
            onClose={() => setCartOpen(false)}
          />
        )
      }

      {/* Checkout Modal */}
      {
        checkoutOpen && (
          <CheckoutModal
            isOpen={true}
            items={cart}
            total={total}
            onClose={() => {
              setCheckoutOpen(false);
              setCartOpen(true);
            }}
            onSubmit={handleCheckoutComplete}
          />
        )
      }
    </div >
  );
}

