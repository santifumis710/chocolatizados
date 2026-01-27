"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartWidget } from "@/components/CartWidget";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ProductDetail } from "@/components/ProductDetail";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { useCart, CartItem } from "@/hooks/useCart";
import { colors, spacing, typography } from "@/theme";
import { createOrder } from "@/services/api";

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

  useEffect(() => {
    // Cargar productos desde products.json
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
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
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
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

      // 3. Open WhatsApp
      window.open(whatsappUrl, '_blank');

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

      window.open(`https://api.whatsapp.com/send?phone=5493426158358&text=${encodeURIComponent(messageContent)}`, '_blank');
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
      <header
        style={{
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          padding: spacing.lg,
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
                height: "75px",
                width: "auto",
                borderRadius: "8px",
              }}
            />
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "28px",
                  color: colors.secondary,
                  fontFamily: typography.fontFamilySerif,
                  fontStyle: "italic",
                  fontWeight: "normal",
                }}
              >
                "Lo que quieras decir, decilo con chocolates"
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: spacing.md }}>
              <SocialIcon href="https://www.instagram.com/chocolatizados/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
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
                  width="30"
                  height="30"
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
            </div>

            <CartWidget itemCount={itemCount} onClick={() => setCartOpen(!cartOpen)} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-background">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Row 1: Text Left | Image Right (Desktop) -> Image Top | Text Bottom (Mobile) */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row-reverse", // Default for mobile to put img on top if we assume img is 2nd in DOM? No, let's use standard order + media query logic or simple stacking.
            // Actually, simpler: Desktop = Row. Mobile = Column-Reverse (if Img is 2nd child).
            // But inline styles are hard for media queries.
            // Trick: use `flex-wrap: wrap`.
            // Item 1 (Text): flex-basis: 50% (desktop), 100% (mobile). Order 2 (mobile), Order 1 (desktop)?
            // Without media queries in inline styles, we rely on natural wrapping.
            // Left Item (Text) and Right Item (Image).
            // If we want Image Top on Mobile, we put Image FIRST in DOM, then Text.
            // Then on Desktop: we force Text to be Left (Order 1) and Image Right (Order 2).
            // But we can't switch `flex-direction` without media query.
            // Workaround: We will use a standard CSS class or insert a <style> tag.
          }}>
            <style dangerouslySetInnerHTML={{
              __html: `
              .hero-background {
                background-color: #CDAA7D;
                color: ${colors.white};
                padding: ${spacing.xxl} 0;
                background-image: url('/images/hero-pattern-v2.png'), url('/images/hero-pattern-v2.png');
                background-size: contain, contain;
                background-position: left center, right center;
                background-repeat: no-repeat, no-repeat;
              }
              
              .hero-row { display: flex; flex-wrap: wrap; }
              .hero-col { flex: 1 1 500px; } /* Wraps at 500px */
              .hero-text-left { padding: 40px 40px 40px 0; display: flex; flex-direction: column; justify-content: center; } /* Text 1: No Left Padding */
              .hero-text-right { padding: 40px 0 40px 40px; display: flex; flex-direction: column; justify-content: center; } /* Text 2: No Right Padding */
              .hero-img { height: auto; width: 100%; display: block; }

              @media (max-width: 768px) {
                .hero-background {
                  background-image: url('/images/hero-pattern-v2.png');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                }
                .hero-row { flex-direction: column !important; }
                .hero-col { flex: 1 1 auto; }
                .hero-text-left, .hero-text-right { padding: 15px 20px; } /* Restore padding on mobile */
              }
            `}} />

            {/* Row 1 */}
            <div className="hero-row" style={{ flexDirection: "row-reverse" }}>
              {/* Image (Right on Desktop, Top on Mobile because it's first in DOM? NO wait.) 
                   If row-reverse, the LAST element is LEFT. The FIRST element is RIGHT.
                   DOM Element 1: Image. (Right on Desktop).
                   DOM Element 2: Text. (Left on Desktop).
                   
                   Mobile (Column): Image (Top), Text (Bottom).
                   So DOM order: Image, Text.
                   Desktop: flex-direction: row-reverse. -> Text (Left), Image (Right).
                   Mobile: flex-direction: column. -> Image (Top), Text (Bottom).
               */}
              <div className="hero-col">
                <img src="/images/products/hero-tabletas.jpg" alt="Chocolate artesanal" className="hero-img" style={{ borderRadius: "16px" }} />
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
                  Cuando una persona o empresa quiere agasajar a sus invitados o clientes, nada mejor que hacerlo con un producto tentador como es el chocolate... personalizando su envoltorio.
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="hero-row" style={{ flexDirection: "row" }}>
              {/* DOM Element 1: Image. (Left on Desktop).
                   DOM Element 2: Text. (Right on Desktop).
                   
                   Mobile (Column): Image (Top), Text (Bottom).
                   So DOM order: Image, Text.
                   Desktop: flex-direction: row. -> Image (Left), Text (Right).
                   Mobile: flex-direction: column. -> Image (Top), Text (Bottom).
               */}
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
        </div>
      </section>

      {/* Category Showcase */}
      < CategoryShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content */}
      < main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: spacing.xl,
        }}
      >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: spacing.lg,
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image_url={product.image_url}
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

