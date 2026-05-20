import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("bookverse_user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data).then(r => r.data),
  login:    (data) => api.post("/auth/login",    data).then(r => r.data),
  getMe:    ()     => api.get("/auth/me").then(r => r.data),
};

export const reviewsAPI = {
  getAll: (page=1, limit=10, category="") =>
    api.get("/reviews", {
      params: {
        page,
        limit,
        ...(category ? { category: category.trim() } : {}),
      }
    }).then(r => r.data),

  getRecent:       () => api.get("/reviews/recent").then(r => r.data),
  getFeatured:     () => api.get("/reviews/featured").then(r => r.data),
  getTopReviewers: () => api.get("/reviews/top-reviewers").then(r => r.data),
  getArchives:     () => api.get("/reviews/archives").then(r => r.data),
  getStats:        () => api.get("/reviews/stats").then(r => r.data),
  getById:         (id)      => api.get(`/reviews/${id}`).then(r => r.data),
  search:          (q)       => api.get("/reviews/search", { params:{ q } }).then(r => r.data),
  create:          (data)    => api.post("/reviews", data).then(r => r.data),
  update:          (id,data) => api.put(`/reviews/${id}`, data).then(r => r.data),
  delete:          (id)      => api.delete(`/reviews/${id}`).then(r => r.data),
  getMyReviews:    ()        => api.get("/reviews/my-reviews").then(r => r.data),
  toggleFeatured:  (id)      => api.put(`/reviews/${id}/feature`).then(r => r.data),
// Add inside reviewsAPI:
getBestBooks:   ()           => api.get("/reviews/best-books").then(r => r.data),
getLikes:       (id)         => api.get(`/reviews/${id}/likes`).then(r => r.data),
toggleLike:     (id)         => api.post(`/reviews/${id}/like`).then(r => r.data),
getComments:    (id)         => api.get(`/reviews/${id}/comments`).then(r => r.data),
addComment:     (id, data)   => api.post(`/reviews/${id}/comments`, data).then(r => r.data),
deleteComment:  (commentId)  => api.delete(`/reviews/comments/${commentId}`).then(r => r.data),
  adminGetReviews: (q="") =>
    api.get("/reviews/admin/reviews", q ? { params:{ q } } : {})
      .then(r => r.data).catch(() => ({ data:[], total:0 })),

  adminGetUsers:   () =>
    api.get("/reviews/admin/users").then(r => r.data).catch(() => []),

  adminDeleteUser: (id) =>
    api.delete(`/reviews/admin/users/${id}`).then(r => r.data),

  submitContact:    (data) => api.post("/reviews/contact", data).then(r => r.data),
  adminGetContacts: ()     => api.get("/reviews/admin/contacts").then(r => r.data).catch(() => []),
  markContactRead:  (id)   => api.put(`/reviews/admin/contacts/${id}/read`).then(r => r.data),
};

export default api;