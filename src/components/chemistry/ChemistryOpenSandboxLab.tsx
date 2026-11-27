import React, { useState } from 'react';
import { Atom, FlaskConical, Gauge, Trophy } from 'lucide-react';
import { OpenChemistryBench } from './sandbox/OpenChemistryBench';
import { MolecularBuilder3D } from './sandbox/MolecularBuilder3D';
import { ParticleStateSandbox } from './sandbox/ParticleStateSandbox';
import { SurvivalChallengesSandbox } from './sandbox/SurvivalChallengesSandbox';
import { SandboxIntroGuideBanner } from '../common/SandboxIntroGuideBanner';

type OpenChemTab = 'bench' | 'builder3d' | 'particles' | 'survival';

const TABS: {
  id: OpenChemTab;
  titleVi: string;
  titleEn: string;
  descVi: string;
  introVi: string;
  introEn: string;
  stepsVi: string[];
  stepsEn: string[];
  tipVi: string;
  tipEn: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'bench',
    titleVi: 'Bàn pha chế tự do',
    titleEn: 'Open Chemistry Bench',
    descVi: 'Trộn hóa chất rắn–lỏng–khí, đèn cồn, điện phân & giấy quỳ',
    introVi:
      'Phòng thí nghiệm mở cho phép tự do rót hóa chất vào cốc/ống nghiệm, đun nóng trên đèn cồn, nhúng điện cực điện phân và thử pH bằng giấy quỳ tím để quan sát hiện tượng thực tế.',
    introEn:
      'An open virtual bench where you freely mix solids, liquids, and gases, heat with a burner, run electrolysis, and test pH with litmus.',
    stepsVi: [
      'Chọn hóa chất (kim loại, axit, bazơ, muối) từ kệ để thêm vào bình phản ứng.',
      'Bật Đèn cồn (t°) hoặc Điện phân nếu phản ứng cần nhiệt độ hoặc dòng điện.',
      'Dùng Giấy quỳ tím hoặc nhiệt kế kiểm tra môi trường axit/bazơ và tỏa nhiệt.',
      'Quan sát màu dung dịch, kết tủa lắng xuống, bọt khí bay lên và phương trình tự động.',
    ],
    stepsEn: [
      'Pick reactants from the shelf (metals, acids, bases, salts) to pour into the vessel.',
      'Toggle the Alcohol Burner or Electrolysis electrodes when activation energy is needed.',
      'Test the solution with Litmus paper or check live temperature changes.',
      'Observe color shifts, precipitates, gas effervescence, and balanced equations.',
    ],
    tipVi: 'Thử cho Na kim loại vào nước có nhỏ Phenolphthalein hoặc đun Cu(OH)₂ để xem chuyển màu.',
    tipEn: 'Try dropping Na into water with Phenolphthalein or heating Cu(OH)₂ to observe thermal decomposition.',
    icon: <FlaskConical className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'builder3d',
    titleVi: 'Lắp ráp phân tử 3D',
    titleEn: '3D Molecular Builder',
    descVi: 'Gắn C, H, O, N, Cl... đơn/đôi/ba, góc VSEPR & tên IUPAC',
    introVi:
      'Xưởng ghép nối nguyên tử theo hóa trị chuẩn (C=4, N=3, O=2, H/Cl=1) bằng liên kết đơn, đôi, ba để tự động dựng hình học không gian 3D và nhận diện tên gọi IUPAC.',
    introEn:
      'Build valid 3D molecules by connecting C, H, O, N, and Cl atoms with single, double, or triple bonds and inspect VSEPR geometry.',
    stepsVi: [
      'Chọn nguyên tố (C, H, O, N, Cl...) và nhấp vào khung để đặt nguyên tử hoặc chọn mẫu sẵn.',
      'Chọn bậc liên kết (Đơn —, Đôi =, Ba ≡) rồi nối giữa hai nguyên tử chưa đủ hóa trị.',
      'Kéo xoay mô hình 3D để quan sát góc liên kết VSEPR và độ phân cực.',
      'Kiểm tra công thức phân tử, phân tử khối M và tên IUPAC được nhận diện tự động.',
    ],
    stepsEn: [
      'Select an atom (C, H, O, N, Cl) and place it on the canvas or load a preset.',
      'Pick bond order (Single, Double, Triple) and link two atoms with open valences.',
      'Orbit the 3D scene to inspect bond angles and molecular polarity.',
      'Read the automatically detected formula, molar mass, and IUPAC name.',
    ],
    tipVi: 'Mỗi nguyên tử sẽ hiển thị số liên kết còn trống giúp bạn không ghép vượt hóa trị.',
    tipEn: 'Open valence indicators warn you when an atom reaches its octet/covalent limit.',
    icon: <Atom className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'particles',
    titleVi: 'Vật lý hạt & Trạng thái',
    titleEn: 'Particle & Phase Sandbox',
    descVi: 'Piston thể tích, nhiệt độ, xúc tác, chuyển pha & cân bằng',
    introVi:
      'Quan sát chuyển động nhiệt va chạm đàn hồi ở cấp độ vi mô khi nén Piston, gia nhiệt làm chuyển pha Rắn → Lỏng → Khí hoặc thêm xúc tác để tăng tốc độ phản ứng.',
    introEn:
      'Inspect microscopic particle collisions as you compress the piston, heat across Solid-Liquid-Gas transitions, or add catalysts.',
    stepsVi: [
      'Kéo thanh Nhiệt độ (K / °C) để theo dõi động năng phân tử và hiện tượng chuyển pha.',
      'Nén hoặc giãn Piston thể tích để thấy áp suất P và tần suất va chạm thành bình tăng/giảm.',
      'Bật Chất xúc tác để hạ năng lượng hoạt hóa Ea giúp va chạm hiệu quả hơn.',
      'Theo dõi đồng hồ áp suất, tỉ lệ va chạm thành công và đường cong Maxwell–Boltzmann.',
    ],
    stepsEn: [
      'Adjust Temperature to drive phase transitions and molecular kinetic energy.',
      'Move the Piston to compress/expand volume and observe pressure & collision rate.',
      'Toggle a Catalyst to lower activation energy Ea and speed up reaction yield.',
      'Watch real-time pressure telemetry and successful collision percentages.',
    ],
    tipVi: 'Giảm thể tích xuống một nửa ở nhiệt độ không đổi sẽ làm áp suất tăng gấp đôi (Định luật Boyle).',
    tipEn: 'Halving the volume at constant temperature doubles pressure per Boyle’s Law.',
    icon: <Gauge className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'survival',
    titleVi: 'Thử thách Sinh tồn Hóa học',
    titleEn: 'Chemistry Survival',
    descVi: 'Điều chế H₂, Fe, Xà phòng, H₂SO₄ từ nguyên liệu thô',
    introVi:
      'Chế độ nhiệm vụ hóa học thực tiễn: đi từ quặng, muối ăn, đá vôi hoặc dầu thực vật ban đầu, kết hợp đúng quy trình điều chế để tổng hợp H₂, Fe tinh khiết, Xà phòng hoặc H₂SO₄.',
    introEn:
      'Solve practical synthesis missions: transform raw ores, brine, limestone, or oils into pure H₂, Iron, Soap, or H₂SO₄.',
    stepsVi: [
      'Chọn một nhiệm vụ điều chế từ danh sách thử thách.',
      'Đọc mục tiêu sản phẩm cần thu hồi và kho nguyên liệu thô đang có.',
      'Thực hiện từng công đoạn phản ứng (nung, điện phân, trao đổi, xà phòng hóa) đúng thứ tự.',
      'Kiểm tra hiệu suất và phản hồi hóa học sau mỗi bước để hoàn thành nhiệm vụ.',
    ],
    stepsEn: [
      'Pick a target synthesis mission from the challenge list.',
      'Review your raw starting materials and target pure chemical product.',
      'Execute processing steps (roasting, electrolysis, displacement, saponification) in order.',
      'Verify stoichiometry feedback at each step until the synthesis succeeds.',
    ],
    tipVi: 'Chú ý điều kiện nhiệt độ cao hoặc xúc tác V₂O₅/nhiệt phân ở các công đoạn công nghiệp.',
    tipEn: 'Pay close attention to high-temperature roasting or catalyst conditions in industrial chains.',
    icon: <Trophy className="w-4 h-4 shrink-0" />,
  },
];

