import { Biology3DMode, BiologyLesson } from '../../../types';
import { BIOLOGY_3D_CONFIGS } from '../biology3DControlsData';

export interface Lesson3DModelOption {
  mode: Biology3DMode;
  label: string;
  isPrimary: boolean;
}

const COMPACT_MODEL_LABELS: Record<Biology3DMode, string> = {
  human_anatomy_3d: 'Cơ thể Người Toàn thân (11 Hệ)',
  eukaryotic_cell_3d: 'Tế bào Nhân thực',
  mitochondria_atp_3d: 'Ti thể & ATP Synthase',
  chloroplast_thylakoid_3d: 'Lục lạp & Thylakoid',
  phospholipid_bilayer_3d: 'Màng Sinh chất Kép',
  dna_double_helix_3d: 'Xoắn kép DNA',
  ribosome_translation_3d: 'Ribosome Dịch mã mRNA',
  chromosome_mitosis_3d: 'NST & Phân bào',
  enzyme_substrate_3d: 'Enzyme – Cơ chất',
  neuron_synapse_3d: 'Neuron & Xináp',
  human_heart_3d: 'Tim 4 ngăn & Hệ mạch',
  human_brain_3d: 'Não bộ Người (4 Thùy – Tiểu não)',
  liver_digestive_3d: 'Gan – Túi mật – Dạ dày',
  alveoli_capillary_3d: 'Phổi – Phế quản & Phế nang',
  nephron_kidney_3d: 'Thận & Đơn vị Nephron',
  antibody_antigen_3d: 'Kháng thể IgG & Miễn dịch',
  virus_bacteriophage_3d: 'Virus & Thực khuẩn thể T4',
  bacteria_prokaryote_3d: 'Vi khuẩn Nhân sơ',
  fungi_microorganisms_3d: 'Nấm Sợi & Vi sinh vật',
  plant_vascular_3d: 'Rễ – Thân – Mạch gỗ / Rây',
  plant_leaf_transpiration_3d: 'Giải phẫu Lá & Khí khổng',
  ecosystem_biome_3d: 'Hệ Sinh thái & Lưới Thức ăn',
  mendel_peas_3d: 'Đậu Hà Lan Mendel & F₂',
  population_genetics_3d: 'Di truyền Quần thể (HW)',
  endocrine_pancreas_3d: 'Tuyến Nội tiết & Đảo tụy',
  biotech_pcr_crispr_3d: 'PCR & CRISPR–Cas9',
  gene_linkage_3d: 'Hoán vị Gen Morgan',
  plant_flower_seed_3d: 'Hoa – Thụ tinh – Quả & Hạt',
  comparative_hearts_3d: 'Tiến hóa Tim 2–3–4 Ngăn',
  digestive_tract_3d: 'Ống Tiêu hóa Người',
  invertebrate_biodiversity_3d: 'Động vật Không xương sống',
  plant_tropism_germination_3d: 'Nảy mầm & Hướng động',
  skeleton_senses_3d: 'Xương–Khớp–Cơ & Mắt–Tai',
  biomolecules_3d: 'Nước & 4 Đại phân tử Sinh học'
};

export function getShortModelLabel(mode: Biology3DMode): string {
  return COMPACT_MODEL_LABELS[mode] || BIOLOGY_3D_CONFIGS[mode]?.title || mode;
}

/**
 * Explicit multi-organ / multi-structure mappings keyed by exact repository lesson ID.
 * Note: Every lesson keeps its existing `lesson.sim3dType` as primary (index 0);
 * related organ/system models appear as selectable tabs inside the 3D lesson view.
 */
