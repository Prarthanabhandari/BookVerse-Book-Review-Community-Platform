import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form,  setForm]  = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate("/");
    else setError(result.error);
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1px solid #c8b898", borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208", outline:"none", fontFamily:"'Open Sans',sans-serif", marginBottom:16 };
  const lbl = { fontSize:12, fontWeight:600, color:"#5a4020", textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:6 };

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", background:"linear-gradient(135deg,#1a1208,#3a2710)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#ede6d8", borderRadius:12, padding:"40px 36px", width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <BookOpen size={40} color="#c8860a" style={{ margin:"0 auto 8px" }} />
          <h1 style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, fontWeight:900, color:"#1a1208" }}>
            Join <span style={{ color:"#c8860a" }}>BOOK</span>IDA
          </h1>
          <p style={{ color:"#7a6040", fontSize:14, marginTop:6 }}>Start sharing your reviews today</p>
        </div>

        {error && <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[["name","Your Name","text","John Smith"],["email","Email","email","you@example.com"],["password","Password","password","Min 6 characters"]].map(([key,label,type,ph]) => (
            <div key={key}>
              <label style={lbl}>{label}</label>
              <input type={type} style={inp} placeholder={ph} value={form[key]} onChange={set(key)} required />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:"100%", padding:"12px", background:loading?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {loading ? <><Loader size={16} className="spin" /> Creating account…</> : "CREATE ACCOUNT"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#7a6040" }}>
          Already have an account? <Link to="/login" style={{ color:"#c8860a", fontWeight:600, textDecoration:"none" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}