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
