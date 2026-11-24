export type TypingDifficulty = 'easy' | 'normal' | 'hard';

export type TypingTopicId =
  | 'random_mix'
  | 'english_stem'
  | 'vietnamese_prose'
  | 'cpp_commands'
  | 'python_commands'
  | 'report_templates';

export interface TypingDifficultyConfig {
  id: TypingDifficulty;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  targetWpm: number;
  baseSpeedPxPerSec: number;
  spawnIntervalMs: number;
  maxOnScreen: number;
  hearts: number;
  scoreMultiplier: number;
  accentColor: string;
}

export const TYPING_DIFFICULTIES: Record<TypingDifficulty, TypingDifficultyConfig> = {
  easy: {
    id: 'easy',
    labelVi: 'Dễ',
    labelEn: 'Easy',
    descVi: 'Nhịp vừa · Từ ngắn · 5 Tim · Mốc ~28 WPM',
    descEn: 'Relaxed pace · Short tokens · 5 Hearts · ~28 WPM target',
    targetWpm: 28,
    baseSpeedPxPerSec: 36,
    spawnIntervalMs: 2650,
    maxOnScreen: 5,
    hearts: 5,
    scoreMultiplier: 1,
    accentColor: '#10b981',
  },
  normal: {
    id: 'normal',
    labelVi: 'Thường',
    labelEn: 'Normal',
    descVi: 'Nhịp chuẩn · Cụm từ & Cú pháp · 4 Tim · Mốc ~48 WPM',
    descEn: 'Balanced pace · Phrases & syntax · 4 Hearts · ~48 WPM target',
    targetWpm: 48,
    baseSpeedPxPerSec: 56,
    spawnIntervalMs: 1950,
    maxOnScreen: 7,
    hearts: 4,
    scoreMultiplier: 1.5,
    accentColor: '#0ea5e9',
  },
  hard: {
    id: 'hard',
    labelVi: 'Khó',
    labelEn: 'Hard',
    descVi: 'Tốc độ cao · Biểu thức phức tạp · 3 Tim · Mốc ~74 WPM',
    descEn: 'High velocity · Complex syntax · 3 Hearts · ~74 WPM target',
    targetWpm: 74,
    baseSpeedPxPerSec: 82,
    spawnIntervalMs: 1420,
    maxOnScreen: 9,
    hearts: 3,
    scoreMultiplier: 2.25,
    accentColor: '#f43f5e',
  },
};

export interface TypingTopicOption {
  id: TypingTopicId;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  shortEn: string;
  badgeText: string;
  samplePreview: string;
}

export const TYPING_TOPICS: TypingTopicOption[] = [
  {
    id: 'random_mix',
    labelVi: 'Ngẫu nhiên Anh – Việt',
    labelEn: 'Random EN–VI Mix',
    shortVi: 'Ngẫu nhiên Anh–Việt',
    shortEn: 'EN–VI Random',
    badgeText: 'EN + VI',
    samplePreview: 'momentum · động lượng · vector · thuật toán',
  },
  {
    id: 'english_stem',
    labelVi: 'Tiếng Anh STEM & Học thuật',
    labelEn: 'English STEM & Academic',
    shortVi: 'English STEM',
    shortEn: 'English STEM',
    badgeText: 'EN',
    samplePreview: 'equilibrium · diffraction · gradient · theorem',
  },
  {
    id: 'vietnamese_prose',
    labelVi: 'Tiếng Việt Chuẩn & Học thuật',
    labelEn: 'Vietnamese Academic',
    shortVi: 'Tiếng Việt',
    shortEn: 'Vietnamese',
    badgeText: 'VI',
    samplePreview: 'quang phổ · tích phân · gia tốc · xác suất',
  },
  {
    id: 'cpp_commands',
    labelVi: 'Hàm & Lệnh C++ (STL)',
    labelEn: 'C++ Functions & STL',
    shortVi: 'Hàm/Lệnh C++',
    shortEn: 'C++ STL',
    badgeText: 'C++',
    samplePreview: 'vector<int> · lower_bound · priority_queue',
  },
  {
    id: 'python_commands',
    labelVi: 'Hàm & Lệnh Python',
    labelEn: 'Python Commands & Idioms',
    shortVi: 'Hàm/Lệnh Python',
    shortEn: 'Python',
    badgeText: 'PY',
    samplePreview: 'enumerate() · collections.Counter · lambda',
  },
  {
    id: 'report_templates',
    labelVi: 'Mẫu Câu Báo cáo Cơ bản',
    labelEn: 'Basic Report Phrases',
    shortVi: 'Báo cáo Cơ bản',
    shortEn: 'Report Templates',
    badgeText: 'RPT',
    samplePreview: 'Mục tiêu thí nghiệm · Executive summary',
  },
];

export type TypingRunFormat = 'campaign' | 'sprint' | 'time_attack' | 'endless';

export interface TypingRunFormatOption {
  id: TypingRunFormat;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  shortEn: string;
  descVi: string;
  descEn: string;
}

export const TYPING_RUN_FORMATS: TypingRunFormatOption[] = [
  {
    id: 'campaign',
    labelVi: 'Chiến dịch 3 Wave + Boss',
    labelEn: '3-Wave Campaign + Boss',
    shortVi: '3 Wave + Boss',
    shortEn: '3 Waves + Boss',
    descVi: 'Vượt 3 đợt từ vựng & hạ Boss 3 pha để chiến thắng',
    descEn: 'Clear 3 waves & defeat a 3-phase Boss to win',
  },
  {
    id: 'sprint',
    labelVi: 'Sprint Đếm Từ',
    labelEn: 'Word Sprint',
    shortVi: 'Sprint (20-30 từ)',
    shortEn: 'Sprint',
    descVi: 'Hoàn thành chính xác số từ mục tiêu nhanh nhất có thể',
    descEn: 'Clear the exact target word count as fast as possible',
  },
  {
    id: 'time_attack',
    labelVi: 'Đua Giờ 60 Giây',
    labelEn: '60s Time Attack',
    shortVi: 'Đua 60s',
    shortEn: '60s Blitz',
    descVi: 'Đua tốc độ với Ghost Rival trong đúng 60 giây',
    descEn: 'Race against the Ghost Rival inside a 60-second clock',
  },
  {
    id: 'endless',
    labelVi: 'Sinh Tồn Vô Hạn',
    labelEn: 'Endless Survival',
    shortVi: 'Vô hạn',
    shortEn: 'Endless',
    descVi: 'Chế độ leo điểm không giới hạn với Boss nhỏ mỗi 15 từ',
    descEn: 'Unlimited survival run with mini-bosses every 15 words',
  },
];

