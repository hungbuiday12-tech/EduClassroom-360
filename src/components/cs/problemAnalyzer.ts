import { CodeLanguage, CodingProblem, ProblemIOMode, TestCase, TestDifficultyTier } from '../../types';
import { compareOutputs, executeCode, parseTimeLimitMs } from './codeRunner';
import { safeFetchJson } from '../../lib/apiClient';

export interface UserSamplePair {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface DetectedExecutionConfig {
  ioMode: ProblemIOMode;
  inputFileName: string;
  outputFileName: string;
  timeLimitEnabled: boolean;
  timeLimitMs: number | null;
}

export function detectProblemExecutionConfig(rawText: string = ''): DetectedExecutionConfig {
  const txt = (rawText || '').replace(/#ifndef\s+ONLINE_JUDGE\b[\s\S]*?#endif\b[^\n]*/gi, '');
  const lower = txt.toLowerCase();

  let timeLimitEnabled = true;
  let timeLimitMs: number | null = 1000;

  if (/không\s*giới\s*hạn\s*thời\s*gian|no\s*time\s*limit|unlimited\s*time/i.test(lower)) {
    timeLimitEnabled = false;
    timeLimitMs = null;
  } else {
    const tlMatch = txt.match(
      /(?:thời\s*gian(?:\s*chạy|\s*giới\s*hạn)?|time\s*limit)\s*[:：]?\s*(\d+(?:[.,]\d+)?)\s*(ms|giây|sec|seconds|s)\b/i
    );
    if (tlMatch) {
      const val = Number(tlMatch[1].replace(',', '.'));
      const unit = tlMatch[2].toLowerCase();
      if (!Number.isNaN(val) && val > 0) {
        timeLimitMs = unit === 'ms' ? Math.max(50, Math.round(val)) : Math.max(50, Math.round(val * 1000));
      }
    }
  }

  let ioMode: ProblemIOMode = 'standard';
  let inputFileName = '';
  let outputFileName = '';

  const freopenIn = txt.match(/freopen\s*\(\s*["']([^"']+)["']\s*,\s*["']r["']/i);
  const freopenOut = txt.match(/freopen\s*\(\s*["']([^"']+)["']\s*,\s*["']w["']/i);
  const extIn = txt.match(/\b([A-Za-z0-9_-]+\.(?:INP|IN|inp|in))\b/);
  const extOut = txt.match(/\b([A-Za-z0-9_-]+\.(?:OUT|out))\b/);
  const mentionsFileKeyword =
    /(?:tệp|file\s*(?:văn\s*bản|vào|ra|input|output)|đọc\s*(?:từ|dữ\s*liệu\s*từ)\s*(?:file|tệp)|ghi\s*(?:kết\s*quả\s*)?(?:ra|vào)\s*(?:file|tệp))/i.test(
      txt
    );

  if (freopenIn || freopenOut || (extIn && extOut)) {
    ioMode = 'file';
    inputFileName = (freopenIn?.[1] || extIn?.[1] || 'INPUT.INP').trim();
    outputFileName = (freopenOut?.[1] || extOut?.[1] || 'OUTPUT.OUT').trim();
  } else if (mentionsFileKeyword && (extIn || extOut)) {
    ioMode = 'file';
    inputFileName = (extIn?.[1] || 'INPUT.INP').trim();
    outputFileName = (extOut?.[1] || 'OUTPUT.OUT').trim();
  }

  return {
    ioMode,
    inputFileName,
    outputFileName,
    timeLimitEnabled,
    timeLimitMs
  };
}

export interface AnalyzeProblemRequest {
  text: string;
  imageBase64?: string | null;
  mimeType?: string;
  fileName?: string | null;
  userSamples?: UserSamplePair[];
  referenceCode?: string;
  referenceLang?: CodeLanguage;
  timeLimitEnabled?: boolean;
  timeLimitMs?: number | null;
  ioMode?: ProblemIOMode;
  inputFileName?: string;
  outputFileName?: string;
  userConfiguredExecution?: boolean;
}

export interface AnalyzeProblemResult {
  problem: CodingProblem;
  source: 'ai' | 'local-oracle' | 'local-inferred' | 'template';
  referenceCpp?: string;
  referencePython?: string;
  diagnosticNote: string;
}

type AlgorithmKind =
  | 'sum_ab'
  | 'diff_ab'
  | 'prod_ab'
  | 'sum_prod_ab'
  | 'max_ab'
  | 'gcd_ab'
  | 'lcm_ab'
  | 'prime_check'
  | 'count_primes'
  | 'factorial'
  | 'fibonacci'
  | 'sum_1_to_n'
  | 'digit_sum'
  | 'array_sum'
  | 'array_max'
  | 'array_min'
  | 'array_sort_asc'
  | 'array_sort_desc'
  | 'array_count_even'
  | 'array_mode'
  | 'kadane_max_subarray'
  | 'lis'
  | 'bin_search'
  | 'knapsack'
  | 'palindrome'
  | 'string_reverse'
  | 'word_count'
  | 'unknown';

function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

/**
 * Parse embedded sample Input / Output blocks out of raw problem text
 */
export function extractSamplesFromText(rawText: string = ''): UserSamplePair[] {
  const samples: UserSamplePair[] = [];
  if (!rawText || !rawText.trim()) return samples;

  // Pattern 1: Input ... Output ... blocks (English or Vietnamese)
  const ioRegex =
    /(?:Sample\s*Input(?:\s*\d+)?|Input(?:\s*mẫu|\s*ví dụ|\s*\d+)?|Dữ liệu vào(?:\s*\d+)?|Đầu vào(?:\s*\d+)?)\s*[:：]?\s*\n([\s\S]*?)\n\s*(?:Sample\s*Output(?:\s*\d+)?|Output(?:\s*mẫu|\s*ví dụ|\s*\d+)?|Kết quả(?:\s*\d+)?|Đầu ra(?:\s*\d+)?)\s*[:：]?\s*\n([\s\S]*?)(?=\n\s*(?:Sample\s*Input|Input|Dữ liệu vào|Giải thích|Explanation|Ràng buộc|Constraints|Ví dụ|$))/gi;

  let m: RegExpExecArray | null;
  while ((m = ioRegex.exec(rawText)) !== null) {
    const inp = m[1].trim();
    const out = m[2].trim();
    if (inp && out) {
      samples.push({ input: inp, expectedOutput: out });
    }
  }

  return samples;
}

/**
 * Extract structured sections (title, description, inputFormat, outputFormat, constraints) from raw text
 */
function parseStructuredSections(rawText: string, fileName?: string | null) {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const nonEmpty = lines.map((l) => l.trim()).filter(Boolean);
  const title =
    nonEmpty[0]?.replace(/^[#*0-9.\s:-]+/, '').slice(0, 100) ||
    fileName?.replace(/\.[^.]+$/, '') ||
    'Bài Toán Lập Trình Mới';

  const inputMatch = rawText.match(
    /(?:Input|Dữ liệu vào|Định dạng đầu vào|Đầu vào)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:Output|Kết quả|Định dạng đầu ra|Đầu ra|Ràng buộc|Constraints|Ví dụ|Sample|$))/i
  );
  const outputMatch = rawText.match(
    /(?:Output|Kết quả|Định dạng đầu ra|Đầu ra)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:Ràng buộc|Constraints|Ví dụ|Sample|Giới hạn|$))/i
  );
  const constraintMatch = rawText.match(
    /(?:Constraints|Ràng buộc|Giới hạn)\s*[:：]\s*([\s\S]*?)(?=\n\s*(?:Ví dụ|Sample|Input|$))/i
  );

  const constraints = constraintMatch
    ? constraintMatch[1]
        .split('\n')
        .map((c) => c.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean)
    : ['Thời gian: 1.0s', 'Bộ nhớ: 256MB'];

  return {
    title,
    description: rawText.trim() || 'Bài toán do người dùng tải lên.',
    inputFormat: inputMatch?.[1]?.trim() || 'Theo quy cách chuẩn trong đề bài.',
    outputFormat: outputMatch?.[1]?.trim() || 'In ra kết quả theo yêu cầu đề bài.',
    constraints
  };
}

/**
 * Deterministic solver for 25+ core competitive programming / algorithmic problem types
 */
function runAlgorithmSolver(kind: AlgorithmKind, input: string): string | null {
  const trimmed = input.trim();
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const nums = tokens.map(Number);

  switch (kind) {
    case 'sum_ab': {
      if (tokens.length < 2) return null;
      try {
        return (BigInt(tokens[0]) + BigInt(tokens[1])).toString();
      } catch {
        return String(nums[0] + nums[1]);
      }
    }
    case 'diff_ab': {
      if (tokens.length < 2) return null;
      try {
        return (BigInt(tokens[0]) - BigInt(tokens[1])).toString();
      } catch {
        return String(nums[0] - nums[1]);
      }
    }
    case 'prod_ab': {
      if (tokens.length < 2) return null;
      try {
        return (BigInt(tokens[0]) * BigInt(tokens[1])).toString();
      } catch {
        return String(nums[0] * nums[1]);
      }
    }
    case 'sum_prod_ab': {
      if (tokens.length < 2) return null;
      try {
        const a = BigInt(tokens[0]);
        const b = BigInt(tokens[1]);
        return `${(a + b).toString()}\n${(a * b).toString()}`;
      } catch {
        return `${nums[0] + nums[1]}\n${nums[0] * nums[1]}`;
      }
    }
    case 'max_ab': {
      if (nums.length === 0) return null;
      return String(Math.max(...nums));
    }
    case 'gcd_ab': {
      if (nums.length < 2) return null;
      let a = Math.abs(Math.trunc(nums[0]));
      let b = Math.abs(Math.trunc(nums[1]));
      while (b) {
        const t = b;
        b = a % b;
        a = t;
      }
      return String(a);
    }
    case 'lcm_ab': {
      if (nums.length < 2) return null;
      const a0 = Math.abs(Math.trunc(nums[0]));
      const b0 = Math.abs(Math.trunc(nums[1]));
      if (a0 === 0 || b0 === 0) return '0';
      let a = a0,
        b = b0;
      while (b) {
        const t = b;
        b = a % b;
        a = t;
      }
      return String((a0 / a) * b0);
    }
    case 'prime_check': {
      if (nums.length < 1) return null;
      const n = Math.trunc(nums[0]);
      if (n < 2) return 'NO';
      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return 'NO';
      }
      return 'YES';
    }
    case 'count_primes': {
      if (nums.length < 1) return null;
      const n = Math.trunc(nums[0]);
      if (n < 2) return '0';
      let cnt = 0;
      const sieve = new Uint8Array(n + 1).fill(1);
      for (let p = 2; p <= n; p++) {
        if (sieve[p]) {
          cnt++;
          for (let j = p * p; j <= n; j += p) sieve[j] = 0;
        }
      }
      return String(cnt);
    }
    case 'factorial': {
      if (nums.length < 1) return null;
      const n = Math.max(0, Math.min(20, Math.trunc(nums[0])));
      let res = 1n;
      for (let i = 2n; i <= BigInt(n); i++) res *= i;
      return res.toString();
    }
    case 'fibonacci': {
      if (nums.length < 1) return null;
      const n = Math.trunc(nums[0]);
      if (n <= 0) return '0';
      if (n === 1) return '1';
      const MOD = 1000000007;
      let a = 0,
        b = 1;
      for (let i = 2; i <= n; i++) {
        const nxt = (a + b) % MOD;
        a = b;
        b = nxt;
      }
      return String(b);
    }
    case 'sum_1_to_n': {
      if (tokens.length < 1) return null;
      try {
        const n = BigInt(tokens[0]);
        if (n <= 0n) return '0';
        return ((n * (n + 1n)) / 2n).toString();
      } catch {
        return null;
      }
    }
    case 'digit_sum': {
      if (!tokens[0]) return null;
      let sum = 0;
      for (const ch of tokens[0]) {
        if (ch >= '0' && ch <= '9') sum += Number(ch);
      }
      return String(sum);
    }
    case 'array_sum': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      return String(arr.reduce((acc, v) => acc + v, 0));
    }
    case 'array_max': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      return arr.length ? String(Math.max(...arr)) : '0';
    }
    case 'array_min': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      return arr.length ? String(Math.min(...arr)) : '0';
    }
    case 'array_sort_asc': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n).sort((a, b) => a - b);
      return arr.join(' ');
    }
    case 'array_sort_desc': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n).sort((a, b) => b - a);
      return arr.join(' ');
    }
    case 'array_count_even': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      return String(arr.filter((x) => x % 2 === 0).length);
    }
    case 'array_mode': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      const freq = new Map<number, number>();
      for (const x of arr) freq.set(x, (freq.get(x) || 0) + 1);
      let best = arr[0] ?? 0;
      let maxC = 0;
      for (const [val, cnt] of freq.entries()) {
        if (cnt > maxC || (cnt === maxC && val < best)) {
          maxC = cnt;
          best = val;
        }
      }
      return `${best} ${maxC}`;
    }
    case 'kadane_max_subarray': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      if (arr.length === 0) return '0';
      let best = arr[0];
      let cur = arr[0];
      for (let i = 1; i < arr.length; i++) {
        cur = Math.max(arr[i], cur + arr[i]);
        best = Math.max(best, cur);
      }
      return String(best);
    }
    case 'lis': {
      if (nums.length < 2) return null;
      const n = Math.trunc(nums[0]);
      const arr = nums.slice(1, 1 + n);
      const tails: number[] = [];
      for (const x of arr) {
        let l = 0,
          r = tails.length;
        while (l < r) {
          const m = (l + r) >> 1;
          if (tails[m] < x) l = m + 1;
          else r = m;
        }
        if (l === tails.length) tails.push(x);
        else tails[l] = x;
      }
      return String(tails.length);
    }
    case 'bin_search': {
      if (nums.length < 3) return null;
      const n = Math.trunc(nums[0]);
      const x = nums[1];
      const arr = nums.slice(2, 2 + n);
      let low = 0,
        high = arr.length - 1,
        ans = -1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (arr[mid] >= x) {
          if (arr[mid] === x) ans = mid + 1;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      return String(ans);
    }
    case 'knapsack': {
      if (nums.length < 4) return null;
      const n = Math.trunc(nums[0]);
      const W = Math.max(0, Math.trunc(nums[1]));
      const dp = new Array(W + 1).fill(0);
      let idx = 2;
      for (let i = 0; i < n && idx + 1 < nums.length; i++) {
        const wt = Math.trunc(nums[idx++]);
        const val = Math.trunc(nums[idx++]);
        for (let j = W; j >= wt; j--) {
          dp[j] = Math.max(dp[j], dp[j - wt] + val);
        }
      }
      return String(dp[W]);
    }
    case 'palindrome': {
      const clean = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
      const rev = clean.split('').reverse().join('');
      return clean === rev ? 'YES' : 'NO';
    }
    case 'string_reverse': {
      return trimmed.split('').reverse().join('');
    }
    case 'word_count': {
      return String(tokens.length);
    }
    default:
      return null;
  }
}

