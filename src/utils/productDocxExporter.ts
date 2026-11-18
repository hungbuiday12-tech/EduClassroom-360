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

async function generateFallbackDocxBlob(): Promise<Blob> {
  const doc = new Document({
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
                text: 'Hệ sinh thái Học tập, Mô phỏng Trực quan Đa giác quan & Luyện thi STEM (Toán học · Vật lí · Tin học Lớp 9–12)',
                bold: true,
                size: 24,
                color: '0369A1'
              })
            ]
          }),
          heading1('I. TỔNG QUAN SẢN PHẨM (SYNAPSE STEM · synapse-stem.is-a.dev)'),
          bodyPara(
            'Synapse tích hợp 231 bài giảng chuyên sâu, 107 mô phỏng Vật lí 2D/3D + Phòng Lab Toán Oxyz/2D, Synapse Pre (30 Đại công trình tương lai, Phòng Lab Cảm biến Điện thoại QR Live Oscilloscope & Hộp cát Hạt Lực Trường 2 Tay GPU 28.000 hạt), Trình chấm Code IDE Tin học 5 lộ trình quốc tế (Truy vết Code-to-Animation 1-1 & Replay Tư Duy WA → AC), Ngân hàng 450 Đề thi có mã đề & xuất DOCX, Đấu trường Xếp hạng, Hệ thống 3 AI Mắt Thần Live Co-Pilot (Ngắt lời Voice Barge-in & Syn Reel Video 3B1B) và WebAR Bàn Học Pro điều khiển 10 ngón tay.'
          ),
          heading1('II. TOÀN BỘ TÍNH NĂNG CỐT LÕI & 6 MODULE ĐỘT PHÁ MỚI'),
          heading2('1. Hệ 3 AI Mắt Thần Live Co-Pilot (Voice Barge-in) & Syn Reel Video 3B1B'),
          bulletItem('Mắt Thần AI hợp nhất 3 động cơ', 'Syn Math, Syn Physics, Syn Code (kèm Voice OS & Spatial Voice Mentor) tự động nhìn ảnh chụp Canvas/Màn hình chia sẻ và ngữ cảnh Workspace đang mở để hướng dẫn trực tiếp theo điểm đang vẽ/code.'),
          bulletItem('Voice Barge-in (Ngắt lời tức thì)', 'Người học bấm micro hoặc nói khi AI đang giảng để ngắt luồng phát âm thanh cũ ngay lập tức, tạo cảm giác đối thoại tự nhiên.'),
          bulletItem('Syn Reel Mini-Chat (Video 3B1B)', 'Tạo nhanh video 5 cảnh chuẩn 16:9 phong cách 3Blue1Brown kèm thuyết minh song ngữ và xuất trực tiếp file .webm.'),
          heading2('2. WebAR Bàn Học Pro & Học Cảm Giác 3D/2D (10 Đầu Ngón Tay)'),
          bulletItem('AR Bàn Học Pro', 'Chiếu mô hình 3D lên mặt bàn thật với Camera Trước/Sau, chỉnh độ mờ Alpha (35–100%), cân góc nghiêng bàn (-35°..+35°), mặt cắt Y-clipping trực tiếp, thước tỷ lệ cm và chụp ảnh PNG.'),
          bulletItem('Không gian 3D & 2D', '15 mô hình tương tác 10 ngón tay, Quét đồ vật thật PBR, Point & Ask và hệ cử chỉ 2D tối giản 4+1 kèm Sáng tạo tự do AI.'),
          heading2('3. Synapse Pre: Cảm Biến Điện Thoại QR Live & Hộp Cát Hạt GPU 28.000 Hạt'),
          bulletItem('Phone Sensor QR Telemetry Lab', 'Quét QR kết nối điện thoại qua WebSocket độ trễ thấp, stream dữ liệu Gia tốc kế / Con quay lên Dao động ký đôi so sánh đường cong lý thuyết (RMSE, Hz) và xuất CSV.'),
          bulletItem('Dual-Hand GPU Particle Sandbox', 'Mô phỏng 28.000 hạt lực trường trên GPU Shader (Trọng lực đôi, Từ trường Lorentz, Giao thoa sóng, Tán xạ Rutherford) điều khiển mượt 60 FPS bằng 2 bàn tay hoặc chuột.'),
          heading2('4. Tin Học 5 Lộ Trình · Code-to-Animation Trace 1-1 & Thought-Trace Replay'),
          bulletItem('5 Lộ trình Quốc tế & IDE Sublime 4', 'VNOI, C++ Institute (OpenEDG), Roadmap.sh, LearnCpp.com và GitHub Career Track kèm Code mẫu Cơ bản/Nâng cao, chấm TLE & File I/O thật.'),
          bulletItem('Live Code Trace & Replay Tư Duy', 'Truy vết giá trị biến, mảng DP và stdout khớp từng dòng lệnh Python (sys.settrace) / C++ (g++) kết hợp thanh thời gian Replay Tư Duy (lưu lịch sử gõ, chạy, nộp WA → AC).'),
          heading2('5. Mô phỏng Vật lí 2D/3D (107 Lab), Toán học & Kho 450 Đề thi DOCX'),
          bodyPara(
            '59 phòng thí nghiệm Vật lí 2D và 48 mô hình 3D theo 5 lĩnh vực, Toán 2D & Oxyz 3D, cùng 450 Đề thi Chuyên/Không Chuyên cho phép tải DOCX sạch đáp án và chấm ảnh viết tay AI 0–10.'
          ),
          heading1('III. TÍNH MỚI, TÍNH THỰC TẾ & HIỆU QUẢ GIÁO DỤC'),
          makeTable(
            ['Khía cạnh Đánh giá', 'Giá trị Nổi bật trên Synapse'],
            [
              ['Tính mới & Sáng tạo', 'Mắt Thần Live Co-Pilot đa phương thức có Voice Barge-in, WebAR Bàn Học Pro, Điện thoại làm cảm biến Vật lí QR, 28K hạt GPU 2 tay, Truy vết Code 1-1 & Syn Reel Video 3B1B.'],
              ['Tính thực tế', 'Chạy trực tiếp trên trình duyệt phổ thông & PWA đa thiết bị (PC, Android, iPhone) tại https://synapse-stem.is-a.dev, không cần thiết bị VR chuyên dụng.'],
              ['Hiệu quả giáo dục', 'Giúp học sinh hiểu bản chất trực giác, tự gỡ lỗi tư duy qua Thought Replay và rèn luyện với kho 231 bài giảng, 107 lab, 450 đề xuất DOCX.']
            ]
          )
        ]
      }
    ]
  });

  return Packer.toBlob(doc);
}

/**
 * Reliable client-side downloader for Thuyết Minh Sản Phẩm Synapse (.docx).
 * Fetches the pre-generated full presentation with real screenshots as a verified Blob
 * (preventing empty iframe/proxy downloads), and falls back to browser-side DOCX generation if offline.
 */
export async function downloadSynapsePresentationDocx(): Promise<void> {
  const prebuiltBlob = await fetchValidDocxBlob();
  if (prebuiltBlob) {
    triggerBlobDownload(prebuiltBlob, DOWNLOAD_FILENAME);
    return;
  }

  const fallbackBlob = await generateFallbackDocxBlob();
  triggerBlobDownload(fallbackBlob, DOWNLOAD_FILENAME);
}
