'use client';

import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';
import { BIKE_ROUTE_COLOR } from '@/lib/constants';
import { decodePolyline } from '@/lib/polyline';
import type { BikeRoute } from '@/lib/types';

interface BikeRoutePolylineProps {
  route: BikeRoute;
}

export function BikeRoutePolyline({ route }: BikeRoutePolylineProps) {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !coreLib) return;

    const path = decodePolyline(route.directions.routes[0].overview_polyline.points);
    const latLngPath = path.map((p) => new google.maps.LatLng(p.lat, p.lng));

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    polylineRef.current = new google.maps.Polyline({
      path: latLngPath,
      strokeColor: BIKE_ROUTE_COLOR,
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map,
    });

    return () => {
      polylineRef.current?.setMap(null);
    };
  }, [map, coreLib, route]);

  return null;
}
