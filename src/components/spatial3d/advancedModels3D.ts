import * as THREE from 'three';

export interface ExplodablePart {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
}

export interface DynamicModelRef {
  group: THREE.Group;
  explodables: ExplodablePart[];
  waveGeo?: THREE.PlaneGeometry;
  waveBaseZ?: Float32Array;
  atomElectrons?: {
    mesh: THREE.Object3D;
    ringRadius: number;
    tiltEuler: THREE.Euler;
    speed: number;
    phase: number;
  }[];
  sphereCutRing?: THREE.Mesh;
  // Advanced kinetic rig references
  turbofan?: {
    fanGroup: THREE.Group;
    coreGroup: THREE.Group;
    exhaustRing: THREE.Mesh;
    exhaustMat: THREE.MeshStandardMaterial;
  };
  solar?: {
    planets: {
      pivot: THREE.Group;
      mesh: THREE.Mesh;
      speed: number;
      phase: number;
      moonPivot?: THREE.Group;
    }[];
    sunCorona: THREE.Mesh;
  };
  robotArm?: {
    waist: THREE.Group;
    shoulder: THREE.Group;
    elbow: THREE.Group;
    wrist: THREE.Group;
    jawLeft: THREE.Mesh;
    jawRight: THREE.Mesh;
  };
  supercar?: {
    wheels: THREE.Group[];
    streamlines: { mesh: THREE.Mesh; baseX: number; speed: number; phase: number }[];
  };
  windTurbine?: {
    rotor: THREE.Group;
    coilMat: THREE.MeshStandardMaterial;
    waveRing: THREE.Mesh;
  };
  disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[] };
}

export interface BuilderMaterials {
  primary: THREE.Material;
  secondary: THREE.Material;
  highlight: THREE.Material;
  edge: THREE.LineBasicMaterial;
  glow: THREE.MeshStandardMaterial;
}

