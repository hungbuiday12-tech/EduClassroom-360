import * as THREE from 'three';
import { Chemistry3DMode } from '../../types';
import { GPUParticlePool } from '../../lib/three3DEnhancements';

export interface MiddleSchoolChem3DContext {
  mode: Chemistry3DMode;
  root: THREE.Group;
  accentPoint: THREE.PointLight;
  gpuPool: GPUParticlePool;
  dynamicSpinners: THREE.Object3D[];
  registerPart: (mesh: THREE.Object3D, label: string, dir: [number, number, number], isOuterShell?: boolean) => void;
  addLabel: (text: string, pos: [number, number, number], color?: number, anchorPos?: [number, number, number]) => void;
  glassMat: (color: number, opacity?: number) => THREE.MeshPhysicalMaterial;
}

export type Chem3DLiveCallback = (
  t: number,
  dt: number,
  params: Record<string, number>,
  flags: Record<string, boolean | number>
) => void;

export function buildMiddleSchool3DChemScene(ctx: MiddleSchoolChem3DContext): Chem3DLiveCallback | null {
  const { mode, root, accentPoint, gpuPool, dynamicSpinners, registerPart, addLabel, glassMat } = ctx;

  switch (mode) {
    case 'matter_states_3d': {
      accentPoint.color.setHex(0x38bdf8);
      const cylGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.45, 1.45, 3.2, 32, 1, true),
        glassMat(0xe0f2fe, 0.28)
      );
      registerPart(cylGlass, 'Bình xi-lanh thủy tinh chịu nhiệt', [0, 0, 1.0], true);

      const basePlate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.62, 0.24, 32),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.65, roughness: 0.35 })
      );
      basePlate.position.y = -1.72;
      registerPart(basePlate, 'Đế gia nhiệt / làm lạnh', [0, -0.7, 0]);

      const heaterMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 0.2,
        roughness: 0.35
      });
      const heaterRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.09, 12, 36), heaterMat);
      heaterRing.rotation.x = Math.PI / 2;
      heaterRing.position.y = -1.55;
      registerPart(heaterRing, 'Vòng nhiệt chuyển thể', [0, -0.5, 0]);

      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(1.38, 1.38, 0.16, 30),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.78, roughness: 0.25 })
      );
      piston.position.y = 1.45;
      registerPart(piston, 'Pít-tông nén áp suất', [0, 0.9, 0]);

      // 27 particles for solid-liquid-gas
      const molGroup = new THREE.Group();
      const mols: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; home: THREE.Vector3; seed: number }[] = [];
      for (let x = -1; x <= 1; x++) {
        for (let y = 0; y < 3; y++) {
          for (let z = -1; z <= 1; z++) {
            const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.2 });
            const sp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), mat);
            const home = new THREE.Vector3(x * 0.42, -1.25 + y * 0.42, z * 0.42);
            sp.position.copy(home);
            molGroup.add(sp);
            mols.push({ mesh: sp, mat, home, seed: (x + 2) * 3.1 + y * 5.7 + (z + 2) * 7.3 });
          }
        }
      }
      registerPart(molGroup, 'Mạng phân tử Rắn – Lỏng – Khí', [0, 0.3, 0]);
      addLabel('Ba thể chất & Chuyển thể (Rắn ↔ Lỏng ↔ Khí)', [0, 2.05, 0], 0x7dd3fc);

      const colSolid = new THREE.Color(0x38bdf8);
      const colLiquid = new THREE.Color(0x14b8a6);
      const colGas = new THREE.Color(0xf59e0b);
      const colN2 = new THREE.Color(0x3b82f6);
      const colO2 = new THREE.Color(0xef4444);
      const colAr = new THREE.Color(0xa855f7);

      return (t, dt, params, flags) => {
        const tempC = params.tempC ?? 25;
        const press = params.pressureAtm ?? 1;
        const airMix = Boolean(flags.showAirMix);
        const topY = 1.45 - (press - 1) * 0.42;
        piston.position.y = THREE.MathUtils.damp(piston.position.y, topY, 6, dt);
        heaterMat.emissiveIntensity = THREE.MathUtils.damp(heaterMat.emissiveIntensity, tempC >= 50 ? 1.15 : 0.08, 5, dt);

        mols.forEach((m, idx) => {
          if (airMix) {
            const isO2 = idx < 6;
            const isAr = idx === 26;
            m.mat.color.lerp(isAr ? colAr : isO2 ? colO2 : colN2, 0.14);
            const ang = t * 1.4 + m.seed;
            const tx = Math.cos(ang * 0.9 + idx) * 1.05;
            const ty = -0.3 + Math.sin(ang * 1.3 + idx * 0.7) * 1.1;
            const tz = Math.sin(ang * 0.8 + idx * 1.1) * 1.05;
            m.mesh.position.set(tx, ty, tz);
            return;
          }
          if (tempC < 0) {
            m.mat.color.lerp(colSolid, 0.15);
            m.mesh.position.set(
              m.home.x + Math.sin(t * 16 + m.seed) * 0.025,
              m.home.y + Math.cos(t * 15 + m.seed) * 0.025,
              m.home.z + Math.sin(t * 14 + m.seed) * 0.025
            );
          } else if (tempC < 100) {
            m.mat.color.lerp(colLiquid, 0.15);
            const tx = Math.sin(t * 1.8 + m.seed) * 0.95;
            const ty = -1.35 + ((idx % 3) * 0.28 + Math.abs(Math.sin(t * 2.4 + m.seed)) * 0.18);
            const tz = Math.cos(t * 1.6 + m.seed * 1.2) * 0.95;
            m.mesh.position.x = THREE.MathUtils.damp(m.mesh.position.x, tx, 6, dt);
            m.mesh.position.y = THREE.MathUtils.damp(m.mesh.position.y, ty, 6, dt);
            m.mesh.position.z = THREE.MathUtils.damp(m.mesh.position.z, tz, 6, dt);
          } else {
            m.mat.color.lerp(colGas, 0.15);
            const sp = 2.1 + (tempC - 100) * 0.03;
            const maxH = Math.max(0.2, topY - 0.35);
            const tx = Math.sin(t * sp + m.seed) * 1.1;
            const ty = -1.35 + (0.5 + 0.5 * Math.sin(t * sp * 1.2 + m.seed * 1.4)) * (maxH + 1.1);
            const tz = Math.cos(t * sp * 0.95 + m.seed * 1.8) * 1.1;
            m.mesh.position.set(tx, ty, tz);
          }
        });
      };
    }

    case 'separation_lab_3d': {
      accentPoint.color.setHex(0x10b981);
      // 4 separation stations placed around bench
      const st1 = new THREE.Group();
      st1.position.set(-2.55, -0.5, 0);
      const funnelCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 0.75, 24, 1, true),
        glassMat(0xe0f2fe, 0.42)
      );
      funnelCone.rotation.x = Math.PI;
      funnelCone.position.y = 0.72;
      const sandCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.22, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 })
      );
      sandCone.position.y = 0.65;
      const flask1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.55, 0.95, 22, 1, true),
        glassMat(0xbae6fd, 0.35)
      );
      flask1.position.y = -0.6;
      const water1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.5, 0.42, 22),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.68, roughness: 0.1 })
      );
      water1.position.y = -0.84;
      st1.add(funnelCone, sandCone, flask1, water1);
      registerPart(st1, '1. Phễu lọc cát khỏi nước', [-0.6, 0, 0]);

      const st2 = new THREE.Group();
      st2.position.set(-0.85, -0.5, 0);
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(0.56, 22, 14, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, side: THREE.DoubleSide })
      );
      dish.position.y = 0.15;
      const saltPile = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.14, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
      );
      saltPile.position.y = -0.22;
      const flameMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.9 });
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 14), flameMat);
      flame.position.y = -0.78;
      st2.add(dish, saltPile, flame);
      registerPart(st2, '2. Bát sứ cô cạn thu muối NaCl', [-0.2, 0, 0]);

      const st3 = new THREE.Group();
      st3.position.set(0.85, -0.5, 0);
      const sepBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.16, 1.15, 24, 1, true),
        glassMat(0xe0f2fe, 0.36)
      );
      sepBody.position.y = 0.45;
      const oilLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.37, 0.31, 0.42, 22),
        new THREE.MeshPhysicalMaterial({ color: 0xfacc15, transparent: true, opacity: 0.8, roughness: 0.12 })
      );
      oilLayer.position.y = 0.62;
      const watLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.18, 0.42, 22),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72, roughness: 0.1 })
      );
      watLayer.position.y = 0.2;
      const beaker3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.7, 22, 1, true),
        glassMat(0xbae6fd, 0.32)
      );
      beaker3.position.y = -0.72;
      st3.add(sepBody, oilLayer, watLayer, beaker3);
      registerPart(st3, '3. Phễu chiết tách Dầu ăn – Nước', [0.2, 0, 0]);

      const st4 = new THREE.Group();
      st4.position.set(2.55, -0.5, 0);
      const magnetArch = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.09, 12, 28, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.55, roughness: 0.3 })
      );
      magnetArch.position.y = 0.45;
      const feGroup = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const dot = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.08, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
        );
        dot.position.set((i % 2 === 0 ? -0.34 : 0.34) + (Math.random() - 0.5) * 0.08, 0.22 + (i % 4) * 0.05, (Math.random() - 0.5) * 0.1);
        feGroup.add(dot);
      }
      const sulfurDish = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.52, 0.14, 24),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.75 })
      );
      sulfurDish.position.y = -0.82;
      st4.add(magnetArch, feGroup, sulfurDish);
      registerPart(st4, '4. Nam châm tách bột Sắt Fe khỏi Lưu huỳnh S', [0.6, 0, 0]);

      addLabel('Lọc', [-2.55, 0.85, 0], 0x7dd3fc);
      addLabel('Cô cạn', [-0.85, 0.85, 0], 0xfdba74);
      addLabel('Chiết', [0.85, 0.85, 0], 0xfde047);
      addLabel('Nam châm', [2.55, 0.85, 0], 0xfca5a5);

      const stations = [st1, st2, st3, st4];
      let emitTimer = 0;
      return (t, dt, params, flags) => {
        const activeM = Math.max(1, Math.min(4, Math.round(params.methodId ?? 1)));
        const running = Boolean(flags.running);
        stations.forEach((st, idx) => {
          const targetS = idx + 1 === activeM ? 1.22 : 0.88;
          const sc = THREE.MathUtils.damp(st.scale.x, targetS, 6, dt);
          st.scale.setScalar(sc);
        });
        magnetArch.position.y = running && activeM === 4 ? 0.48 + Math.sin(t * 2.5) * 0.15 : 0.45;
        flameMat.emissiveIntensity = running && activeM === 2 ? 1.15 : 0.25;
        emitTimer -= dt;
        if (running && emitTimer <= 0) {
          emitTimer = 0.16;
          if (activeM === 1) gpuPool.spawn(-2.55, -0.3, 0, 0, -1.6, 0, 1.0, 0.8, 0x38bdf8);
          if (activeM === 2) gpuPool.spawn(-0.85 + (Math.random() - 0.5) * 0.3, -0.1, 0, 0, 1.5, 0, 1.1, 0.9, 0xe2e8f0);
          if (activeM === 3) gpuPool.spawn(0.85, -0.5, 0, 0, -1.4, 0, 0.9, 0.8, 0x38bdf8);
        }
      };
    }

    case 'ionic_covalent_3d': {
      accentPoint.color.setHex(0x38bdf8);
      const ionGroup = new THREE.Group();
      const naNuc = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.28 })
      );
      naNuc.position.set(-1.55, 0, 0);
      const clNuc = new THREE.Mesh(
        new THREE.SphereGeometry(0.52, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.28 })
      );
      clNuc.position.set(1.55, 0, 0);
      const naRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.025, 10, 40),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      naRing.position.copy(naNuc.position);
      const clRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.12, 0.025, 10, 44),
        new THREE.MeshBasicMaterial({ color: 0x4ade80 })
      );
      clRing.position.copy(clNuc.position);
      const transferE = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.9 })
      );
      ionGroup.add(naNuc, clNuc, naRing, clRing, transferE);
      registerPart(ionGroup, 'Liên kết Ion: Na⁺ nhường 1e cho Cl⁻', [0, 0.4, 0]);

      const covGroup = new THREE.Group();
      const oNuc = new THREE.Mesh(
        new THREE.SphereGeometry(0.52, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25 })
      );
      oNuc.position.set(0, 0.45, 0);
      const h1Nuc = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 })
      );
      h1Nuc.position.set(-1.15, -0.52, 0);
      const h2Nuc = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 })
      );
      h2Nuc.position.set(1.15, -0.52, 0);
      const sharedE1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.9 })
      );
      const sharedE2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.9 })
      );
      covGroup.add(oNuc, h1Nuc, h2Nuc, sharedE1, sharedE2);
      registerPart(covGroup, 'Liên kết Cộng hóa trị H₂O (Góp chung cặp e)', [0, -0.4, 0]);

      addLabel('Cho–Nhận Ion (NaCl) vs Góp chung Cộng hóa trị (H₂O)', [0, 1.9, 0], 0x93c5fd);
      dynamicSpinners.push(root);

      return (t, _dt, params, flags) => {
        const isIon = Math.round(params.bondType ?? 1) === 1;
        const spd = params.shellZ ?? 1;
        const bonded = Boolean(flags.bonded);
        ionGroup.visible = isIon;
        covGroup.visible = !isIon;
        if (isIon) {
          const u = bonded ? Math.min(1, 0.5 + 0.5 * Math.sin(t * 1.4 * spd)) : 0;
          transferE.position.set(
            THREE.MathUtils.lerp(-0.6, 0.45, u),
            Math.sin(u * Math.PI) * 0.85,
            Math.cos(t * 3 * spd) * 0.25
          );
          naNuc.position.x = bonded ? -1.35 : -1.85;
          clNuc.position.x = bonded ? 1.35 : 1.85;
          naRing.position.x = naNuc.position.x;
          clRing.position.x = clNuc.position.x;
        } else {
          const d = bonded ? 1.0 : 1.55;
          h1Nuc.position.set(-1.15 * d, -0.52 * d, 0);
          h2Nuc.position.set(1.15 * d, -0.52 * d, 0);
          sharedE1.position.set(-0.58 * d + Math.cos(t * 4 * spd) * 0.16, -0.02 + Math.sin(t * 4 * spd) * 0.16, 0.15);
          sharedE2.position.set(0.58 * d + Math.cos(-t * 4 * spd) * 0.16, -0.02 + Math.sin(-t * 4 * spd) * 0.16, 0.15);
        }
      };
    }

    default: {
      // indicator_bench_3d
      accentPoint.color.setHex(0xf43f5e);
      const beakerGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.15, 2.2, 32, 1, true),
        glassMat(0xe0f2fe, 0.34)
      );
      beakerGlass.position.y = -0.6;
      registerPart(beakerGlass, 'Cốc thủy tinh dung dịch chuẩn pH', [0, 0, 0.9], true);

      const liqMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.64,
        roughness: 0.12
      });
      const liqBody = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 1.55, 30), liqMat);
      liqBody.position.y = -0.88;
      registerPart(liqBody, 'Dung dịch thử pH 0–14', [0, -0.4, 0]);

      const dryLitmus = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.05, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.65 })
      );
      dryLitmus.position.set(-0.25, 0.35, 0);
      registerPart(dryLitmus, 'Phần giấy quỳ tím chưa nhúng', [-0.4, 0.5, 0]);

      const wetLitmusMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.55 });
      const wetLitmus = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.85, 0.04), wetLitmusMat);
      wetLitmus.position.set(-0.25, -0.58, 0);
      registerPart(wetLitmus, 'Phần giấy quỳ đổi màu (Đỏ / Tím / Xanh)', [-0.4, -0.2, 0]);

      const znRibbon = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.14, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.78, roughness: 0.28 })
      );
      znRibbon.position.set(0.35, -1.52, 0);
      registerPart(znRibbon, 'Viên Kẽm Zn phản ứng với Acid tạo khí H₂', [0.5, -0.6, 0]);

      addLabel('Thang pH 0–14 · Quỳ Tím & Sủi Khí H₂', [0, 1.45, 0], 0xfda4af);

      const cAcid = new THREE.Color(0xef4444);
      const cNeutral = new THREE.Color(0x9333ea);
      const cBase = new THREE.Color(0x2563eb);
      const cLiqNeutral = new THREE.Color(0x7dd3fc);
      const cLiqPink = new THREE.Color(0xec4899);
      let bubbleTimer = 0;

      return (_t, dt, params, flags) => {
        const ph = params.ph ?? 2.0;
        const hasZn = Boolean(flags.addZn);
        znRibbon.visible = hasZn;
        const targetLitmus = ph < 6.5 ? cAcid : ph > 7.5 ? cBase : cNeutral;
        wetLitmusMat.color.lerp(targetLitmus, 0.16);
        liqMat.color.lerp(ph > 8.3 ? cLiqPink : cLiqNeutral, 0.12);

        bubbleTimer -= dt;
        if (hasZn && ph < 5.5 && bubbleTimer <= 0) {
          bubbleTimer = Math.max(0.05, 0.04 + ph * 0.03);
          gpuPool.spawn(
            0.35 + (Math.random() - 0.5) * 0.45,
            -1.45,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            1.6,
            0,
            0.9,
            1.0,
            0xe2e8f0
          );
        }
      };
    }
  }
}
