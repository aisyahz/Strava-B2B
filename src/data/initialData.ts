import { Participant, Announcement, PhotoPost, SeasonConfig } from '../types';
import { recalculateAllStats } from '../utils/calculations';
import { OFFICIAL_PARTICIPANTS_DATA } from './officialAthletes';

export const INITIAL_SEASON: SeasonConfig = {
  seasonId: 'season-2026',
  seasonName: 'B2B Commerce Strava Grand Prix 2026',
  year: 2026,
  startDate: '2026-06-01',
  endDate: '2026-11-30',
  prizeDate: '2026-12-15',
  currentActiveMonth: 'august',
  isActive: true,
  targetCompanyDistanceKm: 15000,
  targetCompanyPoints: 18500,
};

export const INITIAL_PARTICIPANTS: Participant[] = recalculateAllStats(OFFICIAL_PARTICIPANTS_DATA);

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-july-results',
    title: '🏆 Month 2 (July) Official Results & Standings Release',
    date: '2026-08-03',
    author: 'Natasha Nazamil',
    category: 'Winner',
    priority: 'high',
    pointsMultiplier: 1,
    content: `Official Month 2 (July) results are locked in! 
- 👨 Men: Naim takes P1 (301.8 KM, 14 PTS), Irfan P2 (244.3 KM, 13 PTS), Azhar P3 (146.8 KM, 10 PTS with >80km, Event & KLCFM bonuses).
- 👩 Women: Vini storms into P1 (352.6 KM, 12 PTS), Farah P2 (170.8 KM, 11 PTS), Naimah P3 (137.5 KM, 10 PTS).
Keep the momentum firing as we enter the August Sprint!`,
    likesCount: 68,
  },
  {
    id: 'ann-june-results',
    title: '🏁 Month 1 (June) Grand Prix Kickoff Official Results',
    date: '2026-07-02',
    author: 'Natasha Nazamil',
    category: 'General',
    priority: 'normal',
    content: `Congratulations to all athletes for completing June (Month 1)! 
- 👨 Men: Irfan secured P1 Apex (194.4 KM, 10 PTS), Naim P2 (153.0 KM, 9 PTS), Siddiq P3 (122.7 KM, 8 PTS).
- 👩 Women: Farah claimed P1 Apex (122.1 KM, 10 PTS), Amira P2 (85.2 KM, 9 PTS), Naimah P3 (72.8 KM, 8 PTS).
All scores have been registered into the Grand Prix championship database.`,
    likesCount: 52,
  },
  {
    id: 'ann-bonus-august',
    title: '⚡ August Sprint Double Points Weekend (Aug 22 - Aug 23)',
    date: '2026-08-10',
    author: 'Challenge Organizing Committee',
    category: 'Bonus',
    priority: 'urgent',
    pointsMultiplier: 2,
    content: 'Get ready racers! Every kilometer logged during the upcoming double points weekend will receive extra multiplier glory towards the Overall Leaderboard!',
    likesCount: 44,
  },
];

export const INITIAL_PHOTOS: PhotoPost[] = [
  {
    id: 'photo-1',
    participantId: 'p-m-1',
    participantName: 'Naim',
    participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    department: 'Engineering & Tech',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
    caption: '300KM milestone hit in July! Morning tempo loop before standup 🌅🔥 #StravaGrandPrix2026',
    activityType: 'Running',
    distanceKm: 22.5,
    location: 'KLCC City Park Promenade',
    date: '2026-07-29',
    likes: 64,
  },
  {
    id: 'photo-2',
    participantId: 'p-f-6',
    participantName: 'Vini',
    participantAvatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&auto=format&fit=crop&q=80',
    department: 'Product & UX',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    caption: '352.6km July record wrapped up! High cadence and strong legs 🚴‍♀️🏃‍♀️',
    activityType: 'Running',
    distanceKm: 36.5,
    location: 'Putrajaya Botanical Loop',
    date: '2026-07-31',
    likes: 88,
  },
  {
    id: 'photo-3',
    participantId: 'p-m-2',
    participantName: 'Irfan',
    participantAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    department: 'Engineering & Tech',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80',
    caption: 'Conquered the KLCFM trial route with 32.4km long run. June Champion, July P2 locked in! 🏅',
    activityType: 'Marathon',
    distanceKm: 32.4,
    location: 'Kuala Lumpur Heritage Route',
    date: '2026-07-27',
    likes: 73,
  },
  {
    id: 'photo-4',
    participantId: 'p-f-1',
    participantName: 'Farah',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    department: 'Marketing & Growth',
    imageUrl: 'https://images.unsplash.com/photo-1483721074573-500b1464c231?w=800&auto=format&fit=crop&q=80',
    caption: '170km July completed! Marketing team keeping the pace fast and spirits high 🌲👟',
    activityType: 'Running',
    distanceKm: 16.5,
    location: 'Bukit Kiara Trail Loop',
    date: '2026-07-28',
    likes: 58,
  },
  {
    id: 'photo-5',
    participantId: 'p-m-4',
    participantName: 'Azhar',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    department: 'Sales & Business Dev',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    caption: 'Bonus stack achieved! Event participation + KLCFM + 80km threshold unlocked 🏔️✨',
    activityType: 'Running',
    distanceKm: 18.2,
    location: 'Lake Gardens Circuit',
    date: '2026-07-26',
    likes: 49,
  },
];
