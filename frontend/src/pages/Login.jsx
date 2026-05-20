import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form,  setForm]  = useState({ email:"", password:"" });
  const [show,  setShow]  = useState(false);
  const [error, setError] = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError("");
    const result = await login(form.email, form.password);
    if (result.success) navigate("/");
    else setError(result.error);
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid #c8b898", borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208", outline:"none", fontFamily:"'Open Sans',sans-serif" };
  const lbl = { fontSize:12, fontWeight:600, color:"#5a4020", textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:6 };

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"linear-gradient(135deg,#1a1208,#3a2710)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#ede6d8", borderRadius:12, padding:"40px 36px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <BookOpen size={40} color="#c8860a" style={{ margin:"0 auto 8px" }} />
          <h1 style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, fontWeight:900, color:"#1a1208" }}>
            <span style={{ color:"#c8860a" }}>BOOK</span>VERSE
          </h1>
          <p style={{ color:"#7a6040", fontSize:14, marginTop:6 }}>Welcome back, reader</p>
        </div>

        {error && <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Email</label>
            <input type="email" style={inp} placeholder="you@example.com" value={form.email} onChange={set("email")} required />
          </div>
          <div style={{ marginBottom:24, position:"relative" }}>
            <label style={lbl}>Password</label>
            <input type={show?"text":"password"} style={{ ...inp, paddingRight:42 }} placeholder="••••••••" value={form.password} onChange={set("password")} required />
            <button type="button" onClick={() => setShow(!show)} style={{ position:"absolute", right:12, top:34, background:"none", border:"none", cursor:"pointer", color:"#7a6040" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" disabled={loading} style={{ width:"100%", padding:"12px", background:loading?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading ? <><Loader size={16} className="spin" /> Logging in…</> : "LOGIN"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#7a6040" }}>
          Don't have an account? <Link to="/signup" style={{ color:"#c8860a", fontWeight:600, textDecoration:"none" }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}