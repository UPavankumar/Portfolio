import { MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import SantioniStage from "../components/SantioniStage/SantioniStage";
import Interactive3DScene from "../components/Interactive3DScene";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Interactive3DScene />
      <Nav />
      <main className="w-full h-screen overflow-hidden">
        <SantioniStage />
      </main>
    </MotionConfig>
  );
}
