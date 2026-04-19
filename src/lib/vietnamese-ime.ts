
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
    if ('aeiouy'.includes(clean[i])) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelChars = vowelsInWord.map(i => clean[i]).join('');
  
  // Xử lý âm đệm 'qu' và 'gi'
  let actualVowels = [...vowelsInWord];
  let actualVowelChars = vowelChars;

  if (clean.startsWith('qu') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
    actualVowelChars = actualVowelChars.slice(1);
  } else if (clean.startsWith('gi') && vowelsInWord[0] === 1 && vowelsInWord.length > 1) {
    actualVowels.shift();
    actualVowelChars = actualVowelChars.slice(1);
  }

  if (actualVowels.length === 0) return vowelsInWord[vowelsInWord.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  // 2 nguyên âm
  if (actualVowels.length === 2) {
    if (isModern && (actualVowelChars === 'oa' || actualVowelChars === 'oe' || actualVowelChars === 'uy')) {
      return actualVowels[1];
    }
    // Nếu có phụ âm cuối, dấu đặt vào âm thứ 2
    const lastChar = clean[clean.length - 1];
    if (!'aeiouy'.includes(lastChar)) return actualVowels[1];
    return actualVowels[0];
  }

  // 3 nguyên âm
  if (actualVowels.length === 3) {
    if (actualVowelChars === 'uye') return actualVowels[2]; // l-u-y-ê-n -> ê
    return actualVowels[1]; // iê-u, uô-i, uâ-y -> giữa
  }

  return actualVowels[actualVowels.length - 1];
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

function normalizeWord(word: string, isModern: boolean): string {
  const toneIdx = getWordToneIndex(word);
  const clean = removeTone(word);
  return applyTone(clean, toneIdx, isModern);
}

export function convertText(text: string, method: InputMethod, isModern: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  // 1. Xử lý gõ lặp để khôi phục (Telex)
  if (method === 'Telex' && word.length >= 2) {
    const wordNoTone = removeTone(word);
    const lastTwo = wordNoTone.slice(-2).toLowerCase();
    const restoreMap: Record<string, string> = {
      'âa': 'a', 'êe': 'e', 'ôo': 'o', 'đd': 'd', 'ưw': 'w', 'ăa': 'a', 'ơw': 'w'
    };
    if (restoreMap[lastTwo]) {
      const base = wordNoTone.slice(0, -2);
      const tone = getWordToneIndex(word);
      return prefix + applyTone(base + restoreMap[lastTwo], tone, isModern);
    }
  }

  // 2. Xử lý phím W (Telex)
  if (method === 'Telex' && lastChar === 'w') {
    let base = word.slice(0, -1);
    let toneIdx = getWordToneIndex(base);
    let cleanBase = removeTone(base);

    if (cleanBase.toLowerCase().includes('uo')) {
      cleanBase = cleanBase.replace(/uo/i, (m) => m[0] === 'u' ? 'ươ' : 'ƯƠ');
    } else {
      const lastVowelPos = Math.max(
        cleanBase.toLowerCase().lastIndexOf('u'),
        cleanBase.toLowerCase().lastIndexOf('o'),
        cleanBase.toLowerCase().lastIndexOf('a')
      );
      if (lastVowelPos !== -1) {
        const v = cleanBase[lastVowelPos].toLowerCase();
        const replacement = v === 'u' ? 'ư' : v === 'o' ? 'ơ' : 'ă';
        cleanBase = cleanBase.substring(0, lastVowelPos) + 
                    (cleanBase[lastVowelPos] === cleanBase[lastVowelPos].toUpperCase() ? replacement.toUpperCase() : replacement) +
                    cleanBase.substring(lastVowelPos + 1);
      } else {
        cleanBase += 'ư';
      }
    }
    return prefix + applyTone(cleanBase, toneIdx, isModern);
  }

  // 3. Xử lý tổ hợp phím Telex (aa, ee, oo, dd)
  if (method === 'Telex' && word.length >= 2) {
    const telexMap: Record<string, string> = { 'aa': 'â', 'ee': 'ê', 'oo': 'ô', 'dd': 'đ' };
    const lastTwo = word.slice(-2).toLowerCase();
    if (telexMap[lastTwo]) {
      const base = word.slice(0, -2);
      const tone = getWordToneIndex(base);
      const newChar = (word.slice(-1) === word.slice(-1).toUpperCase() ? telexMap[lastTwo].toUpperCase() : telexMap[lastTwo]);
      return prefix + applyTone(removeTone(base) + newChar, tone, isModern);
    }
  }

  // 4. Xử lý phím dấu
  const toneIndex = TONES[lastChar];
  if (toneIndex !== undefined) {
    const baseWord = word.slice(0, -1);
    return prefix + applyTone(baseWord, toneIndex, isModern);
  }

  // 5. Luôn chuẩn hóa vị trí dấu mỗi khi có thay đổi
  return prefix + normalizeWord(word, isModern);
}
