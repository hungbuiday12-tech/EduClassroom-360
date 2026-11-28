import * as THREE from 'three';
import { BioSceneHookContext, tagBioPart } from './bioCellularBuilders';

function makeTube(
  pts: Array<[number, number, number]>,
  r: number,
  tubSeg = 20,
  radSeg = 10,
  taper?: (t: number) => number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const geo = new THREE.TubeGeometry(curve, tubSeg, r, radSeg, false);
  if (taper) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const ringIdx = Math.floor(i / (radSeg + 1));
      const t = Math.min(1, ringIdx / tubSeg);
      const center = curve.getPointAt(t);
      v.fromBufferAttribute(pos, i).sub(center).multiplyScalar(taper(t)).add(center);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  }
  return geo;
}

/**
 * Builds Topic C (Plant Biology):
 * - plant_vascular_3d (Root–Stem–Leaf + Xylem/Phloem vascular cutaway)
 * - plant_leaf_transpiration_3d (Leaf mesophyll cross-section & animated Guard Cell stomata)
 */
export function buildPlantBiologyScene(
  mode: string,
  root: THREE.Group,
  ctx: BioSceneHookContext
): boolean {
  const { vault, isLowEnd, explodeRef, xrayRef, modeParamsRef, expFlagsRef, interactables, animatedTickers } = ctx;

  // =========================================================================
  // 1. PLANT ROOT–STEM–LEAF & XYLEM/PHLOEM VASCULAR CUTAWAY
  // =========================================================================
  if (mode === 'plant_vascular_3d') {
    const rootGrp = new THREE.Group();
    const xylemGrp = new THREE.Group();
    const phloemGrp = new THREE.Group();

    const soilMat = vault.getMaterial('soil_terrain', { opacity: 0.42, transparent: true });
    const soilBlock = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.95, 0.9, 28), soilMat);
    soilBlock.position.y = -1.25;
    root.add(soilBlock);

    // Taproot + lateral roots + fine root hairs
    const rootMat = vault.getMaterial('soil_terrain', { color: 0xa16207 });
    const tapRoot = new THREE.Mesh(
      makeTube(
        [
          [0, -0.75, 0],
          [0.05, -1.25, 0.04],
          [-0.04, -1.85, -0.02]
        ],
        0.16,
        16,
        10,
        (t) => 1 - t * 0.72
      ),
      rootMat
    );
    rootGrp.add(tapRoot);

    for (let r = 0; r < 6; r++) {
      const a = (r / 6) * Math.PI * 2;
      const lat = new THREE.Mesh(
        makeTube(
          [
            [0, -0.95 - (r % 2) * 0.25, 0],
            [Math.cos(a) * 0.65, -1.25 - (r % 3) * 0.16, Math.sin(a) * 0.65],
            [Math.cos(a + 0.25) * 1.25, -1.58, Math.sin(a + 0.25) * 1.25]
          ],
          0.065,
          14,
          8,
          (t) => 1 - t * 0.78
        ),
        rootMat
      );
      rootGrp.add(lat);
    }

    // Cutaway outer stem cortex sheath (220 deg open arc exposing inner Xylem & Phloem bundles)
    const cortexShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.5, 1.95, 24, 1, true, 0.9, Math.PI * 1.35),
      vault.getMaterial('plant_epidermis', { side: THREE.DoubleSide })
    );
    cortexShell.position.y = 0.2;
    root.add(cortexShell);

    // Xylem vessels (spiral-lignified blue water columns + rising H2O beads)
    const xylemMat = vault.getMaterial('plant_xylem');
    for (const [ox, oz] of [[-0.14, 0.1], [0.1, 0.14], [-0.04, -0.14]]) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 2.2, 14), xylemMat);
      pipe.position.set(ox, 0.25, oz);
      xylemGrp.add(pipe);
      for (let ring = 0; ring < 7; ring++) {
        const spiral = new THREE.Mesh(
          new THREE.TorusGeometry(0.092, 0.012, 6, 12),
          vault.getMaterial('compact_bone', { color: 0xbfdbfe })
        );
        spiral.rotation.x = Math.PI / 2 + 0.15;
        spiral.position.set(ox, -0.65 + ring * 0.28, oz);
        xylemGrp.add(spiral);
      }
    }

    const h2oDroplets: THREE.Mesh[] = [];
    const dropMat = vault.getMaterial('lipid_membrane', { color: 0x38bdf8 });
    for (let i = 0; i < 6; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), dropMat);
      d.position.set(-0.08, -0.8 + i * 0.4, 0.18);
      xylemGrp.add(d);
      h2oDroplets.push(d);
    }

    // Phloem sieve tubes + perforated sieve plates + downward sucrose beads
    const phloemMat = vault.getMaterial('plant_phloem');
    for (const [ox, oz] of [[0.22, 0.05], [-0.22, -0.05]]) {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 2.15, 14), phloemMat);
      tube.position.set(ox, 0.25, oz);
      phloemGrp.add(tube);
    }
    const sugarBeads: THREE.Mesh[] = [];
    const sugMat = vault.getMaterial('endocrine_gland', { color: 0xfbbf24 });
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), sugMat);
      s.position.set(0.24, 1.1 - i * 0.45, 0.12);
      phloemGrp.add(s);
      sugarBeads.push(s);
    }

    // Sculpted veined leaf canopy atop stem
    const leafMat = vault.getMaterial('chloroplast_membrane', { side: THREE.DoubleSide });
    for (let l = 0; l < 4; l++) {
      const ang = (l / 4) * Math.PI * 2 + 0.4;
      const leafGrp = new THREE.Group();
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.quadraticCurveTo(0.45, 0.42, 0, 1.25);
      bladeShape.quadraticCurveTo(-0.45, 0.42, 0, 0);
      const blade = new THREE.Mesh(
        new THREE.ExtrudeGeometry(bladeShape, { depth: 0.035, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }),
        leafMat
      );
      blade.rotation.x = Math.PI / 2 - 0.35;
      leafGrp.add(blade);
      leafGrp.position.y = 1.22 + (l % 2) * 0.16;
      leafGrp.rotation.y = ang;
      root.add(leafGrp);
    }

    tagBioPart(rootGrp, 'root_system', 'Hệ Rễ & Lông hút');
    tagBioPart(xylemGrp, 'xylem', 'Mạch gỗ (Xylem — Vận chuyển H₂O lên)');
    tagBioPart(phloemGrp, 'phloem', 'Mạch rây (Phloem — Vận chuyển Đường xuống)');

    root.add(rootGrp, xylemGrp, phloemGrp);
    interactables.push(rootGrp, xylemGrp, phloemGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const open = expFlagsRef.current.abaClosed ? 10 : (modeParamsRef.current.stomata ?? 70);
      const flux = Math.max(0.15, (open / 100) * (1.2 - (modeParamsRef.current.humidity ?? 55) / 140));

      soilBlock.visible = !xrayRef.current;
      xylemGrp.position.x = -exp * 0.45;
      phloemGrp.position.x = exp * 0.45;
      rootGrp.position.y = -exp * 0.35;

      h2oDroplets.forEach((d, idx) => {
        const y = (((t * flux * 0.8 + idx / 6) % 1) * 2.2) - 0.85;
        d.position.y = y;
      });
      sugarBeads.forEach((s, idx) => {
        const y = 1.25 - (((t * 0.45 + idx / 5) % 1) * 2.1);
        s.position.y = y;
      });
    });
    return true;
  }

  // =========================================================================
  // 2. LEAF CROSS-SECTION, MESOPHYLL & STOMATA TRANSPIRATION (NEW)
  // =========================================================================
  if (mode === 'plant_leaf_transpiration_3d') {
    const palisadeGrp = new THREE.Group();
    const spongyGrp = new THREE.Group();
    const stomataGrp = new THREE.Group();

    const cuticleMat = vault.getMaterial('lipid_membrane', {
      color: 0x86efac,
      opacity: 0.42,
      transparent: true
    });
    const upperCuticle = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.14, 2.4), cuticleMat);
    upperCuticle.position.y = 1.18;
    const upperEpidermis = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.24, 2.4),
      vault.getMaterial('plant_epidermis', { color: 0x4ade80, opacity: 0.65, transparent: true })
    );
    upperEpidermis.position.y = 0.98;
    root.add(upperCuticle, upperEpidermis);

    // Palisade Mesophyll: tightly packed vertical columnar cells rich in chloroplasts
    const palCellMat = vault.getMaterial('chloroplast_membrane', { color: 0x16a34a });
    const cols = isLowEnd ? 5 : 7;
    const rows = isLowEnd ? 3 : 4;
    for (let ix = 0; ix < cols; ix++) {
      for (let iz = 0; iz < rows; iz++) {
        const cell = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.46, 6, 12), palCellMat);
        cell.position.set(
          (ix - (cols - 1) / 2) * 0.5,
          0.42,
          (iz - (rows - 1) / 2) * 0.52
        );
        palisadeGrp.add(cell);
      }
    }

    // Spongy Mesophyll: loose rounded cells with gas exchange intercellular spaces + vascular vein bundle
    const spongyMat = vault.getMaterial('plant_epidermis', { color: 0x22c55e });
    for (let s = 0; s < 14; s++) {
      const cell = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), spongyMat);
      cell.position.set(
        ((s % 5) - 2) * 0.72 + (s % 2) * 0.15,
        -0.32 + ((s % 3) - 1) * 0.18,
        (Math.floor(s / 5) - 1) * 0.68
      );
      if (Math.hypot(cell.position.x, cell.position.y + 0.25) < 0.45) continue;
      spongyGrp.add(cell);
    }

    // Leaf midrib vascular bundle (Xylem dorsal + Phloem ventral)
    const veinXylem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 2.45, 14),
      vault.getMaterial('plant_xylem')
    );
    veinXylem.rotation.x = Math.PI / 2;
    veinXylem.position.set(0, -0.15, 0);
    const veinPhloem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 2.45, 14),
      vault.getMaterial('plant_phloem')
    );
    veinPhloem.rotation.x = Math.PI / 2;
    veinPhloem.position.set(0, -0.45, 0);
    spongyGrp.add(veinXylem, veinPhloem);

    // Lower epidermis flanks leaving central stomatal aperture
    const lowerMat = vault.getMaterial('plant_epidermis', { color: 0x4ade80, opacity: 0.72, transparent: true });
    const leftEpi = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.22, 2.4), lowerMat);
    leftEpi.position.set(-1.17, -0.95, 0);
    const rightEpi = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.22, 2.4), lowerMat);
    rightEpi.position.set(1.17, -0.95, 0);
    root.add(leftEpi, rightEpi);

    // Bean-shaped Guard Cells forming animated Stomata + emerging H2O vapor molecules
    const guardMat = vault.getMaterial('chloroplast_membrane', { color: 0x15803d });
    const guardLeft = new THREE.Mesh(
      makeTube([[-0.08, -0.95, -0.45], [-0.24, -0.95, 0], [-0.08, -0.95, 0.45]], 0.12, 16, 10),
      guardMat
    );
    const guardRight = new THREE.Mesh(
      makeTube([[0.08, -0.95, -0.45], [0.24, -0.95, 0], [0.08, -0.95, 0.45]], 0.12, 16, 10),
      guardMat
    );
    stomataGrp.add(guardLeft, guardRight);

    const vaporDrops: THREE.Mesh[] = [];
    const vapMat = vault.getMaterial('lipid_membrane', { color: 0x7dd3fc });
    for (let v = 0; v < 5; v++) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), vapMat);
      drop.position.set((v - 2) * 0.08, -1.1 - v * 0.22, (v % 2 - 0.5) * 0.15);
      stomataGrp.add(drop);
      vaporDrops.push(drop);
    }

    tagBioPart(palisadeGrp, 'palisade_mesophyll', 'Mô giậu giàu Lục lạp');
    tagBioPart(spongyGrp, 'spongy_mesophyll', 'Mô khuyết & Bó gân lá');
    tagBioPart(stomataGrp, 'stomata_guard', 'Khí khổng & Tế bào hạt đậu');

    root.add(palisadeGrp, spongyGrp, stomataGrp);
    interactables.push(palisadeGrp, spongyGrp, stomataGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const openPct = expFlagsRef.current.abaClosed ? 10 : (modeParamsRef.current.stomataOpen ?? 75);
      const aperture = (openPct / 100) * 0.18;

      guardLeft.position.x = -aperture;
      guardRight.position.x = aperture;

      palisadeGrp.position.y = exp * 0.48;
      spongyGrp.position.y = -exp * 0.1;
      stomataGrp.position.y = -exp * 0.55;

      vaporDrops.forEach((d, i) => {
        d.visible = openPct > 15;
        if (d.visible) {
          d.position.y = -1.05 - (((t * 0.75 + i * 0.22) % 1) * 0.95);
        }
      });
    });
    return true;
  }

  return false;
}
