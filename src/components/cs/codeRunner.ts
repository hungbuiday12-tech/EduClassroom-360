import { CodeLanguage, CodingProblem, TestCase, TestResult } from '../../types';

/**
 * Standard ICPC / IOI / VNOI output comparator:
 * - Normalizes CRLF -> LF
 * - Ignores trailing spaces per line and trailing empty lines
 * - Compares token-by-token
 * - Tolerates floating-point precision differences (< 1e-5)
 * - Tolerates case differences for YES/NO/TRUE/FALSE
 */
export function compareOutputs(actual: string, expected: string): boolean {
  if (actual === expected) return true;

  const normAct = (actual ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const normExp = (expected ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  if (normAct === normExp) return true;

  const actLines = normAct.split('\n').map((l) => l.trimEnd()).filter((l) => l.length > 0);
  const expLines = normExp.split('\n').map((l) => l.trimEnd()).filter((l) => l.length > 0);

  if (actLines.length === expLines.length && actLines.length > 0) {
    const allLinesMatch = actLines.every((actLine, idx) => {
      const expLine = expLines[idx];
      if (actLine === expLine) return true;
      if (
        /^(yes|no|true|false)$/i.test(expLine.trim()) &&
        actLine.trim().toLowerCase() === expLine.trim().toLowerCase()
      ) {
        return true;
      }
      const numAct = Number(actLine);
      const numExp = Number(expLine);
      if (!Number.isNaN(numAct) && !Number.isNaN(numExp) && actLine.trim() !== '' && expLine.trim() !== '') {
        return Math.abs(numAct - numExp) < 1e-5;
      }
      return false;
    });
    if (allLinesMatch) return true;
  }

  const actTokens = normAct.split(/\s+/).filter(Boolean);
  const expTokens = normExp.split(/\s+/).filter(Boolean);

  if (actTokens.length === expTokens.length && expTokens.length > 0) {
    return actTokens.every((tok, idx) => {
      const exp = expTokens[idx];
      if (tok === exp) return true;
      if (/^(yes|no|true|false)$/i.test(exp) && tok.toLowerCase() === exp.toLowerCase()) {
        return true;
      }
      const n1 = Number(tok);
      const n2 = Number(exp);
      if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
        return Math.abs(n1 - n2) < 1e-5;
      }
      return false;
    });
  }

  return false;
}

const MAX_STEPS = 2_000_000;

// ============================================================================
// PYTHON 3 BROWSER TRANSPILER & SANDBOX
// ============================================================================

function findClosingParen(src: string, openIdx: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevel(expr: string, delim: string = ','): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
    } else if (depth === 0 && expr.slice(i, i + delim.length) === delim) {
      parts.push(expr.slice(start, i).trim());
      start = i + delim.length;
      i += delim.length - 1;
    }
  }
  const tail = expr.slice(start).trim();
  if (tail.length > 0 || parts.length > 0) parts.push(tail);
  return parts;
}

function stripPythonCommentsAndProtectStrings(code: string): {
  lines: string[];
  strings: string[];
} {
  const strings: string[] = [];
  const rawLines = code.replace(/\r\n/g, '\n').split('\n');
  const outLines: string[] = [];
  let inTriple: string | null = null;

  for (const line of rawLines) {
    let out = '';
    let i = 0;
    while (i < line.length) {
      if (inTriple) {
        if (line.slice(i, i + 3) === inTriple) {
          inTriple = null;
          i += 3;
        } else {
          i++;
        }
        continue;
      }
      const ch = line[i];
      if ((line[i] === 'f' || line[i] === 'r') && (line[i + 1] === '"' || line[i + 1] === "'")) {
        const prefix = line[i];
        const q = line[i + 1];
        let j = i + 2;
        while (j < line.length) {
          if (line[j] === '\\') {
            j += 2;
            continue;
          }
          if (line[j] === q) break;
          j++;
        }
        const literal = line.slice(i, j + 1);
        const token = `__PYSTR_${strings.length}__`;
        strings.push(convertPyStringLiteral(prefix, q, literal.slice(2, -1)));
        out += token;
        i = j + 1;
        continue;
      }
      if (line.slice(i, i + 3) === '"""' || line.slice(i, i + 3) === "'''") {
        inTriple = line.slice(i, i + 3);
        i += 3;
        continue;
      }
      if (ch === '"' || ch === "'") {
        const q = ch;
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === '\\') {
            j += 2;
            continue;
          }
          if (line[j] === q) break;
          j++;
        }
        const rawInner = line.slice(i + 1, j);
        const token = `__PYSTR_${strings.length}__`;
        strings.push(convertPyStringLiteral('', q, rawInner));
        out += token;
        i = j + 1;
        continue;
      }
      if (ch === '#') {
        break;
      }
      out += ch;
      i++;
    }
    outLines.push(out);
  }
  return { lines: outLines, strings };
}

