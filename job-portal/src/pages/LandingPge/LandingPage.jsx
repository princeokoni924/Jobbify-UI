import React from "react";
import Feature from "./components/Feature";
import  Header  from "./components/Header";
import Hero from './components/Hero'
import  Analytics  from "./components/Analytics";
import Footer from './components/Footer'
const LandingPage = () => {
  return (
    <div className="min-h-screen ">
      <Header/>
      <Hero/>
      <Feature/>
      <Analytics/>
      <Footer/>
    </div>
  );
};
export default LandingPage;
