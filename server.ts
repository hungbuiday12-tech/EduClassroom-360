import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

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
// RESILIENT GEMINI HELPER (TIMEOUT + RETRY + FALLBACK MODEL)
// =====================================================================
function extractCleanErrorMessage(err: any): string {
  const raw = err?.message || String(err || 'Lỗi kết nối AI.');
  let candidate = raw;

  if (typeof raw === 'string' && raw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(raw.trim());
      candidate = parsed?.error?.message || parsed?.message || raw;
    } catch {}
  }

  if (/high demand|unavailable|503|overloaded/i.test(candidate)) {
    return 'Hệ thống AI đang quá tải tạm thời. Vui lòng thử lại sau vài giây.';
  }
  if (/resource_exhausted|quota|429/i.test(candidate)) {
    return 'Hạn mức AI tạm thời đạt giới hạn. Vui lòng chờ một lát rồi thử lại.';
  }
  if (/api_key|permission_denied|403|api key/i.test(candidate)) {
    return 'Khóa API AI chưa hợp lệ hoặc thiếu quyền. Vui lòng kiểm tra Settings > Secrets.';
  }
  if (/timeout/i.test(candidate)) {
    return 'AI phản hồi quá lâu (timeout). Vui lòng thử lại.';
  }
  return candidate;
}

function isTransientGeminiError(err: any): boolean {
  const msg = `${err?.status || ''} ${err?.code || ''} ${err?.message || ''}`.toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('timeout') ||
    msg.includes('econnreset') ||
    msg.includes('fetch failed')
  );
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms (${label})`)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

function safeParseGeminiJson<T>(rawText: string | undefined | null, fallback: T): T {
  const raw = (rawText || '').trim();
  if (!raw) return fallback;
  const unfenced = raw
    .replace(/^```(?:json|JSON)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(unfenced) as T;
  } catch {
    const startObj = unfenced.indexOf('{');
    const startArr = unfenced.indexOf('[');
    const start =
      startObj === -1 ? startArr : startArr === -1 ? startObj : Math.min(startObj, startArr);
    if (start === -1) return fallback;
    const endObj = unfenced.lastIndexOf('}');
    const endArr = unfenced.lastIndexOf(']');
    const end = Math.max(endObj, endArr);
    if (end > start) {
      try {
        return JSON.parse(unfenced.slice(start, end + 1)) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

interface GeminiCallOptions {
  ai: GoogleGenAI;
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  thinkingLevel?: ThinkingLevel;
  timeoutMs?: number;
}

async function callGeminiWithFallback({
  ai,
  contents,
  systemInstruction,
  responseMimeType,
  responseSchema,
  thinkingLevel = ThinkingLevel.LOW,
  timeoutMs = 15000
}: GeminiCallOptions) {
  const buildConfig = (model: string) => {
    const cfg: Record<string, any> = {};
    if (systemInstruction) cfg.systemInstruction = systemInstruction;
    if (responseMimeType) cfg.responseMimeType = responseMimeType;
    if (responseSchema) cfg.responseSchema = responseSchema;
    if (model === 'gemini-4-hydrogen') {
      cfg.thinkingConfig = { thinkingLevel };
    } else if (model === 'gemini-3.1-flash-lite') {
      cfg.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
    }
    return cfg;
  };

  // Attempt 1: Primary gemini-4-hydrogen
  try {
    return await withTimeout(
      ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: buildConfig('gemini-4-hydrogen')
      }),
      timeoutMs,
      'gemini-4-hydrogen'
    );
  } catch (err1: any) {
    if (!isTransientGeminiError(err1)) {
      throw err1;
    }
    console.warn('Primary gemini-4-hydrogen transient issue, falling back:', err1?.message || err1);
  }

  // Attempt 2: Fast fallback to gemini-3.1-flash-lite after brief backoff
  await new Promise((r) => setTimeout(r, 500));
  try {
    return await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: buildConfig('gemini-3.1-flash-lite')
      }),
      timeoutMs,
      'gemini-3.1-flash-lite'
    );
  } catch (err2: any) {
    if (!isTransientGeminiError(err2)) {
      throw err2;
    }
    // Attempt 3: One final retry on gemini-3.1-flash-lite
    await new Promise((r) => setTimeout(r, 700));
    return await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: buildConfig('gemini-3.1-flash-lite')
      }),
      timeoutMs,
      'gemini-3.1-flash-lite-retry'
    );
  }
}

