import { MONUMENT_CATALOG, MonumentDefinition } from '../components/synapsev2/synapseCatalog';
import { BackgroundStyle } from '../context/BackgroundContext';
import { VoiceOSActionPlan, VoiceOSClarifyOption } from '../types';

export function normalizeVoiceText(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\p{L}\p{N}\s+./-]/gu, ' ')
    // Common Vietnamese/English voice STT phonetic corrections
    .replace(/\bvat ly\b/g, 'vat li')
    .replace(/\bhoa hoc\b/g, 'hoa hoc')
    .replace(/\bsinh hoc\b/g, 'sinh hoc')
    .replace(/\ba de en\b/g, 'dna')
    .replace(/\bdai son\b/g, 'dyson')
    .replace(/\bto ca mac\b/g, 'tokamak')
    .replace(/\btet xo rac\b/g, 'tesseract')
    .replace(/\bli go\b/g, 'ligo')
    .replace(/\bo ich y zet\b/g, 'oxyz')
    .replace(/\b3 de\b/g, '3d')
    .replace(/\b2 de\b/g, '2d')
    .replace(/\bpo mo do ro\b/g, 'pomodoro')
    .replace(/\bbo mo do ro\b/g, 'pomodoro')
    .replace(/\bchi la ni\b/g, 'chladni')
    .replace(/\bchat ni\b/g, 'chladni')
    .replace(/\s+/g, ' ')
    .trim();
}

function getBigrams(str: string): Set<string> {
  const clean = str.replace(/\s+/g, '');
  const set = new Set<string>();
  for (let i = 0; i < clean.length - 1; i++) {
    set.add(clean.slice(i, i + 2));
  }
  return set;
}

export function diceSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const minLen = Math.min(a.length, b.length);
  const maxLen = Math.max(a.length, b.length);
  if (minLen >= 4 && minLen / maxLen >= 0.65 && (a.includes(b) || b.includes(a))) {
    return 0.88;
  }
  const ba = getBigrams(a);
  const bb = getBigrams(b);
  if (ba.size === 0 || bb.size === 0) return 0;
  let intersect = 0;
  ba.forEach((g) => {
    if (bb.has(g)) intersect++;
  });
  return (2 * intersect) / (ba.size + bb.size);
}

export function fuzzyPhraseScore(inputNorm: string, candidates: string[]): number {
  const inputTokens = inputNorm.split(' ').filter((t) => t.length >= 2);
  if (inputTokens.length === 0) return 0;
  let best = 0;
  for (const rawCand of candidates) {
    const cand = normalizeVoiceText(rawCand);
    if (!cand) continue;
    if (inputNorm === cand) {
      return 1;
    }
    const candTokens = cand.split(' ').filter((t) => t.length >= 2);
    if (candTokens.length === 0) continue;

    if (inputNorm.includes(cand) && cand.length >= 5) {
      const lenRatio = cand.length / Math.max(1, inputNorm.length);
      best = Math.max(best, lenRatio >= 0.45 ? 0.94 : 0.82);
      continue;
    }
    if (cand.includes(inputNorm) && inputNorm.length >= 5) {
      const lenRatio = inputNorm.length / Math.max(1, cand.length);
      if (lenRatio >= 0.55) {
        best = Math.max(best, 0.84);
        continue;
      }
    }

    let tokenHits = 0;
    for (const ct of candTokens) {
      if (
        inputTokens.some(
          (it) => it === ct || (Math.min(it.length, ct.length) >= 4 && diceSimilarity(it, ct) >= 0.78)
        )
      ) {
        tokenHits += 1;
      }
    }
    if (tokenHits === 0) continue;
    const recall = tokenHits / candTokens.length;
    const precision = tokenHits / inputTokens.length;
    const tokenScore = recall * 0.68 + precision * 0.32;
    const dice = diceSimilarity(inputNorm, cand);
    let combined = Math.max(tokenScore * 0.95, dice * 0.9);
    if (inputTokens.length === 1 && candTokens.length >= 2) {
      combined = Math.min(combined, 0.57);
    }
    if (combined > best) best = combined;
  }
  return best;
}

export interface WonderStageVoiceCommand {
  kind:
    | 'select_monument'
    | 'next_monument'
    | 'prev_monument'
    | 'camera'
    | 'music_toggle'
    | 'music_track'
    | 'pause'
    | 'play'
    | 'explode'
    | 'reset'
    | 'low_spec'
    | 'high_spec'
    | 'back_catalog';
  monument?: MonumentDefinition;
  cameraPreset?: 'orbit' | 'overview' | 'core' | 'top' | 'side' | 'low';
  musicTrack?: 'minecraft_calm' | 'cosmic_drone';
  explodeValue?: number;
  replyVi: string;
  replyEn: string;
}

