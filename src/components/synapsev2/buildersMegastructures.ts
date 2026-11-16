import * as THREE from 'three';
import { BuiltMonument, MonumentId, SynapseV2Params } from './synapseCatalog';

// Scratch math helpers to avoid per-frame allocations
const _m4 = new THREE.Matrix4();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _col = new THREE.Color();

// =========================================================================
// 24. AUTONOMOUS LIDAR SLAM & 3D POINT-CLOUD SCANNER CORE
// =========================================================================
export function buildLidarAutonomousMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25
  });
  const opticGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.08,
    metalness: 0.2,
    transparent: true,
    opacity: 0.42
  });
  const laserFanMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.85
  });
  disposables.push(chassisMat, opticGlassMat, laserFanMat, glowRingMat);

  // Pedestal mount on plinth
  const baseGeo = new THREE.CylinderGeometry(1.5, 1.85, 0.9, 24);
  const base = new THREE.Mesh(baseGeo, chassisMat);
  base.position.y = -2.95;
  root.add(base);
  disposables.push(baseGeo);

  const mastGeo = new THREE.CylinderGeometry(0.45, 0.55, 2.6, 16);
  const mast = new THREE.Mesh(mastGeo, chassisMat);
  mast.position.y = -1.2;
  root.add(mast);
  disposables.push(mastGeo);

  // Rotating LiDAR Turret Head
  const turretGroup = new THREE.Group();
  turretGroup.position.y = 0.65;
  root.add(turretGroup);

  const capGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.26, 24);
  const topCap = new THREE.Mesh(capGeo, chassisMat);
  topCap.position.y = 0.58;
  const botCap = new THREE.Mesh(capGeo, chassisMat);
  botCap.position.y = -0.58;
  turretGroup.add(topCap, botCap);
  disposables.push(capGeo);

  const windowGeo = new THREE.CylinderGeometry(0.98, 0.98, 0.9, 24, 1, true);
  const windowShell = new THREE.Mesh(windowGeo, opticGlassMat);
  turretGroup.add(windowShell);
  disposables.push(windowGeo);

  const coreMirrorGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.78, 6);
  const coreMirror = new THREE.Mesh(coreMirrorGeo, chassisMat);
  turretGroup.add(coreMirror);
  disposables.push(coreMirrorGeo);

  const scanRingGeo = new THREE.TorusGeometry(1.06, 0.04, 8, 32);
  scanRingGeo.rotateX(Math.PI / 2);
  const scanRing = new THREE.Mesh(scanRingGeo, glowRingMat);
  turretGroup.add(scanRing);
  disposables.push(scanRingGeo);

  // Sweeping Dual Laser Fan Blades
  const fanGeo = new THREE.BufferGeometry();
  const fanVerts = new Float32Array([
    0, 0, 0,
    5.4, 1.25, -0.8,
    5.4, -1.25, 0.8
  ]);
  fanGeo.setAttribute('position', new THREE.BufferAttribute(fanVerts, 3));
  const fanMeshA = new THREE.Mesh(fanGeo, laserFanMat);
  const fanMeshB = new THREE.Mesh(fanGeo, laserFanMat);
  fanMeshB.rotation.y = Math.PI;
  turretGroup.add(fanMeshA, fanMeshB);
  disposables.push(fanGeo);

  // 3D SLAM Point Cloud Environment Ring
  const pointCount = isSoftwareGl ? 140 : 240;
  const ptGeo = new THREE.BoxGeometry(0.11, 0.11, 0.11);
  const ptMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const ptsInst = new THREE.InstancedMesh(ptGeo, ptMat, pointCount);
  const ptAngle = new Float32Array(pointCount);
  const ptRadius = new Float32Array(pointCount);
  const ptHeight = new Float32Array(pointCount);

  for (let i = 0; i < pointCount; i++) {
    ptAngle[i] = (i / pointCount) * Math.PI * 2 + (i % 7) * 0.12;
    ptRadius[i] = 2.8 + (i % 5) * 0.62 + Math.sin(i * 1.7) * 0.35;
    ptHeight[i] = -2.1 + ((i * 13) % 19) * 0.24;
    _col.setHSL(0.5 + (i % 5) * 0.04, 0.9, 0.6);
    ptsInst.setColorAt(i, _col);
  }
  if (ptsInst.instanceColor) ptsInst.instanceColor.needsUpdate = true;
  root.add(ptsInst);
  disposables.push(ptGeo, ptMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const rpmNorm = Math.max(0.25, params.primaryParam / 240);
      const channelsNorm = Math.max(0.25, params.secondaryParam / 64);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      const sweepAngle = elapsed * 2.8 * rpmNorm * speed;
      turretGroup.rotation.y = sweepAngle;
      topCap.position.y = 0.58 + explode * 1.35;
      botCap.position.y = -0.58 - explode * 0.7;
      windowShell.scale.setScalar(1 + explode * 0.25);

      fanMeshA.scale.set(1, 0.75 + channelsNorm * 0.45, 1);
      fanMeshB.scale.set(1, 0.75 + channelsNorm * 0.45, 1);

      _quat.identity();
      for (let i = 0; i < pointCount; i++) {
        const a = ptAngle[i];
        const r = ptRadius[i] + explode * 1.1;
        const diff = Math.abs(Math.sin(a - sweepAngle));
        const flash = diff < 0.22 ? 1.85 : 0.75;
        _v3A.set(Math.cos(a) * r, ptHeight[i], Math.sin(a) * r);
        _v3B.setScalar(flash * (0.75 + channelsNorm * 0.25));
        _m4.compose(_v3A, _quat, _v3B);
        ptsInst.setMatrixAt(i, _m4);
      }
      ptsInst.instanceMatrix.needsUpdate = true;
      ptsInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 25. CONCENTRATED SOLAR THERMAL TOWER & HELIOSTAT MIRROR FIELD
// =========================================================================
export function buildSolarThermalTowerMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.45,
    roughness: 0.55
  });
  const receiverMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xea580c,
    emissiveIntensity: 1.6,
    metalness: 0.3,
    roughness: 0.2
  });
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    metalness: 0.96,
    roughness: 0.08
  });
  const sunRayMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  disposables.push(concreteMat, receiverMat, mirrorMat, sunRayMat);

  // Central Tower
  const towerGeo = new THREE.CylinderGeometry(0.45, 0.85, 4.8, 20);
  const tower = new THREE.Mesh(towerGeo, concreteMat);
  tower.position.y = -0.95;
  root.add(tower);
  disposables.push(towerGeo);

  // Molten Salt Receiver Crown
  const receiverGeo = new THREE.CylinderGeometry(0.62, 0.62, 1.15, 24);
  const receiver = new THREE.Mesh(receiverGeo, receiverMat);
  receiver.position.y = 1.95;
  root.add(receiver);
  disposables.push(receiverGeo);

  const spireGeo = new THREE.ConeGeometry(0.48, 0.9, 16);
  const spire = new THREE.Mesh(spireGeo, concreteMat);
  spire.position.y = 2.95;
  root.add(spire);
  disposables.push(spireGeo);

  // Concentric Heliostat Tracking Mirrors + Reflected Light Beams
  const mirrorCount = isSoftwareGl ? 24 : 36;
  const mirrorGeo = new THREE.BoxGeometry(0.75, 0.06, 0.55);
  const mirrorsInst = new THREE.InstancedMesh(mirrorGeo, mirrorMat, mirrorCount);
  const beamGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 6);
  const beamsInst = new THREE.InstancedMesh(beamGeo, sunRayMat, mirrorCount);
  root.add(mirrorsInst, beamsInst);
  disposables.push(mirrorGeo, beamGeo);

  const mAngles = new Float32Array(mirrorCount);
  const mRadii = new Float32Array(mirrorCount);
  for (let i = 0; i < mirrorCount; i++) {
    const ring = i < mirrorCount / 2 ? 0 : 1;
    const countInRing = mirrorCount / 2;
    mAngles[i] = ((i % countInRing) / countInRing) * Math.PI * 2 + ring * 0.25;
    mRadii[i] = ring === 0 ? 2.6 : 4.2;
  }

  // Sun Indicator Orb
  const sunGeo = new THREE.SphereGeometry(0.42, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const sunOrb = new THREE.Mesh(sunGeo, sunMat);
  root.add(sunOrb);
  disposables.push(sunGeo, sunMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const elevRad = THREE.MathUtils.degToRad(params.primaryParam);
      const powerNorm = Math.max(0.25, params.secondaryParam / 480);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      const receiverY = 1.95 + explode * 1.4;
      receiver.position.y = receiverY;
      spire.position.y = receiverY + 1.0 + explode * 0.6;
      receiverMat.emissiveIntensity = 0.85 + powerNorm * 1.15 + Math.sin(elapsed * 3 * speed) * 0.15;

      const sunAz = elapsed * 0.35 * speed;
      sunOrb.position.set(
        Math.cos(sunAz) * Math.cos(elevRad) * 6.5,
        Math.sin(elevRad) * 6.5,
        Math.sin(sunAz) * Math.cos(elevRad) * 6.5
      );

      for (let i = 0; i < mirrorCount; i++) {
        const r = mRadii[i] + explode * 0.9;
        const px = Math.cos(mAngles[i]) * r;
        const pz = Math.sin(mAngles[i]) * r;
        const py = -3.05;

        // Point normal roughly halfway between tower and sun
        _v3A.set(px, py, pz);
        _v3B.set(0 - px, receiverY - py, 0 - pz).normalize();
        const tilt = 0.42 + Math.sin(elevRad) * 0.35;
        _euler.set(tilt, -mAngles[i] + Math.PI / 2, 0);
        _quat.setFromEuler(_euler);
        _v3B.set(1, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        mirrorsInst.setMatrixAt(i, _m4);

        // Beam connecting mirror to receiver
        const midX = px * 0.5;
        const midY = (py + receiverY) * 0.5;
        const midZ = pz * 0.5;
        const dist = Math.hypot(px, receiverY - py, pz);
        _v3A.set(midX, midY, midZ);
        _v3B.set(-px, receiverY - py, -pz).normalize();
        _quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _v3B);
        _v3B.set(0.8 + powerNorm * 0.5, dist, 0.8 + powerNorm * 0.5);
        _m4.compose(_v3A, _quat, _v3B);
        beamsInst.setMatrixAt(i, _m4);
      }
      mirrorsInst.instanceMatrix.needsUpdate = true;
      beamsInst.instanceMatrix.needsUpdate = true;
      mirrorsInst.computeBoundingSphere();
      beamsInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 26. 7-TESLA SUPERCONDUCTING MRI TOMOGRAPHY SCANNER RING
// =========================================================================
export function buildMriTomographyMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.35,
    roughness: 0.25
  });
  const coilMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.85,
    roughness: 0.18,
    emissive: 0x0369a1,
    emissiveIntensity: 0.4
  });
  const sliceMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  disposables.push(shellMat, coilMat, sliceMat);

  const centerY = 0.5;
  const magnetRings: { mesh: THREE.Mesh; baseX: number }[] = [];
  const outerRingGeo = new THREE.TorusGeometry(2.3, 0.42, isSoftwareGl ? 12 : 20, 36);
  outerRingGeo.rotateY(Math.PI / 2);
  disposables.push(outerRingGeo);

  [-1.6, -0.55, 0.55, 1.6].forEach((bx) => {
    const ring = new THREE.Mesh(outerRingGeo, bx === -1.6 || bx === 1.6 ? shellMat : coilMat);
    ring.position.set(bx, centerY, 0);
    root.add(ring);
    magnetRings.push({ mesh: ring, baseX: bx });
  });

  // Patient Scanning Bed
  const railGeo = new THREE.BoxGeometry(8.5, 0.26, 1.35);
  const rail = new THREE.Mesh(railGeo, shellMat);
  rail.position.set(0, -1.65, 0);
  root.add(rail);
  disposables.push(railGeo);

  const cradleBed = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 1.1), coilMat);
  cradleBed.position.set(0, -1.35, 0);
  root.add(cradleBed);
  disposables.push(cradleBed.geometry);

  // Holographic Tomography Slice Planes sweeping across the bore
  const sliceCount = 7;
  const sliceGeo = new THREE.RingGeometry(0.25, 1.35, 28);
  sliceGeo.rotateY(Math.PI / 2);
  const slices: THREE.Mesh[] = [];
  for (let i = 0; i < sliceCount; i++) {
    const s = new THREE.Mesh(sliceGeo, sliceMat);
    s.position.set((i - 3) * 0.48, centerY, 0);
    root.add(s);
    slices.push(s);
  }
  disposables.push(sliceGeo);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const bNorm = Math.max(0.25, params.primaryParam / 7.0);
      const rfNorm = Math.max(0.3, params.secondaryParam / 300);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      magnetRings.forEach((r) => {
        r.mesh.position.x = r.baseX * (1 + explode * 1.45);
      });

      const scanX = Math.sin(elapsed * 0.9 * speed) * 1.35;
      cradleBed.position.x = scanX;

      slices.forEach((s, idx) => {
        s.position.x = ((idx - 3) * 0.48) + Math.sin(elapsed * 2.2 * rfNorm * speed + idx) * 0.14;
        const pulse = 0.72 + Math.sin(elapsed * 4.5 * bNorm * speed - idx * 0.7) * 0.28;
        s.scale.setScalar(pulse);
      });
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 27. SAGNAC OPTICAL RING GYROSCOPE & 3-AXIS INERTIAL GIMBAL
// =========================================================================
export function buildSagnacGyroMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.92,
    roughness: 0.16
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.25
  });
  const cwMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95 });
  const ccwMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.95 });
  disposables.push(goldMat, frameMat, cwMat, ccwMat);

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.3, 2.2, 20), frameMat);
  stand.position.y = -2.3;
  root.add(stand);
  disposables.push(stand.geometry);

  const gimbalOuter = new THREE.Group();
  gimbalOuter.position.y = 0.5;
  root.add(gimbalOuter);

  const ringGeo = new THREE.TorusGeometry(2.65, 0.12, 10, isSoftwareGl ? 24 : 42);
  const ring1 = new THREE.Mesh(ringGeo, goldMat);
  gimbalOuter.add(ring1);
  disposables.push(ringGeo);

  const gimbalMid = new THREE.Group();
  gimbalOuter.add(gimbalMid);
  const ringMidGeo = new THREE.TorusGeometry(2.15, 0.1, 10, isSoftwareGl ? 24 : 38);
  const ring2 = new THREE.Mesh(ringMidGeo, frameMat);
  gimbalMid.add(ring2);
  disposables.push(ringMidGeo);

  const fiberCore = new THREE.Group();
  gimbalMid.add(fiberCore);
  const hexLoopGeo = new THREE.TorusGeometry(1.55, 0.08, 8, 6);
  const hexLoop = new THREE.Mesh(hexLoopGeo, goldMat);
  fiberCore.add(hexLoop);
  disposables.push(hexLoopGeo);

  // Counter-propagating photon packets
  const packetCount = 16;
  const pktGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const cwInst = new THREE.InstancedMesh(pktGeo, cwMat, packetCount);
  const ccwInst = new THREE.InstancedMesh(pktGeo, ccwMat, packetCount);
  fiberCore.add(cwInst, ccwInst);
  disposables.push(pktGeo);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const omegaNorm = Math.max(0.2, params.primaryParam / 14);
      const fiberNorm = Math.max(0.25, params.secondaryParam / 1200);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      gimbalOuter.rotation.y = elapsed * 0.7 * omegaNorm * speed;
      gimbalMid.rotation.x = Math.sin(elapsed * 0.9 * speed) * 0.65;
      fiberCore.rotation.z = elapsed * 1.15 * omegaNorm * speed;

      ring1.scale.setScalar(1 + explode * 0.45);
      ring2.scale.setScalar(1 + explode * 0.25);

      _quat.identity();
      for (let i = 0; i < packetCount; i++) {
        const aCw = (i / packetCount) * Math.PI * 2 + elapsed * 2.6 * fiberNorm * speed;
        _v3A.set(Math.cos(aCw) * 1.55, Math.sin(aCw) * 1.55, 0);
        _v3B.setScalar(1);
        _m4.compose(_v3A, _quat, _v3B);
        cwInst.setMatrixAt(i, _m4);

        const aCcw = (i / packetCount) * Math.PI * 2 - elapsed * (2.6 * fiberNorm + omegaNorm * 0.45) * speed;
        _v3A.set(Math.cos(aCcw) * 1.55, Math.sin(aCcw) * 1.55, 0);
        _m4.compose(_v3A, _quat, _v3B);
        ccwInst.setMatrixAt(i, _m4);
      }
      cwInst.instanceMatrix.needsUpdate = true;
      ccwInst.instanceMatrix.needsUpdate = true;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 28. NEGATIVE-INDEX METAMATERIAL CLOAK & EM WAVE STREAM BENDING
