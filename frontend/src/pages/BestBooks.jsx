import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy, Star, BookOpen, TrendingUp, ThumbsUp,
  MessageSquare, Send, Trash2, ChevronDown, ChevronUp,
  ArrowLeft, Loader, User
} from "lucide-react";
import { reviewsAPI } from "../api";
import { useAuth } from "../context/AuthContext";

// ── Star display ──────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i} size={size}
          fill={i <= rating ? "#c8860a" : "none"}
          color={i <= rating ? "#c8860a" : "#c8b898"}
        />
      ))}
    </span>
  );
}

// ── Single review card with like + comment ────
function ReviewCard({ review, user, onLikeToggle }) {
  const [liked,       setLiked]       = useState(false);
  const [likeCount,   setLikeCount]   = useState(review.likes || 0);
  const [comments,    setComments]    = useState([]);
  const [totalComments, setTotalComments] = useState(review.comments || 0);
  const [showComments,  setShowComments]  = useState(false);
  const [newComment,  setNewComment]  = useState("");
  const [guestName,   setGuestName]   = useState("");
  const [posting,     setPosting]     = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    reviewsAPI.getLikes(review.id).then(d => {
      setLiked(d.liked);
      setLikeCount(d.total);
    }).catch(() => {});
  }, [review.id]);

  const handleLike = async () => {
    if (!user) { alert("Please login to like a review"); return; }
    try {
      const res = await reviewsAPI.toggleLike(review.id);
      setLiked(res.liked);
      setLikeCount(prev => res.liked ? prev + 1 : Math.max(0, prev - 1));
      if (onLikeToggle) onLikeToggle();
    } catch(e) { alert("Failed to like"); }
  };

  const handleShowComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const res = await reviewsAPI.getComments(review.id);
        setComments(res.data || []);
      } catch {}
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await reviewsAPI.addComment(review.id, {
        content:   newComment,
        guestName: guestName || "Anonymous",
      });
      setComments(prev => [...prev, res]);
      setTotalComments(prev => prev + 1);
      setNewComment("");
      setGuestName("");
      if (!showComments) setShowComments(true);
    } catch { alert("Failed to post comment"); }
    setPosting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await reviewsAPI.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setTotalComments(prev => Math.max(0, prev - 1));
    } catch { alert("Failed to delete"); }
  };

  const fmt = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); }
    catch { return ""; }
  };

  return (
    <div style={{ background:"#fff", borderRadius:8, border:"1px solid #e8dcc8", marginBottom:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Review body */}
      <div style={{ display:"flex", gap:14, padding:"16px 18px" }}>
        {/* Cover */}
        <img
          src={review.cover || `https://placehold.co/54x76/8B4513/FFF?text=Book`}
          alt={review.title}
          style={{ width:54, height:76, objectFit:"cover", borderRadius:4, flexShrink:0, boxShadow:"2px 2px 8px rgba(0,0,0,0.15)" }}
          onError={e => e.target.src="https://placehold.co/54x76/8B4513/FFF?text=Book"}
        />
        <div style={{ flex:1, minWidth:0 }}>
          {/* Reviewer */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#e09a12,#b07208)", color:"#fff", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {review.reviewer_name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#1a1208" }}>{review.reviewer_name}</div>
              <div style={{ fontSize:11, color:"#9a8060" }}>{fmt(review.created_at)}</div>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <Stars rating={review.rating} />
              <span style={{ fontSize:11, color:"#c8860a", fontWeight:600, marginLeft:4 }}>{review.rating}/5</span>
            </div>
          </div>

          {/* Excerpt */}
          <p style={{ fontSize:13, color:"#5a4020", lineHeight:1.7, margin:0 }}>
            {review.excerpt || review.content?.slice(0, 200) + "..."}
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 18px", borderTop:"1px solid #f0e8d8", background:"#fdfaf6" }}>
        {/* Like button */}
        <button
          onClick={handleLike}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"6px 14px", borderRadius:6,
            border: liked ? "none" : "1px solid #e8dcc8",
            background: liked ? "linear-gradient(180deg,#e09a12,#b07208)" : "transparent",
            color: liked ? "#fff" : "#7a6040",
            cursor:"pointer", fontSize:12, fontWeight:700,
            fontFamily:"'Roboto Slab',serif",
            transition:"all 0.2s",
          }}
          onMouseEnter={e => { if(!liked) e.currentTarget.style.background="#f5f0e8"; }}
          onMouseLeave={e => { if(!liked) e.currentTarget.style.background="transparent"; }}
        >
          <ThumbsUp size={13} fill={liked ? "#fff" : "none"} />
          {liked ? "Liked" : "Like"} · {likeCount}
        </button>

        {/* Comment toggle */}
        <button
          onClick={handleShowComments}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:6, border:"1px solid #e8dcc8", background:"transparent", color:"#7a6040", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Roboto Slab',serif" }}
          onMouseEnter={e => e.currentTarget.style.background="#f5f0e8"}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}
        >
          <MessageSquare size={13} />
          Comments · {totalComments}
          {showComments ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ padding:"14px 18px", borderTop:"1px solid #f0e8d8", background:"#faf7f2" }}>

          {/* Comment input */}
          <div style={{ marginBottom:14 }}>
            {!user && (
              <input
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Your name (optional)"
                style={{ width:"100%", padding:"8px 12px", border:"1px solid #e8dcc8", borderRadius:6, fontSize:12, marginBottom:8, outline:"none", fontFamily:"'Open Sans',sans-serif", boxSizing:"border-box" }}
              />
            )}
            <div style={{ display:"flex", gap:8 }}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                style={{ flex:1, padding:"8px 12px", border:"1px solid #e8dcc8", borderRadius:6, fontSize:12, resize:"none", outline:"none", fontFamily:"'Open Sans',sans-serif" }}
                onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handlePostComment(); } }}
              />
              <button
                onClick={handlePostComment}
                disabled={posting || !newComment.trim()}
                style={{ padding:"8px 14px", background: posting || !newComment.trim() ? "#ccc" : "linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", cursor: posting || !newComment.trim() ? "not-allowed" : "pointer", display:"flex", alignItems:"center", gap:4, flexShrink:0 }}
              >
                {posting ? <Loader size={14} style={{ animation:"spin 1s linear infinite" }}/> : <Send size={14}/>}
              </button>
            </div>
          </div>

          {/* Loading comments */}
          {loadingComments && (
            <div style={{ textAlign:"center", padding:"10px", color:"#7a6040" }}>
              <Loader size={16} color="#c8860a" style={{ animation:"spin 1s linear infinite" }}/>
            </div>
          )}

          {/* Comments list */}
          {!loadingComments && comments.length === 0 && (
            <p style={{ fontSize:12, color:"#9a8060", textAlign:"center", padding:"8px 0" }}>
              No comments yet. Be the first!
            </p>
          )}

          {comments.map(c => (
            <div key={c.id} style={{ display:"flex", gap:10, marginBottom:10, padding:"10px 12px", background:"#fff", borderRadius:6, border:"1px solid #f0e8d8" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#c8860a,#8B4513)", color:"#fff", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {c.reviewer_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:12, color:"#1a1208" }}>{c.reviewer_name}</span>
                  <span style={{ fontSize:10, color:"#9a8060" }}>{fmt(c.created_at)}</span>
                </div>
                <p style={{ fontSize:12, color:"#5a4020", margin:0, lineHeight:1.6 }}>{c.content}</p>
              </div>
              {(user?.id === c.user_id || user?.role === "admin") && (
                <button onClick={() => handleDeleteComment(c.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", flexShrink:0, padding:2 }}>
                  <Trash2 size={12}/>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main BestBooks page ────────────────────────
export default function BestBooks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bestBooks,    setBestBooks]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [expandedBook, setExpandedBook] = useState(null);

  useEffect(() => {
    reviewsAPI.getBestBooks().then(data => {
      setBestBooks(data || []);
    }).catch(() => setBestBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const rankBg = (i) => ({
    0: "linear-gradient(135deg,#D4AF37,#B8860B)",
    1: "linear-gradient(135deg,#C0C0C0,#909090)",
    2: "linear-gradient(135deg,#CD7F32,#8B4513)",
  }[i] || "linear-gradient(135deg,#5a4020,#3a2810)");

  return (
    <div style={{ background:"#f5f0e8", minHeight:"calc(100vh - 64px)", padding:"32px 24px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/explore")}
          style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#c8860a", cursor:"pointer", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, marginBottom:24, padding:0 }}
        >
          <ArrowLeft size={16}/> Back to Explore
        </button>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2710)", borderRadius:12, padding:"28px 32px", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <Trophy size={32} color="#c8860a"/>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:"#e8e0d0", margin:0 }}>
              Best Books
            </h1>
          </div>
          <p style={{ color:"#a89070", fontSize:14, margin:0, display:"flex", alignItems:"center", gap:6 }}>
            <TrendingUp size={14}/>
            Ranked by average rating · number of reviews · total likes
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"60px", color:"#7a6040" }}>
            <Loader size={36} color="#c8860a" style={{ animation:"spin 1s linear infinite", display:"block", margin:"0 auto 12px" }}/>
            <p>Loading best books...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && bestBooks.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px", background:"#ede6d8", borderRadius:12, border:"1px dashed #c8b898" }}>
            <BookOpen size={48} color="#c8b898" style={{ display:"block", margin:"0 auto 16px" }}/>
            <p style={{ color:"#7a6040", fontSize:15, marginBottom:8 }}>No books yet.</p>
            <button onClick={() => navigate("/write")} style={{ padding:"10px 24px", background:"linear-gradient(180deg,#e09a12,#b07208)", border:"none", borderRadius:6, color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              Write First Review
            </button>
          </div>
        )}

        {/* Books list */}
        {!loading && bestBooks.map((book, i) => (
          <div key={`${book.book_title}-${i}`} style={{ background:"#fff", borderRadius:12, border:"1px solid #e8dcc8", marginBottom:20, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>

            {/* Book header */}
            <div style={{ display:"flex", gap:16, padding:"20px 24px", alignItems:"flex-start" }} className="best-book-row">

              {/* Rank */}
              <div style={{ width:48, height:48, borderRadius:"50%", flexShrink:0, background:rankBg(i), color:"#fff", fontFamily:"'Roboto Slab',serif", fontWeight:900, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
                #{i+1}
              </div>

              {/* Cover */}
              <img
                src={book.cover || `https://placehold.co/70x100/8B4513/FFF?text=Book`}
                alt={book.book_title}
                style={{ width:70, height:100, objectFit:"cover", borderRadius:6, flexShrink:0, boxShadow:"3px 3px 10px rgba(0,0,0,0.2)" }}
                onError={e => e.target.src="https://placehold.co/70x100/8B4513/FFF?text=Book"}
              />

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1a1208", margin:"0 0 4px" }}>
                  {book.book_title}
                </h2>
                <div style={{ fontSize:14, color:"#c8860a", marginBottom:12 }}>by {book.author_name}</div>

                {/* Stats */}
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }} className="best-book-stats">
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", background:"#faf0d8", border:"1px solid #f0d890", borderRadius:20 }}>
                    <Star size={12} fill="#c8860a" color="#c8860a"/>
                    <span style={{ fontSize:12, fontWeight:700, color:"#8B4513" }}>{book.avg_rating} avg rating</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", background:"#f0f8f0", border:"1px solid #c0e0c0", borderRadius:20 }}>
                    <BookOpen size={12} color="#2a7a2a"/>
                    <span style={{ fontSize:12, fontWeight:700, color:"#2a7a2a" }}>{book.review_count} review{book.review_count > 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", background:"#f8f0f8", border:"1px solid #e0c0e0", borderRadius:20 }}>
                    <ThumbsUp size={12} color="#7a2a7a"/>
                    <span style={{ fontSize:12, fontWeight:700, color:"#7a2a7a" }}>{book.total_likes} likes</span>
                  </div>
                  {book.category && (
                    <div style={{ padding:"4px 12px", background:"#f0f0f8", border:"1px solid #c0c0e0", borderRadius:20 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"#2a2a7a" }}>{book.category}</span>
                    </div>
                  )}
                </div>

                {/* Expand/collapse reviews */}
                <button
                  onClick={() => setExpandedBook(expandedBook === i ? null : i)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", background: expandedBook === i ? "linear-gradient(180deg,#e09a12,#b07208)" : "transparent", border:"1px solid #c8860a", borderRadius:6, color: expandedBook === i ? "#fff" : "#c8860a", fontFamily:"'Roboto Slab',serif", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}
                >
                  <MessageSquare size={13}/>
                  {expandedBook === i ? "Hide Reviews" : `Read All ${book.review_count} Review${book.review_count > 1 ? "s" : ""}`}
                  {expandedBook === i ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                </button>
              </div>
            </div>

            {/* Expanded reviews with like + comment */}
            {expandedBook === i && (
              <div style={{ borderTop:"1px solid #f0e8d8", padding:"16px 24px", background:"#faf7f2" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#1a1208", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                  <User size={16} color="#c8860a"/> All Reviews for {book.book_title}
                </h3>
                {(book.all_reviews || []).map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 576px) {
          .best-book-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 16px !important;
          }
          .best-book-row img {
            margin: 10px 0 !important;
          }
          .best-book-stats {
            justify-content: center !important;
          }
          .best-book-row button {
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
}