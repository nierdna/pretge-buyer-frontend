# Pre-Market XYZ Backend

Backend API cho ứng dụng Pre-Market XYZ được xây dựng với Next.js API Routes và Supabase.

## Cấu trúc thư mục

```
src/server/
├── db/
│   ├── schema.sql          # Database schema cho Supabase
│   └── supabase.ts         # Supabase client configuration
├── enums/
│   └── chain.ts            # Chain type enums
├── service/
│   ├── user.service.ts     # User/Seller management
│   ├── network.service.ts  # Network management
│   ├── exToken.service.ts  # External token management
│   ├── token.service.ts    # Token management
│   ├── offer.service.ts    # Offer management
│   ├── order.service.ts    # Order management
│   ├── review.service.ts   # Review management
│   ├── notification.service.ts # Notification management
│   └── order.service.ts    # Order management
├── types/
│   ├── user.ts             # User/Seller types
│   ├── wallet.ts           # Wallet types
│   ├── network.ts          # Network types
│   ├── exToken.ts          # External token types
│   ├── walletExToken.ts    # Wallet external token types
│   ├── token.ts            # Token types
│   ├── offer.ts            # Offer types
│   ├── order.ts            # Order types
│   ├── review.ts           # Review types
│   ├── notification.ts     # Notification types
│   ├── support.ts          # Support ticket types
│   └── chat.ts             # Chat message types
└── utils/
    └── validation.ts       # Zod validation schemas
```

## Database Schema

### Tables

1. **networks** - Quản lý các blockchain networks
2. **users** - Thông tin người dùng/seller
3. **wallets** - Ví của người dùng
4. **ex_tokens** - External tokens (tokens từ các blockchain khác)
5. **wallet_ex_tokens** - Số dư external tokens trong ví
6. **tokens** - Tokens được tạo trên platform
7. **offers** - Các offer bán token
8. **orders** - Đơn hàng mua token
9. **reviews** - Đánh giá từ người mua
10. **notifications** - Thông báo cho người dùng
11. **support_tickets** - Ticket hỗ trợ
12. **chat_messages** - Tin nhắn chat

### Chain Types

- `evm` - Ethereum Virtual Machine chains (Ethereum, Polygon, BSC, etc.)
- `sol` - Solana
- `sui` - Sui

## API Endpoints

### Networks

- `GET /api/networks` - Lấy danh sách networks
- `GET /api/networks?chainType=evm` - Lấy networks theo chain type
- `POST /api/networks` - Tạo network mới
- `GET /api/networks/[id]` - Lấy network theo ID
- `PATCH /api/networks/[id]` - Cập nhật network
- `DELETE /api/networks/[id]` - Xóa network

### Users/Sellers

- `GET /api/users` - Lấy danh sách sellers
- `GET /api/users?status=active&page=1&limit=10` - Lấy sellers với filter và pagination
- `POST /api/users` - Tạo seller mới
- `GET /api/users/[id]` - Lấy seller theo ID
- `PATCH /api/users/[id]` - Cập nhật seller
- `DELETE /api/users/[id]` - Xóa seller
- `GET /api/users/[id]/wallets` - Lấy wallets của seller
- `POST /api/users/[id]/wallets` - Thêm wallet cho seller

### External Tokens

- `GET /api/ex-tokens` - Lấy danh sách external tokens
- `GET /api/ex-tokens?networkId=xxx&page=1&limit=10` - Lấy tokens theo network
- `GET /api/ex-tokens?query=bitcoin` - Tìm kiếm tokens
- `POST /api/ex-tokens` - Tạo external token mới
- `GET /api/ex-tokens/[id]` - Lấy external token theo ID
- `PATCH /api/ex-tokens/[id]` - Cập nhật external token
- `DELETE /api/ex-tokens/[id]` - Xóa external token

### Wallet External Tokens

- `GET /api/wallet-ex-tokens?walletId=xxx` - Lấy external tokens trong ví
- `GET /api/wallet-ex-tokens?walletId=xxx&chainType=evm` - Lấy tokens theo chain type
- `POST /api/wallet-ex-tokens` - Thêm external token vào ví
- `GET /api/wallet-ex-tokens/[id]` - Lấy wallet external token theo ID
- `PATCH /api/wallet-ex-tokens/[id]` - Cập nhật wallet external token
- `DELETE /api/wallet-ex-tokens/[id]` - Xóa wallet external token

### Tokens

- `GET /api/tokens` - Lấy danh sách tokens
- `GET /api/tokens?status=active&page=1&limit=10` - Lấy tokens với filter
- `POST /api/tokens` - Tạo token mới
- `GET /api/tokens/[id]` - Lấy token theo ID
- `PATCH /api/tokens/[id]` - Cập nhật token
- `DELETE /api/tokens/[id]` - Xóa token

### Offers