export function buildAdvancedModel(
  kind: 'turbofan' | 'solar_system' | 'robot_arm' | 'supercar_aero' | 'wind_turbine' | 'cable_bridge',
  mats: BuilderMaterials,
  paletteHex: number,
  paletteSecondaryHex: number,
  clipPlane: THREE.Plane,
  softwareGl: boolean
): Omit<DynamicModelRef, 'disposables'> & {
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
} {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
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
  const addPart = (mesh: THREE.Object3D, explodeDir: THREE.Vector3, addEdges = false) => {
    mesh.castShadow = !softwareGl;
    mesh.receiveShadow = !softwareGl;
    group.add(mesh);
    explodables.push({
      mesh,
      basePos: mesh.position.clone(),
      explodeDir: explodeDir.clone()
    });
    if (addEdges && mesh instanceof THREE.Mesh) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 24);
      trackGeo(edges);
      mesh.add(new THREE.LineSegments(edges, mats.edge));
    }
  };

  if (kind === 'turbofan') {
    const centerY = 2.05;

    // Grounded heavy test-stand pylon
    const standBaseGeo = trackGeo(new THREE.BoxGeometry(2.6, 0.22, 1.8));
    const standBase = new THREE.Mesh(standBaseGeo, mats.secondary);
    standBase.position.set(0, 0.11, 0);
    addPart(standBase, new THREE.Vector3(0, -0.5, 0), true);

    const pylonGeo = trackGeo(new THREE.BoxGeometry(0.45, 1.25, 1.1));
    const pylon = new THREE.Mesh(pylonGeo, mats.secondary);
    pylon.position.set(0, 0.85, 0);
    addPart(pylon, new THREE.Vector3(0, -0.35, 0), true);

    // Outer metallic nacelle intake lip via LatheGeometry
    const lathePts = [
      new THREE.Vector2(1.18, -1.55),
      new THREE.Vector2(1.42, -1.35),
      new THREE.Vector2(1.52, -0.5),
      new THREE.Vector2(1.48, 0.75),
      new THREE.Vector2(1.22, 1.55),
      new THREE.Vector2(1.06, 1.55),
      new THREE.Vector2(1.24, 0.4),
      new THREE.Vector2(1.22, -0.8),
      new THREE.Vector2(1.12, -1.52),
      new THREE.Vector2(1.18, -1.55)
    ];
    const nacelleGeo = trackGeo(new THREE.LatheGeometry(lathePts, 48));
    nacelleGeo.rotateZ(Math.PI / 2);
    const nacelleMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xcbd5e1,
        metalness: 0.82,
        roughness: 0.24,
        clearcoat: 0.7,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
    const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
    nacelle.position.set(0, centerY, 0);
    addPart(nacelle, new THREE.Vector3(0, 1.4, 0));

    // Titanium intake lip ring
    const lipGeo = trackGeo(new THREE.TorusGeometry(1.22, 0.08, 16, 48));
    lipGeo.rotateY(Math.PI / 2);
    const lipRing = new THREE.Mesh(lipGeo, mats.highlight);
    lipRing.position.set(-1.52, centerY, 0);
    addPart(lipRing, new THREE.Vector3(-1.3, 0.2, 0));

    // Main Front Fan Rotor Group (spinner cone + 16 angled titanium blades)
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-1.05, centerY, 0);

    const spinnerGeo = trackGeo(new THREE.ConeGeometry(0.4, 0.75, 28));
    spinnerGeo.rotateZ(Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, mats.glow);
    spinner.position.set(-0.32, 0, 0);
    fanGroup.add(spinner);

    const hubGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24));
    hubGeo.rotateZ(Math.PI / 2);
    fanGroup.add(new THREE.Mesh(hubGeo, mats.secondary));

    const bladeGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.82, 0.24));
    const bladeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.88,
        roughness: 0.22,
        clippingPlanes: [clipPlane]
      })
    );
    for (let i = 0; i < 16; i++) {
      const ang = (i * Math.PI * 2) / 16;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.x = ang;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, 0.76, 0);
      blade.rotation.y = 0.45;
      bladePivot.add(blade);
      fanGroup.add(bladePivot);
    }
    addPart(fanGroup, new THREE.Vector3(-0.9, 0, 0));

    // High-pressure compressor rotor + drive shaft
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0.15, centerY, 0);
    const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 2.2, 24));
    shaftGeo.rotateZ(Math.PI / 2);
    coreGroup.add(new THREE.Mesh(shaftGeo, mats.secondary));

    const stageBladeGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.56, 0.16));
    [-0.55, 0.0, 0.55].forEach((xOff, stIdx) => {
      const count = 12 - stIdx;
      for (let i = 0; i < count; i++) {
        const ang = (i * Math.PI * 2) / count;
        const p = new THREE.Group();
        p.position.x = xOff;
        p.rotation.x = ang;
        const b = new THREE.Mesh(stageBladeGeo, mats.primary);
        b.position.y = 0.52;
        b.rotation.y = -0.4;
        p.add(b);
        coreGroup.add(p);
      }
    });
    addPart(coreGroup, new THREE.Vector3(0.45, 0, 0));

    // Glowing Combustion Chamber & Exhaust Nozzle
    const exhaustMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xff5500,
        emissiveIntensity: 1.4,
        roughness: 0.25,
        metalness: 0.4,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane]
      })
    );
    const exhaustConeGeo = trackGeo(new THREE.CylinderGeometry(0.55, 0.85, 0.85, 28, 1, true));
    exhaustConeGeo.rotateZ(Math.PI / 2);
    const exhaustRing = new THREE.Mesh(exhaustConeGeo, exhaustMat);
    exhaustRing.position.set(1.45, centerY, 0);
    addPart(exhaustRing, new THREE.Vector3(1.25, 0, 0));

    return {
      group,
      explodables,
      geometries,
      materials,
      turbofan: { fanGroup, coreGroup, exhaustRing, exhaustMat }
    };
  }

  if (kind === 'solar_system') {
    const centerY = 2.05;

    // Grounded Brass Orrery Base & Central Support Column
    const baseGeo = trackGeo(new THREE.CylinderGeometry(1.5, 1.8, 0.22, 36));
    const baseMesh = new THREE.Mesh(baseGeo, mats.secondary);
    baseMesh.position.set(0, 0.11, 0);
    addPart(baseMesh, new THREE.Vector3(0, -0.6, 0));

    const colGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.22, centerY - 0.2, 20));
    const colMesh = new THREE.Mesh(colGeo, mats.secondary);
    colMesh.position.set(0, (centerY - 0.2) * 0.5 + 0.2, 0);
    addPart(colMesh, new THREE.Vector3(0, -0.3, 0));

    // Glowing Sun
    const sunGeo = trackGeo(new THREE.SphereGeometry(0.54, 32, 32));
    const sunMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfde047,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.65,
        roughness: 0.2,
        clippingPlanes: [clipPlane]
      })
    );
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, centerY, 0);
    addPart(sun, new THREE.Vector3(0, 0, 0));

    const coronaGeo = trackGeo(new THREE.TorusGeometry(0.68, 0.025, 12, 48));
    coronaGeo.rotateX(Math.PI / 2);
    const sunCorona = new THREE.Mesh(coronaGeo, mats.glow);
    sunCorona.position.set(0, centerY, 0);
    addPart(sunCorona, new THREE.Vector3(0, 0.35, 0));

    const planetSpecs = [
      { r: 0.95, size: 0.1, col: 0x94a3b8, speed: 2.3, phase: 0.4, hasMoon: false, hasRing: false },
      { r: 1.35, size: 0.14, col: 0xfbbf24, speed: 1.7, phase: 1.8, hasMoon: false, hasRing: false },
      { r: 1.8, size: 0.16, col: 0x38bdf8, speed: 1.25, phase: 3.1, hasMoon: true, hasRing: false },
      { r: 2.25, size: 0.13, col: 0xf87171, speed: 0.95, phase: 4.5, hasMoon: false, hasRing: false },
      { r: 2.85, size: 0.28, col: 0xfdba74, speed: 0.62, phase: 0.9, hasMoon: false, hasRing: false },
      { r: 3.5, size: 0.24, col: 0xfde68a, speed: 0.42, phase: 2.4, hasMoon: false, hasRing: true }
    ];

    const planets: NonNullable<DynamicModelRef['solar']>['planets'] = [];
    planetSpecs.forEach((sp, idx) => {
      const ringGeo = trackGeo(new THREE.TorusGeometry(sp.r, 0.014, 10, 72));
      ringGeo.rotateX(Math.PI / 2);
      const orbitRing = new THREE.Mesh(ringGeo, mats.primary);
      orbitRing.position.set(0, centerY, 0);
      addPart(orbitRing, new THREE.Vector3(0, (idx - 2) * 0.28, 0));

      const pivot = new THREE.Group();
      pivot.position.set(0, centerY, 0);

      const pGeo = trackGeo(new THREE.SphereGeometry(sp.size, 22, 22));
      const pMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: sp.col,
          roughness: 0.45,
          metalness: 0.2,
          emissive: sp.col,
          emissiveIntensity: 0.18,
          clippingPlanes: [clipPlane]
        })
      );
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(sp.r, 0, 0);
      pivot.add(pMesh);

      let moonPivot: THREE.Group | undefined;
      if (sp.hasMoon) {
        moonPivot = new THREE.Group();
        const mGeo = trackGeo(new THREE.SphereGeometry(0.048, 14, 14));
        const moon = new THREE.Mesh(mGeo, mats.highlight);
        moon.position.set(0.32, 0.04, 0);
        moonPivot.add(moon);
        pMesh.add(moonPivot);
      }

      if (sp.hasRing) {
        const satRingGeo = trackGeo(new THREE.RingGeometry(sp.size * 1.35, sp.size * 2.1, 36));
        satRingGeo.rotateX(Math.PI / 2 - 0.35);
        const satRingMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: 0xfde68a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.78,
            clippingPlanes: [clipPlane]
          })
        );
        pMesh.add(new THREE.Mesh(satRingGeo, satRingMat));
      }

      addPart(pivot, new THREE.Vector3(0, (idx - 2) * 0.28, 0));
      planets.push({ pivot, mesh: pMesh, speed: sp.speed, phase: sp.phase, moonPivot });
    });

    return {
      group,
      explodables,
      geometries,
      materials,
      solar: { planets, sunCorona }
    };
  }

  if (kind === 'robot_arm') {
    // Grounded circular heavy servo turret pedestal (y=0)
    const plinthGeo = trackGeo(new THREE.CylinderGeometry(1.15, 1.35, 0.26, 32));
    const plinth = new THREE.Mesh(plinthGeo, mats.secondary);
    plinth.position.set(0, 0.13, 0);
    addPart(plinth, new THREE.Vector3(0, -0.4, 0), true);

    const waist = new THREE.Group();
    waist.position.set(0, 0.26, 0);
    const waistDrumGeo = trackGeo(new THREE.CylinderGeometry(0.68, 0.78, 0.48, 28));
    const waistDrum = new THREE.Mesh(waistDrumGeo, mats.primary);
    waistDrum.position.y = 0.24;
    waist.add(waistDrum);

    const shoulderJointGeo = trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.72, 24));
    shoulderJointGeo.rotateX(Math.PI / 2);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, mats.glow);
    shoulderJoint.position.set(0, 0.52, 0);
    waist.add(shoulderJoint);

    // Shoulder Boom Group
    const shoulder = new THREE.Group();
    shoulder.position.set(0, 0.52, 0);

    const lowerBoomGeo = trackGeo(new THREE.BoxGeometry(0.32, 1.55, 0.32));
    const lowerBoom = new THREE.Mesh(lowerBoomGeo, mats.primary);
    lowerBoom.position.y = 0.78;
    shoulder.add(lowerBoom);

    // Hydraulic side piston
    const pistonGeo = trackGeo(new THREE.CylinderGeometry(0.07, 0.09, 1.15, 14));
    const piston = new THREE.Mesh(pistonGeo, mats.highlight);
    piston.position.set(-0.24, 0.65, 0);
    shoulder.add(piston);

    // Elbow Joint & Forearm
    const elbow = new THREE.Group();
    elbow.position.set(0, 1.56, 0);

    const elbowServoGeo = trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.56, 20));
    elbowServoGeo.rotateX(Math.PI / 2);
    elbow.add(new THREE.Mesh(elbowServoGeo, mats.glow));

    const forearmGeo = trackGeo(new THREE.BoxGeometry(0.24, 1.35, 0.24));
    const forearm = new THREE.Mesh(forearmGeo, mats.secondary);
    forearm.position.y = 0.68;
    elbow.add(forearm);

    // Wrist gimbal + Dual-Jaw Mechanical Gripper
    const wrist = new THREE.Group();
    wrist.position.set(0, 1.38, 0);

    const wristRingGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.2, 0.22, 18));
    wrist.add(new THREE.Mesh(wristRingGeo, mats.glow));

    const jawGeo = trackGeo(new THREE.BoxGeometry(0.07, 0.42, 0.14));
    const jawLeft = new THREE.Mesh(jawGeo, mats.highlight);
    jawLeft.position.set(-0.14, 0.28, 0);
    jawLeft.rotation.z = -0.15;

    const jawRight = new THREE.Mesh(jawGeo, mats.highlight);
    jawRight.position.set(0.14, 0.28, 0);
    jawRight.rotation.z = 0.15;

    const tipLaserGeo = trackGeo(new THREE.SphereGeometry(0.08, 16, 16));
    const tipLaser = new THREE.Mesh(tipLaserGeo, mats.glow);
    tipLaser.position.set(0, 0.24, 0);

    wrist.add(jawLeft, jawRight, tipLaser);
    elbow.add(wrist);
    shoulder.add(elbow);
    waist.add(shoulder);
    addPart(waist, new THREE.Vector3(0, 0.55, 0));

    return {
      group,
      explodables,
      geometries,
      materials,
      robotArm: { waist, shoulder, elbow, wrist, jawLeft, jawRight }
    };
  }

  if (kind === 'supercar_aero') {
    // Wind-tunnel rotating turntable disc grounded at y=0
    const deckGeo = trackGeo(new THREE.CylinderGeometry(2.8, 2.95, 0.14, 48));
    const deck = new THREE.Mesh(deckGeo, mats.secondary);
    deck.position.set(0, 0.07, 0);
    addPart(deck, new THREE.Vector3(0, -0.5, 0));

    // Aerodynamic Supercar Profile via ExtrudeGeometry with bevels
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-2.15, 0.18);
    bodyShape.lineTo(2.15, 0.18);
    bodyShape.lineTo(2.22, 0.45);
    bodyShape.lineTo(1.75, 0.68);
    bodyShape.quadraticCurveTo(0.85, 0.78, 0.42, 1.08);
    bodyShape.lineTo(-0.55, 1.12);
    bodyShape.quadraticCurveTo(-1.35, 0.85, -2.0, 0.75);
    bodyShape.lineTo(-2.18, 0.42);
    bodyShape.closePath();

    const chassisGeo = trackGeo(
      new THREE.ExtrudeGeometry(bodyShape, {
        depth: 1.56,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.08,
        bevelSegments: 4
      })
    );
    chassisGeo.translate(0, 0.18, -0.78);
    const chassis = new THREE.Mesh(chassisGeo, mats.primary);
    addPart(chassis, new THREE.Vector3(0, 0.65, 0), true);

    // Tinted Glass Canopy Dome
    const canopyGeo = trackGeo(new THREE.SphereGeometry(0.68, 28, 20));
    canopyGeo.scale(1.65, 0.52, 0.92);
    const canopyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.2,
        roughness: 0.06,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.82,
        clippingPlanes: [clipPlane]
      })
    );
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(-0.08, 1.16, 0);
    addPart(canopy, new THREE.Vector3(0, 1.45, 0));

    // Carbon Rear GT Wing
    const wingBladeGeo = trackGeo(new THREE.BoxGeometry(0.46, 0.06, 1.85));
    const wingBlade = new THREE.Mesh(wingBladeGeo, mats.secondary);
    wingBlade.position.set(-1.92, 1.28, 0);
    wingBlade.rotation.z = -0.14;
    addPart(wingBlade, new THREE.Vector3(-0.7, 1.1, 0), true);

    const wingPylonGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.42, 0.06));
    [-0.45, 0.45].forEach((zOff) => {
      const p = new THREE.Mesh(wingPylonGeo, mats.glow);
      p.position.set(-1.86, 1.06, zOff);
      addPart(p, new THREE.Vector3(-0.5, 0.8, 0));
    });

    // Headlight & Taillight LED Bars
    const lightBarGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.08, 1.35));
    const frontLed = new THREE.Mesh(lightBarGeo, mats.glow);
    frontLed.position.set(2.2, 0.52, 0);
    addPart(frontLed, new THREE.Vector3(0.8, 0.3, 0));

    const rearLed = new THREE.Mesh(lightBarGeo, mats.glow);
    rearLed.position.set(-2.22, 0.72, 0);
    addPart(rearLed, new THREE.Vector3(-0.8, 0.3, 0));

    // 4 Multi-part Alloy Wheels
    const wheels: THREE.Group[] = [];
    const tireGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.26, 26));
    tireGeo.rotateX(Math.PI / 2);
    const rimGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.28, 12));
    rimGeo.rotateX(Math.PI / 2);

    const wheelCoords: [number, number][] = [
      [1.36, 0.86],
      [1.36, -0.86],
      [-1.36, 0.86],
      [-1.36, -0.86]
    ];
    wheelCoords.forEach(([wx, wz]) => {
      const wg = new THREE.Group();
      wg.position.set(wx, 0.48, wz);
      wg.add(new THREE.Mesh(tireGeo, mats.secondary));
      wg.add(new THREE.Mesh(rimGeo, mats.glow));
      addPart(wg, new THREE.Vector3(Math.sign(wx) * 0.45, -0.1, Math.sign(wz) * 0.65));
      wheels.push(wg);
    });

    // Wind-tunnel aerodynamic airflow streamlines arching over car
    const streamlines: NonNullable<DynamicModelRef['supercar']>['streamlines'] = [];
    const streamGeo = trackGeo(new THREE.BoxGeometry(0.55, 0.025, 0.025));
    const streamMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: paletteHex,
        transparent: true,
        opacity: 0.75,
        clippingPlanes: [clipPlane]
      })
    );
    for (let i = 0; i < 16; i++) {
      const zLane = ((i % 4) - 1.5) * 0.42;
      const sm = new THREE.Mesh(streamGeo, streamMat);
      sm.position.set(0, 1.45, zLane);
      group.add(sm);
      streamlines.push({
        mesh: sm,
        baseX: (Math.floor(i / 4) - 1.5) * 1.4,
        speed: 3.4 + (i % 3) * 0.5,
        phase: i * 0.45
      });
    }

    return {
      group,
      explodables,
      geometries,
      materials,
      supercar: { wheels, streamlines }
    };
  }

  if (kind === 'wind_turbine') {
    // Floating Ocean Foundation & Wave Ring
    const seaGeo = trackGeo(new THREE.CylinderGeometry(2.1, 2.3, 0.14, 48));
    const sea = new THREE.Mesh(seaGeo, mats.secondary);
    sea.position.set(0, 0.07, 0);
    addPart(sea, new THREE.Vector3(0, -0.5, 0));

    const waveRingGeo = trackGeo(new THREE.TorusGeometry(1.4, 0.03, 12, 48));
    waveRingGeo.rotateX(Math.PI / 2);
    const waveRing = new THREE.Mesh(waveRingGeo, mats.glow);
    waveRing.position.set(0, 0.16, 0);
    group.add(waveRing);

    // Tapered Steel Monopole Tower
    const towerGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.34, 2.95, 24));
    const tower = new THREE.Mesh(towerGeo, mats.primary);
    tower.position.set(0, 1.62, 0);
    addPart(tower, new THREE.Vector3(0, -0.25, 0), true);

    // Internal Copper Generator Coils (visible when nacelle cover explodes upward!)
    const coilMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.85,
        metalness: 0.75,
        roughness: 0.25,
        clippingPlanes: [clipPlane]
      })
    );
    const genGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.65, 20));
    genGeo.rotateX(Math.PI / 2);
    const generator = new THREE.Mesh(genGeo, coilMat);
    generator.position.set(0, 3.22, -0.1);
    addPart(generator, new THREE.Vector3(0, 0, -0.6));

    // Outer Nacelle Housing Hood (explodes upward cleanly)
    const nacelleGeo = trackGeo(new THREE.BoxGeometry(0.62, 0.56, 1.15));
    const nacelle = new THREE.Mesh(nacelleGeo, mats.secondary);
    nacelle.position.set(0, 3.24, -0.15);
    addPart(nacelle, new THREE.Vector3(0, 1.25, 0), true);

    // 3-Blade Airfoil Rotor Hub
    const rotor = new THREE.Group();
    rotor.position.set(0, 3.24, 0.56);
    const noseGeo = trackGeo(new THREE.ConeGeometry(0.22, 0.45, 20));
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, mats.glow);
    nose.position.z = 0.2;
    rotor.add(nose);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.16, 0.35);
    bladeShape.lineTo(0.06, 1.75);
    bladeShape.lineTo(-0.04, 1.75);
    bladeShape.lineTo(-0.08, 0.35);
    bladeShape.closePath();

    const bladeGeo = trackGeo(
      new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2
      })
    );
    for (let i = 0; i < 3; i++) {
      const bPivot = new THREE.Group();
      bPivot.rotation.z = (i * Math.PI * 2) / 3;
      const blade = new THREE.Mesh(bladeGeo, mats.highlight);
      blade.rotation.y = 0.22;
      bPivot.add(blade);
      rotor.add(bPivot);
    }
    addPart(rotor, new THREE.Vector3(0, 0, 0.9));

    return {
      group,
      explodables,
      geometries,
      materials,
      windTurbine: { rotor, coilMat, waveRing }
    };
  }

  // kind === 'cable_bridge' (Cable-Stayed Suspension Bridge)
  const deckGeo = trackGeo(new THREE.BoxGeometry(6.6, 0.16, 1.15));
  const deck = new THREE.Mesh(deckGeo, mats.secondary);
  deck.position.set(0, 1.15, 0);
  addPart(deck, new THREE.Vector3(0, -0.4, 0), true);

  // Center lane glow stripe
  const laneGeo = trackGeo(new THREE.BoxGeometry(6.5, 0.03, 0.08));
  const lane = new THREE.Mesh(laneGeo, mats.glow);
  lane.position.set(0, 1.24, 0);
  addPart(lane, new THREE.Vector3(0, -0.2, 0));

  // Dual Concrete Piers & Diamond Steel Pylons at x = -1.65 and +1.65
  const pierGeo = trackGeo(new THREE.BoxGeometry(0.55, 1.1, 1.45));
  const legGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 2.55, 12));
  const crossBeamGeo = trackGeo(new THREE.BoxGeometry(0.18, 0.14, 0.95));

  [-1.65, 1.65].forEach((tx) => {
    const pier = new THREE.Mesh(pierGeo, mats.secondary);
    pier.position.set(tx, 0.55, 0);
    addPart(pier, new THREE.Vector3(Math.sign(tx) * 0.4, -0.5, 0), true);

    const pylonGroup = new THREE.Group();
    pylonGroup.position.set(tx, 1.15, 0);

    const leftLeg = new THREE.Mesh(legGeo, mats.primary);
    leftLeg.position.set(0, 1.25, -0.34);
    leftLeg.rotation.x = 0.13;
    pylonGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, mats.primary);
    rightLeg.position.set(0, 1.25, 0.34);
    rightLeg.rotation.x = -0.13;
    pylonGroup.add(rightLeg);

    const cross = new THREE.Mesh(crossBeamGeo, mats.glow);
    cross.position.set(0, 1.45, 0);
    pylonGroup.add(cross);

    const capGeo = trackGeo(new THREE.OctahedronGeometry(0.18));
    const cap = new THREE.Mesh(capGeo, mats.glow);
    cap.position.set(0, 2.52, 0);
    pylonGroup.add(cap);

    addPart(pylonGroup, new THREE.Vector3(0, 1.1, 0));

    // 12 Steel Stay Cables per pylon (6 left + 6 right, mirrored front/back)
    const cableMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: paletteSecondaryHex,
        emissive: paletteHex,
        emissiveIntensity: 0.35,
        metalness: 0.8,
        roughness: 0.25,
        clippingPlanes: [clipPlane]
      })
    );
    const towerTop = new THREE.Vector3(tx, 3.55, 0);
    const anchors = [-1.4, -0.95, -0.5, 0.5, 0.95, 1.4];
    anchors.forEach((dx) => {
      [-0.48, 0.48].forEach((zOff) => {
        const deckPt = new THREE.Vector3(tx + dx, 1.2, zOff);
        const dir = new THREE.Vector3().subVectors(deckPt, towerTop);
        const len = dir.length();
        const cableGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, len, 6));
        const cable = new THREE.Mesh(cableGeo, cableMat);
        cable.position.copy(towerTop).lerp(deckPt, 0.5);
        cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        addPart(cable, new THREE.Vector3(0, 0.45, Math.sign(zOff) * 0.45));
      });
    });
  });

  return { group, explodables, geometries, materials };
}

