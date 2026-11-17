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
    ctx.fillStyle = '#7e7e7e';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const shade = 96 + Math.floor(((Math.sin(y * 1.9) + Math.cos(y * 0.47)) * 0.5 + 1) * 32);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 256, 1);
    }
    ctx.globalAlpha = 0.24;
    for (let i = 0; i < 220; i++) {
      const y = (i * 17) % 256;
      const x = (i * 43) % 256;
      const w = 28 + (i % 72);
      ctx.fillStyle = i % 2 === 0 ? '#c4c4c4' : '#4a4a4a';
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
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 112, 112);
    ctx.strokeRect(136, 8, 112, 112);
    ctx.strokeRect(8, 136, 112, 112);
    ctx.strokeRect(136, 136, 112, 112);

    ctx.strokeStyle = '#b4b4b4';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(11, 11, 106, 106);
    ctx.strokeRect(139, 11, 106, 106);
    ctx.strokeRect(11, 139, 106, 106);
    ctx.strokeRect(139, 139, 106, 106);

    ctx.fillStyle = '#d4d4d4';
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

function createKnurlBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#707070';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#cfcfcf';
    ctx.lineWidth = 2;
    for (let i = -128; i < 256; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 128, 128);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i + 128, 0);
      ctx.lineTo(i, 128);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  tex.needsUpdate = true;
  return tex;
}

function createCopperWindingBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    for (let y = 0; y < 128; y++) {
      const wave = Math.sin((y / 6) * Math.PI * 2) * 0.5 + 0.5;
      const val = Math.round(70 + wave * 165);
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(0, y, 128, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  tex.needsUpdate = true;
  return tex;
}

function createWoodGrainBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x++) {
      const ring = Math.sin(x * 0.14 + Math.sin(x * 0.04) * 3.0) * 0.5 + 0.5;
      const v = Math.round(96 + ring * 82);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, 0, 1, 256);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.needsUpdate = true;
  return tex;
}

function createCircuitEmissiveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#242424';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    const traces = [
      [24, 32, 96, 32, 120, 56, 224, 56],
      [24, 128, 84, 128, 108, 104, 176, 104, 200, 128, 236, 128],
      [36, 204, 112, 204, 144, 172, 224, 172],
      [64, 24, 64, 88, 92, 116, 92, 232]
    ];
    for (const t of traces) {
      ctx.beginPath();
      ctx.moveTo(t[0], t[1]);
      for (let i = 2; i < t.length; i += 2) {
        ctx.lineTo(t[i], t[i + 1]);
      }
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(t[0], t[1], 5, 0, Math.PI * 2);
      ctx.arc(t[t.length - 2], t[t.length - 1], 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
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
    bevelThickness: 0.085,
    bevelSize: 0.065,
    bevelSegments: softwareGl ? 1 : 4,
    curveSegments: softwareGl ? 5 : 12
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createChamferHexGeometry(softwareGl: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const radius = 0.5;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const px = Math.cos(a) * radius;
    const py = Math.sin(a) * radius;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.62,
    bevelEnabled: true,
    bevelThickness: 0.075,
    bevelSize: 0.06,
    bevelSegments: softwareGl ? 1 : 3
  });
  geo.center();
  geo.rotateX(Math.PI / 2);
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
    bevelThickness: 0.032,
    bevelSize: 0.026,
    bevelSegments: softwareGl ? 1 : 3,
    curveSegments: softwareGl ? 5 : 12
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function createLatheGeometry(
  kind: 'lathe_vase' | 'lathe_dome' | 'lathe_nozzle' | 'stepped_collar',
  softwareGl: boolean
): THREE.BufferGeometry {
  const segs = softwareGl ? 24 : 48;
  let pts: THREE.Vector2[];
  if (kind === 'lathe_vase') {
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.0, -0.56),
      new THREE.Vector2(0.33, -0.56),
      new THREE.Vector2(0.47, -0.22),
      new THREE.Vector2(0.39, 0.12),
      new THREE.Vector2(0.24, 0.36),
      new THREE.Vector2(0.33, 0.54),
      new THREE.Vector2(0.28, 0.57),
      new THREE.Vector2(0.22, 0.53)
    ]);
    pts = curve.getPoints(softwareGl ? 16 : 30);
  } else if (kind === 'lathe_dome') {
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.55, -0.46),
      new THREE.Vector2(0.55, -0.18),
      new THREE.Vector2(0.49, 0.14),
      new THREE.Vector2(0.33, 0.38),
      new THREE.Vector2(0.13, 0.5),
      new THREE.Vector2(0.0, 0.53)
    ]);
    pts = curve.getPoints(softwareGl ? 14 : 26);
  } else if (kind === 'stepped_collar') {
    pts = [
      new THREE.Vector2(0.24, -0.44),
      new THREE.Vector2(0.52, -0.44),
      new THREE.Vector2(0.52, -0.26),
      new THREE.Vector2(0.42, -0.22),
      new THREE.Vector2(0.42, 0.22),
      new THREE.Vector2(0.52, 0.26),
      new THREE.Vector2(0.52, 0.44),
      new THREE.Vector2(0.24, 0.44),
      new THREE.Vector2(0.24, -0.44)
    ];
  } else {
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.28, 0.56),
      new THREE.Vector2(0.33, 0.35),
      new THREE.Vector2(0.22, 0.08),
      new THREE.Vector2(0.37, -0.22),
      new THREE.Vector2(0.53, -0.52),
      new THREE.Vector2(0.47, -0.56),
      new THREE.Vector2(0.42, -0.48)
    ]);
    pts = curve.getPoints(softwareGl ? 14 : 26);
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
  const geo = new THREE.TubeGeometry(curve, softwareGl ? 22 : 42, 0.11, softwareGl ? 10 : 18, false);
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
      return new THREE.SphereGeometry(0.54, high ? 44 : 22, high ? 32 : 16);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.46, 0.46, 1.08, high ? 48 : 24);
    case 'cone':
      return new THREE.ConeGeometry(0.54, 1.12, high ? 48 : 24);
    case 'torus':
      return new THREE.TorusGeometry(0.56, 0.15, high ? 24 : 12, high ? 60 : 32);
    case 'octahedron':
      return new THREE.OctahedronGeometry(0.6, 0);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(0.56, 0);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(0.56, 0);
    case 'ring':
      return new THREE.TorusGeometry(0.72, 0.058, high ? 20 : 10, high ? 60 : 32);
    case 'capsule':
      return new THREE.CapsuleGeometry(0.32, 0.68, high ? 16 : 8, high ? 32 : 16);
    case 'prism':
      return new THREE.CylinderGeometry(0.5, 0.5, 1.02, 6);
    case 'chamfer_hex':
      return createChamferHexGeometry(softwareGl);
    case 'rounded_box':
      return createRoundedBoxGeometry(softwareGl);
    case 'extrude_fin':
      return createExtrudeFinGeometry(softwareGl);
    case 'lathe_vase':
    case 'lathe_dome':
    case 'lathe_nozzle':
    case 'stepped_collar':
      return createLatheGeometry(kind, softwareGl);
    case 'tube_arch':
      return createTubeArchGeometry(softwareGl);
    case 'frustum':
      return new THREE.CylinderGeometry(0.28, 0.54, 1.04, high ? 48 : 24);
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

interface ProceduralTextureBundle {
  brushedTex: THREE.Texture | null;
  panelBumpTex: THREE.Texture | null;
  knurlBumpTex: THREE.Texture | null;
  copperBumpTex: THREE.Texture | null;
  woodBumpTex: THREE.Texture | null;
  circuitEmissiveTex: THREE.Texture | null;
}

