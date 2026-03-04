"use client"

import { ArrowLeft, ChevronRight, Lock, Eye, Bell, Shield, Globe, Accessibility } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const NotificationToggle = ({ label }: { label: string }) => {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <p className="font-medium">{label}</p>
      <Switch checked={on} onCheckedChange={(v) => { setOn(v); toast.success(`${label} notifications ${v ? 'enabled' : 'disabled'}`); }} />
    </div>
  );
};

const settingsSections = [
  {
    title: 'Your account',
    description: 'See information about your account, download an archive of your data, or learn about your account deactivation options.',
    icon: Lock,
  },
  {
    title: 'Security and account access',
    description: "Manage your account's security and keep track of your account's usage.",
    icon: Shield,
  },
  {
    title: 'Privacy and safety',
    description: 'Manage what information you see and share on the platform.',
    icon: Eye,
  },
  {
    title: 'Notifications',
    description: 'Select the kinds of notifications you get about your activities, interests, and recommendations.',
    icon: Bell,
  },
  {
    title: 'Accessibility',
    description: 'Manage how content is displayed to you.',
    icon: Accessibility,
  },
  {
    title: 'Additional resources',
    description: 'Check out other places for helpful information.',
    icon: Globe,
  },
];

const Settings = () => {
  const router = useRouter();
  const [protectTweets, setProtectTweets] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const handleSectionClick = (title: string) => {
    setShowDetail(title);
  };

  const renderDetail = () => {
    switch (showDetail) {
      case 'Privacy and safety':
        return (
          <div className="flex flex-col gap-4 p-4">
            <button onClick={() => setShowDetail(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xl font-bold text-foreground">Privacy and safety</span>
            </button>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Protect your posts</p>
                <p className="text-sm text-muted-foreground">Only followers can see your posts</p>
              </div>
              <Switch checked={protectTweets} onCheckedChange={(v) => { setProtectTweets(v); toast.success(v ? 'Posts protected' : 'Posts are now public'); }} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">Allow message requests</p>
                <p className="text-sm text-muted-foreground">Let anyone send you a direct message</p>
              </div>
              <Switch checked={allowDMs} onCheckedChange={(v) => { setAllowDMs(v); toast.success(v ? 'DMs enabled' : 'DMs restricted to followers'); }} />
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div className="flex flex-col gap-4 p-4">
            <button onClick={() => setShowDetail(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xl font-bold text-foreground">Notifications</span>
            </button>
            {['Likes', 'Reposts', 'Mentions', 'New followers', 'Direct messages'].map((item) => (
              <NotificationToggle key={item} label={item} />
            ))}
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4 p-4">
            <button onClick={() => setShowDetail(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xl font-bold text-foreground">{showDetail}</span>
            </button>
            <p className="text-muted-foreground">Settings for this section are coming soon.</p>
          </div>
        );
    }
  };

  return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
          <button onClick={() => router.back()} className="rounded-full p-1.5 transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        {showDetail ? (
          renderDetail()
        ) : (
          <div className="flex flex-col">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.title}
                  onClick={() => handleSectionClick(section.title)}
                  className="flex items-center gap-4 border-b border-border px-4 py-4 text-left transition-colors hover:bg-secondary/50"
                >
                  <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{section.title}</p>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </div>
  );
};

export default Settings;
