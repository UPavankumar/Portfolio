import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import PipelineHero from "../components/PipelineHero";
import Stats from "../components/Stats";
import TextReveal from "../components/TextReveal";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Footer from "../components/Footer";
import AskPortfolio from "../components/AskPortfolio";
import CustomCursor from "../components/CustomCursor";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <Nav />
      <PipelineHero />
      <Stats />
      <TextReveal />
      <Experience />
      <Skills />
      <Footer />
      <AskPortfolio />
    </MotionConfig>
  );
}
