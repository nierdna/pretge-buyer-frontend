/**
 * Token Project Data - External API Response Types
 * For handling external token project information from services like DropStab
 */

// Main API Response Interface
export interface ITokenProjectExternal {
  projectId: string;
  projectSymbol: string;
  data: TokenProjectData;
  metadata: ResponseMetadata;
}

export interface TokenProjectData {
  web3Project: Web3Project;
  socials: SocialLinks;
  fundraising: FundraisingInfo;
  tokenomic: TokenomicsInfo;
  exchanges: Exchange[];
  activities: Activity[];
  investors: Investor[];
  performance: PerformanceMetric[];
  priceData: PriceData;
  communityMetrics: CommunityMetrics;
  tgeInfo: TGEInfo;
  preMarketPricing: PreMarketPricing[];
}

// Core Project Information
export interface Web3Project {
  name: string;
  symbol: string;
  description: string;
  website: string;
  category: string;
  chain: string;
  launchStatus: LaunchStatus;
  isPublished: boolean;
  isDeleted: boolean;
  createdById: string;
  updatedById: string;
}

// Social Media Links
export interface SocialLinks {
  twitter?: string | null;
  discord?: string | null;
  telegram?: string | null;
  medium?: string | null;
  github?: string | null;
}

// Fundraising Information
export interface FundraisingInfo {
  totalRaised: number;
  notableInvestors: string[];
  fundingRounds: FundingRound[];
}

export interface FundingRound {
  roundName: string;
  date: string;
  amount: number;
  investors: string[];
  tokenPrice?: number | null;
}

// Tokenomics
export interface TokenomicsInfo {
  tokenName: string;
  tokenSymbol: string;
  tokenType: TokenType;
  totalSupply: number;
  circulatingSupply: number;
  tokenContract?: string | null;
  allocations: TokenAllocation[];
}

export interface TokenAllocation {
  category: string;
  percentage: number;
  amount: number;
  vestingSchedule?: VestingSchedule;
}

export interface VestingSchedule {
  cliff?: number;
  vestingPeriod?: number;
  unlockPercentage?: number;
}

// Exchange Information
export interface Exchange {
  exchangeName: string;
  exchangeSlug: string;
  tradingPairName: string;
  tradingPairUrl: string;
  price: number;
  vol24h: number;
  logoUrl: string;
}

// Activities and Events
export interface Activity {
  title: string;
  url: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  ecosystem: string;
  totalFundsRaised: number;
  metadata: ActivityMetadata;
}

export interface ActivityMetadata {
  score: string;
  status: ActivityStatus;
  activityType: ActivityType;
  tags: string[];
}

// Investor Information
export interface Investor {
  name: string;
  type: InvestorType;
  tier: InvestorTier;
  star: InvestorStar;
  logoUrl: string;
  links: InvestorLink[];
}

export interface InvestorLink {
  type: string;
  url: string;
}

// Performance Metrics
export interface PerformanceMetric {
  baseAsset: string;
  h1?: number | null;
  h24?: number | null;
  d7?: number | null;
  mo1?: number | null;
  mo3?: number | null;
  y1?: number | null;
}

// Price Data
export interface PriceData {
  price: number;
  change_1h: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
  recorded_at: string;
}

// Community Metrics
export interface CommunityMetrics {
  twitterFollowers?: number | null;
  discordMembers?: number | null;
  telegramMembers?: number | null;
  githubStars?: number | null;
}

// TGE (Token Generation Event) Information
export interface TGEInfo {
  tgeDate: string;
  tgeExchange?: string | null;
  initialMarketcap: number;
}

// Pre-Market Pricing
export interface PreMarketPricing {
  platform: string;
  lastPrice: number;
  totalVol: number;
  vol24h: number;
  change24h: number;
}

// Response Metadata
export interface ResponseMetadata {
  source: string;
  crawledAt: string;
  originalUrl: string;
  symbol: string;
  cached: boolean;
}

// Type Unions and Enums
export type InvestorType = 'Angel Investor' | 'Ventures Capital' | 'Exchange' | 'Unknown';

export type InvestorTier = 'Tier1' | 'Tier2' | 'Tier3' | 'NotRated';

export type InvestorStar = 'One' | 'Two' | 'Three';

export type LaunchStatus = 'Mainnet' | 'Testnet' | 'Coming Soon' | 'TBA';

export type TokenType = 'Utility' | 'Security' | 'Payment' | 'Platform';

export type ActivityStatus = 'active' | 'completed' | 'upcoming' | 'cancelled';

export type ActivityType = 'launch' | 'airdrop' | 'staking' | 'quest' | 'campaign';

// API Service Response Types
export interface TokenProjectServiceResponse {
  success: boolean;
  data: ITokenProjectExternal;
  message?: string;
}

export interface TokenProjectError {
  success: false;
  message: string;
  code?: string;
  details?: any;
}

// Request Types
export interface GetTokenProjectRequest {
  symbol: string;
  includeMetrics?: boolean;
  includeActivities?: boolean;
}

export interface TokenProjectQueryParams {
  symbol?: string;
  category?: string;
  chain?: string;
  launchStatus?: LaunchStatus;
  minMarketCap?: number;
  maxMarketCap?: number;
}

// Component Props Types
export interface TokenProjectCardProps {
  project: TokenProjectData;
  onClick?: (project: TokenProjectData) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showPrice?: boolean;
  showPerformance?: boolean;
  showInvestors?: boolean;
}

export interface TokenProjectListProps {
  projects: TokenProjectData[];
  isLoading: boolean;
  isFetching: boolean;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  onProjectClick?: (project: TokenProjectData) => void;
}

export interface TokenProjectDetailProps {
  project: TokenProjectData;
  onBack?: () => void;
  showFullDetails?: boolean;
}

// Type Guards
export function isTokenProjectApiResponse(obj: any): obj is ITokenProjectExternal {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.projectId === 'string' &&
    typeof obj.projectSymbol === 'string' &&
    obj.data &&
    obj.metadata
  );
}

export function isWeb3Project(obj: any): obj is Web3Project {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.symbol === 'string' &&
    typeof obj.description === 'string'
  );
}

export function isPriceData(obj: any): obj is PriceData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.price === 'number' &&
    typeof obj.market_cap === 'number' &&
    typeof obj.recorded_at === 'string'
  );
}

export function isExchange(obj: any): obj is Exchange {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.exchangeName === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.vol24h === 'number'
  );
}

// Utility Types
export type TokenProjectWithoutMetadata = Omit<ITokenProjectExternal, 'metadata'>;
export type TokenProjectSummary = Pick<TokenProjectData, 'web3Project' | 'priceData' | 'exchanges'>;
export type InvestorSummary = Pick<Investor, 'name' | 'type' | 'tier'>;
export type ExchangeSummary = Pick<Exchange, 'exchangeName' | 'price' | 'vol24h'>;

// Filter and Sort Types
export interface TokenProjectFilters {
  categories?: string[];
  chains?: string[];
  launchStatuses?: LaunchStatus[];
  priceRange?: {
    min: number;
    max: number;
  };
  marketCapRange?: {
    min: number;
    max: number;
  };
  hasExchanges?: boolean;
  hasActivities?: boolean;
}

export interface TokenProjectSortOptions {
  field: 'price' | 'marketCap' | 'volume24h' | 'change24h' | 'totalRaised';
  direction: 'asc' | 'desc';
}
