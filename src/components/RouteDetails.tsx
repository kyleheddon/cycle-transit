'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Route } from 'lucide-react';
import { ExternalMapsLink } from './ExternalMapsLink';
import { MixedRouteSteps } from './MixedRouteSteps';
import type { BikeRoute, MixedRoute, TravelMode } from '@/lib/types';

interface RouteDetailsProps {
  travelMode: TravelMode;
  bikeRoute?: BikeRoute;
  mixedRoute?: MixedRoute;
  origin: string;
  destination: string;
}

export function RouteDetails({ travelMode, bikeRoute, mixedRoute, origin, destination }: RouteDetailsProps) {
  if (travelMode === 'bike' && bikeRoute) {
    return (
      <Card className="m-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-4 w-4" />
            Bike Route
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {bikeRoute.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {bikeRoute.distance}
            </span>
            <span className="text-muted-foreground">
              Arrive by {bikeRoute.arrivalTime}
            </span>
          </div>
          <ExternalMapsLink origin={origin} destination={destination} travelMode="bicycling" />
        </CardContent>
      </Card>
    );
  }

  if (travelMode === 'mixed' && mixedRoute) {
    return (
      <Card className="m-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="h-4 w-4" />
            Bike + Train Route
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {mixedRoute.duration}
            </span>
            <span className="text-muted-foreground">
              Arrive by {mixedRoute.arrivalTime}
            </span>
          </div>
          <MixedRouteSteps mixedRoute={mixedRoute} />
        </CardContent>
      </Card>
    );
  }

  return null;
}
