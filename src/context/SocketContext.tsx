'use client';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

export enum ESocketEvent {
  // Connection events
  Connect = 'connect',
  Disconnect = 'disconnect',
  ConnectError = 'connect_error',

  // Server events
  Welcome = 'welcome',
  JoinedRoom = 'joinedRoom',

  // Order events
  NewOrder = 'newOrder',
  OrderCreated = 'orderCreated',
  OrderUpdate = 'orderUpdate',
  OrderStatusChanged = 'orderStatusChanged',

  // Offer events
  OfferUpdate = 'offerUpdate',
}

type SocketContextType = {
  socket: Socket | null;
  subscribe: <T>(event: ESocketEvent, callback: (data: T) => void) => void;
  unsubscribe: <T>(event: ESocketEvent, callback: (data: T) => void) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  useEffect(() => {
    let socketIo: Socket;

    const connectSocket = () => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_NOTI_URL || '';
      console.log(`Attempting to connect to socket at: ${socketUrl}`);

      socketIo = io(socketUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'], // Try WebSocket first, then fallback to polling
      });

      socketIo.on('connect', () => {
        console.log('Socket connected successfully');
        setSocket(socketIo);
        setConnectionError(null);
      });

      socketIo.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnectionError(error);
      });

      socketIo.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setSocket(null);
        if (reason === 'io server disconnect') {
          console.log('Server initiated disconnect. Attempting to reconnect...');
          setTimeout(() => connectSocket(), 5000); // Increased delay to 5 seconds
        }
      });
    };

    connectSocket();

    return () => {
      if (socketIo) {
        console.log('Cleaning up socket connection');
        socketIo.disconnect();
      }
    };
  }, []);

  const subscribe = useCallback(
    <T,>(event: ESocketEvent, callback: (data: T) => void) => {
      socket?.on(event, callback);
    },
    [socket]
  );

  const unsubscribe = useCallback(
    <T,>(event: ESocketEvent, callback: (data: T) => void) => {
      socket?.off(event, callback);
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ socket, subscribe, unsubscribe }}>
      {children}
    </SocketContext.Provider>
  );
};