function convertPyStringLiteral(prefix: string, _q: string, inner: string): string {
  if (prefix === 'f') {
    const escaped = inner.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    const withInterp = escaped.replace(/\{([^{}]+)\}/g, (_m, expr) => {
      return '${' + transformPyExpr(expr.trim()) + '}';
    });
    return '`' + withInterp + '`';
  }
  const safe = inner.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\\\\([ntr\\'"0])/g, '\\$1');
  return `"${safe}"`;
}

function transformPyExpr(expr: string): string {
  let e = expr.trim();
  if (!e) return e;

  // Convert Python tuple literals like (0, 1) or (dist[v], v) not preceded by fn/keyword into arrays [a, b]
  e = convertPyTupleLiterals(e);

  // Handle Python conditional expression: a if cond else b (anywhere top-level or inside parens)
  e = convertPyTernary(e);

  // List comprehensions: [body for var in iter (if cond)?]
  e = convertPyComprehensions(e);

  // List multiplication: [val] * (expr) or [val] * n -> __pyListMul([val], expr)
  e = e.replace(/(\[[^\[\]]*\])\s*\*\s*(\([^)]*(?:\([^)]*\)[^)]*)*\)|[A-Za-z0-9_]+(?:\s*[+\-*]\s*[A-Za-z0-9_]+)*)/g, '__pyListMul($1, $2)');

  // Tuples / Python literals
  e = e
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\s+in\b/g, '__NOT_IN__')
    .replace(/\bnot\s+([A-Za-z_][A-Za-z0-9_.]*(?:\[[^\]]+\]|\([^)]*\))*)/g, '!__pyBool($1)')
    .replace(/\bnot\b/g, '!')
    .replace(/__name__\s*==\s*__PYSTR_(\d+)__/g, 'true')
    .replace(/float\(__PYSTR_(\d+)__\)/g, 'Infinity')
    .replace(/sys\.stdin\.read\(\)/g, '__stdinRead()')
    .replace(/map\s*\(\s*(int|float|str)\s*,/g, '__pyMap($1,')
    .replace(/\bdivmod\s*\(/g, '__pyDivmod(')
    .replace(/\.isalnum\(\)/g, '.__pyIsAlnum()')
    .replace(/\.isalpha\(\)/g, '.__pyIsAlpha()')
    .replace(/\.isdigit\(\)/g, '.__pyIsDigit()')
    .replace(/\.lower\(\)/g, '.toLowerCase()')
    .replace(/\.upper\(\)/g, '.toUpperCase()')
    .replace(/\.strip\(\)/g, '.trim()')
    .replace(/\.split\(\)/g, '.trim().split(/\\s+/).filter(Boolean)')
    .replace(/\.append\(/g, '.push(')
    .replace(/\.extend\(/g, '.push(...')
    .replace(/\.join\(/g, '.__PY_JOIN__(')
    .replace(/\.get\(/g, '.__pyDictGet(')
    .replace(/\.items\(\)/g, '.__pyItems()')
    .replace(/\.keys\(\)/g, '.__pyKeys()')
    .replace(/\.values\(\)/g, '.__pyValues()');

  // Nesting-safe resolution of .__PY_JOIN__(...), .__pyDictGet(...), .__pyItems(), .__pyKeys(), .__pyValues(), .__pyIs*()
  e = resolvePyDotHelpers(e);

  // Python 'x in y' and 'x __NOT_IN__ y'
  e = e.replace(/([A-Za-z0-9_.()\[\]]+)\s+__NOT_IN__\s+([A-Za-z0-9_.()\[\]]+)/g, '!__pyIn($1, $2)');
  e = e.replace(/([A-Za-z0-9_.()\[\]]+)\s+in\s+(\([^)]+\)|\[[^\]]+\]|[A-Za-z0-9_.()\[\]]+)/g, '__pyIn($1, $2)');

  // Python negative indexing and slicing: obj[a:b:c] or obj[-1]
  e = convertPySlices(e);

  // Floor division // and power ** (including -10**18)
  e = convertFloorDivAndPow(e);

  // Structural == / != equality (so list == list and tuple == tuple work)
  e = convertPyEquality(e);

  // List concatenation `[0] + [...]` -> `__pyConcat([0], [...])`
  e = convertPyListConcat(e);

  // Convert print(a, b, sep=..., end=...)
  e = convertPyPrintArgs(e);

  return e;
}

function extractReceiverRange(src: string, dotIdx: number): number {
  let i = dotIdx - 1;
  while (i >= 0) {
    const ch = src[i];
    if (ch === ')' || ch === ']') {
      const openCh = ch === ')' ? '(' : '[';
      let d = 1;
      i--;
      while (i >= 0 && d > 0) {
        if (src[i] === ch) d++;
        else if (src[i] === openCh) d--;
        i--;
      }
      continue;
    }
    if (/[A-Za-z0-9_.]/.test(ch)) {
      i--;
      continue;
    }
    break;
  }
  return i + 1;
}

function resolvePyDotHelpers(expr: string): string {
  let e = expr;
  const markers: { marker: string; build: (recv: string, args: string) => string }[] = [
    { marker: '.__PY_JOIN__(', build: (recv, args) => `__pyJoin(${recv}, ${args})` },
    { marker: '.__pyDictGet(', build: (recv, args) => `__pyGet(${recv}, ${args})` },
    { marker: '.__pyItems(', build: (recv) => `__pyEntries(${recv})` },
    { marker: '.__pyKeys(', build: (recv) => `__pyKeys(${recv})` },
    { marker: '.__pyValues(', build: (recv) => `__pyValues(${recv})` },
    { marker: '.__pyIsAlnum(', build: (recv) => `/^[a-zA-Z0-9]+$/.test(${recv})` },
    { marker: '.__pyIsAlpha(', build: (recv) => `/^[a-zA-Z]+$/.test(${recv})` },
    { marker: '.__pyIsDigit(', build: (recv) => `/^[0-9]+$/.test(${recv})` }
  ];

  let changed = true;
  let safety = 0;
  while (changed && safety++ < 30) {
    changed = false;
    for (const { marker, build } of markers) {
      const idx = e.indexOf(marker);
      if (idx === -1) continue;
      const parenOpen = idx + marker.length - 1;
      const parenClose = findClosingParen(e, parenOpen);
      if (parenClose === -1) continue;
      const recvStart = extractReceiverRange(e, idx);
      const recv = e.slice(recvStart, idx);
      const args = e.slice(parenOpen + 1, parenClose);
      e = e.slice(0, recvStart) + build(recv, args) + e.slice(parenClose + 1);
      changed = true;
      break;
    }
  }
  return e;
}

function convertPyListConcat(expr: string): string {
  // Handle top-level `[a] + b` or `a + [b]` or `a + __pyIter(...)` where `+` is Python list concatenation
  if (!expr.includes('+')) return expr;
  const parts = splitTopLevel(expr, '+');
  if (parts.length < 2) return expr;
  const looksLikeList = (s: string) => {
    const t = s.trim();
    return (
      t.startsWith('[') ||
      t.startsWith('__pyIter(') ||
      t.startsWith('__pyListMul(') ||
      t.startsWith('__pySlice(') ||
      t.startsWith('list(')
    );
  };
  if (!parts.some(looksLikeList)) return expr;
  return parts.reduce((acc, cur) => `__pyConcat(${acc}, ${cur})`);
}

function convertPyTupleLiterals(expr: string): string {
  // Replace (...) not preceded by identifier char when inner has top-level comma and not 'for ' inside
  let out = '';
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === '(') {
      const prevChar = i > 0 ? expr[i - 1] : '';
      const isCall = /[A-Za-z0-9_.]/.test(prevChar);
      const close = findClosingParen(expr, i);
      if (close !== -1) {
        const inner = expr.slice(i + 1, close);
        const transformedInner = convertPyTupleLiterals(inner);
        if (!isCall && splitTopLevel(inner).length > 1 && !/\bfor\b/.test(inner)) {
          out += `[${transformedInner}]`;
        } else {
          out += `(${transformedInner})`;
        }
        i = close + 1;
        continue;
      }
    }
    out += expr[i];
    i++;
  }
  return out;
}

function convertPyTernary(expr: string): string {
  // Recursively handle conditional expressions inside parens too, e.g. str(dist[i] if x else -1)
  let work = expr;
  // First recurse on top-level parenthesized calls if any contain ` if ` and ` else `
  if (work.includes(' if ') && work.includes(' else ')) {
    let out = '';
    let i = 0;
    while (i < work.length) {
      if (work[i] === '(') {
        const close = findClosingParen(work, i);
        if (close !== -1) {
          const inner = work.slice(i + 1, close);
          if (inner.includes(' if ') && inner.includes(' else ')) {
            out += `(${convertPyTernary(inner)})`;
            i = close + 1;
            continue;
          }
        }
      }
      out += work[i];
      i++;
    }
    work = out;
  }

  let depth = 0;
  let ifIdx = -1;
  let elseIdx = -1;
  for (let i = 0; i < work.length; i++) {
    const ch = work[i];
    if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth--;
    else if (depth === 0) {
      if (ifIdx === -1 && work.slice(i, i + 4) === ' if ') {
        ifIdx = i;
      } else if (ifIdx !== -1 && elseIdx === -1 && work.slice(i, i + 6) === ' else ') {
        elseIdx = i;
        break;
      }
    }
  }
  if (ifIdx !== -1 && elseIdx !== -1 && !work.startsWith('[')) {
    const trueExpr = work.slice(0, ifIdx).trim();
    const condExpr = work.slice(ifIdx + 4, elseIdx).trim();
    const falseExpr = work.slice(elseIdx + 6).trim();
    return `((${transformPyExpr(condExpr)}) ? (${transformPyExpr(trueExpr)}) : (${transformPyExpr(falseExpr)}))`;
  }
  return work;
}

function convertPyEquality(expr: string): string {
  // Convert top-level `lhs == rhs` and `lhs != rhs` to __pyEq(lhs, rhs) / !__pyEq(lhs, rhs)
  if (!expr.includes('==') && !expr.includes('!=')) return expr;
  // Avoid breaking inside helper calls already containing ===
  let e = expr;
  const replaceOp = (op: '==' | '!=') => {
    let safety = 0;
    while (safety++ < 20) {
      let found = -1;
      let depth = 0;
      for (let i = 0; i < e.length - 1; i++) {
        const ch = e[i];
        if (ch === '(' || ch === '[' || ch === '{') depth++;
        else if (ch === ')' || ch === ']' || ch === '}') depth--;
        else if (e.slice(i, i + 2) === op && e[i + 2] !== '=' && e[i - 1] !== '=' && e[i - 1] !== '!') {
          found = i;
          break;
        }
      }
      if (found === -1) break;
      // Extract lhs up to && || ( , ? : [ ;
      let l = found - 1;
      let d = 0;
      while (l >= 0) {
        const c = e[l];
        if (c === ')' || c === ']') d++;
        else if (c === '(' || c === '[') {
          if (d === 0) break;
          d--;
        } else if (d === 0 && (e.slice(l - 1, l + 1) === '&&' || e.slice(l - 1, l + 1) === '||' || /[,?;:]/.test(c))) {
          break;
        }
        l--;
      }
      const lhs = e.slice(l + 1, found).trim();
      let r = found + 2;
      d = 0;
      while (r < e.length) {
        const c = e[r];
        if (c === '(' || c === '[') d++;
        else if (c === ')' || c === ']') {
          if (d === 0) break;
          d--;
        } else if (d === 0 && (e.slice(r, r + 2) === '&&' || e.slice(r, r + 2) === '||' || /[,?;:]/.test(c))) {
          break;
        }
        r++;
      }
      const rhs = e.slice(found + 2, r).trim();
      if (!lhs || !rhs) break;
      const call = op === '==' ? `__pyEq(${lhs}, ${rhs})` : `!__pyEq(${lhs}, ${rhs})`;
      e = e.slice(0, l + 1) + ' ' + call + ' ' + e.slice(r);
    }
  };
  replaceOp('==');
  replaceOp('!=');
  return e;
}

function convertPyComprehensions(expr: string): string {
  // Match [body for var in iter (if cond)?] (single nested-safe pass)
  let out = '';
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === '[') {
      let depth = 0;
      let j = i;
      for (; j < expr.length; j++) {
        if (expr[j] === '[' || expr[j] === '(' || expr[j] === '{') depth++;
        else if (expr[j] === ']' || expr[j] === ')' || expr[j] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      if (j < expr.length) {
        const inner = expr.slice(i + 1, j).trim();
        const forMatch = inner.match(/^(.+?)\s+for\s+([A-Za-z_][A-Za-z0-9_,\s]*?)\s+in\s+(.+)$/);
        if (forMatch) {
          const body = forMatch[1].trim();
          const varPart = forMatch[2].trim();
          let rest = forMatch[3].trim();
          let cond: string | null = null;
          // Top-level ' if '
          let d = 0;
          for (let k = 0; k < rest.length; k++) {
            if (rest[k] === '(' || rest[k] === '[' || rest[k] === '{') d++;
            else if (rest[k] === ')' || rest[k] === ']' || rest[k] === '}') d--;
            else if (d === 0 && rest.slice(k, k + 4) === ' if ') {
              cond = rest.slice(k + 4).trim();
              rest = rest.slice(0, k).trim();
              break;
            }
          }
          const iterJs = transformPyExpr(rest);
          const argDecl = varPart.includes(',') ? `([${varPart}])` : varPart;
          const bodyJs = transformPyExpr(body);
          if (cond) {
            const condJs = transformPyExpr(cond);
            out += `__pyIter(${iterJs}).filter(${argDecl} => (${condJs})).map(${argDecl} => (${bodyJs}))`;
          } else {
            out += `__pyIter(${iterJs}).map(${argDecl} => (${bodyJs}))`;
          }
          i = j + 1;
          continue;
        }
      }
    }
    out += expr[i];
    i++;
  }
  return out;
}

function convertPySlices(expr: string): string {
  // Handle obj[start:stop:step] and obj[-1]
  let res = expr;
  res = res.replace(
    /([A-Za-z0-9_)\]]+)\[([^\[\]]*:[^\[\]]*)\]/g,
    (_m, target, sliceExpr) => {
      const parts = sliceExpr.split(':').map((s: string) => s.trim());
      const a = parts[0] || 'null';
      const b = parts[1] || 'null';
      const c = parts[2] || 'null';
      return `__pySlice(${target}, ${a}, ${b}, ${c})`;
    }
  );
  // Negative index read like arr[-1] (but not assignment target handled separately)
  res = res.replace(/([A-Za-z0-9_)]+)\[(-\d+)\]/g, '__pyAt($1, $2)');
  return res;
}

