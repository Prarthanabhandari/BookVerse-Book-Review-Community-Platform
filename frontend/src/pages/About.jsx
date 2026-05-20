import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Star, Globe, BookMarked, LayoutList, Database } from "lucide-react";
import { reviewsAPI } from "../api";

function AnimatedCount({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const duration = 1500, steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function About() {
  const [stats, setStats] = useState({ reviews:0, members:0, authors:0, countries:40 });

  useEffect(() => {
    reviewsAPI.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)" }}>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", padding:"60px 24px", textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:48, fontWeight:700, color:"#e8e0d0" }}>
          About <span style={{ color:"#c8860a" }}>BookVerse</span>
        </h1>
        <p style={{ color:"#a89070", fontSize:16, marginTop:16, maxWidth:560, margin:"16px auto 0" }}>
          We believe every reader has a story worth sharing.
        </p>
      </div>

      {/* Inspiration & Methodology */}
      <section style={{ background:"#FAF8F5", padding:"70px 24px", borderBottom:"1px solid #e8dcc8" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700 }}>Our Foundation</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:900, color:"#4C2E1A", marginTop:8 }}>
              Inspiration &amp; Methodology
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }} className="about-grid">

            {/* Left */}
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"#D49A00", marginBottom:20, lineHeight:1.3 }}>
                Inspiration: The Digital Second Brain
              </h3>
              <p style={{ fontSize:16, color:"#4C2E1A", lineHeight:1.9, fontFamily:"'Open Sans',sans-serif" }}>
                The idea for BookVerse was born from Derek Sivers' fantastic approach to personal{" "}
                <strong style={{ color:"#4C2E1A" }}>knowledge management.</strong>{" "}
                His meticulous notes, ratings, and methodical organization proved that a shared
                library can be more than just a list —{" "}
                it can be a <strong style={{ color:"#4C2E1A" }}>permanent digital legacy.</strong>
              </p>
              <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  "Every book you read becomes a structured insight",
                  "Ratings and categories create a personal knowledge map",
                  "Your reviews help others make better reading choices",
                ].map((point, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, fontFamily:"'Roboto Slab',serif" }}>{i+1}</div>
                    <p style={{ fontSize:14, color:"#5a4020", lineHeight:1.7 }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Timeline */}
            <div style={{ position:"relative", paddingLeft:24 }}>
              <div style={{ position:"absolute", left:60, top:20, bottom:20, width:2, background:"linear-gradient(180deg,#D49A00,#B07D00)", borderRadius:2 }} />
              {[
                { num:1, label:"Note-taking",      title:"Methodical Notes", subtitle:"Inspired Methodology", icon:<BookMarked size={32} color="#4C2E1A" strokeWidth={1.5} /> },
                { num:2, label:"Organization",     title:"Rating & Category", subtitle:"Structured Learning",  icon:<LayoutList size={32} color="#4C2E1A" strokeWidth={1.5} /> },
                { num:3, label:"Relational Access",title:"Permanent Recall",  subtitle:"Digital Legacy",       icon:<Database   size={32} color="#4C2E1A" strokeWidth={1.5} /> },
              ].map(({ num, label, title, subtitle, icon }) => (
                <div key={num} style={{ display:"flex", alignItems:"center", gap:24, marginBottom:40, position:"relative" }}>
                  <div style={{ width:80, display:"flex", flexDirection:"column", alignItems:"center", gap:6, flexShrink:0 }}>
                    <div style={{ width:60, height:60, borderRadius:10, background:"#FFF3CC", border:"1px solid #e8d890", display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
                    <span style={{ fontSize:10, color:"#7a6040", fontWeight:600, textAlign:"center", letterSpacing:0.3 }}>{label}</span>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1, boxShadow:"0 2px 8px rgba(212,154,0,0.4)" }}>{num}</div>
                  <div>
                    <div style={{ fontSize:11, color:"#7a6040", letterSpacing:0.5, textTransform:"uppercase", marginBottom:3 }}>{subtitle}</div>
                    <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:18, fontWeight:700, color:"#4C2E1A" }}>{title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"60px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <span style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700 }}>Live Numbers</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:"#1a1208", marginTop:8 }}>
            BookVerse by the Numbers
          </h2>
          <p style={{ color:"#7a6040", fontSize:14, marginTop:6 }}>Real-time stats from our PostgreSQL database — updates as our community grows</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:24, marginBottom:60 }}>
          {[
            { icon:<BookOpen size={40} color="#c8860a" />, value:stats.reviews,  suffix:"+", label:"Reviews",  desc:"Honest reviews from real readers",    live:true  },
            { icon:<Users   size={40} color="#c8860a" />, value:stats.members,  suffix:"+", label:"Members",  desc:"A passionate global community",        live:true  },
            { icon:<Star    size={40} color="#c8860a" />, value:stats.authors,  suffix:"+", label:"Authors",  desc:"Books across every genre",             live:true  },
            { icon:<Globe   size={40} color="#c8860a" />, value:stats.countries,suffix:"+", label:"Countries",desc:"Readers from around the world",         live:false },
          ].map(({ icon, value, suffix, label, desc, live }) => (
            <div key={label} style={{ background:"#ede6d8", borderRadius:12, padding:28, border:"1px solid #c8b898", textAlign:"center", position:"relative", overflow:"hidden" }}>
              {live && (
                <div style={{ position:"absolute", top:10, right:10, display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#2a8a5a", animation:"pulse 2s infinite" }} />
                  <span style={{ fontSize:9, color:"#2a8a5a", fontWeight:700, letterSpacing:0.5 }}>LIVE</span>
                </div>
              )}
              <div style={{ marginBottom:14 }}>{icon}</div>
              <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:32, fontWeight:900, color:"#1a1208" }}>
                <AnimatedCount target={value} suffix={suffix} />
              </div>
              <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:14, fontWeight:700, color:"#c8860a", marginTop:4, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
              <div style={{ fontSize:12, color:"#7a6040", marginTop:6 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background:"#ede6d8", borderRadius:10, padding:40, border:"1px solid #c8b898", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#1a1208", marginBottom:16 }}>Ready to join us?</h2>
          <p style={{ color:"#7a6040", marginBottom:24, lineHeight:1.8 }}>
            Create your free account and start sharing reviews with thousands of passionate readers worldwide.
          </p>
          <Link to="/signup" style={{ background:"linear-gradient(180deg,#e09a12,#b07208)", color:"#fff", padding:"12px 32px", borderRadius:6, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1 }}>
            JOIN BOOKVERSE FREE
          </Link>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) { .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
        @keyframes pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.5; transform:scale(1.4); } }
      `}</style>
    </div>
  );
}