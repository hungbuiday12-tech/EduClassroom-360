import { Chemistry3DMode, ChemistryLesson, ChemistrySimType } from '../../types';
import {
  CHEMISTRY_2D_SIMS,
  CHEMISTRY_3D_SIMS,
  Chemistry2DSimSpec,
  Chemistry3DSimSpec
} from '../../data/chemistryDomainsData';
import { PhysicsParamBound as ParamBound } from '../../data/physicsDomainsData';

export interface ResolvedChemStepSim {
  sim2dId: ChemistrySimType;
  sim3dMode: Chemistry3DMode;
  spec2D: Chemistry2DSimSpec;
  spec3D: Chemistry3DSimSpec;
  regimeLabel: string;
  observationGoal: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, ParamBound>;
}

const CHEM_2D_TO_3D: Record<ChemistrySimType, Chemistry3DMode> = {
  atomic_orbitals_2d: 'atomic_orbitals_3d',
  periodic_trends_2d: 'periodic_tower_3d',
  vsepr_bonding_2d: 'vsepr_geometry_3d',
  crystal_packing_2d: 'crystal_lattice_3d',
  enthalpy_hess_2d: 'activation_surface_3d',
  reaction_kinetics_2d: 'activation_surface_3d',
  maxwell_boltzmann_2d: 'activation_surface_3d',
  equilibrium_shift_2d: 'equilibrium_piston_3d',
  acid_base_titration_2d: 'titration_bench_3d',
  buffer_ph_2d: 'titration_bench_3d',
  galvanic_cell_2d: 'galvanic_cell_3d',
  electrolysis_faraday_2d: 'electrolysis_cell_3d',
  metal_activity_2d: 'galvanic_cell_3d',
  halogen_displacement_2d: 'equilibrium_piston_3d',
  haber_ammonia_2d: 'equilibrium_piston_3d',
  contact_sulfuric_2d: 'equilibrium_piston_3d',
  redox_balancing_2d: 'galvanic_cell_3d',
  hydrocarbon_isomers_2d: 'methane_ethane_3d',
  alkene_addition_2d: 'methane_ethane_3d',
  benzene_substitution_2d: 'benzene_pi_3d',
  esterification_2d: 'ester_reflux_3d',
  soap_micelle_2d: 'colloid_micelle_3d',
  carbohydrate_ring_2d: 'ester_reflux_3d',
  amino_acid_zwitterion_2d: 'polymer_chain_3d',
  polymerization_2d: 'polymer_chain_3d',
  corrosion_protection_2d: 'galvanic_cell_3d',
  colligative_boiling_2d: 'equilibrium_piston_3d',
  flame_spectroscopy_2d: 'spectroscopy_prism_3d',
  complex_ligand_2d: 'coordination_complex_3d',
  stoichiometry_gas_2d: 'equilibrium_piston_3d'
};

