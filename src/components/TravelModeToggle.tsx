'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bike, TrainFront } from 'lucide-react';
import type { TravelMode } from '@/lib/types';

interface TravelModeToggleProps {
  value: TravelMode;
  onChange: (mode: TravelMode) => void;
}

export function TravelModeToggle({ value, onChange }: TravelModeToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TravelMode)} className="ml-auto">
      <TabsList>
        <TabsTrigger value="bike" className="gap-1.5">
          <Bike className="h-4 w-4" />
          <span className="hidden sm:inline">Bike</span>
        </TabsTrigger>
        <TabsTrigger value="mixed" className="gap-1.5">
          <TrainFront className="h-4 w-4" />
          <span className="hidden sm:inline">Bike + Train</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
