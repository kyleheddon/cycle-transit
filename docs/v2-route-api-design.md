# V2 Route API Design

## Overview
V2 returns multiple mixed-mode route options optimized for different criteria:
- **Shortest bike distance** (minimize cycling effort)
- **Fastest total time** (minimize door-to-door time)

Note: Transfer wait times are already factored into Google Maps transit routing when using `departure_time`, so we don't need a separate "no transfer" strategy.

## Algorithm

### Phase 1: Multi-Station Discovery
```
1. Find N nearest MARTA stations to origin (N = 3-4)
2. Find N nearest MARTA stations to destination (N = 3-4)
3. Enrich station data with MARTA line info (Red, Gold, Blue, Green)
```

**API Cost**: 2 Places API calls (batch requests)

### Phase 2: Smart Route Selection

Instead of calculating all N×N combinations (9-16 routes), intelligently select combinations:

```typescript
// Strategy 1: Shortest Bike Distance
route1 = closestOriginStation + closestDestStation

// Strategy 2: Fastest Total Time
// Calculate multiple combinations and pick best by estimated total time
candidates = []
for originStation in top_N_origin:
  for destStation in top_N_dest:
    if (originStation.id == destStation.id):
      continue  // Skip same station

    // Estimate: bike distance to origin + straight-line transit + bike distance from dest
    estimatedBikeTime = bikeDistance(origin, originStation) + bikeDistance(destStation, dest)
    estimatedTransitTime = straightLineDistance(originStation, destStation) / avgTrainSpeed
    estimatedTotal = estimatedBikeTime + estimatedTransitTime

    candidates.push({ originStation, destStation, estimatedTotal })

// Sort by estimated time, take top 3-4 unique combinations
// (Make sure shortest_bike route is included if not in top candidates)
sort candidates by estimatedTotal
selectedRoutes = dedup(top_3_or_4_candidates + shortest_bike_if_missing)
```

This approach:
- Always includes the shortest bike option (for users who want minimal cycling)
- Finds 3-4 alternative station pairs that might be faster overall
- Google Maps handles all the transit complexity (transfers, wait times, schedules)

### Phase 3: Calculate Selected Routes
```
For each selected station pair:
  1. Calculate bike route: origin → originStation
  2. Calculate transit: originStation → destStation (with departure_time)
  3. Calculate bike route: destStation → destination

Return array of MixedRoute objects with metadata
```

**API Cost**: ~3-5 mixed routes × 3 calls = 9-15 Directions API calls

### Total API Cost Comparison
- **V1**: 4 calls per request
- **V2**: ~12-17 calls per request (3-4× increase)
- **Mitigation**: Aggressive caching (5 min TTL), station coordinates cached longer

## Response Schema

```typescript
interface RouteResponseV2 {
  bikeRoute?: BikeRoute;

  mixedRoutes: Array<{
    // Route details (same as V1 MixedRoute)
    firstBikeRoute: BikeRoute;
    transitRoute: DirectionsRoute;
    lastBikeRoute: BikeRoute;
    originStation: Place;
    destinationStation: Place;

    // New metadata
    strategy: 'shortest_bike' | 'fastest_total' | 'alternative';
    totalDurationSeconds: number;
    totalDuration: string;  // "32 min"
    arrivalTime: string;    // "9:45 AM"

    // Breakdown for comparison
    bikeDurationSeconds: number;   // Sum of both bike legs
    transitDurationSeconds: number;
    transferCount: number;          // 0, 1, 2... (from Google transit steps)

    // Useful for UI
    bikeDistance: string;          // "2.3 mi"
    lines: string[];               // ["Gold", "Red"] - MARTA lines used
  }>;

  // Sort order (for UI default)
  recommended?: string;  // Strategy ID of recommended route

  errors?: {
    bikeError?: string;
    mixedErrors?: string[];  // Array since we try multiple
  };
}
```

## Example Response

```json
{
  "bikeRoute": { "duration": "45 min", "distance": "7.2 mi", ... },
  "mixedRoutes": [
    {
      "strategy": "fastest_total",
      "totalDuration": "28 min",
      "arrivalTime": "9:15 AM",
      "bikeDurationSeconds": 420,     // 7 min
      "transitDurationSeconds": 900,  // 15 min (includes wait + transfer time)
      "transferCount": 0,
      "bikeDistance": "1.8 mi",
      "lines": ["Blue"],
      "originStation": { "name": "Avondale", ... },
      "destinationStation": { "name": "Lindbergh Center", ... }
    },
    {
      "strategy": "shortest_bike",
      "totalDuration": "31 min",
      "arrivalTime": "9:18 AM",
      "bikeDurationSeconds": 300,      // 5 min
      "transitDurationSeconds": 1560,  // 26 min (includes wait + transfer time)
      "transferCount": 1,
      "bikeDistance": "1.1 mi",
      "lines": ["Gold", "Blue"],
      "originStation": { "name": "Decatur", ... },
      "destinationStation": { "name": "Lenox", ... }
    },
    {
      "strategy": "alternative",
      "totalDuration": "29 min",
      "arrivalTime": "9:16 AM",
      "bikeDurationSeconds": 540,      // 9 min
      "transitDurationSeconds": 1200,  // 20 min (includes wait time)
      "transferCount": 0,
      "bikeDistance": "2.1 mi",
      "lines": ["Gold"],
      "originStation": { "name": "East Lake", ... },
      "destinationStation": { "name": "Brookhaven", ... }
    }
  ],
  "recommended": "fastest_total"
}
```

