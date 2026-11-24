// Built-in Vietnamese Telex & VNI Input Method Engine + Diacritic Utilities
// Designed to work smoothly alongside OS IMEs (UniKey, EVKey, macOS Telex/VNI)
// without double-transforming Unicode characters that an OS IME already combined.

export type VietnameseImeMode = 'telex' | 'vni' | 'system';

type ToneIndex = 0 | 1 | 2 | 3 | 4 | 5; // 0: none, 1: sac, 2: huyen, 3: hoi, 4: nga, 5: nang
type BaseVowel = 'a' | 'ă' | 'â' | 'e' | 'ê' | 'i' | 'o' | 'ô' | 'ơ' | 'u' | 'ư' | 'y';

const VOWEL_MATRIX: Record<BaseVowel, [string, string, string, string, string, string]> = {
  a: ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  ă: ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  â: ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  e: ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  ê: ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  i: ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  o: ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  ô: ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  ơ: ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  u: ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  ư: ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
};

const CHAR_INFO = new Map<string, { base: BaseVowel; tone: ToneIndex; upper: boolean }>();

(Object.keys(VOWEL_MATRIX) as BaseVowel[]).forEach((base) => {
  const row = VOWEL_MATRIX[base];
  row.forEach((ch, idx) => {
    const tone = idx as ToneIndex;
    CHAR_INFO.set(ch, { base, tone, upper: false });
    const up = ch.toUpperCase();
    if (up !== ch) {
      CHAR_INFO.set(up, { base, tone, upper: true });
    }
  });
});

function composeVowelChar(base: BaseVowel, tone: ToneIndex, upper: boolean): string {
  const lower = VOWEL_MATRIX[base][tone];
  return upper ? lower.toUpperCase() : lower;
}

export function stripVietnameseDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function getToneIndexOfSyllable(chars: string[]): ToneIndex {
  for (const ch of chars) {
    const info = CHAR_INFO.get(ch);
    if (info && info.tone !== 0) return info.tone;
  }
  return 0;
}

function findVowelIndices(chars: string[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (CHAR_INFO.has(chars[i])) {
      indices.push(i);
    }
  }
  if (indices.length <= 1) return indices;

  // Exclude 'u' in 'qu-' when followed by another vowel
  if (
    indices[0] === 1 &&
    (chars[0] === 'q' || chars[0] === 'Q') &&
    CHAR_INFO.get(chars[1])?.base === 'u' &&
    indices.length >= 2
  ) {
    indices.shift();
  }

  // Exclude 'i' in 'gi-' when followed by another vowel
  if (
    indices.length >= 2 &&
    indices[0] === 1 &&
    (chars[0] === 'g' || chars[0] === 'G') &&
    CHAR_INFO.get(chars[1])?.base === 'i'
  ) {
    indices.shift();
  }

  return indices;
}

function chooseToneTargetIndex(chars: string[], vowelIndices: number[]): number {
  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // If 'ươ' cluster exists, tone always sits on 'ơ'
  for (let k = 0; k < vowelIndices.length - 1; k++) {
    const i1 = vowelIndices[k];
    const i2 = vowelIndices[k + 1];
    if (
      i2 === i1 + 1 &&
      CHAR_INFO.get(chars[i1])?.base === 'ư' &&
      CHAR_INFO.get(chars[i2])?.base === 'ơ'
    ) {
      return i2;
    }
  }

  // Any circumflex/horn/breve vowel takes priority
  for (const idx of vowelIndices) {
    const b = CHAR_INFO.get(chars[idx])?.base;
    if (b === 'ă' || b === 'â' || b === 'ê' || b === 'ô' || b === 'ơ' || b === 'ư') {
      return idx;
    }
  }

  const lastVowelIdx = vowelIndices[vowelIndices.length - 1];
  const hasTrailingConsonant = lastVowelIdx < chars.length - 1;
  if (hasTrailingConsonant) {
    return vowelIndices.length >= 2 ? vowelIndices[1] : vowelIndices[0];
  }

  if (vowelIndices.length === 2) {
    const b1 = CHAR_INFO.get(chars[vowelIndices[0]])?.base;
    const b2 = CHAR_INFO.get(chars[vowelIndices[1]])?.base;
    const pair = `${b1}${b2}`;
    if (pair === 'oa' || pair === 'oe') {
      return vowelIndices[1];
    }
    return vowelIndices[0];
  }

  return vowelIndices[1];
}

