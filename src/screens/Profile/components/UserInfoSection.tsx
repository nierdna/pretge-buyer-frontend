'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Service } from '@/service';
import { useAuthStore } from '@/store/authStore';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { truncateAddress } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import EditProfileModal from './EditProfileModal';

export default function UserInfoSection() {
  const { user, walletAddress, setUser } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const onSave = async (data: { name: string; avatar: string; description: string }) => {
    try {
      const response = await Service.auth.updateProfile(data);
      if (response.success) {
        toast.success('Profile updated successfully');
        setUser({ ...user, ...response.data });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="h-fit border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">User Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage
              src={user?.avatar || getFallbackAvatar(walletAddress)}
              alt={`${user?.name} avatar`}
            />
          </Avatar>
          <div className="grid gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              {' '}
              {/* Flex container for name and edit icon */}
              <div className="text-xl font-bold">{user?.name}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenEditModal}
                className="h-6 w-6 text-content hover:text-gray-700"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile</span>
              </Button>
            </div>
            <div className="text-sm text-content">{truncateAddress(walletAddress)}</div>
            <p className="mt-1 text-content">
              <span className="text-sm font-medium">Member since:</span>{' '}
              {dayjs(user?.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>
        <Separator className="bg-gray-200" />
        <div className="grid gap-2 text-base text-gray-700">
          <h3 className="text-xl font-bold text-gray-800">About {user?.name}</h3>
          <p>{user?.description}</p>
        </div>
      </CardContent>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        initialData={{
          name: user?.name || '',
          avatar: user?.avatar || '',
          description: user?.description || '',
        }}
        walletAddress={walletAddress || ''}
        onSave={onSave}
      />
    </Card>
  );
}
