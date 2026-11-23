import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  computePlanetPosition,
  distanceAUAndLightMin,
  SOLAR_PLANETS,
  yearToJulianCenturies,
} from './solar/solarEphemeris';

interface SolarSystem3DLabProps {
  onEarnXP?: (xp: number) => void;
}

const _targetVec = new THREE.Vector3();
const _camGoal = new THREE.Vector3();

function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0.0, 'rgba(253, 230, 138, 0.05)');
    grad.addColorStop(0.22, 'rgba(253, 224, 140, 0.72)');
    grad.addColorStop(0.45, 'rgba(217, 180, 110, 0.22)');
    grad.addColorStop(0.55, 'rgba(245, 208, 132, 0.85)');
    grad.addColorStop(0.84, 'rgba(180, 148, 92, 0.55)');
    grad.addColorStop(1.0, 'rgba(253, 230, 138, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const SolarSystem3DLab: React.FC<SolarSystem3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const mountRef = useRef<HTMLDivElement>(null);

  const [epochYear, setEpochYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeSpeed, setTimeSpeed] = useState<number>(1.5);
  const [selectedId, setSelectedId] = useState<string>('earth');
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showSaturnRings, setShowSaturnRings] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const epochYearRef = useRef<number>(epochYear);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const timeSpeedRef = useRef<number>(timeSpeed);
  const selectedIdRef = useRef<string>(selectedId);
  const showOrbitsRef = useRef<boolean>(showOrbits);
  const showSaturnRingsRef = useRef<boolean>(showSaturnRings);
  const xpAwardedRef = useRef<boolean>(false);

  epochYearRef.current = epochYear;
  isPlayingRef.current = isPlaying;
  timeSpeedRef.current = timeSpeed;
  selectedIdRef.current = selectedId;
  showOrbitsRef.current = showOrbits;
  showSaturnRingsRef.current = showSaturnRings;

  const cameraTweenRef = useRef<{ active: boolean }>({ active: false });

  useEffect(() => {
    if (!xpAwardedRef.current && onEarnXP) {
      xpAwardedRef.current = true;
      onEarnXP(40);
    }
  }, [onEarnXP]);

  const telemetry = useMemo(() => {
    const T = yearToJulianCenturies(epochYear);
    const earth = computePlanetPosition(
      SOLAR_PLANETS.find((p) => p.id === 'earth')!,
      T
    );
    const activeSpec =
      SOLAR_PLANETS.find((p) => p.id === selectedId) || SOLAR_PLANETS[2];
    const activePos = computePlanetPosition(activeSpec, T);
    const rel = distanceAUAndLightMin(activePos, earth);
    return {
      spec: activeSpec,
      heliocentricAU: activePos.heliocentricAU,
      earthAU: selectedId === 'earth' ? 0 : rel.au,
      lightMin: selectedId === 'earth' ? 0 : rel.lightMin,
      speedKmS: activePos.orbitalSpeedKmS,
    };
  }, [epochYear, selectedId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(360, container.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03050c);
    scene.fog = new THREE.FogExp2(0x03050c, 0.0055);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 420);
    camera.position.set(16, 14, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.4;
    controls.maxDistance = 120;
    controls.addEventListener('start', () => {
      cameraTweenRef.current.active = false;
    });

    // Lighting rig (Solar key + deep space cool fill)
    const sunPoint = new THREE.PointLight(0xfff1d6, 3.2, 220, 0.35);
    scene.add(sunPoint);
    scene.add(new THREE.HemisphereLight(0x38bdf8, 0x090d1a, 0.38));

    // GLSL animated plasma Sun shader
    const sunUniforms = { uTime: { value: 0 } };
    const sunMat = new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }
        void main() {
          float n = noise(vPos * 1.8 + vec3(uTime * 0.45, uTime * 0.3, -uTime * 0.35));
          float n2 = noise(vPos * 3.8 - vec3(uTime * 0.7));
          float plasma = clamp(n * 0.65 + n2 * 0.35, 0.0, 1.0);
          vec3 col = mix(vec3(0.95, 0.32, 0.04), vec3(1.0, 0.92, 0.55), plasma);
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          col += vec3(1.0, 0.65, 0.2) * pow(rim, 2.2) * 0.55;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(1.7, 36, 28), sunMat);
    scene.add(sunMesh);

    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(2.05, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(corona);

    // Starfield
    const starCount = 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 95 + Math.random() * 140;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = r * Math.cos(ph);
      starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.28, transparent: true, opacity: 0.78 })
    );
    scene.add(stars);

    const saturnRingTex = createSaturnRingTexture();
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const planetNodes = new Map<
      string,
      {
        holder: THREE.Group;
        body: THREE.Mesh;
        ring?: THREE.Mesh;
        moonHolder?: THREE.Group;
      }
    >();

    for (const spec of SOLAR_PLANETS) {
      const holder = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: spec.colorHex,
        emissive: spec.emissiveHex,
        emissiveIntensity: 0.22,
        roughness: 0.62,
        metalness: 0.12,
      });
      const body = new THREE.Mesh(new THREE.SphereGeometry(spec.radiusScene, 28, 22), bodyMat);
      body.rotation.z = THREE.MathUtils.degToRad(spec.axialTiltDeg);
      holder.add(body);

      let ring: THREE.Mesh | undefined;
      if (spec.hasRings) {
        const ringGeo = new THREE.RingGeometry(spec.radiusScene * 1.35, spec.radiusScene * 2.35, 48);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshStandardMaterial({
          map: saturnRingTex,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.5,
          depthWrite: false,
        });
        ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.z = THREE.MathUtils.degToRad(spec.axialTiltDeg);
        holder.add(ring);
      }

      let moonHolder: THREE.Group | undefined;
      if (spec.hasMoon) {
        moonHolder = new THREE.Group();
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 14, 12),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 })
        );
        moon.position.x = spec.radiusScene + 0.42;
        moonHolder.add(moon);
        holder.add(moonHolder);
      }

      scene.add(holder);
      planetNodes.set(spec.id, { holder, body, ring, moonHolder });

      // Elliptical Kepler orbit path sampled around epoch 2000
      const pts: THREE.Vector3[] = [];
      const periodYears = spec.orbitalPeriodDays / 365.25;
      const segs = 128;
      for (let s = 0; s <= segs; s++) {
        const yr = 2000 + (s / segs) * periodYears;
        const p = computePlanetPosition(spec, yearToJulianCenturies(yr));
        pts.push(new THREE.Vector3(p.sceneX, p.sceneY, p.sceneZ));
      }
      const orbitLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: spec.colorHex,
          transparent: true,
          opacity: 0.34,
        })
      );
      orbitGroup.add(orbitLine);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      sunUniforms.uTime.value += dt;

      if (isPlayingRef.current) {
        let nextY = epochYearRef.current + dt * timeSpeedRef.current;
        if (nextY > 2100) nextY = 1800;
        if (nextY < 1800) nextY = 2100;
        epochYearRef.current = nextY;
        setEpochYear(Number(nextY.toFixed(2)));
      }

      orbitGroup.visible = showOrbitsRef.current;
      const T = yearToJulianCenturies(epochYearRef.current);

      for (const spec of SOLAR_PLANETS) {
        const node = planetNodes.get(spec.id);
        if (!node) continue;
        const pos = computePlanetPosition(spec, T);
        node.holder.position.set(pos.sceneX, pos.sceneY, pos.sceneZ);
        node.body.rotation.y += dt * 0.8;
        if (node.ring) node.ring.visible = showSaturnRingsRef.current;
        if (node.moonHolder) node.moonHolder.rotation.y += dt * 2.2;
      }

      if (cameraTweenRef.current.active) {
        const activeNode = planetNodes.get(selectedIdRef.current);
        if (activeNode) {
          _targetVec.copy(activeNode.holder.position);
          controls.target.lerp(_targetVec, 1 - Math.exp(-6 * dt));
          const pSpec = SOLAR_PLANETS.find((p) => p.id === selectedIdRef.current);
          const dist = (pSpec?.radiusScene ?? 0.5) * 4.5 + 3.2;
          _camGoal.set(_targetVec.x + dist, _targetVec.y + dist * 0.55, _targetVec.z + dist);
          camera.position.lerp(_camGoal, 1 - Math.exp(-5 * dt));
          if (camera.position.distanceTo(_camGoal) < 0.08) {
            cameraTweenRef.current.active = false;
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = Math.max(1, mountRef.current.clientWidth);
      const h = Math.max(360, mountRef.current.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      saturnRingTex.dispose();
      envRT.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.Points).isPoints) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else m.material?.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[660px] rounded-xl overflow-hidden border border-slate-800 bg-[#03050c] text-slate-100 select-none">
      {/* Isolated WebGL mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Minimal Top-Left Ephemeris Header & Telemetry */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col gap-1.5 max-w-[340px]">
        <div className="pointer-events-auto rounded-lg bg-slate-950/85 border border-slate-700/70 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Orbit className="w-4 h-4 shrink-0" />
            <span>
              {isEn ? 'Kepler J2000 Solar Ephemeris' : 'Hệ Mặt Trời Kepler J2000'} ·{' '}
              <span className="font-mono tabular-nums text-white">{epochYear.toFixed(1)}</span>
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-2 text-[11px] font-mono tabular-nums text-slate-300">
            <div>
              <div className="text-[10px] text-slate-400">{isEn ? 'Sun Dist' : 'Cách Mặt Trời'}</div>
              <div className="font-bold text-sky-300">{telemetry.heliocentricAU.toFixed(3)} AU</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">{isEn ? 'Light Time' : 'Ánh sáng'}</div>
              <div className="font-bold text-amber-300">{telemetry.lightMin.toFixed(1)} min</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">{isEn ? 'Velocity' : 'Vận tốc'}</div>
              <div className="font-bold text-emerald-300">{telemetry.speedKmS.toFixed(1)} km/s</div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Bottom Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[min(940px,95%)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="mb-1 px-3 py-1 rounded-t-lg bg-slate-900/95 border border-b-0 border-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1 cursor-pointer hover:text-amber-300"
        >
          {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{dockCollapsed ? (isEn ? 'Show Controls' : 'Mở điều khiển') : isEn ? 'Hide Controls' : 'Thu gọn'}</span>
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-slate-950/90 border border-slate-700/80 p-3 space-y-2.5">
            {/* Planet Fly-To Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {SOLAR_PLANETS.map((planet) => {
                const active = selectedId === planet.id;
                return (
                  <button
                    key={planet.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(planet.id);
                      cameraTweenRef.current.active = true;
                    }}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: `#${planet.colorHex.toString(16).padStart(6, '0')}` }}
                    />
                    <span>{isEn ? planet.nameEn : planet.nameVi.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Playback + Epoch Slider + Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPlaying((v) => !v)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Play' : 'Chạy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEpochYear(2026);
                    epochYearRef.current = 2026;
                    cameraTweenRef.current.active = true;
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>2026</span>
                </button>
              </div>

              <div className="flex-1 min-w-[190px] flex items-center gap-2">
                <span className="text-[11px] font-mono tabular-nums text-slate-400">1800</span>
                <input
                  type="range"
                  min={1800}
                  max={2100}
                  step={0.25}
                  value={epochYear}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setEpochYear(y);
                    epochYearRef.current = y;
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[11px] font-mono tabular-nums text-slate-400">2100</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[0.5, 1.5, 6].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setTimeSpeed(spd)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold cursor-pointer ${
                      timeSpeed === spd
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {spd}y/s
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowOrbits((v) => !v)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                    showOrbits ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isEn ? 'Orbits' : 'Quỹ đạo'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaturnRings((v) => !v)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    showSaturnRings ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isEn ? 'Rings' : 'Vành đai'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
