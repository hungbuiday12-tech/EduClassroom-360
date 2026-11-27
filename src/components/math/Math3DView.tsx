import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';
import { StereoEffect } from 'three/addons/effects/StereoEffect.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Box,
  Compass,
  Sparkles,
  ArrowLeft,
  Play,
  Pause,
  Scissors,
  Camera,
  RotateCw,
} from 'lucide-react';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { useLanguage } from '../../context/LanguageContext';
import { MathFormula } from '../common/MathRenderer';
import { ViewportPortal } from '../common/ViewportPortal';
import {
  applyOffAxisProjection,
  HologramDisplayMode,
  resetOffAxisProjection,
  useHeadTrackedHologram
} from '../../hooks/useHeadTrackedHologram';
import { HologramModeControls } from '../common/HologramModeControls';
import { applySphericalOrbitDelta, subscribeRemoteCommand } from '../../lib/remoteControlBus';
import {
  createPostProcessingPipeline,
  PostProcessPipeline,
  createTroikaLabel,
  updateBillboardLabels,
  createCrispLine2,
  syncLine2Resolution,
  GPUParticlePool,
  OptimizedTrail,
} from '../../lib/three3DEnhancements';

export type Math3DMode =
  | 'oxyz_vector'
  | 'sphere_plane'
  | 'pyramid_section'
  | 'revolution_solid'
  | 'conic_sections_3d'
  | 'line_plane_oxyz'
  | 'integral_disks_3d'
  | 'circle_theorems_3d'
  | 'tangent_surface_3d'
  | 'probability_bell_3d'
  | 'geometric_transform_3d'
  | 'arithmetic_prism_3d'
  | 'solid_prism_nets_3d'
  | 'angle_thales_3d';

interface Math3DViewProps {
  initialMode?: Math3DMode;
  onBack?: () => void;
  embedded?: boolean;
  embeddedBadge?: string;
  allowedModes?: Math3DMode[];
  heightClass?: string;
  onOpenFull3D?: () => void;
}

