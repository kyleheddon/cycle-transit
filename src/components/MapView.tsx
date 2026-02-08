'use client';

import { Map } from '@vis.gl/react-google-maps';
import { ATLANTA_LOCATION, DEFAULT_ZOOM } from '@/lib/constants';
import { MapBoundsController } from './MapBoundsController';

interface MapViewProps {
  children?: React.ReactNode;
  bounds?: { north: number; south: number; east: number; west: number } | null;
}

export function MapView({ children, bounds }: MapViewProps) {
  return (
    <Map
      defaultCenter={ATLANTA_LOCATION}
      defaultZoom={DEFAULT_ZOOM}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapId="cycle-transit-map"
      className="w-full h-full"
    >
      <MapBoundsController bounds={bounds} />
      {children}
    </Map>
  );
}
