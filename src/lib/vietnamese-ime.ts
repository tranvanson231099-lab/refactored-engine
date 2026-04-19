
/**
 * VietFlex Engine 2.0 - Ultra-Fast Local Smart Processor
 * Tối ưu hóa tốc độ gõ, sửa lỗi chính tả và đặt dấu chuẩn Unicode tức thì (Zero Latency).
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

function hasVowel(word: string): boolean {
  for (const char of word) {
    if (isVowel(char)) return true;
  }
  return false;
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

  // Xử lý âm đệm qu, gi
  let actualVowels = [...vowelsInWord];
  if (clean.startsWith('qu') && vowelsInWord[0] === 1) {
    actualVowels.shift();
  } else if (clean.startsWith('gi') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
  }

  if (actualVowels.length === 0) return vowelsInWord[vowelsInWord.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  if (actualVowels.length === 2) {
    const vowelStr = actualVowels.map(i => clean[i]).join('');
    // Kiểu mới: hòa, thúy
    if (isModern && (vowelStr === 'oa' || vowelStr === 'oe' || vowelStr === 'uy')) {
      return actualVowels[1];
    }
    const lastChar = clean[clean.length - 1];
    if (isVowel(lastChar)) return actualVowels[0];
    return actualVowels[1];
  }

  if (actualVowels.length === 3) {
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
    
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (base === baseVowel) {
        const mappedVowel = variants[toneIndex];
        return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return word;
}

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  // Khi gõ phím cách -> chuẩn hóa từ vừa gõ
  if (text.endsWith(' ')) {
    if (!isSmartFix) return text;
    const words = text.trimEnd().split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord && hasVowel(lastWord)) {
      words[words.length - 1] = applyTone(lastWord, getWordToneIndex(lastWord), isModern);
      return words.join(' ') + ' ';
    }
    return text;
  }

  const lastChar = word.slice(-1).toLowerCase();
  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;

  // 1. Xử lý gõ lặp phím modifier (ww -> w, aa -> a, dd -> d)
  if (method === 'Telex' && word.length >= 2) {
    const lastTwo = word.slice(-2).toLowerCase();
    const restoreMap: Record<string, string> = { 
      'aa': 'a', 'âa': 'a',
      'ee': 'e', 'êe': 'e',
      'oo': 'o', 'ôo': 'o',
      'dd': 'd', 'đd': 'd',
      'ww': 'w', 'ưw': 'w'
    };
    if (restoreMap[lastTwo]) {
      const base = word.slice(0, -2);
      const tone = getWordToneIndex(word);
      return prefix + applyTone(base + restoreMap[lastTwo], tone, isModern);
    }
  }

  // 2. Xử lý phím W (Móc tự động chuẩn Unikey)
  if (method === 'Telex' && lastChar === 'w') {
    let cleanBase = removeTone(word.slice(0, -1));
    let toneIdx = getWordToneIndex(word.slice(0, -1));

    // Trường hợp 'uo' -> 'ươ'
    if (cleanBase.toLowerCase().endsWith('uo')) {
      const isUpper = cleanBase.slice(-2).toUpperCase() === cleanBase.slice(-2);
      cleanBase = cleanBase.slice(0, -2) + (isUpper ? 'ƯƠ' : 'ươ');
      return prefix + applyTone(cleanBase, toneIdx, isModern);
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
      if (found) return prefix + applyTone(cleanBase, toneIdx, isModern);
      
      // Nếu là w đứng độc lập hoặc không có nguyên âm phù hợp -> thành chữ ư
      const isUpper = word.slice(-1) === 'W';
      return prefix + word.slice(0,-1) + (isUpper ? 'Ư' : 'ư');
    }
  }

  // 3. Xử lý các tổ hợp phím modifier (aa, ee, oo, dd, aw)
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
    const baseWordStr = word.slice(0, -1);
    
    // Nếu từ chưa có nguyên âm -> Không xử lý phím dấu (giữ nguyên s, f...)
    if (!hasVowel(baseWordStr)) {
      return text;
    }

    const currentTone = getWordToneIndex(baseWordStr);
    if (currentTone === toneIndexFromKey) {
      // Nhấn phím dấu cũ một lần nữa -> Xóa dấu
      return prefix + applyTone(baseWordStr, 0, isModern);
    }
    return prefix + applyTone(baseWordStr, toneIndexFromKey, isModern);
  }

  // 5. Smart Fix: Tự động chuẩn hóa dấu khi đang gõ
  if (isSmartFix && hasVowel(word)) {
    const currentTone = getWordToneIndex(word);
    return prefix + applyTone(removeTone(word), currentTone, isModern);
  }

  return text;
}
