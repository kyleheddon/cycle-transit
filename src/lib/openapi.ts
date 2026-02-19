import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import {
  RouteRequestSchema,
  RouteResponseSchema,
  ErrorResponseSchema,
  AutocompleteRequestSchema,
  AutocompleteResponseSchema,
} from './api-schemas';

const registry = new OpenAPIRegistry();

// Register the /api/route endpoint
registry.registerPath({
  method: 'post',
  path: '/api/route',
  summary: 'Calculate bike and mixed-mode routes',
  description: 'Calculates two routes: a bike-only route and a combined bike + MARTA train route. Returns both for comparison.',
  tags: ['Routes'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RouteRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully calculated routes',
      content: {
        'application/json': {
          schema: RouteResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request parameters',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    500: {
      description: 'Server error during route calculation',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// Register the /api/places/autocomplete endpoint
registry.registerPath({
  method: 'get',
  path: '/api/places/autocomplete',
  summary: 'Autocomplete place search',
  description: 'Returns place suggestions based on user input, biased towards Atlanta area.',
  tags: ['Places'],
  request: {
    query: AutocompleteRequestSchema,
  },
  responses: {
    200: {
      description: 'Successfully retrieved autocomplete suggestions',
      content: {
        'application/json': {
          schema: AutocompleteResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing or invalid input parameter',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// Generate OpenAPI spec
const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Cycle Transit API',
    description: 'Multi-modal transportation route planner combining cycling and MARTA train routes for Atlanta, GA',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      description: 'Development server',
    },
  ],
});
