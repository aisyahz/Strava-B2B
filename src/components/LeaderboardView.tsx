import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Search, 
  Sparkles, 
  Filter, 
  Gift, 
  Crown, 
  Medal,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, ChallengeMonth, Department, Gender, SeasonConfig } from '../types';
import { getCategoryRankings } from '../utils/calculations';
import { TOP_5_PRIZES, getPrizeForRank } from '../data/prizes';
import { PrizeStructureModal } from './PrizeStructureModal';
import { soundFX } from '../utils/audio';

interface LeaderboardViewProps {
  participants: Participant[];
  season?: SeasonConfig;
  currentActiveMonth?: ChallengeMonth;
  onSelectParticipant: (participant: Participant) => void;
  onCompareParticipants?: (p1: Participant, p2: Participant) => void;
  onOpenPosterExport?: () => void;
  initialSearchQuery?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  participants,
  season,
  currentActiveMonth: propCurrentMonth,
  onSelectParticipant,
  onCompareParticipants,
  onOpenPosterExport,
  initialSearchQuery = '',
}) => {
  const currentActiveMonth = propCurrentMonth || season?.currentActiveMonth || 'august';
  const [selectedMonth, setSelectedMonth] = useState<ChallengeMonth | 'overall'>('overall');
  const [selectedGender, setSelectedGender] = useState<Gender | 'ALL'>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [filterTop5Only, setFilterTop5Only] = useState(false);

  // Category rankings for Women and Men
  const womenRankings = useMemo(() => getCategoryRankings(participants, 'Female', selectedMonth), [participants, selectedMonth]);
  const menRankings = useMemo(() => getCategoryRankings(participants, 'Male', selectedMonth), [participants, selectedMonth]);

  const categoryRankMap = useMemo(() => {
    const map = new Map<string, { catRank: number; gender: Gender }>();
    womenRankings.forEach((p) => map.set(p.id, { catRank: p.categoryRank, gender: 'Female' }));
    menRankings.forEach((p) => map.set(p.id, { catRank: p.categoryRank, gender: 'Male' }));
    return map;
  }, [womenRankings, menRankings]);

  // Filter & sort
  const filteredList = useMemo(() => {
    return participants.filter((p) => {
      if (!p.active) return false;
      if (selectedDepartment !== 'ALL' && p.department !== selectedDepartment) return false;
      if (selectedGender !== 'ALL' && p.gender !== selectedGender) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDept = p.department.toLowerCase().includes(q);
        const matchHandle = p.stravaHandle?.toLowerCase().includes(q) || false;
        if (!matchName && !matchDept && !matchHandle) return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedMonth === 'overall') {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return b.totalDistanceKm - a.totalDistanceKm;
      }
      const aRec = a.monthlyRecords[selectedMonth]?.totalPoints || 0;
      const bRec = b.monthlyRecords[selectedMonth]?.totalPoints || 0;
      if (bRec !== aRec) return bRec - aRec;
      return (b.monthlyRecords[selectedMonth]?.distanceKm || 0) - (a.monthlyRecords[selectedMonth]?.distanceKm || 0);
    });
  }, [participants, selectedMonth, selectedDepartment, selectedGender, searchQuery]);

  const displayList = filterTop5Only ? filteredList.slice(0, 5) : filteredList;

  const triggerCelebration = (p: Participant) => {
    soundFX.playFanfare();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5722', '#00E5FF', '#FBBF24', '#A855F7'],
    });
    onSelectParticipant(p);
  };

  const departmentsList: (Department | 'ALL')[] = [
    'ALL',
    'Engineering & Tech',
    'Sales & Business Dev',
    'Product & UX',
    'Operations & Logistics',
    'Marketing & Growth',
    'Finance & People',
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
              LIVE GRAND PRIX STANDINGS
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
            <span className="text-cyan-400 font-bold">🛣 Distance</span>
            <span>•</span>
            <span className="text-orange-400 font-bold">🎯 &gt;80KM Bonus</span>
            <span>•</span>
            <span className="text-purple-400 font-bold">🎁 Event Bonus</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">⭐ Total PTS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrizeModal(true)}
            className="flex items-center gap-1.5 glass-panel-orange hover:bg-orange-500/20 text-orange-400 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition border border-orange-500/30 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Prizes</span>
          </button>

          {onOpenPosterExport && (
            <button
              onClick={onOpenPosterExport}
              className="flex items-center gap-1.5 glass-panel-blue hover:bg-cyan-500/20 text-cyan-300 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition border border-cyan-400/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Export Poster</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Month Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto glass-panel p-1.5 rounded-2xl text-xs font-mono">
        {(['overall', 'june', 'july', 'august', 'september', 'october', 'november'] as const).map((m) => {
          const isSelected = selectedMonth === m;
          const isCurrent = m === currentActiveMonth;
          return (
            <button
              key={m}
              onClick={() => {
                soundFX.playRaceBeep();
                setSelectedMonth(m);
              }}
              className={`px-4 py-2 rounded-xl font-black uppercase transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#FF5722] text-black shadow-[0_0_15px_rgba(255,87,34,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{m === 'overall' ? '🏆 OVERALL' : m.toUpperCase()}</span>
              {m !== 'overall' && m === currentActiveMonth && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Division & Search Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Gender Division */}
        <div className="flex items-center gap-1 glass-panel p-1 rounded-xl text-xs font-mono">
          {(['ALL', 'Female', 'Male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedGender === g
                  ? g === 'Female'
                    ? 'bg-pink-500 text-white shadow-md'
                    : g === 'Male'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-white/20 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g === 'ALL' ? 'ALL DIVISIONS' : g === 'Female' ? '👩 WOMEN' : '👨 MEN'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athlete or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs font-mono text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* 4. Leaderboard Table (Icons, Minimal, Clean) */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] text-slate-400 uppercase">
                <th className="py-3.5 px-4 font-black">POS</th>
                <th className="py-3.5 px-4 font-black">ATHLETE</th>
                <th className="py-3.5 px-4 font-black text-center" title="Distance (KM)">🛣 DIST</th>
                <th className="py-3.5 px-4 font-black text-center" title="80KM Threshold Bonus">🎯 &gt;80KM</th>
                <th className="py-3.5 px-4 font-black text-center" title="Official Event Bonus">🎁 EVT</th>
                <th className="py-3.5 px-4 font-black text-center" title="Total Points">⭐ PTS</th>
                <th className="py-3.5 px-4 font-black text-right">TELEMETRY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayList.map((participant, index) => {
                const isTop5 = index < 5;
                const pos = index + 1;

                // Month specific data
                const monthRec = selectedMonth === 'overall' 
                  ? null 
                  : participant.monthlyRecords[selectedMonth];

                const distance = selectedMonth === 'overall' 
                  ? participant.totalDistanceKm 
                  : monthRec?.distanceKm || 0;

                const bonus80 = selectedMonth === 'overall'
                  ? Object.values(participant.monthlyRecords).reduce((acc, r) => acc + (r.bonus80Km || 0), 0)
                  : monthRec?.bonus80Km || 0;

                const eventBonus = selectedMonth === 'overall'
                  ? Object.values(participant.monthlyRecords).reduce((acc, r) => acc + (r.eventBonus || 0), 0)
                  : monthRec?.eventBonus || 0;

                const totalPoints = selectedMonth === 'overall'
                  ? participant.totalPoints
                  : monthRec?.totalPoints || 0;

                // Category position
                const catInfo = categoryRankMap.get(participant.id);
                const catRank = catInfo?.catRank || pos;

                // Rank delta movement
                const prevRank = selectedMonth === 'overall' 
                  ? participant.previousOverallRank 
                  : monthRec?.previousRank || pos;
                const rankDelta = prevRank - pos;

                return (
                  <tr
                    key={participant.id}
                    onClick={() => triggerCelebration(participant)}
                    className={`hover:bg-white/[0.04] transition cursor-pointer group ${
                      isTop5 ? 'bg-amber-400/[0.015]' : ''
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 font-black">
                      <div className="flex items-center gap-2">
                        {pos === 1 ? (
                          <span className="text-base select-none">🥇</span>
                        ) : pos === 2 ? (
                          <span className="text-base select-none">🥈</span>
                        ) : pos === 3 ? (
                          <span className="text-base select-none">🥉</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-sm">#{pos}</span>
                        )}

                        {/* Rank Delta Indicator */}
                        {rankDelta > 0 ? (
                          <span className="text-emerald-400 text-[10px] font-bold flex items-center">
                            <ArrowUp className="w-3 h-3" /> {rankDelta}
                          </span>
                        ) : rankDelta < 0 ? (
                          <span className="text-rose-400 text-[10px] font-bold flex items-center">
                            <ArrowDown className="w-3 h-3" /> {Math.abs(rankDelta)}
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Athlete Name & Department */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={participant.avatarUrl}
                          alt={participant.name}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 group-hover:border-orange-500 transition"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-white text-sm group-hover:text-orange-400 transition truncate">
                              {participant.name}
                            </span>
                            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                              participant.gender === 'Female' 
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {participant.gender === 'Female' ? 'W' : 'M'}#{catRank}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {participant.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 text-center font-black text-white">
                      {distance.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">KM</span>
                    </td>

                    {/* >80KM Bonus */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      {bonus80 > 0 ? (
                        <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/30">
                          +{bonus80}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Event Bonus */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      {eventBonus > 0 ? (
                        <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/30">
                          +{eventBonus}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 px-4 text-center font-black text-amber-400 text-sm">
                      {totalPoints} <span className="text-[10px] font-normal text-slate-400 font-sans">PTS</span>
                    </td>

                    {/* Telemetry Action */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-slate-400 group-hover:text-cyan-400 transition text-xs flex items-center justify-end gap-1 font-bold">
                        <span>Card</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prize Modal */}
      {showPrizeModal && (
        <PrizeStructureModal onClose={() => setShowPrizeModal(false)} />
      )}

    </div>
  );
};
