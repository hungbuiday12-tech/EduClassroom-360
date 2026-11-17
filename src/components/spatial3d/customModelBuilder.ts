import * as THREE from 'three';
import { BuilderMaterials, DynamicModelRef, ExplodablePart } from './advancedModels3D';
import { CustomModelAnimSpec, CustomModelPartSpec, CustomSpatialModel } from './customModelTypes';

export interface CustomAnimatedPartEntry {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  baseScale: [number, number, number];
  baseRot: [number, number, number];
  anim: CustomModelAnimSpec;
}

function createPrimitiveGeometry(kind: CustomModelPartSpec['primitive']): THREE.BufferGeometry {
  switch (kind) {
    case 'sphere':
      return new THREE.SphereGeometry(0.55, 28, 22);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.45, 0.45, 1.1, 32);
    case 'cone':
      return new THREE.ConeGeometry(0.55, 1.15, 32);
    case 'torus':
      return new THREE.TorusGeometry(0.58, 0.16, 16, 40);
    case 'octahedron':
      return new THREE.OctahedronGeometry(0.62, 0);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(0.58, 0);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(0.58, 0);
    case 'ring':
      return new THREE.TorusGeometry(0.75, 0.055, 14, 44);
    case 'capsule':
      return new THREE.CapsuleGeometry(0.32, 0.72, 10, 20);
    case 'prism':
      return new THREE.CylinderGeometry(0.52, 0.52, 1.05, 6);
    case 'box':
    default:
      return new THREE.BoxGeometry(0.95, 0.95, 0.95);
  }
}

