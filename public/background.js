
/**
 * VietFlex Engine 2.1.6 - Core IME Handler
 * Xử lý sự kiện bàn phím hệ thống trên Chrome OS
 */

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Context focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex 2.1.6 sẽ được thực thi tại đây
    // Hiện tại cho phép phím đi qua bình thường để đảm bảo không kẹt phím
    return false; 
  }
  return false;
});

console.log('VietFlex Engine 2.1.6 Ready');
