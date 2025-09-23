'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface DistributionRecord {
  timestamp: string;
  rewards: number;
  txHash: string;
}

// Mock data - replace with actual API calls
const mockDistributions: DistributionRecord[] = [
  // Empty for now, matching the image
  {
    timestamp: '2025-01-01',
    rewards: 100,
    txHash: '0x1234567890',
  },
  {
    timestamp: '2025-01-01',
    rewards: 100,
    txHash: '0x1234567890',
  },
];

export default function DistributionHistory() {
  return (
    <Card className="bg-white/95">
      <CardHeader>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-gray-900" />
          <CardTitle className="text-gray-900">Distribution History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {mockDistributions.length === 0 ? (
          <div className="py-8">
            <Table>
              <TableHeader>
                <TableRow className="border-line hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-content">Timestamp ⓘ</TableHead>
                  <TableHead className="text-xs font-medium text-content">Rewards ⓘ</TableHead>
                  <TableHead className="text-xs font-medium text-content">Tx. Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-line hover:bg-transparent">
                  <TableCell colSpan={3} className="py-8 text-center text-content">
                    No distribution history found
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="text-xs font-medium text-content">Timestamp ⓘ</TableHead>
                <TableHead className="text-xs font-medium text-content">Rewards ⓘ</TableHead>
                <TableHead className="text-xs font-medium text-content">Tx. Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDistributions.map((record, index) => (
                <TableRow key={index} className="hover:bg-muted/50 border-line">
                  <TableCell className="text-sm text-gray-900">{record.timestamp}</TableCell>
                  <TableCell className="text-sm text-white">
                    <div className="flex items-center gap-1 text-gray-900">
                      {record.rewards}
                      <Image src="/point.png" height={16} width={16} alt="point" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white">
                    <button className="flex items-center gap-1 text-gray-900 transition-colors hover:text-gray-500">
                      <div>{record.txHash}</div>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
