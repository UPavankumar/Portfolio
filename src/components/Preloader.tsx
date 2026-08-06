import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  "Hello", // EN
  "Bonjour", // Fr
  "Hola", // SP
  "你好", // CH
  "안녕하세요", // Ko
  "Ciao", // It
  "Hallo", // Ger
  "Olá", // Po
  "Здравствуйте", // Rus
  "ನಮಸ್ಕಾರ", // Ka
  "నమస్కారం", // Te
  "こんにちは", // Ja
  "வணக்கம்", // Tamil
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    if (isFinished) {
      // Automatically enter the portfolio smoothly after the last word
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          document.body.style.overflow = "auto";
        }, 1200); // Wait for the new smoother 1.2s exit animation
      }, 600);
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
    }, 350); // Slower text switching

    return () => clearInterval(interval);
  }, [isFinished]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
        >
          {/* Subtle noise/grid background overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.h1 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-[18vw] md:text-[12vw] font-black leading-none tracking-tighter"
            >
              {GREETINGS[index]}
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
