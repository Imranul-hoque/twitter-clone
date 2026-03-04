"use client"


import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/hooks/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmojiPicker } from './emoji-picker';
import { LocationPicker } from './location-picker';
import { SchedulePicker } from './schedule-picker';
import { format } from 'date-fns';

interface TweetComposerProps {
  placeholder?: string;
  onSubmit?: () => void;
  replyToId?: string;
}

export const TweetComposer = ({ placeholder = "What's happening?!", onSubmit, replyToId }: TweetComposerProps) => {
  const { currentUser, addTweet } = useAppStore();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (content.trim() || mediaPreviews.length > 0) {
      const locationSuffix = location ? `\n📍 ${location}` : '';
      const scheduleSuffix = scheduledDate ? `\n🗓 Scheduled: ${format(scheduledDate, "MMM d, h:mm a")}` : '';
      addTweet(content.trim() + locationSuffix + scheduleSuffix, mediaPreviews.length > 0 ? mediaPreviews : undefined, replyToId);
      setContent('');
      setMediaPreviews([]);
      setLocation('');
      setScheduledDate(undefined);
      onSubmit?.();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setContent((prev) => prev + emoji);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).slice(0, 4 - mediaPreviews.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setMediaPreviews((prev) => [...prev, { type: type as 'image' | 'video', url }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const characterLimit = 280;
  const characterCount = content.length;
  const isOverLimit = characterCount > characterLimit;
  const progressPercentage = Math.min((characterCount / characterLimit) * 100, 100);

  return (
    <div className="flex gap-3 px-4 py-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent py-3 text-xl placeholder:text-muted-foreground focus:outline-none"
          rows={1}
        />

        {/* Media Previews */}
        <AnimatePresence>
          {mediaPreviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-2 grid gap-2 ${mediaPreviews.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {mediaPreviews.map((media, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative overflow-hidden rounded-2xl border border-border"
                >
                  {media.type === 'image' ? (
                    <img src={media.url} alt={`Upload ${index + 1}`} className="aspect-video w-full object-cover" />
                  ) : (
                    <video src={media.url} className="aspect-video w-full object-cover" controls />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur transition-colors hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location/Schedule tags */}
        {(location || scheduledDate) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {/* Tags rendered by LocationPicker and SchedulePicker below */}
          </div>
        )}

        {isFocused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-border pt-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10"
                  disabled={mediaPreviews.length >= 4}
                >
                  <Image className={`h-5 w-5 ${mediaPreviews.length >= 4 ? 'opacity-50' : ''}`} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                <LocationPicker location={location} onLocationChange={setLocation} />
                <SchedulePicker scheduledDate={scheduledDate} onScheduleChange={setScheduledDate} />
              </div>

              <div className="flex items-center gap-3">
                {characterCount > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
                      <circle
                        cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeDasharray={`${progressPercentage * 0.565} 100`}
                        className={isOverLimit ? 'text-destructive' : 'text-primary'}
                      />
                    </svg>
                    {characterCount > 260 && (
                      <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {characterLimit - characterCount}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={(!content.trim() && mediaPreviews.length === 0) || isOverLimit}
                  className="tweet-button py-1.5! px-4 text-sm font-bold disabled:opacity-50"
                >
                  {replyToId ? 'Reply' : 'Post'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