const KEYWORD_RULES: {
  pattern: RegExp;
  sim2d: ChemistrySimType;
  sim3d?: Chemistry3DMode;
  label: string;
}[] = [
  { pattern: /orbital|obitan|phân lớp|cấu hình electron|bohr|lượng tử/i, sim2d: 'atomic_orbitals_2d', sim3d: 'atomic_orbitals_3d', label: 'Cấu hình Electron & Orbital Nguyên tử' },
  { pattern: /tuần hoàn|bán kính|độ âm điện|năng lượng ion/i, sim2d: 'periodic_trends_2d', sim3d: 'periodic_tower_3d', label: 'Biến thiên Tuần hoàn Tính chất Nguyên tố' },
  { pattern: /quang phổ|ngọn lửa|vạch phát xạ/i, sim2d: 'flame_spectroscopy_2d', sim3d: 'spectroscopy_prism_3d', label: 'Quang phổ Vạch & Màu Ngọn lửa Ion Kim loại' },
  { pattern: /vsepr|liên kết|cộng hóa trị|lai hóa|sp2|sp3/i, sim2d: 'vsepr_bonding_2d', sim3d: 'vsepr_geometry_3d', label: 'Hình học Phân tử VSEPR & Lai hóa Orbital' },
  { pattern: /mạng tinh thể|nacl|kim cương|đặc khít|bcc|fcc/i, sim2d: 'crystal_packing_2d', sim3d: 'crystal_lattice_3d', label: 'Mạng Tinh thể Ion / Kim loại / Cộng hóa trị' },
  { pattern: /phức chất|phối tử|trường tinh thể|t2g|kim loại chuyển tiếp/i, sim2d: 'complex_ligand_2d', sim3d: 'coordination_complex_3d', label: 'Phức chất Phối trí & Tách mức Trường tinh thể' },
  { pattern: /enthalpy|biến thiên nhiệt|tỏa nhiệt|thu nhiệt|hess/i, sim2d: 'enthalpy_hess_2d', sim3d: 'activation_surface_3d', label: 'Giản đồ Năng lượng & Biến thiên Enthalpy' },
  { pattern: /boltzmann|phân bố năng lượng|va chạm hiệu quả/i, sim2d: 'maxwell_boltzmann_2d', sim3d: 'activation_surface_3d', label: 'Phân bố Năng lượng Maxwell–Boltzmann & Hoạt hóa' },
  { pattern: /tốc độ phản ứng|năng lượng hoạt hóa|xúc tác|van.?t hoff/i, sim2d: 'reaction_kinetics_2d', sim3d: 'activation_surface_3d', label: 'Động học Tốc độ Phản ứng & Xúc tác' },
  { pattern: /haber|amoniac|nh3|nitơ|phân đạm/i, sim2d: 'haber_ammonia_2d', sim3d: 'equilibrium_piston_3d', label: 'Tổng hợp Amoniac Haber–Bosch & Cân bằng Khí' },
  { pattern: /lưu huỳnh|sunfuric|so2|so3|tiếp xúc/i, sim2d: 'contact_sulfuric_2d', sim3d: 'equilibrium_piston_3d', label: 'Quy trình Tiếp xúc & Axit Sunfuric' },
  { pattern: /cân bằng|le chatelier|thuận nghịch|kc|kp/i, sim2d: 'equilibrium_shift_2d', sim3d: 'equilibrium_piston_3d', label: 'Chuyển dịch Cân bằng Hóa học (Le Chatelier)' },
  { pattern: /dung dịch đệm|henderson|thủy phân muối|ka|kb/i, sim2d: 'buffer_ph_2d', sim3d: 'titration_bench_3d', label: 'Dung dịch Đệm & Cân bằng Henderson–Hasselbalch' },
  { pattern: /chuẩn độ|titration|tương đương|phenolphthalein|axit|acid|bazơ|base|ph/i, sim2d: 'acid_base_titration_2d', sim3d: 'titration_bench_3d', label: 'Đường cong Chuẩn độ Axit – Bazơ & Độ pH' },
  { pattern: /pin điện|galvanic|suất điện động|thế điện cực|nernst|daniell/i, sim2d: 'galvanic_cell_2d', sim3d: 'galvanic_cell_3d', label: 'Pin Điện hóa & Thế Điện cực Chuẩn' },
  { pattern: /điện phân|faraday|cực dương|cực âm|catot|anot/i, sim2d: 'electrolysis_faraday_2d', sim3d: 'electrolysis_cell_3d', label: 'Bình Điện phân & Định luật Faraday' },
  { pattern: /ăn mòn|bảo vệ catot|hi sinh/i, sim2d: 'corrosion_protection_2d', sim3d: 'galvanic_cell_3d', label: 'Ăn mòn Điện hóa & Bảo vệ Catot' },
  { pattern: /dãy hoạt động|đẩy kim loại|luyện kim|nhiệt nhôm|kiềm|sắt|nhôm/i, sim2d: 'metal_activity_2d', sim3d: 'galvanic_cell_3d', label: 'Dãy Hoạt động Kim loại & Luyện kim' },
  { pattern: /oxi hóa.?khử|thăng bằng electron|số oxi hóa/i, sim2d: 'redox_balancing_2d', sim3d: 'galvanic_cell_3d', label: 'Thăng bằng Electron & Phản ứng Oxi hóa – Khử' },
  { pattern: /halogen|clo|brom|iot|flo/i, sim2d: 'halogen_displacement_2d', sim3d: 'equilibrium_piston_3d', label: 'Tính Oxi hóa Nhóm Halogen & Đẩy Halogenua' },
  { pattern: /nhiệt độ sôi|nhiệt độ đông|áp suất thẩm thấu|hệ số van/i, sim2d: 'colligative_boiling_2d', sim3d: 'equilibrium_piston_3d', label: 'Tính chất Tập hợp Dung dịch (Tăng điểm sôi)' },
  { pattern: /benzen|aren|vòng thơm|stiren|electrophin/i, sim2d: 'benzene_substitution_2d', sim3d: 'benzene_pi_3d', label: 'Cấu trúc Vòng Thơm Benzen & Thế Electrophin' },
  { pattern: /ank?en|alken|cộng|markovnikov|brom|anđehit|xeton|ancol|phenol/i, sim2d: 'alkene_addition_2d', sim3d: 'methane_ethane_3d', label: 'Phản ứng Cộng Không no & Quy tắc Markovnikov' },
  { pattern: /ankan|alkin|đồng phân|hidrocacbon|hiđrocacbon/i, sim2d: 'hydrocarbon_isomers_2d', sim3d: 'methane_ethane_3d', label: 'Đồng phân & Cấu hình Mạch Hiđrocacbon' },
  { pattern: /xà phòng|mixen|micelle|chất giặt rửa|lipit|chất béo/i, sim2d: 'soap_micelle_2d', sim3d: 'colloid_micelle_3d', label: 'Xà phòng, Chất béo & Cấu trúc Mixen' },
  { pattern: /este|ester|thủy phân|hồi lưu/i, sim2d: 'esterification_2d', sim3d: 'ester_reflux_3d', label: 'Phản ứng Este hóa Thuận nghịch & Thủy phân' },
  { pattern: /glucozo|glucozơ|saccarozo|tinh bột|xenlulozo|cacbohidrat/i, sim2d: 'carbohydrate_ring_2d', sim3d: 'ester_reflux_3d', label: 'Cấu trúc Vòng Glucozơ & Cacbohiđrat' },
  { pattern: /amino axit|amin|peptit|protein|lưỡng cực|đẳng điện/i, sim2d: 'amino_acid_zwitterion_2d', sim3d: 'polymer_chain_3d', label: 'Ion Lưỡng cực Amino Axit & Chuỗi Peptit' },
  { pattern: /polime|polymer|trùng hợp|trùng ngưng|nhựa|tơ|cao su/i, sim2d: 'polymerization_2d', sim3d: 'polymer_chain_3d', label: 'Phản ứng Trùng hợp & Chuỗi Đại phân tử Polime' },
  { pattern: /khí lý tưởng|áp suất|tỉ khối|hiệu suất|lượng chất|đkc/i, sim2d: 'stoichiometry_gas_2d', sim3d: 'equilibrium_piston_3d', label: 'Hợp thức Hóa học & Phương trình Trạng thái Khí' }
];

