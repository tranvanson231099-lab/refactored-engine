
/**
 * VietFlex Engine 2.1.6 - Core IME Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã khởi tạo thành công.');
});

// Lắng nghe sự kiện IME
if (chrome.input && chrome.input.ime) {
  chrome.input.ime.onFocus.addListener((context) => {
    console.log('IME Focused:', context.contextID);
  });

  chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
    // Trả về false để hệ thống xử lý phím mặc định
    // Đây là nơi sẽ tích hợp logic Telex hệ thống trong tương lai
    return false;
  });
}