function convertFloorDivAndPow(expr: string): string {
  let e = expr;
  // JS forbids unary - before ** (e.g. -10**18); Python parses -10**18 as -(10**18)
  e = e.replace(/(^|[\s([=+\-*,:?])-\s*(\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_.]*)\s*\*\*\s*(\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_.]*|\([^)]+\))/g, '$1-(($2)**($3))');
  // Convert a // b to Math.floor((a) / (b))
  while (e.includes('//')) {
    const idx = e.indexOf('//');
    // Extract left operand
    let l = idx - 1;
    while (l >= 0 && e[l] === ' ') l--;
    let lEnd = l + 1;
    let d = 0;
    while (l >= 0) {
      const c = e[l];
      if (c === ')' || c === ']') d++;
      else if (c === '(' || c === '[') {
        if (d === 0) break;
        d--;
      } else if (d === 0 && /[+\-*%<>=!&|,?:;]/.test(c)) {
        break;
      }
      l--;
    }
    const leftOp = e.slice(l + 1, lEnd).trim();

    let r = idx + 2;
    while (r < e.length && e[r] === ' ') r++;
    let rStart = r;
    d = 0;
    if (e[r] === '-' || e[r] === '+') r++;
    while (r < e.length) {
      const c = e[r];
      if (c === '(' || c === '[') d++;
      else if (c === ')' || c === ']') {
        if (d === 0) break;
        d--;
      } else if (d === 0 && /[+\-*%<>=!&|,?:;]/.test(c)) {
        break;
      }
      r++;
    }
    const rightOp = e.slice(rStart, r).trim();
    if (!leftOp || !rightOp) {
      e = e.slice(0, idx) + '/' + e.slice(idx + 2);
    } else {
      e = e.slice(0, l + 1) + `Math.floor((${leftOp}) / (${rightOp}))` + e.slice(r);
    }
  }
  return e;
}

function convertPyPrintArgs(expr: string): string {
  const idx = expr.indexOf('print(');
  if (idx === -1) return expr;
  const close = findClosingParen(expr, idx + 5);
  if (close === -1) return expr;
  const inner = expr.slice(idx + 6, close).trim();
  if (!inner) return expr;
  const args = splitTopLevel(inner);
  const posArgs: string[] = [];
  let sep = '" "';
  let end = '"\\n"';
  for (const arg of args) {
    if (/^sep\s*=/.test(arg)) sep = arg.replace(/^sep\s*=/, '').trim();
    else if (/^end\s*=/.test(arg)) end = arg.replace(/^end\s*=/, '').trim();
    else if (arg.startsWith('*')) posArgs.push(`...__pyIter(${arg.slice(1).trim()})`);
    else posArgs.push(arg);
  }
  const call = `__pyPrint([${posArgs.join(', ')}], ${sep}, ${end})`;
  return expr.slice(0, idx) + call + expr.slice(close + 1);
}

function transpilePythonToJS(code: string): { jsCode: string; strings: string[] } {
  const { lines, strings } = stripPythonCommentsAndProtectStrings(code);
  const indentStack: number[] = [0];
  const jsLines: string[] = [];
  let blockExpectsIndent = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const expanded = rawLine.replace(/\t/g, '    ');
    const trimmed = expanded.trim();
    if (!trimmed) continue;

    // Ignore import lines (built-in support in env)
    if (/^(import|from)\s+/.test(trimmed)) {
      continue;
    }

    const indent = expanded.length - expanded.trimStart().length;

    if (blockExpectsIndent && indent <= indentStack[indentStack.length - 1]) {
      // Single line empty block fallback
      jsLines.push('}');
      indentStack.pop();
      blockExpectsIndent = false;
    }

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('  '.repeat(indentStack.length) + '}');
    }

    if (indent > indentStack[indentStack.length - 1]) {
      indentStack.push(indent);
    }

    const pad = '  '.repeat(Math.max(0, indentStack.length - 1));
    blockExpectsIndent = false;

    if (trimmed === 'pass') {
      continue;
    }
    if (trimmed.startsWith('nonlocal ') || trimmed.startsWith('global ')) {
      continue;
    }

    // Function def
    const defMatch = trimmed.match(/^def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?\s*:$/);
    if (defMatch) {
      const fnName = defMatch[1];
      const rawParams = defMatch[2].trim();
      const params = rawParams
        ? splitTopLevel(rawParams).map((p) => {
            const noType = p.split(':')[0].trim();
            return noType;
          })
        : [];
      jsLines.push(`${pad}function ${fnName}(${params.join(', ')}) {`);
      jsLines.push(`${pad}  if (++__steps > ${MAX_STEPS}) throw new Error("Time Limit Exceeded (TLE)");`);
      blockExpectsIndent = true;
      continue;
    }

    // Class def (simple support like DSU / structs)
    const classMatch = trimmed.match(/^class\s+([A-Za-z_][A-Za-z0-9_]*)(?:\([^)]*\))?\s*:$/);
    if (classMatch) {
      jsLines.push(`${pad}class ${classMatch[1]} {`);
      blockExpectsIndent = true;
      continue;
    }

    // if / elif / else
    if (/^if\s+(.+):$/.test(trimmed)) {
      const cond = trimmed.slice(3, -1).trim();
      jsLines.push(`${pad}if (__pyBool(${transformPyExpr(cond)})) {`);
      blockExpectsIndent = true;
      continue;
    }
    if (/^elif\s+(.+):$/.test(trimmed)) {
      const cond = trimmed.slice(5, -1).trim();
      jsLines.push(`${pad}else if (__pyBool(${transformPyExpr(cond)})) {`);
      blockExpectsIndent = true;
      continue;
    }
    if (/^else\s*:$/.test(trimmed)) {
      jsLines.push(`${pad}else {`);
      blockExpectsIndent = true;
      continue;
    }

    // while
    if (/^while\s+(.+):$/.test(trimmed)) {
      const cond = trimmed.slice(6, -1).trim();
      jsLines.push(`${pad}while (__pyBool(${transformPyExpr(cond)})) {`);
      jsLines.push(`${pad}  if (++__steps > ${MAX_STEPS}) throw new Error("Time Limit Exceeded (TLE)");`);
      blockExpectsIndent = true;
      continue;
    }

    // for var in iterable:
    const forMatch = trimmed.match(/^for\s+([A-Za-z0-9_,\s()]+)\s+in\s+(.+):$/);
    if (forMatch) {
      const varsRaw = forMatch[1].trim().replace(/^\(|\)$/g, '');
      const iterExpr = transformPyExpr(forMatch[2].trim());
      const lhs = varsRaw.includes(',') ? `let [${varsRaw}]` : `let ${varsRaw}`;
      jsLines.push(`${pad}for (${lhs} of __pyIter(${iterExpr})) {`);
      jsLines.push(`${pad}  if (++__steps > ${MAX_STEPS}) throw new Error("Time Limit Exceeded (TLE)");`);
      blockExpectsIndent = true;
      continue;
    }

    // Single-line if statement? e.g., if a > b: return a
    const inlineIf = trimmed.match(/^if\s+([^:]+):\s*(.+)$/);
    if (inlineIf) {
      jsLines.push(`${pad}if (${transformPyExpr(inlineIf[1])}) { ${transformPyStatement(inlineIf[2])} }`);
      continue;
    }

    jsLines.push(`${pad}${transformPyStatement(trimmed)}`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('  '.repeat(indentStack.length - 1) + '}');
  }

  return { jsCode: jsLines.join('\n'), strings };
}

function transformPyStatement(stmt: string): string {
  if (stmt.startsWith('return ')) {
    const val = stmt.slice(7).trim();
    const parts = splitTopLevel(val);
    if (parts.length > 1) return `return [${parts.map(transformPyExpr).join(', ')}];`;
    return `return ${transformPyExpr(val)};`;
  }
  if (stmt === 'return') return 'return;';

  // Chained assignment: a = b = c (avoid ==, !=, <=, >=, +=, -=, etc.)
  // Multiple variable tuple unpacking: a, b = x, y OR a, b = map(int, ...)
  const assignMatch = stmt.match(/^([A-Za-z_][A-Za-z0-9_,\s[\].]*?)\s*([+\-*\/]?=)\s*(.+)$/);
  if (assignMatch && !stmt.includes('==') && !stmt.startsWith('if ') && !stmt.startsWith('while ')) {
    const lhs = assignMatch[1].trim();
    const op = assignMatch[2];
    const rhs = assignMatch[3].trim();

    if (op === '=') {
      // Chained assignment e.g. col[c] = d1[...] = d2[...] = True
      if (/^[A-Za-z0-9_.\[\]+ -]+(\s*=\s*[A-Za-z0-9_.\[\]+ -]+)+$/.test(stmt) && stmt.split('=').length > 2) {
        const segs = stmt.split('=').map((s) => s.trim());
        const valJs = transformPyExpr(segs[segs.length - 1]);
        const targets = segs.slice(0, -1).map((t) => transformPyExpr(t));
        return targets.map((t) => `${t} = ${valJs}`).join('; ') + ';';
      }

      if (lhs.includes(',')) {
        const lhsVars = lhs.split(',').map((s) => s.trim());
        const rhsParts = splitTopLevel(rhs);
        const rhsJs =
          rhsParts.length > 1
            ? `[${rhsParts.map(transformPyExpr).join(', ')}]`
            : `__pyIter(${transformPyExpr(rhs)})`;
        // Declare any undeclared simple variables using __vars? Simpler: var assignment works in non-strict or pre-declared!
        return `[${lhsVars.join(', ')}] = ${rhsJs};`;
      }

      return `${transformPyExpr(lhs)} = ${transformPyExpr(rhs)};`;
    } else {
      return `${transformPyExpr(lhs)} ${op} ${transformPyExpr(rhs)};`;
    }
  }

  return `${transformPyExpr(stmt)};`;
}

