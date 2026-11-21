import * as THREE from 'three';
import { AssemblyModelId } from './assemblyTypes';

export interface BuiltPartMeshResult {
  group: THREE.Group;
  animatedParts: Record<string, THREE.Object3D>;
}

/** Generate a procedural 3K carbon-fiber weave texture (zero external 404s) */
export function createCarbonWeaveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#141820';
    ctx.fillRect(0, 0, 128, 128);
    const step = 16;
    for (let y = 0; y < 128; y += step) {
      for (let x = 0; x < 128; x += step) {
        const even = ((x + y) / step) % 2 === 0;
        ctx.fillStyle = even ? '#252c38' : '#0d1016';
        ctx.fillRect(x, y, step - 1, step / 2);
        ctx.fillStyle = even ? '#1c222d' : '#1b202b';
        ctx.fillRect(x, y + step / 2, step / 2, step / 2);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/** Generate an extruded involute-style gear geometry */
export function createGearGeometry(
  teethCount: number,
  outerRadius: number,
  rootRadius: number,
  boreRadius: number,
  thickness: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teethCount;

  for (let i = 0; i < teethCount; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.18;
    const a2 = a0 + step * 0.34;
    const a3 = a0 + step * 0.56;
    const a4 = a0 + step * 0.72;

    const p0x = Math.cos(a0) * rootRadius;
    const p0y = Math.sin(a0) * rootRadius;
    if (i === 0) shape.moveTo(p0x, p0y);
    else shape.lineTo(p0x, p0y);

    shape.lineTo(Math.cos(a1) * rootRadius, Math.sin(a1) * rootRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * outerRadius, Math.sin(a3) * outerRadius);
    shape.lineTo(Math.cos(a4) * rootRadius, Math.sin(a4) * rootRadius);
  }
  shape.closePath();

  if (boreRadius > 0.01) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: Math.min(0.015, thickness * 0.12),
    bevelSize: Math.min(0.012, outerRadius * 0.03),
    bevelSegments: 2,
    curveSegments: 16,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -thickness / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

/** Create internal ring gear geometry for planetary gearbox */
function createInternalRingGearGeometry(
  teethCount: number,
  outerRadius: number,
  innerTipRadius: number,
  innerRootRadius: number,
  thickness: number
): THREE.ExtrudeGeometry {
  const outer = new THREE.Shape();
  outer.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const inner = new THREE.Path();
  const step = (Math.PI * 2) / teethCount;
  for (let i = 0; i < teethCount; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.2;
    const a2 = a0 + step * 0.36;
    const a3 = a0 + step * 0.56;
    const a4 = a0 + step * 0.72;
    const p0x = Math.cos(a0) * innerRootRadius;
    const p0y = Math.sin(a0) * innerRootRadius;
    if (i === 0) inner.moveTo(p0x, p0y);
    else inner.lineTo(p0x, p0y);
    inner.lineTo(Math.cos(a1) * innerRootRadius, Math.sin(a1) * innerRootRadius);
    inner.lineTo(Math.cos(a2) * innerTipRadius, Math.sin(a2) * innerTipRadius);
    inner.lineTo(Math.cos(a3) * innerTipRadius, Math.sin(a3) * innerTipRadius);
    inner.lineTo(Math.cos(a4) * innerRootRadius, Math.sin(a4) * innerRootRadius);
  }
  inner.closePath();
  outer.holes.push(inner);

  const geo = new THREE.ExtrudeGeometry(outer, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -thickness / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

function createMaterialLibrary(isSoftwareGl: boolean, carbonTex: THREE.CanvasTexture) {
  return {
    castAlum: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.78,
      roughness: 0.36,
    }),
    darkCast: new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.72,
      roughness: 0.45,
    }),
    forgedSteel: new THREE.MeshStandardMaterial({
      color: 0xdbe4ee,
      metalness: 0.94,
      roughness: 0.18,
    }),
    titanium: new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      metalness: 0.88,
      roughness: 0.24,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.22,
    }),
    brassGold: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.2,
    }),
    roseGold: new THREE.MeshStandardMaterial({
      color: 0xe8a87c,
      metalness: 0.94,
      roughness: 0.16,
    }),
    anodizedCyan: new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.75,
      roughness: 0.25,
    }),
    anodizedRed: new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      metalness: 0.72,
      roughness: 0.28,
    }),
    bluedSteel: new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.92,
      roughness: 0.16,
    }),
    ceramic: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.08,
      roughness: 0.18,
    }),
    pcbGreen: new THREE.MeshStandardMaterial({
      color: 0x065f46,
      metalness: 0.25,
      roughness: 0.42,
    }),
    carbon: new THREE.MeshStandardMaterial({
      map: carbonTex,
      color: 0xffffff,
      metalness: 0.32,
      roughness: 0.38,
    }),
    ruby: new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: 0x4c0519,
      emissiveIntensity: 0.45,
    }),
    sapphireGlass: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      metalness: 0.05,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.32 : 0.9,
      ior: 1.76,
      clearcoat: 1.0,
      depthWrite: false,
    }),
    mattePoly: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.18,
      roughness: 0.65,
    }),
    orangeAccent: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      metalness: 0.35,
      roughness: 0.38,
    }),
  };
}