export function matchWonderStageCommand(rawText: string): WonderStageVoiceCommand | null {
  const cmd = normalizeVoiceText(rawText);
  if (!cmd) return null;

  // Numbered monument: "cong trinh so 12", "mo so 5", "bai 19"
  const numMatch = cmd.match(/(?:cong trinh|mo hinh|dai cong trinh|so|muc)\s*#?\s*(\d{1,2})\b/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10);
    const found = MONUMENT_CATALOG.find((m) => m.index === idx);
    if (found) {
      return {
        kind: 'select_monument',
        monument: found,
        replyVi: `Đang chuyển sang Đại công trình #${found.index}: ${found.titleVi}.`,
        replyEn: `Switching to Megastructure #${found.index}: ${found.titleEn}.`
      };
    }
  }

  if (/(tiep theo|cong trinh sau|ke tiep|next)/.test(cmd) && /(cong trinh|mo hinh|cai|chuyen|sang)/.test(cmd)) {
    return {
      kind: 'next_monument',
      replyVi: 'Đã chuyển sang đại công trình tiếp theo.',
      replyEn: 'Switched to the next megastructure.'
    };
  }
  if (/(quay lai cong trinh truoc|cong trinh truoc|prev|lui lai)/.test(cmd)) {
    return {
      kind: 'prev_monument',
      replyVi: 'Đã quay lại đại công trình trước.',
      replyEn: 'Returned to the previous megastructure.'
    };
  }
  if (/(danh sach|quay lai 30|ve danh sach|thoat mo hinh|catalog)/.test(cmd)) {
    return {
      kind: 'back_catalog',
      replyVi: 'Đang quay lại danh sách 30 Đại công trình.',
      replyEn: 'Returning to the 30 Megastructures catalog.'
    };
  }

  // Camera presets
  if (fuzzyPhraseScore(cmd, ['can loi', 'phong to loi', 'vao trong loi', 'zoom in', 'gan lai']) >= 0.65) {
    return { kind: 'camera', cameraPreset: 'core', replyVi: 'Đã đưa góc máy Cận lõi 3D.', replyEn: 'Camera set to Core Close-up.' };
  }
  if (fuzzyPhraseScore(cmd, ['toan canh', 'nhin xa', 'tong the', 'overview']) >= 0.65) {
    return { kind: 'camera', cameraPreset: 'overview', replyVi: 'Đã mở góc nhìn Toàn cảnh.', replyEn: 'Camera set to Overview.' };
  }
  if (fuzzyPhraseScore(cmd, ['tu dinh', 'nhin tu tren', 'tu tren xuong', 'top view']) >= 0.65) {
    return { kind: 'camera', cameraPreset: 'top', replyVi: 'Đã chuyển góc nhìn Từ đỉnh.', replyEn: 'Camera set to Top-down.' };
  }
  if (fuzzyPhraseScore(cmd, ['mat ngang', 'nhin ngang', 'side view']) >= 0.65) {
    return { kind: 'camera', cameraPreset: 'side', replyVi: 'Đã chuyển góc nhìn Mặt ngang.', replyEn: 'Camera set to Side view.' };
  }
  if (fuzzyPhraseScore(cmd, ['goc nguoc', 'tu duoi len', 'low angle']) >= 0.65) {
    return { kind: 'camera', cameraPreset: 'low', replyVi: 'Đã chuyển Góc ngước lên.', replyEn: 'Camera set to Low angle.' };
  }
  if (fuzzyPhraseScore(cmd, ['quy dao', 'xoay quanh', 'orbit']) >= 0.7) {
    return { kind: 'camera', cameraPreset: 'orbit', replyVi: 'Đã bật góc quay Quỹ đạo.', replyEn: 'Camera set to Orbit.' };
  }

  // Explode / Pause / Play / Music / FPS
  if (/(tach lop|mo bung|cat lop|explode|bung ra|ben trong)/.test(cmd) && !/(la gi|tai sao|cong thuc|hoat dong)/.test(cmd)) {
    return { kind: 'explode', explodeValue: 0.72, replyVi: 'Đã tách lớp cấu trúc để quan sát bên trong.', replyEn: 'Expanded cutaway view.' };
  }
  if (/(dong lai|gop lop|lap lai|thu vao)/.test(cmd)) {
    return { kind: 'explode', explodeValue: 0, replyVi: 'Đã đóng gọn các lớp cấu trúc.', replyEn: 'Collapsed cutaway view.' };
  }
  if (/(tam dung|dung lai|dung quay|pause)/.test(cmd)) {
    return { kind: 'pause', replyVi: 'Đã tạm dừng mô phỏng 3D.', replyEn: 'Paused 3D simulation.' };
  }
  if (/(chay tiep|tiep tuc|bat dau quay|play|resume)/.test(cmd)) {
    return { kind: 'play', replyVi: 'Đã tiếp tục chạy mô phỏng 3D.', replyEn: 'Resumed 3D simulation.' };
  }
  if (/(nhac vu tru|am thanh vu tru|cosmic)/.test(cmd)) {
    return { kind: 'music_track', musicTrack: 'cosmic_drone', replyVi: 'Đã chuyển sang nhạc nền Vũ trụ.', replyEn: 'Switched audio to Cosmic drone.' };
  }
  if (/(nhac minecraft|piano|bat nhac|mo nhac)/.test(cmd)) {
    return { kind: 'music_track', musicTrack: 'minecraft_calm', replyVi: 'Đã bật nhạc nền Minecraft Piano.', replyEn: 'Playing Minecraft Calm Piano.' };
  }
  if (/(tat nhac|tat am|im lang|mute)/.test(cmd)) {
    return { kind: 'music_toggle', replyVi: 'Đã tắt nhạc nền.', replyEn: 'Muted background music.' };
  }
  if (/(may yeu|giam lag|muot hon|30 fps|0.5x)/.test(cmd)) {
    return { kind: 'low_spec', replyVi: 'Đã bật chế độ Máy yếu (0.5x · 30 FPS) siêu mượt.', replyEn: 'Enabled low-spec 0.5x 30 FPS mode.' };
  }
  if (/(net cao|60 fps|sieu net|1x)/.test(cmd)) {
    return { kind: 'high_spec', replyVi: 'Đã nâng độ phân giải 1x · 60 FPS sắc nét.', replyEn: 'Switched to 1x 60 FPS high detail.' };
  }

  // Switch wonder by fuzzy name ONLY when user indicates switching/opening, not asking "là gì"
  const isQuestion = /(la gi|tai sao|vi sao|hoat dong|nguyen li|cong thuc|giai thich|ung dung|y nghia|what|why|how)/.test(cmd);
  if (!isQuestion) {
    let bestWonder: { m: MonumentDefinition; score: number } | null = null;
    for (const m of MONUMENT_CATALOG) {
      const score = fuzzyPhraseScore(cmd, [m.titleVi, m.titleEn, m.id.replace(/_/g, ' '), m.code]);
      if (score >= 0.52 && (!bestWonder || score > bestWonder.score)) {
        bestWonder = { m, score };
      }
    }
    if (bestWonder) {
      return {
        kind: 'select_monument',
        monument: bestWonder.m,
        replyVi: `Đã chuyển sang #${bestWonder.m.index}: ${bestWonder.m.titleVi}.`,
        replyEn: `Switched to #${bestWonder.m.index}: ${bestWonder.m.titleEn}.`
      };
    }
  }

  return null;
}

