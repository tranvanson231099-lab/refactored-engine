
// VietFlex Engine 2.1.6 - Core IME Processor
chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Hệ thống đã sẵn sàng', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex 2.1.6 sẽ chạy tại đây
    return false;
  }
  return false;
});

// Lắng nghe sự kiện cài đặt để mở trang hướng dẫn
chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex đã được cài đặt thành công!');
});
