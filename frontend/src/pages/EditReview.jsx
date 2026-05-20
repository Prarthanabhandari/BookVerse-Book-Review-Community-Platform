import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Loader, RefreshCw, BookOpen } from "lucide-react";
import { reviewsAPI } from "../api";
import { CATEGORIES } from "../mockData";
import { useAuth } from "../context/AuthContext";

const FALLBACK_COVER = "https://placehold.co/120x180/4C2E1A/FFF?text=No+Cover";

export default function EditReview() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({ title:"", author:"", rating:0, category:"", content:"", cover:"" });
  const [hover,        setHover]       = useState(0);
  const [loading,      setLoading]     = useState(true);
  const [submitting,   setSub]         = useState(false);
  const [error,        setError]       = useState("");
  const [success,      setSuccess]     = useState(false);
  const [coverPreview, setCoverPreview]= useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    reviewsAPI.getById(id).then(review => {
      // Check ownership
      if (review.reviewer_id !== user.id && user.role !== "admin") {
        navigate("/explore"); return;
      }
      setForm({
        title:    review.title    || "",
        author:   review.author   || "",
        rating:   review.rating   || 0,
        category: review.category || "",
        content:  review.content  || "",
        cover:    review.cover    || "",
      });
      setCoverPreview(review.cover || "");
    }).catch(() => navigate("/explore"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) { setError("Please select a rating"); return; }
    setSub(true); setError("");
    try {
      await reviewsAPI.update(id, form);
      setSuccess(true);
      setTimeout(() => navigate(`/review/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update. Please try again.");
    } finally { setSub(false); }
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid #c8b898", borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208", outline:"none", fontFamily:"'Open Sans',sans-serif", marginTop:6 };
  const lbl = { fontSize:12, fontWeight:600, color:"#5a4020", textTransform:"uppercase", letterSpacing:0.5 };

  if (loading) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f0e8" }}>
      <Loader size={36} color="#D49A00" style={{ animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (success) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f0e8" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, color:"#1a1208" }}>Review Updated!</h2>
        <p style={{ color:"#7a6040", marginTop:8 }}>Redirecting to your review…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:"#1a1208", marginBottom:4 }}>Edit Review</h1>
        <p style={{ color:"#7a6040", marginBottom:28 }}>Editing: <strong style={{ color:"#c8860a" }}>{form.title}</strong></p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:24, alignItems:"start" }} className="write-grid">
          <div style={{ background:"#ede6d8", borderRadius:10, padding:32, border:"1px solid #c8b898" }}>
            {error && <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div><label style={lbl}>Book Title *</label><input style={inp} value={form.title} onChange={set("title")} required /></div>
                <div><label style={lbl}>Author *</label><input style={inp} value={form.author} onChange={set("author")} required /></div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div>
                  <label style={lbl}>Category *</label>
                  <select style={inp} value={form.category} onChange={set("category")} required>
                    <option value="">— Select —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Rating *</label>
                  <div style={{ display:"flex", gap:6, marginTop:14 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={26} style={{ cursor:"pointer" }}
                        fill={i<=(hover||form.rating)?"#D49A00":"none"}
                        color={i<=(hover||form.rating)?"#D49A00":"#c8b898"}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setForm(f => ({ ...f, rating:i }))}
                      />
                    ))}
                    {form.rating > 0 && <span style={{ fontSize:12, color:"#c8860a", alignSelf:"center" }}>{form.rating}/5</span>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Cover URL</label>
                <input style={inp} value={form.cover} onChange={e => { set("cover")(e); setCoverPreview(e.target.value); }} placeholder="https://covers.openlibrary.org/..." />
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={lbl}>Your Review *</label>
                <textarea style={{ ...inp, height:180, resize:"vertical" }} value={form.content} onChange={set("content")} required />
                <p style={{ fontSize:11, color:"#7a6040", marginTop:4 }}>{form.content.length} characters</p>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button type="button" onClick={() => navigate(`/review/${id}`)} style={{ flex:1, padding:"12px", background:"transparent", border:"1px solid #c8b898", borderRadius:6, color:"#5a4020", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{ flex:2, padding:"12px", background:submitting?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, cursor:submitting?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {submitting ? <><Loader size={16} style={{ animation:"spin 1s linear infinite" }} /> Updating…</> : "UPDATE REVIEW"}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div style={{ background:"#ede6d8", borderRadius:10, padding:20, border:"1px solid #c8b898", position:"sticky", top:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#5a4020", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>📖 Live Preview</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" style={{ width:110, height:160, objectFit:"cover", borderRadius:8, boxShadow:"4px 4px 14px rgba(0,0,0,0.2)" }} onError={e => e.target.src=FALLBACK_COVER} />
              ) : (
                <div style={{ width:110, height:160, borderRadius:8, background:"linear-gradient(135deg,#4C2E1A,#8B4513)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <BookOpen size={32} color="#D49A00" />
                </div>
              )}
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:14, fontWeight:700, color:"#1a1208" }}>{form.title || "Title"}</div>
              <div style={{ fontSize:12, color:"#7a6040", marginTop:3 }}>{form.author ? `by ${form.author}` : "Author"}</div>
              {form.rating > 0 && (
                <div style={{ display:"flex", justifyContent:"center", gap:2, marginTop:6 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<=form.rating?"#D49A00":"none"} color={i<=form.rating?"#D49A00":"#c8b898"} />)}
                </div>
              )}
              {form.category && <span style={{ fontSize:10, background:"#c8b898", padding:"2px 8px", borderRadius:3, color:"#5a4020", marginTop:6, display:"inline-block" }}>{form.category}</span>}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ .write-grid{ grid-template-columns:1fr !important; } }
        @keyframes spin{ to{ transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}