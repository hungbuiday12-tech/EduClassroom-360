import { Point2D, Segment2D, VizStep } from './types';

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// =====================================================================
// 1. TỌA ĐỘ OXY: CONVEX HULL (ANDREW'S MONOTONE CHAIN)
// =====================================================================
export function generateConvexHullSteps(rawPoints: Point2D[]): VizStep[] {
  const pts = rawPoints.slice(0, 24);
  const steps: VizStep[] = [];

  if (pts.length < 3) {
    steps.push({
      stepIndex: 0,
      title: 'Cần ít nhất 3 điểm trên mặt phẳng Oxy',
      description: 'Hãy thêm điểm trực tiếp lên mặt phẳng tọa độ hoặc chọn bộ mẫu để dựng bao lồi.',
      statusTag: 'init',
      variables: [{ name: 'N', value: String(pts.length) }],
      state: { points: pts, lower: [], upper: [], hull: [], checking: null, crossVal: null }
    });
    return steps;
  }

  const sorted = [...pts].sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
  const cross = (o: Point2D, a: Point2D, b: Point2D) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  steps.push({
    stepIndex: steps.length,
    title: 'Bước 1: Sắp xếp điểm theo hoành độ x tăng dần',
    description: `Sắp xếp ${sorted.length} điểm theo x tăng dần (nếu x bằng nhau thì y tăng dần): ${sorted
      .map((p) => `${p.label}(${p.x},${p.y})`)
      .join(' → ')}.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'N', value: String(sorted.length) },
      { name: 'Thứ tự x', value: sorted.map((p) => p.label).join(', ') }
    ],
    state: {
      points: sorted,
      lower: [],
      upper: [],
      hull: [],
      checking: null,
      crossVal: null,
      phase: 'sort'
    }
  });

  const lower: Point2D[] = [];
  for (const p of sorted) {
    while (lower.length >= 2) {
      const o = lower[lower.length - 2];
      const a = lower[lower.length - 1];
      const cVal = cross(o, a, p);
      steps.push({
        stepIndex: steps.length,
        title: `Bao dưới: Kiểm tra rẽ trái với ${o.label} → ${a.label} → ${p.label}`,
        description:
          cVal <= 0
            ? `Tích có hướng (${o.label}${a.label} × ${o.label}${p.label}) = ${cVal} ≤ 0 (rẽ phải/thẳng hàng) ⇒ Loại đỉnh ${a.label} khỏi bao dưới.`
            : `Tích có hướng (${o.label}${a.label} × ${o.label}${p.label}) = ${cVal} > 0 (rẽ trái CCW) ⇒ Giữ nguyên ${a.label}.`,
        formula: `cross(${o.label},${a.label},${p.label}) = (${a.x}-${o.x})(${p.y}-${o.y}) - (${a.y}-${o.y})(${p.x}-${o.x}) = ${cVal}`,
        activeCodeLine: 2,
        statusTag: cVal <= 0 ? 'discard' : 'compare',
        variables: [
          { name: 'Pha', value: 'Lower Hull', highlight: 'info' },
          { name: 'Tích có hướng', value: String(cVal), highlight: cVal <= 0 ? 'warn' : 'success' },
          { name: 'Stack L', value: lower.map((x) => x.label).join(' → ') }
        ],
        state: {
          points: sorted,
          lower: clone(lower),
          upper: [],
          hull: [],
          checking: { o, a, b: p },
          crossVal: cVal,
          phase: 'lower'
        }
      });
      if (cVal <= 0) {
        lower.pop();
      } else {
        break;
      }
    }
    lower.push(p);
    steps.push({
      stepIndex: steps.length,
      title: `Bao dưới: Đưa ${p.label}(${p.x}, ${p.y}) vào Stack L`,
      description: `Thêm đỉnh ${p.label} vào chuỗi bao dưới. Stack hiện tại: [${lower.map((x) => x.label).join(', ')}].`,
      activeCodeLine: 3,
      statusTag: 'update',
      variables: [
        { name: 'Pha', value: 'Lower Hull', highlight: 'info' },
        { name: 'Stack L', value: lower.map((x) => x.label).join(' → '), highlight: 'active' }
      ],
      state: {
        points: sorted,
        lower: clone(lower),
        upper: [],
        hull: [],
        checking: null,
        crossVal: null,
        phase: 'lower'
      }
    });
  }

  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2) {
      const o = upper[upper.length - 2];
      const a = upper[upper.length - 1];
      const cVal = cross(o, a, p);
      steps.push({
        stepIndex: steps.length,
        title: `Bao trên: Kiểm tra rẽ trái với ${o.label} → ${a.label} → ${p.label}`,
        description:
          cVal <= 0
            ? `Tích có hướng = ${cVal} ≤ 0 (rẽ phải/thẳng hàng) ⇒ Loại đỉnh ${a.label} khỏi bao trên.`
            : `Tích có hướng = ${cVal} > 0 (rẽ trái CCW) ⇒ Giữ nguyên ${a.label}.`,
        formula: `cross(${o.label},${a.label},${p.label}) = ${cVal}`,
        activeCodeLine: 5,
        statusTag: cVal <= 0 ? 'discard' : 'compare',
        variables: [
          { name: 'Pha', value: 'Upper Hull', highlight: 'info' },
          { name: 'Tích có hướng', value: String(cVal), highlight: cVal <= 0 ? 'warn' : 'success' },
          { name: 'Stack U', value: upper.map((x) => x.label).join(' → ') }
        ],
        state: {
          points: sorted,
          lower: clone(lower),
          upper: clone(upper),
          hull: [],
          checking: { o, a, b: p },
          crossVal: cVal,
          phase: 'upper'
        }
      });
      if (cVal <= 0) {
        upper.pop();
      } else {
        break;
      }
    }
    upper.push(p);
    steps.push({
      stepIndex: steps.length,
      title: `Bao trên: Đưa ${p.label}(${p.x}, ${p.y}) vào Stack U`,
      description: `Thêm đỉnh ${p.label} vào chuỗi bao trên. Stack U: [${upper.map((x) => x.label).join(', ')}].`,
      activeCodeLine: 6,
      statusTag: 'update',
      variables: [
        { name: 'Pha', value: 'Upper Hull', highlight: 'info' },
        { name: 'Stack U', value: upper.map((x) => x.label).join(' → '), highlight: 'active' }
      ],
      state: {
        points: sorted,
        lower: clone(lower),
        upper: clone(upper),
        hull: [],
        checking: null,
        crossVal: null,
        phase: 'upper'
      }
    });
  }

  const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
  let perimeter = 0;
  let area2 = 0;
  for (let i = 0; i < hull.length; i++) {
    const p1 = hull[i];
    const p2 = hull[(i + 1) % hull.length];
    perimeter += Math.hypot(p2.x - p1.x, p2.y - p1.y);
    area2 += p1.x * p2.y - p2.x * p1.y;
  }
  const area = Math.abs(area2) / 2;

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất Bao Lồi (${hull.length} đỉnh)`,
    description: `Ghép Bao dưới và Bao trên (bỏ trùng đầu/cuối) ta được đa giác lồi CCW: ${hull
      .map((p) => p.label)
      .join(' → ')} → ${hull[0].label}. Chu vi ≈ ${perimeter.toFixed(2)}, Diện tích (Shoelace) = ${area.toFixed(2)}.`,
    formula: `S = 1/2 |Σ (x_i y_{i+1} - x_{i+1} y_i)| = ${area.toFixed(2)}`,
    activeCodeLine: 7,
    statusTag: 'done',
    variables: [
      { name: 'Số đỉnh bao', value: String(hull.length), highlight: 'success' },
      { name: 'Chu vi', value: perimeter.toFixed(2), highlight: 'info' },
      { name: 'Diện tích', value: area.toFixed(2), highlight: 'success' }
    ],
    state: {
      points: sorted,
      lower: clone(lower),
      upper: clone(upper),
      hull: clone(hull),
      checking: null,
      crossVal: null,
      perimeter,
      area,
      phase: 'done'
    }
  });

  return steps;
}

