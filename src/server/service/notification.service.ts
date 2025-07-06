import { supabase } from '../db/supabase';
import { Notification } from '../types/notification';

export class NotificationService {
  // Get all notifications with pagination
  static async getNotifications(page = 1, limit = 10, sellerId?: string) {
    let query = supabase
      .from('notifications')
      .select('*')
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    return {
      notifications: data as Notification[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  // Get notification by ID
  static async getNotificationById(id: string) {
    const { data, error } = await supabase.from('notifications').select('*').eq('id', id).single();

    if (error) {
      throw new Error(`Failed to fetch notification: ${error.message}`);
    }

    return data as Notification;
  }

  // Create new notification
  static async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        seller_id: notificationData.sellerId,
        type: notificationData.type,
        title: notificationData.title,
        content: notificationData.content,
        is_read: notificationData.isRead || false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return data as Notification;
  }

  // Update notification
  static async updateNotification(
    id: string,
    updates: Partial<Omit<Notification, 'id' | 'createdAt'>>
  ) {
    const updateData: any = {};

    if (updates.sellerId) updateData.seller_id = updates.sellerId;
    if (updates.type) updateData.type = updates.type;
    if (updates.title) updateData.title = updates.title;
    if (updates.content) updateData.content = updates.content;
    if (updates.isRead !== undefined) updateData.is_read = updates.isRead;

    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }

    return data as Notification;
  }

  // Delete notification
  static async deleteNotification(id: string) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }

    return true;
  }

  // Mark notification as read
  static async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }

    return data as Notification;
  }

  // Mark all notifications as read for a seller
  static async markAllAsRead(sellerId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('seller_id', sellerId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }

    return true;
  }

  // Get unread notifications count
  static async getUnreadCount(sellerId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', sellerId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }

    return count || 0;
  }

  // Get notifications by type
  static async getNotificationsByType(sellerId: string, type: string, page = 1, limit = 10) {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('type', type)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch notifications by type: ${error.message}`);
    }

    return {
      notifications: data as Notification[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}
