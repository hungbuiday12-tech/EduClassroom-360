import * as THREE from 'three';
import type { Batch2Physics3DModeId } from '../../data/physicsExtraSimsBatch2Data';
import type { Extra3DSceneContext, Extra3DStateGetter } from './physics3DExtraScenes';
import { createTroikaLabel } from '../../lib/three3DEnhancements';

function orientSeg(
  mesh: THREE.Mesh,
  a: THREE.Vector3,
  b: THREE.Vector3,
  tmpDir: THREE.Vector3,
  upAxis: THREE.Vector3
) {
  tmpDir.subVectors(b, a);
  const len = tmpDir.length();
  if (len < 1e-4) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  mesh.position.copy(a).addScaledVector(tmpDir, 0.5);
  tmpDir.divideScalar(len);
  mesh.quaternion.setFromUnitVectors(upAxis, tmpDir);
  mesh.scale.set(1, len, 1);
}

export function buildBatch2Extra3DScene(
  mode: string,
  group: THREE.Group,
  getParams: Extra3DStateGetter,
  getElapsed: () => number,
  ctx?: Extra3DSceneContext
): ((effDt: number) => void) | null {
  const m = mode as Batch2Physics3DModeId;
  const upAxis = new THREE.Vector3(0, 1, 0);
  const clipPlanes = ctx?.cutawayPlanes ?? [];
  const pool = ctx?.particlePool ?? null;
  const trail = ctx?.trail ?? null;
  const camera = ctx?.camera ?? undefined;

  switch (m) {
    // 1. ATWOOD PULLEY 3D
    case 'atwood_pulley_3d': {
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.28, clearcoat: 0.4 });
      const basePad = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 1.8), standMat);
      basePad.position.set(0, 0.11, 0);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 5.2, 18), standMat);
      tower.position.set(0, 2.7, -0.42);
      const axleArm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.8), standMat);
      axleArm.position.set(0, 5.0, -0.15);
      group.add(basePad, tower, axleArm);

      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.28, 32),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.18, clearcoat: 0.75 })
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0, 5.0, 0);
      const hubCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.38, 20),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.16 })
      );
      hubCap.rotation.x = Math.PI / 2;
      hubCap.position.set(0, 5.0, 0);
      group.add(wheel, hubCap);

      const boxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
      const m1Box = new THREE.Mesh(boxGeo, new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.25, clearcoat: 0.85 }));
      const m2Box = new THREE.Mesh(boxGeo, new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.25, clearcoat: 0.85 }));
      m1Box.add(createTroikaLabel({ text: 'm₁', position: [0, 0.85, 0], fontSize: 0.34, color: 0x7dd3fc }));
      m2Box.add(createTroikaLabel({ text: 'm₂', position: [0, 0.85, 0], fontSize: 0.34, color: 0xfde68a }));
      group.add(m1Box, m2Box);

      // Cylindrical cables + top pulley arc
      const cableMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.5, roughness: 0.4 });
      const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 10);
      const cableL = new THREE.Mesh(cableGeo, cableMat);
      const cableR = new THREE.Mesh(cableGeo, cableMat);
      const topArc = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.032, 10, 28, Math.PI), cableMat);
      topArc.position.set(0, 5.0, 0);
      group.add(cableL, cableR, topArc, createTroikaLabel({ text: 'a = (m₂ - m₁)g / (m₁ + m₂)', position: [0, 6.25, 0], fontSize: 0.3, color: 0xe2e8f0 }));

      const pTopL = new THREE.Vector3(-0.95, 5.0, 0);
      const pTopR = new THREE.Vector3(0.95, 5.0, 0);
      const pBotL = new THREE.Vector3();
      const pBotR = new THREE.Vector3();
      const tmpDir = new THREE.Vector3();

      return () => {
        const { p1: m1, p2: m2 } = getParams();
        const a = ((m2 - m1) * 9.8) / Math.max(0.5, m1 + m2);
        const shift = Math.sin(getElapsed() * (0.9 + Math.abs(a) * 0.22)) * (a === 0 ? 0 : 1.35 * Math.sign(a));
        const y1 = 2.6 + shift;
        const y2 = 2.6 - shift;
        m1Box.position.set(-0.95, y1, 0);
        m2Box.position.set(0.95, y2, 0);
        m1Box.scale.setScalar(0.75 + m1 * 0.05);
        m2Box.scale.setScalar(0.75 + m2 * 0.05);
        wheel.rotation.z = -shift * 1.1;
        pBotL.set(-0.95, y1, 0);
        pBotR.set(0.95, y2, 0);
        orientSeg(cableL, pTopL, pBotL, tmpDir, upAxis);
        orientSeg(cableR, pTopR, pBotR, tmpDir, upAxis);
      };
    }

    // 2. NEWTON'S CRADLE 3D
    case 'newtons_cradle_3d': {
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.28, clearcoat: 0.5 });
      const basePad = new THREE.Mesh(
        new THREE.BoxGeometry(6.0, 0.26, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.35, clearcoat: 0.6 })
      );
      basePad.position.set(0, 0.13, 0);
      group.add(basePad);

      [-2.65, 2.65].forEach((px) => {
        [-0.88, 0.88].forEach((pz) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.9, 14), standMat);
          post.position.set(px, 2.6, pz);
          group.add(post);
        });
      });

      const beam = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.2, 0.4), standMat);
      beam.position.set(0, 5.0, 0);
      [-0.88, 0.88].forEach((pz) => {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 5.4, 14), standMat);
        rail.rotation.z = Math.PI / 2;
        rail.position.set(0, 5.0, pz);
        group.add(rail);
      });
      group.add(beam);

      const pivots: THREE.Group[] = [];
      const bGeo = new THREE.SphereGeometry(0.42, 32, 28);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        metalness: 0.96,
        roughness: 0.06,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
      });
      const sGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.2, 10);
      const sMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.78, roughness: 0.25 });

      for (let i = 0; i < 5; i++) {
        const p = new THREE.Group();
        p.position.set((i - 2) * 0.86, 5.0, 0);
        const rod = new THREE.Mesh(sGeo, sMat);
        rod.position.set(0, -1.6, 0);
        const ball = new THREE.Mesh(bGeo, bMat);
        ball.position.set(0, -3.2, 0);
        p.add(rod, ball);
        group.add(p);
        pivots.push(p);
      }

      group.add(createTroikaLabel({ text: 'Bảo toàn p & W_đ', position: [0, 5.55, 0], fontSize: 0.32, color: 0xe2e8f0 }));

      let lastSwingSign = 1;
      return () => {
        const { p1: deg, p2: spd } = getParams();
        const maxRad = (deg * Math.PI) / 180;
        const sw = Math.sin(getElapsed() * 3.0 * spd);
        const curSign = sw >= 0 ? 1 : -1;
        if (curSign !== lastSwingSign && pool) {
          lastSwingSign = curSign;
          const contactX = curSign > 0 ? 1.29 : -1.29;
          for (let k = 0; k < 6; k++) {
            pool.spawn(contactX, 1.8, 0, (Math.random() - 0.5) * 0.8, 0.8 + Math.random() * 1.1, (Math.random() - 0.5) * 0.8, 0.45, 0.75, 0x38bdf8);
          }
        }
        pivots[0].rotation.z = sw < 0 ? sw * maxRad : 0;
        pivots[4].rotation.z = sw > 0 ? sw * maxRad : 0;
      };
    }

    // 3. FOUCAULT PENDULUM 3D
    case 'foucault_pendulum_3d': {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(3.8, 3.9, 0.16, 48),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.35, clearcoat: 0.5 })
      );
      disc.position.set(0, 0.08, 0);
      const brassRim = new THREE.Mesh(
        new THREE.TorusGeometry(3.82, 0.065, 12, 64),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.16, clearcoat: 0.8 })
      );
      brassRim.rotation.x = Math.PI / 2;
      brassRim.position.set(0, 0.16, 0);
      const apexRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.055, 12, 28),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.82, roughness: 0.2 })
      );
      apexRing.rotation.x = Math.PI / 2;
      apexRing.position.set(0, 5.6, 0);
      group.add(disc, brassRim, apexRing);

      const pivot = new THREE.Group();
      pivot.position.set(0, 5.6, 0);
      group.add(pivot);

      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 4.6, 10),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7 })
      );
      cord.position.set(0, -2.3, 0);
      const bob = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.14, clearcoat: 0.92 })
      );
      bob.position.set(0, -4.6, 0);
      pivot.add(cord, bob);
      group.add(createTroikaLabel({ text: 'Mặt phẳng dao động xoay (Ω_z = Ω sin φ)', position: [0, 6.15, 0], fontSize: 0.3, color: 0xfbbf24 }));

      return () => {
        const { p1: latDeg, p2: amp } = getParams();
        const t = getElapsed();
        pivot.rotation.y = t * 0.28 * Math.sin((latDeg * Math.PI) / 180);
        pivot.rotation.z = Math.sin(t * 2.2) * 0.45 * amp;
      };
    }

    // 4. TRANSVERSE & LONGITUDINAL WAVES 3D
    case 'transverse_longitudinal_3d': {
      const refRodMat = new THREE.MeshStandardMaterial({ color: 0x475569, transparent: true, opacity: 0.55 });
      [3.6, 1.3].forEach((ry) => {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 9.8, 10), refRodMat);
        rod.rotation.z = Math.PI / 2;
        rod.position.set(0, ry, 0);
        group.add(rod);
      });
      group.add(
        createTroikaLabel({ text: 'Sóng ngang (u ⊥ v)', position: [0, 4.7, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'Sóng dọc (u ∥ v)', position: [0, 2.25, 0], fontSize: 0.3, color: 0x34d399 })
      );

      const transSpheres: THREE.Mesh[] = [];
      const longSpheres: THREE.Mesh[] = [];
      const geo = new THREE.SphereGeometry(0.19, 18, 16);
      const mT = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.16, metalness: 0.35, clearcoat: 0.85 });
      const mL = new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.16, metalness: 0.35, clearcoat: 0.85 });
      for (let i = 0; i < 24; i++) {
        const a = new THREE.Mesh(geo, mT);
        const b = new THREE.Mesh(geo, mL);
        group.add(a, b);
        transSpheres.push(a);
        longSpheres.push(b);
      }

      return () => {
        const { p1: freq, p2: amp } = getParams();
        const t = getElapsed();
        for (let i = 0; i < 24; i++) {
          const xBase = -4.6 + i * 0.4;
          const phase = t * freq * 2.6 - i * 0.45;
          transSpheres[i].position.set(xBase, 3.6 + Math.sin(phase) * amp * 0.9, 0);
          longSpheres[i].position.set(xBase + Math.sin(phase) * amp * 0.28, 1.3, 0);
        }
      };
    }

    // 5. LISSAJOUS 3D
    case 'lissajous_3d': {
      const cage = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(5.6, 4.0, 5.2)),
        new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 })
      );
      cage.position.set(0, 2.6, 0);
      group.add(cage);

      const tracer = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 24, 20),
        new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.78, clearcoat: 0.9 })
      );
      const tracerHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 18, 16),
        new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.24, depthWrite: false })
      );
      tracer.add(tracerHalo);
      group.add(tracer);

      const ptsCount = 180;
      const pts: THREE.Vector3[] = Array.from({ length: ptsCount }, () => new THREE.Vector3());
      const trailGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const trailLine = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
      group.add(trailLine, createTroikaLabel({ text: 'Đường cong Lissajous (ωx : ωy : ωz)', position: [0, 5.05, 0], fontSize: 0.3, color: 0xf43f5e }));
      const attr = trailGeo.attributes.position as THREE.BufferAttribute;
      trail?.clear();

      return () => {
        const { p1: wy, p2: wz } = getParams();
        const t = getElapsed();
        const px = 2.6 * Math.sin(t * 2.0);
        const py = 2.6 + 1.8 * Math.sin(t * 2.0 * wy + Math.PI / 4);
        const pz = 2.4 * Math.sin(t * 2.0 * wz);
        tracer.position.set(px, py, pz);
        trail?.pushAndRender(px, py, pz, camera, 0.018, 28);
        for (let i = 0; i < ptsCount; i++) {
          const tt = t - (i / ptsCount) * 4.5;
          attr.setXYZ(
            i,
            2.6 * Math.sin(tt * 2.0),
            2.6 + 1.8 * Math.sin(tt * 2.0 * wy + Math.PI / 4),
            2.4 * Math.sin(tt * 2.0 * wz)
          );
        }
        attr.needsUpdate = true;
      };
    }

    // 6. ACOUSTIC INTERFERENCE 3D
    case 'acoustic_interference_3d': {
      const spkGeo = new THREE.ConeGeometry(0.45, 0.7, 20);
      const spkMat = new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.78, roughness: 0.22, clearcoat: 0.5 });
      const cabMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.3 });
      const makeSpeaker = (tag: string) => {
        const grp = new THREE.Group();
        const cone = new THREE.Mesh(spkGeo, spkMat);
        cone.rotation.z = -Math.PI / 2;
        const cab = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.95, 0.95), cabMat);
        cab.position.x = -0.35;
        grp.add(cone, cab, createTroikaLabel({ text: tag, position: [-0.35, 0.9, 0], fontSize: 0.32, color: 0xfbbf24 }));
        group.add(grp);
        return grp;
      };
      const spk1 = makeSpeaker('Loa S₁');
      const spk2 = makeSpeaker('Loa S₂');

      const cols = 16;
      const rows = 10;
      const dots: THREE.Mesh[] = [];
      const dotGeo = new THREE.SphereGeometry(0.11, 12, 10);
      const dotMat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.5, clearcoat: 0.7 });
      for (let i = 0; i < cols * rows; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        group.add(dot);
        dots.push(dot);
      }

      return () => {
        const { p1: freq, p2: sep } = getParams();
        const t = getElapsed();
        spk1.position.set(-4.2, 2.0, -sep * 0.5);
        spk2.position.set(-4.2, 2.0, sep * 0.5);
        let idx = 0;
        for (let ix = 0; ix < cols; ix++) {
          for (let iz = 0; iz < rows; iz++) {
            const px = -3.0 + ix * 0.52;
            const pz = -3.2 + iz * 0.7;
            const d1 = Math.hypot(px + 4.2, pz + sep * 0.5);
            const d2 = Math.hypot(px + 4.2, pz - sep * 0.5);
            const u = Math.sin(t * freq * 3.0 - d1 * freq * 1.4) + Math.sin(t * freq * 3.0 - d2 * freq * 1.4);
            dots[idx++].position.set(px, 2.0 + u * 0.35, pz);
          }
        }
      };
    }

    // 7. CYCLOTRON 3D
    case 'cyclotron_3d': {
      const baseRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.45, 0.14, 14, 56),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.82, roughness: 0.22 })
      );
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.set(0, 1.75, 0);
      group.add(baseRing);

      const deeGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.45, 36, 1, false, 0, Math.PI);
      const deeMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.34,
        metalness: 0.45,
        roughness: 0.12,
        clearcoat: 0.9
      });
      const d1 = new THREE.Mesh(deeGeo, deeMat);
      d1.position.set(-0.22, 2.0, 0);
      d1.rotation.y = Math.PI / 2;
      const d2 = new THREE.Mesh(deeGeo, deeMat);
      d2.position.set(0.22, 2.0, 0);
      d2.rotation.y = -Math.PI / 2;
      group.add(d1, d2);

      const proton = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 20, 18),
        new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.9, clearcoat: 0.8 })
      );
      const pHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 14),
        new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.28, depthWrite: false })
      );
      proton.add(pHalo);
      group.add(
        proton,
        createTroikaLabel({ text: 'Cực D₁', position: [-1.9, 2.75, 0], fontSize: 0.32, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Cực D₂', position: [1.9, 2.75, 0], fontSize: 0.32, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Tần số xyclôtron f = qB/(2πm)', position: [0, 4.15, 0], fontSize: 0.3, color: 0xf43f5e })
      );

      trail?.clear();
      let prevAng = 0;
      return () => {
        const { p1: bVal, p2: uVal } = getParams();
        const t = getElapsed();
        const ang = (t * (1.8 + bVal * 0.9)) % 18;
        if (ang < prevAng) {
          trail?.clear();
        }
        prevAng = ang;
        const r = 0.25 + (ang / 18) * (2.6 + uVal * 0.005);
        const px = Math.cos(ang) * r;
        const pz = Math.sin(ang) * r;
        proton.position.set(px, 2.0, pz);
        trail?.pushAndRender(px, 2.0, pz, camera, 0.015, 28);
      };
    }

    // 8. CATHODE RAY TUBE 3D
    case 'cathode_ray_tube_3d': {
      const gunBarrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.44, 1.8, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.2, clearcoat: 0.6 })
      );
      gunBarrel.rotation.z = Math.PI / 2;
      gunBarrel.position.set(-3.4, 2.2, 0);
      const glassEnvelope = new THREE.Mesh(
        new THREE.CylinderGeometry(1.85, 0.55, 6.2, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.16,
          roughness: 0.06,
          clearcoat: 1.0,
          side: THREE.DoubleSide,
          depthWrite: false,
          clippingPlanes: clipPlanes,
        })
      );
      glassEnvelope.rotation.z = Math.PI / 2;
      glassEnvelope.position.set(0.6, 2.2, 0);
      group.add(gunBarrel, glassEnvelope);

      const plateGeo = new THREE.BoxGeometry(2.0, 0.12, 1.4);
      const plateMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.82, roughness: 0.18, clearcoat: 0.7 });
      const topP = new THREE.Mesh(plateGeo, plateMat);
      const botP = new THREE.Mesh(plateGeo, plateMat);
      topP.position.set(-1.0, 3.1, 0);
      botP.position.set(-1.0, 1.3, 0);
      group.add(topP, botP);

      const screenBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 3.7, 3.7),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.25 })
      );
      screenBezel.position.set(3.92, 2.2, 0);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshStandardMaterial({ color: 0x064e3b, emissive: 0x065f46, emissiveIntensity: 0.45, side: THREE.DoubleSide })
      );
      screen.rotation.y = Math.PI / 2;
      screen.position.set(3.8, 2.2, 0);
      group.add(screenBezel, screen);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 18, 14),
        new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 1.0 })
      );
      const beamSeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1, 8),
        new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.7 })
      );
      group.add(
        dot,
        beamSeg,
        createTroikaLabel({ text: 'Súng e⁻', position: [-3.4, 3.15, 0], fontSize: 0.3, color: 0xe2e8f0 }),
        createTroikaLabel({ text: 'Bản lái tia Y', position: [-1.0, 3.65, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Màn huỳnh quang', position: [3.8, 4.45, 0], fontSize: 0.3, color: 0x34d399 })
      );
      const gunOut = new THREE.Vector3(-2.5, 2.2, 0);
      const hitPt = new THREE.Vector3();
      const tmpDir = new THREE.Vector3();

      return () => {
        const { p1: uy, p2: sweepHz } = getParams();
        const t = getElapsed();
        const pz = Math.sin(t * sweepHz * 2.5) * 1.3;
        const py = 2.2 + (uy / 60) * 1.2;
        dot.position.set(3.75, py, pz);
        hitPt.set(3.75, py, pz);
        orientSeg(beamSeg, gunOut, hitPt, tmpDir, upAxis);
      };
    }

    // 9. HELMHOLTZ COILS 3D
    case 'helmholtz_coils_3d': {
      const baseRail = new THREE.Mesh(
        new THREE.BoxGeometry(6.4, 0.22, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.35 })
      );
      baseRail.position.set(0, 0.11, 0);
      group.add(baseRail, createTroikaLabel({ text: 'B⃗ đồng nhất khi d = R', position: [0, 4.85, 0], fontSize: 0.32, color: 0x38bdf8 }));

      const cGeo = new THREE.TorusGeometry(2.0, 0.14, 16, 48);
      const cMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.18, clearcoat: 0.8 });
      const c1 = new THREE.Mesh(cGeo, cMat);
      const c2 = new THREE.Mesh(cGeo, cMat);
      c1.rotation.y = Math.PI / 2;
      c2.rotation.y = Math.PI / 2;
      group.add(c1, c2);

      const arrows: THREE.Mesh[] = [];
      const aGeo = new THREE.ConeGeometry(0.12, 0.45, 12);
      aGeo.rotateZ(-Math.PI / 2);
      const aMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.55 });
      for (let i = 0; i < 9; i++) {
        const a = new THREE.Mesh(aGeo, aMat);
        group.add(a);
        arrows.push(a);
      }

      return () => {
        const { p1: curI, p2: dRatio } = getParams();
        const halfD = dRatio * 1.0;
        c1.position.set(-halfD, 2.4, 0);
        c2.position.set(halfD, 2.4, 0);
        const t = getElapsed();
        arrows.forEach((ar, i) => {
          const lane = (i % 3) - 1;
          const x = (((t * (1.2 + curI * 0.2) + Math.floor(i / 3) * 1.8) % 5.4) - 2.7);
          ar.position.set(x, 2.4 + lane * 0.65, 0);
        });
      };
    }

    // 10. ELECTROSCOPE 3D
    case 'electroscope_3d': {
      const baseFoot = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.9, 0.28, 36),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.3, clearcoat: 0.5 })
      );
      baseFoot.position.set(0, 0.14, 0);
      const glassJar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.55, 3.6, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0xbae6fd,
          transparent: true,
          opacity: 0.22,
          roughness: 0.05,
          clearcoat: 1.0,
          ior: 1.5,
          side: THREE.DoubleSide,
          depthWrite: false,
          clippingPlanes: clipPlanes,
        })
      );
      glassJar.position.set(0, 2.05, 0);
      const stopper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.4, 0.35, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.2 })
      );
      stopper.position.set(0, 3.85, 0);
      group.add(baseFoot, glassJar, stopper);

      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.94, roughness: 0.1, clearcoat: 0.9 })
      );
      dome.position.set(0, 4.6, 0);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.4, 14),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.16 })
      );
      stem.position.set(0, 3.2, 0);
      group.add(
        dome,
        stem,
        createTroikaLabel({ text: 'Quả cầu kim loại (+q)', position: [0, 5.45, 0], fontSize: 0.3, color: 0xe2e8f0 }),
        createTroikaLabel({ text: 'Hai lá vàng đẩy nhau', position: [0, 0.75, 1.7], fontSize: 0.28, color: 0xfbbf24 })
      );

      const leafGeo = new THREE.BoxGeometry(0.04, 1.4, 0.35);
      leafGeo.translate(0, -0.7, 0);
      const leafMat = new THREE.MeshPhysicalMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.14, clearcoat: 0.8 });
      const l1 = new THREE.Mesh(leafGeo, leafMat);
      const l2 = new THREE.Mesh(leafGeo, leafMat);
      l1.position.set(0, 2.1, 0);
      l2.position.set(0, 2.1, 0);
      group.add(l1, l2);

      return () => {
        const { p1: qVal, p2: prox } = getParams();
        const ang = Math.min(1.2, qVal * prox * 0.11 + Math.sin(getElapsed() * 3) * 0.02);
        l1.rotation.z = -ang;
        l2.rotation.z = ang;
      };
    }

    // 11. FIBER OPTIC 3D
    case 'fiber_optic_3d': {
      const collarMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
      [-3.85, 3.85].forEach((cx) => {
        const collar = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.09, 12, 36), collarMat);
        collar.rotation.y = Math.PI / 2;
        collar.position.set(cx, 2.2, 0);
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.1, 0.9), collarMat);
        stand.position.set(cx, 0.55, 0);
        group.add(collar, stand);
      });

      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.15, 8.0, 40, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.26,
          roughness: 0.05,
          clearcoat: 1.0,
          ior: 1.52,
          depthWrite: false,
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
        })
      );
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 2.2, 0);
      group.add(tube);

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 18, 14),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.95 })
      );
      const pulseHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 14, 12),
        new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.3, depthWrite: false })
      );
      pulse.add(pulseHalo);
      group.add(pulse, createTroikaLabel({ text: 'Phản xạ toàn phần (n₁ > n₂)', position: [0, 3.85, 0], fontSize: 0.32, color: 0x4ade80 }));

      trail?.clear();
      let prevProg = -4;
      return () => {
        const { p1: deg } = getParams();
        const t = getElapsed();
        const prog = ((t * 2.4) % 8.0) - 4.0;
        if (prog < prevProg) trail?.clear();
        prevProg = prog;
        const freq = Math.tan((deg * Math.PI) / 180) * 1.4;
        const yBounce = Math.abs(((prog + 4) * freq) % 2.0 - 1.0) * 1.7 - 0.85;
        const py = 2.2 + yBounce;
        pulse.position.set(prog, py, 0);
        trail?.pushAndRender(prog, py, 0, camera, 0.02, 28);
      };
    }

    // 12. COMPTON 3D
    case 'compton_3d': {
      const targetRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.025, 10, 32),
        new THREE.MeshBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.55 })
      );
      targetRing.position.set(0, 2.2, 0);
      group.add(targetRing);

      const eTarget = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 22, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.72, clearcoat: 0.9 })
      );
      const photon = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 18, 14),
        new THREE.MeshPhysicalMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.9, clearcoat: 0.85 })
      );
      const phHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 14, 12),
        new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.25, depthWrite: false })
      );
      photon.add(phHalo);
      group.add(
        eTarget,
        photon,
        createTroikaLabel({ text: 'Photon γ (Δλ = h/(mc)·(1 - cos θ))', position: [0, 4.15, 0], fontSize: 0.3, color: 0xc084fc }),
        createTroikaLabel({ text: 'e⁻ giật lùi', position: [1.6, 1.15, 0], fontSize: 0.28, color: 0x38bdf8 })
      );

      let wasPreHit = true;
      return () => {
        const { p1: theta, p2: spd } = getParams();
        const cyc = (getElapsed() * spd) % 3.0;
        const rad = (theta * Math.PI) / 180;
        if (cyc < 1.2) {
          wasPreHit = true;
          photon.position.set(-4.0 + (cyc / 1.2) * 4.0, 2.2, 0);
          eTarget.position.set(0, 2.2, 0);
        } else {
          if (wasPreHit && pool) {
            wasPreHit = false;
            for (let k = 0; k < 14; k++) {
              const a = (k / 14) * Math.PI * 2;
              pool.spawn(0, 2.2, 0, Math.cos(a) * 1.9, Math.sin(a) * 1.9, (Math.random() - 0.5) * 1.2, 0.6, 0.9, k % 2 === 0 ? 0xc084fc : 0x38bdf8);
            }
          }
          const dt = cyc - 1.2;
          photon.position.set(Math.cos(rad) * dt * 2.4, 2.2 + Math.sin(rad) * dt * 2.4, 0);
          eTarget.position.set(Math.cos(rad * 0.4) * dt * 1.8, 2.2 - Math.sin(rad * 0.4) * dt * 1.8, 0);
        }
      };
    }

    // 13. DOUBLE LENS MICROSCOPE 3D
    case 'double_lens_microscope_3d': {
      const benchMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.68, roughness: 0.3 });
      const bench = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.18, 1.8), benchMat);
      bench.position.set(0.2, 0.09, 0);
      group.add(bench);

      const brassMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.18, clearcoat: 0.7 });
      const l1 = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 32, 24),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.45,
          roughness: 0.05,
          clearcoat: 1.0,
          ior: 1.54
        })
      );
      l1.scale.set(0.2, 1, 1);
      l1.position.set(-1.4, 2.2, 0);
      const rim1 = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 12, 36), brassMat);
      rim1.rotation.y = Math.PI / 2;
      rim1.position.set(-1.4, 2.2, 0);
      const st1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.95, 14), benchMat);
      st1.position.set(-1.4, 0.62, 0);

      const l2 = l1.clone();
      l2.scale.set(0.18, 1.35, 1.35);
      l2.position.set(1.8, 2.2, 0);
      const rim2 = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.065, 12, 36), brassMat);
      rim2.rotation.y = Math.PI / 2;
      rim2.position.set(1.8, 2.2, 0);
      const st2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.6, 14), benchMat);
      st2.position.set(1.8, 0.45, 0);
      group.add(
        l1,
        l2,
        rim1,
        rim2,
        st1,
        st2,
        createTroikaLabel({ text: 'Vật kính L₁', position: [-1.4, 3.65, 0], fontSize: 0.3, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Thị kính L₂', position: [1.8, 4.0, 0], fontSize: 0.3, color: 0xfbbf24 })
      );

      const objPin = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.9, 14),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.25, clearcoat: 0.8 })
      );
      group.add(objPin);

      const rayMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6 });
      const segGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 8);
      const segs = [0, 1, 2, 3].map(() => {
        const s = new THREE.Mesh(segGeo, rayMat);
        group.add(s);
        return s;
      });
      const rPts = [
        new THREE.Vector3(-3.2, 2.6, 0),
        new THREE.Vector3(-1.4, 2.6, 0),
        new THREE.Vector3(0.4, 1.5, 0),
        new THREE.Vector3(1.8, 0.9, 0),
        new THREE.Vector3(4.0, 0.4, 0)
      ];
      const tmpDir = new THREE.Vector3();

      return () => {
        const { p1: f1, p2: d1 } = getParams();
        const ox = -1.4 - d1;
        objPin.position.set(ox, 2.2, 0);
        const midY = 2.2 - (f1 / Math.max(0.2, d1 - f1)) * 0.45;
        rPts[0].x = ox;
        rPts[2].y = Math.max(0.6, Math.min(3.5, midY));
        for (let i = 0; i < 4; i++) {
          orientSeg(segs[i], rPts[i], rPts[i + 1], tmpDir, upAxis);
        }
      };
    }

    // 14. DIFFUSION OF GASES 3D
    case 'diffusion_gases_3d': {
      const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(7.2, 3.6, 3.6)),
        new THREE.LineBasicMaterial({ color: 0x94a3b8 })
      );
      box.position.set(0, 2.2, 0);
      const glassTank = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 3.6, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.08, clearcoat: 0.9, depthWrite: false, clippingPlanes: clipPlanes })
      );
      glassTank.position.set(0, 2.2, 0);
      group.add(
        box,
        glassTank,
        createTroikaLabel({ text: 'Khí A', position: [-2.0, 4.35, 0], fontSize: 0.32, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'Khí B', position: [2.0, 4.35, 0], fontSize: 0.32, color: 0xfb7185 })
      );

      const divider = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.42, clearcoat: 0.6, side: THREE.DoubleSide })
      );
      divider.rotation.y = Math.PI / 2;
      divider.position.set(0, 2.2, 0);
      group.add(divider);

      const mols: { mesh: THREE.Mesh; vel: THREE.Vector3; side: number }[] = [];
      const mGeo = new THREE.SphereGeometry(0.14, 14, 12);
      const matA = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.16, clearcoat: 0.85 });
      const matB = new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, roughness: 0.16, clearcoat: 0.85 });
      for (let i = 0; i < 36; i++) {
        const side = i < 18 ? -1 : 1;
        const mesh = new THREE.Mesh(mGeo, side < 0 ? matA : matB);
        mesh.position.set(side * (0.4 + ((i * 0.7) % 3.0)), 0.7 + ((i * 1.1) % 2.9), -1.4 + ((i * 0.9) % 2.8));
        group.add(mesh);
        mols.push({
          mesh,
          side,
          vel: new THREE.Vector3(Math.cos(i * 1.7) * 2.2, Math.sin(i * 2.3) * 1.9, Math.cos(i * 3.1) * 1.9)
        });
      }

      return (dt) => {
        const { p1: tempK, p2: openWall } = getParams();
        const isOpen = openWall >= 0.5;
        divider.visible = !isOpen;
        const spd = Math.sqrt(tempK / 300) * dt;
        for (const mol of mols) {
          mol.mesh.position.addScaledVector(mol.vel, spd);
          const p = mol.mesh.position;
          if (!isOpen) {
            if (mol.side < 0 && p.x > -0.15) { p.x = -0.15; mol.vel.x *= -1; }
            if (mol.side > 0 && p.x < 0.15) { p.x = 0.15; mol.vel.x *= -1; }
          }
          if (Math.abs(p.x) > 3.4) { p.x = Math.sign(p.x) * 3.4; mol.vel.x *= -1; }
          if (p.y < 0.5 || p.y > 3.9) { p.y = Math.max(0.5, Math.min(3.9, p.y)); mol.vel.y *= -1; }
          if (Math.abs(p.z) > 1.65) { p.z = Math.sign(p.z) * 1.65; mol.vel.z *= -1; }
        }
      };
    }

    // 15. BROWNIAN MOTION 3D
    case 'brownian_motion_3d': {
      const cellOutline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(6.2, 4.2, 5.8)),
        new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.45 })
      );
      cellOutline.position.set(0, 2.2, 0);
      group.add(cellOutline);

      const pollen = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.15, clearcoat: 0.85 })
      );
      pollen.position.set(0, 2.2, 0);
      pollen.add(createTroikaLabel({ text: 'Hạt phấn Brown', position: [0, 0.92, 0], fontSize: 0.3, color: 0xfde68a }));
      group.add(pollen);

      const smalls: THREE.Mesh[] = [];
      const sGeo = new THREE.SphereGeometry(0.11, 10, 10);
      const sMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.18, clearcoat: 0.7 });
      for (let i = 0; i < 28; i++) {
        const sm = new THREE.Mesh(sGeo, sMat);
        group.add(sm);
        smalls.push(sm);
      }

      trail?.clear();
      return () => {
        const { p1: tempK, p2: dens } = getParams();
        const t = getElapsed() * Math.sqrt(tempK / 300);
        const px = Math.sin(t * 1.9) * 1.1 + Math.cos(t * 4.3) * 0.45;
        const py = 2.2 + Math.sin(t * 2.7) * 0.8 + Math.cos(t * 5.1) * 0.3;
        const pz = Math.cos(t * 2.1) * 1.0 + Math.sin(t * 3.7) * 0.4;
        pollen.position.set(px, py, pz);
        trail?.pushAndRender(px, py, pz, camera, 0.015, 28);
        smalls.forEach((sm, i) => {
          const vis = i < Math.round(dens * 18);
          sm.visible = vis;
          if (!vis) return;
          sm.position.set(
            Math.sin(t * 4.2 + i * 1.7) * 2.8,
            2.2 + Math.cos(t * 3.8 + i * 2.3) * 1.8,
            Math.sin(t * 5.1 + i * 2.9) * 2.6
          );
        });
      };
    }

    // 16. TOKAMAK FUSION 3D
    case 'tokamak_fusion_3d': {
      // Central solenoid magnet column
      const solenoidCore = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.15, 3.2, 28),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.82, roughness: 0.22, clearcoat: 0.5 })
      );
      solenoidCore.position.set(0, 2.2, 0);
      group.add(solenoidCore);

      // 12 Toroidal Field (TF) copper/steel D-coil rings around torus
      const tfCoilGeo = new THREE.TorusGeometry(1.18, 0.085, 12, 32);
      const tfCoilMat = new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.86, roughness: 0.18, clearcoat: 0.75 });
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const coil = new THREE.Mesh(tfCoilGeo, tfCoilMat);
        coil.position.set(Math.cos(ang) * 2.8, 2.2, Math.sin(ang) * 2.8);
        coil.rotation.y = -ang;
        group.add(coil);
      }

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.95, 28, 60),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.22,
          roughness: 0.06,
          clearcoat: 1.0,
          depthWrite: false,
          clippingPlanes: clipPlanes,
        })
      );
      torus.rotation.x = Math.PI / 2;
      torus.position.set(0, 2.2, 0);
      group.add(torus);

      const plasma = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.42, 24, 60),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.92, transparent: true, opacity: 0.85 })
      );
      plasma.rotation.x = Math.PI / 2;
      plasma.position.set(0, 2.2, 0);
      group.add(
        plasma,
        createTroikaLabel({ text: 'Plasma D-T (Từ giam Tokamak)', position: [0, 4.35, 0], fontSize: 0.32, color: 0xfb7185 }),
        createTroikaLabel({ text: 'Cuộn TF', position: [3.7, 3.3, 0], fontSize: 0.28, color: 0xfbbf24 })
      );

      const ions: THREE.Mesh[] = [];
      const iGeo = new THREE.SphereGeometry(0.13, 12, 10);
      const iMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      for (let i = 0; i < 18; i++) {
        const ion = new THREE.Mesh(iGeo, iMat);
        group.add(ion);
        ions.push(ion);
      }

      let fusionCooldown = 0;
      return (effDt) => {
        const { p1: bField, p2: tempM } = getParams();
        const t = getElapsed();
        plasma.scale.setScalar(Math.max(0.75, 1.05 - bField * 0.02));
        ions.forEach((ion, idx) => {
          const ang = t * (1.8 + tempM * 0.015) + idx * 0.35;
          const swirl = ang * 4.0;
          const rMinor = 0.28;
          const R = 2.8 + Math.cos(swirl) * rMinor;
          ion.position.set(Math.cos(ang) * R, 2.2 + Math.sin(swirl) * rMinor, Math.sin(ang) * R);
        });
        fusionCooldown -= effDt;
        if (pool && tempM > 80 && fusionCooldown <= 0) {
          fusionCooldown = 0.22;
          const a = Math.random() * Math.PI * 2;
          pool.spawn(
            Math.cos(a) * 2.8,
            2.2,
            Math.sin(a) * 2.8,
            (Math.random() - 0.5) * 1.4,
            0.8 + Math.random() * 1.1,
            (Math.random() - 0.5) * 1.4,
            0.55,
            0.85,
            0xfef08a
          );
        }
      };
    }

    default:
      return null;
  }
}
