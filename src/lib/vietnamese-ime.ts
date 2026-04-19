
/**
 * VietFlex Engine 2.1.6 - Bộ lõi xử lý tiếng Việt chuyên sâu cho Chrome OS
 * Tuân thủ 100% quy tắc i/y và quy tắc đặt dấu của Bộ GD&ĐT.
 */

export type InputMethod = 'Telex';

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

const UNHOOK_MAP: Record<string, string> = {
  'ư': 'u', 'ứ': 'ú', 'ừ': 'ù', 'ử': 'ủ', 'ữ': 'ũ', 'ự': 'ụ',
  'ơ': 'o', 'ớ': 'ó', 'ờ': 'ò', 'ở': 'ỏ', 'ỡ': 'õ', 'ợ': 'ọ',
  'ă': 'a', 'ắ': 'á', 'ằ': 'à', 'ẳ': 'ả', 'ẵ': 'ã', 'ặ': 'ạ',
  'ê': 'e', 'ế': 'é', 'ề': 'è', 'ể': 'ẻ', 'ễ': 'ẽ', 'ệ': 'ẹ',
  'ô': 'o', 'ố': 'ó', 'ồ': 'ò', 'ổ': 'ỏ', 'ỗ': 'õ', 'ộ': 'ọ',
  'â': 'a', 'ấ': 'á', 'ầ': 'à', 'ẩ': 'ả', 'ẫ': 'ã', 'ậ': 'ạ',
  'đ': 'd', 'Đ': 'D'
};

const TONES_TELEX: Record<string, number> = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, 'z': 0 };

function isVowel(char: string): boolean {
  if (!char) return false;
  const c = char.toLowerCase();
  return 'aeiouyàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ'.includes(c);
}