function collectPythonDeclaredVars(jsCode: string): string[] {
  const vars = new Set<string>();
  const reserved = new Set([
    'if', 'else', 'for', 'while', 'function', 'return', 'let', 'const', 'var', 'true', 'false',
    'null', 'break', 'continue', 'throw', 'new', 'of', 'in', 'class', 'Math', 'Infinity',
    'print', 'input', 'len', 'range', 'int', 'float', 'str', 'bool', 'list', 'set', 'dict', 'tuple',
    'sum', 'max', 'min', 'abs', 'round', 'sorted', 'reversed', 'enumerate', 'zip', 'all', 'any',
    'pow', 'chr', 'ord', 'math', 'bisect', 'heapq', 'itertools', 'collections', 'sys'
  ]);
  const lines = jsCode.split('\n');
  for (const line of lines) {
    const m1 = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (m1 && !reserved.has(m1[1])) vars.add(m1[1]);
    const m2 = line.match(/^\s*\[([A-Za-z0-9_,\s]+)\]\s*=/);
    if (m2) {
      for (const v of m2[1].split(',')) {
        const name = v.trim();
        if (name && !reserved.has(name)) vars.add(name);
      }
    }
  }
  return Array.from(vars);
}

export function runPythonInSandbox(
  code: string,
  rawInput: string
): { stdout: string; stderr: string; isError: boolean } {
  const stdoutChunks: string[] = [];
  let lineBuffer = '';
  const flushStdout = () => {
    if (lineBuffer.length > 0) {
      stdoutChunks.push(lineBuffer);
      lineBuffer = '';
    }
  };

  const lines = rawInput.replace(/\r\n/g, '\n').split('\n');
  let lineIdx = 0;

  const envHelpers = {
    __pyPrint: (args: any[], sep: string = ' ', end: string = '\n') => {
      const formatted = args
        .map((a) => {
          if (typeof a === 'boolean') return a ? 'True' : 'False';
          if (a === null || a === undefined) return 'None';
          if (Array.isArray(a)) return '[' + a.join(', ') + ']';
          return String(a);
        })
        .join(sep);
      const outStr = formatted + end;
      for (const ch of outStr) {
        if (ch === '\n') {
          stdoutChunks.push(lineBuffer);
          lineBuffer = '';
        } else {
          lineBuffer += ch;
        }
      }
    },
    __stdinRead: () => rawInput,
    input: (prompt?: string) => {
      if (prompt) lineBuffer += prompt;
      if (lineIdx < lines.length) {
        return lines[lineIdx++];
      }
      return '';
    },
    print: (...args: any[]) => envHelpers.__pyPrint(args, ' ', '\n'),
    len: (obj: any) => {
      if (obj === null || obj === undefined) return 0;
      if (typeof obj.length === 'number') return obj.length;
      if (obj instanceof Set || obj instanceof Map) return obj.size;
      if (typeof obj === 'object') return Object.keys(obj).length;
      return 0;
    },
    range: (start: number, stop?: number, step: number = 1) => {
      const res: number[] = [];
      let s = stop === undefined ? 0 : start;
      const e = stop === undefined ? start : stop;
      if (step === 0) throw new Error('ValueError: range() arg 3 must not be zero');
      if (step > 0) {
        for (let i = s; i < e; i += step) {
          if (res.length > 500_000) throw new Error('Memory Limit Exceeded in range()');
          res.push(i);
        }
      } else {
        for (let i = s; i > e; i += step) {
          if (res.length > 500_000) throw new Error('Memory Limit Exceeded in range()');
          res.push(i);
        }
      }
      return res;
    },
    int: (v: any) => {
      if (typeof v === 'boolean') return v ? 1 : 0;
      const n = parseInt(String(v).trim(), 10);
      if (Number.isNaN(n)) throw new Error(`ValueError: invalid literal for int(): ${v}`);
      return n;
    },
    float: (v: any) => {
      if (v === 'inf' || v === '+inf') return Infinity;
      if (v === '-inf') return -Infinity;
      return parseFloat(String(v));
    },
    str: (v: any) => (typeof v === 'boolean' ? (v ? 'True' : 'False') : String(v)),
    bool: (v: any) => Boolean(Array.isArray(v) ? v.length : v),
    list: (iter: any = []) => (iter ? Array.from(iter) : []),
    set: (iter: any = []) => new Set(iter ? Array.from(iter) : []),
    tuple: (iter: any = []) => (iter ? Array.from(iter) : []),
    dict: () => ({}),
    sum: (arr: any[]) =>
      Array.isArray(arr)
        ? arr.reduce((acc, v) => acc + (typeof v === 'boolean' ? (v ? 1 : 0) : Number(v) || 0), 0)
        : 0,
    max: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      if (list.length === 0) throw new Error('ValueError: max() arg is an empty sequence');
      return Math.max(...list.map(Number));
    },
    min: (...args: any[]) => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      if (list.length === 0) throw new Error('ValueError: min() arg is an empty sequence');
      return Math.min(...list.map(Number));
    },
    abs: Math.abs,
    round: (x: number, ndigits?: number) => {
      if (ndigits === undefined) return Math.round(x);
      const p = 10 ** ndigits;
      return Math.round(x * p) / p;
    },
    pow: (a: number, b: number, mod?: number) => {
      if (mod === undefined) return a ** b;
      let res = 1n;
      let base = BigInt(a) % BigInt(mod);
      let exp = BigInt(b);
      const m = BigInt(mod);
      while (exp > 0n) {
        if (exp & 1n) res = (res * base) % m;
        base = (base * base) % m;
        exp >>= 1n;
      }
      return Number(res);
    },
    sorted: (arr: any[], reverse: boolean = false) => {
      const copy = [...arr];
      copy.sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
      return reverse ? copy.reverse() : copy;
    },
    reversed: (arr: any[]) => [...arr].reverse(),
    enumerate: (arr: any[], start: number = 0) => arr.map((v, i) => [i + start, v]),
    zip: (...arrays: any[][]) => {
      const minLen = Math.min(...arrays.map((a) => a.length));
      const res: any[][] = [];
      for (let i = 0; i < minLen; i++) res.push(arrays.map((a) => a[i]));
      return res;
    },
    all: (arr: any[]) => arr.every(Boolean),
    any: (arr: any[]) => arr.some(Boolean),
    chr: (n: number) => String.fromCharCode(n),
    ord: (s: string) => s.charCodeAt(0),
    __pyMap: (fn: (v: any) => any, iter: any) => Array.from(iter).map(fn),
    __pyIter: (x: any) => {
      if (x === null || x === undefined) return [];
      if (Array.isArray(x)) return x;
      if (typeof x === 'string') return x.split('');
      if (x instanceof Set) return Array.from(x);
      if (typeof x[Symbol.iterator] === 'function') return Array.from(x);
      if (typeof x === 'object') return Object.keys(x);
      return [];
    },
    __pyListMul: (arr: any[], n: number) => {
      const res: any[] = [];
      for (let i = 0; i < n; i++) res.push(...arr.map((x) => (Array.isArray(x) ? [...x] : x)));
      return res;
    },
    __pyDivmod: (a: number, b: number) => [Math.floor(a / b), ((a % b) + b) % b],
    __pyJoin: (sep: string, arr: any[]) => Array.from(arr).map(String).join(sep),
    __pyGet: (dict: any, key: any, defVal: any) => (dict && key in dict ? dict[key] : defVal),
    __pyEntries: (dict: any) => Object.entries(dict || {}).map(([k, v]) => [isNaN(Number(k)) ? k : Number(k), v]),
    __pyKeys: (dict: any) => Object.keys(dict || {}).map((k) => (isNaN(Number(k)) ? k : Number(k))),
    __pyValues: (dict: any) => Object.values(dict || {}),
    __pyBool: (x: any): boolean => {
      if (x === null || x === undefined || x === false || x === 0 || x === '') return false;
      if (Array.isArray(x)) return x.length > 0;
      if (x instanceof Set || x instanceof Map) return x.size > 0;
      if (typeof x === 'object') return Object.keys(x).length > 0;
      return Boolean(x);
    },
    __pyConcat: (a: any, b: any) => {
      if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
      return a + b;
    },
    __pyEq: (a: any, b: any): boolean => {
      if (a === b) return true;
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
          if (!envHelpers.__pyEq(a[i], b[i])) return false;
        }
        return true;
      }
      return a == b;
    },
    __pyIn: (item: any, container: any) => {
      if (Array.isArray(container)) return container.includes(item);
      if (typeof container === 'string') return container.includes(String(item));
      if (container instanceof Set) return container.has(item);
      if (container && typeof container === 'object') return String(item) in container;
      return false;
    },
    __pyAt: (obj: any, idx: number) => (idx < 0 ? obj[obj.length + idx] : obj[idx]),
    __pySlice: (obj: any, start: number | null, stop: number | null, step: number | null) => {
      const len = obj.length;
      const st = step === null ? 1 : step;
      if (st === 0) throw new Error('ValueError: slice step cannot be zero');
      let s = start === null ? (st > 0 ? 0 : len - 1) : start < 0 ? Math.max(0, len + start) : Math.min(len, start);
      let e = stop === null ? (st > 0 ? len : -1) : stop < 0 ? Math.max(-1, len + stop) : Math.min(len, stop);
      const out: any[] = [];
      if (st > 0) {
        for (let i = s; i < e; i += st) out.push(obj[i]);
      } else {
        for (let i = s; i > e; i += st) out.push(obj[i]);
      }
      return typeof obj === 'string' ? out.join('') : out;
    },
    math: {
      sqrt: Math.sqrt,
      floor: Math.floor,
      ceil: Math.ceil,
      log: Math.log,
      log2: Math.log2,
      log10: Math.log10,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      pi: Math.PI,
      e: Math.E,
      inf: Infinity,
      gcd: (a: number, b: number) => {
        let x = Math.abs(a),
          y = Math.abs(b);
        while (y) {
          const t = y;
          y = x % y;
          x = t;
        }
        return x;
      },
      lcm: (a: number, b: number) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / envHelpers.math.gcd(a, b))
    },
    bisect: {
      bisect_left: (arr: number[], x: number) => {
        let l = 0,
          r = arr.length;
        while (l < r) {
          const m = (l + r) >> 1;
          if (arr[m] < x) l = m + 1;
          else r = m;
        }
        return l;
      },
      bisect_right: (arr: number[], x: number) => {
        let l = 0,
          r = arr.length;
        while (l < r) {
          const m = (l + r) >> 1;
          if (arr[m] <= x) l = m + 1;
          else r = m;
        }
        return l;
      }
    },
    heapq: {
      heappush: (heap: any[], item: any) => {
        heap.push(item);
        let idx = heap.length - 1;
        const cmp = (a: any, b: any) => {
          if (Array.isArray(a) && Array.isArray(b)) {
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
              if (a[i] !== b[i]) return a[i] - b[i];
            }
            return a.length - b.length;
          }
          return a - b;
        };
        while (idx > 0) {
          const p = (idx - 1) >> 1;
          if (cmp(heap[idx], heap[p]) < 0) {
            [heap[idx], heap[p]] = [heap[p], heap[idx]];
            idx = p;
          } else break;
        }
      },
      heappop: (heap: any[]) => {
        if (heap.length === 0) throw new Error('IndexError: index out of range');
        const top = heap[0];
        const last = heap.pop();
        if (heap.length > 0) {
          heap[0] = last;
          let idx = 0;
          const n = heap.length;
          const cmp = (a: any, b: any) => {
            if (Array.isArray(a) && Array.isArray(b)) {
              for (let i = 0; i < Math.min(a.length, b.length); i++) {
                if (a[i] !== b[i]) return a[i] - b[i];
              }
              return a.length - b.length;
            }
            return a - b;
          };
          while (true) {
            let best = idx;
            const l = 2 * idx + 1;
            const r = 2 * idx + 2;
            if (l < n && cmp(heap[l], heap[best]) < 0) best = l;
            if (r < n && cmp(heap[r], heap[best]) < 0) best = r;
            if (best !== idx) {
              [heap[idx], heap[best]] = [heap[best], heap[idx]];
              idx = best;
            } else break;
          }
        }
        return top;
      }
    },
    itertools: {
      accumulate: (arr: number[]) => {
        const out: number[] = [];
        let s = 0;
        for (const x of arr) {
          s += x;
          out.push(s);
        }
        return out;
      }
    },
    sys: {
      stdin: { read: () => rawInput }
    }
  };

  try {
    const { jsCode, strings } = transpilePythonToJS(code);
    const restored = jsCode.replace(/__PYSTR_(\d+)__/g, (_m, i) => strings[Number(i)]);
    const decls = collectPythonDeclaredVars(restored);
    const varDeclLine = decls.length ? `var ${decls.join(', ')};` : '';

    const fullScript = `
      const {
        __pyPrint, __stdinRead, input, print, len, range, int, float, str, bool,
        list, set, tuple, dict, sum, max, min, abs, round, pow, sorted, reversed,
        enumerate, zip, all, any, chr, ord, __pyMap, __pyIter, __pyListMul, __pyDivmod,
        __pyJoin, __pyGet, __pyEntries, __pyKeys, __pyValues, __pyBool, __pyConcat, __pyEq, __pyIn, __pyAt, __pySlice,
        math, bisect, heapq, itertools, sys
      } = env;
      const bisect_left = bisect.bisect_left;
      const bisect_right = bisect.bisect_right;
      const heappush = heapq.heappush;
      const heappop = heapq.heappop;
      const accumulate = itertools.accumulate;
      let __steps = 0;
      ${varDeclLine}
      ${restored}
    `;

    const runner = new Function('env', fullScript);
    runner(envHelpers);
    flushStdout();
    return {
      stdout: stdoutChunks.join('\n'),
      stderr: '',
      isError: false
    };
  } catch (err: any) {
    flushStdout();
    return {
      stdout: stdoutChunks.join('\n'),
      stderr: err?.message || 'Python SyntaxError / RuntimeError',
      isError: true
    };
  }
}

