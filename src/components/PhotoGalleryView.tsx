import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Heart, 
  MapPin, 
  Plus, 
  Flame, 
  Camera, 
  Calendar, 
  Share2, 
  Check, 
  Tag, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoPost, Participant } from '../types';
import { soundFX } from '../utils/audio';

interface PhotoGalleryViewProps {
  photos: PhotoPost[];
  participants: Participant[];
  onAddPhoto: (newPhoto: PhotoPost) => void;
  onLikePhoto: (id: string) => void;
  onSelectParticipant: (participant: Participant) => void;
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({
  photos,
  participants,
  onAddPhoto,
  onLikePhoto,
  onSelectParticipant,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Running' | 'Cycling' | 'Hiking' | 'Marathon' | 'Office Event'>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State for uploading
  const [selectedParticipantId, setSelectedParticipantId] = useState(participants[0]?.id || '');
  const [activityType, setActivityType] = useState<'Running' | 'Cycling' | 'Hiking' | 'Marathon' | 'Office Event'>('Running');
  const [distanceKm, setDistanceKm] = useState('12.5');
  const [location, setLocation] = useState('Central Park Loop');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80');

  const filteredPhotos = photos.filter((p) => {
    if (selectedFilter === 'All') return true;
    return p.activityType === selectedFilter;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playKudos();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#fc5200', '#ff7a00', '#fbbf24'],
    });
    onLikePhoto(id);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const athlete = participants.find((p) => p.id === selectedParticipantId);
    if (!athlete) return;

    const newPost: PhotoPost = {
      id: `photo-${Date.now()}`,
      participantId: athlete.id,
      participantName: athlete.name,
      participantAvatar: athlete.avatarUrl,
      department: athlete.department,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
      caption: caption || 'Crushed morning workout for company points! 🏃🔥',
      activityType,
      distanceKm: parseFloat(distanceKm) || 10,
      location: location || 'Corporate Trails',
      date: new Date().toISOString().split('T')[0],
      likes: 1,
      likedByMe: true,
    };

    onAddPhoto(newPost);
    soundFX.playRankUp();
    setShowUploadModal(false);
    setCaption('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header with Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
              COMMUNITY STRAVA PHOTO FEED
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Running sunrises, cycling mountain summits, marathon medals, and office running club moments.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#ff7043] text-black font-black font-mono text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,87,34,0.4)] transition cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>SHARE STRAVA PHOTO</span>
        </button>
      </div>

      {/* 2. Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto glass-panel p-1.5 rounded-2xl text-xs font-mono">
        {(['All', 'Running', 'Cycling', 'Hiking', 'Marathon', 'Office Event'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              selectedFilter === filter
                ? 'bg-[#FF5722] text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Instagram-Style Feed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => {
          const athleteObj = participants.find((p) => p.id === photo.participantId);

          return (
            <div
              key={photo.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between group"
            >
              {/* Top User Bar */}
              <div className="p-3.5 flex items-center justify-between border-b border-white/5">
                <div
                  onClick={() => athleteObj && onSelectParticipant(athleteObj)}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <img
                    src={photo.participantAvatar}
                    alt={photo.participantName}
                    className="w-9 h-9 rounded-full object-cover border border-orange-500/60"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate group-hover:text-orange-400 transition">
                      {photo.participantName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {photo.department.split(' ')[0]}
                    </div>
                  </div>
                </div>

                {/* Activity Badge */}
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg glass-panel-orange text-orange-300">
                  {photo.activityType}
                </span>
              </div>

              {/* Image Aspect Box */}
              <div className="relative aspect-video sm:aspect-square bg-slate-900/60 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Telemetry Overlay */}
                <div className="absolute top-2 left-2 glass-panel px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 border-white/20">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>{photo.distanceKm} KM</span>
                </div>

                <div className="absolute bottom-2 left-2 glass-panel px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-200 flex items-center gap-1 border-white/20">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span className="truncate max-w-[180px]">{photo.location}</span>
                </div>
              </div>

              {/* Bottom Details & Kudos */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => handleLike(photo.id, e)}
                    className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      photo.likedByMe
                        ? 'glass-panel-orange text-orange-400'
                        : 'glass-panel text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${photo.likedByMe ? 'fill-orange-400 text-orange-400' : ''}`} />
                    <span>{photo.likes} Kudos</span>
                  </button>

                  <span className="text-[10px] font-mono text-slate-400">{photo.date}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {photo.caption}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-orange rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-black text-white uppercase tracking-tight f1-font">
                  UPLOAD STRAVA MOMENT
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Athlete</label>
                <select
                  value={selectedParticipantId}
                  onChange={(e) => setSelectedParticipantId(e.target.value)}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-orange-500"
                >
                  {participants.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                      {p.name} ({p.department.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  >
                    <option value="Running" className="bg-[#050505] text-white">Running</option>
                    <option value="Cycling" className="bg-[#050505] text-white">Cycling</option>
                    <option value="Hiking" className="bg-[#050505] text-white">Hiking</option>
                    <option value="Marathon" className="bg-[#050505] text-white">Marathon</option>
                    <option value="Office Event" className="bg-[#050505] text-white">Office Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Workout Distance (KM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Location / Trail</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Marina Bay Trail / Alpine Ridge"
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Caption / Story</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                  placeholder="Share your cadence, hill repeats or team vibes..."
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 text-[11px]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#ff7043] text-black font-black text-xs transition cursor-pointer"
                >
                  Publish to Community Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
