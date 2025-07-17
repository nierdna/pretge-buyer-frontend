'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UploadButton from '@/components/ui/upload-button';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name?: string;
    avatar?: string;
    description?: string;
  };
  onSave: (data: { name: string; avatar: string; description: string }) => Promise<void>;
  walletAddress: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  walletAddress,
}: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name);
  const [avatar, setAvatar] = useState(initialData.avatar);
  const [description, setDescription] = useState(initialData.description);

  // Update state when initialData changes (e.g., when modal is opened with new data)
  useEffect(() => {
    setName(initialData.name);
    setAvatar(initialData.avatar);
    setDescription(initialData.description);
  }, [initialData]);

  const handleSave = async () => {
    if (name?.trim() === '') {
      toast.error('Name is required');
      return;
    }
    await onSave({
      name: name || '',
      avatar: avatar || '',
      description: description || '',
    });
    onClose();
  };

  const handleAvatarUploadSuccess = (url: string) => {
    setAvatar(url);
  };

  const handleAvatarUploadError = (error: string) => {
    console.error('Avatar upload error:', error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar || getFallbackAvatar(walletAddress)} alt="Avatar" />
              </Avatar>
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:z-10 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                <UploadButton
                  onUploadSuccess={handleAvatarUploadSuccess}
                  onUploadError={handleAvatarUploadError}
                  variant="secondary"
                  size="sm"
                  className="h-24 w-24 rounded-full p-0"
                  accept="image/*"
                />
              </div>
            </div>
            {/* <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="avatar-url">Avatar URL</Label>
              <Input
                autoComplete="off"
                id="avatar-url"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="/placeholder.svg?height=96&width=96"
              />
            </div> */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              autoComplete="off"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              autoComplete="off"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
