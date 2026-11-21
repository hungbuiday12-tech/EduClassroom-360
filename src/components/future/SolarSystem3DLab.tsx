import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Calendar,
  Compass,
  Crosshair,
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Maximize2,
  Minimize2,
  Orbit,
  Pause,
  Play,
  Plus,
  Minus,
  RotateCcw,
  Tag,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import {
  SOLAR_BODIES,
  SolarBodyId,
  SolarBodyMeta,
  buildOrbitCurvePoints,
  computePlanetState,
  createPlanetSurfaceTexture,
  createSaturnRingTexture,
  createSolarGlowTexture
} from './solar/solarEphemeris';

interface SolarSystem3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type SpeedPresetId = 'live' | 'day' | 'month' | 'year';

const SPEED_PRESETS: { id: SpeedPresetId; daysPerSec: number; labelEn: string; labelVi: string }[] = [
  { id: 'live', daysPerSec: 1 / 86400, labelEn: 'Live', labelVi: 'Thực' },
  { id: 'day', daysPerSec: 1, labelEn: '1 day/s', labelVi: '1 ngày/s' },
  { id: 'month', daysPerSec: 30, labelEn: '1 month/s', labelVi: '1 tháng/s' },
  { id: 'year', daysPerSec: 365.25, labelEn: '1 year/s', labelVi: '1 năm/s' }
];

const MIN_EPOCH_MS = Date.UTC(1800, 0, 1, 0, 0, 0);
const MAX_EPOCH_MS = Date.UTC(2100, 11, 31, 23, 59, 0);
const ASTEROID_COUNT = 950;
const STAR_COUNT = 1800;

const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatEpochReadout(ms: number): { dateStr: string; timeStr: string } {
  const d = new Date(ms);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = MONTHS_EN[d.getUTCMonth()];
  const yyyy = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return {
    dateStr: `${dd} ${mon} ${yyyy}`,
    timeStr: `${hh}:${mm}`
  };
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
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return false;
  }
}

