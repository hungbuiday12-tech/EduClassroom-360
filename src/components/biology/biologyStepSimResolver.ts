import { Biology3DMode, BiologyLesson, BiologySimType } from '../../types';
import {
  BIOLOGY_2D_SIMS,
  BIOLOGY_3D_SIMS,
  Biology2DSimSpec,
  Biology3DSimSpec
} from '../../data/biologyDomainsData';
import { PhysicsParamBound as ParamBound } from '../../data/physicsDomainsData';

export interface ResolvedBioStepSim {
  sim2dId: BiologySimType;
  sim3dMode: Biology3DMode;
  spec2D: Biology2DSimSpec;
  spec3D: Biology3DSimSpec;
  regimeLabel: string;
  observationGoal: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, ParamBound>;
}

const BIO_2D_TO_3D: Record<BiologySimType, Biology3DMode> = {
  cell_organelles_2d: 'eukaryotic_cell_3d',
  membrane_osmosis_2d: 'phospholipid_bilayer_3d',
  enzyme_kinetics_2d: 'enzyme_substrate_3d',
  photosynthesis_calvin_2d: 'chloroplast_thylakoid_3d',
  cellular_respiration_2d: 'mitochondria_atp_3d',
  mitosis_meiosis_2d: 'chromosome_mitosis_3d',
  dna_replication_2d: 'dna_double_helix_3d',
  transcription_translation_2d: 'ribosome_translation_3d',
  lac_operon_2d: 'dna_double_helix_3d',
  crispr_editing_2d: 'biotech_pcr_crispr_3d',
  mendel_punnett_2d: 'mendel_peas_3d',
  gene_linkage_2d: 'gene_linkage_3d',
  hardy_weinberg_2d: 'population_genetics_3d',
  natural_selection_2d: 'population_genetics_3d',
  plant_transpiration_2d: 'plant_vascular_3d',
  phytohormone_tropism_2d: 'plant_vascular_3d',
  cardiac_cycle_2d: 'human_heart_3d',
  bohr_hemoglobin_2d: 'alveoli_capillary_3d',
  nephron_filtration_2d: 'nephron_kidney_3d',
  action_potential_2d: 'neuron_synapse_3d',
  synapse_transmission_2d: 'neuron_synapse_3d',
  glucose_insulin_2d: 'endocrine_pancreas_3d',
  immune_antibody_2d: 'antibody_antigen_3d',
  predator_prey_2d: 'ecosystem_biome_3d',
  logistic_population_2d: 'ecosystem_biome_3d',
  trophic_pyramid_2d: 'ecosystem_biome_3d',
  carbon_nitrogen_cycle_2d: 'ecosystem_biome_3d',
  viral_lytic_cycle_2d: 'virus_bacteriophage_3d',
  pcr_electrophoresis_2d: 'biotech_pcr_crispr_3d',
  blood_typing_2d: 'antibody_antigen_3d',
  pedigree_genetics_2d: 'mendel_peas_3d',
  microscope_cell_compare_2d: 'eukaryotic_cell_3d',
  plant_organs_flowering_2d: 'plant_flower_seed_3d',
  vertebrate_taxonomy_2d: 'comparative_hearts_3d',
  digestion_enzymes_2d: 'digestive_tract_3d'
};

