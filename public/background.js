/**
 * VietFlex Engine 2.1.6 - Core IME Logic
 * Xử lý sự kiện bàn phím cho Chrome OS
 */

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý phím bấm sẽ được tích hợp tại đây
    // Hiện tại cho phép phím đi qua mặc định
    return false;
  }
  return false;
});

console.log('VietFlex Engine 2.1.6 Ready');