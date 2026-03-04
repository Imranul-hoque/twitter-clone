"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { TweetCard } from "@/components/tweet/tweet-card";
import { TweetComposer } from "@/components/tweet/tweet-composer";
import { TweetSkeletonList } from "@/components/tweet/tweet-skeleton";
import { useRealtimeFeed } from "@/hooks/use-realtime-feed";

export const Feed = () => {
  const {
    tweets,
    isLoadingTweets,
    hasMoreTweets,
    loadMoreTweets,
    pendingTweetsCount,
    showPendingTweets,
    feedTab,
    setFeedTab,
    followedUsers,
    initTweets,
  } = useAppStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // hydrate tweets only on client
  useEffect(() => {
    initTweets();
  }, [initTweets]);

  useRealtimeFeed();

  const { currentUser } = useAppStore();

  // filter feed
  const feedTweets = tweets.filter((t) => {
    if (t.parentId) return false;
    if (feedTab === "following") {
      return followedUsers.has(t.user.id) || t.user.id === currentUser.id;
    }
    return true;
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreTweets && !isLoadingTweets) {
        loadMoreTweets();
      }
    },
    [hasMoreTweets, isLoadingTweets, loadMoreTweets],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleObserver]);

  return (
    <div className="pb-16 md:pb-0">
      <header className="sticky top-0 z-10 border-b border-border glass">
        <div className="flex">
          <button
            className={`flex-1 py-4 font-bold transition-colors hover:bg-secondary ${
              feedTab === "for-you" ? "" : "text-muted-foreground font-normal"
            }`}
            onClick={() => setFeedTab("for-you")}
          >
            <span className="relative">
              For you
              {feedTab === "for-you" && (
                <motion.div
                  layoutId="feed-tab-indicator"
                  className="absolute -bottom-4 left-0 right-0 h-1 rounded-full bg-primary"
                />
              )}
            </span>
          </button>

          <button
            className={`flex-1 py-4 transition-colors hover:bg-secondary ${
              feedTab === "following"
                ? "font-bold"
                : "text-muted-foreground font-normal"
            }`}
            onClick={() => setFeedTab("following")}
          >
            <span className="relative">
              Following
              {feedTab === "following" && (
                <motion.div
                  layoutId="feed-tab-indicator"
                  className="absolute -bottom-4 left-0 right-0 h-1 rounded-full bg-primary"
                />
              )}
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {pendingTweetsCount > 0 && feedTab === "for-you" && (
          <motion.button
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onClick={showPendingTweets}
            className="w-full border-b border-border py-3 text-center text-primary transition-colors hover:bg-primary/5"
          >
            Show {pendingTweetsCount} new{" "}
            {pendingTweetsCount === 1 ? "post" : "posts"}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="hidden border-b border-border md:block">
        <TweetComposer />
      </div>

      <AnimatePresence mode="popLayout">
        {feedTweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </AnimatePresence>

      {feedTab === "following" && feedTweets.length === 0 && !isLoadingTweets && (
        <div className="py-12 text-center">
          <h3 className="text-xl font-bold">No posts yet</h3>
          <p className="mt-2 text-muted-foreground">
            When you follow people, their posts will show up here.
          </p>
        </div>
      )}

      <div ref={loadMoreRef} className="py-4">
        {isLoadingTweets && <TweetSkeletonList count={3} />}
      </div>

      {!hasMoreTweets && feedTweets.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center text-muted-foreground"
        >
          You've reached the end! 🎉
        </motion.div>
      )}
    </div>
  );
};