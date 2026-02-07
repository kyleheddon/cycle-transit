export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  placeId: string;
  name: string;
  address: string;
  location?: LatLng;
}

export interface AutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface DirectionsRoute {
  routes: Array<{
    overview_polyline: { points: string };
    legs: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
      start_location: LatLng;
      end_location: LatLng;
      arrival_time?: { text: string; value: number };
      departure_time?: { text: string; value: number };
      steps: DirectionsStep[];
    }>;
  }>;
  status: string;
}

export interface DirectionsStep {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  html_instructions: string;
  polyline: { points: string };
  travel_mode: string;
  transit_details?: {
    arrival_stop: { name: string; location: LatLng };
    departure_stop: { name: string; location: LatLng };
    arrival_time: { text: string; value: number };
    departure_time: { text: string; value: number };
    line: {
      name: string;
      short_name: string;
      color: string;
      vehicle: { name: string; type: string };
    };
    num_stops: number;
  };
}

export interface BikeRoute {
  directions: DirectionsRoute;
  arrivalTime: string;
  duration: string;
  distance: string;
  durationSeconds: number;
}

export interface MixedRoute {
  firstBikeRoute: BikeRoute;
  transitRoute: DirectionsRoute;
  lastBikeRoute: BikeRoute;
  arrivalTime: string;
  duration: string;
  originStation: Place;
  destinationStation: Place;
}

export interface RouteResult {
  bikeRoute?: BikeRoute;
  mixedRoute?: MixedRoute;
  error?: string;
  bikeError?: string;
  mixedError?: string;
}

export type TravelMode = 'bike' | 'mixed';
