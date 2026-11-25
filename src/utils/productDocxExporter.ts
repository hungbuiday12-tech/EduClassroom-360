import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import { CURRICULUM_COUNTS } from '../data/curriculumCounts';
import { getPhysicsSimCounts } from '../data/physicsDomainsData';
import { CHEMISTRY_2D_SIMS, CHEMISTRY_3D_SIMS } from '../data/chemistryDomainsData';
import { BIOLOGY_2D_SIMS, BIOLOGY_3D_SIMS } from '../data/biologyDomainsData';
import { PRE_STUDIOS } from '../data/preLabsData';

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const DOWNLOAD_FILENAME = 'Thuyet_Minh_San_Pham_Synapse.docx';

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 6000);
}

function isValidZipBuffer(buf: ArrayBuffer): boolean {
  if (!buf || buf.byteLength < 10_000) return false;
  const view = new Uint8Array(buf, 0, 4);
  // DOCX files are ZIP archives starting with "PK\x03\x04"
  return view[0] === 0x50 && view[1] === 0x4b;
}

async function fetchValidDocxBlob(): Promise<Blob | null> {
  const urls = [
    '/api/docs/thuyet-minh-synapse',
    './downloads/Thuyet_Minh_San_Pham_Synapse.docx',
    '/downloads/Thuyet_Minh_San_Pham_Synapse.docx'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store'
      });
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (isValidZipBuffer(buf)) {
        return new Blob([buf], { type: DOCX_MIME });
      }
    } catch {
      // Try next endpoint
    }
  }
  return null;
}

function heading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        color: '0F172A'
      })
    ]
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: '0369A1'
      })
    ]
  });
}

function bodyPara(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 110, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 22,
        color: '1E293B'
      })
    ]
  });
}

function bulletItem(lead: string, text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 80, line: 290 },
    children: [
      new TextRun({ text: `${lead}: `, bold: true, size: 21, color: '0F172A' }),
      new TextRun({ text, size: 21, color: '334155' })
    ]
  });
}

function makeTable(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '94A3B8' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              shading: { fill: '0F172A', type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: h, bold: true, size: 20, color: 'F8FAFC' })]
                })
              ]
            })
        )
      }),
      ...rows.map(
        (r, i) =>
          new TableRow({
            children: r.map(
              (cell, ci) =>
                new TableCell({
                  shading: { fill: i % 2 === 0 ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
                  margins: { top: 90, bottom: 90, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cell,
                          bold: ci === 0,
                          size: 20,
                          color: ci === 0 ? '0F172A' : '334155'
                        })
                      ]
                    })
                  ]
                })
            )
          })
      )
    ]
  });
}

