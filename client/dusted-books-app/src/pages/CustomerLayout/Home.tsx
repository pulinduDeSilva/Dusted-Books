import { useEffect } from "react";
import Workflow from "../../components/customer/Workflow";
import Hero from "../../components/customer/Hero";
import Nav from "../../components/Nav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


function Home() {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
    });

    // Clean up the smoother if the user navigates away from this page
    return () => {
      smoother.kill();
    };
  }, []);

  

  return (
    <div id="smooth-wrapper">
      <Nav />

      <div id="smooth-content">
        <section id="customer-interface">
            <Hero />
            <Workflow />
          </section>
      </div>
    </div>
  );
}

export default Home;
