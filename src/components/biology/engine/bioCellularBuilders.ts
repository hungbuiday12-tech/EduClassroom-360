import * as THREE from 'three';
import { BioMaterialVault } from './bioMaterials';

export interface BioSceneHookContext {
  vault: BioMaterialVault;
  isLowEnd: boolean;
  explodeRef: { current: number };
  xrayRef: { current: boolean };
  modeParamsRef: { current: Record<string, number> };
  expFlagsRef: { current: Record<string, boolean | number> };
  interactables: THREE.Object3D[];
  animatedTickers: Array<(t: number, dt: number) => void>;
  mendelPresetRef?: { current: 'monohybrid' | 'dihybrid' | 'testcross' };
  addLabel?: (
    text: string,
    pos: [number, number, number],
    color?: number,
    anchorPos?: [number, number, number]
  ) => THREE.Object3D;
  removeLabel?: (obj: THREE.Object3D) => void;
}

export function tagBioPart(obj: THREE.Object3D, partId: string, partLabel: string) {
  obj.userData.partId = partId;
  obj.userData.partLabel = partLabel;
  obj.traverse((child) => {
    child.userData.partId = partId;
    child.userData.partLabel = partLabel;
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

function makeSculptedBlob(
  rx: number,
  ry: number,
  rz: number,
  segW = 24,
  segH = 18,
  deform?: (v: THREE.Vector3, n: THREE.Vector3) => void
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, segW, segH);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.copy(v).normalize();
    v.set(v.x * rx, v.y * ry, v.z * rz);
    if (deform) deform(v, n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function makeTube(
  pts: Array<[number, number, number]>,
  r: number,
  tubSeg = 24,
  radSeg = 10
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  return new THREE.TubeGeometry(curve, tubSeg, r, radSeg, false);
}

/**
 * Builds Topic A (Cellular Biology & Molecular Genetics) upgraded 3D scenes.
 * Returns true if `mode` was handled.
 */
export function buildCellularBiologyScene(
  mode: string,
  root: THREE.Group,
  ctx: BioSceneHookContext
): boolean {
  const { vault, isLowEnd, explodeRef, xrayRef, modeParamsRef, expFlagsRef, interactables, animatedTickers } = ctx;
  const seg = isLowEnd ? 14 : 24;

  // =========================================================================
  // 1. EUKARYOTIC CELL (Animal & Plant Cutaway with PBR Organelles)
  // =========================================================================
  if (mode === 'eukaryotic_cell_3d') {
    const cellShellMat = vault.createUniqueMaterial('lipid_membrane', {
      color: 0x2dd4bf,
      opacity: 0.24,
      transparent: true,
      side: THREE.DoubleSide
    });
    const wallMat = vault.createUniqueMaterial('plant_epidermis', {
      color: 0x16a34a,
      opacity: 0.28,
      transparent: true,
      side: THREE.DoubleSide
    });

    // Cutaway plasma membrane bowl (phiLength 1.45*PI leaves crisp front cutaway window)
    const plasmaBowl = new THREE.Mesh(
      new THREE.SphereGeometry(2.15, seg + 8, seg, 0, Math.PI * 1.48, 0, Math.PI),
      cellShellMat
    );
    plasmaBowl.rotation.y = 0.72;
    root.add(plasmaBowl);

    // Plant cell polygonal cellulose outer wall
    const plantWallGroup = new THREE.Group();
    const wallPrism = new THREE.Mesh(
      new THREE.CylinderGeometry(2.42, 2.42, 2.95, 6, 1, true, 0, Math.PI * 1.42),
      wallMat
    );
    wallPrism.rotation.y = 0.65;
    const wallFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.42, 2.42, 0.14, 6), wallMat);
    wallFloor.position.y = -1.48;
    plantWallGroup.add(wallPrism, wallFloor);
    root.add(plantWallGroup);

    // Nucleus + Nuclear Pores + Nucleolus (cutaway 3/4 sphere)
    const nucleusGrp = new THREE.Group();
    nucleusGrp.position.set(-0.22, 0.22, -0.15);
    const nucEnv = new THREE.Mesh(
      new THREE.SphereGeometry(0.76, seg, seg, 0, Math.PI * 1.5),
      vault.getMaterial('protein_globular', { color: 0x6366f1, side: THREE.DoubleSide })
    );
    nucEnv.rotation.y = 0.7;
    const nucleolus = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 16, 14),
      vault.getMaterial('endocrine_gland', { color: 0xec4899 })
    );
    // Chromatin loops inside nucleus
    const chromatin = new THREE.Mesh(
      makeTube(
        [
          [-0.35, 0.15, 0.1],
          [-0.1, 0.35, -0.2],
          [0.25, 0.1, 0.15],
          [0.05, -0.25, 0.22],
          [-0.25, -0.1, -0.2]
        ],
        0.025,
        24,
        8
      ),
      vault.getMaterial('nerve_myelin', { color: 0xfde047 })
    );
    // Nuclear pore rings
    for (let i = 0; i < 10; i++) {
      const th = (i / 10) * Math.PI * 1.3 + 0.85;
      const ph = 0.9 + ((i % 3) - 1) * 0.45;
      const pore = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.015, 6, 12),
        vault.getMaterial('compact_bone', { color: 0xa5b4fc })
      );
      pore.position.setFromSphericalCoords(0.77, ph, th);
      pore.lookAt(0, 0, 0);
      nucleusGrp.add(pore);
    }
    nucleusGrp.add(nucEnv, nucleolus, chromatin);
    tagBioPart(nucleusGrp, 'nucleus', 'Nhân & Hạch nhân');
    root.add(nucleusGrp);
    interactables.push(nucleusGrp);

    // Rough Endoplasmic Reticulum (stacked curved cisternal folds + ribosomes)
    const rerGrp = new THREE.Group();
    rerGrp.position.set(-0.22, 0.22, -0.15);
    const rerMat = vault.getMaterial('gastric_mucosa', { color: 0x38bdf8, side: THREE.DoubleSide });
    const riboMat = vault.getMaterial('endocrine_gland', { color: 0xfbbf24 });
    for (let layer = 0; layer < 4; layer++) {
      const r = 0.92 + layer * 0.14;
      const arc = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r * 0.96, 0.42 - layer * 0.04, 18, 1, true, 1.0, Math.PI * 0.72),
        rerMat
      );
      arc.position.y = -0.12 + layer * 0.03;
      rerGrp.add(arc);
      for (let k = 0; k < 5; k++) {
        const ang = 1.15 + k * 0.42;
        const ribo = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), riboMat);
        ribo.position.set(Math.sin(ang) * (r + 0.02), -0.12 + (k % 2) * 0.14, Math.cos(ang) * (r + 0.02));
        rerGrp.add(ribo);
      }
    }
    tagBioPart(rerGrp, 'rough_er', 'Lưới nội chất hạt (RER)');
    root.add(rerGrp);
    interactables.push(rerGrp);

    // Golgi Apparatus (5 curved flattened pancakes + secretory vesicles)
    const golgiGrp = new THREE.Group();
    golgiGrp.position.set(0.95, -0.42, 0.72);
    golgiGrp.rotation.y = -0.45;
    const golgiMat = vault.getMaterial('endocrine_gland', { color: 0xf59e0b });
    for (let i = 0; i < 5; i++) {
      const cisterna = new THREE.Mesh(
        makeSculptedBlob(0.36 - i * 0.035, 0.055, 0.2, 16, 10, (v) => {
          v.y += Math.pow(v.x * 1.4, 2) * 0.35;
        }),
        golgiMat
      );
      cisterna.position.y = (i - 2) * 0.095;
      golgiGrp.add(cisterna);
    }
    for (let v = 0; v < 4; v++) {
      const ves = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), golgiMat);
      ves.position.set(0.38 + v * 0.07, (v - 1.5) * 0.1, 0.08 * Math.sin(v));
      golgiGrp.add(ves);
    }
    tagBioPart(golgiGrp, 'golgi', 'Bộ máy Golgi');
    root.add(golgiGrp);
    interactables.push(golgiGrp);

    // Mitochondria (2 detailed cutaway bean organelles with cristae)
    const mitoGrp = new THREE.Group();
    mitoGrp.position.set(-1.15, -0.58, 0.65);
    mitoGrp.rotation.set(0.2, 0.4, 0.35);
    const mitoOuterMat = vault.getMaterial('cardiac_muscle', {
      color: 0xe11d48,
      opacity: 0.78,
      transparent: true,
      side: THREE.DoubleSide
    });
    const mitoInnerMat = vault.getMaterial('endocrine_gland', { color: 0xfb923c });
    const mitoHull = new THREE.Mesh(makeSculptedBlob(0.46, 0.22, 0.24, 18, 12), mitoOuterMat);
    const cristaRibbon = new THREE.Mesh(
      makeTube(
        [
          [-0.32, 0, 0.06],
          [-0.22, 0.1, -0.06],
          [-0.1, -0.1, 0.08],
          [0.02, 0.1, -0.08],
          [0.14, -0.1, 0.06],
          [0.26, 0.08, -0.05],
          [0.34, 0, 0.04]
        ],
        0.045,
        28,
        8
      ),
      mitoInnerMat
    );
    mitoGrp.add(mitoHull, cristaRibbon);
    tagBioPart(mitoGrp, 'mitochondrion', 'Ti thể (Mitochondrion)');
    root.add(mitoGrp);
    interactables.push(mitoGrp);

    // Chloroplast + Vacuole (Plant Mode)
    const chloroGrp = new THREE.Group();
    chloroGrp.position.set(1.12, 0.48, 0.45);
    chloroGrp.rotation.set(-0.2, -0.35, -0.25);
    const chloroShell = new THREE.Mesh(
      makeSculptedBlob(0.48, 0.2, 0.28, 16, 12),
      vault.getMaterial('chloroplast_membrane', { opacity: 0.55, transparent: true })
    );
    chloroGrp.add(chloroShell);
    const thylaMat = vault.getMaterial('chloroplast_membrane', { color: 0x22c55e });
    for (let g = 0; g < 3; g++) {
      for (let d = 0; d < 4; d++) {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 14), thylaMat);
        disc.position.set((g - 1) * 0.22, (d - 1.5) * 0.045, 0);
        chloroGrp.add(disc);
      }
    }
    const vacuole = new THREE.Mesh(
      makeSculptedBlob(0.65, 0.52, 0.58, 16, 12),
      vault.getMaterial('lipid_membrane', { color: 0x38bdf8, opacity: 0.35, transparent: true })
    );
    vacuole.position.set(-0.15, -0.82, 0.65);
    chloroGrp.add(vacuole);
    tagBioPart(chloroGrp, 'chloroplast', 'Lục lạp & Không bào (Thực vật)');
    root.add(chloroGrp);
    interactables.push(chloroGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const isPlant = expFlagsRef.current.plantMode !== false;
      const act = (modeParamsRef.current.activity ?? 70) / 70;
      const xRay = xrayRef.current;

      plantWallGroup.visible = isPlant;
      chloroGrp.visible = isPlant;
      cellShellMat.opacity = xRay ? 0.1 : 0.26;
      wallMat.opacity = xRay ? 0.1 : 0.28;

      nucleusGrp.position.set(-0.22, 0.22 + exp * 0.95, -0.15);
      rerGrp.position.set(-0.22 - exp * 0.45, 0.22 + exp * 0.35, -0.15);
      golgiGrp.position.set(0.95 + exp * 0.65, -0.42 - exp * 0.25, 0.72 + exp * 0.45);
      mitoGrp.position.set(-1.15 - exp * 0.65, -0.58, 0.65 + exp * 0.4);
      mitoGrp.rotation.z = 0.35 + Math.sin(t * 1.4 * act) * 0.06;
      chloroGrp.position.set(1.12 + exp * 0.7, 0.48 + exp * 0.4, 0.45);
    });
    return true;
  }

  // =========================================================================
  // 2. DNA DOUBLE HELIX & RNA TRANSCRIPTION
  // =========================================================================
  if (mode === 'dna_double_helix_3d') {
    const numBp = 22;
    const strand1Pts: Array<[number, number, number]> = [];
    const strand2Pts: Array<[number, number, number]> = [];
    const rnaPts: Array<[number, number, number]> = [];

    const backboneGrp = new THREE.Group();
    const atGrp = new THREE.Group();
    const gcGrp = new THREE.Group();
    const helicaseGrp = new THREE.Group();
    const rnaGrp = new THREE.Group();

    const b1Mat = vault.getMaterial('lipid_membrane', { color: 0x0284c7 });
    const b2Mat = vault.getMaterial('arterial_vessel', { color: 0xe11d48 });
    const aMat = vault.getMaterial('plant_epidermis', { color: 0x22c55e });
    const tMat = vault.getMaterial('endocrine_gland', { color: 0xf59e0b });
    const gMat = vault.getMaterial('protein_globular', { color: 0x6366f1 });
    const cMat = vault.getMaterial('lipid_membrane', { color: 0x06b6d4 });
    const hBondMat = vault.getMaterial('compact_bone', { color: 0xe2e8f0 });
    const rnaMat = vault.getMaterial('endocrine_gland', { color: 0xf97316 });

    const pairMeshes: Array<{
      leftHalf: THREE.Mesh;
      rightHalf: THREE.Mesh;
      hBonds: THREE.Mesh[];
      y: number;
      ang: number;
      isGc: boolean;
    }> = [];

    for (let i = 0; i < numBp; i++) {
      const t = i / (numBp - 1);
      const y = (t - 0.5) * 4.4;
      const ang = t * Math.PI * 3.8;
      const radius = 0.78;
      strand1Pts.push([Math.cos(ang) * radius, y, Math.sin(ang) * radius]);
      strand2Pts.push([Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius]);

      if (i > 6 && i < 18) {
        rnaPts.push([
          Math.cos(ang + 0.4) * (radius * 0.62) + (i - 10) * 0.09,
          y + 0.08,
          Math.sin(ang + 0.4) * (radius * 0.62) + 0.35
        ]);
      }

      const isGc = i % 3 !== 0;
      const targetGroup = isGc ? gcGrp : atGrp;

      const leftHalf = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.052, 0.44, 6, 10),
        isGc ? gMat : aMat
      );
      leftHalf.rotation.z = Math.PI / 2;

      const rightHalf = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.052, 0.44, 6, 10),
        isGc ? cMat : tMat
      );
      rightHalf.rotation.z = Math.PI / 2;

      const pairPivot = new THREE.Group();
      pairPivot.position.y = y;
      pairPivot.rotation.y = -ang;
      leftHalf.position.x = 0.36;
      rightHalf.position.x = -0.36;

      const hBonds: THREE.Mesh[] = [];
      const hCount = isGc ? 3 : 2;
      for (let h = 0; h < hCount; h++) {
        const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 8), hBondMat);
        hb.rotation.z = Math.PI / 2;
        hb.position.set(0, (h - (hCount - 1) / 2) * 0.055, 0);
        pairPivot.add(hb);
        hBonds.push(hb);
      }

      pairPivot.add(leftHalf, rightHalf);
      targetGroup.add(pairPivot);
      pairMeshes.push({ leftHalf, rightHalf, hBonds, y, ang, isGc });

      // Phosphate bead accents along sugar-phosphate ribbon
      const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 10), b1Mat);
      p1.position.set(Math.cos(ang) * radius, y, Math.sin(ang) * radius);
      const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.078, 12, 10), b2Mat);
      p2.position.set(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius);
      backboneGrp.add(p1, p2);
    }

    const rail1 = new THREE.Mesh(makeTube(strand1Pts, 0.048, 64, 10), b1Mat);
    const rail2 = new THREE.Mesh(makeTube(strand2Pts, 0.048, 64, 10), b2Mat);
    backboneGrp.add(rail1, rail2);

    // Hexamer Helicase ring collar (6 catalytic lobes)
    const heliMat = vault.getMaterial('protein_globular', {
      color: 0xfbbf24,
      opacity: 0.78,
      transparent: true
    });
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const lobe = new THREE.Mesh(makeSculptedBlob(0.24, 0.18, 0.24, 14, 10), heliMat);
      lobe.position.set(Math.cos(a) * 0.78, 0, Math.sin(a) * 0.78);
      helicaseGrp.add(lobe);
    }

    // Nascent mRNA transcript strand emerging during unzipping
    if (rnaPts.length >= 2) {
      const rnaTube = new THREE.Mesh(makeTube(rnaPts, 0.044, 32, 10), rnaMat);
      rnaGrp.add(rnaTube);
      helicaseGrp.add(rnaGrp);
    }

    tagBioPart(backboneGrp, 'backbone', 'Khung đường–photphat 3’–5’');
    tagBioPart(atGrp, 'at_pair', 'Cặp bazơ A = T (2 LK Hydro)');
    tagBioPart(gcGrp, 'gc_pair', 'Cặp bazơ G ≡ C (3 LK Hydro)');
    tagBioPart(helicaseGrp, 'helicase', 'Enzyme Helicase & Phiên mã mRNA');

    root.add(backboneGrp, atGrp, gcGrp, helicaseGrp);
    interactables.push(backboneGrp, atGrp, gcGrp, helicaseGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const unzipped = Boolean(expFlagsRef.current.unzipped);
      const gcFrac = (modeParamsRef.current.gcPct ?? 50) / 100;

      root.rotation.y = t * 0.22;
      helicaseGrp.visible = unzipped || exp > 0.1;
      rnaGrp.visible = unzipped;
      helicaseGrp.position.y = Math.sin(t * 1.1) * 0.45;
      helicaseGrp.rotation.y = t * 0.9;

      pairMeshes.forEach((pm, idx) => {
        const showAsGc = (idx % 10) / 10 < gcFrac;
        pm.leftHalf.material = showAsGc ? gMat : aMat;
        pm.rightHalf.material = showAsGc ? cMat : tMat;

        const unzipSpread = unzipped ? Math.max(0, 1 - Math.abs(pm.y - helicaseGrp.position.y) * 0.9) * 0.42 : 0;
        const spread = unzipSpread + exp * 0.38;
        pm.leftHalf.position.x = 0.36 + spread;
        pm.rightHalf.position.x = -0.36 - spread;
        pm.hBonds.forEach((hb) => {
          hb.visible = spread < 0.22;
        });
      });
    });
    return true;
  }

  // =========================================================================
  // 3. RIBOSOME 60S / 40S TRANSLATION
  // =========================================================================
  if (mode === 'ribosome_translation_3d') {
    const largeSub = new THREE.Group();
    const smallSub = new THREE.Group();
    const trnaComplex = new THREE.Group();

    const largeMesh = new THREE.Mesh(
      makeSculptedBlob(1.18, 0.86, 0.96, seg, seg, (v) => {
        // Flattened ventral cleft & nascent peptide tunnel indentation
        if (v.y < -0.25) v.y *= 0.65;
        if (v.z > 0.35 && Math.abs(v.x) < 0.35 && v.y < 0.15) v.z -= 0.18;
      }),
      vault.getMaterial('protein_globular', {
        color: 0x0ea5e9,
        opacity: 0.86,
        transparent: true
      })
    );
    largeMesh.position.y = 0.64;
    largeSub.add(largeMesh);

    const smallMesh = new THREE.Mesh(
      makeSculptedBlob(1.06, 0.48, 0.82, seg, 14, (v) => {
        if (v.y > 0.12) v.y *= 0.72;
      }),
      vault.getMaterial('protein_globular', { color: 0x6366f1 })
    );
    smallMesh.position.y = -0.35;
    smallSub.add(smallMesh);

    // mRNA ribbon threading between 40S and 60S
    const mrnaRibbon = new THREE.Mesh(
      makeTube(
        [
          [-2.6, -0.05, 0.25],
          [-1.2, 0.0, 0.38],
          [0, 0.02, 0.42],
          [1.2, -0.02, 0.38],
          [2.6, -0.08, 0.25]
        ],
        0.065,
        36,
        10
      ),
      vault.getMaterial('endocrine_gland', { color: 0xf59e0b })
    );
    smallSub.add(mrnaRibbon);

    // 3 L-shaped tRNAs at A, P, E sites + folding polypeptide chain
    const trnaMat = vault.getMaterial('plant_epidermis', { color: 0x10b981 });
    const aaColors = [0xf43f5e, 0xa855f7, 0x3b82f6, 0x14b8a6, 0xf59e0b];
    const trnas: THREE.Group[] = [];
    for (let s = 0; s < 3; s++) {
      const tg = new THREE.Group();
      const verticalArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.42, 6, 10), trnaMat);
      const horizArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.22, 6, 8), trnaMat);
      horizArm.rotation.z = Math.PI / 2;
      horizArm.position.set(0.1, 0.22, 0);
      const aaBead = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 10),
        vault.getMaterial('protein_globular', { color: aaColors[s] })
      );
      aaBead.position.set(0, 0.45, 0);
      tg.add(verticalArm, horizArm, aaBead);
      tg.position.set((s - 1) * 0.46, 0.26, 0.32);
      trnaComplex.add(tg);
      trnas.push(tg);
    }

    // Nascent polypeptide chain emerging from exit tunnel
    const peptideGrp = new THREE.Group();
    for (let p = 0; p < 10; p++) {
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 12, 10),
        vault.getMaterial('protein_globular', { color: aaColors[p % aaColors.length] })
      );
      bead.position.set(Math.sin(p * 0.7) * 0.22, 1.35 + p * 0.14, 0.08 + Math.cos(p * 0.6) * 0.18);
      peptideGrp.add(bead);
    }
    trnaComplex.add(peptideGrp);

    // Optional second polysome clone
    const polysomeBuddy = new THREE.Group();
    const budL = largeMesh.clone();
    const budS = smallMesh.clone();
    polysomeBuddy.add(budL, budS);
    polysomeBuddy.scale.setScalar(0.68);
    polysomeBuddy.position.set(1.9, -0.04, -0.35);
    root.add(polysomeBuddy);

    tagBioPart(largeSub, 'large_sub', 'Tiểu phần lớn Ribosome (60S)');
    tagBioPart(smallSub, 'small_sub', 'Tiểu phần bé Ribosome (40S) & mRNA');
    tagBioPart(trnaComplex, 'trna_complex', 'Phức hợp tRNA & Chuỗi Polipeptit');

    root.add(largeSub, smallSub, trnaComplex);
    interactables.push(largeSub, smallSub, trnaComplex);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const rate = (modeParamsRef.current.rate ?? 15) / 15;
      polysomeBuddy.visible = Boolean(expFlagsRef.current.polysome);
      largeSub.position.y = exp * 0.75;
      smallSub.position.y = -exp * 0.55;
      trnaComplex.position.z = exp * 0.55;
      trnas.forEach((tg, i) => {
        tg.position.y = 0.26 + Math.sin(t * 2.2 * rate + i * 1.4) * 0.07;
      });
      peptideGrp.rotation.y = Math.sin(t * 0.9 * rate) * 0.35;
    });
    return true;
  }

  // =========================================================================
  // 4. MITOCHONDRIA & ATP SYNTHASE MOTOR
  // =========================================================================
  if (mode === 'mitochondria_atp_3d') {
    const outerGrp = new THREE.Group();
    const cristaeGrp = new THREE.Group();
    const atpGrp = new THREE.Group();

    const outerHalf = new THREE.Mesh(
      new THREE.SphereGeometry(1, seg + 6, seg, 0, Math.PI * 1.38),
      vault.getMaterial('cardiac_muscle', {
        color: 0xd9463e,
        opacity: 0.72,
        transparent: true,
        side: THREE.DoubleSide
      })
    );
    outerHalf.scale.set(2.35, 1.08, 1.18);
    outerHalf.rotation.y = 0.55;
    outerGrp.add(outerHalf);

    // Sculpted inner cristae labyrinth folds
    const cristaMat = vault.getMaterial('endocrine_gland', { color: 0xf59e0b, side: THREE.DoubleSide });
    const cPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 24; i++) {
      const u = (i / 24) * 2 - 1;
      const x = u * 1.75;
      const z = Math.sin(i * 1.55) * 0.56;
      const y = Math.cos(i * 0.85) * 0.14 - 0.1;
      cPts.push([x, y, z]);
    }
    const cristaTube = new THREE.Mesh(makeTube(cPts, 0.14, 64, 12), cristaMat);
    cristaTube.scale.y = 2.1;
    cristaeGrp.add(cristaTube);

    // Circular mitochondrial DNA ring in matrix
    const mtDna = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.032, 8, 28),
      vault.getMaterial('lipid_membrane', { color: 0x38bdf8 })
    );
    mtDna.rotation.x = Math.PI / 2;
    mtDna.position.set(-0.75, 0.18, 0.15);
    cristaeGrp.add(mtDna);

    // Magnified F0F1 ATP Synthase rotor assembly on foreground crista ridge
    atpGrp.position.set(0.85, 0.55, 0.45);
    const f0Ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.24, 16),
      vault.getMaterial('protein_globular', { color: 0x06b6d4 })
    );
    const stalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.38, 12),
      vault.getMaterial('compact_bone', { color: 0xe2e8f0 })
    );
    stalk.position.y = 0.28;
    const f1Crown = new THREE.Group();
    f1Crown.position.y = 0.55;
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const subunit = new THREE.Mesh(
        makeSculptedBlob(0.14, 0.2, 0.14, 12, 10),
        vault.getMaterial('protein_globular', { color: k % 2 === 0 ? 0x6366f1 : 0xa855f7 })
      );
      subunit.position.set(Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18);
      f1Crown.add(subunit);
    }
    atpGrp.add(f0Ring, stalk, f1Crown);

    tagBioPart(outerGrp, 'outer_membrane', 'Màng ngoài Ti thể');
    tagBioPart(cristaeGrp, 'cristae', 'Mào trong Cristae & mtDNA');
    tagBioPart(atpGrp, 'atp_synthase', 'Động cơ F₀F₁ ATP Synthase');

    root.add(outerGrp, cristaeGrp, atpGrp);
    interactables.push(outerGrp, cristaeGrp, atpGrp);

    animatedTickers.push((_t, dt) => {
      const exp = explodeRef.current;
      const o2 = expFlagsRef.current.aerobic !== false ? (modeParamsRef.current.o2Pct ?? 80) : 0;
      const spinRate = o2 > 10 ? 1.5 + (o2 / 100) * 4.5 : 0.2;
      f1Crown.rotation.y += dt * spinRate;
      f0Ring.rotation.y += dt * spinRate;
      outerGrp.position.y = -exp * 0.45;
      cristaeGrp.position.y = exp * 0.22;
      atpGrp.position.set(0.85 + exp * 0.55, 0.55 + exp * 0.45, 0.45 + exp * 0.35);
    });
    return true;
  }

  // =========================================================================
  // 5. CHLOROPLAST & THYLAKOID GRANA
  // =========================================================================
  if (mode === 'chloroplast_thylakoid_3d') {
    const envGrp = new THREE.Group();
    const granaGrp = new THREE.Group();
    const stromaGrp = new THREE.Group();

    const envShell = new THREE.Mesh(
      new THREE.SphereGeometry(1, seg + 6, seg, 0, Math.PI * 1.42),
      vault.getMaterial('chloroplast_membrane', {
        color: 0x15803d,
        opacity: 0.68,
        transparent: true,
        side: THREE.DoubleSide
      })
    );
    envShell.scale.set(2.35, 0.95, 1.45);
    envShell.rotation.y = 0.62;
    envGrp.add(envShell);

    const discMat = vault.getMaterial('chloroplast_membrane', { color: 0x22c55e });
    const bridgeMat = vault.getMaterial('plant_epidermis', { color: 0x4ade80 });
    const granaCoords: Array<[number, number, number]> = [
      [-1.05, 0, 0.18],
      [-0.35, 0.05, -0.32],
      [0.35, -0.04, 0.26],
      [1.05, 0.02, -0.18],
      [0.0, 0.08, 0.62]
    ];

    granaCoords.forEach(([gx, gy, gz], idx) => {
      const discs = 5 + (idx % 3);
      for (let d = 0; d < discs; d++) {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.065, 20), discMat);
        disc.position.set(gx, gy + (d - discs / 2) * 0.095, gz);
        granaGrp.add(disc);
      }
    });

    // Stroma lamellae connecting bridges between adjacent grana stacks
    for (let i = 0; i < granaCoords.length - 1; i++) {
      const [x1, y1, z1] = granaCoords[i];
      const [x2, y2, z2] = granaCoords[i + 1];
      const bridge = new THREE.Mesh(
        makeTube(
          [
            [x1, y1, z1],
            [(x1 + x2) * 0.5, (y1 + y2) * 0.5 + 0.08, (z1 + z2) * 0.5],
            [x2, y2, z2]
          ],
          0.032,
          12,
          8
        ),
        bridgeMat
      );
      granaGrp.add(bridge);
    }

    // Starch granules & RuBisCO droplets in Stroma
    const starchMat = vault.getMaterial('compact_bone', { color: 0xfef3c7 });
    for (let s = 0; s < 4; s++) {
      const starch = new THREE.Mesh(makeSculptedBlob(0.18, 0.11, 0.13, 12, 10), starchMat);
      starch.position.set(-0.7 + s * 0.48, -0.35, 0.55 - (s % 2) * 0.8);
      stromaGrp.add(starch);
    }

    tagBioPart(envGrp, 'envelope', 'Màng kép Lục lạp');
    tagBioPart(granaGrp, 'grana', 'Cột Grana & Màng Thylakoid');
    tagBioPart(stromaGrp, 'stroma', 'Chất nền Stroma & Hạt tinh bột');

    root.add(envGrp, granaGrp, stromaGrp);
    interactables.push(envGrp, granaGrp, stromaGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const lightOn = expFlagsRef.current.lightOn !== false && (modeParamsRef.current.light ?? 70) > 5;
      discMat.emissive.setHex(lightOn ? 0x16a34a : 0x000000);
      discMat.emissiveIntensity = lightOn ? 0.12 + 0.08 * Math.sin(t * 2.4) : 0;
      envGrp.position.y = -exp * 0.45;
      granaGrp.position.y = exp * 0.35;
      stromaGrp.position.z = exp * 0.5;
    });
    return true;
  }

  // =========================================================================
  // 6. FLUID-MOSAIC PHOSPHOLIPID BILAYER
  // =========================================================================
  if (mode === 'phospholipid_bilayer_3d') {
    const headsGrp = new THREE.Group();
    const tailsGrp = new THREE.Group();
    const channelGrp = new THREE.Group();

    const headMat = vault.getMaterial('lipid_membrane', { color: 0x0284c7 });
    const tailMat = vault.getMaterial('endocrine_gland', { color: 0xfbbf24 });
    const cholMat = vault.getMaterial('arterial_vessel', { color: 0xf59e0b });
    const headGeo = new THREE.SphereGeometry(0.115, 12, 10);
    const tailGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.44, 6);

    const gridCols = isLowEnd ? 7 : 10;
    const gridRows = isLowEnd ? 5 : 6;
    const headAnim: Array<{ mesh: THREE.Mesh; baseX: number; baseZ: number; top: boolean }> = [];

    for (let ix = 0; ix < gridCols; ix++) {
      for (let iz = 0; iz < gridRows; iz++) {
        const x = (ix - (gridCols - 1) / 2) * 0.42;
        const z = (iz - (gridRows - 1) / 2) * 0.42;
        if (Math.hypot(x, z) < 0.65) continue; // leave central pore for Aquaporin protein channel

        for (const isTop of [true, false]) {
          const sign = isTop ? 1 : -1;
          const head = new THREE.Mesh(headGeo, headMat);
          head.position.set(x, sign * 0.56, z);
          headsGrp.add(head);
          headAnim.push({ mesh: head, baseX: x, baseZ: z, top: isTop });

          // Two fatty acid tails (1 straight saturated, 1 kinked unsaturated)
          const t1 = new THREE.Mesh(tailGeo, tailMat);
          t1.position.set(x - 0.038, sign * 0.28, z);
          const t2 = new THREE.Mesh(tailGeo, tailMat);
          t2.position.set(x + 0.042, sign * 0.28, z);
          t2.rotation.z = sign * 0.18;
          tailsGrp.add(t1, t2);
        }

        if ((ix + iz) % 5 === 0) {
          const chol = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.26, 4, 8), cholMat);
          chol.position.set(x + 0.14, 0.24, z + 0.14);
          channelGrp.add(chol);
        }
      }
    }

    // 4-helix transmembrane channel protein + carbohydrate antenna chain
    const chanMat = vault.getMaterial('protein_globular', { color: 0x8b5cf6 });
    for (let h = 0; h < 4; h++) {
      const a = (h / 4) * Math.PI * 2 + Math.PI / 4;
      const helix = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.96, 8, 12), chanMat);
      helix.position.set(Math.cos(a) * 0.32, 0, Math.sin(a) * 0.32);
      channelGrp.add(helix);
    }
    for (let g = 0; g < 5; g++) {
      const sugar = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.075, 0),
        vault.getMaterial('plant_epidermis', { color: 0x22c55e })
      );
      sugar.position.set(0.32 + g * 0.11, 0.72 + g * 0.12, 0.28);
      channelGrp.add(sugar);
    }

    tagBioPart(headsGrp, 'lipid_heads', 'Đầu photphat ưa nước');
    tagBioPart(tailsGrp, 'lipid_tails', 'Đuôi axit béo kị nước');
    tagBioPart(channelGrp, 'channel_protein', 'Kênh Protein xuyên màng & Cholesterol');

    root.add(headsGrp, tailsGrp, channelGrp);
    interactables.push(headsGrp, tailsGrp, channelGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const tempFactor = (modeParamsRef.current.tempC ?? 37) / 37;
      headAnim.forEach((item) => {
        const wave = Math.sin(t * 2.0 * tempFactor + item.baseX * 1.4 + item.baseZ) * 0.045;
        item.mesh.position.y = (item.top ? 0.56 + exp * 0.45 : -0.56 - exp * 0.45) + wave;
      });
      channelGrp.position.y = exp * 0.6;
    });
    return true;
  }

  // =========================================================================
  // 7. CHROMOSOME MITOSIS & SPINDLE
  // =========================================================================
  if (mode === 'chromosome_mitosis_3d') {
    const chrom1 = new THREE.Group();
    const chrom2 = new THREE.Group();
    const kinetoGrp = new THREE.Group();

    const dnaMat1 = vault.getMaterial('protein_globular', { color: 0x3b82f6 });
    const dnaMat2 = vault.getMaterial('protein_globular', { color: 0x06b6d4 });
    const telMat = vault.getMaterial('endocrine_gland', { color: 0xf59e0b });
    const kinMat = vault.getMaterial('arterial_vessel', { color: 0xe11d48 });

    const buildChromatid = (mat: THREE.Material, mirrorX: number) => {
      const grp = new THREE.Group();
      const curvePts: Array<[number, number, number]> = [];
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        const y = (t - 0.5) * 3.1;
        const bend = Math.pow(Math.abs(t - 0.5) * 2, 1.35) * 0.48 * mirrorX;
        const coilZ = Math.sin(t * Math.PI * 10) * 0.06;
        curvePts.push([bend + mirrorX * 0.12, y, coilZ]);
      }
      const arm = new THREE.Mesh(makeTube(curvePts, 0.19, 44, 14), mat);
      const topTel = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), telMat);
      topTel.position.set(mirrorX * 0.6, 1.55, 0);
      const botTel = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), telMat);
      botTel.position.set(mirrorX * 0.6, -1.55, 0);
      grp.add(arm, topTel, botTel);
      return grp;
    };

    chrom1.add(buildChromatid(dnaMat1, -1));
    chrom2.add(buildChromatid(dnaMat2, 1));

    const centromere = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.36, 18), kinMat);
    centromere.rotation.z = Math.PI / 2;
    const spindleFibers = new THREE.Mesh(
      makeTube(
        [
          [-2.6, 0, 0],
          [-0.3, 0, 0],
          [0.3, 0, 0],
          [2.6, 0, 0]
        ],
        0.025,
        24,
        8
      ),
      vault.getMaterial('compact_bone', { color: 0xfef08a })
    );
    kinetoGrp.add(centromere, spindleFibers);

    tagBioPart(chrom1, 'chromatid_1', 'Crômatit chị em (Sợi Chromatin xoắn)');
    tagBioPart(chrom2, 'chromatid_1', 'Crômatit chị em (Bản sao DNA)');
    tagBioPart(kinetoGrp, 'kinetochore', 'Tâm động & Sợi tơ thoi phân bào');

    root.add(chrom1, chrom2, kinetoGrp);
    interactables.push(chrom1, chrom2, kinetoGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const anaphase = Boolean(expFlagsRef.current.anaphase);
      const sep = (anaphase ? 1.15 : 0) + exp * 0.45;
      chrom1.position.x = -sep;
      chrom2.position.x = sep;
      centromere.visible = !anaphase;
      root.rotation.y = Math.sin(t * 0.35) * 0.25;
    });
    return true;
  }

  // =========================================================================
  // 8. ENZYME–SUBSTRATE INDUCED FIT
  // =========================================================================
  if (mode === 'enzyme_substrate_3d') {
    const enzymeGrp = new THREE.Group();
    const substrateGrp = new THREE.Group();

    // Sculpted globular protein domain with deep active-site pocket on right (+x)
    const enzymeMat = vault.getMaterial('protein_globular', { color: 0x0d9488 });
    const enzymeMesh = new THREE.Mesh(
      makeSculptedBlob(1.38, 1.18, 1.05, seg + 6, seg, (v, n) => {
        const fold = Math.sin(n.x * 9 + n.y * 7) * Math.cos(n.z * 8) * 0.055;
        v.addScaledVector(n, fold);
        if (v.x > 0.22 && Math.abs(v.y) < 0.46 && Math.abs(v.z) < 0.48) {
          v.x -= 0.72 * (1 - Math.abs(v.y) / 0.55);
        }
      }),
      enzymeMat
    );
    enzymeGrp.add(enzymeMesh);

    // Matching wedge substrate (splits cleanly into 2 products on reaction!)
    const subA = new THREE.Mesh(
      makeSculptedBlob(0.42, 0.24, 0.36, 16, 12),
      vault.getMaterial('endocrine_gland', { color: 0xf59e0b })
    );
    subA.position.y = 0.14;
    const subB = new THREE.Mesh(
      makeSculptedBlob(0.42, 0.24, 0.36, 16, 12),
      vault.getMaterial('arterial_vessel', { color: 0xf97316 })
    );
    subB.position.y = -0.14;
    substrateGrp.add(subA, subB);

    const inhibitor = new THREE.Mesh(
      makeSculptedBlob(0.46, 0.42, 0.42, 16, 12),
      vault.getMaterial('arterial_vessel', { color: 0xe11d48 })
    );
    substrateGrp.add(inhibitor);

    tagBioPart(enzymeGrp, 'enzyme_domain', 'Phân tử Enzyme & Khe Hoạt động');
    tagBioPart(substrateGrp, 'substrate', 'Cơ chất / Chất ức chế cạnh tranh');

    root.add(enzymeGrp, substrateGrp);
    interactables.push(enzymeGrp, substrateGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const tempC = modeParamsRef.current.tempC ?? 37;
      const inhibited = Boolean(expFlagsRef.current.inhibited);
      const denatured = tempC > 58;

      enzymeMesh.scale.set(
        denatured ? 1.32 : 1,
        denatured ? 0.62 : 1,
        denatured ? 1.25 : 1
      );
      enzymeMat.color.setHex(denatured ? 0x64748b : 0xffffff);

      inhibitor.visible = inhibited;
      if (inhibited) {
        inhibitor.position.set(0.95 + exp * 0.4, 0, 0);
        subA.position.set(2.2, 0.35, 0);
        subB.position.set(2.2, -0.35, 0);
      } else if (denatured) {
        subA.position.set(2.05, 0.2, 0);
        subB.position.set(2.05, -0.2, 0);
      } else {
        const cycle = (Math.sin(t * 1.8) + 1) * 0.5;
        const dockX = THREE.MathUtils.lerp(1.95 + exp * 0.5, 0.85, cycle);
        subA.position.set(dockX, 0.14 + (1 - cycle) * 0.15, 0);
        subB.position.set(dockX, -0.14 - (1 - cycle) * 0.15, 0);
      }
    });
    return true;
  }

  // =========================================================================
  // 9. BIOMOLECULES (H2O, Glucose, Alpha-Helix Protein, Phospholipid)
  // =========================================================================
  if (mode === 'biomolecules_3d') {
    const molGrp = new THREE.Group();
    tagBioPart(molGrp, 'macromolecule', 'Đại phân tử sinh học');
    root.add(molGrp);
    interactables.push(molGrp);

    const waterCluster = new THREE.Group();
    const oxMat = vault.getMaterial('arterial_vessel', { color: 0xef4444 });
    const hyMat = vault.getMaterial('compact_bone', { color: 0xf8fafc });
    const hBondMat = vault.getMaterial('lipid_membrane', { color: 0x38bdf8 });
    const waterCoords: Array<[number, number, number]> = [
      [0, 0, 0],
      [1.1, 0.75, 0.4],
      [-1.1, 0.75, -0.4],
      [0.45, -0.95, 0.9],
      [-0.5, -0.95, -0.85]
    ];
    const hLinks: THREE.Mesh[] = [];
    waterCoords.forEach(([wx, wy, wz], idx) => {
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), oxMat);
      o.position.set(wx, wy, wz);
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), hyMat);
      h1.position.set(wx + 0.28, wy + 0.19, wz);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), hyMat);
      h2.position.set(wx - 0.28, wy + 0.19, wz);
      waterCluster.add(o, h1, h2);
      if (idx > 0) {
        const link = new THREE.Mesh(
          makeTube([[0, 0, 0], [wx, wy, wz]], 0.025, 8, 6),
          hBondMat
        );
        waterCluster.add(link);
        hLinks.push(link);
      }
    });

    const glucoseCluster = new THREE.Group();
    const cMat = vault.getMaterial('soil_terrain', { color: 0x334155 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), i === 5 ? oxMat : cMat);
      atom.position.set(Math.cos(a) * 0.95, (i % 2 === 0 ? 1 : -1) * 0.12, Math.sin(a) * 0.95);
      const oh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), oxMat);
      oh.position.set(Math.cos(a) * 1.45, (i % 2 === 0 ? 1 : -1) * 0.35, Math.sin(a) * 1.45);
      glucoseCluster.add(atom, oh);
    }

    const proteinCluster = new THREE.Group();
    const foldedPts: Array<[number, number, number]> = [];
    const unfoldedPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const a = t * Math.PI * 8;
      foldedPts.push([Math.cos(a) * (0.45 + Math.sin(t * Math.PI) * 0.45), (t - 0.5) * 2.2, Math.sin(a) * 0.55]);
      unfoldedPts.push([(t - 0.5) * 3.8, Math.sin(t * Math.PI * 3) * 0.18, 0]);
    }
    const foldedHelix = new THREE.Mesh(
      makeTube(foldedPts, 0.13, 64, 12),
      vault.getMaterial('protein_globular', { color: 0x10b981 })
    );
    const denaturedStrand = new THREE.Mesh(
      makeTube(unfoldedPts, 0.11, 48, 10),
      vault.getMaterial('arterial_vessel', { color: 0xf97316 })
    );
    proteinCluster.add(foldedHelix, denaturedStrand);

    const lipidCluster = new THREE.Group();
    const lHead = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), vault.getMaterial('lipid_membrane', { color: 0x0ea5e9 }));
    lHead.position.y = 0.85;
    const tailA = new THREE.Mesh(makeTube([[ -0.18, 0.45, 0 ], [ -0.22, -0.35, 0 ], [ -0.18, -1.2, 0 ]], 0.1, 16, 10), vault.getMaterial('endocrine_gland'));
    const tailB = new THREE.Mesh(makeTube([[ 0.18, 0.45, 0 ], [ 0.42, -0.25, 0.1 ], [ 0.58, -1.05, 0 ]], 0.1, 16, 10), vault.getMaterial('endocrine_gland'));
    lipidCluster.add(lHead, tailA, tailB);

    molGrp.add(waterCluster, glucoseCluster, proteinCluster, lipidCluster);

    animatedTickers.push((t) => {
      const grp = Math.round(modeParamsRef.current.molGroup ?? 3);
      const tempC = modeParamsRef.current.tempC ?? 37;
      const showH = expFlagsRef.current.showHBonds !== false;

      waterCluster.visible = grp === 1;
      glucoseCluster.visible = grp === 2;
      proteinCluster.visible = grp === 3;
      lipidCluster.visible = grp === 4;

      hLinks.forEach((l) => {
        l.visible = showH;
      });
      const denatured = tempC > 58;
      foldedHelix.visible = !denatured;
      denaturedStrand.visible = denatured;
      molGrp.rotation.y = t * 0.28;
    });
    return true;
  }

  return false;
}
