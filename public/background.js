
// VietFlex Engine 2.1.6 - Background Processor
chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Nhân xử lý Telex 2.1.6 sẽ được thực thi tại đây trên toàn hệ thống
    return false;
  }
  return false;
});
