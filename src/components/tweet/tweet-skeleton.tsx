"use client"

import { motion } from 'motion/react';

export const TweetSkeleton = () => {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-border">
      {/* Avatar skeleton */}
      <div className="h-10 w-10 shrink-0 rounded-full skeleton-pulse" />

      <div className="min-w-0 flex-1">
        {/* Header skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-28 skeleton-pulse" />
          <div className="h-4 w-20 skeleton-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full skeleton-pulse" />
          <div className="h-4 w-4/5 skeleton-pulse" />
        </div>

        {/* Actions skeleton */}
        <div className="mt-3 flex gap-12">
          <div className="h-4 w-12 skeleton-pulse" />
          <div className="h-4 w-12 skeleton-pulse" />
          <div className="h-4 w-12 skeleton-pulse" />
          <div className="h-4 w-12 skeleton-pulse" />
        </div>
      </div>
    </div>
  );
};

export const TweetSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <TweetSkeleton />
        </motion.div>
      ))}
    </>
  );
};
