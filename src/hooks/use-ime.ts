import { useState, useEffect, useCallback } from 'react';
import { convertText, InputMethod } from '@/lib/vietnamese-ime';

export function useIme() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [method, setMethod] = useState<InputMethod>('Telex');
  const [text, setText] = useState('');
  
  // Trạng thái mạng
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsOnline(window.navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persistence
  useEffect(() => {
    const savedMethod = localStorage.getItem('vietflex_method') as InputMethod;
    const savedEnabled = localStorage.getItem('vietflex_enabled');
    const savedAiEnabled = localStorage.getItem('vietflex_ai_enabled');
    
    if (savedMethod) setMethod(savedMethod);
    if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
    if (savedAiEnabled !== null) setIsAiEnabled(savedAiEnabled === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('vietflex_method', method);
    localStorage.setItem('vietflex_enabled', String(isEnabled));
    localStorage.setItem('vietflex_ai_enabled', String(isAiEnabled));
  }, [method, isEnabled, isAiEnabled]);

  const handleInput = useCallback((val: string) => {
    if (!isEnabled) {
      setText(val);
      return;
    }
    
    const converted = convertText(val, method);
    setText(converted);
  }, [isEnabled, method]);

  return {
    isEnabled,
    setIsEnabled,
    isAiEnabled,
    setIsAiEnabled,
    isOnline,
    method,
    setMethod,
    text,
    setText: handleInput,
    rawSetText: setText
  };
}