export const SPRINT_WORD_TARGETS: Record<TypingDifficulty, number> = {
  easy: 20,
  normal: 25,
  hard: 30,
};

export interface TypingSoundProfile {
  id: 'mech_switch' | 'crystal_ping' | 'holo_pulse' | 'wood_tap' | 'soft_pop';
  labelVi: string;
  labelEn: string;
}

export const TYPING_SOUND_PROFILES: TypingSoundProfile[] = [
  { id: 'mech_switch', labelVi: 'Phím cơ Thocky', labelEn: 'Mech Switch' },
  { id: 'crystal_ping', labelVi: 'Pha lê Sáng', labelEn: 'Crystal Key' },
  { id: 'holo_pulse', labelVi: 'Synth Cyber', labelEn: 'Cyber Pulse' },
  { id: 'wood_tap', labelVi: 'Gõ Gỗ Trầm', labelEn: 'Wood Tap' },
  { id: 'soft_pop', labelVi: 'Êm Ái Nhẹ', labelEn: 'Soft Pop' },
];

export interface TypingMedalDef {
  id: string;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
}

export const TYPING_MEDALS: TypingMedalDef[] = [
  {
    id: 'boss_slayer',
    labelVi: 'Kẻ Diệt Boss',
    labelEn: 'Boss Slayer',
    descVi: 'Đánh bại Boss Wave 3 trong Chiến dịch',
    descEn: 'Defeated the Wave 3 Boss in Campaign',
  },
  {
    id: 'flawless_run',
    labelVi: 'Chính Xác Tuyệt Đối',
    labelEn: 'Flawless Flow',
    descVi: 'Hoàn thành màn chơi với độ chính xác >= 97%',
    descEn: 'Completed a run with >= 97% accuracy',
  },
  {
    id: 'speed_demon',
    labelVi: 'Tia Chớp 65+ WPM',
    labelEn: 'Lightning 65+ WPM',
    descVi: 'Đạt tốc độ thực tế từ 65 WPM trở lên',
    descEn: 'Reached 65+ net WPM in a completed round',
  },
  {
    id: 'combo_master',
    labelVi: 'Bậc Thầy Combo 25×',
    labelEn: 'Combo Master 25×',
    descVi: 'Chạm chuỗi liên hoàn 25 lần trở lên',
    descEn: 'Achieved a 25× combo streak',
  },
  {
    id: 'overdrive_pro',
    labelVi: 'Kích Hoạt Overdrive',
    labelEn: 'Overdrive Ignition',
    descVi: 'Đạt trạng thái Overdrive năng lượng cực đại',
    descEn: 'Triggered maximum Overdrive flow state',
  },
];

const ENGLISH_BANK: Record<TypingDifficulty, string[]> = {
  easy: [
    'atom', 'wave', 'mass', 'force', 'light', 'orbit', 'code', 'loop', 'node', 'data',
    'axis', 'line', 'sine', 'prime', 'volt', 'watt', 'heat', 'lens', 'focus', 'flux',
    'array', 'stack', 'queue', 'graph', 'sort', 'hash', 'math', 'ratio', 'angle', 'scale',
    'speed', 'pulse', 'laser', 'prism', 'sound', 'charge', 'spin', 'quark', 'photon', 'matrix',
    'phase', 'crest', 'trough', 'power', 'work', 'joule', 'tesla', 'henry', 'ohm', 'farad',
    'torque', 'lever', 'pivot', 'slope', 'root', 'chord', 'curve', 'plane', 'solid', 'fluid',
    'byte', 'bit', 'tree', 'heap', 'mesh', 'frame', 'pixel', 'shader', 'render', 'cache',
  ],
  normal: [
    'velocity', 'momentum', 'gradient', 'integral', 'derivative', 'frequency', 'amplitude',
    'wavelength', 'refraction', 'impedance', 'resonance', 'capacitor', 'inductance', 'algorithm',
    'recursion', 'heuristic', 'complexity', 'invariant', 'logarithm', 'asymptote', 'determinant',
    'eigenvalue', 'polynomial', 'hyperbola', 'trajectory', 'kinetic energy', 'magnetic flux',
    'electric field', 'binary search', 'segment tree', 'prefix sum', 'solar eclipse',
    'harmonic motion', 'standing wave', 'interference', 'diffraction', 'polarization',
    'thermodynamics', 'entropy', 'enthalpy', 'equilibrium', 'centripetal', 'gravitation',
    'escape velocity', 'quantum state', 'wavefunction', 'hamiltonian', 'parabola',
    'vector space', 'orthogonal', 'permutation', 'combination', 'probability',
    'hash table', 'linked list', 'adjacency', 'topological', 'minimum cut', 'radix sort',
  ],
  hard: [
    'electromagnetism', 'thermodynamics', 'superposition', 'schrodinger wave', 'harmonic oscillator',
    'angular momentum', 'centripetal force', 'conservation law', 'quantum tunneling', 'dynamic programming',
    'breadth-first search', 'dijkstra shortest path', 'fast fourier transform', 'partial differential',
    'cauchy-schwarz inequality', 'riemann curvature tensor', 'heisenberg uncertainty',
    'computational fluid dynamics', 'maxwell equations', 'lorentz transformation',
    'photoelectric effect', 'blackbody radiation', 'nuclear binding energy',
    'snell law of refraction', 'kirchhoff voltage loop', 'bernoulli conservation',
    'lagrangian mechanics', 'eigenvalue decomposition', 'singular value factor',
    'strongly connected graph', 'fenwick binary indexed tree', 'disjoint set union',
    'convex hull trick', 'knuth morris pratt', 'persistent segment tree',
    'stochastic gradient descent', 'backward propagation', 'convolutional kernel',
  ],
};

