
/**
 * VietFlex Engine 2.1.6 - Background Service Worker
 * Xử lý tích hợp sâu vào Chrome OS Input Method Editor (IME) API.
 */

const engineId = 'vietflex_telex';
let contextId = 0;

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    // Logic xử lý phím trực tiếp từ hệ thống sẽ được tích hợp tại đây
    // Hiện tại ứng dụng hỗ trợ soạn thảo trong Workspace và copy-paste
    // Để gõ trực tiếp, hệ thống cần bridge từ thư viện vietnamese-ime.ts
    return false; 
  }
  return false;
});
