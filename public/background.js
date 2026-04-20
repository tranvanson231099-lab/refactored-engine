
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

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic Telex hệ thống sẽ được đẩy vào đây trong các bản cập nhật tới
    return false;
  }
  return false;
});