// =====================================================================
// 2. TỌA ĐỘ OXY: SWEEP LINE & SEGMENT INTERSECTION
// =====================================================================
function segIntersect(s1: Segment2D, s2: Segment2D): { x: number; y: number } | null {
  const a1 = s1.y2 - s1.y1;
  const b1 = s1.x1 - s1.x2;
  const c1 = a1 * s1.x1 + b1 * s1.y1;

  const a2 = s2.y2 - s2.y1;
  const b2 = s2.x1 - s2.x2;
  const c2 = a2 * s2.x1 + b2 * s2.y1;

  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;

  const x = (b2 * c1 - b1 * c2) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  const eps = 1e-6;
  const onSeg = (s: Segment2D) =>
    x >= Math.min(s.x1, s.x2) - eps &&
    x <= Math.max(s.x1, s.x2) + eps &&
    y >= Math.min(s.y1, s.y2) - eps &&
    y <= Math.max(s.y1, s.y2) + eps;

  if (onSeg(s1) && onSeg(s2)) {
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }
  return null;
}

export function generateSegmentSweepSteps(rawSegments: Segment2D[]): VizStep[] {
  const segments = rawSegments.slice(0, 12);
  const steps: VizStep[] = [];

  type Ev = { x: number; y: number; type: 'ADD' | 'REM'; seg: Segment2D };
  const events: Ev[] = [];
  for (const seg of segments) {
    const leftX = Math.min(seg.x1, seg.x2);
    const leftY = seg.x1 <= seg.x2 ? seg.y1 : seg.y2;
    const rightX = Math.max(seg.x1, seg.x2);
    const rightY = seg.x1 <= seg.x2 ? seg.y2 : seg.y1;
    events.push({ x: leftX, y: leftY, type: 'ADD', seg });
    events.push({ x: rightX, y: rightY, type: 'REM', seg });
  }
  events.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.type === 'ADD' ? -1 : 1));

  steps.push({
    stepIndex: 0,
    title: 'Khởi tạo sự kiện Đường quét (Sweep Line)',
    description: `Tạo ${events.length} sự kiện (Mở/Đóng đoạn) từ ${segments.length} đoạn thẳng, sắp xếp theo hoành độ x tăng dần.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'Số đoạn', value: String(segments.length) },
      { name: 'Sự kiện', value: String(events.length) }
    ],
    state: {
      segments,
      sweepX: events[0]?.x ?? 0,
      activeIds: [],
      checkingPair: null,
      intersections: []
    }
  });

  const active = new Map<string, Segment2D>();
  const intersections: { x: number; y: number; s1: string; s2: string }[] = [];
  const checkedPairs = new Set<string>();

  for (const ev of events) {
    if (ev.type === 'ADD') {
      const activeList = Array.from(active.values());
      for (const other of activeList) {
        const pairKey = [ev.seg.id, other.id].sort().join('_');
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const pt = segIntersect(ev.seg, other);
        if (pt) {
          intersections.push({ ...pt, s1: ev.seg.label, s2: other.label });
        }
        steps.push({
          stepIndex: steps.length,
          title: `Quét x = ${ev.x}: Kiểm tra giao ${ev.seg.label} ∩ ${other.label}`,
          description: pt
            ? `Đoạn ${ev.seg.label} cắt đoạn ${other.label} tại giao điểm (${pt.x}, ${pt.y})!`
            : `Đoạn ${ev.seg.label} và ${other.label} không giao nhau (hoặc nằm ngoài biên).`,
          activeCodeLine: 3,
          statusTag: pt ? 'update' : 'compare',
          variables: [
            { name: 'x_sweep', value: String(ev.x), highlight: 'info' },
            { name: 'Cặp kiểm tra', value: `${ev.seg.label} vs ${other.label}` },
            { name: 'Giao điểm đã tìm', value: String(intersections.length), highlight: pt ? 'success' : undefined }
          ],
          state: {
            segments,
            sweepX: ev.x,
            activeIds: [...Array.from(active.keys()), ev.seg.id],
            checkingPair: [ev.seg.id, other.id],
            intersections: clone(intersections)
          }
        });
      }
      active.set(ev.seg.id, ev.seg);
      steps.push({
        stepIndex: steps.length,
        title: `x = ${ev.x}: Thêm đoạn ${ev.seg.label} vào Active Set`,
        description: `Đường quét chạm đầu mút trái của ${ev.seg.label}. Tập đoạn đang hoạt động: [${Array.from(active.values())
          .map((s) => s.label)
          .join(', ')}].`,
        activeCodeLine: 4,
        statusTag: 'update',
        variables: [
          { name: 'x_sweep', value: String(ev.x), highlight: 'info' },
          { name: 'Active Set', value: Array.from(active.values()).map((s) => s.label).join(', ') || 'Rỗng' }
        ],
        state: {
          segments,
          sweepX: ev.x,
          activeIds: Array.from(active.keys()),
          checkingPair: null,
          intersections: clone(intersections)
        }
      });
    } else {
      active.delete(ev.seg.id);
      steps.push({
        stepIndex: steps.length,
        title: `x = ${ev.x}: Đóng đoạn ${ev.seg.label} khỏi Active Set`,
        description: `Đường quét đi qua đầu mút phải của ${ev.seg.label}, loại khỏi tập đang xét.`,
        activeCodeLine: 5,
        statusTag: 'discard',
        variables: [
          { name: 'x_sweep', value: String(ev.x), highlight: 'info' },
          { name: 'Active Set', value: Array.from(active.values()).map((s) => s.label).join(', ') || 'Rỗng' }
        ],
        state: {
          segments,
          sweepX: ev.x,
          activeIds: Array.from(active.keys()),
          checkingPair: null,
          intersections: clone(intersections)
        }
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất Đường quét (${intersections.length} giao điểm)`,
    description:
      intersections.length > 0
        ? `Tìm thấy ${intersections.length} giao điểm: ${intersections
            .map((p) => `${p.s1}∩${p.s2}=(${p.x},${p.y})`)
            .join(', ')}.`
        : 'Không có cặp đoạn thẳng nào cắt nhau.',
    statusTag: 'done',
    variables: [{ name: 'Tổng giao điểm', value: String(intersections.length), highlight: 'success' }],
    state: {
      segments,
      sweepX: (events[events.length - 1]?.x ?? 0) + 1,
      activeIds: [],
      checkingPair: null,
      intersections: clone(intersections)
    }
  });

  return steps;
}

