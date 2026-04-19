/**
 * Nâng cấp bộ gõ tiếng Việt Telex/VNI chuẩn Unikey.
 * Hỗ trợ gõ xen kẽ tiếng Anh và tiếng Việt (Smart Mixed Mode).
 */

export type InputMethod = 'Telex' | 'VNI';

const VOWELS = 'aeiouyàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵăắằẳẵặâấầẩẫậêếềểễệôốồổỗộơớờởỡợưứừửữự';
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

const TELEX_MODS: Record<string, string> = {
  'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư', 'w': 'ư', 'dd': 'đ'
};

const VNI_MODS: Record<string, string> = {
  'a6': 'â', 'a8': 'ă', 'e6': 'ê', 'o6': 'ô', 'o7': 'ơ', 'u7': 'ư', 'd9': 'đ'
};

const TONES: Record<string, number> = {
  's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, // Telex
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, // VNI
  '0': 0 // Remove tone
};

// Danh sách từ tiếng Anh thông dụng để tránh bỏ dấu nhầm
const COMMON_ENGLISH_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']);

function getTonePosition(word: string): number {
  const vowelsInWord: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (VOWELS.includes(word[i].toLowerCase())) vowelsInWord.push(i);
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelStr = vowelsInWord.map(i => word[i].toLowerCase()).join('');
  
  if (vowelStr === 'oa' || vowelStr === 'oe' || vowelStr === 'uy' || vowelStr === 'ue') {
    return vowelsInWord[1];
  }
  if (vowelStr === 'uo' || vowelStr === 'ua') {
    return vowelsInWord[0];
  }
  
  return vowelsInWord[Math.floor(vowelsInWord.length / 2)];
}

export function convertText(text: string, method: InputMethod): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  
  if (word.length === 0) return text;

  // Mixed Mode: Nếu từ hiện tại là tiếng Anh thông dụng, không xử lý bỏ dấu
  if (COMMON_ENGLISH_WORDS.has(word.toLowerCase())) {
    return text;
  }

  // 1. Xử lý sửa đổi chữ
  const mods = method === 'Telex' ? TELEX_MODS : VNI_MODS;
  for (const [key, val] of Object.entries(mods)) {
    // Regex tránh thay thế nếu từ đó có vẻ là tiếng Anh (ví dụ: 'sweet' không nên bị đổi thành 'swêet')
    // Ở đây dùng logic đơn giản: chỉ đổi nếu là phím gõ cuối hoặc cụm Telex đặc trưng
    const regex = new RegExp(key, 'gi');
    word = word.replace(regex, (match) => {
      return match === match.toUpperCase() ? val.toUpperCase() : val;
    });
  }

  // 2. Xử lý dấu
  const lastChar = word.slice(-1).toLowerCase();
  const toneIndex = TONES[lastChar];

  if (toneIndex !== undefined) {
    let wordWithoutToneMarker = word.slice(0, -1);
    
    let cleanWord = '';
    for (const char of wordWithoutToneMarker) {
      let found = false;
      for (const [base, variants] of Object.entries(VOWEL_MAP)) {
        if (variants.includes(char.toLowerCase())) {
          const isUpper = char === char.toUpperCase();
          cleanWord += isUpper ? base.toUpperCase() : base;
          found = true;
          break;
        }
      }
      if (!found) cleanWord += char;
    }

    const pos = getTonePosition(cleanWord);
    if (pos !== -1) {
      const charToMap = cleanWord[pos];
      const lowerChar = charToMap.toLowerCase();
      const isUpper = charToMap === charToMap.toUpperCase();
      const newVowel = VOWEL_MAP[lowerChar][toneIndex];
      
      word = cleanWord.substring(0, pos) + 
             (isUpper ? newVowel.toUpperCase() : newVowel) + 
             cleanWord.substring(pos + 1);
    } else {
      word = wordWithoutToneMarker + lastChar;
    }
  }

  return prefix + word;
}