## Implementation Phases

### Phase 1: Multi-Station Discovery (Week 1)
- [ ] Update `findNearbyRailStation()` to return top N stations
- [ ] Add MARTA line metadata to station results
- [ ] Cache station searches for 1 hour (stations don't move)

### Phase 2: Route Strategy Engine (Week 2)
- [ ] Implement candidate selection algorithm
- [ ] Add estimation heuristics (before API calls)
- [ ] Calculate 3-5 strategic route combinations

### Phase 3: Enhanced Response (Week 3)
- [ ] Update schemas for V2 response format
- [ ] Add route metadata (strategy, breakdown, comparison)
- [ ] Implement recommendation logic

### Phase 4: Optimization (Week 4)
- [ ] Monitor API usage and costs
- [ ] Tune N (number of stations searched)
- [ ] Consider using MARTA real-time API for wait times
- [ ] A/B test with real commute data

## Cost Analysis

### Per-Request Cost
- V1: ~$0.004 (4 calls × $0.001)
- V2: ~$0.012-0.017 (12-17 calls × $0.001)
- Increase: 3-4×

### Monthly Cost (100 requests/day)
- V1: ~$12/month
- V2: ~$40/month
- Still very reasonable for personal use

### Optimizations
1. **Aggressive caching**: 5 min for directions, 1 hour for stations
2. **Smart estimation**: Rule out poor candidates before API calls
3. **Progressive loading**: Return fastest route first, calculate others async
4. **User feedback**: Learn which routes users prefer, deprioritize unpopular strategies

## Open Questions

1. **Should we use MARTA real-time API for wait times?**
   - Pro: More accurate transfer wait times
   - Con: Another API to integrate, may not be reliable
   - Suggestion: Phase 2 optimization after V2 basics work

2. **How many stations to search (N)?**
   - Start with N=3, tune based on results
   - Could be dynamic based on area density

3. **Should we show routes that are clearly worse?**
   - E.g., if bike-only is 30 min and a mixed route is 45 min
   - Suggestion: Filter out routes >20% slower than best option

4. **Departure time selection?**
   - V1 uses "now + bike time"
   - V2 could optimize: "which train should I target?"
   - Suggestion: Phase 2 feature

## UI Implications

### Route Comparison View
```
┌─────────────────────────────────────┐
│ 🚴 Bike Only        45 min   7.2 mi │
├─────────────────────────────────────┤
│ ⚡ Fastest Total    28 min   1.8 mi │ ← Recommended
│   Avondale → Lindbergh (Blue)       │
│   🚴 7m  🚇 15m  ⏱️ 6m wait          │
├─────────────────────────────────────┤
│ 🚴 Shortest Bike    31 min   1.1 mi │
│   Decatur → Lenox (Gold→Blue)       │
│   🚴 5m  🚇 20m  ⏱️ 6m  🔄 1 trans   │
├─────────────────────────────────────┤
│ 🛤️ No Transfer      29 min   2.1 mi │
│   East Lake → Brookhaven (Gold)     │
│   🚴 9m  🚇 16m  ⏱️ 4m wait          │
└─────────────────────────────────────┘
```

### Toggle behavior
- User can expand each route to see detailed map
- Clicking a route makes it active on map
- Saves preference for future recommendations

## Success Metrics

1. **Accuracy**: Are V2 routes actually faster in real-world use?
2. **Utility**: Do users find value in multiple options?
3. **Cost**: Stay within budget constraints
4. **Performance**: Response time <2s for V2 routes

## Migration Path

### Option A: New Endpoint (`/api/v2/route`)
- Pro: Clean separation, V1 remains unchanged
- Pro: Can A/B test easily
- Con: Need to maintain two implementations

### Option B: Version Parameter (`/api/route?version=2`)
- Pro: Single endpoint
- Con: More complex handler logic

### Option C: Gradual Migration
- Return V1 response + partial V2 data
- Slowly enhance until V2 is complete
- Then deprecate V1 fields

**Recommendation**: Option A (new endpoint) for clean development, then merge to Option B once stable.
