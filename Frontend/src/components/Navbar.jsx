import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";


const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate(); 
  return (
    <>
      <nav>
        <div className="logo">
          <RouterLink to="/" className="nav-logo-link" aria-label="DownTown — Go to Home">
            <img src="/logoDT.png" alt="DownTown Restaurant — Home" className="nav-logo" />
          </RouterLink>
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
            {data[0].navbarLinks.map((element) =>
              element.link === "feedback" ? (
                <RouterLink
                  to="/feedback"
                  key={element.id}
                  onClick={() => setShow(false)}
                >
                  {element.title}
                </RouterLink>
              ) : (
                <Link
                  to={element.link}
                  spy={true}
                  smooth={true}
                  duration={500}
                  key={element.id}
                  onClick={() => setShow(false)}
                >
                  {element.title}
                </Link>
              )
            )}
             <button className="menuBtn" onClick={() => navigate("/menu")}>
                  OUR MENU
            </button>
        </div>
        <div className="hamburger" onClick={()=> setShow(!show)}>
                <GiHamburgerMenu/>
        </div>
      </nav>
    </>
  );
};

export default Navbar;