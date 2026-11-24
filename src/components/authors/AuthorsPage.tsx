import React, { useEffect, useState } from 'react';
import { ArrowLeft, Compass, RotateCcw, Upload } from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollProgressBar, ScrollReveal } from '../common/ScrollReveal';

interface AuthorsPageProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onReturnToLanding?: () => void;
}

interface AuthorMemberDef {
  id: string;
  fullName: string;
  roleVi: string;
  roleEn: string;
  focusVi: string;
  focusEn: string;
  silhouetteVariant: number;
}

const AUTHOR_MEMBERS: AuthorMemberDef[] = [
  {
    id: 'bui_tan_hung',
    fullName: 'Bùi Tấn Hưng',
    roleVi: 'Nhóm trưởng · Thành viên phát triển',
    roleEn: 'Team Leader · Core Developer',
    focusVi: 'Kiến trúc hệ thống · Mô phỏng Toán - Tin & Trải nghiệm AI',
    focusEn: 'System Architecture · Math/CS Simulations & AI Integration',
    silhouetteVariant: 0
  },
  {
    id: 'huynh_thi_quyen_nhu',
    fullName: 'Huỳnh Thị Quyên Như',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Nội dung học thuật · Biên tập bài giảng & Trải nghiệm người học',
    focusEn: 'Academic Content · Lecture Design & Learner Experience',
    silhouetteVariant: 1
  },
  {
    id: 'vo_anh_kiet',
    fullName: 'Võ Anh Kiệt',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Mô phỏng Vật lí 2D/3D · Dụng cụ đo trực quan & Kiểm thử',
    focusEn: 'Physics 2D/3D Labs · Measurement Apparatus & QA Testing',
    silhouetteVariant: 2
  },
  {
    id: 'le_thien_nhan',
    fullName: 'Lê Thiện Nhân',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Thuật toán & Lập trình · Truy vết code từng dòng & Đấu trường',
    focusEn: 'Algorithms & Code · Line-by-Line Execution Trace & Arena',
    silhouetteVariant: 3
  },
  {
    id: 'nguyen_hoang_long',
    fullName: 'Nguyễn Hoàng Long',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Giao diện 3D & Hoạt ảnh · Dựng cảnh trực quan & Trình diễn sản phẩm',
    focusEn: '3D Visuals & Motion · Scene Choreography & Product Showcase',
    silhouetteVariant: 4
  }
];

/**
 * Full-black standing silhouette with arms crossed over chest,
 * angled/leaning slightly toward the left side of the portrait frame.
 */
