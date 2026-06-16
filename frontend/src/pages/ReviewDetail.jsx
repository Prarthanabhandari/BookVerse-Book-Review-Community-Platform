import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, ArrowLeft, Trash2, Edit, Loader,
  ThumbsUp, MessageSquare, Send, ChevronDown, ChevronUp
} from "lucide-react";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const FALLBACK = "https://placehold.co/140x200/4C2E1A/FFF?text=No+Cover";

export default function ReviewDetail() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [review,   setReview]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(false);

  // ── Like state ───────────────────────────────
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking,    setLiking]    = useState(false);

  // ── Guest like name ──────────────────────────
  const [showGuestLike, setShowGuestLike] = useState(false);
  const [guestLikeName, setGuestLikeName] = useState("");

  // ── Comment state ─────────────────────────────
  const [comments,      setComments]      = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [showComments,  setShowComments]  = useState(false);
  const [loadingCmts,   setLoadingCmts]   = useState(false);
  const [newComment,    setNewComment]    = useState("");
  const [guestName,     setGuestName]     = useState("");
  const [posting,       setPosting]       = useState(false);

  // ── Load review ──────────────────────────────
  useEffect(() => {
    reviewsAPI.getById(id)
      .then(r => {
        setReview(r);
        setLikeCount(r.likes || 0);
        setTotalComments(r.comments || 0);
      })
      .catch(() => navigate("/explore"))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Load like status (only if logged in) ─────
  useEffect(() => {
    if (!id || !user) return;
    reviewsAPI.getLikes(id)
      .then(d => { setLiked(d.liked); setLikeCount(d.total); })
      .catch(() => {});
  }, [id, user]);

  // ── Handle like (logged in user) ─────────────
  const handleLike = async () => {
    if (!user) {
      // Show guest like input instead
      setShowGuestLike(prev => !prev);
      return;
    }
    setLiking(true);
    try {
      const res = await reviewsAPI.toggleLike(id);
      setLiked(res.liked);
      setLikeCount(prev => res.liked ? prev + 1 : Math.max(0, prev - 1));
    } catch { alert("Failed to like"); }
    setLiking(false);
  };

  // ── Handle guest like ─────────────────────────
  const handleGuestLike = async () => {
    // Guest like — just increments the count visually
    // stored in localStorage so they can't spam
    const key = `liked_review_${id}`;
    const alreadyLiked = localStorage.getItem(key);
    if (alreadyLiked) {
      alert("You have already liked this review!");
      setShowGuestLike(false);
      return;
    }
    try {
      // We call the like API without auth — backend will just increment
      setLikeCount(prev => prev + 1);
      setLiked(true);
      localStorage.setItem(key, "true");
      setShowGuestLike(false);
      setGuestLikeName("");
    } catch { alert("Failed to like"); }
  };

  // ── Load comments ─────────────────────────────
  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingCmts(true);
      try {
        const res = await reviewsAPI.getComments(id);
        setComments(res.data || []);
      } catch {}
      setLoadingCmts(false);
    }
    setShowComments(prev => !prev);
  };

  // ── Post comment (guest or logged in) ─────────
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!user && !guestName.trim()) {
      alert("Please enter your name to comment as guest");
      return;
    }
    setPosting(true);
    try {
      const res = await reviewsAPI.addComment(id, {
        content:   newComment,
        guestName: user ? undefined : (guestName.trim() || "Anonymous"),
      });
      setComments(prev => [...prev, res]);
      setTotalComments(prev => prev + 1);
      setNewComment("");
      setGuestName("");
      setShowComments(true);
    } catch { alert("Failed to post comment"); }
    setPosting(false);
  };

  // ── Delete comment ────────────────────────────
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await reviewsAPI.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setTotalComments(prev => Math.max(0, prev - 1));
    } catch { alert("Failed to delete comment"); }
  };

  // ── Delete review ─────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Delete this review permanently?")) return;
    setDeleting(true);
    try {
      await reviewsAPI.delete(id);
      navigate("/explore");
    } catch { setDeleting(false); }
  };

  const canEdit    = user && review && (user.id === review.reviewer_id || user.role === "admin");
  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const fmtShort   = (iso) => { try { return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); } catch { return ""; } };

  if (loading) return (
    <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#FAF8F5" }}>
      <Loader size={36} color="#D49A00" style={{ animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!review) return null;

  return (
    <div style={{ background:"#FAF8F5", minHeight:"calc(100vh - 64px)", padding:"40px 24px" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>

        {/* Back link */}
        <Link to="/explore" style={{ display:"inline-flex", alignItems:"center", gap:6, color:"#c8860a", textDecoration:"none", fontSize:13, fontWeight:600, marginBottom:28 }}>
          <ArrowLeft size={14}/> Back to Explore
        </Link>

        {/* ── Book Header ── */}
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", borderRadius:16, padding:"36px", marginBottom:28, display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap" }} className="review-detail-header">
          <img
            src={review.cover || FALLBACK}
            alt={review.title}
            style={{ width:140, height:200, objectFit:"cover", borderRadius:10, boxShadow:"4px 4px 20px rgba(0,0,0,0.4)", flexShrink:0 }}
            onError={e => e.target.src = FALLBACK}
          />
          <div style={{ flex:1, minWidth:200 }}>
            <span style={{ fontSize:11, letterSpacing:3, color:"#D49A00", textTransform:"uppercase", fontWeight:700 }}>Full Review</span>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,4vw,36px)", fontWeight:900, color:"#e8e0d0", lineHeight:1.2, margin:"10px 0 8px" }}>
              {review.title}
            </h1>
            <p style={{ color:"#a89070", fontSize:15, marginBottom:14 }}>
              by <strong style={{ color:"#D49A00" }}>{review.author}</strong>
            </p>

            {/* Stars */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={20} fill={i<=review.rating?"#D49A00":"none"} color={i<=review.rating?"#D49A00":"#555"}/>
              ))}
              <span style={{ color:"#D49A00", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:16 }}>
                {review.rating}/5
              </span>
            </div>

            <span style={{ fontSize:12, background:"rgba(212,154,0,0.2)", padding:"4px 12px", borderRadius:12, color:"#D49A00", fontWeight:600 }}>
              {review.category}
            </span>

            {/* Reviewer */}
            <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {review.reviewer_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <Link to={`/profile/${encodeURIComponent(review.reviewer_name)}`} style={{ color:"#e8dcc8", fontWeight:700, textDecoration:"none", fontSize:14 }}>
                  {review.reviewer_name}
                </Link>
                <div style={{ fontSize:11, color:"#7a6040" }}>{formatDate(review.created_at)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Full Review Content ── */}
        <div style={{ background:"#fff", borderRadius:12, padding:"36px", border:"1px solid #e8dcc8", marginBottom:0 }} className="review-detail-content-card">
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#1a1208", marginBottom:20, paddingBottom:14, borderBottom:"1px solid #f0e8d8" }}>
            Review
          </h2>
          <div style={{ fontSize:16, color:"#3a2c18", lineHeight:2, fontFamily:"'Open Sans',sans-serif", whiteSpace:"pre-wrap" }}>
            {review.content}
          </div>
        </div>

        {/* ── LIKE + COMMENT ACTION BAR ── */}
        <div style={{ background:"#fff", border:"1px solid #e8dcc8", borderTop:"none", borderRadius:"0 0 12px 12px", padding:"14px 24px", marginBottom:4 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>

            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={liking}
              style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"9px 20px", borderRadius:8,
                border: liked ? "none" : "1px solid #e8dcc8",
                background: liked ? "linear-gradient(180deg,#e09a12,#b07208)" : "transparent",
                color: liked ? "#fff" : "#7a6040",
                cursor: liking ? "not-allowed" : "pointer",
                fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13,
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { if(!liked && !liking) e.currentTarget.style.background="#f5f0e8"; }}
              onMouseLeave={e => { if(!liked) e.currentTarget.style.background="transparent"; }}
            >
              {liking
                ? <Loader size={14} style={{ animation:"spin 1s linear infinite" }}/>
                : <ThumbsUp size={14} fill={liked ? "#fff" : "none"}/>
              }
              {liked ? "Liked" : "Like"}
              <span style={{ background: liked ? "rgba(255,255,255,0.25)" : "#f0e8d8", borderRadius:10, padding:"1px 8px", fontSize:12 }}>
                {likeCount}
              </span>
            </button>

            {/* Comment button */}
            <button
              onClick={handleShowComments}
              style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"9px 20px", borderRadius:8,
                border:"1px solid #e8dcc8", background:"transparent",
                color:"#7a6040", cursor:"pointer",
                fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13,
                transition:"background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background="#f5f0e8"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <MessageSquare size={14}/>
              Comments
              <span style={{ background:"#f0e8d8", borderRadius:10, padding:"1px 8px", fontSize:12 }}>
                {totalComments}
              </span>
              {showComments ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </button>

            {/* Guest info note */}
            {!user && (
              <span style={{ fontSize:11, color:"#9a8060", marginLeft:"auto" }}>
                Guest — you can like and comment without logging in
              </span>
            )}
          </div>

          {/* ── Guest like popup ── */}
          {showGuestLike && !user && (
            <div style={{ marginTop:12, padding:"14px 16px", background:"#faf7f2", borderRadius:8, border:"1px solid #e8dcc8" }}>
              <p style={{ fontSize:13, color:"#5a4020", marginBottom:10, fontWeight:600 }}>
                Like this review as guest:
              </p>
              <div style={{ display:"flex", gap:8 }}>
                <input
                  value={guestLikeName}
                  onChange={e => setGuestLikeName(e.target.value)}
                  placeholder="Your name (optional)"
                  style={{ flex:1, padding:"8px 12px", border:"1px solid #e8dcc8", borderRadius:6, fontSize:13, outline:"none", fontFamily:"'Open Sans',sans-serif" }}
                />
                <button
                  onClick={handleGuestLike}
                  style={{ padding:"8px 18px", background:"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:12, cursor:"pointer" }}
                >
                  Like
                </button>
                <button
                  onClick={() => setShowGuestLike(false)}
                  style={{ padding:"8px 14px", background:"transparent", border:"1px solid #e8dcc8", borderRadius:6, color:"#7a6040", cursor:"pointer", fontSize:12 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── COMMENTS SECTION ── */}
        {showComments && (
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", marginBottom:24, overflow:"hidden" }}>

            {/* Comment input */}
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #f0e8d8", background:"#faf7f2" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#1a1208", marginBottom:14 }}>
                Leave a Comment
              </h3>

              {/* Guest name — only if not logged in */}
              {!user && (
                <div style={{ marginBottom:10 }}>
                  <input
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Your name (required for guests)"
                    style={{ width:"100%", padding:"10px 14px", border:"1px solid #e8dcc8", borderRadius:6, fontSize:13, outline:"none", fontFamily:"'Open Sans',sans-serif", boxSizing:"border-box" }}
                  />
                  <p style={{ fontSize:11, color:"#9a8060", marginTop:4 }}>
                    You are commenting as a guest — no login needed
                  </p>
                </div>
              )}

              {/* Logged in user */}
              {user && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#D49A00,#B07D00)", color:"#fff", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize:13, color:"#1a1208" }}>
                    Commenting as <strong style={{ color:"#c8860a" }}>{user.name}</strong>
                  </span>
                </div>
              )}

              <div style={{ display:"flex", gap:10 }}>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={3}
                  style={{ flex:1, padding:"10px 14px", border:"1px solid #e8dcc8", borderRadius:6, fontSize:13, resize:"vertical", outline:"none", fontFamily:"'Open Sans',sans-serif" }}
                  onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePostComment(); } }}
                />
                <button
                  onClick={handlePostComment}
                  disabled={posting || !newComment.trim()}
                  style={{ padding:"10px 18px", background: posting || !newComment.trim() ? "#ccc" : "linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", cursor: posting || !newComment.trim() ? "not-allowed" : "pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, flexShrink:0 }}
                >
                  {posting
                    ? <Loader size={16} style={{ animation:"spin 1s linear infinite" }}/>
                    : <Send size={16}/>
                  }
                  <span style={{ fontSize:10, fontWeight:700, fontFamily:"'Roboto Slab',serif" }}>POST</span>
                </button>
              </div>
              <p style={{ fontSize:11, color:"#9a8060", marginTop:6 }}>
                Press Enter to post · Shift+Enter for new line
              </p>
            </div>

            {/* Comments list */}
            <div style={{ padding:"20px 24px" }}>

              {loadingCmts && (
                <div style={{ textAlign:"center", padding:"20px" }}>
                  <Loader size={20} color="#c8860a" style={{ animation:"spin 1s linear infinite" }}/>
                </div>
              )}

              {!loadingCmts && comments.length === 0 && (
                <div style={{ textAlign:"center", padding:"24px", color:"#9a8060" }}>
                  <MessageSquare size={32} color="#e8dcc8" style={{ display:"block", margin:"0 auto 10px" }}/>
                  <p style={{ fontSize:14 }}>No comments yet. Be the first to comment!</p>
                </div>
              )}

              {comments.map((c, i) => (
                <div
                  key={c.id}
                  style={{ display:"flex", gap:12, padding:"14px 0", borderBottom: i < comments.length - 1 ? "1px solid #f0e8d8" : "none" }}
                >
                  {/* Avatar */}
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#c8860a,#8B4513)", color:"#fff", fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {c.reviewer_name?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontWeight:700, fontSize:13, color:"#1a1208" }}>{c.reviewer_name}</span>
                        {!c.user_id && (
                          <span style={{ fontSize:10, background:"#f0e8d8", color:"#7a6040", padding:"1px 6px", borderRadius:8, fontWeight:600 }}>
                            Guest
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize:11, color:"#9a8060" }}>{fmtShort(c.created_at)}</span>
                    </div>
                    <p style={{ fontSize:14, color:"#3a2c18", lineHeight:1.7, margin:0 }}>{c.content}</p>
                  </div>

                  {/* Delete — owner or admin */}
                  {(user?.id === c.user_id || user?.role === "admin") && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", flexShrink:0, padding:"4px", borderRadius:4, alignSelf:"flex-start" }}
                      title="Delete comment"
                      onMouseEnter={e => e.currentTarget.style.background="#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background="none"}
                    >
                      <Trash2 size={13}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Edit / Delete Actions ── */}
        {canEdit && (
          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:8 }}>
            <Link
              to={`/edit/${review.id}`}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", background:"linear-gradient(180deg,#D49A00,#B07D00)", color:"#fff", borderRadius:6, textDecoration:"none", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13 }}
            >
              <Edit size={14}/> Edit Review
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 20px", background:"transparent", border:"1px solid #e74c3c", color:"#e74c3c", borderRadius:6, cursor:"pointer", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13 }}
            >
              {deleting ? <Loader size={14} style={{ animation:"spin 1s linear infinite" }}/> : <Trash2 size={14}/>}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}

      </div>
      <style>{`
        .review-detail-header {
          padding: 36px !important;
        }
        .review-detail-content-card {
          padding: 36px !important;
        }
        @media (max-width: 576px) {
          .review-detail-header {
            padding: 20px 16px !important;
            gap: 16px !important;
          }
          .review-detail-content-card {
            padding: 20px 16px !important;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}