
'use client';

import React from 'react';
import { useIme } from '@/hooks/use-ime';
import { UnikeyWindow } from '@/components/viet-flex/unikey-window';
import { TypingWorkspace } from '@/components/viet-flex/typing-workspace';
import { Toaster } from '@/components/ui/toaster';
import { Command, Layout, Monitor, Zap } from 'lucide-react';

export default function Home() {
  const { 
    isEnabled, setIsEnabled, 
    isModernStyle, setIsModernStyle,
    isSmartFix, setIsSmartFix,
    method, setMethod, 
    text, setText, rawSetText,
    handleBackspace
  } = useIme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary/20">
      <header className="h-14 border-b bg-white flex items-center px-6 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <Command className="w-5 h-5" />
          </div>
          <h1 className="text-base font-bold tracking-tight">VietFlex <span className="text-primary/70">Engine 2.1.6</span></h1>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Zap className="w-3.5 h-3.5 fill-emerald-600" />
              Siêu tốc (Zero Latency)
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              Windows / Chrome OS
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isEnabled ? `Sẵn sàng (${method})` : 'IME Đã Tắt'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <section className="flex-1">
          <TypingWorkspace 
            text={text} 
            setText={setText} 
            rawSetText={rawSetText}
            handleBackspace={handleBackspace}
            method={method}
            isEnabled={isEnabled}
            isSmartFix={isSmartFix}
          />
        </section>

        <aside className="lg:w-80 flex flex-col gap-4 order-first lg:order-last">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Layout className="w-4 h-4" />
              Bảng điều khiển
            </div>
            <UnikeyWindow 
              isEnabled={isEnabled} 
              setIsEnabled={setIsEnabled} 
              isModernStyle={isModernStyle}
              setIsModernStyle={setIsModernStyle}
              isSmartFix={isSmartFix}
              setIsSmartFix={setIsSmartFix}
              method={method} 
              setMethod={setMethod} 
            />
            
            <div className="mt-8 p-6 bg-white rounded-xl border border-primary/5 shadow-sm">
              <h3 className="text-sm font-bold mb-3">Về VietFlex 2.1.6</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bộ gõ tiếng Việt siêu nhẹ, chuyên biệt cho Chrome OS Flex. 
                Sử dụng thuật toán "Smart Fix" cục bộ tuân thủ 5 quy tắc i/y và Smart Backspace.
              </p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase">Phiên bản 2.1.6</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase italic">Ultra Fast</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="py-6 border-t bg-white text-center">
        <p className="text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} VietFlex Engine. Hiệu quả. Chính xác. Zero Latency.
        </p>
      </footer>
      <Toaster />
    </div>
  );
}