const MONUMENT_DEEP_FACTS: Record<string, { formula: string; extraVi: string; extraEn: string }> = {
  dyson: {
    formula: 'r_s = \\frac{2GM}{c^2}, \\quad F = \\frac{L}{4\\pi R^2}',
    extraVi: 'Vòng Dyson thu bức xạ từ đĩa bồi tụ xung quanh hố đen Kerr, nơi vật chất bị gia tốc lên gần tốc độ ánh sáng trước chân trời sự kiện.',
    extraEn: 'The Dyson array harvests radiation from the Kerr accretion disk where infalling plasma is accelerated near c.'
  },
  tokamak: {
    formula: '{}^{2}_{1}\\text{H} + {}^{3}_{1}\\text{H} \\rightarrow {}^{4}_{2}\\text{He} + {}^{1}_{0}\\text{n} + 17.6\\text{ MeV}',
    extraVi: 'Các cuộn siêu dẫn hình chữ D tạo từ trường hình xuyến để giam giữ plasma Deuteri–Triti ở 150 triệu độ K mà không chạm thành lò.',
    extraEn: 'D-shaped superconducting coils generate a toroidal magnetic cage confining 150 MK D-T plasma away from reactor walls.'
  },
  tesseract: {
    formula: 'V_4 = a^4, \\quad x\' = x\\cos\\theta - w\\sin\\theta',
    extraVi: 'Tesseract gồm 8 khối lập phương 3D gập vào không gian 4 chiều (trục w), chiếu phối cảnh về không gian 3D khi quay.',
    extraEn: 'A 4D hypercube projects 8 cubes rotating smoothly in the fourth spatial dimension w into 3D space.'
  },
  quantum_cryostat: {
    formula: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1',
    extraVi: 'Tháp làm lạnh pha loãng hạ nhiệt độ xuống ~15 mK để bảo vệ qubit siêu dẫn khỏi nhiễu nhiệt và mất kết hợp lượng tử.',
    extraEn: 'A dilution refrigerator cools superconducting qubits near 15 mK to suppress thermal decoherence.'
  },
  gravitational_ligo: {
    formula: '\\frac{\\Delta L}{L} = h \\sim 10^{-21}',
    extraVi: 'Giao thoa kế Michelson hai nhánh vuông góc dài 4 km phát hiện sự co giãn không-thời gian nhỏ hơn kích thước hạt proton.',
    extraEn: 'Dual 4 km orthogonal laser arms detect spacetime strain smaller than a proton width via optical interference.'
  },
  blockchain_zk_lattice: {
    formula: 'y^2 \\equiv x^3 + ax + b \\pmod p',
    extraVi: 'Mỗi nút trong cây Merkle băm cặp dữ liệu con lên nút gốc (Root Hash), kết hợp mật mã đường cong Elliptic để chứng minh Zero-Knowledge.',
    extraEn: 'Merkle hash trees pair child hashes up to a single root, while Elliptic Curves enable zero-knowledge verification.'
  }
};

const GENERAL_STEM_QA: { keywords: string[]; replyVi: string; replyEn: string; formula: string }[] = [
  {
    keywords: ['khuc xa', 'snell', 'quang hoc', 'tia sang', 'phan xa toan phan', 'thau kinh', 'lang kinh'],
    replyVi: 'Khi ánh sáng truyền qua mặt phân cách hai môi trường có chiết suất n1 và n2, tia sáng bị bẻ gãy theo định luật khúc xạ Snell. Nếu truyền từ môi trường chiết quang hơn sang kém chiết quang hơn với góc tới vượt góc giới hạn i_gh, hiện tượng phản xạ toàn phần sẽ xảy ra.',
    replyEn: 'Light bends across a refractive index boundary according to Snell’s law. Total internal reflection occurs when n1 > n2 and the incidence angle exceeds the critical angle.',
    formula: 'n_1 \\sin i = n_2 \\sin r, \\quad \\sin i_{\\text{gh}} = \\frac{n_2}{n_1}'
  },
  {
    keywords: ['chladni', 'song dung', 'ban cat', 'am thanh', 'tan so', 'cong huong'],
    replyVi: 'Trên bản kim loại rung theo tần số riêng, sóng tới và sóng phản xạ giao thoa thành sóng dừng. Các hạt cát bị đẩy ra khỏi bụng sóng (dao động mạnh) và tụ lại dọc theo các đường nút (đứng yên), tạo hoa văn Chladni.',
    replyEn: 'Standing acoustic waves push sand grains away from vibrating antinodes so they settle cleanly along stationary nodal lines.',
    formula: '\\cos(n\\pi x)\\cos(m\\pi y) - \\cos(m\\pi x)\\cos(n\\pi y) = 0'
  },
  {
    keywords: ['con lac', 'dao dong dieu hoa', 'lo xo', 'chu ki', 'tan so goc'],
    replyVi: 'Dao động điều hòa có li độ biến thiên theo hàm cos hoặc sin theo thời gian. Lực kéo về luôn hướng về vị trí cân bằng và tỉ lệ với li độ.',
    replyEn: 'Simple harmonic motion has sinusoidal displacement with restoring force proportional to displacement.',
    formula: 'x = A\\cos(\\omega t + \\varphi), \\quad T = 2\\pi\\sqrt{\\frac{m}{k}}'
  },
  {
    keywords: ['nem xien', 'quy dao', 'parabol', 'tam xa', 'gia toc trong truong'],
    replyVi: 'Chuyển động ném xiên là tổng hợp của chuyển động thẳng đều theo phương ngang và chuyển động rơi tự do theo phương thẳng đứng. Tầm xa đạt cực đại ở góc ném 45 độ khi bỏ qua sức cản.',
    replyEn: 'Projectile motion combines uniform horizontal velocity with vertical gravitational acceleration, reaching maximum range at 45 degrees.',
    formula: 'L = \\frac{v_0^2 \\sin(2\\alpha)}{g}, \\quad H_{\\max} = \\frac{(v_0\\sin\\alpha)^2}{2g}'
  },
  {
    keywords: ['lorentz', 'tu truong', 'dien tu', 'cam ung', 'faraday', 'dong dien'],
    replyVi: 'Hạt mang điện chuyển động trong từ trường đều chịu lực Lorentz luôn vuông góc với vận tốc và cảm ứng từ, làm quỹ đạo uốn thành hình tròn hoặc đường xoắn ốc.',
    replyEn: 'Charged particles moving in a magnetic field experience the Lorentz force perpendicular to velocity, curving paths into circles or helices.',
    formula: '\\vec{F} = q(\\vec{v} \\times \\vec{B}), \\quad R = \\frac{mv}{|q|B}'
  },
  {
    keywords: ['tich phan', 'dao ham', 'ham so', 'cuc tri', 'do thi'],
    replyVi: 'Đạo hàm biểu diễn tốc độ biến thiên tức thời và hệ số góc tiếp tuyến đồ thị. Tích phân xác định biểu diễn diện tích hình phẳng giới hạn bởi đường cong f(x) và trục hoành.',
    replyEn: 'Derivatives measure instantaneous slope, while definite integrals compute the signed area bounded by f(x) and the x-axis.',
    formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)'
  },
  {
    keywords: ['oxyz', 'vecto', 'mat phang', 'mat cau', 'khoang cach', 'hinh hoc'],
    replyVi: 'Trong không gian Oxyz, vectơ pháp tuyến giúp xác định phương trình mặt phẳng, tích có hướng tìm vectơ vuông góc chung, và khoảng cách từ tâm mặt cầu đến mặt phẳng quyết định giao tuyến đường tròn.',
    replyEn: 'In 3D Oxyz coordinates, normal vectors define planes, cross products yield perpendicular axes, and sphere-plane distance governs circular intersections.',
    formula: 'Ax + By + Cz + D = 0, \\quad d(I, (P)) = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}'
  },
  {
    keywords: ['mang no ron', 'neural', 'backprop', 'lan truyen nguoc', 'mach logic', 'adder', 'cong logic'],
    replyVi: 'Mạng nơ-ron học bằng cách tính hàm mất mát và cập nhật trọng số ngược từ lớp ra về lớp vào (Gradient Descent). Còn mạch cộng 4-bit trong CPU kết hợp các cổng XOR và AND để tính tổng nhị phân và bit nhớ.',
    replyEn: 'Neural networks learn via backpropagation gradient descent, while a 4-bit CPU adder chains XOR and AND gates for binary sum and carry.',
    formula: 'w \\leftarrow w - \\eta \\frac{\\partial L}{\\partial w}, \\quad S = A \\oplus B \\oplus C_{\\text{in}}'
  },
  {
    keywords: ['chuan do', 'axit bazo', 'ph', 'pin dien hoa', 'enthalpy', 'can bang hoa hoc', 'le chatelier'],
    replyVi: 'Trong Hóa học, pH = -log[H+] đo độ acid hoặc base của dung dịch; còn sức điện động chuẩn của pin điện hóa bằng E°(cathode) - E°(anode) > 0 giúp phản ứng oxi hóa–khử sinh dòng điện tự phát.',
    replyEn: 'In Chemistry, pH = -log[H+] measures acidity, while standard galvanic cell potential E°_cell = E°(cathode) - E°(anode) drives spontaneous electron flow.',
    formula: '\\text{pH} = -\\log[\\text{H}^+], \\quad E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}'
  },
  {
    keywords: ['adn', 'dna', 'crispr', 'te bao', 'nguyen phan', 'giam phan', 'hardy weinberg', 'nhan doi'],
    replyVi: 'Phân tử DNA cấu trúc xoắn kép với 2 mạch bổ sung (A-T, G-C) có chiều dài L = (N/2) × 3,4 Å; còn phương trình Hardy–Weinberg p² + 2pq + q² = 1 mô tả trạng thái cân bằng di truyền của quần thể ngẫu phối.',
    replyEn: 'Double-helix DNA pairs A-T and G-C across two antiparallel strands, while p² + 2pq + q² = 1 governs Hardy–Weinberg population equilibrium.',
    formula: 'L = \\frac{N}{2} \\cdot 3{,}4\\text{ \\AA}, \\quad p^2 + 2pq + q^2 = 1'
  }
];

