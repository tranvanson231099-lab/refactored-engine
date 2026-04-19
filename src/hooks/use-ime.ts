
import { useState, useEffect, useCallback } from 'react';
import { convertText, removeLastMark, InputMethod } from '@/lib/vietnamese-ime';

export function useIme() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isModernStyle, setIsModernStyle] = useState(true);
  const [isSmartFix, setIsSmartFix] = useState(true);
  const method: InputMethod = 'Telex'; // Hardcoded Telex
  const [text, setText] = useState('');
  
  useEffect(() => {
    const savedEnabled = localStorage.getItem('vietflex_enabled');
    const savedModern = localStorage.getItem('vietflex_modern_style');
    const savedSmartFix = localStorage.getItem('vietflex_smart_fix');
    
    if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
    if (savedModern !== null) setIsModernStyle(savedModern === 'true');
    if (savedSmartFix !== null) setIsSmartFix(savedSmartFix === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vietflex_enabled', String(isEnabled));
    localStorage.setItem('vietflex_modern_style', String(isModernStyle));
    localStorage.setItem('vietflex_smart_fix', String(isSmartFix));
  }, [isEnabled, isModernStyle, isSmartFix]);

  const handleInput = useCallback((val: string) => {
    if (!isEnabled) {
      setText(val);
      return;
    }
    const converted = convertText(val, method, isModernStyle, isSmartFix);
    setText(converted);
  }, [isEnabled, method, isModernStyle, isSmartFix]);

  const handleBackspace = useCallback(() => {
    if (!isEnabled || !text) return false;
    
    const unMarked = removeLastMark(text);
    if (unMarked) {
      setText(unMarked);
      return true;
    }
    
    return false;
  }, [isEnabled, text]);

  return {
    isEnabled,
    setIsEnabled,
    isModernStyle,
    setIsModernStyle,
    isSmartFix,
    setIsSmartFix,
    method,
    text,
    setText: handleInput,
    rawSetText: setText,
    handleBackspace
  };
}
