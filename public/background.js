/**
 * VietFlex Engine 2.1.6 - Core IME Background Process
 * Xử lý gõ tiếng Việt hệ thống cho Chrome OS Flex
 */

const context_id = 0;

chrome.input.ime.onFocus.addListener((context) => {
  context_id = context.contextID;
});

// Lõi xử lý tiếng Việt Telex cơ bản (Tối giản để chạy trong background)
// Trong bản thực tế, toàn bộ logic từ vietnamese-ime.ts sẽ được port vào đây
chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown' && !keyData.altKey && !keyData.ctrlKey) {
    // Logic bắt phím và chuyển đổi Telex 2.1.6 sẽ xử lý tại đây
    // Tạm thời cho phép phím đi qua để không làm hỏng bàn phím người dùng
    return false; 
  }
  return false;
});

console.log("VietFlex Engine 2.1.6 System IME Ready");