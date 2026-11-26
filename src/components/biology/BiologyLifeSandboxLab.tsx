import React, { useState } from 'react';
import { Cpu, Dna, HeartPulse, ScanEye, Sprout } from 'lucide-react';
import { EcosystemTerrariumSandbox } from './sandbox/EcosystemTerrariumSandbox';
import { DnaEvolutionSandbox } from './sandbox/DnaEvolutionSandbox';
import { CellBuilderSandbox } from './sandbox/CellBuilderSandbox';
import { HumanPhysiologySandbox } from './sandbox/HumanPhysiologySandbox';
import { OrganismRoleplaySandbox } from './sandbox/OrganismRoleplaySandbox';

type OpenBioTab = 'roleplay' | 'ecosystem' | 'dna' | 'cell' | 'physiology';

const TABS: {
  id: OpenBioTab;
  titleVi: string;
  titleEn: string;
  descVi: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'roleplay',
    titleVi: 'Nhập vai Vòng đời & X-Ray',
    titleEn: 'Organism Roleplay & X-Ray',
    descVi: 'Thực vật (Đậu, Xương rồng, Đước), Động vật (Ếch, Bướm, Cá hồi, Gấu) & Thẻ tiến hóa',
    icon: <ScanEye className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'ecosystem',
    titleVi: 'Hệ sinh thái thu nhỏ',
    titleEn: 'Ecosystem Terrarium',
    descVi: 'Địa hình, thả loài, ánh sáng/mưa/nhiệt & diễn thế hàng trăm năm',
    icon: <Sprout className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'dna',
    titleVi: 'Thiết kế & Tiến hóa Gen',
    titleEn: 'DNA & Evolution',
    descVi: 'Ghép trình tự A-T-G-C, tính trạng & chọn lọc tự nhiên F₀ → F₅₀',
    icon: <Dna className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'cell',
    titleVi: 'Xưởng lắp ráp Tế bào',
    titleEn: 'Cell Builder',
    descVi: 'Tự đặt Nhân, Ty thể, Lục lạp, cấp Glucose/O₂ & kích hoạt nguyên phân',
    icon: <Cpu className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'physiology',
    titleVi: 'Cơ thể & Sinh lý người',
    titleEn: 'Human Physiology',
    descVi: 'Dinh dưỡng, vận động, thiếu ngủ, thuốc & phản ứng dây chuyền',
    icon: <HeartPulse className="w-4 h-4 shrink-0" />,
  },
];

export const BiologyLifeSandboxLab: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [activeTab, setActiveTab] = useState<OpenBioTab>('roleplay');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`text-left p-3.5 rounded-xl border cursor-pointer transition-colors ${
                active
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-teal-500'
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm">
                {t.icon}
                <span className="truncate">{isEn ? t.titleEn : t.titleVi}</span>
              </div>
              <p className={`text-[11px] mt-1 line-clamp-2 ${active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {t.descVi}
              </p>
            </button>
          );
        })}
      </div>

      {activeTab === 'roleplay' && <OrganismRoleplaySandbox isEn={isEn} />}
      {activeTab === 'ecosystem' && <EcosystemTerrariumSandbox isEn={isEn} />}
      {activeTab === 'dna' && <DnaEvolutionSandbox isEn={isEn} />}
      {activeTab === 'cell' && <CellBuilderSandbox isEn={isEn} />}
      {activeTab === 'physiology' && <HumanPhysiologySandbox isEn={isEn} />}
    </div>
  );
};
