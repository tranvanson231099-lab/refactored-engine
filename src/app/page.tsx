'use client';

import React from 'react';
import { useIme } from '@/hooks/use-ime';
import { UnikeyWindow } from '@/components/viet-flex/unikey-window';
import { TypingWorkspace } from '@/components/viet-flex/typing-workspace';
import { Toaster } from '@/components/ui/toaster';
import { Command, Layout, Monitor, Smartphone } from 'lucide-react';

export default function Home() {
  const { isEnabled, setIsEnabled, method, setMethod, text, setText, rawSetText } = useIme();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      {/* Top Navigation / Status Bar */}
      <header className="h-14 border-b bg-white/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <Command className="w-5 h-5" />
          </div>
          <h1 className="text-base font-bold tracking-tight">VietFlex <span className="text-accent">Input</span></h1>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              Chrome OS Flex
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Universal Sync
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-accent animate-pulse' : 'bg-muted'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isEnabled ? `System Ready (${method})` : 'IME Standby'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Workspace Area */}
        <section className="flex-1">
          <TypingWorkspace 
            text={text} 
            setText={setText} 
            rawSetText={rawSetText}
            method={method}
            isEnabled={isEnabled}
          />
        </section>

        {/* Floating / Sidebar Control Panel */}
        <aside className="lg:w-80 flex flex-col gap-4 order-first lg:order-last">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Layout className="w-4 h-4" />
              Control Center
            </div>
            <UnikeyWindow 
              isEnabled={isEnabled} 
              setIsEnabled={setIsEnabled} 
              method={method} 
              setMethod={setMethod} 
            />
            
            <div className="mt-8 p-6 bg-white rounded-xl border-2 border-primary/5 shadow-sm">
              <h3 className="text-sm font-bold mb-3">About VietFlex</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Designed specifically for Chrome OS Flex users who need a lightweight, high-performance Vietnamese IME. 
                Utilizing the latest linguistic algorithms and Gemini AI for context-aware suggestions.
              </p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary">BETA ACCESS</span>
                <span className="text-[10px] font-bold text-accent">STABLE 1.0.2</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="py-6 border-t bg-white/50 text-center">
        <p className="text-xs text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} VietFlex Input. Efficiency. Precision. Vietnamese.
        </p>
      </footer>
      <Toaster />
    </div>
  );
}