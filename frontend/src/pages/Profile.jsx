import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, BookOpen, ArrowLeft } from "lucide-react";
import { reviewsAPI } from "../api";

const FALLBACK = "https://placehold.co/80x120/4C2E1A/FFF?text=No+Cover";

function Stars({ rating }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i<=rating?"#D49A00":"none"} color={i<=rating?"#D49A00":"#c8b898"} />
      ))}
    </span>
  );
}

export default function Profile() {
  const { name }      = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsAPI.getAll(1, 50).then(({ data }) => {
      setReviews(data.filter(r => r.reviewer_name === decodeURIComponent(name)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [name]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div style={{ background:"#FAF8F5", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        <Link to="/explore" style={{ display:"inline-flex", alignItems:"center", gap:6, color:"#c8860a", textDecoration:"none", fontSize:13, fontWeight:600, marginBottom:24 }}>
          <ArrowLeft size={14} /> Back to Explore
        </Link>

        {/* Profile Header */}
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", borderRadius:12, padding:"32px 36px", marginBottom:28, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:32, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {decodeURIComponent(name)?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>Reviewer Profile</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:"#e8e0d0", marginBottom:8 }}>
              {decodeURIComponent(name)}
            </h1>
            <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
              {[
                { label:"Reviews",    value: reviews.length },
                { label:"Avg Rating", value: avgRating + "/5" },
                { label:"Categories", value: new Set(reviews.map(r=>r.category)).size },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:22, fontWeight:900, color:"#D49A00" }}>{value}</div>
                  <div style={{ fontSize:11, color:"#7a6040", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#1a1208", marginBottom:20 }}>
          Reviews by {decodeURIComponent(name)}
        </h2>

        {loading && <p style={{ color:"#7a6040" }}>Loading…</p>}

        {!loading && reviews.length === 0 && (
          <div style={{ textAlign:"center", padding:48, background:"#ede6d8", borderRadius:12, border:"1px dashed #c8b898" }}>
            <BookOpen size={48} color="#c8b898" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#7a6040" }}>No reviews found for this reviewer.</p>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background:"#fff", borderRadius:10, border:"1px solid #e8dcc8", padding:18, display:"flex", gap:14, boxShadow:"0 2px 8px rgba(76,46,26,0.06)" }}>
              <img src={r.cover || FALLBACK} alt={r.title} style={{ width:60, height:85, objectFit:"cover", borderRadius:6, flexShrink:0, boxShadow:"2px 2px 6px rgba(0,0,0,0.15)" }} onError={e=>e.target.src=FALLBACK} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:14, fontWeight:700, color:"#1a1208", marginBottom:3 }}>{r.title}</div>
                <div style={{ fontSize:12, color:"#7a6040", marginBottom:5 }}>by {r.author}</div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:5 }}>
                  <Stars rating={r.rating} />
                  <span style={{ fontSize:11, color:"#c8860a" }}>{r.rating}/5</span>
                </div>
                <span style={{ fontSize:10, background:"#e8dcc8", padding:"1px 6px", borderRadius:10, color:"#5a4020" }}>{r.category}</span>
                <p style={{ fontSize:12, color:"#5a4020", lineHeight:1.5, marginTop:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{r.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}