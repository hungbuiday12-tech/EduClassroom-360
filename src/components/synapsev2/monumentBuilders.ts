import * as THREE from 'three';
import {
  BuiltMonument,
  MonumentCategory,
  MonumentDefinition,
  MonumentId,
  MonumentTelemetry,
  MONUMENT_CATALOG,
  SynapseV2Params,
  computeTelemetry
} from './synapseCatalog';
import { buildExtraMonument } from './buildersExtra';
import { buildExpansionMonument } from './buildersExpansion';

export type {
  BuiltMonument,
  MonumentCategory,
  MonumentDefinition,
  MonumentId,
  MonumentTelemetry,
  SynapseV2Params
};
export { MONUMENT_CATALOG, computeTelemetry };

// Pre-allocated scratch math helpers (zero per-frame GC allocation)
const _m4 = new THREE.Matrix4();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _v3C = new THREE.Vector3();
const _vUp = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _col = new THREE.Color();

// Procedural texture generators
export function createCircuitPlateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#090e1c';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle radial ambient glow
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    grad.addColorStop(0.55, 'rgba(99, 102, 241, 0.08)');
    grad.addColorStop(1, 'rgba(9, 14, 28, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Concentric calibration rings
    for (let r = 48; r <= 240; r += 32) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.strokeStyle = r % 64 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(129, 140, 248, 0.2)';
      ctx.lineWidth = r % 64 === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Radial azimuth ticks
    for (let i = 0; i < 36; i++) {
      const a = (i * Math.PI) / 18;
      const inner = i % 3 === 0 ? 70 : 140;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(a) * inner, 256 + Math.sin(a) * inner);
      ctx.lineTo(256 + Math.cos(a) * 245, 256 + Math.sin(a) * 245);
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createGlowSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.28, 'rgba(186,230,253,0.85)');
    grad.addColorStop(0.65, 'rgba(99,102,241,0.28)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 126);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.82)');
    grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.38)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Custom GLSL Volumetric Cosmic Nebula + Galactic Core Sky Dome */
