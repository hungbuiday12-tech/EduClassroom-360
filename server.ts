import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

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
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY chưa được cấu hình trong môi trường máy chủ.');
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// =====================================================================
// PERSISTENT ONLINE ARENA & WEEKLY LEADERBOARD STORE + REAL-TIME SSE
// =====================================================================
type ArenaSubjectServer = 'math' | 'physics' | 'cs';

interface ArenaAttemptRecord {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  weekId: string;
  dateKey: string;
  subject: ArenaSubjectServer;
  mode: 'mcq' | 'essay';
  score: number;
  correctCount?: number;
  totalQuestions?: number;
  durationSec: number;
  summary: string;
  createdAt: string;
}

interface WeeklyLeaderboardRecord {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  weekId: string;
  mathBest: number | null;
  mathAvg: number | null;
  mathAttempts: number;
  physicsBest: number | null;
  physicsAvg: number | null;
  physicsAttempts: number;
  csBest: number | null;
  csAvg: number | null;
  csAttempts: number;
  overallAvg: number;
  totalAttempts: number;
  totalTimeSec: number;
  updatedAt: string;
}

interface ArenaDatabase {
  attempts: ArenaAttemptRecord[];
}

const ARENA_DB_PATH = path.resolve(process.cwd(), '.arena_db.json');

