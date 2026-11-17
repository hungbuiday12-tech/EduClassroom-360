import * as THREE from 'three';
import { ExtraPhysics3DModeId } from '../../data/physicsExtraSimsData';

export interface Extra3DStateGetter {
  (): { p1: number; p2: number };
}

export function buildExtra3DScene(
  mode: string,
  group: THREE.Group,
  getParams: Extra3DStateGetter,
  getElapsed: () => number
): ((effDt: number) => void) | null {
  const m = mode as ExtraPhysics3DModeId;

  // Shared helper materials/lights feel rich against #0a0f1d studio space
  switch (m) {
    // 1. INCLINED PLANE 3D
    case 'inclined_plane_3d': {
      const pivot = new THREE.Group();
      pivot.position.set(0, 1.2, 0);
      group.add(pivot);

      const rampGeo = new THREE.BoxGeometry(8, 0.28, 2.4);
      const rampMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.25 });
      const ramp = new THREE.Mesh(rampGeo, rampMat);
      pivot.add(ramp);

      const railGeo = new THREE.BoxGeometry(8, 0.14, 0.12);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
      const railF = new THREE.Mesh(railGeo, railMat);
      railF.position.set(0, 0.2, 1.15);
      const railB = railF.clone();
      railB.position.set(0, 0.2, -1.15);
      pivot.add(railF, railB);

      const blockGeo = new THREE.BoxGeometry(1.1, 0.85, 1.1);
      const blockMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.2 });
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(-3.0, 0.57, 0);
      pivot.add(block);

      // Weight & Normal force arrows attached to block
      const pVec = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1.6, 0xef4444, 0.35, 0.22);
      const nVec = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.4, 0), 1.4, 0x10b981, 0.35, 0.22);
      block.add(nVec);
      group.add(pVec);

      const worldPos = new THREE.Vector3();
      let slideX = -3.1;

      return (effDt: number) => {
        const { p1, p2 } = getParams();
        const rad = (p1 * Math.PI) / 180;
        pivot.rotation.z = -rad;
        const accel = Math.max(0, 9.8 * (Math.sin(rad) - p2 * Math.cos(rad)));
        if (accel > 0.02) {
          slideX += (1.2 + accel * 0.35) * effDt;
          if (slideX > 3.2) slideX = -3.2;
        }
        block.position.x = slideX;
        block.getWorldPosition(worldPos);
        pVec.position.copy(worldPos);
      };
    }

    // 2. COLLISION SPHERES 3D
    case 'collision_spheres_3d': {
      const trackGeo = new THREE.BoxGeometry(11, 0.22, 1.8);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(0, 0.2, 0);
      group.add(track);

      const s1Geo = new THREE.SphereGeometry(0.65, 28, 24);
      const s1Mat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.22, metalness: 0.55 });
      const s1 = new THREE.Mesh(s1Geo, s1Mat);
      const s2Geo = new THREE.SphereGeometry(0.55, 28, 24);
      const s2Mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.55 });
      const s2 = new THREE.Mesh(s2Geo, s2Mat);
      group.add(s1, s2);

      return () => {
        const { p1, p2 } = getParams();
        const m1 = p1;
        const m2 = 1.0;
        const e = p2;
        const r1 = 0.45 + Math.min(0.45, m1 * 0.14);
        s1.scale.setScalar(r1 / 0.65);
        s1.position.y = 0.31 + r1;
        s2.position.y = 0.31 + 0.55;

        const cyc = getElapsed() % 3.6;
        const tHit = 1.4;
        const v1 = 3.2;
        const v1p = ((m1 - e * m2) * v1) / (m1 + m2);
        const v2p = ((1 + e) * m1 * v1) / (m1 + m2);
        const contactDist = r1 + 0.55;

        if (cyc < tHit) {
          s2.position.x = 0.5;
          s1.position.x = 0.5 - contactDist - (tHit - cyc) * v1;
        } else {
          const dt = cyc - tHit;
          s1.position.x = 0.5 - contactDist + v1p * dt;
          s2.position.x = 0.5 + v2p * dt;
        }
      };
    }

    // 3. GYROSCOPE PRECESSION 3D
    case 'gyroscope_precession_3d': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.85, 0.5, 24),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 })
      );
      base.position.set(0, 0.25, 0);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.25 })
      );
      post.position.set(0, 1.5, 0);
      group.add(base, post);

      const precessGroup = new THREE.Group();
      precessGroup.position.set(0, 2.75, 0);
      group.add(precessGroup);

      const tiltGroup = new THREE.Group();
      precessGroup.add(tiltGroup);

      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 })
      );
      axle.rotation.z = Math.PI / 2;
      axle.position.x = 1.3;
      tiltGroup.add(axle);

      const flywheel = new THREE.Group();
      flywheel.position.set(1.9, 0, 0);
      tiltGroup.add(flywheel);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.18, 16, 36),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.25 })
      );
      rim.rotation.y = Math.PI / 2;
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.35, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.5, roughness: 0.25 })
      );
      hub.rotation.z = Math.PI / 2;
      flywheel.add(rim, hub);
      for (let i = 0; i < 4; i++) {
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 1.9, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 })
        );
        spoke.rotation.x = (i * Math.PI) / 4;
        flywheel.add(spoke);
      }

      return (effDt: number) => {
        const { p1, p2 } = getParams();
        tiltGroup.rotation.z = ((p2 - 90) * Math.PI) / 180 + Math.PI / 2;
        flywheel.rotation.x += p1 * effDt;
        const precessSpeed = 12 / Math.max(2, p1);
        precessGroup.rotation.y += precessSpeed * effDt;
      };
    }

    // 4. KEPLER ORBIT 3D
    case 'kepler_orbit_3d': {
      const sun = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 28, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.85, roughness: 0.3 })
      );
      group.add(sun);

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35, metalness: 0.2 })
      );
      group.add(planet);

      const orbitLineGeo = new THREE.BufferGeometry();
      const orbitPts = new Float32Array(129 * 3);
      orbitLineGeo.setAttribute('position', new THREE.BufferAttribute(orbitPts, 3));
      const orbitLine = new THREE.Line(
        orbitLineGeo,
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
      );
      group.add(orbitLine);

      const rayLineGeo = new THREE.BufferGeometry();
      const rayPts = new Float32Array(6);
      rayLineGeo.setAttribute('position', new THREE.BufferAttribute(rayPts, 3));
      const rayLine = new THREE.Line(rayLineGeo, new THREE.LineBasicMaterial({ color: 0xfbbf24 }));
      group.add(rayLine);

      return () => {
        const { p1: ecc, p2: a } = getParams();
        const b = a * Math.sqrt(Math.max(0.15, 1 - ecc * ecc));
        const c = a * ecc;
        sun.position.set(-c, 1.5, 0);

        const attr = orbitLineGeo.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i <= 128; i++) {
          const th = (i / 128) * Math.PI * 2;
          attr.setXYZ(i, a * Math.cos(th), 1.5, b * Math.sin(th));
        }
        attr.needsUpdate = true;

        const M = getElapsed() * 1.4;
        let E = M;
        for (let i = 0; i < 4; i++) E = M + ecc * Math.sin(E);
        const px = a * Math.cos(E);
        const pz = b * Math.sin(E);
        planet.position.set(px, 1.5, pz);
        planet.rotation.y = getElapsed() * 1.2;

        const rAttr = rayLineGeo.getAttribute('position') as THREE.BufferAttribute;
        rAttr.setXYZ(0, -c, 1.5, 0);
        rAttr.setXYZ(1, px, 1.5, pz);
        rAttr.needsUpdate = true;
      };
    }

    // 5. SIMPLE PENDULUM 3D
    case 'simple_pendulum_3d': {
      const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
      );
      frameTop.position.set(0, 5.4, 0);
      group.add(frameTop);

      const pivot = new THREE.Group();
      pivot.position.set(0, 5.3, 0);
      group.add(pivot);

      const stringMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1, 10),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
      );
      pivot.add(stringMesh);

      const bob = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 24, 20),
        new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.2 })
      );
      pivot.add(bob);

      return () => {
        const { p1: L, p2: deg0 } = getParams();
        const omega = Math.sqrt(9.8 / L);
        const theta0 = (deg0 * Math.PI) / 180;
        const theta = theta0 * Math.cos(omega * getElapsed());
        stringMesh.scale.y = L;
        stringMesh.position.y = -L / 2;
        bob.position.y = -L;
        pivot.rotation.z = theta;
      };
    }

    // 6. COUPLED PENDULUMS 3D
    case 'coupled_pendulums_3d': {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 0.22, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
      );
      bar.position.set(0, 5.2, 0);
      group.add(bar);

      const pLeft = new THREE.Group();
      pLeft.position.set(-1.6, 5.1, 0);
      const pRight = new THREE.Group();
      pRight.position.set(1.6, 5.1, 0);
      group.add(pLeft, pRight);

      const makePend = (pg: THREE.Group, col: number) => {
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, 3.6, 10),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1 })
        );
        rod.position.y = -1.8;
        const bob = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 24, 20),
          new THREE.MeshStandardMaterial({ color: col, metalness: 0.45, roughness: 0.25 })
        );
        bob.position.y = -3.6;
        pg.add(rod, bob);
        return bob;
      };

      const bobL = makePend(pLeft, 0x0ea5e9);
      const bobR = makePend(pRight, 0x10b981);

      const springMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.5, roughness: 0.3 });
      const springBar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1, 12), springMat);
      springBar.rotation.z = Math.PI / 2;
      group.add(springBar);

      const posL = new THREE.Vector3();
      const posR = new THREE.Vector3();

      return () => {
        const { p1: k, p2: deg0 } = getParams();
        const t = getElapsed();
        const wAvg = 2.0;
        const wBeat = 0.45 * k;
        const amp = (deg0 * Math.PI) / 180;
        pLeft.rotation.z = amp * Math.cos(wBeat * t) * Math.cos(wAvg * t);
        pRight.rotation.z = amp * Math.sin(wBeat * t) * Math.sin(wAvg * t);

        bobL.getWorldPosition(posL);
        bobR.getWorldPosition(posR);
        // Spring attaches midpoint up rods
        const yMid = 5.1 - 2.2;
        const lx = -1.6 + Math.sin(pLeft.rotation.z) * 2.2;
        const rx = 1.6 + Math.sin(pRight.rotation.z) * 2.2;
        const dist = Math.max(0.4, rx - lx);
        springBar.position.set((lx + rx) / 2, yMid, 0);
        springBar.scale.y = dist;
      };
    }

    // 7. RESONANCE TUBES 3D
    case 'resonance_tubes_3d': {
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 8.4, 28, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          roughness: 0.2
        })
      );
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 2.0, 0);
      group.add(tube);

      const endCap = new THREE.Mesh(
        new THREE.CylinderGeometry(1.12, 1.12, 0.2, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 })
      );
      endCap.rotation.z = Math.PI / 2;
      endCap.position.set(-4.2, 2.0, 0);
      group.add(endCap);

      const rings: THREE.Mesh[] = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.75, 0.045, 10, 24),
          new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.35 })
        );
        ring.rotation.y = Math.PI / 2;
        ring.position.set(-3.9 + (i / (count - 1)) * 7.8, 2.0, 0);
        group.add(ring);
        rings.push(ring);
      }

      return () => {
        const { p1: n, p2: amp } = getParams();
        const t = getElapsed();
        for (let i = 0; i < rings.length; i++) {
          const u = i / (rings.length - 1);
          const env = Math.sin(u * Math.round(n) * Math.PI);
          const val = env * Math.cos(t * 5.2) * amp;
          const sc = Math.max(0.25, 0.72 + Math.abs(val) * 0.55);
          rings[i].scale.setScalar(sc);
          const mat = rings[i].material as THREE.MeshStandardMaterial;
          mat.color.setHex(Math.abs(env) > 0.7 ? 0xf59e0b : 0x10b981);
        }
      };
    }

    // 8. SOLENOID FIELD 3D
    case 'solenoid_field_3d': {
      const coilGroup = new THREE.Group();
      coilGroup.position.set(0, 2.0, 0);
      group.add(coilGroup);

      const coils: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) {
        const loop = new THREE.Mesh(
          new THREE.TorusGeometry(1.15, 0.09, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.2 })
        );
        loop.rotation.y = Math.PI / 2;
        loop.position.x = -3.3 + (i / 11) * 6.6;
        coilGroup.add(loop);
        coils.push(loop);
      }

      const dots: THREE.Mesh[] = [];
      const dotGeo = new THREE.SphereGeometry(0.11, 12, 10);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
      for (let i = 0; i < 18; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        coilGroup.add(dot);
        dots.push(dot);
      }

      // Field axis cylinder guide
      const axisArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4.2, 2.0, 0), 8.4, 0x38bdf8, 0.5, 0.25);
      group.add(axisArrow);

      return () => {
        const { p1: curI, p2: turns } = getParams();
        const t = getElapsed();
        const visibleCoils = Math.max(4, Math.min(12, Math.round(turns * 0.6)));
        coils.forEach((c, idx) => {
          c.visible = idx < visibleCoils;
        });
        const speed = 0.6 + curI * 0.32;
        dots.forEach((d, i) => {
          const lane = (i % 3) - 1;
          const phase = ((t * speed + i * 0.6) % 8.4) - 4.2;
          d.position.set(phase, lane * 0.42, (i % 2 === 0 ? 1 : -1) * 0.22);
        });
      };
    }

    // 9. ELECTRIC DIPOLE 3D
    case 'electric_dipole_3d': {
      const plusQ = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 24, 20),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.4 })
      );
      const minusQ = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 24, 20),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
      );
      group.add(plusQ, minusQ);

      const arcs: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const arc = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.035, 8, 36, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.3 })
        );
        arc.rotation.x = (i * Math.PI) / 3;
        arc.position.y = 2.2;
        group.add(arc);
        arcs.push(arc);
      }

      return () => {
        const { p1: dist, p2: q } = getParams();
        plusQ.position.set(-dist / 2, 2.2, 0);
        minusQ.position.set(dist / 2, 2.2, 0);
        const s = 0.75 + q * 0.05;
        plusQ.scale.setScalar(s);
        minusQ.scale.setScalar(s);
        arcs.forEach((a, idx) => {
          a.scale.set(dist / 3.2, (dist / 3.2) * (0.7 + (idx % 2) * 0.4), 1);
          a.rotation.x = (idx * Math.PI) / 3 + getElapsed() * 0.25;
        });
      };
    }

    // 10. DC MOTOR 3D
    case 'dc_motor_3d': {
      const magN = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 2.4, 2.4),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 })
      );
      magN.position.set(-3.2, 2.2, 0);
      const magS = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 2.4, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 })
      );
      magS.position.set(3.2, 2.2, 0);
      group.add(magN, magS);

      const rotor = new THREE.Group();
      rotor.position.set(0, 2.2, 0);
      group.add(rotor);

      const coilFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.14, 1.8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 })
      );
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4.4, 14),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 })
      );
      axle.rotation.x = Math.PI / 2;
      const commutator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.45, 16),
        new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6 })
      );
      commutator.rotation.x = Math.PI / 2;
      commutator.position.z = 1.6;
      rotor.add(coilFrame, axle, commutator);

      return (effDt: number) => {
        const { p1: curI, p2: magB } = getParams();
        rotor.rotation.z += curI * magB * 0.65 * effDt;
      };
    }

    // 11. TRANSFORMER 3D
    case 'transformer_3d': {
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.65, roughness: 0.3 });
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.65, 1.0), coreMat);
      topBar.position.set(0, 4.1, 0);
      const botBar = topBar.clone();
      botBar.position.set(0, 0.9, 0);
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.2, 1.0), coreMat);
      leftLeg.position.set(-2.25, 2.5, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.set(2.25, 2.5, 0);
      group.add(topBar, botBar, leftLeg, rightLeg);

      const secLoops: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const l = new THREE.Mesh(
          new THREE.TorusGeometry(0.72, 0.08, 10, 24),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 })
        );
        l.rotation.x = Math.PI / 2;
        l.position.set(-2.25, 1.6 + i * 0.35, 0);
        group.add(l);
      }
      for (let i = 0; i < 12; i++) {
        const r = new THREE.Mesh(
          new THREE.TorusGeometry(0.72, 0.075, 10, 24),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 })
        );
        r.rotation.x = Math.PI / 2;
        r.position.set(2.25, 1.45 + i * 0.2, 0);
        group.add(r);
        secLoops.push(r);
      }

      const fluxGlow = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.08, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.7 })
      );
      fluxGlow.position.set(0, 2.5, 0);
      group.add(fluxGlow);

      return () => {
        const { p1: ratio } = getParams();
        const showCount = Math.max(3, Math.min(12, Math.round(6 * ratio)));
        secLoops.forEach((mObj, i) => {
          mObj.visible = i < showCount;
        });
        const mat = fluxGlow.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.25 + 0.75 * Math.abs(Math.sin(getElapsed() * 3.5));
      };
    }

    // 12. PRISM DISPERSION 3D
    case 'prism_dispersion_3d': {
      const prism = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 2.6, 3),
        new THREE.MeshStandardMaterial({
          color: 0xa78bfa,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          metalness: 0.15
        })
      );
      prism.position.set(0, 2.1, 0);
      group.add(prism);

      const incidentBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 4.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf8fafc, emissiveIntensity: 0.9 })
      );
      incidentBeam.rotation.z = Math.PI / 2;
      incidentBeam.position.set(-2.9, 2.1, 0);
      group.add(incidentBeam);

      const specCols = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x06b6d4, 0x3b82f6, 0xa855f7];
      const rays: THREE.Mesh[] = [];
      specCols.forEach((c) => {
        const ray = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 5.2, 10),
          new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.85 })
        );
        group.add(ray);
        rays.push(ray);
      });

      return () => {
        const { p1: rotDeg, p2: disp } = getParams();
        prism.rotation.y = (rotDeg * Math.PI) / 180;
        rays.forEach((ray, idx) => {
          const ang = -0.06 - idx * 0.065 * disp;
          ray.rotation.z = Math.PI / 2 + ang;
          ray.position.set(3.2, 2.0 + Math.sin(ang) * 2.4, 0);
        });
      };
    }

    // 13. CURVED MIRROR 3D
    case 'curved_mirror_3d': {
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 32, 24, 0, Math.PI * 2, 0, 0.65),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.85,
          roughness: 0.12,
          side: THREE.DoubleSide
        })
      );
      dish.rotation.z = Math.PI / 2;
      dish.position.set(0.6, 2.2, 0);
      group.add(dish);

      const focalDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 18, 16),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
      );
      group.add(focalDot);

      const rayMat = new THREE.LineBasicMaterial({ color: 0xfef08a });
      const lines: THREE.Line[] = [];
      for (let i = 0; i < 10; i++) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
        const ln = new THREE.Line(geo, rayMat);
        group.add(ln);
        lines.push(ln);
      }

      return () => {
        const { p1: curv, p2: count } = getParams();
        dish.scale.set(curv, 1, 1);
        const fX = 3.8 - 2.4 / curv;
        focalDot.position.set(fX, 2.2, 0);
        const nShow = Math.round(count);
        lines.forEach((ln, idx) => {
          ln.visible = idx < nShow;
          if (!ln.visible) return;
          const yOff = ((idx - (nShow - 1) / 2) / Math.max(1, nShow / 2)) * 1.45;
          const attr = ln.geometry.getAttribute('position') as THREE.BufferAttribute;
          attr.setXYZ(0, -4.5, 2.2 + yOff, 0);
          attr.setXYZ(1, 3.7, 2.2 + yOff, 0);
          attr.setXYZ(2, fX, 2.2, 0);
          attr.needsUpdate = true;
        });
      };
    }

    // 14. POLARIZATION 3D
    case 'polarization_3d': {
      const f1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.12, 28),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
      );
      f1.rotation.z = Math.PI / 2;
      f1.position.set(-1.6, 2.2, 0);

      const f2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.12, 28),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45 })
      );
      f2.rotation.z = Math.PI / 2;
      f2.position.set(1.6, 2.2, 0);

      const axis2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 2.6, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
      );
      f2.add(axis2);
      group.add(f1, f2);

      const wavePts = new Float32Array(80 * 3);
      const waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePts, 3));
      const waveLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: 0x34d399 }));
      group.add(waveLine);

      return () => {
        const { p1: deg, p2: freq } = getParams();
        const rad = (deg * Math.PI) / 180;
        f2.rotation.x = rad;
        const atten = Math.cos(rad);
        const attr = waveGeo.getAttribute('position') as THREE.BufferAttribute;
        const t = getElapsed();
        for (let i = 0; i < 80; i++) {
          const x = -4.5 + (i / 79) * 9.0;
          const phase = x * 2.1 - t * freq * 3.0;
          const s = Math.sin(phase);
          if (x < -1.6) {
            attr.setXYZ(i, x, 2.2 + s * 0.9, Math.cos(phase) * 0.5);
          } else if (x < 1.6) {
            attr.setXYZ(i, x, 2.2 + s * 0.9, 0);
          } else {
            const amp = s * 0.9 * atten;
            attr.setXYZ(i, x, 2.2 + amp * Math.cos(rad), amp * Math.sin(rad));
          }
        }
        attr.needsUpdate = true;
      };
    }

    // 15. BLACKBODY CAVITY 3D
    case 'blackbody_cavity_3d': {
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0xef4444,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const cavity = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 3.6), boxMat);
      cavity.position.set(0, 2.2, 0);
      group.add(cavity);

      const photons: THREE.Mesh[] = [];
      const pGeo = new THREE.SphereGeometry(0.14, 12, 10);
      const pMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
      for (let i = 0; i < 24; i++) {
        const ph = new THREE.Mesh(pGeo, pMat);
        group.add(ph);
        photons.push(ph);
      }

      return () => {
        const { p1: tempK, p2: dens } = getParams();
        const tNorm = (tempK - 2000) / 6000;
        boxMat.emissive.setHSL(0.02 + tNorm * 0.52, 0.9, 0.45);
        pMat.emissive.setHSL(0.05 + tNorm * 0.5, 1.0, 0.55);
        const speed = 1.2 + tNorm * 3.0;
        const nVis = Math.max(6, Math.min(24, Math.round(12 * dens)));
        const t = getElapsed();
        photons.forEach((ph, idx) => {
          ph.visible = idx < nVis;
          if (!ph.visible) return;
          ph.position.set(
            Math.sin(t * speed + idx * 1.7) * 1.7,
            2.2 + Math.cos(t * speed * 1.2 + idx * 2.1) * 1.4,
            Math.sin(t * speed * 0.9 + idx * 3.1) * 1.4
          );
        });
      };
    }

    // 16. CARNOT PISTON 3D
    case 'carnot_piston_3d': {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 4.4, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      cyl.position.set(0, 2.3, 0);
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.55, 0.3, 28),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x9f1239, emissiveIntensity: 0.4 })
      );
      base.position.set(0, 0.15, 0);
      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(1.42, 1.42, 0.38, 28),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.2 })
      );
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 2.4, 14),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 })
      );
      rod.position.y = 1.3;
      piston.add(rod);
      group.add(cyl, base, piston);

      const mols: THREE.Mesh[] = [];
      const mGeo = new THREE.SphereGeometry(0.12, 12, 10);
      const mMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      for (let i = 0; i < 16; i++) {
        const mObj = new THREE.Mesh(mGeo, mMat);
        group.add(mObj);
        mols.push(mObj);
      }

      return () => {
        const { p1: t1, p2: t2 } = getParams();
        const t = getElapsed();
        const stroke = 0.8 + Math.min(0.9, (t1 - t2) / 900);
        const py = 2.6 + Math.sin(t * 2.4) * stroke;
        piston.position.y = py;
        mols.forEach((ml, idx) => {
          ml.position.set(
            Math.cos(t * 4.2 + idx * 1.9) * 1.05,
            0.45 + ((Math.sin(t * 3.7 + idx * 2.4) + 1) * 0.5) * (py - 0.7),
            Math.sin(t * 4.5 + idx * 1.3) * 1.05
          );
        });
      };
    }

    // 17. NUCLEAR FISSION 3D
    case 'nuclear_fission_3d': {
      const nIn = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 })
      );
      const fragA = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 22, 18),
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 })
      );
      const fragB = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 22, 18),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
      );
      const secN1 = nIn.clone();
      const secN2 = nIn.clone();
      group.add(nIn, fragA, fragB, secN1, secN2);

      return () => {
        const { p1: eVal, p2: spd } = getParams();
        const cyc = (getElapsed() * spd) % 3.2;
        const tHit = 1.1;
        if (cyc < tHit) {
          nIn.visible = true;
          nIn.position.set(-4.0 + (cyc / tHit) * 4.0, 2.2, 0);
          fragA.position.set(0, 2.2, 0);
          fragB.position.set(0, 2.2, 0);
          fragA.scale.setScalar(1.3);
          fragB.visible = false;
          secN1.visible = false;
          secN2.visible = false;
        } else {
          nIn.visible = false;
          fragB.visible = true;
          secN1.visible = true;
          secN2.visible = true;
          fragA.scale.setScalar(1.0);
          const dt = (cyc - tHit) * (1.5 + eVal * 0.35);
          fragA.position.set(dt * 1.1, 2.2 + dt * 0.9, dt * 0.3);
          fragB.position.set(dt * 1.1, 2.2 - dt * 0.9, -dt * 0.3);
          secN1.position.set(dt * 2.4, 2.2 + dt * 1.4, -dt * 0.8);
          secN2.position.set(dt * 2.4, 2.2 - dt * 1.2, dt * 0.9);
        }
      };
    }

    // 18. RUTHERFORD SCATTERING 3D
    case 'rutherford_scattering_3d': {
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 24, 20),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.7 })
      );
      nucleus.position.set(0, 2.2, 0);
      group.add(nucleus);

      const alphas: THREE.Mesh[] = [];
      const aGeo = new THREE.SphereGeometry(0.14, 14, 12);
      const aMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.75 });
      for (let i = 0; i < 12; i++) {
        const al = new THREE.Mesh(aGeo, aMat);
        group.add(al);
        alphas.push(al);
      }

      return () => {
        const { p1: zNum, p2: kMeV } = getParams();
        const t = getElapsed();
        const deflectPow = (zNum / 79) * (5.5 / kMeV);
        alphas.forEach((al, idx) => {
          const offsetY = ((idx % 4) - 1.5) * 0.7;
          const offsetZ = (Math.floor(idx / 4) - 1) * 0.9;
          const b = Math.hypot(offsetY, offsetZ);
          const x = ((t * 3.8 + idx * 0.75) % 9.0) - 4.5;
          let py = 2.2 + offsetY;
          let pz = offsetZ;
          if (x > 0) {
            const kick = (deflectPow * 1.1) / Math.max(0.25, b * b);
            py += Math.sign(offsetY || 1) * x * kick * 0.35;
            pz += Math.sign(offsetZ || 1) * x * kick * 0.35;
          }
          al.position.set(x, py, pz);
        });
      };
    }

    default:
      return null;
  }
}
