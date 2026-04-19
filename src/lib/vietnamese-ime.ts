
/**
 * VietFlex Engine 2.1.2 - Ultra-Fast Local Smart Processor
 * Tối ưu hóa cho Chrome OS Flex: Xử lý triệt để phím lặp và chuẩn hóa Unicode.
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
    if (isModern && (vowelStr === 'oa' || vowelStr === 'oe' || vowelStr === 'uy')) {
      return actualVowels[1];
    }
    const lastChar = clean[clean.length - 1];
    if (isVowel(lastChar)) return actualVowels[0];
    return actualVowels[1];
  }

  if (actualVowels.length === 3) {
    const vowelStr = actualVowels.map(i => clean[i]).join('');
    if (vowelStr === 'uye' || vowelStr === 'uay' || vowelStr === 'ieu' || vowelStr === 'uoi') {
      return actualVowels[2];
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
    
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (base === baseVowel) {
        const mappedVowel = variants[toneIndex];
        return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return cleanWord;
}

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  // 1. Xử lý Telex
  if (method === 'Telex') {
    // 1a. Phím W (Móc hoặc chữ Ư)
    if (lastChar === 'w') {
      // Thoát dấu: ww -> w, ưw -> w
      if (word.length >= 2) {
        const prevChar = word.slice(-2, -1).toLowerCase();
        if (prevChar === 'w' || prevChar === 'ư') {
          return prefix + removeTone(word.slice(0, -2)) + 'w';
        }
      }

      // Nếu gõ w đơn lẻ -> ư
      if (word.length === 1) return prefix + (word === 'w' ? 'ư' : 'Ư');

      // Hook thông minh: sonw -> sơn
      let cleanBase = removeTone(word.slice(0, -1));
      let toneIdx = getWordToneIndex(word.slice(0, -1));
      let found = false;

      // Ưu tiên cụm uo -> ươ (sonw -> sơn)
      if (cleanBase.toLowerCase().endsWith('uo')) {
        const isUpper = cleanBase.slice(-2).toUpperCase() === cleanBase.slice(-2);
        cleanBase = cleanBase.slice(0, -2) + (isUpper ? 'ƯƠ' : 'ươ');
        found = true;
      } else {
        // Tìm nguyên âm o, u, a gần cuối nhất để thêm móc
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
      }

      if (found) return prefix + applyTone(cleanBase, toneIdx, isModern);
      return prefix + word.slice(0, -1) + (word.slice(-1) === 'W' ? 'Ư' : 'ư');
    }

    // 1b. Modifier (ee, aa, oo, dd)
    const telexModifiers: Record<string, string> = { 'e': 'ê', 'a': 'â', 'o': 'ô', 'd': 'đ' };
    if (telexModifiers[lastChar] && word.length >= 2) {
      const prevChar = word.slice(-2, -1).toLowerCase();
      const target = telexModifiers[lastChar];

      // Nếu gõ lặp phím modifier (e + e -> ê)
      if (prevChar === lastChar) {
        const base = removeTone(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        const isUpper = word.slice(-1) === word.slice(-1).toUpperCase();
        return prefix + applyTone(base + (isUpper ? target.toUpperCase() : target), tone, isModern);
      }

      // Nếu gõ modifier vào chữ đã có dấu (ê + e -> e)
      if (prevChar === target) {
        const base = removeTone(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        return prefix + applyTone(base + lastChar, tone, isModern);
      }
    }

    // 1c. Modifier aw -> ă
    if (lastChar === 'w' && word.toLowerCase().endsWith('aw')) {
      // Đã xử lý ở phần Hook W bên trên
    }
  }

  // 2. Phím dấu & Đảo dấu (Toggle Tone) cho cả Telex và VNI
  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;
  const toneIndexFromKey = tones[lastChar];

  if (toneIndexFromKey !== undefined) {
    const baseWordStr = word.slice(0, -1);
    if (!hasVowel(baseWordStr)) return text;

    const currentTone = getWordToneIndex(baseWordStr);
    
    // Toggle Tone: gõ phím dấu khi từ đã có đúng dấu đó -> Xóa dấu (lyss -> lys)
    if (currentTone === toneIndexFromKey && toneIndexFromKey !== 0) {
      return prefix + removeTone(baseWordStr);
    }
    
    // Gõ dấu khác hoặc thêm dấu mới
    return prefix + applyTone(baseWordStr, toneIndexFromKey, isModern);
  }

  // 3. Smart Fix: Luôn chuẩn hóa vị trí dấu khi gõ
  if (isSmartFix && hasVowel(word)) {
    const currentTone = getWordToneIndex(word);
    const cleaned = removeTone(word);
    return prefix + applyTone(cleaned, currentTone, isModern);
  }

  return text;
}

