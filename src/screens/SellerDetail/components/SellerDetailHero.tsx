import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { ISeller } from '@/types/user';
import { getFallbackAvatar } from '@/utils/helpers/getFallbackAvatar';
import dayjs from 'dayjs';
import { Star } from 'lucide-react';

interface SellerDetailHeroProps {
  seller: ISeller;
}

export default function SellerDetailHero({ seller }: SellerDetailHeroProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-24 w-24 flex-shrink-0">
            <AvatarImage src={seller?.avatar || getFallbackAvatar(seller?.name)} />
          </Avatar>
          <div className="grid gap-2 text-center sm:text-left">
            <div className="text-2xl font-bold">{seller?.name}</div>

            <div className="flex items-center justify-center sm:justify-start gap-1 text-base">
              <span className="font-bold">{Number(seller?.rating || 0)}</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-500">
                ({Number(seller?.rating || 0) * 10} reviews)
              </span>{' '}
              {/* Mock review count */}
            </div>
            <p className="text-gray-500 mt-2">
              <span className="font-medium">Member since:</span>{' '}
              {dayjs(seller?.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>
        <Separator className="bg-gray-200" />
        <div className="grid gap-2 text-base text-gray-700">
          <h3 className="text-xl font-bold text-gray-800">About {seller?.name}</h3>
          <p>{seller?.description}</p>
        </div>
        <Button className="w-full sm:w-auto mt-4">Contact Seller</Button>
      </CardContent>
    </Card>
  );
}
