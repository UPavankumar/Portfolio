import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound } from "../lib/sound";

// Audio sound synth using Web Audio API
function playSound(type: "laser" | "hit" | "coin" | "powerup" | "nuke" | "gameover" | "warp") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "laser") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "coin") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.06); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.12); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "powerup") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(1350, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "nuke") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(35, now + 0.6);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.65);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === "gameover") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    } else if (type === "warp") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch {
    // AudioContext suppressed or unavailable
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

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  isSuper?: boolean;
}

interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  maxHp: number;
  label: string;
  color: string;
  type: "glitch" | "boss" | "swarmer";
  angle: number;
}

interface Token {
  x: number;
  y: number;
  vy: number;
  size: number;
  type: "coin" | "shield" | "nuke" | "hyperbeam" | "slowmo";
  angle: number;
}

const GLITCH_LABELS = ["404_ERR", "NULL_PTR", "BAD_ROUTE", "MEM_LEAK", "CORRUPT", "SYNTAX_ERR", "OVERFLOW"];

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("pavan_404_highscore") || "0", 10);
  });
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [multiplier, setMultiplier] = useState(1);
  const [health, setHealth] = useState(3);
  const [nukeReady, setNukeReady] = useState(false);
  const [nukeCharge, setNukeCharge] = useState(0);
  const [activeBuff, setActiveBuff] = useState<string | null>(null);

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const startGameRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Player state
    const player = {
      x: width / 2,
      y: height - 120,
      size: 26,
      vx: 0,
      vy: 0,
      speed: 7.5,
      hp: 3,
      shield: false,
      hyperUntil: 0,
      slowMoUntil: 0,
      invulnerableUntil: 0,
      nukeEnergy: 0,
      angle: 0,
    };

    let currentScore = 0;
    let currentMultiplier = 1;
    let comboTimer = 0;
    let shakeIntensity = 0;

    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let tokens: Token[] = [];
    let particles: Particle[] = [];
    let shockwaves: Shockwave[] = [];
    let floatingTexts: FloatingText[] = [];

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

      // Detonate Nuke / Super Weapon
      if (e.key.toLowerCase() === "e" || e.key.toLowerCase() === "q" || e.key.toLowerCase() === "b") {
        if (player.nukeEnergy >= 100 && gameStateRef.current === "playing") {
          triggerQuantumNuke();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (gameStateRef.current !== "playing") return;
      const targetX = e.clientX;
      const targetY = e.clientY;
      player.x += (targetX - player.x) * 0.18;
      player.y += (targetY - player.y) * 0.18;
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
      const touch = e.touches[0];
      player.x += (touch.clientX - player.x) * 0.22;
      player.y += (touch.clientY - player.y) * 0.22;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleMouseDown);

    function triggerScreenShake(amount: number) {
      shakeIntensity = Math.max(shakeIntensity, amount);
    }

    function addFloatingText(x: number, y: number, text: string, color: string) {
      floatingTexts.push({
        id: Math.random().toString(),
        x,
        y,
        text,
        color,
        alpha: 1,
      });
    }

    function fireBullet() {
      const now = Date.now();
      const isHyper = now < player.hyperUntil;
      playSound("laser");

      if (isHyper) {
        bullets.push(
          { x: player.x, y: player.y - 18, vx: 0, vy: -15, color: "#00f0ff", isSuper: true },
          { x: player.x - 12, y: player.y - 12, vx: -4, vy: -14, color: "#8b5cf6", isSuper: true },
          { x: player.x + 12, y: player.y - 12, vx: 4, vy: -14, color: "#8b5cf6", isSuper: true },
          { x: player.x - 22, y: player.y - 6, vx: -8, vy: -12, color: "#ec4899" },
          { x: player.x + 22, y: player.y - 6, vx: 8, vy: -12, color: "#ec4899" }
        );
      } else {
        bullets.push(
          { x: player.x - 7, y: player.y - 14, vx: -0.5, vy: -13, color: "#00f0ff" },
          { x: player.x + 7, y: player.y - 14, vx: 0.5, vy: -13, color: "#00f0ff" }
        );
      }

      // Muzzle glow particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 10,
          y: player.y - 16,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3,
          size: Math.random() * 3 + 1.5,
          color: "#00f0ff",
          life: 1,
          maxLife: 10,
        });
      }
    }

    function triggerQuantumNuke() {
      playSound("nuke");
      triggerScreenShake(25);
      player.nukeEnergy = 0;
      setNukeCharge(0);
      setNukeReady(false);

      shockwaves.push({
        x: player.x,
        y: player.y,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.8,
        color: "#00f0ff",
        alpha: 1,
      });

      addFloatingText(player.x, player.y - 40, "QUANTUM PURGE // OVERCLOCK", "#00f0ff");

      // Wipe all enemies
      enemies.forEach((e) => {
        createExplosion(e.x, e.y, e.color, 24);
        currentScore += 50 * currentMultiplier;
      });
      enemies = [];
      setScore(currentScore);
    }

    function createExplosion(x: number, y: number, color: string, count = 22) {
      triggerScreenShake(count > 25 ? 12 : 5);
      shockwaves.push({
        x,
        y,
        radius: 5,
        maxRadius: count * 3,
        color,
        alpha: 0.9,
      });

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 1.5,
          color,
          life: 1,
          maxLife: Math.random() * 24 + 16,
        });
      }
    }

    function spawnEnemy() {
      const isBoss = Math.random() < 0.08 && currentScore > 300;
      const isSwarmer = !isBoss && Math.random() < 0.25;

      const size = isBoss ? 44 : isSwarmer ? 16 : Math.random() * 14 + 22;
      const x = Math.random() * (width - size * 2) + size;
      const label = isBoss ? "MAINFRAME_CRASH" : GLITCH_LABELS[Math.floor(Math.random() * GLITCH_LABELS.length)];
      const speed = isBoss ? 1.2 : isSwarmer ? 3.4 : Math.random() * 1.8 + 1.4 + currentScore * 0.0008;

      enemies.push({
        x,
        y: -40,
        vx: (Math.random() - 0.5) * (isSwarmer ? 3.5 : 1.8),
        vy: speed,
        size,
        hp: isBoss ? 8 : isSwarmer ? 1 : size > 28 ? 3 : 1,
        maxHp: isBoss ? 8 : isSwarmer ? 1 : size > 28 ? 3 : 1,
        label,
        color: isBoss ? "#ec4899" : isSwarmer ? "#a855f7" : Math.random() > 0.4 ? "#ef4444" : "#f59e0b",
        type: isBoss ? "boss" : isSwarmer ? "swarmer" : "glitch",
        angle: 0,
      });
    }

    function spawnToken(x: number, y: number) {
      const rand = Math.random();
      let type: "coin" | "shield" | "nuke" | "hyperbeam" | "slowmo" = "coin";
      if (rand < 0.12) type = "shield";
      else if (rand < 0.22) type = "hyperbeam";
      else if (rand < 0.3) type = "nuke";
      else if (rand < 0.38) type = "slowmo";

      tokens.push({
        x,
        y,
        vy: 2.2,
        size: 16,
        type,
        angle: 0,
      });
    }

    function startGame() {
      setGameState("playing");
      currentScore = 0;
      currentMultiplier = 1;
      setScore(0);
      setMultiplier(1);
      setHealth(3);
      setNukeCharge(0);
      setNukeReady(false);
      setActiveBuff(null);

      player.x = width / 2;
      player.y = height - 120;
      player.hp = 3;
      player.shield = false;
      player.hyperUntil = 0;
      player.slowMoUntil = 0;
      player.nukeEnergy = 0;
      player.invulnerableUntil = Date.now() + 1200;

      bullets = [];
      enemies = [];
      tokens = [];
      particles = [];
      shockwaves = [];
      floatingTexts = [];
    }

    startGameRef.current = startGame;

    let lastSpawn = 0;
    let autoFireTimer = 0;
    let gridOffset = 0;

    const gameLoop = (timestamp: number) => {
      const now = Date.now();
      const isSlowMo = now < player.slowMoUntil;
      const timeScale = isSlowMo ? 0.4 : 1;

      // Handle screen shake
      if (shakeIntensity > 0) {
        const sx = (Math.random() - 0.5) * shakeIntensity;
        const sy = (Math.random() - 0.5) * shakeIntensity;
        canvas.style.transform = `translate(${sx}px, ${sy}px)`;
        shakeIntensity *= 0.88;
        if (shakeIntensity < 0.5) {
          shakeIntensity = 0;
          canvas.style.transform = "none";
        }
      }

      ctx.clearRect(0, 0, width, height);

      // 1. DRAW DYNAMIC SYNTHWAVE WARP GRID
      gridOffset = (gridOffset + 1.2 * timeScale) % 40;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridOffset; y < height; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Background ambient star particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let i = 0; i < 15; i++) {
        const starX = (Math.sin(i * 99 + timestamp * 0.0005) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 33 + timestamp * 0.0005) * 0.5 + 0.5) * height;
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      if (gameStateRef.current === "playing") {
        // Player keyboard controls
        if (keys["arrowleft"] || keys["a"]) player.x -= player.speed;
        if (keys["arrowright"] || keys["d"]) player.x += player.speed;
        if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
        if (keys["arrowdown"] || keys["s"]) player.y += player.speed;

        // Space auto fire
        if (keys[" "] && timestamp - autoFireTimer > 150) {
          autoFireTimer = timestamp;
          fireBullet();
        }

        // Clamp player in bounds
        player.x = Math.max(35, Math.min(width - 35, player.x));
        player.y = Math.max(80, Math.min(height - 40, player.y));

        // Spawn enemies
        if (timestamp - lastSpawn > Math.max(300, 1000 - currentScore * 3) / timeScale) {
          spawnEnemy();
          lastSpawn = timestamp;
        }

        // Combo multiplier cooldown
        if (currentMultiplier > 1) {
          comboTimer -= timeScale;
          if (comboTimer <= 0) {
            currentMultiplier = 1;
            setMultiplier(1);
          }
        }

        // Update charge & buff UI
        setNukeCharge(player.nukeEnergy);
        setNukeReady(player.nukeEnergy >= 100);

        if (now < player.hyperUntil) setActiveBuff("⚡ HYPER-BEAM ACTIVE");
        else if (now < player.slowMoUntil) setActiveBuff("⏱ CHRONO SLOW-MO");
        else if (player.shield) setActiveBuff("🛡️ SHIELD MATRIX");
        else setActiveBuff(null);
      }

      // 2. UPDATE & DRAW SHOCKWAVES
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 4;
        sw.alpha *= 0.91;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 3;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();

        if (sw.alpha < 0.03 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }

      // 3. UPDATE & DRAW BULLETS
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx * timeScale;
        b.y += b.vy * timeScale;

        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.isSuper ? 18 : 10;
        ctx.fillRect(b.x - (b.isSuper ? 3 : 2), b.y - (b.isSuper ? 12 : 8), b.isSuper ? 6 : 4, b.isSuper ? 24 : 16);
        ctx.restore();

        if (b.y < -30 || b.x < 0 || b.x > width) {
          bullets.splice(i, 1);
        }
      }

      // 4. UPDATE & DRAW ENEMIES
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.x += e.vx * timeScale;
        e.y += e.vy * timeScale;
        e.angle += 0.02 * timeScale;

        if (e.x < e.size || e.x > width - e.size) e.vx *= -1;

        // Render Enemy
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.angle);

        ctx.strokeStyle = e.color;
        ctx.fillStyle = `${e.color}18`;
        ctx.lineWidth = e.type === "boss" ? 3 : 2;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 14;

        if (e.type === "boss") {
          ctx.beginPath();
          ctx.rect(-e.size, -e.size, e.size * 2, e.size * 2);
          ctx.stroke();
          ctx.fillRect(-e.size, -e.size, e.size * 2, e.size * 2);

          // Internal core
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
        } else if (e.type === "swarmer") {
          ctx.beginPath();
          ctx.moveTo(0, -e.size);
          ctx.lineTo(e.size, e.size);
          ctx.lineTo(-e.size, e.size);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        } else {
          ctx.strokeRect(-e.size, -e.size, e.size * 2, e.size * 2);
          ctx.fillRect(-e.size, -e.size, e.size * 2, e.size * 2);
        }

        ctx.restore();

        // HP Bar & Label
        ctx.fillStyle = "#ffffff";
        ctx.font = e.type === "boss" ? "bold 11px monospace" : "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(e.label, e.x, e.y + e.size + 14);

        if (e.maxHp > 1) {
          const barW = e.size * 2;
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(e.x - barW / 2, e.y - e.size - 10, barW, 4);
          ctx.fillStyle = e.color;
          ctx.fillRect(e.x - barW / 2, e.y - e.size - 10, (e.hp / e.maxHp) * barW, 4);
        }

        // Bullet Collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const dist = Math.hypot(e.x - b.x, e.y - b.y);

          if (dist < e.size + (b.isSuper ? 12 : 6)) {
            e.hp -= b.isSuper ? 3 : 1;
            bullets.splice(j, 1);

            // Charge nuke meter
            player.nukeEnergy = Math.min(100, player.nukeEnergy + (b.isSuper ? 6 : 3));

            if (e.hp <= 0) {
              playSound("hit");
              createExplosion(e.x, e.y, e.color, e.type === "boss" ? 45 : 20);

              const pointsGained = (e.type === "boss" ? 150 : e.type === "swarmer" ? 20 : 10) * currentMultiplier;
              currentScore += pointsGained;
              currentMultiplier = Math.min(10, currentMultiplier + 1);
              comboTimer = 160;
              setScore(currentScore);
              setMultiplier(currentMultiplier);

              addFloatingText(e.x, e.y, `+${pointsGained}`, e.color);

              if (Math.random() < (e.type === "boss" ? 0.9 : 0.45)) spawnToken(e.x, e.y);

              enemies.splice(i, 1);
              break;
            } else {
              createExplosion(b.x, b.y, "#00f0ff", 4);
            }
          }
        }

        // Collision with Player Ship
        if (gameStateRef.current === "playing") {
          const playerDist = Math.hypot(e.x - player.x, e.y - player.y);
          if (playerDist < e.size + player.size - 6) {
            if (now > player.invulnerableUntil) {
              if (player.shield) {
                player.shield = false;
                player.invulnerableUntil = now + 800;
                playSound("hit");
                createExplosion(player.x, player.y, "#38bdf8", 25);
                enemies.splice(i, 1);
                addFloatingText(player.x, player.y - 30, "SHIELD BROKEN!", "#38bdf8");
              } else {
                player.hp--;
                setHealth(player.hp);
                player.invulnerableUntil = now + 1400;
                triggerScreenShake(16);
                playSound("hit");
                createExplosion(player.x, player.y, "#ef4444", 25);

                if (player.hp <= 0) {
                  playSound("gameover");
                  createExplosion(player.x, player.y, "#00f0ff", 45);
                  setGameState("gameover");

                  if (currentScore > highScore) {
                    setHighScore(currentScore);
                    localStorage.setItem("pavan_404_highscore", currentScore.toString());
                  }
                } else {
                  addFloatingText(player.x, player.y - 30, "CRITICAL HULL DAMAGE!", "#ef4444");
                }
              }
            }
          }
        }

        if (e.y > height + 50) {
          enemies.splice(i, 1);
        }
      }

      // 5. UPDATE & DRAW TOKENS / POWER-UPS
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        t.y += t.vy * timeScale;
        t.angle += 0.04;

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.angle);

        let color = "#10b981";
        let label = "✦";

        if (t.type === "shield") {
          color = "#38bdf8";
          label = "SHD";
        } else if (t.type === "hyperbeam") {
          color = "#8b5cf6";
          label = "TRI";
        } else if (t.type === "nuke") {
          color = "#ec4899";
          label = "NUKE";
        } else if (t.type === "slowmo") {
          color = "#00f0ff";
          label = "SLOW";
        }

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, t.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000000";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 0, 0);
        ctx.restore();

        // Check Player Collection
        const dist = Math.hypot(t.x - player.x, t.y - player.y);
        if (dist < t.size + player.size + 8) {
          if (t.type === "coin") {
            playSound("coin");
            currentScore += 35 * currentMultiplier;
            setScore(currentScore);
            addFloatingText(t.x, t.y, `+${35 * currentMultiplier} SYNC`, "#10b981");
            createExplosion(t.x, t.y, "#10b981", 12);
          } else if (t.type === "shield") {
            playSound("powerup");
            player.shield = true;
            addFloatingText(t.x, t.y, "SHIELD ENGAGED", "#38bdf8");
            createExplosion(t.x, t.y, "#38bdf8", 16);
          } else if (t.type === "hyperbeam") {
            playSound("powerup");
            player.hyperUntil = now + 9000;
            addFloatingText(t.x, t.y, "HYPER-BEAM OVERDRIVE", "#8b5cf6");
            createExplosion(t.x, t.y, "#8b5cf6", 18);
          } else if (t.type === "nuke") {
            playSound("warp");
            player.nukeEnergy = 100;
            addFloatingText(t.x, t.y, "NUKE PRIMED [E/SPACE]", "#ec4899");
            createExplosion(t.x, t.y, "#ec4899", 20);
          } else if (t.type === "slowmo") {
            playSound("warp");
            player.slowMoUntil = now + 6000;
            addFloatingText(t.x, t.y, "CHRONO DILATION", "#00f0ff");
            createExplosion(t.x, t.y, "#00f0ff", 16);
          }
          tokens.splice(i, 1);
        } else if (t.y > height + 30) {
          tokens.splice(i, 1);
        }
      }

      // 6. DRAW PLAYER JET SHIP
      if (gameStateRef.current === "playing") {
        ctx.save();
        ctx.translate(player.x, player.y);

        // Invulnerability flicker
        if (now < player.invulnerableUntil && Math.floor(timestamp / 60) % 2 === 0) {
          ctx.globalAlpha = 0.4;
        }

        // Shield Dome
        if (player.shield) {
          ctx.strokeStyle = "#38bdf8";
          ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(0, 0, player.size + 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        }

        // Ship Body (Cyan Cyber Jet)
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(0, -player.size);
        ctx.lineTo(player.size * 0.85, player.size * 0.75);
        ctx.lineTo(0, player.size * 0.35);
        ctx.lineTo(-player.size * 0.85, player.size * 0.75);
        ctx.closePath();
        ctx.fill();

        // Cockpit canopy
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -4, 5, 0, Math.PI * 2);
        ctx.fill();

        // Engine Thruster Flame
        ctx.fillStyle = Math.random() > 0.5 ? "#f59e0b" : "#ef4444";
        ctx.beginPath();
        ctx.moveTo(-5, player.size * 0.45);
        ctx.lineTo(0, player.size * 0.45 + Math.random() * 18 + 8);
        ctx.lineTo(5, player.size * 0.45);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 7. UPDATE & DRAW PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // 8. UPDATE & DRAW FLOATING TEXT
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 1.2 * timeScale;
        ft.alpha -= 0.02 * timeScale;

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleMouseDown);
    };
  }, [highScore]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[10000] bg-[#02040a] text-white overflow-hidden select-none">
      
      {/* Fullscreen Cyber Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-0" />

      {/* CRT Scanline & Chromatic Overlay Filter */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
          backgroundSize: "100% 4px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

      {/* Top Glass HUD Bar */}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-auto">
        
        {/* Left Status & Lives */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl flex items-center gap-3 font-mono text-xs shadow-xl">
            <span className="size-2 rounded-full bg-red-500 animate-ping" />
            <div>
              <span className="text-red-400 font-bold block text-[11px]">404 PROTOCOL</span>
              <span className="text-[9px] text-neutral-400">MAINFRAME BREACH</span>
            </div>
          </div>

          {/* Health Hearts */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
            {[1, 2, 3].map((hp) => (
              <span key={hp} className={`text-base transition-opacity ${hp <= health ? "opacity-100 scale-105" : "opacity-20"}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Center Live Score & Multiplier */}
        <div className="flex items-center gap-4 px-6 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl font-mono">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase tracking-widest">Score</span>
            <span className="text-xl sm:text-2xl font-black text-white">{score}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase tracking-widest">High</span>
            <span className="text-lg font-bold text-acc">{highScore}</span>
          </div>
          {multiplier > 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-acc text-black font-black text-xs animate-bounce shadow-[0_0_15px_#00f0ff]">
              {multiplier}X
            </span>
          )}
        </div>

        {/* Right Exit Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xl font-mono text-xs text-white hover:bg-white hover:text-black transition-all hover:scale-105"
          >
            ← Return Home
          </Link>
          <Link
            to="/projects"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="hidden sm:inline-block px-4 py-2 rounded-xl bg-acc/10 border border-acc/30 backdrop-blur-xl font-mono text-xs text-acc hover:bg-acc hover:text-black transition-all hover:scale-105"
          >
            Case Studies →
          </Link>
        </div>
      </header>

      {/* Bottom Power & Nuke Gauge HUD */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        
        {/* Active Powerup Pill */}
        <div className="font-mono text-xs">
          {activeBuff && (
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-acc/40 text-acc font-bold backdrop-blur-xl animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              {activeBuff}
            </div>
          )}
        </div>

        {/* Quantum Nuke Energy Meter */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl font-mono pointer-events-auto">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
              {nukeReady ? "QUANTUM PURGE READY" : "OVERCLOCK GAUGE"}
            </span>
            <span className="text-xs font-bold text-white">{nukeCharge}%</span>
          </div>

          <div className="w-24 sm:w-36 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                nukeReady ? "bg-[#ec4899] shadow-[0_0_12px_#ec4899] animate-pulse" : "bg-acc"
              }`}
              style={{ width: `${nukeCharge}%` }}
            />
          </div>

          {nukeReady && (
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", { key: "e" });
                window.dispatchEvent(event);
              }}
              className="px-3 py-1 rounded-lg bg-[#ec4899] text-white font-black text-[10px] animate-bounce cursor-pointer shadow-[0_0_15px_#ec4899]"
            >
              PURGE [E]
            </button>
          )}
        </div>

      </div>

      {/* Interactive Overlay Modals: Idle Start / Game Over */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {gameState === "idle" ? (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-lg space-y-6"
              >
                <div className="size-20 rounded-3xl bg-acc/10 border border-acc/30 mx-auto flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                  🚀
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                    404 /// LOST ROUTE DETECTED
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                    NEURAL <span className="text-acc">BREACH</span>
                  </h1>
                  <p className="text-neutral-400 text-xs sm:text-sm font-mono leading-relaxed max-w-md mx-auto">
                    You've drifted outside the portfolio network. Pilot the neural vector, vaporize corrupted glitch nodes, and purge the mainframe!
                  </p>
                </div>

                {/* Control badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-300">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-acc block font-bold">MOVE</span>
                    WASD / Mouse / Touch
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-acc block font-bold">FIRE</span>
                    Spacebar / Click / Tap
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[#ec4899] block font-bold">SUPER NUKE</span>
                    Key [E] at 100%
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playSound("warp");
                    startGameRef.current();
                  }}
                  className="px-10 py-4 rounded-2xl bg-acc text-black font-black uppercase tracking-widest font-mono text-sm shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:bg-white transition-all hover:scale-105 cursor-pointer"
                >
                  INITIALIZE MISSION [SPACE]
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-md space-y-6"
              >
                <div className="size-20 rounded-3xl bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                  💥
                </div>

                <div className="space-y-2 font-mono">
                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-red-500">
                    SIGNAL LOST
                  </h2>
                  <p className="text-xs text-neutral-400">CORRUPT PACKETS OVERWHELMED CORE MEMORY</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Final Score:</span>
                    <span className="text-white font-bold text-lg">{score}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">All-Time High Score:</span>
                    <span className="text-acc font-bold text-lg">{highScore}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playSound("warp");
                      startGameRef.current();
                    }}
                    className="w-full py-3.5 rounded-xl bg-red-500 text-white font-black uppercase tracking-wider font-mono text-xs shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:bg-white hover:text-black transition-all hover:scale-105 cursor-pointer"
                  >
                    RETRY MISSION [SPACE]
                  </button>
                  <Link
                    to="/"
                    className="w-full py-3.5 rounded-xl bg-white text-black font-black uppercase tracking-wider font-mono text-xs hover:bg-acc transition-all hover:scale-105 text-center"
                  >
                    Return Home →
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
