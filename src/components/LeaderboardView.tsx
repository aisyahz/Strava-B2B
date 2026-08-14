import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowDown, ArrowUp, BarChart3, ChevronRight, Crown, Flag, Gauge, Gift, Minus, Search, Sparkles, Timer, Trophy, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Participant, ChallengeMonth, Department, Gender, SeasonConfig } from '../types';
import { getCategoryRankings } from '../utils/calculations';
import { PrizeStructureModal } from './PrizeStructureModal';
import { soundFX } from '../utils/audio';

interface LeaderboardViewProps { participants: Participant[]; season?: SeasonConfig; currentActiveMonth?: ChallengeMonth; onSelectParticipant: (p: Participant) => void; onCompareParticipants?: (p1: Participant, p2: Participant) => void; onOpenPosterExport?: () => void; initialSearchQuery?: string; }
type RaceMode = 'race' | 'standings' | 'statistics';
type RaceData = { points: number; distance: number; movement: number };

const TEAM_COLORS: Record<Department, string> = {
  'Engineering & Tech': '#00e5ff', 'Sales & Business Dev': '#ff5a1f', 'Product & UX': '#a855f7',
  'Operations & Logistics': '#22c55e', 'Marketing & Growth': '#ec4899', 'Finance & People': '#fbbf24',
};
const MONTHS: (ChallengeMonth | 'overall')[] = ['overall', 'june', 'july', 'august', 'september', 'october', 'november'];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ participants, season, currentActiveMonth: monthProp, onSelectParticipant, onOpenPosterExport, initialSearchQuery = '' }) => {
  const currentMonth = monthProp || season?.currentActiveMonth || 'august';
  const [mode, setMode] = useState<RaceMode>('race');
  const [month, setMonth] = useState<ChallengeMonth | 'overall'>('overall');
  const [gender, setGender] = useState<Gender | 'ALL'>('ALL');
  const [department, setDepartment] = useState<Department | 'ALL'>('ALL');
  const [query, setQuery] = useState(initialSearchQuery);
  const [showPrizes, setShowPrizes] = useState(false);
  const previousLeader = useRef<string | null>(null);

  const categoryRanks = useMemo(() => {
    const map = new Map<string, number>();
    getCategoryRankings(participants, 'Female', month).forEach(p => map.set(p.id, p.categoryRank));
    getCategoryRankings(participants, 'Male', month).forEach(p => map.set(p.id, p.categoryRank));
    return map;
  }, [participants, month]);

  const valueFor = (p: Participant, pos: number): RaceData => {
    const rec = month === 'overall' ? null : p.monthlyRecords[month];
    return { points: rec?.totalPoints ?? p.totalPoints, distance: rec?.distanceKm ?? p.totalDistanceKm, movement: (rec?.previousRank ?? p.previousOverallRank ?? pos) - pos };
  };

  const ranked = useMemo(() => participants.filter(p => {
    const q = query.trim().toLowerCase();
    return p.active && (gender === 'ALL' || p.gender === gender) && (department === 'ALL' || p.department === department) && (!q || p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.stravaHandle?.toLowerCase().includes(q));
  }).sort((a, b) => {
    const ar = month === 'overall' ? null : a.monthlyRecords[month]; const br = month === 'overall' ? null : b.monthlyRecords[month];
    return (br?.totalPoints ?? b.totalPoints) - (ar?.totalPoints ?? a.totalPoints) || (br?.distanceKm ?? b.totalDistanceKm) - (ar?.distanceKm ?? a.totalDistanceKm);
  }), [participants, query, department, gender, month]);

  const leaderPoints = ranked[0] ? Math.max(1, valueFor(ranked[0], 1).points) : 1;
  const totalDistance = ranked.reduce((sum, p, i) => sum + valueFor(p, i + 1).distance, 0);
  const totalActivities = ranked.reduce((sum, p) => sum + p.totalActivities, 0);

  useEffect(() => {
    const leader = ranked[0]?.id;
    if (previousLeader.current && leader && previousLeader.current !== leader) {
      soundFX.playFanfare();
      confetti({ particleCount: 140, spread: 95, startVelocity: 48, origin: { y: .25 }, colors: ['#ffd700', '#ff5a1f', '#00e5ff', '#fff'] });
    }
    previousLeader.current = leader || null;
  }, [ranked]);

  const changeMode = (next: RaceMode) => { soundFX.playRaceBeep(); setMode(next); };

  return <div className="space-y-5 pb-16">
    <section className="race-hero relative overflow-hidden rounded-[2rem] border border-white/10 px-5 py-6 sm:px-8 sm:py-8">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.32em] text-cyan-300"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#00e5ff]" />Live telemetry · {currentMonth} sprint</div>
          <h1 className="max-w-3xl text-3xl font-black uppercase leading-[.9] tracking-[-.05em] text-white sm:text-5xl lg:text-6xl f1-font">Championship <span className="text-[#ff5a1f]">Race</span></h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400">Every kilometre moves the grid. Every point can change the podium.</p></div>
        <div className="grid grid-cols-3 gap-2 font-mono"><HeroStat value={ranked.length} label="Drivers" /><HeroStat value={totalDistance.toFixed(0)} label="KM raced" /><HeroStat value={ranked[0] ? valueFor(ranked[0], 1).points : 0} label="Lead pts" accent /></div>
      </div>
    </section>

    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid grid-cols-3 rounded-2xl border border-white/10 bg-black/30 p-1.5"><ModeButton active={mode === 'race'} onClick={() => changeMode('race')} icon={Flag} label="Race View" /><ModeButton active={mode === 'standings'} onClick={() => changeMode('standings')} icon={Trophy} label="Standings" /><ModeButton active={mode === 'statistics'} onClick={() => changeMode('statistics')} icon={BarChart3} label="Statistics" /></div>
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-1.5 font-mono text-[10px]">{MONTHS.map(m => <button key={m} onClick={() => { soundFX.playRaceBeep(); setMonth(m); }} className={`relative whitespace-nowrap rounded-xl px-3 py-2 font-black uppercase transition ${month === m ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>{m === 'overall' ? 'Season' : m}{m === currentMonth && m !== 'overall' && <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-[#ff5a1f]" />}</button>)}</div>
    </div>

    <div className="flex flex-wrap gap-2">
      <div className="flex rounded-xl border border-white/10 bg-white/[.03] p-1 text-[10px] font-black uppercase">{(['ALL', 'Female', 'Male'] as const).map(g => <button key={g} onClick={() => setGender(g)} className={`rounded-lg px-3 py-1.5 transition ${gender === g ? 'bg-[#ff5a1f] text-black' : 'text-slate-500 hover:text-white'}`}>{g === 'ALL' ? 'All drivers' : g === 'Female' ? 'Women' : 'Men'}</button>)}</div>
      <div className="relative min-w-[210px] flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a driver or team" className="glass-input w-full rounded-xl py-2 pl-9 pr-3 text-xs text-white outline-none" /></div>
      <select value={department} onChange={e => setDepartment(e.target.value as Department | 'ALL')} className="glass-input max-w-[210px] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"><option value="ALL">All teams</option>{Object.keys(TEAM_COLORS).map(d => <option key={d} value={d}>{d}</option>)}</select>
      <button onClick={() => setShowPrizes(true)} className="glass-panel-orange flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-orange-300"><Gift className="h-4 w-4" /> Prizes</button>
      {onOpenPosterExport && <button onClick={onOpenPosterExport} className="glass-panel-blue hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300 sm:flex"><Sparkles className="h-4 w-4" /> Poster</button>}
    </div>

    <AnimatePresence mode="wait">
      {mode === 'race' && <motion.div key="race" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
        <Podium racers={ranked.slice(0, 3)} valueFor={valueFor} onSelect={onSelectParticipant} />
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#090d14]/90 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[.2em] text-slate-500"><span>Live race order</span><span className="flex items-center gap-2 text-cyan-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Timing active</span></div>
          <motion.div layout className="divide-y divide-white/[.06]">{ranked.map((p, i) => <RaceLane key={p.id} p={p} position={i + 1} leaderPoints={leaderPoints} data={valueFor(p, i + 1)} categoryRank={categoryRanks.get(p.id) || i + 1} onSelect={() => onSelectParticipant(p)} />)}</motion.div>
          {!ranked.length && <div className="p-12 text-center text-sm text-slate-500">No drivers match this grid.</div>}
        </section>
      </motion.div>}
      {mode === 'standings' && <motion.div key="standings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 md:grid-cols-2">{ranked.map((p, i) => <StandingCard key={p.id} p={p} position={i + 1} data={valueFor(p, i + 1)} onSelect={() => onSelectParticipant(p)} />)}</motion.div>}
      {mode === 'statistics' && <motion.div key="statistics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-4 md:grid-cols-3">
        <StatPanel icon={Gauge} label="Total distance" value={`${totalDistance.toFixed(1)} KM`} note={`${ranked.length} active drivers`} color="#00e5ff" /><StatPanel icon={Activity} label="Activities logged" value={totalActivities.toLocaleString()} note={`${(totalActivities / Math.max(ranked.length, 1)).toFixed(1)} average`} color="#ff5a1f" /><StatPanel icon={Timer} label="Longest effort" value={`${Math.max(0, ...ranked.map(p => p.longestSingleActivityKm)).toFixed(1)} KM`} note="Single activity record" color="#a855f7" />
        <div className="glass-panel rounded-3xl p-5 md:col-span-3"><h3 className="mb-5 text-sm font-black uppercase tracking-wider text-white">Points distribution</h3><div className="space-y-4">{ranked.slice(0, 10).map((p, i) => { const d = valueFor(p, i + 1); return <div key={p.id} className="grid grid-cols-[100px_1fr_50px] items-center gap-3 text-xs"><span className="truncate font-bold text-slate-300">{p.name}</span><div className="h-2 overflow-hidden rounded-full bg-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${d.points / leaderPoints * 100}%` }} transition={{ duration: .8, delay: i * .04 }} className="h-full rounded-full" style={{ background: TEAM_COLORS[p.department] }} /></div><span className="text-right font-mono font-black text-white">{d.points}</span></div>; })}</div></div>
      </motion.div>}
    </AnimatePresence>
    {showPrizes && <PrizeStructureModal onClose={() => setShowPrizes(false)} />}
  </div>;
};

const HeroStat = ({ value, label, accent = false }: { value: string | number; label: string; accent?: boolean }) => <div className="min-w-[82px] rounded-xl border border-white/10 bg-black/35 p-3 text-center"><div className={`text-lg font-black ${accent ? 'text-[#ff5a1f]' : 'text-white'}`}>{value}</div><div className="text-[8px] uppercase tracking-wider text-slate-500">{label}</div></div>;
const ModeButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => <button onClick={onClick} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-wide transition sm:px-5 ${active ? 'bg-[#ff5a1f] text-black shadow-[0_0_24px_rgba(255,90,31,.35)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>;

const Podium = ({ racers, valueFor, onSelect }: { racers: Participant[]; valueFor: (p: Participant, pos: number) => RaceData; onSelect: (p: Participant) => void }) => {
  const slots = [racers[1], racers[0], racers[2]];
  return <div className="grid grid-cols-3 items-end gap-2 rounded-[2rem] border border-amber-300/10 bg-gradient-to-b from-amber-300/[.06] to-transparent px-3 pt-6 sm:px-8">{slots.map((p, slot) => {
    if (!p) return <div key={slot} />; const pos = slot === 1 ? 1 : slot === 0 ? 2 : 3; const heights = ['h-24 sm:h-28', 'h-32 sm:h-40', 'h-20 sm:h-24'];
    return <motion.button layoutId={`podium-${p.id}`} key={p.id} onClick={() => onSelect(p)} initial={{ y: 35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: pos * .08, type: 'spring' }} className="group flex min-w-0 flex-col items-center"><div className="relative mb-2"><img src={p.avatarUrl} alt="" className={`rounded-full object-cover ring-2 ${pos === 1 ? 'h-16 w-16 ring-amber-300 sm:h-20 sm:w-20' : 'h-12 w-12 ring-white/30 sm:h-16 sm:w-16'}`} /><span className="absolute -right-2 -top-2 text-xl">{pos === 1 ? '👑' : pos === 2 ? '🥈' : '🥉'}</span></div><div className="max-w-full truncate text-xs font-black text-white sm:text-sm">{p.name}</div><div className="mb-2 font-mono text-[10px] text-amber-300">{valueFor(p, pos).points} PTS</div><div className={`${heights[slot]} flex w-full items-start justify-center rounded-t-xl border border-b-0 border-white/10 bg-gradient-to-b ${pos === 1 ? 'from-amber-300/30 to-amber-300/5' : 'from-white/10 to-white/[.02]'} pt-4 text-3xl font-black text-white/60`}>{pos}</div></motion.button>;
  })}</div>;
};

const Movement = ({ value }: { value: number }) => value > 0 ? <span className="flex items-center text-emerald-400"><ArrowUp className="h-3 w-3" />{value}</span> : value < 0 ? <span className="flex items-center text-rose-400"><ArrowDown className="h-3 w-3" />{Math.abs(value)}</span> : <span className="text-slate-600"><Minus className="h-3 w-3" /></span>;

const RaceLane = ({ p, position, leaderPoints, data, categoryRank, onSelect }: { p: Participant; position: number; leaderPoints: number; data: RaceData; categoryRank: number; onSelect: () => void }) => {
  const progress = Math.max(7, data.points / leaderPoints * 100); const color = TEAM_COLORS[p.department];
  return <motion.button layout transition={{ layout: { type: 'spring', stiffness: 95, damping: 18 } }} onClick={onSelect} className={`group relative grid w-full grid-cols-[44px_1fr] gap-3 px-3 py-4 text-left sm:grid-cols-[62px_190px_1fr_90px] sm:items-center sm:px-5 ${position <= 5 ? 'race-top-five' : ''} ${position === 1 ? 'race-leader' : ''}`}>
    <div className="flex items-center gap-1 font-mono"><motion.span key={position} initial={{ scale: 1.5, color: '#fff' }} animate={{ scale: 1, color: position === 1 ? '#fbbf24' : '#94a3b8' }} className="text-lg font-black">{String(position).padStart(2, '0')}</motion.span><Movement value={data.movement} /></div>
    <div className="flex min-w-0 items-center gap-2 sm:gap-3"><div className="relative shrink-0"><img src={p.avatarUrl} alt={p.name} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20" /><span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#090d14]" style={{ background: color }} /></div><div className="min-w-0"><div className="flex items-center gap-1.5"><span className="truncate text-sm font-black text-white group-hover:text-orange-300">{p.name}</span>{position === 1 && <Crown className="h-3.5 w-3.5 text-amber-300" />}</div><div className="truncate text-[9px] uppercase tracking-wide text-slate-500">{p.department} · {p.gender === 'Female' ? 'W' : 'M'}{categoryRank}</div></div></div>
    <div className="col-span-2 mt-2 min-w-0 sm:col-span-1 sm:mt-0"><div className="race-track relative h-12 overflow-hidden rounded-xl border border-white/[.07] bg-black/50"><div className="absolute inset-y-0 right-5 border-r-2 border-dashed border-white/30" /><motion.div initial={false} animate={{ width: `${Math.min(progress, 97)}%` }} transition={{ duration: 1.1, type: 'spring', bounce: .18 }} className="absolute inset-y-0 left-0 opacity-25" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} /><motion.div initial={false} animate={{ left: `calc(${Math.min(progress, 94)}% - 22px)` }} transition={{ duration: 1.1, type: 'spring', bounce: .18 }} className="absolute top-1/2 -translate-y-1/2"><div className="race-car text-2xl drop-shadow-[0_0_8px_currentColor]" style={{ color }}>🏎️</div></motion.div><div className="absolute bottom-1.5 left-3 font-mono text-[8px] uppercase tracking-widest text-white/35">{position === 1 ? 'Race leader' : `${Math.max(0, leaderPoints - data.points)} pts to leader`}</div></div></div>
    <div className="absolute right-4 top-4 text-right sm:static"><motion.div key={data.points} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-mono text-lg font-black text-white">{data.points}</motion.div><div className="text-[8px] uppercase tracking-wider text-slate-500">PTS · {data.distance.toFixed(1)} KM</div><div className="mt-1 flex justify-end gap-1">{p.earnedBadges.slice(0, 3).map(b => <span key={b} className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_5px_#fbbf24]" />)}</div></div>
  </motion.button>;
};

