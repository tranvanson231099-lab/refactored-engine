
/**
 * VietFlex Engine 2.1.6 - Precision Orthography & Chrome OS Flex Optimized
 * Tuân thủ quy tắc đặt dấu của Bộ Giáo dục & Đào tạo.
 * Hỗ trợ Smart Backspace: Xóa dấu trước, xóa chữ sau.
 */

export type InputMethod = 'Telex' | 'VNI';

const VOWEL_MAP: Record<string, string[]> = {
  'a': ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  'ă': ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  'â': ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  'e': ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  'ê': ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  'i': ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  'o': ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  'ô': ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  'ơ': ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  'u': ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  'ư': ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  'y': ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
};

const BASE_VOWEL_MAP: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

const UNHOOK_MAP: Record<string, string> = {
  'ư': 'u', 'ứ': 'ú', 'ừ': 'ù', 'ử': 'ủ', 'ữ': 'ũ', 'ự': 'ụ',
  'ơ': 'o', 'ớ': 'ó', 'ờ': 'ò', 'ở': 'ỏ', 'ỡ': 'õ', 'ợ': 'ọ',
  'ă': 'a', 'ắ': 'á', 'ằ': 'à', 'ẳ': 'ả', 'ẵ': 'ã', 'ặ': 'ạ',
  'Ư': 'U', 'Ứ': 'Ú', 'Ừ': 'Ù', 'Ử': 'Ủ', 'Ữ': 'Ũ', 'Ự': 'Ụ',
  'Ơ': 'O', 'Ớ': 'Ó', 'Ờ': 'Ò', 'Ở': 'Ỏ', 'Ỡ': 'Õ', 'Ợ': 'Ọ',
  'Ă': 'A', 'Ắ': 'Á', 'Ằ': 'À', 'Ẳ': 'Ả', 'Ẵ': 'Ã', 'Ặ': 'Ạ'
};

const TONES_TELEX: Record<string, number> = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, 'z': 0 };
const TONES_VNI: Record<string, number> = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '0': 0 };

function isVowel(char: string): boolean {
  if (!char) return false;
  const c = char.toLowerCase();
  return 'aeiouyàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ'.includes(c);
}

function hasVowel(word: string): boolean {
  for (const char of word) {
    if (isVowel(char)) return true;
  }
  return false;
}

function removeToneOnly(word: string): string {
  let result = '';
  for (const char of word) {
    let found = false;
    const lowerChar = char.toLowerCase();
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (variants.includes(lowerChar)) {
        const isUpper = char === char.toUpperCase();
        result += isUpper ? base.toUpperCase() : base;
        found = true;
        break;
      }
    }
    if (!found) result += char;
  }
  return result;
}

function getWordToneIndex(word: string): number {
  for (const char of word) {
    const lower = char.toLowerCase();
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      const idx = variants.indexOf(lower);
      if (idx > 0) return idx;
    }
  }
  return 0;
}

/**
 * Thuật toán xác định vị trí đặt dấu chuẩn 2.1.6 của Bộ Giáo dục
 */
