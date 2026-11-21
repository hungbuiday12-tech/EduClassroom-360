import * as THREE from 'three';

export type AuxPartKind = 'aux_fan' | 'aux_gauge' | 'aux_bolts' | 'aux_sensor' | 'aux_filter';

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
    kind: 'aux_fan',
    nameVi: 'Quạt Tản Nhiệt CNC',
    nameEn: 'CNC Cooling Fan Module',
    specVi: 'Rotor 7 cánh · Làm mát cưỡng bức',
    specEn: '7-Blade Impeller · Active Cooling',
    accentHex: '#0ea5e9',
  },
  {
    kind: 'aux_gauge',
    nameVi: 'Đồng Hồ Áp Suất 10 Bar',
    nameEn: 'Hydraulic Pressure Gauge',
    specVi: 'Thang đo 0–10 Bar · Kim chỉ thị thực',
    specEn: '0–10 Bar Dial · Live Needle',
    accentHex: '#f59e0b',
  },
  {
    kind: 'aux_bolts',
    nameVi: 'Cụm Bu-Lông & Bích M8',
    nameEn: 'M8 Hex Flange Bolt Pack',
    specVi: '4 Bu-lông thép rèn · Siết bằng Cờ lê',
    specEn: '4× Forged Hex Bolts · Wrench Ready',
    accentHex: '#ef4444',
  },
  {
    kind: 'aux_sensor',
    nameVi: 'Cảm Biến & Puly Đai Răng',
    nameEn: 'Thermal Sensor & Pulley',
    specVi: 'Cảm biến NTC · Puly đồng bộ quay',
    specEn: 'NTC Probe · Synced Belt Pulley',
    accentHex: '#10b981',
  },
  {
    kind: 'aux_filter',
    nameVi: 'Bộ Lọc Dầu Cao Áp',
    nameEn: 'Spin-On High-Flow Oil Filter',
    specVi: 'Vỏ rãnh tản nhiệt · Gioăng Viton',
    specEn: 'Fluted Cartridge · Viton Gasket',
    accentHex: '#a855f7',
  },
];

export interface WorkshopEnvironmentHandle {
  group: THREE.Group;
  updateTheme: (isDark: boolean) => void;
  dispose: () => void;
}

function createTiledWorkshopFloorTexture(isDark: boolean, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#0e1726' : '#dce3ec';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle epoxy speckled concrete finish
    for (let i = 0; i < 1800; i++) {
      const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const ry = (Math.sin(i * 78.233) * 19341.123) % 1;
      const x = Math.abs(rx) * 512;
      const y = Math.abs(ry) * 512;
      ctx.fillStyle =
        i % 3 === 0
          ? isDark
            ? 'rgba(148,163,184,0.06)'
            : 'rgba(15,23,42,0.05)'
          : isDark
          ? 'rgba(2,6,23,0.16)'
          : 'rgba(255,255,255,0.22)';
      ctx.fillRect(x, y, 2, 2);
    }

    // Tile seams (2x2 industrial epoxy concrete slabs per repeat)
    ctx.strokeStyle = isDark ? 'rgba(51,65,85,0.55)' : 'rgba(100,116,139,0.32)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, 253, 253);
    ctx.strokeRect(257.5, 1.5, 253, 253);
    ctx.strokeRect(1.5, 257.5, 253, 253);
    ctx.strokeRect(257.5, 257.5, 253, 253);

    // Precision crosshair calibration ticks at tile intersections
    ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.24)' : 'rgba(14,116,144,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(244, 256);
    ctx.lineTo(268, 256);
    ctx.moveTo(256, 244);
    ctx.lineTo(256, 268);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  return tex;
}

