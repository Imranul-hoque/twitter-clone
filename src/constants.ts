import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";

// Navigation
export const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Mail, label: "Messages", path: "/messages" },
  { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: MoreHorizontal, label: "More", path: "#" },
];

export const mobileNavItems = [
  { icon: Home, path: "/" },
  { icon: Search, path: "/explore" },
  { icon: Bell, path: "/notifications" },
  { icon: Mail, path: "/messages" },
];

// Types
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  following: number;
  followers: number;
  verified?: boolean;
  isFollowed?: boolean;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  }[];
  createdAt: string;
  relativeTime: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  liked?: boolean;
  retweeted?: boolean;
  bookmarked?: boolean;
  pinned?: boolean;
  parentId?: string;
  quoteTweet?: Tweet;
}

export interface Notification {
  id: string;
  type: "follow" | "like" | "retweet" | "reply" | "mention";
  user: User;
  tweet?: Tweet;
  createdAt: string;
  read?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export interface TrendingTopic {
  id: string;
  category: string;
  topic: string;
  tweetCount: number;
}


export const trendingTopics: TrendingTopic[] = [
  { id: "1", category: "Technology", topic: "#ReactJS", tweetCount: 125000 },
  { id: "2", category: "Programming", topic: "TypeScript", tweetCount: 89000 },
  { id: "3", category: "Trending", topic: "#AI", tweetCount: 234000 },
  { id: "4", category: "Tech", topic: "OpenAI", tweetCount: 156000 },
  { id: "5", category: "Development", topic: "#WebDev", tweetCount: 67000 },
  { id: "6", category: "Gaming", topic: "#GTA6", tweetCount: 445000 },
  {
    id: "7",
    category: "Sports",
    topic: "Champions League",
    tweetCount: 312000,
  },
];

// Current user
export const currentUser: User = {
  id: "1",
  name: "John Developer",
  username: "johndev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600",
  bio: "🚀 Full-stack developer | Building cool stuff with React & TypeScript | Open source enthusiast",
  location: "San Francisco, CA",
  website: "johndev.io",
  joinDate: "March 2020",
  following: 847,
  followers: 12500,
  verified: true,
};

// Sample users
export const users: User[] = [
  {
    id: "2",
    name: "Sarah Tech",
    username: "sarahtech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    bio: "Tech lead @BigTech | Speaker | Writer",
    joinDate: "January 2019",
    following: 432,
    followers: 89000,
    verified: true,
    isFollowed: true,
  },
  {
    id: "3",
    name: "Alex Design",
    username: "alexdesign",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    bio: "UI/UX Designer | Figma advocate",
    joinDate: "June 2020",
    following: 234,
    followers: 45000,
    verified: true,
    isFollowed: true,
  },
  {
    id: "4",
    name: "Mike Code",
    username: "mikecode",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    bio: "Backend wizard | Go, Rust, Python",
    joinDate: "October 2018",
    following: 567,
    followers: 23000,
    isFollowed: false,
  },
];

export const sampleImages = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
];

export const sampleVideos = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];


// Sample tweets (static)
export const sampleTweets: Tweet[] = [
  {
    id: "tweet-1",
    user: users[0],
    content: "Just shipped a new feature! 🚀",
    createdAt: "2026-03-01T12:00:00Z",
    likes: 1200,
    retweets: 300,
    replies: 45,
    views: 12000,
    relativeTime : "now",
  },
  {
    id: "tweet-2",
    relativeTime : "now",
    user: users[1],
    content: "This UI redesign looks clean!",
    createdAt: "2026-03-02T10:00:00Z",
    media: [
      {
        type: "image",
        url: sampleImages[0],
      },
    ],
    likes: 890,
    retweets: 120,
    replies: 32,
    views: 9800,
  },
  {
    relativeTime : "now",
    id: "tweet-3",
    user: users[2],
    content: "Check out this demo video 🔥",
    createdAt: "2026-03-03T08:00:00Z",
    media: [
      {
        type: "video",
        url: sampleVideos[0],
        thumbnail: sampleImages[1],
      },
    ],
    likes: 540,
    retweets: 90,
    replies: 12,
    views: 6500,
  },
];

// Notification generator (hydration safe)
export const generateNotifications = (): Notification[] => [
  {
    id: "1",
    type: "like",
    user: users[0],
    createdAt: "2026-03-04T06:24:31.923Z",
  },
  {
    id: "2",
    type: "follow",
    user: users[1],
    createdAt: "2026-03-04T04:24:31.923Z",
  },
  {
    id: "3",
    type: "retweet",
    user: users[2],
    createdAt: "2026-03-04T02:24:31.923Z",
  },
];

// Conversation generator
export const generateConversations = (): Conversation[] =>
  users.slice(0, 3).map((user, i) => {
    const messages: Message[] = [
      {
        id: `msg-${i}-1`,
        senderId: user.id,
        content: "Hey! How's the project going?",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: `msg-${i}-2`,
        senderId: currentUser.id,
        content: "Going great! Just finished the new feature.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true,
      },
    ];

    return {
      id: `conv-${i}`,
      user,
      messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: i === 0 ? 1 : 0,
    };
  });

// Realtime tweet generator
export const generateRealtimeTweet = (): Tweet => {
  const user = users[Math.floor(Math.random() * users.length)];
  return {
    id: `realtime-${Date.now()}`,
    user,
    content: "🔥 Live update from timeline!",
    createdAt: new Date().toISOString(),
    relativeTime: "now",
    likes: 0,
    retweets: 0,
    replies: 0,
    views: 0,
  };
};

// Replies generator
export const generateReplies = (parentId: string): Tweet[] => {
  return [
    {
      id: `reply-${parentId}-1`,
      user: users[1],
      content: "Totally agree with this! 💯",
      parentId,
      createdAt: new Date().toISOString(),
      relativeTime: "now",
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
    },
  ];
};

// Helpers
export const formatNumber = (num: number): string => {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};
