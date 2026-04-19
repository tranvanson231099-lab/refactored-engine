/**
 * VietFlex Engine 2.1.6 - Core IME Handler for Chrome OS
 * Xử lý bắt phím hệ thống và chuyển đổi Telex trực tiếp.
 */

const TONES_TELEX = { 's': 1, 'f': 2, 'r': 3, 'x': 4, 'j': 5, 'z': 0 };
const VOWELS = 'aeiouyàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ';

let contextId = 0;

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown' && !keyData.altKey && !keyData.ctrlKey) {
    // Logic xử lý Telex sẽ được tích hợp ở đây để gửi văn bản đã xử lý
    // Hiện tại cho phép gõ bình thường để đảm bảo IME được tải thành công
    return false;
  }
  return false;
});

console.log("VietFlex Engine 2.1.6 Ready");