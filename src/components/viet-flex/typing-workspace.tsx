import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { TypingSuggestions } from './typing-suggestions';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Keyboard, MousePointer2 } from 'lucide-react';

interface TypingWorkspaceProps {
  text: string;
  setText: (val: string) => void;
  rawSetText: (val: string) => void;
  method: InputMethod;
  isEnabled: boolean;
}

export const TypingWorkspace: React.FC<TypingWorkspaceProps> = ({
  text,
  setText,
  rawSetText,
  method,
  isEnabled,
}) => {
  const handleSuggestion = (suggestion: string) => {
    const words = text.trim().split(' ');
    words[words.length - 1] = suggestion;
    rawSetText(words.join(' ') + ' ');
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
            <p className="text-xs text-muted-foreground font-medium">Test your typing experience here</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Method</p>
                <p className="text-sm font-bold text-primary">{isEnabled ? method : "N/A"}</p>
            </div>
        </div>
      </div>

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản tiếng Việt tại đây..." : "IME is currently disabled. Type in English..."}
          className="min-h-[400px] text-lg p-6 bg-white border-2 border-primary/10 focus-visible:border-accent transition-all shadow-inner resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!isEnabled && (
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none rounded-md" />
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-muted-foreground">
            <Keyboard className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
                {text.length} Characters
            </span>
        </div>
      </div>

      <TypingSuggestions text={text} onSuggestionClick={handleSuggestion} />
      
      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quick Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary">S / 1</span>
            <span className="text-xs font-medium">Dấu sắc (á)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary">F / 2</span>
            <span className="text-xs font-medium">Dấu huyền (à)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary">AA / 6</span>
            <span className="text-xs font-medium">Â (Vần â)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary">DD / 9</span>
            <span className="text-xs font-medium">Đ (Vần đ)</span>
          </div>
        </div>
      </div>
    </div>
  );
};