function createSafetyMatTexture(isDark: boolean, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#111827' : '#cbd5e1';
    ctx.fillRect(0, 0, 512, 512);

    // Hazard stripe border around perimeter
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, 512, 512);
    ctx.rect(24, 24, 464, 464);
    ctx.clip('evenodd');
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 18;
    for (let i = -512; i < 1024; i += 36) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
    ctx.restore();

    // Inner rubber ESD mat crosshatch
    ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.12)' : 'rgba(30,41,59,0.12)';
    ctx.lineWidth = 1.5;
    for (let x = 48; x < 480; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 36);
      ctx.lineTo(x, 476);
      ctx.stroke();
    }
    for (let y = 48; y < 480; y += 32) {
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(476, y);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  return tex;
}

function createBenchDeckTexture(isDark: boolean, maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#182234' : '#cbd5e1';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle brushed steel horizontal streaks
    for (let y = 0; y < 512; y += 3) {
      ctx.fillStyle =
        y % 6 === 0
          ? isDark
            ? 'rgba(255,255,255,0.018)'
            : 'rgba(255,255,255,0.14)'
          : isDark
          ? 'rgba(0,0,0,0.08)'
          : 'rgba(15,23,42,0.03)';
      ctx.fillRect(0, y, 1024, 1);
    }

    // Etched engineering ruler border + calibration lines
    ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.34)' : 'rgba(15,23,42,0.28)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 984, 472);

    // Millimeter ruler ticks along front edge
    ctx.fillStyle = isDark ? 'rgba(56,189,248,0.55)' : 'rgba(15,23,42,0.55)';
    for (let x = 40; x <= 984; x += 16) {
      const major = (x - 40) % 80 === 0;
      ctx.fillRect(x, 470, 2, major ? 18 : 9);
    }

    // Center bay alignment crosshairs
    ctx.strokeStyle = isDark ? 'rgba(245,158,11,0.38)' : 'rgba(217,119,6,0.38)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(512, 256, 165, 0, Math.PI * 2);
    ctx.stroke();

    // Left / Right staging zone corner brackets
    const zones = [140, 884];
    zones.forEach((zx) => {
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.35)' : 'rgba(51,65,85,0.35)';
      ctx.strokeRect(zx - 75, 160, 150, 192);
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, Math.max(1, maxAnisotropy));
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 124);
    grad.addColorStop(0, 'rgba(2,6,23,0.55)');
    grad.addColorStop(0.55, 'rgba(2,6,23,0.22)');
    grad.addColorStop(1, 'rgba(2,6,23,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGaugeDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Scale ticks from 135deg to 405deg
    for (let i = 0; i <= 10; i++) {
      const ang = ((135 + i * 27) * Math.PI) / 180;
      const rIn = i % 2 === 0 ? 82 : 92;
      const rOut = 108;
      ctx.strokeStyle = i >= 8 ? '#dc2626' : '#0f172a';
      ctx.lineWidth = i % 2 === 0 ? 5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(ang) * rIn, 128 + Math.sin(ang) * rIn);
      ctx.lineTo(128 + Math.cos(ang) * rOut, 128 + Math.sin(ang) * rOut);
      ctx.stroke();
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BAR', 128, 184);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildWorkshopEnvironment(
  initialDark: boolean,
  maxAnisotropy: number,
  isSoftwareGl: boolean
): WorkshopEnvironmentHandle {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const FLOOR_Y = -1.58;
  const BENCH_TOP_Y = -0.70;
  const TURNTABLE_TOP_Y = -0.60;

  let floorTex = createTiledWorkshopFloorTexture(initialDark, maxAnisotropy);
  let matTex = createSafetyMatTexture(initialDark, maxAnisotropy);
  let deckTex = createBenchDeckTexture(initialDark, maxAnisotropy);
  const shadowTex = createContactShadowTexture();
  disposables.push(shadowTex);

  // 1. Industrial Epoxied Tiled Workshop Floor
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.78,
    metalness: 0.14,
  });
  const floorGeo = new THREE.PlaneGeometry(54, 54);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = FLOOR_Y;
  floorMesh.receiveShadow = !isSoftwareGl;
  group.add(floorMesh);
  disposables.push(floorGeo, floorMat);

  // 2. Anti-Static Safety Perimeter Floor Mat under Workbench
  const safetyMat = new THREE.MeshStandardMaterial({
    map: matTex,
    roughness: 0.85,
    metalness: 0.08,
  });
  const safetyGeo = new THREE.PlaneGeometry(10.8, 6.8);
  const safetyMesh = new THREE.Mesh(safetyGeo, safetyMat);
  safetyMesh.rotation.x = -Math.PI / 2;
  safetyMesh.position.y = FLOOR_Y + 0.02;
  safetyMesh.receiveShadow = !isSoftwareGl;
  group.add(safetyMesh);
  disposables.push(safetyGeo, safetyMat);

  // 3. Heavy Steel Workbench Top Deck (spans X: [-4.4, +4.4], Z: [-2.6, +2.6])
  const benchW = 8.8;
  const benchD = 5.2;
  const benchH = 0.16;
  const frameMat = new THREE.MeshStandardMaterial({
    color: initialDark ? 0x1e293b : 0x475569,
    metalness: 0.72,
    roughness: 0.38,
  });
  const trimAccentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.45,
    roughness: 0.35,
  });
  const deckMat = new THREE.MeshStandardMaterial({
    map: deckTex,
    metalness: 0.62,
    roughness: 0.34,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xdbe4ee,
    metalness: 0.9,
    roughness: 0.22,
  });

  const deckGeo = new THREE.BoxGeometry(benchW, benchH, benchD);
  const deckMesh = new THREE.Mesh(deckGeo, deckMat);
  deckMesh.position.y = BENCH_TOP_Y - benchH / 2;
  deckMesh.receiveShadow = !isSoftwareGl;
  deckMesh.castShadow = !isSoftwareGl;
  group.add(deckMesh);
  disposables.push(deckGeo, deckMat, frameMat, trimAccentMat, steelMat);

  // Front & rear steel edge lip trim rails
  const railGeo = new THREE.BoxGeometry(benchW + 0.08, 0.05, 0.07);
  [-benchD / 2, benchD / 2].forEach((rz) => {
    const rail = new THREE.Mesh(railGeo, trimAccentMat);
    rail.position.set(0, BENCH_TOP_Y - 0.03, rz);
    group.add(rail);
  });
  disposables.push(railGeo);

  // 4 Steel Legs + Cross-Struts + Rubber Feet resting flush on FLOOR_Y
  const legHeight = BENCH_TOP_Y - benchH - FLOOR_Y;
  const legGeo = new THREE.BoxGeometry(0.22, legHeight, 0.22);
  const footGeo = new THREE.CylinderGeometry(0.18, 0.21, 0.06, 16);
  const footMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.2,
    roughness: 0.85,
  });
  const legPositions: [number, number][] = [
    [-benchW / 2 + 0.35, -benchD / 2 + 0.35],
    [benchW / 2 - 0.35, -benchD / 2 + 0.35],
    [-benchW / 2 + 0.35, benchD / 2 - 0.35],
    [benchW / 2 - 0.35, benchD / 2 - 0.35],
  ];
  legPositions.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, frameMat);
    leg.position.set(lx, FLOOR_Y + legHeight / 2, lz);
    leg.castShadow = !isSoftwareGl;
    group.add(leg);

    const foot = new THREE.Mesh(footGeo, footMat);
    foot.position.set(lx, FLOOR_Y + 0.03, lz);
    group.add(foot);
  });

  // Lower horizontal structural tie beams
  const longBeamGeo = new THREE.BoxGeometry(benchW - 0.7, 0.1, 0.1);
  [-benchD / 2 + 0.35, benchD / 2 - 0.35].forEach((bz) => {
    const beam = new THREE.Mesh(longBeamGeo, frameMat);
    beam.position.set(0, FLOOR_Y + 0.28, bz);
    group.add(beam);
  });
  disposables.push(legGeo, footGeo, footMat, longBeamGeo);

  // 4. Precision Rotary Assembly Turntable Plate at Center
  const ttHeight = TURNTABLE_TOP_Y - BENCH_TOP_Y;
  const ttGeo = new THREE.CylinderGeometry(2.15, 2.32, ttHeight, 48);
  const ttMat = new THREE.MeshStandardMaterial({
    color: initialDark ? 0x0f172a : 0xe2e8f0,
    metalness: 0.65,
    roughness: 0.3,
  });
  const ttMesh = new THREE.Mesh(ttGeo, ttMat);
  ttMesh.position.y = BENCH_TOP_Y + ttHeight / 2;
  ttMesh.receiveShadow = !isSoftwareGl;
  group.add(ttMesh);

  const rimGeo = new THREE.TorusGeometry(2.18, 0.025, 10, 64);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0369a1,
    emissiveIntensity: 0.45,
    metalness: 0.5,
    roughness: 0.25,
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = TURNTABLE_TOP_Y;
  group.add(rimMesh);

  // Contact shadow disc under central turntable / hero model
  const shadowGeo = new THREE.PlaneGeometry(4.9, 4.9);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = BENCH_TOP_Y + 0.008;
  group.add(shadowDisc);
  disposables.push(ttGeo, ttMat, rimGeo, rimMat, shadowGeo, shadowMat);

  // 5. Realistic Miniature Workshop Tool Stand on Rear-Left Bench Corner
  const standGroup = new THREE.Group();
  standGroup.position.set(-3.65, BENCH_TOP_Y, -2.05);
  const standBaseGeo = new THREE.BoxGeometry(1.15, 0.08, 0.52);
  const standBase = new THREE.Mesh(standBaseGeo, frameMat);
  standBase.position.y = 0.04;
  standGroup.add(standBase);

  const rackBackGeo = new THREE.BoxGeometry(1.1, 0.55, 0.06);
  const rackBack = new THREE.Mesh(rackBackGeo, frameMat);
  rackBack.position.set(0, 0.31, -0.2);
  standGroup.add(rackBack);

  // Miniature hex keys & bolt tray resting inside organizer
  for (let i = 0; i < 4; i++) {
    const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 8), steelMat);
    keyShaft.position.set(-0.35 + i * 0.14, 0.28, -0.11);
    standGroup.add(keyShaft);
  }
  const cupGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.14, 18);
  const cupMesh = new THREE.Mesh(cupGeo, trimAccentMat);
  cupMesh.position.set(0.35, 0.11, 0.06);
  standGroup.add(cupMesh);
  group.add(standGroup);
  disposables.push(standBaseGeo, rackBackGeo, cupGeo);

  // 6. Calibration Ruler Block on Rear-Right Bench Corner
  const calBlockGeo = new THREE.BoxGeometry(0.85, 0.07, 0.42);
  const calBlock = new THREE.Mesh(calBlockGeo, frameMat);
  calBlock.position.set(3.7, BENCH_TOP_Y + 0.035, -2.05);
  group.add(calBlock);
  disposables.push(calBlockGeo);

  return {
    group,
    updateTheme: (isDark: boolean) => {
      const oldFloor = floorTex;
      const oldMat = matTex;
      const oldDeck = deckTex;
      floorTex = createTiledWorkshopFloorTexture(isDark, maxAnisotropy);
      matTex = createSafetyMatTexture(isDark, maxAnisotropy);
      deckTex = createBenchDeckTexture(isDark, maxAnisotropy);

      floorMat.map = floorTex;
      floorMat.needsUpdate = true;
      safetyMat.map = matTex;
      safetyMat.needsUpdate = true;
      deckMat.map = deckTex;
      deckMat.needsUpdate = true;

      frameMat.color.setHex(isDark ? 0x1e293b : 0x475569);
      ttMat.color.setHex(isDark ? 0x0f172a : 0xe2e8f0);

      oldFloor.dispose();
      oldMat.dispose();
      oldDeck.dispose();
    },
    dispose: () => {
      floorTex.dispose();
      matTex.dispose();
      deckTex.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}

/** Build an interactive 3D animated tool (Wrench or Screwdriver) */
export function buildWorkbenchToolMesh(tool: 'wrench' | 'screwdriver'): THREE.Group {
  const g = new THREE.Group();
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.94,
    roughness: 0.16,
  });
  const handleMat = new THREE.MeshStandardMaterial({
    color: tool === 'wrench' ? 0xf59e0b : 0x0ea5e9,
    metalness: 0.25,
    roughness: 0.48,
  });
  const darkGripMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.15,
    roughness: 0.72,
  });

  if (tool === 'wrench') {
    // Open-end spanner positioned horizontally so jaw pivots right at origin (0,0,0)
    const jawRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.045, 10, 24, Math.PI * 1.45),
      chromeMat
    );
    jawRing.rotation.x = Math.PI / 2;
    jawRing.rotation.z = 0.7;
    g.add(jawRing);

    const shank = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.11), chromeMat);
    shank.position.set(0.52, 0, 0);
    g.add(shank);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.075, 0.14), handleMat);
    grip.position.set(0.76, 0, 0);
    g.add(grip);
  } else {
    // Precision screwdriver aligned vertically with tip at origin (0,0,0)
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.032, 0.14, 6), chromeMat);
    tip.position.y = 0.07;
    g.add(tip);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.42, 14), chromeMat);
    shaft.position.y = 0.34;
    g.add(shaft);

    const bolster = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.06, 0.08, 16), darkGripMat);
    bolster.position.y = 0.56;
    g.add(bolster);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.46, 12), handleMat);
    handle.position.y = 0.82;
    g.add(handle);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), darkGripMat);
    cap.position.y = 1.05;
    g.add(cap);
  }

  return g;
}

