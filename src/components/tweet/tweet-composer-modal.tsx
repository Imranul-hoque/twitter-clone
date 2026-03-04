"use client"

import { useState, useRef } from 'react';
import { X, Image, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/hooks/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from './video-player';
import { EmojiPicker } from './emoji-picker';
import { LocationPicker } from './location-picker';
import { SchedulePicker } from './schedule-picker';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';

export const TweetComposerModal = () => {
  const { currentUser, composerOpen, setComposerOpen, addTweet, quoteTweetTarget, setQuoteTweetTarget } = useAppStore();
  const [content, setContent] = useState('');
  const [mediaPreviews, setMediaPreviews] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (content.trim() || mediaPreviews.length > 0) {
      const locationSuffix = location ? `\n📍 ${location}` : '';
      const scheduleSuffix = scheduledDate ? `\n🗓 Scheduled: ${format(scheduledDate, "MMM d, h:mm a")}` : '';
      addTweet(
        content.trim() + locationSuffix + scheduleSuffix,
        mediaPreviews.length > 0 ? mediaPreviews : undefined,
        undefined,
        quoteTweetTarget || undefined
      );
      setContent('');
      setMediaPreviews([]);
      setLocation('');
      setScheduledDate(undefined);
      setComposerOpen(false);
    }
  };

  const handleClose = () => {
    setComposerOpen(false);
    setQuoteTweetTarget(null);
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
    <Dialog open={composerOpen} onOpenChange={(open) => { if (!open) handleClose(); else setComposerOpen(true); }}>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent className="top-[10%] max-w-xl translate-y-0 gap-0 border-0 bg-background p-0 sm:top-[10%]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <button onClick={handleClose} className="rounded-full p-2 transition-colors hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
          <button className="text-sm font-bold text-primary">Drafts</button>
        </div>

        {/* Composer */}
        <div className="flex gap-3 p-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleInput}
              placeholder={quoteTweetTarget ? "Add a comment" : "What's happening?!"}
              className="min-h-30 w-full resize-none bg-transparent text-xl placeholder:text-muted-foreground focus:outline-none"
              autoFocus
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
                        <VideoPlayer src={media.url} className="rounded-none border-0" />
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

            {/* Quote Tweet Preview */}
            {quoteTweetTarget && (
              <div className="mt-3 rounded-2xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={quoteTweetTarget.user.avatar} />
                    <AvatarFallback>{quoteTweetTarget.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold">{quoteTweetTarget.user.name}</span>
                  {quoteTweetTarget.user.verified && (
                    <svg viewBox="0 0 22 22" className="h-3.5 w-3.5 shrink-0 fill-primary">
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                    </svg>
                  )}
                  <span className="text-sm text-muted-foreground">@{quoteTweetTarget.user.username}</span>
                </div>
                <p className="mt-1 text-sm line-clamp-3">{quoteTweetTarget.content}</p>
              </div>
            )}

            {/* Reply visibility */}
            <button className="mb-3 flex items-center gap-1 rounded-full py-1 pr-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10">
              <Globe className="h-4 w-4" />
              Everyone can reply
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
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
              disabled={(!content.trim() && mediaPreviews.length === 0 && !quoteTweetTarget) || isOverLimit}
              className="tweet-button py-1.5! px-4 text-sm font-bold disabled:opacity-50"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
