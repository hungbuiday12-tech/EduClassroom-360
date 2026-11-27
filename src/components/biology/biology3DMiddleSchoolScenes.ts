import * as THREE from 'three';
import { Biology3DMode } from '../../types';
import { GPUParticlePool } from '../../lib/three3DEnhancements';

export interface MiddleSchoolBio3DContext {
  mode: Biology3DMode;
  parts: { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3; label: string }[];
  pulsers: { mesh: THREE.Object3D; phase: number }[];
  gpuPool: GPUParticlePool;
  bioAccentLight: THREE.PointLight;
  register: (mesh: THREE.Object3D, label: string, dir: [number, number, number], isOuterShell?: boolean) => void;
  addLabel: (text: string, pos: [number, number, number], color?: number, anchorPos?: [number, number, number]) => void;
  shellMat: (color: number, opacity?: number) => THREE.MeshPhysicalMaterial;
}

export interface MiddleSchoolBio3DResult {
  onLiveUpdate: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null;
  customEmit: ((t: number, dt: number, params: Record<string, number>, flags: Record<string, boolean | number>) => void) | null;
}

export function buildMiddleSchool3DBioScene(ctx: MiddleSchoolBio3DContext): MiddleSchoolBio3DResult {
  const { mode, gpuPool, bioAccentLight, register, addLabel, shellMat } = ctx;

  switch (mode) {
    case 'plant_flower_seed_3d': {
      bioAccentLight.color.setHex(0xf472b6);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.14, 1.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.55 })
      );
      stem.position.y = -1.15;
      register(stem, 'Cuống hoa & Đế hoa nâng đỡ', [0, -0.7, 0]);

      // Calyx sepals (5)
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const sepal = new THREE.Mesh(
          new THREE.ConeGeometry(0.24, 0.72, 10),
          new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
        );
        sepal.position.set(Math.cos(a) * 0.52, -0.34, Math.sin(a) * 0.52);
        sepal.rotation.z = -Math.cos(a) * 1.1;
        sepal.rotation.x = Math.sin(a) * 1.1;
        register(sepal, 'Đài hoa bảo vệ nụ', [Math.cos(a) * 0.6, -0.3, Math.sin(a) * 0.6]);
      }

      // Corolla petals (5)
      const petals: THREE.Mesh[] = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.31;
        const petal = new THREE.Mesh(
          new THREE.SphereGeometry(0.58, 18, 14),
          new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 })
        );
        petal.scale.set(0.85, 1.35, 0.22);
        petal.position.set(Math.cos(a) * 0.92, 0.25, Math.sin(a) * 0.92);
        petal.lookAt(0, 1.4, 0);
        register(petal, 'Tràng hoa (Cánh hoa thu hút côn trùng)', [Math.cos(a) * 1.1, 0.4, Math.sin(a) * 1.1]);
        petals.push(petal);
      }

      // 6 Stamens (anthers)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const stGroup = new THREE.Group();
        const fil = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.045, 0.95, 10),
          new THREE.MeshStandardMaterial({ color: 0xfef08a })
        );
        fil.position.y = 0.45;
        const anther = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.09, 0.16, 8, 12),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.25 })
        );
        anther.position.y = 0.95;
        stGroup.add(fil, anther);
        stGroup.position.set(Math.cos(a) * 0.46, -0.15, Math.sin(a) * 0.46);
        stGroup.rotation.z = -Math.cos(a) * 0.32;
        stGroup.rotation.x = Math.sin(a) * 0.32;
        register(stGroup, 'Nhị hoa (Chỉ nhị + Bao phấn chứa hạt phấn)', [Math.cos(a) * 0.7, 0.5, Math.sin(a) * 0.7]);
      }

      // Central Pistil: Ovary + Style + Stigma + visible Ovules inside
      const ovary = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 24, 20),
        shellMat(0x4ade80, 0.46)
      );
      ovary.position.y = 0.04;
      register(ovary, 'Bầu nhụy (Phát triển thành Quả sau thụ tinh)', [0, 0.1, 0.6], true);

      const ovule1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.35 })
      );
      ovule1.position.set(-0.12, 0.02, 0);
      const ovule2 = ovule1.clone();
      ovule2.position.set(0.12, 0.06, 0.06);
      register(ovule1, 'Noãn trong bầu (Phát triển thành Hạt)', [-0.3, 0.1, 0.2]);
      register(ovule2, 'Noãn trong bầu (Phát triển thành Hạt)', [0.3, 0.1, 0.2]);

      const style = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, 0.95, 14),
        new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.4 })
      );
      style.position.y = 0.78;
      register(style, 'Vòi nhụy dẫn ống phấn', [0, 0.7, 0]);

      const stigma = new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 })
      );
      stigma.scale.set(1.25, 0.65, 1.25);
      stigma.position.y = 1.26;
      register(stigma, 'Đầu nhụy tiếp nhận hạt phấn', [0, 1.1, 0]);

      addLabel('Hoa lưỡng tính → Thụ phấn & Tạo Quả – Hạt', [0, 2.0, 0], 0xf9a8d4);
      let pollenCd = 0;

      return {
        onLiveUpdate: (_t, dt, params, flags) => {
          const fert = Boolean(flags.fertilized) || (params.pollinationPct ?? 45) >= 80;
          const targetOvaryScale = fert ? 1.58 : 1.0;
          const s = THREE.MathUtils.damp(ovary.scale.x, targetOvaryScale, 5, dt);
          ovary.scale.set(s, s * 1.08, s);
          const pScale = fert ? 0.35 : 1.0;
          petals.forEach((pt) => {
            pt.scale.x = THREE.MathUtils.damp(pt.scale.x, 0.85 * pScale, 5, dt);
            pt.scale.y = THREE.MathUtils.damp(pt.scale.y, 1.35 * pScale, 5, dt);
          });
        },
        customEmit: (_t, dt, params, flags) => {
          pollenCd -= dt;
          if (!flags.fertilized && (params.pollinationPct ?? 45) > 10 && pollenCd <= 0) {
            pollenCd = 0.14;
            const ang = Math.random() * Math.PI * 2;
            gpuPool.spawn(Math.cos(ang) * 0.55, 0.88, Math.sin(ang) * 0.55, -Math.cos(ang) * 0.65, 0.45, -Math.sin(ang) * 0.65, 1.0, 0.9, 0xfacc15);
          }
        }
      };
    }

    case 'comparative_hearts_3d': {
      bioAccentLight.color.setHex(0xf43f5e);
      const heartSpecs = [
        { id: 1, x: -2.4, label: 'Tim Cá (2 ngăn · 1 vòng)', chambers: 2 },
        { id: 2, x: 0, label: 'Tim Ếch (3 ngăn · Máu pha)', chambers: 3 },
        { id: 3, x: 2.4, label: 'Tim Chim & Thú (4 ngăn · Máu tách biệt)', chambers: 4 }
      ];
      const heartGroups: THREE.Group[] = [];

      heartSpecs.forEach((sp) => {
        const g = new THREE.Group();
        g.position.set(sp.x, -0.1, 0);

        if (sp.chambers === 2) {
          const atr = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 18), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 }));
          atr.position.y = 0.45;
          const vent = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.95, 20), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 }));
          vent.rotation.x = Math.PI;
          vent.position.y = -0.35;
          g.add(atr, vent);
        } else if (sp.chambers === 3) {
          const aL = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 }));
          aL.position.set(-0.34, 0.52, 0);
          const aR = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 }));
          aR.position.set(0.34, 0.52, 0);
          const vent = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.05, 22), new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.35 }));
          vent.rotation.x = Math.PI;
          vent.position.y = -0.32;
          g.add(aL, aR, vent);
        } else {
          const aL = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.32 }));
          aL.position.set(-0.36, 0.55, 0);
          const aR = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 16), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.32 }));
          aR.position.set(0.36, 0.55, 0);
          const vL = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.52, 10, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.32 }));
          vL.position.set(-0.32, -0.25, 0);
          const vR = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.52, 10, 16), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.32 }));
          vR.position.set(0.32, -0.25, 0);
          const aorta = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.1, 12, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.3 }));
          aorta.position.set(-0.08, 0.92, 0);
          g.add(aL, aR, vL, vR, aorta);
        }

        register(g, sp.label, [sp.x * 0.45, 0.2, 0]);
        addLabel(sp.id === 1 ? 'Cá (2 ngăn)' : sp.id === 2 ? 'Ếch (3 ngăn)' : 'Chim & Thú (4 ngăn)', [sp.x, 1.45, 0], 0xfda4af);
        heartGroups.push(g);
      });

      return {
        onLiveUpdate: (t, dt, params, flags) => {
          const stage = Math.max(1, Math.min(3, Math.round(params.animalStage ?? 3)));
          const hr = params.heartRate ?? 75;
          const showAll = flags.showAllThree !== false;
          const beat = 1 + Math.pow(Math.max(0, Math.sin(t * (hr / 18))), 4) * 0.14;
          heartGroups.forEach((hg, idx) => {
            const isSel = idx + 1 === stage;
            hg.visible = showAll || isSel;
            const targetScale = (isSel ? 1.2 : 0.9) * beat;
            const s = THREE.MathUtils.damp(hg.scale.x, targetScale, 10, dt);
            hg.scale.setScalar(s);
          });
        },
        customEmit: null
      };
    }

    case 'invertebrate_biodiversity_3d': {
      bioAccentLight.color.setHex(0x10b981);
      const specimens: THREE.Group[] = [];

      // 1. Hydra (Cnidaria)
      const hydra = new THREE.Group();
      hydra.position.set(-2.5, -0.1, 0);
      const hBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 1.3, 14),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 })
      );
      hydra.add(hBody);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const tent = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.05, 0.75, 8),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
        );
        tent.position.set(Math.cos(a) * 0.25, 0.85, Math.sin(a) * 0.25);
        tent.rotation.z = -Math.cos(a) * 0.65;
        tent.rotation.x = Math.sin(a) * 0.65;
        hydra.add(tent);
      }
      register(hydra, 'Ruột khoang (Thủy tức · Đối xứng tỏa tròn, tế bào gai)', [-1.2, 0.2, 0]);
      addLabel('1. Ruột khoang', [-2.5, 1.4, 0], 0x38bdf8);
      specimens.push(hydra);

      // 2. Earthworm (Annelida)
      const worm = new THREE.Group();
      worm.position.set(-0.85, -0.2, 0);
      for (let i = 0; i < 9; i++) {
        const seg = new THREE.Mesh(
          new THREE.SphereGeometry(i === 3 || i === 4 ? 0.24 : 0.19, 14, 14),
          new THREE.MeshStandardMaterial({ color: i === 3 || i === 4 ? 0xfda4af : 0xec4899, roughness: 0.45 })
        );
        seg.position.set(0, (i - 4) * 0.2, Math.sin(i * 0.6) * 0.14);
        worm.add(seg);
      }
      register(worm, 'Giun đốt (Giun đất · Phân đốt, đai sinh dục, hô hấp qua da)', [-0.4, 0.2, 0]);
      addLabel('2. Giun đốt', [-0.85, 1.4, 0], 0xf472b6);
      specimens.push(worm);

      // 3. Mollusk Snail / Bivalve
      const mollusk = new THREE.Group();
      mollusk.position.set(0.85, -0.2, 0);
      const foot = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.18, 0.8, 8, 12),
        new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 })
      );
      foot.rotation.z = Math.PI / 2;
      foot.position.y = -0.35;
      const shell = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.28, 0.14, 48, 12, 2, 3),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35 })
      );
      shell.position.y = 0.08;
      mollusk.add(foot, shell);
      register(mollusk, 'Thân mềm (Ốc/Trai · Thân mềm, vỏ đá vôi CaCO₃)', [0.4, 0.2, 0]);
      addLabel('3. Thân mềm', [0.85, 1.4, 0], 0xfbbf24);
      specimens.push(mollusk);

      // 4. Arthropod (Segmented chitin + jointed legs)
      const bug = new THREE.Group();
      bug.position.set(2.5, -0.1, 0);
      const thorax = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.24, 0.9, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.15 })
      );
      thorax.rotation.z = Math.PI / 2;
      bug.add(thorax);
      for (let side of [-1, 1]) {
        for (let lx of [-0.35, 0, 0.35]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8),
            new THREE.MeshStandardMaterial({ color: 0x059669 })
          );
          leg.position.set(lx, -0.24, side * 0.28);
          leg.rotation.x = side * 0.65;
          bug.add(leg);
        }
      }
      register(bug, 'Chân khớp (Vỏ ngoài Kitin, chân phân đốt linh hoạt)', [1.2, 0.2, 0]);
      addLabel('4. Chân khớp', [2.5, 1.4, 0], 0x34d399);
      specimens.push(bug);

      return {
        onLiveUpdate: (t, dt, params, flags) => {
          const activeIdx = Math.max(1, Math.min(4, Math.round(params.phylumId ?? 4))) - 1;
          const showAll = flags.showAll !== false;
          specimens.forEach((sp, idx) => {
            sp.visible = showAll || idx === activeIdx;
            const target = idx === activeIdx ? 1.24 : 0.88;
            const sc = THREE.MathUtils.damp(sp.scale.x, target, 8, dt);
            sp.scale.setScalar(sc);
            sp.rotation.y = Math.sin(t * 0.9 + idx) * 0.35;
          });
        },
        customEmit: null
      };
    }

    case 'plant_tropism_germination_3d': {
      bioAccentLight.color.setHex(0x22c55e);

      // Soil block
      const soil = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.9, 2.2),
        shellMat(0x78350f, 0.55)
      );
      soil.position.y = -0.85;
      register(soil, 'Tầng đất ẩm chứa chất dinh dưỡng & O₂', [0, -0.8, 0.5], true);

      // Bean seed cotyledons
      const seed = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 18, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
      );
      seed.scale.set(1.3, 0.85, 0.95);
      seed.position.set(0, -0.45, 0);
      register(seed, 'Hạt đậu (Hai lá mầm dự trữ tinh bột)', [0, -0.3, 0.4]);

      // Radicle root growing downward (Geotropism)
      const root = new THREE.Mesh(
        new THREE.ConeGeometry(0.11, 1.0, 12),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 })
      );
      root.rotation.x = Math.PI;
      root.position.set(0, -0.95, 0);
      register(root, 'Rễ mầm (Hướng trọng lực dương đâm xuống đất)', [0, -1.0, 0]);

      // Shoot pivot that bends toward sunlight (Phototropism)
      const shootPivot = new THREE.Group();
      shootPivot.position.set(0, -0.35, 0);
      const stemMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, 1.65, 14),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.45 })
      );
      stemMesh.position.y = 0.82;
      const leafL = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 14, 12),
        new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.35 })
      );
      leafL.scale.set(1.5, 0.3, 0.8);
      leafL.position.set(-0.34, 1.55, 0);
      const leafR = leafL.clone();
      leafR.position.set(0.34, 1.55, 0);
      shootPivot.add(stemMesh, leafL, leafR);
      register(shootPivot, 'Thân mầm & Lá non (Hướng sáng dương nhờ Auxin)', [0, 0.7, 0]);

      // Sun sphere orbiting based on lightAngle
      const sun = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 20, 18),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
      );
      sun.position.set(2.0, 2.2, 0);
      register(sun, 'Nguồn sáng mặt trời kích thích phân bố Auxin', [1.4, 1.6, 0]);

      addLabel('Nảy mầm · Hướng sáng (+) · Hướng đất (+)', [0, 2.4, 0], 0x86efac);
      let waterCd = 0;

      return {
        onLiveUpdate: (_t, dt, params, flags) => {
          const angleDeg = params.lightAngle ?? 40;
          const angleRad = (angleDeg * Math.PI) / 180;
          sun.position.set(Math.sin(angleRad) * 2.5, Math.cos(angleRad) * 2.3 + 0.3, 0);
          const moist = Math.max(0.2, (params.moisture ?? 75) / 100);
          const sprouted = flags.sprouted !== false && moist >= 0.4;
          const targetHeight = sprouted ? 0.55 + moist * 0.65 : 0.15;
          shootPivot.scale.y = THREE.MathUtils.damp(shootPivot.scale.y, targetHeight, 5, dt);
          root.scale.y = THREE.MathUtils.damp(root.scale.y, sprouted ? 0.6 + moist * 0.6 : 0.2, 5, dt);
          // Auxin bends shoot toward the light!
          const targetBend = sprouted ? -angleRad * 0.52 : 0;
          shootPivot.rotation.z = THREE.MathUtils.damp(shootPivot.rotation.z, targetBend, 5, dt);
        },
        customEmit: (_t, dt, params) => {
          waterCd -= dt;
          if ((params.moisture ?? 75) >= 45 && waterCd <= 0) {
            waterCd = 0.24;
            gpuPool.spawn((Math.random() - 0.5) * 1.4, -0.75, (Math.random() - 0.5) * 0.8, 0, 0.35, 0, 0.7, 0.7, 0x38bdf8);
          }
        }
      };
    }

    case 'skeleton_senses_3d': {
      bioAccentLight.color.setHex(0x38bdf8);

      // Left side: Arm Lever (Humerus + Forearm + Biceps)
      const armGroup = new THREE.Group();
      armGroup.position.set(-1.35, 0, 0);
      const humerus = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 1.4, 14),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 })
      );
      humerus.position.y = 0.45;
      const biceps = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
      );
      biceps.scale.set(0.9, 1.75, 0.9);
      biceps.position.set(0.18, 0.45, 0);
      const joint = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
      );
      joint.position.y = -0.25;
      const forearmPivot = new THREE.Group();
      forearmPivot.position.y = -0.25;
      const radiusBone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.08, 1.35, 14),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
      );
      radiusBone.rotation.z = -Math.PI / 2;
      radiusBone.position.x = 0.68;
      forearmPivot.add(radiusBone);
      armGroup.add(humerus, biceps, joint, forearmPivot);
      register(armGroup, 'Hệ Vận Động (Xương – Khớp động – Cơ Nhị đầu)', [-1.2, 0.2, 0]);
      addLabel('Đòn bẩy Cơ – Xương', [-1.35, 1.55, 0], 0xfca5a5);

      // Right side: Human Eye Optical Chamber
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(1.45, 0.1, 0);
      const sclera = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 24, 20),
        shellMat(0xe2e8f0, 0.34)
      );
      const retina = new THREE.Mesh(
        new THREE.SphereGeometry(0.76, 20, 16, Math.PI * 0.65, Math.PI * 0.7),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.3, side: THREE.DoubleSide })
      );
      const eyeLens = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 18, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
      );
      eyeLens.scale.set(0.42, 1.0, 1.0);
      eyeLens.position.set(-0.56, 0, 0);
      const focalDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.7 })
      );
      focalDot.position.set(0.72, 0, 0);
      eyeGroup.add(sclera, retina, eyeLens, focalDot);
      register(eyeGroup, 'Mắt người (Thủy tinh thể điều tiết hội tụ trên Võng mạc)', [1.2, 0.2, 0], true);
      addLabel('Thị giác & Điều tiết Mắt', [1.45, 1.55, 0], 0x7dd3fc);

      return {
        onLiveUpdate: (_t, dt, params, flags) => {
          const flex = (params.muscleFlex ?? 60) / 100;
          const targetRot = flex * 1.25;
          forearmPivot.rotation.z = THREE.MathUtils.damp(forearmPivot.rotation.z, targetRot, 7, dt);
          biceps.scale.x = THREE.MathUtils.damp(biceps.scale.x, 0.8 + flex * 0.55, 7, dt);
          const myopia = Boolean(flags.myopiaLens) ? -0.25 : 0;
          const err = ((params.eyeError ?? 0) * 0.04) + myopia;
          focalDot.position.x = THREE.MathUtils.damp(focalDot.position.x, 0.72 - err, 7, dt);
          const mat = focalDot.material as THREE.MeshStandardMaterial;
          const ok = Math.abs(focalDot.position.x - 0.72) < 0.14;
          mat.color.setHex(ok ? 0x22c55e : 0xef4444);
        },
        customEmit: null
      };
    }

    case 'digestive_tract_3d':
    default: {
      // digestive_tract_3d
      bioAccentLight.color.setHex(0xf59e0b);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.9, 0),
        new THREE.Vector3(0, 0.95, 0.1),
        new THREE.Vector3(0.45, 0.2, 0.25),
        new THREE.Vector3(-0.35, -0.45, 0.2),
        new THREE.Vector3(0.55, -0.95, -0.15),
        new THREE.Vector3(-0.45, -1.35, -0.25),
        new THREE.Vector3(0.25, -1.7, 0.1)
      ]);
      const tract = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.24, 18, false),
        shellMat(0xf472b6, 0.46)
      );
      register(tract, 'Thực quản → Dạ dày → Ruột non (Ống tiêu hóa)', [0, 0, 0.6], true);

      const stomach = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 24, 20),
        shellMat(0xfb7185, 0.52)
      );
      stomach.scale.set(1.3, 0.92, 0.85);
      stomach.position.set(0.22, 0.1, 0.22);
      register(stomach, 'Dạ dày co bóp tiết HCl & Pepsin (pH ≈ 2)', [0.6, 0.2, 0.3], true);

      const bolus = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 18, 18),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.45, roughness: 0.3 })
      );
      register(bolus, 'Viên thức ăn đang được Enzym phân giải', [0, 0.4, 0.5]);

      addLabel('Miệng → Dạ dày → Ruột non hấp thụ', [0, 2.25, 0], 0xfde68a);
      let enzCd = 0;

      return {
        onLiveUpdate: (t, dt, params, flags) => {
          const pos = Math.max(1, Math.min(3, params.bolusPos ?? 2.0));
          const u = (pos - 1) / 2;
          const pt = curve.getPointAt(Math.max(0.02, Math.min(0.98, u)));
          bolus.position.lerp(pt, Math.min(1, dt * 8));
          const peri = flags.peristalsis !== false;
          if (peri) {
            const sq = 1 + Math.sin(t * 4.5) * 0.08;
            stomach.scale.set(1.3 * sq, 0.92 / sq, 0.85 * sq);
          }
        },
        customEmit: (_t, dt, params) => {
          enzCd -= dt;
          const act = (params.enzymeAct ?? 80) / 100;
          if (enzCd <= 0 && act > 0.1) {
            enzCd = 0.22 - act * 0.14;
            gpuPool.spawn(
              bolus.position.x + (Math.random() - 0.5) * 0.35,
              bolus.position.y + (Math.random() - 0.5) * 0.35,
              bolus.position.z + (Math.random() - 0.5) * 0.35,
              0,
              0.3,
              0,
              0.8,
              0.7,
              0x34d399
            );
          }
        }
      };
    }
  }
}
