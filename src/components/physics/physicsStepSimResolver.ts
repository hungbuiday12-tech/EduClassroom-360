import { PhysicsLesson, PhysicsSimType } from '../../types';
import { PHYSICS_2D_SIMS, PhysicsParamBound } from '../../data/physicsDomainsData';
import { DEFAULT_PHYSICS_2D_FLAGS, Physics2DFlags } from './physics2DEngine';
import { CUSTOM_STEP_SIM_SPECS, CustomStepSimId } from './physicsStepCustomRenderers';

export type AnyStepSimId = PhysicsSimType | CustomStepSimId;

export interface ResolvedStepSim {
  simId: AnyStepSimId;
  isCustomEngine: boolean;
  title: string;
  formula: string;
  regimeLabel: string;
  observationGoal: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, PhysicsParamBound>;
  presets: {
    label: string;
    description: string;
    params: Record<string, number>;
  }[];
  flags: Physics2DFlags;
}

interface StepOverrideRule {
  simId: AnyStepSimId;
  regimeLabel: string;
  observationGoal: string;
  paramOverrides?: Record<string, number>;
  flagOverrides?: Partial<Physics2DFlags>;
}

const EXPLICIT_STEP_SIM_MAP: Record<string, StepOverrideRule> = {
  // ---------------- LỚP 9 KHTN (GDPT 2018: BÀI 1 - BÀI 17) ----------------
  'phys-9-b1:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Dụng cụ đo Điện · Ampe kế, Vôn kế & Biến áp Nguồn',
    observationGoal:
      'Quan sát cách đọc số chỉ cường độ dòng điện I (A) trên ampe kế và hiệu điện thế U (V) trên vôn kế trong mạch an toàn.'
  },
  'phys-9-b1:1': {
    simId: 'lens_optics',
    regimeLabel: 'Dụng cụ Quang học · Băng quang học, Đèn chiếu & Thấu kính',
    observationGoal:
      'Kiểm tra trục chính quang học, vật sáng, thấu kính và màn hứng ảnh đặt đồng trục trên giá thí nghiệm.'
  },
  'phys-9-b1:2': {
    simId: 'measurement_error_lab',
    regimeLabel: 'An toàn Thực hành & Ghi chép Sai số Phép đo KHTN 9',
    observationGoal:
      'Thực hành lấy nhiều lần đo độc lập để tính giá trị trung bình và hạn chế sai số chủ quan khi đọc thước/đồng hồ.'
  },

  'phys-9-mech-heat:0': {
    simId: 'free_fall_energy',
    regimeLabel: 'Khảo sát Động năng W_đ = ½mv² theo Khối lượng & Vận tốc',
    observationGoal:
      'Quan sát động năng W_đ tăng nhanh theo bình phương vận tốc v² khi tăng độ cao h thả vật.'
  },
  'phys-9-mech-heat:1': {
    simId: 'free_fall_energy',
    regimeLabel: 'Thế năng Trọng trường W_t = Ph = mgh',
    observationGoal:
      'Thay đổi khối lượng m, độ cao h và gia tốc g để thấy thế năng phụ thuộc tuyến tính vào m và h.'
  },
  'phys-9-mech-heat:2': {
    simId: 'free_fall_energy',
    regimeLabel: 'Chuyển hóa Động năng – Thế năng & Cơ năng',
    observationGoal:
      'Theo dõi hai cột năng lượng W_đ và W_t bù trừ lẫn nhau trong quá trình vật rơi tự do.'
  },
  'phys-9-mech-heat:3': {
    simId: 'free_fall_energy',
    regimeLabel: 'Thực hành Kiểm chứng Bảo toàn Cơ năng & Lực cản',
    observationGoal:
      'Bật Lực cản không khí để quan sát cơ năng hao phí chuyển hóa dần thành nhiệt.'
  },

  'phys-9-power-bill:0': {
    simId: 'simple_pendulum',
    regimeLabel: 'Định nghĩa Cơ năng W = W_đ + W_t qua Con lắc Đơn',
    observationGoal:
      'Ở vị trí biên thế năng đạt cực đại, qua vị trí cân bằng động năng đạt cực đại.'
  },
  'phys-9-power-bill:1': {
    simId: 'free_fall_energy',
    regimeLabel: 'Chuyển hóa & Bảo toàn Cơ năng trong Trọng trường',
    observationGoal:
      'Quan sát tổng W = W_đ + W_t luôn giữ nguyên khi bỏ qua ma sát và lực cản.'
  },
  'phys-9-power-bill:2': {
    simId: 'work_power_joule',
    regimeLabel: 'Cơ năng có Ma sát & Hao phí Năng lượng',
    observationGoal:
      'Tăng hệ số ma sát μ để đo phần cơ năng chuyển hóa thành nhiệt năng hao phí.'
  },

  'phys-9-b4:0': {
    simId: 'work_power_joule',
    regimeLabel: 'Công Cơ học A = F·s·cosα & Điều kiện Sinh công',
    observationGoal:
      'Kéo lực F dọc hướng dịch chuyển vs chếch góc α để thấy rõ công chỉ tính theo thành phần lực song song đường đi.',
    paramOverrides: { force: 80, angle: 0, mu: 0.1 }
  },
  'phys-9-b4:1': {
    simId: 'work_power_joule',
    regimeLabel: 'Công suất P = A/t = F·v & Tốc độ Sinh công',
    observationGoal:
      'Tăng lực kéo F để quan sát tốc độ sinh công P tăng theo tích F_x · v.',
    paramOverrides: { force: 120, angle: 25, mu: 0.15 }
  },
  'phys-9-b4:2': {
    simId: 'work_power_joule',
    regimeLabel: 'Hiệu suất Máy cơ Đơn giản & Công thắng Ma sát',
    observationGoal:
      'Thay đổi hệ số ma sát μ để kiểm chứng công có ích, công toàn phần và hiệu suất H%.',
    paramOverrides: { force: 90, angle: 30, mu: 0.25 }
  },

  'phys-9-b5:0': {
    simId: 'light_refraction',
    regimeLabel: 'Hiện tượng & Định luật Khúc xạ n₁·sin(i) = n₂·sin(r)',
    observationGoal:
      'Điều chỉnh góc tới i và chiết suất n₂ để thấy tia khúc xạ gãy gần pháp tuyến khi n₂ > n₁.'
  },
  'phys-9-b5:1': {
    simId: 'light_refraction',
    regimeLabel: 'Chiết suất Tuyệt đối n = c/v & So sánh Môi trường',
    observationGoal:
      'So sánh góc khúc xạ r khi ánh sáng đi từ không khí vào nước (1,33), thủy tinh (1,5) và kim cương (2,4).',
    paramOverrides: { angleI: 50, n1: 1.0, n2: 1.33 }
  },
  'phys-9-b5:2': {
    simId: 'light_refraction',
    regimeLabel: 'Tính Thuận nghịch & Ảnh ảo trong Bể nước',
    observationGoal:
      'Cho ánh sáng đi từ nước (n₁ = 1,33) ra không khí (n₂ = 1,0) để thấy tia khúc xạ lệch xa pháp tuyến (r > i).',
    paramOverrides: { angleI: 30, n1: 1.33, n2: 1.0 }
  },

  'phys-9-b6:0': {
    simId: 'fiber_optic_tir',
    regimeLabel: 'Điều kiện Phản xạ Toàn phần n₁ > n₂ & i ≥ i_th',
    observationGoal:
      'Tăng góc tới tới khi vượt góc tới hạn sin(i_th) = n₂/n₁: tia khúc xạ biến mất hoàn toàn!',
    paramOverrides: { nCore: 1.52, nClad: 1.36, launchAngleDeg: 22 }
  },
  'phys-9-b6:1': {
    simId: 'fiber_optic_tir',
    regimeLabel: 'Truyền Tín hiệu Ánh sáng trong Sợi Cáp quang',
    observationGoal:
      'Quan sát tia sáng phản xạ toàn phần liên tiếp dọc lõi cáp quang nhờ n_lõi > n_vỏ.',
    paramOverrides: { nCore: 1.6, nClad: 1.36, launchAngleDeg: 18 }
  },
  'phys-9-b6:2': {
    simId: 'light_refraction',
    regimeLabel: 'Kiểm chứng Rò rỉ Tia khúc xạ khi i < i_th',
    observationGoal:
      'So sánh trạng thái chưa đạt góc tới hạn (có tia khúc xạ yếu) với trạng thái phản xạ toàn phần hoàn toàn.',
    paramOverrides: { angleI: 55, n1: 1.5, n2: 1.0 }
  },

  'phys-9-b9:0': {
    simId: 'lens_optics',
    regimeLabel: 'Thực hành Đo Tiêu cự TKHT · Chùm tia Song song Hội tụ',
    observationGoal:
      'Đặt vật xa thấu kính (d > 2f) để kiểm chứng tia song song trục chính luôn đi qua tiêu điểm ảnh F\'.',
    paramOverrides: { f: 15, d: 45, objH: 10 }
  },
  'phys-9-b9:1': {
    simId: 'lens_optics',
    regimeLabel: 'Phương pháp Đối xứng L = 4f (d = d\' = 2f)',
    observationGoal:
      'Đặt vật tại d = 2f (30 cm với f = 15 cm) để thu ảnh thật ngược chiều cao đúng bằng vật tại d\' = 2f.',
    paramOverrides: { f: 15, d: 30, objH: 10 }
  },
  'phys-9-b9:2': {
    simId: 'measurement_error_lab',
    regimeLabel: 'Xử lý Số liệu Thực hành & Sai số f = L/4',
    observationGoal:
      'Quan sát các lần đo lặp lại khoảng cách L = d + d\' quanh giá trị thực để tính tiêu cự trung bình.'
  },

  'phys-9-b10:0': {
    simId: 'lens_optics',
    regimeLabel: 'Nguyên lý Kính lúp · Đặt vật d < f cho Ảnh ảo Phóng đại',
    observationGoal:
      'Kéo vật vào trong tiêu cự (d < f) để quan sát ảnh ảo cùng chiều lớn hơn vật qua kính lúp.',
    paramOverrides: { f: 18, d: 10, objH: 8 }
  },
  'phys-9-b10:1': {
    simId: 'telescope_microscope',
    regimeLabel: 'Kính lúp & Hệ quang học Phóng đại G = 25/f',
    observationGoal:
      'Điều chỉnh tiêu cự vật kính và thị kính để khảo sát số bội giác góc và đường truyền tia sáng.'
  },
  'phys-9-b10:2': {
    simId: 'lens_optics',
    regimeLabel: 'Phương pháp Tam giác Đồng dạng Giải Bài tập Thấu kính',
    observationGoal:
      'Thay đổi d và f để đối chiếu tỉ lệ A\'B\'/AB = |d\'|/d giữa ảnh thật và ảnh ảo.',
    paramOverrides: { f: 15, d: 22, objH: 9 }
  },

  'phys-9-b11:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Đường đặc trưng I – U & Định luật Ohm I = U / R',
    observationGoal:
      'Thay đổi hiệu điện thế U và điện trở R để kiểm nghiệm I tỉ lệ thuận với U và tỉ lệ nghịch với R.'
  },
  'phys-9-b11:1': {
    simId: 'ohm_circuit',
    regimeLabel: 'Điện trở Dây dẫn R = ρl/S & Vai trò Biến trở',
    observationGoal:
      'Thay đổi R₁ để mô phỏng việc điều chỉnh chiều dài dây dẫn hay biến trở trong mạch.',
    paramOverrides: { voltage: 12, r1: 12, r2: 8, circuitType: 0 }
  },
  'phys-9-b11:2': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Ảnh hưởng Điện trở R lên Cường độ Dòng & Nhiệt tỏa',
    observationGoal:
      'So sánh khi thay dây đốt điện trở R nhỏ (dòng I lớn) và R lớn ở cùng hiệu điện thế U.',
    paramOverrides: { voltage: 12, resistance: 4, waterMass: 0.5 }
  },

  'phys-9-elec:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Mạch điện Nối tiếp · R_tđ = R₁ + R₂ & U = U₁ + U₂',
    observationGoal:
      'Ở chế độ nối tiếp (circuitType = 0), cường độ dòng điện qua mọi điện trở đều bằng nhau.',
    paramOverrides: { voltage: 12, r1: 10, r2: 15, circuitType: 0 }
  },
  'phys-9-elec:1': {
    simId: 'ohm_circuit',
    regimeLabel: 'Mạch điện Song song · 1/R_tđ = 1/R₁ + 1/R₂',
    observationGoal:
      'Chuyển sang mạch song song (circuitType = 1) để thấy điện trở tương đương giảm và dòng mạch chính tăng.',
    paramOverrides: { voltage: 12, r1: 10, r2: 15, circuitType: 1 }
  },
  'phys-9-elec:2': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Thực hành Phân tích Nhiệt tỏa ra trên Mạch điện',
    observationGoal:
      'Quan sát công suất tỏa nhiệt tỉ lệ với bình phương cường độ dòng điện I².'
  },

  'phys-9-b13:0': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Năng lượng Điện A = UIt & Định luật Jun – Len-xơ',
    observationGoal:
      'Điều chỉnh hiệu điện thế U, điện trở dây đốt R để theo dõi nhiệt lượng tỏa ra Q = I²Rt và nhiệt độ nước tăng dần.',
    paramOverrides: { voltage: 12, resistance: 6, waterMass: 0.5 }
  },
  'phys-9-b13:1': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Công suất Điện P = U·I = U²/R & Thiết bị Định mức',
    observationGoal:
      'Tăng gấp đôi U (từ 12V lên 24V) để thấy công suất P tăng gấp 4 lần trên cùng điện trở tải.',
    paramOverrides: { voltage: 24, resistance: 6, waterMass: 0.5 }
  },
  'phys-9-b13:2': {
    simId: 'transformer_2d',
    regimeLabel: 'Chỉ số Công tơ Điện (kWh) & An toàn Lưới điện 220V',
    observationGoal:
      'Theo dõi điện áp truyền tải, công suất tiêu thụ và tính tiền điện theo số kWh thực tế.'
  },

  'phys-9-optics:0': {
    simId: 'light_refraction',
    regimeLabel: 'Khúc xạ Ánh sáng qua Mặt phân cách Hai môi trường',
    observationGoal:
      'Kéo góc tới i và chiết suất n₂ để thấy tia khúc xạ lệch lại gần pháp tuyến (n₁ < n₂) hay xa pháp tuyến.'
  },
  'phys-9-optics:1': {
    simId: 'lens_optics',
    regimeLabel: 'Thấu kính Hội tụ & Ba Tia sáng Đặc biệt',
    observationGoal:
      'Quan sát 3 tia đặc biệt đi qua quang tâm O, song song trục chính qua F\' và cho ảnh thật ngược chiều khi d > f.'
  },
  'phys-9-optics:2': {
    simId: 'lens_optics',
    regimeLabel: 'Thấu kính Phân kì & Ảnh ảo cùng chiều (f < 0)',
    observationGoal:
      'So sánh sự bẻ chùm tia ló phân kì khiến ảnh A\'B\' luôn là ảnh ảo, cùng chiều và nhỏ hơn vật.',
    flagOverrides: { isDiverging: true }
  },

  'phys-9-math-vec:0': {
    simId: 'vector_addition_2d',
    regimeLabel: 'Lượng giác & Chiếu Vectơ lên Hệ trục Vuông góc Oxy',
    observationGoal:
      'Kiểm nghiệm Fx = F·cosα và Fy = F·sinα bằng cách đổi góc α giữa các véctơ.'
  },
  'phys-9-math-vec:1': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Ý nghĩa Độ dốc Đồ thị Bậc nhất y = ax + b (x–t & v–t)',
    observationGoal:
      'Hệ số góc càng dốc biểu thị vận tốc/gia tốc càng lớn; thay đổi tham số để thấy độ nghiêng đường thẳng.'
  },
  'phys-9-math-vec:2': {
    simId: 'vector_addition_2d',
    regimeLabel: 'Quy tắc Hình bình hành Cộng Vectơ',
    observationGoal:
      'Thay đổi góc α (0°, 60°, 90°, 180°) để thấy hợp lực R thay đổi từ R_max = F₁+F₂ xuống R_min = |F₁−F₂|.',
    paramOverrides: { f1: 45, f2: 35, angleDeg: 60 }
  },

  'phys-9-energy-refract:0': {
    simId: 'prism_dispersion',
    regimeLabel: 'Tán sắc Ánh sáng Trắng qua Lăng kính Thủy tinh',
    observationGoal:
      'Ánh sáng trắng tách thành dải cầu vồng Đỏ → Tím vì chiết suất n_tím > n_đỏ nên tia tím bị lệch nhiều nhất.'
  },
  'phys-9-energy-refract:1': {
    simId: 'light_refraction',
    regimeLabel: 'Định luật Khúc xạ & Ánh sáng Đơn sắc qua Mặt phẳng',
    observationGoal:
      'Thay đổi chiết suất môi trường và góc tới i để khảo sát n₁·sin(i) = n₂·sin(r).'
  },
  'phys-9-energy-refract:2': {
    simId: 'prism_dispersion',
    regimeLabel: 'Phổ Màu & Vật Hấp thụ – Tán xạ Ánh sáng',
    observationGoal:
      'Điều chỉnh góc chiết quang và chiết suất lăng kính để quan sát độ rộng dải quang phổ.'
  },

  'phys-9-induction-ac:0': {
    simId: 'magnetic_induction',
    regimeLabel: 'Hiện tượng Cảm ứng Điện từ khi Từ thông Biến thiên',
    observationGoal:
      'Chỉ khi nam châm chuyển động tương đối làm số đường sức xuyên qua cuộn dây biến thiên thì kim điện kế mới lệch.',
    paramOverrides: { magnetSpeed: 4.5, turns: 20, bField: 1.4 }
  },
  'phys-9-induction-ac:1': {
    simId: 'magnetic_induction',
    regimeLabel: 'Tạo Dòng điện Xoay chiều & Quy tắc Đảo chiều Dòng cảm ứng',
    observationGoal:
      'Đảo cực nam châm hoặc đổi tốc độ dao động để quan sát chiều dòng điện cảm ứng đổi dấu tuần hoàn.',
    paramOverrides: { magnetSpeed: 6, turns: 20, bField: 1.8 },
    flagOverrides: { flipMagnet: true }
  },
  'phys-9-induction-ac:2': {
    simId: 'magnetic_induction',
    regimeLabel: 'Nguyên lý Máy phát Điện Xoay chiều (Stato & Rôto)',
    observationGoal:
      'Thay đổi số vòng dây N và cảm ứng từ B để thấy biên độ suất điện động xoay chiều tăng tỉ lệ.',
    paramOverrides: { magnetSpeed: 8, turns: 24, bField: 2.2 }
  },

  'phys-9-b15:0': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Tác dụng Nhiệt, Phát sáng & Từ của Dòng Xoay chiều',
    observationGoal:
      'Quan sát tác dụng tỏa nhiệt và chuyển hóa điện năng trong các thiết bị gia dụng dùng dòng xoay chiều.'
  },
  'phys-9-b15:1': {
    simId: 'transformer_2d',
    regimeLabel: 'Máy Biến áp & Giảm Hao phí Truyền tải ΔP = P²R / U²',
    observationGoal:
      'Tăng tỉ số vòng N₂/N₁ để nâng điện áp truyền tải, giảm mạnh hao phí tỏa nhiệt trên đường dây.'
  },
  'phys-9-b15:2': {
    simId: 'transformer_2d',
    regimeLabel: 'Tối ưu Lưới điện Cao thế 500 kV & Hạ áp Dân dụng 220V',
    observationGoal:
      'So sánh phần trăm công suất hao phí khi tăng N₂/N₁ gấp 5 lần so với lưới hạ áp trực tiếp.',
    paramOverrides: { u1: 220, n1: 400, n2: 2000, rLine: 25 }
  },

  'phys-9-b16:0': {
    simId: 'thermal_gas',
    regimeLabel: 'Vòng Năng lượng Mặt Trời & Đối lưu Khí quyển',
    observationGoal:
      'Quan sát sự chuyển động nhiệt của phân tử khí khi nhiệt độ tăng — động lực tạo gió và vòng tuần hoàn nước.'
  },
  'phys-9-b16:1': {
    simId: 'free_fall_energy',
    regimeLabel: 'Thủy năng & Hiệu suất Năng lượng Tái tạo',
    observationGoal:
      'Khảo sát thế năng cột nước chuyển hóa thành động năng quay tuabin và phần năng lượng hao phí.'
  },
  'phys-9-b16:2': {
    simId: 'work_power_joule',
    regimeLabel: 'So sánh Hiệu suất & Công suất Phát Điện Năng lượng Xanh',
    observationGoal:
      'Điều chỉnh lực dẫn động và ma sát để theo dõi phần năng lượng có ích so với năng lượng đầu vào.',
    paramOverrides: { force: 110, angle: 15, mu: 0.1 }
  },

  // ---------------- LỚP 10 ----------------
  'phys-10-intro-err:0': {
    simId: 'measurement_error_lab',
    regimeLabel: 'Thực hành Đo kiểm & Phân biệt Sai số Thực nghiệm',
    observationGoal:
      'Quan sát tập hợp 6 lần đo độc lập phân bố quanh giá trị thực để tính giá trị trung bình x̄.'
  },
  'phys-10-intro-err:1': {
    simId: 'measurement_error_lab',
    regimeLabel: 'Sai số Hệ thống (Lệch điểm 0) vs Sai số Ngẫu nhiên',
    observationGoal:
      'Tăng độ lệch điểm 0 (sysBias) để thấy toàn bộ điểm đo dịch khỏi giá trị thực dù độ lặp lại rất chụm.',
    paramOverrides: { trueVal: 2.0, randomJitter: 0.02, sysBias: 0.14 }
  },
  'phys-10-intro-err:2': {
    simId: 'measurement_error_lab',
    regimeLabel: 'Tính Sai số Tỉ đối δ và Biểu diễn Kết quả Đo',
    observationGoal:
      'Theo dõi đồng thời sai số tuyệt đối Δx và sai số tỉ đối δ(%) tự động cập nhật.'
  },

  'phys-10-uniform:0': {
    simId: 'distance_displacement_rel',
    regimeLabel: 'Phân biệt Quãng đường (s) vs Độ dịch chuyển (d) 1D',
    observationGoal:
      'Vật đi thẳng rồi quay đầu: quãng đường s tiếp tục tăng nhưng độ lớn độ dịch chuyển |d| giảm lại.',
    flagOverrides: { airDrag: true }
  },
  'phys-10-uniform:1': {
    simId: 'distance_displacement_rel',
    regimeLabel: 'Tổng hợp Độ dịch chuyển & Cộng Vận tốc Qua sông v₁₃ = v₁₂ + v₂₃',
    observationGoal:
      'Ca nô chạy ngang sông kết hợp dòng nước đẩy xuôi tạo quỹ đạo xiên và vận tốc tổng hợp theo định lí Pitago.'
  },
  'phys-10-uniform:2': {
    simId: 'average_velocity_stages',
    regimeLabel: 'Phân tích Đồ thị Độ dịch chuyển – Thời gian (d – t)',
    observationGoal:
      'Độ dốc của đồ thị chính là vận tốc ở từng chặng; đoạn nằm ngang chứng tỏ vật đứng yên.'
  },

  'phys-10-accel:0': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Gia tốc a & Dấu của Gia tốc trong Biến đổi đều',
    observationGoal:
      'Thử cho v₀ và a trái dấu (chậm dần đều) vs cùng dấu (nhanh dần đều) để xem đồ thị v(t) đổi chiều.'
  },
  'phys-10-accel:1': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Kiểm chứng Bộ 3 Phương trình v(t), d(t) & v² − v₀² = 2ad',
    observationGoal:
      'Kéo thanh gia tốc a để quan sát đường parabol tọa độ x(t) cong nhanh theo t².',
    paramOverrides: { a: 4 }
  },
  'phys-10-accel:2': {
    simId: 'average_velocity_stages',
    regimeLabel: 'Đồ thị Chuyển động Nhiều giai đoạn',
    observationGoal:
      'So sánh tốc độ trên hai chặng liên tiếp và tốc độ trung bình cả hành trình.'
  },

  'phys-10-newton-energy:0': {
    simId: 'inclined_plane',
    regimeLabel: 'Ba Định luật Newton & Hợp lực trên Mặt phẳng nghiêng',
    observationGoal:
      'Phân tích trọng lực P thành Px = Psinα và Py = Pcosα; vật chỉ trượt khi sinα > μ·cosα.'
  },
  'phys-10-newton-energy:1': {
    simId: 'momentum_collision',
    regimeLabel: 'Động lượng p = mv & Bảo toàn Động lượng khi Va chạm',
    observationGoal:
      'Quan sát tổng động lượng hệ 2 xe trước và sau va chạm đàn hồi / va chạm mềm luôn bằng nhau.'
  },
  'phys-10-newton-energy:2': {
    simId: 'free_fall_energy',
    regimeLabel: 'Định lý Động năng & Bảo toàn Cơ năng',
    observationGoal:
      'Kiểm nghiệm độ giảm thế năng bằng đúng độ tăng động năng khi bỏ qua ma sát.'
  },

  'phys-10-circular:0': {
    simId: 'circular_motion',
    regimeLabel: 'Độ đo Radian, Tốc độ góc ω & Chu kì quay T',
    observationGoal:
      'Thay đổi bán kính R và tốc độ góc ω để thấy v = ωR và chu kì T = 2π/ω.'
  },
  'phys-10-circular:1': {
    simId: 'circular_motion',
    regimeLabel: 'Vectơ Vận tốc Tiếp tuyến & Gia tốc Hướng tâm a_ht = v²/R',
    observationGoal:
      'Bật Vectơ để thấy v luôn tiếp tuyến quỹ đạo còn a_ht luôn hướng thẳng vào tâm O.',
    paramOverrides: { speed: 6 }
  },
  'phys-10-circular:2': {
    simId: 'centrifuge_banked_curve',
    regimeLabel: 'Lực Hướng tâm & Mặt đường Nghiêng An toàn khi Vào cua',
    observationGoal:
      'Tăng góc nghiêng mặt đường α để hợp lực phản lực N + P tạo đủ lực hướng tâm mà không bị trượt văng ra ngoài.'
  },

  'phys-10-torque-fluid:0': {
    simId: 'torque_lever',
    regimeLabel: 'Moment Lực M = F·d & Quy tắc Cân bằng Đòn bẩy',
    observationGoal:
      'Cân bằng thanh ngang khi tổng mômen quay thuận chiều kim đồng hồ bằng tổng mômen quay ngược chiều.'
  },
  'phys-10-torque-fluid:1': {
    simId: 'torque_lever',
    regimeLabel: 'Ngẫu lực & Cân bằng Lệch tải',
    observationGoal:
      'Thay đổi cánh tay đòn d₂ và khối lượng m₂ để thấy chỉ cần tăng cánh tay đòn có thể cân bằng vật nặng hơn nhiều lần.',
    paramOverrides: { m1: 4, d1: 2, m2: 2, d2: 4 }
  },
  'phys-10-torque-fluid:2': {
    simId: 'archimedes_buoyancy',
    regimeLabel: 'Áp suất Chất lỏng & Lực đẩy Archimedes F_A = ρgV',
    observationGoal:
      'Thay đổi khối lượng riêng vật ρ so với chất lỏng để quan sát hiện tượng nổi, lơ lửng hay chìm xuống đáy.'
  },

  'phys-10-momentum:0': {
    simId: 'work_power_joule',
    regimeLabel: 'Xung lượng của Lực Δp = F·Δt & Giảm chấn Động',
    observationGoal:
      'Kéo dài thời gian tương tác làm giảm lực va đập cực đại lên vật.'
  },
  'phys-10-momentum:1': {
    simId: 'momentum_collision',
    regimeLabel: 'Va chạm Đàn hồi vs Va chạm Mềm',
    observationGoal:
      'So sánh sự bảo toàn động năng trong va chạm đàn hồi (e = 1) so với mất cơ năng khi dính vào nhau (e = 0).'
  },
  'phys-10-momentum:2': {
    simId: 'projectile_motion',
    regimeLabel: 'Phân tích Chuyển động Hai chiều theo Hai phương Độc lập',
    observationGoal:
      'Tách chuyển động thành thẳng đều theo phương Ox (động lượng ngang bảo toàn) và rơi tự do theo Oy.'
  },

  // ---------------- LỚP 11 ----------------
  'phys-11-wave:0': {
    simId: 'standing_wave',
    regimeLabel: 'Sóng cơ, Bước sóng λ & Phương trình Truyền sóng',
    observationGoal:
      'Quan sát biên độ dao động phần tử dọc theo dây và khoảng cách bước sóng λ = v·T.'
  },
  'phys-11-wave:1': {
    simId: 'wave_interference',
    regimeLabel: 'Giao thoa Hai nguồn Kết hợp · Cực đại & Cực tiểu',
    observationGoal:
      'Điều chỉnh khoảng cách hai nguồn S₁S₂ và tần số f để đếm số vân cực đại hyperbol giao thoa.',
    flagOverrides: { showNodalLines: true }
  },
  'phys-11-wave:2': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Sóng Điện từ ngang (E ⊥ B ⊥ v) & Thang Sóng điện từ',
    observationGoal:
      'Tăng tần số f để thấy bước sóng λ = c/f co ngắn lại theo tỉ lệ nghịch.'
  },

  'phys-11-efield:0': {
    simId: 'coulomb_pendulum',
    regimeLabel: 'Định luật Coulomb F = k|q₁q₂| / r² · Hai quả cầu Tích điện',
    observationGoal:
      'Đổi dấu hoặc độ lớn điện tích q để xem hai quả cầu đẩy nhau hay hút nhau và tính góc lệch dây treo.'
  },
  'phys-11-efield:1': {
    simId: 'electric_field',
    regimeLabel: 'Đường sức Điện trường & Công của Lực điện A = qEd',
    observationGoal:
      'Quan sát vectơ cường độ điện trường E hướng ra xa điện tích dương (+) và hướng vào điện tích âm (−).'
  },
  'phys-11-efield:2': {
    simId: 'rc_capacitor',
    regimeLabel: 'Tụ điện, Nạp – Xả Điện tích Q = CU',
    observationGoal:
      'Quan sát điện áp U_c và dòng điện nạp giảm dần theo hàm mũ với hằng số thời gian τ = R·C.'
  },

  'phys-11-dc:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Dòng điện Không đổi & Điện trở Đoạn mạch',
    observationGoal:
      'Quan sát chiều chuyển động có hướng và định luật Ôm trên đoạn mạch.'
  },
  'phys-11-dc:1': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Suất điện động Nguồn, Điện trở trong & Công suất Tỏa nhiệt',
    observationGoal:
      'Tăng hiệu điện thế để thấy công suất tỏa nhiệt tăng theo bình phương cường độ dòng.'
  },
  'phys-11-dc:2': {
    simId: 'wheatstone_bridge',
    regimeLabel: 'Mạch cầu Tổng quát & Điều kiện Cầu Cân bằng R₁/R₂ = R₃/R₄',
    observationGoal:
      'Điều chỉnh điện trở nhánh sao cho hiệu điện thế hai đầu nhánh cầu bằng 0 (kim điện kế chỉ số 0).'
  },

  'phys-11-pendulum:0': {
    simId: 'simple_pendulum',
    regimeLabel: 'Con lắc Đơn & Điều kiện Dao động Điều hòa (α ≤ 10°)',
    observationGoal:
      'Kiểm nghiệm chu kì T = 2π√(l/g) chỉ phụ thuộc chiều dài dây l và gia tốc g, không phụ thuộc khối lượng m.'
  },
  'phys-11-pendulum:1': {
    simId: 'simple_pendulum',
    regimeLabel: 'Vận tốc, Lực căng dây & Cơ năng Con lắc Đơn',
    observationGoal:
      'Tại vị trí cân bằng α = 0, tốc độ và lực căng dây đạt cực đại; ở hai biên v = 0.',
    paramOverrides: { angle: 28 }
  },
  'phys-11-pendulum:2': {
    simId: 'damped_resonance',
    regimeLabel: 'Dao động Tắt dần, Cưỡng bức & Hiện tượng Cộng hưởng',
    observationGoal:
      'Khi tần số ngoại lực f tiến gần tần số riêng f₀, biên độ dao động vọt lên cực đại!'
  },

  'phys-11-sound-standing:0': {
    simId: 'sound_intensity',
    regimeLabel: 'Cường độ Âm I & Mức Cường độ Âm (dB)',
    observationGoal:
      'Tăng khoảng cách r so với nguồn âm điểm làm cường độ âm giảm theo quy luật 1/r².'
  },
  'phys-11-sound-standing:1': {
    simId: 'standing_wave',
    regimeLabel: 'Sóng dừng trên Dây · Nút sóng & Bụng sóng',
    observationGoal:
      'Thay đổi tần số để tạo số bó sóng nguyên k thỏa mãn điều kiện l = k·(λ/2).'
  },
  'phys-11-sound-standing:2': {
    simId: 'beat_waves',
    regimeLabel: 'Phách Âm & Họa âm Giao thoa Hai Tần số Gần nhau',
    observationGoal:
      'Hai âm có tần số lệch nhau Δf tạo thành nhịp phách lên xuống rõ rệt với chu kì 1/Δf.'
  },

  'phys-11-capacitor:0': {
    simId: 'electric_field',
    regimeLabel: 'Điện thế & Trường Điện thế giữa Các Điện tích',
    observationGoal:
      'Khảo sát đường sức và mật độ đường sức quanh các bản tích điện.'
  },
  'phys-11-capacitor:1': {
    simId: 'rc_capacitor',
    regimeLabel: 'Nạp & Phóng Tụ điện qua Điện trở (τ = RC)',
    observationGoal:
      'Theo dõi đồ thị điện áp U(t) tiệm cận nguồn E khi nạp tụ.'
  },
  'phys-11-capacitor:2': {
    simId: 'lc_oscillation',
    regimeLabel: 'Mạch Dao động Điện từ LC & Chuyển hóa Năng lượng Điện – Từ',
    observationGoal:
      'Năng lượng điện trường tập trung trên tụ C luân phiên chuyển hóa sang năng lượng từ trường cuộn cảm L.'
  },

  'phys-11-resonance:0': {
    simId: 'damped_resonance',
    regimeLabel: 'Dao động Tắt dần do Lực cản Môi trường',
    observationGoal:
      'Tăng hệ số cản môi trường để thấy biên độ tắt nhanh hơn theo thời gian.',
    flagOverrides: { hasFriction: true }
  },
  'phys-11-resonance:1': {
    simId: 'damped_resonance',
    regimeLabel: 'Dao động Cưỡng bức khi Thay đổi Tần số Ngoại lực',
    observationGoal:
      'Biên độ dao động ổn định phụ thuộc vào độ lệch |f − f₀| và lực cản.'
  },
  'phys-11-resonance:2': {
    simId: 'damped_resonance',
    regimeLabel: 'Đỉnh Cộng hưởng Sắc nét (Cộng hưởng Cơ học)',
    observationGoal:
      'Chỉnh tần số ngoại lực đúng bằng f₀ (tỉ số f/f₀ = 1.00) để quan sát cực đại cộng hưởng.',
    paramOverrides: { freqRatio: 1.0 }
  },

  'phys-standing-wave:0': {
    simId: 'standing_wave',
    regimeLabel: 'Cơ chế Phản xạ Sóng & Giao thoa Tạo Nút – Bụng',
    observationGoal:
      'Sóng tới và sóng phản xạ giao thoa tạo các nút đứng yên cách nhau λ/2.'
  },
  'phys-standing-wave:1': {
    simId: 'standing_wave',
    regimeLabel: 'Biên độ Dao động tại Điểm Bất kỳ trên Dây Sóng dừng',
    observationGoal:
      'Thay đổi số bó sóng để so sánh biên độ cực đại ở bụng với nút sóng.',
    paramOverrides: { harmonics: 4 }
  },
  'phys-standing-wave:2': {
    simId: 'standing_wave',
    regimeLabel: 'Thí nghiệm Đo Tốc độ Truyền sóng trên Dây Đàn hồi',
    observationGoal:
      'Từ khoảng cách giữa hai nút liên tiếp λ/2 và tần số f tính ra v = λ·f.'
  },

  // ---------------- LỚP 12 ----------------
  'phys-12-thermal:0': {
    simId: 'pv_thermodynamics',
    regimeLabel: 'Nội năng, Công A & Nhiệt lượng Q (Nguyên lí I: ΔU = A + Q)',
    observationGoal:
      'Quan sát pít-tông dịch chuyển sinh công cơ học và biến thiên nội năng của khối khí trong xilanh.'
  },
  'phys-12-thermal:1': {
    simId: 'thermal_gas',
    regimeLabel: 'Phương trình Trạng thái Khí lí tưởng pV = nRT',
    observationGoal:
      'Thay đổi thể tích V và nhiệt độ T để kiểm nghiệm áp suất p tăng tỉ lệ thuận với T và nghịch với V.'
  },
  'phys-12-thermal:2': {
    simId: 'thermal_gas',
    regimeLabel: 'Động học Phân tử Khí & Va chạm Thành bình',
    observationGoal:
      'Tăng nhiệt độ tuyệt đối T(K) để thấy tốc độ chuyển động nhiệt hỗn loạn của các phân tử tăng vọt.',
    paramOverrides: { temp: 520 }
  },

  'phys-12-mag:0': {
    simId: 'hall_effect',
    regimeLabel: 'Lực Từ & Quy tắc Bàn tay trái lên Hạt/Dòng điện',
    observationGoal:
      'Tác dụng từ trường B vuông góc dòng hạt mang điện làm hạt lệch theo quy tắc bàn tay trái.'
  },
  'phys-12-mag:1': {
    simId: 'cyclotron_accelerator',
    regimeLabel: 'Lực Lorentz f = |q|vB & Quỹ đạo Tròn trong Từ trường',
    observationGoal:
      'Hạt mang điện bay vuông góc đường sức từ chuyển động tròn đều với bán kính R = mv / (|q|B).'
  },
  'phys-12-mag:2': {
    simId: 'magnetic_induction',
    regimeLabel: 'Từ thông Φ, Định luật Faraday & Quy tắc Lenz',
    observationGoal:
      'Dòng điện cảm ứng sinh ra luôn có từ trường chống lại nguyên nhân biến thiên từ thông tạo ra nó.'
  },

  'phys-12-optics-q:0': {
    simId: 'photoelectric_effect',
    regimeLabel: 'Thuyết Lượng tử Ánh sáng & Công thoát Electron',
    observationGoal:
      'Chỉ khi bước sóng ánh sáng chiếu tới λ ≤ λ₀ thì photon mới đủ năng lượng bứt electron khỏi kim loại.'
  },
  'phys-12-optics-q:1': {
    simId: 'photoelectric_effect',
    regimeLabel: 'Hiệu điện thế Hãm U_h & Động năng Ban đầu Cực đại',
    observationGoal:
      'Giảm bước sóng (tăng năng lượng photon) làm tốc độ bay của quang electron tăng mạnh.',
    paramOverrides: { wavelength: 260 }
  },
  'phys-12-optics-q:2': {
    simId: 'bohr_energy_levels',
    regimeLabel: 'Mẫu nguyên tử Bohr & Quang phổ Vạch Hyđrô',
    observationGoal:
      'Chọn quỹ đạo chuyển mức n → m để xem electron phát xạ photon đúng màu vạch quang phổ Balmer/Lyman.'
  },

  'phys-12-nuclear:0': {
    simId: 'binding_energy_curve',
    regimeLabel: 'Độ hụt khối Δm & Đường cong Năng lượng Liên kết Riêng',
    observationGoal:
      'Hạt nhân có số khối trung bình (A ≈ 56, Fe) nằm ở đỉnh bền vững nhất — cơ sở cho nhiệt hạch & phân hạch.'
  },
  'phys-12-nuclear:1': {
    simId: 'nuclear_fission',
    regimeLabel: 'Phản ứng Dây chuyền Phân hạch Hạt nhân U-235',
    observationGoal:
      'Một neutron chậm kích thích hạt nhân U-235 vỡ đôi và giải phóng năng lượng + nhiều neutron mới.'
  },
  'phys-12-nuclear:2': {
    simId: 'nuclear_decay',
    regimeLabel: 'Định luật Phóng xạ N(t) = N₀·2^(−t/T) & Định tuổi Mẫu vật',
    observationGoal:
      'Sau mỗi chu kì bán rã T, một nửa số hạt nhân mẹ còn lại bị phân rã theo hàm mũ giảm dần.'
  },

  'phys-12-ac-rlc:0': {
    simId: 'ac_rlc_circuit',
    regimeLabel: 'Giá trị Hiệu dụng & Độ lệch pha phần tử R, L, C',
    observationGoal:
      'Quan sát giản đồ véctơ quay U_R, U_L (sớm pha π/2), U_C (trễ pha π/2).'
  },
  'phys-12-ac-rlc:1': {
    simId: 'ac_rlc_circuit',
    regimeLabel: 'Tổng trở Z & Cộng hưởng Điện khi Z_L = Z_C',
    observationGoal:
      'Điều chỉnh tần số f hoặc C sao cho X_L = X_C → tổng trở nhỏ nhất Z_min = R, dòng I cực đại!'
  },
  'phys-12-ac-rlc:2': {
    simId: 'diode_rectifier',
    regimeLabel: 'Công suất Tiêu thụ AC & Chỉnh lưu Dòng Xoay chiều',
    observationGoal:
      'Theo dõi dạng sóng trước và sau cầu chỉnh lưu + bộ lọc tụ.'
  },

  'phys-12-ac-gen:0': {
    simId: 'magnetic_induction',
    regimeLabel: 'Nguyên tắc Tạo Suất điện động Xoay chiều Cảm ứng',
    observationGoal:
      'Từ thông biến thiên điều hòa tạo ra dòng điện đổi chiều hình sin liên tục.'
  },
  'phys-12-ac-gen:1': {
    simId: 'transformer_2d',
    regimeLabel: 'Máy Biến áp Lý tưởng (U₁/U₂ = N₁/N₂)',
    observationGoal:
      'Tăng số vòng cuộn thứ cấp N₂ để tăng áp và kiểm tra bảo toàn công suất.'
  },
  'phys-12-ac-gen:2': {
    simId: 'transformer_2d',
    regimeLabel: 'Truyền tải Điện năng & Giảm Hao phí ΔP = P²R/U²',
    observationGoal:
      'Khi tăng điện áp lên k lần trước khi truyền tải, công suất hao phí trên đường dây giảm k² lần!',
    paramOverrides: { n1: 200, n2: 1000 }
  },

  'phys-12-young:0': {
    simId: 'young_interference',
    regimeLabel: 'Giao thoa Ánh sáng Đơn sắc Khe Y-âng & Khoảng vân i',
    observationGoal:
      'Thay đổi bước sóng λ, khoảng cách 2 khe a và màn D để đo khoảng vân i = λD/a.'
  },
  'phys-12-young:1': {
    simId: 'prism_dispersion',
    regimeLabel: 'Quang phổ & Chồng lấn Ánh sáng Đa sắc',
    observationGoal:
      'Các ánh sáng đơn sắc có bước sóng khác nhau bị tách góc hoặc tạo hệ vân dịch chuyển lệch nhau.'
  },
  'phys-12-young:2': {
    simId: 'hydrogen_spectrum',
    regimeLabel: 'Máy Quang phổ & Ba loại Quang phổ Vạch – Liên tục – Hấp thụ',
    observationGoal:
      'Quan sát hệ vạch phát xạ đặc trưng riêng của từng nguyên tố hóa học.'
  },

  'phys-photoelectric:0': {
    simId: 'photoelectric_effect',
    regimeLabel: 'Thí nghiệm Hertz & Giới hạn Quang điện λ ≤ λ₀',
    observationGoal:
      'Ánh sáng đỏ bước sóng dài không bật được electron, trong khi tia tử ngoại bước sóng ngắn bật dòng quang điện ngay.'
  },
  'phys-photoelectric:1': {
    simId: 'photoelectric_effect',
    regimeLabel: 'Công thức Einstein & Hiệu điện thế Hãm (U_h)',
    observationGoal:
      'Tăng hiệu điện thế hãm để triệt tiêu các quang electron có động năng lớn nhất.',
    paramOverrides: { wavelength: 280 }
  },
  'phys-photoelectric:2': {
    simId: 'bohr_energy_levels',
    regimeLabel: 'Năng lượng Lượng tử & Bức xạ Hấp thụ Nguyên tử',
    observationGoal:
      'Năng lượng photon đúng bằng hiệu E_cao − E_thấp giữa hai trạng thái dừng.'
  },

  // ---------------- CHUYÊN LÍ PRO ----------------
  'phys-pro-1:0': {
    simId: 'vector_addition_2d',
    regimeLabel: 'Lực Quán tính F_qt = −m·a₀ & Tổng hợp Lực trong HQC Phi quán tính',
    observationGoal:
      'Tổng hợp lực thực và lực quán tính để dùng định luật II Newton như bình thường.'
  },
  'phys-pro-1:1': {
    simId: 'inclined_plane',
    regimeLabel: 'Vật trượt trên Mặt phẳng nghiêng với Lực ma sát μ',
    observationGoal:
      'Khảo sát điều kiện trượt tương đối khi góc nghiêng α và hệ số ma sát μ thay đổi.'
  },
  'phys-pro-1:2': {
    simId: 'centrifuge_banked_curve',
    regimeLabel: 'Chuyển động trong Hệ quy chiếu Quay & Vành Nghiêng',
    observationGoal:
      'Lực quán tính li tâm kết hợp phản lực nghiêng tạo trạng thái cân bằng động ở tốc độ thiết kế.'
  },

  'phys-pro-2:0': {
    simId: 'atwood_pulley',
    regimeLabel: 'Hệ Liên kết Dây Không dãn & Ròng rọc Động',
    observationGoal:
      'Điều chỉnh hai khối lượng m₁, m₂ để quan sát gia tốc chung a = (m₂ − m₁)g/(m₁+m₂) và lực căng T.'
  },
  'phys-pro-2:1': {
    simId: 'momentum_collision',
    regimeLabel: 'Va chạm Đàn hồi Xuyên tâm & Bảo toàn Động lượng – Động năng',
    observationGoal:
      'Thay đổi khối lượng và vận tốc hai quả cầu để kiểm nghiệm sự trao đổi vận tốc khi va chạm.'
  },
  'phys-pro-2:2': {
    simId: 'kepler_orbit',
    regimeLabel: 'Khối tâm Hệ Hai Vật & Chuyển động Quỹ đạo Bảo toàn',
    observationGoal:
      'Quan sát chuyển động hệ hai thiên thể dưới tác dụng nội lực hấp dẫn bảo toàn động lượng và mômen động lượng.'
  },

  'phys-pro-3:0': {
    simId: 'wheatstone_bridge',
    regimeLabel: 'Định luật Kirchhoff & Mạch cầu Chập nút Đối xứng',
    observationGoal:
      'Khi R₁/R₂ = R₃/R₄, hai đầu nhánh cầu có cùng điện thế (U_CD = 0) nên có thể chập nút hoặc bỏ điện trở cầu.'
  },
  'phys-pro-3:1': {
    simId: 'ohm_circuit',
    regimeLabel: 'Biến đổi Mạch Tương đương Nối tiếp – Song song',
    observationGoal:
      'Rút gọn từng cụm điện trở về mạch tương đương để tính nhanh dòng điện nhánh.'
  },
  'phys-pro-3:2': {
    simId: 'rc_capacitor',
    regimeLabel: 'Phương pháp Thế nút & Quá trình Quá độ Tụ điện',
    observationGoal:
      'Phân tích điện thế tại các nút mạch khi tụ điện nạp và phóng điện theo thời gian.'
  },

  'phys-pro-4:0': {
    simId: 'telescope_microscope',
    regimeLabel: 'Quang hệ Ghép Hai Thấu kính (Vật kính – Thị kính)',
    observationGoal:
      'Ảnh thật tạo bởi thấu kính thứ nhất đóng vai trò vật cho thấu kính thứ hai phóng đại tiếp.'
  },
  'phys-pro-4:1': {
    simId: 'spherical_mirror',
    regimeLabel: 'Quang hệ Gương cầu & Phản xạ Tạo ảnh',
    observationGoal:
      'Theo dõi đường đi tia sáng phản xạ qua gương cầu lõm / gương cầu lồi.'
  },
  'phys-pro-4:2': {
    simId: 'lens_optics',
    regimeLabel: 'Cực trị Khoảng cách Vật – Ảnh L_min = 4f (Bessel)',
    observationGoal:
      'Dịch chuyển thấu kính hội tụ để tìm hai vị trí cho ảnh rõ nét trên màn khi L > 4f.'
  },

  'phys-pro-5:0': {
    simId: 'simple_pendulum',
    regimeLabel: 'Con lắc Đơn & Tính Chu kì Từng nửa dao động khi Vướng đinh',
    observationGoal:
      'Nửa bên trái dao động với chiều dài l₁, nửa bên phải vướng đinh dao động nhanh hơn với chiều dài l₂.'
  },
  'phys-pro-5:1': {
    simId: 'damped_resonance',
    regimeLabel: 'Dao động Tắt dần Dưới Lực cản & Độ giảm Biên độ',
    observationGoal:
      'Theo dõi số chu kì thực hiện được trước khi cơ năng tiêu hao hết do lực cản.'
  },
  'phys-pro-5:2': {
    simId: 'carnot_cycle_pv',
    regimeLabel: 'Chu trình Nhiệt động lực học Carnot & Hiệu suất Động cơ Nhiệt',
    observationGoal:
      'Theo dõi 4 quá trình (2 đẳng nhiệt + 2 đoạn nhiệt) khép kín trên đồ thị (p–V) tạo công cơ học hữu ích.'
  },

  'phys-doppler-effect:0': {
    simId: 'doppler_effect',
    regimeLabel: 'Hiệu ứng Doppler · Độ nén Bước sóng Trước nguồn Chuyển động',
    observationGoal:
      'Mặt trước nguồn chuyển động bị nén bước sóng λ\' < λ khiến tần số nghe được cao hơn hẳn.'
  },
  'phys-doppler-effect:1': {
    simId: 'doppler_effect',
    regimeLabel: 'Phản xạ Doppler trong Radar & Siêu âm Y tế',
    observationGoal:
      'Tăng tốc độ nguồn v_s tiến sát vận tốc truyền sóng c để thấy độ dịch tần số f\' bùng nổ.',
    paramOverrides: { sourceSpeed: 0.65 }
  },
  'phys-doppler-effect:2': {
    simId: 'mach_shockwave',
    regimeLabel: 'Sóng Xung kích Hình nón Mach khi Vượt Tốc độ Âm thanh (v > c)',
    observationGoal:
      'Khi số Mach M = v/c > 1, các mặt cầu sóng chồng chất dọc theo nón xung kích tạo tiếng nổ siêu thanh.'
  },
  // GDPT 2018 Step Accuracy Overrides
  'phys-10-b1:0': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Đối tượng & Phương pháp Thực nghiệm Vật lí',
    observationGoal: 'Quan sát trực quan cách đo đạc các đại lượng vật lí theo chuẩn đơn vị SI.'
  },
  'phys-10-b1:1': {
    simId: 'measurement_error_lab',
    regimeLabel: 'Phương pháp Thực nghiệm & Sai số Đo lường',
    observationGoal: 'Thực hành lặp phép đo để giảm sai số ngẫu nhiên và phân biệt sai số hệ thống.'
  },
  'phys-10-b1:2': {
    simId: 'free_fall_energy',
    regimeLabel: 'Ứng dụng Vật lí trong Đời sống & Công nghệ',
    observationGoal: 'Liên hệ chuyển hóa năng lượng và các định luật cơ học với thiết bị kỹ thuật hiện đại.'
  },
  'phys-10-b6:0': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Đo tốc độ tức thời & trung bình bằng Cổng quang điện',
    observationGoal: 'Quan sát xe trượt qua cổng quang điện và đồ thị v(t) theo thời gian thực.'
  },
  'phys-10-b8:1': {
    simId: 'kinematics_graphs',
    regimeLabel: 'Phân biệt Chuyển động Nhanh dần (a·v > 0) & Chậm dần (a·v < 0)',
    observationGoal: 'Kéo gia tốc âm/dương để xem vectơ a cùng chiều hay ngược chiều vectơ vận tốc v.',
    paramOverrides: { vizMode: 2, v0: 10, accel: -3 }
  },
  'phys-10-b11:0': {
    simId: 'free_fall_energy',
    regimeLabel: 'Thí nghiệm Đo gia tốc Rơi tự do g với Cổng quang điện',
    observationGoal: 'Điều chỉnh độ cao h và kiểm chứng quan hệ s = ½gt².'
  },
  'phys-10-b11:1': {
    simId: 'free_fall_energy',
    regimeLabel: 'Xử lí số liệu đồ thị s theo t² để xác định g',
    observationGoal: 'Theo dõi tốc độ chạm đất v = √(2gh) và cơ năng bảo toàn trong suốt quá trình rơi.'
  },
  'phys-10-b18:0': {
    simId: 'inclined_plane',
    regimeLabel: 'Lực Ma sát Nghỉ, Ma sát Trượt & Mặt phẳng nghiêng',
    observationGoal: 'Thay đổi hệ số ma sát μ và góc nghiêng α để thấy khi nào vật bắt đầu trượt.'
  },
  'phys-10-b18:1': {
    simId: 'inclined_plane',
    regimeLabel: 'Ma sát Lăn & Lực Ma sát có lợi / có hại',
    observationGoal: 'So sánh gia tốc trượt a = g(sinα - μcosα) khi giảm hệ số ma sát μ.'
  },
  'phys-10-b20:0': {
    simId: 'inclined_plane',
    regimeLabel: 'Bài toán Mặt phẳng nghiêng · Phân tích lực P, N, Fms',
    observationGoal: 'Chiếu các lực lên Ox và Oy để tính phản lực N = mg·cosα và gia tốc.'
  },
  'phys-10-b20:1': {
    simId: 'atwood_pulley',
    regimeLabel: 'Bài toán Hệ Vật Nối Dây qua Ròng rọc',
    observationGoal: 'Điều chỉnh m₁, m₂ để quan sát lực căng dây T và gia tốc hệ a = (m₂-m₁)g/(m₁+m₂).'
  },
  'phys-10-b20:2': {
    simId: 'circular_motion',
    regimeLabel: 'Bài toán Chuyển động Tròn & Lực Hướng tâm',
    observationGoal: 'Quan sát hợp lực hướng tâm Fht = mv²/R giữ vật trên quỹ đạo cong.'
  },
  'phys-11-b3:0': {
    simId: 'spring_pendulum',
    regimeLabel: 'Vận tốc & Gia tốc trong Dao động Điều hòa',
    observationGoal: 'So sánh pha: v sớm pha π/2 so với x; a ngược pha (sớm pha π) so với x.'
  },
  'phys-11-b3:1': {
    simId: 'lissajous_shm',
    regimeLabel: 'Hệ thức Độc lập Thời gian & Quỹ đạo Pha (x, v)',
    observationGoal: 'Xem hình Elip trong không gian pha khi v = ±ω√(A² - x²).'
  },
  'phys-11-b25:0': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Năng lượng Điện tiêu thụ A = U·I·t & Công suất Điện P = U·I',
    observationGoal: 'Thay đổi điện áp U và điện trở R để quan sát công suất tỏa nhiệt và điện năng.'
  },
  'phys-11-b25:1': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Định luật Jun – Len-xơ Q = I²Rt & Hiệu suất Nguồn điện',
    observationGoal: 'Đối chiếu nhiệt lượng tỏa ra trên mạch ngoài và công suất toàn phần của nguồn.'
  },
  'phys-11-b26:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Sơ đồ Mạch điện Thực hành Đo Suất điện động E & Điện trở trong r',
    observationGoal: 'Thay đổi tải R để dựng đồ thị U = E - I·r theo cường độ dòng điện I.'
  },
  'phys-cd-11-2:0': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Phổ Sóng Vô tuyến & Sóng Điện từ Truyền trong Không gian',
    observationGoal: 'Quan sát hai thành phần E ⊥ B cùng pha lan truyền với tốc độ c.'
  },
  'phys-cd-11-2:1': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Điều chế Biên độ (AM) & Điều chế Tần số (FM)',
    observationGoal: 'Theo dõi sóng mang cao tần mang tín hiệu âm tần đi xa qua tầng điện li.'
  },
  'phys-cd-11-3:0': {
    simId: 'wheatstone_bridge',
    regimeLabel: 'Cảm biến Nhiệt trở / Quang trở & Mạch Phân áp Cầu',
    observationGoal: 'Điều chỉnh R₃, R₄ như cảm biến để thấy điện áp lệch cầu thay đổi tuyến tính.'
  },
  'phys-cd-11-3:1': {
    simId: 'diode_rectifier',
    regimeLabel: 'Diode Chỉnh lưu & Khuếch đại Thuật toán Op-Amp',
    observationGoal: 'Quan sát đặc tính dẫn dòng một chiều của diode và lọc tụ làm phẳng điện áp.'
  },
  'phys-12-b7:0': {
    simId: 'phase_change_heating',
    regimeLabel: 'Đọc Đồ thị Nhiệt độ – Thời gian T(t) trong Các Quá trình Nhiệt',
    observationGoal: 'Phân biệt đoạn dốc (Q = mcΔT) và đoạn nằm ngang đẳng nhiệt (Q = λm, Q = Lm).'
  },
  'phys-12-b7:1': {
    simId: 'calorimetry_mixing',
    regimeLabel: 'Phương trình Cân bằng Nhiệt ΣQ_tỏa = ΣQ_thu',
    observationGoal: 'Trộn hai khối nước nóng – lạnh để xác định nhiệt độ cân bằng và nhiệt dung riêng.'
  },
  'phys-11-shm:0': {
    simId: 'spring_pendulum',
    regimeLabel: 'Khái niệm Dao động Điều hòa & Biên độ – Tần số',
    observationGoal: 'Quan sát vật dao động điều hòa quanh vị trí cân bằng với đồ thị li độ hình sin x(t) = A cos(ωt + φ).'
  },
  'phys-11-shm:1': {
    simId: 'lissajous_shm',
    regimeLabel: 'Đồ thị Pha & Hệ phương trình Dao động Điều hòa',
    observationGoal: 'Khảo sát pha ban đầu φ, tần số góc ω và mối liên hệ vectơ quay với dao động điều hòa.'
  },
  'phys-11-shm:2': {
    simId: 'spring_pendulum',
    regimeLabel: 'So sánh Lệch pha Hai Dao động Điều hòa Cùng tần số',
    observationGoal: 'Thay đổi độ lệch pha Δφ để nhận biết hai dao động cùng pha, ngược pha hay vuông pha.'
  },
  'phys-10-b22:2': {
    simId: 'vector_addition_2d',
    regimeLabel: 'Thực hành Tổng hợp & Phân tích Lực Cân bằng',
    observationGoal: 'Quan sát quy tắc hình bình hành khi tổng hợp hoặc phân tích lực kéo trên hai phương.'
  },
  'phys-10-b24:1': {
    simId: 'work_power_joule',
    regimeLabel: 'Công suất Tức thời & Đơn vị Đo Công suất (W, HP, kWh)',
    observationGoal: 'Điều chỉnh lực kéo và vận tốc để khảo sát công suất P = F·v·cosα.'
  },
  'phys-10-b27:1': {
    simId: 'work_power_joule',
    regimeLabel: 'Hiệu suất Truyền năng & Hao phí do Ma sát',
    observationGoal: 'Thay đổi hệ số ma sát μ để đo tỉ số giữa công có ích và công toàn phần.'
  },
  'phys-10-b27:2': {
    simId: 'work_power_joule',
    regimeLabel: 'Phương pháp Nâng cao Hiệu suất Máy cơ Đơn giản',
    observationGoal: 'Giảm hệ số ma sát và tối ưu góc kéo α để hiệu suất H% tiến gần 100%.'
  },
  'phys-12-b21:0': {
    simId: 'bohr_energy_levels',
    regimeLabel: 'Thí nghiệm Tán xạ Rutherford & Cấu tạo Hạt nhân (Z Proton, N Neutron)',
    observationGoal: 'Quan sát hạt nhân mang điện dương tập trung ở tâm nguyên tử với kích thước rất nhỏ.'
  },
  'phys-12-b21:1': {
    simId: 'binding_energy_curve',
    regimeLabel: 'Độ hụt khối Δm & Đường cong Năng lượng Liên kết Riêng',
    observationGoal: 'So sánh vùng hạt nhân bền vững nhất (A ≈ 50–80, Fe-56) với vùng phân/nhiệt hạch.'
  },
  'phys-cd-12-2:0': {
    simId: 'photoelectric_effect',
    regimeLabel: 'Nguyên lý Tạo Tia X (Ống Rơnghen) & Chụp Cắt lớp CT',
    observationGoal: 'Tăng U_AK để tăng động năng chùm electron tạo tia X bước sóng ngắn đâm xuyên.'
  },
  'phys-cd-12-2:1': {
    simId: 'sound_intensity',
    regimeLabel: 'Siêu âm Y học & Hiệu ứng Doppler Chẩn đoán Tuần hoàn',
    observationGoal: 'Quan sát sóng âm tần số cao phản xạ qua mô cơ thể và cường độ theo khoảng cách.'
  },
  'phys-cd-12-2:2': {
    simId: 'cyclotron_accelerator',
    regimeLabel: 'Chụp Cộng hưởng Từ MRI trong Từ trường B Mạnh',
    observationGoal: 'Theo dõi tương tác spin proton với từ trường đều B và sóng vô tuyến RF.'
  },
  'phys-10-b16:0': {
    simId: 'momentum_collision',
    regimeLabel: 'Định luật 3 Newton · Tương tác hai chiều F_AB = −F_BA',
    observationGoal: 'Quan sát hai xe va chạm truyền xung lực bằng nhau và ngược hướng lên hai vật khác nhau.'
  },
  'phys-10-b16:1': {
    simId: 'momentum_collision',
    regimeLabel: 'Phân biệt Lực – Phản lực (2 vật) & Hai lực cân bằng (1 vật)',
    observationGoal: 'So sánh gia tốc a = F/m khác nhau dù lực tương tác |F_AB| = |F_BA| bằng nhau ở mọi thời điểm.'
  },
  'phys-11-b5:0': {
    simId: 'simple_pendulum',
    regimeLabel: 'Động năng & Thế năng Trong Dao động Điều hòa',
    observationGoal: 'Theo dõi sự chuyển hóa qua lại giữa W_đ và W_t trong khi cơ năng W = const được bảo toàn.'
  },
  'phys-12-b25:1': {
    simId: 'nuclear_decay',
    regimeLabel: 'Bảo toàn Động lượng khi Hạt nhân Mẹ Đứng yên Phóng xạ',
    observationGoal: 'Quan sát hạt nhân mẹ phân rã thành hai hạt con bay ngược chiều với K₁/K₂ = A₂/A₁.'
  },
  'phys-cd-10-3:0': {
    simId: 'thermal_conduction_bar',
    regimeLabel: 'Hiệu ứng Nhà kính & Cân bằng Truyền nhiệt Khí quyển',
    observationGoal: 'Khảo sát sự truyền và giữ nhiệt giữa hai vùng nhiệt độ T₁ (bề mặt) và T₂ (khí quyển).'
  },
  'phys-cd-10-3:1': {
    simId: 'transformer_2d',
    regimeLabel: 'Năng lượng Tái tạo & Tối ưu Lưới truyền tải Điện sạch',
    observationGoal: 'So sánh hiệu suất truyền tải điện năng từ nguồn năng lượng tái tạo nhờ nâng cao điện áp U.'
  },
  'phys-ext-2:1': {
    simId: 'centrifuge_banked_curve',
    regimeLabel: 'Hệ quy chiếu Quay, Lực Li tâm & Tiến động Foucault',
    observationGoal: 'Quan sát tác dụng của lực quán tính trong hệ quy chiếu quay với tốc độ góc ω.'
  },
  'phys-ext-4:0': {
    simId: 'thin_film_interference',
    regimeLabel: 'Giao thoa Bản mỏng (Màng xà phòng & Lớp phủ AR)',
    observationGoal: 'Điều chỉnh bề dày d và chiết suất n để triệt tiêu phản xạ chống chói d = λ/(4n).'
  },
  'phys-ext-4:1': {
    simId: 'single_slit_diffraction',
    regimeLabel: 'Nhiễu xạ Ánh sáng qua Một khe hẹp',
    observationGoal: 'Thay đổi bề rộng khe a và bước sóng λ để quan sát vân sáng trung tâm Δy_TT = 2λD/a.'
  },
  'phys-ext-5:0': {
    simId: 'compton_scattering',
    regimeLabel: 'Hiệu ứng Compton & Động lượng Photon p = h/λ',
    observationGoal: 'Thay đổi góc tán xạ θ để kiểm chứng độ dịch bước sóng Δλ = λ_C(1 − cosθ).'
  },
  'phys-ext-5:1': {
    simId: 'hydrogen_spectrum',
    regimeLabel: 'Sóng Vật chất De Broglie λ = h/p & Lượng tử hóa Quỹ đạo Bohr',
    observationGoal: 'Liên hệ điều kiện sóng dừng De Broglie 2πr = nλ với các mức năng lượng lượng tử hóa.'
  },
  'phys-ext-6:0': {
    simId: 'lc_oscillation',
    regimeLabel: 'Mạch Dao động Điện từ Tự do LC & Năng lượng Điện–Từ',
    observationGoal: 'Theo dõi dao động vuông pha giữa điện tích q trên tụ C và cường độ dòng điện i qua cuộn L.'
  },
  'phys-ext-6:1': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Phát Sóng Điện từ E ⊥ B ⊥ v từ Mạch LC hở',
    observationGoal: 'Quan sát hai thành phần E và B dao động vuông góc phương và cùng pha lan truyền.'
  },
  'phys-ext-7:0': {
    simId: 'cyclotron_accelerator',
    regimeLabel: 'Máy Gia tốc Hạt Cyclotron 2 Hộp chữ D',
    observationGoal: 'Theo dõi bán kính quỹ đạo xoắn ốc R = mv/(qB) tăng dần sau mỗi lần proton qua khe điện trường.'
  },
  'phys-ext-7:1': {
    simId: 'hall_effect',
    regimeLabel: 'Hiệu ứng Hall & Cảm biến Đo Từ trường B',
    observationGoal: 'Quan sát hạt tải điện dạt sang hai mép bản dẫn tạo hiệu điện thế Hall U_H = IB/(ned).'
  },
  'phys-ext-8:0': {
    simId: 'carnot_cycle_pv',
    regimeLabel: 'Chu trình Nhiệt Carnot Thuận nghịch (Đẳng nhiệt – Đoạn nhiệt)',
    observationGoal: 'Khảo sát 4 quá trình khép kín sinh công cơ học trên giản đồ p–V.'
  },
  'phys-ext-8:1': {
    simId: 'carnot_cycle_pv',
    regimeLabel: 'Hiệu suất Cực đại H_max = 1 − T₂/T₁ & Nguyên lí II Nhiệt động lực học',
    observationGoal: 'Thay đổi nhiệt độ hai nguồn T₁, T₂ để thấy giới hạn hiệu suất động cơ nhiệt lí tưởng.'
  },
  'phys-ext-9:0': {
    simId: 'binding_energy_curve',
    regimeLabel: 'Độ hụt khối & Đường cong Năng lượng Liên kết Riêng',
    observationGoal: 'So sánh độ bền vững hạt nhân từ ²H, ⁴He đến đỉnh ⁵⁶Fe và vùng nặng ²³⁵U.'
  },
  'phys-ext-9:1': {
    simId: 'nuclear_fission',
    regimeLabel: 'Phản ứng Nhiệt hạch D–T & Năng lượng Hạt nhân',
    observationGoal: 'Đối chiếu cơ chế giải phóng năng lượng ΔE > 0 của phản ứng tổng hợp và phân hạch.'
  },
  'phys-ext-10:0': {
    simId: 'fiber_optic_tir',
    regimeLabel: 'Cáp Quang Phản xạ Toàn phần & Khẩu độ số NA',
    observationGoal: 'Điều chỉnh góc phóng và chiết suất lõi/vỏ n₁ > n₂ để tia laser dẫn truyền trọn vẹn.'
  },
  'phys-ext-10:1': {
    simId: 'malus_polarization',
    regimeLabel: 'Phân cực Ánh sáng & Định luật Malus I = I₀cos²θ',
    observationGoal: 'Xoay góc lệch trục phân cực θ từ 0° đến 90° để quan sát sự suy giảm cường độ truyền qua.'
  },

  // ---------------- GDPT 2006 VẬT LÍ 9–12 STEP ACCURACY ----------------
  'phys-2006-9-4:0': {
    simId: 'electric_power_meter',
    regimeLabel: 'Công suất Điện P = UI & Ý nghĩa số Vôn – Oát Định mức',
    observationGoal: 'Điều chỉnh hiệu điện thế U và công suất tải để quan sát dòng chạy qua công tơ và đèn báo quá tải.'
  },
  'phys-2006-9-4:1': {
    simId: 'electric_power_meter',
    regimeLabel: 'Điện năng A = Pt & Đọc Chỉ số Công tơ Điện (kWh)',
    observationGoal: 'Theo dõi đĩa quay công tơ tích lũy điện năng theo kWh (1 kWh = 3,6·10⁶ J) và tiền điện tương ứng.'
  },
  'phys-2006-9-8:0': {
    simId: 'hall_effect',
    regimeLabel: 'Lực Điện từ & Quy tắc Bàn tay trái lên Dây dẫn',
    observationGoal: 'Đảo chiều dòng điện I hoặc cảm ứng từ B để thấy chiều lực điện từ đảo ngược theo quy tắc bàn tay trái.'
  },
  'phys-2006-9-8:1': {
    simId: 'dc_motor_2d',
    regimeLabel: 'Động cơ Điện Một chiều & Vai trò Cổ góp Điện',
    observationGoal: 'Quan sát cổ góp tự động đảo chiều dòng điện mỗi nửa vòng để ngẫu lực từ giữ rôto quay liên tục một chiều.'
  },
  'phys-2006-9-13:0': {
    simId: 'lens_optics',
    regimeLabel: 'Thấu kính Phân kì · Chùm tia Ló Phân kì Qua Tiêu điểm F',
    observationGoal: 'Quan sát tia tới song song trục chính cho tia ló loe rộng có đường kéo dài đi qua tiêu điểm F cùng phía.',
    paramOverrides: { f: 15, d: 30, objH: 10 },
    flagOverrides: { isDiverging: true }
  },
  'phys-2006-9-13:1': {
    simId: 'lens_optics',
    regimeLabel: 'Ảnh tạo bởi Thấu kính Phân kì · Luôn Ảnh ảo Nhỏ hơn Vật',
    observationGoal: 'Kéo vật ra xa hoặc lại gần thấu kính để kiểm chứng ảnh luôn ảo, cùng chiều, nhỏ hơn vật và nằm trong khoảng tiêu cự.',
    paramOverrides: { f: 15, d: 12, objH: 10 },
    flagOverrides: { isDiverging: true }
  },
  'phys-2006-9-14:0': {
    simId: 'eye_optics_2d',
    regimeLabel: 'Cấu tạo Quang học của Mắt & Sự Điều tiết Thể thủy tinh',
    observationGoal: 'Thay đổi khoảng cách vật từ cực cận đến cực viễn để quan sát thể thủy tinh thay đổi tiêu cự giúp ảnh rơi đúng võng mạc.'
  },
  'phys-2006-9-14:1': {
    simId: 'eye_optics_2d',
    regimeLabel: 'Mắt Cận – Mắt Lão & Cách Đeo Kính Khắc phục',
    observationGoal: 'Bật chế độ Mắt cận (kính phân kì) hoặc Mắt viễn/lão (kính hội tụ) để đưa ảnh về đúng điểm vàng võng mạc.'
  },
  'phys-2006-9-17:0': {
    simId: 'power_plant_generator',
    regimeLabel: 'Nhà máy Nhiệt điện & Thủy điện · Chuỗi Biến đổi Năng lượng',
    observationGoal: 'Theo dõi dòng năng lượng từ thế năng hồ chứa / nhiệt hơi nước làm quay tuabin tạo điện áp phát ra lưới.'
  },
  'phys-2006-9-17:1': {
    simId: 'power_plant_generator',
    regimeLabel: 'Năng lượng Gió, Mặt Trời & Hiệu suất Phát điện',
    observationGoal: 'So sánh công suất phát và hiệu suất chuyển hóa giữa các dạng năng lượng tái tạo và hóa thạch.'
  },
  'phys-2006-10-5:0': {
    simId: 'distance_displacement_rel',
    regimeLabel: 'Tính Tương đối của Quỹ đạo & Vận tốc theo Hệ quy chiếu',
    observationGoal: 'Chuyển đổi hệ quy chiếu đứng yên vs chuyển động để thấy quỹ đạo và vận tốc cùng một vật thay đổi.'
  },
  'phys-2006-10-5:1': {
    simId: 'distance_displacement_rel',
    regimeLabel: 'Công thức Cộng Vận tốc v₁₃ = v₁₂ + v₂₃ (Xuôi / Ngược / Ngang sông)',
    observationGoal: 'Điều chỉnh vận tốc thuyền v₁₂ và dòng nước v₂₃ để quan sát tổng hợp vectơ vận tốc v₁₃ so với bờ.'
  },
  'phys-2006-10-7:0': {
    simId: 'atwood_pulley',
    regimeLabel: 'Định luật I (Quán tính) & Định luật II Newton F = ma',
    observationGoal: 'Thay đổi chênh lệch khối lượng (hợp lực) và tổng khối lượng để kiểm nghiệm a = F_hl / m.'
  },
  'phys-2006-10-7:1': {
    simId: 'momentum_collision',
    regimeLabel: 'Định luật III Newton · Cặp Lực Trực đối F_AB = −F_BA',
    observationGoal: 'Quan sát hai vật va chạm chịu hai lực tương tác cùng độ lớn, ngược chiều nhưng đặt vào hai vật khác nhau.'
  },
  'phys-2006-10-18:0': {
    simId: 'thermal_gas',
    regimeLabel: 'Định luật Sác-lơ (Đẳng tích V = const) · Áp suất Tỉ lệ Thuận T(K)',
    observationGoal: 'Giữ thể tích bình kín không đổi, tăng nhiệt độ T(K) để thấy áp suất và tốc độ va chạm phân tử tăng tuyến tính.'
  },
  'phys-2006-10-18:1': {
    simId: 'thermal_gas',
    regimeLabel: 'Phương trình Trạng thái Khí lí tưởng p₁V₁/T₁ = p₂V₂/T₂',
    observationGoal: 'Thay đổi đồng thời cả thể tích V và nhiệt độ T để kiểm chứng tích pV/T luôn bảo toàn cho một lượng khí xác định.'
  },
  'phys-2006-10-19:0': {
    simId: 'pv_thermodynamics',
    regimeLabel: 'Nội năng & Nguyên lí I NĐLH (ΔU = A + Q · Quy ước GDPT 2006)',
    observationGoal: 'Cấp nhiệt Q > 0 và thực hiện nén pít-tông (A > 0) hay cho khí dãn nở sinh công (A < 0) để xem biến thiên nội năng ΔU.'
  },
  'phys-2006-10-19:1': {
    simId: 'carnot_cycle_pv',
    regimeLabel: 'Nguyên lí II Nhiệt động lực học & Động cơ Nhiệt',
    observationGoal: 'Theo dõi chu trình nhận nhiệt Q₁ từ nguồn nóng, nhả Q₂ cho nguồn lạnh và giới hạn hiệu suất H < 1.'
  },
  'phys-2006-11-6:0': {
    simId: 'electric_power_meter',
    regimeLabel: 'Điện năng Tiêu thụ A = UIt & Công suất Đoạn mạch P = UI',
    observationGoal: 'Theo dõi điện năng tiêu thụ và công suất mạch ngoài khi điều chỉnh hiệu điện thế U và tải R.'
  },
  'phys-2006-11-6:1': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Công suất Nguồn điện P_ng = EI & Hiệu suất Nguồn H = U_N / E',
    observationGoal: 'Đối chiếu công suất toàn phần nguồn điện với phần tỏa nhiệt và hiệu suất cấp cho mạch ngoài.'
  },
  'phys-2006-11-10:0': {
    simId: 'electrolysis_faraday',
    regimeLabel: 'Dòng điện trong Chất điện phân & Hiện tượng Dương cực tan',
    observationGoal: 'Quan sát ion dương Cu²⁺ di chuyển về catôt (−), anion SO₄²⁻ về anôt (+) và đồng bám đều lên catôt.'
  },
  'phys-2006-11-10:1': {
    simId: 'electrolysis_faraday',
    regimeLabel: 'Định luật Fa-ra-đây về Điện phân m = (1/F)·(A/n)·It',
    observationGoal: 'Điều chỉnh cường độ dòng điện I và thời gian t để kiểm nghiệm khối lượng kim loại giải phóng m.'
  },
  'phys-2006-11-13:0': {
    simId: 'hall_effect',
    regimeLabel: 'Lực từ Tác dụng lên Dây dẫn Mang dòng F = BIl sinα',
    observationGoal: 'Quan sát hướng lực từ theo quy tắc bàn tay trái và sự phụ thuộc vào B, I và góc α.'
  },
  'phys-2006-11-13:1': {
    simId: 'dc_motor_2d',
    regimeLabel: 'Mômen Ngẫu lực từ Tác dụng lên Khung dây & Động cơ DC',
    observationGoal: 'Theo dõi mômen ngẫu lực từ M = IBS sinθ làm quay khung dây đặt trong từ trường đều.'
  },
  'phys-2006-11-18:0': {
    simId: 'prism_dispersion',
    regimeLabel: 'Lăng kính Thủy tinh · Góc Khúc xạ & Góc Lệch Tia sáng',
    observationGoal: 'Thay đổi góc chiết quang A, góc tới i₁ và chiết suất n để khảo sát đường truyền và góc lệch D qua lăng kính.'
  },
  'phys-2006-11-18:1': {
    simId: 'lens_optics',
    regimeLabel: 'Công thức Thấu kính Mỏng (1/f = 1/d + 1/d\' · k = −d\'/d)',
    observationGoal: 'Dịch chuyển vật để kiểm nghiệm quy ước dấu đại số của d\', độ tụ D và số phóng đại k.'
  },
  'phys-2006-11-19:0': {
    simId: 'eye_optics_2d',
    regimeLabel: 'Cấu tạo Quang học của Mắt · Điểm Cực cận & Cực viễn',
    observationGoal: 'Điều chỉnh khoảng cách vật để xem khả năng điều tiết tiêu cự thể thủy tinh đưa ảnh về đúng võng mạc.'
  },
  'phys-2006-11-19:1': {
    simId: 'eye_optics_2d',
    regimeLabel: 'Kính Cận (Phân kì f = −OC_V) & Kính Viễn / Lão (Hội tụ)',
    observationGoal: 'Chuyển giữa Mắt cận và Mắt viễn/lão để quan sát tác dụng điều chỉnh tiêu điểm của kính đeo sửa tật.'
  },
  'phys-2006-12-5:0': {
    simId: 'fresnel_phasor_2d',
    regimeLabel: 'Giản đồ Vectơ Quay Fre-nen Tổng hợp Hai Dao động',
    observationGoal: 'Quan sát hai vectơ quay A₁, A₂ hợp thành vectơ tổng A theo quy tắc hình bình hành và đồ thị x(t) = x₁ + x₂.'
  },
  'phys-2006-12-5:1': {
    simId: 'fresnel_phasor_2d',
    regimeLabel: 'Ảnh hưởng Độ lệch pha Δφ · Cùng pha, Ngược pha & Vuông pha',
    observationGoal: 'Kéo góc pha Δφ từ 0 đến π để kiểm nghiệm A_max = A₁+A₂, A_vuông = √(A₁²+A₂²) và A_min = |A₁−A₂|.'
  },
  'phys-2006-12-16:0': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Điện từ trường & Sóng Điện từ Ngang E ⊥ B ⊥ v (Cùng pha)',
    observationGoal: 'Quan sát vectơ cường độ điện trường E và cảm ứng từ B dao động vuông góc phương truyền và luôn cùng pha.'
  },
  'phys-2006-12-16:1': {
    simId: 'em_wave_3axis',
    regimeLabel: 'Các Dải Sóng Vô tuyến & Sóng Ngắn Phản xạ Tầng Điện li',
    observationGoal: 'Thay đổi tần số f và bước sóng λ = c·2π√(LC) để quan sát sự co giãn bước sóng vô tuyến.'
  },
  'phys-2006-12-20:0': {
    simId: 'bohr_energy_levels',
    regimeLabel: 'Hai Tiên đề Bo & Quang phổ Vạch Nguyên tử Hiđrô',
    observationGoal: 'Chọn bước nhảy mức năng lượng n → m để xem bán kính r_n = n²r₀ và bước sóng phôtôn phát ra hc/λ = E_n − E_m.'
  },
  'phys-2006-12-20:1': {
    simId: 'hydrogen_spectrum',
    regimeLabel: 'Quang – Phát quang (λ_pq > λ_kt) & Chùm tia Laze',
    observationGoal: 'Quan sát các vạch phát xạ đặc trưng khi êlectron chuyển từ mức kích thích xuống mức năng lượng thấp hơn.'
  }
};

