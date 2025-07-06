import { generateBaseLoginMessage, validateBaseLoginRequest } from '../../utils/base';
import { AuthService } from '../auth.service';

// Mock Supabase
jest.mock('../../db/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Not found' },
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: 'test-user-id',
              name: 'Test User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

// Mock JWT utils
jest.mock('../../utils/jwt', () => ({
  generateTokenPair: jest.fn(() => ({
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  })),
}));

describe('AuthService - Base Network', () => {
  const mockWalletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  const mockMessage = generateBaseLoginMessage(mockWalletAddress);
  const mockTimestamp = Date.now();

  describe('loginWithBase', () => {
    it('should successfully login with valid Base network credentials', async () => {
      // Mock a valid signature (this would be a real signature in production)
      const mockSignature = '0x1234567890abcdef...';

      const loginRequest = {
        walletAddress: mockWalletAddress,
        signature: mockSignature,
        message: mockMessage,
        timestamp: mockTimestamp,
      };

      // Mock successful wallet creation
      const mockSupabase = jest.requireMock('../../db/supabase').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {
                id: 'test-wallet-id',
                user_id: 'test-user-id',
                chain_type: 'evm',
                address: mockWalletAddress,
                is_primary: true,
                created_at: new Date().toISOString(),
              },
              error: null,
            })),
          })),
        })),
      });

      const result = await AuthService.loginWithBase(loginRequest);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.user).toBeDefined();
      expect(result.data?.wallet).toBeDefined();
      expect(result.data?.accessToken).toBeDefined();
      expect(result.data?.refreshToken).toBeDefined();
    });

    it('should fail with invalid wallet address', async () => {
      const loginRequest = {
        walletAddress: 'invalid-address',
        signature: '0x1234567890abcdef...',
        message: mockMessage,
        timestamp: mockTimestamp,
      };

      const result = await AuthService.loginWithBase(loginRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid wallet address format');
    });

    it('should fail with missing signature', async () => {
      const loginRequest = {
        walletAddress: mockWalletAddress,
        signature: '',
        message: mockMessage,
        timestamp: mockTimestamp,
      };

      const result = await AuthService.loginWithBase(loginRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Signature is required');
    });

    it('should fail with expired timestamp', async () => {
      const expiredTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago

      const loginRequest = {
        walletAddress: mockWalletAddress,
        signature: '0x1234567890abcdef...',
        message: mockMessage,
        timestamp: expiredTimestamp,
      };

      const result = await AuthService.loginWithBase(loginRequest);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Request expired');
    });
  });
});

describe('Base Network Utils', () => {
  const mockWalletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  describe('generateBaseLoginMessage', () => {
    it('should generate a valid login message', () => {
      const message = generateBaseLoginMessage(mockWalletAddress);

      expect(message).toContain('Login to Pre-Market XYZ');
      expect(message).toContain(mockWalletAddress);
      expect(message).toContain('Timestamp:');
      expect(message).toContain('Nonce:');
    });

    it('should generate different messages for same address', () => {
      const message1 = generateBaseLoginMessage(mockWalletAddress);
      const message2 = generateBaseLoginMessage(mockWalletAddress);

      expect(message1).not.toBe(message2);
    });
  });

  describe('validateBaseLoginRequest', () => {
    it('should validate a correct request', () => {
      const message = generateBaseLoginMessage(mockWalletAddress);
      const request = {
        walletAddress: mockWalletAddress,
        signature: '0x1234567890abcdef...',
        message,
        timestamp: Date.now(),
      };

      const result = validateBaseLoginRequest(request);

      expect(result.success).toBe(true);
    });

    it('should reject invalid wallet address', () => {
      const request = {
        walletAddress: 'invalid-address',
        signature: '0x1234567890abcdef...',
        message: 'test message',
        timestamp: Date.now(),
      };

      const result = validateBaseLoginRequest(request);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid wallet address format');
    });
  });
});
