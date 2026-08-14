export interface OfficialEvent {
  id: string;
  title: string;
  category: 'Running' | 'Cycling' | 'Marathon' | 'Community';
  date: string;
  time: string;
  location: string;
  distanceKm: number;
  bonusPoints: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  registeredCount: number;
  capacity: number;
  imageUrl: string;
  icon: string;
  isRegistered?: boolean;
}

export const OFFICIAL_EVENTS: OfficialEvent[] = [
  {
    id: 'evt-1',
    title: 'Morning Sunrise Fun Run & 10K Pacing',
    category: 'Running',
    date: '2026-08-23',
    time: '06:45 AM',
    location: 'KLCC Park Promenade',
    distanceKm: 10,
    bonusPoints: 25,
    status: 'upcoming',
    registeredCount: 22,
    capacity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
    icon: '🏃',
    isRegistered: true,
  },
  {
    id: 'evt-2',
    title: 'Putrajaya Botanical Century Cycle',
    category: 'Cycling',
    date: '2026-09-14',
    time: '07:00 AM',
    location: 'Putrajaya Botanical Circuit',
    distanceKm: 50,
    bonusPoints: 30,
    status: 'upcoming',
    registeredCount: 16,
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    icon: '🚴',
    isRegistered: false,
  },
  {
    id: 'evt-3',
    title: 'Bukit Kiara Sunset Trail Sprint',
    category: 'Running',
    date: '2026-10-18',
    time: '05:30 PM',
    location: 'Bukit Kiara Forest Trail',
    distanceKm: 12,
    bonusPoints: 20,
    status: 'upcoming',
    registeredCount: 14,
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1483721074573-500b1464c231?w=800&auto=format&fit=crop&q=80',
    icon: '🌲',
    isRegistered: false,
  },
  {
    id: 'evt-4',
    title: 'KLCFM 2026 Official Trial Half-Marathon',
    category: 'Marathon',
    date: '2026-07-27',
    time: '05:00 AM',
    location: 'Dataran Merdeka Heritage Route',
    distanceKm: 21.1,
    bonusPoints: 50,
    status: 'completed',
    registeredCount: 28,
    capacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80',
    icon: '🏅',
    isRegistered: true,
  },
];
