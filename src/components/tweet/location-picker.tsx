import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const SUGGESTED_LOCATIONS = [
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Tokyo, Japan',
  'Berlin, Germany',
  'Paris, France',
  'Toronto, Canada',
  'Sydney, Australia',
];

interface LocationPickerProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export const LocationPicker = ({ location, onLocationChange }: LocationPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = SUGGESTED_LOCATIONS.filter((l) =>
    l.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (loc: string) => {
    onLocationChange(loc);
    setOpen(false);
    setSearch('');
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10">
            <MapPin className={`h-5 w-5 ${location ? 'fill-primary/20' : ''}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" side="top" align="start">
          <p className="mb-2 text-sm font-bold">Tag location</p>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations..."
            className="mb-2 h-8 text-sm"
            autoFocus
          />
          <div className="max-h-40 space-y-0.5 overflow-y-auto">
            {search && !filtered.some((l) => l.toLowerCase() === search.toLowerCase()) && (
              <button
                onClick={() => handleSelect(search)}
                className="w-full rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                📍 Use "{search}"
              </button>
            )}
            {filtered.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className="w-full rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                {loc}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {location && (
        <button
          onClick={() => onLocationChange('')}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
        >
          <MapPin className="h-3 w-3" />
          {location}
          <X className="h-3 w-3" />
        </button>
      )}
    </>
  );
};
