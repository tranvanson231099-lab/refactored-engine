'use client';

import React from 'react';
import { useIme } from '@/hooks/use-ime';
import { UnikeyWindow } from '@/components/viet-flex/unikey-window';
import { TypingWorkspace } from '@/components/viet-flex/typing-workspace';
import { Toaster } from '@/components/ui/toaster';
import { Command, Layout, Monitor, Zap, Settings } from 'lucide-react';

export default function Home() {
  const { 
    isEnabled, setIsEnabled, 
    isModernStyle, setIsModernStyle,
    isSmartFix, setIsSmartFix,
    text, setText, rawSetText,
    handleBackspace
  } = useIme();

  return (
    <div className="w-full flex flex-col bg-slate-50 selection:bg-primary/20 min-h-screen">
      <header className="h-14 border-b bg-white flex items-center px-4 sticky top-0 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <Command className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-bold tracking-tight">VietFlex <span className="text-primary/70">2.1.6</span></h1>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isEnabled ? `TELEX` : 'OFF'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto">
        {/* Control Panel comes first in extension view */}
        <section className="w-full">
           <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Settings className="w-3.5 h-3.5" />
              Điều khiển
            </div>
            <UnikeyWindow 
              isEnabled={isEnabled} 
              setIsEnabled={setIsEnabled} 
              isModernStyle={isModernStyle}
              setIsModernStyle={setIsModernStyle}
              isSmartFix={isSmartFix}
              setIsSmartFix={setIsSmartFix}
            />
        </section>

        <section className="w-full">
          <TypingWorkspace 
            text={text} 
            setText={setText} 
            rawSetText={rawSetText}
            handleBackspace={handleBackspace}
            isEnabled={isEnabled}
            isSmartFix={isSmartFix}
          />
        </section>
        
        <div className="p-4 bg-white rounded-xl border border-primary/5 shadow-sm">
          <h3 className="text-[10px] font-bold mb-2 text-primary uppercase tracking-tighter italic">Hệ thống VietFlex</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
            Tối ưu cho Chrome OS Flex. Gỡ dấu thông minh 3 bước & chuẩn i/y.
          </p>
        </div>
      </main>

      <footer className="py-3 border-t bg-white text-center shrink-0">
        <p className="text-[10px] text-muted-foreground font-bold">
          &copy; {new Date().getFullYear()} VietFlex Engine v2.1.6
        </p>
      </footer>
      <Toaster />
    </div>
  );
}