function applyToneToSyllable(chars: string[], nextTone: ToneIndex): boolean {
  const vowelIndices = findVowelIndices(chars);
  if (vowelIndices.length === 0) return false;

  const currentTone = getToneIndexOfSyllable(chars);
  const targetTone: ToneIndex = currentTone === nextTone ? 0 : nextTone;

  // Clear existing tones across all vowels
  for (const idx of vowelIndices) {
    const info = CHAR_INFO.get(chars[idx]);
    if (info && info.tone !== 0) {
      chars[idx] = composeVowelChar(info.base, 0, info.upper);
    }
  }

  if (targetTone === 0) {
    return currentTone !== 0 || nextTone === 0;
  }

  const targetIdx = chooseToneTargetIndex(chars, vowelIndices);
  if (targetIdx < 0) return false;
  const info = CHAR_INFO.get(chars[targetIdx]);
  if (!info) return false;
  chars[targetIdx] = composeVowelChar(info.base, targetTone, info.upper);
  return true;
}

function repositionToneIfNeeded(chars: string[]): void {
  const currentTone = getToneIndexOfSyllable(chars);
  if (currentTone === 0) return;
  const vowelIndices = findVowelIndices(chars);
  if (vowelIndices.length === 0) return;
  for (const idx of vowelIndices) {
    const info = CHAR_INFO.get(chars[idx]);
    if (info && info.tone !== 0) {
      chars[idx] = composeVowelChar(info.base, 0, info.upper);
    }
  }
  const targetIdx = chooseToneTargetIndex(chars, vowelIndices);
  if (targetIdx >= 0) {
    const info = CHAR_INFO.get(chars[targetIdx]);
    if (info) {
      chars[targetIdx] = composeVowelChar(info.base, currentTone, info.upper);
    }
  }
}

