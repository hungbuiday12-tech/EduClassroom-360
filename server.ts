import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// Enable CORS for Web, GitHub Pages, Android APK (Capacitor/Cordova/WebView), and Desktop EXE (Electron/Tauri)
app.use((req: Request, res: Response, next: any) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin && origin !== 'null' ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

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

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now()
  });
});

// =====================================================================
// PERSISTENT COMMUNITY REVIEWS & RATINGS STORE (.reviews_db.json)
// =====================================================================
type ReviewCategory = 'simulations' | 'lectures_ai' | 'coding_exams' | 'interface' | 'general';

interface PlatformReviewRecord {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  favoriteCategory: ReviewCategory;
  comment: string;
  helpfulUserIds: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface ReviewsDatabase {
  reviews: PlatformReviewRecord[];
}

const REVIEWS_DB_PATH = path.resolve(process.cwd(), '.reviews_db.json');

function loadReviewsDb(): ReviewsDatabase {
  try {
    if (fs.existsSync(REVIEWS_DB_PATH)) {
      const raw = fs.readFileSync(REVIEWS_DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.reviews)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read .reviews_db.json, initializing clean store:', err);
  }
  return { reviews: [] };
}

function saveReviewsDb(data: ReviewsDatabase) {
  try {
    fs.writeFileSync(REVIEWS_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist .reviews_db.json:', err);
  }
}

let reviewsDb: ReviewsDatabase = loadReviewsDb();

app.get('/api/reviews', (_req: Request, res: Response) => {
  const sorted = [...reviewsDb.reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return res.json({ reviews: sorted });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { id, userId, username, displayName, avatarUrl, rating, favoriteCategory, comment } = req.body || {};

  if (!userId || !displayName || typeof rating !== 'number' || !comment) {
    return res.status(400).json({ error: 'Thiếu thông tin đánh giá bắt buộc.' });
  }

  const cleanComment = String(comment).trim();
  if (cleanComment.length < 3 || cleanComment.length > 800) {
    return res.status(400).json({ error: 'Nội dung bình luận cần từ 3 đến 800 ký tự.' });
  }

  const clampedRating = Math.max(1, Math.min(5, Math.round(rating)));
  const validCategories: ReviewCategory[] = ['simulations', 'lectures_ai', 'coding_exams', 'interface', 'general'];
  const cleanCat: ReviewCategory = validCategories.includes(favoriteCategory) ? favoriteCategory : 'general';
  const cleanUserId = String(userId).slice(0, 128);
  const nowIso = new Date().toISOString();

  const record: PlatformReviewRecord = {
    id: id ? String(id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128) : `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: cleanUserId,
    username: String(username || 'hocvien').slice(0, 40),
    displayName: String(displayName).slice(0, 100),
    avatarUrl: avatarUrl ? String(avatarUrl).slice(0, 512) : undefined,
    rating: clampedRating,
    favoriteCategory: cleanCat,
    comment: cleanComment,
    helpfulUserIds: [],
    helpfulCount: 0,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  reviewsDb.reviews.unshift(record);
  saveReviewsDb(reviewsDb);

  return res.status(201).json({ success: true, review: record });
});

app.post('/api/reviews/:id/vote', (req: Request, res: Response) => {
  const reviewId = String(req.params.id || '').trim();
  const userId = String(req.body?.userId || '').trim().slice(0, 128);

  if (!reviewId || !userId) {
    return res.status(400).json({ error: 'Cần đăng nhập để bình chọn hữu ích.' });
  }

  const target = reviewsDb.reviews.find((r) => r.id === reviewId);
  if (!target) {
    return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
  }

  const idx = target.helpfulUserIds.indexOf(userId);
  if (idx >= 0) {
    target.helpfulUserIds.splice(idx, 1);
  } else {
    target.helpfulUserIds.push(userId);
  }
  target.helpfulCount = target.helpfulUserIds.length;
  target.updatedAt = new Date().toISOString();
  saveReviewsDb(reviewsDb);

  return res.json({ success: true, review: target });
});

app.delete('/api/reviews/:id', (req: Request, res: Response) => {
  const reviewId = String(req.params.id || '').trim();
  const userId = String(req.query.userId || req.body?.userId || '').trim();

  const idx = reviewsDb.reviews.findIndex((r) => r.id === reviewId);
  if (idx < 0) {
    return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
  }
  if (!userId || reviewsDb.reviews[idx].userId !== userId) {
    return res.status(403).json({ error: 'Bạn chỉ có thể xóa đánh giá của chính mình.' });
  }

  reviewsDb.reviews.splice(idx, 1);
  saveReviewsDb(reviewsDb);
  return res.json({ success: true, id: reviewId });
});

// =====================================================================
// PERSISTENT STUDY FORUM STORE (.forum_db.json) + REAL-TIME SSE
// =====================================================================
type ForumSubjectServer = 'announcements' | 'general' | 'math' | 'physics' | 'cs' | 'exams';

interface ForumGroupRecord {
  id: string;
  name: string;
  description: string;
  subject: ForumSubjectServer;
  isMandatoryAdminGroup: boolean;
  creatorId: string;
  creatorName: string;
  creatorUsername?: string;
  messageCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  createdAt: string;
}

interface ForumMessageRecord {
  id: string;
  groupId: string;
  isAdminGroup: boolean;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  senderAvatar?: string;
  senderRole: 'student' | 'teacher' | 'admin';
  content: string;
  createdAt: string;
}

interface ForumDatabase {
  groups: ForumGroupRecord[];
  messages: ForumMessageRecord[];
}

const FORUM_DB_PATH = path.resolve(process.cwd(), '.forum_db.json');
const MANDATORY_ADMIN_GROUP_ID = 'official-announcements';
const FORUM_ADMIN_EMAIL = 'synapse.admin@educlassroom360.vn';
const FORUM_ADMIN_AVATAR = '/assets/aistudio/image_0883e005.png';

function isForumAdminIdentity(email?: unknown, _username?: unknown): boolean {
  return String(email || '').trim().toLowerCase() === FORUM_ADMIN_EMAIL;
}

function buildDefaultForumSeed(): ForumDatabase {
  const now = new Date('2026-11-15T00:00:00.000Z');
  const t1 = new Date(now.getTime()).toISOString();
  const t2 = new Date(now.getTime() + 60_000).toISOString();
  const t3 = new Date(now.getTime() + 120_000).toISOString();

  return {
    groups: [
      {
        id: MANDATORY_ADMIN_GROUP_ID,
        name: 'Thông báo Chính thức · Admin Synapse',
        description:
          'Nhóm bắt buộc của toàn hệ thống Synapse. Chỉ tài khoản Admin Synapse mới có quyền đăng thông báo cập nhật hoạt động của web.',
        subject: 'announcements',
        isMandatoryAdminGroup: true,
        creatorId: 'admin_synapse',
        creatorName: 'Synapse',
        creatorUsername: 'Synapse',
        messageCount: 1,
        lastMessagePreview:
          'Chào mừng các bạn đến với Diễn đàn Học tập Synapse 360°! Mọi thông báo bảo trì, sự kiện thi đấu & nâng cấp tính năng sẽ được Admin Synapse cập nhật tại đây.',
        lastMessageAt: t1,
        createdAt: t1
      },
      {
        id: 'math-olympiad-club',
        name: 'CLB Toán Hình Học & Giải Tích 9–12',
        description:
          'Trao đổi phương pháp giải hệ thức lượng đường tròn, đạo hàm, tích phân và hình học không gian Oxyz.',
        subject: 'math',
        isMandatoryAdminGroup: false,
        creatorId: 'demo_user_2',
        creatorName: 'Nguyễn Văn An',
        creatorUsername: 'chuyentoan2026',
        messageCount: 1,
        lastMessagePreview:
          'Chào mọi người! Ai cần thảo luận phần tiếp tuyến đường tròn hay tọa độ $Oxyz$ có thể nhắn ở đây nhé.',
        lastMessageAt: t2,
        createdAt: t2
      },
      {
        id: 'cs-vnoi-algorithms',
        name: 'Nhóm Thuật Toán C++ & Luyện Thi VNOI',
        description:
          'Cùng chia sẻ lời giải Quy hoạch động, Đồ thị, Segment Tree và debug test biên trên Sublime Studio.',
        subject: 'cs',
        isMandatoryAdminGroup: false,
        creatorId: 'demo_user_1',
        creatorName: 'Học sinh Chuyên',
        creatorUsername: 'hocsinh',
        messageCount: 1,
        lastMessagePreview:
          'Mọi người nhớ kiểm tra tràn số `long long` với các bài có $N \\le 10^5$ và trọng số $10^9$ nha!',
        lastMessageAt: t3,
        createdAt: t3
      }
    ],
    messages: [
      {
        id: 'msg_seed_admin_1',
        groupId: MANDATORY_ADMIN_GROUP_ID,
        isAdminGroup: true,
        senderId: 'admin_synapse',
        senderName: 'Synapse',
        senderUsername: 'Synapse',
        senderAvatar: FORUM_ADMIN_AVATAR,
        senderRole: 'admin',
        content:
          'Chào mừng các bạn đến với Diễn đàn Học tập Synapse 360°!\n\nĐây là kênh thông báo chính thức do tài khoản Admin **Synapse** quản lí để cập nhật lịch thi đấu hàng tuần, các mô phỏng 2D/3D mới và hoạt động của website.\n\n• Các bạn có thể tạo nhóm học tập riêng để cùng nhau trao đổi bài tập Toán, Vật lí, Tin học và hỗ trợ công thức KaTeX dạng `$a^2 + b^2 = c^2$`.',
        createdAt: t1
      },
      {
        id: 'msg_seed_math_1',
        groupId: 'math-olympiad-club',
        isAdminGroup: false,
        senderId: 'demo_user_2',
        senderName: 'Nguyễn Văn An',
        senderUsername: 'chuyentoan2026',
        senderRole: 'student',
        content:
          'Chào mọi người! Ai cần thảo luận phần tiếp tuyến đường tròn hay tọa độ $Oxyz$ có thể nhắn ở đây nhé.',
        createdAt: t2
      },
      {
        id: 'msg_seed_cs_1',
        groupId: 'cs-vnoi-algorithms',
        isAdminGroup: false,
        senderId: 'demo_user_1',
        senderName: 'Học sinh Chuyên',
        senderUsername: 'hocsinh',
        senderRole: 'student',
        content:
          'Mọi người nhớ kiểm tra tràn số `long long` với các bài có $N \\le 10^5$ và trọng số $10^9$ nha!',
        createdAt: t3
      }
    ]
  };
}

function ensureMandatoryAdminGroup(data: ForumDatabase): ForumDatabase {
  const seed = buildDefaultForumSeed();
  const hasMandatory = data.groups.some((g) => g.id === MANDATORY_ADMIN_GROUP_ID);
  if (!hasMandatory) {
    data.groups.unshift(seed.groups[0]);
    const hasAdminMsg = data.messages.some((m) => m.groupId === MANDATORY_ADMIN_GROUP_ID);
    if (!hasAdminMsg) {
      data.messages.unshift(seed.messages[0]);
    }
  } else {
    data.groups = data.groups.map((g) =>
      g.id === MANDATORY_ADMIN_GROUP_ID
        ? {
            ...g,
            name: seed.groups[0].name,
            description: seed.groups[0].description,
            isMandatoryAdminGroup: true,
            subject: 'announcements',
            creatorId: 'admin_synapse',
            creatorName: 'Synapse',
            creatorUsername: 'Synapse',
            lastMessagePreview:
              g.lastMessagePreview && g.lastMessagePreview.includes('Admin **TanHung**')
                ? seed.groups[0].lastMessagePreview
                : g.lastMessagePreview
          }
        : g
    );
  }

  data.messages = data.messages.map((m) => {
    if (m.id === 'msg_seed_admin_1') {
      return seed.messages[0];
    }
    if (m.groupId === MANDATORY_ADMIN_GROUP_ID && m.senderRole === 'admin') {
      return {
        ...m,
        senderId: 'admin_synapse',
        senderName: 'Synapse',
        senderUsername: 'Synapse',
        senderAvatar: FORUM_ADMIN_AVATAR
      };
    }
    return m;
  });

  return data;
}

function loadForumDb(): ForumDatabase {
  try {
    if (fs.existsSync(FORUM_DB_PATH)) {
      const raw = fs.readFileSync(FORUM_DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.groups) && Array.isArray(parsed.messages)) {
        const normalized = ensureMandatoryAdminGroup(parsed);
        saveForumDb(normalized);
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Could not read .forum_db.json, initializing default store:', err);
  }
  const initial = buildDefaultForumSeed();
  saveForumDb(initial);
  return initial;
}

function saveForumDb(data: ForumDatabase) {
  try {
    fs.writeFileSync(FORUM_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist .forum_db.json:', err);
  }
}

let forumDb: ForumDatabase = loadForumDb();
const forumSseClients = new Set<Response>();

function broadcastForumEvent(payload: Record<string, any>) {
  const dataStr = JSON.stringify({ ...payload, timestamp: Date.now() });
  for (const client of forumSseClients) {
    try {
      client.write(`data: ${dataStr}\n\n`);
    } catch {
      forumSseClients.delete(client);
    }
  }
}

function getSortedGroupsForClient(isAuthenticated: boolean): ForumGroupRecord[] {
  const sorted = [...forumDb.groups].sort((a, b) => {
    if (a.isMandatoryAdminGroup !== b.isMandatoryAdminGroup) {
      return a.isMandatoryAdminGroup ? -1 : 1;
    }
    const ta = new Date(a.lastMessageAt || a.createdAt).getTime();
    const tb = new Date(b.lastMessageAt || b.createdAt).getTime();
    return tb - ta;
  });

  if (isAuthenticated) return sorted;

  return sorted.map((g) =>
    g.isMandatoryAdminGroup
      ? {
          ...g,
          lastMessagePreview: 'Đăng nhập để vào nhóm thông báo do Admin Synapse quản lí.'
        }
      : g
  );
}

app.get('/api/forum/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  forumSseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: 'forum:connected', timestamp: Date.now() })}\n\n`);

  const keepAlive = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(keepAlive);
      forumSseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAlive);
    forumSseClients.delete(res);
  });
});

app.get('/api/forum/groups', (req: Request, res: Response) => {
  const userId = String(req.query.userId || '').trim();
  const isAuthenticated = userId.length > 0;
  return res.json({ groups: getSortedGroupsForClient(isAuthenticated) });
});

app.post('/api/forum/groups', (req: Request, res: Response) => {
  const { id, name, description, subject, creatorId, creatorName, creatorUsername } = req.body || {};

  if (!creatorId || !creatorName) {
    return res.status(401).json({ error: 'Chỉ tài khoản đã đăng nhập mới có thể tạo nhóm học tập.' });
  }

  const cleanName = String(name || '').trim();
  const cleanDesc = String(description || '').trim();
  if (cleanName.length < 3 || cleanName.length > 80) {
    return res.status(400).json({ error: 'Tên nhóm phải từ 3 đến 80 ký tự.' });
  }
  if (cleanDesc.length < 3 || cleanDesc.length > 300) {
    return res.status(400).json({ error: 'Mô tả nhóm phải từ 3 đến 300 ký tự.' });
  }

  const allowedSubjects: ForumSubjectServer[] = ['general', 'math', 'physics', 'cs', 'exams'];
  const cleanSubject: ForumSubjectServer = allowedSubjects.includes(subject) ? subject : 'general';
  const cleanId = id
    ? String(id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128)
    : `grp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  if (!cleanId || cleanId === MANDATORY_ADMIN_GROUP_ID) {
    return res.status(403).json({ error: 'ID nhóm không hợp lệ hoặc trùng với nhóm Admin.' });
  }

  const existingGroup = forumDb.groups.find((g) => g.id === cleanId);
  if (existingGroup) {
    return res.status(200).json({ success: true, group: existingGroup });
  }

  const nowIso = new Date().toISOString();
  const record: ForumGroupRecord = {
    id: cleanId,
    name: cleanName,
    description: cleanDesc,
    subject: cleanSubject,
    isMandatoryAdminGroup: false,
    creatorId: String(creatorId).slice(0, 128),
    creatorName: String(creatorName).slice(0, 100),
    creatorUsername: creatorUsername ? String(creatorUsername).slice(0, 40) : undefined,
    messageCount: 0,
    lastMessagePreview: 'Nhóm vừa được tạo · Hãy gửi tin nhắn đầu tiên!',
    lastMessageAt: nowIso,
    createdAt: nowIso
  };

  forumDb.groups.push(record);
  saveForumDb(forumDb);
  broadcastForumEvent({ type: 'forum:group_created', group: record });

  return res.status(201).json({ success: true, group: record });
});

app.get('/api/forum/groups/:groupId/messages', (req: Request, res: Response) => {
  const groupId = String(req.params.groupId || '').trim();
  const userId = String(req.query.userId || '').trim();

  const group = forumDb.groups.find((g) => g.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm thảo luận.' });
  }

  if (group.isMandatoryAdminGroup && !userId) {
    return res.status(401).json({
      error: 'Chỉ tài khoản đã đăng nhập mới có thể vào nhóm do Admin Synapse quản lí.'
    });
  }

  const messages = forumDb.messages
    .filter((m) => m.groupId === groupId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return res.json({ group, messages });
});

app.post('/api/forum/groups/:groupId/messages', (req: Request, res: Response) => {
  const groupId = String(req.params.groupId || '').trim();
  const {
    id,
    senderId,
    senderName,
    senderUsername,
    senderEmail,
    senderAvatar,
    senderRole,
    content
  } = req.body || {};

  if (!senderId || !senderName) {
    return res.status(401).json({ error: 'Chỉ tài khoản đã đăng nhập mới có thể gửi tin nhắn.' });
  }

  const group = forumDb.groups.find((g) => g.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm thảo luận.' });
  }

  const isAdminSender = isForumAdminIdentity(senderEmail, senderUsername);
  if (group.isMandatoryAdminGroup && !isAdminSender) {
    return res.status(403).json({
      error:
        'Chỉ tài khoản Admin Synapse mới được phép gửi tin nhắn thông báo trong nhóm bắt buộc này.'
    });
  }

  const cleanContent = String(content || '').trim();
  if (cleanContent.length < 1 || cleanContent.length > 2000) {
    return res.status(400).json({ error: 'Nội dung tin nhắn cần từ 1 đến 2000 ký tự.' });
  }

  const nowIso = new Date().toISOString();
  const messageId = id
    ? String(id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128)
    : `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const resolvedRole: 'student' | 'teacher' | 'admin' = isAdminSender
    ? 'admin'
    : senderRole === 'teacher'
    ? 'teacher'
    : 'student';

  const record: ForumMessageRecord = {
    id: messageId,
    groupId,
    isAdminGroup: group.isMandatoryAdminGroup,
    senderId: String(senderId).slice(0, 128),
    senderName: String(isAdminSender ? 'Synapse' : senderName).slice(0, 100),
    senderUsername: isAdminSender
      ? 'Synapse'
      : senderUsername
      ? String(senderUsername).slice(0, 40)
      : undefined,
    senderAvatar: isAdminSender
      ? FORUM_ADMIN_AVATAR
      : senderAvatar
      ? String(senderAvatar).slice(0, 512)
      : undefined,
    senderRole: resolvedRole,
    content: cleanContent,
    createdAt: nowIso
  };

  forumDb.messages.push(record);
  group.messageCount = forumDb.messages.filter((m) => m.groupId === groupId).length;
  group.lastMessagePreview = cleanContent.replace(/\s+/g, ' ').slice(0, 160);
  group.lastMessageAt = nowIso;
  saveForumDb(forumDb);

  broadcastForumEvent({
    type: 'forum:message_created',
    groupId,
    message: record,
    group
  });

  return res.status(201).json({ success: true, message: record, group });
});

app.delete('/api/forum/groups/:groupId', (req: Request, res: Response) => {
  const groupId = String(req.params.groupId || '').trim();
  const userId = String(req.query.userId || req.body?.userId || '').trim();
  const userEmail = String(req.query.userEmail || req.body?.userEmail || '').trim();

  if (!userId) {
    return res.status(401).json({ error: 'Cần đăng nhập để thao tác.' });
  }

  const idx = forumDb.groups.findIndex((g) => g.id === groupId);
  if (idx < 0) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm.' });
  }

  const target = forumDb.groups[idx];
  if (target.isMandatoryAdminGroup || target.id === MANDATORY_ADMIN_GROUP_ID) {
    return res.status(403).json({ error: 'Không thể xóa nhóm thông báo bắt buộc của hệ thống.' });
  }

  const isAdmin = isForumAdminIdentity(userEmail);
  if (target.creatorId !== userId && !isAdmin) {
    return res.status(403).json({ error: 'Chỉ người tạo nhóm hoặc Admin mới có quyền xóa nhóm này.' });
  }

  forumDb.groups.splice(idx, 1);
  forumDb.messages = forumDb.messages.filter((m) => m.groupId !== groupId);
  saveForumDb(forumDb);
  broadcastForumEvent({ type: 'forum:group_deleted', groupId });

  return res.json({ success: true, groupId });
});

