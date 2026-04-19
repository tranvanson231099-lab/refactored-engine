
/**
 * VietFlex Engine 2.1.6 - Background Worker
 * Xử lý trực tiếp API chrome.input.ime cho Chrome OS
 */

const context_id = 0;

chrome.input.ime.onFocus.addListener((context) => {
  console.log('IME Focused:', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic gõ Telex 2.1.6 sẽ được xử lý ở đây khi tích hợp sâu
    // Hiện tại chuyển tiếp phím để hệ thống nhận diện
    return false;
  }
  return false;
});

console.log('VietFlex Engine 2.1.6 Background Service Worker Ready.');
