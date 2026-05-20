import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { reviewsAPI } from "../api";

export default function AllReviewers() {
  const [reviewers, setReviewers] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    // Get all reviews and group by reviewer name
    reviewsAPI.getAll(1, 100).then(({ data }) => {
      const map = {};
      (data || []).forEach(r => {
        const name = r.reviewer_name || "Anonymous";
        if (!map[name]) {
          map[name] = {
            name,
            reviewer_id: r.reviewer_id,
            count: 0,
            totalRating: 0,
            latest: r.created_at,
          };
        }
        map[name].count++;
        map[name].totalRating += r.rating || 0;
        if (r.created_at > map[name].latest) map[name].latest = r.created_at;
      });
      const sorted = Object.values(map).sort((a, b) => b.count - a.count);
      setReviewers(sorted);
    }).catch(() => setReviewers([]))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }); }
    catch { return "—"; }
  };

  return (
    <div style={{ background:"#FAF8F5", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        <Link to="/explore" style={{ display:"inline-flex", alignItems:"center", gap:6, color:"#c8860a", textDecoration:"none", fontSize:13, fontWeight:600, marginBottom:28 }}>
          <ArrowLeft size={14} /> Back to Explore
        </Link>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", borderRadius:12, padding:"28px 32px", marginBottom:28 }}>
          <div style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>Community</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:"#e8e0d0", margin:0 }}>
            All Reviewers
          </h1>
          <p style={{ color:"#a89070", fontSize:14, marginTop:8 }}>
            {reviewers.length} reviewer{reviewers.length !== 1 ? "s" : ""} in our community — including guests
          </p>
        </div>

        {loading ? (
          <p style={{ color:"#7a6040", textAlign:"center", padding:"40px" }}>Loading reviewers…</p>
        ) : reviewers.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px", background:"#ede6d8", borderRadius:12, border:"1px dashed #c8b898" }}>
            <p style={{ color:"#7a6040", fontSize:15 }}>No reviewers yet. Be the first!</p>
            <Link to="/write" style={{ color:"#c8860a", fontWeight:600 }}>Write a Review →</Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
            {reviewers.map((rev, i) => {
              const avgRating = rev.count > 0 ? (rev.totalRating / rev.count).toFixed(1) : "—";
              const isGuest = !rev.reviewer_id;
              return (
                <div key={rev.name} style={{
                  background:"#fff", borderRadius:12, border:"1px solid #e8dcc8",
                  padding:"20px", boxShadow:"0 2px 8px rgba(76,46,26,0.06)",
                  display:"flex", gap:16, alignItems:"flex-start",
                  transition:"transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(76,46,26,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(76,46,26,0.06)"; }}
                >
                  {/* Rank + Avatar */}
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{
                      width:52, height:52, borderRadius:"50%",
                      background: i < 3
                        ? ["linear-gradient(135deg,#D49A00,#B07D00)","linear-gradient(135deg,#aaa,#888)","linear-gradient(135deg,#c8860a,#8B4513)"][i]
                        : "linear-gradient(135deg,#5a4020,#3a2810)",
                      color:"#fff", fontFamily:"'Roboto Slab',serif",
                      fontWeight:900, fontSize:22,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      {rev.name?.[0]?.toUpperCase()}
                    </div>
                    {i < 3 && (
                      <div style={{ position:"absolute", top:-4, right:-4, width:18, height:18, borderRadius:"50%", background:["#D49A00","#aaa","#c8860a"][i], color:"#fff", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {i+1}
                      </div>
                    )}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:15, fontWeight:700, color:"#1a1208" }}>{rev.name}</div>
                      {isGuest && (
                        <span style={{ fontSize:9, background:"#f0e8d8", padding:"1px 6px", borderRadius:8, color:"#7a6040", fontWeight:600 }}>GUEST</span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:"#c8860a", fontWeight:600, marginBottom:4 }}>
                      {rev.count} review{rev.count !== 1 ? "s" : ""}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={11} fill={s<=Math.round(parseFloat(avgRating))?"#D49A00":"none"} color={s<=Math.round(parseFloat(avgRating))?"#D49A00":"#c8b898"} />
                      ))}
                      <span style={{ fontSize:11, color:"#7a6040" }}>avg {avgRating}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#9a8060" }}>Last review: {fmt(rev.latest)}</div>
                    {!isGuest && (
                      <Link to={`/profile/${encodeURIComponent(rev.name)}`} style={{ fontSize:12, color:"#c8860a", textDecoration:"none", fontWeight:600, marginTop:6, display:"inline-block" }}>
                        View Profile →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}