export function buildCosmicSkyDome(isSoftwareGl: boolean): {
  mesh: THREE.Mesh;
  update: (elapsed: number) => void;
  dispose: () => void;
} {
  const skyGeo = new THREE.SphereGeometry(
    132,
    isSoftwareGl ? 24 : 44,
    isSoftwareGl ? 18 : 30
  );

  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldDir;
      void main() {
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vWorldDir;

      float hash31(vec3 p) {
        p = fract(p * vec3(443.8975, 397.2973, 491.1871));
        p += dot(p, p.yxz + 19.19);
        return fract((p.x + p.y) * p.z);
      }

      float noise3(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
        float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

        float nx00 = mix(n000, n100, f.x);
        float nx10 = mix(n010, n110, f.x);
        float nx01 = mix(n001, n101, f.x);
        float nx11 = mix(n011, n111, f.x);

        float nxy0 = mix(nx00, nx10, f.y);
        float nxy1 = mix(nx01, nx11, f.y);
        return mix(nxy0, nxy1, f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0;
        v += 0.55 * noise3(p);
        v += 0.30 * noise3(p * 2.13 + vec3(3.1, 1.7, 4.9));
        v += 0.15 * noise3(p * 4.41 + vec3(7.3, 2.4, 1.1));
        return v;
      }

      void main() {
        vec3 d = normalize(vWorldDir);
        float h = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);

        // Deep royal cosmic indigo -> twilight violet -> luminous atmospheric horizon
        vec3 zenithCol = vec3(0.032, 0.048, 0.145);
        vec3 midSkyCol = vec3(0.068, 0.078, 0.245);
        vec3 horizonCol = vec3(0.055, 0.145, 0.340);

        vec3 col = mix(horizonCol, midSkyCol, smoothstep(0.32, 0.65, h));
        col = mix(col, zenithCol, smoothstep(0.62, 0.98, h));

        // Tilted Galactic Milky-Way Ribbon + Swirling Nebula Clouds
        float bandPlane = dot(d, normalize(vec3(0.42, 0.72, -0.55)));
        float galacticBand = exp(-bandPlane * bandPlane * 7.5);

        vec3 drift = vec3(uTime * 0.014, -uTime * 0.008, uTime * 0.011);
        float nebA = fbm(d * 3.1 + drift);
        float nebB = fbm(d * 5.6 - drift * 1.3 + vec3(nebA * 1.2));

        vec3 auroraCyan = vec3(0.04, 0.68, 0.92);
        vec3 quantumViolet = vec3(0.45, 0.20, 0.88);
        vec3 solarAmber = vec3(0.95, 0.52, 0.18);
        vec3 rosePlasma = vec3(0.84, 0.22, 0.62);

        col += auroraCyan * smoothstep(0.36, 0.85, nebA) * (0.28 + 0.52 * galacticBand);
        col += quantumViolet * smoothstep(0.34, 0.88, nebB) * (0.32 + 0.48 * galacticBand);
        col += rosePlasma * smoothstep(0.56, 0.92, nebA * nebB * 1.75) * galacticBand * 0.65;

        // Warm galactic core flare on distant horizon sector
        float coreAlign = max(0.0, dot(d, normalize(vec3(-0.62, 0.16, -0.76))));
        col += solarAmber * pow(coreAlign, 7.0) * (0.48 + 0.52 * nebA);
        col += auroraCyan * pow(max(0.0, dot(d, normalize(vec3(0.75, 0.24, 0.61)))), 5.0) * 0.35;

        // Horizon atmospheric aurora belt
        float horizonGlow = exp(-abs(d.y + 0.05) * 8.5);
        col += mix(auroraCyan, quantumViolet, 0.45 + 0.45 * sin(d.x * 3.0 + uTime * 0.2)) * horizonGlow * 0.42;

        // Subtle crisp starlight embedded in sky dome
        float starCell = hash31(floor(d * 210.0));
        float starMask = smoothstep(0.986, 0.999, starCell);
        float twinkle = 0.65 + 0.35 * sin(uTime * 2.8 + starCell * 90.0);
        col += vec3(0.78, 0.92, 1.0) * starMask * twinkle * 0.95;

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(skyGeo, skyMat);
  mesh.frustumCulled = false;

  return {
    mesh,
    update: (elapsed: number) => {
      skyMat.uniforms.uTime.value = elapsed;
    },
    dispose: () => {
      skyGeo.dispose();
      skyMat.dispose();
    }
  };
}

/** Shared Monumental Orbital Citadel Sanctuary, Sky-Halo Megastructures & Beacon Beams */
export function buildCitadelEnvironment(
  circuitTex: THREE.CanvasTexture,
  shadowTex: THREE.CanvasTexture,
  isSoftwareGl: boolean
): {
  group: THREE.Group;
  update: (elapsed: number) => void;
  dispose: () => void;
} {
  const group = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // 1. Stepped architectural obsidian platform deck (expanded monumental scale)
  const deckGeo = new THREE.CylinderGeometry(13.6, 15.0, 0.75, isSoftwareGl ? 36 : 64);
  const deckMat = new THREE.MeshStandardMaterial({
    map: circuitTex,
    roughness: 0.3,
    metalness: 0.78,
    emissive: new THREE.Color(0x0d1f47),
    emissiveIntensity: 0.62
  });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = -4.22;
  deck.receiveShadow = true;
  group.add(deck);
  disposables.push(deckGeo, deckMat);

  // Inner metallic plinth step
  const plinthGeo = new THREE.CylinderGeometry(6.1, 6.9, 0.48, isSoftwareGl ? 32 : 48);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x15223d,
    roughness: 0.22,
    metalness: 0.9,
    emissive: 0x09152e,
    emissiveIntensity: 0.35
  });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = -3.72;
  group.add(plinth);
  disposables.push(plinthGeo, plinthMat);

  // Soft radial contact shadow beneath monumental structure
  const shadowGeo = new THREE.PlaneGeometry(15, 15);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -3.47;
  group.add(shadowPlane);
  disposables.push(shadowGeo, shadowMat);

  // 2. Concentric Luminous Holographic Ground Rings
  const rimGeo = new THREE.TorusGeometry(13.7, 0.09, 12, isSoftwareGl ? 48 : 96);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.85,
    roughness: 0.14,
    metalness: 0.8
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -3.84;
  group.add(rim);
  disposables.push(rimGeo, rimMat);

  const midHoloRingGeo = new THREE.TorusGeometry(9.4, 0.045, 8, isSoftwareGl ? 48 : 84);
  const midHoloRingMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: 0.58,
    blending: THREE.AdditiveBlending
  });
  const midHoloRing = new THREE.Mesh(midHoloRingGeo, midHoloRingMat);
  midHoloRing.rotation.x = Math.PI / 2;
  midHoloRing.position.y = -3.76;
  group.add(midHoloRing);
  disposables.push(midHoloRingGeo, midHoloRingMat);

  // 3. 12 Towering Citadel Beacon Obelisks + Additive Energy Light Columns
  const pylonCount = 12;
  const pylonGeo = new THREE.CylinderGeometry(0.18, 0.52, 4.8, 6);
  const pylonMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.88,
    roughness: 0.22,
    emissive: 0x0f172a,
    emissiveIntensity: 0.4
  });
  const pylons = new THREE.InstancedMesh(pylonGeo, pylonMat, pylonCount);

  const tipGeo = new THREE.OctahedronGeometry(0.32, 0);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.2,
    roughness: 0.1,
    metalness: 0.5
  });
  const pylonTips = new THREE.InstancedMesh(tipGeo, tipMat, pylonCount);

  const beamGeo = new THREE.CylinderGeometry(0.08, 0.46, 15.5, 10, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.13,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const beamColumns = new THREE.InstancedMesh(beamGeo, beamMat, pylonCount);

  for (let i = 0; i < pylonCount; i++) {
    const angle = (i / pylonCount) * Math.PI * 2;
    const radius = 12.6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    _euler.set(0, -angle, 0.12);
    _quat.setFromEuler(_euler);
    _v3A.set(x, -1.75, z);
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    pylons.setMatrixAt(i, _m4);

    _v3A.set(Math.cos(angle) * 12.28, 0.85, Math.sin(angle) * 12.28);
    _m4.compose(_v3A, _quat, _v3B);
    pylonTips.setMatrixAt(i, _m4);

    _quat.identity();
    _v3A.set(Math.cos(angle) * 12.28, 8.6, Math.sin(angle) * 12.28);
    _m4.compose(_v3A, _quat, _v3B);
    beamColumns.setMatrixAt(i, _m4);
  }
  pylons.instanceMatrix.needsUpdate = true;
  pylonTips.instanceMatrix.needsUpdate = true;
  beamColumns.instanceMatrix.needsUpdate = true;
  pylons.computeBoundingSphere();
  pylonTips.computeBoundingSphere();
  beamColumns.computeBoundingSphere();
  group.add(pylons, pylonTips, beamColumns);
  disposables.push(pylonGeo, pylonMat, tipGeo, tipMat, beamGeo, beamMat);

  // 4. Two Colossal Inclined Orbital Dyson Megastructure Sky-Halos
  const skyHaloAGeo = new THREE.TorusGeometry(23.5, 0.12, 10, isSoftwareGl ? 48 : 96);
  const skyHaloAMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending
  });
  const skyHaloA = new THREE.Mesh(skyHaloAGeo, skyHaloAMat);
  skyHaloA.rotation.set(Math.PI / 2 - 0.34, 0.22, 0.15);
  skyHaloA.position.y = 0.5;
  group.add(skyHaloA);

  const skyHaloBGeo = new THREE.TorusGeometry(28.5, 0.11, 10, isSoftwareGl ? 48 : 96);
  const skyHaloBMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const skyHaloB = new THREE.Mesh(skyHaloBGeo, skyHaloBMat);
  skyHaloB.rotation.set(Math.PI / 2 + 0.28, -0.35, 0.2);
  skyHaloB.position.y = 1.2;
  group.add(skyHaloB);
  disposables.push(skyHaloAGeo, skyHaloAMat, skyHaloBGeo, skyHaloBMat);

  // 5. 8 Hovering Orbital Monolith Satellites circling outer sanctuary
  const satCount = 8;
  const satGeo = new THREE.OctahedronGeometry(0.45, 0);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x6366f1,
    emissiveIntensity: 1.6,
    metalness: 0.85,
    roughness: 0.18
  });
  const satellites = new THREE.InstancedMesh(satGeo, satMat, satCount);
  group.add(satellites);
  disposables.push(satGeo, satMat);

  // 6. Rising Cosmic Quantum Stardust Embers (InstancedMesh)
  const emberCount = isSoftwareGl ? 90 : 210;
  const emberGeo = new THREE.OctahedronGeometry(0.065, 0);
  const emberMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const embers = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
  const emberAngle = new Float32Array(emberCount);
  const emberRadius = new Float32Array(emberCount);
  const emberY = new Float32Array(emberCount);
  const emberSpeed = new Float32Array(emberCount);

  for (let i = 0; i < emberCount; i++) {
    emberAngle[i] = Math.random() * Math.PI * 2;
    emberRadius[i] = 4.5 + Math.random() * 14.5;
    emberY[i] = -3.4 + Math.random() * 13.5;
    emberSpeed[i] = 0.28 + Math.random() * 0.55;
    _col.setHSL(i % 3 === 0 ? 0.54 : i % 3 === 1 ? 0.74 : 0.11, 0.9, 0.72);
    embers.setColorAt(i, _col);
  }
  if (embers.instanceColor) embers.instanceColor.needsUpdate = true;
  group.add(embers);
  disposables.push(emberGeo, emberMat);

  return {
    group,
    update: (elapsed: number) => {
      skyHaloA.rotation.z = elapsed * 0.045;
      skyHaloB.rotation.z = -elapsed * 0.035;
      midHoloRing.rotation.z = elapsed * 0.12;

      for (let i = 0; i < satCount; i++) {
        const a = (i / satCount) * Math.PI * 2 + elapsed * 0.085;
        const r = 17.5 + (i % 2) * 3.8;
        const y = 3.2 + Math.sin(elapsed * 0.9 + i * 1.1) * 1.65;
        _euler.set(elapsed * 0.6 + i, elapsed * 0.9 + i, 0);
        _quat.setFromEuler(_euler);
        _v3A.set(Math.cos(a) * r, y, Math.sin(a) * r);
        _v3B.set(0.85, 1.55, 0.85);
        _m4.compose(_v3A, _quat, _v3B);
        satellites.setMatrixAt(i, _m4);
      }
      satellites.instanceMatrix.needsUpdate = true;
      satellites.computeBoundingSphere();

      _quat.identity();
      for (let i = 0; i < emberCount; i++) {
        const yLoop = ((emberY[i] + elapsed * emberSpeed[i] + 3.4) % 13.5) - 3.4;
        const a = emberAngle[i] + elapsed * 0.08;
        const s = 0.55 + 0.55 * Math.sin(elapsed * 2.5 + i);
        _v3A.set(Math.cos(a) * emberRadius[i], yLoop, Math.sin(a) * emberRadius[i]);
        _v3B.setScalar(s);
        _m4.compose(_v3A, _quat, _v3B);
        embers.setMatrixAt(i, _m4);
      }
      embers.instanceMatrix.needsUpdate = true;
      embers.computeBoundingSphere();
    },
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    }
  };
}

