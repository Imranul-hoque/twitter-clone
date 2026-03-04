"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Heart,
  Repeat2,
  UserPlus,
  MessageCircle,
  AtSign,
} from "lucide-react";
import { motion } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { generateNotifications } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const notificationIcons = {
  like: { icon: Heart, color: "text-twitter-pink", bg: "bg-twitter-pink/10" },
  retweet: { icon: Repeat2, color: "text-success", bg: "bg-success/10" },
  follow: { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" },
  reply: { icon: MessageCircle, color: "text-primary", bg: "bg-primary/10" },
  mention: { icon: AtSign, color: "text-primary", bg: "bg-primary/10" },
};

const Notifications = () => {
  const { markNotificationsRead } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications] = useState(() => generateNotifications());

  // Mark as read when page loads
  useEffect(() => {
    markNotificationsRead();
  }, []);

  const getNotificationMessage = (type: string) => {
    switch (type) {
      case "like":
        return "liked your post";
      case "retweet":
        return "reposted your post";
      case "follow":
        return "followed you";
      case "reply":
        return "replied to your post";
      case "mention":
        return "mentioned you";
      default:
        return "";
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border px-4 py-3 glass">
        <h1 className="text-xl font-bold">Notifications</h1>
        <button className="rounded-full p-2 transition-colors hover:bg-secondary">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex h-auto w-full justify-around border-b border-border bg-transparent p-0">
          {["All", "Mentions"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="relative flex-1 rounded-none border-0 py-4 font-semibold text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div
                  layoutId="notification-tab"
                  className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="m-0">
          {notifications.map((notification, index) => {
            const iconConfig = notificationIcons[notification.type];
            const Icon = iconConfig.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card/50"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}
                >
                  <Icon
                    className={`h-4 w-4 ${iconConfig.color}`}
                    fill={
                      notification.type === "like" ? "currentColor" : "none"
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={notification.user.avatar}
                        alt={notification.user.name}
                      />
                      <AvatarFallback>
                        {notification.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="mt-2">
                    <span className="font-bold hover:underline">
                      {notification.user.name}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {getNotificationMessage(notification.type)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="mentions" className="m-0">
          {notifications
            .filter((n) => n.type === "mention")
            .map((notification, index) => {
              const iconConfig = notificationIcons[notification.type];
              const Icon = iconConfig.icon;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-card/50"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${iconConfig.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={notification.user.avatar}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>
                          {notification.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="mt-2">
                      <span className="font-bold hover:underline">
                        {notification.user.name}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {getNotificationMessage(notification.type)}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground"></p>
                  </div>
                </motion.div>
              );
            })}
          {notifications.filter((n) => n.type === "mention").length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No mentions yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
