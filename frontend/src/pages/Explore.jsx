import { useState, useEffect } from "react";
import { Search, X, Plus, Loader, Trophy, Folder } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { reviewsAPI } from "../api";
import { mockReviews, mockReviewers, mockArchives, CATEGORIES } from "../mockData";
import BookCard from "../components/BookCard";
import { LeftSidebar, RightSidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const urlCategory    = searchParams.get("category") || "";

  const [reviews,          setReviews]         = useState([]);
  const [recent,           setRecent]           = useState([]);
  const [reviewers,        setReviewers]        = useState(mockReviewers);
  const [archives,         setArchives]         = useState(mockArchives);
  const [categories,       setCategories]       = useState(CATEGORIES.map(c => ({ name:c, count:0 })));
  const [page,             setPage]             = useState(1);
  const [totalPages,       setTotalPages]       = useState(1);
  const [loadingMore,      setLoadingMore]      = useState(false);
  const [query,            setQuery]            = useState("");
  const [searchMode,       setSearchMode]       = useState(false);
  const [searchRes,        setSearchRes]        = useState([]);
  const [searching,        setSearching]        = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [loadingReviews,   setLoadingReviews]   = useState(false);
  const [activeNav,        setActiveNav]        = useState("Reviews");

  // ── SINGLE useEffect ──────────────────────────
  useEffect(() => {
    const cat = urlCategory || "";
    setSelectedCategory(cat);
    setSearchMode(false);
    setQuery("");
    loadReviews(1, cat);
    reviewsAPI.getRecent().then(setRecent).catch(() => {});
    reviewsAPI.getTopReviewers().then(setReviewers).catch(() => {});
    reviewsAPI.getArchives().then(setArchives).catch(() => {});
  }, [urlCategory]);

  const loadReviews = async (pageNum = 1, cat = "") => {
    setLoadingReviews(true);
    try {
      const result = await reviewsAPI.getAll(pageNum, 10, cat);
      const data   = result?.data || [];
      if (pageNum === 1) setReviews(data);
      else setReviews(prev => [...prev, ...data]);
      setTotalPages(result?.totalPages || 1);
      setPage(pageNum);
    } catch (e) {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await loadReviews(page + 1, selectedCategory);
    setLoadingMore(false);
  };

  const handleCategoryClick = (cat) => {
    const newCat = cat === selectedCategory ? "" : cat;
    setSearchMode(false);
    setQuery("");
    if (newCat) {
      navigate(`/explore?category=${encodeURIComponent(newCat)}`);
    } else {
      navigate("/explore");
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) { setSearchMode(false); return; }
    setSearching(true);
    setSearchMode(true);
    setSelectedCategory("");
    try {
      const { data } = await reviewsAPI.search(query);
      setSearchRes(data || []);
    } catch { setSearchRes([]); }
    setSearching(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchMode(false);
    setSelectedCategory("");
    navigate("/explore");
  };

  const displayed = searchMode ? searchRes : reviews;

  // ── Sub-nav items config ──────────────────────
  const navItems = [
    { label: "Reviews",    icon: null,                onClick: () => { setActiveNav("Reviews"); navigate("/explore"); } },
    { label: "Authors",    icon: null,                onClick: () => { setActiveNav("Authors"); navigate("/all-reviewers"); } },
    { label: "Best Books", icon: <Trophy size={13}/>, onClick: () => { setActiveNav("Best Books"); navigate("/best-books"); } },
    { label: "Contacts",   icon: null,                onClick: () => { setActiveNav("Contacts"); navigate("/contact"); } },
  ];

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#2a1f10", backgroundImage:"repeating-linear-gradient(135deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 8px)" }}>

      {/* ── Sub nav ────────────────────────────── */}
      <div style={{ background:"linear-gradient(180deg,#3a2710,#2a1c0a)", borderBottom:"3px solid #4a3010", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex" }}>
          {navItems.map(({ label, icon, onClick }) => (
            <a
              key={label}
              href="#"
              onClick={e => { e.preventDefault(); onClick(); }}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"14px 18px",
                color: activeNav === label ? "#c8860a" : "#e8dcc8",
                textDecoration:"none",
                fontFamily:"'Roboto Slab',serif",
                fontSize:13, fontWeight:700,
                letterSpacing:1.5, textTransform:"uppercase",
                borderBottom: activeNav === label ? "3px solid #c8860a" : "3px solid transparent",
                marginBottom: activeNav === label ? "-3px" : "0",
                transition:"color 0.15s",
              }}
              onMouseEnter={e => { if(activeNav !== label) e.currentTarget.style.color="#c8860a"; }}
              onMouseLeave={e => { if(activeNav !== label) e.currentTarget.style.color="#e8dcc8"; }}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ display:"flex", alignItems:"center", padding:"8px 0" }}>
          <input
            type="text"
            placeholder="Search reviews..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            style={{ background:"#1a1208", border:"1px solid #4a3010", borderRight:"none", color:"#c8c0a8", padding:"7px 12px", fontSize:13, borderRadius:"4px 0 0 4px", outline:"none", width:200 }}
          />
          <button
            onClick={handleSearch}
            style={{ background:"linear-gradient(180deg,#e09a12,#b07208)", border:"none", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:12, letterSpacing:1, textTransform:"uppercase", padding:"7px 14px", borderRadius:"0 4px 4px 0", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}
          >
            <Search size={12}/> SEARCH
          </button>
          {(searchMode || selectedCategory) && (
            <button onClick={clearSearch} style={{ background:"none", border:"none", color:"#c8860a", cursor:"pointer", marginLeft:6 }}>
              <X size={16}/>
            </button>
          )}
        </div>
      </div>

      {/* ── Three-column layout ─────────────────── */}
      <div style={{ maxWidth:1060, margin:"20px auto", padding:"0 16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"220px 1fr 210px", gap:14, background:"#d8cdb8", borderRadius:6, padding:14, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }} className="explore-grid">

          <LeftSidebar recentReviews={recent} />

          <main>
            {/* Banner */}
            <div style={{ borderRadius:5, overflow:"hidden", marginBottom:14, display:"flex", background:"#c8860a", minHeight:140 }}>
              <div style={{ padding:"22px 24px", flex:1, background:"linear-gradient(135deg,#e09a12 0%,#c8780a 60%,#a06008 100%)" }}>
                <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:22, fontWeight:900, lineHeight:1.25, color:"#fff", textTransform:"uppercase", letterSpacing:1 }}>
                  <span style={{ color:"#fff5d0" }}>CHOOSE</span> BOOKS<br />
                  <span style={{ color:"#ffe090" }}>READ</span> BOOKS<br />
                  <span style={{ color:"#ffd060" }}>POST</span> REVIEWS
                </div>
                <button
                  onClick={() => navigate(user ? "/write" : "/signup")}
                  style={{ marginTop:14, background:"#fff", color:"#8B4513", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:14, letterSpacing:2, textTransform:"uppercase", padding:"8px 22px", borderRadius:24, border:"none", cursor:"pointer" }}
                >
                  JOIN US
                </button>
              </div>
              <div style={{ width:220, flexShrink:0, background:"#a06008", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:60 }}>📚</div>
              </div>
            </div>

            {/* Active filter indicator */}
            {selectedCategory && !searchMode && (
              <div style={{ marginBottom:10, padding:"8px 12px", background:"#e4dcc8", borderRadius:4, border:"1px solid #c8b898", fontSize:13, color:"#3a2008", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Folder size={14} color="#c8860a"/>
                  Category: <strong>{selectedCategory}</strong>
                </span>
                <button onClick={clearSearch} style={{ background:"none", border:"none", color:"#c8860a", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                  <X size={12}/> Clear
                </button>
              </div>
            )}

            {/* Search feedback */}
            {searchMode && (
              <div style={{ marginBottom:10, padding:"8px 12px", background:"#e4dcc8", borderRadius:4, border:"1px solid #c8b898", fontSize:13, color:"#3a2008" }}>
                {searching
                  ? <span style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <Loader size={14} color="#c8860a" style={{ animation:"spin 1s linear infinite" }}/>
                      Searching...
                    </span>
                  : <span>
                      Found <strong>{searchRes.length}</strong> result{searchRes.length !== 1 ? "s" : ""} for "<strong>{query}</strong>" —{" "}
                      <a href="#" onClick={e => { e.preventDefault(); clearSearch(); }} style={{ color:"#c8860a" }}>clear</a>
                    </span>
                }
              </div>
            )}

            {/* Loading */}
            {loadingReviews && (
              <div style={{ display:"flex", justifyContent:"center", padding:"20px 0" }}>
                <Loader size={20} color="#c8860a" style={{ animation:"spin 1s linear infinite" }}/>
              </div>
            )}

            {/* Empty state */}
            {!loadingReviews && displayed.length === 0 && (
              <div style={{ textAlign:"center", padding:"30px 0", color:"#7a6040" }}>
                {selectedCategory
                  ? `No reviews found in "${selectedCategory}" category yet. Be the first to write one!`
                  : searchMode
                  ? `No reviews found for "${query}".`
                  : "No reviews yet."
                }
                <br/>
                <button
                  onClick={() => navigate("/write")}
                  style={{ marginTop:12, padding:"8px 20px", background:"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:4, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:12, cursor:"pointer" }}
                >
                  Write First Review
                </button>
              </div>
            )}

            {/* Review cards */}
            {!loadingReviews && displayed.map(r => (
              <BookCard key={r._id || r.id} review={r}/>
            ))}

            {/* Load more */}
            {!searchMode && page < totalPages && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                style={{ width:"100%", padding:10, background:loadingMore?"#999":"linear-gradient(180deg,#e09a12,#b07208)", border:"none", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, letterSpacing:1, textTransform:"uppercase", borderRadius:4, cursor:loadingMore?"not-allowed":"pointer", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
              >
                {loadingMore ? <><Loader size={14} style={{ animation:"spin 1s linear infinite"}}/> Loading...</> : "LOAD MORE REVIEWS"}
              </button>
            )}

            {/* Submit CTA */}
            <button
              onClick={() => navigate(user ? "/write" : "/signup")}
              style={{ width:"100%", padding:10, border:"2px dashed #c8b898", background:"transparent", borderRadius:5, cursor:"pointer", color:"#7a6040", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}
            >
              <Plus size={16}/> SUBMIT YOUR REVIEW
            </button>
          </main>

          <RightSidebar
            reviewers={reviewers}
            archives={archives}
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      <style>{`
        @media(max-width:820px) { .explore-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}