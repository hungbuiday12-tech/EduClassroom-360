import * as THREE from 'three';
import { ExtraPhysics3DModeId } from '../../data/physicsExtraSimsData';
import { buildBatch2Extra3DScene } from './physics3DExtraBatch2Scenes';
import {
  createTroikaLabel,
  GPUParticlePool,
  OptimizedTrail,
  createCrispLine2,
} from '../../lib/three3DEnhancements';

export interface Extra3DStateGetter {
  (): { p1: number; p2: number };
}

export interface Extra3DSceneContext {
  particlePool?: GPUParticlePool | null;
  trail?: OptimizedTrail | null;
  cutawayPlanes?: THREE.Plane[];
  camera?: THREE.Camera | null;
}

function orientCylinderBetween(
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

export function buildExtra3DScene(
  mode: string,
  group: THREE.Group,
  getParams: Extra3DStateGetter,
  getElapsed: () => number,
  ctx?: Extra3DSceneContext
): ((effDt: number) => void) | null {
  const m = mode as ExtraPhysics3DModeId;
  const upAxis = new THREE.Vector3(0, 1, 0);
  const clipPlanes = ctx?.cutawayPlanes ?? [];
  const pool = ctx?.particlePool ?? null;
  const trail = ctx?.trail ?? null;
  const camera = ctx?.camera ?? undefined;

  switch (m) {
    // 1. INCLINED PLANE 3D
    case 'inclined_plane_3d': {
      const basePlate = new THREE.Mesh(
        new THREE.BoxGeometry(8.6, 0.22, 3.0),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.55, metalness: 0.35 })
      );
      basePlate.position.set(0, 0.11, 0);
      group.add(basePlate);

      const pivotHinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 2.6, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.82, roughness: 0.2, clearcoat: 0.7 })
      );
      pivotHinge.rotation.x = Math.PI / 2;
      pivotHinge.position.set(0, 1.2, 0);
      group.add(pivotHinge);

      const supportColumn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.22, 1.05, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.28 })
      );
      supportColumn.position.set(0, 0.65, 0);
      group.add(supportColumn);

      const pivot = new THREE.Group();
      pivot.position.set(0, 1.2, 0);
      group.add(pivot);

      const rampGeo = new THREE.BoxGeometry(8, 0.28, 2.4);
      const rampMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, roughness: 0.36, metalness: 0.42, clearcoat: 0.55 });
      const ramp = new THREE.Mesh(rampGeo, rampMat);
      pivot.add(ramp);

      const railGeo = new THREE.BoxGeometry(8, 0.14, 0.12);
      const railMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.22, metalness: 0.35, clearcoat: 0.85 });
      const railF = new THREE.Mesh(railGeo, railMat);
      railF.position.set(0, 0.2, 1.15);
      const railB = railF.clone();
      railB.position.set(0, 0.2, -1.15);
      pivot.add(railF, railB);

      const blockGeo = new THREE.BoxGeometry(1.1, 0.85, 1.1);
      const blockMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.28, clearcoat: 0.88 });
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(-3.0, 0.57, 0);
      pivot.add(block);

      const pVec = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 1.6, 0xef4444, 0.35, 0.22);
      const nVec = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.4, 0), 1.4, 0x10b981, 0.35, 0.22);
      block.add(nVec);
      group.add(pVec);

      const lblBlock = createTroikaLabel({ text: 'm (P⃗, N⃗)', position: [0, 1.3, 0], fontSize: 0.32, color: 0xfef08a });
      block.add(lblBlock);
      const lblRamp = createTroikaLabel({ text: 'α  ·  μ', position: [3.2, 0.55, 1.45], fontSize: 0.32, color: 0x38bdf8 });
      pivot.add(lblRamp);

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
      const trackGeo = new THREE.BoxGeometry(11, 0.24, 1.9);
      const trackMat = new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.38, clearcoat: 0.4 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(0, 0.18, 0);
      group.add(track);

      const trimMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.78, roughness: 0.22 });
      [-0.9, 0.9].forEach((tz) => {
        const sideRail = new THREE.Mesh(new THREE.BoxGeometry(11, 0.1, 0.08), trimMat);
        sideRail.position.set(0, 0.34, tz);
        group.add(sideRail);
      });
      [-5.45, 5.45].forEach((bx) => {
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 1.85), trimMat);
        bumper.position.set(bx, 0.48, 0);
        group.add(bumper);
      });

      const s1Geo = new THREE.SphereGeometry(0.65, 32, 28);
      const s1Mat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, roughness: 0.14, metalness: 0.65, clearcoat: 0.95 });
      const s1 = new THREE.Mesh(s1Geo, s1Mat);
      const s2Geo = new THREE.SphereGeometry(0.55, 32, 28);
      const s2Mat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.14, metalness: 0.65, clearcoat: 0.95 });
      const s2 = new THREE.Mesh(s2Geo, s2Mat);
      const lblM1 = createTroikaLabel({ text: 'm₁', position: [0, 1.05, 0], fontSize: 0.34, color: 0x7dd3fc });
      const lblM2 = createTroikaLabel({ text: 'm₂', position: [0, 0.95, 0], fontSize: 0.34, color: 0xfde68a });
      s1.add(lblM1);
      s2.add(lblM2);
      group.add(s1, s2);

      let prevPreHit = true;

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
          prevPreHit = true;
          s2.position.x = 0.5;
          s1.position.x = 0.5 - contactDist - (tHit - cyc) * v1;
        } else {
          if (prevPreHit && pool) {
            prevPreHit = false;
            const impactX = 0.5 - 0.55;
            for (let k = 0; k < 14; k++) {
              const ang = (k / 14) * Math.PI * 2;
              pool.spawn(
                impactX,
                0.86,
                0,
                (Math.random() - 0.5) * 1.4,
                Math.abs(Math.sin(ang)) * 2.4 + 0.5,
                Math.cos(ang) * 2.1,
                0.65,
                1.0,
                k % 2 === 0 ? 0xfbbf24 : 0x38bdf8
              );
            }
          }
          const dt = cyc - tHit;
          s1.position.x = 0.5 - contactDist + v1p * dt;
          s2.position.x = 0.5 + v2p * dt;
        }
      };
    }

    // 3. GYROSCOPE PRECESSION 3D
    case 'gyroscope_precession_3d': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.92, 0.48, 28),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.24, clearcoat: 0.65 })
      );
      base.position.set(0, 0.24, 0);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.12, 2.5, 20),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.18, clearcoat: 0.7 })
      );
      post.position.set(0, 1.5, 0);
      const gimbalCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 20, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.16, clearcoat: 0.8 })
      );
      gimbalCap.position.set(0, 2.75, 0);
      group.add(base, post, gimbalCap);

      const precessGroup = new THREE.Group();
      precessGroup.position.set(0, 2.75, 0);
      group.add(precessGroup);

      const tiltGroup = new THREE.Group();
      precessGroup.add(tiltGroup);

      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.16, clearcoat: 0.7 })
      );
      axle.rotation.z = Math.PI / 2;
      axle.position.x = 1.3;
      tiltGroup.add(axle);

      const flywheel = new THREE.Group();
      flywheel.position.set(1.9, 0, 0);
      tiltGroup.add(flywheel);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.18, 20, 48),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.16, clearcoat: 0.85, clearcoatRoughness: 0.12 })
      );
      rim.rotation.y = Math.PI / 2;
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.35, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.72, roughness: 0.18, clearcoat: 0.75 })
      );
      hub.rotation.z = Math.PI / 2;
      flywheel.add(rim, hub);
      for (let i = 0; i < 4; i++) {
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 1.9, 0.1),
          new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.18 })
        );
        spoke.rotation.x = (i * Math.PI) / 4;
        flywheel.add(spoke);
      }

      const lArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2.1, 0, 0), 1.3, 0x38bdf8, 0.28, 0.15);
      tiltGroup.add(lArrow);
      group.add(
        createTroikaLabel({ text: 'Ω tiến động', position: [0, 3.65, 0], fontSize: 0.34, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'L⃗ = Iω', position: [3.2, 2.9, 0], fontSize: 0.3, color: 0x38bdf8 })
      );

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
        new THREE.SphereGeometry(0.78, 32, 28),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.95, roughness: 0.25, clearcoat: 0.4 })
      );
      const sunCorona = new THREE.Mesh(
        new THREE.SphereGeometry(1.08, 24, 20),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.22, depthWrite: false })
      );
      sun.add(sunCorona);
      group.add(sun);

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.24, metalness: 0.25, clearcoat: 0.9 })
      );
      const atmo = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 18),
        new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.24, depthWrite: false })
      );
      planet.add(atmo);
      group.add(planet);

      const orbitLineGeo = new THREE.BufferGeometry();
      const orbitPts = new Float32Array(129 * 3);
      orbitLineGeo.setAttribute('position', new THREE.BufferAttribute(orbitPts, 3));
      const orbitLine = new THREE.Line(
        orbitLineGeo,
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 })
      );
      group.add(orbitLine);

      // Radius vector cylinder ray (zero-allocation orientation)
      const radiusRay = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1, 8),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 0.7 })
      );
      group.add(radiusRay);
      const sunPos = new THREE.Vector3();
      const pPos = new THREE.Vector3();
      const tmpDir = new THREE.Vector3();

      const lblSun = createTroikaLabel({ text: 'Mặt trời F₁', position: [0, 1.25, 0], fontSize: 0.34, color: 0xfbbf24 });
      sun.add(lblSun);
      const lblPlanet = createTroikaLabel({ text: 'Hành tinh', position: [0, 0.68, 0], fontSize: 0.3, color: 0x7dd3fc });
      planet.add(lblPlanet);
      trail?.clear();

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
        trail?.pushAndRender(px, 1.5, pz, camera, 0.02, 30);

        sunPos.set(-c, 1.5, 0);
        pPos.set(px, 1.5, pz);
        orientCylinderBetween(radiusRay, sunPos, pPos, tmpDir, upAxis);
      };
    }

    // 5. SIMPLE PENDULUM 3D
    case 'simple_pendulum_3d': {
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.74, roughness: 0.28, clearcoat: 0.5 });
      const basePad = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 1.6), standMat);
      basePad.position.set(0, 0.11, 0);
      group.add(basePad);

      [-1.55, 1.55].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 5.4, 16), standMat);
        pillar.position.set(px, 2.75, 0);
        group.add(pillar);
      });

      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.22, 0.4), standMat);
      frameTop.position.set(0, 5.45, 0);
      const clampCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.45, 18),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.82, roughness: 0.18, clearcoat: 0.75 })
      );
      clampCollar.rotation.x = Math.PI / 2;
      clampCollar.position.set(0, 5.32, 0);
      group.add(frameTop, clampCollar);

      const pivot = new THREE.Group();
      pivot.position.set(0, 5.3, 0);
      group.add(pivot);

      const stringMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 1, 12),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.18 })
      );
      pivot.add(stringMesh);

      const bob = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, metalness: 0.6, roughness: 0.16, clearcoat: 0.92 })
      );
      pivot.add(bob);
      group.add(createTroikaLabel({ text: 'T = 2π√(l/g)', position: [0, 5.95, 0], fontSize: 0.34, color: 0x34d399 }));

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
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.74, roughness: 0.28, clearcoat: 0.5 });
      const basePad = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 1.6), standMat);
      basePad.position.set(0, 0.11, 0);
      group.add(basePad);

      [-2.75, 2.75].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 5.2, 16), standMat);
        pillar.position.set(px, 2.65, 0);
        group.add(pillar);
      });

      const bar = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.24, 0.42), standMat);
      bar.position.set(0, 5.25, 0);
      group.add(bar);

      const pLeft = new THREE.Group();
      pLeft.position.set(-1.6, 5.1, 0);
      const pRight = new THREE.Group();
      pRight.position.set(1.6, 5.1, 0);
      group.add(pLeft, pRight);

      const makePend = (pg: THREE.Group, col: number) => {
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.46, 16),
          new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
        );
        collar.rotation.x = Math.PI / 2;
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.036, 0.036, 3.6, 12),
          new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.82, roughness: 0.18 })
        );
        rod.position.y = -1.8;
        const bob = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 28, 24),
          new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.55, roughness: 0.16, clearcoat: 0.92 })
        );
        bob.position.y = -3.6;
        pg.add(collar, rod, bob);
        return bob;
      };

      const bobL = makePend(pLeft, 0x0ea5e9);
      const bobR = makePend(pRight, 0x10b981);

      const springMat = new THREE.MeshPhysicalMaterial({ color: 0xfbbf24, metalness: 0.72, roughness: 0.22, clearcoat: 0.7 });
      const springBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 14), springMat);
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
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.72, roughness: 0.28 });
      const baseRail = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.18, 2.4), standMat);
      baseRail.position.set(0, 0.09, 0);
      group.add(baseRail);
      [-3.1, 3.1].forEach((sx) => {
        const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.86, 1.9), standMat);
        cradle.position.set(sx, 0.52, 0);
        group.add(cradle);
      });

      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 8.4, 40, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.26,
          side: THREE.DoubleSide,
          roughness: 0.06,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          ior: 1.5,
          depthWrite: false,
          clippingPlanes: clipPlanes,
        })
      );
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 2.0, 0);
      group.add(tube);

      const endCap = new THREE.Mesh(
        new THREE.CylinderGeometry(1.14, 1.14, 0.22, 28),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.18, clearcoat: 0.8 })
      );
      endCap.rotation.z = Math.PI / 2;
      endCap.position.set(-4.2, 2.0, 0);
      group.add(endCap);

      group.add(
        createTroikaLabel({ text: 'Nút (đầu kín)', position: [-4.2, 3.45, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Bụng / Sóng dừng âm', position: [0, 3.55, 0], fontSize: 0.32, color: 0x34d399 })
      );

      const rings: THREE.Mesh[] = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.75, 0.048, 12, 28),
          new THREE.MeshPhysicalMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4, clearcoat: 0.6 })
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
          const mat = rings[i].material as THREE.MeshPhysicalMaterial;
          mat.color.setHex(Math.abs(env) > 0.7 ? 0xf59e0b : 0x10b981);
        }
      };
    }

    // 8. SOLENOID FIELD 3D
    case 'solenoid_field_3d': {
      const baseCradle = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.22, 2.6),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.48, metalness: 0.4, clearcoat: 0.4 })
      );
      baseCradle.position.set(0, 0.11, 0);
      group.add(baseCradle);

      const acrylicCore = new THREE.Mesh(
        new THREE.CylinderGeometry(1.02, 1.02, 7.0, 32, 1, true),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.18, roughness: 0.08, clearcoat: 0.9, side: THREE.DoubleSide, depthWrite: false })
      );
      acrylicCore.rotation.z = Math.PI / 2;
      acrylicCore.position.set(0, 2.0, 0);
      group.add(acrylicCore);

      const coilGroup = new THREE.Group();
      coilGroup.position.set(0, 2.0, 0);
      group.add(coilGroup);

      const coils: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) {
        const loop = new THREE.Mesh(
          new THREE.TorusGeometry(1.15, 0.095, 14, 36),
          new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.16, clearcoat: 0.8 })
        );
        loop.rotation.y = Math.PI / 2;
        loop.position.x = -3.3 + (i / 11) * 6.6;
        coilGroup.add(loop);
        coils.push(loop);
      }

      const dots: THREE.Mesh[] = [];
      const dotGeo = new THREE.SphereGeometry(0.11, 12, 10);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.85 });
      for (let i = 0; i < 18; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        coilGroup.add(dot);
        dots.push(dot);
      }

      const axisArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-4.2, 2.0, 0), 8.4, 0x38bdf8, 0.5, 0.25);
      group.add(
        axisArrow,
        createTroikaLabel({ text: 'B⃗ = μ₀·(N/L)·I', position: [0, 3.65, 0], fontSize: 0.34, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'N (Bắc)', position: [4.5, 2.0, 0], fontSize: 0.3, color: 0xfbbf24 })
      );

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
        new THREE.SphereGeometry(0.55, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.48, clearcoat: 0.9, roughness: 0.16 })
      );
      const plusHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.76, 20, 18),
        new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.18, depthWrite: false })
      );
      plusQ.add(plusHalo, createTroikaLabel({ text: '+q', position: [0, 0.95, 0], fontSize: 0.36, color: 0xfca5a5 }));

      const minusQ = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.48, clearcoat: 0.9, roughness: 0.16 })
      );
      const minusHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.76, 20, 18),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, depthWrite: false })
      );
      minusQ.add(minusHalo, createTroikaLabel({ text: '-q', position: [0, 0.95, 0], fontSize: 0.36, color: 0x7dd3fc }));
      group.add(plusQ, minusQ);

      const arcs: THREE.Mesh[] = [];
      for (let i = 0; i < 6; i++) {
        const arc = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.038, 10, 42, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.4 })
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
      const baseBoard = new THREE.Mesh(
        new THREE.BoxGeometry(7.8, 0.26, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.35 })
      );
      baseBoard.position.set(0, 0.13, 0);
      group.add(baseBoard);

      [-1.9, 1.9].forEach((pz) => {
        const bearingPost = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, 2.1, 0.24),
          new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.28 })
        );
        bearingPost.position.set(0, 1.25, pz);
        group.add(bearingPost);
      });

      const magN = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 2.4, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.24, metalness: 0.32, clearcoat: 0.7 })
      );
      magN.position.set(-3.2, 2.2, 0);
      const magS = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 2.4, 2.4),
        new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.24, metalness: 0.32, clearcoat: 0.7 })
      );
      magS.position.set(3.2, 2.2, 0);
      group.add(magN, magS);

      const rotor = new THREE.Group();
      rotor.position.set(0, 2.2, 0);
      group.add(rotor);

      const coilFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.14, 1.8),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.16, clearcoat: 0.8 })
      );
      const axle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 4.4, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.88, roughness: 0.14 })
      );
      axle.rotation.x = Math.PI / 2;
      const commutator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.45, 20),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, metalness: 0.72, roughness: 0.2, clearcoat: 0.75 })
      );
      commutator.rotation.x = Math.PI / 2;
      commutator.position.z = 1.6;
      rotor.add(coilFrame, axle, commutator);
      group.add(
        createTroikaLabel({ text: 'N', position: [-3.2, 3.7, 0], fontSize: 0.38, color: 0xf87171 }),
        createTroikaLabel({ text: 'S', position: [3.2, 3.7, 0], fontSize: 0.38, color: 0x60a5fa }),
        createTroikaLabel({ text: 'Rotor & Cổ góp', position: [0, 3.7, 1.4], fontSize: 0.3, color: 0x34d399 })
      );

      let sparkCooldown = 0;
      return (effDt: number) => {
        const { p1: curI, p2: magB } = getParams();
        rotor.rotation.z += curI * magB * 0.65 * effDt;
        sparkCooldown -= effDt;
        if (pool && curI * magB > 1.2 && sparkCooldown <= 0) {
          sparkCooldown = 0.24;
          pool.spawn(
            (Math.random() - 0.5) * 0.2,
            2.2 + (Math.random() - 0.5) * 0.2,
            1.6,
            (Math.random() - 0.5) * 1.1,
            0.5 + Math.random() * 0.8,
            0.3 + Math.random() * 0.6,
            0.42,
            0.65,
            0x34d399
          );
        }
      };
    }

    // 11. TRANSFORMER 3D
    case 'transformer_3d': {
      const basePad = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 0.22, 2.2),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.55, metalness: 0.3 })
      );
      basePad.position.set(0, 0.11, 0);
      group.add(basePad);

      const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.78, roughness: 0.24, clearcoat: 0.5 });
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.65, 1.0), coreMat);
      topBar.position.set(0, 4.1, 0);
      const botBar = topBar.clone();
      botBar.position.set(0, 0.9, 0);
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.2, 1.0), coreMat);
      leftLeg.position.set(-2.25, 2.5, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.set(2.25, 2.5, 0);
      group.add(topBar, botBar, leftLeg, rightLeg);

      const priMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.16, clearcoat: 0.75 });
      for (let i = 0; i < 6; i++) {
        const l = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.08, 12, 28), priMat);
        l.rotation.x = Math.PI / 2;
        l.position.set(-2.25, 1.6 + i * 0.35, 0);
        group.add(l);
      }
      const secMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.16, clearcoat: 0.75 });
      const secLoops: THREE.Mesh[] = [];
      for (let i = 0; i < 12; i++) {
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.075, 12, 28), secMat);
        r.rotation.x = Math.PI / 2;
        r.position.set(2.25, 1.45 + i * 0.2, 0);
        group.add(r);
        secLoops.push(r);
      }

      const fluxGlow = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.08, 14, 52),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.75 })
      );
      fluxGlow.position.set(0, 2.5, 0);
      group.add(
        fluxGlow,
        createTroikaLabel({ text: 'Cuộn sơ cấp N₁', position: [-2.25, 4.8, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Cuộn thứ cấp N₂', position: [2.25, 4.8, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'Φ(t)', position: [0, 2.5, 0.5], fontSize: 0.34, color: 0x34d399 })
      );

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
      const prismStand = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.65, 0.75, 28),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.28, clearcoat: 0.5 })
      );
      prismStand.position.set(0, 0.38, 0);
      group.add(prismStand);

      const prism = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 2.6, 3),
        new THREE.MeshPhysicalMaterial({
          color: 0xc4b5fd,
          transparent: true,
          opacity: 0.45,
          roughness: 0.05,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          ior: 1.65,
          reflectivity: 0.95
        })
      );
      prism.position.set(0, 2.1, 0);
      group.add(prism);

      const incidentBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 4.6, 14),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf8fafc, emissiveIntensity: 0.95 })
      );
      incidentBeam.rotation.z = Math.PI / 2;
      incidentBeam.position.set(-2.9, 2.1, 0);
      group.add(incidentBeam);

      const specCols = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x06b6d4, 0x3b82f6, 0xa855f7];
      const rays: THREE.Mesh[] = [];
      specCols.forEach((c) => {
        const ray = new THREE.Mesh(
          new THREE.CylinderGeometry(0.042, 0.042, 5.2, 12),
          new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9 })
        );
        group.add(ray);
        rays.push(ray);
      });
      group.add(
        createTroikaLabel({ text: 'Ánh sáng trắng', position: [-3.5, 2.65, 0], fontSize: 0.3, color: 0xf8fafc }),
        createTroikaLabel({ text: 'Lăng kính (nđ < nt)', position: [0, 3.85, 0], fontSize: 0.32, color: 0xc4b5fd }),
        createTroikaLabel({ text: 'Quang phổ Đỏ → Tím', position: [3.8, 0.85, 0], fontSize: 0.3, color: 0xfbbf24 })
      );

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
      const benchRail = new THREE.Mesh(
        new THREE.BoxGeometry(9.6, 0.18, 1.4),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.68, roughness: 0.3, clearcoat: 0.4 })
      );
      benchRail.position.set(-0.2, 0.09, 0);
      const mirrorStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.22, 0.55, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.78, roughness: 0.22 })
      );
      mirrorStem.position.set(3.7, 0.4, 0);
      group.add(benchRail, mirrorStem);

      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 42, 30, 0, Math.PI * 2, 0, 0.65),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          metalness: 0.96,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          side: THREE.DoubleSide
        })
      );
      dish.rotation.z = Math.PI / 2;
      dish.position.set(0.6, 2.2, 0);
      group.add(dish);

      const focalDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 20, 18),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.95 })
      );
      const focalHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.24, depthWrite: false })
      );
      focalDot.add(focalHalo);
      group.add(focalDot);

      const rayMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.75 });
      const rayGeo = new THREE.CylinderGeometry(0.024, 0.024, 1, 8);
      const rayPairs: { inc: THREE.Mesh; ref: THREE.Mesh }[] = [];
      for (let i = 0; i < 10; i++) {
        const inc = new THREE.Mesh(rayGeo, rayMat);
        const ref = new THREE.Mesh(rayGeo, rayMat);
        group.add(inc, ref);
        rayPairs.push({ inc, ref });
      }
      const pStart = new THREE.Vector3();
      const pHit = new THREE.Vector3();
      const pFocus = new THREE.Vector3();
      const tmpDir = new THREE.Vector3();

      const lblFocus = createTroikaLabel({ text: 'Tiêu điểm F', position: [0, 0.55, 0], fontSize: 0.32, color: 0xfbbf24 });
      focalDot.add(lblFocus);
      group.add(createTroikaLabel({ text: 'Gương cầu lõm', position: [3.7, 4.1, 0], fontSize: 0.32, color: 0x7dd3fc }));

      return () => {
        const { p1: curv, p2: count } = getParams();
        dish.scale.set(curv, 1, 1);
        const fX = 3.8 - 2.4 / curv;
        focalDot.position.set(fX, 2.2, 0);
        pFocus.set(fX, 2.2, 0);
        const nShow = Math.round(count);
        rayPairs.forEach((pair, idx) => {
          const vis = idx < nShow;
          pair.inc.visible = vis;
          pair.ref.visible = vis;
          if (!vis) return;
          const yOff = ((idx - (nShow - 1) / 2) / Math.max(1, nShow / 2)) * 1.45;
          pStart.set(-4.5, 2.2 + yOff, 0);
          pHit.set(3.7, 2.2 + yOff, 0);
          orientCylinderBetween(pair.inc, pStart, pHit, tmpDir, upAxis);
          orientCylinderBetween(pair.ref, pHit, pFocus, tmpDir, upAxis);
        });
      };
    }

    // 14. POLARIZATION 3D
    case 'polarization_3d': {
      const optBench = new THREE.Mesh(
        new THREE.BoxGeometry(9.2, 0.18, 1.8),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.3 })
      );
      optBench.position.set(0, 0.09, 0);
      group.add(optBench);

      const frameMat = new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2 });
      [-1.6, 1.6].forEach((fx) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.68, 14), frameMat);
        post.position.set(fx, 0.48, 0);
        group.add(post);
      });

      const f1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.12, 32),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, clearcoat: 0.9, roughness: 0.08 })
      );
      f1.rotation.z = Math.PI / 2;
      f1.position.set(-1.6, 2.2, 0);
      const rim1 = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.07, 12, 36), frameMat);
      rim1.rotation.y = Math.PI / 2;
      rim1.position.set(-1.6, 2.2, 0);

      const f2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.12, 32),
        new THREE.MeshPhysicalMaterial({ color: 0xa855f7, transparent: true, opacity: 0.42, clearcoat: 0.9, roughness: 0.08 })
      );
      f2.rotation.z = Math.PI / 2;
      f2.position.set(1.6, 2.2, 0);
      const rim2 = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.07, 12, 36), frameMat);
      rim2.rotation.x = Math.PI / 2;
      f2.add(rim2);

      const axis2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 2.6, 0.16),
        new THREE.MeshPhysicalMaterial({ color: 0xfbbf24, metalness: 0.7, roughness: 0.2 })
      );
      f2.add(axis2);
      group.add(f1, rim1, f2);

      const wavePts = new Float32Array(80 * 3);
      const waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePts, 3));
      const waveLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: 0x34d399 }));
      group.add(
        waveLine,
        createTroikaLabel({ text: 'P₁ (0°)', position: [-1.6, 4.1, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'P₂ (I = I₀cos²θ)', position: [1.6, 4.1, 0], fontSize: 0.3, color: 0xc084fc })
      );

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
      const baseFoot = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 0.24, 4.2),
        new THREE.MeshPhysicalMaterial({ color: 0x1e293b, metalness: 0.72, roughness: 0.28 })
      );
      baseFoot.position.set(0, 0.12, 0);
      group.add(baseFoot);

      const cavityFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(4.26, 3.66, 3.66)),
        new THREE.LineBasicMaterial({ color: 0x94a3b8 })
      );
      cavityFrame.position.set(0, 2.2, 0);
      group.add(cavityFrame);

      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        emissive: 0xef4444,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.34,
        clearcoat: 0.7,
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
      });
      const cavity = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 3.6), boxMat);
      cavity.position.set(0, 2.2, 0);
      group.add(cavity, createTroikaLabel({ text: 'Hốc vật đen tuyệt đối (λ_max·T = b)', position: [0, 4.45, 0], fontSize: 0.3, color: 0xfef08a }));

      const photons: THREE.Mesh[] = [];
      const pGeo = new THREE.SphereGeometry(0.14, 14, 12);
      const pMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.95 });
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
        new THREE.CylinderGeometry(1.5, 1.5, 4.4, 40, 1, true),
        new THREE.MeshPhysicalMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.24,
          roughness: 0.06,
          clearcoat: 1.0,
          ior: 1.5,
          depthWrite: false,
          side: THREE.DoubleSide,
          clippingPlanes: clipPlanes,
        })
      );
      cyl.position.set(0, 2.3, 0);
      const topCollar = new THREE.Mesh(
        new THREE.TorusGeometry(1.52, 0.07, 12, 40),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.18 })
      );
      topCollar.rotation.x = Math.PI / 2;
      topCollar.position.set(0, 4.5, 0);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.68, 0.32, 36),
        new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, emissive: 0x9f1239, emissiveIntensity: 0.5, roughness: 0.3, clearcoat: 0.6 })
      );
      base.position.set(0, 0.16, 0);
      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(1.42, 1.42, 0.38, 36),
        new THREE.MeshPhysicalMaterial({ color: 0xcbd5e1, metalness: 0.92, roughness: 0.14, clearcoat: 0.75, clippingPlanes: clipPlanes })
      );
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 2.4, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.88, roughness: 0.15 })
      );
      rod.position.y = 1.3;
      piston.add(rod);
      group.add(
        cyl,
        topCollar,
        base,
        piston,
        createTroikaLabel({ text: 'Nguồn nóng T₁', position: [2.35, 0.45, 0], fontSize: 0.3, color: 0xfb7185 }),
        createTroikaLabel({ text: 'Piston η = 1 - T₂/T₁', position: [0, 5.2, 0], fontSize: 0.32, color: 0x7dd3fc })
      );

      const mols: THREE.Mesh[] = [];
      const mGeo = new THREE.SphereGeometry(0.12, 12, 10);
      const mMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.4 });
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
        new THREE.SphereGeometry(0.18, 18, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.75, clearcoat: 0.8 })
      );
      const fragA = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.22, metalness: 0.25, clearcoat: 0.85 })
      );
      const fragB = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.25, clearcoat: 0.85 })
      );
      const flashSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 20, 18),
        new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.35, depthWrite: false })
      );
      flashSphere.position.set(0, 2.2, 0);
      const secN1 = nIn.clone();
      const secN2 = nIn.clone();
      group.add(
        nIn,
        fragA,
        fragB,
        secN1,
        secN2,
        flashSphere,
        createTroikaLabel({ text: '²³⁵U + n⁰ → Ba + Kr + 3n⁰', position: [0, 4.15, 0], fontSize: 0.32, color: 0xfef08a })
      );

      let wasPreFission = true;

      return () => {
        const { p1: eVal, p2: spd } = getParams();
        const cyc = (getElapsed() * spd) % 3.2;
        const tHit = 1.1;
        if (cyc < tHit) {
          wasPreFission = true;
          nIn.visible = true;
          flashSphere.visible = false;
          nIn.position.set(-4.0 + (cyc / tHit) * 4.0, 2.2, 0);
          fragA.position.set(0, 2.2, 0);
          fragB.position.set(0, 2.2, 0);
          fragA.scale.setScalar(1.3);
          fragB.visible = false;
          secN1.visible = false;
          secN2.visible = false;
        } else {
          if (wasPreFission && pool) {
            wasPreFission = false;
            for (let k = 0; k < 22; k++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = (Math.random() - 0.5) * Math.PI;
              const v = 1.8 + Math.random() * 2.2;
              pool.spawn(
                0,
                2.2,
                0,
                Math.cos(theta) * Math.cos(phi) * v,
                Math.sin(phi) * v,
                Math.sin(theta) * Math.cos(phi) * v,
                0.75,
                1.05,
                k % 3 === 0 ? 0xfef08a : k % 3 === 1 ? 0x10b981 : 0xf59e0b
              );
            }
          }
          nIn.visible = false;
          fragB.visible = true;
          secN1.visible = true;
          secN2.visible = true;
          fragA.scale.setScalar(1.0);
          const dt = (cyc - tHit) * (1.5 + eVal * 0.35);
          flashSphere.visible = cyc - tHit < 0.45;
          if (flashSphere.visible) {
            const k = (cyc - tHit) / 0.45;
            flashSphere.scale.setScalar(0.8 + k * 2.2);
            (flashSphere.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
          }
          fragA.position.set(dt * 1.1, 2.2 + dt * 0.9, dt * 0.3);
          fragB.position.set(dt * 1.1, 2.2 - dt * 0.9, -dt * 0.3);
          secN1.position.set(dt * 2.4, 2.2 + dt * 1.4, -dt * 0.8);
          secN2.position.set(dt * 2.4, 2.2 - dt * 1.2, dt * 0.9);
        }
      };
    }

    // 18. RUTHERFORD SCATTERING 3D
    case 'rutherford_scattering_3d': {
      // Gold foil target translucent sheet + ring frame
      const foilSheet = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.03, 36),
        new THREE.MeshPhysicalMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.16, roughness: 0.2, metalness: 0.8, side: THREE.DoubleSide, depthWrite: false })
      );
      foilSheet.rotation.z = Math.PI / 2;
      foilSheet.position.set(0, 2.2, 0);
      const foilFrame = new THREE.Mesh(
        new THREE.TorusGeometry(2.22, 0.055, 12, 42),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 })
      );
      foilFrame.rotation.y = Math.PI / 2;
      foilFrame.position.set(0, 2.2, 0);
      group.add(foilSheet, foilFrame);

      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 28, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.78, clearcoat: 0.9 })
      );
      const nucHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 20, 18),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.22, depthWrite: false })
      );
      nucleus.add(nucHalo);
      nucleus.position.set(0, 2.2, 0);
      group.add(
        nucleus,
        createTroikaLabel({ text: 'Hạt nhân vàng Au (Z=79)', position: [0, 4.7, 0], fontSize: 0.3, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Chùm hạt α (He²⁺)', position: [-3.4, 3.6, 0], fontSize: 0.3, color: 0x38bdf8 }),
        createCrispLine2([[-4.5, 2.2, 0], [4.5, 2.2, 0]], { color: 0x475569, linewidth: 2.0, dashed: true })
      );

      const alphas: THREE.Mesh[] = [];
      const aGeo = new THREE.SphereGeometry(0.14, 16, 14);
      const aMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.8, clearcoat: 0.85 });
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
      return buildBatch2Extra3DScene(mode, group, getParams, getElapsed, ctx);
  }
}
