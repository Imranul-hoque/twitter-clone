"use client"

import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { trendingTopics, users, formatNumber } from '@/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAppStore } from '@/hooks/store';

export const RightSidebar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { followedUsers, toggleFollow } = useAppStore();

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-6 py-2 hide-scrollbar">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-background pb-2 pt-1">
        <div className={`relative flex items-center rounded-full border bg-neutral-900 transition-all ${searchFocused ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}>
          <Search className={`absolute left-4 h-5 w-5 transition-colors ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            placeholder="Search"
            className="border-0 bg-transparent pl-12 pr-4 focus-visible:ring-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Trending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-y-auto rounded-2xl bg-neutral-900"
      >
        <h2 className="px-4 py-3 text-xl font-bold">Trends for you</h2>
        {trendingTopics.slice(0, 5).map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="trending-item"
          >
            <p className="text-xs text-muted-foreground">{topic.category} · Trending</p>
            <p className="font-bold">{topic.topic}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(topic.tweetCount)} posts</p>
          </motion.div>
        ))}
        <button className="w-full px-4 py-3 text-left text-primary transition-colors hover:bg-secondary">
          Show more
        </button>
      </motion.div>

      {/* Who to follow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-y-auto rounded-2xl bg-neutral-900"
      >
        <h2 className="px-4 py-3 text-xl font-bold">Who to follow</h2>
        {users.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="user-suggestion"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1">
                <p className="truncate font-bold">{user.name}</p>
                {user.verified && (
                  <svg viewBox="0 0 22 22" className="h-4 w-4 fill-primary">
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </svg>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <Button
              variant={followedUsers.has(user.id) ? "outline" : "default"}
              size="sm"
              className="rounded-full font-bold"
              onClick={() => toggleFollow(user.id)}
            >
              {followedUsers.has(user.id) ? 'Following' : 'Follow'}
            </Button>
          </motion.div>
        ))}
        <button className="w-full px-4 py-3 text-left text-primary transition-colors hover:bg-secondary">
          Show more
        </button>
      </motion.div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-4 text-xs text-muted-foreground">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Ads info</a>
        <a href="#" className="hover:underline">More</a>
        <span>© 2026 X Corp.</span>
      </div>
    </div>
  );
};
