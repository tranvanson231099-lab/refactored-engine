
/**
 * Bộ gõ tiếng Việt VietFlex - Nâng cấp chuẩn Unicode & Quy tắc đặt dấu kiểu mới.
 * Hỗ trợ Telex/VNI với thuật toán xác định vị trí dấu thông minh.
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

const TONES: Record<string, number> = {
  's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, // Telex
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, // VNI
  '0': 0 // Xóa dấu
};

const VOWELS_FLAT = 'aeiouyàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵăắằẳẵặâấầẩẫậêếềểễệôốồổỗộơớờởỡợưứừửữự';

/**
 * Khử dấu tiếng Việt về chữ cái Latin gốc.
 */
function removeTone(word: string): string {
  let result = '';
  for (const char of word) {
    let found = false;
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (variants.includes(char.toLowerCase())) {
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

/**
 * Thuật toán xác định vị trí đặt dấu chuẩn Tiếng Việt (Kiểu mới).
 */
function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeTone(word).toLowerCase();
  const vowelsInWord: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    if ('aeiouy'.includes(clean[i])) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelChars = vowelsInWord.map(i => clean[i]).join('');
  const lastChar = clean[clean.length - 1];
  const hasConsonantAtEnd = !'aeiouy'.includes(lastChar);

  // Trường hợp đặc biệt: qu, gi
  if (clean.startsWith('qu') && vowelsInWord[0] === 1) {
    const subVowels = vowelsInWord.slice(1);
    if (subVowels.length === 1) return subVowels[0];
    // quả, quán...
  }
  if (clean.startsWith('gi') && vowelsInWord[0] === 1) {
    const subVowels = vowelsInWord.slice(1);
    if (subVowels.length >= 1) return subVowels[subVowels.length - 1];
    // già, giá...
  }

  // Cụm 3 nguyên âm: ưuê, uyê, uôi, ươi...
  if (vowelsInWord.length === 3) {
    if (vowelChars === 'uye' || vowelChars === 'uê' || vowelChars === 'uơ') return vowelsInWord[2];
    return vowelsInWord[1];
  }

  // Cụm 2 nguyên âm
  if (vowelsInWord.length === 2) {
    // Kiểu mới (Modern): oa, oe, uy đặt dấu ở âm thứ 2
    if (isModern && (vowelChars === 'oa' || vowelChars === 'oe' || vowelChars === 'uy')) {
      return vowelsInWord[1];
    }
    
    // Nếu có phụ âm cuối: ưu, iê, uô, uơ... đặt dấu ở âm thứ 2
    if (hasConsonantAtEnd) return vowelsInWord[1];

    // Mặc định đặt ở âm thứ nhất: ia, ua, ưu...
    return vowelsInWord[0];
  }

  return vowelsInWord[vowelsInWord.length - 1];
}

export function convertText(text: string, method: InputMethod, isModern: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();
  
  // 1. Xử lý gõ lặp phím (ww -> w, dd -> d, aa -> a)
  if (word.length >= 2) {
    const prevChar = word[word.length - 2].toLowerCase();
    if (lastChar === prevChar && (method === 'Telex' && 'awdeio'.includes(lastChar))) {
        // Trả về ký tự gốc nếu gõ lặp (Unikey style)
        // Ví dụ: dd -> d, ww -> w
        const base = word.slice(0, -2);
        return prefix + base + lastChar;
    }
  }

  // 2. Xử lý bỏ dấu (Tones)
  const toneIndex = TONES[lastChar];
  if (toneIndex !== undefined) {
    const baseWord = word.slice(0, -1);
    const cleanWord = removeTone(baseWord);
    const pos = getTonePosition(cleanWord, isModern);
    
    if (pos !== -1) {
      const charAtPos = cleanWord[pos];
      const isUpper = charAtPos === charAtPos.toUpperCase();
      const mappedVowel = VOWEL_MAP[charAtPos.toLowerCase()][toneIndex];
      word = cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      return prefix + word;
    }
  }

  // 3. Xử lý Telex/VNI Modifiers (Chữ có móc, mũ)
  if (method === 'Telex') {
    if (lastChar === 'w') {
        const base = word.slice(0, -1);
        // uw -> ư
        if (base.toLowerCase().endsWith('u')) {
            const isUpper = base.endsWith('U');
            return prefix + base.slice(0, -1) + (isUpper ? 'Ư' : 'ư');
        }
        // word + w -> ư/ơ/ă (thông minh)
        // Nếu không có u/o, w đơn lẻ là ư
        if (!base.toLowerCase().includes('u') && !base.toLowerCase().includes('o') && !base.toLowerCase().includes('a')) {
            return prefix + base + (word[word.length-1] === 'W' ? 'Ư' : 'ư');
        }
    }

    const telexMap: Record<string, string> = {
      'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư', 'dd': 'đ'
    };

    for (const [key, val] of Object.entries(telexMap)) {
      if (word.toLowerCase().endsWith(key)) {
        const isUpper = word.slice(-1) === word.slice(-1).toUpperCase();
        const base = word.slice(0, -2);
        return prefix + base + (isUpper ? val.toUpperCase() : val);
      }
    }
  } else {
    // VNI Logic
    const vniMap: Record<string, string> = {
      'a6': 'â', 'a8': 'ă', 'e6': 'ê', 'o6': 'ô', 'o7': 'ơ', 'u7': 'ư', 'd9': 'đ'
    };
    for (const [key, val] of Object.entries(vniMap)) {
      if (word.toLowerCase().endsWith(key)) {
        const isUpper = word.slice(-2, -1) === word.slice(-2, -1).toUpperCase();
        const base = word.slice(0, -2);
        return prefix + base + (isUpper ? val.toUpperCase() : val);
      }
    }
  }

  return text;
}