export function buildLocalVoiceMentorAnswer(ctx: {
  question: string;
  modelTitle: string;
  partName?: string;
  partDescription?: string;
  formula?: string;
  language?: 'vi' | 'en';
}): {
  spokenAnswer: string;
  formulaHighlight: string;
  suggestedFollowUps: string[];
} {
  const isEn = ctx.language === 'en';
  const qNorm = normalizeVoiceText(ctx.question);

  // Try matching active monument in catalog
  const activeWonder = MONUMENT_CATALOG.find(
    (m) =>
      normalizeVoiceText(m.titleVi) === normalizeVoiceText(ctx.modelTitle) ||
      normalizeVoiceText(m.titleEn) === normalizeVoiceText(ctx.modelTitle) ||
      (ctx.partName && normalizeVoiceText(m.code) === normalizeVoiceText(ctx.partName))
  );
  const deep = activeWonder ? MONUMENT_DEEP_FACTS[activeWonder.id] : undefined;

  // 1) Check general STEM topic match in question first
  let bestStem: (typeof GENERAL_STEM_QA)[number] | null = null;
  let bestStemScore = 0;
  for (const item of GENERAL_STEM_QA) {
    const sc = fuzzyPhraseScore(qNorm, item.keywords);
    if (sc > bestStemScore) {
      bestStemScore = sc;
      bestStem = item;
    }
  }
  if (bestStem && bestStemScore >= 0.55) {
    return {
      spokenAnswer: isEn ? bestStem.replyEn : bestStem.replyVi,
      formulaHighlight: bestStem.formula,
      suggestedFollowUps: isEn
        ? ['How does this apply to this 3D model?', 'Show a practical real-world example']
        : ['Áp dụng vào mô hình 3D này thế nào?', 'Cho ví dụ thực tế dễ hiểu hơn']
    };
  }

  // 2) Contextual monument response (always informative for ANY question about the wonder!)
  if (activeWonder) {
    const desc = isEn ? activeWonder.descriptionEn : activeWonder.descriptionVi;
    const sub = isEn ? activeWonder.subtitleEn : activeWonder.subtitleVi;
    const paramText = isEn
      ? `You can adjust ${activeWonder.primaryLabelEn} (${activeWonder.primaryRange[0]}–${activeWonder.primaryRange[1]} ${activeWonder.primaryUnit}) and ${activeWonder.secondaryLabelEn} in the bottom console.`
      : `Bạn có thể kéo thanh ${activeWonder.primaryLabelVi} (${activeWonder.primaryRange[0]}–${activeWonder.primaryRange[1]} ${activeWonder.primaryUnit}) và ${activeWonder.secondaryLabelVi} ở bảng điều khiển bên dưới để thấy hệ 3D phản ứng tức thời.`;

    if (/(cong thuc|toan hoc|phuong trinh|formula|equation|tinh)/.test(qNorm)) {
      return {
        spokenAnswer: isEn
          ? `${activeWonder.titleEn} operates under the physical model: ${sub}. ${deep?.extraEn || desc}`
          : `${activeWonder.titleVi} vận hành theo nguyên lí: ${sub}. ${deep?.extraVi || desc}`,
        formulaHighlight: deep?.formula || ctx.formula || `${activeWonder.primaryLabelVi} \\in [${activeWonder.primaryRange[0]}, ${activeWonder.primaryRange[1]}]\\text{ ${activeWonder.primaryUnit}}`,
        suggestedFollowUps: isEn
          ? ['Cutaway view of the core', 'What are real-world applications?']
          : ['Tách lớp xem lõi bên trong', 'Ứng dụng thực tế của công trình này?']
      };
    }

    if (/(thong so|dieu chinh|cach dung|thao tac|tang|giam|tach|control|slider)/.test(qNorm)) {
      return {
        spokenAnswer: `${paramText} ${isEn ? 'You can also say "core close-up", "explode view", or "play Minecraft piano".' : 'Bạn cũng có thể ra lệnh trực tiếp như "cận lõi", "tách lớp", hoặc "bật nhạc Minecraft".'}`,
        formulaHighlight: ctx.formula || deep?.formula || '',
        suggestedFollowUps: isEn
          ? ['Switch to core close-up', 'Explain how this architecture works']
          : ['Chuyển góc máy cận lõi', 'Giải thích nguyên lí hoạt động']
      };
    }

    return {
      spokenAnswer: isEn
        ? `${activeWonder.titleEn}: ${desc} ${deep?.extraEn || ''} ${paramText}`
        : `${activeWonder.titleVi}: ${desc} ${deep?.extraVi || ''}`,
      formulaHighlight: deep?.formula || ctx.formula || '',
      suggestedFollowUps: isEn
        ? ['Explain the governing formula', 'How do I adjust the sliders?', 'Switch to next megastructure']
        : ['Công thức vật lí cốt lõi là gì?', 'Cách chỉnh thông số tối ưu?', 'Chuyển sang công trình tiếp theo']
    };
  }

  // 3) Fallback generic answer using passed metadata
  return {
    spokenAnswer: isEn
      ? `${ctx.modelTitle}: ${ctx.partDescription || 'Rotate, zoom, or adjust live sliders to inspect how geometry and physical parameters interact.'}`
      : `${ctx.modelTitle}: ${ctx.partDescription || 'Hãy xoay, phóng to hoặc kéo các thanh thông số để quan sát trực tiếp sự thay đổi động lực học và cấu trúc 3D của hệ.'}`,
    formulaHighlight: ctx.formula || '',
    suggestedFollowUps: isEn
      ? ['Explain the physics law', 'Show the key formula']
      : ['Giải thích nguyên lí chính', 'Công thức liên quan là gì?']
  };
}

