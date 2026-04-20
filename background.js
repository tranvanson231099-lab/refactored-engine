// VietFlex Engine 2.1.6 - Background Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('VietFlex Engine 2.1.6 đã sẵn sàng.');
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});