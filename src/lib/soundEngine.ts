// Procedural Web Audio API Sound Engine (Click SFX, Background Ambient Soundscapes, Focus Bells)
// Zero external asset dependencies - crisp real-time synthesis with clean node lifecycle.

export type ClickSoundId =
  | 'water_drop'
  | 'crystal_ping'
  | 'mech_switch'
  | 'soft_pop'
  | 'holo_pulse'
  | 'wood_tap'
  | 'retro_blip'
  | 'off';

export type BgSoundId =
  | 'off'
  | 'cosmic_drone'
  | 'soft_rain'
  | 'lofi_chords'
  | 'forest_breeze'
  | 'study_cafe'
  | 'alpha_waves';

export type BellSoundId =
  | 'tibetan_bowl'
  | 'academic_bell'
  | 'crystal_arpeggio'
  | 'digital_pulse'
  | 'warm_gong'
  | 'off';

export interface SoundOption<T extends string> {
  id: T;
  labelVi: string;
  labelEn: string;
  descVi?: string;
  descEn?: string;
}

export const CLICK_SOUND_OPTIONS: SoundOption<ClickSoundId>[] = [
  { id: 'water_drop', labelVi: 'Giọt nước pha lê', labelEn: 'Crystal Water Drop' },
  { id: 'crystal_ping', labelVi: 'Chuông thủy tinh', labelEn: 'Glass Ping' },
  { id: 'mech_switch', labelVi: 'Phím cơ Tactile', labelEn: 'Mechanical Key' },
  { id: 'soft_pop', labelVi: 'Bong bóng êm', labelEn: 'Soft Bubble Pop' },
  { id: 'holo_pulse', labelVi: 'Xung Hologram', labelEn: 'Holo Pulse' },
  { id: 'wood_tap', labelVi: 'Gõ gỗ mộc', labelEn: 'Warm Wood Tap' },
  { id: 'retro_blip', labelVi: 'Synth 8-bit nhẹ', labelEn: 'Soft Synth Blip' },
  { id: 'off', labelVi: 'Tắt âm click', labelEn: 'Muted' }
];

export const BG_SOUND_OPTIONS: SoundOption<BgSoundId>[] = [
  {
    id: 'off',
    labelVi: 'Không phát nhạc nền',
    labelEn: 'Silence (Off)',
    descVi: 'Yên tĩnh tuyệt đối',
    descEn: 'Complete silence'
  },
  {
    id: 'cosmic_drone',
    labelVi: 'Không gian Galaxy Êm',
    labelEn: 'Cosmic Nebula Pad',
    descVi: 'Hợp âm synth ấm sâu lắng cho Toán & Tư duy',
    descEn: 'Warm deep space drone for deep concentration'
  },
  {
    id: 'soft_rain',
    labelVi: 'Mưa rơi phòng học',
    labelEn: 'Classroom Rain',
    descVi: 'Tiếng mưa hồng nhiễu lọc êm dịu giảm xao nhãng',
    descEn: 'Filtered pink-noise rainfall ambience'
  },
  {
    id: 'lofi_chords',
    labelVi: 'Hợp âm Lo-fi Thư giãn',
    labelEn: 'Lo-fi Study Chords',
    descVi: 'Chuỗi hợp âm Rhodes 7th tự động chuyển nhẹ nhàng',
    descEn: 'Gentle warm Rhodes 7th chord progression'
  },
  {
    id: 'forest_breeze',
    labelVi: 'Gió rừng & Suối nhẹ',
    labelEn: 'Forest Breeze & Brook',
    descVi: 'Âm gió thoáng qua tán lá tự nhiên',
    descEn: 'Soft natural wind swell across canopy'
  },
  {
    id: 'study_cafe',
    labelVi: 'Thư viện tĩnh lặng',
    labelEn: 'Quiet Library Ambience',
    descVi: 'Tiếng nền nâu ấm giúp tập trung đọc đề thi',
    descEn: 'Warm brown-noise library acoustic floor'
  },
  {
    id: 'alpha_waves',
    labelVi: 'Sóng Alpha Tập Trung (10Hz)',
    labelEn: 'Alpha Focus Waves (10Hz)',
    descVi: 'Sóng hài hòa nhịp 10Hz kích thích trí nhớ',
    descEn: 'Harmonic 10Hz modulated focus drone'
  }
];

