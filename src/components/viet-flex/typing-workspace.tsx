

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TypingSuggestions } from './typing-suggestions';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Keyboard, MousePointer2, Wand2, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smartTextRefiner } from '@/ai/flows/smart-text-refiner-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TypingWorkspaceProps {
  text: string;
  setText: (val: string) => void;
  rawSetText: (val: string) => void;
  method: InputMethod;
  isEnabled: boolean;
  isAiEnabled: boolean;
  isOnline: boolean;
}

export const TypingWorkspace: React.FC<TypingWorkspaceProps> = ({
  text,
  setText,
  rawSetText,
  method,
  isEnabled,
  isAiEnabled,
  isOnline,
}) => {
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();

  const handleSuggestion = (suggestion: string) => {
    const words = text.split(' ');
    words[words.length - 1] = suggestion;
    rawSetText(words.join(' ') + ' ');
  };

  const handleAIRefine = async () => {
    if (!text.trim() || !isOnline) return;
    setIsRefining(true);
    try {
      const result = await smartTextRefiner({ text });
      rawSetText(result.refinedText);
      toast({
        title: "AI Refinement Complete",
        description: result.explanation,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not refine text at this time.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg text-white shadow-md">
            <MousePointer2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Interactive Sandbox</h2>
            <p className="text-xs text-muted-foreground font-medium">VietFlex Core 1.3 Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            {isAiEnabled && isOnline && (
              <Button 
                size="sm" 
                variant="default" 
                className="gap-2 bg-accent hover:bg-accent/90 text-white shadow-lg animate-bounce-subtle"
                onClick={handleAIRefine}
                disabled={isRefining || !text}
              >
                {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                AI Smart Fix (Dọn lỗi gõ)
              </Button>
            )}
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Method</p>
                <p className="text-sm font-bold text-primary">{isEnabled ? method : "N/A"}</p>
            </div>
        </div>
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-xs font-bold text-amber-800">Lưu ý QUAN TRỌNG cho Chrome OS / Windows</AlertTitle>
        <AlertDescription className="text-[10px] text-amber-700">
          Vui lòng **TẮT BỘ GÕ TIẾNG VIỆT HỆ THỐNG** (chuyển sang US English). Nếu không, phím sẽ bị lặp (ví dụ: luýên, ưư) do xung đột giữa bộ gõ máy tính và VietFlex.
        </AlertDescription>
      </Alert>

      {!isOnline && isAiEnabled && (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-bold">AI Offline</AlertTitle>
          <AlertDescription className="text-[10px]">
            Tính năng AI Smart Fix tạm thời không khả dụng do mất kết nối.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản (Ví dụ: luyeenj -> luyện, sonw -> sơn)..." : "IME is currently disabled. Type in English..."}
          className="min-h-[450px] text-lg p-6 bg-white border-2 border-primary/10 focus-visible:border-accent transition-all shadow-inner resize-none leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!isEnabled && (
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none rounded-md" />
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-muted-foreground">
            {isAiEnabled && <Sparkles className={`w-4 h-4 ${isOnline ? 'text-accent' : 'text-muted'}`} />}
            <Keyboard className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
                {text.length} Characters
            </span>
        </div>
      </div>

      <TypingSuggestions 
        text={text} 
        onSuggestionClick={handleSuggestion} 
        isAiEnabled={isAiEnabled}
        isOnline={isOnline}
      />
      
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" />
          Mẹo gõ chuẩn Unicode
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sử dụng phím <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-bold">w</kbd> ở cuối từ để thêm móc (sơn &rarr; sonw, hư &rarr; huw). 
          Gõ lặp phím modifier (ww, aa, ee) để trả lại ký tự gốc nếu gõ nhầm. Quy tắc đặt dấu chuẩn mới (hoà, luyện) đã được kích hoạt.
        </p>
      </div>
    </div>
  );
};
