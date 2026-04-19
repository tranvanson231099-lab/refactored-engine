
// VietFlex Engine 2.1.6 - Background Processor
// Xử lý sự kiện IME và điều khiển giao diện

chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã được cài đặt.');
});

// Mở bảng điều khiển khi nhấn vào icon (nếu không dùng popup)
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Logic xử lý phím bấm IME
if (chrome.input && chrome.input.ime) {
  chrome.input.ime.onFocus.addListener((context) => {
    console.log('VietFlex: IME Focused', context);
  });

  chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
    // Xử lý phím bấm ở đây
    return false;
  });
}