// ============================================================================
// C++17/20 BROWSER TRANSPILER & SANDBOX
// ============================================================================

function validateCppSyntax(code: string = ''): string | null {
  if (!code || !code.trim()) {
    return 'Compile Error: Mã nguồn C++ đang trống.';
  }
  // Strip comments and string literals before checking braces/parens
  const stripped = code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");

  if (!/\bmain\s*\(/.test(stripped)) {
    return 'Compile Error: Không tìm thấy hàm int main() trong chương trình C++.';
  }

  let braces = 0;
  let parens = 0;
  for (const ch of stripped) {
    if (ch === '{') braces++;
    else if (ch === '}') braces--;
    else if (ch === '(') parens++;
    else if (ch === ')') parens--;
    if (braces < 0) return 'Compile Error: Dư dấu đóng ngoặc nhọn "}".';
    if (parens < 0) return 'Compile Error: Dư dấu đóng ngoặc tròn ")".';
  }
  if (braces > 0) return 'Compile Error: Thiếu dấu đóng ngoặc nhọn "}".';
  if (parens > 0) return 'Compile Error: Thiếu dấu đóng ngoặc tròn ")".';
  return null;
}

function stripCppCommentsAndProtectStrings(code: string): {
  cleaned: string;
  strings: string[];
} {
  const strings: string[] = [];
  let out = '';
  let i = 0;
  while (i < code.length) {
    // Line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    // Block comment
    if (code[i] === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // Double-quoted string
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') {
          j += 2;
          continue;
        }
        if (code[j] === '"') break;
        j++;
      }
      const token = `__CPPSTR_${strings.length}__`;
      strings.push(code.slice(i, j + 1));
      out += token;
      i = j + 1;
      continue;
    }
    // Char literal -> convert single-char literal to string in JS
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') {
          j += 2;
          continue;
        }
        if (code[j] === "'") break;
        j++;
      }
      const inner = code.slice(i + 1, j);
      const token = `__CPPSTR_${strings.length}__`;
      strings.push(`"${inner.replace(/"/g, '\\"')}"`);
      out += token;
      i = j + 1;
      continue;
    }
    out += code[i];
    i++;
  }
  return { cleaned: out, strings };
}

function stripBalancedAngleBrackets(str: string, startIdx: number): { endIdx: number; content: string } {
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === '<') depth++;
    else if (str[i] === '>') {
      depth--;
      if (depth === 0) {
        return { endIdx: i, content: str.slice(startIdx + 1, i) };
      }
    }
  }
  return { endIdx: startIdx, content: '' };
}

function splitCppTopCommas(str: string): string[] {
  const res: string[] = [];
  let p = 0;
  let b = 0;
  let a = 0;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '(') p++;
    else if (c === ')') p--;
    else if (c === '{') b++;
    else if (c === '}') b--;
    else if (c === '<' && (a > 0 || /\b(vector|pair|map|unordered_map|set|priority_queue|queue|stack)\s*$/.test(str.slice(0, i)))) a++;
    else if (c === '>' && a > 0) a--;
    else if (c === ',' && p === 0 && b === 0 && a === 0) {
      res.push(str.slice(start, i).trim());
      start = i + 1;
    }
  }
  const tail = str.slice(start).trim();
  if (tail) res.push(tail);
  return res;
}

function buildVectorInit(dims: string[], defaultVal: string): string {
  if (dims.length === 0) return defaultVal;
  if (dims.length === 1) {
    return `__cppVec(${dims[0]}, () => ${defaultVal})`;
  }
  const rest = buildVectorInit(dims.slice(1), defaultVal);
  return `__cppVec(${dims[0]}, () => ${rest})`;
}

