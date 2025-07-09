'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Separator from '@/components/ui/separator';
import { Wallet } from '@/types/user';
import { truncateAddress } from '@/utils/helpers/string';
import { Star } from 'lucide-react';
import Link from 'next/link'; // Import Link

interface SellerInfoSectionProps {
  seller: Wallet | undefined;
}

export default function SellerInfoSection({ seller }: SellerInfoSectionProps) {
  // Generate a slug for the seller's ID

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300 h-fit">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl">Seller Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${
                seller?.address || Math.random().toString()
              }`}
            />
          </Avatar>
          <div className="grid gap-1">
            <div className="text-xl font-semibold">{truncateAddress(seller?.address)}</div>
            {/* <div className="text-sm text-gray-500">{displayWallet}</div> */}
            <div className="flex items-center gap-1 text-sm">
              <span className="font-semibold">{seller?.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-500">
                ({Number(seller?.rating || 0) * 10} reviews)
              </span>{' '}
              {/* Mock review count */}
            </div>
          </div>
        </div>
        <Separator className="bg-gray-200" />
        {/* <div className="grid gap-2 text-sm text-gray-700">
          <p>{seller.description}</p>
          <p className="text-gray-500">
            <span className="font-medium">Member since:</span> {seller.joinDate}
          </p>
        </div> */}
        <Link href={`/sellers/${seller?.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full mt-2 bg-transparent border-gray-300 hover:bg-gray-100"
          >
            View Seller Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
