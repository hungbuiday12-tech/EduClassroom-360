import * as THREE from 'three';
import { BuilderMaterials, DynamicModelRef, ExplodablePart } from './advancedModels3D';
import {
  CustomModelAnimSpec,
  CustomModelDetailStyle,
  CustomModelMaterialKind,
  CustomModelPartSpec,
  CustomSpatialModel
} from './customModelTypes';

export interface CustomAnimatedPartEntry {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  baseScale: [number, number, number];
  baseRot: [number, number, number];
  anim: CustomModelAnimSpec;
}

function createBrushedRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const shade = 104 + Math.floor(((Math.sin(y * 1.7) + Math.cos(y * 0.43)) * 0.5 + 1) * 28);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 256, 1);
    }
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 180; i++) {
      const y = (i * 19) % 256;
      const x = (i * 47) % 256;
      const w = 24 + (i % 64);
      ctx.fillStyle = i % 2 === 0 ? '#b8b8b8' : '#585858';
      ctx.fillRect(x, y, w, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.needsUpdate = true;
  return tex;
}

function createMicroPanelBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#929292';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#484848';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 112, 112);
    ctx.strokeRect(136, 8, 112, 112);
    ctx.strokeRect(8, 136, 112, 112);
    ctx.strokeRect(136, 136, 112, 112);
    ctx.fillStyle = '#c8c8c8';
    [20, 108, 148, 236].forEach((cx) => {
      [20, 108, 148, 236].forEach((cy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.needsUpdate = true;
  return tex;
}

function createRoundedBoxGeometry(softwareGl: boolean): THREE.BufferGeometry {
  const w = 0.84;
  const h = 0.84;
  const r = 0.14;
  const hw = w / 2;
  const hh = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.72,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: softwareGl ? 1 : 3,
    curveSegments: softwareGl ? 4 : 10
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createExtrudeFinGeometry(softwareGl: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.48, -0.52);
  shape.lineTo(0.46, -0.52);
  shape.quadraticCurveTo(0.38, 0.05, 0.12, 0.52);
  shape.lineTo(-0.34, 0.52);
  shape.quadraticCurveTo(-0.48, 0.0, -0.48, -0.52);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: softwareGl ? 1 : 2,
    curveSegments: softwareGl ? 5 : 10
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createLatheGeometry(kind: 'lathe_vase' | 'lathe_dome' | 'lathe_nozzle', softwareGl: boolean): THREE.BufferGeometry {
  const segs = softwareGl ? 24 : 44;
  let pts: THREE.Vector2[];
  if (kind === 'lathe_vase') {
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.0, -0.55),
      new THREE.Vector2(0.32, -0.55),
      new THREE.Vector2(0.46, -0.22),
      new THREE.Vector2(0.38, 0.12),
      new THREE.Vector2(0.24, 0.36),
      new THREE.Vector2(0.32, 0.54),
      new THREE.Vector2(0.27, 0.56)
    ]);
    pts = curve.getPoints(softwareGl ? 14 : 26);
  } else if (kind === 'lathe_dome') {
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.54, -0.45),
      new THREE.Vector2(0.54, -0.18),
      new THREE.Vector2(0.48, 0.14),
      new THREE.Vector2(0.32, 0.38),
      new THREE.Vector2(0.12, 0.5),
      new THREE.Vector2(0.0, 0.52)
    ]);
    pts = curve.getPoints(softwareGl ? 12 : 22);
  } else {
    // lathe_nozzle: stepped aerospace bell / optical barrel
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.28, 0.55),
      new THREE.Vector2(0.32, 0.34),
      new THREE.Vector2(0.22, 0.08),
      new THREE.Vector2(0.36, -0.22),
      new THREE.Vector2(0.52, -0.52),
      new THREE.Vector2(0.46, -0.55)
    ]);
    pts = curve.getPoints(softwareGl ? 12 : 22);
  }
  const geo = new THREE.LatheGeometry(pts, segs);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createTubeArchGeometry(softwareGl: boolean): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.48, -0.42, 0),
    new THREE.Vector3(-0.42, 0.28, 0),
    new THREE.Vector3(0, 0.48, 0),
    new THREE.Vector3(0.42, 0.28, 0),
    new THREE.Vector3(0.48, -0.42, 0)
  ]);
  const geo = new THREE.TubeGeometry(curve, softwareGl ? 20 : 38, 0.11, softwareGl ? 10 : 16, false);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createPrimitiveGeometry(
  kind: CustomModelPartSpec['primitive'],
  softwareGl: boolean
): THREE.BufferGeometry {
  const high = !softwareGl;
  switch (kind) {
    case 'sphere':
      return new THREE.SphereGeometry(0.54, high ? 40 : 22, high ? 28 : 16);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.45, 0.45, 1.08, high ? 44 : 24);
    case 'cone':
      return new THREE.ConeGeometry(0.54, 1.12, high ? 44 : 24);
    case 'torus':
      return new THREE.TorusGeometry(0.56, 0.15, high ? 22 : 12, high ? 56 : 32);
    case 'octahedron':
      return new THREE.OctahedronGeometry(0.6, 0);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(0.56, 0);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(0.56, 0);
    case 'ring':
      return new THREE.TorusGeometry(0.72, 0.055, high ? 18 : 10, high ? 56 : 32);
    case 'capsule':
      return new THREE.CapsuleGeometry(0.32, 0.68, high ? 14 : 8, high ? 28 : 16);
    case 'prism':
      return new THREE.CylinderGeometry(0.5, 0.5, 1.02, 6);
    case 'rounded_box':
      return createRoundedBoxGeometry(softwareGl);
    case 'extrude_fin':
      return createExtrudeFinGeometry(softwareGl);
    case 'lathe_vase':
    case 'lathe_dome':
    case 'lathe_nozzle':
      return createLatheGeometry(kind, softwareGl);
    case 'tube_arch':
      return createTubeArchGeometry(softwareGl);
    case 'frustum':
      return new THREE.CylinderGeometry(0.28, 0.54, 1.04, high ? 44 : 24);
    case 'box':
    default:
      return createRoundedBoxGeometry(softwareGl);
  }
}