app.delete('/api/forum/groups/:groupId/messages/:messageId', (req: Request, res: Response) => {
  const groupId = String(req.params.groupId || '').trim();
  const messageId = String(req.params.messageId || '').trim();
  const userId = String(req.query.userId || req.body?.userId || '').trim();
  const userEmail = String(req.query.userEmail || req.body?.userEmail || '').trim();

  if (!userId) {
    return res.status(401).json({ error: 'Cần đăng nhập để xóa tin nhắn.' });
  }

  const msgIdx = forumDb.messages.findIndex((m) => m.id === messageId && m.groupId === groupId);
  if (msgIdx < 0) {
    return res.status(404).json({ error: 'Không tìm thấy tin nhắn.' });
  }

  const targetMsg = forumDb.messages[msgIdx];
  const isAdmin = isForumAdminIdentity(userEmail);
  if (targetMsg.isAdminGroup && !isAdmin) {
    return res.status(403).json({ error: 'Chỉ Admin Synapse có thể quản lý tin nhắn trong nhóm bắt buộc.' });
  }
  if (targetMsg.senderId !== userId && !isAdmin) {
    return res.status(403).json({ error: 'Bạn chỉ có thể xóa tin nhắn của chính mình.' });
  }

  forumDb.messages.splice(msgIdx, 1);
  const group = forumDb.groups.find((g) => g.id === groupId);
  if (group) {
    const remaining = forumDb.messages
      .filter((m) => m.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    group.messageCount = remaining.length;
    group.lastMessagePreview = remaining[0]?.content.replace(/\s+/g, ' ').slice(0, 160) || '';
    group.lastMessageAt = remaining[0]?.createdAt || group.createdAt;
  }
  saveForumDb(forumDb);

  broadcastForumEvent({ type: 'forum:message_deleted', groupId, messageId, group });
  return res.json({ success: true, messageId, group });
});

app.get('/api/arena/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
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
  timeoutMs = 18000
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

  // Attempt 2: Fast fallback to gemini-3.1-flash-lite
  await new Promise((r) => setTimeout(r, 250));
  return await withTimeout(
    ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: buildConfig('gemini-3.1-flash-lite')
    }),
    Math.min(timeoutMs, 18000),
    'gemini-3.1-flash-lite'
  );
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
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    res.write(': connected\n\n');
  } catch {
    return;
  }

  const heartbeat = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 4000);

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
            thinkingLevel: ThinkingLevel.MINIMAL
          }
        }
      });

      const streamTask = async () => {
        const stream = await chat.sendMessageStream({
          message:
            lastMessageParts.length === 1 && lastMessageParts[0].text
              ? lastMessageParts[0].text
              : lastMessageParts
        });

        let fullText = '';
        for await (const chunk of stream) {
          const piece = chunk.text || '';
          if (piece) {
            fullText += piece;
            sendSse({ delta: piece });
          }
        }
        if (!fullText.trim()) {
          throw new Error(`Empty stream response from ${modelName}`);
        }
        return fullText;
      };

      return await withTimeout(
        streamTask(),
        modelName === 'gemini-4-hydrogen' ? 22000 : 25000,
        `stream-${modelName}`
      );
    };

    let finalReply = '';
    try {
      finalReply = await runStreamWithModel('gemini-4-hydrogen');
    } catch (err1: any) {
      console.warn('Primary stream error, retrying with gemini-3.1-flash-lite:', err1?.message || err1);
      finalReply = await runStreamWithModel('gemini-3.1-flash-lite');
    }

    sendSse({ done: true, reply: finalReply.trim() });
    return res.end();
  } catch (err: any) {
    console.error('Error in /api/gemini/tutor/stream:', err);
    sendSse({ error: extractCleanErrorMessage(err) });
    return res.end();
  } finally {
    clearInterval(heartbeat);
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
        20000,
        `tutor-${modelName}`
      );
    };

    let response;
    try {
      response = await runChatWithModel('gemini-4-hydrogen');
    } catch (err1: any) {
      console.warn('Primary chat error, retrying with gemini-3.1-flash-lite:', err1?.message || err1);
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
function hasDegenerateQuizOptions(options: unknown): boolean {
  if (!Array.isArray(options) || options.length < 4) return true;
  const cleaned = options.map((o) => String(o || '').trim());
  const tooShort = cleaned.some((o) => o.replace(/^[A-Da-d][\.\):]?\s*/, '').trim().length === 0);
  const allUnique = new Set(cleaned.map((o) => o.toLowerCase())).size >= 3;
  return tooShort || !allUnique;
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

    const systemInstruction = isEn
      ? `You are a strict STEM curriculum examiner. Output ONLY valid JSON matching:
{
  "questions": [
    {
      "id": "q1",
      "category": "knowledge" | "specialization",
      "topicTag": "Short topic label (max 6 words)",
      "question": "Full problem statement with KaTeX ($...$)",
      "options": ["Full answer text 1", "Full answer text 2", "Full answer text 3", "Full answer text 4"],
      "correctIndex": 0..3
    }
  ]
}
CRITICAL: Every entry in "options" MUST contain the full concrete answer value/text (e.g. "$x = 2$", "$10\\text{ m/s}$", "Dynamic Programming"). NEVER return bare letters like "A", "B", "C", "D". Vary correctIndex accurately across 0, 1, 2, 3.`
      : `Bạn là chuyên gia khảo thí Toán - Lí - Tin. CHỈ trả về JSON hợp lệ theo cấu trúc:
{
  "questions": [
    {
      "id": "q1",
      "category": "knowledge" | "specialization",
      "topicTag": "Tên chuyên đề ngắn gọn (tối đa 6 từ)",
      "question": "Nội dung câu hỏi đầy đủ, công thức viết chuẩn KaTeX ($...$)",
      "options": ["Nội dung phương án 1", "Nội dung phương án 2", "Nội dung phương án 3", "Nội dung phương án 4"],
      "correctIndex": 0..3
    }
  ]
}
QUY TẮC TUYỆT ĐỐI: Mỗi phần tử trong mảng "options" PHẢI chứa nội dung đáp án đầy đủ (ví dụ "$x = 2$", "$20\\text{ N}$", "Độ phức tạp $\\mathcal{O}(N \\log N)$"). TUYỆT ĐỐI KHÔNG chỉ ghi "A", "B", "C", "D" trống rỗng. Phân bổ correctIndex chính xác và đa dạng (0, 1, 2, 3).`;

    const prompt = isEn
      ? `Create exactly 5 diagnostic & specialization questions for a ${grade} student in ${subjectName}, targeting major "${targetMajor}" (self-assessed level: ${selfLevel}).
- q1, q2, q3: category = "knowledge" — genuine ${grade} ${subjectName} problems with 4 complete concrete answer options and exact correctIndex (0..3).
- q4, q5: category = "specialization" — ask about sub-specialization focus within "${targetMajor}" and study bottleneck, with 4 concrete descriptive options.`
      : `Hãy tạo ĐÚNG 5 câu hỏi đánh giá trình độ và định hướng cho học sinh ${grade} môn ${subjectName}, định hướng chuyên ngành "${targetMajor}" (tự đánh giá: ${selfLevel}).
- Câu 1, 2, 3 (id: q1, q2, q3): category = "knowledge" — 3 bài toán/câu hỏi chuyên môn thực chất trình độ ${grade} môn ${subjectName}, có 4 đáp án cụ thể (KHÔNG ghi mỗi chữ A/B/C/D) và correctIndex chính xác 100% (0..3).
- Câu 4, 5 (id: q4, q5): category = "specialization" — hỏi về nhánh chuyên sâu trong "${targetMajor}" và điểm nghẽn học tập, mỗi câu có 4 lựa chọn mô tả đầy đủ.`;

    let parsed: any = {};
    let attemptModel: 'primary' | 'fallback' = 'primary';

    for (let attempt = 0; attempt < 2; attempt++) {
      const response =
        attemptModel === 'primary'
          ? await callGeminiWithFallback({
              ai,
              contents: prompt,
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingLevel: ThinkingLevel.LOW,
              timeoutMs: 18000
            })
          : await withTimeout(
              ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
                }
              }),
              15000,
              'diagnostic-quiz-retry'
            );

      parsed = safeParseGeminiJson<any>(response.text, {});
      const validList =
        Array.isArray(parsed?.questions) &&
        parsed.questions.length >= 4 &&
        parsed.questions.slice(0, 5).every((q: any) => !hasDegenerateQuizOptions(q?.options));

      if (validList) break;
      attemptModel = 'fallback';
    }

    if (
      !Array.isArray(parsed?.questions) ||
      parsed.questions.length < 4 ||
      parsed.questions.slice(0, 5).some((q: any) => hasDegenerateQuizOptions(q?.options))
    ) {
      throw new Error('Gemini chưa tạo được đầy đủ phương án trả lời hợp lệ. Vui lòng bấm tạo lại.');
    }

    const normalized = parsed.questions.slice(0, 5).map((q: any, idx: number) => ({
      id: String(q.id || `q${idx + 1}`),
      category: q.category === 'specialization' || idx >= 3 ? 'specialization' : 'knowledge',
      topicTag: String(q.topicTag || `Chuyên đề ${idx + 1}`),
      question: String(q.question || ''),
      options: q.options.map((o: any) => String(o || '').trim()).slice(0, 4),
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

    const systemInstruction = isEn
      ? `You are a senior STEM academic mentor. Output ONLY valid JSON matching:
{
  "estimatedLevel": "short level assessment",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["gap 1", "gap 2"],
  "majorAdvice": "specialization advice connecting subject to target major",
  "dailyScheduleSummary": "e.g. 45-60 mins/day breakdown",
  "stages": [
    {
      "step": 1,
      "phase": "Stage 01",
      "title": "Stage title",
      "durationWeeks": 2,
      "dailyMinutes": 45,
      "focusTopics": ["Topic 1", "Topic 2", "Topic 3"],
      "recommendedModule": "${subj}",
      "concreteTasks": ["Task 1", "Task 2"],
      "targetMilestone": "Measurable milestone"
    }
  ]
}
CRITICAL: Return EXACTLY 4 stages (step 1..4). recommendedModule must be one of: "${subj}", "exams", "arena", "roadmap". Format math/physics in KaTeX ($...$).`
      : `Bạn là cố vấn học thuật STEM. CHỈ trả về JSON hợp lệ theo cấu trúc:
{
  "estimatedLevel": "nhận định trình độ hiện tại ngắn gọn",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
  "weaknesses": ["lỗ hổng cần khắc phục 1", "lỗ hổng 2"],
  "majorAdvice": "lời khuyên định hướng chuyên ngành gắn với môn học",
  "dailyScheduleSummary": "lịch học khuyến nghị mỗi ngày (vd 45-60 phút/ngày)",
  "stages": [
    {
      "step": 1,
      "phase": "Chặng 01",
      "title": "Tiêu đề chặng",
      "durationWeeks": 2,
      "dailyMinutes": 45,
      "focusTopics": ["Chuyên đề 1", "Chuyên đề 2", "Chuyên đề 3"],
      "recommendedModule": "${subj}",
      "concreteTasks": ["Việc làm cụ thể 1", "Việc làm cụ thể 2"],
      "targetMilestone": "Mục tiêu đầu ra cần đạt"
    }
  ]
}
QUY TẮC: stages PHẢI có ĐÚNG 4 chặng (step 1..4). recommendedModule chọn trong: "${subj}", "exams", "arena", "roadmap". Công thức viết chuẩn KaTeX ($...$, dùng \\frac).`;

    const prompt = isEn
      ? `Analyze the student's diagnostic result and generate a visual personalized learning roadmap for ${subjectName} (${grade}), target major "${targetMajor}".
Knowledge Score: ${knowledgeCorrect}/${knowledgeTotal} (${knowledgeScore}%).
Specialization preferences: ${specSummary.join(' | ') || 'None specified'}.
Custom student goal: ${customGoal || 'Master core topics & excel in exams'}.
Transcript:
${answerTranscript}`
      : `Phân tích năng lực từ bài đánh giá sau và thiết kế SƠ ĐỒ LỘ TRÌNH HỌC TẬP CÁ NHÂN HÓA môn ${subjectName} (${grade}), định hướng chuyên ngành "${targetMajor}".
Điểm chuyên môn: ${knowledgeCorrect}/${knowledgeTotal} câu đúng (${knowledgeScore}%).
Định hướng đã chọn: ${specSummary.join(' | ') || 'Chưa rõ'}.
Mục tiêu riêng của học sinh: ${customGoal || 'Nắm chắc bản chất, xử lý bài tập vững và đạt điểm cao'}.

Chi tiết bài làm:
${answerTranscript}`;

    let parsed: any = {};
    for (let attempt = 0; attempt < 2; attempt++) {
      const response =
        attempt === 0
          ? await callGeminiWithFallback({
              ai,
              contents: prompt,
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingLevel: ThinkingLevel.MINIMAL,
              timeoutMs: 16000
            })
          : await withTimeout(
              ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
                }
              }),
              15000,
              'diagnostic-roadmap-retry'
            );

      parsed = safeParseGeminiJson<any>(response.text, {});
      if (Array.isArray(parsed?.stages) && parsed.stages.length >= 3) break;
    }

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