const VIETNAMESE_BANK: Record<TypingDifficulty, string[]> = {
  easy: [
    'toán', 'vật lí', 'tin học', 'sóng', 'lực', 'khối', 'góc', 'trục', 'hàm', 'điểm',
    'mạch', 'điện', 'từ', 'nhiệt', 'quang', 'vận tốc', 'gia tốc', 'dao động', 'chu kì',
    'tần số', 'năng lượng', 'công suất', 'áp suất', 'thế năng', 'động năng', 'lăng kính',
    'thấu kính', 'tích phân', 'đạo hàm', 'mảng', 'đồ thị', 'thuật toán', 'biến số',
    'quang học', 'cơ học', 'tĩnh điện', 'từ trường', 'hạt nhân', 'điện trở', 'tụ điện',
    'cuộn cảm', 'cộng hưởng', 'biên độ', 'pha ban đầu', 'tiếp tuyến', 'cực trị', 'tiệm cận',
    'xác suất', 'tổ hợp', 'ngăn xếp', 'hàng đợi', 'cây nhị phân', 'đệ quy', 'con trỏ',
    'biểu thức', 'hằng số', 'nghiệm số', 'véc tơ', 'mặt phẳng', 'hình cầu',
  ],
  normal: [
    'bảo toàn cơ năng', 'định luật ohm', 'cảm ứng điện từ', 'giao thoa ánh sáng',
    'phương trình bậc hai', 'hình học không gian', 'vectơ pháp tuyến', 'hệ phương trình',
    'cân bằng nhiệt động', 'khúc xạ ánh sáng', 'dao động điều hòa', 'con lắc đơn',
    'chuyển động thẳng đều', 'tìm kiếm nhị phân', 'quy hoạch động', 'cấu trúc dữ liệu',
    'xác suất thống kê', 'giới hạn dãy số', 'phản ứng hạt nhân', 'hiệu ứng doppler',
    'định luật faraday', 'định lí pitago', 'hàm số lượng giác', 'tán sắc ánh sáng',
    'phóng xạ tự nhiên', 'công của lực điện', 'hiệu điện thế', 'suất điện động',
    'sóng điện từ', 'giao thoa sóng nước', 'cực đại giao thoa', 'bước sóng ánh sáng',
    'năng lượng liên kết', 'chuyển động tròn đều', 'lực hướng tâm', 'momen quán tính',
    'định lí cosin', 'tích có hướng', 'phương trình mặt cầu', 'cây khung nhỏ nhất',
    'duyệt theo chiều rộng', 'duyệt theo chiều sâu', 'mảng cộng dồn', 'chặt nhị phân',
    'sàng số nguyên tố', 'ước chung lớn nhất', 'bội chung nhỏ nhất', 'phân tích thừa số',
  ],
  hard: [
    'nguyên lí bảo toàn động lượng', 'phương trình chuyển động ném xiên',
    'định lí biến thiên động năng', 'dao động tắt dần và cộng hưởng',
    'quang phổ vạch phát xạ hiđrô', 'bất đẳng thức cauchy trong đại số',
    'thuật toán tìm đường đi ngắn nhất', 'cây phân đoạn cập nhật lười',
    'nguyên lí bất định lượng tử', 'sóng dừng trên dây hai đầu cố định',
    'tích phân xác định và diện tích hình phẳng', 'hiện tượng quang điện ngoài',
    'định luật bảo toàn năng lượng toàn phần', 'phương trình dao động điều hòa',
    'mạch dao động điện từ tự do', 'truyền tải điện năng đi xa',
    'nguyên lí chồng chất điện trường', 'lực từ tác dụng lên dây dẫn',
    'khảo sát sự biến thiên và vẽ đồ thị', 'phương trình tiếp tuyến tại điểm',
    'tìm đường đi ngắn nhất bằng dijkstra', 'thuật toán quy hoạch động trạng thái',
    'biến đổi fourier nhanh trên mảng số', 'tính đối xứng của hàm số chẵn lẻ',
    'cân bằng động trong hệ quy chiếu quán tính', 'bức xạ điện từ tần số siêu cao',
  ],
};

