
/**
 * Bộ gõ tiếng Việt VietFlex Core 1.3 - Tối ưu hóa phím W và quy tắc đặt dấu Modern.
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
  's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5,
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '0': 0
};

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

function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeTone(word).toLowerCase();
  const vowelsInWord: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    if ('aeiouy'.includes(clean[i])) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelChars = vowelsInWord.map(i => clean[i]).join('');
  
  if (clean.startsWith('qu') && vowelsInWord.includes(1)) {
    const subVowels = vowelsInWord.filter(i => i > 1);
    if (subVowels.length === 1) return subVowels[0];
    if (subVowels.length > 1) return subVowels[1];
  }
  if (clean.startsWith('gi') && vowelsInWord.includes(1)) {
    const subVowels = vowelsInWord.filter(i => i > 1);
    if (subVowels.length === 0) return vowelsInWord[1]; 
    return subVowels[0];
  }

  if (vowelsInWord.length === 3) {
    if (vowelChars === 'uye' || vowelChars === 'ieu' || vowelChars === 'uoi') {
      return vowelsInWord[2];
    }
    return vowelsInWord[1];
  }

  if (vowelsInWord.length === 2) {
    if (isModern && (vowelChars === 'oa' || vowelChars === 'oe' || vowelChars === 'uy')) {
      return vowelsInWord[1];
    }
    const lastChar = clean[clean.length - 1];
    const hasConsonantAtEnd = !'aeiouy'.includes(lastChar);
    if (hasConsonantAtEnd) return vowelsInWord[1];
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

  // Xử lý gõ lặp để khôi phục (ww -> w, dd -> d)
  if (word.length >= 2) {
    const prevChar = word[word.length - 2].toLowerCase();
    const isDoubleKey = (
      (prevChar === 'ư' && lastChar === 'w') ||
      (prevChar === 'â' && lastChar === 'a') ||
      (prevChar === 'ê' && lastChar === 'e') ||
      (prevChar === 'ô' && lastChar === 'o') ||
      (prevChar === 'ă' && lastChar === 'a') ||
      (prevChar === 'ơ' && lastChar === 'w') ||
      (prevChar === 'đ' && lastChar === 'd')
    );
    if (isDoubleKey) {
      return prefix + word.slice(0, -2) + lastChar;
    }
  }

  // Xử lý phím W và các Modifier
  if (method === 'Telex') {
    if (lastChar === 'w') {
      const base = word.slice(0, -1);
      const cleanBase = removeTone(base);
      const toneIdx = getWordToneIndex(base);

      if (cleanBase.toLowerCase().includes('uo')) {
        const uPos = cleanBase.toLowerCase().indexOf('u');
        const oPos = cleanBase.toLowerCase().indexOf('o');
        let newWord = cleanBase.substring(0, uPos) + 'ư' + cleanBase.substring(uPos + 1, oPos) + 'ơ' + cleanBase.substring(oPos + 1);
        if (toneIdx > 0) newWord = applyTone(newWord, toneIdx, isModern);
        return prefix + newWord;
      }
      
      if (cleanBase.toLowerCase().includes('o')) {
        const pos = cleanBase.toLowerCase().lastIndexOf('o');
        let newWord = cleanBase.substring(0, pos) + 'ơ' + cleanBase.substring(pos + 1);
        if (toneIdx > 0) newWord = applyTone(newWord, toneIdx, isModern);
        return prefix + newWord;
      }
      
      if (cleanBase.toLowerCase().includes('u')) {
        const pos = cleanBase.toLowerCase().lastIndexOf('u');
        let newWord = cleanBase.substring(0, pos) + 'ư' + cleanBase.substring(pos + 1);
        if (toneIdx > 0) newWord = applyTone(newWord, toneIdx, isModern);
        return prefix + newWord;
      }

      if (cleanBase.toLowerCase().includes('a')) {
        const pos = cleanBase.toLowerCase().lastIndexOf('a');
        let newWord = cleanBase.substring(0, pos) + 'ă' + cleanBase.substring(pos + 1);
        if (toneIdx > 0) newWord = applyTone(newWord, toneIdx, isModern);
        return prefix + newWord;
      }
      return prefix + word.slice(0, -1) + 'ư';
    }

    const telexMap: Record<string, string> = { 'aa': 'â', 'ee': 'ê', 'oo': 'ô', 'dd': 'đ' };
    for (const [key, val] of Object.entries(telexMap)) {
      if (word.toLowerCase().endsWith(key)) {
        return prefix + word.slice(0, -2) + (word.slice(-1) === word.slice(-1).toUpperCase() ? val.toUpperCase() : val);
      }
    }
  }

  const toneIndex = TONES[lastChar];
  if (toneIndex !== undefined) {
    const baseWord = word.slice(0, -1);
    return prefix + applyTone(baseWord, toneIndex, isModern);
  }

  return text;
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

function applyTone(word: string, toneIndex: number, isModern: boolean): string {
  const cleanWord = removeTone(word);
  const pos = getTonePosition(cleanWord, isModern);
  if (pos !== -1) {
    const charAtPos = cleanWord[pos];
    const isUpper = charAtPos === charAtPos.toUpperCase();
    const baseVowel = charAtPos.toLowerCase();
    if (VOWEL_MAP[baseVowel]) {
      const mappedVowel = VOWEL_MAP[baseVowel][toneIndex];
      return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
    }
  }
  return word;
}