const KEYWORD_RULES: {
  pattern: RegExp;
  sim2d: BiologySimType;
  sim3d?: Biology3DMode;
  label: string;
}[] = [
  { pattern: /kính hiển vi|nhân sơ|tế bào thực vật|tế bào động vật|bạn đồng hành|vách tế bào/i, sim2d: 'microscope_cell_compare_2d', sim3d: 'eukaryotic_cell_3d', label: 'Kính Hiển Vi & So Sánh Tế Bào Nhân Sơ – Thực Vật – Động Vật' },
  { pattern: /hoa lưỡng tính|thụ phấn|thụ tinh|nảy mầm|quả và hạt|hạt kín|hạt trần|lông hút rễ|rễ.*thân.*lá/i, sim2d: 'plant_organs_flowering_2d', sim3d: 'plant_flower_seed_3d', label: 'Cơ Quan Thực Vật (Rễ–Thân–Lá) & Hoa – Quả – Hạt' },
  { pattern: /5 giới|khóa lưỡng phân|đa dạng sinh học|lưỡng cư|bò sát|chân khớp|thân mềm|ruột khoang|tim 2 ngăn|tim 3 ngăn/i, sim2d: 'vertebrate_taxonomy_2d', sim3d: 'comparative_hearts_3d', label: 'Phân Loại 5 Giới, Khóa Lưỡng Phân & Tiến Hóa Động Vật' },
  { pattern: /tiêu hóa|dạ dày|ruột non|nhung mao|amylase|pepsin|tuyến nước bọt|xương và cơ/i, sim2d: 'digestion_enzymes_2d', sim3d: 'digestive_tract_3d', label: 'Hệ Tiêu Hóa Người, Enzym & Hấp Thụ Ruột Non' },
  { pattern: /thẩm thấu|ưu trương|nhược trương|màng sinh chất|vận chuyển/i, sim2d: 'membrane_osmosis_2d', sim3d: 'phospholipid_bilayer_3d', label: 'Màng Sinh chất & Cân bằng Thẩm thấu' },
  { pattern: /tế bào nhân thực|bào quan|golgi|lưới nội chất|tế bào thực vật/i, sim2d: 'cell_organelles_2d', sim3d: 'eukaryotic_cell_3d', label: 'Cấu trúc Tế bào Nhân thực & Bào quan' },
  { pattern: /virus|phage|sinh tan|tiềm tan|capsid/i, sim2d: 'viral_lytic_cycle_2d', sim3d: 'virus_bacteriophage_3d', label: 'Chu trình Nhân lên của Virus & Phage T4' },
  { pattern: /enzyme|enzim|cơ chất|ức chế|hoạt hóa/i, sim2d: 'enzyme_kinetics_2d', sim3d: 'enzyme_substrate_3d', label: 'Động học Enzyme & Khớp nối Cơ chất' },
  { pattern: /nguyên phân|giảm phân|chu kì tế bào|thoi phân bào/i, sim2d: 'mitosis_meiosis_2d', sim3d: 'chromosome_mitosis_3d', label: 'Chu kì Tế bào, Nguyên phân & Giảm phân' },
  { pattern: /quang hợp|calvin|c3|c4|cam|diệp lục|lục lạp/i, sim2d: 'photosynthesis_calvin_2d', sim3d: 'chloroplast_thylakoid_3d', label: 'Pha Sáng – Chu trình Calvin & Quang hợp C3/C4' },
  { pattern: /hô hấp|ti thể|atp|krebs|đường phân/i, sim2d: 'cellular_respiration_2d', sim3d: 'mitochondria_atp_3d', label: 'Hô hấp Tế bào & Chuỗi Chuyền Electron Ti thể' },
  { pattern: /khí khổng|thoát hơi nước|mạch gỗ|mạch rây|trao đổi khoáng/i, sim2d: 'plant_transpiration_2d', sim3d: 'plant_vascular_3d', label: 'Cơ chế Đóng mở Khí khổng & Dòng mạch gỗ/rây' },
  { pattern: /hướng sáng|hướng trọng lực|auxin|phytohoocmon/i, sim2d: 'phytohormone_tropism_2d', sim3d: 'plant_vascular_3d', label: 'Hormone Thực vật Auxin & Tính hướng động' },
  { pattern: /tuần hoàn|tim|huyết áp|van tim|nhịp tim/i, sim2d: 'cardiac_cycle_2d', sim3d: 'human_heart_3d', label: 'Chu kì Tim & Hệ Tuần hoàn Máu' },
  { pattern: /phổi|phế nang|hemoglobin|bohr|trao đổi khí/i, sim2d: 'bohr_hemoglobin_2d', sim3d: 'alveoli_capillary_3d', label: 'Hiệu ứng Bohr Hemoglobin & Phế nang Phổi' },
  { pattern: /thận|nephron|bài tiết|nội môi|lọc máu/i, sim2d: 'nephron_filtration_2d', sim3d: 'nephron_kidney_3d', label: 'Cơ chế Lọc Cầu thận Nephron & Cân bằng Nội môi' },
  { pattern: /xinap|chất trung gian thần kinh|acetylcholin/i, sim2d: 'synapse_transmission_2d', sim3d: 'neuron_synapse_3d', label: 'Truyền tin Hóa học qua Khe Xináp' },
  { pattern: /thần kinh|điện thế hoạt động|phản xạ|sợi trục/i, sim2d: 'action_potential_2d', sim3d: 'neuron_synapse_3d', label: 'Điện thế Hoạt động Sợi trục & Phản xạ' },
  { pattern: /hoocmon|hormone|insulin|glucagon|đường huyết|tụy/i, sim2d: 'glucose_insulin_2d', sim3d: 'endocrine_pancreas_3d', label: 'Điều hòa Đường huyết Insulin – Glucagon' },
  { pattern: /phả hệ|bệnh di truyền người|bệnh mù màu|máu khó đông/i, sim2d: 'pedigree_genetics_2d', sim3d: 'mendel_peas_3d', label: 'Phân tích Phả hệ Di truyền Người' },
  { pattern: /nhóm máu|abo|truyền máu|kháng nguyên hồng cầu/i, sim2d: 'blood_typing_2d', sim3d: 'antibody_antigen_3d', label: 'Hệ Nhóm máu ABO & Phản ứng Ngưng kết' },
  { pattern: /miễn dịch|kháng thể|kháng nguyên|bạch cầu|vaccine/i, sim2d: 'immune_antibody_2d', sim3d: 'antibody_antigen_3d', label: 'Đáp ứng Miễn dịch Đặc hiệu Kháng nguyên – Kháng thể' },
  { pattern: /nhân đôi|tự sao|adn|dna|polymerase/i, sim2d: 'dna_replication_2d', sim3d: 'dna_double_helix_3d', label: 'Nhân đôi Bán bảo toàn Chuỗi Xoắn kép DNA' },
  { pattern: /phiên mã|dịch mã|mrna|ribosome|riboxom|codon/i, sim2d: 'transcription_translation_2d', sim3d: 'ribosome_translation_3d', label: 'Phiên mã & Dịch mã Tổng hợp Protein trên Ribosome' },
  { pattern: /operon lac|điều hòa gen|biểu hiện gen/i, sim2d: 'lac_operon_2d', sim3d: 'dna_double_helix_3d', label: 'Mô hình Điều hòa Hoạt động Gen Operon Lac' },
  { pattern: /pcr|điện di|agarose|taq/i, sim2d: 'pcr_electrophoresis_2d', sim3d: 'biotech_pcr_crispr_3d', label: 'Khuếch đại PCR & Điện di Gel DNA' },
  { pattern: /crispr|cas9|chỉnh sửa gen|công nghệ gen|plasmid/i, sim2d: 'crispr_editing_2d', sim3d: 'biotech_pcr_crispr_3d', label: 'Chỉnh sửa Gen CRISPR-Cas9 & Công nghệ Gen' },
  { pattern: /hoán vị|liên kết gen|morgan|tái tổ hợp/i, sim2d: 'gene_linkage_2d', sim3d: 'gene_linkage_3d', label: 'Liên kết Gen & Trao đổi chéo Hoán vị' },
  { pattern: /menđen|mendel|phân li độc lập|tỉ lệ 9:3:3:1|lai phân tích|sơ đồ lai|tính trạng/i, sim2d: 'mendel_punnett_2d', sim3d: 'mendel_peas_3d', label: 'Quy luật Phân li Độc lập Mendel & Sơ đồ lai' },
  { pattern: /hardy|weinberg|quần thể|ngẫu phối|tự thụ/i, sim2d: 'hardy_weinberg_2d', sim3d: 'population_genetics_3d', label: 'Di truyền Quần thể & Cân bằng Hardy–Weinberg' },
  { pattern: /chọn lọc tự nhiên|tiến hóa|hình thành loài|cách li/i, sim2d: 'natural_selection_2d', sim3d: 'population_genetics_3d', label: 'Chọn lọc Tự nhiên & Tiến hóa Quần thể' },
  { pattern: /sức chứa|logistic|tăng trưởng quần thể/i, sim2d: 'logistic_population_2d', sim3d: 'ecosystem_biome_3d', label: 'Tăng trưởng Quần thể Logistic & Sức chứa K' },
  { pattern: /con mồi|vật ăn thịt|lotka|biến động số lượng/i, sim2d: 'predator_prey_2d', sim3d: 'ecosystem_biome_3d', label: 'Chu kì Vật ăn thịt – Con mồi Lotka–Volterra' },
  { pattern: /chu trình|cacbon|nitơ|rhizobium/i, sim2d: 'carbon_nitrogen_cycle_2d', sim3d: 'ecosystem_biome_3d', label: 'Chu trình Sinh địa hóa Cacbon & Nitơ' },
  { pattern: /quần xã|lưới thức ăn|tháp sinh thái|bậc dinh dưỡng|sinh quyển/i, sim2d: 'trophic_pyramid_2d', sim3d: 'ecosystem_biome_3d', label: 'Tháp Sinh thái 10% & Hệ Sinh thái' }
];

