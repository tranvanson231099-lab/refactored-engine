
/**
 * VietFlex Engine 2.1.6 - Precision Orthography & Chrome OS Flex Optimized
 * Tuân thủ quy tắc đặt dấu của Bộ Giáo dục & Đào tạo và Nghị định 30.
 * Cơ chế Smart Backspace 3 bước: Xóa dấu thanh -> Xóa dấu phụ -> Xóa chữ.
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

/**
 * Thuật toán xác định vị trí đặt dấu chuẩn 2.1.6
 * Tuân thủ tuyệt đối quy tắc: Có âm cuối đặt dấu ở âm thứ 2 của nguyên âm đôi.
 */
function getTonePosition(word: string, isModern: boolean): number {
  const clean = removeToneOnly(word);
  const lowerClean = clean.toLowerCase();
  const vowelIndices: number[] = [];
  
  for (let i = 0; i < clean.length; i++) {
    if (isVowel(clean[i])) vowelIndices.push(i);
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // Logic ngoại lệ cho 'qu' và 'gi'
  let actualVowels = [...vowelIndices];
  if (lowerClean.startsWith('qu') && vowelIndices[0] === 1) {
    actualVowels.shift(); 
  } else if (lowerClean.startsWith('gi') && vowelIndices[0] === 1 && vowelIndices.length > 1) {
    actualVowels.shift();
  }

  if (actualVowels.length === 0) return vowelIndices[vowelIndices.length - 1];
  if (actualVowels.length === 1) return actualVowels[0];

  const vowelString = actualVowels.map(i => lowerClean[i]).join('');
  const hasFinalConsonant = !isVowel(clean[clean.length - 1]);

  // Ưu tiên các cụm tam âm
  if (vowelString.includes('uyê')) return actualVowels[vowelString.indexOf('uyê') + 2];
  if (vowelString.includes('iêu')) return actualVowels[vowelString.indexOf('iêu') + 1];
  if (vowelString.includes('uôi')) return actualVowels[vowelString.indexOf('uôi') + 1];
  if (vowelString.includes('ươu')) return actualVowels[vowelString.indexOf('ươu') + 1];

  // Quy tắc vần oa, oe, uy (Kiểu mới)
  if (isModern && (vowelString === 'oa' || vowelString === 'oe' || vowelString === 'uy')) {
    if (!hasFinalConsonant) return actualVowels[1];
  }

  // Quy tắc nguyên âm đôi (ia, iê, ua, uô, ưa, ươ)
  const diphthongs = ['ia', 'ie', 'ua', 'uo', 'ươ', 'ưa'];
  for (const d of diphthongs) {
    const idxInString = vowelString.indexOf(d);
    if (idxInString !== -1) {
      if (hasFinalConsonant) return actualVowels[idxInString + 1];
      return actualVowels[idxInString];
    }
  }

  // Mặc định: Có âm cuối đặt ở âm thứ 2
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
      if (base === baseVowel || (base === 'ă' && variants[0] === baseVowel) || (base === 'â' && variants[0] === baseVowel)) {
          const mappedVowel = variants[toneIndex];
          return cleanWord.substring(0, pos) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + cleanWord.substring(pos + 1);
      }
    }
  }
  return cleanWord;
}

/**
 * Smart Backspace 3 bước: 
 * Bước 1: Xóa dấu thanh
 * Bước 2: Xóa dấu phụ/móc
 * Bước 3: Xóa ký tự
 */
export function removeLastMark(text: string): string | null {
  if (!text) return null;
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  const word = text.substring(lastSpaceIndex + 1);
  if (!word) return null;

  const toneIdx = getWordToneIndex(word);
  if (toneIdx !== 0) {
    return prefix + removeToneOnly(word);
  }

  let newWord = '';
  let changed = false;
  for (let i = word.length - 1; i >= 0; i--) {
    const char = word[i];
    const unhooked = UNHOOK_MAP[char.toLowerCase()];
    if (unhooked && !changed) {
      const isUpper = char === char.toUpperCase();
      newWord = (isUpper ? unhooked.toUpperCase() : unhooked) + newWord;
      changed = true;
    } else {
      newWord = char + newWord;
    }
  }

  if (changed) return prefix + newWord;
  return null;
}