// =====================================================================
// 3. XÂU: KMP & HÀM TIỀN TỐ π[i]
// =====================================================================
export function generateKmpSteps(textRaw: string, patternRaw: string): VizStep[] {
  const T = (textRaw || 'ABABDABACDABABCABAB').slice(0, 32);
  const P = (patternRaw || 'ABABCABAB').slice(0, 16);
  const n = T.length;
  const m = P.length;
  const steps: VizStep[] = [];

  if (m === 0 || n === 0) {
    return [
      {
        stepIndex: 0,
        title: 'Nhập xâu T và mẫu P',
        description: 'Vui lòng nhập xâu văn bản T và xâu mẫu P khác rỗng.',
        statusTag: 'init',
        variables: [],
        state: { T, P, pi: Array(m).fill(0), phase: 'pi', i: 0, j: 0, matches: [] }
      }
    ];
  }

  const pi = Array(m).fill(0);
  steps.push({
    stepIndex: 0,
    title: 'Pha 1: Khởi tạo mảng hàm tiền tố π (LPS)',
    description: `Chuẩn bị tính độ dài tiền tố thực sự dài nhất cũng là hậu tố (π[0..${m - 1}]) cho mẫu P = "${P}".`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: '|T|', value: String(n) },
      { name: '|P|', value: String(m) },
      { name: 'π', value: `[${pi.join(',')}]` }
    ],
    state: { T, P, pi: [...pi], phase: 'pi', i: 0, j: 0, matches: [], compareOk: null }
  });

  let j = 0;
  for (let i = 1; i < m; i++) {
    while (j > 0 && P[i] !== P[j]) {
      const oldJ = j;
      j = pi[j - 1];
      steps.push({
        stepIndex: steps.length,
        title: `Pha 1 (Tính π): P[${i}]='${P[i]}' ≠ P[${oldJ}]='${P[oldJ]}' ⇒ Lùi j = π[${oldJ - 1}] = ${j}`,
        description: `Ký tự không khớp, dùng giá trị đã tính trước π[${oldJ - 1}] = ${j} để nhảy tắt thay vì quay về 0.`,
        activeCodeLine: 2,
        statusTag: 'discard',
        variables: [
          { name: 'i', value: String(i) },
          { name: 'j', value: `${oldJ} → ${j}`, highlight: 'warn' },
          { name: 'π', value: `[${pi.join(',')}]` }
        ],
        state: { T, P, pi: [...pi], phase: 'pi', i, j, matches: [], compareOk: false }
      });
    }
    const ok = P[i] === P[j];
    if (ok) j++;
    pi[i] = j;
    steps.push({
      stepIndex: steps.length,
      title: `Pha 1: So sánh P[${i}]='${P[i]}' với P[${ok ? j - 1 : j}]='${P[ok ? j - 1 : j]}' ⇒ π[${i}] = ${pi[i]}`,
      description: ok
        ? `Khớp! Tăng j lên ${j} và ghi π[${i}] = ${j}.`
        : `Không khớp và j = 0 nên π[${i}] = 0.`,
      activeCodeLine: 3,
      statusTag: ok ? 'update' : 'compare',
      variables: [
        { name: 'i', value: String(i) },
        { name: 'j', value: String(j), highlight: ok ? 'success' : undefined },
        { name: `π[${i}]`, value: String(pi[i]), highlight: 'active' }
      ],
      state: { T, P, pi: [...pi], phase: 'pi', i, j, matches: [], compareOk: ok }
    });
  }

  // Phase 2: Matching
  const matches: number[] = [];
  j = 0;
  for (let i = 0; i < n; i++) {
    while (j > 0 && T[i] !== P[j]) {
      const oldJ = j;
      j = pi[j - 1];
      steps.push({
        stepIndex: steps.length,
        title: `Pha 2 (Khớp T): T[${i}]='${T[i]}' ≠ P[${oldJ}]='${P[oldJ]}' ⇒ Trượt P sang phải (j = π[${oldJ - 1}] = ${j})`,
        description: `Con trỏ i=${i} trên T giữ nguyên (không bao giờ lùi!), chỉ cập nhật j ← π[${oldJ - 1}] = ${j}.`,
        activeCodeLine: 6,
        statusTag: 'discard',
        variables: [
          { name: 'i (trên T)', value: String(i), highlight: 'info' },
          { name: 'j (trên P)', value: `${oldJ} → ${j}`, highlight: 'warn' },
          { name: 'Vị trí khớp', value: matches.join(', ') || 'Chưa có' }
        ],
        state: { T, P, pi: [...pi], phase: 'match', i, j, matches: [...matches], compareOk: false }
      });
    }

    const matchedChar = T[i] === P[j];
    if (matchedChar) j++;
    let foundAt: number | null = null;
    if (j === m) {
      foundAt = i - m + 1;
      matches.push(foundAt);
    }

    steps.push({
      stepIndex: steps.length,
      title: foundAt !== null
        ? `Tìm thấy mẫu P tại vị trí index = ${foundAt}!`
        : `Pha 2: T[${i}]='${T[i]}' ${matchedChar ? '==' : '≠'} P[${matchedChar ? j - 1 : j}]='${P[matchedChar ? j - 1 : j]}'`,
      description:
        foundAt !== null
          ? `Khớp trọn vẹn |P|=${m} ký tự kết thúc ở T[${i}]. Ghi nhận vị trí ${foundAt} và tiếp tục với j = π[${m - 1}] = ${pi[m - 1]}.`
          : matchedChar
          ? `Khớp ký tự thứ ${j}/${m}. Tiếp tục tăng i và j.`
          : `Không khớp tại j = 0. Dịch cửa sổ sang phải (i tăng lên ${i + 1}).`,
      activeCodeLine: foundAt !== null ? 8 : 7,
      statusTag: foundAt !== null ? 'done' : matchedChar ? 'update' : 'compare',
      variables: [
        { name: 'i (trên T)', value: String(i) },
        { name: 'j (trên P)', value: String(j), highlight: matchedChar ? 'success' : undefined },
        { name: 'Vị trí khớp', value: matches.join(', ') || 'Chưa có', highlight: foundAt !== null ? 'success' : undefined }
      ],
      state: {
        T,
        P,
        pi: [...pi],
        phase: 'match',
        i,
        j: foundAt !== null ? m : j,
        matches: [...matches],
        compareOk: matchedChar,
        foundAt
      }
    });

    if (j === m) {
      j = pi[j - 1];
    }
  }

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất KMP (${matches.length} lần xuất hiện)`,
    description:
      matches.length > 0
        ? `Xâu mẫu "${P}" xuất hiện ${matches.length} lần trong "${T}" tại các chỉ số 0-based: [${matches.join(', ')}].`
        : `Không tìm thấy xâu "${P}" trong "${T}".`,
    statusTag: 'done',
    variables: [{ name: 'Tổng số khớp', value: String(matches.length), highlight: 'success' }],
    state: { T, P, pi: [...pi], phase: 'done', i: n - 1, j: 0, matches: [...matches], compareOk: null }
  });

  return steps;
}

// =====================================================================
// 4. XÂU: PALINDROME (EXPAND AROUND CENTER)
// =====================================================================
export function generatePalindromeSteps(rawStr: string): VizStep[] {
  const S = (rawStr || 'ABACABA').slice(0, 22);
  const n = S.length;
  const steps: VizStep[] = [];
  if (!n) return steps;

  let bestL = 0;
  let bestR = 0;

  steps.push({
    stepIndex: 0,
    title: 'Khởi tạo tìm xâu con đối xứng dài nhất',
    description: `Xét xâu S = "${S}" (độ dài ${n}). Duyệt lần lượt từng tâm lẻ và tâm chẵn để mở rộng hai con trỏ l, r.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'S', value: S },
      { name: 'Tốt nhất', value: `"${S[0]}" (len=1)` }
    ],
    state: { S, l: 0, r: 0, center: 0, bestL: 0, bestR: 0, match: true }
  });

  for (let c = 0; c < n; c++) {
    for (const [initL, initR, kind] of [
      [c, c, 'Tâm lẻ'],
      [c, c + 1, 'Tâm chẵn']
    ] as [number, number, string][]) {
      let l = initL;
      let r = initR;
      while (l >= 0 && r < n) {
        const match = S[l] === S[r];
        if (match && r - l > bestR - bestL) {
          bestL = l;
          bestR = r;
        }
        steps.push({
          stepIndex: steps.length,
          title: `${kind} c=${c}: So sánh S[${l}]='${S[l]}' và S[${r}]='${S[r]}'`,
          description: match
            ? `Khớp đối xứng! Đoạn "${S.slice(l, r + 1)}" (độ dài ${r - l + 1}) đối xứng. Mở rộng l=${l - 1}, r=${r + 1}.`
            : `Không khớp ('${S[l]}' ≠ '${S[r]}'), dừng mở rộng từ tâm này.`,
          activeCodeLine: match ? 5 : 4,
          statusTag: match ? 'update' : 'discard',
          variables: [
            { name: 'Tâm', value: `${kind} (${c})` },
            { name: 'l, r', value: `[${l}, ${r}]`, highlight: 'active' },
            { name: 'Tốt nhất', value: `"${S.slice(bestL, bestR + 1)}" (${bestR - bestL + 1})`, highlight: 'success' }
          ],
          state: { S, l, r, center: c, bestL, bestR, match }
        });
        if (!match) break;
        l--;
        r++;
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    title: `Kết quả: "${S.slice(bestL, bestR + 1)}" (độ dài ${bestR - bestL + 1})`,
    description: `Xâu con đối xứng dài nhất nằm ở đoạn chỉ số [${bestL}..${bestR}].`,
    statusTag: 'done',
    variables: [{ name: 'Palindrome dài nhất', value: S.slice(bestL, bestR + 1), highlight: 'success' }],
    state: { S, l: bestL, r: bestR, center: -1, bestL, bestR, match: true }
  });

  return steps;
}