/* ============================================================================
 * MONUMENT 1: DYSON SPHERE OBSERVATORY & KERR BLACK HOLE
 * ============================================================================ */
function buildDysonMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // 1. Event Horizon Singularity Core
  const coreGeo = new THREE.SphereGeometry(1.15, isSoftwareGl ? 24 : 48, isSoftwareGl ? 24 : 48);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x02040a,
    roughness: 0.05,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.y = 0.6;
  root.add(coreMesh);
  disposables.push(coreGeo, coreMat);

  // Photon Sphere Halo Shell
  const photonGeo = new THREE.SphereGeometry(1.32, isSoftwareGl ? 24 : 40, isSoftwareGl ? 24 : 40);
  const photonMat = new THREE.MeshBasicMaterial({
    color: 0xfb923c,
    transparent: true,
    opacity: 0.35,
    side: THREE.BackSide
  });
  const photonSphere = new THREE.Mesh(photonGeo, photonMat);
  coreMesh.add(photonSphere);
  disposables.push(photonGeo, photonMat);

  // 2. Multi-band Relativistic Accretion Disk
  const diskGroup = new THREE.Group();
  diskGroup.position.y = 0.6;
  root.add(diskGroup);

  const innerDiskGeo = new THREE.RingGeometry(1.55, 2.75, isSoftwareGl ? 40 : 80);
  const innerDiskMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const innerDisk = new THREE.Mesh(innerDiskGeo, innerDiskMat);
  innerDisk.rotation.x = Math.PI / 2;
  diskGroup.add(innerDisk);

  const midDiskGeo = new THREE.RingGeometry(2.7, 4.1, isSoftwareGl ? 40 : 80);
  const midDiskMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  const midDisk = new THREE.Mesh(midDiskGeo, midDiskMat);
  midDisk.rotation.x = Math.PI / 2 + 0.025;
  diskGroup.add(midDisk);

  const outerDiskGeo = new THREE.RingGeometry(4.0, 5.4, isSoftwareGl ? 40 : 80);
  const outerDiskMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  const outerDisk = new THREE.Mesh(outerDiskGeo, outerDiskMat);
  outerDisk.rotation.x = Math.PI / 2 - 0.03;
  diskGroup.add(outerDisk);
  disposables.push(innerDiskGeo, innerDiskMat, midDiskGeo, midDiskMat, outerDiskGeo, outerDiskMat);

  // 3. Bipolar Relativistic Jets (±Y)
  const jetGeo = new THREE.CylinderGeometry(0.12, 0.52, 6.2, 20, 1, true);
  const jetMat = new THREE.MeshBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.36,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const jetTop = new THREE.Mesh(jetGeo, jetMat);
  jetTop.position.y = 3.6;
  const jetBottom = new THREE.Mesh(jetGeo, jetMat);
  jetBottom.position.y = -3.6;
  jetBottom.rotation.z = Math.PI;
  coreMesh.add(jetTop, jetBottom);
  disposables.push(jetGeo, jetMat);

  // 4. Counter-Rotating 3-Axis Armillary Dyson Rings (Brushed Gold + Cobalt PBR)
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.18,
    emissive: 0x78350f,
    emissiveIntensity: 0.35
  });
  const alloyMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.24
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.6,
    roughness: 0.15,
    metalness: 0.5
  });
  disposables.push(goldMat, alloyMat, glowMat);

  const ringGroupA = new THREE.Group();
  const ringGroupB = new THREE.Group();
  const ringGroupC = new THREE.Group();
  ringGroupA.position.y = 0.6;
  ringGroupB.position.y = 0.6;
  ringGroupC.position.y = 0.6;
  root.add(ringGroupA, ringGroupB, ringGroupC);

  const torusAGeo = new THREE.TorusGeometry(4.45, 0.14, 14, isSoftwareGl ? 44 : 84);
  const torusBGeo = new THREE.TorusGeometry(5.15, 0.16, 14, isSoftwareGl ? 44 : 84);
  const torusCGeo = new THREE.TorusGeometry(5.85, 0.18, 14, isSoftwareGl ? 44 : 84);
  ringGroupA.add(new THREE.Mesh(torusAGeo, goldMat));
  ringGroupB.add(new THREE.Mesh(torusBGeo, alloyMat));
  ringGroupC.add(new THREE.Mesh(torusCGeo, goldMat));
  disposables.push(torusAGeo, torusBGeo, torusCGeo);

  // Instanced Solar-Collector Wings on Dyson Ring A & Ring C
  const panelGeo = new THREE.BoxGeometry(0.45, 0.08, 0.95);
  const panelsA = new THREE.InstancedMesh(panelGeo, glowMat, 24);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    _euler.set(0, -a, 0);
    _quat.setFromEuler(_euler);
    _v3A.set(Math.cos(a) * 4.45, Math.sin(a) * 4.45, 0);
    _euler.set(0, 0, a);
    _quat.setFromEuler(_euler);
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    panelsA.setMatrixAt(i, _m4);
  }
  panelsA.instanceMatrix.needsUpdate = true;
  panelsA.computeBoundingSphere();
  ringGroupA.add(panelsA);

  const beaconGeo = new THREE.OctahedronGeometry(0.24, 0);
  const beaconsC = new THREE.InstancedMesh(beaconGeo, glowMat, 12);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    _v3A.set(Math.cos(a) * 5.85, Math.sin(a) * 5.85, 0);
    _quat.identity();
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    beaconsC.setMatrixAt(i, _m4);
  }
  beaconsC.instanceMatrix.needsUpdate = true;
  beaconsC.computeBoundingSphere();
  ringGroupC.add(beaconsC);
  disposables.push(panelGeo, beaconGeo);

  // 5. 1,400 Instanced Keplerian Stars & Nebula Swarm
  const starCount = isSoftwareGl ? 650 : 1400;
  const starGeo = new THREE.IcosahedronGeometry(0.055, 0);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const starSwarm = new THREE.InstancedMesh(starGeo, starMat, starCount);

  const radii = new Float32Array(starCount);
  const angles = new Float32Array(starCount);
  const heights = new Float32Array(starCount);
  const scales = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const r = 1.85 + Math.pow(Math.random(), 1.2) * 8.2;
    radii[i] = r;
    angles[i] = Math.random() * Math.PI * 2;
    heights[i] = (Math.random() - 0.5) * (1.2 / (0.35 + r * 0.16));
    scales[i] = 0.5 + Math.random() * 1.35;

    const heat = 1 - Math.min(1, (r - 1.85) / 7.5);
    _col.setRGB(0.45 + 0.55 * heat, 0.68 + 0.28 * heat, 0.98 - 0.5 * heat);
    starSwarm.setColorAt(i, _col);
  }
  if (starSwarm.instanceColor) starSwarm.instanceColor.needsUpdate = true;
  starSwarm.position.y = 0.6;
  root.add(starSwarm);
  disposables.push(starGeo, starMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const massNorm = 0.72 + (params.primaryParam / 120) * 0.78;
      const spinNorm = 0.35 + (params.secondaryParam / 100) * 2.2;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      coreMesh.scale.setScalar(massNorm);
      photonSphere.scale.setScalar(1.12 + Math.sin(elapsed * 4.2) * 0.04);

      const jetPulse = 0.85 + Math.sin(elapsed * 7.5 * speed) * 0.22;
      jetTop.scale.set(1, jetPulse, 1);
      jetBottom.scale.set(1, jetPulse, 1);

      diskGroup.rotation.y += delta * 0.45 * spinNorm * speed;

      // Exploded architecture expansion & 3-axis armillary precession
      const exScale = 1 + explode * 0.38;
      ringGroupA.scale.setScalar(exScale);
      ringGroupB.scale.setScalar(1 + explode * 0.58);
      ringGroupC.scale.setScalar(1 + explode * 0.8);

      ringGroupA.rotation.x = 0.55 + elapsed * 0.38 * speed;
      ringGroupA.rotation.y = elapsed * 0.52 * speed;

      ringGroupB.rotation.y = -elapsed * 0.42 * speed;
      ringGroupB.rotation.z = 0.85 + elapsed * 0.31 * speed;

      ringGroupC.rotation.x = -0.65 + elapsed * 0.25 * speed;
      ringGroupC.rotation.z = elapsed * 0.22 * speed;

      // Differential Keplerian orbital kinematics
      _quat.identity();
      for (let i = 0; i < starCount; i++) {
        const omega = (2.2 / Math.pow(radii[i], 1.15)) * spinNorm * speed;
        angles[i] += delta * omega;
        const x = Math.cos(angles[i]) * radii[i];
        const z = Math.sin(angles[i]) * radii[i];
        const y = heights[i] + Math.sin(angles[i] * 2 + elapsed) * 0.09;
        _v3A.set(x, y, z);
        _v3B.setScalar(scales[i]);
        _m4.compose(_v3A, _quat, _v3B);
        starSwarm.setMatrixAt(i, _m4);
      }
      starSwarm.instanceMatrix.needsUpdate = true;
      starSwarm.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

/* ============================================================================
 * MONUMENT 2: CRYOGENIC TOKAMAK FUSION REACTOR & COLLIDER
 * ============================================================================ */
function buildTokamakMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  const R = 3.85; // Major radius
  const rTube = 1.05; // Plasma minor radius

  const centerGroup = new THREE.Group();
  centerGroup.position.y = 0.65;
  root.add(centerGroup);

  // 1. Central Cryogenic Solenoid Spire
  const solenoidGeo = new THREE.CylinderGeometry(1.1, 1.35, 5.2, isSoftwareGl ? 24 : 40);
  const cryoMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.88,
    roughness: 0.24
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.92,
    roughness: 0.2
  });
  const solenoid = new THREE.Mesh(solenoidGeo, cryoMat);
  centerGroup.add(solenoid);
  disposables.push(solenoidGeo, cryoMat, copperMat);

  // Solenoid cooling rib collars
  const ribGeo = new THREE.TorusGeometry(1.36, 0.11, 12, isSoftwareGl ? 24 : 48);
  for (let i = -3; i <= 3; i++) {
    const rib = new THREE.Mesh(ribGeo, i % 2 === 0 ? copperMat : cryoMat);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = i * 0.68;
    centerGroup.add(rib);
  }
  disposables.push(ribGeo);

  // 2. Translucent Vacuum Vessel Shell + Helical Magnetic Confinement Coils
  const vesselGeo = new THREE.TorusGeometry(R, rTube * 1.18, isSoftwareGl ? 18 : 28, isSoftwareGl ? 48 : 84);
  const vesselMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.25,
    roughness: 0.15,
    transparent: true,
    opacity: 0.22,
    transmission: 0.35
  });
  const vacuumVessel = new THREE.Mesh(vesselGeo, vesselMat);
  vacuumVessel.rotation.x = Math.PI / 2;
  centerGroup.add(vacuumVessel);
  disposables.push(vesselGeo, vesselMat);

  // Glowing Inner Blazing Fusion Plasma Torus
  const plasmaGeo = new THREE.TorusGeometry(R, rTube * 0.68, isSoftwareGl ? 18 : 28, isSoftwareGl ? 48 : 84);
  const plasmaMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xc026d3,
    emissiveIntensity: 2.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.72
  });
  const plasmaCore = new THREE.Mesh(plasmaGeo, plasmaMat);
  plasmaCore.rotation.x = Math.PI / 2;
  centerGroup.add(plasmaCore);
  disposables.push(plasmaGeo, plasmaMat);

  // 3. Helical Tokamak Magnetic Field Ribbon (TubeGeometry)
  const helixPts: THREE.Vector3[] = [];
  const helixSteps = 220;
  for (let i = 0; i <= helixSteps; i++) {
    const t = (i / helixSteps) * Math.PI * 2;
    const phi = t * 6; // q-factor twist
    const mr = rTube * 0.85;
    const radial = R + mr * Math.cos(phi);
    helixPts.push(new THREE.Vector3(radial * Math.cos(t), mr * Math.sin(phi), radial * Math.sin(t)));
  }
  const helixCurve = new THREE.CatmullRomCurve3(helixPts, true);
  const helixGeo = new THREE.TubeGeometry(helixCurve, isSoftwareGl ? 140 : 220, 0.055, 8, true);
  const helixMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const helixMesh = new THREE.Mesh(helixGeo, helixMat);
  centerGroup.add(helixMesh);
  disposables.push(helixGeo, helixMat);

  // 4. 18 Sculpted Superconducting D-Shaped Toroidal Field Magnets (ExtrudeGeometry InstancedMesh)
  const dShape = new THREE.Shape();
  dShape.moveTo(2.0, -2.0);
  dShape.lineTo(2.25, -2.0);
  dShape.quadraticCurveTo(5.6, -2.2, 5.65, 0);
  dShape.quadraticCurveTo(5.6, 2.2, 2.25, 2.0);
  dShape.lineTo(2.0, 2.0);
  dShape.closePath();

  const dHole = new THREE.Path();
  dHole.moveTo(2.4, -1.65);
  dHole.quadraticCurveTo(5.1, -1.75, 5.15, 0);
  dHole.quadraticCurveTo(5.1, 1.75, 2.4, 1.65);
  dHole.closePath();
  dShape.holes.push(dHole);

  const dMagnetGeo = new THREE.ExtrudeGeometry(dShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2
  });
  dMagnetGeo.translate(0, 0, -0.12);

  const magnetCount = 18;
  const magnetMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.86,
    roughness: 0.22
  });
  const magnets = new THREE.InstancedMesh(dMagnetGeo, magnetMat, magnetCount);
  centerGroup.add(magnets);
  disposables.push(dMagnetGeo, magnetMat);

  // 5. Outer Horizontal Poloidal Field Rings
  const pfGroupTop = new THREE.Group();
  const pfGroupBot = new THREE.Group();
  centerGroup.add(pfGroupTop, pfGroupBot);
  const pfGeo = new THREE.TorusGeometry(5.65, 0.16, 12, isSoftwareGl ? 40 : 72);
  const pfUpper = new THREE.Mesh(pfGeo, copperMat);
  pfUpper.rotation.x = Math.PI / 2;
  pfUpper.position.y = 1.65;
  const pfLower = new THREE.Mesh(pfGeo, copperMat);
  pfLower.rotation.x = Math.PI / 2;
  pfLower.position.y = -1.65;
  pfGroupTop.add(pfUpper);
  pfGroupBot.add(pfLower);
  disposables.push(pfGeo);

  // 6. 850 Confined Helical Fusion Ions (InstancedMesh)
  const ionCount = isSoftwareGl ? 420 : 850;
  const ionGeo = new THREE.SphereGeometry(0.052, 6, 6);
  const ionMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ions = new THREE.InstancedMesh(ionGeo, ionMat, ionCount);

  const ionToroidal = new Float32Array(ionCount);
  const ionPoloidal = new Float32Array(ionCount);
  const ionMinorR = new Float32Array(ionCount);

  for (let i = 0; i < ionCount; i++) {
    ionToroidal[i] = Math.random() * Math.PI * 2;
    ionPoloidal[i] = Math.random() * Math.PI * 2;
    ionMinorR[i] = (0.2 + Math.random() * 0.72) * rTube;
    const isDeuterium = i % 2 === 0;
    _col.setHex(isDeuterium ? 0x38bdf8 : 0xf472b6);
    ions.setColorAt(i, _col);
  }
  if (ions.instanceColor) ions.instanceColor.needsUpdate = true;
  centerGroup.add(ions);
  disposables.push(ionGeo, ionMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const bNorm = params.primaryParam / 18;
      const tempNorm = params.secondaryParam / 280;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Update plasma glow hue and intensity with temperature
      plasmaMat.emissive.setHSL(0.86 - tempNorm * 0.14, 0.92, 0.45 + tempNorm * 0.18);
      plasmaMat.emissiveIntensity = 1.4 + tempNorm * 1.8 + Math.sin(elapsed * 6) * 0.25;
      vacuumVessel.visible = explode < 0.85;
      vacuumVessel.material.opacity = Math.max(0.03, 0.22 * (1 - explode));

      helixMesh.rotation.y += delta * 0.45 * bNorm * speed;

      // Exploded cutaway reveal on upper poloidal coils + alternating radial D-magnets
      pfGroupTop.position.y = explode * 2.4;
      pfGroupBot.position.y = -explode * 1.1;

      for (let i = 0; i < magnetCount; i++) {
        const a = (i / magnetCount) * Math.PI * 2;
        const isCutawaySector = i >= 2 && i <= 7;
        const radialLift = isCutawaySector ? explode * 2.6 : explode * 0.45;
        const yLift = isCutawaySector ? explode * 1.8 : 0;

        _euler.set(0, -a, 0);
        _quat.setFromEuler(_euler);
        _v3A.set(Math.cos(a) * radialLift, yLift, Math.sin(a) * radialLift);
        _v3B.set(1, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        magnets.setMatrixAt(i, _m4);
      }
      magnets.instanceMatrix.needsUpdate = true;
      magnets.computeBoundingSphere();

      // Update confined ions along toroidal helical paths
      const tRate = (1.6 + tempNorm * 3.4) * speed;
      const pRate = (3.2 + bNorm * 6.5) * speed;
      _quat.identity();
      for (let i = 0; i < ionCount; i++) {
        ionToroidal[i] += delta * tRate;
        ionPoloidal[i] += delta * pRate;
        const rad = R + ionMinorR[i] * Math.cos(ionPoloidal[i]);
        const x = rad * Math.cos(ionToroidal[i]);
        const z = rad * Math.sin(ionToroidal[i]);
        const y = ionMinorR[i] * Math.sin(ionPoloidal[i]);
        _v3A.set(x, y, z);
        _v3B.setScalar(0.85 + tempNorm * 0.65);
        _m4.compose(_v3A, _quat, _v3B);
        ions.setMatrixAt(i, _m4);
      }
      ions.instanceMatrix.needsUpdate = true;
      ions.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

/* ============================================================================
 * MONUMENT 3: NON-EUCLIDEAN 4D TESSERACT & RIEMANN CATHEDRAL
 * ============================================================================ */
function buildTesseractMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // 1. 8-Pillar Crystal Cathedral Sanctuary
  const cathedralGroup = new THREE.Group();
  root.add(cathedralGroup);

  const pillarCount = 8;
  const pillarGeo = new THREE.CylinderGeometry(0.24, 0.34, 6.2, 12);
  const pillarMat = new THREE.MeshPhysicalMaterial({
    color: 0xc084fc,
    metalness: 0.15,
    roughness: 0.12,
    transmission: 0.55,
    transparent: true,
    opacity: 0.78
  });
  const pillars = new THREE.InstancedMesh(pillarGeo, pillarMat, pillarCount);
  for (let i = 0; i < pillarCount; i++) {
    const a = (i / pillarCount) * Math.PI * 2;
    _v3A.set(Math.cos(a) * 6.8, -0.3, Math.sin(a) * 6.8);
    _quat.identity();
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    pillars.setMatrixAt(i, _m4);
  }
  pillars.instanceMatrix.needsUpdate = true;
  pillars.computeBoundingSphere();
  cathedralGroup.add(pillars);
  disposables.push(pillarGeo, pillarMat);

  // Cathedral Overhead Geodesic Canopy Ring
  const canopyGeo = new THREE.TorusGeometry(6.8, 0.16, 12, isSoftwareGl ? 32 : 64);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x78350f,
    emissiveIntensity: 0.4
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.rotation.x = Math.PI / 2;
  canopy.position.y = 2.85;
  cathedralGroup.add(canopy);
  disposables.push(canopyGeo, canopyMat);

  // 2. Interactive Parametric Riemann Surface Manifold (under the Tesseract)
  const seg = isSoftwareGl ? 28 : 42;
  const riemannGeo = new THREE.PlaneGeometry(8.5, 8.5, seg, seg);
  riemannGeo.rotateX(-Math.PI / 2);
  const riemannPos = riemannGeo.attributes.position as THREE.BufferAttribute;
  const colorArr = new Float32Array(riemannPos.count * 3);
  riemannGeo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));

  const riemannMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    wireframe: true,
    roughness: 0.25,
    metalness: 0.5
  });
  const riemannMesh = new THREE.Mesh(riemannGeo, riemannMat);
  riemannMesh.position.y = -2.2;
  root.add(riemannMesh);
  disposables.push(riemannGeo, riemannMat);

  // 3. True R⁴ -> R³ Projected 4D Tesseract (16 Hyper-Vertices + 32 Dynamic Edges)
  const hyperVertices: Array<[number, number, number, number]> = [];
  for (let i = 0; i < 16; i++) {
    hyperVertices.push([
      i & 1 ? 1 : -1,
      i & 2 ? 1 : -1,
      i & 4 ? 1 : -1,
      i & 8 ? 1 : -1
    ]);
  }
  const hyperEdges: Array<[number, number]> = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j;
      if (diff && (diff & (diff - 1)) === 0) {
        hyperEdges.push([i, j]);
      }
    }
  }

  const nodeGeo = new THREE.SphereGeometry(0.14, 14, 14);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0xe879f9,
    emissive: 0xa855f7,
    emissiveIntensity: 1.5,
    roughness: 0.15,
    metalness: 0.6
  });
  const nodesInst = new THREE.InstancedMesh(nodeGeo, nodeMat, 16);

  const edgeGeo = new THREE.CylinderGeometry(0.038, 0.038, 1, 8);
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.15,
    roughness: 0.2,
    metalness: 0.7
  });
  const edgesInst = new THREE.InstancedMesh(edgeGeo, edgeMat, 32);

  const tesseractGroup = new THREE.Group();
  tesseractGroup.position.y = 1.1;
  tesseractGroup.add(nodesInst, edgesInst);
  root.add(tesseractGroup);
  disposables.push(nodeGeo, nodeMat, edgeGeo, edgeMat);

  const projected3D = Array.from({ length: 16 }, () => new THREE.Vector3());
  let angleXW = 0;
  let angleYW = 0;

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const rotSpeed = (params.primaryParam / 45) * Math.max(0.15, params.timeScale);
      const curvAmp = 0.25 + (params.secondaryParam / 100) * 1.15;
      const explode = params.explodeFactor;

      angleXW += delta * 0.75 * rotSpeed;
      angleYW += delta * 0.48 * rotSpeed;

      // Update Cathedral Exploded Columns radially
      for (let i = 0; i < pillarCount; i++) {
        const a = (i / pillarCount) * Math.PI * 2;
        const r = 6.8 + explode * 2.5;
        _v3A.set(Math.cos(a) * r, -0.3 + explode * 0.6, Math.sin(a) * r);
        _quat.identity();
        _v3B.set(1, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        pillars.setMatrixAt(i, _m4);
      }
      pillars.instanceMatrix.needsUpdate = true;
      pillars.computeBoundingSphere();
      canopy.position.y = 2.85 + explode * 2.2;
      canopy.rotation.z = elapsed * 0.18;

      // Update R⁴ -> R³ Stereographic Tesseract projection
      const cosX = Math.cos(angleXW);
      const sinX = Math.sin(angleXW);
      const cosY = Math.cos(angleYW);
      const sinY = Math.sin(angleYW);
      const scale3D = 1.65 + explode * 0.55;

      for (let i = 0; i < 16; i++) {
        const [vx, vy, vz, vw] = hyperVertices[i];
        // Rotation in XW plane
        const x1 = vx * cosX - vw * sinX;
        const w1 = vx * sinX + vw * cosX;
        // Rotation in YW plane
        const y2 = vy * cosY - w1 * sinY;
        const w2 = vy * sinY + w1 * cosY;

        const wDist = 2.65 - w2;
        const persp = 2.25 / Math.max(0.65, wDist);
        projected3D[i].set(x1 * persp * scale3D, y2 * persp * scale3D, vz * persp * scale3D);

        _quat.identity();
        _v3B.setScalar(0.65 + persp * 0.45);
        _m4.compose(projected3D[i], _quat, _v3B);
        nodesInst.setMatrixAt(i, _m4);
      }
      nodesInst.instanceMatrix.needsUpdate = true;
      nodesInst.computeBoundingSphere();

      // Connect all 32 Tesseract edges
      for (let e = 0; e < 32; e++) {
        const [aIdx, bIdx] = hyperEdges[e];
        const pA = projected3D[aIdx];
        const pB = projected3D[bIdx];
        _v3A.copy(pA).add(pB).multiplyScalar(0.5);
        _v3C.copy(pB).sub(pA);
        const len = Math.max(0.001, _v3C.length());
        _v3C.normalize();
        _quat.setFromUnitVectors(_vUp, _v3C);
        _v3B.set(1, len, 1);
        _m4.compose(_v3A, _quat, _v3B);
        edgesInst.setMatrixAt(e, _m4);
      }
      edgesInst.instanceMatrix.needsUpdate = true;
      edgesInst.computeBoundingSphere();
      tesseractGroup.rotation.y = elapsed * 0.28;

      // Update Harmonic Riemann Saddle Surface
      const rColAttr = riemannGeo.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < riemannPos.count; i++) {
        const x = riemannPos.getX(i);
        const z = riemannPos.getZ(i);
        const dist = Math.sqrt(x * x + z * z);
        const y =
          (Math.sin(dist * 1.45 - elapsed * 2.1) * 0.65 + (x * x - z * z) * 0.045) *
          curvAmp *
          Math.exp(-dist * 0.09);
        riemannPos.setY(i, y);

        const hue = 0.56 + THREE.MathUtils.clamp(y * 0.25, -0.25, 0.28);
        _col.setHSL(hue, 0.88, 0.62);
        rColAttr.setXYZ(i, _col.r, _col.g, _col.b);
      }
      riemannPos.needsUpdate = true;
      rColAttr.needsUpdate = true;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

