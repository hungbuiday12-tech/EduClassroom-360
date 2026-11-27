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
  paragraphsVi: string[];
  paragraphsEn: string[];
  synapseAnalysisVi?: {
    heading: string;
    body: string;
  };
  synapseAnalysisEn?: {
    heading: string;
    body: string;
  };
  silhouetteVariant: number;
}

const AUTHOR_MEMBERS: AuthorMemberDef[] = [
  {
    id: 'bui_tan_hung',
    fullName: 'Bùi Tấn Hưng',
    roleVi: 'Nhóm trưởng · Kiến trúc hệ thống & Định hướng phát triển',
    roleEn: 'Team Leader · System Architecture & Product Vision',
    focusVi: 'Kiến trúc tổng thể · Mô phỏng Toán – Tin học & Tích hợp trợ giảng AI',
    focusEn: 'Core Architecture · Math & CS Simulations · AI Tutor Integration',
    paragraphsVi: [
      'Trong suốt những năm tháng ngồi trên ghế nhà trường tại Trường THCS Bến Tre, mình cùng các bạn lớp 9/4 đã có không ít buổi chiều ở lại sau giờ học, cặm cụi bên trang vở để tự giảng cho nhau nghe một bài toán chuyển động đồ thị, một sơ đồ mạch điện mắc hỗn hợp hay một đoạn vòng lặp lồng nhau mãi chưa chịu chạy đúng ý. Nhiều bạn học rất chăm chỉ, ghi chép không thiếu dòng nào, nhưng khi gặp đề bài đổi thông số hoặc bước sang phần kiến thức trừu tượng lại dễ bị chững lại chỉ vì thiếu một mô hình sống động để tự tay xoay chuyển và kiểm chứng xem điều gì đang thật sự diễn ra bên trong công thức.',
      'Chính từ những trăn trở giản dị đó—và từ câu hỏi "ước gì mỗi bạn học sinh đều có một phòng thí nghiệm thu nhỏ mở sẵn ngay trên màn hình"—năm đứa tụi mình gồm Quyên Như, Anh Kiệt, Thiện Nhân, Hoàng Long và mình đã bắt tay phác thảo từng ý tưởng đầu tiên cho dự án này. Tụi mình muốn tạo ra một không gian nơi người học không chỉ đọc chữ thụ động, mà có thể kéo từng thanh trượt thông số, quan sát tia sáng khúc xạ hay lực tương tác trong không gian 2D/3D, nghe bài giảng tiếng Việt rõ ràng và bấm dừng ngay khoảnh khắc chưa hiểu để trao đổi tiếp cùng trợ giảng AI.'
    ],
    paragraphsEn: [
      'Throughout our years at Ben Tre Secondary School, my Class 9/4 teammates and I spent countless afternoons after class sketching graphs, tracing mixed resistor circuits, and debugging nested loops together on notebook paper. We saw how many hardworking students hit a wall not from a lack of effort, but because static textbook diagrams rarely let you push a parameter and watch how nature or an algorithm responds in real time.',
      'From that shared frustration—and the simple wish that every student could open a living STEM laboratory right inside a browser—Quyên Như, Anh Kiệt, Thiện Nhân, Hoàng Long, and I began shaping this platform together. Our goal is to let every learner adjust variables freely, inspect 2D/3D apparatuses from any angle, listen to clear Vietnamese explanations, and pause at any step to explore deeper.'
    ],
    synapseAnalysisVi: {
      heading: 'Tên web "Synapse" & Ý nghĩa đằng sau cái tên này',
      body:
        'Trong Sinh học thần kinh, "Synapse" (khớp thần kinh) là điểm tiếp nối cực nhỏ nhưng kỳ diệu giữa các tế bào thần kinh—nơi xung điện và tín hiệu truyền qua để đánh thức trí nhớ, tạo nên sự thấu hiểu và bùng nổ những ý tưởng mới. Tụi mình chọn cái tên Synapse vì mong trang web này cũng trở thành một "khớp nối tri thức" như thế: kết nối những công thức Toán, Vật lí, Hóa học, Sinh học và Tin học tưởng chừng rời rạc thành một dòng chảy trực quan liền mạch, nối nhịp cầu giữa lý thuyết trên lớp với thực hành thí nghiệm 2D/3D, và đặc biệt là nối liền tình bạn lớp 9/4 của năm thành viên tụi mình với niềm tò mò ham học hỏi của các bạn học sinh ở khắp mọi nơi.'
    },
    synapseAnalysisEn: {
      heading: 'Why We Named It "Synapse" & What It Means to Us',
      body:
        'In neuroscience, a synapse is the microscopic junction where one neuron passes a signal to the next—the exact spark behind every memory, insight, and "aha!" moment. We chose the name Synapse because we envision this platform as a living bridge of knowledge: connecting seemingly separate ideas across Mathematics, Physics, Chemistry, Biology, and Computer Science, bridging classroom theory with hands-on 2D/3D experiments, and linking our five Class 9/4 friendships to curious learners everywhere.'
    },
    silhouetteVariant: 0
  },
  {
    id: 'huynh_thi_quyen_nhu',
    fullName: 'Huỳnh Thị Quyên Như',
    roleVi: 'Thành viên nhóm phát triển · Nội dung học thuật & Cấu trúc bài giảng',
    roleEn: 'Core Team Member · Academic Content & Curriculum Flow',
    focusVi: 'Biên tập kiến thức chuẩn chương trình 2018 & 2006 · Thiết kế mạch giảng dễ hiểu',
    focusEn: 'GDPT 2018 & 2006 Curriculum Curation · Stepwise Explanations',
    paragraphsVi: [
      'Khi tham gia xây dựng Synapse cùng cả nhóm, mình đảm nhận phần rà soát cấu trúc bài giảng, đối chiếu kiến thức giữa chương trình phổ thông mới và cũ để đảm bảo mỗi bài học đều bám sát những gì tụi mình và các bạn đang học trên lớp. Có những khái niệm khi đọc trong sách giáo khoa chỉ gói gọn trong vài dòng định nghĩa, nhưng để một bạn học sinh tự học ở nhà hiểu thấu tận gốc lại cần chia nhỏ thành từng bước suy luận tự nhiên, có ví dụ gần gũi và chỉ ra ngay những lỗi sai dễ mắc phải trong bài kiểm tra.',
      'Điều khiến mình tự hào và xúc động nhất trong quá trình làm dự án là những buổi cả nhóm ngồi góp ý sửa từng câu chữ thuyết minh sao cho khớp với chuyển động của mô phỏng 2D và 3D. Nhìn một công thức từng làm nhiều bạn e ngại nay hiện lên rõ ràng qua từng bước chuyển cảnh, kèm giọng đọc và câu hỏi luyện tập có giải thích cặn kẽ, mình tin rằng bất kỳ bạn nào kiên nhẫn đồng hành cùng Synapse cũng sẽ cảm thấy việc học nhẹ nhàng, mạch lạc và tràn đầy tự tin hơn mỗi ngày.'
    ],
    paragraphsEn: [
      'My role in Synapse centers on reviewing curriculum alignment across both the 2018 and 2006 programs and structuring each lesson so it reads naturally for self-study. Textbook definitions are often condensed into just a few lines, so I focus on breaking big concepts into clear reasoning steps, relatable everyday examples, and explicit warnings about common exam pitfalls.',
      'What moved me most while building this project was refining every explanation alongside the 2D and 3D animations until the words and visuals spoke the exact same language. Seeing intimidating equations unfold step by step gives me confidence that students using Synapse will feel calmer, clearer, and genuinely empowered during study sessions.'
    ],
    silhouetteVariant: 1
  },
  {
    id: 'vo_anh_kiet',
    fullName: 'Võ Anh Kiệt',
    roleVi: 'Thành viên nhóm phát triển · Thuật toán, Lập trình & Đấu trường tư duy',
    roleEn: 'Core Team Member · Algorithms, Code Trace & Arena',
    focusVi: 'Trình truy vết code từng dòng · Mô phỏng cấu trúc dữ liệu & Tư duy giải thuật',
    focusEn: 'Line-by-Line Code Execution · Data Structures & Problem Solving',
    paragraphsVi: [
      'Khi mới bắt đầu làm quen với Tin học và giải thuật, mình từng rất nhiều lần ngồi nhìn màn hình hàng giờ chỉ vì không hiểu tại sao một vòng lặp for lại chạy quá một bước hay một hàm đệ quy lại trả về kết quả khác hoàn toàn suy nghĩ ban đầu. Nếu chỉ đọc mã nguồn tĩnh trên giấy hoặc nhìn kết quả cuối cùng sau khi bấm chạy, người mới học rất khó hình dung giá trị của từng biến đang thay đổi ra sao trong bộ nhớ ở từng mili-giây thực thi.',
      'Từ trải nghiệm thực tế đó, mình cùng nhóm phát triển phần trình diễn thuật toán từng bước, bảng theo dõi biến và không gian đấu trường luyện tập để biến những dòng lệnh khô khan thành chuỗi chuyển động có thể quan sát tận mắt. Bạn có thể cho chạy chậm, bấm lùi hoặc dừng lại ngay đúng dòng lệnh đang thắc mắc để tự kiểm chứng logic của mình—bởi với tụi mình, hiểu thấu từng bước tư duy luôn quan trọng hơn việc chép thuộc một đoạn code mẫu.'
    ],
    paragraphsEn: [
      'When I first started learning algorithms and programming, I spent countless hours staring at code wondering why a loop went one iteration too far or why a recursive call returned an unexpected value. Reading static code without watching variables evolve inside memory makes simple logic feel needlessly intimidating.',
      'Drawing from that experience, I helped shape Synapse’s step-by-step code tracer, variable state visualizers, and practice arena. Being able to slow down execution, step backward, and inspect the exact line where state changes turns debugging from guesswork into genuine algorithmic intuition.'
    ],
    silhouetteVariant: 2
  },
  {
    id: 'le_thien_nhan',
    fullName: 'Lê Thiện Nhân',
    roleVi: 'Thành viên nhóm phát triển · Mô phỏng Vật lí 2D/3D & Dụng cụ thực hành',
    roleEn: 'Core Team Member · Physics 2D/3D Labs & Apparatus Testing',
    focusVi: 'Kiểm thử dụng cụ đo trực quan · Thí nghiệm Quang, Điện, Cơ học & Môi trường thực hành',
    focusEn: 'Virtual Lab Instruments · Optics, Circuits & Mechanics QA',
    paragraphsVi: [
      'Với riêng mình, môn Vật lí luôn có một sức hút đặc biệt bởi mọi quy luật đều gắn liền với những hiện tượng diễn ra ngay xung quanh cuộc sống, nhưng học Vật lí mà thiếu thực hành thì giống như đọc bản đồ mà chưa từng bước ra đường. Ở trường, không phải tiết học nào cũng kịp để từng bạn tự tay lắp ráp đầy đủ mạch điện, chỉnh tiêu cự thấu kính hay đo đạc sai số lực kéo nhiều lần liên tiếp, nên nhiều lúc tụi mình chỉ kịp nhớ công thức mà chưa kịp cảm nhận bản chất của thí nghiệm.',
      'Trong nhóm Synapse, mình dành rất nhiều tâm huyết để kiểm thử các bộ dụng cụ thí nghiệm 2D và 3D như ampe kế, vôn kế, mặt phẳng nghiêng, nguồn sáng quang học, cũng như đối chiếu số liệu đo được với đúng công thức chuẩn trong sách. Mỗi lần tinh chỉnh để kim đồng hồ đo rung nhẹ tự nhiên hay tia sáng đổi hướng chính xác theo từng milimét kéo thanh trượt, mình chỉ mong các bạn khi mở phòng thí nghiệm ảo lên sẽ có cảm giác háo hức như đang đứng trước bàn thực hành thật sự.'
    ],
    paragraphsEn: [
      'Physics has always fascinated me because its laws govern everything around us, yet learning Physics without hands-on experimentation feels like reading a map without ever taking a step outside. In a crowded school schedule, there is rarely enough lab time for every student to rewire circuits, shift optical lenses, and repeat measurements dozens of times.',
      'Inside Synapse, I dedicated myself to testing our 2D and 3D instruments—ammeters, voltmeters, inclined planes, and optical benches—verifying that every simulated reading matches real physical laws. My hope is that watching needles deflect and light rays bend smoothly on screen brings the excitement of a real lab bench straight to every student.'
    ],
    silhouetteVariant: 3
  },
  {
    id: 'nguyen_hoang_long',
    fullName: 'Lê Hoàng Long',
    roleVi: 'Thành viên nhóm phát triển · Đồ họa 3D, Chuyển động & Trình diễn trải nghiệm',
    roleEn: 'Core Team Member · 3D Visuals, Motion & Experience Polish',
    focusVi: 'Không gian 3D tương tác · Nhịp điệu chuyển cảnh & Trình bày trực quan khoa học',
    focusEn: 'Interactive 3D Scenes · Motion Choreography & Visual Craft',
    paragraphsVi: [
      'Mình luôn tin rằng ấn tượng đầu tiên khi mở một trang web học tập quyết định rất lớn đến cảm hứng ngồi vào bàn học của mỗi người, đặc biệt là sau một ngày dài học tập mệt mỏi. Nếu giao diện quá rối rắm hoặc mô hình đứng yên cứng nhắc, người học rất dễ nản lòng trước khi kịp chạm tới phần kiến thức hay nhất bên trong; ngược lại, một không gian sạch sẽ, chuyển động mượt mà và có chiều sâu sẽ khơi gợi sự tò mò ngay từ giây đầu tiên.',
      'Trong dự án Synapse, mình cùng cả nhóm chăm chút từng góc xoay camera 3D, ánh sáng nổi khối cho các mô hình hình học – phân tử – sinh học, cũng như nhịp điệu lướt trang để mọi thao tác đều nhẹ nhàng và tự nhiên. Dù chỉ là một chi tiết nhỏ như độ mượt khi mở khung mô phỏng hay bố cục chữ dễ đọc trên nền tối, cả nhóm đều xem đó là cách tụi mình gửi gắm sự trân trọng đến từng bạn học sinh ghé thăm ngôi nhà tri thức chung này.'
    ],
    paragraphsEn: [
      'I firmly believe that how a learning space feels in the first five seconds strongly shapes a student’s motivation to stay curious. Cluttered layouts or stiff graphics push learners away before they reach the heart of a topic, whereas clean pacing, depth, and purposeful motion invite exploration.',
      'Within Synapse, I focused alongside the team on 3D camera framing, lighting on geometric and scientific models, and calm scroll transitions across pages. Polishing every visual detail—from readable typography to responsive 3D viewports—is our way of showing care for every learner who steps into this space.'
    ],
    silhouetteVariant: 4
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
      [...AUTHOR_MEMBERS.map((m) => m.id), 'supervising_teacher'].forEach((id) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 pb-24">
      <ScrollProgressBar />

      {/* Top Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
          </button>

          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isEn ? 'Welcome Page' : 'Trang chào mừng'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateSubject('guide')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>{isEn ? 'Open Interactive Guide' : 'Xem Hướng dẫn sử dụng'}</span>
        </button>
      </div>

      {/* Emotional & Meaningful Collective Hero Intro */}
      <section className="space-y-6 max-w-5xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{isEn ? 'Author Collective' : 'Nhóm tác giả thực hiện'}</span>
          <span aria-hidden="true">·</span>
          <span>{isEn ? 'Class 9/4' : 'Lớp 9/4'}</span>
          <span aria-hidden="true">·</span>
          <span>{isEn ? 'Ben Tre Secondary School, Vietnam' : 'Trường THCS Bến Tre, Việt Nam'}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance max-w-4xl">
          {isEn
            ? 'Five Class 9/4 Friends Turning Classroom Curiosity Into a Living STEM Lab'
            : 'Nhóm 5 Học sinh Lớp 9/4 · Trường THCS Bến Tre, Việt Nam'}
        </h1>

        <div className="space-y-4 text-base sm:text-[17px] text-slate-700 dark:text-slate-200 leading-[1.8]">
          {isEn ? (
            <>
              <p>
                We are five classmates from Class 9/4 at Ben Tre Secondary School, Vietnam — Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân, and Lê Hoàng Long. Beyond the daily bell, homework notebooks, and exam prep seasons we share together, what unites us most is the quiet thrill of finally understanding "why" something works—not because we memorized a line from a page, but because we saw it move, test it with our own hands, and trace every step to its root.
              </p>
              <p>
                Synapse began as a shared dream among five ordinary middle-school students hoping to give back something genuinely useful to our peers and younger grades. Every interactive graph, 2D/3D laboratory bench, Vietnamese explanation, and line-by-line code trace in this space carries our afternoons of discussion, debugging, and care—so that wherever you sit down to study, from a quiet study corner at home to an after-school club, Mathematics, Physics, Chemistry, Biology, and Informatics feel closer, warmer, and truly alive.
              </p>
            </>
          ) : (
            <>
              <p>
                Chúng tôi là năm người bạn cùng chung một mái lớp 9/4 tại Trường THCS Bến Tre, Việt Nam: Bùi Tấn Hưng, Huỳnh Thị Quyên Như, Võ Anh Kiệt, Lê Thiện Nhân và Lê Hoàng Long. Giữa những buổi học chính khóa, những chồng đề cương ôn thi cuối cấp và biết bao chiều nán lại góc lớp tranh luận về một bài toán khó hay một hiện tượng Vật lí thú vị, điều gắn kết năm đứa tụi mình bền chặt nhất chính là niềm vui vỡ òa mỗi khi thật sự hiểu tận gốc câu hỏi "tại sao"—không phải nhờ học vẹt vài dòng công thức, mà nhờ được nhìn thấy quy luật tự nhiên vận hành sống động ngay trước mắt.
              </p>
              <p>
                Dự án Synapse ra đời từ ước mơ mộc mạc nhưng đầy nhiệt huyết của những cô cậu học trò lớp 9 muốn tạo nên một món quà tri thức thực sự có ích cho bạn bè đồng trang lứa và các em khối dưới. Từng mô hình hình học 2D/3D, từng bàn thí nghiệm ảo, từng dòng giải thích tiếng Việt và từng bước chạy thử thuật toán đều là kết tinh từ những giờ cả nhóm cùng góp ý, kiểm chứng và trau chuốt cẩn thận—với hy vọng rằng bất kỳ bạn học sinh nào, dù đang tự học một mình ở góc bàn khuya hay cùng nhóm bạn ôn luyện đội tuyển, cũng sẽ tìm thấy ở đây một người bạn đồng hành ấm áp giúp khoa học trở nên gần gũi, dễ cảm nhận và đáng yêu hơn rất nhiều.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Vertical Author Sections: Portrait on the Left, Long Unboxed Narrative on the Right */}
      <section className="space-y-14 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-sky-700 dark:text-sky-400">
              {isEn ? 'Meet Each Author & Project Story' : 'Từng thành viên & Câu chuyện xây dựng dự án'}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Team Voices, Roles & Advisor Slot' : 'Chân dung & Chia sẻ từ Nhóm tác giả lớp 9/4'}
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Hover any portrait frame to preview a custom photo'
              : 'Di chuột lên khung ảnh để thử tải ảnh chân dung trực tiếp'}
          </span>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
          {AUTHOR_MEMBERS.map((member, idx) => {
            const customUrl = customPhotos[member.id];
            const paras = isEn ? member.paragraphsEn : member.paragraphsVi;
            const synapseNote = isEn ? member.synapseAnalysisEn : member.synapseAnalysisVi;

            return (
              <ScrollReveal
                key={member.id}
                direction="up"
                delay={Math.min(idx * 0.06, 0.24)}
                className={idx === 0 ? 'pb-14' : 'py-14'}
              >
                <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left: Larger Standing Portrait Frame */}
                  <div className="md:col-span-4 lg:col-span-4 w-full max-w-[300px] mx-auto md:mx-0">
                    <div className="group relative aspect-[3/4] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 dark:from-slate-200 dark:to-slate-300 overflow-hidden flex items-end justify-center pt-4 shadow-sm">
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

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/85 hover:bg-slate-950 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
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
                            className="p-1.5 rounded-md bg-white/90 hover:bg-white text-slate-900 shadow-sm cursor-pointer"
                            title={isEn ? 'Restore black silhouette' : 'Khôi phục bóng đen'}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
                      {isEn ? 'Class 9/4 · Ben Tre Secondary School' : 'Lớp 9/4 · Trường THCS Bến Tre'}
                    </div>
                  </div>

                  {/* Right: Wide, Unboxed Editorial Copy Directly on Background */}
                  <div className="md:col-span-8 lg:col-span-8 space-y-5">
                    <div className="space-y-1.5">
                      <div className="text-xs font-medium text-sky-700 dark:text-sky-400">
                        {isEn ? member.roleEn : member.roleVi}
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {member.fullName}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {isEn ? member.focusEn : member.focusVi}
                      </p>
                    </div>

                    <div className="space-y-4 text-[15px] sm:text-base text-slate-700 dark:text-slate-200 leading-[1.8]">
                      {paras.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    {synapseNote && (
                      <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/70 space-y-2">
                        <h4 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                          {synapseNote.heading}
                        </h4>
                        <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-200 leading-[1.8]">
                          {synapseNote.body}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}

          {/* Supervising Teacher Row (Reserved Blank Portrait on Left + Appreciation Copy on Right) */}
          <ScrollReveal direction="up" delay={0.18} className="pt-14">
            <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="md:col-span-4 lg:col-span-4 w-full max-w-[300px] mx-auto md:mx-0">
                <div className="group relative aspect-[3/4] w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-950/60 overflow-hidden flex flex-col items-center justify-center p-5 text-center">
                  {customPhotos.supervising_teacher ? (
                    <img
                      src={customPhotos.supervising_teacher}
                      alt={isEn ? 'Supervising Teacher' : 'Giáo viên hướng dẫn'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl border border-dashed border-slate-300/90 dark:border-slate-700/80 flex flex-col items-center justify-center gap-2 px-4">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {isEn ? 'Reserved Portrait Frame' : 'Khung ảnh chừa trống'}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {isEn ? 'To be updated' : 'Chưa cập nhật'}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900/85 hover:bg-slate-950 text-white text-[11px] font-semibold cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Upload' : 'Tải ảnh'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handlePhotoUpload('supervising_teacher', e.target.files?.[0])}
                      />
                    </label>
                    {customPhotos.supervising_teacher && (
                      <button
                        type="button"
                        onClick={() => handleResetPhoto('supervising_teacher')}
                        className="p-1.5 rounded-md bg-white/90 hover:bg-white text-slate-900 shadow-sm cursor-pointer"
                        title={isEn ? 'Clear photo' : 'Để trống lại khung ảnh'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
                  {isEn ? 'Ben Tre Secondary School' : 'Trường THCS Bến Tre'}
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-8 space-y-5">
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {isEn ? 'Academic Advisor · Pending Update' : 'Cố vấn chuyên môn · Đang chừa trống để cập nhật sau'}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {isEn ? 'Supervising Teacher' : 'Giáo viên hướng dẫn'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Academic guidance, scientific accuracy review & mentorship at Ben Tre Secondary School'
                      : 'Định hướng sư phạm · Kiểm duyệt tính chính xác học thuật & Đồng hành cùng nhóm lớp 9/4'}
                  </p>
                </div>

                <div className="space-y-4 text-[15px] sm:text-base text-slate-700 dark:text-slate-200 leading-[1.8]">
                  <p>
                    {isEn
                      ? 'Every genuine learning project built by middle-school students relies on patient teachers who encourage curiosity while keeping every concept scientifically accurate. This section is intentionally reserved for our supervising teacher at Ben Tre Secondary School, whose portrait and full academic profile will be updated directly once confirmed.'
                      : 'Đằng sau sự trưởng thành của bất kỳ dự án học tập nghiêm túc nào do học sinh thực hiện luôn có sự dìu dắt tận tâm của quý thầy cô—những người vừa khơi dậy niềm say mê tìm tòi, vừa uốn nắn từng chi tiết kiến thức để mọi bài giảng và thí nghiệm giữ được độ chuẩn xác sư phạm cao nhất. Vị trí này được nhóm trân trọng dành riêng cho Giáo viên hướng dẫn tại Trường THCS Bến Tre và sẽ sớm được cập nhật đầy đủ chân dung cùng thông tin chuyên môn chính thức.'}
                  </p>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Scroll-Reveal Three Core Values */}
      <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-200 dark:border-slate-800">
        {[
          {
            num: '01',
            titleVi: 'Trực quan trước công thức',
            titleEn: 'Intuition Before Formulas',
            descVi:
              'Mọi khái niệm Toán, Vật lí, Hóa, Sinh và Tin học đều gắn với hình vẽ động hoặc mô phỏng để người học nắm chắc bản chất thay vì học thuộc máy móc.',
            descEn:
              'Every math, physics, chemistry, biology, and CS topic pairs interactive motion with equations so learners grasp intuition first.'
          },
          {
            num: '02',
            titleVi: 'Thực hành an toàn mọi lúc',
            titleEn: 'Safe Virtual Experimentation',
            descVi:
              'Cho phép thử nghiệm dụng cụ đo Vật lí, pha chế phản ứng Hóa học, giải phẫu mô hình Sinh học và chạy mã C++/Python ngay trên trình duyệt.',
            descEn:
              'Experiment with physics instruments, chemical reactions, biology models, and C++/Python traces right inside any browser.'
          },
          {
            num: '03',
            titleVi: 'Đồng hành từng bước tư duy',
            titleEn: 'Step-by-Step Guidance',
            descVi:
              'Từ giọng giảng tiếng Việt đến tính năng dừng đúng bước mô phỏng để hỏi trợ giảng AI, hệ thống hỗ trợ người học tự tìm ra hướng giải quyết rõ ràng.',
            descEn:
              'From Vietnamese voice narration to step-level AI Q&A, learners receive clear guidance right where a question arises.'
          }
        ].map((val, idx) => (
          <ScrollReveal key={val.num} direction="up" delay={idx * 0.09}>
            <div className="space-y-2.5">
              <div className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {val.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {isEn ? val.titleEn : val.titleVi}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn ? val.descEn : val.descVi}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </ScrollReveal>
    </div>
  );
};
