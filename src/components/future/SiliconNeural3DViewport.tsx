import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

export interface NeuralGraphSnapshot {
  sizes: number[];
  weights: number[][][];
  predict: (x: number, y: number) => number;
  points: { x: number; y: number; label: number }[];
}

export interface SiliconDieSnapshot {
  circuitPreset: 'full_adder' | 'adder_4bit' | 'sr_latch' | 'mux_alu';
  bitsA: [number, number, number, number];
  bitsB: [number, number, number, number];
  carryIn: number;
  sumBits: number[];
  carries: number[];
  cout: number;
  srSet: number;
  srReset: number;
  srQ: number;
}

interface SiliconNeural3DViewportProps {
  mode: 'neural' | 'silicon';
  neuralSnapRef: React.MutableRefObject<NeuralGraphSnapshot>;
  siliconSnap: SiliconDieSnapshot;
}

const SURFACE_SEG = 20;
const SCRATCH_COLOR = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|Software|Basic Render/i.test(r);
  } catch {
    return false;
  }
}

export const SiliconNeural3DViewport: React.FC<SiliconNeural3DViewportProps> = ({
  mode,
  neuralSnapRef,
  siliconSnap
}) => {
  const { perfMode } = useBackgroundTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const siliconRef = useRef(siliconSnap);
  siliconRef.current = siliconSnap;

  const [contextLost, setContextLost] = useState(false);
  const resetCamRef = useRef<(() => void) | null>(null);

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
      return;
    }

    const hostDpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.5)
    );
    renderer.setSize(container.clientWidth || 760, container.clientHeight || 340);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

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
    scene.background = new THREE.Color(0x050a18);
    scene.fog = new THREE.FogExp2(0x050a18, 0.025);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 760) / (container.clientHeight || 340),
      0.1,
      100
    );
    camera.position.set(0, 5.2, 8.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.5;
    controls.maxDistance = 20;
    controls.target.set(0, 0.8, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(6, 10, 6);
    scene.add(key);

    const grid = new THREE.GridHelper(16, 16, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.02;
    scene.add(grid);

    // ==================== MODE A: 3D NEURAL MANIFOLD + 3D GRAPH ====================
    const neuralGroup = new THREE.Group();
    scene.add(neuralGroup);

    // Deforming 3D Decision Boundary Heightfield on Left (x in [-4.4, -0.4])
    const surfaceGeo = new THREE.PlaneGeometry(3.8, 3.8, SURFACE_SEG, SURFACE_SEG);
    surfaceGeo.rotateX(-Math.PI / 2);
    const vertCount = surfaceGeo.attributes.position.count;
    const colorsAttr = new Float32Array(vertCount * 3);
    surfaceGeo.setAttribute('color', new THREE.BufferAttribute(colorsAttr, 3));
    const surfaceMesh = new THREE.Mesh(
      surfaceGeo,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.35,
        metalness: 0.25,
        side: THREE.DoubleSide
      })
    );
    surfaceMesh.position.set(-2.35, 0.9, 0);
    neuralGroup.add(surfaceMesh);

    const surfaceWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(surfaceGeo),
      new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.16 })
    );
    surfaceWire.position.copy(surfaceMesh.position);
    neuralGroup.add(surfaceWire);

    // Data point scatter spheres on manifold (max 160)
    const ptInst = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.065, 10, 10),
      new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.4 }),
      180
    );
    ptInst.frustumCulled = false;
    neuralGroup.add(ptInst);

    // 3D Neural Network Graph on Right (x in [0.4, 4.4])
    const graphGroup = new THREE.Group();
    graphGroup.position.set(2.45, 1.5, 0);
    neuralGroup.add(graphGroup);

    const MAX_NODES = 32;
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.65
    });
    const nodeInst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 14, 14), nodeMat, MAX_NODES);
    nodeInst.frustumCulled = false;
    graphGroup.add(nodeInst);

    const MAX_EDGES = 180;
    const edgePos = new Float32Array(MAX_EDGES * 6);
    const edgeCol = new Float32Array(MAX_EDGES * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeCol, 3));
    const edgeLines = new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.88 })
    );
    graphGroup.add(edgeLines);

    // ==================== MODE B: 3D SILICON DIE & ALU ====================
    const siliconGroup = new THREE.Group();
    scene.add(siliconGroup);

    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.22, 4.6),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.55, metalness: 0.35 })
    );
    pcb.position.y = 0.11;
    siliconGroup.add(pcb);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.22, metalness: 0.92 });
    for (let i = -3; i <= 3; i++) {
      const pinF = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.45), goldMat);
      pinF.position.set(i * 1.0, 0.08, 2.45);
      siliconGroup.add(pinF);
      const pinB = pinF.clone();
      pinB.position.z = -2.45;
      siliconGroup.add(pinB);
    }

    // 4 Full Adder Gate Monoliths + Cout Beacon
    const faBoxes: THREE.Mesh[] = [];
    const faMats: THREE.MeshStandardMaterial[] = [];
    const sumBeacons: THREE.Mesh[] = [];
    const sumMats: THREE.MeshStandardMaterial[] = [];
    const carryBuses: THREE.Mesh[] = [];
    const carryMats: THREE.MeshStandardMaterial[] = [];

    for (let i = 0; i < 4; i++) {
      const x = (1.5 - i) * 1.75; // MSB on left
      const faMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.8
      });
      const fa = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.65, 1.35), faMat);
      fa.position.set(x, 0.55, 0);
      siliconGroup.add(fa);
      faBoxes.push(fa);
      faMats.push(faMat);

      const sMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.1,
        roughness: 0.25
      });
      const sb = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.32, 18), sMat);
      sb.position.set(x, 1.04, 0.35);
      siliconGroup.add(sb);
      sumBeacons.push(sb);
      sumMats.push(sMat);

      const cMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.1,
        roughness: 0.25
      });
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.18), cMat);
      bus.position.set(x - 0.88, 0.36, -0.35);
      siliconGroup.add(bus);
      carryBuses.push(bus);
      carryMats.push(cMat);
    }

    const latchCubeMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.65
    });
    const latchCube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 2.2), latchCubeMat);
    latchCube.position.set(0, 0.9, 0);
    siliconGroup.add(latchCube);

    resetCamRef.current = () => {
      camera.position.set(0, 5.2, 8.2);
      controls.target.set(0, 0.8, 0);
      controls.update();
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 760;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const scratchMat = new THREE.Matrix4();
    const scratchPos = new THREE.Vector3();
    const scratchQuat = new THREE.Quaternion();
    const scratchScale = new THREE.Vector3(1, 1, 1);

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
        const s = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (s === gl.UNSIGNALED) rafId = window.setTimeout(poll, 5);
        else {
          gl.deleteSync(sync);
          rafId = window.setTimeout(cb, 80);
        }
      };
      rafId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (!alive) return;
      const curMode = modeRef.current;
      neuralGroup.visible = curMode === 'neural';
      siliconGroup.visible = curMode === 'silicon';

      if (curMode === 'neural') {
        const snap = neuralSnapRef.current;
        // 1. Deform Decision Surface
        const posAttr = surfaceGeo.attributes.position as THREE.BufferAttribute;
        const colAttr = surfaceGeo.attributes.color as THREE.BufferAttribute;
        for (let i = 0; i < posAttr.count; i++) {
          const lx = posAttr.getX(i);
          const lz = posAttr.getZ(i);
          const nx = lx / 1.9;
          const ny = -lz / 1.9;
          const v = THREE.MathUtils.clamp(snap.predict(nx, ny), -1, 1);
          posAttr.setY(i, v * 0.72);
          const t = (v + 1) * 0.5;
          SCRATCH_COLOR.setRGB(
            THREE.MathUtils.lerp(0.95, 0.08, t),
            THREE.MathUtils.lerp(0.24, 0.65, t),
            THREE.MathUtils.lerp(0.36, 0.94, t)
          );
          colAttr.setXYZ(i, SCRATCH_COLOR.r, SCRATCH_COLOR.g, SCRATCH_COLOR.b);
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        surfaceGeo.computeVertexNormals();

        // Update scatter dataset points on surface
        const pts = snap.points;
        const nPts = Math.min(180, pts.length);
        ptInst.count = nPts;
        for (let i = 0; i < nPts; i++) {
          const pt = pts[i];
          const py = 0.9 + THREE.MathUtils.clamp(snap.predict(pt.x, pt.y), -1, 1) * 0.72 + 0.08;
          scratchMat.compose(
            scratchPos.set(-2.35 + pt.x * 1.9, py, -pt.y * 1.9),
            scratchQuat,
            scratchScale
          );
          ptInst.setMatrixAt(i, scratchMat);
          ptInst.setColorAt(i, SCRATCH_COLOR.setHex(pt.label > 0 ? 0x38bdf8 : 0xfb7185));
        }
        ptInst.instanceMatrix.needsUpdate = true;
        if (ptInst.instanceColor) ptInst.instanceColor.needsUpdate = true;

        // 2. Update 3D Neural Network Graph
        const sizes = snap.sizes;
        const nodePositions: THREE.Vector3[][] = [];
        let nodeIdx = 0;
        for (let l = 0; l < sizes.length; l++) {
          const cnt = sizes[l];
          const x = -1.75 + (l / Math.max(1, sizes.length - 1)) * 3.5;
          const col: THREE.Vector3[] = [];
          for (let j = 0; j < cnt; j++) {
            const y = ((j + 1) / (cnt + 1) - 0.5) * 2.4;
            const z = ((l % 2 === 0 ? 1 : -1) * 0.25);
            const vec = new THREE.Vector3(x, y, z);
            col.push(vec);
            if (nodeIdx < MAX_NODES) {
              scratchMat.compose(vec, scratchQuat, scratchScale);
              nodeInst.setMatrixAt(nodeIdx, scratchMat);
              nodeInst.setColorAt(
                nodeIdx,
                SCRATCH_COLOR.setHex(l === 0 ? 0xa78bfa : l === sizes.length - 1 ? 0xfbbf24 : 0x38bdf8)
              );
              nodeIdx++;
            }
          }
          nodePositions.push(col);
        }
        nodeInst.count = nodeIdx;
        nodeInst.instanceMatrix.needsUpdate = true;
        if (nodeInst.instanceColor) nodeInst.instanceColor.needsUpdate = true;

        let eIdx = 0;
        for (let l = 0; l < snap.weights.length; l++) {
          for (let j = 0; j < snap.weights[l].length; j++) {
            for (let k = 0; k < snap.weights[l][j].length; k++) {
              if (eIdx >= MAX_EDGES) break;
              const w = snap.weights[l][j][k];
              const from = nodePositions[l][k];
              const to = nodePositions[l + 1][j];
              edgePos[eIdx * 6] = from.x;
              edgePos[eIdx * 6 + 1] = from.y;
              edgePos[eIdx * 6 + 2] = from.z;
              edgePos[eIdx * 6 + 3] = to.x;
              edgePos[eIdx * 6 + 4] = to.y;
              edgePos[eIdx * 6 + 5] = to.z;

              const intensity = Math.min(1, 0.28 + Math.abs(w) * 0.6);
              if (w >= 0) {
                edgeCol[eIdx * 6] = 0.15 * intensity;
                edgeCol[eIdx * 6 + 1] = 0.78 * intensity;
                edgeCol[eIdx * 6 + 2] = 1.0 * intensity;
              } else {
                edgeCol[eIdx * 6] = 1.0 * intensity;
                edgeCol[eIdx * 6 + 1] = 0.35 * intensity;
                edgeCol[eIdx * 6 + 2] = 0.55 * intensity;
              }
              edgeCol[eIdx * 6 + 3] = edgeCol[eIdx * 6];
              edgeCol[eIdx * 6 + 4] = edgeCol[eIdx * 6 + 1];
              edgeCol[eIdx * 6 + 5] = edgeCol[eIdx * 6 + 2];
              eIdx++;
            }
          }
        }
        edgeGeo.setDrawRange(0, eIdx * 2);
        edgeGeo.attributes.position.needsUpdate = true;
        edgeGeo.attributes.color.needsUpdate = true;
      } else {
        const sil = siliconRef.current;
        const isLatch = sil.circuitPreset === 'sr_latch';
        latchCube.visible = isLatch;
        faBoxes.forEach((b, i) => {
          b.visible = !isLatch;
          sumBeacons[i].visible = !isLatch;
          carryBuses[i].visible = !isLatch;
        });

        if (isLatch) {
          const invalid = sil.srSet === 1 && sil.srReset === 1;
          latchCubeMat.color.setHex(invalid ? 0xf43f5e : sil.srQ ? 0x10b981 : 0x334155);
          latchCubeMat.emissive.setHex(invalid ? 0xe11d48 : sil.srQ ? 0x059669 : 0x1e293b);
          latchCubeMat.emissiveIntensity = sil.srQ || invalid ? 1.15 : 0.25;
        } else {
          for (let i = 0; i < 4; i++) {
            const active = sil.bitsA[i] || sil.bitsB[i];
            faMats[i].emissiveIntensity = active ? 0.65 : 0.15;
            const sOn = sil.sumBits[i] === 1;
            sumMats[i].emissiveIntensity = sOn ? 1.5 : 0.08;
            sumMats[i].color.setHex(sOn ? 0x34d399 : 0x1e293b);
            const cOn = sil.carries[i] === 1;
            carryMats[i].emissiveIntensity = cOn ? 1.4 : 0.08;
            carryMats[i].color.setHex(cOn ? 0xfbbf24 : 0x334155);
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);

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
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      envRT.dispose();
      renderer.dispose();
    };
  }, [neuralSnapRef, perfMode]);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] rounded-lg overflow-hidden border border-cyan-500/30 bg-[#050a18] select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 text-cyan-300 text-xs font-mono">
          Restoring 3D WebGL...
        </div>
      )}

      <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded bg-slate-950/88 border border-cyan-400/35 text-[11px] font-mono font-bold text-cyan-300">
        {mode === 'neural'
          ? '3D BACKPROP DECISION MANIFOLD & SYNAPSE GRAPH'
          : '3D SILICON DIE · 4-BIT ALU & LOGIC GATES'}
      </div>

      <button
        type="button"
        onClick={() => resetCamRef.current?.()}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded border border-slate-700 bg-slate-950/88 text-slate-200 cursor-pointer"
        title="Reset 3D Camera"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
