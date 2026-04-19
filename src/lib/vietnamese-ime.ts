
/**
 * VietFlex Engine 2.1.5 - Precision Orthography & Unicode NFC
 * Tối ưu hóa cơ chế Toggle (đảo dấu) và xử lý phím 'w' chuyên biệt cho Chrome OS Flex.
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

const HOOK_MAP: Record<string, string> = {
  'ư': 'u', 'ơ': 'o', 'ă': 'a',
  'Ư': 'U', 'Ơ': 'O', 'Ă': 'A'
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
  if (simple.startsWith('qu') && vowelsInWord[0] === 1) {
    actualVowels.shift();
  } else if (simple.startsWith('gi') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
  }

  if (actualVowels.length === 0) return vowelsInWord[vowelsInWord.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  if (actualVowels.length === 2) {
    const vStr = actualVowels.map(i => simple[i]).join('');
    if (isModern && (vStr === 'oa' || vStr === 'oe' || vStr === 'uy')) {
      return actualVowels[1];
    }
    const lastChar = simple[simple.length - 1];
    if (!isVowel(lastChar)) return actualVowels[1];
    return actualVowels[0];
  }

  if (actualVowels.length === 3) {
    const vStr = actualVowels.map(i => simple[i]).join('');
    if (vStr === 'uye' || vStr === 'uay' || vStr === 'ieu' || vStr === 'uoi' || vStr === 'uou') {
      return actualVowels[2];
    }
    return actualVowels[1];
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

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  if (method === 'Telex') {
    if (lastChar === 'w') {
      // Toggle logic for 'w'
      let wordHasHook = false;
      let newWord = '';
      for (const char of word.slice(0, -1)) {
        if (HOOK_MAP[char]) {
          newWord += HOOK_MAP[char];
          wordHasHook = true;
        } else {
          newWord += char;
        }
      }

      if (wordHasHook) {
        return prefix + newWord;
      }

      // Standalone 'w' or 'ww'
      if (word.length >= 2) {
        const prevChar = word.slice(-2, -1).toLowerCase();
        if (prevChar === 'w' || prevChar === 'ư') {
          return prefix + removeToneOnly(word.slice(0, -2)) + 'w';
        }
      }

      if (word.length === 1) return prefix + (word === 'w' ? 'ư' : 'Ư');

      // Hook logic
      let currentBase = removeToneOnly(word.slice(0, -1));
      let currentTone = getWordToneIndex(word.slice(0, -1));
      let handled = false;

      if (currentBase.toLowerCase().endsWith('uo')) {
        const isUpper = currentBase.slice(-2).toUpperCase() === currentBase.slice(-2);
        currentBase = currentBase.slice(0, -2) + (isUpper ? 'ƯƠ' : 'ươ');
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
      return prefix + word.slice(0, -1) + (word.slice(-1) === 'W' ? 'Ư' : 'ư');
    }

    const modifiers: Record<string, string> = { 'e': 'ê', 'a': 'â', 'o': 'ô', 'd': 'đ' };
    if (modifiers[lastChar] && word.length >= 2) {
      const prevChar = word.slice(-2, -1).toLowerCase();
      const target = modifiers[lastChar];

      if (prevChar === lastChar) {
        const base = removeToneOnly(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        const isUpper = word.slice(-1) === word.slice(-1).toUpperCase();
        return prefix + applyTone(base + (isUpper ? target.toUpperCase() : target), tone, isModern);
      }
      
      if (prevChar === target) {
        const base = removeToneOnly(word.slice(0, -2));
        const tone = getWordToneIndex(word.slice(0, -1));
        return prefix + applyTone(base + lastChar, tone, isModern);
      }
    }
  }

  const tones = method === 'Telex' ? TONES_TELEX : TONES_VNI;
  const toneIndexFromKey = tones[lastChar];

  if (toneIndexFromKey !== undefined) {
    const baseWord = word.slice(0, -1);
    if (!hasVowel(baseWord)) return text;

    const currentTone = getWordToneIndex(baseWord);
    if (currentTone === toneIndexFromKey && toneIndexFromKey !== 0) {
      return prefix + removeToneOnly(baseWord);
    }
    
    return prefix + applyTone(baseWord, toneIndexFromKey, isModern);
  }

  if (isSmartFix && hasVowel(word)) {
    const currentTone = getWordToneIndex(word);
    const cleaned = removeToneOnly(word);
    return prefix + applyTone(cleaned, currentTone, isModern);
  }

  return text;
}
