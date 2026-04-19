'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MousePointer2, Zap, Info, Keyboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';

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
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      const handled = handleBackspace();
      if (handled) {
        e.preventDefault();
      }
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
              <h2 className="text-lg font-bold">Workspace Siêu Tốc</h2>
              {isEnabled && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 flex items-center">
                  <Zap className="w-3 h-3 fill-emerald-500" />
                  Engine 2.1.6 Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">VietFlex Engine • Telex Only (Chrome OS Flex)</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phương thức</p>
            <p className="text-sm font-bold text-primary">{isEnabled ? "TELEX" : "OFF"}</p>
        </div>
      </div>

      {isEnabled && (
        <Alert className="bg-blue-50 border-blue-200 animate-in slide-in-from-top-2 duration-300">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-xs font-bold text-blue-800 uppercase tracking-tighter">Cơ chế xóa dấu 3 bước</AlertTitle>
          <AlertDescription className="text-[10px] text-blue-700 font-medium">
            Backspace gỡ dấu thanh &rarr; gỡ dấu phụ (móc) &rarr; xóa chữ. Tự động chuẩn hóa i/y và dấu câu sát chữ.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản (Ví dụ: luyen -> luyện, chữa, lí)..." : "IME đang tắt..."}
          className="min-h-[450px] text-xl p-8 bg-white border-2 border-primary/10 focus-visible:border-primary transition-all shadow-inner resize-none leading-relaxed font-medium"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoFocus
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-muted-foreground">
            <Keyboard className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
                {text.length} ký tự
            </span>
        </div>
      </div>
      
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Quy tắc Engine 2.1.6
        </h3>
        <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
          <p>- <b>Smart i/y</b>: Tự động dùng `i` sau phụ âm (`lí, kĩ`) và `y` sau `u` (`quy, quý`).</p>
          <p>- <b>Xóa dấu 3 bước</b>: Gỡ dấu thanh &rarr; gỡ móc &rarr; xóa chữ. Hoàn hảo để sửa lỗi nhanh.</p>
          <p>- <b>Chuẩn chính tả</b>: Đặt dấu chuẩn nguyên âm chính cho cụm `ia, iê, ua, uô, ươ`.</p>
        </div>
      </div>
    </div>
  );
};
