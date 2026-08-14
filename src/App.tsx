import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Users, 
  Award, 
  Compass, 
  Image as ImageIcon, 
  Bell, 
  ShieldCheck, 
  Printer, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { Participant, PhotoPost, Announcement, SeasonConfig, NavTab } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_PHOTOS, INITIAL_ANNOUNCEMENTS, INITIAL_SEASON } from './data/initialData';
import { recalculateAllStats } from './utils/calculations';
import { soundFX } from './utils/audio';

// Components
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { CountdownWidget } from './components/CountdownWidget';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { DepartmentBattleView } from './components/DepartmentBattleView';
import { BadgesHallOfFameView } from './components/BadgesHallOfFameView';
import { PhotoGalleryView } from './components/PhotoGalleryView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AdminCenter } from './components/AdminCenter';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ParticipantModal } from './components/ParticipantModal';
import { PosterGeneratorModal } from './components/PosterGeneratorModal';

export function App() {
  // Persistence state
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('strava_portal_participants_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name !== 'Sarah Chen') {
          return recalculateAllStats(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved participants', e);
      }
    }
    return recalculateAllStats(INITIAL_PARTICIPANTS);
  });

  const [photos, setPhotos] = useState<PhotoPost[]>(() => {
    const saved = localStorage.getItem('strava_portal_photos_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PHOTOS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('strava_portal_announcements_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [season, setSeason] = useState<SeasonConfig>(() => {
    const saved = localStorage.getItem('strava_portal_season_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SEASON;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<NavTab>('leaderboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [rivalParticipant, setRivalParticipant] = useState<Participant | null>(null);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('strava_portal_participants_v3', JSON.stringify(participants));
    } catch (e) {}
  }, [participants]);

  useEffect(() => {
    try {
      localStorage.setItem('strava_portal_photos_v3', JSON.stringify(photos));
    } catch (e) {}
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem('strava_portal_announcements_v3', JSON.stringify(announcements));
    } catch (e) {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('strava_portal_season_v3', JSON.stringify(season));
    } catch (e) {}
  }, [season]);

  const handleToggleSound = () => {
    const newState = soundFX.toggleMute();
    setSoundEnabled(!newState);
  };

  const handleSelectTab = (tab: NavTab) => {
    soundFX.playRaceBeep();
    if (tab === 'admin' && !isAdmin) {
      setShowAdminLogin(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenParticipant = (p: Participant) => {
    setSelectedParticipant(p);
  };

  const handleResetData = () => {
    soundFX.playFanfare();
    const fresh = recalculateAllStats(INITIAL_PARTICIPANTS);
    setParticipants(fresh);
    setPhotos(INITIAL_PHOTOS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSeason(INITIAL_SEASON);
    try {
      localStorage.clear();
    } catch (e) {}
  };

  const handleAddPhoto = (newPhoto: PhotoPost) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handleLikePhoto = (id: string) => {
    setPhotos(
      photos.map((p) => {
        if (p.id === id) {
          const liked = !p.likedByMe;
          return {
            ...p,
            likedByMe: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-orange-500 selection:text-black font-sans relative antialiased flex flex-col">
        
        {/* Background Neon Grid Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
        </div>

        {/* Top Navbar with Telemetry Strip */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          season={season}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => setShowAdminLogin(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenPosterExport={() => setShowPosterModal(true)}
        />

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-6">
          
          {/* View Switcher */}
          {activeTab === 'dashboard' && (
            <DashboardView
              participants={participants}
              season={season}
              announcements={announcements}
              photos={photos}
              onSelectParticipant={handleOpenParticipant}
              onNavigate={handleSelectTab}
              onViewAllLeaderboard={() => handleSelectTab('leaderboard')}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              participants={participants}
              season={season}
              onSelectParticipant={handleOpenParticipant}
              onOpenPosterExport={() => setShowPosterModal(true)}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentBattleView
              participants={participants}
              onSelectParticipant={handleOpenParticipant}
            />
          )}

          {activeTab === 'hall-of-fame' && (
            <BadgesHallOfFameView
              participants={participants}
              onSelectParticipant={handleOpenParticipant}
            />
          )}

          {activeTab === 'gallery' && (
            <PhotoGalleryView
              photos={photos}
              participants={participants}
              onAddPhoto={handleAddPhoto}
              onLikePhoto={handleLikePhoto}
              onSelectParticipant={handleOpenParticipant}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              isAdmin={isAdmin}
              onAddAnnouncement={handleAddAnnouncement}
            />
          )}

          {activeTab === 'admin' && (
            <AdminCenter
              participants={participants}
              season={season}
              onUpdateParticipants={setParticipants}
              onUpdateSeason={setSeason}
              onResetData={handleResetData}
            />
          )}

        </main>

        {/* Modals & Overlays */}
        {selectedParticipant && (
          <ParticipantModal
            participant={selectedParticipant}
            allParticipants={participants}
            rivalParticipant={rivalParticipant}
            onSelectRival={setRivalParticipant}
            onClose={() => setSelectedParticipant(null)}
          />
        )}

        {showPosterModal && (
          <PosterGeneratorModal
            participants={participants}
            season={season}
            onClose={() => setShowPosterModal(false)}
          />
        )}

        {showAdminLogin && (
          <AdminLoginModal
            onSuccess={() => {
              setIsAdmin(true);
              setShowAdminLogin(false);
              setActiveTab('admin');
            }}
            onClose={() => setShowAdminLogin(false)}
          />
        )}

        {/* Corporate Grand Prix Footer */}
        <footer className="relative z-10 border-t border-white/10 glass-panel py-8 text-center text-xs font-mono text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-ping" />
              <span className="text-white font-bold tracking-wider f1-font">B2B COMMERCE STRAVA GP 2026</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">Live Stage Active</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-slate-300">Threshold: ≥80KM (<span className="text-orange-400 font-bold">+50 PTS</span>)</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Stage: <span className="text-cyan-400 font-bold">{season.currentActiveMonth.toUpperCase()} SPRINT</span></span>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => {
                  if (isAdmin) {
                    setActiveTab('admin');
                  } else {
                    setShowAdminLogin(true);
                  }
                }}
                className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-bold transition px-2 py-1 rounded-lg glass-panel hover:border-orange-500/40 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Admin Console' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}
export default App;