/**
 * Infer problem algorithm family from text AND cross-verify against user's sample test cases
 */
function inferAlgorithm(
  rawText: string,
  samples: UserSamplePair[]
): AlgorithmKind {
  const norm = normalizeStr(rawText);

  const candidates: AlgorithmKind[] = [];

  if (norm.includes('nguyen to') || norm.includes('prime')) {
    if (norm.includes('dem') || norm.includes('bao nhieu') || norm.includes('count')) {
      candidates.push('count_primes');
    } else {
      candidates.push('prime_check');
    }
  }
  if (norm.includes('fibonacci')) candidates.push('fibonacci');
  if (norm.includes('giai thua') || norm.includes('factorial')) candidates.push('factorial');
  if (norm.includes('uoc chung lon nhat') || norm.includes('ucln') || norm.includes('gcd')) candidates.push('gcd_ab');
  if (norm.includes('boi chung nho nhat') || norm.includes('bcnn') || norm.includes('lcm')) candidates.push('lcm_ab');
  if (norm.includes('tong') && norm.includes('tich')) candidates.push('sum_prod_ab');
  if (norm.includes('tong cac chu so') || norm.includes('digit sum')) candidates.push('digit_sum');
  if (norm.includes('cai tui') || norm.includes('knapsack')) candidates.push('knapsack');
  if (norm.includes('day con tang') || norm.includes('lis')) candidates.push('lis');
  if (norm.includes('nhi phan') || norm.includes('binary search')) candidates.push('bin_search');
  if (norm.includes('doi xung') || norm.includes('palindrome')) candidates.push('palindrome');
  if (norm.includes('dao nguoc') && (norm.includes('xau') || norm.includes('chuoi') || norm.includes('string')))
    candidates.push('string_reverse');
  if (norm.includes('dem tu') || norm.includes('word count')) candidates.push('word_count');
  if (norm.includes('sap xep') || norm.includes('sort')) {
    candidates.push(norm.includes('giam') || norm.includes('desc') ? 'array_sort_desc' : 'array_sort_asc');
  }
  if (norm.includes('doan con') && norm.includes('lon nhat')) candidates.push('kadane_max_subarray');
  if (norm.includes('xuat hien nhieu nhat') || norm.includes('tan suat')) candidates.push('array_mode');
  if (norm.includes('dem') && norm.includes('chan')) candidates.push('array_count_even');
  if ((norm.includes('lon nhat') || norm.includes('max')) && (norm.includes('mang') || norm.includes('day') || norm.includes('phan tu')))
    candidates.push('array_max');
  if ((norm.includes('nho nhat') || norm.includes('min')) && (norm.includes('mang') || norm.includes('day') || norm.includes('phan tu')))
    candidates.push('array_min');
  if ((norm.includes('tong') || norm.includes('sum')) && (norm.includes('mang') || norm.includes('day') || norm.includes('phan tu')))
    candidates.push('array_sum');
  if (norm.includes('1 den n') || norm.includes('1..n') || norm.includes('1 + 2')) candidates.push('sum_1_to_n');
  if (norm.includes('tong') && (norm.includes('hai so') || norm.includes('2 so') || norm.includes('a + b') || norm.includes('a va b')))
    candidates.push('sum_ab');
  if (norm.includes('tich') && (norm.includes('hai so') || norm.includes('2 so') || norm.includes('a * b')))
    candidates.push('prod_ab');

  // If user provided sample tests, verify candidates against sample #1!
  if (samples.length > 0 && samples[0].input && samples[0].expectedOutput) {
    const sIn = samples[0].input;
    const sOut = samples[0].expectedOutput.trim();

    for (const c of candidates) {
      if (runAlgorithmSolver(c, sIn)?.trim() === sOut) return c;
    }

    // Try all known algorithms against sample #1 to auto-discover if text was terse!
    const allKinds: AlgorithmKind[] = [
      'sum_ab',
      'prod_ab',
      'diff_ab',
      'sum_prod_ab',
      'max_ab',
      'gcd_ab',
      'lcm_ab',
      'prime_check',
      'count_primes',
      'factorial',
      'fibonacci',
      'sum_1_to_n',
      'digit_sum',
      'array_sum',
      'array_max',
      'array_min',
      'array_sort_asc',
      'array_sort_desc',
      'array_count_even',
      'kadane_max_subarray',
      'lis',
      'bin_search',
      'knapsack',
      'palindrome',
      'string_reverse',
      'word_count'
    ];
    for (const k of allKinds) {
      if (runAlgorithmSolver(k, sIn)?.trim() === sOut) return k;
    }
  }

  return candidates[0] || 'unknown';
}

