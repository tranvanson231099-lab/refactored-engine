'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MousePointer2, Zap, Info, Keyboard, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TypingWorkspaceProps {
  text: string;
  setText: (val: string) => void;
  rawSetText: (val: string) => void;
  handleBackspace: () => boolean;
  isEnabled: boolean;
  isSmartFix: boolean;
}

export const TypingWorkspace: React.FC<TypingWorkspaceProps> = ({
  text,
  setText,
  handleBackspace,
  isEnabled,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      const handled = handleBackspace();
      if (handled) {
        e.preventDefault();
      }
    }
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Đã sao chép!",
      description: "Đã lưu vào bộ nhớ tạm.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded text-white shadow-sm">
            <Keyboard className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold">Workspace</h2>
        </div>
        <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 gap-1.5 font-bold text-[9px]"
            onClick={copyToClipboard}
            disabled={!text}
        >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            SAO CHÉP
        </Button>
      </div>

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Gõ telex tại đây..." : "IME đang tắt..."}
          className="min-h-[180px] text-base p-4 bg-white border border-primary/10 focus-visible:border-primary transition-all shadow-inner resize-none leading-relaxed font-medium"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoFocus
        />
        <div className="absolute bottom-2 right-2 text-[9px] font-bold text-muted-foreground uppercase opacity-50">
            {text.length} ký tự
        </div>
      </div>

      {isEnabled && (
        <Alert className="bg-blue-50/50 border-blue-100 py-2">
          <Info className="h-3.5 w-3.5 text-blue-600" />
          <AlertDescription className="text-[10px] text-blue-700 font-medium pl-1">
            Gõ chuẩn i/y & gỡ dấu 3 bước chuẩn v2.1.6
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};