import * as THREE from 'three';
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
  radSeg = 12,
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
 * Builds Topic B (Human Biology standalone detailed organs):
 * Heart, Brain (NEW), Liver & GI Organs (NEW), Alveoli & Capillary Bed, Kidney & Nephron,
 * Neuron & Synapse, Endocrine Pancreas, Antibody IgG.
 */
export function buildHumanOrganScene(
  mode: string,
  root: THREE.Group,
  ctx: BioSceneHookContext
): boolean {
  const { vault, isLowEnd, explodeRef, xrayRef, modeParamsRef, expFlagsRef, interactables, animatedTickers } = ctx;
  const seg = isLowEnd ? 18 : 28;

  // =========================================================================
  // 1. HUMAN HEART 4 CHAMBERS + CORONARY TREE
  // =========================================================================
  if (mode === 'human_heart_3d') {
    const lvGrp = new THREE.Group();
    const rvGrp = new THREE.Group();
    const aortaGrp = new THREE.Group();
    const coronaryGrp = new THREE.Group();

    const cardiacMat = vault.createUniqueMaterial('cardiac_muscle', { transparent: true, opacity: 1 });
    const rvMat = vault.createUniqueMaterial('cardiac_muscle', { color: 0x992632, transparent: true, opacity: 1 });
    const artMat = vault.getMaterial('arterial_vessel');
    const veinMat = vault.getMaterial('venous_vessel');

    const lvMesh = new THREE.Mesh(
      makeSculptedBlob(0.72, 1.18, 0.68, seg, seg, (v) => {
        if (v.y < 0) {
          const t = Math.abs(v.y) / 1.18;
          v.x = v.x * (1 - t * 0.56) + t * 0.42;
          v.z = v.z * (1 - t * 0.52) + t * 0.22;
        }
      }),
      cardiacMat
    );
    lvMesh.position.set(0.28, -0.22, -0.05);
    const leftAtrium = new THREE.Mesh(makeSculptedBlob(0.45, 0.42, 0.45, 18, 14), cardiacMat);
    leftAtrium.position.set(0.48, 0.68, -0.18);
    lvGrp.add(lvMesh, leftAtrium);

    const rvMesh = new THREE.Mesh(
      makeSculptedBlob(0.62, 0.98, 0.62, seg, seg, (v) => {
        if (v.y < 0) {
          const t = Math.abs(v.y) / 0.98;
          v.x = v.x * (1 - t * 0.45) + t * 0.16;
        }
      }),
      rvMat
    );
    rvMesh.position.set(-0.34, -0.15, 0.18);
    const rightAtrium = new THREE.Mesh(makeSculptedBlob(0.46, 0.48, 0.46, 18, 14), veinMat);
    rightAtrium.position.set(-0.62, 0.58, 0.05);
    rvGrp.add(rvMesh, rightAtrium);

    // 3-branch Aortic Arch + Pulmonary Trunk + Superior/Inferior Vena Cava
    const aortaArch = new THREE.Mesh(
      makeTube(
        [
          [0.12, 0.35, 0.05],
          [0.1, 1.12, 0.05],
          [0.36, 1.48, -0.08],
          [0.45, 1.1, -0.45],
          [0.25, -0.45, -0.55]
        ],
        0.2,
        36,
        14
      ),
      artMat
    );
    for (let b = 0; b < 3; b++) {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.075, 0.42, 12),
        artMat
      );
      branch.position.set(0.02 + b * 0.2, 1.62, -0.02 - b * 0.06);
      branch.rotation.z = -0.1 + b * 0.1;
      aortaGrp.add(branch);
    }
    const pulmTrunk = new THREE.Mesh(
      makeTube(
        [
          [-0.22, 0.45, 0.25],
          [-0.08, 1.05, 0.2],
          [-0.65, 1.1, -0.05]
        ],
        0.16,
        24,
        12
      ),
      veinMat
    );
    const svc = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.95, 14), veinMat);
    svc.position.set(-0.64, 1.08, -0.02);
    aortaGrp.add(aortaArch, pulmTrunk, svc);

    // Coronary arteries wrapping anterior interventricular groove
    const lad = new THREE.Mesh(
      makeTube(
        [
          [0.05, 0.45, 0.52],
          [0.08, 0.05, 0.62],
          [0.24, -0.55, 0.52],
          [0.45, -1.05, 0.3]
        ],
        0.042,
        24,
        10,
        (t) => 1 - t * 0.55
      ),
      artMat
    );
    const lcx = new THREE.Mesh(
      makeTube(
        [
          [0.05, 0.45, 0.52],
          [0.52, 0.32, 0.42],
          [0.82, 0.05, 0.08]
        ],
        0.036,
        18,
        8,
        (t) => 1 - t * 0.5
      ),
      artMat
    );
    coronaryGrp.add(lad, lcx);

    tagBioPart(lvGrp, 'left_ventricle', 'Tâm thất & Tâm nhĩ Trái');
    tagBioPart(rvGrp, 'right_ventricle', 'Tâm thất & Tâm nhĩ Phải');
    tagBioPart(aortaGrp, 'aorta', 'Cung Động mạch Chủ & Thân Phổi');
    tagBioPart(coronaryGrp, 'coronary', 'Hệ Động mạch Vành');

    root.add(lvGrp, rvGrp, aortaGrp, coronaryGrp);
    interactables.push(lvGrp, rvGrp, aortaGrp, coronaryGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const xRay = xrayRef.current;
      const bpm = expFlagsRef.current.exercise ? Math.max(135, modeParamsRef.current.bpm ?? 145) : (modeParamsRef.current.bpm ?? 72);
      const cycle = (t * (bpm / 60)) % 1;
      const beat = Math.exp(-Math.pow((cycle - 0.22) * 10, 2)) * 0.085;
      root.scale.setScalar(1 + beat);

      cardiacMat.opacity = xRay ? 0.45 : 1;
      rvMat.opacity = xRay ? 0.45 : 1;
      lvGrp.position.x = exp * 0.55;
      rvGrp.position.x = -exp * 0.55;
      aortaGrp.position.y = exp * 0.5;
      coronaryGrp.position.z = exp * 0.5;
    });
    return true;
  }

  // =========================================================================
  // 2. HUMAN BRAIN ANATOMY (Gyri Cerebral Lobes, Cerebellum, Brainstem)
  // =========================================================================
  if (mode === 'human_brain_3d') {
    const frontalGrp = new THREE.Group();
    const parTempGrp = new THREE.Group();
    const occipGrp = new THREE.Group();
    const cerebGrp = new THREE.Group();
    const stemGrp = new THREE.Group();

    const makeGyriMat = (hex: number) => vault.getMaterial('brain_cortex', { color: hex });

    for (const side of [-1, 1]) {
      const hemiGeo = makeSculptedBlob(0.68, 0.92, 1.25, seg + 4, seg, (v, n) => {
        if (v.x * side < 0) v.x *= 0.14; // longitudinal fissure
        const gyri = Math.sin(n.y * 16 + n.z * 13) * Math.cos(n.x * 14 - n.z * 11) * 0.055;
        v.addScaledVector(n, gyri);
        // Temporal lobe swell
        if (v.y < -0.1 && v.z > -0.35 && v.z < 0.45) {
          v.x += side * 0.14;
        }
      });

      // Slice by anatomical region via tinted gyri lobes cleanly overlapping at boundaries
      const frontal = new THREE.Mesh(
        makeSculptedBlob(0.56, 0.68, 0.62, 22, 16, (v, n) => {
          if (v.x * side < 0) v.x *= 0.12;
          v.addScaledVector(n, Math.sin(n.y * 15 + n.z * 12) * 0.04);
        }),
        makeGyriMat(0xf0b2a8)
      );
      frontal.position.set(side * 0.34, 0.35, 0.65);
      frontalGrp.add(frontal);

      const parTemp = new THREE.Mesh(hemiGeo, makeGyriMat(0xe09f96));
      parTemp.position.set(side * 0.36, 0.35, 0.02);
      parTempGrp.add(parTemp);

      const occip = new THREE.Mesh(
        makeSculptedBlob(0.52, 0.52, 0.5, 20, 14, (v, n) => {
          if (v.x * side < 0) v.x *= 0.15;
          v.addScaledVector(n, Math.sin(n.x * 14 + n.y * 14) * 0.035);
        }),
        makeGyriMat(0xd48e86)
      );
      occip.position.set(side * 0.3, 0.2, -0.82);
      occipGrp.add(occip);
    }

    const cerebellum = new THREE.Mesh(
      makeSculptedBlob(0.74, 0.42, 0.48, 24, 18, (v, n) => {
        // Horizontal folia striations
        v.addScaledVector(n, Math.sin(n.y * 34) * 0.025);
      }),
      makeGyriMat(0xc47b75)
    );
    cerebellum.position.set(0, -0.45, -0.68);
    cerebGrp.add(cerebellum);

    const brainstem = new THREE.Mesh(
      makeTube(
        [
          [0, 0.02, -0.1],
          [0, -0.35, -0.18],
          [0, -0.85, -0.25],
          [0, -1.35, -0.28]
        ],
        0.22,
        24,
        14,
        (t) => 1.1 - t * 0.45
      ),
      vault.getMaterial('nerve_myelin', { color: 0xf1d3a1 })
    );
    // Pons bulge
    const pons = new THREE.Mesh(
      makeSculptedBlob(0.28, 0.24, 0.26, 16, 12),
      vault.getMaterial('nerve_myelin', { color: 0xf1d3a1 })
    );
    pons.position.set(0, -0.32, -0.12);
    stemGrp.add(brainstem, pons);

    tagBioPart(frontalGrp, 'frontal_lobe', 'Thùy Trán (Frontal Lobe)');
    tagBioPart(parTempGrp, 'parietal_temporal', 'Thùy Đỉnh & Thái dương');
    tagBioPart(occipGrp, 'occipital_lobe', 'Thùy Chẩm (Thị giác)');
    tagBioPart(cerebGrp, 'cerebellum', 'Tiểu não (Cerebellum)');
    tagBioPart(stemGrp, 'brainstem', 'Thân não (Cầu não & Hành não)');

    root.add(frontalGrp, parTempGrp, occipGrp, cerebGrp, stemGrp);
    interactables.push(frontalGrp, parTempGrp, occipGrp, cerebGrp, stemGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      frontalGrp.position.z = exp * 0.65;
      occipGrp.position.z = -exp * 0.65;
      cerebGrp.position.set(0, -exp * 0.45, -exp * 0.45);
      stemGrp.position.y = -exp * 0.55;
      root.rotation.y = Math.sin(t * 0.25) * 0.15;
    });
    return true;
  }

  // =========================================================================
  // 3. LIVER, STOMACH & INTESTINES 3D
  // =========================================================================
  if (mode === 'liver_digestive_3d') {
    const liverGrp = new THREE.Group();
    const stomachGrp = new THREE.Group();
    const siGrp = new THREE.Group();
    const liGrp = new THREE.Group();

    const liver = new THREE.Mesh(
      makeSculptedBlob(1.02, 0.55, 0.68, seg, 18, (v) => {
        if (v.x > 0) {
          const t = v.x / 1.02;
          v.y *= 1 - t * 0.58;
          v.z *= 1 - t * 0.35;
        }
        if (v.y < 0) v.y *= 0.6;
      }),
      vault.getMaterial('liver_parenchyma')
    );
    liver.position.set(-0.48, 0.85, 0.15);
    liver.rotation.z = 0.18;
    const gall = new THREE.Mesh(
      makeSculptedBlob(0.14, 0.25, 0.14, 14, 12),
      vault.getMaterial('chloroplast_membrane', { color: 0x16a34a })
    );
    gall.position.set(-0.55, 0.45, 0.45);
    gall.rotation.z = -0.35;
    liverGrp.add(liver, gall);

    const stomach = new THREE.Mesh(
      makeTube(
        [
          [0.12, 1.15, -0.05],
          [0.65, 0.92, 0.18],
          [0.62, 0.45, 0.26],
          [0.12, 0.32, 0.15],
          [-0.18, 0.48, 0.05]
        ],
        0.28,
        28,
        14,
        (t) => 0.42 + Math.sin(t * Math.PI) * 0.78
      ),
      vault.getMaterial('gastric_mucosa')
    );
    stomachGrp.add(stomach);

    // Coiled small intestine loops
    const siPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 32; i++) {
      const u = i / 32;
      siPts.push([
        Math.sin(u * Math.PI * 7) * 0.58,
        0.02 - u * 0.95,
        0.18 + Math.cos(u * Math.PI * 6) * 0.16
      ]);
    }
    const siMesh = new THREE.Mesh(
      makeTube(siPts, 0.13, 64, 10),
      vault.getMaterial('gastric_mucosa', { color: 0xd99b84 })
    );
    siGrp.add(siMesh);

    const liMesh = new THREE.Mesh(
      makeTube(
        [
          [-0.92, -0.95, 0.12],
          [-0.96, 0.05, 0.16],
          [0.0, 0.18, 0.35],
          [0.95, 0.08, 0.15],
          [0.92, -0.98, 0.05],
          [0.18, -1.25, -0.08]
        ],
        0.21,
        40,
        12
      ),
      vault.getMaterial('gastric_mucosa', { color: 0xb87663 })
    );
    liGrp.add(liMesh);

    tagBioPart(liverGrp, 'liver', 'Gan & Túi mật');
    tagBioPart(stomachGrp, 'stomach', 'Dạ dày chữ J');
    tagBioPart(siGrp, 'small_intestine', 'Ruột non');
    tagBioPart(liGrp, 'large_intestine', 'Ruột già (Khung Đại tràng)');

    root.add(liverGrp, stomachGrp, siGrp, liGrp);
    interactables.push(liverGrp, stomachGrp, siGrp, liGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      liverGrp.position.set(-exp * 0.65, exp * 0.45, 0);
      stomachGrp.position.set(exp * 0.65, exp * 0.35, 0);
      siGrp.position.z = exp * 0.6;
      liGrp.position.z = -exp * 0.4;
      stomachGrp.scale.setScalar(1 + Math.sin(t * 2.1) * 0.025);
    });
    return true;
  }

  // =========================================================================
  // 4. LUNGS, TRACHEA/BRONCHI & ALVEOLI–CAPILLARY GAS EXCHANGE
  // =========================================================================
  if (mode === 'alveoli_capillary_3d') {
    const tracheaGrp = new THREE.Group();
    const alveoliGrp = new THREE.Group();
    const capGrp = new THREE.Group();

    const cartMat = vault.getMaterial('cartilage');
    const lungLobeMat = vault.createUniqueMaterial('lung_parenchyma', {
      color: 0xf472b6,
      opacity: 0.24,
      transparent: true,
      side: THREE.DoubleSide
    });
    lungLobeMat.depthWrite = false;
    const alvMat = vault.createUniqueMaterial('lung_parenchyma', {
      color: 0xf9a8d4,
      opacity: 0.78,
      transparent: true
    });

    // Left anatomical Trachea + C-rings + Mainstem Bronchi + Semi-translucent Lung Lobes
    tracheaGrp.position.set(-1.35, 0.1, 0);
    const tracheaStem = new THREE.Mesh(
      makeTube(
        [
          [0, 1.55, 0],
          [0, 0.85, 0],
          [0, 0.42, 0]
        ],
        0.13,
        18,
        12
      ),
      cartMat
    );
    tracheaGrp.add(tracheaStem);
    for (let r = 0; r < 7; r++) {
      const cRing = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.025, 8, 18, Math.PI * 1.55), cartMat);
      cRing.rotation.x = Math.PI / 2;
      cRing.rotation.z = -Math.PI * 0.27;
      cRing.position.set(0, 0.56 + r * 0.14, 0);
      tracheaGrp.add(cRing);
    }

    const leftBronchus = new THREE.Mesh(
      makeTube([[0, 0.42, 0], [-0.46, 0.08, 0.02], [-0.72, -0.35, 0.06]], 0.085, 16, 10, (t) => 1 - t * 0.35),
      cartMat
    );
    const rightBronchus = new THREE.Mesh(
      makeTube([[0, 0.42, 0], [0.46, 0.05, 0.02], [0.75, -0.32, 0.06]], 0.085, 16, 10, (t) => 1 - t * 0.35),
      cartMat
    );
    tracheaGrp.add(leftBronchus, rightBronchus);

    // Secondary bronchioles
    const brSub1 = new THREE.Mesh(makeTube([[-0.46, 0.08, 0.02], [-0.75, 0.24, -0.05]], 0.045, 12, 8), cartMat);
    const brSub2 = new THREE.Mesh(makeTube([[0.46, 0.05, 0.02], [0.85, 0.22, -0.04]], 0.045, 12, 8), cartMat);
    tracheaGrp.add(brSub1, brSub2);

    // Translucent anatomical lung contours cradling bronchi
    for (const side of [-1, 1]) {
      const lobe = new THREE.Mesh(
        makeSculptedBlob(0.56, 1.05, 0.44, seg, 16, (v) => {
          if (v.y < -0.65) v.y += 0.12 * (1 - Math.abs(v.x));
          if (side * v.x < -0.15) v.x *= 0.65;
          if (side === 1 && v.x < 0 && v.y < 0.1 && v.y > -0.6) v.x += 0.14; // cardiac notch
        }),
        lungLobeMat
      );
      lobe.position.set(side * 0.62, -0.12, -0.02);
      tracheaGrp.add(lobe);
    }

    // Right magnified Alveolar Acinus (Sculpted Acinar Cluster + Terminal Bronchiole)
    alveoliGrp.position.set(1.05, -0.05, 0);
    const terminalBronchiole = new THREE.Mesh(
      makeTube(
        [
          [-0.45, 1.65, -0.05],
          [-0.08, 1.05, 0],
          [0, 0.48, 0]
        ],
        0.13,
        20,
        12,
        (t) => 1.15 - t * 0.25
      ),
      cartMat
    );
    alveoliGrp.add(terminalBronchiole);

    const sacPositions: Array<[number, number, number, number]> = [
      [0, 0.1, 0, 0.44],
      [-0.56, -0.1, 0.34, 0.39],
      [0.56, -0.08, 0.3, 0.39],
      [-0.36, -0.54, -0.28, 0.37],
      [0.36, -0.52, -0.26, 0.37],
      [0, -0.76, 0.24, 0.41],
      [-0.62, 0.34, -0.22, 0.33],
      [0.6, 0.36, -0.18, 0.33]
    ];
    sacPositions.forEach(([x, y, z, r], idx) => {
      const sac = new THREE.Mesh(
        makeSculptedBlob(r, r * 0.96, r, seg, 14, (v, n) => {
          v.addScaledVector(n, Math.sin(n.x * 5 + idx) * Math.cos(n.y * 5) * 0.032);
        }),
        alvMat
      );
      sac.position.set(x, y, z);
      alveoliGrp.add(sac);
    });

    // Anastomosing arterial (O2-rich red) & venous (CO2-rich blue) capillary cage + animated RBCs
    capGrp.position.set(1.05, -0.05, 0);
    const artMat = vault.getMaterial('arterial_vessel');
    const veinMat = vault.getMaterial('venous_vessel');
    const rbcCurves: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(Math.cos(a) * 0.72, 0.78, Math.sin(a) * 0.72),
        new THREE.Vector3(Math.cos(a + 0.42) * 1.02, 0.06, Math.sin(a + 0.42) * 1.02),
        new THREE.Vector3(Math.cos(a + 0.84) * 0.86, -0.68, Math.sin(a + 0.84) * 0.86)
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      rbcCurves.push(curve);
      const net = new THREE.Mesh(new THREE.TubeGeometry(curve, 22, 0.048, 10, false), i % 2 === 0 ? artMat : veinMat);
      capGrp.add(net);
    }

    const rbcMeshes: Array<{ mesh: THREE.Mesh; curveIdx: number; offset: number }> = [];
    const rbcGeo = new THREE.TorusGeometry(0.068, 0.026, 8, 16);
    for (let r = 0; r < 10; r++) {
      const rbcMat = new THREE.MeshPhysicalMaterial({ color: 0xdc2626, roughness: 0.3, clearcoat: 0.4 });
      const rbc = new THREE.Mesh(rbcGeo, rbcMat);
      capGrp.add(rbc);
      rbcMeshes.push({ mesh: rbc, curveIdx: r % rbcCurves.length, offset: r / 10 });
    }

    tagBioPart(tracheaGrp, 'trachea_bronchi', 'Khí quản sụn chữ C, Phế quản & Hai lá Phổi');
    tagBioPart(alveoliGrp, 'alveoli_cluster', 'Chùm Phế nang & Tiểu phế quản');
    tagBioPart(capGrp, 'capillary_net', 'Mạng Mao mạch Phổi & Hồng cầu');

    root.add(tracheaGrp, alveoliGrp, capGrp);
    interactables.push(tracheaGrp, alveoliGrp, capGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const br = (modeParamsRef.current.breathRate ?? 16) / 16;
      const deep = expFlagsRef.current.deepBreath ? 1.08 : 1;
      const pulse = 1 + Math.sin(t * 2.1 * br) * 0.055 * deep;
      alveoliGrp.scale.setScalar(pulse);
      tracheaGrp.scale.set(1 + (pulse - 1) * 0.55, 1 + (pulse - 1) * 0.35, 1 + (pulse - 1) * 0.55);
      tracheaGrp.position.x = -1.35 - exp * 0.38;
      alveoliGrp.position.x = 1.05 + exp * 0.25;
      capGrp.position.set(1.05 + exp * 0.25, -0.05, exp * 0.52);
      alvMat.opacity = xrayRef.current ? 0.35 : 0.78;
      lungLobeMat.opacity = xrayRef.current ? 0.14 : 0.26;

      rbcMeshes.forEach((item) => {
        const u = (t * 0.35 * br + item.offset) % 1;
        const p = rbcCurves[item.curveIdx].getPoint(u);
        item.mesh.position.copy(p);
        item.mesh.rotation.y = t * 2 + item.offset * 6;
        (item.mesh.material as THREE.MeshPhysicalMaterial).color.setHex(u > 0.5 ? 0xef4444 : 0x7c3aed);
      });
    });
    return true;
  }

  // =========================================================================
  // 5. KIDNEY CUTAWAY & NEPHRON UNIT
  // =========================================================================
  if (mode === 'nephron_kidney_3d') {
    const kidneyGrp = new THREE.Group();
    const bowmanGrp = new THREE.Group();
    const henleGrp = new THREE.Group();

    // Left side: anatomical hemisected bean kidney showing medullary pyramids & pelvis
    kidneyGrp.position.set(-1.35, 0, 0);
    const kShell = new THREE.Mesh(
      makeSculptedBlob(0.85, 1.38, 0.48, seg, 18, (v) => {
        if (v.x > 0 && Math.abs(v.y) < 0.55) v.x -= 0.32; // concave hilum
        if (v.z > 0.12) v.z = 0.12; // coronal cutaway plane
      }),
      vault.getMaterial('renal_cortex')
    );
    kidneyGrp.add(kShell);

    const medMat = vault.getMaterial('cardiac_muscle', { color: 0xb91c1c });
    for (let p = 0; p < 5; p++) {
      const ang = (p - 2) * 0.42;
      const pyramid = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 12), medMat);
      pyramid.position.set(0.05 - Math.cos(ang) * 0.35, Math.sin(ang) * 0.65, 0.13);
      pyramid.rotation.z = ang - Math.PI / 2;
      kidneyGrp.add(pyramid);
    }
    const ureter = new THREE.Mesh(
      makeTube([[0.35, -0.05, 0.02], [0.65, -0.65, 0.02], [0.75, -1.55, 0]], 0.08, 18, 10),
      vault.getMaterial('cartilage')
    );
    kidneyGrp.add(ureter);

    // Right side: Magnified Nephron unit (Bowman's capsule + Glomerulus + Loop of Henle + Collecting duct)
    bowmanGrp.position.set(0.65, 0.72, 0.1);
    const bowmanCup = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 20, 16, 0, Math.PI * 1.45),
      vault.getMaterial('lipid_membrane', { color: 0xfef3c7, opacity: 0.72, transparent: true, side: THREE.DoubleSide })
    );
    bowmanCup.rotation.y = 0.7;
    const glom = new THREE.Mesh(
      makeTube(
        [
          [-0.25, 0.1, 0],
          [0.05, 0.22, 0.15],
          [0.18, -0.1, -0.12],
          [-0.08, -0.18, 0.16],
          [0.2, 0.08, 0.05]
        ],
        0.058,
        28,
        8
      ),
      vault.getMaterial('arterial_vessel')
    );
    bowmanGrp.add(bowmanCup, glom);

    henleGrp.position.set(1.25, 0, 0);
    const tubule = new THREE.Mesh(
      makeTube(
        [
          [-0.25, 0.72, 0.1],
          [0.08, 0.85, 0.18],
          [0.15, 0.45, -0.05],
          [0.15, -1.15, 0],
          [0.52, -1.15, 0],
          [0.52, 0.45, 0.05],
          [0.85, 0.65, 0],
          [1.05, 0.45, 0]
        ],
        0.068,
        56,
        10
      ),
      vault.getMaterial('endocrine_gland', { color: 0xfbbf24 })
    );
    const collectingDuct = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.14, 2.35, 14),
      vault.getMaterial('endocrine_gland', { color: 0xd97706 })
    );
    collectingDuct.position.set(1.08, -0.25, 0);
    henleGrp.add(tubule, collectingDuct);

    tagBioPart(kidneyGrp, 'kidney_cortex', 'Thận bổ dọc (Vỏ · Tháp tủy · Bể thận)');
    tagBioPart(bowmanGrp, 'bowman_glomerulus', 'Cầu thận & Nang Bowman');
    tagBioPart(henleGrp, 'henle_collecting', 'Quai Henle & Ống góp');

    root.add(kidneyGrp, bowmanGrp, henleGrp);
    interactables.push(kidneyGrp, bowmanGrp, henleGrp);

    animatedTickers.push(() => {
      const exp = explodeRef.current;
      kidneyGrp.position.x = -1.35 - exp * 0.45;
      bowmanGrp.position.y = 0.72 + exp * 0.4;
      henleGrp.position.x = 1.25 + exp * 0.35;
    });
    return true;
  }

  // =========================================================================
  // 6. MULTIPOLAR NEURON & SYNAPSE
  // =========================================================================
  if (mode === 'neuron_synapse_3d') {
    const somaGrp = new THREE.Group();
    const myelinGrp = new THREE.Group();
    const synGrp = new THREE.Group();

    const somaMat = vault.getMaterial('protein_globular', { color: 0x38bdf8 });
    const somaBody = new THREE.Mesh(
      makeSculptedBlob(0.62, 0.56, 0.56, seg, 16, (v, n) => {
        v.addScaledVector(n, Math.pow(Math.max(0, Math.sin(n.x * 5) * Math.cos(n.y * 5)), 2) * 0.18);
      }),
      somaMat
    );
    somaBody.position.set(-1.95, 0, 0);
    somaGrp.add(somaBody);

    // Branching dendrites radiating from soma
    for (let d = 0; d < 7; d++) {
      const a = (d / 7) * Math.PI * 2;
      const dend = new THREE.Mesh(
        makeTube(
          [
            [-1.95, 0, 0],
            [-2.45, Math.sin(a) * 0.65, Math.cos(a) * 0.65],
            [-2.95, Math.sin(a + 0.3) * 1.05, Math.cos(a + 0.3) * 1.05]
          ],
          0.065,
          14,
          8,
          (t) => 1 - t * 0.75
        ),
        somaMat
      );
      somaGrp.add(dend);
    }

    // Long axon + Schwann cell myelin sheaths separated by Nodes of Ranvier
    const axon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 3.65, 12),
      vault.getMaterial('nerve_myelin')
    );
    axon.rotation.z = Math.PI / 2;
    axon.position.set(-0.05, 0, 0);
    myelinGrp.add(axon);

    const sheathMat = vault.getMaterial('compact_bone', { color: 0xfef08a });
    for (let s = 0; s < 4; s++) {
      const sheath = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.52, 8, 14), sheathMat);
      sheath.rotation.z = Math.PI / 2;
      sheath.position.set(-1.05 + s * 0.78, 0, 0);
      myelinGrp.add(sheath);
    }

    // Synaptic terminal bulb + vesicle release pulse
    const bouton = new THREE.Mesh(
      makeSculptedBlob(0.42, 0.34, 0.34, 16, 14),
      vault.getMaterial('endocrine_gland', { color: 0xf59e0b })
    );
    bouton.position.set(1.92, 0, 0);
    const pulseSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 14, 12),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    synGrp.add(bouton, pulseSphere);

    tagBioPart(somaGrp, 'soma', 'Thân nơron & Sợi nhánh');
    tagBioPart(myelinGrp, 'myelin_sheath', 'Sợi trục, Bao Myelin & Eo Ranvier');
    tagBioPart(synGrp, 'synaptic_bulb', 'Chùy Xináp');

    root.add(somaGrp, myelinGrp, synGrp);
    interactables.push(somaGrp, myelinGrp, synGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const active = Boolean(expFlagsRef.current.fired) && (modeParamsRef.current.stimulusMv ?? 20) >= 15;
      const myelin = modeParamsRef.current.myelin ?? 80;
      const spd = 0.8 + (myelin / 100) * 2.2;
      pulseSphere.visible = active;
      if (active) {
        const prog = (t * spd) % 1;
        pulseSphere.position.set(THREE.MathUtils.lerp(-1.45, 1.85, prog), 0, 0);
      }
      somaGrp.position.x = -exp * 0.45;
      synGrp.position.x = exp * 0.45;
    });
    return true;
  }

  // =========================================================================
  // 7. ENDOCRINE PANCREAS & ISLETS OF LANGERHANS
  // =========================================================================
  if (mode === 'endocrine_pancreas_3d') {
    const glandGrp = new THREE.Group();
    const betaGrp = new THREE.Group();
    const alphaGrp = new THREE.Group();

    const pancreas = new THREE.Mesh(
      makeTube(
        [
          [-1.75, -0.35, 0],
          [-0.85, 0.05, 0.15],
          [0.15, 0.25, 0.08],
          [1.25, 0.42, -0.1]
        ],
        0.48,
        32,
        14,
        (t) => 1.15 - t * 0.58
      ),
      vault.getMaterial('endocrine_gland')
    );
    const duct = new THREE.Mesh(
      makeTube(
        [
          [-1.65, -0.32, 0.22],
          [0, 0.2, 0.22],
          [1.15, 0.4, 0.08]
        ],
        0.06,
        24,
        8
      ),
      vault.getMaterial('cartilage')
    );
    glandGrp.add(pancreas, duct);

    // Magnified Islet of Langerhans cluster floating in foreground
    const betaMat = vault.getMaterial('lipid_membrane', { color: 0x0ea5e9 });
    const alphaMat = vault.getMaterial('arterial_vessel', { color: 0xf43f5e });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const cell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), betaMat);
      cell.position.set(Math.cos(a) * 0.28, -0.88 + ((i % 3) - 1) * 0.14, 0.72 + Math.sin(a) * 0.28);
      betaGrp.add(cell);
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cell = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), alphaMat);
      cell.position.set(Math.cos(a) * 0.52, -0.88 + ((i % 2) - 0.5) * 0.18, 0.72 + Math.sin(a) * 0.52);
      alphaGrp.add(cell);
    }

    tagBioPart(glandGrp, 'pancreas_gland', 'Tuyến Tụy (Đầu · Thân · Đuôi)');
    tagBioPart(betaGrp, 'beta_cells', 'Tế bào β đảo tụy (Insulin)');
    tagBioPart(alphaGrp, 'alpha_cells', 'Tế bào α đảo tụy (Glucagon)');

    root.add(glandGrp, betaGrp, alphaGrp);
    interactables.push(glandGrp, betaGrp, alphaGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const g = modeParamsRef.current.glucoseMg ?? 95;
      betaGrp.scale.setScalar(g > 120 ? 1 + Math.sin(t * 4) * 0.08 : 1);
      alphaGrp.scale.setScalar(g < 75 ? 1 + Math.sin(t * 4) * 0.08 : 1);
      glandGrp.position.y = exp * 0.35;
      betaGrp.position.z = exp * 0.45;
      alphaGrp.position.z = exp * 0.65;
    });
    return true;
  }

  // =========================================================================
  // 8. IGG ANTIBODY & ANTIGEN COMPLEX
  // =========================================================================
  if (mode === 'antibody_antigen_3d') {
    const fcGrp = new THREE.Group();
    const fabGrp = new THREE.Group();

    const heavyMat = vault.getMaterial('protein_globular', { color: 0x0ea5e9 });
    const lightMat = vault.getMaterial('plant_epidermis', { color: 0x10b981 });
    const antiMat = vault.getMaterial('arterial_vessel', { color: 0xf43f5e });

    // Heavy chains forming Y Fc stem + arms
    for (const side of [-1, 1]) {
      const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 1.05, 8, 12), heavyMat);
      stem.position.set(side * 0.18, -0.75, 0);
      const armH = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.95, 8, 12), heavyMat);
      armH.position.set(side * 0.62, 0.42, 0);
      armH.rotation.z = side * -0.58;
      fcGrp.add(stem, armH);

      const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.62, 8, 12), lightMat);
      armL.position.set(side * 0.88, 0.25, 0.12);
      armL.rotation.z = side * -0.58;
      fabGrp.add(armL);

      // Complementary antigen epitope docking at Fab tip
      const epitope = new THREE.Mesh(
        makeSculptedBlob(0.28, 0.28, 0.28, 16, 14),
        antiMat
      );
      epitope.position.set(side * 1.15, 1.08, 0.05);
      fabGrp.add(epitope);
    }

    tagBioPart(fcGrp, 'fc_stem', 'Vùng Fc (Chuỗi nặng)');
    tagBioPart(fabGrp, 'fab_arms', 'Hai nhánh biến đổi Fab & Kháng nguyên');

    root.add(fcGrp, fabGrp);
    interactables.push(fcGrp, fabGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      fcGrp.position.y = -exp * 0.35;
      fabGrp.position.y = exp * 0.4;
      root.rotation.y = Math.sin(t * 0.3) * 0.25;
    });
    return true;
  }

  return false;
}