function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeToneOnly(word);
  const lowerClean = clean.toLowerCase();
  const vowelIndices: number[] = [];
  
  for (let i = 0; i < clean.length; i++) {
    if (isVowel(clean[i])) vowelIndices.push(i);
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // Logic đặc biệt cho 'qu' và 'gi'
  let actualVowels = [...vowelIndices];
  if (lowerClean.startsWith('qu') && vowelIndices[0] === 1) {
    actualVowels.shift(); // 'u' trong 'qu' là âm đệm
  } else if (lowerClean.startsWith('gi') && vowelIndices[0] === 1 && vowelIndices.length > 1) {
    actualVowels.shift(); // 'i' trong 'gi' là âm đệm
  }

  if (actualVowels.length === 0) return vowelIndices[vowelIndices.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  const vowelString = actualVowels.map(i => lowerClean[i]).join('');
  const hasFinalConsonant = !isVowel(clean[clean.length - 1]);

  // Quy tắc cụm nguyên âm có dấu phụ (ă, â, ê, ô, ơ, ư)
  for (const idx of actualVowels) {
    if ('ăâêôơư'.includes(lowerClean[idx])) return idx;
  }

  // Quy tắc nguyên âm đôi (ia, iê, ua, uô, ươ)
  const doubleVowels = ['ia', 'iê', 'ua', 'uô', 'ươ'];
  for (const dv of doubleVowels) {
    if (vowelString.includes(dv)) {
      if (hasFinalConsonant) return actualVowels[1]; // Có âm cuối đặt ở âm thứ 2 (miếng, muốn, thưởng)
      return actualVowels[0]; // Không âm cuối đặt ở âm thứ 1 (mía, tủa, nghĩa)
    }
  }

  // Quy tắc vần oa, oe, uy (Kiểu mới vs Kiểu cũ)
  if (isModern && (vowelString.includes('oa') || vowelString.includes('oe') || vowelString.includes('uy'))) {
    return actualVowels[1]; // Hoà, Khoẻ, Thuỷ
  }

  // Trường hợp còn lại: Nếu có âm cuối đặt ở âm thứ 2, không có đặt ở âm thứ 1
  if (hasFinalConsonant) return actualVowels[1];
  return actualVowels[0];
}

function applyTone(word: string, toneIndex: number, isModern: boolean): string {
  const cleanWord = removeToneOnly(word);
  const pos = getTonePosition(cleanWord, isModern);
  if (pos !== -1) {
    const charAtPos = cleanWord[pos];
    const isUpper = charAtPos === charAtPos.toUpperCase();
    const baseVowel = charAtPos.toLowerCase();
    
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (base === baseVowel || (base === 'ă' && variants.includes(baseVowel)) || (base === 'â' && variants.includes(baseVowel))) {
          const mappedVowel = variants[toneIndex];
          return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return cleanWord;
}

/**
 * Smart Backspace: Xóa dấu/móc trước khi xóa ký tự
 */
export function removeLastMark(text: string): string | null {
  if (!text) return null;
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  const word = text.substring(lastSpaceIndex + 1);
  if (!word) return null;

  const toneIdx = getWordToneIndex(word);
  const cleanTone = removeToneOnly(word);
  
  let hasHook = false;
  let unhooked = '';
  for (const char of cleanTone) {
    if (UNHOOK_MAP[char]) {
      unhooked += UNHOOK_MAP[char];
      hasHook = true;
    } else {
      unhooked += char;
    }
  }

  if (toneIdx !== 0 || hasHook) {
    return prefix + unhooked;
  }

  return null;
}

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  if (method === 'Telex') {
    // Xử lý phím W
    if (lastChar === 'w') {
      const baseWord = word.slice(0, -1);
      const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();

      // Toggle W
      if (baseWord.toLowerCase().endsWith('w') || baseWord.toLowerCase().endsWith('ư')) {
         const stripped = removeToneOnly(baseWord.slice(0, -1));
         return prefix + stripped + (isLastUpper ? 'W' : 'w');
      }

      // hw -> hư
      if (baseWord.length > 0 && !isVowel(baseWord.slice(-1))) {
        return prefix + baseWord + (isLastUpper ? 'Ư' : 'ư');
      }

      // Smart Hook (sonw -> sơn)
      let currentBase = removeToneOnly(baseWord);
      let currentTone = getWordToneIndex(baseWord);
      let handled = false;
      const lowerBase = currentBase.toLowerCase();

      if (lowerBase.includes('uo')) {
        const idx = lowerBase.lastIndexOf('uo');
        const isUUpper = currentBase[idx] === currentBase[idx].toUpperCase();
        const isOUpper = currentBase[idx+1] === currentBase[idx+1].toUpperCase();
        currentBase = currentBase.substring(0, idx) + (isUUpper ? 'Ư' : 'ư') + (isOUpper ? 'Ơ' : 'ơ') + currentBase.substring(idx + 2);
        handled = true;
      } else {
        for (let i = currentBase.length - 1; i >= 0; i--) {
          const char = currentBase[i].toLowerCase();
          if ('uoa'.includes(char)) {
            const replacement = char === 'u' ? 'ư' : char === 'o' ? 'ơ' : 'ă';
            const isUpper = currentBase[i] === currentBase[i].toUpperCase();
            currentBase = currentBase.substring(0, i) + (isUpper ? replacement.toUpperCase() : replacement) + currentBase.substring(i + 1);
            handled = true;
            break;
          }
        }
      }

      if (handled) return prefix + applyTone(currentBase, currentTone, isModern);
      if (word.length === 1) return prefix + (isLastUpper ? 'Ư' : 'ư');
    }

    // Xử lý ee, aa, oo, dd
    const modifiers: Record<string, string> = { 'e': 'ê', 'a': 'â', 'o': 'ô', 'd': 'đ' };
    if (modifiers[lastChar] && word.length >= 2) {
      const prevChar = word.slice(-2, -1).toLowerCase();
      const target = modifiers[lastChar];
      const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();

      if (prevChar === lastChar) {
        const base = removeToneOnly(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        return prefix + applyTone(base + (isLastUpper ? target.toUpperCase() : target), tone, isModern);
      }
      if (prevChar === target) {
        const base = removeToneOnly(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        return prefix + applyTone(base + (isLastUpper ? lastChar.toUpperCase() : lastChar), tone, isModern);
      }
    }
  }

  // Xử lý dấu thanh
  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;
  const toneIdx = tones[lastChar];

  if (toneIdx !== undefined) {
    const baseWord = word.slice(0, -1);
    if (!hasVowel(baseWord)) return text;
    const currentTone = getWordToneIndex(baseWord);
    
    // Toggle tone (lyss -> lys)
    if (currentTone === toneIdx && toneIdx !== 0) {
      return prefix + removeToneOnly(baseWord);
    }
    return prefix + applyTone(baseWord, toneIdx, isModern);
  }

  // Smart Fix: Tự sửa lỗi đặt dấu khi gõ
  if (isSmartFix && hasVowel(word)) {
    const tone = getWordToneIndex(word);
    const cleaned = removeToneOnly(word);
    return prefix + applyTone(cleaned, tone, isModern);
  }

  return text;
}
