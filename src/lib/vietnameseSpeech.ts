/**
 * Natural Vietnamese Lecture Speech & Math-to-Vietnamese Spoken Normalizer.
 * Translates LaTeX formulas & symbols into spoken Vietnamese so Web Speech API
 * reads STEM lectures and 3Blue1Brown narration clearly instead of skipping symbols.
 */

export function toVietnameseSpokenMath(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  let s = raw
    // Remove Markdown formatting wrappers
    .replace(/```[\s\S]*?```/g, ' đoạn mã chương trình ')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*•]\s+/gm, ' ');

  // Normalize bare frac/sqrt missing slash
  s = s.replace(/(^|[^\\a-zA-Z])frac\{/g, '$1\\frac{');
  s = s.replace(/(^|[^\\a-zA-Z])sqrt\{/g, '$1\\sqrt{');

  // Unwrap math delimiters $$...$$, $...$, \[...\], \(...\)
  s = s.replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ');
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, ' $1 ');
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, ' $1 ');
  s = s.replace(/\$([^$\n]+?)\$/g, ' $1 ');

  // Replace nested/simple fractions recursively up to 3 passes
  for (let pass = 0; pass < 3; pass++) {
    s = s.replace(
      /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      (_, num, den) => ` ${num} phần ${den} `
    );
  }

  // Roots
  s = s.replace(/\\sqrt\[([^\]]+)\]\{([^{}]*)\}/g, (_, n, val) => ` căn bậc ${n} của ${val} `);
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_, val) => ` căn bậc hai của ${val} `);

  // Vectors & decorators
  s = s.replace(/\\(?:vec|overrightarrow)\{([^{}]*)\}/g, ' véc tơ $1 ');
  s = s.replace(/\\widehat\{([^{}]*)\}/g, ' góc $1 ');
  s = s.replace(/\\overline\{([^{}]*)\}/g, ' $1 ngang ');
  s = s.replace(/\\text\{([^{}]*)\}/g, ' $1 ');
  s = s.replace(/\\mathcal\{O\}/g, ' ô lớn ');

  // Exponents & subscripts
  s = s.replace(/\^2\b/g, ' bình phương ');
  s = s.replace(/\^\{2\}/g, ' bình phương ');
  s = s.replace(/\^3\b/g, ' lập phương ');
  s = s.replace(/\^\{3\}/g, ' lập phương ');
  s = s.replace(/\^\{([^}]*)\}/g, ' mũ $1 ');
  s = s.replace(/\^([a-zA-Z0-9])/g, ' mũ $1 ');
  s = s.replace(/_\{([^}]*)\}/g, ' $1 ');
  s = s.replace(/_([a-zA-Z0-9])/g, ' $1 ');

  // Greek letters & STEM symbols
  const replacements: [RegExp, string][] = [
    [/\\Delta\b/g, ' đen ta '],
    [/\\delta\b/g, ' đen ta '],
    [/\\Omega\b/g, ' ôm '],
    [/\\omega\b/g, ' ô mê ga '],
    [/\\alpha\b/g, ' an pha '],
    [/\\beta\b/g, ' bê ta '],
    [/\\gamma\b/g, ' gam ma '],
    [/\\lambda\b/g, ' lam đa '],
    [/\\varphi\b|\\phi\b|\\Phi\b/g, ' phi '],
    [/\\theta\b/g, ' thê ta '],
    [/\\pi\b/g, ' pi '],
    [/\\sigma\b/g, ' xích ma '],
    [/\\mu\b/g, ' muy '],
    [/\\tau\b/g, ' tô '],
    [/\\rho\b/g, ' rô '],
    [/\\varepsilon\b/g, ' ép xi lon '],
    [/\\infty\b/g, ' vô cực '],
    [/\\Leftrightarrow\b|\\iff\b/g, ' tương đương với '],
    [/\\Rightarrow\b|\\implies\b/g, ' suy ra '],
    [/\\rightarrow\b|\\to\b/g, ' tiến tới '],
    [/\\neq\b|\\ne\b/g, ' khác '],
    [/\\leq\b|\\le\b|≤/g, ' nhỏ hơn hoặc bằng '],
    [/\\geq\b|\\ge\b|≥/g, ' lớn hơn hoặc bằng '],
    [/\\approx\b|≈/g, ' xấp xỉ '],
    [/\\equiv\b/g, ' đồng dư '],
    [/\\pm\b|±/g, ' cộng trừ '],
    [/\\cdot\b|\\times\b|×|·/g, ' nhân '],
    [/\\forall\b/g, ' với mọi '],
    [/\\exists\b/g, ' tồn tại '],
    [/\\in\b/g, ' thuộc '],
    [/\\notin\b/g, ' không thuộc '],
    [/\\perp\b|⊥/g, ' vuông góc với '],
    [/\\parallel\b|\|\|/g, ' song song với '],
    [/\\triangle\b/g, ' tam giác '],
    [/\\angle\b/g, ' góc '],
    [/\\circ\b|°/g, ' độ '],
    [/\\lim\b/g, ' giới hạn '],
    [/\\int\b/g, ' tích phân '],
    [/\\sum\b/g, ' tổng '],
    [/\\sin\b/g, ' sin '],
    [/\\cos\b/g, ' cốt '],
    [/\\tan\b/g, ' tang '],
    [/\\cot\b/g, ' cô tang '],
    [/\\log\b/g, ' lô ga rít '],
    [/\\ln\b/g, ' lô ga rít tự nhiên '],
    [/!=/g, ' khác '],
    [/==/g, ' bằng '],
    [/=/g, ' bằng '],
    [/\+/g, ' cộng '],
    [/</g, ' nhỏ hơn '],
    [/>/g, ' lớn hơn '],
    [/\\[a-zA-Z]+/g, ' '],
    [/[{}]/g, ' ']
  ];

  for (const [pattern, word] of replacements) {
    s = s.replace(pattern, word);
  }

  return s.replace(/\s+/g, ' ').trim();
}

