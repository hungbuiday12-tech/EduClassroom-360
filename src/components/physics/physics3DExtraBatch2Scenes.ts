import * as THREE from 'three';
import type { Batch2Physics3DModeId } from '../../data/physicsExtraSimsBatch2Data';
import type { Extra3DStateGetter } from './physics3DExtraScenes';

export function buildBatch2Extra3DScene(
  mode: string,
  group: THREE.Group,
  getParams: Extra3DStateGetter,
  getElapsed: () => number
): ((effDt: number) => void) | null {
  const m = mode as Batch2Physics3DModeId;

  switch (m) {
    // 1. ATWOOD PULLEY 3D
    case 'atwood_pulley_3d': {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 0.28, 28),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.25 })
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(0, 5.0, 0);
      group.add(wheel);

      const boxGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
      const m1Box = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }));
      const m2Box = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
      group.add(m1Box, m2Box);

      const ropeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.95, 2.5, 0),
        new THREE.Vector3(-0.95, 5.0, 0),
        new THREE.Vector3(0.95, 5.0, 0),
        new THREE.Vector3(0.95, 2.5, 0)
      ]);
      const rope = new THREE.Line(ropeGeo, new THREE.LineBasicMaterial({ color: 0xe2e8f0 }));
      group.add(rope);
      const rPos = ropeGeo.attributes.position as THREE.BufferAttribute;

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
        rPos.setY(0, y1);
        rPos.setY(3, y2);
        rPos.needsUpdate = true;
      };
    }

    // 2. NEWTON'S CRADLE 3D
    case 'newtons_cradle_3d': {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 0.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 })
      );
      beam.position.set(0, 5.0, 0);
      group.add(beam);

      const pivots: THREE.Group[] = [];
      const bGeo = new THREE.SphereGeometry(0.42, 28, 24);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        metalness: 0.96,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });
      const sGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.2, 8);
      const sMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });

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

      return () => {
        const { p1: deg, p2: spd } = getParams();
        const maxRad = (deg * Math.PI) / 180;
        const sw = Math.sin(getElapsed() * 3.0 * spd);
        pivots[0].rotation.z = sw < 0 ? sw * maxRad : 0;
        pivots[4].rotation.z = sw > 0 ? sw * maxRad : 0;
      };
    }

    // 3. FOUCAULT PENDULUM 3D
    case 'foucault_pendulum_3d': {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(3.8, 3.8, 0.15, 36),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
      );
      disc.position.set(0, 0.08, 0);
      group.add(disc);

      const pivot = new THREE.Group();
      pivot.position.set(0, 5.6, 0);
      group.add(pivot);

      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 4.6, 8),
        new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
      );
      cord.position.set(0, -2.3, 0);
      const bob = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 22, 18),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
      );
      bob.position.set(0, -4.6, 0);
      pivot.add(cord, bob);

      return () => {
        const { p1: latDeg, p2: amp } = getParams();
        const t = getElapsed();
        pivot.rotation.y = t * 0.28 * Math.sin((latDeg * Math.PI) / 180);
        pivot.rotation.z = Math.sin(t * 2.2) * 0.45 * amp;
      };
    }

    // 4. TRANSVERSE & LONGITUDINAL WAVES 3D
    case 'transverse_longitudinal_3d': {
      const transSpheres: THREE.Mesh[] = [];
      const longSpheres: THREE.Mesh[] = [];
      const geo = new THREE.SphereGeometry(0.18, 14, 12);
      const mT = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 });
      const mL = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.25 });
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
      const tracer = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 20, 16),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.7 })
      );
      group.add(tracer);

      const ptsCount = 180;
      const pts: THREE.Vector3[] = Array.from({ length: ptsCount }, () => new THREE.Vector3());
      const trailGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
      group.add(trail);
      const attr = trailGeo.attributes.position as THREE.BufferAttribute;

      return () => {
        const { p1: wy, p2: wz } = getParams();
        const t = getElapsed();
        const px = 2.6 * Math.sin(t * 2.0);
        const py = 2.6 + 1.8 * Math.sin(t * 2.0 * wy + Math.PI / 4);
        const pz = 2.4 * Math.sin(t * 2.0 * wz);
        tracer.position.set(px, py, pz);
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
      const spkGeo = new THREE.ConeGeometry(0.45, 0.7, 16);
      const spkMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
      const spk1 = new THREE.Mesh(spkGeo, spkMat);
      const spk2 = new THREE.Mesh(spkGeo, spkMat);
      spk1.rotation.z = -Math.PI / 2;
      spk2.rotation.z = -Math.PI / 2;
      group.add(spk1, spk2);

      const cols = 16;
      const rows = 10;
      const dots: THREE.Mesh[] = [];
      const dotGeo = new THREE.SphereGeometry(0.11, 10, 8);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.45 });
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
      const deeGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.45, 28, 1, false, 0, Math.PI);
      const deeMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.36,
        metalness: 0.5
      });
      const d1 = new THREE.Mesh(deeGeo, deeMat);
      d1.position.set(-0.22, 2.0, 0);
      d1.rotation.y = Math.PI / 2;
      const d2 = new THREE.Mesh(deeGeo, deeMat);
      d2.position.set(0.22, 2.0, 0);
      d2.rotation.y = -Math.PI / 2;
      group.add(d1, d2);

      const proton = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.85 })
      );
      group.add(proton);

      return () => {
        const { p1: bVal, p2: uVal } = getParams();
        const t = getElapsed();
        const ang = (t * (1.8 + bVal * 0.9)) % 18;
        const r = 0.25 + (ang / 18) * (2.6 + uVal * 0.005);
        proton.position.set(Math.cos(ang) * r, 2.0, Math.sin(ang) * r);
      };
    }

    // 8. CATHODE RAY TUBE 3D
    case 'cathode_ray_tube_3d': {
      const plateGeo = new THREE.BoxGeometry(2.0, 0.12, 1.4);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 });
      const topP = new THREE.Mesh(plateGeo, plateMat);
      const botP = new THREE.Mesh(plateGeo, plateMat);
      topP.position.set(-1.0, 3.1, 0);
      botP.position.set(-1.0, 1.3, 0);
      group.add(topP, botP);

      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 3.4),
        new THREE.MeshStandardMaterial({ color: 0x064e3b, emissive: 0x065f46, emissiveIntensity: 0.35, side: THREE.DoubleSide })
      );
      screen.rotation.y = Math.PI / 2;
      screen.position.set(3.8, 2.2, 0);
      group.add(screen);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 1.0 })
      );
      group.add(dot);

      return () => {
        const { p1: uy, p2: sweepHz } = getParams();
        const t = getElapsed();
        const pz = Math.sin(t * sweepHz * 2.5) * 1.3;
        const py = 2.2 + (uy / 60) * 1.2;
        dot.position.set(3.75, py, pz);
      };
    }

    // 9. HELMHOLTZ COILS 3D
    case 'helmholtz_coils_3d': {
      const cGeo = new THREE.TorusGeometry(2.0, 0.14, 14, 42);
      const cMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.25 });
      const c1 = new THREE.Mesh(cGeo, cMat);
      const c2 = new THREE.Mesh(cGeo, cMat);
      c1.rotation.y = Math.PI / 2;
      c2.rotation.y = Math.PI / 2;
      group.add(c1, c2);

      const arrows: THREE.Mesh[] = [];
      const aGeo = new THREE.ConeGeometry(0.12, 0.45, 10);
      aGeo.rotateZ(-Math.PI / 2);
      const aMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
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
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 22, 18),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.15 })
      );
      dome.position.set(0, 4.6, 0);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 })
      );
      stem.position.set(0, 3.2, 0);
      group.add(dome, stem);

      const leafGeo = new THREE.BoxGeometry(0.04, 1.4, 0.35);
      leafGeo.translate(0, -0.7, 0);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
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
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.15, 8.0, 36, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.26,
          roughness: 0.06,
          clearcoat: 1.0,
          ior: 1.52,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 2.2, 0);
      group.add(tube);

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.9 })
      );
      group.add(pulse);

      return () => {
        const { p1: deg } = getParams();
        const t = getElapsed();
        const prog = ((t * 2.4) % 8.0) - 4.0;
        const freq = Math.tan((deg * Math.PI) / 180) * 1.4;
        const yBounce = Math.abs(((prog + 4) * freq) % 2.0 - 1.0) * 1.7 - 0.85;
        pulse.position.set(prog, 2.2 + yBounce, 0);
      };
    }

    // 12. COMPTON 3D
    case 'compton_3d': {
      const eTarget = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 18, 14),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 })
      );
      const photon = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.85 })
      );
      group.add(eTarget, photon);

      return () => {
        const { p1: theta, p2: spd } = getParams();
        const cyc = (getElapsed() * spd) % 3.0;
        const rad = (theta * Math.PI) / 180;
        if (cyc < 1.2) {
          photon.position.set(-4.0 + (cyc / 1.2) * 4.0, 2.2, 0);
          eTarget.position.set(0, 2.2, 0);
        } else {
          const dt = cyc - 1.2;
          photon.position.set(Math.cos(rad) * dt * 2.4, 2.2 + Math.sin(rad) * dt * 2.4, 0);
          eTarget.position.set(Math.cos(rad * 0.4) * dt * 1.8, 2.2 - Math.sin(rad * 0.4) * dt * 1.8, 0);
        }
      };
    }

    // 13. DOUBLE LENS MICROSCOPE 3D
    case 'double_lens_microscope_3d': {
      const l1 = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 32, 24),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.45,
          roughness: 0.06,
          clearcoat: 1.0,
          ior: 1.54
        })
      );
      l1.scale.set(0.2, 1, 1);
      l1.position.set(-1.4, 2.2, 0);
      const l2 = l1.clone();
      l2.scale.set(0.18, 1.35, 1.35);
      l2.position.set(1.8, 2.2, 0);
      group.add(l1, l2);

      const objPin = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.9, 12),
        new THREE.MeshStandardMaterial({ color: 0x10b981 })
      );
      group.add(objPin);

      const raysGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.2, 2.6, 0),
        new THREE.Vector3(-1.4, 2.6, 0),
        new THREE.Vector3(0.4, 1.5, 0),
        new THREE.Vector3(1.8, 0.9, 0),
        new THREE.Vector3(4.0, 0.4, 0)
      ]);
      const rayLine = new THREE.Line(raysGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b }));
      group.add(rayLine);
      const rPos = raysGeo.attributes.position as THREE.BufferAttribute;

      return () => {
        const { p1: f1, p2: d1 } = getParams();
        const ox = -1.4 - d1;
        objPin.position.set(ox, 2.2, 0);
        const midY = 2.2 - (f1 / Math.max(0.2, d1 - f1)) * 0.45;
        rPos.setX(0, ox);
        rPos.setY(2, Math.max(0.6, Math.min(3.5, midY)));
        rPos.needsUpdate = true;
      };
    }

    // 14. DIFFUSION OF GASES 3D
    case 'diffusion_gases_3d': {
      const box = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(7.2, 3.6, 3.6)),
        new THREE.LineBasicMaterial({ color: 0x64748b })
      );
      box.position.set(0, 2.2, 0);
      group.add(box);

      const divider = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 3.6),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
      );
      divider.rotation.y = Math.PI / 2;
      divider.position.set(0, 2.2, 0);
      group.add(divider);

      const mols: { mesh: THREE.Mesh; vel: THREE.Vector3; side: number }[] = [];
      const mGeo = new THREE.SphereGeometry(0.14, 10, 8);
      const matA = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const matB = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
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
      const pollen = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 22, 18),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
      );
      pollen.position.set(0, 2.2, 0);
      group.add(pollen);

      const smalls: THREE.Mesh[] = [];
      const sGeo = new THREE.SphereGeometry(0.11, 8, 8);
      const sMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < 28; i++) {
        const sm = new THREE.Mesh(sGeo, sMat);
        group.add(sm);
        smalls.push(sm);
      }

      return () => {
        const { p1: tempK, p2: dens } = getParams();
        const t = getElapsed() * Math.sqrt(tempK / 300);
        pollen.position.set(
          Math.sin(t * 1.9) * 1.1 + Math.cos(t * 4.3) * 0.45,
          2.2 + Math.sin(t * 2.7) * 0.8 + Math.cos(t * 5.1) * 0.3,
          Math.cos(t * 2.1) * 1.0 + Math.sin(t * 3.7) * 0.4
        );
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
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.95, 24, 56),
        new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.24,
          roughness: 0.08,
          clearcoat: 1.0,
          depthWrite: false
        })
      );
      torus.rotation.x = Math.PI / 2;
      torus.position.set(0, 2.2, 0);
      group.add(torus);

      const plasma = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.42, 20, 56),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.9, transparent: true, opacity: 0.82 })
      );
      plasma.rotation.x = Math.PI / 2;
      plasma.position.set(0, 2.2, 0);
      group.add(plasma);

      const ions: THREE.Mesh[] = [];
      const iGeo = new THREE.SphereGeometry(0.13, 10, 8);
      const iMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      for (let i = 0; i < 18; i++) {
        const ion = new THREE.Mesh(iGeo, iMat);
        group.add(ion);
        ions.push(ion);
      }

      return () => {
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
      };
    }

    default:
      return null;
  }
}
