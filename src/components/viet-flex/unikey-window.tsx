'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Terminal, PackageCheck, Download, AlertTriangle, Copy, ChevronRight, Key, Info } from 'lucide-react';
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
            <Button variant="outline" size="sm" className="w-full h-10 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 gap-2 font-bold text-[10px] uppercase animate-pulse">
              <Download className="w-4 h-4" />
              SỬA LỖI ĐÓNG GÓI / PEM KEY
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-tight">
                <AlertTriangle className="w-5 h-5" />
                XỬ LÝ LỖI KHOÁ CÁ NHÂN (PEM)
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4 text-sm text-foreground">
                <Alert variant="destructive" className="border-2 shadow-lg bg-red-600 text-white">
                  <Key className="h-5 w-5" />
                  <AlertTitle className="text-sm font-black uppercase">LỖI: KHOÁ CÁ NHÂN ĐÃ TỒN TẠI</AlertTitle>
                  <AlertDescription className="text-xs font-bold leading-relaxed">
                    Bạn thấy lỗi này vì tệp <b>out.pem</b> đã có sẵn. Trong bảng "Đóng gói tiện ích", bạn có 2 lựa chọn:
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-primary/30 rounded-lg">
                    <p className="font-bold text-sm mb-2 text-primary">LỰA CHỌN 1: Sử dụng lại khoá (Khuyên dùng)</p>
                    <p className="text-xs leading-relaxed">
                      Trong cửa sổ <b>Đóng gói tiện ích</b> (như ảnh bạn chụp):<br/>
                      1. Ô 1 (Thư mục gốc): Chọn thư mục <code>out</code>.<br/>
                      2. Ô 2 (Tệp khoá cá nhân): Nhấn <b>Duyệt qua</b> và chọn tệp <code>out.pem</code> nằm ở thư mục <code>~/vietflex</code>.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
                    <p className="font-bold text-sm mb-2 text-red-700">LỰA CHỌN 2: Xoá khoá cũ để tạo mới</p>
                    <p className="text-xs leading-relaxed mb-2">Chạy lệnh này trong Terminal để xoá tệp PEM cũ:</p>
                    <div className="bg-slate-900 p-2 rounded font-mono text-white text-[10px] flex justify-between items-center mb-2">
                      <code>rm ~/vietflex/out.pem</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCommand("rm ~/vietflex/out.pem")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-red-600 italic">* Lưu ý: Xoá khoá cũ sẽ làm thay đổi ID của Extension.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-emerald-700 flex items-center gap-2">
                      <Info className="w-4 h-4" /> 
                      MẸO: Dùng "Tải tiện ích đã giải nén"
                    </p>
                    <p className="text-[12px]">Để phát triển nhanh, bạn không cần "Đóng gói". Chỉ cần nhấn <b>Load Unpacked</b> và chọn thư mục <b>out</b> là đủ.</p>
                  </div>
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