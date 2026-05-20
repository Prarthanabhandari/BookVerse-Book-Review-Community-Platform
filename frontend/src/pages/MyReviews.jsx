import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Trash2, Edit, BookOpen, Plus, AlertCircle, Loader } from "lucide-react";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const FALLBACK_COVER = "https://placehold.co/80x120/4C2E1A/FFF?text=No+Cover";

function StarRating({ rating }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12}
          fill={i <= rating ? "#D49A00" : "none"}
          color={i <= rating ? "#D49A00" : "#c8b898"} />
      ))}
    </span>
  );
}

export default function MyReviews() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [reviews,   setReviews]  = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [deleting,  setDeleting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadMyReviews();
  }, [user]);

  const loadMyReviews = async () => {
    setLoading(true);
    try {
      const { data } = await reviewsAPI.getMyReviews();
      setReviews(data);
    } catch {
      setError("Could not load your reviews. Make sure backend is running.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await reviewsAPI.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      setDeleteConfirm(null);
    } catch {
      setError("Could not delete review. Please try again.");
    } finally { setDeleting(null); }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", {
    year:"numeric", month:"long", day:"numeric"
  });

  if (loading) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#FAF8F5" }}>
      <div style={{ textAlign:"center" }}>
        <Loader size={40} color="#D49A00" style={{ animation:"spin 1s linear infinite", margin:"0 auto 16px" }} />
        <p style={{ color:"#7a6040" }}>Loading your reviews…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#FAF8F5", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* ── Dashboard Header ── */}
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", borderRadius:12, padding:"32px 36px", marginBottom:32, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>
              Private Dashboard
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,4vw,36px)", fontWeight:900, color:"#e8e0d0", marginBottom:6 }}>
              My Reading Legacy
            </h1>
            <p style={{ color:"#a89070", fontSize:14 }}>
              Welcome back, <strong style={{ color:"#D49A00" }}>{user?.name}</strong>
              {" · "}{reviews.length} review{reviews.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Link to="/write" style={{
            display:"flex", alignItems:"center", gap:8,
            background:"linear-gradient(180deg,#D49A00,#B07D00)",
            color:"#fff", padding:"12px 24px", borderRadius:8,
            textDecoration:"none", fontFamily:"'Roboto Slab',serif",
            fontWeight:700, fontSize:14, letterSpacing:1, whiteSpace:"nowrap",
          }}>
            <Plus size={16} /> WRITE NEW REVIEW
          </Link>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:32 }}>
          {[
            { label:"Total Reviews", value:reviews.length },
            { label:"Avg Rating",    value: reviews.length > 0 ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1) + "/5" : "—" },
            { label:"Categories",   value: new Set(reviews.map(r => r.category)).size },
            { label:"Latest",       value: reviews.length > 0 ? new Date(reviews[0].created_at).toLocaleDateString("en-US",{month:"short",year:"numeric"}) : "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:"#ede6d8", borderRadius:10, padding:"18px 20px", border:"1px solid #c8b898", textAlign:"center" }}>
              <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:22, fontWeight:900, color:"#1a1208" }}>{value}</div>
              <div style={{ fontSize:11, color:"#7a6040", marginTop:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ display:"flex", gap:8, alignItems:"center", background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && reviews.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 24px", background:"#ede6d8", borderRadius:16, border:"2px dashed #c8b898" }}>
            <BookOpen size={64} color="#c8b898" style={{ margin:"0 auto 20px" }} />
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#4C2E1A", marginBottom:12 }}>
              Your Digital Library Awaits
            </h2>
            <p style={{ color:"#7a6040", fontSize:15, maxWidth:400, margin:"0 auto 28px", lineHeight:1.7 }}>
              You haven't written any reviews yet. Start your digital legacy today — every book you read becomes a permanent insight.
            </p>
            <Link to="/write" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"linear-gradient(180deg,#D49A00,#B07D00)",
              color:"#fff", padding:"14px 32px", borderRadius:8,
              textDecoration:"none", fontFamily:"'Roboto Slab',serif",
              fontWeight:700, fontSize:14, letterSpacing:1,
            }}>
              <Plus size={16} /> WRITE YOUR FIRST REVIEW
            </Link>
          </div>
        )}

        {/* ── Reviews Grid ── */}
        {reviews.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20 }}>
            {reviews.map(review => (
              <div key={review.id} style={{
                background:"#fff",
                borderRadius:12,
                border:"1px solid #e8dcc8",
                boxShadow:"0 2px 12px rgba(76,46,26,0.06)",
                overflow:"hidden",
                transition:"transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(76,46,26,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 2px 12px rgba(76,46,26,0.06)"; }}
              >
                {/* Card Top */}
                <div style={{ display:"flex", gap:14, padding:"20px 20px 14px" }}>
                  <img
                    src={review.cover || FALLBACK_COVER}
                    alt={review.title}
                    style={{ width:70, height:100, objectFit:"cover", borderRadius:6, flexShrink:0, boxShadow:"2px 2px 8px rgba(0,0,0,0.2)" }}
                    onError={e => { e.target.src = FALLBACK_COVER; }}
                  />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:16, fontWeight:700, color:"#1a1208", lineHeight:1.3, marginBottom:4 }}>
                      {review.title}
                    </div>
                    <div style={{ fontSize:12, color:"#7a6040", marginBottom:8 }}>
                      by {review.author}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                      <StarRating rating={review.rating} />
                      <span style={{ fontSize:11, color:"#c8860a", fontWeight:600 }}>{review.rating}/5</span>
                    </div>
                    <span style={{ fontSize:10, background:"#e8dcc8", padding:"2px 8px", borderRadius:12, color:"#5a4020", fontWeight:600 }}>
                      {review.category}
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div style={{ padding:"0 20px 14px" }}>
                  <p style={{ fontSize:13, color:"#5a4020", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {review.excerpt}
                  </p>
                </div>

                {/* Date + Actions */}
                <div style={{ padding:"12px 20px", borderTop:"1px solid #f0e8d8", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#FAF8F5" }}>
                  <span style={{ fontSize:11, color:"#7a6040" }}>
                    📅 {formatDate(review.created_at)}
                  </span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button
                      onClick={() => navigate(`/edit/${review.id}`)}
                      style={{
                        display:"flex", alignItems:"center", gap:4,
                        padding:"6px 12px", borderRadius:6,
                        border:"1px solid #D49A00", background:"transparent",
                        color:"#D49A00", fontSize:12, fontWeight:600, cursor:"pointer",
                      }}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(review.id)}
                      style={{
                        display:"flex", alignItems:"center", gap:4,
                        padding:"6px 12px", borderRadius:6,
                        border:"1px solid #e74c3c", background:"transparent",
                        color:"#e74c3c", fontSize:12, fontWeight:600, cursor:"pointer",
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === review.id && (
                  <div style={{ padding:"14px 20px", background:"#fde8e8", borderTop:"1px solid #f5c0c0" }}>
                    <p style={{ fontSize:13, color:"#8a1a1a", marginBottom:10, fontWeight:600 }}>
                      Are you sure you want to delete this review?
                    </p>
                    <div style={{ display:"flex", gap:8 }}>
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deleting === review.id}
                        style={{ flex:1, padding:"8px", background:"#e74c3c", border:"none", borderRadius:6, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                      >
                        {deleting === review.id ? <Loader size={12} style={{ animation:"spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                        {deleting === review.id ? "Deleting…" : "Yes, Delete"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{ flex:1, padding:"8px", background:"transparent", border:"1px solid #c8b898", borderRadius:6, color:"#5a4020", fontSize:12, fontWeight:600, cursor:"pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}