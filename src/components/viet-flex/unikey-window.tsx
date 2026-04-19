
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, PackageCheck, AlertCircle, CheckCircle2, FolderSearch } from 'lucide-react';
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

        <Alert variant="destructive" className="bg-red-600 border-none py-3 animate-pulse shadow-lg">
          <AlertCircle className="h-5 w-5 text-white" />
          <AlertTitle className="text-xs font-black uppercase text-white">LỖI TỆP KÊ KHAI - XEM NGAY!</AlertTitle>
          <AlertDescription className="text-[10px] text-white font-bold leading-tight">
            Bạn PHẢI chọn thư mục <span className="underline text-yellow-300">"out"</span> khi Load Unpacked. Nếu chọn thư mục "vietflex" sẽ báo lỗi ngay lập tức.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Label className="text-[10px] font-bold uppercase text-blue-700 tracking-widest mb-1 block">Thành phần chuẩn</Label>
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
            <Button variant="outline" size="sm" className="w-full h-12 border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 gap-2 font-black text-xs uppercase shadow-md border-2">
              <FolderSearch className="w-5 h-5" />
              CÁCH SỬA LỖI TỆP KÊ KHAI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600 font-black uppercase tracking-tight text-xl">
                <AlertCircle className="w-6 h-6" />
                DỪNG LẠI! ĐỌC KỸ BƯỚC NÀY
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4 text-sm text-foreground">
                <div className="p-4 bg-red-600 text-white rounded-xl shadow-inner font-bold">
                   Lỗi "Tệp kê khai bị thiếu" là do bạn đang chọn nhầm thư mục "vietflex".
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-slate-100 border-l-8 border-slate-800 rounded-r-lg">
                    <p className="font-black text-xs text-slate-800 mb-2 uppercase italic">Bước 1: Chạy lệnh đóng gói</p>
                    <p className="text-sm leading-relaxed">
                      Mở Terminal Linux, copy và chạy: <br/>
                      <code className="bg-black text-emerald-400 p-2 rounded block mt-2 text-xs">npm run build</code>
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 border-l-8 border-emerald-500 rounded-r-lg">
                    <p className="font-black text-xs text-emerald-700 mb-2 uppercase italic">Bước 2: Chọn ĐÚNG thư mục</p>
                    <p className="text-sm leading-relaxed">
                      1. Vào <code className="font-bold">chrome://extensions</code>.<br/>
                      2. Nhấn <b>Load Unpacked</b>.<br/>
                      3. <b>QUAN TRỌNG NHẤT:</b> Tìm vào thư mục <code className="font-bold">vietflex</code>, sau đó chọn thư mục con tên là <code className="bg-yellow-200 px-1 font-black">out</code>.
                    </p>
                    <p className="mt-2 text-xs text-red-600 font-bold underline">
                      Tệp manifest.json nằm trong thư mục "out" này!
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
