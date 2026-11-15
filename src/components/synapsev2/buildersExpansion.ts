import * as THREE from 'three';
import { BuiltMonument, MonumentId, SynapseV2Params } from './synapseCatalog';

// Module-scope scratch math helpers (zero per-frame GC allocation)
const _m4 = new THREE.Matrix4();
const _v3A = new THREE.Vector3();
const _v3B = new THREE.Vector3();
const _v3C = new THREE.Vector3();
const _vUp = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _col = new THREE.Color();

// =========================================================================
// 13. JAMES WEBB INFRARED SPACE OBSERVATORY & 18-HEX GOLD MIRROR
// =========================================================================
export function buildJamesWebbObservatory(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.94,
    roughness: 0.14,
    emissive: 0x78350f,
    emissiveIntensity: 0.35
  });
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.28
  });
  const kaptonMat = new THREE.MeshPhysicalMaterial({
    color: 0xcbd5e1,
    metalness: 0.82,
    roughness: 0.18,
    emissive: 0x312e81,
    emissiveIntensity: 0.28,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88
  });
  const irBeamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  disposables.push(goldMat, carbonMat, kaptonMat, irBeamMat);

  // 1. 5-Layer Diamond Kapton Sunshield at base
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, -4.6);
  shieldShape.lineTo(3.3, -0.6);
  shieldShape.lineTo(0, 4.9);
  shieldShape.lineTo(-3.3, -0.6);
  shieldShape.closePath();

  const shieldGeo = new THREE.ShapeGeometry(shieldShape);
  shieldGeo.rotateX(-Math.PI / 2);
  disposables.push(shieldGeo);

  const shieldGroup = new THREE.Group();
  shieldGroup.position.y = -0.75;
  root.add(shieldGroup);

  const shieldLayers: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(shieldGeo, kaptonMat);
    m.position.y = -i * 0.24;
    m.scale.setScalar(1 + i * 0.045);
    shieldGroup.add(m);
    shieldLayers.push(m);
  }

  // 2. Optical Assembly Tilted Array (18 Gold Hexagonal Beryllium Segments)
  const telescopeGroup = new THREE.Group();
  telescopeGroup.position.set(0, 2.15, -0.35);
  telescopeGroup.rotation.x = -0.35;
  root.add(telescopeGroup);

  const hexRadius = 0.56;
  const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, 0.14, 6);
  hexGeo.rotateX(Math.PI / 2);
  disposables.push(hexGeo);

  // Compute exact 18 honeycomb grid offsets (rings 1 & 2 around central optical baffle at 0,0)
  const hexCoords: Array<[number, number]> = [];
  const dx = hexRadius * 1.82;
  const dy = hexRadius * 1.58;
  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      if (Math.abs(q + r) <= 2 && !(q === 0 && r === 0)) {
        const px = (q + r * 0.5) * dx;
        const py = r * dy;
        hexCoords.push([px, py]);
      }
    }
  }

  const hexInst = new THREE.InstancedMesh(hexGeo, goldMat, hexCoords.length);
  telescopeGroup.add(hexInst);

  // Central Cassegrain Optical Baffle Cone & Tripod Struts to Secondary Mirror
  const baffleGeo = new THREE.CylinderGeometry(0.28, 0.42, 1.35, 16);
  baffleGeo.rotateX(Math.PI / 2);
  const baffle = new THREE.Mesh(baffleGeo, carbonMat);
  baffle.position.z = 0.72;
  telescopeGroup.add(baffle);

  const secHousingGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.3, 18);
  secHousingGeo.rotateX(Math.PI / 2);
  const secMirror = new THREE.Mesh(secHousingGeo, goldMat);
  secMirror.position.z = 3.85;
  telescopeGroup.add(secMirror);
  disposables.push(baffleGeo, secHousingGeo);

  // 3 Tripod Struts converging at secondary mirror
  const strutGeo = new THREE.CylinderGeometry(0.045, 0.045, 1, 8);
  disposables.push(strutGeo);
  const strutAnchors: THREE.Vector3[] = [
    new THREE.Vector3(0, 2.35, 0.15),
    new THREE.Vector3(-2.05, -1.35, 0.15),
    new THREE.Vector3(2.05, -1.35, 0.15)
  ];
  const secTarget = new THREE.Vector3(0, 0, 3.85);
  for (const anchor of strutAnchors) {
    _v3C.copy(secTarget).sub(anchor);
    const len = _v3C.length();
    const strut = new THREE.Mesh(strutGeo, carbonMat);
    strut.position.copy(anchor).add(secTarget).multiplyScalar(0.5);
    strut.quaternion.setFromUnitVectors(_vUp, _v3C.normalize());
    strut.scale.set(1, len, 1);
    telescopeGroup.add(strut);
  }

  // Converging Infrared Starlight Beam Cone
  const coneGeo = new THREE.ConeGeometry(2.3, 3.7, 24, 1, true);
  coneGeo.rotateX(-Math.PI / 2);
  const irCone = new THREE.Mesh(coneGeo, irBeamMat);
  irCone.position.z = 1.95;
  telescopeGroup.add(irCone);
  disposables.push(coneGeo);

  // 3. Distant Deep-Field Redshift Galaxy Spark Swarm
  const galCount = isSoftwareGl ? 180 : 420;
  const galGeo = new THREE.OctahedronGeometry(0.06, 0);
  const galMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const galaxies = new THREE.InstancedMesh(galGeo, galMat, galCount);
  const gPos: Array<[number, number, number]> = [];
  for (let i = 0; i < galCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 4.6 + Math.random() * 5.8;
    const y = -1.2 + Math.random() * 6.8;
    gPos.push([Math.cos(ang) * rad, y, Math.sin(ang) * rad]);
    _col.setHSL(i % 4 === 0 ? 0.08 : i % 4 === 1 ? 0.55 : 0.85, 0.9, 0.68);
    galaxies.setColorAt(i, _col);
  }
  if (galaxies.instanceColor) galaxies.instanceColor.needsUpdate = true;
  root.add(galaxies);
  disposables.push(galGeo, galMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const waveUm = params.primaryParam;
      const syncNorm = params.secondaryParam / 100;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Expand 5 sunshield layers dramatically on Cutaway
      for (let i = 0; i < 5; i++) {
        shieldLayers[i].position.y = -i * (0.24 + explode * 0.48);
      }

      // 18 gold hexagonal mirrors slightly focus inward with calibration sync & expand radially on explode
      for (let i = 0; i < hexCoords.length; i++) {
        const [hx, hy] = hexCoords[i];
        const dist = Math.hypot(hx, hy);
        const focusZ = 0.07 * dist * dist * syncNorm;
        const spread = 1 + explode * 0.62;
        const wobble = (1 - syncNorm) * Math.sin(elapsed * 2.4 + i) * 0.18;

        _euler.set(hy * -0.06 * syncNorm + wobble, hx * 0.06 * syncNorm, Math.PI / 6);
        _quat.setFromEuler(_euler);
        _v3A.set(hx * spread, hy * spread, focusZ + explode * (i % 3) * 0.38);
        _v3B.setScalar(1);
        _m4.compose(_v3A, _quat, _v3B);
        hexInst.setMatrixAt(i, _m4);
      }
      hexInst.instanceMatrix.needsUpdate = true;
      hexInst.computeBoundingSphere();

      // Update infrared cone hue based on wavelength slider (1..28 µm)
      const irHue = THREE.MathUtils.clamp(0.16 - (waveUm / 28) * 0.16, 0, 0.16);
      irBeamMat.color.setHSL(irHue, 0.95, 0.65);
      irBeamMat.opacity = 0.24 + 0.18 * syncNorm + Math.sin(elapsed * 3.5 * speed) * 0.05;

      telescopeGroup.rotation.y = Math.sin(elapsed * 0.45 * speed) * 0.28;
      secMirror.position.z = 3.85 + explode * 1.2;

      _quat.identity();
      for (let i = 0; i < galCount; i++) {
        const [gx, gy, gz] = gPos[i];
        const s = 0.65 + 0.55 * Math.sin(elapsed * 2.2 * speed + i);
        _v3A.set(gx, gy + Math.sin(elapsed * 0.6 + i) * 0.14, gz);
        _v3B.setScalar(s);
        _m4.compose(_v3A, _quat, _v3B);
        galaxies.setMatrixAt(i, _m4);
      }
      galaxies.instanceMatrix.needsUpdate = true;
      galaxies.computeBoundingSphere();
      galaxies.rotation.y = elapsed * 0.06 * speed;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 14. MORRIS-THORNE TRAVERSABLE WORMHOLE & EINSTEIN-ROSEN BRIDGE
// =========================================================================
function buildWormholeFunnelGeometry(
  radialSegs: number,
  heightSegs: number,
  maxH: number,
  baseThroat: number,
  signY: number
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= heightSegs; iy++) {
    const t = iy / heightSegs;
    const h = t * maxH;
    const r = baseThroat + Math.pow(h, 1.48) * 1.18;
    const y = signY * h;

    for (let ir = 0; ir <= radialSegs; ir++) {
      const a = (ir / radialSegs) * Math.PI * 2;
      positions.push(Math.cos(a) * r, y, Math.sin(a) * r);
      const blend = t;
      colors.push(
        THREE.MathUtils.lerp(0.95, 0.22, blend),
        THREE.MathUtils.lerp(0.45, 0.72, blend),
        THREE.MathUtils.lerp(0.85, 0.98, blend)
      );
    }
  }

  const stride = radialSegs + 1;
  for (let iy = 0; iy < heightSegs; iy++) {
    for (let ir = 0; ir < radialSegs; ir++) {
      const a = iy * stride + ir;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function buildWormholeBridge(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const center = new THREE.Group();
  root.add(center);

  // Upper & Lower Hyperbolic Einstein-Rosen Universe Sheets
  const rSegs = isSoftwareGl ? 32 : 52;
  const hSegs = isSoftwareGl ? 18 : 28;
  const upperGeo = buildWormholeFunnelGeometry(rSegs, hSegs, 3.1, 1.35, 1);
  const lowerGeo = buildWormholeFunnelGeometry(rSegs, hSegs, 3.1, 1.35, -1);

  const funnelWireMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe: true,
    transparent: true,
    opacity: 0.52
  });
  const funnelGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x312e81,
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.24,
    side: THREE.DoubleSide
  });

  const upperGroup = new THREE.Group();
  upperGroup.add(new THREE.Mesh(upperGeo, funnelGlassMat), new THREE.Mesh(upperGeo, funnelWireMat));
  const lowerGroup = new THREE.Group();
  lowerGroup.add(new THREE.Mesh(lowerGeo, funnelGlassMat), new THREE.Mesh(lowerGeo, funnelWireMat));

  center.add(upperGroup, lowerGroup);
  disposables.push(upperGeo, lowerGeo, funnelWireMat, funnelGlassMat);

  // Optical Gravitational Lensing Sphere inside the Throat
  const lensGeo = new THREE.SphereGeometry(1.18, 32, 24);
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.15,
    roughness: 0.05,
    clearcoat: 1.0,
    transmission: isSoftwareGl ? 0 : 0.72,
    transparent: true,
    opacity: 0.65
  });
  const lensSphere = new THREE.Mesh(lensGeo, lensMat);
  center.add(lensSphere);

  // Exotic Matter Throat Confinement Ring
  const throatGeo = new THREE.TorusGeometry(1.42, 0.1, 12, 64);
  const throatMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 2.0,
    roughness: 0.2
  });
  const throatRing = new THREE.Mesh(throatGeo, throatMat);
  throatRing.rotation.x = Math.PI / 2;
  center.add(throatRing);
  disposables.push(lensGeo, lensMat, throatGeo, throatMat);

  // 340 Spiraling Photons traversing from Upper Universe down through Throat to Lower Universe
  const pCount = isSoftwareGl ? 170 : 340;
  const pGeo = new THREE.OctahedronGeometry(0.055, 0);
  const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const photons = new THREE.InstancedMesh(pGeo, pMat, pCount);
  const pProg = new Float32Array(pCount);
  const pAngle0 = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pProg[i] = Math.random();
    pAngle0[i] = Math.random() * Math.PI * 2;
    _col.setHex(i % 2 === 0 ? 0x38bdf8 : 0xf472b6);
    photons.setColorAt(i, _col);
  }
  if (photons.instanceColor) photons.instanceColor.needsUpdate = true;
  center.add(photons);
  disposables.push(pGeo, pMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const b0Norm = 0.7 + (params.primaryParam / 24) * 0.75;
      const curvNorm = 0.55 + (params.secondaryParam / 100) * 0.75;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      upperGroup.position.y = 0.55 + explode * 1.65;
      lowerGroup.position.y = 0.55 - explode * 1.65;
      upperGroup.scale.set(b0Norm, curvNorm, b0Norm);
      lowerGroup.scale.set(b0Norm, curvNorm, b0Norm);
      upperGroup.rotation.y = elapsed * 0.12 * speed;
      lowerGroup.rotation.y = -elapsed * 0.12 * speed;

      lensSphere.position.y = 0.55;
      lensSphere.scale.setScalar(b0Norm * (0.95 + Math.sin(elapsed * 3) * 0.05));
      throatRing.position.y = 0.55;
      throatRing.scale.setScalar(b0Norm);

      _quat.identity();
      for (let i = 0; i < pCount; i++) {
        pProg[i] = (pProg[i] + delta * 0.28 * speed) % 1;
        const h = (0.5 - pProg[i]) * 6.0 * curvNorm; // +3 -> -3
        const rad = (1.32 + Math.pow(Math.abs(h), 1.48) * 1.15) * b0Norm;
        const ang = pAngle0[i] + pProg[i] * Math.PI * 4.5 + elapsed * 0.65;
        _v3A.set(Math.cos(ang) * rad, h + 0.55, Math.sin(ang) * rad);
        _v3B.setScalar(0.8 + (1 - Math.abs(h) / 3.2) * 0.6);
        _m4.compose(_v3A, _quat, _v3B);
        photons.setMatrixAt(i, _m4);
      }
      photons.instanceMatrix.needsUpdate = true;
      photons.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 15. MILLISECOND PULSAR BEACON & SUPER-MAGNETIC DIPOLE FIELD
// =========================================================================
export function buildPulsarMagnetar(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const spinner = new THREE.Group();
  spinner.position.y = 1.0;
  root.add(spinner);

  // Inner Ultra-Dense Neutron Star Core
  const coreGeo = new THREE.SphereGeometry(1.1, 32, 24);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.2,
    roughness: 0.1
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  spinner.add(coreMesh);
  disposables.push(coreGeo, coreMat);

  // 18 Fractured Crystalline Iron-Crust Plates enveloping core (lift outward on Exploded Cutaway)
  const plateCount = 18;
  const plateGeo = new THREE.IcosahedronGeometry(0.42, 0);
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.55
  });
  const crustPlates = new THREE.InstancedMesh(plateGeo, plateMat, plateCount);
  const plateDirs: THREE.Vector3[] = [];
  for (let i = 0; i < plateCount; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / plateCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    plateDirs.push(
      new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))
    );
  }
  spinner.add(crustPlates);
  disposables.push(plateGeo, plateMat);

  // Tilted Magnetic Axis Group (Lighthouse Cones + 14 Dipole Magnetic Flux Loops)
  const magAxis = new THREE.Group();
  magAxis.rotation.z = 0.42;
  spinner.add(magAxis);

  // Twin Relativistic Synchrotron Lighthouse Cones
  const coneGeo = new THREE.ConeGeometry(1.55, 7.2, 24, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const coneTop = new THREE.Mesh(coneGeo, coneMat);
  coneTop.rotation.z = Math.PI;
  coneTop.position.y = 4.35;

  const coneBot = new THREE.Mesh(coneGeo, coneMat);
  coneBot.position.y = -4.35;
  magAxis.add(coneTop, coneBot);
  disposables.push(coneGeo, coneMat);

  // 14 Dipole Magnetic Field Loops (r = Rmax * sin^2(theta))
  const loopMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending
  });
  disposables.push(loopMat);

  const loopCount = isSoftwareGl ? 10 : 14;
  const loopMeshes: THREE.Mesh[] = [];
  for (let k = 0; k < loopCount; k++) {
    const azimuth = (k / loopCount) * Math.PI * 2;
    const rMax = k % 2 === 0 ? 4.9 : 3.45;
    const pts: THREE.Vector3[] = [];
    for (let s = 2; s <= 30; s++) {
      const th = (s / 32) * Math.PI;
      const rad = rMax * Math.sin(th) * Math.sin(th);
      const y = rad * Math.cos(th);
      const rho = rad * Math.sin(th);
      pts.push(new THREE.Vector3(Math.cos(azimuth) * rho, y, Math.sin(azimuth) * rho));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.035, 6, false);
    const loopMesh = new THREE.Mesh(tubeGeo, loopMat);
    magAxis.add(loopMesh);
    loopMeshes.push(loopMesh);
    disposables.push(tubeGeo);
  }

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const hzNorm = 0.5 + (params.primaryParam / 716) * 2.8;
      const bNorm = 0.7 + (params.secondaryParam / 15) * 0.65;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      spinner.rotation.y += delta * 1.45 * hzNorm * speed;
      magAxis.scale.setScalar(bNorm);

      // Pulse beam intensity
      coneMat.opacity = 0.24 + 0.14 * Math.sin(elapsed * 8 * speed);

      // Expand iron crust plates radially on cutaway
      const plateRad = 1.15 + explode * 1.65;
      for (let i = 0; i < plateCount; i++) {
        const dir = plateDirs[i];
        _v3A.copy(dir).multiplyScalar(plateRad);
        _quat.setFromUnitVectors(_vUp, dir);
        _v3B.set(1.1, 0.45, 1.1);
        _m4.compose(_v3A, _quat, _v3B);
        crustPlates.setMatrixAt(i, _m4);
      }
      crustPlates.instanceMatrix.needsUpdate = true;
      crustPlates.computeBoundingSphere();

      for (let k = 0; k < loopMeshes.length; k++) {
        loopMeshes[k].scale.setScalar(1 + explode * 0.25);
      }
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 16. BREAKTHROUGH LASER SOLAR SAIL & INTERSTELLAR RELAY ARRAY
// =========================================================================
export function buildOortSolarSail(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // 1. Orbital Phased-Array Laser Beamer Base
  const emitterGroup = new THREE.Group();
  emitterGroup.position.y = -2.2;
  root.add(emitterGroup);

  const ringGeo = new THREE.TorusGeometry(3.2, 0.22, 12, 48);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.88,
    roughness: 0.22
  });
  const emitterRing = new THREE.Mesh(ringGeo, ringMat);
  emitterRing.rotation.x = Math.PI / 2;
  emitterGroup.add(emitterRing);

  // 12 Laser Phased-Array Cannons shooting up at sail
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const beamGeo = new THREE.CylinderGeometry(0.05, 0.08, 4.9, 8, 1, true);
  const beamsInst = new THREE.InstancedMesh(beamGeo, laserMat, 12);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    _v3A.set(Math.cos(a) * 1.9, 2.35, Math.sin(a) * 1.9);
    _v3C.set(-Math.cos(a) * 0.24, 1, -Math.sin(a) * 0.24).normalize();
    _quat.setFromUnitVectors(_vUp, _v3C);
    _v3B.set(1, 1, 1);
    _m4.compose(_v3A, _quat, _v3B);
    beamsInst.setMatrixAt(i, _m4);
  }
  beamsInst.computeBoundingSphere();
  emitterGroup.add(beamsInst);
  disposables.push(ringGeo, ringMat, laserMat, beamGeo);

  // 2. Monumental Iridescent Hexagonal Solar Sail Canopy + Carbon Truss
  const sailGroup = new THREE.Group();
  sailGroup.position.y = 2.65;
  sailGroup.rotation.x = 0.22;
  root.add(sailGroup);

  const sailGeo = new THREE.CylinderGeometry(4.3, 4.3, 0.05, 6);
  const sailMat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    metalness: 0.92,
    roughness: 0.1,
    iridescence: 1.0,
    emissive: 0x064e3b,
    emissiveIntensity: 0.48,
    transparent: true,
    opacity: 0.86
  });
  const sailMesh = new THREE.Mesh(sailGeo, sailMat);
  sailGroup.add(sailMesh);

  // 6 Carbon-Fiber Tension Booms & Payload Starprobe suspended below
  const boomGeo = new THREE.CylinderGeometry(0.05, 0.05, 9.2, 8);
  boomGeo.rotateZ(Math.PI / 2);
  const boomGroup = new THREE.Group();
  for (let b = 0; b < 3; b++) {
    const bm = new THREE.Mesh(boomGeo, ringMat);
    bm.rotation.y = (b * Math.PI) / 3;
    boomGroup.add(bm);
  }
  sailGroup.add(boomGroup);

  const probeGeo = new THREE.OctahedronGeometry(0.42, 0);
  const probeMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.85,
    roughness: 0.15,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9
  });
  const probeMesh = new THREE.Mesh(probeGeo, probeMat);
  probeMesh.position.y = -0.95;
  sailGroup.add(probeMesh);
  disposables.push(sailGeo, sailMat, boomGeo, probeGeo, probeMat);

  // 3. 360 Rising Photon Impulse Packets impacting the Sail
  const phCount = isSoftwareGl ? 180 : 360;
  const phGeo = new THREE.BoxGeometry(0.04, 0.28, 0.04);
  const phMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const photons = new THREE.InstancedMesh(phGeo, phMat, phCount);
  const phX = new Float32Array(phCount);
  const phZ = new Float32Array(phCount);
  const phY = new Float32Array(phCount);
  for (let i = 0; i < phCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.9;
    phX[i] = Math.cos(a) * r;
    phZ[i] = Math.sin(a) * r;
    phY[i] = Math.random();
    _col.setHex(i % 2 === 0 ? 0xfef08a : 0x34d399);
    photons.setColorAt(i, _col);
  }
  if (photons.instanceColor) photons.instanceColor.needsUpdate = true;
  root.add(photons);
  disposables.push(phGeo, phMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const gwNorm = 0.5 + (params.primaryParam / 120) * 1.4;
      const vcNorm = 0.4 + (params.secondaryParam / 25) * 1.6;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      sailGroup.position.y = 2.65 + explode * 1.6 + Math.sin(elapsed * 1.6) * 0.14;
      sailGroup.rotation.y = elapsed * 0.18 * speed;
      boomGroup.position.y = explode * 0.75;
      probeMesh.position.y = -0.95 - explode * 1.25;

      laserMat.opacity = THREE.MathUtils.clamp(0.24 + gwNorm * 0.26, 0.2, 0.85);
      emitterGroup.position.y = -2.2 - explode * 0.8;

      _quat.identity();
      for (let i = 0; i < phCount; i++) {
        phY[i] = (phY[i] + delta * 0.9 * vcNorm * speed) % 1;
        const curY = THREE.MathUtils.lerp(-2.0, 2.55, phY[i]);
        _v3A.set(phX[i], curY, phZ[i]);
        _v3B.set(1, 0.7 + gwNorm * 0.6, 1);
        _m4.compose(_v3A, _quat, _v3B);
        photons.setMatrixAt(i, _m4);
      }
      photons.instanceMatrix.needsUpdate = true;
      photons.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 17. EXASCALE 3D TORUS SUPERCOMPUTER & OPTICAL PACKET MESH (COMPUTER SCIENCE)
// =========================================================================
export function buildSupercomputerTorus(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const latticeGroup = new THREE.Group();
  latticeGroup.position.y = 1.25;
  root.add(latticeGroup);

  // 4x4x4 = 64 Photonic Server Node Blades
  const rackGeo = new THREE.BoxGeometry(0.56, 0.56, 0.56);
  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.88,
    roughness: 0.22,
    emissive: 0x0284c7,
    emissiveIntensity: 0.48
  });
  const racks = new THREE.InstancedMesh(rackGeo, rackMat, 64);

  const rackCoords: Array<[number, number, number]> = [];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < 4; z++) {
        rackCoords.push([x - 1.5, y - 1.5, z - 1.5]);
      }
    }
  }
  latticeGroup.add(racks);
  disposables.push(rackGeo, rackMat);

  // Central Golden Photonic Crossbar Switch Core (revealed clearly on Cutaway!)
  const switchGeo = new THREE.OctahedronGeometry(0.95, 1);
  const switchMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.92,
    roughness: 0.14,
    emissive: 0xd97706,
    emissiveIntensity: 1.2
  });
  const switchCore = new THREE.Mesh(switchGeo, switchMat);
  latticeGroup.add(switchCore);
  disposables.push(switchGeo, switchMat);

  // Optical Torus Wraparound Fiber Rings
  const busRingGeo = new THREE.TorusGeometry(4.1, 0.055, 8, isSoftwareGl ? 36 : 72);
  const busRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  const ringX = new THREE.Mesh(busRingGeo, busRingMat);
  const ringY = new THREE.Mesh(busRingGeo, busRingMat);
  ringY.rotation.x = Math.PI / 2;
  const ringZ = new THREE.Mesh(busRingGeo, busRingMat);
  ringZ.rotation.y = Math.PI / 2;
  latticeGroup.add(ringX, ringY, ringZ);
  disposables.push(busRingGeo, busRingMat);

  // 280 Glowing Optical Data Packets flying along X/Y/Z torus channels
  const pktCount = isSoftwareGl ? 140 : 280;
  const pktGeo = new THREE.SphereGeometry(0.065, 6, 6);
  const pktMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const packets = new THREE.InstancedMesh(pktGeo, pktMat, pktCount);
  const pktAxis = new Uint8Array(pktCount);
  const pktLaneA = new Int8Array(pktCount);
  const pktLaneB = new Int8Array(pktCount);
  const pktT = new Float32Array(pktCount);

  for (let i = 0; i < pktCount; i++) {
    pktAxis[i] = i % 3;
    pktLaneA[i] = (i % 4) - 1.5;
    pktLaneB[i] = (Math.floor(i / 4) % 4) - 1.5;
    pktT[i] = Math.random();
    _col.setHex(i % 3 === 0 ? 0x22d3ee : i % 3 === 1 ? 0xfbbf24 : 0x60a5fa);
    packets.setColorAt(i, _col);
  }
  if (packets.instanceColor) packets.instanceColor.needsUpdate = true;
  latticeGroup.add(packets);
  disposables.push(pktGeo, pktMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const pfNorm = 0.5 + (params.primaryParam / 2000) * 1.4;
      const loadNorm = 0.35 + (params.secondaryParam / 100) * 1.4;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      const spacing = 1.42 + explode * 1.05;
      _quat.identity();
      for (let i = 0; i < 64; i++) {
        const [rx, ry, rz] = rackCoords[i];
        const pulse = 0.94 + 0.08 * Math.sin(elapsed * 4 * pfNorm + i);
        _v3A.set(rx * spacing, ry * spacing, rz * spacing);
        _v3B.setScalar(pulse);
        _m4.compose(_v3A, _quat, _v3B);
        racks.setMatrixAt(i, _m4);
      }
      racks.instanceMatrix.needsUpdate = true;
      racks.computeBoundingSphere();

      switchCore.rotation.y = elapsed * 1.2 * speed;
      switchCore.rotation.x = elapsed * 0.75 * speed;
      latticeGroup.rotation.y = elapsed * 0.16 * speed;

      const span = spacing * 3.4;
      for (let i = 0; i < pktCount; i++) {
        pktT[i] = (pktT[i] + delta * 0.65 * loadNorm * speed) % 1;
        const posAlong = (pktT[i] - 0.5) * span;
        const a = pktLaneA[i] * spacing;
        const b = pktLaneB[i] * spacing;
        if (pktAxis[i] === 0) _v3A.set(posAlong, a, b);
        else if (pktAxis[i] === 1) _v3A.set(a, posAlong, b);
        else _v3A.set(a, b, posAlong);
        _v3B.setScalar(0.8 + loadNorm * 0.35);
        _m4.compose(_v3A, _quat, _v3B);
        packets.setMatrixAt(i, _m4);
      }
      packets.instanceMatrix.needsUpdate = true;
      packets.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 18. SUPERSCALAR OUT-OF-ORDER CPU TOWER & 5-STAGE PIPELINE (COMPUTER SCIENCE)
// =========================================================================
export function buildCpuPipelineCore(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const tierColors = [0x0ea5e9, 0x10b981, 0xfbbf24, 0xa855f7, 0x64748b];
  const tierRadii = [4.4, 3.6, 2.9, 2.25, 1.85];
  const tierBaseY = [-1.8, -0.5, 0.8, 2.1, 3.35];
  const tierGroups: THREE.Group[] = [];

  const siliconBaseMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.25
  });
  const goldPinMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.94,
    roughness: 0.16
  });
  disposables.push(siliconBaseMat, goldPinMat);

  for (let t = 0; t < 5; t++) {
    const grp = new THREE.Group();
    grp.position.y = tierBaseY[t];
    root.add(grp);
    tierGroups.push(grp);

    const waferGeo = new THREE.BoxGeometry(tierRadii[t] * 1.55, 0.26, tierRadii[t] * 1.55);
    const waferMesh = new THREE.Mesh(waferGeo, siliconBaseMat);
    grp.add(waferMesh);

    const ringGeo = new THREE.TorusGeometry(tierRadii[t] * 0.92, 0.05, 8, isSoftwareGl ? 32 : 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: tierColors[t],
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18;
    grp.add(ring);
    disposables.push(waferGeo, ringGeo, ringMat);

    // Mini ALU / Cache Sub-dies on each tier
    const dieGeo = new THREE.BoxGeometry(0.48, 0.22, 0.48);
    const dieMat = new THREE.MeshStandardMaterial({
      color: tierColors[t],
      emissive: tierColors[t],
      emissiveIntensity: 0.65,
      metalness: 0.65,
      roughness: 0.2
    });
    const dies = new THREE.InstancedMesh(dieGeo, dieMat, 8);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const r = tierRadii[t] * 0.56;
      _v3A.set(Math.cos(a) * r, 0.22, Math.sin(a) * r);
      _euler.set(0, -a, 0);
      _quat.setFromEuler(_euler);
      _v3B.set(1, 1, 1);
      _m4.compose(_v3A, _quat, _v3B);
      dies.setMatrixAt(k, _m4);
    }
    dies.computeBoundingSphere();
    grp.add(dies);
    disposables.push(dieGeo, dieMat);
  }

  // Central Clock Pillar & Vertical Data Buses
  const clockGeo = new THREE.CylinderGeometry(0.32, 0.42, 6.2, 16);
  const clockMesh = new THREE.Mesh(clockGeo, goldPinMat);
  clockMesh.position.y = 0.85;
  root.add(clockMesh);
  disposables.push(clockGeo);

  // 180 Instruction Pipeline Tokens rising through the 5 stages (Fetch -> Decode -> ALU -> Mem -> WB)
  const tokCount = isSoftwareGl ? 90 : 180;
  const tokGeo = new THREE.OctahedronGeometry(0.085, 0);
  const tokMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tokens = new THREE.InstancedMesh(tokGeo, tokMat, tokCount);
  const tokT = new Float32Array(tokCount);
  const tokAng = new Float32Array(tokCount);
  for (let i = 0; i < tokCount; i++) {
    tokT[i] = Math.random();
    tokAng[i] = (i % 8) * (Math.PI / 4) + Math.random() * 0.2;
    _col.setHex(tierColors[i % 4]);
    tokens.setColorAt(i, _col);
  }
  if (tokens.instanceColor) tokens.instanceColor.needsUpdate = true;
  root.add(tokens);
  disposables.push(tokGeo, tokMat);

  return {
    root,
    update: (elapsed: number, delta: number, params: SynapseV2Params) => {
      const ghzNorm = 0.45 + (params.primaryParam / 12) * 1.65;
      const ipcNorm = 0.4 + (params.secondaryParam / 100) * 1.2;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      for (let t = 0; t < 5; t++) {
        tierGroups[t].position.y = tierBaseY[t] + (t - 2) * explode * 0.88;
        tierGroups[t].rotation.y = elapsed * 0.18 * (t % 2 === 0 ? 1 : -1) * ghzNorm * speed;
      }

      _quat.identity();
      for (let i = 0; i < tokCount; i++) {
        tokT[i] = (tokT[i] + delta * 0.35 * ghzNorm * speed) % 1;
        const y = THREE.MathUtils.lerp(-1.9 - explode * 1.6, 3.6 + explode * 1.6, tokT[i]);
        const rad = THREE.MathUtils.lerp(4.0, 1.75, tokT[i]);
        const ang = tokAng[i] + tokT[i] * Math.PI * 1.5 + elapsed * 0.8 * speed;
        _v3A.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
        _v3B.setScalar(0.8 + ipcNorm * 0.4);
        _m4.compose(_v3A, _quat, _v3B);
        tokens.setMatrixAt(i, _m4);
      }
      tokens.instanceMatrix.needsUpdate = true;
      tokens.computeBoundingSphere();
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 19. ELLIPTIC-CURVE CRYPTOGRAPHY LATTICE & ZK-MERKLE SPIRE (COMPUTER SCIENCE)
// =========================================================================
export function buildBlockchainZkLattice(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  // 1. Finite-Field Elliptic Curve Manifold Grid at Base
  const segs = isSoftwareGl ? 24 : 38;
  const manifoldGeo = new THREE.PlaneGeometry(10.5, 10.5, segs, segs);
  manifoldGeo.rotateX(-Math.PI / 2);
  const pos = manifoldGeo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * 0.35;
    const z = pos.getZ(i) * 0.35;
    const y = Math.tanh(x * x * x - x - z * z * 0.6) * 0.65 - 2.1;
    pos.setY(i, y);
  }
  manifoldGeo.computeVertexNormals();
  const manifoldMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  root.add(new THREE.Mesh(manifoldGeo, manifoldMat));
  disposables.push(manifoldGeo, manifoldMat);

  // 2. 4-Level 3D Merkle Verification Pyramid (8 -> 4 -> 2 -> 1 Root Hash)
  const spireGroup = new THREE.Group();
  root.add(spireGroup);

  const nodeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x6366f1,
    emissiveIntensity: 0.9,
    metalness: 0.85,
    roughness: 0.2
  });
  const rootCrownGeo = new THREE.OctahedronGeometry(0.82, 0);
  const rootCrownMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.8,
    metalness: 0.92,
    roughness: 0.12
  });

  const layerCounts = [12, 6, 3, 1];
  const layerRadii = [3.9, 2.3, 1.15, 0];
  const layerBaseY = [-1.1, 0.5, 2.1, 3.7];
  const levelCoords: THREE.Vector3[][] = [];

  for (let lv = 0; lv < 4; lv++) {
    const arr: THREE.Vector3[] = [];
    for (let k = 0; k < layerCounts[lv]; k++) {
      const a = (k / layerCounts[lv]) * Math.PI * 2 + lv * 0.3;
      const r = layerRadii[lv];
      arr.push(new THREE.Vector3(Math.cos(a) * r, layerBaseY[lv], Math.sin(a) * r));
    }
    levelCoords.push(arr);
  }

  const totalNonRoot = 12 + 6 + 3;
  const nodesInst = new THREE.InstancedMesh(nodeGeo, nodeMat, totalNonRoot);
  spireGroup.add(nodesInst);

  const rootCrown = new THREE.Mesh(rootCrownGeo, rootCrownMat);
  rootCrown.position.y = layerBaseY[3];
  spireGroup.add(rootCrown);

  // Proof beam segments connecting child hashes -> parent hashes
  const beamGeo = new THREE.CylinderGeometry(0.032, 0.032, 1, 8);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending
  });
  const totalBeams = 12 + 6 + 3;
  const beamsInst = new THREE.InstancedMesh(beamGeo, beamMat, totalBeams);
  spireGroup.add(beamsInst);

  // Counter-Rotating Hash Vault Shield Rings
  const vaultGeo = new THREE.TorusGeometry(4.45, 0.09, 10, 48);
  const vaultMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    metalness: 0.88,
    roughness: 0.2,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.65
  });
  const vaultRingA = new THREE.Mesh(vaultGeo, vaultMat);
  vaultRingA.position.y = 0.8;
  vaultRingA.rotation.x = 0.45;
  const vaultRingB = new THREE.Mesh(vaultGeo, vaultMat);
  vaultRingB.position.y = 0.8;
  vaultRingB.rotation.z = -0.45;
  spireGroup.add(vaultRingA, vaultRingB);

  disposables.push(nodeGeo, nodeMat, rootCrownGeo, rootCrownMat, beamGeo, beamMat, vaultGeo, vaultMat);

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const bitNorm = 0.65 + (params.primaryParam / 512) * 0.65;
      const zkNorm = 0.45 + (params.secondaryParam / 100) * 1.5;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      let nIdx = 0;
      let bIdx = 0;

      // Update nodes + beams dynamically with exploded radial/vertical cutaway
      const liveCoords: THREE.Vector3[][] = levelCoords.map((lvArr, lv) =>
        lvArr.map((v) =>
          new THREE.Vector3(
            v.x * (1 + explode * 0.48),
            v.y + (lv - 1.5) * explode * 0.65,
            v.z * (1 + explode * 0.48)
          )
        )
      );

      for (let lv = 0; lv < 3; lv++) {
        const cur = liveCoords[lv];
        const parent = liveCoords[lv + 1];
        for (let k = 0; k < cur.length; k++) {
          const p = cur[k];
          _euler.set(elapsed * 0.8 + k, elapsed * 1.1, 0);
          _quat.setFromEuler(_euler);
          _v3B.setScalar(bitNorm * (0.9 + 0.15 * Math.sin(elapsed * 4 * zkNorm + k)));
          _m4.compose(p, _quat, _v3B);
          nodesInst.setMatrixAt(nIdx++, _m4);

          const par = parent[Math.floor(k / (cur.length / parent.length)) % parent.length];
          _v3A.copy(p).add(par).multiplyScalar(0.5);
          _v3C.copy(par).sub(p);
          const len = Math.max(0.01, _v3C.length());
          _quat.setFromUnitVectors(_vUp, _v3C.normalize());
          _v3B.set(1, len, 1);
          _m4.compose(_v3A, _quat, _v3B);
          beamsInst.setMatrixAt(bIdx++, _m4);
        }
      }
      nodesInst.instanceMatrix.needsUpdate = true;
      beamsInst.instanceMatrix.needsUpdate = true;
      nodesInst.computeBoundingSphere();
      beamsInst.computeBoundingSphere();

      rootCrown.position.y = liveCoords[3][0].y;
      rootCrown.rotation.y = elapsed * 1.4 * zkNorm * speed;
      rootCrown.scale.setScalar(bitNorm * (0.95 + Math.sin(elapsed * 3.5) * 0.08));

      vaultRingA.rotation.y = elapsed * 0.35 * zkNorm * speed;
      vaultRingB.rotation.y = -elapsed * 0.42 * zkNorm * speed;
      vaultRingA.scale.setScalar(1 + explode * 0.42);
      vaultRingB.scale.setScalar(1 + explode * 0.55);
      spireGroup.rotation.y = elapsed * 0.14 * speed;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

