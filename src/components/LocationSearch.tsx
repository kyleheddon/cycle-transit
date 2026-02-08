'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { searchPlaces, getPlaceDetails, reverseGeocode } from '@/lib/api-client';
import { logError } from '@/lib/client-logger';
import { getLocationHistory, addToLocationHistory, type HistoryItem } from '@/lib/location-history';
import { AUTOCOMPLETE_DEBOUNCE_MS } from '@/lib/constants';
import type { AutocompleteResult, Place } from '@/lib/types';

interface LocationSearchProps {
  label: string;
  value: string;
  onSelect: (place: Place) => void;
  placeholder?: string;
}

export function LocationSearch({ label, value, onSelect, placeholder }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setHistory(getLocationHistory());
  }, []);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleSearch = useCallback((input: string) => {
    setQuery(input);
    setDisplayValue(input);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (input.length < 2) {
      setResults([]);
      setIsOpen(true); // Keep open to show history
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const places = await searchPlaces(input);
        setResults(places);
        setIsOpen(true);
      } catch (error) {
        logError('Autocomplete search failed', error instanceof Error ? error : undefined, { input });
        setResults([]);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  }, []);

  const handleSelect = useCallback(async (result: AutocompleteResult) => {
    try {
      const place = await getPlaceDetails(result.placeId, result.description);
      // Use the full formatted address for better context
      setDisplayValue(place.address || place.name);
      setIsOpen(false);
      setResults([]);
      addToLocationHistory(place);
      setHistory(getLocationHistory());
      onSelect(place);
    } catch (error) {
      logError('Failed to get place details', error instanceof Error ? error : undefined, {
        placeId: result.placeId,
        mainText: result.mainText,
      });
    }
  }, [onSelect]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    const place: Place = {
      placeId: item.placeId,
      name: item.name,
      address: item.address,
      location: item.location,
    };
    setDisplayValue(item.address || item.name);
    setIsOpen(false);
    setResults([]);
    addToLocationHistory(place);
    setHistory(getLocationHistory());
    onSelect(place);
  }, [onSelect]);

  const handleCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const address = await reverseGeocode(latitude, longitude);
        const place: Place = {
          placeId: 'current-location',
          name: 'Current Location',
          address,
          location: { lat: latitude, lng: longitude },
        };
        setDisplayValue('Current Location');
        setIsOpen(false);
        onSelect(place);
      } catch (error) {
        logError('Failed to reverse geocode current location', error instanceof Error ? error : undefined, {
          latitude,
          longitude,
        });
      }
    });
  }, [onSelect]);

  return (
    <div className="relative">
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <Command className="border rounded-md" shouldFilter={false}>
        <CommandInput
          placeholder={placeholder || 'Search location...'}
          value={displayValue}
          onValueChange={handleSearch}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isOpen && (
          <CommandList className="absolute top-full left-0 right-0 z-50 bg-popover border rounded-md shadow-md mt-1 max-h-60">
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={handleCurrentLocation} className="cursor-pointer">
                <Navigation className="mr-2 h-4 w-4" />
                Use current location
              </CommandItem>
            </CommandGroup>

            {history.length > 0 && query.length < 2 && (
              <CommandGroup heading="Recent">
                {history.map((item) => (
                  <CommandItem
                    key={item.placeId}
                    onSelect={() => handleSelectHistory(item)}
                    className="cursor-pointer"
                  >
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.address}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.length > 0 && (
              <CommandGroup heading={query.length >= 2 ? "Suggestions" : undefined}>
                {results.map((result) => (
                  <CommandItem
                    key={result.placeId}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.mainText}</span>
                      <span className="text-xs text-muted-foreground">{result.secondaryText}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