const CPP_BANK: Record<TypingDifficulty, string[]> = {
  easy: [
    'int n;', 'cin >> x;', 'cout << ans;', 'return 0;', 'vector<int>', 'pair<int,int>',
    'sort()', 'push_back()', 'pop_back()', 'size()', 'begin()', 'end()', 'long long',
    'double pi', 'for(i=0)', 'while(n--)', 'if(ok)', 'break;', 'continue;', 'swap(a,b)',
    'max(x,y)', 'min(a,b)', 'abs(d)', 'sqrt(n)', 'pow(2,k)', 'set<int>', 'map<int,int>',
    'bool flag;', 'char ch;', 'string s;', 'getline()', 'empty()', 'clear()', 'front()',
    'back()', 'top()', 'push(x)', 'pop()', 'stoi(s)', 'to_string', 'ceil(x)', 'floor(x)',
    'round(v)', 'reverse()', 'unique()', 'count()', 'find(x)', 'erase()', 'insert()',
  ],
  normal: [
    'vector<long long> a(n);', 'sort(a.begin(), a.end());', 'lower_bound(v.begin(), v.end(), x)',
    'upper_bound(a.begin(), a.end(), k)', 'priority_queue<int> pq;', 'unordered_map<string, int>',
    'memset(dp, -1, sizeof(dp));', 'ios::sync_with_stdio(false);', 'cin.tie(nullptr);',
    '__gcd(a, b)', '__builtin_popcount(mask)', 'emplace_back(u, w)', 'adj[u].push_back(v);',
    'while (!q.empty())', 'res = (res + mod) % mod;', 'st.insert(val);',
    'deque<int> dq;', 'bitset<64> bs(mask);', 'accumulate(a.begin(), a.end(), 0LL)',
    'max_element(v.begin(), v.end())', 'min_element(v.begin(), v.end())',
    'next_permutation(p.begin(), p.end())', 'fill(vis.begin(), vis.end(), false);',
    'partial_sum(a.begin(), a.end(), p.begin())', 'unique(v.begin(), v.end())',
    'nth_element(a.begin(), a.begin() + k, a.end())', 'mt19937_64 rng(42);',
    'struct Edge { int u, v, w; };', 'template <typename T>', 'constexpr int MAXN = 2e5 + 5;',
  ],
  hard: [
    'priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;',
    'ios_base::sync_with_stdio(false); cin.tie(0);',
    'auto it = lower_bound(dp.begin(), dp.end(), x);',
    'for (auto &[v, w] : adj[u])',
    'function<void(int, int)> dfs = [&](int u, int p) {',
    'vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));',
    'const long long INF = 1e18;',
    'return (a % MOD * b % MOD) % MOD;',
    'sort(edges.begin(), edges.end(), [](const Edge &a, const Edge &b) { return a.w < b.w; });',
    'auto find_root = [&](auto &self, int u) -> int { return p[u] == u ? u : p[u] = self(self, p[u]); };',
    'void update(int id, int l, int r, int pos, long long val)',
    'long long query(int id, int l, int r, int u, int v)',
    'vector<int> tin(n + 1), low(n + 1), comp(n + 1);',
    'while (l <= r) { int mid = l + (r - l) / 2; }',
    'dp[mask | (1 << nxt)] = min(dp[mask | (1 << nxt)], dp[mask] + cost);',
    'vector<int> deg(n + 1, 0), order;',
    'priority_queue<long long, vector<long long>, greater<long long>> min_pq;',
    'unordered_map<long long, int> freq_map;',
    'if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; }',
    'auto cmp = [](const Node &x, const Node &y) { return x.val > y.val; };',
    'long long binpow(long long a, long long b, long long m)',
    'int lca(int u, int v) { return depth[u] < depth[v] ? u : v; }',
    'memset(parent, -1, sizeof(parent));',
    'for (int bit = 20; bit >= 0; --bit)',
    'ans = max(ans, prefix[r] - prefix[l - 1]);',
    'deque<pair<int, int>> dq_min;',
    'cout << fixed << setprecision(6) << result << "\\n";',
  ],
};

const PYTHON_BANK: Record<TypingDifficulty, string[]> = {
  easy: [
    'def main():', 'print(ans)', 'len(arr)', 'range(n)', 'enumerate()', 'zip(a, b)',
    'sorted(nums)', 'sum(dp)', 'max(res)', 'min(val)', 'list()', 'dict()', 'set()',
    'import math', 'import sys', 'return True', 'for x in a:', 'if x in s:', 'nums.append(x)',
    'nums.pop()', 'map(int)', 'split()', 'join()', 'abs(x)', 'round(v, 2)',
    'any(flags)', 'all(checks)', 'divmod(a, b)', 'pow(x, y, m)', 'chr(65)', 'ord("a")',
    'bin(mask)', 'hex(val)', 'reversed(a)', 'tuple(pair)', 'isinstance()', 'lambda x: x',
    'break', 'continue', 'pass', 'yield item', 'try:', 'except:', 'finally:',
    'with open()', 'f"{val:.2f}"', 'math.sqrt(n)', 'math.ceil(x)', 'math.floor(x)',
  ],
  normal: [
    'from collections import Counter, deque', 'from functools import lru_cache',
    'sys.stdin.readline().split()', 'for idx, val in enumerate(arr):',
    'freq = Counter(words)', 'q = deque([start])', 'heapq.heappush(pq, (d, u))',
    'res = [x * x for x in range(n)]', 'seen.add((r, c))', 'lambda x: (x[1], -x[0])',
    'math.gcd(a, b)', 'np.linspace(0, 10, 100)', 'df.groupby("grade").mean()',
    'with open("data.csv") as f:', 'bisect.bisect_left(arr, target)',
    'itertools.combinations(items, 2)', 'itertools.accumulate(prefix)',
    'defaultdict(list)', 'json.loads(payload)', 'asyncio.gather(*tasks)',
    'np.linalg.norm(vec)', 'plt.subplots(figsize=(8, 4))', 'dict(zip(keys, vals))',
    'any(x > threshold for x in data)', 'sorted(freq.items(), key=lambda kv: -kv[1])',
    'matrix = [[0] * cols for _ in range(rows)]', 'step = (right - left) // 2',
  ],
  hard: [
    'ans = [x ** 2 for x in nums if x % 2 == 0 and x > 0]',
    'adj = defaultdict(list); visited = set()',
    '@lru_cache(maxsize=None)',
    'dist = {node: float("inf") for node in graph}',
    'async def fetch_payload(url: str) -> dict:',
    'res = sorted(items, key=lambda item: (-item[1], item[0]))',
    'plt.plot(x_vals, np.sin(omega * x_vals + phi))',
    'u, w = heapq.heappop(pq)',
    'sys.setrecursionlimit(10 ** 6)',
    'dp = [math.inf] * (target + 1); dp[0] = 0',
    'merged = {k: a.get(k, 0) + b.get(k, 0) for k in set(a) | set(b)}',
    'grad = np.gradient(y_samples, x_samples)',
    'filtered = list(filter(lambda row: row["score"] >= 8.5, records))',
    'eigenvals, eigenvecs = np.linalg.eig(covariance_matrix)',
    'model.fit(X_train, y_train, epochs=25, batch_size=32)',
    'df_clean = df.dropna(subset=["score"]).sort_values("score")',
    'with ThreadPoolExecutor(max_workers=4) as pool:',
    'counts = {word: text.split().count(word) for word in vocab}',
    'path = deque([(start_node, [start_node])])',
    'integral, err = scipy.integrate.quad(lambda t: np.exp(-t * t), 0, 5)',
    'pivot = arr[len(arr) // 2]',
    'assert len(inputs) == len(targets), "Shape mismatch"',
    'normalized = (arr - arr.mean()) / (arr.std() + 1e-8)',
    'results = [asyncio.create_task(worker(item)) for item in queue]',
    'writer.writerow([timestamp, round(velocity, 3), status])',
    'seen_states: set[tuple[int, int]] = set()',
    'coeffs = np.polyfit(time_axis, position_axis, deg=2)',
  ],
};