- `GET /api/offers` - Lấy danh sách offers
- `GET /api/offers?tokenId=xxx&status=open` - Lấy offers với filter
- `POST /api/offers` - Tạo offer mới
- `GET /api/offers/[id]` - Lấy offer theo ID
- `PATCH /api/offers/[id]` - Cập nhật offer
- `DELETE /api/offers/[id]` - Xóa offer

### Orders

- `GET /api/orders` - Lấy danh sách orders
- `GET /api/orders?buyerWalletId=xxx&status=pending` - Lấy orders với filter
- `POST /api/orders` - Tạo order mới
- `GET /api/orders/[id]` - Lấy order theo ID
- `PATCH /api/orders/[id]` - Cập nhật order
- `DELETE /api/orders/[id]` - Xóa order

### Reviews

- `GET /api/reviews` - Lấy danh sách reviews
- `GET /api/reviews?offerId=xxx&status=approved` - Lấy reviews theo offer
- `GET /api/reviews?buyerId=xxx` - Lấy reviews theo buyer
- `POST /api/reviews` - Tạo review mới
- `GET /api/reviews/[id]` - Lấy review theo ID
- `PATCH /api/reviews/[id]` - Cập nhật review
- `DELETE /api/reviews/[id]` - Xóa review
- `PATCH /api/reviews/[id]/approve` - Duyệt review
- `PATCH /api/reviews/[id]/reject` - Từ chối review
- `PATCH /api/reviews/[id]/reply` - Trả lời review

## Services

### UserService

- Quản lý sellers/users
- Quản lý wallets
- Tìm kiếm và filter users

### NetworkService

- Quản lý blockchain networks
- Filter theo chain type

### ExTokenService

- Quản lý external tokens
- Tìm kiếm tokens
- Filter theo network

### WalletExTokenService

- Quản lý external tokens trong ví
- Cập nhật balance
- Filter theo chain type

### TokenService

- Quản lý tokens trên platform
- Filter theo status và network

### OfferService

- Quản lý offers
- Tính toán filled amount
- Filter theo token và seller

### OrderService

- Quản lý orders
- Cập nhật status
- Filter theo buyer và offer

### ReviewService

- Quản lý reviews
- Tính toán rating statistics
- Duyệt/từ chối reviews

### NotificationService

- Quản lý notifications
- Đánh dấu đã đọc
- Filter theo user

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup

1. **Cài đặt dependencies:**

   ```bash
   npm install @supabase/supabase-js zod
   ```

2. **Tạo Supabase project:**
   - Tạo project mới trên Supabase
   - Lấy URL và anon key

3. **Chạy database schema:**
   - Copy nội dung từ `schema.sql`
   - Chạy trong Supabase SQL Editor

4. **Cấu hình environment variables:**
   - Tạo file `.env.local`
   - Thêm Supabase URL và anon key

5. **Test API:**
   ```bash
   npm run dev
   ```

## Validation

Sử dụng Zod schemas để validate input:

- Tất cả API endpoints đều có validation
- Error messages rõ ràng
- Type safety với TypeScript

## Error Handling

- Consistent error format
- Proper HTTP status codes
- Detailed error messages
- Logging cho debugging

## Pagination

Tất cả endpoints list đều hỗ trợ pagination:

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 10)
- Response bao gồm `total`, `totalPages`

## Filtering

Các endpoints hỗ trợ filtering:

- Status filtering
- Date range filtering
- Search by name/symbol
- Chain type filtering

## Next Steps

1. **Authentication:** Thêm Supabase Auth
2. **Authorization:** Implement RLS policies
3. **Real-time:** Thêm Supabase real-time subscriptions
4. **File upload:** Thêm storage cho images
5. **Webhooks:** Thêm webhook handlers
6. **Rate limiting:** Implement rate limiting
7. **Caching:** Thêm Redis caching
8. **Monitoring:** Thêm logging và monitoring

# Authentication API Documentation

## Overview

This API provides authentication using Solana wallet signatures with JWT tokens.

## Endpoints

### 1. Login with Solana Wallet

**POST** `/api/auth/login`

Login using Solana wallet signature.

**Request Body:**

```json
{
  "walletAddress": "string",
  "signature": "string",
  "message": "string",
  "timestamp": "number"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "avatar": "string | null",
      "banner": "string | null",
      "description": "string | null",
      "socialMedia": {
        "twitter": "string",
        "telegram": "string",
        "discord": "string",
        "instagram": "string",
        "facebook": "string",
        "youtube": "string"
      },
      "kycStatus": "pending | verified | rejected",
      "status": "active | banned | pending",
      "createdAt": "Date",
      "updatedAt": "Date"
    },
    "wallet": {
      "id": "string",
      "userId": "string",
      "chainType": "sol",
      "address": "string",
      "isPrimary": "boolean",
      "createdAt": "Date"
    },
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### 2. Refresh Token

**POST** `/api/auth/refresh`

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### 3. Get Current User

**GET** `/api/auth/me`

Get current user information using access token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "avatar": "string | null",
      "banner": "string | null",
      "description": "string | null",
      "socialMedia": {
        "twitter": "string",
        "telegram": "string",
        "discord": "string",
        "instagram": "string",
        "facebook": "string",
        "youtube": "string"
      },
      "kycStatus": "pending | verified | rejected",
      "status": "active | banned | pending",
      "createdAt": "Date",
      "updatedAt": "Date"
    },
    "walletAddress": "string",
    "chainType": "sol"
  }
}
```

