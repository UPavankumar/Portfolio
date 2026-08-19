import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main className="w-full min-h-screen bg-black text-white" />
    </MotionConfig>
  );
}
