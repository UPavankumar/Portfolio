import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  "Hello", // EN
  "Bonjour", // FR
  "Hola", // ES
  "你好", // ZH
  "안녕하세요", // KO
  "Ciao", // IT
  "Hallo", // DE
  "Olá", // PT
  "Здравствуйте", // RU
  "ನಮಸ್ಕಾರ", // KN
  "నమస్కారం", // TE
  "こんにちは", // JA
  "வணக்கம்", // TA
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (isFinished) {
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          document.body.style.overflow = "";
        }, 1000);
      }, 400);
      return () => clearTimeout(exitTimer);
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === GREETINGS.length - 1) {
          clearInterval(interval);
          setIsFinished(true);
          return prev;
        }
        return prev + 1;
      });
    }, 380);

    return () => clearInterval(interval);
  }, [isFinished]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="original-preloader"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none"
        >
          {/* Subtle ambient radial mesh background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Central Animated Greeting */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 1.05 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-[16vw] md:text-[10vw] font-black leading-none tracking-tighter"
            >
              {GREETINGS[index]}
            </motion.h1>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase">
            <span>PAVAN KUMAR /// PORTFOLIO</span>
            <span className="text-[#00f0ff]">INITIALIZING</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
