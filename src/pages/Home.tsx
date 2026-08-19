import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import LinearHero from "../components/LinearHome/LinearHero";
import LinearConduitPipeline from "../components/LinearHome/LinearConduitPipeline";
import LinearBentoGrid from "../components/LinearHome/LinearBentoGrid";
import LinearMilestones from "../components/LinearHome/LinearMilestones";
import LinearCTA from "../components/LinearHome/LinearCTA";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="w-full min-h-screen bg-[#030712] text-white selection:bg-[#38bdf8]/30 selection:text-[#38bdf8] overflow-x-hidden">
        <LinearHero />
        <LinearConduitPipeline />
        <LinearBentoGrid />
        <LinearMilestones />
        <LinearCTA />
      </main>
    </MotionConfig>
  );
}