export function buildSynapsePresentationDocument(): Document {
  const phyCounts = getPhysicsSimCounts();
  const chemTotalSims = CHEMISTRY_2D_SIMS.length + CHEMISTRY_3D_SIMS.length;
  const bioTotalSims = BIOLOGY_2D_SIMS.length + BIOLOGY_3D_SIMS.length;
  const preTotal = PRE_STUDIOS.length;
  const preLabsCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'labs').length;
  const preSimsCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'simulations').length;
  const preSandboxesCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'sandboxes').length;
  const totalLessons = CURRICULUM_COUNTS.totalLessons;
  const totalExams = CURRICULUM_COUNTS.totalExams;
  return new Document({
    creator: 'Synapse STEM Academy',
    title: 'Thuyết Minh Sản Phẩm Synapse',
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } }
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: 'THUYẾT MINH SẢN PHẨM SYNAPSE',
                bold: true,
                size: 44,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 220 },
            children: [
              new TextRun({
                text: 'Hệ sinh thái Học tập, Mô phỏng Trực quan Đa giác quan & Luyện thi STEM 5 Môn (Toán học · Vật lí · Hóa học · Sinh học · Tin học Lớp 9–12)',
                bold: true,
                size: 24,
                color: '0369A1'
              })
            ]
          }),
          heading1('I. TỔNG QUAN SẢN PHẨM (SYNAPSE STEM · synapse-stem.is-a.dev)'),
          bodyPara(
            `Synapse tích hợp ${totalLessons} bài giảng chuyên sâu (GDPT 2018 & GDPT 2006 + Lộ trình Chuyên) cho 5 môn Toán học, Vật lí, Hóa học, Sinh học và Tin học; chia tách rành mạch từng khu vực Phòng Lab, Mô phỏng 2D/3D và Sandbox riêng cho từng môn. Phiên bản Synapse Pre mở khóa ${preTotal} Studio 3D/4D (${preLabsCount} Phòng Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes chia làm 2 khu: Sandbox KHTN (Lí – Hóa – Sinh) và Sandbox KHKT (Toán – Tin)), gồm 30 Đại công trình, Lò Phản Ứng Hóa 3D, Atlas Orbital VSEPR 3D, Atlas Tế Bào 3D, CRISPR-Cas9 3D, QR Cảm biến Điện thoại & Hộp cát Hạt Lực Trường GPU 28.000 hạt; kết hợp Syn Meet & 3D WebRTC, IDE Sublime Text 4 chấm code C++/Python (Trace 1-1 & Replay Tư Duy), Ngân hàng ${totalExams} Đề thi xuất DOCX và Hệ thống 5 AI Chuyên Môn (Syn Math, Syn Physics, Syn Chem, Syn Bio, Syn Code) + Syn AI Pro.`
          ),
          heading1('II. TOÀN BỘ TÍNH NĂNG CỐT LÕI & CÁC HỆ THỐNG CHUYÊN BIỆT THEO TỪNG MÔN'),
          heading2('1. Hệ 5 AI Mắt Thần Live Co-Pilot (Voice Barge-in) & Syn AI Pro'),
          bulletItem('5 Trợ lý AI tách riêng từng môn', 'Syn Math (Ctrl+D), Syn Physics (Ctrl+F), Syn Chem (Ctrl+H), Syn Bio (Ctrl+B), Syn Code (Ctrl+G) kèm Mắt Thần đọc trực tiếp Canvas/Màn hình và nút Tạm đóng giữ hội thoại.'),
          bulletItem('Syn AI Pro & Voice Barge-in', 'Bản Pre mở khóa Syn AI Pro giải 3 tầng siêu tốc, Suy luận sâu Olympiad, Sơ đồ Pro, Voice Barge-in ngắt lời tức thì và Syn Reel Mini-Chat tạo video 3B1B xuất file .webm.'),
          heading2('2. Hóa học · Sinh học · Vật lí · Toán học · Tin học: Tách Riêng Lab, Mô Phỏng 2D/3D & Sandbox'),
          bulletItem(`Hóa học (${CURRICULUM_COUNTS.chemistryLessons} bài · ${chemTotalSims} Lab 2D/3D & 4 Sandbox)`, `Đầy đủ GDPT 2018, GDPT 2006 & Chuyên; ${CHEMISTRY_2D_SIMS.length} mô phỏng 2D (Bảng tuần hoàn tương tác, Chuẩn độ Acid-Base, Bình điện phân, Pin điện hóa, Động hóa học, Polyme...) + ${CHEMISTRY_3D_SIMS.length} phòng Lab 3D (Orbital s-p-d-f, VSEPR, Cấu trúc tinh thể NaCl/Kim cương, Este hóa, Phức chất) + 4 Sandbox riêng (Cân bằng PTHH 3D, Chuẩn độ trực tiếp, Lò phản ứng Le Chatelier, Tổng hợp Hữu cơ).`),
          bulletItem(`Sinh học (${CURRICULUM_COUNTS.biologyLessons} bài · ${bioTotalSims} Lab 2D/3D & 4 Sandbox)`, `Đầy đủ GDPT 2018, GDPT 2006 & Chuyên; ${BIOLOGY_2D_SIMS.length} mô phỏng 2D (Nguyên phân/Giảm phân, Nhân đôi DNA, Phiên mã/Dịch mã, Operon Lac, Tim & Tuần hoàn, Lưới thức ăn...) + ${BIOLOGY_3D_SIMS.length} Lab 3D (Tế bào nhân thực, Xoắn kép DNA, Ribosome, Thụ thể Synap, Tim 4 ngăn) + 4 Sandbox riêng (Lai Menđen F1-F2, Hệ gen & Đột biến CRISPR, Sinh trưởng Quần thể, Chuỗi chuyển hóa Quang hợp-Hô hấp).`),
          bulletItem(`Vật lí (${CURRICULUM_COUNTS.physicsLessons} bài · ${phyCounts.total} Lab 2D/3D) & Toán học (${CURRICULUM_COUNTS.mathLectures} bài · 2D/Oxyz 3D)`, `Vật lí tách ${phyCounts.domainCount} lĩnh vực (${phyCounts.count2D} Lab 2D + ${phyCounts.count3D} Lab 3D chuẩn GDPT 2018 & 2006); Toán học tích hợp Máy vẽ hàm 2D, Xưởng Đường tròn 2D & 11 cảnh Không gian Oxyz 3D.`),
          bulletItem(`Tin học (${CURRICULUM_COUNTS.csLessons} bài · 5 Lộ trình Quốc tế)`, 'VNOI, C++ Institute (OpenEDG), Roadmap.sh, LearnCpp & GitHub Track kèm IDE Sublime Text 4, Live Code Trace 1-1, Replay Tư Duy WA → AC & 16 đồ thị thuật toán.'),
          heading2(`3. Synapse Pre (${preTotal} Studio 3D/4D: ${preLabsCount} Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes KHTN/KHKT) & Holo Atlas 3D`),
          bulletItem('Đại công trình & Chế độ Pro', `Cung cấp thanh Phân tích Pro (CSV/Snapshot/Video WebM), Lắp Ráp Cơ Khí 3D, Tên Lửa Đa Tầng, Động Cơ Phản Lực, Lò Phản Ứng Hóa 3D, Orbital VSEPR 3D, Atlas Tế Bào 3D, DNA CRISPR-Cas9 3D, QR Cảm Biến Điện Thoại, Hộp cát Hạt GPU 28.000 hạt và Holo Atlas 3D 58 bộ phận WebAR 10 ngón tay.`),
          heading2(`4. Ngân Hàng ${totalExams} Đề Thi DOCX (5 Môn) & Syn Meet 3D WebRTC`),
          bulletItem(`Kho ${totalExams} Đề Thi (${CURRICULUM_COUNTS.chuyenExams} Chuyên · ${CURRICULUM_COUNTS.standardExams} Không chuyên)`, 'Mỗi môn Toán, Vật lí, Hóa học, Sinh học và Tin học có đúng 350 đề (175 Chuyên + 175 THPT), cho phép up ảnh/Ctrl+V/giọng nói, chấm bài viết tay 0–10 & tải DOCX sạch đáp án.'),
          bulletItem('Syn Meet & 3D WebRTC', 'Gọi video/thoại theo mã phòng 6 ký tự, chia sẻ màn hình và đồng bộ mô hình 3D (.glb/.gltf/.obj) xoay, tách lớp cùng nhóm học tập.'),
          heading1('III. TÍNH MỚI, TÍNH THỰC TẾ & HIỆU QUẢ GIÁO DỤC'),
          makeTable(
            ['Khía cạnh Đánh giá', 'Giá trị Nổi bật trên Synapse'],
            [
              ['Tính mới & Sáng tạo', `Phủ trọn 5 môn STEM (Toán, Lí, Hóa, Sinh, Tin) với khu vực Phòng Lab, Mô phỏng 2D/3D và Sandbox tách riêng từng môn; ${preTotal} Synapse Pre Studio 3D/4D, 5 AI chuyên môn Mắt Thần + Syn AI Pro và Code Trace 1-1.`],
              ['Tính thực tế', 'Chạy mượt trực tiếp trên trình duyệt & PWA đa thiết bị (PC, Android, iPhone) tại https://synapse-stem.is-a.dev, tối ưu FPS nhiều cấu hình, hướng dẫn trực quan thực tế không rập khuôn AI.'],
              ['Hiệu quả giáo dục', `Hệ thống hóa đầy đủ GDPT 2018, GDPT 2006 và Chuyên HSG Quốc gia với ${totalLessons} bài giảng 2D/3D, ${totalExams} đề thi chuẩn DOCX và Bản đồ Tri thức theo dõi lỗ hổng kiến thức tự động.`]
            ]
          )
        ]
      }
    ]
  });
}

async function generateFallbackDocxBlob(): Promise<Blob> {
  return Packer.toBlob(buildSynapsePresentationDocument());
}

/**
 * Reliable client-side downloader for Thuyết Minh Sản Phẩm Synapse (.docx).
 * Generates the up-to-date DOCX including all latest modules (Live Meet & Shared 3D, WebAR, Synapse Pre, etc.),
 * falling back to prebuilt server DOCX only if browser generation fails.
 */
export async function downloadSynapsePresentationDocx(): Promise<void> {
  try {
    const latestBlob = await generateFallbackDocxBlob();
    triggerBlobDownload(latestBlob, DOWNLOAD_FILENAME);
    return;
  } catch {
    const prebuiltBlob = await fetchValidDocxBlob();
    if (prebuiltBlob) {
      triggerBlobDownload(prebuiltBlob, DOWNLOAD_FILENAME);
    }
  }
}
