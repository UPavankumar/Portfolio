import { MotionConfig } from "framer-motion";
import EnterpriseExperience from "../components/EnterpriseArchitecture/EnterpriseExperience";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="w-full h-screen overflow-hidden">
        <EnterpriseExperience />
      </main>
    </MotionConfig>
  );
}
