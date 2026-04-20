
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

// Đây là nơi xử lý phím bấm thực tế khi người dùng gõ trong hệ thống
chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Hiện tại trả về false để hệ thống xử lý mặc định
  // Logic Telex hệ thống sẽ được đẩy vào đây trong các bản cập nhật tới
  if (keyData.type === 'keydown') {
    return false;
  }
  return false;
});
