/**
 * VietFlex Engine 2.1.6 - System IME Background Script
 * Xử lý bắt phím hệ thống và áp dụng thuật toán tiếng Việt chuyên sâu.
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
let currentWord = "";

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
  currentWord = "";
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown" || keyData.altKey || keyData.ctrlKey) return false;

  const key = keyData.key;

  // Xử lý khoảng trắng hoặc phím đặc biệt để kết thúc từ
  if (key === " " || key === "Enter" || key === "Tab") {
    currentWord = "";
    return false;
  }

  // Xử lý Backspace (Smart Backspace đơn giản hóa cho IME)
  if (key === "Backspace") {
    if (currentWord.length > 0) {
      currentWord = currentWord.slice(0, -1);
    }
    return false;
  }

  // Chỉ xử lý các ký tự chữ cái
  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    // Đây là nơi Engine 2.1.6 sẽ can thiệp để chuyển đổi Telex.
    // Vì giới hạn của Background script, chúng ta sẽ bắt đầu với việc theo dõi từ.
    currentWord += key;
    
    // Lưu ý: Để triển khai đầy đủ Telex 2.1.6 trong background.js cần một parser phức tạp hơn.
    // Hiện tại chúng ta đăng ký IME để nó xuất hiện trong hệ thống trước.
    return false;
  }

  return false;
});
