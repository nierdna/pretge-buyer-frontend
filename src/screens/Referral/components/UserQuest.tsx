'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetMyQuests,
  useGetMyStats,
  useGetQuests,
  useVerifyQuest,
} from '@/queries/useQuestQueries';
import { Service } from '@/service';
import { useAuthStore } from '@/store/authStore';
import type {
  QuestVerifyRequest,
  QuestWithStatus,
  UserQuestWithQuest,
  VerifyStatus,
} from '@/types/quest';
import { QuestType } from '@/types/quest';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Gift,
  Hash,
  Info,
  Link,
  Loader2,
  Target,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// Quest type icons mapping
const questTypeIcons: Record<QuestType, JSX.Element> = {
  [QuestType.SOCIAL_FOLLOW]: <Users className="h-4 w-4" />,
  [QuestType.SOCIAL_RETWEET]: <ExternalLink className="h-4 w-4" />,
  [QuestType.SOCIAL_POST]: <ExternalLink className="h-4 w-4" />,
  [QuestType.TELEGRAM_JOIN]: <Users className="h-4 w-4" />,
  [QuestType.REFERRAL]: <Gift className="h-4 w-4" />,
  [QuestType.LINK_X]: <ExternalLink className="h-4 w-4" />,
  [QuestType.LINK_TELE]: <ExternalLink className="h-4 w-4" />,
};

// Status colors
const statusColors: Record<VerifyStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

interface QuestVerificationDialogProps {
  quest: QuestWithStatus;
  isOpen: boolean;
  onClose: () => void;
}

