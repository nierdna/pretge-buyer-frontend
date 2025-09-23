import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { QuestService } from '@/server/service/quest.service';
import { NextResponse } from 'next/server';

const questService = new QuestService();

async function getMyQuestsHandler(req: AuthenticatedRequest) {
  try {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userQuests = await questService.getUserQuests(user.userId);

    return NextResponse.json({
      success: true,
      data: userQuests,
      message: 'User quests retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching user quests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user quests' },
      { status: 500 }
    );
  }
}

// GET /api/v1/quests/my-quests - Get current user's quest history
export const GET = withAuth(getMyQuestsHandler);
