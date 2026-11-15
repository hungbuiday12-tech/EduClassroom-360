import * as THREE from 'three';
import { BuiltMonument, MonumentId, SynapseV2Params } from './synapseCatalog';

// Module-scope scratch math objects (zero GC churn inside requestAnimationFrame)
const _m4 = new THREE.Matrix4();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _v3C = new THREE.Vector3();
const _vUp = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _col = new THREE.Color();

// =========================================================================
// 05. SUPERCONDUCTING QUANTUM CRYOSTAT CHANDELIER & BLOCH SPHERE CORE
// =========================================================================
export function buildQuantumCryostat(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const goldPlateMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.92,
    roughness: 0.16,
    emissive: 0x422006,
    emissiveIntensity: 0.3
  });
  const copperTubeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.88,
    roughness: 0.24
  });
  const darkAlloyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.3
  });
  const blochWireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.34
  });
  const shieldGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity: isSoftwareGl ? 0.18 : 0.24,
    transmission: isSoftwareGl ? 0 : 0.55,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  disposables.push(goldPlateMat, copperTubeMat, darkAlloyMat, blochWireMat, shieldGlassMat);

  // 4 tiered dilution plates descending from an upper vacuum crown
  const plateRadii = [3.6, 2.95, 2.35, 1.75];
  const plateBaseY = [4.9, 3.6, 2.35, 1.25];
  const plates: THREE.Mesh[] = [];
  for (let i = 0; i < plateRadii.length; i++) {
    const pGeo = new THREE.CylinderGeometry(plateRadii[i], plateRadii[i], 0.16, 42);
    const pMesh = new THREE.Mesh(pGeo, i % 2 === 0 ? goldPlateMat : copperTubeMat);
    pMesh.position.y = plateBaseY[i];
    root.add(pMesh);
    plates.push(pMesh);
    disposables.push(pGeo);
  }

  // Structural brass columns connecting tiers
  const colGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.9, 10);
  const colCount = 6;
  const colsInst = new THREE.InstancedMesh(colGeo, goldPlateMat, colCount);
  for (let i = 0; i < colCount; i++) {
    const a = (i / colCount) * Math.PI * 2;
    _v3A.set(Math.cos(a) * 1.45, 3.05, Math.sin(a) * 1.45);
    _quat.identity();
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    colsInst.setMatrixAt(i, _m4);
  }
  colsInst.computeBoundingSphere();
  root.add(colsInst);
  disposables.push(colGeo);

  // Helical microwave coaxial waveguide tubes spiraling down chandelier
  const coaxGroup = new THREE.Group();
  root.add(coaxGroup);
  for (let t = 0; t < 8; t++) {
    const a0 = (t / 8) * Math.PI * 2;
    const pts: THREE.Vector3[] = [];
    for (let s = 0; s <= 12; s++) {
      const f = s / 12;
      const r = THREE.MathUtils.lerp(3.1, 0.95, f);
      const y = THREE.MathUtils.lerp(4.9, 1.3, f);
      const ang = a0 + f * Math.PI * 0.9;
      pts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.032, 6, false);
    coaxGroup.add(new THREE.Mesh(tubeGeo, copperTubeMat));
    disposables.push(tubeGeo);
  }

  // Central Bloch Sphere Qubit State Chamber at bottom focus (y = 0.05..2.0 -> centered y=0.65)
  const blochPivot = new THREE.Group();
  blochPivot.position.y = 0.3;
  root.add(blochPivot);

  const blochShellGeo = new THREE.SphereGeometry(1.15, 24, 18);
  const blochShell = new THREE.Mesh(blochShellGeo, blochWireMat);
  blochPivot.add(blochShell);
  disposables.push(blochShellGeo);

  const eqGeo = new THREE.TorusGeometry(1.16, 0.025, 10, 64);
  const eqRing = new THREE.Mesh(eqGeo, goldPlateMat);
  eqRing.rotation.x = Math.PI / 2;
  blochPivot.add(eqRing);
  disposables.push(eqGeo);

  // State vector arrow |ψ⟩ rotating inside the Bloch sphere
  const vecGroup = new THREE.Group();
  blochPivot.add(vecGroup);
  const vecShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12);
  const vecMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.8,
    roughness: 0.2
  });
  const vecShaft = new THREE.Mesh(vecShaftGeo, vecMat);
  vecShaft.position.y = 0.5;
  const vecTipGeo = new THREE.ConeGeometry(0.11, 0.24, 14);
  const vecTip = new THREE.Mesh(vecTipGeo, vecMat);
  vecTip.position.y = 1.05;
  vecGroup.add(vecShaft, vecTip);
  disposables.push(vecShaftGeo, vecTipGeo, vecMat);

  // Split cryo vacuum containment shroud (separates vertically/radially on Cutaway)
  const shroudGeo = new THREE.CylinderGeometry(3.85, 3.85, 4.4, 36, 1, true);
  const shroudMesh = new THREE.Mesh(shroudGeo, shieldGlassMat);
  shroudMesh.position.y = 2.95;
  shroudMesh.renderOrder = 2;
  root.add(shroudMesh);
  disposables.push(shroudGeo);

  // Instanced orbiting Qubit nodes around the chandelier
  const qbCount = isSoftwareGl ? 72 : 144;
  const qbGeo = new THREE.OctahedronGeometry(0.09, 0);
  const qbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.6,
    roughness: 0.15
  });
  const qbInst = new THREE.InstancedMesh(qbGeo, qbMat, qbCount);
  qbInst.frustumCulled = false;
  const qbAngle = new Float32Array(qbCount);
  const qbRad = new Float32Array(qbCount);
  const qbY = new Float32Array(qbCount);
  for (let i = 0; i < qbCount; i++) {
    qbAngle[i] = Math.random() * Math.PI * 2;
    qbRad[i] = 2.0 + Math.random() * 2.8;
    qbY[i] = 0.2 + Math.random() * 4.2;
    _col.setHSL(i % 2 === 0 ? 0.54 : 0.13, 0.9, 0.65);
    qbInst.setColorAt(i, _col);
  }
  if (qbInst.instanceColor) qbInst.instanceColor.needsUpdate = true;
  root.add(qbInst);
  disposables.push(qbGeo, qbMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const qubitNorm = params.primaryParam / 128; // 0.125..4
      const t2Norm = params.secondaryParam / 190;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      for (let i = 0; i < plates.length; i++) {
        plates[i].position.y = plateBaseY[i] + (3 - i) * explode * 0.55;
        plates[i].rotation.y = elapsed * 0.15 * (i % 2 === 0 ? 1 : -1) * speed;
      }
      coaxGroup.rotation.y = -elapsed * 0.12 * speed;
      shroudMesh.position.y = 2.95 + explode * 3.1;
      shroudMesh.scale.setScalar(1 + explode * 0.22);

      // Precess Bloch vector smoothly
      vecGroup.rotation.z = Math.sin(elapsed * 1.4 * speed * t2Norm) * 1.15;
      vecGroup.rotation.y = elapsed * 2.2 * speed;

      const activeQubits = Math.min(qbCount, Math.max(12, Math.floor(qbCount * (0.2 + qubitNorm * 0.25))));
      _quat.identity();
      for (let i = 0; i < qbCount; i++) {
        if (i >= activeQubits) {
          _v3A.set(0, -100, 0);
          _v3B.setScalar(0.001);
          _m4.compose(_v3A, _quat, _v3B);
          qbInst.setMatrixAt(i, _m4);
          continue;
        }
        qbAngle[i] += delta * (0.5 + (i % 5) * 0.12) * speed;
        const r = qbRad[i] + explode * 0.9;
        _v3A.set(Math.cos(qbAngle[i]) * r, qbY[i] + Math.sin(elapsed * 2 + i) * 0.15, Math.sin(qbAngle[i]) * r);
        _euler.set(elapsed + i, elapsed * 1.3, 0);
        _quat.setFromEuler(_euler);
        _v3B.setScalar(0.85 + 0.35 * Math.sin(elapsed * 3 + i));
        _m4.compose(_v3A, _quat, _v3B);
        qbInst.setMatrixAt(i, _m4);
      }
      qbInst.instanceMatrix.needsUpdate = true;
      qbInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 06. GRAVITATIONAL WAVE LIGO INTERFEROMETER & BINARY NEUTRON STARS
// =========================================================================
export function buildGravitationalLigo(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // Live Deforming Spacetime Mesh (Quadrupole Gravitational Ripple Grid)
  const segs = isSoftwareGl ? 36 : 60;
  const gridGeo = new THREE.PlaneGeometry(13.5, 13.5, segs, segs);
  gridGeo.rotateX(-Math.PI / 2);
  const gridMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.48,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const spacetimeMesh = new THREE.Mesh(gridGeo, gridMat);
  spacetimeMesh.position.y = -0.35;
  root.add(spacetimeMesh);
  disposables.push(gridGeo, gridMat);

  // Store original XZ for fast deformation
  const posAttr = gridGeo.getAttribute('position') as THREE.BufferAttribute;
  const baseXZ = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    baseXZ[i * 2] = posAttr.getX(i);
    baseXZ[i * 2 + 1] = posAttr.getZ(i);
  }

  // Binary Neutron Stars spiraling at y = 2.65
  const binaryGroup = new THREE.Group();
  binaryGroup.position.y = 2.65;
  root.add(binaryGroup);

  const star1Geo = new THREE.SphereGeometry(0.46, 24, 24);
  const star1Mat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    emissive: 0x22d3ee,
    emissiveIntensity: 2.2,
    roughness: 0.1
  });
  const star2Mat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0xa855f7,
    emissiveIntensity: 2.2,
    roughness: 0.1
  });
  const star1 = new THREE.Mesh(star1Geo, star1Mat);
  const star2 = new THREE.Mesh(star1Geo, star2Mat);
  binaryGroup.add(star1, star2);
  disposables.push(star1Geo, star1Mat, star2Mat);

  // Accretion/inspiral bridge ring
  const orbitTrailGeo = new THREE.TorusGeometry(1.35, 0.035, 10, 64);
  orbitTrailGeo.rotateX(Math.PI / 2);
  const trailMesh = new THREE.Mesh(orbitTrailGeo, star1Mat);
  binaryGroup.add(trailMesh);
  disposables.push(orbitTrailGeo);

  // Orthogonal L-shaped 4km LIGO Laser Interferometer Arms at y = 0.85
  const ligoRig = new THREE.Group();
  ligoRig.position.y = 0.85;
  root.add(ligoRig);

  const beamMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.9 });
  const housingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.22 });
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.08 });
  disposables.push(beamMat, housingMat, mirrorMat);

  const armGeo = new THREE.CylinderGeometry(0.045, 0.045, 5.2, 12);
  const beamX = new THREE.Mesh(armGeo, beamMat);
  beamX.rotation.z = Math.PI / 2;
  beamX.position.x = 2.6;
  const beamZ = new THREE.Mesh(armGeo, beamMat);
  beamZ.rotation.x = Math.PI / 2;
  beamZ.position.z = 2.6;
  ligoRig.add(beamX, beamZ);
  disposables.push(armGeo);

  // Corner splitter + 2 End-Station Fabry-Pérot mirror housings
  const stationGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const mirrorGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 20);
  const cornerStation = new THREE.Mesh(stationGeo, housingMat);
  const endStationX = new THREE.Mesh(stationGeo, housingMat);
  endStationX.position.set(5.3, 0, 0);
  const endStationZ = new THREE.Mesh(stationGeo, housingMat);
  endStationZ.position.set(0, 0, 5.3);

  const m1 = new THREE.Mesh(mirrorGeo, mirrorMat);
  m1.rotation.z = Math.PI / 2;
  m1.position.set(4.85, 0, 0);
  const m2 = new THREE.Mesh(mirrorGeo, mirrorMat);
  m2.rotation.x = Math.PI / 2;
  m2.position.set(0, 0, 4.85);
  ligoRig.add(cornerStation, endStationX, endStationZ, m1, m2);
  disposables.push(stationGeo, mirrorGeo);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const freqNorm = params.primaryParam / 140;
      const strainNorm = params.secondaryParam / 55;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      const t = elapsed * 2.4 * freqNorm * speed;
      const orbitR = 1.25 - Math.min(0.45, (freqNorm - 1) * 0.25);
      star1.position.set(Math.cos(t) * orbitR, 0, Math.sin(t) * orbitR);
      star2.position.set(-Math.cos(t) * orbitR, 0, -Math.sin(t) * orbitR);
      trailMesh.scale.setScalar(orbitR / 1.35);
      binaryGroup.position.y = 2.65 + explode * 1.6;
      ligoRig.position.y = 0.85 + explode * 0.6;

      // Deform spacetime grid in real time (outgoing spiral quadrupole wave)
      for (let i = 0; i < posAttr.count; i++) {
        const x = baseXZ[i * 2];
        const z = baseXZ[i * 2 + 1];
        const r = Math.sqrt(x * x + z * z) + 0.001;
        const theta = Math.atan2(z, x);
        const well = -1.6 / (1 + r * r * 0.35);
        const ripple =
          Math.sin(r * 2.3 - t * 2 + 2 * theta) *
          0.26 *
          strainNorm *
          Math.exp(-r * 0.14);
        posAttr.setY(i, well + ripple);
      }
      posAttr.needsUpdate = true;

      // Differential interferometer strain pulse on end test-masses
      const strainPulse = Math.sin(t * 2) * 0.16 * strainNorm;
      endStationX.position.x = 5.3 + strainPulse;
      endStationZ.position.z = 5.3 - strainPulse;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 07. GEOSTATIONARY SPACE ELEVATOR & ORBITAL RINGPORT
