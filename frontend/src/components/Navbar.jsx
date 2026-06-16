import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const baseLinks = [
    { to: "/",        label: "Home"    },
    { to: "/about",   label: "About"   },
    { to: "/explore", label: "Explore" },
    { to: "/write",   label: "Write"   },
    { to: "/contact", label: "Contact" },
  ];

  const links = baseLinks;

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav style={{
      background: "linear-gradient(180deg,#1a1208 0%,#2c1f0e 100%)",
      borderBottom: "2px solid #4a3010",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

        {/* Logo — BOOKVERSE */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <BookOpen size={30} color="#c8860a" />
          <span style={{ fontFamily: "'Roboto Slab',serif", fontSize: 24, fontWeight: 900 }}>
            <span style={{ color: "#c8860a" }}>BOOK</span>
            <span style={{ color: "#e8e0d0" }}>VERSE</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="nav-desktop-links">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: "8px 14px",
              color: isActive(to) ? "#c8860a" : "#e8dcc8",
              textDecoration: "none",
              fontFamily: "'Roboto Slab',serif",
              fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
              background: isActive(to) ? "rgba(200,134,10,0.15)" : "transparent",
              borderRadius: 4,
              transition: "all 0.15s",
            }}>{label}</Link>
          ))}
        </div>

        {/* Dashboard Button */}
        {user && (
          <Link
            to={user.role === "admin" ? "/admin/dashboard" : "/my-reviews"}
            className="nav-desktop-dashboard"
            style={{
              padding: "8px 16px",
              color: "#fff",
              background: "linear-gradient(180deg,#D49A00,#B07D00)",
              textDecoration: "none",
              fontFamily: "'Roboto Slab',serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: 1, textTransform: "uppercase",
              borderRadius: 4,
            }}
          >
            {user.role === "admin" ? "ADMIN DASHBOARD" : "MY DASHBOARD"}
          </Link>
        )}

        {/* Auth Section */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-desktop-auth">
          {user ? (
            <>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(200,134,10,0.12)",
                    border: "1px solid #4a3010",
                    color: "#e8dcc8", padding: "7px 14px", borderRadius: 6,
                    cursor: "pointer", fontSize: 13,
                    fontFamily: "'Roboto Slab',serif", fontWeight: 700,
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: "linear-gradient(135deg,#D49A00,#B07D00)",
                    color: "#fff", fontSize: 12, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  {user.name || "User"}
                  <span style={{ fontSize: 10, color: "#c8860a" }}>▼</span>
                </button>

                {dropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#1a1208", border: "1px solid #4a3010",
                    borderRadius: 8, minWidth: 200, zIndex: 999,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #2a1c0a", background: "#2a1c0a" }}>
                      <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, fontWeight: 700, color: "#e8dcc8" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "#7a6040", marginTop: 2 }}>{user.email}</div>
                    </div>

                    <Link to="/my-reviews" onClick={() => setDropOpen(false)} style={dropdownLinkStyle}>
                      <LayoutDashboard size={15} color="#D49A00" /> My Dashboard
                    </Link>

                    <button
                      onClick={() => { logout(); navigate("/"); setDropOpen(false); }}
                      style={dropdownLogoutStyle}
                    >
                      <LogOut size={15} color="#e74c3c" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {dropOpen && <div onClick={() => setDropOpen(false)} style={backdropStyle} />}
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/signup" style={authBtnStyle(true)}>Signup</Link>
              <Link to="/login"  style={authBtnStyle(false)}>Login</Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} style={mobileBtnStyle} className="nav-mobile-btn">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{ background: "#1a1208", borderTop: "1px solid #4a3010", padding: "8px 24px 16px" }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={mobileLinkStyle(isActive(to))}>
              {label}
            </Link>
          ))}
          {user ? (
            <div style={{ borderTop: "1px solid #2a1c0a", marginTop: 12, paddingTop: 12 }}>
              <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, fontWeight: 700, color: "#c8860a", marginBottom: 4 }}>
                Logged in as {user.name}
              </div>
              <div style={{ fontSize: 11, color: "#7a6040", marginBottom: 12 }}>{user.email}</div>
              
              <Link to={user.role === "admin" ? "/admin/dashboard" : "/my-reviews"} onClick={() => setOpen(false)} style={mobileLinkStyle(isActive(user.role === "admin" ? "/admin/dashboard" : "/my-reviews"))}>
                My Dashboard
              </Link>
              <button onClick={() => { logout(); navigate("/"); setOpen(false); }} style={mobileLogoutStyle}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ borderTop: "1px solid #2a1c0a", marginTop: 12, paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/login" onClick={() => setOpen(false)} style={authBtnStyle(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} style={authBtnStyle(true)}>Signup</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .nav-mobile-btn {
          display: none !important;
        }
        @media(max-width:992px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-desktop-dashboard {
            display: none !important;
          }
          .nav-desktop-auth {
            display: none !important;
          }
          .nav-mobile-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

const dropdownLinkStyle = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "12px 16px", color: "#e8dcc8",
  textDecoration: "none", fontSize: 13, fontWeight: 600,
  borderBottom: "1px solid #2a1c0a", transition: "background 0.15s",
};

const dropdownLogoutStyle = {
  width: "100%", display: "flex", alignItems: "center", gap: 10,
  padding: "12px 16px", color: "#e74c3c", background: "transparent",
  border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left",
};

const backdropStyle = { position: "fixed", inset: 0, zIndex: 998 };

const authBtnStyle = (isSignup) => ({
  background: isSignup ? "linear-gradient(180deg,#e09a12,#b07208)" : "transparent",
  border: isSignup ? "none" : "1px solid #c8860a",
  color: isSignup ? "#fff" : "#c8860a",
  padding: "7px 16px", borderRadius: 4, textDecoration: "none",
  fontFamily: "'Roboto Slab',serif", fontWeight: 700, fontSize: 12
});

const mobileBtnStyle = { display: "none", background: "none", border: "none", color: "#c8860a", cursor: "pointer" };

const mobileLinkStyle = (active) => ({
  display: "block", padding: "10px 0",
  color: active ? "#c8860a" : "#e8dcc8",
  textDecoration: "none", fontFamily: "'Roboto Slab',serif",
  fontSize: 14, fontWeight: 700, borderBottom: "1px solid #2a1c0a",
});

const mobileLogoutStyle = {
  background: "none", border: "none", color: "#e74c3c",
  fontFamily: "'Roboto Slab',serif", fontSize: 14, fontWeight: 700,
  padding: "10px 0", cursor: "pointer", textAlign: "left"
};