const TIER_ORDER: Record<TestDifficultyTier, number> = {
  'Cơ bản': 1,
  'Trung bình': 2,
  'Nâng cao': 3,
  'Thử thách': 4
};

function inferTierByIndex(idx: number, total: number): TestDifficultyTier {
  if (total <= 1) return 'Cơ bản';
  const ratio = idx / Math.max(1, total - 1);
  if (ratio <= 0.34) return 'Cơ bản';
  if (ratio <= 0.67) return 'Trung bình';
  if (ratio < 1) return 'Nâng cao';
  return 'Thử thách';
}

function normalizeTierLabel(raw?: any, idx = 0, total = 6): TestDifficultyTier {
  const s = String(raw || '').trim();
  if (s === 'Cơ bản' || s === 'Trung bình' || s === 'Nâng cao' || s === 'Thử thách') {
    return s;
  }
  const low = s.toLowerCase();
  if (low.includes('easy') || low.includes('de') || low.includes('dễ')) return 'Cơ bản';
  if (low.includes('med') || low.includes('trung')) return 'Trung bình';
  if (low.includes('hard') || low.includes('nang') || low.includes('nâng')) return 'Nâng cao';
  if (low.includes('challenge') || low.includes('thu') || low.includes('thử')) return 'Thử thách';
  return inferTierByIndex(idx, total);
}

interface GeneratedTestSeed {
  input: string;
  difficulty: TestDifficultyTier;
}

/**
 * Generate hidden test inputs ordered strictly by progressive difficulty:
 * Cơ bản -> Trung bình -> Nâng cao -> Thử thách
 */
