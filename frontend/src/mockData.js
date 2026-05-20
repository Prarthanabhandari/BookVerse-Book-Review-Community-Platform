export const mockReviews = [
  {
    _id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    reviewerName: "Sarah K.",
    rating: 5,
    category: "Mystery & Thrillers",
    cover: "https://placehold.co/90x130/8B4513/FFF?text=Silent+Patient",
    excerpt: "A gripping masterpiece that kept me guessing until the end! The atmosphere was incredible and completely immersive.",
    content: "A gripping masterpiece that kept me guessing until the end. The atmosphere was incredible.",
    comments: 9, likes: 24,
    createdAt: "2024-05-13T00:00:00.000Z",
    featured: true,
  },
  {
    _id: "2",
    title: "Dune",
    author: "Frank Herbert",
    reviewerName: "John Fields",
    rating: 5,
    category: "Literature & Fiction",
    cover: "https://placehold.co/90x130/C8860A/FFF?text=Dune",
    excerpt: "An epic of science fiction that redefined the genre. Herbert builds a universe so rich and detailed it feels lived-in.",
    content: "Frank Herbert's masterwork. An epic of science fiction that redefined the entire genre.",
    comments: 15, likes: 41,
    createdAt: "2024-04-20T00:00:00.000Z",
    featured: true,
  },
  {
    _id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    reviewerName: "Steven Taylor",
    rating: 4,
    category: "Business & Investing",
    cover: "https://placehold.co/90x130/3D5A80/FFF?text=Atomic+Habits",
    excerpt: "Practical, actionable, and genuinely life-changing. Clear breaks down the science of habit formation.",
    content: "James Clear has written the definitive book on habits. Practical and actionable.",
    comments: 24, likes: 58,
    createdAt: "2024-04-10T00:00:00.000Z",
    featured: true,
  },
  {
    _id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    reviewerName: "Sarah Moore",
    rating: 4,
    category: "Literature & Fiction",
    cover: "https://placehold.co/90x130/556B2F/FFF?text=Gatsby",
    excerpt: "A timeless portrait of the American Dream — beautiful prose, tragic characters.",
    content: "Fitzgerald's prose is luminous. A timeless portrait of the American Dream.",
    comments: 7, likes: 19,
    createdAt: "2024-03-15T00:00:00.000Z",
    featured: false,
  },
  {
    _id: "5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    reviewerName: "Mark O.",
    rating: 5,
    category: "History",
    cover: "https://placehold.co/90x130/4A4A4A/FFF?text=Sapiens",
    excerpt: "A sweeping history of humankind that will permanently change how you see the world.",
    content: "Harari's sweeping history of humankind is one of the most thought-provoking books I've ever read.",
    comments: 12, likes: 33,
    createdAt: "2024-02-28T00:00:00.000Z",
    featured: true,
  },
];

export const mockReviewers = [
  { _id: "r1", name: "Sarah K.",      reviewCount: 25, avatar: "https://placehold.co/48x48/8B4513/FFF?text=SK" },
  { _id: "r2", name: "Sarah Moore",   reviewCount: 14, avatar: "https://placehold.co/48x48/C8860A/FFF?text=SM" },
  { _id: "r3", name: "John Fields",   reviewCount: 13, avatar: "https://placehold.co/48x48/3D5A80/FFF?text=JF" },
  { _id: "r4", name: "Steven Taylor", reviewCount: 10, avatar: "https://placehold.co/48x48/556B2F/FFF?text=ST" },
  { _id: "r5", name: "Mark O.",       reviewCount:  5, avatar: "https://placehold.co/48x48/4A4A4A/FFF?text=MO" },
];

export const mockArchives = [
  { label: "May 2024",      count: 3 },
  { label: "April 2024",    count: 5 },
  { label: "March 2024",    count: 4 },
  { label: "February 2024", count: 2 },
  { label: "January 2024",  count: 6 },
  { label: "December 2023", count: 3 },
];

export const CATEGORIES = [
  "Biographies & Memoirs", "Business & Investing", "Children's Books",
  "Christian Books", "Comics & Graphic Novels", "Computers & Internet",
  "Cooking, Food & Wine", "Entertainment", "Health, Mind & Body",
  "History", "Home & Garden", "Literature & Fiction", "Mystery & Thrillers",

  // 🔥 NEW UNIQUE CATEGORIES (cleaned)
  "Fantasy",
  "Science Fiction",
  "Horror",
  "Romance",
  "Historical Fiction",
  "Adventure",

  "Autobiography",
  "Self-Help",
  "True Crime",

  "Investing",
  "Entrepreneurship",
  "Marketing",
  "Startups",

  "Motivation",
  "Productivity",
  "Mindfulness",
  "Habits",
  "Success",

  "Computer Science",
  
  "World History",
  "Indian History",
  "Politics",
  "Government",

  "Hinduism",
  "Buddhism",
  "Islam",
  "Meditation",

  "School Books",
  "College Textbooks",
  "Competitive Exams",


  "Travel",
  "Fashion",
  "Fitness",
  "Gardening",

  "Kids Stories",
  "Fairy Tales",
  "Teen Fiction",

  "Love Stories",
  "Drama",
  "Emotional Fiction",

  "Detective Stories",
  "Crime",
  "Suspense",

  "Ghost Stories",
  "Supernatural",

  "Survival",
  "Exploration",

  "Emotional Stories",
  "Plays",

  "Legal Studies",
  "Case Studies",

  "Mental Health",
  "Diet",
  "Yoga"
];

export const mockBlogroll = [
  "Development Blog", "Documentation", "Plugins",
  "Suggest Ideas", "Support Forum", "Themes", "WordPress Planet",
];