
import { useState, useEffect, useCallback } from 'react';
import { convertText, InputMethod } from '@/lib/vietnamese-ime';

export function useIme() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isModernStyle, setIsModernStyle] = useState(true);
  const [isSmartFix, setIsSmartFix] = useState(true);
  const [method, setMethod] = useState<InputMethod>('Telex');
  const [text, setText] = useState('');
  
  useEffect(() => {
    const savedMethod = localStorage.getItem('vietflex_method') as InputMethod;
    const savedEnabled = localStorage.getItem('vietflex_enabled');
    const savedModern = localStorage.getItem('vietflex_modern_style');
    const savedSmartFix = localStorage.getItem('vietflex_smart_fix');
    
    if (savedMethod) setMethod(savedMethod);
    if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
    if (savedModern !== null) setIsModernStyle(savedModern === 'true');
    if (savedSmartFix !== null) setIsSmartFix(savedSmartFix === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vietflex_method', method);
    localStorage.setItem('vietflex_enabled', String(isEnabled));
    localStorage.setItem('vietflex_modern_style', String(isModernStyle));
    localStorage.setItem('vietflex_smart_fix', String(isSmartFix));
  }, [method, isEnabled, isModernStyle, isSmartFix]);

  const handleInput = useCallback((val: string) => {
    if (!isEnabled) {
      setText(val);
      return;
    }
    
    // Xử lý chuyển đổi ngôn ngữ tức thì (Offline)
    const converted = convertText(val, method, isModernStyle, isSmartFix);
    setText(converted);
  }, [isEnabled, method, isModernStyle, isSmartFix]);

  return {
    isEnabled,
    setIsEnabled,
    isModernStyle,
    setIsModernStyle,
    isSmartFix,
    setIsSmartFix,
    method,
    setMethod,
    text,
    setText: handleInput,
    rawSetText: setText
  };
}
