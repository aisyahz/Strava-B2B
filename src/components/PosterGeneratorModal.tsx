import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  Crown, 
  Check, 
  Sparkles, 
  Share2,
  Gift
} from 'lucide-react';
import { Participant, SeasonConfig, ChallengeMonth, Gender } from '../types';
import { MONTHS, getCategoryRankings } from '../utils/calculations';
import { TOP_5_PRIZES, getPrizeForRank } from '../data/prizes';
import { soundFX } from '../utils/audio';

interface PosterGeneratorModalProps {
  participants: Participant[];
  season: SeasonConfig;
  onClose: () => void;
}

export const PosterGeneratorModal: React.FC<PosterGeneratorModalProps> = ({
  participants,
  season,
  onClose,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<ChallengeMonth | 'overall'>('overall');
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'Female' | 'Male'>('ALL');
  const [posterTheme, setPosterTheme] = useState<'f1-dark' | 'strava-orange' | 'cyber-neon'>('f1-dark');
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // Compute standings based on month and gender
  const rankedParticipants = selectedGender === 'ALL'
    ? [...participants]
        .filter((p) => p.active)
        .sort((a, b) => {
          if (selectedMonth === 'overall') {
            return b.totalPoints - a.totalPoints || b.totalDistanceKm - a.totalDistanceKm;
          }
          const aRec = a.monthlyRecords[selectedMonth]?.totalPoints || 0;
          const bRec = b.monthlyRecords[selectedMonth]?.totalPoints || 0;
          return bRec - aRec || (b.monthlyRecords[selectedMonth]?.distanceKm || 0) - (a.monthlyRecords[selectedMonth]?.distanceKm || 0);
        })
        .map((p, idx) => ({ ...p, displayRank: idx + 1 }))
    : getCategoryRankings(participants, selectedGender, selectedMonth).map((p) => ({
        ...p,
        displayRank: p.categoryRank,
      }));

  const top10 = rankedParticipants.slice(0, 10);
  const p1 = top10[0];
  const totalCompanyDist = Math.round(participants.reduce((acc, p) => acc + p.totalDistanceKm, 0) * 10) / 10;
  const totalCompanyPts = Math.round(participants.reduce((acc, p) => acc + p.totalPoints, 0) * 10) / 10;

  const handlePrint = () => {
    soundFX.playRaceBeep();
    window.print();
  };

  const handleShareLink = () => {
    soundFX.playKudos();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Theme styles
  let themeBg = 'bg-[#0a0f1d] text-white border-orange-500/40';
  let accentColor = 'text-orange-400';
  let badgeBg = 'bg-orange-500 text-black';

  if (posterTheme === 'strava-orange') {
    themeBg = 'bg-[#180e07] text-white border-orange-500';
    accentColor = 'text-orange-500';
    badgeBg = 'bg-gradient-to-r from-orange-500 to-amber-500 text-black';
  } else if (posterTheme === 'cyber-neon') {
    themeBg = 'bg-[#07131e] text-white border-cyan-400';
    accentColor = 'text-cyan-400';
    badgeBg = 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-4xl glass-panel-orange border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Controls Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 glass-panel flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider f1-font">
              OFFICIAL LEADERBOARD POSTER EXPORT
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Switcher */}
            <div className="flex items-center gap-1 glass-panel p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setSelectedGender('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  selectedGender === 'ALL' ? 'bg-[#FF5722] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setSelectedGender('Female')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  selectedGender === 'Female' ? 'bg-pink-500 text-white' : 'text-pink-300/70 hover:text-pink-200'
                }`}
              >
                👩 Women
              </button>
              <button
                onClick={() => setSelectedGender('Male')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  selectedGender === 'Male' ? 'bg-blue-500 text-black' : 'text-blue-300/70 hover:text-blue-200'
                }`}
              >
                👨 Men
              </button>
            </div>

            {/* Theme Picker */}
            <div className="flex items-center gap-1 glass-panel p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setPosterTheme('f1-dark')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  posterTheme === 'f1-dark' ? 'bg-[#FF5722] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                F1 Dark
              </button>
              <button
                onClick={() => setPosterTheme('strava-orange')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  posterTheme === 'strava-orange' ? 'bg-[#FF5722] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Strava
              </button>
              <button
                onClick={() => setPosterTheme('cyber-neon')}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition ${
                  posterTheme === 'cyber-neon' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cyber
              </button>
            </div>

            {/* Print / Save */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#FF5722] hover:bg-[#ff7043] text-black font-mono font-black text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(255,87,34,0.4)]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </button>

            <button
              onClick={handleShareLink}
              className="flex items-center gap-1.5 glass-panel hover:bg-white/10 text-white font-mono text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass-panel text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Printable Preview Canvas */}
        <div className="p-6 max-h-[75vh] overflow-y-auto bg-black/40 flex justify-center">
          
          <div
            ref={posterRef}
            className={`w-full max-w-2xl rounded-3xl p-8 border shadow-2xl relative overflow-hidden font-mono space-y-6 glass-panel-orange backdrop-blur-2xl ${
              posterTheme === 'cyber-neon' ? 'border-cyan-400/50' : 'border-orange-500/50'
            }`}
          >
            {/* Poster Header */}
            <div className="text-center space-y-2 border-b border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest glass-panel border-white/20 text-orange-400">
                <span>🏃 B2B COMMERCE STRAVA GP 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase f1-font text-white">
                {selectedGender === 'Female' ? "WOMEN'S DIVISION BULLETIN" : selectedGender === 'Male' ? "MEN'S DIVISION BULLETIN" : 'OFFICIAL LEADERBOARD BULLETIN'}
              </h1>
              <p className="text-xs text-slate-400">
                SEASON 2026 • {selectedGender === 'Female' ? "WOMEN'S CATEGORY" : selectedGender === 'Male' ? "MEN'S CATEGORY" : 'OVERALL'} • STAGE: {selectedMonth === 'overall' ? 'OVERALL STANDINGS' : `${selectedMonth.toUpperCase()} SPRINT`} • TOP 5 PRIZE TIERS
              </p>
            </div>

            {/* Champion Apex Spotlight Banner */}
            {p1 && (
              <div className="bg-gradient-to-r from-amber-500/20 via-black/60 to-amber-500/20 border border-amber-400/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={p1.avatarUrl} alt={p1.name} className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400" />
                    <div className="absolute -top-2 -left-2 bg-amber-400 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-amber-400 uppercase">★ {selectedGender === 'Female' ? "WOMEN'S" : selectedGender === 'Male' ? "MEN'S" : 'GRAND PRIX'} #1 APEX ★</div>
                    <div className="text-base font-black text-white f1-font">{p1.name}</div>
                    <div className="text-xs text-slate-400">{p1.department} • 🎁 Garmin 965 + Trophy</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-amber-300">
                    {selectedMonth === 'overall' ? p1.totalPoints : p1.monthlyRecords[selectedMonth]?.totalPoints} PTS
                  </div>
                  <div className="text-xs text-orange-400 font-bold">
                    {selectedMonth === 'overall' ? p1.totalDistanceKm : p1.monthlyRecords[selectedMonth]?.distanceKm} KM
                  </div>
                </div>
              </div>
            )}

            {/* Top 10 Table */}
            <div className="glass-panel rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase glass-panel">
                    <th className="py-2.5 px-3 text-center w-12">POS</th>
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Division</th>
                    <th className="py-2.5 px-3">Prize Status</th>
                    <th className="py-2.5 px-3 text-right">Distance</th>
                    <th className="py-2.5 px-3 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {top10.map((p, idx) => {
                    const dist = selectedMonth === 'overall' ? p.totalDistanceKm : p.monthlyRecords[selectedMonth]?.distanceKm || 0;
                    const pts = selectedMonth === 'overall' ? p.totalPoints : p.monthlyRecords[selectedMonth]?.totalPoints || 0;
                    const rankNum = p.displayRank || (idx + 1);
                    const prize = getPrizeForRank(rankNum);

                    return (
                      <tr key={p.id} className={rankNum <= 3 ? 'bg-white/[0.04] font-bold' : 'hover:bg-white/5'}>
                        <td className="py-2 px-3 text-center">
                          <span className={`inline-block w-5 h-5 rounded text-center leading-5 text-[10px] font-black ${
                            rankNum === 1 ? 'bg-amber-400 text-black' : rankNum === 2 ? 'bg-slate-300 text-black' : rankNum === 3 ? 'bg-amber-700 text-white' : 'text-slate-400'
                          }`}>
                            {rankNum}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-white truncate max-w-[130px]">
                          <div className="flex items-center gap-1.5">
                            <span>{p.name}</span>
                            <span className="text-[9px] opacity-70">{p.gender === 'Female' ? '👩' : '👨'}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[11px] truncate max-w-[110px]">{p.department.split(' ')[0]}</td>
                        <td className="py-2 px-3 text-[10px] text-amber-300 truncate max-w-[130px]">
                          {prize ? `${prize.trophyIcon} ${prize.reward}` : '—'}
                        </td>
                        <td className="py-2 px-3 text-right text-orange-400">{dist} KM</td>
                        <td className="py-2 px-3 text-right text-white font-black">{pts} PTS</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Poster Footer Banner */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <div>
                Company Cumulative: <b className="text-white">{totalCompanyDist.toLocaleString()} KM</b> ({totalCompanyPts.toLocaleString()} PTS)
              </div>
              <div className="text-right">
                Next Lockout: <b>Monthly End 23:59 PM</b>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
