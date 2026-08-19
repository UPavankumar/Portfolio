import { MotionConfig } from "framer-motion";
import BattlefieldStage from "../components/Battlefield/BattlefieldStage";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="w-full bg-[#020409]">
        <BattlefieldStage />
      </main>
    </MotionConfig>
  );
}
