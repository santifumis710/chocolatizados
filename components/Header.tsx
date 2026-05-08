"use client";

import React from "react";
import { CartWidget } from "@/components/CartWidget";

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary flex items-center no-underline p-1 transition-transform duration-200 hover:scale-125"
  >
    {children}
  </a>
);

interface HeaderProps {
  itemCount: number;
  onCartClick: () => void;
}

export const Header = ({ itemCount, onCartClick }: HeaderProps) => (
  <header className="sticky top-0 z-[100] bg-white border-b border-border p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Chocolatizados Logo"
            className="h-[60px] w-auto rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
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
          <SocialIcon href="https://api.whatsapp.com/send?phone=5493424062442&text=Hola%20Marie,%20quiero%20chocolates!">
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
