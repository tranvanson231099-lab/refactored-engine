'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Terminal, PackageCheck, Download, AlertTriangle, Copy, ChevronRight, Key, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

interface UnikeyWindowProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isModernStyle: boolean;
  setIsModernStyle: (enabled: boolean) => void;
  isSmartFix: boolean;
  setIsSmartFix: (enabled: boolean) => void;
}

export const UnikeyWindow: React.FC<UnikeyWindowProps> = ({
  isEnabled,
  setIsEnabled,
  isModernStyle,
  setIsModernStyle,
  isSmartFix,
  setIsSmartFix,
}) => {
  const { toast } = useToast();

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    toast({
      title: "Đã sao chép!",
      description: "Dán vào Terminal Linux để chạy.",
    });
  };

  return (
    <Card className="w-80 shadow-2xl border-2 border-primary/20 overflow-hidden bg-white">
      <CardHeader className="bg-primary py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-md">
            <Keyboard className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-sm font-bold text-white tracking-tight">VietFlex v2.1.6</CardTitle>
        </div>
        <Badge variant={isEnabled ? "default" : "secondary"} className={isEnabled ? "bg-accent text-white" : "bg-white/20 text-white"}>
          {isEnabled ? "IME READY" : "IME OFF"}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hệ thống IME</Label>
            <p className="text-[11px] font-bold text-emerald-600">{isEnabled ? "ĐANG CHẠY" : "CHỜ KÍCH HOẠT"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Label className="text-[10px] font-bold uppercase text-blue-700 tracking-widest mb-1 block">Tên thành phần</Label>
            <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-800">VietFlex System IME 2.1.6</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="modern-style" 
                checked={isModernStyle} 
                onCheckedChange={(val) => setIsModernStyle(val === true)}
              />
              <label htmlFor="modern-style" className="text-xs font-medium cursor-pointer">Dấu kiểu mới (hoà, quý)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smart-fix" 
                checked={isSmartFix} 
                onCheckedChange={(val) => setIsSmartFix(val === true)}
              />
              <label htmlFor="smart-fix" className="text-xs font-bold cursor-pointer text-primary">Smart Fix: i/y & Smart Backspace</label>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full h-10 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 gap-2 font-bold text-[10px] uppercase">
              <CheckCircle2 className="w-4 h-4" />
              HƯỚNG DẪN KÍCH HOẠT HỆ THỐNG
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-tight">
                <CheckCircle2 className="w-5 h-5" />
                KÍCH HOẠT BỘ GÕ HỆ THỐNG
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4 text-sm text-foreground">
                <p className="font-bold text-sm">Bạn đã đóng gói xong! Giờ hãy làm theo 3 bước cuối:</p>
                
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-slate-50 border-l-4 border-primary rounded-r-lg">
                    <p className="font-bold text-xs text-primary mb-2 uppercase">Bước 1: Tải tiện ích vào Chrome</p>
                    <p className="text-xs leading-relaxed">
                      1. Mở Chrome, vào <code>chrome://extensions</code>.<br/>
                      2. Bật <b>Developer Mode</b> (Chế độ nhà phát triển).<br/>
                      3. Nhấn <b>Load Unpacked</b> (Tải tiện ích đã giải nén).<br/>
                      4. Chọn đúng thư mục <b>out</b> nằm trong <code>~/vietflex</code>.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="font-bold text-xs text-blue-700 mb-2 uppercase">Bước 2: Thêm vào Phương thức nhập</p>
                    <p className="text-xs leading-relaxed">
                      1. Mở <b>Cài đặt Chrome OS</b> (Settings).<br/>
                      2. Chọn <b>Thiết bị (Device) &gt; Bàn phím (Keyboard)</b>.<br/>
                      3. Nhấn <b>Thay đổi phương thức nhập</b>.<br/>
                      4. Nhấn <b>Thêm phương thức nhập</b>, tìm và chọn <b>VietFlex Telex</b>.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                    <p className="font-bold text-xs text-emerald-700 mb-2 uppercase">Bước 3: Sử dụng</p>
                    <p className="text-xs leading-relaxed">
                      Nhấn <b>Ctrl + Space</b> để chuyển đổi giữa tiếng Anh và <b>VietFlex Telex</b>. Giờ bạn có thể gõ tiếng Việt ở bất cứ đâu!
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-[10px] text-red-600 italic">
                  * Lưu ý: Nếu gõ chưa ra tiếng Việt trong Word/Docs, hãy kiểm tra xem biểu tượng VietFlex ở khay hệ thống (góc dưới bên phải) đã được chọn chưa.
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-12 flex flex-col gap-1 text-[10px] font-bold">
            <Settings2 className="w-4 h-4" />
            CÀI ĐẶT
          </Button>
          <Button 
            variant={isEnabled ? "destructive" : "default"} 
            size="sm" 
            className="flex-1 h-12 flex flex-col gap-1 text-[10px] font-bold"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <Power className="w-4 h-4" />
            {isEnabled ? "TẮT" : "BẬT"}
          </Button>
        </div>
        
        <p className="text-[10px] text-center text-muted-foreground pt-1 italic font-medium">
          VietFlex Engine v2.1.6 • Built for Chrome OS
        </p>
      </CardContent>
    </Card>
  );
};