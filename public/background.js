/**
 * VietFlex Engine 2.1.6 - Background IME Service
 * Xử lý nhập liệu tiếng Việt trên toàn hệ thống Chrome OS.
 */

chrome.input.ime.onActivate.addListener((engineID) => {
  console.log('VietFlex IME Activated:', engineID);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý Telex và phím bấm sẽ được hệ thống IME của Chrome OS điều phối
    // Hiện tại chúng ta trả về false để hệ thống tự xử lý phím mặc định
    // Trong phiên bản nâng cao, chúng ta sẽ chèn logic xử lý xâu chuỗi tại đây
    return false;
  }
  return false;
});