function generateHiddenInputs(kind: AlgorithmKind, sampleInput?: string): GeneratedTestSeed[] {
  const lines = (sampleInput || '').trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const firstTokens = (lines[0] || '').split(/\s+/).filter(Boolean);

  switch (kind) {
    case 'sum_ab':
    case 'diff_ab':
    case 'prod_ab':
    case 'sum_prod_ab':
      return [
        { input: '2 3', difficulty: 'Cơ bản' },
        { input: '12 18', difficulty: 'Cơ bản' },
        { input: '15 -5', difficulty: 'Trung bình' },
        { input: '0 0', difficulty: 'Nâng cao' },
        { input: '-125 375', difficulty: 'Nâng cao' },
        { input: '1000000000 1000000000', difficulty: 'Thử thách' }
      ];
    case 'gcd_ab':
    case 'lcm_ab':
      return [
        { input: '6 9', difficulty: 'Cơ bản' },
        { input: '12 18', difficulty: 'Cơ bản' },
        { input: '7 13', difficulty: 'Trung bình' },
        { input: '1 99', difficulty: 'Nâng cao' },
        { input: '36 48', difficulty: 'Nâng cao' },
        { input: '1440 960', difficulty: 'Thử thách' }
      ];
    case 'prime_check':
      return [
        { input: '5', difficulty: 'Cơ bản' },
        { input: '6', difficulty: 'Cơ bản' },
        { input: '17', difficulty: 'Trung bình' },
        { input: '2', difficulty: 'Nâng cao' },
        { input: '1', difficulty: 'Nâng cao' },
        { input: '9973', difficulty: 'Thử thách' }
      ];
    case 'count_primes':
      return [
        { input: '5', difficulty: 'Cơ bản' },
        { input: '10', difficulty: 'Cơ bản' },
        { input: '30', difficulty: 'Trung bình' },
        { input: '1', difficulty: 'Nâng cao' },
        { input: '100', difficulty: 'Nâng cao' },
        { input: '1000', difficulty: 'Thử thách' }
      ];
    case 'factorial':
      return [
        { input: '3', difficulty: 'Cơ bản' },
        { input: '5', difficulty: 'Cơ bản' },
        { input: '7', difficulty: 'Trung bình' },
        { input: '0', difficulty: 'Nâng cao' },
        { input: '10', difficulty: 'Nâng cao' },
        { input: '12', difficulty: 'Thử thách' }
      ];
    case 'fibonacci':
      return [
        { input: '4', difficulty: 'Cơ bản' },
        { input: '8', difficulty: 'Cơ bản' },
        { input: '15', difficulty: 'Trung bình' },
        { input: '0', difficulty: 'Nâng cao' },
        { input: '25', difficulty: 'Nâng cao' },
        { input: '35', difficulty: 'Thử thách' }
      ];
    case 'sum_1_to_n':
      return [
        { input: '5', difficulty: 'Cơ bản' },
        { input: '10', difficulty: 'Cơ bản' },
        { input: '100', difficulty: 'Trung bình' },
        { input: '1', difficulty: 'Nâng cao' },
        { input: '1000', difficulty: 'Nâng cao' },
        { input: '100000', difficulty: 'Thử thách' }
      ];
    case 'digit_sum':
      return [
        { input: '12', difficulty: 'Cơ bản' },
        { input: '1234', difficulty: 'Cơ bản' },
        { input: '9051', difficulty: 'Trung bình' },
        { input: '0', difficulty: 'Nâng cao' },
        { input: '99999', difficulty: 'Nâng cao' },
        { input: '1000000007', difficulty: 'Thử thách' }
      ];
    case 'max_ab':
      return [
        { input: '3 5', difficulty: 'Cơ bản' },
        { input: '4 9 2', difficulty: 'Cơ bản' },
        { input: '10 2 8', difficulty: 'Trung bình' },
        { input: '0 0 1', difficulty: 'Nâng cao' },
        { input: '-5 -2 -9', difficulty: 'Nâng cao' },
        { input: '15 42 7 29 101 88', difficulty: 'Thử thách' }
      ];
    case 'array_sum':
    case 'array_max':
    case 'array_min':
    case 'array_sort_asc':
    case 'array_sort_desc':
    case 'array_count_even':
    case 'array_mode':
    case 'kadane_max_subarray':
    case 'lis':
      return [
        { input: '3\n2 4 6', difficulty: 'Cơ bản' },
        { input: '5\n1 2 3 4 5', difficulty: 'Cơ bản' },
        { input: '6\n9 4 7 2 8 1', difficulty: 'Trung bình' },
        { input: '4\n5 5 5 5', difficulty: 'Nâng cao' },
        { input: '1\n7', difficulty: 'Nâng cao' },
        { input: '10\n12 -3 19 8 -3 15 27 8 -1 20', difficulty: 'Thử thách' }
      ];
    case 'bin_search':
      return [
        { input: '5 6\n2 4 6 8 10', difficulty: 'Cơ bản' },
        { input: '4 8\n1 3 8 12', difficulty: 'Cơ bản' },
        { input: '5 1\n2 4 6 8 10', difficulty: 'Trung bình' },
        { input: '6 5\n2 4 5 5 5 8', difficulty: 'Nâng cao' },
        { input: '1 10\n10', difficulty: 'Nâng cao' },
        { input: '8 99\n1 5 12 25 60 99 99 105', difficulty: 'Thử thách' }
      ];
    case 'knapsack':
      return [
        { input: '2 5\n2 3\n3 4', difficulty: 'Cơ bản' },
        { input: '3 6\n1 2\n3 5\n4 6', difficulty: 'Cơ bản' },
        { input: '4 7\n1 1\n3 4\n4 5\n5 7', difficulty: 'Trung bình' },
        { input: '2 3\n4 10\n5 20', difficulty: 'Nâng cao' },
        { input: '5 10\n2 3\n3 4\n4 5\n5 8\n9 10', difficulty: 'Thử thách' }
      ];
    case 'palindrome':
      return [
        { input: 'aba', difficulty: 'Cơ bản' },
        { input: 'abc', difficulty: 'Cơ bản' },
        { input: 'abba', difficulty: 'Trung bình' },
        { input: 'a', difficulty: 'Nâng cao' },
        { input: 'RaceCar', difficulty: 'Nâng cao' },
        { input: 'hello world', difficulty: 'Thử thách' }
      ];
    case 'string_reverse':
    case 'word_count':
      return [
        { input: 'hello', difficulty: 'Cơ bản' },
        { input: 'abc def', difficulty: 'Cơ bản' },
        { input: 'lap trinh c++', difficulty: 'Trung bình' },
        { input: 'a b c d', difficulty: 'Nâng cao' },
        { input: 'Sublime Text Monokai', difficulty: 'Thử thách' }
      ];
    default: {
      if (lines.length === 1 && firstTokens.length === 1 && !isNaN(Number(firstTokens[0]))) {
        return [
          { input: '3', difficulty: 'Cơ bản' },
          { input: '5', difficulty: 'Cơ bản' },
          { input: '10', difficulty: 'Trung bình' },
          { input: '1', difficulty: 'Nâng cao' },
          { input: '100', difficulty: 'Thử thách' }
        ];
      }
      if (lines.length === 1 && firstTokens.length === 2 && !isNaN(Number(firstTokens[0]))) {
        return [
          { input: '2 3', difficulty: 'Cơ bản' },
          { input: '4 7', difficulty: 'Cơ bản' },
          { input: '10 20', difficulty: 'Trung bình' },
          { input: '1 1', difficulty: 'Nâng cao' },
          { input: '100 50', difficulty: 'Thử thách' }
        ];
      }
      if (lines.length >= 2 && firstTokens.length === 1 && !isNaN(Number(firstTokens[0]))) {
        return [
          { input: '3\n1 2 3', difficulty: 'Cơ bản' },
          { input: '4\n2 4 6 8', difficulty: 'Cơ bản' },
          { input: '5\n5 4 3 2 1', difficulty: 'Trung bình' },
          { input: '1\n5', difficulty: 'Nâng cao' },
          { input: '7\n2 9 4 1 7 3 8', difficulty: 'Thử thách' }
        ];
      }
      return [
        { input: '2\n1 2', difficulty: 'Cơ bản' },
        { input: '4\n1 2 3 4', difficulty: 'Trung bình' },
        { input: '1\n0', difficulty: 'Nâng cao' },
        { input: '6\n1 2 3 4 5 6', difficulty: 'Thử thách' }
      ];
    }
  }
}

/**
 * Full problem analysis & verified progressive test suite generation
 */