function resolveMaterialForPart(
  part: CustomModelPartSpec,
  mats: BuilderMaterials,
  finishMode: string,
  clipPlane: THREE.Plane,
  trackMat: <T extends THREE.Material>(m: T) => T
): THREE.Material {
  if (part.customHex && /^#[0-9a-fA-F]{6}$/.test(part.customHex) && finishMode === 'ceramic') {
    const colorNum = parseInt(part.customHex.slice(1), 16);
    return trackMat(
      new THREE.MeshStandardMaterial({
        color: colorNum,
        metalness: part.colorRole === 'secondary' ? 0.42 : 0.25,
        roughness: part.colorRole === 'glow' ? 0.22 : 0.44,
        emissive: colorNum,
        emissiveIntensity: part.colorRole === 'glow' ? 0.65 : 0.1,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }
  switch (part.colorRole) {
    case 'secondary':
      return mats.secondary;
    case 'highlight':
      return mats.highlight;
    case 'glow':
      return mats.glow;
    case 'primary':
    default:
      return mats.primary;
  }
}

export function buildCustomSpatialModel(
  spec: CustomSpatialModel,
  mats: BuilderMaterials,
  finishMode: string,
  clipPlane: THREE.Plane,
  softwareGl: boolean
): DynamicModelRef {
  const group = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [mats.primary, mats.secondary, mats.highlight, mats.edge, mats.glow];
  const customAnimatedParts: CustomAnimatedPartEntry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const parts = Array.isArray(spec.parts) ? spec.parts : [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const geo = trackGeo(createPrimitiveGeometry(p.primitive || 'box'));
    const mat = resolveMaterialForPart(p, mats, finishMode, clipPlane, trackMat);
    const mesh = new THREE.Mesh(geo, mat);

    const px = Number.isFinite(p.pos?.[0]) ? THREE.MathUtils.clamp(p.pos[0], -3.6, 3.6) : 0;
    const py = Number.isFinite(p.pos?.[1]) ? THREE.MathUtils.clamp(p.pos[1], 0.2, 4.2) : 1.5;
    const pz = Number.isFinite(p.pos?.[2]) ? THREE.MathUtils.clamp(p.pos[2], -3.6, 3.6) : 0;
    mesh.position.set(px, py, pz);

    const rx = Number.isFinite(p.rot?.[0]) ? p.rot[0] : 0;
    const ry = Number.isFinite(p.rot?.[1]) ? p.rot[1] : 0;
    const rz = Number.isFinite(p.rot?.[2]) ? p.rot[2] : 0;
    mesh.rotation.set(rx, ry, rz);

    const sx = Number.isFinite(p.scale?.[0]) ? THREE.MathUtils.clamp(p.scale[0], 0.12, 3.6) : 1;
    const sy = Number.isFinite(p.scale?.[1]) ? THREE.MathUtils.clamp(p.scale[1], 0.12, 3.6) : 1;
    const sz = Number.isFinite(p.scale?.[2]) ? THREE.MathUtils.clamp(p.scale[2], 0.12, 3.6) : 1;
    mesh.scale.set(sx, sy, sz);

    mesh.castShadow = !softwareGl;
    mesh.receiveShadow = !softwareGl;

    if (p.addEdges && !softwareGl && p.primitive !== 'sphere' && p.primitive !== 'torus' && p.primitive !== 'ring') {
      const edges = trackGeo(new THREE.EdgesGeometry(geo, 22));
      mesh.add(new THREE.LineSegments(edges, mats.edge));
    }

    group.add(mesh);

    const ex = Number.isFinite(p.explodeDir?.[0]) ? THREE.MathUtils.clamp(p.explodeDir[0], -2.2, 2.2) : 0;
    const ey = Number.isFinite(p.explodeDir?.[1]) ? THREE.MathUtils.clamp(p.explodeDir[1], -1.6, 2.2) : 0.4;
    const ez = Number.isFinite(p.explodeDir?.[2]) ? THREE.MathUtils.clamp(p.explodeDir[2], -2.2, 2.2) : 0;

    explodables.push({
      mesh,
      basePos: mesh.position.clone(),
      explodeDir: new THREE.Vector3(ex, ey, ez),
      info: {
        id: p.id || `custom_part_${i + 1}`,
        nameVi: p.nameVi || `Bộ phận ${i + 1}`,
        nameEn: p.nameEn || `Part ${i + 1}`,
        badgeVi: p.badgeVi || 'CẤU KIỆN',
        badgeEn: p.badgeEn || 'MODULE',
        introVi: p.introVi || 'Bộ phận cấu thành do Syn AI tổng hợp từ ý tưởng của bạn.',
        introEn: p.introEn || 'Structural module synthesized by Syn AI from your concept.',
        functionVi: p.functionVi || 'Tham gia liên kết, vận hành hoặc truyền năng lượng trong mô hình tổng thể.',
        functionEn: p.functionEn || 'Contributes to structural integrity and kinematics of the assembly.',
        specFormula: p.specFormula
      }
    });

    if (p.anim && p.anim.type && p.anim.type !== 'none') {
      customAnimatedParts.push({
        mesh,
        basePos: mesh.position.clone(),
        baseScale: [sx, sy, sz],
        baseRot: [rx, ry, rz],
        anim: {
          type: p.anim.type,
          speed: Number.isFinite(p.anim.speed) ? THREE.MathUtils.clamp(p.anim.speed, 0.1, 6.0) : 1.2,
          amplitude: Number.isFinite(p.anim.amplitude) ? THREE.MathUtils.clamp(p.anim.amplitude, 0.04, 1.2) : 0.25
        }
      });
    }
  }

  return {
    group,
    explodables,
    customAnimatedParts,
    disposables: { geometries, materials }
  };
}

export function updateCustomModelKinematics(
  model: DynamicModelRef,
  dt: number,
  elapsed: number,
  simSpeed: number,
  heightVal: number,
  frozen: boolean,
  isExplodedOrIsolated: boolean
) {
  if (frozen || !model.customAnimatedParts || model.customAnimatedParts.length === 0) return;

  const spdMul = Math.max(0.1, simSpeed) * (0.7 + heightVal * 0.45);
  for (const entry of model.customAnimatedParts) {
    const { mesh, baseScale, baseRot, anim } = entry;
    const s = anim.speed * spdMul;
    switch (anim.type) {
      case 'spin_y':
        mesh.rotation.y += dt * s * 1.4;
        break;
      case 'spin_x':
        mesh.rotation.x += dt * s * 1.4;
        break;
      case 'spin_z':
        mesh.rotation.z += dt * s * 1.4;
        break;
      case 'pulse': {
        const factor = 1 + Math.sin(elapsed * s * 2.4) * Math.min(0.28, anim.amplitude * 0.45);
        mesh.scale.set(baseScale[0] * factor, baseScale[1] * factor, baseScale[2] * factor);
        break;
      }
      case 'bob_y':
        if (!isExplodedOrIsolated) {
          mesh.position.y = entry.basePos.y + Math.sin(elapsed * s * 2.0) * anim.amplitude * 0.35;
        }
        break;
      case 'orbit_y':
        mesh.rotation.y = baseRot[1] + elapsed * s * 0.9;
        break;
      default:
        break;
    }
  }
}
