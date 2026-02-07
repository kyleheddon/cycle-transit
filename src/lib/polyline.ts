import { decode } from '@googlemaps/polyline-codec';

export function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  return decode(encoded).map(([lat, lng]) => ({ lat, lng }));
}
