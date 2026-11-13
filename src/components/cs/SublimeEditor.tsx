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
  Minus
} from 'lucide-react';

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
    <div className="rounded-xl overflow-hidden border border-[#3e3d32] bg-[#272822] shadow-lg font-mono text-xs">
      {/* Authentic Sublime mini window header */}
      <div className="h-9 px-3 bg-[#1e1f1c] border-b border-[#141512] flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="ml-2 px-3 h-7 mt-2 rounded-t bg-[#272822] text-[#f8f8f2] text-[11px] flex items-center gap-1.5 border-t-2 border-t-[#a6e22e] truncate">
            <span className="truncate">{title || (language === 'cpp' ? 'main.cpp' : 'solution.py')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-[10px] text-[#66d9ef] px-1.5 py-0.5 rounded bg-[#272822] border border-[#3e3d32]">
            {language === 'cpp' ? 'C++20' : language === 'python' ? 'Python 3' : 'Text'}
          </span>
          <button
            onClick={handleCopyClick}
            className="px-2.5 py-1 rounded bg-[#3e3d32] hover:bg-[#49483e] text-[#f8f8f2] text-[11px] flex items-center gap-1 transition-colors"
          >
            {isCopied ? <Check className="w-3 h-3 text-[#a6e22e]" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Highlighted Lines */}
      <div className={`overflow-auto ${maxHeightClass} py-2.5 bg-[#272822]`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((ln, idx) => {
              const tokens = tokenizeLineMonokai(ln, language);
              return (
                <tr key={idx} className="hover:bg-[#3e3d32]/45 transition-colors">
                  {showLineNumbers && (
                    <td className="w-11 select-none text-right pr-3 pl-2 text-[#90908a] text-[11px] align-top leading-6">
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const lines = useMemo(() => value.replace(/\r\n/g, '\n').split('\n'), [value]);
  const lineHeightPx = Math.round(fontSize * 1.6);

  const tokenizedLines = useMemo(
    () => lines.map((line) => tokenizeLineMonokai(line, language)),
    [lines, language]
  );

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
      onChange(value + snippet);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const nextVal = value.slice(0, start) + snippet + value.slice(end);
    onChange(nextVal);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length - cursorBack;
      ta.selectionStart = ta.selectionEnd = pos;
      updateCursorFromTarget(ta);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current;
    if (!ta) return;

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
      if (start === end) {
        e.preventDefault();
        const lineIdx = value.slice(0, start).split('\n').length - 1;
        const arr = value.split('\n');
        arr.splice(lineIdx + 1, 0, arr[lineIdx]);
        onChange(arr.join('\n'));
        return;
      }
    }

    // Toggle comment: Ctrl+/
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const start = ta.selectionStart;
      const lineIdx = value.slice(0, start).split('\n').length - 1;
      const arr = value.split('\n');
      const prefix = language === 'python' ? '# ' : '// ';
      const cur = arr[lineIdx];
      if (cur.trimStart().startsWith(prefix.trim())) {
        arr[lineIdx] = cur.replace(prefix, '').replace(prefix.trim(), '');
      } else {
        arr[lineIdx] = prefix + cur;
      }
      onChange(arr.join('\n'));
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
          ? '    '
          : '';
      const after = value.slice(end);
      // Special `{}` brace expansion on Enter
      if (language === 'cpp' && before.endsWith('{') && after.startsWith('}')) {
        e.preventDefault();
        const insert = `\n${baseIndent}    \n${baseIndent}`;
        onChange(before + insert + after);
        const caretPos = start + 1 + baseIndent.length + 4;
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = caretPos;
          updateCursorFromTarget(ta);
        });
        return;
      }
      if (baseIndent || extra) {
        e.preventDefault();
        const insert = '\n' + baseIndent + extra;
        onChange(before + insert + after);
        const caretPos = start + insert.length;
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = caretPos;
          updateCursorFromTarget(ta);
        });
        return;
      }
    }

    // Tab / Shift+Tab (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (!e.shiftKey) {
        onChange(value.slice(0, start) + '    ' + value.slice(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
          updateCursorFromTarget(ta);
        });
      } else {
        const arr = value.split('\n');
        const lineIdx = value.slice(0, start).split('\n').length - 1;
        if (arr[lineIdx].startsWith('    ')) {
          arr[lineIdx] = arr[lineIdx].slice(4);
          onChange(arr.join('\n'));
        }
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
        onChange(value.slice(0, start) + e.key + close + value.slice(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 1;
          updateCursorFromTarget(ta);
        });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const menuActions: Record<string, { label: string; shortcut?: string; action: () => void }[]> = {
    File: [
      { label: 'Save File', shortcut: 'Ctrl+S', action: () => onSave?.() },
      { label: 'Copy All Code', shortcut: 'Ctrl+C', action: handleCopy },
      ...(onReset ? [{ label: 'Reset Template', action: onReset }] : [])
    ],
    Tools: [
      { label: 'Build & Run', shortcut: 'Ctrl+B', action: () => onRun?.() },
      ...(onToggleConsole ? [{ label: 'Toggle Build Output', action: onToggleConsole }] : [])
    ],
    View: [
      ...(onToggleSidebar ? [{ label: isSidebarOpen ? 'Hide Side Bar' : 'Show Side Bar', shortcut: 'Ctrl+K, Ctrl+B', action: onToggleSidebar }] : []),
      ...(onToggleFullscreen ? [{ label: isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen', shortcut: 'F11', action: onToggleFullscreen }] : []),
      ...(onFontSizeChange
        ? [
            { label: 'Increase Font Size', shortcut: 'Ctrl++', action: () => onFontSizeChange(Math.min(22, fontSize + 1)) },
            { label: 'Decrease Font Size', shortcut: 'Ctrl+-', action: () => onFontSizeChange(Math.max(11, fontSize - 1)) }
          ]
        : [])
    ]
  };

  const minimapOffsetPercent = Math.min(82, (scrollTop / Math.max(1, lines.length * lineHeightPx)) * 100);

  return (
    <div
      className={`flex flex-col bg-[#272822] text-[#f8f8f2] overflow-hidden select-none ${heightClass}`}
      onClick={() => openMenu && setOpenMenu(null)}
    >
      {/* Sublime Top Window Title + Menu Bar */}
      <div className="bg-[#171814] border-b border-[#11120f] px-2.5 h-8 flex items-center justify-between text-[11px] text-[#c8c8c0]">
        <div className="flex items-center gap-1 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 mr-1 rounded hover:bg-[#3e3d32] text-[#c8c8c0] hover:text-white transition-colors"
              title={isSidebarOpen ? 'Ẩn thanh đề bài (Side Bar)' : 'Hiện thanh đề bài (Side Bar)'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 mr-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          {/* Classic Sublime Menu Items */}
          <div className="hidden lg:flex items-center gap-0.5 relative">
            {['File', 'Edit', 'Selection', 'Find', 'View', 'Goto', 'Tools', 'Project', 'Preferences', 'Help'].map((mName) => (
              <div key={mName} className="relative">
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    if (menuActions[mName]) {
                      setOpenMenu(openMenu === mName ? null : mName);
                    }
                  }}
                  className={`px-2 py-1 rounded text-[11px] transition-colors ${
                    openMenu === mName ? 'bg-[#3e3d32] text-white' : 'hover:bg-[#2c2d27] text-[#c8c8c0]'
                  }`}
                >
                  {mName}
                </button>
                {openMenu === mName && menuActions[mName] && (
                  <div className="absolute left-0 top-full mt-0.5 w-52 bg-[#272822] border border-[#3e3d32] shadow-2xl py-1 z-50 rounded">
                    {menuActions[mName].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setOpenMenu(null);
                          item.action();
                        }}
                        className="w-full px-3 py-1.5 text-left text-[11px] text-[#f8f8f2] hover:bg-[#49483e] flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && <span className="text-[#90908a] text-[10px]">{item.shortcut}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <span className="lg:hidden text-[11px] font-mono text-[#a6e22e] font-semibold truncate">
            Sublime Text 4 — Monokai
          </span>
        </div>

        {/* Right Quick Window Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onFontSizeChange && (
            <div className="hidden sm:flex items-center bg-[#272822] border border-[#3e3d32] rounded px-1">
              <button
                onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
                className="p-0.5 hover:text-white text-[#90908a]"
                title="Giảm cỡ chữ"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-1.5 text-[10px] font-mono text-[#c8c8c0]">{fontSize}px</span>
              <button
                onClick={() => onFontSizeChange(Math.min(22, fontSize + 1))}
                className="p-0.5 hover:text-white text-[#90908a]"
                title="Tăng cỡ chữ"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[11px] flex items-center gap-1 text-[#c8c8c0] hover:text-white"
            title="Sao chép mã nguồn"
          >
            {copied ? <Check className="w-3 h-3 text-[#a6e22e]" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded bg-[#272822] hover:bg-[#3e3d32] border border-[#3e3d32] text-[#c8c8c0] hover:text-white"
              title="Đặt lại code mẫu"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 font-semibold transition-colors ${
                isFullscreen
                  ? 'bg-[#f92672]/20 border-[#f92672]/50 text-[#f92672] hover:bg-[#f92672]/30'
                  : 'bg-[#272822] border-[#3e3d32] text-[#66d9ef] hover:bg-[#3e3d32]'
              }`}
              title={isFullscreen ? 'Thu nhỏ (Esc / F11)' : 'Toàn màn hình Split-Screen (F11)'}
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Thoát Fullscreen' : 'Fullscreen'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Authentic Sublime File Tabs Bar */}
      {tabs && tabs.length > 0 && (
        <div className="bg-[#1e1f1c] border-b border-[#141512] px-2 pt-1.5 flex items-end gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab?.(tab.id)}
                className={`h-8 px-3.5 rounded-t-md text-xs font-mono flex items-center gap-2 shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#272822] text-[#f8f8f2] font-semibold border-t-2 border-t-[#e6db74] shadow-[0_-1px_0_#272822]'
                    : 'bg-[#171814] text-[#90908a] hover:bg-[#22231e] hover:text-[#d8d8d0] border-t-2 border-t-transparent'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    tab.language === 'cpp'
                      ? 'bg-[#66d9ef]'
                      : tab.language === 'python'
                      ? 'bg-[#a6e22e]'
                      : 'bg-[#e6db74]'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.dirty !== false && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#fd971f]' : 'bg-[#75715e]'}`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Editor Canvas: Unified Scroll Container (Sticky Gutter + Grid Syntax Pre / Textarea) + Minimap */}
      <div className="relative flex-1 flex bg-[#272822] overflow-hidden min-h-0">
        <div
          ref={scrollerRef}
          onScroll={handleContainerScroll}
          onClick={() => textareaRef.current?.focus()}
          className="relative flex-1 flex items-start overflow-auto bg-[#272822] min-w-0 min-h-0 overscroll-contain cursor-text"
        >
          {/* Sticky Line Numbers Gutter */}
          <div
            className="sticky left-0 z-30 w-12 sm:w-14 bg-[#272822] border-r border-[#3e3d32]/60 select-none shrink-0 py-3 pb-16 font-mono text-right pr-3 min-h-full"
            style={{ fontSize: `${Math.max(11, fontSize - 1)}px`, lineHeight: `${lineHeightPx}px` }}
          >
            {Array.from({ length: Math.max(lines.length, 28) }, (_, idx) => {
              const ln = idx + 1;
              const isCurrent = cursorPos.line === ln;
              return (
                <div
                  key={ln}
                  className={isCurrent ? 'text-[#f8f8f2] font-bold bg-[#3e3d32] -mr-3 pr-3' : 'text-[#90908a]'}
                  style={{ height: `${lineHeightPx}px`, lineHeight: `${lineHeightPx}px` }}
                >
                  {ln}
                </div>
              );
            })}
          </div>

          {/* Code Viewport (Single Grid cell sizes 1:1 to exact code dimensions, zero scroll desync) */}
          <div className="relative flex-1 min-w-max min-h-full grid bg-[#272822]">
            {/* Active Line Full-Width Highlight Band */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 bg-[#3e3d32]/90 z-0"
              style={{
                height: `${lineHeightPx}px`,
                top: `${12 + (cursorPos.line - 1) * lineHeightPx}px`
              }}
            />

            {/* Syntax-Highlighted Monokai Pre Layer */}
            <pre
              aria-hidden="true"
              className="col-start-1 row-start-1 pointer-events-none m-0 p-3 pb-16 font-mono z-10 whitespace-pre select-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeightPx}px`,
                tabSize: 4
              }}
            >
              {tokenizedLines.map((tokens, lIdx) => (
                <div key={lIdx} style={{ height: `${lineHeightPx}px`, lineHeight: `${lineHeightPx}px` }}>
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
                </div>
              ))}
            </pre>

            {/* Transparent Interactive Textarea Layer (sized 1:1 with Pre in same grid track) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
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
              className="col-start-1 row-start-1 relative z-20 w-full h-full m-0 p-3 pb-16 font-mono bg-transparent text-transparent caret-[#f8f8f0] resize-none focus:outline-none overflow-hidden whitespace-pre selection:bg-[#49483e]/80 selection:text-transparent"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeightPx}px`,
                tabSize: 4,
                WebkitTextFillColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Authentic Sublime Text Minimap */}
        <div className="hidden md:block relative w-20 bg-[#272822] border-l border-[#3e3d32]/40 p-1.5 select-none overflow-hidden shrink-0 pointer-events-none">
          {/* Minimap viewport thumb */}
          <div
            className="absolute left-0 right-0 h-14 bg-[#f8f8f2]/10 border-y border-[#f8f8f2]/15 transition-all duration-75"
            style={{ top: `${minimapOffsetPercent}%` }}
          />
          <div className="space-y-[2px] opacity-75">
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
      </div>

      {/* Mobile & iPad Quick Coding Key Bar (hidden on desktop lg+) */}
      <div className="lg:hidden bg-[#1e1f1c] border-t border-[#3e3d32] px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { label: 'Tab', insert: '    ', back: 0 },
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
            className="px-2.5 py-1 rounded bg-[#272822] hover:bg-[#3e3d32] active:bg-[#49483e] border border-[#3e3d32] text-[#f8f8f2] font-mono text-xs shrink-0"
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Authentic Sublime Bottom Status Bar */}
      <div className="h-7 bg-[#1e1f1c] border-t border-[#141512] px-3 flex items-center justify-between text-[11px] font-mono text-[#90908a] shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <span className="text-[#f8f8f2]">
            Line {cursorPos.line}, Column {cursorPos.col}
          </span>
          <span className="hidden sm:inline">Spaces: 4</span>
          <span className="hidden md:inline">UTF-8</span>
          {statusRightExtra && <span className="hidden md:inline text-[#a6e22e] truncate">{statusRightExtra}</span>}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-[#66d9ef] font-semibold">
            {language === 'cpp' ? 'C++20' : language === 'python' ? 'Python' : 'Plain Text'}
          </span>
          {onToggleConsole && (
            <button
              onClick={onToggleConsole}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Terminal className="w-3 h-3 text-[#e6db74]" />
              <span>{isConsoleOpen ? 'Hide Console' : 'Console'}</span>
            </button>
          )}
          {onRun && (
            <button
              onClick={onRun}
              className="hidden sm:flex items-center gap-1 text-[#a6e22e] hover:text-white transition-colors"
              title="Ctrl+B"
            >
              <Play className="w-3 h-3" />
              <span>Build</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