function loadArenaDb(): ArenaDatabase {
  try {
    if (fs.existsSync(ARENA_DB_PATH)) {
      const raw = fs.readFileSync(ARENA_DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.attempts)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read .arena_db.json, initializing clean store:', err);
  }
  return { attempts: [] };
}

function saveArenaDb(data: ArenaDatabase) {
  try {
    fs.writeFileSync(ARENA_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist .arena_db.json:', err);
  }
}

let arenaDb: ArenaDatabase = loadArenaDb();
const sseClients = new Set<Response>();

function computeWeeklyLeaderboard(weekId: string): WeeklyLeaderboardRecord[] {
  const weekAttempts = arenaDb.attempts.filter((a) => a.weekId === weekId);
  const byUser = new Map<string, ArenaAttemptRecord[]>();

  for (const att of weekAttempts) {
    const list = byUser.get(att.userId) || [];
    list.push(att);
    byUser.set(att.userId, list);
  }

  const rows: WeeklyLeaderboardRecord[] = [];

  for (const [userId, list] of byUser.entries()) {
    const latest = list[list.length - 1];
    const calcSubject = (subj: ArenaSubjectServer) => {
      const subList = list.filter((a) => a.subject === subj);
      if (subList.length === 0) return { best: null, avg: null, count: 0 };
      const sum = subList.reduce((s, a) => s + a.score, 0);
      const best = Math.max(...subList.map((a) => a.score));
      const avg = Math.round((sum / subList.length) * 10) / 10;
      return { best, avg, count: subList.length };
    };

    const math = calcSubject('math');
    const physics = calcSubject('physics');
    const cs = calcSubject('cs');

    const subjectAvgs = [math.avg, physics.avg, cs.avg].filter(
      (v): v is number => v !== null
    );
    const overallAvg =
      subjectAvgs.length > 0
        ? Math.round((subjectAvgs.reduce((a, b) => a + b, 0) / subjectAvgs.length) * 10) / 10
        : 0;

    const totalTimeSec = list.reduce((s, a) => s + (a.durationSec || 0), 0);

    rows.push({
      id: `${weekId}_${userId}`,
      userId,
      username: latest.username,
      displayName: latest.displayName,
      weekId,
      mathBest: math.best,
      mathAvg: math.avg,
      mathAttempts: math.count,
      physicsBest: physics.best,
      physicsAvg: physics.avg,
      physicsAttempts: physics.count,
      csBest: cs.best,
      csAvg: cs.avg,
      csAttempts: cs.count,
      overallAvg,
      totalAttempts: list.length,
      totalTimeSec,
      updatedAt: latest.createdAt
    });
  }

  rows.sort((a, b) => {
    if (b.overallAvg !== a.overallAvg) return b.overallAvg - a.overallAvg;
    if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts;
    return a.totalTimeSec - b.totalTimeSec;
  });

  return rows;
}

function broadcastArenaUpdate(weekId: string) {
  const payload = JSON.stringify({
    type: 'arena:update',
    weekId,
    leaderboard: computeWeeklyLeaderboard(weekId),
    timestamp: Date.now()
  });
  for (const res of sseClients) {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }
}

app.get('/api/arena/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  const keepAlive = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(keepAlive);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
});

app.get('/api/arena/state', (req: Request, res: Response) => {
  const weekId = String(req.query.weekId || '').trim();
  const dateKey = String(req.query.dateKey || '').trim();
  const userId = String(req.query.userId || '').trim();

  if (!weekId) {
    return res.status(400).json({ error: 'Thiếu tham số weekId' });
  }

  const leaderboard = computeWeeklyLeaderboard(weekId);
  const userWeekAttempts = userId
    ? arenaDb.attempts.filter((a) => a.weekId === weekId && a.userId === userId)
    : [];

  const userAttemptsToday: Record<ArenaSubjectServer, ArenaAttemptRecord | null> = {
    math: null,
    physics: null,
    cs: null
  };

  if (userId && dateKey) {
    for (const subj of ['math', 'physics', 'cs'] as ArenaSubjectServer[]) {
      userAttemptsToday[subj] =
        arenaDb.attempts.find(
          (a) => a.userId === userId && a.dateKey === dateKey && a.subject === subj
        ) || null;
    }
  }

  return res.json({
    weekId,
    dateKey,
    leaderboard,
    userAttemptsToday,
    userWeekAttempts
  });
});

app.post('/api/arena/submit', (req: Request, res: Response) => {
  const {
    userId,
    username,
    displayName,
    weekId,
    dateKey,
    subject,
    mode,
    score,
    correctCount,
    totalQuestions,
    durationSec,
    summary
  } = req.body;

  if (!userId || !weekId || !dateKey || !subject || !mode || typeof score !== 'number') {
    return res.status(400).json({ error: 'Dữ liệu nộp bài thi đấu không hợp lệ.' });
  }

  if (!['math', 'physics', 'cs'].includes(subject)) {
    return res.status(400).json({ error: 'Môn thi đấu không hợp lệ.' });
  }

  // Enforce strictly 1 attempt per subject per day
  const alreadyDoneToday = arenaDb.attempts.find(
    (a) => a.userId === userId && a.dateKey === dateKey && a.subject === subject
  );

  if (alreadyDoneToday) {
    return res.status(409).json({
      error: 'Bạn đã hoàn thành lượt thi đấu môn này trong hôm nay (tối đa 1 lần/ngày/môn). Hãy quay lại vào ngày mai!',
      existingAttempt: alreadyDoneToday
    });
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(score * 10) / 10));
  const record: ArenaAttemptRecord = {
    id: `${userId}_${dateKey}_${subject}`,
    userId: String(userId).slice(0, 128),
    username: String(username || 'hocvien').slice(0, 40),
    displayName: String(displayName || 'Học viên').slice(0, 100),
    weekId: String(weekId).slice(0, 16),
    dateKey: String(dateKey).slice(0, 16),
    subject,
    mode: mode === 'essay' ? 'essay' : 'mcq',
    score: clampedScore,
    correctCount: typeof correctCount === 'number' ? correctCount : undefined,
    totalQuestions: typeof totalQuestions === 'number' ? totalQuestions : undefined,
    durationSec: Math.max(1, Math.min(7200, Math.round(Number(durationSec) || 60))),
    summary: String(summary || '').slice(0, 1000),
    createdAt: new Date().toISOString()
  };

  arenaDb.attempts.push(record);
  saveArenaDb(arenaDb);
  broadcastArenaUpdate(record.weekId);

  const leaderboard = computeWeeklyLeaderboard(record.weekId);
  const myEntry = leaderboard.find((e) => e.userId === record.userId) || null;

  return res.json({
    success: true,
    attempt: record,
    myEntry,
    leaderboard
  });
});

