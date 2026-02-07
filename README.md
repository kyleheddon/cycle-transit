# Cycle Transit

Multi-modal transportation route planner for Atlanta. Combines cycling and MARTA train routes to find the fastest way to commute.

## How It Works

1. Enter origin and destination
2. The app calculates two routes in parallel:
   - **Bike only** - Direct cycling route
   - **Bike + Train** - Bike to nearest MARTA station, ride the train, bike from the destination station
3. Toggle between modes to compare times
4. Routes are displayed on the map with polylines (blue for bike, MARTA line colors for train)

## Setup

### Prerequisites

- Node.js 20+ (uses `.nvmrc` - run `nvm use`)
- Google Maps Platform API key

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select a project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
4. Create an API key
5. Restrict the key by HTTP referrer (for `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`)

### Install & Run

```bash
nvm use
npm install
cp .env.example .env.local
# Edit .env.local with your API key
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_MAPS_API_KEY` | Server-side API key for route calculations (never sent to browser) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side API key for map rendering (restrict by domain) |
| `NEXT_PUBLIC_USE_MOCKS` | Set to `true` to use mock data instead of real APIs |

### Mock Mode

Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local` to develop without using real API calls. MSW (Mock Service Worker) intercepts requests and returns realistic Atlanta data (Decatur to Lenox Square route).

## Tech Stack

- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS v4** + **shadcn/ui** for components
- **@vis.gl/react-google-maps** for map rendering
- **MSW** for offline development with mock data
- **date-fns** for time calculations

## Architecture

```
src/
  app/
    page.tsx              # Main app with state management
    layout.tsx            # Root layout
    api/
      directions/         # Proxy to Google Directions API
      places/             # Proxy to Google Places APIs
      geocode/            # Proxy to Google Geocoding API
      route/              # Combined bike + mixed route calculation
  components/
    MapView.tsx           # Google Map wrapper
    DirectionsPanel.tsx   # Origin/destination inputs
    LocationSearch.tsx    # Autocomplete location search
    RouteDetails.tsx      # Route info card
    BikeRoutePolyline.tsx # Blue bike route on map
    MixedRoutePolyline.tsx # Multi-segment route on map
  lib/
    route.ts              # Server-side route calculation logic
    api-client.ts         # Client-side API wrappers with caching
    types.ts              # TypeScript types
  mocks/
    handlers.ts           # MSW mock handlers
    data/                 # Mock response fixtures
```

### API Cost Management

Both client and server have caching to minimize Google API calls:
- **Server**: In-memory cache with TTL (2 min for directions, 10 min for autocomplete, 1 hour for place details/geocoding)
- **Client**: In-memory cache with TTL (prevents redundant requests)
- **Place Details**: Only requests `place_id,name,formatted_address,geometry` fields (reduces per-request cost)

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set environment variables: `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Deploy