export const SolarSystem3DLab: React.FC<SolarSystem3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [selectedId, setSelectedId] = useState<SolarBodyId | null>(null);
  const selectedIdRef = useRef<SolarBodyId | null>(null);
  selectedIdRef.current = selectedId;

  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(true);
  playingRef.current = playing;

  const [speedPreset, setSpeedPreset] = useState<SpeedPresetId>('day');
  const speedPresetRef = useRef<SpeedPresetId>('day');
  speedPresetRef.current = speedPreset;

  const [epochMs, setEpochMs] = useState<number>(() => Date.now());
  const simTimeRef = useRef<number>(epochMs);

  const [showOrbits, setShowOrbits] = useState(true);
  const showOrbitsRef = useRef(true);
  showOrbitsRef.current = showOrbits;

  const [showLabels, setShowLabels] = useState(true);
  const showLabelsRef = useRef(true);
  showLabelsRef.current = showLabels;

  const [showControls, setShowControls] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  mutedRef.current = muted;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [unitMode, setUnitMode] = useState<'au' | 'km'>('au');
  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Screen-projected label DOM refs (direct transform mutation -> zero 60fps React re-renders)
  const labelRefs = useRef<Partial<Record<SolarBodyId, HTMLButtonElement | null>>>({});

  // Imperative camera actions
  const flyToBodyRef = useRef<((id: SolarBodyId | null, snap?: boolean) => void) | null>(null);
  const zoomStepRef = useRef<((factor: number) => void) | null>(null);

  const playCelestialChime = useCallback((freq = 440) => {
    if (mutedRef.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.25);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }, []);

  const handleSelectWorld = useCallback(
    (id: SolarBodyId | null) => {
      setSelectedId(id);
      flyToBodyRef.current?.(id, false);
      if (id) {
        const idx = SOLAR_BODIES.findIndex((b) => b.id === id);
        playCelestialChime(320 + idx * 45);
        onEarnXP?.(10);
      }
    },
    [onEarnXP, playCelestialChime]
  );

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => setIsFullscreen((f) => !f));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => setIsFullscreen(false));
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Selected world astronomical telemetry (recomputed cleanly as epoch moves)
  const selectedMeta = useMemo(
    () => (selectedId ? SOLAR_BODIES.find((b) => b.id === selectedId) || null : null),
    [selectedId]
  );

  const selectedTelemetry = useMemo(() => {
    if (!selectedMeta) return null;
    const st = computePlanetState(selectedMeta, new Date(epochMs));
    return {
      ...st,
      distanceKmMillion: (st.distanceAU * 149.59787).toFixed(1)
    };
  }, [selectedMeta, epochMs]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && perfMode !== 'smooth',
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglError(true);
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.85)
    );
    renderer.setSize(container.clientWidth || 960, container.clientHeight || 640);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03050a);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.25;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      44,
      (container.clientWidth || 960) / (container.clientHeight || 640),
      0.1,
      1400
    );
    const overviewCamPos = new THREE.Vector3(0, 42, 68);
    const overviewTarget = new THREE.Vector3(0, 0, 0);
    camera.position.copy(overviewCamPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 2.0;
    controls.maxDistance = 320;
    controls.target.copy(overviewTarget);
    controls.update();

    let camTransitionActive = false;
    let followActive = false;
    const camGoalPos = overviewCamPos.clone();
    const camGoalTarget = overviewTarget.clone();
    const followOffset = new THREE.Vector3();

    controls.addEventListener('start', () => {
      camTransitionActive = false;
      // Preserve tracking offset when user manually orbits around selected planet
      if (selectedIdRef.current && followActive) {
        const entry = bodyEntries.find((b) => b.meta.id === selectedIdRef.current);
        if (entry) {
          followOffset.copy(camera.position).sub(entry.root.position);
        }
      }
    });

    // Deep Starfield + Subtle Ecliptic Milky Band
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const tmpCol = new THREE.Color();
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 340 + Math.random() * 280;
      const theta = Math.random() * Math.PI * 2;
      // Slight concentration toward galactic band
      const bandBias = i % 3 === 0 ? (Math.random() - 0.5) * 0.45 : Math.acos(2 * Math.random() - 1) - Math.PI / 2;
      const phi = Math.PI / 2 - bandBias;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const tint = i % 5 === 0 ? 0xbae6fd : i % 7 === 0 ? 0xfef08a : 0xe2e8f0;
      tmpCol.setHex(tint);
      const bright = 0.55 + Math.random() * 0.45;
      starCol[i * 3] = tmpCol.r * bright;
      starCol[i * 3 + 1] = tmpCol.g * bright;
      starCol[i * 3 + 2] = tmpCol.b * bright;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Lighting: Bright Solar Point Light at (0,0,0) + Subtle Ambient Starlight Fill
    const ambientFill = new THREE.AmbientLight(0x1e293b, 0.72);
    scene.add(ambientFill);

    const sunLight = new THREE.PointLight(0xfff1d6, 3.6, 520, 0.25);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Disposables registry
    const texturesToDispose: THREE.Texture[] = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // ==================== BUILD SUN + ALL 8 PLANETS ====================
    interface BodyEntry {
      meta: SolarBodyMeta;
      root: THREE.Group;
      spinMesh: THREE.Mesh;
      hitMesh: THREE.Mesh;
      orbitLine?: THREE.Line;
      moonPivot?: THREE.Group;
      labelAnchorOffset: number;
    }

    const bodyEntries: BodyEntry[] = [];
    const pickables: THREE.Mesh[] = [];
    const orbitsGroup = new THREE.Group();
    scene.add(orbitsGroup);

    const glowTex = createSolarGlowTexture();
    const saturnRingTex = createSaturnRingTexture();
    texturesToDispose.push(glowTex, saturnRingTex);

    const nowDate = new Date(simTimeRef.current);

    SOLAR_BODIES.forEach((meta) => {
      const root = new THREE.Group();
      scene.add(root);

      const surfaceTex = createPlanetSurfaceTexture(meta.id);
      surfaceTex.anisotropy = maxAniso;
      texturesToDispose.push(surfaceTex);

      const sphereGeo = new THREE.SphereGeometry(meta.radiusScene, isSoftwareGl ? 28 : 44, isSoftwareGl ? 20 : 32);

      let spinMesh: THREE.Mesh;
      if (meta.id === 'sun') {
        const sunMat = new THREE.MeshBasicMaterial({ map: surfaceTex });
        spinMesh = new THREE.Mesh(sphereGeo, sunMat);
        root.add(spinMesh);

        // Solar Corona Sprites
        const haloMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xffae38,
          transparent: true,
          opacity: 0.78,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const halo = new THREE.Sprite(haloMat);
        halo.scale.set(meta.radiusScene * 4.2, meta.radiusScene * 4.2, 1);
        root.add(halo);

        const outerHaloMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xf97316,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const outerHalo = new THREE.Sprite(outerHaloMat);
        outerHalo.scale.set(meta.radiusScene * 7.2, meta.radiusScene * 7.2, 1);
        root.add(outerHalo);
      } else {
        const tiltGroup = new THREE.Group();
        tiltGroup.rotation.z = THREE.MathUtils.degToRad(meta.axialTiltDeg);
        root.add(tiltGroup);

        const planetMat = new THREE.MeshStandardMaterial({
          map: surfaceTex,
          roughness: meta.id === 'earth' ? 0.45 : meta.id === 'jupiter' || meta.id === 'saturn' ? 0.68 : 0.82,
          metalness: meta.id === 'earth' ? 0.14 : 0.04,
          emissive: new THREE.Color(meta.colorHex),
          emissiveIntensity: 0.08
        });
        spinMesh = new THREE.Mesh(sphereGeo, planetMat);
        tiltGroup.add(spinMesh);

        // Atmosphere Fresnel rim halo for Earth, Venus, Neptune
        if (meta.id === 'earth' || meta.id === 'venus' || meta.id === 'neptune') {
          const atmoColor = meta.id === 'earth' ? 0x38bdf8 : meta.id === 'venus' ? 0xfde68a : 0x60a5fa;
          const atmoMesh = new THREE.Mesh(
            new THREE.SphereGeometry(meta.radiusScene * 1.06, 24, 18),
            new THREE.MeshBasicMaterial({
              color: atmoColor,
              transparent: true,
              opacity: 0.14,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              depthWrite: false
            })
          );
          tiltGroup.add(atmoMesh);
        }

        // Saturn iconic concentric Ring System (radial UV remapped)
        if (meta.id === 'saturn') {
          const innerR = meta.radiusScene * 1.32;
          const outerR = meta.radiusScene * 2.48;
          const ringGeo = new THREE.RingGeometry(innerR, outerR, 72, 2);
          const posAttr = ringGeo.attributes.position;
          const uvAttr = ringGeo.attributes.uv;
          const v3 = new THREE.Vector3();
          for (let i = 0; i < posAttr.count; i++) {
            v3.fromBufferAttribute(posAttr, i);
            const r = v3.length();
            const u = THREE.MathUtils.clamp((r - innerR) / (outerR - innerR), 0, 1);
            uvAttr.setXY(i, u, 0.5);
          }
          const ringMesh = new THREE.Mesh(
            ringGeo,
            new THREE.MeshStandardMaterial({
              map: saturnRingTex,
              transparent: true,
              side: THREE.DoubleSide,
              roughness: 0.65,
              metalness: 0.05,
              depthWrite: false
            })
          );
          ringMesh.rotation.x = Math.PI / 2;
          tiltGroup.add(ringMesh);
        }

        // Uranus delicate pale ring
        if (meta.id === 'uranus') {
          const uRingGeo = new THREE.RingGeometry(meta.radiusScene * 1.48, meta.radiusScene * 1.66, 48);
          const uRingMesh = new THREE.Mesh(
            uRingGeo,
            new THREE.MeshBasicMaterial({
              color: 0xbae6fd,
              transparent: true,
              opacity: 0.3,
              side: THREE.DoubleSide,
              depthWrite: false
            })
          );
          uRingMesh.rotation.x = Math.PI / 2;
          tiltGroup.add(uRingMesh);
        }

        // Earth Moon & Jupiter Galilean Moons
        let moonPivot: THREE.Group | undefined;
        if (meta.id === 'earth') {
          moonPivot = new THREE.Group();
          const moon = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.9 })
          );
          moon.position.set(1.55, 0.12, 0);
          moonPivot.add(moon);
          root.add(moonPivot);
        } else if (meta.id === 'jupiter') {
          moonPivot = new THREE.Group();
          [
            { r: 2.55, sz: 0.11, col: 0xfef08a, ang: 0.3 },
            { r: 3.1, sz: 0.1, col: 0xe2e8f0, ang: 1.9 },
            { r: 3.7, sz: 0.14, col: 0xcbd5e1, ang: 3.8 }
          ].forEach((m) => {
            const jMoon = new THREE.Mesh(
              new THREE.SphereGeometry(m.sz, 12, 12),
              new THREE.MeshStandardMaterial({ color: m.col, roughness: 0.8 })
            );
            jMoon.position.set(Math.cos(m.ang) * m.r, 0, Math.sin(m.ang) * m.r);
            moonPivot!.add(jMoon);
          });
          root.add(moonPivot);
        }

        // Keplerian Orbit Ellipse Curve
        const pts = buildOrbitCurvePoints(meta, nowDate, 160);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const orbitLine = new THREE.Line(
          orbitGeo,
          new THREE.LineBasicMaterial({
            color: new THREE.Color(meta.orbitColorHex),
            transparent: true,
            opacity: 0.34
          })
        );
        orbitsGroup.add(orbitLine);

        bodyEntries.push({
          meta,
          root,
          spinMesh,
          hitMesh: spinMesh, // replaced below with generous click proxy
          orbitLine,
          moonPivot,
          labelAnchorOffset: meta.radiusScene + 0.55
        });
      }

      // Generous invisible raycast collider so tiny inner worlds are easy to click
      const hitRadius = Math.max(meta.radiusScene * 1.35, 1.4);
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(hitRadius, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitMesh.userData = { bodyId: meta.id };
      root.add(hitMesh);
      pickables.push(hitMesh);

      if (meta.id === 'sun') {
        bodyEntries.push({
          meta,
          root,
          spinMesh,
          hitMesh,
          labelAnchorOffset: meta.radiusScene + 0.7
        });
      } else {
        bodyEntries[bodyEntries.length - 1].hitMesh = hitMesh;
      }
    });

    // Main Asteroid Belt (InstancedMesh between Mars 1.52 AU and Jupiter 5.20 AU)
    const beltGroup = new THREE.Group();
    const astGeo = new THREE.DodecahedronGeometry(0.11, 0);
    const astMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.15
    });
    const astMesh = new THREE.InstancedMesh(astGeo, astMat, ASTEROID_COUNT);
    const m4 = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    const euler = new THREE.Euler();
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const au = 2.2 + ((i * 37) % 100) / 100 * 1.1; // 2.2 - 3.3 AU mapped through exploration scale
      const sceneR = 9.2 + Math.pow(au, 0.56) * 14.5;
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const yOff = (((i * 29) % 100) / 100 - 0.5) * 1.4;
      pos.set(Math.cos(theta) * sceneR, yOff, Math.sin(theta) * sceneR);
      euler.set(i * 0.4, i * 0.7, i * 0.2);
      quat.setFromEuler(euler);
      const s = 0.5 + ((i * 13) % 10) * 0.11;
      scl.set(s, s * 0.78, s * 0.9);
      m4.compose(pos, quat, scl);
      astMesh.setMatrixAt(i, m4);
    }
    astMesh.instanceMatrix.needsUpdate = true;
    beltGroup.add(astMesh);
    orbitsGroup.add(beltGroup);

    // Imperative Camera Fly-To & Zoom helpers
    flyToBodyRef.current = (id: SolarBodyId | null, snap = false) => {
      if (!id) {
        followActive = false;
        camGoalTarget.copy(overviewTarget);
        camGoalPos.copy(overviewCamPos);
        camTransitionActive = true;
        if (snap) {
          controls.target.copy(camGoalTarget);
          camera.position.copy(camGoalPos);
          controls.update();
          camTransitionActive = false;
        }
        return;
      }

      const entry = bodyEntries.find((b) => b.meta.id === id);
      if (!entry) return;
      followActive = true;
      const r = entry.meta.radiusScene;
      const viewDist = id === 'sun' ? r * 4.4 : id === 'saturn' ? r * 5.2 : Math.max(4.4, r * 5.0);
      const dir = entry.root.position.lengthSq() > 1
        ? entry.root.position.clone().normalize()
        : new THREE.Vector3(0.4, 0, 1).normalize();
      // Approach from an angle slightly Sun-lit & elevated above the ecliptic
      const camOffset = new THREE.Vector3(-dir.z * 0.65 + dir.x * 0.6, 0.45, dir.x * 0.65 + dir.z * 0.6)
        .normalize()
        .multiplyScalar(viewDist);
      followOffset.copy(camOffset);
      camGoalTarget.copy(entry.root.position);
      camGoalPos.copy(entry.root.position).add(camOffset);
      camTransitionActive = true;
    };

    zoomStepRef.current = (factor: number) => {
      const offset = camera.position.clone().sub(controls.target);
      const nextLen = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
      offset.setLength(nextLen);
      camera.position.copy(controls.target).add(offset);
      if (followActive) followOffset.copy(offset);
      controls.update();
    };

    // Raycast Hover + Click-to-Visit
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      if (hits.length > 0) {
        const bodyId = hits[0].object.userData?.bodyId as SolarBodyId | undefined;
        if (bodyId) {
          handleSelectWorld(bodyId);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();
    const projVec = new THREE.Vector3();
    let epochSyncAcc = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        rafId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const st = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) rafId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!alive) return;
      const dt = Math.min(0.05, clock.getDelta());

      // Advance simulation clock according to chosen speed
      if (playingRef.current) {
        const preset = SPEED_PRESETS.find((s) => s.id === speedPresetRef.current) || SPEED_PRESETS[1];
        if (preset.id === 'live') {
          simTimeRef.current = Date.now();
        } else {
          simTimeRef.current = Math.min(
            MAX_EPOCH_MS,
            Math.max(MIN_EPOCH_MS, simTimeRef.current + preset.daysPerSec * 86400000 * dt)
          );
          if (simTimeRef.current >= MAX_EPOCH_MS) simTimeRef.current = MIN_EPOCH_MS;
        }
      }

      epochSyncAcc += dt;
      if (epochSyncAcc >= 0.1) {
        epochSyncAcc = 0;
        setEpochMs(simTimeRef.current);
      }

      const simDate = new Date(simTimeRef.current);
      orbitsGroup.visible = showOrbitsRef.current;
      beltGroup.rotation.y += dt * 0.015;

      // Position & spin all solar bodies
      bodyEntries.forEach((entry) => {
        const state = computePlanetState(entry.meta, simDate);
        entry.root.position.copy(state.scenePos);
        entry.spinMesh.rotation.y += dt * entry.meta.rotSpeed;
        if (entry.moonPivot) {
          entry.moonPivot.rotation.y += dt * 1.15;
        }
        // Highlight selected planet's orbit line
        if (entry.orbitLine) {
          const mat = entry.orbitLine.material as THREE.LineBasicMaterial;
          mat.opacity = selectedIdRef.current === entry.meta.id ? 0.88 : 0.34;
        }
      });

      // Smooth Fly-To Camera & World Tracking
      if (selectedIdRef.current && followActive) {
        const entry = bodyEntries.find((b) => b.meta.id === selectedIdRef.current);
        if (entry) {
          if (camTransitionActive) {
            camGoalTarget.copy(entry.root.position);
            camGoalPos.copy(entry.root.position).add(followOffset);
            controls.target.x = THREE.MathUtils.damp(controls.target.x, camGoalTarget.x, 5.5, dt);
            controls.target.y = THREE.MathUtils.damp(controls.target.y, camGoalTarget.y, 5.5, dt);
            controls.target.z = THREE.MathUtils.damp(controls.target.z, camGoalTarget.z, 5.5, dt);
            camera.position.x = THREE.MathUtils.damp(camera.position.x, camGoalPos.x, 5.0, dt);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, camGoalPos.y, 5.0, dt);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, camGoalPos.z, 5.0, dt);
            if (camera.position.distanceTo(camGoalPos) < 0.08) {
              camTransitionActive = false;
            }
          } else {
            // Keep target locked gently on moving planet while user freely orbits offset
            const deltaTarget = entry.root.position.clone().sub(controls.target);
            controls.target.add(deltaTarget);
            camera.position.add(deltaTarget);
          }
        }
      } else if (camTransitionActive) {
        controls.target.x = THREE.MathUtils.damp(controls.target.x, camGoalTarget.x, 5.0, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, camGoalTarget.y, 5.0, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, camGoalTarget.z, 5.0, dt);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, camGoalPos.x, 4.8, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, camGoalPos.y, 4.8, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, camGoalPos.z, 4.8, dt);
        if (camera.position.distanceTo(camGoalPos) < 0.15) {
          camTransitionActive = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Update floating HTML world labels via direct DOM transform (Zero React overhead)
      const cw = container.clientWidth || 960;
      const ch = container.clientHeight || 640;
      const labelsEnabled = showLabelsRef.current;

      bodyEntries.forEach((entry) => {
        const el = labelRefs.current[entry.meta.id];
        if (!el) return;
        if (!labelsEnabled) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        projVec.copy(entry.root.position);
        projVec.y += entry.labelAnchorOffset;
        projVec.project(camera);
        const visible = projVec.z > -1 && projVec.z < 1;
        if (!visible) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }
        const sx = (projVec.x * 0.5 + 0.5) * cw;
        const sy = (-projVec.y * 0.5 + 0.5) * ch;
        el.style.opacity = selectedIdRef.current === entry.meta.id ? '1' : '0.86';
        el.style.pointerEvents = 'auto';
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
      });

      if (isSoftwareGl) afterDraw(tick);
      else rafId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
      texturesToDispose.forEach((t) => t.dispose());
      starGeo.dispose();
      starMat.dispose();
      envRT.dispose();
      renderer.dispose();
    };
  }, [handleSelectWorld, perfMode]);

  const { dateStr, timeStr } = formatEpochReadout(epochMs);
  const progressPct = ((epochMs - MIN_EPOCH_MS) / (MAX_EPOCH_MS - MIN_EPOCH_MS)) * 100;

  if (webglError) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/40 bg-slate-950 text-center text-rose-300 text-sm">
        {isEn ? 'WebGL 3D context could not be initialized.' : 'Không thể khởi tạo ngữ cảnh WebGL 3D.'}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden rounded-xl border border-amber-500/25 bg-[#03050a] shadow-2xl select-none ${
        isFullscreen ? 'h-screen rounded-none border-0' : 'h-[650px] sm:h-[740px]'
      }`}
    >
      {/* 3D Solar WebGL Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 text-amber-300 text-sm font-mono">
          {isEn ? 'Restoring Solar Observatory WebGL...' : 'Đang khôi phục Đài Quan Sát Hệ Mặt Trời...'}
        </div>
      )}

      {/* Projected Floating 3D World Name Labels */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {SOLAR_BODIES.map((body) => {
          const isSelected = selectedId === body.id;
          return (
            <button
              key={body.id}
              ref={(el) => {
                labelRefs.current[body.id] = el;
              }}
              type="button"
              onClick={() => handleSelectWorld(body.id)}
              style={{ opacity: 0 }}
              className={`absolute top-0 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-[0.16em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/60 font-extrabold'
                  : 'text-slate-200/80 hover:text-white font-semibold'
              }`}
            >
              {isEn ? body.nameEn : body.nameVi}
            </button>
          );
        })}
      </div>

      {/* Top-Left Hero Overlay ("SOLAR · EXPLORE THE SOLAR SYSTEM") */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 max-w-sm space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #fff6c2, #ffb020 60%, #ea580c)'
            }}
          />
          <div>
            <div className="text-xs font-mono font-extrabold tracking-[0.26em] text-slate-100">
              SOLAR
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-slate-400 uppercase">
              {isEn ? 'EXPLORE THE SOLAR SYSTEM' : 'KHÁM PHÁ HỆ MẶT TRỜI'}
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <span>{speedPreset === 'live' ? (isEn ? 'LIVE POSITIONS' : 'VỊ TRÍ THỰC TẾ') : isEn ? 'EPHEMERIS EPOCH' : 'MÔ PHỎNG THIÊN VĂN'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.05]">
            {isEn ? 'The Solar System' : 'Hệ Mặt Trời'}
          </h2>

          <p className="text-xs text-slate-300/90 leading-relaxed max-w-[300px]">
            {isEn
              ? 'All eight planets, shown where they really are on the date below. Pick a world to fly there.'
              : 'Tất cả 8 hành tinh ở đúng tọa độ thiên văn thực tế tại thời điểm bên dưới. Chọn một thiên thể để bay tới quan sát.'}
          </p>
        </div>

        {/* Focused World Astronomical Telemetry Card */}
        {selectedMeta && selectedTelemetry && (
          <div className="pointer-events-auto rounded-xl bg-slate-950/90 border border-amber-400/35 p-3 space-y-2 shadow-2xl max-w-[320px]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                  {isEn ? selectedMeta.typeEn : selectedMeta.typeVi}
                </div>
                <div className="text-base font-extrabold text-white flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: selectedMeta.colorHex }}
                  />
                  <span>{isEn ? selectedMeta.nameEn : selectedMeta.nameVi}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectWorld(null)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-200 cursor-pointer"
              >
                {isEn ? 'Overview' : 'Toàn cảnh'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <div className="px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[9px] text-slate-400">{isEn ? 'SUN DIST' : 'KHOẢNG CÁCH'}</div>
                <div className="text-amber-300 font-bold tabular-nums">
                  {selectedMeta.id === 'sun'
                    ? '0.00 AU'
                    : unitMode === 'au'
                    ? `${selectedTelemetry.distanceAU.toFixed(3)} AU`
                    : `${selectedTelemetry.distanceKmMillion} M km`}
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[9px] text-slate-400">{isEn ? 'ORBIT SPEED' : 'VẬN TỐC QUỸ ĐẠO'}</div>
                <div className="text-sky-300 font-bold tabular-nums">
                  {selectedMeta.id === 'sun' ? '220 km/s (Gal)' : `${selectedTelemetry.velocityKms.toFixed(2)} km/s`}
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[9px] text-slate-400">{isEn ? 'TEMP' : 'NHIỆT ĐỘ'}</div>
                <div className="text-slate-100 font-bold truncate">{selectedMeta.tempDisplay}</div>
              </div>
              <div className="px-2 py-1 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[9px] text-slate-400">{isEn ? 'MOONS · TILT' : 'MẶT TRĂNG · NGHIÊNG'}</div>
                <div className="text-emerald-300 font-bold tabular-nums">
                  {selectedMeta.moonsCount} · {selectedMeta.axialTiltDeg}°
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {isEn ? selectedMeta.factEn : selectedMeta.factVi}
            </p>
          </div>
        )}
      </div>

      {/* Top-Right Utility Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setUnitMode((u) => (u === 'au' ? 'km' : 'au'))}
          className="px-2.5 py-1.5 rounded-lg bg-slate-950/88 border border-slate-700/80 text-[11px] font-mono font-bold text-slate-200 hover:border-amber-400/60 cursor-pointer"
          title={isEn ? 'Switch AU / Million km' : 'Đổi đơn vị AU / Triệu km'}
        >
          {unitMode === 'au' ? 'AU' : 'M km'}
        </button>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="p-2 rounded-lg bg-slate-950/88 border border-slate-700/80 text-slate-200 hover:border-amber-400/60 cursor-pointer"
          title={isEn ? 'Toggle Sound' : 'Bật/Tắt Âm thanh'}
        >
          {muted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-950/88 border border-slate-700/80 text-slate-200 hover:border-amber-400/60 cursor-pointer"
          title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setShowGuide((g) => !g)}
          className={`p-2 rounded-lg border cursor-pointer ${
            showGuide
              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
              : 'bg-slate-950/88 border-slate-700/80 text-slate-200 hover:border-amber-400/60'
          }`}
          title={isEn ? 'Astronomical Guide' : 'Hướng dẫn Thiên văn'}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {showGuide && (
        <div className="absolute top-16 right-4 z-30 w-72 rounded-xl bg-slate-950/94 border border-amber-400/40 p-3.5 text-xs text-slate-200 space-y-2 shadow-2xl">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>{isEn ? 'Keplerian Ephemeris (J2000)' : 'Thiên văn Kepler Thực Tế (J2000)'}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {isEn
              ? 'Planet angles and distances are computed in real time from NASA/JPL J2000 orbital elements across 1800–2100. Exploration scale compresses outer giant radii so all eight orbits remain inspectable together.'
              : 'Vị trí 8 hành tinh được giải trực tiếp theo phương trình Kepler J2000 của NASA/JPL giai đoạn 1800–2100. Tỉ lệ khám phá nén khoảng cách vòng ngoài để bạn quan sát toàn bộ Hệ Mặt Trời.'}
          </p>
        </div>
      )}

      {/* Right-Side Vertical HUD Toolbar (matching screenshot) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        <div className="flex flex-col rounded-xl bg-slate-950/88 border border-slate-800 overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={() => zoomStepRef.current?.(0.75)}
            className="p-2.5 text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer border-b border-slate-800"
            title={isEn ? 'Zoom In' : 'Phóng to'}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => zoomStepRef.current?.(1.33)}
            className="p-2.5 text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
            title={isEn ? 'Zoom Out' : 'Thu nhỏ'}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleSelectWorld(null)}
          className="p-2.5 rounded-xl bg-slate-950/88 border border-slate-800 text-slate-200 hover:border-amber-400/60 hover:text-white cursor-pointer shadow-xl"
          title={isEn ? 'Home Overview' : 'Toàn cảnh Hệ Mặt Trời'}
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => flyToBodyRef.current?.(selectedId || 'sun', false)}
          className="p-2.5 rounded-xl bg-slate-950/88 border border-slate-800 text-slate-200 hover:border-amber-400/60 hover:text-white cursor-pointer shadow-xl"
          title={isEn ? 'Recenter Selected World' : 'Đưa mục tiêu về tâm'}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-xl bg-slate-950/88 border border-slate-800 overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={() => setShowOrbits((v) => !v)}
            className={`p-2.5 cursor-pointer border-b border-slate-800 ${
              showOrbits ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'
            }`}
            title={isEn ? 'Toggle Orbit Rings' : 'Bật/Tắt Đường Quỹ Đạo'}
          >
            <Orbit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            className={`p-2.5 cursor-pointer ${
              showLabels ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'
            }`}
            title={isEn ? 'Toggle World Labels' : 'Bật/Tắt Tên Hành Tinh'}
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Dock: Collapsible Toggle + Planet Strip + Epoch Timeline */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-[1040px] flex flex-col items-center gap-2">
        {!showControls ? (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-950/90 border border-amber-400/40 text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isEn ? 'Show Solar Timeline' : 'Mở Thanh Điều Khiển Hệ Mặt Trời'}</span>
          </button>
        ) : (
          <>
            {/* Center Planet Quick-Fly Strip */}
            <div className="relative flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-2xl overflow-x-auto max-w-full">
              {SOLAR_BODIES.map((body) => {
                const active = selectedId === body.id;
                return (
                  <button
                    key={body.id}
                    type="button"
                    onClick={() => handleSelectWorld(body.id)}
                    className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
                      active ? 'bg-amber-400/15 text-amber-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="relative flex items-center justify-center w-5 h-5">
                      {body.id === 'saturn' && (
                        <span className="absolute w-6 h-1.5 rounded-full border border-amber-200/75 -rotate-12" />
                      )}
                      <span
                        className={`rounded-full ${body.id === 'sun' ? 'w-4 h-4' : body.id === 'jupiter' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'}`}
                        style={{
                          background:
                            body.id === 'sun'
                              ? 'radial-gradient(circle at 35% 35%, #fff6c2, #ffb020 65%, #ea580c)'
                              : `radial-gradient(circle at 30% 30%, #ffffff55, ${body.colorHex} 65%, #020617)`
                        }}
                      />
                    </span>
                    <span className="text-[10px] font-medium whitespace-nowrap">
                      {isEn ? body.nameEn : body.nameVi}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowControls(false)}
                className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title={isEn ? 'Collapse HUD' : 'Thu gọn'}
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Ephemeris Timeline Bar (1800 – 2100) */}
            <div className="w-full rounded-2xl bg-slate-950/92 border border-slate-800/90 px-3 sm:px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
              {/* Left: Play/Pause + Live Date & Time */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 hover:bg-amber-500/35 text-amber-300 flex items-center justify-center cursor-pointer"
                  title={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                <div className="flex items-center gap-2 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-white tracking-wide tabular-nums">{dateStr}</span>
                  <span className="text-slate-400 tabular-nums text-[11px]">{timeStr}</span>
                </div>
              </div>

              {/* Center: 1800 – 2100 Timeline Scrubber */}
              <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-md">
                <span className="text-[10px] font-mono text-slate-500">1800</span>
                <input
                  type="range"
                  min={MIN_EPOCH_MS}
                  max={MAX_EPOCH_MS}
                  step={86400000}
                  value={epochMs}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    simTimeRef.current = v;
                    setEpochMs(v);
                  }}
                  style={{
                    background: `linear-gradient(to right, #f59e0b ${progressPct}%, #1e293b ${progressPct}%)`
                  }}
                  className="w-full h-1.5 rounded-lg accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-500">2100</span>
              </div>

              {/* Speed Presets + Today + Subtle Scale Note */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-[11px]">
                  {SPEED_PRESETS.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        setSpeedPreset(sp.id);
                        if (sp.id === 'live') {
                          const now = Date.now();
                          simTimeRef.current = now;
                          setEpochMs(now);
                        }
                        if (!playing) setPlaying(true);
                      }}
                      className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                        speedPreset === sp.id
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isEn ? sp.labelEn : sp.labelVi}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const now = Date.now();
                    simTimeRef.current = now;
                    setEpochMs(now);
                    setSpeedPreset('live');
                    setPlaying(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>{isEn ? 'Today' : 'Hôm nay'}</span>
                </button>

                <span className="hidden xl:inline text-[10px] text-slate-500 leading-tight max-w-[190px]">
                  {isEn
                    ? 'Drag to orbit · Scroll to zoom · Click a world · Distances compressed'
                    : 'Kéo để xoay · Cuộn thu phóng · Chạm hành tinh · Tỉ lệ nén'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
