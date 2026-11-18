import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  PanelLeftOpen,
  PanelLeftClose,
  Terminal,
  Sparkles,
  Plus,
  Minus,
  Search,
  Replace,
  X,
  Undo2,
  Redo2,
  ChevronUp,
  ChevronDown,
  Hash,
  Sliders,
  HelpCircle,
  Download
} from 'lucide-react';
import { ViewportPortal } from '../common/ViewportPortal';

export type SublimeSyntaxLang = 'cpp' | 'python' | 'text';

// ============================================================================
// AUTHENTIC SUBLIME TEXT 4 (MONOKAI) SYNTAX TOKENIZER
// Exact Monokai palette:
//   bg:        #272822
//   chrome:    #1e1f1c / #171814
//   lineHi:    #3e3d32
//   selection: #49483e
//   comment:   #75715e (italic)
//   keyword:   #f92672 (pink/red)
//   type/bi:   #66d9ef (cyan, italic on storage)
//   func:      #a6e22e (green)
//   string:    #e6db74 (yellow)
//   number:    #ae81ff (purple)
//   param:     #fd971f (orange)
//   fg:        #f8f8f2
// ============================================================================

interface TokenSpan {
  text: string;
  color: string;
  italic?: boolean;
  bold?: boolean;
}

const CPP_KEYWORDS = new Set([
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue',
  'return', 'goto', 'using', 'namespace', 'try', 'catch', 'throw', 'new', 'delete',
  'sizeof', 'typeof', 'operator', 'template', 'typename', 'typedef', 'struct', 'class',
  'public', 'private', 'protected', 'friend', 'virtual', 'override', 'static', 'inline',
  'extern', 'volatile', 'explicit'
]);

const CPP_STORAGE_TYPES = new Set([
  'int', 'long', 'short', 'double', 'float', 'bool', 'char', 'void', 'auto', 'const',
  'unsigned', 'signed', 'size_t', 'll', 'ull', 'string', 'vector', 'pair', 'map',
  'unordered_map', 'set', 'unordered_set', 'multiset', 'queue', 'deque', 'stack',
  'priority_queue', 'array', 'bitset', 'tuple', 'iterator'
]);

const CPP_STD_BUILTINS = new Set([
  'std', 'cin', 'cout', 'cerr', 'endl', 'getline', 'ios_base', 'ios', 'sync_with_stdio',
  'tie', 'sort', 'stable_sort', 'reverse', 'lower_bound', 'upper_bound', 'binary_search',
  'min', 'max', 'swap', 'abs', 'sqrt', 'pow', 'floor', 'ceil', 'round', 'log', 'log2',
  'gcd', '__gcd', 'make_pair', 'push_back', 'pop_back', 'emplace_back', 'push', 'pop',
  'top', 'front', 'back', 'empty', 'size', 'length', 'begin', 'end', 'find', 'count',
  'insert', 'erase', 'assign', 'resize', 'clear', 'first', 'second', 'fixed', 'setprecision',
  'stoi', 'stoll', 'to_string', 'isalnum', 'isalpha', 'isdigit', 'tolower', 'toupper',
  'fill', 'memset', 'memcpy', 'accumulate', 'next_permutation', 'greater', 'less', 'main'
]);

const CPP_CONSTANTS = new Set(['true', 'false', 'NULL', 'nullptr', 'INF', 'MOD', 'INT_MAX', 'INT_MIN', 'LLONG_MAX']);

const PY_KEYWORDS = new Set([
  'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'return', 'yield',
  'pass', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with',
  'assert', 'del', 'in', 'is', 'not', 'and', 'or', 'async', 'await'
]);

const PY_STORAGE = new Set(['def', 'class', 'lambda', 'global', 'nonlocal']);

const PY_BUILTINS = new Set([
  'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'len', 'range',
  'print', 'input', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round', 'pow',
  'divmod', 'sorted', 'reversed', 'enumerate', 'zip', 'all', 'any', 'chr', 'ord',
  'open', 'isinstance', 'type', 'id', 'hash', 'hex', 'bin', 'sys', 'math', 'heapq',
  'bisect', 'itertools', 'collections', 'defaultdict', 'Counter', 'deque', 'stdin',
  'read', 'split', 'strip', 'lower', 'upper', 'append', 'extend', 'pop', 'join',
  'items', 'keys', 'values', 'get', 'isalnum', 'isalpha', 'isdigit', 'heappush',
  'heappop', 'bisect_left', 'bisect_right', 'accumulate', 'sqrt', 'gcd', 'lcm', 'ceil', 'floor'
]);

const PY_CONSTANTS = new Set(['True', 'False', 'None', 'self', 'cls', '__name__', 'INF', 'MOD']);

