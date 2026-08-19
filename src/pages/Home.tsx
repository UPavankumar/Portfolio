import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import HeroMinimal from "../components/HeroMinimal";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="w-full min-h-screen bg-[#030712] text-white flex flex-col justify-center overflow-x-hidden selection:bg-[#38bdf8]/30 selection:text-[#38bdf8]">
        <HeroMinimal />
      </main>
    </MotionConfig>
  );
}
