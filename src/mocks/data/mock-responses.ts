export const mockAutocompleteResults = {
  predictions: [
    {
      place_id: 'ChIJV4FfbflY9YgRMwET0E3dKsA',
      description: 'Decatur, GA, USA',
      structured_formatting: {
        main_text: 'Decatur',
        secondary_text: 'GA, USA',
      },
    },
    {
      place_id: 'ChIJjQmTaV0E9YgRC2MLmS_e_mQ',
      description: 'Lenox Square, 3393 Peachtree Rd NE, Atlanta, GA 30326, USA',
      structured_formatting: {
        main_text: 'Lenox Square',
        secondary_text: '3393 Peachtree Rd NE, Atlanta, GA 30326, USA',
      },
    },
    {
      place_id: 'mock_decatur_station',
      description: 'Decatur MARTA Station, Decatur, GA 30030, USA',
      structured_formatting: {
        main_text: 'Decatur MARTA Station',
        secondary_text: 'Decatur, GA 30030, USA',
      },
    },
    {
      place_id: 'mock_lenox_station',
      description: 'Lenox MARTA Station, Atlanta, GA 30326, USA',
      structured_formatting: {
        main_text: 'Lenox MARTA Station',
        secondary_text: 'Atlanta, GA 30326, USA',
      },
    },
    {
      place_id: 'mock_midtown',
      description: 'Midtown, Atlanta, GA, USA',
      structured_formatting: {
        main_text: 'Midtown',
        secondary_text: 'Atlanta, GA, USA',
      },
    },
  ],
  status: 'OK',
};

export const mockPlaceDetails: Record<string, object> = {
  ChIJV4FfbflY9YgRMwET0E3dKsA: {
    result: {
      place_id: 'ChIJV4FfbflY9YgRMwET0E3dKsA',
      name: 'Decatur',
      formatted_address: 'Decatur, GA, USA',
      geometry: { location: { lat: 33.7748, lng: -84.2963 } },
    },
    status: 'OK',
  },
  ChIJjQmTaV0E9YgRC2MLmS_e_mQ: {
    result: {
      place_id: 'ChIJjQmTaV0E9YgRC2MLmS_e_mQ',
      name: 'Lenox Square',
      formatted_address: '3393 Peachtree Rd NE, Atlanta, GA 30326, USA',
      geometry: { location: { lat: 33.8462, lng: -84.3622 } },
    },
    status: 'OK',
  },
  mock_decatur_station: {
    result: {
      place_id: 'mock_decatur_station',
      name: 'Decatur MARTA Station',
      formatted_address: 'Decatur, GA 30030, USA',
      geometry: { location: { lat: 33.7748, lng: -84.2971 } },
    },
    status: 'OK',
  },
  mock_lenox_station: {
    result: {
      place_id: 'mock_lenox_station',
      name: 'Lenox MARTA Station',
      formatted_address: '2460 Lenox Rd NE, Atlanta, GA 30324, USA',
      geometry: { location: { lat: 33.8468, lng: -84.3575 } },
    },
    status: 'OK',
  },
  mock_midtown: {
    result: {
      place_id: 'mock_midtown',
      name: 'Midtown',
      formatted_address: 'Midtown, Atlanta, GA, USA',
      geometry: { location: { lat: 33.7845, lng: -84.3834 } },
    },
    status: 'OK',
  },
};

export const mockFindPlace = {
  candidates: [
    {
      place_id: 'mock_decatur_station',
      name: 'Decatur MARTA Station',
      formatted_address: 'Decatur, GA 30030, USA',
      geometry: { location: { lat: 33.7748, lng: -84.2971 } },
    },
  ],
  status: 'OK',
};

export const mockBikeDirections = {
  routes: [
    {
      overview_polyline: {
        points: 'gvzmEjcqbOdAl@nBbBfCdCdBzAxAfAnCxBzFfF~BrBvClCbDxCpBdBvAnAhBzAbCxBdDzCfBzAjBbBhErD',
      },
      legs: [
        {
          distance: { text: '8.2 mi', value: 13195 },
          duration: { text: '42 mins', value: 2520 },
          start_address: 'Decatur, GA, USA',
          end_address: 'Lenox Square, Atlanta, GA 30326, USA',
          start_location: { lat: 33.7748, lng: -84.2963 },
          end_location: { lat: 33.8462, lng: -84.3622 },
          steps: [
            {
              distance: { text: '0.3 mi', value: 483 },
              duration: { text: '2 mins', value: 97 },
              html_instructions: 'Head <b>northwest</b> on <b>W Ponce de Leon Ave</b>',
              polyline: { points: 'gvzmEjcqbOdAl@nBbBfCdC' },
              travel_mode: 'BICYCLING',
            },
            {
              distance: { text: '2.1 mi', value: 3380 },
              duration: { text: '11 mins', value: 660 },
              html_instructions: 'Turn <b>right</b> onto <b>Commerce Dr</b>',
              polyline: { points: 'eqzmE~kqbOdBzAxAfAnCxBzFfF' },
              travel_mode: 'BICYCLING',
            },
          ],
        },
      ],
    },
  ],
  status: 'OK',
};

const now = Math.floor(Date.now() / 1000);

