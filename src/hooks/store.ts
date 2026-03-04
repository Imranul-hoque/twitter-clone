import { create } from "zustand";
import {
  Tweet,
  Notification,
  Conversation,
  sampleTweets,
  generateNotifications,
  generateConversations,
  generateRealtimeTweet,
  generateReplies,
  currentUser,
  User,
  users,
} from "@/constants";

type FeedTab = "for-you" | "following";

interface AppState {
  currentUser: User;
  followedUsers: Set<string>;

  tweets: Tweet[];
  isLoadingTweets: boolean;
  hasMoreTweets: boolean;
  cursor: number;
  initialized: boolean;

  feedTab: FeedTab;

  pendingTweets: Tweet[];
  pendingTweetsCount: number;

  activeNav: string;
  composerOpen: boolean;
  quoteTweetTarget: Tweet | null;

  notifications: Notification[];
  unreadNotifications: number;

  conversations: Conversation[];
  activeConversation: string | null;

  setActiveNav: (nav: string) => void;
  setComposerOpen: (open: boolean) => void;
  setFeedTab: (tab: FeedTab) => void;
  loadMoreTweets: () => Promise<void>;
  toggleLike: (tweetId: string) => void;
  toggleRetweet: (tweetId: string) => void;
  toggleBookmark: (tweetId: string) => void;
  toggleFollow: (userId: string) => void;
  addTweet: (
    content: string,
    media?: { type: "image" | "video"; url: string }[],
    replyToId?: string,
    quoteTweet?: Tweet
  ) => void;
  deleteTweet: (tweetId: string) => void;
  pinTweet: (tweetId: string) => void;
  setQuoteTweetTarget: (tweet: Tweet | null) => void;
  addRealtimeTweet: () => void;
  showPendingTweets: () => void;
  getReplies: (tweetId: string) => Tweet[];
  getQuoteTweets: (tweetId: string) => Tweet[];
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markNotificationsRead: () => void;
  initReplies: (tweetId: string) => void;
  updateProfile: (
    updates: Partial<Pick<User, "name" | "bio" | "location" | "website">>
  ) => void;

  initTweets: () => void;
}

// hydrate-safe followed users (deterministic)
const initialFollowed = new Set<string>();
users.forEach((u) => {
  if (u.isFollowed) initialFollowed.add(u.id);
});

export const useAppStore = create<AppState>((set, get) => ({
  currentUser,
  followedUsers: initialFollowed,

  tweets: sampleTweets,
  isLoadingTweets: false,
  hasMoreTweets: true,
  cursor: 10,
  initialized: false,

  feedTab: "for-you",

  pendingTweets: [],
  pendingTweetsCount: 0,

  activeNav: "home",
  composerOpen: false,
  quoteTweetTarget: null,

  notifications: generateNotifications(),
  unreadNotifications: 3,
  conversations: generateConversations(),
  activeConversation: null,

  initTweets: () => {
    set((state) => {
      if (state.initialized) return state;

      return {
        tweets: sampleTweets,
        initialized: true,
      };
    });
  },

  setActiveNav: (nav) => set({ activeNav: nav }),

  setComposerOpen: (open) =>
    set({
      composerOpen: open,
      quoteTweetTarget: open ? get().quoteTweetTarget : null,
    }),

  setFeedTab: (tab) => set({ feedTab: tab }),

  loadMoreTweets: async () => {
    const { hasMoreTweets } = get();
    if (!hasMoreTweets) return;

    set({ isLoadingTweets: true });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTweets = sampleTweets.map((t) => ({
      ...t,
      id: `${t.id}-page-${Date.now()}`,
    }));

    set((state) => ({
      tweets: [...state.tweets, ...newTweets],
      cursor: state.cursor + 10,
      hasMoreTweets: false,
      isLoadingTweets: false,
    }));
  },

  toggleLike: (tweetId) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              liked: !tweet.liked,
              likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1,
            }
          : tweet
      ),
    }));
  },

  toggleRetweet: (tweetId) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              retweeted: !tweet.retweeted,
              retweets: tweet.retweeted
                ? tweet.retweets - 1
                : tweet.retweets + 1,
            }
          : tweet
      ),
    }));
  },

  toggleBookmark: (tweetId) => {
    set((state) => ({
      tweets: state.tweets.map((tweet) =>
        tweet.id === tweetId
          ? { ...tweet, bookmarked: !tweet.bookmarked }
          : tweet
      ),
    }));
  },

  toggleFollow: (userId) => {
    set((state) => {
      const next = new Set(state.followedUsers);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return { followedUsers: next };
    });
  },

  addTweet: (content, media, replyToId, quoteTweet) => {
    const newTweet: Tweet = {
      id: `tweet-${Date.now()}`,
      user: currentUser,
      content,
      relativeTime: "now",
      media,
      parentId: replyToId,
      quoteTweet,
      createdAt: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
    };

    set((state) => ({
      tweets: replyToId ? [...state.tweets, newTweet] : [newTweet, ...state.tweets],
      composerOpen: false,
      quoteTweetTarget: null,
    }));
  },

  deleteTweet: (tweetId) => {
    set((state) => ({
      tweets: state.tweets.filter((t) => t.id !== tweetId),
    }));
  },

  pinTweet: (tweetId) => {
    set((state) => ({
      tweets: state.tweets.map((t) => ({
        ...t,
        pinned: t.id === tweetId ? !t.pinned : false,
      })),
    }));
  },

  setQuoteTweetTarget: (tweet) => set({ quoteTweetTarget: tweet }),

  addRealtimeTweet: () => {
    const newTweet = generateRealtimeTweet();
    set((state) => ({
      pendingTweets: [newTweet, ...state.pendingTweets],
      pendingTweetsCount: state.pendingTweetsCount + 1,
    }));
  },

  showPendingTweets: () => {
    set((state) => ({
      tweets: [...state.pendingTweets, ...state.tweets],
      pendingTweets: [],
      pendingTweetsCount: 0,
    }));
  },

  getReplies: (tweetId: string) => {
    return get().tweets.filter((t) => t.parentId === tweetId);
  },

  getQuoteTweets: (tweetId: string) => {
    return get().tweets.filter((t) => t.quoteTweet?.id === tweetId);
  },

  initReplies: (tweetId: string) => {
    const { tweets } = get();
    const exists = tweets.some((t) => t.parentId === tweetId);
    if (!exists) {
      const replies = generateReplies(tweetId);
      set((state) => ({ tweets: [...state.tweets, ...replies] }));
    }
  },

  setActiveConversation: (id) => set({ activeConversation: id }),

  sendMessage: (conversationId, content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      createdAt: new Date(),
      read: false,
    };

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage,
            }
          : conv
      ),
    }));
  },

  markNotificationsRead: () => set({ unreadNotifications: 0 }),

  updateProfile: (updates) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates },
    }));
  },
}));