export interface BuiltAuxPartResult {
  group: THREE.Group;
  rotor?: THREE.Object3D;
  needle?: THREE.Object3D;
}

/** Build composite 3D hardware modules spawned with "Thêm Bộ Phận" */
export function buildAuxiliaryPartMesh(
  kind: AuxPartKind,
  clippingPlanes: THREE.Plane[]
): BuiltAuxPartResult {
  const g = new THREE.Group();

  const makeMat = (params: THREE.MeshStandardMaterialParameters) => {
    const m = new THREE.MeshStandardMaterial({
      ...params,
      clippingPlanes,
      clipShadows: true,
    });
    return m;
  };

  const alumMat = makeMat({ color: 0x94a3b8, metalness: 0.78, roughness: 0.32 });
  const darkMat = makeMat({ color: 0x1e293b, metalness: 0.55, roughness: 0.48 });
  const steelMat = makeMat({ color: 0xdbe4ee, metalness: 0.92, roughness: 0.18 });
  const brassMat = makeMat({ color: 0xf59e0b, metalness: 0.9, roughness: 0.22 });
  const cyanMat = makeMat({ color: 0x0ea5e9, metalness: 0.72, roughness: 0.25 });
  const redMat = makeMat({ color: 0xef4444, metalness: 0.65, roughness: 0.3 });
  const purpleMat = makeMat({ color: 0x9333ea, metalness: 0.5, roughness: 0.36 });
  const orangeMat = makeMat({ color: 0xf97316, metalness: 0.25, roughness: 0.45 });

  let rotor: THREE.Object3D | undefined;
  let needle: THREE.Object3D | undefined;

  if (kind === 'aux_fan') {
    // 1. CNC Aluminum Cooling Fan Module (origin y=0 sits flush on workbench)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.18, 0.76), darkMat);
    frame.position.y = 0.09;
    g.add(frame);

    const shroud = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 10, 28), alumMat);
    shroud.rotation.x = Math.PI / 2;
    shroud.position.y = 0.18;
    g.add(shroud);

    // 4 Corner mounting hex bolts
    [-0.31, 0.31].forEach((bx) => {
      [-0.31, 0.31].forEach((bz) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 6), steelMat);
        bolt.position.set(bx, 0.11, bz);
        g.add(bolt);
      });
    });

    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 0.16;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 18), steelMat);
    rotorGroup.add(hub);

    for (let b = 0; b < 7; b++) {
      const bladePivot = new THREE.Group();
      bladePivot.rotation.y = (b * Math.PI * 2) / 7;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.018, 0.08), cyanMat);
      blade.position.x = 0.17;
      blade.rotation.x = 0.35;
      bladePivot.add(blade);
      rotorGroup.add(bladePivot);
    }
    g.add(rotorGroup);
    rotor = rotorGroup;
  } else if (kind === 'aux_gauge') {
    // 2. Vertical Brass Hydraulic Pressure Gauge
    const baseHex = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.14, 6), brassMat);
    baseHex.position.y = 0.07;
    g.add(baseHex);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16), steelMat);
    stem.position.y = 0.22;
    g.add(stem);

    const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 28), brassMat);
    caseBody.rotation.x = Math.PI / 2;
    caseBody.position.y = 0.56;
    g.add(caseBody);

    const dialTex = createGaugeDialTexture();
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.35,
      metalness: 0.05,
      clippingPlanes,
    });
    const dialFace = new THREE.Mesh(new THREE.CircleGeometry(0.28, 28), dialMat);
    dialFace.position.set(0, 0.56, 0.084);
    g.add(dialFace);

    const needlePivot = new THREE.Group();
    needlePivot.position.set(0, 0.56, 0.095);
    const needleBlade = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.21, 0.015), redMat);
    needleBlade.position.y = 0.07;
    needlePivot.add(needleBlade);
    needlePivot.rotation.z = 0.7;
    g.add(needlePivot);
    needle = needlePivot;
  } else if (kind === 'aux_bolts') {
    // 3. CNC Flange Block with 4 Hex Flange Bolts
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.68), alumMat);
    plate.position.y = 0.06;
    g.add(plate);

    const centerCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.18, 20), darkMat);
    centerCollar.position.y = 0.15;
    g.add(centerCollar);

    [-0.22, 0.22].forEach((bx) => {
      [-0.22, 0.22].forEach((bz) => {
        const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.025, 16), brassMat);
        washer.position.set(bx, 0.13, bz);
        g.add(washer);

        const hexHead = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 6), redMat);
        hexHead.position.set(bx, 0.19, bz);
        g.add(hexHead);
      });
    });
  } else if (kind === 'aux_sensor') {
    // 4. Thermal Sensor Pod & Synchronized Belt Pulley
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.44), darkMat);
    bracket.position.y = 0.06;
    g.add(bracket);

    const probeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 18), cyanMat);
    probeBody.position.set(-0.16, 0.25, 0);
    g.add(probeBody);

    const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 14), brassMat);
    connector.position.set(-0.16, 0.46, 0);
    g.add(connector);

    const pulleyGroup = new THREE.Group();
    pulleyGroup.position.set(0.16, 0.28, 0);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 24), steelMat);
    wheel.rotation.x = Math.PI / 2;
    pulleyGroup.add(wheel);

    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.022, 8, 24), orangeMat);
    pulleyGroup.add(groove);
    g.add(pulleyGroup);
    rotor = pulleyGroup;
  } else {
    // 5. High-Flow Spin-On Oil Filter
    const manifold = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.1, 24), alumMat);
    manifold.position.y = 0.05;
    g.add(manifold);

    const gasket = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 10, 24), orangeMat);
    gasket.rotation.x = Math.PI / 2;
    gasket.position.y = 0.11;
    g.add(gasket);

    const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.56, 24), darkMat);
    canister.position.y = 0.4;
    g.add(canister);

    const topRing = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.09, 12), purpleMat);
    topRing.position.y = 0.65;
    g.add(topRing);
  }

  g.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });

  return { group: g, rotor, needle };
}
