import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCcw } from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

export interface LivePhoneTelemetry {
  ax: number;
  ay: number;
  az: number;
  beta: number;
  gamma: number;
}

interface PhoneSensor3DViewportProps {
  expMode: 'shm_spring' | 'pendulum_angle' | 'incline_tilt';
  telemetryRef: React.MutableRefObject<LivePhoneTelemetry>;
}

const SCRATCH_VEC = new THREE.Vector3();

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

export const PhoneSensor3DViewport: React.FC<PhoneSensor3DViewportProps> = ({
  expMode,
  telemetryRef
}) => {
  const { perfMode } = useBackgroundTheme();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const expModeRef = useRef(expMode);
  expModeRef.current = expMode;

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
      isSoftwareGl ? 1 : perfMode === 'smooth' ? Math.min(hostDpr, 1.15) : Math.min(hostDpr, 1.75)
    );
    renderer.setSize(container.clientWidth || 720, container.clientHeight || 300);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

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
    scene.background = new THREE.Color(0x060c1a);
    scene.fog = new THREE.FogExp2(0x060c1a, 0.025);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || 720) / (container.clientHeight || 300),
      0.1,
      80
    );
    camera.position.set(0, 3.8, 7.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 1.3, 0);
    controls.update();

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(5, 10, 6);
    scene.add(key);

    const grid = new THREE.GridHelper(14, 14, 0x10b981, 0x1e293b);
    scene.add(grid);

    // ==================== LEFT: COMPOSITE 3D SMARTPHONE DIGITAL TWIN ====================
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(-2.1, 1.5, 0);
    scene.add(phoneGroup);

    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.88,
      clearcoat: 0.7
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.2
    });
    const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.05, 0.12), chassisMat);
    const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 1.88), screenMat);
    phoneScreen.position.z = 0.065;
    const camBump = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.36, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 })
    );
    camBump.position.set(-0.28, 0.72, -0.07);
    phoneGroup.add(phoneBody, phoneScreen, camBump);

    // 3D Live Acceleration Vectors attached to smartphone
    const arrowAx = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0xf43f5e);
    const arrowAy = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, 0x34d399);
    const arrowAz = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 1, 0x38bdf8);
    phoneGroup.add(arrowAx, arrowAy, arrowAz);

    // ==================== RIGHT: SYNCHRONIZED 3D PHYSICS APPARATUS ====================
    const appGroup = new THREE.Group();
    appGroup.position.set(2.1, 0, 0);
    scene.add(appGroup);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.8 });
    const cyanMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.25, metalness: 0.6 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.28, metalness: 0.7 });

    // Rig Frame
    const rigPost = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.2, 0.16), steelMat);
    rigPost.position.set(-1.3, 1.6, 0);
    const rigArm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 0.16), steelMat);
    rigArm.position.set(-0.45, 3.15, 0);
    appGroup.add(rigPost, rigArm);

    // Spring Mass
    const springMass = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), amberMat);
    appGroup.add(springMass);

    // Pendulum
    const pendPivot = new THREE.Group();
    pendPivot.position.set(0, 3.1, 0);
    appGroup.add(pendPivot);
    const pendRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 10), steelMat);
    pendRod.position.y = -1.0;
    const pendBob = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), cyanMat);
    pendBob.position.y = -2.0;
    pendPivot.add(pendRod, pendBob);

    // Incline Ramp
    const rampPlank = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.1), steelMat);
    rampPlank.position.set(0, 0.75, 0);
    const rampCube = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), amberMat);
    rampCube.position.y = 0.24;
    rampPlank.add(rampCube);
    appGroup.add(rampPlank);

    resetCamRef.current = () => {
      camera.position.set(0, 3.8, 7.6);
      controls.target.set(0, 1.3, 0);
      controls.update();
    };

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    let rafId = 0;
    let alive = true;
    const clock = new THREE.Clock();

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
      const dt = Math.min(0.05, clock.getDelta());
      const t = telemetryRef.current;
      const mode = expModeRef.current;

      // Rotate 3D Phone Digital Twin smoothly
      const targetRotX = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(t.beta, -75, 75));
      const targetRotZ = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(-t.gamma, -75, 75));
      phoneGroup.rotation.x = THREE.MathUtils.damp(phoneGroup.rotation.x, targetRotX, 10, dt);
      phoneGroup.rotation.z = THREE.MathUtils.damp(phoneGroup.rotation.z, targetRotZ, 10, dt);

      // Acceleration vector arrow scaling
      const lx = Math.min(1.6, Math.max(0.25, Math.abs(t.ax) * 0.25));
      const ly = Math.min(1.6, Math.max(0.25, Math.abs(t.ay) * 0.25));
      const lz = Math.min(1.6, Math.max(0.25, Math.abs(t.az) * 0.12));
      arrowAx.setDirection(SCRATCH_VEC.set(t.ax >= 0 ? 1 : -1, 0, 0));
      arrowAx.setLength(lx);
      arrowAy.setDirection(SCRATCH_VEC.set(0, t.ay >= 0 ? 1 : -1, 0));
      arrowAy.setLength(ly);
      arrowAz.setDirection(SCRATCH_VEC.set(0, 0, t.az >= 0 ? 1 : -1));
      arrowAz.setLength(lz);

      // Synchronized 3D Apparatus Twin
      springMass.visible = mode === 'shm_spring';
      pendPivot.visible = mode === 'pendulum_angle';
      rampPlank.visible = mode === 'incline_tilt';

      if (mode === 'shm_spring') {
        const yOff = THREE.MathUtils.clamp(t.ay * 0.22, -0.85, 0.85);
        springMass.position.set(0, 1.5 + yOff, 0);
      } else if (mode === 'pendulum_angle') {
        pendPivot.rotation.z = THREE.MathUtils.damp(
          pendPivot.rotation.z,
          THREE.MathUtils.degToRad(THREE.MathUtils.clamp(t.beta * 0.9, -55, 55)),
          10,
          dt
        );
      } else {
        rampPlank.rotation.z = THREE.MathUtils.damp(
          rampPlank.rotation.z,
          THREE.MathUtils.degToRad(THREE.MathUtils.clamp(t.beta * 0.6, -45, 45)),
          10,
          dt
        );
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
  }, [perfMode, telemetryRef]);

  return (
    <div className="relative w-full h-[290px] sm:h-[320px] rounded-lg overflow-hidden border border-emerald-500/30 bg-[#060c1a] select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 text-emerald-300 text-xs font-mono">
          Restoring 3D Sensor Twin...
        </div>
      )}

      <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded bg-slate-950/88 border border-emerald-400/35 text-[11px] font-mono font-bold text-emerald-300">
        3D DIGITAL TWIN · PHONE GYRO &amp; PHYSICS RIG
      </div>

      <button
        type="button"
        onClick={() => resetCamRef.current?.()}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded border border-slate-700 bg-slate-950/88 text-slate-200 cursor-pointer"
        title="Reset Camera"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