// =====================================================================
// 5. MẢNG 1D: PREFIX SUM & KADANE
// =====================================================================
export function generatePrefixKadaneSteps(
  rawArr: number[],
  queryL: number,
  queryR: number
): VizStep[] {
  const arr = (rawArr.length ? rawArr : [-2, -3, 4, -1, -2, 1, 5, -3]).slice(0, 16);
  const n = arr.length;
  const qL = Math.max(0, Math.min(n - 1, queryL));
  const qR = Math.max(qL, Math.min(n - 1, queryR));
  const steps: VizStep[] = [];
  const pref = Array(n + 1).fill(0);

  let curSum = 0;
  let curL = 0;
  let bestSum = -Infinity;
  let bestL = 0;
  let bestR = 0;

  steps.push({
    stepIndex: 0,
    title: 'Khởi tạo Mảng cộng dồn & Kadane',
    description: `Mảng N = ${n} phần tử. Ta đồng thời xây dựng pref[i+1] = pref[i] + a[i] và theo dõi curSum, bestSum của thuật toán Kadane.`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'curSum', value: '0' },
      { name: 'bestSum', value: '-∞' },
      { name: 'Truy vấn', value: `[${qL}..${qR}]` }
    ],
    state: { arr, pref: [...pref], idx: -1, curL: 0, curR: -1, bestL: 0, bestR: -1, curSum: 0, bestSum: null, qL, qR }
  });

  for (let i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + arr[i];
    const restart = arr[i] > curSum + arr[i];
    if (restart) {
      curSum = arr[i];
      curL = i;
    } else {
      curSum = curSum + arr[i];
    }

    const improved = curSum > bestSum;
    if (improved) {
      bestSum = curSum;
      bestL = curL;
      bestR = i;
    }

    steps.push({
      stepIndex: steps.length,
      title: `i = ${i}, a[${i}] = ${arr[i]}: pref[${i + 1}] = ${pref[i + 1]}`,
      description: `${restart ? `Bắt đầu đoạn mới tại i=${i} vì a[i] > curSum + a[i].` : `Nối tiếp đoạn [${curL}..${i}] vì cộng thêm vẫn lợi hơn.`} ${
        improved ? `Cập nhật kỷ lục bestSum = ${bestSum} trên đoạn [${bestL}..${bestR}].` : `bestSum giữ nguyên ${bestSum}.`
      }`,
      formula: `pref[${i + 1}] = ${pref[i]} + (${arr[i]}) = ${pref[i + 1]} | curSum = ${curSum}`,
      activeCodeLine: improved ? 4 : 3,
      statusTag: improved ? 'update' : 'compare',
      variables: [
        { name: 'i', value: String(i) },
        { name: `pref[${i + 1}]`, value: String(pref[i + 1]), highlight: 'info' },
        { name: 'curSum', value: String(curSum), highlight: 'active' },
        { name: 'bestSum', value: `${bestSum} [${bestL}..${bestR}]`, highlight: improved ? 'success' : undefined }
      ],
      state: { arr, pref: [...pref], idx: i, curL, curR: i, bestL, bestR, curSum, bestSum, qL, qR }
    });
  }

  const rangeAns = pref[qR + 1] - pref[qL];
  steps.push({
    stepIndex: steps.length,
    title: `Truy vấn O(1) tổng [${qL}..${qR}] = ${rangeAns} | Max Subarray = ${bestSum}`,
    description: `Sum(${qL}..${qR}) = pref[${qR + 1}] - pref[${qL}] = ${pref[qR + 1]} - (${pref[qL]}) = ${rangeAns}. Đoạn con tổng lớn nhất là [${bestL}..${bestR}] = ${bestSum}.`,
    formula: `pref[${qR + 1}] - pref[${qL}] = ${rangeAns}`,
    activeCodeLine: 5,
    statusTag: 'done',
    variables: [
      { name: `Sum[${qL}..${qR}]`, value: String(rangeAns), highlight: 'info' },
      { name: 'Kadane Max', value: `${bestSum} ([${bestL}..${bestR}])`, highlight: 'success' }
    ],
    state: { arr, pref: [...pref], idx: n - 1, curL: bestL, curR: bestR, bestL, bestR, curSum, bestSum, qL, qR, showQuery: true }
  });

  return steps;
}

