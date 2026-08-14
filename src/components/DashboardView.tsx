import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  TrendingUp, 
  Zap, 
  Award, 
  Users, 
  Activity, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Star,
  MapPin,
  Calendar,
  Compass,
  Gift,
  Medal
} from 'lucide-react';
import { Participant, SeasonConfig, Announcement, PhotoPost, ChallengeMonth, NavTab, ViewTab, Gender } from '../types';
import { MONTHS, findMVP, getCategoryRankings } from '../utils/calculations';
import { TOP_5_PRIZES, getPrizeForRank } from '../data/prizes';
import { PrizeStructureModal } from './PrizeStructureModal';
import { CountdownWidget } from './CountdownWidget';
import { soundFX } from '../utils/audio';

interface DashboardViewProps {
  participants?: Participant[];
  season?: SeasonConfig;
  announcements?: Announcement[];
  photos?: PhotoPost[];
  onSelectParticipant: (participant: Participant) => void;
  onNavigate?: (tab: NavTab) => void;
  onViewAllLeaderboard?: () => void;
  onViewTimeline?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  participants = [],
  season,
  announcements = [],
  photos = [],
  onSelectParticipant,
  onNavigate,
  onViewAllLeaderboard,
  onViewTimeline,
}) => {
  const [podiumMonth, setPodiumMonth] = useState<ChallengeMonth | 'overall'>('overall');
  const [podiumCategory, setPodiumCategory] = useState<Gender | 'ALL'>('ALL');
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  const handleNav = (tab: NavTab) => {
    soundFX.playRaceBeep();
    if (onNavigate) {
      onNavigate(tab);
    } else if (tab === 'leaderboard' && onViewAllLeaderboard) {
      onViewAllLeaderboard();
    } else if (tab === 'timeline' && onViewTimeline) {
      onViewTimeline();
    }
  };

  // Compute leaderboard based on selected podium month and category
  const activeParticipants = participants.filter((p) => {
    if (!p.active) return false;
    if (podiumCategory !== 'ALL' && p.gender !== podiumCategory) return false;
    return true;
  });
  
  const sortedList = [...activeParticipants].sort((a, b) => {
    if (podiumMonth === 'overall') {
      return b.totalPoints - a.totalPoints || b.totalDistanceKm - a.totalDistanceKm;
    }
    const aRec = a.monthlyRecords && a.monthlyRecords[podiumMonth]?.totalPoints || 0;
    const bRec = b.monthlyRecords && b.monthlyRecords[podiumMonth]?.totalPoints || 0;
    return bRec - aRec || (b.monthlyRecords && b.monthlyRecords[podiumMonth]?.distanceKm || 0) - (a.monthlyRecords && a.monthlyRecords[podiumMonth]?.distanceKm || 0);
  });

  const p1 = sortedList[0];
  const p2 = sortedList[1];
  const p3 = sortedList[2];
  const top5 = sortedList.slice(0, 5);

  const mvp = findMVP(activeParticipants, podiumMonth === 'overall' ? undefined : podiumMonth) || p1;

  // Women & Men Apex Champions for Spotlight
  const topWomen = getCategoryRankings(participants, 'Female', podiumMonth)[0];
  const topMen = getCategoryRankings(participants, 'Male', podiumMonth)[0];

  // Aggregate Metrics
  const totalCompanyDist = Math.round(participants.reduce((acc, p) => acc + (p.totalDistanceKm || 0), 0) * 10) / 10;
  const totalCompanyPts = Math.round(participants.reduce((acc, p) => acc + (p.totalPoints || 0), 0) * 10) / 10;
  const totalActivities = participants.reduce((acc, p) => acc + (p.totalActivities || 0), 0);
  
  const currentActiveMonth = season?.currentActiveMonth || 'august';
  const club80Count = participants.filter((p) => {
    const activeRec = p.monthlyRecords && p.monthlyRecords[currentActiveMonth];
    return activeRec && activeRec.distanceKm >= 80;
  }).length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Racing Countdown & Target Widget */}
      <CountdownWidget 
        season={season} 
        totalCompanyDistanceKm={totalCompanyDist} 
      />

      {/* 2. Top Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Distance */}
        <div className="glass-panel-orange glass-panel-hover rounded-2xl p-4 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            Total Logged Mileage
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight f1-font">
            {totalCompanyDist.toLocaleString()} <span className="text-sm font-normal text-slate-400 font-sans">KM</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">↑ Active</span> across 6 departments
          </div>
        </div>

        {/* Total Points */}
        <div className="glass-panel-blue glass-panel-hover rounded-2xl p-4 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Zap className="w-16 h-16 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            Total Challenge Points
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight f1-font">
            {totalCompanyPts.toLocaleString()} <span className="text-sm font-normal text-slate-400 font-sans">PTS</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-1">
            Distance + 80km + event bonuses
          </div>
        </div>

        {/* Total Activities */}
        <div className="glass-panel-purple glass-panel-hover rounded-2xl p-4 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Activity className="w-16 h-16 text-purple-400" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-purple-400" />
            Total Activities
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight f1-font">
            {totalActivities} <span className="text-sm font-normal text-slate-400 font-sans">LOGS</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-1">
            Runs, rides, trails & marathons
          </div>
        </div>

        {/* 80KM Club Members */}
        <div className="glass-panel-emerald glass-panel-hover rounded-2xl p-4 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Award className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            {season.currentActiveMonth.toUpperCase()} 80KM Club
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight f1-font">
            {club80Count} / {participants.length} <span className="text-sm font-normal text-slate-400 font-sans">ATHLETES</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono mt-1">
            Unlocked +50 threshold bonus points
          </div>
        </div>
      </div>

      {/* 3. Formula 1 Style Podium & MVP Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: F1 3D Podium & Top 5 */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Header with Category & Month Switcher */}
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black tracking-tight text-white uppercase f1-font">
                    LEADERBOARD APEX PODIUM
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Separate Women & Men Division Categories • Top 5 Prizes Awarded
                </p>
              </div>

              <button
                onClick={() => {
                  soundFX.playRaceBeep();
                  setShowPrizeModal(true);
                }}
                className="flex items-center gap-1.5 glass-panel-orange hover:bg-orange-500/20 text-amber-300 font-mono text-xs px-3 py-1.5 rounded-xl transition cursor-pointer border border-amber-500/30 w-fit"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Prize Tiers (1st-5th)</span>
              </button>
            </div>

            {/* Category Division Tabs & Month Select */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Category selector */}
              <div className="flex items-center gap-1 glass-panel p-1 rounded-xl font-mono text-xs">
                <button
                  onClick={() => {
                    soundFX.playRaceBeep();
                    setPodiumCategory('ALL');
                  }}
                  className={`px-3 py-1 rounded-lg transition font-bold cursor-pointer ${
                    podiumCategory === 'ALL' ? 'bg-orange-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Athletes
                </button>
                <button
                  onClick={() => {
                    soundFX.playRaceBeep();
                    setPodiumCategory('Female');
                  }}
                  className={`px-3 py-1 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer ${
                    podiumCategory === 'Female' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-300/70 hover:text-pink-200'
                  }`}
                >
                  <span>👩 Women's</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playRaceBeep();
                    setPodiumCategory('Male');
                  }}
                  className={`px-3 py-1 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer ${
                    podiumCategory === 'Male' ? 'bg-blue-500 text-black shadow-md' : 'text-blue-300/70 hover:text-blue-200'
                  }`}
                >
                  <span>👨 Men's</span>
                </button>
              </div>

              {/* Month Select */}
              <div className="flex items-center gap-1 glass-panel p-1 rounded-xl font-mono text-xs overflow-x-auto">
                <button
                  onClick={() => setPodiumMonth('overall')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    podiumMonth === 'overall' ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  OVERALL
                </button>
                {MONTHS.slice(0, 3).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPodiumMonth(m.key)}
                    className={`px-2 py-1 rounded-lg transition font-bold uppercase cursor-pointer ${
                      podiumMonth === m.key ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Visual Podium Component */}
          <div className="pt-6 pb-2 grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto">
            
            {/* P2: Silver (Left) */}
            {p2 && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(p2);
                }}
                className="group cursor-pointer flex flex-col items-center text-center transition transform hover:-translate-y-1"
              >
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)] bg-slate-800">
                    <img src={p2.avatarUrl} alt={p2.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-slate-200 to-slate-400 text-black text-xs font-black font-mono w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    2
                  </div>
                  <div className="absolute -bottom-1.5 inset-x-0 mx-auto w-max px-2 py-0.2 glass-panel text-[10px] font-mono font-bold text-slate-200 rounded border border-slate-400/40">
                    🥈 2ND PLACE
                  </div>
                </div>

                <div className="font-bold text-xs sm:text-sm text-white truncate max-w-[110px] group-hover:text-cyan-400 transition">
                  {p2.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                  {p2.gender === 'Female' ? '👩 Women' : '👨 Men'} • {p2.department.split(' ')[0]}
                </div>

                {/* Podium Pedestal */}
                <div className="w-full h-28 sm:h-36 mt-3 rounded-t-2xl glass-panel border-t-2 border-slate-300 p-2 sm:p-3 flex flex-col justify-between shadow-inner">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-black font-mono text-white f1-font">
                      {podiumMonth === 'overall' ? p2.totalPoints : p2.monthlyRecords[podiumMonth]?.totalPoints} <span className="text-[10px] text-slate-400 font-normal font-sans">PTS</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-cyan-400 font-bold">
                      {podiumMonth === 'overall' ? p2.totalDistanceKm : p2.monthlyRecords[podiumMonth]?.distanceKm} KM
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-300 truncate" title="Nike Alphafly 3">
                    🎁 Nike Alphafly 3
                  </div>
                </div>
              </div>
            )}

            {/* P1: Gold Champion (Center & Highest) */}
            {p1 && (
              <div 
                onClick={() => {
                  soundFX.playFanfare();
                  onSelectParticipant(p1);
                }}
                className="group cursor-pointer flex flex-col items-center text-center transition transform hover:-translate-y-2 z-10"
              >
                <div className="relative mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] bg-slate-800 ring-4 ring-amber-400/20">
                    <img src={p1.avatarUrl} alt={p1.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span className="text-xs font-black font-mono">1ST</span>
                  </div>
                  <div className="absolute -bottom-1.5 inset-x-0 mx-auto w-max px-2.5 py-0.5 bg-amber-400 text-black text-[10px] font-mono font-black rounded-full shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                    🥇 1ST PLACE CHAMPION
                  </div>
                </div>

                <div className="font-black text-sm sm:text-base text-amber-300 truncate max-w-[130px] group-hover:underline">
                  {p1.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                  {p1.gender === 'Female' ? '👩 Women' : '👨 Men'} • {p1.department.split(' ')[0]}
                </div>

                {/* Gold Podium Pedestal */}
                <div className="w-full h-36 sm:h-48 mt-3 rounded-t-2xl glass-panel-orange border-t-4 border-amber-400 p-2 sm:p-3 flex flex-col justify-between shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-black font-mono text-amber-300 f1-font">
                      {podiumMonth === 'overall' ? p1.totalPoints : p1.monthlyRecords[podiumMonth]?.totalPoints} <span className="text-xs text-amber-200/70 font-sans">PTS</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold font-mono text-white">
                      {podiumMonth === 'overall' ? p1.totalDistanceKm : p1.monthlyRecords[podiumMonth]?.distanceKm} KM
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300 font-bold glass-panel py-1 rounded border border-amber-400/40 truncate" title="Garmin 965 + Trophy">
                    🎁 Garmin 965 + Trophy
                  </div>
                </div>
              </div>
            )}

            {/* P3: Bronze (Right) */}
            {p3 && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(p3);
                }}
                className="group cursor-pointer flex flex-col items-center text-center transition transform hover:-translate-y-1"
              >
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)] bg-slate-800">
                    <img src={p3.avatarUrl} alt={p3.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-700 to-amber-900 text-white text-xs font-black font-mono w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    3
                  </div>
                  <div className="absolute -bottom-1.5 inset-x-0 mx-auto w-max px-2 py-0.2 glass-panel text-[10px] font-mono font-bold text-amber-400 rounded border border-amber-700/40">
                    🥉 3RD PLACE
                  </div>
                </div>

                <div className="font-bold text-xs sm:text-sm text-white truncate max-w-[110px] group-hover:text-orange-400 transition">
                  {p3.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                  {p3.gender === 'Female' ? '👩 Women' : '👨 Men'} • {p3.department.split(' ')[0]}
                </div>

                {/* Podium Pedestal */}
                <div className="w-full h-24 sm:h-30 mt-3 rounded-t-2xl glass-panel border-t-2 border-amber-700 p-2 sm:p-3 flex flex-col justify-between shadow-inner">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-black font-mono text-white f1-font">
                      {podiumMonth === 'overall' ? p3.totalPoints : p3.monthlyRecords[podiumMonth]?.totalPoints} <span className="text-[10px] text-slate-400 font-normal font-sans">PTS</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-orange-400 font-bold">
                      {podiumMonth === 'overall' ? p3.totalDistanceKm : p3.monthlyRecords[podiumMonth]?.distanceKm} KM
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-amber-400 truncate" title="Shokz OpenRun Pro 2">
                    🎁 Shokz OpenRun Pro 2
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Top 4 & 5 Prize Placement Quick Cards & Full Standings Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Top 5 Prize Qualifiers:</span>
              {top5.slice(3).map((p, idx) => {
                const placeNum = idx + 4;
                const prize = getPrizeForRank(placeNum);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectParticipant(p)}
                    className="flex items-center gap-2 glass-panel glass-panel-hover px-3 py-1.5 rounded-xl cursor-pointer transition text-xs font-mono"
                  >
                    <span className="font-black text-cyan-400">{prize?.trophyIcon} #{placeNum}</span>
                    <span className="text-white truncate max-w-[90px]">{p.name}</span>
                    <span className="text-amber-400 font-bold">{p.totalPoints} pts</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleNav('leaderboard')}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-white glass-panel-orange px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer"
            >
              <span>Explore Categories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Category Champions Dual Spotlight & Department Quick Battle */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dual Category Champions Spotlight Card */}
          <div className="glass-panel-orange rounded-2xl p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black font-mono text-amber-400 tracking-wider uppercase f1-font">
                  CATEGORY LEADERS
                </span>
              </div>
              <span className="text-[10px] font-mono glass-panel text-amber-300 px-2 py-0.5 rounded-lg border border-amber-400/40">
                1ST PLACE PRIZE
              </span>
            </div>

            {/* Women's Leader */}
            {topWomen && (
              <div
                onClick={() => onSelectParticipant(topWomen)}
                className="glass-panel-purple p-3 rounded-xl border border-pink-500/30 flex items-center justify-between cursor-pointer hover:border-pink-500/60 transition"
              >
                <div className="flex items-center gap-3">
                  <img src={topWomen.avatarUrl} alt={topWomen.name} className="w-10 h-10 rounded-xl object-cover border border-pink-400" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-pink-300 font-mono flex items-center gap-1">
                      <span>👩 WOMEN'S LEADER</span>
                    </div>
                    <div className="font-black text-white text-xs truncate">{topWomen.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{topWomen.department.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-black text-pink-300">{topWomen.totalPoints} PTS</div>
                  <div className="text-[10px] text-slate-400">{topWomen.totalDistanceKm} KM</div>
                </div>
              </div>
            )}

            {/* Men's Leader */}
            {topMen && (
              <div
                onClick={() => onSelectParticipant(topMen)}
                className="glass-panel-blue p-3 rounded-xl border border-blue-500/30 flex items-center justify-between cursor-pointer hover:border-blue-500/60 transition"
              >
                <div className="flex items-center gap-3">
                  <img src={topMen.avatarUrl} alt={topMen.name} className="w-10 h-10 rounded-xl object-cover border border-blue-400" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-blue-300 font-mono flex items-center gap-1">
                      <span>👨 MEN'S LEADER</span>
                    </div>
                    <div className="font-black text-white text-xs truncate">{topMen.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{topMen.department.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-black text-blue-300">{topMen.totalPoints} PTS</div>
                  <div className="text-[10px] text-slate-400">{topMen.totalDistanceKm} KM</div>
                </div>
              </div>
            )}

            <button
              onClick={() => handleNav('leaderboard')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs py-2.5 rounded-xl transition font-mono flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>View Full Category Standings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Department Battle Quick Card */}
          <div className="glass-panel-purple rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-tight f1-font">
                  DEPARTMENT RIVALRY
                </h4>
              </div>
              <button
                onClick={() => handleNav('departments')}
                className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Battle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Engineering is leading by 25 points against Sales! Check per capita averages and team participation.
            </p>

            <button
              onClick={() => handleNav('departments')}
              className="w-full glass-panel hover:border-purple-400/50 text-purple-300 font-bold text-xs py-2.5 rounded-xl transition font-mono flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Department Standings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* 4. Latest Announcements & Live Photo Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Announcements Preview */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-black text-white uppercase tracking-tight f1-font">
                RACE BULLETINS & ANNOUNCEMENTS
              </h4>
            </div>
            <button
              onClick={() => handleNav('announcements')}
              className="text-xs font-mono text-orange-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                onClick={() => handleNav('announcements')}
                className="glass-panel glass-panel-hover p-3.5 rounded-xl cursor-pointer transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                    ann.priority === 'urgent' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                      : 'glass-panel-orange text-orange-400'
                  }`}>
                    {ann.category.toUpperCase()} • {ann.priority.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                </div>
                <h5 className="text-xs font-bold text-white leading-snug">{ann.title}</h5>
                <p className="text-[11px] text-slate-300 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Photo Highlights Feed */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-black text-white uppercase tracking-tight f1-font">
                COMMUNITY STRAVA FEED
              </h4>
            </div>
            <button
              onClick={() => handleNav('gallery')}
              className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              Open Gallery ({photos.length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {photos.slice(0, 2).map((photo) => (
              <div
                key={photo.id}
                onClick={() => handleNav('gallery')}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer aspect-video glass-panel-hover"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 flex flex-col justify-end">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-orange-400 font-bold">
                    <span>{photo.participantName}</span>
                    <span>•</span>
                    <span>{photo.distanceKm} km</span>
                  </div>
                  <p className="text-[11px] text-slate-200 truncate font-medium">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Prize Structure Modal */}
      {showPrizeModal && (
        <PrizeStructureModal onClose={() => setShowPrizeModal(false)} />
      )}

    </div>
  );
};
