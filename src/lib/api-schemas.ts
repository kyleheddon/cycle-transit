import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Base schemas
export const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).openapi('LatLng');

export const PlaceSchema = z.object({
  placeId: z.string(),
  name: z.string(),
  address: z.string(),
  location: LatLngSchema.optional(),
}).openapi('Place');

export const DirectionsStepSchema = z.object({
  distance: z.object({
    text: z.string(),
    value: z.number(),
  }),
  duration: z.object({
    text: z.string(),
    value: z.number(),
  }),
  html_instructions: z.string(),
  polyline: z.object({
    points: z.string(),
  }),
  travel_mode: z.string(),
  transit_details: z.object({
    arrival_stop: z.object({
      name: z.string(),
      location: LatLngSchema,
    }),
    departure_stop: z.object({
      name: z.string(),
      location: LatLngSchema,
    }),
    arrival_time: z.object({
      text: z.string(),
      value: z.number(),
    }),
    departure_time: z.object({
      text: z.string(),
      value: z.number(),
    }),
    line: z.object({
      name: z.string(),
      short_name: z.string(),
      color: z.string(),
      vehicle: z.object({
        name: z.string(),
        type: z.string(),
      }),
    }),
    num_stops: z.number(),
  }).optional(),
}).openapi('DirectionsStep');

export const DirectionsRouteSchema = z.object({
  routes: z.array(
    z.object({
      overview_polyline: z.object({
        points: z.string(),
      }),
      legs: z.array(
        z.object({
          distance: z.object({
            text: z.string(),
            value: z.number(),
          }),
          duration: z.object({
            text: z.string(),
            value: z.number(),
          }),
          start_address: z.string(),
          end_address: z.string(),
          start_location: LatLngSchema,
          end_location: LatLngSchema,
          arrival_time: z.object({
            text: z.string(),
            value: z.number(),
          }).optional(),
          departure_time: z.object({
            text: z.string(),
            value: z.number(),
          }).optional(),
          steps: z.array(DirectionsStepSchema),
        })
      ),
    })
  ),
  status: z.string(),
}).openapi('DirectionsRoute');

export const BikeRouteSchema = z.object({
  directions: DirectionsRouteSchema,
  arrivalTime: z.string(),
  duration: z.string(),
  distance: z.string(),
  durationSeconds: z.number(),
}).openapi('BikeRoute');

export const MixedRouteSchema = z.object({
  firstBikeRoute: BikeRouteSchema,
  transitRoute: DirectionsRouteSchema,
  lastBikeRoute: BikeRouteSchema,
  arrivalTime: z.string(),
  duration: z.string(),
  originStation: PlaceSchema,
  destinationStation: PlaceSchema,
}).openapi('MixedRoute');

// API Request/Response schemas
export const RouteRequestSchema = z.object({
  origin: z.string().min(1).describe('Origin location (address or place name)'),
  destination: z.string().min(1).describe('Destination location (address or place name)'),
}).openapi('RouteRequest', {
  example: {
    origin: 'Decatur, GA',
    destination: 'Lenox Square, Atlanta, GA',
  },
});

export const RouteResponseSchema = z.object({
  bikeRoute: BikeRouteSchema.optional().describe('Direct bike-only route'),
  mixedRoute: MixedRouteSchema.optional().describe('Combined bike + MARTA train route'),
  error: z.string().optional().describe('General error message'),
  bikeError: z.string().optional().describe('Error calculating bike route'),
  mixedError: z.string().optional().describe('Error calculating mixed route'),
}).openapi('RouteResponse');

export const ErrorResponseSchema = z.object({
  error: z.string(),
}).openapi('ErrorResponse');

// Places Autocomplete schemas
export const AutocompleteRequestSchema = z.object({
  input: z.string().min(1).describe('Search query for place autocomplete'),
}).openapi('AutocompleteRequest', {
  example: {
    input: 'Decatur',
  },
});

export const AutocompletePredictionSchema = z.object({
  place_id: z.string(),
  description: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string(),
  }),
}).openapi('AutocompletePrediction');

export const AutocompleteResponseSchema = z.object({
  predictions: z.array(AutocompletePredictionSchema),
}).openapi('AutocompleteResponse');

// Type inference
export type RouteRequest = z.infer<typeof RouteRequestSchema>;
export type RouteResponse = z.infer<typeof RouteResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type AutocompleteRequest = z.infer<typeof AutocompleteRequestSchema>;
export type AutocompleteResponse = z.infer<typeof AutocompleteResponseSchema>;
