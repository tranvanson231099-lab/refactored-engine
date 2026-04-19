
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Power, Settings2, ExternalLink, CheckCircle2, MoreVertical, AlertTriangle, Settings } from 'lucide-react';
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
    <Card className="w-full shadow-md border-2 border-primary/20 overflow-hidden bg-white">
      <CardHeader className="bg-slate-100 py-2 px-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-white text-[9px] font-black">V</div>
          <CardTitle className="text-[10px] font-black uppercase tracking-tight">VietFlex Panel</CardTitle>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 font-medium">
            <div className="px-2 py-1 text-[10px] text-muted-foreground font-bold uppercase">Engine v2.1.6</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open('chrome://extensions', '_blank')}>
              <Settings className="mr-2 h-3.5 w-3.5" />
              <span className="text-xs">Quản lý tiện ích</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-3 space-y-3">
        {/* Hướng dẫn khẩn cấp - NỔI BẬT NHẤT */}
        <Alert variant="destructive" className="bg-red-50 border-red-500 border-2 py-3 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-[12px] font-black uppercase text-red-700 mb-1">CÁCH SỬA LỖI 100%</AlertTitle>
          <AlertDescription className="text-[10px] text-red-800 font-bold space-y-2">
            <p>Lỗi CSP và ERR_FILE_NOT_FOUND chỉ có 1 cách sửa duy nhất:</p>
            <div className="bg-white/90 p-2 rounded border border-red-200 text-slate-900 shadow-inner">
              1. Chạy lệnh: <code className="bg-slate-200 px-1 rounded">npm run build</code><br/>
              2. Mở Chrome Extensions, nhấn <b>Tải tiện ích đã giải nén</b>.<br/>
              3. <b>QUAN TRỌNG:</b> Đi vào thư mục vietflex, sau đó <b>CHỌN THƯ MỤC 'out'</b>.
            </div>
            <p className="italic text-[9px] text-red-600">Tuyệt đối không chọn thư mục gốc 'vietflex'!</p>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <div className="space-y-0.5">
              <Label className="text-[9px] font-bold text-muted-foreground uppercase">Bảng mã</Label>
              <div className="text-[10px] font-bold px-2 py-1 bg-slate-50 border rounded truncate">Unicode</div>
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] font-bold text-muted-foreground uppercase">Kiểu gõ</Label>
              <div className="text-[10px] font-bold px-2 py-1 bg-slate-50 border rounded">Telex</div>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-1.5">
            <Button 
                variant={isEnabled ? "destructive" : "default"} 
                className="h-7 text-[9px] font-bold uppercase gap-1"
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <Power className="w-3 h-3" /> {isEnabled ? "Tắt" : "Bật"}
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 pt-1.5 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="modern-style" 
                checked={isModernStyle} 
                onCheckedChange={(val) => setIsModernStyle(val === true)}
              />
              <label htmlFor="modern-style" className="text-[10px] font-bold cursor-pointer">Dấu kiểu mới (hòa)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smart-fix" 
                checked={isSmartFix} 
                onCheckedChange={(val) => setIsSmartFix(val === true)}
              />
              <label htmlFor="smart-fix" className="text-[10px] font-black cursor-pointer text-primary">Sửa lỗi i/y</label>
            </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-bold text-emerald-700">Telex Engine Sẵn sàng</span>
        </div>

        <div className="pt-1">
          <Button 
            variant="outline" 
            className="w-full h-8 gap-2 font-black text-[10px] uppercase border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => window.open('chrome://os-settings/osLanguages/input', '_blank')}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Kích hoạt hệ thống
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
