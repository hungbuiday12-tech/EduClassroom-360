import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AlertTriangle,
  ArrowRight,
  Flame,
  Layers,
  Orbit,
  RotateCcw,
  Sparkles,
  Target
} from 'lucide-react';
import { ROADMAP_NODES } from '../../data/roadmapData';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  LESSON_ASSESSMENT_UPDATED_EVENT,
  loadAllLessonAssessments
} from '../../lib/lessonProgressStore';
import {
  GROWTH_UPDATED_EVENT,
  getErrorNotebook,
  getStreakState
} from '../../lib/learningGrowthStore';
import { RoadmapNode } from '../../types';
import { FormattedText } from '../common/MathRenderer';

interface NeuralGalaxyTwin3DProps {
  language?: 'vi' | 'en';
}

interface GalaxyPlanetData {
  node: RoadmapNode;
  mastery: number; // 0 - 100
  errorCount: number;
  position: THREE.Vector3;
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

export const NeuralGalaxyTwin3D: React.FC<NeuralGalaxyTwin3DProps> = ({ language = 'vi' }) => {
  const isEn = language === 'en';
  const { user } = useAuth();
  const { navigate, selectSubject } = useNavigation();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const resetCamRef = useRef<(() => void) | null>(null);

  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics' | 'cs'>('all');
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ROADMAP_NODES[0]?.id || 'rm-math-9-1');

  useEffect(() => {
    const bump = () => setRefreshTick((t) => t + 1);
    window.addEventListener(GROWTH_UPDATED_EVENT, bump);
    window.addEventListener(LESSON_ASSESSMENT_UPDATED_EVENT, bump);
    return () => {
      window.removeEventListener(GROWTH_UPDATED_EVENT, bump);
      window.removeEventListener(LESSON_ASSESSMENT_UPDATED_EVENT, bump);
    };
  }, []);

  const galaxySnapshot = useMemo(() => {
    const assessments = loadAllLessonAssessments(user?.uid);
    const errors = getErrorNotebook(user?.uid).filter((e) => !e.resolved);
    const streak = getStreakState(user?.uid);

    const bySubjectOrder: Record<'math' | 'physics' | 'cs', RoadmapNode[]> = {
      math: [],
      physics: [],
      cs: []
    };
    ROADMAP_NODES.forEach((n) => bySubjectOrder[n.subject].push(n));

    const sectorAngleBase: Record<'math' | 'physics' | 'cs', number> = {
      math: 0,
      physics: (Math.PI * 2) / 3,
      cs: (Math.PI * 4) / 3
    };

    const planets: GalaxyPlanetData[] = [];
    (['math', 'physics', 'cs'] as const).forEach((subj) => {
      const list = bySubjectOrder[subj];
      const baseTheta = sectorAngleBase[subj];
      list.forEach((node, idx) => {
        const matchedAssessment = assessments.find(
          (a) =>
            (node.targetLessonId && a.lessonKey === node.targetLessonId) ||
            (a.subject === node.subject &&
              a.lessonTitle.toLowerCase().includes(node.title.slice(0, 12).toLowerCase()))
        );

        let mastery = 22 + ((idx * 17) % 35);
        if (matchedAssessment?.analysis?.overallMastery !== undefined) {
          mastery = matchedAssessment.analysis.overallMastery;
        } else if (matchedAssessment) {
          const completed = Object.keys(matchedAssessment.stepResults || {}).length;
          mastery = Math.min(96, Math.round((completed / Math.max(1, matchedAssessment.totalSteps)) * 100));
        }

        const relatedErrors = errors.filter(
          (e) =>
            e.subject === node.subject &&
            ((node.targetLessonId && e.lessonKey === node.targetLessonId) ||
              e.lessonTitle.toLowerCase().includes(node.title.slice(0, 10).toLowerCase()))
        );
        const subjFallbackErrors =
          relatedErrors.length > 0
            ? relatedErrors.length
            : idx === 0
            ? errors.filter((e) => e.subject === node.subject).length
            : 0;

        const radius = 5.4 + idx * 1.45;
        const angle = baseTheta + (idx - (list.length - 1) / 2) * 0.24;
        const y = Math.sin(idx * 1.15 + baseTheta) * 1.1;

        planets.push({
          node,
          mastery,
          errorCount: subjFallbackErrors,
          position: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
        });
      });
    });

    const visiblePlanets =
      subjectFilter === 'all' ? planets : planets.filter((p) => p.node.subject === subjectFilter);

    const avgMastery =
      planets.length > 0
        ? Math.round(planets.reduce((acc, p) => acc + p.mastery, 0) / planets.length)
        : 0;

    return {
      planets,
      visiblePlanets,
      avgMastery,
      unresolvedErrors: errors.length,
      currentStreak: streak.currentStreak
    };
  }, [user?.uid, subjectFilter, refreshTick]);

