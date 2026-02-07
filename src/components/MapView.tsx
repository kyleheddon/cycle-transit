'use client';

import { Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { ATLANTA_LOCATION, DEFAULT_ZOOM } from '@/lib/constants';
import type { LatLng } from '@/lib/types';

interface MapViewProps {
  children?: React.ReactNode;
  bounds?: { north: number; south: number; east: number; west: number } | null;
}

export function MapView({ children, bounds }: MapViewProps) {
  const map = useMap();

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, bounds]);

  return (
    <Map
      defaultCenter={ATLANTA_LOCATION}
      defaultZoom={DEFAULT_ZOOM}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapId="cycle-transit-map"
      className="w-full h-full"
    >
      {children}
    </Map>
  );
}
