import { PrizeTier } from '../types';

export const TOP_5_PRIZES: PrizeTier[] = [
  {
    place: 1,
    title: '1st Place Champion',
    category: 'Both',
    reward: 'Garmin Forerunner 965 GPS Watch + Gold Grand Prix Trophy',
    cashEquivalent: 'RM 1,200 / $1,200 Value',
    trophyIcon: '🥇',
    badgeName: 'Apex Grand Prix Champion',
    accentColor: '#fbbf24',
    badgeBg: 'bg-amber-400 text-black',
  },
  {
    place: 2,
    title: '2nd Place Runner-Up',
    category: 'Both',
    reward: 'Nike Alphafly 3 Carbon Shoes + Silver Distinction Plate',
    cashEquivalent: 'RM 800 / $800 Value',
    trophyIcon: '🥈',
    badgeName: 'Silver Apex Finisher',
    accentColor: '#cbd5e1',
    badgeBg: 'bg-slate-300 text-black',
  },
  {
    place: 3,
    title: '3rd Place (2nd Runner-Up)',
    category: 'Both',
    reward: 'Shokz OpenRun Pro 2 Bone Conduction + Bronze Medal',
    cashEquivalent: 'RM 500 / $500 Value',
    trophyIcon: '🥉',
    badgeName: 'Bronze Apex Finisher',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-700 text-white',
  },
  {
    place: 4,
    title: '4th Place Finisher',
    category: 'Both',
    reward: 'Maurten Elite Endurance Pack + 4th Place Award Plaque',
    cashEquivalent: 'RM 300 / $300 Value',
    trophyIcon: '🏅',
    badgeName: 'Top 5 Apex Vanguard',
    accentColor: '#22d3ee',
    badgeBg: 'bg-cyan-500 text-black',
  },
  {
    place: 5,
    title: '5th Place Finisher',
    category: 'Both',
    reward: 'Salomon Active Skin 8 Hydration Vest + Certificate of Distinction',
    cashEquivalent: 'RM 200 / $200 Value',
    trophyIcon: '🎖️',
    badgeName: 'Top 5 Apex Vanguard',
    accentColor: '#c084fc',
    badgeBg: 'bg-purple-500 text-white',
  },
];

export function getPrizeForRank(rank: number): PrizeTier | null {
  if (rank >= 1 && rank <= 5) {
    return TOP_5_PRIZES[rank - 1];
  }
  return null;
}
