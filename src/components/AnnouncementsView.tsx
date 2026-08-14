import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  Flame, 
  Trophy, 
  Calendar, 
  Zap, 
  Heart, 
  Plus, 
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Announcement } from '../types';
import { soundFX } from '../utils/audio';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  isAdmin: boolean;
  onAddAnnouncement: (ann: Announcement) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  isAdmin,
  onAddAnnouncement,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Bonus' | 'Winner' | 'Event' | 'General'>('Bonus');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('high');
  const [content, setContent] = useState('');
  const [pointsMultiplier, setPointsMultiplier] = useState('2');

  const handleLike = (id: string) => {
    soundFX.playKudos();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#fc5200', '#00f0ff', '#fbbf24'],
    });
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      date: new Date().toISOString().split('T')[0],
      author: 'Race Committee',
      category,
      priority,
      content,
      pointsMultiplier: category === 'Bonus' ? parseFloat(pointsMultiplier) : undefined,
      likesCount: 0,
    };

    onAddAnnouncement(newAnn);
    soundFX.playRankUp();
    setShowCreateModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
              OFFICIAL RACE BULLETINS & ANNOUNCEMENTS
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Live updates on double points weekends, monthly winner coronations, and corporate fun runs.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#ff7043] text-black font-black font-mono text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,87,34,0.4)] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>POST NEW ANNOUNCEMENT</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4 font-mono">
        {announcements.map((ann) => {
          let badgeBorder = 'border-slate-700 glass-panel text-slate-300';
          if (ann.priority === 'urgent') badgeBorder = 'border-red-500/50 glass-panel text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
          else if (ann.priority === 'high') badgeBorder = 'border-orange-500/50 glass-panel-orange text-orange-400';
          else if (ann.category === 'Bonus') badgeBorder = 'border-cyan-500/50 glass-panel-blue text-cyan-300';

          const currentLikes = (ann.likesCount || 0) + (likesMap[ann.id] || 0);

          return (
            <div
              key={ann.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${badgeBorder}`}>
                    {ann.category} • {ann.priority}
                  </span>
                  {ann.pointsMultiplier && (
                    <span className="text-[10px] font-black bg-amber-400 text-black px-2 py-0.5 rounded-lg shadow-sm">
                      {ann.pointsMultiplier}X MULTIPLIER
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.date}</span>
                  <span>•</span>
                  <span>By {ann.author}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-white f1-font">{ann.title}</h3>
                <p className="text-xs sm:text-sm text-slate-200 font-sans mt-2 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleLike(ann.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-400 glass-panel-orange hover:bg-orange-500/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-orange-400" />
                  <span>Cheer / Like ({currentLikes})</span>
                </button>

                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Notice</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-orange rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-base font-black text-white uppercase tracking-tight f1-font">
              PUBLISH RACE ANNOUNCEMENT
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ⚡ August Sprint Double Points Weekend"
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  >
                    <option value="Bonus" className="bg-[#050505] text-white">Bonus Points Event</option>
                    <option value="Winner" className="bg-[#050505] text-white">Winner Spotlight</option>
                    <option value="Event" className="bg-[#050505] text-white">Company Event</option>
                    <option value="General" className="bg-[#050505] text-white">General News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  >
                    <option value="normal" className="bg-[#050505] text-white">Normal</option>
                    <option value="high" className="bg-[#050505] text-white">High</option>
                    <option value="urgent" className="bg-[#050505] text-white">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Bulletin Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Write clear instructions for all employees..."
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 text-xs font-sans"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#ff7043] text-black font-black cursor-pointer"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
