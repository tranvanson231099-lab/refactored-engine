/**
 * VietFlex Engine 2.1.6 - Core IME Handler
 * Xử lý phím bấm hệ thống cho Chrome OS
 */

const TONES = { s: 1, f: 2, r: 3, x: 4, j: 5, z: 0 };
const MODIFIERS = { a: 'â', e: 'ê', o: 'ô', d: 'đ', w: 'ư' };
const VOWELS = 'aeiouyàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ';

let currentContext = null;
let compositionText = "";

chrome.input.ime.onFocus.addListener((context) => {
  currentContext = context;
  compositionText = "";
});

chrome.input.ime.onKeyEvent.addListener((engineID, keyData) => {
  if (keyData.type !== "keydown" || keyData.altKey || keyData.ctrlKey) return false;

  const key = keyData.key;
  
  // Xử lý phím Backspace
  if (key === "Backspace") {
    if (compositionText.length > 0) {
      compositionText = compositionText.slice(0, -1);
      updateComposition();
      return true;
    }
    return false;
  }

  // Xử lý phím Space hoặc Enter để kết thúc từ
  if (key === " " || key === "Enter") {
    commitComposition();
    return false; // Để hệ thống tự gõ dấu cách/xuống dòng
  }

  // Xử lý các ký tự chữ cái (Telex logic)
  if (/^[a-zA-Z]$/.test(key)) {
    compositionText += key;
    // Ở đây có thể tích hợp logic convertText từ vietnamese-ime.ts 
    // Nhưng để đơn giản và ổn định cho Chrome OS, chúng ta xử lý trực tiếp:
    processTelex();
    updateComposition();
    return true;
  }

  return false;
});

function processTelex() {
  // Logic Telex rút gọn cho Background Worker
  // (Trong thực tế sẽ import toàn bộ logic từ vietnamese-ime.ts)
  // Đây là bản demo xử lý nhanh:
  if (compositionText.endsWith('aa')) compositionText = compositionText.slice(0, -2) + 'â';
  if (compositionText.endsWith('ee')) compositionText = compositionText.slice(0, -2) + 'ê';
  if (compositionText.endsWith('oo')) compositionText = compositionText.slice(0, -2) + 'ô';
  if (compositionText.endsWith('dd')) compositionText = compositionText.slice(0, -2) + 'đ';
  if (compositionText.endsWith('w')) {
     let last = compositionText.slice(-2, -1);
     if (last === 'u') compositionText = compositionText.slice(0, -2) + 'ư';
     else if (last === 'o') compositionText = compositionText.slice(0, -2) + 'ơ';
     else if (last === 'a') compositionText = compositionText.slice(0, -2) + 'ă';
  }
}

function updateComposition() {
  if (!currentContext) return;
  chrome.input.ime.setComposition({
    contextID: currentContext.contextID,
    text: compositionText,
    cursor: compositionText.length
  });
}

function commitComposition() {
  if (!currentContext || !compositionText) return;
  chrome.input.ime.commitText({
    contextID: currentContext.contextID,
    text: compositionText
  });
  compositionText = "";
}