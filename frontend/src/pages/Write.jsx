import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Loader, RefreshCw, BookOpen } from "lucide-react";
import { reviewsAPI } from "../api";
import { CATEGORIES } from "../mockData";
import { useAuth } from "../context/AuthContext";

const FALLBACK_COVER = "https://placehold.co/120x180/4C2E1A/FFF?text=No+Cover";

export default function Write() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    title:"", author:"", isbn:"", rating:0,
    category:"", content:"", cover:"", guestName:"",
  });
  const [hover,        setHover]       = useState(0);
  const [submitting,   setSub]         = useState(false);
  const [error,        setError]       = useState("");
  const [success,      setSuccess]     = useState(false);
  const [fetching,     setFetching]    = useState(false);
  const [coverPreview, setCoverPreview]= useState("");
  const [myReviews,    setMyReviews]   = useState([]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Load my reviews
  useEffect(() => {
    if (user) {
      reviewsAPI.getAll(1, 20).then(({ data }) => {
        setMyReviews(data.filter(r => r.reviewer_name === user.name));
      }).catch(() => {});
    }
  }, [user, success]);

  // Auto-fetch cover when ISBN reaches 10 or 13 digits
  useEffect(() => {
    const isbn = form.isbn.replace(/[-\s]/g, "");
    if (isbn.length === 10 || isbn.length === 13) {
      fetchCover(isbn);
    }
  }, [form.isbn]);

  const fetchCover = async (isbnOverride) => {
    const isbn = (isbnOverride || form.isbn).replace(/[-\s]/g, "");
    if (!isbn) { setError("Please enter an ISBN first"); return; }

    setFetching(true);
    setCoverPreview("");
    setForm(f => ({ ...f, cover: "" }));

    try {
      const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      const check = await fetch(url);

      if (check.ok && check.headers.get("content-length") !== "807") {
        setCoverPreview(url);
        setForm(f => ({ ...f, cover: url }));
      } else {
        const searchRes  = await fetch(`https://openlibrary.org/search.json?isbn=${isbn}&limit=1`);
        const searchData = await searchRes.json();
        if (searchData.docs?.length > 0 && searchData.docs[0].cover_i) {
          const coverId  = searchData.docs[0].cover_i;
          const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
          setCoverPreview(coverUrl);
          setForm(f => ({ ...f, cover: coverUrl }));
          if (!form.title  && searchData.docs[0].title)              setForm(f => ({ ...f, title:  searchData.docs[0].title }));
          if (!form.author && searchData.docs[0].author_name?.[0])   setForm(f => ({ ...f, author: searchData.docs[0].author_name[0] }));
        } else {
          setCoverPreview(FALLBACK_COVER);
          setError("Cover not found. You can still submit without a cover.");
        }
      }
    } catch {
      setCoverPreview(FALLBACK_COVER);
      setError("Could not fetch cover. Check your internet connection.");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.rating) { setError("Please select a star rating"); return; }
    if (!user && !form.guestName.trim()) { setError("Please enter your name to continue as guest"); return; }
    setSub(true); setError("");
    try {
      await reviewsAPI.create({
        ...form,
        cover: form.cover || FALLBACK_COVER,
      });
      setSuccess(true);
      setTimeout(() => navigate("/explore"), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit. Please try again.");
    } finally { setSub(false); }
  };

  const inp = {
    width:"100%", padding:"11px 14px", border:"1px solid #c8b898",
    borderRadius:6, fontSize:14, background:"#faf7f2", color:"#1a1208",
    outline:"none", fontFamily:"'Open Sans',sans-serif", marginTop:6,
  };
  const lbl = {
    fontSize:12, fontWeight:600, color:"#5a4020",
    textTransform:"uppercase", letterSpacing:0.5,
  };

  if (success) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f0e8" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontFamily:"'Roboto Slab',serif", fontSize:28, color:"#1a1208" }}>Review Submitted!</h2>
        <p style={{ color:"#7a6040", marginTop:8 }}>Redirecting to Explore page…</p>
        <div style={{ marginTop:16, width:200, height:4, background:"#e4dcc8", borderRadius:2, margin:"16px auto 0", overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#e09a12,#b07208)", animation:"progress 2.5s linear forwards", borderRadius:2 }} />
        </div>
        <style>{`@keyframes progress { from { width:0%; } to { width:100%; } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>

        {/* Page Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:"#1a1208", marginBottom:6 }}>
            Write a Review
          </h1>
          {user ? (
            <p style={{ color:"#7a6040", fontSize:14 }}>
              Logged in as <strong style={{ color:"#c8860a" }}>{user.name}</strong>
              {" · "}
              <span style={{ color:"#2a8a5a", fontWeight:600 }}>{myReviews.length} review{myReviews.length !== 1 ? "s" : ""} posted</span>
            </p>
          ) : (
            <p style={{ color:"#7a6040", fontSize:14 }}>
              Writing as guest.{" "}
              <Link to="/login" style={{ color:"#c8860a", fontWeight:600 }}>Login</Link>
              {" "}to track your reading history.
            </p>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24, alignItems:"start" }} className="write-grid">

          {/* ── FORM ── */}
          <div style={{ background:"#ede6d8", borderRadius:10, padding:32, border:"1px solid #c8b898" }}>

            {/* Guest Banner */}
            {!user && (
              <div style={{ background:"#fff8e1", border:"1px solid #ffe082", borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ fontSize:13, color:"#856404", fontWeight:600, marginBottom:8 }}>
                  📚 You are browsing as a guest
                </div>
                <p style={{ fontSize:12, color:"#7a6040", lineHeight:1.6, marginBottom:12 }}>
                  You can still post a review! Enter your name below.
                  <Link to="/login" style={{ color:"#c8860a", fontWeight:600, marginLeft:4 }}>Login</Link>
                  {" "}or{" "}
                  <Link to="/signup" style={{ color:"#c8860a", fontWeight:600 }}>Sign up</Link>
                  {" "}to keep a personal reading record.
                </p>
                <div>
                  <label style={lbl}>Your Name *</label>
                  <input
                    style={inp}
                    value={form.guestName}
                    onChange={set("guestName")}
                    placeholder="e.g. Sarah K."
                    required={!user}
                  />
                </div>
              </div>
            )}

            {error && (
              <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:6, padding:"10px 14px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ISBN + Fetch */}
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>ISBN — auto-fetches cover</label>
                <div style={{ display:"flex", gap:8, marginTop:6 }}>
                  <input
                    style={{ ...inp, marginTop:0, flex:1 }}
                    value={form.isbn}
                    onChange={set("isbn")}
                    placeholder="e.g. 9780316769174"
                  />
                  <button type="button" onClick={() => fetchCover()} disabled={fetching} style={{
                    padding:"11px 16px",
                    background: fetching ? "#999" : "linear-gradient(180deg,#D49A00,#B07D00)",
                    border:"none", borderRadius:6, color:"#fff",
                    cursor: fetching ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", gap:6,
                    fontSize:13, fontWeight:600, flexShrink:0,
                  }}>
                    {fetching ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />}
                    {fetching ? "Fetching…" : "Fetch Cover"}
                  </button>
                </div>
                <p style={{ fontSize:11, color:"#7a6040", marginTop:4 }}>
                  Cover loads automatically when ISBN is 10 or 13 digits
                </p>
              </div>

              {/* Title + Author */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div>
                  <label style={lbl}>Book Title *</label>
                  <input style={inp} value={form.title} onChange={set("title")} required placeholder="The Great Gatsby" />
                </div>
                <div>
                  <label style={lbl}>Author Name *</label>
                  <input style={inp} value={form.author} onChange={set("author")} required placeholder="F. Scott Fitzgerald" />
                </div>
              </div>

              {/* Category + Rating */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div>
                  <label style={lbl}>Category </label>
                  <select style={inp} value={form.category} onChange={set("category")}>
                    <option value="">— Select —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Your Rating *</label>
                  <div style={{ display:"flex", gap:6, marginTop:14 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={28} style={{ cursor:"pointer" }}
                        fill={i<=(hover||form.rating)?"#D49A00":"none"}
                        color={i<=(hover||form.rating)?"#D49A00":"#c8b898"}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setForm(f => ({ ...f, rating:i }))}
                      />
                    ))}
                    {form.rating > 0 && (
                      <span style={{ fontSize:12, color:"#c8860a", fontWeight:600, alignSelf:"center" }}>{form.rating}/5</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover URL override */}
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Cover URL (optional — paste any image URL)</label>
                <input
                  style={inp}
                  value={form.cover}
                  onChange={e => { set("cover")(e); setCoverPreview(e.target.value); }}
                  placeholder="https://covers.openlibrary.org/..."
                />
              </div>

              {/* Review Content */}
              <div style={{ marginBottom:24 }}>
                <label style={lbl}>Your Review *</label>
                <textarea
                  style={{ ...inp, height:160, resize:"vertical" }}
                  value={form.content}
                  onChange={set("content")}
                  required
                  placeholder="Share your honest thoughts about this book. What did you love? What could be better? Would you recommend it?"
                />
                <p style={{ fontSize:11, color:"#7a6040", marginTop:4 }}>{form.content.length} characters</p>
              </div>

              <button type="submit" disabled={submitting} style={{
                width:"100%", padding:"14px",
                background: submitting ? "#999" : "linear-gradient(180deg,#e09a12,#b07208)",
                border:"none", borderRadius:6, color:"#fff",
                fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:14, letterSpacing:1,
                cursor: submitting ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {submitting ? <><Loader size={16} className="spin" /> Posting…</> : "POST REVIEW"}
              </button>
            </form>
          </div>

          {/* ── LIVE PREVIEW ── */}
          <div style={{ position:"sticky", top:20, display:"flex", flexDirection:"column", gap:12 }}>

            {/* Preview Card */}
            <div style={{ background:"#ede6d8", borderRadius:10, padding:20, border:"1px solid #c8b898" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#5a4020", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>
                📖 Live Preview
              </div>

              <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                {fetching ? (
                  <div style={{ width:120, height:180, borderRadius:8, background:"#e4dcc8", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Loader size={24} color="#c8860a" className="spin" />
                  </div>
                ) : coverPreview ? (
                  <img src={coverPreview} alt="Book cover" style={{ width:120, height:180, objectFit:"cover", borderRadius:8, boxShadow:"4px 4px 16px rgba(0,0,0,0.25)", border:"2px solid #c8b898" }} onError={e => { e.target.src = FALLBACK_COVER; }} />
                ) : (
                  <div style={{ width:120, height:180, borderRadius:8, background:"linear-gradient(135deg,#4C2E1A,#8B4513)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:"4px 4px 16px rgba(0,0,0,0.25)" }}>
                    <BookOpen size={36} color="#D49A00" />
                    <span style={{ color:"#D49A00", fontSize:10, marginTop:8, textAlign:"center", padding:"0 8px" }}>Enter ISBN to fetch cover</span>
                  </div>
                )}
              </div>

              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:15, fontWeight:700, color:"#1a1208", marginBottom:4 }}>{form.title || "Book Title"}</div>
                <div style={{ fontSize:12, color:"#7a6040", marginBottom:8 }}>{form.author ? `by ${form.author}` : "Author Name"}</div>
                {form.rating > 0 && (
                  <div style={{ display:"flex", justifyContent:"center", gap:3, marginBottom:8 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<=form.rating?"#D49A00":"none"} color={i<=form.rating?"#D49A00":"#c8b898"} />)}
                  </div>
                )}
                {form.category && <span style={{ fontSize:11, background:"#c8b898", padding:"2px 8px", borderRadius:3, color:"#5a4020" }}>{form.category}</span>}
                {(user || form.guestName) && (
                  <div style={{ marginTop:10, fontSize:12, color:"#7a6040" }}>
                    by <strong style={{ color:"#c8860a" }}>{user?.name || form.guestName}</strong>
                  </div>
                )}
              </div>

              {coverPreview && coverPreview !== FALLBACK_COVER && (
                <button type="button" onClick={() => fetchCover()} style={{ width:"100%", marginTop:14, padding:"8px", background:"transparent", border:"1px dashed #c8860a", borderRadius:6, color:"#c8860a", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  <RefreshCw size={12} /> Reload Cover
                </button>
              )}
            </div>

            {/* Tips */}
            <div style={{ background:"#e4dcc8", borderRadius:8, padding:16, border:"1px solid #c8b898" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#5a4020", marginBottom:8 }}>💡 Tips</div>
              <ul style={{ fontSize:12, color:"#7a6040", lineHeight:1.9, paddingLeft:16 }}>
                <li>Find ISBN on the back of any book</li>
                <li>Search Google: "book name ISBN"</li>
                <li>Works with ISBN-10 and ISBN-13</li>
                <li>Covers fetched from Open Library</li>
                <li>You can paste any image URL too</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── MY REVIEWS SECTION ── */}
        {user && myReviews.length > 0 && (
          <div style={{ marginTop:48 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#1a1208" }}>
                My Reviews
                <span style={{ fontSize:16, color:"#c8860a", marginLeft:10, fontFamily:"'Open Sans',sans-serif" }}>({myReviews.length})</span>
              </h2>
              <Link to="/explore" style={{ fontSize:13, color:"#c8860a", textDecoration:"none", fontWeight:600 }}>
                View All in Explore →
              </Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
              {myReviews.map(r => (
                <div key={r.id} style={{ background:"#ede6d8", borderRadius:10, padding:16, border:"1px solid #c8b898", display:"flex", gap:14, alignItems:"flex-start" }}>
                  <img
                    src={r.cover || FALLBACK_COVER}
                    alt={r.title}
                    style={{ width:60, height:85, objectFit:"cover", borderRadius:6, flexShrink:0, boxShadow:"2px 2px 8px rgba(0,0,0,0.2)" }}
                    onError={e => { e.target.src = FALLBACK_COVER; }}
                  />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:14, fontWeight:700, color:"#1a1208", lineHeight:1.3, marginBottom:3 }}>{r.title}</div>
                    <div style={{ fontSize:12, color:"#7a6040", marginBottom:5 }}>by {r.author}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:5 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i<=r.rating?"#D49A00":"none"} color={i<=r.rating?"#D49A00":"#c8b898"} />)}
                      <span style={{ fontSize:11, color:"#7a6040" }}>{r.rating}/5</span>
                    </div>
                    <span style={{ fontSize:10, background:"#c8b898", padding:"1px 6px", borderRadius:3, color:"#5a4020" }}>{r.category}</span>
                    <p style={{ fontSize:12, color:"#5a4020", lineHeight:1.5, marginTop:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                      {r.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If no reviews yet */}
        {user && myReviews.length === 0 && (
          <div style={{ marginTop:40, textAlign:"center", padding:"32px", background:"#ede6d8", borderRadius:10, border:"1px dashed #c8b898" }}>
            <BookOpen size={40} color="#c8b898" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#7a6040", fontSize:14 }}>You haven't posted any reviews yet. Write your first one above! 📚</p>
          </div>
        )}

      </div>

      <style>{`
        @media(max-width:768px) {
          .write-grid { grid-template-columns: 1fr !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}