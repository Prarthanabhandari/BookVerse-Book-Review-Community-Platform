import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, Tag, Settings,
  Shield, Star, Trash2, CheckCircle, X,
  Loader, Search, LogOut, Bell, Edit,
  ThumbsUp, MessageSquare, TrendingUp
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const REJECT_PRESETS = [
  "Inappropriate Language", "Spam/Off-Topic",
  "Inaccurate Content",     "Inappropriate Content",
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [flagFilter,  setFlagFilter]  = useState("all");
  const [reviews,     setReviews]     = useState([]);
  const [users,       setUsers]       = useState([]);
  const [contacts,    setContacts]    = useState([]);
  const [stats,       setStats]       = useState({ reviews:0, members:0, authors:0, totalLikes:0, totalComments:0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [query,       setQuery]       = useState("");
  const [loading,     setLoading]     = useState(true);
  const [deleting,    setDeleting]    = useState(null);
  const [toggling,    setToggling]    = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectMsg,   setRejectMsg]   = useState("");
  const [rejectTag,   setRejectTag]   = useState("");
  const [error,       setError]       = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") { navigate("/"); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true); setError("");
    try {
      const [r, u, s, c] = await Promise.all([
        reviewsAPI.adminGetReviews(),
        reviewsAPI.adminGetUsers(),
        reviewsAPI.getStats(),
        reviewsAPI.adminGetContacts(),
      ]);
      setReviews(r.data || []);
      setUsers(u || []);
      setStats(s || { reviews:0, members:0, authors:0, totalLikes:0, totalComments:0 });
      setContacts(c || []);
      setUnreadCount((c || []).filter(m => !m.read).length);
    } catch {
      setError("Backend error — make sure server is running on port 5000.");
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    try { const r = await reviewsAPI.adminGetReviews(query); setReviews(r.data || []); }
    catch {}
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Permanently delete this review?")) return;
    setDeleting(id);
    try {
      await reviewsAPI.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      setStats(s => ({ ...s, reviews: Math.max(0, s.reviews - 1) }));
    } catch (e) { alert("Delete failed: " + e.message); }
    setDeleting(null);
  };

  const handleToggleFeatured = async (id) => {
    setToggling(id);
    try {
      const updated = await reviewsAPI.toggleFeatured(id);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, featured: updated.featured } : r));
    } catch (e) { alert("Toggle failed: " + e.message); }
    setToggling(null);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setDeleting("u" + id);
    try {
      await reviewsAPI.adminDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) { alert("Failed: " + e.message); }
    setDeleting(null);
  };

  const handleReject = async () => {
    const reason = rejectTag || rejectMsg;
    if (!reason.trim()) { alert("Please enter or select a reason."); return; }
    try {
      await reviewsAPI.delete(rejectModal.id);
      setReviews(prev => prev.filter(r => r.id !== rejectModal.id));
      setRejectModal(null); setRejectMsg(""); setRejectTag("");
      alert(`Review rejected: "${reason}"`);
    } catch (e) { alert("Failed: " + e.message); }
  };

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-US",{ year:"numeric", month:"short", day:"numeric" }); }
    catch { return "—"; }
  };

  const timeAgo = (iso) => {
    try {
      const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
      if (h < 1) return "Just now";
      if (h < 24) return `${h}h ago`;
      return `${Math.floor(h/24)}d ago`;
    } catch { return "—"; }
  };

  const guestCount    = reviews.filter(r => !r.reviewer_id).length;
  const memberCount   = reviews.filter(r =>  r.reviewer_id).length;
  const featuredCount = reviews.filter(r =>  r.featured).length;
  const pendingCount  = reviews.filter(r => !r.featured).length;
  const total         = memberCount + guestCount || 1;

  const donutData = {
    labels: ["Logged-In Members","Guests"],
    datasets: [{
      data: [memberCount || 1, guestCount],
      backgroundColor: ["#C99700","#3D5A80"],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const navItems = [
    { key:"dashboard",  icon:<LayoutDashboard size={18}/>, label:"Dashboard" },
    { key:"reviews",    icon:<BookOpen size={18}/>,        label:"Book Reviews" },
    { key:"members",    icon:<Users size={18}/>,           label:"Community Members" },
    { key:"categories", icon:<Tag size={18}/>,             label:"Categories" },
    { key:"messages",   icon:<Bell size={18}/>,            label: unreadCount > 0 ? `Messages (${unreadCount})` : "Messages" },
    { key:"settings",   icon:<Settings size={18}/>,        label:"Admin Settings" },
  ];

  const getFilteredReviews = () => {
    if (flagFilter === "featured") return reviews.filter(r =>  r.featured);
    if (flagFilter === "pending")  return reviews.filter(r => !r.featured);
    return reviews;
  };

  if (!user) return null;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#1A1612", fontFamily:"'Inter','Open Sans',sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{ width:260, background:"#120e0a", display:"flex", flexDirection:"column", flexShrink:0, borderRight:"1px solid #2a1c0a", position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>
        <div style={{ padding:"24px 20px 18px", borderBottom:"1px solid #2a1c0a" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:42, height:42, borderRadius:10, background:"linear-gradient(135deg,#C99700,#a07800)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Shield size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:900, color:"#f5f0e1", letterSpacing:0.5 }}>
                <span style={{ color:"#C99700" }}>BOOK</span>VERSE
              </div>
              <div style={{ fontSize:9, color:"#C99700", letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>Admin Center</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
          {navItems.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              display:"flex", alignItems:"center", gap:14,
              width:"100%", padding:"13px 24px", border:"none",
              background: activeTab===key ? "rgba(201,151,0,0.12)" : "transparent",
              borderLeft: activeTab===key ? "3px solid #C99700" : "3px solid transparent",
              color: activeTab===key ? "#C99700" : "#8a7a60",
              fontSize:14, fontWeight: activeTab===key ? 700 : 500,
              cursor:"pointer", textAlign:"left", transition:"all 0.15s",
              fontFamily:"'Open Sans',sans-serif",
            }}
              onMouseEnter={e => { if(activeTab!==key){ e.currentTarget.style.background="rgba(201,151,0,0.06)"; e.currentTarget.style.color="#c8a840"; } }}
              onMouseLeave={e => { if(activeTab!==key){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8a7a60"; } }}
            >
              {icon}
              <span style={{ flex:1 }}>{label}</span>
              {key==="messages" && unreadCount>0 && (
                <span style={{ background:"#dc2626", color:"#fff", fontSize:10, fontWeight:900, padding:"2px 7px", borderRadius:10 }}>{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid #2a1c0a", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:17, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#f5f0e1", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
            <div style={{ fontSize:10, color:"#5a4a30", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email}</div>
            <div style={{ fontSize:10, color:"#C99700", fontWeight:700, marginTop:1 }}>Admin</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto" }}>

        {/* Top Bar */}
        <div style={{ background:"#120e0a", borderBottom:"1px solid #2a1c0a", padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:50 }}>
          <div style={{ fontSize:13, color:"#8a7a60" }}>
            Logged in as <span style={{ color:"#C99700", fontWeight:700 }}>Admin</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <Link to="/" style={{ fontSize:12, color:"#8a7a60", textDecoration:"none" }}>← View Site</Link>
            <button onClick={() => setActiveTab("messages")} style={{ background:"none", border:"none", cursor:"pointer", color: unreadCount>0?"#C99700":"#8a7a60", position:"relative" }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position:"absolute", top:-4, right:-4, width:14, height:14, borderRadius:"50%", background:"#dc2626", color:"#fff", fontSize:8, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadCount}</span>
              )}
            </button>
            <div style={{ position:"relative" }}>
              <button onClick={() => setProfileOpen(!profileOpen)} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(201,151,0,0.1)", border:"1px solid #3a2c10", borderRadius:8, padding:"6px 12px 6px 8px", cursor:"pointer" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontWeight:900, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>{user?.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize:13, color:"#f5f0e1", fontWeight:600 }}>{user?.name}</span>
                <span style={{ fontSize:10, color:"#C99700" }}>▼</span>
              </button>
              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} style={{ position:"fixed", inset:0, zIndex:98 }} />
                  <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"#1e1810", border:"1px solid #3a2c10", borderRadius:10, minWidth:180, zIndex:99, overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,0.5)" }}>
                    <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} style={{ display:"block", padding:"12px 16px", color:"#C99700", textDecoration:"none", fontSize:13, fontWeight:700, borderBottom:"1px solid #2a1c0a" }}>Admin Dashboard</Link>
                    <Link to="/" onClick={() => setProfileOpen(false)} style={{ display:"block", padding:"12px 16px", color:"#a89070", textDecoration:"none", fontSize:13, borderBottom:"1px solid #2a1c0a" }}>View Site</Link>
                    <button onClick={() => { logout(); navigate("/"); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"12px 16px", background:"none", border:"none", color:"#e74c3c", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding:"28px 32px", flex:1, background:"#FAF8F5" }}>
          {error && (
            <div style={{ background:"#fde8e8", border:"1px solid #f5c0c0", borderRadius:8, padding:"12px 16px", marginBottom:20, color:"#8a1a1a", fontSize:13 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:300 }}>
              <div style={{ textAlign:"center" }}>
                <Loader size={40} color="#C99700" style={{ animation:"spin 1s linear infinite", margin:"0 auto 12px" }} />
                <p style={{ color:"#7a6040" }}>Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── DASHBOARD TAB ── */}
              {activeTab === "dashboard" && (
                <>
                  <div style={{ marginBottom:24 }}>
                    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:"#1A1612", marginBottom:4 }}>Dashboard</h1>
                    <p style={{ color:"#7a6040", fontSize:14 }}>Welcome back, <strong style={{ color:"#C99700" }}>{user?.name}</strong> — here's your platform overview.</p>
                  </div>

                  {/* STAT CARDS — 6 cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:28 }}>

                    {/* 1 Reviews */}
                    <div onClick={() => { setActiveTab("reviews"); setFlagFilter("all"); }}
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #bfdbfe", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(37,99,235,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      <BookOpen size={28} color="#2563eb" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{stats.reviews}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Total Reviews</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#2563eb", fontWeight:700 }}>View Details →</div>
                    </div>

                    {/* 2 Pending */}
                    <div onClick={() => { setActiveTab("reviews"); setFlagFilter("pending"); }}
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #fecaca", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer", transition:"all 0.2s", position:"relative" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(220,38,38,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      {pendingCount > 0 && (
                        <div style={{ position:"absolute", top:14, right:14, width:22, height:22, borderRadius:"50%", background:"#dc2626", color:"#fff", fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{pendingCount}</div>
                      )}
                      <TrendingUp size={28} color="#dc2626" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{pendingCount}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Pending Reviews</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#dc2626", fontWeight:700 }}>View Details →</div>
                    </div>

                    {/* 3 Members */}
                    <div onClick={() => setActiveTab("members")}
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #a7f3d0", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(5,150,105,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      <Users size={28} color="#059669" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{stats.members}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Total Members</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#059669", fontWeight:700 }}>View Details →</div>
                    </div>

                    {/* 4 Featured */}
                    <div onClick={() => { setActiveTab("reviews"); setFlagFilter("featured"); }}
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #fde68a", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(217,119,6,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      <Star size={28} color="#d97706" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{featuredCount}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Featured Books</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#d97706", fontWeight:700 }}>View Details →</div>
                    </div>

                    {/* 5 Total Likes */}
                    <div
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #fce7f3", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(219,39,119,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      <ThumbsUp size={28} color="#db2777" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{stats.totalLikes || 0}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Total Likes</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#db2777", fontWeight:700 }}>Across all reviews</div>
                    </div>

                    {/* 6 Total Comments */}
                    <div
                      style={{ background:"#fff", borderRadius:12, padding:"20px 22px", border:"1px solid #ede9fe", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(124,58,237,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}
                    >
                      <MessageSquare size={28} color="#7c3aed" style={{ marginBottom:10 }}/>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#1A1612", lineHeight:1 }}>{stats.totalComments || 0}</div>
                      <div style={{ fontSize:12, color:"#7a6040", marginTop:8, fontWeight:600 }}>Total Comments</div>
                      <div style={{ marginTop:12, fontSize:12, color:"#7c3aed", fontWeight:700 }}>Across all reviews</div>
                    </div>
                  </div>

                  {/* Analytics Row */}
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#1A1612", marginBottom:16, fontWeight:700 }}>Advanced User &amp; Review Analytics</h2>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
                    <div style={{ background:"#fff", borderRadius:12, padding:"22px", border:"1px solid #e8dcc8", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#1A1612", marginBottom:18, fontWeight:700 }}>Guest vs Member Reviews</h3>
                      <div style={{ display:"flex", alignItems:"center", gap:24 }}>
                        <div style={{ width:150, height:150, flexShrink:0 }}>
                          <Doughnut data={donutData} options={{ plugins:{ legend:{ display:false } }, cutout:"68%", maintainAspectRatio:true }} />
                        </div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                            <div style={{ width:12, height:12, borderRadius:"50%", background:"#C99700" }} />
                            <div>
                              <div style={{ fontSize:14, fontWeight:700, color:"#1A1612" }}>{memberCount} ({Math.round(memberCount/total*100)}%)</div>
                              <div style={{ fontSize:11, color:"#7a6040" }}>Logged-In Members</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                            <div style={{ width:12, height:12, borderRadius:"50%", background:"#3D5A80" }} />
                            <div>
                              <div style={{ fontSize:14, fontWeight:700, color:"#1A1612" }}>{guestCount} ({Math.round(guestCount/total*100)}%)</div>
                              <div style={{ fontSize:11, color:"#7a6040" }}>Guests</div>
                            </div>
                          </div>
                          {/* Likes & Comments mini stats */}
                          <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #f0e8d8" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                              <ThumbsUp size={12} color="#db2777"/>
                              <span style={{ fontSize:12, color:"#1A1612", fontWeight:700 }}>{stats.totalLikes || 0}</span>
                              <span style={{ fontSize:11, color:"#7a6040" }}>total likes</span>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <MessageSquare size={12} color="#7c3aed"/>
                              <span style={{ fontSize:12, color:"#1A1612", fontWeight:700 }}>{stats.totalComments || 0}</span>
                              <span style={{ fontSize:11, color:"#7a6040" }}>total comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background:"#fff", borderRadius:12, padding:"22px", border:"1px solid #e8dcc8", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#1A1612", marginBottom:18, fontWeight:700 }}>Recent Activity</h3>
                      {reviews.slice(0,3).map((r, i) => (
                        <div key={r.id} style={{ display:"flex", gap:12, alignItems:"center", paddingBottom:14, marginBottom: i<2?14:0, borderBottom: i<2?"1px solid #f5f0e8":"none" }}>
                          <img src={r.cover} alt="" style={{ width:44, height:60, objectFit:"cover", borderRadius:6, flexShrink:0 }} onError={e=>e.target.src="https://placehold.co/44x60/8B4513/FFF?text=?"} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:13, color:"#1A1612", marginBottom:2 }}>{r.title}</div>
                            <div style={{ fontSize:11, color:"#7a6040" }}>by {r.reviewer_name}</div>
                            <div style={{ display:"flex", gap:10, marginTop:4 }}>
                              <span style={{ fontSize:11, color:"#db2777", display:"flex", alignItems:"center", gap:3 }}>
                                <ThumbsUp size={10}/> {r.likes || 0}
                              </span>
                              <span style={{ fontSize:11, color:"#7c3aed", display:"flex", alignItems:"center", gap:3 }}>
                                <MessageSquare size={10}/> {r.comments || 0}
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize:13, fontWeight:700, color:"#C99700" }}>{r.rating}/5</div>
                        </div>
                      ))}
                      {reviews.length === 0 && <p style={{ color:"#7a6040", fontSize:13 }}>No reviews yet.</p>}
                    </div>
                  </div>

                  {/* Moderation Table */}
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#1A1612", marginBottom:16, fontWeight:700 }}>Review Moderation</h2>
                  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr style={{ background:"#faf6ef", borderBottom:"2px solid #e8dcc8" }}>
                            {["Cover","Title","Reviewer","Rating","Likes","Comments","Status","Actions"].map(h=>(
                              <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontSize:11, color:"#7a6040", textTransform:"uppercase", letterSpacing:0.8, fontWeight:700, whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.map((r, i) => (
                            <tr key={r.id} style={{ borderBottom:"1px solid #f5f0e8", background:i%2===0?"#fff":"#fdfaf5", transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#fff8f0"}
                              onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fdfaf5"}
                            >
                              <td style={{ padding:"12px 16px" }}>
                                <img src={r.cover} alt="" style={{ width:44, height:60, objectFit:"cover", borderRadius:6, boxShadow:"1px 1px 6px rgba(0,0,0,0.15)" }} onError={e=>e.target.src="https://placehold.co/44x60/8B4513/FFF?text=?"} />
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <Link to={`/review/${r.id}`} style={{ fontWeight:700, color:"#1A1612", textDecoration:"none", fontSize:14, display:"block", marginBottom:3 }}>{r.title}</Link>
                                <span style={{ fontSize:11, color:"#9a8060" }}>by {r.author}</span>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontWeight:900, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                    {r.reviewer_name?.[0]?.toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight:600, color:"#1A1612", fontSize:13 }}>{r.reviewer_name}</span>
                                </div>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <div style={{ fontSize:14, color:"#C99700", fontWeight:700 }}>{"★".repeat(r.rating||0)}{"☆".repeat(5-(r.rating||0))}</div>
                                <div style={{ fontSize:11, color:"#7a6040" }}>{r.rating}/5</div>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:4, color:"#db2777", fontWeight:700, fontSize:13 }}>
                                  <ThumbsUp size={13}/> {r.likes || 0}
                                </div>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:4, color:"#7c3aed", fontWeight:700, fontSize:13 }}>
                                  <MessageSquare size={13}/> {r.comments || 0}
                                </div>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <span style={{ fontSize:11, padding:"4px 10px", borderRadius:20, fontWeight:700, background:r.featured?"#d1fae5":"#fef3c7", color:r.featured?"#065f46":"#92400e", whiteSpace:"nowrap" }}>
                                  {r.featured ? "Featured" : `Pending ${timeAgo(r.created_at)}`}
                                </span>
                              </td>
                              <td style={{ padding:"12px 16px" }}>
                                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                  <button onClick={()=>handleToggleFeatured(r.id)} disabled={toggling===r.id}
                                    style={{ padding:"6px 12px", border:"none", borderRadius:6, background:r.featured?"#f0fdf4":"#065f46", color:r.featured?"#065f46":"#fff", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}
                                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                                  >
                                    {toggling===r.id?<Loader size={10} style={{ animation:"spin 1s linear infinite" }}/>:<CheckCircle size={11}/>}
                                    {r.featured?"Unfeature":"Feature"}
                                  </button>
                                  <button onClick={()=>handleDeleteReview(r.id)} disabled={deleting===r.id}
                                    style={{ padding:"6px 12px", border:"none", borderRadius:6, background:"#fef2f2", color:"#dc2626", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}
                                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                                  >
                                    {deleting===r.id?<Loader size={10} style={{ animation:"spin 1s linear infinite" }}/>:<Trash2 size={10}/>} Delete
                                  </button>
                                  <button onClick={()=>{ setRejectModal(r); setRejectMsg(""); setRejectTag(""); }}
                                    style={{ padding:"6px 12px", border:"2px solid #dc2626", borderRadius:6, background:"transparent", color:"#dc2626", fontSize:11, fontWeight:700, cursor:"pointer" }}
                                    onMouseEnter={e=>{ e.currentTarget.style.background="#dc2626"; e.currentTarget.style.color="#fff"; }}
                                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#dc2626"; }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {reviews.length === 0 && (
                        <div style={{ textAlign:"center", padding:"48px", color:"#7a6040" }}>
                          <BookOpen size={48} color="#e8dcc8" style={{ margin:"0 auto 16px" }} />
                          <p style={{ fontSize:15 }}>No reviews yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* BOOK REVIEWS TAB */}
              {activeTab === "reviews" && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:12 }}>
                    <div>
                      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1A1612", fontWeight:900, marginBottom:4 }}>
                        {flagFilter==="featured" ? "Featured Reviews" : flagFilter==="pending" ? "Pending Reviews" : "All Reviews"}
                      </h1>
                      <p style={{ fontSize:13, color:"#7a6040" }}>
                        {flagFilter==="featured" ? `${featuredCount} reviews shown on Home page` :
                         flagFilter==="pending"  ? `${pendingCount} reviews awaiting feature decision` :
                         `${reviews.length} total reviews in database`}
                      </p>
                    </div>
                    <Link to="/write" style={{ padding:"10px 20px", background:"linear-gradient(180deg,#C99700,#a07800)", color:"#fff", borderRadius:8, textDecoration:"none", fontFamily:"'Open Sans',sans-serif", fontWeight:700, fontSize:13 }}>
                      + New Review
                    </Link>
                  </div>

                  <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                    {[
                      { key:"all",      label:`All (${reviews.length})`,    ac:"#1A1612", ab:"#f0f4f8", bc:"#c8b898" },
                      { key:"pending",  label:`Pending (${pendingCount})`,  ac:"#dc2626", ab:"#fef2f2", bc:"#fecaca" },
                      { key:"featured", label:`Featured (${featuredCount})`,ac:"#d97706", ab:"#fffbeb", bc:"#fde68a" },
                    ].map(f => (
                      <button key={f.key} onClick={()=>setFlagFilter(f.key)} style={{
                        padding:"7px 18px", borderRadius:20, cursor:"pointer",
                        border: flagFilter===f.key ? `2px solid ${f.bc}` : "2px solid #e8dcc8",
                        background: flagFilter===f.key ? f.ab : "transparent",
                        color: flagFilter===f.key ? f.ac : "#7a6040",
                        fontSize:12, fontWeight: flagFilter===f.key ? 700 : 500,
                        transition:"all 0.15s",
                      }}>{f.label}</button>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                    <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()}
                      placeholder="Search by title or author..."
                      style={{ flex:1, padding:"10px 14px", border:"1px solid #e8dcc8", borderRadius:8, fontSize:13, outline:"none", color:"#1A1612" }} />
                    <button onClick={handleSearch} style={{ padding:"10px 18px", background:"linear-gradient(180deg,#C99700,#a07800)", border:"none", borderRadius:8, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                      <Search size={14}/> Search
                    </button>
                    <button onClick={()=>{ setQuery(""); setFlagFilter("all"); loadAll(); }} style={{ padding:"10px 14px", background:"transparent", border:"1px solid #e8dcc8", borderRadius:8, color:"#7a6040", cursor:"pointer", fontSize:13 }}>
                      Reset
                    </button>
                  </div>

                  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", overflow:"hidden" }}>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr style={{ background:"#faf6ef", borderBottom:"2px solid #e8dcc8" }}>
                            {["#","Cover","Title","Reviewer","Rating","Likes","Comments","Featured","Date","Actions"].map(h=>(
                              <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:10, color:"#7a6040", textTransform:"uppercase", letterSpacing:0.8, fontWeight:700, whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredReviews().map((r, i) => (
                            <tr key={r.id} style={{ borderBottom:"1px solid #f5f0e8", background:i%2===0?"#fff":"#fdfaf5", transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#fff8f0"}
                              onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fdfaf5"}
                            >
                              <td style={{ padding:"10px 12px", color:"#9a8060", fontSize:12 }}>{i+1}</td>
                              <td style={{ padding:"10px 12px" }}>
                                <img src={r.cover} alt="" style={{ width:32, height:44, objectFit:"cover", borderRadius:4 }} onError={e=>e.target.src="https://placehold.co/32x44/8B4513/FFF?text=?"} />
                              </td>
                              <td style={{ padding:"10px 12px", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                <Link to={`/review/${r.id}`} style={{ color:"#C99700", textDecoration:"none", fontWeight:700 }}>{r.title}</Link>
                              </td>
                              <td style={{ padding:"10px 12px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                  <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontSize:11, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                    {r.reviewer_name?.[0]?.toUpperCase()}
                                  </div>
                                  <span style={{ fontSize:12, color:"#1A1612" }}>{r.reviewer_name}</span>
                                </div>
                              </td>
                              <td style={{ padding:"10px 12px", color:"#C99700", fontWeight:700, fontSize:12 }}>{"★".repeat(r.rating||0)}</td>
                              <td style={{ padding:"10px 12px" }}>
                                <span style={{ display:"flex", alignItems:"center", gap:4, color:"#db2777", fontWeight:700, fontSize:12 }}>
                                  <ThumbsUp size={11}/> {r.likes || 0}
                                </span>
                              </td>
                              <td style={{ padding:"10px 12px" }}>
                                <span style={{ display:"flex", alignItems:"center", gap:4, color:"#7c3aed", fontWeight:700, fontSize:12 }}>
                                  <MessageSquare size={11}/> {r.comments || 0}
                                </span>
                              </td>
                              <td style={{ padding:"10px 12px", textAlign:"center" }}>
                                <button onClick={()=>handleToggleFeatured(r.id)} disabled={toggling===r.id}
                                  title={r.featured?"Remove from Featured":"Add to Featured"}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, transition:"transform 0.15s" }}
                                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"}
                                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                                >
                                  {toggling===r.id ? <Loader size={16} style={{ animation:"spin 1s linear infinite" }}/> : r.featured?"🟢":"⚪"}
                                </button>
                              </td>
                              <td style={{ padding:"10px 12px", color:"#9a8060", whiteSpace:"nowrap", fontSize:12 }}>{fmt(r.created_at)}</td>
                              <td style={{ padding:"10px 12px" }}>
                                <div style={{ display:"flex", gap:4 }}>
                                  <Link to={`/edit/${r.id}`} style={{ padding:"4px 8px", border:"1px solid #C99700", borderRadius:4, color:"#C99700", fontSize:10, fontWeight:700, textDecoration:"none" }}>Edit</Link>
                                  <button onClick={()=>handleDeleteReview(r.id)} disabled={deleting===r.id}
                                    style={{ padding:"4px 8px", border:"1px solid #dc2626", borderRadius:4, color:"#dc2626", fontSize:10, fontWeight:700, cursor:"pointer", background:"transparent", display:"inline-flex", alignItems:"center", gap:2 }}
                                  >
                                    {deleting===r.id?<Loader size={10} style={{ animation:"spin 1s linear infinite" }}/>:<Trash2 size={10}/>}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {getFilteredReviews().length === 0 && (
                        <div style={{ textAlign:"center", padding:"48px", color:"#7a6040" }}>
                          <p style={{ fontSize:15, marginBottom:8 }}>
                            {flagFilter==="featured" ? "No featured reviews yet." : flagFilter==="pending" ? "No pending reviews." : "No reviews found."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* MEMBERS TAB */}
              {activeTab === "members" && (
                <>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1A1612", fontWeight:900, marginBottom:6 }}>Community Members</h1>
                  <p style={{ color:"#7a6040", fontSize:13, marginBottom:20 }}>{users.length} registered members</p>
                  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", overflow:"hidden" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:"#faf6ef", borderBottom:"2px solid #e8dcc8" }}>
                          {["Avatar","Name","Email","Role","Reviews","Joined","Actions"].map(h=>(
                            <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, color:"#7a6040", textTransform:"uppercase", letterSpacing:0.8, fontWeight:700 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} style={{ borderBottom:"1px solid #f5f0e8", background:i%2===0?"#fff":"#fdfaf5", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#fff8f0"}
                            onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#fdfaf5"}
                          >
                            <td style={{ padding:"12px 16px" }}>
                              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontWeight:900, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                {u.name?.[0]?.toUpperCase()||"?"}
                              </div>
                            </td>
                            <td style={{ padding:"12px 16px", fontWeight:700, color:"#1A1612" }}>{u.name}</td>
                            <td style={{ padding:"12px 16px", color:"#5a4020", fontSize:12 }}>{u.email}</td>
                            <td style={{ padding:"12px 16px" }}>
                              <span style={{ fontSize:11, padding:"3px 10px", borderRadius:10, fontWeight:700, background:u.role==="admin"?"#C99700":"#f0fdf4", color:u.role==="admin"?"#fff":"#065f46" }}>{u.role}</span>
                            </td>
                            <td style={{ padding:"12px 16px", color:"#C99700", fontWeight:700 }}>{u.review_count||0}</td>
                            <td style={{ padding:"12px 16px", color:"#9a8060", fontSize:12 }}>{fmt(u.created_at)}</td>
                            <td style={{ padding:"12px 16px" }}>
                              {u.role !== "admin" && (
                                <button onClick={()=>handleDeleteUser(u.id)} disabled={deleting==="u"+u.id}
                                  style={{ padding:"5px 10px", border:"1px solid #dc2626", borderRadius:6, color:"#dc2626", fontSize:11, fontWeight:700, cursor:"pointer", background:"transparent", display:"inline-flex", alignItems:"center", gap:4 }}
                                >
                                  {deleting==="u"+u.id?<Loader size={10} style={{ animation:"spin 1s linear infinite" }}/>:<Trash2 size={10}/>} Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && <div style={{ textAlign:"center", padding:"40px", color:"#7a6040" }}><p>No members yet.</p></div>}
                  </div>
                </>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1A1612", fontWeight:900, marginBottom:20 }}>Categories</h1>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
                    {["Biographies & Memoirs","Business & Investing","Children's Books","Christian Books","Comics & Graphic Novels","Computers & Internet","Cooking, Food & Wine","Entertainment","Fantasy","Health, Mind & Body","History","Home & Garden","Literature & Fiction","Mystery & Thrillers","Productivity","Psychology","Science Fiction","Romance","Horror","Self-Help"].map(cat => {
                      const count = reviews.filter(r => r.category === cat).length;
                      const totalCatLikes = reviews.filter(r => r.category === cat).reduce((sum, r) => sum + (r.likes || 0), 0);
                      return (
                        <div key={cat} style={{ background:"#fff", borderRadius:10, padding:"16px 18px", border:"1px solid #e8dcc8", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                          <div style={{ fontWeight:700, color:"#1A1612", fontSize:13, marginBottom:6 }}>{cat}</div>
                          <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8 }}>
                            <span style={{ fontSize:11, color:"#9a8060" }}>{count} review{count!==1?"s":""}</span>
                            <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"#db2777" }}>
                              <ThumbsUp size={10}/> {totalCatLikes}
                            </span>
                          </div>
                          <Link to={`/explore?category=${encodeURIComponent(cat)}`} style={{ fontSize:12, color:"#C99700", fontWeight:600, textDecoration:"none" }}>View →</Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* MESSAGES TAB */}
              {activeTab === "messages" && (
                <>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1A1612", fontWeight:900 }}>Contact Messages</h1>
                    {unreadCount > 0 && (
                      <span style={{ background:"#dc2626", color:"#fff", fontSize:12, padding:"3px 12px", borderRadius:12, fontWeight:700 }}>{unreadCount} NEW</span>
                    )}
                  </div>
                  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", overflow:"hidden" }}>
                    {contacts.length === 0 ? (
                      <div style={{ textAlign:"center", padding:"60px", color:"#7a6040" }}>
                        <Bell size={48} color="#e8dcc8" style={{ margin:"0 auto 16px" }} />
                        <p style={{ fontSize:15 }}>No messages yet.</p>
                      </div>
                    ) : (
                      contacts.map((msg, i) => (
                        <div key={msg.id} style={{ padding:"18px 22px", borderBottom: i < contacts.length-1 ? "1px solid #f0e8d8" : "none", background: msg.read ? (i%2===0?"#fff":"#fdfaf5") : "#fffbeb", display:"flex", gap:16, alignItems:"flex-start", transition:"background 0.15s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#fff8f0"}
                          onMouseLeave={e=>e.currentTarget.style.background=msg.read?(i%2===0?"#fff":"#fdfaf5"):"#fffbeb"}
                        >
                          <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#C99700,#a07800)", color:"#fff", fontWeight:900, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {msg.name?.[0]?.toUpperCase()||"?"}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <span style={{ fontWeight:700, color:"#1A1612", fontSize:14 }}>{msg.name}</span>
                                <span style={{ fontSize:12, color:"#9a8060" }}>{msg.email}</span>
                                {!msg.read && <span style={{ fontSize:10, background:"#fef3c7", color:"#92400e", padding:"1px 8px", borderRadius:8, fontWeight:700 }}>NEW</span>}
                              </div>
                              <span style={{ fontSize:11, color:"#9a8060" }}>
                                {new Date(msg.created_at).toLocaleDateString("en-US",{ year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                              </span>
                            </div>
                            <p style={{ fontSize:13, color:"#5a4020", lineHeight:1.6, margin:0 }}>{msg.message}</p>
                            {!msg.read && (
                              <button onClick={async () => { await reviewsAPI.markContactRead(msg.id); setContacts(prev => prev.map(c => c.id===msg.id ? {...c, read:true} : c)); setUnreadCount(prev => Math.max(0, prev-1)); }}
                                style={{ marginTop:10, padding:"5px 14px", border:"1px solid #C99700", borderRadius:6, background:"transparent", color:"#C99700", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#1A1612", fontWeight:900, marginBottom:20 }}>Admin Settings</h1>
                  <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", padding:"28px" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:"#1A1612", marginBottom:16 }}>Quick Actions</h3>
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:28 }}>
                      <Link to="/write" style={{ padding:"12px 20px", background:"linear-gradient(180deg,#C99700,#a07800)", color:"#fff", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:13 }}>
                        + Write New Review
                      </Link>
                      <button onClick={loadAll} style={{ padding:"12px 20px", border:"1px solid #e8dcc8", background:"transparent", color:"#5a4020", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13 }}>
                        Refresh Data
                      </button>
                      <Link to="/explore" style={{ padding:"12px 20px", border:"1px solid #e8dcc8", background:"transparent", color:"#5a4020", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:13 }}>
                        View Explore Page
                      </Link>
                      <Link to="/best-books" style={{ padding:"12px 20px", border:"1px solid #e8dcc8", background:"transparent", color:"#5a4020", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:13 }}>
                        View Best Books
                      </Link>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
                      {[
                        { label:"Total Reviews",   value: stats.reviews,        color:"#2563eb" },
                        { label:"Total Members",   value: stats.members,        color:"#059669" },
                        { label:"Featured",        value: featuredCount,        color:"#d97706" },
                        { label:"Pending",         value: pendingCount,         color:"#dc2626" },
                        { label:"Guest Reviews",   value: guestCount,           color:"#3D5A80" },
                        { label:"Total Likes",     value: stats.totalLikes||0,  color:"#db2777" },
                        { label:"Total Comments",  value: stats.totalComments||0, color:"#7c3aed" },
                        { label:"Unread Messages", value: unreadCount,          color:"#dc2626" },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ background:"#faf6ef", borderRadius:8, padding:"14px 16px", border:"1px solid #e8dcc8", textAlign:"center" }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color }}>{value}</div>
                          <div style={{ fontSize:11, color:"#7a6040", marginTop:4 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:"#fffbeb", borderRadius:8, border:"1px solid #fde68a", padding:"18px 20px" }}>
                      <div style={{ fontWeight:700, color:"#92400e", marginBottom:8, fontSize:14 }}>Admin Credentials</div>
                      <p style={{ fontSize:13, color:"#7a6040", marginBottom:4 }}>Email: <strong>prarthanabhandari2003@gmail.com</strong></p>
                      <p style={{ fontSize:13, color:"#7a6040" }}>Role: <strong style={{ color:"#C99700" }}>Admin (Full Access)</strong></p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#F5F0E1", borderRadius:16, padding:"32px", width:"100%", maxWidth:500, boxShadow:"0 24px 64px rgba(0,0,0,0.4)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#1A1612", fontWeight:900 }}>Reject Review</h3>
              <button onClick={()=>setRejectModal(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#7a6040" }}><X size={22}/></button>
            </div>
            <p style={{ fontSize:13, color:"#7a6040", marginBottom:16 }}>
              Rejecting review by <strong style={{ color:"#1A1612" }}>{rejectModal.reviewer_name}</strong>: <em>{rejectModal.title}</em>
            </p>
            <textarea value={rejectMsg} onChange={e=>{ setRejectMsg(e.target.value); setRejectTag(""); }}
              placeholder="Your review was rejected because..."
              style={{ width:"100%", height:110, padding:"12px", border:"1px solid #d4c4a0", borderRadius:8, fontSize:13, resize:"vertical", outline:"none", color:"#1A1612", background:"#fff", marginBottom:14, fontFamily:"'Open Sans',sans-serif" }}
            />
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
              {REJECT_PRESETS.map(p => (
                <button key={p} onClick={()=>{ setRejectTag(p); setRejectMsg(""); }} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${rejectTag===p?"#C99700":"#d4c4a0"}`, background:rejectTag===p?"#C99700":"transparent", color:rejectTag===p?"#fff":"#5a4020", fontSize:12, cursor:"pointer", fontWeight:rejectTag===p?700:400, transition:"all 0.15s" }}>{p}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setRejectModal(null)} style={{ padding:"11px 22px", border:"1px solid #d4c4a0", background:"transparent", borderRadius:8, color:"#5a4020", cursor:"pointer", fontWeight:600, fontSize:13 }}>Cancel</button>
              <button onClick={handleReject} style={{ padding:"11px 28px", background:"linear-gradient(180deg,#c0392b,#922b21)", border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>Send Rejection</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; } body { margin: 0; }`}</style>
    </div>
  );
}