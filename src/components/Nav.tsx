import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { playClickSound, playHoverSound } from "../lib/sound";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Work", path: "/projects" },
  { name: "Skills", path: "/skills" },
  { name: "Contact", path: "/contact" },
];

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState("/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Route & Scroll detection
  useEffect(() => {
    setIsMobileMenuOpen(false);

    if (location.pathname === "/about") {
      setActivePath("/about");
    } else if (location.pathname === "/projects") {
      setActivePath("/projects");
    } else if (location.pathname === "/skills") {
      setActivePath("/skills");
    } else if (location.pathname === "/contact") {
      setActivePath("/contact");
    } else {
      setActivePath("/");
    }

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const handleNavClick = (path: string) => {
    playClickSound();
    setIsMobileMenuOpen(false);
    setActivePath(path);
    navigate(path);
  };

  return (
    <header className="fixed top-0 md:top-6 w-full z-[9999] px-4 md:px-6 pointer-events-none flex justify-between items-center h-16 md:h-[72px] overflow-visible">
      
      {/* Brand Logo */}
      <Link
        to="/"
        onClick={() => {
          playClickSound();
          setIsMobileMenuOpen(false);
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onMouseEnter={playHoverSound}
        className="flex items-center gap-2.5 sm:gap-3 group pointer-events-auto transition-all duration-300 hover:scale-105 z-[10002]"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-xs sm:text-sm group-hover:rotate-12 transition-all shadow-xl">
          P.
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-black tracking-[0.2em] text-white uppercase block">
            Pavan Kumar
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 tracking-wider hidden sm:block">
            AI Automation & Analytics
          </span>
        </div>
      </Link>

      {/* Desktop Floating Center Navbar (Clean Dedicated Page Links) */}
      <div className="absolute inset-0 px-4 md:px-6 pointer-events-none hidden lg:block">
        <motion.nav
          initial={false}
          animate={{
            x: "-50%",
            left: "50%",
            top: "50%",
            y: "-50%",
            backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.88)" : "rgba(10, 15, 25, 0.75)",
            borderColor: isScrolled ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
          }}
          transition={{ type: "spring", stiffness: 140, damping: 24, mass: 1 }}
          className="absolute flex items-center gap-1 p-2 rounded-full border backdrop-blur-3xl shadow-2xl pointer-events-auto transition-colors duration-500"
        >
          <div className="flex items-center gap-1 h-full px-2">
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.path;

              return (
                <button
                  key={link.name}
                  type="button"
                  onMouseEnter={playHoverSound}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative h-full px-5 py-2 flex items-center text-[13px] font-medium transition-all duration-300 rounded-full select-none cursor-pointer ${
                    isActive ? "text-black z-10 font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {link.name}
                </button>
              );
            })}
          </div>
        </motion.nav>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <div className="flex items-center gap-2 lg:hidden pointer-events-auto z-[10002]">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsMobileMenuOpen((prev) => !prev);
          }}
          aria-label="Toggle navigation menu"
          className="w-10 h-10 rounded-full bg-neutral-900/90 border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center gap-1.5 shadow-xl transition-transform active:scale-95 cursor-pointer"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-0.5 bg-white rounded-full block origin-center"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-0.5 bg-white rounded-full block origin-center"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-0.5 bg-white rounded-full block origin-center"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay & Minimal Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[10000] lg:hidden pointer-events-auto"
            />

            {/* Mobile Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="fixed top-16 left-3.5 right-3.5 max-h-[calc(100vh-5rem)] overflow-y-auto bg-neutral-950/98 border border-white/15 rounded-3xl p-5 shadow-2xl z-[10001] lg:hidden pointer-events-auto flex flex-col gap-4 font-sans"
            >
              {/* Main Nav Links */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase px-2 mb-1">
                  Menu
                </span>
                {NAV_LINKS.map((link) => {
                  const isActive = activePath === link.path;

                  return (
                    <button
                      key={link.name}
                      type="button"
                      onClick={() => handleNavClick(link.path)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-bold"
                          : "text-neutral-200 hover:bg-neutral-900 font-medium"
                      }`}
                    >
                      <span className="text-base">{link.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white">
                          ● Current
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-white/10" />

              {/* Minimal Quick Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleNavClick("/about")}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-center hover:text-white"
                >
                  Bio & Resume
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("/contact")}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] text-center font-bold"
                >
                  Contact →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
