
/**
 * VietFlex Engine 2.1.6 - Background Service Worker
 * Xử lý bắt phím hệ thống cho Chrome OS IME
 */

const VOWEL_MAP = {
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

const TONES_TELEX = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, 'z': 0 };

let contextId = 0;
let currentComposition = "";

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown") return false;

  const key = keyData.key;
  
  // Logic xử lý Telex cơ bản cho IME hệ thống
  // Trong bản thực tế, chúng ta sẽ port toàn bộ vietnamese-ime.ts vào đây
  if (/[a-zA-Z]/.test(key) && key.length === 1) {
    // Tạm thời cho phép gõ trực tiếp, 
    // bạn sẽ cần build để có đầy đủ logic trong thư mục out
    return false;
  }

  return false;
});

console.log("VietFlex Engine 2.1.6 Background Ready");
