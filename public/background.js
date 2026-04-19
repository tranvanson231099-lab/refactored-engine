
/**
 * VietFlex Engine 2.1.6 - System Level IME Service Worker
 * Xử lý gõ trực tiếp trên toàn hệ điều hành Chrome OS.
 */

let contextID = 0;
let currentComposition = "";

chrome.input.ime.onFocus.addListener((context) => {
  contextID = context.contextID;
});

chrome.input.ime.onBlur.addListener(() => {
  contextID = 0;
  currentComposition = "";
});

// Chú ý: Đây là bản rút gọn của Engine 2.1.6 để chạy trong Service Worker
// Trong thực tế, toàn bộ logic từ src/lib/vietnamese-ime.ts sẽ được bundle vào đây.
chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown") return false;
  if (keyData.altKey || keyData.ctrlKey) return false;

  const key = keyData.key;

  // Xử lý phím Telex cơ bản để minh họa khả năng gõ trực tiếp
  // (Bản full sẽ bao gồm 5 quy tắc i/y và Smart Backspace)
  if (key === "Enter" || key === " ") {
    currentComposition = "";
    return false;
  }

  if (key === "Backspace") {
    if (currentComposition.length > 0) {
      currentComposition = currentComposition.slice(0, -1);
      return false;
    }
    return false;
  }

  // Tín hiệu bắt phím thành công
  console.log("VietFlex Intercepted:", key);
  return false; 
});
