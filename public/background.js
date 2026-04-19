
/**
 * VietFlex Engine 2.1.6 - Background Worker for Chrome OS IME
 * Xử lý trực tiếp các sự kiện bàn phím trên toàn hệ điều hành.
 */

const engine_version = "2.1.6";

chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: Context focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex 2.1.6 sẽ được nhúng tại đây để chuyển đổi ký tự trực tiếp
    // Hiện tại chuyển tiếp phím cho hệ thống xử lý (Bản rút gọn)
    return false; 
  }
  return false;
});

console.log(`VietFlex Engine ${engine_version} initialized as System IME.`);