const EXPLICIT_LESSON_MODELS: Record<string, Biology3DMode[]> = {
  // Lớp 6 (GDPT 2018 & SGK 2006)
  'bio-6-b1': ['eukaryotic_cell_3d', 'bacteria_prokaryote_3d', 'chloroplast_thylakoid_3d'],
  'bio-6-b2': ['chromosome_mitosis_3d', 'eukaryotic_cell_3d'],
  'bio-6-b3': ['invertebrate_biodiversity_3d', 'fungi_microorganisms_3d', 'bacteria_prokaryote_3d'],
  'bio-6-b4': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'antibody_antigen_3d'],
  'bio-6-b5': ['eukaryotic_cell_3d', 'fungi_microorganisms_3d', 'bacteria_prokaryote_3d'],
  'bio-6-b6': ['plant_flower_seed_3d', 'plant_vascular_3d', 'comparative_hearts_3d'],
  'bio-6-b7': ['eukaryotic_cell_3d', 'plant_leaf_transpiration_3d'],
  'bio-6-b8': ['invertebrate_biodiversity_3d', 'ecosystem_biome_3d'],
  'bio-6-b9': ['comparative_hearts_3d', 'human_heart_3d', 'ecosystem_biome_3d'],
  'bio-2006-6-1': ['eukaryotic_cell_3d', 'plant_vascular_3d', 'plant_leaf_transpiration_3d'],
  'bio-2006-6-2': ['plant_vascular_3d', 'plant_leaf_transpiration_3d'],
  'bio-2006-6-3': ['chloroplast_thylakoid_3d', 'plant_leaf_transpiration_3d', 'plant_vascular_3d'],
  'bio-2006-6-4': ['plant_flower_seed_3d', 'plant_tropism_germination_3d'],
  'bio-2006-6-5': ['plant_flower_seed_3d', 'plant_tropism_germination_3d'],
  'bio-2006-6-6': ['plant_flower_seed_3d', 'plant_vascular_3d'],
  'bio-2006-6-9': ['ecosystem_biome_3d', 'fungi_microorganisms_3d', 'bacteria_prokaryote_3d', 'plant_vascular_3d'],

  // Lớp 7 (GDPT 2018 & SGK 2006)
  'bio-7-b1': ['chloroplast_thylakoid_3d', 'plant_leaf_transpiration_3d', 'plant_vascular_3d'],
  'bio-7-b2': ['mitochondria_atp_3d', 'plant_leaf_transpiration_3d'],
  'bio-7-b3': ['plant_vascular_3d', 'plant_leaf_transpiration_3d', 'chloroplast_thylakoid_3d'],
  'bio-7-b4': ['digestive_tract_3d', 'liver_digestive_3d', 'human_anatomy_3d'],
  'bio-7-b5': ['plant_tropism_germination_3d', 'plant_vascular_3d'],
  'bio-7-b6': ['plant_flower_seed_3d', 'plant_tropism_germination_3d'],
  'bio-7-b7': ['chloroplast_thylakoid_3d', 'plant_leaf_transpiration_3d'],
  'bio-7-b8': ['comparative_hearts_3d', 'alveoli_capillary_3d', 'human_heart_3d'],
  'bio-7-b9': ['plant_tropism_germination_3d', 'plant_flower_seed_3d'],
  'bio-2006-7-1': ['eukaryotic_cell_3d', 'fungi_microorganisms_3d', 'invertebrate_biodiversity_3d'],
  'bio-2006-7-4': ['comparative_hearts_3d', 'human_heart_3d'],
  'bio-2006-7-5': ['comparative_hearts_3d', 'human_heart_3d', 'alveoli_capillary_3d'],
  'bio-2006-7-6': ['ecosystem_biome_3d', 'comparative_hearts_3d'],
  'bio-2006-7-8': ['comparative_hearts_3d', 'human_heart_3d'],

  // Lớp 8 — Cơ thể Người & Hệ cơ quan (GDPT 2018 & SGK 2006)
  'bio-8-b1': ['digestive_tract_3d', 'liver_digestive_3d', 'skeleton_senses_3d', 'human_anatomy_3d'],
  'bio-8-b2': ['human_heart_3d', 'antibody_antigen_3d', 'human_anatomy_3d'],
  'bio-8-b3': ['alveoli_capillary_3d', 'nephron_kidney_3d', 'human_anatomy_3d'],
  'bio-8-b4': ['neuron_synapse_3d', 'human_brain_3d', 'skeleton_senses_3d', 'endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-8-b7': ['skeleton_senses_3d', 'human_anatomy_3d'],
  'bio-8-b8': ['endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-2006-8-1': ['eukaryotic_cell_3d', 'skeleton_senses_3d', 'neuron_synapse_3d', 'human_anatomy_3d'],
  'bio-2006-8-2': ['human_heart_3d', 'antibody_antigen_3d', 'human_anatomy_3d'],
  'bio-2006-8-3': ['digestive_tract_3d', 'liver_digestive_3d', 'alveoli_capillary_3d', 'human_anatomy_3d'],
  'bio-2006-8-4': ['nephron_kidney_3d', 'endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-2006-8-5': ['skeleton_senses_3d', 'human_brain_3d', 'neuron_synapse_3d', 'human_anatomy_3d'],
  'bio-2006-8-6': ['endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-2006-8-7': ['human_heart_3d', 'antibody_antigen_3d', 'comparative_hearts_3d', 'human_anatomy_3d'],
  'bio-2006-8-8': ['skeleton_senses_3d', 'human_brain_3d', 'human_anatomy_3d'],
  'bio-2006-8-9': ['alveoli_capillary_3d', 'human_heart_3d', 'human_anatomy_3d'],

  // Lớp 9 & 10 — Tế bào, Vi sinh, Di truyền
  'bio-9-2': ['dna_double_helix_3d', 'ribosome_translation_3d'],
  'bio-9-4': ['dna_double_helix_3d', 'ribosome_translation_3d'],
  'bio-10-2': ['eukaryotic_cell_3d', 'bacteria_prokaryote_3d', 'chloroplast_thylakoid_3d', 'mitochondria_atp_3d'],
  'bio-10-7': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'fungi_microorganisms_3d'],
  'bio-10-10': ['eukaryotic_cell_3d', 'bacteria_prokaryote_3d'],
  'bio-10-13': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d'],
  'bio-10-17': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'antibody_antigen_3d', 'alveoli_capillary_3d'],
  'bio-2006-10-2': ['eukaryotic_cell_3d', 'fungi_microorganisms_3d', 'bacteria_prokaryote_3d'],
  'bio-2006-10-5': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'antibody_antigen_3d'],
  'bio-chuyen-10-4': ['chloroplast_thylakoid_3d', 'plant_leaf_transpiration_3d'],
  'bio-chuyen-10-5': ['mitochondria_atp_3d', 'bacteria_prokaryote_3d', 'fungi_microorganisms_3d'],
  'bio-chuyen-10-6': ['virus_bacteriophage_3d', 'bacteria_prokaryote_3d'],

  // Lớp 11 — Sinh lí Thực vật, Động vật, Người & Miễn dịch
  'bio-11-1': ['chloroplast_thylakoid_3d', 'plant_leaf_transpiration_3d', 'plant_vascular_3d'],
  'bio-11-2': ['plant_vascular_3d', 'plant_leaf_transpiration_3d'],
  'bio-11-3': ['plant_vascular_3d', 'plant_tropism_germination_3d'],
  'bio-11-4': ['human_heart_3d', 'comparative_hearts_3d', 'human_anatomy_3d'],
  'bio-11-5': ['alveoli_capillary_3d', 'human_heart_3d', 'comparative_hearts_3d', 'human_anatomy_3d'],
  'bio-11-6': ['nephron_kidney_3d', 'endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-11-7': ['neuron_synapse_3d', 'human_brain_3d', 'human_anatomy_3d'],
  'bio-11-8': ['antibody_antigen_3d', 'virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'human_anatomy_3d'],
  'bio-11-11': ['digestive_tract_3d', 'liver_digestive_3d', 'human_anatomy_3d'],
  'bio-11-12': ['antibody_antigen_3d', 'virus_bacteriophage_3d', 'bacteria_prokaryote_3d', 'human_anatomy_3d'],
  'bio-11-13': ['plant_vascular_3d', 'plant_tropism_germination_3d', 'plant_leaf_transpiration_3d'],
  'bio-11-14': ['neuron_synapse_3d', 'human_brain_3d', 'skeleton_senses_3d', 'human_anatomy_3d'],
  'bio-11-16': ['endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-11-18': ['human_heart_3d', 'chloroplast_thylakoid_3d', 'human_anatomy_3d'],
  'bio-11-19': ['nephron_kidney_3d', 'endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-11-20': ['human_heart_3d', 'liver_digestive_3d', 'human_anatomy_3d'],
  'bio-2006-11-2': ['plant_vascular_3d', 'plant_leaf_transpiration_3d', 'chloroplast_thylakoid_3d'],
  'bio-2006-11-3': ['human_heart_3d', 'comparative_hearts_3d', 'human_anatomy_3d'],
  'bio-2006-11-4': ['neuron_synapse_3d', 'human_brain_3d', 'human_anatomy_3d'],
  'bio-2006-11-6': ['alveoli_capillary_3d', 'chloroplast_thylakoid_3d', 'digestive_tract_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-1': ['neuron_synapse_3d', 'human_brain_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-2': ['human_heart_3d', 'alveoli_capillary_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-3': ['nephron_kidney_3d', 'endocrine_pancreas_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-4': ['alveoli_capillary_3d', 'nephron_kidney_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-5': ['endocrine_pancreas_3d', 'liver_digestive_3d', 'human_anatomy_3d'],
  'bio-chuyen-11-6': ['plant_vascular_3d', 'plant_leaf_transpiration_3d', 'chloroplast_thylakoid_3d'],

  // Lớp 12 Chuyên
  'bio-chuyen-12-1': ['antibody_antigen_3d', 'gene_linkage_3d', 'human_anatomy_3d']
};

const HUMAN_ORGAN_MODES = new Set<Biology3DMode>([
  'human_heart_3d',
  'human_brain_3d',
  'liver_digestive_3d',
  'alveoli_capillary_3d',
  'nephron_kidney_3d',
  'neuron_synapse_3d',
  'endocrine_pancreas_3d',
  'antibody_antigen_3d',
  'digestive_tract_3d',
  'skeleton_senses_3d'
]);

/**
 * Resolves the ordered list of interactive 3D models available inside a lesson's 3D tab.
 * Strictly preserves `lesson.sim3dType` as the default primary model at index 0.
 */
export function getLesson3DModels(lesson: BiologyLesson): Lesson3DModelOption[] {
  const ordered: Biology3DMode[] = [lesson.sim3dType];
  const pushUnique = (m: Biology3DMode) => {
    if (m && BIOLOGY_3D_CONFIGS[m] && !ordered.includes(m)) {
      ordered.push(m);
    }
  };

  const explicit = EXPLICIT_LESSON_MODELS[lesson.id];
  if (explicit) {
    for (const m of explicit) pushUnique(m);
  } else {
    // Intelligent fallback companions for remaining single-focus lessons
    if (HUMAN_ORGAN_MODES.has(lesson.sim3dType)) {
      pushUnique('human_anatomy_3d');
    } else if (lesson.sim3dType === 'plant_vascular_3d') {
      pushUnique('plant_leaf_transpiration_3d');
    } else if (lesson.sim3dType === 'chloroplast_thylakoid_3d') {
      pushUnique('plant_leaf_transpiration_3d');
    } else if (lesson.sim3dType === 'virus_bacteriophage_3d') {
      pushUnique('bacteria_prokaryote_3d');
    } else if (lesson.sim3dType === 'eukaryotic_cell_3d') {
      pushUnique('bacteria_prokaryote_3d');
    }
  }

  return ordered.map((mode, idx) => ({
    mode,
    label: getShortModelLabel(mode),
    isPrimary: idx === 0
  }));
}
