'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Navigation } from 'lucide-react';
import { searchPlaces, getPlaceDetails, reverseGeocode } from '@/lib/api-client';
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
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleSearch = useCallback((input: string) => {
    setQuery(input);
    setDisplayValue(input);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (input.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const places = await searchPlaces(input);
        setResults(places);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
  }, []);

  const handleSelect = useCallback(async (result: AutocompleteResult) => {
    try {
      const place = await getPlaceDetails(result.placeId);
      setDisplayValue(result.mainText);
      setIsOpen(false);
      setResults([]);
      onSelect(place);
    } catch {
      // ignore
    }
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
      } catch {
        // ignore
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
          onFocus={() => results.length > 0 && setIsOpen(true)}
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
          </CommandList>
        )}
      </Command>
    </div>
  );
}
