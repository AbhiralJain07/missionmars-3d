class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  public isEnabled = false;

  public init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleSound() {
    this.isEnabled = !this.isEnabled;
    this.init();

    if (this.isEnabled) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return this.isEnabled;
  }

  // 1. Deep Space Ambient Drone
  private startAmbientDrone() {
    if (!this.ctx) return;
    if (this.ambientGain) return; // Already running

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0; // Fade in
    this.ambientGain.connect(this.ctx.destination);

    // Create 3 detuned low-frequency sine waves
    const freqs = [45, 55, 65]; 
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      
      // Slow LFO to modulate volume of each oscillator for "breathing" effect
      const lfo = this.ctx!.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.05 + Math.random() * 0.05; // Very slow
      
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 0.3; // Depth of modulation
      
      lfo.connect(lfoGain.gain);
      osc.connect(lfoGain);
      lfoGain.connect(this.ambientGain!);

      osc.start();
      lfo.start();
      this.ambientOscillators.push(osc, lfo);
    });

    // Fade in over 2 seconds
    this.ambientGain.gain.setTargetAtTime(0.4, this.ctx.currentTime, 2);
  }

  private stopAmbientDrone() {
    if (!this.ambientGain || !this.ctx) return;
    
    // Fade out
    this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
    
    setTimeout(() => {
      this.ambientOscillators.forEach(osc => osc.stop());
      this.ambientOscillators = [];
      this.ambientGain?.disconnect();
      this.ambientGain = null;
    }, 2000);
  }

  // 2. Woosh Transition Sound
  public playWoosh() {
    if (!this.isEnabled || !this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate White Noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to make it sound like wind/woosh
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    // Sweep the filter frequency up then down
    filter.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + 0.5);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.5);
    filter.Q.value = 1.5;

    // Envelope (Volume)
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.5); // Fade in peak
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5); // Fade out

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start();
    noiseSource.stop(this.ctx.currentTime + 1.5);
  }

  // 3. Thruster Hum
  public playThruster() {
    if (!this.isEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 40;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.2); // Quick fade in
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.0);
  }
}

export const AudioEngine = new ProceduralAudioEngine();
