import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MathFormula } from '../common/MathRenderer';

export type Math3DMode = 'oxyz_vector' | 'sphere_plane' | 'pyramid_section' | 'revolution_solid';

interface Math3DViewProps {
  initialMode?: Math3DMode;
}

export const Math3DView: React.FC<Math3DViewProps> = ({ initialMode = 'oxyz_vector' }) => {
  const { t } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);

  // Mode selection
  const [mode, setMode] = useState<Math3DMode>(initialMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);

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

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);

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

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);

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
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 2;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88bbff, 0.8);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 16, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Group for dynamic interactive models
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Animation loop
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 200);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
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

    // Clear previous geometries and materials safely
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

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
      const shaftMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.6,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);

      // Head (Cone)
      const headGeo = new THREE.ConeGeometry(radius * 2.2, headLength, 16);
      headGeo.translate(0, shaftLength + headLength / 2, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.7,
      });
      const head = new THREE.Mesh(headGeo, headMat);

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
      // 3 Axes: Ox (Red), Oy (Green), Oz (Blue)
      const axisLength = 5;
      group.add(create3DArrow(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLength, 0xef4444, 0.03));
      group.add(create3DArrow(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLength, 0x10b981, 0.03));
      group.add(create3DArrow(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), axisLength, 0x3b82f6, 0.03));

      // Vector u (Amber)
      const uVec = new THREE.Vector3(ux, uz, uy); // Mapping math z to three.js y
      const uLen = uVec.length();
      group.add(create3DArrow(uVec, new THREE.Vector3(0, 0, 0), uLen, 0xf59e0b, 0.06));

      // Vector v (Cyan)
      const vVec = new THREE.Vector3(vx, vz, vy);
      const vLen = vVec.length();
      group.add(create3DArrow(vVec, new THREE.Vector3(0, 0, 0), vLen, 0x06b6d4, 0.06));

      // Cross Product w = u x v (Purple)
      const wVec = new THREE.Vector3().crossVectors(uVec, vVec);
      const wLen = wVec.length();
      if (wLen > 0.1) {
        group.add(create3DArrow(wVec, new THREE.Vector3(0, 0, 0), wLen, 0xa855f7, 0.07));

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
        const planeMat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        group.add(new THREE.Mesh(geom, planeMat));
      }
    }

    // -------------------------------------------------------------
    // MODE 2: Mặt Cầu & Mặt Phẳng Thiết Diện 3D
    // -------------------------------------------------------------
    else if (mode === 'sphere_plane') {
      // Sphere
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.2,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphereMesh);

      // Sphere wireframe cage
      const wireGeo = new THREE.WireframeGeometry(sphereGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.25 });
      group.add(new THREE.LineSegments(wireGeo, wireMat));

      // Center Point I
      const centerGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
      group.add(new THREE.Mesh(centerGeo, centerMat));

      // Cutting Plane
      const planeGeo = new THREE.PlaneGeometry(sphereRadius * 2.8, sphereRadius * 2.8);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI / 2;
      planeMesh.position.y = planeDistance;
      group.add(planeMesh);

      // If plane intersects sphere (d < R)
      if (planeDistance < sphereRadius) {
        const cutCircleRadius = Math.sqrt(sphereRadius * sphereRadius - planeDistance * planeDistance);
        const ringGeo = new THREE.RingGeometry(cutCircleRadius - 0.05, cutCircleRadius + 0.05, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = planeDistance + 0.01;
        group.add(ringMesh);

        // Distance drop line IH
        const dropLineGeo = new THREE.CylinderGeometry(0.03, 0.03, planeDistance, 8);
        dropLineGeo.translate(0, planeDistance / 2, 0);
        const dropLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        group.add(new THREE.Mesh(dropLineGeo, dropLineMat));
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

      // Draw pyramid edges with lines
      const edgePoints = [
        A, B, B, C, C, D, D, A, // base
        S, A, S, B, S, C, S, D, // lateral edges
      ];
      const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePoints);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 2 });
      group.add(new THREE.LineSegments(edgeGeo, edgeMat));

      // Semi-transparent faces
      const facesGeo = new THREE.BufferGeometry();
      const faceVertices = new Float32Array([
        // SAB
        S.x, S.y, S.z, A.x, A.y, A.z, B.x, B.y, B.z,
        // SBC
        S.x, S.y, S.z, B.x, B.y, B.z, C.x, C.y, C.z,
        // SCD
        S.x, S.y, S.z, C.x, C.y, C.z, D.x, D.y, D.z,
        // SDA
        S.x, S.y, S.z, D.x, D.y, D.z, A.x, A.y, A.z,
      ]);
      facesGeo.setAttribute('position', new THREE.BufferAttribute(faceVertices, 3));
      facesGeo.computeVertexNormals();
      const facesMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(facesGeo, facesMat));

      // Dynamic Cutting Section (Thiết diện tại tỉ lệ k)
      const k = cutHeightRatio;
      const A_prime = A.clone().lerp(S, 1 - k);
      const B_prime = B.clone().lerp(S, 1 - k);
      const C_prime = C.clone().lerp(S, 1 - k);
      const D_prime = D.clone().lerp(S, 1 - k);

      // Section polygon
      const secGeo = new THREE.BufferGeometry();
      const secVerts = new Float32Array([
        A_prime.x, A_prime.y, A_prime.z, B_prime.x, B_prime.y, B_prime.z, C_prime.x, C_prime.y, C_prime.z,
        A_prime.x, A_prime.y, A_prime.z, C_prime.x, C_prime.y, C_prime.z, D_prime.x, D_prime.y, D_prime.z,
      ]);
      secGeo.setAttribute('position', new THREE.BufferAttribute(secVerts, 3));
      secGeo.computeVertexNormals();
      const secMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        roughness: 0.2,
      });
      group.add(new THREE.Mesh(secGeo, secMat));

      // Outline of section
      const secEdgePoints = [A_prime, B_prime, B_prime, C_prime, C_prime, D_prime, D_prime, A_prime];
      const secEdgeGeo = new THREE.BufferGeometry().setFromPoints(secEdgePoints);
      const secEdgeMat = new THREE.LineBasicMaterial({ color: 0xfff, linewidth: 2 });
      group.add(new THREE.LineSegments(secEdgeGeo, secEdgeMat));
    }

    // -------------------------------------------------------------
    // MODE 4: Khối Tròn Xoay & Tích Phân Thể Tích 3D
    // -------------------------------------------------------------
    else if (mode === 'revolution_solid') {
      const points: THREE.Vector2[] = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * 4; // Length along axis
        let y = 1;
        if (revCurveType === 'parabola') {
          y = 0.5 + 0.15 * x * x; // Parabolic profile
        } else if (revCurveType === 'sine') {
          y = 1.2 + 0.5 * Math.sin(x * 1.5); // Wavy vase profile
        } else {
          y = 0.4 + 0.4 * x; // Cone profile
        }
        points.push(new THREE.Vector2(y, x));
      }

      const latheGeo = new THREE.LatheGeometry(points, revSegments);
      latheGeo.center();
      const latheMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.65,
        roughness: 0.2,
        metalness: 0.4,
        side: THREE.DoubleSide,
      });
      const latheMesh = new THREE.Mesh(latheGeo, latheMat);
      latheMesh.rotation.z = Math.PI / 2; // Lie along horizontal axis
      group.add(latheMesh);

      // Central Axis line
      const axisGeo = new THREE.CylinderGeometry(0.04, 0.04, 6, 8);
      axisGeo.rotateZ(Math.PI / 2);
      const axisMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      group.add(new THREE.Mesh(axisGeo, axisMat));
    }
  }, [mode, ux, uy, uz, vx, vy, vz, sphereRadius, planeDistance, cutHeightRatio, revSegments, revCurveType]);

  // Derived math calculations for display
  const uLen = Math.sqrt(ux * ux + uy * uy + uz * uz).toFixed(2);
  const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz).toFixed(2);
  const dotProd = ux * vx + uy * vy + uz * vz;
  const crossX = uy * vz - uz * vy;
  const crossY = uz * vx - ux * vz;
  const crossZ = ux * vy - uy * vx;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[620px]'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP HEADER OVERLAY */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white shadow-lg">
          <Box className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold tracking-wide">
            {mode === 'oxyz_vector' && t('math3d.oxyz', 'Hệ Trục Oxyz & Vector Tích Có Hướng', '3D Oxyz Coordinates & Cross Product')}
            {mode === 'sphere_plane' && t('math3d.sphere', 'Mặt Cầu & Mặt Phẳng Thiết Diện 3D', 'Sphere & Plane Intersection 3D')}
            {mode === 'pyramid_section' && t('math3d.pyramid', 'Khối Chóp & Mặt Cắt Thiết Diện Động', 'Pyramid & Dynamic Cross Section')}
            {mode === 'revolution_solid', t('math3d.revolution', 'Khối Tròn Xoay & Tích Phân Thể Tích', 'Solids of Revolution & Integration')}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Mode Switcher Pills */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-lg">
            <button
              onClick={() => setMode('oxyz_vector')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'oxyz_vector' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Vector Oxyz
            </button>
            <button
              onClick={() => setMode('sphere_plane')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'sphere_plane' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mặt Cầu
            </button>
            <button
              onClick={() => setMode('pyramid_section')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'pyramid_section' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Thiết Diện Chóp
            </button>
            <button
              onClick={() => setMode('revolution_solid')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                mode === 'revolution_solid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Khối Tròn Xoay
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ERGONOMIC COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl pointer-events-none z-20">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-4 text-white space-y-3 transition-all duration-300">
          {/* Header Row of Dock */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bảng Điều Khiển Tương Tác 3D</span>
            </div>
            <button
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span>{isControlsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {isControlsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

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
                          <span className="text-[10px] text-slate-400">x: {ux}</span>
                          <input type="range" min="-4" max="4" value={ux} onChange={(e) => setUx(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">y: {uy}</span>
                          <input type="range" min="-4" max="4" value={uy} onChange={(e) => setUy(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">z: {uz}</span>
                          <input type="range" min="-4" max="4" value={uz} onChange={(e) => setUz(Number(e.target.value))} className="w-full accent-amber-500 h-1" />
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
                          <span className="text-[10px] text-slate-400">x: {vx}</span>
                          <input type="range" min="-4" max="4" value={vx} onChange={(e) => setVx(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">y: {vy}</span>
                          <input type="range" min="-4" max="4" value={vy} onChange={(e) => setVy(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">z: {vz}</span>
                          <input type="range" min="-4" max="4" value={vz} onChange={(e) => setVz(Number(e.target.value))} className="w-full accent-cyan-500 h-1" />
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
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Bán kính mặt cầu (R):</span>
                        <span className="font-bold text-blue-400">{sphereRadius} m</span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="4.5"
                        step="0.1"
                        value={sphereRadius}
                        onChange={(e) => setSphereRadius(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300">Khoảng cách d(I, (P)):</span>
                        <span className="font-bold text-emerald-400">{planeDistance.toFixed(1)} m</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5.0"
                        step="0.1"
                        value={planeDistance}
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
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">Vị trí mặt cắt thiết diện (k = SM/SA):</span>
                      <span className="font-bold text-amber-400">{(cutHeightRatio * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.02"
                      value={cutHeightRatio}
                      onChange={(e) => setCutHeightRatio(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Kéo thanh trượt để di chuyển mặt phẳng cắt qua 4 cạnh bên chóp tứ giác, thiết diện biến đổi liên tục từ tứ giác nhỏ dần về đáy!
                  </div>
                </div>
              )}

              {/* Controls for Solids of Revolution */}
              {mode === 'revolution_solid' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
