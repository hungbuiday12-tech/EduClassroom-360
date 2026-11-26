import React, { useState } from 'react';
import { Atom, FlaskConical, Gauge, Trophy } from 'lucide-react';
import { OpenChemistryBench } from './sandbox/OpenChemistryBench';
import { MolecularBuilder3D } from './sandbox/MolecularBuilder3D';
import { ParticleStateSandbox } from './sandbox/ParticleStateSandbox';
import { SurvivalChallengesSandbox } from './sandbox/SurvivalChallengesSandbox';

type OpenChemTab = 'bench' | 'builder3d' | 'particles' | 'survival';

const TABS: {
  id: OpenChemTab;
  titleVi: string;
  titleEn: string;
  descVi: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'bench',
    titleVi: 'Bàn pha chế tự do',
    titleEn: 'Open Chemistry Bench',
    descVi: 'Trộn hóa chất rắn–lỏng–khí, đèn cồn, điện phân & giấy quỳ',
    icon: <FlaskConical className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'builder3d',
    titleVi: 'Lắp ráp phân tử 3D',
    titleEn: '3D Molecular Builder',
    descVi: 'Gắn C, H, O, N, Cl... đơn/đôi/ba, góc VSEPR & tên IUPAC',
    icon: <Atom className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'particles',
    titleVi: 'Vật lý hạt & Trạng thái',
    titleEn: 'Particle & Phase Sandbox',
    descVi: 'Piston thể tích, nhiệt độ, xúc tác, chuyển pha & cân bằng',
    icon: <Gauge className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'survival',
    titleVi: 'Thử thách Sinh tồn Hóa học',
    titleEn: 'Chemistry Survival',
    descVi: 'Điều chế H₂, Fe, Xà phòng, H₂SO₄ từ nguyên liệu thô',
    icon: <Trophy className="w-4 h-4 shrink-0" />,
  },
];

export const ChemistryOpenSandboxLab: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [activeTab, setActiveTab] = useState<OpenChemTab>('bench');

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

      {activeTab === 'bench' && <OpenChemistryBench isEn={isEn} />}
      {activeTab === 'builder3d' && <MolecularBuilder3D isEn={isEn} />}
      {activeTab === 'particles' && <ParticleStateSandbox isEn={isEn} />}
      {activeTab === 'survival' && <SurvivalChallengesSandbox isEn={isEn} />}
    </div>
  );
};
