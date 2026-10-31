/**
 * Web Audio API synthesized temple bell chime.
 * Generates an ethereal, calm singing bell tone for round completion.
 * Fully offline, 0 network dependencies, 0 latency.
 */

class BellChime {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a gentle, peaceful temple bell harmonic sound for +1 round.
   */
  public playRoundBell(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 528; // Sacred Solfeggio frequency (528 Hz)

    // Harmonics for a singing bell / ghanti resonance
    const harmonics = [1, 1.5, 2.02, 2.76];
    const gains = [0.25, 0.12, 0.08, 0.04];

    harmonics.forEach((multiplier, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(fundamental * multiplier, now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    });
  }

  /**
   * Plays a rich celebratory 3-tone chime for target completion.
   */
  public playCompletionChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A Major resonant chord
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      }, idx * 180);
    });
  }
}

export const soundManager = new BellChime();