interface FuzzyRouteTarget {
  phrases: string[];
  minScore?: number;
  plan: VoiceOSActionPlan;
}

const FUZZY_VOICE_OS_TARGETS: FuzzyRouteTarget[] = [
  {
    phrases: ['nen toi', 'che do toi', 'dark mode', 'ban dem', 'tat den', 'toi mau'],
    plan: { replyVi: 'Đã chuyển sang giao diện Nền tối.', actionType: 'toggle_theme', darkMode: true }
  },
  {
    phrases: ['nen sang', 'che do sang', 'light mode', 'ban ngay', 'bat den', 'sang mau'],
    plan: { replyVi: 'Đã chuyển sang giao diện Nền sáng.', actionType: 'toggle_theme', darkMode: false }
  },
  {
    phrases: ['bat pomodoro', 'bat dong ho', 'tap trung', 'dem nguoc', 'pomodoro', 'start timer'],
    plan: { replyVi: 'Đã bật đồng hồ tập trung Pomodoro!', actionType: 'timer', timerAction: 'start' }
  },
  {
    phrases: ['dung pomodoro', 'tam dung dong ho', 'pause timer', 'tat dong ho'],
    plan: { replyVi: 'Đã tạm dừng đồng hồ Pomodoro.', actionType: 'timer', timerAction: 'pause' }
  },
  {
    phrases: ['dat lai pomodoro', 'reset dong ho', 'lam lai dong ho'],
    plan: { replyVi: 'Đã đặt lại đồng hồ Pomodoro.', actionType: 'timer', timerAction: 'reset' }
  },
  {
    phrases: ['mo phong toan', 've toan', 'do thi toan', 'hinh hoc toan', 've hinh', 'do thi ham so', 'toan 2d', 'oxyz', 'toan 3d', 'grapher', 'geometry'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở trang Mô phỏng & Vẽ Toán 2D/3D.',
      actionType: 'navigate_math_sim',
      targetSubject: 'math_sims',
      targetMathTab: 'grapher'
    }
  },
  {
    phrases: ['ve hinh hoc', 'compa', 'thuoc ke', 'hinh hoc phang', 'geometry studio'],
    minScore: 0.52,
    plan: {
      replyVi: 'Đang mở xưởng Vẽ Hình học 2D.',
      actionType: 'navigate_math_sim',
      targetSubject: 'math_sims',
      targetMathTab: 'geometry'
    }
  },
  {
    phrases: ['khong gian oxyz', 'hinh khong gian', 'toan 3d oxyz', 'mat cau', 'hinh chop'],
    minScore: 0.52,
    plan: {
      replyVi: 'Đang mở không gian Toán 3D Oxyz.',
      actionType: 'navigate_math_sim',
      targetSubject: 'math_sims',
      targetMathTab: 'math3d'
    }
  },
  {
    phrases: ['mo phong vat li', 'mo phong li', 'quang hoc', 'raytracing', 'chladni', 'ban cat', 'thi nghiem vat li', 'linh vuc vat li', 'physics sim'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở trang Mô phỏng Vật lí 2D/3D (kèm Quang học Raytracing & Bản cát Chladni).',
      actionType: 'navigate',
      targetSubject: 'physics_sims'
    }
  },
  {
    phrases: ['mo phong hoa', 'mo phong hoa hoc', 'hoa 2d', 'hoa 3d', 'sandbox hoa', 'thi nghiem hoa', 'chuan do hoa', 'chemistry sim'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Kho Mô phỏng & Sandbox Hóa học 2D/3D.',
      actionType: 'navigate',
      targetSubject: 'chemistry_sims'
    }
  },
  {
    phrases: ['mo phong sinh', 'mo phong sinh hoc', 'sinh 2d', 'sinh 3d', 'sandbox sinh', 'thi nghiem sinh', 'biology sim'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Kho Mô phỏng & Sandbox Sinh học 2D/3D.',
      actionType: 'navigate',
      targetSubject: 'biology_sims'
    }
  },
  {
    phrases: ['mo phong code', 'mo phong tin hoc', 'mo phong thuat toan', 'code 2d', 'code 3d', 'mo phong code 3d', 'cs sim'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở phòng Mô phỏng Code & Thuật toán 2D/3D.',
      actionType: 'navigate',
      targetSubject: 'cs_sims'
    }
  },
  {
    phrases: ['mach logic', 'mang no ron', 'neural net', 'bo cong 4 bit', 'flip flop', 'silicon'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở phòng Lab Mạch Logic 4-bit & Mạng Nơ-ron Sống.',
      actionType: 'navigate_future',
      targetFutureTab: 'silicon_neural'
    }
  },
  {
    phrases: ['vu tru tri thuc', 'galaxy twin', 'ban sao 3d', 'ngan ha tri thuc'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Vũ trụ Tri thức 3D.',
      actionType: 'navigate_future',
      targetFutureTab: 'galaxy3d'
    }
  },
  {
    phrases: ['sinh mo phong ai', 'text to sim', 'tao mo phong', 'y tuong mo phong'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở trình Sinh Mô Phỏng AI.',
      actionType: 'navigate_future',
      targetFutureTab: 'text_to_sim'
    }
  },
  {
    phrases: ['giay nhap', 'paper to sim', 'quet giay nhap', 'chup bai tap', 'camera giai bai'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở máy quét Giấy Nháp → Mô phỏng.',
      actionType: 'navigate_future',
      targetFutureTab: 'paper_to_sim'
    }
  },
  {
    phrases: ['song am fft', 'pho am thanh', 'micro 3d', 'audio fft'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Phòng Lab Sóng Âm FFT 3D.',
      actionType: 'navigate_future',
      targetFutureTab: 'audio_fft'
    }
  },
  {
    phrases: ['bang vo cuc', 'bang nhap mini', 'scratchpad', 'giay ve nhanh'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Bảng Nháp Mini.',
      actionType: 'navigate_future',
      targetFutureTab: 'infinite_canvas'
    }
  },
  {
    phrases: ['synapse pre', 'dai cong trinh', '30 cong trinh', 'cong trinh tuong lai', 'phong lab tuong lai'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Synapse Pre · 30 Đại Công Trình Tương Lai 3D.',
      actionType: 'navigate_future',
      targetFutureTab: 'megastructures'
    }
  },
  {
    phrases: ['cam giac 3d', 'webar', 'ban tay 3d', 'ar camera', '10 ngon tay'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Học cảm giác 3D & WebAR.',
      actionType: 'navigate',
      targetSubject: 'spatial_3d'
    }
  },
  {
    phrases: ['bai giang toan', 'mon toan', 'hoc toan', 'chuong trinh toan'],
    minScore: 0.5,
    plan: {
      replyVi: 'Đang mở Kho Bài giảng Toán học.',
      actionType: 'navigate',
      targetSubject: 'math'
    }
  },
  {
    phrases: ['bai giang vat li', 'mon vat li', 'hoc vat li', 'chuong trinh vat li', 'phong lab vat li'],
    minScore: 0.5,
    plan: {
      replyVi: 'Đang mở Phòng Lab & Bài giảng Vật lí.',
      actionType: 'navigate',
      targetSubject: 'physics'
    }
  },
  {
    phrases: ['bai giang hoa', 'mon hoa', 'hoc hoa', 'chuong trinh hoa', 'phong lab hoa', 'hoa hoc'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Phòng Lab & Bài giảng Hóa học.',
      actionType: 'navigate',
      targetSubject: 'chemistry'
    }
  },
  {
    phrases: ['bai giang sinh', 'mon sinh', 'hoc sinh', 'chuong trinh sinh', 'phong lab sinh', 'sinh hoc'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Phòng Lab & Bài giảng Sinh học.',
      actionType: 'navigate',
      targetSubject: 'biology'
    }
  },
  {
    phrases: ['tin hoc', 'lap trinh', 'online judge', 'code c++', 'sublime', 'thuat toan'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Tin học & IDE Code.',
      actionType: 'navigate',
      targetSubject: 'cs'
    }
  },
  {
    phrases: ['de thi', 'kiem tra', 'luyen de', 'thi thu', 'radar tu duy'],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Kho Đề Thi & Radar Tư Duy.',
      actionType: 'navigate',
      targetSubject: 'exams'
    }
  },
  {
    phrases: ['dau truong', 'thi dau', 'bang xep hang', 'bxh', 'arena'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Đấu trường Tuần.',
      actionType: 'navigate',
      targetSubject: 'arena'
    }
  },
  {
    phrases: ['dien dan', 'hoi nhom', 'thao luan', 'forum'],
    minScore: 0.5,
    plan: {
      replyVi: 'Đang mở Diễn đàn học tập.',
      actionType: 'navigate',
      targetSubject: 'forum'
    }
  },
  {
    phrases: ['so tay loi', 'loi sai', 'flashcard', 'sm2', 'sm-2'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Sổ Lỗi Sai & Thẻ SM-2.',
      actionType: 'navigate',
      targetSubject: 'growth_hub'
    }
  },
  {
    phrases: ['thu vien sang tao', 'showcase', 'sang tao tu do'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Thư viện Sáng tạo 2D/3D.',
      actionType: 'navigate',
      targetSubject: 'showcase'
    }
  },
  {
    phrases: ['lo trinh hoc', 'roadmap', 'ban do tri thuc'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Lộ trình học tập thông minh.',
      actionType: 'navigate',
      targetSubject: 'roadmap'
    }
  },
  {
    phrases: ['cam bien dien thoai', 'phone sensor', 'con lac dien thoai', 'qr vat li', 'sensor lab'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Phòng Lab Cảm biến Điện thoại thời gian thực qua QR & WebSocket.',
      actionType: 'navigate_future',
      targetFutureTab: 'phone_sensor_lab'
    }
  },
  {
    phrases: ['hat gpu', 'hai tay hat', 'dual hand', 'truong hat gpu', 'particle sandbox'],
    minScore: 0.48,
    plan: {
      replyVi: 'Đang mở Sandbox Trường Hạt GPU Hai Tay trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'dual_hand_sandbox'
    }
  },
  {
    phrases: ['ban phao', 'phao 3d', 'quy dao dan dao', 'duong bay ban phao', 'artillery', 'cannon'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab Mô Phỏng Quỹ Đạo Bắn Pháo 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'cannon_ballistics_3d'
    }
  },
  {
    phrases: ['ten lua', 'phong ten lua', 'rocket launch', 'quy dao ten lua', 'tach tang'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Mô Phỏng Phóng Tên Lửa Đa Tầng & Quỹ Đạo 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'rocket_launch_3d'
    }
  },
  {
    phrases: ['phan luc', 'dong co phan luc', 'jet engine', 'turbofan', 'tuabin phan luc'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Mô Hình Động Cơ Phản Lực Turbofan 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'jet_engine_3d'
    }
  },
  {
    phrases: ['4d', 'bai giang 4d', 'sieu lap phuong 4d', 'khong thoi gian 4d', 'tesseract 4d'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Bài Giảng Hình Học & Không-Thời Gian 4D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'four_d_lectures'
    }
  },
  {
    phrases: ['canh tay robot', 'robot 6 dof', 'dong hoc nguoc', 'robotics ik'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab Cánh Tay Robot 6-DOF & Động Học Ngược 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'robotics_ik_3d'
    }
  },
  {
    phrases: [
      'lap rap 3d',
      'mo phong lap rap',
      'dong co v4',
      'dong ho tourbillon',
      'hop so hanh tinh',
      'tach lop 3d'
    ],
    minScore: 0.45,
    plan: {
      replyVi: 'Đang mở Xưởng Lắp Ráp Cơ Khí 3D Tương Tác (Động cơ V4, Tourbillon, Drone & Hộp số) trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'assembly_3d'
    }
  },
  {
    phrases: ['phau thuat phan cung', 'mo may 3d', 'teardown', 'sua chua 3d'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab Phẫu Thuật & Sửa Chữa Phần Cứng 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'tech_teardown_3d'
    }
  },
  {
    phrases: ['phan ung hoa hoc 3d', 'lo phan ung hoa 3d', 'can bang nhiet hoa 3d'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab Phản ứng & Nhiệt động Hóa học 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'chem_reaction_3d'
    }
  },
  {
    phrases: ['orbital 3d', 'vsepr 3d', 'phan tu hoa 3d', 'lai hoa orbital'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab Orbital & Hình học Phân tử VSEPR 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'chem_orbital_vsepr_3d'
    }
  },
  {
    phrases: ['te bao 3d', 'atlas te bao', 'bao quan 3d', 'ti the luc lap 3d'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Atlas Tế bào Nhân thực 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'bio_cell_atlas_3d'
    }
  },
  {
    phrases: ['crispr 3d', 'dna 3d', 'chinh sua gen 3d', 'adn 3d'],
    minScore: 0.46,
    plan: {
      replyVi: 'Đang mở Phòng Lab DNA & Chỉnh sửa Gen CRISPR-Cas9 3D trong Synapse Pre.',
      actionType: 'navigate_future',
      targetFutureTab: 'bio_dna_crispr_3d'
    }
  },
  {
    phrases: ['trang chu', 'lop hoc', 'tong quan', 've home'],
    minScore: 0.5,
    plan: {
      replyVi: 'Đang quay về Trang chủ lớp học.',
      actionType: 'navigate',
      targetSubject: 'overview'
    }
  }
];