function tokenizeLineMonokai(line: string, lang: SublimeSyntaxLang): TokenSpan[] {
  if (!line) return [{ text: ' ', color: '#f8f8f2' }];
  if (lang === 'text') return [{ text: line, color: '#f8f8f2' }];

  const spans: TokenSpan[] = [];
  const push = (text: string, color: string, italic = false, bold = false) => {
    if (!text) return;
    const last = spans[spans.length - 1];
    if (last && last.color === color && !!last.italic === italic && !!last.bold === bold) {
      last.text += text;
    } else {
      spans.push({ text, color, italic, bold });
    }
  };

  let i = 0;
  const n = line.length;

  // C++ Preprocessor directive at line start (#include <iostream>, #define ...)
  if (lang === 'cpp' && /^\s*#/.test(line)) {
    const wsMatch = line.match(/^(\s*)(#[A-Za-z_]*)(.*)$/);
    if (wsMatch) {
      if (wsMatch[1]) push(wsMatch[1], '#f8f8f2');
      push(wsMatch[2], '#f92672');
      const rest = wsMatch[3];
      // Highlight <header> or "header" in yellow, rest tokenized
      const headerMatch = rest.match(/^(\s*)(<[^>]+>|"[^"]+")(.*)$/);
      if (headerMatch) {
        if (headerMatch[1]) push(headerMatch[1], '#f8f8f2');
        push(headerMatch[2], '#e6db74');
        if (headerMatch[3]) {
          for (const t of tokenizeLineMonokai(headerMatch[3], 'cpp')) {
            push(t.text, t.color, !!t.italic, !!t.bold);
          }
        }
        return spans;
      }
      if (rest) {
        for (const t of tokenizeLineMonokai(rest, 'cpp')) {
          push(t.text, t.color, !!t.italic, !!t.bold);
        }
      }
      return spans;
    }
  }

  let expectFuncName = false;
  let expectParamList = false;

  while (i < n) {
    const ch = line[i];

    // Whitespace
    if (/\s/.test(ch)) {
      let j = i;
      while (j < n && /\s/.test(line[j])) j++;
      push(line.slice(i, j), '#f8f8f2');
      i = j;
      continue;
    }

    // Comments
    if (lang === 'cpp' && ch === '/' && line[i + 1] === '/') {
      push(line.slice(i), '#75715e', true);
      break;
    }
    if (lang === 'cpp' && ch === '/' && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2);
      if (end === -1) {
        push(line.slice(i), '#75715e', true);
        break;
      }
      push(line.slice(i, end + 2), '#75715e', true);
      i = end + 2;
      continue;
    }
    if (lang === 'python' && ch === '#') {
      push(line.slice(i), '#75715e', true);
      break;
    }

    // Python triple quotes (single-line)
    if (lang === 'python' && (line.slice(i, i + 3) === '"""' || line.slice(i, i + 3) === "'''")) {
      const q3 = line.slice(i, i + 3);
      const end = line.indexOf(q3, i + 3);
      if (end === -1) {
        push(line.slice(i), '#75715e', true);
        break;
      }
      push(line.slice(i, end + 3), '#75715e', true);
      i = end + 3;
      continue;
    }

    // Python f-string / r-string prefix
    if (
      lang === 'python' &&
      (ch === 'f' || ch === 'r' || ch === 'F' || ch === 'R') &&
      (line[i + 1] === '"' || line[i + 1] === "'")
    ) {
      push(ch, '#66d9ef', true);
      i++;
      continue;
    }

    // String / Char literal
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < n) {
        if (line[j] === '\\') {
          j += 2;
          continue;
        }
        if (line[j] === q) {
          j++;
          break;
        }
        j++;
      }
      push(line.slice(i, j), '#e6db74');
      i = j;
      continue;
    }

    // Numbers (integers, floats, 1e18, 1LL, hex 0xff)
    if (/[0-9]/.test(ch)) {
      let j = i;
      if (line.slice(i, i + 2).toLowerCase() === '0x') {
        j += 2;
        while (j < n && /[0-9a-fA-F]/.test(line[j])) j++;
      } else {
        while (j < n && /[0-9._]/.test(line[j])) j++;
        if (j < n && (line[j] === 'e' || line[j] === 'E')) {
          j++;
          if (line[j] === '+' || line[j] === '-') j++;
          while (j < n && /[0-9]/.test(line[j])) j++;
        }
        if (lang === 'cpp') {
          while (j < n && /[uUlLfF]/.test(line[j])) j++;
        }
      }
      push(line.slice(i, j), '#ae81ff');
      i = j;
      continue;
    }

    // Identifiers / Keywords / Types / Functions
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const after = line.slice(j).trimStart();
      const isCall = after.startsWith('(');

      if (lang === 'cpp') {
        if (CPP_KEYWORDS.has(word)) {
          push(word, '#f92672');
          expectFuncName = false;
        } else if (CPP_STORAGE_TYPES.has(word)) {
          push(word, '#66d9ef', true);
        } else if (CPP_CONSTANTS.has(word)) {
          push(word, '#ae81ff');
        } else if (CPP_STD_BUILTINS.has(word)) {
          if (word === 'main') {
            push(word, '#a6e22e');
          } else {
            push(word, '#66d9ef');
          }
        } else if (isCall) {
          push(word, '#a6e22e');
        } else if (expectParamList && /^[a-z]/.test(word)) {
          push(word, '#fd971f', true);
        } else {
          push(word, '#f8f8f2');
        }
      } else {
        // Python
        if (PY_STORAGE.has(word)) {
          push(word, '#66d9ef', true);
          expectFuncName = word === 'def' || word === 'class';
        } else if (PY_KEYWORDS.has(word)) {
          push(word, '#f92672');
          expectFuncName = false;
        } else if (PY_CONSTANTS.has(word)) {
          push(word, word === 'self' || word === 'cls' ? '#fd971f' : '#ae81ff', word === 'self' || word === 'cls');
        } else if (expectFuncName) {
          push(word, '#a6e22e');
          expectFuncName = false;
          expectParamList = true;
        } else if (PY_BUILTINS.has(word)) {
          push(word, '#66d9ef');
        } else if (isCall) {
          push(word, '#a6e22e');
        } else if (expectParamList) {
          push(word, '#fd971f', true);
        } else {
          push(word, '#f8f8f2');
        }
      }
      i = j;
      continue;
    }

    // Multi-char operators
    const two = line.slice(i, i + 2);
    if (['<<', '>>', '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '::', '->', '**'].includes(two)) {
      push(two, two === '::' ? '#66d9ef' : '#f92672');
      i += 2;
      continue;
    }

    // Single-char operators vs punctuation
    if ('+-*/%=<>!&|^~?:'.includes(ch)) {
      push(ch, '#f92672');
      i++;
      continue;
    }

    if (ch === ')') expectParamList = false;
    push(ch, '#f8f8f2');
    i++;
  }

  return spans;
}

// ============================================================================
// READ-ONLY MONOKAI CODE BLOCK (Used for CS lessons & AC Solutions)
// ============================================================================

interface MonokaiCodeBlockProps {
  code: string;
  language: SublimeSyntaxLang;
  title?: string;
  showLineNumbers?: boolean;
  maxHeightClass?: string;
  onCopy?: () => void;
  copied?: boolean;
}

