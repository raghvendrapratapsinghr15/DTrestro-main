import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { BACKEND_URL } from "../config";
import Footer from "../components/Footer";

const RATING_DESCRIPTIONS = {
  1: "Needs Vast Improvement",
  2: "Below Expectations",
  3: "Good & Satisfactory",
  4: "Highly Enjoyable",
  5: "Exceptional Dining Experience!",
};

const AVATAR_OPTIONS = [
  { id: 1, src: "/review_1.png", label: "Avatar 1" },
  { id: 2, src: "/review_2.png", label: "Avatar 2" },
  { id: 3, src: "/review_3.png", label: "Avatar 3" },
];

const FeedbackPage = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("/review_1.png");
  const [userExperience, setUserExperience] = useState("");
  const [improvementSuggestions, setImprovementSuggestions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);

  // Fetch recent public feedbacks
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/feedback/recent`)
      .then(({ data }) => {
        if (data.success && data.feedbacks) {
          setRecentFeedbacks(data.feedbacks);
        }
      })
      .catch(() => {});
  }, [submittedFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please provide a star rating between 1 and 5!");
      return;
    }

    if (!userExperience.trim()) {
      toast.error("Please write a few words about your experience!");
      return;
    }

    if (userExperience.trim().length < 5) {
      toast.error("Experience feedback must be at least 5 characters long!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userName: userName.trim() || "Guest Diner",
        userImage: selectedAvatar,
        userExperience: userExperience.trim(),
        improvementSuggestions: improvementSuggestions.trim(),
        rating,
      };

      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/feedback/submit`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        toast.success(data.message || "Feedback submitted successfully!");
        setSubmittedFeedback(data.feedback);
        setUserName("");
        setUserExperience("");
        setImprovementSuggestions("");
        setRating(5);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to submit feedback. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedFeedback(null);
  };

  return (
    <div className="feedback-page-wrapper">
      {/* ── Top Header Bar ── */}
      <header className="feedback-page-header">
        <div className="feedback-header-content">
          <Link to="/" className="feedback-back-link">
            <FaArrowLeft size={14} /> Back to Home
          </Link>
          <div className="feedback-header-brand">
            <Link to="/">
              <img src="/logoDT.png" alt="DT Restro" className="feedback-header-logo" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="feedback-hero-banner">
        <div className="feedback-hero-inner">
          <span className="feedback-hero-tag">YOUR VOICE MATTERS</span>
          <h1 className="feedback-hero-title">Share Your Experience</h1>
          <p className="feedback-hero-subtitle">
            Help us craft unforgettable culinary moments. Your feedback is
            recorded directly into our system and reviewed by our chefs & management.
          </p>
        </div>
      </section>

      {/* ── Main Feedback Section with Side Banner ── */}
      <main className="feedback_section feedback_page_form_section">
        <div className="container">
          {/* ── Left Banner: Image & Visual Card ── */}
          <div className="banner feedback_banner_visual">
            <div className="feedback_img_wrapper">
              <img
                src="/dinner2.png"
                alt="DT Restro Culinary Experience"
                className="feedback_hero_img"
              />
              <div className="feedback_badge_card">
                <div className="feedback_badge_stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar key={s} className="feedback_mini_star" />
                  ))}
                </div>
                <p className="feedback_badge_text">
                  "Every guest critique inspires our chefs to craft perfection."
                </p>
                <span className="feedback_badge_author">
                  — Downtown Culinary Team
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Banner: Form Box ── */}
          <div className="banner">
            <div className="feedback_form_box">
              {submittedFeedback ? (
                /* Success Screen with UID */
                <div className="feedback_success_screen">
                  <div className="feedback_success_icon">✓</div>
                  <h2>Thank You for Your Feedback!</h2>
                  <p>
                    Your review has been permanently saved to the database. We
                    sincerely appreciate your time and dedication to our dining
                    standards.
                  </p>

                  <div className="feedback_receipt_card">
                    <div className="receipt_row">
                      <span className="receipt_label">Feedback UID:</span>
                      <span className="receipt_val uid_highlight">
                        {submittedFeedback.feedbackId}
                      </span>
                    </div>
                    <div className="receipt_row">
                      <span className="receipt_label">Guest Name:</span>
                      <span className="receipt_val">
                        {submittedFeedback.userName}
                      </span>
                    </div>
                    <div className="receipt_row">
                      <span className="receipt_label">Star Rating:</span>
                      <span className="receipt_val rating_stars">
                        {"★".repeat(submittedFeedback.rating)}
                        <span className="star_numeric">
                          {" "}
                          ({submittedFeedback.rating}/5)
                        </span>
                      </span>
                    </div>
                    <div className="receipt_row">
                      <span className="receipt_label">Submission Time:</span>
                      <span className="receipt_val">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="feedback_submit_btn reset_btn"
                    onClick={handleReset}
                  >
                    SUBMIT ANOTHER FEEDBACK
                    <span>
                      <HiOutlineArrowNarrowRight />
                    </span>
                  </button>
                </div>
              ) : (
                /* Form Inputs */
                <>
                  <h1>Write Your Review</h1>
                  <p>Tell us how you enjoyed your food and service</p>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* ── 5-Star Interactive Rating ── */}
                    <div className="rating_picker_group">
                      <label className="feedback_field_label">
                        Your Rating <span className="req_asterisk">*</span>
                      </label>
                      <div
                        className="stars_container"
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((starIndex) => {
                          const isFilled =
                            starIndex <= (hoverRating || rating);
                          return (
                            <button
                              type="button"
                              key={starIndex}
                              className={`star_btn ${isFilled ? "filled" : ""}`}
                              onClick={() => setRating(starIndex)}
                              onMouseEnter={() => setHoverRating(starIndex)}
                              aria-label={`${starIndex} star`}
                            >
                              <FaStar />
                            </button>
                          );
                        })}
                        <span className="rating_label_hint">
                          {RATING_DESCRIPTIONS[hoverRating || rating]}
                        </span>
                      </div>
                    </div>

                    {/* ── Name and Avatar Row ── */}
                    <div className="feedback_row name_avatar_row">
                      <div className="input_group">
                        <label className="feedback_field_label">Your Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Jane Cooper (or Guest)"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          maxLength={50}
                          className="feedback_input"
                        />
                      </div>

                      <div className="input_group avatar_select_group">
                        <label className="feedback_field_label">
                          Choose Avatar
                        </label>
                        <div className="avatar_options">
                          {AVATAR_OPTIONS.map((av) => (
                            <img
                              key={av.id}
                              src={av.src}
                              alt={av.label}
                              className={`avatar_choice ${
                                selectedAvatar === av.src ? "selected" : ""
                              }`}
                              onClick={() => setSelectedAvatar(av.src)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── Two Medium-Sized Text Boxes ── */}
                    <div className="feedback_textareas_wrapper">
                      {/* 1. Experience Feedback Box */}
                      <div className="input_group textarea_group">
                        <div className="label_with_count">
                          <label className="feedback_field_label">
                            Experience Feedback <span className="req_asterisk">*</span>
                          </label>
                          <span className="char_counter">
                            {userExperience.length}/2000
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Tell us what you enjoyed most about our food, ambiance, hospitality, or website experience..."
                          value={userExperience}
                          onChange={(e) => setUserExperience(e.target.value)}
                          maxLength={2000}
                          className="feedback_textarea"
                          required
                        />
                      </div>

                      {/* 2. Improvement Suggestions Box */}
                      <div className="input_group textarea_group">
                        <div className="label_with_count">
                          <label className="feedback_field_label">
                            Improvement Suggestions
                          </label>
                          <span className="char_counter">
                            {improvementSuggestions.length}/2000
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Have any ideas for new menu items, website features, or service enhancements? (Optional)"
                          value={improvementSuggestions}
                          onChange={(e) =>
                            setImprovementSuggestions(e.target.value)
                          }
                          maxLength={2000}
                          className="feedback_textarea"
                        />
                      </div>
                    </div>

                    {/* ── Submit Button ── */}
                    <button
                      type="submit"
                      className="feedback_submit_btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                      <span>
                        <HiOutlineArrowNarrowRight />
                      </span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Recent Guest Reviews Section ── */}
      {recentFeedbacks.length > 0 && (
        <section className="feedback-reviews-preview-section">
          <div className="container">
            <div className="reviews-preview-header">
              <span className="reviews-preview-tag">COMMUNITY REVIEWS</span>
              <h2>What Fellow Diners Are Saying</h2>
            </div>
            <div className="reviews-preview-grid">
              {recentFeedbacks.map((item) => (
                <div key={item._id} className="review-preview-card">
                  <div className="review-preview-top">
                    <img
                      src={item.userImage || "/review_1.png"}
                      alt={item.userName}
                      className="review-preview-avatar"
                      onError={(e) => {
                        e.target.src = "/review_1.png";
                      }}
                    />
                    <div>
                      <h4 className="review-preview-name">{item.userName}</h4>
                      <div className="review-preview-stars">
                        {"★".repeat(item.rating)}
                      </div>
                    </div>
                    <span className="review-preview-uid">{item.feedbackId}</span>
                  </div>
                  <p className="review-preview-text">"{item.userExperience}"</p>
                  {item.improvementSuggestions && (
                    <div className="review-preview-suggestion">
                      <strong>Suggestion:</strong> {item.improvementSuggestions}
                    </div>
                  )}
                  <span className="review-preview-date">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};

export default FeedbackPage;
