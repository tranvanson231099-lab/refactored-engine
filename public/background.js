
// VietFlex Engine 2.1.6 - Background Processor
chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex sẽ được tích hợp tại đây cho bàn phím vật lý
    return false;
  }
  return false;
});

// Mở bảng điều khiển khi click vào icon nếu không có popup
chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã được cài đặt thành công.');
});
