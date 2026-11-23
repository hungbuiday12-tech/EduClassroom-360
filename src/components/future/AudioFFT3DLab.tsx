import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Activity,
  Mic,
  MicOff,
  Radio,
  RotateCcw,
  Volume2,
  VolumeX,
  Waves
} from 'lucide-react';

interface AudioFFT3DLabProps {
  language?: 'vi' | 'en';
}

type AudioSourceMode = 'synth' | 'mic';
type SynthWaveType = 'sine' | 'square' | 'interference' | 'doppler';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function freqToNote(freq: number): string {
  if (!Number.isFinite(freq) || freq < 20) return '--';
  const midi = Math.round(12 * Math.log2(freq / 440) + 69);
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || ''
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|Software Rasterizer|WARP/i.test(rendererStr);
  } catch {
    return false;
  }
}

export const AudioFFT3DLab: React.FC<AudioFFT3DLabProps> = ({ language = 'vi' }) => {
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [sourceMode, setSourceMode] = useState<AudioSourceMode>('synth');
  const [synthType, setSynthType] = useState<SynthWaveType>('interference');
  const [baseFreq, setBaseFreq] = useState<number>(220);
  const [dopplerSpeed, setDopplerSpeed] = useState<number>(0.28); // v / c ratio
  const [gainScale, setGainScale] = useState<number>(1.2);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState({
    peakHz: 220,
    note: 'A3',
    db: -18,
    dopplerHz: 220
  });

  // Live refs read inside Three.js RAF loop without re-creating scene
  const paramsRef = useRef({
    sourceMode,
    synthType,
    baseFreq,
    dopplerSpeed,
    gainScale,
    showWireframe
  });
  paramsRef.current = {
    sourceMode,
    synthType,
    baseFreq,
    dopplerSpeed,
    gainScale,
    showWireframe
  };

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscGainRef = useRef<GainNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const freqBytesRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(512));
  const timeBytesRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(512));

  const cameraResetFnRef = useRef<(() => void) | null>(null);
  const waveMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const ensureAudioContext = async (): Promise<AudioContext | null> => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.82;
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        freqBytesRef.current = new Uint8Array(analyser.frequencyBinCount);
        timeBytesRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  const stopMic = () => {
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch {}
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setMicActive(false);
  };

  const stopSynthAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (oscGainRef.current) {
      try {
        oscGainRef.current.disconnect();
      } catch {}
      oscGainRef.current = null;
    }
    setSoundEnabled(false);
  };

  const toggleMicrophone = async () => {
    setMicError(null);
    if (sourceMode === 'mic' && micActive) {
      stopMic();
      setSourceMode('synth');
      return;
    }
    try {
      stopSynthAudio();
      const ctx = await ensureAudioContext();
      if (!ctx || !analyserRef.current) {
        setMicError(isEn ? 'Web Audio API is unavailable.' : 'Trình duyệt không hỗ trợ Web Audio API.');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicError(isEn ? 'Microphone API unavailable.' : 'Thiết bị không hỗ trợ truy cập Micro.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true }
      });
      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyserRef.current);
      micStreamRef.current = stream;
      micSourceRef.current = src;
      setMicActive(true);
      setSourceMode('mic');
    } catch {
      setMicError(
        isEn
          ? 'Microphone access denied. Using real-time wave synthesizer instead.'
          : 'Chưa được cấp quyền Micro. Đang sử dụng bộ phát sóng chuẩn.'
      );
      setSourceMode('synth');
      setMicActive(false);
    }
  };

  const toggleSoundPlayback = async () => {
    if (soundEnabled) {
      stopSynthAudio();
      return;
    }
    stopMic();
    setSourceMode('synth');
    const ctx = await ensureAudioContext();
    if (!ctx || !analyserRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = synthType === 'square' ? 'square' : 'sine';
    osc.frequency.value = baseFreq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(analyserRef.current);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    oscGainRef.current = gain;
    setSoundEnabled(true);
  };

  // Sync oscillator pitch & waveform when sliders change
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      const targetHz =
        synthType === 'doppler'
          ? baseFreq / Math.max(0.25, 1 - dopplerSpeed * 0.65)
          : baseFreq;
      oscRef.current.frequency.setTargetAtTime(targetHz, audioCtxRef.current.currentTime, 0.04);
      oscRef.current.type = synthType === 'square' ? 'square' : 'sine';
    }
  }, [baseFreq, dopplerSpeed, synthType]);

  // Sync wireframe live without recreating material
  useEffect(() => {
    if (waveMatRef.current) {
      waveMatRef.current.wireframe = showWireframe;
    }
  }, [showWireframe]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopMic();
      stopSynthAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Three.js WebGL 3D Wave & 32-Band FFT Spectrum Towers
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 720;
    const height = container.clientHeight || 420;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: isSoftwareGl ? 'low-power' : 'high-performance'
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x040914, 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040914, 0.022);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 120);
    const defaultCamPos = new THREE.Vector3(0, 10.5, 16.5);
    camera.position.copy(defaultCamPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.minDistance = 7;
    controls.maxDistance = 32;
    controls.target.set(0, 0.5, -0.5);
    controls.update();

    cameraResetFnRef.current = () => {
      camera.position.copy(defaultCamPos);
      controls.target.set(0, 0.5, -0.5);
      controls.update();
    };

    const hemi = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 0.85);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.5);
    keyLight.position.set(10, 16, 10);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x38bdf8, 2.2, 40);
    rimLight.position.set(-9, 6, -6);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(28, 28, 0x1e3a5f, 0x0f1f3a);
    grid.position.y = -1.6;
    scene.add(grid);

    // Displaced 3D Wave Surface
    const segX = isSoftwareGl ? 36 : 60;
    const segZ = isSoftwareGl ? 24 : 40;
    const waveGeo = new THREE.PlaneGeometry(18, 12, segX, segZ);
    waveGeo.rotateX(-Math.PI / 2);

    const posAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const vertCount = posAttr.count;
    const baseX = new Float32Array(vertCount);
    const baseZ = new Float32Array(vertCount);
    const colorsArr = new Float32Array(vertCount * 3);
    for (let i = 0; i < vertCount; i++) {
      baseX[i] = posAttr.getX(i);
      baseZ[i] = posAttr.getZ(i);
    }
    waveGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
    const colorAttr = waveGeo.attributes.color as THREE.BufferAttribute;

    const waveMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.28,
      metalness: 0.42,
      side: THREE.DoubleSide,
      wireframe: paramsRef.current.showWireframe
    });
    waveMatRef.current = waveMat;
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    scene.add(waveMesh);

    // 32-Band InstancedMesh FFT Spectrum Columns
    const BAND_COUNT = 32;
    const barGeo = new THREE.BoxGeometry(0.42, 1, 0.42);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.65,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.28
    });
    const barsMesh = new THREE.InstancedMesh(barGeo, barMat, BAND_COUNT);
    barsMesh.frustumCulled = false;
    scene.add(barsMesh);

    // Pre-allocated scratch helpers (zero per-frame allocations)
    const _m4 = new THREE.Matrix4();
    const _pos = new THREE.Vector3();
    const _quat = new THREE.Quaternion();
    const _scale = new THREE.Vector3();
    const _col = new THREE.Color();
    const _colA = new THREE.Color(0x0284c7);
    const _colB = new THREE.Color(0x2dd4bf);
    const _colC = new THREE.Color(0xfbbf24);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    let frameIndex = 0;
    let lastTelemetryTick = 0;
    const bandValues = new Float32Array(BAND_COUNT);

    function afterDraw(callback: () => void) {
      const gl = renderer.getContext();
      if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl.flush();
          const poll = () => {
            if (disposed) {
              gl.deleteSync(sync);
              return;
            }
            const status = gl.clientWaitSync(sync, 0, 0);
            if (status === gl.WAIT_FAILED || status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED) {
              gl.deleteSync(sync);
              timerId = window.setTimeout(callback, 80);
            } else {
              rafId = requestAnimationFrame(poll);
            }
          };
          rafId = requestAnimationFrame(poll);
          return;
        }
      }
      timerId = window.setTimeout(callback, 80);
    }

    const animate = (now: number) => {
      if (disposed) return;
      frameIndex++;
      const t = now * 0.001;
      const p = paramsRef.current;

      const usingLiveAnalyser =
        (p.sourceMode === 'mic' && Boolean(micStreamRef.current) && Boolean(analyserRef.current)) ||
        (soundEnabled && Boolean(analyserRef.current));

      let peakHz = p.baseFreq;
      let rms = 0.25;

      if (usingLiveAnalyser && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(freqBytesRef.current);
        analyserRef.current.getByteTimeDomainData(timeBytesRef.current);

        const sampleRate = audioCtxRef.current?.sampleRate || 44100;
        const binHz = sampleRate / analyserRef.current.fftSize;
        let maxVal = 0;
        let maxBin = 4;
        const len = freqBytesRef.current.length;
        for (let b = 2; b < Math.min(len, 180); b++) {
          const val = freqBytesRef.current[b];
          if (val > maxVal) {
            maxVal = val;
            maxBin = b;
          }
        }
        if (maxVal > 14) {
          peakHz = Math.round(maxBin * binHz);
        }

        let sumSq = 0;
        for (let b = 0; b < BAND_COUNT; b++) {
          const idx = Math.floor(2 + b * 2.2);
          const norm = (freqBytesRef.current[idx] || 0) / 255;
          bandValues[b] = norm * p.gainScale;
          sumSq += norm * norm;
        }
        rms = Math.sqrt(sumSq / BAND_COUNT);
      } else {
        // Synthesize crisp physical spectrum & harmonics
        const kFundamental = Math.max(1, Math.min(24, (p.baseFreq / 1100) * 20));
        const dopplerShift = p.synthType === 'doppler' ? p.dopplerSpeed * 5.2 : 0;
        const centerBand = Math.max(1, Math.min(BAND_COUNT - 2, kFundamental + dopplerShift));

        for (let b = 0; b < BAND_COUNT; b++) {
          const d1 = b - centerBand;
          let energy = Math.exp(-(d1 * d1) / 3.5);
          if (p.synthType === 'square') {
            const h3 = b - centerBand * 2.1;
            const h5 = b - centerBand * 3.1;
            energy += 0.45 * Math.exp(-(h3 * h3) / 3.0) + 0.25 * Math.exp(-(h5 * h5) / 2.5);
          } else if (p.synthType === 'interference') {
            const beat = 0.65 + 0.35 * Math.sin(t * 3.4 + b * 0.45);
            const h2 = b - (centerBand + 4.5);
            energy = (energy + 0.72 * Math.exp(-(h2 * h2) / 4.0)) * beat;
          }
          energy += 0.08 * (0.5 + 0.5 * Math.sin(t * 4.2 + b * 0.9));
          bandValues[b] = Math.min(1.4, energy * p.gainScale * 0.88);
        }
        peakHz =
          p.synthType === 'doppler'
            ? Math.round(p.baseFreq / Math.max(0.25, 1 - p.dopplerSpeed * 0.65))
            : Math.round(p.baseFreq);
        rms = 0.32 * p.gainScale;
      }

      // Displace 3D wave surface vertices
      const freqFactor = 0.45 + (p.baseFreq / 600) * 1.15;
      const amp = 0.95 * p.gainScale * (usingLiveAnalyser ? Math.max(0.35, rms * 2.2) : 1.0);

      for (let i = 0; i < vertCount; i++) {
        const x = baseX[i];
        const z = baseZ[i];
        let y = 0;

        if (usingLiveAnalyser) {
          const normIdx = Math.floor(((x + 9) / 18) * (timeBytesRef.current.length - 1));
          const sample = ((timeBytesRef.current[normIdx] || 128) - 128) / 128;
          const bIdx = Math.min(BAND_COUNT - 1, Math.max(0, Math.floor(((z + 6) / 12) * BAND_COUNT)));
          const bandMod = 0.45 + bandValues[bIdx] * 1.25;
          y = sample * 2.3 * amp * bandMod + Math.sin(x * 0.9 - t * 3.2) * 0.28 * bandMod;
        } else if (p.synthType === 'interference') {
          const r1 = Math.hypot(x + 3.4, z);
          const r2 = Math.hypot(x - 3.4, z);
          const w1 = Math.sin(r1 * 2.3 * freqFactor - t * 5.0) / (1 + r1 * 0.22);
          const w2 = Math.sin(r2 * 2.3 * freqFactor - t * 5.0) / (1 + r2 * 0.22);
          y = (w1 + w2) * 1.15 * amp;
        } else if (p.synthType === 'doppler') {
          const srcX = Math.sin(t * (0.9 + p.dopplerSpeed * 2.6)) * 5.2;
          const vRatio = Math.sign(Math.cos(t * (0.9 + p.dopplerSpeed * 2.6))) * p.dopplerSpeed * 0.72;
          const dist = Math.hypot(x - srcX, z);
          const dirX = dist > 0.001 ? (x - srcX) / dist : 0;
          const kLocal = 2.1 * freqFactor / Math.max(0.35, 1 - vRatio * dirX);
          y = (Math.sin(dist * kLocal - t * 5.2) / (1 + dist * 0.25)) * 1.35 * amp;
        } else if (p.synthType === 'square') {
          const phase = x * 0.95 * freqFactor - t * 4.0;
          const s =
            Math.sin(phase) +
            Math.sin(phase * 3) / 3 +
            Math.sin(phase * 5) / 5 +
            Math.sin(phase * 7) / 7;
          y = s * 0.95 * amp * Math.cos(z * 0.22);
        } else {
          y = Math.sin(x * 1.15 * freqFactor - t * 4.5) * Math.cos(z * 0.35) * 1.25 * amp;
        }

        posAttr.setY(i, y);

        const hNorm = Math.max(0, Math.min(1, (y + 1.4) / 2.8));
        if (hNorm < 0.55) {
          _col.copy(_colA).lerp(_colB, hNorm / 0.55);
        } else {
          _col.copy(_colB).lerp(_colC, (hNorm - 0.55) / 0.45);
        }
        colorAttr.setXYZ(i, _col.r, _col.g, _col.b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      if (!isSoftwareGl || frameIndex % 2 === 0) {
        waveGeo.computeVertexNormals();
      }

      // Update 32 FFT Instanced Bars
      for (let b = 0; b < BAND_COUNT; b++) {
        const h = Math.max(0.16, Math.min(6.2, bandValues[b] * 4.1));
        const x = (b - (BAND_COUNT - 1) / 2) * 0.56;
        _pos.set(x, -1.6 + h * 0.5, -7.2);
        _scale.set(1, h, 1);
        _m4.compose(_pos, _quat, _scale);
        barsMesh.setMatrixAt(b, _m4);

        const hue = 0.55 - Math.min(0.45, (h / 6.2) * 0.45);
        _col.setHSL(hue, 0.88, 0.56);
        barsMesh.setColorAt(b, _col);
      }
      barsMesh.instanceMatrix.needsUpdate = true;
      if (barsMesh.instanceColor) barsMesh.instanceColor.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

      if (now - lastTelemetryTick > 180) {
        lastTelemetryTick = now;
        const dbVal = Math.round(20 * Math.log10(Math.max(0.02, rms)));
        setTelemetry({
          peakHz,
          note: freqToNote(peakHz),
          db: Math.max(-48, Math.min(0, dbVal)),
          dopplerHz:
            p.synthType === 'doppler'
              ? Math.round(p.baseFreq / Math.max(0.25, 1 - p.dopplerSpeed * 0.65))
              : peakHz
        });
      }

      if (isSoftwareGl) {
        afterDraw(() => {
          rafId = requestAnimationFrame(animate);
        });
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      barGeo.dispose();
      barMat.dispose();
      envRT.dispose();
      renderer.dispose();
    };
  }, [soundEnabled]);

  return (
    <div className="space-y-4">
      {/* Top Control & Telemetry Header */}
      <div className="rounded-md border border-slate-700/80 bg-slate-900 text-slate-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <Waves className="w-4 h-4" />
              {isEn ? 'Audio-Reactive FFT & 3D Wave Lab' : 'Phòng Thí Nghiệm Sóng Âm FFT & Giao Thoa 3D'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isEn
                ? 'Analyze real microphone harmonics or drive 3D interference & Doppler waves with live Web Audio FFT.'
                : 'Thu âm trực tiếp từ Micro hoặc phát sóng chuẩn (Sóng sin, Sóng vuông, Giao thoa 2 nguồn, Hiệu ứng Doppler) hiển thị bề mặt sóng 3D + 32 cột phổ FFT.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition cursor-pointer ${
                sourceMode === 'mic' && micActive
                  ? 'bg-rose-600 border-rose-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {sourceMode === 'mic' && micActive ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  {isEn ? 'Stop Mic' : 'Tắt Micro Thật'}
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-cyan-300" />
                  {isEn ? 'Use Live Mic' : 'Dùng Micro Thật'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleSoundPlayback}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  {isEn ? 'Audio On' : 'Đang phát loa'}
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  {isEn ? 'Play Synth Audio' : 'Nghe âm thanh thật'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowWireframe((v) => !v)}
              className={`px-3 py-2 rounded text-xs font-semibold border transition cursor-pointer ${
                showWireframe
                  ? 'bg-sky-600 border-sky-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isEn ? 'Wireframe' : 'Lưới Đa Giác'}
            </button>

            <button
              type="button"
              onClick={() => cameraResetFnRef.current?.()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isEn ? 'Reset View' : 'Đặt lại góc nhìn'}
            </button>
          </div>
        </div>

        {micError && (
          <div className="mt-3 px-3 py-2 rounded bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs">
            {micError}
          </div>
        )}
      </div>

      {/* 3D Viewport Container - Isolated from backdrop-filter */}
      <div className="relative rounded-md border border-slate-700 bg-[#040914] overflow-hidden">
        <div ref={mountRef} className="w-full h-[420px] sm:h-[460px]" />

        {/* Live Telemetry Corner Strips (solid slate, no backdrop-blur over WebGL) */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              {isEn ? 'Peak Frequency' : 'Tần số đỉnh FFT'}
            </div>
            <div className="text-base font-bold text-cyan-300 mt-0.5 tabular-nums">
              {telemetry.peakHz} Hz
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">
              {isEn ? 'Musical Pitch' : 'Cao độ nốt nhạc'}
            </div>
            <div className="text-base font-bold text-emerald-300 mt-0.5 tabular-nums">
              {telemetry.note}
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">
              {isEn ? 'Signal Level' : 'Mức cường độ (dBFS)'}
            </div>
            <div className="text-base font-bold text-amber-300 mt-0.5 tabular-nums">
              {telemetry.db} dB
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-violet-400" />
              {synthType === 'doppler'
                ? isEn ? 'Doppler Shifted f′' : 'Tần số Doppler f′'
                : isEn ? 'Active Mode' : 'Chế độ sóng'}
            </div>
            <div className="text-base font-bold text-violet-300 mt-0.5 tabular-nums">
              {synthType === 'doppler'
                ? `${telemetry.dopplerHz} Hz`
                : sourceMode === 'mic'
                ? 'Live Mic'
                : synthType.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar below WebGL canvas */}
      <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            {isEn ? 'Wave Mode:' : 'Dạng sóng thí nghiệm:'}
          </span>
          {(
            [
              { id: 'interference', labelVi: 'Giao thoa 2 nguồn', labelEn: '2-Source Interference' },
              { id: 'doppler', labelVi: 'Hiệu ứng Doppler', labelEn: 'Doppler Shift' },
              { id: 'sine', labelVi: 'Sóng điều hòa Sin', labelEn: 'Pure Sine' },
              { id: 'square', labelVi: 'Tổng Fourier Sóng Vuông', labelEn: 'Square Harmonics' }
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                setSourceMode('synth');
                setSynthType(mode.id);
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer ${
                sourceMode === 'synth' && synthType === mode.id
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-cyan-500'
              }`}
            >
              {isEn ? mode.labelEn : mode.labelVi}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex justify-between mb-1">
              <span>{isEn ? 'Base Frequency (f₀)' : 'Tần số cơ bản (f₀)'}</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                {baseFreq} Hz
              </span>
            </div>
            <input
              type="range"
              min={80}
              max={1000}
              step={10}
              value={baseFreq}
              onChange={(e) => setBaseFreq(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </label>

          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex justify-between mb-1">
              <span>{isEn ? 'Doppler Speed Ratio (v/c)' : 'Tỉ số vận tốc nguồn (v/v_s)'}</span>
              <span className="font-bold text-violet-600 dark:text-violet-400 tabular-nums">
                {dopplerSpeed.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.75}
              step={0.02}
              value={dopplerSpeed}
              onChange={(e) => setDopplerSpeed(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </label>

          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex justify-between mb-1">
              <span>{isEn ? 'Amplitude / Gain' : 'Biên độ khuếch đại sóng'}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {gainScale.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={2.2}
              step={0.05}
              value={gainScale}
              onChange={(e) => setGainScale(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
