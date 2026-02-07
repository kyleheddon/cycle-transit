'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ExternalMapsLinkProps {
  origin: string;
  destination: string;
  travelMode: string;
}

export function ExternalMapsLink({ origin, destination, travelMode }: ExternalMapsLinkProps) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
        <ExternalLink className="h-3.5 w-3.5" />
        Open in Google Maps
      </a>
    </Button>
  );
}
