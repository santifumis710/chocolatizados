const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A64C3E",
        secondary: "#C4B5A0",
        background: "#F5E6D3",
        text: "#333333",
        textLight: "#666666",
      },
      fontFamily: {
        serif: ["Georgia", "Garamond", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
