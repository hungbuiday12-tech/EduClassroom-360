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
  // ---------------- LỚP 9 CỐT LÕI ----------------
  'phys-9-mech-heat:0': {
    simId: 'average_velocity_stages',
    regimeLabel: 'Mô phỏng Chặng 1 & 2 · Kiểm chứng Bẫy 40 km/h & 60 km/h',
    observationGoal:
      'Hai xe đi cùng quãng đường S: xe xanh đi chậm 40 km/h nửa đầu (tốn nhiều giờ hơn) rồi 60 km/h nửa sau → v_tb = 48 km/h < 50 km/h!'
  },
  'phys-9-mech-heat:1': {
    simId: 'work_power_joule',
    regimeLabel: 'Mô phỏng Công cơ học & Công suất kéo vật',
    observationGoal:
      'Điều chỉnh lực kéo F, góc nghiêng α và ma sát μ để thấy công có ích A = F·s·cosα, công suất P = Fx·v và hiệu suất H%.'
  },
  'phys-9-mech-heat:2': {
    simId: 'calorimetry_mixing',
    regimeLabel: 'Thí nghiệm Nhiệt lượng kế · Cân bằng Nhiệt Q_tỏa = Q_thu',
    observationGoal:
      'Thả/pha hai khối lượng nước nóng – lạnh khác nhiệt độ để quan sát nhiệt truyền từ nóng sang lạnh tới nhiệt độ cân bằng t.'
  },
  'phys-9-mech-heat:3': {
    simId: 'free_fall_energy',
    regimeLabel: 'Thí nghiệm Rơi tự do & Bảo toàn Cơ năng W = Wđ + Wt',
    observationGoal:
      'Quan sát thế năng chuyển hóa thành động năng khi rơi; bật Lực cản không khí để thấy phần cơ năng hao phí thành nhiệt.'
  },

  'phys-9-elec:0': {
    simId: 'ohm_circuit',
    regimeLabel: 'Mạch điện cơ bản · Định luật Ôm I = U / R',
    observationGoal:
      'Thay đổi hiệu điện thế U và điện trở R để kiểm nghiệm cường độ dòng điện tỉ lệ thuận với U và tỉ lệ nghịch với R.'
  },
  'phys-9-elec:1': {
    simId: 'ohm_circuit',
    regimeLabel: 'So sánh Mạch Nối tiếp vs Mạch Song song',
    observationGoal:
      'Khi chuyển sang mạch song song (circuitType = 1), điện trở tương đương giảm nhỏ hơn cả R₁ và R₂ làm dòng tổng tăng mạnh.',
    paramOverrides: { circuitType: 1 }
  },
  'phys-9-elec:2': {
    simId: 'joule_lenz_heat',
    regimeLabel: 'Định luật Jun – Len-xơ · Nhiệt lượng tỏa ra Q = I²Rt',
    observationGoal:
      'Quan sát dây điện trở nung nóng bình nước theo tỉ lệ bình phương cường độ dòng điện I² và nhiệt kế tăng theo thời gian.'
  },

  'phys-9-optics:0': {
    simId: 'light_refraction',
    regimeLabel: 'Khúc xạ Ánh sáng qua Mặt phân cách Hai môi trường',
    observationGoal:
      'Kéo góc tới i và chiết suất n₂ để thấy tia khúc xạ lệch lại gần pháp tuyến (n₁ < n₂) hay xa pháp tuyến và xảy ra Phản xạ Toàn phần.'
  },
  'phys-9-optics:1': {
    simId: 'lens_optics',
    regimeLabel: 'Thấu kính Hội tụ & Ảnh thật qua Tiêu điểm',
    observationGoal:
      'Quan sát 3 tia đặc biệt đi qua quang tâm O, song song trục chính qua F\' và cho ảnh thật ngược chiều khi d > f.'
  },
  'phys-9-optics:2': {
    simId: 'lens_optics',
    regimeLabel: 'Thấu kính Phân kì & Ảnh ảo cùng chiều (f < 0)',
    observationGoal:
      'So sánh sự bẻ chùm tia ló phân kì khiến ảnh B\' luôn là ảnh ảo, cùng chiều và nhỏ hơn vật.',
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
    regimeLabel: 'Định luật Khúc xạ & Góc lệch qua Lưỡng chất phẳng',
    observationGoal:
      'Thay đổi chiết suất môi trường và góc tới i để khảo sát n₁·sin(i) = n₂·sin(r).'
  },
  'phys-9-energy-refract:2': {
    simId: 'free_fall_energy',
    regimeLabel: 'Kiểm chứng Bảo toàn & Chuyển hóa Năng lượng',
    observationGoal:
      'Theo dõi tổng cơ năng luôn bảo toàn trong môi trường lý tưởng và phần chuyển thành nhiệt khi có lực cản.'
  },

  'phys-9-induction-ac:0': {
    simId: 'magnetic_induction',
    regimeLabel: 'Hiện tượng Cảm ứng Điện từ khi Từ thông Biến thiên',
    observationGoal:
      'Chỉ khi nam châm chuyển động tương đối làm số đường sức xuyên qua cuộn dây biến thiên thì kim điện kế mới lệch.'
  },
  'phys-9-induction-ac:1': {
    simId: 'magnetic_induction',
    regimeLabel: 'Tạo Dòng điện Xoay chiều & Quy tắc Đảo chiều Dòng cảm ứng',
    observationGoal:
      'Đảo cực nam châm hoặc đổi tốc độ dao động để quan sát chiều dòng điện cảm ứng đổi dấu tuần hoàn.',
    flagOverrides: { flipMagnet: true }
  },
  'phys-9-induction-ac:2': {
    simId: 'transformer_2d',
    regimeLabel: 'Máy Biến áp & Truyền tải Điện năng Đi xa',
    observationGoal:
      'Điều chỉnh tỉ số vòng dây N₁/N₂ để tăng áp truyền tải giúp giảm mạnh hao phí ΔP = P²R / U².'
  },

  'phys-9-power-bill:0': {
    simId: 'free_fall_energy',
    regimeLabel: 'Động năng, Thế năng Trọng trường & Cơ năng',
    observationGoal:
      'Quan sát biểu đồ cột Wđ – Wt biến thiên bù trừ cho nhau khi vật rơi.'
  },
  'phys-9-power-bill:1': {
    simId: 'work_power_joule',
    regimeLabel: 'Công Cơ học A = F·s·cosα & Công suất P = A/t',
    observationGoal:
      'Thay đổi lực F và góc kéo α để thấy trực tiếp tốc độ sinh công tức thời.'
  },
  'phys-9-power-bill:2': {
    simId: 'torque_lever',
    regimeLabel: 'Máy Cơ Đơn giản, Quy tắc Đòn bẩy & Hiệu suất',
    observationGoal:
      'Lợi về lực bao nhiêu lần thì thiệt bấy nhiêu lần về đường đi — công không đổi!'
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
  const titleNorm = normalizeVi(stepTitle);
  const fullNorm = normalizeVi(`${stepTitle} ${stepText}`);

  const has = (kw: string, inTitleFirst = false) =>
    inTitleFirst ? titleNorm.includes(kw) : fullNorm.includes(kw);

  // 1. Specific Mechanics & Measurements
  if (has('van toc trung binh', true) || has('chia chang', true) || has('tinh vtb')) {
    return { simId: 'average_velocity_stages', reason: 'Mô phỏng chia chặng tính vận tốc trung bình v_tb' };
  }
  if (has('sai so', true) || has('phep do truc tiep', true) || has('phep do gian tiep', true)) {
    return { simId: 'measurement_error_lab', reason: 'Phòng thí nghiệm kiểm tra sai số hệ thống & ngẫu nhiên' };
  }
  if (has('quang duong', true) && (has('do dich chuyen', true) || has('cong van toc', true))) {
    return { simId: 'distance_displacement_rel', reason: 'So sánh quãng đường s và độ dịch chuyển d' };
  }
  if (has('tong hop', true) && (has('luc', true) || has('vecto', true))) {
    return { simId: 'vector_addition_2d', reason: 'Quy tắc hình bình hành tổng hợp vectơ' };
  }
  if (has('cong co hoc', true) || has('cong suat', true) && !has('dien', true) && !has('rlc', true)) {
    return { simId: 'work_power_joule', reason: 'Mô phỏng Công cơ học A = F·s·cosα & Công suất' };
  }
  if (has('hieu suat', true) && (has('nang luong', true) || has('co', true))) {
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
  if (has('va cham', true) || has('dong luong', true) || has('xung luong', true) || has('dem khi', true)) {
    return { simId: 'momentum_collision', reason: 'Bảo toàn động lượng & va chạm đàn hồi / mềm' };
  }
  if (has('nem', true) || has('parabol', true) || has('tam xa', true)) {
    return { simId: 'projectile_motion', reason: 'Quỹ đạo ném xiên / ném ngang Parabol' };
  }
  if (has('huong tam', true) || has('duong vong', true) || has('tron deu', true) || has('radian', true)) {
    return {
      simId: has('duong vong', true) ? 'centrifuge_banked_curve' : 'circular_motion',
      reason: 'Chuyển động tròn đều & lực hướng tâm'
    };
  }
  if (has('hap dan', true) || has('ve tinh', true) || has('kepler', true) || has('vu tru', true)) {
    return {
      simId: has('ve tinh', true) ? 'planetary_escape_velocity' : 'kepler_orbit',
      reason: 'Trường hấp dẫn & quỹ đạo vệ tinh Kepler'
    };
  }
  if (has('gia toc', true) || has('bien doi deu', true) || has('do thi (v', true) || has('do thi do dich', true)) {
    return { simId: 'kinematics_graphs', reason: 'Động học đồ thị chuyển động v–t & x–t' };
  }
  if (has('roi tu do', true) || has('co nang', true) && !has('con lac', true)) {
    return { simId: 'free_fall_energy', reason: 'Chuyển hóa Động năng – Thế năng & Cơ năng' };
  }

  // 2. Oscillations & Waves
  if (has('tat dan', true) || has('cuong buc', true) || has('cong huong', true) && !has('dien', true) && !has('ong', true)) {
    return { simId: 'damped_resonance', reason: 'Dao động tắt dần, cưỡng bức & đỉnh cộng hưởng' };
  }
  if (has('con lac don', true)) {
    return { simId: 'simple_pendulum', reason: 'Dao động con lắc đơn trong trọng trường' };
  }
  if (has('con lac lo xo', true) || has('ti so dong nang / the nang', true)) {
    return { simId: 'spring_pendulum', reason: 'Dao động điều hòa con lắc lò xo & năng lượng' };
  }
  if (has('dao dong ki', true) || has('so o tren man hinh', true) || has('pha dao dong', true) || has('doc lap thoi gian', true) || has('do thi dao dong', true)) {
    return { simId: 'lissajous_shm', reason: 'Dao động kí & biểu đồ pha dao động điều hòa' };
  }
  if (has('young', true) || has('y-ang', true) || has('giao thoa anh sang', true)) {
    return { simId: 'young_interference', reason: 'Giao thoa ánh sáng hai khe Young' };
  }
  if (has('song dung', true) || has('nut', true) || has('bung', true) || has('ong cong huong', true)) {
    return { simId: 'standing_wave', reason: 'Sóng dừng trên dây & cộng hưởng ống âm' };
  }
  if (has('giao thoa', true)) {
    return { simId: 'wave_interference', reason: 'Giao thoa hai nguồn sóng kết hợp' };
  }
  if (has('cuong do am', true) || has('sinh li cua am', true) || has('sieu am', true)) {
    return { simId: 'sound_intensity', reason: 'Cường độ âm & truyền sóng âm trong không gian' };
  }
  if (has('doppler', true) || has('mach', true)) {
    return { simId: has('mach', true) ? 'mach_shockwave' : 'doppler_effect', reason: 'Hiệu ứng Doppler & sóng xung kích' };
  }
  if (has('song dien tu', true) || has('maxwell', true) || has('bien dieu', true) || has('am)', true) || has('fm)', true)) {
    return { simId: 'em_wave_3axis', reason: 'Mô hình 3 trục Sóng điện từ E ⊥ B ⊥ v' };
  }
  if (has('song', true)) {
    return { simId: 'standing_wave', reason: 'Truyền sóng cơ & bước sóng λ' };
  }

  // 3. Thermal & Gases (Grade 12)
  if (has('nong chay', true) || has('hoa hoi', true) || has('chuyen the', true) || has('nhiet do - thoi gian', true)) {
    return { simId: 'phase_change_heating', reason: 'Đồ thị chuyển thể T(t) & ẩn nhiệt nóng chảy/hóa hơi' };
  }
  if (has('can bang nhiet', true) || has('nhiet dung rieng', true) || has('nhiet luong ke', true)) {
    return { simId: 'calorimetry_mixing', reason: 'Thí nghiệm nhiệt lượng kế & cân bằng nhiệt' };
  }
  if (has('carnot', true) || has('dinh luat i', true) || has('nguyen li i', true) || has('noi nang', true)) {
    return { simId: 'pv_thermodynamics', reason: 'Nguyên lí I Nhiệt động lực học & công khối khí' };
  }
  if (has('boyle', true) || has('charles', true) || has('clapeyron', true) || has('khi li tuong', true) || has('dang nhiet', true) || has('dang ap', true) || has('phan tu khi', true) || has('dong hoc phan tu', true)) {
    return { simId: 'thermal_gas', reason: 'Mô hình khí lí tưởng pV = nRT & chuyển động phân tử' };
  }

  // 4. Electricity & Magnetism
  if (has('coulomb', true) || has('tuong tac dien', true)) {
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
  if (has('jun', true) || has('cong suat nguon', true) || has('cong suat tieu thu', true) && has('mach', true)) {
    return { simId: 'joule_lenz_heat', reason: 'Công suất tỏa nhiệt điện trở Q = I²Rt' };
  }
  if (has('rlc', true) || has('tong tro', true) || has('cong huong dien', true)) {
    return { simId: 'ac_rlc_circuit', reason: 'Mạch RLC xoay chiều & giản đồ pha' };
  }
  if (has('chinh luu', true) || has('op-amp', true) || has('logic', true)) {
    return { simId: 'diode_rectifier', reason: 'Chỉnh lưu & linh kiện bán dẫn' };
  }
  if (has('may bien ap', true) || has('truyen tai dien', true)) {
    return { simId: 'transformer_2d', reason: 'Máy biến áp & truyền tải điện năng' };
  }
  if (has('lorentz', true) || has('cyclotron', true)) {
    return { simId: 'cyclotron_accelerator', reason: 'Chuyển động hạt mang điện trong từ trường' };
  }
  if (has('luc tu', true) || has('ban tay trai', true) || has('cam ung tu', true)) {
    return { simId: 'hall_effect', reason: 'Lực từ lên dòng điện & hiệu ứng từ' };
  }
  if (has('tu thong', true) || has('faraday', true) || has('lenz', true) || has('cam ung dien tu', true) || has('xoay chieu', true) || has('thanh kim loai', true) || has('foucault', true)) {
    return { simId: 'magnetic_induction', reason: 'Cảm ứng điện từ Faraday & quy tắc Lenz' };
  }
  if (has('ohm', true) || has('cuong do dong dien', true) || has('suat dien dong', true) || has('u theo i', true)) {
    return { simId: 'ohm_circuit', reason: 'Định luật Ohm & sơ đồ mạch điện' };
  }

  // 5. Optics, Quantum & Nuclear
  if (has('khuc xa', true) || has('phan xa toan phan', true)) {
    return { simId: has('toan phan', true) ? 'fiber_optic_tir' : 'light_refraction', reason: 'Khúc xạ ánh sáng & phản xạ toàn phần' };
  }
  if (has('tan sac', true) || has('lang kinh', true)) {
    return { simId: 'prism_dispersion', reason: 'Tán sắc ánh sáng qua lăng kính' };
  }
  if (has('guong', true)) {
    return { simId: 'spherical_mirror', reason: 'Tạo ảnh qua gương cầu' };
  }
  if (has('thau kinh', true) || has('kinh lup', true) || has('kinh hien vi', true) || has('kinh thien van', true)) {
    return { simId: has('thien van', true) || has('hien vi', true) ? 'telescope_microscope' : 'lens_optics', reason: 'Vẽ tia sáng & tạo ảnh qua thấu kính' };
  }
  if (has('bohr', true) || has('quang pho', true) || has('hydro', true) || has('vung nang luong', true)) {
    return { simId: 'bohr_energy_levels', reason: 'Mẫu nguyên tử Bohr & chuyển mức năng lượng' };
  }
  if (has('quang dien', true) || has('luong tu anh sang', true) || has('tia x', true)) {
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
