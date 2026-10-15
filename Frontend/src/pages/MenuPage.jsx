import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaLeaf, FaDrumstickBite, FaShoppingCart } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import toast from "react-hot-toast";
import { menuData, categories } from "../menuData.js";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// ─── Veg / Non-Veg Indicator ────────────────────────────────────
const VegIcon = ({ isVeg }) => (
  <span
    className={`veg-indicator ${isVeg ? "veg" : "nonveg"}`}
    title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
  >
    {isVeg ? <FaLeaf size={10} /> : <FaDrumstickBite size={10} />}
  </span>
);

// ─── Badge label ─────────────────────────────────────────────────
const Badge = ({ label }) => {
  if (!label) return null;
  return (
    <span className={`menu-badge ${label === "Popular" ? "badge-popular" : "badge-special"}`}>
      {label === "Popular" ? <><MdStar size={12} /> Popular</> : "Chef's Special"}
    </span>
  );
};

// ─── Single Food Card ─────────────────────────────────────────────
const FoodCard = ({ item }) => {
  const handleOrder = () => {
    toast.success(`${item.name} added to cart! 🛒`);
  };

  return (
    <div className="mp-card">
      {/* Badge */}
      {item.badge && <Badge label={item.badge} />}

      {/* Image */}
      <div className="mp-card-img-wrap">
        <img src={item.image} alt={item.name} className="mp-card-img" />
        <div className="mp-card-img-overlay" />
      </div>

      {/* Content */}
      <div className="mp-card-body">
        <div className="mp-card-header">
          <VegIcon isVeg={item.isVeg} />
          <h3 className="mp-card-name">{item.name}</h3>
        </div>
        <p className="mp-card-desc">{item.desc}</p>
        <div className="mp-card-footer">
          <span className="mp-card-price">{item.price}</span>
          <button className="mp-order-btn" onClick={handleOrder}>
            <FaShoppingCart size={13} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main MenuPage component ─────────────────────────────────────
const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return menuData.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      {/* ── Sticky Navbar ── */}
      <div className="mp-navbar-wrap">
        <Navbar />
      </div>

      <main className="mp-page">
        {/* ── Hero Banner ── */}
        <section className="mp-hero">
          <div className="mp-hero-overlay" />
          <div className="mp-hero-content">
            <Link to="/" className="mp-back-btn">
              <FaArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="mp-hero-title">Our Menu</h1>
            <p className="mp-hero-sub">
              Every dish made fresh. Every bite worth it. Come hungry! 🍽️
            </p>
          </div>
        </section>

        {/* ── Search ── */}
        <section className="mp-search-section">
          <div className="mp-search-wrap">
            <FaSearch className="mp-search-icon" />
            <input
              id="menu-search"
              type="text"
              className="mp-search-input"
              placeholder="Search for a dish, e.g. 'paneer' or 'pizza'…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="mp-search-clear" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>
        </section>

        {/* ── Category Tabs ── */}
        <section className="mp-tabs-section">
          <div className="mp-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`mp-tab ${activeCategory === cat ? "mp-tab--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Food Grid ── */}
        <section className="mp-grid-section">
          {filtered.length === 0 ? (
            <div className="mp-empty">
              <p>No dishes found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="mp-grid">
              {filtered.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MenuPage;