export const Math3DView: React.FC<Math3DViewProps> = ({
  initialMode = 'oxyz_vector',
  onBack,
  embedded = false,
  embeddedBadge,
  allowedModes,
  heightClass = 'h-[340px]',
  onOpenFull3D
}) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);

  // Mode selection
  const [mode, setMode] = useState<Math3DMode>(initialMode);
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const [hologramMode, setHologramMode] = useState<HologramDisplayMode>('normal');
  const hologramModeRef = useRef<HologramDisplayMode>('normal');
  hologramModeRef.current = hologramMode;
  const { headOffsetRef, camStatus } = useHeadTrackedHologram(hologramMode);

  // Interactive parameters
  // Vector mode
  const [ux, setUx] = useState(2);
  const [uy, setUy] = useState(3);
  const [uz, setUz] = useState(1);
  const [vx, setVx] = useState(3);
  const [vy, setVy] = useState(1);
  const [vz, setVz] = useState(2);

  // Sphere-plane mode
  const [sphereRadius, setSphereRadius] = useState(3);
  const [planeDistance, setPlaneDistance] = useState(1.8);

  // Pyramid section mode
  const [cutHeightRatio, setCutHeightRatio] = useState(0.5);

  // Revolution solid mode
  const [revSegments, setRevSegments] = useState(32);
  const [revCurveType, setRevCurveType] = useState<'parabola' | 'sine' | 'cone'>('parabola');

  // Conic sections 3D mode (Plane cutting double cone)
  const [conicTiltDeg, setConicTiltDeg] = useState(25);
  const [conicOffsetY, setConicOffsetY] = useState(1.2);

  // Line & Plane in Oxyz mode
  const [lineDirX, setLineDirX] = useState(1);
  const [lineDirY, setLineDirY] = useState(1.5);
  const [lineDirZ, setLineDirZ] = useState(2);
  const [planeTiltDeg, setPlaneTiltDeg] = useState(15);

  // Integral Riemann disks 3D mode
  const [diskCount, setDiskCount] = useState(12);
  const [diskFuncType, setDiskFuncType] = useState<'sqrt' | 'linear' | 'parabola'>('sqrt');

  // Circle & Tangent Cone 3D mode
  const [circleR3D, setCircleR3D] = useState(2.2);
  const [extDist3D, setExtDist3D] = useState(4.2);
  const [secOffset3D, setSecOffset3D] = useState(1.1);

  // Tangent Surface 3D mode (Đạo hàm & Mặt phẳng tiếp diện)
  const [surfaceType, setSurfaceType] = useState<'paraboloid' | 'saddle' | 'wave'>('paraboloid');
  const [tanX0, setTanX0] = useState(1.0);
  const [tanY0, setTanY0] = useState(0.8);

  // Probability Bell 3D mode (Phân phối chuẩn & Biểu đồ cột 3D)
  const [bellMu, setBellMu] = useState(0);
  const [bellSigma, setBellSigma] = useState(1.1);

  // Geometric Transform 3D mode (Tịnh tiến · Phép quay · Vị tự trong không gian Oxyz)
  const [transType3D, setTransType3D] = useState<'translation' | 'rotation' | 'homothety'>('translation');
  const [transParam3D, setTransParam3D] = useState(1.5);

  // Arithmetic Prism 3D mode (Khối ƯCLN / BCNN Lớp 6-7)
  const [gcdA, setGcdA] = useState(6);
  const [gcdB, setGcdB] = useState(4);
  const [gcdC, setGcdC] = useState(4);

  // Solid Prism & Pyramid Nets 3D mode (Hình hộp · Lăng trụ · Chóp đều & Khai triển Lớp 7-8)
  const [solidKind, setSolidKind] = useState<'box' | 'prism' | 'pyramid'>('box');
  const [unfoldRatio, setUnfoldRatio] = useState(0.25);

  // Angle & Thales Similarity 3D mode (Góc song song · Tam giác · Định lý Thalès Lớp 7-8)
  const [thalesRatio3D, setThalesRatio3D] = useState(0.55);
  const [thalesAngleDeg, setThalesAngleDeg] = useState(58);

  // Animation & hardware cutaway state
  const [isAnimating, setIsAnimating] = useState(true);
  const [showCutaway, setShowCutaway] = useState(false);
  const [cutawayOffset, setCutawayOffset] = useState(0.15);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const isAnimatingRef = useRef<boolean>(true);
  isAnimatingRef.current = isAnimating;
  const autoOrbitRef = useRef<boolean>(false);
  autoOrbitRef.current = autoOrbit;

  // WebGL context safety
  const [contextLost, setContextLost] = useState(false);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pipelineRef = useRef<PostProcessPipeline | null>(null);
  const particlePoolRef = useRef<GPUParticlePool | null>(null);
  const trailRef = useRef<OptimizedTrail | null>(null);
  const mathTickRef = useRef<((dt: number, elapsed: number, camera: THREE.Camera) => void) | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const needsRenderRef = useRef<boolean>(true);
  const isSoftwareGlRef = useRef<boolean>(false);
  const camPresetFnRef = useRef<((preset: 'iso' | 'oxy' | 'oxz' | 'oyz') => void) | null>(null);
  const capturePngFnRef = useRef<(() => void) | null>(null);

  const { isRecording, recordSeconds: recSeconds, toggleRecording } = useCanvasRecorder(
    () => rendererRef.current?.domElement || null,
    `synapse-math3d-${mode}`
  );

  // Escape key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    isSoftwareGlRef.current = isSoftwareGl;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090e1c);
    scene.fog = new THREE.FogExp2(0x090e1c, 0.022);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 300),
      0.1,
      100
    );
    camera.position.set(7, 6, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true;
    if (!isSoftwareGl) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    rendererRef.current = renderer;

    // Procedural Studio IBL reflections for realistic glass & metallic highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 2;

    const markDirty = () => {
      needsRenderRef.current = true;
    };
    controls.addEventListener('change', markDirty);

    // Studio Lighting (Hemisphere + Warm Key + Cool Rim)
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.75);
    keyLight.position.set(6, 11, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.95);
    fillLight.position.set(-7, 4, -6);
    scene.add(fillLight);

    // Studio pedestal disc + glowing horizon collar + crisp grid
    const stageDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(8.2, 8.6, 0.08, 64),
      new THREE.MeshStandardMaterial({ color: 0x070c18, roughness: 0.68, metalness: 0.28 })
    );
    stageDisc.position.y = -0.055;
    stageDisc.receiveShadow = !isSoftwareGl;
    scene.add(stageDisc);

    const stageRim = new THREE.Mesh(
      new THREE.TorusGeometry(8.2, 0.028, 12, 72),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.6, roughness: 0.25, metalness: 0.7 })
    );
    stageRim.rotation.x = Math.PI / 2;
    stageRim.position.y = -0.012;
    scene.add(stageRim);

    const grid = new THREE.GridHelper(16, 16, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.008;
    scene.add(grid);

    // Group for dynamic interactive models
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;
    needsRenderRef.current = true;

    // Postprocessing pipeline (Bloom + SMAA on GPU) & bounded GPU Particle Pool / LOD Trail
    const initW = Math.max(1, container.clientWidth);
    const initH = Math.max(300, container.clientHeight);
    const pipeline = !isSoftwareGl
      ? createPostProcessingPipeline(renderer, scene, camera, {
          bloomIntensity: 0.42,
          luminanceThreshold: 0.78,
          enableSmaa: true,
        })
      : null;
    pipeline?.setSize(initW, initH);
    pipelineRef.current = pipeline;

    const particlePool = new GPUParticlePool(72, 0.048, 0xfacc15, 0xf59e0b);
    scene.add(particlePool.mesh);
    particlePoolRef.current = particlePool;

    const trail = new OptimizedTrail(64, 0xfacc15, 0.88);
    trail.line.visible = false;
    scene.add(trail.line);
    trailRef.current = trail;

    const anaglyphEffect = new AnaglyphEffect(renderer);
    anaglyphEffect.setSize(initW, initH);
    const stereoEffect = new StereoEffect(renderer);
    stereoEffect.setSize(initW, initH);
    let lastHolo: HologramDisplayMode = 'normal';
    const appliedHoloOffset = new THREE.Vector3();

    // Animation loop with smooth damping, bounded particle updates & GPU postprocessing
    let frameId = 0;
    let alive = true;
    let lastNow = performance.now();
    let mathElapsed = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (!alive) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      if (!alive) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;

      if (document.hidden) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      if (appliedHoloOffset.lengthSq() > 0) {
        camera.position.sub(appliedHoloOffset);
      }
      const moved = controls.update();
      const curHolo = hologramModeRef.current;
      const holoChanged = curHolo !== lastHolo;

      if (curHolo === 'head_cam' || curHolo === 'head_mouse') {
        applyOffAxisProjection(
          camera,
          headOffsetRef.current,
          11,
          3.6,
          controls.target,
          appliedHoloOffset
        );
      } else if (lastHolo === 'head_cam' || lastHolo === 'head_mouse' || appliedHoloOffset.lengthSq() > 0) {
        resetOffAxisProjection(camera, appliedHoloOffset);
      }

      if ((lastHolo === 'anaglyph' || lastHolo === 'vr_stereo') && holoChanged) {
        const w = container.clientWidth;
        const h = Math.max(container.clientHeight, 300);
        if (w > 0 && h > 0) {
          renderer.setRenderTarget(null);
          renderer.setScissorTest(false);
          renderer.setViewport(0, 0, w, h);
          renderer.setSize(w, h);
          pipeline?.setSize(w, h);
        }
      }
      lastHolo = curHolo;

      let activeSim = false;
      if (autoOrbitRef.current) {
        applySphericalOrbitDelta(
          camera,
          controls.target,
          dt * 0.42,
          0,
          0,
          controls.minDistance,
          controls.maxDistance
        );
        controls.update();
        activeSim = true;
      }
      if (isAnimatingRef.current && mathTickRef.current) {
        mathElapsed += dt;
        mathTickRef.current(dt, mathElapsed, camera);
        particlePool.update(dt, 0);
        activeSim = true;
      }

      if (needsRenderRef.current || moved || activeSim || curHolo !== 'normal' || holoChanged) {
        needsRenderRef.current = false;
        updateBillboardLabels(dynamicGroup, camera);
        const distToTarget = Math.max(2.5, camera.position.distanceTo(controls.target));
        if (curHolo === 'anaglyph') {
          anaglyphEffect.planeDistance = distToTarget;
          anaglyphEffect.eyeSep = distToTarget * 0.048;
          anaglyphEffect.render(scene, camera);
        } else if (curHolo === 'vr_stereo') {
          stereoEffect.setEyeSeparation(Math.max(0.05, distToTarget * 0.042));
          stereoEffect.render(scene, camera);
        } else if (!isSoftwareGl && pipeline) {
          pipeline.render(dt);
        } else {
          renderer.render(scene, camera);
        }
      }

      if (isSoftwareGl && activeSim) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };
    animate();

    // WebGL context loss/restore safety
    const canvasEl = renderer.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      needsRenderRef.current = true;
    };
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    // Resize handler + ResizeObserver
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      pipeline?.setSize(width, height);
      anaglyphEffect.setSize(width, height);
      stereoEffect.setSize(width, height);
      syncLine2Resolution(dynamicGroup, width, height);
      needsRenderRef.current = true;
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (resizeObserver) resizeObserver.observe(container);

    const unsubRemote = subscribeRemoteCommand((cmd) => {
      if (cmd.type === 'orbit') {
        applySphericalOrbitDelta(
          camera,
          controls.target,
          cmd.yawDelta,
          cmd.pitchDelta,
          cmd.zoomDelta,
          controls.minDistance,
          controls.maxDistance
        );
        controls.update();
        needsRenderRef.current = true;
      } else if (cmd.type === 'reset_view') {
        appliedHoloOffset.set(0, 0, 0);
        camera.position.set(7, 6, 8);
        controls.target.set(0, 0, 0);
        camera.updateProjectionMatrix();
        controls.update();
        needsRenderRef.current = true;
      } else if (cmd.type === 'toggle_play') {
        setIsAnimating((prev) => !prev);
      }
    });

    camPresetFnRef.current = (preset) => {
      appliedHoloOffset.set(0, 0, 0);
      if (preset === 'iso') {
        camera.position.set(7, 6, 8);
      } else if (preset === 'oxy') {
        camera.position.set(0.01, 11.2, 0.01);
      } else if (preset === 'oxz') {
        camera.position.set(0, 2.0, 11.5);
      } else {
        camera.position.set(11.5, 2.0, 0);
      }
      controls.target.set(0, 0, 0);
      camera.updateProjectionMatrix();
      controls.update();
      needsRenderRef.current = true;
    };

    capturePngFnRef.current = () => {
      updateBillboardLabels(dynamicGroup, camera);
      if (!isSoftwareGl && pipeline) {
        pipeline.render(0);
      } else {
        renderer.render(scene, camera);
      }
      captureCanvasPng(renderer.domElement, `synapse-math3d-${Date.now()}.png`);
    };

    return () => {
      alive = false;
      unsubRemote();
      camPresetFnRef.current = null;
      capturePngFnRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('change', markDirty);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      resizeObserver?.disconnect();
      controls.dispose();
      pipeline?.dispose();
      pipelineRef.current = null;
      particlePool.dispose();
      particlePoolRef.current = null;
      trail.dispose();
      trailRef.current = null;
      mathTickRef.current = null;
      anaglyphEffect.dispose();
      scene.traverse((obj: any) => {
        if (typeof obj.dispose === 'function' && obj.userData?.isTroikaLabel) {
          obj.dispose();
          return;
        }
        if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => typeof m?.dispose === 'function' && m.dispose());
          else if (typeof obj.material.dispose === 'function') obj.material.dispose();
        }
      });
      envTarget.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update dynamic 3D geometry when mode or params change
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;

    mathTickRef.current = null;
    trailRef.current?.clear();
    if (trailRef.current) trailRef.current.line.visible = false;

    // Clear previous geometries, materials & Troika text workers recursively to prevent GPU leaks
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((obj: any) => {
        if (typeof obj.dispose === 'function' && obj.userData?.isTroikaLabel) {
          obj.dispose();
          return;
        }
        if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => typeof m?.dispose === 'function' && m.dispose());
          } else if (typeof obj.material.dispose === 'function') {
            obj.material.dispose();
          }
        }
      });
    }

    const isSw = isSoftwareGlRef.current;
    const pool = particlePoolRef.current;
    const trail = trailRef.current;
    const addLabel = (
      text: string,
      x: number,
      y: number,
      z: number,
      color: number | string = 0xf8fafc,
      fontSize = 0.3
    ) => {
      const lbl = createTroikaLabel({
        text,
        position: [x, y, z],
        color,
        fontSize,
        onSync: () => {
          needsRenderRef.current = true;
        },
      });
      group.add(lbl);
      return lbl;
    };

    const addTubeBetween = (
      pA: THREE.Vector3,
      pB: THREE.Vector3,
      radius: number,
      mat: THREE.Material
    ) => {
      const dist = pA.distanceTo(pB);
      if (dist < 0.005) return;
      const geo = new THREE.CylinderGeometry(radius, radius, dist, 12);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.addVectors(pA, pB).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pB.clone().sub(pA).normalize());
      mesh.castShadow = !isSw;
      group.add(mesh);
    };

    // Helper to create 3D Arrow Vector
    const create3DArrow = (
      dir: THREE.Vector3,
      origin: THREE.Vector3,
      length: number,
      color: number,
      radius = 0.05
    ) => {
      const arrowGroup = new THREE.Group();
      if (length < 0.001) return arrowGroup;

      const normDir = dir.clone().normalize();
      const headLength = Math.min(0.5, length * 0.25);
      const shaftLength = Math.max(0.01, length - headLength);

      // Shaft (Cylinder)
      const shaftGeo = new THREE.CylinderGeometry(radius, radius, shaftLength, 16);
      shaftGeo.translate(0, shaftLength / 2, 0);
      const shaftMat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.22,
        metalness: 0.55,
        clearcoat: 0.75,
        clearcoatRoughness: 0.12
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.castShadow = !isSw;

      // Head (Cone)
      const headGeo = new THREE.ConeGeometry(radius * 2.25, headLength, 18);
      headGeo.translate(0, shaftLength + headLength / 2, 0);
      const headMat = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.16,
        roughness: 0.18,
        metalness: 0.65,
        clearcoat: 0.9
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.castShadow = !isSw;

      arrowGroup.add(shaft);
      arrowGroup.add(head);

      // Rotate arrow to align with direction (default cylinder is along Y)
      const up = new THREE.Vector3(0, 1, 0);
      arrowGroup.quaternion.setFromUnitVectors(up, normDir);
      arrowGroup.position.copy(origin);
      return arrowGroup;
    };

    // -------------------------------------------------------------
    // MODE 1: Oxyz & Vector 3D (Tọa độ & Tích có hướng)
    // -------------------------------------------------------------
    if (mode === 'oxyz_vector') {
      // Origin hub sphere
      const originHub = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 18, 18),
        new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.15, clearcoat: 0.8 })
      );
      group.add(originHub);

      // 3 Axes: Ox (Red), Oy (Green), Oz (Blue)
      const axisLength = 5;
      group.add(create3DArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLength, 0xef4444, 0.032));
      group.add(create3DArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLength, 0x10b981, 0.032));
      group.add(create3DArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLength, 0x3b82f6, 0.032));

      // Vector u (Amber)
      const uVec = new THREE.Vector3(ux, uz, uy); // Mapping math z to three.js y
      const uLen = uVec.length();
      if (uLen > 1e-4) {
        group.add(create3DArrow(uVec, new THREE.Vector3(0, 0, 0), uLen, 0xf59e0b, 0.062));
      }

      // Vector v (Cyan)
      const vVec = new THREE.Vector3(vx, vz, vy);
      const vLen = vVec.length();
      if (vLen > 1e-4) {
        group.add(create3DArrow(vVec, new THREE.Vector3(0, 0, 0), vLen, 0x06b6d4, 0.062));
      }

      // Cross Product w = u x v (Purple)
      const wVec = new THREE.Vector3().crossVectors(uVec, vVec);
      const wLen = wVec.length();
      if (wLen > 0.1) {
        group.add(create3DArrow(wVec, new THREE.Vector3(0, 0, 0), wLen, 0xa855f7, 0.072));

        // Parallelogram surface spanned by u and v
        const geom = new THREE.BufferGeometry();
        const p0 = new THREE.Vector3(0, 0, 0);
        const p1 = uVec;
        const p2 = uVec.clone().add(vVec);
        const p3 = vVec;
        const vertices = new Float32Array([
          p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z,
          p0.x, p0.y, p0.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z,
        ]);
        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geom.computeVertexNormals();
        const planeMat = new THREE.MeshPhysicalMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.42,
          roughness: 0.14,
          clearcoat: 0.85,
          side: THREE.DoubleSide,
        });
        group.add(new THREE.Mesh(geom, planeMat));

        const rimMat = new THREE.MeshStandardMaterial({
          color: 0xa5b4fc,
          emissive: 0x6366f1,
          emissiveIntensity: 0.45,
          roughness: 0.25
        });
        addTubeBetween(p1, p2, 0.022, rimMat);
        addTubeBetween(p3, p2, 0.022, rimMat);
      }

      // Crisp Line2 projections to ground Oxy plane & Troika 3D coordinate tags
      const dropU = createCrispLine2([[ux, uz, uy], [ux, 0, uy], [0, 0, 0]], {
        color: 0xf59e0b,
        linewidth: 2,
        dashed: true,
        transparent: true,
        opacity: 0.72,
      });
      const dropV = createCrispLine2([[vx, vz, vy], [vx, 0, vy], [0, 0, 0]], {
        color: 0x06b6d4,
        linewidth: 2,
        dashed: true,
        transparent: true,
        opacity: 0.72,
      });
      group.add(dropU, dropV);

      addLabel('O', -0.25, 0.25, -0.25, 0xf8fafc, 0.28);
      addLabel('X', axisLength + 0.35, 0.15, 0, 0xf87171, 0.32);
      addLabel('Z', 0, axisLength + 0.35, 0, 0x34d399, 0.32);
      addLabel('Y', 0, 0.15, axisLength + 0.35, 0x60a5fa, 0.32);
      addLabel(`u(${ux}, ${uy}, ${uz})`, ux, uz + 0.42, uy, 0xfbbf24, 0.28);
      addLabel(`v(${vx}, ${vy}, ${vz})`, vx, vz + 0.42, vy, 0x22d3ee, 0.28);
      if (wLen > 0.1) {
        addLabel('u × v', wVec.x, wVec.y + 0.45, wVec.z, 0xc084fc, 0.3);
      }

      const activeAxis = wLen > 0.1 ? wVec : uVec;
      const pulseOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xa855f7, emissiveIntensity: 1.1 })
      );
      group.add(pulseOrb);

      let emitCd = 0;
      mathTickRef.current = (dt, elapsed, cam) => {
        const s = (elapsed * 0.45) % 1;
        pulseOrb.position.set(activeAxis.x * s, activeAxis.y * s, activeAxis.z * s);
        trail?.pushAndRender(pulseOrb.position.x, pulseOrb.position.y, pulseOrb.position.z, cam, 0.01, 28);
        emitCd += dt;
        if (emitCd > 0.08 && pool) {
          emitCd = 0;
          pool.spawn(
            pulseOrb.position.x,
            pulseOrb.position.y,
            pulseOrb.position.z,
            (Math.random() - 0.5) * 0.4,
            0.25 + Math.random() * 0.25,
            (Math.random() - 0.5) * 0.4,
            0.65,
            0.7,
            wLen > 0.1 ? 0xc084fc : 0xfbbf24
          );
        }
      };
    }

    // -------------------------------------------------------------
    // MODE 2: Mặt Cầu & Mặt Phẳng Thiết Diện 3D
    // -------------------------------------------------------------
    else if (mode === 'sphere_plane') {
      const cutClip = showCutaway ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), cutawayOffset)] : [];
      // Optical Glass Sphere
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 36);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.06,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        transparent: true,
        opacity: isSw ? 0.34 : 0.78,
        transmission: isSw ? 0 : 0.72,
        ior: 1.48,
        thickness: 0.75,
        depthWrite: false,
        clippingPlanes: cutClip,
        side: showCutaway ? THREE.DoubleSide : THREE.FrontSide,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);

      // Sphere wireframe cage + glowing equatorial torus
      const wireGeo = new THREE.WireframeGeometry(sphereGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.16 });
      group.add(new THREE.LineSegments(wireGeo, wireMat));

      const eqTorus = new THREE.Mesh(
        new THREE.TorusGeometry(sphereRadius, 0.022, 12, 64),
        new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x0284c7, emissiveIntensity: 0.4, transparent: true, opacity: 0.65 })
      );
      eqTorus.rotation.x = Math.PI / 2;
      group.add(eqTorus);

      // Center Point I
      const centerGeo = new THREE.SphereGeometry(0.15, 20, 20);
      const centerMat = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.55, roughness: 0.18, clearcoat: 0.8 });
      group.add(new THREE.Mesh(centerGeo, centerMat));

      // Cutting Plane
      const planeGeo = new THREE.PlaneGeometry(sphereRadius * 2.8, sphereRadius * 2.8);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.36,
        roughness: 0.12,
        clearcoat: 0.85,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI / 2;
      planeMesh.position.y = planeDistance;
      planeMesh.receiveShadow = !isSw;
      group.add(planeMesh);

      addLabel('I(0,0,0)', -0.35, -0.35, 0.35, 0xfda4af, 0.28);
      addLabel(`R = ${sphereRadius.toFixed(1)}`, sphereRadius * 0.72, 0.35, sphereRadius * 0.6, 0x7dd3fc, 0.26);

      // If plane intersects sphere (d < R)
      if (planeDistance < sphereRadius) {
        const cutCircleRadius = Math.sqrt(sphereRadius * sphereRadius - planeDistance * planeDistance);
        const torusGeo = new THREE.TorusGeometry(cutCircleRadius, 0.048, 16, 64);
        const torusMat = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.65, roughness: 0.16, clearcoat: 0.9 });
        const torusMesh = new THREE.Mesh(torusGeo, torusMat);
        torusMesh.rotation.x = Math.PI / 2;
        torusMesh.position.y = planeDistance + 0.01;
        group.add(torusMesh);

        // Distance drop line IH (Crisp Line2 + cylinder)
        const dropLineGeo = new THREE.CylinderGeometry(0.036, 0.036, Math.max(0.02, planeDistance), 14);
        dropLineGeo.translate(0, planeDistance / 2, 0);
        const dropLineMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, emissive: 0x94a3b8, emissiveIntensity: 0.35, clearcoat: 0.5 });
        group.add(new THREE.Mesh(dropLineGeo, dropLineMat));

        const footDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
        );
        footDot.position.y = planeDistance;
        group.add(footDot);

        const radiusLine = createCrispLine2(
          [[0, planeDistance + 0.02, 0], [cutCircleRadius, planeDistance + 0.02, 0]],
          { color: 0xfef08a, linewidth: 2.8 }
        );
        group.add(radiusLine);

        addLabel(`H (d=${planeDistance.toFixed(1)})`, 0.45, planeDistance + 0.28, 0, 0xfef08a, 0.26);
        addLabel(`r = ${cutCircleRadius.toFixed(2)}`, cutCircleRadius * 0.55, planeDistance + 0.28, 0.25, 0x34d399, 0.28);

        const tracerOrb = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 14, 14),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
        );
        group.add(tracerOrb);

        mathTickRef.current = (_dt, elapsed, cam) => {
          const ang = elapsed * 1.4;
          const tx = Math.cos(ang) * cutCircleRadius;
          const tz = Math.sin(ang) * cutCircleRadius;
          tracerOrb.position.set(tx, planeDistance + 0.02, tz);
          eqTorus.rotation.z = elapsed * 0.22;
          trail?.pushAndRender(tx, planeDistance + 0.02, tz, cam, 0.015, 30);
        };
      } else {
        mathTickRef.current = (_dt, elapsed) => {
          eqTorus.rotation.z = elapsed * 0.25;
        };
      }
    }

    // -------------------------------------------------------------
    // MODE 3: Khối Chóp Tứ Giác & Mặt Cắt Thiết Diện 3D
    // -------------------------------------------------------------
    else if (mode === 'pyramid_section') {
      const H = 4.5;
      const baseW = 3.5;
      const baseD = 3.5;

      const S = new THREE.Vector3(0, H, 0);
      const A = new THREE.Vector3(-baseW / 2, 0, -baseD / 2);
      const B = new THREE.Vector3(baseW / 2, 0, -baseD / 2);
      const C = new THREE.Vector3(baseW / 2, 0, baseD / 2);
      const D = new THREE.Vector3(-baseW / 2, 0, baseD / 2);

      // Draw crisp cylindrical pyramid edges & glowing vertex spheres
      const strutMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.78,
        roughness: 0.22,
        clearcoat: 0.7
      });
      [[A, B], [B, C], [C, D], [D, A], [S, A], [S, B], [S, C], [S, D]].forEach(([p1, p2]) => {
        addTubeBetween(p1, p2, 0.03, strutMat);
      });
      const vMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 });
      const vGeo = new THREE.SphereGeometry(0.075, 14, 14);
      [S, A, B, C, D].forEach((pt) => {
        const vm = new THREE.Mesh(vGeo, vMat);
        vm.position.copy(pt);
        group.add(vm);
      });

      // Crystal semi-transparent pyramid faces
      const facesGeo = new THREE.BufferGeometry();
      const faceVertices = new Float32Array([
        S.x, S.y, S.z, A.x, A.y, A.z, B.x, B.y, B.z,
        S.x, S.y, S.z, B.x, B.y, B.z, C.x, C.y, C.z,
        S.x, S.y, S.z, C.x, C.y, C.z, D.x, D.y, D.z,
        S.x, S.y, S.z, D.x, D.y, D.z, A.x, A.y, A.z,
      ]);
      facesGeo.setAttribute('position', new THREE.BufferAttribute(faceVertices, 3));
      facesGeo.computeVertexNormals();
      const facesMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.08,
        clearcoat: 1.0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(facesGeo, facesMat));

      // Dynamic Cutting Section (Thiết diện tại tỉ lệ k)
      const k = cutHeightRatio;
      const A_prime = A.clone().lerp(S, 1 - k);
      const B_prime = B.clone().lerp(S, 1 - k);
      const C_prime = C.clone().lerp(S, 1 - k);
      const D_prime = D.clone().lerp(S, 1 - k);

      const secGeo = new THREE.BufferGeometry();
      const secVerts = new Float32Array([
        A_prime.x, A_prime.y, A_prime.z, B_prime.x, B_prime.y, B_prime.z, C_prime.x, C_prime.y, C_prime.z,
        A_prime.x, A_prime.y, A_prime.z, C_prime.x, C_prime.y, C_prime.z, D_prime.x, D_prime.y, D_prime.z,
      ]);
      secGeo.setAttribute('position', new THREE.BufferAttribute(secVerts, 3));
      secGeo.computeVertexNormals();
      const secMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        roughness: 0.14,
        clearcoat: 0.9
      });
      const secMesh = new THREE.Mesh(secGeo, secMat);
      secMesh.castShadow = !isSw;
      group.add(secMesh);

      const secRimMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.65,
        roughness: 0.2
      });
      [[A_prime, B_prime], [B_prime, C_prime], [C_prime, D_prime], [D_prime, A_prime]].forEach(([p1, p2]) => {
        addTubeBetween(p1, p2, 0.036, secRimMat);
      });

      // Height SO Line2 + Troika vertex labels
      const altLine = createCrispLine2([S, new THREE.Vector3(0, 0, 0)], {
        color: 0x38bdf8,
        linewidth: 2.2,
        dashed: true,
        transparent: true,
        opacity: 0.78,
      });
      group.add(altLine);

      addLabel('S', S.x, S.y + 0.34, S.z, 0xf8fafc, 0.32);
      addLabel('A', A.x - 0.25, 0.2, A.z - 0.25, 0x93c5fd, 0.28);
      addLabel('B', B.x + 0.25, 0.2, B.z - 0.25, 0x93c5fd, 0.28);
      addLabel('C', C.x + 0.25, 0.2, C.z + 0.25, 0x93c5fd, 0.28);
      addLabel('D', D.x - 0.25, 0.2, D.z + 0.25, 0x93c5fd, 0.28);
      addLabel(`Thiết diện k=${k.toFixed(2)}`, C_prime.x + 0.7, C_prime.y + 0.2, C_prime.z, 0xfef08a, 0.26);

      const secCorners = [A_prime, B_prime, C_prime, D_prime];
      const secTracer = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
      );
      group.add(secTracer);
      mathTickRef.current = (_dt, elapsed, cam) => {
        const p = (elapsed * 0.9) % 4;
        const idx = Math.floor(p);
        const frac = p - idx;
        secTracer.position.lerpVectors(secCorners[idx], secCorners[(idx + 1) % 4], frac);
        secMat.emissiveIntensity = 0.22 + 0.14 * Math.sin(elapsed * 2.5);
        trail?.pushAndRender(secTracer.position.x, secTracer.position.y, secTracer.position.z, cam, 0.015, 28);
      };
    }

    // -------------------------------------------------------------
    // MODE 4: Khối Tròn Xoay & Tích Phân Thể Tích 3D
    // -------------------------------------------------------------
    else if (mode === 'revolution_solid') {
      const cutClip = showCutaway ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), cutawayOffset)] : [];
      const points: THREE.Vector2[] = [];
      const profilePts: THREE.Vector3[] = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * 4;
        let y = 1;
        if (revCurveType === 'parabola') {
          y = 0.5 + 0.15 * x * x;
        } else if (revCurveType === 'sine') {
          y = 1.2 + 0.5 * Math.sin(x * 1.5);
        } else {
          y = 0.4 + 0.4 * x;
        }
        points.push(new THREE.Vector2(y, x));
        profilePts.push(new THREE.Vector3(x - 2, 2.0 + y, 0.04));
      }

      const latheGeo = new THREE.LatheGeometry(points, revSegments);
      latheGeo.center();
      const latheMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.72,
        roughness: 0.14,
        metalness: 0.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
        clippingPlanes: cutClip,
      });
      const latheMesh = new THREE.Mesh(latheGeo, latheMat);
      latheMesh.rotation.z = Math.PI / 2;
      latheMesh.position.y = 2.0;
      latheMesh.castShadow = !isSw;
      group.add(latheMesh);

      const latheWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(latheGeo),
        new THREE.LineBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.22 })
      );
      latheWire.rotation.z = Math.PI / 2;
      latheWire.position.y = 2.0;
      group.add(latheWire);

      // Crisp Line2 generating curve highlight
      const genCurveLine = createCrispLine2(profilePts, { color: 0xfacc15, linewidth: 3.2 });
      group.add(genCurveLine);

      // Central Axis shaft + bearing collars
      const axisGeo = new THREE.CylinderGeometry(0.045, 0.045, 6.2, 14);
      axisGeo.rotateZ(Math.PI / 2);
      const axisMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.35, metalness: 0.65, roughness: 0.25 });
      const axisMesh = new THREE.Mesh(axisGeo, axisMat);
      axisMesh.position.y = 2.0;
      group.add(axisMesh);

      [-2.8, 2.8].forEach((bx) => {
        const bearing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.16, 18),
          new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.18, clearcoat: 0.8 })
        );
        bearing.rotation.z = Math.PI / 2;
        bearing.position.set(bx, 2.0, 0);
        group.add(bearing);
      });

      addLabel('Trục Ox', 3.4, 2.0, 0, 0xf87171, 0.28);
      addLabel('y = f(x)', 0, 3.65, 0, 0xfef08a, 0.28);
      addLabel('V = π ∫ [f(x)]² dx', 0, 0.35, 1.8, 0x34d399, 0.3);

      let emitCd = 0;
      mathTickRef.current = (dt, elapsed) => {
        latheMesh.rotation.x = elapsed * 0.42;
        latheWire.rotation.x = elapsed * 0.42;
        emitCd += dt;
        if (emitCd > 0.09 && pool) {
          emitCd = 0;
          const idx = Math.floor(Math.random() * profilePts.length);
          const pt = profilePts[idx];
          const r = pt.y - 2.0;
          const a = Math.random() * Math.PI * 2;
          pool.spawn(
            pt.x,
            2.0 + Math.cos(a) * r,
            Math.sin(a) * r,
            0,
            -Math.sin(a) * 0.4,
            Math.cos(a) * 0.4,
            0.75,
            0.65,
            0x34d399
          );
        }
      };
    }

    // -------------------------------------------------------------
    // MODE 5: Ba Đường Conic Từ Thiết Diện Mặt Nón Đôi (Lớp 10)
    // -------------------------------------------------------------
    else if (mode === 'conic_sections_3d') {
      const cutClip = showCutaway ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), cutawayOffset)] : [];
      const coneH = 3.2;
      const coneR = 2.4;
      const coneMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.28,
        roughness: 0.1,
        metalness: 0.15,
        clearcoat: 1.0,
        depthWrite: false,
        side: THREE.DoubleSide,
        clippingPlanes: cutClip,
      });

      const upperGeo = new THREE.ConeGeometry(coneR, coneH, 48, 1, true);
      upperGeo.rotateX(Math.PI);
      upperGeo.translate(0, coneH / 2, 0);
      group.add(new THREE.Mesh(upperGeo, coneMat));

      const lowerGeo = new THREE.ConeGeometry(coneR, coneH, 48, 1, true);
      lowerGeo.translate(0, -coneH / 2, 0);
      group.add(new THREE.Mesh(lowerGeo, coneMat));

      // Glowing rim rings on cone mouths + apex orb
      const coneRimMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x2563eb, emissiveIntensity: 0.45, metalness: 0.6, roughness: 0.2 });
      [coneH, -coneH].forEach((ry) => {
        const cRim = new THREE.Mesh(new THREE.TorusGeometry(coneR, 0.032, 12, 64), coneRimMat);
        cRim.rotation.x = Math.PI / 2;
        cRim.position.y = ry;
        group.add(cRim);
      });
      const apexOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0x38bdf8, emissiveIntensity: 0.6 })
      );
      group.add(apexOrb);

      const wireUpper = new THREE.LineSegments(
        new THREE.WireframeGeometry(upperGeo),
        new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18 })
      );
      const wireLower = new THREE.LineSegments(
        new THREE.WireframeGeometry(lowerGeo),
        new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18 })
      );
      group.add(wireUpper, wireLower);

      // Tilted cutting plane
      const tiltRad = (conicTiltDeg * Math.PI) / 180;
      const planeGeo = new THREE.PlaneGeometry(7.2, 7.2);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.34,
        roughness: 0.14,
        clearcoat: 0.85,
        side: THREE.DoubleSide
      });
      const cutPlane = new THREE.Mesh(planeGeo, planeMat);
      cutPlane.rotation.x = Math.PI / 2 - tiltRad;
      cutPlane.position.set(0, conicOffsetY, 0);
      group.add(cutPlane);

      const slopeK = coneR / coneH;
      const tanTilt = Math.tan(tiltRad);
      const segs = 120;
      const ptsUpper: THREE.Vector3[] = [];
      const ptsLower: THREE.Vector3[] = [];

      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const denomUp = 1 + slopeK * sinT * tanTilt;
        if (Math.abs(denomUp) > 0.08) {
          const yUp = conicOffsetY / denomUp;
          if (yUp >= 0 && yUp <= coneH) {
            const rUp = slopeK * yUp;
            ptsUpper.push(new THREE.Vector3(rUp * cosT, yUp, rUp * sinT));
          }
        }
        const denomLo = 1 - slopeK * sinT * tanTilt;
        if (Math.abs(denomLo) > 0.08) {
          const yLo = conicOffsetY / denomLo;
          if (yLo <= 0 && yLo >= -coneH) {
            const rLo = -slopeK * yLo;
            ptsLower.push(new THREE.Vector3(rLo * cosT, yLo, rLo * sinT));
          }
        }
      }

      const drawCurveSegs = (pts: THREE.Vector3[], colorHex: number) => {
        if (pts.length < 4) return;
        const segments: THREE.Vector3[][] = [];
        let cur: THREE.Vector3[] = [pts[0]];
        for (let i = 1; i < pts.length; i++) {
          if (pts[i].distanceTo(pts[i - 1]) < 1.1) {
            cur.push(pts[i]);
          } else {
            if (cur.length >= 4) segments.push(cur);
            cur = [pts[i]];
          }
        }
        if (cur.length >= 4) segments.push(cur);
        const tubeMat = new THREE.MeshPhysicalMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.65,
          roughness: 0.18,
          metalness: 0.45,
          clearcoat: 0.9
        });
        segments.forEach((seg) => {
          const curve = new THREE.CatmullRomCurve3(seg);
          const tubeGeo = new THREE.TubeGeometry(curve, Math.min(96, seg.length * 2), 0.048, 12, false);
          group.add(new THREE.Mesh(tubeGeo, tubeMat));
        });
      };
      drawCurveSegs(ptsUpper, 0xfacc15);
      drawCurveSegs(ptsLower, 0xf97316);

      const conicName =
        conicTiltDeg === 0
          ? 'Đường Tròn'
          : conicTiltDeg < 52
          ? 'Đường Elip'
          : conicTiltDeg <= 55
          ? 'Đường Parabol'
          : 'Hypebol 2 nhánh';
      addLabel('Đỉnh O', -0.45, 0.25, 0.3, 0xf8fafc, 0.26);
      addLabel(`${conicName} (α=${conicTiltDeg}°)`, 2.2, conicOffsetY + 0.45, 0, 0xfef08a, 0.28);

      const trackPts = ptsUpper.length >= 4 ? ptsUpper : ptsLower;
      if (trackPts.length >= 4) {
        const conicTracer = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
        );
        group.add(conicTracer);
        mathTickRef.current = (_dt, elapsed, cam) => {
          const idx = Math.floor(((elapsed * 0.35) % 1) * trackPts.length);
          const p = trackPts[idx];
          conicTracer.position.copy(p);
          trail?.pushAndRender(p.x, p.y, p.z, cam, 0.015, 28);
        };
      }
    }

    // -------------------------------------------------------------
    // MODE 6: Đường Thẳng (d) & Mặt Phẳng (P) trong Oxyz (Lớp 12)
    // -------------------------------------------------------------
    else if (mode === 'line_plane_oxyz') {
      const axisLen = 4.5;
      group.add(create3DArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLen, 0xef4444, 0.028));
      group.add(create3DArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLen, 0x10b981, 0.028));
      group.add(create3DArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLen, 0x3b82f6, 0.028));

      const tiltRad = (planeTiltDeg * Math.PI) / 180;
      const planeGeo = new THREE.PlaneGeometry(7.5, 7.5);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.36,
        roughness: 0.14,
        clearcoat: 0.85,
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI / 2 - tiltRad;
      planeMesh.position.y = 0.8;
      planeMesh.receiveShadow = !isSw;
      group.add(planeMesh);

      // Normal vector n of plane (P)
      const normalVec = new THREE.Vector3(0, Math.cos(tiltRad), Math.sin(tiltRad)).normalize();
      group.add(create3DArrow(normalVec, new THREE.Vector3(0, 0.8, 0), 2.2, 0xf43f5e, 0.058));

      // Line (d) with direction u = (lineDirX, lineDirZ, lineDirY) rendered as glowing cylinder ray
      const rawU = new THREE.Vector3(lineDirX, lineDirZ, lineDirY);
      const uVec = rawU.lengthSq() > 1e-6 ? rawU.normalize() : new THREE.Vector3(1, 0, 0);
      const basePt = new THREE.Vector3(-0.6, 1.4, -0.5);
      const pStart = basePt.clone().addScaledVector(uVec, -4.5);
      const pEnd = basePt.clone().addScaledVector(uVec, 4.5);
      addTubeBetween(
        pStart,
        pEnd,
        0.028,
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.75, roughness: 0.2 })
      );

      // Direction vector arrow u from basePt
      group.add(create3DArrow(uVec, basePt, 2.0, 0xf59e0b, 0.062));

      // Intersection point with plane + glowing target halo
      const denom = uVec.dot(normalVec);
      let hitPtWorld: THREE.Vector3 | null = null;
      if (Math.abs(denom) > 0.02) {
        const planeOrigin = new THREE.Vector3(0, 0.8, 0);
        const tHit = planeOrigin.clone().sub(basePt).dot(normalVec) / denom;
        const hitPt = basePt.clone().addScaledVector(uVec, tHit);
        if (hitPt.length() < 8) {
          hitPtWorld = hitPt;
          const hitMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 20, 20),
            new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, clearcoat: 0.9 })
          );
          hitMesh.position.copy(hitPt);
          group.add(hitMesh);

          const haloRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.28, 0.025, 12, 32),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.8 })
          );
          haloRing.position.copy(hitPt);
          haloRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVec);
          group.add(haloRing);
          addLabel('Giao điểm I', hitPt.x, hitPt.y + 0.36, hitPt.z, 0x38bdf8, 0.28);
        }
      }

      addLabel('(P)', 3.1, 0.95, 2.8, 0x34d399, 0.3);
      addLabel('n⃗', normalVec.x * 2.25, 0.8 + normalVec.y * 2.25 + 0.28, normalVec.z * 2.25, 0xfda4af, 0.3);
      addLabel('u⃗', basePt.x + uVec.x * 2.1, basePt.y + uVec.y * 2.1 + 0.28, basePt.z + uVec.z * 2.1, 0xfbbf24, 0.3);
      addLabel('(d)', pEnd.x, pEnd.y + 0.32, pEnd.z, 0xfef08a, 0.28);

      const lineRider = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
      );
      group.add(lineRider);
      let prevS = 0;
      mathTickRef.current = (_dt, elapsed, cam) => {
        const s = (elapsed * 0.32) % 1;
        if (s < prevS) trail?.clear();
        prevS = s;
        lineRider.position.lerpVectors(pStart, pEnd, s);
        trail?.pushAndRender(lineRider.position.x, lineRider.position.y, lineRider.position.z, cam, 0.015, 28);
        if (hitPtWorld && pool && lineRider.position.distanceTo(hitPtWorld) < 0.25 && Math.random() < 0.45) {
          pool.spawn(
            hitPtWorld.x,
            hitPtWorld.y,
            hitPtWorld.z,
            (Math.random() - 0.5) * 1.1,
            0.5 + Math.random() * 0.5,
            (Math.random() - 0.5) * 1.1,
            0.65,
            0.8,
            0x38bdf8
          );
        }
      };
    }

    // -------------------------------------------------------------
    // MODE 7: Tích Phân Đĩa Trụ Riemann V = π∫[f(x)]²dx (Lớp 12)
    // -------------------------------------------------------------
    else if (mode === 'integral_disks_3d') {
      const lengthX = 4.0;
      const dx = lengthX / diskCount;
      const evalR = (x: number) => {
        if (diskFuncType === 'sqrt') return 0.4 + 0.85 * Math.sqrt(Math.max(0, x));
        if (diskFuncType === 'linear') return 0.35 + 0.45 * x;
        return 0.4 + 0.14 * x * x;
      };

      const disks: THREE.Mesh[] = [];
      const envProfile: THREE.Vector3[] = [];
      for (let i = 0; i < diskCount; i++) {
        const xMid = (i + 0.5) * dx;
        const r = evalR(xMid);
        const diskGeo = new THREE.CylinderGeometry(r, r, dx * 0.94, 36);
        diskGeo.rotateZ(Math.PI / 2);
        const hueColor = new THREE.Color().setHSL(0.42 + (i / Math.max(1, diskCount)) * 0.16, 0.8, 0.5);
        const diskMat = new THREE.MeshPhysicalMaterial({
          color: hueColor,
          transparent: true,
          opacity: 0.74,
          roughness: 0.16,
          metalness: 0.25,
          clearcoat: 0.9
        });
        const mesh = new THREE.Mesh(diskGeo, diskMat);
        mesh.position.set(xMid - lengthX / 2, 1.8, 0);
        mesh.castShadow = !isSw;
        group.add(mesh);
        disks.push(mesh);
      }

      const envPts: THREE.Vector2[] = [];
      for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * lengthX;
        const rx = evalR(x);
        envPts.push(new THREE.Vector2(rx, x - lengthX / 2));
        envProfile.push(new THREE.Vector3(x - lengthX / 2, 1.8 + rx, 0));
      }
      const envGeo = new THREE.LatheGeometry(envPts, 36);
      envGeo.rotateZ(-Math.PI / 2);
      const envWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(envGeo),
        new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.24 })
      );
      envWire.position.y = 1.8;
      group.add(envWire);

      group.add(createCrispLine2(envProfile, { color: 0xfacc15, linewidth: 2.8 }));

      const axGeo = new THREE.CylinderGeometry(0.04, 0.04, 5.4, 12);
      axGeo.rotateZ(Math.PI / 2);
      const axMesh = new THREE.Mesh(
        axGeo,
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.35, metalness: 0.65 })
      );
      axMesh.position.y = 1.8;
      group.add(axMesh);

      addLabel(`n = ${diskCount} lát đĩa`, 0, 3.8, 0, 0x34d399, 0.28);
      addLabel(`Δx = ${dx.toFixed(2)}`, 0, 0.35, 1.4, 0xfef08a, 0.26);

      mathTickRef.current = (_dt, elapsed) => {
        const sweepIdx = (elapsed * 3.2) % disks.length;
        disks.forEach((d, idx) => {
          const dist = Math.abs(idx - sweepIdx);
          const pulse = dist < 1.2 ? 1.0 + (1.2 - dist) * 0.05 : 1.0;
          d.scale.set(1, pulse, pulse);
        });
        envWire.rotation.x = elapsed * 0.22;
      };
    }

    // -------------------------------------------------------------
    // MODE 8: Đường tròn, Tiếp tuyến & Nón Tiếp Tuyến 3D
    // -------------------------------------------------------------
    else if (mode === 'circle_theorems_3d') {
      const R = circleR3D;
      const om = Math.max(R + 0.35, extDist3D);
      const center = new THREE.Vector3(0, 2.2, 0);

      // Crystal Glass Sphere (O; R) with optional cutaway
      const cutClip = showCutaway ? [new THREE.Plane(new THREE.Vector3(0, 0, -1), cutawayOffset)] : [];
      const spGeo = new THREE.SphereGeometry(R, 40, 32);
      const spMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: isSw ? 0.32 : 0.72,
        transmission: isSw ? 0 : 0.65,
        ior: 1.45,
        thickness: 0.55,
        roughness: 0.08,
        clearcoat: 1.0,
        depthWrite: false,
        clippingPlanes: cutClip,
        side: showCutaway ? THREE.DoubleSide : THREE.FrontSide,
      });
      const spMesh = new THREE.Mesh(spGeo, spMat);
      spMesh.position.copy(center);
      group.add(spMesh);

      // Equator Great Circle (Torus tube)
      const eqTorus = new THREE.Mesh(
        new THREE.TorusGeometry(R, 0.026, 12, 64),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.55, roughness: 0.2 })
      );
      eqTorus.rotation.x = Math.PI / 2;
      eqTorus.position.copy(center);
      group.add(eqTorus);

      // Small circle section plane at y = center.y + secOffset3D
      const dSec = Math.max(-R + 0.05, Math.min(R - 0.05, secOffset3D));
      const rSec = Math.sqrt(Math.max(0.01, R * R - dSec * dSec));
      const secGeo = new THREE.CircleGeometry(rSec, 48);
      secGeo.rotateX(-Math.PI / 2);
      const secMesh = new THREE.Mesh(
        secGeo,
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, transparent: true, opacity: 0.45, clearcoat: 0.75, side: THREE.DoubleSide })
      );
      secMesh.position.set(center.x, center.y + dSec, center.z);
      group.add(secMesh);

      // External Point M on +X axis
      const MPos = new THREE.Vector3(om, center.y, 0);
      const mSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 20, 20),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.55, clearcoat: 0.85 })
      );
      mSphere.position.copy(MPos);
      group.add(mSphere);

      // Center O marker and OM tube axis
      const oSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.5 })
      );
      oSphere.position.copy(center);
      group.add(oSphere);
      addTubeBetween(center, MPos, 0.022, new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.4 }));

      // Polar circle of tangency: xH = R^2 / OM, rPolar = R * sqrt(1 - (R/OM)^2)
      const xH = (R * R) / om;
      const rPolar = Math.sqrt(Math.max(0.01, R * R - xH * xH));
      const polarRing = new THREE.Mesh(
        new THREE.TorusGeometry(rPolar, 0.03, 12, 64),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.65, roughness: 0.2 })
      );
      polarRing.rotation.y = Math.PI / 2;
      polarRing.position.set(xH, center.y, 0);
      group.add(polarRing);

      // Enveloping tangent cone surface from M to polar tangent circle
      const coneHeight = om - xH;
      const coneGeo = new THREE.ConeGeometry(rPolar, coneHeight, 40, 1, true);
      coneGeo.rotateZ(-Math.PI / 2);
      const coneMat = new THREE.MeshPhysicalMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.22,
        roughness: 0.12,
        clearcoat: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(xH + coneHeight / 2, center.y, 0);
      group.add(coneMesh);

      const tanRayMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 0.4 });
      const perpRayMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x059669, emissiveIntensity: 0.4 });
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
        const TPos = new THREE.Vector3(xH, center.y + rPolar * Math.cos(ang), rPolar * Math.sin(ang));
        const tDot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.5 }));
        tDot.position.copy(TPos);
        group.add(tDot);
        addTubeBetween(MPos, TPos, 0.02, tanRayMat);
        addTubeBetween(center, TPos, 0.02, perpRayMat);
      });

      addLabel('O', center.x - 0.25, center.y + 0.28, 0, 0xfda4af, 0.28);
      addLabel('M', MPos.x + 0.28, MPos.y + 0.28, 0, 0xfbbf24, 0.3);
      addLabel('T₁', xH, center.y + rPolar + 0.28, 0, 0xf472b6, 0.26);
      addLabel(`r = ${rSec.toFixed(2)}`, center.x, center.y + dSec + 0.25, rSec * 0.65, 0x34d399, 0.26);

      const tanOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 })
      );
      group.add(tanOrb);
      mathTickRef.current = (_dt, elapsed, cam) => {
        const ang = elapsed * 1.45;
        const ty = center.y + rPolar * Math.cos(ang);
        const tz = rPolar * Math.sin(ang);
        tanOrb.position.set(xH, ty, tz);
        trail?.pushAndRender(xH, ty, tz, cam, 0.015, 28);
      };
    }

    // -------------------------------------------------------------
    // MODE 9: Bề Mặt Đạo Hàm & Mặt Phẳng Tiếp Diện 3D
    // -------------------------------------------------------------
    else if (mode === 'tangent_surface_3d') {
      const evalZ = (x: number, y: number) => {
        if (surfaceType === 'paraboloid') return 0.22 * (x * x + y * y) + 0.4;
        if (surfaceType === 'saddle') return 0.24 * (x * x - y * y) + 1.8;
        return 0.85 * Math.cos(0.9 * x) * Math.sin(0.9 * y) + 1.6;
      };
      const evalGrad = (x: number, y: number): [number, number] => {
        const h = 0.002;
        const fx = (evalZ(x + h, y) - evalZ(x - h, y)) / (2 * h);
        const fy = (evalZ(x, y + h) - evalZ(x, y - h)) / (2 * h);
        return [fx, fy];
      };

      const size = 5.4;
      const segs = 48;
      const surfGeo = new THREE.PlaneGeometry(size, size, segs, segs);
      surfGeo.rotateX(-Math.PI / 2);
      const posAttr = surfGeo.attributes.position as THREE.BufferAttribute;
      const colors: number[] = [];
      const colLow = new THREE.Color(0x0ea5e9);
      const colMid = new THREE.Color(0x6366f1);
      const colHigh = new THREE.Color(0xf43f5e);

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const zThree = posAttr.getZ(i);
        const yVal = evalZ(x, zThree);
        posAttr.setY(i, yVal);
        const tNorm = Math.max(0, Math.min(1, (yVal - 0.3) / 3.0));
        const c = tNorm < 0.5 ? colLow.clone().lerp(colMid, tNorm * 2) : colMid.clone().lerp(colHigh, (tNorm - 0.5) * 2);
        colors.push(c.r, c.g, c.b);
      }
      surfGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      surfGeo.computeVertexNormals();

      const surfMat = new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.18,
        metalness: 0.18,
        clearcoat: 0.85,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const surfMesh = new THREE.Mesh(surfGeo, surfMat);
      surfMesh.castShadow = !isSw;
      group.add(surfMesh);

      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(surfGeo),
        new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.14 })
      );
      group.add(wire);

      // Point M0(tanX0, tanY0) on surface
      const z0 = evalZ(tanX0, tanY0);
      const [fx0, fy0] = evalGrad(tanX0, tanY0);
      const m0 = new THREE.Vector3(tanX0, z0, tanY0);

      const mSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 20, 20),
        new THREE.MeshPhysicalMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.7, clearcoat: 0.85 })
      );
      mSphere.position.copy(m0);
      group.add(mSphere);

      // Tangent plane spanned by T_x = (1, fx0, 0) and T_y = (0, fy0, 1)
      const tPlaneSize = 2.6;
      const tGeo = new THREE.PlaneGeometry(tPlaneSize, tPlaneSize);
      const tPos = tGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < tPos.count; i++) {
        const dx = tPos.getX(i);
        const dy = tPos.getY(i);
        tPos.setXYZ(i, tanX0 + dx, z0 + fx0 * dx + fy0 * dy, tanY0 + dy);
      }
      tGeo.computeVertexNormals();
      const tMat = new THREE.MeshPhysicalMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.54,
        roughness: 0.12,
        clearcoat: 0.9,
        side: THREE.DoubleSide
      });
      group.add(new THREE.Mesh(tGeo, tMat));

      const nVec = new THREE.Vector3(-fx0, 1, -fy0).normalize();
      const txVec = new THREE.Vector3(1, fx0, 0).normalize();
      const tyVec = new THREE.Vector3(0, fy0, 1).normalize();
      group.add(create3DArrow(nVec, m0, 1.8, 0xf43f5e, 0.048));
      group.add(create3DArrow(txVec, m0, 1.4, 0x10b981, 0.04));
      group.add(create3DArrow(tyVec, m0, 1.4, 0x38bdf8, 0.04));

      const haloPulse = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.025, 10, 32),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
      );
      haloPulse.position.copy(m0);
      haloPulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nVec);
      group.add(haloPulse);

      addLabel(`M₀(${tanX0.toFixed(1)}, ${tanY0.toFixed(1)})`, m0.x, m0.y + 0.35, m0.z, 0xfef08a, 0.26);
      addLabel('n⃗ (Pháp tuyến)', m0.x + nVec.x * 1.9, m0.y + nVec.y * 1.9 + 0.22, m0.z + nVec.z * 1.9, 0xfda4af, 0.26);
      addLabel('Tₓ', m0.x + txVec.x * 1.5, m0.y + txVec.y * 1.5 + 0.2, m0.z + txVec.z * 1.5, 0x34d399, 0.24);
      addLabel('Tᵧ', m0.x + tyVec.x * 1.5, m0.y + tyVec.y * 1.5 + 0.2, m0.z + tyVec.z * 1.5, 0x38bdf8, 0.24);

      let emitCd = 0;
      mathTickRef.current = (dt, elapsed) => {
        haloPulse.scale.setScalar(0.9 + 0.25 * Math.sin(elapsed * 3.2));
        emitCd += dt;
        if (emitCd > 0.14 && pool) {
          emitCd = 0;
          pool.spawn(
            m0.x,
            m0.y,
            m0.z,
            nVec.x * 1.15,
            nVec.y * 1.15,
            nVec.z * 1.15,
            0.85,
            0.72,
            0xf43f5e
          );
        }
      };
    }

    // -------------------------------------------------------------
    // MODE 10: Chuông Phân Phối & Xác Suất Gauss 3D
    // -------------------------------------------------------------
    else if (mode === 'probability_bell_3d') {
      const s = Math.max(0.5, bellSigma);
      const evalBell = (x: number, y: number) => {
        const d2 = ((x - bellMu) * (x - bellMu) + y * y) / (2 * s * s);
        return 3.4 * Math.exp(-d2);
      };

      const surfGeo = new THREE.PlaneGeometry(7.2, 7.2, 48, 48);
      surfGeo.rotateX(-Math.PI / 2);
      const posAttr = surfGeo.attributes.position as THREE.BufferAttribute;
      const colors: number[] = [];
      const cTail = new THREE.Color(0x1e293b);
      const cMid = new THREE.Color(0x6366f1);
      const cPeak = new THREE.Color(0xfacc15);

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const hVal = evalBell(x, z);
        posAttr.setY(i, hVal);
        const tN = Math.min(1, hVal / 3.4);
        const col = tN < 0.45 ? cTail.clone().lerp(cMid, tN / 0.45) : cMid.clone().lerp(cPeak, (tN - 0.45) / 0.55);
        colors.push(col.r, col.g, col.b);
      }
      surfGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      surfGeo.computeVertexNormals();

      group.add(
        new THREE.Mesh(
          surfGeo,
          new THREE.MeshPhysicalMaterial({
            vertexColors: true,
            roughness: 0.18,
            metalness: 0.12,
            clearcoat: 0.78,
            transparent: true,
            opacity: 0.64,
            side: THREE.DoubleSide
          })
        )
      );

      const bars: { mesh: THREE.Mesh; baseH: number; phase: number }[] = [];
      for (let xi = -3; xi <= 3; xi++) {
        for (let zi = -2; zi <= 2; zi++) {
          const xPos = xi * 0.9;
          const zPos = zi * 0.9;
          const colH = Math.max(0.08, evalBell(xPos, zPos));
          const barGeo = new THREE.BoxGeometry(0.42, colH, 0.42);
          const barMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(0.62 - (colH / 3.4) * 0.45, 0.85, 0.55),
            roughness: 0.18,
            metalness: 0.42,
            clearcoat: 0.85
          });
          const bar = new THREE.Mesh(barGeo, barMat);
          bar.position.set(xPos, colH / 2, zPos);
          bar.castShadow = !isSw;
          group.add(bar);
          bars.push({ mesh: bar, baseH: colH, phase: xi * 0.5 + zi * 0.7 });
        }
      }

      const stdRings: THREE.Mesh[] = [];
      [s, 2 * s].forEach((rad, idx) => {
        const ringGeo = new THREE.TorusGeometry(rad, 0.038, 12, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: idx === 0 ? 0x10b981 : 0x38bdf8,
          emissive: idx === 0 ? 0x059669 : 0x0284c7,
          emissiveIntensity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(bellMu, 0.05, 0);
        group.add(ring);
        stdRings.push(ring);
      });

      addLabel(`μ = ${bellMu.toFixed(1)}`, bellMu, 3.75, 0, 0xfef08a, 0.3);
      addLabel(`1σ (68.2%)`, bellMu + s, 0.35, 0.4, 0x34d399, 0.25);
      addLabel(`2σ (95.4%)`, bellMu + 2 * s, 0.35, 0.4, 0x38bdf8, 0.25);

      let emitCd = 0;
      mathTickRef.current = (dt, elapsed) => {
        bars.forEach((b) => {
          const sy = 1 + 0.045 * Math.sin(elapsed * 2.4 + b.phase);
          b.mesh.scale.y = sy;
          b.mesh.position.y = (b.baseH * sy) / 2;
        });
        stdRings.forEach((r, idx) => {
          r.rotation.z = elapsed * (idx === 0 ? 0.4 : -0.25);
        });
        emitCd += dt;
        if (emitCd > 0.16 && pool) {
          emitCd = 0;
          pool.spawn(
            bellMu + (Math.random() - 0.5) * 0.4,
            3.45,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.25,
            0.35 + Math.random() * 0.25,
            (Math.random() - 0.5) * 0.25,
            0.85,
            0.7,
            0xfacc15
          );
        }
      };
    }

    // -------------------------------------------------------------
    // MODE 11: Geometric Transform 3D (Tịnh tiến · Quay · Vị tự Oxyz)
    // -------------------------------------------------------------
    else if (mode === 'geometric_transform_3d') {
      // Base pyramid/prism vertices
      const basePts = [
        new THREE.Vector3(-2.1, 0, 1.3),
        new THREE.Vector3(-0.7, 0, 1.3),
        new THREE.Vector3(-1.4, 0, 0.1),
        new THREE.Vector3(-1.4, 1.4, 0.85)
      ];

      const mapPoint = (pt: THREE.Vector3, factor: number) => {
        if (transType3D === 'translation') {
          return pt.clone().add(new THREE.Vector3(2.4 * factor, 0.85 * factor, -1.6 * factor));
        }
        if (transType3D === 'rotation') {
          const ang = (transParam3D * Math.PI * factor) / 1.5;
          const c = Math.cos(ang);
          const s = Math.sin(ang);
          return new THREE.Vector3(pt.x * c - pt.z * s, pt.y, pt.x * s + pt.z * c);
        }
        const k = 1 + (transParam3D - 1) * factor;
        const center = new THREE.Vector3(-2.8, 0, 1.8);
        return center.clone().add(pt.clone().sub(center).multiplyScalar(k));
      };

      const buildTetra = (verts: THREE.Vector3[], colorHex: number, wireHex: number, opacity: number) => {
        const g = new THREE.Group();
        const faces = [
          [0, 1, 2],
          [0, 1, 3],
          [1, 2, 3],
          [2, 0, 3]
        ];
        const posArr: number[] = [];
        faces.forEach(([i, j, k]) => {
          posArr.push(
            verts[i].x, verts[i].y, verts[i].z,
            verts[j].x, verts[j].y, verts[j].z,
            verts[k].x, verts[k].y, verts[k].z
          );
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshPhysicalMaterial({
            color: colorHex,
            roughness: 0.25,
            metalness: 0.15,
            transparent: true,
            opacity,
            side: THREE.DoubleSide
          })
        );
        g.add(mesh);

        const edgeMat = new THREE.MeshBasicMaterial({ color: wireHex });
        [
          [0, 1], [1, 2], [2, 0],
          [0, 3], [1, 3], [2, 3]
        ].forEach(([i, j]) => {
          const d = verts[i].distanceTo(verts[j]);
          if (d > 0.01) {
            const cGeo = new THREE.CylinderGeometry(0.028, 0.028, d, 8);
            const cMesh = new THREE.Mesh(cGeo, edgeMat);
            cMesh.position.addVectors(verts[i], verts[j]).multiplyScalar(0.5);
            cMesh.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              verts[j].clone().sub(verts[i]).normalize()
            );
            g.add(cMesh);
          }
        });
        return g;
      };

      group.add(buildTetra(basePts, 0x14b8a6, 0x5eead4, 0.42));
      addLabel('Tứ diện ABCD', basePts[3].x, basePts[3].y + 0.35, basePts[3].z, 0x5eead4, 0.26);

      const targetPts = basePts.map((pt) => mapPoint(pt, 1));
      group.add(buildTetra(targetPts, 0xf59e0b, 0xfde68a, 0.52));
      addLabel("Ảnh A'B'C'D'", targetPts[3].x, targetPts[3].y + 0.35, targetPts[3].z, 0xfde68a, 0.26);

      // Correspondence trajectories & vector arrow
      basePts.forEach((p, idx) => {
        const tp = targetPts[idx];
        const ptsLine = [p, tp];
        const lGeo = new THREE.BufferGeometry().setFromPoints(ptsLine);
        const lMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.16, gapSize: 0.1 });
        const line = new THREE.Line(lGeo, lMat);
        line.computeLineDistances();
        group.add(line);
      });

      if (transType3D === 'translation') {
        const vDir = targetPts[0].clone().sub(basePts[0]);
        group.add(create3DArrow(vDir, new THREE.Vector3(0, 0.05, 0), vDir.length(), 0xec4899, 0.045));
        addLabel('v⃗ tịnh tiến', vDir.x * 0.55, vDir.y * 0.55 + 0.35, vDir.z * 0.55, 0xf472b6, 0.25);
      } else if (transType3D === 'rotation') {
        const axis = create3DArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -0.5, 0), 3.4, 0xec4899, 0.045);
        group.add(axis);
        addLabel('Trục quay Δ', 0.25, 2.7, 0, 0xf472b6, 0.25);
      } else {
        const centerPt = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xec4899 })
        );
        centerPt.position.set(-2.8, 0.05, 1.8);
        group.add(centerPt);
        addLabel('Tâm vị tự I', -2.8, 0.45, 1.8, 0xf472b6, 0.25);
      }

      // Live animated ghost morphing between source & image
      const ghostMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const ghostGeo = new THREE.BufferGeometry();
      ghostGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(36), 3));
      const ghostMesh = new THREE.Mesh(ghostGeo, ghostMat);
      group.add(ghostMesh);

      mathTickRef.current = (_dt, elapsed) => {
        const f = 0.5 - 0.5 * Math.cos(elapsed * 1.4);
        const curVerts = basePts.map((pt) => mapPoint(pt, f));
        const faces = [
          [0, 1, 2],
          [0, 1, 3],
          [1, 2, 3],
          [2, 0, 3]
        ];
        const arr = ghostGeo.attributes.position.array as Float32Array;
        let ptr = 0;
        faces.forEach(([i, j, k]) => {
          [curVerts[i], curVerts[j], curVerts[k]].forEach((v) => {
            arr[ptr++] = v.x;
            arr[ptr++] = v.y;
            arr[ptr++] = v.z;
          });
        });
        ghostGeo.attributes.position.needsUpdate = true;
      };
    }

    // -------------------------------------------------------------
    // MODE 12: Arithmetic GCD/LCM Cube Packing 3D
    // -------------------------------------------------------------
    else if (mode === 'arithmetic_prism_3d') {
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const d = gcd(gcd(gcdA, gcdB), gcdC);
      const scale = 0.52;
      const nx = Math.max(1, Math.round(gcdA / d));
      const ny = Math.max(1, Math.round(gcdC / d));
      const nz = Math.max(1, Math.round(gcdB / d));
      const cubeSide = d * scale;
      const totalW = gcdA * scale;
      const totalH = gcdC * scale;
      const totalD = gcdB * scale;

      const palette = [0x38bdf8, 0x6366f1, 0x10b981, 0xf59e0b, 0xec4899];
      const cubeGeo = new THREE.BoxGeometry(cubeSide * 0.92, cubeSide * 0.92, cubeSide * 0.92);
      const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
      const subGroup = new THREE.Group();

      let idx = 0;
      for (let ix = 0; ix < nx; ix++) {
        for (let iy = 0; iy < ny; iy++) {
          for (let iz = 0; iz < nz; iz++) {
            const col = palette[(ix + iy + iz) % palette.length];
            const cubeMat = new THREE.MeshPhysicalMaterial({
              color: col,
              roughness: 0.25,
              metalness: 0.15,
              transparent: true,
              opacity: 0.85,
              clearcoat: 0.45
            });
            const m = new THREE.Mesh(cubeGeo, cubeMat);
            const px = -totalW / 2 + (ix + 0.5) * cubeSide;
            const py = (iy + 0.5) * cubeSide;
            const pz = -totalD / 2 + (iz + 0.5) * cubeSide;
            m.position.set(px, py, pz);
            m.userData.basePos = new THREE.Vector3(px, py, pz);
            m.userData.expDir = new THREE.Vector3(
              ix - (nx - 1) / 2,
              iy - (ny - 1) / 2 + 0.3,
              iz - (nz - 1) / 2
            );
            m.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.45 })));
            subGroup.add(m);
            idx++;
          }
        }
      }
      group.add(subGroup);

      // Bounding outer wireframe box
      const outerBox = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(totalW, totalH, totalD)),
        new THREE.LineBasicMaterial({ color: 0xfacc15 })
      );
      outerBox.position.set(0, totalH / 2, 0);
      group.add(outerBox);

      addLabel(`Khối ${gcdA} × ${gcdB} × ${gcdC}`, 0, totalH + 0.75, 0, 0xfde047, 0.3);
      addLabel(`Xếp khít ${idx} khối cạnh ƯCLN = ${d}`, 0, -0.45, totalD / 2 + 0.6, 0x38bdf8, 0.26);

      mathTickRef.current = (_dt, elapsed) => {
        const exp = showCutaway ? cutawayOffset * 1.4 : 0.08 * (0.5 + 0.5 * Math.sin(elapsed * 1.4));
        subGroup.children.forEach((c) => {
          const base = c.userData.basePos as THREE.Vector3;
          const dir = c.userData.expDir as THREE.Vector3;
          if (base && dir) {
            c.position.copy(base).addScaledVector(dir, exp);
          }
        });
      };
    }

    // -------------------------------------------------------------
    // MODE 13: Solid Prisms & Unfolding 3D Nets
    // -------------------------------------------------------------
    else if (mode === 'solid_prism_nets_3d') {
      const sideMat = (col: number) =>
        new THREE.MeshPhysicalMaterial({
          color: col,
          roughness: 0.28,
          metalness: 0.12,
          transparent: true,
          opacity: 0.86,
          side: THREE.DoubleSide
        });

      const foldTarget = 1 - unfoldRatio; // 1 = folded 3D, 0 = flat 2D net
      const pivots: { group: THREE.Group; axis: 'x' | 'z'; maxAngle: number }[] = [];

      if (solidKind === 'box') {
        const W = 2.0;
        const D = 1.6;
        const H = 1.8;
        const baseMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, D), sideMat(0x0ea5e9));
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = 0.02;
        group.add(baseMesh);

        const makeFlap = (
          px: number,
          pz: number,
          fw: number,
          fh: number,
          axis: 'x' | 'z',
          maxAngle: number,
          offsetX: number,
          offsetZ: number,
          col: number
        ) => {
          const piv = new THREE.Group();
          piv.position.set(px, 0.02, pz);
          const panel = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), sideMat(col));
          panel.rotation.x = -Math.PI / 2;
          panel.position.set(offsetX, 0, offsetZ);
          panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), new THREE.LineBasicMaterial({ color: 0xf8fafc })));
          piv.add(panel);
          group.add(piv);
          pivots.push({ group: piv, axis, maxAngle });
          return piv;
        };

        makeFlap(0, D / 2, W, H, 'x', -Math.PI / 2, 0, H / 2, 0x38bdf8);
        makeFlap(0, -D / 2, W, H, 'x', Math.PI / 2, 0, -H / 2, 0x38bdf8);
        makeFlap(W / 2, 0, H, D, 'z', Math.PI / 2, H / 2, 0, 0x6366f1);
        const leftFlap = makeFlap(-W / 2, 0, H, D, 'z', -Math.PI / 2, -H / 2, 0, 0x6366f1);

        // Top lid attached to left flap
        const lidPiv = new THREE.Group();
        lidPiv.position.set(-H, 0, 0);
        const lidMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, D), sideMat(0x10b981));
        lidMesh.rotation.x = -Math.PI / 2;
        lidMesh.position.set(-W / 2, 0, 0);
        lidMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(lidMesh.geometry), new THREE.LineBasicMaterial({ color: 0xf8fafc })));
        lidPiv.add(lidMesh);
        leftFlap.add(lidPiv);
        pivots.push({ group: lidPiv, axis: 'z', maxAngle: -Math.PI / 2 });

        addLabel(`Hình Hộp Chữ Nhật (V = a·b·h)`, 0, 2.55, 0, 0x7dd3fc, 0.28);
      } else if (solidKind === 'prism') {
        const s = 2.0;
        const hPrism = 2.2;
        const rTri = s / Math.sqrt(3);
        const prismGeo = new THREE.CylinderGeometry(rTri, rTri, hPrism, 3);
        const prismMesh = new THREE.Mesh(prismGeo, sideMat(0x10b981));
        prismMesh.position.y = hPrism / 2 + 0.02;
        prismMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(prismGeo), new THREE.LineBasicMaterial({ color: 0xf8fafc })));
        group.add(prismMesh);

        // Unfolded lateral rectangle strip alongside when unfoldRatio > 0.05
        const stripGroup = new THREE.Group();
        for (let f = 0; f < 3; f++) {
          const panel = new THREE.Mesh(new THREE.PlaneGeometry(s * 0.85, hPrism * 0.85), sideMat(f % 2 === 0 ? 0x38bdf8 : 0x6366f1));
          panel.rotation.x = -Math.PI / 2;
          panel.position.set(-s * 0.85 + f * s * 0.86, 0.03, 2.2);
          panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), new THREE.LineBasicMaterial({ color: 0xfde047 })));
          stripGroup.add(panel);
        }
        stripGroup.scale.setScalar(Math.max(0.001, unfoldRatio));
        stripGroup.visible = unfoldRatio > 0.05;
        group.add(stripGroup);
        addLabel(`Lăng Trụ Đứng Tam Giác (S_xq = C·h)`, 0, hPrism + 0.75, 0, 0x6ee7b7, 0.28);
      } else {
        // Regular square pyramid with 4 unfolding triangular faces
        const B = 2.2;
        const slant = 2.4;
        const baseMesh = new THREE.Mesh(new THREE.PlaneGeometry(B, B), sideMat(0xf59e0b));
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = 0.02;
        baseMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseMesh.geometry), new THREE.LineBasicMaterial({ color: 0xfef08a })));
        group.add(baseMesh);

        const foldAngle = Math.acos((B / 2) / slant); // angle from flat floor up to pyramid apex
        const triShape = new THREE.Shape();
        triShape.moveTo(-B / 2, 0);
        triShape.lineTo(B / 2, 0);
        triShape.lineTo(0, slant);
        triShape.closePath();
        const triGeo = new THREE.ShapeGeometry(triShape);

        const facesCfg: { px: number; pz: number; rotY: number; axis: 'x' | 'z'; sign: number }[] = [
          { px: 0, pz: B / 2, rotY: 0, axis: 'x', sign: -1 },
          { px: 0, pz: -B / 2, rotY: Math.PI, axis: 'x', sign: 1 },
          { px: B / 2, pz: 0, rotY: Math.PI / 2, axis: 'z', sign: 1 },
          { px: -B / 2, pz: 0, rotY: -Math.PI / 2, axis: 'z', sign: -1 }
        ];
        facesCfg.forEach((fc) => {
          const piv = new THREE.Group();
          piv.position.set(fc.px, 0.02, fc.pz);
          const fWrapper = new THREE.Group();
          fWrapper.rotation.y = fc.rotY;
          const tMesh = new THREE.Mesh(triGeo, sideMat(0xec4899));
          tMesh.rotation.x = Math.PI / 2;
          tMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(triGeo), new THREE.LineBasicMaterial({ color: 0xfdf2f8 })));
          fWrapper.add(tMesh);
          piv.add(fWrapper);
          group.add(piv);
          pivots.push({ group: piv, axis: fc.axis, maxAngle: fc.sign * (Math.PI - foldAngle) });
        });
        addLabel(`Hình Chóp Tứ Giác Đều & Khai Triển`, 0, 2.7, 0, 0xf9a8d4, 0.28);
      }

      let curFold = foldTarget;
      mathTickRef.current = (dt) => {
        curFold = THREE.MathUtils.damp(curFold, foldTarget, 7, dt);
        pivots.forEach((pv) => {
          if (pv.axis === 'x') pv.group.rotation.x = curFold * pv.maxAngle;
          else pv.group.rotation.z = curFold * pv.maxAngle;
        });
      };
    }

    // -------------------------------------------------------------
    // MODE 14: Parallel Angles & Thales Similarity 3D (Lớp 7–8)
    // -------------------------------------------------------------
    else if (mode === 'angle_thales_3d') {
      const k = Math.max(0.25, Math.min(0.85, thalesRatio3D));
      const rad = (thalesAngleDeg * Math.PI) / 180;
      const apex = new THREE.Vector3(Math.cos(rad) * 1.4 - 0.6, 3.6, 0);
      const bLeft = new THREE.Vector3(-2.4, 0.25, -1.2);
      const bRight = new THREE.Vector3(2.4, 0.25, 1.2);
      const bBack = new THREE.Vector3(0.2, 0.25, -2.0);

      // Base plane & pyramid frame (A-BCD) demonstrating 3D parallel slice MNP // BCD
      const makePt = (v: THREE.Vector3, r: number, col: number) => {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(r, 16, 16),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.28 })
        );
        s.position.copy(v);
        group.add(s);
      };

      const addEdge = (p1: THREE.Vector3, p2: THREE.Vector3, col: number, width = 3) => {
        group.add(createCrispLine2([p1, p2], { color: col, linewidth: width }));
      };

      // Base triangle BCD
      const baseTriGeo = new THREE.BufferGeometry().setFromPoints([bLeft, bRight, bBack]);
      baseTriGeo.computeVertexNormals();
      group.add(
        new THREE.Mesh(
          baseTriGeo,
          new THREE.MeshPhysicalMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.26,
            side: THREE.DoubleSide
          })
        )
      );
      addEdge(bLeft, bRight, 0x38bdf8, 3.5);
      addEdge(bRight, bBack, 0x38bdf8, 3.5);
      addEdge(bBack, bLeft, 0x38bdf8, 3.5);

      // Slant edges A->B, A->C, A->D
      addEdge(apex, bLeft, 0xe2e8f0, 3);
      addEdge(apex, bRight, 0xe2e8f0, 3);
      addEdge(apex, bBack, 0xe2e8f0, 3);

      // Thales parallel slice M, N, P at ratio k from apex A
      const mPt = new THREE.Vector3().lerpVectors(apex, bLeft, k);
      const nPt = new THREE.Vector3().lerpVectors(apex, bRight, k);
      const pPt = new THREE.Vector3().lerpVectors(apex, bBack, k);

      const sliceGeo = new THREE.BufferGeometry().setFromPoints([mPt, nPt, pPt]);
      sliceGeo.computeVertexNormals();
      const sliceMesh = new THREE.Mesh(
        sliceGeo,
        new THREE.MeshPhysicalMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.56,
          side: THREE.DoubleSide
        })
      );
      group.add(sliceMesh);
      addEdge(mPt, nPt, 0xfacc15, 4);
      addEdge(nPt, pPt, 0xfacc15, 4);
      addEdge(pPt, mPt, 0xfacc15, 4);

      // Parallel angle arc rings showing corresponding angles (đồng vị bằng nhau)
      const angleArc1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.03, 10, 24, Math.PI * 0.45),
        new THREE.MeshBasicMaterial({ color: 0x34d399 })
      );
      angleArc1.position.copy(mPt);
      const angleArc2 = angleArc1.clone();
      angleArc2.position.copy(bLeft);
      group.add(angleArc1, angleArc2);

      makePt(apex, 0.11, 0xf43f5e);
      makePt(bLeft, 0.09, 0x38bdf8);
      makePt(bRight, 0.09, 0x38bdf8);
      makePt(bBack, 0.09, 0x38bdf8);
      makePt(mPt, 0.1, 0xfacc15);
      makePt(nPt, 0.1, 0xfacc15);
      makePt(pPt, 0.1, 0xfacc15);

      addLabel('A', apex.x, apex.y + 0.35, apex.z, 0xfda4af, 0.28);
      addLabel('B', bLeft.x - 0.25, bLeft.y, bLeft.z + 0.25, 0x7dd3fc, 0.26);
      addLabel('C', bRight.x + 0.25, bRight.y, bRight.z + 0.25, 0x7dd3fc, 0.26);
      addLabel('M', mPt.x - 0.28, mPt.y + 0.1, mPt.z + 0.2, 0xfde047, 0.26);
      addLabel('N', nPt.x + 0.28, nPt.y + 0.1, nPt.z + 0.2, 0xfde047, 0.26);
      addLabel(
        `MN // BC · AM/AB = MN/BC = ${k.toFixed(2)}`,
        0,
        4.3,
        0,
        0xfde047,
        0.26
      );

      mathTickRef.current = (_dt, elapsed) => {
        sliceMesh.material.opacity = 0.46 + 0.16 * Math.sin(elapsed * 2.2);
      };
    }

    const cont = mountRef.current;
    if (cont) {
      syncLine2Resolution(group, cont.clientWidth || 800, cont.clientHeight || 500);
    }
    needsRenderRef.current = true;
  }, [
    mode,
    showCutaway,
    cutawayOffset,
    ux,
    uy,
    uz,
    vx,
    vy,
    vz,
    sphereRadius,
    planeDistance,
    cutHeightRatio,
    revSegments,
    revCurveType,
    conicTiltDeg,
    conicOffsetY,
    lineDirX,
    lineDirY,
    lineDirZ,
    planeTiltDeg,
    diskCount,
    diskFuncType,
    circleR3D,
    extDist3D,
    secOffset3D,
    surfaceType,
    tanX0,
    tanY0,
    bellMu,
    bellSigma,
    transType3D,
    transParam3D,
    gcdA,
    gcdB,
    gcdC,
    solidKind,
    unfoldRatio,
    thalesRatio3D,
    thalesAngleDeg
  ]);

  // Derived math calculations for display
  const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz).toFixed(2);
  const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz).toFixed(2);
  const dotProd = ux * vx + uy * vy + uz * vz;
  const crossX = uy * vz - uz * vy;
  const crossY = uz * vx - ux * vz;
  const crossZ = ux * vy - uy * vx;

  return (
    <ViewportPortal active={isFullscreen}>
      <div
        className={`sim-math-scope relative w-full overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all flex flex-col ${
          isFullscreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen rounded-none lg:block'
            : embedded
            ? 'rounded-xl'
            : 'rounded-[4px] min-h-[540px] lg:min-h-0 lg:h-[620px] lg:block'
        }`}
      >
        {/* TOP HEADER OVERLAY (Stacked when embedded or < lg, floating on lg+ standalone) */}
        <div
          className={`relative z-20 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/95 border-b border-slate-800/80 shrink-0 ${
            embedded && !isFullscreen
              ? ''
              : 'lg:p-0 lg:absolute lg:top-4 lg:left-4 lg:right-4 lg:bg-transparent lg:border-b-0 lg:pointer-events-none'
          }`}
        >
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-slate-800/80 lg:bg-slate-900/95 border border-slate-700/80 text-white shadow-lg max-w-full">
            {(isFullscreen || onBack) && (
              <button
                onClick={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="sim-btn-math flex items-center gap-1 px-2.5 py-1 rounded-[3px] border border-indigo-400/60 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isFullscreen ? 'Thu nhỏ' : 'Quay lại'}</span>
              </button>
            )}
            {embeddedBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-mono font-bold uppercase shrink-0">
                {embeddedBadge}
              </span>
            )}
            <Box className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide truncate">
              {mode === 'oxyz_vector' && t('math3d.oxyz', 'Hệ Trục Oxyz & Vector Tích Có Hướng', '3D Oxyz Coordinates & Cross Product')}
              {mode === 'sphere_plane' && t('math3d.sphere', 'Mặt Cầu & Mặt Phẳng Thiết Diện 3D', 'Sphere & Plane Intersection 3D')}
              {mode === 'pyramid_section' && t('math3d.pyramid', 'Khối Chóp & Mặt Cắt Thiết Diện Động', 'Pyramid & Dynamic Cross Section')}
              {mode === 'revolution_solid' && t('math3d.revolution', 'Khối Tròn Xoay & Tích Phân Thể Tích', 'Solids of Revolution & Integration')}
              {mode === 'conic_sections_3d' && 'Ba Đường Conic từ Mặt Nón Đôi 3D (Elip · Parabol · Hypebol)'}
              {mode === 'line_plane_oxyz' && 'Đường Thẳng & Mặt Phẳng Oxyz · Góc & Giao Điểm'}
              {mode === 'integral_disks_3d' && 'Tích Phân Đĩa Trụ Riemann · Thể Tích Tròn Xoay'}
              {mode === 'circle_theorems_3d' && 'Đường Tròn, Tiếp Tuyến & Nón Tiếp Xúc 3D'}
              {mode === 'tangent_surface_3d' && 'Bề Mặt Đạo Hàm, Vector Pháp Tuyến & Tiếp Diện 3D'}
              {mode === 'probability_bell_3d' && 'Chuông Phân Phối Chuẩn & Xác Suất Gauss 3D'}
              {mode === 'geometric_transform_3d' && 'Phép Biến Hình & Tọa Độ Không Gian Oxyz 3D'}
              {mode === 'arithmetic_prism_3d' && 'Khối Lập Phương ƯCLN / BCNN & Tỉ Số 3D'}
              {mode === 'solid_prism_nets_3d' && 'Hình Hộp, Lăng Trụ & Khai Triển Hình Chóp 3D'}
              {mode === 'angle_thales_3d' && 'Góc Song Song, Tam Giác & Định Lý Thalès 3D'}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 max-w-full flex-wrap">
            {/* Mode Switcher Tabs */}
            <div className="sim-seg-box flex items-center gap-1 p-1 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-lg overflow-x-auto max-w-full scrollbar-none">
              {[
                { id: 'oxyz_vector' as Math3DMode, label: 'Vector Oxyz' },
                { id: 'tangent_surface_3d' as Math3DMode, label: 'Đạo Hàm 3D' },
                { id: 'probability_bell_3d' as Math3DMode, label: 'Xác Suất 3D' },
                { id: 'circle_theorems_3d' as Math3DMode, label: 'Đường Tròn 3D' },
                { id: 'sphere_plane' as Math3DMode, label: 'Mặt Cầu' },
                { id: 'pyramid_section' as Math3DMode, label: 'Thiết Diện Chóp' },
                { id: 'revolution_solid' as Math3DMode, label: 'Khối Tròn Xoay' },
                { id: 'conic_sections_3d' as Math3DMode, label: 'Mặt Nón Conic' },
                { id: 'line_plane_oxyz' as Math3DMode, label: 'Đường & Mặt Oxyz' },
                { id: 'integral_disks_3d' as Math3DMode, label: 'Đĩa Tích Phân' },
                { id: 'geometric_transform_3d' as Math3DMode, label: 'Biến Hình 3D' },
                { id: 'arithmetic_prism_3d' as Math3DMode, label: 'Khối ƯCLN/BCNN' },
                { id: 'solid_prism_nets_3d' as Math3DMode, label: 'Khai Triển Khối' },
                { id: 'angle_thales_3d' as Math3DMode, label: 'Góc & Thalès 3D' }
              ]
                .filter((m) => !allowedModes || allowedModes.length === 0 || allowedModes.includes(m.id))
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`sim-btn-math px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-md border whitespace-nowrap shrink-0 cursor-pointer ${
                      mode === m.id
                        ? 'sim-btn-active bg-indigo-600 border-indigo-400 text-white shadow-sm'
                        : 'border-transparent text-slate-300 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
            </div>

            <div className="hidden xl:flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-900/95 border border-slate-700/80 shadow-lg shrink-0">
              {(
                [
                  { id: 'iso', label: 'Iso' },
                  { id: 'oxy', label: 'Oxy' },
                  { id: 'oxz', label: 'Oxz' },
                  { id: 'oyz', label: 'Oyz' },
                ] as const
              ).map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => camPresetFnRef.current?.(cp.id)}
                  className="px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                  title={`Góc nhìn ${cp.label}`}
                >
                  {cp.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoOrbit((o) => !o)}
              className={`sim-btn-math p-2 rounded-lg border shadow-lg cursor-pointer shrink-0 ${
                autoOrbit
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title={autoOrbit ? 'Tắt tự xoay 360°' : 'Tự xoay bàn xoay 360°'}
            >
              <RotateCw className={`w-4 h-4 ${autoOrbit ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsAnimating((p) => !p)}
              className="sim-btn-math p-2 rounded-lg bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg cursor-pointer shrink-0"
              title={isAnimating ? 'Tạm dừng chuyển động' : 'Chạy chuyển động 3D'}
            >
              {isAnimating ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            {(mode === 'sphere_plane' || mode === 'revolution_solid' || mode === 'conic_sections_3d' || mode === 'circle_theorems_3d') && (
              <button
                onClick={() => setShowCutaway((c) => !c)}
                className={`sim-btn-math flex items-center gap-1 px-2.5 py-2 rounded-lg border text-[11px] font-semibold shadow-lg cursor-pointer shrink-0 ${
                  showCutaway
                    ? 'bg-emerald-600/90 border-emerald-400 text-white'
                    : 'bg-slate-900/95 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
                title="Mặt cắt hình học 3D (Clipping Plane)"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mặt cắt</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => capturePngFnRef.current?.()}
              className="sim-btn-math p-2 rounded-lg bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg cursor-pointer shrink-0"
              title="Chụp ảnh không gian 3D (.png)"
            >
              <Camera className="w-4 h-4 text-sky-400" />
            </button>

            <RecordVideoButton
              isRecording={isRecording}
              recordSeconds={recSeconds}
              onToggle={toggleRecording}
              compact
            />

            <HologramModeControls
              mode={hologramMode}
              onChangeMode={setHologramMode}
              camStatus={camStatus}
              compact
            />

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="sim-btn-math p-2 rounded-lg bg-slate-900/95 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg cursor-pointer shrink-0"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            {onOpenFull3D && !isFullscreen && (
              <button
                type="button"
                onClick={onOpenFull3D}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Lab 3D Đầy đủ</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div
          className={`relative w-full ${
            isFullscreen
              ? 'flex-1 min-h-[240px] lg:h-full'
              : embedded
              ? heightClass
              : 'h-[270px] sm:h-[340px] lg:h-full'
          }`}
        >
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          />
          {contextLost && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-slate-200 text-xs p-4 text-center">
              Ngữ cảnh WebGL tạm ngưng. Vui lòng chuyển tab hoặc tải lại để khôi phục đồ họa 3D.
            </div>
          )}
        </div>

        {/* ERGONOMIC COLLAPSIBLE CONTROL DOCK */}
        <div
          className={`relative z-20 p-2.5 sm:p-3 w-full bg-slate-950/95 border-t border-slate-800/80 shrink-0 ${
            embedded && !isFullscreen
              ? ''
              : 'lg:p-0 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-[96%] lg:max-w-3xl lg:pointer-events-none lg:bg-transparent lg:border-t-0'
          }`}
        >
          <div
            className={`pointer-events-auto bg-slate-900/96 border border-slate-800 shadow-2xl p-3 sm:p-4 text-white space-y-2.5 sm:space-y-3 overflow-y-auto transition-all duration-300 ${
              embedded && !isFullscreen
                ? 'rounded-xl max-h-[260px]'
                : 'rounded-2xl sm:rounded-3xl max-h-[34dvh] sm:max-h-[240px] lg:max-h-none'
            }`}
          >
          {/* Header Row of Dock */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bảng Điều Khiển Tương Tác 3D</span>
              <div className="flex xl:hidden items-center gap-1 ml-1">
                {(['iso', 'oxy', 'oxz', 'oyz'] as const).map((cp) => (
                  <button
                    key={cp}
                    type="button"
                    onClick={() => camPresetFnRef.current?.(cp)}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer"
                  >
                    {cp.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span>{isControlsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {isControlsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showCutaway && (mode === 'sphere_plane' || mode === 'revolution_solid' || mode === 'conic_sections_3d' || mode === 'circle_theorems_3d') && (
            <div className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/35 text-[11px]">
              <span className="font-semibold text-emerald-300 whitespace-nowrap">Độ sâu mặt cắt Z:</span>
              <input
                type="range"
                min="-2.6"
                max="2.6"
                step="0.05"
                value={cutawayOffset}
                onChange={(e) => setCutawayOffset(Number(e.target.value))}
                className="flex-1 accent-emerald-400 h-1.5 cursor-pointer"
              />
              <span className="font-mono font-bold text-emerald-200 tabular-nums w-12 text-right">
                {cutawayOffset.toFixed(2)}
              </span>
            </div>
          )}

          {/* Body of Dock */}
          {isControlsExpanded && (
            <div className="animate-in fade-in duration-200">
              {/* Controls for Vector Oxyz */}
              {mode === 'oxyz_vector' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Vector u */}
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-amber-400">
                        <span>Vector u: ({ux}, {uy}, {uz})</span>
                        <span className="text-[11px] text-slate-400">|u| = {uLen}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>x</span>
                            <input
                              type="number"
                              step="0.5"
                              value={ux}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setUx(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-amber-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, ux))} onChange={(e) => setUx(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>y</span>
                            <input
                              type="number"
                              step="0.5"
                              value={uy}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setUy(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-amber-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, uy))} onChange={(e) => setUy(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>z</span>
                            <input
                              type="number"
                              step="0.5"
                              value={uz}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setUz(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-amber-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, uz))} onChange={(e) => setUz(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                        </div>
                      </div>
                    </div>

                    {/* Vector v */}
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-cyan-400">
                        <span>Vector v: ({vx}, {vy}, {vz})</span>
                        <span className="text-[11px] text-slate-400">|v| = {vLen}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>x</span>
                            <input
                              type="number"
                              step="0.5"
                              value={vx}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setVx(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, vx))} onChange={(e) => setVx(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>y</span>
                            <input
                              type="number"
                              step="0.5"
                              value={vy}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setVy(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, vy))} onChange={(e) => setVy(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>z</span>
                            <input
                              type="number"
                              step="0.5"
                              value={vz}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (Number.isFinite(v)) setVz(v);
                              }}
                              className="w-11 px-1 py-0.5 text-right text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-cyan-300"
                            />
                          </div>
                          <input type="range" min="-5" max="5" step="0.5" value={Math.max(-5, Math.min(5, vz))} onChange={(e) => setVz(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Math Telemetry Result */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/60 rounded-xl text-[11px] text-slate-300 font-mono">
                    <div>
                      <span className="text-purple-400 font-bold">Tích có hướng [u, v]:</span> ({crossX}, {crossY}, {crossZ})
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold">Tích vô hướng u·v:</span> {dotProd}
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for Sphere & Plane */}
              {mode === 'sphere_plane' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-slate-300">Bán kính mặt cầu (R):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0.5"
                            max="8"
                            step="0.1"
                            value={sphereRadius}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (Number.isFinite(v) && v >= 0.2) setSphereRadius(v);
                            }}
                            className="w-16 px-1.5 py-0.5 text-right text-xs font-mono bg-slate-900 border border-slate-700 rounded text-blue-400 font-bold"
                          />
                          <span className="text-slate-400">m</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="6.0"
                        step="0.1"
                        value={Math.max(1.0, Math.min(6.0, sphereRadius))}
                        onChange={(e) => setSphereRadius(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-slate-300">Khoảng cách d(I, (P)):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="8"
                            step="0.1"
                            value={planeDistance}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (Number.isFinite(v) && v >= 0) setPlaneDistance(v);
                            }}
                            className="w-16 px-1.5 py-0.5 text-right text-xs font-mono bg-slate-900 border border-slate-700 rounded text-emerald-400 font-bold"
                          />
                          <span className="text-slate-400">m</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6.0"
                        step="0.1"
                        value={Math.max(0, Math.min(6.0, planeDistance))}
                        onChange={(e) => setPlaneDistance(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5"
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs flex items-center justify-between">
                    <span className="text-slate-400">
                      {planeDistance < sphereRadius
                        ? 'Cắt theo đường tròn giao tuyến'
                        : planeDistance === sphereRadius
                        ? 'Mặt phẳng tiếp xúc mặt cầu tại 1 điểm'
                        : 'Mặt phẳng không cắt mặt cầu (d > R)'}
                    </span>
                    {planeDistance < sphereRadius && (
                      <span className="font-bold text-amber-400 font-mono">
                        Bán kính r = √(R² - d²) = {Math.sqrt(sphereRadius * sphereRadius - planeDistance * planeDistance).toFixed(2)} m
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Controls for Pyramid Section */}
              {mode === 'pyramid_section' && (
                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 gap-2">
                      <span className="text-slate-300">Tỉ số cắt mặt phẳng k = SM/SA (0.05 – 0.95):</span>
                      <input
                        type="number"
                        min="0.05"
                        max="0.95"
                        step="0.02"
                        value={cutHeightRatio}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (Number.isFinite(v)) setCutHeightRatio(Math.max(0.05, Math.min(0.95, v)));
                        }}
                        className="w-20 px-1.5 py-0.5 text-right text-xs font-mono bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold"
                      />
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.02"
                      value={cutHeightRatio}
                      onChange={(e) => setCutHeightRatio(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Nhập số trực tiếp hoặc kéo thanh trượt để di chuyển mặt phẳng cắt qua 4 cạnh bên chóp tứ giác!
                  </div>
                </div>
              )}

              {/* Controls for Solids of Revolution */}
              {mode === 'revolution_solid' && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Hàm số đường sinh y = f(x):</span>
                    <button
                      onClick={() => setRevCurveType('parabola')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        revCurveType === 'parabola' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Parabol (y = 0.5 + 0.15x²)
                    </button>
                    <button
                      onClick={() => setRevCurveType('sine')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        revCurveType === 'sine' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Sóng Sine (Bình Hoa)
                    </button>
                    <button
                      onClick={() => setRevCurveType('cone')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        revCurveType === 'cone' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Nón Cụt (Tuyến tính)
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Công thức tính thể tích: V = π ∫ [f(x)]² dx. Xoay chuột trái để quan sát 360 độ khối tròn xoay!
                  </div>
                </div>
              )}

              {/* Controls for Conic Sections 3D */}
              {mode === 'conic_sections_3d' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Góc nghiêng mặt cắt α (°):</span>
                        <span className="font-mono font-bold text-amber-400">{conicTiltDeg}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="1"
                        value={conicTiltDeg}
                        onChange={(e) => setConicTiltDeg(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Độ dịch chuyển dọc trục y:</span>
                        <span className="font-mono font-bold text-emerald-400">{conicOffsetY.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="-2.0"
                        max="2.2"
                        step="0.1"
                        value={conicOffsetY}
                        onChange={(e) => setConicOffsetY(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5"
                      />
                    </div>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-400">Góc sinh hình nón θ ≈ 53.1° (mặt cắt chuẩn):</span>
                    <span className="font-bold text-amber-300">
                      {conicTiltDeg === 0
                        ? 'Hình Tròn (α = 0°)'
                        : conicTiltDeg < 52
                        ? 'Đường Elip (0° < α < θ)'
                        : conicTiltDeg <= 55
                        ? 'Đường Parabol (α ≈ θ)'
                        : 'Đường Hypebol 2 nhánh (α > θ)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Controls for Line & Plane Oxyz */}
              {mode === 'line_plane_oxyz' && (() => {
                const tiltRad = (planeTiltDeg * Math.PI) / 180;
                const nVec = new THREE.Vector3(0, Math.cos(tiltRad), Math.sin(tiltRad)).normalize();
                const uVec = new THREE.Vector3(lineDirX, lineDirZ, lineDirY);
                const lenU = uVec.length();
                const sinPhi = lenU > 1e-4 ? Math.abs(uVec.dot(nVec)) / lenU : 0;
                const phiDeg = (Math.asin(Math.min(1, sinPhi)) * 180) / Math.PI;
                return (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-400 block mb-0.5">u_x: {lineDirX.toFixed(1)}</span>
                        <input type="range" min="-3" max="3" step="0.2" value={lineDirX} onChange={(e) => setLineDirX(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">u_y: {lineDirY.toFixed(1)}</span>
                        <input type="range" min="-3" max="3" step="0.2" value={lineDirY} onChange={(e) => setLineDirY(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">u_z: {lineDirZ.toFixed(1)}</span>
                        <input type="range" min="-3" max="3" step="0.2" value={lineDirZ} onChange={(e) => setLineDirZ(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Nghiêng (P): {planeTiltDeg}°</span>
                        <input type="range" min="-45" max="45" step="1" value={planeTiltDeg} onChange={(e) => setPlaneTiltDeg(Number(e.target.value))} className="w-full accent-emerald-500 h-1" />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-xl flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-amber-300">u = ({lineDirX.toFixed(1)}, {lineDirY.toFixed(1)}, {lineDirZ.toFixed(1)})</span>
                      <span className="text-emerald-300">sin φ = |u·n|/(|u||n|) = {sinPhi.toFixed(3)} ⇒ Góc (d,(P)) ≈ {phiDeg.toFixed(1)}°</span>
                    </div>
                  </div>
                );
              })()}

              {/* Controls for Integral Disks 3D */}
              {mode === 'integral_disks_3d' && (() => {
                const lengthX = 4.0;
                const dx = lengthX / diskCount;
                const evalR = (x: number) =>
                  diskFuncType === 'sqrt'
                    ? 0.4 + 0.85 * Math.sqrt(Math.max(0, x))
                    : diskFuncType === 'linear'
                    ? 0.35 + 0.45 * x
                    : 0.4 + 0.14 * x * x;
                let riemannV = 0;
                for (let i = 0; i < diskCount; i++) {
                  const r = evalR((i + 0.5) * dx);
                  riemannV += Math.PI * r * r * dx;
                }
                return (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'sqrt' as const, label: 'y = 0.4 + 0.85√x' },
                          { id: 'linear' as const, label: 'Nón: y = 0.35 + 0.45x' },
                          { id: 'parabola' as const, label: 'Loa: y = 0.4 + 0.14x²' }
                        ].map((fn) => (
                          <button
                            key={fn.id}
                            onClick={() => setDiskFuncType(fn.id)}
                            className={`px-2.5 py-1 rounded-lg font-medium ${
                              diskFuncType === fn.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {fn.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 min-w-[160px]">
                        <span className="text-slate-300 whitespace-nowrap">Số lát đĩa n = {diskCount}</span>
                        <input
                          type="range"
                          min="4"
                          max="40"
                          step="1"
                          value={diskCount}
                          onChange={(e) => setDiskCount(Number(e.target.value))}
                          className="w-28 accent-emerald-500 h-1.5"
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-xl font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 text-emerald-300">
                      <span>Tổng Riemann ({diskCount} đĩa): V ≈ {riemannV.toFixed(2)} đvtt</span>
                      <span className="text-slate-400">Tăng n → ∞ để hội tụ về V = π∫[f(x)]²dx</span>
                    </div>
                  </div>
                );
              })()}

              {/* Controls for Circle Theorems 3D */}
              {mode === 'circle_theorems_3d' && (() => {
                const effOm = Math.max(circleR3D + 0.35, extDist3D);
                const tangentLen = Math.sqrt(Math.max(0, effOm * effOm - circleR3D * circleR3D));
                const dSec = Math.max(-circleR3D + 0.05, Math.min(circleR3D - 0.05, secOffset3D));
                const rSec = Math.sqrt(Math.max(0, circleR3D * circleR3D - dSec * dSec));
                return (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-300">Bán kính R:</span>
                          <span className="font-mono font-bold text-sky-400">{circleR3D.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1.2"
                          max="3.4"
                          step="0.1"
                          value={circleR3D}
                          onChange={(e) => setCircleR3D(Number(e.target.value))}
                          className="w-full accent-sky-500 h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-300">Khoảng cách OM:</span>
                          <span className="font-mono font-bold text-amber-400">{effOm.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min={(circleR3D + 0.4).toFixed(1)}
                          max="6.5"
                          step="0.1"
                          value={effOm}
                          onChange={(e) => setExtDist3D(Number(e.target.value))}
                          className="w-full accent-amber-500 h-1.5"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-300">Thiết diện phẳng d:</span>
                          <span className="font-mono font-bold text-emerald-400">{dSec.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min={(-circleR3D + 0.2).toFixed(1)}
                          max={(circleR3D - 0.2).toFixed(1)}
                          step="0.1"
                          value={dSec}
                          onChange={(e) => setSecOffset3D(Number(e.target.value))}
                          className="w-full accent-emerald-500 h-1.5"
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded-xl font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-200">
                      <span className="text-purple-300">Tiếp tuyến MT = √(OM² - R²) = {tangentLen.toFixed(2)}</span>
                      <span className="text-emerald-300">Bán kính thiết diện r = √(R² - d²) = {rSec.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Controls for Tangent Surface 3D */}
              {mode === 'tangent_surface_3d' && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400">Hàm f(x, y):</span>
                    {[
                      { id: 'paraboloid' as const, label: 'Paraboloid 0.22(x²+y²)' },
                      { id: 'saddle' as const, label: 'Yên ngựa 0.24(x²-y²)' },
                      { id: 'wave' as const, label: 'Sóng cos(x)sin(y)' }
                    ].map((fn) => (
                      <button
                        key={fn.id}
                        onClick={() => setSurfaceType(fn.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium ${
                          surfaceType === fn.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {fn.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Hoành độ x₀:</span>
                        <span className="font-mono font-bold text-amber-400">{tanX0.toFixed(1)}</span>
                      </div>
                      <input type="range" min="-2.0" max="2.0" step="0.1" value={tanX0} onChange={(e) => setTanX0(Number(e.target.value))} className="w-full accent-amber-500 h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Tung độ y₀:</span>
                        <span className="font-mono font-bold text-cyan-400">{tanY0.toFixed(1)}</span>
                      </div>
                      <input type="range" min="-2.0" max="2.0" step="0.1" value={tanY0} onChange={(e) => setTanY0(Number(e.target.value))} className="w-full accent-cyan-500 h-1.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for Probability Bell 3D */}
              {mode === 'probability_bell_3d' && (
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Kỳ vọng μ (Trung tâm):</span>
                        <span className="font-mono font-bold text-amber-400">{bellMu.toFixed(1)}</span>
                      </div>
                      <input type="range" min="-1.5" max="1.5" step="0.1" value={bellMu} onChange={(e) => setBellMu(Number(e.target.value))} className="w-full accent-amber-500 h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Độ lệch chuẩn σ:</span>
                        <span className="font-mono font-bold text-emerald-400">{bellSigma.toFixed(2)}</span>
                      </div>
                      <input type="range" min="0.6" max="2.2" step="0.05" value={bellSigma} onChange={(e) => setBellSigma(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
                    </div>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-300">
                    <span className="text-emerald-300">Quy tắc 68–95–99.7: Vòng xanh lá = 1σ | Vòng xanh dương = 2σ</span>
                    <span className="text-amber-300">Phương sai σ² = {(bellSigma * bellSigma).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Controls for Geometric Transform 3D */}
              {mode === 'geometric_transform_3d' && (
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: 'translation', label: 'Tịnh tiến v⃗' },
                      { id: 'rotation', label: 'Quay trục Δ' },
                      { id: 'homothety', label: 'Vị tự tâm I' }
                    ] as const).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setTransType3D(item.id)}
                        className={`py-1.5 rounded-[3px] border text-[11px] font-bold transition-colors ${
                          transType3D === item.id
                            ? 'bg-teal-600 border-teal-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">
                        {transType3D === 'translation'
                          ? 'Hệ số độ dời λ:'
                          : transType3D === 'rotation'
                          ? 'Biên độ góc quay (π rad):'
                          : 'Tỉ số vị tự k:'}
                      </span>
                      <span className="font-mono font-bold text-amber-400">{transParam3D.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.2"
                      step="0.05"
                      value={transParam3D}
                      onChange={(e) => setTransParam3D(Number(e.target.value))}
                      className="w-full accent-teal-400 h-1.5"
                    />
                  </div>
                </div>
              )}

              {/* Controls for Arithmetic Prism 3D */}
              {mode === 'arithmetic_prism_3d' && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Chiều dài a:</span>
                        <span className="font-mono font-bold text-sky-400">{gcdA}</span>
                      </div>
                      <input type="range" min="2" max="12" step="1" value={gcdA} onChange={(e) => setGcdA(Number(e.target.value))} className="w-full accent-sky-400 h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Chiều rộng b:</span>
                        <span className="font-mono font-bold text-emerald-400">{gcdB}</span>
                      </div>
                      <input type="range" min="2" max="10" step="1" value={gcdB} onChange={(e) => setGcdB(Number(e.target.value))} className="w-full accent-emerald-400 h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Chiều cao c:</span>
                        <span className="font-mono font-bold text-amber-400">{gcdC}</span>
                      </div>
                      <input type="range" min="2" max="10" step="1" value={gcdC} onChange={(e) => setGcdC(Number(e.target.value))} className="w-full accent-amber-400 h-1.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for Solid Prism & Pyramid Nets 3D */}
              {mode === 'solid_prism_nets_3d' && (
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: 'box', label: 'Hình hộp CN' },
                      { id: 'prism', label: 'Lăng trụ đứng' },
                      { id: 'pyramid', label: 'Chóp tứ giác đều' }
                    ] as const).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSolidKind(item.id)}
                        className={`py-1.5 rounded-[3px] border text-[11px] font-bold transition-colors ${
                          solidKind === item.id
                            ? 'bg-sky-600 border-sky-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Độ mở khai triển lưới 2D ↔ 3D:</span>
                      <span className="font-mono font-bold text-amber-400">{Math.round(unfoldRatio * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={unfoldRatio}
                      onChange={(e) => setUnfoldRatio(Number(e.target.value))}
                      className="w-full accent-sky-400 h-1.5"
                    />
                  </div>
                </div>
              )}

              {/* Controls for Parallel Angles & Thales 3D */}
              {mode === 'angle_thales_3d' && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Tỉ số Thalès AM / AB:</span>
                        <span className="font-mono font-bold text-amber-400">{thalesRatio3D.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="0.85"
                        step="0.05"
                        value={thalesRatio3D}
                        onChange={(e) => setThalesRatio3D(Number(e.target.value))}
                        className="w-full accent-amber-400 h-1.5"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Góc nghiêng cát tuyến:</span>
                        <span className="font-mono font-bold text-emerald-400">{thalesAngleDeg}°</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="130"
                        step="2"
                        value={thalesAngleDeg}
                        onChange={(e) => setThalesAngleDeg(Number(e.target.value))}
                        className="w-full accent-emerald-400 h-1.5"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-sky-300">
                    (MNP) // (BCD) ⇒ AM/AB = AN/AC = MN/BC = {thalesRatio3D.toFixed(2)} · Tỉ số diện tích = {(thalesRatio3D * thalesRatio3D).toFixed(3)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </ViewportPortal>
  );
};