export function resolveChemStepSim(
  lesson: ChemistryLesson,
  stepIndex: number,
  stepTitle?: string,
  stepConcept?: string
): ResolvedChemStepSim {
  const combined = `${stepTitle || ''} ${stepConcept || ''}`;
  let sim2dId: ChemistrySimType = lesson.simulationType;
  let sim3dMode: Chemistry3DMode = lesson.sim3dType;
  let matchedLabel = '';

  if (stepIndex > 0 && combined.trim().length > 0) {
    for (const rule of KEYWORD_RULES) {
      if (rule.pattern.test(combined)) {
        sim2dId = rule.sim2d;
        sim3dMode = rule.sim3d || CHEM_2D_TO_3D[rule.sim2d] || lesson.sim3dType;
        matchedLabel = rule.label;
        break;
      }
    }
  }

  const spec2D =
    CHEMISTRY_2D_SIMS.find((s) => s.id === sim2dId) ||
    CHEMISTRY_2D_SIMS.find((s) => s.id === lesson.simulationType) ||
    CHEMISTRY_2D_SIMS[0];

  const resolved3dId = sim3dMode || CHEM_2D_TO_3D[spec2D.id] || lesson.sim3dType;
  const spec3D =
    CHEMISTRY_3D_SIMS.find((s) => s.id === resolved3dId) ||
    CHEMISTRY_3D_SIMS.find((s) => s.id === lesson.sim3dType) ||
    CHEMISTRY_3D_SIMS[0];

  return {
    sim2dId: spec2D.id,
    sim3dMode: spec3D.id,
    spec2D,
    spec3D,
    regimeLabel: matchedLabel || spec2D.title,
    observationGoal:
      stepIndex === 0
        ? `Quan sát hiện tượng định tính và thay đổi tham số ban đầu cho "${lesson.title}".`
        : `Điều chỉnh các thanh trượt định lượng để kiểm chứng hệ thức mục "${stepTitle || spec2D.title}".`,
    defaultParams: {
      ...spec2D.defaultParams,
      ...(spec2D.id === lesson.simulationType ? lesson.defaultParams : {})
    },
    paramBounds: spec2D.paramBounds
  };
}
