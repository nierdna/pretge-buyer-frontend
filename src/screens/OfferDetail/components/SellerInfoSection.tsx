import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { WalletWithUser } from '@/types/user';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import { Dot, Star } from 'lucide-react';
import Link from 'next/link'; // Import Link

interface SellerInfoSectionProps {
  seller?: WalletWithUser;
}

export default function SellerInfoSection({ seller }: SellerInfoSectionProps) {
  // Generate a slug for the seller's ID

  return (
    <Card className="h-fit">
      {/* <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Information</CardTitle>
      </CardHeader> */}
      <CardContent className="p-6 grid grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={seller?.user?.avatar || getFallbackAvatar(seller?.address)} />
          </Avatar>
          <div className="grid gap-1">
            <div className="text-xl flex items-center">
              {seller?.user?.name}
              <Dot className="text-content" size={16} />
              <div className="flex items-center gap-0.5 text-base">
                <span className="">{formatNumberShort(seller?.user?.rating)}</span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 pb-1" />
              </div>
            </div>
            <div className="text-sm text-gray-500">{truncateAddress(seller?.address)}</div>
            <div className="grid gap-2 text-sm text-gray-700">
              <p className="text-gray-500">
                <span className="font-medium">Member since:</span>{' '}
                {dayjs(seller?.user?.createdAt).format('MMM D, YYYY')}
              </p>
            </div>
          </div>
        </div>
        {/* <Separator className="bg-gray-200" /> */}
        <div className="flex flex-col gap-2 ">
          <Link
            href={`/sellers/${seller?.userId}`}
            className="w-full underline font-medium text-end"
          >
            View Seller
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