export async function analyzeProblemAndGenerateTests(
  req: AnalyzeProblemRequest
): Promise<AnalyzeProblemResult> {
  const userSamples = (req.userSamples || []).filter((s) => s.input.trim() || s.expectedOutput.trim());
  const extractedFromText = extractSamplesFromText(req.text);
  const combinedSamples: UserSamplePair[] =
    userSamples.length > 0 ? userSamples : extractedFromText;

  const detectedLocal = detectProblemExecutionConfig(req.text);

  const resolveExecConfig = (aiProblem?: any): DetectedExecutionConfig => {
    const aiTimeMs =
      aiProblem?.timeLimitEnabled === false
        ? null
        : typeof aiProblem?.timeLimitMs === 'number'
        ? aiProblem.timeLimitMs
        : parseTimeLimitMs(aiProblem?.timeLimit, detectedLocal.timeLimitMs ?? 1000);

    const aiIoMode: ProblemIOMode =
      aiProblem?.ioMode === 'file'
        ? 'file'
        : aiProblem?.ioMode === 'standard'
        ? 'standard'
        : detectedLocal.ioMode;

    const tlEnabled = req.userConfiguredExecution
      ? req.timeLimitEnabled !== false
      : aiProblem?.timeLimitEnabled !== undefined
      ? Boolean(aiProblem.timeLimitEnabled)
      : detectedLocal.timeLimitEnabled;

    const tlMs = tlEnabled
      ? (req.userConfiguredExecution ? req.timeLimitMs : aiTimeMs) ?? detectedLocal.timeLimitMs ?? 1000
      : null;

    const finalIoMode: ProblemIOMode = req.userConfiguredExecution
      ? req.ioMode || 'standard'
      : aiIoMode;

    const finalInFile =
      finalIoMode === 'file'
        ? (req.userConfiguredExecution ? req.inputFileName : aiProblem?.inputFileName) ||
          detectedLocal.inputFileName ||
          'INPUT.INP'
        : '';
    const finalOutFile =
      finalIoMode === 'file'
        ? (req.userConfiguredExecution ? req.outputFileName : aiProblem?.outputFileName) ||
          detectedLocal.outputFileName ||
          'OUTPUT.OUT'
        : '';

    return {
      timeLimitEnabled: tlEnabled,
      timeLimitMs: tlMs,
      ioMode: finalIoMode,
      inputFileName: finalInFile,
      outputFileName: finalOutFile
    };
  };

  const formatTimeLabel = (enabled: boolean, ms: number | null) =>
    enabled && ms ? `${(ms / 1000).toFixed(ms % 1000 === 0 ? 1 : 2).replace(/0+$/, '').replace(/\.$/, '')}s` : 'Không giới hạn';

  const verifyOracleMatchesSamples = async (
    oracleCode: string,
    oracleLang: CodeLanguage,
    samplesToTest: { input: string; expectedOutput: string }[],
    oracleOpts: {
      ioMode: ProblemIOMode;
      inputFileName?: string;
      outputFileName?: string;
      timeLimitEnabled: boolean;
      timeLimitMs: number | null;
      skipAiFallback?: boolean;
    }
  ): Promise<boolean> => {
    for (const s of samplesToTest) {
      const res = await executeCode('ORACLE_CHECK', oracleLang, oracleCode, s.input, {
        ...oracleOpts,
        skipAiFallback: true
      });
      if (res.isError) return false;
      if (s.expectedOutput.trim() && !compareOutputs(res.stdout, s.expectedOutput)) {
        return false;
      }
      if (!s.expectedOutput.trim() && !res.stdout.trim()) {
        return false;
      }
    }
    return true;
  };

  const preExecCfg = resolveExecConfig();
  const sections = parseStructuredSections(req.text, req.fileName);
  const inferredKind = inferAlgorithm(req.text, combinedSamples);

  // 0A. Ultra-fast path: Reference AC code + text (without image OCR) -> build & verify locally in <50ms!
  if (!req.imageBase64 && req.referenceCode?.trim()) {
    const lang = req.referenceLang || 'cpp';
    const oracleUsesFile = /\b(freopen|ifstream|ofstream|open\s*\()/i.test(req.referenceCode);
    const oracleOpts = oracleUsesFile
      ? {
          ioMode: 'file' as ProblemIOMode,
          inputFileName: preExecCfg.inputFileName || 'INPUT.INP',
          outputFileName: preExecCfg.outputFileName || 'OUTPUT.OUT',
          timeLimitEnabled: preExecCfg.timeLimitEnabled,
          timeLimitMs: preExecCfg.timeLimitMs,
          skipAiFallback: true
        }
      : {
          ioMode: 'standard' as ProblemIOMode,
          timeLimitEnabled: preExecCfg.timeLimitEnabled,
          timeLimitMs: preExecCfg.timeLimitMs,
          skipAiFallback: true
        };

    const sampleCheckOk =
      combinedSamples.length === 0
        ? true
        : await verifyOracleMatchesSamples(req.referenceCode, lang, combinedSamples, oracleOpts);

    if (sampleCheckOk) {
      const sampleCases: TestCase[] =
        combinedSamples.length > 0
          ? combinedSamples.map((s, idx) => ({
              id: idx + 1,
              input: s.input,
              expectedOutput: s.expectedOutput,
              isSample: true,
              explanation: s.explanation || 'Test mẫu từ đề bài',
              difficulty: 'Cơ bản' as TestDifficultyTier
            }))
          : [];

      const hiddenSeeds = generateHiddenInputs(inferredKind, sampleCases[0]?.input);
      const hiddenCases: TestCase[] = [];
      let allHiddenOk = true;
      for (let i = 0; i < hiddenSeeds.length; i++) {
        const seed = hiddenSeeds[i];
        const res = await executeCode('ORACLE', lang, req.referenceCode, seed.input, oracleOpts);
        if (res.isError || !res.stdout.trim()) {
          allHiddenOk = false;
          break;
        }
        hiddenCases.push({
          id: sampleCases.length + i + 1,
          input: seed.input,
          expectedOutput: res.stdout.trim(),
          isSample: false,
          difficulty: seed.difficulty
        });
      }

      if (allHiddenOk && hiddenCases.length > 0) {
        if (sampleCases.length === 0) {
          sampleCases.push({
            id: 1,
            input: hiddenCases[0].input,
            expectedOutput: hiddenCases[0].expectedOutput,
            isSample: true,
            explanation: 'Test mẫu sinh tự động từ Code AC',
            difficulty: 'Cơ bản'
          });
        }
        return {
          problem: {
            id: `CUSTOM_${Date.now()}`,
            title: sections.title,
            category: 'Tự do - Code AC tham chiếu',
            difficulty: 'Medium',
            timeLimit: formatTimeLabel(preExecCfg.timeLimitEnabled, preExecCfg.timeLimitMs),
            timeLimitEnabled: preExecCfg.timeLimitEnabled,
            timeLimitMs: preExecCfg.timeLimitMs,
            ioMode: preExecCfg.ioMode,
            inputFileName: preExecCfg.inputFileName,
            outputFileName: preExecCfg.outputFileName,
            memoryLimit: '256MB',
            description: sections.description,
            inputFormat: sections.inputFormat,
            outputFormat: sections.outputFormat,
            constraints: sections.constraints,
            sampleCases,
            hiddenCases,
            cppTemplate: lang === 'cpp' ? req.referenceCode : '',
            pythonTemplate: lang === 'python' ? req.referenceCode : ''
          },
          source: 'local-oracle',
          diagnosticNote: `Sinh tức thì từ Code AC tham chiếu (${hiddenCases.length} test ẩn) · TLE: ${formatTimeLabel(
            preExecCfg.timeLimitEnabled,
            preExecCfg.timeLimitMs
          )} · I/O: ${preExecCfg.ioMode === 'file' ? `File (${preExecCfg.inputFileName} → ${preExecCfg.outputFileName})` : 'Chuẩn (stdin/stdout)'}.`
        };
      }
    }
  }

  // 0B. Ultra-fast deterministic solver path when inferred algorithm matches ALL provided sample cases
  if (!req.imageBase64 && inferredKind !== 'unknown' && combinedSamples.length > 0) {
    const allSamplesMatchSolver = combinedSamples.every((s) => {
      if (!s.input.trim() || !s.expectedOutput.trim()) return false;
      const out = runAlgorithmSolver(inferredKind, s.input);
      return out !== null && compareOutputs(out, s.expectedOutput);
    });

    if (allSamplesMatchSolver) {
      const sampleCases: TestCase[] = combinedSamples.map((s, idx) => ({
        id: idx + 1,
        input: s.input,
        expectedOutput: s.expectedOutput,
        isSample: true,
        explanation: s.explanation || 'Test mẫu từ đề bài',
        difficulty: 'Cơ bản' as TestDifficultyTier
      }));
      const hiddenSeeds = generateHiddenInputs(inferredKind, sampleCases[0]?.input);
      const hiddenCases: TestCase[] = [];
      for (let i = 0; i < hiddenSeeds.length; i++) {
        const seed = hiddenSeeds[i];
        const out = runAlgorithmSolver(inferredKind, seed.input);
        if (out !== null) {
          hiddenCases.push({
            id: sampleCases.length + i + 1,
            input: seed.input,
            expectedOutput: out,
            isSample: false,
            difficulty: seed.difficulty
          });
        }
      }
      if (hiddenCases.length >= 4) {
        return {
          problem: {
            id: `CUSTOM_${Date.now()}`,
            title: sections.title,
            category: 'Tự do - Nhận diện thuật toán nhanh',
            difficulty: 'Medium',
            timeLimit: formatTimeLabel(preExecCfg.timeLimitEnabled, preExecCfg.timeLimitMs),
            timeLimitEnabled: preExecCfg.timeLimitEnabled,
            timeLimitMs: preExecCfg.timeLimitMs,
            ioMode: preExecCfg.ioMode,
            inputFileName: preExecCfg.inputFileName,
            outputFileName: preExecCfg.outputFileName,
            memoryLimit: '256MB',
            description: sections.description,
            inputFormat: sections.inputFormat,
            outputFormat: sections.outputFormat,
            constraints: sections.constraints,
            sampleCases,
            hiddenCases,
            cppTemplate: '',
            pythonTemplate: ''
          },
          source: 'local-inferred',
          diagnosticNote: `Nhận diện thuật toán chuẩn (${inferredKind}) & sinh nhanh ${sampleCases.length} mẫu + ${hiddenCases.length} test ẩn · I/O: ${
            preExecCfg.ioMode === 'file' ? `File (${preExecCfg.inputFileName} → ${preExecCfg.outputFileName})` : 'Chuẩn (stdin/stdout)'
          }.`
        };
      }
    }
  }

  // 1. Server AI Endpoint (/api/gemini/analyze-problem) with real CPython 3 verification
  let aiError: string | undefined;
  try {
    const res = await safeFetchJson<any>(
      '/api/gemini/analyze-problem',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: req.text.trim(),
          imageBase64: req.imageBase64 || undefined,
          mimeType: req.mimeType || undefined,
          userSamples: combinedSamples,
          ioMode: req.userConfiguredExecution ? req.ioMode : preExecCfg.ioMode,
          inputFileName: req.inputFileName,
          outputFileName: req.outputFileName
        })
      },
      28000
    );

    if (!res.ok) {
      aiError = res.error;
    } else if (res.data) {
      const data = res.data;
      if (data.success && data.problem) {
        const execCfg = resolveExecConfig(data.problem);

        const aiSamples: TestCase[] = Array.isArray(data.problem.sampleCases)
          ? data.problem.sampleCases.map((tc: any, idx: number) => ({
              id: idx + 1,
              input: String(tc.input ?? ''),
              expectedOutput: String(tc.expectedOutput ?? ''),
              isSample: true,
              explanation: tc.explanation,
              difficulty: 'Cơ bản' as TestDifficultyTier
            }))
          : [];

        // Prioritize explicit user-supplied sample tests at the front
        const mergedSamples: TestCase[] =
          userSamples.length > 0
            ? userSamples.map((s, idx) => ({
                id: idx + 1,
                input: s.input,
                expectedOutput: s.expectedOutput,
                isSample: true,
                explanation: s.explanation || 'Test mẫu do bạn cung cấp',
                difficulty: 'Cơ bản' as TestDifficultyTier
              }))
            : aiSamples;

        const rawHidden = Array.isArray(data.problem.hiddenCases) ? data.problem.hiddenCases : [];
        let hiddenCases: TestCase[] = rawHidden
          .map((tc: any, idx: number) => ({
            id: mergedSamples.length + idx + 1,
            input: String(tc.input ?? ''),
            expectedOutput: String(tc.expectedOutput ?? ''),
            isSample: false,
            difficulty: normalizeTierLabel(tc.difficulty, idx, rawHidden.length)
          }))
          .sort(
            (a: TestCase, b: TestCase) =>
              TIER_ORDER[a.difficulty || 'Trung bình'] - TIER_ORDER[b.difficulty || 'Trung bình']
          )
          .map((tc: TestCase, idx: number) => ({ ...tc, id: mergedSamples.length + idx + 1 }));

        // Only verify hiddenCases in local browser sandbox when server Python verification hasn't already verified them,
        // OR when user explicitly supplied referenceCode; ALWAYS check oracle passes mergedSamples first so a faulty sandbox never corrupts valid tests.
        const hasUserRef = Boolean(req.referenceCode?.trim());
        const oracleCode = hasUserRef
          ? req.referenceCode!.trim()
          : !data.verifiedByPython
          ? data.problem.referencePython || data.problem.referenceCpp
          : '';
        const oracleLang: CodeLanguage = hasUserRef
          ? req.referenceLang || 'cpp'
          : data.problem.referencePython
          ? 'python'
          : 'cpp';

        if (oracleCode) {
          const oracleUsesFile = /\b(freopen|ifstream|ofstream|open\s*\()/i.test(oracleCode);
          const oracleOpts = oracleUsesFile
            ? {
                ioMode: 'file' as ProblemIOMode,
                inputFileName: execCfg.inputFileName || 'INPUT.INP',
                outputFileName: execCfg.outputFileName || 'OUTPUT.OUT',
                timeLimitEnabled: execCfg.timeLimitEnabled,
                timeLimitMs: execCfg.timeLimitMs,
                skipAiFallback: true
              }
            : {
                ioMode: 'standard' as ProblemIOMode,
                timeLimitEnabled: execCfg.timeLimitEnabled,
                timeLimitMs: execCfg.timeLimitMs,
                skipAiFallback: true
              };

          const samplePass =
            mergedSamples.length === 0 ||
            (await verifyOracleMatchesSamples(oracleCode, oracleLang, mergedSamples, oracleOpts));

          if (samplePass) {
            const candidateOutputs: string[] = [];
            let allOk = true;
            for (const hc of hiddenCases) {
              const exec = await executeCode('CUSTOM_ORACLE', oracleLang, oracleCode, hc.input, oracleOpts);
              if (exec.isError || !exec.stdout.trim()) {
                allOk = false;
                break;
              }
              candidateOutputs.push(exec.stdout.trim());
            }
            if (allOk && candidateOutputs.length === hiddenCases.length) {
              hiddenCases = hiddenCases.map((hc, idx) => ({
                ...hc,
                expectedOutput: candidateOutputs[idx]
              }));
            }
          }
        }

        const analyzedProblem: CodingProblem = {
          id: data.problem.id || `CUSTOM_${Date.now()}`,
          title: data.problem.title || 'Bài Toán Đã Phân Tích',
          category: 'Tự do - Phân tích AI',
          difficulty: 'Medium',
          timeLimit: formatTimeLabel(execCfg.timeLimitEnabled, execCfg.timeLimitMs),
          timeLimitEnabled: execCfg.timeLimitEnabled,
          timeLimitMs: execCfg.timeLimitMs,
          ioMode: execCfg.ioMode,
          inputFileName: execCfg.inputFileName,
          outputFileName: execCfg.outputFileName,
          memoryLimit: '256MB',
          description: data.problem.description || req.text,
          inputFormat: data.problem.inputFormat || 'Theo đề bài.',
          outputFormat: data.problem.outputFormat || 'Theo đề bài.',
          constraints: Array.isArray(data.problem.constraints)
            ? data.problem.constraints
            : ['1 ≤ N ≤ 10⁵'],
          sampleCases: mergedSamples,
          hiddenCases,
          cppTemplate: data.problem.referenceCpp || '',
          pythonTemplate: data.problem.referencePython || ''
        };

        return {
          problem: analyzedProblem,
          source: 'ai',
          referenceCpp: data.problem.referenceCpp,
          referencePython: data.problem.referencePython,
          diagnosticNote: `AI${data.verifiedByPython ? ' + Python3' : ''} đã tạo ${mergedSamples.length} test mẫu + ${hiddenCases.length} test ẩn · TLE: ${analyzedProblem.timeLimit} · I/O: ${
            execCfg.ioMode === 'file' ? `File (${execCfg.inputFileName} → ${execCfg.outputFileName})` : 'Chuẩn (stdin/stdout)'
          }.`
        };
      }
    }
  } catch (err: any) {
    aiError = err?.message;
  }

  // If user uploaded an image without text and AI failed, report the real OCR error instead of silently returning empty template
  if (req.imageBase64 && !req.text.trim() && !req.referenceCode?.trim()) {
    throw new Error(aiError || 'Không thể đọc đề bài từ ảnh bằng Gemini AI lúc này. Vui lòng thử lại.');
  }

  // 2. Local Structured Analysis + Progressive Test Generator Fallback
  const execCfg = resolveExecConfig();

  const sampleCases: TestCase[] =
    combinedSamples.length > 0
      ? combinedSamples.map((s, idx) => ({
          id: idx + 1,
          input: s.input,
          expectedOutput: s.expectedOutput,
          isSample: true,
          explanation: s.explanation || 'Test mẫu từ đề bài',
          difficulty: 'Cơ bản' as TestDifficultyTier
        }))
      : [
          {
            id: 1,
            input: inferredKind === 'sum_ab' ? '3 5' : inferredKind === 'palindrome' ? 'radar' : '5\n1 2 3 4 5',
            expectedOutput:
              runAlgorithmSolver(
                inferredKind,
                inferredKind === 'sum_ab' ? '3 5' : inferredKind === 'palindrome' ? 'radar' : '5\n1 2 3 4 5'
              ) || '15',
            isSample: true,
            explanation: 'Test mẫu cơ bản',
            difficulty: 'Cơ bản'
          }
        ];

  const hiddenSeeds = generateHiddenInputs(inferredKind, sampleCases[0]?.input);
  const hiddenCases: TestCase[] = [];

  // 2A. If user supplied a Reference AC solution, run it on every generated progressive hidden test
  if (req.referenceCode && req.referenceCode.trim()) {
    const lang = req.referenceLang || 'cpp';
    const oracleUsesFile = /\b(freopen|ifstream|ofstream|open\s*\()/i.test(req.referenceCode);
    const oracleOpts = oracleUsesFile
      ? {
          ioMode: 'file' as ProblemIOMode,
          inputFileName: execCfg.inputFileName || 'INPUT.INP',
          outputFileName: execCfg.outputFileName || 'OUTPUT.OUT',
          timeLimitEnabled: execCfg.timeLimitEnabled,
          timeLimitMs: execCfg.timeLimitMs,
          skipAiFallback: true
        }
      : {
          ioMode: 'standard' as ProblemIOMode,
          timeLimitEnabled: execCfg.timeLimitEnabled,
          timeLimitMs: execCfg.timeLimitMs,
          skipAiFallback: true
        };

    for (let i = 0; i < hiddenSeeds.length; i++) {
      const seed = hiddenSeeds[i];
      const res = await executeCode('ORACLE', lang, req.referenceCode, seed.input, oracleOpts);
      if (!res.isError && res.stdout.trim()) {
        hiddenCases.push({
          id: sampleCases.length + i + 1,
          input: seed.input,
          expectedOutput: res.stdout.trim(),
          isSample: false,
          difficulty: seed.difficulty
        });
      }
    }

    return {
      problem: {
        id: `CUSTOM_${Date.now()}`,
        title: sections.title,
        category: 'Tự do - Code AC tham chiếu',
        difficulty: 'Medium',
        timeLimit: formatTimeLabel(execCfg.timeLimitEnabled, execCfg.timeLimitMs),
        timeLimitEnabled: execCfg.timeLimitEnabled,
        timeLimitMs: execCfg.timeLimitMs,
        ioMode: execCfg.ioMode,
        inputFileName: execCfg.inputFileName,
        outputFileName: execCfg.outputFileName,
        memoryLimit: '256MB',
        description: sections.description,
        inputFormat: sections.inputFormat,
        outputFormat: sections.outputFormat,
        constraints: sections.constraints,
        sampleCases,
        hiddenCases,
        cppTemplate: lang === 'cpp' ? req.referenceCode : '',
        pythonTemplate: lang === 'python' ? req.referenceCode : ''
      },
      source: 'local-oracle',
      diagnosticNote: `Đã dùng Code AC tham chiếu sinh ${hiddenCases.length} test ẩn · TLE: ${formatTimeLabel(
        execCfg.timeLimitEnabled,
        execCfg.timeLimitMs
      )}.`
    };
  }

  // 2B. Use inferred algorithmic solver
  if (inferredKind !== 'unknown') {
    for (let i = 0; i < hiddenSeeds.length; i++) {
      const seed = hiddenSeeds[i];
      const out = runAlgorithmSolver(inferredKind, seed.input);
      if (out !== null) {
        hiddenCases.push({
          id: sampleCases.length + i + 1,
          input: seed.input,
          expectedOutput: out,
          isSample: false,
          difficulty: seed.difficulty
        });
      }
    }

    return {
      problem: {
        id: `CUSTOM_${Date.now()}`,
        title: sections.title,
        category: 'Tự do - Nhận diện thuật toán',
        difficulty: 'Medium',
        timeLimit: formatTimeLabel(execCfg.timeLimitEnabled, execCfg.timeLimitMs),
        timeLimitEnabled: execCfg.timeLimitEnabled,
        timeLimitMs: execCfg.timeLimitMs,
        ioMode: execCfg.ioMode,
        inputFileName: execCfg.inputFileName,
        outputFileName: execCfg.outputFileName,
        memoryLimit: '256MB',
        description: sections.description,
        inputFormat: sections.inputFormat,
        outputFormat: sections.outputFormat,
        constraints: sections.constraints,
        sampleCases,
        hiddenCases,
        cppTemplate: '',
        pythonTemplate: ''
      },
      source: 'local-inferred',
      diagnosticNote: `Đã nhận diện dạng bài (${inferredKind}) và tạo ${hiddenCases.length} test · TLE: ${formatTimeLabel(
        execCfg.timeLimitEnabled,
        execCfg.timeLimitMs
      )}.`
    };
  }

  // 2C. Custom unknown problem without Gemini API & without Reference AC code:
  return {
    problem: {
      id: `CUSTOM_${Date.now()}`,
      title: sections.title,
      category: 'Tự do - Test tùy chỉnh',
      difficulty: 'Medium',
      timeLimit: formatTimeLabel(execCfg.timeLimitEnabled, execCfg.timeLimitMs),
      timeLimitEnabled: execCfg.timeLimitEnabled,
      timeLimitMs: execCfg.timeLimitMs,
      ioMode: execCfg.ioMode,
      inputFileName: execCfg.inputFileName,
      outputFileName: execCfg.outputFileName,
      memoryLimit: '256MB',
      description: sections.description,
      inputFormat: sections.inputFormat,
      outputFormat: sections.outputFormat,
      constraints: sections.constraints,
      sampleCases,
      hiddenCases: [],
      cppTemplate: '',
      pythonTemplate: ''
    },
    source: 'template',
    diagnosticNote:
      'Đã trích xuất đề bài và test mẫu. Bạn có thể thêm test từng mức độ (Cơ bản ➜ Thử thách) ở cột trái.'
  };
}

