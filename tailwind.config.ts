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
        "dalili-dark": "#1F2850",
        "dalili-blue": "#014df8",
        "dalili-bg":   "#050914",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        "open-sans": ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
