import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import { reviewsAPI } from "../api";

export default function Contact() {
  const [form,       setForm]       = useState({ name:"", email:"", message:"" });
  const [sent,       setSent]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      await reviewsAPI.submitContact(form);
      setSent(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally { setSubmitting(false); }
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid #c8b898", borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208", outline:"none", fontFamily:"'Open Sans',sans-serif", marginTop:6, marginBottom:16 };
  const lbl = { fontSize:12, fontWeight:600, color:"#5a4020", textTransform:"uppercase", letterSpacing:0.5 };

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)", padding:"60px 24px" }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:700, color:"#1a1208", textAlign:"center", marginBottom:8 }}>Get in Touch</h1>
        <p style={{ color:"#7a6040", textAlign:"center", marginBottom:40 }}>Have a question or feedback? We'd love to hear from you.</p>

        {sent ? (
          <div style={{ background:"#ede6d8", borderRadius:10, padding:40, border:"1px solid #c8b898", textAlign:"center" }}>
            <CheckCircle size={48} color="#2a6a2a" style={{ margin:"0 auto 16px" }} />
            <h2 style={{ fontFamily:"'Roboto Slab',serif", fontSize:22, color:"#1a1208" }}>Message Sent!</h2>
            <p style={{ color:"#7a6040", marginTop:8 }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <div style={{ background:"#ede6d8", borderRadius:10, padding:36, border:"1px solid #c8b898" }}>
            {error && <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px", marginBottom:16, color:"#8a1a1a", fontSize:13 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <label style={lbl}>Your Name</label>
              <input style={inp} value={form.name} onChange={set("name")} required placeholder="John Smith" />
              <label style={lbl}>Email Address</label>
              <input type="email" style={inp} value={form.email} onChange={set("email")} required placeholder="you@example.com" />
              <label style={lbl}>Message</label>
              <textarea style={{ ...inp, height:140, resize:"vertical" }} value={form.message} onChange={set("message")} required placeholder="Your message..." />
              <button type="submit" disabled={submitting} style={{ width:"100%", padding:"12px", background:submitting?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:submitting?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {submitting ? <><Loader size={16} style={{ animation:"spin 1s linear infinite" }} /> Sending…</> : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}