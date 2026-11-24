import React, { useEffect, useState } from 'react';
import { ArrowLeft, Compass, ImagePlus, RotateCcw, Upload } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { PerformanceMode, useBackgroundTheme } from '../../context/BackgroundContext';
import { ScrollProgressBar } from '../common/ScrollReveal';

interface AuthorsPageProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onReturnToLanding?: () => void;
}

interface AuthorMemberDef {
  id: string;
  order: string;
  fullName: string;
  roleVi: string;
  roleEn: string;
  focusVi: string;
  focusEn: string;
  paragraphsVi: string[];
  paragraphsEn: string[];
  silhouetteVariant: number;
}

const ADVISOR_KEY = 'giao_vien_huong_dan';

const TEXT_HALO_CLASS =
  '[text-shadow:0_1px_10px_rgba(255,255,255,0.92),0_0_2px_rgba(255,255,255,0.85)] dark:[text-shadow:0_1px_12px_rgba(2,6,23,0.96),0_0_3px_rgba(2,6,23,0.9)]';

const AUTHOR_MEMBERS: AuthorMemberDef[] = [
  {
    id: 'bui_tan_hung',
    order: '01',
    fullName: 'Bùi Tấn Hưng',
    roleVi: 'Nhóm trưởng · Thành viên phát triển',
    roleEn: 'Team Leader · Core Developer',
    focusVi: 'Kiến trúc hệ thống · Mô phỏng Toán - Tin & Trải nghiệm AI',
    focusEn: 'System Architecture · Math/CS Simulations & AI Integration',
    silhouetteVariant: 0,
    paragraphsVi: [
      '“Ý tưởng về Synapse không bắt đầu từ một kế hoạch lớn lao, mà từ những buổi ra chơi và giờ tự học rất quen thuộc của tụi mình ở lớp 9/4, trường THCS Bến Tre. Tụi mình nhận ra nhiều bạn rất chăm chỉ làm bài tập nhưng vẫn hay khựng lại khi phải tưởng tượng đồ thị chuyển động ra sao lúc đổi tham số, đường đi của chùm tia sáng qua thấu kính thay đổi thế nào, mạch điện chia nhánh ra sao hay giá trị từng biến trong vòng lặp thay đổi ra sao nếu chỉ nhìn trên hình vẽ tĩnh trong sách giáo khoa.',
      'Từ trăn trở đó, năm đứa tụi mình ngồi lại phác thảo những trang giấy nháp đầu tiên: ước gì có một trang web mở thẳng trên trình duyệt, không cần cài đặt nặng nề, nơi bạn bè có thể tự tay kéo thanh trượt thông số, vặn biến trở, xoay mô hình 3D và nhìn thấy hiện tượng diễn ra ngay trước mắt. Quyên Như đảm nhận hệ thống hóa bài giảng cho thật mạch lạc, Anh Kiệt chăm chút mảng thuật toán và luồng truy vết code từng dòng cho môn Tin học, Thiện Nhân lo các mô phỏng Vật lí trực quan và dụng cụ đo, Hoàng Long dựng chuyển động và không gian 3D, còn mình phụ trách nối ghép kiến trúc tổng thể và tích hợp trợ lý AI.',
      'Tên trang web được tụi mình chọn là “Synapse” — lấy cảm hứng từ khớp thần kinh (synapse) trong sinh học, nơi các tín hiệu đi qua để đánh thức suy nghĩ và khơi nguồn nhận thức. Với tụi mình, cái tên Synapse mang hai ý nghĩa rất rõ: thứ nhất, đây là điểm chạm kết nối giữa công thức khô khan trên trang giấy với hình ảnh chuyển động, thí nghiệm 2D/3D và giọng giảng gần gũi; thứ hai, Synapse là cầu nối giữa sự tò mò của học sinh với niềm vui tự khám phá—chỉ cần một “tia tín hiệu” trực quan đúng lúc, người học sẽ tự bật ra sự thấu hiểu (“à, hóa ra là vậy!”) thay vì học thuộc lòng máy móc.',
      'Hành trình biến bản vẽ nháp thành một website chạy mượt thật sự không hề dễ dàng: tụi mình vừa học thêm về đồ họa web, vừa thử nghiệm hàng chục phiên bản mô phỏng 2D/3D WebGL, sửa từng lỗi công thức toán học, cân chỉnh lại từng thí nghiệm Vật lí và tối ưu bộ nhớ để máy tính ở phòng Tin học trường hay điện thoại cấu hình vừa cũng mở lên nhanh chóng. Có những tối cả nhóm cùng ngồi rà lại hàng trăm bài giảng, bổ sung giọng đọc tiếng Việt, video minh họa kiểu 3B1B, chế độ WebAR chiếu lên bàn học và phòng học nhóm trực tuyến.',
      'Nhìn lại chặng đường đã qua, điều tụi mình tự hào nhất không chỉ là các tính năng kỹ thuật, mà là khoảnh khắc thấy các bạn cùng lớp bấm thử một thí nghiệm rồi reo lên vì chợt hiểu bản chất vấn đề. Nhóm trưởng và cả năm thành viên lớp 9/4 hy vọng cái tên Synapse sẽ tiếp tục là người bạn đồng hành tin cậy, kết nối tri thức Toán, Vật lí và Tin học đến gần hơn với mỗi học sinh mỗi ngày.”'
    ],
    paragraphsEn: [
      '“The idea for Synapse did not start as a grand master plan—it grew out of everyday study sessions and classroom conversations in Class 9/4 at Ben Tre Secondary School. My teammates and I noticed how often hardworking classmates get stuck trying to picture how a coordinate graph shifts with new parameters, how light rays bend through a lens, how current splits across branches, or how variables mutate inside a loop when all they have is a static textbook diagram.',
      'That shared question pushed the five of us to sketch our very first wireframes on scrap paper: what if any student could open a browser—with zero heavy installation—and immediately drag sliders, turn virtual rheostats, rotate 3D models, and watch laws of nature unfold in real time? Quyên Như structured the curriculum flow, Anh Kiệt crafted algorithms and line-by-line code tracing for Informatics, Thiện Nhân shaped the hands-on Physics instruments, Hoàng Long refined 3D scenes and motion, while I connected the core web architecture and AI step-level tutor.',
      'We named the platform “Synapse” after the biological junction that bridges neurons and sparks thought. For our team, the name Synapse carries two layered meanings: first, it serves as the living bridge connecting abstract textbook equations with interactive 2D/3D experiments and clear visual intuition; second, it connects a student’s curiosity with that genuine moment of insight—one well-timed visual signal that turns memorization into real understanding.',
      'Turning those sketches into a fast, reliable web application took months of trial, late-night debugging, and steady learning. Together we built and tuned 2D/3D WebGL laboratories, audited every math equation and physics formula, optimized performance so modest school computers run smoothly, and gradually added Vietnamese voice narration, 3Blue1Brown-style motion reels, WebAR desk projection, and collaborative study rooms.',
      'Looking back on our journey from rough notes to a complete interactive classroom, what makes us proudest is seeing classmates try an experiment and immediately grasp why a formula works. We hope Synapse stays true to its name—sparking meaningful connections across Mathematics, Physics, and Computer Science for every learner.”'
    ]
  },
  {
    id: 'huynh_thi_quyen_nhu',
    order: '02',
    fullName: 'Huỳnh Thị Quyên Như',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Nội dung học thuật · Biên tập bài giảng & Trải nghiệm người học',
    focusEn: 'Academic Content · Lecture Design & Learner Experience',
    silhouetteVariant: 1,
    paragraphsVi: [
      '“Khi tham gia biên tập hệ thống bài giảng Toán, Vật lí và Tin học cho Synapse, điều mình quan tâm nhất là giữ được sự mạch lạc của kiến thức sách giáo khoa nhưng diễn đạt lại theo cách gần gũi, dễ theo dõi từng ý. Mỗi bài học đều được nhóm rà soát lại định lí, ví dụ minh họa và câu hỏi kiểm tra để các bạn tự học ở nhà không bị ngợp trước những công thức dài.”'
    ],
    paragraphsEn: [
      '“While structuring the Math, Physics, and Informatics lessons in Synapse, my main focus has been keeping textbook accuracy intact while rewriting explanations in a calm, step-by-step voice. Our team carefully checks theorems, worked examples, and review prompts so students studying alone never feel overwhelmed by dense formulas.”'
    ]
  },
  {
    id: 'vo_anh_kiet',
    order: '03',
    fullName: 'Võ Anh Kiệt',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Thuật toán & Lập trình · Truy vết code từng dòng & Đấu trường',
    focusEn: 'Algorithms & Code · Line-by-Line Execution Trace & Arena',
    silhouetteVariant: 2,
    paragraphsVi: [
      '“Với môn Tin học, rào cản lớn nhất của người mới bắt đầu thường là không thấy được biến và mảng đang thay đổi như thế nào sau mỗi vòng lặp. Mình phụ trách phần bài tập thực hành, bộ test kiểm tra và luồng truy vết code từng dòng để các bạn có thể chạy thử C++/Python trực tiếp, quan sát từng bước thực thi và rèn tư duy giải thuật vững vàng hơn.”'
    ],
    paragraphsEn: [
      '“In Informatics, beginners often get stuck because they cannot see how variables and arrays mutate inside each loop iteration. I focus on coding exercises, test suites, and line-by-line execution tracing so learners can run C++/Python directly, inspect every step, and build steady algorithmic intuition.”'
    ]
  },
  {
    id: 'le_thien_nhan',
    order: '04',
    fullName: 'Lê Thiện Nhân',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Mô phỏng Vật lí 2D/3D · Dụng cụ đo trực quan & Kiểm thử',
    focusEn: 'Physics 2D/3D Labs · Measurement Apparatus & QA Testing',
    silhouetteVariant: 3,
    paragraphsVi: [
      '“Phần mình dành nhiều tâm huyết nhất là các mô hình thí nghiệm Vật lí 2D và 3D—từ mạch điện, thấu kính quang học cho đến cơ học và điện từ. Thay vì chỉ đọc kết quả có sẵn, người học có thể tự điều chỉnh điện trở, tiêu cự hay góc nghiêng trên dụng cụ đo mô phỏng, kiểm chứng từng số liệu thực nghiệm và tự rút ra quy luật cho riêng mình.”'
    ],
    paragraphsEn: [
      '“What excites me most in Synapse is crafting the 2D and 3D Physics experiments—from electrical circuits and optical lenses to mechanics and electromagnetism. Instead of memorizing static answers, learners can adjust resistance, focal length, or incline angle on realistic virtual instruments and verify physical laws firsthand.”'
    ]
  },
  {
    id: 'nguyen_hoang_long',
    order: '05',
    fullName: 'Nguyễn Hoàng Long',
    roleVi: 'Thành viên nhóm phát triển',
    roleEn: 'Core Team Member',
    focusVi: 'Giao diện 3D & Hoạt ảnh · Dựng cảnh trực quan & Trình diễn sản phẩm',
    focusEn: '3D Visuals & Motion · Scene Choreography & Product Showcase',
    silhouetteVariant: 4,
    paragraphsVi: [
      '“Mình phụ trách tinh chỉnh chuyển động hình ảnh, bố cục không gian 3D và cách trình bày trực quan để mỗi mô phỏng khi mở lên đều mượt mà, rõ ràng trên cả máy tính lẫn điện thoại. Nhóm tụi mình tin rằng khi giao diện đủ gọn gàng và chuyển cảnh có nhịp điệu hợp lí, người học sẽ tập trung trọn vẹn vào ý tưởng khoa học phía sau bài học.”'
    ],
    paragraphsEn: [
      '“I focus on visual motion, 3D scene framing, and layout clarity so every simulation feels smooth and legible across both desktop and mobile screens. Our team believes that when the interface stays uncluttered and transitions are thoughtfully paced, learners can focus completely on the scientific ideas behind each lesson.”'
    ]
  }
];

