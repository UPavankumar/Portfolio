import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "../components/Nav";
import PipelineHero from "../components/PipelineHero";
import TechMarquee from "../components/TechMarquee";
import TextReveal from "../components/TextReveal";
import ScrollPipelineLab from "../components/ScrollPipelineLab";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import Interactive3DScene from "../components/Interactive3DScene";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Magnetic Frame Snapping Setup for Desktop (min-width: 1024px)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Global smooth snapping to discrete keyframe anchors with soft lerp inertia
      ScrollTrigger.create({
        start: 0,
        end: "max",
        snap: {
          snapTo: "labelsDirectional",
          duration: { min: 0.25, max: 0.6 },
          delay: 0.12,
          ease: "power2.out",
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Interactive3DScene />
      <Nav />
      
      {/* FRAME 01: Quantum Core Ignition & Identity */}
      <PipelineHero />

      {/* TRANSITION: Real-Time Tech Capabilities Marquee */}
      <TechMarquee />

      {/* FRAME 02: Kinetic Velocity Text Warp */}
      <TextReveal />

      {/* FRAME 03: 3-Stage Autonomous Data & AI Lab */}
      <div id="pipeline-simulator">
        <ScrollPipelineLab />
      </div>

      {/* FRAME 04: Holographic Career Exhibits & Milestones */}
      <Experience />

      {/* FRAME 05: Live System Architecture & Animated Integrations */}
      <Skills />

      {/* FRAME 06: Executive Warp Portal & Direct Channel */}
      <Footer />
    </MotionConfig>
  );
}
