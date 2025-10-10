import { ETokenStatus } from '@/types/token';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export type SettleStatus =
  | 'ended'
  | 'cancelled'
  | 'purchase'
  | 'not_purchase'
  | 'settling'
  | 'settled';

interface UseSettleStatusProps {
  startTime?: string;
  settleDuration?: number;
  tokenStatus?: ETokenStatus;
  callBack?: (status: SettleStatus) => void;
}

interface SettleStatusInfo {
  status: SettleStatus;
  timeUntilStart?: number; // days
  timeUntilSettle?: number; // hours
  canPurchase: boolean;
  message: string;
  color: 'yellow' | 'red' | 'green' | 'gray';
}

export const useSettleStatus = ({
  startTime,
  settleDuration = 0,
  tokenStatus,
  callBack,
}: UseSettleStatusProps): SettleStatusInfo => {
  const [statusInfo, setStatusInfo] = useState<SettleStatusInfo>({
    status: 'purchase',
    canPurchase: true,
    message:
      'Complete payment for all pending orders at least 1 day before token TGE. If not completed, you will lose your collateral and seller will lose their collateral.',
    color: 'yellow',
  });

  const calculateStatus = (): SettleStatusInfo => {
    const now = dayjs();

    // Case 1: Token status ended
    if (tokenStatus === ETokenStatus.ENDED) {
      return {
        status: 'ended',
        canPurchase: false,
        message: 'Token has ended.',
        color: 'gray',
      };
    }

    // Case 2: Token status cancelled
    if (tokenStatus === ETokenStatus.CANCELLED) {
      return {
        status: 'cancelled',
        canPurchase: false,
        message: 'Token has been cancelled.',
        color: 'gray',
      };
    }

    // Case 3: No startTime or more than 1 day before startTime
    if (!startTime) {
      return {
        status: 'purchase',
        canPurchase: true,
        message:
          'Complete payment for all pending orders at least 1 day before token TGE. If not completed, you will lose your collateral and seller will lose their collateral.',
        color: 'yellow',
      };
    }

    const startTimeDate = dayjs(startTime);
    const timeUntilStart = startTimeDate.diff(now, 'day', true);

    // Case 4: Less than 1 day before startTime
    if (timeUntilStart < 1 && timeUntilStart > 0) {
      return {
        status: 'not_purchase',
        timeUntilStart,
        canPurchase: false,
        message:
          'Payment deadline has passed. No more purchases allowed before TGE. Incomplete orders will lose collateral and seller will lose their collateral.',
        color: 'red',
      };
    }

    // Case 5: After startTime + settleDuration
    const settleTime = startTimeDate.add(settleDuration, 'hour');
    if (now.isAfter(settleTime)) {
      return {
        status: 'settled',
        timeUntilSettle: 0,
        canPurchase: false,
        message: 'The settle period has ended. Contact support if you have any issues.',
        color: 'gray',
      };
    }

    // Case 6: After startTime but before settleTime (settling period)
    if (now.isAfter(startTimeDate)) {
      const timeUntilSettle = settleTime.diff(now, 'hour');
      const timeUntilSettleMinutes = settleTime.diff(now, 'minute');
      const timeUntilSettleSeconds = settleTime.diff(now, 'second');

      // Format time display with seconds for real-time countdown
      let timeDisplay = '';
      if (timeUntilSettle > 0) {
        const remainingMinutes = timeUntilSettleMinutes % 60;
        const remainingSeconds = timeUntilSettleSeconds % 60;
        timeDisplay = `${timeUntilSettle}h ${remainingMinutes}m ${remainingSeconds}s remaining`;
      } else if (timeUntilSettleMinutes > 0) {
        const remainingSeconds = timeUntilSettleSeconds % 60;
        timeDisplay = `${timeUntilSettleMinutes}m ${remainingSeconds}s remaining`;
      } else if (timeUntilSettleSeconds > 0) {
        timeDisplay = `${timeUntilSettleSeconds}s remaining`;
      } else {
        timeDisplay = 'Less than 1 second remaining';
      }

      return {
        status: 'settling',
        timeUntilSettle,
        canPurchase: false,
        message: `TGE has started! You can now settle your orders. Settle period: ${timeDisplay}.`,
        color: 'green',
      };
    }

    // Case 7: More than 1 day before startTime (default purchase case)
    return {
      status: 'purchase',
      timeUntilStart,
      canPurchase: true,
      message: `Complete payment for all pending orders within ${Math.ceil(timeUntilStart)} day${Math.ceil(timeUntilStart) > 1 ? 's' : ''} before TGE. If not completed, you will lose your collateral and seller will lose their collateral.`,
      color: 'yellow',
    };
  };

  useEffect(() => {
    // Calculate initial status
    const initialStatus = calculateStatus();
    setStatusInfo(initialStatus);
    callBack?.(initialStatus.status);

    // Set up interval to update status
    const interval = setInterval(() => {
      const updatedStatus = calculateStatus();
      setStatusInfo(updatedStatus);
      callBack?.(updatedStatus.status);
    }, 1000); // Update every second

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [startTime, settleDuration, tokenStatus]);

  return statusInfo;
};

// Helper function to get status display info
export const getSettleStatusDisplay = (status: SettleStatus) => {
  switch (status) {
    case 'ended':
      return {
        icon: '⏰',
        title: 'Token Ended',
        className: 'border-border bg-card text-gray-700',
      };
    case 'cancelled':
      return {
        icon: '❌',
        title: 'Token Cancelled',
        className: 'border-border bg-card text-gray-700',
      };
    case 'purchase':
      return {
        icon: '⚠️',
        title: 'Payment Deadline Warning',
        className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      };
    case 'not_purchase':
      return {
        icon: '🚫',
        title: 'Payment Period Ended',
        className: 'border-red-200 bg-red-50 text-red-700',
      };
    case 'settling':
      return {
        icon: '✅',
        title: 'Settle Time Active',
        className: 'border-green-200 bg-green-50 text-green-700',
      };
    case 'settled':
      return {
        icon: '⏰',
        title: 'Settle Period Ended',
        className: 'border-border bg-card text-gray-700',
      };
    default:
      return {
        icon: '⚠️',
        title: 'Unknown Status',
        className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      };
  }
};
