import test from 'node:test';
import assert from 'node:assert/strict';
import { BIOLOGY_LESSONS } from '../../../data/biologyLessonsData';
import { BIOLOGY_3D_CONFIGS } from '../biology3DControlsData';
import { getLesson3DModels } from './bioLessonModelRegistry';

test('All 166 BIOLOGY_LESSONS resolve to valid multi-model 3D options preserving lesson.sim3dType as primary', () => {
  assert.ok(BIOLOGY_LESSONS.length >= 166);
  const reachableModes = new Set<string>();

  for (const lesson of BIOLOGY_LESSONS) {
    const models = getLesson3DModels(lesson);
    assert.ok(models.length >= 1, `${lesson.id} must expose at least 1 model`);
    assert.equal(models[0].mode, lesson.sim3dType, `${lesson.id} primary model must remain ${lesson.sim3dType}`);
    assert.equal(models[0].isPrimary, true);

    const seen = new Set<string>();
    for (const m of models) {
      assert.ok(BIOLOGY_3D_CONFIGS[m.mode], `Unknown Biology3DMode ${m.mode} in ${lesson.id}`);
      assert.ok(!seen.has(m.mode), `Duplicate model ${m.mode} in ${lesson.id}`);
      seen.add(m.mode);
      reachableModes.add(m.mode);
    }
  }

  // Ensure the 6 previously unlinked high-detail modular scenes are all reachable via lesson tabs
  for (const unlinked of [
    'human_anatomy_3d',
    'human_brain_3d',
    'liver_digestive_3d',
    'bacteria_prokaryote_3d',
    'fungi_microorganisms_3d',
    'plant_leaf_transpiration_3d'
  ]) {
    assert.ok(reachableModes.has(unlinked), `Expected ${unlinked} to be linked in lesson model switcher`);
  }
});

test('Multi-organ human lessons expose multiple organ models without altering lesson.sim3dType', () => {
  const mapById = new Map(BIOLOGY_LESSONS.map((l) => [l.id, l]));

  const l8b3 = mapById.get('bio-8-b3')!;
  const m8b3 = getLesson3DModels(l8b3).map((x) => x.mode);
  assert.equal(m8b3[0], 'alveoli_capillary_3d');
  assert.ok(m8b3.includes('nephron_kidney_3d'));
  assert.ok(m8b3.includes('human_anatomy_3d'));

  const l8b4 = mapById.get('bio-8-b4')!;
  const m8b4 = getLesson3DModels(l8b4).map((x) => x.mode);
  assert.equal(m8b4[0], 'neuron_synapse_3d');
  assert.ok(m8b4.includes('human_brain_3d'));
  assert.ok(m8b4.includes('skeleton_senses_3d'));
  assert.ok(m8b4.includes('endocrine_pancreas_3d'));
});
