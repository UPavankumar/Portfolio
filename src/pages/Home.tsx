import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import PipelineHero from "../components/PipelineHero";
import TechMarquee from "../components/TechMarquee";
import TextReveal from "../components/TextReveal";
import PipelineSimulator from "../components/PipelineSimulator";
import CaseStudiesShowcase from "../components/CaseStudiesShowcase";
import InteractiveTerminal from "../components/InteractiveTerminal";
import Stats from "../components/Stats";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import AskPortfolio from "../components/AskPortfolio";
import Interactive3DScene from "../components/Interactive3DScene";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Interactive3DScene />
      <Nav />
      <PipelineHero />
      <TechMarquee />
      <TextReveal />
      <PipelineSimulator />
      <CaseStudiesShowcase />
      <InteractiveTerminal />
      <Stats />
      <Experience />
      <Skills />
      <Footer />
      <AskPortfolio />
    </MotionConfig>
  );
}
