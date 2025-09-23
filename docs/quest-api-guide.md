# Quest API System - Implementation Guide

## Overview

Quest API system đã được triển khai theo tài liệu MVP Point + Quest + Referral ERD. Hệ thống bao gồm:

- **Quest verification endpoint**: `POST /api/v1/quests/{code}/verify`
- **Quest management**: Get active quests, user history, stats
- **Referral system**: 10% reward tự động cho referrer
- **Rate limiting**: 10 requests/minute per user
- **Idempotency**: Support để tránh duplicate submissions

## API Endpoints

### Referral APIs

#### 1. Set Referrer - `POST /api/v1/referral/set-referrer`

Set referrer cho user đã đăng ký (nếu chưa có referrer).

**Headers**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**

```json
{
  "inviteCode": "ABC12345"
}
```

**Success Response (200)**

```json
{
  "success": true,
  "data": {
    "referrerId": "referrer-uuid",
    "inviteCode": "ABC12345"
  },
  "message": "Referrer set successfully"
}
```

#### 2. Validate Invite Code - `GET /api/v1/referral/validate-code?code=ABC12345`

Validate invite code và hiển thị thông tin referrer.

**Response**

```json
{
  "success": true,
  "data": {
    "referrer": {
      "id": "referrer-uuid",
      "name": "Referrer Name",
      "avatar": "avatar-url",
      "inviteCode": "ABC12345"
    },
    "stats": {
      "totalReferrals": 15,
      "totalReferralPoints": 240
    }
  },
  "message": "Valid invite code"
}
```

#### 3. My Referral Code - `GET /api/v1/referral/my-code`

Lấy invite code và referral stats của user hiện tại.

**Headers**

```
Authorization: Bearer <jwt_token>
```

**Response**

```json
{
  "success": true,
  "data": {
    "myInviteCode": "XYZ98765",
    "referredBy": {
      "id": "referrer-uuid",
      "name": "My Referrer",
      "inviteCode": "ABC12345"
    },
    "stats": {
      "totalReferrals": 5,
      "totalReferralPoints": 50
    },
    "recentReferrals": [
      {
        "id": "user-uuid",
        "name": "Referred User",
        "avatar": "avatar-url",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  },
  "message": "Referral data retrieved successfully"
}
```

### Quest APIs

#### 4. Verify Quest - `POST /api/v1/quests/{code}/verify`

**Main endpoint** để verify và complete quests.

#### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Idempotency-Key: <optional_unique_key>
```

#### Request Body Examples

**Social Follow**

```json
{
  "proof": {
    "username": "my_x_handle"
  },
  "meta": {
    "user_agent": "Mozilla/5.0...",
    "ip": "203.0.113.10"
  }
}
```

**Social Retweet**

```json
{
  "proof": {
    "tweet_url": "https://x.com/pretgemarket/status/1234567890",
    "tweet_id": "1234567890"
  }
}
```

**Social Post**

```json
{
  "proof": {
    "tweet_url": "https://x.com/user/status/9876543210",
    "tweet_id": "9876543210"
  }
}
```

**Telegram Join**

```json
{
  "proof": {
    "telegram_user_id": "123456789",
    "telegram_username": "myusername"
  }
}
```

**Referral**

```json
{
  "proof": {
    "referred_user_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Link Click**

```json
{
  "proof": {
    "click_token": "opaque-tracking-token"
  }
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "quest": {
    "code": "FOLLOW_X",
    "type": "SOCIAL_FOLLOW",
    "points": 20
  },
  "user": {
    "id": "user-uuid"
  },
  "result": {
    "status": "verified",
    "awardedPoints": 20,
    "totalPoints": 245,
    "referralReward": {
      "referrerUserId": "referrer-uuid",
      "pointsEarned": 2
    }
  }
}
```

#### Error Responses

```json
// 404 - Quest not found
{
  "success": false,
  "error": "QUEST_NOT_FOUND",
  "message": "Quest not found"
}

// 400 - Quest not active
{
  "success": false,
  "error": "QUEST_NOT_ACTIVE",
  "message": "Quest is not active or has expired"
}

// 409 - Already completed
{
  "success": false,
  "error": "ALREADY_VERIFIED",
  "message": "You have already completed this quest"
}

// 400 - Verification failed
{
  "success": false,
  "error": "VERIFICATION_FAILED",
  "message": "Quest verification failed. Please check your proof."
}

// 429 - Rate limited
{
  "success": false,
  "error": "RATE_LIMITED",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

#### 5. Get Active Quests - `GET /api/v1/quests`

Get all active quests available for completion.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "quest-uuid",
      "code": "FOLLOW_X",
      "title": "Follow us on X",
      "description": "Follow @pretgemarket on X...",
      "type": "SOCIAL_FOLLOW",
      "status": "active",
      "points": 20,
      "metadata": {
        "handle": "@pretgemarket"
      },
      "startAt": null,
      "endAt": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "Quests retrieved successfully"
}
```

#### 6. Get My Quests - `GET /api/v1/quests/my-quests`

Get current user's quest completion history.

#### Headers

```
Authorization: Bearer <jwt_token>
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "user-quest-uuid",
      "userId": "user-uuid",
      "questId": "quest-uuid",
      "status": "verified",
      "proofPayload": {
        "username": "my_x_handle"
      },
      "submittedAt": "2024-01-01T00:00:00Z",
      "verifiedAt": "2024-01-01T00:00:00Z",
      "quest": {
        "code": "FOLLOW_X",
        "title": "Follow us on X",
        "type": "SOCIAL_FOLLOW",
        "points": 20
      }
    }
  ],
  "message": "User quests retrieved successfully"
}
```

#### 7. Get My Stats - `GET /api/v1/quests/my-stats`

Get current user's points and referral statistics.

#### Headers

```
Authorization: Bearer <jwt_token>
```

#### Response

```json
{
  "success": true,
  "data": {
    "totalPoints": 245,
    "completedQuests": 5,
    "referralRewards": 12,
    "totalReferrals": 3
  },
  "message": "User stats retrieved successfully"
}
```

## Quest Types & Metadata

### SOCIAL_FOLLOW

- **Metadata**: `{ "handle": "@pretgemarket" }`
- **Proof**: `{ "username": "user_x_handle" }`
- **Verification**: MVP trusts user input, future integration with X API

### SOCIAL_RETWEET

- **Metadata**: `{ "tweet_id": "1234567890" }`
- **Proof**: `{ "tweet_url": "...", "tweet_id": "..." }`
- **Verification**: Validates tweet ID matches, future X API integration

### SOCIAL_POST

- **Metadata**: `{ "required_tags": ["#PreTGE"], "mention": "@pretgemarket", "min_chars": 120 }`
- **Proof**: `{ "tweet_url": "...", "tweet_id": "..." }`
- **Verification**: Future X API integration for content validation

### TELEGRAM_JOIN

- **Metadata**: `{ "chat_id": "@pretgemarket_community" }`
- **Proof**: `{ "telegram_user_id": "123456789", "telegram_username": "..." }`
- **Verification**: Future Telegram Bot API integration

### REFERRAL

- **Metadata**: `{ "min_action": "REGISTERED" }`
- **Proof**: `{ "referred_user_id": "uuid" }`
- **Verification**: Validates referred user exists

### LINK_X / LINK_TELE

- **Metadata**: `{ "url": "https://..." }`
- **Proof**: `{ "click_token": "opaque-token" }`
- **Verification**: Future tracking system integration

## Database Schema

### Tables Created

- `quests` - Quest definitions
- `user_quests` - User quest completions
- `user_points` - User point totals
- `referral_rewards` - Referral reward history

### Users Table Updates

- `invite_code` - Unique referral code
- `referred_by_user_id` - Reference to referrer

### Automatic Features

- **Points awarding**: Trigger automatically adds points on quest verification
- **Referral rewards**: 10% bonus to referrer automatically calculated
- **Invite code generation**: Auto-generated for all users
- **Duplicate prevention**: Unique constraints prevent double completion

## Rate Limiting

- **Limit**: 10 requests per minute per user
- **Implementation**: In-memory for development, use Redis for production
- **Headers**: Returns `retryAfter` in error response

## Idempotency

- **Header**: `Idempotency-Key`
- **Purpose**: Prevent duplicate submissions
- **Implementation**: Stored in `user_quests.idempotency_key`

## Security Features

- **JWT Authentication**: Required for all user-specific endpoints
- **Input validation**: Strict validation of proof structures
- **SQL injection prevention**: Parameterized queries via Supabase
- **Rate limiting**: Prevents abuse
- **Constraint enforcement**: Database constraints prevent data integrity issues

## Next Steps

1. **External API Integration**:
   - X API for social verification
   - Telegram Bot API for group membership
   - Click tracking system

2. **Enhanced Features**:
   - Quest scheduling (start/end dates)
   - Dynamic point calculations
   - Quest categories and filtering
   - Admin quest management UI

3. **Production Optimizations**:
   - Redis for rate limiting
   - Background job processing
   - Enhanced monitoring and logging
   - Caching for frequently accessed data

### Authentication with Referral Support

Login APIs đã được cập nhật để support referral code:

**EVM Login with Referral**

```json
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Login message",
  "timestamp": 1234567890,
  "referralCode": "ABC12345"
}
```

**Solana Login with Referral**

```json
{
  "walletAddress": "...",
  "signature": "...",
  "message": "Login message",
  "timestamp": 1234567890,
  "referralCode": "ABC12345"
}
```

## File Structure

```
src/
├── server/
│   ├── types/
│   │   ├── quest.ts                    # Quest type definitions
│   │   └── user.ts                     # Updated user types with referral
│   ├── service/
│   │   ├── quest.service.ts            # Quest business logic
│   │   └── auth.service.ts             # Updated with referral support
│   ├── utils/
│   │   ├── quest-validation.ts         # Validation utilities
│   │   ├── base.ts                     # Updated EVM login with referral
│   │   └── solana.ts                   # Updated Solana login with referral
│   └── db/
│       └── migrations/
│           └── quest_system_migration.sql  # Database setup
└── app/
    └── api/
        └── v1/
            ├── referral/
            │   ├── set-referrer/
            │   │   └── route.ts                # POST /set-referrer
            │   ├── validate-code/
            │   │   └── route.ts                # GET /validate-code
            │   └── my-code/
            │       └── route.ts                # GET /my-code
            └── quests/
                ├── route.ts                        # GET /quests
                ├── my-quests/
                │   └── route.ts                    # GET /my-quests
                ├── my-stats/
                │   └── route.ts                    # GET /my-stats
                └── [code]/
                    └── verify/
                        └── route.ts                # POST /verify
```

Quest API system đã sẵn sàng để sử dụng và test!
