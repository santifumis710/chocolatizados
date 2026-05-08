"use client";

import React, { useState } from "react";
import { CartWidget } from "@/components/CartWidget";
import { colors, spacing } from "@/theme";

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
        padding: spacing.xs,
      }}
    >
      {children}
    </a>
  );
};

interface HeaderProps {
  itemCount: number;
  onCartClick: () => void;
}

export const Header = ({ itemCount, onCartClick }: HeaderProps) => (
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
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacing.md }}>
          <img
            src="/logo.jpg"
            alt="Chocolatizados Logo"
            style={{ height: "60px", width: "auto", borderRadius: "8px" }}
          />
        </div>

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
          <SocialIcon href="https://api.whatsapp.com/send?phone=5493426158358&text=Hola%20Marie,%20quiero%20chocolates!">
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

          <CartWidget itemCount={itemCount} onClick={onCartClick} />
        </div>
      </div>
    </div>
  </header>
);
