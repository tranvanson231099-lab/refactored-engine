import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TypingSuggestions } from './typing-suggestions';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Keyboard, MousePointer2, Wand2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smartTextRefiner } from '@/ai/flows/smart-text-refiner-flow';
import { useToast } from '@/hooks/use-toast';

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
    const words = text.trim().split(' ');
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
            <p className="text-xs text-muted-foreground font-medium">Mixed English/Vietnamese typing active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            {isAiEnabled && isOnline && (
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 border-primary/20 hover:bg-primary/5 animate-in fade-in"
                onClick={handleAIRefine}
                disabled={isRefining || !text}
              >
                {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-primary" />}
                AI Smart Fix
              </Button>
            )}
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Method</p>
                <p className="text-sm font-bold text-primary">{isEnabled ? method : "N/A"}</p>
            </div>
        </div>
      </div>

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản (Mixed EN/VN)..." : "IME is currently disabled. Type in English..."}
          className="min-h-[400px] text-lg p-6 bg-white border-2 border-primary/10 focus-visible:border-accent transition-all shadow-inner resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!isEnabled && (
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none rounded-md" />
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-muted-foreground">
            {isAiEnabled && <Sparkles className={`w-4 h-4 ${isOnline ? 'text-primary' : 'text-muted'}`} />}
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
      
      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Typing Insight</h3>
        <p className="text-xs text-muted-foreground italic">
          VietFlex now automatically detects common English words and avoids incorrect accent placement. 
          Use the AI Assistance toggle to manage GenAI features.
        </p>
      </div>
    </div>
  );
};
