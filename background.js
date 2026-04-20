
// VietFlex Engine 2.1.6 - Core IME Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã khởi tạo thành công.');
});

// Xử lý sự kiện bộ gõ hệ thống (IME)
chrome.input.ime.onFocus.addListener((context) => {
  console.log('IME Focused:', context.contextID);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Logic xử lý Telex hệ thống sẽ được tích hợp tại đây
  // Hiện tại trả về false để hệ thống xử lý mặc định cho đến khi bật mode Telex
  return false;
});
