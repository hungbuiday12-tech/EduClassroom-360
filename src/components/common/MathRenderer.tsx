import React, { useMemo } from 'react';
import katex from 'katex';

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
}

/**
 * Renders mixed Vietnamese/English natural text containing LaTeX math:
 * - Supports $$...$$ display math and $...$ inline math.
 * - Also auto-detects undelimited LaTeX fragments (e.g. \frac{1}{2}gt^2, \sqrt{x}, \alpha, \Delta)
 *   without converting surrounding prose into KaTeX math italics.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    const parts: React.ReactNode[] = [];
    // Match $$...$$ or $...$ first
    const dollarRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = dollarRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        const textSegment = text.slice(lastIndex, matchIndex);
        parts.push(...renderTextWithAutoLatex(textSegment, `seg-${lastIndex}`));
      }

      const mathToken = match[0];
      const isDisplay = mathToken.startsWith('$$');
      let innerMath = isDisplay ? mathToken.slice(2, -2) : mathToken.slice(1, -1);
      innerMath = innerMath.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');
      innerMath = innerMath.replace(/(^|[^\\a-zA-Z])sqrt\{/g, '$1\\sqrt{');

      try {
        const mathHtml = katex.renderToString(innerMath.trim(), {
          displayMode: isDisplay,
          throwOnError: false,
        });
        parts.push(
          <span
            key={`math-${matchIndex}`}
            className={isDisplay ? 'block my-2 overflow-x-auto text-center' : 'inline-block mx-0.5 align-middle'}
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        parts.push(<span key={`math-err-${matchIndex}`}>{mathToken}</span>);
      }

      lastIndex = matchIndex + mathToken.length;
    }

    if (lastIndex < text.length) {
      const remaining = text.slice(lastIndex);
      parts.push(...renderTextWithAutoLatex(remaining, `seg-${lastIndex}`));
    }

    return parts;
  }, [text]);

  return <span className={className}>{renderedContent}</span>;
};

/**
 * Extracts undelimited inline LaTeX commands (like \frac{a}{b}, \sqrt{x}, \alpha, \Delta t, x^2, v_0)
 * from plain text segments so raw "frac" or "\frac" never leaks into the UI.
 */
function renderTextWithAutoLatex(segment: string, keyPrefix: string): React.ReactNode[] {
  if (!segment) return [];

  // Normalize accidental bare "frac{" -> "\frac{"
  const normalized = segment.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');

  // Check if there are any LaTeX commands in this segment
  const hasTex = /\\(?:frac|sqrt|omega|alpha|beta|gamma|delta|Delta|lambda|Phi|phi|theta|pi|sigma|mu|tau|rho|varepsilon|cdot|times|pm|le|ge|ne|approx|equiv|implies|Leftrightarrow|Rightarrow|rightarrow|infty|sum|int|vec|overline|underline|sin|cos|tan|cot|log|ln|text)\b/.test(
    normalized
  );

  if (!hasTex) {
    return [renderPlainTextWithBold(normalized, keyPrefix)];
  }

  // Match contiguous math-like expressions containing TeX commands (without capturing trailing Vietnamese punctuation)
  const autoTexRegex =
    /(?:[a-zA-Z0-9_()+\-=/*^.,']*\s*)*(?:\\(?:frac\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|sqrt(?:\[[^\]]+\])?\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|[a-zA-Z]+(?:\{[^{}]*\})?))(?:\s*[+\-=/*^_(){}[\]0-9a-zA-Z.,']*\\?[a-zA-Z0-9_{}^()]*)*/g;

  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  // Simpler & safer matcher: match individual TeX expressions including simple surroundings like "y = \frac{1}{2}gt^2"
  const safeInlineTex =
    /(?:[a-zA-Z0-9_()]+\s*[=<>≤≥≈]\s*)?(?:[-+]?\s*\\(?:frac\{(?:[^{}]|\{[^{}]*\})*\}\{(?:[^{}]|\{[^{}]*\})*\}|sqrt(?:\[[^\]]*\])?\{(?:[^{}]|\{[^{}]*\})*\}|vec\{[^{}]*\}|overline\{[^{}]*\}|text\{[^{}]*\}|Delta|Phi|omega|alpha|beta|gamma|lambda|theta|pi|phi|sigma|mu|varepsilon|cdot|times|pm|le|ge|ne|approx|implies|Leftrightarrow|Rightarrow|rightarrow|infty|sin|cos|tan|log|ln)(?:[a-zA-Z0-9_^{}().,+\-*/\\]*)*)/g;

  while ((m = safeInlineTex.exec(normalized)) !== null) {
    const idx = m.index;
    let token = m[0].trim();

    // Trim trailing period or comma if it ends sentence
    let trailingPunct = '';
    if (/[.,;:)]$/.test(token) && !token.endsWith('})')) {
      if (token.endsWith('.') || token.endsWith(',') || token.endsWith(';') || token.endsWith(':')) {
        trailingPunct = token.slice(-1);
        token = token.slice(0, -1);
      }
    }

    if (idx > lastIdx) {
      nodes.push(renderPlainTextWithBold(normalized.slice(lastIdx, idx), `${keyPrefix}-p-${lastIdx}`));
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
    nodes.push(renderPlainTextWithBold(normalized.slice(lastIdx), `${keyPrefix}-e-${lastIdx}`));
  }

  return nodes;
}

/**
 * Helper to render bold markdown (**...**) cleanly
 */
function renderPlainTextWithBold(textSegment: string, keyPrefix: string): React.ReactNode {
  if (textSegment.includes('**')) {
    const boldParts = textSegment.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={keyPrefix}>
        {boldParts.map((bp, i) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return (
              <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-slate-900 dark:text-white">
                {bp.slice(2, -2)}
              </strong>
            );
          }
          return bp;
        })}
      </React.Fragment>
    );
  }
  return <React.Fragment key={keyPrefix}>{textSegment}</React.Fragment>;
}

