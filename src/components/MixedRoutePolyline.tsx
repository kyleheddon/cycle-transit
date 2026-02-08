'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { BIKE_ROUTE_COLOR } from '@/lib/constants';
import { decodePolyline } from '@/lib/polyline';
import { logDebug, logError } from '@/lib/client-logger';
import type { MixedRoute } from '@/lib/types';

interface MixedRoutePolylineProps {
  route: MixedRoute;
}

export function MixedRoutePolyline({ route }: MixedRoutePolylineProps) {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) {
      logDebug('MixedRoutePolyline: waiting for map and google.maps to load');
      return;
    }

    try {
      logDebug('MixedRoutePolyline: rendering polylines');

    // Clean up old polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    // First bike leg (blue)
    const firstBikePath = decodePolyline(
      route.firstBikeRoute.directions.routes[0].overview_polyline.points
    );

    polylinesRef.current.push(
      new google.maps.Polyline({
        path: firstBikePath,
        strokeColor: BIKE_ROUTE_COLOR,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map,
      })
    );

    // Transit legs (colored by line)
    const transitSteps = route.transitRoute.routes[0]?.legs[0]?.steps || [];
    for (const step of transitSteps) {
      if (step.travel_mode === 'TRANSIT') {
        const transitPath = decodePolyline(step.polyline.points);
        polylinesRef.current.push(
          new google.maps.Polyline({
            path: transitPath,
            strokeColor: step.transit_details?.line.color || '#D4A843',
            strokeOpacity: 0.9,
            strokeWeight: 7,
            map,
          })
        );
      }
    }

    // Last bike leg (blue)
    const lastBikePath = decodePolyline(
      route.lastBikeRoute.directions.routes[0].overview_polyline.points
    );

    polylinesRef.current.push(
      new google.maps.Polyline({
        path: lastBikePath,
        strokeColor: BIKE_ROUTE_COLOR,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map,
      })
    );

      logDebug('MixedRoutePolyline: created polylines', { count: polylinesRef.current.length });
    } catch (error) {
      logError('MixedRoutePolyline: error creating polylines', error instanceof Error ? error : undefined);
    }

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
    };
  }, [map, route]);

  return null;
}
