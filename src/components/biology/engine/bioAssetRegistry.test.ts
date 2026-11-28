import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIOLOGY_ASSET_MANIFEST,
  getBiologyAssetSpec,
  listBiologyAssetsByTopic
} from './bioAssetRegistry';
import { Biology3DMode } from '../../../types';

const ALL_BIOLOGY_3D_MODES: Biology3DMode[] = [
  'human_anatomy_3d',
  'eukaryotic_cell_3d',
  'mitochondria_atp_3d',
  'chloroplast_thylakoid_3d',
  'phospholipid_bilayer_3d',
  'dna_double_helix_3d',
  'ribosome_translation_3d',
  'chromosome_mitosis_3d',
  'enzyme_substrate_3d',
  'neuron_synapse_3d',
  'human_heart_3d',
  'human_brain_3d',
  'liver_digestive_3d',
  'alveoli_capillary_3d',
  'nephron_kidney_3d',
  'antibody_antigen_3d',
  'virus_bacteriophage_3d',
  'bacteria_prokaryote_3d',
  'fungi_microorganisms_3d',
  'plant_vascular_3d',
  'plant_leaf_transpiration_3d',
  'ecosystem_biome_3d',
  'mendel_peas_3d',
  'population_genetics_3d',
  'endocrine_pancreas_3d',
  'biotech_pcr_crispr_3d',
  'gene_linkage_3d',
  'plant_flower_seed_3d',
  'comparative_hearts_3d',
  'digestive_tract_3d',
  'invertebrate_biodiversity_3d',
  'plant_tropism_germination_3d',
  'skeleton_senses_3d',
  'biomolecules_3d'
];

test('Human anatomy explorer asset manifest includes all 11 required organ systems & metadata', () => {
  const anatomy = getBiologyAssetSpec('human_anatomy_3d');
  assert.ok(anatomy, 'human_anatomy_3d must exist in BIOLOGY_ASSET_MANIFEST');

  const layers = new Set(anatomy.selectableParts.map((p) => p.layer));
  for (const required of [
    'skeletal',
    'muscular',
    'circulatory',
    'respiratory',
    'digestive',
    'nervous',
    'urinary',
    'endocrine',
    'lymphatic',
    'reproductive',
    'sensory'
  ]) {
    assert.ok(layers.has(required), `Missing required organ system layer: ${required}`);
  }

  for (const part of anatomy.selectableParts) {
    assert.ok(part.name.length > 0 && part.structure.length > 10 && part.function.length > 10);
  }
});

test('All Biology Topics and all 34 Biology3DModes have structured asset specs with licenses and selectable parts', () => {
  const cellular = listBiologyAssetsByTopic('cellular');
  const human = listBiologyAssetsByTopic('human');
  const plant = listBiologyAssetsByTopic('plant');
  const micro = listBiologyAssetsByTopic('microbiology');
  const eco = listBiologyAssetsByTopic('ecology');
  const genetics = listBiologyAssetsByTopic('genetics');

  assert.ok(cellular.length >= 5, 'Expected Cellular Biology specs');
  assert.ok(human.length >= 9, 'Expected Human Biology specs');
  assert.ok(plant.length >= 4, 'Expected Plant Biology specs');
  assert.ok(micro.length >= 3, 'Expected Microbiology specs');
  assert.ok(eco.length >= 2, 'Expected Ecology specs');
  assert.ok(genetics.length >= 5, 'Expected Genetics specs');

  for (const m of ALL_BIOLOGY_3D_MODES) {
    const spec = getBiologyAssetSpec(m);
    assert.ok(spec, `Missing BIOLOGY_ASSET_MANIFEST entry for mode: ${m}`);
    assert.ok(spec.sourceLicense.length > 5, `${spec.id} must specify license/origin`);
    assert.ok(spec.selectableParts.length >= 1, `${spec.id} must expose selectable parts`);
  }
});