export const ChemistryOpenSandboxLab: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [activeTab, setActiveTab] = useState<OpenChemTab>('bench');
  const currentTabSpec = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`text-left p-3.5 rounded-xl border cursor-pointer transition-colors ${
                active
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm">
                {t.icon}
                <span className="truncate">{isEn ? t.titleEn : t.titleVi}</span>
              </div>
              <p className={`text-[11px] mt-1 line-clamp-2 ${active ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {t.descVi}
              </p>
            </button>
          );
        })}
      </div>

      <SandboxIntroGuideBanner
        subject="chem"
        title={isEn ? currentTabSpec.titleEn : currentTabSpec.titleVi}
        intro={isEn ? currentTabSpec.introEn : currentTabSpec.introVi}
        steps={isEn ? currentTabSpec.stepsEn : currentTabSpec.stepsVi}
        tip={isEn ? currentTabSpec.tipEn : currentTabSpec.tipVi}
        isEn={isEn}
      />

      {activeTab === 'bench' && <OpenChemistryBench isEn={isEn} />}
      {activeTab === 'builder3d' && <MolecularBuilder3D isEn={isEn} />}
      {activeTab === 'particles' && <ParticleStateSandbox isEn={isEn} />}
      {activeTab === 'survival' && <SurvivalChallengesSandbox isEn={isEn} />}
    </div>
  );
};