function removeToneOnly(word: string): string {
  let result = '';
  for (const char of word) {
    let found = false;
    const lowerChar = char.toLowerCase();
    for (const [base, variants] of Object.entries(VOWEL_MAP)) {
      if (variants.includes(lowerChar)) {
        const isUpper = char === char.toUpperCase();
        const baseChar = variants[0];
        result += isUpper ? baseChar.toUpperCase() : baseChar;
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
    for (const [, variants] of Object.entries(VOWEL_MAP)) {
      const idx = variants.indexOf(lower);
      if (idx > 0) return idx;
    }
  }
  return 0;
}

function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeToneOnly(word);
  const lowerClean = clean.toLowerCase();
  const vowelIndices: number[] = [];
  
  for (let i = 0; i < clean.length; i++) {
    if (isVowel(clean[i])) vowelIndices.push(i);
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  let actualVowels = [...vowelIndices];
  
  if (lowerClean.startsWith('qu') && vowelIndices[0] === 1) actualVowels.shift(); 
  else if (lowerClean.startsWith('gi') && vowelIndices[0] === 1 && vowelIndices.length > 1) actualVowels.shift();

  if (actualVowels.length === 0) return vowelIndices[vowelIndices.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  const lowerVowelStr = actualVowels.map(i => lowerClean[i]).join('');
  const lastChar = clean[clean.length - 1].toLowerCase();
  const hasFinalConsonant = !isVowel(lastChar);

  // Nguyên âm ba
  if (lowerVowelStr.includes('uyê')) return actualVowels[lowerVowelStr.indexOf('uyê') + 2];
  if (lowerVowelStr.includes('uôi') || lowerVowelStr.includes('iêu') || lowerVowelStr.includes('ươu')) 
    return actualVowels[1];

  // Nguyên âm đôi
  const diphthongsWithToneOnTwo = ['iê', 'uô', 'ươ'];
  for (const d of diphthongsWithToneOnTwo) {
    if (lowerVowelStr.includes(d)) return actualVowels[lowerVowelStr.indexOf(d) + 1];
  }

  const diphthongsWithToneOnOne = ['ia', 'ua', 'ưa'];
  for (const d of diphthongsWithToneOnOne) {
    if (lowerVowelStr.includes(d)) {
      if (hasFinalConsonant) return actualVowels[lowerVowelStr.indexOf(d) + 1];
      return actualVowels[lowerVowelStr.indexOf(d)];
    }
  }

  if (isModern && (lowerVowelStr === 'oa' || lowerVowelStr === 'oe' || lowerVowelStr === 'uy')) return actualVowels[1];
  if (hasFinalConsonant && actualVowels.length >= 2) return actualVowels[1];
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
      if (base === baseVowel || variants[0] === baseVowel) {
        const mappedVowel = variants[toneIndex];
        return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return cleanWord;
}

export function removeLastMark(text: string): string | null {
  if (!text) return null;
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  const word = text.substring(lastSpaceIndex + 1);
  if (!word) return null;

  const toneIdx = getWordToneIndex(word);
  if (toneIdx !== 0) return prefix + removeToneOnly(word);

  let newWordChars = Array.from(word);
  let changed = false;
  for (let i = newWordChars.length - 1; i >= 0; i--) {
    const char = newWordChars[i];
    const unhooked = UNHOOK_MAP[char.toLowerCase()];
    if (unhooked) {
      const isUpper = char === char.toUpperCase();
      newWordChars[i] = isUpper ? unhooked.toUpperCase() : unhooked;
      changed = true;
      break; 
    }
  }
  if (changed) return prefix + newWordChars.join('');
  return null;
}

function applySmartFix(word: string, isModern: boolean): string {
  let result = word;
  const tone = getWordToneIndex(result);
  const cleaned = removeToneOnly(result);
  const lowerClean = cleaned.toLowerCase();
  
  // Rule: After 'u' must be 'y' (quy, quý)
  if (lowerClean.includes('qu') && lowerClean.endsWith('i')) {
    result = result.replace(/i/g, 'y').replace(/I/g, 'Y');
    return applyTone(removeToneOnly(result), tone, isModern);
  }

  // Rule: After consonant must be 'i' (lí, kĩ)
  const consonants = 'bcdghklmnpqrstvx';
  for (const c of consonants) {
    if (lowerClean.startsWith(c) && lowerClean.endsWith('y') && !lowerClean.includes('uy')) {
      const isUpper = result[result.length - 1] === result[result.length - 1].toUpperCase();
      const newI = isUpper ? VOWEL_MAP['i'][tone].toUpperCase() : VOWEL_MAP['i'][tone];
      result = result.substring(0, result.length - 1) + newI;
      return result;
    }
  }
  return result;
}

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  if (isSmartFix && text.length >= 2) {
    const lastChar = text.slice(-1);
    const prevChar = text.slice(-2, -1);
    if ((lastChar === ',' || lastChar === '.' || lastChar === '?' || lastChar === '!') && prevChar === ' ') {
      return text.slice(0, -2) + lastChar;
    }
  }

  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  if (lastChar === 'w') {
    const baseWord = word.slice(0, -1);
    const lowerBase = removeToneOnly(baseWord).toLowerCase();
    
    if (lowerBase.includes('uo')) {
      const idx = lowerBase.lastIndexOf('uo');
      const currentTone = getWordToneIndex(baseWord);
      let hooked = removeToneOnly(baseWord).substring(0, idx) + 'ươ' + removeToneOnly(baseWord).substring(idx + 2);
      return prefix + applyTone(hooked, currentTone, isModern);
    }

    const hookPriority = ['u', 'o', 'a'];
    for (const charToHook of hookPriority) {
      const idx = lowerBase.lastIndexOf(charToHook);
      if (idx !== -1) {
        const replacement = charToHook === 'u' ? 'ư' : charToHook === 'o' ? 'ơ' : 'ă';
        const currentTone = getWordToneIndex(baseWord);
        const hooked = removeToneOnly(baseWord).substring(0, idx) + replacement + removeToneOnly(baseWord).substring(idx + 1);
        return prefix + applyTone(hooked, currentTone, isModern);
      }
    }
    if (word.length === 1) return prefix + 'ư';
  }

  const modifiers: Record<string, string> = { 'e': 'ê', 'a': 'â', 'o': 'ô', 'd': 'đ' };
  if (modifiers[lastChar] && word.length >= 2) {
    const prevChar = word.slice(-2, -1).toLowerCase();
    if (prevChar === lastChar) {
      const base = removeToneOnly(word.slice(0, -2)) + modifiers[lastChar];
      const tone = getWordToneIndex(word.slice(0, -1));
      return prefix + applyTone(base, tone, isModern);
    }
  }

  const toneIdx = TONES_TELEX[lastChar];
  if (toneIdx !== undefined) {
    const baseWord = word.slice(0, -1);
    const currentTone = getWordToneIndex(baseWord);
    if (currentTone === toneIdx && toneIdx !== 0) return prefix + removeToneOnly(baseWord);
    return prefix + applyTone(baseWord, toneIdx, isModern);
  }

  if (isSmartFix) return prefix + applySmartFix(word, isModern);
  return text;
}