// =========================================================================
// 20. 3D SPATIAL GRAPH ROUTING NETWORK & DIJKSTRA WAVEFRONT (COMPUTER SCIENCE)
// =========================================================================
export function buildGraphDijkstraCitadel(isSoftwareGl: boolean): BuiltMonument {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const graphGroup = new THREE.Group();
  root.add(graphGroup);

  // 32 Vertices arranged in 3 geodesic topological strata (12 + 12 + 8)
  const baseVertices: THREE.Vector3[] = [];
  const strataSpec = [
    { count: 12, r: 4.5, y: -1.1 },
    { count: 12, r: 3.3, y: 1.0 },
    { count: 8, r: 1.9, y: 3.0 }
  ];
  for (let s = 0; s < strataSpec.length; s++) {
    const { count, r, y } = strataSpec[s];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + s * 0.35;
      baseVertices.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
  }

  // Deterministic Weighted Graph Edges (68 total edges + Shortest Path Spine of 6 hops)
  const edges: Array<[number, number, boolean]> = [];
  // Ring connections within each stratum
  for (let i = 0; i < 12; i++) edges.push([i, (i + 1) % 12, i < 2]);
  for (let i = 0; i < 12; i++) edges.push([12 + i, 12 + ((i + 1) % 12), false]);
  for (let i = 0; i < 8; i++) edges.push([24 + i, 24 + ((i + 1) % 8), i === 3 || i === 4]);
  // Inter-stratum climbs + cross-chords
  for (let i = 0; i < 12; i++) {
    edges.push([i, 12 + i, i === 2]);
    edges.push([i, 12 + ((i + 2) % 12), false]);
  }
  for (let i = 0; i < 12; i++) {
    edges.push([12 + i, 24 + (i % 8), i === 2]);
  }
  const spineHops = [0, 1, 2, 14, 26, 27, 28];

  const vGeo = new THREE.IcosahedronGeometry(0.24, 1);
  const vMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.9,
    metalness: 0.7,
    roughness: 0.2
  });
  const verticesInst = new THREE.InstancedMesh(vGeo, vMat, baseVertices.length);
  for (let i = 0; i < baseVertices.length; i++) {
    const isSpine = spineHops.includes(i);
    _col.setHex(isSpine ? 0xfef08a : i < 12 ? 0x38bdf8 : i < 24 ? 0xa855f7 : 0xf43f5e);
    verticesInst.setColorAt(i, _col);
  }
  if (verticesInst.instanceColor) verticesInst.instanceColor.needsUpdate = true;
  graphGroup.add(verticesInst);

  const eGeo = new THREE.CylinderGeometry(0.032, 0.032, 1, 6);
  const eMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.65
  });
  const edgesInst = new THREE.InstancedMesh(eGeo, eMat, edges.length);
  for (let i = 0; i < edges.length; i++) {
    _col.setHex(edges[i][2] ? 0xfbbf24 : 0x38bdf8);
    edgesInst.setColorAt(i, _col);
  }
  if (edgesInst.instanceColor) edgesInst.instanceColor.needsUpdate = true;
  graphGroup.add(edgesInst);

  // Dijkstra Wavefront Explorer Pulse Orb racing along Shortest Path Spine
  const seekerGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const seekerMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const seekerOrb = new THREE.Mesh(seekerGeo, seekerMat);
  graphGroup.add(seekerOrb);

  // Outer Dijkstra Wavefront Expanding Torus Ring
  const waveRingGeo = new THREE.TorusGeometry(2.5, 0.055, 8, isSoftwareGl ? 36 : 64);
  const waveRingMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending
  });
  const waveRing = new THREE.Mesh(waveRingGeo, waveRingMat);
  waveRing.rotation.x = Math.PI / 2;
  graphGroup.add(waveRing);

  disposables.push(vGeo, vMat, eGeo, eMat, seekerGeo, seekerMat, waveRingGeo, waveRingMat);

  const livePts = baseVertices.map((v) => v.clone());

  return {
    root,
    update: (elapsed: number, _delta: number, params: SynapseV2Params) => {
      const densityNorm = params.primaryParam / 100; // 0.2..1.0
      const waveSpeed = 0.45 + (params.secondaryParam / 100) * 1.85;
      const speed = Math.max(0.15, params.timeScale);
      const explode = params.explodeFactor;

      // Explode the 3 topological graph strata cleanly vertically & radially
      for (let i = 0; i < baseVertices.length; i++) {
        const stratum = i < 12 ? -1 : i < 24 ? 0 : 1;
        const bv = baseVertices[i];
        livePts[i].set(
          bv.x * (1 + explode * 0.35),
          bv.y + stratum * explode * 1.25 + Math.sin(elapsed * 2 + i) * 0.08,
          bv.z * (1 + explode * 0.35)
        );
      }

      _quat.identity();
      for (let i = 0; i < livePts.length; i++) {
        const pulse = spineHops.includes(i)
          ? 1.25 + 0.3 * Math.sin(elapsed * 5 * waveSpeed)
          : 0.9 + 0.18 * Math.sin(elapsed * 2.5 + i);
        _v3B.setScalar(pulse);
        _m4.compose(livePts[i], _quat, _v3B);
        verticesInst.setMatrixAt(i, _m4);
      }
      verticesInst.instanceMatrix.needsUpdate = true;
      verticesInst.computeBoundingSphere();

      const activeEdgeLimit = Math.max(24, Math.floor(edges.length * densityNorm));
      for (let i = 0; i < edges.length; i++) {
        const [aIdx, bIdx, isSpine] = edges[i];
        if (!isSpine && i > activeEdgeLimit) {
          _v3A.set(0, -100, 0);
          _v3B.setScalar(0.001);
          _m4.compose(_v3A, _quat, _v3B);
          edgesInst.setMatrixAt(i, _m4);
          continue;
        }
        const pA = livePts[aIdx];
        const pB = livePts[bIdx];
        _v3A.copy(pA).add(pB).multiplyScalar(0.5);
        _v3C.copy(pB).sub(pA);
        const len = Math.max(0.01, _v3C.length());
        _quat.setFromUnitVectors(_vUp, _v3C.normalize());
        _v3B.set(isSpine ? 1.8 : 1, len, isSpine ? 1.8 : 1);
        _m4.compose(_v3A, _quat, _v3B);
        edgesInst.setMatrixAt(i, _m4);
      }
      edgesInst.instanceMatrix.needsUpdate = true;
      edgesInst.computeBoundingSphere();

      // Animate Dijkstra Shortest-Path Explorer Orb smoothly along spineHops
      const pathT = (elapsed * 0.45 * waveSpeed * speed) % (spineHops.length - 1);
      const seg = Math.floor(pathT);
      const frac = pathT - seg;
      const pStart = livePts[spineHops[seg]];
      const pEnd = livePts[spineHops[seg + 1]];
      seekerOrb.position.lerpVectors(pStart, pEnd, frac);

      // Dijkstra Expanding Horizon Wave Ring
      const wCycle = (elapsed * 0.55 * waveSpeed * speed) % 1;
      waveRing.position.y = THREE.MathUtils.lerp(-1.2, 3.2, wCycle);
      waveRing.scale.setScalar(0.55 + Math.sin(wCycle * Math.PI) * 1.35);
      waveRingMat.opacity = (1 - wCycle) * 0.78;

      graphGroup.rotation.y = elapsed * 0.18 * speed;
    },
    dispose: () => disposables.forEach((d) => d.dispose())
  };
}

export function buildExpansionMonument(id: MonumentId, isSoftwareGl: boolean): BuiltMonument | null {
  switch (id) {
    case 'james_webb':
      return buildJamesWebbObservatory(isSoftwareGl);
    case 'wormhole_morris':
      return buildWormholeBridge(isSoftwareGl);
    case 'pulsar_magnetar':
      return buildPulsarMagnetar(isSoftwareGl);
    case 'oort_solar_sail':
      return buildOortSolarSail(isSoftwareGl);
    case 'supercomputer_torus':
      return buildSupercomputerTorus(isSoftwareGl);
    case 'cpu_pipeline_core':
      return buildCpuPipelineCore(isSoftwareGl);
    case 'blockchain_zk_lattice':
      return buildBlockchainZkLattice(isSoftwareGl);
    case 'graph_dijkstra_citadel':
      return buildGraphDijkstraCitadel(isSoftwareGl);
    default:
      return null;
  }
}