const REPORT_BANK: Record<TypingDifficulty, string[]> = {
  easy: [
    'Mục tiêu báo cáo', 'Kết quả đo đạc', 'Bảng số liệu', 'Nhận xét chung', 'Kết luận bài làm',
    'Phương pháp đo', 'Sai số tương đối', 'Giả thuyết ban đầu', 'Executive summary',
    'Key findings', 'Data overview', 'Next steps', 'Project scope', 'Target metric',
    'Lab observation', 'Action items', 'Tóm tắt nội dung', 'Đối tượng nghiên cứu',
    'Dụng cụ thí nghiệm', 'Quy trình thực hiện', 'Đánh giá kết quả', 'Kiến nghị cải tiến',
    'Baseline report', 'Quality check', 'Status update', 'Risk analysis', 'Final verdict',
    'Phân tích số liệu', 'Biểu đồ minh họa', 'Thông số kỹ thuật',
  ],
  normal: [
    'Mục tiêu thí nghiệm hôm nay', 'Tổng hợp kết quả đo thực nghiệm',
    'Phân tích nguyên nhân sai số hệ thống', 'Đề xuất giải pháp cải tiến quy trình',
    'Dữ liệu cho thấy xu hướng tăng ổn định', 'The experimental error remained below 2%',
    'Summary of weekly performance metrics', 'Methodology and apparatus setup',
    'Recommendations for phase two', 'Comparison against baseline benchmark',
    'Giá trị trung bình đạt độ tin cậy cao', 'Các thông số đều nằm trong ngưỡng cho phép',
    'Biểu đồ phân bố thể hiện tính tuyến tính rõ rệt', 'Kiểm tra lại hiệu chuẩn cảm biến trước khi đo',
    'Quarterly engineering milestone review', 'Observed correlation between mass and period',
    'Key risks identified during stress testing', 'Proposed optimization cuts render time by half',
    'Kiểm tra độ ổn định của nguồn cấp điện', 'Tổng hợp bảng đối chiếu giữa lí thuyết và thực đo',
    'Xác định ngưỡng bão hòa của mạch khuếch đại', 'Đánh giá mức độ phân tán dữ liệu sau năm lần thử',
    'Hiệu suất xử lí đạt mức mục tiêu đề ra', 'Thiết lập quy trình kiểm thử tự động hàng tuần',
    'Baseline latency stayed under twenty milliseconds', 'Sensor calibration verified before data capture',
    'Peer review approved the updated test protocol', 'Final deliverable ready for sprint demonstration',
  ],
  hard: [
    'Báo cáo tổng kết hiệu suất mô phỏng vật lí theo thời gian thực.',
    'Kết quả thực nghiệm khẳng định mối tương quan tuyến tính giữa hai đại lượng.',
    'Based on empirical telemetry, the proposed algorithm reduces latency by 35%.',
    'The committee recommends scaling the pilot cohort in the upcoming quarter.',
    'Sai số ngẫu nhiên được giảm thiểu nhờ lặp lại phép đo năm lần liên tiếp.',
    'Độ lệch chuẩn của chuỗi dữ liệu nằm hoàn toàn trong giới hạn tin cậy 95%.',
    'Continuous profiling verified smooth 60 FPS WebGL frame pacing under load.',
    'Nhóm nghiên cứu kiến nghị áp dụng bộ lọc thông thấp để khử nhiễu tín hiệu.',
    'Statistical validation confirms a significant gain in student accuracy and recall.',
    'Tổng hợp số liệu cho thấy hiệu suất thuật toán tăng gấp đôi trên tập kiểm thử lớn.',
    'Phương pháp bình phương tối thiểu giúp xác định chính xác hệ số góc đường thẳng.',
    'Biểu đồ pha thể hiện rõ sự chuyển dịch năng lượng giữa động năng và thế năng.',
    'The simulation benchmark demonstrates deterministic latency across all hardware tiers.',
    'Nhóm thực hành đã hiệu chỉnh lại điểm không trước khi tiến hành loạt đo tiếp theo.',
    'Cross-validation confirms consistent model generalization across unseen test samples.',
    'Tỉ số tín hiệu trên nhiễu được cải thiện đáng kể sau khi áp dụng bộ lọc số.',
    'Quarterly quality metrics exceeded the target accuracy threshold by four percent.',
    'Phân tích hồi quy tuyến tính cho hệ số tương quan đạt mức R bình phương 0.994.',
    'Automated regression checks validated every simulation formula prior to release.',
    'Báo cáo đề xuất bổ sung thêm bước kiểm tra biên để tránh tràn số nguyên lớn.',
    'Field measurements align closely with the theoretical curve predicted by mechanics.',
    'Đánh giá tổng quan cho thấy tiến độ dự án hoàn toàn đáp ứng đúng lộ trình đề ra.',
    'Independent peer verification confirmed reproducibility across three separate trials.',
    'Kết luận cuối cùng nhấn mạnh vai trò của việc chuẩn hóa dữ liệu đầu vào ngay từ đầu.',
    'Nhóm kĩ thuật đề xuất bổ sung kiểm tra biên để đảm bảo tính ổn định lâu dài.',
    'Comprehensive stress testing confirmed zero memory leaks during continuous playback.',
    'Báo cáo nghiệm thu ghi nhận độ chính xác đạt mức tối ưu trên toàn bộ tập dữ liệu.',
    'Structured telemetry logs verify seamless synchronization across active client nodes.',
  ],
};

