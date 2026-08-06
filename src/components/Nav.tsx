import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/#experience" },
  { name: "Work", path: "/projects" },
  { name: "Skills", path: "/#skills" },
];

const MORE_LINKS = [
  { 
    name: "Contact", 
    path: "/#contact", 
    sub: "Get in touch", 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ) 
  },
  { 
    name: "Uses", 
    path: "/#skills", 
    sub: "My tech stack & tools", 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ) 
  },
  { 
    name: "Resume", 
    path: "/#experience", 
    sub: "Experience & background", 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ) 
  },
];

export default function Nav() {
  const location = useLocation();
  const [activePath, setActivePath] = useState("/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check preloader state
    const checkLoading = () => {
      if (document.body.style.overflow === "hidden") {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    };

    checkLoading();
    const interval = setInterval(checkLoading, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname === "/projects") {
      setActivePath("/projects");
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setActivePath("/");
      }

      const isAtBottom =
        window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActivePath("/#contact");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY <= 50) {
          setActivePath("/");
          return;
        }
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePath(`/#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-60px 0px -30% 0px",
        threshold: 0,
      }
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    ["experience", "skills", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [location.pathname]);

  // Hide Navbar completely while Preloader is active!
  if (isLoading) return null;

  return (
    <header className="fixed top-0 md:top-6 w-full z-[9999] px-4 md:px-6 pointer-events-none flex justify-between items-center h-20 md:h-[72px] overflow-visible">
      {/* Brand Logo (Project-2 style) */}
      <Link
        to="/"
        className="flex items-center gap-3 group pointer-events-auto transition-all duration-500 hover:scale-105 z-[110]"
      >
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-all shadow-xl">
          P.
        </div>
        <span className="text-[13px] font-black tracking-[0.2em] text-white uppercase hidden sm:block">
          Pavan Kumar
        </span>
      </Link>

      {/* Floating Center Navbar with Exact Project-2 Spring Animation */}
      <div className="absolute inset-0 px-4 md:px-6 pointer-events-none hidden lg:block">
        <motion.nav
          initial={false}
          animate={{
            x: isScrolled ? "-50%" : "-100%",
            left: isScrolled ? "50%" : "100%",
            top: "50%",
            y: "-50%",
            backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.45)",
          }}
          transition={{ type: "spring", stiffness: 120, damping: 22, mass: 1 }}
          className="absolute flex items-center gap-1 p-2 rounded-full border border-white/10 backdrop-blur-3xl shadow-2xl pointer-events-auto transition-colors duration-500"
        >
          <div className="flex items-center gap-1 h-full px-2">
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative h-full px-5 py-2 flex items-center text-[13px] font-medium transition-all duration-300 rounded-full select-none ${
                    isActive ? "text-black z-10 font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* More Dropdown (Project-2 style) */}
          <div
            className="relative h-full"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <button
              className={`h-full px-5 py-2 flex items-center gap-1.5 text-[13px] font-medium transition-colors rounded-full ${
                isMoreOpen ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              More
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[480px] bg-black/95 border border-white/10 rounded-[2.5rem] p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex gap-3 z-[10000] backdrop-blur-3xl"
                >
                  {/* Left Card: Playground */}
                  <div className="w-[180px] h-full rounded-[2rem] bg-neutral-900/80 p-6 flex flex-col justify-end relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />
                    <svg 
                      className="w-9 h-9 text-neutral-500 mb-4 opacity-50 group-hover:scale-110 group-hover:text-purple-400 transition-all duration-500"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                      <path d="M8.5 2h7" />
                      <path d="M7 16h10" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-1">Portfolio</h3>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Interactive features & micro-tools
                    </p>
                    <Link
                      to="/projects"
                      onClick={() => setIsMoreOpen(false)}
                      className="absolute inset-0"
                    />
                  </div>

                  {/* Right Links List */}
                  <div className="flex-1 flex flex-col gap-1 pr-1">
                    {MORE_LINKS.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMoreOpen(false)}
                        className="group flex items-center gap-4 p-3.5 rounded-[1.5rem] hover:bg-neutral-900 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-purple-500/30">
                          <span className="text-neutral-400 group-hover:text-purple-400 transition-colors">
                            {item.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-white mb-0.5">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-neutral-400 font-medium">
                            {item.sub}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
