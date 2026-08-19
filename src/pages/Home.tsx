import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import ExecutiveHome from "../components/ExecutiveHome";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="w-full min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center overflow-x-hidden selection:bg-zinc-800 selection:text-white">
        <ExecutiveHome />
      </main>
    </MotionConfig>
  );
}
