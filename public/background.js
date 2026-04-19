/**
 * VietFlex Background Engine 2.1.6
 * Xử lý sự kiện bàn phím hệ thống cho Chrome OS
 */

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Context focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex 2.1.6 sẽ được tích hợp tại đây
    // Hiện tại: Chế độ Passthrough để đảm bảo bàn phím hoạt động
    return false; 
  }
  return false;
});

console.log('VietFlex Engine 2.1.6 is running in background');