function replaceCppTypeDecls(code: string): string {
  let res = code;

  // Handle std:: prefix cleanly
  res = res.replace(/\bstd::/g, '');

  // Handle numeric constants like 1LL, 1000000LL, 1e18
  res = res.replace(/\b(\d+)(?:LL|ll|ULL|ull)\b/g, '$1');

  // Remove ios_base::sync_with_stdio(...) and cin.tie(...)
  res = res.replace(/ios_base::sync_with_stdio\([^)]*\)\s*;/g, '');
  res = res.replace(/ios::sync_with_stdio\([^)]*\)\s*;/g, '');
  res = res.replace(/cin\.tie\([^)]*\)\s*;/g, '');
  res = res.replace(/cout\.tie\([^)]*\)\s*;/g, '');

  // Convert C-style casts: (double)a, (long long)x, (int)s.length()
  res = res.replace(/\(\s*(?:long\s+long|int|unsigned\s+int|unsigned\s+long\s+long|size_t)\s*\)\s*([A-Za-z0-9_.()]+)/g, '__cppInt($1)');
  res = res.replace(/\(\s*(?:double|float)\s*\)\s*([A-Za-z0-9_.()]+)/g, 'Number($1)');

  // Convert structured binding: auto [d, u] = pq.top();
  res = res.replace(/\b(?:const\s+)?auto\s*\[([^\]]+)\]\s*=/g, 'let [$1] =');

  // Convert container declarations statement by statement
  // vector<...> v(n, val), vector<vector<...>> adj(n + 1);
  res = res.replace(
    /\b(vector|priority_queue|queue|stack|map|unordered_map|set|unordered_set|pair)\s*</g,
    (_m, kind, offset, full) => `__CPP_TYPE_${kind}__<`
  );

  // Iterative resolver for __CPP_TYPE_...__<...>
  let safety = 0;
  while (res.includes('__CPP_TYPE_') && safety++ < 60) {
    const match = res.match(/__CPP_TYPE_(vector|priority_queue|queue|stack|map|unordered_map|set|unordered_set|pair)__\s*</);
    if (!match || match.index === undefined) break;
    const kind = match[1];
    const angleStart = match.index + match[0].length - 1;
    const { endIdx, content } = stripBalancedAngleBrackets(res, angleStart);

    // Check what follows up to ; or , or = or { or )
    const after = res.slice(endIdx + 1);
    const declMatch = after.match(/^\s*(&?\s*[A-Za-z_][A-Za-z0-9_]*(?:\s*\[[^\]]+\])?(?:\s*\([^;)]*\))?(?:\s*=\s*\{[^;]*\}|\s*=\s*[^;,\n)]+)?(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*(?:\s*\([^;)]*\))?(?:\s*=\s*[^;,\n)]+)?)*)/);

    // If inside a function parameter list, e.g. `const vector<int>& a` or `vector<int> a`
    const beforeCtx = res.slice(Math.max(0, match.index - 20), match.index);
    const inParamOrCast = /\(\s*(?:const\s*)?$|,\s*(?:const\s*)?$/.test(beforeCtx) && !/;\s*$/.test(beforeCtx);

    if (kind === 'pair') {
      // Check if inside parens/template or declaration
      if (inParamOrCast || !declMatch) {
        res = res.slice(0, match.index) + '__CPPPAIR' + res.slice(endIdx + 1);
      } else {
        const varPart = declMatch[1];
        const eqIdx = varPart.indexOf('=');
        if (eqIdx !== -1) {
          const vName = varPart.slice(0, eqIdx).trim().replace(/^&/, '');
          const vVal = varPart.slice(eqIdx + 1).trim();
          res = res.slice(0, match.index) + `let ${vName} = ${vVal}` + res.slice(endIdx + 1 + declMatch[0].length);
        } else {
          const vName = varPart.trim().replace(/^&/, '');
          res = res.slice(0, match.index) + `let ${vName} = [0, 0]` + res.slice(endIdx + 1 + declMatch[0].length);
        }
      }
      continue;
    }

    if (inParamOrCast) {
      // Strip type annotation from parameter list: `const vector<int>& a` -> `a`
      const paramVar = after.match(/^\s*(?:const\s*)?&?\s*([A-Za-z_][A-Za-z0-9_]*)/);
      if (paramVar) {
        // Check we aren't inside `= ...` or return type
        const fullPrefix = res.slice(0, match.index).replace(/\bconst\s*$/, '');
        res = fullPrefix + paramVar[1] + res.slice(endIdx + 1 + paramVar[0].length);
        continue;
      }
    }

    // Check if return type before function name: e.g. vector<long long> dijkstra(
    const fnRetMatch = after.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*\{/);
    if (fnRetMatch) {
      res = res.slice(0, match.index) + `function ${fnRetMatch[1]}(${fnRetMatch[2]}) {` + res.slice(endIdx + 1 + fnRetMatch[0].length);
      continue;
    }

    // Standard variable declaration after template type
    const stmtMatch = after.match(/^\s*([^;\n]+);/);
    if (stmtMatch) {
      const declList = splitCppTopCommas(stmtMatch[1]);
      const builtVars: string[] = [];

      for (const item of declList) {
        if (kind === 'priority_queue') {
          const isMinHeap = /greater\s*</.test(content);
          const vName = item.trim();
          builtVars.push(`${vName} = __cppPQ(${isMinHeap})`);
        } else if (kind === 'map' || kind === 'unordered_map') {
          const vName = item.trim();
          builtVars.push(`${vName} = __cppMap()`);
        } else if (kind === 'set' || kind === 'unordered_set') {
          const vName = item.trim();
          builtVars.push(`${vName} = __cppSet()`);
        } else if (kind === 'queue') {
          const vName = item.trim();
          builtVars.push(`${vName} = __cppQueue()`);
        } else if (kind === 'stack') {
          const vName = item.trim();
          builtVars.push(`${vName} = __cppStack()`);
        } else if (kind === 'vector') {
          // vector<vector<...>> v(n, vector<...>(m, 0)) OR vector<int> v(n, 0) OR vector<int> v = {1,2,3}
          const eqMatch = item.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{([\s\S]*)\}$/);
          const ctorMatch = item.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(([\s\S]*)\)$/);
          if (eqMatch) {
            builtVars.push(`${eqMatch[1]} = [${eqMatch[2]}]`);
          } else if (ctorMatch) {
            const vName = ctorMatch[1];
            const args = splitCppTopCommas(ctorMatch[2]);
            if (args.length === 1) {
              const is2D = /vector/.test(content);
              const defVal = /bool/.test(content) ? 'false' : /string/.test(content) ? '""' : is2D ? '[]' : '0';
              builtVars.push(`${vName} = __cppVec(${args[0]}, () => ${defVal})`);
            } else if (args.length >= 2) {
              const innerVal = args[1].trim();
              if (/vector/.test(innerVal)) {
                builtVars.push(`${vName} = __cppVec(${args[0]}, () => [])`);
              } else {
                builtVars.push(`${vName} = __cppVec(${args[0]}, () => ${innerVal})`);
              }
            }
          } else {
            // Possibly C-array of vectors like vector<int> adj[N]
            const arrMatch = item.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\[([^\]]+)\]$/);
            if (arrMatch) {
              builtVars.push(`${arrMatch[1]} = __cppVec(${arrMatch[2]}, () => [])`);
            } else {
              builtVars.push(`${item.trim()} = []`);
            }
          }
        }
      }

      res = res.slice(0, match.index) + `let ${builtVars.join(', ')};` + res.slice(endIdx + 1 + stmtMatch[0].length);
      continue;
    }

    // Fallback cleanup
    res = res.slice(0, match.index) + 'let ' + res.slice(endIdx + 1);
  }

  return res;
}

