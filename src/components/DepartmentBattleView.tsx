import React from 'react';
import { 
  Users, 
  Trophy, 
  Flame, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Percent, 
  Crown,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Participant, Department } from '../types';
import { computeDepartmentStats } from '../utils/calculations';
import { soundFX } from '../utils/audio';

interface DepartmentBattleViewProps {
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
}

export const DepartmentBattleView: React.FC<DepartmentBattleViewProps> = ({
  participants,
  onSelectParticipant,
}) => {
  const deptStats = computeDepartmentStats(participants);

  // Prepare chart data
  const chartData = deptStats.map((d) => ({
    name: d.department.split(' ')[0], // short name
    fullName: d.department,
    points: d.totalPoints,
    distance: d.totalDistanceKm,
    avgPoints: d.avgPoints,
    avgDistance: d.avgDistanceKm,
    activeRate: d.activeRatePercent,
  }));

  const topDept = deptStats[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner */}
      <div className="glass-panel-purple rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
                DEPARTMENT INTER-DIVISION BATTLE
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Cross-functional bragging rights. Total points, per-capita averages, and athlete participation rates.
            </p>
          </div>

          {topDept && (
            <div className="glass-panel rounded-xl px-4 py-2.5 flex items-center gap-3 border-purple-500/40">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div className="font-mono text-xs">
                <div className="text-slate-400 uppercase text-[10px]">Division Leader</div>
                <div className="font-black text-purple-300">{topDept.department}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Total Points & Distance by Department */}
        <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs font-black font-mono text-white uppercase tracking-wider f1-font">
              TOTAL POINTS BY DIVISION
            </h4>
            <span className="text-[10px] font-mono text-purple-400 font-bold">GROSS AGGREGATE</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(139,92,246,0.4)', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: number) => [`${val} PTS`, 'Total Points']}
                />
                <Bar dataKey="points" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total Points" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per Capita Average Distance per Employee */}
        <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs font-black font-mono text-white uppercase tracking-wider f1-font">
              PER CAPITA AVERAGE MILEAGE (KM/ATHLETE)
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">FAIR SCALE RATIO</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(0,229,255,0.4)', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: number) => [`${val} KM / athlete`, 'Avg Distance']}
                />
                <Bar dataKey="avgDistance" fill="#00E5FF" radius={[4, 4, 0, 0]} name="Avg Distance (KM)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Detailed Department Ranking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {deptStats.map((dept, index) => {
          const topRunnerObj = participants.find((p) => p.name === dept.topRunnerName);

          return (
            <div
              key={dept.department}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
                dept.rank === 1
                  ? 'glass-panel-orange border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'glass-panel glass-panel-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      dept.rank === 1 ? 'bg-amber-400 text-black shadow-sm' : 'glass-panel text-slate-300'
                    }`}>
                      #{dept.rank}
                    </span>
                    <h3 className="font-black text-sm text-white">{dept.department}</h3>
                  </div>
                  {dept.rank === 1 && (
                    <span className="text-[10px] font-bold text-amber-300 glass-panel px-2 py-0.5 rounded-lg border border-amber-400/40">
                      LEAD
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="glass-panel p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Total Points</div>
                    <div className="text-base font-black text-purple-400 mt-0.5">{dept.totalPoints} PTS</div>
                  </div>
                  <div className="glass-panel p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Total Distance</div>
                    <div className="text-base font-black text-orange-400 mt-0.5">{dept.totalDistanceKm} KM</div>
                  </div>
                  <div className="glass-panel p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Avg / Athlete</div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5">{dept.avgDistanceKm} KM</div>
                  </div>
                  <div className="glass-panel p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Participation</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">{dept.activeRatePercent}% Active</div>
                  </div>
                </div>
              </div>

              {/* Department MVP Athlete */}
              {dept.topRunnerName !== '-' && (
                <div
                  onClick={() => {
                    if (topRunnerObj) {
                      soundFX.playRaceBeep();
                      onSelectParticipant(topRunnerObj);
                    }
                  }}
                  className="glass-panel glass-panel-hover p-3 rounded-xl cursor-pointer transition flex items-center justify-between mt-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={dept.topRunnerAvatar}
                      alt={dept.topRunnerName}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 uppercase">Division Champion</div>
                      <div className="text-xs font-bold text-white truncate">{dept.topRunnerName}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
