
// VietFlex Engine 2.1.6 - Background Processor
chrome.input.ime.onFocus.addListener((context) => {
  console.log('VietFlex: IME Focused', context);
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type === 'keydown') {
    return false;
  }
  return false;
});

chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});
