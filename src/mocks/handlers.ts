import { http, HttpResponse } from 'msw';
import {
  mockAutocompleteResults,
  mockPlaceDetails,
  mockFindPlace,
  mockRouteResult,
  mockBikeDirections,
  mockTransitDirections,
  mockReverseGeocode,
} from './data/mock-responses';

export const handlers = [
  // Places autocomplete
  http.get('/api/places/autocomplete', ({ request }) => {
    const url = new URL(request.url);
    const input = url.searchParams.get('input') || '';

    // Filter predictions that match input
    const filtered = {
      ...mockAutocompleteResults,
      predictions: mockAutocompleteResults.predictions.filter((p) =>
        p.description.toLowerCase().includes(input.toLowerCase())
      ),
    };

    return HttpResponse.json(
      filtered.predictions.length > 0 ? filtered : mockAutocompleteResults
    );
  }),

  // Place details
  http.get('/api/places/details', ({ request }) => {
    const url = new URL(request.url);
    const placeId = url.searchParams.get('place_id') || '';

    const details = mockPlaceDetails[placeId];
    if (details) {
      return HttpResponse.json(details);
    }

    // Return first mock place as fallback
    return HttpResponse.json(Object.values(mockPlaceDetails)[0]);
  }),

  // Find place
  http.get('/api/places/find', () => {
    return HttpResponse.json(mockFindPlace);
  }),

  // Directions
  http.get('/api/directions', ({ request }) => {
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode');

    if (mode === 'transit') {
      return HttpResponse.json(mockTransitDirections);
    }
    return HttpResponse.json(mockBikeDirections);
  }),

  // Reverse geocode
  http.get('/api/geocode/reverse', () => {
    return HttpResponse.json(mockReverseGeocode);
  }),

  // Route calculation (combined)
  http.post('/api/route', () => {
    return HttpResponse.json(mockRouteResult);
  }),
];
