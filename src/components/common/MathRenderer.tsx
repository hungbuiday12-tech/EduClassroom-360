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
      // Clean string from accidental outer dollar signs if provided
      let clean = formula.trim();
      if (clean.startsWith('$$') && clean.endsWith('$$')) {
        clean = clean.slice(2, -2).trim();
      } else if (clean.startsWith('$') && clean.endsWith('$')) {
        clean = clean.slice(1, -1).trim();
      }
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
 * Takes mixed natural text that contains embedded LaTeX formulas:
 * e.g. "Cho chóp $S.ABC$, tỉ số thể tích $\frac{V_1}{V_2} = \frac{1}{8}$..."
 * or "$$E = mc^2$$" or raw formulas, and renders math with KaTeX while preserving text.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    // Regular expression to match $$display math$$ or $inline math$
    // Also matches standalone lines that start with typical TeX keywords (\frac, \sqrt, etc.)
    const parts: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      // Push text before math
      if (matchIndex > lastIndex) {
        const textSegment = text.slice(lastIndex, matchIndex);
        parts.push(renderPlainTextWithSubscripts(textSegment, `txt-${lastIndex}`));
      }

      const mathToken = match[0];
      const isDisplay = mathToken.startsWith('$$');
      const innerMath = isDisplay ? mathToken.slice(2, -2) : mathToken.slice(1, -1);

      try {
        const mathHtml = katex.renderToString(innerMath.trim(), {
          displayMode: isDisplay,
          throwOnError: false,
        });
        parts.push(
          <span
            key={`math-${matchIndex}`}
            className={isDisplay ? 'block my-2 overflow-x-auto text-center' : 'inline-block mx-0.5 align-baseline'}
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        parts.push(<span key={`math-err-${matchIndex}`}>{mathToken}</span>);
      }

      lastIndex = matchIndex + mathToken.length;
    }

    // Push remaining text
    if (lastIndex < text.length) {
      const remaining = text.slice(lastIndex);
      // Check if remaining contains raw LaTeX without dollars like \frac{a}{b}
      if (/\\(frac|sqrt|omega|alpha|beta|lambda|Delta|int|sum|vec|pi|cos|sin|tan)\b/.test(remaining)) {
        try {
          const autoMathHtml = katex.renderToString(remaining.trim(), {
            displayMode: false,
            throwOnError: false,
          });
          parts.push(
            <span
              key={`math-raw-${lastIndex}`}
              className="inline-block mx-0.5 align-baseline"
              dangerouslySetInnerHTML={{ __html: autoMathHtml }}
            />
          );
        } catch {
          parts.push(renderPlainTextWithSubscripts(remaining, `txt-${lastIndex}`));
        }
      } else {
        parts.push(renderPlainTextWithSubscripts(remaining, `txt-${lastIndex}`));
      }
    }

    return parts;
  }, [text]);

  return <span className={className}>{renderedContent}</span>;
};

/**
 * Helper to render bold markdown (**...**) and subscript/superscript numbers in plain text
 */
function renderPlainTextWithSubscripts(textSegment: string, keyPrefix: string): React.ReactNode {
  // Check for bold **text**
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
  return textSegment;
}
