# Zustand Store Implementation

This directory contains Zustand stores for state management in the application.

## Auth Store

The auth store (`authStore.ts`) manages authentication state with persistence. It includes:

- User authentication status
- User information
- Authentication token
- Wallet address
- Actions for login, logout, and user updates

### Usage

```tsx
// Import the hook
import { useAuth } from '@/hooks/useAuth';

// Use in a component
function MyComponent() {
  const {
    isAuthenticated,
    user,
    token,
    walletAddress,
    login,
    logout,
    updateUser,
    setWalletAddress
  } = useAuth();

  // Use the state and actions as needed

  return (
    // Your component JSX
  );
}
```

### Persistence

The auth store uses `zustand/middleware/persist` with browser's `localStorage` to persist authentication state across page refreshes and browser sessions.

### Provider

The `AuthProvider` component in `src/providers/AuthProvider.tsx` initializes the auth store and can be used for additional authentication logic.

## Example

Check the wallet test page at `/wallet` to see the auth store in action.
