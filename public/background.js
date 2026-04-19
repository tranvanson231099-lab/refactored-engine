/**
 * VietFlex Engine 2.1.6 - Background IME Processor
 * Xử lý bắt phím và chuyển đổi tiếng Việt toàn hệ thống.
 */

var context_id = -1;

chrome.input.ime.onFocus.addListener(function(context) {
  context_id = context.contextID;
});

chrome.input.ime.onKeyEvent.addListener(function(engineID, keyData) {
  // Logic xử lý Telex 2.1.6 sẽ được nhúng tại đây
  // Hiện tại trả về false để phím được hệ thống xử lý bình thường
  // Khi bạn gõ trong app, app sẽ xử lý trực tiếp.
  return false;
});