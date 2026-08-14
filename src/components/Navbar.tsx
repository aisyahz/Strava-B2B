import React, { useState } from 'react';
import { 
  Trophy, 
  Activity, 
  Flame, 
  Users, 
  Award, 
  Compass, 
  Image as ImageIcon, 
  Bell, 
  ShieldCheck, 
  FileText, 
  Volume2, 
  VolumeX, 
  Download, 
  Search,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ViewTab, NavTab, SeasonConfig } from '../types';
import { soundFX } from '../utils/audio';

interface NavbarProps {
  activeTab?: NavTab | ViewTab;
  currentTab?: NavTab | ViewTab;
  onSelectTab: (tab: NavTab) => void;
  season?: SeasonConfig;
  isAdmin?: boolean;
  onOpenAdminLogin: () => void;
  onOpenPosterModal?: () => void;
  onOpenPosterExport?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  currentTab,
  onSelectTab,
  season,
  isAdmin = false,
  onOpenAdminLogin,
  onOpenPosterModal,
  onOpenPosterExport,
  soundEnabled: externalSoundEnabled,
  onToggleSound,
  searchQuery = '',
  onSearchChange,
}) => {
  const [internalSoundEnabled, setInternalSoundEnabled] = useState(soundFX.isEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSoundOn = externalSoundEnabled !== undefined ? externalSoundEnabled : internalSoundEnabled;

  const toggleSound = () => {
    if (onToggleSound) {
      onToggleSound();
    } else {
      const next = soundFX.toggle();
      setInternalSoundEnabled(next);
      if (next) soundFX.playKudos();
    }
  };

  const handleOpenPoster = () => {
    if (onOpenPosterExport) onOpenPosterExport();
    else if (onOpenPosterModal) onOpenPosterModal();
  };

  const effectiveTab = activeTab || currentTab || 'dashboard';

  const seasonYear = season?.year || 2026;
  const currentMonthStr = season?.currentActiveMonth ? season.currentActiveMonth.toUpperCase() : 'AUG';

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE' },
    { id: 'departments', label: 'Dept Battle', icon: Users },
    { id: 'hall-of-fame', label: 'Hall of Fame', icon: Award },
    { id: 'gallery', label: 'Feed & Photos', icon: ImageIcon },
    { id: 'announcements', label: 'Alerts', icon: Bell, badge: 'NEW' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Top Telemetry Strip */}
      <div className="bg-gradient-to-r from-[#fc5200]/20 via-[#00f0ff]/15 to-[#8b5cf6]/20 border-b border-white/10 px-4 py-1.5 text-xs flex items-center justify-between font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse"></span>
          <span className="font-semibold text-white tracking-wider f1-font">SEASON {seasonYear} ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">STAGE: <span className="text-cyan-400 font-bold">{currentMonthStr} SPRINT</span></span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-orange-400 font-bold hidden md:inline">🔥 80KM BONUS THRESHOLD ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenPoster}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white glass-panel-blue px-2.5 py-0.5 rounded-lg transition cursor-pointer"
            title="Generate Leaderboard Poster for Print/Display"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline font-bold">Export Poster</span>
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition px-2 py-0.5 rounded-lg glass-panel hover:border-white/20 cursor-pointer"
            title="Toggle Sound Effects"
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-orange-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden md:inline text-[11px] font-mono">{isSoundOn ? 'FX On' : 'FX Off'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#ff7a00] flex items-center justify-center shadow-[0_0_20px_rgba(255,87,34,0.5)] group-hover:scale-105 transition transform">
              <Flame className="w-6 h-6 text-white animate-bounce" />
              <div className="absolute -bottom-1 -right-1 bg-black/80 px-1 py-0.2 text-[9px] font-mono text-cyan-400 rounded border border-cyan-500/40">
                '26
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight f1-font text-white">
                  B2B COMMERCE
                </span>
                <span className="bg-[#FF5722] text-black text-[10px] font-black uppercase px-1.5 py-0.5 rounded font-mono shadow-[0_0_10px_rgba(255,87,34,0.4)]">
                  STRAVA GP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide flex items-center gap-1.5">
                <span>JUNE – NOV 2026</span>
                <span className="text-orange-400 font-bold">•</span>
                <span className="text-cyan-400">CHALLENGE PORTAL</span>
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFX.playRaceBeep();
                    onSelectTab(item.id);
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'glass-panel-orange text-orange-400 shadow-[0_0_15px_rgba(255,87,34,0.3)]'
                      : 'text-slate-400 hover:text-white glass-panel hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-[#FF5722] text-black' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <div className="relative hidden sm:block w-40 md:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search athlete..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full glass-input text-xs text-white pl-8 pr-3 py-1.5 rounded-xl font-mono"
              />
            </div>

            {/* Admin Command Toggle */}
            <button
              onClick={() => {
                soundFX.playRaceBeep();
                if (isAdmin) {
                  onSelectTab('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                isAdmin
                  ? 'glass-panel-emerald text-emerald-300'
                  : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
              }`}
              title={isAdmin ? 'Open Admin Command Center' : 'Admin Login'}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Center' : 'Admin'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white glass-panel hover:border-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-4 space-y-2">
          <div className="pb-2">
            <input
              type="text"
              placeholder="Search athlete or department..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full glass-input text-xs text-white px-3 py-2 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFX.playRaceBeep();
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'glass-panel-orange text-orange-400'
                      : 'text-slate-400 hover:text-white glass-panel'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
