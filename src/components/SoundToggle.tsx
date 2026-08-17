import { useState } from "react";
import { toggleSound, isSoundEnabled, playPopSound } from "../lib/sound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
    if (newState) playPopSound();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed left-5 bottom-5 z-50 flex items-center gap-2 px-3 py-2 rounded-full border border-line bg-panel/80 text-xs font-mono text-fg backdrop-blur-md hover:border-acc transition-colors shadow-lg"
      aria-label="Toggle Sound Effects"
    >
      <span>{enabled ? "🔊 Audio FX: On" : "🔇 Audio FX: Off"}</span>
    </button>
  );
}
