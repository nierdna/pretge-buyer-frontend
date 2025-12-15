import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { WalletWithUser } from '@/types/user';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import { formatNumberShort } from '@/utils/helpers/number';
import { truncateAddress } from '@/utils/helpers/string';
import dayjs from 'dayjs';
import { Dot, Star } from 'lucide-react';

interface SellerInfoSectionProps {
  seller?: WalletWithUser;
}

export default function SellerInfoSection({ seller }: SellerInfoSectionProps) {
  // Generate a slug for the seller's ID

  return (
    <Card className="h-fit border-none">
      {/* <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Information</CardTitle>
      </CardHeader> */}
      <CardContent className="grid grid-cols-1 items-center gap-4 p-0 md:grid-cols-2 md:p-6">
        <div className="flex w-full items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={seller?.user?.avatar || getFallbackAvatar(seller?.address)} />
          </Avatar>
          <div className="grid gap-1">
            <div className="flex items-center text-xl">
              {/* {seller?.user?.name} */}
              {truncateAddress(seller?.address)}
              <Dot className="text-content" size={16} />
              <div className="flex items-center gap-0.5 text-base">
                <span className="">{formatNumberShort(seller?.user?.rating)}</span>
                <Star className="h-5 w-5 fill-yellow-400 pb-1 text-yellow-400" />
              </div>
            </div>
            <div className="text-secondary-foreground grid gap-2 text-sm">
              <p className="text-content">
                <span className="font-medium">Member since:</span>{' '}
                {dayjs(seller?.user?.createdAt).format('MMM D, YYYY')}
              </p>
            </div>
          </div>
        </div>
        {/* <Separator className="bg-border" /> */}
        <div className="flex flex-col gap-2">
          {/* <Link
            href={`/sellers/${seller?.userId}`}
            className="w-full text-start underline md:text-end"
          >
            View Seller
          </Link> */}
        </div>
      </CardContent>
    </Card>
  );
}
