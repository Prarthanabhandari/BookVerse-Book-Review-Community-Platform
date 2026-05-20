/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // All BookVerse theme colors mapped to CSS variables
        base:        "var(--color-base)",
        surface:     "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        primary:     "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark":  "var(--color-primary-dark)",
        secondary:   "var(--color-secondary)",
        header:      "var(--color-header-bg)",
        border:      "var(--color-border)",
        main:        "var(--color-text)",
        muted:       "var(--color-text-muted)",
        light:       "var(--color-text-light)",
        inverse:     "var(--color-text-inverse)",
        success:     "var(--color-success)",
        danger:      "var(--color-danger)",
        info:        "var(--color-info)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        btn:  "var(--radius-btn)",
      },
      fontFamily: {
        slab:    ["'Roboto Slab'", "serif"],
        display: ["'Playfair Display'", "serif"],
        sans:    ["'Open Sans'", "sans-serif"],
      },
      backgroundImage: {
        hero:    "var(--color-hero-bg)",
        explore: "var(--color-explore-bg)",
      },
    },
  },
  plugins: [],
}