export const mockTransitDirections = {
  routes: [
    {
      overview_polyline: {
        points: 'eqzmEloqbOpEjB~GfCdKvDnNhFxStHhIlDpGlCnFlBbE~A',
      },
      legs: [
        {
          distance: { text: '7.8 mi', value: 12553 },
          duration: { text: '22 mins', value: 1320 },
          start_address: 'Decatur MARTA Station, Decatur, GA 30030',
          end_address: 'Lenox MARTA Station, Atlanta, GA 30324',
          start_location: { lat: 33.7748, lng: -84.2971 },
          end_location: { lat: 33.8468, lng: -84.3575 },
          departure_time: { text: '8:15 AM', value: now + 900 },
          arrival_time: { text: '8:37 AM', value: now + 2220 },
          steps: [
            {
              distance: { text: '7.8 mi', value: 12553 },
              duration: { text: '22 mins', value: 1320 },
              html_instructions: 'Train towards Doraville',
              polyline: { points: 'eqzmEloqbOpEjB~GfCdKvDnNhFxStHhIlDpGlCnFlBbE~A' },
              travel_mode: 'TRANSIT',
              transit_details: {
                arrival_stop: {
                  name: 'Lenox Station',
                  location: { lat: 33.8468, lng: -84.3575 },
                },
                departure_stop: {
                  name: 'Decatur Station',
                  location: { lat: 33.7748, lng: -84.2971 },
                },
                arrival_time: { text: '8:37 AM', value: now + 2220 },
                departure_time: { text: '8:15 AM', value: now + 900 },
                line: {
                  name: 'Gold Line',
                  short_name: 'GLD',
                  color: '#D4A843',
                  vehicle: { name: 'Subway', type: 'SUBWAY' },
                },
                num_stops: 7,
              },
            },
          ],
        },
      ],
    },
  ],
  status: 'OK',
};

export const mockFirstBikeDirections = {
  routes: [
    {
      overview_polyline: {
        points: 'gvzmEjcqbOdAl@nBbB',
      },
      legs: [
        {
          distance: { text: '0.5 mi', value: 805 },
          duration: { text: '3 mins', value: 180 },
          start_address: 'Decatur, GA, USA',
          end_address: 'Decatur MARTA Station, Decatur, GA 30030',
          start_location: { lat: 33.7748, lng: -84.2963 },
          end_location: { lat: 33.7748, lng: -84.2971 },
          steps: [
            {
              distance: { text: '0.5 mi', value: 805 },
              duration: { text: '3 mins', value: 180 },
              html_instructions: 'Head <b>west</b> on <b>W Ponce de Leon Ave</b> toward <b>Decatur MARTA Station</b>',
              polyline: { points: 'gvzmEjcqbOdAl@nBbB' },
              travel_mode: 'BICYCLING',
            },
          ],
        },
      ],
    },
  ],
  status: 'OK',
};

export const mockLastBikeDirections = {
  routes: [
    {
      overview_polyline: {
        points: 'g~`nEhrpbOcA}@kAeA',
      },
      legs: [
        {
          distance: { text: '0.3 mi', value: 483 },
          duration: { text: '2 mins', value: 120 },
          start_address: 'Lenox MARTA Station, Atlanta, GA 30324',
          end_address: 'Lenox Square, Atlanta, GA 30326, USA',
          start_location: { lat: 33.8468, lng: -84.3575 },
          end_location: { lat: 33.8462, lng: -84.3622 },
          steps: [
            {
              distance: { text: '0.3 mi', value: 483 },
              duration: { text: '2 mins', value: 120 },
              html_instructions: 'Head <b>west</b> on <b>Lenox Rd NE</b>',
              polyline: { points: 'g~`nEhrpbOcA}@kAeA' },
              travel_mode: 'BICYCLING',
            },
          ],
        },
      ],
    },
  ],
  status: 'OK',
};

export const mockRouteResult = {
  bikeRoute: {
    directions: mockBikeDirections,
    arrivalTime: '9:15 AM',
    duration: '42 mins',
    distance: '8.2 mi',
    durationSeconds: 2520,
  },
  mixedRoute: {
    firstBikeRoute: {
      directions: mockFirstBikeDirections,
      arrivalTime: '8:15 AM',
      duration: '3 mins',
      distance: '0.5 mi',
      durationSeconds: 180,
    },
    transitRoute: mockTransitDirections,
    lastBikeRoute: {
      directions: mockLastBikeDirections,
      arrivalTime: '8:39 AM',
      duration: '2 mins',
      distance: '0.3 mi',
      durationSeconds: 120,
    },
    arrivalTime: '8:39 AM',
    duration: '27 min',
    originStation: {
      placeId: 'mock_decatur_station',
      name: 'Decatur MARTA Station',
      address: 'Decatur, GA 30030, USA',
      location: { lat: 33.7748, lng: -84.2971 },
    },
    destinationStation: {
      placeId: 'mock_lenox_station',
      name: 'Lenox MARTA Station',
      address: '2460 Lenox Rd NE, Atlanta, GA 30324, USA',
      location: { lat: 33.8468, lng: -84.3575 },
    },
  },
};

export const mockReverseGeocode = {
  results: [
    {
      formatted_address: '123 Willow Lane, Decatur, GA 30030, USA',
      place_id: 'mock_home',
    },
  ],
  status: 'OK',
};