export interface BossEncounterConfig {
  titleVi: string;
  titleEn: string;
  phases: string[];
}

export function getBossForTopic(
  topic: TypingTopicId,
  difficulty: TypingDifficulty,
  isEn: boolean
): BossEncounterConfig {
  const count = difficulty === 'easy' ? 2 : difficulty === 'normal' ? 3 : 4;
  if (topic === 'cpp_commands') {
    const phases = [
      'priority_queue<int> pq;',
      'sort(a.begin(), a.end());',
      'ios::sync_with_stdio(false);',
      'return (a + b) % MOD;',
    ].slice(0, count);
    return {
      titleVi: 'BOSS C++: Lõi Biên Dịch Tối Thượng',
      titleEn: 'C++ BOSS: Compiler Overlord',
      phases,
    };
  }
  if (topic === 'python_commands') {
    const phases = [
      'from collections import Counter',
      'res = sorted(arr, key=lambda x: -x)',
      'with open("data.csv") as f:',
      'async def run_task() -> dict:',
    ].slice(0, count);
    return {
      titleVi: 'BOSS Python: Mạng Lưới Dữ Liệu',
      titleEn: 'Python BOSS: Neural Pipeline',
      phases,
    };
  }
  if (topic === 'english_stem') {
    const phases = [
      'harmonic oscillator',
      'conservation of momentum',
      'electromagnetic induction',
      'heisenberg uncertainty principle',
    ].slice(0, count);
    return {
      titleVi: 'BOSS STEM: Lò Phản Ứng Lượng Tử',
      titleEn: 'STEM BOSS: Quantum Singularity',
      phases,
    };
  }
  if (topic === 'vietnamese_prose') {
    const phases = [
      'bảo toàn cơ năng toàn phần',
      'giao thoa sóng ánh sáng kết hợp',
      'nguyên lí cộng hưởng điều hòa',
      'thuật toán tìm đường đi ngắn nhất',
    ].slice(0, count);
    return {
      titleVi: 'BOSS Học Thuật: Hạt Nhân Bão Từ',
      titleEn: 'Academic BOSS: Magnetic Core',
      phases,
    };
  }
  if (topic === 'report_templates') {
    const phases = [
      'Mục tiêu thí nghiệm thực hành',
      'Phân tích sai số hệ thống đo',
      'Executive summary and key findings',
      'Kết quả kiểm thử đạt độ chính xác cao',
    ].slice(0, count);
    return {
      titleVi: 'BOSS Báo Cáo: Bản Tổng Kết Cuối Kì',
      titleEn: 'Report BOSS: Executive Audit',
      phases,
    };
  }

  // random_mix
  const phases = isEn
    ? [
        'angular momentum',
        'dao động điều hòa',
        'fast fourier transform',
        'cảm ứng điện từ trường',
      ].slice(0, count)
    : [
        'động lượng toàn phần',
        'electromagnetic wave',
        'nguyên lí bảo toàn năng lượng',
        'quantum superposition state',
      ].slice(0, count);
  return {
    titleVi: 'BOSS Song Ngữ: Thử Thách Siêu Tốc',
    titleEn: 'Bilingual BOSS: Hyperdrive Core',
    phases,
  };
}

export function buildSmartDrillPassage(
  weakCodes: string[],
  missedWords: string[],
  isEn: boolean
): string {
  const cleanMissed = Array.from(new Set(missedWords.map((w) => w.trim()).filter(Boolean)));
  const weakLetters = weakCodes
    .map((c) => formatCodeShortLabel(c).toLowerCase())
    .filter((l) => /^[a-z0-9]$/.test(l));

  const fallbackBank = isEn
    ? [...ENGLISH_BANK.easy, ...ENGLISH_BANK.normal]
    : [...VIETNAMESE_BANK.easy, ...VIETNAMESE_BANK.normal];

  const letterMatchedWords =
    weakLetters.length > 0
      ? fallbackBank.filter((w) => weakLetters.some((ch) => w.toLowerCase().includes(ch)))
      : [];

  const combined = Array.from(
    new Set([...cleanMissed, ...letterMatchedWords, ...fallbackBank])
  ).slice(0, 18);

  return combined.join(' · ').replace(/ · /g, ' ');
}

export function getWordsForTopicAndDifficulty(
  topic: TypingTopicId,
  difficulty: TypingDifficulty
): string[] {
  if (topic === 'random_mix') {
    const en = ENGLISH_BANK[difficulty];
    const vi = VIETNAMESE_BANK[difficulty];
    const mixed: string[] = [];
    const maxLen = Math.max(en.length, vi.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < en.length) mixed.push(en[i]);
      if (i < vi.length) mixed.push(vi[i]);
    }
    return mixed;
  }
  if (topic === 'english_stem') return ENGLISH_BANK[difficulty];
  if (topic === 'vietnamese_prose') return VIETNAMESE_BANK[difficulty];
  if (topic === 'cpp_commands') return CPP_BANK[difficulty];
  if (topic === 'python_commands') return PYTHON_BANK[difficulty];
  return REPORT_BANK[difficulty];
}

