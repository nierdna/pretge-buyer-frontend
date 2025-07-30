import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { ISeller } from '@/types/user';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import dayjs from 'dayjs';
import { Star } from 'lucide-react';

interface SellerDetailHeroProps {
  seller?: ISeller;
}

export default function SellerDetailHero({ seller }: SellerDetailHeroProps) {
  return (
    <Card className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-6 md:gap-6">
        <div className="flex justify-center gap-6 sm:justify-between">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src={seller?.avatar || getFallbackAvatar(seller?.name)} />
            </Avatar>
            <div className="grid gap-2 text-center sm:text-left">
              <div className="text-2xl font-bold">{seller?.name}</div>

              <div className="flex items-center justify-center gap-1 text-base sm:justify-start">
                <span className="font-bold">{Number(seller?.rating || 0)}</span>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-content">
                  ({Number(seller?.rating || 0) * 10} reviews)
                </span>{' '}
                {/* Mock review count */}
              </div>
              <p className="mt-2 text-content">
                <span className="font-medium">Member since:</span>{' '}
                {dayjs(seller?.createdAt).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
          <Button className="hidden w-auto md:flex">Contact Seller</Button>
        </div>

        <Separator />
        <div className="grid gap-2 text-base text-gray-700">
          <h3 className="text-xl font-bold text-gray-800">About {seller?.name}</h3>
          <p>{seller?.description}</p>
        </div>
        <Button className="mt-4 w-full md:hidden">Contact Seller</Button>
      </CardContent>
    </Card>
  );
}