/* ============================================================================
 * MONUMENT 4: QUANTUM NEURAL SPIRE & SUPERSONIC WIND TUNNEL
 * ============================================================================ */
function buildNeuralAeroMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // 1. 4-Tier Quantum Spiking Neural Spire
  const spireGroup = new THREE.Group();
  root.add(spireGroup);

  const tierRadii = [4.4, 3.3, 2.3, 1.45];
  const tierHeights = [-2.1, -0.7, 0.7, 2.1];
  const nodesPerTier = [28, 24, 20, 16];
  const tierPoints: THREE.Vector3[][] = [];

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.75,
    roughness: 0.25,
    emissive: 0x064e3b,
    emissiveIntensity: 0.5
  });
  disposables.push(ringMat);

  const tierRingMeshes: THREE.Mesh[] = [];
  let totalNeurons = 0;
  for (let t = 0; t < tierRadii.length; t++) {
    const r = tierRadii[t];
    const h = tierHeights[t];
    const ringGeo = new THREE.TorusGeometry(r, 0.06, 10, isSoftwareGl ? 36 : 64);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = h;
    spireGroup.add(ringMesh);
    tierRingMeshes.push(ringMesh);
    disposables.push(ringGeo);

    const pts: THREE.Vector3[] = [];
    for (let k = 0; k < nodesPerTier[t]; k++) {
      const a = (k / nodesPerTier[t]) * Math.PI * 2 + t * 0.25;
      pts.push(new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r));
      totalNeurons++;
    }
    tierPoints.push(pts);
  }

  // Neural Synaptic Nodes (InstancedMesh)
  const neuronGeo = new THREE.IcosahedronGeometry(0.11, 1);
  const neuronMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 1.5,
    roughness: 0.15,
    metalness: 0.5
  });
  const neuronsInst = new THREE.InstancedMesh(neuronGeo, neuronMat, totalNeurons);
  spireGroup.add(neuronsInst);
  disposables.push(neuronGeo, neuronMat);

  // Axon Tubes connecting consecutive tiers
  const axonCurves: THREE.CatmullRomCurve3[] = [];
  const axonMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.26
  });
  disposables.push(axonMat);

  for (let t = 0; t < tierPoints.length - 1; t++) {
    const curTier = tierPoints[t];
    const nextTier = tierPoints[t + 1];
    for (let k = 0; k < curTier.length; k += 2) {
      const p0 = curTier[k];
      const p1 = nextTier[Math.floor((k / curTier.length) * nextTier.length) % nextTier.length];
      const mid = new THREE.Vector3().lerpVectors(p0, p1, 0.5).multiplyScalar(0.88);
      mid.y = (p0.y + p1.y) * 0.5;
      const curve = new THREE.CatmullRomCurve3([p0, mid, p1]);
      axonCurves.push(curve);

      const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.018, 5, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, axonMat);
      spireGroup.add(tubeMesh);
      disposables.push(tubeGeo);
    }
  }

  // 420 Action-Potential Signal Pulses running along Axon Curves
  const pulseCount = isSoftwareGl ? 180 : 360;
  const pulseGeo = new THREE.SphereGeometry(0.055, 6, 6);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const pulsesInst = new THREE.InstancedMesh(pulseGeo, pulseMat, pulseCount);
  const pulseT = new Float32Array(pulseCount);
  const pulseCurveIdx = new Uint16Array(pulseCount);
  for (let i = 0; i < pulseCount; i++) {
    pulseT[i] = Math.random();
    pulseCurveIdx[i] = i % Math.max(1, axonCurves.length);
  }
  spireGroup.add(pulsesInst);
  disposables.push(pulseGeo, pulseMat);

  // 2. Supersonic Delta-Shuttle Airfoil at Spire Crown + Flowing Aerodynamic Streamlines
  const aeroGroup = new THREE.Group();
  aeroGroup.position.y = 3.2;
  root.add(aeroGroup);

  const hullGeo = new THREE.ConeGeometry(0.65, 3.8, 6);
  hullGeo.rotateZ(Math.PI / 2);
  const hullMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.78,
    roughness: 0.16,
    clearcoat: 0.9
  });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  aeroGroup.add(hull);

  const wingGeo = new THREE.BoxGeometry(1.75, 0.06, 2.8);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    metalness: 0.7,
    roughness: 0.22
  });
  const wings = new THREE.Mesh(wingGeo, wingMat);
  wings.position.x = 0.4;
  aeroGroup.add(wings);
  disposables.push(hullGeo, hullMat, wingGeo, wingMat);

  // Aerodynamic Flow Tracers (InstancedMesh) curving smoothly over & below hull
  const streamCount = isSoftwareGl ? 280 : 560;
  const streamGeo = new THREE.BoxGeometry(0.28, 0.025, 0.025);
  const streamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const streamInst = new THREE.InstancedMesh(streamGeo, streamMat, streamCount);

  const streamX = new Float32Array(streamCount);
  const streamY0 = new Float32Array(streamCount);
  const streamZ0 = new Float32Array(streamCount);
  for (let i = 0; i < streamCount; i++) {
    streamX[i] = (Math.random() - 0.5) * 12;
    streamY0[i] = (Math.random() - 0.5) * 2.4;
    streamZ0[i] = (Math.random() - 0.5) * 3.4;

    const upper = streamY0[i] >= 0;
    _col.setHex(upper ? 0x38bdf8 : 0x34d399);
    streamInst.setColorAt(i, _col);
  }
  if (streamInst.instanceColor) streamInst.instanceColor.needsUpdate = true;
  aeroGroup.add(streamInst);
  disposables.push(streamGeo, streamMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const machNorm = params.primaryParam / 16; // 0.25 .. 2.0
      const hzNorm = params.secondaryParam / 65;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Explode neural tiers vertically for inspection
      let nIdx = 0;
      _quat.identity();
      for (let t = 0; t < tierPoints.length; t++) {
        const yOff = (t - 1.5) * explode * 1.1;
        tierRingMeshes[t].position.y = tierHeights[t] + yOff;
        tierRingMeshes[t].rotation.z = elapsed * 0.25 * (t % 2 === 0 ? 1 : -1);

        const pts = tierPoints[t];
        for (let k = 0; k < pts.length; k++) {
          _v3A.set(pts[k].x, pts[k].y + yOff, pts[k].z);
          const s = 0.85 + 0.35 * Math.sin(elapsed * 4 * hzNorm + k + t);
          _v3B.setScalar(s);
          _m4.compose(_v3A, _quat, _v3B);
          neuronsInst.setMatrixAt(nIdx++, _m4);
        }
      }
      neuronsInst.instanceMatrix.needsUpdate = true;
      neuronsInst.computeBoundingSphere();
      spireGroup.rotation.y = elapsed * 0.14 * speed;

      // Animate neural pulses firing along curved axons
      for (let i = 0; i < pulseCount; i++) {
        pulseT[i] = (pulseT[i] + delta * 0.55 * hzNorm * speed) % 1;
        const curve = axonCurves[pulseCurveIdx[i]];
        if (curve) {
          curve.getPointAt(pulseT[i], _v3A);
          _v3B.setScalar(1.0 + Math.sin(pulseT[i] * Math.PI) * 0.4);
          _m4.compose(_v3A, _quat, _v3B);
          pulsesInst.setMatrixAt(i, _m4);
        }
      }
      pulsesInst.instanceMatrix.needsUpdate = true;
      pulsesInst.computeBoundingSphere();

      // Supersonic Wind Tunnel Flow Particles around Shuttle
      aeroGroup.position.y = 3.2 + explode * 1.45;
      hull.rotation.x = Math.sin(elapsed * 1.8) * 0.06;
      const flowSpeed = 4.5 * machNorm * speed;

      for (let i = 0; i < streamCount; i++) {
        streamX[i] += delta * flowSpeed;
        if (streamX[i] > 6) streamX[i] = -6;

        // Smooth airfoil potential-flow deflection around center X in [-2..2]
        const distSq = streamX[i] * streamX[i] + streamZ0[i] * streamZ0[i] * 0.65;
        const deflect = Math.exp(-distSq * 0.35) * 0.85 * (streamY0[i] >= 0 ? 1 : -1);
        const yCur = streamY0[i] + deflect;
        const pitchSlope = -streamX[i] * deflect * 0.25;

        _euler.set(0, 0, pitchSlope);
        _quat.setFromEuler(_euler);
        _v3A.set(streamX[i], yCur, streamZ0[i]);
        _v3B.set(0.6 + machNorm * 0.7, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        streamInst.setMatrixAt(i, _m4);
      }
      streamInst.instanceMatrix.needsUpdate = true;
      streamInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

export function buildMonument(id: MonumentId, isSoftwareGl: boolean): BuiltMonument {
  switch (id) {
    case 'dyson':
      return buildDysonMonument(isSoftwareGl);
    case 'tokamak':
      return buildTokamakMonument(isSoftwareGl);
    case 'tesseract':
      return buildTesseractMonument(isSoftwareGl);
    case 'neural_aero':
      return buildNeuralAeroMonument(isSoftwareGl);
    default: {
      const extra =
        buildExtraMonument(id, isSoftwareGl) ||
        buildExpansionMonument(id, isSoftwareGl);
      return extra || buildDysonMonument(isSoftwareGl);
    }
  }
}
