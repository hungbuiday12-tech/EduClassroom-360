import * as THREE from 'three';
import { BuiltMonument, MonumentId, SynapseV2Params } from './synapseCatalog';

// Module-scope scratch math helpers (zero per-frame GC allocation)
const _m4 = new THREE.Matrix4();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _col = new THREE.Color();

// =========================================================================
// 21. LARGE HADRON COLLIDER (LHC) TOROIDAL DETECTOR & PARTICLE SHOWER
// =========================================================================
export function buildLhcColliderMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.88,
    roughness: 0.24
  });
  const cryoBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.82,
    roughness: 0.2,
    emissive: 0x0c4a6e,
    emissiveIntensity: 0.45
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x451a03,
    emissiveIntensity: 0.3
  });
  const beamGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    roughness: 0.08,
    metalness: 0.15,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide
  });
  const protonAMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.95
  });
  const protonBMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.95
  });
  const coreGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  disposables.push(steelMat, cryoBlueMat, copperMat, beamGlassMat, protonAMat, protonBMat, coreGlowMat);

  const centerY = 0.75;

  // 1. Heavy Titanium Support Cradles resting on citadel plinth (y = -3.47)
  const cradleGeo = new THREE.BoxGeometry(0.95, 4.2, 2.8);
  disposables.push(cradleGeo);
  [-5.1, -2.5, 2.5, 5.1].forEach((x) => {
    const leg = new THREE.Mesh(cradleGeo, steelMat);
    leg.position.set(x, -1.37, 0);
    root.add(leg);
  });

  // Base longitudinal beam rail
  const railGeo = new THREE.BoxGeometry(13.2, 0.38, 3.2);
  const rail = new THREE.Mesh(railGeo, steelMat);
  rail.position.set(0, -3.28, 0);
  root.add(rail);
  disposables.push(railGeo);

  // 2. Central Vacuum Beam Pipe along X-axis
  const pipeGeo = new THREE.CylinderGeometry(0.26, 0.26, 14.4, isSoftwareGl ? 14 : 24, 1, true);
  pipeGeo.rotateZ(Math.PI / 2);
  const pipe = new THREE.Mesh(pipeGeo, beamGlassMat);
  pipe.position.y = centerY;
  root.add(pipe);
  disposables.push(pipeGeo);

  // 3. Left & Right Cryogenic Dipole Magnet Units
  const dipoleGeo = new THREE.CylinderGeometry(1.15, 1.15, 2.2, isSoftwareGl ? 16 : 28);
  dipoleGeo.rotateZ(Math.PI / 2);
  const dipoleRingGeo = new THREE.TorusGeometry(1.22, 0.08, 8, isSoftwareGl ? 18 : 32);
  dipoleRingGeo.rotateY(Math.PI / 2);
  disposables.push(dipoleGeo, dipoleRingGeo);

  [-4.9, 4.9].forEach((x) => {
    const d = new THREE.Mesh(dipoleGeo, cryoBlueMat);
    d.position.set(x, centerY, 0);
    root.add(d);
    [-0.75, 0, 0.75].forEach((off) => {
      const r = new THREE.Mesh(dipoleRingGeo, steelMat);
      r.position.set(x + off, centerY, 0);
      root.add(r);
    });
  });

  // 4. 8 Radial ATLAS Superconducting Toroidal Magnet Coils (Expand radially on explode)
  const toroidLoops: { mesh: THREE.Mesh; angle: number }[] = [];
  const coilGeo = new THREE.TorusGeometry(1.18, 0.12, 8, isSoftwareGl ? 16 : 28);
  disposables.push(coilGeo);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const m = new THREE.Mesh(coilGeo, copperMat);
    m.position.set(0, centerY + Math.sin(angle) * 2.1, Math.cos(angle) * 2.1);
    m.rotation.set(angle, 0, Math.PI / 2);
    root.add(m);
    toroidLoops.push({ mesh: m, angle });
  }

  // 5. Inner Layered Calorimeter Cylinders (Separate along X on explode)
  const calGeo = new THREE.CylinderGeometry(1.45, 1.45, 1.8, isSoftwareGl ? 16 : 28, 1, true);
  calGeo.rotateZ(Math.PI / 2);
  disposables.push(calGeo);
  const calLeft = new THREE.Mesh(calGeo, cryoBlueMat);
  const calRight = new THREE.Mesh(calGeo, cryoBlueMat);
  calLeft.position.set(-1.15, centerY, 0);
  calRight.position.set(1.15, centerY, 0);
  root.add(calLeft, calRight);

  // 6. Central Collision Core Flash
  const coreGeo = new THREE.OctahedronGeometry(0.42, 1);
  const coreMesh = new THREE.Mesh(coreGeo, coreGlowMat);
  coreMesh.position.set(0, centerY, 0);
  root.add(coreMesh);
  disposables.push(coreGeo);

  // 7. Counter-Rotating Proton Bunches (InstancedMesh)
  const bunchCount = 24;
  const bunchGeo = new THREE.SphereGeometry(0.11, 8, 8);
  const bunchesA = new THREE.InstancedMesh(bunchGeo, protonAMat, bunchCount);
  const bunchesB = new THREE.InstancedMesh(bunchGeo, protonBMat, bunchCount);
  root.add(bunchesA, bunchesB);
  disposables.push(bunchGeo);

  // 8. Particle Collision Decay Shower Tracks (InstancedMesh)
  const trackCount = isSoftwareGl ? 28 : 48;
  const trackGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.9, 6);
  const trackMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const tracksInst = new THREE.InstancedMesh(trackGeo, trackMat, trackCount);
  const trackTheta = new Float32Array(trackCount);
  const trackPhi = new Float32Array(trackCount);
  const trackPhase = new Float32Array(trackCount);
  const trackSign = new Float32Array(trackCount);

  for (let i = 0; i < trackCount; i++) {
    trackTheta[i] = Math.random() * Math.PI * 2;
    trackPhi[i] = (Math.random() - 0.5) * 1.9;
    trackPhase[i] = Math.random();
    trackSign[i] = i % 2 === 0 ? 1 : -1;
    _col.setHSL(i % 3 === 0 ? 0.54 : i % 3 === 1 ? 0.94 : 0.14, 0.95, 0.65);
    tracksInst.setColorAt(i, _col);
  }
  if (tracksInst.instanceColor) tracksInst.instanceColor.needsUpdate = true;
  root.add(tracksInst);
  disposables.push(trackGeo, trackMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const energyNorm = Math.max(0.25, params.primaryParam / 10);
      const bFieldNorm = Math.max(0.2, params.secondaryParam / 8);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Explode cutaway separation
      for (let i = 0; i < toroidLoops.length; i++) {
        const t = toroidLoops[i];
        const r = 2.1 + explode * 1.85;
        t.mesh.position.set(0, centerY + Math.sin(t.angle) * r, Math.cos(t.angle) * r);
      }
      calLeft.position.x = -1.15 - explode * 1.4;
      calRight.position.x = 1.15 + explode * 1.4;

      // Collision flash pulse
      const pulse = 0.72 + 0.48 * Math.abs(Math.sin(elapsed * 5.2 * speed));
      coreMesh.scale.setScalar(pulse * (0.85 + energyNorm * 0.45));
      coreMesh.rotation.y = elapsed * 2.4 * speed;
      coreMesh.rotation.x = elapsed * 1.6 * speed;

      // Counter-rotating proton bunches
      _quat.identity();
      for (let i = 0; i < bunchCount; i++) {
        const fracA = ((i / bunchCount) + elapsed * 0.65 * energyNorm * speed) % 1;
        const xA = -7.0 + fracA * 14.0;
        _v3A.set(xA, centerY + Math.sin(fracA * 18) * 0.04, Math.cos(fracA * 18) * 0.04);
        _v3B.set(1.6, 0.75, 0.75);
        _m4.compose(_v3A, _quat, _v3B);
        bunchesA.setMatrixAt(i, _m4);

        const fracB = ((i / bunchCount) + elapsed * 0.65 * energyNorm * speed + 0.5) % 1;
        const xB = 7.0 - fracB * 14.0;
        _v3A.set(xB, centerY + Math.sin(fracB * 18) * 0.04, -Math.cos(fracB * 18) * 0.04);
        _m4.compose(_v3A, _quat, _v3B);
        bunchesB.setMatrixAt(i, _m4);
      }
      bunchesA.instanceMatrix.needsUpdate = true;
      bunchesB.instanceMatrix.needsUpdate = true;
      bunchesA.computeBoundingSphere();
      bunchesB.computeBoundingSphere();

      // Particle shower curvature under magnetic field B
      for (let i = 0; i < trackCount; i++) {
        trackPhase[i] = (trackPhase[i] + delta * 0.9 * energyNorm * speed) % 1;
        const t = trackPhase[i];
        const radius = 0.25 + t * 2.75;
        const curveAngle = trackTheta[i] + trackSign[i] * t * 0.65 * bFieldNorm;
        const px = Math.sin(trackPhi[i]) * radius * 0.85;
        const py = centerY + Math.sin(curveAngle) * radius * Math.cos(trackPhi[i]);
        const pz = Math.cos(curveAngle) * radius * Math.cos(trackPhi[i]);

        _euler.set(curveAngle + trackSign[i] * 0.35, trackPhi[i], Math.PI / 2);
        _quat.setFromEuler(_euler);
        _v3A.set(px, py, pz);
        const fade = Math.sin(t * Math.PI);
        _v3B.set(0.9, 0.4 + fade * 0.9, 0.9);
        _m4.compose(_v3A, _quat, _v3B);
        tracksInst.setMatrixAt(i, _m4);
      }
      tracksInst.instanceMatrix.needsUpdate = true;
      tracksInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 22. LASER INTERFEROMETER & QUANTUM DOUBLE-SLIT WAVE OPTICS BENCH
// =========================================================================
export function buildLaserInterferometerMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const graniteMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.55,
    roughness: 0.42
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.94,
    roughness: 0.14
  });
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25
  });
  const laserColor = new THREE.Color(0x10b981);
  const beamMat = new THREE.MeshBasicMaterial({
    color: laserColor,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.52
  });
  disposables.push(graniteMat, chromeMat, chassisMat, beamMat, lensMat);

  const benchY = -0.35;

  // 1. Precision Optical Granite Table + 4 Pneumatic Legs seated at y = -3.47
  const tableGeo = new THREE.BoxGeometry(13.2, 0.36, 6.4);
  const table = new THREE.Mesh(tableGeo, graniteMat);
  table.position.y = benchY;
  root.add(table);
  disposables.push(tableGeo);

  const legGeo = new THREE.CylinderGeometry(0.24, 0.3, 2.94, 14);
  disposables.push(legGeo);
  [
    [-5.6, -2.5],
    [5.6, -2.5],
    [-5.6, 2.5],
    [5.6, 2.5]
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, chromeMat);
    leg.position.set(lx, -2.0, lz);
    root.add(leg);
  });

  // 2. Tunable Laser Resonator Emitter at x = -5.4
  const emitterGroup = new THREE.Group();
  emitterGroup.position.set(-5.3, benchY + 0.95, 0);
  root.add(emitterGroup);

  const barrelGeo = new THREE.CylinderGeometry(0.42, 0.48, 2.1, isSoftwareGl ? 14 : 24);
  barrelGeo.rotateZ(Math.PI / 2);
  const barrel = new THREE.Mesh(barrelGeo, chassisMat);
  emitterGroup.add(barrel);

  const mountGeo = new THREE.BoxGeometry(1.1, 0.75, 0.9);
  const mount = new THREE.Mesh(mountGeo, chromeMat);
  mount.position.y = -0.52;
  emitterGroup.add(mount);

  const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.4, 16);
  nozzleGeo.rotateZ(Math.PI / 2);
  const nozzle = new THREE.Mesh(nozzleGeo, beamMat);
  nozzle.position.x = 1.15;
  emitterGroup.add(nozzle);

  // Collimated Incident Laser Beam (x = -4.0 to -2.0)
  const incidentGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 12);
  incidentGeo.rotateZ(Math.PI / 2);
  const incidentBeam = new THREE.Mesh(incidentGeo, beamMat);
  incidentBeam.position.set(-3.1, benchY + 0.95, 0);
  root.add(incidentBeam);
  disposables.push(barrelGeo, mountGeo, nozzleGeo, incidentGeo);

  // 3. Adjustable Double-Slit Metallic Barrier Plate at x = -2.0
  const slitGroup = new THREE.Group();
  slitGroup.position.set(-2.0, benchY + 0.95, 0);
  root.add(slitGroup);

  const outerBladeGeo = new THREE.BoxGeometry(0.16, 1.55, 1.9);
  const centerBladeGeo = new THREE.BoxGeometry(0.18, 1.55, 0.42);
  const bladeLeft = new THREE.Mesh(outerBladeGeo, chassisMat);
  const bladeRight = new THREE.Mesh(outerBladeGeo, chassisMat);
  const bladeCenter = new THREE.Mesh(centerBladeGeo, chromeMat);
  bladeLeft.position.z = -1.65;
  bladeRight.position.z = 1.65;
  slitGroup.add(bladeLeft, bladeRight, bladeCenter);
  disposables.push(outerBladeGeo, centerBladeGeo);

  // Beam splitter / collimating glass prism at x = -3.4
  const prismGeo = new THREE.BoxGeometry(0.28, 1.1, 1.1);
  const prism = new THREE.Mesh(prismGeo, lensMat);
  prism.position.set(-3.4, benchY + 0.95, 0);
  prism.rotation.y = Math.PI / 4;
  root.add(prism);
  disposables.push(prismGeo);

  // 4. Live 3D Propagating Interference Wave Surface Mesh (x: -1.9 .. +4.8, z: -2.4 .. +2.4)
  const segX = isSoftwareGl ? 30 : 52;
  const segZ = isSoftwareGl ? 22 : 36;
  const waveW = 6.7;
  const waveD = 4.8;
  const waveGeo = new THREE.PlaneGeometry(waveW, waveD, segX, segZ);
  waveGeo.rotateX(-Math.PI / 2);

  const posAttr = waveGeo.attributes.position as THREE.BufferAttribute;
  const vertCount = posAttr.count;
  const colArray = new Float32Array(vertCount * 3);
  waveGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
  const colorAttr = waveGeo.attributes.color as THREE.BufferAttribute;

  const waveMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const waveMesh = new THREE.Mesh(waveGeo, waveMat);
  waveMesh.position.set(1.45, benchY + 0.72, 0);
  root.add(waveMesh);
  disposables.push(waveGeo, waveMat);

  // 5. Detector Screen & Live Photon Interference Fringes at x = 5.0
  const screenGroup = new THREE.Group();
  screenGroup.position.set(5.1, benchY + 1.1, 0);
  root.add(screenGroup);

  const screenBackGeo = new THREE.BoxGeometry(0.18, 2.0, 5.2);
  const screenBack = new THREE.Mesh(screenBackGeo, chassisMat);
  screenGroup.add(screenBack);
  disposables.push(screenBackGeo);

  const fringeCount = 29;
  const fringeGeo = new THREE.BoxGeometry(0.08, 1.7, 0.14);
  const fringeMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.92
  });
  const fringesInst = new THREE.InstancedMesh(fringeGeo, fringeMat, fringeCount);
  screenGroup.add(fringesInst);
  disposables.push(fringeGeo, fringeMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const wavelengthNm = THREE.MathUtils.clamp(params.primaryParam, 400, 700);
      const slitDistUm = THREE.MathUtils.clamp(params.secondaryParam, 10, 60);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Wavelength -> Optical Spectral Hue (400nm violet -> 532nm emerald -> 660nm red)
      const normW = (wavelengthNm - 400) / 300; // 0..1
      const hue = THREE.MathUtils.lerp(0.76, 0.0, normW);
      laserColor.setHSL(hue, 0.95, 0.58);
      beamMat.color.copy(laserColor);

      // Slit separation visual adjustment & exploded cutaway lift
      const dHalf = 0.28 + ((slitDistUm - 10) / 50) * 0.42;
      bladeCenter.scale.z = 0.4 + ((slitDistUm - 10) / 50) * 1.1;
      bladeLeft.position.z = -1.35 - dHalf * 0.5;
      bladeRight.position.z = 1.35 + dHalf * 0.5;

      slitGroup.position.y = benchY + 0.95 + explode * 1.15;
      prism.position.y = benchY + 0.95 + explode * 0.85;
      waveMesh.position.y = benchY + 0.72 + explode * 0.55;
      screenGroup.position.x = 5.1 + explode * 1.25;

      // Update live 3D double-slit wave interference surface
      const k = 3.6 + (1 - normW) * 4.5; // wave number proportional to 1/lambda
      const omega = 5.5 * speed;
      const pArr = posAttr.array as Float32Array;
      const cArr = colorAttr.array as Float32Array;
      const zS1 = -dHalf;
      const zS2 = dHalf;

      for (let i = 0; i < vertCount; i++) {
        const ix = i * 3;
        const lx = pArr[ix]; // -waveW/2 .. +waveW/2
        const lz = pArr[ix + 2]; // -waveD/2 .. +waveD/2
        const dx = lx + waveW * 0.5 + 0.15;
        const r1 = Math.hypot(dx, lz - zS1);
        const r2 = Math.hypot(dx, lz - zS2);

        const amp1 = Math.sin(k * r1 - elapsed * omega) / Math.sqrt(r1 + 0.55);
        const amp2 = Math.sin(k * r2 - elapsed * omega) / Math.sqrt(r2 + 0.55);
        const psi = (amp1 + amp2) * 0.42;
        pArr[ix + 1] = psi;

        const intensity = THREE.MathUtils.clamp(Math.abs(amp1 + amp2) * 0.65, 0.05, 1.0);
        cArr[ix] = laserColor.r * intensity;
        cArr[ix + 1] = laserColor.g * intensity;
        cArr[ix + 2] = laserColor.b * intensity;
      }
      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Update Detector Interference Fringes
      _quat.identity();
      const kFringe = (slitDistUm / 28) * (532 / wavelengthNm) * 2.4;
      for (let i = 0; i < fringeCount; i++) {
        const z = -2.3 + (i / (fringeCount - 1)) * 4.6;
        const cosSq = Math.pow(Math.cos(z * kFringe), 2);
        const envelope = Math.exp(-z * z * 0.22);
        const intensity = THREE.MathUtils.clamp(cosSq * envelope, 0.04, 1.0);

        _v3A.set(-0.14, 0, z);
        _v3B.set(1, 0.25 + intensity * 0.85, 1);
        _m4.compose(_v3A, _quat, _v3B);
        fringesInst.setMatrixAt(i, _m4);

        _col.copy(laserColor).multiplyScalar(0.18 + intensity * 0.95);
        fringesInst.setColorAt(i, _col);
      }
      fringesInst.instanceMatrix.needsUpdate = true;
      if (fringesInst.instanceColor) fringesInst.instanceColor.needsUpdate = true;
      fringesInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 23. RESONANT TESLA COIL & HIGH-VOLTAGE ELECTROMAGNETIC FIELD TOWER
// =========================================================================
export function buildTeslaElectromagnetMonument(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.72,
    roughness: 0.3
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    metalness: 0.92,
    roughness: 0.16,
    emissive: 0x431407,
    emissiveIntensity: 0.28
  });
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.96,
    roughness: 0.12
  });
  const quartzMat = new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.26,
    side: THREE.DoubleSide
  });
  const fieldLineMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending
  });
  disposables.push(obsidianMat, copperMat, aluminumMat, quartzMat, fieldLineMat);

  // 1. Insulated Capacitor Deck seated on y = -3.47
  const deckGeo = new THREE.CylinderGeometry(3.9, 4.3, 0.64, isSoftwareGl ? 16 : 32);
  const deck = new THREE.Mesh(deckGeo, obsidianMat);
  deck.position.y = -3.15;
  root.add(deck);
  disposables.push(deckGeo);

  // 8 Perimeter HV Pulse Capacitor Cylinders + 4 Grounded Discharge Pylons
  const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.1, 12);
  disposables.push(capGeo);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const cap = new THREE.Mesh(capGeo, i % 2 === 0 ? aluminumMat : obsidianMat);
    cap.position.set(Math.cos(a) * 3.1, -2.3, Math.sin(a) * 3.1);
    root.add(cap);
  }

  const pylonPositions: THREE.Vector3[] = [];
  const gPylonGeo = new THREE.CylinderGeometry(0.08, 0.22, 3.6, 10);
  const orbGeo = new THREE.SphereGeometry(0.22, 12, 12);
  disposables.push(gPylonGeo, orbGeo);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const px = Math.cos(a) * 5.0;
    const pz = Math.sin(a) * 5.0;
    const pylon = new THREE.Mesh(gPylonGeo, obsidianMat);
    pylon.position.set(px, -1.67, pz);
    const orb = new THREE.Mesh(orbGeo, aluminumMat);
    orb.position.set(px, 0.2, pz);
    root.add(pylon, orb);
    pylonPositions.push(new THREE.Vector3(px, 0.2, pz));
  }

  // 2. Copper Primary Conical Tank Coil (5 rings)
  const primaryRings: { mesh: THREE.Mesh; baseY: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const r = 1.65 + i * 0.34;
    const y = -2.55 + i * 0.19;
    const rGeo = new THREE.TorusGeometry(r, 0.085, 8, isSoftwareGl ? 24 : 44);
    rGeo.rotateX(Math.PI / 2);
    const rMesh = new THREE.Mesh(rGeo, copperMat);
    rMesh.position.y = y;
    root.add(rMesh);
    primaryRings.push({ mesh: rMesh, baseY: y });
    disposables.push(rGeo);
  }

  // 3. Tall Copper Secondary Resonator Tower + Quartz Dielectric Sleeve
  const secGeo = new THREE.CylinderGeometry(0.68, 0.68, 4.5, isSoftwareGl ? 18 : 32);
  const secTower = new THREE.Mesh(secGeo, copperMat);
  secTower.position.y = -0.35;
  root.add(secTower);

  const sleeveGeo = new THREE.CylinderGeometry(0.86, 0.86, 4.4, isSoftwareGl ? 18 : 32, 1, true);
  const sleeve = new THREE.Mesh(sleeveGeo, quartzMat);
  sleeve.position.y = -0.35;
  root.add(sleeve);
  disposables.push(secGeo, sleeveGeo);

  // 4. Brushed Aluminum Top-Load Toroid Crown + Ion Core
  const crownGroup = new THREE.Group();
  crownGroup.position.y = 2.35;
  root.add(crownGroup);

  const toroidGeo = new THREE.TorusGeometry(1.45, 0.44, isSoftwareGl ? 14 : 24, isSoftwareGl ? 28 : 56);
  toroidGeo.rotateX(Math.PI / 2);
  const toroidMesh = new THREE.Mesh(toroidGeo, aluminumMat);
  crownGroup.add(toroidMesh);

  const capCrownGeo = new THREE.SphereGeometry(0.65, 16, 12);
  capCrownGeo.scale(1, 0.45, 1);
  const capCrown = new THREE.Mesh(capCrownGeo, obsidianMat);
  crownGroup.add(capCrown);
  disposables.push(toroidGeo, capCrownGeo);

  // 5. Dipole Electromagnetic Flux Rings around coil
  const fluxGroup = new THREE.Group();
  root.add(fluxGroup);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const fGeo = new THREE.TorusGeometry(2.65, 0.03, 6, isSoftwareGl ? 22 : 40);
    const fMesh = new THREE.Mesh(fGeo, fieldLineMat);
    fMesh.rotation.y = angle;
    fMesh.position.set(Math.cos(angle) * 1.45, 0.25, Math.sin(angle) * 1.45);
    fluxGroup.add(fMesh);
    disposables.push(fGeo);
  }

  // 6. Dynamic High-Voltage Plasma Lightning Arcs (pre-allocated Buffers, zero GC)
  const arcCount = 6;
  const arcSegs = 12;
  const arcs: { line: THREE.Line; pos: Float32Array; attr: THREE.BufferAttribute; seed: number }[] = [];
  const arcMat = new THREE.LineBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending
  });
  disposables.push(arcMat);

  for (let a = 0; a < arcCount; a++) {
    const pos = new Float32Array(arcSegs * 3);
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    geo.setAttribute('position', attr);
    const line = new THREE.Line(geo, arcMat);
    root.add(line);
    disposables.push(geo);
    arcs.push({ line, pos, attr, seed: a * 1.73 });
  }

  // 7. Orbiting Ionized Plasma Electrons (InstancedMesh)
  const ionCount = isSoftwareGl ? 24 : 44;
  const ionGeo = new THREE.OctahedronGeometry(0.08, 0);
  const ionMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.9
  });
  const ionsInst = new THREE.InstancedMesh(ionGeo, ionMat, ionCount);
  root.add(ionsInst);
  disposables.push(ionGeo, ionMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const freqNorm = Math.max(0.25, params.primaryParam / 180);
      const voltNorm = Math.max(0.25, params.secondaryParam / 320);
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Exploded cutaway separation
      crownGroup.position.y = 2.35 + explode * 1.65;
      sleeve.position.y = -0.35 + explode * 2.2;
      for (let i = 0; i < primaryRings.length; i++) {
        primaryRings[i].mesh.position.y = primaryRings[i].baseY - explode * (i * 0.14);
      }

      // Flux ring rotation & pulse
      fluxGroup.rotation.y = elapsed * 0.38 * freqNorm * speed;
      fieldLineMat.opacity = THREE.MathUtils.clamp(0.18 + voltNorm * 0.25, 0.18, 0.55);

      // Update Jagged Plasma Lightning Arcs (in-place Float32Array mutation)
      const crownY = crownGroup.position.y;
      const quantTime = Math.floor(elapsed * 16 * freqNorm * speed);
      for (let a = 0; a < arcCount; a++) {
        const arc = arcs[a];
        const targetPylon = pylonPositions[a % pylonPositions.length];
        const startAngle = (a / arcCount) * Math.PI * 2 + elapsed * 0.55 * speed;
        const sx = Math.cos(startAngle) * 1.55;
        const sy = crownY;
        const sz = Math.sin(startAngle) * 1.55;

        const isGrounded = a < 4;
        const ex = isGrounded ? targetPylon.x : Math.cos(startAngle + 0.5) * (2.6 + voltNorm * 1.8);
        const ey = isGrounded ? targetPylon.y : crownY + 1.1 + Math.sin(a + quantTime) * 0.9;
        const ez = isGrounded ? targetPylon.z : Math.sin(startAngle + 0.5) * (2.6 + voltNorm * 1.8);

        for (let s = 0; s < arcSegs; s++) {
          const t = s / (arcSegs - 1);
          const env = Math.sin(t * Math.PI) * (0.28 + voltNorm * 0.22);
          const jitterX = Math.sin(s * 12.7 + quantTime * 3.1 + arc.seed) * env;
          const jitterY = Math.cos(s * 9.3 + quantTime * 2.7 + arc.seed) * env;
          const jitterZ = Math.sin(s * 7.1 + quantTime * 4.3 + arc.seed) * env;

          arc.pos[s * 3] = THREE.MathUtils.lerp(sx, ex, t) + jitterX;
          arc.pos[s * 3 + 1] = THREE.MathUtils.lerp(sy, ey, t) + jitterY;
          arc.pos[s * 3 + 2] = THREE.MathUtils.lerp(sz, ez, t) + jitterZ;
        }
        arc.attr.needsUpdate = true;
      }

      // Orbiting Ions along dipole field
      _quat.identity();
      for (let i = 0; i < ionCount; i++) {
        const theta = (i / ionCount) * Math.PI * 2 + elapsed * 1.6 * freqNorm * speed;
        const loopAngle = ((i % 6) / 6) * Math.PI * 2 + fluxGroup.rotation.y;
        const ringR = 2.65;
        const lx = Math.cos(theta) * ringR;
        const ly = Math.sin(theta) * ringR;
        const px = (1.45 + lx) * Math.cos(loopAngle);
        const pz = (1.45 + lx) * Math.sin(loopAngle);
        _v3A.set(px, 0.25 + ly, pz);
        _v3B.setScalar(0.8 + voltNorm * 0.45);
        _m4.compose(_v3A, _quat, _v3B);
        ionsInst.setMatrixAt(i, _m4);
      }
      ionsInst.instanceMatrix.needsUpdate = true;
      ionsInst.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

export function buildPhysicsExpansionMonument(
  id: MonumentId,
  isSoftwareGl: boolean
): BuiltMonument | null {
  switch (id) {
    case 'lhc_collider':
      return buildLhcColliderMonument(isSoftwareGl);
    case 'laser_interferometer':
      return buildLaserInterferometerMonument(isSoftwareGl);
    case 'tesla_electromagnet':
      return buildTeslaElectromagnetMonument(isSoftwareGl);
    default:
      return null;
  }
}
