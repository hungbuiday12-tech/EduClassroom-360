import { CodeLanguage, CodingProblem, TestCase } from '../../types';
import { executeCode } from './codeRunner';

export interface UserSamplePair {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface AnalyzeProblemRequest {
  text: string;
  imageBase64?: string | null;
  mimeType?: string;
  fileName?: string | null;
  userSamples?: UserSamplePair[];
  referenceCode?: string;
  referenceLang?: CodeLanguage;
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
  if (norm.includes('uoc chung') || norm.includes('ucln') || norm.includes('gcd')) candidates.push('gcd_lcm' as any);
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

/**
 * Generate varied, boundary-covering hidden test inputs matching the input format / algorithm
 */
function generateHiddenInputs(kind: AlgorithmKind, sampleInput?: string): string[] {
  // Detect sample shape if kind is unknown
  const lines = (sampleInput || '').trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const firstTokens = (lines[0] || '').split(/\s+/).filter(Boolean);

  switch (kind) {
    case 'sum_ab':
    case 'diff_ab':
    case 'prod_ab':
    case 'sum_prod_ab':
      return [
        '0 0',
        '1 -1',
        '42 58',
        '-125 375',
        '1000000 2000000',
        '1000000000 1000000000'
      ];
    case 'gcd_ab':
    case 'lcm_ab':
      return ['12 18', '7 13', '100 25', '1 99', '36 48', '144 96'];
    case 'prime_check':
      return ['1', '2', '4', '17', '97', '100', '9973'];
    case 'count_primes':
      return ['1', '2', '10', '30', '100', '1000'];
    case 'factorial':
      return ['0', '1', '5', '7', '10', '12'];
    case 'fibonacci':
      return ['0', '1', '2', '8', '15', '35'];
    case 'sum_1_to_n':
      return ['1', '5', '10', '100', '1000', '100000'];
    case 'digit_sum':
      return ['0', '9', '12345', '99999', '1000000007', '847291'];
    case 'max_ab':
      return ['3 5', '10 2 8', '-5 -2 -9', '0 0 1', '15 42 7 29', '100 99 101'];
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
        '1\n7',
        '4\n5 5 5 5',
        '5\n1 2 3 4 5',
        '6\n9 4 7 2 8 1',
        '7\n-3 5 -1 4 -2 6 -1',
        '10\n12 3 19 8 3 15 27 8 1 20'
      ];
    case 'bin_search':
      return [
        '1 10\n10',
        '5 1\n2 4 6 8 10',
        '6 5\n2 4 5 5 5 8',
        '7 99\n1 5 12 25 60 99 105',
        '5 2\n2 4 6 8 10'
      ];
    case 'knapsack':
      return [
        '1 5\n5 10',
        '2 3\n4 10\n5 20',
        '4 7\n1 1\n3 4\n4 5\n5 7',
        '5 10\n2 3\n3 4\n4 5\n5 8\n9 10'
      ];
    case 'palindrome':
      return ['a', 'aba', 'abba', 'abc', 'RaceCar', 'hello world'];
    case 'string_reverse':
    case 'word_count':
      return ['hello', 'lap trinh c++', 'a b c d', 'Sublime Text Monokai', 'olympic tin hoc'];
    default: {
      // Fallback matching sample shape if available
      if (lines.length === 1 && firstTokens.length === 1 && !isNaN(Number(firstTokens[0]))) {
        return ['1', '5', '10', '25', '100'];
      }
      if (lines.length === 1 && firstTokens.length === 2 && !isNaN(Number(firstTokens[0]))) {
        return ['1 1', '3 5', '10 20', '7 13', '100 50'];
      }
      if (lines.length >= 2 && firstTokens.length === 1 && !isNaN(Number(firstTokens[0]))) {
        return ['1\n1', '3\n1 2 3', '5\n5 4 3 2 1', '6\n2 9 4 1 7 3'];
      }
      return ['1\n0', '2\n1 2', '5\n1 2 3 4 5'];
    }
  }
}

/**
 * Full problem analysis & verified test suite generation
 */
export async function analyzeProblemAndGenerateTests(
  req: AnalyzeProblemRequest
): Promise<AnalyzeProblemResult> {
  const userSamples = (req.userSamples || []).filter((s) => s.input.trim() || s.expectedOutput.trim());
  const extractedFromText = extractSamplesFromText(req.text);
  const combinedSamples: UserSamplePair[] =
    userSamples.length > 0 ? userSamples : extractedFromText;

  // 1. Try Server AI Endpoint (/api/gemini/analyze-problem) if available
  try {
    const res = await fetch('/api/gemini/analyze-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: req.text.trim(),
        imageBase64: req.imageBase64 || undefined,
        mimeType: req.mimeType || undefined
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.problem) {
        const aiSamples: TestCase[] = Array.isArray(data.problem.sampleCases)
          ? data.problem.sampleCases.map((tc: any, idx: number) => ({
              id: idx + 1,
              input: String(tc.input ?? ''),
              expectedOutput: String(tc.expectedOutput ?? ''),
              isSample: true,
              explanation: tc.explanation
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
                explanation: s.explanation || 'Test mẫu do bạn cung cấp'
              }))
            : aiSamples;

        let hiddenCases: TestCase[] = Array.isArray(data.problem.hiddenCases)
          ? data.problem.hiddenCases.map((tc: any, idx: number) => ({
              id: mergedSamples.length + idx + 1,
              input: String(tc.input ?? ''),
              expectedOutput: String(tc.expectedOutput ?? ''),
              isSample: false
            }))
          : [];

        // If user provided AC Reference Code or AI returned referencePython/referenceCpp, verify hiddenCases outputs!
        const oracleCode = req.referenceCode?.trim() || data.problem.referencePython || data.problem.referenceCpp;
        const oracleLang: CodeLanguage = req.referenceCode?.trim()
          ? req.referenceLang || 'cpp'
          : data.problem.referencePython
          ? 'python'
          : 'cpp';

        if (oracleCode) {
          const verifiedHidden: TestCase[] = [];
          for (const hc of hiddenCases) {
            const exec = await executeCode('CUSTOM_ORACLE', oracleLang, oracleCode, hc.input);
            verifiedHidden.push({
              ...hc,
              expectedOutput: !exec.isError && exec.stdout.trim() ? exec.stdout.trim() : hc.expectedOutput
            });
          }
          hiddenCases = verifiedHidden;
        }

        const analyzedProblem: CodingProblem = {
          id: data.problem.id || `CUSTOM_${Date.now()}`,
          title: data.problem.title || 'Bài Toán Đã Phân Tích',
          category: 'Tự do - Phân tích AI',
          difficulty: 'Medium',
          timeLimit: '1.0s',
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
          diagnosticNote: `AI đã phân tích đề bài và tạo ${mergedSamples.length} test mẫu + ${hiddenCases.length} test ẩn chuẩn xác.`
        };
      }
    }
  } catch {
    // Fall through cleanly to local algorithmic / oracle engine
  }

