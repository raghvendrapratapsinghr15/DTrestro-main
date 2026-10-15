import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-col">
          <h2 className="footer-brand">DownTown</h2>
          <p className="footer-tagline">
            Good food. Good vibes. Great people.<br />
            Come visit us in Hajipur, Bihar — we'd love to see you!
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/downtown____cafe/reels/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/downtown____cafe/reels/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.instagram.com/downtown____cafe/reels/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Our Menu</Link></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#reservation">Reserve a Table</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3 className="footer-col-title">Contact</h3>
          <ul className="footer-contact">
            <li><FaPhoneAlt className="contact-icon" /> +91 1234567890</li>
            <li><FaEnvelope className="contact-icon" /> info@downtown.com</li>
            <li><FaMapMarkerAlt className="contact-icon" /> Hajipur, Bihar, India</li>
            <li><FaClock className="contact-icon" /> Open: 05:00 PM – 12:00 AM</li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} DownTown. All rights reserved.</span>
        <span>Crafted with ❤️ by Raghvendra Pratap Singh</span>
        <Link to="/admin/login" className="footer-admin-link" aria-label="Admin Login">
          🔐 Admin
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