function parseHexColor(hex: string | undefined, fallback: number): number {
  if (typeof hex === 'string' && /^#[0-9a-fA-F]{6}$/.test(hex)) {
    return parseInt(hex.slice(1), 16);
  }
  return fallback;
}

function resolveMaterialForPart(
  part: CustomModelPartSpec,
  mats: BuilderMaterials,
  finishMode: string,
  clipPlane: THREE.Plane,
  softwareGl: boolean,
  brushedTex: THREE.Texture | null,
  panelBumpTex: THREE.Texture | null,
  trackMat: <T extends THREE.Material>(m: T) => T
): THREE.Material {
  if (finishMode === 'wireframe' || finishMode === 'crystal' || finishMode === 'gold') {
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

  const fallbackHex =
    part.colorRole === 'glow'
      ? 0x38bdf8
      : part.colorRole === 'highlight'
      ? 0x22d3ee
      : part.colorRole === 'secondary'
      ? 0x64748b
      : 0x0284c7;
  const colorNum = parseHexColor(part.customHex, fallbackHex);
  const matKind: CustomModelMaterialKind =
    part.materialKind ||
    (part.colorRole === 'glow'
      ? 'neon_emissive'
      : part.colorRole === 'secondary'
      ? 'brushed_metal'
      : 'glossy_paint');

  const customMetalness = typeof part.metalness === 'number' ? THREE.MathUtils.clamp(part.metalness, 0, 1) : undefined;
  const customRoughness = typeof part.roughness === 'number' ? THREE.MathUtils.clamp(part.roughness, 0.04, 1) : undefined;
  const customOpacity = typeof part.opacity === 'number' ? THREE.MathUtils.clamp(part.opacity, 0.15, 1) : undefined;

  if (matKind === 'glass') {
    return trackMat(
      new THREE.MeshPhysicalMaterial({
        color: colorNum,
        metalness: 0.04,
        roughness: customRoughness ?? 0.08,
        transmission: softwareGl ? 0 : 0.72,
        transparent: true,
        opacity: customOpacity ?? 0.48,
        ior: 1.48,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }

  if (matKind === 'neon_emissive' || part.colorRole === 'glow') {
    return trackMat(
      new THREE.MeshStandardMaterial({
        color: colorNum,
        metalness: 0.15,
        roughness: customRoughness ?? 0.2,
        emissive: colorNum,
        emissiveIntensity: 1.05,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }

  if (matKind === 'brushed_metal' || matKind === 'anodized' || matKind === 'copper_coil') {
    const resolvedColor = matKind === 'copper_coil' && !part.customHex ? 0xd97706 : colorNum;
    return trackMat(
      new THREE.MeshPhysicalMaterial({
        color: resolvedColor,
        metalness: customMetalness ?? (matKind === 'anodized' ? 0.74 : 0.86),
        roughness: customRoughness ?? (matKind === 'anodized' ? 0.32 : 0.26),
        roughnessMap: !softwareGl && brushedTex ? brushedTex : null,
        bumpMap: !softwareGl && matKind === 'anodized' && panelBumpTex ? panelBumpTex : null,
        bumpScale: 0.014,
        clearcoat: matKind === 'anodized' ? 0.45 : 0.22,
        clearcoatRoughness: 0.24,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }

  if (matKind === 'rubber_matte' || matKind === 'wood') {
    return trackMat(
      new THREE.MeshStandardMaterial({
        color: colorNum,
        metalness: customMetalness ?? 0.04,
        roughness: customRoughness ?? (matKind === 'rubber_matte' ? 0.86 : 0.68),
        roughnessMap: !softwareGl && matKind === 'wood' && brushedTex ? brushedTex : null,
        emissive: colorNum,
        emissiveIntensity: 0.03,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }

  // glossy_paint / ceramic
  return trackMat(
    new THREE.MeshPhysicalMaterial({
      color: colorNum,
      metalness: customMetalness ?? (matKind === 'ceramic' ? 0.08 : 0.18),
      roughness: customRoughness ?? (matKind === 'ceramic' ? 0.24 : 0.2),
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      bumpMap: !softwareGl && matKind === 'glossy_paint' && panelBumpTex ? panelBumpTex : null,
      bumpScale: 0.009,
      emissive: colorNum,
      emissiveIntensity: 0.05,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane],
      clipShadows: true
    })
  );
}

function attachCompositeDetails(
  partGroup: THREE.Group,
  p: CustomModelPartSpec,
  trimMat: THREE.Material,
  glowMat: THREE.Material,
  softwareGl: boolean,
  trackGeo: <T extends THREE.BufferGeometry>(g: T) => T
) {
  const style: CustomModelDetailStyle = p.detailStyle || 'none';
  if (style === 'none') return;

  const isCylinderLike =
    p.primitive === 'cylinder' ||
    p.primitive === 'frustum' ||
    p.primitive === 'cone' ||
    p.primitive === 'capsule' ||
    p.primitive === 'lathe_vase' ||
    p.primitive === 'lathe_dome' ||
    p.primitive === 'lathe_nozzle' ||
    p.primitive === 'prism';

  if (style === 'bezel_rings') {
    const r = isCylinderLike ? 0.47 : 0.56;
    const ringGeo = trackGeo(new THREE.TorusGeometry(r, 0.032, softwareGl ? 8 : 14, softwareGl ? 20 : 38));
    [-0.42, 0.42].forEach((yPos) => {
      const m = new THREE.Mesh(ringGeo, trimMat);
      m.rotation.x = Math.PI / 2;
      m.position.y = yPos;
      m.castShadow = !softwareGl;
      partGroup.add(m);
    });
    return;
  }

  if (style === 'dual_band') {
    const bandGeo = trackGeo(
      isCylinderLike
        ? new THREE.CylinderGeometry(0.47, 0.47, 0.12, softwareGl ? 18 : 36)
        : new THREE.BoxGeometry(0.92, 0.12, 0.92)
    );
    const band = new THREE.Mesh(bandGeo, trimMat);
    band.castShadow = !softwareGl;
    partGroup.add(band);
    return;
  }

  if (style === 'ribs') {
    const ribGeo = trackGeo(
      isCylinderLike
        ? new THREE.TorusGeometry(0.47, 0.028, 10, softwareGl ? 20 : 34)
        : new THREE.BoxGeometry(0.94, 0.05, 0.94)
    );
    [-0.28, 0, 0.28].forEach((yPos) => {
      const m = new THREE.Mesh(ribGeo, trimMat);
      if (isCylinderLike) m.rotation.x = Math.PI / 2;
      m.position.y = yPos;
      partGroup.add(m);
    });
    return;
  }

  if (style === 'fins_radial') {
    const finGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.72, 0.24));
    const count = 6;
    for (let k = 0; k < count; k++) {
      const ang = (k / count) * Math.PI * 2;
      const fin = new THREE.Mesh(finGeo, trimMat);
      fin.position.set(Math.sin(ang) * 0.48, 0, Math.cos(ang) * 0.48);
      fin.rotation.y = ang;
      fin.castShadow = !softwareGl;
      partGroup.add(fin);
    }
    return;
  }

  if (style === 'fasteners') {
    const boltGeo = trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.05, 6));
    const count = 8;
    for (let k = 0; k < count; k++) {
      const ang = (k / count) * Math.PI * 2;
      const bolt = new THREE.Mesh(boltGeo, trimMat);
      bolt.position.set(Math.cos(ang) * 0.36, 0.51, Math.sin(ang) * 0.36);
      partGroup.add(bolt);
    }
    return;
  }

  if (style === 'vents') {
    const slatGeo = trackGeo(new THREE.BoxGeometry(0.56, 0.04, 0.08));
    [-0.22, -0.07, 0.08, 0.23].forEach((yPos) => {
      const slat = new THREE.Mesh(slatGeo, trimMat);
      slat.position.set(0, yPos, 0.45);
      slat.rotation.x = 0.26;
      partGroup.add(slat);
    });
    return;
  }

  if (style === 'core_glow') {
    const coreGeo = trackGeo(new THREE.SphereGeometry(0.24, 20, 16));
    const haloGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.025, 10, softwareGl ? 24 : 40));
    const core = new THREE.Mesh(coreGeo, glowMat);
    const halo = new THREE.Mesh(haloGeo, glowMat);
    halo.rotation.x = Math.PI / 2;
    partGroup.add(core, halo);
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
  const textures: THREE.Texture[] = [];
  const customAnimatedParts: CustomAnimatedPartEntry[] = [];

  const brushedTex = !softwareGl ? createBrushedRoughnessTexture() : null;
  const panelBumpTex = !softwareGl ? createMicroPanelBumpTexture() : null;
  if (brushedTex) textures.push(brushedTex);
  if (panelBumpTex) textures.push(panelBumpTex);

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
    const partGroup = new THREE.Group();

    const geo = trackGeo(createPrimitiveGeometry(p.primitive || 'rounded_box', softwareGl));
    const mat = resolveMaterialForPart(
      p,
      mats,
      finishMode,
      clipPlane,
      softwareGl,
      brushedTex,
      panelBumpTex,
      trackMat
    );
    const mainMesh = new THREE.Mesh(geo, mat);
    mainMesh.castShadow = !softwareGl && p.materialKind !== 'glass';
    mainMesh.receiveShadow = !softwareGl;
    partGroup.add(mainMesh);

    // Secondary PBR trim material for composite sub-details
    const trimHex = parseHexColor(p.secondaryHex, 0x94a3b8);
    const trimMat =
      finishMode === 'wireframe' || finishMode === 'crystal' || finishMode === 'gold'
        ? mats.secondary
        : trackMat(
            new THREE.MeshPhysicalMaterial({
              color: trimHex,
              metalness: 0.84,
              roughness: 0.25,
              clearcoat: 0.4,
              side: THREE.DoubleSide,
              clippingPlanes: [clipPlane],
              clipShadows: true
            })
          );

    const glowAccentMat =
      finishMode === 'wireframe'
        ? mats.edge
        : trackMat(
            new THREE.MeshStandardMaterial({
              color: parseHexColor(p.secondaryHex, 0x38bdf8),
              emissive: parseHexColor(p.secondaryHex, 0x38bdf8),
              emissiveIntensity: 1.05,
              roughness: 0.2,
              metalness: 0.2,
              clippingPlanes: [clipPlane]
            })
          );

    attachCompositeDetails(partGroup, p, trimMat, glowAccentMat, softwareGl, trackGeo);

    const px = Number.isFinite(p.pos?.[0]) ? THREE.MathUtils.clamp(p.pos[0], -3.6, 3.6) : 0;
    const py = Number.isFinite(p.pos?.[1]) ? THREE.MathUtils.clamp(p.pos[1], 0.2, 4.2) : 1.5;
    const pz = Number.isFinite(p.pos?.[2]) ? THREE.MathUtils.clamp(p.pos[2], -3.6, 3.6) : 0;
    partGroup.position.set(px, py, pz);

    const rx = Number.isFinite(p.rot?.[0]) ? p.rot[0] : 0;
    const ry = Number.isFinite(p.rot?.[1]) ? p.rot[1] : 0;
    const rz = Number.isFinite(p.rot?.[2]) ? p.rot[2] : 0;
    partGroup.rotation.set(rx, ry, rz);

    const sx = Number.isFinite(p.scale?.[0]) ? THREE.MathUtils.clamp(p.scale[0], 0.12, 3.6) : 1;
    const sy = Number.isFinite(p.scale?.[1]) ? THREE.MathUtils.clamp(p.scale[1], 0.12, 3.6) : 1;
    const sz = Number.isFinite(p.scale?.[2]) ? THREE.MathUtils.clamp(p.scale[2], 0.12, 3.6) : 1;
    partGroup.scale.set(sx, sy, sz);

    if (
      p.addEdges &&
      !softwareGl &&
      finishMode === 'wireframe' &&
      p.primitive !== 'sphere' &&
      p.primitive !== 'torus' &&
      p.primitive !== 'ring'
    ) {
      const edges = trackGeo(new THREE.EdgesGeometry(geo, 22));
      partGroup.add(new THREE.LineSegments(edges, mats.edge));
    }

    group.add(partGroup);

    const ex = Number.isFinite(p.explodeDir?.[0]) ? THREE.MathUtils.clamp(p.explodeDir[0], -2.2, 2.2) : 0;
    const ey = Number.isFinite(p.explodeDir?.[1]) ? THREE.MathUtils.clamp(p.explodeDir[1], -1.6, 2.2) : 0.4;
    const ez = Number.isFinite(p.explodeDir?.[2]) ? THREE.MathUtils.clamp(p.explodeDir[2], -2.2, 2.2) : 0;

    explodables.push({
      mesh: partGroup,
      basePos: partGroup.position.clone(),
      explodeDir: new THREE.Vector3(ex, ey, ez),
      info: {
        id: p.id || `custom_part_${i + 1}`,
        nameVi: p.nameVi || `Bộ phận ${i + 1}`,
        nameEn: p.nameEn || `Part ${i + 1}`,
        badgeVi: p.badgeVi || 'CẤU KIỆN',
        badgeEn: p.badgeEn || 'MODULE',
        introVi: p.introVi || 'Bộ phận cấu thành do Syn AI tổng hợp.',
        introEn: p.introEn || 'Structural module synthesized by Syn AI.',
        functionVi: p.functionVi || 'Tham gia liên kết, vận hành hoặc truyền năng lượng trong mô hình tổng thể.',
        functionEn: p.functionEn || 'Contributes to structural integrity and kinematics of the assembly.',
        specFormula: p.specFormula
      }
    });

    if (p.anim && p.anim.type && p.anim.type !== 'none') {
      customAnimatedParts.push({
        mesh: partGroup,
        basePos: partGroup.position.clone(),
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

  // Proportional grounding & centering pass so the assembled hero rests cleanly on the studio grid
  group.updateMatrixWorld(true);
  const fullBox = new THREE.Box3().setFromObject(group);
  if (!fullBox.isEmpty()) {
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    fullBox.getCenter(center);
    fullBox.getSize(size);

    const maxSpan = Math.max(size.x, size.y, size.z, 0.2);
    const normFactor = maxSpan < 1.5 ? 2.4 / maxSpan : maxSpan > 4.6 ? 3.8 / maxSpan : 1.0;
    const minYAfterScale = fullBox.min.y * normFactor;
    const shiftX = -center.x * normFactor;
    const shiftY = 0.18 - minYAfterScale;
    const shiftZ = -center.z * normFactor;

    for (const part of explodables) {
      part.mesh.position.multiplyScalar(normFactor).add(new THREE.Vector3(shiftX, shiftY, shiftZ));
      if (normFactor !== 1.0) {
        part.mesh.scale.multiplyScalar(normFactor);
      }
      part.basePos.copy(part.mesh.position);
    }
    for (const animPart of customAnimatedParts) {
      animPart.basePos.copy(animPart.mesh.position);
      if (normFactor !== 1.0) {
        animPart.baseScale = [
          animPart.baseScale[0] * normFactor,
          animPart.baseScale[1] * normFactor,
          animPart.baseScale[2] * normFactor
        ];
      }
    }
  }

  return {
    group,
    explodables,
    customAnimatedParts,
    disposables: { geometries, materials, textures }
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