export interface TimedPassagePreset {
  id: string;
  categoryLabelVi: string;
  categoryLabelEn: string;
  titleVi: string;
  titleEn: string;
  text: string;
}

export const TIMED_PASSAGES: TimedPassagePreset[] = [
  {
    id: 'physics_lab_report',
    categoryLabelVi: 'Báo cáo Thực hành Lí',
    categoryLabelEn: 'Physics Lab Report',
    titleVi: 'Báo cáo đo gia tốc trọng trường bằng con lắc đơn',
    titleEn: 'Simple Pendulum Gravity Measurement Report',
    text: 'Mục tiêu thí nghiệm là xác định gia tốc trọng trường tại phòng thí nghiệm bằng con lắc đơn có chiều dài dây treo thay đổi. Khi góc lệch nhỏ hơn mười độ, dao động của con lắc được xem là dao động điều hòa với chu kì tỉ lệ thuận với căn bậc hai của chiều dài. Sau năm lần bấm giờ liên tiếp cho hai mươi chu kì toàn phần, ta tính được giá trị trung bình và sai số tuyệt đối của phép đo.',
  },
  {
    id: 'english_stem_essay',
    categoryLabelVi: 'Tiếng Anh Học thuật',
    categoryLabelEn: 'Academic English',
    titleVi: 'Simulating Orbital Mechanics in Real Time',
    titleEn: 'Simulating Orbital Mechanics in Real Time',
    text: 'Modern interactive simulations transform abstract equations into living visual intuition. When students adjust gravitational constants or initial launch velocities, they immediately observe how elliptical trajectories evolve under inverse-square forces. Rapid keyboard fluency lets engineers document findings, write clean solver scripts, and test hypotheses without breaking cognitive flow.',
  },
  {
    id: 'cpp_dijkstra_snippet',
    categoryLabelVi: 'Code C++ Thuật toán',
    categoryLabelEn: 'C++ Algorithm Snippet',
    titleVi: 'Hàm tìm đường đi ngắn nhất Dijkstra trong C++',
    titleEn: 'Dijkstra Shortest Path Implementation in C++',
    text: 'void dijkstra(int start, vector<vector<pair<int,int>>>& adj) { vector<long long> dist(adj.size(), 1e18); priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq; dist[start] = 0; pq.push({0, start}); while (!pq.empty()) { auto [d, u] = pq.top(); pq.pop(); if (d > dist[u]) continue; for (auto [v, w] : adj[u]) { if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push({dist[v], v}); } } } }',
  },
  {
    id: 'python_data_pipeline',
    categoryLabelVi: 'Code Python Dữ liệu',
    categoryLabelEn: 'Python Data Pipeline',
    titleVi: 'Chuẩn hóa và phân tích phổ điểm bằng Python',
    titleEn: 'Score Normalization & Analytics in Python',
    text: 'from collections import Counter\ndef analyze_scores(records):\n    clean = [round(x, 2) for x in records if 0 <= x <= 10]\n    avg = sum(clean) / max(1, len(clean))\n    top = sorted(clean, reverse=True)[:5]\n    freq = Counter(int(x) for x in clean)\n    return {"average": round(avg, 2), "top": top, "bins": dict(freq)}',
  },
  {
    id: 'executive_report_en_vi',
    categoryLabelVi: 'Báo cáo Dự án Song ngữ',
    categoryLabelEn: 'Bilingual Project Report',
    titleVi: 'Tóm tắt tiến độ Sprint tuần (Song ngữ Anh – Việt)',
    titleEn: 'Weekly Engineering Sprint Summary',
    text: 'Executive summary: Nhóm kỹ thuật đã hoàn thành tối ưu hiệu năng dựng hình từ 30 FPS lên 60 FPS ổn định trên trình duyệt. Three key milestones were verified: reduced memory allocation during particle updates, synchronized WebRTC audio streams, and automated regression checks across all simulation modules.',
  },
];

export function computeSuggestedTimeSec(text: string, difficulty: TypingDifficulty): number {
  const charCount = Math.max(20, text.trim().length);
  const wordsEquivalent = charCount / 5;
  const targetWpm = TYPING_DIFFICULTIES[difficulty].targetWpm;
  const rawSeconds = Math.ceil((wordsEquivalent / targetWpm) * 60);
  // Floor & ceiling so short or very long passages stay fair
  return Math.max(18, Math.min(600, rawSeconds + (difficulty === 'easy' ? 10 : difficulty === 'normal' ? 5 : 0)));
}

export interface KeyboardKeyDef {
  code: string;
  label: string;
  subLabel?: string;
  widthUnit: number; // 1 = standard 1u key
  isModifier?: boolean;
}

