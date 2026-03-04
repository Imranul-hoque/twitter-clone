"use client"

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

export const EmojiPicker = ({ onEmojiSelect, disabled }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-0 p-0" side="top" align="start">
        <EmojiPickerReact
          onEmojiClick={handleSelect}
          theme={Theme.DARK}
          width={320}
          height={400}
          searchPlaceholder="Search emoji..."
          lazyLoadEmojis
        />
      </PopoverContent>
    </Popover>
  );
};