  // 2. Local Structured Analysis + Smart Test Generator
  const sections = parseStructuredSections(req.text, req.fileName);
  const inferredKind = inferAlgorithm(req.text, combinedSamples);

  const sampleCases: TestCase[] =
    combinedSamples.length > 0
      ? combinedSamples.map((s, idx) => ({
          id: idx + 1,
          input: s.input,
          expectedOutput: s.expectedOutput,
          isSample: true,
          explanation: s.explanation || 'Test mẫu từ đề bài'
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
            explanation: 'Test mẫu khởi tạo tự động'
          }
        ];

  const hiddenRawInputs = generateHiddenInputs(inferredKind, sampleCases[0]?.input);
  const hiddenCases: TestCase[] = [];

  // 2A. If user supplied a Reference AC solution, run it on every generated hidden test!
  if (req.referenceCode && req.referenceCode.trim()) {
    const lang = req.referenceLang || 'cpp';
    for (let i = 0; i < hiddenRawInputs.length; i++) {
      const inp = hiddenRawInputs[i];
      const res = await executeCode('ORACLE', lang, req.referenceCode, inp);
      if (!res.isError) {
        hiddenCases.push({
          id: sampleCases.length + i + 1,
          input: inp,
          expectedOutput: res.stdout.trim(),
          isSample: false
        });
      }
    }

    return {
      problem: {
        id: `CUSTOM_${Date.now()}`,
        title: sections.title,
        category: 'Tự do - Code AC tham chiếu',
        difficulty: 'Medium',
        timeLimit: '1.0s',
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
      diagnosticNote: `Đã dùng Code AC tham chiếu để sinh ${hiddenCases.length} test ẩn với đáp án chính xác 100%.`
    };
  }

  // 2B. Use inferred algorithmic solver
  if (inferredKind !== 'unknown') {
    for (let i = 0; i < hiddenRawInputs.length; i++) {
      const inp = hiddenRawInputs[i];
      const out = runAlgorithmSolver(inferredKind, inp);
      if (out !== null) {
        hiddenCases.push({
          id: sampleCases.length + i + 1,
          input: inp,
          expectedOutput: out,
          isSample: false
        });
      }
    }

    return {
      problem: {
        id: `CUSTOM_${Date.now()}`,
        title: sections.title,
        category: 'Tự do - Nhận diện thuật toán',
        difficulty: 'Medium',
        timeLimit: '1.0s',
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
      diagnosticNote: `Đã nhận diện dạng bài (${inferredKind}) và tự động tạo ${hiddenCases.length} bộ test kiểm thử biên.`
    };
  }

  // 2C. Custom unknown problem without Gemini API & without Reference AC code:
  // Preserve user's sample cases faithfully instead of fabricating fake '0' hidden tests!
  return {
    problem: {
      id: `CUSTOM_${Date.now()}`,
      title: sections.title,
      category: 'Tự do - Test tùy chỉnh',
      difficulty: 'Medium',
      timeLimit: '1.0s',
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
      'Đã trích xuất đề bài và các test mẫu bạn cung cấp. Bạn có thể bấm "+ Thêm Test" ở cột trái hoặc đính kèm Code AC để sinh thêm test ẩn tự động.'
  };
}
