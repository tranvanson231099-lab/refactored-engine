
/**
 * VietFlex Engine 2.1.6 - Background Service Worker
 * Xử lý sự kiện IME và kết nối với bộ lõi tiếng Việt.
 */

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Input focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Logic xử lý phím trực tiếp trên hệ thống sẽ được tích hợp tại đây
  // Hiện tại trả về false để hệ thống xử lý phím mặc định nếu chưa gõ trong App
  if (keyData.type === 'keydown') {
    return false;
  }
  return false;
});

console.log('VietFlex Engine 2.1.6: IME Service Worker Started');