export function resolveBioStepSim(
  lesson: BiologyLesson,
  stepIndex: number,
  stepTitle?: string,
  stepConcept?: string
): ResolvedBioStepSim {
  const combined = `${stepTitle || ''} ${stepConcept || ''}`;
  let sim2dId: BiologySimType = lesson.simulationType;
  let sim3dMode: Biology3DMode = lesson.sim3dType;
  let matchedLabel = '';

  if (stepIndex > 0 && combined.trim().length > 0) {
    for (const rule of KEYWORD_RULES) {
      if (rule.pattern.test(combined)) {
        sim2dId = rule.sim2d;
        sim3dMode = rule.sim3d || BIO_2D_TO_3D[rule.sim2d] || lesson.sim3dType;
        matchedLabel = rule.label;
        break;
      }
    }
  }

  const spec2D =
    BIOLOGY_2D_SIMS.find((s) => s.id === sim2dId) ||
    BIOLOGY_2D_SIMS.find((s) => s.id === lesson.simulationType) ||
    BIOLOGY_2D_SIMS[0];

  const resolved3dId = sim3dMode || BIO_2D_TO_3D[spec2D.id] || lesson.sim3dType;
  const spec3D =
    BIOLOGY_3D_SIMS.find((s) => s.id === resolved3dId) ||
    BIOLOGY_3D_SIMS.find((s) => s.id === lesson.sim3dType) ||
    BIOLOGY_3D_SIMS[0];

  return {
    sim2dId: spec2D.id,
    sim3dMode: spec3D.id,
    spec2D,
    spec3D,
    regimeLabel: matchedLabel || spec2D.title,
    observationGoal:
      stepIndex === 0
        ? `Quan sát quá trình sinh học và điều chỉnh thông số cho "${lesson.title}".`
        : `Thay đổi các thông số sinh học để đối chiếu kết quả của mục "${stepTitle || spec2D.title}".`,
    defaultParams: {
      ...spec2D.defaultParams,
      ...(spec2D.id === lesson.simulationType ? lesson.defaultParams : {})
    },
    paramBounds: spec2D.paramBounds
  };
}
