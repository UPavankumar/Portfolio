import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { playClickSound, playHoverSound } from "../lib/sound";

// Audio sound synth using Web Audio API
function playSound(type: "laser" | "hit" | "coin" | "powerup" | "gameover") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "laser") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "coin") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "powerup") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "gameover") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.4);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch {
    // AudioContext blocked or not supported
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  label: string;
  color: string;
}

interface Token {
  x: number;
  y: number;
  vy: number;
  size: number;
  type: "coin" | "shield" | "multishot";
}

const GLITCH_LABELS = ["404_ERR", "NULL_PTR", "BAD_ROUTE", "MEM_LEAK", "CORRUPT", "SYNTAX_ERR"];

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("pavan_404_highscore") || "0", 10);
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [multiplier, setMultiplier] = useState(1);
  const [shieldActive, setShieldActive] = useState(false);
  const [multiShot, setMultiShot] = useState(false);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Start game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = Math.min(500, window.innerHeight * 0.6));

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = Math.min(500, window.innerHeight * 0.6);
      }
    };
    window.addEventListener("resize", handleResize);

    // Player state
    const player = {
      x: width / 2,
      y: height - 60,
      size: 22,
      vx: 0,
      vy: 0,
      speed: 6,
      shield: false,
      multiShotUntil: 0,
      invulnerableUntil: 0,
    };

    let currentScore = 0;
    let currentMultiplier = 1;
    let comboTimer = 0;

    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let tokens: Token[] = [];
    let particles: Particle[] = [];

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      if (e.code === "Space") {
        e.preventDefault();
        if (gameStateRef.current === "idle" || gameStateRef.current === "gameover") {
          startGame();
        } else if (gameStateRef.current === "playing") {
          fireBullet();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    // Mouse / Touch aiming & movement
    const handleMouseMove = (e: MouseEvent) => {
      if (gameStateRef.current !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      player.x += (targetX - player.x) * 0.15;
    };

    const handleMouseDown = () => {
      if (gameStateRef.current === "idle" || gameStateRef.current === "gameover") {
        startGame();
      } else if (gameStateRef.current === "playing") {
        fireBullet();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameStateRef.current !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const targetX = touch.clientX - rect.left;
      player.x += (targetX - player.x) * 0.2;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchstart", handleMouseDown);

    function fireBullet() {
      const now = Date.now();
      const isMulti = now < player.multiShotUntil;
      playSound("laser");

      if (isMulti) {
        bullets.push(
          { x: player.x, y: player.y - 12, vx: 0, vy: -11, color: "#00f0ff" },
          { x: player.x - 8, y: player.y - 8, vx: -3, vy: -10, color: "#8b5cf6" },
          { x: player.x + 8, y: player.y - 8, vx: 3, vy: -10, color: "#8b5cf6" }
        );
      } else {
        bullets.push({ x: player.x, y: player.y - 12, vx: 0, vy: -11, color: "#00f0ff" });
      }

      // Recoil muzzle flash particles
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: player.x,
          y: player.y - 12,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2,
          size: Math.random() * 3 + 1,
          color: "#00f0ff",
          life: 1,
          maxLife: 10,
        });
      }
    }

    function createExplosion(x: number, y: number, color: string, count = 18) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          color,
          life: 1,
          maxLife: Math.random() * 20 + 15,
        });
      }
    }

    function spawnEnemy() {
      const size = Math.random() * 16 + 20;
      const x = Math.random() * (width - size * 2) + size;
      const label = GLITCH_LABELS[Math.floor(Math.random() * GLITCH_LABELS.length)];
      const speed = Math.random() * 1.8 + 1.2 + currentScore * 0.001;

      enemies.push({
        x,
        y: -30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: speed,
        size,
        hp: size > 28 ? 2 : 1,
        label,
        color: Math.random() > 0.3 ? "#ef4444" : "#f59e0b",
      });
    }

    function spawnToken(x: number, y: number) {
      const rand = Math.random();
      let type: "coin" | "shield" | "multishot" = "coin";
      if (rand < 0.15) type = "shield";
      else if (rand < 0.3) type = "multishot";

      tokens.push({
        x,
        y,
        vy: 1.8,
        size: 14,
        type,
      });
    }

    function startGame() {
      setGameState("playing");
      currentScore = 0;
      currentMultiplier = 1;
      setScore(0);
      setMultiplier(1);
      setShieldActive(false);
      setMultiShot(false);

      player.x = width / 2;
      player.y = height - 60;
      player.shield = false;
      player.multiShotUntil = 0;
      player.invulnerableUntil = Date.now() + 1000;

      bullets = [];
      enemies = [];
      tokens = [];
      particles = [];
    }

    let lastSpawn = 0;
    let autoFireTimer = 0;

    const gameLoop = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Starfield background grid
      ctx.fillStyle = "rgba(0, 240, 255, 0.03)";
      for (let x = 0; x < width; x += 40) {
        ctx.fillRect(x, 0, 1, height);
      }
      for (let y = 0; y < height; y += 40) {
        ctx.fillRect(0, y, width, 1);
      }

      if (gameStateRef.current === "playing") {
        // Player keyboard controls
        if (keys["arrowleft"] || keys["a"]) player.x -= player.speed;
        if (keys["arrowright"] || keys["d"]) player.x += player.speed;
        if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
        if (keys["arrowdown"] || keys["s"]) player.y += player.speed;

        // Auto continuous fire while space is held
        if (keys[" "] && timestamp - autoFireTimer > 180) {
          autoFireTimer = timestamp;
          fireBullet();
        }

        // Clamp player in bounds
        player.x = Math.max(25, Math.min(width - 25, player.x));
        player.y = Math.max(height * 0.4, Math.min(height - 25, player.y));

        // Spawn enemies
        if (timestamp - lastSpawn > Math.max(350, 1100 - currentScore * 4)) {
          spawnEnemy();
          lastSpawn = timestamp;
        }

        // Combo multiplier cooldown
        if (currentMultiplier > 1) {
          comboTimer--;
          if (comboTimer <= 0) {
            currentMultiplier = 1;
            setMultiplier(1);
          }
        }

        // Update state hooks
        setShieldActive(player.shield);
        setMultiShot(Date.now() < player.multiShotUntil);
      }

      // 1. UPDATE & DRAW BULLETS
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 2, b.y - 6, 4, 12);
        ctx.shadowBlur = 0;

        if (b.y < -10 || b.x < 0 || b.x > width) {
          bullets.splice(i, 1);
        }
      }

      // 2. UPDATE & DRAW ENEMIES
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x += e.vx;
        e.y += e.vy;

        // Bounce off side walls
        if (e.x < e.size || e.x > width - e.size) e.vx *= -1;

        // Draw Enemy Glitch Box
        ctx.strokeStyle = e.color;
        ctx.fillStyle = `${e.color}22`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.strokeRect(e.x - e.size, e.y - e.size, e.size * 2, e.size * 2);
        ctx.fillRect(e.x - e.size, e.y - e.size, e.size * 2, e.size * 2);

        // Enemy Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(e.label, e.x, e.y + 3);
        ctx.shadowBlur = 0;

        // Check Collision with Bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const dist = Math.hypot(e.x - b.x, e.y - b.y);

          if (dist < e.size + 4) {
            e.hp--;
            bullets.splice(j, 1);

            if (e.hp <= 0) {
              playSound("hit");
              createExplosion(e.x, e.y, e.color, 16);

              currentScore += 10 * currentMultiplier;
              currentMultiplier = Math.min(8, currentMultiplier + 1);
              comboTimer = 140;
              setScore(currentScore);
              setMultiplier(currentMultiplier);

              if (Math.random() < 0.45) spawnToken(e.x, e.y);

              enemies.splice(i, 1);
              break;
            } else {
              createExplosion(b.x, b.y, "#00f0ff", 6);
            }
          }
        }

        // Check Collision with Player
        if (gameStateRef.current === "playing") {
          const playerDist = Math.hypot(e.x - player.x, e.y - player.y);
          if (playerDist < e.size + player.size - 6) {
            if (Date.now() > player.invulnerableUntil) {
              if (player.shield) {
                player.shield = false;
                player.invulnerableUntil = Date.now() + 800;
                playSound("hit");
                createExplosion(player.x, player.y, "#10b981", 20);
                enemies.splice(i, 1);
              } else {
                // Game Over
                playSound("gameover");
                createExplosion(player.x, player.y, "#00f0ff", 35);
                setGameState("gameover");

                if (currentScore > highScore) {
                  setHighScore(currentScore);
                  localStorage.setItem("pavan_404_highscore", currentScore.toString());
                }
              }
            }
          }
        }

        if (e.y > height + 40) {
          enemies.splice(i, 1);
        }
      }

      // 3. UPDATE & DRAW TOKENS / POWER-UPS
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        t.y += t.vy;

        ctx.save();
        ctx.translate(t.x, t.y);

        if (t.type === "coin") {
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, t.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("✦", 0, 0);
        } else if (t.type === "shield") {
          ctx.fillStyle = "#38bdf8";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, t.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("SHD", 0, 0);
        } else if (t.type === "multishot") {
          ctx.fillStyle = "#8b5cf6";
          ctx.shadowColor = "#8b5cf6";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, t.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("TRI", 0, 0);
        }
        ctx.restore();

        // Check Collect
        const dist = Math.hypot(t.x - player.x, t.y - player.y);
        if (dist < t.size + player.size) {
          if (t.type === "coin") {
            playSound("coin");
            currentScore += 25 * currentMultiplier;
            setScore(currentScore);
            createExplosion(t.x, t.y, "#10b981", 10);
          } else if (t.type === "shield") {
            playSound("powerup");
            player.shield = true;
            createExplosion(t.x, t.y, "#38bdf8", 14);
          } else if (t.type === "multishot") {
            playSound("powerup");
            player.multiShotUntil = Date.now() + 8000;
            createExplosion(t.x, t.y, "#8b5cf6", 14);
          }
          tokens.splice(i, 1);
        } else if (t.y > height + 20) {
          tokens.splice(i, 1);
        }
      }

      // 4. DRAW PLAYER
      if (gameStateRef.current === "playing") {
        ctx.save();
        ctx.translate(player.x, player.y);

        // Shield Bubble
        if (player.shield) {
          ctx.strokeStyle = "#38bdf8";
          ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
          ctx.lineWidth = 2;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(0, 0, player.size + 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        }

        // Player Ship (Cyan Jet Vector)
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, -player.size);
        ctx.lineTo(player.size * 0.8, player.size * 0.8);
        ctx.lineTo(0, player.size * 0.4);
        ctx.lineTo(-player.size * 0.8, player.size * 0.8);
        ctx.closePath();
        ctx.fill();

        // Cockpit Glass
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Engine Trail Flame
        ctx.fillStyle = Math.random() > 0.5 ? "#f59e0b" : "#ef4444";
        ctx.beginPath();
        ctx.moveTo(-4, player.size * 0.5);
        ctx.lineTo(0, player.size * 0.5 + Math.random() * 12 + 6);
        ctx.lineTo(4, player.size * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 5. UPDATE & DRAW PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchstart", handleMouseDown);
    };
  }, [highScore]);

  return (
    <MotionConfig reducedMotion="user">
      <Nav />

      <main className="min-h-screen bg-[#02040a] text-white pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-[5vw] overflow-x-hidden flex flex-col items-center justify-center select-none">
        <div className="max-w-4xl w-full mx-auto space-y-8 text-center">
          
          {/* Header */}
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs"
            >
              <span className="size-2 rounded-full bg-red-500 animate-ping" />
              <span>404 /// ROUTE CORRUPTED</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              CYBER <span className="text-acc">PACKET DEFENDER</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
              The page you're looking for drifted into corrupted space. Destroy glitch packets and clear the memory buffer!
            </p>
          </div>

          {/* Game Canvas Box */}
          <div className="relative rounded-3xl border border-white/15 bg-[#05070f] shadow-2xl overflow-hidden backdrop-blur-2xl">
            
            {/* HUD Overlay Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/60 font-mono text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-neutral-500 text-[10px] block">SCORE</span>
                  <span className="text-white font-bold text-base">{score}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] block">HIGH SCORE</span>
                  <span className="text-acc font-bold text-base">{highScore}</span>
                </div>
                {multiplier > 1 && (
                  <span className="px-2 py-0.5 rounded-md bg-acc text-black font-extrabold text-xs animate-bounce">
                    {multiplier}X COMBO!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {shieldActive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px]">
                    🛡️ SHIELD
                  </span>
                )}
                {multiShot && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px]">
                    ⚡ TRI-CANNON
                  </span>
                )}
              </div>
            </div>

            {/* Canvas viewport */}
            <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[400px] block bg-black/80 cursor-crosshair" />

            {/* Start / Game Over Overlay */}
            {gameState !== "playing" && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
                {gameState === "idle" ? (
                  <>
                    <div className="size-16 rounded-2xl bg-acc/10 border border-acc/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                      🚀
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                      INITIALIZE ARCADE DEFENDER
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-xs font-mono">
                      Controls: <span className="text-acc">Arrow Keys / WASD / Mouse Drag</span> to move. <span className="text-acc">Spacebar / Click</span> to shoot.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        playSound("laser");
                        setGameState("playing");
                      }}
                      className="px-8 py-3.5 rounded-xl bg-acc text-black font-black uppercase tracking-wider font-mono text-xs shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:bg-white transition-transform hover:scale-105 cursor-pointer"
                    >
                      START MISSION [SPACE]
                    </button>
                  </>
                ) : (
                  <>
                    <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      💥
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-red-400 font-mono">
                      SIGNAL LOST // 404
                    </h3>
                    <div className="font-mono text-sm space-y-1">
                      <p className="text-neutral-300">Final Score: <span className="text-white font-bold">{score}</span></p>
                      <p className="text-neutral-400 text-xs">High Score: <span className="text-acc font-bold">{highScore}</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSound("laser");
                        setGameState("playing");
                      }}
                      className="px-8 py-3.5 rounded-xl bg-red-500 text-white font-black uppercase tracking-wider font-mono text-xs shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:bg-white hover:text-black transition-transform hover:scale-105 cursor-pointer"
                    >
                      RETRY MISSION [SPACE]
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Exit Navigation Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
            <Link
              to="/"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-acc transition-colors cursor-pointer"
            >
              ← Return Home
            </Link>
            <Link
              to="/projects"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
            >
              View Case Studies →
            </Link>
            <Link
              to="/skills"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
            >
              Explore Tech Stack →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </MotionConfig>
  );
}
