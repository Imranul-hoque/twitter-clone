"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { formatNumber, sampleTweets, users } from "@/constants";
import { TweetCard } from "@/components/tweet/tweet-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { useParams, useRouter } from "next/navigation";
import VerifiedIcon from "@/components/icons/verified-icon";

const Profile = () => {
  const router = useRouter();
  const { username } = useParams();
  const { currentUser, followedUsers, toggleFollow } = useAppStore();

  const [activeTab, setActiveTab] = useState("tweets");
  const [hoverUnfollow, setHoverUnfollow] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // SSR safe guard
  if (!currentUser) {
    return null;
  }

  // Determine profile user (static lookup)
  const profileUser =
    users.find((u) => u.username === username) ?? currentUser;

  const isOwnProfile = profileUser.id === currentUser.id;

  // STATIC tweets (no generation)
  const userTweets = sampleTweets.map((t) => ({
    ...t,
    user: profileUser,
  }));

  return (
    <div>
      <div className="pb-16 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center gap-6 px-4 py-2 glass">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-bold leading-tight">{profileUser.name}</h1>
            <p className="text-sm text-muted-foreground">
              {userTweets.length} posts
            </p>
          </div>
        </header>

        {/* Banner */}
        <div className="relative h-48 bg-linear-to-r from-primary/50 to-twitter-purple/50">
          {profileUser.banner && (
            <img
              src={profileUser.banner}
              alt="Profile banner"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          <div className="absolute -top-16 left-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
              <AvatarFallback className="text-4xl">
                {profileUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 py-3">
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="rounded-full border-border font-bold"
                onClick={() => setEditProfileOpen(true)}
              >
                Edit profile
              </Button>
            ) : (
              <>
                <button className="rounded-full border border-border p-2 transition-colors hover:bg-secondary">
                  <MoreHorizontal className="h-5 w-5" />
                </button>

                {followedUsers.has(profileUser.id) ? (
                  <Button
                    variant="outline"
                    className={`rounded-full border-border font-bold min-w-27.5 ${
                      hoverUnfollow
                        ? "border-destructive text-destructive hover:bg-destructive/10"
                        : ""
                    }`}
                    onMouseEnter={() => setHoverUnfollow(true)}
                    onMouseLeave={() => setHoverUnfollow(false)}
                    onClick={() => toggleFollow(profileUser.id)}
                  >
                    {hoverUnfollow ? "Unfollow" : "Following"}
                  </Button>
                ) : (
                  <Button
                    className="rounded-full font-bold"
                    onClick={() => toggleFollow(profileUser.id)}
                  >
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Profile Details */}
          <div className="mt-6">
            <div className="flex items-center gap-1">
              <h2 className="text-xl font-bold">{profileUser.name}</h2>
              {profileUser.verified && <VerifiedIcon />}
            </div>
            <p className="text-muted-foreground">@{profileUser.username}</p>

            {profileUser.bio && (
              <p className="mt-3 whitespace-pre-wrap">{profileUser.bio}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {profileUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileUser.location}
                </span>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {profileUser.website}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {profileUser.joinDate}
              </span>
            </div>

            <div className="mt-3 flex gap-4 text-sm">
              <button className="hover:underline">
                <span className="font-bold">
                  {formatNumber(profileUser.following)}
                </span>{" "}
                <span className="text-muted-foreground">Following</span>
              </button>
              <button className="hover:underline">
                <span className="font-bold">
                  {formatNumber(profileUser.followers)}
                </span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex h-auto w-full justify-around border-b border-border bg-transparent p-0">
            {["Tweets", "Replies", "Media", "Likes"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="relative flex-1 rounded-none border-0 py-4 font-semibold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div
                    layoutId="profile-tab"
                    className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="tweets" className="m-0">
            {userTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </TabsContent>

          <TabsContent value="replies" className="m-0">
            <div className="py-12 text-center text-muted-foreground">
              No replies yet
            </div>
          </TabsContent>

          <TabsContent value="media" className="m-0">
            <div className="py-12 text-center text-muted-foreground">
              No media yet
            </div>
          </TabsContent>

          <TabsContent value="likes" className="m-0">
            <div className="py-12 text-center text-muted-foreground">
              No likes yet
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
    </div>
  );
};

export default Profile;