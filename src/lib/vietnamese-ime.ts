/**
 * VietFlex Engine 2.1.6 - Precision Orthography & Chrome OS Flex Optimized
 * Tuân thủ tuyệt đối các quy tắc i/y và quy tắc đặt dấu của Bộ GD&ĐT.
 * Cơ chế Smart Backspace 3 bước: Xóa dấu thanh -> Xóa dấu phụ -> Xóa chữ.
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
  
  // Ngoại lệ 'qu' và 'gi' - u và i là âm đệm
  if (lowerClean.startsWith('qu') && vowelIndices[0] === 1) {
    actualVowels.shift(); 
  } else if (lowerClean.startsWith('gi') && vowelIndices[0] === 1 && vowelIndices.length > 1) {
    actualVowels.shift();
  }

  if (actualVowels.length === 0) return vowelIndices[vowelIndices.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  const vowelString = actualVowels.map(i => lowerClean[i]).join('');
  const lastChar = clean[clean.length - 1].toLowerCase();
  const hasFinalConsonant = !isVowel(lastChar);

  // Quy tắc tam âm (uyê, uôi, iêu, ươu)
  if (vowelString.includes('uyê')) return actualVowels[vowelString.indexOf('uyê') + 2];
  if (vowelString.includes('uôi')) return actualVowels[vowelString.indexOf('uôi') + 1];
  if (vowelString.includes('iêu')) return actualVowels[vowelString.indexOf('iêu') + 1];
  if (vowelString.includes('ươu')) return actualVowels[vowelString.indexOf('ươu') + 1];

  // Quy tắc nguyên âm đôi (ia, iê, ua, uô, ưa, ươ)
  const diphthongsWithFinal = ['iê', 'uô', 'ươ'];
  for (const d of diphthongsWithFinal) {
    if (vowelString.includes(d)) {
      const startIdx = vowelString.indexOf(d);
      return hasFinalConsonant ? actualVowels[startIdx + 1] : actualVowels[startIdx];
    }
  }
  
  const diphthongsNoFinal = ['ia', 'ua', 'ưa'];
  for (const d of diphthongsNoFinal) {
    if (vowelString.includes(d)) {
      const startIdx = vowelString.indexOf(d);
      return actualVowels[startIdx]; // Luôn là âm 1 vì ia, ua, ưa không có phụ âm cuối tiếng Việt chuẩn
    }
  }

  // Quy tắc kiểu mới cho oa, oe, uy
  if (isModern && (vowelString === 'oa' || vowelString === 'oe' || vowelString === 'uy')) {
    return actualVowels[1];
  }
  
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

  // Bước 1: Xóa dấu thanh
  const toneIdx = getWordToneIndex(word);
  if (toneIdx !== 0) {
    return prefix + removeToneOnly(word);
  }

  // Bước 2: Xóa dấu phụ/móc
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
  
  // 1. Đứng một mình: i (ầm ĩ) hoặc y (y tế, ý nghĩa)
  // Trong Hán Việt: y tế, y phục, ý nghĩa, y đức, y học
  if (lowerClean === 'i' || lowerClean === 'y') {
    // Thường đứng một mình là Y trong từ Hán Việt
    if (lowerClean === 'i' && (tone === 0 || tone === 1)) {
        return result.replace(/i/g, 'y').replace(/I/g, 'Y');
    }
  }

  // 2. Đứng đầu từ: y nếu là nguyên âm đơn hoặc đầu âm đôi (yêu, yến, yên)
  if (lowerClean.startsWith('ie') && !'bcdghklmnpqrstvx'.includes(lowerClean[0])) {
     // Không có phụ âm đầu -> dùng Yê
     const final = cleaned.substring(2);
     const newBase = (result[0] === result[0].toUpperCase() ? 'Y' : 'y') + (result[1] === result[1].toUpperCase() ? 'Ê' : 'ê') + final;
     return applyTone(newBase, tone, isModern);
  }

  // 4. Sau âm đệm "u": Bắt buộc viết y (quý, quy, thủy)
  if (lowerClean.includes('ui') && (lowerClean.startsWith('q') || lowerClean.startsWith('th') || lowerClean.startsWith('h') || lowerClean.startsWith('l'))) {
      if (lowerClean.includes('qui') || lowerClean.includes('thui') || lowerClean.includes('hui') || lowerClean.includes('lui')) {
          result = result.replace(/i/g, 'y').replace(/I/g, 'Y');
          return applyTone(removeToneOnly(result), tone, isModern);
      }
  }

  // 3. Sau phụ âm đầu: Ưu tiên viết i (lí, kĩ, mĩ, sĩ, vị, di)
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
  
  // Dấu câu sát chữ
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

  // Telex Logic
  if (lastChar === 'w') {
    const baseWord = word.slice(0, -1);
    const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();
    let currentBase = removeToneOnly(baseWord);
    let currentTone = getWordToneIndex(baseWord);
    const lowerBase = currentBase.toLowerCase();

    // Hook 'uo' -> 'ươ'
    if (lowerBase.includes('uo')) {
      const idx = lowerBase.lastIndexOf('uo');
      const isUUpper = currentBase[idx] === currentBase[idx].toUpperCase();
      const isOUpper = currentBase[idx+1] === currentBase[idx+1].toUpperCase();
      currentBase = currentBase.substring(0, idx) + (isUUpper ? 'Ư' : 'ư') + (isOUpper ? 'Ơ' : 'ơ') + currentBase.substring(idx + 2);
      return prefix + applyTone(currentBase, currentTone, isModern);
    }

    // Hook 'o' -> 'ơ' (sơn)
    if (lowerBase.includes('on')) {
      const idx = lowerBase.lastIndexOf('o');
      const isUpper = currentBase[idx] === currentBase[idx].toUpperCase();
      currentBase = currentBase.substring(0, idx) + (isUpper ? 'Ơ' : 'ơ') + currentBase.substring(idx + 1);
      return prefix + applyTone(currentBase, currentTone, isModern);
    }

    const priority = ['u', 'o', 'a'];
    let hooked = false;
    for (const charToHook of priority) {
      const idx = lowerBase.lastIndexOf(charToHook);
      if (idx !== -1) {
        const replacement = charToHook === 'u' ? 'ư' : charToHook === 'o' ? 'ơ' : 'ă';
        const isUpper = currentBase[idx] === currentBase[idx].toUpperCase();
        currentBase = currentBase.substring(0, idx) + (isUpper ? replacement.toUpperCase() : replacement) + currentBase.substring(idx + 1);
        hooked = true;
        break;
      }
    }
    
    if (hooked) return prefix + applyTone(currentBase, currentTone, isModern);
    if (word.length === 1 || !isVowel(baseWord.slice(-1))) {
      return prefix + baseWord + (isLastUpper ? 'Ư' : 'ư');
    }
  }

  const modifiers: Record<string, string> = { 'e': 'ê', 'a': 'â', 'o': 'ô', 'd': 'đ' };
  if (modifiers[lastChar] && word.length >= 2) {
    const prevChar = word.slice(-2, -1).toLowerCase();
    const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();
    if (prevChar === lastChar) {
      const base = removeToneOnly(word.slice(0, -2));
      const tone = getWordToneIndex(word.slice(0, -1));
      return prefix + applyTone(base + (isLastUpper ? modifiers[lastChar].toUpperCase() : modifiers[lastChar]), tone, isModern);
    }
  }

  const toneIdx = TONES_TELEX[lastChar];
  if (toneIdx !== undefined) {
    const baseWord = word.slice(0, -1);
    if (!hasVowel(baseWord)) return text;
    const currentTone = getWordToneIndex(baseWord);
    if (currentTone === toneIdx && toneIdx !== 0) return prefix + removeToneOnly(baseWord);
    return prefix + applyTone(baseWord, toneIdx, isModern);
  }

  if (hasVowel(word)) {
    const tone = getWordToneIndex(word);
    const cleaned = removeToneOnly(word);
    const toned = applyTone(cleaned, tone, isModern);
    if (isSmartFix) {
      return prefix + applySmartFix(toned, isModern);
    }
    return prefix + toned;
  }

  return text;
}
