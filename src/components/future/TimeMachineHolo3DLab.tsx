import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Clock,
  Eye,
  EyeOff,
  Maximize2,
  MessageSquare,
  Minimize2,
  Play,
  RotateCcw,
  Send,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { safeFetchJson } from '../../lib/apiClient';

interface TimeMachineHolo3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type EraId = 'enigma_1940' | 'slit_1801' | 'galileo_1609';
type DropObjectId = 'feather' | 'wood' | 'cork';

const ROTOR_1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
const ROTOR_2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
const ROTOR_3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
const REFLECTOR_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const DROP_OBJECTS: Record<
  DropObjectId,
  { en: string; vi: string; dragFactor: number; hex: number; badgeColor: string }
> = {
  feather: { en: 'Feather', vi: 'Lông vũ', dragFactor: 0.48, hex: 0xfde68a, badgeColor: 'text-amber-300' },
  wood: { en: 'Oak Sphere', vi: 'Quả cầu Gỗ', dragFactor: 0.82, hex: 0xb45309, badgeColor: 'text-orange-300' },
  cork: { en: 'Cork Sphere', vi: 'Quả cầu Bần', dragFactor: 0.65, hex: 0xd97706, badgeColor: 'text-yellow-300' }
};

function encodeEnigmaChar(
  ch: string,
  pos: [number, number, number]
): { out: string; nextPos: [number, number, number] } {
  const idx = ALPHA.indexOf(ch.toUpperCase());
  if (idx < 0) return { out: ch, nextPos: pos };
  const p2 = (pos[2] + 1) % 26;
  const p1 = p2 === 22 ? (pos[1] + 1) % 26 : pos[1];
  const p0 = p2 === 22 && p1 === 5 ? (pos[0] + 1) % 26 : pos[0];
  const stepFwd = (cIdx: number, rotor: string, offset: number) =>
    (ALPHA.indexOf(rotor[(cIdx + offset) % 26]) - offset + 26) % 26;
  const stepBwd = (cIdx: number, rotor: string, offset: number) => {
    const target = ALPHA[(cIdx + offset) % 26];
    return (rotor.indexOf(target) - offset + 26) % 26;
  };
  let sig = idx;
  sig = stepFwd(sig, ROTOR_3, p2);
  sig = stepFwd(sig, ROTOR_2, p1);
  sig = stepFwd(sig, ROTOR_1, p0);
  sig = ALPHA.indexOf(REFLECTOR_B[sig]);
  sig = stepBwd(sig, ROTOR_1, p0);
  sig = stepBwd(sig, ROTOR_2, p1);
  sig = stepBwd(sig, ROTOR_3, p2);
  return { out: ALPHA[sig], nextPos: [p0, p1, p2] };
}

function encodeStringFromPos(text: string, startPos: [number, number, number]): { out: string; endPos: [number, number, number] } {
  let p: [number, number, number] = [...startPos];
  let out = '';
  for (const ch of text) {
    const res = encodeEnigmaChar(ch, p);
    out += res.out;
    p = res.nextPos;
  }
  return { out, endPos: p };
}

function isSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export const TimeMachineHolo3DLab: React.FC<TimeMachineHolo3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [era, setEra] = useState<EraId>('enigma_1940');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Enigma state
  const [rotorBase, setRotorBase] = useState<[number, number, number]>([0, 0, 0]);
  const [rotorPos, setRotorPos] = useState<[number, number, number]>([0, 0, 7]);
  const [plainInput, setPlainInput] = useState<string>('SYNAPSE');
  const [cipherOutput, setCipherOutput] = useState<string>('QJXKWZM');
  const [litCipherLetter, setLitCipherLetter] = useState<string>('M');

  // Double-slit state
  const [slitSep, setSlitSep] = useState<number>(1.3);
  const [waveLen, setWaveLen] = useState<number>(0.55);

  // Galileo drop state
  const [vacuumMode, setVacuumMode] = useState<boolean>(true);
  const [dropObj, setDropObj] = useState<DropObjectId>('feather');
  const [dropHeightM, setDropHeightM] = useState<number>(56);
  const [dropProgress, setDropProgress] = useState<number>(0);
  const [dropping, setDropping] = useState<boolean>(false);

  // Hologram Mentor Q&A
  const [mentorOpen, setMentorOpen] = useState<boolean>(false);
  const [mentorQuestion, setMentorQuestion] = useState<string>('');
  const [mentorReply, setMentorReply] = useState<string>(
    isEn
      ? 'Welcome to 1940 Bletchley Park! Tap any Enigma key or adjust rotor offsets to inspect symmetric cipher substitution.'
      : 'Chào mừng tới Bletchley Park năm 1940! Hãy chạm phím Enigma hoặc xoay 3 đĩa mật mã để xem nguyên lí phản xạ đối xứng.'
  );
  const [mentorBusy, setMentorBusy] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const eraRef = useRef({ era, rotorPos, litCipherLetter, slitSep, waveLen, vacuumMode, dropObj, dropping, dropProgress });
  eraRef.current = { era, rotorPos, litCipherLetter, slitSep, waveLen, vacuumMode, dropObj, dropping, dropProgress };

  const encryptString = (text: string, customBase: [number, number, number] = rotorBase) => {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14);
    const { out, endPos } = encodeStringFromPos(clean, customBase);
    setPlainInput(clean);
    setCipherOutput(out);
    setRotorPos(endPos);
    setLitCipherLetter(out.slice(-1) || 'A');
    onEarnXP?.(4);
  };

  const tapEnigmaKey = (ch: string) => {
    const baseText = plainInput.length >= 14 ? '' : plainInput;
    encryptString(baseText + ch);
  };

  const stepRotorBase = (idx: 0 | 1 | 2, delta: number) => {
    const nextBase: [number, number, number] = [...rotorBase];
    nextBase[idx] = (nextBase[idx] + delta + 26) % 26;
    setRotorBase(nextBase);
    encryptString(plainInput, nextBase);
  };

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => setIsFullscreen((f) => !f));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => setIsFullscreen(false));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const totalFallSec = Math.sqrt((2 * dropHeightM) / 9.81);

  useEffect(() => {
    if (!dropping) return;
    let raf = 0;
    const t0 = performance.now();
    const durationMs = Math.max(900, totalFallSec * 450);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      setDropProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else setDropping(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [dropping, totalFallSec]);

  const askScientist = async () => {
    const q = mentorQuestion.trim();
    if (!q || mentorBusy) return;
    setMentorBusy(true);
    const scientistName =
      era === 'enigma_1940'
        ? 'Alan Turing (1940)'
        : era === 'slit_1801'
        ? 'Thomas Young (1801)'
        : 'Galileo Galilei (1609)';
    try {
      const { ok, data } = await safeFetchJson<{ answer?: string }>('/api/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: era === 'enigma_1940' ? 'cs' : 'physics',
          question: `${isEn ? 'Roleplay concisely (max 3 sentences) as' : 'Đóng vai nhà khoa học'} ${scientistName} ${isEn ? 'answering a student doing this 3D lab' : 'bằng tiếng Việt súc tích (tối đa 3 câu), giải đáp cho học sinh đang thí nghiệm 3D'}: "${q}"`
        })
      });
      if (ok && data?.answer) {
        setMentorReply(data.answer);
      } else {
        setMentorReply(
          era === 'enigma_1940'
            ? isEn
              ? 'Each keystroke steps the right rotor by 1/26 turn, scrambling the reflector return path so identical letters never encrypt alike twice.'
              : 'Mỗi lần nhấn 1 phím, đĩa bên phải nhích 1 nấc làm thay đổi toàn bộ đường nối điện qua gương phản xạ — nhờ đó cùng một chữ cái không lặp lại mã giống nhau!'
            : era === 'slit_1801'
            ? isEn
              ? 'Constructive interference occurs wherever path difference Δd = kλ; widening slit separation d compresses the interference fringe spacing Δy.'
              : 'Khi hai sóng qua khe kép giao thoa, vùng cùng pha tạo vân sáng cực đại (Δd = kλ), còn ngược pha triệt tiêu nhau tạo vân tối!'
            : isEn
            ? 'Inside an airless vacuum tube, aerodynamic drag vanishes so iron and feather accelerate identically at g ≈ 9.81 m/s².'
            : 'Trong buồng chân không không có lực cản không khí, gia tốc rơi tự do g không phụ thuộc khối lượng — sắt và vật nhẹ chạm đất cùng lúc!'
        );
      }
    } catch {
      setMentorReply(
        era === 'enigma_1940'
          ? 'Enigma rotor stepping breaks monoalphabetic frequency attacks.'
          : era === 'slit_1801'
          ? 'Fringe spacing Δy = λD / d increases with wavelength λ and shrinks as slit distance d widens.'
          : 'Without air drag, all objects fall with equal acceleration g ≈ 9.81 m/s².'
      );
    } finally {
      setMentorBusy(false);
      setMentorQuestion('');
      onEarnXP?.(6);
    }
  };

  // Live SVG Double-Slit Interference Intensity Profile I(y) = I0 cos²(β) sinc²(α)
  const fringeSvgPath = useMemo(() => {
    const pts: string[] = [];
    const N = 84;
    const freq = (slitSep / waveLen) * 3.1;
    for (let i = 0; i <= N; i++) {
      const u = (i / N) * 2 - 1; // -1 to 1 across detector screen
      const beta = u * freq * Math.PI * 0.65;
      const alpha = u * 2.2;
      const sinc = Math.abs(alpha) < 1e-4 ? 1 : Math.sin(alpha) / alpha;
      const intensity = Math.pow(Math.cos(beta), 2) * sinc * sinc;
      const x = (i / N) * 240;
      const y = 38 - intensity * 32;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [slitSep, waveLen]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const softwareGl = isSoftwareWebGL();
    const w = mount.clientWidth || 860;
    const h = mount.clientHeight || 520;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !softwareGl && perfMode !== 'smooth',
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      softwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.85)
    );
    renderer.setSize(w, h);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.03);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 120);
    camera.position.set(0.6, 3.2, 7.6);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.1, 0);
    controls.minDistance = 4;
    controls.maxDistance = 16;

    scene.add(new THREE.HemisphereLight(0xfde68a, 0x090f24, 0.95));
    const key = new THREE.DirectionalLight(0xfff5dc, 2.0);
    key.position.set(6, 10, 6);
    scene.add(key);

    const podium = new THREE.Group();
    const baseDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(2.65, 2.9, 0.24, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.24 })
    );
    const chronoRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.72, 0.035, 14, 64),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    chronoRing.rotation.x = Math.PI / 2;
    chronoRing.position.y = 0.13;
    podium.add(baseDisc, chronoRing);
    scene.add(podium);

    // === ERA 1: ENIGMA MACHINE 3D ===
    const enigmaGroup = new THREE.Group();
    const oakBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.72, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.6, metalness: 0.12 })
    );
    oakBox.position.y = 0.48;
    const rotorMat = new THREE.MeshPhysicalMaterial({ color: 0xd4d4d8, metalness: 0.88, roughness: 0.2 });
    const rotors: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const rGrp = new THREE.Group();
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.24, 26), rotorMat);
      drum.rotation.z = Math.PI / 2;
      const notch = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.12, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9 })
      );
      notch.position.set(0, 0.46, 0);
      rGrp.add(drum, notch);
      rGrp.position.set(-0.55 + i * 0.55, 1.05, -0.45);
      enigmaGroup.add(rGrp);
      rotors.push(rGrp);
    }

    // 3D Glowing Lampboard Bulbs (9x3 matrix for 26 letters)
    const lampBulbs: THREE.Mesh[] = [];
    const bulbGeo = new THREE.SphereGeometry(0.065, 10, 10);
    for (let i = 0; i < 26; i++) {
      const row = i < 9 ? 0 : i < 17 ? 1 : 2;
      const col = i < 9 ? i : i < 17 ? i - 9 : i - 17;
      const colsInRow = row === 0 ? 9 : row === 1 ? 8 : 9;
      const mat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        emissive: 0xfacc15,
        emissiveIntensity: 0.05
      });
      const bulb = new THREE.Mesh(bulbGeo, mat);
      bulb.position.set((col - (colsInRow - 1) / 2) * 0.24, 0.87, 0.12 + row * 0.28);
      enigmaGroup.add(bulb);
      lampBulbs.push(bulb);
    }
    enigmaGroup.add(oakBox);
    scene.add(enigmaGroup);

    // === ERA 2: DOUBLE-SLIT WAVE INTERFERENCE 3D ===
    const slitGroup = new THREE.Group();
    const emitter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.28, 0.65, 20),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
    );
    emitter.rotation.z = Math.PI / 2;
    emitter.position.set(-2.1, 1.2, 0);
    const barrierL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 1.1), rotorMat);
    barrierL.position.set(-0.3, 1.2, -0.95);
    const barrierM = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 0.45), rotorMat);
    barrierM.position.set(-0.3, 1.2, 0);
    const barrierR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 1.1), rotorMat);
    barrierR.position.set(-0.3, 1.2, 0.95);
    const screenBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 1.9, 2.9),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    screenBoard.position.set(2.05, 1.2, 0);

    // Animated incident wave planes
    const wavePlanes: THREE.Mesh[] = [];
    const wavePlaneGeo = new THREE.PlaneGeometry(1.5, 2.0);
    for (let wp = 0; wp < 5; wp++) {
      const m = new THREE.Mesh(
        wavePlaneGeo,
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      m.rotation.y = Math.PI / 2;
      m.position.set(-1.8 + wp * 0.36, 1.2, 0);
      slitGroup.add(m);
      wavePlanes.push(m);
    }

    const fringeStrips: THREE.Mesh[] = [];
    for (let k = -4; k <= 4; k++) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 1.75, 0.14),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 })
      );
      strip.position.set(2.0, 1.2, k * 0.28);
      slitGroup.add(strip);
      fringeStrips.push(strip);
    }
    slitGroup.add(emitter, barrierL, barrierM, barrierR, screenBoard);
    scene.add(slitGroup);

    // === ERA 3: GALILEO LEANING TOWER DROP 3D ===
    const galileoGroup = new THREE.Group();
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.56, 3.2, 24),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65 })
    );
    tower.position.set(-0.85, 1.65, 0);
    tower.rotation.z = -0.09;
    const ironBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.92, roughness: 0.2 })
    );
    ironBall.position.set(0.45, 3.05, 0);
    const secondMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, emissive: 0xf59e0b, emissiveIntensity: 0.35 });
    const featherSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), secondMat);
    featherSphere.position.set(1.25, 3.05, 0);
    galileoGroup.add(tower, ironBall, featherSphere);
    scene.add(galileoGroup);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) frameId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.045, clock.getDelta());
      const t = clock.elapsedTime;
      const cfg = eraRef.current;

      chronoRing.rotation.z += dt * 0.4;
      enigmaGroup.visible = cfg.era === 'enigma_1940';
      slitGroup.visible = cfg.era === 'slit_1801';
      galileoGroup.visible = cfg.era === 'galileo_1609';

      if (enigmaGroup.visible) {
        rotors.forEach((r, idx) => {
          const targetAngle = (cfg.rotorPos[idx] / 26) * Math.PI * 2;
          r.rotation.x = THREE.MathUtils.damp(r.rotation.x, targetAngle, 10, dt);
        });
        const litIdx = ALPHA.indexOf(cfg.litCipherLetter);
        lampBulbs.forEach((b, idx) => {
          const mat = b.material as THREE.MeshStandardMaterial;
          if (idx === litIdx) {
            mat.color.setHex(0xfef08a);
            mat.emissiveIntensity = 2.0 + Math.sin(t * 9) * 0.4;
          } else {
            mat.color.setHex(0x475569);
            mat.emissiveIntensity = 0.04;
          }
        });
      }

      if (slitGroup.visible) {
        barrierL.position.z = -(cfg.slitSep * 0.55 + 0.45);
        barrierR.position.z = cfg.slitSep * 0.55 + 0.45;
        barrierM.scale.z = Math.max(0.2, cfg.slitSep * 0.65);

        wavePlanes.forEach((wp, idx) => {
          const phase = ((t * 0.9 + idx / wavePlanes.length) % 1);
          wp.position.x = -1.9 + phase * 1.45;
          (wp.material as THREE.MeshBasicMaterial).opacity = Math.sin(phase * Math.PI) * 0.28;
        });

        fringeStrips.forEach((st, idx) => {
          const k = idx - 4;
          const spacing = (cfg.waveLen / Math.max(0.5, cfg.slitSep)) * 0.62;
          st.position.z = k * spacing;
          (st.material as THREE.MeshBasicMaterial).opacity =
            Math.max(0.15, 0.95 - Math.abs(k) * 0.16) * (0.8 + 0.2 * Math.sin(t * 6));
        });
      }

      if (galileoGroup.visible) {
        const objMeta = DROP_OBJECTS[cfg.dropObj];
        secondMat.color.setHex(objMeta.hex);
        const p = cfg.dropProgress;
        const ironY = 3.05 - p * p * 2.75;
        const featherP = cfg.vacuumMode ? p * p : Math.pow(p, 0.8) * objMeta.dragFactor;
        const featherY = 3.05 - featherP * 2.75;
        ironBall.position.y = Math.max(0.32, ironY);
        featherSphere.position.y = Math.max(0.32, featherY);
      }

      controls.update();
      renderer.render(scene, camera);

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth || 860;
      const nh = mount.clientHeight || 520;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    if (softwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      ro.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else m.material?.dispose();
        }
      });
      envTarget.dispose();
      renderer.dispose();
    };
  }, [perfMode]);

  const v1Ms = (9.81 * dropProgress * totalFallSec).toFixed(1);
  const v2Ms = (
    (vacuumMode ? 9.81 : 9.81 * DROP_OBJECTS[dropObj].dragFactor) *
    dropProgress *
    totalFallSec
  ).toFixed(1);

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        {isEn ? 'WebGL 3D context unavailable.' : 'Không thể khởi tạo WebGL 3D.'}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`flex flex-col lg:block lg:relative w-full overflow-hidden rounded-xl border border-indigo-500/40 bg-[#060a14] text-white shadow-2xl select-none ${
        isFullscreen ? 'fixed inset-0 z-[140] h-[100dvh] rounded-none border-0 overflow-y-auto lg:overflow-hidden' : 'lg:h-[700px]'
      }`}
    >
      {/* Top-Left Era Selector & Controls */}
      <div className="relative lg:pointer-events-none lg:absolute lg:top-3 lg:left-3 z-20 p-2.5 lg:p-0 bg-slate-950/95 lg:bg-transparent border-b border-slate-800 lg:border-b-0 lg:max-w-xl shrink-0">
        <div className="lg:pointer-events-auto rounded-lg bg-[#080d1e]/92 border border-indigo-500/40 p-2.5 space-y-2 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-300">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Hologram Time-Machine 3D' : 'Cỗ Máy Thời Gian Hologram 3D'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMentorOpen((v) => !v)}
                className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 border border-sky-400/55 text-[11px] font-bold text-sky-200 hover:bg-sky-500/35 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isEn ? 'Ask Scientist' : 'Hỏi Nhà Bác Học'}</span>
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-indigo-400 cursor-pointer"
                title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto lg:flex-wrap gap-1.5 text-[11px] scrollbar-none pb-0.5 lg:pb-0">
            {(
              [
                ['enigma_1940', '1940 · Enigma (Turing)'],
                ['slit_1801', isEn ? '1801 · Double-Slit (Young)' : '1801 · Khe Kép (Young)'],
                ['galileo_1609', isEn ? '1609 · Free Fall (Galileo)' : '1609 · Rơi Tự Do (Galileo)']
              ] as const
            ).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                onClick={() => setEra(id)}
                className={`min-h-[36px] px-2.5 py-1 rounded border font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                  era === id
                    ? 'bg-indigo-500 border-indigo-300 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-indigo-400'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hologram Mentor Drawer (Inline on mobile, top-right on desktop) */}
      {mentorOpen && (
        <div className="relative lg:absolute lg:top-3 lg:right-3 z-20 lg:w-72 p-3 lg:rounded-xl bg-[#091026]/95 border-b lg:border border-sky-400/50 space-y-2 shadow-2xl shrink-0">
          <div className="flex items-center justify-between text-xs font-extrabold text-sky-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {era === 'enigma_1940'
                ? 'Alan Turing · 1940'
                : era === 'slit_1801'
                ? 'Thomas Young · 1801'
                : 'Galileo Galilei · 1609'}
            </span>
            <button
              type="button"
              onClick={() => setMentorOpen(false)}
              className="min-h-[32px] min-w-[32px] text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 rounded-lg p-2.5 border border-slate-800">
            {mentorReply}
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={mentorQuestion}
              onChange={(e) => setMentorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void askScientist()}
              placeholder={isEn ? 'Ask a question...' : 'Đặt câu hỏi cho nhà bác học...'}
              className="flex-1 min-w-0 min-h-[36px] px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
            />
            <button
              type="button"
              onClick={() => void askScientist()}
              disabled={mentorBusy}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Unobstructed 3D Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[260px] lg:absolute lg:inset-0 lg:h-full' : 'h-[290px] sm:h-[380px] lg:absolute lg:inset-0 lg:h-full'}`}>
        <div ref={mountRef} className="w-full h-full" />
        {contextLost && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 text-indigo-300 text-sm font-mono">
            Restoring Time-Machine WebGL...
          </div>
        )}
      </div>

      {/* Bottom Interactive Dock */}
      <div className="relative lg:absolute lg:bottom-3 lg:left-1/2 lg:-translate-x-1/2 z-20 w-full lg:w-[95%] lg:max-w-[940px] flex flex-col items-center bg-slate-950/95 lg:bg-transparent border-t border-slate-800 lg:border-t-0 shrink-0">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="min-h-[36px] px-3 py-1 rounded-t-md bg-[#080d1e]/95 border border-b-0 border-indigo-500/40 text-[10px] font-mono font-bold text-indigo-200 cursor-pointer flex items-center gap-1"
        >
          {dockCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>
            {dockCollapsed
              ? isEn ? 'Show Experiment Controls' : 'Mở Bảng Thí Nghiệm Lịch Sử'
              : isEn ? 'Hide Controls' : 'Thu Gọn Bảng Điều Khiển'}
          </span>
        </button>

        {!dockCollapsed && (
          <div className="w-full max-h-[38dvh] lg:max-h-none overflow-y-auto rounded-none lg:rounded-xl bg-[#080d1e]/95 border border-indigo-500/40 p-3 shadow-2xl space-y-2.5">
            {era === 'enigma_1940' && (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-300">{isEn ? 'Plaintext:' : 'Nhập:'}</span>
                    <input
                      type="text"
                      value={plainInput}
                      onChange={(e) => encryptString(e.target.value)}
                      maxLength={14}
                      placeholder="SYNAPSE"
                      className="w-32 min-h-[34px] px-2 py-1 rounded bg-slate-950 border border-amber-500/50 text-xs font-mono font-bold text-amber-200 uppercase focus:outline-none"
                    />
                    {(['SYNAPSE', 'ENIGMA', 'TURING'] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => encryptString(w)}
                        className="min-h-[34px] px-2 rounded bg-slate-900 border border-slate-700 hover:border-amber-400 text-[10px] font-mono text-slate-200 cursor-pointer"
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  {/* Manual 3-Rotor Stepper Controls */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="text-slate-400">{isEn ? 'Rotors:' : 'Đĩa:'}</span>
                    {([0, 1, 2] as const).map((rIdx) => (
                      <div key={rIdx} className="inline-flex items-center rounded bg-slate-900 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => stepRotorBase(rIdx, -1)}
                          className="min-h-[32px] px-1.5 text-slate-300 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-sky-300 font-bold">{ALPHA[rotorPos[rIdx]]}</span>
                        <button
                          type="button"
                          onClick={() => stepRotorBase(rIdx, 1)}
                          className="min-h-[32px] px-1.5 text-slate-300 hover:text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ))}
                    <span className="text-emerald-300 font-extrabold tracking-widest ml-1">
                      → {cipherOutput || '—'}
                    </span>
                  </div>
                </div>

                {/* Clickable A-Z Enigma Keyboard */}
                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800">
                  {ALPHA.split('').map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => tapEnigmaKey(ch)}
                      className={`min-h-[32px] w-7 rounded text-[11px] font-mono font-bold border cursor-pointer ${
                        litCipherLetter === ch
                          ? 'bg-amber-400 text-slate-950 border-amber-200'
                          : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-sky-400'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => encryptString('')}
                    className="min-h-[32px] px-2 rounded bg-rose-500/15 border border-rose-500/40 text-[10px] font-bold text-rose-200 cursor-pointer"
                  >
                    CLR
                  </button>
                </div>
              </div>
            )}

            {era === 'slit_1801' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>{isEn ? 'Slit Sep d' : 'Khoảng 2 khe d'}</span>
                    <span className="text-cyan-300 font-bold">{slitSep.toFixed(2)} mm</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.2}
                    step={0.05}
                    value={slitSep}
                    onChange={(e) => setSlitSep(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </label>

                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>{isEn ? 'Wavelength λ' : 'Bước sóng λ'}</span>
                    <span className="text-indigo-300 font-bold">{Math.round(waveLen * 900)} nm</span>
                  </div>
                  <input
                    type="range"
                    min={0.35}
                    max={0.85}
                    step={0.02}
                    value={waveLen}
                    onChange={(e) => setWaveLen(parseFloat(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                </label>

                {/* Live Interference Intensity I(θ) Curve */}
                <div className="rounded-lg bg-slate-900/90 border border-slate-700/80 p-2 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-mono space-y-0.5 shrink-0">
                    <div className="text-slate-400">I(θ)</div>
                    <div className="text-cyan-300 font-bold">
                      Δy = {((waveLen * 900 * 1.2) / (slitSep * 1000)).toFixed(2)} mm
                    </div>
                  </div>
                  <svg viewBox="0 0 240 42" className="w-40 h-10 shrink-0">
                    <line x1="0" y1="38" x2="240" y2="38" stroke="#334155" strokeWidth="1" />
                    <path d={fringeSvgPath} fill="none" stroke="#22d3ee" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
            )}

            {era === 'galileo_1609' && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setVacuumMode((v) => !v)}
                    className={`min-h-[38px] px-3 py-1.5 rounded border font-bold cursor-pointer ${
                      vacuumMode
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-amber-500/20 border-amber-400 text-amber-200'
                    }`}
                  >
                    {vacuumMode
                      ? isEn ? 'Vacuum (g equal)' : 'Buồng Chân Không'
                      : isEn ? 'Air Drag Chamber' : 'Có Sức Cản Không Khí'}
                  </button>

                  {(['feather', 'wood', 'cork'] as DropObjectId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDropObj(id)}
                      className={`min-h-[38px] px-2.5 py-1 rounded border font-bold cursor-pointer ${
                        dropObj === id
                          ? 'bg-indigo-500/25 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isEn ? DROP_OBJECTS[id].en : DROP_OBJECTS[id].vi}
                    </button>
                  ))}

                  <label className="flex items-center gap-1.5 text-slate-300">
                    <span>h={dropHeightM}m</span>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={4}
                      value={dropHeightM}
                      onChange={(e) => setDropHeightM(Number(e.target.value))}
                      className="w-20 accent-amber-400 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-300">
                    t={(dropProgress * totalFallSec).toFixed(2)}s · v₁={v1Ms} · v₂={v2Ms} m/s
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDropProgress(0);
                      setDropping(true);
                      onEarnXP?.(5);
                    }}
                    className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Drop Both' : 'Thả Rơi Tự Do'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropping(false);
                      setDropProgress(0);
                    }}
                    className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded bg-slate-800 border border-slate-600 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
