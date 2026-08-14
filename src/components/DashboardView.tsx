import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Award,
  Crown,
  Share2,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, SeasonConfig, Announcement, PhotoPost, ChallengeMonth, NavTab, Gender } from '../types';
import { findMVP, getCategoryRankings } from '../utils/calculations';
import { OFFICIAL_EVENTS, OfficialEvent } from '../data/events';
import { TOP_5_PRIZES } from '../data/prizes';
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
  onOpenPosterExport?: () => void;
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
  onOpenPosterExport,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<ChallengeMonth | 'overall'>('overall');
  const [eventsList, setEventsList] = useState<OfficialEvent[]>(OFFICIAL_EVENTS);

  const handleNav = (tab: NavTab) => {
    soundFX.playRaceBeep();
    if (onNavigate) onNavigate(tab);
    else if (tab === 'leaderboard' && onViewAllLeaderboard) onViewAllLeaderboard();
  };

  const handleToggleRegister = (id: string) => {
    soundFX.playRankUp();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5722', '#00E5FF', '#FBBF24'],
    });
    setEventsList(prev => prev.map(ev => {
      if (ev.id === id) {
        const nextState = !ev.isRegistered;
        return {
          ...ev,
          isRegistered: nextState,
          registeredCount: nextState ? ev.registeredCount + 1 : Math.max(0, ev.registeredCount - 1),
        };
      }
      return ev;
    }));
  };

  // Compute Metrics
  const activeParticipants = participants.filter((p) => p.active);
  const totalCompanyDist = Math.round(activeParticipants.reduce((acc, p) => acc + (p.totalDistanceKm || 0), 0) * 10) / 10;
  const totalCompanyPts = Math.round(activeParticipants.reduce((acc, p) => acc + (p.totalPoints || 0), 0) * 10) / 10;
  const targetKm = season?.targetCompanyDistanceKm || 15000;
  const progressPercent = Math.min(100, Math.round((totalCompanyDist / targetKm) * 100));

  // Men & Women Top 3 for instant visual podium
  const topMen = getCategoryRankings(participants, 'Male', selectedMonth).slice(0, 3);
  const topWomen = getCategoryRankings(participants, 'Female', selectedMonth).slice(0, 3);

  const menChamp = topMen[0];
  const womenChamp = topWomen[0];

  const currentActiveMonth = season?.currentActiveMonth || 'august';
  const monthStages = [
    { key: 'june', label: 'JUN', status: 'completed', icon: '🏁' },
    { key: 'july', label: 'JUL', status: 'completed', icon: '⚡' },
    { key: 'august', label: 'AUG', status: 'active', icon: '🔥' },
    { key: 'september', label: 'SEP', status: 'upcoming', icon: '🎯' },
    { key: 'october', label: 'OCT', status: 'upcoming', icon: '🚀' },
    { key: 'november', label: 'NOV', status: 'upcoming', icon: '🏆' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* ================================================================ */}
      {/* 1. HERO BANNER: MINIMAL, HIGH IMPACT (Apple/F1 Aesthetic)          */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5722]/15 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]"></span>
              </span>
              <span className="font-mono text-xs font-black tracking-widest text-[#00E5FF] uppercase">
                F1 TELEMETRY • LIVE CHAMPIONSHIP
              </span>
            </div>

            {/* Huge Minimal Title */}
            <div>
              <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase f1-font leading-none">
                B2B COMMERCE
              </div>
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#00E5FF] tracking-tight uppercase f1-font leading-none mt-1">
                STRAVA GP 2026
              </div>
            </div>

            {/* Sport Discipline Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="glass-panel px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/15 flex items-center gap-1.5">
                <span>🏃</span> RUN
              </span>
              <span className="text-slate-600">•</span>
              <span className="glass-panel px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/15 flex items-center gap-1.5">
                <span>🚴</span> RIDE
              </span>
              <span className="text-slate-600">•</span>
              <span className="glass-panel px-3.5 py-1 rounded-full text-xs font-mono font-bold text-white border border-white/15 flex items-center gap-1.5">
                <span>🏔️</span> HIKE
              </span>
              <span className="text-slate-600">•</span>
              <span className="glass-panel-orange px-3.5 py-1 rounded-full text-xs font-mono font-bold text-orange-400 border border-orange-500/40">
                STAGE 3: AUG SPRINT
              </span>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => handleNav('leaderboard')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#ff7043] text-black font-black font-mono text-sm px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(255,87,34,0.4)] transition cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>VIEW LEADERBOARD</span>
            </button>

            {onOpenPosterExport && (
              <button
                onClick={onOpenPosterExport}
                className="flex items-center justify-center gap-2 glass-panel-blue hover:bg-cyan-500/20 text-cyan-300 font-bold font-mono text-sm px-5 py-3.5 rounded-2xl border border-cyan-400/40 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>POSTER</span>
              </button>
            )}
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>🎯</span> TARGET PROGRESS
            </span>
            <span className="text-white font-bold">
              <span className="text-orange-400 font-mono font-black">{totalCompanyDist.toLocaleString()} KM</span> / {targetKm.toLocaleString()} KM <span className="text-cyan-400">({progressPercent}%)</span>
            </span>
          </div>
          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#00E5FF] shadow-[0_0_15px_rgba(255,87,34,0.8)] transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. TELEMETRY KPI CARDS (Numbers & Icons First)                   */}
      {/* ================================================================ */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Athletes */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono font-bold mb-2">
            <span>ATHLETES</span>
            <span className="text-lg">👥</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight f1-font">
            {activeParticipants.length}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span>↑ 100% Active</span>
          </div>
        </div>

        {/* 2. Distance */}
        <div className="glass-panel-orange glass-panel-hover rounded-2xl p-4 sm:p-5 border border-orange-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between text-orange-400 text-xs font-mono font-bold mb-2">
            <span>TOTAL DISTANCE</span>
            <span className="text-lg">🏃</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight f1-font">
            {totalCompanyDist.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">KM</span>
          </div>
          <div className="text-[11px] font-mono text-orange-400 mt-1 flex items-center gap-1">
            <span>🔥 6 Departments</span>
          </div>
        </div>

        {/* 3. Points */}
        <div className="glass-panel-blue glass-panel-hover rounded-2xl p-4 sm:p-5 border border-cyan-400/30 relative overflow-hidden group">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-mono font-bold mb-2">
            <span>TOTAL POINTS</span>
            <span className="text-lg">⭐</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight f1-font">
            {totalCompanyPts.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">PTS</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-300 mt-1">
            <span>Distance + Bonuses</span>
          </div>
        </div>

        {/* 4. Events */}
        <div className="glass-panel-purple glass-panel-hover rounded-2xl p-4 sm:p-5 border border-purple-500/30 relative overflow-hidden group">
          <div className="flex items-center justify-between text-purple-400 text-xs font-mono font-bold mb-2">
            <span>OFFICIAL EVENTS</span>
            <span className="text-lg">🏆</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight f1-font">
            {eventsList.length} <span className="text-xs font-sans text-slate-400 font-normal">EVTS</span>
          </div>
          <div className="text-[11px] font-mono text-purple-300 mt-1">
            <span>+25 pts / event</span>
          </div>
        </div>

        {/* 5. Countdown Days */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden col-span-2 sm:col-span-1 group">
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono font-bold mb-2">
            <span>DAYS REMAINING</span>
            <span className="text-lg">⏳</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-tight f1-font">
            123 <span className="text-xs font-sans text-slate-400 font-normal">DAYS</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            <span>Dec 15 Victory Gala</span>
          </div>
        </div>

      </section>

      {/* ================================================================ */}
      {/* 3. DUAL CATEGORY CHAMPIONS SPOTLIGHT (F1 Driver Cards)           */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight f1-font">
              APEX CHAMPIONS
            </h3>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1 glass-panel p-1 rounded-xl text-xs font-mono">
            {(['overall', 'june', 'july'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  soundFX.playRaceBeep();
                  setSelectedMonth(m);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition uppercase cursor-pointer ${
                  selectedMonth === m
                    ? 'bg-[#FF5722] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'overall' ? 'OVERALL' : m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Men's Champion Card */}
          {menChamp && (
            <div
              onClick={() => {
                soundFX.playRaceBeep();
                onSelectParticipant(menChamp);
              }}
              className="glass-panel-blue glass-panel-hover rounded-3xl p-5 sm:p-6 border border-cyan-400/40 cursor-pointer shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4">
                <span className="glass-panel-blue text-cyan-300 text-xs font-mono font-black px-3 py-1 rounded-full border border-cyan-400/30 flex items-center gap-1.5">
                  <span>👨</span> MEN'S P1 APEX
                </span>
                <span className="text-2xl select-none">🥇</span>
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img
                    src={menChamp.avatarUrl}
                    alt={menChamp.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:scale-105 transition"
                  />
                  <div className="absolute -bottom-2 -right-1 bg-cyan-400 text-black text-[10px] font-black font-mono px-2 py-0.5 rounded-full shadow-md">
                    P1
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white truncate f1-font">
                    {menChamp.name}
                  </div>
                  <div className="text-xs font-mono text-cyan-300 truncate">
                    {menChamp.department}
                  </div>

                  {/* High Impact Numbers */}
                  <div className="flex items-center gap-4 pt-2 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">DISTANCE</div>
                      <div className="text-lg sm:text-xl font-black text-white">
                        {menChamp.totalDistanceKm} <span className="text-xs font-normal text-slate-400 font-sans">KM</span>
                      </div>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">POINTS</div>
                      <div className="text-lg sm:text-xl font-black text-cyan-400">
                        {menChamp.totalPoints} <span className="text-xs font-normal text-slate-400 font-sans">PTS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Women's Champion Card */}
          {womenChamp && (
            <div
              onClick={() => {
                soundFX.playRaceBeep();
                onSelectParticipant(womenChamp);
              }}
              className="glass-panel-orange glass-panel-hover rounded-3xl p-5 sm:p-6 border border-pink-500/40 cursor-pointer shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4">
                <span className="glass-panel-orange text-pink-300 text-xs font-mono font-black px-3 py-1 rounded-full border border-pink-500/30 flex items-center gap-1.5">
                  <span>👩</span> WOMEN'S P1 APEX
                </span>
                <span className="text-2xl select-none">🥇</span>
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img
                    src={womenChamp.avatarUrl}
                    alt={womenChamp.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] group-hover:scale-105 transition"
                  />
                  <div className="absolute -bottom-2 -right-1 bg-pink-500 text-black text-[10px] font-black font-mono px-2 py-0.5 rounded-full shadow-md">
                    P1
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white truncate f1-font">
                    {womenChamp.name}
                  </div>
                  <div className="text-xs font-mono text-pink-300 truncate">
                    {womenChamp.department}
                  </div>

                  {/* High Impact Numbers */}
                  <div className="flex items-center gap-4 pt-2 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">DISTANCE</div>
                      <div className="text-lg sm:text-xl font-black text-white">
                        {womenChamp.totalDistanceKm} <span className="text-xs font-normal text-slate-400 font-sans">KM</span>
                      </div>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold">POINTS</div>
                      <div className="text-lg sm:text-xl font-black text-pink-400">
                        {womenChamp.totalPoints} <span className="text-xs font-normal text-slate-400 font-sans">PTS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. OFFICIAL COMPANY EVENTS (Timeline & Register Cards)           */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight f1-font">
              OFFICIAL RACE EVENTS
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Earn +25 Bonus PTS Per Event
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eventsList.map((event) => {
            const isCompleted = event.status === 'completed';

            return (
              <div 
                key={event.id}
                className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group shadow-lg"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="glass-panel text-white text-[10px] font-mono font-black px-2.5 py-1 rounded-full border border-white/20">
                      {event.icon} {event.category}
                    </span>
                    <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full ${
                      isCompleted ? 'bg-slate-700 text-slate-300' : 'bg-orange-500 text-black shadow-md'
                    }`}>
                      +{event.bonusPoints} PTS
                    </span>
                  </div>

                  {/* Distance on Image */}
                  <div className="absolute bottom-2 left-3 font-mono font-black text-lg text-white">
                    {event.distanceKm} KM
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Registration Action */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-400">
                      👥 <span className="text-white font-bold">{event.registeredCount}</span>/{event.capacity}
                    </div>

                    {isCompleted ? (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Finished
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleRegister(event.id)}
                        className={`text-xs font-mono font-black px-3 py-1.5 rounded-xl cursor-pointer transition ${
                          event.isRegistered
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-[#FF5722] hover:bg-[#ff7043] text-black shadow-md'
                        }`}
                      >
                        {event.isRegistered ? '✓ Registered' : 'Register'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. OFFICIAL BULLETINS & CARDS                                    */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📢</span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight f1-font">
              OFFICIAL BULLETINS
            </h3>
          </div>
          <button
            onClick={() => handleNav('announcements')}
            className="text-xs font-mono text-orange-400 hover:text-orange-300 font-bold cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.slice(0, 3).map((ann) => (
            <div
              key={ann.id}
              className="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg ${
                    ann.priority === 'urgent'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  }`}>
                    {ann.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{ann.date}</span>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug line-clamp-2">
                  {ann.title}
                </h4>

                <p className="text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>By {ann.author}</span>
                <span className="text-pink-400">❤️ {ann.likesCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. PRESTIGE PRIZE GALLERY (Visual Product Cards)                 */}
      {/* ================================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight f1-font">
              PRIZE PODIUM TIERS
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            Equal Prizes for Men & Women
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {TOP_5_PRIZES.map((prize) => (
            <div
              key={prize.place}
              className="glass-panel glass-panel-hover rounded-3xl p-4 sm:p-5 border border-white/10 text-center space-y-3 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="text-3xl sm:text-4xl select-none mb-1">{prize.trophyIcon}</div>
                <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${prize.badgeBg}`}>
                  TOP #{prize.place}
                </span>
                <div className="font-bold text-white text-sm mt-2">{prize.title}</div>
                <div className="text-xs font-mono text-slate-300 mt-1 leading-snug">
                  {prize.reward}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs font-mono font-black text-amber-400">
                {prize.cashEquivalent}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
