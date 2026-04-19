/**
 * Nâng cấp bộ gõ tiếng Việt Telex/VNI chuẩn Unikey.
 * Hỗ trợ quy tắc đặt dấu "Kiểu mới" (Modern Style) cho các cụm oa, oe, uy.
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

const TELEX_MODS: Record<string, string> = {
  'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'uw': 'ư', 'w': 'ư', 'dd': 'đ'
};

const VNI_MODS: Record<string, string> = {
  'a6': 'â', 'a8': 'ă', 'e6': 'ê', 'o6': 'ô', 'o7': 'ơ', 'u7': 'ư', 'd9': 'đ'
};

const TONES: Record<string, number> = {
  's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, // Telex
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, // VNI
  '0': 0 // Xóa dấu
};

const VOWELS = 'aeiouyàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵăắằẳẵặâấầẩẫậêếềểễệôốồổỗộơớờởỡợưứừửữự';

// Danh sách từ tiếng Anh thông dụng để Mixed Mode hoạt động tốt hơn
const COMMON_ENGLISH_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'with', 'this', 'that']);

/**
 * Tìm vị trí đặt dấu chuẩn xác theo quy tắc tiếng Việt.
 */
function getTonePosition(word: string, isModern: boolean): number {
  const vowelsInWord: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (VOWELS.includes(word[i].toLowerCase())) {
      vowelsInWord.push(i);
    }
  }

  if (vowelsInWord.length === 0) return -1;
  if (vowelsInWord.length === 1) return vowelsInWord[0];

  const vowelChars = vowelsInWord.map(i => word[i].toLowerCase()).join('');
  
  // Quy tắc cụm nguyên âm kép/ba
  // oa, oe, uy
  if (vowelChars === 'oa' || vowelChars === 'oe' || vowelChars === 'uy') {
    return isModern ? vowelsInWord[1] : vowelsInWord[0];
  }

  // ia, ua, uo
  if (vowelChars === 'ia' || vowelChars === 'ua' || vowelChars === 'uo') {
    return vowelsInWord[0];
  }

  // Nếu có 3 nguyên âm, dấu thường rơi vào âm ở giữa (qu_y_ên, h_u_ân)
  if (vowelsInWord.length === 3) {
    return vowelsInWord[1];
  }

  // Mặc định cho các trường hợp khác: nguyên âm cuối cùng của cụm (trừ phụ âm cuối)
  return vowelsInWord[vowelsInWord.length - 1];
}

export function convertText(text: string, method: InputMethod, isModern: boolean): string {
  if (!text) return '';
  
  const lastSpaceIndex = text.lastIndexOf(' ');
  const prefix = text.substring(0, lastSpaceIndex + 1);
  let word = text.substring(lastSpaceIndex + 1);
  
  if (word.length === 0) return text;

  const lowerWord = word.toLowerCase();
  if (COMMON_ENGLISH_WORDS.has(lowerWord)) return text;

  // 1. Xử lý dấu (Priority 1: Tone markers)
  const lastChar = word.slice(-1).toLowerCase();
  const toneIndex = TONES[lastChar];

  if (toneIndex !== undefined) {
    let baseWord = word.slice(0, -1);
    
    // Khử dấu hiện tại để tìm vị trí mới
    let cleanWord = '';
    for (const char of baseWord) {
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

    const pos = getTonePosition(cleanWord, isModern);
    if (pos !== -1) {
      const charToMap = cleanWord[pos];
      const lowerChar = charToMap.toLowerCase();
      const isUpper = charToMap === charToMap.toUpperCase();
      const newVowel = VOWEL_MAP[lowerChar][toneIndex];
      
      word = cleanWord.substring(0, pos) + 
             (isUpper ? newVowel.toUpperCase() : newVowel) + 
             cleanWord.substring(pos + 1);
    }
  }

  // 2. Xử lý sửa đổi chữ (aa, aw, dd...)
  const mods = method === 'Telex' ? TELEX_MODS : VNI_MODS;
  for (const [key, val] of Object.entries(mods)) {
    // Chỉ thay thế nếu cụm ký tự xuất hiện (ví dụ: dd -> đ)
    const regex = new RegExp(key, 'gi');
    word = word.replace(regex, (match) => {
      // Giữ nguyên Case (Hoa/thường)
      if (match === match.toUpperCase()) return val.toUpperCase();
      return val;
    });
  }

  return prefix + word;
}
