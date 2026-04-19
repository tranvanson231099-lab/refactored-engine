/**
 * Simple Vietnamese IME implementation for Telex and VNI.
 * This handles character conversion based on the current word being typed.
 */

export type InputMethod = 'Telex' | 'VNI';

const VIET_CHARS: Record<string, string> = {
  // Telex Vowels
  'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư',
  'AA': 'Â', 'AW': 'Ă', 'EE': 'Ê', 'OO': 'Ô', 'OW': 'Ơ', 'UW': 'Ư',
  'dd': 'đ', 'DD': 'Đ',
  
  // VNI Vowels
  'a6': 'â', 'a8': 'ă', 'e6': 'ê', 'o6': 'ô', 'o7': 'ơ', 'u7': 'ư',
  'A6': 'Â', 'A8': 'Ă', 'E6': 'Ê', 'O6': 'Ô', 'O7': 'Ơ', 'U7': 'Ư',
  'd9': 'đ', 'D9': 'Đ',
};

// Tones: [s, f, r, x, j] for Telex and [1, 2, 3, 4, 5] for VNI
const TONES: Record<string, number> = {
  's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5,
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
};

const VOWEL_TABLE: Record<string, string[]> = {
  'a': ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  'â': ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  'ă': ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
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

/**
 * Applies Vietnamese IME conversion to the last part of the text.
 */
export function convertText(text: string, method: InputMethod): string {
  if (!text) return '';
  
  // We only look at the current word (up to last space)
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  const word = text.substring(lastSpaceIndex + 1);
  
  if (word.length === 0) return text;

  let resultWord = word;

  // 1. Handle double-character combinations (e.g., aa -> â, dd -> đ)
  if (method === 'Telex') {
    for (const [key, val] of Object.entries(VIET_CHARS)) {
      if (key.length === 2 && !/[0-9]/.test(key)) {
        resultWord = resultWord.replace(new RegExp(key, 'g'), val);
      }
    }
    // Special case for 'w' alone usually turning into 'ư' or attached to 'o'
    resultWord = resultWord.replace(/uw/g, 'ư').replace(/ow/g, 'ơ').replace(/w/g, 'ư');
  } else {
    // VNI
    for (const [key, val] of Object.entries(VIET_CHARS)) {
      if (/[0-9]/.test(key)) {
        resultWord = resultWord.replace(new RegExp(key, 'g'), val);
      }
    }
  }

  // 2. Handle tones
  // This is a simplified tone engine
  const toneChar = resultWord.slice(-1).toLowerCase();
  const toneIndex = TONES[toneChar];
  
  if (toneIndex !== undefined) {
    // Basic tone placement logic: find the "main" vowel
    // In a real IME this is much more complex (rules for uo, oa, etc)
    const wordBase = resultWord.slice(0, -1);
    let foundVowel = false;
    let newWord = '';
    
    // Reverse search for vowels to find the one to put tone on
    for (let i = wordBase.length - 1; i >= 0; i--) {
      const char = wordBase[i];
      const lowerChar = char.toLowerCase();
      
      if (!foundVowel && VOWEL_TABLE[lowerChar]) {
        const isUpper = char === char.toUpperCase();
        const mappedVowel = VOWEL_TABLE[lowerChar][toneIndex];
        newWord = wordBase.substring(0, i) + (isUpper ? mappedVowel.toUpperCase() : mappedVowel) + wordBase.substring(i + 1);
        foundVowel = true;
        break;
      }
    }
    
    if (foundVowel) {
      resultWord = newWord;
    }
  }

  return prefix + resultWord;
}