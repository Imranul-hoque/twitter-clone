"use client"

import { MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '@/hooks/store';
import { TweetCard } from '@/components/tweet/tweet-card';

const Bookmarks = () => {
  const { tweets, currentUser } = useAppStore();
  const bookmarkedTweets = tweets.filter((t) => t.bookmarked);

  return (

      <div className="pb-16 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border px-4 py-3 glass">
          <div>
            <h1 className="text-xl font-bold">Bookmarks</h1>
            <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
          </div>
          <button className="rounded-full p-2 transition-colors hover:bg-secondary">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </header>

        {/* Bookmarks */}
        {bookmarkedTweets.length > 0 ? (
          bookmarkedTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center px-8 py-16 text-center"
          >
            <h2 className="text-3xl font-bold">Save posts for later</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Bookmark posts to easily find them again in the future.
            </p>
          </motion.div>
        )}
      </div>
  );
};

export default Bookmarks;
