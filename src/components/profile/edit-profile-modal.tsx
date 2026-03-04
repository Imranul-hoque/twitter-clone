"use client"

import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/hooks/store';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
  const { currentUser, updateProfile } = useAppStore();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.website || '');

  const handleSave = () => {
    updateProfile({ name: name.trim(), bio: bio.trim(), location: location.trim(), website: website.trim() });
    onOpenChange(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (val) {
      setName(currentUser.name);
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setWebsite(currentUser.website || '');
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-150 gap-0 overflow-hidden rounded-2xl p-0">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3">
          <button onClick={() => onOpenChange(false)} className="rounded-full p-1 transition-colors hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="flex-1 text-lg font-bold">Edit profile</DialogTitle>
          <Button onClick={handleSave} disabled={!name.trim()} className="rounded-full px-4 font-bold" size="sm">
            Save
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {/* Banner */}
          <div className="relative h-48 bg-linear-to-r from-primary/50 to-primary/30">
            {currentUser.banner && (
              <img src={currentUser.banner} alt="Banner" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30">
              <button className="rounded-full bg-black/50 p-3 transition-colors hover:bg-black/70">
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative px-4">
            <div className="absolute -top-12">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 transition-colors hover:bg-black/50">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-16 space-y-6 px-4 pb-6">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="rounded-md border-border bg-transparent"
              />
              <p className="text-right text-xs text-muted-foreground">{name.length}/50</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="resize-none rounded-md border-border bg-transparent"
              />
              <p className="text-right text-xs text-muted-foreground">{bio.length}/160</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={30}
                className="rounded-md border-border bg-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Website</label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={100}
                className="rounded-md border-border bg-transparent"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