function resolveMaterialForPart(
  part: CustomModelPartSpec,
  mats: BuilderMaterials,
  finishMode: string,
  clipPlane: THREE.Plane,
  softwareGl: boolean,
  texBundle: ProceduralTextureBundle,
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
        roughness: customRoughness ?? 0.06,
        transmission: softwareGl ? 0 : 0.78,
        thickness: 0.85,
        transparent: true,
        opacity: customOpacity ?? 0.46,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
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
        metalness: 0.22,
        roughness: customRoughness ?? 0.18,
        emissive: colorNum,
        emissiveMap: !softwareGl && texBundle.circuitEmissiveTex ? texBundle.circuitEmissiveTex : null,
        emissiveIntensity: 1.25,
        side: THREE.DoubleSide,
        clippingPlanes: [clipPlane],
        clipShadows: true
      })
    );
  }

  if (matKind === 'brushed_metal' || matKind === 'anodized' || matKind === 'copper_coil') {
    const resolvedColor = matKind === 'copper_coil' && !part.customHex ? 0xd97706 : colorNum;
    const bumpMap = !softwareGl
      ? matKind === 'copper_coil'
        ? texBundle.copperBumpTex
        : matKind === 'anodized'
        ? texBundle.panelBumpTex
        : texBundle.brushedTex
      : null;

    return trackMat(
      new THREE.MeshPhysicalMaterial({
        color: resolvedColor,
        metalness: customMetalness ?? (matKind === 'anodized' ? 0.78 : matKind === 'copper_coil' ? 0.9 : 0.88),
        roughness: customRoughness ?? (matKind === 'anodized' ? 0.28 : 0.24),
        roughnessMap: !softwareGl && texBundle.brushedTex ? texBundle.brushedTex : null,
        bumpMap,
        bumpScale: matKind === 'copper_coil' ? 0.022 : 0.014,
        clearcoat: matKind === 'anodized' ? 0.52 : 0.26,
        clearcoatRoughness: 0.2,
        anisotropy: softwareGl ? 0 : 0.45,
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
        roughness: customRoughness ?? (matKind === 'rubber_matte' ? 0.86 : 0.62),
        bumpMap: !softwareGl
          ? matKind === 'rubber_matte'
            ? texBundle.knurlBumpTex
            : texBundle.woodBumpTex
          : null,
        bumpScale: matKind === 'rubber_matte' ? 0.018 : 0.015,
        roughnessMap: !softwareGl && matKind === 'wood' && texBundle.brushedTex ? texBundle.brushedTex : null,
        emissive: colorNum,
        emissiveIntensity: 0.025,
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
      metalness: customMetalness ?? (matKind === 'ceramic' ? 0.08 : 0.2),
      roughness: customRoughness ?? (matKind === 'ceramic' ? 0.2 : 0.18),
      clearcoat: 0.92,
      clearcoatRoughness: 0.1,
      bumpMap: !softwareGl && matKind === 'glossy_paint' && texBundle.panelBumpTex ? texBundle.panelBumpTex : null,
      bumpScale: 0.01,
      emissive: colorNum,
      emissiveIntensity: 0.04,
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
  darkMachinedMat: THREE.Material,
  glowMat: THREE.Material,
  lensGlassMat: THREE.Material,
  rubberGripMat: THREE.Material,
  softwareGl: boolean,
  trackGeo: <T extends THREE.BufferGeometry>(g: T) => T
) {
  const style: CustomModelDetailStyle = p.detailStyle || 'none';
  if (style === 'none' && p.primitive !== 'tube_arch') return;

  const isCylinderLike =
    p.primitive === 'cylinder' ||
    p.primitive === 'frustum' ||
    p.primitive === 'cone' ||
    p.primitive === 'capsule' ||
    p.primitive === 'lathe_vase' ||
    p.primitive === 'lathe_dome' ||
    p.primitive === 'lathe_nozzle' ||
    p.primitive === 'stepped_collar' ||
    p.primitive === 'chamfer_hex' ||
    p.primitive === 'prism';

  // Tube arch always gets precision end mounting flanges so handles/arches look bolted in place
  if (p.primitive === 'tube_arch') {
    const collarGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.19, 0.1, 16));
    [-0.48, 0.48].forEach((xPos) => {
      const c = new THREE.Mesh(collarGeo, trimMat);
      c.position.set(xPos, -0.44, 0);
      c.castShadow = !softwareGl;
      partGroup.add(c);
    });
  }

  if (style === 'bezel_rings') {
    const r = isCylinderLike ? 0.47 : 0.56;
    const outerRingGeo = trackGeo(new THREE.TorusGeometry(r, 0.036, softwareGl ? 8 : 16, softwareGl ? 22 : 42));
    const innerRingGeo = trackGeo(new THREE.TorusGeometry(r * 0.94, 0.018, softwareGl ? 8 : 12, softwareGl ? 20 : 36));
    const pinGeo = trackGeo(new THREE.SphereGeometry(0.028, 10, 10));

    [-0.42, 0.42].forEach((yPos) => {
      const outer = new THREE.Mesh(outerRingGeo, trimMat);
      outer.rotation.x = Math.PI / 2;
      outer.position.y = yPos;
      outer.castShadow = !softwareGl;

      const inner = new THREE.Mesh(innerRingGeo, darkMachinedMat);
      inner.rotation.x = Math.PI / 2;
      inner.position.y = yPos * 1.03;
      partGroup.add(outer, inner);
    });

    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2 + Math.PI / 4;
      const pin = new THREE.Mesh(pinGeo, glowMat);
      pin.position.set(Math.cos(a) * r, 0.42, Math.sin(a) * r);
      partGroup.add(pin);
    }
    return;
  }

  if (style === 'dual_band') {
    const bandGeo = trackGeo(
      isCylinderLike
        ? new THREE.CylinderGeometry(0.475, 0.475, 0.14, softwareGl ? 20 : 40)
        : new THREE.BoxGeometry(0.93, 0.14, 0.93)
    );
    const hairlineGeo = trackGeo(
      isCylinderLike
        ? new THREE.TorusGeometry(0.482, 0.016, 10, softwareGl ? 22 : 40)
        : new THREE.BoxGeometry(0.945, 0.035, 0.945)
    );
    const band = new THREE.Mesh(bandGeo, trimMat);
    band.castShadow = !softwareGl;
    const hairline = new THREE.Mesh(hairlineGeo, glowMat);
    if (isCylinderLike) hairline.rotation.x = Math.PI / 2;
    partGroup.add(band, hairline);
    return;
  }

  if (style === 'ribs') {
    const ribGeo = trackGeo(
      isCylinderLike
        ? new THREE.TorusGeometry(0.475, 0.03, 12, softwareGl ? 22 : 40)
        : new THREE.BoxGeometry(0.95, 0.055, 0.95)
    );
    [-0.32, -0.16, 0, 0.16, 0.32].forEach((yPos) => {
      const m = new THREE.Mesh(ribGeo, trimMat);
      if (isCylinderLike) m.rotation.x = Math.PI / 2;
      m.position.y = yPos;
      m.castShadow = !softwareGl;
      partGroup.add(m);
    });
    const spineGeo = trackGeo(new THREE.BoxGeometry(0.08, 0.84, 0.08));
    [-0.45, 0.45].forEach((zOff) => {
      const spine = new THREE.Mesh(spineGeo, darkMachinedMat);
      spine.position.z = zOff;
      partGroup.add(spine);
    });
    return;
  }

  if (style === 'fins_radial') {
    const finGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.78, 0.24));
    const hubRingGeo = trackGeo(new THREE.TorusGeometry(0.46, 0.032, 12, softwareGl ? 22 : 40));
    const count = softwareGl ? 6 : 10;
    for (let k = 0; k < count; k++) {
      const ang = (k / count) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.rotation.y = ang;
      const fin = new THREE.Mesh(finGeo, k % 2 === 0 ? trimMat : darkMachinedMat);
      fin.position.set(0, 0, 0.49);
      fin.rotation.x = 0.24;
      fin.castShadow = !softwareGl;
      pivot.add(fin);
      partGroup.add(pivot);
    }
    [-0.36, 0.36].forEach((yOff) => {
      const r = new THREE.Mesh(hubRingGeo, trimMat);
      r.rotation.x = Math.PI / 2;
      r.position.y = yOff;
      partGroup.add(r);
    });
    return;
  }

  if (style === 'fasteners') {
    const flangeGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.032, 10, softwareGl ? 20 : 36));
    const boltGeo = trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 0.055, 6));
    [0.5, -0.5].forEach((ySide) => {
      const flange = new THREE.Mesh(flangeGeo, darkMachinedMat);
      flange.rotation.x = Math.PI / 2;
      flange.position.y = ySide * 0.98;
      partGroup.add(flange);
      for (let k = 0; k < 8; k++) {
        const ang = (k / 8) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, trimMat);
        bolt.position.set(Math.cos(ang) * 0.38, ySide * 1.03, Math.sin(ang) * 0.38);
        partGroup.add(bolt);
      }
    });
    return;
  }

  if (style === 'vents') {
    const bezelGeo = trackGeo(new THREE.BoxGeometry(0.66, 0.62, 0.06));
    const bezel = new THREE.Mesh(bezelGeo, darkMachinedMat);
    bezel.position.set(0, 0, 0.43);
    partGroup.add(bezel);

    const slatGeo = trackGeo(new THREE.BoxGeometry(0.58, 0.038, 0.085));
    [-0.22, -0.11, 0, 0.11, 0.22].forEach((yPos) => {
      const slat = new THREE.Mesh(slatGeo, trimMat);
      slat.position.set(0, yPos, 0.455);
      slat.rotation.x = 0.3;
      partGroup.add(slat);
    });
    return;
  }

  if (style === 'core_glow') {
    const coreGeo = trackGeo(new THREE.SphereGeometry(0.24, 24, 18));
    const haloGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.028, 12, softwareGl ? 24 : 44));
    const cageGeo = trackGeo(new THREE.TorusGeometry(0.61, 0.02, 10, softwareGl ? 24 : 40));
    const core = new THREE.Mesh(coreGeo, glowMat);
    const haloA = new THREE.Mesh(haloGeo, glowMat);
    haloA.rotation.x = Math.PI / 2;
    const haloB = new THREE.Mesh(haloGeo, glowMat);
    haloB.rotation.set(Math.PI / 3, 0, Math.PI / 4);
    const cage = new THREE.Mesh(cageGeo, trimMat);
    cage.rotation.y = Math.PI / 2;
    partGroup.add(core, haloA, haloB, cage);
    return;
  }

  if (style === 'optics_lens') {
    const barrelOuterGeo = trackGeo(new THREE.CylinderGeometry(0.49, 0.51, 0.24, softwareGl ? 24 : 44));
    const baffleGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.34, 0.18, softwareGl ? 20 : 36));
    const lensDomeGeo = trackGeo(new THREE.SphereGeometry(0.36, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.48));
    const barrel = new THREE.Mesh(barrelOuterGeo, trimMat);
    barrel.position.y = 0.44;
    const baffle = new THREE.Mesh(baffleGeo, darkMachinedMat);
    baffle.position.y = 0.5;
    const lens = new THREE.Mesh(lensDomeGeo, lensGlassMat);
    lens.position.y = 0.34;
    partGroup.add(barrel, baffle, lens);
    return;
  }

  if (style === 'knurled_grip') {
    const gripGeo = trackGeo(
      isCylinderLike
        ? new THREE.CylinderGeometry(0.475, 0.475, 0.46, softwareGl ? 22 : 40)
        : new THREE.BoxGeometry(0.93, 0.46, 0.93)
    );
    const clampRingGeo = trackGeo(new THREE.TorusGeometry(isCylinderLike ? 0.485 : 0.55, 0.026, 10, 36));
    const grip = new THREE.Mesh(gripGeo, rubberGripMat);
    grip.castShadow = !softwareGl;
    partGroup.add(grip);
    [-0.24, 0.24].forEach((yOff) => {
      const ring = new THREE.Mesh(clampRingGeo, trimMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yOff;
      partGroup.add(ring);
    });
    return;
  }

  if (style === 'circuit_trim') {
    const plateGeo = trackGeo(new THREE.BoxGeometry(0.95, 0.56, 0.08));
    const stripGeo = trackGeo(new THREE.BoxGeometry(0.86, 0.04, 0.1));
    const plate = new THREE.Mesh(plateGeo, darkMachinedMat);
    const stripTop = new THREE.Mesh(stripGeo, glowMat);
    stripTop.position.set(0, 0.18, 0);
    const stripBot = new THREE.Mesh(stripGeo, glowMat);
    stripBot.position.set(0, -0.18, 0);
    partGroup.add(plate, stripTop, stripBot);
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
  const knurlBumpTex = !softwareGl ? createKnurlBumpTexture() : null;
  const copperBumpTex = !softwareGl ? createCopperWindingBumpTexture() : null;
  const woodBumpTex = !softwareGl ? createWoodGrainBumpTexture() : null;
  const circuitEmissiveTex = !softwareGl ? createCircuitEmissiveTexture() : null;

  [brushedTex, panelBumpTex, knurlBumpTex, copperBumpTex, woodBumpTex, circuitEmissiveTex].forEach((t) => {
    if (t) textures.push(t);
  });

  const texBundle: ProceduralTextureBundle = {
    brushedTex,
    panelBumpTex,
    knurlBumpTex,
    copperBumpTex,
    woodBumpTex,
    circuitEmissiveTex
  };

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const darkMachinedMat =
    finishMode === 'wireframe' || finishMode === 'crystal' || finishMode === 'gold'
      ? mats.secondary
      : trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.72,
            roughness: 0.36,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true
          })
        );

  const lensGlassMat =
    finishMode === 'wireframe'
      ? mats.highlight
      : trackMat(
          new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            metalness: 0.05,
            roughness: 0.05,
            transmission: softwareGl ? 0 : 0.82,
            thickness: 0.9,
            transparent: true,
            opacity: 0.55,
            ior: 1.56,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane]
          })
        );

  const rubberGripMat =
    finishMode === 'wireframe' || finishMode === 'crystal' || finishMode === 'gold'
      ? mats.secondary
      : trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x111827,
            metalness: 0.05,
            roughness: 0.88,
            bumpMap: knurlBumpTex,
            bumpScale: 0.02,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],
            clipShadows: true
          })
        );

  const studioRimEdgeMat = trackMat(
    new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.16,
      clippingPlanes: [clipPlane]
    })
  );

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
      texBundle,
      trackMat
    );
    const mainMesh = new THREE.Mesh(geo, mat);
    mainMesh.castShadow = !softwareGl && p.materialKind !== 'glass';
    mainMesh.receiveShadow = !softwareGl;
    partGroup.add(mainMesh);

    const trimHex = parseHexColor(p.secondaryHex, 0xcbd5e1);
    const trimMat =
      finishMode === 'wireframe' || finishMode === 'crystal' || finishMode === 'gold'
        ? mats.secondary
        : trackMat(
            new THREE.MeshPhysicalMaterial({
              color: trimHex,
              metalness: 0.86,
              roughness: 0.22,
              roughnessMap: brushedTex,
              clearcoat: 0.45,
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
              emissiveIntensity: 1.15,
              roughness: 0.18,
              metalness: 0.25,
              clippingPlanes: [clipPlane]
            })
          );

    attachCompositeDetails(
      partGroup,
      p,
      trimMat,
      darkMachinedMat,
      glowAccentMat,
      lensGlassMat,
      rubberGripMat,
      softwareGl,
      trackGeo
    );

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

    const isFacetedShape =
      p.primitive !== 'sphere' &&
      p.primitive !== 'torus' &&
      p.primitive !== 'ring' &&
      p.primitive !== 'lathe_vase' &&
      p.primitive !== 'lathe_dome';

    if (!softwareGl && isFacetedShape) {
      if (finishMode === 'wireframe' && p.addEdges) {
        const edges = trackGeo(new THREE.EdgesGeometry(geo, 22));
        partGroup.add(new THREE.LineSegments(edges, mats.edge));
      } else if (finishMode !== 'wireframe' && (p.addEdges || p.primitive === 'box' || p.primitive === 'chamfer_hex')) {
        const edges = trackGeo(new THREE.EdgesGeometry(geo, 32));
        partGroup.add(new THREE.LineSegments(edges, studioRimEdgeMat));
      }
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
    const normFactor = maxSpan < 1.8 ? 2.65 / maxSpan : maxSpan > 4.6 ? 3.9 / maxSpan : 1.0;
    const minYAfterScale = fullBox.min.y * normFactor;
    const shiftX = -center.x * normFactor;
    const shiftY = 0.06 - minYAfterScale;
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
