
/**
 * VietFlex Engine 2.1.6 - System IME Background Script
 */

let contextId = 0;

chrome.input.ime.onFocus.addListener((context) => {
  contextId = context.contextID;
});

chrome.input.ime.onBlur.addListener(() => {
  contextId = 0;
});

// Chú thích: Logic Telex phức tạp sẽ được xử lý thông qua API IME của Chrome.
// Hiện tại, tệp này đảm bảo Extension được đăng ký thành công vào hệ thống.
console.log("VietFlex IME Engine 2.1.6 Service Worker Active");
