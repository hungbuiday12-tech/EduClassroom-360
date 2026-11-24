import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PerformanceMode } from '../../context/BackgroundContext';
import {
  GPUParticlePool,
  createPostProcessingPipeline,
  PostProcessPipeline,
} from '../../lib/three3DEnhancements';

interface TypingArenaBackdropProps {
  perfMode: PerformanceMode;
  wpm: number;
  combo: number;
  isPlaying: boolean;
  burstTick: number;
  errorTick: number;
  overdriveActive?: boolean;
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

export const TypingArenaBackdrop: React.FC<TypingArenaBackdropProps> = ({
  perfMode,
  wpm,
  combo,
  isPlaying,
  burstTick,
  errorTick,
  overdriveActive = false,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);

  const liveRef = useRef({
    wpm: 0,
    combo: 0,
    isPlaying: false,
    burstFlash: 0,
    errorFlash: 0,
    overdrive: false,
  });

  liveRef.current.wpm = wpm;
  liveRef.current.combo = combo;
  liveRef.current.isPlaying = isPlaying;
  liveRef.current.overdrive = overdriveActive;

  const prevBurstRef = useRef(burstTick);
  if (burstTick !== prevBurstRef.current) {
    prevBurstRef.current = burstTick;
    liveRef.current.burstFlash = 1;
  }

  const prevErrorRef = useRef(errorTick);
  if (errorTick !== prevErrorRef.current) {
    prevErrorRef.current = errorTick;
    liveRef.current.errorFlash = 1;
  }

  // Balanced & Ultra-Software-Fallback 2D Dynamic Canvas
  useEffect(() => {
    if (perfMode === 'smooth') return;
    const isSw = perfMode === 'ultra' ? detectSoftwareGl() : false;
    if (perfMode === 'ultra' && !isSw) return; // Hardware Ultra uses WebGL stage below

    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let w = 900;
    let h = 560;

    const syncSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, perfMode === 'ultra' ? 1.5 : 1.35);
      w = Math.max(320, parent.clientWidth);
      h = Math.max(260, parent.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const starCount = perfMode === 'ultra' ? 68 : 36;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: ((i * 137) % 100) / 100,
      y: ((i * 211) % 100) / 100,
      r: 1 + (i % 3) * 0.75,
      speed: 0.25 + (i % 5) * 0.14,
      phase: i * 0.7,
    }));

    const ripples: Array<{ x: number; y: number; r: number; maxR: number; color: string; alpha: number }> = [];
    let lastBurstSeen = burstTick;
    let lastErrorSeen = errorTick;
    let lastNow = performance.now();

    const frame = (now: number) => {
      if (!reduceMotion) {
        rafId = requestAnimationFrame(frame);
      }
      if (document.hidden || now - lastNow < 28) return;
      const dt = Math.min(0.08, (now - lastNow) / 1000);
      lastNow = now;
      const t = now * 0.001;
      const st = liveRef.current;

      if (prevBurstRef.current !== lastBurstSeen) {
        lastBurstSeen = prevBurstRef.current;
        ripples.push({
          x: w * (0.28 + Math.random() * 0.44),
          y: h * (0.3 + Math.random() * 0.35),
          r: 8,
          maxR: 130 + Math.min(90, st.combo * 3),
          color: st.combo >= 10 ? '251, 191, 36' : '56, 189, 248',
          alpha: 0.55,
        });
      }
      if (prevErrorRef.current !== lastErrorSeen) {
        lastErrorSeen = prevErrorRef.current;
        ripples.push({
          x: w * 0.5,
          y: h * 0.62,
          r: 10,
          maxR: 140,
          color: '244, 63, 94',
          alpha: 0.45,
        });
      }

      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, w, h);

