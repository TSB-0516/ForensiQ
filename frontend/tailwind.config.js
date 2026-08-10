/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // --- Base surfaces, taken directly from DESIGN.md frontmatter (source of truth) ---
        surface: {
          DEFAULT: "#121317",
          dim: "#121317",
          bright: "#38393d",
          lowest: "#0d0e12",
          low: "#1a1b1f",
          high: "#292a2e",
          highest: "#343439",
        },
        "on-surface": "#e3e2e7",
        "on-surface-variant": "#bcc8d0",
        outline: "#87929a",
        "outline-variant": "#3d484f",

        // --- Semantic accents. The frontmatter's `primary`/`secondary`/`tertiary`
        // tokens are pastel M3-style values meant for on-dark text/icons.
        // The prose spec calls out punchier hex values for actual interactive
        // elements (buttons, badges, focus rings) — using those here as the
        // colors you'll reach for most often day-to-day. Both sets are kept
        // so you have the muted variant available for less prominent UI. ---
        action: {
          DEFAULT: "#37c6ff",   // primary — active states, primary buttons, "source of truth"
          soft: "#9eddff",      // frontmatter `primary` — for text/icons on dark surfaces
          on: "#003548",
        },
        warning: {
          DEFAULT: "#ffc857",   // secondary accent — "attention required"
          soft: "#f4be4e",
          on: "#412d00",
        },
        success: {
          DEFAULT: "#5ac878",
          soft: "#7dec98",
          on: "#003917",
        },
        danger: {
          DEFAULT: "#e5484d",
          soft: "#ffb4ab",
          on: "#690005",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Matches DESIGN.md typography scale exactly
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.05em" }],
        "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
        "mono-data": ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      spacing: {
        sidebar: "240px",
        "sidebar-collapsed": "64px",
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(55, 198, 255, 0.15)",
      },
    },
  },
  plugins: [],
};