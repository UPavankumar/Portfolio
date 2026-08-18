import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useVelocity, useAnimationFrame } from "framer-motion";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const isMoved = useRef(false);
  const mousePos = useRef({ x: -100, y: -100 });

  // Floaty springs for paper plane position
  const planeX = useSpring(mouseX, { stiffness: 160, damping: 18, mass: 0.3 });
  const planeY = useSpring(mouseY, { stiffness: 160, damping: 18, mass: 0.3 });

  // Velocity for plane heading and speed scaling
  const velocityX = useVelocity(planeX);
  const velocityY = useVelocity(planeY);

  const speedVal = useMotionValue(1);
  const scale = useSpring(speedVal, { stiffness: 200, damping: 18 });

  // Smooth angle tracking
  const headingAngleRad = useRef(0);
  const prevAngleRad = useRef(0);

  const config = {
    pointsNumber: 20,
    widthFactor: 0.45,
    spring: 0.38,
    friction: 0.52,
  };

  const points = useRef<{ x: number; y: number; dx: number; dy: number }[]>([]);
  const [isDesktopMouse, setIsDesktopMouse] = useState(false);
  const isHoverRef = useRef(false);
  const isProjectRef = useRef(false);
  const isInputRef = useRef(false);

  // Strict check: only activate custom cursor for desktop with hover capability and fine pointer
  useEffect(() => {
    const checkPointer = () => {
      const isFine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
      const isWideEnough = window.innerWidth >= 768;
      const isTouch = "ontouchstart" in window && window.innerWidth < 1024;
      setIsDesktopMouse(isFine && isWideEnough && !isTouch);
    };

    checkPointer();
    window.addEventListener("resize", checkPointer);
    return () => window.removeEventListener("resize", checkPointer);
  }, []);

  // Frame loop for paper plane rotation & speed scaling
  useAnimationFrame(() => {
    if (!isDesktopMouse) return;

    const vx = velocityX.get();
    const vy = velocityY.get();
    const speed = Math.sqrt(vx * vx + vy * vy);

    // Scale up noticeably with speed
    const targetScale = 1 + Math.min(speed / 380, 1.3);
    speedVal.set(targetScale);

    if (speed > 10) {
      const targetAngle = Math.atan2(vy, vx);

      let delta = targetAngle - prevAngleRad.current;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      const nextAngle = prevAngleRad.current + delta;
      prevAngleRad.current = nextAngle;
      headingAngleRad.current = nextAngle;
    }
  });

  useEffect(() => {
    if (!isDesktopMouse) return;

    if (points.current.length === 0) {
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;
      mousePos.current = { x: initialX, y: initialY };
      mouseX.set(initialX);
      mouseY.set(initialY);
      points.current = new Array(config.pointsNumber).fill(null).map(() => ({
        x: initialX,
        y: initialY,
        dx: 0,
        dy: 0,
      }));
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const planePath = new Path2D("M2.5 12L21.5 3.5L13 21.5L9.5 14L2.5 12Z");
    const linePath = new Path2D("M21.5 3.5L9.5 14");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateMouse = (px: number, py: number) => {
      mousePos.current.x = px;
      mousePos.current.y = py;
      mouseX.set(px);
      mouseY.set(py);
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMoved.current = true;
      updateMouse(e.clientX, e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverTarget =
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.closest('[role="button"]');
      isHoverRef.current = !!hoverTarget;

      const projectTarget = target.closest('[data-cursor="project"]');
      isProjectRef.current = !!projectTarget;

      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        !!target.closest("input, textarea, select, [contenteditable='true']");
      isInputRef.current = isInput;
    };

    const handleClick = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);
    handleResize();

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const px = planeX.get();
      const py = planeY.get();
      const angle = headingAngleRad.current;
      const currentScale = scale.get();

      // Tail coordinates relative to plane center
      const tailX = px + Math.cos(angle + Math.PI) * (8 * currentScale);
      const tailY = py + Math.sin(angle + Math.PI) * (8 * currentScale);

      // Update trail points: point 0 IS the tail coordinates
      points.current.forEach((p, index) => {
        if (index === 0) {
          p.x = tailX;
          p.y = tailY;
          p.dx = 0;
          p.dy = 0;
        } else {
          const leader = points.current[index - 1];
          p.dx += (leader.x - p.x) * config.spring;
          p.dy += (leader.y - p.y) * config.spring;
          p.dx *= config.friction;
          p.dy *= config.friction;
          p.x += p.dx;
          p.y += p.dy;
        }
      });

      if (isMoved.current && !isInputRef.current) {
        // 1. Draw Fluid Line Trail on Canvas
        ctx.lineCap = "round";
        ctx.strokeStyle = "#ffffff";
        const isHovered = isHoverRef.current || isProjectRef.current;

        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);

        for (let i = 1; i < points.current.length - 1; i++) {
          const midX = 0.5 * (points.current[i].x + points.current[i + 1].x);
          const midY = 0.5 * (points.current[i].y + points.current[i + 1].y);
          ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, midX, midY);
          ctx.lineWidth = config.widthFactor * (config.pointsNumber - i) * (isHovered ? 2.2 : 1);
          ctx.stroke();
        }

        ctx.lineTo(
          points.current[points.current.length - 1].x,
          points.current[points.current.length - 1].y
        );
        ctx.stroke();

        // 2. Draw Paper Plane SVG directly on Canvas (Unified with Trail!)
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle + Math.PI / 4); // +45deg to align plane vector
        ctx.scale(currentScale, currentScale);
        ctx.translate(-12, -12); // center at (12, 12)

        ctx.fillStyle = "#ffffff";
        ctx.fill(planePath);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.2;
        ctx.stroke(planePath);
        ctx.stroke(linePath);

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, [isDesktopMouse, planeX, planeY, mouseX, mouseY, scale]);

  // Completely disabled on mobile and touch screens
  if (!isDesktopMouse) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.25))" }}
    />
  );
}