const BG_TARGETS: { phrases: string[]; style: BackgroundStyle; label: string }[] = [
  { phrases: ['he sinh thai', 'ca koi', 'ecosystem'], style: 'ecosystem', label: 'Hệ sinh thái' },
  { phrases: ['phan tu', 'nguyen tu', 'molecules'], style: 'molecules', label: 'Mạng hạt Phân tử' },
  { phrases: ['dai duong', 'bien sau', 'ocean', 'sua bien'], style: 'ocean', label: 'Đại dương sâu' },
  { phrases: ['bau troi', 'may bay', 'sky'], style: 'sky', label: 'Bầu trời mây' },
  { phrases: ['chom sao', 'thien van', 'constellation'], style: 'constellations', label: 'Chòm sao 3D' },
  { phrases: ['ngan ha', 'vu tru', 'galaxy'], style: 'cosmic_galaxy', label: 'Ngân hà sống động' },
  { phrases: ['ban ve', 'ky thuat', 'blueprint'], style: 'blueprint_tech', label: 'Bản vẽ STEM' },
  { phrases: ['luoi song', 'studio grid'], style: 'studio_grid', label: 'Lưới sóng Studio' },
  { phrases: ['tinh van', 'sao roi', 'aurora'], style: 'aurora_clean', label: 'Tinh vân sao rơi' },
  { phrases: ['sieu muot', 'toi gian', 'minimal'], style: 'minimal_solid', label: 'Nền siêu mượt' },
  { phrases: ['xray', 'x-ray', 'xuyen thau', 'mat na', 'chan dung'], style: 'xray_reveal', label: 'Soi Xuyên Thấu X-Ray' }
];

