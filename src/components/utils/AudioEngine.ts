class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  public isEnabled = false;

  public init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
      this.buildReverb();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  // ── Simple convolver reverb (simulates a large hall) ──────────────────
  private buildReverb() {
    if (!this.ctx) return;
    const len = this.ctx.sampleRate * 3.5; // 3.5 s tail
    const buf = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      }
    }
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = buf;
    this.reverbNode.connect(this.masterGain!);
  }

  private getReverb() { return this.reverbNode; }

  public toggleSound() {
    this.isEnabled = !this.isEnabled;
    this.init();
    if (this.isEnabled) this.startAmbient();
    else                 this.stopAmbient();
    return this.isEnabled;
  }

  // ── 1. Cinematic space pad (layered) ──────────────────────────────────
  private startAmbient() {
    if (!this.ctx || !this.masterGain || this.ambientGain) return;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0;

    // Dry → master, Wet → reverb → master
    this.ambientGain.connect(this.masterGain);
    if (this.reverbNode) this.ambientGain.connect(this.reverbNode);

    // Layer 1: rumbling sub (28 Hz)
    this.addPadLayer(28,  "sine",     0.55, 0.025);
    // Layer 2: bass fundamental (55 Hz)
    this.addPadLayer(55,  "sine",     0.45, 0.04);
    // Layer 3: musical 5th (82 Hz, a P5 above) 
    this.addPadLayer(82,  "triangle", 0.25, 0.06);
    // Layer 4: octave (110 Hz)
    this.addPadLayer(110, "sine",     0.18, 0.09);
    // Layer 5: 3rd harmonic shimmer (165 Hz)
    this.addPadLayer(165, "sine",     0.07, 0.14);
    // Layer 6: very high sparkle (440 Hz, very low vol)
    this.addPadLayer(440, "sine",     0.025, 0.19);

    // Fade in over 4 seconds
    this.ambientGain.gain.setTargetAtTime(0.85, this.ctx.currentTime, 4);
  }

  private addPadLayer(freq: number, type: OscillatorType, vol: number, lfoHz: number) {
    if (!this.ctx || !this.ambientGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value     = (Math.random() - 0.5) * 12; // slight detune warmth

    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = lfoHz;

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = vol * 0.5;

    const oscGain = this.ctx.createGain();
    oscGain.gain.value = vol;

    lfo.connect(lfoGain.gain as any);
    osc.connect(oscGain);
    oscGain.connect(lfoGain);
    lfoGain.connect(this.ambientGain);

    osc.start(); lfo.start();
    this.ambientNodes.push(osc, lfo, oscGain, lfoGain);
  }

  private stopAmbient() {
    if (!this.ambientGain || !this.ctx) return;
    this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 2);
    setTimeout(() => {
      this.ambientNodes.forEach(n => {
        try { (n as OscillatorNode).stop?.(); } catch (_) {}
        try { n.disconnect(); } catch (_) {}
      });
      this.ambientNodes = [];
      this.ambientGain?.disconnect();
      this.ambientGain = null;
    }, 4000);
  }

  // ── 2. Cinematic BOOM + Woosh (section transition) ────────────────────
  public playWoosh() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const dur = 2.0;

    // ─ Filtered pink noise whoosh ─
    const bufLen = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufLen; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
      b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6 = w*0.115926;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(60, now);
    bp.frequency.exponentialRampToValueAtTime(3500, now + 0.55);
    bp.frequency.exponentialRampToValueAtTime(80,   now + dur);
    bp.Q.value = 1.0;

    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0, now);
    ng.gain.linearRampToValueAtTime(1.0, now + 0.4);
    ng.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(bp); bp.connect(ng); ng.connect(this.masterGain);
    if (this.reverbNode) ng.connect(this.reverbNode);
    noise.start(); noise.stop(now + dur);

    // ─ Low BOOM punch ─
    const boom = this.ctx.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(90, now);
    boom.frequency.exponentialRampToValueAtTime(28, now + 0.6);

    const bg = this.ctx.createGain();
    bg.gain.setValueAtTime(1.2, now);
    bg.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    boom.connect(bg); bg.connect(this.masterGain);
    boom.start(); boom.stop(now + 0.8);
  }

  // ── 3. Hyper-drive thruster burst ────────────────────────────────────
  public playThruster() {
    if (!this.isEnabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const dur = 3.0;

    // ─ Multi-layer engine roar ─
    const freqs = [38, 76, 152, 300];
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = i < 2 ? "sawtooth" : "square";
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.3, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + dur);

      const lp = this.ctx!.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 600;

      const vols = [0.8, 0.5, 0.25, 0.1];
      const g = this.ctx!.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vols[i], now + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(lp); lp.connect(g); g.connect(this.masterGain!);
      if (i === 0 && this.reverbNode) g.connect(this.reverbNode);
      osc.start(); osc.stop(now + dur);
    });

    // ─ High-frequency plasma whine ─
    const whine = this.ctx.createOscillator();
    whine.type = "sine";
    whine.frequency.setValueAtTime(2200, now);
    whine.frequency.exponentialRampToValueAtTime(800, now + dur);

    const wg = this.ctx.createGain();
    wg.gain.setValueAtTime(0, now);
    wg.gain.linearRampToValueAtTime(0.15, now + 0.3);
    wg.gain.exponentialRampToValueAtTime(0.001, now + dur);

    whine.connect(wg); wg.connect(this.masterGain);
    whine.start(); whine.stop(now + dur);
  }
}

export const AudioEngine = new ProceduralAudioEngine();
