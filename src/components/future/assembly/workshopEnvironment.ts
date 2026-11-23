import * as THREE from 'three';

export type AuxPartKind =
  | 'cooling_fan'
  | 'pressure_gauge'
  | 'pulley_belt'
  | 'servo_actuator'
  | 'oil_cooler';

export interface AuxPartCatalogItem {
  kind: AuxPartKind;
  nameVi: string;
  nameEn: string;
  specVi: string;
  specEn: string;
  accentHex: string;
}

export const AUX_PART_CATALOG: AuxPartCatalogItem[] = [
  {
    kind: 'cooling_fan',
    nameVi: 'Quạt Tản Nhiệt 12V',
    nameEn: '12V Cooling Fan',
    specVi: '4500 RPM · Cánh khí động',
    specEn: '4500 RPM · Aero Impeller',
    accentHex: '#38bdf8',
  },
  {
    kind: 'pressure_gauge',
    nameVi: 'Đồng Hồ Áp Suất',
    nameEn: 'Analog Pressure Gauge',
    specVi: '0–12 Bar · Kim phản hồi',
    specEn: '0–12 Bar · Live Needle',
    accentHex: '#f59e0b',
  },
  {
    kind: 'pulley_belt',
    nameVi: 'Bánh Đà & Puly Truyền',
    nameEn: 'Drive Pulley Wheel',
    specVi: 'Nhôm CNC · Tỉ số 1:1',
    specEn: 'CNC Alloy · 1:1 Ratio',
    accentHex: '#10b981',
  },
  {
    kind: 'servo_actuator',
    nameVi: 'Động Cơ Servo Bước',
    nameEn: 'Stepper Servo Module',
    specVi: '4.2 N·m · Trục khía',
    specEn: '4.2 N·m · Splined Shaft',
    accentHex: '#a855f7',
  },
  {
    kind: 'oil_cooler',
    nameVi: 'Két Giải Nhiệt Nhôm',
    nameEn: 'Finned Heat Exchanger',
    specVi: '10 Cánh tản · Anodized',
    specEn: '10-Fin · Anodized Core',
    accentHex: '#f43f5e',
  },
];

export interface WorkshopEnvironmentHandle {
  group: THREE.Group;
  updateTheme: (isDark: boolean) => void;
  dispose: () => void;
}

function createWorkbenchSurfaceTexture(isDark: boolean, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#111a2e' : '#dbe4f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle brushed steel grain
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.06)' : 'rgba(15, 23, 42, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Engineering grid lines
    const step = 32;
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(2, 132, 199, 0.16)';
    for (let x = 0; x <= canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Calibration ticks along front edge
    ctx.strokeStyle = isDark ? 'rgba(248, 250, 252, 0.35)' : 'rgba(15, 23, 42, 0.45)';
    ctx.fillStyle = isDark ? 'rgba(226, 232, 240, 0.55)' : 'rgba(30, 41, 59, 0.65)';
    ctx.font = 'bold 14px monospace';
    for (let i = 0; i <= 32; i++) {
      const x = i * step;
      const tall = i % 4 === 0 ? 18 : 9;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height - 8);
      ctx.lineTo(x, canvas.height - 8 - tall);
      ctx.stroke();
      if (i % 4 === 0 && i > 0 && i < 32) {
        ctx.fillText(`${(i - 16) * 25}mm`, x - 20, canvas.height - 32);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  return tex;
}

export function buildWorkshopEnvironment(
  isDark: boolean,
  maxAnisotropy: number,
  isSoftwareGl: boolean
): WorkshopEnvironmentHandle {
  const group = new THREE.Group();

  let surfaceTex = createWorkbenchSurfaceTexture(isDark, maxAnisotropy);
  const benchTopMat = new THREE.MeshStandardMaterial({
    map: surfaceTex,
    roughness: 0.48,
    metalness: 0.32,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x1e293b : 0x64748b,
    roughness: 0.36,
    metalness: 0.72,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x060b16 : 0xe2e8f0,
    roughness: 0.85,
    metalness: 0.08,
  });

  const rotaryMat = new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x0f172a : 0xcbd5e1,
    metalness: 0.78,
    roughness: 0.24,
    clearcoat: 0.5,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    metalness: 0.6,
  });

  // Main studio floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(42, 42), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.35;
  floor.receiveShadow = !isSoftwareGl;
  group.add(floor);

  // Workbench surface top sits cleanly at y = -0.70
  const benchSlab = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.16, 5.4), benchTopMat);
  benchSlab.position.set(0, -0.78, 0);
  benchSlab.receiveShadow = !isSoftwareGl;
  group.add(benchSlab);

  // Bevelled steel perimeter apron
  const apron = new THREE.Mesh(new THREE.BoxGeometry(9.36, 0.1, 5.56), frameMat);
  apron.position.set(0, -0.89, 0);
  group.add(apron);

  // 4 Heavy corner steel legs
  const legGeo = new THREE.CylinderGeometry(0.11, 0.13, 1.46, 12);
  const legCoords: [number, number][] = [
    [-4.3, -2.4],
    [4.3, -2.4],
    [-4.3, 2.4],
    [4.3, 2.4],
  ];
  for (const [lx, lz] of legCoords) {
    const leg = new THREE.Mesh(legGeo, frameMat);
    leg.position.set(lx, -1.62, lz);
    group.add(leg);
  }

  // Central precision rotary inspection turntable (flush just above bench top)
  const rotaryBase = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.84, 0.06, 48), rotaryMat);
  rotaryBase.position.set(0, -0.68, 0);
  rotaryBase.receiveShadow = !isSoftwareGl;
  group.add(rotaryBase);

  const rotaryRing = new THREE.Mesh(new THREE.TorusGeometry(1.76, 0.025, 12, 64), rimMat);
  rotaryRing.rotation.x = Math.PI / 2;
  rotaryRing.position.set(0, -0.65, 0);
  group.add(rotaryRing);

  const updateTheme = (nextDark: boolean) => {
    const nextTex = createWorkbenchSurfaceTexture(nextDark, maxAnisotropy);
    benchTopMat.map = nextTex;
    benchTopMat.needsUpdate = true;
    surfaceTex.dispose();
    surfaceTex = nextTex;

    frameMat.color.setHex(nextDark ? 0x1e293b : 0x64748b);
    floorMat.color.setHex(nextDark ? 0x060b16 : 0xe2e8f0);
    rotaryMat.color.setHex(nextDark ? 0x0f172a : 0xcbd5e1);
  };

  const dispose = () => {
    surfaceTex.dispose();
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
        else m.material?.dispose();
      }
    });
  };

  return { group, updateTheme, dispose };
}

