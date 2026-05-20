// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";

const THEMES = [
  {
    id: "default",
    label: "Classic Brown",
    colors: { dot: "#c8860a", ring: "#1a1208" },
  },
  {
    id: "retro-blue",
    label: "Retro Blue",
    colors: { dot: "#F16D34", ring: "#161E54" },
  },
  {
    id: "sunset-warm",
    label: "Sunset Warm",
    colors: { dot: "#F57799", ring: "#FB9B8F" },
  },
  {
    id: "vintage-earth",
    label: "Vintage Earth",
    colors: { dot: "#C9B59C", ring: "#3d2b1f" },
  },
];

export default function ThemeToggle() {
  const [active,  setActive]  = useState(() => localStorage.getItem("BookVerse-theme") || "default");
  const [open,    setOpen]    = useState(false);
  const [tooltip, setTooltip] = useState(null);

  // Apply theme on mount + change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", active);
    localStorage.setItem("BookVerse-theme", active);
  }, [active]);

  const apply = (id) => {
    setActive(id);
    setOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position:"fixed", inset:0, zIndex:998 }}
        />
      )}

      {/* Floating Panel */}
      <div style={{
        position:   "fixed",
        right:      open ? 0 : "-180px",
        top:        "50%",
        transform:  "translateY(-50%)",
        zIndex:     999,
        display:    "flex",
        alignItems: "stretch",
        transition: "right 0.35s cubic-bezier(.4,0,.2,1)",
        filter:     "drop-shadow(-4px 0 16px rgba(0,0,0,0.18))",
      }}>

        {/* Tab handle */}
        <button
          onClick={() => setOpen(o => !o)}
          title="Change theme"
          style={{
            width:           36,
            background:      "var(--color-primary)",
            border:          "none",
            borderRadius:    "8px 0 0 8px",
            cursor:          "pointer",
            display:         "flex",
            flexDirection:   "column",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             6,
            padding:         "14px 6px",
            writingMode:     "vertical-rl",
            color:           "#fff",
            fontSize:        11,
            fontWeight:      700,
            letterSpacing:   1.5,
            textTransform:   "uppercase",
            fontFamily:      "'Roboto Slab', serif",
          }}
        >
          <span style={{ fontSize: 18 }}>🎨</span>
          {open ? "✕" : "Theme"}
        </button>

        {/* Theme list panel */}
        <div style={{
          width:      180,
          background: "var(--color-surface)",
          borderLeft: "3px solid var(--color-primary)",
          padding:    "20px 16px",
          display:    "flex",
          flexDirection: "column",
          gap:        12,
        }}>
          <p style={{
            margin:       0,
            fontSize:     11,
            fontWeight:   700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color:        "var(--color-text-muted)",
            fontFamily:   "'Open Sans', sans-serif",
          }}>Choose Theme</p>

          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => apply(t.id)}
              onMouseEnter={() => setTooltip(t.id)}
              onMouseLeave={() => setTooltip(null)}
              title={t.label}
              style={{
                display:     "flex",
                alignItems:  "center",
                gap:         10,
                background:  active === t.id ? "var(--color-primary-light)" : "transparent",
                border:      active === t.id ? "2px solid var(--color-primary)" : "2px solid transparent",
                borderRadius: 8,
                padding:     "8px 10px",
                cursor:      "pointer",
                transition:  "all 0.18s",
                width:       "100%",
              }}
            >
              {/* Color dots preview */}
              <div style={{ display:"flex", gap:3, flexShrink:0 }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background: t.colors.ring, border:"1.5px solid rgba(0,0,0,0.1)" }} />
                <div style={{ width:14, height:14, borderRadius:"50%", background: t.colors.dot,  border:"1.5px solid rgba(0,0,0,0.1)" }} />
              </div>
              <span style={{
                fontSize:   12,
                fontWeight: active === t.id ? 700 : 500,
                color:      "var(--color-text)",
                fontFamily: "'Open Sans', sans-serif",
                textAlign:  "left",
              }}>{t.label}</span>
              {active === t.id && (
                <span style={{ marginLeft:"auto", color:"var(--color-primary)", fontSize:14 }}>✓</span>
              )}
            </button>
          ))}

          <div style={{
            marginTop:   4,
            paddingTop:  10,
            borderTop:   "1px solid var(--color-border)",
            fontSize:    10,
            color:       "var(--color-text-muted)",
            fontFamily:  "'Open Sans', sans-serif",
            textAlign:   "center",
          }}>
            Saved automatically
          </div>
        </div>
      </div>
    </>
  );
}
