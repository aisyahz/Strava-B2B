import { Participant, ChallengeMonth, Department, MonthlyRecord } from '../types';

export const MONTHS: { key: ChallengeMonth; label: string; short: string; weight: number }[] = [
  { key: 'june', label: 'June 2026', short: 'JUN', weight: 1 },
  { key: 'july', label: 'July 2026', short: 'JUL', weight: 2 },
  { key: 'august', label: 'August 2026', short: 'AUG', weight: 3 },
  { key: 'september', label: 'September 2026', short: 'SEP', weight: 4 },
  { key: 'october', label: 'October 2026', short: 'OCT', weight: 5 },
  { key: 'november', label: 'November 2026', short: 'NOV', weight: 6 },
];

/**
 * Recalculates total points, distances, and ranks for all participants
 */
export function recalculateAllStats(participants: Participant[]): Participant[] {
  // First pass: compute participant totals
  const updated = participants.map((p) => {
    let totalDist = 0;
    let totalPts = 0;
    let totalActs = 0;
    let maxSingle = p.longestSingleActivityKm || 0;
    let hit80KmStreak = 0;
    let maxStreak = 0;

    MONTHS.forEach(({ key }) => {
      const rec = p.monthlyRecords[key];
      if (rec) {
        // Auto calculate distance points if not set: 1 KM = 1 Point (rounded to 1 decimal)
        const distPts = Math.round(rec.distanceKm * 10) / 10;
        // Preserve explicitly defined totalPoints if present
        const totalBonus = rec.totalBonus !== undefined 
          ? rec.totalBonus 
          : ((rec.bonus80Km || 0) + (rec.eventBonus || 0));
        
        const totalMonthPts = rec.totalPoints !== undefined
          ? rec.totalPoints
          : (distPts + totalBonus);

        rec.distancePoints = rec.distancePoints !== undefined ? rec.distancePoints : distPts;
        rec.bonus80Km = rec.bonus80Km !== undefined ? rec.bonus80Km : (rec.distanceKm >= 80 ? 1 : 0);
        rec.totalBonus = totalBonus;
        rec.totalPoints = Math.round(totalMonthPts * 10) / 10;

        totalDist += rec.distanceKm;
        totalPts += rec.totalPoints;
        totalActs += rec.activitiesCount || 0;
        if (rec.longestActivityKm > maxSingle) {
          maxSingle = rec.longestActivityKm;
        }

        if (rec.distanceKm >= 80) {
          hit80KmStreak++;
          if (hit80KmStreak > maxStreak) maxStreak = hit80KmStreak;
        } else {
          hit80KmStreak = 0;
        }
      }
    });

    return {
      ...p,
      totalDistanceKm: Math.round(totalDist * 10) / 10,
      totalPoints: Math.round(totalPts * 10) / 10,
      totalActivities: totalActs,
      longestSingleActivityKm: maxSingle,
      streakMonths: maxStreak,
    };
  });

  // Calculate overall ranks
  const sortedOverall = [...updated].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.totalDistanceKm - a.totalDistanceKm;
  });

  sortedOverall.forEach((p, index) => {
    p.previousOverallRank = p.overallRank || index + 1;
    p.overallRank = index + 1;
  });

  // Calculate monthly ranks for each month
  MONTHS.forEach(({ key }) => {
    const sortedMonth = [...sortedOverall].sort((a, b) => {
      const aRec = a.monthlyRecords[key]?.totalPoints || 0;
      const bRec = b.monthlyRecords[key]?.totalPoints || 0;
      if (bRec !== aRec) return bRec - aRec;
      return (b.monthlyRecords[key]?.distanceKm || 0) - (a.monthlyRecords[key]?.distanceKm || 0);
    });

    sortedMonth.forEach((p, index) => {
      if (p.monthlyRecords[key]) {
        p.monthlyRecords[key].previousRank = p.monthlyRecords[key].rank || index + 1;
        p.monthlyRecords[key].rank = index + 1;
      }
    });
  });

  // Auto award badges based on conditions
  sortedOverall.forEach((p) => {
    const badges = new Set(p.earnedBadges || []);

    if (p.totalDistanceKm >= 100) badges.add('badge-100km');
    if (p.totalDistanceKm >= 200) badges.add('badge-200km');
    if (p.totalDistanceKm >= 500) badges.add('badge-500km');
    if (p.totalDistanceKm >= 1000) badges.add('badge-1000km');
    if (p.overallRank <= 5) badges.add('badge-top-5');
    if (p.overallRank === 1) badges.add('badge-monthly-champion');
    if (p.streakMonths >= 3) badges.add('badge-consistency-king');
    if (p.longestSingleActivityKm >= 42.195) badges.add('badge-marathon-runner');
    if (p.longestSingleActivityKm >= 35) badges.add('badge-longest-distance');
    if (p.monthlyRecords.june?.distanceKm >= 100) badges.add('badge-fast-starter');
    if (p.totalActivities >= 25) badges.add('badge-iron-legs');

    p.earnedBadges = Array.from(badges);
  });

  return sortedOverall;
}

