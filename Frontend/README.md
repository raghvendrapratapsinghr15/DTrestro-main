# 🍽️ DownTown Restro & Cafe — Frontend

> A premium restaurant web application built with **React + Vite**. Fully responsive, SEO-optimised, and connected to a live backend for table reservations.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [App Flow & Routing](#-app-flow--routing)
- [Pages](#-pages)
- [Components](#-components)
- [Data Layer](#-data-layer)
- [API Integration](#-api-integration)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Dependencies](#-dependencies)

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| **React 19** | UI Library |
| **Vite 7** | Build tool & Dev server |
| **React Router DOM v7** | Client-side routing |
| **React Scroll** | Smooth scroll-to-section in the same page |
| **Axios** | HTTP requests to backend API |
| **React Hot Toast** | Pop-up notifications (success/error) |
| **React Icons** | Icon library (FaIcons, HiIcons, GiIcons, MdIcons) |
| **Vanilla CSS** | All styling lives in App.css |

---

## 📁 Project Structure

```
Frontend/
├── index.html              # HTML entry point (SEO meta, OG tags, favicon)
├── vite.config.js          # Vite config
├── package.json
├── public/                 # Static assets (images, SVGs, logos)
│   ├── logoDT.png
│   ├── logo.svg
│   ├── hero1.png / hero2.png
│   ├── about.png
│   ├── reservation.png
│   ├── sandwich.png
│   ├── dinner1-6 / breakfast1 / lunch1 (food images)
│   ├── team_member_1-4.png
│   ├── qualityfood.jpg / supertaste.png / delivery.jpg
│   ├── notFound.svg
│   ├── threelines.svg / center.svg
│   └── DTlogoyellow.png    # Favicon
└── src/
    ├── main.jsx            # React DOM root mount
    ├── App.jsx             # Router setup + Toaster
    ├── App.css             # ALL styles (single file)
    ├── index.css           # Base/reset styles
    ├── restApi.json        # Static data (navbar, dishes, team, qualities, etc.)
    ├── menuData.js         # Full menu items (20 dishes across 5 categories)
    ├── components/         # Reusable UI sections
    │   ├── Navbar.jsx
    │   ├── HeroSection.jsx
    │   ├── About.jsx
    │   ├── Qualities.jsx
    │   ├── Menu.jsx
    │   ├── WhoAreWe.jsx
    │   ├── Team.jsx
    │   ├── Reservation.jsx
    │   └── Footer.jsx
    └── pages/              # Route-level page components
        ├── Home.jsx        # Route: /
        ├── MenuPage.jsx    # Route: /menu
        ├── Success.jsx     # Route: /success
        └── NotFound.jsx    # Route: * (catch-all)
```

---

## 🔀 App Flow & Routing

```
App.jsx (BrowserRouter)
│
├── "/"          → Home
│                   HeroSection → About → Qualities → Menu → WhoAreWe → Team → Reservation → Footer
│
├── "/menu"      → MenuPage
│                   Navbar + Hero Banner + Search + Category Tabs + Food Grid + Footer
│
├── "/success"   → Success
│                   Countdown 10s → auto redirects back to "/"
│
└── "*"          → NotFound
                    404 page with Back to Home link
```

> **Toaster** from react-hot-toast is mounted once at the App level so any page or component can fire a toast notification globally.

---

## 📄 Pages

### 🏠 Home.jsx — Route: /
The **landing page**. It simply stacks all homepage sections in order:

```
HeroSection → About → Qualities → Menu (preview) → WhoAreWe → Team → Reservation → Footer
```

The Navbar inside HeroSection uses **react-scroll** Link to smooth-scroll between these sections using their `id` attributes.

---

### 🍕 MenuPage.jsx — Route: /menu
A fully interactive menu explorer with:

| Feature | Detail |
|---|---|
| **Search bar** | Filters by dish name or description in real-time (useMemo) |
| **Category Tabs** | All / Starters / Main Course / Fast Food / Desserts / Drinks |
| **Food Cards** | Each card shows image, Veg/Non-Veg indicator, badge (Popular/Chef's Special), price, and an "Add to Cart" button |
| **Add to Cart** | Fires a react-hot-toast success notification |
| **Clear search** | X button appears when search is active |
| **Empty state** | Shows a friendly message when no dishes match |

Data source: `src/menuData.js` (20 dishes, fully editable)

---

### ✅ Success.jsx — Route: /success
Shown **after a successful table reservation**. Features a 10-second countdown timer that auto-navigates back to `/`. User can also click "Back to Home" immediately.

---

### ❌ NotFound.jsx — Route: *
Standard **404 page** with a SVG illustration and a "Back to Home" link. Catches any unknown URL.

---

## 🧩 Components

### Navbar.jsx
- **Logo** → links to `/` via react-router-dom
- **Nav links** (HOME, ABOUT US, SERVICES, TEAM, RESERVATION) → smooth-scroll using react-scroll — data pulled from `restApi.json`
- **OUR MENU button** → navigates to `/menu` via `useNavigate()`
- **Hamburger icon** (GiHamburgerMenu) → toggles mobile menu with `show` state
- Used in both `HeroSection` (home) and `MenuPage` (sticky wrapper)

---

### HeroSection.jsx
- Big visual hero with two banners side by side
- Displays the large heading: **"Delicious Food Dishes"**
- Uses hero images (hero1.png, hero2.png) and the logo SVG
- Houses the Navbar at the top

---

### About.jsx
- Two-column layout: text on the left, image (about.png) on the right
- "Explore Our Menu" link routes to `/menu`
- Section `id="about"` — targeted by Navbar scroll link

---

### Qualities.jsx
- Maps over `data[0].ourQualities` from `restApi.json`
- Shows 3 cards: **Quality Food**, **Super Taste**, **Fast Delivery**
- Section `id="qualities"` — targeted by "SERVICES" in Navbar

---

### Menu.jsx (Homepage preview section)
- Shows **8 featured dishes** from `restApi.json → dishes[]`
- Each card: image, title, category badge button
- Distinct from MenuPage — this is the homepage teaser, not the full interactive menu

---

### WhoAreWe.jsx
- Stats section: **14 Restaurants**, **20 Chefs**, **8 Years Experience**, **200 Food Dishes**
- Center image with gradient background
- Data from `restApi.json → who_we_are[]`

---

### Team.jsx
- Displays 4 team members from `restApi.json → team[]`
- Each card: photo, name, designation
- Section `id="team"` — targeted by Navbar scroll link

---

### Reservation.jsx
- Full reservation form with 6 fields:
  - First Name, Last Name
  - Date, Time
  - Email, Phone
- On submit → **POST** to backend API
- On success → toast + navigate to `/success`
- On error → toast with backend error message
- Section `id="reservation"` — targeted by Navbar scroll link

---

### Footer.jsx
- **Brand column**: tagline + social links (Facebook, Instagram, Twitter)
- **Quick Links**: Home, Our Menu, About Us, Reserve a Table
- **Contact**: Phone, Email, Address (Hajipur, Bihar), Opening hours (5PM–12AM)
- **Bottom bar**: copyright + "Crafted with love by Raghvendra Pratap Singh"

---

## 📦 Data Layer

### src/restApi.json
Central static data store. Consumed by multiple components via:
```js
import { data } from '../restApi.json'
```

| Key | Used in | Contains |
|---|---|---|
| `navbarLinks` | Navbar.jsx | 5 nav items with scroll target IDs |
| `ourQualities` | Qualities.jsx | 3 quality cards (image, title, desc) |
| `dishes` | Menu.jsx (homepage) | 8 featured dishes |
| `team` | Team.jsx | 4 team members |
| `who_we_are` | WhoAreWe.jsx | 4 stat numbers |
| `testimonials` | (available, not yet rendered) | 3 customer reviews |

---

### src/menuData.js
Full interactive menu data. Consumed only by `MenuPage.jsx`.

```js
import { menuData, categories } from '../menuData.js'
```

- **20 dishes** across 5 categories
- Each item has: `id`, `name`, `desc`, `price`, `category`, `isVeg`, `image`, `badge`
- **categories** array drives the tab buttons: `["All", "Starters", "Main Course", "Fast Food", "Desserts", "Drinks"]`

> To add a new dish, just add an object to `menuData` in `menuData.js`. No other file needs to change.

---

## 🌐 API Integration

The **Reservation form** is the only component that calls the backend.

```
POST https://dtrestro-47.onrender.com/api/v1/reservation/send
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "number",
  "date": "string",
  "time": "string"
}
```

**Response:**
- Success → `data.message` shown via toast → navigate to `/success`
- Error → `error.response.data.message` shown via toast (form stays open)

Config:
```js
{
  headers: { "Content-Type": "application/json" },
  withCredentials: true
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Install & Run

```bash
# Navigate to Frontend folder
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at: **http://localhost:5173**

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to dist/ |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 📚 Dependencies

### Runtime
| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | DOM renderer |
| `react-router-dom` | ^7.13.0 | Client-side routing |
| `react-scroll` | ^1.9.3 | Smooth scroll-to-section |
| `axios` | ^1.13.5 | HTTP client for API calls |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-icons` | ^5.5.0 | Icons (Fa, Hi, Gi, Md sets) |

### Dev
| Package | Purpose |
|---|---|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React support in Vite |
| `eslint` | Linting |
| `eslint-plugin-react-hooks` | Hook rules lint |
| `eslint-plugin-react-refresh` | Fast refresh lint |

---

## 🗺️ Quick Component Map

```
src/
├── App.jsx
│   ├── Route "/" → pages/Home.jsx
│   │   ├── components/HeroSection.jsx  (includes Navbar)
│   │   ├── components/About.jsx
│   │   ├── components/Qualities.jsx
│   │   ├── components/Menu.jsx          (homepage dish preview)
│   │   ├── components/WhoAreWe.jsx
│   │   ├── components/Team.jsx
│   │   ├── components/Reservation.jsx   → POST API → /success
│   │   └── components/Footer.jsx
│   │
│   ├── Route "/menu" → pages/MenuPage.jsx
│   │   ├── components/Navbar.jsx
│   │   ├── (Search + Category Tabs + FoodCard grid — all inline)
│   │   └── components/Footer.jsx
│   │
│   ├── Route "/success" → pages/Success.jsx
│   │                       (auto-redirect to "/" after 10s)
│   │
│   └── Route "*" → pages/NotFound.jsx
```

---

> **Built with love by Raghvendra Pratap Singh** | DownTown Restro & Cafe — Hajipur, Bihar
