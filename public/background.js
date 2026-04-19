/**
 * VietFlex Engine 2.1.6 - System IME Service Worker
 * Xử lý bắt phím hệ thống cho Chrome OS Flex
 */

let contextID = 0;
let currentText = "";

chrome.input.ime.onFocus.addListener((context) => {
  contextID = context.contextID;
  currentText = "";
});

chrome.input.ime.onBlur.addListener(() => {
  contextID = 0;
  currentText = "";
});

// Lõi xử lý Telex 2.1.6 đơn giản hóa cho Background
function processTelex(text, key) {
  // Đây là bản rút gọn của vietnamese-ime.ts để chạy độc lập
  // Trong thực tế, toàn bộ logic từ lib/vietnamese-ime.ts sẽ được port vào đây
  return text + key; 
}

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === "keydown") {
    // Nếu là phím chức năng, bỏ qua
    if (keyData.altKey || keyData.ctrlKey) return false;
    
    // Nếu là phím chữ, xử lý Telex
    if (keyData.key.length === 1) {
      // Tạm thời để hệ thống tự xử lý phím gốc
      // Sau khi build, logic chuyên sâu sẽ được tích hợp tại đây
      return false;
    }
  }
  return false;
});
