import { supabase } from '../db/supabase';
import { Review } from '../types/review';

function mapReview(row: any): Review {
  return {
    id: row.id,
    offerId: row.offer_id ?? null,
    buyerId: row.buyer_id,
    rating: row.rating,
    comment: row.comment,
    reply: row.reply ?? null,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ReviewService {
  // Get all reviews with pagination
  static async getReviews(page = 1, limit = 10, status?: 'pending' | 'approved' | 'rejected') {
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    return {
      reviews: (data || []).map(mapReview),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get review by ID
  static async getReviewById(id: string) {
    const { data, error } = await supabase.from('reviews').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch review: ${error.message}`);
    }

    return mapReview(data);
  }

  // Create new review
  static async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        offer_id: reviewData.offerId ?? null,
        buyer_id: reviewData.buyerId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        reply: reviewData.reply ?? null,
        status: reviewData.status ?? 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return mapReview(data);
  }

  // Update review
  static async updateReview(
    id: string,
    updates: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const updateData: any = {};
    if (updates.offerId !== undefined) updateData.offer_id = updates.offerId;
    if (updates.buyerId !== undefined) updateData.buyer_id = updates.buyerId;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.comment !== undefined) updateData.comment = updates.comment;
    if (updates.reply !== undefined) updateData.reply = updates.reply;
    if (updates.status !== undefined) updateData.status = updates.status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }

    return mapReview(data);
  }

  // Delete review
  static async deleteReview(id: string) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }

    return true;
  }

  // Get reviews by offer
  static async getReviewsByOffer(offerId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('offer_id', offerId)
      .eq('status', 'approved')
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch offer reviews: ${error.message}`);
    }

    return {
      reviews: (data || []).map(mapReview),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get reviews by buyer
  static async getReviewsByBuyer(buyerId: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('buyer_id', buyerId)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch buyer reviews: ${error.message}`);
    }

    return {
      reviews: (data || []).map(mapReview),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get shop reviews (reviews without offer_id)
  static async getShopReviews(page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .is('offer_id', null)
      .eq('status', 'approved')
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch shop reviews: ${error.message}`);
    }

    return {
      reviews: (data || []).map(mapReview),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Approve review
  static async approveReview(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to approve review: ${error.message}`);
    }

    return mapReview(data);
  }

  // Reject review
  static async rejectReview(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to reject review: ${error.message}`);
    }

    return mapReview(data);
  }

  // Add reply to review
  static async addReply(id: string, reply: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        reply,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add reply: ${error.message}`);
    }

    return mapReview(data);
  }

  // Get offer rating statistics
  static async getOfferRatingStats(offerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('offer_id', offerId)
      .eq('status', 'approved');

    if (error) {
      throw new Error(`Failed to fetch offer rating stats: ${error.message}`);
    }

    if (data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratings = data.map((review: any) => review.rating);
    const averageRating =
      ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating: number) => {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: ratings.length,
      ratingDistribution,
    };
  }

  // Get shop rating statistics
  static async getShopRatingStats() {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .is('offer_id', null)
      .eq('status', 'approved');

    if (error) {
      throw new Error(`Failed to fetch shop rating stats: ${error.message}`);
    }

    if (data.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratings = data.map((review: any) => review.rating);
    const averageRating =
      ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating: number) => {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: ratings.length,
      ratingDistribution,
    };
  }
}
