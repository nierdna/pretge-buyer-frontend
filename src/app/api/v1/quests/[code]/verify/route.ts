import { AuthenticatedRequest, withAuth } from '@/server/middleware/auth';
import { QuestService } from '@/server/service/quest.service';
import { QuestVerifyError, QuestVerifyRequest } from '@/server/types/quest';
import { NextResponse } from 'next/server';

const questService = new QuestService();

// Rate limiting map - in production, use Redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per user

async function verifyQuestHandler(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'USER_NOT_FOUND', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Rate limiting
    const userId = user.userId;
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(userId);

    if (userRateLimit) {
      if (now < userRateLimit.resetTime) {
        if (userRateLimit.count >= RATE_LIMIT_MAX) {
          return NextResponse.json(
            {
              success: false,
              error: 'RATE_LIMITED',
              message: 'Too many requests. Please try again later.',
              retryAfter: Math.ceil((userRateLimit.resetTime - now) / 1000),
            },
            { status: 429 }
          );
        }
        userRateLimit.count++;
      } else {
        // Reset window
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Parse request body
    let requestBody: QuestVerifyRequest;
    try {
      requestBody = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PROOF', message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate request structure
    if (!requestBody.proof || typeof requestBody.proof !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PROOF',
          message: 'Proof is required and must be an object',
        },
        { status: 400 }
      );
    }

    // For LINK_TELE and LINK_X quests, validate clickToken
    if (code.includes('LINK') && !requestBody.proof.clickToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PROOF',
          message:
            'clickToken is required for link click quests. Example: {"clickToken": "some-token-value"}',
        },
        { status: 400 }
      );
    }

    // Get idempotency key from header
    const idempotencyKey = req.headers.get('Idempotency-Key') || undefined;

    // Get client info
    const userAgent = req.headers.get('User-Agent') || undefined;
    const forwardedFor = req.headers.get('X-Forwarded-For');
    const realIp = req.headers.get('X-Real-IP');
    const ip = forwardedFor?.split(',')[0].trim() || realIp || undefined;

    // Add meta info to request
    requestBody.meta = {
      ...requestBody.meta,
      userAgent,
      ip,
    };

    // Verify quest
    const result = await questService.verifyQuest(code, userId, requestBody, idempotencyKey);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quest verification error:', error);

    // Handle known errors
    if (error instanceof Error) {
      const errorMessage = error.message as QuestVerifyError;

      switch (errorMessage) {
        case 'QUEST_NOT_FOUND':
          return NextResponse.json(
            { success: false, error: 'QUEST_NOT_FOUND', message: 'Quest not found' },
            { status: 404 }
          );

        case 'QUEST_NOT_ACTIVE':
          return NextResponse.json(
            {
              success: false,
              error: 'QUEST_NOT_ACTIVE',
              message: 'Quest is not active or has expired',
            },
            { status: 400 }
          );

        case 'ALREADY_VERIFIED':
          return NextResponse.json(
            {
              success: false,
              error: 'ALREADY_VERIFIED',
              message: 'You have already completed this quest',
            },
            { status: 409 }
          );

        case 'VERIFICATION_FAILED':
          return NextResponse.json(
            {
              success: false,
              error: 'VERIFICATION_FAILED',
              message: 'Quest verification failed. Please check your proof.',
            },
            { status: 400 }
          );

        case 'INVALID_PROOF':
          return NextResponse.json(
            { success: false, error: 'INVALID_PROOF', message: 'Invalid proof provided' },
            { status: 400 }
          );

        case 'INTERNAL_ERROR':
        default:
          return NextResponse.json(
            { success: false, error: 'INTERNAL_ERROR', message: 'Internal server error' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Wrapper to handle params
async function postHandler(req: AuthenticatedRequest) {
  // Extract code from URL path
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const code = pathSegments[pathSegments.length - 2]; // Get code from /quests/{code}/verify

  return verifyQuestHandler(req, { params: Promise.resolve({ code }) });
}

// Export the POST handler with authentication middleware
export const POST = withAuth(postHandler);