// =====================================================================
// GEMINI AI: MULTIMODAL EXAM PHOTO GRADING (0 - 10 SCALE) & FOLLOW-UP Q&A
// =====================================================================
app.post('/api/gemini/grade-exam-image', async (req: Request, res: Response) => {
  try {
    const {
      subject = 'math',
      examTitle = '',
      track = 'khong_chuyen',
      questions = [],
      studentImages = [],
      studentNotesText = '',
      language = 'vi'
    } = req.body || {};

    const validImages = Array.isArray(studentImages)
      ? studentImages.filter((img: any) => img && typeof img.base64 === 'string' && img.base64.trim().length > 0).slice(0, 5)
      : [];
    const hasNotes = String(studentNotesText || '').trim().length > 0;

    if (validImages.length === 0 && !hasNotes) {
      return res.status(400).json({
        error:
          language === 'en'
            ? 'Please upload at least one answer sheet photo or enter notes before submitting for AI grading.'
            : 'Vui lòng tải lên ít nhất 1 ảnh bài làm hoặc nhập nháp lời giải trước khi nộp cho AI chấm điểm.'
      });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjName =
      subject === 'physics'
        ? isEn ? 'Physics' : 'Vật lí'
        : subject === 'cs'
        ? isEn ? 'Computer Science' : 'Tin học'
        : isEn ? 'Mathematics' : 'Toán học';

    const parts: any[] = [];
    for (const img of validImages) {
      const raw = String(img.base64);
      const mimeMatch = raw.match(/^data:([^;]+);base64,/);
      const cleanBase64 = raw.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: img.mimeType || (mimeMatch ? mimeMatch[1] : 'image/jpeg'),
          data: cleanBase64
        }
      });
    }

    const safeQuestions = Array.isArray(questions) ? questions : [];
    const examTranscript = safeQuestions
      .map(
        (q: any, idx: number) =>
          `[${q.number || `Q${idx + 1}`}${q.points ? ` - ${q.points}` : ''}]\nĐỀ BÀI: ${q.content}\nĐÁP ÁN CHUẨN: ${q.solution}`
      )
      .join('\n\n---\n\n');

    const promptText = isEn
      ? `You are a strict, fair ${subjName} examiner grading a student's submitted exam (${track === 'chuyen' ? 'Specialized / Olympiad Track' : 'Standard High School Track'}): "${examTitle}".
Total scale: 0 to 10 points (increments of 0.25 or 0.5).

EXAM QUESTIONS & OFFICIAL SOLUTIONS:
${examTranscript}

STUDENT DRAFT NOTES (if any):
${hasNotes ? studentNotesText : '(None typed; see attached handwritten photo(s) above)'}

TASK:
1. Carefully OCR and read every line, equation, diagram, or code in the student's attached photo(s) (and/or draft notes).
2. Match each part of the student's work to the corresponding exam question. If a question is not answered in the photo/notes, mark status as "missing" with 0 earned points.
3. Grade accurately step-by-step on a 0–10 total scale. Never invent steps the student did not write. If the image is completely unrelated or blank, score 0 and explain clearly.
4. Provide a concise verdict, overall summary, questionBreakdown for all ${safeQuestions.length} questions, specific strengths, exact mistakes/missing conditions, and actionable nextAdvice. Format formulas in KaTeX ($...$). Respond strictly in JSON matching the schema.`
      : `Bạn là Giám khảo chấm thi môn ${subjName} (${track === 'chuyen' ? 'Hệ Chuyên / HSG' : 'Hệ Phổ Thông / THPT'}), chấm bài thi "${examTitle}" trên thang điểm 0 đến 10 (làm tròn 0.25 hoặc 0.5 điểm).

ĐỀ BÀI & ĐÁP ÁN CHUẨN TỪNG CÂU:
${examTranscript}

PHẦN NHÁP / GHI CHÚ CỦA HỌC SINH (nếu có):
${hasNotes ? studentNotesText : '(Học sinh nộp ảnh bài làm viết tay đính kèm ở trên)'}

NHIỆM VỤ:
1. Đọc kỹ chữ viết tay, công thức, hình vẽ hoặc đoạn code trong các ảnh đính kèm (kết hợp nháp nếu có).
2. Đối chiếu từng ý bài làm của học sinh với đáp án chuẩn của từng câu. Câu nào không thấy trong ảnh hoặc chưa làm thì đánh status = "missing" và cho 0 điểm câu đó.
3. Chấm điểm công tâm, chính xác từng bước (tổng điểm thang 0–10). Tuyệt đối không tự bịa thêm ý mà học sinh không viết. Nếu ảnh bị mờ hoàn toàn hoặc không phải bài làm, cho 0 điểm và nêu rõ lý do.
4. Trả về JSON đúng schema gồm: score (0-10), verdict (xếp loại ngắn), summary (nhận xét tổng quan), questionBreakdown (đủ ${safeQuestions.length} câu), strengths, mistakes, nextAdvice. Mọi công thức viết chuẩn KaTeX ($...$). Phản hồi bằng Tiếng Việt.`;

    parts.push({ text: promptText });

    const response = await callGeminiWithFallback({
      ai,
      contents: { parts },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: 'Total score from 0 to 10' },
          verdict: { type: Type.STRING, description: 'Short rating e.g. Xuat sac / Kha / Can co gang' },
          summary: { type: Type.STRING, description: 'Overall examiner assessment' },
          questionBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionNumber: { type: Type.STRING },
                earned: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                status: { type: Type.STRING, description: 'correct | partial | incorrect | missing' },
                comment: { type: Type.STRING }
              }
            }
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          nextAdvice: { type: Type.STRING }
        }
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 35000
    });

    const parsed = safeParseGeminiJson<any>(response.text, {});
    const rawScore = Number(parsed?.score);
    const clampedScore = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(10, Math.round(rawScore * 4) / 4))
      : 0;

    const validStatuses = new Set(['correct', 'partial', 'incorrect', 'missing']);
    const breakdown = Array.isArray(parsed?.questionBreakdown)
      ? parsed.questionBreakdown.map((item: any, idx: number) => ({
          questionNumber: String(item?.questionNumber || safeQuestions[idx]?.number || `Q${idx + 1}`),
          earned: Math.max(0, Number(item?.earned ?? 0)),
          max: Math.max(0.5, Number(item?.max ?? 2.5)),
          status: validStatuses.has(String(item?.status)) ? String(item.status) : 'partial',
          comment: String(item?.comment || '')
        }))
      : [];

    return res.json({
      success: true,
      evaluation: {
        score: clampedScore,
        maxScore: 10,
        verdict: String(
          parsed?.verdict ||
            (clampedScore >= 8
              ? isEn ? 'Excellent' : 'Xuất sắc'
              : clampedScore >= 6.5
              ? isEn ? 'Good' : 'Khá tốt'
              : clampedScore >= 5
              ? isEn ? 'Pass' : 'Đạt yêu cầu'
              : isEn ? 'Needs Review' : 'Cần ôn tập thêm')
        ),
        summary: String(
          parsed?.summary ||
            (isEn ? 'AI grading completed for your submitted solution.' : 'AI đã hoàn thành chấm ảnh bài làm của bạn.')
        ),
        questionBreakdown: breakdown,
        strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.map(String) : [],
        mistakes: Array.isArray(parsed?.mistakes) ? parsed.mistakes.map(String) : [],
        nextAdvice: String(
          parsed?.nextAdvice ||
            (isEn
              ? 'Ask follow-up questions below on any step you want explained more clearly.'
              : 'Hãy đặt câu hỏi ngay bên dưới để AI giải thích kỹ những phần em còn băn khoăn.')
        ),
        gradedAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/grade-exam-image:', err);
    return res.status(500).json({
      error: extractCleanErrorMessage(err)
    });
  }
});

