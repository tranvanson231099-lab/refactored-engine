
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Power, ExternalLink, CheckCircle2, MoreVertical, AlertTriangle, Settings, Keyboard } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <Card className="w-full shadow-xl border-2 border-primary/20 overflow-hidden bg-white">
      <CardHeader className="bg-slate-100 py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Keyboard className="w-4 h-4" />
          </div>
          <CardTitle className="text-xs font-black uppercase tracking-tight">VietFlex Panel v2.1.6</CardTitle>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest border-b mb-1">Cài đặt hệ thống</div>
            <DropdownMenuItem onClick={() => window.open('chrome://extensions', '_blank')}>
              <Settings className="mr-2 h-4 w-4" />
              <span className="text-xs font-medium">Quản lý tiện ích</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Hướng dẫn khẩn cấp - NỔI BẬT NHẤT */}
        <Alert variant="destructive" className="bg-red-50 border-red-500 border-2 py-4 shadow-xl animate-pulse">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <AlertTitle className="text-[13px] font-black uppercase text-red-700 mb-2">CÁCH SỬA LỖI CSP 100%</AlertTitle>
          <AlertDescription className="text-[11px] text-red-800 font-bold space-y-3">
            <p>Nếu bạn thấy lỗi "Executing inline script violates...", hãy làm đúng 3 bước:</p>
            <div className="bg-white/95 p-3 rounded-lg border-2 border-red-200 text-slate-900 shadow-md space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                <span>Chạy lệnh: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">npm run build</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                <span>Mở Chrome Extensions, nhấn <b>Tải tiện ích đã giải nén</b>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                <span className="text-blue-700 font-black">CHỌN THƯ MỤC CON TÊN LÀ 'out'</span>
              </div>
            </div>
            <p className="italic text-[10px] text-center mt-2 text-red-600">Tuyệt đối không chọn thư mục gốc!</p>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bảng mã</Label>
              <div className="text-[11px] font-black px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-lg shadow-sm">Unicode</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kiểu gõ</Label>
              <div className="text-[11px] font-black px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-lg shadow-sm">Telex</div>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Button 
                variant={isEnabled ? "destructive" : "default"} 
                className="h-10 text-[10px] font-black uppercase gap-2 shadow-lg shadow-primary/10"
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <Power className="w-4 h-4" /> {isEnabled ? "Tắt bộ gõ" : "Bật bộ gõ"}
            </Button>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t">
            <div className="flex items-center space-x-3 p-1">
              <Checkbox 
                id="modern-style" 
                checked={isModernStyle} 
                onCheckedChange={(val) => setIsModernStyle(val === true)}
              />
              <label htmlFor="modern-style" className="text-[11px] font-bold cursor-pointer select-none">Dấu kiểu mới (hòa, thủa...)</label>
            </div>
            <div className="flex items-center space-x-3 p-1">
              <Checkbox 
                id="smart-fix" 
                checked={isSmartFix} 
                onCheckedChange={(val) => setIsSmartFix(val === true)}
              />
              <label htmlFor="smart-fix" className="text-[11px] font-black cursor-pointer text-primary select-none">Sửa lỗi i/y thông minh</label>
            </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Telex Engine Active</span>
        </div>

        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full h-10 gap-2 font-black text-[11px] uppercase border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
            onClick={() => window.open('chrome://os-settings/osLanguages/input', '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Kích hoạt hệ thống OS Flex
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