function transpileCppToJS(code: string): { jsCode: string; strings: string[] } {
  const { cleaned, strings } = stripCppCommentsAndProtectStrings(code);
  let js = cleaned;

  // Extract #define constants
  const defines: [string, string][] = [];
  js = js.replace(/^\s*#define\s+([A-Za-z_][A-Za-z0-9_]*)\s+([^\n]+)$/gm, (_m, name, val) => {
    defines.push([name, val.trim()]);
    return '';
  });
  // Remove #include lines
  js = js.replace(/^\s*#[^\n]*$/gm, '');
  // Remove using namespace std;
  js = js.replace(/\busing\s+namespace\s+[A-Za-z0-9_:]+\s*;/g, '');

  for (const [dName, dVal] of defines) {
    js = js.replace(new RegExp(`\\b${dName}\\b`, 'g'), `(${dVal})`);
  }

  // Resolve templates & containers
  js = replaceCppTypeDecls(js);

  // Convert struct Name { ... }; -> class-like factory or object
  js = js.replace(
    /\bstruct\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{([\s\S]*?)\}\s*;/g,
    (_m, sName, body) => {
      // Very clean struct handling for competitive programming (like SegmentTree)
      return `/* struct ${sName} */\nfunction make_${sName}(...args) { const self = {}; ${body} return self; }`;
    }
  );

  // Convert range-based for: for (auto& x : vec) or for (int x : vec)
  js = js.replace(
    /\bfor\s*\(\s*(?:const\s+)?(?:auto|int|long\s+long|double|char|string|bool)\s*&?\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^)]+)\)/g,
    'for (let $1 of $2)'
  );

  // Convert function definitions: int foo(int a, long long b) {
  const primTypes = '(?:const\\s+)?(?:unsigned\\s+)?(?:long\\s+long|long|int|double|float|bool|char|string|void|auto)';
  js = js.replace(
    new RegExp(`\\b${primTypes}\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\(([^)]*)\\)\\s*\\{`, 'g'),
    (_m, fnName, params) => {
      const cleanedParams = params.trim()
        ? splitCppTopCommas(params).map((p) => {
            const noDef = p.split('=')[0].trim();
            const defPart = p.includes('=') ? ' = ' + p.split('=')[1].trim() : '';
            const tokens = noDef.replace(/&/g, '').trim().split(/\s+/);
            return tokens[tokens.length - 1] + defPart;
          })
        : [];
      return `function ${fnName}(${cleanedParams.join(', ')}) {`;
    }
  );

  // Convert `main()` parameters if any: `function main() {`
  // Convert C-array declarations: `int cnt[MAXA];` -> `let cnt = __cppVec(MAXA, () => 0);`
  js = js.replace(
    new RegExp(`\\b${primTypes}\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\[([^\\]]+)\\]\\s*(?:=\\s*\\{([^}]*)\\})?\\s*;`, 'g'),
    (_m, vName, size, initList) => {
      if (initList !== undefined) {
        return `let ${vName} = [${initList}];`;
      }
      return `let ${vName} = __cppVec(${size}, () => 0);`;
    }
  );

  // Inside for loops first so scalar decl regex doesn't touch loop init: `for (let i = 0; ...)`
  js = js.replace(
    new RegExp(`for\\s*\\(\\s*${primTypes}\\s+`, 'g'),
    'for (let '
  );

  // Convert scalar variable declarations iteratively so consecutive declarations on indented lines are all matched
  const constScalarRe = new RegExp(`(^|[;{}\n])([ \t]*)const\\s+${primTypes}\\s+([A-Za-z_][^;{}]*)`, 'g');
  const varScalarRe = new RegExp(`(^|[;{}\n])([ \t]*)${primTypes}\\s+([A-Za-z_][^;{}]*)`, 'g');
  for (let pass = 0; pass < 4; pass++) {
    const nextConst = js.replace(constScalarRe, (_m, pre, ws, decls) => `${pre}${ws}const ${decls}`);
    const nextVar = nextConst.replace(varScalarRe, (_m, pre, ws, decls) => `${pre}${ws}let ${decls}`);
    if (nextVar === js) break;
    js = nextVar;
  }

  // Convert pair `{a, b}` literals in .push({0, 1}) / .push_back({u, v})
  js = js.replace(/\.push(_back)?\s*\(\s*\{([^}]+)\}\s*\)/g, '.push($2_PAIR_)');
  js = js.replace(/\.push\(([^)]+)_PAIR_\)/g, '.push([$1])');

  // Convert pair .first / .second and vector methods
  js = js
    .replace(/\.first\b/g, '[0]')
    .replace(/\.second\b/g, '[1]')
    .replace(/\.push_back\(/g, '.push(')
    .replace(/\.pop_back\(\)/g, '.pop()')
    .replace(/\.length\(\)/g, '.length')
    .replace(/\.size\(\)/g, '.length')
    .replace(/\.empty\(\)/g, '.__cppEmpty()')
    .replace(/\.assign\s*\(([^,]+),\s*([^)]+)\)/g, '.__cppAssign($1, $2)')
    .replace(/\.resize\s*\(([^)]+)\)/g, '.__cppResize($1)')
    .replace(/\bmake_pair\s*\(/g, '__cppMakePair(');

  // Convert STL sort / reverse / lower_bound / upper_bound
  js = js.replace(
    /\bsort\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)(?:\s*,\s*([^)]+))?\s*\)/g,
    (_m, v, cmp) => (cmp ? `__cppSort(${v}, ${cmp})` : `__cppSort(${v})`)
  );
  js = js.replace(
    /\breverse\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g,
    '$1.reverse()'
  );
  js = js.replace(
    /\blower_bound\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)\s*,\s*([^)]+)\)/g,
    '__cppLowerBound($1, $2)'
  );
  js = js.replace(
    /\bupper_bound\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)\s*,\s*([^)]+)\)/g,
    '__cppUpperBound($1, $2)'
  );

  // If code uses `auto it = __cppLowerBound(tails, x); if (it == tails.end()) ... *it = x;`
  js = js.replace(
    /\blet\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*__cpp(Lower|Upper)Bound\(([^,]+),\s*([^)]+)\)\s*;/g,
    'let $1 = __cpp$2Bound($3, $4); let __itTarget_$1 = $3;'
  );
  js = js.replace(/([A-Za-z_][A-Za-z0-9_]*)\s*==\s*([A-Za-z_][A-Za-z0-9_]*)\.end\(\)/g, '$1 === $2.length');
  js = js.replace(/([A-Za-z_][A-Za-z0-9_]*)\s*!=\s*([A-Za-z_][A-Za-z0-9_]*)\.end\(\)/g, '$1 !== $2.length');
  js = js.replace(/\*([A-Za-z_][A-Za-z0-9_]*)\s*=/g, '__itTarget_$1[$1] =');
  js = js.replace(/\*([A-Za-z_][A-Za-z0-9_]*)\b/g, '__itTarget_$1[$1]');

  // Convert `getline(cin, line)` -> `__cppGetline((v) => line = v)`
  js = js.replace(/\bgetline\s*\(\s*cin\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)/g, '__cppGetline((__v) => ($1 = __v))');

  // Convert `cin >> a >> b >> arr[i]` (both standalone and in conditions like `if (cin >> a >> b)` or `if (!(cin >> n))`)
  js = js.replace(/\bcin((?:\s*>>\s*[^;)\n]+)+)/g, (_m, chain) => {
    const vars = chain
      .split('>>')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const setters = vars.map((v: string) => `(__v) => (${v} = __cppReadTarget(${v}, __v))`);
    return `__cppCin([${setters.join(', ')}])`;
  });

  // Convert `cout << expr1 << expr2 << endl;`
  js = js.replace(/\bcout((?:\s*<<\s*[^;\n]+)+)\s*;/g, (_m, chain) => {
    const parts = chain
      .split('<<')
      .map((s: string) => s.trim())
      .filter(Boolean);
    return `__cppCout([${parts.map((p: string) => (p === 'endl' ? '__CPP_ENDL' : p === 'fixed' ? '__CPP_FIXED' : p)).join(', ')}]);`;
  });

  // Step guard on loops and functions
  js = js.replace(/\b(while\s*\([^)]+\)\s*\{|for\s*\([^)]+\)\s*\{)/g, '$1 if (++__steps > ' + MAX_STEPS + ') throw new Error("Time Limit Exceeded (TLE)");');

  // Safe integer division heuristic for binary search `(low + high) / 2` and `(l + r) / 2`
  js = js.replace(/\(([^()]+)\)\s*\/\s*2\b/g, '__cppDiv2($1)');

  // Common C++ math/char functions & constants
  js = js
    .replace(/\b__gcd\s*\(/g, '__cppGcd(')
    .replace(/\bgcd\s*\(/g, '__cppGcd(')
    .replace(/\bswap\s*\(([^,]+),\s*([^)]+)\)/g, '([$1, $2] = [$2, $1])')
    .replace(/\bNULL\b|\bnullptr\b/g, 'null');

  return { jsCode: js, strings };
}

