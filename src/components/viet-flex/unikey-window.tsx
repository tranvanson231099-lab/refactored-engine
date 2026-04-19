
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Power, Keyboard, Settings2, HelpCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface UnikeyWindowProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isModernStyle: boolean;
  setIsModernStyle: (enabled: boolean) => void;
  isSmartFix: boolean;
  setIsSmartFix: (enabled: boolean) => void;
  method: InputMethod;
  setMethod: (method: InputMethod) => void;
}

export const UnikeyWindow: React.FC<UnikeyWindowProps> = ({
  isEnabled,
  setIsEnabled,
  isModernStyle,
  setIsModernStyle,
  isSmartFix,
  setIsSmartFix,
  method,
  setMethod,
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
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trạng thái IME</Label>
            <p className="text-sm font-medium">{isEnabled ? "BỘ GÕ ĐANG CHẠY" : "CHẾ ĐỘ TIẾNG ANH"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kiểu gõ</Label>
          <Select 
            value={method} 
            onValueChange={(val) => setMethod(val as InputMethod)}
            disabled={!isEnabled}
          >
            <SelectTrigger className="w-full bg-secondary/30 border-none h-11">
              <SelectValue placeholder="Chọn kiểu gõ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Telex">Telex (Phổ biến)</SelectItem>
              <SelectItem value="VNI">VNI (Số)</SelectItem>
            </SelectContent>
          </Select>
          
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
                Bỏ dấu kiểu mới (hoà, thuỷ)
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
                Smart Fix: Tự sửa lỗi chính tả
              </label>
            </div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-emerald-800 font-bold leading-tight uppercase">
            {isEnabled ? "Engine 2.1.6 Siêu Tốc (Offline)" : "IME Đang Tắt"}
          </p>
        </div>

        <div className="pt-2 grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="h-14 flex flex-col gap-1 text-[10px] font-bold">
            <Settings2 className="w-4 h-4" />
            CÀI ĐẶT
          </Button>
          <Button variant="outline" size="sm" className="h-14 flex flex-col gap-1 text-[10px] font-bold">
            <HelpCircle className="w-4 h-4" />
            HƯỚNG DẪN
          </Button>
          <Button 
            variant={isEnabled ? "destructive" : "default"} 
            size="sm" 
            className="h-14 flex flex-col gap-1 text-[10px] font-bold"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <Power className="w-4 h-4" />
            {isEnabled ? "TẮT" : "BẬT"}
          </Button>
        </div>
        
        <p className="text-[10px] text-center text-muted-foreground pt-1 italic font-medium">
          VietFlex Engine v2.1.6 • Chrome OS Flex Optimized
        </p>
      </CardContent>
    </Card>
  );
};
