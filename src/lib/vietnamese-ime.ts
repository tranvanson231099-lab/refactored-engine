
/**
 * VietFlex Engine 2.1.6 - Precision Orthography & Chrome OS Flex Optimized
 * Hỗ trợ các quy tắc gõ nâng cao: hw -> hư, sonw -> sơn, và cơ chế xóa dấu trước.
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

function simplifyVowels(word: string): string {
  let result = '';
  for (const char of word) {
    const lower = char.toLowerCase();
    const simple = BASE_VOWEL_MAP[lower] || lower;
    const isUpper = char === char.toUpperCase();
    result += isUpper ? simple.toUpperCase() : simple;
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
  const clean = removeToneOnly(word);
  const simple = simplifyVowels(clean).toLowerCase();
  const vowelsInWord: number[] = [];
  
  for (let i = 0; i < clean.length; i++) {
    if (isVowel(clean[i])) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  let actualVowels = [...vowelsInWord];
  // Logic xử lý 'qu' và 'gi'
  if (simple.startsWith('qu') && vowelsInWord[0] === 1) {
    actualVowels.shift();
  } else if (simple.startsWith('gi') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
  }

  if (actualVowels.length === 0) return vowelsInWord[vowelsInWord.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  const vStr = actualVowels.map(i => simple[i]).join('');

  // Sửa lỗi 'luyện' - Nucleus is 'yê', tone on 'ê'
  if (vStr === 'uye' || vStr === 'uay' || vStr === 'ieu' || vStr === 'uoi' || vStr === 'uou') {
    return actualVowels[1]; // Middle vowel
  }

  if (actualVowels.length === 2) {
    if (isModern && (vStr === 'oa' || vStr === 'oe' || vStr === 'uy')) {
      return actualVowels[1];
    }
    const lastCharIndex = clean.length - 1;
    if (!isVowel(clean[lastCharIndex])) return actualVowels[1];
    return actualVowels[0];
  }

  return actualVowels[1];
}

function applyTone(word: string, toneIndex: number, isModern: boolean): string {
  const cleanWord = removeToneOnly(word);
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

/**
 * Loại bỏ dấu thanh và dấu phụ (móc) của từ cuối cùng.
 */
export function removeLastMark(text: string): string | null {
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  const word = text.substring(lastSpaceIndex + 1);
  if (!word) return null;

  const currentTone = getWordToneIndex(word);
  let simplified = removeToneOnly(word);
  
  let wordHasHook = false;
  let unhooked = '';
  for (const char of simplified) {
    if (UNHOOK_MAP[char]) {
      unhooked += UNHOOK_MAP[char];
      wordHasHook = true;
    } else {
      unhooked += char;
    }
  }

  // Nếu từ có dấu thanh HOẶC dấu phụ (móc), thực hiện xóa dấu
  if (currentTone !== 0 || wordHasHook) {
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
    if (lastChar === 'w') {
      const baseWord = word.slice(0, -1);
      const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();

      // Case 1: Toggle logic (Xóa móc nếu đã có)
      let wordHasHook = false;
      let newWord = '';
      for (const char of baseWord) {
        if (UNHOOK_MAP[char]) {
          newWord += UNHOOK_MAP[char];
          wordHasHook = true;
        } else {
          newWord += char;
        }
      }
      if (wordHasHook) return prefix + newWord;

      // Case 2: hw -> hư, tw -> tư
      if (baseWord.length > 0 && !isVowel(baseWord.slice(-1))) {
        return prefix + baseWord + (isLastUpper ? 'Ư' : 'ư');
      }

      // Case 3: Standing alone or ww -> w
      if (word.length >= 2) {
        const prevChar = word.slice(-2, -1).toLowerCase();
        if (prevChar === 'w' || prevChar === 'ư') {
          return prefix + removeToneOnly(word.slice(0, -2)) + (isLastUpper ? 'W' : 'w');
        }
      }
      if (word.length === 1) return prefix + (isLastUpper ? 'Ư' : 'ư');

      // Case 4: Smart Hook (sonw -> sơn)
      let currentBase = removeToneOnly(baseWord);
      let currentTone = getWordToneIndex(baseWord);
      let handled = false;
      const lowerBase = currentBase.toLowerCase();

      if (lowerBase.includes('uo')) {
        const index = lowerBase.lastIndexOf('uo');
        const isUUpper = currentBase[index] === currentBase[index].toUpperCase();
        const isOUpper = currentBase[index+1] === currentBase[index+1].toUpperCase();
        currentBase = currentBase.substring(0, index) + (isUUpper ? 'Ư' : 'ư') + (isOUpper ? 'Ơ' : 'ơ') + currentBase.substring(index + 2);
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
      return prefix + baseWord + (isLastUpper ? 'Ư' : 'ư');
    }

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

  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;
  const toneIndexFromKey = tones[lastChar];

  if (toneIndexFromKey !== undefined) {
    const baseWord = word.slice(0, -1);
    if (!hasVowel(baseWord)) return text;
    const currentTone = getWordToneIndex(baseWord);
    // Toggle tone: gõ lại dấu sắc khi đang có dấu sắc thì xóa dấu
    if (currentTone === toneIndexFromKey && toneIndexFromKey !== 0) {
      return prefix + removeToneOnly(baseWord);
    }
    return prefix + applyTone(baseWord, toneIndexFromKey, isModern);
  }

  // Tự động sửa lỗi đặt dấu khi gõ xong từ (Smart Fix)
  if (isSmartFix && hasVowel(word)) {
    const currentTone = getWordToneIndex(word);
    const cleaned = removeToneOnly(word);
    return prefix + applyTone(cleaned, currentTone, isModern);
  }

  return text;
}
