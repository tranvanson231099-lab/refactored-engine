
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Code, Terminal, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
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
          {isEnabled ? "HỆ THỐNG ON" : "IME OFF"}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tích hợp Chrome OS</Label>
            <p className="text-sm font-medium">{isEnabled ? "SẴN SÀNG TRONG SETTINGS" : "IME CHƯA KÍCH HOẠT"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Label className="text-[10px] font-bold uppercase text-blue-700 tracking-widest mb-1 block">Phương thức nhập</Label>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-800">VietFlex Telex (System)</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="modern-style" 
                checked={isModernStyle} 
                onCheckedChange={(val) => setIsModernStyle(val === true)}
                disabled={!isEnabled}
              />
              <label
                htmlFor="modern-style"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Dấu kiểu mới (hoà, quý)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smart-fix" 
                checked={isSmartFix} 
                onCheckedChange={(val) => setIsSmartFix(val === true)}
                disabled={!isEnabled}
              />
              <label
                htmlFor="smart-fix"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-primary font-bold"
              >
                Smart Fix: 5 quy tắc i/y
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full h-10 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 gap-2 font-bold text-[10px] uppercase">
                <Download className="w-4 h-4" />
                HƯỚNG DẪN CÀI ĐẶT
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  Kích hoạt Phương thức nhập
                </DialogTitle>
                <DialogDescription className="space-y-4 pt-4 text-sm text-foreground">
                  <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-xs font-bold uppercase">Lưu ý sửa lỗi EACCES</AlertTitle>
                    <AlertDescription className="text-[10px]">
                      Phải di chuyển thư mục vào <code>~/vietflex</code> (Linux Home) trước khi gõ <code>npm install</code>.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-3">
                    <p><b>Bước 1:</b> <code>cp -r /mnt/chromeos/MyFiles/Downloads/vietflex ~/vietflex</code></p>
                    <p><b>Bước 2:</b> <code>cd ~/vietflex && npm install</code></p>
                    <p><b>Bước 3:</b> <code>npm run build</code> (Lệnh này tạo thư mục <b>out</b>)</p>
                    <p><b>Bước 4:</b> Mở Chrome, vào <code>chrome://extensions</code>, bật <b>Developer Mode</b>.</p>
                    <p><b>Bước 5:</b> Nhấn <b>Load Unpacked</b> và chọn thư mục <b>out</b>.</p>
                    <p><b>Bước 6:</b> Vào Cài đặt Chrome OS &gt; Ngôn ngữ &gt; Thêm "VietFlex Telex".</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

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
          VietFlex Engine v2.1.6 • Zero Latency IME
        </p>
      </CardContent>
    </Card>
  );
};
