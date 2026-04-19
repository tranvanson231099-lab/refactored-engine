
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

        <div className="space-y-3">
          <div className="p-3 bg-secondary/20 rounded-lg flex items-center justify-between">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Kiểu gõ mặc định</Label>
            <Badge variant="outline" className="font-bold border-primary/20">TELEX</Badge>
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

        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-emerald-800 font-bold leading-tight uppercase">
            Engine 2.1.6 Ultra Fast (Offline)
          </p>
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
          VietFlex Engine v2.1.6 • Chrome OS Flex Optimized
        </p>
      </CardContent>
    </Card>
  );
};
