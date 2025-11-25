import { cn } from '@/lib/utils';
import { truncateAddress } from '@/utils/helpers/string';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const UserAvatar = ({
  walletAddress,
  className,
}: {
  walletAddress?: string;
  className?: string;
}) => {
  return (
    <Avatar className={cn('size-8', className)}>
      <AvatarImage
        src={`https://api.dicebear.com/9.x/micah/svg?seed=${walletAddress}&radius=50&backgroundColor=ffdfbf,d1d4f9,c0aede,b6e3f4,ffd5dc`}
      />
      <AvatarFallback>{truncateAddress(walletAddress || '', 1)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
