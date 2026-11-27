import React, { useState } from 'react';
import { Cpu, Dna, HeartPulse, ScanEye, Sprout } from 'lucide-react';
import { EcosystemTerrariumSandbox } from './sandbox/EcosystemTerrariumSandbox';
import { DnaEvolutionSandbox } from './sandbox/DnaEvolutionSandbox';
import { CellBuilderSandbox } from './sandbox/CellBuilderSandbox';
import { HumanPhysiologySandbox } from './sandbox/HumanPhysiologySandbox';
import { OrganismRoleplaySandbox } from './sandbox/OrganismRoleplaySandbox';
import { SandboxIntroGuideBanner } from '../common/SandboxIntroGuideBanner';

type OpenBioTab = 'roleplay' | 'ecosystem' | 'dna' | 'cell' | 'physiology';

const TABS: {
  id: OpenBioTab;
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
    id: 'roleplay',
    titleVi: 'Nhập vai Vòng đời & X-Ray',
    titleEn: 'Organism Roleplay & X-Ray',
    descVi: 'Thực vật (Đậu, Xương rồng, Đước), Động vật (Ếch, Bướm, Cá hồi, Gấu) & Thẻ tiến hóa',
    introVi:
      'Hóa thân trực tiếp vào 3 loài thực vật hoặc 4 loài động vật để vượt qua 4 giai đoạn sinh trưởng – biến thái, cân bằng ATP, nước, thân nhiệt và O₂ dưới các điều kiện khí hậu khắc nghiệt.',
    introEn:
      'Step into the lifecycle of 3 plants or 4 animals across 4 growth stages while balancing ATP, water, temperature, and O₂.',
    stepsVi: [
      'Chọn nhóm Thực vật hoặc Động vật rồi chọn loài muốn nhập vai.',
      'Với Động vật: nhấp chuột lên màn hình để di chuyển ăn thức ăn (+ATP) và né thiên địch.',
      'Với Thực vật: chuyển Ngày/Đêm, đóng/mở khí khổng và phân bổ ATP cho Rễ ↔ Thân Lá.',
      'Bật "Mở Góc nhìn X-Ray" để soi mạch gỗ, lỗ khí khổng hoặc tim – mang – phổi bên trong.',
    ],
    stepsEn: [
      'Select Plant or Animal domain and pick your organism species.',
      'For Animals: click the scene to move, forage food (+ATP), and dodge predators.',
      'For Plants: toggle Day/Night, open/close stomata, and balance Root vs Shoot ATP.',
      'Enable X-Ray View to inspect xylem transport, stomata, heartbeats, and gills/lungs.',
    ],
    tipVi: 'Hoàn tất đủ 4 giai đoạn để mở khóa Thẻ Tính Trạng Tiến Hóa và trang bị cho lượt chơi sau.',
    tipEn: 'Complete all 4 stages to unlock Evolutionary Trait Cards for subsequent runs.',
    icon: <ScanEye className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'ecosystem',
    titleVi: 'Hệ sinh thái thu nhỏ',
    titleEn: 'Ecosystem Terrarium',
    descVi: 'Địa hình, thả loài, ánh sáng/mưa/nhiệt & diễn thế hàng trăm năm',
    introVi:
      'Mô phỏng quần xã sinh vật tự vận hành qua hàng trăm năm ảo với 4 bậc dinh dưỡng: Thực vật sản xuất, Động vật ăn cỏ, Động vật ăn thịt và Sinh vật phân giải đất.',
    introEn:
      'Simulate a multi-trophic terrarium over virtual centuries with producers, herbivores, carnivores, and decomposers.',
    stepsVi: [
      'Chọn hệ sinh thái khởi tạo: Ao hồ nước ngọt, Rừng nhiệt đới hoặc Sa mạc.',
      'Chọn loại sinh vật rồi nhấp trực tiếp lên khung cảnh để thả thêm vào vị trí bất kì.',
      'Điều chỉnh Ánh sáng, Lượng mưa, Nhiệt độ và tốc độ thời gian (1× / 5× / 20× năm/giây).',
      'Thử kích hoạt Dịch bệnh, Hạn hán hoặc Bón dinh dưỡng và theo dõi biểu đồ diễn thế bên dưới.',
    ],
    stepsEn: [
      'Choose a starting biome: Freshwater Pond, Tropical Rainforest, or Arid Desert.',
      'Pick a species category and click anywhere in the habitat to drop organisms.',
      'Adjust Light, Rainfall, Temperature, and simulation speed (1× to 20× years/s).',
      'Trigger Outbreak, Drought, or Nutrient boost to watch succession curves respond.',
    ],
    tipVi: 'Nếu thiếu sinh vật phân giải, độ phì đất giảm dần khiến thảm thực vật suy thoái theo.',
    tipEn: 'Without decomposers, soil fertility drops and producers gradually decline.',
    icon: <Sprout className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'dna',
    titleVi: 'Thiết kế & Tiến hóa Gen',
    titleEn: 'DNA & Evolution',
    descVi: 'Ghép trình tự A-T-G-C, tính trạng & chọn lọc tự nhiên F₀ → F₅₀',
    introVi:
      'Biên tập từng nucleotit A–T–G–C trên 3 gen quy định màu lông/vảy, kích thước cánh và khả năng chịu nhiệt, sau đó thả quần thể vào môi trường khắc nghiệt để quan sát chọn lọc tự nhiên.',
    introEn:
      'Edit A-T-G-C nucleotides across 3 trait genes, translate codons to amino acids, and run natural selection across generations.',
    stepsVi: [
      'Nhấp vào từng ô chữ A, T, G, C để đổi trình tự nucleotit hoặc bấm Đột biến ngẫu nhiên.',
      'Quan sát chuỗi mARN, axit amin và ngoại hình sinh vật biến đổi ngay bên phải.',
      'Chọn môi trường Chọn lọc tự nhiên (Kỷ Băng Hà, Sa mạc, Rừng đêm, Đảo bão).',
      'Bấm "Thả 100 cá thể F₀" rồi "Tiến hóa +5 thế hệ" để xem kiểu gen nào chiếm ưu thế.',
    ],
    stepsEn: [
      'Click individual A/T/G/C bases to edit codons or apply a random mutation.',
      'Observe real-time mRNA transcription, amino acids, and organism morphology.',
      'Select a selective environment (Ice Age, Desert, Dark Forest, Storm Island).',
      'Release 100 F₀ individuals and advance generations to observe natural selection.',
    ],
    tipVi: 'Kiểu hình thích nghi cao trong Kỷ Băng Hà thường bị đào thải nhanh khi chuyển sang Sa mạc.',
    tipEn: 'Traits favored in an Ice Age quickly drop in fitness if switched to Desert Heat.',
    icon: <Dna className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'cell',
    titleVi: 'Xưởng lắp ráp Tế bào',
    titleEn: 'Cell Builder',
    descVi: 'Tự đặt Nhân, Ty thể, Lục lạp, cấp Glucose/O₂ & kích hoạt nguyên phân',
    introVi:
      'Tự tay lắp ráp tế bào nhân thực hoàn chỉnh bằng cách bổ sung các bào quan, điều phối dòng Glucose, O₂, ánh sáng và theo dõi sản lượng ATP cũng như quá trình nguyên phân.',
    introEn:
      'Assemble a living eukaryotic cell with organelles, supply Glucose/O₂/light, and trigger ATP synthesis and mitosis.',
    stepsVi: [
      'Chọn loại tế bào (Thực vật hoặc Động vật) và đặt thêm Nhân, Ty thể, Lục lạp, Ribosome.',
      'Cấp Glucose, O₂ hoặc bật ánh sáng quang hợp để nuôi sống bào quan.',
      'Theo dõi tốc độ tổng hợp ATP và trạng thái hoạt động của từng bào quan.',
      'Khi đủ năng lượng và ADN đã nhân đôi, kích hoạt Nguyên phân để phân chia tế bào.',
    ],
    stepsEn: [
      'Choose cell type and place Nucleus, Mitochondria, Chloroplasts, or Ribosomes.',
      'Supply Glucose, O₂, and Light to fuel cellular respiration and photosynthesis.',
      'Monitor ATP output and organelle status in real time.',
      'Trigger Mitosis once energy reserves and DNA replication thresholds are met.',
    ],
    tipVi: 'Thêm nhiều Ty thể giúp tăng tốc độ tạo ATP nhưng đòi hỏi cung cấp đủ O₂ và Glucose.',
    tipEn: 'Adding more mitochondria boosts ATP yield provided O₂ and Glucose stay sufficient.',
    icon: <Cpu className="w-4 h-4 shrink-0" />,
  },
  {
    id: 'physiology',
    titleVi: 'Cơ thể & Sinh lý người',
    titleEn: 'Human Physiology',
    descVi: 'Dinh dưỡng, vận động, thiếu ngủ, thuốc & phản ứng dây chuyền',
    introVi:
      'Khám phá cơ chế điều hòa nội môi của cơ thể người khi thay đổi chế độ ăn, cường độ vận động, giấc ngủ và các tác nhân dược lý lên nhịp tim, đường huyết và huyết áp.',
    introEn:
      'Explore human homeostasis as nutrition, exercise, sleep, and medications trigger physiological chain reactions.',
    stepsVi: [
      'Chọn kịch bản sinh lý hoặc điều chỉnh lượng đường, vận động và thời lượng ngủ.',
      'Quan sát nhịp tim, huyết áp, đường huyết và phản ứng nội tiết thay đổi đồng bộ.',
      'Thử nghiệm trạng thái căng thẳng/thiếu ngủ hoặc bổ sung Insulin/Adrenaline.',
      'Đọc chẩn đoán dây chuyền để hiểu mối liên hệ giữa tuần hoàn, hô hấp và thần kinh.',
    ],
    stepsEn: [
      'Select physiological stressors or adjust diet, exercise, and sleep levels.',
      'Track synchronized changes across heart rate, blood pressure, glucose, and hormones.',
      'Test acute stress, sleep deprivation, or Insulin/Adrenaline interventions.',
      'Review the causal feedback breakdown across organ systems.',
    ],
    tipVi: 'Vận động vừa phải giúp cơ bắp tiêu thụ Glucose hiệu quả mà không cần tăng tiết Insulin quá mức.',
    tipEn: 'Moderate exercise enhances muscle glucose uptake without excessive Insulin spikes.',
    icon: <HeartPulse className="w-4 h-4 shrink-0" />,
  },
];

export const BiologyLifeSandboxLab: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [activeTab, setActiveTab] = useState<OpenBioTab>('roleplay');
  const currentTabSpec = TABS.find((t) => t.id === activeTab) || TABS[0];

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

      <SandboxIntroGuideBanner
        subject="bio"
        title={isEn ? currentTabSpec.titleEn : currentTabSpec.titleVi}
        intro={isEn ? currentTabSpec.introEn : currentTabSpec.introVi}
        steps={isEn ? currentTabSpec.stepsEn : currentTabSpec.stepsVi}
        tip={isEn ? currentTabSpec.tipEn : currentTabSpec.tipVi}
        isEn={isEn}
      />

      {activeTab === 'roleplay' && <OrganismRoleplaySandbox isEn={isEn} />}
      {activeTab === 'ecosystem' && <EcosystemTerrariumSandbox isEn={isEn} />}
      {activeTab === 'dna' && <DnaEvolutionSandbox isEn={isEn} />}
      {activeTab === 'cell' && <CellBuilderSandbox isEn={isEn} />}
      {activeTab === 'physiology' && <HumanPhysiologySandbox isEn={isEn} />}
    </div>
  );
};
