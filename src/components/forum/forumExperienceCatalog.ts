import {
  ForumExperienceAttachment,
  ForumExperienceKind,
  ForumExperienceSubject,
  MathLecture
} from '../../types';
import type { NavLocation } from '../../context/NavigationContext';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CHEMISTRY_LESSONS } from '../../data/chemistryLessonsData';
import { BIOLOGY_LESSONS } from '../../data/biologyLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';
import {
  PHYSICS_2D_SIMS,
  PHYSICS_3D_SIMS,
  getDomainFor2DSim,
  getDomainFor3DSim
} from '../../data/physicsDomainsData';
import {
  CHEMISTRY_2D_SIMS,
  CHEMISTRY_3D_SIMS
} from '../../data/chemistryDomainsData';
import {
  BIOLOGY_2D_SIMS,
  BIOLOGY_3D_SIMS
} from '../../data/biologyDomainsData';
import { ALGO_CATALOG } from '../cs/visualizer/types';
import { PRE_STUDIOS } from '../../data/preLabsData';

export interface ExperienceCatalogItem {
  key: string;
  kind: ForumExperienceKind;
  subject: ForumExperienceSubject;
  targetId: string;
  domainId?: string;
  title: string;
  subtitle: string;
  formula?: string;
  gradeLabel?: string;
  keywords: string;
}

const MATH_3D_CATALOG: Array<{
  id: NonNullable<MathLecture['sim3dMode']>;
  title: string;
  subtitle: string;
  formula: string;
  gradeLabel: string;
}> = [
  {
    id: 'oxyz_vector',
    title: 'Hệ trục Tọa độ Oxyz & Vectơ Không gian 3D',
    subtitle: 'Biểu diễn trực quan phép cộng, tích có hướng và góc giữa 2 vectơ trong Oxyz',
    formula: '\\vec{u} \\times \\vec{v} = (u_y v_z - u_z v_y;\\; u_z v_x - u_x v_z;\\; u_x v_y - u_y v_x)',
    gradeLabel: 'Lớp 12'
  },
  {
    id: 'sphere_plane',
    title: 'Mặt cầu (S) & Mặt phẳng Cắt (P) trong Oxyz 3D',
    subtitle: 'Khảo sát khoảng cách d(I, (P)) và bán kính đường tròn giao tuyến r = √(R² - d²)',
    formula: 'r^2 = R^2 - d(I,(P))^2',
    gradeLabel: 'Lớp 12'
  },
  {
    id: 'line_plane_oxyz',
    title: 'Đường thẳng & Mặt phẳng Oxyz 3D',
    subtitle: 'Góc giữa đường thẳng với mặt phẳng và điểm giao trực quan',
    formula: '\\sin\\alpha = |\\cos(\\vec{u}, \\vec{n})|',
    gradeLabel: 'Lớp 12'
  },
  {
    id: 'pyramid_section',
    title: 'Hình chóp & Thiết diện Cắt bởi Mặt phẳng 3D',
    subtitle: 'Điều chỉnh tỉ lệ chiều cao mặt cắt để quan sát sự đồng dạng của thiết diện',
    formula: 'V_{\\text{chóp}} = \\frac{1}{3} S_{\\text{đáy}} \\cdot h',
    gradeLabel: 'Lớp 11 · Lớp 12'
  },
  {
    id: 'revolution_solid',
    title: 'Khối Tròn Xoay & Thể tích Tích phân 3D',
    subtitle: 'Quay đường cong quanh trục Ox tạo vật thể tròn xoay V = π∫f²(x)dx',
    formula: 'V = \\pi \\int_a^b [f(x)]^2\\,dx',
    gradeLabel: 'Lớp 12'
  },
  {
    id: 'integral_disks_3d',
    title: 'Tổng Riemann & Lát Cắt Đĩa Tích Phân 3D',
    subtitle: 'Chia nhỏ vật thể thành N đĩa trụ để xấp xỉ thể tích khối tròn xoay',
    formula: 'V \\approx \\sum_{i=1}^n \\pi f(x_i)^2 \\Delta x',
    gradeLabel: 'Lớp 12'
  },
  {
    id: 'conic_sections_3d',
    title: 'Thiết diện Nón Đôi 3D: Elip, Parabol, Hypebol',
    subtitle: 'Xoay góc nghiêng mặt phẳng cắt hình nón kép tạo các đường Conic',
    formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
    gradeLabel: 'Lớp 10'
  },
  {
    id: 'circle_theorems_3d',
    title: 'Hình học Đường tròn & Tiếp tuyến 3D',
    subtitle: 'Góc nội tiếp, góc ở tâm và tính chất hai tiếp tuyến cắt nhau',
    formula: '\\widehat{ACB} = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}',
    gradeLabel: 'Lớp 9'
  },
  {
    id: 'tangent_surface_3d',
    title: 'Mặt cong z = f(x, y) & Mặt phẳng Tiếp xúc 3D',
    subtitle: 'Khảo sát đạo hàm riêng, cực trị địa phương và pháp tuyến bề mặt',
    formula: 'z - z_0 = f_x(x-x_0) + f_y(y-y_0)',
    gradeLabel: 'Chuyên Toán'
  },
  {
    id: 'probability_bell_3d',
    title: 'Phân phối Chuẩn Gauss & Xác suất 3D',
    subtitle: 'Hình chuông 3D biểu diễn mật độ xác suất theo trung bình μ và độ lệch chuẩn σ',
    formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    gradeLabel: 'Lớp 11 · Lớp 12'
  },
  {
    id: 'solid_prism_nets_3d',
    title: 'Khai triển Lưới Hình Lăng Trụ & Khối Đa Diện 3D',
    subtitle: 'Mở phẳng các mặt khối hộp, lăng trụ và hình chóp từ 3D sang 2D',
    formula: 'S_{\\text{tp}} = S_{\\text{xq}} + 2S_{\\text{đáy}}',
    gradeLabel: 'Lớp 7 · Lớp 8'
  }
];

