import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import { ExamPaper } from '../types';

/**
 * Converts LaTeX expressions inside exam questions into clean readable Unicode text
 * for Word (.docx) export — strictly WITHOUT solutions, hints, or answers.
 */
function formatExamMathForDocx(input: string): string {
  let out = String(input || '');

  // Strip block and inline math delimiters cleanly
  out = out.replace(/\$\$/g, '\n').replace(/\$/g, '');

  // Environments
  out = out
    .replace(/\\begin\{cases\}/g, '{ ')
    .replace(/\\end\{cases\}/g, ' }')
    .replace(/\\\\/g, '\n');

  // Fractions: \frac{a}{b} -> (a)/(b) or a/b
  for (let pass = 0; pass < 3; pass++) {
    out = out.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, num, den) => {
      const cleanNum = num.trim();
      const cleanDen = den.trim();
      const wrapNum = cleanNum.length <= 2 && !/[+\-*/\s]/.test(cleanNum) ? cleanNum : `(${cleanNum})`;
      const wrapDen = cleanDen.length <= 2 && !/[+\-*/\s]/.test(cleanDen) ? cleanDen : `(${cleanDen})`;
      return `${wrapNum}/${wrapDen}`;
    });
  }

  // Roots
  out = out.replace(/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, 'căn bậc $1($2)');
  out = out.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

  // Common LaTeX commands -> Unicode symbols
  const replacements: [RegExp, string][] = [
    [/\\text\{([^{}]+)\}/g, '$1'],
    [/\\mathbf\{([^{}]+)\}/g, '$1'],
    [/\\overrightarrow\{([^{}]+)\}/g, 'vec($1)'],
    [/\\overparen\{([^{}]+)\}/g, 'cung $1'],
    [/\\widehat\{([^{}]+)\}/g, 'góc $1'],
    [/\\big\(|\\left\(/g, '('],
    [/\\big\)|\\right\)/g, ')'],
    [/\\left\[|\\right\]/g, '['],
    [/\\left\\\{|\\right\\\}/g, '{'],
    [/\\left\||\\right\|/g, '|'],
    [/\\mathbb\{R\}/g, 'ℝ'],
    [/\\mathbb\{Z\}/g, 'ℤ'],
    [/\\mathbb\{N\}/g, 'ℕ'],
    [/\\mathbb\{Q\}/g, 'ℚ'],
    [/\\triangle/g, '△'],
    [/\\angle/g, '∠'],
    [/\\perp/g, '⊥'],
    [/\\parallel/g, '∥'],
    [/\\sim/g, '∽'],
    [/\\cong/g, '≅'],
    [/\\le(?:q)?/g, '≤'],
    [/\\ge(?:q)?/g, '≥'],
    [/\\ne(?:q)?/g, '≠'],
    [/\\approx/g, '≈'],
    [/\\equiv/g, '≡'],
    [/\\pm/g, '±'],
    [/\\cdot/g, '·'],
    [/\\times/g, '×'],
    [/\\infty/g, '∞'],
    [/\\pi/g, 'π'],
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\delta/g, 'δ'],
    [/\\Delta/g, 'Δ'],
    [/\\lambda/g, 'λ'],
    [/\\omega/g, 'ω'],
    [/\\Omega/g, 'Ω'],
    [/\\varphi|\\phi/g, 'φ'],
    [/\\mu/g, 'μ'],
    [/\\Phi/g, 'Φ'],
    [/\\in\b/g, '∈'],
    [/\\notin\b/g, '∉'],
    [/\\subset\b/g, '⊂'],
    [/\\cup\b/g, '∪'],
    [/\\cap\b/g, '∩'],
    [/\\forall\b/g, '∀'],
    [/\\exists\b/g, '∃'],
    [/\\implies|\\Rightarrow/g, '⇒'],
    [/\\iff|\\Leftrightarrow/g, '⇔'],
    [/\\to\b|\\rightarrow\b/g, '→'],
    [/\\sum/g, 'Σ'],
    [/\\int/g, '∫'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln'],
    [/\\sin/g, 'sin'],
    [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'],
    [/\\cot/g, 'cot'],
    [/\\lim/g, 'lim'],
    [/\\circ/g, '°'],
    [/\\;/g, ' '],
    [/\\,/g, ' '],
    [/\\quad/g, '   '],
    [/\\_/g, '_']
  ];

  for (const [pattern, target] of replacements) {
    out = out.replace(pattern, target);
  }

  // Tidy simple powers and braces
  out = out
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^0\b/g, '⁰')
    .replace(/\{([^{}\s]{1,6})\}/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return out;
}

function getSectionHeadingForQuestion(questionNumber: string, isEn: boolean): string | null {
  if (questionNumber.includes('Phần I -')) {
    return isEn
      ? 'PART I. MULTIPLE CHOICE QUESTIONS (4 OPTIONS)'
      : 'PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN';
  }
  if (questionNumber.includes('Phần II -')) {
    return isEn
      ? 'PART II. TRUE / FALSE QUESTIONS (4 STATEMENTS EACH)'
      : 'PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI';
  }
  if (questionNumber.includes('Phần III -')) {
    return isEn
      ? 'PART III. SHORT-ANSWER & CONSTRUCTED RESPONSE'
      : 'PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN / TỰ LUẬN VẬN DỤNG';
  }
  return null;
}