// =====================================================================
// 6. MẢNG 1D: HAI CON TRỎ & CỬA SỔ TRƯỢT
// =====================================================================
export function generateTwoPointersSteps(rawArr: number[], targetS: number): VizStep[] {
  const arr = (rawArr.length ? rawArr : [3, 1, 2, 7, 4, 2, 1, 1, 5]).map((x) => Math.max(0, x)).slice(0, 16);
  const S = Math.max(1, targetS);
  const n = arr.length;
  const steps: VizStep[] = [];

  let L = 0;
  let curSum = 0;
  let bestLen = 0;
  let bestL = -1;
  let bestR = -1;

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo Cửa sổ trượt với giới hạn S = ${S}`,
    description: `Tìm đoạn con liên tiếp dài nhất có tổng các phần tử ≤ ${S}. Hai con trỏ L và R chỉ tiến về phía trước (O(N)).`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'S', value: String(S) },
      { name: 'L, R', value: '0, -1' },
      { name: 'curSum', value: '0' }
    ],
    state: { arr, S, L: 0, R: -1, curSum: 0, bestL: -1, bestR: -1, bestLen: 0 }
  });

  for (let R = 0; R < n; R++) {
    curSum += arr[R];
    steps.push({
      stepIndex: steps.length,
      title: `Mở rộng R → ${R}: Thêm a[${R}] = ${arr[R]} (Tổng = ${curSum})`,
      description: `Cửa sổ [${L}..${R}] có tổng curSum = ${curSum} ${curSum > S ? `> ${S} (vượt ngưỡng, cần co L!)` : `≤ ${S} (hợp lệ)`}.`,
      activeCodeLine: 2,
      statusTag: curSum > S ? 'compare' : 'update',
      variables: [
        { name: 'L, R', value: `${L}, ${R}`, highlight: 'active' },
        { name: 'curSum', value: `${curSum} / ${S}`, highlight: curSum > S ? 'warn' : 'info' },
        { name: 'bestLen', value: String(bestLen) }
      ],
      state: { arr, S, L, R, curSum, bestL, bestR, bestLen }
    });

    while (curSum > S && L <= R) {
      const removed = arr[L];
      curSum -= removed;
      L++;
      steps.push({
        stepIndex: steps.length,
        title: `Thu hẹp L → ${L}: Bỏ a[${L - 1}] = ${removed} (Tổng còn ${curSum})`,
        description: `Vì tổng vượt ${S}, dịch con trỏ trái L sang phải để giảm curSum xuống ${curSum}.`,
        activeCodeLine: 4,
        statusTag: 'discard',
        variables: [
          { name: 'L, R', value: `${L}, ${R}`, highlight: 'warn' },
          { name: 'curSum', value: `${curSum} / ${S}` },
          { name: 'bestLen', value: String(bestLen) }
        ],
        state: { arr, S, L, R, curSum, bestL, bestR, bestLen }
      });
    }

    const len = R - L + 1;
    if (len > bestLen) {
      bestLen = len;
      bestL = L;
      bestR = R;
      steps.push({
        stepIndex: steps.length,
        title: `Cập nhật đoạn tốt nhất: [${bestL}..${bestR}] độ dài ${bestLen}`,
        description: `Cửa sổ [${L}..${R}] có tổng ${curSum} ≤ ${S} đạt độ dài mới lớn nhất = ${bestLen}.`,
        activeCodeLine: 5,
        statusTag: 'update',
        variables: [
          { name: 'L, R', value: `${L}, ${R}` },
          { name: 'curSum', value: String(curSum), highlight: 'success' },
          { name: 'bestLen', value: `${bestLen} [${bestL}..${bestR}]`, highlight: 'success' }
        ],
        state: { arr, S, L, R, curSum, bestL, bestR, bestLen }
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất: Độ dài lớn nhất = ${bestLen}`,
    description:
      bestLen > 0
        ? `Đoạn con dài nhất có tổng ≤ ${S} là [${bestL}..${bestR}] gồm các phần tử [${arr.slice(bestL, bestR + 1).join(', ')}].`
        : `Không có đoạn con nào có tổng ≤ ${S}.`,
    statusTag: 'done',
    variables: [{ name: 'Kết quả', value: `${bestLen} (${bestL >= 0 ? `[${bestL}..${bestR}]` : '0'})`, highlight: 'success' }],
    state: { arr, S, L: bestL, R: bestR, curSum, bestL, bestR, bestLen }
  });

  return steps;
}