export const LESSON_HIDDEN_TEST_CASES: Record<
  string,
  Array<{ input: string; expectedOutput: string; difficulty: TestDifficultyTier }>
> = {
  CS_P1: [
    { input: '2 3', expectedOutput: '5\n6', difficulty: 'Cơ bản' },
    { input: '10 25', expectedOutput: '35\n250', difficulty: 'Cơ bản' },
    { input: '-5 12', expectedOutput: '7\n-60', difficulty: 'Trung bình' },
    { input: '0 0', expectedOutput: '0\n0', difficulty: 'Nâng cao' },
    { input: '1000000000 -1000000000', expectedOutput: '0\n-1000000000000000000', difficulty: 'Thử thách' }
  ],
  CS_P2: [
    { input: '5', expectedOutput: '3', difficulty: 'Cơ bản' },
    { input: '10', expectedOutput: '4', difficulty: 'Cơ bản' },
    { input: '30', expectedOutput: '10', difficulty: 'Trung bình' },
    { input: '1', expectedOutput: '0', difficulty: 'Nâng cao' },
    { input: '1000', expectedOutput: '168', difficulty: 'Thử thách' }
  ],
  CS_P3: [
    { input: '5\n1 2 2 3 4', expectedOutput: '2 2', difficulty: 'Cơ bản' },
    { input: '4\n7 7 7 3', expectedOutput: '7 3', difficulty: 'Cơ bản' },
    { input: '5\n4 4 2 2 9', expectedOutput: '2 2', difficulty: 'Trung bình' },
    { input: '1\n5', expectedOutput: '5 1', difficulty: 'Nâng cao' },
    { input: '8\n9 1 3 1 9 3 1 9', expectedOutput: '1 3', difficulty: 'Thử thách' }
  ],
  CS_P4: [
    { input: '5', expectedOutput: '10', difficulty: 'Cơ bản' },
    { input: '6', expectedOutput: '4', difficulty: 'Trung bình' },
    { input: '1', expectedOutput: '1', difficulty: 'Nâng cao' },
    { input: '3', expectedOutput: '0', difficulty: 'Nâng cao' },
    { input: '8', expectedOutput: '92', difficulty: 'Thử thách' }
  ],
  CS_P5: [
    { input: '3 1\n2 3 5', expectedOutput: '10', difficulty: 'Cơ bản' },
    { input: '3 3\n4 9 2', expectedOutput: '9', difficulty: 'Cơ bản' },
    { input: '5 2\n1 2 3 4 5', expectedOutput: '9', difficulty: 'Trung bình' },
    { input: '6 3\n1 4 4 2 3 5', expectedOutput: '8', difficulty: 'Nâng cao' },
    { input: '7 3\n7 2 5 10 8 1 6', expectedOutput: '15', difficulty: 'Thử thách' }
  ],
  CS_P6: [
    { input: '4 10\n1 2 3 4', expectedOutput: '4', difficulty: 'Cơ bản' },
    { input: '5 7\n2 1 3 1 4', expectedOutput: '4', difficulty: 'Cơ bản' },
    { input: '6 6\n3 1 2 1 1 5', expectedOutput: '4', difficulty: 'Trung bình' },
    { input: '5 3\n4 5 6 7 8', expectedOutput: '0', difficulty: 'Nâng cao' },
    { input: '8 9\n5 1 2 1 2 1 2 8', expectedOutput: '6', difficulty: 'Thử thách' }
  ],
  CS_P7: [
    { input: '4\n1 2 3 4', expectedOutput: '4', difficulty: 'Cơ bản' },
    { input: '5\n3 1 4 2 5', expectedOutput: '3', difficulty: 'Cơ bản' },
    { input: '6\n5 2 8 6 3 6', expectedOutput: '3', difficulty: 'Trung bình' },
    { input: '4\n5 4 3 2', expectedOutput: '1', difficulty: 'Nâng cao' },
    { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', difficulty: 'Thử thách' }
  ],
  CS_P8: [
    { input: '3 2\n1 2 5\n2 3 3', expectedOutput: '0 5 8', difficulty: 'Cơ bản' },
    { input: '4 4\n1 2 2\n2 3 3\n1 3 10\n3 4 1', expectedOutput: '0 2 5 6', difficulty: 'Trung bình' },
    { input: '3 1\n1 2 5', expectedOutput: '0 5 -1', difficulty: 'Nâng cao' },
    { input: '5 6\n1 2 1000000000\n2 3 1000000000\n3 4 1000000000\n1 5 5\n5 4 5\n4 3 5', expectedOutput: '0 1000000000 15 10 5', difficulty: 'Thử thách' }
  ],
  CS_P9: [
    { input: '3 2\n1 5 2\n2 1 3\n2 1 2', expectedOutput: '5\n5', difficulty: 'Cơ bản' },
    { input: '3 2\n10 20 15\n1 1 25\n2 1 2', expectedOutput: '25', difficulty: 'Trung bình' },
    { input: '4 3\n5 2 8 1\n2 1 4\n1 3 0\n2 2 4', expectedOutput: '8\n2', difficulty: 'Nâng cao' },
    { input: '5 4\n-5 -2 -9 -1 -4\n2 1 3\n1 3 -1\n2 2 5\n2 1 5', expectedOutput: '-2\n-1\n-1', difficulty: 'Thử thách' }
  ],
  CS_P10: [
    { input: '2 5', expectedOutput: '32', difficulty: 'Cơ bản' },
    { input: '3 4', expectedOutput: '81', difficulty: 'Cơ bản' },
    { input: '2 30', expectedOutput: '73741817', difficulty: 'Trung bình' },
    { input: '5 0', expectedOutput: '1', difficulty: 'Nâng cao' },
    { input: '123456789 987654321', expectedOutput: '652541198', difficulty: 'Thử thách' }
  ],
  CS_P11: [
    { input: '()', expectedOutput: 'YES', difficulty: 'Cơ bản' },
    { input: '((()))', expectedOutput: 'YES', difficulty: 'Cơ bản' },
    { input: '([{}])', expectedOutput: 'YES', difficulty: 'Trung bình' },
    { input: '((]', expectedOutput: 'NO', difficulty: 'Nâng cao' },
    { input: '}{', expectedOutput: 'NO', difficulty: 'Thử thách' }
  ],
  CS_P12: [
    { input: 'aaaaa\na', expectedOutput: '5', difficulty: 'Cơ bản' },
    { input: 'hello\nworld', expectedOutput: '0', difficulty: 'Cơ bản' },
    { input: 'ababcababa\naba', expectedOutput: '3', difficulty: 'Trung bình' },
    { input: 'ababab\nabab', expectedOutput: '2', difficulty: 'Nâng cao' },
    { input: 'mississippi\nissi', expectedOutput: '2', difficulty: 'Thử thách' }
  ]
};

export interface CodeMistakeItem {
  location: string;
  issue: string;
  explanation: string;
  fixHint: string;
}

export interface CodeMistakeAnalysis {
  summary: string;
  mistakes: CodeMistakeItem[];
  simpleSampleCode: string;
  simpleCodeExplanation: string;
  complexityNote: string;
  source: 'ai' | 'local';
}

export interface AnalyzeCodeMistakeRequest {
  problemTitle: string;
  problemDescription: string;
  inputFormat?: string;
  outputFormat?: string;
  language: CodeLanguage;
  userCode: string;
  score: number;
  failedTests: Array<{
    index: number;
    status: string;
    input: string;
    expected: string;
    actual: string;
  }>;
  fallbackSampleCpp?: string;
  fallbackSamplePython?: string;
}

export async function analyzeCodeMistakeWithAI(
  req: AnalyzeCodeMistakeRequest
): Promise<CodeMistakeAnalysis> {
  try {
    const res = await safeFetchJson<any>(
      '/api/gemini/analyze-code-mistake',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: req.problemTitle,
          problemDescription: req.problemDescription,
          inputFormat: req.inputFormat,
          outputFormat: req.outputFormat,
          language: req.language,
          userCode: req.userCode,
          score: req.score,
          failedTests: req.failedTests
        })
      },
      28000
    );

    if (res.ok && res.data?.success && res.data.analysis) {
      const a = res.data.analysis;
      return {
        summary: String(a.summary || ''),
        mistakes: Array.isArray(a.mistakes) ? a.mistakes : [],
        simpleSampleCode: String(a.simpleSampleCode || ''),
        simpleCodeExplanation: String(a.simpleCodeExplanation || ''),
        complexityNote: String(a.complexityNote || ''),
        source: 'ai'
      };
    }
  } catch {
    // Fall back to deterministic diagnostics below
  }

  // Deterministic local fallback diagnostics
  const mistakes: CodeMistakeItem[] = [];
  const firstFail = req.failedTests[0];
  const codeTrim = req.userCode.trim();

  if (req.language === 'cpp') {
    if (!codeTrim.includes('main(')) {
      mistakes.push({
        location: 'Hàm main()',
        issue: 'Thiếu hàm int main()',
        explanation: 'Chương trình C++ bắt buộc phải có hàm int main() làm điểm bắt đầu thực thi.',
        fixHint: 'Thêm int main() { ... return 0; } bao quanh phần xử lý.'
      });
    }
    if (/\bint\s+[a-zA-Z_]/g.test(codeTrim) && (firstFail?.expected?.length || 0) >= 10) {
      mistakes.push({
        location: 'Khai báo kiểu biến int',
        issue: 'Nguy cơ tràn số (Integer Overflow)',
        explanation: 'Kiểu int chỉ chứa tối đa khoảng 2·10⁹. Với giá trị lớn hơn, phép cộng/nhân bị sai dấu hoặc tràn.',
        fixHint: 'Chuyển các biến tính toán sang long long.'
      });
    }
  }

  if (firstFail) {
    const isFileErr =
      firstFail.actual?.includes('File I/O') ||
      firstFail.actual?.includes('FileNotFoundError') ||
      firstFail.actual?.includes('Đọc/Ghi File');
    const isTleErr = firstFail.status === 'Time Limit Exceeded';

    mistakes.push({
      location: `Test #${firstFail.index} (${firstFail.status})`,
      issue: isTleErr
        ? 'Vượt quá giới hạn thời gian (TLE)'
        : isFileErr
        ? 'Nhầm lẫn chế độ Đọc/Ghi File và Đọc/Ghi Chuẩn'
        : firstFail.status === 'Runtime Error'
        ? 'Lỗi cú pháp hoặc thực thi'
        : 'Kết quả in ra không khớp đáp án mong đợi',
      explanation:
        isTleErr || isFileErr || firstFail.status === 'Runtime Error'
          ? `${firstFail.actual || firstFail.status}.`
          : `Với đầu vào "${firstFail.input.replace(/\n/g, ' ')}", chương trình của bạn in ra "${
              firstFail.actual || '(trống)'
            }" trong khi đáp án đúng là "${firstFail.expected}".`,
      fixHint: isTleErr
        ? 'Tối ưu thuật toán để giảm độ phức tạp hoặc điều chỉnh giới hạn thời gian (TLE) trong phần cấu hình test.'
        : isFileErr
        ? 'Kiểm tra lại kiểu Đọc/Ghi (File .INP/.OUT hay stdin/stdout) giữa đề bài và code của bạn.'
        : 'Kiểm tra lại thứ tự đọc dữ liệu đầu vào, công thức tính và điều kiện biên.'
    });
  }

  const fallbackSample =
    req.language === 'python'
      ? req.fallbackSamplePython ||
        `import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    if not data:\n        return\n    # Xử lý dữ liệu từ data và in kết quả chuẩn\n\nsolve()`
      : req.fallbackSampleCpp ||
        `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Đọc input chuẩn xác và kiểm tra tràn số long long\n    return 0;\n}`;

  return {
    summary: firstFail
      ? `Bài làm đạt ${req.score}/100 điểm và bị sai ở ${req.failedTests.length} test (bắt đầu từ Test #${firstFail.index}: ${firstFail.status}).`
      : req.score === 100
      ? 'Xuất sắc! Bài làm đạt 100/100 điểm và vượt qua toàn bộ bộ test.'
      : 'Hãy kiểm tra lại logic xử lý các trường hợp biên và định dạng dữ liệu xuất.',
    mistakes,
    simpleSampleCode: fallbackSample,
    simpleCodeExplanation:
      'Đoạn code mẫu trên đọc dữ liệu an toàn theo đúng định dạng chuẩn và xử lý trọn vẹn các trường hợp biên.',
    complexityNote: 'Đảm bảo đọc/ghi nhanh và dùng kiểu 64-bit khi số liệu lớn.',
    source: 'local'
  };
}
