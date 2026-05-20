import { useState, useEffect } from "react";

const THEMES = [
  {
    id: "default",
    label: "Classic Brown",
    colors: { dot: "#c8860a", ring: "#1a1208" },
    vars: {
      "--color-base":          "#FAF8F5",
      "--color-surface":       "#ede6d8",
      "--color-surface-2":     "#d8cdb8",
      "--color-border":        "#c8b898",
      "--color-primary":       "#c8860a",
      "--color-primary-light": "rgba(200,134,10,0.12)",
      "--color-primary-dark":  "#a06008",
      "--color-secondary":     "#e09a12",
      "--color-header-bg":     "#1a1208",
      "--color-header-2":      "#2c1f0e",
      "--color-header-border": "#4a3010",
      "--color-text":          "#1a1208",
      "--color-text-muted":    "#7a6040",
      "--color-text-light":    "#a89070",
      "--color-text-inverse":  "#e8e0d0",
    }
  },
  {
    id: "retro-blue",
    label: "Retro Blue",
    colors: { dot: "#F16D34", ring: "#161E54" },
    vars: {
      "--color-base":          "#BBE0EF",
      "--color-surface":       "#d6edf7",
      "--color-surface-2":     "#c8e5f0",
      "--color-border":        "#a0cce0",
      "--color-primary":       "#F16D34",
      "--color-primary-light": "rgba(241,109,52,0.12)",
      "--color-primary-dark":  "#d45520",
      "--color-secondary":     "#FF986A",
      "--color-header-bg":     "#161E54",
      "--color-header-2":      "#1a2460",
      "--color-header-border": "#252e70",
      "--color-text":          "#161E54",
      "--color-text-muted":    "#3a4a7a",
      "--color-text-light":    "#6070aa",
      "--color-text-inverse":  "#e8f0f8",
    }
  },
  {
    id: "sunset-warm",
    label: "Sunset Warm",
    colors: { dot: "#F57799", ring: "#c45070" },
    vars: {
      "--color-base":          "#FFF7CD",
      "--color-surface":       "#fff3b8",
      "--color-surface-2":     "#ffeea0",
      "--color-border":        "#f5d980",
      "--color-primary":       "#F57799",
      "--color-primary-light": "rgba(245,119,153,0.12)",
      "--color-primary-dark":  "#d45580",
      "--color-secondary":     "#FDC3A1",
      "--color-header-bg":     "#c45070",
      "--color-header-2":      "#d46080",
      "--color-header-border": "#e07090",
      "--color-text":          "#5a1a2a",
      "--color-text-muted":    "#8a4060",
      "--color-text-light":    "#b07090",
      "--color-text-inverse":  "#fff0f4",
    }
  },
  {
    id: "vintage-earth",
    label: "Vintage Earth",
    colors: { dot: "#C9B59C", ring: "#3d2b1f" },
    vars: {
      "--color-base":          "#F9F8F6",
      "--color-surface":       "#efe8df",
      "--color-surface-2":     "#e5dbd0",
      "--color-border":        "#D9CFC7",
      "--color-primary":       "#8a6a50",
      "--color-primary-light": "rgba(138,106,80,0.12)",
      "--color-primary-dark":  "#6a4a30",
      "--color-secondary":     "#C9B59C",
      "--color-header-bg":     "#3d2b1f",
      "--color-header-2":      "#4a3428",
      "--color-header-border": "#5a4038",
      "--color-text":          "#3d2b1f",
      "--color-text-muted":    "#7a6050",
      "--color-text-light":    "#a09080",
      "--color-text-inverse":  "#f5f0ea",
    }
  },
];

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);
  Object.entries(theme.vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
}

export default function ThemeToggle() {
  const [active, setActive] = useState(() => localStorage.getItem("bookverse-theme") || "default");
  const [open,   setOpen]   = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bookverse-theme") || "default";
    const theme = THEMES.find(t => t.id === saved) || THEMES[0];
    applyTheme(theme);
  }, []);

  const apply = (theme) => {
    applyTheme(theme);
    setActive(theme.id);
    localStorage.setItem("bookverse-theme", theme.id);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:998 }} />
      )}

      <div style={{
        position:   "fixed",
        right:      open ? 0 : "-190px",
        top:        "50%",
        transform:  "translateY(-50%)",
        zIndex:     999,
        display:    "flex",
        alignItems: "stretch",
        transition: "right 0.35s cubic-bezier(.4,0,.2,1)",
        filter:     "drop-shadow(-4px 0 16px rgba(0,0,0,0.22))",
      }}>

        <button onClick={() => setOpen(o => !o)} style={{
          width:          38,
          background:     "var(--color-primary, #c8860a)",
          border:         "none",
          borderRadius:   "10px 0 0 10px",
          cursor:         "pointer",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            8,
          padding:        "16px 6px",
          color:          "#fff",
          fontSize:       11,
          fontWeight:     700,
          letterSpacing:  1.5,
          textTransform:  "uppercase",
          fontFamily:     "'Roboto Slab', serif",
        }}>
          <span style={{ fontSize:20 }}>🎨</span>
          <span style={{ writingMode:"vertical-rl", textOrientation:"mixed" }}>
            {open ? "✕" : "Theme"}
          </span>
        </button>

        <div style={{
          width:         190,
          background:    "var(--color-surface, #ede6d8)",
          borderLeft:    "3px solid var(--color-primary, #c8860a)",
          padding:       "20px 16px",
          display:       "flex",
          flexDirection: "column",
          gap:           10,
        }}>
          <p style={{
            margin:        0,
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color:         "var(--color-text-muted, #7a6040)",
            fontFamily:    "'Open Sans', sans-serif",
          }}>Choose Theme</p>

          {THEMES.map(t => (
            <button key={t.id} onClick={() => apply(t)} style={{
              display:      "flex",
              alignItems:   "center",
              gap:          10,
              background:   active === t.id ? "var(--color-primary-light, rgba(200,134,10,0.12))" : "transparent",
              border:       active === t.id ? "2px solid var(--color-primary, #c8860a)" : "2px solid transparent",
              borderRadius: 8,
              padding:      "8px 10px",
              cursor:       "pointer",
              width:        "100%",
              transition:   "all 0.18s",
            }}>
              <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:t.colors.ring, border:"1.5px solid rgba(0,0,0,0.1)" }} />
                <div style={{ width:14, height:14, borderRadius:"50%", background:t.colors.dot,  border:"1.5px solid rgba(0,0,0,0.1)" }} />
              </div>
              <span style={{
                fontSize:   12,
                fontWeight: active === t.id ? 700 : 500,
                color:      "var(--color-text, #1a1208)",
                fontFamily: "'Open Sans', sans-serif",
              }}>{t.label}</span>
              {active === t.id && (
                <span style={{ marginLeft:"auto", color:"var(--color-primary, #c8860a)", fontSize:14 }}>✓</span>
              )}
            </button>
          ))}

          <div style={{
            marginTop:  4,
            paddingTop: 10,
            borderTop:  "1px solid var(--color-border, #c8b898)",
            fontSize:   10,
            color:      "var(--color-text-muted, #7a6040)",
            fontFamily: "'Open Sans', sans-serif",
            textAlign:  "center",
          }}>
            Saved automatically
          </div>
        </div>
      </div>
    </>
  );
}