export function updateAdvancedKinematics(
  model: DynamicModelRef,
  dt: number,
  elapsed: number,
  simSpeed: number,
  heightVal: number,
  frozen: boolean,
  cursorTarget: { x: number; y: number; z: number },
  isPinching: boolean
): void {
  if (model.turbofan && !frozen) {
    const rpm = (2.8 + heightVal * 4.2) * simSpeed;
    model.turbofan.fanGroup.rotation.x += dt * rpm;
    model.turbofan.coreGroup.rotation.x -= dt * rpm * 1.45;
    model.turbofan.exhaustMat.emissiveIntensity =
      0.8 + heightVal * 0.85 + Math.sin(elapsed * 12) * 0.15;
  }

  if (model.solar && !frozen) {
    model.solar.sunCorona.rotation.z += dt * 0.8 * simSpeed;
    for (const p of model.solar.planets) {
      p.pivot.rotation.y = elapsed * p.speed * simSpeed * 0.55 + p.phase;
      p.mesh.rotation.y += dt * 1.2 * simSpeed;
      if (p.moonPivot) {
        p.moonPivot.rotation.y += dt * 3.2 * simSpeed;
      }
    }
  }

  if (model.robotArm) {
    // Live Inverse-Kinematics-inspired tracking toward hand cursor Oxyz!
    const targetWaist = Math.atan2(cursorTarget.x, Math.max(0.8, cursorTarget.z + 2.2));
    const targetShoulder = THREE.MathUtils.clamp((1.8 - cursorTarget.y) * 0.34, -0.75, 0.75);
    const targetElbow = THREE.MathUtils.clamp(-0.65 - (cursorTarget.y - 1.5) * 0.28, -1.5, -0.2);

    model.robotArm.waist.rotation.y = THREE.MathUtils.damp(
      model.robotArm.waist.rotation.y,
      frozen ? model.robotArm.waist.rotation.y : targetWaist,
      8,
      dt
    );
    model.robotArm.shoulder.rotation.z = THREE.MathUtils.damp(
      model.robotArm.shoulder.rotation.z,
      frozen ? model.robotArm.shoulder.rotation.z : targetShoulder,
      8,
      dt
    );
    model.robotArm.elbow.rotation.z = THREE.MathUtils.damp(
      model.robotArm.elbow.rotation.z,
      frozen ? model.robotArm.elbow.rotation.z : targetElbow,
      8,
      dt
    );

    const jawOpen = isPinching ? 0.055 : 0.16;
    model.robotArm.jawLeft.position.x = THREE.MathUtils.damp(
      model.robotArm.jawLeft.position.x,
      -jawOpen,
      14,
      dt
    );
    model.robotArm.jawRight.position.x = THREE.MathUtils.damp(
      model.robotArm.jawRight.position.x,
      jawOpen,
      14,
      dt
    );
  }

  if (model.supercar && !frozen) {
    const windSpeed = (1.8 + heightVal * 2.4) * simSpeed;
    for (const w of model.supercar.wheels) {
      w.rotation.z -= dt * windSpeed * 2.6;
    }
    for (const s of model.supercar.streamlines) {
      const t = ((elapsed * s.speed * (0.6 + heightVal * 0.5) + s.phase) % 5.6) - 2.8;
      // Flow from front (+2.8) to rear (-2.8) arching cleanly over car roof!
      const x = -t;
      const roofProfile = Math.exp(-Math.pow((x + 0.1) / 1.35, 2)) * 0.85;
      s.mesh.position.x = x;
      s.mesh.position.y = 0.78 + roofProfile + (s.phase % 0.45);
      s.mesh.rotation.z = -x * 0.14 * roofProfile;
    }
  }

  if (model.windTurbine && !frozen) {
    const windRpm = (1.6 + heightVal * 2.8) * simSpeed;
    model.windTurbine.rotor.rotation.z -= dt * windRpm;
    model.windTurbine.coilMat.emissiveIntensity = 0.4 + heightVal * 0.85;
    const pulse = 1 + ((elapsed * 0.7) % 1) * 0.55;
    model.windTurbine.waveRing.scale.set(pulse, pulse, 1);
  }
}
