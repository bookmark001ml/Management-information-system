class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.08, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playClick() {
    this.tone(520, 0.06, 'triangle', 0.06);
  }

  playPop() {
    this.tone(660, 0.08, 'sine', 0.07);
  }

  playAlert() {
    this.tone(310, 0.14, 'sawtooth', 0.05);
    this.tone(240, 0.18, 'sawtooth', 0.05, 0.12);
  }

  playVictory() {
    this.tone(523.25, 0.12, 'triangle', 0.08, 0);
    this.tone(659.25, 0.12, 'triangle', 0.08, 0.1);
    this.tone(783.99, 0.14, 'triangle', 0.09, 0.2);
    this.tone(1046.5, 0.28, 'sine', 0.09, 0.3);
  }
}

export const soundFx = new SoundEngine();
