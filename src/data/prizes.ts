import { PrizeTier } from '../types';

export const TOP_5_PRIZES: PrizeTier[] = [
  {
    place: 1,
    title: '1st Place Champion',
    category: 'Both',
    reward: 'Apple Watch 11 + Gold Grand Prix Trophy',
    cashEquivalent: 'Flagship Smartwatch Tier',
    trophyIcon: '🥇',
    badgeName: 'Apex Grand Prix Champion',
    accentColor: '#fbbf24',
    badgeBg: 'bg-amber-400 text-black',
  },
  {
    place: 2,
    title: '2nd Place Runner-Up',
    category: 'Both',
    reward: 'COROS PACE 4 + Silver Distinction Plate',
    cashEquivalent: 'Elite GPS Multisport Tier',
    trophyIcon: '🥈',
    badgeName: 'Silver Apex Finisher',
    accentColor: '#cbd5e1',
    badgeBg: 'bg-slate-300 text-black',
  },
  {
    place: 3,
    title: '3rd Place (2nd Runner-Up)',
    category: 'Both',
    reward: 'SHOKZ OpenDots 1 + Bronze Medal',
    cashEquivalent: 'Premium Open-Ear Audio Tier',
    trophyIcon: '🥉',
    badgeName: 'Bronze Apex Finisher',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-700 text-white',
  },
  {
    place: 4,
    title: '4th Place Finisher',
    category: 'Both',
    reward: 'SHOKZ OpenFit Air + Distinction Plaque',
    cashEquivalent: 'High-Performance Sports Audio Tier',
    trophyIcon: '4️⃣',
    badgeName: 'Top 5 Apex Vanguard',
    accentColor: '#22d3ee',
    badgeBg: 'bg-cyan-500 text-black',
  },
  {
    place: 5,
    title: '5th Place Finisher',
    category: 'Both',
    reward: 'Beoka Q1 Massage Gun + Distinction Certificate',
    cashEquivalent: 'Deep-Tissue Recovery Tier',
    trophyIcon: '5️⃣',
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