function enableShadows(group: THREE.Object3D) {
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
}

export function buildAssemblyPartMesh(
  modelId: AssemblyModelId,
  partId: string,
  isSoftwareGl: boolean,
  carbonTex: THREE.CanvasTexture
): BuiltPartMeshResult {
  const mats = createMaterialLibrary(isSoftwareGl, carbonTex);
  const group = new THREE.Group();
  group.name = partId;
  const animatedParts: Record<string, THREE.Object3D> = {};

  // ==================== MODEL 1: V4 / 4-CYLINDER ENGINE ====================
  if (modelId === 'v4_engine') {
    const cylXs = [-0.9, -0.3, 0.3, 0.9];

    if (partId === 'engine_block') {
      // Lower crankcase sump
      const sump = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.42, 1.18), mats.darkCast);
      sump.position.y = -0.38;
      group.add(sump);

      // Upper cylinder block skirts with 4 machined cylinder bores
      const deckBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.72, 1.08), mats.castAlum);
      deckBase.position.y = 0.25;
      group.add(deckBase);

      // Cooling fins & side ribs
      for (let i = -2; i <= 2; i++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.64, 1.18), mats.darkCast);
        rib.position.set(i * 0.56, 0.25, 0);
        group.add(rib);
      }

      // 4 Polished cylinder liners protruding slightly on top deck
      const sleeveGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.8, 24, 1, true);
      const sleeveMat = mats.forgedSteel.clone();
      sleeveMat.side = THREE.DoubleSide;
      cylXs.forEach((cx) => {
        const liner = new THREE.Mesh(sleeveGeo, sleeveMat);
        liner.position.set(cx, 0.28, 0);
        group.add(liner);

        const collar = new THREE.Mesh(
          new THREE.TorusGeometry(0.24, 0.025, 10, 24),
          mats.copper
        );
        collar.rotation.x = Math.PI / 2;
        collar.position.set(cx, 0.65, 0);
        group.add(collar);
      });
    } else if (partId === 'crankshaft') {
      const crankGroup = new THREE.Group();
      const mainAxis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.75, 20),
        mats.forgedSteel
      );
      mainAxis.rotation.z = Math.PI / 2;
      crankGroup.add(mainAxis);

      // Flywheel at rear
      const flywheel = new THREE.Mesh(
        createGearGeometry(28, 0.48, 0.43, 0.1, 0.12),
        mats.darkCast
      );
      flywheel.rotation.z = Math.PI / 2;
      flywheel.position.set(-1.35, 0, 0);
      crankGroup.add(flywheel);

      // Harmonic pulley at front
      const pulley = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24),
        mats.anodizedCyan
      );
      pulley.rotation.z = Math.PI / 2;
      pulley.position.set(1.38, 0, 0);
      crankGroup.add(pulley);

      // 4 Crank throws (1-3-4-2 phase offsets: 0, PI, PI, 0)
      const throws = [0, Math.PI, Math.PI, 0];
      cylXs.forEach((cx, idx) => {
        const angle = throws[idx];
        const yOff = Math.cos(angle) * 0.16;
        const zOff = Math.sin(angle) * 0.16;

        const web1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.22), mats.titanium);
        web1.position.set(cx - 0.12, yOff * 0.5, zOff * 0.5);
        crankGroup.add(web1);

        const web2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.22), mats.titanium);
        web2.position.set(cx + 0.12, yOff * 0.5, zOff * 0.5);
        crankGroup.add(web2);

        const pin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.24, 16),
          mats.brassGold
        );
        pin.rotation.z = Math.PI / 2;
        pin.position.set(cx, yOff, zOff);
        crankGroup.add(pin);
      });

      group.add(crankGroup);
      animatedParts.crank = crankGroup;
    } else if (partId === 'con_rods') {
      cylXs.forEach((cx, idx) => {
        const rodPivot = new THREE.Group();
        rodPivot.position.set(cx, 0, 0);

        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.54, 0.07), mats.titanium);
        beam.position.y = 0.02;
        rodPivot.add(beam);

        const bigEnd = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 0.11, 18),
          mats.copper
        );
        bigEnd.rotation.z = Math.PI / 2;
        bigEnd.position.y = -0.25;
        rodPivot.add(bigEnd);

        const smallEnd = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, 0.11, 16),
          mats.forgedSteel
        );
        smallEnd.rotation.z = Math.PI / 2;
        smallEnd.position.y = 0.29;
        rodPivot.add(smallEnd);

        group.add(rodPivot);
        animatedParts[`rod_${idx}`] = rodPivot;
      });
    } else if (partId === 'pistons') {
      cylXs.forEach((cx, idx) => {
        const pGroup = new THREE.Group();
        pGroup.position.set(cx, 0, 0);

        const crown = new THREE.Mesh(
          new THREE.CylinderGeometry(0.21, 0.21, 0.26, 24),
          mats.forgedSteel
        );
        pGroup.add(crown);

        // Two compression rings
        [0.08, 0.03].forEach((ry) => {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.215, 0.012, 8, 24),
            mats.brassGold
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.y = ry;
          pGroup.add(ring);
        });

        // Combustion flash indicator disc on piston top
        const flameMat = new THREE.MeshBasicMaterial({
          color: 0xf97316,
          transparent: true,
          opacity: 0,
        });
        const flame = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 20), flameMat);
        flame.position.y = 0.145;
        pGroup.add(flame);

        group.add(pGroup);
        animatedParts[`piston_${idx}`] = pGroup;
        animatedParts[`flame_${idx}`] = flame;
      });
    } else if (partId === 'cylinder_head') {
      const head = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.38, 1.12), mats.castAlum);
      group.add(head);

      // 16 Brass/Steel valves protruding beneath/top
      cylXs.forEach((cx) => {
        [-0.22, 0.22].forEach((vz) => {
          [-0.09, 0.09].forEach((vx) => {
            const valve = new THREE.Mesh(
              new THREE.CylinderGeometry(0.018, 0.06, 0.24, 12),
              mats.forgedSteel
            );
            valve.position.set(cx + vx, 0.04, vz);
            group.add(valve);

            const spring = new THREE.Mesh(
              new THREE.TorusGeometry(0.045, 0.011, 8, 16),
              mats.anodizedCyan
            );
            spring.rotation.x = Math.PI / 2;
            spring.position.set(cx + vx, 0.22, vz);
            group.add(spring);
          });
        });
      });
    } else if (partId === 'camshafts') {
      [-0.26, 0.26].forEach((cz, camIdx) => {
        const camGroup = new THREE.Group();
        camGroup.position.set(0, 0, cz);

        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 2.6, 16),
          mats.forgedSteel
        );
        shaft.rotation.z = Math.PI / 2;
        camGroup.add(shaft);

        // 8 Egg-shaped cam lobes
        cylXs.forEach((cx) => {
          [-0.09, 0.09].forEach((lx) => {
            const lobe = new THREE.Mesh(
              new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16),
              mats.titanium
            );
            lobe.rotation.z = Math.PI / 2;
            lobe.scale.set(1, 1, 1.35);
            lobe.position.set(cx + lx, 0.02, 0);
            camGroup.add(lobe);
          });
        });

        // Anodized timing sprocket at front
        const gear = new THREE.Mesh(
          createGearGeometry(20, 0.23, 0.19, 0.06, 0.07),
          mats.anodizedCyan
        );
        gear.rotation.z = Math.PI / 2;
        gear.position.set(1.32, 0, 0);
        camGroup.add(gear);

        group.add(camGroup);
        animatedParts[`cam_${camIdx}`] = camGroup;
      });
    } else if (partId === 'spark_coils') {
      // Valve cover bridge + 4 red ignition coil packs
      const cover = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.12, 0.96), mats.darkCast);
      cover.position.y = -0.08;
      group.add(cover);

      cylXs.forEach((cx) => {
        const plug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.28, 16),
          mats.ceramic
        );
        plug.position.set(cx, 0.02, 0);
        group.add(plug);

        const coil = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.13, 0.24),
          mats.anodizedRed
        );
        coil.position.set(cx, 0.18, 0);
        group.add(coil);
      });
    } else if (partId === 'turbo_manifold') {
      // 4 Exhaust runners merging to turbocharger snail
      cylXs.forEach((cx) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.62, 0.25, cx * 0.45),
          new THREE.Vector3(-0.22, 0.12, cx * 0.22),
          new THREE.Vector3(0, 0, 0),
        ]);
        const runner = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.075, 10, false), mats.copper);
        group.add(runner);
      });

      const turbineHousing = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.14, 14, 28),
        mats.darkCast
      );
      turbineHousing.rotation.y = Math.PI / 2;
      turbineHousing.position.set(0.05, 0, 0);
      group.add(turbineHousing);

      const compHousing = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.15, 14, 28),
        mats.forgedSteel
      );
      compHousing.rotation.y = Math.PI / 2;
      compHousing.position.set(0.36, 0, 0);
      group.add(compHousing);

      // Spinning CNC impeller wheel inside compressor
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0.45, 0, 0);
      const hub = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.18, 16), mats.anodizedCyan);
      hub.rotation.z = -Math.PI / 2;
      wheelGroup.add(hub);
      for (let b = 0; b < 8; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.19, 0.025), mats.forgedSteel);
        blade.rotation.x = (b / 8) * Math.PI * 2;
        wheelGroup.add(blade);
      }
      group.add(wheelGroup);
      animatedParts.turboWheel = wheelGroup;
    }
  }

  // ==================== MODEL 2: TOURBILLON WATCH CALIBER ====================
  else if (modelId === 'tourbillon_watch') {
    if (partId === 'watch_mainplate') {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 1.65, 0.18, 48),
        mats.titanium
      );
      group.add(plate);

      // Decorative recessed bezel ring
      const innerWell = new THREE.Mesh(
        new THREE.TorusGeometry(1.52, 0.09, 12, 48),
        mats.forgedSteel
      );
      innerWell.rotation.x = Math.PI / 2;
      innerWell.position.y = 0.09;
      group.add(innerWell);

      // Ruby jewel sockets
      [
        [-0.62, -0.25],
        [0.1, 0.08],
        [0.78, 0.16],
        [0, 0.72],
      ].forEach(([jx, jz]) => {
        const jewel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), mats.ruby);
        jewel.position.set(jx, 0.09, jz);
        group.add(jewel);
      });
    } else if (partId === 'mainspring_barrel') {
      const barrelGroup = new THREE.Group();
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.56, 0.56, 0.24, 32),
        mats.brassGold
      );
      barrelGroup.add(drum);
      const gearRing = new THREE.Mesh(
        createGearGeometry(28, 0.62, 0.56, 0.15, 0.07),
        mats.roseGold
      );
      gearRing.position.y = -0.05;
      barrelGroup.add(gearRing);

      // Ratchet wheel on top
      const ratchet = new THREE.Mesh(
        createGearGeometry(18, 0.36, 0.31, 0.08, 0.06),
        mats.forgedSteel
      );
      ratchet.position.y = 0.13;
      barrelGroup.add(ratchet);

      group.add(barrelGroup);
      animatedParts.barrel = barrelGroup;
    } else if (partId === 'gear_train') {
      const centerWheel = new THREE.Mesh(
        createGearGeometry(24, 0.54, 0.47, 0.16, 0.07),
        mats.roseGold
      );
      group.add(centerWheel);
      animatedParts.centerWheel = centerWheel;

      const thirdWheel = new THREE.Mesh(
        createGearGeometry(18, 0.36, 0.3, 0.1, 0.07),
        mats.brassGold
      );
      thirdWheel.position.set(0.45, 0.08, -0.35);
      group.add(thirdWheel);
      animatedParts.thirdWheel = thirdWheel;
    } else if (partId === 'ruby_escapement') {
      const escWheel = new THREE.Mesh(
        createGearGeometry(15, 0.32, 0.24, 0.08, 0.06),
        mats.anodizedCyan
      );
      group.add(escWheel);
      animatedParts.escWheel = escWheel;

      // Swiss lever fork with 2 ruby pallets
      const fork = new THREE.Group();
      fork.position.set(-0.34, 0.04, 0.12);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.035, 0.045), mats.forgedSteel);
      fork.add(arm);
      const pallet1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), mats.ruby);
      pallet1.position.set(0.15, 0, 0.06);
      fork.add(pallet1);
      const pallet2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), mats.ruby);
      pallet2.position.set(0.15, 0, -0.06);
      fork.add(pallet2);
      group.add(fork);
      animatedParts.palletFork = fork;
    } else if (partId === 'tourbillon_cage') {
      const cage = new THREE.Group();
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.035, 12, 32), mats.forgedSteel);
      rim.rotation.x = Math.PI / 2;
      cage.add(rim);

      for (let s = 0; s < 3; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.03, 0.045), mats.titanium);
        spoke.rotation.y = (s * Math.PI) / 3;
        cage.add(spoke);
      }

      // Oscillating gold balance wheel inside
      const balance = new THREE.Group();
      const balRim = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 10, 28), mats.roseGold);
      balRim.rotation.x = Math.PI / 2;
      balance.add(balRim);
      const balBar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.025, 0.04), mats.roseGold);
      balance.add(balBar);
      const hairspring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.012, 8, 24), mats.bluedSteel);
      hairspring.rotation.x = Math.PI / 2;
      hairspring.position.y = 0.04;
      balance.add(hairspring);
      cage.add(balance);

      const topRuby = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16), mats.ruby);
      topRuby.position.y = 0.06;
      cage.add(topRuby);

      group.add(cage);
      animatedParts.tourbillonCage = cage;
      animatedParts.balanceWheel = balance;
    } else if (partId === 'geneva_bridge') {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.08, 0.42), mats.roseGold);
      group.add(bar);

      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(0.54, 0.06, 10, 24, Math.PI),
        mats.roseGold
      );
      arch.rotation.x = Math.PI / 2;
      arch.position.set(0, 0, 0.35);
      group.add(arch);

      // Flame-blued screws
      [-1.0, -0.45, 0.45, 1.0].forEach((sx) => {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.1, 14),
          mats.bluedSteel
        );
        screw.position.set(sx, 0.03, 0);
        group.add(screw);
      });
    } else if (partId === 'hands_dial') {
      const chapter = new THREE.Mesh(
        new THREE.TorusGeometry(1.42, 0.12, 10, 48),
        mats.darkCast
      );
      chapter.rotation.x = Math.PI / 2;
      group.add(chapter);

      // 12 Hour indices
      for (let h = 0; h < 12; h++) {
        const ang = (h / 12) * Math.PI * 2;
        const idxMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.04, h % 3 === 0 ? 0.2 : 0.12),
          mats.forgedSteel
        );
        idxMesh.position.set(Math.sin(ang) * 1.38, 0.06, Math.cos(ang) * 1.38);
        idxMesh.rotation.y = ang;
        group.add(idxMesh);
      }

      // Hour, Minute, Second hands
      const hourHand = new THREE.Group();
      const hBlade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.72), mats.bluedSteel);
      hBlade.position.z = -0.32;
      hourHand.add(hBlade);
      group.add(hourHand);

      const minHand = new THREE.Group();
      minHand.position.y = 0.04;
      const mBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 1.08), mats.bluedSteel);
      mBlade.position.z = -0.48;
      minHand.add(mBlade);
      group.add(minHand);

      const secHand = new THREE.Group();
      secHand.position.y = 0.08;
      const sBlade = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 1.24), mats.anodizedRed);
      sBlade.position.z = -0.5;
      secHand.add(sBlade);
      group.add(secHand);

      animatedParts.hourHand = hourHand;
      animatedParts.minHand = minHand;
      animatedParts.secHand = secHand;
    } else if (partId === 'sapphire_bezel') {
      const bezel = new THREE.Mesh(
        new THREE.TorusGeometry(1.66, 0.16, 16, 48),
        mats.forgedSteel
      );
      bezel.rotation.x = Math.PI / 2;
      group.add(bezel);

      // Winding crown at 3 o'clock
      const crown = new THREE.Mesh(
        createGearGeometry(14, 0.2, 0.17, 0.05, 0.18),
        mats.forgedSteel
      );
      crown.rotation.z = Math.PI / 2;
      crown.position.set(1.86, -0.15, 0);
      group.add(crown);

      // Domed Sapphire glass crystal
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.52, 1.54, 0.06, 48),
        mats.sapphireGlass
      );
      glass.position.y = 0.08;
      glass.renderOrder = 10;
      group.add(glass);
    }
  }

  // ==================== MODEL 3: FPV RACING DRONE ====================
  else if (modelId === 'fpv_drone') {
    const motorOffsets: [number, number][] = [
      [-1.15, -1.15],
      [1.15, -1.15],
      [-1.15, 1.15],
      [1.15, 1.15],
    ];

    if (partId === 'carbon_frame') {
      // Bottom 3K carbon X-frame
      const arm1 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.34), mats.carbon);
      arm1.rotation.y = Math.PI / 4;
      group.add(arm1);

      const arm2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.34), mats.carbon);
      arm2.rotation.y = -Math.PI / 4;
      group.add(arm2);

      const centerDeck = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.09, 1.4), mats.carbon);
      group.add(centerDeck);

      // 4 Red anodized aluminum standoffs
      [
        [-0.36, -0.46],
        [0.36, -0.46],
        [-0.36, 0.46],
        [0.36, 0.46],
      ].forEach(([sx, sz]) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.48, 12),
          mats.anodizedRed
        );
        post.position.set(sx, 0.28, sz);
        group.add(post);
      });
    } else if (partId === 'fc_esc_stack') {
      const escBoard = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.76), mats.pcbGreen);
      group.add(escBoard);

      const fcBoard = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.72), mats.pcbGreen);
      fcBoard.position.y = 0.14;
      group.add(fcBoard);

      const mcuChip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.24), mats.mattePoly);
      mcuChip.position.y = 0.18;
      group.add(mcuChip);

      // Gold solder pads
      [-0.28, 0.28].forEach((px) => {
        [-0.28, 0.28].forEach((pz) => {
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), mats.brassGold);
          pad.position.set(px, 0.02, pz);
          group.add(pad);
        });
      });
    } else if (partId === 'brushless_motors') {
      motorOffsets.forEach(([mx, mz]) => {
        const mGroup = new THREE.Group();
        mGroup.position.set(mx, 0, mz);

        const stator = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 18), mats.copper);
        mGroup.add(stator);

        const bell = new THREE.Mesh(
          new THREE.CylinderGeometry(0.23, 0.23, 0.14, 24),
          mats.anodizedCyan
        );
        bell.position.y = 0.14;
        mGroup.add(bell);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 12), mats.forgedSteel);
        shaft.position.y = 0.26;
        mGroup.add(shaft);

        group.add(mGroup);
      });
    } else if (partId === 'gimbal_camera') {
      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.36), mats.titanium);
      group.add(housing);

      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 24), mats.mattePoly);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0, 0.22);
      group.add(barrel);

      const lens = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        mats.sapphireGlass
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.28);
      group.add(lens);
    } else if (partId === 'lipo_battery') {
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.34, 1.15), mats.mattePoly);
      group.add(pack);

      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.71, 0.36, 0.18), mats.orangeAccent);
      group.add(strap);

      const xt60 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.18), mats.brassGold);
      xt60.position.set(0.22, -0.05, 0.64);
      group.add(xt60);
    } else if (partId === 'aero_canopy') {
      const shell = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.14, 1.28), mats.carbon);
      group.add(shell);

      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.56), mats.anodizedRed);
      fin.position.set(0, 0.14, -0.2);
      group.add(fin);

      // 5.8GHz Pagoda antenna mast
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 12), mats.copper);
      mast.position.set(0, 0.22, -0.56);
      mast.rotation.x = -0.3;
      group.add(mast);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.12, 16), mats.anodizedRed);
      cap.position.set(0, 0.42, -0.63);
      group.add(cap);
    } else if (partId === 'propellers') {
      motorOffsets.forEach(([mx, mz], idx) => {
        const propGroup = new THREE.Group();
        propGroup.position.set(mx, 0, mz);

        const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 16), mats.forgedSteel);
        spinner.position.y = 0.05;
        propGroup.add(spinner);

        const bladeMat = idx === 0 || idx === 3 ? mats.anodizedCyan : mats.orangeAccent;
        for (let b = 0; b < 3; b++) {
          const bladePivot = new THREE.Group();
          bladePivot.rotation.y = (b * Math.PI * 2) / 3;
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.016, 0.11), bladeMat);
          blade.position.x = 0.4;
          blade.rotation.x = idx === 0 || idx === 3 ? 0.18 : -0.18;
          bladePivot.add(blade);
          propGroup.add(bladePivot);
        }

        group.add(propGroup);
        animatedParts[`prop_${idx}`] = propGroup;
      });
    }
  }

  // ==================== MODEL 4: PLANETARY GEARBOX ====================
  else if (modelId === 'planetary_gearbox') {
    const planetRadius = 0.72;

    if (partId === 'ring_housing') {
      const ringGeo = createInternalRingGearGeometry(36, 1.56, 1.02, 1.14, 0.56);
      const ring = new THREE.Mesh(ringGeo, mats.darkCast);
      ring.position.y = 0.28;
      group.add(ring);

      // Base mounting flange
      const flange = new THREE.Mesh(
        new THREE.CylinderGeometry(1.78, 1.78, 0.14, 36),
        mats.titanium
      );
      flange.position.y = 0.04;
      group.add(flange);
    } else if (partId === 'sun_gear') {
      const sunGroup = new THREE.Group();
      const gear = new THREE.Mesh(
        createGearGeometry(12, 0.36, 0.27, 0.1, 0.42),
        mats.brassGold
      );
      sunGroup.add(gear);

      const inputShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.85, 18),
        mats.forgedSteel
      );
      inputShaft.position.y = -0.1;
      sunGroup.add(inputShaft);

      group.add(sunGroup);
      animatedParts.sunGear = sunGroup;
    } else if (partId === 'planet_gears') {
      const orbitContainer = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const ang = (i * Math.PI * 2) / 3;
        const pWrap = new THREE.Group();
        pWrap.position.set(Math.cos(ang) * planetRadius, 0, Math.sin(ang) * planetRadius);

        const pGear = new THREE.Mesh(
          createGearGeometry(12, 0.35, 0.26, 0.09, 0.4),
          mats.anodizedCyan
        );
        pWrap.add(pGear);

        const pin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.085, 0.085, 0.5, 16),
          mats.forgedSteel
        );
        pWrap.add(pin);

        orbitContainer.add(pWrap);
        animatedParts[`planet_${i}`] = pWrap;
      }
      group.add(orbitContainer);
      animatedParts.planetOrbit = orbitContainer;
    } else if (partId === 'planet_carrier') {
      const carrier = new THREE.Group();
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.12, 32),
        mats.forgedSteel
      );
      carrier.add(plate);

      for (let i = 0; i < 3; i++) {
        const ang = (i * Math.PI * 2) / 3;
        const boss = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.22, 16),
          mats.copper
        );
        boss.position.set(Math.cos(ang) * planetRadius, -0.06, Math.sin(ang) * planetRadius);
        carrier.add(boss);
      }

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.45, 24), mats.titanium);
      hub.position.y = 0.24;
      carrier.add(hub);

      group.add(carrier);
      animatedParts.carrier = carrier;
    } else if (partId === 'roller_bearing') {
      const outerRace = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 12, 32), mats.titanium);
      outerRace.rotation.x = Math.PI / 2;
      group.add(outerRace);

      const innerRace = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.06, 12, 32), mats.forgedSteel);
      innerRace.rotation.x = Math.PI / 2;
      group.add(innerRace);

      for (let b = 0; b < 12; b++) {
        const ang = (b * Math.PI * 2) / 12;
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), mats.forgedSteel);
        ball.position.set(Math.cos(ang) * 0.51, 0, Math.sin(ang) * 0.51);
        group.add(ball);
      }
    } else if (partId === 'output_cover') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.22, 14, 36), mats.castAlum);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.48, 1.56, 0.14, 36),
        mats.castAlum
      );
      disc.position.y = -0.04;
      group.add(disc);

      const outShaft = new THREE.Mesh(
        createGearGeometry(10, 0.28, 0.22, 0, 0.48),
        mats.anodizedCyan
      );
      outShaft.position.y = 0.24;
      group.add(outShaft);
      animatedParts.outputShaft = outShaft;
    } else if (partId === 'hex_bolts') {
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI * 2) / 6;
        const bx = Math.cos(ang) * 1.38;
        const bz = Math.sin(ang) * 1.38;

        const boltHead = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.12, 6),
          mats.anodizedRed
        );
        boltHead.position.set(bx, 0.04, bz);
        group.add(boltHead);

        const stem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.22, 10),
          mats.forgedSteel
        );
        stem.position.set(bx, -0.1, bz);
        group.add(stem);
      }
    }
  }

  enableShadows(group);
  return { group, animatedParts };
}

/** Build a translucent glowing wireframe/ghost clone for target snap slots */
export function buildGhostHologramClone(
  sourceGroup: THREE.Group,
  accentHex: string
): THREE.Group {
  const ghost = sourceGroup.clone();
  const holoMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accentHex),
    transparent: true,
    opacity: 0.24,
    wireframe: false,
    depthWrite: false,
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accentHex),
    transparent: true,
    opacity: 0.55,
    wireframe: true,
    depthWrite: false,
  });

  const meshes: THREE.Mesh[] = [];
  ghost.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh);
    }
  });

  for (const m of meshes) {
    m.castShadow = false;
    m.receiveShadow = false;
    m.material = holoMat;
    // Add subtle wireframe overlay child for technical CAD hologram outline
    const wire = new THREE.Mesh(m.geometry, wireMat);
    m.add(wire);
  }
  ghost.visible = false;
  return ghost;
}
