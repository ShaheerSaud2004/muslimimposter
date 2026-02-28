/**
 * Optional sound effects (timer tick, reveal fanfare, correct/wrong).
 * Gated by sound toggle in Settings.
 * No audio plays until you add files under assets/sounds/ and wire them here
 * (see assets/sounds/README.md).
 */

export async function playTimerTick(_soundEnabled: boolean): Promise<void> {
  // Add audio later: require('../assets/sounds/tick.mp3') + Audio.Sound.createAsync
}

export async function playTimerEnd(_soundEnabled: boolean): Promise<void> {
  // Add audio later
}

export async function playRevealFanfare(_soundEnabled: boolean): Promise<void> {
  // Add audio later
}

export async function playCorrect(_soundEnabled: boolean): Promise<void> {
  // Add audio later
}

export async function playWrong(_soundEnabled: boolean): Promise<void> {
  // Add audio later
}