// =====================================================================
// GEMINI AI: SOCRATIC TUTOR (NEVER GIVES DIRECT SOLUTION!)
// =====================================================================
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { messages, context, language } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Vui lòng nhập câu hỏi hoặc nội dung bài học cần trợ giảng hỗ trợ.' });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjectLabel =
      context?.subject === 'math'
        ? isEn ? 'Mathematics' : 'Toán học'
        : context?.subject === 'physics'
        ? isEn ? 'Physics' : 'Vật lí'
        : context?.subject === 'cs'
        ? isEn ? 'Computer Science' : 'Tin học (C++ / Python)'
        : isEn ? 'STEM (Math, Physics, CS)' : 'Toán - Lí - Tin';

    const systemInstruction = isEn
      ? `You are a Socratic Mentor Teacher at EduClassroom 360 teaching ${subjectLabel} (Grades 9-12).
CRITICAL PEDAGOGICAL RULES (MUST OBEY 100%):
1. NEVER give the complete direct answer, final numeric solution, or full solution code immediately—even if the student begs "solve it for me".
2. FIRST DIAGNOSTIC STEP: Whenever a student shares a problem or says they are stuck without pinpointing the exact step, warmly greet them, outline at most 2-3 high-level stages, and ASK THEM WHICH SPECIFIC PART OR STEP THEY DO NOT UNDERSTAND (e.g., understanding the problem variables, which formula/theorem applies, algebraic transformation, or edge case).
3. TARGETED RE-EXPLANATION: Once the student tells you the specific part they don't understand, explain ONLY THAT SPECIFIC CONCEPT OR STEP thoroughly and concretely:
   - Use everyday intuition or geometric/physical analogies.
   - Format math/physics cleanly using KaTeX delimiters ($...$ for inline, $$...$$ for display; always use \\frac, never raw 'frac').
   - Give 1 mini concrete example or micro-step.
   - Finish with 1 gentle check-for-understanding question so the student attempts the next step themselves.
4. Keep formatting clean, encouraging, and structured (short paragraphs and bullet points).`
      : `Bạn là Giáo viên Trợ Giảng Socratic tận tâm tại EduClassroom 360 phụ trách môn ${subjectLabel} (Lớp 9 - 12).
NGUYÊN TẮC SƯ PHẠM BẮT BUỘC (TUÂN THỦ 100%):
1. TUYỆT ĐỐI KHÔNG GIẢI TRỰC TIẾP ra đáp án cuối cùng, kết quả số cuối, hay viết trọn vẹn code lời giải ngay cả khi học sinh xin "giải hộ em bài này".
2. BƯỚC HỎI CHẨN ĐOÁN: Khi học sinh mới đưa đề bài hoặc nói chung chung là "không biết làm / chưa hiểu", hãy tóm tắt ngắn gọn bức tranh tổng quan (2-3 ý chính của bài), sau đó **HỎI LẠI HỌC SINH XEM EM ĐANG KHÔNG HIỂU CỤ THỂ Ở PHẦN NÀO?** (Ví dụ: chưa hiểu đề hỏi gì, chưa nhớ định lý/công thức nào, vướng ở bước biến đổi nào, hay chưa hình dung được ý tưởng thuật toán?).
3. GIẢNG CỤ THỂ ĐÚNG PHẦN HỌC SINH CHƯA HIỂU: Khi học sinh đã chỉ ra phần chưa hiểu (ví dụ: "Em chưa hiểu tại sao dùng định lý Vi-ét chỗ này", "Em quên cách tìm R tương đương mạch song song", "Em chưa hiểu vòng lặp chạy thế nào"):
   - Hãy giảng thật kỹ, thật cụ thể và dễ hiểu ĐÚNG phần kiến thức/bước đó bằng ví dụ nhỏ trực quan, hình dung thực tế và từng bước biến đổi nhỏ.
   - Mọi công thức Toán/Lí PHẢI viết đúng chuẩn KaTeX ($...$ hoặc $$...$$, dùng \\frac{a}{b}, \\sqrt{}, \\vec{}, \\Delta... tuyệt đối không viết thiếu dấu gạch chéo).
   - Cuối câu trả lời luôn đặt **1 câu hỏi gợi mở nhỏ** để học sinh tự thử áp dụng bước tiếp theo hoặc xác nhận đã thông suốt chưa trước khi đi tiếp.
4. Giọng điệu thân thiện, khích lệ ("Thầy/Cô", "Em"), trình bày rõ ràng theo ý ngắn.`;

    const contextHeader = [
      context?.topicTitle ? `Chủ đề / Bài học hiện tại: ${context.topicTitle}` : '',
      context?.grade ? `Khối lớp / Trình độ: ${context.grade}` : '',
      context?.problemStatement ? `Nội dung đề bài tham chiếu:\n${context.problemStatement}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    const contents = messages.map((msg: any, idx: number) => {
      const parts: any[] = [];
      if (msg.imageBase64) {
        const cleanBase64 = String(msg.imageBase64).replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: msg.mimeType || 'image/png',
            data: cleanBase64
          }
        });
      }
      const textVal =
        idx === 0 && contextHeader && msg.role === 'user'
          ? `[Ngữ cảnh lớp học]\n${contextHeader}\n\n[Học sinh hỏi]\n${msg.text}`
          : String(msg.text || '');
      parts.push({ text: textVal });

      return {
        role: msg.role === 'tutor' ? 'model' : 'user',
        parts
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction
      }
    });

    const reply = (response.text || '').trim();
    return res.json({
      success: true,
      reply: reply || 'Thầy/Cô đang lắng nghe đây. Em hãy cho biết cụ thể em đang vướng ở khái niệm hay bước biến đổi nào nhé!'
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/tutor:', err);
    return res.status(500).json({
      error: err?.message || 'Không thể kết nối AI Trợ Giảng lúc này. Vui lòng thử lại.'
    });
  }
});

// =====================================================================
// GEMINI AI: GRADE ESSAY SUBMISSION (TỰ LUẬN THI ĐẤU)
// =====================================================================
app.post('/api/gemini/grade-essay', async (req: Request, res: Response) => {
  try {
    const {
      subject,
      title,
      prompt,
      rubricChecklist,
      referenceSolution,
      studentAnswer,
      imageBase64,
      mimeType,
      language
    } = req.body;

    if (!studentAnswer?.trim() && !imageBase64) {
      return res.status(400).json({ error: 'Vui lòng nhập bài giải tự luận hoặc tải ảnh bài làm trước khi nộp.' });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = String(imageBase64).replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64
        }
      });
    }

    parts.push({
      text: `
Bạn là Giám khảo chấm thi Tự luận môn ${subject} (thang điểm 0 đến 100).
ĐỀ BÀI (${title}):
${prompt}

BIỂU ĐIỂM CHẤM (RUBRIC):
${(rubricChecklist || []).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

ĐÁP ÁN THAM KHẢO CHUẨN:
${referenceSolution}

BÀI LÀM CỦA THÍ SINH:
${studentAnswer || '(Thí sinh nộp ảnh bài làm viết tay đính kèm)'}

Hãy chấm điểm công tâm, chính xác từng bước lập luận/công thức/code của thí sinh (0-100 điểm). Nếu bài làm trống hoặc lạc đề hoàn toàn cho 0 điểm. Nếu đúng hướng nhưng thiếu điều kiện/kết luận thì trừ điểm đúng phần thiếu. Trả về đúng JSON schema. Ngôn ngữ nhận xét: ${isEn ? 'English' : 'Tiếng Việt (dùng KaTeX $...$ cho công thức nếu cần)'}.
`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Điểm tổng từ 0 đến 100' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các điểm đúng và làm tốt trong bài'
            },
            mistakes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các lỗi sai, thiếu điều kiện hoặc phần còn thiếu'
            },
            stepScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterion: { type: Type.STRING },
                  earned: { type: Type.NUMBER },
                  max: { type: Type.NUMBER },
                  comment: { type: Type.STRING }
                }
              }
            },
            detailedFeedback: { type: Type.STRING, description: 'Nhận xét tổng quát của giám khảo' },
            suggestedStudyTip: { type: Type.STRING, description: 'Gợi ý ôn tập bước tiếp theo' }
          }
        }
      }
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    const clampedScore = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));

    return res.json({
      success: true,
      evaluation: {
        score: clampedScore,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
        stepScores: Array.isArray(parsed.stepScores) ? parsed.stepScores : [],
        detailedFeedback: parsed.detailedFeedback || 'Đã hoàn thành chấm bài tự luận.',
        suggestedStudyTip: parsed.suggestedStudyTip || 'Hãy xem lại biểu điểm từng ý và hỏi Gia sư AI ở bước chưa vững.'
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/grade-essay:', err);
    return res.status(500).json({
      error: err?.message || 'Không thể chấm bài tự luận bằng AI lúc này.'
    });
  }
});

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
      model: 'gemini-4-hydrogen',
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
      model: 'gemini-4-hydrogen',
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