// =====================================================================
// GEMINI AI: 3 DEDICATED SUBJECT AIs (TOÁN · LÍ · TIN) x 3 MODES
// Uses real @google/genai ai.chats + SSE streaming & strict mode instructions
// =====================================================================
function buildTutorSystemInstruction(
  subjKey: 'math' | 'physics' | 'cs',
  modeKey: 'explain_no_answer' | 'full_solution' | 'diagnostic_roadmap',
  isEn: boolean,
  context?: { topicTitle?: string; grade?: string; problemStatement?: string }
): string {
  const persona =
    subjKey === 'math'
      ? isEn
        ? 'EduMath AI — Senior Mathematics Specialist AI (Algebra, Calculus, 2D/3D Oxyz Geometry, Combinatorics & Olympiad Math for Grades 9–12)'
        : 'AI Toán Học — Chuyên gia Toán học THCS/THPT & Chuyên Toán (Đại số, Giải tích, Hình học Oxy/Oxyz, Tổ hợp & Xác suất Lớp 9–12)'
      : subjKey === 'physics'
      ? isEn
        ? 'EduPhysics AI — Senior Physics Specialist AI (Mechanics, Electricity & Magnetism, Oscillations & Waves, Optics, Quantum & Nuclear Physics for Grades 9–12 & 2D/3D Labs)'
        : 'AI Vật Lí — Chuyên gia Vật Lí THCS/THPT & Thí nghiệm 2D/3D (Cơ học, Điện từ, Dao động & Sóng, Quang học, Hạt nhân Lớp 9–12)'
      : isEn
      ? 'EduCode AI — Senior Computer Science & Competitive Programming AI (C++20 STL, Python 3, VNOI/IOI/ICPC, Big-O Time/Space, Graphs, DP, Segment Tree & Edge Test Analysis)'
      : 'AI Tin Học — Chuyên gia Thuật toán & Lập trình thi đấu (C++20 STL, Python 3, VNOI/IOI/ICPC, Big-O, Quy hoạch động, Đồ thị, CTDL & Test biên)';

  const domainFocusVi =
    subjKey === 'math'
      ? 'Luôn kiểm tra điều kiện xác định, miền giá trị, tập nghiệm, đạo hàm/dấu và biểu diễn hình học trực quan khi giải thích.'
      : subjKey === 'physics'
      ? 'Luôn kiểm tra hệ quy chiếu, chiều dương, véc-tơ lực, đơn vị chuẩn SI (m, kg, s, A, V, Ω) và bản chất định luật bảo toàn.'
      : 'Luôn kiểm tra giới hạn $N$, độ phức tạp thời gian/bộ nhớ $\\mathcal{O}(\\dots)$, tràn số `long long` ($10^9 \\times 10^9$), và test biên ($N=0, 1$).';

  const domainFocusEn =
    subjKey === 'math'
      ? 'Always verify domain conditions, edge cases, derivatives/signs, and geometric intuition.'
      : subjKey === 'physics'
      ? 'Always check reference frames, sign conventions, vectors, SI units (m, kg, s, A, V, Ω), and conservation laws.'
      : 'Always check input constraints $N$, Big-O Time/Space complexity, 64-bit `long long` overflow, and edge tests ($N=0, 1$).';

  const katexRuleVi =
    'Mọi công thức Toán/Lí/Độ phức tạp PHẢI viết chuẩn KaTeX ($...$ nội dòng hoặc $$...$$ khối riêng, luôn dùng \\frac{a}{b}, \\sqrt{}, \\vec{}, \\Delta — tuyệt đối không viết frac thiếu dấu gạch chéo).';
  const katexRuleEn =
    'Format ALL math/physics/complexity expressions in KaTeX ($...$ inline or $$...$$ block; always write \\frac{a}{b}, never raw frac).';

  const contextLines = [
    context?.topicTitle ? `Chủ đề / Bài học hiện tại: ${context.topicTitle}` : '',
    context?.grade ? `Khối lớp / Trình độ: ${context.grade}` : '',
    context?.problemStatement ? `Nội dung / Đề bài tham chiếu:\n${context.problemStatement}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  let modeRules = '';
  if (modeKey === 'explain_no_answer') {
    modeRules = isEn
      ? `OPERATING MODE 1: CLARIFY DOUBTS & GUIDED EXPLANATION (NO FINAL ANSWER).
STRICT RULES:
1. NEVER reveal the final numeric answer, final multiple-choice option letter (A/B/C/D), or complete solution code — even if the student insists.
2. Briefly analyze what the problem gives and what it asks for, then identify the core concept/theorem/algorithm needed.
3. If the student hasn't specified which part confuses them, ask clearly which exact step, formula, or condition they are stuck on. Once they specify, explain that exact concept/step deeply and clearly with 1 small analogous example.
4. End with 1 short guiding question so the student attempts the next step themselves.`
      : `CHẾ ĐỘ 1: GIẢI ĐÁP THẮC MẮC & GIẢNG CHỖ CHƯA HIỂU (TUYỆT ĐỐI KHÔNG ĐƯA KẾT QUẢ CUỐI).
NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG tiết lộ đáp án số cuối, chữ cái trắc nghiệm (A/B/C/D) hay toàn bộ code hoàn chỉnh — kể cả khi học sinh nài nỉ.
2. Phân tích rõ đề bài đang cho giả thiết gì, hỏi gì và cần kiến thức / công thức / thuật toán cốt lõi nào.
3. Nếu học sinh chưa nêu rõ chỗ vướng, hãy hỏi lại xem em đang chưa hiểu cụ thể ở phần nào. Khi học sinh đã chỉ ra phần chưa hiểu, hãy giảng thật kỹ, trực quan đúng bước đó (có thể lấy 1 ví dụ minh họa nhỏ tương tự).
4. Kết thúc bằng 1 câu hỏi gợi mở để học sinh tự suy nghĩ và làm tiếp bước kế tiếp.`;
  } else if (modeKey === 'full_solution') {
    modeRules = isEn
      ? `OPERATING MODE 2: PROBLEM SUMMARY, METHOD & COMPLETE DETAILED SOLUTION.
STRUCTURE YOUR RESPONSE CLEARLY:
1. **Problem Summary**: Concisely list given data, constraints, and target to find.
2. **Method & Strategy**: Explain why this theorem/formula/algorithm works.
3. **Step-by-Step Detailed Solution**: Show every derivation step cleanly${
          subjKey === 'cs' ? ' plus clean C++20 / Python 3 code with comments and Big-O complexity' : ''
        }.
4. **Final Result & Pitfalls**: State the exact final answer clearly and common mistakes to avoid.`
      : `CHẾ ĐỘ 2: TÓM TẮT ĐỀ, NÊU CÁCH LÀM & ĐƯA RA LỜI GIẢI CỤ THỂ.
TRÌNH BÀY RÕ RÀNG THEO 4 PHẦN:
1. **Tóm tắt & Phân tích đề bài**: Liệt kê giả thiết, điều kiện ràng buộc và đại lượng cần tìm.
2. **Phương pháp & Hướng giải**: Giải thích lý do chọn công thức, định lí hay thuật toán này.
3. **Lời giải chi tiết từng bước**: Biến đổi tường minh, giải thích từng bước${
          subjKey === 'cs'
            ? ' (kèm mã nguồn C++20 hoặc Python 3 chuẩn thi đấu, có chú thích rõ ràng và phân tích độ phức tạp Time/Space)'
            : ''
        }.
4. **Kết luận đáp án cuối cùng & Lưu ý**: Chốt rõ kết quả cuối và các bẫy dễ mất điểm.`;
  } else {
    modeRules = isEn
      ? `OPERATING MODE 3: SKILL DIAGNOSIS, MAJOR ORIENTATION & STUDY ROADMAP ADVISOR.
Act as a senior academic mentor for ${subjKey.toUpperCase()}. Evaluate strengths/gaps from the student's questions, recommend concrete milestones, study hours/day, specific topics, and how ${subjKey.toUpperCase()} connects to their target university major.`
      : `CHẾ ĐỘ 3: ĐÁNH GIÁ TRÌNH ĐỘ, ĐỊNH HƯỚNG CHUYÊN NGÀNH & TƯ VẤN SƠ ĐỒ HỌC TẬP.
Đóng vai cố vấn học thuật chuyên sâu môn ${
          subjKey === 'math' ? 'Toán học' : subjKey === 'physics' ? 'Vật lí' : 'Tin học'
        }. Phân tích điểm mạnh/yếu từ chia sẻ của học sinh, gợi ý lộ trình học từng tuần, số phút mỗi ngày, chuyên đề trọng tâm và định hướng gắn với chuyên ngành tương lai.`;
  }

  return [
    persona,
    isEn ? domainFocusEn : domainFocusVi,
    modeRules,
    isEn ? katexRuleEn : katexRuleVi,
    contextLines ? `\n[Ngữ cảnh bài học hiện tại]\n${contextLines}` : ''
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildGeminiChatHistoryAndLastTurn(messages: any[]) {
  const cleanMessages = messages.filter(
    (m: any) => m && (String(m.text || '').trim().length > 0 || m.imageBase64)
  );
  const firstUserIdx = cleanMessages.findIndex((m: any) => m.role === 'user');
  const trimmed = firstUserIdx >= 0 ? cleanMessages.slice(firstUserIdx) : cleanMessages;

  const toParts = (msg: any) => {
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
    if (String(msg.text || '').trim() || parts.length === 0) {
      parts.push({ text: String(msg.text || '') });
    }
    return parts;
  };

  if (trimmed.length === 0) {
    return { history: [], lastMessageParts: [{ text: '' }] };
  }

  const history = trimmed.slice(0, -1).map((msg: any) => ({
    role: msg.role === 'tutor' ? ('model' as const) : ('user' as const),
    parts: toParts(msg)
  }));

  const lastMessageParts = toParts(trimmed[trimmed.length - 1]);
  return { history, lastMessageParts };
}

app.post('/api/gemini/tutor/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendSse = (payload: Record<string, any>) => {
    try {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch {
      // client closed
    }
  };

  try {
    const { messages, context, language } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      sendSse({ error: 'Vui lòng nhập câu hỏi hoặc nội dung cần trợ giảng hỗ trợ.' });
      return res.end();
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjKey: 'math' | 'physics' | 'cs' =
      context?.subject === 'physics' || context?.subject === 'cs' ? context.subject : 'math';
    const modeKey: 'explain_no_answer' | 'full_solution' | 'diagnostic_roadmap' =
      context?.mode === 'full_solution' || context?.mode === 'diagnostic_roadmap'
        ? context.mode
        : 'explain_no_answer';

    const systemInstruction = buildTutorSystemInstruction(subjKey, modeKey, isEn, context);
    const { history, lastMessageParts } = buildGeminiChatHistoryAndLastTurn(messages);

    const runStreamWithModel = async (modelName: string) => {
      const chat = ai.chats.create({
        model: modelName,
        history,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel:
              modelName === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
          }
        }
      });

      const stream = await chat.sendMessageStream({
        message: lastMessageParts.length === 1 && lastMessageParts[0].text ? lastMessageParts[0].text : lastMessageParts
      });

      let fullText = '';
      for await (const chunk of stream) {
        const piece = chunk.text || '';
        if (piece) {
          fullText += piece;
          sendSse({ delta: piece });
        }
      }
      return fullText;
    };

    let finalReply = '';
    try {
      finalReply = await runStreamWithModel('gemini-4-hydrogen');
    } catch (err1: any) {
      if (!isTransientGeminiError(err1)) throw err1;
      console.warn('Primary stream transient error, retrying with gemini-3.1-flash-lite:', err1?.message || err1);
      finalReply = await runStreamWithModel('gemini-3.1-flash-lite');
    }

    sendSse({ done: true, reply: finalReply.trim() });
    return res.end();
  } catch (err: any) {
    console.error('Error in /api/gemini/tutor/stream:', err);
    sendSse({ error: extractCleanErrorMessage(err) });
    return res.end();
  }
});

