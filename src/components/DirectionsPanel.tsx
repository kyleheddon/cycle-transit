'use client';

import { LocationSearch } from './LocationSearch';
import { TravelModeToggle } from './TravelModeToggle';
import type { Place, TravelMode } from '@/lib/types';

interface DirectionsPanelProps {
  origin: string;
  destination: string;
  travelMode: TravelMode;
  onSelectOrigin: (place: Place) => void;
  onSelectDestination: (place: Place) => void;
  onTravelModeChange: (mode: TravelMode) => void;
}

export function DirectionsPanel({
  origin,
  destination,
  travelMode,
  onSelectOrigin,
  onSelectDestination,
  onTravelModeChange,
}: DirectionsPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-background border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Cycle Transit</h1>
        <TravelModeToggle value={travelMode} onChange={onTravelModeChange} />
      </div>
      <div className="flex flex-col gap-2">
        <LocationSearch
          label="From"
          value={origin}
          onSelect={onSelectOrigin}
          placeholder="Starting location..."
        />
        <LocationSearch
          label="To"
          value={destination}
          onSelect={onSelectDestination}
          placeholder="Destination..."
        />
      </div>
    </div>
  );
}
