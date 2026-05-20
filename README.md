# BookVerse – Book Review & Community Platform

**BookVerse** is a modern full-stack web application developed as part of the Masters of Computer Application (MCA) program at **K.B. [cite_start]Joshi Institute of Information Technology, Pune**[cite: 1, 2, 121]. [cite_start]It provides a centralized, dynamic digital environment where book enthusiasts can explore literary works, publish comprehensive text reviews, assign 1-5 ratings, and engage through active community discussions[cite: 17, 19, 48].

[cite_start]The application effectively replaces scattered, manual review mechanisms with a robust computerized framework designed with role-based access controls and real-time community indicators[cite: 18, 89, 123, 128].

---

## 🚀 Key Features

### 👤 User Module (Guest & Registered Members)
- [cite_start]**Dynamic Book Exploration:** Browse and filter books across diverse genres and categories from an interactive sidebar[cite: 51, 110].
- [cite_start]**Live Search Implementation:** Real-time search query matching to find books and reviews immediately (e.g., searching for keywords like *Ikigai*)[cite: 51, 110].
- [cite_start]**Smart ISBN Integration:** Programmatic book metadata and cover illustration extraction utilizing the external **Open Library API**.
- [cite_start]**Comprehensive CRUD Operations:** Registered members can write, edit, and safely delete their own reading logs or book reviews through their personalized dashboard[cite: 48, 56, 111].
- [cite_start]**Interactive Community Engine:** Share thoughts by liking and commenting on reviews created by other community members[cite: 19, 53].
- [cite_start]**Best Books Ranking System:** An automated sorting mechanism that handles user metrics, ratings, and total counts to bubble up trending literature[cite: 21, 22, 54].

### 👑 Admin Module
- [cite_start]**Protected Administrative Portal:** Secure entry validation restricted to authorized personnel (e.g., `prarthanabhandari2003@gmail.com`)[cite: 110, 114].
- [cite_start]**Platform Analytics Dashboard:** Central visual analytics console displaying real-time platform statistics utilizing **Chart.js** data structures[cite: 51, 102, 109].
- [cite_start]**Content Moderation Console:** Ability to monitor, toggle home-screen feature parameters, and drop inappropriate reviews or comments from the main tables[cite: 26, 57, 110].
- [cite_start]**Inbound Message Feed:** Read and address queries submitted via the public contact forms[cite: 57, 111].

---

## 🛠️ Technology Stack

### Frontend Architecture
- [cite_start]**Framework:** React.js (v18.2) initialized via **Vite** tooling [cite: 101, 102]
- [cite_start]**Routing Engine:** React Router DOM (v6) for seamless client-side single-page mapping [cite: 102, 143]
- [cite_start]**API Wrapper Client:** Axios for asynchronous HTTP promise handling to backend routes [cite: 102, 147]
- [cite_start]**Design & Interface:** Lucide React for consistent interface icon primitives [cite: 102, 147]
- [cite_start]**Data Visualization:** Chart.js with `react-chartjs-2` canvas wrappers [cite: 102, 148]

### Backend & API Framework
- [cite_start]**Runtime System:** Node.js [cite: 24, 101]
- [cite_start]**Server Wrapper:** Express.js (v4.18) [cite: 24, 102]
- [cite_start]**Access Control Security:** Stateless JSON Web Tokens (JWT) coupled with `bcryptjs` password cryptographic hashing [cite: 103, 131, 146]
- [cite_start]**Cross-Origin Configuration:** CORS middleware management [cite: 103]

### Persistent Data Tier
- [cite_start]**Database Engine:** PostgreSQL (v15.4) relational platform [cite: 24, 102]
- [cite_start]**Driver Wrapper:** `pg` (Node-Postgres) client pool connection wrapper [cite: 103]

---

## 📊 Database Schema (PostgreSQL)

[cite_start]The system relies on five interconnected tables built using explicit cascading criteria and domain constraints[cite: 104, 107]:

```sql
-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar VARCHAR(255),
    bio TEXT,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. REVIEWS TABLE
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INT REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100),
    cover VARCHAR(255),
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. CONTACTS TABLE
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. LIKES TABLE
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_like UNIQUE (review_id, user_id)
);

-- 5. COMMENTS TABLE
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    review_id INT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

git clone [https://github.com/your-username/BookVerse.git](https://github.com/your-username/BookVerse.git)
cd BookVerse

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/bookverse
JWT_SECRET=your_super_complex_random_secret_string
CORS_ORIGIN=http://localhost:5173

# Navigate to backend context
cd backend

# Install dependencies
npm install

# Initialize your PostgreSQL schemas using the scripts provided above
# Run server with hot-reloading active
npm run dev



# Open up a separate shell window and navigate to frontend context
cd frontend

# Install UI layer components
npm install

# Fire up Vite dev engine
npm run dev
