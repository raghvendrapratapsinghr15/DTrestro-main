import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

const ShareExperienceCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="share_experience_cta_section" id="feedback">
      <div className="container">
        <div className="share_cta_card">
          <div className="share_cta_visual">
            <img
              src="/dinner2.png"
              alt="Share Your Experience at DT Restro"
              className="share_cta_img"
            />
          </div>

          <div className="share_cta_content">
            <div className="share_cta_tag_row">
              <div className="share_cta_stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="cta_star_icon" />
                ))}
              </div>
              <span className="share_cta_badge">GUEST REVIEWS</span>
            </div>

            <h2 className="share_cta_title">Share Your Experience</h2>
            <p className="share_cta_desc">
              We value your genuine thoughts! Help us enhance our culinary
              creations and dining ambiance by sharing your experience, rating
              our service, and suggesting improvements.
            </p>

            <button
              className="share_cta_button"
              onClick={() => navigate("/feedback")}
            >
              SHARE YOUR EXPERIENCE
              <span>
                <HiOutlineArrowNarrowRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareExperienceCTA;
