'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IOrder } from '@/types/order';
import { Loader2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder;
  onReviewSubmit: (rating: number, comment: string) => Promise<void>;
  isLoading: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  order,
  onReviewSubmit,
  isLoading,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating > 0) {
      await onReviewSubmit(rating, comment);
      setRating(0); // Reset state after submission
      setComment('');
    } else {
      toast.error('Please select a star rating.');
    }
  };
  useEffect(() => {
    if (isOpen && !!order?.review) {
      setRating(order?.review?.rating || 0);
      setComment(order?.review?.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [isOpen, order]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-gray-300 bg-white/95 shadow-2xl backdrop-blur-md sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Order for {order?.offer?.sellerWallet?.user?.name}</DialogTitle>
          <DialogDescription>Share your experience with this order.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating" className="text-base">
              Your Rating
            </Label>
            <div className="flex gap-1" id="rating">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    starValue <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(starValue)}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              maxLength={200}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
