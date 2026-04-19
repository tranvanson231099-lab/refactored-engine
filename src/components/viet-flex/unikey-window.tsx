
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Settings2, FolderSearch, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <CardTitle className="text-sm font-black text-white uppercase tracking-tighter">KHÔNG VÀO ĐƯỢC CÀI ĐẶT?</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="bg-red-50 border-2 border-red-200 p-3 rounded-lg">
          <p className="text-[11px] font-black text-red-700 uppercase mb-2">BƯỚC 1: KIỂM TRA EXTENSION</p>
          <p className="text-[10px] font-bold text-red-600 leading-tight">
            Nếu bạn thấy lỗi "Tệp kê khai bị thiếu", hãy chạy <code className="bg-black text-white px-1">npm run build</code> rồi chọn thư mục <code className="text-blue-600 underline">out</code>.
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
          <p className="text-[11px] font-black text-blue-700 uppercase mb-2">BƯỚC 2: KÍCH HOẠT HỆ THỐNG</p>
          <p className="text-[10px] font-bold text-blue-600 leading-tight mb-2">
            Copy dòng dưới dán vào trình duyệt để mở trang cài đặt ẩn:
          </p>
          <code className="text-[9px] bg-white p-1 border block break-all font-mono select-all">
            chrome://os-settings/osLanguages/input
          </code>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">VietFlex Engine</Label>
            <p className="text-[10px] font-bold text-emerald-600">{isEnabled ? "READY" : "OFF"}</p>
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
              <label htmlFor="smart-fix" className="text-[11px] font-black cursor-pointer text-primary">Sửa lỗi i/y & Backspace</label>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full h-10 gap-2 font-black text-xs uppercase shadow-lg">
                <FolderSearch className="w-4 h-4" />
                XỬ LÝ LỖI "TỆP KÊ KHAI"
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-red-600 font-black uppercase text-xl flex items-center gap-2">
                  <AlertTriangle /> CHỈ CHỌN THƯ MỤC "OUT"
                </DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 font-bold text-sm">
                    Lỗi này 100% là do bạn chọn cả thư mục dự án. Chrome chỉ tìm manifest.json ở trong thư mục build.
                  </div>
                  <div className="space-y-2 text-sm font-medium">
                    <p>1. Terminal: <code className="bg-slate-200 p-1">npm run build</code></p>
                    <p>2. Chrome Extensions &rarr; Load Unpacked.</p>
                    <p>3. <b>VÀO TRONG</b> thư mục vietflex, chọn thư mục <b>out</b>.</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="w-full h-10 gap-2 font-black text-xs uppercase border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => window.open('chrome://os-settings/osLanguages/input', '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            MỞ TRANG CÀI ĐẶT ẨN
          </Button>
        </div>

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