export interface DepartmentStats {
  department: Department;
  participantsCount: number;
  totalDistanceKm: number;
  totalPoints: number;
  avgDistanceKm: number;
  avgPoints: number;
  activeRatePercent: number;
  topRunnerName: string;
  topRunnerAvatar: string;
  rank: number;
}

export function computeDepartmentStats(participants: Participant[]): DepartmentStats[] {
  const map: Record<Department, {
    count: number;
    activeCount: number;
    totalDist: number;
    totalPts: number;
    topRunner: { name: string; avatar: string; pts: number };
  }> = {
    'Engineering & Tech': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
    'Sales & Business Dev': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
    'Product & UX': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
    'Operations & Logistics': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
    'Marketing & Growth': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
    'Finance & People': { count: 0, activeCount: 0, totalDist: 0, totalPts: 0, topRunner: { name: '-', avatar: '', pts: -1 } },
  };

  participants.forEach((p) => {
    if (!p.active) return;
    const dept = map[p.department];
    if (dept) {
      dept.count++;
      if (p.totalDistanceKm > 0) dept.activeCount++;
      dept.totalDist += p.totalDistanceKm;
      dept.totalPts += p.totalPoints;
      if (p.totalPoints > dept.topRunner.pts) {
        dept.topRunner = {
          name: p.name,
          avatar: p.avatarUrl,
          pts: p.totalPoints,
        };
      }
    }
  });

  const list: DepartmentStats[] = (Object.keys(map) as Department[]).map((d) => {
    const data = map[d];
    const count = data.count || 1;
    return {
      department: d,
      participantsCount: data.count,
      totalDistanceKm: Math.round(data.totalDist * 10) / 10,
      totalPoints: Math.round(data.totalPts * 10) / 10,
      avgDistanceKm: Math.round((data.totalDist / count) * 10) / 10,
      avgPoints: Math.round((data.totalPts / count) * 10) / 10,
      activeRatePercent: Math.round((data.activeCount / count) * 100),
      topRunnerName: data.topRunner.name,
      topRunnerAvatar: data.topRunner.avatar,
      rank: 0,
    };
  });

  list.sort((a, b) => b.totalPoints - a.totalPoints);
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list;
}

export function findMVP(participants: Participant[], month?: ChallengeMonth): Participant | null {
  if (!participants.length) return null;
  if (!month) {
    // Overall MVP is rank 1
    return participants[0] || null;
  }
  const sorted = [...participants].sort((a, b) => {
    const aPts = a.monthlyRecords[month]?.totalPoints || 0;
    const bPts = b.monthlyRecords[month]?.totalPoints || 0;
    return bPts - aPts;
  });
  return sorted[0] || null;
}

export function getCategoryRankings(
  participants: Participant[],
  gender: 'Female' | 'Male',
  month: ChallengeMonth | 'overall' = 'overall'
): (Participant & { categoryRank: number })[] {
  const filtered = participants.filter((p) => p.active && p.gender === gender);

  const sorted = [...filtered].sort((a, b) => {
    if (month === 'overall') {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.totalDistanceKm - a.totalDistanceKm;
    }
    const aRec = a.monthlyRecords[month]?.totalPoints || 0;
    const bRec = b.monthlyRecords[month]?.totalPoints || 0;
    if (bRec !== aRec) return bRec - aRec;
    return (b.monthlyRecords[month]?.distanceKm || 0) - (a.monthlyRecords[month]?.distanceKm || 0);
  });

  return sorted.map((p, idx) => ({
    ...p,
    categoryRank: idx + 1,
  }));
}

export function getTop5ByCategory(
  participants: Participant[],
  month: ChallengeMonth | 'overall' = 'overall'
) {
  const womenTop5 = getCategoryRankings(participants, 'Female', month).slice(0, 5);
  const menTop5 = getCategoryRankings(participants, 'Male', month).slice(0, 5);

  return {
    womenTop5,
    menTop5,
  };
}

export function findHallOfFame(participants: Participant[]) {
  if (!participants.length) return null;

  const activeParticipants = participants.filter((p) => p.active);

  const longestDist = [...activeParticipants].sort((a, b) => b.totalDistanceKm - a.totalDistanceKm)[0];
  const highestPts = [...activeParticipants].sort((a, b) => b.totalPoints - a.totalPoints)[0];
  const longestSingle = [...activeParticipants].sort((a, b) => b.longestSingleActivityKm - a.longestSingleActivityKm)[0];
  
  const males = activeParticipants.filter((p) => p.gender === 'Male');
  const females = activeParticipants.filter((p) => p.gender === 'Female');

  const topMale = males.sort((a, b) => b.totalPoints - a.totalPoints)[0] || null;
  const topFemale = females.sort((a, b) => b.totalPoints - a.totalPoints)[0] || null;

  // Most improved
  let mostImproved = activeParticipants[0];
  let maxJump = 0;
  activeParticipants.forEach((p) => {
    const jump = (p.previousOverallRank || p.overallRank) - p.overallRank;
    if (jump > maxJump) {
      maxJump = jump;
      mostImproved = p;
    }
  });

  return {
    longestDist,
    highestPts,
    longestSingle,
    topMale,
    topFemale,
    mostImproved,
    maxJump,
  };
}
