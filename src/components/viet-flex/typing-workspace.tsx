
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TypingSuggestions } from './typing-suggestions';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Keyboard, MousePointer2, Wand2, Loader2, Sparkles, AlertCircle, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smartTextRefiner } from '@/ai/flows/smart-text-refiner-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';

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
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Interactive Sandbox</h2>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 flex items-center">
                <Zap className="w-3 h-3 fill-emerald-500" />
                Local AI Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">VietFlex Engine v1.5 • Real-time Correcting</p>
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
        <AlertTitle className="text-xs font-bold text-amber-800">Lưu ý quan trọng cho Chrome OS / Windows</AlertTitle>
        <AlertDescription className="text-[10px] text-amber-700">
          Hãy tắt bộ gõ tiếng Việt của máy tính (chuyển sang tiếng Anh). VietFlex đã tích hợp Local AI để tự sửa lỗi gõ ngay cả khi offline.
        </AlertDescription>
      </Alert>

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản (Ví dụ: luyeenj -> luyện, sonw -> sơn)..." : "IME is currently disabled. Type in English..."}
          className="min-h-[450px] text-lg p-6 bg-white border-2 border-primary/10 focus-visible:border-accent transition-all shadow-inner resize-none leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-muted-foreground">
            <Badge variant="secondary" className="text-[9px] font-bold bg-white/80 backdrop-blur">
              {isOnline ? 'CLOUD AI LINKED' : 'LOCAL AI ONLY'}
            </Badge>
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
          <Zap className="w-3.5 h-3.5" />
          Quy tắc gõ thông minh (Real-time Fix)
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          - <b>Sơn</b>: gõ <code>sonw</code>. <b>Hư</b>: gõ <code>huw</code>.<br />
          - <b>Trả lại phím gốc</b>: gõ lặp phím modifier (ví dụ: <code>ww</code> &rarr; w, <code>aa</code> &rarr; a).<br />
          - <b>Tự động sửa dấu</b>: Dấu luôn được đặt chuẩn Unicode (ví dụ: <code>luýên</code> &rarr; <code>luyến</code>) nhờ Local Smart Engine.
        </p>
      </div>
    </div>
  );
};
