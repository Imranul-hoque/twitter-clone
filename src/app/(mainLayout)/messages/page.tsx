"use client"

import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Search,
  Send,
  Image,
  Smile,
  ArrowLeft,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { generateConversations, currentUser } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Messages = () => {
  const { activeConversation, setActiveConversation, sendMessage } =
    useAppStore();
  const [conversations] = useState(generateConversations());
  const [newMessage, setNewMessage] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]);

  const handleSend = () => {
    if (newMessage.trim() && activeConversation) {
      sendMessage(activeConversation, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full pb-16 md:pb-0 overflow-hidden">
      {/* Conversations List */}
      <div
        className={`flex w-full flex-col border-r border-border md:w-80 ${activeConversation ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border px-4 py-3 glass">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex gap-2">
            <button className="rounded-full p-2 transition-colors hover:bg-secondary">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="p-4">
          <div
            className={`relative flex items-center rounded-full border bg-secondary transition-all ${searchFocused ? "border-primary ring-1 ring-primary" : "border-transparent"}`}
          >
            <Search
              className={`absolute left-4 h-5 w-5 transition-colors ${searchFocused ? "text-primary" : "text-muted-foreground"}`}
            />
            <Input
              placeholder="Search Direct Messages"
              className="border-0 bg-transparent pl-12 pr-4 focus-visible:ring-0"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveConversation(conv.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary ${activeConversation === conv.id ? "bg-secondary" : ""}`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                <AvatarFallback>{conv.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold">{conv.user.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(conv.lastMessage.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
                <p
                  className={`truncate text-sm ${conv.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {conv.lastMessage.content}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {conv.unreadCount}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex flex-1 flex-col ${activeConversation ? "flex" : "hidden md:flex"}`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="rounded-full p-2 transition-colors hover:bg-secondary md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={activeConv.user.avatar}
                    alt={activeConv.user.name}
                  />
                  <AvatarFallback>
                    {activeConv.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold">{activeConv.user.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    @{activeConv.user.username}
                  </p>
                </div>
              </div>
              <button className="rounded-full p-2 transition-colors hover:bg-secondary">
                <Info className="h-5 w-5" />
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-xl space-y-4">
                {/* User Info */}
                <div className="mb-8 text-center">
                  <Avatar className="mx-auto h-16 w-16">
                    <AvatarImage
                      src={activeConv.user.avatar}
                      alt={activeConv.user.name}
                    />
                    <AvatarFallback>
                      {activeConv.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-3 text-lg font-bold">
                    {activeConv.user.name}
                  </h3>
                  <p className="text-muted-foreground">
                    @{activeConv.user.username}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {activeConv.user.bio}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Joined {activeConv.user.joinDate} ·{" "}
                    {activeConv.user.followers} Followers
                  </p>
                </div>

                {/* Message Bubbles */}
                <AnimatePresence mode="popLayout">
                  {activeConv.messages.map((message) => {
                    const isSent = message.senderId === currentUser.id;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`pr-2 flex ${isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={
                            isSent ? "message-sent" : "message-received"
                          }
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2">
                <button className="text-primary transition-colors hover:text-primary/80">
                  <Image className="h-5 w-5" />
                </button>
                <button className="text-primary transition-colors hover:text-primary/80">
                  <Smile className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyUp={handleKeyPress}
                  placeholder="Start a new message"
                  className="flex-1 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <h2 className="text-3xl font-bold">Select a message</h2>
            <p className="mt-2 text-muted-foreground">
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
            <button className="tweet-button mt-6">New message</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
