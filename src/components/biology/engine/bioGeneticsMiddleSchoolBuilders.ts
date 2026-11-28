import * as THREE from 'three';
import { createCrispLine2 } from '../../../lib/three3DEnhancements';
import { disposeObjectTreeFull } from './bioGltfLoader';
import { BioSceneHookContext, tagBioPart } from './bioCellularBuilders';

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
  radSeg = 10,
  taper?: (t: number) => number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const geo = new THREE.TubeGeometry(curve, tubSeg, r, radSeg, false);
  if (!taper) return geo;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ringStride = radSeg + 1;
  for (let i = 0; i <= tubSeg; i++) {
    const t = i / tubSeg;
    curve.getPointAt(t, c);
    const scale = taper(t);
    for (let j = 0; j < ringStride; j++) {
      const idx = i * ringStride + j;
      if (idx >= pos.count) break;
      v.fromBufferAttribute(pos, idx);
      v.sub(c).multiplyScalar(scale).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function makeLeafBladeGeometry(length = 0.72, width = 0.34): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.75, length * 0.22, width * 0.65, length * 0.75, 0, length);
  shape.bezierCurveTo(-width * 0.65, length * 0.75, -width * 0.75, length * 0.22, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.028, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
  geo.center();
  return geo;
}

function makeSculptedHeart(
  vault: BioSceneHookContext['vault'],
  chambers: 2 | 3 | 4,
  seg: number
): THREE.Group {
  const grp = new THREE.Group();
  const myoMat = vault.getMaterial('cardiac_muscle', { color: chambers === 2 ? 0x991b1b : chambers === 3 ? 0xb91c1c : 0xc83242 });
  const artMat = vault.getMaterial('arterial_vessel');
  const veinMat = vault.getMaterial('venous_vessel');
  const mixedMat = vault.createUniqueMaterial('cardiac_muscle', { color: 0xa855f7, roughness: 0.35 });

  // Conical muscular ventricle(s) with anterior interventricular sulcus
  const ventGeo = makeSculptedBlob(0.46, 0.56, 0.38, seg, 16, (v) => {
    if (v.y < 0) {
      const taper = 1 + v.y * 0.62;
      v.x = v.x * Math.max(0.32, taper) - v.y * 0.14;
    }
    if (chambers === 4 && Math.abs(v.x) < 0.14 && v.z > 0.08) v.z -= 0.05;
  });
  const vent = new THREE.Mesh(ventGeo, chambers === 3 ? mixedMat : chambers === 2 ? veinMat : myoMat);
  vent.position.set(0, -0.18, 0);
  grp.add(vent);

  // Atria
  const rightAtr = new THREE.Mesh(makeSculptedBlob(0.24, 0.22, 0.22, 16, 12), veinMat);
  rightAtr.position.set(-0.24, 0.36, 0.05);
  grp.add(rightAtr);

  if (chambers >= 3) {
    const leftAtr = new THREE.Mesh(makeSculptedBlob(0.24, 0.22, 0.22, 16, 12), artMat);
    leftAtr.position.set(0.24, 0.36, 0.05);
    grp.add(leftAtr);
  }

  // Aortic arch / truncus arteriosus
  const arch = new THREE.Mesh(
    makeTube(
      [
        [0.06, 0.28, 0.05],
        [0.14, 0.72, 0],
        [-0.08, 0.85, -0.06],
        [-0.18, 0.45, -0.16]
      ],
      0.088,
      20,
      10
    ),
    chambers === 2 ? veinMat : chambers === 3 ? mixedMat : artMat
  );
  grp.add(arch);

  if (chambers === 4) {
    const pulmTrunk = new THREE.Mesh(
      makeTube([[-0.08, 0.25, 0.16], [0.02, 0.62, 0.08], [0.32, 0.66, -0.05]], 0.072, 16, 10),
      veinMat
    );
    grp.add(pulmTrunk);
  }

  return grp;
}

/**
 * Builds sculpted PBR composite 3D scenes for Genetics, Evolution, Biomolecules, and Middle-School Biology modes.
 * Returns true if `mode` was handled.
 */
export function buildGeneticsMiddleSchoolScene(
  mode: string,
  root: THREE.Group,
  ctx: BioSceneHookContext
): boolean {
  const {
    vault,
    isLowEnd,
    explodeRef,
    xrayRef,
    modeParamsRef,
    expFlagsRef,
    interactables,
    animatedTickers,
    mendelPresetRef,
    addLabel,
    removeLabel
  } = ctx;
  const seg = isLowEnd ? 14 : 24;

  // =========================================================================
  // 1. MENDEL PEAS CROSS (Sculpted Plants, Pods, Seeds & F2 Ratio Pillars)
  // =========================================================================
  if (mode === 'mendel_peas_3d') {
    const potMat = new THREE.MeshPhysicalMaterial({ color: 0x9a3412, roughness: 0.72, clearcoat: 0.08 });
    const soilMat = vault.getMaterial('soil_terrain');
    const stemMat = vault.getMaterial('plant_xylem', { color: 0x16a34a });
    const leafMat = vault.getMaterial('plant_epidermis');
    const purpleMat = vault.getMaterial('lipid_membrane', { color: 0x9333ea, emissive: 0x581c87, emissiveIntensity: 0.28 });
    const whiteMat = vault.getMaterial('cartilage', { color: 0xf8fafc });
    const yellowPeaMat = vault.getMaterial('lipid_membrane', { color: 0xfacc15 });
    const greenPeaMat = vault.getMaterial('plant_epidermis', { color: 0x22c55e });

    const p1Grp = new THREE.Group();
    const podGrp = new THREE.Group();
    const mendelDynGrp = new THREE.Group();

    const makeSculptedPot = (x: number) => {
      const prof = [
        new THREE.Vector2(0.01, -0.28),
        new THREE.Vector2(0.32, -0.28),
        new THREE.Vector2(0.46, 0.24),
        new THREE.Vector2(0.49, 0.28),
        new THREE.Vector2(0.42, 0.28),
        new THREE.Vector2(0.38, 0.16)
      ];
      const pot = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), potMat);
      pot.position.set(x, -1.78, 0);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.39, 0.06, 20), soilMat);
      soil.position.set(x, -1.56, 0);
      return [pot, soil];
    };

    const makeSculptedPeaFlower = (x: number, y: number, petalMat: THREE.Material) => {
      const fg = new THREE.Group();
      fg.position.set(x, y, 0.14);
      const leafGeo = makeLeafBladeGeometry(0.42, 0.26);
      for (let k = 0; k < 5; k++) {
        const ang = (k / 5) * Math.PI * 2;
        const p = new THREE.Mesh(leafGeo, petalMat);
        p.rotation.z = ang;
        p.rotation.x = 0.28;
        p.position.set(Math.sin(-ang) * 0.2, Math.cos(ang) * 0.2, 0.05);
        fg.add(p);
      }
      const keel = new THREE.Mesh(makeSculptedBlob(0.14, 0.18, 0.12, 14, 10), vault.getMaterial('endocrine_gland'));
      fg.add(keel);
      return fg;
    };

    // P1 Tall Purple plant
    p1Grp.add(...makeSculptedPot(-2.05));
    const stem1 = new THREE.Mesh(
      makeTube([[-2.05, -1.55, 0], [-2.12, -0.45, 0.06], [-2.02, 0.55, -0.04], [-2.05, 1.28, 0.08]], 0.075, 22, 10),
      stemMat
    );
    p1Grp.add(stem1);
    const leafGeo = makeLeafBladeGeometry(0.68, 0.32);
    for (let i = 0; i < 4; i++) {
      const lf = new THREE.Mesh(leafGeo, leafMat);
      const side = i % 2 === 0 ? 1 : -1;
      lf.position.set(-2.05 + side * 0.34, -0.95 + i * 0.52, 0.08);
      lf.rotation.set(0.3, 0, -side * 0.85);
      p1Grp.add(lf);
    }
    const f1Flower = makeSculptedPeaFlower(-2.05, 1.28, purpleMat);
    p1Grp.add(f1Flower);

    tagBioPart(p1Grp, 'parent_p1', 'Cây Bố P₁ (Thân cao · Hoa Tím · AABB)');
    root.add(p1Grp, mendelDynGrp, podGrp);
    interactables.push(p1Grp, podGrp);

    let activePreset: 'monohybrid' | 'dihybrid' | 'testcross' | null = null;
    let pollArcObj: THREE.Object3D | null = null;
    let podShell: THREE.Mesh | null = null;
    let peaMeshes: THREE.Mesh[] = [];
    let barMeshes: Array<{ mesh: THREE.Mesh; targetH: number }> = [];
    let ratioLabelObj: THREE.Object3D | null = null;
    let targetY = 1.25;
    let podReveal = 0;

    const rebuildMendelDynamic = (preset: 'monohybrid' | 'dihybrid' | 'testcross') => {
      activePreset = preset;
      disposeObjectTreeFull(mendelDynGrp);
      mendelDynGrp.clear();
      disposeObjectTreeFull(podGrp);
      podGrp.clear();
      if (ratioLabelObj && ctx.removeLabel) {
        ctx.removeLabel(ratioLabelObj);
        ratioLabelObj = null;
      }

      const isDihybrid = preset === 'dihybrid';
      const isTest = preset === 'testcross';
      const p2TopY = isDihybrid ? 1.18 : 0.25;

      mendelDynGrp.add(...makeSculptedPot(0));
      const stem2 = new THREE.Mesh(
        makeTube([[0, -1.55, 0], [0.08, -0.75, 0.04], [-0.04, p2TopY, 0.08]], 0.075, 20, 10),
        stemMat
      );
      mendelDynGrp.add(stem2);
      const fl2 = makeSculptedPeaFlower(-0.04, p2TopY + 0.06, isDihybrid ? purpleMat : whiteMat);
      mendelDynGrp.add(fl2);
      targetY = p2TopY + 0.12;
      tagBioPart(mendelDynGrp, 'f1_plant', isDihybrid ? 'Cây F₁ dị hợp (AaBb · Hoa Tím)' : 'Cây P₂ đồng hợp lặn (aa/aabb · Hoa Trắng)');
      if (!interactables.includes(mendelDynGrp)) interactables.push(mendelDynGrp);

      pollArcObj = createCrispLine2(
        [[-2.05, 1.35, 0.15], [-1.02, 1.98, 0.28], [-0.04, targetY, 0.15]],
        { color: 0xfacc15, linewidth: 2.5, dashed: true }
      );
      pollArcObj.visible = false;
      mendelDynGrp.add(pollArcObj);

      // Sculpted Pea Pod + Textured/Wrinkled Seeds
      podShell = new THREE.Mesh(
        makeSculptedBlob(1.15, 0.34, 0.36, seg, 14, (v) => {
          v.y += Math.pow(v.x, 2) * 0.12;
        }),
        vault.getMaterial('plant_epidermis', { opacity: 0.44, transparent: true, side: THREE.DoubleSide })
      );
      podShell.position.set(-1.02, -1.32, 1.15);
      podGrp.add(podShell);

      const seedSpecs = isDihybrid
        ? [yellowPeaMat, yellowPeaMat, yellowPeaMat, greenPeaMat]
        : [yellowPeaMat, isTest ? greenPeaMat : yellowPeaMat, yellowPeaMat, greenPeaMat];
      peaMeshes = [];
      seedSpecs.forEach((sMat, idx) => {
        const wrinkled = idx === 3;
        const seedGeo = makeSculptedBlob(0.21, 0.19, 0.21, 18, 14, (v, n) => {
          if (wrinkled) v.addScaledVector(n, Math.sin(n.x * 9) * Math.cos(n.y * 9) * 0.032);
        });
        const pea = new THREE.Mesh(seedGeo, sMat);
        pea.position.set(-1.68 + idx * 0.44, -1.32, 1.15);
        podGrp.add(pea);
        peaMeshes.push(pea);
      });
      tagBioPart(podGrp, 'f2_pod_seeds', 'Quả đậu F₂ & Hạt Vàng Trơn / Xanh Nhăn');

      const barSpecs = isDihybrid
        ? [
            { h: 2.25, col: 0xfacc15, lbl: '9/16 Vàng Trơn' },
            { h: 0.75, col: 0xf97316, lbl: '3/16 Vàng Nhăn' },
            { h: 0.75, col: 0x22c55e, lbl: '3/16 Xanh Trơn' },
            { h: 0.25, col: 0x15803d, lbl: '1/16 Xanh Nhăn' }
          ]
        : isTest
        ? [
            { h: 1.0, col: 0xfacc15, lbl: '1/4 AaBb' },
            { h: 1.0, col: 0xf97316, lbl: '1/4 Aabb' },
            { h: 1.0, col: 0x22c55e, lbl: '1/4 aaBb' },
            { h: 1.0, col: 0x15803d, lbl: '1/4 aabb' }
          ]
        : [
            { h: 2.1, col: 0x9333ea, lbl: '3/4 Trội (A_)' },
            { h: 0.7, col: 0xe2e8f0, lbl: '1/4 Lặn (aa)' }
          ];
      barMeshes = [];
      barSpecs.forEach((b, idx) => {
        const bx = 1.35 + idx * 0.56;
        const bar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.22, b.h, 18),
          vault.getMaterial('lipid_membrane', { color: b.col })
        );
        bar.position.set(bx, -1.9 + b.h * 0.5, 0);
        mendelDynGrp.add(bar);
        barMeshes.push({ mesh: bar, targetH: b.h });
      });

      if (addLabel) {
        ratioLabelObj = addLabel(
          isDihybrid ? 'Tỉ lệ F₂: 9 : 3 : 3 : 1' : isTest ? 'Lai phân tích 1 : 1 : 1 : 1' : 'Phân li F₂: 3 : 1',
          [2.3, 1.55, 0],
          0x86efac,
          [1.6, 0.45, 0]
        );
      }
    };

    if (addLabel) {
      addLabel('Thụ phấn chéo P₁ ♂ → P₂/F₁ ♀', [-1.85, 2.15, 0.15], 0xfde047, [-1.0, 1.45, 0.1]);
    }
    rebuildMendelDynamic(mendelPresetRef?.current || 'dihybrid');

    animatedTickers.push((t, dt) => {
      const exp = explodeRef.current;
      const preset = mendelPresetRef?.current || 'dihybrid';
      if (activePreset !== preset) rebuildMendelDynamic(preset);

      const poll = Boolean(expFlagsRef.current.pollinated);
      const pod = Boolean(expFlagsRef.current.podOpened);
      if (pollArcObj) pollArcObj.visible = poll;
      podReveal = THREE.MathUtils.damp(podReveal, pod ? 1 : 0, 5, dt);

      if (podShell) {
        podShell.visible = podReveal > 0.03;
        podShell.scale.setScalar(Math.max(0.01, podReveal));
        (podShell.material as THREE.MeshPhysicalMaterial).opacity = xrayRef.current ? 0.18 : 0.44;
      }
      peaMeshes.forEach((pm) => {
        pm.visible = podReveal > 0.03;
        pm.scale.setScalar(Math.max(0.01, podReveal));
      });
      barMeshes.forEach((be) => {
        be.mesh.visible = podReveal > 0.03;
        const sy = Math.max(0.01, podReveal);
        be.mesh.scale.y = sy;
        be.mesh.position.y = -1.9 + be.targetH * 0.5 * sy;
      });

      p1Grp.position.x = -exp * 0.55;
      podGrp.position.z = exp * 0.65;
      f1Flower.scale.setScalar(1 + Math.sin(t * 2.8) * 0.05);
    });
    return true;
  }

  // =========================================================================
  // 2. POPULATION GENETICS (Hardy–Weinberg Phenotype Clusters & Frequency Pillars)
  // =========================================================================
  if (mode === 'population_genetics_3d') {
    const grpAA = new THREE.Group();
    const grpAa = new THREE.Group();
    const grpaa = new THREE.Group();

    const makeSpecimens = (parent: THREE.Group, count: number, cx: number, col: number) => {
      const mat = vault.getMaterial('lipid_membrane', { color: col });
      const capMat = vault.getMaterial('cartilage', { color: 0xf8fafc });
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 2.2, 24), mat);
      pillar.position.set(cx, -0.75, 0);
      parent.add(pillar);
      parent.userData.__pillar = pillar;

      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2;
        const r = 0.52 + (i % 2) * 0.18;
        const body = new THREE.Mesh(
          makeSculptedBlob(0.16, 0.12, 0.12, 14, 10, (v) => {
            v.x *= 1.15;
          }),
          mat
        );
        body.position.set(cx + Math.cos(ang) * r, -1.62 + (i % 3) * 0.12, 0.85 + Math.sin(ang) * 0.35);
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.24), capMat);
        wing.position.y = 0.08;
        body.add(wing);
        parent.add(body);
      }
    };

    makeSpecimens(grpAA, 6, -1.55, 0x38bdf8);
    makeSpecimens(grpAa, 8, 0, 0x10b981);
    makeSpecimens(grpaa, 5, 1.55, 0xf43f5e);

    // Parabolic Hardy-Weinberg equilibrium ridge tube connecting the 3 genotype columns
    const ridgePts: Array<[number, number, number]> = [
      [-1.55, -0.35, -0.65],
      [-0.75, 0.45, -0.65],
      [0, 0.72, -0.65],
      [0.75, 0.45, -0.65],
      [1.55, -0.35, -0.65]
    ];
    const hwArc = new THREE.Mesh(makeTube(ridgePts, 0.06, 28, 10), vault.getMaterial('endocrine_gland'));
    root.add(hwArc);

    tagBioPart(grpAA, 'genotype_AA', 'Kiểu gen Đồng hợp Trội AA (p²)');
    tagBioPart(grpAa, 'genotype_Aa', 'Kiểu gen Dị hợp Aa (2pq)');
    tagBioPart(grpaa, 'genotype_aa', 'Kiểu gen Đồng hợp Lặn aa (q²)');

    root.add(grpAA, grpAa, grpaa);
    interactables.push(grpAA, grpAa, grpaa);

    if (addLabel) addLabel('Cân bằng Hardy–Weinberg: p² + 2pq + q² = 1', [0, 1.55, 0], 0x7dd3fc);

    animatedTickers.push((t, dt) => {
      const exp = explodeRef.current;
      const pf = modeParamsRef.current.pFreq ?? 0.6;
      const qf = 1 - pf;
      const inbreed = Boolean(expFlagsRef.current.inbreeding);
      const vals = [
        Math.max(0.06, pf * pf + (inbreed ? 0.5 * pf * qf : 0)),
        Math.max(0.06, inbreed ? pf * qf : 2 * pf * qf),
        Math.max(0.06, qf * qf + (inbreed ? 0.5 * pf * qf : 0))
      ];
      [grpAA, grpAa, grpaa].forEach((grp, idx) => {
        const pillar = grp.userData.__pillar as THREE.Mesh;
        const targetSy = vals[idx] * 1.25;
        pillar.scale.y = THREE.MathUtils.damp(pillar.scale.y, targetSy, 6, dt);
        pillar.position.y = -1.85 + 2.2 * 0.5 * pillar.scale.y;
        grp.position.x = (idx - 1) * exp * 0.45;
      });
      hwArc.position.y = Math.sin(t * 1.5) * 0.04;
    });
    return true;
  }

  // =========================================================================
  // 3. BIOTECH PCR THERMOCYCLER & CRISPR–CAS9 COMPLEX
  // =========================================================================
  if (mode === 'biotech_pcr_crispr_3d') {
    const dnaGrp = new THREE.Group();
    const cas9Grp = new THREE.Group();
    const primerGrp = new THREE.Group();

    const strandAMat = vault.getMaterial('protein_globular', { color: 0x38bdf8 });
    const strandBMat = vault.getMaterial('arterial_vessel', { color: 0xf43f5e });
    const rungMat = vault.getMaterial('cartilage');
    const casMat = vault.getMaterial('lipid_membrane', { color: 0x8b5cf6, opacity: 0.42, transparent: true });

    // Sculpted double helical template strands
    const strandA = new THREE.Mesh(
      makeTube([[-2.1, 0.35, 0.25], [-1.05, 0.38, -0.22], [0, 0.32, 0.25], [1.05, 0.36, -0.22], [2.1, 0.35, 0.25]], 0.1, 32, 10),
      strandAMat
    );
    const strandB = new THREE.Mesh(
      makeTube([[-2.1, -0.35, -0.25], [-1.05, -0.38, 0.22], [0, -0.32, -0.25], [1.05, -0.36, 0.22], [2.1, -0.35, -0.25]], 0.1, 32, 10),
      strandBMat
    );
    dnaGrp.add(strandA, strandB);
    for (let i = -5; i <= 5; i++) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.62, 8), rungMat);
      rung.position.set(i * 0.36, 0, 0);
      dnaGrp.add(rung);
    }

    // Bilobed Cas9 / Taq Polymerase globular enzyme sculpted with cleft
    const cas9Lobe1 = new THREE.Mesh(makeSculptedBlob(1.05, 0.68, 0.85, seg, 14), casMat);
    cas9Lobe1.position.set(0, 0.42, 0);
    const cas9Lobe2 = new THREE.Mesh(makeSculptedBlob(1.0, 0.56, 0.8, seg, 14), casMat);
    cas9Lobe2.position.set(0, -0.36, 0);
    cas9Grp.add(cas9Lobe1, cas9Lobe2);

    // sgRNA + Primer guide ribbon with base teeth
    const guideTube = new THREE.Mesh(
      makeTube([[-1.15, 0.14, 0.32], [-0.4, 0.22, 0.42], [0.45, 0.12, 0.35], [0.95, -0.05, 0.2]], 0.075, 24, 10),
      vault.getMaterial('endocrine_gland', { color: 0xfacc15 })
    );
    primerGrp.add(guideTube);

    tagBioPart(dnaGrp, 'pcr_template', 'Mạch DNA Khuôn & Liên kết Hydro');
    tagBioPart(cas9Grp, 'cas9_taq', 'Phức hệ Enzyme Cas9 / Taq Polymerase');
    tagBioPart(primerGrp, 'primer_sgrna', 'Đoạn mồi PCR / sgRNA dẫn đường');

    root.add(dnaGrp, cas9Grp, primerGrp);
    interactables.push(dnaGrp, cas9Grp, primerGrp);

    if (addLabel) addLabel('Chu kì PCR (95°C → 55°C → 72°C) & CRISPR–Cas9', [0, 1.8, 0], 0xd8b4fe);

    animatedTickers.push((t, dt) => {
      const exp = explodeRef.current;
      const temp = modeParamsRef.current.tempC ?? 72;
      const isDenature = temp >= 88;
      const isAnneal = temp <= 60;
      const sep = isDenature ? 0.58 : isAnneal ? 0.24 : 0.08;
      strandA.position.y = THREE.MathUtils.damp(strandA.position.y, sep, 5, dt);
      strandB.position.y = THREE.MathUtils.damp(strandB.position.y, -sep, 5, dt);
      const px = isDenature ? -0.9 : isAnneal ? -0.45 : -0.6 + ((t * 0.9) % 1.8);
      const py = isDenature ? -0.95 : 0;
      primerGrp.position.x = THREE.MathUtils.damp(primerGrp.position.x, px, 5, dt);
      primerGrp.position.y = THREE.MathUtils.damp(primerGrp.position.y, py, 5, dt);
      cas9Grp.position.z = exp * 0.65;
      casMat.opacity = xrayRef.current ? 0.18 : 0.42;
    });
    return true;
  }

  // =========================================================================
  // 4. GENE LINKAGE & CROSSOVER CHIASMA (Morgan Chromosomes + Loci + Telomeres)
  // =========================================================================
  if (mode === 'gene_linkage_3d') {
    const chrAGrp = new THREE.Group();
    const chrBGrp = new THREE.Group();
    const chiasmaGrp = new THREE.Group();

    const makeChromatid = (color: number, bandColor: number, xOffset: number) => {
      const g = new THREE.Group();
      const mat = vault.getMaterial('lipid_membrane', { color });
      const locusMat = vault.getMaterial('endocrine_gland', { color: bandColor });
      const arm = new THREE.Mesh(
        makeTube([[xOffset, -1.45, 0], [xOffset * 0.4, 0, 0], [xOffset, 1.45, 0]], 0.2, 24, 14, (t) =>
          1 - Math.exp(-Math.pow((t - 0.5) * 9, 2)) * 0.45
        ),
        mat
      );
      g.add(arm);
      const telTop = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 12), locusMat);
      telTop.position.set(xOffset, 1.45, 0);
      const locus = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.045, 10, 20), locusMat);
      locus.rotation.x = Math.PI / 2;
      locus.position.set(xOffset * 0.72, 0.68, 0);
      const locus2 = locus.clone();
      locus2.position.set(xOffset * 0.72, -0.68, 0);
      g.add(telTop, locus, locus2);
      return g;
    };

    chrAGrp.add(makeChromatid(0x38bdf8, 0xfef08a, -0.52));
    chrBGrp.add(makeChromatid(0xf43f5e, 0x34d399, 0.52));

    const chiasmaSphere = new THREE.Mesh(
      makeSculptedBlob(0.32, 0.24, 0.28, 16, 14),
      vault.getMaterial('endocrine_gland', { color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.45 })
    );
    chiasmaSphere.position.set(0, -0.42, 0.05);
    chiasmaGrp.add(chiasmaSphere);

    tagBioPart(chrAGrp, 'homolog_AB', 'NST Tương đồng mang gen liên kết AB');
    tagBioPart(chrBGrp, 'homolog_ab', 'NST Tương đồng mang gen liên kết ab');
    tagBioPart(chiasmaGrp, 'chiasma_node', 'Điểm bắt chéo Chiasma (Tái tổ hợp Ab, aB)');

    root.add(chrAGrp, chrBGrp, chiasmaGrp);
    interactables.push(chrAGrp, chrBGrp, chiasmaGrp);

    if (addLabel) addLabel('Hoán vị Gen Morgan & Điểm bắt chéo Chiasma', [0, 1.85, 0], 0xfde047);

    animatedTickers.push((t, dt) => {
      const exp = explodeRef.current;
      const cross = Boolean(expFlagsRef.current.crossover) && (modeParamsRef.current.fPct ?? 20) > 0;
      chiasmaGrp.visible = cross;
      const angle = cross ? 0.22 + ((modeParamsRef.current.fPct ?? 20) / 50) * 0.14 : 0;
      chrAGrp.rotation.z = THREE.MathUtils.damp(chrAGrp.rotation.z, -angle, 5, dt);
      chrBGrp.rotation.z = THREE.MathUtils.damp(chrBGrp.rotation.z, angle, 5, dt);
      chrAGrp.position.x = (cross ? -0.18 : -0.45) - exp * 0.4;
      chrBGrp.position.x = (cross ? 0.18 : 0.45) + exp * 0.4;
      if (cross) chiasmaSphere.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
    });
    return true;
  }

  // =========================================================================
  // 5. FLOWER ANATOMY, DOUBLE FERTILIZATION & SEED FRUIT
  // =========================================================================
  if (mode === 'plant_flower_seed_3d') {
    const calyxGrp = new THREE.Group();
    const petalGrp = new THREE.Group();
    const stamenGrp = new THREE.Group();
    const pistilGrp = new THREE.Group();

    const stem = new THREE.Mesh(makeTube([[0, -1.9, 0], [0, -1.1, 0], [0, -0.58, 0]], 0.11, 14, 10), vault.getMaterial('plant_xylem'));
    const receptacle = new THREE.Mesh(makeSculptedBlob(0.45, 0.26, 0.45, 16, 12), vault.getMaterial('plant_epidermis'));
    receptacle.position.set(0, -0.56, 0);
    calyxGrp.add(stem, receptacle);

    const sepalGeo = makeLeafBladeGeometry(0.75, 0.28);
    for (let s = 0; s < 5; s++) {
      const a = (s / 5) * Math.PI * 2;
      const sep = new THREE.Mesh(sepalGeo, vault.getMaterial('plant_epidermis'));
      sep.position.set(Math.cos(a) * 0.48, -0.55, Math.sin(a) * 0.48);
      sep.rotation.set(Math.PI * 0.44, -a + Math.PI / 2, 0);
      calyxGrp.add(sep);
    }

    const petalGeo = makeLeafBladeGeometry(1.18, 0.62);
    const petalMat = vault.getMaterial('lipid_membrane', { color: 0xf472b6, side: THREE.DoubleSide });
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2 + 0.25;
      const pet = new THREE.Mesh(petalGeo, petalMat);
      pet.position.set(Math.cos(a) * 0.72, -0.15, Math.sin(a) * 0.72);
      pet.rotation.set(0.65, -a + Math.PI / 2, 0);
      petalGrp.add(pet);
    }

    const anthMat = vault.getMaterial('endocrine_gland', { color: 0xfacc15 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const fil = new THREE.Mesh(
        makeTube([[Math.cos(a) * 0.24, -0.4, Math.sin(a) * 0.24], [Math.cos(a) * 0.5, 0.35, Math.sin(a) * 0.5]], 0.032, 12, 8),
        vault.getMaterial('cartilage', { color: 0xfef08a })
      );
      const anther = new THREE.Mesh(makeSculptedBlob(0.11, 0.16, 0.08, 12, 10), anthMat);
      anther.position.set(Math.cos(a) * 0.5, 0.42, Math.sin(a) * 0.5);
      stamenGrp.add(fil, anther);
    }

    const ovaryMat = vault.createUniqueMaterial('plant_epidermis', { color: 0x4ade80, opacity: 0.48, transparent: true, side: THREE.DoubleSide });
    const ovary = new THREE.Mesh(makeSculptedBlob(0.46, 0.54, 0.46, 18, 14), ovaryMat);
    ovary.position.set(0, -0.05, 0);
    const style = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.72, 14), vault.getMaterial('plant_epidermis'));
    style.position.set(0, 0.58, 0);
    const stigma = new THREE.Mesh(makeSculptedBlob(0.18, 0.1, 0.18, 14, 10), vault.getMaterial('endocrine_gland'));
    stigma.position.set(0, 0.96, 0);
    pistilGrp.add(ovary, style, stigma);

    for (let o = 0; o < 3; o++) {
      const ovule = new THREE.Mesh(makeSculptedBlob(0.14, 0.11, 0.11, 12, 10), vault.getMaterial('cartilage', { color: 0xfde047 }));
      ovule.position.set((o - 1) * 0.16, -0.08 + (o % 2) * 0.12, 0.06);
      pistilGrp.add(ovule);
    }

    const pollenTube = new THREE.Mesh(
      makeTube([[0, 0.98, 0.04], [0.05, 0.45, 0.06], [0, -0.04, 0.06]], 0.025, 16, 8),
      anthMat
    );
    pistilGrp.add(pollenTube);

    tagBioPart(calyxGrp, 'calyx_stem', 'Cuống hoa, Đế hoa & Đài hoa xanh');
    tagBioPart(petalGrp, 'corolla_petals', 'Tràng Cánh hoa thu hút thụ phấn');
    tagBioPart(stamenGrp, 'stamen_anthers', 'Nhị hoa (Chỉ nhị & Bao phấn)');
    tagBioPart(pistilGrp, 'pistil_ovules', 'Nhụy hoa (Đầu nhụy · Bầu nhụy · Noãn)');

    root.add(calyxGrp, petalGrp, stamenGrp, pistilGrp);
    interactables.push(calyxGrp, petalGrp, stamenGrp, pistilGrp);

    if (addLabel) addLabel('Hoa lưỡng tính, Thụ tinh kép & Noãn → Hạt', [0, 1.65, 0], 0xf9a8d4);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const pollProgress = Math.min(1, Math.max(0.1, (modeParamsRef.current.pollination ?? 60) / 100));
      pollenTube.scale.y = pollProgress;
      ovaryMat.opacity = xrayRef.current ? 0.25 : 0.48;
      petalGrp.position.y = -exp * 0.25;
      stamenGrp.position.y = exp * 0.35;
      pistilGrp.position.y = exp * 0.6;
      petalGrp.children.forEach((p, idx) => {
        p.rotation.x = 0.65 + exp * 0.35 + Math.sin(t * 1.4 + idx) * 0.03;
      });
    });
    return true;
  }

  // =========================================================================
  // 6. COMPARATIVE VERTEBRATE HEARTS (2-Chamber Fish -> 3-Chamber Frog -> 4-Chamber Mammal)
  // =========================================================================
  if (mode === 'comparative_hearts_3d') {
    const fishHeart = makeSculptedHeart(vault, 2, seg);
    fishHeart.position.set(-1.75, 0, 0);
    const frogHeart = makeSculptedHeart(vault, 3, seg);
    frogHeart.position.set(0, 0, 0);
    const mammalHeart = makeSculptedHeart(vault, 4, seg);
    mammalHeart.position.set(1.75, 0, 0);

    tagBioPart(fishHeart, 'fish_heart', 'Tim Cá 2 Ngăn (1 Vòng · Máu Đỏ thẫm)');
    tagBioPart(frogHeart, 'amphibian_heart', 'Tim Lưỡng cư 3 Ngăn (2 Vòng · Máu pha)');
    tagBioPart(mammalHeart, 'mammal_heart', 'Tim Chim & Thú 4 Ngăn (Máu tách biệt)');

    root.add(fishHeart, frogHeart, mammalHeart);
    interactables.push(fishHeart, frogHeart, mammalHeart);

    if (addLabel) {
      addLabel('Cá (2 ngăn)', [-1.75, 1.35, 0], 0x38bdf8, [-1.75, 0.75, 0]);
      addLabel('Lưỡng cư (3 ngăn)', [0, 1.35, 0], 0xc084fc, [0, 0.75, 0]);
      addLabel('Chim & Thú (4 ngăn)', [1.75, 1.35, 0], 0xfb7185, [1.75, 0.75, 0]);
    }

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const bpm = modeParamsRef.current.heartRate ?? 70;
      const pulse = 1 + Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6) * 0.09;
      fishHeart.scale.setScalar(pulse);
      frogHeart.scale.setScalar(pulse);
      mammalHeart.scale.setScalar(pulse);
      fishHeart.position.x = -1.75 - exp * 0.45;
      mammalHeart.position.x = 1.75 + exp * 0.45;
    });
    return true;
  }

  // =========================================================================
  // 7. HUMAN DIGESTIVE TRACT (Esophagus -> Cutaway J-Stomach -> Liver -> Intestines)
  // =========================================================================
  if (mode === 'digestive_tract_3d') {
    const esoStomachGrp = new THREE.Group();
    const liverPancreasGrp = new THREE.Group();
    const intestineGrp = new THREE.Group();

    const esoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 1.75, -0.05),
      new THREE.Vector3(-0.22, 1.15, 0),
      new THREE.Vector3(-0.18, 0.68, 0.05)
    ]);
    const esophagus = new THREE.Mesh(new THREE.TubeGeometry(esoCurve, 18, 0.12, 12, false), vault.getMaterial('gastric_mucosa'));

    // Cutaway J-Stomach showing inner gastric folds
    const stomach = new THREE.Mesh(
      makeSculptedBlob(0.56, 0.64, 0.36, seg, 16, (v) => {
        v.x += Math.sin((v.y + 0.5) * 2.2) * 0.22;
        if (v.y < -0.25) v.x += 0.22;
      }),
      vault.getMaterial('gastric_mucosa', { color: 0xea580c })
    );
    stomach.position.set(0.18, 0.28, 0.08);
    esoStomachGrp.add(esophagus, stomach);

    // Wedge Liver + Gallbladder + Pancreas
    const liver = new THREE.Mesh(
      makeSculptedBlob(0.76, 0.42, 0.42, seg, 14, (v) => {
        if (v.y < 0) v.y *= 0.45 - 0.35 * (v.x / 0.76);
      }),
      vault.getMaterial('liver_parenchyma')
    );
    liver.position.set(-0.58, 0.45, 0.12);
    const gall = new THREE.Mesh(makeSculptedBlob(0.12, 0.2, 0.12, 12, 10), vault.getMaterial('plant_epidermis'));
    gall.position.set(-0.32, 0.15, 0.28);
    const pancreas = new THREE.Mesh(
      makeTube([[-0.1, 0.08, -0.15], [0.35, 0.15, -0.18], [0.75, 0.22, -0.2]], 0.11, 14, 10, (t) => 1.2 - t * 0.55),
      vault.getMaterial('endocrine_gland')
    );
    liverPancreasGrp.add(liver, gall, pancreas);

    // Coiled Small Intestine + Haustrated Large Intestine
    const smallPts: Array<[number, number, number]> = [];
    for (let i = 0; i < 24; i++) {
      const u = i / 23;
      smallPts.push([Math.sin(u * Math.PI * 5) * 0.56, -0.25 - u * 0.92, Math.cos(u * Math.PI * 5) * 0.22 + 0.08]);
    }
    const smallInt = new THREE.Mesh(makeTube(smallPts, 0.11, 44, 10), vault.getMaterial('gastric_mucosa', { color: 0xfba482 }));

    const colonPts: Array<[number, number, number]> = [
      [-0.78, -1.25, 0],
      [-0.82, -0.35, 0],
      [0, -0.24, 0.1],
      [0.82, -0.35, 0],
      [0.78, -1.25, 0],
      [0.12, -1.55, -0.05]
    ];
    const colonGeo = makeTube(colonPts, 0.17, 40, 12);
    const largeInt = new THREE.Mesh(colonGeo, vault.getMaterial('gastric_mucosa', { color: 0xb45309 }));

    // Animated bolus traveling along digestive tract
    const bolus = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), vault.getMaterial('endocrine_gland', { color: 0xfacc15 }));
    intestineGrp.add(smallInt, largeInt, bolus);

    tagBioPart(esoStomachGrp, 'stomach_esophagus', 'Thực quản & Dạ dày (Axit HCl + Pepsin)');
    tagBioPart(liverPancreasGrp, 'liver_pancreas', 'Gan, Túi mật & Tuyến Tụy');
    tagBioPart(intestineGrp, 'intestines', 'Ruột non Hấp thụ & Khung Đại tràng');

    root.add(esoStomachGrp, liverPancreasGrp, intestineGrp);
    interactables.push(esoStomachGrp, liverPancreasGrp, intestineGrp);

    if (addLabel) addLabel('Ống Tiêu hóa Người & Vi nhung mao Hấp thụ', [0, 2.05, 0], 0xfdba74);

    const bolusCurve = new THREE.CatmullRomCurve3(smallPts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const spd = (modeParamsRef.current.enzymeRate ?? 60) / 60;
      const u = (t * 0.18 * spd) % 1;
      bolus.position.copy(bolusCurve.getPoint(u));
      liverPancreasGrp.position.x = -exp * 0.65;
      esoStomachGrp.position.y = exp * 0.4;
      intestineGrp.position.z = exp * 0.55;
      stomach.scale.setScalar(1 + Math.sin(t * 2.1) * 0.028);
    });
    return true;
  }

  // =========================================================================
  // 8. INVERTEBRATE BIODIVERSITY (Hydra, Segmented Earthworm, Spiral Snail, Beetle Arthropod)
  // =========================================================================
  if (mode === 'invertebrate_biodiversity_3d') {
    const hydraGrp = new THREE.Group();
    const wormGrp = new THREE.Group();
    const molluskGrp = new THREE.Group();
    const arthropodGrp = new THREE.Group();

    // 1. Hydra (Cnidarian)
    hydraGrp.position.set(-2.1, -0.5, 0);
    const hBody = new THREE.Mesh(makeTube([[0, -0.8, 0], [0.05, -0.1, 0], [0, 0.55, 0]], 0.16, 16, 12, (t) => 0.75 + t * 0.35), vault.getMaterial('lipid_membrane', { color: 0x38bdf8 }));
    hydraGrp.add(hBody);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const tent = new THREE.Mesh(
        makeTube([[0, 0.55, 0], [Math.cos(a) * 0.35, 0.95, Math.sin(a) * 0.35], [Math.cos(a) * 0.62, 1.25, Math.sin(a) * 0.62]], 0.032, 12, 8, (t) => 1 - t * 0.7),
        vault.getMaterial('lipid_membrane', { color: 0x7dd3fc })
      );
      hydraGrp.add(tent);
    }

    // 2. Segmented Earthworm (Annelida)
    wormGrp.position.set(-0.7, -0.65, 0);
    const wormMat = vault.getMaterial('gastric_mucosa', { color: 0xbe123c });
    const clitMat = vault.getMaterial('endocrine_gland', { color: 0xfda4af });
    for (let s = 0; s < 14; s++) {
      const ring = new THREE.Mesh(
        makeSculptedBlob(0.14, 0.14, 0.16, 12, 10),
        s >= 4 && s <= 6 ? clitMat : wormMat
      );
      ring.position.set(Math.sin(s * 0.35) * 0.16, s * 0.14 - 0.6, Math.cos(s * 0.35) * 0.14);
      wormGrp.add(ring);
    }

    // 3. Helical Snail Shell + Muscular Foot (Mollusca)
    molluskGrp.position.set(0.75, -0.55, 0);
    const foot = new THREE.Mesh(makeSculptedBlob(0.42, 0.14, 0.2, 16, 12), vault.getMaterial('cartilage', { color: 0xfef3c7 }));
    foot.position.set(0, -0.45, 0);
    const shellPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const a = u * Math.PI * 3.8;
      const r = 0.08 + u * 0.36;
      shellPts.push([Math.cos(a) * r, -0.15 + u * 0.55, Math.sin(a) * r]);
    }
    const spiralShell = new THREE.Mesh(makeTube(shellPts, 0.18, 28, 12, (t) => 0.35 + t * 0.75), vault.getMaterial('endocrine_gland', { color: 0xf59e0b }));
    molluskGrp.add(foot, spiralShell);

    // 4. Arthropod (Chitin Exoskeleton Head–Thorax–Abdomen + 6 Jointed Legs)
    arthropodGrp.position.set(2.15, -0.45, 0);
    const chitinMat = vault.getMaterial('plant_epidermis', { color: 0x059669 });
    const thorax = new THREE.Mesh(makeSculptedBlob(0.24, 0.22, 0.24, 14, 12), chitinMat);
    const abdomen = new THREE.Mesh(makeSculptedBlob(0.32, 0.26, 0.42, 16, 12), chitinMat);
    abdomen.position.set(0, -0.1, -0.45);
    const head = new THREE.Mesh(makeSculptedBlob(0.18, 0.16, 0.18, 12, 10), chitinMat);
    head.position.set(0, 0.05, 0.32);
    arthropodGrp.add(thorax, abdomen, head);
    for (let l = -1; l <= 1; l++) {
      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(
          makeTube([[side * 0.2, 0, l * 0.18], [side * 0.48, 0.18, l * 0.22], [side * 0.62, -0.35, l * 0.25]], 0.03, 10, 8),
          chitinMat
        );
        arthropodGrp.add(leg);
      }
    }

    tagBioPart(hydraGrp, 'cnidaria_hydra', 'Ngành Ruột khoang (Thủy tức)');
    tagBioPart(wormGrp, 'annelid_worm', 'Ngành Giun đốt (Giun đất phân đốt)');
    tagBioPart(molluskGrp, 'mollusk_snail', 'Ngành Thân mềm (Ốc xoắn vỏ đá vôi)');
    tagBioPart(arthropodGrp, 'arthropod_insect', 'Ngành Chân khớp (Vỏ Kitin & Chân đốt)');

    root.add(hydraGrp, wormGrp, molluskGrp, arthropodGrp);
    interactables.push(hydraGrp, wormGrp, molluskGrp, arthropodGrp);

    if (addLabel) addLabel('4 Ngành Động vật Không xương sống', [0, 1.55, 0], 0x34d399);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      hydraGrp.position.x = -2.1 - exp * 0.3;
      arthropodGrp.position.x = 2.15 + exp * 0.3;
      hydraGrp.rotation.y = Math.sin(t * 1.1) * 0.25;
      arthropodGrp.position.y = -0.45 + Math.sin(t * 2.5) * 0.06;
    });
    return true;
  }

  // =========================================================================
  // 9. PLANT GERMINATION, AUXIN PHOTOTROPISM & GRAVITROPISM
  // =========================================================================
  if (mode === 'plant_tropism_germination_3d') {
    const soilGrp = new THREE.Group();
    const rootGrp = new THREE.Group();
    const shootGrp = new THREE.Group();

    const soil = new THREE.Mesh(
      makeSculptedBlob(2.2, 0.48, 1.6, 20, 14, (v) => {
        if (v.y > 0) v.y *= 0.2;
      }),
      vault.getMaterial('soil_terrain')
    );
    soil.position.set(0, -1.05, 0);
    soilGrp.add(soil);

    const seedCot = new THREE.Mesh(makeSculptedBlob(0.3, 0.22, 0.24, 16, 12), vault.getMaterial('endocrine_gland', { color: 0xfde047 }));
    seedCot.position.set(0, -0.82, 0);
    soilGrp.add(seedCot);

    // Taproot + lateral root hairs (positive gravitropism)
    const rootMat = vault.getMaterial('cartilage', { color: 0xfef3c7 });
    rootGrp.add(
      new THREE.Mesh(makeTube([[0, -0.85, 0], [0.05, -1.25, 0.04], [-0.04, -1.68, -0.02]], 0.07, 16, 10, (t) => 1 - t * 0.72), rootMat)
    );
    for (let r = 0; r < 5; r++) {
      const side = r % 2 === 0 ? 1 : -1;
      rootGrp.add(
        new THREE.Mesh(
          makeTube([[0, -1.0 - r * 0.12, 0], [side * 0.38, -1.18 - r * 0.12, (r - 2) * 0.12]], 0.026, 10, 8, (t) => 1 - t * 0.7),
          rootMat
        )
      );
    }

    // Phototropic bending stem + leaves + Sun sphere
    const stemCurvePts = [
      new THREE.Vector3(0, -0.78, 0),
      new THREE.Vector3(0.08, 0.05, 0),
      new THREE.Vector3(0.28, 0.85, 0)
    ];
    const stemMesh = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stemCurvePts), 20, 0.075, 10, false),
      vault.getMaterial('plant_xylem')
    );
    const leafGeo = makeLeafBladeGeometry(0.68, 0.34);
    const leaf1 = new THREE.Mesh(leafGeo, vault.getMaterial('plant_epidermis'));
    const leaf2 = new THREE.Mesh(leafGeo, vault.getMaterial('plant_epidermis'));
    const sunOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 14),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    shootGrp.add(stemMesh, leaf1, leaf2, sunOrb);

    tagBioPart(soilGrp, 'seed_soil', 'Hạt nảy mầm & Tầng đất ẩm');
    tagBioPart(rootGrp, 'root_gravitropism', 'Rễ cọc & Rễ phụ (Hướng trọng lực +)');
    tagBioPart(shootGrp, 'shoot_phototropism', 'Thân uốn theo Ánh sáng (Auxin) & Lá');

    root.add(soilGrp, rootGrp, shootGrp);
    interactables.push(soilGrp, rootGrp, shootGrp);

    if (addLabel) addLabel('Hạt nảy mầm · Auxin Hướng sáng & Hướng đất', [0, 1.9, 0], 0x86efac);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const sunAngleDeg = modeParamsRef.current.sunAngle ?? 35;
      const rad = THREE.MathUtils.degToRad(sunAngleDeg);
      const sx = Math.sin(rad) * 2.35;
      const sy = Math.cos(rad) * 1.95 + 0.3;
      sunOrb.position.set(sx, sy, 0.35);
      const bend = Math.sin(rad) * 0.72;
      leaf1.position.set(bend * 0.85 - 0.25, 0.65, 0.12);
      leaf1.rotation.set(0.35, 0, 0.85 - bend * 0.4);
      leaf2.position.set(bend * 0.85 + 0.28, 0.78, -0.1);
      leaf2.rotation.set(-0.3, 0, -0.85 - bend * 0.4);
      shootGrp.rotation.z = -bend * 0.42;
      rootGrp.position.y = -exp * 0.45;
      sunOrb.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
    });
    return true;
  }

  // =========================================================================
  // 10. MUSCULOSKELETAL LEVER + CUTAWAY EYE & EAR (OSSICLES & COCHLEA)
  // =========================================================================
  if (mode === 'skeleton_senses_3d') {
    const armGrp = new THREE.Group();
    const eyeGrp = new THREE.Group();
    const earGrp = new THREE.Group();

    const boneMat = vault.getMaterial('compact_bone');
    const muscMat = vault.getMaterial('skeletal_muscle');

    // A. Left: Humerus + Elbow Hinge + Ulna/Radius Forearm + Biceps Lever
    armGrp.position.set(-1.55, 0.05, 0);
    const humerus = new THREE.Mesh(
      makeTube([[0, 1.15, 0], [0, 0.55, 0], [0, 0, 0]], 0.12, 14, 10, (t) => 1.15 - Math.sin(t * Math.PI) * 0.25),
      boneMat
    );
    const forearmGrp = new THREE.Group();
    const radiusUlna = new THREE.Mesh(makeTube([[0, 0, 0], [0.55, 0.05, 0], [1.05, 0.1, 0]], 0.09, 14, 10), boneMat);
    forearmGrp.add(radiusUlna);
    const biceps = new THREE.Mesh(makeSculptedBlob(0.18, 0.48, 0.18, 16, 12), muscMat);
    biceps.position.set(0.14, 0.55, 0.1);
    armGrp.add(humerus, forearmGrp, biceps);

    // B. Center: Multi-layer Cutaway Eye (Sclera, Cornea, Iris, Lens, Retina, Optic Nerve)
    eyeGrp.position.set(0.25, 0.05, 0);
    const scleraMat = vault.createUniqueMaterial('cartilage', { color: 0xf8fafc, opacity: 0.48, transparent: true, side: THREE.DoubleSide });
    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.68, seg, 18, 0, Math.PI * 1.45), scleraMat);
    sclera.rotation.y = 0.65;
    const cornea = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 18, 14),
      vault.createUniqueMaterial('lipid_membrane', { color: 0xbae6fd, opacity: 0.42, transparent: true })
    );
    cornea.position.set(0, 0, 0.52);
    cornea.scale.set(0.85, 0.85, 0.48);
    const iris = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.34, 24), vault.getMaterial('lipid_membrane', { color: 0x0ea5e9, side: THREE.DoubleSide }));
    iris.position.set(0, 0, 0.54);
    const eyeLens = new THREE.Mesh(
      makeSculptedBlob(0.26, 0.26, 0.13, 16, 12),
      vault.createUniqueMaterial('lipid_membrane', { color: 0x7dd3fc, opacity: 0.78, transparent: true })
    );
    eyeLens.position.set(0, 0, 0.35);
    const retina = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 18, 14, 0, Math.PI),
      vault.getMaterial('endocrine_gland', { color: 0xf97316, side: THREE.DoubleSide })
    );
    retina.rotation.y = Math.PI * 0.5;
    const opticNerve = new THREE.Mesh(
      makeTube([[0, -0.05, -0.62], [0.08, -0.1, -1.05]], 0.11, 10, 8),
      vault.getMaterial('nerve_myelin')
    );
    eyeGrp.add(sclera, cornea, iris, eyeLens, retina, opticNerve);

    // C. Right: Outer Pinna + Ear Canal + Eardrum + Ossicles + Spiral Cochlea
    earGrp.position.set(1.85, 0.05, 0);
    const canal = new THREE.Mesh(
      makeTube([[-0.55, 0, 0.1], [-0.15, 0.02, 0.05], [0.1, 0.05, 0]], 0.11, 14, 10),
      vault.getMaterial('skin_shell', { opacity: 0.55, transparent: true, side: THREE.DoubleSide })
    );
    const eardrum = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 18), vault.getMaterial('lipid_membrane', { color: 0xfde047 }));
    eardrum.rotation.z = Math.PI / 2;
    eardrum.position.set(0.12, 0.05, 0);
    const ossicles = new THREE.Mesh(
      makeTube([[0.14, 0.05, 0], [0.28, 0.18, 0.04], [0.42, 0.08, 0]], 0.032, 10, 8),
      boneMat
    );
    const cochleaPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 22; i++) {
      const u = i / 22;
      const a = u * Math.PI * 4.5;
      const r = 0.04 + (1 - u) * 0.22;
      cochleaPts.push([0.52 + u * 0.22, Math.sin(a) * r + 0.06, Math.cos(a) * r]);
    }
    const cochlea = new THREE.Mesh(makeTube(cochleaPts, 0.048, 24, 8, (t) => 1 - t * 0.45), vault.getMaterial('nerve_myelin', { color: 0xa855f7 }));
    earGrp.add(canal, eardrum, ossicles, cochlea);

    tagBioPart(armGrp, 'arm_lever', 'Khớp khuỷu, Xương cánh–cẳng tay & Cơ nhị đầu');
    tagBioPart(eyeGrp, 'eye_cutaway', 'Cầu mắt cắt lớp (Giác mạc · Thủy tinh thể · Võng mạc)');
    tagBioPart(earGrp, 'ear_cochlea', 'Tai (Màng nhĩ · Xương con · Ốc tai xoắn)');

    root.add(armGrp, eyeGrp, earGrp);
    interactables.push(armGrp, eyeGrp, earGrp);

    if (addLabel) {
      addLabel('Vận động Xương–Cơ', [-1.55, 1.5, 0], 0xfda4af, [-1.55, 0.9, 0]);
      addLabel('Mắt & Điều tiết', [0.25, 1.3, 0], 0x7dd3fc, [0.25, 0.65, 0]);
      addLabel('Tai & Ốc tai', [1.95, 1.15, 0], 0xd8b4fe, [1.95, 0.3, 0]);
    }

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const flex = (modeParamsRef.current.flexPct ?? 45) / 100;
      const lensD = modeParamsRef.current.lensPower ?? 0;
      forearmGrp.rotation.z = -0.2 + flex * 1.45;
      biceps.scale.set(1 + flex * 0.26, 1 - flex * 0.14, 1 + flex * 0.26);
      eyeLens.scale.z = Math.max(0.6, 1 + lensD * 0.2 + Math.sin(t * 2) * 0.04);
      scleraMat.opacity = xrayRef.current ? 0.22 : 0.48;
      armGrp.position.x = -1.55 - exp * 0.4;
      earGrp.position.x = 1.85 + exp * 0.4;
      eardrum.scale.setScalar(1 + Math.sin(t * 10) * 0.04);
    });
    return true;
  }

  // =========================================================================
  // 11. BIOMOLECULES (Water Cluster, Alpha-Glucose Ring, Protein Folding, Lipid Patch)
  // =========================================================================
  if (mode === 'biomolecules_3d') {
    const waterGrp = new THREE.Group();
    const glucoseGrp = new THREE.Group();
    const proteinGrp = new THREE.Group();
    const lipidGrp = new THREE.Group();

    const oMat = vault.getMaterial('arterial_vessel', { color: 0xef4444 });
    const hMat = vault.getMaterial('cartilage', { color: 0xf1f5f9 });
    const cMat = vault.getMaterial('plant_epidermis', { color: 0x10b981 });

    // Water H-bond network
    const wCoords: Array<[number, number, number]> = [
      [0, 0, 0],
      [1.2, 0.85, 0.42],
      [-1.2, 0.85, -0.42],
      [0.42, -1.02, 1.0],
      [-0.42, -1.02, -1.0]
    ];
    const hBonds: THREE.Mesh[] = [];
    wCoords.forEach(([wx, wy, wz], idx) => {
      const m = new THREE.Group();
      m.position.set(wx, wy, wz);
      const ox = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 16), oMat);
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), hMat);
      h1.position.set(0.32, 0.24, 0);
      const h2 = h1.clone();
      h2.position.set(-0.32, 0.24, 0);
      m.add(ox, h1, h2);
      waterGrp.add(m);
      if (idx > 0) {
        const bond = new THREE.Mesh(makeTube([[0, 0, 0], [wx, wy, wz]], 0.025, 10, 6), vault.getMaterial('lipid_membrane', { color: 0x38bdf8, opacity: 0.72, transparent: true }));
        waterGrp.add(bond);
        hBonds.push(bond);
      }
    });

    // Alpha-Glucose ring + covalent tube ring
    const ringPts: Array<[number, number, number]> = [];
    for (let k = 0; k < 7; k++) {
      const ang = ((k % 6) / 6) * Math.PI * 2;
      const p: [number, number, number] = [Math.cos(ang) * 1.15, (k % 2 === 0 ? 0.16 : -0.16), Math.sin(ang) * 1.15];
      ringPts.push(p);
      if (k < 6) {
        const atom = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 14), k === 0 ? oMat : cMat);
        atom.position.set(...p);
        glucoseGrp.add(atom);
      }
    }
    glucoseGrp.add(new THREE.Mesh(makeTube(ringPts, 0.055, 28, 8), vault.getMaterial('cartilage')));

    // Sculpted Protein helical ribbon & side-chain residues
    const aaCols = [0x10b981, 0x38bdf8, 0xf59e0b, 0xa855f7, 0xf43f5e];
    const aaNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const sp = new THREE.Mesh(
        makeSculptedBlob(0.22, 0.2, 0.22, 14, 12),
        vault.getMaterial('protein_globular', { color: aaCols[i % aaCols.length] })
      );
      proteinGrp.add(sp);
      aaNodes.push(sp);
    }

    // Phospholipid patch
    const headMat = vault.getMaterial('lipid_membrane', { color: 0x0ea5e9 });
    const tailMat = vault.getMaterial('endocrine_gland', { color: 0xf59e0b });
    for (let ix = -1; ix <= 1; ix++) {
      for (let iz = -1; iz <= 1; iz++) {
        const hx = ix * 0.72;
        const hz = iz * 0.72;
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), headMat);
        top.position.set(hx, 0.92, hz);
        const bot = top.clone();
        bot.position.set(hx, -0.92, hz);
        const t1 = new THREE.Mesh(makeTube([[hx - 0.06, 0.75, hz], [hx - 0.1, 0, hz], [hx - 0.06, -0.75, hz]], 0.04, 10, 6), tailMat);
        const t2 = new THREE.Mesh(makeTube([[hx + 0.06, 0.75, hz], [hx + 0.02, 0, hz], [hx + 0.06, -0.75, hz]], 0.04, 10, 6), tailMat);
        lipidGrp.add(top, bot, t1, t2);
      }
    }

    tagBioPart(waterGrp, 'macromolecule', 'Phân tử Nước H₂O & Liên kết Hydro');
    tagBioPart(glucoseGrp, 'macromolecule', 'Vòng α-Glucose (Carbohydrate)');
    tagBioPart(proteinGrp, 'macromolecule', 'Chuỗi Polypeptide Protein bậc 3');
    tagBioPart(lipidGrp, 'macromolecule', 'Lớp kép Phospholipid (Lipid)');

    root.add(waterGrp, glucoseGrp, proteinGrp, lipidGrp);
    interactables.push(waterGrp, glucoseGrp, proteinGrp, lipidGrp);

    if (addLabel) addLabel('Nước & 4 Đại Phân Tử Sinh Học 3D', [0, 2.0, 0], 0x6ee7b7);

    let unfoldProg = 0;
    animatedTickers.push((t, dt) => {
      const grp = Math.round(modeParamsRef.current.molGroup ?? 3);
      const temp = modeParamsRef.current.tempC ?? 37;
      waterGrp.visible = grp === 1;
      glucoseGrp.visible = grp === 2;
      proteinGrp.visible = grp === 3;
      lipidGrp.visible = grp === 4;
      hBonds.forEach((b) => {
        b.visible = Boolean(expFlagsRef.current.showHBonds !== false) && temp < 80;
      });
      unfoldProg = THREE.MathUtils.damp(unfoldProg, grp === 3 && temp > 58 ? 1 : 0, 4, dt);
      aaNodes.forEach((sp, i) => {
        const u = i / 13;
        const ang = u * Math.PI * 4.5 + t * 0.8;
        sp.position.set(
          THREE.MathUtils.lerp(Math.cos(ang) * 0.9, (u - 0.5) * 3.6, unfoldProg),
          THREE.MathUtils.lerp((u - 0.5) * 2.2, Math.sin(u * Math.PI * 2 + t * 3) * 0.25, unfoldProg),
          THREE.MathUtils.lerp(Math.sin(ang) * 0.9, 0, unfoldProg)
        );
      });
      glucoseGrp.rotation.y = t * 0.55;
    });
    return true;
  }

  return false;
}
