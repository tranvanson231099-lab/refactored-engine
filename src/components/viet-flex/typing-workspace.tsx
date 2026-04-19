
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { InputMethod } from '@/lib/vietnamese-ime';
import { MousePointer2, Zap, Info, Keyboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';

interface TypingWorkspaceProps {
  text: string;
  setText: (val: string) => void;
  rawSetText: (val: string) => void;
  method: InputMethod;
  isEnabled: boolean;
  isSmartFix: boolean;
}

export const TypingWorkspace: React.FC<TypingWorkspaceProps> = ({
  text,
  setText,
  method,
  isEnabled,
  isSmartFix,
}) => {
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
                  Engine 2.0 {isSmartFix ? "Smart Fix Active" : "Active"}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">VietFlex Engine • Sửa lỗi thời gian thực (Offline)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kiểu gõ</p>
                <p className="text-sm font-bold text-primary">{isEnabled ? method : "N/A"}</p>
            </div>
        </div>
      </div>

      {isSmartFix && isEnabled && (
        <Alert className="bg-blue-50 border-blue-200 animate-in slide-in-from-top-2 duration-300">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-xs font-bold text-blue-800 uppercase tracking-tighter">Smart Fix đang bật</AlertTitle>
          <AlertDescription className="text-[10px] text-blue-700 font-medium">
            VietFlex tự động đưa dấu về đúng vị trí (ví dụ: luýên &rarr; luyến) ngay khi bạn gõ. Hoạt động offline 100%.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative group">
        <Textarea
          placeholder={isEnabled ? "Nhập văn bản (Ví dụ: sonw -> sơn, luyeenj -> luyện, thuyeenf -> thuyền)..." : "IME đang tắt..."}
          className="min-h-[450px] text-xl p-8 bg-white border-2 border-primary/10 focus-visible:border-primary transition-all shadow-inner resize-none leading-relaxed font-medium"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
          Mẹo gõ siêu tốc (Engine 2.0)
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          - <b>Sơn/Hư</b>: Gõ <code>sonw</code>, <code>huw</code> (phím <code>w</code> thêm móc tức thì).<br />
          - <b>Sửa lỗi dấu</b>: Gõ dấu ở bất kỳ đâu, Engine sẽ tự đưa về đúng vị trí chuẩn Unicode.<br />
          - <b>Gõ lặp</b>: Gõ <code>ww</code> &rarr; w, <code>aa</code> &rarr; a để thoát chế độ tiếng Việt.<br />
          - <b>Phím thoát</b>: Gõ lại phím dấu cũ để xóa dấu (Ví dụ: <code>as</code> &rarr; á, gõ thêm <code>s</code> &rarr; a).
        </p>
      </div>
    </div>
  );
};
