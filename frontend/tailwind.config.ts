import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        primaryForeground: "#001435",
        secondary: "#EEEEEE",
        secondaryForeground: "#1F2937",
        background: "#01EFAB",
        foreground: "#1F2937",
        card: "#F9FAFB", 
        cardForeground: "#1F2937",
        muted: "#6B7280",
        title: "#04378c"
      },
    },
  },
  plugins: [],
};
export default config;
