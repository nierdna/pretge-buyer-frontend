import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { QuestService } from '@/server/service/quest.service';
import { NextResponse } from 'next/server';

const questService = new QuestService();

async function getMyStatsHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const stats = await questService.getUserStats(user.userId);

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'User stats retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

// GET /api/v1/quests/my-stats - Get current user's quest stats
export const GET = withAuth(getMyStatsHandler);
