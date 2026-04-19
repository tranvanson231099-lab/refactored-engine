// VietFlex Engine 2.1.6 - Background Script for Chrome OS IME
chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Logic xử lý phím bấm sẽ được tích hợp tại đây
  // Hiện tại trả về false để phím bấm được xử lý mặc định
  return false;
});

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Input focused', context);
});