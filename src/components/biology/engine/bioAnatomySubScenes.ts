import * as THREE from 'three';
import { BioMaterialVault } from './bioMaterials';

function makeSculpted(
  rx: number,
  ry: number,
  rz: number,
  segW: number,
  segH: number,
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
  pts: [number, number, number][],
  r: number,
  tubSeg = 32,
  radSeg = 14,
  taper?: (t: number) => number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
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

export interface SubSceneOrganRegisterFn {
  (id: string, group: THREE.Group, animate?: (elapsed: number, rate: number) => void): void;
}

/**
 * Replaces legacy primitive sphere/cylinder blobs in BioAnatomyExplorer3DSandbox
 * with anatomically sculpted multi-part geometry and BioMaterialVault textured PBR materials.
 */
export function buildSculptedHumanSubScene(
  systemId: string,
  shell: THREE.Group,
  vault: BioMaterialVault,
  isSoftwareGl: boolean,
  registerOrgan: SubSceneOrganRegisterFn
): boolean {
  const seg = isSoftwareGl ? 22 : 34;
  const segMed = isSoftwareGl ? 14 : 20;

  const makeXrayMat = (hex: number, opacity = 0.1) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,
      transparent: true,
      opacity,
      roughness: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false
    });

  // =========================================================================
  // 1. HUMAN HEART 4 CHAMBERS + AURICLES + GREAT VESSELS + CORONARY TREE
  // =========================================================================
  if (systemId === 'human_heart_circulatory') {
    const periGeo = makeSculpted(1.36, 1.56, 1.15, 28, 22, (v) => {
      if (v.y < 0) {
        const t = Math.abs(v.y) / 1.56;
        v.x = v.x * (1 - t * 0.35) + t * 0.22;
      }
    });
    shell.add(new THREE.Mesh(periGeo, makeXrayMat(0xf43f5e, 0.09)));

    const lvMat = vault.createUniqueMaterial('cardiac_muscle');
    const rvMat = vault.createUniqueMaterial('cardiac_muscle', { color: 0x992632 });
    const artMat = vault.createUniqueMaterial('arterial_vessel');
    const veinMat = vault.createUniqueMaterial('venous_vessel');
    const corMat = vault.createUniqueMaterial('arterial_vessel', { color: 0xfb7185 });

    const lvG = new THREE.Group();
    const lvMesh = new THREE.Mesh(
      makeSculpted(0.56, 1.05, 0.56, seg, segMed, (v, n) => {
        if (v.y < 0) {
          const t = Math.abs(v.y) / 1.05;
          v.x = v.x * (1 - t * 0.58) + t * 0.38;
          v.z = v.z * (1 - t * 0.52) + t * 0.18;
        }
        // Subtle myocardial fiber ridge
        v.addScaledVector(n, Math.sin(n.y * 16 + n.x * 10) * 0.012);
      }),
      lvMat
    );
    lvMesh.position.set(0.28, -0.34, 0.02);
    lvG.add(lvMesh);
    registerOrgan('left_ventricle', lvG, (t, bpm) => {
      const beat = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
      lvG.scale.setScalar(1 - beat * 0.085);
    });

    const rvG = new THREE.Group();
    const rvMesh = new THREE.Mesh(
      makeSculpted(0.52, 0.88, 0.5, seg, segMed, (v) => {
        if (v.y < 0) {
          const t = Math.abs(v.y) / 0.88;
          v.x = v.x * (1 - t * 0.45) + t * 0.14;
        }
        // Interventricular sulcus indentation
        if (v.x > 0.15) v.z -= 0.05;
      }),
      rvMat
    );
    rvMesh.position.set(-0.32, -0.28, 0.14);
    rvG.add(rvMesh);
    registerOrgan('right_ventricle', rvG, (t, bpm) => {
      const beat = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
      rvG.scale.setScalar(1 - beat * 0.075);
    });

    const laG = new THREE.Group();
    const laMesh = new THREE.Mesh(
      makeSculpted(0.38, 0.34, 0.36, segMed, segMed, (v) => {
        // Left auricle appendage protruding anteriorly
        if (v.x > 0.12 && v.z > 0.05) v.x += 0.12;
      }),
      artMat
    );
    laMesh.position.set(0.46, 0.46, -0.14);
    laG.add(laMesh);
    [-0.12, 0.12].forEach((dy) => {
      laG.add(
        new THREE.Mesh(
          makeTube([[0.46, 0.46 + dy, -0.14], [1.08, 0.54 + dy * 1.4, -0.24]], 0.082, 16, 10),
          artMat
        )
      );
    });
    registerOrgan('left_atrium', laG, (t, bpm) => {
      const atrial = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 + 0.9)), 6);
      laG.scale.setScalar(1 - atrial * 0.06);
    });

    const raG = new THREE.Group();
    const raMesh = new THREE.Mesh(
      makeSculpted(0.4, 0.42, 0.38, segMed, segMed, (v) => {
        if (v.z > 0.1 && v.x > 0) v.z += 0.11; // right auricle
      }),
      veinMat
    );
    raMesh.position.set(-0.48, 0.44, 0.02);
    raG.add(raMesh);
    registerOrgan('right_atrium', raG, (t, bpm) => {
      const atrial = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 + 0.9)), 6);
      raG.scale.setScalar(1 - atrial * 0.06);
    });

    const aortaG = new THREE.Group();
    aortaG.add(
      new THREE.Mesh(
        makeTube(
          [
            [0.14, 0.2, 0.0],
            [0.2, 1.05, 0.05],
            [-0.14, 1.34, -0.14],
            [-0.28, 0.78, -0.45],
            [-0.24, -1.25, -0.42]
          ],
          0.165,
          36,
          14
        ),
        artMat
      ),
      new THREE.Mesh(makeTube([[0.15, 1.18, 0.02], [0.24, 1.72, 0.04]], 0.064, 12, 10), artMat),
      new THREE.Mesh(makeTube([[-0.02, 1.32, -0.06], [-0.02, 1.76, -0.05]], 0.056, 12, 10), artMat),
      new THREE.Mesh(makeTube([[-0.18, 1.25, -0.16], [-0.28, 1.68, -0.18]], 0.058, 12, 10), artMat)
    );
    registerOrgan('aortic_arch', aortaG, (t, bpm) => {
      const pulse = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 - 0.3)), 6);
      aortaG.scale.setScalar(1 + pulse * 0.035);
    });

    const pulmG = new THREE.Group();
    pulmG.add(
      new THREE.Mesh(
        makeTube([[-0.22, 0.05, 0.35], [-0.08, 0.76, 0.38], [0.02, 0.94, 0.12]], 0.135, 22, 12),
        veinMat
      ),
      new THREE.Mesh(makeTube([[0.02, 0.94, 0.12], [0.85, 0.98, -0.05]], 0.098, 16, 10), veinMat),
      new THREE.Mesh(makeTube([[0.02, 0.94, 0.12], [-0.85, 0.98, -0.05]], 0.098, 16, 10), veinMat)
    );
    registerOrgan('pulmonary_trunk', pulmG);

    const vcG = new THREE.Group();
    vcG.add(
      new THREE.Mesh(makeTube([[-0.65, 1.65, -0.15], [-0.56, 0.55, -0.1]], 0.135, 18, 12), veinMat),
      new THREE.Mesh(makeTube([[-0.56, 0.25, -0.18], [-0.52, -1.25, -0.22]], 0.145, 18, 12), veinMat)
    );
    registerOrgan('vena_cava', vcG);

    const corG = new THREE.Group();
    corG.add(
      new THREE.Mesh(
        makeTube([[0.08, 0.32, 0.45], [-0.02, -0.15, 0.58], [0.16, -0.82, 0.5]], 0.04, 24, 10, (t) => 1 - t * 0.5),
        corMat
      ),
      new THREE.Mesh(makeTube([[-0.02, -0.15, 0.58], [0.46, -0.35, 0.46]], 0.032, 16, 8), corMat),
      new THREE.Mesh(makeTube([[-0.18, 0.18, 0.5], [-0.45, -0.32, 0.48]], 0.034, 16, 8), corMat)
    );
    registerOrgan('coronary_vessels', corG);
    return true;
  }

  // =========================================================================
  // 2. HUMAN RESPIRATORY (Larynx, C-rings, Bronchial tree, Fissured 3/2 Lungs)
  // =========================================================================
  if (systemId === 'human_respiratory') {
    const ribShell = new THREE.Mesh(
      makeSculpted(1.55, 1.48, 1.1, 28, 20, (v) => {
        if (v.y < -0.6) v.y *= 0.6;
      }),
      makeXrayMat(0x38bdf8, 0.09)
    );
    shell.add(ribShell);

    const cartilageMat = vault.createUniqueMaterial('cartilage');
    const mucosaMat = vault.createUniqueMaterial('gastric_mucosa', { color: 0xfda4af });
    const rlMat = vault.createUniqueMaterial('lung_parenchyma', { transparent: true, opacity: 0.9 });
    const llMat = vault.createUniqueMaterial('lung_parenchyma', { color: 0xec8ca4, transparent: true, opacity: 0.9 });
    const diaMat = vault.createUniqueMaterial('skeletal_muscle', { color: 0xb93842 });

    const tracG = new THREE.Group();
    tracG.add(new THREE.Mesh(makeTube([[0, 1.75, 0], [0, 0.62, 0]], 0.14, 20, 14), mucosaMat));
    // Sculpted laryngeal prominence (thyroid cartilage shield)
    const larynx = new THREE.Mesh(
      makeSculpted(0.22, 0.19, 0.21, 18, 14, (v) => {
        if (v.z > 0.05) v.z += 0.06 * (1 - Math.abs(v.x) * 4);
      }),
      cartilageMat
    );
    larynx.position.set(0, 1.6, 0.04);
    tracG.add(larynx);
    for (let i = 0; i < 9; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 10, 24, Math.PI * 1.55), cartilageMat);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = -Math.PI * 0.27;
      ring.position.set(0, 0.68 + i * 0.09, 0);
      tracG.add(ring);
    }
    registerOrgan('trachea', tracG);

    const bronG = new THREE.Group();
    const bronPts: Array<[[number, number, number][], number]> = [
      [[[0, 0.65, 0], [-0.62, 0.25, 0]], 0.1],
      [[[0, 0.65, 0], [0.64, 0.22, 0]], 0.1],
      [[[-0.62, 0.25, 0], [-0.95, 0.55, 0.1]], 0.052],
      [[[-0.62, 0.25, 0], [-1.05, -0.35, 0.1]], 0.052],
      [[[0.64, 0.22, 0], [0.98, 0.52, 0.1]], 0.052],
      [[[0.64, 0.22, 0], [1.02, -0.38, 0.1]], 0.052]
    ];
    for (const [pts, r] of bronPts) {
      bronG.add(new THREE.Mesh(makeTube(pts, r, 16, 10), cartilageMat));
    }
    registerOrgan('bronchi_tree', bronG);

    // Sculpted Right Lung (3 lobes separated by horizontal & oblique fissures)
    const rlG = new THREE.Group();
    const rLungMesh = new THREE.Mesh(
      makeSculpted(0.68, 1.18, 0.72, seg, segMed, (v) => {
        if (v.y > 0) {
          const apexT = v.y / 1.18;
          v.x *= 1 - apexT * 0.45;
          v.z *= 1 - apexT * 0.35;
        }
        // Concave diaphragmatic base
        if (v.y < -0.6) v.y += 0.18 * (1 - Math.hypot(v.x, v.z));
        // Oblique & horizontal interlobar fissures
        const obliqueDist = Math.abs(v.y - (-0.15 + v.z * 0.65));
        if (obliqueDist < 0.08) {
          const d = (1 - obliqueDist / 0.08) * 0.065;
          v.x *= 1 - d;
          v.z *= 1 - d;
        }
        const horizDist = Math.abs(v.y - 0.16);
        if (v.z > 0 && horizDist < 0.06) {
          const d = (1 - horizDist / 0.06) * 0.05;
          v.x *= 1 - d;
        }
      }),
      rlMat
    );
    rLungMesh.position.set(-0.88, 0.04, 0.02);
    rlG.add(rLungMesh);
    registerOrgan('right_lung', rlG, (t, resp) => {
      const inhale = 1 + 0.075 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
      rlG.scale.set(inhale, 0.96 + (inhale - 1) * 0.9, inhale);
    });

    // Sculpted Left Lung (2 lobes with oblique fissure & medial cardiac notch)
    const llG = new THREE.Group();
    const lLungMesh = new THREE.Mesh(
      makeSculpted(0.64, 1.16, 0.7, seg, segMed, (v) => {
        if (v.y > 0) {
          const apexT = v.y / 1.16;
          v.x *= 1 - apexT * 0.45;
          v.z *= 1 - apexT * 0.35;
        }
        if (v.y < -0.6) v.y += 0.16 * (1 - Math.hypot(v.x, v.z));
        // Cardiac notch indentation on anterior medial aspect
        if (v.x < -0.05 && v.y < 0.15 && v.z > -0.08) {
          v.x += 0.22;
        }
        const obliqueDist = Math.abs(v.y - (-0.12 + v.z * 0.65));
        if (obliqueDist < 0.08) {
          const d = (1 - obliqueDist / 0.08) * 0.065;
          v.x *= 1 - d;
          v.z *= 1 - d;
        }
      }),
      llMat
    );
    lLungMesh.position.set(0.88, 0.04, 0.02);
    llG.add(lLungMesh);
    registerOrgan('left_lung', llG, (t, resp) => {
      const inhale = 1 + 0.075 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
      llG.scale.set(inhale, 0.96 + (inhale - 1) * 0.9, inhale);
    });

    const diaG = new THREE.Group();
    const diaMesh = new THREE.Mesh(
      makeSculpted(1.48, 0.32, 0.95, segMed, 14, (v) => {
        if (v.y < 0) v.y *= 0.2;
      }),
      diaMat
    );
    diaMesh.position.set(0, -1.18, 0);
    diaG.add(diaMesh);
    registerOrgan('diaphragm', diaG, (t, resp) => {
      const drop = -0.18 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
      diaMesh.position.y = -1.14 + drop;
    });
    return true;
  }

  // =========================================================================
  // 3. HUMAN NERVOUS SYSTEM (Gyri Lobes, Foliated Cerebellum, Brainstem, Spine)
  // =========================================================================
  if (systemId === 'human_nervous') {
    const cranium = new THREE.Mesh(
      makeSculpted(1.22, 1.15, 1.45, 28, 20),
      makeXrayMat(0xfacc15, 0.08)
    );
    cranium.position.set(0, 0.72, 0);
    shell.add(cranium);

    const fMat = vault.createUniqueMaterial('brain_cortex', { color: 0xe6a89c });
    const pMat = vault.createUniqueMaterial('brain_cortex', { color: 0xd99288 });
    const cerMat = vault.createUniqueMaterial('brain_cortex', { color: 0xc27871 });
    const stemMat = vault.createUniqueMaterial('nerve_myelin', { color: 0xf1d3a1 });
    const cordMat = vault.createUniqueMaterial('nerve_myelin', { color: 0x38bdf8 });
    const vertMat = vault.createUniqueMaterial('compact_bone', { transparent: true, opacity: 0.42 });

    const frontG = new THREE.Group();
    const parG = new THREE.Group();
    for (const side of [-1, 1]) {
      const frontal = new THREE.Mesh(
        makeSculpted(0.48, 0.56, 0.58, seg, segMed, (v, n) => {
          if (v.x * side < 0) v.x *= 0.12;
          v.addScaledVector(n, Math.sin(n.y * 16 + n.z * 12) * Math.cos(n.x * 13) * 0.036);
        }),
        fMat
      );
      frontal.position.set(side * 0.28, 0.78, 0.46);
      frontG.add(frontal);

      const parOcc = new THREE.Mesh(
        makeSculpted(0.54, 0.62, 0.72, seg, segMed, (v, n) => {
          if (v.x * side < 0) v.x *= 0.14;
          v.addScaledVector(n, Math.sin(n.y * 15 + n.z * 13) * Math.cos(n.x * 14 - n.z * 10) * 0.042);
          if (v.y < -0.1 && v.z > -0.1) v.x += side * 0.14; // temporal bulge
        }),
        pMat
      );
      parOcc.position.set(side * 0.3, 0.72, -0.32);
      parG.add(parOcc);
    }
    registerOrgan('frontal_lobe', frontG);
    registerOrgan('parietal_occipital', parG);

    const cerG = new THREE.Group();
    const cerebellum = new THREE.Mesh(
      makeSculpted(0.68, 0.36, 0.42, 24, 18, (v, n) => {
        v.addScaledVector(n, Math.sin(n.y * 32) * 0.022);
        if (Math.abs(v.x) < 0.1) v.z -= 0.04; // vermis groove
      }),
      cerMat
    );
    cerebellum.position.set(0, 0.16, -0.62);
    cerG.add(cerebellum);
    registerOrgan('cerebellum', cerG);

    const bsG = new THREE.Group();
    bsG.add(
      new THREE.Mesh(
        makeTube([[0, 0.5, -0.05], [0, 0.12, -0.14], [0, -0.35, -0.2]], 0.17, 18, 12),
        stemMat
      ),
      (() => {
        const pons = new THREE.Mesh(makeSculpted(0.24, 0.21, 0.22, 16, 12), stemMat);
        pons.position.set(0, 0.18, -0.06);
        return pons;
      })()
    );
    registerOrgan('brainstem', bsG);

    const scG = new THREE.Group();
    scG.add(new THREE.Mesh(makeTube([[0, -0.32, -0.2], [0, -1.85, -0.15]], 0.09, 24, 12), cordMat));
    const vertGeo = makeSculpted(0.26, 0.09, 0.22, 14, 10, (v) => {
      if (v.z < -0.05) v.x *= 0.6;
    });
    for (let i = 0; i < 7; i++) {
      const v = new THREE.Mesh(vertGeo, vertMat);
      v.position.set(0, -0.48 - i * 0.21, -0.18);
      scG.add(v);
    }
    registerOrgan('spinal_cord', scG, (t, hz) => {
      cordMat.emissiveIntensity = 0.08 + 0.14 * (0.5 + 0.5 * Math.sin(t * (hz / 4)));
    });
    return true;
  }

  // =========================================================================
  // 4. HUMAN DIGESTIVE & RENAL (Sculpted Liver, J-Stomach, Colon, Hilum Kidneys)
  // =========================================================================
  if (systemId === 'human_digestive_renal') {
    shell.add(
      new THREE.Mesh(
        makeSculpted(1.42, 1.58, 1.05, 28, 20),
        makeXrayMat(0xf59e0b, 0.08)
      )
    );

    const livMat = vault.createUniqueMaterial('liver_parenchyma');
    const gallMat = vault.createUniqueMaterial('chloroplast_membrane', { color: 0x16a34a });
    const stomMat = vault.createUniqueMaterial('gastric_mucosa');
    const colonMat = vault.createUniqueMaterial('gastric_mucosa', { color: 0xb87663 });
    const smallMat = vault.createUniqueMaterial('gastric_mucosa', { color: 0xd99b84 });
    const kidMat = vault.createUniqueMaterial('renal_cortex');
    const urMat = vault.createUniqueMaterial('cartilage', { color: 0xfacc15 });

    const livG = new THREE.Group();
    const liverMesh = new THREE.Mesh(
      makeSculpted(0.96, 0.52, 0.64, seg, segMed, (v) => {
        if (v.x > 0) {
          const t = v.x / 0.96;
          v.y *= 1 - t * 0.58;
          v.z *= 1 - t * 0.35;
        }
        if (v.y < 0) v.y *= 0.6;
        // Falciform ligament groove
        if (Math.abs(v.x - 0.12) < 0.08 && v.z > 0.1) v.z -= 0.06;
      }),
      livMat
    );
    liverMesh.position.set(-0.34, 0.74, 0.2);
    liverMesh.rotation.z = 0.16;

    const gall = new THREE.Mesh(
      makeSculpted(0.13, 0.24, 0.13, 14, 12, (v) => {
        if (v.y > 0) {
          v.x *= 0.55;
          v.z *= 0.55;
        }
      }),
      gallMat
    );
    gall.position.set(-0.34, 0.35, 0.45);
    gall.rotation.z = -0.35;
    livG.add(liverMesh, gall);
    registerOrgan('liver_gallbladder', livG);

    const stomG = new THREE.Group();
    stomG.add(
      new THREE.Mesh(
        makeTube(
          [
            [0.05, 1.55, 0.05],
            [0.12, 0.92, 0.12],
            [0.58, 0.58, 0.24],
            [0.46, 0.18, 0.28],
            [0.08, 0.15, 0.18]
          ],
          0.24,
          32,
          14,
          (t) => 0.45 + Math.sin(t * Math.PI) * 0.75
        ),
        stomMat
      )
    );
    registerOrgan('stomach', stomG, (t, p) => {
      const wave = 1 + 0.035 * Math.sin(t * (p / 24));
      stomG.scale.set(wave, 1, wave);
    });

    const intG = new THREE.Group();
    intG.add(
      new THREE.Mesh(
        makeTube(
          [
            [-0.78, -1.1, 0.22],
            [-0.82, -0.05, 0.2],
            [0.0, 0.05, 0.32],
            [0.82, -0.02, 0.2],
            [0.78, -1.05, 0.18],
            [0.15, -1.35, 0.08]
          ],
          0.17,
          44,
          12
        ),
        colonMat
      )
    );
    const smallPts: [number, number, number][] = [];
    for (let i = 0; i <= 28; i++) {
      const u = i / 28;
      smallPts.push([
        Math.sin(u * Math.PI * 5.5) * 0.46,
        -0.25 - u * 0.85,
        0.26 + Math.cos(u * Math.PI * 5.5) * 0.12
      ]);
    }
    intG.add(new THREE.Mesh(makeTube(smallPts, 0.095, 64, 10), smallMat));
    registerOrgan('intestines', intG);

    const kidG = new THREE.Group();
    for (const side of [-1, 1]) {
      const kidGeo = makeSculpted(0.25, 0.42, 0.21, 18, 14, (v) => {
        // Concave renal hilum facing midline
        if (v.x * side < 0 && Math.abs(v.y) < 0.2) {
          v.x += side * 0.1;
        }
      });
      const kid = new THREE.Mesh(kidGeo, kidMat);
      kid.position.set(side * 0.65, side === -1 ? -0.02 : 0.08, -0.45);
      kid.rotation.z = side * -0.15;
      kidG.add(kid);
      kidG.add(
        new THREE.Mesh(
          makeTube([[side * 0.56, -0.1, -0.42], [side * 0.28, -1.25, -0.18]], 0.04, 18, 8),
          urMat
        )
      );
    }
    const blad = new THREE.Mesh(
      makeSculpted(0.26, 0.24, 0.24, 18, 14),
      vault.createUniqueMaterial('gastric_mucosa', { color: 0xe69f73 })
    );
    blad.position.set(0, -1.32, -0.12);
    kidG.add(blad);
    registerOrgan('kidneys_ureters', kidG);
    return true;
  }

  return false;
}