// =====================================================================
// 7. MẢNG 1D: QUICKSORT / MERGESORT / MONOTONIC STACK
// =====================================================================
export function generateSortStackSteps(
  rawArr: number[],
  mode: 'monostack' | 'quicksort' | 'mergesort'
): VizStep[] {
  const arr = (rawArr.length ? rawArr : [4, 7, 2, 5, 8, 3, 6, 1]).slice(0, 14);
  const steps: VizStep[] = [];

  if (mode === 'monostack') {
    const stack: number[] = [];
    const ans = Array(arr.length).fill(-1);
    steps.push({
      stepIndex: 0,
      title: 'Khởi tạo Ngăn xếp Đơn điệu Tăng (Nearest Smaller Left)',
      description: 'Tìm chỉ số phần tử nhỏ hơn gần nhất bên trái của mỗi a[i] bằng Stack đơn điệu trong O(N).',
      activeCodeLine: 0,
      statusTag: 'init',
      variables: [{ name: 'Stack', value: '[]' }],
      state: { mode, arr: [...arr], idx: -1, stack: [], ans: [...ans], poppingIdx: null }
    });

    for (let i = 0; i < arr.length; i++) {
      while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
        const topIdx = stack.pop()!;
        steps.push({
          stepIndex: steps.length,
          title: `i=${i} (a[i]=${arr[i]}): Pop idx=${topIdx} (a=${arr[topIdx]} ≥ ${arr[i]})`,
          description: `Vì a[${topIdx}]=${arr[topIdx]} ≥ a[${i}]=${arr[i]}, phần tử ${topIdx} không thể là "nhỏ hơn gần nhất" cho các phần tử bên phải nữa ⇒ Pop!`,
          activeCodeLine: 3,
          statusTag: 'discard',
          variables: [
            { name: 'i', value: String(i) },
            { name: 'a[i]', value: String(arr[i]), highlight: 'active' },
            { name: 'Stack idx', value: `[${stack.join(', ')}]` }
          ],
          state: { mode, arr: [...arr], idx: i, stack: [...stack], ans: [...ans], poppingIdx: topIdx }
        });
      }

      ans[i] = stack.length > 0 ? stack[stack.length - 1] : -1;
      stack.push(i);
      steps.push({
        stepIndex: steps.length,
        title: `Gán ans[${i}] = ${ans[i] === -1 ? '-1 (Không có)' : `idx ${ans[i]} (giá trị ${arr[ans[i]]})`} & Push ${i}`,
        description: `Đỉnh stack hiện tại là kết quả cho a[${i}]. Sau đó đẩy i=${i} vào Stack để giữ tính đơn điệu tăng.`,
        activeCodeLine: 5,
        statusTag: 'update',
        variables: [
          { name: `ans[${i}]`, value: String(ans[i]), highlight: 'success' },
          { name: 'Stack idx', value: `[${stack.join(', ')}]`, highlight: 'info' },
          { name: 'Stack val', value: `[${stack.map((k) => arr[k]).join(', ')}]` }
        ],
        state: { mode, arr: [...arr], idx: i, stack: [...stack], ans: [...ans], poppingIdx: null }
      });
    }

    steps.push({
      stepIndex: steps.length,
      title: 'Hoàn tất Ngăn xếp Đơn điệu!',
      description: `Mảng kết quả Nearest Smaller Left (0-based): [${ans.join(', ')}].`,
      statusTag: 'done',
      variables: [{ name: 'ans[]', value: `[${ans.join(', ')}]`, highlight: 'success' }],
      state: { mode, arr: [...arr], idx: arr.length - 1, stack: [...stack], ans: [...ans], poppingIdx: null }
    });
    return steps;
  }

  if (mode === 'quicksort') {
    const a = [...arr];
    const sortedFlags = Array(a.length).fill(false);

    steps.push({
      stepIndex: 0,
      title: 'Khởi tạo QuickSort (Chia để trị)',
      description: `Sắp xếp mảng N = ${a.length} phần tử bằng cách chọn chốt Pivot (phần tử cuối đoạn) và phân hoạch.`,
      statusTag: 'init',
      variables: [{ name: 'Mảng', value: `[${a.join(', ')}]` }],
      state: { mode, arr: [...a], l: 0, r: a.length - 1, pivotIdx: -1, iPtr: -1, jPtr: -1, sortedFlags: [...sortedFlags] }
    });

    const qs = (l: number, r: number) => {
      if (l >= r) {
        if (l >= 0 && l < a.length) sortedFlags[l] = true;
        return;
      }
      const pivot = a[r];
      let i = l - 1;
      for (let j = l; j < r; j++) {
        const take = a[j] <= pivot;
        if (take) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
        }
        if (steps.length < 120) {
          steps.push({
            stepIndex: steps.length,
            title: `Phân hoạch [${l}..${r}], Pivot = ${pivot}`,
            description: take
              ? `a[${j}] = ${a[i]} ≤ ${pivot} ⇒ Đổi chỗ vào vùng nhỏ hơn (i=${i}).`
              : `a[${j}] = ${a[j]} > ${pivot} ⇒ Giữ nguyên bên phải.`,
            statusTag: take ? 'update' : 'compare',
            variables: [
              { name: 'Đoạn', value: `[${l}..${r}]` },
              { name: 'Pivot', value: String(pivot), highlight: 'info' },
              { name: 'i, j', value: `${i}, ${j}` }
            ],
            state: { mode, arr: [...a], l, r, pivotIdx: r, iPtr: i, jPtr: j, sortedFlags: [...sortedFlags] }
          });
        }
      }
      [a[i + 1], a[r]] = [a[r], a[i + 1]];
      const pPos = i + 1;
      sortedFlags[pPos] = true;
      if (steps.length < 120) {
        steps.push({
          stepIndex: steps.length,
          title: `Đặt Pivot ${pivot} vào đúng vị trí index = ${pPos}`,
          description: `Mọi phần tử bên trái [${l}..${pPos - 1}] ≤ ${pivot}, bên phải [${pPos + 1}..${r}] > ${pivot}.`,
          statusTag: 'update',
          variables: [{ name: 'Chốt đúng chỗ', value: `idx ${pPos} (${pivot})`, highlight: 'success' }],
          state: { mode, arr: [...a], l, r, pivotIdx: pPos, iPtr: pPos, jPtr: -1, sortedFlags: [...sortedFlags] }
        });
      }
      qs(l, pPos - 1);
      qs(pPos + 1, r);
    };

    qs(0, a.length - 1);
    steps.push({
      stepIndex: steps.length,
      title: 'Hoàn tất QuickSort!',
      description: `Mảng đã được sắp xếp tăng dần: [${a.join(', ')}].`,
      statusTag: 'done',
      variables: [{ name: 'Kết quả', value: `[${a.join(', ')}]`, highlight: 'success' }],
      state: { mode, arr: [...a], l: 0, r: a.length - 1, pivotIdx: -1, iPtr: -1, jPtr: -1, sortedFlags: a.map(() => true) }
    });
    return steps;
  }

  // MergeSort
  const a = [...arr];
  steps.push({
    stepIndex: 0,
    title: 'Khởi tạo MergeSort O(N log N)',
    description: `Chia mảng N = ${a.length} thành các nửa và trộn hai dãy đã sắp xếp.`,
    statusTag: 'init',
    variables: [{ name: 'Mảng', value: `[${a.join(', ')}]` }],
    state: { mode, arr: [...a], l: 0, r: a.length - 1, mid: -1, sortedFlags: a.map(() => false) }
  });

  const ms = (l: number, r: number) => {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    ms(l, mid);
    ms(mid + 1, r);

    const left = a.slice(l, mid + 1);
    const right = a.slice(mid + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) a[k++] = left[i++];
      else a[k++] = right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];

    steps.push({
      stepIndex: steps.length,
      title: `Trộn (Merge) [${l}..${mid}] và [${mid + 1}..${r}]`,
      description: `Kết quả đoạn [${l}..${r}] sau khi trộn: [${a.slice(l, r + 1).join(', ')}].`,
      statusTag: 'update',
      variables: [
        { name: 'Đoạn trộn', value: `[${l}..${r}]`, highlight: 'info' },
        { name: 'Dãy con', value: `[${a.slice(l, r + 1).join(', ')}]`, highlight: 'success' }
      ],
      state: { mode, arr: [...a], l, r, mid, sortedFlags: a.map((_, idx) => l === 0 && r === a.length - 1 && idx <= r) }
    });
  };
  ms(0, a.length - 1);

  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn tất MergeSort!',
    description: `Mảng đã sắp xếp tăng dần ổn định: [${a.join(', ')}].`,
    statusTag: 'done',
    variables: [{ name: 'Kết quả', value: `[${a.join(', ')}]`, highlight: 'success' }],
    state: { mode, arr: [...a], l: 0, r: a.length - 1, mid: -1, sortedFlags: a.map(() => true) }
  });

  return steps;
}

