import { Star, Edit, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have this for permissions

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? "#c8860a" : "none"} color={i <= rating ? "#c8860a" : "#c8b898"} />
      ))}
    </span>
  );
}

export default function BookCard({ review, compact = false, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // To check if the logged-in user is the author or admin

  // Permission Logic
  const isAuthor = user && (user.id === review.userId || user.id === review.user_id);
  const isAdmin = user && user.role === 'admin';

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/review/${review.id || review._id}`);
  };

  if (compact) return (
    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e8dcc8", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <img 
          src={review.cover} 
          alt={review.title} 
          style={{ width: 54, height: 78, borderRadius: 3, objectFit: "cover", flexShrink: 0 }} 
          onError={(e) => e.target.src = "https://placehold.co/54x78/8B4513/FFF?text=Book"}
        />
        <div>
          <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, fontWeight: 700, color: "#1a1208", lineHeight: 1.3 }}>{review.title}</div>
          <div style={{ fontSize: 12, color: "#7a6040", marginTop: 2 }}>by {review.author}</div>
          <div style={{ marginTop: 4 }}><Stars rating={review.rating} /> <span style={{ fontSize: 11, color: "#c8860a", fontWeight: 600 }}>{review.rating}/5</span></div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c8860a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
          {review.reviewerName?.[0] || "U"}
        </div>
        <span style={{ fontSize: 12, color: "#5a4020" }}>{review.reviewerName}</span>
      </div>
      <p style={{ fontSize: 12, color: "#5a4020", lineHeight: 1.6 }}>{review.excerpt?.slice(0, 100) || review.content?.slice(0, 100)}...</p>
      <a href="#" onClick={handleNavigate} style={{ color: "#c8860a", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Read Full Review →</a>
    </div>
  );

  return (
    <article style={{ background: "#ede6d8", borderRadius: 5, border: "1px solid #c8b898", marginBottom: 14, overflow: "hidden", position: "relative" }}>
      
      {/* Management Buttons (Only visible to Author or Admin) */}
      {(isAuthor || isAdmin) && (
        <div style={{ position: "absolute", top: 12, right: 14, display: "flex", gap: 8 }}>
          {isAuthor && (
            <button 
              onClick={() => navigate(`/edit/${review.id}`)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7a6040" }}
              title="Edit Review"
            >
              <Edit size={16} />
            </button>
          )}
          <button 
            onClick={() => onDelete(review.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c" }}
            title="Delete Review"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 14px 6px" }}>
        <div style={{ paddingRight: (isAuthor || isAdmin) ? 60 : 0 }}>
          <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 20, fontWeight: 700, color: "#1a1208", lineHeight: 1.2 }}>{review.title}</div>
          <div style={{ fontSize: 13, color: "#2a1c0a", marginTop: 3 }}>Book by <span style={{ color: "#c8860a", fontWeight: 600 }}>{review.author}</span></div>
        </div>
        {!compact && review.comments !== undefined && (
            <div style={{ background: "#4a4a4a", color: "#fff", fontFamily: "'Roboto Slab',serif", fontWeight: 700, fontSize: 14, width: 36, height: 30, borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 10 }} className="comment-bubble">
                {review.comments}
            </div>
        )}
      </div>

      <div style={{ fontSize: 11, color: "#7a6040", padding: "0 14px 8px" }}>
        {new Date(review.createdAt || review.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        &nbsp;— <strong style={{ color: "#2a1c0a" }}>Review</strong> by {review.reviewerName}
        &nbsp;<Stars rating={review.rating} />
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #c8b898", margin: "0 14px" }} />

      <div style={{ display: "flex", gap: 12, padding: "12px 14px" }}>
        <div style={{ flexShrink: 0, width: 90, height: 130, borderRadius: 3, overflow: "hidden", boxShadow: "2px 2px 8px rgba(0,0,0,0.3)" }}>
          <img 
            src={review.cover} 
            alt={review.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            onError={(e) => e.target.src = "https://placehold.co/90x130/8B4513/FFF?text=Book"}
          />
        </div>
        <div style={{ fontSize: 13, color: "#3a2c18", lineHeight: 1.65, flex: 1 }}>
          {review.excerpt || (review.content?.substring(0, 300) + "...")}
          <a 
            href="#" 
            onClick={handleNavigate}
            style={{ color: "#c8860a", fontWeight: 600, fontSize: 13, textDecoration: "none", display: "block", marginTop: 8 }}
          >
            Continue Reading →
          </a>
        </div>
      </div>
    </article>
  );
}