import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Loader } from "lucide-react";
import { reviewsAPI } from "../api";
import { CATEGORIES } from "../mockData";
import { useAuth } from "../context/AuthContext";

export default function Write() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ title:"", author:"", rating:0, category:"", content:"", cover:"" });
  const [hover, setHover]   = useState(0);
  const [submitting, setSub] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) { setError("Please select a star rating"); return; }
    setSub(true); setError("");
    try {
      await reviewsAPI.create(form);
      setSuccess(true);
      setTimeout(() => navigate("/explore"), 2000);
    } catch (e) { setError(e.response?.data?.error || "Failed to submit. Make sure backend is running."); }
    finally { setSub(false); }
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid #c8b898", borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208", outline:"none", fontFamily:"'Open Sans',sans-serif", marginTop:6 };
  const lbl = { fontSize:12, fontWeight:600, color:"#5a4020", textTransform:"uppercase", letterSpacing:0.5 };

  if (success) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f0e8" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, color:"#1a1208" }}>Review Submitted!</h2>
        <p style={{ color:"#7a6040", marginTop:8 }}>Redirecting to Explore…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:"#1a1208", marginBottom:8 }}>Write a Review</h1>
        <p style={{ color:"#7a6040", marginBottom:32 }}>Logged in as <strong style={{ color:"#c8860a" }}>{user?.name}</strong></p>
        <div style={{ background:"#ede6d8", borderRadius:10, padding:32, border:"1px solid #c8b898" }}>
          {error && <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              {[["title","Book Title *"],["author","Author Name *"]].map(([k,l]) => (
                <div key={k}><label style={lbl}>{l}</label><input style={inp} value={form[k]} onChange={set(k)} required /></div>
              ))}
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
                <div style={{ display:"flex", gap:6, marginTop:10 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={28} style={{ cursor:"pointer" }}
                      fill={i<=(hover||form.rating)?"#c8860a":"none"} color={i<=(hover||form.rating)?"#c8860a":"#c8b898"}
                      onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
                      onClick={()=>setForm(f=>({...f,rating:i}))} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Cover Image URL (optional)</label>
              <input style={inp} value={form.cover} onChange={set("cover")} placeholder="https://example.com/cover.jpg" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>Your Review *</label>
              <textarea style={{ ...inp, height:160, resize:"vertical" }} value={form.content} onChange={set("content")} required placeholder="Share your honest thoughts..." />
            </div>
            <button type="submit" disabled={submitting} style={{ width:"100%", padding:"13px", background:submitting?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:submitting?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {submitting ? <><Loader size={16} className="spin" /> Posting…</> : "POST REVIEW"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}