// Web Audio API Synthesizer for Cute Photobooth SFX
class SoundStudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  vibrate(pattern = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  // Camera Shutter Snap
  playShutter() {
    if (this.isMuted) return;
    this.init();
    this.vibrate([15, 30, 20]);
    const now = this.ctx.currentTime;

    // Click mechanical
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    // Shutter air release
    setTimeout(() => {
      if (!this.ctx) return;
      const now2 = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(350, now2);
      osc2.frequency.exponentialRampToValueAtTime(60, now2 + 0.08);
      gain2.gain.setValueAtTime(0.2, now2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now2);
      osc2.stop(now2 + 0.08);
    }, 60);
  }

  // Cute Pop sound for stickers & taps
  playPop(freq = 650) {
    if (this.isMuted) return;
    this.init();
    this.vibrate(10);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Soft tap sound for buttons
  playTap(freq = 540) {
    if (this.isMuted) return;
    this.init();
    this.vibrate(8);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.05);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Cute bell chime
  playChime(note = 523.25) {
    if (this.isMuted) return;
    this.init();
    this.vibrate(12);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Success celebratory chord
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    this.vibrate([15, 30, 25]);
    const melody = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    melody.forEach((f, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }, i * 70);
    });
  }

  // Cute Lo-Fi Music Box loop
  toggleBgm() {
    this.init();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.isBgmPlaying = true;
    const melody = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 392.00,
      440.00, 523.25, 587.33, 523.25,
      659.25, 783.99, 880.00, 783.99
    ];
    let step = 0;

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      if (!this.isMuted) {
        const note = melody[step % melody.length];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
      step++;
      this.bgmTimer = setTimeout(tick, 450);
    };

    tick();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) clearTimeout(this.bgmTimer);
  }
}

export const sound = new SoundStudio();
