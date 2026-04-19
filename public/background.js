
// VietFlex Engine 2.1.6 - Background Processor
// Chạy trong môi trường Service Worker, tuân thủ Manifest V3

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã được cài đặt thành công.');
});