// =========================================================================
export function buildMetamaterialCloakMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const latticeMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.75,
    roughness: 0.22,
    wireframe: true
  });
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0
  });
  const waveMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  disposables.push(latticeMat, coreMat, waveMat);

  const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 24), coreMat);
  coreSphere.position.y = 0.4;
  root.add(coreSphere);
  disposables.push(coreSphere.geometry);

  // Split-Ring Resonator Cloak Shells
  const cloakShells: THREE.Mesh[] = [];
  [1.45, 2.0, 2.55].forEach((r) => {
    const geo = new THREE.TorusGeometry(r, 0.16, 10, isSoftwareGl ? 22 : 36);
    geo.rotateX(Math.PI / 2);
    const mesh = new THREE.Mesh(geo, latticeMat);
    mesh.position.y = 0.4;
    root.add(mesh);
    cloakShells.push(mesh);
    disposables.push(geo);
  });

  // EM Wave Stream Photons curving smoothly around the Cloak (Zero scattering!)
  const rayCount = isSoftwareGl ? 60 : 96;
  const rayGeo = new THREE.BoxGeometry(0.32, 0.06, 0.06);
  const raysInst = new THREE.InstancedMesh(rayGeo, waveMat, rayCount);
  const rayZ = new Float32Array(rayCount);
  const rayOffset = new Float32Array(rayCount);
  for (let i = 0; i < rayCount; i++) {
    const lane = (i % 8) - 3.5;
    rayZ[i] = lane * 0.52;
    rayOffset[i] = Math.floor(i / 8) / (rayCount / 8);
  }
  root.add(raysInst);
  disposables.push(rayGeo);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const indexNeg = Math.abs(params.primaryParam);
      const ghzNorm = Math.max(0.25, params.secondaryParam / 10);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      cloakShells.forEach((s, idx) => {
        s.rotation.z = elapsed * (idx % 2 === 0 ? 0.45 : -0.45) * speed;
        s.position.y = 0.4 + (idx - 1) * explode * 1.1;
      });

      for (let i = 0; i < rayCount; i++) {
        const frac = (rayOffset[i] + elapsed * 0.36 * ghzNorm * speed) % 1;
        const x = -5.5 + frac * 11.0;
        const z0 = rayZ[i];
        const cloakR = 2.65;
        const dist = Math.hypot(x, z0);
        let zCurved = z0;
        let angleZ = 0;
        if (dist < cloakR) {
          const sign = z0 >= 0 ? 1 : -1;
          const push = Math.sqrt(Math.max(0, cloakR * cloakR - x * x)) - Math.abs(z0);
          zCurved = z0 + sign * push * Math.min(1.15, 0.65 + indexNeg * 0.25);
          angleZ = -x * sign * 0.16;
        }
        _euler.set(0, angleZ, 0);
        _quat.setFromEuler(_euler);
        _v3A.set(x, 0.4 + Math.sin(frac * Math.PI * 4) * 0.08, zCurved);
        _v3B.set(1, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        raysInst.setMatrixAt(i, _m4);
      }
      raysInst.instanceMatrix.needsUpdate = true;
      raysInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 29. ULTRASONIC PHASED ACOUSTIC LEVITATION CAVITY
// =========================================================================
export function buildAcousticLevitationMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const emitterMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.88,
    roughness: 0.22
  });
  const piezoMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 0.5,
    metalness: 0.7,
    roughness: 0.2
  });
  const nodeMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide
  });
  const beadMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    metalness: 0.2,
    roughness: 0.05,
    clearcoat: 1.0,
    emissive: 0xd97706,
    emissiveIntensity: 0.35
  });
  disposables.push(emitterMat, piezoMat, nodeMat, beadMat);

  // Bottom & Top Ultrasonic Transducer Plates
  const plateGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.38, 32);
  const botPlate = new THREE.Mesh(plateGeo, emitterMat);
  botPlate.position.y = -2.4;
  const topPlate = new THREE.Mesh(plateGeo, emitterMat);
  topPlate.position.y = 2.8;
  root.add(botPlate, topPlate);
  disposables.push(plateGeo);

  // Support Struts
  const strutGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.2, 10);
  disposables.push(strutGeo);
  [-1.95, 1.95].forEach((x) => {
    const s = new THREE.Mesh(strutGeo, emitterMat);
    s.position.set(x, 0.2, 0);
    root.add(s);
  });

  // Standing-Wave Pressure Disks & Levitating Droplets
  const waveNodes: THREE.Mesh[] = [];
  const droplets: THREE.Mesh[] = [];
  const diskGeo = new THREE.CircleGeometry(1.65, isSoftwareGl ? 20 : 32);
  diskGeo.rotateX(Math.PI / 2);
  const beadGeo = new THREE.SphereGeometry(0.24, 18, 18);
  disposables.push(diskGeo, beadGeo);

  for (let i = 0; i < 6; i++) {
    const y = -1.55 + i * 0.7;
    const disk = new THREE.Mesh(diskGeo, nodeMat);
    disk.position.y = y;
    root.add(disk);
    waveNodes.push(disk);

    const bead = new THREE.Mesh(beadGeo, beadMat);
    bead.position.y = y;
    root.add(bead);
    droplets.push(bead);
  }

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const freqNorm = Math.max(0.3, params.primaryParam / 40);
      const pressureNorm = Math.max(0.25, params.secondaryParam / 65);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      topPlate.position.y = 2.8 + explode * 1.4;
      botPlate.position.y = -2.4 - explode * 0.8;

      waveNodes.forEach((disk, idx) => {
        const yBase = -1.55 + idx * 0.7;
        disk.position.y = yBase * (1 + explode * 0.35);
        const s = 0.82 + Math.sin(elapsed * 6.5 * freqNorm * speed + idx * 1.1) * 0.18 * pressureNorm;
        disk.scale.setScalar(s);
      });

      droplets.forEach((bead, idx) => {
        const yBase = -1.55 + idx * 0.7;
        bead.position.y = yBase * (1 + explode * 0.35) + Math.sin(elapsed * 4.2 * speed + idx) * 0.08;
        bead.position.x = Math.cos(elapsed * 1.5 * speed + idx) * 0.04;
        bead.rotation.y = elapsed * 2.2 * speed;
      });
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 30. PHOTONIC MACH-ZEHNDER TENSOR NPU CROSSBAR MATRIX
// =========================================================================
export function buildPhotonicTensorCoreMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const waferMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.75,
    roughness: 0.18
  });
  const waveguideMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.85,
    roughness: 0.15,
    emissive: 0x0284c7,
    emissiveIntensity: 0.45
  });
  const mziNodeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.18
  });
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending
  });
  disposables.push(waferMat, waveguideMat, mziNodeMat, pulseMat);

  // Silicon Nitride Optical Wafer Substrate
  const wafer = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.36, 7.2), waferMat);
  wafer.position.y = -2.2;
  root.add(wafer);
  disposables.push(wafer.geometry);

  // 4x4 Mach-Zehnder Interferometer Nodes + Waveguide Rails
  const mziNodes: THREE.Mesh[] = [];
  const nodeGeo = new THREE.OctahedronGeometry(0.32, 0);
  const railGeo = new THREE.BoxGeometry(6.4, 0.08, 0.08);
  disposables.push(nodeGeo, railGeo);

  for (let i = 0; i < 4; i++) {
    const coord = -2.1 + i * 1.4;
    const hRail = new THREE.Mesh(railGeo, waveguideMat);
    hRail.position.set(0, -1.85, coord);
    const vRail = new THREE.Mesh(railGeo, waveguideMat);
    vRail.rotation.y = Math.PI / 2;
    vRail.position.set(coord, -1.85, 0);
    root.add(hRail, vRail);

    for (let j = 0; j < 4; j++) {
      const m = new THREE.Mesh(nodeGeo, mziNodeMat);
      m.position.set(-2.1 + j * 1.4, -1.55, coord);
      root.add(m);
      mziNodes.push(m);
    }
  }

  // WDM Multi-Wavelength Optical Pulses racing across crossbar
  const pulseCount = isSoftwareGl ? 32 : 48;
  const pulseGeo = new THREE.BoxGeometry(0.32, 0.09, 0.09);
  const pulsesInst = new THREE.InstancedMesh(pulseGeo, pulseMat, pulseCount);
  for (let i = 0; i < pulseCount; i++) {
    _col.setHSL((i % 8) * 0.11, 0.92, 0.62);
    pulsesInst.setColorAt(i, _col);
  }
  if (pulsesInst.instanceColor) pulsesInst.instanceColor.needsUpdate = true;
  root.add(pulsesInst);
  disposables.push(pulseGeo);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const clockNorm = Math.max(0.25, params.primaryParam / 100);
      const wdmNorm = Math.max(0.25, params.secondaryParam / 16);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      mziNodes.forEach((m, idx) => {
        m.position.y = -1.55 + explode * (0.4 + (idx % 4) * 0.35);
        m.rotation.y = elapsed * (1.2 + (idx % 4) * 0.25) * clockNorm * speed;
      });

      for (let i = 0; i < pulseCount; i++) {
        const isRow = i % 2 === 0;
        const lane = -2.1 + (Math.floor(i / 2) % 4) * 1.4;
        const phase = ((i / pulseCount) + elapsed * 0.72 * clockNorm * speed) % 1;
        const pos = -3.1 + phase * 6.2;

        _euler.set(0, isRow ? 0 : Math.PI / 2, 0);
        _quat.setFromEuler(_euler);
        _v3A.set(isRow ? pos : lane, -1.78 + explode * 0.35, isRow ? lane : pos);
        _v3B.set(0.8 + wdmNorm * 0.55, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        pulsesInst.setMatrixAt(i, _m4);
      }
      pulsesInst.instanceMatrix.needsUpdate = true;
      pulsesInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

export function buildMegastructureMonument(
  id: MonumentId,
  isSoftwareGl: boolean
): BuiltMonument | null {
  switch (id) {
    case 'lidar_autonomous_core':
      return buildLidarAutonomousMonument(isSoftwareGl);
    case 'solar_thermal_tower':
      return buildSolarThermalTowerMonument(isSoftwareGl);
    case 'mri_tomography_ring':
      return buildMriTomographyMonument(isSoftwareGl);
    case 'sagnac_ring_gyro':
      return buildSagnacGyroMonument(isSoftwareGl);
    case 'metamaterial_cloak':
      return buildMetamaterialCloakMonument(isSoftwareGl);
    case 'acoustic_levitation':
      return buildAcousticLevitationMonument(isSoftwareGl);
    case 'photonic_tensor_core':
      return buildPhotonicTensorCoreMonument(isSoftwareGl);
    default:
      return null;
  }
}