/**
 * Generates and triggers download of an official `.docx` exam paper WITHOUT any solutions or answer keys.
 * Students must enter the exam code (`examCode`) or open the grading tab on the web to view solutions.
 */
export async function downloadExamPaperDocx(
  exam: ExamPaper,
  examCode: string,
  isEn = false
): Promise<void> {
  const subjectLabel =
    exam.subject === 'math'
      ? isEn ? 'MATHEMATICS' : 'TOÁN HỌC'
      : exam.subject === 'physics'
      ? isEn ? 'PHYSICS' : 'VẬT LÝ'
      : exam.subject === 'chemistry'
      ? isEn ? 'CHEMISTRY' : 'HÓA HỌC'
      : exam.subject === 'biology'
      ? isEn ? 'BIOLOGY' : 'SINH HỌC'
      : isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC';

  const trackLabel =
    exam.track === 'chuyen'
      ? isEn ? 'SPECIALIZED & OLYMPIAD' : 'CHUYÊN & HỌC SINH GIỎI'
      : isEn ? 'STANDARD / HIGH SCHOOL' : 'KHÔNG CHUYÊN / TỐT NGHIỆP THPT';

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '1e293b' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: exam.school.toUpperCase(), bold: true, size: 22 })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `${trackLabel}`, bold: true, size: 20, color: '334155' })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `${isEn ? 'Academic Year' : 'Năm học'}: ${exam.academicYear}`,
                    italics: true,
                    size: 19
                  })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: '1e293b' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: isEn ? 'OFFICIAL EXAM PAPER' : 'ĐỀ THI CHÍNH THỨC / TỰ LUYỆN',
                    bold: true,
                    size: 22
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${isEn ? 'SUBJECT' : 'MÔN'}: ${subjectLabel} · ${exam.timeMinutes} ${isEn ? 'MIN' : 'PHÚT'}`,
                    bold: true,
                    size: 20
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: `${isEn ? 'EXAM CODE' : 'MÃ ĐỀ'}: ${examCode}`,
                    bold: true,
                    size: 24,
                    color: '1d4ed8'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  const children: (Paragraph | Table)[] = [
    headerTable,
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 220, after: 100 },
      children: [
        new TextRun({
          text: exam.title.toUpperCase(),
          bold: true,
          size: 28,
          color: '0f172a'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: isEn
            ? `Total: ${exam.questions.length} questions · Duration: ${exam.timeMinutes} minutes (No solutions included in file)`
            : `Đề thi gồm ${exam.questions.length} câu đầy đủ · Thời gian làm bài: ${exam.timeMinutes} phút (Không kèm đáp án)`,
          italics: true,
          size: 20,
          color: '475569'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 60, after: 220 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '93c5fd' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '93c5fd' },
        left: { style: BorderStyle.SINGLE, size: 12, color: '2563eb' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '93c5fd' }
      },
      shading: { fill: 'eff6ff' },
      children: [
        new TextRun({
          text: isEn
            ? `  NOTE: Solutions, answer keys & diagrams are NOT included in this .docx file. To check solutions or get AI grading, open Synapse → Exam Bank and search code: ${examCode}.`
            : `  LƯU Ý BẢO MẬT ĐÁP ÁN: File .docx này chỉ gồm Đề bài (KHÔNG kèm lời giải hay kết quả). Để xem lời giải chi tiết, hình vẽ minh họa và chấm điểm AI, truy cập web Synapse → Ngân hàng đề và nhập Mã đề: ${examCode}.`,
          bold: true,
          size: 19,
          color: '1e3a8a'
        })
      ]
    })
  ];

  let lastSectionHeading: string | null = null;

  for (const q of exam.questions) {
    const secHeading = getSectionHeadingForQuestion(q.number, isEn);
    if (secHeading && secHeading !== lastSectionHeading) {
      lastSectionHeading = secHeading;
      children.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: secHeading,
              bold: true,
              size: 24,
              color: '1e40af'
            })
          ]
        })
      );
    }

    children.push(
      new Paragraph({
        spacing: { before: 140, after: 60 },
        children: [
          new TextRun({
            text: `${q.number}${q.points ? ` (${q.points})` : ''}:`,
            bold: true,
            size: 22,
            color: '0f172a'
          })
        ]
      })
    );

    const formattedContent = formatExamMathForDocx(q.content);
    const lines = formattedContent.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 60 },
          children: [
            new TextRun({
              text: line,
              size: 22,
              color: '1e293b'
            })
          ]
        })
      );
    }
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 320, after: 80 },
      children: [
        new TextRun({
          text: isEn ? '--- END OF EXAM PAPER ---' : '--- HẾT ---',
          bold: true,
          size: 24
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: isEn
            ? `Enter Exam Code ${examCode} on the web to view detailed solutions & diagrams.`
            : `Tra cứu lời giải chi tiết + hình vẽ bằng cách nhập Mã đề ${examCode} trực tiếp trên web Synapse.`,
          italics: true,
          size: 19,
          color: '64748b'
        })
      ]
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 900, right: 900, bottom: 900, left: 900 }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeCode = examCode.replace(/[^A-Za-z0-9_-]/g, '_');
  a.href = url;
  a.download = `De_Thi_${safeCode}_Khong_Dap_An.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
