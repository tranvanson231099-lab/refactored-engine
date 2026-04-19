import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputMethod } from '@/lib/vietnamese-ime';
import { Power, Keyboard, Settings2, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UnikeyWindowProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  method: InputMethod;
  setMethod: (method: InputMethod) => void;
}

export const UnikeyWindow: React.FC<UnikeyWindowProps> = ({
  isEnabled,
  setIsEnabled,
  method,
  setMethod,
}) => {
  return (
    <Card className="w-80 shadow-xl border-2 border-primary/20 overflow-hidden bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-primary py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-md">
            <Keyboard className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-sm font-bold text-white tracking-tight">VietFlex Input</CardTitle>
        </div>
        <Badge variant={isEnabled ? "default" : "secondary"} className={isEnabled ? "bg-accent text-white" : "bg-white/20 text-white"}>
          {isEnabled ? "ON" : "OFF"}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IME Status</Label>
            <p className="text-sm font-medium">{isEnabled ? "Vietnamese Active" : "English Mode"}</p>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-accent"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input Method</Label>
          <Select 
            value={method} 
            onValueChange={(val) => setMethod(val as InputMethod)}
            disabled={!isEnabled}
          >
            <SelectTrigger className="w-full bg-secondary/30 border-none h-11">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Telex">Telex (Standard)</SelectItem>
              <SelectItem value="VNI">VNI (Numeric)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="h-14 flex flex-col gap-1 text-[10px] font-bold">
            <Settings2 className="w-4 h-4" />
            OPTIONS
          </Button>
          <Button variant="outline" size="sm" className="h-14 flex flex-col gap-1 text-[10px] font-bold">
            <HelpCircle className="w-4 h-4" />
            GUIDE
          </Button>
          <Button 
            variant={isEnabled ? "destructive" : "default"} 
            size="sm" 
            className="h-14 flex flex-col gap-1 text-[10px] font-bold"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <Power className="w-4 h-4" />
            {isEnabled ? "CLOSE" : "START"}
          </Button>
        </div>
        
        <p className="text-[10px] text-center text-muted-foreground pt-1">
          VietFlex v1.0.2 • Optimized for Chrome OS Flex
        </p>
      </CardContent>
    </Card>
  );
};