// =========================================================================
export function buildSpaceElevator(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // Stylized Ocean/Continent Anchor Planet at bottom center
  const planetGeo = new THREE.SphereGeometry(2.15, 36, 28);
  const planetMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0c4a6e,
    emissiveIntensity: 0.45,
    metalness: 0.25,
    roughness: 0.45
  });
  const planetMesh = new THREE.Mesh(planetGeo, planetMat);
  planetMesh.position.y = -0.35;
  root.add(planetMesh);
  disposables.push(planetGeo, planetMat);

  // Luminous atmospheric shell
  const atmoGeo = new THREE.SphereGeometry(2.3, 32, 24);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide
  });
  const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
  atmoMesh.position.y = -0.35;
  root.add(atmoMesh);
  disposables.push(atmoGeo, atmoMat);

  // Towering Carbon Nanotube Orbital Tether up to GEO Counterweight
  const tetherGeo = new THREE.CylinderGeometry(0.055, 0.055, 7.6, 12);
  const tetherMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.94,
    roughness: 0.15,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.35
  });
  const tetherMesh = new THREE.Mesh(tetherGeo, tetherMat);
  tetherMesh.position.y = 4.65;
  root.add(tetherMesh);
  disposables.push(tetherGeo, tetherMat);

  // Active Climber Carriage traveling up & down the tether
  const climberGroup = new THREE.Group();
  climberGroup.position.y = 3.2;
  root.add(climberGroup);
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.2 });
  const glowRingMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 1.6,
    roughness: 0.15
  });
  const cBodyGeo = new THREE.CylinderGeometry(0.42, 0.52, 0.65, 18);
  const cRingGeo = new THREE.TorusGeometry(0.68, 0.055, 10, 32);
  cRingGeo.rotateX(Math.PI / 2);
  const cBody = new THREE.Mesh(cBodyGeo, hullMat);
  const cRing = new THREE.Mesh(cRingGeo, glowRingMat);
  climberGroup.add(cBody, cRing);
  disposables.push(hullMat, glowRingMat, cBodyGeo, cRingGeo);

  // Geostationary Counterweight Orbital Ring Citadel at y = 7.6
  const geoHub = new THREE.Group();
  geoHub.position.y = 7.4;
  root.add(geoHub);

  const hubWheelGeo = new THREE.TorusGeometry(2.2, 0.12, 14, 48);
  hubWheelGeo.rotateX(Math.PI / 2);
  const hubWheel = new THREE.Mesh(hubWheelGeo, hullMat);
  const hubCoreGeo = new THREE.OctahedronGeometry(0.62, 1);
  const hubCore = new THREE.Mesh(hubCoreGeo, glowRingMat);
  geoHub.add(hubWheel, hubCore);
  disposables.push(hubWheelGeo, hubCoreGeo);

  // Spokes on GEO Ringport
  const spokeGeo = new THREE.BoxGeometry(4.3, 0.08, 0.08);
  const s1 = new THREE.Mesh(spokeGeo, tetherMat);
  const s2 = new THREE.Mesh(spokeGeo, tetherMat);
  s2.rotation.y = Math.PI / 2;
  geoHub.add(s1, s2);
  disposables.push(spokeGeo);

  // Instanced constellation of orbital satellites
  const satCount = isSoftwareGl ? 32 : 64;
  const satGeo = new THREE.BoxGeometry(0.18, 0.06, 0.34);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.2
  });
  const satInst = new THREE.InstancedMesh(satGeo, satMat, satCount);
  satInst.frustumCulled = false;
  const satTheta = new Float32Array(satCount);
  const satRad = new Float32Array(satCount);
  const satTilt = new Float32Array(satCount);
  for (let i = 0; i < satCount; i++) {
    satTheta[i] = (i / satCount) * Math.PI * 2;
    satRad[i] = 3.2 + (i % 4) * 0.65;
    satTilt[i] = ((i % 3) - 1) * 0.45;
  }
  root.add(satInst);
  disposables.push(satGeo, satMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const velNorm = params.primaryParam / 480;
      const tensionNorm = params.secondaryParam / 68;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      planetMesh.rotation.y = elapsed * 0.22 * speed;
      geoHub.rotation.y = elapsed * 0.35 * speed;
      geoHub.position.y = 7.4 + explode * 1.8;

      // Climber oscillates smoothly along the nanotube tether
      const climbPhase = (elapsed * 0.45 * velNorm * speed) % (Math.PI * 2);
      climberGroup.position.y = 2.3 + (Math.sin(climbPhase) * 0.5 + 0.5) * 4.1;
      climberGroup.rotation.y = -elapsed * 1.4 * speed;
      cRing.scale.setScalar(1 + explode * 0.55);
      tetherMesh.scale.set(0.8 + tensionNorm * 0.35, 1 + explode * 0.2, 0.8 + tensionNorm * 0.35);

      for (let i = 0; i < satCount; i++) {
        satTheta[i] += delta * (0.45 + (i % 5) * 0.1) * speed;
        const r = satRad[i] + explode * 1.1;
        const x = Math.cos(satTheta[i]) * r;
        const z = Math.sin(satTheta[i]) * r;
        const y = 3.2 + Math.sin(satTheta[i]) * satTilt[i] * 2.2;
        _v3A.set(x, y, z);
        _euler.set(0, -satTheta[i], satTilt[i]);
        _quat.setFromEuler(_euler);
        _v3B.setScalar(1);
        _m4.compose(_v3A, _quat, _v3B);
        satInst.setMatrixAt(i, _m4);
      }
      satInst.instanceMatrix.needsUpdate = true;
      satInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 08. ALCUBIERRE WARP DRIVE & SPACETIME METRIC BUBBLE
// =========================================================================
export function buildWarpAlcubierre(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const shipGroup = new THREE.Group();
  shipGroup.position.y = 2.2;
  root.add(shipGroup);

  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2
  });
  const exoticRingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x6366f1,
    emissiveIntensity: 1.8,
    metalness: 0.65,
    roughness: 0.15
  });
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: isSoftwareGl ? 0.14 : 0.2,
    wireframe: true
  });
  disposables.push(titaniumMat, exoticRingMat, bubbleMat);

  // Sleek central warp needle hull (Lathe profile oriented along X axis)
  const hullGeo = new THREE.ConeGeometry(0.45, 5.2, 24);
  hullGeo.rotateZ(-Math.PI / 2);
  const hullMesh = new THREE.Mesh(hullGeo, titaniumMat);
  shipGroup.add(hullMesh);
  disposables.push(hullGeo);

  // Dual Alcubierre Exotic-Matter Toroidal Warp Coils
  const coilGeo1 = new THREE.TorusGeometry(2.05, 0.16, 18, 64);
  coilGeo1.rotateY(Math.PI / 2);
  const coil1 = new THREE.Mesh(coilGeo1, exoticRingMat);
  coil1.position.x = 0.85;

  const coilGeo2 = new THREE.TorusGeometry(2.35, 0.16, 18, 64);
  coilGeo2.rotateY(Math.PI / 2);
  const coil2 = new THREE.Mesh(coilGeo2, exoticRingMat);
  coil2.position.x = -0.95;

  // Struts binding rings to central fuselage
  const strutGeo = new THREE.BoxGeometry(0.14, 4.3, 0.14);
  const s1 = new THREE.Mesh(strutGeo, titaniumMat);
  s1.position.x = 0.85;
  const s2 = new THREE.Mesh(strutGeo, titaniumMat);
  s2.rotation.x = Math.PI / 2;
  s2.position.x = -0.95;

  // Ellipsoidal spacetime warp bubble mesh
  const bubbleGeo = new THREE.SphereGeometry(3.2, 28, 20);
  bubbleGeo.scale(1.35, 0.92, 0.92);
  const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);

  shipGroup.add(coil1, coil2, s1, s2, bubbleMesh);
  disposables.push(coilGeo1, coilGeo2, strutGeo, bubbleGeo);

  // High-velocity relativistic starstreak tunnel (InstancedMesh)
  const streakCount = isSoftwareGl ? 140 : 280;
  const streakGeo = new THREE.BoxGeometry(1.1, 0.025, 0.025);
  const streakMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
  const streakInst = new THREE.InstancedMesh(streakGeo, streakMat, streakCount);
  streakInst.frustumCulled = false;
  const sx = new Float32Array(streakCount);
  const sy = new Float32Array(streakCount);
  const sz = new Float32Array(streakCount);
  for (let i = 0; i < streakCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const rad = 2.8 + Math.random() * 4.5;
    sx[i] = (Math.random() - 0.5) * 18;
    sy[i] = Math.sin(a) * rad;
    sz[i] = Math.cos(a) * rad;
    _col.setHSL(0.52 + Math.random() * 0.16, 0.9, 0.72);
    streakInst.setColorAt(i, _col);
  }
  if (streakInst.instanceColor) streakInst.instanceColor.needsUpdate = true;
  shipGroup.add(streakInst);
  disposables.push(streakGeo, streakMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const warpNorm = params.primaryParam / 6;
      const fluxNorm = params.secondaryParam / 72;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      coil1.rotation.x = elapsed * 1.4 * speed;
      coil2.rotation.x = -elapsed * 1.1 * speed;
      coil1.position.x = 0.85 + explode * 1.3;
      coil2.position.x = -0.95 - explode * 1.3;
      bubbleMesh.scale.set(
        (1.35 + explode * 0.25) * (0.95 + Math.sin(elapsed * 3) * 0.03),
        0.92 + explode * 0.2,
        0.92 + explode * 0.2
      );
      exoticRingMat.emissiveIntensity = 1.2 + fluxNorm * 1.1;

      _quat.identity();
      const flowSpeed = 7.5 * warpNorm * speed;
      for (let i = 0; i < streakCount; i++) {
        sx[i] -= delta * flowSpeed;
        if (sx[i] < -9) sx[i] = 9;
        _v3A.set(sx[i], sy[i], sz[i]);
        _v3B.set(0.6 + warpNorm * 0.85, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        streakInst.setMatrixAt(i, _m4);
      }
      streakInst.instanceMatrix.needsUpdate = true;
      streakInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 09. CALABI-YAU 6D MANIFOLD & POINCARÉ HYPERBOLIC DISK
// =========================================================================
export function buildHyperbolicCalabi(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // Hyperbolic Poincaré Disk Floor with concentric geodesic halos
  const diskGroup = new THREE.Group();
  diskGroup.position.y = -0.15;
  root.add(diskGroup);

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.9,
    metalness: 0.7,
    roughness: 0.2
  });
  const goldKnotMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 0.8,
    metalness: 0.85,
    roughness: 0.16
  });
  disposables.push(ringMat, goldKnotMat);

  for (let r = 1; r <= 5; r++) {
    const tGeo = new THREE.TorusGeometry(r * 1.05, 0.032, 10, 64);
    tGeo.rotateX(Math.PI / 2);
    diskGroup.add(new THREE.Mesh(tGeo, ringMat));
    disposables.push(tGeo);
  }

  // Sculptural Parametric Manifold Core (Vertex-colored quintic Calabi-Yau projection)
  const uSeg = isSoftwareGl ? 32 : 52;
  const vSeg = isSoftwareGl ? 24 : 38;
  const calabiGeo = new THREE.BufferGeometry();
  const vertCount = (uSeg + 1) * (vSeg + 1);
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const indices: number[] = [];

  let ptr = 0;
  for (let iv = 0; iv <= vSeg; iv++) {
    const v = iv / vSeg;
    const b = (v - 0.5) * Math.PI;
    for (let iu = 0; iu <= uSeg; iu++) {
      const u = iu / uSeg;
      const a = u * Math.PI * 2;
      const r = 1.65 + 0.55 * Math.cos(5 * a) * Math.cos(b);
      const px = r * Math.cos(a) * Math.cos(b);
      const pz = r * Math.sin(a) * Math.cos(b);
      const py = 1.4 * Math.sin(b) + 0.35 * Math.sin(5 * a);
      positions[ptr * 3] = px;
      positions[ptr * 3 + 1] = py;
      positions[ptr * 3 + 2] = pz;

      const h = ((Math.atan2(pz, px) / (Math.PI * 2)) + 1 + py * 0.15) % 1;
      _col.setHSL(0.75 + h * 0.22, 0.85, 0.62);
      colors[ptr * 3] = _col.r;
      colors[ptr * 3 + 1] = _col.g;
      colors[ptr * 3 + 2] = _col.b;
      ptr++;
    }
  }
  for (let iv = 0; iv < vSeg; iv++) {
    for (let iu = 0; iu < uSeg; iu++) {
      const a = iv * (uSeg + 1) + iu;
      const b = a + uSeg + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }
  calabiGeo.setIndex(indices);
  calabiGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  calabiGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  calabiGeo.computeVertexNormals();

  const calabiMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.45,
    roughness: 0.18,
    side: THREE.DoubleSide
  });
  const calabiMesh = new THREE.Mesh(calabiGeo, calabiMat);
  calabiMesh.position.y = 2.6;
  root.add(calabiMesh);
  disposables.push(calabiGeo, calabiMat);

  // Interlocking Hopf Fibration Torus Knots orbiting the Calabi-Yau projection
  const hopfRings: THREE.Mesh[] = [];
  for (let k = 0; k < 3; k++) {
    const kGeo = new THREE.TorusKnotGeometry(2.85 + k * 0.32, 0.055, isSoftwareGl ? 64 : 110, 10, 2, 3);
    const kMesh = new THREE.Mesh(kGeo, k % 2 === 0 ? goldKnotMat : ringMat);
    kMesh.position.y = 2.6;
    kMesh.rotation.set(k * 0.65, k * 1.1, 0);
    root.add(kMesh);
    hopfRings.push(kMesh);
    disposables.push(kGeo);
  }

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const degScale = 0.75 + (params.primaryParam / 5) * 0.25;
      const phaseRad = (params.secondaryParam * Math.PI) / 180;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      calabiMesh.rotation.y = elapsed * 0.35 * speed + phaseRad * 0.25;
      calabiMesh.rotation.x = Math.sin(elapsed * 0.45 * speed) * 0.22;
      calabiMesh.scale.setScalar(degScale * (1 - explode * 0.15));

      for (let i = 0; i < hopfRings.length; i++) {
        hopfRings[i].rotation.y = elapsed * (0.28 + i * 0.14) * (i % 2 === 0 ? 1 : -1) * speed + phaseRad;
        hopfRings[i].rotation.z = elapsed * 0.18 * speed;
        hopfRings[i].scale.setScalar(1 + explode * (0.35 + i * 0.22));
      }
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 10. DNA DOUBLE-HELIX & AUTONOMOUS NANOBOT SWARM
// =========================================================================
export function buildDnaNanobot(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const dnaGroup = new THREE.Group();
  root.add(dnaGroup);

  const strand1Mat = new THREE.MeshStandardMaterial({
    color: 0x14b8a6,
    emissive: 0x0d9488,
    emissiveIntensity: 0.9,
    metalness: 0.45,
    roughness: 0.22
  });
  const strand2Mat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.9,
    metalness: 0.45,
    roughness: 0.22
  });
  const rungMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.6,
    metalness: 0.65,
    roughness: 0.2
  });
  disposables.push(strand1Mat, strand2Mat, rungMat);

  // Build 26 phosphate-sugar nodes on each strand + 26 base-pair rungs via InstancedMesh
  const bpCount = 26;
  const nodeGeo = new THREE.SphereGeometry(0.16, 14, 14);
  const rungGeo = new THREE.CylinderGeometry(0.055, 0.055, 2.1, 10);
  rungGeo.rotateZ(Math.PI / 2);

  const strand1Inst = new THREE.InstancedMesh(nodeGeo, strand1Mat, bpCount);
  const strand2Inst = new THREE.InstancedMesh(nodeGeo, strand2Mat, bpCount);
  const rungInst = new THREE.InstancedMesh(rungGeo, rungMat, bpCount);
  strand1Inst.frustumCulled = false;
  strand2Inst.frustumCulled = false;
  rungInst.frustumCulled = false;

  for (let i = 0; i < bpCount; i++) {
    _col.setHex(i % 2 === 0 ? 0x38bdf8 : 0xfbbf24);
    rungInst.setColorAt(i, _col);
  }
  if (rungInst.instanceColor) rungInst.instanceColor.needsUpdate = true;

  dnaGroup.add(strand1Inst, strand2Inst, rungInst);
  disposables.push(nodeGeo, rungGeo);

  // 6 Articulated 3-Part Medical Nanobots scanning along the DNA
  const botCount = isSoftwareGl ? 4 : 6;
  const bots: THREE.Group[] = [];
  const botHullGeo = new THREE.OctahedronGeometry(0.24, 1);
  const botRingGeo = new THREE.TorusGeometry(0.36, 0.04, 8, 24);
  const botProbeGeo = new THREE.ConeGeometry(0.08, 0.42, 10);
  const botMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.92,
    roughness: 0.14
  });
  const botGlowMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 1.8
  });
  disposables.push(botHullGeo, botRingGeo, botProbeGeo, botMat, botGlowMat);

  for (let b = 0; b < botCount; b++) {
    const bg = new THREE.Group();
    const hull = new THREE.Mesh(botHullGeo, botMat);
    const halo = new THREE.Mesh(botRingGeo, botGlowMat);
    halo.rotation.x = Math.PI / 2;
    const probe = new THREE.Mesh(botProbeGeo, botGlowMat);
    probe.rotation.z = Math.PI / 2;
    probe.position.x = -0.36;
    bg.add(hull, halo, probe);
    root.add(bg);
    bots.push(bg);
  }

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const twistRate = (params.primaryParam * Math.PI) / 180;
      const botSpeed = (params.secondaryParam / 70) * Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      const splitOffset = explode * 1.15;
      for (let i = 0; i < bpCount; i++) {
        const y = 0.35 + i * 0.24;
        const angle = i * twistRate * 0.55 + elapsed * 0.65 * Math.max(0.15, params.timeScale);
        const r = 1.12 + splitOffset;
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        _quat.identity();
        _v3B.setScalar(1);

        _v3A.set(c * r, y, s * r);
        _m4.compose(_v3A, _quat, _v3B);
        strand1Inst.setMatrixAt(i, _m4);

        _v3A.set(-c * r, y, -s * r);
        _m4.compose(_v3A, _quat, _v3B);
        strand2Inst.setMatrixAt(i, _m4);

        // Rung connects both strands
        _v3A.set(0, y, 0);
        _euler.set(0, -angle, 0);
        _quat.setFromEuler(_euler);
        _v3B.set(1 + splitOffset * 0.75, 1, 1);
        _m4.compose(_v3A, _quat, _v3B);
        rungInst.setMatrixAt(i, _m4);
      }
      strand1Inst.instanceMatrix.needsUpdate = true;
      strand2Inst.instanceMatrix.needsUpdate = true;
      rungInst.instanceMatrix.needsUpdate = true;
      strand1Inst.computeBoundingSphere();
      strand2Inst.computeBoundingSphere();
      rungInst.computeBoundingSphere();

      // Animate scanning nanobots
      for (let b = 0; b < bots.length; b++) {
        const a = elapsed * 1.5 * botSpeed + (b / bots.length) * Math.PI * 2;
        const y = 1.1 + ((b / bots.length + elapsed * 0.14 * botSpeed) % 1) * 5.2;
        const r = 2.15 + explode * 1.1;
        bots[b].position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        bots[b].lookAt(0, y, 0);
      }
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 11. PENNING ANTIMATTER TRAP & POSITRON CYCLOTRON CLOUD
// =========================================================================
export function buildPenningAntimatter(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.94,
    roughness: 0.16
  });
  const darkShieldMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.82,
    roughness: 0.28
  });
  const vesselMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: isSoftwareGl ? 0.18 : 0.26,
    transmission: isSoftwareGl ? 0 : 0.45,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  disposables.push(copperMat, darkShieldMat, vesselMat);

  // Quadrupole ring electrode & upper/lower hyperbolic end-caps
  const ringGeo = new THREE.TorusGeometry(2.2, 0.36, 20, 64);
  ringGeo.rotateX(Math.PI / 2);
  const quadRing = new THREE.Mesh(ringGeo, copperMat);
  quadRing.position.y = 2.4;
  root.add(quadRing);
  disposables.push(ringGeo);

  const capGeo = new THREE.CylinderGeometry(1.15, 0.55, 0.7, 32);
  const topCap = new THREE.Mesh(capGeo, copperMat);
  topCap.position.y = 4.25;
  const botCap = new THREE.Mesh(capGeo, copperMat);
  botCap.rotation.x = Math.PI;
  botCap.position.y = 0.55;
  root.add(topCap, botCap);
  disposables.push(capGeo);

  // 4 outer Helmholtz cryo shield pillars (slide outward on Cutaway)
  const shieldGeo = new THREE.BoxGeometry(0.55, 4.4, 0.9);
  const shields: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const sm = new THREE.Mesh(shieldGeo, darkShieldMat);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    sm.position.set(Math.cos(a) * 3.1, 2.4, Math.sin(a) * 3.1);
    sm.rotation.y = -a;
    root.add(sm);
    shields.push(sm);
  }
  disposables.push(shieldGeo);

  // Translucent containment dome around central cloud
  const vesselGeo = new THREE.CylinderGeometry(1.9, 1.9, 3.2, 32, 1, true);
  const vessel = new THREE.Mesh(vesselGeo, vesselMat);
  vessel.position.y = 2.4;
  vessel.renderOrder = 2;
  root.add(vessel);
  disposables.push(vesselGeo);

  // Suspended Positron Cloud inside trap
  const pCount = isSoftwareGl ? 240 : 480;
  const pGeo = new THREE.SphereGeometry(0.055, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pInst = new THREE.InstancedMesh(pGeo, pMat, pCount);
  pInst.frustumCulled = false;
  const pPhase = new Float32Array(pCount);
  const pRad = new Float32Array(pCount);
  const pAmpY = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pPhase[i] = Math.random() * Math.PI * 2;
    pRad[i] = 0.15 + Math.random() * 1.15;
    pAmpY[i] = (Math.random() - 0.5) * 1.4;
    _col.setHSL(0.92 + Math.random() * 0.12, 0.95, 0.68);
    pInst.setColorAt(i, _col);
  }
  if (pInst.instanceColor) pInst.instanceColor.needsUpdate = true;
  root.add(pInst);
  disposables.push(pGeo, pMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const kvNorm = params.primaryParam / 56;
      const densNorm = params.secondaryParam / 64;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      topCap.position.y = 4.25 + explode * 1.45;
      botCap.position.y = 0.55 - explode * 0.25;
      quadRing.scale.setScalar(1 + explode * 0.35);
      for (let i = 0; i < shields.length; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const r = 3.1 + explode * 1.85;
        shields[i].position.set(Math.cos(a) * r, 2.4, Math.sin(a) * r);
      }

      const active = Math.min(pCount, Math.max(60, Math.floor(pCount * Math.min(1, 0.25 + densNorm * 0.5))));
      _quat.identity();
      for (let i = 0; i < pCount; i++) {
        if (i >= active) {
          _v3A.set(0, -100, 0);
          _v3B.setScalar(0.001);
          _m4.compose(_v3A, _quat, _v3B);
          pInst.setMatrixAt(i, _m4);
          continue;
        }
        pPhase[i] += delta * (3.2 * kvNorm) * speed;
        const cyc = pPhase[i];
        const r = pRad[i] * (0.85 + 0.15 * Math.sin(cyc * 0.3));
        const y = 2.4 + Math.sin(cyc * 1.7 + i) * pAmpY[i];
        _v3A.set(Math.cos(cyc) * r, y, Math.sin(cyc) * r);
        _v3B.setScalar(0.85 + 0.35 * Math.sin(elapsed * 4 + i));
        _m4.compose(_v3A, _quat, _v3B);
        pInst.setMatrixAt(i, _m4);
      }
      pInst.instanceMatrix.needsUpdate = true;
      pInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 12. LORENZ-AIZAWA STRANGE ATTRACTOR & 3D VECTOR FIELD SCULPTURE
// =========================================================================
export function buildFractalAttractor(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // Integrate iconic Lorenz Strange Attractor trajectory into curved TubeGeometry
  const lorenzPts: THREE.Vector3[] = [];
  let lx = 0.1;
  let ly = 0;
  let lz = 0;
  const dt = 0.0065;
  const steps = isSoftwareGl ? 900 : 1600;
  for (let i = 0; i < steps; i++) {
    const dx = 10 * (ly - lx);
    const dy = lx * (28 - lz) - ly;
    const dz = lx * ly - (8 / 3) * lz;
    lx += dx * dt;
    ly += dy * dt;
    lz += dz * dt;
    if (i > 40) {
      lorenzPts.push(new THREE.Vector3(lx * 0.17, lz * 0.13 + 0.4, ly * 0.17));
    }
  }
  const curve = new THREE.CatmullRomCurve3(lorenzPts);
  const tubeGeo = new THREE.TubeGeometry(curve, isSoftwareGl ? 240 : 480, 0.045, 7, false);

  // Rainbow gradient vertex color along attractor arc
  const tPos = tubeGeo.getAttribute('position') as THREE.BufferAttribute;
  const tCols = new Float32Array(tPos.count * 3);
  for (let i = 0; i < tPos.count; i++) {
    const frac = i / tPos.count;
    _col.setHSL((0.05 + frac * 0.55) % 1, 0.95, 0.58);
    tCols[i * 3] = _col.r;
    tCols[i * 3 + 1] = _col.g;
    tCols[i * 3 + 2] = _col.b;
  }
  tubeGeo.setAttribute('color', new THREE.BufferAttribute(tCols, 3));

  const tubeMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.45
  });
  const attractorMesh = new THREE.Mesh(tubeGeo, tubeMat);
  attractorMesh.position.y = 0.4;
  root.add(attractorMesh);
  disposables.push(tubeGeo, tubeMat);

  // Phase-Space Tracer Particles surfing the Lorenz Curve
  const tracerCount = isSoftwareGl ? 140 : 280;
  const tracerGeo = new THREE.SphereGeometry(0.085, 8, 8);
  const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tracerInst = new THREE.InstancedMesh(tracerGeo, tracerMat, tracerCount);
  tracerInst.frustumCulled = false;
  const tracerT = new Float32Array(tracerCount);
  for (let i = 0; i < tracerCount; i++) {
    tracerT[i] = i / tracerCount;
    _col.setHSL(0.08 + (i / tracerCount) * 0.5, 0.95, 0.68);
    tracerInst.setColorAt(i, _col);
  }
  if (tracerInst.instanceColor) tracerInst.instanceColor.needsUpdate = true;
  root.add(tracerInst);
  disposables.push(tracerGeo, tracerMat);

  // Live 3D Vector Field Floor Grid (11x11 directional cones)
  const gridN = 11;
  const vecGeo = new THREE.ConeGeometry(0.085, 0.42, 8);
  const vecMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.7,
    metalness: 0.8,
    roughness: 0.2
  });
  const vecInst = new THREE.InstancedMesh(vecGeo, vecMat, gridN * gridN);
  vecInst.frustumCulled = false;
  root.add(vecInst);
  disposables.push(vecGeo, vecMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const rhoNorm = params.primaryParam / 28;
      const sigmaNorm = params.secondaryParam / 10;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      attractorMesh.rotation.y = elapsed * 0.2 * speed;
      attractorMesh.scale.set(
        0.92 + rhoNorm * 0.2 + explode * 0.35,
        0.92 + sigmaNorm * 0.15,
        0.92 + rhoNorm * 0.2 + explode * 0.35
      );

      // Update phase tracer particles along the rotated attractor
      const rotY = attractorMesh.rotation.y;
      const sx = attractorMesh.scale.x;
      const sy = attractorMesh.scale.y;
      const sz = attractorMesh.scale.z;
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      _quat.identity();
      for (let i = 0; i < tracerCount; i++) {
        tracerT[i] = (tracerT[i] + delta * 0.08 * rhoNorm * speed) % 1;
        curve.getPointAt(tracerT[i], _v3C);
        const px = _v3C.x * sx;
        const py = _v3C.y * sy + 0.4;
        const pz = _v3C.z * sz;
        _v3A.set(px * cosR + pz * sinR, py, -px * sinR + pz * cosR);
        _v3B.setScalar(0.9 + 0.35 * Math.sin(elapsed * 4 + i));
        _m4.compose(_v3A, _quat, _v3B);
        tracerInst.setMatrixAt(i, _m4);
      }
      tracerInst.instanceMatrix.needsUpdate = true;
      tracerInst.computeBoundingSphere();

      // Animate 11x11 directional vector field grid underneath
      let vIdx = 0;
      for (let gx = 0; gx < gridN; gx++) {
        for (let gz = 0; gz < gridN; gz++) {
          const x = (gx - 5) * 1.05;
          const z = (gz - 5) * 1.05;
          const vx = -z * 0.6 + Math.sin(x * 0.4 + elapsed) * rhoNorm;
          const vz = x * 0.6 + Math.cos(z * 0.4 - elapsed) * sigmaNorm;
          _v3C.set(vx, 0.35, vz).normalize();
          _quat.setFromUnitVectors(_vUp, _v3C);
          _v3A.set(x, -0.1 - explode * 0.4, z);
          _v3B.setScalar(1);
          _m4.compose(_v3A, _quat, _v3B);
          vecInst.setMatrixAt(vIdx++, _m4);
        }
      }
      vecInst.instanceMatrix.needsUpdate = true;
      vecInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

export function buildExtraMonument(id: MonumentId, isSoftwareGl: boolean): BuiltMonument | null {
  switch (id) {
    case 'quantum_cryostat':
      return buildQuantumCryostat(isSoftwareGl);
    case 'gravitational_ligo':
      return buildGravitationalLigo(isSoftwareGl);
    case 'space_elevator':
      return buildSpaceElevator(isSoftwareGl);
    case 'warp_alcubierre':
      return buildWarpAlcubierre(isSoftwareGl);
    case 'hyperbolic_calabi':
      return buildHyperbolicCalabi(isSoftwareGl);
    case 'dna_nanobot':
      return buildDnaNanobot(isSoftwareGl);
    case 'penning_antimatter':
      return buildPenningAntimatter(isSoftwareGl);
    case 'fractal_attractor':
      return buildFractalAttractor(isSoftwareGl);
    default:
      return null;
  }
}