  const selectedPlanet =
    galaxySnapshot.planets.find((p) => p.node.id === selectedNodeId) ||
    galaxySnapshot.visiblePlanets[0] ||
    galaxySnapshot.planets[0];

  // Three.js Interactive 3D Knowledge Galaxy
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 720;
    const height = container.clientHeight || 460;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: isSoftwareGl ? 'low-power' : 'high-performance'
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x030712, 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.016);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 160);
    const defaultPos = new THREE.Vector3(0, 14, 21);
    camera.position.copy(defaultPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8;
    controls.maxDistance = 42;
    controls.target.set(0, 0, 0);
    controls.update();

    resetCamRef.current = () => {
      camera.position.copy(defaultPos);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    scene.add(new THREE.HemisphereLight(0x93c5fd, 0x090d16, 0.8));
    const coreLight = new THREE.PointLight(0x38bdf8, 3.6, 55);
    coreLight.position.set(0, 2, 0);
    scene.add(coreLight);

    // Central Synapse Multi-Part Core
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(1.45, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.65
    });
    coreGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const gimbalGeo1 = new THREE.TorusGeometry(2.15, 0.06, 12, 64);
    const gimbalMat1 = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.25
    });
    const gimbal1 = new THREE.Mesh(gimbalGeo1, gimbalMat1);
    gimbal1.rotation.x = Math.PI / 3;
    coreGroup.add(gimbal1);

    const gimbalGeo2 = new THREE.TorusGeometry(2.65, 0.045, 12, 64);
    const gimbalMat2 = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.25
    });
    const gimbal2 = new THREE.Mesh(gimbalGeo2, gimbalMat2);
    gimbal2.rotation.y = Math.PI / 4;
    coreGroup.add(gimbal2);
    scene.add(coreGroup);

    // Orbital Rings
    const orbitRadii = [6.5, 10.5, 14.5];
    const orbitDisposables: (THREE.BufferGeometry | THREE.Material)[] = [];
    orbitRadii.forEach((r) => {
      const og = new THREE.RingGeometry(r - 0.03, r + 0.03, 96);
      og.rotateX(-Math.PI / 2);
      const om = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      orbitDisposables.push(og, om);
      scene.add(new THREE.Mesh(og, om));
    });

    // InstancedMesh Starfield
    const STAR_COUNT = isSoftwareGl ? 240 : 520;
    const starGeo = new THREE.OctahedronGeometry(0.065, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const stars = new THREE.InstancedMesh(starGeo, starMat, STAR_COUNT);
    stars.frustumCulled = false;
    const _m4 = new THREE.Matrix4();
    const _pos = new THREE.Vector3();
    const _quat = new THREE.Quaternion();
    const _scale = new THREE.Vector3();
    for (let i = 0; i < STAR_COUNT; i++) {
      const dist = 19 + ((i * 73) % 28);
      const theta = i * 2.399963;
      const phi = Math.acos(1 - (2 * ((i % 97) + 0.5)) / 98);
      _pos.set(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.cos(phi) * 0.65,
        dist * Math.sin(phi) * Math.sin(theta)
      );
      const s = 0.6 + ((i * 19) % 10) * 0.1;
      _scale.set(s, s, s);
      _m4.compose(_pos, _quat, _scale);
      stars.setMatrixAt(i, _m4);
    }
    stars.instanceMatrix.needsUpdate = true;
    scene.add(stars);

    // Planets & Hit Proxies
    const planetGeo = new THREE.SphereGeometry(0.62, 24, 24);
    const hitGeo = new THREE.SphereGeometry(1.12, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const alertRingGeo = new THREE.TorusGeometry(0.95, 0.05, 10, 36);
    const alertRingMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.85
    });
    const selRingGeo = new THREE.TorusGeometry(1.06, 0.045, 10, 40);
    const selRingMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const selectionHalo = new THREE.Mesh(selRingGeo, selRingMat);
    selectionHalo.rotation.x = Math.PI / 2;
    scene.add(selectionHalo);

    const subjectColors: Record<'math' | 'physics' | 'cs', number> = {
      math: 0x38bdf8,
      physics: 0xf59e0b,
      cs: 0x10b981
    };

    const pickables: THREE.Mesh[] = [];
    const planetGroups: {
      nodeId: string;
      group: THREE.Group;
      basePos: THREE.Vector3;
      phase: number;
      alertRing?: THREE.Mesh;
    }[] = [];

    const posById = new Map<string, THREE.Vector3>();
    galaxySnapshot.visiblePlanets.forEach((p) => posById.set(p.node.id, p.position));

    galaxySnapshot.visiblePlanets.forEach((p, idx) => {
      const g = new THREE.Group();
      g.position.copy(p.position);

      const subjHex = subjectColors[p.node.subject];
      const mat = new THREE.MeshStandardMaterial({
        color: subjHex,
        emissive: subjHex,
        emissiveIntensity: 0.18 + (p.mastery / 100) * 0.55,
        roughness: 0.26,
        metalness: 0.45
      });
      orbitDisposables.push(mat);

      const planetMesh = new THREE.Mesh(planetGeo, mat);
      const scaleFactor = 0.85 + (p.mastery / 100) * 0.45;
      planetMesh.scale.setScalar(scaleFactor);
      g.add(planetMesh);

      let alertRing: THREE.Mesh | undefined;
      if (p.errorCount > 0) {
        alertRing = new THREE.Mesh(alertRingGeo, alertRingMat);
        alertRing.rotation.x = Math.PI / 2.4;
        g.add(alertRing);
      }

      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.userData = { nodeId: p.node.id };
      g.add(hit);
      pickables.push(hit);

      scene.add(g);
      planetGroups.push({
        nodeId: p.node.id,
        group: g,
        basePos: p.position.clone(),
        phase: idx * 0.8,
        alertRing
      });
    });

    // Prerequisite Filament Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35
    });
    orbitDisposables.push(lineMat);
    galaxySnapshot.visiblePlanets.forEach((p) => {
      p.node.prerequisites.forEach((preId) => {
        const fromPos = posById.get(preId);
        if (!fromPos) return;
        const pts = [fromPos, p.position];
        const lg = new THREE.BufferGeometry().setFromPoints(pts);
        orbitDisposables.push(lg);
        scene.add(new THREE.Line(lg, lineMat));
      });
    });

    // Pointer Raycast Picking (guard drag vs click)
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerDown = (ev: PointerEvent) => {
      downX = ev.clientX;
      downY = ev.clientY;
    };
    const onPointerUp = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData?.nodeId;
        if (hitId) setSelectedNodeId(hitId);
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(pickables, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;

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
      const t = now * 0.001;

      coreGroup.rotation.y = t * 0.35;
      gimbal1.rotation.z = t * 0.7;
      gimbal2.rotation.x = -t * 0.55;
      stars.rotation.y = t * 0.025;

      let matchedSel: THREE.Vector3 | null = null;
      planetGroups.forEach((pg) => {
        const bob = Math.sin(t * 1.4 + pg.phase) * 0.16;
        pg.group.position.set(pg.basePos.x, pg.basePos.y + bob, pg.basePos.z);
        if (pg.alertRing) {
          pg.alertRing.rotation.z = t * 2.2;
        }
        if (pg.nodeId === selectedNodeId) {
          matchedSel = pg.group.position;
        }
      });

      if (matchedSel) {
        selectionHalo.visible = true;
        selectionHalo.position.copy(matchedSel);
        selectionHalo.rotation.z = t * 1.1;
      } else {
        selectionHalo.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);

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
      const h = container.clientHeight || 460;
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
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      gimbalGeo1.dispose();
      gimbalMat1.dispose();
      gimbalGeo2.dispose();
      gimbalMat2.dispose();
      starGeo.dispose();
      starMat.dispose();
      planetGeo.dispose();
      hitGeo.dispose();
      hitMat.dispose();
      alertRingGeo.dispose();
      alertRingMat.dispose();
      selRingGeo.dispose();
      selRingMat.dispose();
      orbitDisposables.forEach((d) => d.dispose());
      envRT.dispose();
      renderer.dispose();
    };
  }, [galaxySnapshot, selectedNodeId]);

  const handleWarpToLesson = (node: RoadmapNode) => {
    if (node.subject === 'math') {
      navigate({
        subject: 'math',
        mathTab: 'lectures',
        mathViewMode: 'lecture',
        mathLectureId: node.targetLessonId || 'math-1',
        tutorOpen: false
      });
      return;
    }
    if (node.subject === 'physics') {
      navigate({
        subject: 'physics',
        physicsView: 'lecture',
        physicsLessonId: node.targetLessonId || 'phys-9-elec',
        physicsTab: 'theory',
        tutorOpen: false
      });
      return;
    }
    navigate({
      subject: 'cs',
      csViewMode: 'curriculum',
      csSubView: 'lecture',
      csLessonId: node.targetLessonId || 'cs-1',
      csLessonTab: 'lecture',
      tutorOpen: false
    });
  };

  const subjectAccentText = (s: 'math' | 'physics' | 'cs') =>
    s === 'math' ? 'text-sky-400' : s === 'physics' ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="space-y-4">
      {/* Header & KPI Ribbon */}
      <div className="rounded-md border border-slate-700/80 bg-slate-900 text-slate-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <Orbit className="w-4 h-4" />
              {isEn ? '3D Neural Knowledge Galaxy Twin' : 'Vũ Trụ Tri Thức 3D · Bản Sao Học Tập Cá Nhân'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isEn
                ? 'Click any orbital node to inspect your mastery, unresolved mistakes, and warp straight into its lecture.'
                : 'Xoay 360° & nhấp vào từng hành tinh kiến thức (Toán · Lí · Tin) để soi % thành thạo, vòng cảnh báo lỗi sai và dịch chuyển thẳng vào bài học.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: isEn ? 'All Sectors' : 'Toàn bộ' },
                { id: 'math', label: isEn ? 'Math' : 'Toán học' },
                { id: 'physics', label: isEn ? 'Physics' : 'Vật lí' },
                { id: 'cs', label: isEn ? 'CS' : 'Tin học' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSubjectFilter(f.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer ${
                  subjectFilter === f.id
                    ? 'bg-sky-600 border-sky-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => resetCamRef.current?.()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isEn ? 'Reset' : 'Đặt lại'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-sky-400" />
              {isEn ? 'Average Mastery' : 'Độ thành thạo trung bình'}
            </div>
            <div className="text-lg font-bold text-sky-300 mt-0.5 tabular-nums">
              {galaxySnapshot.avgMastery}%
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              {isEn ? 'Active Weak Alerts' : 'Lỗi cần ôn SM-2'}
            </div>
            <div className="text-lg font-bold text-rose-400 mt-0.5 tabular-nums">
              {galaxySnapshot.unresolvedErrors}
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {isEn ? 'Study Streak' : 'Chuỗi ngày học'}
            </div>
            <div className="text-lg font-bold text-amber-300 mt-0.5 tabular-nums">
              {galaxySnapshot.currentStreak} {isEn ? 'days' : 'ngày'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: 3D Galaxy Canvas + Planet Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-md border border-slate-700 bg-[#030712] overflow-hidden">
          <div ref={mountRef} className="w-full h-[440px] sm:h-[480px]" />
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" /> Toán học
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Vật lí
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Tin học
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Có vòng đỏ = Còn lỗi sai chưa gỡ
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between gap-4">
          {selectedPlanet ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${subjectAccentText(
                    selectedPlanet.node.subject
                  )}`}
                >
                  {selectedPlanet.node.subject === 'math'
                    ? 'TOÁN HỌC'
                    : selectedPlanet.node.subject === 'physics'
                    ? 'VẬT LÍ'
                    : 'TIN HỌC'}{' '}
                  · {selectedPlanet.node.grade}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 tabular-nums">
                  {selectedPlanet.mastery}%
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {selectedPlanet.node.title}
              </h3>

              <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all"
                  style={{ width: `${selectedPlanet.mastery}%` }}
                />
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <FormattedText text={selectedPlanet.node.goal} />
              </div>

              {selectedPlanet.errorCount > 0 && (
                <div className="p-2.5 rounded border border-rose-300 dark:border-rose-700/70 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn
                      ? `${selectedPlanet.errorCount} unresolved mistakes logged in this sector.`
                      : `Đang có ${selectedPlanet.errorCount} lỗi sai cần ôn lại bằng thẻ SM-2.`}
                  </span>
                </div>
              )}

              {selectedPlanet.node.checkQuestions?.[0] && (
                <div className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {isEn ? 'Quick Recall Check' : 'Câu hỏi tự kiểm tra'}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">
                    <FormattedText text={selectedPlanet.node.checkQuestions[0]} />
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            {selectedPlanet && (
              <button
                type="button"
                onClick={() => handleWarpToLesson(selectedPlanet.node)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                {isEn ? 'Warp Into Interactive Lecture' : 'Dịch Chuyển Vào Bài Giảng'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => selectSubject('growth_hub')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              {isEn ? 'Open Error Notebook & SM-2' : 'Mở Sổ Lỗi & Thẻ SM-2'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
