/**
 * Tailwind config aligned with theme.ts tokens.
 *
 * theme.ts spacing maps to Tailwind defaults:
 *   xs (4px) = 1, sm (8px) = 2, md (16px) = 4,
 *   lg (24px) = 6, xl (32px) = 8, xxl (48px) = 12
 */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A83A2B",
        secondary: "#CDAA7D",
        background: "#F5E6D3",
        text: "#333333",
        textLight: "#666666",
        error: "#D32F2F",
        success: "#388E3C",
        border: "#DDD9CF",
      },
      fontFamily: {
        sans: ["var(--font-source-sans)", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      fontSize: {
        // Override defaults so theme.ts xl/xxl map to text-xl/text-2xl
        xl: ["24px", { lineHeight: "1.4" }],
        "2xl": ["32px", { lineHeight: "1.3" }],
        h1: ["40px", { lineHeight: "1.2" }],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
        md: "0 4px 6px rgba(0, 0, 0, 0.15)",
        lg: "0 10px 20px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
