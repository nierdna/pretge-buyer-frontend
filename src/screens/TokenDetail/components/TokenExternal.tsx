import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Separator from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IToken } from '@/types/token';
import { Investor, ITokenProjectExternal } from '@/types/tokenProject';
import { formatNumberShort } from '@/utils/helpers/number';
import { Calendar, ExternalLink, Github, Globe, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaDiscord, FaMedium } from 'react-icons/fa';
import ChartSection from './ChartSection';

const TokenExternal = ({
  token,
  tokenExternal,
}: {
  token: IToken;
  tokenExternal: ITokenProjectExternal;
}) => {
  if (!tokenExternal?.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-content">No external data available</p>
        </CardContent>
      </Card>
    );
  }

  const { data } = tokenExternal;
  const {
    web3Project,
    socials,
    priceData,
    fundraising,
    tokenomic,
    exchanges,
    investors,
    performance,
    communityMetrics,
    tgeInfo,
  } = data;
  console.log('priceData', data);

  const [performanceSelect, setPerformanceSelect] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (performance?.length > 0) {
      setPerformanceSelect(performance[0]?.baseAsset);
    }
  }, [performance]);

  // Format number helper

  // Format currency
  const formatCurrency = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Mainnet':
        return 'default';
      case 'Testnet':
        return 'info';
      case 'Coming Soon':
        return 'outline';
      case 'TBA':
        return 'danger';
      default:
        return 'outline';
    }
  };

  // Get investor tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier1':
        return 'text-green-600';
      case 'Tier2':
        return 'text-blue-600';
      case 'Tier3':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const performanceData = performance?.find((item) => item.baseAsset === performanceSelect);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative h-16 min-h-16 w-16 min-w-16">
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={token?.logo || '/logo-mb.png'}
                        alt={token?.symbol || 'Token Image'}
                        width={64}
                        height={64}
                        className="rounded-full border border-content"
                      />
                      <img
                        src={token?.networks?.logo || '/logo-mb.png'}
                        alt={token?.networks?.name || 'Token Image'}
                        width={24}
                        height={24}
                        className="absolute bottom-0 right-0 rounded-full border border-content"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl font-bold">{web3Project?.name || '--'}</CardTitle>
                  <Badge variant="outline">{web3Project?.symbol || '--'}</Badge>
                  <Badge variant={getStatusVariant(web3Project?.launchStatus || '')}>
                    {web3Project?.launchStatus || '--'}
                  </Badge>
                </div>
              </div>
              <p className="max-w-3xl text-content">{web3Project?.description || '--'}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">{web3Project?.category || '--'}</Badge>
                <Badge variant="info">{web3Project?.chain || '--'}</Badge>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {web3Project?.website && (
                <Link href={web3Project.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Globe className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {socials?.twitter && (
                <Link href={socials.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <title>social_x_line</title>
                      <g id="social_x_line" fill="none" fillRule="evenodd">
                        <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582 5.39-6.16ZM16.5 19 6 5h1.5L18 19z"
                        />
                      </g>
                    </svg>
                  </Button>
                </Link>
              )}
              {socials?.discord && (
                <Link href={socials.discord} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaDiscord className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {socials?.telegram && (
                <Link href={socials.telegram} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {socials?.github && (
                <Link href={socials.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Github className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {socials?.medium && (
                <Link href={socials.medium} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaMedium className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chart Section */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-0">
            <ChartSection
              // currencyId={tokenExternal.projectId}
              tokenSymbol={token?.symbol || web3Project?.symbol}
            />
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="grid grid-cols-2 items-center divide-x divide-content rounded-lg bg-input p-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-content">Market Cap</p>
                <p className="text-base font-bold">
                  ${formatNumberShort(priceData?.market_cap, { useShorterExpression: true })}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-content">FDV</p>
                <p className="text-base font-bold">
                  $
                  {formatNumberShort(
                    Number(priceData?.price || 0) * Number(tokenomic?.totalSupply || 0),
                    {
                      useShorterExpression: true,
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-content">Circ. Supply</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-head">
                    {formatNumberShort(tokenomic?.circulatingSupply, {
                      useShorterExpression: true,
                    })}
                  </p>
                  <p className="text-sm text-content">
                    {formatNumberShort(
                      ((tokenomic?.circulatingSupply || 0) / (tokenomic?.totalSupply || 0)) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
              <Progress
                value={((tokenomic?.circulatingSupply || 0) / (tokenomic?.totalSupply || 0)) * 100}
              />
            </div>
            <div className="flex flex-col gap-3 pt-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-content">Total Supply</p>
                <p className="font-medium text-head">
                  {formatNumberShort(tokenomic?.totalSupply, {
                    useShorterExpression: true,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-content">Max Supply</p>
                <p className="font-medium text-head">--</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <p className="text-content">Volume 24h</p>
              <p className="font-medium text-head">
                $
                {formatNumberShort(priceData?.volume_24h, {
                  useShorterExpression: true,
                })}
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <p className="text-content">Total Raised</p>
              <p className="font-medium text-head">
                $
                {formatNumberShort(fundraising?.totalRaised, {
                  useShorterExpression: true,
                })}
              </p>
            </div>
            {performance?.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-content">Performance vs.</p>
                    <Select value={performanceSelect} onValueChange={setPerformanceSelect}>
                      <SelectTrigger className="w-fit gap-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent align="end" className="">
                        {performance.map((item) => (
                          <SelectItem key={item.baseAsset} value={item.baseAsset}>
                            {item.baseAsset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-head">
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.h1 && Number(performanceData.h1) > 0,
                        'text-red-600': performanceData?.h1 && Number(performanceData.h1) < 0,
                      })}
                    >
                      {performanceData?.h1 === null
                        ? '--'
                        : formatNumberShort(performanceData?.h1 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">1h</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.h24 && Number(performanceData.h24) > 0,
                        'text-red-600': performanceData?.h24 && Number(performanceData.h24) < 0,
                      })}
                    >
                      {performanceData?.h24 === null
                        ? '--'
                        : formatNumberShort(performanceData?.h24 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">24h</p>
                  </div>{' '}
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.d7 && Number(performanceData.d7) > 0,
                        'text-red-600': performanceData?.d7 && Number(performanceData.d7) < 0,
                      })}
                    >
                      {performanceData?.d7 === null
                        ? '--'
                        : formatNumberShort(performanceData?.d7 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">7d</p>
                  </div>{' '}
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.mo1 && Number(performanceData.mo1) > 0,
                        'text-red-600': performanceData?.mo1 && Number(performanceData.mo1) < 0,
                      })}
                    >
                      {performanceData?.mo1 === null
                        ? '--'
                        : formatNumberShort(performanceData?.mo1 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">1m</p>
                  </div>{' '}
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.mo3 && Number(performanceData.mo3) > 0,
                        'text-red-600': performanceData?.mo3 && Number(performanceData.mo3) < 0,
                      })}
                    >
                      {performanceData?.mo3 === null
                        ? '--'
                        : formatNumberShort(performanceData?.mo3 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">3m</p>
                  </div>{' '}
                  <div className="flex flex-col items-center gap-1 rounded-lg bg-input p-2">
                    <p
                      className={cn('text-base font-medium', {
                        'text-green-600': performanceData?.y1 && Number(performanceData.y1) > 0,
                        'text-red-600': performanceData?.y1 && Number(performanceData.y1) < 0,
                      })}
                    >
                      {performanceData?.y1 === null
                        ? '--'
                        : formatNumberShort(performanceData?.y1 || 0, {
                            maxDecimalCount: 2,
                            useShorterExpression: true,
                          }) + '%'}
                    </p>
                    <p className="text-sm text-content">1y</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Community Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatNumberShort(communityMetrics?.twitterFollowers)}
              </p>
              <p className="text-sm text-content">Twitter Followers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatNumberShort(communityMetrics?.discordMembers)}
              </p>
              <p className="text-sm text-content">Discord Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatNumberShort(communityMetrics?.telegramMembers)}
              </p>
              <p className="text-sm text-content">Telegram Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatNumberShort(communityMetrics?.githubStars)}
              </p>
              <p className="text-sm text-content">GitHub Stars</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Investors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investors?.length > 0 ? (
              <div className="space-y-3">
                {investors.slice(0, 8).map((investor, index) => (
                  <InvestorItem key={index} investor={investor} />
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-content">
                <p>--</p>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Exchanges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exchanges && exchanges.length > 0 ? (
              <div className="space-y-3">
                {exchanges.slice(0, 5).map((exchange, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-line p-3"
                  >
                    <div className="flex items-center gap-3">
                      {exchange.logoUrl && (
                        <img
                          src={exchange.logoUrl}
                          alt={exchange.exchangeName}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium">{exchange.exchangeName || '--'}</p>
                        <p className="text-sm text-content">{exchange.tradingPairName || '--'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(exchange.price)}</p>
                      <p className="text-sm text-content">Vol: {formatCurrency(exchange.vol24h)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-content">
                <p>--</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TGE Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            TGE Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="text-sm text-content">TGE Date</span>
              <p className="font-semibold">
                {tgeInfo?.tgeDate ? new Date(tgeInfo.tgeDate).toLocaleDateString() : '--'}
              </p>
            </div>
            <div>
              <span className="text-sm text-content">TGE Exchange</span>
              <p className="font-semibold">{tgeInfo?.tgeExchange || '--'}</p>
            </div>
            <div>
              <span className="text-sm text-content">Initial Market Cap</span>
              <p className="font-semibold">{formatCurrency(tgeInfo?.initialMarketcap)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenExternal;

const InvestorItem = ({ investor }: { investor: Investor }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {investor.logoUrl && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <img
              src={investor.logoUrl}
              alt={investor.name}
              className="h-6 w-6 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{investor.name}</p>
          <p className="text-xs text-content">{investor.type}</p>
        </div>
      </div>
      <Badge variant="outline">{investor.tier}</Badge>
    </div>
  );
};
