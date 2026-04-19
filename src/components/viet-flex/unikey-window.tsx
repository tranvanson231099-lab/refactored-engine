
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Terminal, PackageCheck, Download, AlertTriangle, Copy, ChevronRight, Key, Info, CheckCircle2, AlertCircle } from 'lucide-react';
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

        <Alert variant="destructive" className="bg-red-50 border-red-200 py-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-[10px] font-bold uppercase text-red-800">Lưu ý quan trọng!</AlertTitle>
          <AlertDescription className="text-[9px] text-red-700 leading-tight">
            Khi cài đặt, bạn <b>PHẢI CHỌN THƯ MỤC "OUT"</b>. Nếu chọn thư mục "vietflex" sẽ bị báo lỗi thiếu tệp kê khai.
          </AlertDescription>
        </Alert>

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
                <p className="font-bold text-sm text-red-600">SỬA LỖI "TỆP KÊ KHAI BỊ THIẾU":</p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium">
                   Lỗi này xảy ra vì bạn đang chọn thư mục <code>vietflex</code>. Hãy thực hiện <code>npm run build</code> rồi chọn thư mục <code>out</code> bên trong đó.
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-slate-50 border-l-4 border-primary rounded-r-lg">
                    <p className="font-bold text-xs text-primary mb-2 uppercase">Bước 1: Chạy Build</p>
                    <p className="text-xs leading-relaxed">
                      Trong Terminal Linux, gõ lệnh: <br/>
                      <code>npm run build</code>
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="font-bold text-xs text-blue-700 mb-2 uppercase">Bước 2: Tải vào Chrome</p>
                    <p className="text-xs leading-relaxed">
                      1. Vào <code>chrome://extensions</code>.<br/>
                      2. Bật <b>Developer Mode</b>.<br/>
                      3. Nhấn <b>Load Unpacked</b>.<br/>
                      4. <b>QUAN TRỌNG:</b> Chọn thư mục <b>out</b> (không phải vietflex).
                    </p>
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