/**
 * Full-black standing silhouette with arms crossed over chest,
 * angled/leaning slightly toward the left side of the portrait frame.
 */
const CrossedArmsLeftSilhouette: React.FC<{ variant: number }> = ({ variant }) => {
  const shoulderScale = variant === 1 ? 0.94 : variant === 2 ? 1.02 : 1.0;
  const headTilt = variant % 2 === 0 ? -3 : -2;

  return (
    <svg
      viewBox="0 0 240 310"
      className="w-full h-full select-none"
      role="img"
      aria-label="Bóng dáng đứng khoanh tay nghiêng người sang trái"
    >
      <ellipse cx="118" cy="296" rx="58" ry="8" fill="#0f172a" opacity="0.16" />

      <g
        fill="#05070b"
        transform={`translate(120 160) rotate(-3) scale(${shoulderScale} 1) translate(-120 -160)`}
      >
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

        <path d="M 103 88 L 128 90 L 129 112 L 99 112 Z" />

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

        <path
          d="M 55 150
             C 48 164, 48 184, 58 196
             C 71 210, 108 214, 149 208
             C 168 205, 181 195, 182 179
             C 183 165, 176 152, 166 146
             C 156 140, 142 146, 120 148
             C 94 150, 72 143, 55 150 Z"
        />

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

interface TieredBlockProps {
  children: React.ReactNode;
  perfMode: PerformanceMode;
  delay?: number;
  className?: string;
}

const TieredScrollBlock: React.FC<TieredBlockProps> = ({
  children,
  perfMode,
  delay = 0,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <article className={`group relative ${className}`}>{children}</article>;
  }

  // Tier 1: Low Graphics ('smooth') — lightweight quick opacity + short settle
  if (perfMode === 'smooth') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.26, delay: Math.min(delay, 0.06), ease: [0.16, 1, 0.3, 1] }}
        className={`group relative ${className}`}
      >
        {children}
      </motion.article>
    );
  }

  // Tier 2: Medium Graphics ('balanced') — crisp scroll reveal
  if (perfMode === 'balanced') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 26, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.12, margin: '0px 0px -24px 0px' }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform, opacity' }}
        className={`group relative ${className}`}
      >
        {children}
      </motion.article>
    );
  }

  // Tier 3: Pro Graphics ('ultra') — sweeping 60 FPS entrance
  return (
    <motion.article
      initial={{ opacity: 0, y: 38, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -28px 0px' }}
      transition={{ duration: 0.66, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
      className={`group relative ${className}`}
    >
      {children}
    </motion.article>
  );
};

export const AuthorsPage: React.FC<AuthorsPageProps> = ({
  onBack,
  onNavigateSubject,
  onReturnToLanding
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();
  const prefersReducedMotion = useReducedMotion();

  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>(() => {
    const loaded: Record<string, string> = {};
    try {
      [ADVISOR_KEY, ...AUTHOR_MEMBERS.map((m) => m.id)].forEach((id) => {
        const saved = localStorage.getItem(`synapse_author_photo_v1_${id}`);
        if (saved) loaded[id] = saved;
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

  const advisorPhoto = customPhotos[ADVISOR_KEY];
  const animateColumns = !prefersReducedMotion && perfMode !== 'smooth';
  const leftOffset = perfMode === 'ultra' ? -24 : -14;
  const rightOffset = perfMode === 'ultra' ? 24 : 14;
  const colDuration = perfMode === 'ultra' ? 0.62 : 0.46;

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-3 space-y-16 pb-24">
      <ScrollProgressBar />

      {/* Top Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="cs-deck-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300/80 dark:border-white/20 bg-white/65 dark:bg-slate-950/60 backdrop-blur-sm text-xs font-semibold text-slate-900 dark:text-white hover:border-sky-500 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
          </button>

          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="cs-deck-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300/80 dark:border-white/20 bg-white/55 dark:bg-slate-950/50 backdrop-blur-sm text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-sky-500 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <span>{isEn ? 'Welcome Page' : 'Trang chào mừng'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateSubject('guide')}
          className="cs-deck-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors shadow-sm"
        >
          <Compass className="w-4 h-4" />
          <span>{isEn ? 'Open Interactive Guide' : 'Xem Hướng dẫn sử dụng'}</span>
        </button>
      </div>

      {/* Editorial Team Intro Hero — Directly on Open Canvas, Full Width */}
      <TieredScrollBlock perfMode={perfMode} delay={0}>
        <div className={`space-y-6 ${TEXT_HALO_CLASS}`}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
            <span>{isEn ? 'Author Collective' : 'Nhóm tác giả thực hiện'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Class 9/4' : 'Lớp 9/4'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Ben Tre Secondary School, Vietnam' : 'Trường THCS Bến Tre, Việt Nam'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            {isEn
              ? 'Five Grade 9/4 Students Turning Textbook Formulas into Living Experiments'
              : 'Nhóm 5 Học sinh Lớp 9/4 · Trường THCS Bến Tre, Việt Nam'}
          </h1>

          <div className="space-y-5 text-base sm:text-[17px] font-medium text-slate-900 dark:text-slate-100 leading-[1.8]">
            <p>
              {isEn
                ? 'We are five Class 9/4 classmates from Ben Tre Secondary School, Vietnam — Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân, and Nguyễn Hoàng Long — united by a shared curiosity for Mathematics, Physics, and Computer Science and a simple wish: that no student has to struggle with abstract equations alone.'
                : 'Chúng tôi là nhóm 5 người bạn cùng lớp 9/4 tại trường THCS Bến Tre, Việt Nam: Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân và Nguyễn Hoàng Long. Gặp nhau ở niềm say mê Toán học, Vật lí và Tin học, cả nhóm cùng chung một mong muốn giản dị: giúp các bạn học sinh không còn cảm thấy đơn độc hay bỡ ngỡ trước những công thức trừu tượng trên trang giấy.'}
            </p>
            <p>
              {isEn
                ? 'Instead of memorizing static diagrams, we built Synapse as an open learning studio right inside the browser — where every theorem moves before your eyes, every physical law can be tested by hand, and every line of code reveals how it thinks step by step.'
                : 'Thay vì học vẹt trên những hình vẽ bất động, tụi mình kiến tạo Synapse thành một phòng thí nghiệm mở ngay trên trình duyệt — nơi mọi định lí đều chuyển động trực quan, từng quy luật tự nhiên có thể tự tay kiểm chứng, và từng dòng thuật toán tự cất tiếng giải thích rõ ràng qua mỗi bước chạy.'}
            </p>
          </div>
        </div>
      </TieredScrollBlock>

      {/* Supervising Teacher Section (Blank Portrait Frame on Left, Open Text on Canvas Right) */}
      <section className="space-y-8">
        <div className={`flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-300/65 dark:border-white/15 pb-3 ${TEXT_HALO_CLASS}`}>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-950 dark:text-white">
            {isEn ? 'Supervising Teacher' : 'Giáo viên hướng dẫn'}
          </h2>
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {isEn
              ? 'Reserved open frame · Details to be added later'
              : 'Khung ảnh chừa trống · Thông tin sẽ được cập nhật sau'}
          </span>
        </div>

        <TieredScrollBlock perfMode={perfMode} delay={0.04} className="pb-12 border-b border-slate-300/45 dark:border-white/12">
          <div className="flex flex-col sm:flex-row items-start gap-8 md:gap-10">
            {/* Left: Blank Portrait Frame + Title Directly Beneath */}
            <motion.div
              initial={animateColumns ? { opacity: 0, x: leftOffset } : false}
              whileInView={animateColumns ? { opacity: 1, x: 0 } : undefined}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: colDuration, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="w-56 sm:w-64 lg:w-72 shrink-0 flex flex-col gap-3.5"
              style={animateColumns ? { willChange: 'transform, opacity' } : undefined}
            >
              <div className="relative aspect-[3/4] w-full rounded-xl border-2 border-dashed border-slate-400/80 dark:border-slate-500/80 bg-white/15 dark:bg-slate-900/20 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                {advisorPhoto ? (
                  <img
                    src={advisorPhoto}
                    alt={isEn ? 'Supervising Teacher' : 'Giáo viên hướng dẫn'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top absolute inset-0"
                  />
                ) : (
                  <div className={`flex flex-col items-center gap-2 text-slate-700 dark:text-slate-200 select-none ${TEXT_HALO_CLASS}`}>
                    <ImagePlus className="w-7 h-7 stroke-[1.6]" />
                    <span className="text-xs font-semibold leading-snug">
                      {isEn ? 'Portrait Reserved' : 'Khung ảnh chừa trống'}
                    </span>
                  </div>
                )}

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-semibold cursor-pointer shadow-sm">
                    <Upload className="w-3 h-3" />
                    <span>{isEn ? 'Upload' : 'Tải ảnh'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handlePhotoUpload(ADVISOR_KEY, e.target.files?.[0])}
                    />
                  </label>
                  {advisorPhoto && (
                    <button
                      type="button"
                      onClick={() => handleResetPhoto(ADVISOR_KEY)}
                      className="p-1 rounded-md bg-white/95 hover:bg-white text-slate-900 shadow-sm cursor-pointer"
                      title={isEn ? 'Clear photo' : 'Xóa ảnh đã tải'}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className={`space-y-0.5 ${TEXT_HALO_CLASS}`}>
                <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white leading-snug">
                  {isEn ? 'Supervising Teacher' : 'Giáo viên hướng dẫn'}
                </h3>
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {isEn ? 'Name pending · Ben Tre Secondary School' : 'Chưa cập nhật họ tên · THCS Bến Tre'}
                </div>
              </div>
            </motion.div>

            {/* Right: Open Note Directly on Background Canvas */}
            <motion.div
              initial={animateColumns ? { opacity: 0, x: rightOffset } : false}
              whileInView={animateColumns ? { opacity: 1, x: 0 } : undefined}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: colDuration, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex-1 min-w-0 flex flex-col justify-center gap-3 sm:pt-2 ${TEXT_HALO_CLASS}`}
              style={animateColumns ? { willChange: 'transform, opacity' } : undefined}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-300/50 dark:border-white/12">
                <span>{isEn ? 'Faculty Mentor' : 'Cố vấn chuyên môn'}</span>
                <span aria-hidden="true">·</span>
                <span>{isEn ? 'To be confirmed' : 'Đang chờ xác nhận'}</span>
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {isEn
                  ? 'This portrait slot and section are intentionally left open for our Supervising Teacher. Their photo, full name, and message will be updated here once confirmed.'
                  : 'Phần giới thiệu này được chừa trống dành riêng cho Giáo viên hướng dẫn đồng hành cùng nhóm. Ảnh chân dung, họ tên và lời nhắn sẽ được cập nhật chính thức sau khi xác nhận.'}
              </p>
            </motion.div>
          </div>
        </TieredScrollBlock>
      </section>

      {/* Team Members: Portrait + Name on Left, Full-Width Prose Directly on Canvas Right */}
      <section className="space-y-10">
        <div className={`flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-300/65 dark:border-white/15 pb-3 ${TEXT_HALO_CLASS}`}>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-950 dark:text-white">
            {isEn ? 'Team Members & Personal Notes' : 'Thành viên nhóm tác giả & Đôi lời chia sẻ'}
          </h2>
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
            {isEn
              ? 'Official portraits will be uploaded soon (hover a frame to preview)'
              : 'Ảnh chân dung thật sẽ cập nhật sau (di chuột vào khung ảnh để tải thử)'}
          </span>
        </div>

        <div className="space-y-14 sm:space-y-16">
          {AUTHOR_MEMBERS.map((member, idx) => {
            const customUrl = customPhotos[member.id];
            const paragraphs = isEn ? member.paragraphsEn : member.paragraphsVi;
            const rowDelay = perfMode === 'smooth' ? 0 : Math.min(idx * 0.04, 0.16);
            const isLast = idx === AUTHOR_MEMBERS.length - 1;

            return (
              <TieredScrollBlock
                key={member.id}
                perfMode={perfMode}
                delay={rowDelay}
                className={isLast ? '' : 'pb-12 sm:pb-14 border-b border-slate-300/45 dark:border-white/12'}
              >
                <div className="flex flex-col sm:flex-row items-start gap-8 md:gap-10">
                  {/* Left Side: Portrait Frame + Name & Role Directly Underneath */}
                  <motion.div
                    initial={animateColumns ? { opacity: 0, x: leftOffset } : false}
                    whileInView={animateColumns ? { opacity: 1, x: 0 } : undefined}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: colDuration, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="w-56 sm:w-64 lg:w-72 shrink-0 flex flex-col gap-3.5"
                    style={animateColumns ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div
                      className={`relative aspect-[3/4] w-full rounded-xl border border-slate-300/75 dark:border-white/20 bg-gradient-to-b from-slate-100/90 via-slate-100/85 to-slate-200/90 dark:from-slate-200/90 dark:to-slate-300/90 overflow-hidden flex items-end justify-center pt-4 shadow-sm ${
                        perfMode === 'ultra'
                          ? 'transition-transform duration-300 group-hover:scale-[1.02]'
                          : perfMode === 'balanced'
                          ? 'transition-transform duration-200 group-hover:-translate-y-0.5'
                          : ''
                      }`}
                    >
                      {customUrl ? (
                        <img
                          src={customUrl}
                          alt={member.fullName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top absolute inset-0"
                        />
                      ) : (
                        <CrossedArmsLeftSilhouette variant={member.silhouetteVariant} />
                      )}

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-semibold cursor-pointer shadow-sm">
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
                            className="p-1 rounded-md bg-white/95 hover:bg-white text-slate-900 shadow-sm cursor-pointer"
                            title={isEn ? 'Restore black silhouette' : 'Khôi phục bóng đen'}
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`space-y-0.5 ${TEXT_HALO_CLASS}`}>
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-950 dark:text-white leading-snug">
                        {member.fullName}
                      </h3>
                      <div className="text-xs font-semibold text-sky-800 dark:text-sky-300">
                        {isEn ? member.roleEn : member.roleVi}
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Side: Wide Flowing Paragraphs Directly on Background */}
                  <motion.div
                    initial={animateColumns ? { opacity: 0, x: rightOffset } : false}
                    whileInView={animateColumns ? { opacity: 1, x: 0 } : undefined}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: colDuration, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex-1 min-w-0 flex flex-col justify-start gap-5 sm:pt-1 ${TEXT_HALO_CLASS}`}
                    style={animateColumns ? { willChange: 'transform, opacity' } : undefined}
                  >
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pb-3 border-b border-slate-300/50 dark:border-white/12 text-xs">
                      <span className="font-mono font-bold text-sky-800 dark:text-sky-300 tabular-nums">
                        {member.order}
                      </span>
                      <span aria-hidden="true" className="text-slate-600 dark:text-slate-400">
                        ·
                      </span>
                      <span className="font-semibold text-slate-950 dark:text-white">
                        {isEn ? member.focusEn : member.focusVi}
                      </span>
                      <span aria-hidden="true" className="text-slate-600 dark:text-slate-400">
                        ·
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {isEn ? 'Class 9/4 · Ben Tre Secondary School' : 'Lớp 9/4 · THCS Bến Tre'}
                      </span>
                    </div>

                    <div className="space-y-5 text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-[1.8]">
                      {paragraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </TieredScrollBlock>
            );
          })}
        </div>
      </section>

      {/* Three Core Values Directly on Canvas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-300/65 dark:border-white/15">
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
          <TieredScrollBlock
            key={val.num}
            perfMode={perfMode}
            delay={perfMode === 'smooth' ? 0 : idx * 0.08}
          >
            <div className={`space-y-2 ${TEXT_HALO_CLASS}`}>
              <div className="font-mono text-xs font-bold text-sky-800 dark:text-sky-300 tabular-nums">
                {val.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                {isEn ? val.titleEn : val.titleVi}
              </h3>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {isEn ? val.descEn : val.descVi}
              </p>
            </div>
          </TieredScrollBlock>
        ))}
      </section>
    </div>
  );
};

