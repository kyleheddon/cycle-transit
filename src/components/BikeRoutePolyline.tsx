'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { BIKE_ROUTE_COLOR } from '@/lib/constants';
import { decodePolyline } from '@/lib/polyline';
import { logDebug, logError } from '@/lib/client-logger';
import type { BikeRoute } from '@/lib/types';

interface BikeRoutePolylineProps {
  route: BikeRoute;
}

export function BikeRoutePolyline({ route }: BikeRoutePolylineProps) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) {
      logDebug('BikeRoutePolyline: waiting for map and google.maps to load', {
        hasMap: !!map,
        hasGoogle: typeof google !== 'undefined',
        hasGoogleMaps: typeof google !== 'undefined' && !!google.maps
      });
      return;
    }

    try {
      logDebug('BikeRoutePolyline: rendering polyline');
      const path = decodePolyline(route.directions.routes[0].overview_polyline.points);
      logDebug('BikeRoutePolyline: decoded path length', { length: path.length });

      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      polylineRef.current = new google.maps.Polyline({
        path: path,
        strokeColor: BIKE_ROUTE_COLOR,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map,
      });

      logDebug('BikeRoutePolyline: polyline created successfully');
    } catch (error) {
      logError('BikeRoutePolyline: error creating polyline', error instanceof Error ? error : undefined);
    }

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map, route]);

  return null;
}
