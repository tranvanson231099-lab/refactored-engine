
// VietFlex Engine 2.1.6 - Background Proxy
// Chuyển hướng thông minh để tránh lỗi đường dẫn

chrome.action.onClicked.addListener(() => {
  // Ưu tiên mở trang tùy chọn để có diện tích hiển thị tốt nhất
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: "out/index.html" });
  }
  console.log('VietFlex Engine 2.1.6 đã sẵn sàng.');
});
