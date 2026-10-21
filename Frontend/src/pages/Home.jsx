import React from "react";
import HeroSection from "../components/HeroSection";
import About from "../components/About";
import Qualities from "../components/Qualities";
import Menu from "../components/Menu";
import WhoAreWe from "../components/WhoAreWe";
import Team from "../components/Team";
import Reservation from "../components/Reservation";
import ShareExperienceCTA from "../components/ShareExperienceCTA";
import Footer from "../components/Footer";

const Home = () => {

  return(
    <>
      {/* <h1>HOME PAGE</h1> */}
      <HeroSection/>
      <About/>
      <Qualities/>
      <Menu/>
      <WhoAreWe/>
      <Team/>
      <Reservation/>
      <ShareExperienceCTA/>
      <Footer/>
    </>
  )
}

export default Home