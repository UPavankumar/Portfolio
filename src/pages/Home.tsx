import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import AssassinCreedHero from "../components/AssassinCreedHero";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="w-full h-screen overflow-hidden">
        <AssassinCreedHero />
      </main>
    </MotionConfig>
  );
}
