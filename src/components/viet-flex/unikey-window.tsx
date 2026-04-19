
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, PackageCheck, AlertCircle, FolderSearch, AlertTriangle } from 'lucide-react';
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
    <Card className="w-80 shadow-2xl border-4 border-red-500 overflow-hidden bg-white animate-in zoom-in-95 duration-300">
      <CardHeader className="bg-red-600 py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
          <CardTitle className="text-sm font-black text-white uppercase tracking-tighter">FIX LỖI CÀI ĐẶT KHẨN CẤP</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="bg-red-50 border-2 border-red-200 p-3 rounded-lg">
          <p className="text-[11px] font-black text-red-700 uppercase mb-2">ĐANG BỊ LỖI "TỆP KÊ KHAI BỊ THIẾU"?</p>
          <ol className="text-[10px] space-y-2 font-bold text-red-600">
            <li>1. Mở Terminal chạy: <code className="bg-black text-white p-1 rounded">npm run build</code></li>
            <li>2. Vào <code className="text-blue-600 underline">chrome://extensions</code></li>
            <li>3. Nhấn <b>Load Unpacked</b></li>
            <li>4. <span className="bg-yellow-300 text-black px-1">CHỌN ĐÚNG THƯ MỤC "out"</span> (nằm bên trong thư mục vietflex)</li>
          </ol>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">VietFlex Engine</Label>
            <p className="text-[10px] font-bold text-emerald-600">{isEnabled ? "ACTIVE" : "STANDBY"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="modern-style" 
                checked={isModernStyle} 
                onCheckedChange={(val) => setIsModernStyle(val === true)}
              />
              <label htmlFor="modern-style" className="text-[11px] font-bold cursor-pointer">Dấu kiểu mới (hòa, thúy)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smart-fix" 
                checked={isSmartFix} 
                onCheckedChange={(val) => setIsSmartFix(val === true)}
              />
              <label htmlFor="smart-fix" className="text-[11px] font-black cursor-pointer text-primary">Smart Fix: i/y & Backspace</label>
            </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full h-12 gap-2 font-black text-xs uppercase shadow-lg animate-bounce">
              <FolderSearch className="w-5 h-5" />
              XEM VIDEO HƯỚNG DẪN FIX LỖI
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600 font-black uppercase text-xl flex items-center gap-2">
                <AlertCircle /> BƯỚC QUAN TRỌNG NHẤT
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 font-bold text-sm">
                  Bạn đang chọn thư mục "vietflex". Chrome sẽ báo lỗi ngay lập tức vì không thấy tệp manifest.json ở đó.
                </div>
                <div className="space-y-2 text-sm font-medium">
                  <p>1. Hãy chạy <code className="bg-slate-200 p-1">npm run build</code> trong Linux.</p>
                  <p>2. Khi chọn thư mục cài đặt, hãy tìm thư mục <b className="text-red-600 uppercase">out</b>.</p>
                  <p>3. Nhấn <b>Open/Select</b> khi đang ở trong thư mục <b>out</b> đó.</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-10 text-[10px] font-bold">
            <Settings2 className="w-4 h-4 mr-1" /> CÀI ĐẶT
          </Button>
          <Button 
            variant={isEnabled ? "destructive" : "default"} 
            size="sm" 
            className="flex-1 h-10 text-[10px] font-bold"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <Power className="w-4 h-4 mr-1" /> {isEnabled ? "TẮT" : "BẬT"}
          </Button>
        </div>
        
        <p className="text-[9px] text-center text-muted-foreground pt-1 font-bold italic">
          VietFlex Engine v2.1.6 • Chrome OS Flex Standard
        </p>
      </CardContent>
    </Card>
  );
};
