import * as THREE from 'three';
import { BioSceneHookContext, tagBioPart } from './bioCellularBuilders';

function makeSculptedBlob(
  rx: number,
  ry: number,
  rz: number,
  segW = 22,
  segH = 16,
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
 * Builds Topics D (Microbiology) and E (Ecology) upgraded 3D scenes:
 * - bacteria_prokaryote_3d (NEW)
 * - virus_bacteriophage_3d (T4 Phage + Enveloped Spike Virus toggle)
 * - fungi_microorganisms_3d (NEW: Fungal Fruiting Body/Mycelium + Paramecium Protist)
 * - ecosystem_biome_3d (Sculpted Biome Diorama + Food Web + Energy Pyramid)
 */
export function buildMicroEcologyScene(
  mode: string,
  root: THREE.Group,
  ctx: BioSceneHookContext
): boolean {
  const { vault, isLowEnd, explodeRef, xrayRef, modeParamsRef, expFlagsRef, interactables, animatedTickers } = ctx;
  const seg = isLowEnd ? 14 : 24;

  // =========================================================================
  // 1. PROKARYOTIC BACTERIUM CELL (NEW)
  // =========================================================================
  if (mode === 'bacteria_prokaryote_3d') {
    const wallGrp = new THREE.Group();
    const nucleoidGrp = new THREE.Group();
    const flagellumGrp = new THREE.Group();

    // Cutaway rod-shaped Bacillus capsule + peptidoglycan wall + plasma membrane
    const capsuleShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.98, 0.98, 2.2, 24, 1, true, 0.65, Math.PI * 1.38),
      vault.getMaterial('bacterial_capsule', {
        color: 0x10b981,
        opacity: 0.45,
        transparent: true,
        side: THREE.DoubleSide
      })
    );
    capsuleShell.rotation.z = Math.PI / 2;

    const wallShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.86, 0.86, 2.1, 24, 1, true, 0.65, Math.PI * 1.38),
      vault.getMaterial('endocrine_gland', { color: 0xf59e0b, side: THREE.DoubleSide })
    );
    wallShell.rotation.z = Math.PI / 2;

    const endCapLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      vault.getMaterial('bacterial_capsule', { color: 0x10b981, opacity: 0.45, transparent: true })
    );
    endCapLeft.rotation.z = Math.PI / 2;
    endCapLeft.position.x = -1.1;

    const endCapRight = endCapLeft.clone();
    endCapRight.rotation.z = -Math.PI / 2;
    endCapRight.position.x = 1.1;
    wallGrp.add(capsuleShell, wallShell, endCapLeft, endCapRight);

    // Supercoiled naked circular Nucleoid DNA + satellite Plasmids + 70S Ribosomes
    const dnaPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * Math.PI * 6;
      dnaPts.push([
        Math.sin(t * 0.5) * 0.72,
        Math.cos(t) * 0.34,
        Math.sin(t * 1.3) * 0.32
      ]);
    }
    const nucleoid = new THREE.Mesh(
      makeTube(dnaPts, 0.055, 64, 10),
      vault.getMaterial('protein_globular', { color: 0x6366f1 })
    );
    const plasmid1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.028, 8, 22),
      vault.getMaterial('arterial_vessel', { color: 0xec4899 })
    );
    plasmid1.position.set(0.82, -0.25, 0.26);
    const riboMat = vault.getMaterial('compact_bone', { color: 0xfef08a });
    for (let r = 0; r < 14; r++) {
      const ribo = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), riboMat);
      ribo.position.set(-0.9 + (r % 5) * 0.42, ((r % 3) - 1) * 0.28, (Math.floor(r / 5) - 1) * 0.28);
      nucleoidGrp.add(ribo);
    }
    nucleoidGrp.add(nucleoid, plasmid1);

    // Pili fimbriae radiating around wall + helical rotary flagellum tail
    const piliMat = vault.getMaterial('compact_bone', { color: 0xd9f99d });
    for (let p = 0; p < 16; p++) {
      const a = (p / 16) * Math.PI * 2;
      const px = -0.8 + (p % 4) * 0.55;
      const pilus = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.48, 6), piliMat);
      pilus.position.set(px, Math.cos(a) * 1.15, Math.sin(a) * 1.15);
      pilus.rotation.x = a;
      flagellumGrp.add(pilus);
    }

    const flagPts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      flagPts.push([
        1.95 + t * 2.1,
        Math.sin(t * Math.PI * 4) * 0.34,
        Math.cos(t * Math.PI * 4) * 0.34
      ]);
    }
    const flagellum = new THREE.Mesh(
      makeTube(flagPts, 0.042, 48, 8, (t) => 1.1 - t * 0.65),
      vault.getMaterial('nerve_myelin', { color: 0x38bdf8 })
    );
    flagellumGrp.add(flagellum);

    tagBioPart(wallGrp, 'capsule_wall', 'Vỏ nhầy & Thành Peptidoglycan');
    tagBioPart(nucleoidGrp, 'nucleoid', 'Vùng nhân DNA vòng, Plasmid & Ribôxôm 70S');
    tagBioPart(flagellumGrp, 'flagellum_pili', 'Roi xoắn (Flagellum) & Lông Pili');

    root.add(wallGrp, nucleoidGrp, flagellumGrp);
    interactables.push(wallGrp, nucleoidGrp, flagellumGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const motile = expFlagsRef.current.motile !== false;
      wallGrp.position.y = exp * 0.4;
      nucleoidGrp.position.z = exp * 0.5;
      flagellumGrp.position.x = exp * 0.35;
      if (motile) {
        flagellum.rotation.x = t * 5.2;
      }
      capsuleShell.material.opacity = xrayRef.current ? 0.18 : 0.45;
    });
    return true;
  }

  // =========================================================================
  // 2. VIRUS: BACTERIOPHAGE T4 + ENVELOPED SPIKE GLYCOPROTEIN MODE
  // =========================================================================
  if (mode === 'virus_bacteriophage_3d') {
    const phageGrp = new THREE.Group();
    const capsidGrp = new THREE.Group();
    const tailGrp = new THREE.Group();

    const capsidMat = vault.getMaterial('protein_globular', {
      color: 0x6366f1,
      opacity: 0.78,
      transparent: true
    });
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 0), capsidMat);
    head.scale.y = 1.25;
    head.position.y = 1.38;

    const dnaCoil = new THREE.Mesh(
      makeTube(
        [
          [-0.22, 1.65, 0],
          [0.24, 1.48, 0.22],
          [-0.22, 1.28, -0.22],
          [0.18, 1.12, 0.16],
          [0, 0.65, 0]
        ],
        0.052,
        28,
        8
      ),
      vault.getMaterial('arterial_vessel', { color: 0xf43f5e })
    );
    capsidGrp.add(head, dnaCoil);

    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.14, 12),
      vault.getMaterial('endocrine_gland')
    );
    collar.position.y = 0.48;
    const coreTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 1.35, 12),
      vault.getMaterial('compact_bone')
    );
    coreTube.position.y = -0.22;

    const sheathGroup = new THREE.Group();
    sheathGroup.position.y = -0.18;
    const sheathMat = vault.getMaterial('protein_globular', { color: 0x0ea5e9 });
    for (let r = 0; r < 9; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 8, 16), sheathMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.48 - r * 0.12;
      sheathGroup.add(ring);
    }

    const baseplate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.42, 0.14, 6),
      vault.getMaterial('endocrine_gland')
    );
    baseplate.position.y = -0.92;
    tailGrp.add(collar, coreTube, sheathGroup, baseplate);

    // 6 articulated bacteriophage tail fibers
    const legMat = vault.getMaterial('protein_globular', { color: 0x38bdf8 });
    for (let f = 0; f < 6; f++) {
      const a = (f / 6) * Math.PI * 2;
      const leg = new THREE.Mesh(
        makeTube(
          [
            [Math.cos(a) * 0.36, -0.92, Math.sin(a) * 0.36],
            [Math.cos(a) * 0.98, -0.45, Math.sin(a) * 0.98],
            [Math.cos(a) * 1.32, -1.38, Math.sin(a) * 1.32]
          ],
          0.036,
          12,
          8
        ),
        legMat
      );
      tailGrp.add(leg);
    }

    // Host bacterium surface dome beneath Phage
    const hostSurface = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 24, 16, 0, Math.PI * 2, 0, 0.68),
      vault.getMaterial('bacterial_capsule', { color: 0x10b981, opacity: 0.58, transparent: true })
    );
    hostSurface.position.y = -3.85;
    phageGrp.add(capsidGrp, tailGrp, hostSurface);

    // Enveloped Coronavirus Spike Glycoprotein mode
    const envVirusGrp = new THREE.Group();
    const envSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.12, seg, seg, 0, Math.PI * 1.55),
      vault.getMaterial('lipid_membrane', { color: 0x334155, side: THREE.DoubleSide })
    );
    envSphere.rotation.y = 0.6;
    const rnaCore = new THREE.Mesh(
      makeTube(
        [
          [-0.45, 0.45, 0],
          [0.45, 0.2, 0.35],
          [-0.35, -0.25, -0.35],
          [0.35, -0.5, 0.15]
        ],
        0.075,
        24,
        10
      ),
      vault.getMaterial('endocrine_gland', { color: 0xfbbf24 })
    );
    envVirusGrp.add(envSphere, rnaCore);

    const spikeMat = vault.getMaterial('arterial_vessel', { color: 0xe11d48 });
    const dirs: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const totalSpikes = isLowEnd ? 22 : 34;
    for (let i = 0; i < totalSpikes; i++) {
      const y = 1 - (i / (totalSpikes - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = goldenAngle * i;
      dirs.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
    }
    dirs.forEach((d) => {
      const spk = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.34, 8), spikeMat);
      stem.position.y = 1.24;
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), spikeMat);
      crown.scale.set(1.25, 0.72, 1.25);
      crown.position.y = 1.44;
      spk.add(stem, crown);
      spk.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      envVirusGrp.add(spk);
    });

    tagBioPart(capsidGrp, 'capsid_head', 'Đầu Capsid 20 mặt & Lõi DNA');
    tagBioPart(tailGrp, 'tail_sheath', 'Bao đuôi co bóp & 6 sợi bám');
    tagBioPart(envVirusGrp, 'spike_glycoprotein', 'Virus vỏ lipid & Gai Glycoprotein');

    root.add(phageGrp, envVirusGrp);
    interactables.push(capsidGrp, tailGrp, envVirusGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const envMode = Boolean(expFlagsRef.current.envelopedMode);
      const injected = Boolean(expFlagsRef.current.injected);

      phageGrp.visible = !envMode;
      envVirusGrp.visible = envMode;

      sheathGroup.scale.y = injected ? 0.56 : 1;
      dnaCoil.position.y = injected ? -1.45 : 0;
      capsidGrp.position.y = exp * 0.55;
      tailGrp.position.y = -exp * 0.25;
      envVirusGrp.rotation.y = t * 0.32;
    });
    return true;
  }

  // =========================================================================
  // 3. FUNGI (MYCELIUM + FRUITING BODY) & PARAMECIUM PROTIST (NEW)
  // =========================================================================
  if (mode === 'fungi_microorganisms_3d') {
    const mushroomGrp = new THREE.Group();
    const myceliumGrp = new THREE.Group();
    const protistGrp = new THREE.Group();

    const soilLayer = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.45, 0.45, 32),
      vault.getMaterial('soil_terrain', { opacity: 0.55, transparent: true })
    );
    soilLayer.position.y = -0.65;
    root.add(soilLayer);

    // Sculpted Fungal Fruiting Body (pileus cap, radiating gills, ring annulus, stipe)
    mushroomGrp.position.set(-0.95, 0, 0);
    const capGeo = makeSculptedBlob(1.05, 0.56, 1.05, seg, 14, (v) => {
      if (v.y < 0) v.y *= 0.22;
      if (v.y > 0.2) v.y += Math.exp(-Math.hypot(v.x, v.z) * 2.5) * 0.14;
    });
    const cap = new THREE.Mesh(capGeo, vault.getMaterial('chitin_fungi'));
    cap.position.y = 1.08;
    const stipe = new THREE.Mesh(
      makeTube([[0, -0.45, 0], [0.04, 0.35, 0], [0, 1.02, 0]], 0.22, 16, 12, (t) => 1.15 - t * 0.28),
      vault.getMaterial('compact_bone', { color: 0xf5ebe0 })
    );
    const annulus = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.04, 8, 20),
      vault.getMaterial('compact_bone', { color: 0xe7d8c9 })
    );
    annulus.rotation.x = Math.PI / 2;
    annulus.position.y = 0.62;
    mushroomGrp.add(cap, stipe, annulus);

    // Subterranean branching septate Mycelium hyphae
    const hyphaeMat = vault.getMaterial('compact_bone', { color: 0xfef3c7 });
    for (let h = 0; h < 8; h++) {
      const a = (h / 8) * Math.PI * 2;
      const hyp = new THREE.Mesh(
        makeTube(
          [
            [-0.95, -0.48, 0],
            [-0.95 + Math.cos(a) * 0.65, -0.65 - (h % 2) * 0.12, Math.sin(a) * 0.65],
            [-0.95 + Math.cos(a + 0.3) * 1.25, -0.78, Math.sin(a + 0.3) * 1.25]
          ],
          0.028,
          14,
          6,
          (t) => 1 - t * 0.65
        ),
        hyphaeMat
      );
      myceliumGrp.add(hyp);
    }

    // Magnified Paramecium Protist (slipper pellicle, macronucleus, contractile vacuole, oral groove)
    protistGrp.position.set(1.25, 0.42, 0.15);
    const pellicle = new THREE.Mesh(
      makeSculptedBlob(0.54, 1.12, 0.42, seg, 16, (v) => {
        if (v.x < -0.1 && Math.abs(v.y) < 0.45) v.x += 0.18; // oral groove indentation
      }),
      vault.getMaterial('lipid_membrane', {
        color: 0x2dd4bf,
        opacity: 0.62,
        transparent: true
      })
    );
    const macroNuc = new THREE.Mesh(
      makeSculptedBlob(0.18, 0.32, 0.16, 12, 10),
      vault.getMaterial('protein_globular', { color: 0x6366f1 })
    );
    macroNuc.position.set(0.08, 0.12, 0);
    const vacuole = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14, 1),
      vault.getMaterial('lipid_membrane', { color: 0xbae6fd })
    );
    vacuole.position.set(-0.04, -0.48, 0.08);
    protistGrp.add(pellicle, macroNuc, vacuole);

    tagBioPart(mushroomGrp, 'mushroom_fruiting', 'Quả thể Nấm & Phiến Bào tử');
    tagBioPart(myceliumGrp, 'mycelium_hyphae', 'Hệ sợi Nấm (Mycelium)');
    tagBioPart(protistGrp, 'protist_microbe', 'Vi sinh vật Đơn bào (Trùng giày)');

    root.add(mushroomGrp, myceliumGrp, protistGrp);
    interactables.push(mushroomGrp, myceliumGrp, protistGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      mushroomGrp.position.set(-0.95 - exp * 0.35, exp * 0.25, 0);
      myceliumGrp.position.y = -exp * 0.35;
      protistGrp.position.set(1.25 + exp * 0.35, 0.42 + Math.sin(t * 1.4) * 0.12, 0.15);
      protistGrp.rotation.y = Math.sin(t * 0.9) * 0.35;
      vacuole.scale.setScalar(1 + Math.sin(t * 3.0) * 0.25);
    });
    return true;
  }

  // =========================================================================
  // 4. 3D ECOSYSTEM BIOME DIORAMA, FOOD WEB & TROPHIC ENERGY FLOW
  // =========================================================================
  if (mode === 'ecosystem_biome_3d') {
    const prodGrp = new THREE.Group();
    const herbGrp = new THREE.Group();
    const carnGrp = new THREE.Group();
    const decompGrp = new THREE.Group();

    // Sculpted layered biome terrain slab + stream pond
    const earthSlab = new THREE.Mesh(
      new THREE.CylinderGeometry(2.55, 2.65, 0.42, 36),
      vault.getMaterial('soil_terrain')
    );
    earthSlab.position.y = -1.25;
    const grassTop = new THREE.Mesh(
      new THREE.CylinderGeometry(2.52, 2.52, 0.12, 36),
      vault.getMaterial('plant_epidermis', { color: 0x4d7c0f })
    );
    grassTop.position.y = -0.99;
    const waterPool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 0.88, 0.08, 24),
      vault.getMaterial('lipid_membrane', { color: 0x0ea5e9, opacity: 0.78, transparent: true })
    );
    waterPool.position.set(0.85, -0.92, 0.65);
    root.add(earthSlab, grassTop, waterPool);

    // Primary Producers: multi-tiered sculpted deciduous & conifer trees + grass tufts
    const trunkMat = vault.getMaterial('soil_terrain', { color: 0x78350f });
    const canopyMat = vault.getMaterial('chloroplast_membrane', { color: 0x16a34a });
    for (const [tx, tz, sc] of [[-1.35, -0.65, 1.0], [-0.45, -1.25, 0.82], [-1.55, 0.55, 0.75]]) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * sc, 0.16 * sc, 1.1 * sc, 10), trunkMat);
      trunk.position.set(tx, -0.42 + (sc - 1) * 0.25, tz);
      const crown = new THREE.Mesh(makeSculptedBlob(0.65 * sc, 0.55 * sc, 0.65 * sc, 14, 12), canopyMat);
      crown.position.set(tx, 0.35 * sc, tz);
      prodGrp.add(trunk, crown);
    }

    // Primary Consumers (Herbivores: sculpted deer/rabbit silhouettes grazing near meadow)
    const herbMat = vault.getMaterial('endocrine_gland', { color: 0xd97706 });
    for (const [hx, hz] of [[0.15, 0.15], [-0.55, 0.65]]) {
      const body = new THREE.Mesh(makeSculptedBlob(0.28, 0.18, 0.16, 12, 10), herbMat);
      body.position.set(hx, -0.72, hz);
      const head = new THREE.Mesh(makeSculptedBlob(0.12, 0.12, 0.1, 10, 8), herbMat);
      head.position.set(hx + 0.22, -0.52, hz);
      herbGrp.add(body, head);
    }

    // Secondary & Apex Predators (Perched Raptor / Carnivore + Food Web energy conduit arcs)
    const carnMat = vault.getMaterial('arterial_vessel', { color: 0xe11d48 });
    const raptorBody = new THREE.Mesh(makeSculptedBlob(0.22, 0.32, 0.22, 14, 12), carnMat);
    raptorBody.position.set(0.95, 0.88, -0.45);
    const wingL = new THREE.Mesh(makeSculptedBlob(0.55, 0.06, 0.24, 12, 8), carnMat);
    wingL.position.set(0.52, 0.96, -0.45);
    wingL.rotation.z = 0.32;
    const wingR = wingL.clone();
    wingR.position.set(1.38, 0.96, -0.45);
    wingR.rotation.z = -0.32;
    carnGrp.add(raptorBody, wingL, wingR);

    // Trophic Energy Conduits (10% flow arrows linking Producers -> Herbivores -> Carnivores -> Decomposers)
    const flowMat = vault.getMaterial('nerve_myelin', { color: 0xfbbf24 });
    const arc1 = new THREE.Mesh(makeTube([[-1.2, 0.1, -0.4], [-0.45, 0.05, 0.0], [0.1, -0.62, 0.15]], 0.032, 16, 8), flowMat);
    const arc2 = new THREE.Mesh(makeTube([[0.15, -0.55, 0.15], [0.65, 0.25, -0.15], [0.95, 0.72, -0.4]], 0.025, 16, 8), flowMat);
    carnGrp.add(arc1, arc2);

    // Decomposers: forest floor fungal cluster breaking down humus
    const fungiMat = vault.getMaterial('chitin_fungi');
    for (let f = 0; f < 4; f++) {
      const fx = -0.35 + f * 0.24;
      const fz = -0.55 + (f % 2) * 0.32;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.18, 8), vault.getMaterial('compact_bone'));
      stem.position.set(fx, -0.84, fz);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), fungiMat);
      cap.position.set(fx, -0.74, fz);
      decompGrp.add(stem, cap);
    }

    tagBioPart(prodGrp, 'producers', 'Sinh vật Sản xuất (Thực vật tầng tán)');
    tagBioPart(herbGrp, 'herbivores', 'Sinh vật Tiêu thụ Bậc 1 (Ăn cỏ)');
    tagBioPart(carnGrp, 'carnivores', 'Sinh vật Tiêu thụ Bậc cao & Dòng năng lượng');
    tagBioPart(decompGrp, 'decomposers', 'Sinh vật Phân giải (Nấm & Vi khuẩn đất)');

    root.add(prodGrp, herbGrp, carnGrp, decompGrp);
    interactables.push(prodGrp, herbGrp, carnGrp, decompGrp);

    animatedTickers.push((t) => {
      const exp = explodeRef.current;
      const eff = (modeParamsRef.current.effPct ?? 10) / 10;
      const showFlow = expFlagsRef.current.showLoss !== false;

      arc1.visible = showFlow;
      arc2.visible = showFlow;
      prodGrp.position.y = exp * 0.25;
      herbGrp.position.y = exp * 0.45;
      carnGrp.position.y = exp * 0.75 + Math.sin(t * 1.4) * 0.08 * eff;
      decompGrp.position.y = -exp * 0.25;
    });
    return true;
  }

  return false;
}
