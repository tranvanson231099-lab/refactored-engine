
/**
 * VietFlex Engine 2.1.6 - Core IME Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã khởi tạo thành công.');
});

// Xử lý sự kiện bộ gõ hệ thống (IME)
chrome.input.ime.onFocus.addListener((context) => {
  console.log('IME Focused:', context.contextID);
});

// Xử lý phím bấm thực tế
chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Trả về false để hệ thống xử lý mặc định trong phiên bản này
  // Logic Telex hệ thống sẽ được tích hợp sâu hơn ở bản cập nhật tới
  return false;
});
