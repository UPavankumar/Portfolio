import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const VALID_ROUTES = ["/", "/about", "/projects", "/skills", "/contact"];

const INTRO_WORDS = [
  "PAVAN KUMAR",
  "AI AUTOMATION",
  "PORTFOLIO",
];

export default function Preloader() {
  const location = useLocation();
  const is404Route = !VALID_ROUTES.includes(location.pathname);

  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(!is404Route);

  useEffect(() => {
    if (is404Route) {
      setIsLoading(false);
      document.body.style.overflow = "";
      return;
    }

    // Lock scroll during quick initial intro
    document.body.style.overflow = "hidden";

    if (isFinished) {
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(exitTimer);
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === INTRO_WORDS.length - 1) {
          clearInterval(interval);
          setIsFinished(true);
          return prev;
        }
        return prev + 1;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [isFinished, is404Route]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="minimal-preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            opacity: 0.95,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#05070f] text-white overflow-hidden select-none px-6"
        >
          {/* Central Animated Monogram & Text */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="size-12 sm:size-14 rounded-full bg-white text-black font-black flex items-center justify-center text-base sm:text-lg shadow-2xl"
            >
              P.
            </motion.div>

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-[#00f0ff] uppercase text-center"
            >
              {INTRO_WORDS[index]}
            </motion.div>
          </div>

          {/* Minimal Bottom Status */}
          <div className="absolute bottom-8 flex items-center gap-2 font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>INITIALIZING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
