import { format, addSeconds } from 'date-fns';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const FIND_PLACE_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

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

async function findNearbyRailStation(location: string): Promise<PlaceInfo> {
  const searchInput = `MARTA rail station near ${location}`;

  const cacheKey = `station:${searchInput}`;
  const cached = getCached<PlaceInfo>(cacheKey);
  if (cached) return cached;

  const findParams = new URLSearchParams({
    input: searchInput,
    inputtype: 'textquery',
    key: API_KEY!,
    fields: 'place_id,name,formatted_address,geometry',
  });

  const findRes = await fetch(`${FIND_PLACE_URL}?${findParams}`);
  const findData = await findRes.json();

  if (!findData.candidates?.length) {
    throw new Error(`No MARTA station found near ${location}`);
  }

  const candidate = findData.candidates[0];

  // If geometry is already in the find result, use it
  if (candidate.geometry?.location) {
    const result: PlaceInfo = {
      placeId: candidate.place_id,
      name: candidate.name,
      address: candidate.formatted_address || '',
      location: candidate.geometry.location,
    };
    setQueryCache(cacheKey, result);
    return result;
  }

  // Otherwise get place details
  const detailParams = new URLSearchParams({
    place_id: candidate.place_id,
    key: API_KEY!,
    fields: 'place_id,name,formatted_address,geometry',
  });

  const detailRes = await fetch(`${PLACE_DETAILS_URL}?${detailParams}`);
  const detailData = await detailRes.json();
  const detail = detailData.result;

  const result: PlaceInfo = {
    placeId: detail.place_id,
    name: detail.name,
    address: detail.formatted_address || '',
    location: detail.geometry.location,
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

  // Step 2: Calculate bike legs in parallel
  const [firstBikeRoute, lastBikeRoute] = await Promise.all([
    makeBikeRoute(origin, originStation.name),
    makeBikeRoute(destinationStation.name, destination),
  ]);

  // Step 3: Get transit route with departure time based on first bike arrival
  const departureTime = Math.floor(Date.now() / 1000) + firstBikeRoute.durationSeconds;
  const transitRoute = await queryDirections(
    originStation.name,
    destinationStation.name,
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
