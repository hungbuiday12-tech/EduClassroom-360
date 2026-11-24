/**
 * Truncates exam text safely outside LaTeX $...$ and $$...$$ blocks
 * so featuredSnippet never splits a KaTeX formula in half.
 */
export function safeExamSnippet(raw: string, maxLen = 135): string {
  const text = (raw || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;

  let cut = maxLen;
  // Walk through text tracking $ and $$ outside escaped \$
  let i = 0;
  let inDisplay = false;
  let inInline = false;
  let openStart = -1;

  while (i < text.length && i < cut) {
    if (text[i] === '\\' && text[i + 1] === '$') {
      i += 2;
      continue;
    }
    if (text[i] === '$') {
      if (inDisplay) {
        if (text[i + 1] === '$') {
          inDisplay = false;
          openStart = -1;
          i += 2;
          continue;
        }
      } else if (inInline) {
        inInline = false;
        openStart = -1;
        i += 1;
        continue;
      } else if (text[i + 1] === '$') {
        inDisplay = true;
        openStart = i;
        i += 2;
        continue;
      } else {
        inInline = true;
        openStart = i;
        i += 1;
        continue;
      }
    }
    i++;
  }

  if ((inInline || inDisplay) && openStart >= 0) {
    if (openStart >= 24) {
      cut = openStart;
    } else {
      // Opening $ is very early: extend to its closing delimiter instead
      const delim = inDisplay ? '$$' : '$';
      const closeIdx = text.indexOf(delim, openStart + delim.length);
      if (closeIdx !== -1 && closeIdx + delim.length <= maxLen + 80) {
        cut = closeIdx + delim.length;
      } else {
        cut = openStart;
      }
    }
  }

  const sliced = text.slice(0, cut).trimEnd();
  return sliced + '...';
}
