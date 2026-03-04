"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { TweetCard } from "@/components/tweet/tweet-card";
import { TweetComposer } from "@/components/tweet/tweet-composer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import VerifiedIcon from "@/components/icons/verified-icon";

const TweetDetail = () => {
  const { tweetId } = useParams<{ tweetId: string }>();
  const router = useRouter();
  const { tweets, getReplies, getQuoteTweets, initReplies } = useAppStore();

  const tweet = tweets.find((t) => t.id === tweetId);
  const replies = tweet ? getReplies(tweet.id) : [];
  const quoteTweets = tweet ? getQuoteTweets(tweet.id) : [];

  // Generate mock replies on first visit
  useEffect(() => {
    if (tweetId) {
      initReplies(tweetId);
    }
  }, [tweetId, initReplies]);

  if (!tweet) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="mt-2 text-muted-foreground">
          This post may have been deleted.
        </p>
      </div>
    );
  }

  // Find parent tweet if this is a reply
  const parentTweet = tweet.parentId
    ? tweets.find((t) => t.id === tweet.parentId)
    : null;

  return (
    <div className="pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-6 border-b border-border px-4 py-3 glass">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">Post</h1>
      </header>

      {/* Parent tweet thread */}
      {parentTweet && (
        <div className="relative">
          <TweetCard tweet={parentTweet} />
          {/* Thread line */}
          <div className="absolute bottom-0 left-9 top-13 w-0.5 bg-border" />
        </div>
      )}

      {/* Main tweet - expanded view */}
      <article className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={tweet.user.avatar} alt={tweet.user.name} />
            <AvatarFallback>{tweet.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold hover:underline">
                {tweet.user.name}
              </span>
              {tweet.user.verified && <VerifiedIcon />}
            </div>
            <span className="text-sm text-muted-foreground">
              @{tweet.user.username}
            </span>
          </div>
        </div>

        {/* Content */}
        <p className="mt-3 whitespace-pre-wrap wrap-break-words text-[17px] leading-relaxed">
          {tweet.content}
        </p>

        {/* Quote tweet */}
        {tweet.quoteTweet && (
          <div
            className="mt-3 cursor-pointer rounded-2xl border border-border p-3 transition-colors hover:bg-secondary/50"
            onClick={() => router.push(`/tweet/${tweet.quoteTweet!.id}`)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={tweet.quoteTweet.user.avatar} />
                <AvatarFallback>
                  {tweet.quoteTweet.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold">
                {tweet.quoteTweet.user.name}
              </span>
              <span className="text-sm text-muted-foreground">
                @{tweet.quoteTweet.user.username}
              </span>
            </div>
            <p className="mt-1 text-sm line-clamp-2">
              {tweet.quoteTweet.content}
            </p>
          </div>
        )}

        {/* Media */}
        {tweet.media && tweet.media.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            {tweet.media.map((media, index) => (
              <img
                key={index}
                src={media.url}
                alt="Tweet media"
                className="aspect-video w-full object-cover"
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
          <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
          <span>·</span>
          <span>
            {new Date(tweet.createdAt).toLocaleTimeString()}
          </span>
          <span>·</span>
          <span className="font-bold text-foreground">
            {formatNumber(tweet.views)}
          </span>
          <span>Views</span>
        </div>

        {/* Stats */}
        <div className="mt-3 flex gap-4 border-t border-border pt-3 text-sm">
          <button className="hover:underline">
            <span className="font-bold text-foreground">
              {formatNumber(tweet.retweets)}
            </span>
            <span className="ml-1 text-muted-foreground">Reposts</span>
          </button>
          {quoteTweets.length > 0 && (
            <button className="hover:underline">
              <span className="font-bold text-foreground">
                {quoteTweets.length}
              </span>
              <span className="ml-1 text-muted-foreground">Quotes</span>
            </button>
          )}
          <button className="hover:underline">
            <span className="font-bold text-foreground">
              {formatNumber(tweet.likes)}
            </span>
            <span className="ml-1 text-muted-foreground">Likes</span>
          </button>
        </div>
      </article>

      {/* Reply composer */}
      <div className="border-b border-border">
        <TweetComposer placeholder="Post your reply" replyToId={tweet.id} />
      </div>

      {/* Replies */}
      <AnimatePresence mode="popLayout">
        {replies.map((reply) => (
          <TweetCard key={reply.id} tweet={reply} />
        ))}
      </AnimatePresence>

      {replies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-muted-foreground"
        >
          No replies yet. Be the first to reply!
        </motion.div>
      )}
    </div>
  );
};

export default TweetDetail;
