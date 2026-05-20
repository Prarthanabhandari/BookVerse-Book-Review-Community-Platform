// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import ThemeToggle    from "./components/ThemeToggle";   // ← ADD THIS
import Home           from "./pages/Home";
import Explore        from "./pages/Explore";
import Write          from "./pages/Write";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import About          from "./pages/About";
import Contact        from "./pages/Contact";
import MyReviews      from "./pages/MyReviews";
import Profile        from "./pages/Profile";
import ReviewDetail   from "./pages/ReviewDetail";
import EditReview     from "./pages/EditReview";
import AdminDashboard from "./pages/AdminDashboard";
import AllReviewers   from "./pages/AllReviewers";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user)               return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--color-base)" }}>

      {/* ── Theme switcher — fixed right side, site-wide ── */}
      <ThemeToggle />

      <Navbar />

      <main style={{ flex:1 }}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/explore"         element={<Explore />} />
          <Route path="/about"           element={<About />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/write"           element={<Write />} />
          <Route path="/review/:id"      element={<ReviewDetail />} />
          <Route path="/profile/:name"   element={<Profile />} />
          <Route path="/all-reviewers"   element={<AllReviewers />} />
          <Route path="/my-reviews"      element={<PrivateRoute><MyReviews /></PrivateRoute>} />
          <Route path="/edit/:id"        element={<PrivateRoute><EditReview /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