function applySmartFix(word: string, isModern: boolean): string {
  let result = word;
  const lowerWord = result.toLowerCase();
  const consonantsAfterI = ['l', 'k', 'm', 's', 't', 'h', 'd', 'n'];
  
  for (const c of consonantsAfterI) {
    if (lowerWord.startsWith(c) && lowerWord.endsWith('y')) {
      const tone = getWordToneIndex(result);
      const base = result.substring(0, result.length - 1);
      const isUpper = result[result.length - 1] === result[result.length - 1].toUpperCase();
      result = base + (isUpper ? VOWEL_MAP['i'][tone].toUpperCase() : VOWEL_MAP['i'][tone]);
    }
  }
  return result;
}

export function convertText(text: string, method: InputMethod, isModern: boolean, isSmartFix: boolean): string {
  if (!text) return '';
  
  if (isSmartFix && text.length >= 2) {
    const lastChar = text.slice(-1);
    const prevChar = text.slice(-2, -1);
    if ((lastChar === ',' || lastChar === '.') && prevChar === ' ') {
      return text.slice(0, -2) + lastChar;
    }
  }

  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  if (!word) return text;

  const lastChar = word.slice(-1).toLowerCase();

  if (method === 'Telex') {
    if (lastChar === 'w') {
      const baseWord = word.slice(0, -1);
      const isLastUpper = word.slice(-1) === word.slice(-1).toUpperCase();
      let currentBase = removeToneOnly(baseWord);
      let currentTone = getWordToneIndex(baseWord);
      const lowerBase = currentBase.toLowerCase();

      // Hủy móc nếu gõ lặp w
      if (baseWord.toLowerCase().endsWith('ư') || baseWord.toLowerCase().endsWith('ơ') || baseWord.toLowerCase().endsWith('ă')) {
        return prefix + removeLastMark(baseWord) + (isLastUpper ? 'W' : 'w');
      }

      if (lowerBase.includes('uo')) {
        const idx = lowerBase.lastIndexOf('uo');
        const isUUpper = currentBase[idx] === currentBase[idx].toUpperCase();
        const isOUpper = currentBase[idx+1] === currentBase[idx+1].toUpperCase();
        currentBase = currentBase.substring(0, idx) + (isUUpper ? 'Ư' : 'ư') + (isOUpper ? 'Ơ' : 'ơ') + currentBase.substring(idx + 2);
        return prefix + applyTone(currentBase, currentTone, isModern);
      }

      const priority = ['u', 'o', 'a'];
      for (const charToHook of priority) {
        const idx = lowerBase.lastIndexOf(charToHook);
        if (idx !== -1) {
          const replacement = charToHook === 'u' ? 'ư' : charToHook === 'o' ? 'ơ' : 'ă';
          const isUpper = currentBase[idx] === currentBase[idx].toUpperCase();
          currentBase = currentBase.substring(0, idx) + (isUpper ? replacement.toUpperCase() : replacement) + currentBase.substring(idx + 1);
          return prefix + applyTone(currentBase, currentTone, isModern);
        }
      }

      if (word.length === 1 || !isVowel(baseWord.slice(-1))) {
        return prefix + baseWord + (isLastUpper ? 'Ư' : 'ư');
      }
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
  const toneIdx = tones[lastChar];

  if (toneIdx !== undefined) {
    const baseWord = word.slice(0, -1);
    if (!hasVowel(baseWord)) return text;
    const currentTone = getWordToneIndex(baseWord);
    if (currentTone === toneIdx && toneIdx !== 0) return prefix + removeToneOnly(baseWord);
    return prefix + applyTone(baseWord, toneIdx, isModern);
  }

  if (isSmartFix && hasVowel(word)) {
    const tone = getWordToneIndex(word);
    const cleaned = removeToneOnly(word);
    const toned = applyTone(cleaned, tone, isModern);
    return prefix + applySmartFix(toned, isModern);
  }

  return text;
}
