import { MotionConfig } from "framer-motion";
import Nav from "./components/Nav";
import PipelineHero from "./components/PipelineHero";
import Stats from "./components/Stats";
import CaseStudies from "./components/CaseStudies";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import AskPortfolio from "./components/AskPortfolio";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <PipelineHero />
      <Stats />
      <CaseStudies />
      <Experience />
      <Skills />
      <Footer />
      <AskPortfolio />
    </MotionConfig>
  );
}
