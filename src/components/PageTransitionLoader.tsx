import { useLayoutEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ROUTE_INFO: Record<string, { label: string; sub: string }> = {
  "/": { label: "HOME", sub: "EXECUTIVE OVERVIEW" },
  "/about": { label: "ABOUT", sub: "CAREER & BIOGRAPHY" },
  "/projects": { label: "WORK", sub: "PRODUCTION CASE STUDIES" },
  "/skills": { label: "SKILLS", sub: "ENGINEERING MATRIX" },
  "/contact": { label: "CONTACT", sub: "DIRECT INQUIRY" },
};

export default function PageTransitionLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const isFirstRender = useRef(true);
  const prevPath = useRef(location.pathname);

  // useLayoutEffect runs synchronously before browser paint!
  useLayoutEffect(() => {
    // Skip initial page load so the main Preloader handles it
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPath.current = location.pathname;
      return;
    }

    if (prevPath.current === location.pathname) {
      return;
    }
    prevPath.current = location.pathname;

    // Skip loader on mobile screens (< 768px) to keep mobile navigation instant and minimal
    if (window.innerWidth < 768 || !ROUTE_INFO[location.pathname]) {
      setLoading(false);
      return;
    }

    // Immediately cover screen BEFORE browser paint
    setLoading(true);
    setIsRevealing(false);
    setCount(0);

    const duration = 400; // Snappy 400ms transition
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(easeProgress * 100);
      setCount(val);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        setTimeout(() => {
          setIsRevealing(true);
          setTimeout(() => {
            setLoading(false);
            setIsRevealing(false);
          }, 350);
        }, 60);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [location.pathname]);

  const targetInfo = ROUTE_INFO[location.pathname] || { label: "VIEW", sub: "SYSTEM ROUTING" };

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col justify-between overflow-hidden select-none bg-[#05070f]">
          
          {/* Top Shutter Panel */}
          <motion.div
            initial={{ y: 0 }}
            animate={isRevealing ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="w-full h-1/2 bg-[#05070f] border-b border-white/10 relative flex flex-col justify-end px-6 sm:px-12 pb-8 z-10"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                <span>DESTINATION /// {targetInfo.label}</span>
              </span>
              <span className="text-[#00f0ff] font-semibold">LOADING</span>
            </div>
          </motion.div>

          {/* Bottom Shutter Panel */}
          <motion.div
            initial={{ y: 0 }}
            animate={isRevealing ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="w-full h-1/2 bg-[#05070f] border-t border-white/10 relative flex flex-col justify-start px-6 sm:px-12 pt-8 z-10"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              <span>{targetInfo.sub}</span>
              <span>PAVAN KUMAR</span>
            </div>
          </motion.div>

          {/* Center Counter */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={isRevealing ? { opacity: 0, scale: 1.05, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-tighter flex items-baseline select-none">
                <span>{String(count).padStart(2, "0")}</span>
                <span className="text-xl font-bold text-[#00f0ff] ml-1.5">%</span>
              </div>

              {/* Progress Line */}
              <div className="w-36 sm:w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-white shadow-[0_0_10px_#00f0ff] transition-all"
                  style={{ width: `${count}%` }}
                />
              </div>

              <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 tracking-[0.25em] uppercase">
                {count < 100 ? `INITIALIZING ${targetInfo.label}` : "VIEW READY"}
              </span>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