const VOICE_FILLER_OR_AMBIGUOUS = new Set([
  'alo',
  'a lo',
  'ha',
  'gi',
  'gi vay',
  'gi do',
  'cai gi',
  'oi',
  'u',
  'o',
  'uh',
  'um',
  'ok',
  'okay',
  'test',
  'thu',
  'thu mic',
  'khong ro',
  'chua ro',
  'noi lai',
  'mo',
  'chuyen',
  'vao',
  'xem',
  'cong trinh',
  'dai cong trinh',
  'mo phong',
  'bai giang',
  'linh tinh'
]);

const DEFAULT_CLARIFY_OPTIONS: VoiceOSClarifyOption[] = [
  { label: 'Bài giảng Vật lí', command: 'Mở Bài giảng Vật lí' },
  { label: 'Mô phỏng Toán 3D', command: 'Mở Mô phỏng Toán 3D' },
  { label: 'Danh sách Đại công trình', command: 'Mở Synapse Pre Đại công trình' }
];

export function buildVoiceClarifyPlan(
  rawCmd: string,
  reason: 'low_confidence' | 'noisy' | 'ambiguous' = 'ambiguous',
  options?: VoiceOSClarifyOption[]
): VoiceOSActionPlan {
  const cleanPreview = rawCmd.trim().slice(0, 60);
  const clarifyOptions = options && options.length > 0 ? options.slice(0, 3) : DEFAULT_CLARIFY_OPTIONS;
  if (reason === 'low_confidence') {
    return {
      replyVi: `Mình nghe hơi nhỏ hoặc chưa thật rõ ("${cleanPreview}"). Bạn nói lại gần mic hơn hoặc chọn nhanh mục bên dưới nhé?`,
      actionType: 'clarify',
      confidence: 0.3,
      clarifyOptions
    };
  }
  if (reason === 'noisy') {
    return {
      replyVi: `Mình chưa nhận ra lệnh rõ ràng từ "${cleanPreview}". Bạn muốn mở bài giảng, phòng mô phỏng hay hỏi kiến thức nào?`,
      actionType: 'clarify',
      confidence: 0.25,
      clarifyOptions
    };
  }
  return {
    replyVi: `Mình nghe thành "${cleanPreview}" nhưng chưa chắc bạn muốn mở mục nào — bạn xác nhận giúp mình bên dưới nhé?`,
    actionType: 'clarify',
    confidence: 0.48,
    clarifyOptions
  };
}

/**
 * Clarification-aware command & Q&A matcher:
 * Prevents false-positive jumps to random Megastructures on noisy/short/ambiguous voice input.
 */