const StandingCard = ({ p, position, data, onSelect }: { p: Participant; position: number; data: RaceData; onSelect: () => void }) => <motion.button layout onClick={onSelect} className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${position === 1 ? 'border-amber-300/40 bg-amber-300/[.07]' : 'border-white/10 bg-white/[.03]'}`}><div className="absolute inset-y-0 left-0 w-1" style={{ background: TEAM_COLORS[p.department] }} /><div className="flex items-center gap-3"><div className="w-9 text-center text-xl font-black text-slate-500">{position <= 3 ? ['🥇','🥈','🥉'][position - 1] : position}</div><img src={p.avatarUrl} alt="" className="h-12 w-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="truncate font-black text-white">{p.name}</div><div className="truncate text-[10px] uppercase text-slate-500">{p.department}</div><div className="mt-2 flex items-center gap-3 font-mono text-[10px]"><Movement value={data.movement} /><span className="text-slate-400">{data.distance.toFixed(1)} KM</span><span className="text-amber-300">{p.earnedBadges.length} BADGES</span></div></div><div className="text-right"><div className="font-mono text-2xl font-black text-white">{data.points}</div><div className="text-[9px] uppercase text-slate-500">points</div></div><ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-orange-400" /></div></motion.button>;
const StatPanel = ({ icon: Icon, label, value, note, color }: { icon: React.ElementType; label: string; value: string; note: string; color: string }) => <div className="glass-panel rounded-3xl p-5"><div className="mb-8 flex items-center justify-between"><div className="rounded-xl p-2.5" style={{ background: `${color}18`, color }}><Icon className="h-5 w-5" /></div><Zap className="h-4 w-4 text-slate-700" /></div><div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">{label}</div><div className="mt-1 text-3xl font-black text-white">{value}</div><div className="mt-2 text-xs" style={{ color }}>{note}</div></div>;
