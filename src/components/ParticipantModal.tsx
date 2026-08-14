import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Flame, 
  Zap, 
  TrendingUp, 
  Award, 
  MapPin, 
  Heart, 
  Compass, 
  Calendar, 
  Activity, 
  Swords, 
  Sparkles,
  Share2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import confetti from 'canvas-confetti';
import { Participant, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { MONTHS } from '../utils/calculations';
import { soundFX } from '../utils/audio';

interface ParticipantModalProps {
  participant: Participant | null;
  allParticipants: Participant[];
  onClose: () => void;
  rivalParticipant?: Participant | null;
  onSelectRival?: (rival: Participant | null) => void;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  participant,
  allParticipants,
  onClose,
  rivalParticipant: initialRival,
  onSelectRival,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'distance' | 'points' | 'rank'>('distance');
  const [kudosGiven, setKudosGiven] = useState(false);
  const [kudosCount, setKudosCount] = useState(28);
  const [rival, setRival] = useState<Participant | null>(initialRival || null);

  if (!participant) return null;

  const handleKudos = () => {
    if (!kudosGiven) {
      soundFX.playKudos();
      setKudosCount((prev) => prev + 1);
      setKudosGiven(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fc5200', '#ff7a00', '#fbbf24'],
      });
    }
  };

  // Prepare monthly chart data
  const chartData = MONTHS.map(({ key, short, label }) => {
    const rec = participant.monthlyRecords[key];
    const rivalRec = rival?.monthlyRecords[key];
    return {
      name: short,
      monthLabel: label,
      distance: rec?.distanceKm || 0,
      points: rec?.totalPoints || 0,
      rank: rec?.rank || 20,
      elevation: rec?.elevationGainMeters || 0,
      rivalDistance: rivalRec?.distanceKm || 0,
      rivalPoints: rivalRec?.totalPoints || 0,
      rivalRank: rivalRec?.rank || 20,
    };
  });

  // Calculate most active month
  let mostActiveMonth = 'June';
  let maxKm = 0;
  MONTHS.forEach(({ key, label }) => {
    const km = participant.monthlyRecords[key]?.distanceKm || 0;
    if (km > maxKm) {
      maxKm = km;
      mostActiveMonth = label;
    }
  });

  // Earned vs Locked Badges
  const earnedBadgeSet = new Set(participant.earnedBadges || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl glass-panel-orange border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-8">
        
        {/* Header Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FF5722]/20 via-[#00E5FF]/10 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full glass-panel hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Scroll Area */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Athlete Hero Profile Card */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-orange-500 shadow-[0_0_20px_rgba(255,87,34,0.4)]"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#FF5722] text-black text-xs font-black font-mono px-2 py-0.5 rounded-full shadow-lg">
                  RANK #{participant.overallRank}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white f1-font">{participant.name}</h3>
                  <span className="text-xs font-mono glass-panel-blue text-cyan-300 px-2 py-0.5 rounded-lg">
                    {participant.gender}
                  </span>
                </div>
                <p className="text-xs font-mono text-orange-400 font-bold mt-0.5">{participant.roleTitle}</p>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <span>{participant.department}</span>
                  {participant.stravaHandle && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300">@{participant.stravaHandle}</span>
                    </>
                  )}
                </p>
                {participant.shoeOrBikeModel && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                    <span className="text-orange-400">⚡ Gear:</span> {participant.shoeOrBikeModel}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions (Kudos & Rivalry Toggle) */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleKudos}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  kudosGiven
                    ? 'bg-[#FF5722] text-black shadow-[0_0_15px_rgba(255,87,34,0.5)]'
                    : 'glass-panel text-orange-400 border-orange-500/40 hover:border-orange-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${kudosGiven ? 'fill-black' : 'fill-orange-400'}`} />
                <span>{kudosGiven ? 'Kudos Sent!' : 'Give Kudos'} ({kudosCount})</span>
              </button>

              {/* Head to Head Rival selector */}
              <div className="relative flex-1 md:flex-initial">
                <select
                  value={rival?.id || ''}
                  onChange={(e) => {
                    const found = allParticipants.find((p) => p.id === e.target.value) || null;
                    setRival(found);
                    if (onSelectRival) onSelectRival(found);
                  }}
                  className="w-full glass-panel text-xs font-mono text-cyan-300 px-3 py-2 rounded-xl border border-cyan-500/40 focus:outline-none focus:border-cyan-400"
                >
                  <option value="" className="bg-[#050505] text-cyan-300">⚔️ Compare Rival...</option>
                  {allParticipants
                    .filter((p) => p.id !== participant.id)
                    .map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                        vs {p.name} ({p.department.split(' ')[0]})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Motto / Bio */}
          {participant.motto && (
            <div className="glass-panel rounded-xl p-3.5 text-xs text-slate-300 italic flex items-center gap-2">
              <span className="text-orange-400 font-bold font-mono">ATHLETE MOTTO:</span>
              <span>"{participant.motto}"</span>
            </div>
          )}

          {/* Telemetry Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="glass-panel p-3.5 rounded-xl border-orange-500/30">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Total Distance</div>
              <div className="text-xl font-black text-white mt-0.5">
                <span className="text-orange-400">{participant.totalDistanceKm}</span> <span className="text-xs text-slate-500 font-normal">KM</span>
              </div>
              {rival && (
                <div className="text-[10px] text-cyan-400 mt-0.5">vs {rival.name.split(' ')[0]}: {rival.totalDistanceKm} KM</div>
              )}
            </div>

            <div className="glass-panel p-3.5 rounded-xl border-cyan-500/30">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Total Points</div>
              <div className="text-xl font-black text-white mt-0.5">
                <span className="text-cyan-400">{participant.totalPoints}</span> <span className="text-xs text-slate-500 font-normal">PTS</span>
              </div>
              {rival && (
                <div className="text-[10px] text-cyan-400 mt-0.5">vs {rival.name.split(' ')[0]}: {rival.totalPoints} PTS</div>
              )}
            </div>

            <div className="glass-panel p-3.5 rounded-xl border-purple-500/30">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Longest Activity</div>
              <div className="text-xl font-black text-white mt-0.5">
                <span className="text-purple-400">{participant.longestSingleActivityKm}</span> <span className="text-xs text-slate-500 font-normal">KM</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Peak single workout</div>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border-emerald-500/30">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Consistency Streak</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {participant.streakMonths} <span className="text-xs text-slate-500 font-normal">MONTHS</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">≥80KM threshold met</div>
            </div>
          </div>

          {/* Interactive Progression Charts */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-xs font-black font-mono text-white uppercase tracking-wider f1-font">
                  TELEMETRY PERFORMANCE GRAPHS
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  Monthly progression across distance, points and ranking trajectory
                </p>
              </div>

              {/* Chart Switcher */}
              <div className="flex items-center gap-1 glass-panel p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setActiveChartTab('distance')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    activeChartTab === 'distance' ? 'bg-[#FF5722] text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Distance (KM)
                </button>
                <button
                  onClick={() => setActiveChartTab('points')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    activeChartTab === 'points' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Points (PTS)
                </button>
                <button
                  onClick={() => setActiveChartTab('rank')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    activeChartTab === 'rank' ? 'bg-purple-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rank Velocity
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === 'distance' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,87,34,0.4)', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: number) => [`${val} KM`, 'Distance']}
                    />
                    <Bar dataKey="distance" fill="#FF5722" name={participant.name} radius={[4, 4, 0, 0]} />
                    {rival && (
                      <Bar dataKey="rivalDistance" fill="#00E5FF" name={rival.name} radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                ) : activeChartTab === 'points' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="ptsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="rivalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(0,229,255,0.4)', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: number) => [`${val} PTS`, 'Points']}
                    />
                    <Area type="monotone" dataKey="points" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#ptsGrad)" name={participant.name} />
                    {rival && (
                      <Area type="monotone" dataKey="rivalPoints" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#rivalGrad)" name={rival.name} />
                    )}
                  </AreaChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} reversed domain={[1, 20]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(168,85,247,0.4)', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: number) => [`Rank #${val}`, 'Standing']}
                    />
                    <Line type="monotone" dataKey="rank" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} name={participant.name} />
                    {rival && (
                      <Line type="monotone" dataKey="rivalRank" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" name={rival.name} />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badges & Trophy Cabinet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black font-mono text-white uppercase tracking-wider f1-font">
                  ACHIEVEMENTS & BADGES ({participant.earnedBadges?.length || 0} UNLOCKED)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Most Active Month: <b className="text-orange-400">{mostActiveMonth}</b>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ALL_BADGES.map((badge) => {
                const isUnlocked = earnedBadgeSet.has(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl transition flex items-start gap-2.5 ${
                      isUnlocked
                        ? 'glass-panel-orange border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
                        : 'glass-panel opacity-40 grayscale'
                    }`}
                  >
                    <div className={`p-2 rounded-lg text-xs ${
                      isUnlocked ? 'glass-panel text-amber-300 border border-amber-400/40' : 'glass-panel text-slate-600'
                    }`}>
                      🏅
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{badge.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">{badge.requirement}</div>
                      {isUnlocked && (
                        <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1">✓ UNLOCKED</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="glass-panel rounded-2xl overflow-hidden font-mono text-xs">
            <div className="glass-panel px-4 py-2.5 font-bold text-slate-300 text-[11px] uppercase tracking-wider border-b border-white/10">
              Official Monthly Ledger
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 px-3">Month</th>
                    <th className="py-2 px-3 text-right">Distance</th>
                    <th className="py-2 px-3 text-right">80KM Bonus</th>
                    <th className="py-2 px-3 text-right">Event Bonus</th>
                    <th className="py-2 px-3 text-right">Total Points</th>
                    <th className="py-2 px-3 text-center">Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {MONTHS.map(({ key, label }) => {
                    const rec = participant.monthlyRecords[key];
                    if (!rec) return null;
                    return (
                      <tr key={key} className="hover:bg-white/5 transition">
                        <td className="py-2 px-3 font-medium text-white">{label}</td>
                        <td className="py-2 px-3 text-right text-orange-400 font-bold">{rec.distanceKm} KM</td>
                        <td className="py-2 px-3 text-right text-emerald-400">+{rec.bonus80Km}</td>
                        <td className="py-2 px-3 text-right text-cyan-400">+{rec.eventBonus}</td>
                        <td className="py-2 px-3 text-right text-white font-black">{rec.totalPoints} PTS</td>
                        <td className="py-2 px-3 text-center text-slate-300">#{rec.rank}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