export const BELL_SOUND_OPTIONS: SoundOption<BellSoundId>[] = [
  { id: 'tibetan_bowl', labelVi: 'Chuông bát Tây Tạng', labelEn: 'Tibetan Singing Bowl' },
  { id: 'academic_bell', labelVi: 'Chuông trường ngân vang', labelEn: 'Academic Chime Bell' },
  { id: 'crystal_arpeggio', labelVi: 'Hợp âm Pha lê C-Major', labelEn: 'Crystal Arpeggio' },
  { id: 'digital_pulse', labelVi: 'Báo thức Đồng hồ số', labelEn: 'Digital Focus Beep' },
  { id: 'warm_gong', labelVi: 'Tiếng Chiêng trầm ấm', labelEn: 'Warm Meditation Gong' },
  { id: 'off', labelVi: 'Im lặng (Chỉ hiện thông báo)', labelEn: 'Silent (Visual only)' }
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private bgMasterGain: GainNode | null = null;
  private bgCleanupFns: Array<() => void> = [];
  private activeBgId: BgSoundId = 'off';
  private activeBgVolume = 0.35;
  private lastClickAt = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Pink-weighted noise for smooth rain / breeze
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public playClick(id: ClickSoundId, volume = 0.5): void {
    if (id === 'off' || volume <= 0.01) return;
    const nowMs = performance.now();
    if (nowMs - this.lastClickAt < 38) return;
    this.lastClickAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const vol = Math.min(1, Math.max(0.02, volume)) * 0.28;

    switch (id) {
      case 'water_drop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(1180, t + 0.065);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
        break;
      }
      case 'crystal_ping': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(1320, t);
        osc2.frequency.setValueAtTime(2640, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol * 0.8, t + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.17);
        osc2.stop(t + 0.17);
        break;
      }
      case 'mech_switch': {
        const buf = ctx.createBufferSource();
        buf.buffer = this.getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, t);
        filter.Q.value = 3.2;
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(vol * 1.4, t);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);
        buf.connect(filter).connect(nGain).connect(ctx.destination);
        buf.start(t, Math.random() * 1.5, 0.04);

        const osc = ctx.createOscillator();
        const oGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(95, t + 0.035);
        oGain.gain.setValueAtTime(vol * 0.9, t);
        oGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        osc.connect(oGain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.045);
        break;
      }
      case 'soft_pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(620, t + 0.045);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol * 0.95, t + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
        break;
      }
      case 'holo_pulse': {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(660, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.075);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, t);
        filter.frequency.exponentialRampToValueAtTime(550, t + 0.075);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol * 0.55, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
        break;
      }
      case 'wood_tap': {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(760, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);
        filter.type = 'bandpass';
        filter.frequency.value = 820;
        filter.Q.value = 4.0;
        gain.gain.setValueAtTime(vol * 1.15, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
        break;
      }
      case 'retro_blip': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(580, t);
        osc.frequency.setValueAtTime(880, t + 0.024);
        gain.gain.setValueAtTime(vol * 0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
        break;
      }
    }
  }

  public playAlarmBell(id: BellSoundId, volume = 0.7): void {
    if (id === 'off') return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const vol = Math.min(1, Math.max(0.05, volume)) * 0.36;

    switch (id) {
      case 'tibetan_bowl': {
        const partials = [
          { f: 432, amp: 1.0, dur: 2.6 },
          { f: 864, amp: 0.45, dur: 2.0 },
          { f: 1188, amp: 0.28, dur: 1.5 },
          { f: 1728, amp: 0.16, dur: 1.1 }
        ];
        partials.forEach((p) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(p.f, t);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime(vol * p.amp, t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + p.dur + 0.05);
        });
        break;
      }
      case 'academic_bell': {
        const notes = [659.25, 830.61, 987.77, 1318.51];
        notes.forEach((freq, idx) => {
          const start = t + idx * 0.22;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(vol * 0.9, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.95);
        });
        break;
      }
      case 'crystal_arpeggio': {
        const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        chord.forEach((freq, idx) => {
          const start = t + idx * 0.11;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(vol * 0.75, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 1.2);
        });
        break;
      }
      case 'digital_pulse': {
        for (let i = 0; i < 4; i++) {
          const start = t + i * 0.24;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(i === 3 ? 1174.66 : 880, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(vol * 0.85, start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.18);
        }
        break;
      }
      case 'warm_gong': {
        const base = [164.81, 246.94, 329.63, 415.3];
        base.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime(vol * (0.9 / (i + 1)), t + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 2.85);
        });
        break;
      }
    }
  }

  public startAmbient(id: BgSoundId, volume = 0.35): void {
    this.stopAmbient();
    this.activeBgId = id;
    this.activeBgVolume = volume;
    if (id === 'off') return;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const master = ctx.createGain();
    const targetGain = Math.min(0.65, Math.max(0.01, volume * 0.35));
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.8);
    master.connect(ctx.destination);
    this.bgMasterGain = master;

    if (id === 'cosmic_drone') {
      const freqs = [110, 164.81, 220, 277.18];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.value = 540;
        g.gain.value = 0.22 / (idx * 0.4 + 1);
        osc.connect(filter).connect(g).connect(master);
        osc.start();
        this.bgCleanupFns.push(() => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
      });
    } else if (id === 'soft_rain' || id === 'study_cafe' || id === 'forest_breeze') {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      if (id === 'soft_rain') {
        filter.type = 'bandpass';
        filter.frequency.value = 1150;
        filter.Q.value = 0.55;
      } else if (id === 'study_cafe') {
        filter.type = 'lowpass';
        filter.frequency.value = 340;
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 520;
        filter.Q.value = 1.1;
      }

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = id === 'forest_breeze' ? 0.14 : 0.08;
      lfoGain.gain.value = id === 'forest_breeze' ? 240 : 120;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start();

      const nGain = ctx.createGain();
      nGain.gain.value = id === 'study_cafe' ? 1.4 : 1.1;
      src.connect(filter).connect(nGain).connect(master);
      src.start();

      this.bgCleanupFns.push(() => {
        try { src.stop(); src.disconnect(); } catch {}
        try { lfo.stop(); lfo.disconnect(); } catch {}
      });
    } else if (id === 'lofi_chords') {
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23]  // G7
      ];
      let chordIdx = 0;

      const playChordStep = () => {
        if (!this.bgMasterGain || this.activeBgId !== 'lofi_chords') return;
        const notes = chords[chordIdx % chords.length];
        chordIdx++;
        const start = ctx.currentTime;
        notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(750, start);
          g.gain.setValueAtTime(0.0001, start);
          g.gain.linearRampToValueAtTime(0.11, start + 0.25);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 3.7);
          osc.connect(filter).connect(g).connect(master);
          osc.start(start);
          osc.stop(start + 3.8);
        });
      };

      playChordStep();
      const timer = window.setInterval(playChordStep, 3800);
      this.bgCleanupFns.push(() => window.clearInterval(timer));
    } else if (id === 'alpha_waves') {
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const g = ctx.createGain();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);
      oscR.frequency.setValueAtTime(210, ctx.currentTime); // 10Hz Alpha beat interference
      g.gain.value = 0.16;
      oscL.connect(g);
      oscR.connect(g);
      g.connect(master);
      oscL.start();
      oscR.start();
      this.bgCleanupFns.push(() => {
        try { oscL.stop(); oscL.disconnect(); } catch {}
        try { oscR.stop(); oscR.disconnect(); } catch {}
      });
    }
  }

  public setAmbientVolume(volume: number): void {
    this.activeBgVolume = volume;
    if (this.bgMasterGain && this.ctx) {
      const targetGain = Math.min(0.65, Math.max(0.001, volume * 0.35));
      this.bgMasterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public stopAmbient(): void {
    this.activeBgId = 'off';
    this.bgCleanupFns.forEach((fn) => fn());
    this.bgCleanupFns = [];
    if (this.bgMasterGain) {
      try {
        this.bgMasterGain.disconnect();
      } catch {}
      this.bgMasterGain = null;
    }
  }

  public getCurrentBgId(): BgSoundId {
    return this.activeBgId;
  }

  public getCurrentBgVolume(): number {
    return this.activeBgVolume;
  }
}

export const soundEngine = new SoundEngine();
