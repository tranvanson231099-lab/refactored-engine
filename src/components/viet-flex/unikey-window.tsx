'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Power, Keyboard, Settings2, Monitor, Download } from 'lucide-react';
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
          {isEnabled ? "ON" : "OFF"}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trạng thái Engine</Label>
            <p className="text-sm font-medium">{isEnabled ? "BỘ GÕ SẴN SÀNG" : "IME ĐÃ TẮT"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-secondary/10 rounded-lg border border-primary/10">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1 block">Phương thức nhập</Label>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-primary/20 text-primary font-bold">TELEX (Mặc định)</Badge>
                <span className="text-[10px] text-muted-foreground italic">Chrome OS Flex Ready</span>
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
                Dấu kiểu mới (hoà, thuỷ)
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
                Smart Fix: Tự sửa lỗi i/y
              </label>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full h-10 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 gap-2">
              <Monitor className="w-4 h-4" />
              Cài vào Chrome OS Flex
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Hướng dẫn cài đặt VietFlex
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 text-sm text-foreground space-y-3">
                  <p><b>Bước 1:</b> Nhìn lên thanh địa chỉ (Address Bar) của trình duyệt Chrome.</p>
                  <p><b>Bước 2:</b> Nhấn vào biểu tượng <b>Cài đặt ứng dụng</b> (Install App) - hình máy tính có mũi tên xuống.</p>
                  <p><b>Bước 3:</b> Nhấn <b>Cài đặt</b>. VietFlex sẽ hoạt động như một App độc lập trên máy của bạn.</p>
                </div>
                <p className="text-xs italic text-muted-foreground">
                  * Sau khi cài đặt, bạn có thể ghim ứng dụng vào Shelf (Taskbar) để mở nhanh. Soạn thảo tại đây và Copy sang các ứng dụng khác.
                </p>
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
          VietFlex Engine v2.1.6 • Precision Orthography
        </p>
      </CardContent>
    </Card>
  );
};