const CS_3D_CATALOG: Array<{
  id: string;
  title: string;
  subtitle: string;
  formula: string;
}> = [
  { id: 'sort_3d', title: 'Sắp xếp Cột Nổi 3D (QuickSort / MergeSort)', subtitle: 'Hoán vị và chia để trị trực tiếp trong không gian 3D', formula: 'O(N \\log N)' },
  { id: 'bst_3d', title: 'Cây Nhị Phân Tìm Kiếm BST & AVL 3D', subtitle: 'Chèn, tìm kiếm và cân bằng độ cao cây nhị phân 3D', formula: 'O(\\log N)' },
  { id: 'graph_3d', title: 'Đồ thị 3D: Dijkstra & BFS / DFS Lan Truyền', subtitle: 'Đường đi ngắn nhất với dòng hạt năng lượng trên đồ thị 3D', formula: 'O((V+E)\\log V)' },
  { id: 'maze_3d', title: 'Mê cung 3D: Quay lui Backtracking & A*', subtitle: 'Tìm đường thoát mê cung không gian 3D theo từng bước', formula: 'f(n) = g(n) + h(n)' },
  { id: 'segtree_3d', title: 'Cây Phân Đoạn Segment Tree 3D', subtitle: 'Truy vấn đoạn [L, R] và cập nhật lười Lazy Propagation', formula: 'O(\\log N)' },
  { id: 'dp_table_3d', title: 'Bảng Quy Hoạch Động DP 3D (Knapsack / LCS)', subtitle: 'Các cột trạng thái DP dựng lên theo từng bước chuyển trạng thái', formula: 'dp[i][w] = \\max(dp[i-1][w], dp[i-1][w-w_i]+v_i)' },
  { id: 'trie_3d', title: 'Cây Tiền Tố Trie 3D (Xử lý Xâu)', subtitle: 'Lưu trữ và tìm kiếm từ điển theo từng ký tự 3D', formula: 'O(|S|)' },
  { id: 'stack_queue_3d', title: 'Ngăn xếp Stack & Hàng đợi Queue 3D', subtitle: 'Mô phỏng LIFO / FIFO với khối dữ liệu tương tác', formula: 'O(1)\\text{ push/pop}' },
  { id: 'flow_network_3d', title: 'Mạng Luồng Cực Đại Max-Flow 3D', subtitle: 'Tìm đường tăng luồng Ford–Fulkerson / Dinic', formula: '\\text{MaxFlow} = \\text{MinCut}' },
  { id: 'spatial_octree_3d', title: 'Cây Không Gian Octree 3D', subtitle: 'Phân chia đệ quy không gian 3D thành 8 vùng con', formula: '8^d\\text{ voxels}' }
];

