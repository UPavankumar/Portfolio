import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Act1Genesis from "./Act1Genesis";
import Act2Philosophy from "./Act2Philosophy";
import Act3EngineLab from "./Act3EngineLab";
import Act4MilestoneVault from "./Act4MilestoneVault";
import Act5Portal from "./Act5Portal";
import { playClickSound, playHoverSound } from "../../lib/sound";

const ACTS = [
  { id: "genesis", label: "01 /// GENESIS", name: "Genesis" },
  { id: "philosophy", label: "02 /// CREED", name: "Philosophy" },
  { id: "engine", label: "03 /// ENGINE", name: "Engine" },
  { id: "milestones", label: "04 /// VAULT", name: "Milestones" },
  { id: "portal", label: "05 /// PORTAL", name: "Contact" },
];

export default function SantioniStage() {
  const [activeAct, setActiveAct] = useState(0);
  const [direction, setDirection] = useState(1);
  const isTransitioningRef = useRef(false);
  const touchStartY = useRef(0);

  const goToAct = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= ACTS.length || newIndex === activeAct) return;
    setDirection(newIndex > activeAct ? 1 : -1);
    setActiveAct(newIndex);
    playClickSound();

    isTransitioningRef.current = true;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 650);
  }, [activeAct]);

  const nextAct = useCallback(() => {
    if (activeAct < ACTS.length - 1) {
      goToAct(activeAct + 1);
    }
  }, [activeAct, goToAct]);

  const prevAct = useCallback(() => {
    if (activeAct > 0) {
      goToAct(activeAct - 1);
    }
  }, [activeAct, goToAct]);

  // Wheel event listener with inertia threshold
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;

      accumulatedDelta += e.deltaY;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 200);

      if (accumulatedDelta > 45) {
        accumulatedDelta = 0;
        nextAct();
      } else if (accumulatedDelta < -45) {
        accumulatedDelta = 0;
        prevAct();
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextAct();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prevAct();
      }
    };

    // Touch event listeners for mobile swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioningRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (deltaY > 50) {
        nextAct();
      } else if (deltaY < -50) {
        prevAct();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      clearTimeout(resetTimer);
    };
  }, [nextAct, prevAct]);

  const renderAct = (index: number) => {
    switch (index) {
      case 0:
        return <Act1Genesis isActive={activeAct === 0} onNext={() => goToAct(1)} />;
      case 1:
        return <Act2Philosophy isActive={activeAct === 1} onNext={() => goToAct(2)} />;
      case 2:
        return <Act3EngineLab isActive={activeAct === 2} onNext={() => goToAct(3)} />;
      case 3:
        return <Act4MilestoneVault isActive={activeAct === 3} onNext={() => goToAct(4)} />;
      case 4:
        return <Act5Portal isActive={activeAct === 4} onReset={() => goToAct(0)} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#02040a] overflow-hidden select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,240,255,0.08),transparent_70%)] pointer-events-none" />

      {/* Stage Canvas Scene Area */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeAct}
            custom={direction}
            initial={{ opacity: 0, y: direction * 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction * -50, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 24,
              mass: 1,
            }}
            className="absolute inset-0 w-full h-full"
          >
            {renderAct(activeAct)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Luxury Santioni Frame Scrubber Indicator (Floating Right on Desktop, Bottom on Mobile) */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3 pointer-events-auto">
        {ACTS.map((act, i) => {
          const isCurrent = activeAct === i;

          return (
            <button
              key={act.id}
              type="button"
              onMouseEnter={playHoverSound}
              onClick={() => goToAct(i)}
              className="group flex items-center gap-3 p-1.5 cursor-pointer"
            >
              <span
                className={`font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  isCurrent ? "text-[#00f0ff] font-bold opacity-100" : "text-neutral-500 opacity-0 group-hover:opacity-100"
                }`}
              >
                {act.label}
              </span>
              <div
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? "w-8 h-1.5 bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                    : "w-2 h-1.5 bg-white/20 group-hover:bg-white/50 group-hover:w-4"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Mobile Bottom Frame Dots */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/80 border border-white/15 backdrop-blur-xl pointer-events-auto">
        {ACTS.map((act, i) => {
          const isCurrent = activeAct === i;

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => goToAct(i)}
              aria-label={`Jump to ${act.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isCurrent ? "w-6 bg-[#00f0ff]" : "w-1.5 bg-white/30"
              }`}
            />
          );
        })}
      </div>

    </div>
  );
}
