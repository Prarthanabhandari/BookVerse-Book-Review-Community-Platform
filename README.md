# BookVerse – Book Review & Community Platform

**BookVerse** is a modern full-stack web application developed as part of the Masters of Computer Application (MCA) program at **K.B. Joshi Institute of Information Technology, Pune**. It provides a centralized, dynamic digital environment where book enthusiasts can explore literary works, publish comprehensive text reviews, assign 1-5 ratings, and engage through active community discussions.

The application replaces scattered, manual review mechanisms with a robust computerized framework designed with role-based access controls and real-time community indicators.

---

## 🚀 Key Features

### 👤 User Module (Guest & Registered Members)
- **Dynamic Book Exploration:** Browse and filter books across diverse genres and categories from an interactive sidebar.
- **Live Search Integration:** Real-time search query matching to find books and reviews immediately (e.g., searching for keywords like *Ikigai*).
- **Smart ISBN Integration:** Programmatic book metadata and cover illustration extraction utilizing the external **Open Library API**.
- **Comprehensive CRUD Operations:** Registered members can write, edit, and safely delete their own reading logs or book reviews through their personalized dashboard.
- **Interactive Community Engine:** Share thoughts by liking and commenting on reviews created by other community members.
- **Best Books Ranking System:** An automated sorting mechanism that handles user metrics, ratings, and total counts to bubble up trending literature.

### 👑 Admin Module
- **Protected Administrative Portal:** Secure entry validation restricted to authorized personnel (e.g., `prarthanabhandari2003@gmail.com`).
- **Platform Analytics Dashboard:** Central visual analytics console displaying real-time platform statistics utilizing **Chart.js** data structures.
- **Content Moderation Console:** Ability to monitor, toggle home-screen feature parameters, and drop inappropriate reviews or comments from the main tables.
- **Inbound Message Feed:** Read and address queries submitted via the public contact forms.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React.js (v18.2) initialized via **Vite** tooling
- **Routing Engine:** React Router DOM (v6) for seamless client-side single-page mapping
- **API Wrapper Client:** Axios for asynchronous HTTP promise handling to backend routes
- **Design & Interface:** Lucide React for consistent interface icon primitives
- **Data Visualization:** Chart.js with `react-chartjs-2` canvas wrappers

### Backend & API Framework
- **Runtime System:** Node.js
- **Server Wrapper:** Express.js (v4.18)
- **Access Control Security:** Stateless JSON Web Tokens (JWT) coupled with `bcryptjs` password cryptographic hashing
- **Cross-Origin Configuration:** CORS middleware management

### Persistent Data Tier
- **Database Engine:** PostgreSQL (v15.4) relational platform
- **Driver Wrapper:** `pg` (Node-Postgres) client pool connection wrapper

---

## 📊 Database Schema (PostgreSQL)

The system relies on five interconnected tables built using explicit cascading criteria and domain constraints:

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
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Prarthanabhandari/BookVerse-Book-Review-Community-Platform.git
cd BookVerse-Book-Review-Community-Platform
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookverse
DB_USER=postgres
DB_PASS=your_database_password
JWT_SECRET=your_super_complex_random_secret_string
FRONTEND_URL=http://localhost:5173
```

### 3. Setup the Backend
```bash
cd backend
npm install
# Initialize the tables in your PostgreSQL database instance using the SQL script above
npm run dev
```

### 4. Setup the Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The application will now be running locally at `http://localhost:5173` with the backend API listening at `http://localhost:5000`.