export function buildWorkbenchToolMesh(tool: 'wrench' | 'screwdriver'): THREE.Group {
  const group = new THREE.Group();
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.16,
  });

  if (tool === 'wrench') {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.72), chromeMat);
    handle.position.set(0, 0.02, 0.25);
    const jaw = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.036, 10, 24, Math.PI * 1.45), chromeMat);
    jaw.rotation.x = Math.PI / 2;
    jaw.rotation.z = Math.PI * 0.28;
    jaw.position.set(0, 0.02, -0.14);
    const tailRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.026, 8, 20), chromeMat);
    tailRing.rotation.x = Math.PI / 2;
    tailRing.position.set(0, 0.02, 0.62);
    group.add(handle, jaw, tailRing);
  } else {
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.55,
      metalness: 0.1,
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 12), chromeMat);
    shaft.position.y = 0.24;
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.07, 6), tipMat);
    tip.position.y = 0.035;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 14), gripMat);
    handle.position.y = 0.58;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.04, 14), tipMat);
    collar.position.y = 0.42;
    group.add(tip, shaft, collar, handle);
  }
  return group;
}

export function buildAuxiliaryPartMesh(
  kind: AuxPartKind,
  clippingPlanes: THREE.Plane[]
): { group: THREE.Group; rotor?: THREE.Object3D; needle?: THREE.Object3D } {
  const group = new THREE.Group();

  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.72,
    roughness: 0.32,
    clippingPlanes,
  });
  const alloyMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.88,
    roughness: 0.2,
    clippingPlanes,
  });

  if (kind === 'cooling_fan') {
    const shroud = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.18), housingMat);
    shroud.position.y = 0.31;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.03, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.25, clippingPlanes })
    );
    ring.position.set(0, 0.31, 0.08);

    const rotor = new THREE.Group();
    rotor.position.set(0, 0.31, 0.02);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16), alloyMat);
    hub.rotation.x = Math.PI / 2;
    rotor.add(hub);
    const bladeGeo = new THREE.BoxGeometry(0.18, 0.05, 0.015);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35, metalness: 0.2, clippingPlanes });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const b = new THREE.Mesh(bladeGeo, bladeMat);
      b.position.set(Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0);
      b.rotation.z = a;
      b.rotation.x = 0.4;
      rotor.add(b);
    }
    group.add(shroud, ring, rotor);
    return { group, rotor };
  }

  if (kind === 'pressure_gauge') {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.18, 16), alloyMat);
    stem.position.y = 0.09;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.13, 28), housingMat);
    body.rotation.x = Math.PI / 2;
    body.position.y = 0.42;
    const dial = new THREE.Mesh(
      new THREE.CircleGeometry(0.23, 28),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7, clippingPlanes })
    );
    dial.position.set(0, 0.42, 0.07);
    const needle = new THREE.Group();
    needle.position.set(0, 0.42, 0.08);
    const pointer = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.18, 0.01),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, clippingPlanes })
    );
    pointer.position.y = 0.065;
    needle.add(pointer);
    group.add(stem, body, dial, needle);
    return { group, needle };
  }

  if (kind === 'pulley_belt') {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.24), housingMat);
    bracket.position.y = 0.17;
    const rotor = new THREE.Group();
    rotor.position.set(0, 0.38, 0);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 28), alloyMat);
    const beltRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.285, 0.025, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6, clippingPlanes })
    );
    beltRing.rotation.x = Math.PI / 2;
    rotor.add(wheel, beltRing);
    group.add(bracket, rotor);
    return { group, rotor };
  }

  if (kind === 'servo_actuator') {
    const casing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), housingMat);
    casing.position.y = 0.19;
    const accentBand = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.06, 0.44),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.45, roughness: 0.3, clippingPlanes })
    );
    accentBand.position.y = 0.32;
    const rotor = new THREE.Group();
    rotor.position.set(0, 0.42, 0);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 16), alloyMat);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.08), alloyMat);
    arm.position.y = 0.08;
    rotor.add(shaft, arm);
    group.add(casing, accentBand, rotor);
    return { group, rotor };
  }

  // oil_cooler
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.18), alloyMat);
  core.position.y = 0.22;
  const finMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.7, roughness: 0.25, clippingPlanes });
  for (let i = -4; i <= 4; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.34, 0.21), finMat);
    fin.position.set(i * 0.07, 0.22, 0);
    group.add(fin);
  }
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.26), housingMat);
  footL.position.set(-0.28, 0.04, 0);
  const footR = footL.clone();
  footR.position.x = 0.28;
  group.add(core, footL, footR);
  return { group };
}
