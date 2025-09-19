'use client';
import { Service } from '@/service';
import { LatestOrder } from '@/service/order.service';
import { formatNumberShort } from '@/utils/helpers/number';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// import Image from 'next/image';
import { ESocketEvent, useSocket } from '@/context/SocketContext';

const Topbar = () => {
  const { socket, subscribe } = useSocket();
  const queryClient = useQueryClient();
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const handleNewOrder = (data: { data: LatestOrder }) => {
    // Thêm ID của order mới vào set để trigger animation
    if (data?.data?.id) {
      setNewOrderIds((prev) => new Set(prev).add(data.data.id));

      // Xóa ID sau 2 giây để không hiển thị animation mãi mãi
      setTimeout(() => {
        setNewOrderIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.data.id);
          return newSet;
        });
      }, 2000);
    }

    // Thêm data mới vào đầu dataLatestOrders
    queryClient.setQueryData(['latest-orders'], (oldData: any) => {
      if (!oldData?.data) {
        console.log('No old data found, returning original');
        return oldData;
      }

      const newOrders = [data?.data, ...oldData.data];

      const limitedOrders = newOrders.slice(0, 50);

      const updatedData = {
        ...oldData,
        data: limitedOrders,
      };

      return updatedData;
    });
  };

  useEffect(() => {
    if (socket) {
      subscribe(ESocketEvent.NewOrder, handleNewOrder);
      return () => {
        socket.off(ESocketEvent.NewOrder, handleNewOrder);
      };
    }
  }, [socket, queryClient]);

  const {
    data: dataLatestOrders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['latest-orders'],
    queryFn: () => Service.order.getLatestOrders(),
  });

  if (isLoading) {
    return (
      <div className="flex h-[28px] w-full items-center bg-gray-100">
        <div className="flex animate-pulse gap-2">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="h-4 w-[220px] flex-shrink-0 rounded bg-gray-300" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !dataLatestOrders?.data) {
    return null;
  }

  return (
    <div className="flex h-[32px] w-full items-center border-b border-gray-200 bg-white">
      <div className="scrollbar-hide flex w-full overflow-x-auto">
        <AnimatePresence mode="popLayout">
          {dataLatestOrders.data.map((item: LatestOrder) => {
            const isNewOrder = newOrderIds.has(item.id);

            return (
              <motion.div
                key={item.id}
                initial={isNewOrder ? { x: -100, opacity: 0 } : false}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  duration: 0.3,
                }}
              >
                <motion.div
                  animate={
                    isNewOrder
                      ? {
                          x: [0, -2, 2, -2, 2, -1, 1, 0],
                          scale: [1, 1.02, 1, 1.01, 1],
                          rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
                        }
                      : { x: 0, scale: 1, rotate: 0 }
                  }
                  transition={
                    isNewOrder
                      ? {
                          duration: 0.6,
                          repeat: isNewOrder ? 2 : 0,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }
                      : {}
                  }
                  className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-md border p-2 text-sm ${
                    isNewOrder
                      ? 'border-green-400 bg-green-50 text-green-800 shadow-md ring-2 ring-green-200'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <span
                    className={`font-semibold ${isNewOrder ? 'text-green-900' : 'text-gray-900'}`}
                  >
                    {item.buyer.address.slice(0, 6)}...{item.buyer.address.slice(-4)}
                  </span>
                  <span className={isNewOrder ? 'text-green-600' : 'text-gray-500'}>bought</span>
                  <span
                    className={`font-medium ${isNewOrder ? 'text-green-900' : 'text-gray-900'}`}
                  >
                    {item.offer.title}
                  </span>
                  {/* <Image src={item.offer.image} alt={item.offer.title} width={20} height={20} /> */}
                  <span className={isNewOrder ? 'text-green-600' : 'text-gray-500'}>for</span>
                  <span className="font-medium text-green-600">
                    ${formatNumberShort(Number(item.amount))}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Topbar;
