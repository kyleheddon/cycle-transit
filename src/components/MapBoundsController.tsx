'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface MapBoundsControllerProps {
  bounds?: { north: number; south: number; east: number; west: number } | null;
}

export function MapBoundsController({ bounds }: MapBoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, bounds]);

  return null;
}
