import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Flame, 
  Zap, 
  Award, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Eye, 
  Swords, 
  CheckCircle2,
  TrendingUp,
  Info,
  Gift,
  Crown,
  Medal,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, ChallengeMonth, Department, Gender, SeasonConfig, CategoryDivision } from '../types';
import { MONTHS, getCategoryRankings, getTop5ByCategory } from '../utils/calculations';
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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [selectedGender, setSelectedGender] = useState<Gender | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filterTop5Only, setFilterTop5Only] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Participant | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  // Sync external search query
  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Compute category rankings for both Female and Male
  const womenRankings = useMemo(() => {
    return getCategoryRankings(participants, 'Female', selectedMonth);
  }, [participants, selectedMonth]);

  const menRankings = useMemo(() => {
    return getCategoryRankings(participants, 'Male', selectedMonth);
  }, [participants, selectedMonth]);

  // Map each participant ID to their category rank
  const categoryRankMap = useMemo(() => {
    const map = new Map<string, { catRank: number; gender: Gender }>();
    womenRankings.forEach((p) => map.set(p.id, { catRank: p.categoryRank, gender: 'Female' }));
    menRankings.forEach((p) => map.set(p.id, { catRank: p.categoryRank, gender: 'Male' }));
    return map;
  }, [womenRankings, menRankings]);

  // Filter and sort
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fc5200', '#00f0ff', '#fbbf24', '#a855f7'],
    });
    onSelectParticipant(p);
  };

  const handleCompareClick = (p: Participant, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playRaceBeep();
    if (!selectedForComparison) {
      setSelectedForComparison(p);
    } else if (selectedForComparison.id === p.id) {
      setSelectedForComparison(null);
    } else {
      if (onCompareParticipants) {
        onCompareParticipants(selectedForComparison, p);
      }
      setSelectedForComparison(null);
    }
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

  // Active top 5 list for selected gender
  const currentCategoryTop5 = useMemo(() => {
    if (selectedGender === 'Female') return womenRankings.slice(0, 5);
    if (selectedGender === 'Male') return menRankings.slice(0, 5);
    return null;
  }, [selectedGender, womenRankings, menRankings]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
              LIVE STRAVA LEADERBOARD
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Separate Women & Men Division Categories • Official Grand Prix Prizes for 1st through 5th Place
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundFX.playRaceBeep();
              setShowPrizeModal(true);
            }}
            className="flex items-center gap-1.5 glass-panel-orange hover:bg-orange-500/20 text-amber-300 font-mono text-xs px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-500/30"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Top 5 Prize Structure</span>
          </button>

          {onOpenPosterExport && (
            <button
              onClick={onOpenPosterExport}
              className="flex items-center gap-1.5 glass-panel hover:bg-white/10 text-white font-mono text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Poster</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected for Comparison Banner */}
      {selectedForComparison && (
        <div className="glass-panel-blue rounded-xl px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono text-cyan-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>Rivalry mode: Selected <b>{selectedForComparison.name}</b>. Click 2nd athlete to compare!</span>
          </div>
          <button
            onClick={() => setSelectedForComparison(null)}
            className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 2. PRIMARY CATEGORY DIVISION TABS (Women vs Men vs All) */}
      <div className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => {
              soundFX.playRaceBeep();
              setSelectedGender('ALL');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase font-mono tracking-wider transition whitespace-nowrap cursor-pointer ${
              selectedGender === 'ALL'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-[0_0_15px_rgba(255,87,34,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>🏆 All Divisions</span>
          </button>

          <button
            onClick={() => {
              soundFX.playRaceBeep();
              setSelectedGender('Female');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase font-mono tracking-wider transition whitespace-nowrap cursor-pointer ${
              selectedGender === 'Female'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                : 'text-pink-300/70 hover:text-pink-200 hover:bg-pink-500/10 border border-pink-500/20'
            }`}
          >
            <span className="text-sm">👩</span>
            <span>Women's Category (Top 5 Prizes)</span>
            <span className="text-[10px] bg-black/40 text-pink-200 px-1.5 py-0.5 rounded-md font-mono">
              {womenRankings.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundFX.playRaceBeep();
              setSelectedGender('Male');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase font-mono tracking-wider transition whitespace-nowrap cursor-pointer ${
              selectedGender === 'Male'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'text-blue-300/70 hover:text-blue-200 hover:bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            <span className="text-sm">👨</span>
            <span>Men's Category (Top 5 Prizes)</span>
            <span className="text-[10px] bg-black/40 text-blue-200 px-1.5 py-0.5 rounded-md font-mono">
              {menRankings.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Prizes: <b>1st to 5th Place</b> in both categories</span>
        </div>
      </div>

      {/* 3. Month Tabs (Overall + June - Nov) */}
      <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-xl">
        <button
          onClick={() => {
            soundFX.playRaceBeep();
            setSelectedMonth('overall');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase font-mono tracking-wider transition whitespace-nowrap cursor-pointer ${
            selectedMonth === 'overall'
              ? 'bg-[#FF5722] text-black shadow-[0_0_15px_rgba(255,87,34,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 OVERALL CUMULATIVE</span>
        </button>

        {MONTHS.map((m) => {
          const isCurrentActive = m.key === currentActiveMonth;
          const isSelected = selectedMonth === m.key;
          return (
            <button
              key={m.key}
              onClick={() => {
                soundFX.playRaceBeep();
                setSelectedMonth(m.key);
              }}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#FF5722] text-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{m.label}</span>
              {isCurrentActive && (
                <span className={`ml-1.5 text-[9px] px-1 py-0.2 rounded font-black ${
                  isSelected ? 'bg-black text-orange-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. TOP 5 PRIZE PODIUM & REWARDS BANNER (Category-Specific or Dual View) */}
      {selectedGender !== 'ALL' && currentCategoryTop5 && (
        <div className={`rounded-3xl p-5 border shadow-2xl space-y-4 ${
          selectedGender === 'Female' 
            ? 'glass-panel-purple border-pink-500/30' 
            : 'glass-panel-blue border-blue-500/30'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedGender === 'Female' ? '👩' : '👨'}</span>
              <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider f1-font">
                {selectedGender === 'Female' ? "WOMEN'S CATEGORY: TOP 5 PRIZE PLACEMENTS" : "MEN'S CATEGORY: TOP 5 PRIZE PLACEMENTS"}
              </h3>
            </div>
            <div className="text-xs font-mono text-amber-300 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              <span>All 5 Positions Win Official Grand Prix Rewards</span>
            </div>
          </div>

          {/* 5-Card Prize Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
            {TOP_5_PRIZES.map((prize, idx) => {
              const athlete = currentCategoryTop5[idx];
              const dist = athlete 
                ? (selectedMonth === 'overall' ? athlete.totalDistanceKm : athlete.monthlyRecords[selectedMonth]?.distanceKm || 0)
                : 0;
              const pts = athlete 
                ? (selectedMonth === 'overall' ? athlete.totalPoints : athlete.monthlyRecords[selectedMonth]?.totalPoints || 0)
                : 0;

              return (
                <div
                  key={prize.place}
                  onClick={() => athlete && onSelectParticipant(athlete)}
                  className={`glass-panel p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                    athlete ? 'cursor-pointer hover:border-white/30 hover:scale-[1.02]' : 'opacity-60'
                  } ${
                    idx === 0 
                      ? 'border-amber-400/50 bg-amber-500/10' 
                      : idx === 1 
                      ? 'border-slate-300/40 bg-slate-400/5' 
                      : idx === 2 
                      ? 'border-amber-700/40 bg-amber-900/10' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{prize.trophyIcon}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${prize.badgeBg}`}>
                      PLACE #{prize.place}
                    </span>
                  </div>

                  {athlete ? (
                    <div className="space-y-2 my-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={athlete.avatarUrl}
                          alt={athlete.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/20"
                        />
                        <div className="min-w-0">
                          <div className="font-black text-white text-xs truncate">{athlete.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{athlete.department.split(' ')[0]}</div>
                        </div>
                      </div>
                      <div className="text-xs font-black text-white">
                        <span className="text-amber-400">{pts} PTS</span> <span className="text-slate-400 text-[10px]">({dist} KM)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-slate-500 text-xs italic">
                      Position Open
                    </div>
                  )}

                  {/* Prize Info Footer */}
                  <div className="pt-2 border-t border-white/10 mt-2">
                    <div className="text-[10px] text-amber-300/90 font-sans truncate" title={prize.reward}>
                      🎁 {prize.reward}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {prize.cashEquivalent}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dual Category Showcase when ALL is selected */}
      {selectedGender === 'ALL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Women's Top 5 Quick Card */}
          <div className="glass-panel-purple p-4 rounded-2xl border border-pink-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-2">
              <div className="flex items-center gap-2 text-pink-300 font-black">
                <span>👩 WOMEN'S TOP 5 APEX (PRIZE QUALIFIED)</span>
              </div>
              <button
                onClick={() => setSelectedGender('Female')}
                className="text-[11px] text-pink-400 hover:text-pink-200 underline cursor-pointer"
              >
                View Category →
              </button>
            </div>
            <div className="space-y-1.5">
              {womenRankings.slice(0, 5).map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onSelectParticipant(p)}
                  className="flex items-center justify-between glass-panel p-2 rounded-xl hover:bg-pink-500/10 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-black text-pink-400">#{idx + 1}</span>
                    <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                    <span className="text-white font-bold truncate max-w-[120px]">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">{p.totalPoints} pts</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{p.totalDistanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Men's Top 5 Quick Card */}
          <div className="glass-panel-blue p-4 rounded-2xl border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <div className="flex items-center gap-2 text-blue-300 font-black">
                <span>👨 MEN'S TOP 5 APEX (PRIZE QUALIFIED)</span>
              </div>
              <button
                onClick={() => setSelectedGender('Male')}
                className="text-[11px] text-blue-400 hover:text-blue-200 underline cursor-pointer"
              >
                View Category →
              </button>
            </div>
            <div className="space-y-1.5">
              {menRankings.slice(0, 5).map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onSelectParticipant(p)}
                  className="flex items-center justify-between glass-panel p-2 rounded-xl hover:bg-blue-500/10 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-black text-blue-400">#{idx + 1}</span>
                    <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                    <span className="text-white font-bold truncate max-w-[120px]">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">{p.totalPoints} pts</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{p.totalDistanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Filter Bar (Search, Department, Top 5) */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by athlete name or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input text-white pl-9 pr-3 py-2 rounded-xl text-xs"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Dept:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as Department | 'ALL')}
            className="glass-input text-white px-3 py-2 rounded-xl text-xs bg-[#050505]/80"
          >
            {departmentsList.map((d) => (
              <option key={d} value={d} className="bg-[#0c1322] text-white">
                {d === 'ALL' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Top 5 Toggle */}
        <button
          onClick={() => setFilterTop5Only(!filterTop5Only)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition cursor-pointer ${
            filterTop5Only
              ? 'glass-panel-orange text-amber-300 shadow-sm border-amber-500/40'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Top 5 Only</span>
        </button>

      </div>

      {/* 6. Main Telemetry Leaderboard Table */}
      <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">
                  {selectedGender !== 'ALL' ? 'Cat Pos' : 'Rank'}
                </th>
                <th className="py-3.5 px-4 text-center w-14">Shift</th>
                <th className="py-3.5 px-4">Athlete Profile</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Division</th>
                <th className="py-3.5 px-4">Prize Qualification</th>
                <th className="py-3.5 px-4 text-right">Distance (KM)</th>
                <th className="py-3.5 px-4 text-right hidden sm:table-cell">Dist Pts</th>
                <th className="py-3.5 px-4 text-right hidden lg:table-cell">Bonus Pts</th>
                <th className="py-3.5 px-4 text-right">Total Pts</th>
                <th className="py-3.5 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {displayList.map((participant, index) => {
                const rankNum = index + 1;
                
                // Get monthly record or overall
                const rec = selectedMonth === 'overall' 
                  ? null 
                  : participant.monthlyRecords[selectedMonth];

                const distance = selectedMonth === 'overall'
                  ? participant.totalDistanceKm
                  : rec?.distanceKm || 0;

                const distPts = selectedMonth === 'overall'
                  ? Math.round(participant.totalDistanceKm * 10) / 10
                  : rec?.distancePoints || 0;

                const bonusPts = selectedMonth === 'overall'
                  ? Math.round((participant.totalPoints - participant.totalDistanceKm) * 10) / 10
                  : rec?.totalBonus || 0;

                const totalPts = selectedMonth === 'overall'
                  ? participant.totalPoints
                  : rec?.totalPoints || 0;

                // Category Rank
                const catMeta = categoryRankMap.get(participant.id);
                const catRank = catMeta?.catRank || rankNum;
                const effectiveRankForPrize = selectedGender !== 'ALL' ? rankNum : catRank;
                const prize = getPrizeForRank(effectiveRankForPrize);

                // Rank delta
                const prevRank = selectedMonth === 'overall'
                  ? participant.previousOverallRank
                  : rec?.previousRank || rankNum;

                const rankDelta = prevRank - rankNum;

                // 80KM threshold status
                const hit80 = (selectedMonth === 'overall' ? (distance / 3 >= 80) : distance >= 80);

                // Row style based on podium position
                let rankBadgeBg = 'glass-panel text-slate-300';
                let rowBg = 'hover:bg-white/[0.04]';

                if (rankNum === 1) {
                  rankBadgeBg = 'bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_12px_rgba(251,191,36,0.6)]';
                  rowBg = 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]';
                } else if (rankNum === 2) {
                  rankBadgeBg = 'bg-slate-200 text-black border-slate-100 font-black shadow-md';
                  rowBg = 'bg-slate-400/[0.03] hover:bg-slate-400/[0.06]';
                } else if (rankNum === 3) {
                  rankBadgeBg = 'bg-amber-700 text-white border-amber-600 font-black shadow-md';
                  rowBg = 'bg-amber-700/[0.03] hover:bg-amber-700/[0.06]';
                } else if (rankNum <= 5) {
                  rankBadgeBg = 'glass-panel-purple text-purple-300';
                }

                return (
                  <tr
                    key={participant.id}
                    onClick={() => onSelectParticipant(participant)}
                    className={`transition cursor-pointer group ${rowBg}`}
                  >
                    {/* Rank Position */}
                    <td className="py-3 px-4 text-center">
                      <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-xs font-bold border ${rankBadgeBg}`}>
                        {rankNum}
                      </div>
                    </td>

                    {/* Rank Shift Indicator */}
                    <td className="py-3 px-4 text-center">
                      {rankDelta > 0 ? (
                        <div className="flex items-center justify-center gap-0.5 text-emerald-400 font-bold">
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>{rankDelta}</span>
                        </div>
                      ) : rankDelta < 0 ? (
                        <div className="flex items-center justify-center gap-0.5 text-red-400 font-bold">
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>{Math.abs(rankDelta)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-slate-500">
                          <Minus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </td>

                    {/* Athlete Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={participant.avatarUrl}
                            alt={participant.name}
                            className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-orange-500/60 transition"
                          />
                          {rankNum === 1 && (
                            <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-orange-400 transition truncate">
                              {participant.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              participant.gender === 'Female' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {participant.gender === 'Female' ? '👩 Women' : '👨 Men'}
                            </span>
                            {hit80 && (
                              <span className="glass-panel-emerald text-emerald-300 text-[9px] px-1.5 py-0.2 rounded-lg hidden sm:inline" title="80KM Threshold Achieved">
                                +50 PTS
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-2">
                            <span>{participant.roleTitle}</span>
                            {participant.stravaHandle && (
                              <span className="text-orange-400/80 font-mono hidden sm:inline">@{participant.stravaHandle}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 hidden md:table-cell text-slate-300 text-[11px]">
                      <span className="glass-panel px-2.5 py-1 rounded-lg truncate block max-w-[160px]">
                        {participant.department}
                      </span>
                    </td>

                    {/* Prize Qualification (1st to 5th Place) */}
                    <td className="py-3 px-4">
                      {prize ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{prize.trophyIcon}</span>
                          <div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${prize.badgeBg}`}>
                              {prize.place <= 3 ? `${prize.place}${prize.place === 1 ? 'st' : prize.place === 2 ? 'nd' : 'rd'} Place Prize` : `${prize.place}th Place Prize`}
                            </span>
                            <div className="text-[10px] text-slate-400 font-sans truncate max-w-[150px] hidden lg:block" title={prize.reward}>
                              {prize.reward}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">
                          Challenger (Top 5 target)
                        </span>
                      )}
                    </td>

                    {/* Distance */}
                    <td className="py-3 px-4 text-right font-bold text-white">
                      <span className="text-orange-400">{distance.toLocaleString()}</span> <span className="text-slate-500 text-[10px] font-normal">KM</span>
                    </td>

                    {/* Distance Points */}
                    <td className="py-3 px-4 text-right hidden sm:table-cell text-slate-300">
                      {distPts}
                    </td>

                    {/* Bonus Points */}
                    <td className="py-3 px-4 text-right hidden lg:table-cell">
                      {bonusPts > 0 ? (
                        <span className="text-cyan-400 font-bold">+{bonusPts}</span>
                      ) : (
                        <span className="text-slate-600">0</span>
                      )}
                    </td>

                    {/* Total Points */}
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm font-black text-white font-mono group-hover:text-cyan-300 transition f1-font">
                        {totalPts.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal font-sans">PTS</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => triggerCelebration(participant)}
                          className="p-1.5 rounded-lg glass-panel glass-panel-hover text-slate-400 hover:text-white transition cursor-pointer"
                          title="View Athlete Telemetry Card"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onCompareParticipants && (
                          <button
                            onClick={(e) => handleCompareClick(participant, e)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              selectedForComparison?.id === participant.id
                                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                                : 'glass-panel glass-panel-hover text-slate-400 hover:text-cyan-300'
                            }`}
                            title="Compare Head-to-Head Rivalry"
                          >
                            <Swords className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Strip */}
        <div className="bg-white/[0.02] px-4 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div>
            Showing <span className="text-white font-bold">{displayList.length}</span> of {participants.length} athletes
            {selectedGender !== 'ALL' && <span className="text-amber-400 font-bold ml-1.5">({selectedGender === 'Female' ? "Women's Division" : "Men's Division"})</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
              Prizes: 1st-5th Place
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
              80KM Bonus (+50)
            </span>
          </div>
        </div>
      </div>

      {/* Prize Modal */}
      {showPrizeModal && (
        <PrizeStructureModal onClose={() => setShowPrizeModal(false)} />
      )}

    </div>
  );
};
