
/**
 * VietFlex Core 1.7 - Ultra-Fast Local Smart Engine
 * Xử lý thông minh chuẩn hóa dấu và tổ hợp phím tức thì (Offline First).
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

const TONES_TELEX: Record<string, number> = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, 'z': 0 };
const TONES_VNI: Record<string, number> = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '0': 0 };

function isVowel(char: string): boolean {
  if (!char) return false;
  return 'aeiouyàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ'.includes(char.toLowerCase());
}

function removeTone(word: string): string {
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

function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeTone(word).toLowerCase();
  const vowelsInWord: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    if (isVowel(clean[i])) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelChars = vowelsInWord.map(i => clean[i]).join('');
  
  // Xử lý âm đệm 'qu' và 'gi'
  let actualVowels = [...vowelsInWord];
  let actualVowelChars = vowelChars;

  if (clean.startsWith('qu') && vowelsInWord[0] === 1) {
    actualVowels.shift();
    actualVowelChars = actualVowelChars.slice(1);
  } else if (clean.startsWith('gi') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
    actualVowelChars = actualVowelChars.slice(1);
  }

  if (actualVowels.length === 0) return vowelsInWord[vowelsInWord.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  // Quy tắc đặt dấu 2 nguyên âm
  if (actualVowels.length === 2) {
    if (isModern && (actualVowelChars === 'oa' || actualVowelChars === 'oe' || actualVowelChars === 'uy')) {
      return actualVowels[1];
    }
    const lastChar = clean[clean.length - 1];
    if (isVowel(lastChar)) return actualVowels[0];
    return actualVowels[1];
  }

  // Quy tắc đặt dấu 3 nguyên âm (ưu tiên chữ ở giữa)
  if (actualVowels.length === 3) {
    if (actualVowelChars === 'uyê' || actualVowelChars === 'iêu' || actualVowelChars === 'uôi' || actualVowelChars === 'oai') {
      return actualVowels[1];
    }
    return actualVowels[1];
  }

  return actualVowels[1] || actualVowels[0];
}

function applyTone(word: string, toneIndex: number, isModern: boolean): string {
  const cleanWord = removeTone(word);
  const pos = getTonePosition(cleanWord, isModern);
  if (pos !== -1) {
    const charAtPos = cleanWord[pos];
    const isUpper = charAtPos === charAtPos.toUpperCase();
    const baseVowel = charAtPos.toLowerCase();
    
    // Tìm gốc nguyên âm thực sự (có thể là ă, â, ê, ô, ơ, ư)
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (base === baseVowel) {
        const mappedVowel = variants[toneIndex];
        return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return word;
}

export function convertText(text: string, method: InputMethod, isModern: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();
  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;

  // 1. Xử lý gõ lặp phím modifier để trả lại phím gốc (ww -> w, aa -> a)
  if (method === 'Telex' && word.length >= 2) {
    const lastTwo = word.slice(-2).toLowerCase();
    const restoreMap: Record<string, string> = { 'aa': 'a', 'ee': 'e', 'oo': 'o', 'dd': 'd', 'ww': 'w' };
    if (restoreMap[lastTwo]) {
      const base = word.slice(0, -2);
      const tone = getWordToneIndex(word);
      return prefix + applyTone(base + restoreMap[lastTwo], tone, isModern);
    }
  }

  // 2. Xử lý phím W (Telex) - sơn, hư, thuyền
  if (method === 'Telex' && lastChar === 'w') {
    let cleanBase = removeTone(word.slice(0, -1));
    let toneIdx = getWordToneIndex(word.slice(0, -1));

    if (cleanBase.toLowerCase().endsWith('uo')) {
      cleanBase = cleanBase.slice(0, -2) + (cleanBase.slice(-2, -1) === cleanBase.slice(-2, -1).toUpperCase() ? 'ƯƠ' : 'ươ');
    } else {
      let found = false;
      for (let i = cleanBase.length - 1; i >= 0; i--) {
        const char = cleanBase[i].toLowerCase();
        if ('uoa'.includes(char)) {
          const replacement = char === 'u' ? 'ư' : char === 'o' ? 'ơ' : 'ă';
          const isUpper = cleanBase[i] === cleanBase[i].toUpperCase();
          cleanBase = cleanBase.substring(0, i) + (isUpper ? replacement.toUpperCase() : replacement) + cleanBase.substring(i + 1);
          found = true;
          break;
        }
      }
      if (!found) cleanBase += (word.slice(-1) === word.slice(-1).toUpperCase() ? 'W' : 'w');
    }
    return prefix + applyTone(cleanBase, toneIdx, isModern);
  }

  // 3. Tổ hợp phím Telex/VNI chuẩn (â, ê, ô, đ, ă)
  const telexMap: Record<string, string> = { 'aa': 'â', 'ee': 'ê', 'oo': 'ô', 'dd': 'đ', 'aw': 'ă' };
  if (method === 'Telex' && word.length >= 2) {
    const lastTwo = word.slice(-2).toLowerCase();
    if (telexMap[lastTwo]) {
      const base = word.slice(0, -2);
      const tone = getWordToneIndex(word);
      const replacement = telexMap[lastTwo];
      const isUpper = word.slice(-1) === word.slice(-1).toUpperCase();
      return prefix + applyTone(removeTone(base) + (isUpper ? replacement.toUpperCase() : replacement), tone, isModern);
    }
  }

  // 4. Xử lý phím dấu (s, f, r, x, j)
  const toneIndexFromKey = tones[lastChar];
  if (toneIndexFromKey !== undefined) {
    const baseWord = word.slice(0, -1);
    const currentTone = getWordToneIndex(baseWord);
    // Nếu gõ lại phím dấu cũ -> Xóa dấu
    if (currentTone === toneIndexFromKey) {
      return prefix + applyTone(baseWord, 0, isModern);
    }
    return prefix + applyTone(baseWord, toneIndexFromKey, isModern);
  }

  // 5. Tự động sửa lỗi thời gian thực (Smart Normalization)
  // Ví dụ: thuyene -> thuyền, luyené -> luyến
  const currentTone = getWordToneIndex(word);
  const cleanNormalizedWord = removeTone(word);
  return prefix + applyTone(cleanNormalizedWord, currentTone, isModern);
}
