import type { Place } from './types';

const STORAGE_KEY = 'cycle-transit-location-history';
const MAX_HISTORY = 5;

export interface HistoryItem {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  timestamp: number;
}

function isValidLocation(loc: unknown): loc is { lat: number; lng: number } {
  return (
    typeof loc === 'object' &&
    loc !== null &&
    typeof (loc as any).lat === 'number' &&
    typeof (loc as any).lng === 'number' &&
    !isNaN((loc as any).lat) &&
    !isNaN((loc as any).lng)
  );
}

export function getLocationHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored) as HistoryItem[];
    // Filter out entries with invalid locations
    const valid = history.filter(item => isValidLocation(item.location));
    // Clean up storage if we filtered anything
    if (valid.length !== history.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid.sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

export function addToLocationHistory(place: Place): void {
  if (typeof window === 'undefined') return;
  // Don't store entries without valid coordinates
  if (!isValidLocation(place.location)) return;

  try {
    const history = getLocationHistory();

    // Remove if already exists
    const filtered = history.filter(item => item.placeId !== place.placeId);

    // Add to front
    const newItem: HistoryItem = {
      placeId: place.placeId,
      name: place.name,
      address: place.address,
      location: place.location!,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

export function clearLocationHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
