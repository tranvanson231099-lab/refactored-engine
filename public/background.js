
/**
 * VietFlex Engine 2.1.6 - System IME Background Core
 */

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  // VietFlex Engine 2.1.6 xử lý phím bấm tại đây
  // Hiện tại trả về false để hệ thống xử lý phím bấm vật lý mặc định
  if (keyData.type === 'keydown') {
    console.log('VietFlex Key:', keyData.key);
  }
  return false;
});
