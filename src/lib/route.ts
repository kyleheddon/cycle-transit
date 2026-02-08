import { format, addSeconds } from 'date-fns';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';

// Server-side cache for route sub-queries (reduces Google API calls)
const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getCached<T>(key: string): T | null {
  const entry = queryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  queryCache.delete(key);
  return null;
}

function setQueryCache(key: string, data: unknown) {
  queryCache.set(key, { data, timestamp: Date.now() });
}

interface DirectionsResponse {
  routes: Array<{
    overview_polyline: { points: string };
    legs: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      start_address: string;
      end_address: string;
      start_location: { lat: number; lng: number };
      end_location: { lat: number; lng: number };
      arrival_time?: { text: string; value: number };
      departure_time?: { text: string; value: number };
      steps: Array<{
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        html_instructions: string;
        polyline: { points: string };
        travel_mode: string;
        transit_details?: {
          arrival_stop: { name: string; location: { lat: number; lng: number } };
          departure_stop: { name: string; location: { lat: number; lng: number } };
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
      }>;
    }>;
  }>;
  status: string;
}

interface PlaceInfo {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
}

async function queryDirections(
  origin: string,
  destination: string,
  mode: string,
  extraParams: Record<string, string> = {}
): Promise<DirectionsResponse> {
  const cacheKey = `dir:${origin}:${destination}:${mode}:${JSON.stringify(extraParams)}`;
  const cached = getCached<DirectionsResponse>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    origin,
    destination,
    mode,
    key: API_KEY!,
    ...extraParams,
  });

  const res = await fetch(`${DIRECTIONS_URL}?${params}`);
  const data = await res.json();
  setQueryCache(cacheKey, data);
  return data;
}

function parseCoordinates(location: string): { lat: number; lng: number } | null {
  const parts = location.split(',');
  if (parts.length === 2) {
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

async function findNearbyRailStation(location: string): Promise<PlaceInfo> {
  const cacheKey = `station:${location}`;
  const cached = getCached<PlaceInfo>(cacheKey);
  if (cached) return cached;

  // If location is coordinates, use them as bias center with a simple query
  // Otherwise, include the location name in the query text
  const coords = parseCoordinates(location);
  const textQuery = coords ? 'MARTA train station' : `MARTA train station near ${location}`;
  const biasCenter = coords
    ? { latitude: coords.lat, longitude: coords.lng }
    : { latitude: 33.7489954, longitude: -84.3879824 };

  console.log('Finding MARTA station:', { location, textQuery, biasCenter });

  const findRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify({
      textQuery,
      includedType: 'subway_station',
      locationBias: {
        circle: {
          center: biasCenter,
          radius: 5000.0,
        },
      },
      rankPreference: 'DISTANCE',
    }),
  });

  if (!findRes.ok) {
    const errorText = await findRes.text();
    throw new Error(`Failed to search for MARTA station: ${findRes.status} ${errorText}`);
  }

  const findData = await findRes.json();

  if (!findData.places?.length) {
    throw new Error(`No MARTA station found near ${location}`);
  }

  const place = findData.places[0];
  console.log('Found MARTA station:', {
    name: place.displayName?.text,
    location: place.location,
    forInput: location,
  });

  const result: PlaceInfo = {
    placeId: place.id?.replace('places/', '') || '',
    name: place.displayName?.text || '',
    address: place.formattedAddress || '',
    location: place.location ? {
      lat: place.location.latitude,
      lng: place.location.longitude,
    } : { lat: 0, lng: 0 },
  };

  setQueryCache(cacheKey, result);
  return result;
}

interface BikeRouteResult {
  directions: DirectionsResponse;
  arrivalTime: string;
  duration: string;
  distance: string;
  durationSeconds: number;
}

interface MixedRouteResult {
  firstBikeRoute: BikeRouteResult;
  transitRoute: DirectionsResponse;
  lastBikeRoute: BikeRouteResult;
  arrivalTime: string;
  duration: string;
  originStation: PlaceInfo;
  destinationStation: PlaceInfo;
}

async function makeBikeRoute(origin: string, destination: string): Promise<BikeRouteResult> {
  const directions = await queryDirections(origin, destination, 'bicycling');

  if (directions.status !== 'OK' || !directions.routes.length) {
    throw new Error(`No bike route found: ${directions.status}`);
  }

  const leg = directions.routes[0].legs[0];
  const arrivalTime = format(addSeconds(new Date(), leg.duration.value), 'h:mm a');

  return {
    directions,
    arrivalTime,
    duration: leg.duration.text,
    distance: leg.distance.text,
    durationSeconds: leg.duration.value,
  };
}

async function makeMixedRoute(origin: string, destination: string): Promise<MixedRouteResult> {
  // Step 1: Find nearest MARTA stations in parallel
  const [originStation, destinationStation] = await Promise.all([
    findNearbyRailStation(origin),
    findNearbyRailStation(destination),
  ]);

  // Check stations are different
  if (originStation.placeId === destinationStation.placeId) {
    throw new Error('Origin and destination stations are the same');
  }

  // Use coordinates for bike routing (unambiguous) and addresses for transit
  const originStationCoords = `${originStation.location.lat},${originStation.location.lng}`;
  const destStationCoords = `${destinationStation.location.lat},${destinationStation.location.lng}`;

  // Step 2: Calculate bike legs in parallel
  const [firstBikeRoute, lastBikeRoute] = await Promise.all([
    makeBikeRoute(origin, originStationCoords),
    makeBikeRoute(destStationCoords, destination),
  ]);

  // Step 3: Get transit route with departure time based on first bike arrival
  const departureTime = Math.floor(Date.now() / 1000) + firstBikeRoute.durationSeconds;
  const transitRoute = await queryDirections(
    originStationCoords,
    destStationCoords,
    'transit',
    {
      transit_mode: 'rail',
      departure_time: departureTime.toString(),
    }
  );

  if (transitRoute.status !== 'OK' || !transitRoute.routes.length) {
    throw new Error(`No transit route found: ${transitRoute.status}`);
  }

  // Step 4: Calculate final arrival time
  const transitLeg = transitRoute.routes[0].legs[0];
  const transitArrivalUnix = transitLeg.arrival_time?.value ?? (departureTime + transitLeg.duration.value);
  const finalArrivalUnix = transitArrivalUnix + lastBikeRoute.durationSeconds;
  const arrivalTime = format(new Date(finalArrivalUnix * 1000), 'h:mm a');

  // Calculate total duration
  const totalSeconds = finalArrivalUnix - Math.floor(Date.now() / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);
  const duration = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  return {
    firstBikeRoute,
    transitRoute,
    lastBikeRoute,
    arrivalTime,
    duration,
    originStation,
    destinationStation,
  };
}

export async function calculateRoutes(origin: string, destination: string) {
  const [bikeResult, mixedResult] = await Promise.allSettled([
    makeBikeRoute(origin, destination),
    makeMixedRoute(origin, destination),
  ]);

  return {
    bikeRoute: bikeResult.status === 'fulfilled' ? bikeResult.value : undefined,
    mixedRoute: mixedResult.status === 'fulfilled' ? mixedResult.value : undefined,
    bikeError: bikeResult.status === 'rejected' ? bikeResult.reason?.message : undefined,
    mixedError: mixedResult.status === 'rejected' ? mixedResult.reason?.message : undefined,
  };
}