      // Subtle architectural grid perspective lines
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.07)' : 'rgba(2, 132, 199, 0.07)';
      ctx.lineWidth = 1;
      const step = 48;
      const pan = (t * (12 + Math.min(80, st.wpm * 0.7))) % step;
      for (let gx = -pan; gx < w; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Harmonic wave ribbons reactive to WPM
      const speedFactor = 1 + Math.min(2.8, st.wpm / 35);
      const waveCount = perfMode === 'ultra' ? 3 : 2;
      for (let wv = 0; wv < waveCount; wv++) {
        ctx.beginPath();
        const baseY = h * (0.42 + wv * 0.14);
        const amp = (14 + wv * 7) * (1 + Math.min(0.9, st.combo * 0.025));
        for (let x = 0; x <= w; x += 22) {
          const y =
            baseY +
            Math.sin(x * 0.008 + t * speedFactor * (1.2 + wv * 0.35) + wv) * amp +
            Math.cos(x * 0.015 - t * 0.9) * (amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          wv === 0
            ? isDark
              ? 'rgba(56, 189, 248, 0.24)'
              : 'rgba(14, 165, 233, 0.2)'
            : wv === 1
            ? isDark
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(5, 150, 105, 0.16)'
            : isDark
            ? 'rgba(251, 191, 36, 0.2)'
            : 'rgba(217, 119, 6, 0.16)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Kinetic particles streaming right-to-left like wind
      const velScale = 0.06 + Math.min(0.45, st.wpm * 0.0045);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!reduceMotion) {
          s.x -= s.speed * velScale * dt;
          if (s.x < -0.02) s.x = 1.02;
        }
        const sx = s.x * w;
        const sy = s.y * h;
        const pulse = 0.55 + 0.45 * Math.sin(t * 2.4 + s.phase);
        ctx.fillStyle = isDark
          ? `rgba(125, 211, 252, ${(0.42 * pulse).toFixed(2)})`
          : `rgba(2, 132, 199, ${(0.3 * pulse).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Word-clear / error shockwaves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 240 * dt;
        rp.alpha *= Math.pow(0.08, dt);
        if (rp.r >= rp.maxR || rp.alpha <= 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${rp.color}, ${rp.alpha.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      st.burstFlash = Math.max(0, st.burstFlash - dt * 3);
      st.errorFlash = Math.max(0, st.errorFlash - dt * 3);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [perfMode, burstTick, errorTick]);

  // Hardware Ultra Three.js WebGL Stage
  useEffect(() => {
    if (perfMode !== 'ultra') return;
    if (detectSoftwareGl()) return;
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let disposed = false;
    let rafId = 0;

    const width = Math.max(320, host.clientWidth);
    const height = Math.max(260, host.clientHeight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 1.4, 9.2);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xbae6fd, 0.65);
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.45);
    keyLight.position.set(4, 7, 5);
    const rimLight = new THREE.PointLight(0x34d399, 2.2, 18);
    rimLight.position.set(-4, 2, 3);
    scene.add(ambient, keyLight, rimLight);

    // Cyber horizon grid
    const grid = new THREE.GridHelper(28, 28, 0x38bdf8, 0x0ea5e9);
    grid.position.y = -2.6;
    const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.18;
    });
    scene.add(grid);

    // Central floating translucent prism & orbital rings
    const centerpiece = new THREE.Group();
    centerpiece.position.set(0, 0.25, -2.5);
    scene.add(centerpiece);

    const crystalGeo = new THREE.OctahedronGeometry(1.15, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.55,
      thickness: 0.8,
      clearcoat: 1,
      transparent: true,
      opacity: 0.86,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    centerpiece.add(crystal);

    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.032, 12, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.75,
      metalness: 0.75,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.34;
    centerpiece.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.025, 10, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
      metalness: 0.75,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI * 0.25;
    ring2.rotation.x = -Math.PI * 0.28;
    centerpiece.add(ring2);

    // 3D Starfield Tunnel
    const starCount = 260;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 26;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPositions[i * 3 + 2] = -Math.random() * 34;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.09,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // GPU Particle Pool for word-completion & combo bursts
    const burstPool = new GPUParticlePool(120, 0.06, 0x38bdf8, 0xfbbf24);
    scene.add(burstPool.mesh);

    let pipeline: PostProcessPipeline | null = createPostProcessingPipeline(renderer, scene, camera, {
      bloomIntensity: 0.42,
      luminanceThreshold: 0.72,
      enableSmaa: true,
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    host.parentElement?.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      if (disposed || !host) return;
      const rw = Math.max(320, host.clientWidth);
      const rh = Math.max(260, host.clientHeight);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh, false);
      pipeline?.setSize(rw, rh);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    let lastBurst = prevBurstRef.current;
    let lastError = prevErrorRef.current;
    let prevTime = performance.now();

    const animate = (now: number) => {
      if (disposed) return;
      if (!reduceMotion) rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      const st = liveRef.current;

      if (prevBurstRef.current !== lastBurst) {
        lastBurst = prevBurstRef.current;
        const burstColor = st.combo >= 10 ? 0xfbbf24 : 0x34d399;
        for (let i = 0; i < 18; i++) {
          const ang = (Math.PI * 2 * i) / 18;
          const spd = 2.4 + Math.random() * 2.5;
          burstPool.spawn(
            (Math.random() - 0.5) * 2.2,
            0.2 + (Math.random() - 0.5) * 1.2,
            -2.0,
            Math.cos(ang) * spd,
            Math.sin(ang) * spd * 0.7,
            (Math.random() - 0.5) * 1.5,
            0.7,
            1.15,
            burstColor
          );
        }
      }

      if (prevErrorRef.current !== lastError) {
        lastError = prevErrorRef.current;
        for (let i = 0; i < 10; i++) {
          burstPool.spawn(
            (Math.random() - 0.5) * 1.6,
            0.1,
            -1.8,
            (Math.random() - 0.5) * 3.5,
            (Math.random() - 0.5) * 3.5,
            0.5,
            0.45,
            1.0,
            0xf43f5e
          );
        }
      }

      const paceBoost = (1 + Math.min(3.0, st.wpm / 35)) * (st.overdrive ? 1.65 : 1);
      crystal.rotation.y += dt * 0.55 * paceBoost;
      crystal.rotation.x += dt * 0.28;
      ring1.rotation.z += dt * 0.65 * paceBoost;
      ring2.rotation.z -= dt * 0.45 * paceBoost;

      const pulseScale = (st.overdrive ? 1.12 : 1) + st.burstFlash * 0.16;
      centerpiece.scale.setScalar(THREE.MathUtils.lerp(centerpiece.scale.x, pulseScale, 0.18));

      crystalMat.emissive.setHex(
        st.errorFlash > 0.15
          ? 0xf43f5e
          : st.overdrive || st.combo >= 10
          ? 0xf59e0b
          : 0x0284c7
      );
      crystalMat.emissiveIntensity =
        (st.overdrive ? 0.95 : 0.45) + st.burstFlash * 0.9 + Math.min(0.6, st.combo * 0.02);

      // Advance starfield tunnel forward
      const posAttr = starGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const starSpeed = (2.8 + Math.min(18, st.wpm * 0.22)) * (st.overdrive ? 1.7 : 1) * dt;
      for (let i = 0; i < starCount; i++) {
        arr[i * 3 + 2] += starSpeed;
        if (arr[i * 3 + 2] > 6) {
          arr[i * 3 + 2] = -32;
          arr[i * 3] = (Math.random() - 0.5) * 26;
          arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
        }
      }
      posAttr.needsUpdate = true;

      // Damped camera parallax
      camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.75, 4, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.4 + pointer.y * 0.45, 4, dt);
      camera.lookAt(0, 0, -1.5);

      grid.position.z = ((now * 0.001 * (1.2 + Math.min(4, st.wpm * 0.04))) % 1) - 0.5;

      st.burstFlash = Math.max(0, st.burstFlash - dt * 3.2);
      st.errorFlash = Math.max(0, st.errorFlash - dt * 3.2);

      burstPool.update(dt, -1.2);
      if (pipeline) {
        pipeline.render(dt);
      } else {
        renderer.render(scene, camera);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      host.parentElement?.removeEventListener('pointermove', onPointerMove);
      pipeline?.dispose();
      pipeline = null;
      burstPool.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      starGeo.dispose();
      starMat.dispose();
      grid.geometry?.dispose();
      gridMats.forEach((m) => m.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [perfMode]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Smooth Tier Architectural Static Backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          perfMode === 'smooth'
            ? 'bg-gradient-to-br from-slate-100 via-sky-50/80 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
            : perfMode === 'balanced'
            ? 'bg-gradient-to-br from-slate-50 via-sky-50/75 to-emerald-50/60 dark:from-[#040c1e] dark:via-[#071630] dark:to-[#041426]'
            : 'bg-gradient-to-br from-slate-900 via-[#050d21] to-[#080d22] dark:from-[#020614] dark:via-[#040b1e] dark:to-[#030712]'
        }`}
      />
      {perfMode === 'smooth' && (
        <div
          className="absolute inset-0 opacity-45 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(rgba(14, 165, 233, 0.26) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      )}

      {/* 2D Canvas Backdrop (Medium or Ultra Software Fallback) */}
      <canvas
        ref={canvas2dRef}
        className={`absolute inset-0 w-full h-full ${
          perfMode === 'smooth' ? 'hidden' : 'block'
        }`}
      />

      {/* 3D WebGL Backdrop (Hardware Ultra) */}
      <div
        ref={hostRef}
        className={`absolute inset-0 w-full h-full ${
          perfMode === 'ultra' ? 'block' : 'hidden'
        }`}
      />

      {/* Readability Scrim */}
      <div
        className={`absolute inset-0 ${
          perfMode === 'ultra'
            ? 'bg-gradient-to-b from-slate-950/35 via-transparent to-slate-950/55'
            : 'bg-gradient-to-b from-transparent via-transparent to-slate-950/10 dark:to-slate-950/45'
        }`}
      />
    </div>
  );
};