let cachedCatalog: ExperienceCatalogItem[] | null = null;

export function getExperienceCatalog(): ExperienceCatalogItem[] {
  if (cachedCatalog) return cachedCatalog;

  const items: ExperienceCatalogItem[] = [];

  // 1. Physics 2D & 3D
  for (const sim of Object.values(PHYSICS_2D_SIMS)) {
    items.push({
      key: `sim2d:physics:${sim.id}`,
      kind: 'sim2d',
      subject: 'physics',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Vật lí 2D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} vat li 2d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  for (const sim of Object.values(PHYSICS_3D_SIMS)) {
    items.push({
      key: `sim3d:physics:${sim.id}`,
      kind: 'sim3d',
      subject: 'physics',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Vật lí 3D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} vat li 3d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  // 2. Chemistry 2D, 3D, Sandbox
  for (const sim of CHEMISTRY_2D_SIMS) {
    items.push({
      key: `sim2d:chemistry:${sim.id}`,
      kind: 'sim2d',
      subject: 'chemistry',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Hóa học 2D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} hoa hoc 2d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  for (const sim of CHEMISTRY_3D_SIMS) {
    items.push({
      key: `sim3d:chemistry:${sim.id}`,
      kind: 'sim3d',
      subject: 'chemistry',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Hóa học 3D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} hoa hoc 3d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  items.push({
    key: 'sandbox:chemistry:chem_sandbox',
    kind: 'sandbox',
    subject: 'chemistry',
    targetId: 'chem_sandbox',
    title: 'Sandbox Hóa Học Tương Tác (Pha chế · Chuẩn độ pH · Cân bằng PTHH)',
    subtitle: 'Phòng thí nghiệm tự do trộn thuốc thử, đo pH, nhiệt độ và cân bằng phản ứng',
    formula: 'C_a V_a = C_b V_b \\quad|\\quad \\text{pH} = -\\log[\\text{H}^+]',
    gradeLabel: 'Hóa học · Lớp 8–12',
    keywords: 'sandbox hoa hoc phong thi nghiem pha che chuan do ph'.toLowerCase()
  });

  // 3. Biology 2D, 3D, Sandbox
  for (const sim of BIOLOGY_2D_SIMS) {
    items.push({
      key: `sim2d:biology:${sim.id}`,
      kind: 'sim2d',
      subject: 'biology',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Sinh học 2D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} sinh hoc 2d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  for (const sim of BIOLOGY_3D_SIMS) {
    items.push({
      key: `sim3d:biology:${sim.id}`,
      kind: 'sim3d',
      subject: 'biology',
      targetId: sim.id,
      domainId: sim.domainId,
      title: sim.title,
      subtitle: `Sinh học 3D · ${sim.subtitle}`,
      formula: sim.formula,
      gradeLabel: sim.grades.join(' · '),
      keywords: `${sim.title} ${sim.subtitle} sinh hoc 3d ${sim.grades.join(' ')}`.toLowerCase()
    });
  }

  items.push({
    key: 'sandbox:biology:bio_sandbox',
    kind: 'sandbox',
    subject: 'biology',
    targetId: 'bio_sandbox',
    title: 'Sandbox Sinh Học Tương Tác (Dịch mã DNA · Hardy-Weinberg · Enzyme · Tháp Sinh thái)',
    subtitle: '4 phòng thực hành sinh học phân tử, di truyền quần thể và động học enzyme',
    formula: 'p^2 + 2pq + q^2 = 1 \\quad|\\quad \\text{DNA} \\to \\text{mRNA} \\to \\text{Protein}',
    gradeLabel: 'Sinh học · Lớp 9–12',
    keywords: 'sandbox sinh hoc dna mrna enzyme hardy weinberg mendel'.toLowerCase()
  });

  // 4. Math 2D & 3D
  items.push({
    key: 'sim2d:math:grapher',
    kind: 'sim2d',
    subject: 'math',
    targetId: 'grapher',
    title: 'Phòng Khảo Sát Đồ Thị Hàm Số & Tích Phân 2D',
    subtitle: 'Vẽ đồng thời nhiều đồ thị, tiếp tuyến tại x₀ và tô miền diện tích tích phân [a, b]',
    formula: 'S = \\int_a^b |f(x) - g(x)|\\,dx',
    gradeLabel: 'Toán · Lớp 9–12',
    keywords: 'toan 2d do thi ham so dao ham tich phan tiep tuyen'.toLowerCase()
  });
  items.push({
    key: 'sim2d:math:geometry',
    kind: 'sim2d',
    subject: 'math',
    targetId: 'geometry',
    title: 'Xưởng Vẽ Hình Học Phẳng & Đường Tròn Tương Tác 2D',
    subtitle: 'Dựng điểm, đoạn thẳng, tiếp tuyến đường tròn, tứ giác nội tiếp và đo góc trực tiếp',
    formula: 'a^2 + b^2 = c^2 \\quad|\\quad \\widehat{ACB} = \\frac{1}{2}\\text{sđ}\\overset{\\frown}{AB}',
    gradeLabel: 'Toán · Lớp 6–12',
    keywords: 'toan 2d hinh hoc phang duong tron tiep tuyen compa'.toLowerCase()
  });

  for (const m3d of MATH_3D_CATALOG) {
    items.push({
      key: `sim3d:math:${m3d.id}`,
      kind: 'sim3d',
      subject: 'math',
      targetId: m3d.id,
      title: m3d.title,
      subtitle: `Toán học 3D · ${m3d.subtitle}`,
      formula: m3d.formula,
      gradeLabel: m3d.gradeLabel,
      keywords: `${m3d.title} ${m3d.subtitle} toan 3d ${m3d.gradeLabel}`.toLowerCase()
    });
  }

  // 5. CS 2D & 3D
  for (const algo of ALGO_CATALOG) {
    items.push({
      key: `sim2d:cs:${algo.id}`,
      kind: 'sim2d',
      subject: 'cs',
      targetId: algo.id,
      title: algo.titleVi,
      subtitle: `Tin học 2D (${algo.complexity}) · ${algo.summaryVi}`,
      formula: algo.complexity,
      gradeLabel: algo.shortTag,
      keywords: `${algo.titleVi} ${algo.titleEn} ${algo.summaryVi} tin hoc 2d thuat toan`.toLowerCase()
    });
  }

  for (const cs3d of CS_3D_CATALOG) {
    items.push({
      key: `sim3d:cs:${cs3d.id}`,
      kind: 'sim3d',
      subject: 'cs',
      targetId: cs3d.id,
      title: cs3d.title,
      subtitle: `Tin học 3D · ${cs3d.subtitle}`,
      formula: cs3d.formula,
      gradeLabel: 'Tin học · VNOI',
      keywords: `${cs3d.title} ${cs3d.subtitle} tin hoc 3d`.toLowerCase()
    });
  }

  // 6. Synapse Pre 3D Studios & Sandboxes
  for (const studio of PRE_STUDIOS) {
    items.push({
      key: `pre_lab:pre:${studio.id}`,
      kind: 'pre_lab',
      subject: 'pre',
      targetId: studio.id,
      title: studio.titleVi,
      subtitle: `Synapse Pre · ${studio.metaVi}`,
      gradeLabel:
        studio.sandboxDivision === 'khtn'
          ? 'Synapse Pre · Sandbox KHTN'
          : studio.sandboxDivision === 'khkt'
          ? 'Synapse Pre · Sandbox KHKT'
          : 'Synapse Pre · Studio 3D',
      keywords: `${studio.titleVi} ${studio.metaVi} ${studio.keywords} synapse pre`.toLowerCase()
    });
  }

  // 7. Lectures (Math, Physics, Chemistry, Biology, CS)
  for (const l of MATH_LECTURES) {
    items.push({
      key: `lecture:math:${l.id}`,
      kind: 'lecture',
      subject: 'math',
      targetId: l.id,
      title: l.title,
      subtitle: `${l.grade}${l.category ? ` · ${l.category}` : ''}`,
      formula: l.keyFormulas?.[0],
      gradeLabel: l.grade,
      keywords: `${l.title} ${l.grade} ${l.description} bai giang toan`.toLowerCase()
    });
  }

  for (const l of PHYSICS_LESSONS) {
    items.push({
      key: `lecture:physics:${l.id}`,
      kind: 'lecture',
      subject: 'physics',
      targetId: l.id,
      title: l.title,
      subtitle: `${l.grade} · ${l.subtitle}`,
      formula: l.keyFormulas?.[0],
      gradeLabel: l.grade,
      keywords: `${l.title} ${l.grade} ${l.subtitle} bai giang vat li`.toLowerCase()
    });
  }

  for (const l of CHEMISTRY_LESSONS) {
    items.push({
      key: `lecture:chemistry:${l.id}`,
      kind: 'lecture',
      subject: 'chemistry',
      targetId: l.id,
      title: l.title,
      subtitle: `${l.grade} · ${l.subtitle}`,
      formula: l.keyFormulas?.[0],
      gradeLabel: l.grade,
      keywords: `${l.title} ${l.grade} ${l.subtitle} bai giang hoa hoc`.toLowerCase()
    });
  }

  for (const l of BIOLOGY_LESSONS) {
    items.push({
      key: `lecture:biology:${l.id}`,
      kind: 'lecture',
      subject: 'biology',
      targetId: l.id,
      title: l.title,
      subtitle: `${l.grade} · ${l.subtitle}`,
      formula: l.keyFormulas?.[0],
      gradeLabel: l.grade,
      keywords: `${l.title} ${l.grade} ${l.subtitle} bai giang sinh hoc`.toLowerCase()
    });
  }

  for (const l of CS_LESSONS) {
    items.push({
      key: `lecture:cs:${l.id}`,
      kind: 'lecture',
      subject: 'cs',
      targetId: l.id,
      title: l.title,
      subtitle: `${l.level} · ${l.topic}`,
      gradeLabel: l.level,
      keywords: `${l.title} ${l.level} ${l.topic} bai giang tin hoc`.toLowerCase()
    });
  }

  cachedCatalog = items;
  return items;
}

export function catalogItemToAttachment(
  item: ExperienceCatalogItem,
  openSim?: boolean
): ForumExperienceAttachment {
  return {
    kind: item.kind,
    subject: item.subject,
    targetId: item.targetId,
    ...(item.domainId ? { domainId: item.domainId } : {}),
    title: item.title,
    subtitle: item.subtitle,
    ...(item.formula ? { formula: item.formula } : {}),
    ...(item.gradeLabel ? { gradeLabel: item.gradeLabel } : {}),
    openSim: openSim ?? item.kind !== 'lecture'
  };
}

export function launchExperienceAttachment(
  att: ForumExperienceAttachment,
  helpers: {
    navigate: (patch: Partial<NavLocation>) => void;
    setMath3DMode: (mode: NonNullable<MathLecture['sim3dMode']>) => void;
  }
) {
  const { navigate, setMath3DMode } = helpers;

  if (att.subject === 'pre' || att.kind === 'pre_lab') {
    navigate({
      subject: 'synapse_v2',
      synapseMode: 'catalog',
      futureTab: att.targetId as any,
      tutorOpen: false
    });
    return;
  }

  if (att.kind === 'sandbox') {
    if (att.subject === 'chemistry') {
      navigate({
        subject: 'chemistry_sims',
        chemistryView: 'sandbox',
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'biology') {
      navigate({
        subject: 'biology_sims',
        biologyView: 'sandbox',
        tutorOpen: false
      });
      return;
    }
  }

  if (att.kind === 'sim2d') {
    if (att.subject === 'physics') {
      const domain = (att.domainId as any) || getDomainFor2DSim(att.targetId as any);
      navigate({
        subject: 'physics_sims',
        physicsView: 'sim2d_hub',
        physicsDomain: domain,
        physicsSim2D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'chemistry') {
      const found = CHEMISTRY_2D_SIMS.find((s) => s.id === att.targetId);
      navigate({
        subject: 'chemistry_sims',
        chemistryView: 'sim2d_hub',
        chemistryDomain: (att.domainId as any) || found?.domainId || 'atomic_periodic',
        chemistrySim2D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'biology') {
      const found = BIOLOGY_2D_SIMS.find((s) => s.id === att.targetId);
      navigate({
        subject: 'biology_sims',
        biologyView: 'sim2d_hub',
        biologyDomain: (att.domainId as any) || found?.domainId || 'cell_membrane',
        biologySim2D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'math') {
      navigate({
        subject: 'math_sims',
        mathTab: att.targetId === 'geometry' ? 'geometry' : 'grapher',
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'cs') {
      navigate({
        subject: 'cs_sims',
        csSimTab: 'viz2d',
        csAlgoId: att.targetId,
        tutorOpen: false
      });
      return;
    }
  }

  if (att.kind === 'sim3d') {
    if (att.subject === 'physics') {
      const domain = (att.domainId as any) || getDomainFor3DSim(att.targetId as any);
      navigate({
        subject: 'physics_sims',
        physicsView: 'sim3d_hub',
        physicsDomain: domain,
        physicsSim3D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'chemistry') {
      const found = CHEMISTRY_3D_SIMS.find((s) => s.id === att.targetId);
      navigate({
        subject: 'chemistry_sims',
        chemistryView: 'sim3d_hub',
        chemistryDomain: (att.domainId as any) || found?.domainId || 'atomic_periodic',
        chemistrySim3D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'biology') {
      const found = BIOLOGY_3D_SIMS.find((s) => s.id === att.targetId);
      navigate({
        subject: 'biology_sims',
        biologyView: 'sim3d_hub',
        biologyDomain: (att.domainId as any) || found?.domainId || 'cell_membrane',
        biologySim3D: att.targetId as any,
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'math') {
      setMath3DMode(att.targetId as NonNullable<MathLecture['sim3dMode']>);
      navigate({
        subject: 'math_sims',
        mathTab: 'math3d',
        tutorOpen: false
      });
      return;
    }
    if (att.subject === 'cs') {
      navigate({
        subject: 'cs_sims',
        csSimTab: 'viz3d',
        csAlgoId: att.targetId,
        tutorOpen: false
      });
      return;
    }
  }

  // Default: lecture routing
  if (att.subject === 'math') {
    navigate({
      subject: 'math',
      mathTab: att.openSim ? 'grapher' : 'lectures',
      mathViewMode: 'lecture',
      mathLectureId: att.targetId,
      tutorOpen: false
    });
  } else if (att.subject === 'physics') {
    navigate({
      subject: 'physics',
      physicsView: 'lecture',
      physicsLessonId: att.targetId,
      physicsTab: att.openSim ? 'simulation' : 'theory',
      tutorOpen: false
    });
  } else if (att.subject === 'chemistry') {
    navigate({
      subject: 'chemistry',
      chemistryView: 'lecture',
      chemistryLessonId: att.targetId,
      chemistryTab: att.openSim ? 'simulation' : 'theory',
      tutorOpen: false
    });
  } else if (att.subject === 'biology') {
    navigate({
      subject: 'biology',
      biologyView: 'lecture',
      biologyLessonId: att.targetId,
      biologyTab: att.openSim ? 'simulation' : 'theory',
      tutorOpen: false
    });
  } else if (att.subject === 'cs') {
    navigate({
      subject: 'cs',
      csViewMode: 'curriculum',
      csSubView: 'lecture',
      csLessonId: att.targetId,
      csLessonTab: att.openSim ? 'visualizer' : 'lecture',
      tutorOpen: false
    });
  }
}
