import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/resume";
import { playClickSound, playHoverSound } from "../lib/sound";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export default function AssassinCreedHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMenu, setActiveMenu] = useState(0);

  const menuItems = [
    { label: "AI ARCHITECTURE", to: "/" },
    { label: "CASE STUDIES", to: "/projects" },
    { label: "CAREER TIMELINE", to: "/about" },
    { label: "DIRECT TRANSMISSION", to: "/contact" },
    { label: "DOWNLOAD RÉSUMÉ", href: "/Pavan_Resume.pdf", download: "Pavan_Kumar_Resume.pdf" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Configuration matching assassin-creed-load
    const particleCount = Math.min(Math.floor((width * height) / 7000), 280);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: -(0.5 + Math.random() * 1.5), // move bottom-left
        vy: 0.5 + Math.random() * 1.5,
        radius: 1 + Math.random() * 1.8,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let isClicking = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseDown = () => {
      isClicking = true;
      setTimeout(() => (isClicking = false), 300);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.25;
            ctx.strokeStyle = `rgba(0, 16, 16, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & Update Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse Interactivity (Grab on hover, Repulse on click)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);

        if (mouseDist < 140) {
          if (isClicking) {
            // Repulse
            p.x -= (dx / mouseDist) * 8;
            p.y -= (dy / mouseDist) * 8;
          } else {
            // Grab line to cursor
            ctx.strokeStyle = `rgba(0, 16, 16, ${(1 - mouseDist / 140) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;

        // Draw particle dot
        ctx.fillStyle = `rgba(0, 16, 16, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[linear-gradient(to_bottom,#142424_0%,#548490_35%,#84f7ff_70%,#083950_100%)] font-serif">
      
      {/* Interactive Animus Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto cursor-crosshair" />

      {/* Top Assassin's Creed Revelations Logo Title Block */}
      <div className="absolute top-[8%] sm:top-[12%] left-[6%] sm:left-[10%] z-10 pointer-events-none text-white tracking-wide">
        
        {/* Upper: A^ssassin's / P^avan's */}
        <div className="text-4xl sm:text-7xl font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          P<span className="text-2xl sm:text-4xl -translate-y-3 sm:-translate-y-5 inline-block font-serif">avan's</span>
        </div>

        {/* Mid: CREED / AUTOMATION */}
        <div className="text-5xl sm:text-8xl font-normal tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] -mt-2 sm:-mt-4">
          AUTOMATION
        </div>

        {/* Lower: Revelations / Systems in Iconic Red */}
        <div className="text-3xl sm:text-6xl font-normal text-[#c1232c] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ml-4 sm:ml-8 -mt-1 sm:-mt-2">
          ARCHITECTURE
        </div>

        {/* Subtitle Telemetry */}
        <p className="font-mono text-xs sm:text-sm text-neutral-900 font-bold tracking-widest uppercase mt-4 ml-1 drop-shadow-sm opacity-90">
          Autonomous AI Systems • WebRTC Voice • Enterprise ETL
        </p>
      </div>

      {/* Bottom-Left Assassin's Creed Animus Interactive Menu */}
      <div className="absolute bottom-[6%] sm:bottom-[8%] left-[6%] sm:left-[10%] z-20 w-64 sm:w-80 font-sans">
        <ul className="flex flex-col space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = activeMenu === idx;

            const content = (
              <div
                onMouseEnter={() => {
                  setActiveMenu(idx);
                  playHoverSound();
                }}
                onClick={playClickSound}
                className={`py-2 px-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-lg translate-x-2"
                    : "bg-[#282828]/90 text-[#d3d3d3] hover:text-white border border-[#2A3D3B]/60"
                }`}
              >
                {item.label}
              </div>
            );

            return (
              <li key={item.label}>
                {item.to ? (
                  <Link to={item.to}>{content}</Link>
                ) : (
                  <a href={item.href} download={item.download}>{content}</a>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom-Right Verified Status Badge */}
      <div className="absolute bottom-[6%] sm:bottom-[8%] right-[6%] sm:right-[10%] z-10 font-mono text-[11px] sm:text-xs text-neutral-900 font-bold tracking-widest text-right hidden sm:block">
        <div>ANIMUS // {profile.name.toUpperCase()}</div>
        <div className="text-emerald-950">STATUS: PRODUCTION OPERATIONAL</div>
      </div>

    </div>
  );
}
