import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  X, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN is 2026 or admin
    if (pin === '2026' || pin.toLowerCase() === 'admin' || pin === '8888') {
      soundFX.playRankUp();
      onSuccess();
    } else {
      soundFX.playRaceBeep();
      setError('Invalid Access Key. (Hint: Use default PIN 2026)');
    }
  };

  const handleQuickDemo = () => {
    setPin('2026');
    soundFX.playRankUp();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel-orange border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,87,34,0.3)] space-y-6 relative font-mono">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl glass-panel-orange border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight f1-font">
            ADMIN SECURITY ACCESS
          </h3>
          <p className="text-xs text-slate-400">
            Enter administrative key to edit monthly scores, manage employees and publish bulletins.
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1 uppercase font-bold">
              Admin Access PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="Enter PIN (e.g. 2026)"
              className="w-full glass-panel text-white text-center text-lg tracking-widest py-3 px-4 rounded-xl border border-white/20 focus:outline-none focus:border-orange-500"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl glass-panel text-red-400 border border-red-500/30 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full bg-[#FF5722] hover:bg-[#ff7043] text-black font-black py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-[0_0_20px_rgba(255,87,34,0.4)]"
            >
              <span>Unlock Admin Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full glass-panel hover:bg-white/10 text-orange-400 border border-orange-500/30 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              ⚡ Quick Demo 1-Click Login (PIN: 2026)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
