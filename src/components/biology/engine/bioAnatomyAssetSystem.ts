import * as THREE from 'three';
import type { AnatomySystemKey } from './bioAnatomyBuilder';
import { getSharedGltfLoader } from './bioGltfLoader';

export interface AnatomyGltfSlotSpec {
  slotId: string;
  organId: string;
  systemKey: AnatomySystemKey | 'full_body';
  labelVi: string;
  latinName: string;
  expectedFileName: string;
  expectedPublicPath: string;
  recommendedLicense: string;
  anchorPosition: [number, number, number];
  targetMaxExtent: number;
  meshKeywords: string[];
}

export type AnatomyAssetSourceState = 'glb_loaded' | 'glb_bundled' | 'missing_glb';

export interface AnatomyAssetAvailabilityItem {
  slot: AnatomyGltfSlotSpec;
  status: AnatomyAssetSourceState;
  activeSourceLabel: string;
  hasRealGltf: boolean;
}

export interface AnatomyAssetReportSummary {
  totalSlots: number;
  readyCount: number;
  missingCount: number;
  items: AnatomyAssetAvailabilityItem[];
  missingLabels: string[];
}

export const HUMAN_ANATOMY_ASSET_SLOTS: AnatomyGltfSlotSpec[] = [
  {
    slotId: 'full_body_atlas',
    organId: 'full_body_atlas',
    systemKey: 'full_body',
    labelVi: 'Mô hình Toàn thân 11 Hệ (Composite GLB)',
    latinName: 'Corpus humanum integrum',
    expectedFileName: 'human_anatomy_full.glb',
    expectedPublicPath: './assets/anatomy/human_anatomy_full.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0 (BodyParts3D, NIH 3D, Z-Anatomy)',
    anchorPosition: [0, 0, 0],
    targetMaxExtent: 3.15,
    meshKeywords: ['body', 'anatomy', 'full', 'torso', 'corpus']
  },
  {
    slotId: 'skeletal_frame',
    organId: 'skeletal_frame',
    systemKey: 'skeletal',
    labelVi: 'Hệ Xương (Sọ · Cột sống · Lồng ngực · Chi)',
    latinName: 'Systema skeletale',
    expectedFileName: 'human_skeleton.glb',
    expectedPublicPath: './assets/anatomy/human_skeleton.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 0.08, -0.01],
    targetMaxExtent: 3.1,
    meshKeywords: ['skeleton', 'skeletal', 'bone', 'skull', 'cranium', 'rib', 'spine', 'vertebra', 'pelvis', 'femur', 'sternum']
  },
  {
    slotId: 'muscular_system',
    organId: 'muscular_system',
    systemKey: 'muscular',
    labelVi: 'Hệ Cơ Vân (Ngực · Vai · Bụng · Chi)',
    latinName: 'Systema musculare',
    expectedFileName: 'human_muscular.glb',
    expectedPublicPath: './assets/anatomy/human_muscular.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 0.14, 0.04],
    targetMaxExtent: 2.35,
    meshKeywords: ['muscle', 'muscular', 'pectoral', 'deltoid', 'bicep', 'quadriceps', 'abdomin', 'myo']
  },
  {
    slotId: 'brain_nervous',
    organId: 'brain_nervous',
    systemKey: 'nervous',
    labelVi: 'Não bộ & Hệ Thần kinh',
    latinName: 'Encephalon et Systema nervosum',
    expectedFileName: 'human_brain_nervous.glb',
    expectedPublicPath: './assets/anatomy/human_brain_nervous.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 1.44, -0.03],
    targetMaxExtent: 0.36,
    meshKeywords: ['brain', 'cerebrum', 'cerebellum', 'brainstem', 'encephalon', 'nerv', 'spinal', 'sciatic', 'cortex']
  },
  {
    slotId: 'heart_circulatory',
    organId: 'heart_circulatory',
    systemKey: 'circulatory',
    labelVi: 'Tim 4 ngăn & Hệ Tuần hoàn',
    latinName: 'Cor et Vasa sanguinea',
    expectedFileName: 'human_heart_circulatory.glb',
    expectedPublicPath: './assets/anatomy/human_heart_circulatory.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0.055, 0.62, 0.075],
    targetMaxExtent: 0.34,
    meshKeywords: ['heart', 'coronary', 'aorta', 'ventricle', 'atrium', 'vena_cava', 'cardiac', 'artery', 'vein', 'circulat']
  },
  {
    slotId: 'lungs_respiratory',
    organId: 'lungs_respiratory',
    systemKey: 'respiratory',
    labelVi: 'Phổi, Khí quản & Cơ hoành',
    latinName: 'Pulmones, Trachea et Diaphragma',
    expectedFileName: 'human_lungs_respiratory.glb',
    expectedPublicPath: './assets/anatomy/human_lungs_respiratory.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 0.64, 0.02],
    targetMaxExtent: 0.78,
    meshKeywords: ['lung', 'pulmon', 'trachea', 'bronch', 'larynx', 'diaphragm', 'respir']
  },
  {
    slotId: 'liver_gallbladder',
    organId: 'liver_gallbladder',
    systemKey: 'digestive',
    labelVi: 'Gan & Túi mật',
    latinName: 'Hepar et Vesica biliaris',
    expectedFileName: 'human_liver_gallbladder.glb',
    expectedPublicPath: './assets/anatomy/human_liver_gallbladder.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [-0.11, 0.25, 0.08],
    targetMaxExtent: 0.42,
    meshKeywords: ['liver', 'hepar', 'hepatic', 'gallbladder', 'biliar']
  },
  {
    slotId: 'stomach_intestines',
    organId: 'stomach_intestines',
    systemKey: 'digestive',
    labelVi: 'Dạ dày, Ruột non & Ruột già',
    latinName: 'Gaster et Intestinum',
    expectedFileName: 'human_digestive_gi.glb',
    expectedPublicPath: './assets/anatomy/human_digestive_gi.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0.02, 0.14, 0.06],
    targetMaxExtent: 0.92,
    meshKeywords: ['stomach', 'gaster', 'gastric', 'intestin', 'colon', 'duoden', 'esophag', 'jejun', 'ileum']
  },
  {
    slotId: 'kidneys_urinary',
    organId: 'kidneys_urinary',
    systemKey: 'urinary',
    labelVi: 'Hệ Tiết niệu (Thận · Niệu quản · Bàng quang)',
    latinName: 'Systema urinarium',
    expectedFileName: 'human_urinary_kidneys.glb',
    expectedPublicPath: './assets/anatomy/human_urinary_kidneys.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 0.0, -0.02],
    targetMaxExtent: 0.46,
    meshKeywords: ['kidney', 'renal', 'ureter', 'bladder', 'urinar', 'nephr']
  },
  {
    slotId: 'endocrine_glands',
    organId: 'endocrine_glands',
    systemKey: 'endocrine',
    labelVi: 'Tuyến Nội tiết (Giáp · Thượng thận · Tụy)',
    latinName: 'Systema endocrinum',
    expectedFileName: 'human_endocrine.glb',
    expectedPublicPath: './assets/anatomy/human_endocrine.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0.02, 0.56, 0.02],
    targetMaxExtent: 0.84,
    meshKeywords: ['thyroid', 'adrenal', 'pancreas', 'endocrine', 'pituitary']
  },
  {
    slotId: 'lymphatic_immune',
    organId: 'lymphatic_immune',
    systemKey: 'lymphatic',
    labelVi: 'Hệ Miễn dịch (Tuyến ức · Lách · Hạch bạch huyết)',
    latinName: 'Systema lymphoideum',
    expectedFileName: 'human_lymphatic_immune.glb',
    expectedPublicPath: './assets/anatomy/human_lymphatic_immune.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0.02, 0.45, 0.02],
    targetMaxExtent: 1.35,
    meshKeywords: ['lymph', 'spleen', 'thymus', 'immune', 'tonsil', 'thoracic_duct']
  },
  {
    slotId: 'reproductive_pelvic',
    organId: 'reproductive_pelvic',
    systemKey: 'reproductive',
    labelVi: 'Hệ Sinh sản (Tử cung · Buồng trứng · Ống dẫn)',
    latinName: 'Systema genitale',
    expectedFileName: 'human_reproductive.glb',
    expectedPublicPath: './assets/anatomy/human_reproductive.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, -0.16, 0.0],
    targetMaxExtent: 0.34,
    meshKeywords: ['reprod', 'uterus', 'ovary', 'fallopian', 'genital', 'pelvic']
  },
  {
    slotId: 'sensory_organs',
    organId: 'sensory_organs',
    systemKey: 'sensory',
    labelVi: 'Cơ quan Giác quan (Mắt · Dây thị giác · Ốc tai)',
    latinName: 'Organa sensuum',
    expectedFileName: 'human_sensory_organs.glb',
    expectedPublicPath: './assets/anatomy/human_sensory_organs.glb',
    recommendedLicense: 'CC0 / CC-BY 4.0',
    anchorPosition: [0, 1.43, 0.06],
    targetMaxExtent: 0.38,
    meshKeywords: ['eye', 'optic', 'sclera', 'cochlea', 'ear', 'sensory', 'retina']
  }
];