function QuestVerificationDialog({ quest, isOpen, onClose }: QuestVerificationDialogProps) {
  const [proofData, setProofData] = useState<Record<string, string>>({
    clickToken: 'mock value',
  });
  const { mutate: verifyQuest, isPending } = useVerifyQuest();

  const handleSubmit = () => {
    if (!proofData || Object.keys(proofData).length === 0) {
      toast.error('Please provide proof for quest verification');
      return;
    }

    const request: QuestVerifyRequest = {
      proof: proofData,
      meta: {
        userAgent: navigator.userAgent,
      },
    };

    const idempotencyKey = Service.quest.generateIdempotencyKey(quest.code);

    verifyQuest(
      {
        questCode: quest.code,
        request,
        idempotencyKey,
      },
      {
        onSuccess: () => {
          onClose();
          setProofData({});
        },
      }
    );
  };

  const getProofFields = () => {
    switch (quest.type) {
      case QuestType.SOCIAL_FOLLOW:
        return [
          {
            key: 'username',
            label: 'Your Username',
            placeholder: '@your_username',
            required: true,
          },
        ];
      case QuestType.SOCIAL_RETWEET:
      case QuestType.SOCIAL_POST:
        return [
          {
            key: 'tweetUrl',
            label: 'Tweet URL',
            placeholder: 'https://twitter.com/...',
            required: true,
          },
          {
            key: 'tweetId',
            label: 'Tweet ID',
            placeholder: 'Extract from URL',
            required: true,
          },
        ];
      case QuestType.TELEGRAM_JOIN:
        return [
          {
            key: 'telegramUserId',
            label: 'Telegram User ID',
            placeholder: '12345678',
            required: true,
          },
          {
            key: 'telegramUsername',
            label: 'Telegram Username (Optional)',
            placeholder: '@username',
            required: false,
          },
        ];
      case QuestType.LINK_X:
      case QuestType.LINK_TELE:
        return [
          {
            key: 'clickToken',
            label: 'Click Token',
            placeholder: 'Token received after clicking',
            required: true,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="outline-none ring-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {questTypeIcons[quest.type]}
            Verify Quest: {quest.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-700">{quest.description}</p>
          </div>

          {/* Quest Metadata Display */}
          {quest.metadata && Object.keys(quest.metadata).length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <h4 className="mb-2 text-sm font-medium text-blue-800">Requirements:</h4>
              {formatMetadata(quest.type, quest.metadata)}
            </div>
          )}

          {/* {getProofFields().map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.key}
                placeholder={field.placeholder}
                value={proofData[field.key] || ''}
                // value={'mock value'}
                onChange={(e) =>
                  setProofData((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className="outline-none ring-0"
              />
            </div>
          ))} */}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="outline-none ring-0">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="outline-none ring-0">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Quest'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to format metadata for display
const formatMetadata = (type: QuestType, metadata: Record<string, any>) => {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  switch (type) {
    case QuestType.SOCIAL_FOLLOW:
      return metadata.handle ? (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Users className="h-3 w-3" />
          <a
            href={`https://x.com/${metadata.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-48 truncate hover:underline"
            title={metadata.handle}
          >
            Follow: {metadata.handle}
          </a>
        </div>
      ) : null;

    case QuestType.SOCIAL_RETWEET:
      return metadata.tweetId ? (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <ExternalLink className="h-3 w-3" />
          <a
            href={`https://x.com/status/${metadata.tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-48 truncate hover:underline"
            title={metadata.tweetId}
          >
            Tweet ID: {metadata.tweetId}
          </a>
        </div>
      ) : null;

    case QuestType.SOCIAL_POST:
      return (
        <div className="space-y-1">
          {metadata.requiredTags && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Hash className="h-3 w-3" />
              <span>Tags: {metadata.requiredTags.join(', ')}</span>
            </div>
          )}
          {metadata.mention && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Users className="h-3 w-3" />
              <span>Mention: {metadata.mention}</span>
            </div>
          )}
          {metadata.minChars && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Info className="h-3 w-3" />
              <span>Min chars: {metadata.minChars}</span>
            </div>
          )}
        </div>
      );

    case QuestType.TELEGRAM_JOIN:
      return metadata.chatId ? (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Users className="h-3 w-3" />
          <a
            href={`https://t.me/${metadata.chatId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-48 truncate hover:underline"
            title={metadata.chatId}
          >
            Join: {metadata.chatId}
          </a>
        </div>
      ) : null;

    case QuestType.REFERRAL:
      return metadata.minAction ? (
        <div className="flex items-center gap-1 text-xs text-purple-600">
          <Gift className="h-3 w-3" />
          <span>Min action: {metadata.minAction}</span>
        </div>
      ) : null;

    case QuestType.LINK_X:
    case QuestType.LINK_TELE:
      return metadata.url ? (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Link className="h-3 w-3" />
          <a
            href={metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-48 truncate hover:underline"
            title={metadata.url}
          >
            {metadata.url}
          </a>
        </div>
      ) : null;

    default:
      return null;
  }
};

function QuestCard({ quest }: { quest: QuestWithStatus }) {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const { accessToken } = useAuthStore();

  const getStatusBadge = () => {
    if (quest.isCompleted && quest.userQuest) {
      const status = quest.userQuest.status;
      return (
        <Badge className={`${statusColors[status]} border`}>
          {status === 'verified' && <CheckCircle className="mr-1 h-3 w-3" />}
          {status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
          {status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }
    return null;
  };

  const canVerify = accessToken && !quest.isCompleted && quest.status === 'active';
  const metadataDisplay = formatMetadata(quest.type, quest.metadata);

  return (
    <>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">{questTypeIcons[quest.type]}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                  {quest.title}
                </h3>
                {quest.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-content">{quest.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-xs text-content">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {quest.points} points
                  </span>
                  <span className="capitalize">{quest.type.replace('_', ' ').toLowerCase()}</span>
                </div>
                {/* Metadata Display */}
                {metadataDisplay && (
                  <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-2">
                    {metadataDisplay}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge()}
              {canVerify && (
                <Button
                  size="sm"
                  onClick={() => setShowVerifyDialog(true)}
                  className="outline-none ring-0"
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <QuestVerificationDialog
        quest={quest}
        isOpen={showVerifyDialog}
        onClose={() => setShowVerifyDialog(false)}
      />
    </>
  );
}

function QuestHistoryCard({ userQuest }: { userQuest: UserQuestWithQuest }) {
  const metadataDisplay = formatMetadata(userQuest.quest.type, userQuest.quest.metadata);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              {questTypeIcons[userQuest.quest.type]}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{userQuest.quest.title}</h3>
              <p className="mt-1 text-sm text-content">
                Submitted {new Date(userQuest.submittedAt).toLocaleDateString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <Trophy className="h-3 w-3 text-content" />
                <span className="text-sm text-content">{userQuest.quest.points} points</span>
              </div>
              {/* Metadata Display */}
              {metadataDisplay && (
                <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-2">
                  {metadataDisplay}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusColors[userQuest.status]} border`}>
              {userQuest.status === 'verified' && <CheckCircle className="mr-1 h-3 w-3" />}
              {userQuest.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
              {userQuest.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
              {userQuest.status.charAt(0).toUpperCase() + userQuest.status.slice(1)}
            </Badge>
            {userQuest.status === 'rejected' && userQuest.rejectReason && (
              <p className="max-w-32 text-right text-xs text-red-600">{userQuest.rejectReason}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function UserQuest() {
  const { accessToken } = useAuthStore();
  const { data: questsData, isLoading: questsLoading } = useGetQuests();
  const { data: myQuestsData, isLoading: myQuestsLoading } = useGetMyQuests();
  const { data: statsData, isLoading: statsLoading } = useGetMyStats();

  const [activeTab, setActiveTab] = useState('available');
  const [filterType, setFilterType] = useState<QuestType | 'all'>('all');

  const availableQuests = useMemo(() => {
    if (!questsData) return [];
    return questsData.filter((quest) => {
      if (filterType !== 'all' && quest.type !== filterType) return false;
      return quest.status === 'active';
    });
  }, [questsData, filterType]);

  const completedQuests = useMemo(() => {
    if (!myQuestsData) return [];
    return myQuestsData.filter((userQuest) => {
      if (filterType !== 'all' && userQuest.quest.type !== filterType) return false;
      return true;
    });
  }, [myQuestsData, filterType]);

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <CardTitle className="font-medium text-gray-900">Quest Center</CardTitle>
          </div>
          {statsData && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Image src="/point.png" height={16} width={16} alt="point" />
                <span className="font-semibold text-blue-600">{statsData.totalPoints}</span>
              </div>
              <span className="text-content">•</span>
              <span className="text-content">{statsData.completedQuests} completed</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex items-center gap-4">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as QuestType | 'all')}
          >
            <SelectTrigger className="w-48 outline-none ring-0">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="outline-none ring-0">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={QuestType.SOCIAL_FOLLOW}>Social Follow</SelectItem>
              <SelectItem value={QuestType.SOCIAL_RETWEET}>Social Retweet</SelectItem>
              <SelectItem value={QuestType.SOCIAL_POST}>Social Post</SelectItem>
              <SelectItem value={QuestType.TELEGRAM_JOIN}>Telegram Join</SelectItem>
              <SelectItem value={QuestType.REFERRAL}>Referral</SelectItem>
              <SelectItem value={QuestType.LINK_X}>Link X</SelectItem>
              <SelectItem value={QuestType.LINK_TELE}>Link Telegram</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 border outline-none ring-0">
            <TabsTrigger value="available" className="outline-none ring-0">
              Available Quests
            </TabsTrigger>
            <TabsTrigger value="history" className="outline-none ring-0">
              My History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-4 outline-none ring-0">
            {questsLoading ? (
              <QuestListSkeleton />
            ) : availableQuests.length > 0 ? (
              <div className="space-y-3">
                {availableQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Target className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-content">No quests available</p>
                <p className="text-sm text-content">Check back later for new quests!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 outline-none ring-0">
            {!accessToken ? (
              <div className="py-8 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-content">Please login to view your quest history</p>
              </div>
            ) : myQuestsLoading ? (
              <QuestListSkeleton />
            ) : completedQuests.length > 0 ? (
              <div className="space-y-3">
                {completedQuests.map((userQuest) => (
                  <QuestHistoryCard key={userQuest.id} userQuest={userQuest} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Trophy className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-content">No completed quests yet</p>
                <p className="text-sm text-content">Start completing quests to earn points!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
