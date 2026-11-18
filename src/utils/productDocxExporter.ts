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
          heading1('I. TỔNG QUAN SẢN PHẨM'),
          bodyPara(
            'Synapse tích hợp 231 bài giảng chuyên sâu, 107 mô phỏng Vật lí 2D/3D + Phòng Lab Toán Oxyz/2D, 30 Đại công trình Synapse Pre, Trình chấm Code IDE Tin học 5 lộ trình quốc tế, Ngân hàng 450 Đề thi có mã đề & xuất DOCX, Đấu trường Xếp hạng theo khối lớp và Phòng Học Cảm Giác 3D/2D điều khiển bằng 10 ngón tay (MediaPipe), Quét đồ vật thực tế thành mô hình 3D và Point & Ask AI.'
          ),
          heading1('II. TOÀN BỘ TÍNH NĂNG CỐT LÕI'),
          heading2('1. Bài giảng 3 môn & 5 Lộ trình Tin học Quốc tế + Code Judge'),
          bulletItem('5 Lộ trình', 'VNOI, C++ Institute (OpenEDG), Roadmap.sh, LearnCpp.com và GitHub Career Track.'),
          bulletItem('2 Chế độ Code mẫu', 'Song song Code Cơ bản (tối giản) và Code Nâng cao/Chuyên (DP, Segment Tree, Dijkstra); chấm test tự động hỗ trợ cả stdin/stdout và freopen.'),
          heading2('2. Mô phỏng Vật lí 2D/3D (107 Lab) & Toán học tách trang riêng'),
          bodyPara(
            '59 phòng thí nghiệm 2D và 48 mô hình 3D theo 5 lĩnh vực, tích hợp Quang học Raytracing tự do và Bản cát cộng hưởng Chladni.'
          ),
          heading2('3. Kho 450 Đề thi Quốc gia Có Mã đề & Xuất DOCX'),
          bodyPara(
            '450 đề (225 Chuyên + 225 Không Chuyên) đầy đủ toàn bộ câu hỏi, cho phép tải file Word (.docx) không kèm đáp án để làm trên giấy và tra ngược bằng mã đề trên web để xem lời giải + hình vẽ + chấm ảnh AI.'
          ),
          heading2('4. Đấu trường Online & Bảng Xếp Hạng Tuần'),
          bodyPara(
            'Chia khu vực theo Khối 9–12, Đội tuyển HSG & Hệ Chuyên/Không Chuyên; tự động tắt Syn AI khi vào phòng thi để đảm bảo công bằng.'
          ),
          heading2('5. Học cảm giác 3D/2D, Quét Thực tế & Point & Ask AI'),
          bulletItem('Không gian 3D', '15 mô hình tương tác 10 ngón tay, Quét đồ vật thật dựng mô hình 3D chuẩn PBR, và Point & Ask (chỉ ngón tay + hỏi giọng nói).'),
          bulletItem('Không gian 2D Oxy', 'Chuẩn hóa 4+1 cử chỉ siêu đơn giản (Mở 5 ngón ngắm · 1 ngón vẽ · Chụm kéo · 2 ngón xoay/đổi · Nắm tay khóa bảng) kèm bảng hướng dẫn trực quan.'),
          heading1('III. TÍNH MỚI, TÍNH THỰC TẾ & HIỆU QUẢ GIÁO DỤC'),
          makeTable(
            ['Khía cạnh Đánh giá', 'Giá trị Nổi bật trên Synapse'],
            [
              ['Tính mới & Sáng tạo', 'Point & Ask đa phương thức (chỉ tay 3D + giọng nói), Quét đồ vật thật thành lab 3D PBR, hệ cử chỉ 2D tối giản 4+1.'],
              ['Tính thực tế', 'Chạy trực tiếp trên trình duyệt phổ thông (không cần kính VR), hỗ trợ song song Webcam 10 ngón lẫn Chuột/Cảm ứng và PWA đa thiết bị.'],
              ['Hiệu quả giáo dục', 'Giúp học sinh hiểu bản chất trực giác thay vì học vẹt; giáo viên có sẵn 107 mô phỏng và kho 450 đề xuất DOCX sạch đáp án.']
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