export function pickBestVietnameseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const viVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith('vi') || /vietnam/i.test(v.name)
  );
  if (viVoices.length === 0) return null;

  const preferred =
    viVoices.find((v) => /google|hoaimy|namminh|linh|natural|neural/i.test(v.name)) ||
    viVoices.find((v) => v.lang.toLowerCase() === 'vi-vn') ||
    viVoices[0];
  return preferred || null;
}

function splitIntoSpeechChunks(text: string, maxLen = 210): string[] {
  const sentences = text
    .split(/(?<=[.!?;\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = '';

  for (const sent of sentences) {
    if (sent.length > maxLen) {
      if (buffer) {
        chunks.push(buffer);
        buffer = '';
      }
      const subParts = sent.split(/,\s*/);
      let subBuf = '';
      for (const part of subParts) {
        if ((subBuf + ', ' + part).length > maxLen && subBuf) {
          chunks.push(subBuf);
          subBuf = part;
        } else {
          subBuf = subBuf ? `${subBuf}, ${part}` : part;
        }
      }
      if (subBuf) chunks.push(subBuf);
    } else if ((buffer + ' ' + sent).length > maxLen && buffer) {
      chunks.push(buffer);
      buffer = sent;
    } else {
      buffer = buffer ? `${buffer} ${sent}` : sent;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

let activeSpeechToken = 0;

export function stopVietnameseSpeech(): void {
  activeSpeechToken++;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

export function speakVietnameseLecture(
  rawText: string,
  options?: {
    lang?: 'vi' | 'en';
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !rawText.trim()) {
    options?.onEnd?.();
    return;
  }

  stopVietnameseSpeech();
  const token = activeSpeechToken;
  const isEn = options?.lang === 'en';
  const spoken = isEn
    ? rawText.replace(/\$\$?([^$]+)\$\$?/g, '$1').replace(/[*_`#]/g, ' ').replace(/\s+/g, ' ').trim()
    : toVietnameseSpokenMath(rawText);

  if (!spoken) {
    options?.onEnd?.();
    return;
  }

  const chunks = splitIntoSpeechChunks(spoken, 220);
  const voice = isEn ? null : pickBestVietnameseVoice();
  const rate = options?.rate ?? 1.02;

  options?.onStart?.();

  let idx = 0;
  const speakNext = () => {
    if (token !== activeSpeechToken) return;
    if (idx >= chunks.length) {
      options?.onEnd?.();
      return;
    }

    const utter = new SpeechSynthesisUtterance(chunks[idx]);
    utter.lang = isEn ? 'en-US' : 'vi-VN';
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.onend = () => {
      idx++;
      speakNext();
    };
    utter.onerror = () => {
      options?.onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utter);
    } catch {
      options?.onEnd?.();
    }
  };

  speakNext();
}
