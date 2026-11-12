import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Enable body parsing for JSON and base64 payloads (up to 20MB for images)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI with recommended telemetry
const getGenAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

/**
 * API: Analyze problem from image (OCR) or raw text and synthesize verified test suite
 */
app.post('/api/gemini/analyze-problem', async (req: Request, res: Response) => {
  try {
    const { text, imageBase64, mimeType } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Vui lòng cung cấp văn bản hoặc hình ảnh đề bài' });
    }

    const ai = getGenAI();

    const parts: any[] = [];

    if (imageBase64) {
      // Strip data url prefix if present
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64
        }
      });
    }

    const promptText = `
Bạn là Giám thị trưởng và Chuyên gia chấm thi Tin học quốc tế (IOI / ICPC / VNOI).
Nhiệm vụ của bạn:
1. Đọc và phân tích kỹ lưỡng đề bài được cung cấp qua hình ảnh (OCR) hoặc văn bản.
2. Tách rõ:
   - title: Tiêu đề bài toán (ngắn gọn, chuẩn tin học, tiếng Việt).
   - description: Toàn bộ nội dung yêu cầu bài toán (rõ ràng, không bị thiếu thông tin).
   - inputFormat: Quy cách dữ liệu đầu vào.
   - outputFormat: Quy cách dữ liệu đầu ra.
   - constraints: Các ràng buộc thời gian, bộ nhớ, giá trị N, A[i].
3. RẤT QUAN TRỌNG: Hãy TỰ GIẢI bài toán này một cách chính xác tuyệt đối, sau đó sinh bộ Test Cases:
   - sampleCases: Các test mẫu theo đúng đề bài (hoặc 1-2 test cơ bản) với explanation chi tiết.
   - hiddenCases: Sinh 5 đến 7 test ẩn kiểm tra các trường hợp biên nghiêm ngặt:
     + Giá trị cực tiểu (e.g. N nhỏ nhất, 0, số âm nếu cho phép).
     + Giá trị cực đại (boundary case).
     + Trường hợp đặc biệt (các phần tử bằng nhau, mảng đã sắp xếp, v.v.).
   - MỖI TEST CASE PHẢI CÓ 'input' VÀ 'expectedOutput' ĐƯỢC BẠN TÍNH TOÁN ĐÚNG 100%! Không được bịa đặt output ngẫu nhiên!
4. Đưa ra mã nguồn tham khảo (referenceCpp và referencePython) giải đúng bài toán này.

${text ? `Dữ liệu văn bản người dùng cung cấp:\n${text}` : ''}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `You are an elite competitive programming judge. Extract the problem from user input (OCR/text) and output strict JSON with keys: title (string), description (string), inputFormat (string), outputFormat (string), constraints (array of strings), sampleCases (array of objects { id, input, expectedOutput, isSample: true, explanation }), hiddenCases (array of objects { id, input, expectedOutput, isSample: false }), referenceCpp (string), referencePython (string). Ensure expectedOutput is 100% mathematically and algorithmically accurate.`
      }
    });

    const jsonStr = (response.text || '{}').trim();
    const parsedData = JSON.parse(jsonStr);

    return res.json({
      success: true,
      problem: {
        id: `CUSTOM_${Date.now()}`,
        ...parsedData
      }
    });
  } catch (err: any) {
    console.error('Error analyzing problem with Gemini:', err);
    return res.status(500).json({
      error: err?.message || 'Lỗi khi phân tích đề bài bằng AI',
      fallback: true
    });
  }
});

/**
 * API: Run / Judge code with Gemini verification for complex languages
 */
app.post('/api/gemini/run-code', async (req: Request, res: Response) => {
  try {
    const { code, language, input, problemDesc } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code không được để trống' });
    }

    const ai = getGenAI();
    const prompt = `
Bạn là trình thông dịch & thực thi mã nguồn ${language === 'cpp' ? 'C++20' : 'Python 3'}.
Dưới đây là mã nguồn của thí sinh:
\`\`\`${language}
${code}
\`\`\`

Dữ liệu đầu vào (stdin):
\`\`\`
${input || ''}
\`\`\`

Yêu cầu bài toán (nếu có):
${problemDesc || 'Chạy đúng theo luồng I/O của mã nguồn'}

Hãy mô phỏng việc biên dịch và chạy chương trình trên với stdin đã cho:
1. Nếu mã có lỗi cú pháp hoặc runtime error, trả về isError: true và stderr.
2. Nếu mã chạy bình thường, tính toán chính xác stdout mà chương trình in ra console (chỉ in nội dung stdout thuần, không kèm chú thích hay markdown).
Trả về JSON định dạng: { "stdout": string, "stderr": string, "isError": boolean, "runtimeMs": number }
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse((response.text || '{}').trim());
    return res.json(result);
  } catch (err: any) {
    console.error('Error running code via Gemini:', err);
    return res.status(500).json({ error: err?.message || 'Lỗi thực thi mã' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`EduClassroom 360 server running on http://${HOST}:${PORT}`);
  });
}

startServer();
