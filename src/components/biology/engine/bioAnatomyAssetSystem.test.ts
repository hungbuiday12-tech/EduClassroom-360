import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  HUMAN_ANATOMY_ASSET_SLOTS,
  matchNodeNameToOrganId,
  normalizeAndBindGltfOrgan,
  resolveSlotAvailability,
  splitCompositeAnatomyGltf,
  getAnatomySlotSpec
} from './bioAnatomyAssetSystem';

test('HUMAN_ANATOMY_ASSET_SLOTS covers full body and all 12 anatomical organ/system slots', () => {
  assert.equal(HUMAN_ANATOMY_ASSET_SLOTS.length, 13);
  const ids = new Set(HUMAN_ANATOMY_ASSET_SLOTS.map((s) => s.organId));
  for (const required of [
    'full_body_atlas',
    'skeletal_frame',
    'muscular_system',
    'brain_nervous',
    'heart_circulatory',
    'lungs_respiratory',
    'liver_gallbladder',
    'stomach_intestines',
    'kidneys_urinary',
    'endocrine_glands',
    'lymphatic_immune',
    'reproductive_pelvic',
    'sensory_organs'
  ]) {
    assert.ok(ids.has(required), `Missing asset slot for ${required}`);
  }
});

test('matchNodeNameToOrganId maps anatomical GLTF mesh names across systems', () => {
  assert.equal(matchNodeNameToOrganId('Cor_Heart_LeftVentricle'), 'heart_circulatory');
  assert.equal(matchNodeNameToOrganId('Right_Lung_UpperLobe'), 'lungs_respiratory');
  assert.equal(matchNodeNameToOrganId('Encephalon_Cerebrum'), 'brain_nervous');
  assert.equal(matchNodeNameToOrganId('Hepar_Liver_Right'), 'liver_gallbladder');
  assert.equal(matchNodeNameToOrganId('Stomach_Gaster_Pylorus'), 'stomach_intestines');
  assert.equal(matchNodeNameToOrganId('Renal_Kidney_Left'), 'kidneys_urinary');
  assert.equal(matchNodeNameToOrganId('Thyroid_Gland_Mesh'), 'endocrine_glands');
  assert.equal(matchNodeNameToOrganId('Ribcage_Skeleton_01'), 'skeletal_frame');
  assert.equal(matchNodeNameToOrganId('Pectoralis_Muscular'), 'muscular_system');
  assert.equal(matchNodeNameToOrganId('Thymus_Spleen_Lymph'), 'lymphatic_immune');
  assert.equal(matchNodeNameToOrganId('Uterus_Ovary_Reproductive'), 'reproductive_pelvic');
  assert.equal(matchNodeNameToOrganId('Eye_Cochlea_Sensory'), 'sensory_organs');
  assert.equal(matchNodeNameToOrganId('Camera_Dummy'), null);
});

test('resolveSlotAvailability accurately reports missing GLB assets vs bundled/loaded GLBs', () => {
  const sessionUploads = new Map<string, string>([['heart_circulatory', 'custom_heart.glb']]);
  const summary = resolveSlotAvailability(['human_brain_nervous.glb'], sessionUploads);

  assert.equal(summary.totalSlots, 13);
  assert.equal(summary.readyCount, 2);
  assert.equal(summary.missingCount, 11);

  const heart = summary.items.find((i) => i.slot.organId === 'heart_circulatory');
  const brain = summary.items.find((i) => i.slot.organId === 'brain_nervous');
  const liver = summary.items.find((i) => i.slot.organId === 'liver_gallbladder');

  assert.equal(heart?.status, 'glb_loaded');
  assert.equal(brain?.status, 'glb_bundled');
  assert.equal(liver?.status, 'missing_glb');
});

test('normalizeAndBindGltfOrgan scales, positions, and tags focusAnchorFor for organ slot', () => {
  const raw = new THREE.Group();
  const bigMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 20, 10));
  bigMesh.position.set(100, -50, 20);
  raw.add(bigMesh);

  const heartSlot = getAnatomySlotSpec('heart_circulatory')!;
  const bound = normalizeAndBindGltfOrgan(raw, heartSlot);
  bound.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(bound);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  assert.ok(Math.abs(Math.max(size.x, size.y, size.z) - heartSlot.targetMaxExtent) < 0.02);
  assert.ok(Math.abs(center.y - heartSlot.anchorPosition[1]) < 0.02);
  assert.equal(bound.userData.organId, 'heart_circulatory');
  assert.equal(bound.userData.focusAnchorFor, 'heart_circulatory');
});

test('splitCompositeAnatomyGltf extracts and maps composite GLB meshes to organ groups', () => {
  const composite = new THREE.Group();
  const heartMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
  heartMesh.name = 'Heart_Ventricle';
  const liverMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1));
  liverMesh.name = 'Liver_Hepar';
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 2));
  bodyMesh.name = 'Ribcage_Skeleton';
  composite.add(heartMesh, liverMesh, bodyMesh);

  const mapped = splitCompositeAnatomyGltf(composite);
  assert.ok(mapped.has('heart_circulatory'));
  assert.ok(mapped.has('liver_gallbladder'));
  assert.ok(mapped.has('skeletal_frame'));
  assert.equal(mapped.get('heart_circulatory')?.userData.focusAnchorFor, 'heart_circulatory');
});
