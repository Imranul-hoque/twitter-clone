"use client"

import { ArrowLeft, ChevronDown, ChevronUp, Search, FileText, ShieldCheck, UserCog, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const faqData = [
  {
    category: 'Getting Started',
    icon: FileText,
    questions: [
      { q: 'How do I create a post?', a: 'Click the "Post" button in the left sidebar or tap the compose icon on mobile. Write your message, add media if you want, and click Post.' },
      { q: 'How do I follow someone?', a: 'Visit their profile and click the "Follow" button. Their posts will then appear in your Following feed.' },
      { q: 'How do I edit my profile?', a: 'Go to your Profile page and click the "Edit profile" button to update your name, bio, location, and website.' },
    ],
  },
  {
    category: 'Account & Security',
    icon: ShieldCheck,
    questions: [
      { q: 'How do I change my password?', a: 'Go to Settings > Your account > Change your password. Enter your current password and then your new password.' },
      { q: 'How do I enable two-factor authentication?', a: 'Navigate to Settings > Security and account access > Two-factor authentication and follow the setup wizard.' },
      { q: 'How do I deactivate my account?', a: 'Go to Settings > Your account > Deactivate your account. Your data will be retained for 30 days before permanent deletion.' },
    ],
  },
  {
    category: 'Privacy',
    icon: UserCog,
    questions: [
      { q: 'How do I make my account private?', a: 'Go to Settings > Privacy and safety and toggle "Protect your posts." Only approved followers will see your posts.' },
      { q: 'How do I block or mute someone?', a: 'Click the three-dot menu on any user\'s profile or post and select "Block" or "Mute."' },
    ],
  },
  {
    category: 'Using the Platform',
    icon: MessageCircle,
    questions: [
      { q: 'What are bookmarks?', a: 'Bookmarks let you privately save posts to read later. Click the bookmark icon on any post to save it. View them in the Bookmarks page.' },
      { q: 'How do direct messages work?', a: 'Go to Messages to view your conversations. You can send text messages to any user who has DMs enabled.' },
      { q: 'How do I schedule a post?', a: 'When composing a post, click the calendar icon to pick a date and time for your post to be published automatically.' },
    ],
  },
];

const HelpCenter = () => {
  const router = useRouter()
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredData = faqData.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (

      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
          <button onClick={() => router.back()} className="rounded-full p-1.5 transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Help Center</h1>
        </div>

        {/* Search */}
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="flex flex-col">
          {filteredData.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.category} className="border-b border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">{cat.category}</h2>
                </div>
                {cat.questions.map((item) => {
                  const key = `${cat.category}-${item.q}`;
                  const isOpen = openItems.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleItem(key)}
                      className="flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium pr-4">{item.q}</p>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </div>
                      {isOpen && (
                        <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{search}"
            </div>
          )}
        </div>
      </div>
  );
};

export default HelpCenter;
