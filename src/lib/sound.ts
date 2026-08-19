// Sound Service — Audio Asset Player & Web Audio Engine

let soundEnabled = true;

// Pre-created and cached Audio elements for 0ms instant playback
let hoverAudioTemplate: HTMLAudioElement | null = null;
let clickAudioTemplate: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  hoverAudioTemplate = new Audio("/assets/Hover.mp3");
  clickAudioTemplate = new Audio("/assets/Click.mp3");
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
    const sound = hoverAudioTemplate ? (hoverAudioTemplate.cloneNode(true) as HTMLAudioElement) : new Audio("/assets/Hover.mp3");
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
    const sound = clickAudioTemplate ? (clickAudioTemplate.cloneNode(true) as HTMLAudioElement) : new Audio("/assets/Click.mp3");
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