export const MINI_KEYBOARD_ROWS: KeyboardKeyDef[][] = [
  [
    { code: 'Backquote', label: '`', subLabel: '~', widthUnit: 1 },
    { code: 'Digit1', label: '1', subLabel: '!', widthUnit: 1 },
    { code: 'Digit2', label: '2', subLabel: '@', widthUnit: 1 },
    { code: 'Digit3', label: '3', subLabel: '#', widthUnit: 1 },
    { code: 'Digit4', label: '4', subLabel: '$', widthUnit: 1 },
    { code: 'Digit5', label: '5', subLabel: '%', widthUnit: 1 },
    { code: 'Digit6', label: '6', subLabel: '^', widthUnit: 1 },
    { code: 'Digit7', label: '7', subLabel: '&', widthUnit: 1 },
    { code: 'Digit8', label: '8', subLabel: '*', widthUnit: 1 },
    { code: 'Digit9', label: '9', subLabel: '(', widthUnit: 1 },
    { code: 'Digit0', label: '0', subLabel: ')', widthUnit: 1 },
    { code: 'Minus', label: '-', subLabel: '_', widthUnit: 1 },
    { code: 'Equal', label: '=', subLabel: '+', widthUnit: 1 },
    { code: 'Backspace', label: '⌫', widthUnit: 1.9, isModifier: true },
  ],
  [
    { code: 'Tab', label: 'Tab', widthUnit: 1.45, isModifier: true },
    { code: 'KeyQ', label: 'Q', widthUnit: 1 },
    { code: 'KeyW', label: 'W', widthUnit: 1 },
    { code: 'KeyE', label: 'E', widthUnit: 1 },
    { code: 'KeyR', label: 'R', widthUnit: 1 },
    { code: 'KeyT', label: 'T', widthUnit: 1 },
    { code: 'KeyY', label: 'Y', widthUnit: 1 },
    { code: 'KeyU', label: 'U', widthUnit: 1 },
    { code: 'KeyI', label: 'I', widthUnit: 1 },
    { code: 'KeyO', label: 'O', widthUnit: 1 },
    { code: 'KeyP', label: 'P', widthUnit: 1 },
    { code: 'BracketLeft', label: '[', subLabel: '{', widthUnit: 1 },
    { code: 'BracketRight', label: ']', subLabel: '}', widthUnit: 1 },
    { code: 'Backslash', label: '\\', subLabel: '|', widthUnit: 1.45 },
  ],
  [
    { code: 'CapsLock', label: 'Caps', widthUnit: 1.7, isModifier: true },
    { code: 'KeyA', label: 'A', widthUnit: 1 },
    { code: 'KeyS', label: 'S', widthUnit: 1 },
    { code: 'KeyD', label: 'D', widthUnit: 1 },
    { code: 'KeyF', label: 'F', widthUnit: 1 },
    { code: 'KeyG', label: 'G', widthUnit: 1 },
    { code: 'KeyH', label: 'H', widthUnit: 1 },
    { code: 'KeyJ', label: 'J', widthUnit: 1 },
    { code: 'KeyK', label: 'K', widthUnit: 1 },
    { code: 'KeyL', label: 'L', widthUnit: 1 },
    { code: 'Semicolon', label: ';', subLabel: ':', widthUnit: 1 },
    { code: 'Quote', label: "'", subLabel: '"', widthUnit: 1 },
    { code: 'Enter', label: 'Enter', widthUnit: 2.2, isModifier: true },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', widthUnit: 2.2, isModifier: true },
    { code: 'KeyZ', label: 'Z', widthUnit: 1 },
    { code: 'KeyX', label: 'X', widthUnit: 1 },
    { code: 'KeyC', label: 'C', widthUnit: 1 },
    { code: 'KeyV', label: 'V', widthUnit: 1 },
    { code: 'KeyB', label: 'B', widthUnit: 1 },
    { code: 'KeyN', label: 'N', widthUnit: 1 },
    { code: 'KeyM', label: 'M', widthUnit: 1 },
    { code: 'Comma', label: ',', subLabel: '<', widthUnit: 1 },
    { code: 'Period', label: '.', subLabel: '>', widthUnit: 1 },
    { code: 'Slash', label: '/', subLabel: '?', widthUnit: 1 },
    { code: 'ShiftRight', label: 'Shift', widthUnit: 2.7, isModifier: true },
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl', widthUnit: 1.35, isModifier: true },
    { code: 'AltLeft', label: 'Alt', widthUnit: 1.35, isModifier: true },
    { code: 'Space', label: 'Space', widthUnit: 6.8 },
    { code: 'AltRight', label: 'Alt', widthUnit: 1.35, isModifier: true },
    { code: 'ControlRight', label: 'Ctrl', widthUnit: 1.35, isModifier: true },
  ],
];

const CHAR_TO_CODE: Record<string, string> = {
  ' ': 'Space',
  '\n': 'Enter',
  '\t': 'Tab',
  '`': 'Backquote',
  '~': 'Backquote',
  '!': 'Digit1',
  '@': 'Digit2',
  '#': 'Digit3',
  '$': 'Digit4',
  '%': 'Digit5',
  '^': 'Digit6',
  '&': 'Digit7',
  '*': 'Digit8',
  '(': 'Digit9',
  ')': 'Digit0',
  '-': 'Minus',
  '_': 'Minus',
  '=': 'Equal',
  '+': 'Equal',
  '[': 'BracketLeft',
  '{': 'BracketLeft',
  ']': 'BracketRight',
  '}': 'BracketRight',
  '\\': 'Backslash',
  '|': 'Backslash',
  ';': 'Semicolon',
  ':': 'Semicolon',
  "'": 'Quote',
  '"': 'Quote',
  ',': 'Comma',
  '<': 'Comma',
  '.': 'Period',
  '>': 'Period',
  '/': 'Slash',
  '?': 'Slash',
};

export function mapCharToPhysicalCode(char: string | undefined): string | null {
  if (!char) return null;
  if (CHAR_TO_CODE[char]) return CHAR_TO_CODE[char];
  // Strip Vietnamese diacritics to find the base Latin key on QWERTY
  const base = char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase();
  if (/^[A-Z]$/.test(base)) return `Key${base}`;
  if (/^[0-9]$/.test(base)) return `Digit${base}`;
  return null;
}

export function formatCodeShortLabel(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = {
    Space: 'SPACE',
    Enter: 'ENTER',
    Backspace: 'BKSP',
    ShiftLeft: 'L-SHIFT',
    ShiftRight: 'R-SHIFT',
    ControlLeft: 'L-CTRL',
    ControlRight: 'R-CTRL',
    AltLeft: 'L-ALT',
    AltRight: 'R-ALT',
    Tab: 'TAB',
    CapsLock: 'CAPS',
    Comma: ',',
    Period: '.',
    Slash: '/',
    Semicolon: ';',
    Quote: "'",
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Backquote: '`',
  };
  return map[code] || code;
}
