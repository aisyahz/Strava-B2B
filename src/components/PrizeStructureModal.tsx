import React from 'react';
import { Trophy, Award, Gift, Sparkles, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TOP_5_PRIZES } from '../data/prizes';
import { soundFX } from '../utils/audio';

interface PrizeStructureModalProps {
  onClose: () => void;
}

export const PrizeStructureModal: React.FC<PrizeStructureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel-orange border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight f1-font">
                OFFICIAL 2026 PRIZE POOL STRUCTURE
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Separate Women's & Men's Divisions • Prizes awarded up to 5th Place
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playRaceBeep();
              onClose();
            }}
            className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-mono text-xs">
          
          {/* Announcement Banner */}
          <div className="glass-panel-blue p-4 rounded-2xl border border-cyan-400/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-black text-white uppercase text-xs">
                Equal Prize Pool for Both Women's & Men's Categories!
              </div>
              <p className="text-[11px] text-slate-300">
                In Season 2026, female and male athletes compete in dedicated category leaderboards. Both divisions offer identical prestige trophies, performance gear grants, and prize packages down to the <b>5th position</b>!
              </p>
            </div>
          </div>

          {/* 1st to 5th Prize Cards */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Category Podiums & Placements (Positions 1st — 5th)</span>
            </div>

            {TOP_5_PRIZES.map((prize) => (
              <div
                key={prize.place}
                className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-2xl sm:text-3xl select-none">
                    {prize.trophyIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{prize.title}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${prize.badgeBg}`}>
                        TOP {prize.place}
                      </span>
                    </div>
                    <div className="text-slate-300 font-sans text-xs mt-0.5">
                      {prize.reward}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Badge: <span className="text-cyan-300">{prize.badgeName}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <div className="text-amber-400 font-black text-xs sm:text-sm">
                    {prize.cashEquivalent}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center sm:justify-end gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Women & Men Divisions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rules Summary */}
          <div className="glass-panel p-4 rounded-2xl space-y-2 border border-white/10 text-[11px] text-slate-300">
            <div className="font-bold text-white uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Qualification & Verification Rules</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Points are calculated via distance (1 KM = 1 Point) + Monthly 80KM bonus (+50 pts) + verified event bonuses.</li>
              <li>Ties are resolved first by total accumulated distance (KM), then by longest single verified activity.</li>
              <li>Prize presentations and official trophy handovers take place at the Grand Finale on <b>December 15, 2026</b>.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 glass-panel flex justify-end">
          <button
            onClick={() => {
              soundFX.playRaceBeep();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#ff7043] text-black font-mono font-black text-xs cursor-pointer transition shadow-lg"
          >
            Close Prize Overview
          </button>
        </div>

      </div>
    </div>
  );
};
