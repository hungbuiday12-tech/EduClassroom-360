import * as THREE from 'three';
import type { Extra3DSceneContext, Extra3DStateGetter } from './physics3DExtraScenes';
import { createTroikaLabel } from '../../lib/three3DEnhancements';

export function buildMiddleSchool3DScene(
  mode: string,
  group: THREE.Group,
  getParams: Extra3DStateGetter,
  getElapsed: () => number,
  _ctx?: Extra3DSceneContext
): ((effDt: number) => void) | null {
  switch (mode) {
    // 1. MEASUREMENT BENCH 3D (Thước – Bình chia độ – Lực kế – Nhiệt kế)
    case 'measurement_bench_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.24, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.12, 0);
      group.add(bench);

      // Left: Wooden Ruler + Measured Block
      const ruler = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.12, 0.5),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.35 })
      );
      ruler.position.set(-2.2, 0.3, 0.6);
      const sampleBlock = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.4, 0.42),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.15 })
      );
      sampleBlock.position.set(-2.6, 0.56, 0.6);
      group.add(ruler, sampleBlock);

      // Center: Graduated Cylinder with water column
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.34,
        roughness: 0.1,
        depthWrite: false
      });
      const cylWall = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.8, 24, 1, true), glassMat);
      cylWall.position.set(-0.2, 1.64, 0);
      const cylBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.78, 0.16, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 })
      );
      cylBase.position.set(-0.2, 0.32, 0);
      const waterCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.49, 0.49, 1.0, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.72, roughness: 0.15 })
      );
      waterCol.position.set(-0.2, 0.9, 0);
      const pebble = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.28, 0),
        new THREE.MeshPhysicalMaterial({ color: 0x64748b, roughness: 0.85 })
      );
      pebble.position.set(-0.2, 0.62, 0);
      group.add(cylBase, waterCol, pebble, cylWall);

      // Right: Spring Dynamometer stand + hanging weight
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.25 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.3, 14), standMat);
      pole.position.set(2.5, 1.85, -0.35);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 1.0), standMat);
      arm.position.set(2.5, 3.45, 0.1);
      const springBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 1.15, 0.26),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.25 })
      );
      springBody.position.set(2.5, 2.75, 0.5);
      const weightBox = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.55, 20),
        new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, metalness: 0.65, roughness: 0.25 })
      );
      weightBox.position.set(2.5, 1.35, 0.5);
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.0, 10),
        new THREE.MeshPhysicalMaterial({ color: 0xfacc15, metalness: 0.85 })
      );
      rod.position.set(2.5, 1.9, 0.5);
      group.add(pole, arm, springBody, rod, weightBox);

      group.add(
        createTroikaLabel({ text: 'Thước đo (cm)', position: [-2.2, 1.25, 0.6], fontSize: 0.24, color: 0xfde047 }),
        createTroikaLabel({ text: 'Bình chia độ (V₂ − V₁)', position: [-0.2, 3.3, 0], fontSize: 0.24, color: 0x38bdf8 }),
        createTroikaLabel({ text: 'Lực kế lò xo (P = 10m)', position: [2.5, 3.85, 0.3], fontSize: 0.24, color: 0xfca5a5 })
      );

      return (effDt) => {
        const { p1: lenOrVol, p2: massKg } = getParams();
        const blockScale = 0.5 + (lenOrVol / 30) * 1.4;
        sampleBlock.scale.x = THREE.MathUtils.damp(sampleBlock.scale.x, blockScale, 8, effDt);
        sampleBlock.position.x = -3.4 + sampleBlock.scale.x * 0.5;

        const wScale = 0.6 + (lenOrVol / 30) * 1.7;
        waterCol.scale.y = THREE.MathUtils.damp(waterCol.scale.y, wScale, 7, effDt);
        waterCol.position.y = 0.4 + waterCol.scale.y * 0.5;

        const drop = (massKg / 5.0) * 0.65;
        weightBox.position.y = THREE.MathUtils.damp(weightBox.position.y, 1.75 - drop, 8, effDt);
        weightBox.scale.setScalar(0.75 + massKg * 0.09);
        rod.position.y = (weightBox.position.y + 2.45) * 0.5;
      };
    }

    // 2. THERMAL EXPANSION 3D (Quả cầu – Vòng kim loại & Băng kép)
    case 'thermal_expansion_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.24, 3.4),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.12, 0);
      group.add(bench);

      // Stand + Iron ring
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.14, 3.4, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.25 })
      );
      post.position.set(-2.1, 1.82, 0);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.72, 0.08, 16, 40),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(-1.1, 1.65, 0);
      const ringArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.1, 0.12),
        new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.7 })
      );
      ringArm.position.set(-1.85, 1.65, 0);
      group.add(post, ring, ringArm);

      // Brass sphere
      const ballMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706,
        emissive: 0x991b1b,
        emissiveIntensity: 0.0,
        metalness: 0.85,
        roughness: 0.2
      });
      const brassBall = new THREE.Mesh(new THREE.SphereGeometry(0.64, 32, 24), ballMat);
      brassBall.position.set(-1.1, 2.55, 0);
      group.add(brassBall);

      // Burner flame beneath
      const burner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.42, 0.5, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.65 })
      );
      burner.position.set(-1.1, 0.48, 0);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.65, 16),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 })
      );
      flame.position.set(-1.1, 1.0, 0);
      group.add(burner, flame);

      // Right: Bimetallic strip + bell contact
      const stripClamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.6, 0.6),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.6 })
      );
      stripClamp.position.set(0.75, 1.85, 0);
      const stripPivot = new THREE.Group();
      stripPivot.position.set(0.9, 1.85, 0);
      const brassLayer = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.08, 0.45),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
      );
      brassLayer.position.set(1.05, 0.04, 0);
      const steelLayer = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.08, 0.45),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.28 })
      );
      steelLayer.position.set(1.05, -0.04, 0);
      stripPivot.add(brassLayer, steelLayer);

      const contactLed = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.4 })
      );
      contactLed.position.set(2.9, 1.1, 0);
      group.add(stripClamp, stripPivot, contactLed);

      group.add(
        createTroikaLabel({ text: 'Quả cầu đồng & Vòng sắt', position: [-1.1, 3.45, 0], fontSize: 0.24, color: 0xfde047 }),
        createTroikaLabel({ text: 'Băng kép Đồng – Thép', position: [2.0, 2.55, 0], fontSize: 0.24, color: 0x38bdf8 })
      );

      return (effDt) => {
        const { p1: tempC, p2: sens } = getParams();
        const tNorm = Math.max(0, (tempC - 20) / 160);
        const expandScale = 1 + tNorm * 0.24;
        brassBall.scale.setScalar(THREE.MathUtils.damp(brassBall.scale.x, expandScale, 6, effDt));
        ballMat.emissiveIntensity = tNorm * 0.75;

        const passesRing = tempC < 75;
        const t = getElapsed();
        const targetY = passesRing ? 1.65 + Math.sin(t * 2.2) * 0.65 : 2.34;
        brassBall.position.y = THREE.MathUtils.damp(brassBall.position.y, targetY, 6, effDt);
        flame.scale.setScalar(0.5 + tNorm * 0.9 + Math.sin(t * 14) * 0.08);

        const bendAngle = -tNorm * 0.36 * sens;
        stripPivot.rotation.z = THREE.MathUtils.damp(stripPivot.rotation.z, bendAngle, 6, effDt);
        const closed = bendAngle < -0.24;
        (contactLed.material as THREE.MeshStandardMaterial).color.setHex(closed ? 0x10b981 : 0xef4444);
        (contactLed.material as THREE.MeshStandardMaterial).emissive.setHex(closed ? 0x059669 : 0x7f1d1d);
      };
    }

    // 3. PLANE MIRROR 3D (Gương phẳng · Tia tới / Tia phản xạ & Ảnh ảo)
    case 'plane_mirror_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.22, 4.6),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.75, metalness: 0.2 })
      );
      bench.position.set(0, 0.11, 0);
      group.add(bench);

      // Mirror stand on X = 0
      const mirrorGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 2.7, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, metalness: 0.92, roughness: 0.06, clearcoat: 1.0 })
      );
      mirrorGlass.position.set(0, 1.57, 0);
      const mirrorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.26, 3.8),
        new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
      );
      mirrorFrame.position.set(0, 0.32, 0);
      group.add(mirrorGlass, mirrorFrame);

      // Normal line at Z = 0, Y = 1.4
      const normalBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 4.6, 10),
        new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
      );
      normalBar.rotation.z = Math.PI / 2;
      normalBar.position.set(0, 1.4, 0);
      group.add(normalBar);

      // Incident & Reflected laser beams
      const incBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1, 12),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      const refBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 1, 12),
        new THREE.MeshBasicMaterial({ color: 0x10b981 })
      );
      group.add(incBeam, refBeam);

      // Real candle object (-X) & Virtual Ghost candle (+X)
      const makeCandle = (isVirtual: boolean) => {
        const g = new THREE.Group();
        const wax = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.2, 1.1, 18),
          new THREE.MeshPhysicalMaterial({
            color: isVirtual ? 0xa855f7 : 0x38bdf8,
            transparent: isVirtual,
            opacity: isVirtual ? 0.45 : 0.95,
            roughness: 0.35
          })
        );
        wax.position.y = 0.55;
        const tip = new THREE.Mesh(
          new THREE.ConeGeometry(0.11, 0.35, 14),
          new THREE.MeshBasicMaterial({ color: isVirtual ? 0xc084fc : 0xfacc15, transparent: isVirtual, opacity: isVirtual ? 0.6 : 1 })
        );
        tip.position.y = 1.28;
        g.add(wax, tip);
        return g;
      };
      const realObj = makeCandle(false);
      realObj.position.set(-1.6, 0.22, -0.8);
      const virtObj = makeCandle(true);
      virtObj.position.set(1.6, 0.22, -0.8);
      group.add(realObj, virtObj);

      group.add(
        createTroikaLabel({ text: 'Gương phẳng', position: [0, 3.15, 0], fontSize: 0.26, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Vật sáng AB', position: [-1.8, 1.9, -0.8], fontSize: 0.22, color: 0x38bdf8 }),
        createTroikaLabel({ text: "Ảnh ảo A'B'", position: [1.8, 1.9, -0.8], fontSize: 0.22, color: 0xd8b4fe })
      );

      const up = new THREE.Vector3(0, 1, 0);
      const tmp = new THREE.Vector3();
      const setSeg = (mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) => {
        tmp.subVectors(b, a);
        const len = tmp.length();
        mesh.position.copy(a).addScaledVector(tmp, 0.5);
        mesh.quaternion.setFromUnitVectors(up, tmp.divideScalar(len));
        mesh.scale.set(1, len, 1);
      };

      return (effDt) => {
        const { p1: angleDeg, p2: dist } = getParams();
        const rad = (angleDeg * Math.PI) / 180;
        const hit = new THREE.Vector3(-0.08, 1.4, 0);
        const src = new THREE.Vector3(-0.08 - Math.cos(rad) * 2.6, 1.4, -Math.sin(rad) * 2.6);
        const dst = new THREE.Vector3(-0.08 - Math.cos(rad) * 2.6, 1.4, Math.sin(rad) * 2.6);
        setSeg(incBeam, src, hit);
        setSeg(refBeam, hit, dst);

        realObj.position.x = THREE.MathUtils.damp(realObj.position.x, -dist, 8, effDt);
        virtObj.position.x = THREE.MathUtils.damp(virtObj.position.x, dist, 8, effDt);
      };
    }

    // 4. LEVER & PULLEY 3D (Đòn bẩy Moment lực + Ròng rọc động)
    case 'lever_pulley_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.8, 0.24, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.12, 0);
      group.add(bench);

      // Left/Center: Lever Fulcrum & Tilting Beam
      const fulcrum = new THREE.Mesh(
        new THREE.ConeGeometry(0.42, 1.35, 3),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.65, roughness: 0.28 })
      );
      fulcrum.position.set(-1.3, 0.9, 0);
      const beamGroup = new THREE.Group();
      beamGroup.position.set(-1.3, 1.62, 0);
      const beamBar = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.14, 0.28),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
      );
      const loadLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 0.55),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.35 })
      );
      loadLeft.position.set(-1.0, 0.35, 0);
      const pullRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.45, 20),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, metalness: 0.55, roughness: 0.25 })
      );
      pullRight.position.set(1.8, 0.3, 0);
      beamGroup.add(beamBar, loadLeft, pullRight);
      group.add(fulcrum, beamGroup);

      // Right: Movable Pulley Gantry
      const gantryPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.11, 3.5, 14),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.25 })
      );
      gantryPost.position.set(2.55, 1.95, -0.45);
      const gantryBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.14, 0.2),
        new THREE.MeshPhysicalMaterial({ color: 0x475569, metalness: 0.75 })
      );
      gantryBar.position.set(2.55, 3.65, 0);
      const pulleyWheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.16, 26),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.2 })
      );
      pulleyWheel.rotation.x = Math.PI / 2;
      pulleyWheel.position.set(2.55, 1.9, 0);
      const pulleyWeight = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.56, 0.56),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.3 })
      );
      pulleyWeight.position.set(2.55, 1.15, 0);
      group.add(gantryPost, gantryBar, pulleyWheel, pulleyWeight);

      group.add(
        createTroikaLabel({ text: 'Đòn bẩy (F₁·d₁ = F₂·d₂)', position: [-1.3, 2.75, 0], fontSize: 0.25, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Ròng rọc động (F = P/2)', position: [2.55, 4.05, 0], fontSize: 0.24, color: 0x34d399 })
      );

      return (effDt) => {
        const { p1: d1, p2: weightN } = getParams();
        const t = getElapsed();
        pullRight.position.x = THREE.MathUtils.damp(pullRight.position.x, Math.min(1.95, d1 * 0.7), 8, effDt);
        loadLeft.scale.setScalar(0.75 + (weightN / 120) * 0.65);
        beamGroup.rotation.z = Math.sin(t * 1.4) * 0.08;

        const lift = 0.28 * Math.sin(t * 1.6);
        pulleyWheel.position.y = 2.0 + lift;
        pulleyWheel.rotation.z -= effDt * Math.cos(t * 1.6) * 2.2;
        pulleyWeight.position.y = 1.2 + lift;
      };
    }

    // 5. HYDRAULIC PRESS 3D (Bình thông nhau & Máy ép Pascal)
    case 'hydraulic_press_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.24, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.12, 0);
      group.add(bench);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.34,
        roughness: 0.1,
        depthWrite: false
      });
      const oilMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.74,
        roughness: 0.15
      });

      // Connecting base pipe
      const pipe = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.48, 0.9), glassMat);
      pipe.position.set(0, 0.48, 0);
      const oilPipe = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.38, 0.8), oilMat);
      oilPipe.position.set(0, 0.48, 0);
      group.add(oilPipe, pipe);

      // Left small cylinder (S1)
      const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.5, 24, 1, true), glassMat);
      cyl1.position.set(-1.6, 1.72, 0);
      const oil1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 22), oilMat);
      oil1.position.set(-1.6, 1.25, 0);
      const piston1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.41, 0.41, 0.24, 22),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
      );
      piston1.position.set(-1.6, 2.05, 0);
      group.add(oil1, cyl1, piston1);

      // Right large cylinder (S2)
      const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 2.5, 28, 1, true), glassMat);
      cyl2.position.set(1.2, 1.72, 0);
      const oil2 = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 1.5, 26), oilMat);
      oil2.position.set(1.2, 1.25, 0);
      const piston2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.09, 1.09, 0.28, 26),
        new THREE.MeshPhysicalMaterial({ color: 0x10b981, metalness: 0.85, roughness: 0.2 })
      );
      piston2.position.set(1.2, 2.05, 0);
      const carLoad = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.72, 1.0),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.35 })
      );
      carLoad.position.set(1.2, 2.55, 0);
      group.add(oil2, cyl2, piston2, carLoad);

      group.add(
        createTroikaLabel({ text: 'Pít-tông nhỏ (S₁, f)', position: [-1.6, 3.25, 0], fontSize: 0.24, color: 0xfde047 }),
        createTroikaLabel({ text: 'Pít-tông lớn (S₂, F)', position: [1.2, 3.55, 0], fontSize: 0.25, color: 0x34d399 })
      );

      return (effDt) => {
        const { p1: fPress, p2: areaRatio } = getParams();
        const t = getElapsed();
        const stroke = (0.35 + 0.35 * Math.sin(t * 2.0)) * (fPress / 100);
        const h1 = 1.6 - stroke * 0.75;
        const h2 = 1.45 + (stroke * 0.75) / Math.max(2, areaRatio);

        oil1.scale.y = THREE.MathUtils.damp(oil1.scale.y, h1 / 1.5, 8, effDt);
        oil1.position.y = 0.5 + oil1.scale.y * 0.75;
        piston1.position.y = 0.5 + oil1.scale.y * 1.5 + 0.12;

        const rScale = 0.72 + (areaRatio / 10) * 0.55;
        cyl2.scale.x = cyl2.scale.z = oil2.scale.x = oil2.scale.z = piston2.scale.x = piston2.scale.z = THREE.MathUtils.damp(cyl2.scale.x, rScale, 6, effDt);

        oil2.scale.y = THREE.MathUtils.damp(oil2.scale.y, h2 / 1.5, 8, effDt);
        oil2.position.y = 0.5 + oil2.scale.y * 0.75;
        piston2.position.y = 0.5 + oil2.scale.y * 1.5 + 0.14;
        carLoad.position.y = piston2.position.y + 0.5;
      };
    }

    // 6. HOOKE FORCES & FRICTION 3D (Lực kế lò xo & Khối trượt có ma sát)
    case 'hooke_forces_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.0, 0.24, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.12, 0);
      group.add(bench);

      // Left: Vertical dynamometer gantry + coil spring + hanging mass
      const standMat = new THREE.MeshPhysicalMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.6, 16), standMat);
      post.position.set(-2.0, 2.0, -0.5);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.12), standMat);
      arm.position.set(-1.55, 3.75, -0.25);
      group.add(post, arm);

      const springMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
      const springPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 72; i++) {
        const u = i / 72;
        const a = u * Math.PI * 2 * 6;
        springPts.push(new THREE.Vector3(Math.cos(a) * 0.16, -u * 1.0, Math.sin(a) * 0.16));
      }
      const springCoil = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(springPts), 64, 0.032, 8, false),
        springMat
      );
      springCoil.position.set(-1.25, 3.68, 0);
      const hangBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.65, 0.65),
        new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.25 })
      );
      hangBox.position.set(-1.25, 2.2, 0);
      group.add(springCoil, hangBox);

      // Right: Wooden/Ice friction ramp & sliding block
      const track = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.16, 1.3),
        new THREE.MeshPhysicalMaterial({ color: 0x78350f, roughness: 0.75 })
      );
      track.position.set(1.65, 0.32, 0);
      const slideBlock = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.55, 0.75),
        new THREE.MeshPhysicalMaterial({ color: 0x6366f1, roughness: 0.35 })
      );
      slideBlock.position.set(1.65, 0.68, 0);
      group.add(track, slideBlock);

      group.add(
        createTroikaLabel({ text: 'Lực kế lò xo (P = 10m)', position: [-1.25, 4.15, 0], fontSize: 0.24, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Lực ma sát trượt F_ms', position: [1.65, 1.75, 0], fontSize: 0.24, color: 0xfda4af })
      );

      return (effDt) => {
        const { p1: massKg, p2: muVal } = getParams();
        const t = getElapsed();
        const stretch = 0.75 + (massKg / 5.0) * 1.15;
        springCoil.scale.y = THREE.MathUtils.damp(springCoil.scale.y, stretch, 8, effDt);
        hangBox.scale.setScalar(0.72 + (massKg / 5.0) * 0.52);
        hangBox.position.y = 3.68 - springCoil.scale.y - 0.32 * hangBox.scale.y;

        const ampSlide = Math.max(0.18, 1.0 - muVal * 1.4);
        slideBlock.position.x = 1.65 + Math.sin(t * 1.8) * ampSlide;
      };
    }

    // 7. SHADOW & ECLIPSE 3D (Truyền thẳng ánh sáng, Bóng tối – Nửa tối, Nhật thực – Nguyệt thực)
    case 'shadow_eclipse_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.22, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x090e1c, roughness: 0.8 })
      );
      bench.position.set(0, 0.11, 0);
      group.add(bench);

      const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.9 })
      );
      sunSphere.position.set(-2.8, 1.65, 0);

      const obstacleSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 24, 24),
        new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.45 })
      );
      obstacleSphere.position.set(0, 1.65, 0);

      const screenPlane = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 2.7, 2.5),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 })
      );
      screenPlane.position.set(2.95, 1.65, 0);

      const umbraSpot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.04, 24),
        new THREE.MeshBasicMaterial({ color: 0x020617 })
      );
      umbraSpot.rotation.z = Math.PI / 2;
      umbraSpot.position.set(2.86, 1.65, 0);

      const penumbraRing = new THREE.Mesh(
        new THREE.RingGeometry(0.48, 0.95, 28),
        new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
      );
      penumbraRing.rotation.y = Math.PI / 2;
      penumbraRing.position.set(2.85, 1.65, 0);

      const rayCone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 1.25, 5.7, 24, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
      );
      rayCone.rotation.z = Math.PI / 2;
      rayCone.position.set(0.05, 1.65, 0);

      group.add(sunSphere, obstacleSphere, screenPlane, umbraSpot, penumbraRing, rayCone);
      group.add(
        createTroikaLabel({ text: 'Nguồn sáng (Mặt Trời)', position: [-2.8, 2.65, 0], fontSize: 0.23, color: 0xfde047 }),
        createTroikaLabel({ text: 'Vật cản sáng', position: [0, 2.5, 0], fontSize: 0.23, color: 0x7dd3fc }),
        createTroikaLabel({ text: 'Vùng Bóng tối & Nửa tối', position: [2.75, 3.25, 0], fontSize: 0.23, color: 0xf8fafc })
      );

      return (effDt) => {
        const { p1: objOffset, p2: sunScale } = getParams();
        obstacleSphere.position.x = THREE.MathUtils.damp(obstacleSphere.position.x, objOffset, 8, effDt);
        sunSphere.scale.setScalar(0.65 + sunScale * 0.45);
        const distRatio = Math.max(0.3, (2.95 - obstacleSphere.position.x) / 3.0);
        const uSize = Math.max(0.15, 1.25 - sunScale * 0.45 - distRatio * 0.25);
        umbraSpot.scale.set(uSize, 1, uSize);
        penumbraRing.scale.setScalar(0.8 + distRatio * 0.45);
      };
    }

    // 8. MAGNET & COMPASS 3D (Nam châm, Đường sức từ không gian & Kim la bàn)
    case 'magnet_compass_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.22, 3.6),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.11, 0);
      group.add(bench);

      const magN = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.45, 0.6),
        new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.35 })
      );
      magN.position.set(-0.7, 0.85, 0);
      const magS = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.45, 0.6),
        new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.35 })
      );
      magS.position.set(0.7, 0.85, 0);
      group.add(magN, magS);

      // 3D magnetic field loops around the bar magnet
      const loopMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 });
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((rotX) => {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.025, 8, 36, Math.PI), loopMat);
        torus.position.set(0, 0.85, 0);
        torus.rotation.x = rotX;
        group.add(torus);
      });

      // Compass needles arranged around magnet
      const compassGroup = new THREE.Group();
      const needleGeo = new THREE.ConeGeometry(0.11, 0.42, 8);
      const needles: { g: THREE.Group; baseYaw: number }[] = [];
      const spots: [number, number, number][] = [
        [0, 1.45, 0],
        [0, -1.45, 0],
        [-2.3, 0, Math.PI],
        [2.3, 0, Math.PI]
      ];
      spots.forEach(([sx, sz, yaw]) => {
        const ng = new THREE.Group();
        ng.position.set(sx, 0.55, sz);
        const nTip = new THREE.Mesh(needleGeo, new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        nTip.rotation.z = -Math.PI / 2;
        nTip.position.x = 0.21;
        const sTip = new THREE.Mesh(needleGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        sTip.rotation.z = Math.PI / 2;
        sTip.position.x = -0.21;
        ng.add(nTip, sTip);
        compassGroup.add(ng);
        needles.push({ g: ng, baseYaw: yaw });
      });
      group.add(compassGroup);

      group.add(
        createTroikaLabel({ text: 'Cực Bắc (N)', position: [-0.9, 1.55, 0], fontSize: 0.24, color: 0xfca5a5 }),
        createTroikaLabel({ text: 'Cực Nam (S)', position: [0.9, 1.55, 0], fontSize: 0.24, color: 0x93c5fd }),
        createTroikaLabel({ text: 'Kim La Bàn & Từ Phổ 3D', position: [0, 2.55, 0], fontSize: 0.25, color: 0x7dd3fc })
      );

      return (effDt) => {
        const { p1: flip, p2: strength } = getParams();
        const t = getElapsed();
        const flipped = flip < 0;
        magN.position.x = flipped ? 0.7 : -0.7;
        magS.position.x = flipped ? -0.7 : 0.7;
        needles.forEach((n, idx) => {
          const targetYaw = n.baseYaw + (flipped ? Math.PI : 0) + Math.sin(t * 2 + idx) * (0.08 / Math.max(0.4, strength));
          n.g.rotation.y = THREE.MathUtils.damp(n.g.rotation.y, targetYaw, 6, effDt);
        });
      };
    }

    // 9. ELECTROMAGNET & ELECTRIC BELL 3D (Nam châm điện & Chuông điện)
    case 'electromagnet_bell_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.22, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.11, 0);
      group.add(bench);

      // Solenoid coil + Iron core
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 1.9, 18),
        new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 })
      );
      core.rotation.z = Math.PI / 2;
      core.position.set(-0.6, 1.45, 0);
      const coil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 1.4, 24),
        new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.65, roughness: 0.25 })
      );
      coil.rotation.z = Math.PI / 2;
      coil.position.set(-0.6, 1.45, 0);

      // Armature hammer & brass gong bell
      const hammerArm = new THREE.Group();
      hammerArm.position.set(0.85, 0.45, 0);
      const armRod = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 1.55, 0.08),
        new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.8 })
      );
      armRod.position.y = 0.78;
      const striker = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, roughness: 0.25 })
      );
      striker.position.set(0, 1.55, 0);
      hammerArm.add(armRod, striker);

      const gong = new THREE.Mesh(
        new THREE.SphereGeometry(0.75, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
        new THREE.MeshPhysicalMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.18, side: THREE.DoubleSide })
      );
      gong.rotation.z = -Math.PI / 2;
      gong.position.set(2.0, 1.95, 0);

      group.add(core, coil, hammerArm, gong);
      group.add(
        createTroikaLabel({ text: 'Cuộn dây lõi sắt (Nam châm điện)', position: [-0.7, 2.3, 0], fontSize: 0.23, color: 0xfbbf24 }),
        createTroikaLabel({ text: 'Chuông điện rung liên hồi', position: [1.85, 2.95, 0], fontSize: 0.23, color: 0xfde047 })
      );

      return (effDt) => {
        const { p1: currentA, p2: turns } = getParams();
        const t = getElapsed();
        const power = (currentA * turns) / 150;
        const targetRot = currentA > 0.2 ? Math.sin(t * (10 + power * 8)) * 0.28 : 0.15;
        hammerArm.rotation.z = THREE.MathUtils.damp(hammerArm.rotation.z, targetRot, 14, effDt);
        gong.scale.setScalar(1 + Math.abs(Math.sin(t * 20)) * (currentA > 0.2 ? 0.03 : 0));
      };
    }

    // 10. HEAT TRANSFER 3D (Dẫn nhiệt – Đối lưu – Bức xạ nhiệt)
    case 'heat_transfer_3d': {
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.22, 3.2),
        new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.72, metalness: 0.2 })
      );
      bench.position.set(0, 0.11, 0);
      group.add(bench);

      // Left: Conduction copper bar with glowing heat gradient
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.22, 0.26),
        new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.25 })
      );
      bar.position.set(-1.75, 1.55, 0);
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.55, 14),
        new THREE.MeshBasicMaterial({ color: 0xf97316 })
      );
      flame.position.set(-2.75, 1.05, 0);
      group.add(bar, flame);

      // Right: Convection glass beaker + circulating thermal spheres
      const glassBeaker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.95, 0.95, 1.9, 24, 1, true),
        new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.34, depthWrite: false })
      );
      glassBeaker.position.set(1.5, 1.35, 0);
      const waterCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.88, 0.88, 1.5, 22),
        new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.42 })
      );
      waterCyl.position.set(1.5, 1.15, 0);
      group.add(waterCyl, glassBeaker);

      const convDots: THREE.Mesh[] = [];
      for (let i = 0; i < 10; i++) {
        const d = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 10, 10),
          new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xef4444 : 0x38bdf8 })
        );
        convDots.push(d);
        group.add(d);
      }

      group.add(
        createTroikaLabel({ text: 'Dẫn nhiệt (Thanh kim loại)', position: [-1.75, 2.3, 0], fontSize: 0.23, color: 0xfdba74 }),
        createTroikaLabel({ text: 'Đối lưu chất lỏng 3D', position: [1.5, 2.65, 0], fontSize: 0.23, color: 0x7dd3fc })
      );

      return () => {
        const { p1: heatPct, p2: modeVal } = getParams();
        const t = getElapsed();
        const rate = 0.6 + (heatPct / 100) * 1.8;
        flame.scale.setScalar(0.75 + (heatPct / 100) * 0.55 + Math.sin(t * 10) * 0.06);
        convDots.forEach((dot, idx) => {
          const ang = t * rate + (idx / convDots.length) * Math.PI * 2;
          const side = idx % 2 === 0 ? 1 : -1;
          dot.position.set(
            1.5 + side * Math.sin(ang) * 0.58,
            1.15 - Math.cos(ang) * 0.58,
            Math.sin(ang * 2 + idx) * 0.25
          );
          (dot.material as THREE.MeshBasicMaterial).color.setHex(
            Math.cos(ang) > 0 ? 0x38bdf8 : modeVal >= 2.5 ? 0xfacc15 : 0xef4444
          );
        });
      };
    }

    default:
      return null;
  }
}
