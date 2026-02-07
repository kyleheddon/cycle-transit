# Cycle Transit - Project Context

## What This App Does
A multi-modal transportation route planner for Atlanta, GA. Think Google Maps but optimized for combining cycling and MARTA train routes. The goal is to find the fastest route using bike + train, considering train schedules and biking time to/from stations.

## Owner Context
- Kyle lives in Decatur, GA (Willow Lane)
- Works at the Atlanta Salesforce office in Buckhead, next to the Lenox MARTA train station
- Commutes by bike + MARTA train
- Wants to optimize fastest route combining bike and train legs

## Tech Stack (Target - Modern)
- **Framework:** Next.js (App Router) with TypeScript
- **UI:** Tailwind CSS + shadcn/ui (modern Bootstrap equivalent)
- **Maps:** Google Maps API (supports bike routes, may include transit/MARTA data)
- **State:** React hooks, functional components
- **Mocking:** MSW (Mock Service Worker) for offline dev, easy toggle to real APIs
- **Package manager:** npm (or pnpm)

## Tech Stack (Legacy - Being Replaced)
- Razzle 3.0 (SSR build tool)
- React 16.9 with hooks
- Material-UI 4.5
- google-maps-react wrapper
- Express server with WebSocket for route calculation
- Moment.js for dates
- MapQuest API for reverse geocoding
- MARTA API (integrated but not fully used)

## APIs
- **Google Maps API:** Directions, Places Autocomplete, Place Details, Geocoding, Static Maps
  - Key env var: `GOOGLE_MAP_API_DEV_KEY`
  - Kyle has a GCP account (pro Google Gemini) - can get API keys from Google Cloud Console
- **MARTA API:** Real-time train arrivals (may no longer be needed if Google Maps covers transit)
  - Old endpoint: `http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals`
  - Key env var: `MARTA_API_KEY`
- **MapQuest API:** Reverse geocoding (can likely be replaced by Google Geocoding)
  - Key env var: `MAP_QUEST_API_KEY`

## API Keys Needed
- Google Maps Platform API key (from Google Cloud Console: console.cloud.google.com)
  - Enable: Maps JavaScript API, Directions API, Places API, Geocoding API
- MARTA API key may not be needed if Google Maps Transit covers MARTA schedules

## Code Style Preferences
- Functional style JavaScript/TypeScript
- Inspired by Bob Martin's Clean Code (pragmatic, not dogmatic)
- Prefer clean, readable code with good naming
- Small, focused functions
- Avoid over-engineering

## Development Setup
- MSW mocks for offline development
- Easy toggle between mock and real API (env var or similar)
- Modern package versions for security

## Key Locations (for testing/defaults)
- Home: Decatur, GA (Willow Lane) - near Decatur MARTA station
- Work: Salesforce Tower Buckhead, next to Lenox MARTA station
- Default map center: Atlanta (33.7489954, -84.3879824)

## Original App Architecture
- Server-side route calculation via WebSocket
- Parallel bike-only and mixed (bike+transit) route calculation
- Finds nearest MARTA stations to origin/destination
- Caches API responses to reduce costs
- Polyline visualization with transit line colors
