import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Clock, MessageSquare, Play, RotateCcw, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { safeFetchJson } from '../../lib/apiClient';

interface TimeMachineHolo3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type EraId = 'enigma_1940' | 'slit_1801' | 'galileo_1609';

// Authentic simplified 3-rotor Enigma step encryption
const ROTOR_1 = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
const ROTOR_2 = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
const ROTOR_3 = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
const REFLECTOR_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeEnigmaChar(ch: string, pos: [number, number, number]): { out: string; nextPos: [number, number, number] } {
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

function isSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export const TimeMachineHolo3DLab: React.FC<TimeMachineHolo3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [era, setEra] = useState<EraId>('enigma_1940');
  // Enigma state
  const [rotorPos, setRotorPos] = useState<[number, number, number]>([0, 0, 0]);
  const [plainInput, setPlainInput] = useState<string>('SYNAPSE');
  const [cipherOutput, setCipherOutput] = useState<string>('QJXKWZM');
  // Double-slit state
  const [slitSep, setSlitSep] = useState<number>(1.3);
  const [waveLen, setWaveLen] = useState<number>(0.55);
  // Galileo drop state
  const [vacuumMode, setVacuumMode] = useState<boolean>(true);
  const [dropProgress, setDropProgress] = useState<number>(0);
  const [dropping, setDropping] = useState<boolean>(false);
  // Hologram Mentor Q&A
  const [mentorOpen, setMentorOpen] = useState<boolean>(false);
  const [mentorQuestion, setMentorQuestion] = useState<string>('');
  const [mentorReply, setMentorReply] = useState<string>(
    isEn
      ? 'Welcome to 1940 Bletchley Park! Type a letter to rotate my 3 Enigma rotors and inspect symmetric substitution.'
      : 'Chào mừng tới Bletchley Park năm 1940! Hãy gõ chữ để xoay 3 đĩa mật mã Enigma và xem nguyên lí phản xạ đối xứng.'
  );
  const [mentorBusy, setMentorBusy] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const eraRef = useRef({ era, rotorPos, slitSep, waveLen, vacuumMode, dropping, dropProgress });
  eraRef.current = { era, rotorPos, slitSep, waveLen, vacuumMode, dropping, dropProgress };

  const encryptString = (text: string) => {
    let p: [number, number, number] = [0, 0, 0];
    let out = '';
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 16);
    for (const ch of clean) {
      const res = encodeEnigmaChar(ch, p);
      out += res.out;
      p = res.nextPos;
    }
    setPlainInput(clean);
    setCipherOutput(out);
    setRotorPos(p);
    onEarnXP?.(4);
  };

  useEffect(() => {
    if (!dropping) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min(2.2, (now - t0) / 1000);
      const p = Math.min(1, elapsed / 1.4);
      setDropProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else setDropping(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [dropping]);

  const askScientist = async () => {
    const q = mentorQuestion.trim();
    if (!q || mentorBusy) return;
    setMentorBusy(true);
    const scientistName =
      era === 'enigma_1940'
        ? 'Alan Turing (1940)'
        : era === 'slit_1801'
        ? 'Thomas Young & Albert Einstein (1905)'
        : 'Galileo Galilei (1609)';
    try {
      const { ok, data } = await safeFetchJson<{ answer?: string }>('/api/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: era === 'enigma_1940' ? 'cs' : 'physics',
          question: `Đóng vai nhà khoa học ${scientistName} bằng tiếng Việt súc tích (tối đa 3 câu), giải đáp cho học sinh đang thí nghiệm 3D: "${q}"`
        })
      });
      if (ok && data?.answer) {
        setMentorReply(data.answer);
      } else {
        setMentorReply(
          era === 'enigma_1940'
            ? 'Mỗi lần bạn nhấn 1 phím, đĩa xoay bên phải nhích 1 nấc làm thay đổi toàn bộ đường nối điện qua gương phản xạ — nhờ đó cùng một chữ cái không bao giờ lặp lại mã giống nhau!'
            : era === 'slit_1801'
            ? 'Khi hai sóng đi qua khe kép giao thoa, vùng cùng pha tạo vân sáng cực đại (Δd = kλ), còn ngược pha triệt tiêu nhau tạo vân tối!'
            : 'Trong buồng chân không không có lực cản không khí, gia tốc rơi tự do g không phụ thuộc vào khối lượng — sắt và lông vũ chạm đất cùng lúc!'
        );
      }
    } catch {
      setMentorReply(
        era === 'enigma_1940'
          ? 'Đĩa Enigma xoay liên tục giúp phá vỡ tần suất chữ cái thông thường.'
          : era === 'slit_1801'
          ? 'Khoảng vân giao thoa tỉ lệ thuận với bước sóng λ và tỉ lệ nghịch với khoảng cách hai khe d.'
          : 'Không có lực cản không khí, mọi vật rơi với cùng gia tốc g ≈ 9.81 m/s².'
      );
    } finally {
      setMentorBusy(false);
      setMentorQuestion('');
      onEarnXP?.(6);
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const softwareGl = isSoftwareWebGL();
    const w = mount.clientWidth || 860;
    const h = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.03);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 120);
    camera.position.set(0.6, 3.2, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(softwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
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

    // Time Machine Hologram Podium Base
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
      new THREE.BoxGeometry(2.7, 0.72, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.6, metalness: 0.12 })
    );
    oakBox.position.y = 0.48;
    const rotorMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d4d8,
      metalness: 0.88,
      roughness: 0.2
    });
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
      rGrp.position.set(-0.55 + i * 0.55, 1.05, -0.35);
      enigmaGroup.add(rGrp);
      rotors.push(rGrp);
    }
    const lampGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 1.7 })
    );
    lampGlow.position.set(0, 0.92, 0.45);
    enigmaGroup.add(oakBox, lampGlow);
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
    const featherSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xfde68a, emissive: 0xf59e0b, emissiveIntensity: 0.35 })
    );
    featherSphere.position.set(1.25, 3.05, 0);
    galileoGroup.add(tower, ironBall, featherSphere);
    scene.add(galileoGroup);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.045, clock.getDelta());
      const t = clock.getElapsedTime();
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
        lampGlow.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
      }

      if (slitGroup.visible) {
        barrierL.position.z = -(cfg.slitSep * 0.55 + 0.45);
        barrierR.position.z = cfg.slitSep * 0.55 + 0.45;
        barrierM.scale.z = Math.max(0.2, cfg.slitSep * 0.65);
        fringeStrips.forEach((st, idx) => {
          const k = idx - 4;
          const spacing = (cfg.waveLen / Math.max(0.5, cfg.slitSep)) * 0.62;
          st.position.z = k * spacing;
          (st.material as THREE.MeshBasicMaterial).opacity =
            Math.max(0.15, 0.95 - Math.abs(k) * 0.16) * (0.8 + 0.2 * Math.sin(t * 6));
        });
      }

      if (galileoGroup.visible) {
        const p = cfg.dropProgress;
        const ironY = 3.05 - p * p * 2.75;
        const featherP = cfg.vacuumMode ? p * p : Math.pow(p, 0.72) * 0.55;
        const featherY = 3.05 - featherP * 2.75;
        ironBall.position.y = Math.max(0.32, ironY);
        featherSphere.position.y = Math.max(0.32, featherY);
      }

      controls.update();
      renderer.render(scene, camera);

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || 860;
      const nh = mount.clientHeight || 520;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    if (softwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
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
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[640px] sm:h-[700px] rounded-2xl overflow-hidden border border-indigo-500/40 bg-[#060a14] text-white shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />

      {/* Top-Left Era Selector & Telemetry */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-lg">
        <div className="pointer-events-auto rounded-lg bg-[#080d1e]/92 border border-indigo-500/40 p-2.5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-300">
              <Clock className="w-4 h-4" />
              <span>{isEn ? 'Hologram Time-Machine 3D' : 'Cỗ Máy Thời Gian Hologram 3D'}</span>
            </div>
            <button
              type="button"
              onClick={() => setMentorOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 border border-sky-400/55 text-[11px] font-bold text-sky-200 hover:bg-sky-500/35 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isEn ? 'Ask Scientist' : 'Hỏi Nhà Bác Học'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px]">
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
                className={`px-2.5 py-1 rounded border font-bold cursor-pointer whitespace-nowrap ${
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

      {/* Top-Right Scientist Hologram Mentor Drawer */}
      {mentorOpen && (
        <div className="pointer-events-auto absolute top-3 right-3 z-20 w-72 rounded-xl bg-[#091026]/95 border border-sky-400/50 p-3 space-y-2.5 shadow-2xl">
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
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
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
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
            />
            <button
              type="button"
              onClick={() => void askScientist()}
              disabled={mentorBusy}
              className="p-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock per Era */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(900px,95vw)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="px-3 py-1 rounded-t-md bg-[#080d1e]/95 border border-b-0 border-indigo-500/40 text-[10px] font-mono font-bold text-indigo-200 cursor-pointer"
        >
          {dockCollapsed
            ? isEn ? '▴ Show Experiment Controls' : '▴ Mở Bảng Thí Nghiệm Lịch Sử'
            : isEn ? '▾ Hide Controls' : '▾ Thu Gọn Bảng Điều Khiển'}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-[#080d1e]/95 border border-indigo-500/40 p-3 shadow-2xl">
            {era === 'enigma_1940' && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">{isEn ? 'Plaintext:' : 'Nhập chữ:'}</span>
                  <input
                    type="text"
                    value={plainInput}
                    onChange={(e) => encryptString(e.target.value)}
                    maxLength={16}
                    placeholder="SYNAPSE"
                    className="w-40 px-2.5 py-1.5 rounded bg-slate-950 border border-amber-500/50 text-xs font-mono font-bold text-amber-200 uppercase focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">{isEn ? 'Rotors:' : 'Đĩa xoay:'}</span>
                  <span className="text-sky-300 font-bold">
                    [{ALPHA[rotorPos[0]]} · {ALPHA[rotorPos[1]]} · {ALPHA[rotorPos[2]]}]
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">{isEn ? 'Enigma Cipher:' : 'Mã hóa Enigma:'}</span>
                  <span className="text-emerald-300 font-extrabold tracking-widest">
                    {cipherOutput || '—'}
                  </span>
                </div>
              </div>
            )}

            {era === 'slit_1801' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>{isEn ? 'Slit Separation d' : 'Khoảng cách 2 khe d'}</span>
                    <span className="text-cyan-300 font-bold">{slitSep.toFixed(2)} mm</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.2}
                    step={0.05}
                    value={slitSep}
                    onChange={(e) => setSlitSep(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
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
                    className="w-full accent-indigo-400"
                  />
                </label>
              </div>
            )}

            {era === 'galileo_1609' && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setVacuumMode((v) => !v)}
                    className={`px-3 py-1.5 rounded border font-bold cursor-pointer ${
                      vacuumMode
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-amber-500/20 border-amber-400 text-amber-200'
                    }`}
                  >
                    {vacuumMode
                      ? isEn ? 'Chamber: Vacuum (g equal)' : 'Môi trường: Buồng Chân Không'
                      : isEn ? 'Chamber: Earth Air Drag' : 'Môi trường: Có Sức Cản Không Khí'}
                  </button>
                  <span className="text-slate-300">
                    t = {(dropProgress * 1.4).toFixed(2)}s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDropProgress(0);
                      setDropping(true);
                      onEarnXP?.(5);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Drop Both Spheres' : 'Thả Quả Cầu Sắt & Lông'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropping(false);
                      setDropProgress(0);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-600 text-xs font-bold text-slate-200 cursor-pointer"
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
