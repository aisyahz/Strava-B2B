import React, { useState, useEffect } from 'react';
import { Timer, Zap, Trophy, Flag, Sparkles, Download } from 'lucide-react';
import { SeasonConfig, Participant } from '../types';

interface CountdownWidgetProps {
  season?: SeasonConfig;
  totalCompanyDistanceKm?: number;
  participants?: Participant[];
  onOpenPoster?: () => void;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({
  season,
  totalCompanyDistanceKm,
  participants,
  onOpenPoster,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 123, hours: 14, minutes: 28, seconds: 45 });

  const targetDateStr = season?.prizeDate || '2026-12-15T18:00:00Z';

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const computedTotalDistance = totalCompanyDistanceKm !== undefined
    ? totalCompanyDistanceKm
    : (participants ? Math.round(participants.reduce((acc, p) => acc + (p.totalDistanceKm || 0), 0) * 10) / 10 : 0);

  const targetKm = season?.targetCompanyDistanceKm || 15000;
  const progressPercent = Math.min(100, Math.round((computedTotalDistance / targetKm) * 100));
  const activeMonthStr = season?.currentActiveMonth ? season.currentActiveMonth.toUpperCase() : 'AUG';

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Background neon ambient grid */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#FF5722]/10 via-[#00E5FF]/10 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Challenge Status & F1 Lights */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            {/* F1 5-light telemetry indicator */}
            <div className="flex items-center gap-1.5 glass-panel px-2.5 py-1 rounded-full border border-red-500/40">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-ping"></span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-400 tracking-wider uppercase f1-font">
              COUNTDOWN TO DEC 2026 GALA
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="f1-font">FINISH STRONG CHALLENGE</span>
            <span className="text-xs font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-lg glass-panel-blue">
              STAGE 3/6 ({activeMonthStr})
            </span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            Every kilometer brings your department closer to the podium. Monthly scores lock on the final calendar day at 23:59 PM.
          </p>

          {/* Company Target Progress */}
          <div className="pt-1">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-orange-400" />
                Company Mileage Target:
              </span>
              <span className="font-bold text-white">
                <span className="text-orange-400 font-black">{computedTotalDistance.toLocaleString()} KM</span> / {targetKm.toLocaleString()} KM ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5 glass-panel">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#00E5FF] shadow-[0_0_15px_rgba(255,87,34,0.8)] transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Big Neon Countdown Digit Blocks */}
        <div className="lg:col-span-7 flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-end gap-2.5 sm:gap-4">
          
          {/* Days */}
          <div className="flex-1 min-w-[70px] max-w-[110px] glass-panel-orange rounded-2xl p-3 text-center shadow-[0_0_25px_rgba(255,87,34,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5722] to-amber-400" />
            <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition f1-font">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mt-1">
              DAYS
            </div>
          </div>

          <span className="text-xl font-bold text-orange-500/50 hidden sm:inline">:</span>

          {/* Hours */}
          <div className="flex-1 min-w-[70px] max-w-[110px] glass-panel-blue rounded-2xl p-3 text-center shadow-[0_0_25px_rgba(0,229,255,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-blue-500" />
            <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition f1-font">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mt-1">
              HOURS
            </div>
          </div>

          <span className="text-xl font-bold text-cyan-500/50 hidden sm:inline">:</span>

          {/* Minutes */}
          <div className="flex-1 min-w-[70px] max-w-[110px] glass-panel-purple rounded-2xl p-3 text-center shadow-[0_0_25px_rgba(168,85,247,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition f1-font">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mt-1">
              MINS
            </div>
          </div>

          <span className="text-xl font-bold text-purple-500/50 hidden sm:inline">:</span>

          {/* Seconds */}
          <div className="flex-1 min-w-[70px] max-w-[110px] glass-panel-emerald rounded-2xl p-3 text-center shadow-[0_0_25px_rgba(16,185,129,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight group-hover:scale-105 transition f1-font">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mt-1">
              SECS
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
