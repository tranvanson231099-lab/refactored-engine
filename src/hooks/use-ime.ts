
import { useState, useEffect, useCallback } from 'react';
import { convertText, InputMethod } from '@/lib/vietnamese-ime';

export function useIme() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isModernStyle, setIsModernStyle] = useState(true);
  const [method, setMethod] = useState<InputMethod>('Telex');
  const [text, setText] = useState('');
  
  // Persistence
  useEffect(() => {
    const savedMethod = localStorage.getItem('vietflex_method') as InputMethod;
    const savedEnabled = localStorage.getItem('vietflex_enabled');
    const savedModern = localStorage.getItem('vietflex_modern_style');
    
    if (savedMethod) setMethod(savedMethod);
    if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
    if (savedModern !== null) setIsModernStyle(savedModern === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vietflex_method', method);
    localStorage.setItem('vietflex_enabled', String(isEnabled));
    localStorage.setItem('vietflex_modern_style', String(isModernStyle));
  }, [method, isEnabled, isModernStyle]);

  const handleInput = useCallback((val: string) => {
    if (!isEnabled) {
      setText(val);
      return;
    }
    
    // Tự động chuyển đổi và sửa lỗi thời gian thực
    const converted = convertText(val, method, isModernStyle);
    setText(converted);
  }, [isEnabled, method, isModernStyle]);

  return {
    isEnabled,
    setIsEnabled,
    isModernStyle,
    setIsModernStyle,
    method,
    setMethod,
    text,
    setText: handleInput,
    rawSetText: setText
  };
}
