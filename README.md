# 🍽️ DT Restro — Restaurant & Table Reservation Management System

<p align="center">
  <img src="Frontend/public/logoDT.png" alt="DT Restro Logo" width="180"/>
</p>

<p align="center">
  <strong>A modern, full-stack MERN restaurant application with real-time table reservations, an interactive digital menu, and an authorized administrative management portal.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node 22" />
  <img src="https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Mongoose-9.2.1-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose 9" />
  <img src="https://img.shields.io/badge/JWT-Secure_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Auth" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security & Authentication](#-security--authentication)
- [Documentation & Viva Materials](#-documentation--viva-materials)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌟 Overview

**DT Restro (DownTown Restaurant & Cafe)** is an end-to-end web platform designed to streamline dining operations. It eliminates the traditional chaos of phone-call bookings and manual paper registers by providing:
1. **A Customer Dining Portal:** An immersive, responsive website for exploring culinary items, viewing signature dishes, and booking tables online 24/7.
2. **An Operational Admin Dashboard:** A protected portal for restaurant staff to track bookings, view daily statistics, approve/cancel reservations, and manage administrative credentials in real time.

---

## ✨ Key Features

### 👤 Customer-Facing Experience
- **Interactive Landing Page (`/`):**
  - Smooth-scrolling single-page navigation (`react-scroll`) targeting sections: *Home*, *About Us*, *Services*, *Team*, and *Reservation*.
  - Curated showcases for *Popular Dishes*, *Culinary Qualities* (Quality Food, Super Taste, Fast Delivery), *Our Chefs*, and *Restaurant Scale Counters*.
- **Interactive Menu Page (`/menu`):**
  - Live, instant debounced search filtering dishes by title or description.
  - Category tabs: *All*, *Starters*, *Main Course*, *Fast Food*, *Desserts*, and *Drinks*.
  - Visual dietary indicators: 🟢 Vegetarian (Leaf) & 🔴 Non-Vegetarian (Drumstick).
  - Specialty badges: *Popular* ⭐ and *Chef's Special* 👨‍🍳.
  - Interactive "Add to Cart" simulation with celebratory toast alerts.
- **Table Reservation Engine:**
  - Form capturing first/last name, email, phone number, dining date, time, party size (1–20 guests), and special requests.
  - Instant server-side schema validations with user-friendly error alerts.
- **Celebratory Success Page (`/success`):**
  - Displays reservation confirmation with an automated 10-second countdown redirecting back to the home page.
- **Floating WhatsApp Order Widget:**
  - Persistent, animated button launching WhatsApp with a pre-filled greeting message for direct takeout inquiries.

### 🛡️ Administrative Portal
- **Secure Owner Login (`/admin/login`):**
  - Dedicated authentication view for authorized management.
  - Public registration is permanently disabled (returns HTTP 403) to prevent unauthorized accounts.
- **Client & Server Route Protection:**
  - `AdminProtectedRoute` component inspects JWT tokens in `localStorage`.
  - Backend `authMiddleware` verifies cryptographic JWT signatures on every API request.
- **Real-Time Operational Analytics:**
  - Metric cards: *Total Bookings*, *Today's Bookings*, *Upcoming Bookings*, *Pending*, *Confirmed*, and *Cancelled*.
- **Live Reservations Management:**
  - Dynamic table with search by customer name, phone, or email.
  - Date picker filter and status filter dropdown.
  - Inline status updates (`Pending` ➔ `Confirmed` / `Cancelled`) with immediate state synchronization.
  - Modal view inspecting deep customer notes and party requests.
  - Permanent record deletion with browser confirmation prompts.
- **Self-Service Credential Management:**
  - Dedicated dashboard view allowing the owner to update their Admin ID or password securely by verifying their current password.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend UI** | **React** | `^19.2.0` | Component-based declarative UI architecture |
| **Build Tool** | **Vite** | `^7.3.1` | Lightning-fast HMR and bundling |
| **Routing** | **React Router DOM** | `^7.13.0` | Client-side declarative routing |
| **HTTP Client** | **Axios** | `^1.13.5` | Asynchronous REST communication with cookies |
| **Notifications** | **React Hot Toast** | `^2.6.0` | Lightweight, non-intrusive notification toasts |
| **Icons** | **React Icons** | `^5.5.0` | Vector icons (Fa, Hi, Gi, Md) |
| **Scroll Animation**| **React Scroll** | `^1.9.3` | Smooth scroll-to-anchor transitions |
| **Styling** | **Vanilla CSS3** | Custom | Responsive layout with design tokens (`:root`) |
| **Runtime** | **Node.js** | `v22.x` | Non-blocking, asynchronous backend runtime |
| **Framework** | **Express.js** | `^5.2.1` | Next-gen backend routing and middleware |
| **Database** | **MongoDB Atlas** | Cloud | Scalable NoSQL cloud document storage |
| **ODM** | **Mongoose** | `^9.2.1` | Schema modeling and async validation hooks |
| **Auth & Security** | **JWT & Bcryptjs** | `^9.0.3` / `^3.0.3` | Stateless signed tokens & 10-round password hashing |

---

## 🏗️ System Architecture

DT Restro adheres to a decoupled **3-Tier Client-Server Architecture**:

```
[ Client Browser (Port 5173) ]
       │
       │  React 19 Components / React Router v7
       │  Axios REST Calls (JSON Payloads)
       ▼
[ Express.js 5 Backend (Port 3000) ]
       │
       ├── CORS Middleware (Whitelisted Origins)
       ├── CookieParser & JSON Parsers
       ├── authMiddleware (JWT Verification)
       └── Controllers (Business Logic & Errorhandler)
       │
       ▼
[ Persistence Layer (MongoDB Atlas Cluster) ]
       ├── reservations Collection
       └── admins Collection
```

> **DNS Safeguard:** Implements low-level Node DNS resolution (`dns.setServers(["8.8.8.8", "1.1.1.1"])`) to eliminate Windows ISP DNS SRV timeout errors with MongoDB Atlas.

---

## 📁 Project Directory Structure

```
DTrestro-main/
│
├── Backend/                           # Express.js REST API Backend
│   ├── config/                        # Environment configurations (config.env)
│   ├── controller/                    # Business controllers (reservation.js, admin.js)
│   ├── database/                      # MongoDB connection (dbConnection.js)
│   ├── error/                         # Custom Errorhandler & global error middleware
│   ├── middleware/                    # authMiddleware (JWT verification)
│   ├── models/                        # Mongoose schemas (adminSchema.js, reservationSchema.js)
│   ├── routes/                        # Express routers (reservationRoute.js, adminRoute.js)
│   ├── scripts/                       # Admin initialization & CLI setup (createAdmin.js)
│   ├── app.js                         # Express application assembly
│   ├── server.js                      # Server entry point & DNS configuration
│   └── package.json                   # Backend dependencies and scripts
│
├── Frontend/                          # React 19 + Vite Application
│   ├── public/                        # Static culinary images, SVGs, and branding assets
│   ├── src/
│   │   ├── components/                # Reusable UI widgets & sections (Navbar, Reservation, etc.)
│   │   ├── pages/                     # Full views (Home, MenuPage, Success, AdminLogin, AdminDashboard)
│   │   ├── App.css                    # Complete responsive CSS design tokens
│   │   ├── App.jsx                    # Root routing component
│   │   ├── config.js                  # Backend API URL binding
│   │   ├── menuData.js                # Structured menu database with categories & pricing
│   │   └── restApi.json               # Landing page content (team, qualities, counters)
│   ├── index.html                     # HTML5 entry template
│   ├── package.json                   # Frontend dependencies and scripts
│   └── vite.config.js                 # Vite configuration
│
├── PROJECT_VIVA_DOCUMENTATION.md      # Comprehensive 21-section Viva & Interview Manual
├── PROJECT_VIVA_DOCUMENTATION.pdf     # Downloadable print-ready PDF version
└── README.md                          # Repository overview & setup guide
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher, v22 recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- `npm` (v9+) or `yarn`

---

### Environment Configuration

#### 1. Backend (`Backend/config/config.env`)
Create or edit `Backend/config/config.env`:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES=7d
ADMIN_ID=admin
ADMIN_PASSWORD=Admin@12345
```

#### 2. Frontend (`Frontend/.env`)
Create or edit `Frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

### Backend Setup
```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start development server
npm run dev
```
*The server will start on `http://localhost:3000` and automatically seed the default admin account.*

*(Optional) Create or reset admin credentials interactively via CLI:*
```bash
npm run create-admin
```

---

### Frontend Setup
In a new terminal window:
```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*The client application will launch at `http://localhost:5173`.*

---

## 📡 API Endpoints

### 🍽️ Reservation Routes (`/api/v1/reservation`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/send` | Public | Submits a customer table reservation |

### 🔐 Admin Routes (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/check-setup` | Public | Returns admin setup and registration status |
| `POST` | `/register` | Disabled | Returns HTTP 403 (Public signup is permanently disabled) |
| `POST` | `/login` | Public | Authenticates admin and returns JWT token + cookie |
| `GET` | `/logout` | Public | Clears session cookie |
| `GET` | `/me` | Protected | Retrieves active administrator profile |
| `PUT` | `/change-credentials` | Protected | Updates Admin ID and/or password with verification |
| `GET` | `/stats` | Protected | Fetches aggregate reservation metrics for dashboard |
| `GET` | `/reservations` | Protected | Fetches filtered reservations (`?status=...&date=...&search=...`) |
| `GET` | `/reservations/:id` | Protected | Fetches a single reservation by ID |
| `PUT` | `/reservations/:id/status` | Protected | Updates reservation status (`Pending`, `Confirmed`, `Cancelled`) |
| `DELETE` | `/reservations/:id` | Protected | Deletes a reservation record |

---

## 🗄️ Database Schema

### 1. `Reservation` Schema
```javascript
{
  firstName:      { type: String, required: true, minLength: 3, maxLength: 30 },
  lastName:       { type: String, required: true, minLength: 3, maxLength: 30 },
  email:          { type: String, required: true, validate: validator.isEmail },
  phone:          { type: String, required: true, minLength: 10, maxLength: 15 },
  date:           { type: String, required: true },
  time:           { type: String, required: true },
  guests:         { type: Number, default: 1, min: 1, max: 20 },
  specialMessage: { type: String, maxLength: 300, default: "" },
  status:         { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" }
}, { timestamps: true }
```

### 2. `Admin` Schema
```javascript
{
  adminId:  { type: String, required: true, unique: true, trim: true },
  name:     { type: String, default: "Admin", trim: true },
  email:    { type: String, trim: true },
  password: { type: String, required: true, minLength: 6, select: false }
}, { timestamps: true }
```

---

## 🔒 Security & Authentication

- **Bcrypt Password Hashing:** 10 salt rounds executed via Mongoose 9 pre-save async hooks.
- **Defensive Projection:** `password` is defined with `select: false` to avoid leaking hashes in query outputs.
- **JWT Protection:** Signed with a secret key and expires after 7 days.
- **Dual Token Ingestion:** Supports both `Authorization: Bearer <token>` and secure HTTP-Only cookies.
- **Closed Registration:** Prevents hostile takeover of the administrative panel.
- **Identity Re-Verification:** Requiring `currentPassword` before committing any credential alterations.
- **CORS Protection:** Whitelists only the designated frontend client.

---

## 📚 Documentation & Viva Materials

This repository includes comprehensive preparation manuals created specifically for viva-voce examinations, technical interviews, and project presentations:

- **[PROJECT_VIVA_DOCUMENTATION.md](PROJECT_VIVA_DOCUMENTATION.md)** — Complete 21-section technical breakdown, code snippets, architectural explanations, presentation script, and 50+ viva questions.
- **[PROJECT_VIVA_DOCUMENTATION.pdf](PROJECT_VIVA_DOCUMENTATION.pdf)** — High-resolution, print-ready PDF formatted with custom CSS print styles.

---

## 👨‍💻 Author & Acknowledgments

- **Developer:** **Raghvendra Pratap Singh**  
- **Location:** Hajipur, Bihar, India  
- **Repository:** `raghvendrapratapsinghr15/DTrestro-main`  
- **Crafted with:** React 19, Express 5, Node.js, and MongoDB Atlas.

---

<p align="center">
  ⭐ If you found this project helpful, please consider starring the repository!
</p>