app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { messages, context, language } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Vui lòng nhập câu hỏi hoặc nội dung bài học cần trợ giảng hỗ trợ.' });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjKey: 'math' | 'physics' | 'cs' =
      context?.subject === 'physics' || context?.subject === 'cs' ? context.subject : 'math';
    const modeKey: 'explain_no_answer' | 'full_solution' | 'diagnostic_roadmap' =
      context?.mode === 'full_solution' || context?.mode === 'diagnostic_roadmap'
        ? context.mode
        : 'explain_no_answer';

    const systemInstruction = buildTutorSystemInstruction(subjKey, modeKey, isEn, context);
    const { history, lastMessageParts } = buildGeminiChatHistoryAndLastTurn(messages);

    const runChatWithModel = async (modelName: string) => {
      const chat = ai.chats.create({
        model: modelName,
        history,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel:
              modelName === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
          }
        }
      });
      return await withTimeout(
        chat.sendMessage({
          message:
            lastMessageParts.length === 1 && lastMessageParts[0].text
              ? lastMessageParts[0].text
              : lastMessageParts
        }),
        35000,
        `tutor-${modelName}`
      );
    };

    let response;
    try {
      response = await runChatWithModel('gemini-4-hydrogen');
    } catch (err1: any) {
      if (!isTransientGeminiError(err1)) throw err1;
      console.warn('Primary chat transient error, retrying with gemini-3.1-flash-lite:', err1?.message || err1);
      response = await runChatWithModel('gemini-3.1-flash-lite');
    }

    const reply = (response.text || '').trim();
    if (!reply) {
      throw new Error('Gemini chưa trả về nội dung phản hồi. Vui lòng thử gửi lại.');
    }
    return res.json({
      success: true,
      reply
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/tutor:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

// =====================================================================
// GEMINI AI MODE 3: DIAGNOSTIC QUIZ GENERATOR & PERSONALIZED ROADMAP
// =====================================================================
function buildFallbackDiagnosticQuestions(subject: 'math' | 'physics' | 'cs', grade: string, isEn: boolean) {
  if (subject === 'physics') {
    return isEn
      ? [
          {
            id: 'q1',
            category: 'knowledge',
            topicTag: 'Mechanics & Energy',
            question: 'When a ball falls freely from height $h$ (ignoring air resistance), how does its mechanical energy behave?',
            options: ['Increases continuously', 'Decreases continuously', 'Remains conserved ($W_t + W_d = \\text{const}$)', 'Equals zero at mid-height'],
            correctIndex: 2
          },
          {
            id: 'q2',
            category: 'knowledge',
            topicTag: 'Oscillations & Waves',
            question: 'What is the period formula for a simple harmonic spring pendulum with mass $m$ and stiffness $k$?',
            options: ['$T = 2\\pi\\sqrt{\\frac{k}{m}}$', '$T = 2\\pi\\sqrt{\\frac{m}{k}}$', '$T = \\frac{1}{2\\pi}\\sqrt{\\frac{m}{k}}$', '$T = \\pi\\sqrt{\\frac{l}{g}}$'],
            correctIndex: 1
          },
          {
            id: 'q3',
            category: 'knowledge',
            topicTag: 'Electricity & Optics',
            question: 'In a parallel circuit with two resistors $R_1 = 6\\,\\Omega$ and $R_2 = 3\\,\\Omega$, what is the equivalent resistance?',
            options: ['$9\\,\\Omega$', '$4.5\\,\\Omega$', '$2\\,\\Omega$', '$1.5\\,\\Omega$'],
            correctIndex: 2
          },
          {
            id: 'q4',
            category: 'specialization',
            topicTag: 'Major Track Selection',
            question: 'Which engineering/science track excites you the most right now?',
            options: ['Electrical, Automation & Robotics', 'Semiconductors, Microchips & Applied Physics', 'Aerospace, Civil & Mechanical Engineering', 'High-School Physics Olympiad / University Entrance Exam']
          },
          {
            id: 'q5',
            category: 'specialization',
            topicTag: 'Learning Preference',
            question: 'How do you absorb new Physics concepts fastest?',
            options: ['Interactive 2D/3D & PhET simulations first', 'Deriving formulas step-by-step from first principles', 'Solving timed multiple-choice drills', 'Working through tough Olympiad essay problems']
          }
        ]
      : [
          {
            id: 'q1',
            category: 'knowledge',
            topicTag: 'Cơ học & Bảo toàn cơ năng',
            question: 'Khi một vật rơi tự do không ma sát từ độ cao $h$, cơ năng toàn phần $W = W_đ + W_t$ của vật thay đổi thế nào?',
            options: ['Tăng đều theo thời gian', 'Giảm dần khi gần chạm đất', 'Được bảo toàn không đổi tại mọi vị trí', 'Bằng $0$ tại vị trí nửa độ cao'],
            correctIndex: 2
          },
          {
            id: 'q2',
            category: 'knowledge',
            topicTag: 'Dao động điều hòa',
            question: 'Chu kì dao động điều hòa của con lắc lò xo gồm vật khối lượng $m$ và độ cứng $k$ là:',
            options: ['$T = 2\\pi\\sqrt{\\frac{k}{m}}$', '$T = 2\\pi\\sqrt{\\frac{m}{k}}$', '$T = \\frac{1}{2\\pi}\\sqrt{\\frac{m}{k}}$', '$T = 2\\pi\\sqrt{\\frac{g}{l}}$'],
            correctIndex: 1
          },
          {
            id: 'q3',
            category: 'knowledge',
            topicTag: 'Điện học & Mạch điện',
            question: 'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 3\\,\\Omega$ mắc song song với nhau. Điện trở tương đương $R_{tđ}$ bằng bao nhiêu?',
            options: ['$9\\,\\Omega$', '$4.5\\,\\Omega$', '$2\\,\\Omega$', '$0.5\\,\\Omega$'],
            correctIndex: 2
          },
          {
            id: 'q4',
            category: 'specialization',
            topicTag: 'Lựa chọn chuyên ngành',
            question: `Ở trình độ ${grade}, em muốn định hướng chuyên ngành gắn với Vật lí nào nhất?`,
            options: ['Kỹ thuật Điện - Tự động hóa - Robotics', 'Vi mạch bán dẫn - Vật lí kỹ thuật & AI phần cứng', 'Cơ khí chế tạo - Hàng không - Xây dựng', 'Ôn thi HSG / Chuyên Lí / Đạt 9+ THPT Quốc Gia']
          },
          {
            id: 'q5',
            category: 'specialization',
            topicTag: 'Phương pháp học tối ưu',
            question: 'Cách học nào giúp em nắm chắc bản chất Vật lí nhanh nhất?',
            options: ['Thao tác trực tiếp trên mô phỏng 2D/3D & PhET Colorado', 'Hiểu cặn kẽ chứng minh công thức từ gốc', 'Luyện đề trắc nghiệm bấm giờ tốc độ cao', 'Giải bài tập tự luận chuyên sâu nhiều bẫy']
          }
        ];
  }

  if (subject === 'cs') {
    return isEn
      ? [
          {
            id: 'q1',
            category: 'knowledge',
            topicTag: 'Complexity Analysis',
            question: 'What is the time complexity of Binary Search on a sorted array of $N$ elements?',
            options: ['$O(N)$', '$O(N \\log N)$', '$O(\\log N)$', '$O(1)$'],
            correctIndex: 2
          },
          {
            id: 'q2',
            category: 'knowledge',
            topicTag: 'Data Structures',
            question: 'Which data structure follows the LIFO (Last-In, First-Out) principle?',
            options: ['Queue', 'Stack', 'Binary Heap', 'Hash Map'],
            correctIndex: 1
          },
          {
            id: 'q3',
            category: 'knowledge',
            topicTag: 'Algorithms & DP',
            question: 'Which technique optimizes overlapping subproblems by caching previously computed states?',
            options: ['Brute Force Backtracking', 'Dynamic Programming (Memoization)', 'Bubble Sort', 'Linear Scan'],
            correctIndex: 1
          },
          {
            id: 'q4',
            category: 'specialization',
            topicTag: 'Major Track Selection',
            question: 'Which Computer Science specialization matches your career goal?',
            options: ['Competitive Programming (HSG / IOI / ICPC)', 'Artificial Intelligence & Data Science', 'Software Engineering & Full-Stack Web', 'Cybersecurity & Systems Architecture']
          },
          {
            id: 'q5',
            category: 'specialization',
            topicTag: 'Language & Practice Style',
            question: 'Which programming workflow do you prefer when practicing?',
            options: ['Fast C++20 STL & Online Judge stress-testing', 'Clean Python 3 prototyping & step-by-step tracing', 'Visualizing algorithms before coding', 'Solving real past Olympiad & University contest problems']
          }
        ]
      : [
          {
            id: 'q1',
            category: 'knowledge',
            topicTag: 'Độ phức tạp thuật toán',
            question: 'Độ phức tạp thời gian của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp gồm $N$ phần tử là:',
            options: ['$O(N)$', '$O(N \\log N)$', '$O(\\log N)$', '$O(1)$'],
            correctIndex: 2
          },
          {
            id: 'q2',
            category: 'knowledge',
            topicTag: 'Cấu trúc dữ liệu',
            question: 'Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Vào sau - Ra trước)?',
            options: ['Hàng đợi (Queue)', 'Ngăn xếp (Stack)', 'Danh sách liên kết', 'Cây khung nhỏ nhất'],
            correctIndex: 1
          },
          {
            id: 'q3',
            category: 'knowledge',
            topicTag: 'Quy hoạch động & Tối ưu',
            question: 'Kỹ thuật lưu kết quả các bài toán con gối nhau để tránh tính lại nhiều lần thuộc về phương pháp nào?',
            options: ['Vét cạn (Brute Force)', 'Quy hoạch động (Dynamic Programming)', 'Sắp xếp nổi bọt', 'Đệ quy không nhớ'],
            correctIndex: 1
          },
          {
            id: 'q4',
            category: 'specialization',
            topicTag: 'Lựa chọn chuyên ngành',
            question: 'Em muốn hướng tới chuyên ngành Tin học nào trong 1-3 năm tới?',
            options: ['Lập trình thi đấu (HSG Quốc Gia / Chuyên Tin / ICPC)', 'Trí tuệ nhân tạo (AI), Machine Learning & Khoa học dữ liệu', 'Kỹ thuật phần mềm & Phát triển Web/App', 'An toàn thông tin & Hệ thống nhúng']
          },
          {
            id: 'q5',
            category: 'specialization',
            topicTag: 'Ngôn ngữ & Phong cách code',
            question: 'Khi luyện bài trên website, em ưu tiên phong cách nào?',
            options: ['Code C++20 tốc độ cao kết hợp STL chuẩn thi đấu', 'Code Python 3 rõ ràng, tập trung tư duy thuật toán', 'Đọc phân tích mẫu và tự sinh thêm test biên', 'Thử thách với đề Chuyên Tin & Đánh giá năng lực']
          }
        ];
  }

  // Default: Math
  return isEn
    ? [
        {
          id: 'q1',
          category: 'knowledge',
          topicTag: 'Algebra & Equations',
          question: 'For quadratic $ax^2 + bx + c = 0$ ($a \\neq 0$) having two distinct roots $x_1, x_2$, what is $x_1 + x_2$?',
          options: ['$x_1 + x_2 = \\frac{b}{a}$', '$x_1 + x_2 = -\\frac{b}{a}$', '$x_1 + x_2 = \\frac{c}{a}$', '$x_1 + x_2 = -\\frac{c}{a}$'],
          correctIndex: 1
        },
        {
          id: 'q2',
          category: 'knowledge',
          topicTag: 'Calculus & Derivatives',
          question: 'At a local extremum $x_0$ of a differentiable polynomial $f(x)$, what holds true?',
          options: ["$f'(x_0) = 0$ and $f'(x)$ changes sign across $x_0$", "$f(x_0) = 0$ always", "$f'(x_0) > 0$ always", "$f''(x_0) = 0$ always"],
          correctIndex: 0
        },
        {
          id: 'q3',
          category: 'knowledge',
          topicTag: '3D Geometry (Oxyz)',
          question: 'Given $\\vec{u} = (1, 0, 0)$ and $\\vec{v} = (0, 1, 0)$ in Oxyz, what is the cross product $[\\vec{u}, \\vec{v}]$?',
          options: ['$(0, 0, 0)$', '$(1, 1, 0)$', '$(0, 0, 1)$', '$(0, 1, 1)$'],
          correctIndex: 2
        },
        {
          id: 'q4',
          category: 'specialization',
          topicTag: 'Major Track Selection',
          question: 'Which Math-heavy specialization best matches your future direction?',
          options: ['Computer Science, AI & Quantitative Modeling', 'Engineering, Architecture & Applied Physics', 'Economics, Finance & Data Analytics', 'High-School Gifted Math (Chuyên Toán) / Top University Entrance']
        },
        {
          id: 'q5',
          category: 'specialization',
          topicTag: 'Study Bottleneck',
          question: 'Which area currently slows you down most when solving Math problems?',
          options: ['Translating word problems into equations & formulas', 'Visualizing 2D graphs & 3D spatial geometry sections', 'Handling parameters $m$, inequalities & edge conditions', 'Time management and avoiding careless calculation traps']
        }
      ]
    : [
        {
          id: 'q1',
          category: 'knowledge',
          topicTag: 'Đại số & Hệ thức Vi-ét',
          question: 'Với phương trình bậc hai $ax^2 + bx + c = 0$ ($a \\neq 0$) có hai nghiệm phân biệt $x_1, x_2$, tổng hai nghiệm $x_1 + x_2$ bằng:',
          options: ['$\\frac{b}{a}$', '$-\\frac{b}{a}$', '$\\frac{c}{a}$', '$-\\frac{c}{a}$'],
          correctIndex: 1
        },
        {
          id: 'q2',
          category: 'knowledge',
          topicTag: 'Giải tích & Cực trị hàm số',
          question: 'Điều kiện để điểm $x_0$ là điểm cực trị của hàm đa thức $y = f(x)$ là:',
          options: ["$f'(x_0) = 0$ và $f'(x)$ đổi dấu khi qua $x_0$", '$f(x_0) = 0$', "$f'(x_0) > 0$", "$f''(x_0) = 0$"],
          correctIndex: 0
        },
        {
          id: 'q3',
          category: 'knowledge',
          topicTag: 'Hình học không gian Oxyz',
          question: 'Trong không gian $Oxyz$, tích có hướng của hai vector đơn vị $\\vec{i} = (1;0;0)$ và $\\vec{j} = (0;1;0)$ là:',
          options: ['$(0; 0; 0)$', '$(1; 1; 0)$', '$(0; 0; 1)$', '$(0; 1; 1)$'],
          correctIndex: 2
        },
        {
          id: 'q4',
          category: 'specialization',
          topicTag: 'Lựa chọn chuyên ngành',
          question: `Ở ${grade}, em định hướng sử dụng Toán học cho chuyên ngành / mục tiêu nào?`,
          options: ['Công nghệ thông tin, AI & Khoa học dữ liệu', 'Kỹ thuật, Công nghệ, Kiến trúc & Cơ điện tử', 'Kinh tế, Tài chính định lượng & Quản trị', 'Đội tuyển Chuyên Toán / HSG / Mục tiêu 9+ Đánh giá năng lực']
        },
        {
          id: 'q5',
          category: 'specialization',
          topicTag: 'Điểm nghẽn học tập',
          question: 'Khi làm bài Toán, phần nào thường khiến em mất nhiều thời gian hoặc hay bị kẹt nhất?',
          options: ['Chưa hình dung được đồ thị hàm số & thiết diện hình học 3D', 'Quên công thức hoặc hay nhầm dấu biến đổi đại số', 'Bài toán chứa tham số $m$, bất đẳng thức & điều kiện nghiệm', 'Phân bổ thời gian làm bài và tránh bẫy trắc nghiệm']
        }
      ];
}

function buildFallbackRoadmap(
  subject: 'math' | 'physics' | 'cs',
  grade: string,
  targetMajor: string,
  knowledgeCorrect: number,
  knowledgeTotal: number,
  specAnswers: string[],
  isEn: boolean
) {
  const score = knowledgeTotal > 0 ? Math.round((knowledgeCorrect / knowledgeTotal) * 100) : 70;
  const level =
    score >= 85
      ? isEn ? 'Strong Foundation · Ready for Advanced Track' : 'Nền tảng vững · Sẵn sàng bứt phá nâng cao'
      : score >= 50
      ? isEn ? 'Intermediate · Needs Targeted Consolidation' : 'Trung bình Khá · Cần củng cố lỗ hổng trọng tâm'
      : isEn ? 'Foundational · Rebuild Core Principles First' : 'Cần xây lại gốc · Ưu tiên bản chất & bài mẫu chuẩn';

  const moduleName = subject === 'math' ? 'math' : subject === 'physics' ? 'physics' : 'cs';

  return {
    subject,
    grade,
    targetMajor,
    estimatedLevel: level,
    knowledgeScore: score,
    knowledgeCorrect,
    knowledgeTotal,
    strengths: isEn
      ? [
          `Proactive diagnostic awareness for ${grade}`,
          `Clear specialization alignment toward ${targetMajor}`
        ]
      : [
          `Chủ động kiểm tra năng lực đúng lộ trình ${grade}`,
          `Định hướng rõ ràng theo chuyên ngành ${targetMajor}`
        ],
    weaknesses:
      score < 85
        ? isEn
          ? ['Needs stronger link between core formulas and edge conditions', 'More timed practice on multi-step transformations']
          : ['Cần gắn chặt công thức trọng tâm với điều kiện áp dụng thực tế', 'Cần tăng tốc độ xử lý biến đổi nhiều bước và tránh bẫy biên']
        : isEn
        ? ['Focus on Olympiad-level optimization and speed under exam pressure']
        : ['Cần nâng độ khó với bài toán phân loại và tối ưu thời gian thi'],
    majorAdvice: isEn
      ? `Based on your specialization choices (${specAnswers.join('; ') || targetMajor}), balance visual conceptual mastery with daily problem-solving drills.`
      : `Dựa trên lựa chọn định hướng (${specAnswers.join(' · ') || targetMajor}), em nên kết hợp học trực quan qua mô phỏng để hiểu gốc rễ trước khi tăng tốc luyện đề chuyên đề.`,
    dailyScheduleSummary: isEn
      ? '45–60 min/day: 15m concept review · 25m interactive lab/practice · 15m AI Mode 1 review'
      : '45–60 phút/ngày: 15p nắm bản chất · 25p thực hành mô phỏng/code · 15p kiểm tra lại lỗi sai với AI Chế độ 1',
    stages: [
      {
        step: 1,
        phase: isEn ? 'Phase 01 · Foundation' : 'Chặng 01 · Xây Gốc Chuẩn',
        title:
          subject === 'math'
            ? isEn ? 'Core Equations, Functions & Visual Graph Intuition' : 'Hàm Số, Phương Trình & Tư Duy Đồ Thị Oxy'
            : subject === 'physics'
            ? isEn ? 'Physical Laws Intuition & 2D/PhET Experimentation' : 'Bản Chất Định Luật & Thực Hành Lab 2D / PhET'
            : isEn ? 'Syntax Mastery, Complexity & Core Data Structures' : 'Làm Chủ Cú Pháp C++/Python, Độ Phức Tạp & CTDL Nền',
        durationWeeks: 2,
        dailyMinutes: 45,
        focusTopics:
          subject === 'math'
            ? ['Hàm số bậc 2, bậc 3', 'Hệ thức Vi-ét & Điều kiện nghiệm', 'Đạo hàm & Khảo sát đồ thị']
            : subject === 'physics'
            ? ['Định luật Ôm & Bảo toàn cơ năng', 'Dao động điều hòa', 'Quang hình & Khúc xạ']
            : ['Tìm kiếm nhị phân', 'Stack / Queue / Map', 'Phân tích độ phức tạp O(N log N)'],
        recommendedModule: moduleName as 'math' | 'physics' | 'cs',
        concreteTasks: [
          isEn ? 'Read 2 core lectures and test edge parameters in the simulator' : 'Đọc 2 bài giảng trọng tâm và kéo thanh trượt kiểm chứng trên mô phỏng',
          isEn ? 'Use AI Mode 1 whenever stuck on any transformation step' : 'Dùng AI Chế độ 1 hỏi lại ngay đúng bước biến đổi chưa hiểu (không xem đáp án trước)'
        ],
        targetMilestone: isEn ? 'Score ≥ 80% on lesson reinforcement drills' : 'Đạt từ 80% trở lên ở bài tập củng cố từng bài'
      },
      {
        step: 2,
        phase: isEn ? 'Phase 02 · Spatial & Deep Logic' : 'Chặng 02 · Đào Sâu Chuyên Ngành',
        title:
          subject === 'math'
            ? isEn ? '3D Coordinates Oxyz, Pyramids & Optimization' : 'Hình Học Không Gian Oxyz, Thiết Diện 3D & Tích Phân'
            : subject === 'physics'
            ? isEn ? '3D Fields, Wave Interference & Quantum Models' : 'Từ Trường 3D, Giao Thoa Sóng & Mẫu Nguyên Tử Bohr'
            : isEn ? 'Dynamic Programming, Graphs & Custom Stress Tests' : 'Quy Hoạch Động, Đồ Thị & Luyện Judge Tự Do',
        durationWeeks: 3,
        dailyMinutes: 55,
        focusTopics:
          subject === 'math'
            ? ['Hệ trục Oxyz & Tích có hướng', 'Mặt cầu - Mặt phẳng', 'Thể tích tròn xoay']
            : subject === 'physics'
            ? ['Lực Lorentz 3D', 'Giao thoa sóng cơ', 'Mạch xoay chiều & Cộng hưởng']
            : ['Quy hoạch động 1D/2D', 'BFS / DFS / Dijkstra', 'Kỹ thuật sinh test biên'],
        recommendedModule: moduleName as 'math' | 'physics' | 'cs',
        concreteTasks: [
          isEn ? 'Explore 3D WebGL interactive view to build spatial intuition' : 'Xoay mô hình 3D WebGL trực tiếp để hình dung không gian & vector',
          isEn ? 'Compare your own reasoning with AI Mode 2 full method breakdown' : 'Tự giải nháp trước rồi đối chiếu với AI Chế độ 2 (Tóm tắt + Lời giải chi tiết)'
        ],
        targetMilestone: isEn ? 'Solve medium-hard problems cleanly without formula hints' : 'Tự giải trọn vẹn bài mức Vận dụng không cần nhìn công thức'
      },
      {
        step: 3,
        phase: isEn ? 'Phase 03 · Exam Mastery' : 'Chặng 03 · Tổng Ôn Kho Đề Chuẩn',
        title: isEn ? 'Timed Mock Exams (Track-Matched)' : 'Luyện Đề Thực Chiến Bấm Giờ (Chuyên / Không Chuyên)',
        durationWeeks: 2,
        dailyMinutes: 60,
        focusTopics: ['Phân bổ thời gian làm bài', 'Rà soát bẫy điều kiện', 'Hoàn thiện trình bày tự luận'],
        recommendedModule: 'exams',
        concreteTasks: [
          isEn ? 'Complete 3 full timed papers per week in Exam Hub' : 'Hoàn thành 3 đề thi bấm giờ/tuần trong Kho Đề Thi Chuẩn',
          isEn ? 'Review wrong steps with detailed solutions & AI Mode 1' : 'Xem hướng dẫn giải chi tiết và hỏi lại AI đúng câu bị mất điểm'
        ],
        targetMilestone: isEn ? 'Consistent ≥ 8.5/10 across timed papers' : 'Ổn định từ 8.5/10 trở lên ở đề bấm giờ chuẩn'
      },
      {
        step: 4,
        phase: isEn ? 'Phase 04 · Competitive Arena' : 'Chặng 04 · Đấu Trường Xếp Hạng Tuần',
        title: isEn ? 'Daily Ranked MCQ & AI-Graded Essay Matches' : 'Thi Đấu Hằng Ngày & Leo Bảng Xếp Hạng Tuần',
        durationWeeks: 2,
        dailyMinutes: 30,
        focusTopics: ['Phản xạ nhanh Trắc nghiệm', 'Chấm Tự luận theo Rubric', 'Tối ưu điểm trung bình 3 môn'],
        recommendedModule: 'arena',
        concreteTasks: [
          isEn ? 'Play 1 official match daily in Weekly Arena' : 'Tham gia 1 lượt thi đấu chính thức/ngày ở Đấu Trường Tuần',
          isEn ? 'Analyze AI rubric feedback on your essay submissions' : 'Đọc phản hồi chấm từng ý của Giám khảo AI để vá lỗ hổng cuối cùng'
        ],
        targetMilestone: isEn ? 'Maintain Top Weekly Ranking & 85+ average' : 'Giữ điểm trung bình tuần từ 85+/100 và bứt top BXH'
      }
    ],
    createdAt: new Date().toISOString()
  };
}

app.post('/api/gemini/diagnostic-quiz', async (req: Request, res: Response) => {
  const { subject = 'math', grade = 'Lớp 12', targetMajor = 'Công nghệ thông tin / AI', selfLevel = 'Khá', language = 'vi' } = req.body || {};
  const subj: 'math' | 'physics' | 'cs' = subject === 'physics' || subject === 'cs' ? subject : 'math';
  const isEn = language === 'en';

  try {
    const ai = getGenAI();
    const subjectName =
      subj === 'math' ? (isEn ? 'Mathematics' : 'Toán học')
      : subj === 'physics' ? (isEn ? 'Physics' : 'Vật lí')
      : (isEn ? 'Computer Science (C++/Python & Algorithms)' : 'Tin học (Thuật toán & C++/Python)');

    const prompt = isEn
      ? `Create a 5-question diagnostic & specialization quiz for a ${grade} student studying ${subjectName}, interested in major "${targetMajor}" (self-assessed level: ${selfLevel}).
Requirements:
- Return exactly 5 questions in array "questions":
  - Questions 1, 2, 3 MUST have category: "knowledge" (testing real core concepts/problem-solving of ${subjectName} at ${grade} level, with 4 clear choices A/B/C/D and exact "correctIndex" 0..3).
  - Questions 4, 5 MUST have category: "specialization" (asking about their preferred sub-specialization/major track and learning bottleneck/style, with 4 options, no right/wrong answer).
- Format all math/physics formulas in KaTeX ($...$, always use \\frac).`
      : `Hãy tạo đúng 5 câu hỏi đánh giá trình độ chuyên môn và định hướng chuyên ngành cho học sinh ${grade} môn ${subjectName}, đang quan tâm chuyên ngành "${targetMajor}" (tự đánh giá: ${selfLevel}).
Yêu cầu bắt buộc:
- Mảng "questions" gồm ĐÚNG 5 câu:
  - Câu 1, 2, 3: category = "knowledge" (3 câu hỏi chuyên môn thực chất của môn ${subjectName} trình độ ${grade}, có 4 phương án rõ ràng và "correctIndex" từ 0 đến 3 chính xác 100%).
  - Câu 4, 5: category = "specialization" (2 câu hỏi lựa chọn nhánh chuyên ngành / mục tiêu nghề nghiệp và điểm nghẽn / phong cách học tập, gồm 4 lựa chọn thực tế).
- Mọi công thức Toán/Lí PHẢI viết đúng chuẩn KaTeX ($...$, luôn dùng \\frac{a}{b}, không viết thiếu dấu gạch chéo).`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                topicTag: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER }
              }
            }
          }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
    if (!Array.isArray(parsed?.questions) || parsed.questions.length < 4) {
      throw new Error('Gemini chưa trả về đủ 5 câu hỏi đánh giá. Vui lòng bấm tạo lại.');
    }

    const normalized = parsed.questions.slice(0, 5).map((q: any, idx: number) => ({
      id: String(q.id || `q${idx + 1}`),
      category: q.category === 'specialization' || idx >= 3 ? 'specialization' : 'knowledge',
      topicTag: String(q.topicTag || `Chuyên đề ${idx + 1}`),
      question: String(q.question || ''),
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options.map(String).slice(0, 4) : ['A', 'B', 'C', 'D'],
      ...(q.category !== 'specialization' && idx < 3
        ? { correctIndex: Math.max(0, Math.min(3, Number(q.correctIndex ?? 0))) }
        : {})
    }));
    return res.json({ success: true, questions: normalized });
  } catch (err: any) {
    console.error('Error in /api/gemini/diagnostic-quiz:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

app.post('/api/gemini/diagnostic-roadmap', async (req: Request, res: Response) => {
  const {
    subject = 'math',
    grade = 'Lớp 12',
    targetMajor = 'Công nghệ thông tin / AI',
    quizAnswers = [],
    customGoal = '',
    language = 'vi'
  } = req.body || {};

  const subj: 'math' | 'physics' | 'cs' = subject === 'physics' || subject === 'cs' ? subject : 'math';
  const isEn = language === 'en';

  const knowledgeItems = Array.isArray(quizAnswers)
    ? quizAnswers.filter((a: any) => a.category === 'knowledge')
    : [];
  const specItems = Array.isArray(quizAnswers)
    ? quizAnswers.filter((a: any) => a.category === 'specialization')
    : [];

  const knowledgeTotal = knowledgeItems.length || 3;
  const knowledgeCorrect = knowledgeItems.filter(
    (a: any) => typeof a.correctIndex === 'number' && a.selectedIndex === a.correctIndex
  ).length;
  const knowledgeScore = Math.round((knowledgeCorrect / knowledgeTotal) * 100);
  const specSummary = specItems.map((a: any) => `${a.topicTag}: ${a.selectedOption}`).filter(Boolean);

  try {
    const ai = getGenAI();
    const subjectName =
      subj === 'math' ? (isEn ? 'Mathematics' : 'Toán học')
      : subj === 'physics' ? (isEn ? 'Physics' : 'Vật lí')
      : (isEn ? 'Computer Science' : 'Tin học');

    const answerTranscript = (quizAnswers || [])
      .map((a: any, i: number) =>
        `${i + 1}. [${a.category}] (${a.topicTag}) ${a.question}\n   - Học sinh chọn: "${a.selectedOption}"${
          a.category === 'knowledge'
            ? ` | Đúng/Sai: ${a.selectedIndex === a.correctIndex ? 'ĐÚNG' : `SAI (Đáp án đúng: "${a.correctOption}")`}`
            : ''
        }`
      )
      .join('\n');

    const prompt = isEn
      ? `Analyze the student's diagnostic result and generate a visual personalized learning roadmap for ${subjectName} (${grade}), target major "${targetMajor}".
Knowledge Score: ${knowledgeCorrect}/${knowledgeTotal} (${knowledgeScore}%).
Custom student goal: ${customGoal || 'Master core topics & excel in exams'}.
Transcript:
${answerTranscript}

Return strict JSON with:
- estimatedLevel (string)
- strengths (array of 2-3 strings)
- weaknesses (array of 2-3 strings targeting missed concepts)
- majorAdvice (string: specific specialization guidance connecting ${subjectName} to "${targetMajor}")
- dailyScheduleSummary (string)
- stages (array of exactly 4 progressive phases: step 1..4, phase label, title, durationWeeks, dailyMinutes, focusTopics array, recommendedModule in ['math','physics','cs','exams','arena','roadmap'], concreteTasks array of 2-3 items, targetMilestone string).
Use KaTeX ($...$) if writing formulas.`
      : `Hãy phân tích năng lực học tập từ bài đánh giá sau và thiết kế SƠ ĐỒ LỘ TRÌNH HỌC TẬP CÁ NHÂN HÓA môn ${subjectName} (${grade}), định hướng chuyên ngành "${targetMajor}".
Điểm chuyên môn: ${knowledgeCorrect}/${knowledgeTotal} câu đúng (${knowledgeScore}%).
Mục tiêu riêng của học sinh: ${customGoal || 'Nắm chắc bản chất, xử lý bài tập vững và đạt điểm cao'}.

Chi tiết bài làm:
${answerTranscript}

Hãy trả về JSON chuẩn gồm:
- estimatedLevel: nhận định trình độ hiện tại (ngắn gọn, rõ ràng).
- strengths: 2-3 điểm mạnh cụ thể.
- weaknesses: 2-3 lỗ hổng hoặc điểm cần khắc phục (bám sát câu học sinh trả lời sai hoặc điểm nghẽn đã chọn).
- majorAdvice: lời khuyên định hướng chuyên ngành "${targetMajor}" gắn với môn ${subjectName}.
- dailyScheduleSummary: lịch học khuyến nghị mỗi ngày (ví dụ 45-60 phút/ngày chia theo bước).
- stages: ĐÚNG 4 chặng nối tiếp nhau (step 1..4), mỗi chặng có: phase, title, durationWeeks (số nguyên), dailyMinutes (số nguyên), focusTopics (3-4 chuyên đề cụ thể), recommendedModule (chọn 1 trong: '${subj}', 'exams', 'arena', 'roadmap'), concreteTasks (2-3 việc làm cụ thể trên EduClassroom 360), targetMilestone (mục tiêu đầu ra cần đạt).
Mọi công thức Toán/Lí dùng chuẩn KaTeX ($...$, luôn dùng \\frac).`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedLevel: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          majorAdvice: { type: Type.STRING },
          dailyScheduleSummary: { type: Type.STRING },
          stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                phase: { type: Type.STRING },
                title: { type: Type.STRING },
                durationWeeks: { type: Type.INTEGER },
                dailyMinutes: { type: Type.INTEGER },
                focusTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedModule: { type: Type.STRING },
                concreteTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                targetMilestone: { type: Type.STRING }
              }
            }
          }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 38000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
    if (!Array.isArray(parsed?.stages) || parsed.stages.length < 3) {
      throw new Error('Gemini chưa trả về đầy đủ sơ đồ lộ trình. Vui lòng thử tạo lại.');
    }

    const validModules = new Set(['math', 'physics', 'cs', 'exams', 'arena', 'roadmap']);
    return res.json({
      success: true,
      roadmap: {
        subject: subj,
        grade: String(grade),
        targetMajor: String(targetMajor),
        estimatedLevel: String(parsed.estimatedLevel || ''),
        knowledgeScore,
        knowledgeCorrect,
        knowledgeTotal,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
        majorAdvice: String(parsed.majorAdvice || ''),
        dailyScheduleSummary: String(parsed.dailyScheduleSummary || ''),
        stages: parsed.stages.slice(0, 5).map((st: any, i: number) => ({
          step: Number(st.step || i + 1),
          phase: String(st.phase || `Chặng 0${i + 1}`),
          title: String(st.title || ''),
          durationWeeks: Math.max(1, Number(st.durationWeeks || 2)),
          dailyMinutes: Math.max(20, Number(st.dailyMinutes || 45)),
          focusTopics: Array.isArray(st.focusTopics) ? st.focusTopics.map(String) : [],
          recommendedModule: validModules.has(st.recommendedModule) ? st.recommendedModule : subj,
          concreteTasks: Array.isArray(st.concreteTasks) ? st.concreteTasks.map(String) : [],
          targetMilestone: String(st.targetMilestone || '')
        })),
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/diagnostic-roadmap:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
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

    const response = await callGeminiWithFallback({
      ai,
      contents: { parts },
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
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
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
      error: extractCleanErrorMessage(err)
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

    const response = await callGeminiWithFallback({
      ai,
      contents: { parts },
      systemInstruction: `You are an elite competitive programming judge. Extract the problem from user input (OCR/text) and output strict JSON with keys: title (string), description (string), inputFormat (string), outputFormat (string), constraints (array of strings), sampleCases (array of objects { id, input, expectedOutput, isSample: true, explanation }), hiddenCases (array of objects { id, input, expectedOutput, isSample: false }), referenceCpp (string), referencePython (string). Ensure expectedOutput is 100% mathematically and algorithmically accurate.`,
      responseMimeType: 'application/json',
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsedData = safeParseGeminiJson<any>(response.text, null);
    if (!parsedData || !parsedData.title) {
      throw new Error('Không thể trích xuất dữ liệu JSON từ phản hồi AI');
    }

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
      error: extractCleanErrorMessage(err),
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

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 14000
    });

    const result = safeParseGeminiJson<any>(response.text, {
      stdout: '',
      stderr: 'Không thể phân tích kết quả thực thi từ AI.',
      isError: true,
      runtimeMs: 0
    });
    return res.json(result);
  } catch (err: any) {
    console.error('Error running code via Gemini:', err);
    return res.status(500).json({ error: extractCleanErrorMessage(err) });
  }
});

// =====================================================================
// GEMINI AI: GRADE PER-SECTION MINI ESSAY (0 - 10 SCALE)
// =====================================================================
app.post('/api/gemini/grade-mini-essay', async (req: Request, res: Response) => {
  try {
    const {
      subject = 'math',
      lessonTitle = '',
      stepTitle = '',
      question = '',
      rubricChecklist = [],
      sampleAnswer = '',
      studentAnswer = '',
      language = 'vi'
    } = req.body || {};

    if (!String(studentAnswer).trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập câu trả lời tự luận trước khi chấm.' });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjLabel =
      subject === 'physics' ? (isEn ? 'Physics' : 'Vật lí') : subject === 'cs' ? (isEn ? 'Computer Science' : 'Tin học') : isEn ? 'Mathematics' : 'Toán học';

    const prompt = isEn
      ? `You are a ${subjLabel} teacher grading a student's short essay response (0 to 10 points) for lesson "${lessonTitle}", section "${stepTitle}".
Question: ${question}
Rubric checklist: ${(rubricChecklist || []).join('; ')}
Reference answer: ${sampleAnswer}
Student answer: ${studentAnswer}

Grade fairly from 0 to 10 (integers or halves). Identify specific strengths, mistakes/missing conditions, and concise constructive feedback. Use KaTeX ($...$) for formulas.`
      : `Bạn là giáo viên ${subjLabel} chấm một câu tự luận ngắn (thang điểm 0 đến 10) thuộc bài "${lessonTitle}", phần "${stepTitle}".
ĐỀ BÀI: ${question}
TIÊU CHÍ CHẤM: ${(rubricChecklist || []).map((r: string, i: number) => `${i + 1}. ${r}`).join(' | ')}
ĐÁP ÁN THAM KHẢO: ${sampleAnswer}
BÀI LÀM HỌC SINH: ${studentAnswer}

Hãy chấm điểm chính xác từ 0 đến 10 (có thể dùng 0.5 điểm), chỉ ra điểm làm đúng, lỗi sai hoặc ý còn thiếu (như thiếu điều kiện, sai đơn vị, nhầm dấu), và nhận xét ngắn gọn giúp học sinh sửa ngay. Công thức viết chuẩn KaTeX ($...$).`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          isCorrectDirection: { type: Type.BOOLEAN },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          feedback: { type: Type.STRING }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 32000
    });

    const parsed = safeParseGeminiJson<any>(response.text, null);
    if (!parsed || typeof parsed.score === 'undefined') {
      throw new Error('Gemini chưa trả về điểm chấm hợp lệ. Vui lòng bấm chấm lại.');
    }

    const rawScore = Number(parsed.score ?? 0);
    const clampedScore = Math.max(0, Math.min(10, Math.round(rawScore * 2) / 2));

    return res.json({
      success: true,
      evaluation: {
        score: clampedScore,
        maxScore: 10,
        isCorrectDirection: Boolean(parsed.isCorrectDirection ?? clampedScore >= 5),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes.map(String) : [],
        feedback: String(parsed.feedback || 'Đã hoàn thành chấm câu tự luận ngắn.'),
        gradedBy: 'ai'
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/grade-mini-essay:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

// =====================================================================
// GEMINI AI: GENERATE FRESH 2 MCQ + 1 MINI ESSAY FOR A SPECIFIC SECTION
// =====================================================================
app.post('/api/gemini/generate-step-quiz', async (req: Request, res: Response) => {
  try {
    const {
      subject = 'math',
      lessonTitle = '',
      stepTitle = '',
      conceptSection = '',
      primaryFormula = '',
      deepDiveSection = '',
      language = 'vi'
    } = req.body || {};

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjLabel =
      subject === 'physics' ? 'Vật lí' : subject === 'cs' ? 'Tin học & Thuật toán' : 'Toán học';

    const prompt = isEn
      ? `Create a focused micro-assessment for ${subject} lesson "${lessonTitle}", section "${stepTitle}".
Concept: ${conceptSection}
Formula: ${primaryFormula}
Deep dive: ${deepDiveSection}

Return strict JSON with:
- miniQuiz: array of EXACTLY 2 multiple-choice questions (id, question, 4 options labeled A./B./C./D., correctIndex 0..3, detailed explanation). One tests conceptual understanding/conditions, one tests formula application.
- miniEssay: 1 short essay question (id, question, hint, rubricChecklist of 2-3 points, sampleAnswer).
Format all math/physics expressions in KaTeX ($...$, always use \\frac).`
      : `Hãy tạo bộ kiểm tra kiến thức chuyên sâu cho đúng phần nội dung sau của môn ${subjLabel}:
Bài học: ${lessonTitle}
Phần đang học: ${stepTitle}
Khái niệm: ${conceptSection}
Công thức trọng tâm: ${primaryFormula}
Giải thích sâu: ${deepDiveSection}

Yêu cầu trả về JSON chuẩn gồm:
- miniQuiz: ĐÚNG 2 câu trắc nghiệm (mỗi câu gồm id, question, options gồm đúng 4 phương án A./B./C./D., correctIndex từ 0..3 chính xác 100%, explanation giải thích tường minh). Câu 1 kiểm tra bản chất khái niệm/điều kiện; Câu 2 kiểm tra vận dụng công thức/bài toán cụ thể.
- miniEssay: ĐÚNG 1 câu tự luận nhỏ (id, question yêu cầu giải thích ngắn hoặc tính toán/chứng minh nhanh 3-5 dòng, hint gợi ý, rubricChecklist gồm 2-3 ý chấm điểm, sampleAnswer lời giải mẫu).
Mọi công thức Toán/Lí PHẢI viết chuẩn KaTeX ($...$, luôn dùng \\frac{a}{b}).`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          miniQuiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              }
            }
          },
          miniEssay: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              hint: { type: Type.STRING },
              rubricChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
              sampleAnswer: { type: Type.STRING }
            }
          }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
    if (!Array.isArray(parsed?.miniQuiz) || parsed.miniQuiz.length < 2 || !parsed?.miniEssay?.question) {
      throw new Error('Gemini chưa tạo đủ 2 câu trắc nghiệm + 1 tự luận. Vui lòng thử lại.');
    }

    return res.json({
      success: true,
      miniQuiz: parsed.miniQuiz.slice(0, 2).map((q: any, idx: number) => ({
        id: String(q.id || `ai_mcq_${Date.now()}_${idx}`),
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(String).slice(0, 4) : ['A.', 'B.', 'C.', 'D.'],
        correctIndex: Math.max(0, Math.min(3, Number(q.correctIndex ?? 0))),
        explanation: String(q.explanation || '')
      })),
      miniEssay: {
        id: String(parsed.miniEssay.id || `ai_essay_${Date.now()}`),
        question: String(parsed.miniEssay.question || ''),
        hint: String(parsed.miniEssay.hint || ''),
        rubricChecklist: Array.isArray(parsed.miniEssay.rubricChecklist)
          ? parsed.miniEssay.rubricChecklist.map(String)
          : [],
        sampleAnswer: String(parsed.miniEssay.sampleAnswer || '')
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/generate-step-quiz:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

// =====================================================================
// GEMINI AI: ANALYZE SAVED LESSON RESULTS & RECOMMEND ROADMAP
// =====================================================================
function buildFallbackLessonAnalysis(
  subject: 'math' | 'physics' | 'cs',
  lessonTitle: string,
  stepsSummary: any[],
  isEn: boolean
) {
  let totalMcq = 0;
  let correctMcq = 0;
  let essaySum = 0;
  let essayCount = 0;
  const strongPoints: string[] = [];
  const weakPoints: string[] = [];
  const weakStepIndices: number[] = [];

  for (const s of stepsSummary) {
    const t = Number(s.mcqTotal || 0);
    const c = Number(s.mcqCorrect || 0);
    totalMcq += t;
    correctMcq += c;

    const hasEssay = typeof s.essayScore === 'number';
    if (hasEssay) {
      essaySum += s.essayScore;
      essayCount += 1;
    }

    const mcqRate = t > 0 ? c / t : 0;
    const essayRate = hasEssay ? s.essayScore / 10 : mcqRate;
    const combined = (mcqRate + essayRate) / 2;

    if (t > 0 || hasEssay) {
      if (combined >= 0.75) {
        strongPoints.push(`${s.stepTitle}: Đạt ${c}/${t} TN${hasEssay ? `, Tự luận ${s.essayScore}/10` : ''}`);
      } else {
        weakPoints.push(`${s.stepTitle}: Cần củng cố lại (${c}/${t} TN${hasEssay ? `, Tự luận ${s.essayScore}/10` : ''})`);
        weakStepIndices.push(Number(s.stepIndex || 0));
      }
    }
  }

  const mcqPct = totalMcq > 0 ? (correctMcq / totalMcq) * 100 : 0;
  const essayPct = essayCount > 0 ? (essaySum / essayCount) * 10 : mcqPct;
  const overallMastery =
    totalMcq > 0 || essayCount > 0 ? Math.round((mcqPct * 0.55 + essayPct * 0.45)) : 0;

  const readinessLevel =
    overallMastery >= 80
      ? isEn ? 'Mastered · Ready for Simulation & Next Lesson' : 'Nắm vững cốt lõi · Sẵn sàng thực chiến & học bài tiếp'
      : overallMastery >= 55
      ? isEn ? 'Developing · Review Flagged Formulas' : 'Đạt mức Khá · Cần vá lại các phần công thức còn hổng'
      : isEn ? 'Needs Reinforcement · Re-study Concepts Step-by-Step' : 'Cần củng cố gốc · Hãy ôn lại Khái niệm & hỏi AI phần chưa rõ';

  const recommendedRoadmap: any[] = [];
  let stepOrder = 1;

  if (weakStepIndices.length > 0) {
    const firstWeak = stepsSummary.find((s) => Number(s.stepIndex) === weakStepIndices[0]);
    recommendedRoadmap.push({
      step: stepOrder++,
      title: isEn ? `Review: ${firstWeak?.stepTitle || 'Weak section'}` : `Ôn lại ngay: ${firstWeak?.stepTitle || 'Phần còn yếu'}`,
      action: isEn
        ? 'Re-read the Concept, Formula, and Deep Dive sections, then ask AI about any unclear step.'
        : 'Đọc kỹ lại mục Khái niệm, Công thức, Giải thích sâu hơn và dùng hộp Đặt câu hỏi cho AI ở phần này.',
      targetType: 'review_step',
      stepIndex: weakStepIndices[0]
    });
  }

  recommendedRoadmap.push({
    step: stepOrder++,
    title:
      subject === 'cs'
        ? isEn ? 'Run & Test Code in Online Judge' : 'Thực hành viết code & Chấm Test Online Judge'
        : isEn ? 'Verify Laws on 2D Interactive Lab' : 'Kiểm chứng trực quan trên Mô phỏng 2D',
    action:
      subject === 'cs'
        ? isEn
          ? 'Open the illustrated C++/Python code and submit the lesson problem on Judge.'
          : 'Mở tab Code Mẫu C++/Python và nộp bài trên Trình chấm Online Judge để rèn biên độ test.'
        : isEn
        ? 'Adjust sliders and inspect live graphs/vectors to connect formulas with visual intuition.'
        : 'Kéo thanh trượt thay đổi tham số trên Mô phỏng 2D để thấy quy luật công thức vận hành trực tiếp.',
    targetType: 'sim_2d'
  });

  if (overallMastery < 75) {
    recommendedRoadmap.push({
      step: stepOrder++,
      title: isEn ? 'Clarify Doubts with AI Tutor (Mode 1)' : 'Gỡ nút thắt cùng Gia Sư AI (Chế độ 1)',
      action: isEn
        ? 'Ask Socratic AI Tutor to guide you step-by-step on the missed essay/MCQ concepts.'
        : 'Hỏi Gia Sư AI về các câu sai hoặc ý tự luận còn thiếu để hiểu sâu bản chất trước khi làm đề.',
      targetType: 'ai_tutor'
    });
  }

  recommendedRoadmap.push({
    step: stepOrder++,
    title:
      overallMastery >= 75
        ? isEn ? 'Advance to Next Lesson or Timed Exam' : 'Chuyển sang Bài tiếp theo hoặc Thử sức Đề thi'
        : isEn ? 'Retry Section Quizzes Before Advancing' : 'Làm lại bộ câu hỏi phần yếu rồi sang Bài tiếp theo',
    action:
      overallMastery >= 75
        ? isEn
          ? `You are ready to progress beyond "${lessonTitle}" or test yourself in Exam Hub / Weekly Arena.`
          : `Kết quả bài "${lessonTitle}" rất khả quan — hãy tiến sang bài mới hoặc thử sức trong Kho Đề / Đấu Trường.`
        : isEn
        ? 'Aim for >= 75% mastery before moving to the next lesson.'
        : 'Đạt tối thiểu 75% mức nắm vững ở bài này để xây nền chắc cho bài tiếp theo.',
    targetType: overallMastery >= 75 ? 'next_lesson' : 'exams'
  });

  return {
    overallMastery,
    readinessLevel,
    summaryFeedback: isEn
      ? `You answered ${correctMcq}/${totalMcq} MCQs correctly${essayCount > 0 ? ` and averaged ${Math.round((essaySum / essayCount) * 10) / 10}/10 on mini-essays` : ''} for "${lessonTitle}".`
      : `Ở bài "${lessonTitle}", bạn đạt ${correctMcq}/${totalMcq} câu trắc nghiệm${essayCount > 0 ? ` và điểm trung bình tự luận ngắn là ${Math.round((essaySum / essayCount) * 10) / 10}/10` : ''}. ${weakPoints.length > 0 ? 'Hãy tập trung vá lại các phần đánh dấu đỏ trước khi chuyển bài.' : 'Bạn đang giữ nhịp học rất tốt!'}`,
    strongPoints: strongPoints.length > 0 ? strongPoints : [isEn ? 'Completed initial theory reading' : 'Đã chủ động tiếp cận nội dung bài giảng'],
    weakPoints: weakPoints.length > 0 ? weakPoints : [isEn ? 'Complete remaining mini-essays for deeper retention' : 'Nên hoàn thành đầy đủ tự luận nhỏ ở tất cả các phần để chốt kiến thức'],
    recommendedRoadmap,
    analyzedAt: new Date().toISOString()
  };
}

app.post('/api/gemini/analyze-lesson-progress', async (req: Request, res: Response) => {
  const {
    subject = 'math',
    grade = '',
    lessonTitle = '',
    stepsSummary = [],
    language = 'vi'
  } = req.body || {};

  const subj: 'math' | 'physics' | 'cs' = subject === 'physics' || subject === 'cs' ? subject : 'math';
  const isEn = language === 'en';
  const safeSummary = Array.isArray(stepsSummary) ? stepsSummary : [];

  try {
    const ai = getGenAI();
    const transcript = safeSummary
      .map(
        (s: any) =>
          `- Phần ${Number(s.stepIndex) + 1}: "${s.stepTitle}" | TN: ${s.mcqCorrect}/${s.mcqTotal} đúng | Tự luận nhỏ: ${
            typeof s.essayScore === 'number' ? `${s.essayScore}/10` : 'Chưa chấm'
          }${s.essayMistakes?.length ? ` | Lỗi tự luận: ${s.essayMistakes.join('; ')}` : ''}${
            s.wrongMcqTopics?.length ? ` | Câu TN sai: ${s.wrongMcqTopics.join('; ')}` : ''
          }`
      )
      .join('\n');

    const prompt = isEn
      ? `Analyze the student's per-section results in lesson "${lessonTitle}" (${subj}, ${grade}) and recommend a concrete next-step learning roadmap.
Results:
${transcript}

Return strict JSON:
- overallMastery (integer 0-100)
- readinessLevel (short status string)
- summaryFeedback (2-3 sentences diagnosing mastery and root gaps)
- strongPoints (array of 2-3 strings)
- weakPoints (array of 1-3 strings targeting weak sections/formulas)
- recommendedRoadmap (array of 3-4 ordered objects: { step, title, action, targetType in ['review_step','sim_2d','sim_3d','ai_tutor','next_lesson','exams','arena'], stepIndex (optional 0-based index for review_step) }).`
      : `Hãy phân tích kết quả học tập chi tiết theo từng phần của học sinh trong bài "${lessonTitle}" (Môn: ${subj}, Trình độ: ${grade}) và đề xuất lộ trình học tiếp theo thật hợp lý.
Dữ liệu làm bài từng phần:
${transcript}

Trả về JSON chuẩn gồm:
- overallMastery: số nguyên 0..100 đánh giá mức độ nắm vững thực chất cả bài.
- readinessLevel: nhận định ngắn gọn trạng thái sẵn sàng (vd: "Nắm vững · Sẵn sàng nâng cao" hoặc "Cần ôn lại Phần 2 trước khi làm đề").
- summaryFeedback: 2-3 câu phân tích sâu sắc điểm làm được, lỗ hổng tư duy/công thức và định hướng cải thiện.
- strongPoints: mảng 2-3 điểm mạnh cụ thể theo tên phần/công thức.
- weakPoints: mảng 1-3 điểm yếu hoặc phần chưa làm/làm sai cần khắc phục.
- recommendedRoadmap: mảng 3-4 bước lộ trình gợi ý theo thứ tự ưu tiên, mỗi bước gồm:
  + step (1, 2, 3...)
  + title (tiêu đề hành động ngắn gọn)
  + action (hướng dẫn cụ thể nên làm gì ở bước đó)
  + targetType (CHỈ chọn trong: 'review_step', 'sim_2d', 'sim_3d', 'ai_tutor', 'next_lesson', 'exams', 'arena')
  + stepIndex (chỉ số 0-based của phần cần ôn nếu targetType là 'review_step').`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallMastery: { type: Type.INTEGER },
          readinessLevel: { type: Type.STRING },
          summaryFeedback: { type: Type.STRING },
          strongPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          weakPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedRoadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                title: { type: Type.STRING },
                action: { type: Type.STRING },
                targetType: { type: Type.STRING },
                stepIndex: { type: Type.INTEGER }
              }
            }
          }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
    const validTargets = new Set(['review_step', 'sim_2d', 'sim_3d', 'ai_tutor', 'next_lesson', 'exams', 'arena']);
    if (!Array.isArray(parsed?.recommendedRoadmap) || parsed.recommendedRoadmap.length === 0) {
      throw new Error('Gemini chưa tạo được phân tích lộ trình. Vui lòng thử lại.');
    }

    return res.json({
      success: true,
      analysis: {
        overallMastery: Math.max(0, Math.min(100, Math.round(Number(parsed.overallMastery ?? 0)))),
        readinessLevel: String(parsed.readinessLevel || 'Đã phân tích xong'),
        summaryFeedback: String(parsed.summaryFeedback || ''),
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints.map(String) : [],
        weakPoints: Array.isArray(parsed.weakPoints) ? parsed.weakPoints.map(String) : [],
        recommendedRoadmap: parsed.recommendedRoadmap.slice(0, 5).map((r: any, idx: number) => ({
          step: Number(r.step || idx + 1),
          title: String(r.title || ''),
          action: String(r.action || ''),
          targetType: validTargets.has(r.targetType) ? r.targetType : 'review_step',
          ...(typeof r.stepIndex === 'number' ? { stepIndex: Math.max(0, r.stepIndex) } : {})
        })),
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/analyze-lesson-progress:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

// JSON guards for /api routes (never leak HTML pages to JSON clients)
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint không tồn tại.' });
});

app.use('/api', (err: any, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled /api error:', err);
  res.status(err?.status || 500).json({ error: extractCleanErrorMessage(err) });
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
