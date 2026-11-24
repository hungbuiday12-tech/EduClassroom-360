import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeetGraphicsQuality } from './meetTypes';
import {
  createCrispLine2,
  createPostProcessingPipeline,
  GPUParticlePool,
  PostProcessPipeline,
  syncLine2Resolution,
} from '../../lib/three3DEnhancements';

interface MeetLobbyAmbientStageProps {
  graphicsQuality: MeetGraphicsQuality;
}

function detectSoftwareGl(): boolean {
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
}

export const MeetLobbyAmbientStage: React.FC<MeetLobbyAmbientStageProps> = ({ graphicsQuality }) => {
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const webglMountRef = useRef<HTMLDivElement | null>(null);

  // MEDIUM TIER: Interactive 2D Constellation & Isometric Wave Grid
  useEffect(() => {
    if (graphicsQuality !== 'medium') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let rafId = 0;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const nodes = Array.from({ length: 34 }, (_, idx) => ({
      x: (idx * 97) % 100 / 100,
      y: (idx * 53 + 17) % 100 / 100,
      vx: ((idx % 5) - 2) * 0.00018,
      vy: (((idx + 2) % 5) - 2) * 0.00014,
      r: 1.4 + (idx % 3) * 0.7,
    }));

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.ty = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let time = 0;
    let lastTs = performance.now();

    const draw = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      time += dt;

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Subtle technical grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      const step = 56;
      const offX = (pointer.x * 16) % step;
      const offY = (pointer.y * 16) % step;
      ctx.beginPath();
      for (let x = offX; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = offY; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Sinusoidal phase wave ribbons
      for (let band = 0; band < 2; band++) {
        ctx.beginPath();
        ctx.strokeStyle = band === 0 ? 'rgba(56, 189, 248, 0.14)' : 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = 1.4;
        for (let x = 0; x <= width; x += 24) {
          const y =
            height * (0.28 + band * 0.42) +
            Math.sin(x * 0.006 + time * (0.8 + band * 0.25) + band * 1.4) * (24 + band * 10) +
            pointer.y * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Constellation nodes + links
      const pxCoords = nodes.map((n) => {
        n.x = (n.x + n.vx + 1) % 1;
        n.y = (n.y + n.vy + 1) % 1;
        return {
          x: n.x * width + pointer.x * 12,
          y: n.y * height + pointer.y * 12,
          r: n.r,
        };
      });

      ctx.strokeStyle = 'rgba(125, 211, 252, 0.11)';
      ctx.lineWidth = 0.85;
      for (let i = 0; i < pxCoords.length; i++) {
        for (let j = i + 1; j < pxCoords.length; j++) {
          const dx = pxCoords[i].x - pxCoords[j].x;
          const dy = pxCoords[i].y - pxCoords[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 185 * 185) {
            ctx.beginPath();
            ctx.moveTo(pxCoords[i].x, pxCoords[i].y);
            ctx.lineTo(pxCoords[j].x, pxCoords[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pxCoords) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.48)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [graphicsQuality]);

  // HIGH TIER: Real Interactive Three.js WebGL Backdrop Diorama + Bloom/SMAA
  useEffect(() => {
    if (graphicsQuality !== 'high') return;
    const mount = webglMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.045);

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, w / Math.max(1, h), 0.1, 60);
    camera.position.set(0, 0.35, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x020617, 0);
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x090d1a, 0.9);
    const key = new THREE.DirectionalLight(0xfff1d6, 2.0);
    key.position.set(4, 6, 5);
    const rim = new THREE.PointLight(0x38bdf8, 4.5, 18);
    rim.position.set(2.5, 1.5, 3);
    const accent = new THREE.PointLight(0xa855f7, 3.6, 16);
    accent.position.set(-2.5, -1.2, 2.4);
    scene.add(hemi, key, rim, accent);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Hero spatial gyroscope positioned subtly on right-center backdrop
    const assembly = new THREE.Group();
    assembly.position.set(2.35, 0.15, -1.2);
    scene.add(assembly);

    const titaniumMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        metalness: 0.88,
        roughness: 0.16,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
      })
    );
    const darkAnodizedMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        metalness: 0.78,
        roughness: 0.24,
        clearcoat: 0.7,
      })
    );
    const coreMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x7dd3fc,
        emissive: 0x0ea5e9,
        emissiveIntensity: 1.35,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
      })
    );
    const violetNodeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 1.15,
        roughness: 0.18,
      })
    );
    const emeraldNodeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x34d399,
        emissive: 0x059669,
        emissiveIntensity: 1.05,
        roughness: 0.2,
      })
    );

    const coreCrystal = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.62, 0)), coreMat);
    const coreWire = new THREE.Mesh(
      trackGeo(new THREE.IcosahedronGeometry(0.84, 0)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.35 }))
    );
    assembly.add(coreCrystal, coreWire);

    const ring1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.42, 0.045, 16, 72)), titaniumMat);
    const ring2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.88, 0.036, 14, 72)), darkAnodizedMat);
    const ring3 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(2.34, 0.025, 12, 80)), titaniumMat);

    // Satellites mounted on rings
    const satGeo = trackGeo(new THREE.SphereGeometry(0.11, 16, 16));
    const sat1 = new THREE.Mesh(satGeo, violetNodeMat);
    sat1.position.set(1.42, 0, 0);
    ring1.add(sat1);

    const sat2 = new THREE.Mesh(satGeo, emeraldNodeMat);
    sat2.position.set(0, 1.88, 0);
    ring2.add(sat2);

    const sat3 = new THREE.Mesh(satGeo, coreMat);
    sat3.position.set(-2.34, 0, 0);
    ring3.add(sat3);

    ring1.rotation.set(0.55, 0.2, 0);
    ring2.rotation.set(-0.4, 0.85, 0.3);
    ring3.rotation.set(1.1, -0.35, 0.45);
    assembly.add(ring1, ring2, ring3);

    // Precision Line2 dashed orbital halo
    const haloPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      haloPts.push(new THREE.Vector3(Math.cos(a) * 2.85, Math.sin(a) * 0.55, Math.sin(a) * 2.85));
    }
    const haloLine = createCrispLine2(haloPts, {
      color: 0x38bdf8,
      linewidth: 1.6,
      dashed: true,
      dashSize: 0.22,
      gapSize: 0.16,
      transparent: true,
      opacity: 0.42,
    });
    assembly.add(haloLine);

    // Secondary balanced geometry cluster on bottom-left for depth
    const leftCluster = new THREE.Group();
    leftCluster.position.set(-3.4, -1.2, -2.5);
    const leftDodeca = new THREE.Mesh(
      trackGeo(new THREE.DodecahedronGeometry(0.75, 0)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.22 }))
    );
    leftCluster.add(leftDodeca);
    scene.add(leftCluster);

    // Ambient volumetric starfield + GPU spark pool
    const starCount = 180;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 18;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const starGeo = trackGeo(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = trackMat(
      new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.048,
        transparent: true,
        opacity: 0.55,
      })
    );
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const particlePool = new GPUParticlePool(56, 0.036, 0x38bdf8, 0xc084fc);
    scene.add(particlePool.mesh);

    let postPipeline: PostProcessPipeline | null = null;
    if (!isSoftwareGl) {
      postPipeline = createPostProcessingPipeline(renderer, scene, camera, {
        bloomIntensity: 0.44,
        luminanceThreshold: 0.78,
        enableSmaa: true,
      });
      postPipeline.setSize(w, h);
    }
    syncLine2Resolution(scene, w, h);

    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.x = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerTarget.y = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const nw = mount.clientWidth || window.innerWidth;
      const nh = mount.clientHeight || window.innerHeight;
      camera.aspect = nw / Math.max(1, nh);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      postPipeline?.setSize(nw, nh);
      syncLine2Resolution(scene, nw, nh);
    });
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let sparkAcc = 0;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 8);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 8);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.elapsedTime;

      pointerSmooth.x = THREE.MathUtils.damp(pointerSmooth.x, pointerTarget.x, 4.5, dt);
      pointerSmooth.y = THREE.MathUtils.damp(pointerSmooth.y, pointerTarget.y, 4.5, dt);

      assembly.position.x = 2.35 + pointerSmooth.x * 0.45;
      assembly.position.y = 0.15 - pointerSmooth.y * 0.35 + Math.sin(elapsed * 0.85) * 0.12;
      assembly.rotation.y = pointerSmooth.x * 0.25;
      assembly.rotation.x = pointerSmooth.y * 0.18;

      coreCrystal.rotation.y += dt * 0.72;
      coreCrystal.rotation.x += dt * 0.35;
      coreWire.rotation.y -= dt * 0.38;
      coreMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 2.2) * 0.25;

      ring1.rotation.z += dt * 0.62;
      ring1.rotation.y += dt * 0.24;
      ring2.rotation.x += dt * 0.48;
      ring2.rotation.z -= dt * 0.22;
      ring3.rotation.y -= dt * 0.34;
      haloLine.rotation.y += dt * 0.16;

      leftCluster.rotation.y += dt * 0.22;
      leftCluster.rotation.x -= dt * 0.15;
      stars.rotation.y += dt * 0.028;

      sparkAcc += dt;
      if (sparkAcc > 0.16) {
        sparkAcc = 0;
        const a = Math.random() * Math.PI * 2;
        const rad = 0.9 + Math.random() * 1.4;
        particlePool.spawn(
          assembly.position.x + Math.cos(a) * rad,
          assembly.position.y + (Math.random() - 0.5) * 1.4,
          assembly.position.z + Math.sin(a) * rad,
          (Math.random() - 0.5) * 0.25,
          0.25 + Math.random() * 0.35,
          (Math.random() - 0.5) * 0.25,
          1.4,
          0.95
        );
      }
      particlePool.update(dt, 0.04);

      if (postPipeline) postPipeline.render(dt);
      else renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      haloLine.geometry.dispose();
      haloLine.material.dispose();
      particlePool.dispose();
      postPipeline?.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [graphicsQuality]);

  if (graphicsQuality === 'low') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-55"
        style={{
          backgroundImage:
            'radial-gradient(rgba(56, 189, 248, 0.14) 1px, transparent 1px), linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, transparent 55%)',
          backgroundSize: '28px 28px, 100% 100%',
        }}
      />
    );
  }

  if (graphicsQuality === 'medium') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <canvas ref={canvas2dRef} className="h-full w-full block" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 78% 42%, rgba(14, 165, 233, 0.14), transparent 65%), radial-gradient(ellipse 55% 45% at 18% 82%, rgba(139, 92, 246, 0.11), transparent 65%)',
        }}
      />
      <div ref={webglMountRef} className="h-full w-full" />
    </div>
  );
};

export default MeetLobbyAmbientStage;
