import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        zh: [
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Noto Sans CJK SC"',
          '"Microsoft YaHei"',
          "sans-serif",
        ],
      },
      colors: {
        // Vân Trang lifestyle palette — warm cream + dusty rose + warm brown.
        // Keeps the editorial 0px-radius layout but trades BMW cold navy/blue
        // for a softer, friendlier travel/drama mood. Legacy class names
        // (ink-900, bmw-blue, etc.) are preserved and remapped so all
        // existing components continue to work without rewrites.
        ink: {
          50: "#fdfaf5",  // surface-card (cream)
          100: "#f9f3e9", // surface-soft (warm cream)
          200: "#ebe1cf", // hairline (warm beige)
          300: "#d4c4a8", // hairline-strong
          400: "#a89478", // muted-soft (warm taupe)
          500: "#7d6750", // muted (warm brown)
          600: "#52402e", // body (deep warm brown)
          700: "#3a2c1f", // body-strong
          800: "#2e1f15", // surface-dark-elevated
          900: "#1f1410", // surface-dark (deep espresso, replaces navy)
        },
        accent: {
          // Dusty rose — the primary action color (replaces BMW blue)
          50: "#faf0f1",
          100: "#f5dfe2",
          200: "#ebc1c7",
          300: "#dba0a9",
          400: "#c97f8c",
          500: "#b06371", // primary (dusty rose)
          600: "#964e5b", // primary-active
          700: "#7a3e49",
          800: "#5e2f38",
          900: "#3f1f25",
        },
        // Semantic tokens (warm theme — same names as Bao app)
        canvas: "#fdfaf5",          // warm cream (replaces pure white)
        hairline: "#ebe1cf",        // warm beige
        "hairline-strong": "#d4c4a8",
        muted: "#7d6750",           // warm brown
        "muted-soft": "#a89478",
        body: "#52402e",
        "body-strong": "#3a2c1f",
        "surface-soft": "#f9f3e9",
        "surface-card": "#f5ede0",  // soft peach card
        "surface-strong": "#ebe1cf",
        "surface-dark": "#1f1410",  // deep espresso (hero bg)
        "surface-dark-elevated": "#2e1f15",
        "on-dark-soft": "#d4c4a8",  // legible on espresso
        // Brand accent — dusty rose (replaces BMW blue everywhere class is used)
        "bmw-blue": "#b06371",
        "bmw-blue-active": "#964e5b",
        "m-blue-light": "#c97f8c",  // lighter dusty rose
        "m-blue-dark": "#7a3e49",   // deeper rose
        "m-red": "#a8513d",         // warm terracotta (replaces BMW red)
      },
      spacing: {
        section: "5rem", // 80px — BMW corporate section rhythm
      },
      letterSpacing: {
        nav: "0.3px",
        button: "0.5px",
        label: "1.5px",
      },
      maxWidth: {
        editorial: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