// =====================================================================
// 8. CHẶT NHỊ PHÂN (ARRAY & BINARY SEARCH ON ANSWER)
// =====================================================================
export function generateBinarySearchSteps(
  rawArr: number[],
  target: number,
  mode: 'array' | 'answer',
  kParts: number
): VizStep[] {
  const steps: VizStep[] = [];

  if (mode === 'array') {
    const arr = [...(rawArr.length ? rawArr : [2, 5, 8, 12, 16, 23, 38, 56, 72, 91])]
      .slice(0, 16)
      .sort((a, b) => a - b);
    let lo = 0;
    let hi = arr.length - 1;
    let ansIdx = -1;

    steps.push({
      stepIndex: 0,
      title: `Khởi tạo Tìm kiếm Nhị phân (lower_bound ≥ ${target})`,
      description: `Tìm phần tử đầu tiên ≥ ${target} trên mảng đã sắp xếp gồm ${arr.length} phần tử trong O(log N).`,
      statusTag: 'init',
      variables: [
        { name: 'Target', value: String(target) },
        { name: 'lo, hi', value: `[${lo}, ${hi}]` }
      ],
      state: { mode: 'array', arr, target, lo, hi, mid: -1, ansIdx: -1 }
    });

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const ok = arr[mid] >= target;
      if (ok) ansIdx = mid;

      steps.push({
        stepIndex: steps.length,
        title: `mid = ${mid}: So sánh a[${mid}] = ${arr[mid]} với ${target}`,
        description: ok
          ? `a[${mid}] = ${arr[mid]} ≥ ${target} (Thỏa mãn!). Lưu ứng viên ans = ${mid}, thu hẹp về nửa trái [${lo}..${mid - 1}] để tìm vị trí nhỏ hơn nữa.`
          : `a[${mid}] = ${arr[mid]} < ${target}. Loại bỏ toàn bộ nửa trái [${lo}..${mid}], dịch lo = ${mid + 1}.`,
        statusTag: ok ? 'update' : 'discard',
        variables: [
          { name: 'lo, mid, hi', value: `${lo}, ${mid}, ${hi}`, highlight: 'active' },
          { name: `a[mid]`, value: String(arr[mid]), highlight: ok ? 'success' : 'warn' },
          { name: 'ans (lower_bound)', value: ansIdx === -1 ? 'Chưa có' : `idx ${ansIdx} (${arr[ansIdx]})` }
        ],
        state: { mode: 'array', arr, target, lo, hi, mid, ansIdx }
      });

      if (ok) hi = mid - 1;
      else lo = mid + 1;
    }

    steps.push({
      stepIndex: steps.length,
      title:
        ansIdx !== -1
          ? `Kết quả lower_bound(${target}): index = ${ansIdx} (giá trị ${arr[ansIdx]})`
          : `Mọi phần tử đều nhỏ hơn ${target}`,
      description:
        ansIdx !== -1
          ? `Đã định vị phần tử đầu tiên ≥ ${target} tại chỉ số ${ansIdx} (${arr[ansIdx]}).`
          : `Không tồn tại phần tử ≥ ${target} trong mảng.`,
      statusTag: 'done',
      variables: [{ name: 'Kết quả', value: ansIdx !== -1 ? `idx ${ansIdx} (${arr[ansIdx]})` : 'N', highlight: 'success' }],
      state: { mode: 'array', arr, target, lo, hi, mid: ansIdx, ansIdx }
    });
    return steps;
  }

  // Binary Search on Answer: Partition array into <= K segments minimizing max segment sum
  const arr = (rawArr.length ? rawArr : [7, 2, 5, 10, 8, 4, 6]).map((x) => Math.max(1, x)).slice(0, 12);
  const K = Math.max(1, Math.min(arr.length, kParts || 3));
  const maxVal = Math.max(...arr);
  const sumVal = arr.reduce((s, x) => s + x, 0);

  const countSegments = (limit: number) => {
    let segs = 1;
    let cur = 0;
    const groups: number[][] = [[]];
    for (const x of arr) {
      if (cur + x > limit) {
        segs++;
        cur = x;
        groups.push([x]);
      } else {
        cur += x;
        groups[groups.length - 1].push(x);
      }
    }
    return { segs, groups };
  };

  // Precompute predicate curve points for graph visualization
  const curveSamplePoints: { x: number; segs: number; ok: boolean }[] = [];
  const span = Math.max(1, sumVal - maxVal);
  const stepSize = Math.max(1, Math.floor(span / 16));
  for (let x = maxVal; x <= sumVal; x += stepSize) {
    const { segs } = countSegments(x);
    curveSamplePoints.push({ x, segs, ok: segs <= K });
  }
  if (curveSamplePoints[curveSamplePoints.length - 1]?.x !== sumVal) {
    const { segs } = countSegments(sumVal);
    curveSamplePoints.push({ x: sumVal, segs, ok: segs <= K });
  }

  let lo = maxVal;
  let hi = sumVal;
  let bestAns = sumVal;
  const testedPoints: { mid: number; segs: number; ok: boolean }[] = [];

  steps.push({
    stepIndex: 0,
    title: `Chặt nhị phân Kết quả: Chia mảng thành tối đa K = ${K} đoạn`,
    description: `Tìm ngưỡng tổng lớn nhất nhỏ nhất trên đoạn kết quả [${lo}..${hi}]. Hàm f(mid) = số đoạn cần dùng là hàm đơn điệu giảm!`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [
      { name: 'K tối đa', value: String(K) },
      { name: 'Khoảng [lo, hi]', value: `[${lo}, ${hi}]` }
    ],
    state: {
      mode: 'answer',
      arr,
      K,
      lo,
      hi,
      mid: Math.floor((lo + hi) / 2),
      bestAns,
      groups: [],
      segsNeeded: null,
      curveSamplePoints,
      testedPoints: []
    }
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const { segs, groups } = countSegments(mid);
    const ok = segs <= K;
    testedPoints.push({ mid, segs, ok });
    if (ok) bestAns = mid;

    steps.push({
      stepIndex: steps.length,
      title: `Thử ngưỡng mid = ${mid}: Cần ${segs} đoạn (${ok ? `≤ ${K} · HỢP LỆ` : `> ${K} · KHÔNG ĐỦ`})`,
      description: ok
        ? `Với sức chứa tối đa ${mid}, chỉ cần ${segs} đoạn ≤ ${K} ⇒ Đạt! Lưu ans = ${mid} và thử giảm tiếp hi = ${mid - 1}.`
        : `Với sức chứa ${mid}, bị chia thành ${segs} đoạn > ${K} ⇒ Quá nhỏ! Bắt buộc tăng lo = ${mid + 1}.`,
      formula: `f(${mid}) = ${segs} đoạn ${ok ? '≤' : '>'} K (${K})`,
      activeCodeLine: ok ? 4 : 5,
      statusTag: ok ? 'update' : 'discard',
      variables: [
        { name: 'lo, mid, hi', value: `${lo}, ${mid}, ${hi}`, highlight: 'active' },
        { name: 'f(mid) số đoạn', value: `${segs} / ${K}`, highlight: ok ? 'success' : 'warn' },
        { name: 'ans tốt nhất', value: String(bestAns), highlight: 'success' }
      ],
      state: {
        mode: 'answer',
        arr,
        K,
        lo,
        hi,
        mid,
        bestAns,
        groups,
        segsNeeded: segs,
        curveSamplePoints,
        testedPoints: [...testedPoints]
      }
    });

    if (ok) hi = mid - 1;
    else lo = mid + 1;
  }

  const finalSplit = countSegments(bestAns);
  steps.push({
    stepIndex: steps.length,
    title: `Kết quả tối ưu: Ngưỡng tổng lớn nhất = ${bestAns}`,
    description: `Cách chia tối ưu với ${finalSplit.segs} đoạn (≤ ${K}): ${finalSplit.groups
      .map((g) => `[${g.join('+')}=${g.reduce((a, b) => a + b, 0)}]`)
      .join(' | ')}.`,
    statusTag: 'done',
    variables: [{ name: 'Đáp án tối ưu', value: String(bestAns), highlight: 'success' }],
    state: {
      mode: 'answer',
      arr,
      K,
      lo,
      hi,
      mid: bestAns,
      bestAns,
      groups: finalSplit.groups,
      segsNeeded: finalSplit.segs,
      curveSamplePoints,
      testedPoints: [...testedPoints]
    }
  });

  return steps;
}

