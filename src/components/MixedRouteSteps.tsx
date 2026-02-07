'use client';

import { Bike, TrainFront, ArrowRight } from 'lucide-react';
import type { MixedRoute } from '@/lib/types';

interface MixedRouteStepsProps {
  mixedRoute: MixedRoute;
}

export function MixedRouteSteps({ mixedRoute }: MixedRouteStepsProps) {
  const transitLeg = mixedRoute.transitRoute.routes[0]?.legs[0];
  const transitStep = transitLeg?.steps?.find((s) => s.travel_mode === 'TRANSIT');

  return (
    <div className="space-y-2 text-sm">
      {/* First bike leg */}
      <div className="flex items-center gap-2">
        <Bike className="h-4 w-4 text-blue-600 shrink-0" />
        <span>
          Bike to <span className="font-medium">{mixedRoute.originStation.name}</span>
        </span>
        <span className="text-muted-foreground ml-auto shrink-0">
          {mixedRoute.firstBikeRoute.duration} &middot; {mixedRoute.firstBikeRoute.distance}
        </span>
      </div>

      <ArrowRight className="h-3 w-3 text-muted-foreground ml-2" />

      {/* Transit leg */}
      <div className="flex items-center gap-2">
        <TrainFront
          className="h-4 w-4 shrink-0"
          style={{ color: transitStep?.transit_details?.line.color || '#D4A843' }}
        />
        <span>
          <span className="font-medium">
            {transitStep?.transit_details?.line.name || 'MARTA Rail'}
          </span>
          {' '}to <span className="font-medium">{mixedRoute.destinationStation.name}</span>
        </span>
        <span className="text-muted-foreground ml-auto shrink-0">
          {transitLeg?.duration.text}
          {transitStep?.transit_details && ` · ${transitStep.transit_details.num_stops} stops`}
        </span>
      </div>

      <ArrowRight className="h-3 w-3 text-muted-foreground ml-2" />

      {/* Last bike leg */}
      <div className="flex items-center gap-2">
        <Bike className="h-4 w-4 text-blue-600 shrink-0" />
        <span>
          Bike to destination
        </span>
        <span className="text-muted-foreground ml-auto shrink-0">
          {mixedRoute.lastBikeRoute.duration} &middot; {mixedRoute.lastBikeRoute.distance}
        </span>
      </div>
    </div>
  );
}
