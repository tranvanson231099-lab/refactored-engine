
'use client';

import React from 'react';
import { useIme } from '@/hooks/use-ime';
import { UnikeyWindow } from '@/components/viet-flex/unikey-window';
import { TypingWorkspace } from '@/components/viet-flex/typing-workspace';
import { Toaster } from '@/components/ui/toaster';
import { Command, Layout, Monitor, Wifi, WifiOff } from 'lucide-react';

export default function Home() {
  const { 
    isEnabled, setIsEnabled, 
    isAiEnabled, setIsAiEnabled,
    isModernStyle, setIsModernStyle,
    isOnline,
    method, setMethod, 
    text, setText, rawSetText 
  } = useIme();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
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
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-accent" /> : <WifiOff className="w-3.5 h-3.5 text-destructive" />}
              {isOnline ? 'Online' : 'Offline Mode'}
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              Chrome OS Flex
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
        <section className="flex-1">
          <TypingWorkspace 
            text={text} 
            setText={setText} 
            rawSetText={rawSetText}
            method={method}
            isEnabled={isEnabled}
            isAiEnabled={isAiEnabled}
            isOnline={isOnline}
          />
        </section>

        <aside className="lg:w-80 flex flex-col gap-4 order-first lg:order-last">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Layout className="w-4 h-4" />
              Control Center
            </div>
            <UnikeyWindow 
              isEnabled={isEnabled} 
              setIsEnabled={setIsEnabled} 
              isAiEnabled={isAiEnabled}
              setIsAiEnabled={setIsAiEnabled}
              isModernStyle={isModernStyle}
              setIsModernStyle={setIsModernStyle}
              isOnline={isOnline}
              method={method} 
              setMethod={setMethod} 
            />
            
            <div className="mt-8 p-6 bg-white rounded-xl border-2 border-primary/5 shadow-sm">
              <h3 className="text-sm font-bold mb-3">About VietFlex</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Smart Vietnamese IME with integrated Gemini AI support. 
                Optimized for mixed English/Vietnamese environments.
              </p>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase">Version 1.7.0</span>
                <span className="text-[10px] font-bold text-accent uppercase">AI Powered</span>
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
