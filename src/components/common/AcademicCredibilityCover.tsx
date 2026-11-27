import React, { useState } from 'react';
import {
  ShieldCheck,
  BookCheck,
  GraduationCap,
  GitBranch,
  ArrowRight,
  Users,
  Compass,
  Zap,
  FlaskConical,
  Dna,
  Code2,
  Target
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SubjectType } from '../../types';

interface AcademicCredibilityCoverProps {
  onOpenAuthors: () => void;
  onOpenRoadmap: () => void;
  onSelectGrade: (grade: string) => void;
  onNavigate: (subject: SubjectType) => void;
}

type ContinuityKey = 'math' | 'physics' | 'chemistry' | 'biology';

const CONTINUITY_THREADS: Record<
  ContinuityKey,
  {
    labelVi: string;
    labelEn: string;
    spearhead?: boolean;
    accentText: string;
    activeBtn: string;
    chain: Array<{ grade: string; topicVi: string; topicEn: string }>;
  }
> = {
  math: {
    labelVi: 'Toán học (Mũi nhọn)',
    labelEn: 'Mathematics (Core)',
    spearhead: true,
    accentText: 'text-blue-700 dark:text-sky-300',
    activeBtn: 'bg-blue-700 text-white border-blue-700',
    chain: [
      { grade: 'Lớp 6', topicVi: 'Số nguyên · ƯCLN/BCNN · Phân số & Hình phẳng', topicEn: 'Integers · GCD/LCM · Fractions' },
      { grade: 'Lớp 7', topicVi: 'Số hữu tỉ · Tỉ lệ thức · Tam giác bằng nhau · Lăng trụ', topicEn: 'Rationals · Proportions · Congruent Triangles' },
      { grade: 'Lớp 8', topicVi: '7 Hằng đẳng thức · Hàm bậc nhất · Thalès & Pythagore', topicEn: 'Identities · Linear Graphs · Thales & Pythagoras' },
      { grade: 'Lớp 9', topicVi: 'Căn thức · Hệ PT · Parabol & Đường tròn nội tiếp', topicEn: 'Radicals · Systems · Quadratics & Circles' },
      { grade: 'Lớp 10', topicVi: 'Hàm bậc hai · Vectơ Oxy · Tổ hợp – Xác suất', topicEn: 'Parabolas · Oxy Vectors · Combinatorics' },
      { grade: 'Lớp 11', topicVi: 'Lượng giác · Dãy số · Giới hạn & Đạo hàm · Quan hệ vuông góc', topicEn: 'Trig · Limits · Derivatives & 3D Perpendicularity' },
      { grade: 'Lớp 12', topicVi: 'Khảo sát hàm số · Nguyên hàm – Tích phân · Oxyz 3D & Bayes', topicEn: 'Calculus · Integrals · 3D Oxyz & Bayes' }
    ]
  },
  physics: {
    labelVi: 'Vật lí (Mũi nhọn)',
    labelEn: 'Physics (Core)',
    spearhead: true,
    accentText: 'text-amber-700 dark:text-amber-300',
    activeBtn: 'bg-amber-500 text-slate-950 border-amber-500',
    chain: [
      { grade: 'Lớp 6', topicVi: 'Đo lường SI · Lực, Trọng lực P=10m & Lò xo', topicEn: 'SI Units · Forces & Spring Stretch' },
      { grade: 'Lớp 7', topicVi: 'Tốc độ v=s/t · Sóng âm · Gương phẳng & Từ trường', topicEn: 'Speed · Sound · Mirror Reflection & Magnets' },
      { grade: 'Lớp 8', topicVi: 'Áp suất · Archimedes · Đòn bẩy · Nhiệt & Mạch cơ bản', topicEn: 'Pressure · Buoyancy · Levers & Basic Circuits' },
      { grade: 'Lớp 9', topicVi: 'Định luật Ôm · Công suất điện · Khúc xạ & Thấu kính', topicEn: 'Ohm’s Law · Electric Power · Refraction & Lenses' },
      { grade: 'Lớp 10', topicVi: 'Động học · Định luật Newton · Bảo toàn Cơ năng', topicEn: 'Kinematics · Newton’s Laws · Conservation Laws' },
      { grade: 'Lớp 11', topicVi: 'Dao động điều hòa · Sóng giao thoa · Điện trường & Mạch kín', topicEn: 'SHM · Wave Interference · Electric Fields' },
      { grade: 'Lớp 12', topicVi: 'Vật lí nhiệt · Khí lí tưởng · Cảm ứng từ · Hạt nhân', topicEn: 'Thermodynamics · Ideal Gas · EM Induction & Nuclear' }
    ]
  },
  chemistry: {
    labelVi: 'Hóa học',
    labelEn: 'Chemistry',
    accentText: 'text-violet-700 dark:text-violet-300',
    activeBtn: 'bg-violet-600 text-white border-violet-600',
    chain: [
      { grade: 'Lớp 6', topicVi: 'Chất · Ba thể Rắn/Lỏng/Khí · Dung dịch & Tách chất', topicEn: 'Matter States · Mixtures & Separation' },
      { grade: 'Lớp 7', topicVi: 'Nguyên tử · Bảng tuần hoàn sơ khai · Hóa trị', topicEn: 'Atomic Shell · Periodic Basics · Valence' },
      { grade: 'Lớp 8', topicVi: 'Mol & Bảo toàn khối lượng · Nồng độ · pH · Oxit/Axit', topicEn: 'Moles · Mass Conservation · pH & Acids/Bases' },
      { grade: 'Lớp 9', topicVi: 'Dãy hoạt động kim loại · Phi kim & Hidrocacbon sơ khai', topicEn: 'Reactivity Series · Inorganic Classes & Organics' },
      { grade: 'Lớp 10', topicVi: 'Cấu tạo Orbital · VSEPR · Oxi hóa–Khử · Enthalpy', topicEn: 'Orbitals · VSEPR · Redox & Enthalpy' },
      { grade: 'Lớp 11', topicVi: 'Cân bằng Le Chatelier · Chuẩn độ pH · Hữu cơ N/O', topicEn: 'Equilibrium · Titration · Organic Functional Groups' },
      { grade: 'Lớp 12', topicVi: 'Ester–Lipid · Carbohydrate · Pin Galvani & Điện phân', topicEn: 'Esters · Polymers · Electrochemistry' }
    ]
  },
  biology: {
    labelVi: 'Sinh học',
    labelEn: 'Biology',
    accentText: 'text-teal-700 dark:text-teal-300',
    activeBtn: 'bg-teal-600 text-white border-teal-600',
    chain: [
      { grade: 'Lớp 6', topicVi: 'Kính hiển vi · Tế bào nhân sơ/thực · 5 Giới sinh vật', topicEn: 'Microscopy · Prokaryotic/Eukaryotic Cells' },
      { grade: 'Lớp 7', topicVi: 'Quang hợp – Hô hấp · Mạch gỗ/rây · Cảm ứng thực vật', topicEn: 'Photosynthesis · Xylem/Phloem · Tropisms' },
      { grade: 'Lớp 8', topicVi: 'Tuần hoàn, Hô hấp, Thần kinh người & Hệ sinh thái', topicEn: 'Human Physiology · Food Webs & Ecology' },
      { grade: 'Lớp 9', topicVi: 'ADN/ARN · Nguyên phân – Giảm phân · Quy luật Menđen', topicEn: 'DNA/RNA · Cell Division · Mendel Laws' },
      { grade: 'Lớp 10', topicVi: 'Bào quan tế bào · Thẩm thấu màng · Enzyme & ATP', topicEn: 'Organelles · Osmosis · Enzymes & ATP' },
      { grade: 'Lớp 11', topicVi: 'Sinh lí thực vật · Chu kì tim · Điện thế nơ-ron & Miễn dịch', topicEn: 'Plant Water Flow · Cardiac & Neural Action' },
      { grade: 'Lớp 12', topicVi: 'Operon Lac · Đột biến NST · Hardy–Weinberg & Tiến hóa', topicEn: 'Molecular Genetics · Hardy–Weinberg & Evolution' }
    ]
  }
};

