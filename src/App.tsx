import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Preloader from "./components/Preloader";
import PageTransitionLoader from "./components/PageTransitionLoader";
import FloatingDock from "./components/FloatingDock";
import CustomCursor from "./components/CustomCursor";
import SoundToggle from "./components/SoundToggle";
import AskPortfolio from "./components/AskPortfolio";
import { recordPageVisit } from "./lib/tracker";

const PAGE_TITLES: Record<string, string> = {
  "/": "Pavan Kumar — Business Analyst · AI Automation",
  "/about": "About & Career Story | Pavan Kumar",
  "/projects": "Production Architectures & Case Studies | Pavan Kumar",
  "/contact": "Get in Touch & Consult | Pavan Kumar",
};

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    recordPageVisit(pathname);
    document.title = PAGE_TITLES[pathname] || "Pavan Kumar — Portfolio";

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      // Allow slight delay for page DOM mounting
      const elementId = hash.replace("#", "");
      const scrollToHashElement = () => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      const timer = setTimeout(scrollToHashElement, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    let originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Come back! 🥺";
      } else {
        document.title = PAGE_TITLES[window.location.pathname] || originalTitle;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <SoundToggle />
      <Preloader />
      <PageTransitionLoader />
      <FloatingDock />
      <AskPortfolio />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
