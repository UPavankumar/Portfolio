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
  const [isLoading, setIsLoading] = useState(true);

  // Preloader check
  useEffect(() => {
    const checkLoading = () => {
      if (document.body.style.overflow === "hidden") {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    };

    checkLoading();
    const interval = setInterval(checkLoading, 150);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isLoading) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isLoading]);

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

  // Hide Navbar completely while initial Preloader is active
  if (isLoading) return null;

  return (
    <header className="fixed top-0 md:top-6 w-full z-[9999] px-4 md:px-6 pointer-events-none flex justify-between items-center h-20 md:h-[72px] overflow-visible">
      
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
        className="flex items-center gap-3 group pointer-events-auto transition-all duration-300 hover:scale-105 z-[10002]"
      >
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-all shadow-xl">
          P.
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-black tracking-[0.2em] text-white uppercase block">
            Pavan Kumar
          </span>
          <span className="text-[9px] font-mono text-neutral-400 tracking-wider hidden sm:block">
            AI Automation & Analytics
          </span>
        </div>
      </Link>

      {/* Desktop Floating Center Navbar (No 'More' - 5 Clean Dedicated Page Links) */}
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
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label="Toggle navigation menu"
          className="w-11 h-11 rounded-full bg-neutral-900/90 border border-white/15 backdrop-blur-xl flex flex-col items-center justify-center gap-1.5 shadow-xl transition-transform active:scale-95 cursor-pointer"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-white rounded-full block origin-center"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-white rounded-full block origin-center"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-white rounded-full block origin-center"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[10000] lg:hidden pointer-events-auto"
            />

            {/* Mobile Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed top-20 left-4 right-4 max-h-[calc(100vh-6rem)] overflow-y-auto bg-neutral-950/95 border border-white/15 rounded-3xl p-6 shadow-2xl z-[10001] lg:hidden pointer-events-auto flex flex-col gap-6"
            >
              {/* Main Nav Links */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase px-2">
                  Navigation
                </span>
                {NAV_LINKS.map((link) => {
                  const isActive = activePath === link.path;

                  return (
                    <button
                      key={link.name}
                      type="button"
                      onClick={() => handleNavClick(link.path)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black font-bold"
                          : "text-neutral-200 hover:bg-neutral-900 font-medium"
                      }`}
                    >
                      <span className="text-base">{link.name}</span>
                      {isActive && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-black text-white">
                          Current
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-white/10" />

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase px-2">
                  Quick Actions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick("/about")}
                    className="p-3 rounded-2xl bg-neutral-900/70 border border-white/5 text-left hover:border-white/20 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white block mb-0.5">Bio & Resume</span>
                    <span className="text-[10px] text-neutral-400">Career & education</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick("/contact")}
                    className="p-3 rounded-2xl bg-neutral-900/70 border border-white/5 text-left hover:border-white/20 transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-white block mb-0.5">Hire / Contact</span>
                    <span className="text-[10px] text-[#38bdf8]">Get in touch →</span>
                  </button>
                </div>
              </div>

              {/* Social links row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-xs text-neutral-400">
                <a
                  href="https://linkedin.com/in/u-pavankumar"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://github.com/UPavankumar"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="mailto:pavan.aidev@gmail.com"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  pavan.aidev@gmail.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