const CrossedArmsLeftSilhouette: React.FC<{ variant: number }> = ({ variant }) => {
  // Subtle height/shoulder posture variation across the 5 standing students
  const shoulderScale = variant === 1 ? 0.94 : variant === 2 ? 1.02 : 1.0;
  const headTilt = variant % 2 === 0 ? -3 : -2;

  return (
    <svg
      viewBox="0 0 240 310"
      className="w-full h-full select-none"
      role="img"
      aria-label="Bóng dáng đứng khoanh tay nghiêng người sang trái"
    >
      {/* Subtle floor ground shadow */}
      <ellipse cx="118" cy="296" rx="58" ry="8" fill="#0f172a" opacity="0.16" />

      {/* Solid full-black figure turned/leaning left with crossed arms */}
      <g
        fill="#05070b"
        transform={`translate(120 160) rotate(-3) scale(${shoulderScale} 1) translate(-120 -160)`}
      >
        {/* Head turned slightly left (3/4 left profile contour) */}
        <path
          transform={`rotate(${headTilt} 114 58)`}
          d="M 114 24
             C 98 24, 87 36, 87 54
             C 87 63, 89 70, 91 75
             L 88 79
             C 90 81, 93 83, 95 86
             C 98 92, 104 95, 113 95
             C 127 95, 138 83, 138 62
             C 138 38, 128 24, 114 24 Z"
        />

        {/* Neck */}
        <path d="M 103 88 L 128 90 L 129 112 L 99 112 Z" />

        {/* Torso + Left-angled shoulders + Crossed arms silhouette */}
        <path
          d="M 99 108
             C 83 111, 69 118, 63 130
             C 55 147, 52 170, 56 188
             C 58 197, 65 203, 74 205
             L 72 294
             L 106 294
             L 111 226
             L 120 294
             L 154 294
             L 156 204
             C 167 201, 175 193, 177 182
             C 181 164, 177 142, 169 126
             C 162 114, 146 109, 128 108
             Z"
        />

        {/* Distinct crossed-arms forearm & elbow bulge projecting slightly left */}
        <path
          d="M 55 150
             C 48 164, 48 184, 58 196
             C 71 210, 108 214, 149 208
             C 168 205, 181 195, 182 179
             C 183 165, 176 152, 166 146
             C 156 140, 142 146, 120 148
             C 94 150, 72 143, 55 150 Z"
        />

        {/* Folded hand/cuff edge detail at the left forearm fold */}
        <path
          d="M 61 171
             C 69 167, 89 169, 114 172
             C 138 175, 159 172, 172 167"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export const AuthorsPage: React.FC<AuthorsPageProps> = ({
  onBack,
  onNavigateSubject,
  onReturnToLanding
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() => {
    const loaded: Record<string, string> = {};
    try {
      AUTHOR_MEMBERS.forEach((m) => {
        const saved = localStorage.getItem(`synapse_author_photo_v1_${m.id}`);
        if (saved) loaded[m.id] = saved;
      });
    } catch {}
    return loaded;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handlePhotoUpload = (memberId: string, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      setCustomPhotos((prev) => ({ ...prev, [memberId]: dataUrl }));
      try {
        localStorage.setItem(`synapse_author_photo_v1_${memberId}`, dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (memberId: string) => {
    setCustomPhotos((prev) => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });
    try {
      localStorage.removeItem(`synapse_author_photo_v1_${memberId}`);
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto space-y-14 pb-20">
      <ScrollProgressBar />

      {/* Top Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
          </button>

          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-400 cursor-pointer whitespace-nowrap"
            >
              <span>{isEn ? 'Welcome Page' : 'Trang chào mừng'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateSubject('guide')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <Compass className="w-4 h-4" />
          <span>{isEn ? 'Open Interactive Guide' : 'Xem Hướng dẫn sử dụng'}</span>
        </button>
      </div>

      {/* Editorial Team Intro Hero */}
      <section className="space-y-5 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{isEn ? 'Author Collective' : 'Nhóm tác giả thực hiện'}</span>
          <span aria-hidden="true">·</span>
          <span>{isEn ? 'Class 9/4' : 'Lớp 9/4'}</span>
          <span aria-hidden="true">·</span>
          <span>{isEn ? 'Ben Tre Secondary School, Vietnam' : 'Trường THCS Bến Tre, Việt Nam'}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.14] text-balance">
          {isEn
            ? 'Five Grade 9/4 Students Building Visual STEM Learning Tools'
            : 'Nhóm 5 Học sinh Lớp 9/4 · Trường THCS Bến Tre, Việt Nam'}
        </h1>

        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
          {isEn
            ? 'We are a team of 5 students — Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân, and Nguyễn Hoàng Long — from Class 9/4, Ben Tre Secondary School, Vietnam. We built Synapse to turn abstract Mathematics, Physics, and Informatics concepts into interactive experiments and visual explanations.'
            : 'Chúng tôi là nhóm 5 học sinh: Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân, Nguyễn Hoàng Long đến từ lớp 9/4, trường THCS Bến Tre, Việt Nam. Với niềm yêu thích Toán học, Vật lí và Tin học, nhóm cùng nhau xây dựng Synapse để giúp việc học trở nên trực quan, dễ hình dung và giàu tương tác hơn.'}
        </p>
      </section>

      {/* 5-Member Portrait Row (Silhouette defaults + Real Name directly below portrait) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            {isEn ? 'Team Members' : 'Thành viên nhóm tác giả'}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Official portraits will be uploaded soon (hover a card to preview your own photo)'
              : 'Ảnh chân dung thật sẽ được cập nhật sau (có thể di chuột vào từng khung để tải ảnh thử)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {AUTHOR_MEMBERS.map((member, idx) => {
            const customUrl = customPhotos[member.id];
            return (
              <ScrollReveal key={member.id} direction="up" delay={idx * 0.08}>
                <article className="group h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                  {/* Portrait Frame: Light Studio Pedestal so pure black silhouette is razor sharp */}
                  <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 dark:from-slate-200 dark:to-slate-300 overflow-hidden flex items-end justify-center pt-4">
                    {customUrl ? (
                      <img
                        src={customUrl}
                        alt={member.fullName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <CrossedArmsLeftSilhouette variant={member.silhouetteVariant} />
                    )}

                    {/* Subtle hover action to upload/reset real photo */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <label className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/85 hover:bg-slate-950 text-white text-[10px] font-semibold cursor-pointer shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>{isEn ? 'Upload' : 'Tải ảnh'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handlePhotoUpload(member.id, e.target.files?.[0])}
                        />
                      </label>
                      {customUrl && (
                        <button
                          type="button"
                          onClick={() => handleResetPhoto(member.id)}
                          className="p-1 rounded-md bg-white/90 hover:bg-white text-slate-900 shadow-sm cursor-pointer"
                          title={isEn ? 'Restore black silhouette' : 'Khôi phục bóng đen'}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real Name Placed Immediately Under Image */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-2 bg-white dark:bg-slate-900">
                    <div className="space-y-1">
                      <h3 className="font-display text-base sm:text-[17px] font-semibold text-slate-900 dark:text-white leading-snug">
                        {member.fullName}
                      </h3>
                      <div className="text-[11px] font-medium text-sky-700 dark:text-sky-400">
                        {isEn ? member.roleEn : member.roleVi}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isEn ? member.focusEn : member.focusVi}
                      </p>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {isEn ? 'Class 9/4 · Ben Tre Secondary School' : 'Lớp 9/4 · THCS Bến Tre'}
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Scroll-Reveal Team Leader's Message & Project Story */}
      <ScrollReveal direction="up" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
            {isEn ? 'Message from Team Leader · Bùi Tấn Hưng' : 'Lời chia sẻ từ Nhóm trưởng · Bùi Tấn Hưng'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
            {isEn
              ? 'From Grade 9/4 Classroom Questions to a Browser STEM Laboratory'
              : 'Từ những giờ học lớp 9/4 đến phòng thí nghiệm STEM trên trình duyệt'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
            {isEn
              ? 'Written on behalf of the five Class 9/4 students at Ben Tre Secondary School, Vietnam.'
              : 'Thay mặt nhóm 5 học sinh lớp 9/4, trường THCS Bến Tre, Việt Nam.'}
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
          {isEn ? (
            <>
              <p>
                “During our regular lessons at Ben Tre Secondary School, my teammates and I noticed a shared difficulty among many classmates: when facing moving coordinate graphs, refracting rays through lenses, electrical circuits, or how an algorithm mutates variables step by step inside a loop, static blackboard sketches often make simple ideas feel unnecessarily abstract.
              </p>
              <p>
                Not every student has physics instruments at home or a mentor sitting beside them late at night to pause and explain a single line of code. That realization sparked our decision as five Class 9/4 friends—Quyên Như, Anh Kiệt, Thiện Nhân, Hoàng Long, and myself—to build Synapse together, turning dry textbook exercises into a living lab right inside the browser.
              </p>
              <p>
                With Synapse, learners can freely drag parameters, rotate 2D/3D apparatuses modeled after real lab tools, listen to Vietnamese voice lectures, watch intuitive 3Blue1Brown-style motion reels, and pause at any simulation step to ask the AI why a value or state changed. Our biggest hope is that Synapse sparks curiosity and helps every friend discover the true beauty behind Mathematics, Physics, and Computer Science.”
              </p>
            </>
          ) : (
            <>
              <p>
                “Trong suốt quá trình học tập tại trường THCS Bến Tre, mình cùng các bạn trong nhóm nhận ra một điều rất quen thuộc: nhiều bạn rất chăm chỉ nhưng vẫn gặp lúng túng khi phải tưởng tượng đồ thị chuyển động ra sao khi đổi tham số, đường đi của chùm tia sáng qua thấu kính thay đổi thế nào, mạch điện vận hành ra sao hay thuật toán chạy từng bước bên trong vòng lặp nếu chỉ nhìn trên hình vẽ tĩnh trong sách giáo khoa.
              </p>
              <p>
                Không phải lúc nào học sinh cũng có đầy đủ bộ dụng cụ thí nghiệm Vật lí ở nhà hay có người ngồi cạnh để hỏi ngay khoảnh khắc bị vướng ở một dòng code. Chính từ trăn trở đó, năm đứa tụi mình ở lớp 9/4 gồm Quyên Như, Anh Kiệt, Thiện Nhân, Hoàng Long và mình đã cùng nhau góp ý tưởng, thiết kế nội dung và xây dựng Synapse như một phòng thí nghiệm mở ngay trên trình duyệt.
              </p>
              <p>
                Ở đây, bất kỳ bạn học sinh nào cũng có thể tự tay kéo thanh thông số, thao tác trên dụng cụ đo gần gũi như ngoài đời thật, xoay mô hình 2D/3D ở mọi góc nhìn, nghe lời giảng tiếng Việt rõ ràng, xem video minh họa chuyển động kiểu 3B1B và bấm dừng mô phỏng để hỏi AI ngay tại bước đang thắc mắc. Nhóm trưởng và cả nhóm tụi mình hy vọng Synapse sẽ trở thành người bạn đồng hành tin cậy, giúp các bạn thấy Toán, Vật lí và Tin học gần gũi, dễ hiểu và thú vị hơn mỗi ngày.”
              </p>
            </>
          )}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
            <span className="font-display font-semibold text-slate-900 dark:text-white">
              {isEn ? '— Bùi Tấn Hưng, Team Leader (Class 9/4)' : '— Bùi Tấn Hưng · Nhóm trưởng nhóm phát triển (Lớp 9/4)'}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {isEn ? 'Ben Tre Secondary School, Vietnam' : 'Trường THCS Bến Tre, Việt Nam'}
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Scroll-Reveal Three Core Values */}
      <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            num: '01',
            titleVi: 'Trực quan trước công thức',
            titleEn: 'Intuition Before Formulas',
            descVi:
              'Mọi khái niệm Toán, Vật lí và Tin học đều có hình vẽ động hoặc mô phỏng đi kèm để hiểu bản chất thay vì học thuộc máy móc.',
            descEn:
              'Every math, physics, and CS topic pairs interactive motion with equations so learners grasp intuition first.'
          },
          {
            num: '02',
            titleVi: 'Thực hành an toàn mọi lúc',
            titleEn: 'Safe Virtual Experimentation',
            descVi:
              'Cho phép thử nghiệm dụng cụ đo Vật lí, chạy mã C++/Python và xoay mô hình 3D trực tiếp ngay trên laptop hoặc điện thoại.',
            descEn:
              'Experiment with physics instruments, C++/Python traces, and 3D models right inside any browser.'
          },
          {
            num: '03',
            titleVi: 'Đồng hành từng bước tư duy',
            titleEn: 'Step-by-Step Guidance',
            descVi:
              'Từ giọng giảng tiếng Việt đến nút Dừng hỏi AI, hệ thống hỗ trợ người học tự tìm ra hướng giải quyết rõ ràng.',
            descEn:
              'From Vietnamese voice narration to step-level AI Q&A, learners get targeted guidance without clutter.'
          }
        ].map((val, idx) => (
          <ScrollReveal key={val.num} direction="up" delay={idx * 0.09}>
            <div className="h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
              <div className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {val.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {isEn ? val.titleEn : val.titleVi}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn ? val.descEn : val.descVi}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </ScrollReveal>
    </div>
  );
};
