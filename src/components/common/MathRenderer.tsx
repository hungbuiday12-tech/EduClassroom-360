import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Renders a pure TeX formula string via KaTeX.
 * Handles escaping, fraction formatting, and falls back gracefully on syntax errors.
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    if (!formula || typeof formula !== 'string') return '';
    try {
      let clean = formula.trim();
      if (clean.startsWith('$$') && clean.endsWith('$$')) {
        clean = clean.slice(2, -2).trim();
      } else if (clean.startsWith('$') && clean.endsWith('$')) {
        clean = clean.slice(1, -1).trim();
      }
      // Fix common accidental missing backslashes like standalone "frac{" -> "\frac{"
      clean = clean.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');
      clean = clean.replace(/(^|[^\\a-zA-Z])sqrt\{/g, '$1\\sqrt{');
      return katex.renderToString(clean, {
        displayMode,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return formula;
    }
  }, [formula, displayMode]);

  if (!html) return null;

  return (
    <span
      className={`inline-math ${displayMode ? 'block my-2 text-center overflow-x-auto' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FormattedTextProps {
  text: string;
  className?: string;
  /**
   * 'auto' (default): renders structured Markdown blocks (headings, lists, paragraphs, code fences, display math)
   * when multiline/block syntax is present, while staying compact inline <span> for short single-line labels.
   */
  mode?: 'auto' | 'inline' | 'structured';
}

function hasBlockMarkdownSyntax(raw: string): boolean {
  if (!raw) return false;
  if (raw.includes('\n')) return true;
  if (raw.includes('```') || raw.includes('$$')) return true;
  if (/^\s*(?:#{1,4}\s+|[-*•]\s+|\d+[.)]\s+|>\s+)/.test(raw)) return true;
  return false;
}

function renderInlineMathAndMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  const dollarRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = dollarRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      const textSegment = text.slice(lastIndex, matchIndex);
      parts.push(...renderTextWithAutoLatex(textSegment, `${keyPrefix}-seg-${lastIndex}`));
    }

    const mathToken = match[0];
    const isDisplay = mathToken.startsWith('$$') || mathToken.startsWith('\\[');
    let innerMath =
      mathToken.startsWith('$$') || mathToken.startsWith('\\[') || mathToken.startsWith('\\(')
        ? mathToken.slice(2, -2)
        : mathToken.slice(1, -1);
    innerMath = innerMath.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');
    innerMath = innerMath.replace(/(^|[^\\a-zA-Z])sqrt\{/g, '$1\\sqrt{');

    try {
      const mathHtml = katex.renderToString(innerMath.trim(), {
        displayMode: isDisplay,
        throwOnError: false,
      });
      parts.push(
        <span
          key={`${keyPrefix}-math-${matchIndex}`}
          className={
            isDisplay
              ? 'block my-2 py-2 px-3 rounded-lg bg-slate-900/[0.04] dark:bg-slate-950/75 border border-slate-200/70 dark:border-slate-800 overflow-x-auto text-center'
              : 'inline-block mx-0.5 align-middle'
          }
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      );
    } catch {
      parts.push(<span key={`${keyPrefix}-math-err-${matchIndex}`}>{mathToken}</span>);
    }

    lastIndex = matchIndex + mathToken.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    parts.push(...renderTextWithAutoLatex(remaining, `${keyPrefix}-seg-${lastIndex}`));
  }

  return parts;
}

/**
 * Renders mixed Vietnamese/English natural text containing LaTeX math and structured Markdown:
 * - Supports $$...$$ display math, \[...\], \(...\), and $...$ inline math.
 * - Supports Markdown headings (###), numbered lists (1.), bullet lists (- / * / •), blockquotes (>),
 *   fenced code blocks (```lang), inline `code`, and **bold** text with airy readable spacing.
 * - Also auto-detects undelimited LaTeX fragments (e.g. \frac{1}{2}gt^2, \sqrt{x}, \alpha, \Delta).
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  mode = 'auto',
}) => {
  const isStructured = useMemo(() => {
    if (!text || typeof text !== 'string') return false;
    if (mode === 'inline') return false;
    if (mode === 'structured') return true;
    return hasBlockMarkdownSyntax(text);
  }, [mode, text]);

  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    if (!isStructured) {
      return renderInlineMathAndMarkdown(text, 'inl');
    }

    return renderStructuredMarkdownBlocks(text);
  }, [isStructured, text]);

  if (!text || typeof text !== 'string') return null;

  if (!isStructured) {
    return <span className={className}>{renderedContent}</span>;
  }

  return <div className={`space-y-2.5 leading-relaxed ${className}`}>{renderedContent}</div>;
};

interface ParsedBlock {
  type: 'code' | 'heading' | 'ul' | 'ol' | 'quote' | 'display_math' | 'paragraph';
  lang?: string;
  level?: number;
  items?: { num?: string; text: string }[];
  content: string;
}

function parseStructuredBlocks(raw: string): ParsedBlock[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Fenced code block ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++;
      }
      blocks.push({ type: 'code', lang, content: codeLines.join('\n') });
      continue;
    }

    // 2. Standalone multi-line $$...$$ display math block
    if (trimmed.startsWith('$$') && !trimmed.slice(2).includes('$$')) {
      const mathLines = [line];
      i++;
      while (i < lines.length && !lines[i].includes('$$')) {
        mathLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        mathLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'display_math', content: mathLines.join('\n') });
      continue;
    }

    // 3. Markdown headings (# .. ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 4. Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        qLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', content: qLines.join('\n') });
      continue;
    }

    // 5. Unordered list (- , * , • )
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: { text: string }[] = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const m = curTrim.match(/^[-*•]\s+(.+)$/);
        if (m) {
          items.push({ text: m[1] });
          i++;
        } else if (curTrim && !/^(#{1,4}\s+|```|\d+[.)]\s+|>\s+)/.test(curTrim) && /^\s{2,}/.test(lines[i])) {
          // Indented continuation of previous bullet
          if (items.length > 0) {
            items[items.length - 1].text += ` ${curTrim}`;
          }
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'ul', items, content: '' });
      continue;
    }

    // 6. Ordered list (1. , 2. , 1) )
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: { num?: string; text: string }[] = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const m = curTrim.match(/^(\d+)[.)]\s+(.+)$/);
        if (m) {
          items.push({ num: m[1], text: m[2] });
          i++;
        } else if (curTrim && !/^(#{1,4}\s+|```|[-*•]\s+|>\s+)/.test(curTrim) && /^\s{2,}/.test(lines[i])) {
          if (items.length > 0) {
            items[items.length - 1].text += ` ${curTrim}`;
          }
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'ol', items, content: '' });
      continue;
    }

    // 7. Regular paragraph lines until blank line or next block token
    const paraLines: string[] = [];
    while (i < lines.length) {
      const cur = lines[i];
      const curTrim = cur.trim();
      if (
        !curTrim ||
        curTrim.startsWith('```') ||
        /^(#{1,4}\s+|[-*•]\s+|\d+[.)]\s+|>\s+)/.test(curTrim) ||
        (curTrim.startsWith('$$') && !curTrim.slice(2).includes('$$'))
      ) {
        break;
      }
      paraLines.push(cur);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', content: paraLines.join('\n') });
    }
  }

  return blocks;
}

function renderStructuredMarkdownBlocks(raw: string): React.ReactNode {
  const blocks = parseStructuredBlocks(raw);
  return blocks.map((blk, bIdx) => {
    if (blk.type === 'code') {
      return (
        <div
          key={`blk-${bIdx}`}
          className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0b1220] text-slate-100 my-1.5"
        >
          {blk.lang && (
            <div className="px-3 py-1 bg-slate-900/95 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
              {blk.lang}
            </div>
          )}
          <pre className="p-3 overflow-x-auto text-[11.5px] leading-relaxed font-mono text-emerald-100">
            <code>{blk.content}</code>
          </pre>
        </div>
      );
    }

    if (blk.type === 'heading') {
      const isMajor = (blk.level || 3) <= 2;
      return (
        <div
          key={`blk-${bIdx}`}
          className={`pt-1.5 pb-1 border-b border-slate-200/70 dark:border-slate-700/70 font-extrabold tracking-tight text-slate-900 dark:text-sky-200 ${
            isMajor ? 'text-[14.5px]' : 'text-[13.5px]'
          }`}
        >
          {renderInlineMathAndMarkdown(blk.content, `hd-${bIdx}`)}
        </div>
      );
    }

    if (blk.type === 'quote') {
      return (
        <blockquote
          key={`blk-${bIdx}`}
          className="pl-3 py-1 border-l-2 border-sky-400/80 bg-sky-500/5 rounded-r-md text-slate-700 dark:text-slate-200"
        >
          {renderInlineMathAndMarkdown(blk.content, `qt-${bIdx}`)}
        </blockquote>
      );
    }

    if (blk.type === 'ul') {
      return (
        <ul key={`blk-${bIdx}`} className="space-y-1.5 pl-1">
          {(blk.items || []).map((item, itIdx) => (
            <li key={itIdx} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-[7px] w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-cyan-400 shrink-0"
              />
              <div className="flex-1 min-w-0">
                {renderInlineMathAndMarkdown(item.text, `ul-${bIdx}-${itIdx}`)}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    if (blk.type === 'ol') {
      return (
        <ol key={`blk-${bIdx}`} className="space-y-2 pl-0.5">
          {(blk.items || []).map((item, itIdx) => (
            <li key={itIdx} className="flex items-start gap-2.5">
              <span className="mt-0.5 min-w-[20px] h-5 px-1 rounded bg-sky-500/15 dark:bg-sky-400/20 text-sky-700 dark:text-sky-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                {item.num || itIdx + 1}
              </span>
              <div className="flex-1 min-w-0">
                {renderInlineMathAndMarkdown(item.text, `ol-${bIdx}-${itIdx}`)}
              </div>
            </li>
          ))}
        </ol>
      );
    }

    if (blk.type === 'display_math') {
      return (
        <div key={`blk-${bIdx}`}>
          {renderInlineMathAndMarkdown(blk.content, `dm-${bIdx}`)}
        </div>
      );
    }

    // Paragraph (preserve internal single newlines cleanly without collapsing)
    const subLines = blk.content.split('\n');
    return (
      <div key={`blk-${bIdx}`} className="space-y-1">
        {subLines.map((sub, sIdx) => (
          <div key={sIdx}>{renderInlineMathAndMarkdown(sub, `p-${bIdx}-${sIdx}`)}</div>
        ))}
      </div>
    );
  });
}

/**
 * Extracts undelimited inline LaTeX commands (like \frac{a}{b}, \sqrt{x}, \alpha, \Delta t, x^2, v_0)
 * from plain text segments so raw "frac" or "\frac" never leaks into the UI.
 */
function renderTextWithAutoLatex(segment: string, keyPrefix: string): React.ReactNode[] {
  if (!segment) return [];

  // Normalize accidental bare "frac{" -> "\frac{"
  const normalized = segment.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');

  // Check if there are any LaTeX commands in this segment
  const hasTex = /\\(?:frac|sqrt|omega|Omega|alpha|beta|gamma|delta|Delta|lambda|Phi|phi|theta|pi|sigma|mu|tau|rho|varepsilon|cdot|times|pm|le|ge|ne|neq|approx|equiv|implies|Leftrightarrow|leftrightarrow|Rightarrow|rightarrow|infty|sum|int|vec|overrightarrow|widehat|overline|underline|sin|cos|tan|cot|log|ln|text|mathbb|triangle|ell|perp|parallel|angle|circ|degree)\b/.test(
    normalized
  );

  if (!hasTex) {
    return [renderPlainTextWithFormatting(normalized, keyPrefix)];
  }

  // Match contiguous math-like expressions containing TeX commands (without capturing trailing Vietnamese punctuation)
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  const safeInlineTex =
    /(?:[a-zA-Z0-9_()]+\s*[=<>≤≥≈]\s*)?(?:[-+]?\s*\\(?:frac\{(?:[^{}]|\{[^{}]*\})*\}\{(?:[^{}]|\{[^{}]*\})*\}|sqrt(?:\[[^\]]+\])?\{(?:[^{}]|\{[^{}]*\})*\}|mathbb\{[^{}]*\}|vec\{[^{}]*\}|overrightarrow\{[^{}]*\}|widehat\{[^{}]*\}|overline\{[^{}]*\}|text\{[^{}]*\}|Delta|Phi|Omega|omega|alpha|beta|gamma|lambda|theta|pi|phi|sigma|mu|tau|rho|varepsilon|cdot|times|pm|le|ge|neq|ne|approx|equiv|implies|Leftrightarrow|leftrightarrow|Rightarrow|rightarrow|infty|sum|int|triangle|ell|perp|parallel|angle|circ|degree|sin|cos|tan|cot|log|ln)(?:[a-zA-Z0-9_^{}().,+\-*/\\]*)*)/g;

  while ((m = safeInlineTex.exec(normalized)) !== null) {
    const idx = m.index;
    let token = m[0].trim();

    let trailingPunct = '';
    if (/[.,;:)]$/.test(token) && !token.endsWith('})')) {
      if (token.endsWith('.') || token.endsWith(',') || token.endsWith(';') || token.endsWith(':')) {
        trailingPunct = token.slice(-1);
        token = token.slice(0, -1);
      }
    }

    if (idx > lastIdx) {
      nodes.push(renderPlainTextWithFormatting(normalized.slice(lastIdx, idx), `${keyPrefix}-p-${lastIdx}`));
    }

    try {
      const html = katex.renderToString(token, { displayMode: false, throwOnError: false });
      nodes.push(
        <span
          key={`${keyPrefix}-k-${idx}`}
          className="inline-block mx-0.5 align-middle"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      nodes.push(<span key={`${keyPrefix}-r-${idx}`}>{token}</span>);
    }

    if (trailingPunct) {
      nodes.push(trailingPunct);
    }

    lastIdx = idx + m[0].length;
  }

  if (lastIdx < normalized.length) {
    nodes.push(renderPlainTextWithFormatting(normalized.slice(lastIdx), `${keyPrefix}-e-${lastIdx}`));
  }

  return nodes;
}

/**
 * Helper to render bold markdown (**...**) and inline code (`...`) cleanly
 */
function renderPlainTextWithFormatting(textSegment: string, keyPrefix: string): React.ReactNode {
  if (!textSegment.includes('**') && !textSegment.includes('`')) {
    return <React.Fragment key={keyPrefix}>{textSegment}</React.Fragment>;
  }

  const tokens = textSegment.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g);
  return (
    <React.Fragment key={keyPrefix}>
      {tokens.map((tk, i) => {
        if (tk.startsWith('**') && tk.endsWith('**') && tk.length > 4) {
          return (
            <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-current">
              {tk.slice(2, -2)}
            </strong>
          );
        }
        if (tk.startsWith('`') && tk.endsWith('`') && tk.length > 2) {
          return (
            <code
              key={`${keyPrefix}-c-${i}`}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-900/10 dark:bg-slate-800/90 text-sky-700 dark:text-cyan-300 font-mono text-[0.9em]"
            >
              {tk.slice(1, -1)}
            </code>
          );
        }
        return tk;
      })}
    </React.Fragment>
  );
}