export const MonokaiCodeBlock: React.FC<MonokaiCodeBlockProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  maxHeightClass = 'max-h-[420px]',
  onCopy,
  copied = false
}) => {
  const [localCopied, setLocalCopied] = useState(false);
  const lines = useMemo(() => (code || '').replace(/\r\n/g, '\n').split('\n'), [code]);

  const handleCopyClick = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(code);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 1800);
    }
  };

  const isCopied = copied || localCopied;

  return (
    <div className="rounded-md overflow-hidden border border-slate-800 bg-[#131722] shadow-lg font-mono text-xs sci-frame">
      {/* Synchronized Synapse Architectural Code Header */}
      <div className="h-9 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            <span className="w-2 h-2 rounded-[1px] bg-sky-400" />
            <span className="w-2 h-2 rounded-[1px] bg-teal-400" />
            <span className="w-2 h-2 rounded-[1px] bg-slate-600" />
          </div>
          <div className="ml-1.5 px-3 h-7 mt-2 rounded-t-[4px] bg-[#131722] text-slate-100 text-[11px] flex items-center gap-1.5 border-t-2 border-t-sky-400 border-x border-slate-800 truncate">
            <span className="truncate">{title || (language === 'cpp' ? 'main.cpp' : 'solution.py')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="hidden sm:inline text-[10px] font-semibold text-sky-400">
            {language === 'cpp' ? 'C++20' : language === 'python' ? 'Python 3' : 'Text'}
          </span>
          <button
            onClick={handleCopyClick}
            className="sheen-btn px-2.5 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 text-slate-200 text-[11px] flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Highlighted Lines (Authentic Monokai Token Palette) */}
      <div className={`overflow-auto ${maxHeightClass} py-2.5 bg-[#131722]`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((ln, idx) => {
              const tokens = tokenizeLineMonokai(ln, language);
              return (
                <tr key={idx} className="hover:bg-slate-800/55 transition-colors">
                  {showLineNumbers && (
                    <td className="w-11 select-none text-right pr-3 pl-2 text-slate-500 text-[11px] align-top leading-6 tabular-nums">
                      {idx + 1}
                    </td>
                  )}
                  <td className="pr-4 pl-1 whitespace-pre leading-6 text-[13px] text-[#f8f8f2]">
                    {tokens.map((tok, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          color: tok.color,
                          fontStyle: tok.italic ? 'italic' : 'normal',
                          fontWeight: tok.bold ? 600 : 400
                        }}
                      >
                        {tok.text}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// INTERACTIVE SUBLIME TEXT 4 MONOKAI EDITOR
// Pixel-accurate overlay + Active line highlight + Gutter + Minimap + Status bar
// ============================================================================

export interface SublimeTabItem {
  id: string;
  label: string;
  language: SublimeSyntaxLang;
  dirty?: boolean;
}

interface SublimeEditorProps {
  value: string;
  onChange: (newVal: string) => void;
  language: SublimeSyntaxLang;
  tabs?: SublimeTabItem[];
  activeTabId?: string;
  onSelectTab?: (id: string) => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  onRun?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isConsoleOpen?: boolean;
  onToggleConsole?: () => void;
  placeholder?: string;
  heightClass?: string;
  statusRightExtra?: string;
}

export const SublimeEditor: React.FC<SublimeEditorProps> = ({
  value,
  onChange,
  language,
  tabs,
  activeTabId,
  onSelectTab,
  fontSize = 14,
  onFontSizeChange,
  onRun,
  onSave,
  onReset,
  isFullscreen = false,
  onToggleFullscreen,
  isSidebarOpen,
  onToggleSidebar,
  isConsoleOpen,
  onToggleConsole,
  placeholder,
  heightClass = 'flex-1 min-h-0',
  statusRightExtra
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [menuAnchor, setMenuAnchor] = useState<{ name: string; left: number; top: number } | null>(null);

  // Undo / Redo stack (per editor session)
  const [historyStack, setHistoryStack] = useState<{ past: string[]; future: string[] }>({
    past: [],
    future: []
  });
  const lastTrackedRef = useRef<string>(value);
  useEffect(() => {
    lastTrackedRef.current = value;
  }, [value]);

  const applyChangeWithHistory = useCallback(
    (nextVal: string) => {
      if (nextVal !== lastTrackedRef.current) {
        setHistoryStack((prev) => ({
          past: [...prev.past.slice(-60), lastTrackedRef.current],
          future: []
        }));
        lastTrackedRef.current = nextVal;
      }
      onChange(nextVal);
    },
    [onChange]
  );

  const handleUndo = useCallback(() => {
    setHistoryStack((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      lastTrackedRef.current = previous;
      onChange(previous);
      return {
        past: prev.past.slice(0, -1),
        future: [value, ...prev.future.slice(0, 60)]
      };
    });
  }, [onChange, value]);

  const handleRedo = useCallback(() => {
    setHistoryStack((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      lastTrackedRef.current = next;
      onChange(next);
      return {
        past: [...prev.past.slice(-60), value],
        future: prev.future.slice(1)
      };
    });
  }, [onChange, value]);

  // Inline Find & Replace + Goto Line + Preferences + Help state
  const [showFindBar, setShowFindBar] = useState<boolean>(false);
  const [showReplaceRow, setShowReplaceRow] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [replaceQuery, setReplaceQuery] = useState<string>('');
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [findMatchIdx, setFindMatchIdx] = useState<number>(0);

  const [showGotoBar, setShowGotoBar] = useState<boolean>(false);
  const [gotoInput, setGotoInput] = useState<string>('');
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showSnippetsDrawer, setShowSnippetsDrawer] = useState<boolean>(false);

  // Preferences
  const [tabWidth, setTabWidth] = useState<2 | 4>(4);
  const [wordWrap, setWordWrap] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const flashToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((cur) => (cur === msg ? null : cur)), 1800);
  }, []);

  const lines = useMemo(() => value.replace(/\r\n/g, '\n').split('\n'), [value]);
  const lineHeightPx = Math.round(fontSize * 1.6);
  const indentUnit = ' '.repeat(tabWidth);

  const tokenizedLines = useMemo(
    () => lines.map((line) => tokenizeLineMonokai(line, language)),
    [lines, language]
  );

  // Find matches indices
  const findMatches = useMemo(() => {
    if (!findQuery) return [] as { start: number; end: number }[];
    const haystack = matchCase ? value : value.toLowerCase();
    const needle = matchCase ? findQuery : findQuery.toLowerCase();
    const res: { start: number; end: number }[] = [];
    let pos = 0;
    while (pos <= haystack.length - needle.length && res.length < 500) {
      const idx = haystack.indexOf(needle, pos);
      if (idx === -1) break;
      res.push({ start: idx, end: idx + needle.length });
      pos = idx + Math.max(1, needle.length);
    }
    return res;
  }, [value, findQuery, matchCase]);

  const jumpToRange = useCallback(
    (start: number, end: number) => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.selectionStart = start;
      ta.selectionEnd = end;
      const lineIdx = value.slice(0, start).split('\n').length - 1;
      setCursorPos({
        line: lineIdx + 1,
        col: start - value.lastIndexOf('\n', start - 1)
      });
      if (scrollerRef.current) {
        const targetTop = Math.max(0, lineIdx * lineHeightPx - scrollerRef.current.clientHeight / 3);
        scrollerRef.current.scrollTop = targetTop;
        setScrollTop(targetTop);
      }
    },
    [lineHeightPx, value]
  );

  const handleFindStep = (dir: 1 | -1) => {
    if (findMatches.length === 0) return;
    const nextIdx = (findMatchIdx + dir + findMatches.length) % findMatches.length;
    setFindMatchIdx(nextIdx);
    const hit = findMatches[nextIdx];
    jumpToRange(hit.start, hit.end);
  };

  const handleReplaceCurrent = () => {
    if (findMatches.length === 0) return;
    const idx = Math.min(findMatchIdx, findMatches.length - 1);
    const hit = findMatches[idx];
    const nextVal = value.slice(0, hit.start) + replaceQuery + value.slice(hit.end);
    applyChangeWithHistory(nextVal);
    requestAnimationFrame(() => jumpToRange(hit.start, hit.start + replaceQuery.length));
  };

  const handleReplaceAll = () => {
    if (!findQuery || findMatches.length === 0) return;
    let out = '';
    let last = 0;
    for (const m of findMatches) {
      out += value.slice(last, m.start) + replaceQuery;
      last = m.end;
    }
    out += value.slice(last);
    applyChangeWithHistory(out);
    flashToast(`Đã thay thế ${findMatches.length} vị trí`);
  };

  const handleGotoLine = (lineNumStr?: string) => {
    const raw = (lineNumStr ?? gotoInput).trim().replace(/^:/, '');
    const target = Number(raw);
    if (!Number.isFinite(target) || target < 1) return;
    const clamped = Math.min(lines.length, Math.max(1, Math.floor(target)));
    let offset = 0;
    for (let i = 0; i < clamped - 1; i++) {
      offset += lines[i].length + 1;
    }
    jumpToRange(offset, offset);
    setShowGotoBar(false);
    setGotoInput('');
  };

  const updateCursorFromTarget = useCallback((target: HTMLTextAreaElement) => {
    const upto = target.value.slice(0, target.selectionStart);
    const split = upto.split('\n');
    setCursorPos({
      line: split.length,
      col: split[split.length - 1].length + 1
    });
  }, []);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    if (scrollerRef.current) {
      setScrollTop(scrollerRef.current.scrollTop);
    }
  }, [value, fontSize]);

  const insertSnippet = (snippet: string, cursorBack = 0) => {
    const ta = textareaRef.current;
    if (!ta) {
      applyChangeWithHistory(value + snippet);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const nextVal = value.slice(0, start) + snippet + value.slice(end);
    applyChangeWithHistory(nextVal);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length - cursorBack;
      ta.selectionStart = ta.selectionEnd = pos;
      updateCursorFromTarget(ta);
    });
  };

  // Line-based Edit actions shared by menu buttons & keyboard shortcuts
  const getCurrentLineRange = () => {
    const ta = textareaRef.current;
    const pos = ta ? ta.selectionStart : 0;
    const lineIdx = value.slice(0, pos).split('\n').length - 1;
    return { ta, pos, lineIdx };
  };

  const duplicateCurrentLine = () => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    arr.splice(lineIdx + 1, 0, arr[lineIdx]);
    applyChangeWithHistory(arr.join('\n'));
  };

  const deleteCurrentLine = () => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    if (arr.length <= 1) {
      applyChangeWithHistory('');
      return;
    }
    arr.splice(lineIdx, 1);
    applyChangeWithHistory(arr.join('\n'));
  };

  const moveCurrentLine = (dir: -1 | 1) => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    const targetIdx = lineIdx + dir;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    const tmp = arr[lineIdx];
    arr[lineIdx] = arr[targetIdx];
    arr[targetIdx] = tmp;
    applyChangeWithHistory(arr.join('\n'));
    setCursorPos((p) => ({ ...p, line: targetIdx + 1 }));
  };

  const joinWithNextLine = () => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    if (lineIdx >= arr.length - 1) return;
    arr[lineIdx] = arr[lineIdx].trimEnd() + ' ' + arr[lineIdx + 1].trimStart();
    arr.splice(lineIdx + 1, 1);
    applyChangeWithHistory(arr.join('\n'));
  };

  const toggleCurrentLineComment = () => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    const prefix = language === 'python' ? '# ' : '// ';
    const cur = arr[lineIdx];
    if (cur.trimStart().startsWith(prefix.trim())) {
      arr[lineIdx] = cur.replace(prefix, '').replace(prefix.trim(), '');
    } else {
      arr[lineIdx] = prefix + cur;
    }
    applyChangeWithHistory(arr.join('\n'));
  };

  const indentCurrentLine = (outdent = false) => {
    const { lineIdx } = getCurrentLineRange();
    const arr = value.split('\n');
    if (!outdent) {
      arr[lineIdx] = indentUnit + arr[lineIdx];
    } else {
      if (arr[lineIdx].startsWith(indentUnit)) arr[lineIdx] = arr[lineIdx].slice(tabWidth);
      else arr[lineIdx] = arr[lineIdx].replace(/^\s+/, '');
    }
    applyChangeWithHistory(arr.join('\n'));
  };

  const transformSelectionOrLine = (mode: 'upper' | 'lower' | 'trim' | 'sort_lines') => {
    if (mode === 'sort_lines') {
      const sorted = [...lines].sort((a, b) => a.localeCompare(b));
      applyChangeWithHistory(sorted.join('\n'));
      flashToast('Đã sắp xếp các dòng A → Z');
      return;
    }
    if (mode === 'trim') {
      applyChangeWithHistory(lines.map((l) => l.replace(/\s+$/, '')).join('\n'));
      flashToast('Đã xóa khoảng trắng dư cuối dòng');
      return;
    }
    const ta = textareaRef.current;
    if (!ta || ta.selectionStart === ta.selectionEnd) {
      const { lineIdx } = getCurrentLineRange();
      const arr = [...lines];
      arr[lineIdx] = mode === 'upper' ? arr[lineIdx].toUpperCase() : arr[lineIdx].toLowerCase();
      applyChangeWithHistory(arr.join('\n'));
    } else {
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      const sub = value.slice(s, e);
      const rep = mode === 'upper' ? sub.toUpperCase() : sub.toLowerCase();
      applyChangeWithHistory(value.slice(0, s) + rep + value.slice(e));
    }
  };

  const selectCurrentLine = () => {
    const { lineIdx } = getCurrentLineRange();
    let start = 0;
    for (let i = 0; i < lineIdx; i++) start += lines[i].length + 1;
    const end = start + (lines[lineIdx]?.length || 0);
    jumpToRange(start, end);
  };

  const selectCurrentWord = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    let s = pos;
    let e = pos;
    while (s > 0 && /[A-Za-z0-9_]/.test(value[s - 1])) s--;
    while (e < value.length && /[A-Za-z0-9_]/.test(value[e])) e++;
    jumpToRange(s, e);
  };

  const expandSelectionToBrackets = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const openChars = new Set(['(', '[', '{']);
    const matchMap: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
    let depth = 0;
    let openIdx = -1;
    for (let i = pos - 1; i >= 0; i--) {
      const ch = value[i];
      if (ch === ')' || ch === ']' || ch === '}') depth++;
      else if (openChars.has(ch)) {
        if (depth === 0) {
          openIdx = i;
          break;
        }
        depth--;
      }
    }
    if (openIdx === -1) return;
    const closeCh = matchMap[value[openIdx]];
    depth = 0;
    for (let j = openIdx + 1; j < value.length; j++) {
      if (value[j] === value[openIdx]) depth++;
      else if (value[j] === closeCh) {
        if (depth === 0) {
          jumpToRange(openIdx, j + 1);
          return;
        }
        depth--;
      }
    }
  };

  const handleDownloadFile = () => {
    const ext = language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'txt';
    const fname = `solution_${Date.now()}.${ext}`;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    flashToast(`Đã tải về ${fname}`);
  };

  const cpSnippets = useMemo(
    () =>
      language === 'python'
        ? [
            {
              label: 'Fast I/O (sys.stdin)',
              code: 'import sys\ninput = sys.stdin.readline\n\ndef solve():\n    n = int(input())\n    arr = list(map(int, input().split()))\n    print(sum(arr))\n\nsolve()\n'
            },
            {
              label: 'BFS Graph Template',
              code: 'from collections import deque\n\ndef bfs(start, adj, n):\n    dist = [-1] * (n + 1)\n    q = deque([start])\n    dist[start] = 0\n    while q:\n        u = q.popleft()\n        for v in adj[u]:\n            if dist[v] == -1:\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist\n'
            },
            {
              label: 'Binary Search Template',
              code: 'def binary_search_first(lo, hi, check):\n    ans = -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if check(mid):\n            ans = mid\n            hi = mid - 1\n        else:\n            lo = mid + 1\n    return ans\n'
            }
          ]
        : [
            {
              label: 'Fast I/O & Main',
              code: '#include <bits/stdc++.h>\nusing namespace std;\nusing ll = long long;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    \n    return 0;\n}\n'
            },
            {
              label: 'BFS (Queue + Dist)',
              code: 'vector<int> dist(n + 1, -1);\nqueue<int> q;\ndist[start] = 0;\nq.push(start);\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u]) {\n        if (dist[v] == -1) {\n            dist[v] = dist[u] + 1;\n            q.push(v);\n        }\n    }\n}\n'
            },
            {
              label: 'Dijkstra Shortest Path',
              code: 'const long long INF = 1e18;\nvector<long long> d(n + 1, INF);\npriority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;\nd[s] = 0;\npq.push({0, s});\nwhile (!pq.empty()) {\n    auto [du, u] = pq.top(); pq.pop();\n    if (du != d[u]) continue;\n    for (auto [v, w] : adj[u]) {\n        if (d[u] + w < d[v]) {\n            d[v] = d[u] + w;\n            pq.push({d[v], v});\n        }\n    }\n}\n'
            },
            {
              label: 'Binary Search (Upper/Lower)',
              code: 'long long lo = 0, hi = 1e18, ans = -1;\nwhile (lo <= hi) {\n    long long mid = lo + (hi - lo) / 2;\n    if (ok(mid)) {\n        ans = mid;\n        hi = mid - 1;\n    } else {\n        lo = mid + 1;\n    }\n}\n'
            },
            {
              label: '0/1 Knapsack DP',
              code: 'vector<long long> dp(W + 1, 0);\nfor (int i = 0; i < n; ++i) {\n    for (int j = W; j >= weight[i]; --j) {\n        dp[j] = max(dp[j], dp[j - weight[i]] + val[i]);\n    }\n}\n'
            }
          ],
    [language]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current;
    if (!ta) return;

    // Undo / Redo: Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) handleRedo();
      else handleUndo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Find & Replace: Ctrl+F / Ctrl+H
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setShowFindBar(true);
      setShowReplaceRow(false);
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      setShowFindBar(true);
      setShowReplaceRow(true);
      return;
    }

    // Goto Line: Ctrl+G
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      setShowGotoBar((p) => !p);
      return;
    }

    // Delete Line: Ctrl+Shift+K
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      deleteCurrentLine();
      return;
    }

    // Select Line: Ctrl+L
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      selectCurrentLine();
      return;
    }

    // Move Line Up/Down: Ctrl+Shift+ArrowUp / ArrowDown
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      moveCurrentLine(e.key === 'ArrowUp' ? -1 : 1);
      return;
    }

    // Join Lines: Ctrl+J
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      joinWithNextLine();
      return;
    }

    // Build / Run: Ctrl+Enter, Cmd+Enter, or Ctrl+B
    if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.key.toLowerCase() === 'b')) {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    // Save: Ctrl+S / Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (onSave) onSave();
      flashToast('Đã lưu file tạm thời');
      return;
    }

    // F11 Fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      if (onToggleFullscreen) onToggleFullscreen();
      return;
    }

    // Duplicate Line: Ctrl+Shift+D or Ctrl+D (when no selection)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (start === end || e.shiftKey) {
        e.preventDefault();
        duplicateCurrentLine();
        return;
      }
    }

    // Toggle comment: Ctrl+/
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleCurrentLineComment();
      return;
    }

    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = value.slice(0, start);
      const currentLine = before.split('\n').pop() || '';
      const baseIndent = currentLine.match(/^(\s*)/)?.[1] || '';
      const trimmedEnd = currentLine.trimEnd();
      const extra =
        (language === 'cpp' && trimmedEnd.endsWith('{')) ||
        (language === 'python' && trimmedEnd.endsWith(':'))
          ? indentUnit
          : '';
      const after = value.slice(end);
      // Special `{}` brace expansion on Enter
      if (language === 'cpp' && before.endsWith('{') && after.startsWith('}')) {
        e.preventDefault();
        const insert = `\n${baseIndent}${indentUnit}\n${baseIndent}`;
        applyChangeWithHistory(before + insert + after);
        const caretPos = start + 1 + baseIndent.length + tabWidth;
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = caretPos;
          updateCursorFromTarget(ta);
        });
        return;
      }
      if (baseIndent || extra) {
        e.preventDefault();
        const insert = '\n' + baseIndent + extra;
        applyChangeWithHistory(before + insert + after);
        const caretPos = start + insert.length;
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = caretPos;
          updateCursorFromTarget(ta);
        });
        return;
      }
    }

    // Tab / Shift+Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (!e.shiftKey) {
        applyChangeWithHistory(value.slice(0, start) + indentUnit + value.slice(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + tabWidth;
          updateCursorFromTarget(ta);
        });
      } else {
        indentCurrentLine(true);
      }
      return;
    }

    // Auto-pair brackets/quotes
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const close = pairs[e.key];
        applyChangeWithHistory(value.slice(0, start) + e.key + close + value.slice(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 1;
          updateCursorFromTarget(ta);
        });
      }
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      flashToast('Đã sao chép toàn bộ mã nguồn');
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handlePasteClipboard = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) insertSnippet(txt);
    } catch {
      flashToast('Dùng Ctrl+V để dán từ Clipboard');
    }
  };

  const menuActions: Record<string, { label: string; shortcut?: string; action: () => void }[]> = {
    File: [
      {
        label: 'Save File',
        shortcut: 'Ctrl+S',
        action: () => {
          onSave?.();
          flashToast('Đã lưu code');
        }
      },
      { label: 'Download Source (.cpp/.py)', action: handleDownloadFile },
      { label: 'Copy All Code', shortcut: 'Ctrl+C', action: handleCopy },
      ...(onReset ? [{ label: 'Reset Template', action: onReset }] : [])
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: handleUndo },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: handleRedo },
      { label: 'Paste from Clipboard', shortcut: 'Ctrl+V', action: handlePasteClipboard },
      { label: 'Duplicate Line', shortcut: 'Ctrl+D', action: duplicateCurrentLine },
      { label: 'Delete Line', shortcut: 'Ctrl+Shift+K', action: deleteCurrentLine },
      { label: 'Move Line Up', shortcut: 'Ctrl+Shift+↑', action: () => moveCurrentLine(-1) },
      { label: 'Move Line Down', shortcut: 'Ctrl+Shift+↓', action: () => moveCurrentLine(1) },
      { label: 'Join Lines', shortcut: 'Ctrl+J', action: joinWithNextLine },
      { label: 'Toggle Comment', shortcut: 'Ctrl+/', action: toggleCurrentLineComment },
      { label: 'Indent Line', shortcut: 'Tab', action: () => indentCurrentLine(false) },
      { label: 'Unindent Line', shortcut: 'Shift+Tab', action: () => indentCurrentLine(true) },
      { label: 'UPPERCASE Selection / Line', action: () => transformSelectionOrLine('upper') },
      { label: 'lowercase Selection / Line', action: () => transformSelectionOrLine('lower') },
      { label: 'Trim Trailing Whitespace', action: () => transformSelectionOrLine('trim') },
      { label: 'Sort Lines (A → Z)', action: () => transformSelectionOrLine('sort_lines') }
    ],
    Selection: [
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => jumpToRange(0, value.length) },
      { label: 'Select Current Line', shortcut: 'Ctrl+L', action: selectCurrentLine },
      { label: 'Select Current Word', action: selectCurrentWord },
      { label: 'Expand to Brackets', shortcut: '(){ }[]', action: expandSelectionToBrackets }
    ],
    Find: [
      {
        label: 'Find...',
        shortcut: 'Ctrl+F',
        action: () => {
          setShowFindBar(true);
          setShowReplaceRow(false);
        }
      },
      {
        label: 'Replace...',
        shortcut: 'Ctrl+H',
        action: () => {
          setShowFindBar(true);
          setShowReplaceRow(true);
        }
      },
      { label: 'Find Next', shortcut: 'F3', action: () => handleFindStep(1) },
      { label: 'Find Previous', shortcut: 'Shift+F3', action: () => handleFindStep(-1) }
    ],
    View: [
      ...(onToggleSidebar
        ? [{ label: isSidebarOpen ? 'Hide Side Bar' : 'Show Side Bar', shortcut: 'Ctrl+K, B', action: onToggleSidebar }]
        : []),
      ...(onToggleConsole
        ? [{ label: isConsoleOpen ? 'Hide Console' : 'Show Console', action: onToggleConsole }]
        : []),
      ...(onToggleFullscreen
        ? [{ label: isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen', shortcut: 'F11', action: onToggleFullscreen }]
        : []),
      {
        label: showMinimap ? 'Hide Minimap' : 'Show Minimap',
        action: () => setShowMinimap((p) => !p)
      },
      {
        label: showLineNumbers ? 'Hide Line Numbers' : 'Show Line Numbers',
        action: () => setShowLineNumbers((p) => !p)
      },
      {
        label: wordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap',
        action: () => setWordWrap((p) => !p)
      },
      ...(onFontSizeChange
        ? [
            { label: 'Increase Font Size', shortcut: 'Ctrl++', action: () => onFontSizeChange(Math.min(22, fontSize + 1)) },
            { label: 'Decrease Font Size', shortcut: 'Ctrl+-', action: () => onFontSizeChange(Math.max(11, fontSize - 1)) }
          ]
        : [])
    ],
    Goto: [
      {
        label: 'Goto Line...',
        shortcut: 'Ctrl+G',
        action: () => setShowGotoBar(true)
      },
      { label: 'Jump to Top of File', action: () => jumpToRange(0, 0) },
      { label: 'Jump to Bottom of File', action: () => jumpToRange(value.length, value.length) }
    ],
    Tools: [
      { label: 'Build & Run', shortcut: 'Ctrl+B', action: () => onRun?.() },
      ...(onToggleConsole ? [{ label: 'Toggle Build Output', action: onToggleConsole }] : []),
      {
        label: 'Insert CP Snippet...',
        action: () => setShowSnippetsDrawer((p) => !p)
      }
    ],
    Project: [
      ...cpSnippets.map((s) => ({
        label: `+ ${s.label}`,
        action: () => insertSnippet(s.code)
      })),
      ...(onReset ? [{ label: 'Reset Workspace Template', action: onReset }] : [])
    ],
    Preferences: [
      {
        label: `Indentation: ${tabWidth === 4 ? '4 Spaces (✓)' : '4 Spaces'}`,
        action: () => {
          setTabWidth(4);
          flashToast('Tab width: 4 spaces');
        }
      },
      {
        label: `Indentation: ${tabWidth === 2 ? '2 Spaces (✓)' : '2 Spaces'}`,
        action: () => {
          setTabWidth(2);
          flashToast('Tab width: 2 spaces');
        }
      },
      {
        label: `Word Wrap: ${wordWrap ? 'ON' : 'OFF'}`,
        action: () => setWordWrap((p) => !p)
      },
      {
        label: `Minimap: ${showMinimap ? 'ON' : 'OFF'}`,
        action: () => setShowMinimap((p) => !p)
      }
    ],
    Help: [
      {
        label: 'Keyboard Shortcuts & Guide',
        shortcut: 'F1',
        action: () => setShowShortcutsModal(true)
      },
      {
        label: 'Sublime Monokai C++/Python Reference',
        action: () => setShowSnippetsDrawer(true)
      }
    ]
  };

  const minimapOffsetPercent = Math.min(82, (scrollTop / Math.max(1, lines.length * lineHeightPx)) * 100);

  return (
    <div
      className={`flex flex-col bg-[#131722] text-[#f8f8f2] overflow-hidden select-none ${heightClass}`}
      onClick={() => menuAnchor && setMenuAnchor(null)}
    >
      {/* Portal Menu Dropdown (never clipped by overflow-x-auto or overlapped by right controls) */}
      {menuAnchor && menuActions[menuAnchor.name] && (
        <ViewportPortal active={true}>
          <div
            className="fixed inset-0 z-[155]"
            onClick={() => setMenuAnchor(null)}
          >
            <div
              style={{ left: `${menuAnchor.left}px`, top: `${menuAnchor.top}px` }}
              onClick={(e) => e.stopPropagation()}
              className="fixed w-64 max-h-80 overflow-y-auto bg-slate-950 border border-slate-700 shadow-2xl py-1 rounded-md z-[156]"
            >
              {menuActions[menuAnchor.name].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMenuAnchor(null);
                    item.action();
                  }}
                  className="w-full px-3 py-1.5 text-left text-[11px] text-slate-100 hover:bg-sky-600/25 hover:text-sky-300 flex items-center justify-between gap-2 rounded-none"
                >
                  <span className="truncate">{item.label}</span>
                  {item.shortcut && <span className="text-slate-400 text-[10px] font-mono shrink-0">{item.shortcut}</span>}
                </button>
              ))}
            </div>
          </div>
        </ViewportPortal>
      )}

      {/* Synchronized Top Window Title + Menu Bar (Zero-Overlap Flex Contract) */}
      <div className="bg-slate-950 border-b border-slate-800 px-2.5 h-9 flex items-center justify-between gap-2 text-[11px] text-slate-300 shrink-0">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/60 text-slate-300 hover:text-white transition-colors shrink-0"
              title={isSidebarOpen ? 'Ẩn thanh đề bài (Side Bar)' : 'Hiện thanh đề bài (Side Bar)'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 mr-1 shrink-0" aria-hidden="true">
            <span className="w-2 h-2 rounded-[1px] bg-sky-400" />
            <span className="w-2 h-2 rounded-[1px] bg-teal-400" />
            <span className="w-2 h-2 rounded-[1px] bg-indigo-400" />
          </div>
          {/* Scrollable Menu Strip — mathematically isolated from right controls */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto scrollbar-none pr-1">
            {['File', 'Edit', 'Selection', 'Find', 'View', 'Goto', 'Tools', 'Project', 'Preferences', 'Help'].map((mName) => (
              <button
                key={mName}
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (!menuActions[mName]) return;
                  if (menuAnchor?.name === mName) {
                    setMenuAnchor(null);
                  } else {
                    const rect = ev.currentTarget.getBoundingClientRect();
                    setMenuAnchor({
                      name: mName,
                      left: Math.max(8, Math.min(rect.left, window.innerWidth - 268)),
                      top: rect.bottom + 4
                    });
                  }
                }}
                className={`px-2 py-1 rounded-[4px] text-[11px] whitespace-nowrap shrink-0 transition-colors ${
                  menuAnchor?.name === mName
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {mName}
              </button>
            ))}
          </div>
          <span className="md:hidden text-[11px] font-mono text-sky-400 font-semibold truncate">
            Synapse · Sublime 4
          </span>
        </div>

        {/* Right Quick Window Controls (always shrink-0 & crisp square-cut) */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 pl-1">
          {onFontSizeChange && (
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-[4px] px-1 h-7">
              <button
                type="button"
                onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
                className="p-0.5 hover:text-white text-slate-400"
                title="Giảm cỡ chữ"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-1.5 text-[10px] font-mono text-slate-200 tabular-nums">{fontSize}px</span>
              <button
                type="button"
                onClick={() => onFontSizeChange(Math.min(22, fontSize + 1))}
                className="p-0.5 hover:text-white text-slate-400"
                title="Tăng cỡ chữ"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="px-2 h-7 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/60 text-[11px] flex items-center gap-1 text-slate-200 hover:text-white whitespace-nowrap shrink-0"
            title="Sao chép mã nguồn"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="w-7 h-7 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/60 text-slate-300 hover:text-white flex items-center justify-center shrink-0"
              title="Đặt lại code mẫu"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`sheen-btn px-2.5 h-7 rounded-[4px] border text-[11px] flex items-center gap-1 font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isFullscreen
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25'
              }`}
              title={isFullscreen ? 'Thu nhỏ (Esc / F11)' : 'Toàn màn hình Split-Screen (F11)'}
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Thoát Fullscreen' : 'Fullscreen'}</span>
            </button>
          )}
        </div>
      </div>

      {/* File Tabs Bar (Square architectural top tabs) */}
      {tabs && tabs.length > 0 && (
        <div className="bg-slate-900 border-b border-slate-800 px-2 pt-1.5 flex items-end gap-1 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab?.(tab.id)}
                className={`h-8 px-3.5 rounded-t-[4px] text-xs font-mono flex items-center gap-2 shrink-0 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#131722] text-white font-semibold border-t-2 border-t-sky-400 border-x border-slate-800 shadow-[0_1px_0_#131722]'
                    : 'bg-slate-950/70 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border-t-2 border-t-transparent border-x border-transparent'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-[1px] ${
                    tab.language === 'cpp'
                      ? 'bg-sky-400'
                      : tab.language === 'python'
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.dirty !== false && (
                  <span className={`w-1.5 h-1.5 rounded-[1px] ${isActive ? 'bg-amber-400' : 'bg-slate-600'}`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Editor Canvas: Sticky Gutter + Monokai Token Overlay + Minimap */}
      <div className="relative flex-1 flex bg-[#131722] overflow-hidden min-h-0">
        <div
          ref={scrollerRef}
          onScroll={handleContainerScroll}
          onClick={() => textareaRef.current?.focus()}
          className="relative flex-1 flex items-start overflow-auto bg-[#131722] min-w-0 min-h-0 overscroll-contain cursor-text"
        >
          {/* Sticky Line Numbers Gutter */}
          {showLineNumbers && (
            <div
              className="sticky left-0 z-30 w-11 sm:w-14 bg-[#0f131d] border-r border-slate-800/80 select-none shrink-0 py-3 pb-16 font-mono text-right pr-2.5 sm:pr-3 min-h-full tabular-nums"
              style={{ fontSize: `${Math.max(11, fontSize - 1)}px`, lineHeight: `${lineHeightPx}px` }}
            >
              {Array.from({ length: Math.max(lines.length, 28) }, (_, idx) => {
                const ln = idx + 1;
                const isCurrent = cursorPos.line === ln;
                return (
                  <div
                    key={ln}
                    className={
                      isCurrent
                        ? 'text-sky-300 font-bold bg-sky-500/15 -mr-2.5 sm:-mr-3 pr-2.5 sm:pr-3 border-r-2 border-r-sky-400'
                        : 'text-slate-500'
                    }
                    style={{ height: `${lineHeightPx}px`, lineHeight: `${lineHeightPx}px` }}
                  >
                    {ln}
                  </div>
                );
              })}
            </div>
          )}

          {/* Code Viewport (Single Grid cell sizes 1:1 to exact code dimensions, zero scroll desync) */}
          <div className={`relative flex-1 min-h-full grid bg-[#131722] ${wordWrap ? 'min-w-0 w-full' : 'min-w-max'}`}>
            {/* Active Line Full-Width Highlight Band */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 bg-sky-500/10 border-y border-sky-400/15 z-0"
              style={{
                height: `${lineHeightPx}px`,
                top: `${12 + (cursorPos.line - 1) * lineHeightPx}px`
              }}
            />

            {/* Syntax-Highlighted Monokai Pre Layer */}
            <pre
              aria-hidden="true"
              className={`col-start-1 row-start-1 pointer-events-none m-0 p-3 pb-16 font-mono z-10 select-none ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeightPx}px`,
                tabSize: tabWidth
              }}
            >
              {tokenizedLines.map((tokens, lIdx) => (
                <div
                  key={lIdx}
                  style={wordWrap ? { minHeight: `${lineHeightPx}px`, lineHeight: `${lineHeightPx}px` } : { height: `${lineHeightPx}px`, lineHeight: `${lineHeightPx}px` }}
                >
                  {tokens.length === 0 ? ' ' : tokens.map((tok, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        color: tok.color,
                        fontStyle: tok.italic ? 'italic' : 'normal',
                        fontWeight: tok.bold ? 600 : 400
                      }}
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
              ))}
            </pre>

            {/* Transparent Interactive Textarea Layer (sized 1:1 with Pre in same grid track) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                applyChangeWithHistory(e.target.value);
                updateCursorFromTarget(e.target);
              }}
              onSelect={(e) => updateCursorFromTarget(e.currentTarget)}
              onClick={(e) => updateCursorFromTarget(e.currentTarget)}
              onKeyUp={(e) => updateCursorFromTarget(e.currentTarget)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder={placeholder}
              className={`col-start-1 row-start-1 relative z-20 w-full h-full m-0 p-3 pb-16 font-mono bg-transparent text-transparent caret-sky-300 resize-none focus:outline-none overflow-hidden selection:bg-sky-500/30 selection:text-transparent ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeightPx}px`,
                tabSize: tabWidth,
                WebkitTextFillColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Minimap */}
        {showMinimap && (
          <div className="hidden md:block relative w-20 bg-[#0f131d] border-l border-slate-800/80 p-1.5 select-none overflow-hidden shrink-0 pointer-events-none">
            <div
              className="absolute left-0 right-0 h-14 bg-sky-400/10 border-y border-sky-400/25 transition-all duration-75"
              style={{ top: `${minimapOffsetPercent}%` }}
            />
            <div className="space-y-[2px] opacity-80">
              {lines.slice(0, 120).map((ln, idx) => {
                const trimmed = ln.trim();
                if (!trimmed) return <div key={idx} className="h-[2px]" />;
                let barColor = '#f8f8f2';
                if (trimmed.startsWith('//') || trimmed.startsWith('# ') || trimmed.startsWith('/*')) {
                  barColor = '#75715e';
                } else if (/^#include|^#define|^import\b|^from\b/.test(trimmed)) {
                  barColor = '#f92672';
                } else if (/\b(int|long|vector|def|class|void|string|bool)\b/.test(trimmed)) {
                  barColor = '#66d9ef';
                } else if (/["']/.test(trimmed)) {
                  barColor = '#e6db74';
                } else if (/\b(return|if|else|for|while)\b/.test(trimmed)) {
                  barColor = '#f92672';
                } else if (/\(.*\)/.test(trimmed)) {
                  barColor = '#a6e22e';
                }
                return (
                  <div
                    key={idx}
                    className="h-[2.5px] rounded-[1px]"
                    style={{
                      marginLeft: `${Math.min(18, (ln.length - ln.trimStart().length) * 1.2)}px`,
                      width: `${Math.min(100, Math.max(12, trimmed.length * 1.9))}%`,
                      backgroundColor: barColor
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Inline Collapsible Find & Replace Panel (docked below code canvas) */}
      {showFindBar && (
        <div className="bg-slate-900 border-t border-slate-800 px-2.5 py-2 space-y-1.5 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <input
              type="text"
              value={findQuery}
              onChange={(e) => {
                setFindQuery(e.target.value);
                setFindMatchIdx(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFindStep(e.shiftKey ? -1 : 1);
                if (e.key === 'Escape') setShowFindBar(false);
              }}
              placeholder="Tìm trong file (Ctrl+F)..."
              className="flex-1 min-w-[140px] px-2.5 py-1 rounded-[4px] bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400"
            />
            <button
              type="button"
              onClick={() => setMatchCase((p) => !p)}
              className={`px-2 py-1 rounded-[4px] font-mono text-[10px] border ${
                matchCase
                  ? 'bg-sky-500 text-white border-sky-400 font-bold'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
              title="Phân biệt HOA/thường"
            >
              Aa
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1 tabular-nums">
              {findMatches.length > 0 ? `${(findMatchIdx % findMatches.length) + 1}/${findMatches.length}` : '0/0'}
            </span>
            <button
              type="button"
              onClick={() => handleFindStep(-1)}
              className="p-1 rounded-[4px] bg-slate-950 hover:bg-slate-800 border border-slate-700"
              title="Tìm trước"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleFindStep(1)}
              className="p-1 rounded-[4px] bg-slate-950 hover:bg-slate-800 border border-slate-700"
              title="Tìm tiếp"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFindBar(false)}
              className="p-1 rounded-[4px] hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {showReplaceRow && (
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Thay thế bằng..."
                className="flex-1 min-w-[140px] px-2.5 py-1 rounded-[4px] bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleReplaceCurrent}
                className="px-2.5 py-1 rounded-[4px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-[11px] font-semibold"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleReplaceAll}
                className="px-2.5 py-1 rounded-[4px] bg-amber-500 text-slate-950 text-[11px] font-bold"
              >
                Replace All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline Goto Line Bar (docked below code canvas) */}
      {showGotoBar && (
        <div className="bg-slate-900 border-t border-slate-800 px-2.5 py-1.5 flex items-center gap-2 text-xs shrink-0">
          <span className="font-mono text-sky-400 text-[11px] shrink-0">Goto Line (1–{lines.length}):</span>
          <input
            type="number"
            min={1}
            max={lines.length}
            value={gotoInput}
            onChange={(e) => setGotoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGotoLine();
              if (e.key === 'Escape') setShowGotoBar(false);
            }}
            placeholder=":line"
            className="w-24 px-2 py-0.5 rounded-[4px] bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-400"
          />
          <button
            type="button"
            onClick={() => handleGotoLine()}
            className="px-2.5 py-0.5 rounded-[4px] bg-sky-500 text-slate-950 font-bold text-[11px]"
          >
            Đi tới
          </button>
          <button
            type="button"
            onClick={() => setShowGotoBar(false)}
            className="p-0.5 rounded-[4px] hover:bg-slate-800 text-slate-400 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Snippets Quick Drawer (docked below code canvas) */}
      {showSnippetsDrawer && (
        <div className="bg-slate-900 border-t border-slate-800 px-2.5 py-2 flex flex-wrap items-center gap-1.5 text-[11px] shrink-0">
          <span className="text-emerald-400 font-bold mr-1">Chèn Snippet ({language.toUpperCase()}):</span>
          {cpSnippets.map((sn) => (
            <button
              key={sn.label}
              type="button"
              onClick={() => {
                insertSnippet(sn.code);
                setShowSnippetsDrawer(false);
                flashToast(`Đã chèn ${sn.label}`);
              }}
              className="px-2.5 py-1 rounded-[4px] bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-200 font-mono text-[10px]"
            >
              + {sn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowSnippetsDrawer(false)}
            className="ml-auto text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Compact Edit / Find / Snippets Toolbar (docked below code canvas to maximize code height) */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-2 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] shrink-0">
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyStack.past.length === 0}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-300 flex items-center gap-1 shrink-0 whitespace-nowrap"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3 h-3" />
          <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyStack.future.length === 0}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-300 flex items-center gap-1 shrink-0 whitespace-nowrap"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3 h-3" />
          <span className="hidden sm:inline">Redo</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setShowFindBar((p) => !p);
            setShowReplaceRow(false);
          }}
          className={`px-2 py-1 rounded-[4px] border flex items-center gap-1 shrink-0 whitespace-nowrap ${
            showFindBar && !showReplaceRow
              ? 'bg-sky-600 border-sky-500 text-white font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-sky-300'
          }`}
          title="Find (Ctrl+F)"
        >
          <Search className="w-3 h-3" />
          <span>Find</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setShowFindBar(true);
            setShowReplaceRow((p) => !p);
          }}
          className={`px-2 py-1 rounded-[4px] border flex items-center gap-1 shrink-0 whitespace-nowrap ${
            showFindBar && showReplaceRow
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-300'
          }`}
          title="Replace (Ctrl+H)"
        >
          <Replace className="w-3 h-3" />
          <span>Replace</span>
        </button>
        <button
          type="button"
          onClick={() => setShowGotoBar((p) => !p)}
          className={`px-2 py-1 rounded-[4px] border flex items-center gap-1 shrink-0 whitespace-nowrap ${
            showGotoBar
              ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-cyan-300'
          }`}
          title="Goto Line (Ctrl+G)"
        >
          <Hash className="w-3 h-3" />
          <span>Goto</span>
        </button>
        <button
          type="button"
          onClick={duplicateCurrentLine}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shrink-0 whitespace-nowrap"
          title="Duplicate Line (Ctrl+D)"
        >
          Dup Line
        </button>
        <button
          type="button"
          onClick={toggleCurrentLineComment}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 shrink-0 whitespace-nowrap"
          title="Comment (Ctrl+/)"
        >
          Comment
        </button>
        <button
          type="button"
          onClick={() => setShowSnippetsDrawer((p) => !p)}
          className={`px-2 py-1 rounded-[4px] border flex items-center gap-1 shrink-0 whitespace-nowrap ${
            showSnippetsDrawer
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-emerald-300'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Snippets</span>
        </button>
        <button
          type="button"
          onClick={() => setWordWrap((p) => !p)}
          className={`px-2 py-1 rounded-[4px] border flex items-center gap-1 shrink-0 whitespace-nowrap ${
            wordWrap
              ? 'bg-indigo-500 border-indigo-400 text-white font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
          title="Toggle Word Wrap"
        >
          <Sliders className="w-3 h-3" />
          <span>{wordWrap ? 'Wrap: ON' : 'Wrap'}</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadFile}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1 shrink-0 whitespace-nowrap"
          title="Tải file code"
        >
          <Download className="w-3 h-3" />
          <span className="hidden sm:inline">Save As</span>
        </button>
        <button
          type="button"
          onClick={() => setShowShortcutsModal(true)}
          className="px-2 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1 shrink-0"
          title="Phím tắt IDE"
        >
          <HelpCircle className="w-3 h-3" />
        </button>
        {toastMsg && (
          <span className="ml-auto px-2 py-0.5 rounded-[4px] bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-mono shrink-0 whitespace-nowrap">
            {toastMsg}
          </span>
        )}
      </div>


      {/* Mobile & iPad Quick Coding Key Bar */}
      <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        {[
          { label: 'Tab', insert: indentUnit, back: 0 },
          { label: '{ }', insert: '{}', back: 1 },
          { label: '( )', insert: '()', back: 1 },
          { label: '[ ]', insert: '[]', back: 1 },
          { label: ';', insert: ';', back: 0 },
          { label: '<<', insert: ' << ', back: 0 },
          { label: '>>', insert: ' >> ', back: 0 },
          { label: '" "', insert: '""', back: 1 },
          { label: '=', insert: ' = ', back: 0 },
          { label: ':', insert: ':', back: 0 },
          { label: '//', insert: language === 'python' ? '# ' : '// ', back: 0 }
        ].map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => insertSnippet(k.insert, k.back)}
            className="px-2.5 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 active:bg-slate-700 border border-slate-700 text-slate-100 font-mono text-xs shrink-0 whitespace-nowrap"
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Synchronized Bottom Status Bar */}
      <div className="h-7 bg-slate-950 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => setShowGotoBar((p) => !p)}
            className="text-slate-200 hover:text-sky-400 whitespace-nowrap"
            title="Nhảy tới dòng (Ctrl+G)"
          >
            Ln {cursorPos.line}, Col {cursorPos.col}
          </button>
          <button
            type="button"
            onClick={() => setTabWidth((w) => (w === 4 ? 2 : 4))}
            className="hidden sm:inline hover:text-white whitespace-nowrap"
            title="Đổi khoảng cách Tab (2 hoặc 4 spaces)"
          >
            Spaces: {tabWidth}
          </button>
          <span className="hidden md:inline">UTF-8</span>
          {statusRightExtra && <span className="hidden md:inline text-emerald-400 font-semibold truncate">{statusRightExtra}</span>}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-sky-400 font-semibold whitespace-nowrap">
            {language === 'cpp' ? 'C++20' : language === 'python' ? 'Python 3' : 'Plain Text'}
          </span>
          {onToggleConsole && (
            <button
              type="button"
              onClick={onToggleConsole}
              className="flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
            >
              <Terminal className="w-3 h-3 text-amber-400" />
              <span>{isConsoleOpen ? 'Hide Console' : 'Console'}</span>
            </button>
          )}
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors whitespace-nowrap"
              title="Ctrl+B"
            >
              <Play className="w-3 h-3" />
              <span>Build</span>
            </button>
          )}
        </div>
      </div>

      {/* Shortcuts Help Modal */}
      {showShortcutsModal && (
        <ViewportPortal active={true}>
          <div
            className="fixed inset-0 z-[150] bg-slate-950/80 flex items-center justify-center p-4"
            onClick={() => setShowShortcutsModal(false)}
          >
            <div
              className="w-full max-w-md bg-slate-950 border border-slate-700 rounded-md p-5 text-slate-100 shadow-2xl space-y-3 sci-frame"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h4 className="font-bold text-sm text-sky-400">Phím tắt Sublime Text 4 IDE</h4>
                <button
                  type="button"
                  onClick={() => setShowShortcutsModal(false)}
                  className="p-1 rounded-[4px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs font-mono">
                {[
                  ['Ctrl + B / Enter', 'Chạy thử (Build)'],
                  ['Ctrl + F / H', 'Tìm & Thay thế'],
                  ['Ctrl + G', 'Nhảy tới dòng'],
                  ['Ctrl + Z / Y', 'Undo / Redo'],
                  ['Ctrl + D', 'Nhân bản dòng'],
                  ['Ctrl + Shift + K', 'Xóa dòng hiện tại'],
                  ['Ctrl + /', 'Bật/tắt Comment'],
                  ['Ctrl + Shift + ↑/↓', 'Di chuyển dòng'],
                  ['Ctrl + J', 'Gộp dòng kế tiếp'],
                  ['F11', 'Toàn màn hình']
                ].map(([k, desc]) => (
                  <React.Fragment key={k}>
                    <span className="text-sky-400">{k}</span>
                    <span className="text-slate-300 font-sans">{desc}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </ViewportPortal>
      )}
    </div>
  );
};
