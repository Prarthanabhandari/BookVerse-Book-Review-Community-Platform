import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ArrowRight, BookOpen, Users, PenTool } from "lucide-react";
import { reviewsAPI } from "../api";

const FILTERS = ["All","Productivity","Sci-Fi","Psychology","Fiction","History"];

function StarRating({ rating }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13}
          fill={i<=rating?"#D49A00":"none"}
          color={i<=rating?"#D49A00":"#ccc"} />
      ))}
    </span>
  );
}

function AnimatedCount({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps=50, duration=1500;
    const increment = target/steps;
    let current=0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration/steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const FALLBACK = (title) =>
  `https://placehold.co/80x110/8B4513/FFF?text=${encodeURIComponent(title?.slice(0,6)||"Book")}`;

export default function Home() {
  const navigate = useNavigate();

  const [featured,     setFeatured]     = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [stats,        setStats]        = useState({ reviews:0, members:0, authors:0 });
  const [loading,      setLoading]      = useState(true);
  const [backendDown,  setBackendDown]  = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and featured in parallel
        const [statsData, featuredData] = await Promise.all([
          reviewsAPI.getStats(),
          reviewsAPI.getFeatured(),
        ]);
        setStats(statsData || { reviews:0, members:0, authors:0 });
        // getFeatured returns array directly
        const arr = Array.isArray(featuredData) ? featuredData : [];
        setFeatured(arr);
        setBackendDown(false);
      } catch (err) {
        console.error("Backend not running:", err.message);
        setBackendDown(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by genre pill
  const displayed = activeFilter === "All"
    ? featured
    : featured.filter(r =>
        r.category?.toLowerCase().includes(activeFilter.toLowerCase())
      );

  return (
    <div>

      {/* ── HERO ── */}
      <section style={{ background:"linear-gradient(135deg,#1a1208 0%,#3a2710 50%,#2a1c0a 100%)", minHeight:420, display:"flex", alignItems:"center", padding:"60px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="hero-grid">
          <div>
            <div style={{ fontSize:11, letterSpacing:3, color:"#c8860a", textTransform:"uppercase", marginBottom:16, fontWeight:600 }}>📚 Your Reading Community</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:"#e8e0d0", lineHeight:1.15, marginBottom:20 }}>
              BookVerse: Your Story,<br /><span style={{ color:"#c8860a" }}>Your Reviews.</span>
            </h1>
            <p style={{ color:"#a89070", fontSize:16, lineHeight:1.8, marginBottom:32, maxWidth:460 }}>
              Share your voice. Read real reviews from a community that loves books.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <Link to="/write" style={{ background:"linear-gradient(180deg,#e09a12,#b07208)", color:"#fff", padding:"13px 28px", borderRadius:6, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1, display:"flex", alignItems:"center", gap:8 }}>
                START REVIEWING TODAY <ArrowRight size={16} />
              </Link>
              <Link to="/explore" style={{ background:"transparent", border:"1px solid #4a3010", color:"#c8c0a8", padding:"13px 28px", borderRadius:6, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14 }}>
                EXPLORE REVIEWS
              </Link>
            </div>
          </div>

          {/* Live stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { icon:<BookOpen size={28} color="#c8860a" />, label:"REVIEWS",    value:stats.reviews, suffix:"+" },
              { icon:<Users size={28} color="#c8860a" />,   label:"MEMBERS",    value:stats.members, suffix:"+" },
              { icon:<Star size={28} color="#c8860a" />,    label:"AVG RATING", value:4.6,           suffix:"/5", fixed:true },
              { icon:<PenTool size={28} color="#c8860a" />, label:"AUTHORS",    value:stats.authors, suffix:"+" },
            ].map(({ icon, label, value, suffix, fixed }) => (
              <div key={label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid #3a2710", borderRadius:10, padding:"20px 16px", textAlign:"center" }}>
                {icon}
                <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, fontWeight:900, color:"#e8dcc8", marginTop:8 }}>
                  {fixed ? `${value}${suffix}` : <AnimatedCount target={value} suffix={suffix} />}
                </div>
                <div style={{ fontSize:12, color:"#7a6040", marginTop:2, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COMMUNITY REVIEWS ── */}
      <section style={{ background:"#FAF8F5", padding:"70px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#2a1c0a", marginBottom:8 }}>
              Featured Community Reviews
            </h2>
            <p style={{ color:"#7a6040", fontSize:15 }}>Hand-picked reviews from our most passionate readers</p>
          </div>

          {/* Filter Pills */}
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:40 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding:"8px 20px", borderRadius:999, border:"1px solid #d4c4a8",
                background: activeFilter===f ? "linear-gradient(180deg,#D49A00,#B07D00)" : "transparent",
                color: activeFilter===f ? "#fff" : "#5a4020",
                fontFamily:"'Open Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer",
              }}>{f}</button>
            ))}
          </div>

          {/* Backend down warning */}
          {backendDown && (
            <div style={{ background:"#fff8e1", border:"1px solid #ffe082", borderRadius:8, padding:"14px 20px", marginBottom:24, textAlign:"center" }}>
              <p style={{ color:"#856404", fontSize:13, fontWeight:600 }}>
                ⚠️ Backend not running — start it with <code style={{ background:"#f5f5f5", padding:"2px 6px", borderRadius:4 }}>node server.js</code> in your backend folder
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:"center", padding:"48px", color:"#7a6040" }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📚</div>
              <p>Loading featured reviews…</p>
            </div>
          )}

          {/* Empty state — no featured reviews */}
          {!loading && !backendDown && displayed.length === 0 && (
            <div style={{ textAlign:"center", padding:"64px 24px", background:"#ede6d8", borderRadius:16, border:"1px dashed #c8b898" }}>
              <BookOpen size={48} color="#c8b898" style={{ margin:"0 auto 16px" }} />
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#1a1208", marginBottom:8 }}>
                {activeFilter === "All" ? "No featured reviews yet" : `No ${activeFilter} reviews featured`}
              </h3>
              <p style={{ color:"#7a6040", marginBottom:20, fontSize:14 }}>
                Go to <strong>Admin Dashboard → Review Moderation</strong> and click ⭐ Feature on any review.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={() => navigate("/admin/dashboard")} style={{ padding:"10px 20px", background:"linear-gradient(180deg,#D49A00,#B07D00)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                  Go to Admin Dashboard
                </button>
                <button onClick={() => navigate("/explore")} style={{ padding:"10px 20px", background:"transparent", border:"1px solid #c8b898", borderRadius:6, color:"#5a4020", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                  Explore All Reviews
                </button>
              </div>
            </div>
          )}

          {/* ── REAL REVIEW CARDS FROM POSTGRESQL ── */}
          {!loading && displayed.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:24, marginBottom:40 }}>
              {displayed.slice(0,6).map(review => (
                <div key={review.id} style={{
                  background:"#fff", borderRadius:12, padding:24,
                  border:"1px solid #f0e8d8",
                  boxShadow:"0 2px 12px rgba(76,46,26,0.06)",
                  transition:"transform 0.3s, box-shadow 0.3s",
                  cursor:"pointer", display:"flex", flexDirection:"column", gap:12,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(76,46,26,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 2px 12px rgba(76,46,26,0.06)"; }}
                  onClick={() => navigate(`/review/${review.id}`)}
                >
                  {/* Book info */}
                  <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    <img
                      src={review.cover || FALLBACK(review.title)}
                      alt={review.title}
                      style={{ width:80, height:110, borderRadius:6, objectFit:"cover", flexShrink:0, boxShadow:"2px 2px 8px rgba(0,0,0,0.15)" }}
                      onError={e => { e.target.src = FALLBACK(review.title); }}
                    />
                    <div>
                      <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:16, fontWeight:700, color:"#2a1c0a", lineHeight:1.3, marginBottom:4 }}>
                        {review.title}
                      </div>
                      <div style={{ fontSize:12, color:"#7a6040", marginBottom:8 }}>by {review.author}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <StarRating rating={review.rating} />
                        <span style={{ fontSize:12, color:"#7a6040", fontWeight:600 }}>{review.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviewer */}
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {review.reviewer_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#2a1c0a" }}>{review.reviewer_name}</div>
                      <div style={{ fontSize:10, color:"#2a8a5a", fontWeight:700 }}>✓ Verified Reader</div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p style={{ fontSize:13, color:"#5a4020", lineHeight:1.7, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", flex:1, margin:0 }}>
                    {review.excerpt || review.content}
                  </p>

                  {/* Read Full Review — links to /review/:id */}
                  <Link
                    to={`/review/${review.id}`}
                    onClick={e => e.stopPropagation()}
                    style={{ color:"#1a6b5a", fontSize:13, fontWeight:600, textDecoration:"underline" }}
                  >
                    Read Full Review →
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign:"center", marginTop: displayed.length > 0 ? 0 : 24 }}>
            <Link to="/explore" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(180deg,#D49A00,#B07D00)", color:"#fff", padding:"16px 48px", borderRadius:8, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:14, letterSpacing:2, textTransform:"uppercase" }}>
              VIEW ALL REVIEWS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── YOUR TURN TO SHINE ── */}
      <section style={{ padding:"80px 24px", background:"#FDFBF7" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,48px)", fontWeight:900, color:"#4C2E1A", marginBottom:14 }}>Your Turn to Shine</h2>
            <p style={{ color:"#7a6a5a", fontSize:16, fontWeight:500, maxWidth:500, margin:"0 auto" }}>Three simple steps to become part of the BookVerse community</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:32, marginBottom:50 }}>
            {[
              { step:1, icon:"👤", title:"Create an account", desc:"Sign up free and join thousands of readers.",               link:"/signup",  linkText:"Go to Create Account" },
              { step:2, icon:"🔍", title:"Find a book",       desc:"Browse thousands of titles across every genre.",            link:"/explore", linkText:"Go to Find Book" },
              { step:3, icon:"✍️", title:"Write your review", desc:"Share your thoughts and help others discover great books.", link:"/write",   linkText:"Go to Write Review" },
            ].map(({ step, icon, title, desc, link, linkText }) => (
              <div key={step} onClick={() => navigate(link)} style={{
                background:"#fff", borderRadius:16, padding:"36px 28px 28px",
                boxShadow:"0 4px 20px rgba(76,46,26,0.08)", border:"1px solid #f0e8d8",
                cursor:"pointer", transition:"transform 0.3s, box-shadow 0.3s",
                position:"relative", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(76,46,26,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 4px 20px rgba(76,46,26,0.08)"; }}
              >
                <div style={{ position:"absolute", top:16, left:16, width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>{step}</div>
                <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#FFF3CC,#FFE080)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20 }}>{icon}</div>
                <h3 style={{ fontFamily:"'Roboto Slab',serif", fontSize:20, fontWeight:700, color:"#4C2E1A", marginBottom:10 }}>{title}</h3>
                <p style={{ color:"#7a6a5a", fontSize:14, lineHeight:1.7, marginBottom:20, flex:1 }}>{desc}</p>
                <span style={{ color:"#1a6b5a", fontSize:13, fontWeight:600, textDecoration:"underline" }}>{linkText}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <Link to="/signup" style={{ display:"inline-block", background:"linear-gradient(180deg,#D49A00,#B07D00)", color:"#fff", padding:"16px 48px", borderRadius:8, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:15, letterSpacing:2, textTransform:"uppercase" }}>
              START THE JOURNEY
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){ .hero-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}



