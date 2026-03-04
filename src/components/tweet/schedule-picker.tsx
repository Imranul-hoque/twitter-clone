import { useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SchedulePickerProps {
  scheduledDate: Date | undefined;
  onScheduleChange: (date: Date | undefined) => void;
}

export const SchedulePicker = ({ scheduledDate, onScheduleChange }: SchedulePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(scheduledDate);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');

  const handleConfirm = () => {
    if (!selectedDate) return;
    const date = new Date(selectedDate);
    let h = parseInt(hour);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    date.setHours(h, parseInt(minute));
    onScheduleChange(date);
    setOpen(false);
  };

  const handleClear = () => {
    onScheduleChange(undefined);
    setSelectedDate(undefined);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10">
            <CalendarDays className={`h-5 w-5 ${scheduledDate ? 'fill-primary/20' : ''}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" side="top" align="start">
          <div className="p-3 pb-0">
            <p className="text-sm font-bold">Schedule post</p>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="flex items-center gap-2 border-t border-border px-3 py-2">
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{String(i + 1).padStart(2, '0')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm font-bold">:</span>
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['00', '15', '30', '45'].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(v) => setPeriod(v as 'AM' | 'PM')}>
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            {scheduledDate && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
                Clear
              </Button>
            )}
            <Button size="sm" onClick={handleConfirm} disabled={!selectedDate} className="ml-auto">
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {scheduledDate && (
        <button
          onClick={() => onScheduleChange(undefined)}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
        >
          <CalendarDays className="h-3 w-3" />
          {format(scheduledDate, "MMM d, h:mm a")}
          <X className="h-3 w-3" />
        </button>
      )}
    </>
  );
};
