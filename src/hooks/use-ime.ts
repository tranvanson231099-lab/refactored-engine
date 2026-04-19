import { useState, useEffect, useCallback } from 'react';
import { convertText, InputMethod } from '@/lib/vietnamese-ime';

export function useIme() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [method, setMethod] = useState<InputMethod>('Telex');
  const [text, setText] = useState('');
  
  // Persistence
  useEffect(() => {
    const savedMethod = localStorage.getItem('vietflex_method') as InputMethod;
    const savedEnabled = localStorage.getItem('vietflex_enabled');
    
    if (savedMethod) setMethod(savedMethod);
    if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vietflex_method', method);
    localStorage.setItem('vietflex_enabled', String(isEnabled));
  }, [method, isEnabled]);

  const handleInput = useCallback((val: string) => {
    if (!isEnabled) {
      setText(val);
      return;
    }
    
    // Only convert if the character added is an IME trigger
    const converted = convertText(val, method);
    setText(converted);
  }, [isEnabled, method]);

  return {
    isEnabled,
    setIsEnabled,
    method,
    setMethod,
    text,
    setText: handleInput,
    rawSetText: setText
  };
}