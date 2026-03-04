"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { trendingTopics, users, formatNumber } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Explore = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="pb-16 md:pb-0">
      {/* Header with Search */}
      <header className="sticky top-0 z-10 border-b border-border px-4 py-2 glass">
        <div
          className={`relative flex items-center rounded-full border bg-secondary transition-all ${searchFocused ? "border-primary ring-1 ring-primary" : "border-transparent"}`}
        >
          <Search
            className={`absolute left-4 h-5 w-5 transition-colors ${searchFocused ? "text-primary" : "text-muted-foreground"}`}
          />
          <Input
            placeholder="Search"
            className="border-0 bg-transparent pl-12 pr-4 focus-visible:ring-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-auto w-full justify-start gap-0 overflow-x-auto border-b border-border bg-transparent p-0 hide-scrollbar">
          {["For you", "Trending", "News", "Sports", "Entertainment"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().replace(" ", "-")}
                className="relative shrink-0 rounded-none border-0 px-4 py-4 font-semibold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab}
                {activeTab === tab.toLowerCase().replace(" ", "-") && (
                  <motion.div
                    layoutId="explore-tab"
                    className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-primary"
                  />
                )}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <TabsContent value="for-you" className="m-0">
          {/* Featured Topic */}
          <div className="relative h-80 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"
              alt="Featured"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs text-muted-foreground">
                Technology · Trending
              </p>
              <h2 className="mt-1 text-2xl font-bold">The Future of AI</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Exploring the latest developments in artificial intelligence
              </p>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="border-t border-border">
            <h3 className="px-4 py-3 text-xl font-bold">Trends for you</h3>
            {trendingTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="trending-item"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {topic.category} · Trending
                    </p>
                    <p className="font-bold">{topic.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(topic.tweetCount)} posts
                    </p>
                  </div>
                  <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggested Users */}
          <div className="border-t border-border">
            <h3 className="px-4 py-3 text-xl font-bold">Who to follow</h3>
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="user-suggestion"
              >
                <Avatar className="h-12 w-12">
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
                  <p className="truncate text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                  {user.bio && (
                    <p className="mt-1 text-sm line-clamp-2">{user.bio}</p>
                  )}
                </div>
                <Button className="follow-button">Follow</Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="m-0">
          <div className="py-12 text-center text-muted-foreground">
            Trending content coming soon
          </div>
        </TabsContent>

        <TabsContent value="news" className="m-0">
          <div className="py-12 text-center text-muted-foreground">
            News content coming soon
          </div>
        </TabsContent>

        <TabsContent value="sports" className="m-0">
          <div className="py-12 text-center text-muted-foreground">
            Sports content coming soon
          </div>
        </TabsContent>

        <TabsContent value="entertainment" className="m-0">
          <div className="py-12 text-center text-muted-foreground">
            Entertainment content coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