app.post('/api/gemini/exam-qa', async (req: Request, res: Response) => {
  try {
    const {
      subject = 'math',
      examTitle = '',
      questions = [],
      studentImages = [],
      evaluation = null,
      messages = [],
      language = 'vi'
    } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: language === 'en' ? 'Please enter your question.' : 'Vui lòng nhập câu hỏi cần AI giải đáp.'
      });
    }

    const ai = getGenAI();
    const isEn = language === 'en';
    const subjLabel =
      subject === 'physics'
        ? isEn ? 'Physics' : 'Vật lí'
        : subject === 'cs'
        ? isEn ? 'Computer Science' : 'Tin học'
        : isEn ? 'Mathematics' : 'Toán học';

    const safeQuestions = Array.isArray(questions) ? questions : [];
    const examContext = safeQuestions
      .map(
        (q: any, idx: number) =>
          `${q.number || `Q${idx + 1}`}: ${q.content}\nĐáp án chuẩn: ${q.solution}`
      )
      .join('\n\n');

    const evalContext = evaluation
      ? `KẾT QUẢ AI ĐÃ CHẤM: ${evaluation.score}/10 (${evaluation.verdict})\nNhận xét chung: ${evaluation.summary}\nChi tiết từng câu: ${(evaluation.questionBreakdown || [])
          .map((b: any) => `${b.questionNumber}: ${b.earned}/${b.max} (${b.status}) - ${b.comment}`)
          .join(' | ')}\nLỗi sai cần lưu ý: ${(evaluation.mistakes || []).join('; ')}`
      : '';

    const systemInstruction = isEn
      ? `You are a dedicated ${subjLabel} tutor helping a student understand every unclear part of the exam "${examTitle}" after grading.
Respond clearly, warmly, step-by-step in English, using KaTeX ($...$ or $$...$$) for every mathematical/physics expression. Reference the student's uploaded answer photo(s) and the grading feedback directly when relevant.

EXAM CONTEXT:
${examContext}

${evalContext}`
      : `Bạn là Gia sư chuyên sâu môn ${subjLabel}, đang giải đáp thắc mắc cho học sinh sau khi nộp bài và chấm điểm đề "${examTitle}".
Hãy giải thích cặn kẽ, sư phạm, từng bước một bằng Tiếng Việt. Mọi công thức Toán/Lí/Độ phức tạp viết chuẩn KaTeX ($...$ hoặc $$...$$, luôn dùng \\frac{a}{b}). Nếu học sinh hỏi vì sao bị trừ điểm hoặc chưa hiểu bước biến đổi nào trong ảnh bài làm hay đáp án chuẩn, hãy chỉ ra đúng dòng/bước đó và giảng rõ bản chất.

NỘI DUNG ĐỀ THI & ĐÁP ÁN:
${examContext}

${evalContext}`;

    const validImages = Array.isArray(studentImages)
      ? studentImages.filter((img: any) => img && typeof img.base64 === 'string' && img.base64.trim().length > 0).slice(0, 4)
      : [];

    const { history, lastMessageParts } = buildGeminiChatHistoryAndLastTurn(messages);

    const imageParts = validImages.map((img: any) => {
      const raw = String(img.base64);
      const mimeMatch = raw.match(/^data:([^;]+);base64,/);
      return {
        inlineData: {
          mimeType: img.mimeType || (mimeMatch ? mimeMatch[1] : 'image/jpeg'),
          data: raw.replace(/^data:[^;]+;base64,/, '')
        }
      };
    });

    // Attach the submitted student answer images to the earliest user turn so AI retains visual context
    if (imageParts.length > 0) {
      if (history.length > 0 && history[0].role === 'user') {
        history[0].parts = [...imageParts, ...history[0].parts];
      } else {
        lastMessageParts.unshift(...imageParts);
      }
    }

    const runChatWithModel = async (modelName: string) => {
      const chat = ai.chats.create({
        model: modelName,
        history,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: modelName === 'gemini-3.1-flash-lite' ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
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
        22000,
        `exam-qa-${modelName}`
      );
    };

    let response;
    try {
      response = await runChatWithModel('gemini-4-hydrogen');
    } catch (err1: any) {
      console.warn('Exam QA primary error, retrying with gemini-3.1-flash-lite:', err1?.message || err1);
      response = await runChatWithModel('gemini-3.1-flash-lite');
    }

    const reply = (response.text || '').trim();
    if (!reply) {
      throw new Error(isEn ? 'AI returned an empty reply. Please retry.' : 'AI chưa trả về phản hồi. Vui lòng thử lại.');
    }
    return res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Error in /api/gemini/exam-qa:', err);
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
Bạn là Giám thị trưởng và Chuyên gia thiết kế bộ test Tin học (VNOI / ICPC).
Nhiệm vụ của bạn:
1. Đọc và phân tích kỹ lưỡng đề bài được cung cấp qua hình ảnh (OCR) hoặc văn bản.
2. Tách rõ:
   - title: Tiêu đề bài toán (ngắn gọn, chuẩn tin học, tiếng Việt).
   - description: Toàn bộ nội dung yêu cầu bài toán (rõ ràng, không bị thiếu thông tin).
   - inputFormat: Quy cách dữ liệu đầu vào.
   - outputFormat: Quy cách dữ liệu đầu ra.
   - constraints: Các ràng buộc thời gian, bộ nhớ, giá trị N, A[i].
3. RẤT QUAN TRỌNG: Hãy TỰ GIẢI bài toán này một cách chính xác tuyệt đối, sau đó sinh bộ Test Cases theo **BẬC THANG ĐỘ KHÓ TĂNG DẦN** (tuyệt đối KHÔNG dồn các test quá khó hoặc đánh đố ngay từ đầu):
   - sampleCases (2 test, difficulty: "Cơ bản"): Dữ liệu rất nhỏ, đơn giản, giúp người học hiểu đề và thử ngay ý tưởng cơ bản.
   - hiddenCases (6 test SẮP XẾP TĂNG DẦN ĐỘ KHÓ TỪ DỄ ĐẾN KHÓ):
     + Test ẩn 1 & 2 (difficulty: "Cơ bản"): Dữ liệu nhỏ, số dương đẹp (ví dụ N = 2..5), không gài bẫy, code viết đúng logic chính là qua ngay.
     + Test ẩn 3 & 4 (difficulty: "Trung bình"): Dữ liệu cỡ vừa (N = 5..12), thêm số âm / phần tử trùng / trường hợp không tìm thấy hoặc rẽ nhánh phụ.
     + Test ẩn 5 (difficulty: "Nâng cao"): Trường hợp biên tinh tế (N = 1, giá trị 0, mảng đảo ngược hoặc nhiều đáp án hòa nhau).
     + Test ẩn 6 (difficulty: "Thử thách"): Giá trị lớn hoặc kích thước sát giới hạn (kiểm tra kiểu 64-bit long long và độ phức tạp thuật toán).
   - MỖI TEST CASE PHẢI CÓ 'input', 'expectedOutput' ĐƯỢC BẠN TÍNH TOÁN ĐÚNG 100%, và 'difficulty' thuộc đúng 1 trong 4 nhãn: "Cơ bản", "Trung bình", "Nâng cao", "Thử thách".
4. Đưa ra mã nguồn tham khảo (referenceCpp và referencePython) giải đúng bài toán này.

${text ? `Dữ liệu văn bản người dùng cung cấp:\n${text}` : ''}
`;

    parts.push({ text: promptText });

    const response = await callGeminiWithFallback({
      ai,
      contents: { parts },
      systemInstruction: `You are an elite competitive programming judge. Extract the problem from user input (OCR/text) and output strict JSON with keys: title (string), description (string), inputFormat (string), outputFormat (string), constraints (array of strings), sampleCases (array of objects { id, input, expectedOutput, isSample: true, difficulty: "Cơ bản", explanation }), hiddenCases (array of 6 objects strictly ordered from easiest to hardest: { id, input, expectedOutput, isSample: false, difficulty: "Cơ bản" | "Trung bình" | "Nâng cao" | "Thử thách" }), referenceCpp (string), referencePython (string). Ensure expectedOutput is 100% mathematically and algorithmically accurate.`,
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

/**
 * API: Analyze failed tests & mistakes in student code using AI, explain clearly and provide simple sample code
 */
app.post('/api/gemini/analyze-code-mistake', async (req: Request, res: Response) => {
  try {
    const {
      problemTitle = 'Bài toán lập trình',
      problemDescription = '',
      inputFormat = '',
      outputFormat = '',
      language = 'cpp',
      userCode = '',
      score = 0,
      failedTests = []
    } = req.body;

    if (!userCode || !String(userCode).trim()) {
      return res.status(400).json({ error: 'Vui lòng cung cấp mã nguồn để AI phân tích.' });
    }

    const ai = getGenAI();
    const langName = language === 'python' ? 'Python 3' : 'C++17/20';

    const failedBlock = Array.isArray(failedTests) && failedTests.length > 0
      ? failedTests
          .slice(0, 5)
          .map(
            (ft: any, i: number) =>
              `Test sai #${ft.index ?? i + 1} (${ft.status || 'Wrong Answer'}):\n` +
              `- Input:\n${String(ft.input ?? '').slice(0, 400)}\n` +
              `- Đáp án đúng (Expected):\n${String(ft.expected ?? '').slice(0, 300)}\n` +
              `- Output của bạn (Actual):\n${String(ft.actual ?? '').slice(0, 300)}`
          )
          .join('\n\n')
      : 'Người dùng muốn đánh giá logic và tối ưu mã nguồn.';

    const prompt = `
Bạn là Gia sư Lập trình & Giám khảo Tin học (VNOI / HSG).
Học sinh vừa nộp bài cho đề: "${problemTitle}" (Điểm: ${score}/100, Ngôn ngữ: ${langName}).

Mô tả đề bài:
${String(problemDescription).slice(0, 2000)}
${inputFormat ? `\nInput Format: ${inputFormat}` : ''}
${outputFormat ? `\nOutput Format: ${outputFormat}` : ''}

Mã nguồn của học sinh (${langName}):
\`\`\`${language}
${String(userCode).slice(0, 5000)}
\`\`\`

Các test bị sai / lỗi thực thi:
${failedBlock}

Yêu cầu phân tích:
1. Chỉ rõ chỗ sai / nguyên nhân gây ra lỗi hoặc sai đáp án (ví dụ: sai logic, thiếu xử lý biên, tràn số int -> long long, sai vòng lặp, đọc sai input, lỗi cú pháp...).
2. Giải thích thật dễ hiểu cho học sinh biết vì sao code hiện tại tạo ra Output như trên thay vì Expected.
3. Đưa ra **simpleSampleCode**: Một đoạn code mẫu **ĐƠN GIẢN, NGẮN GỌN, DỄ HIỂU NHẤT** bằng ${langName} (có chú thích tiếng Việt súc tích ở các bước chính) để học sinh dễ học theo và chạy đúng 100% các test trên.
4. Viết **simpleCodeExplanation** giải thích ngắn gọn cách hoạt động của code mẫu đơn giản đó.
`;

    const response = await callGeminiWithFallback({
      ai,
      contents: prompt,
      systemInstruction:
        'You are a patient Vietnamese competitive programming mentor. Diagnose exact mistakes in the student code against failed tests and output clean JSON strictly following the schema.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          mistakes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                issue: { type: Type.STRING },
                explanation: { type: Type.STRING },
                fixHint: { type: Type.STRING }
              },
              required: ['location', 'issue', 'explanation', 'fixHint']
            }
          },
          simpleSampleCode: { type: Type.STRING },
          simpleCodeExplanation: { type: Type.STRING },
          complexityNote: { type: Type.STRING }
        },
        required: ['summary', 'mistakes', 'simpleSampleCode', 'simpleCodeExplanation', 'complexityNote']
      },
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 26000
    });

    const analysis = safeParseGeminiJson<any>(response.text, null);
    if (!analysis || !analysis.summary) {
      throw new Error('Không thể phân tích cấu trúc phản hồi từ AI.');
    }

    return res.json({ success: true, analysis });
  } catch (err: any) {
    console.error('Error analyzing code mistake with Gemini:', err);
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
      thinkingLevel: ThinkingLevel.MINIMAL,
      timeoutMs: 18000
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

    const systemInstruction = isEn
      ? `You are an expert STEM teacher. Output ONLY valid JSON matching:
{
  "miniQuiz": [
    {
      "id": "mcq1",
      "question": "Question text with KaTeX ($...$)",
      "options": ["A. Full option 1", "B. Full option 2", "C. Full option 3", "D. Full option 4"],
      "correctIndex": 0..3,
      "explanation": "Clear step-by-step explanation"
    }
  ],
  "miniEssay": {
    "id": "essay1",
    "question": "Short 3-5 line conceptual/calculation prompt",
    "hint": "Concise hint",
    "rubricChecklist": ["Criterion 1", "Criterion 2", "Criterion 3"],
    "sampleAnswer": "Concise reference solution"
  }
}
CRITICAL: miniQuiz MUST have exactly 2 distinct questions, each with 4 full non-empty options (never bare "A"/"B"/"C"/"D").`
      : `Bạn là giáo viên chuyên môn Toán - Lí - Tin. CHỈ trả về JSON hợp lệ theo cấu trúc:
{
  "miniQuiz": [
    {
      "id": "mcq1",
      "question": "Nội dung câu hỏi (KaTeX $...$)",
      "options": ["A. Nội dung đầy đủ 1", "B. Nội dung đầy đủ 2", "C. Nội dung đầy đủ 3", "D. Nội dung đầy đủ 4"],
      "correctIndex": 0..3,
      "explanation": "Giải thích chi tiết"
    }
  ],
  "miniEssay": {
    "id": "essay1",
    "question": "Câu hỏi tự luận ngắn 3-5 dòng",
    "hint": "Gợi ý ngắn",
    "rubricChecklist": ["Tiêu chí 1", "Tiêu chí 2", "Tiêu chí 3"],
    "sampleAnswer": "Lời giải mẫu ngắn gọn"
  }
}
QUY TẮC: miniQuiz PHẢI gồm đúng 2 câu hỏi khác nhau, mỗi câu có 4 phương án đầy đủ nội dung (TUYỆT ĐỐI không chỉ ghi A/B/C/D).`;

    const prompt = isEn
      ? `Create a focused micro-assessment for ${subject} lesson "${lessonTitle}", section "${stepTitle}".
Concept: ${conceptSection}
Formula: ${primaryFormula}
Deep dive: ${deepDiveSection}
Return EXACTLY 2 MCQs (1 conceptual/condition check, 1 formula application) + 1 miniEssay. Format math/physics in KaTeX ($...$).`
      : `Hãy tạo bộ kiểm tra kiến thức cho phần sau của môn ${subjLabel}:
Bài học: ${lessonTitle}
Phần: ${stepTitle}
Khái niệm: ${conceptSection}
Công thức: ${primaryFormula}
Giải thích sâu: ${deepDiveSection}
Trả về ĐÚNG 2 câu trắc nghiệm (câu 1 kiểm tra bản chất/điều kiện, câu 2 vận dụng công thức/bài toán cụ thể) + 1 câu tự luận ngắn. Công thức viết chuẩn KaTeX ($...$, luôn dùng \\frac{a}{b}).`;

    let parsed: any = {};
    for (let attempt = 0; attempt < 2; attempt++) {
      const response =
        attempt === 0
          ? await callGeminiWithFallback({
              ai,
              contents: prompt,
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingLevel: ThinkingLevel.MINIMAL,
              timeoutMs: 16000
            })
          : await withTimeout(
              ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
                }
              }),
              15000,
              'step-quiz-retry'
            );

      parsed = safeParseGeminiJson<any>(response.text, {});
      const valid =
        Array.isArray(parsed?.miniQuiz) &&
        parsed.miniQuiz.length >= 2 &&
        parsed.miniQuiz.slice(0, 2).every((q: any) => !hasDegenerateQuizOptions(q?.options)) &&
        Boolean(parsed?.miniEssay?.question);
      if (valid) break;
    }

    if (
      !Array.isArray(parsed?.miniQuiz) ||
      parsed.miniQuiz.length < 2 ||
      parsed.miniQuiz.slice(0, 2).some((q: any) => hasDegenerateQuizOptions(q?.options)) ||
      !parsed?.miniEssay?.question
    ) {
      throw new Error('Gemini chưa tạo đủ 2 câu trắc nghiệm + 1 tự luận hợp lệ. Vui lòng thử lại.');
    }

    return res.json({
      success: true,
      miniQuiz: parsed.miniQuiz.slice(0, 2).map((q: any, idx: number) => ({
        id: String(q.id || `ai_mcq_${Date.now()}_${idx}`),
        question: String(q.question || ''),
        options: q.options.map((o: any) => String(o || '').trim()).slice(0, 4),
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

    const systemInstruction = isEn
      ? `You are a STEM learning analytics advisor. Output ONLY valid JSON matching:
{
  "overallMastery": 0..100,
  "readinessLevel": "short status string",
  "summaryFeedback": "2-3 sentences diagnosing mastery and root gaps",
  "strongPoints": ["strength 1", "strength 2"],
  "weakPoints": ["gap 1", "gap 2"],
  "recommendedRoadmap": [
    {
      "step": 1,
      "title": "short action title",
      "action": "concrete instruction",
      "targetType": "review_step",
      "stepIndex": 0
    }
  ]
}
CRITICAL: recommendedRoadmap must have 3-4 steps. targetType MUST be one of: "review_step", "sim_2d", "sim_3d", "ai_tutor", "next_lesson", "exams", "arena". Include numeric 0-based "stepIndex" when targetType is "review_step". Format math/physics in KaTeX ($...$).`
      : `Bạn là chuyên gia phân tích kết quả học tập STEM. CHỈ trả về JSON hợp lệ theo cấu trúc:
{
  "overallMastery": 0..100,
  "readinessLevel": "nhận định ngắn gọn trạng thái sẵn sàng",
  "summaryFeedback": "2-3 câu phân tích điểm làm được, lỗ hổng tư duy/công thức và định hướng cải thiện",
  "strongPoints": ["điểm mạnh 1", "điểm mạnh 2"],
  "weakPoints": ["điểm yếu/cần ôn 1", "điểm yếu 2"],
  "recommendedRoadmap": [
    {
      "step": 1,
      "title": "tiêu đề hành động ngắn gọn",
      "action": "hướng dẫn cụ thể bước tiếp theo",
      "targetType": "review_step",
      "stepIndex": 0
    }
  ]
}
QUY TẮC: recommendedRoadmap gồm 3-4 bước theo thứ tự ưu tiên. targetType CHỈ chọn trong: "review_step", "sim_2d", "sim_3d", "ai_tutor", "next_lesson", "exams", "arena". Nếu targetType là "review_step" thì kèm "stepIndex" (chỉ số 0-based). Công thức dùng KaTeX ($...$).`;

    const prompt = isEn
      ? `Analyze the student's per-section results in lesson "${lessonTitle}" (${subj}, ${grade}) and recommend a concrete next-step learning roadmap.
Results:
${transcript}`
      : `Phân tích kết quả học tập chi tiết theo từng phần của học sinh trong bài "${lessonTitle}" (Môn: ${subj}, Trình độ: ${grade}) và đề xuất lộ trình học tiếp theo thật hợp lý.
Dữ liệu làm bài từng phần:
${transcript}`;

    let parsed: any = {};
    for (let attempt = 0; attempt < 2; attempt++) {
      const response =
        attempt === 0
          ? await callGeminiWithFallback({
              ai,
              contents: prompt,
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingLevel: ThinkingLevel.MINIMAL,
              timeoutMs: 16000
            })
          : await withTimeout(
              ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
                }
              }),
              15000,
              'analyze-lesson-progress-retry'
            );

      parsed = safeParseGeminiJson<any>(response.text, {});
      if (Array.isArray(parsed?.recommendedRoadmap) && parsed.recommendedRoadmap.length > 0) break;
    }

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
  const isDev = process.env.NODE_ENV !== 'production' && process.env.RENDER !== 'true';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true', allowedHosts: true },
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
    console.log(`Synapse server running on http://${HOST}:${PORT}`);
  });
}

startServer();