## Usage Examples

### Frontend Login Flow

```typescript
// 1. Generate message for user to sign
const message = `Login to Pre-Market XYZ\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}\nNonce: ${Math.random().toString(36).substring(2)}`;

// 2. Request user to sign message
const signature = await wallet.signMessage(new TextEncoder().encode(message));

// 3. Send login request
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    walletAddress,
    signature: bs58.encode(signature),
    message,
    timestamp: Date.now(),
  }),
});

const result = await response.json();

if (result.success) {
  // Store tokens
  localStorage.setItem('accessToken', result.data.accessToken);
  localStorage.setItem('refreshToken', result.data.refreshToken);
}
```

### Using Protected APIs

```typescript
// Add authorization header to requests
const response = await fetch('/api/protected-endpoint', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});
```

### Refresh Token Flow

```typescript
// When access token expires
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken'),
  }),
});

const refreshResult = await refreshResponse.json();

if (refreshResult.success) {
  // Update stored tokens
  localStorage.setItem('accessToken', refreshResult.data.accessToken);
  localStorage.setItem('refreshToken', refreshResult.data.refreshToken);
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Security Notes

1. **JWT Secrets**: Use strong, unique secrets for JWT_SECRET and JWT_REFRESH_SECRET
2. **Token Expiration**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **Signature Verification**: In production, implement proper signature verification using Solana's native libraries
4. **HTTPS**: Always use HTTPS in production
5. **Token Storage**: Store tokens securely (httpOnly cookies recommended for production)

## Server Documentation

### Authentication

#### Base Network (EVM) Authentication

The server now supports authentication with Base network wallets using EVM-compatible signature verification.

##### API Endpoints

1. **Generate Login Message**

   ```
   POST /api/auth/login-message
   ```

   Request body:

   ```json
   {
     "walletAddress": "0x...",
     "chainType": "evm"
   }
   ```

   Response:

   ```json
   {
     "success": true,
     "data": {
       "message": "Login to Pre-Market XYZ\nWallet: 0x...\nTimestamp: 1234567890\nNonce: abc123",
       "timestamp": 1234567890
     }
   }
   ```

2. **Login with Signature**
   ```
   POST /api/auth/login
   ```
   Request body:
   ```json
   {
     "walletAddress": "0x...",
     "signature": "0x...",
     "message": "Login to Pre-Market XYZ\nWallet: 0x...\nTimestamp: 1234567890\nNonce: abc123",
     "timestamp": 1234567890,
     "chainType": "evm"
   }
   ```
   Response:
   ```json
   {
     "success": true,
     "data": {
       "user": { ... },
       "wallet": { ... },
       "accessToken": "...",
       "refreshToken": "..."
     }
   }
   ```

##### Frontend Integration

1. **Connect Wallet**: Use AppKit to connect Base network wallet
2. **Generate Message**: Call `/api/auth/login-message` to get a message to sign
3. **Sign Message**: Use `personal_sign` method with the wallet
4. **Login**: Call `/api/auth/login` with the signature

##### Example Frontend Flow

```typescript
// 1. Generate login message
const messageResponse = await axios.post('/api/auth/login-message', {
  walletAddress: address,
  chainType: 'evm',
});

// 2. Sign message with wallet
const signature = await provider.request({
  method: 'personal_sign',
  params: [messageResponse.data.message, address],
});

// 3. Login with signature
const loginResponse = await axios.post('/api/auth/login', {
  walletAddress: address,
  signature,
  message: messageResponse.data.message,
  timestamp: messageResponse.data.timestamp,
  chainType: 'evm',
});
```

#### Solana Authentication (Legacy)

Solana authentication is still supported but deprecated in favor of Base network.

#### Database Schema

The authentication system uses the following tables:

- `users`: User information
- `wallets`: Wallet addresses and chain types
- `networks`: Supported networks (Base, Solana, etc.)

#### Security Features

1. **Signature Verification**: All signatures are verified using ethers.js
2. **Timestamp Validation**: Requests expire after 5 minutes
3. **Address Validation**: Wallet addresses are validated for correct format
4. **JWT Tokens**: Secure token-based authentication

#### Configuration

The system supports multiple chain types:

- `evm`: Ethereum-compatible chains (Base, Ethereum, etc.)
- `sol`: Solana
- `sui`: Sui (planned)

#### Migration from Solana to Base

To migrate from Solana to Base network:

1. Update frontend to use Base network wallets
2. Use `chainType: 'evm'` in API calls
3. Use `personal_sign` for message signing
4. Update wallet connection to use Base network

The database schema supports both chain types, so existing users can continue using their accounts.
