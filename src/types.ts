export type Department = 
  | 'Engineering & Tech'
  | 'Sales & Business Dev'
  | 'Product & UX'
  | 'Operations & Logistics'
  | 'Marketing & Growth'
  | 'Finance & People';

export type Gender = 'Male' | 'Female' | 'Other';

export type ChallengeMonth = 'june' | 'july' | 'august' | 'september' | 'october' | 'november';

export interface MonthlyRecord {
  month: ChallengeMonth;
  distanceKm: number;
  distancePoints: number; // usually distanceKm * 1 (rounded or exact)
  bonus80Km: number; // 50 pts if distance >= 80km
  eventBonus: number; // 25 pts per company event
  totalBonus: number; // bonus80Km + eventBonus + special
  totalPoints: number;
  rank: number;
  previousRank: number; // rank from previous month for trend
  activitiesCount: number;
  longestActivityKm: number;
  elevationGainMeters: number;
}

export interface Badge {
  id: string;
  name: string;
  category: 'distance' | 'consistency' | 'special' | 'event';
  icon: string;
  description: string;
  requirement: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  department: Department;
  gender: Gender;
  avatarUrl: string;
  roleTitle: string;
  joinDate: string;
  active: boolean;
  stravaHandle?: string;
  shoeOrBikeModel?: string;
  motto?: string;
  monthlyRecords: Record<ChallengeMonth, MonthlyRecord>;
  earnedBadges: string[]; // Badge IDs
  totalDistanceKm: number;
  totalPoints: number;
  overallRank: number;
  previousOverallRank: number;
  longestSingleActivityKm: number;
  totalActivities: number;
  streakMonths: number;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  author: string;
  category: 'Bonus' | 'Winner' | 'Event' | 'General';
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  pointsMultiplier?: number;
  likesCount: number;
}

export interface PhotoPost {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  department: Department;
  imageUrl: string;
  caption: string;
  activityType: 'Running' | 'Cycling' | 'Hiking' | 'Marathon' | 'Office Event';
  distanceKm: number;
  location: string;
  date: string;
  likes: number;
  likedByMe?: boolean;
}

export interface SeasonConfig {
  seasonId: string;
  seasonName: string;
  year: number;
  startDate: string;
  endDate: string;
  prizeDate: string;
  currentActiveMonth: ChallengeMonth;
  isActive: boolean;
  targetCompanyDistanceKm: number;
  targetCompanyPoints: number;
}

export interface PrizeTier {
  place: number; // 1, 2, 3, 4, 5
  title: string;
  category: 'Women' | 'Men' | 'Both';
  reward: string;
  cashEquivalent: string;
  trophyIcon: string;
  badgeName: string;
  accentColor: string;
  badgeBg: string;
}

export type CategoryDivision = 'ALL' | 'Female' | 'Male';

export type NavTab = 
  | 'dashboard'
  | 'leaderboard'
  | 'departments'
  | 'hall-of-fame'
  | 'timeline'
  | 'gallery'
  | 'announcements'
  | 'admin';

export type ViewTab = NavTab | 'badges' | 'journey' | 'architecture';
