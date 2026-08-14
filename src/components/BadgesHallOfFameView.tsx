import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Flame, 
  Zap, 
  TrendingUp, 
  Mountain, 
  Trophy, 
  Sparkles, 
  Footprints, 
  Sunrise, 
  Bike, 
  Target, 
  Gauge, 
  ShieldCheck, 
  ShieldAlert, 
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Participant, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { findHallOfFame } from '../utils/calculations';
import { soundFX } from '../utils/audio';

interface BadgesHallOfFameViewProps {
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
}

export const BadgesHallOfFameView: React.FC<BadgesHallOfFameViewProps> = ({
  participants,
  onSelectParticipant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'distance' | 'consistency' | 'special' | 'event'>('all');
  const [activeBadgeModal, setActiveBadgeModal] = useState<Badge | null>(null);

  const hallOfFame = findHallOfFame(participants);

  const filteredBadges = ALL_BADGES.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Hall of Fame Apex Legends Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
              HALL OF FAME APEX RECORDS
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              All-time corporate benchmarks and individual milestone holders
            </p>
          </div>
        </div>

        {hallOfFame && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            
            {/* Longest Distance */}
            {hallOfFame.longestDist && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.longestDist);
                }}
                className="glass-panel-orange glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-orange-400 font-bold mb-3">
                  <span>🏃 LONGEST TOTAL DISTANCE</span>
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.longestDist.avatarUrl}
                    alt={hallOfFame.longestDist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-orange-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-orange-400 transition">{hallOfFame.longestDist.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.longestDist.department}</div>
                    <div className="text-xs font-black text-orange-400 mt-1">{hallOfFame.longestDist.totalDistanceKm} KM Logged</div>
                  </div>
                </div>
              </div>
            )}

            {/* Highest Total Points */}
            {hallOfFame.highestPts && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.highestPts);
                }}
                className="glass-panel-blue glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-3">
                  <span>⚡ HIGHEST TOTAL POINTS</span>
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.highestPts.avatarUrl}
                    alt={hallOfFame.highestPts.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-cyan-300 transition">{hallOfFame.highestPts.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.highestPts.department}</div>
                    <div className="text-xs font-black text-cyan-400 mt-1">{hallOfFame.highestPts.totalPoints} Points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Longest Single Activity */}
            {hallOfFame.longestSingle && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.longestSingle);
                }}
                className="glass-panel-purple glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-3">
                  <span>🏔️ PEAK SINGLE ACTIVITY</span>
                  <Gauge className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.longestSingle.avatarUrl}
                    alt={hallOfFame.longestSingle.name}
                    className="w-12 h-12 rounded-xl object-cover border border-purple-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-purple-300 transition">{hallOfFame.longestSingle.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.longestSingle.department}</div>
                    <div className="text-xs font-black text-purple-400 mt-1">{hallOfFame.longestSingle.longestSingleActivityKm} KM Single Workout</div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Male Champion */}
            {hallOfFame.topMale && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.topMale);
                }}
                className="glass-panel-blue glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-3">
                  <span>👑 APEX MALE RUNNER</span>
                  <span className="text-[10px] glass-panel text-blue-300 px-2 py-0.5 rounded-lg border border-blue-500/30">MALE LEADER</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.topMale.avatarUrl}
                    alt={hallOfFame.topMale.name}
                    className="w-12 h-12 rounded-xl object-cover border border-blue-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-blue-300 transition">{hallOfFame.topMale.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.topMale.department}</div>
                    <div className="text-xs font-black text-blue-400 mt-1">{hallOfFame.topMale.totalPoints} PTS ({hallOfFame.topMale.totalDistanceKm} KM)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Female Champion */}
            {hallOfFame.topFemale && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.topFemale);
                }}
                className="glass-panel-purple glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-pink-400 font-bold mb-3">
                  <span>👑 APEX FEMALE RUNNER</span>
                  <span className="text-[10px] glass-panel text-pink-300 px-2 py-0.5 rounded-lg border border-pink-500/30">FEMALE LEADER</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.topFemale.avatarUrl}
                    alt={hallOfFame.topFemale.name}
                    className="w-12 h-12 rounded-xl object-cover border border-pink-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-pink-300 transition">{hallOfFame.topFemale.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.topFemale.department}</div>
                    <div className="text-xs font-black text-pink-400 mt-1">{hallOfFame.topFemale.totalPoints} PTS ({hallOfFame.topFemale.totalDistanceKm} KM)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Most Improved Velocity */}
            {hallOfFame.mostImproved && (
              <div 
                onClick={() => {
                  soundFX.playRaceBeep();
                  onSelectParticipant(hallOfFame.mostImproved);
                }}
                className="glass-panel-emerald glass-panel-hover p-4 rounded-2xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-3">
                  <span>🚀 HIGHEST RANK VELOCITY</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={hallOfFame.mostImproved.avatarUrl}
                    alt={hallOfFame.mostImproved.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-400 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-white text-sm truncate group-hover:text-emerald-300 transition">{hallOfFame.mostImproved.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hallOfFame.mostImproved.department}</div>
                    <div className="text-xs font-black text-emerald-400 mt-1">Accelerated +{hallOfFame.maxJump || 3} Spots</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 2. Badges Showcase & Achievement Cabinet */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight f1-font">
                OFFICIAL ACHIEVEMENTS CABINET ({ALL_BADGES.length} BADGES)
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Badges unlock automatically when athletes satisfy official Strava thresholds
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 glass-panel p-1 rounded-2xl text-xs font-mono">
            {(['all', 'distance', 'consistency', 'special', 'event'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition ${
                  selectedCategory === cat ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            // Count how many participants unlocked this badge
            const unlockers = participants.filter((p) => p.earnedBadges?.includes(badge.id));

            let rarityColor = 'border-slate-700 text-slate-400 glass-panel';
            if (badge.rarity === 'Legendary') rarityColor = 'border-amber-400 text-amber-300 glass-panel-orange shadow-[0_0_15px_rgba(251,191,36,0.2)]';
            else if (badge.rarity === 'Epic') rarityColor = 'border-purple-500 text-purple-300 glass-panel-purple';
            else if (badge.rarity === 'Rare') rarityColor = 'border-cyan-500 text-cyan-300 glass-panel-blue';

            return (
              <div
                key={badge.id}
                onClick={() => setActiveBadgeModal(badge)}
                className="glass-panel glass-panel-hover rounded-2xl p-4 transition shadow-lg cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                      🏅
                    </div>
                    <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-lg border ${rarityColor}`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition">{badge.name}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[11px]">
                  <div className="text-slate-400 text-[10px]">Criteria: <span className="text-slate-300">{badge.requirement}</span></div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center -space-x-1.5 overflow-hidden">
                      {unlockers.slice(0, 4).map((p) => (
                        <img
                          key={p.id}
                          src={p.avatarUrl}
                          alt={p.name}
                          className="inline-block h-5 w-5 rounded-full ring-1 ring-slate-900 object-cover"
                          title={p.name}
                        />
                      ))}
                    </div>
                    <span className="text-orange-400 font-bold">{unlockers.length} Athletes Unlocked</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Modal */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-orange rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center relative">
            <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-3xl mx-auto shadow-lg">
              🏅
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">{activeBadgeModal.rarity} BADGE</span>
              <h3 className="text-xl font-black text-white mt-1 f1-font">{activeBadgeModal.name}</h3>
              <p className="text-xs text-slate-200 mt-2">{activeBadgeModal.description}</p>
            </div>

            <div className="glass-panel p-3 rounded-xl font-mono text-xs text-left">
              <span className="text-slate-400 uppercase text-[10px]">Threshold Requirement:</span>
              <div className="text-white font-bold mt-0.5">{activeBadgeModal.requirement}</div>
            </div>

            <div className="text-left font-mono text-xs">
              <div className="text-slate-400 uppercase text-[10px] mb-2">Athletes with this badge:</div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {participants
                  .filter((p) => p.earnedBadges?.includes(activeBadgeModal.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveBadgeModal(null);
                        onSelectParticipant(p);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl glass-panel glass-panel-hover cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{p.department.split(' ')[0]}</span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setActiveBadgeModal(null)}
              className="w-full glass-panel hover:bg-white/10 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