export function getAnatomySlotSpec(slotOrOrganId: string): AnatomyGltfSlotSpec | undefined {
  return HUMAN_ANATOMY_ASSET_SLOTS.find(
    (s) => s.slotId === slotOrOrganId || s.organId === slotOrOrganId
  );
}

/**
 * Pure mapper matching mesh/node names inside composite GLTF human anatomy models
 * to EduClassroom-360 canonical organ IDs.
 */
export function matchNodeNameToOrganId(nodeName: string): string | null {
  const clean = (nodeName || '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  if (!clean) return null;
  for (const slot of HUMAN_ANATOMY_ASSET_SLOTS) {
    if (slot.organId === 'full_body_atlas') continue;
    if (slot.meshKeywords.some((kw) => clean.includes(kw))) {
      return slot.organId;
    }
  }
  return null;
}

/**
 * Pure availability report summarizing which Human Anatomy slots have real GLB/GLTF assets
 * (either bundled in public/assets/anatomy or imported during the session) vs. missing GLB assets.
 */
export function resolveSlotAvailability(
  bundledFiles: readonly string[],
  sessionUploadedSlots: ReadonlyMap<string, string>
): AnatomyAssetReportSummary {
  const bundledSet = new Set(bundledFiles.map((f) => f.trim().toLowerCase()));
  const items: AnatomyAssetAvailabilityItem[] = HUMAN_ANATOMY_ASSET_SLOTS.map((slot) => {
    const uploadedLabel = sessionUploadedSlots.get(slot.slotId) || sessionUploadedSlots.get(slot.organId);
    if (uploadedLabel) {
      return {
        slot,
        status: 'glb_loaded',
        activeSourceLabel: uploadedLabel,
        hasRealGltf: true
      };
    }
    if (bundledSet.has(slot.expectedFileName.toLowerCase())) {
      return {
        slot,
        status: 'glb_bundled',
        activeSourceLabel: slot.expectedPublicPath,
        hasRealGltf: true
      };
    }
    return {
      slot,
      status: 'missing_glb',
      activeSourceLabel: `Thiếu file ${slot.expectedFileName} (đang dùng hình thái PBR chuẩn tỷ lệ)`,
      hasRealGltf: false
    };
  });

  const readyCount = items.filter((i) => i.hasRealGltf).length;
  const missingItems = items.filter((i) => !i.hasRealGltf);
  return {
    totalSlots: items.length,
    readyCount,
    missingCount: missingItems.length,
    items,
    missingLabels: missingItems.map((m) => m.slot.expectedFileName)
  };
}

/**
 * Fetches static ./assets/anatomy/manifest.json cleanly (200 OK, zero 404 console spam)
 * to discover any bundled .glb/.gltf files placed in public/assets/anatomy/.
 */
export async function fetchAnatomyBundledManifest(signal?: AbortSignal): Promise<string[]> {
  try {
    const res = await fetch('./assets/anatomy/manifest.json', { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { bundledFiles?: unknown };
    if (!Array.isArray(data?.bundledFiles)) return [];
    return data.bundledFiles.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  } catch {
    return [];
  }
}

/**
 * Loads a GLB/GLTF scene from a URL or local browser File via the shared DRACOLoader + GLTFLoader.
 */
export async function loadAnatomyGltfSource(
  source: string | File,
  signal?: AbortSignal
): Promise<THREE.Group> {
  const loader = await getSharedGltfLoader();
  let objectUrl: string | null = null;
  const targetUrl = typeof source === 'string' ? source : (objectUrl = URL.createObjectURL(source));

  try {
    const gltf = await new Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      loader.load(
        targetUrl,
        (loaded) => resolve(loaded),
        undefined,
        (err) => reject(err)
      );
    });
    return gltf.scene || new THREE.Group();
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}

/**
 * Normalizes an arbitrary external GLB organ scene to match its exact anatomical anchor,
 * bounding extent, shadow behavior, and interactive organ/focus tags.
 */
export function normalizeAndBindGltfOrgan(
  rawRoot: THREE.Object3D,
  slot: AnatomyGltfSlotSpec
): THREE.Group {
  rawRoot.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(rawRoot);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 1e-4);
  const scale = slot.targetMaxExtent / maxDim;

  const wrapper = new THREE.Group();
  wrapper.name = `gltf_organ_${slot.organId}`;

  const pivot = new THREE.Group();
  rawRoot.position.sub(center);
  pivot.add(rawRoot);
  pivot.scale.setScalar(scale);
  pivot.position.set(...slot.anchorPosition);
  wrapper.add(pivot);

  wrapper.userData.organId = slot.organId;
  wrapper.userData.partId = slot.organId;
  wrapper.userData.partLabel = slot.labelVi;
  wrapper.userData.systemKey = slot.systemKey;
  wrapper.userData.focusAnchorFor = slot.organId;
  wrapper.userData.isGltfOverride = true;

  wrapper.traverse((child) => {
    child.userData.organId = slot.organId;
    child.userData.partId = slot.organId;
    child.userData.partLabel = slot.labelVi;
    child.userData.systemKey = slot.systemKey;
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
  pivot.userData.focusAnchorFor = slot.organId;
  return wrapper;
}

/**
 * Splits a multi-mesh composite Human Anatomy GLB into per-organ normalized Groups
 * mapped cleanly onto EduClassroom-360's 8 organ systems.
 */
export function splitCompositeAnatomyGltf(rawRoot: THREE.Object3D): Map<string, THREE.Group> {
  const result = new Map<string, THREE.Group>();
  rawRoot.updateWorldMatrix(true, true);

  const fullBox = new THREE.Box3().setFromObject(rawRoot);
  const fullSize = new THREE.Vector3();
  const fullCenter = new THREE.Vector3();
  fullBox.getSize(fullSize);
  fullBox.getCenter(fullCenter);

  const maxDim = Math.max(fullSize.x, fullSize.y, fullSize.z, 1e-4);
  const scale = 3.15 / maxDim;

  const normalizedContainer = new THREE.Group();
  rawRoot.position.sub(fullCenter);
  normalizedContainer.add(rawRoot);
  normalizedContainer.scale.setScalar(scale);
  normalizedContainer.position.set(0, 0.08, 0);
  normalizedContainer.updateWorldMatrix(true, true);

  const meshesToAssign: THREE.Mesh[] = [];
  normalizedContainer.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) meshesToAssign.push(mesh);
  });

  for (const mesh of meshesToAssign) {
    let matchedId: string | null = matchNodeNameToOrganId(mesh.name);
    let cur: THREE.Object3D | null = mesh.parent;
    while (!matchedId && cur && cur !== normalizedContainer) {
      matchedId = matchNodeNameToOrganId(cur.name);
      cur = cur.parent;
    }
    if (!matchedId) continue;

    const slot = getAnatomySlotSpec(matchedId);
    if (!slot) continue;

    let organGrp = result.get(matchedId);
    if (!organGrp) {
      organGrp = new THREE.Group();
      organGrp.name = `gltf_composite_${matchedId}`;
      organGrp.userData.organId = matchedId;
      organGrp.userData.partId = matchedId;
      organGrp.userData.partLabel = slot.labelVi;
      organGrp.userData.systemKey = slot.systemKey;
      organGrp.userData.focusAnchorFor = matchedId;
      organGrp.userData.isGltfOverride = true;
      result.set(matchedId, organGrp);
    }

    const cloned = mesh.clone();
    mesh.updateWorldMatrix(true, false);
    cloned.applyMatrix4(mesh.matrixWorld);
    cloned.castShadow = true;
    cloned.receiveShadow = true;
    cloned.userData.organId = matchedId;
    cloned.userData.partId = matchedId;
    cloned.userData.partLabel = slot.labelVi;
    cloned.userData.systemKey = slot.systemKey;
    organGrp.add(cloned);
  }

  return result;
}
