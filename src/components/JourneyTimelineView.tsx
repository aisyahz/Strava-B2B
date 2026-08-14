import React from 'react';
import { 
  Compass, 
  Flag, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Sparkles, 
  Trophy, 
  Mountain, 
  Award,
  Zap
} from 'lucide-react';
import { SeasonConfig } from '../types';

interface JourneyTimelineViewProps {
  season: SeasonConfig;
}

interface Milestone {
  month: string;
  stageName: string;
  theme: string;
  subtitle: string;
  targetFocus: string;
  status: 'completed' | 'active' | 'upcoming';
  stageNumber: number;
  highlightIcon: string;
  perks: string[];
}

export const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ season }) => {
  const milestones: Milestone[] = [
    {
      month: 'JUNE 2026',
      stageName: 'Stage 1: Grand Prix Kickoff',
      theme: 'Base Mileage & Habit Building',
      subtitle: 'Ignition phase. Establish weekly Strava logging routines and test team dynamics.',
      targetFocus: 'Company Goal: 2,500 KM • 100KM Fast Starter Badge Open',
      status: 'completed',
      stageNumber: 1,
      highlightIcon: '🚀',
      perks: ['Kickoff Bonus Points Active', 'First 50 logged athletes earn Fast Starter badge'],
    },
    {
      month: 'JULY 2026',
      stageName: 'Stage 2: Cadence & Momentum',
      theme: 'Weekend Century Rides & Mid-Season Long Runs',
      subtitle: 'Accelerate pace. Department rivalries ignite as the 80KM threshold kicks in.',
      targetFocus: 'Company Goal: 3,000 KM • 80KM +50 PTS Bonus Qualification',
      status: 'completed',
      stageNumber: 2,
      highlightIcon: '⚡',
      perks: ['Double Points Weekend #1', 'Weekend Warrior badges unlocked'],
    },
    {
      month: 'AUGUST 2026',
      stageName: 'Stage 3: Push Harder (Peak Summer)',
      theme: 'Elevation & Mountain Ridge Challenges',
      subtitle: 'Current Active Stage! Athletes push vertical climbs and half-marathon distances.',
      targetFocus: 'Company Goal: 3,200 KM • Mountain Climber & Consistency Kings',
      status: 'active',
      stageNumber: 3,
      highlightIcon: '🏔️',
      perks: ['Double Points Sprint Weekend (Aug 22-23)', '3-Month Consistency King unlock window'],
    },
    {
      month: 'SEPTEMBER 2026',
      stageName: 'Stage 4: Corporate Charity 10K',
      theme: 'Stay Consistent & Charity Community Run',
      subtitle: 'Official company-wide 10K event at Marina Park. Direct attendance bonus.',
      targetFocus: 'Company Goal: 3,000 KM • +25 Official Event Bonus Points',
      status: 'upcoming',
      stageNumber: 4,
      highlightIcon: '🎯',
      perks: ['Official 10K Fun Run Attendance Bonus', 'Event Hunter Badge unlock'],
    },
    {
      month: 'OCTOBER 2026',
      stageName: 'Stage 5: Final Sprint',
      theme: 'Top 5 Apex Clashes & Department Battles',
      subtitle: 'The penultimate month where podium positions are fiercely contested.',
      targetFocus: 'Company Goal: 3,300 KM • Podium Decider Phase',
      status: 'upcoming',
      stageNumber: 5,
      highlightIcon: '🔥',
      perks: ['Division Double Multiplier for trailing teams', 'Top 5 Apex badges awarded'],
    },
    {
      month: 'NOVEMBER 2026',
      stageName: 'Stage 6: Grand Finale & Finish Strong',
      theme: 'Final Kilometer Push to the Finish Line',
      subtitle: 'Last chance to log mileage. Standings lock on November 30 at 23:59 PM sharp.',
      targetFocus: 'Company Goal: 3,500 KM • Final Ledger Lockout',
      status: 'upcoming',
      stageNumber: 6,
      highlightIcon: '🏁',
      perks: ['1000KM Club Grand Master crowns', 'Final Monthly Champions crowned'],
    },
    {
      month: 'DECEMBER 2026',
      stageName: 'The Victory Gala',
      theme: 'Annual Awards Ceremony & Trophy Presentation',
      subtitle: 'Celebration night honoring individual champions, top departments, and medalists.',
      targetFocus: 'December 15, 2026 • Grand Ballroom Trophy Presentation',
      status: 'upcoming',
      stageNumber: 7,
      highlightIcon: '🏆',
      perks: ['Physical custom crystal F1-style trophies', 'Fitness gear vouchers & grand prizes'],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel-blue rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
            2026 CHALLENGE ROADMAP & MILESTONES
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
          Six distinct athletic stages leading up to the December 2026 Trophy Gala. Track company-wide targets and upcoming bonus opportunities.
        </p>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-[#FF5722] before:to-slate-700">
        
        {milestones.map((m) => {
          const isCompleted = m.status === 'completed';
          const isActive = m.status === 'active';

          return (
            <div key={m.month} className="relative group">
              
              {/* Node Icon on Spine */}
              <div className={`absolute -left-6 sm:-left-10 top-2 w-7 sm:w-10 h-7 sm:h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-lg transition z-10 ${
                isCompleted
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : isActive
                  ? 'bg-[#FF5722] text-black border-orange-400 shadow-[0_0_20px_rgba(255,87,34,0.8)] animate-pulse'
                  : 'glass-panel text-slate-500 border-slate-700'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isActive ? <Flame className="w-4 h-4 animate-bounce" /> : <Lock className="w-3.5 h-3.5" />}
              </div>

              {/* Stage Card */}
              <div className={`rounded-2xl p-5 sm:p-6 transition shadow-xl ${
                isActive
                  ? 'glass-panel-orange border-orange-500/50 shadow-[0_0_30px_rgba(255,87,34,0.2)] ring-1 ring-orange-500/20'
                  : isCompleted
                  ? 'glass-panel-emerald opacity-95'
                  : 'glass-panel opacity-70'
              }`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.highlightIcon}</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">{m.month}</span>
                      <h3 className="text-base sm:text-lg font-black text-white f1-font">{m.stageName}</h3>
                    </div>
                  </div>

                  <span className={`w-max text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${
                    isCompleted
                      ? 'glass-panel-emerald text-emerald-300 border-emerald-500/40'
                      : isActive
                      ? 'bg-[#FF5722] text-black border-orange-400 font-bold shadow-md'
                      : 'glass-panel text-slate-400 border-slate-700'
                  }`}>
                    {isCompleted ? '✓ COMPLETED' : isActive ? '⚡ CURRENT STAGE' : '🔒 LOCKED'}
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-medium">{m.theme}</div>
                <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">{m.subtitle}</p>

                {/* Target & Perks Banner */}
                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="glass-panel p-2.5 rounded-xl">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold">Stage Target:</span>
                    <div className="text-white mt-0.5">{m.targetFocus}</div>
                  </div>
                  <div className="glass-panel p-2.5 rounded-xl space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase font-bold">Key Milestones & Perks:</span>
                    {m.perks.map((p, idx) => (
                      <div key={idx} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                        <span className="text-orange-400">▸</span> {p}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
