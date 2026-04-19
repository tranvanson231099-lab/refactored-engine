/**
 * VietFlex Background IME Handler
 * Xử lý bắt phím hệ thống và chuyển đổi Telex 2.1.6
 */

let contextId = 0;
let currentWord = "";

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown") return false;

  // Xử lý phím Backspace
  if (keyData.key === "Backspace") {
    if (currentWord.length > 0) {
      currentWord = currentWord.slice(0, -1);
      return false; // Cho phép hệ thống xóa ký tự
    }
    return false;
  }

  // Xử lý các phím điều khiển khác
  if (keyData.key.length > 1) {
    currentWord = "";
    return false;
  }

  // Xử lý phím trắng hoặc dấu câu để kết thúc từ
  if (keyData.key === " " || ".,?!".includes(keyData.key)) {
    currentWord = "";
    return false;
  }

  // Logica Telex cơ bản (Cần tích hợp sâu hơn từ vietnamese-ime.ts)
  // Đây là bản rút gọn để demo hoạt động IME
  currentWord += keyData.key;
  
  // Trình bày: Gõ chữ 'a' + 's' -> 'á'
  // Lưu ý: Trong bản build thực tế, chúng ta sẽ copy logic từ vietnamese-ime.ts vào đây
  
  return false; 
});
