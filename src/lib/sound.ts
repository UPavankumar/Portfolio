// Sound Service — Audio Asset Player & Web Audio Engine

let soundEnabled = true;

// Pre-created and cached Audio elements for 0ms instant playback
let hoverAudioTemplate: HTMLAudioElement | null = null;
let clickAudioTemplate: HTMLAudioElement | null = null;

const hoverPath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/assets/Hover.mp3";
const clickPath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/assets/Click.mp3";

if (typeof window !== "undefined") {
  hoverAudioTemplate = new Audio(hoverPath);
  clickAudioTemplate = new Audio(clickPath);
  hoverAudioTemplate.preload = "auto";
  clickAudioTemplate.preload = "auto";
  hoverAudioTemplate.load();
  clickAudioTemplate.load();
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  if (soundEnabled) playClickSound();
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Play Hover Sound (/assets/Hover.mp3)
 * Uses preloaded audio cache for instant playback without cutting off
 */
export function playHoverSound() {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const sound = hoverAudioTemplate ? (hoverAudioTemplate.cloneNode(true) as HTMLAudioElement) : new Audio(hoverPath);
    sound.volume = 0.65;
    sound.play().catch(() => {});
  } catch {
    // Autoplay fallback
  }
}

/**
 * Play Click Sound (/assets/Click.mp3)
 * Uses preloaded audio cache for instant playback without cutting off
 */
export function playClickSound() {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const sound = clickAudioTemplate ? (clickAudioTemplate.cloneNode(true) as HTMLAudioElement) : new Audio(clickPath);
    sound.volume = 0.85;
    sound.play().catch(() => {});
  } catch {
    // Autoplay fallback
  }
}

/**
 * Play Menu Back / Cancel Sound
 */
export function playCancelSound() {
  if (!soundEnabled || typeof window === "undefined") return;
  playHoverSound();
}

/**
 * Play Pop Sound
 */
export function playPopSound() {
  if (!soundEnabled || typeof window === "undefined") return;
  playClickSound();
}
