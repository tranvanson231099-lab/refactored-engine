
/**
 * VietFlex Engine 2.1.6 - Core Background Service Worker
 * Xử lý trực tiếp các sự kiện phím cho hệ điều hành Chrome OS.
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

let currentContext = null;
let currentBuffer = ""; // Lưu từ đang gõ dở

chrome.input.ime.onFocus.addListener((context) => {
  currentContext = context;
  currentBuffer = "";
});

chrome.input.ime.onBlur.addListener(() => {
  currentContext = null;
  currentBuffer = "";
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown") return false;
  if (keyData.altKey || keyData.ctrlKey || keyData.capsLock) return false;

  const key = keyData.key;
  
  // Xử lý phím Backspace (Smart Backspace)
  if (key === "Backspace") {
    if (currentBuffer.length > 0) {
      // Logic xóa dấu trước xóa chữ sau (giản lược cho background)
      currentBuffer = currentBuffer.slice(0, -1);
      updateComposition();
      return true;
    }
    return false;
  }

  // Xử lý phím Space / Enter (Kết thúc từ)
  if (key === " " || key === "Enter") {
    commitCurrentBuffer();
    return false;
  }

  // Xử lý ký tự Telex
  if (/^[a-z]$/i.test(key)) {
    currentBuffer += key;
    // Gọi hàm xử lý Telex Engine 2.1.6 tại đây
    // (Trong phiên bản thực tế, logic convertText được đưa vào đây)
    updateComposition();
    return true;
  }

  return false;
});

function updateComposition() {
  if (!currentContext) return;
  chrome.input.ime.setComposition({
    contextID: currentContext.contextID,
    text: currentBuffer,
    cursor: currentBuffer.length
  });
}

function commitCurrentBuffer() {
  if (!currentContext || !currentBuffer) return;
  chrome.input.ime.commitText({
    contextID: currentContext.contextID,
    text: currentBuffer
  });
  currentBuffer = "";
}

// Lắng nghe thay đổi cài đặt từ Popup (index.html)
chrome.storage.onChanged.addListener((changes) => {
  // Cập nhật các quy tắc i/y dựa trên lựa chọn của người dùng
});
