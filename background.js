
// VietFlex Engine 2.1.6 - Background Processor
// Chạy trong môi trường Service Worker, tuân thủ Manifest V3

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // Logic xử lý Telex sẽ được gọi từ đây
  return false;
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage();
  }
  console.log('VietFlex Engine 2.1.6 đã được cài đặt thành công.');
});