export function matchFuzzyVoiceOSCommand(rawCmd: string, sttConfidence = 1): VoiceOSActionPlan | null {
  const cmd = normalizeVoiceText(rawCmd);
  if (!cmd) return null;

  const tokens = cmd.split(' ').filter(Boolean);

  // 0. Reject filler / ultra-short / low-confidence STT noise before routing
  if (
    cmd.length < 3 ||
    VOICE_FILLER_OR_AMBIGUOUS.has(cmd) ||
    (tokens.length === 1 && tokens[0].length <= 3 && !/^(toan|li|ly|code|tin|3d|2d)$/.test(tokens[0]))
  ) {
    return buildVoiceClarifyPlan(rawCmd, 'noisy');
  }

  if (sttConfidence > 0 && sttConfidence < 0.52) {
    return buildVoiceClarifyPlan(rawCmd, 'low_confidence');
  }

  // 1. Check explicit "hỏi / giải thích / là gì / công thức" -> Q&A or Syn Tutor
  const isQuestion = /(giai thich|la gi|tai sao|vi sao|cong thuc|cach tinh|nguyen li|hoat dong nhu the nao|hoi syn|hoi thay|hoi co|dinh luat)/.test(cmd);

  // 2. Check background change intent
  if (/(doi nen|hinh nen|nen dong|background|phong nen)/.test(cmd)) {
    let bestBg: { t: (typeof BG_TARGETS)[number]; score: number } | null = null;
    for (const bg of BG_TARGETS) {
      const sc = fuzzyPhraseScore(cmd, bg.phrases);
      if (sc >= 0.52 && (!bestBg || sc > bestBg.score)) {
        bestBg = { t: bg, score: sc };
      }
    }
    if (bestBg) {
      return {
        replyVi: `Đã đổi nền động sang ${bestBg.t.label}.`,
        actionType: 'set_background',
        bgStyle: bestBg.t.style,
        confidence: bestBg.score
      };
    }
  }

  // 3. Explicit numbered jump to any of the 30 Megastructures ("công trình số 2", "kỳ quan 12")
  if (!isQuestion) {
    const numMatch = cmd.match(/(?:cong trinh|dai cong trinh|mo hinh|ky quan)\s*(?:so|#)?\s*(\d{1,2})\b/);
    if (numMatch) {
      const idx = parseInt(numMatch[1], 10);
      const m = MONUMENT_CATALOG.find((item) => item.index === idx);
      if (m) {
        return {
          replyVi: `Đang mở thẳng Đại công trình #${m.index}: ${m.titleVi}.`,
          actionType: 'navigate_monument',
          targetMonumentId: m.id,
          confidence: 0.95
        };
      }
    }
  }

  // 4. Score BOTH routes and megastructures side-by-side so megastructures never steal unclear input
  const routeMatches: { item: FuzzyRouteTarget; score: number }[] = [];
  if (!isQuestion || /(mo|vao|chuyen|xem|bat|tat)/.test(cmd)) {
    for (const item of FUZZY_VOICE_OS_TARGETS) {
      const sc = fuzzyPhraseScore(cmd, item.phrases);
      const minRequired = Math.max(0.56, item.minScore ?? 0.56);
      if (sc >= minRequired) {
        routeMatches.push({ item, score: sc });
      }
    }
    routeMatches.sort((a, b) => b.score - a.score);
  }

  const wonderMatches: { m: MonumentDefinition; score: number }[] = [];
  if (!isQuestion) {
    for (const m of MONUMENT_CATALOG) {
      // Only match monument name against meaningful tokens (require >= 2 tokens or long distinctive name)
      const sc = fuzzyPhraseScore(cmd, [m.titleVi, m.titleEn, m.id.replace(/_/g, ' ')]);
      if (sc >= 0.55) {
        wonderMatches.push({ m, score: sc });
      }
    }
    wonderMatches.sort((a, b) => b.score - a.score);
  }

  const topRoute = routeMatches[0];
  const topWonder = wonderMatches[0];
  const secondWonder = wonderMatches[1];

  // Require high clarity for direct Megastructure teleport (prevents random jumping!)
  const wonderStrongEnough =
    topWonder &&
    topWonder.score >= 0.74 &&
    (tokens.length >= 2 || topWonder.score >= 0.86) &&
    (!secondWonder || topWonder.score - secondWonder.score >= 0.08 || topWonder.score >= 0.88);

  if (wonderStrongEnough && (!topRoute || topWonder.score >= topRoute.score + 0.04)) {
    return {
      replyVi: `Đang khởi chạy Đại công trình #${topWonder.m.index}: ${topWonder.m.titleVi}.`,
      actionType: 'navigate_monument',
      targetMonumentId: topWonder.m.id,
      confidence: topWonder.score
    };
  }

  if (topRoute && topRoute.score >= 0.6) {
    return { ...topRoute.item.plan, confidence: topRoute.score };
  }

  // If we only had weak/ambiguous wonder or route candidates, ask for clarification instead of teleporting!
  if ((topWonder && topWonder.score >= 0.55) || (topRoute && topRoute.score >= 0.56)) {
    const clarifyOpts: VoiceOSClarifyOption[] = [];
    if (topRoute) {
      clarifyOpts.push({
        label: topRoute.item.phrases[0],
        command: topRoute.item.phrases[0]
      });
    }
    for (const wm of wonderMatches.slice(0, 2)) {
      clarifyOpts.push({
        label: `Công trình #${wm.m.index}: ${wm.m.titleVi}`,
        command: `Mở Đại công trình số ${wm.m.index}`
      });
    }
    return buildVoiceClarifyPlan(rawCmd, 'ambiguous', clarifyOpts);
  }

  // 5. Instant Local STEM Q&A (only when phrased as a question or >=2 meaningful tokens)
  let bestStem: (typeof GENERAL_STEM_QA)[number] | null = null;
  let bestStemScore = 0;
  if (isQuestion || tokens.length >= 2) {
    for (const item of GENERAL_STEM_QA) {
      const sc = fuzzyPhraseScore(cmd, item.keywords);
      if (sc > bestStemScore) {
        bestStemScore = sc;
        bestStem = item;
      }
    }
  }
  if (bestStem && bestStemScore >= 0.62) {
    return {
      replyVi: bestStem.replyVi,
      actionType: 'answer_qa',
      formulaHighlight: bestStem.formula,
      confidence: bestStemScore
    };
  }

  // 6. Explicit "hỏi Syn AI / gia sư" opens Tutor directly
  if (/(hoi syn|gia su|giai bai|chi cach lam|tu van)/.test(cmd)) {
    const subj: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs' = /(code|tin|thuat toan|c\+\+|python)/.test(cmd)
      ? 'cs'
      : /(hoa|mol|axit|bazo|este|polime|dien phan|oxi hoa)/.test(cmd)
      ? 'chemistry'
      : /(sinh|adn|dna|te bao|gen|menden|di truyen|quang hop)/.test(cmd)
      ? 'biology'
      : /(li|ly|quang|dien|song|nhiet|co hoc)/.test(cmd)
      ? 'physics'
      : 'math';
    const labelMap = {
      math: 'Toán học',
      physics: 'Vật lí',
      chemistry: 'Hóa học',
      biology: 'Sinh học',
      cs: 'Tin học'
    } as const;
    return {
      replyVi: `Đang mở Gia sư Syn AI (${labelMap[subj]}) để giải đáp câu hỏi của bạn.`,
      actionType: 'open_tutor',
      tutorSubject: subj,
      tutorQuestion: rawCmd,
      confidence: 0.78
    };
  }

  if (tokens.length === 1 && !isQuestion) {
    return buildVoiceClarifyPlan(rawCmd, 'ambiguous');
  }

  return null;
}
