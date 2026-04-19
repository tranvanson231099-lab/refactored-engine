
// VietFlex Engine 2.1.6 - Background Processor
chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

// Lắng nghe sự kiện click vào icon tiện ích để mở Bảng điều khiển
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'index.html' });
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Xử lý Telex Core sẽ được thực thi tại đây
    return false;
  }
  return false;
});
