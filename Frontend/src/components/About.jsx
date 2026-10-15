import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">About Us</h1>
              <p>Food is not just fuel. It's a feeling.</p>
            </div>
            <p className="mid">
              At DownTown, we believe every meal should be an experience worth remembering.
              Our chefs use only the freshest ingredients and time-tested recipes to bring
              bold flavours to your table — every single time.
              <br /><br />
              Whether it's a quiet dinner, a family night out, or a special celebration —
              we make sure you leave with a full stomach and a happy heart.
            </p>
            <Link to="/menu">
              Explore Our Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </div>
          <div className="banner">
            <img src="about.png" alt="Inside DownTown restaurant" />
          </div>
        </div>
      </section>
    </>
  );
};
export default About;
