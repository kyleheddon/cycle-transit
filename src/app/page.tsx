'use client';

import { useState, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapView } from '@/components/MapView';
import { DirectionsPanel } from '@/components/DirectionsPanel';
import { RouteDetails } from '@/components/RouteDetails';
import { BikeRoutePolyline } from '@/components/BikeRoutePolyline';
import { MixedRoutePolyline } from '@/components/MixedRoutePolyline';
import { MockProvider } from '@/components/MockProvider';
import { calculateRoute } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Place, BikeRoute, MixedRoute, TravelMode } from '@/lib/types';

export default function Home() {
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [travelMode, setTravelMode] = useState<TravelMode>('mixed');
  const [bikeRoute, setBikeRoute] = useState<BikeRoute | undefined>();
  const [mixedRoute, setMixedRoute] = useState<MixedRoute | undefined>();
  const [loading, setLoading] = useState(false);
  const [bounds, setBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  const fetchRoutes = useCallback(async (orig: Place, dest: Place) => {
    setLoading(true);
    setBikeRoute(undefined);
    setMixedRoute(undefined);

    try {
      const originStr = orig.location
        ? `${orig.location.lat},${orig.location.lng}`
        : orig.address || orig.name;
      const destStr = dest.location
        ? `${dest.location.lat},${dest.location.lng}`
        : dest.address || dest.name;

      const result = await calculateRoute(originStr, destStr);
      setBikeRoute(result.bikeRoute);
      setMixedRoute(result.mixedRoute);

      // Calculate bounds from routes
      const points: Array<{ lat: number; lng: number }> = [];
      if (orig.location) points.push(orig.location);
      if (dest.location) points.push(dest.location);

      if (points.length >= 2) {
        const lats = points.map((p) => p.lat);
        const lngs = points.map((p) => p.lng);
        setBounds({
          north: Math.max(...lats) + 0.01,
          south: Math.min(...lats) - 0.01,
          east: Math.max(...lngs) + 0.01,
          west: Math.min(...lngs) - 0.01,
        });
      }

      if (result.bikeError && result.mixedError) {
        toast.error('Could not find routes. Try different locations.');
      }
    } catch {
      toast.error('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectOrigin = useCallback(
    (place: Place) => {
      setOrigin(place);
      setOriginName(place.name);
      if (destination) fetchRoutes(place, destination);
    },
    [destination, fetchRoutes]
  );

  const handleSelectDestination = useCallback(
    (place: Place) => {
      setDestination(place);
      setDestinationName(place.name);
      if (origin) fetchRoutes(origin, place);
    },
    [origin, fetchRoutes]
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <MockProvider>
      <APIProvider apiKey={apiKey}>
        <div className="flex flex-col h-dvh">
          <DirectionsPanel
            origin={originName}
            destination={destinationName}
            travelMode={travelMode}
            onSelectOrigin={handleSelectOrigin}
            onSelectDestination={handleSelectDestination}
            onTravelModeChange={setTravelMode}
          />

          <div className="flex-1 relative">
            <MapView bounds={bounds}>
              {travelMode === 'bike' && bikeRoute && (
                <BikeRoutePolyline route={bikeRoute} />
              )}
              {travelMode === 'mixed' && mixedRoute && (
                <MixedRoutePolyline route={mixedRoute} />
              )}
            </MapView>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="flex items-center gap-2 bg-background rounded-lg px-4 py-2 shadow-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Calculating routes...</span>
                </div>
              </div>
            )}
          </div>

          <RouteDetails
            travelMode={travelMode}
            bikeRoute={bikeRoute}
            mixedRoute={mixedRoute}
            origin={originName}
            destination={destinationName}
          />
        </div>
      </APIProvider>
    </MockProvider>
  );
}
