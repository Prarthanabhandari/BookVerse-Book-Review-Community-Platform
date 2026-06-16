# 📚 BOOKVERSE — Book Review & Community Platform

<div align="center">

> *"Every book you read becomes a permanent insight."*
> *— Inspired by Derek Sivers*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.22-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)

**A full-stack web application where readers discover books, write structured reviews, and build a permanent digital reading legacy.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Installation](#-installation) · [API](#-api-reference) · [Database](#-database-schema) · [Screenshots](#-screenshots)

</div>

---

## 🌟 What is BookVerse?

BookVerse is a **community-driven book review platform** built with React, Node.js, Express, and PostgreSQL. It replaces scattered, unstructured book notes with a single searchable platform where readers can write detailed reviews, discover books through community opinions, and admins can curate featured content.

The platform supports **three user roles**:

| Role | Access |
|------|--------|
| 🌐 **Guest** | Browse, search, filter, read reviews, submit a review with name only |
| 👤 **Registered User** | Personal dashboard, edit/delete own reviews, reviewer profile |
| 🛡️ **Admin** | Full admin dashboard, moderation, feature toggle, user management |

---

## ✨ Features

### 🏠 Home Page
- Animated live statistics pulled directly from PostgreSQL
- Featured Community Reviews — admin-curated 2×3 grid
- Genre filter pills for instant category filtering
- Each card links to `/review/:id`

### 🔍 Explore Page
- Vintage three-column layout (Left Sidebar · Main Feed · Right Sidebar)
- Real-time category filtering via PostgreSQL `WHERE category = $1`
- Full-text search across title, author, category, and content
- Clickable Recent 10 Reviews — each linked to `/review/:id`
- Top 5 Reviewers with gold avatar circles
- Dynamic Archives grouped by month/year

### ✍️ Write Review
- **ISBN Auto-Fetch** — enter ISBN → cover loads from Open Library API
- Live preview card that updates as you type
- Guest support — submit without an account
- Star rating with hover highlight

### 👤 My Reading Legacy
- Personal stats: Total Reviews, Avg Rating, Categories, Latest date
- Grid of own review cards with Edit and Delete
- Edit navigates to `/edit/:id` with pre-filled form from PostgreSQL

### 🛡️ Admin Dashboard
- **Sidebar Navigation** — Dashboard · Reviews · Members · Categories · Messages · Settings
- **Clickable Stat Cards** — each filters the Book Reviews tab
- **Guest vs Member Doughnut Chart** — Chart.js
- **Moderation Table** — Feature, Delete, Reject & Message User
- **Contact Inbox** — messages with unread badge tracking
- **User Management** — view and remove members

### 🎨 Theme System
- Statically loaded variables on `:root` ensure instant rendering of the Classic Brown theme without flickers.
- Clean system structure with 4 preset palettes pre-configured in CSS: Classic Brown · Retro Blue · Sunset Warm · Vintage Earth.

### 🏆 Best Books Showcase
- **Quality Score Calculation**: Weighted PostgreSQL query sorts books dynamically by a quality score combining average rating (weight 40), total review count (weight 30), and total likes (weight 30).
- **Aggregated Reviews**: Lists best books with an aggregated JSON array containing all detailed reviewer ratings, contents, excerpts, and timestamps.
- **Dedicated Route**: Available publicly at `/best-books`.

### 💬 Likes & Comments System
- **One-Click Likes**: Registered users can toggle likes on reviews, instantly updating the database and updating likes count dynamically.
- **Robust Commenting Section**: Allows both registered members and guests (using a custom display name) to discuss book reviews.
- **Authorization-Aware Deletion**: Comment owners and platform administrators can delete comments, automatically decrementing comment counters on the review.

---

## 🛠️ Technology Stack

```
Frontend        React 19 (Vite) · React Router v7 · Axios
                Lucide React · Chart.js · react-chartjs-2
                CSS Variables (Classic Brown / default style)

Backend         Node.js · Express.js
                jsonwebtoken · bcryptjs · cors · dotenv

Database        PostgreSQL 15 · pg (node-postgres)

External API    Open Library API (ISBN → cover image)
```

---

## 📦 Dependencies

### Backend Dependencies
```bash
cd backend
npm install express pg bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.22.1 | Web server framework |
| `pg` | ^8.20.0 | PostgreSQL client for Node.js |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `dotenv` | ^16.6.1 | Environment variable management |
| `nodemon` | ^3.0.1 | Auto-restart during development |

### Frontend Dependencies
```bash
cd frontend
npm install axios react-router-dom lucide-react chart.js react-chartjs-2
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.4 | Core UI framework (comes with Vite) |
| `react-dom` | ^19.2.4 | DOM rendering (comes with Vite) |
| `react-router-dom` | ^7.14.0 | Client-side routing |
| `axios` | ^1.14.0 | HTTP requests to backend API |
| `lucide-react` | ^1.7.0 | Icon library |
| `chart.js` | ^4.5.1 | Doughnut chart in Admin Dashboard |
| `react-chartjs-2` | ^5.3.1 | React wrapper for Chart.js |

---

## 🚀 Step-by-Step Installation & Execution Guide

Follow these comprehensive steps to set up and run the BookVerse application on your local machine.

### Prerequisites
Before starting, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/) (usually bundled with Node.js)
*   [PostgreSQL Database](https://www.postgresql.org/) (v15 or higher recommended)
*   Git command-line utility

---

### Step 1 — Clone the Repository
Clone the codebase from GitHub to your local development environment:
```bash
git clone https://github.com/Prarthanabhandari/BookVerse-Book-Review-Community-Platform.git
cd BookVerse-Book-Review-Community-Platform
```

---

### Step 2 — PostgreSQL Database Setup
BookVerse uses a relational PostgreSQL database to store user credentials, book reviews, comments, and contact submissions. 

1. **Launch PostgreSQL CLI** (`psql`) or open a database management tool (like PGAdmin or DBeaver).
   ```bash
   psql -U postgres
   ```
   *(Enter your PostgreSQL password when prompted)*

2. **Run the Database DDL Scripts**:
   Copy and execute the following SQL commands to initialize the `bookverse` database, create all required tables, and configure structural constraints:
   ```sql
   -- Create database
   CREATE DATABASE bookverse;
   
   -- Connect to the newly created database
   \c bookverse

   -- 1. USERS TABLE
   CREATE TABLE users (
     id           SERIAL PRIMARY KEY,
     name         VARCHAR(100) NOT NULL,
     email        VARCHAR(100) UNIQUE NOT NULL,
     password     VARCHAR(255) NOT NULL,
     avatar       VARCHAR(255) DEFAULT '',
     bio          TEXT DEFAULT '',
     review_count INT DEFAULT 0,
     role         VARCHAR(20) DEFAULT 'user',
     created_at   TIMESTAMP DEFAULT NOW()
   );

   -- 2. REVIEWS TABLE
   CREATE TABLE reviews (
     id            SERIAL PRIMARY KEY,
     title         VARCHAR(255) NOT NULL,
     author        VARCHAR(255) NOT NULL,
     reviewer_id   INT REFERENCES users(id) ON DELETE CASCADE,
     reviewer_name VARCHAR(100) NOT NULL,
     rating        INT CHECK (rating >= 1 AND rating <= 5),
     content       TEXT NOT NULL,
     excerpt       TEXT,
     category      VARCHAR(100),
     cover         VARCHAR(255) DEFAULT '',
     comments      INT DEFAULT 0,
     likes         INT DEFAULT 0,
     featured      BOOLEAN DEFAULT false,
     created_at    TIMESTAMP DEFAULT NOW()
   );

   -- 3. CONTACTS TABLE
   CREATE TABLE contacts (
     id         SERIAL PRIMARY KEY,
     name       VARCHAR(100) NOT NULL,
     email      VARCHAR(100) NOT NULL,
     message    TEXT NOT NULL,
     read       BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- 4. LIKES TABLE
   CREATE TABLE likes (
     id         SERIAL PRIMARY KEY,
     review_id  INT REFERENCES reviews(id) ON DELETE CASCADE,
     user_id    INT REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW(),
     CONSTRAINT unique_like UNIQUE (review_id, user_id)
   );

   -- 5. COMMENTS TABLE
   CREATE TABLE comments (
     id            SERIAL PRIMARY KEY,
     review_id     INT REFERENCES reviews(id) ON DELETE CASCADE,
     user_id       INT REFERENCES users(id) ON DELETE SET NULL,
     reviewer_name VARCHAR(100) NOT NULL,
     content       TEXT NOT NULL,
     created_at    TIMESTAMP DEFAULT NOW()
   );
   
   -- Exit psql
   \q
   ```

---

### Step 3 — Backend Setup & Configuration
The Node.js/Express backend handles business logic, security middleware, and database operations.

1. **Navigate to the Backend Folder**:
   ```bash
   cd backend
   ```

2. **Install Server Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a file named `.env` in the root of the `backend/` directory:
   ```bash
   touch .env # Or create manually in your text editor
   ```
   Add the following environment variables to the `.env` file, adjusting the database credentials to match your local PostgreSQL configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bookverse
   DB_USER=postgres
   DB_PASS=your_postgres_password_here
   JWT_SECRET=BookVerse_super_secret_key_2024
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   
   # Secure Admin Account Configuration (Not exposed in code)
   ADMIN_EMAIL=your_admin_email@example.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Start the Backend Server**:
   You can run the server in standard mode or development hot-reload mode:
   * **Development Mode** (restarts automatically on code changes):
     ```bash
     npm run dev # runs: nodemon server.js
     ```
   * **Production/Standard Mode**:
     ```bash
     node server.js
     ```
   * *Expected Console Output*:
     ```text
     Server running on port 5000
     PostgreSQL Connected...
     ```

---

### Step 4 — Frontend Setup & Configuration
The React frontend is built on Vite, communicating with the backend API via proxy configurations.

1. **Navigate to the Frontend Folder** (from the project root):
   ```bash
   cd ../frontend
   ```

2. **Install Client-Side Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Dev Server**:
   ```bash
   npm run dev
   ```
   * *Expected Console Output*:
     ```text
       VITE v6.x.x  ready in X ms

       ➜  Local:   http://localhost:5173/
       ➜  Network: use --host to expose
     ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173/` to explore the BookVerse platform!

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    BROWSER  (React + Vite)                │
│                    http://localhost:5173                   │
│                                                            │
│       Navbar │ Pages (13 routes) │ AuthContext            │
└───────────────────────┬──────────────────────────────────┘
                        │  axios  /api/*
                        │  Vite proxy → localhost:5000
                        ▼
┌──────────────────────────────────────────────────────────┐
│                EXPRESS SERVER  (Node.js)                   │
│                http://localhost:5000                       │
│                                                            │
│   /api/auth/*      authRoutes    →  authController         │
│   /api/reviews/*   reviewRoutes  →  reviewController       │
│                                                            │
│   Middlewares: protect · optionalAuth · adminOnly          │
└───────────────────────┬──────────────────────────────────┘
                        │  pg Pool
                        ▼
┌──────────────────────────────────────────────────────────┐
│                  PostgreSQL 15  Database                   │
│                                                            │
│     ┌──────────┐  ┌──────────────┐  ┌──────────────┐     │
│     │  users   │  │   reviews    │  │   contacts   │     │
│     └──────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────┘
                        ▲
                        │  ISBN cover fetch
┌──────────────────────┴───────────────────────────────────┐
│               Open Library API  (external)                 │
│       covers.openlibrary.org/b/isbn/{isbn}-L.jpg           │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
BookVerse/
├── backend/
│   ├── config/
│   │   └── db.js                  PostgreSQL pool
│   ├── controllers/
│   │   ├── authController.js      register · login · getMe
│   │   └── reviewController.js    CRUD · admin · stats · contacts
│   ├── middlewares/
│   │   ├── authMiddleware.js      protect · optionalAuth · adminOnly
│   │   └── errorMiddleware.js     notFound · errorHandler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reviewRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── BookCard.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Explore.jsx
    │   │   ├── Write.jsx
    │   │   ├── ReviewDetail.jsx    /review/:id
    │   │   ├── EditReview.jsx      /edit/:id
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── MyReviews.jsx       /my-reviews
    │   │   ├── Profile.jsx         /profile/:name
    │   │   ├── AllReviewers.jsx    /all-reviewers
    │   │   ├── About.jsx
    │   │   ├── Contact.jsx
    │   │   └── AdminDashboard.jsx  /admin/dashboard
    │   ├── styles/index.css        global CSS + presets
    │   ├── api.js                  axios · authAPI · reviewsAPI
    │   ├── mockData.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js              proxy /api → localhost:5000
    └── package.json
```

---

## 🔐 Admin Credentials & Configuration

To keep system security robust, admin credentials are not hardcoded or publicly committed to version control. Instead, they are dynamically loaded from environment variables in your backend configuration.

To configure your admin user locally:
1. Open your `backend/.env` file.
2. Add your preferred admin credentials:
   ```env
   ADMIN_EMAIL=your_admin_email@example.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```
3. Register this user on the platform. The server automatically flags this email as `role: "admin"` upon registration. If the user already exists, the server updates their role to `admin` on the next login, granting them access to the **ADMIN DASHBOARD** navbar tab and all moderating capabilities.

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | None | Register |
| `POST` | `/api/auth/login` | None | Login → JWT |
| `GET` | `/api/auth/me` | JWT | Current user |

### Reviews — Public

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reviews` | None | All (paginated + `?category=`) |
| `GET` | `/api/reviews/stats` | None | Live counts |
| `GET` | `/api/reviews/featured` | None | Featured reviews |
| `GET` | `/api/reviews/recent` | None | Last 10 |
| `GET` | `/api/reviews/top-reviewers` | None | Top 5 |
| `GET` | `/api/reviews/archives` | None | By month/year |
| `GET` | `/api/reviews/search?q=` | None | Full-text search |
| `GET` | `/api/reviews/best-books` | None | Get top 20 best books by weighted score |
| `GET` | `/api/reviews/:id` | None | Single review |
| `GET` | `/api/reviews/:id/comments` | None | Get comments list for a review |
| `GET` | `/api/reviews/:id/likes` | None / JWT | Get total likes count and liked status |
| `POST` | `/api/reviews/contact` | None | Submit message |

### Reviews — Protected

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reviews/my-reviews` | JWT | Own reviews |
| `POST` | `/api/reviews` | Optional JWT | Create review |
| `PUT` | `/api/reviews/:id` | JWT + Owner/Admin | Update |
| `DELETE` | `/api/reviews/:id` | JWT + Owner/Admin | Delete |
| `POST` | `/api/reviews/:id/like` | JWT | Toggle like status on a review |
| `POST` | `/api/reviews/:id/comments` | Optional JWT | Add comment (logged in or guest name) |
| `DELETE` | `/api/reviews/comments/:commentId` | JWT | Delete comment (owner or admin only) |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PUT` | `/api/reviews/:id/feature` | Admin | Toggle featured |
| `GET` | `/api/reviews/admin/reviews` | Admin | All reviews |
| `GET` | `/api/reviews/admin/users` | Admin | All users |
| `DELETE` | `/api/reviews/admin/users/:id` | Admin | Remove user |
| `GET` | `/api/reviews/admin/contacts` | Admin | All messages |
| `PUT` | `/api/reviews/admin/contacts/:id/read` | Admin | Mark read |

---

## 🗃️ Database Schema

```
┌───────────────────────────┐        ┌─────────────────────────────────┐
│          USERS            │        │            REVIEWS               │
├───────────────────────────┤        ├─────────────────────────────────┤
│ PK id           SERIAL    │  1     │ PK id            SERIAL          │
│    name         VARCHAR   │───────▶│ FK reviewer_id   INT  (NULL ok) │
│    email        VARCHAR   │  N     │    reviewer_name VARCHAR         │
│    password     VARCHAR   │        │    title         VARCHAR         │
│    role         VARCHAR   │        │    author        VARCHAR         │
│    review_count INT       │        │    rating        INT  (1-5)      │
│    created_at   TIMESTAMP │        │    content       TEXT            │
└───────────────────────────┘        │    category      VARCHAR         │
                                     │    cover         VARCHAR         │
┌───────────────────────────┐        │    featured      BOOLEAN         │
│         CONTACTS          │        │    created_at    TIMESTAMP       │
├───────────────────────────┤        └─────────────────────────────────┘
│ PK id        SERIAL       │
│    name      VARCHAR      │   reviewer_id is NULLABLE
│    email     VARCHAR      │   → allows guest reviews
│    message   TEXT         │
│    read      BOOLEAN      │   CONTACTS has no FK
│    created_at TIMESTAMP   │   → captures guest messages
└───────────────────────────┘
```

---

## 🔒 Role-Based Access Control

```
GUEST       Browse · Read · Search · Filter · Submit (name only)
               │
               ▼
REGISTERED  + Write/Edit/Delete own reviews
USER        + My Reading Legacy dashboard
            + Reviewer profile page
               │
               ▼
ADMIN       + Admin Dashboard (/admin/dashboard)
            + Edit/Delete ANY review
            + Toggle featured status
            + Manage all users
            + Read contact messages
```

### 🔄 Authentication & Dashboard Navigation Flow
*   **User Registration & Login**: Users can create a free account or log in through the `/signup` and `/login` routes. Upon successful registration or authentication, they are redirected to the **Home Page**.
*   **Personalized Dashboard Access**: Once authenticated, the navigation bar dynamically updates to expose the **My Dashboard** option, directing users to `/my-reviews`. In this workspace, users manage their own reading reviews, edit draft submissions, and view aggregated personal metrics.
*   **Admin Dashboard Redirection**: When users possessing the admin role log in, the navigation bar dynamically highlights the **Admin Dashboard** option, pointing them to `/admin/dashboard` to manage community users, moderate comments, and toggle review feature statuses.

---

## 🎨 Theme System

| Theme | Base | Header | Accent |
|-------|------|--------|--------|
| 🟤 Classic Brown | `#FAF8F5` | `#1a1208` | `#c8860a` |
| 🔵 Retro Blue | `#BBE0EF` | `#161E54` | `#F16D34` |
| 🌸 Sunset Warm | `#FFF7CD` | `#c45070` | `#F57799` |
| 🌿 Vintage Earth | `#F9F8F6` | `#3d2b1f` | `#8a6a50` |

Applied statically via custom properties on `:root` in CSS.

---

## 🗺️ Page Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/explore` | Explore | Public |
| `/best-books` | Best Books | Public |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/write` | Write Review | Public |
| `/review/:id` | Review Detail | Public |
| `/profile/:name` | Reviewer Profile | Public |
| `/all-reviewers` | All Reviewers | Public |
| `/my-reviews` | My Dashboard | 🔒 User |
| `/edit/:id` | Edit Review | 🔒 Owner / Admin |
| `/admin/dashboard` | Admin Dashboard | 🛡️ Admin only |

---

## 📸 Screenshots

Here is a visual tour of the BookVerse platform showing all key features and roles.

### 🏠 Landing & Home Experience
| Feature / Section | Visual Interface |
|---|---|
| **Home Page (Hero & Live Stats)** | ![Home Page](images/home-page.png) |
| **Featured Community Reviews** | ![Featured Reviews](images/home-featured-reviews.png) |
| **Onboarding - How It Works** | ![Home Steps](images/home-steps.png) |

### 🔍 Discovery & Feed
| Feature / Section | Visual Interface |
|---|---|
| **Explore Page (3-Column Layout)** | ![Explore Page](images/explore-page.png) |
| **Best Books Section** | ![Best Books](images/best-books.png) |
| **In-Depth Review Detail** | ![Review Detail](images/review-detail.png) |

### ✍️ Reader Workspace
| Feature / Section | Visual Interface |
|---|---|
| **Account Creation** | ![Sign Up](images/signup-page.png) |
| **Review Writer (ISBN Auto-Fetch & Live Preview)** | ![Write Review](images/write-review.png) |
| **User Dashboard (My Reading Legacy)** | ![User Dashboard](images/user-dashboard.png) |

### 🛡️ Admin Operations
| Feature / Section | Visual Interface |
|---|---|
| **Admin Dashboard (Analytics & Insights)** | ![Admin Dashboard](images/admin-dashboard.png) |
| **Moderation Table (Approve / Reject / Feature)** | ![Admin Moderation](images/admin-review-moderation.png) |
| **Member Management** | ![Admin Members](images/admin-members.png) |

### 📚 About Page
| Feature / Section | Visual Interface |
|---|---|
| **Inspiration & Mission** | ![About Inspiration](images/about-inspiration.png) |

---

## 📦 Scripts

```bash
# ── Backend ──────────────────────────────
cd backend
node server.js            # start server
npx kill-port 5000        # free port if busy

# ── Frontend ─────────────────────────────
cd frontend
npm run dev               # dev server → localhost:5173
npm run build             # production build
npm run preview           # preview production build
```

---

## 🧪 Test Results

| Test | Status |
|------|--------|
| User Registration | ✅ PASS |
| JWT Login | ✅ PASS |
| Admin Hardcode Login | ✅ PASS |
| Guest Review Submit | ✅ PASS |
| ISBN Auto-Fetch | ✅ PASS |
| Category Filter (SQL) | ✅ PASS |
| Full-Text Search | ✅ PASS |
| Non-admin blocked from `/admin` | ✅ PASS |
| Feature Toggle (Home sync) | ✅ PASS |
| Contact → Admin Inbox | ✅ PASS |
| Edit/Delete own review | ✅ PASS |
| Admin delete any review | ✅ PASS |
| Stat card navigation | ✅ PASS |
| Theme switcher persistence | ✅ PASS |

---

## 🔮 Future Enhancements

- [ ] AI-based personalised book recommendations
- [ ] Email notifications (welcome, password reset, featured alert)
- [ ] Google / Facebook OAuth login
- [ ] Multi-language support
- [ ] React Native mobile app
- [ ] Reading lists (To Read / Reading / Finished)
- [ ] Advanced filters (rating range, date range)
- [ ] Social sharing (Twitter, LinkedIn, WhatsApp)
- [ ] Profile image upload
- [ ] Review analytics charts on My Dashboard

---

## 📄 Environment Variables

```env
# backend/.env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookverse
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

---

## 🌐 Production Deployment Guide (GitHub, Render, Neon & Vercel)

This project is optimized for deployment using Neon (PostgreSQL Database), Render (Backend Web Service), and Vercel (Frontend Static Site). Follow this guide to deploy it:

### 1. Push Your Code to GitHub
Ensure all your local changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: implement mobile responsiveness fixes"
git push origin main
```

### 2. Set Up a Cloud PostgreSQL Database on Neon
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new database project named `bookverse`.
3. In the Neon Dashboard, copy the connection string under **Connection Details** (it will look like `postgresql://username:password@ep-host.region.aws.neon.tech/neondb?sslmode=require`).
4. Execute the SQL schema script provided in [Step 2 — PostgreSQL Database Setup](#step-2--postgresql-database-setup) using Neon's online SQL Editor or any database client to create the database tables.

### 3. Deploy the Backend on Render
1. Go to [Render.com](https://render.com/) and sign in.
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. Set the following options:
   - **Name**: `bookverse-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add these Environment Variables:
   - `DATABASE_URL`: *(Your Neon PostgreSQL connection string)*
   - `JWT_SECRET`: *(A secure secret key for JWT authentication)*
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: *(Your deployed Vercel frontend URL, e.g. `https://your-bookverse.vercel.app`)*
6. Click **Create Web Service**. Wait for Render to build and start. Note the live backend URL (e.g. `https://bookverse-backend-dzkl.onrender.com`).

### 4. Deploy the Frontend on Vercel
Vercel routes frontend API requests using the rewrite rules defined in [vercel.json](file:///c:/Users/Prarthana/Desktop/BookVerse/frontend/vercel.json).

1. Go to [Vercel.com](https://vercel.com/) and import your project repository.
2. Set the following configuration:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**. Vercel will automatically apply the reverse proxy rewrite from `vercel.json`, directing all `/api/*` requests to your Render backend web service.
4. If your backend URL ever changes, update the destination in [frontend/vercel.json](file:///c:/Users/Prarthana/Desktop/BookVerse/frontend/vercel.json) and push your changes.

---

## 👩💻 Author

**Prarthana Basawraj Bhandari**

| | |
|--|--|
| Roll No | 2024MCA42 |
| Programme | MCA — Final Year Project |
| Institute | K.B. Joshi Institute of Information Technology, Pune |
| University | S.N.D.T. Women's University |
| Guide | Prof. Manali Sapkal |
| Year | 2025 – 2026 |

---

<div align="center">

Built with ❤️ by **Prarthana Basawraj Bhandari**

⭐ **Star this repo if you found it helpful!**

</div>
