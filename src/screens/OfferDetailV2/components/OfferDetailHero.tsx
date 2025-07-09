'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Separator from '@/components/ui/separator';
import { IOffer } from '@/types/offer';
import Image from 'next/image';
import { useState } from 'react';

interface OfferDetailHeroProps {
  offer?: IOffer;
}

export default function OfferDetailHero({ offer }: OfferDetailHeroProps) {
  const [buyQuantity, setBuyQuantity] = useState(1);
  const estimatedCost = buyQuantity * Number(offer?.price || 0);

  const handleBuy = () => {
    alert(`Buying ${buyQuantity} ${offer?.tokens?.symbol} for $${estimatedCost.toLocaleString()}`);
    // Implement actual buy logic here
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-gray-300">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative min-w-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={offer?.tokens?.logo || '/placeholder.svg'}
              alt={`${offer?.tokens?.symbol} symbol`}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="grid gap-1">
            <CardTitle className="text-3xl font-bold">{offer?.tokens?.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{offer?.tokens?.symbol}</Badge>
              <Badge variant="outline">{offer?.exToken?.network?.name}</Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-4 text-base text-gray-700">
          {offer?.description}
        </CardDescription>
      </CardHeader>

      <Separator className="mx-6 bg-gray-200" />

      <CardContent className="p-6 grid gap-6">
        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600">Price per Token</Label>
            <div className="text-3xl font-extrabold text-primary mt-1">
              ${offer?.price.toLocaleString()}
            </div>
          </div>
          <div>
            <Label className="text-gray-600">Quantity Available</Label>
            <div className="text-3xl font-extrabold text-gray-800 mt-1">
              {offer?.filled} / {offer?.quantity}
            </div>
          </div>
        </div>

        {/* Payment, Collateral, Settle Time */}
        <div className="grid gap-3 text-base">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment with:</span>
            <div className="flex items-center gap-2 font-medium">
              <Image
                src={offer?.exToken?.logo || '/placeholder.svg'}
                alt={`${offer?.exToken?.symbol} symbol`}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Collateral:</span>
            <span className="font-medium">{`${offer?.collateralPercent}%`}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Settle After TGE:</span>
            <span className="font-medium">{offer?.settleDuration} hours</span>
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Buy Section */}
        <div className="grid gap-4">
          <h3 className="text-xl font-semibold">Purchase Offer</h3>
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="buy-quantity" className="text-gray-600">
                Quantity to Buy
              </Label>
              <Input
                id="buy-quantity"
                type="number"
                value={buyQuantity}
                onChange={(e) =>
                  setBuyQuantity(
                    Math.max(1, Math.min(offer?.quantity || 0, Number(e.target.value)))
                  )
                }
                min={1}
                max={offer?.quantity || 0}
                className="mt-1 bg-white/80 backdrop-blur-sm shadow-sm border-gray-200"
              />
            </div>
            <div>
              <Label className="text-gray-600">Estimated Cost</Label>
              <div className="text-2xl font-bold text-primary mt-1">
                ${estimatedCost.toLocaleString()}
              </div>
            </div>
          </div>
          <Button onClick={handleBuy} className="w-full mt-4" disabled={buyQuantity === 0}>
            Buy Now
          </Button>
        </div>

        <Separator className="bg-gray-200" />

        {/* Terms and Conditions */}
        <div className="grid gap-2 text-sm text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
          <p>{offer?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