export function runCppInSandbox(
  code: string,
  rawInput: string
): { stdout: string; stderr: string; isError: boolean } {
  const syntaxErr = validateCppSyntax(code);
  if (syntaxErr) {
    return { stdout: '', stderr: syntaxErr, isError: true };
  }

  const lines = rawInput.replace(/\r\n/g, '\n').split('\n');
  let lineIdx = 0;
  const tokens = rawInput.trim() ? rawInput.trim().split(/\s+/) : [];
  let tokenIdx = 0;

  let outBuffer = '';
  let fixedPrecision: number | null = null;

  const envHelpers = {
    __CPP_ENDL: Symbol('endl'),
    __CPP_FIXED: Symbol('fixed'),
    setprecision: (p: number) => ({ __setprecision: p }),
    __cppCin: (setters: ((val: string) => void)[]) => {
      for (const setter of setters) {
        if (tokenIdx >= tokens.length) return false;
        setter(tokens[tokenIdx++]);
      }
      return true;
    },
    __cppGetline: (setter: (val: string) => void) => {
      if (lineIdx >= lines.length) return false;
      setter(lines[lineIdx++]);
      return true;
    },
    __cppReadTarget: (currentVal: any, rawToken: string) => {
      if (typeof currentVal === 'string') return rawToken;
      if (typeof currentVal === 'boolean') return rawToken !== '0' && rawToken.toLowerCase() !== 'false';
      const n = Number(rawToken);
      return Number.isNaN(n) ? rawToken : n;
    },
    __cppCout: (items: any[]) => {
      for (const item of items) {
        if (item === envHelpers.__CPP_ENDL) {
          outBuffer += '\n';
        } else if (item === envHelpers.__CPP_FIXED) {
          fixedPrecision = fixedPrecision ?? 6;
        } else if (item && typeof item === 'object' && '__setprecision' in item) {
          fixedPrecision = item.__setprecision;
        } else if (typeof item === 'boolean') {
          outBuffer += item ? '1' : '0';
        } else if (typeof item === 'number' && fixedPrecision !== null && !Number.isInteger(item)) {
          outBuffer += item.toFixed(fixedPrecision);
        } else {
          outBuffer += String(item);
        }
      }
    },
    __cppVec: (size: number, factory: () => any) => {
      const n = Math.max(0, Math.min(size, 500_000));
      const arr = new Array(n);
      for (let i = 0; i < n; i++) arr[i] = factory();
      return arr;
    },
    __cppMap: () =>
      new Proxy(
        {},
        {
          get(target: Record<string, any>, prop: string | symbol) {
            if (typeof prop === 'symbol') return (target as any)[prop];
            if (prop in target) return target[prop];
            return 0;
          }
        }
      ),
    __cppSet: () => {
      const s = new Set<any>();
      return {
        insert: (v: any) => s.add(v),
        erase: (v: any) => s.delete(v),
        count: (v: any) => (s.has(v) ? 1 : 0),
        get length() {
          return s.size;
        },
        __cppEmpty: () => s.size === 0
      };
    },
    __cppQueue: () => {
      const q: any[] = [];
      let head = 0;
      return {
        push: (v: any) => q.push(v),
        pop: () => {
          if (head < q.length) head++;
        },
        front: () => q[head],
        __cppEmpty: () => head >= q.length,
        get length() {
          return q.length - head;
        }
      };
    },
    __cppStack: () => {
      const st: any[] = [];
      return {
        push: (v: any) => st.push(v),
        pop: () => st.pop(),
        top: () => st[st.length - 1],
        __cppEmpty: () => st.length === 0,
        get length() {
          return st.length;
        }
      };
    },
    __cppPQ: (isMinHeap: boolean) => {
      const heap: any[] = [];
      const cmp = (a: any, b: any) => {
        let diff = 0;
        if (Array.isArray(a) && Array.isArray(b)) {
          for (let i = 0; i < Math.min(a.length, b.length); i++) {
            if (a[i] !== b[i]) {
              diff = a[i] - b[i];
              break;
            }
          }
        } else {
          diff = a - b;
        }
        return isMinHeap ? diff < 0 : diff > 0;
      };
      return {
        push: (item: any) => {
          heap.push(item);
          let idx = heap.length - 1;
          while (idx > 0) {
            const p = (idx - 1) >> 1;
            if (cmp(heap[idx], heap[p])) {
              [heap[idx], heap[p]] = [heap[p], heap[idx]];
              idx = p;
            } else break;
          }
        },
        pop: () => {
          if (heap.length === 0) return;
          const last = heap.pop();
          if (heap.length > 0) {
            heap[0] = last;
            let idx = 0;
            const n = heap.length;
            while (true) {
              let best = idx;
              const l = 2 * idx + 1;
              const r = 2 * idx + 2;
              if (l < n && cmp(heap[l], heap[best])) best = l;
              if (r < n && cmp(heap[r], heap[best])) best = r;
              if (best !== idx) {
                [heap[idx], heap[best]] = [heap[best], heap[idx]];
                idx = best;
              } else break;
            }
          }
        },
        top: () => heap[0],
        __cppEmpty: () => heap.length === 0,
        get length() {
          return heap.length;
        }
      };
    },
    __cppMakePair: (a: any, b: any) => [a, b],
    __cppSort: (arr: any[], cmpFn?: (a: any, b: any) => boolean) => {
      arr.sort((a, b) => {
        if (cmpFn) return cmpFn(a, b) ? -1 : 1;
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return String(a).localeCompare(String(b));
      });
    },
    __cppLowerBound: (arr: number[], x: number) => {
      let l = 0,
        r = arr.length;
      while (l < r) {
        const m = (l + r) >> 1;
        if (arr[m] < x) l = m + 1;
        else r = m;
      }
      return l;
    },
    __cppUpperBound: (arr: number[], x: number) => {
      let l = 0,
        r = arr.length;
      while (l < r) {
        const m = (l + r) >> 1;
        if (arr[m] <= x) l = m + 1;
        else r = m;
      }
      return l;
    },
    __cppDiv2: (val: number) => (Number.isInteger(val) ? Math.trunc(val / 2) : val / 2),
    __cppInt: (v: any) => parseInt(String(v), 10) || 0,
    __cppGcd: (a: number, b: number) => {
      let x = Math.abs(Math.trunc(a)),
        y = Math.abs(Math.trunc(b));
      while (y) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x;
    },
    max: (...args: any[]) => Math.max(...args),
    min: (...args: any[]) => Math.min(...args),
    abs: Math.abs,
    sqrt: Math.sqrt,
    pow: Math.pow,
    floor: Math.floor,
    ceil: Math.ceil,
    isalnum: (ch: string) => /^[a-zA-Z0-9]$/.test(String(ch)),
    isalpha: (ch: string) => /^[a-zA-Z]$/.test(String(ch)),
    isdigit: (ch: string) => /^[0-9]$/.test(String(ch)),
    tolower: (ch: string) => String(ch).toLowerCase(),
    toupper: (ch: string) => String(ch).toUpperCase(),
    stoi: (s: string) => parseInt(s, 10),
    stoll: (s: string) => parseInt(s, 10),
    to_string: (v: any) => String(v)
  };

  try {
    // Attach Array helpers non-enumerably for clean .__cppEmpty(), .__cppAssign(), .__cppResize()
    const { jsCode, strings } = transpileCppToJS(code);
    const restored = jsCode.replace(/__CPPSTR_(\d+)__/g, (_m, i) => strings[Number(i)]);

    const fullScript = `
      const {
        __CPP_ENDL, __CPP_FIXED, setprecision, __cppCin, __cppGetline, __cppReadTarget,
        __cppCout, __cppVec, __cppMap, __cppSet, __cppQueue, __cppStack, __cppPQ,
        __cppMakePair, __cppSort, __cppLowerBound, __cppUpperBound, __cppDiv2, __cppInt, __cppGcd,
        max, min, abs, sqrt, pow, floor, ceil, isalnum, isalpha, isdigit, tolower, toupper,
        stoi, stoll, to_string
      } = env;
      if (!Array.prototype.__cppEmpty) {
        Object.defineProperties(Array.prototype, {
          __cppEmpty: { value: function() { return this.length === 0; }, configurable: true },
          __cppAssign: { value: function(n, v) { this.length = 0; for (let i = 0; i < n; i++) this.push(v); }, configurable: true },
          __cppResize: { value: function(n, v = 0) { while (this.length < n) this.push(v); this.length = n; }, configurable: true }
        });
      }
      let __steps = 0;
      ${restored}
      if (typeof main === 'function') main();
    `;

    const runner = new Function('env', fullScript);
    runner(envHelpers);
    return {
      stdout: outBuffer.replace(/\n$/, ''),
      stderr: '',
      isError: false
    };
  } catch (err: any) {
    return {
      stdout: outBuffer.replace(/\n$/, ''),
      stderr: `Compile / Runtime Error: ${err?.message || 'Lỗi biên dịch hoặc thực thi C++'}`,
      isError: true
    };
  }
}

/**
 * Execute actual user C++ or Python code strictly against stdin.
 * Falls back to /api/gemini/run-code ONLY if local sandbox fails with an unsupported construct.
 */
export async function executeCode(
  _problemId: string,
  language: CodeLanguage,
  code: string,
  input: string
): Promise<{ stdout: string; stderr: string; runtimeMs: number; isError: boolean }> {
  const startTime = performance.now();

  if (!code.trim()) {
    return {
      stdout: '',
      stderr: 'Lỗi: Mã nguồn không được để trống!',
      runtimeMs: 0,
      isError: true
    };
  }

  // 1. Run locally first in real sandbox (fast, deterministic, offline-safe, executes user's real logic)
  const localRes =
    language === 'cpp' ? runCppInSandbox(code, input) : runPythonInSandbox(code, input);

  if (!localRes.isError) {
    const endTime = performance.now();
    return {
      stdout: localRes.stdout,
      stderr: '',
      runtimeMs: Math.max(4, Math.round(endTime - startTime)),
      isError: false
    };
  }

  // 2. If obvious syntax error (missing main / unbalanced braces), fail immediately without guessing
  if (
    localRes.stderr.includes('Không tìm thấy hàm int main') ||
    localRes.stderr.includes('Dư dấu đóng') ||
    localRes.stderr.includes('Thiếu dấu đóng') ||
    localRes.stderr.includes('Time Limit Exceeded')
  ) {
    const endTime = performance.now();
    return {
      stdout: localRes.stdout,
      stderr: localRes.stderr,
      runtimeMs: Math.round(endTime - startTime),
      isError: true
    };
  }

  // 3. Optional server verification fallback if advanced C++/Python constructs (e.g. templates/classes) hit local limits
  try {
    const response = await fetch('/api/gemini/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, input })
    });
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.stdout === 'string') {
        const endTime = performance.now();
        return {
          stdout: data.stdout,
          stderr: data.stderr || '',
          runtimeMs: Math.max(10, Math.round(data.runtimeMs || endTime - startTime)),
          isError: Boolean(data.isError)
        };
      }
    }
  } catch {
    // Offline or API unavailable -> return genuine local error
  }

  const endTime = performance.now();
  return {
    stdout: localRes.stdout,
    stderr: localRes.stderr,
    runtimeMs: Math.round(endTime - startTime),
    isError: true
  };
}

/**
 * Grade all test cases (sample + hidden) accurately
 */
export async function judgeProblem(
  problem: CodingProblem,
  language: CodeLanguage,
  code: string
): Promise<{
  results: TestResult[];
  passedCount: number;
  totalCount: number;
  score: number;
  verdict: 'Accepted' | 'Partial' | 'Wrong Answer' | 'Compile Error';
}> {
  const allCases: TestCase[] = [...problem.sampleCases, ...problem.hiddenCases];
  const results: TestResult[] = [];
  let passedCount = 0;
  let compileError = false;

  for (let i = 0; i < allCases.length; i++) {
    const tc = allCases[i];
    const exec = await executeCode(problem.id, language, code, tc.input);

    if (exec.isError) {
      if (exec.stderr.toLowerCase().includes('compile')) compileError = true;
      results.push({
        testId: tc.id,
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: exec.stderr,
        runtimeMs: exec.runtimeMs,
        status: exec.stderr.includes('TLE') ? 'Time Limit Exceeded' : 'Runtime Error'
      });
      continue;
    }

    const actualTrimmed = exec.stdout.trim();
    const expectedTrimmed = tc.expectedOutput.trim();
    const passed = compareOutputs(actualTrimmed, expectedTrimmed);

    if (passed) passedCount++;

    results.push({
      testId: tc.id,
      passed,
      input: tc.input,
      expected: expectedTrimmed,
      actual: actualTrimmed,
      runtimeMs: exec.runtimeMs,
      status: passed ? 'Accepted' : 'Wrong Answer'
    });
  }

  const score = allCases.length > 0 ? Math.round((passedCount / allCases.length) * 100) : 100;
  let verdict: 'Accepted' | 'Partial' | 'Wrong Answer' | 'Compile Error' = 'Wrong Answer';
  if (compileError && passedCount === 0) verdict = 'Compile Error';
  else if (score === 100) verdict = 'Accepted';
  else if (score > 0) verdict = 'Partial';

  return {
    results,
    passedCount,
    totalCount: allCases.length,
    score,
    verdict
  };
}