function normalizeVi(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function resolveByStepContent(
  stepTitle: string,
  stepText: string,
  fallbackSim: PhysicsSimType
): { simId: AnyStepSimId; reason: string } {
  const rawLower = `${stepTitle} ${stepText}`.toLowerCase();
  const titleRawLower = stepTitle.toLowerCase();
  const titleNorm = normalizeVi(stepTitle);
  const fullNorm = normalizeVi(`${stepTitle} ${stepText}`);

  const has = (kw: string, inTitleFirst = false) =>
    inTitleFirst ? titleNorm.includes(kw) : fullNorm.includes(kw);

  // 0. Middle School Grade 6-8 Labs
  if (has('binh chia do', true) || has('gioi han do', true) || has('do chia nho nhat', true) || has('nhiet ke', true) || (has('do chieu dai', true) || has('do the tich', true) || has('do khoi luong', true))) {
    return { simId: 'measurement_tools_2d', reason: 'Dụng cụ đo thực hành: Thước, Bình chia độ, Lực kế & Nhiệt kế' };
  }
  if (has('trong luong', true) || has('luc ke', true) || has('ma sat', true) || has('luc tiep xuc', true) || has('do dan lo xo', true) || (has('bien dang', true) && has('lo xo'))) {
    return { simId: 'hooke_forces_2d', reason: 'Lực kế lò xo (P = 10m), biến dạng & lực ma sát trượt' };
  }
  if (has('truyen thang anh sang', true) || has('bong toi', true) || has('nhat thuc', true) || has('nguyet thuc', true)) {
    return { simId: 'shadow_eclipse_2d', reason: 'Định luật truyền thẳng ánh sáng, vùng bóng tối & nhật/nguyệt thực' };
  }
  if (has('nam cham', true) || has('la ban', true) || has('tu pho', true) || has('tu truong trai dat', true)) {
    return { simId: 'magnet_compass_2d', reason: 'Nam châm vĩnh cửu, đường sức từ & kim la bàn định hướng' };
  }
  if (has('dan nhiet', true) || has('doi luu', true) || has('buc xa nhiet', true) || has('nhiet nang', true)) {
    return { simId: 'heat_transfer_2d', reason: 'Ba hình thức truyền nhiệt: Dẫn nhiệt, Đối lưu & Bức xạ nhiệt' };
  }
  if (has('no vi nhiet', true) || has('bang kep', true) || has('nhiet giai', true)) {
    return { simId: 'thermal_expansion_2d', reason: 'Sự nở vì nhiệt của Rắn – Lỏng – Khí & Băng kép' };
  }
  if (has('guong phang', true) || has('guong cau', true) || has('phan xa anh sang', true) || has('anh ao qua guong', true) || has('tia toi', true)) {
    return { simId: 'plane_mirror_2d', reason: 'Phản xạ ánh sáng trên gương (i\' = i) & Ảnh qua gương' };
  }
  if (has('may co don gian', true) || has('rong roc dong', true) || (has('don bay', true) && has('rong roc'))) {
    return { simId: 'simple_machines_2d', reason: 'Máy cơ đơn giản: Đòn bẩy, Ròng rọc động & Mặt phẳng nghiêng' };
  }
  if (has('binh thong nhau', true) || has('may ep thuy luc', true) || has('ap suat khi quyen', true) || has('ap suat chat ran', true) || (has('ap suat', true) && !has('archimedes', true) && !has('khi li tuong', true))) {
    return { simId: 'fluid_pressure_2d', reason: 'Áp suất p = F/S, p = d·h & Máy ép thủy lực Pascal' };
  }

  // 1. Specific Mechanics & Measurements
  if (has('van toc trung binh', true) || has('chia chang', true) || has('tinh vtb')) {
    return { simId: 'average_velocity_stages', reason: 'Mô phỏng chia chặng tính vận tốc trung bình v_tb' };
  }
  if (has('sai so', true) || has('phep do truc tiep', true) || has('phep do gian tiep', true)) {
    return { simId: 'measurement_error_lab', reason: 'Phòng thí nghiệm kiểm tra sai số hệ thống & ngẫu nhiên' };
  }
  if (has('cong quang dien') || (has('do toc do') && has('dong ho'))) {
    return { simId: 'kinematics_graphs', reason: 'Đo tốc độ tức thời & thời gian bằng cổng quang điện' };
  }
  if (
    has('tinh tuong doi', true) ||
    has('cong van toc', true) ||
    has('cong thuc cong van toc', true) ||
    (has('quang duong', true) && has('do dich chuyen', true))
  ) {
    return { simId: 'distance_displacement_rel', reason: 'Tính tương đối chuyển động, độ dịch chuyển & cộng vận tốc' };
  }
  if (
    (has('tong hop', true) || has('phan tich', true) || has('can bang', true)) &&
    (has('luc', true) || has('vecto', true))
  ) {
    return { simId: 'vector_addition_2d', reason: 'Quy tắc hình bình hành tổng hợp & phân tích lực' };
  }
  if (
    has('cong co hoc', true) ||
    (has('cong suat', true) &&
      !has('dien', true) &&
      !has('rlc', true) &&
      !has('nhiet', true) &&
      !has('toa nhiet', true) &&
      !titleRawLower.includes('điện'))
  ) {
    return { simId: 'work_power_joule', reason: 'Mô phỏng Công cơ học A = F·s·cosα & Công suất' };
  }
  if (has('hieu suat', true) && (has('nang luong', true) || has('co', true)) && !has('dien', true)) {
    return { simId: 'work_power_joule', reason: 'Hiệu suất chuyển hóa cơ năng & lực ma sát' };
  }
  if (has('hooke', true) || (has('bien dang', true) && has('lo xo', true))) {
    return { simId: 'hooke_spring_stat', reason: 'Biến dạng lò xo & định luật Hooke F_đh = k|Δl|' };
  }
  if (has('archimedes', true) || has('ap suat chat long', true) || has('noi chim', true)) {
    return { simId: 'archimedes_buoyancy', reason: 'Áp suất chất lỏng & Lực đẩy Archimedes' };
  }
  if (has('moment', true) || has('ngau luc', true) || has('don bay', true) || has('trong tam', true)) {
    return { simId: 'torque_lever', reason: 'Moment lực & cân bằng vật rắn quay' };
  }
  if (has('atwood', true) || has('rong roc', true)) {
    return { simId: 'atwood_pulley', reason: 'Hệ liên kết dây & ròng rọc Atwood' };
  }
  if (has('mat phang nghieng', true) || has('ma sat truot', true)) {
    return { simId: 'inclined_plane', reason: 'Chuyển động trên mặt phẳng nghiêng có ma sát' };
  }
  if (has('huong tam', true) || has('duong vong', true) || has('tron deu', true) || has('radian', true)) {
    return {
      simId: has('duong vong', true) ? 'centrifuge_banked_curve' : 'circular_motion',
      reason: 'Chuyển động tròn đều & lực hướng tâm'
    };
  }
  if (has('lorentz', true) || has('cyclotron', true)) {
    return { simId: 'cyclotron_accelerator', reason: 'Chuyển động hạt mang điện trong từ trường' };
  }
  if (has('hieu ung hall', true) || has('dien the hall', true)) {
    return { simId: 'hall_effect', reason: 'Hiệu ứng Hall & lực từ lên hạt tải điện' };
  }
  if (
    has('nhanh dan', true) ||
    has('cham dan', true) ||
    has('gia toc', true) ||
    has('bien doi deu', true) ||
    has('do thi (v', true) ||
    has('do thi do dich', true)
  ) {
    return { simId: 'kinematics_graphs', reason: 'Động học đồ thị chuyển động v–t & x–t' };
  }
  if (has('compton', true)) {
    return { simId: 'compton_scattering', reason: 'Tán xạ Compton & động lượng photon' };
  }
  if (has('va cham', true) || has('dong luong', true) || has('xung luong', true) || has('dem khi', true)) {
    return { simId: 'momentum_collision', reason: 'Bảo toàn động lượng & va chạm đàn hồi / mềm' };
  }
  if (has('nem', true) || has('parabol', true) || has('tam xa', true)) {
    return { simId: 'projectile_motion', reason: 'Quỹ đạo ném xiên / ném ngang Parabol' };
  }
  if (has('hap dan', true) || has('ve tinh', true) || has('kepler', true) || has('vu tru', true)) {
    return {
      simId: has('ve tinh', true) ? 'planetary_escape_velocity' : 'kepler_orbit',
      reason: 'Trường hấp dẫn & quỹ đạo vệ tinh Kepler'
    };
  }
  if (has('roi tu do', true) || (has('co nang', true) && !has('con lac', true) && !has('dao dong', true))) {
    return { simId: 'free_fall_energy', reason: 'Chuyển hóa Động năng – Thế năng & Cơ năng' };
  }

  // 2. Oscillations & Waves
  if (
    has('tat dan', true) ||
    has('cuong buc', true) ||
    (has('dao dong', true) && has('co nang', true)) ||
    (has('cong huong', true) && !has('dien', true) && !has('ong', true))
  ) {
    return { simId: 'damped_resonance', reason: 'Dao động tắt dần, cưỡng bức & đỉnh cộng hưởng' };
  }
  if (has('con lac don', true) || (has('con lac', true) && has('foucault', true))) {
    return { simId: 'simple_pendulum', reason: 'Dao động con lắc đơn trong trọng trường' };
  }
  if (has('con lac lo xo', true) || has('ti so dong nang / the nang', true)) {
    return { simId: 'spring_pendulum', reason: 'Dao động điều hòa con lắc lò xo & năng lượng' };
  }
  if (has('fre-nen', true) || has('fresnel', true) || has('tong hop hai dao dong', true)) {
    return { simId: 'fresnel_phasor_2d', reason: 'Giản đồ vectơ quay Fre-nen tổng hợp dao động' };
  }
  if (has('dao dong ki', true) || has('so o tren man hinh', true) || has('pha dao dong', true) || has('doc lap thoi gian', true) || has('do thi dao dong', true)) {
    return { simId: 'lissajous_shm', reason: 'Dao động kí & biểu đồ pha dao động điều hòa' };
  }
  if (has('ban mong', true) || has('mang mong', true)) {
    return { simId: 'thin_film_interference', reason: 'Giao thoa trên bản mỏng & lớp phủ chống phản xạ' };
  }
  if (has('nhieu xa', true) || has('mot khe hep', true)) {
    return { simId: 'single_slit_diffraction', reason: 'Nhiễu xạ ánh sáng qua một khe hẹp' };
  }
  if (has('young', true) || has('y-ang', true) || has('giao thoa anh sang', true)) {
    return { simId: 'young_interference', reason: 'Giao thoa ánh sáng hai khe Young' };
  }
  if (has('song dung', true) || has('nut song', true) || has('bung song', true) || has('ong cong huong', true)) {
    return { simId: 'standing_wave', reason: 'Sóng dừng trên dây & cộng hưởng ống âm' };
  }
  if (has('giao thoa', true)) {
    return { simId: 'wave_interference', reason: 'Giao thoa hai nguồn sóng kết hợp' };
  }
  if (has('cuong do am', true) || has('sinh li cua am', true) || has('sieu am', true) || has('tan so am', true)) {
    return { simId: 'sound_intensity', reason: 'Cường độ âm & truyền sóng âm trong không gian' };
  }
  if (has('doppler', true) || (!rawLower.includes('mạch') && (has('so mach') || has('hieu ung mach') || has('non mach')))) {
    return { simId: has('so mach') || has('non mach') ? 'mach_shockwave' : 'doppler_effect', reason: 'Hiệu ứng Doppler & sóng xung kích' };
  }
  if (has('mach lc', true) || has('mach dao dong', true)) {
    return { simId: 'lc_oscillation', reason: 'Mạch dao động điện từ LC & chuyển hóa năng lượng' };
  }
  if (has('song dien tu', true) || has('song vo tuyen', true) || has('maxwell', true) || has('bien dieu', true) || has('am)', true) || has('fm)', true)) {
    return { simId: 'em_wave_3axis', reason: 'Mô hình 3 trục Sóng điện từ E ⊥ B ⊥ v' };
  }
  if (titleRawLower.includes('sóng') || has('buoc song', true) || has('song co', true) || has('song am', true) || has('song ngang', true) || has('song doc', true)) {
    return { simId: 'standing_wave', reason: 'Truyền sóng cơ & bước sóng λ' };
  }

  // 3. Thermal & Gases (Grade 12)
  if (has('nong chay', true) || has('hoa hoi', true) || has('chuyen the', true) || has('nhiet do - thoi gian', true) || has('nhiet do – thoi gian', true)) {
    return { simId: 'phase_change_heating', reason: 'Đồ thị chuyển thể T(t) & ẩn nhiệt nóng chảy/hóa hơi' };
  }
  if (has('can bang nhiet', true) || has('nhiet dung rieng', true) || has('nhiet luong ke', true)) {
    return { simId: 'calorimetry_mixing', reason: 'Thí nghiệm nhiệt lượng kế & cân bằng nhiệt' };
  }
  if (has('carnot', true)) {
    return { simId: 'carnot_cycle_pv', reason: 'Chu trình Carnot & hiệu suất động cơ nhiệt lí tưởng' };
  }
  if (
    (has('dinh luat i', true) && !has('newton', true) && !has('niu-ton', true) && !has('quan tinh', true)) ||
    has('nguyen li i', true) ||
    has('noi nang', true)
  ) {
    return { simId: 'pv_thermodynamics', reason: 'Nguyên lí I Nhiệt động lực học & công khối khí' };
  }
  if (has('boyle', true) || has('charles', true) || has('clapeyron', true) || has('sac-lo', true) || has('boi-lo', true) || has('khi li tuong', true) || has('dang nhiet', true) || has('dang tich', true) || has('dang ap', true) || has('phan tu khi', true) || has('dong hoc phan tu', true)) {
    return { simId: 'thermal_gas', reason: 'Mô hình khí lí tưởng pV = nRT & chuyển động phân tử' };
  }

  // 4. Electricity & Magnetism
  if (has('dien phan', true) || has('duong cuc tan', true) || (has('fa-ra-day', true) && has('chat dien phan'))) {
    return { simId: 'electrolysis_faraday', reason: 'Dòng điện trong chất điện phân & định luật Fa-ra-đây' };
  }
  if (has('dong co dien', true) || has('co gop', true) || has('luc dien tu', true)) {
    return { simId: 'dc_motor_2d', reason: 'Lực điện từ & động cơ điện một chiều' };
  }
  if (has('nha may', true) || has('thuy dien', true) || has('nhiet dien', true) || has('dien gio', true) || has('san xuat dien', true)) {
    return { simId: 'power_plant_generator', reason: 'Nhà máy thủy điện – nhiệt điện – điện gió & chuyển hóa năng lượng' };
  }
  if (has('coulomb', true) || has('cu-long', true) || has('tuong tac dien', true)) {
    return { simId: 'coulomb_pendulum', reason: 'Tương tác tĩnh điện Coulomb' };
  }
  if (has('tu dien', true) || has('dien dung', true)) {
    return { simId: 'rc_capacitor', reason: 'Nạp – xả tụ điện & năng lượng điện trường' };
  }
  if (has('dien truong', true) || has('duong suc dien', true) || has('cong cua luc dien', true) || has('dien the', true)) {
    return { simId: 'electric_field', reason: 'Đường sức điện trường & lực điện qE' };
  }
  if (has('mach cau', true) || has('kirchhoff', true) || has('cam bien', true) || has('phan ap', true)) {
    return { simId: 'wheatstone_bridge', reason: 'Mạch cầu điện trở & phân áp' };
  }
  if (has('cong suat dien', true) || has('dien nang', true) || has('cong to dien', true) || has('cong cua dong dien', true)) {
    return { simId: 'electric_power_meter', reason: 'Công suất điện P = UI & điện năng trên công tơ kWh' };
  }
  if (has('jun', true) || has('cong suat nguon', true) || (has('cong suat tieu thu', true) && has('mach', true))) {
    return { simId: 'joule_lenz_heat', reason: 'Công suất tỏa nhiệt điện trở Q = I²Rt' };
  }
  if (has('rlc', true) || has('tong tro', true) || has('cong huong dien', true)) {
    return { simId: 'ac_rlc_circuit', reason: 'Mạch RLC xoay chiều & giản đồ pha' };
  }
  if (has('chinh luu', true) || has('op-amp', true) || has('diode', true) || has('diot', true) || has('ban dan', true)) {
    return { simId: 'diode_rectifier', reason: 'Chỉnh lưu & linh kiện bán dẫn' };
  }
  if (has('may bien ap', true) || has('may bien the', true) || has('truyen tai dien', true)) {
    return { simId: 'transformer_2d', reason: 'Máy biến áp & truyền tải điện năng' };
  }
  if (has('luc tu', true) || has('ban tay trai', true) || has('cam ung tu', true)) {
    return { simId: 'hall_effect', reason: 'Lực từ lên dòng điện & hiệu ứng từ' };
  }
  if (has('tu thong', true) || has('faraday', true) || has('lenz', true) || has('cam ung dien tu', true) || has('xoay chieu', true) || has('thanh kim loai', true) || has('dong dien foucault', true)) {
    return { simId: 'magnetic_induction', reason: 'Cảm ứng điện từ Faraday & quy tắc Lenz' };
  }
  if (has('ohm', true) || has('dinh luat om', true) || has('cuong do dong dien', true) || has('suat dien dong', true) || has('u theo i', true) || has('so do mach', true)) {
    return { simId: 'ohm_circuit', reason: 'Định luật Ohm & sơ đồ mạch điện' };
  }

  // 5. Optics, Quantum & Nuclear
  if (has('khuc xa', true) || has('phan xa toan phan', true)) {
    return { simId: has('toan phan', true) ? 'fiber_optic_tir' : 'light_refraction', reason: 'Khúc xạ ánh sáng & phản xạ toàn phần' };
  }
  if (has('tan sac', true) || has('lang kinh', true)) {
    return { simId: 'prism_dispersion', reason: 'Tán sắc ánh sáng qua lăng kính' };
  }
  if (has('guong phang', true)) {
    return { simId: 'plane_mirror_2d', reason: 'Phản xạ ánh sáng & ảnh ảo gương phẳng' };
  }
  if (has('guong', true)) {
    return { simId: 'spherical_mirror', reason: 'Tạo ảnh qua gương cầu' };
  }
  if (has('tat cua mat', true) || has('mat can', true) || has('mat lao', true) || has('mat vien', true) || has('thuy tinh the', true) || has('cuc can', true) || has('cuc vien', true) || (has('mat', true) && has('kinh lup', true))) {
    return { simId: 'eye_optics_2d', reason: 'Quang học của mắt, sự điều tiết & kính sửa tật khúc xạ' };
  }
  if (has('thau kinh', true) || has('kinh lup', true) || has('kinh hien vi', true) || has('kinh thien van', true)) {
    return { simId: has('thien van', true) || has('hien vi', true) ? 'telescope_microscope' : 'lens_optics', reason: 'Vẽ tia sáng & tạo ảnh qua thấu kính' };
  }
  if (has('bohr', true) || has('mau bo', true) || has('quang pho', true) || has('hydro', true) || has('hidro', true) || has('vung nang luong', true)) {
    return { simId: 'bohr_energy_levels', reason: 'Mẫu nguyên tử Bohr & chuyển mức năng lượng' };
  }
  if ((has('quang dien', true) && !has('cong quang dien')) || has('luong tu anh sang', true) || has('tia x', true)) {
    return { simId: 'photoelectric_effect', reason: 'Hiệu ứng quang điện & photon' };
  }
  if (has('do hut khoi', true) || has('lien ket rieng', true)) {
    return { simId: 'binding_energy_curve', reason: 'Độ hụt khối & năng lượng liên kết riêng hạt nhân' };
  }
  if (has('phan hach', true) || has('nhiet hach', true) || has('lo phan ung', true)) {
    return { simId: 'nuclear_fission', reason: 'Phản ứng phân hạch dây chuyền' };
  }
  if (has('phong xa', true) || has('dinh tuoi', true) || has('14c', true)) {
    return { simId: 'nuclear_decay', reason: 'Định luật phóng xạ theo chu kì bán rã T' };
  }
  if (has('rutherford', true) || has('hat nhan', true)) {
    return { simId: 'nuclear_fission', reason: 'Cấu trúc hạt nhân & tương tác hạt nhân' };
  }

  return {
    simId: fallbackSim,
    reason: 'Mô phỏng tương tác trực tiếp theo chủ đề bài giảng'
  };
}

export function resolveStepSimulation(
  lesson: PhysicsLesson,
  stepIndex: number,
  stepTitle = '',
  stepConcept = ''
): ResolvedStepSim {
  const override = EXPLICIT_STEP_SIM_MAP[`${lesson.id}:${stepIndex}`];

  let simId: AnyStepSimId;
  let regimeLabel: string;
  let observationGoal: string;
  let paramOverrides: Record<string, number> = {};
  let flagOverrides: Partial<Physics2DFlags> = {};

  if (override) {
    simId = override.simId;
    regimeLabel = override.regimeLabel;
    observationGoal = override.observationGoal;
    paramOverrides = override.paramOverrides || {};
    flagOverrides = override.flagOverrides || {};
  } else {
    const matched = resolveByStepContent(
      stepTitle || lesson.title,
      stepConcept || lesson.description,
      lesson.simulationType
    );
    simId = matched.simId;
    regimeLabel = stepIndex === 0
      ? `Trạng thái chuẩn · ${matched.reason}`
      : `Khảo sát bước ${stepIndex + 1} · ${matched.reason}`;
    observationGoal =
      stepIndex === 0
        ? `Quan sát mô phỏng trực quan tương ứng trực tiếp với mục "${stepTitle || lesson.title}", kéo thanh trượt để kiểm chứng quy luật.`
        : `Điều chỉnh các tham số thực nghiệm cho nội dung "${stepTitle || lesson.title}" và đối chiếu số liệu trên bảng đo SI.`;

    // Gentle progressive variation if two consecutive steps reuse the same engine
    if (stepIndex === 1 && simId === lesson.simulationType) {
      if (simId === 'ohm_circuit') paramOverrides.circuitType = 1;
      else if (simId === 'lens_optics') flagOverrides.isDiverging = true;
      else if (simId === 'free_fall_energy' || simId === 'projectile_motion') flagOverrides.airDrag = true;
      else if (simId === 'simple_pendulum' || simId === 'spring_pendulum') flagOverrides.hasFriction = true;
    }
  }

  // Build resolved spec from either CUSTOM_STEP_SIM_SPECS or PHYSICS_2D_SIMS
  const isCustomEngine = simId in CUSTOM_STEP_SIM_SPECS;

  if (isCustomEngine) {
    const spec = CUSTOM_STEP_SIM_SPECS[simId as CustomStepSimId];
    return {
      simId,
      isCustomEngine: true,
      title: spec.title,
      formula: spec.formula,
      regimeLabel,
      observationGoal,
      defaultParams: { ...spec.defaultParams, ...paramOverrides },
      paramBounds: spec.paramBounds,
      presets: spec.presets,
      flags: { ...DEFAULT_PHYSICS_2D_FLAGS, ...flagOverrides }
    };
  }

  const catalogSpec = PHYSICS_2D_SIMS[simId as PhysicsSimType];
  if (catalogSpec) {
    return {
      simId,
      isCustomEngine: false,
      title: catalogSpec.title,
      formula: catalogSpec.formula,
      regimeLabel,
      observationGoal,
      defaultParams: { ...catalogSpec.defaultParams, ...paramOverrides },
      paramBounds: catalogSpec.paramBounds,
      presets: catalogSpec.presets,
      flags: { ...DEFAULT_PHYSICS_2D_FLAGS, ...flagOverrides }
    };
  }

  // Final safety fallback to lesson.simulationType
  const fallbackSpec = PHYSICS_2D_SIMS[lesson.simulationType];
  return {
    simId: lesson.simulationType,
    isCustomEngine: false,
    title: fallbackSpec?.title || lesson.title,
    formula: fallbackSpec?.formula || lesson.keyFormulas[0] || '',
    regimeLabel,
    observationGoal,
    defaultParams: { ...lesson.defaultParams, ...paramOverrides },
    paramBounds: lesson.paramBounds || {},
    presets: fallbackSpec?.presets || [],
    flags: { ...DEFAULT_PHYSICS_2D_FLAGS, ...flagOverrides }
  };
}
