import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "Mystery & Thrillers", "Literature & Fiction",
  "History", "Business & Investing",
];

export default function Footer() {
  return (
    <footer style={{ background:"#1a1208", borderTop:"2px solid #4a3010", padding:"40px 24px 20px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:32, marginBottom:32 }}>

          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <BookOpen size={24} color="#c8860a" />
              <span style={{ fontFamily:"'Roboto Slab',serif", fontSize:20, fontWeight:900 }}>
                <span style={{ color:"#c8860a" }}>BOOK</span><span style={{ color:"#e8e0d0" }}>VERSE</span>
              </span>
            </div>
            <p style={{ color:"#7a6040", fontSize:13, lineHeight:1.7 }}>
              Your story, your reviews. A community for readers who love to share.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color:"#e8dcc8", fontFamily:"'Roboto Slab',serif", fontSize:13, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Quick Links</h4>
            {[
              ["About",   "/about"],
              ["Explore", "/explore"],
              ["Write",   "/write"],
              ["Contact", "/contact"],
              ["FAQ",     "/about"],
              ["Privacy Policy", "/about"],
            ].map(([label, to]) => (
              <Link key={label} to={to} style={{ display:"block", color:"#7a6040", textDecoration:"none", fontSize:13, marginBottom:7, transition:"color 0.15s" }}
                onMouseEnter={e => e.target.style.color="#c8860a"}
                onMouseLeave={e => e.target.style.color="#7a6040"}
              >{label}</Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color:"#e8dcc8", fontFamily:"'Roboto Slab',serif", fontSize:13, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Categories</h4>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/explore?category=${encodeURIComponent(cat)}`}
                style={{ display:"block", color:"#7a6040", textDecoration:"none", fontSize:13, marginBottom:7, transition:"color 0.15s" }}
                onMouseEnter={e => e.target.style.color="#c8860a"}
                onMouseLeave={e => e.target.style.color="#7a6040"}
              >{cat}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid #2a1c0a", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <p style={{ color:"#4a3820", fontSize:12 }}>© 2024 BookVerse Inc. All rights reserved.</p>
          <div style={{ display:"flex", gap:12 }}>
            {["Terms of Service","Privacy Policy"].map(t => (
              <Link key={t} to="/about" style={{ color:"#4a3820", fontSize:12, textDecoration:"none" }}>{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}