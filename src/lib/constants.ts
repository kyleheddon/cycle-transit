export const ATLANTA_LOCATION = {
  lat: 33.7489954,
  lng: -84.3879824,
} as const;

export const TRAVEL_MODES = {
  BICYCLING: 'bicycling',
  TRANSIT: 'transit',
} as const;

export const TRANSIT_MODE_RAIL = 'rail';

// MARTA line colors (from Google Transit data)
export const MARTA_LINE_COLORS: Record<string, string> = {
  Red: '#CE242B',
  Gold: '#D4A843',
  Green: '#009B3A',
  Blue: '#0274B4',
};

export const BIKE_ROUTE_COLOR = '#0000FF';

export const DEFAULT_ZOOM = 12;

export const AUTOCOMPLETE_DEBOUNCE_MS = 250;

export const ERRORS = {
  SAME_STATIONS: 'Origin and destination stations are the same',
} as const;
