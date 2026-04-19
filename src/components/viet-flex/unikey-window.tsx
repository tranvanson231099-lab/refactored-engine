'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Terminal, PackageCheck, Download, AlertTriangle, Copy, ChevronRight, Key } from 'lucide-react';
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
              FIX LỖI CÀI ĐẶT / PEM KEY
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-tight">
                <AlertTriangle className="w-5 h-5" />
                HƯỚNG DẪN FIX LỖI ĐÓNG GÓI
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4 text-sm text-foreground">
                <Alert variant="destructive" className="border-2 shadow-lg bg-red-600 text-white">
                  <Key className="h-5 w-5" />
                  <AlertTitle className="text-sm font-black uppercase">LỖI: KHOÁ CÁ NHÂN ĐÃ TỒN TẠI</AlertTitle>
                  <AlertDescription className="text-xs font-bold leading-relaxed">
                    Bạn nhận được lỗi này vì tệp <b>out.pem</b> đã có sẵn. Hãy chạy lệnh dưới đây để xoá nó trước khi đóng gói lại.<br/><br/>
                    <div className="bg-white/20 p-2 rounded font-mono text-white text-[10px] flex justify-between items-center">
                      <code>rm ~/vietflex/out.pem</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCommand("rm ~/vietflex/out.pem")}>
                        <Copy className="h-3 h-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <p className="font-bold text-primary flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> 
                      BƯỚC 1: Build lại sạch sẽ
                    </p>
                    <div className="bg-slate-900 p-3 rounded-md font-mono text-[10px] text-emerald-400 relative">
                      <code>npm run build</code>
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-slate-400" onClick={() => copyCommand("npm run build")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-primary flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> 
                      BƯỚC 2: Tải vào Chrome (KHUYÊN DÙNG)
                    </p>
                    <div className="text-[12px] space-y-2 bg-slate-50 p-3 border-2 border-dashed border-primary/50 rounded-md">
                      <p>Thay vì <b>Pack Extension</b>, hãy dùng <b>Load Unpacked</b>:</p>
                      <p>1. Vào <code>chrome://extensions</code></p>
                      <p>2. Bật <b>Developer Mode</b>.</p>
                      <p>3. Nhấn <b>Load Unpacked</b>.</p>
                      <p className="text-red-600 font-black text-sm uppercase underline">4. CHỌN THƯ MỤC "OUT" TRONG ~/vietflex</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-primary flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> 
                      BƯỚC 3: Kích hoạt bộ gõ
                    </p>
                    <p className="text-[12px]">Vào <b>Cài đặt Chrome OS &gt; Ngôn ngữ &gt; Phương thức nhập</b>, nhấn <b>Thêm</b> và tìm <b>VietFlex Telex</b>.</p>
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