export const AcademicCredibilityCover: React.FC<AcademicCredibilityCoverProps> = ({
  onOpenAuthors,
  onOpenRoadmap,
  onSelectGrade,
  onNavigate
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeThread, setActiveThread] = useState<ContinuityKey>('math');

  const thread = CONTINUITY_THREADS[activeThread];

  return (
    <section
      id="academic-cover-sheet"
      aria-label={isEn ? 'Academic Orientation and Verification Cover Sheet' : 'Tờ đầu Định hướng học thuật và Kiểm chứng kiến thức'}
      className="credibility-cover-frame sci-frame relative rounded bg-white/92 dark:bg-slate-900/86 backdrop-blur-md border border-slate-200/95 dark:border-sky-500/25 p-5 sm:p-7 shadow-sm space-y-6"
    >
      {/* Top Document Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-blue-700 dark:text-sky-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Cover Sheet · Curriculum Credibility & Orientation' : 'Tờ Đầu Hồ Sơ Học Thuật · Định Hướng & Kiểm Chứng Kiến Thức'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{isEn ? 'Grades 6 → 12 Vertical Track' : 'Liên thông Lớp 6 → 12'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              {isEn ? 'Spearhead: Math – Physics – CS' : 'Mũi nhọn: Toán – Lý – Tin'}
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight text-balance">
            {isEn
              ? 'Built by Ben Tre Secondary Students (9/4), Verified Against Official National Syllabi (Grades 6–12)'
              : 'Mục Đích Trọng Tâm, Nguồn Kiểm Chứng Chuẩn Xác & Mạch Liên Thông Lớp 6 → 12'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'Designed for two clear learner paths: middle-school students (Grades 6–9) mastering core intuition and Olympiad depth early, and high-school students (Grades 10–12) consolidating, reviewing, and testing concepts through interactive 2D/3D simulations.'
              : 'Nền tảng tập trung phục vụ hai đối tượng rõ ràng: học sinh THCS (Lớp 6–9) học chắc bản chất và mở rộng tư duy nâng cao; học sinh THPT (Lớp 10–12) ôn tập, củng cố hệ thống kiến thức và kiểm chứng trực quan bằng mô phỏng 2D/3D.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            data-ripple="true"
            onClick={onOpenAuthors}
            className="grade-toc-btn px-3.5 py-2 rounded border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-slate-800/80 hover:border-blue-600 text-xs font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0" />
            <span>{isEn ? 'Team & Advisor Profile' : 'Hồ sơ Nhóm 9/4 & GVHD'}</span>
          </button>
          <button
            type="button"
            data-ripple="true"
            onClick={onOpenRoadmap}
            className="grade-toc-btn px-3.5 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <GitBranch className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Open 6→12 Roadmap' : 'Xem Lộ Trình 6 → 12'}</span>
          </button>
        </div>
      </div>

      {/* 3 Credibility Pillars: Target Audience, Spearhead Toán-Lý-Tin, Verification & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pillar 1: Purpose & Learners */}
        <div className="p-4 rounded bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/85 dark:border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-sky-300">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>{isEn ? '01. Target Learners & Purpose' : '01. Đối Tượng & Mục Đích Trọng Tâm'}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <li>
              <strong className="text-slate-900 dark:text-white">THCS (Lớp 6 – 9):</strong>{' '}
              {isEn
                ? 'Build solid intuition with simple everyday explanations and explore advanced problem-solving.'
                : 'Học kiến thức nền tảng cực kì dễ hiểu, trực quan và làm quen các dạng toán – lí nâng cao sớm.'}
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">THPT (Lớp 10 – 12):</strong>{' '}
              {isEn
                ? 'Review, consolidate core formulas (GDPT 2018 & 2006) and practice with live 2D/3D labs.'
                : 'Ôn tập, củng cố hệ thống công thức (cả GDPT 2018 & 2006) và kiểm chứng bằng mô phỏng 2D/3D.'}
            </li>
          </ul>
        </div>

        {/* Pillar 2: Verification Team & Advisor */}
        <div className="p-4 rounded bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/85 dark:border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <BookCheck className="w-4 h-4 shrink-0" />
            <span>{isEn ? '02. Content Verification Team' : '02. Người Tham Gia Kiểm Chứng Nội Dung'}</span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
            <p>
              <strong className="text-slate-900 dark:text-white">Nhóm 5 HS lớp 9/4 · Trường THCS Bến Tre:</strong>{' '}
              Bùi Tấn Hưng (Nhóm trưởng), Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân, Nguyễn Hoàng Long.
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Giáo viên hướng dẫn:</strong> Khung cố vấn chuyên môn THCS–THPT đang để mở cập nhật trực tiếp cùng đội ngũ giáo viên bộ môn.
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Nguồn đối chiếu:</strong> SGK GDPT 2018 (Kết nối tri thức, Chân trời sáng tạo, Cánh diều), SGK GDPT 2006 Bộ GD&amp;ĐT, Chuyên đề HSG &amp; VNOI Wiki.
            </p>
          </div>
        </div>

        {/* Pillar 3: Spearhead Toán - Lý - Tin */}
        <div className="p-4 rounded bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/85 dark:border-white/10 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <Target className="w-4 h-4 shrink-0" />
              <span>{isEn ? '03. Spearhead: Math · Physics · CS' : '03. Mũi Nhọn Đội Tuyển: Toán – Lý – Tin'}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'While covering Math, Physics, Chemistry, and Biology across Grades 6–12, Synapse channels core Physics–CS team strengths into Mathematical modeling, interactive Physics labs, and a separate CS & Algorithm track.'
                : 'Mỗi khối 6–12 đều có đủ 4 môn Toán · Lí · Hóa · Sinh; trong đó tổ hợp Toán – Lý – Tin là mũi nhọn chiều sâu, với môn Tin học tách riêng lộ trình thuật toán độc lập.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigate('math')}
              className="grade-toc-btn px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3 h-3 shrink-0" />
              <span>Toán học</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('physics')}
              className="grade-toc-btn px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3 h-3 shrink-0" />
              <span>Vật lí</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('cs')}
              className="grade-toc-btn px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Code2 className="w-3 h-3 shrink-0" />
              <span>Tin học (Tách riêng)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Knowledge Continuity 6 -> 12 Interactive Bar */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>
                {isEn
                  ? 'Vertical Knowledge Thread (Grades 6 → 12) — Click any grade to jump to its lectures'
                  : 'Mạch Liên Thông Kiến Thức Từ Lớp 6 → Lớp 12 (Bấm từng khối để mở ngay mục lục khối đó)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Switch subjects to see how middle-school foundations connect cleanly into high-school mastery.'
                : 'Chọn môn học để xem kiến thức THCS (6–9) nối mạch trực tiếp lên THPT (10–12) như thế nào.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {(
              [
                { id: 'math' as ContinuityKey, icon: Compass },
                { id: 'physics' as ContinuityKey, icon: Zap },
                { id: 'chemistry' as ContinuityKey, icon: FlaskConical },
                { id: 'biology' as ContinuityKey, icon: Dna }
              ] as const
            ).map((item) => {
              const cfg = CONTINUITY_THREADS[item.id];
              const Icon = item.icon;
              const isActive = activeThread === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveThread(item.id)}
                  className={`grade-toc-btn px-2.5 py-1.5 rounded border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                    isActive
                      ? cfg.activeBtn
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? cfg.labelEn : cfg.labelVi}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {thread.chain.map((step, idx) => (
            <button
              key={step.grade}
              type="button"
              data-ripple="true"
              onClick={() => onSelectGrade(step.grade)}
              className="grade-toc-btn group text-left p-2.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/85 dark:border-white/10 hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`font-mono text-[11px] font-bold tabular-nums ${thread.accentText}`}>
                  {step.grade}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                  {idx < 4 ? 'THCS' : 'THPT'}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-700 dark:text-slate-200 leading-snug line-clamp-3">
                {isEn ? step.topicEn : step.topicVi}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-sky-400 inline-flex items-center gap-1">
                <span>{isEn ? 'Jump' : 'Xem khối'}</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