// =====================================================================
// 9. SỐ HỌC: SÀNG ERATOSTHENES 2..N & LŨY THỪA NHỊ PHÂN
// =====================================================================
export function generateNumberSieveSteps(
  limitN: number,
  mode: 'sieve' | 'binpow',
  baseA = 3,
  expB = 13,
  modM = 1000
): VizStep[] {
  const steps: VizStep[] = [];
  if (mode === 'binpow') {
    let a = Math.max(1, baseA) % Math.max(2, modM);
    let b = Math.max(0, expB);
    const m = Math.max(2, modM);
    let res = 1 % m;
    const origA = baseA;
    const origB = b;
    const bits = b.toString(2).split('').reverse();

    steps.push({
      stepIndex: 0,
      title: `Tính ${origA}^${origB} mod ${m} bằng Lũy thừa Nhị phân`,
      description: `Biểu diễn số mũ ${origB} = (${origB.toString(2)})₂. Ở mỗi bit = 1, nhân res với lũy thừa cơ số a hiện tại.`,
      statusTag: 'init',
      variables: [
        { name: 'res', value: String(res) },
        { name: 'a', value: String(a) },
        { name: 'b (nhị phân)', value: origB.toString(2) }
      ],
      state: { mode: 'binpow', bits, bitIdx: -1, res, a, b, m, origA, origB }
    });

    let bitIdx = 0;
    while (b > 0) {
      const odd = (b & 1) === 1;
      const prevRes = res;
      const prevA = a;
      if (odd) res = (res * a) % m;
      b = b >> 1;
      const nextA = (a * a) % m;

      steps.push({
        stepIndex: steps.length,
        title: `Bit thứ ${bitIdx} = ${odd ? '1' : '0'}: ${odd ? `Nhân res = (${prevRes} × ${prevA}) mod ${m} = ${res}` : 'Bit 0, giữ nguyên res'}`,
        description: `Bình phương cơ số: a ← (${prevA}²) mod ${m} = ${nextA}; dịch phải b còn ${b}.`,
        formula: odd ? `res = (${prevRes} · ${prevA}) mod ${m} = ${res}` : `a = (${prevA}²) mod ${m} = ${nextA}`,
        statusTag: odd ? 'update' : 'compare',
        variables: [
          { name: `Bit[${bitIdx}]`, value: odd ? '1 (NHÂN)' : '0 (BỎ QUA)', highlight: odd ? 'success' : 'info' },
          { name: 'res', value: String(res), highlight: 'success' },
          { name: 'a kế tiếp', value: String(nextA) },
          { name: 'b còn lại', value: String(b) }
        ],
        state: { mode: 'binpow', bits, bitIdx, res, a: nextA, b, m, origA, origB, prevA }
      });
      a = nextA;
      bitIdx++;
    }

    steps.push({
      stepIndex: steps.length,
      title: `Kết quả: ${origA}^${origB} mod ${m} = ${res}`,
      description: `Hoàn tất chỉ sau ${bitIdx} bước nhân O(log b)!`,
      statusTag: 'done',
      variables: [{ name: 'Kết quả', value: String(res), highlight: 'success' }],
      state: { mode: 'binpow', bits, bitIdx: bits.length - 1, res, a, b: 0, m, origA, origB }
    });
    return steps;
  }

  // Sieve of Eratosthenes on 2..N
  const N = Math.max(10, Math.min(60, limitN || 36));
  const status: ('unmarked' | 'prime' | 'crossed' | 'active')[] = Array(N + 1).fill('unmarked');
  status[0] = 'crossed';
  status[1] = 'crossed';

  steps.push({
    stepIndex: 0,
    title: `Khởi tạo Sàng Eratosthenes từ 2 đến ${N}`,
    description: `Ban đầu coi mọi số 2..${N} là ứng viên nguyên tố. Lần lượt chọn số nguyên tố p ≤ √${N} ≈ ${Math.floor(Math.sqrt(N))} để gạch bội từ p².`,
    activeCodeLine: 0,
    statusTag: 'init',
    variables: [{ name: 'N', value: String(N) }],
    state: { mode: 'sieve', N, status: [...status], p: null, currentMult: null }
  });

  for (let p = 2; p * p <= N; p++) {
    if (status[p] === 'crossed') continue;
    status[p] = 'prime';
    const crossedNow: number[] = [];
    for (let m = p * p; m <= N; m += p) {
      if (status[m] !== 'crossed') {
        status[m] = 'crossed';
        crossedNow.push(m);
      }
    }
    steps.push({
      stepIndex: steps.length,
      title: `p = ${p} là Số nguyên tố ⇒ Gạch bội từ p² = ${p * p}`,
      description:
        crossedNow.length > 0
          ? `Gạch các hợp số là bội của ${p}: [${crossedNow.join(', ')}].`
          : `Các bội của ${p} đã bị gạch từ những số nguyên tố nhỏ hơn trước đó.`,
      activeCodeLine: 4,
      statusTag: 'update',
      variables: [
        { name: 'p đang xét', value: String(p), highlight: 'success' },
        { name: 'Bắt đầu gạch', value: `p² = ${p * p}` },
        { name: 'Số vừa gạch', value: crossedNow.join(', ') || 'Không có' }
      ],
      state: { mode: 'sieve', N, status: [...status], p, currentMult: crossedNow }
    });
  }

  const primes: number[] = [];
  for (let i = 2; i <= N; i++) {
    if (status[i] !== 'crossed') {
      status[i] = 'prime';
      primes.push(i);
    }
  }

  steps.push({
    stepIndex: steps.length,
    title: `Hoàn tất Sàng: Có ${primes.length} số nguyên tố ≤ ${N}`,
    description: `Danh sách số nguyên tố: ${primes.join(', ')}.`,
    statusTag: 'done',
    variables: [{ name: 'Số nguyên tố', value: `${primes.length} số`, highlight: 'success' }],
    state: { mode: 'sieve', N, status: [...status], p: null, currentMult: null, primes }
  });

  return steps;
}
