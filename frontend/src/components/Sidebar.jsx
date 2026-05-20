import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BLOGROLL = [
  { label: "Development Blog", href: "/about",                       external: false },
  { label: "Documentation",    href: "/about",                       external: false },
  { label: "Plugins",          href: "https://wordpress.org/plugins",external: true  },
  { label: "Suggest Ideas",    href: "/contact",                     external: false },
  { label: "Support Forum",    href: "/contact",                     external: false },
  { label: "Themes",           href: "https://wordpress.org/themes", external: true  },
  { label: "WordPress Planet", href: "https://planet.wordpress.org", external: true  },
];

const W = {
  widget: { background:"#ede6d8", borderRadius:5, overflow:"hidden", border:"1px solid #c8b898" },
  title:  { fontFamily:"'Roboto Slab',serif", fontSize:15, fontWeight:900, color:"#2a1c0a", letterSpacing:1, textTransform:"uppercase", padding:"9px 12px 8px", borderBottom:"1px solid #c8b898", background:"#e4dcc8" },
  body:   { padding:"10px 12px" },
};

function Widget({ title, children }) {
  return (
    <section style={W.widget}>
      <div style={W.title}>{title}</div>
      <div style={W.body}>{children}</div>
    </section>
  );
}

export function LeftSidebar({ recentReviews = [] }) {
  const navigate = useNavigate();
  return (
    <aside style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Widget title="Recent 10 Reviews">
        {recentReviews.length === 0 && (
          <p style={{ fontSize:12, color:"#7a6040", padding:"4px 0" }}>No reviews yet.</p>
        )}
        {recentReviews.map((r, i) => (
          <div
            key={r.id || i}
            onClick={() => navigate(`/review/${r.id}`)}
            style={{ display:"flex", gap:7, alignItems:"flex-start", padding:"5px 0", borderBottom:"1px dotted #c8b898", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(200,134,10,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
          >
            <div style={{ flexShrink:0, width:14, height:14, background:"#8B4513", borderRadius:2, marginTop:2 }} />
            <div>
              <div style={{ fontSize:12, color:"#c8860a", fontWeight:600, lineHeight:1.3 }}>{r.title}</div>
              <div style={{ fontSize:11, color:"#7a6040", lineHeight:1.4 }}>
                by <span style={{ color:"#c8860a" }}>{r.author}</span><br />
                Review by {r.reviewer_name}
              </div>
            </div>
          </div>
        ))}
        {recentReviews.length > 0 && (
          <Link to="/explore" style={{ display:"block", marginTop:8, fontSize:11, color:"#c8860a", textDecoration:"none", fontWeight:600, textAlign:"center", padding:"6px", background:"rgba(200,134,10,0.08)", borderRadius:4 }}>
            See All Reviews →
          </Link>
        )}
      </Widget>

      <Widget title="Blogroll">
        {BLOGROLL.map(b => (
          b.external ? (
            <a key={b.label} href={b.href} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", borderBottom:"1px dotted #c8b898", fontSize:12, color:"#c8860a", textDecoration:"none" }}>
              <ChevronRight size={11} color="#7a6040" />{b.label}
            </a>
          ) : (
            <Link key={b.label} to={b.href}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", borderBottom:"1px dotted #c8b898", fontSize:12, color:"#c8860a", textDecoration:"none" }}>
              <ChevronRight size={11} color="#7a6040" />{b.label}
            </Link>
          )
        ))}
      </Widget>
    </aside>
  );
}

export function RightSidebar({ reviewers = [], archives = [], categories = [], onCategoryClick }) {
  const navigate = useNavigate();

  return (
    <aside style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <Widget title="Top 5 Reviewers">
        {reviewers.length === 0 && (
          <p style={{ fontSize:12, color:"#7a6040" }}>No reviewers yet.</p>
        )}
        {reviewers.map(rev => (
          <div
            key={rev.id || rev.name}
            onClick={() => navigate(`/profile/${encodeURIComponent(rev.name)}`)}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0", borderBottom:"1px dotted #c8b898", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(200,134,10,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
          >
            <div style={{ position:"relative", flexShrink:0 }}>
              {rev.avatar && !rev.avatar.includes("placehold") ? (
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  style={{ width:44, height:44, borderRadius:"50%", border:"2px solid #c8b898", objectFit:"cover" }}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div style={{
                width:44, height:44, borderRadius:"50%",
                background:"linear-gradient(135deg,#D49A00,#B07D00)",
                color:"#fff", fontFamily:"'Roboto Slab',serif",
                fontWeight:900, fontSize:18,
                display: rev.avatar && !rev.avatar.includes("placehold") ? "none" : "flex",
                alignItems:"center", justifyContent:"center",
                border:"2px solid #c8b898",
              }}>
                {rev.name?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#1a1208", fontFamily:"'Roboto Slab',serif" }}>{rev.name}</div>
              <div style={{ fontSize:11, color:"#c8860a" }}>{rev.review_count || rev.reviewCount || 0} Reviews</div>
            </div>
          </div>
        ))}
        <Link to="/all-reviewers" style={{ display:"block", marginTop:8, fontSize:12, color:"#c8860a", textDecoration:"none" }}>All Reviewers</Link>
      </Widget>

      <Widget title="Archives">
        {archives.length === 0 && (
          <p style={{ fontSize:12, color:"#7a6040" }}>No archives yet.</p>
        )}
        {archives.map(a => (
          <Link
            key={a.label}
            to="/explore"
            style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", borderBottom:"1px dotted #c8b898", fontSize:12, color:"#c8860a", textDecoration:"none" }}
          >
            <div style={{ width:12, height:12, background:"#c84848", borderRadius:2, flexShrink:0 }} />
            {a.label}
            <span style={{ marginLeft:"auto", fontSize:10, color:"#7a6040" }}>({a.count})</span>
          </Link>
        ))}
      </Widget>

      <Widget title="Categories">
        {categories.map(c => {
          const name = c.name || c;
          return (
            <button
              key={name}
              onClick={() => {
                if (onCategoryClick) onCategoryClick(name);
                else navigate(`/explore?category=${encodeURIComponent(name)}`);
              }}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"4px 0", borderBottom:"1px dotted #c8b898",
                width:"100%", background:"transparent", border:"none",
                cursor:"pointer", textAlign:"left",
              }}
            >
              <div style={{ width:12, height:12, background:"#4a7aaa", borderRadius:2, flexShrink:0 }} />
              <span style={{ fontSize:12, color:"#c8860a", fontWeight:500 }}>{name}</span>
              {c.count > 0 && (
                <span style={{ marginLeft:"auto", fontSize:10, color:"#7a6040" }}>({c.count})</span>
              )}
            </button>
          );
        })}
      </Widget>
    </aside>
  );
}