function transformLastSyllable(syllable: string, keyChar: string, mode: 'telex' | 'vni'): string {
  if (!syllable) return keyChar;
  const lowerKey = keyChar.toLowerCase();
  const chars = Array.from(syllable);

  if (mode === 'telex') {
    // 1. D -> Đ
    if (lowerKey === 'd') {
      const first = chars[0];
      if (first === 'd' || first === 'D') {
        chars[0] = first === 'D' ? 'Đ' : 'đ';
        return chars.join('');
      }
      if (first === 'đ' || first === 'Đ') {
        chars[0] = first === 'Đ' ? 'D' : 'd';
        return chars.join('') + keyChar;
      }
      return syllable + keyChar;
    }

    // 2. Vowel Doubling (aa -> â, ee -> ê, oo -> ô)
    if (lowerKey === 'a' || lowerKey === 'e' || lowerKey === 'o') {
      const targetBase = lowerKey === 'a' ? 'â' : lowerKey === 'e' ? 'ê' : 'ô';
      const srcBase = lowerKey as BaseVowel;
      for (let i = chars.length - 1; i >= 0; i--) {
        const info = CHAR_INFO.get(chars[i]);
        if (!info) continue;
        if (info.base === srcBase) {
          chars[i] = composeVowelChar(targetBase, info.tone, info.upper);
          repositionToneIfNeeded(chars);
          return chars.join('');
        }
        if (info.base === targetBase) {
          chars[i] = composeVowelChar(srcBase, info.tone, info.upper);
          return chars.join('') + keyChar;
        }
      }
      return syllable + keyChar;
    }

    // 3. Telex 'w' (a->ă, o->ơ, u->ư, uo->ươ, or consonant + w -> ư)
    if (lowerKey === 'w') {
      // Special 'uo' -> 'ươ'
      for (let i = 0; i < chars.length - 1; i++) {
        const i1 = CHAR_INFO.get(chars[i]);
        const i2 = CHAR_INFO.get(chars[i + 1]);
        if (
          i1 &&
          i2 &&
          (i1.base === 'u' || i1.base === 'ư') &&
          (i2.base === 'o' || i2.base === 'ơ')
        ) {
          if (i1.base === 'u' || i2.base === 'o') {
            chars[i] = composeVowelChar('ư', i1.tone, i1.upper);
            chars[i + 1] = composeVowelChar('ơ', i2.tone, i2.upper);
            repositionToneIfNeeded(chars);
            return chars.join('');
          } else {
            chars[i] = composeVowelChar('u', i1.tone, i1.upper);
            chars[i + 1] = composeVowelChar('o', i2.tone, i2.upper);
            return chars.join('') + keyChar;
          }
        }
      }

      for (let i = chars.length - 1; i >= 0; i--) {
        const info = CHAR_INFO.get(chars[i]);
        if (!info) continue;
        if (info.base === 'a') {
          chars[i] = composeVowelChar('ă', info.tone, info.upper);
          return chars.join('');
        }
        if (info.base === 'o') {
          chars[i] = composeVowelChar('ơ', info.tone, info.upper);
          return chars.join('');
        }
        if (info.base === 'u') {
          chars[i] = composeVowelChar('ư', info.tone, info.upper);
          return chars.join('');
        }
        if (info.base === 'ă' || info.base === 'ơ' || info.base === 'ư') {
          const reverted: BaseVowel = info.base === 'ă' ? 'a' : info.base === 'ơ' ? 'o' : 'u';
          chars[i] = composeVowelChar(reverted, info.tone, info.upper);
          return chars.join('') + keyChar;
        }
      }
      // If syllable has no vowels yet (e.g. 't' + 'w' -> 'tư')
      if (chars.length > 0 && /^[bcdfghklmnpqrstvwxzđ]+$/i.test(syllable)) {
        return syllable + (keyChar === 'W' ? 'Ư' : 'ư');
      }
      return syllable + keyChar;
    }

    // 4. Telex Tone Keys (s, f, r, x, j, z)
    const telexToneMap: Record<string, ToneIndex> = {
      s: 1,
      f: 2,
      r: 3,
      x: 4,
      j: 5,
      z: 0,
    };
    if (lowerKey in telexToneMap) {
      const nextTone = telexToneMap[lowerKey];
      const currentTone = getToneIndexOfSyllable(chars);
      if (nextTone === 0) {
        if (currentTone === 0) return syllable + keyChar;
        applyToneToSyllable(chars, 0);
        return chars.join('');
      }
      if (currentTone === nextTone) {
        applyToneToSyllable(chars, 0);
        return chars.join('') + keyChar;
      }
      const applied = applyToneToSyllable(chars, nextTone);
      return applied ? chars.join('') : syllable + keyChar;
    }

    return syllable + keyChar;
  }

  // ==================== VNI MODE ====================
  if (lowerKey === '9') {
    const first = chars[0];
    if (first === 'd' || first === 'D') {
      chars[0] = first === 'D' ? 'Đ' : 'đ';
      return chars.join('');
    }
    if (first === 'đ' || first === 'Đ') {
      chars[0] = first === 'Đ' ? 'D' : 'd';
      return chars.join('') + keyChar;
    }
    return syllable + keyChar;
  }

  if (lowerKey === '6') {
    for (let i = chars.length - 1; i >= 0; i--) {
      const info = CHAR_INFO.get(chars[i]);
      if (!info) continue;
      if (info.base === 'a' || info.base === 'e' || info.base === 'o') {
        const nextBase: BaseVowel = info.base === 'a' ? 'â' : info.base === 'e' ? 'ê' : 'ô';
        chars[i] = composeVowelChar(nextBase, info.tone, info.upper);
        repositionToneIfNeeded(chars);
        return chars.join('');
      }
      if (info.base === 'â' || info.base === 'ê' || info.base === 'ô') {
        const prevBase: BaseVowel = info.base === 'â' ? 'a' : info.base === 'ê' ? 'e' : 'o';
        chars[i] = composeVowelChar(prevBase, info.tone, info.upper);
        return chars.join('') + keyChar;
      }
    }
    return syllable + keyChar;
  }

  if (lowerKey === '7') {
    for (let i = 0; i < chars.length - 1; i++) {
      const i1 = CHAR_INFO.get(chars[i]);
      const i2 = CHAR_INFO.get(chars[i + 1]);
      if (
        i1 &&
        i2 &&
        (i1.base === 'u' || i1.base === 'ư') &&
        (i2.base === 'o' || i2.base === 'ơ')
      ) {
        if (i1.base === 'u' || i2.base === 'o') {
          chars[i] = composeVowelChar('ư', i1.tone, i1.upper);
          chars[i + 1] = composeVowelChar('ơ', i2.tone, i2.upper);
          repositionToneIfNeeded(chars);
          return chars.join('');
        } else {
          chars[i] = composeVowelChar('u', i1.tone, i1.upper);
          chars[i + 1] = composeVowelChar('o', i2.tone, i2.upper);
          return chars.join('') + keyChar;
        }
      }
    }
    for (let i = chars.length - 1; i >= 0; i--) {
      const info = CHAR_INFO.get(chars[i]);
      if (!info) continue;
      if (info.base === 'o' || info.base === 'u') {
        chars[i] = composeVowelChar(info.base === 'o' ? 'ơ' : 'ư', info.tone, info.upper);
        return chars.join('');
      }
      if (info.base === 'ơ' || info.base === 'ư') {
        chars[i] = composeVowelChar(info.base === 'ơ' ? 'o' : 'u', info.tone, info.upper);
        return chars.join('') + keyChar;
      }
    }
    return syllable + keyChar;
  }

  if (lowerKey === '8') {
    for (let i = chars.length - 1; i >= 0; i--) {
      const info = CHAR_INFO.get(chars[i]);
      if (!info) continue;
      if (info.base === 'a') {
        chars[i] = composeVowelChar('ă', info.tone, info.upper);
        return chars.join('');
      }
      if (info.base === 'ă') {
        chars[i] = composeVowelChar('a', info.tone, info.upper);
        return chars.join('') + keyChar;
      }
    }
    return syllable + keyChar;
  }

  const vniToneMap: Record<string, ToneIndex> = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '0': 0,
  };
  if (lowerKey in vniToneMap) {
    const nextTone = vniToneMap[lowerKey];
    const currentTone = getToneIndexOfSyllable(chars);
    if (nextTone === 0) {
      if (currentTone === 0) return syllable + keyChar;
      applyToneToSyllable(chars, 0);
      return chars.join('');
    }
    if (currentTone === nextTone) {
      applyToneToSyllable(chars, 0);
      return chars.join('') + keyChar;
    }
    const applied = applyToneToSyllable(chars, nextTone);
    return applied ? chars.join('') : syllable + keyChar;
  }

  return syllable + keyChar;
}

