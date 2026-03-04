"use client"

import { useState } from 'react';
import { MessageCircle, Repeat2, Heart, Share, Bookmark, BarChart2, MoreHorizontal, Pin, Trash2, Link2, Quote } from 'lucide-react';
import { VideoPlayer } from './video-player';
import { motion, AnimatePresence } from 'motion/react';
import { Tweet, formatNumber } from '@/constants';
import { useAppStore } from '@/hooks/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import VerifiedIcon from '../icons/verified-icon';

interface TweetCardProps {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: TweetCardProps) => {
  const router = useRouter();
  const { toggleLike, toggleRetweet, toggleBookmark, deleteTweet, pinTweet, currentUser, setQuoteTweetTarget, setComposerOpen } = useAppStore();
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showRetweetMenu, setShowRetweetMenu] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);

  const isOwnTweet = tweet.user.id === currentUser.id;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tweet.liked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 400);
    }
    toggleLike(tweet.id);
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRetweet(tweet.id);
    setShowRetweetMenu(false);
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteTweetTarget(tweet);
    setComposerOpen(true);
    setShowRetweetMenu(false);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(tweet.id);
    toast(tweet.bookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTweet(tweet.id);
    toast('Post deleted');
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    pinTweet(tweet.id);
    toast(tweet.pinned ? 'Unpinned post' : 'Pinned to your profile');
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/tweet/${tweet.id}`);
    toast('Link copied to clipboard');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/tweet/${tweet.id}`);
    toast('Link copied to clipboard');
  };

  const handleCardClick = () => {
    router.push(`/tweet/${tweet.id}`);
  };

  const handleDoubleTapLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tweet.liked) {
      toggleLike(tweet.id);
    }
    setShowDoubleTapHeart(true);
    setTimeout(() => setShowDoubleTapHeart(false), 800);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tweet-card relative flex gap-3 px-4 py-3"
      onClick={handleCardClick}
      onDoubleClick={handleDoubleTapLike}
    >
      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showDoubleTapHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
          >
            <Heart className="h-20 w-20 fill-twitter-pink text-twitter-pink drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={tweet.user.avatar} alt={tweet.user.name} />
        <AvatarFallback>{tweet.user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Pinned indicator */}
        {tweet.pinned && (
          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Pin className="h-3 w-3" />
            <span>Pinned</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate font-bold hover:underline">{tweet.user.name}</span>
            {tweet.user.verified && (
             <VerifiedIcon />
            )}
            <span className="shrink-0 text-muted-foreground">@{tweet.user.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="shrink-0 text-muted-foreground hover:underline">
              {new Date(tweet.createdAt).toLocaleTimeString()}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={stopPropagation}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-popover">
              {isOwnTweet && (
                <>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span className="text-destructive">Delete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePin}>
                    <Pin className="mr-2 h-4 w-4" />
                    {tweet.pinned ? 'Unpin from profile' : 'Pin to your profile'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link2 className="mr-2 h-4 w-4" />
                Copy link
              </DropdownMenuItem>
              {!isOwnTweet && (
                <>
                  <DropdownMenuItem>Not interested in this post</DropdownMenuItem>
                  <DropdownMenuItem>Follow @{tweet.user.username}</DropdownMenuItem>
                  <DropdownMenuItem>Mute @{tweet.user.username}</DropdownMenuItem>
                  <DropdownMenuItem>Block @{tweet.user.username}</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Report post</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Replying to indicator */}
        {tweet.parentId && (
          <p className="text-sm text-muted-foreground">
            Replying to a post
          </p>
        )}

        {/* Tweet Content */}
        <p className="mt-1 whitespace-pre-wrap wrap-break-words text-[15px] leading-normal">
          {tweet.content}
        </p>

        {/* Quote Tweet Preview */}
        {tweet.quoteTweet && (
          <div
            className="mt-3 cursor-pointer rounded-2xl border border-border p-3 transition-colors hover:bg-secondary/50"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tweet/${tweet.quoteTweet!.id}`);
            }}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={tweet.quoteTweet.user.avatar} />
                <AvatarFallback>{tweet.quoteTweet.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold">{tweet.quoteTweet.user.name}</span>
              {tweet.quoteTweet.user.verified && (
                <VerifiedIcon />
              )}
              <span className="text-sm text-muted-foreground">@{tweet.quoteTweet.user.username}</span>
            </div>
            <p className="mt-1 text-sm line-clamp-2">{tweet.quoteTweet.content}</p>
          </div>
        )}

        {/* Media */}
        {tweet.media && tweet.media.length > 0 && (
          <div className={`mt-3 grid gap-0.5 overflow-hidden rounded-2xl border border-border ${tweet.media.length > 1 ? 'grid-cols-2' : ''}`}>
            {tweet.media.map((media, index) => (
              media.type === 'video' ? (
                <div key={index} onClick={stopPropagation}>
                  <VideoPlayer
                    src={media.url}
                    thumbnail={media.thumbnail}
                    className="rounded-none border-0"
                  />
                </div>
              ) : (
                <img
                  key={index}
                  src={media.url}
                  alt="Tweet media"
                  className="aspect-video w-full object-cover"
                  onClick={stopPropagation}
                />
              )
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="-ml-2 mt-3 flex items-center justify-between max-w-md">
          {/* Reply */}
          <button className="action-button reply group" onClick={(e) => { e.stopPropagation(); router.push(`/tweet/${tweet.id}`); }}>
            <MessageCircle className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary" />
            <span className="text-xs text-muted-foreground group-hover:text-primary">
              {formatNumber(tweet.replies)}
            </span>
          </button>

          {/* Retweet / Quote dropdown */}
          <DropdownMenu open={showRetweetMenu} onOpenChange={setShowRetweetMenu}>
            <DropdownMenuTrigger asChild>
              <button className="action-button retweet group" onClick={(e) => { e.stopPropagation(); setShowRetweetMenu(true); }}>
                <Repeat2 className={`size-4.5 ${tweet.retweeted ? 'text-success' : 'text-muted-foreground group-hover:text-success'}`} />
                <span className={`text-xs ${tweet.retweeted ? 'text-success' : 'text-muted-foreground group-hover:text-success'}`}>
                  {formatNumber(tweet.retweets)}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-popover" onClick={stopPropagation}>
              <DropdownMenuItem onClick={handleRetweet}>
                <Repeat2 className="mr-2 h-4 w-4" />
                {tweet.retweeted ? 'Undo repost' : 'Repost'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleQuote}>
                <Quote className="mr-2 h-4 w-4" />
                Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Like */}
          <button className="action-button like group relative" onClick={handleLike}>
            <AnimatePresence>
              {showHeartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Heart className="size-4.5 fill-twitter-pink text-twitter-pink" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              animate={tweet.liked ? { scale: [1, 1.2, 0.95, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart
                className={`size-4.5 ${tweet.liked ? 'fill-twitter-pink text-twitter-pink' : 'text-muted-foreground group-hover:text-twitter-pink'}`}
              />
            </motion.div>
            <span className={`text-xs ${tweet.liked ? 'text-twitter-pink' : 'text-muted-foreground group-hover:text-twitter-pink'}`}>
              {formatNumber(tweet.likes)}
            </span>
          </button>

          {/* Views */}
          <button className="action-button group" onClick={stopPropagation}>
            <BarChart2 className="size-4.5 text-muted-foreground group-hover:text-primary" />
            <span className="text-xs text-muted-foreground group-hover:text-primary">
              {formatNumber(tweet.views)}
            </span>
          </button>

          {/* Share & Bookmark */}
          <div className="flex items-center">
            <button className="action-button group" onClick={handleBookmark}>
              <Bookmark
                className={`size-4.5 ${tweet.bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
              />
            </button>
            <button className="action-button share group" onClick={handleShare}>
              <Share className="size-4.5 text-muted-foreground group-hover:text-primary" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
