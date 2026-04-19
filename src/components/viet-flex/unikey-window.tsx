
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Power, Settings2, ExternalLink, Terminal, CheckCircle2, MoreVertical, Trash2, PinOff, ShieldCheck, Settings } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <Card className="w-80 shadow-2xl border-2 border-primary/20 overflow-hidden bg-white animate-in zoom-in-95 duration-300">
      <CardHeader className="bg-slate-100 py-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-[10px] font-black">V</div>
          <CardTitle className="text-xs font-black uppercase tracking-tight">Bảng Điều Khiển VietFlex</CardTitle>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-medium">
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-bold uppercase">VietFlex Engine 2.1.6</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Xóa khỏi Chrome</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PinOff className="mr-2 h-4 w-4" />
              <span>Bỏ ghim</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.open('chrome://extensions', '_blank')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Quản lý tiện ích</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Xem các quyền trên web</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Bảng mã</Label>
              <div className="text-xs font-bold p-2 bg-slate-50 border rounded truncate">Unicode</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Kiểu gõ</Label>
              <div className="text-xs font-bold p-2 bg-slate-50 border rounded">Telex 2.1.6</div>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Button variant="outline" className="h-8 text-[10px] font-bold uppercase gap-1">
                <Settings2 className="w-3 h-3" /> Tùy chọn
            </Button>
            <Button 
                variant={isEnabled ? "destructive" : "default"} 
                className="h-8 text-[10px] font-bold uppercase gap-1"
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <Power className="w-3 h-3" /> {isEnabled ? "Kết thúc" : "Bật lại"}
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
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

        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700">Hệ thống đã sẵn sàng gõ Telex</span>
        </div>

        <div className="space-y-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full h-10 gap-2 font-black text-xs uppercase border border-primary/20">
                <Terminal className="w-4 h-4 text-primary" />
                SỬA LỖI ĐÓNG GÓI / PEM KEY
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-primary font-black uppercase text-xl flex items-center gap-2">
                   HƯỚNG DẪN ĐÓNG GÓI CHUẨN
                </DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 font-bold text-sm">
                    Nếu gặp lỗi "Khoá cá nhân đã tồn tại", hãy làm theo các bước sau:
                  </div>
                  <div className="space-y-3 text-sm font-medium">
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">1</div>
                        <p>Tại ô <b>"Tệp khóa cá nhân"</b>, nhấn <b>Duyệt qua</b>.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">2</div>
                        <p>Chọn tệp <b>out.pem</b> nằm trong thư mục <b>vietflex</b>.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">3</div>
                        <p>Nhấn <b>Đóng gói tiện ích</b> để ghi đè phiên bản mới.</p>
                    </div>
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
            KÍCH HOẠT TRONG HỆ THỐNG
          </Button>
        </div>
        
        <div className="flex justify-center">
            <p className="text-[9px] text-muted-foreground font-bold italic">
              VietFlex Engine v2.1.6 Standard
            </p>
        </div>
      </CardContent>
    </Card>
  );
};
