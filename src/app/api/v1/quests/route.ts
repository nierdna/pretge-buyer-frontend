import { QuestService } from '@/server/service/quest.service';
import { NextRequest, NextResponse } from 'next/server';

const questService = new QuestService();

// GET /api/v1/quests - Get all active quests
export async function GET(req: NextRequest) {
  try {
    const quests = await questService.getActiveQuests();

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
