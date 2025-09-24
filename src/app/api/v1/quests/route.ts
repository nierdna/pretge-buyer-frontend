import { QuestService } from '@/server/service/quest.service';
import { verifyAccessToken } from '@/server/utils/jwt';
import { NextRequest, NextResponse } from 'next/server';

const questService = new QuestService();

// GET /api/v1/quests - Get all active quests (with completion status if authenticated)
export async function GET(req: NextRequest) {
  try {
    // Try to get user from auth token (optional)
    let userId: string | undefined;

    try {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        userId = payload.userId;
      }
    } catch (error) {
      // Ignore auth errors - endpoint works without auth too
      console.log('No valid auth token provided, returning quests without completion status');
    }

    const quests = await questService.getAllQuestsWithUserStatus(userId);

    return NextResponse.json({
      success: true,
      data: quests,
      message: 'Quests retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}