/**
 * Applies built-in Telex or VNI transformation when a single ASCII character is appended
 * at the end of `prevText` -> `nextRawText`. Leaves non-append edits, multi-char OS IME
 * commits, and `'system'` mode completely untouched.
 */
export function applyBuiltInVietnameseIme(
  prevText: string,
  nextRawText: string,
  imeMode: VietnameseImeMode
): string {
  if (imeMode === 'system') return nextRawText;
  if (nextRawText.length !== prevText.length + 1) return nextRawText;
  if (!nextRawText.startsWith(prevText)) return nextRawText;

  const addedChar = nextRawText.slice(-1);
  if (!/^[a-zA-Z0-9]$/.test(addedChar)) return nextRawText;

  // Extract trailing word/syllable token
  const match = prevText.match(/([^\s.,;:!?(){}[\]<>"'`~@#$%^&*+=|\\/_-]+)$/);
  const lastToken = match ? match[1] : '';
  if (!lastToken) return nextRawText;

  const prefixBeforeToken = prevText.slice(0, prevText.length - lastToken.length);
  const transformedToken = transformLastSyllable(lastToken, addedChar, imeMode);
  return prefixBeforeToken + transformedToken;
}

/**
 * Checks whether `typedPrefix` is a valid exact OR intermediate Vietnamese base-letter
 * prefix of `targetWord` so external OS IMEs (UniKey / EVKey / macOS Telex & VNI)
 * are never prematurely blocked mid-syllable.
 */
export function matchesVietnamesePrefix(typedPrefix: string, targetWord: string): {
  exact: boolean;
  prefixMatch: boolean;
  visualMatchedLen: number;
} {
  if (!typedPrefix) {
    return { exact: false, prefixMatch: true, visualMatchedLen: 0 };
  }
  if (typedPrefix === targetWord) {
    return { exact: true, prefixMatch: true, visualMatchedLen: targetWord.length };
  }
  if (targetWord.startsWith(typedPrefix)) {
    return { exact: false, prefixMatch: true, visualMatchedLen: typedPrefix.length };
  }

  const strippedTyped = stripVietnameseDiacritics(typedPrefix);
  const strippedTarget = stripVietnameseDiacritics(targetWord);

  if (strippedTarget.startsWith(strippedTyped)) {
    return {
      exact: false,
      prefixMatch: true,
      visualMatchedLen: Math.min(targetWord.length, strippedTyped.length),
    };
  }

  // Also tolerate 1-2 extra intermediate Telex/VNI modifier chars while user is mid-syllable
  // (e.g., "toas" -> "toán", "duow" / "duongw" -> "dương", "dong6" -> "động")
  const tokensTyped = typedPrefix.split(/\s+/);
  const tokensTarget = targetWord.split(/\s+/);
  if (tokensTyped.length <= tokensTarget.length) {
    let allPrevMatch = true;
    for (let i = 0; i < tokensTyped.length - 1; i++) {
      if (
        stripVietnameseDiacritics(tokensTyped[i]) !==
        stripVietnameseDiacritics(tokensTarget[i])
      ) {
        allPrevMatch = false;
        break;
      }
    }
    if (allPrevMatch) {
      const curTyped = stripVietnameseDiacritics(tokensTyped[tokensTyped.length - 1])
        .replace(/[0-9]/g, '');
      const curTarget = stripVietnameseDiacritics(
        tokensTarget[tokensTyped.length - 1]
      );
      // Remove doubled Telex modifier letters & trailing tone/w modifiers when testing partial match
      const collapsedTelex = curTyped
        .replace(/(.)\1/g, '$1')
        .replace(/([aouAOU])[wW]/g, '$1')
        .replace(/[sfrxjwSFRXJW]+$/, '');
      if (
        curTarget.startsWith(curTyped) ||
        curTarget.startsWith(collapsedTelex)
      ) {
        const matchedCharsBefore = tokensTarget
          .slice(0, tokensTyped.length - 1)
          .reduce((acc, w) => acc + w.length + 1, 0);
        return {
          exact: false,
          prefixMatch: true,
          visualMatchedLen: Math.min(
            targetWord.length,
            matchedCharsBefore + Math.min(curTarget.length, collapsedTelex.length)
          ),
        };
      }
    }
  }

  return { exact: false, prefixMatch: false, visualMatchedLen: 0 };
}
