import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Edit3, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Calendar, 
  Check, 
  AlertCircle, 
  FileSpreadsheet, 
  Lock, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant, ChallengeMonth, Department, Gender, SeasonConfig, MonthlyRecord } from '../types';
import { MONTHS, recalculateAllStats } from '../utils/calculations';
import { soundFX } from '../utils/audio';

interface AdminCenterProps {
  participants: Participant[];
  season: SeasonConfig;
  onUpdateParticipants: (updated: Participant[]) => void;
  onUpdateSeason: (updatedSeason: SeasonConfig) => void;
  onResetData: () => void;
}

export const AdminCenter: React.FC<AdminCenterProps> = ({
  participants,
  season,
  onUpdateParticipants,
  onUpdateSeason,
  onResetData,
}) => {
  const [adminTab, setAdminTab] = useState<'scores' | 'participants' | 'import-export' | 'season'>('scores');
  const [selectedMonth, setSelectedMonth] = useState<ChallengeMonth>(season.currentActiveMonth || 'august');
  
  // Local state for batch editing scores
  const [editingScores, setEditingScores] = useState<Record<string, {
    distanceKm: number;
    bonus80Km: number;
    eventBonus: number;
    activitiesCount: number;
    longestActivityKm: number;
  }>>({});

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Participant Form Modal
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Form fields
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pDept, setPDept] = useState<Department>('Engineering & Tech');
  const [pGender, setPGender] = useState<Gender>('Female');
  const [pRole, setPRole] = useState('Engineer');
  const [pAvatar, setPAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  const [pStrava, setPStrava] = useState('');
  const [pMotto, setPMotto] = useState('');

  // Bulk CSV import text
  const [csvText, setCsvText] = useState('');
  const [csvParseError, setCsvParseError] = useState('');

  // Initialize editing scores map when month changes
  React.useEffect(() => {
    const map: Record<string, any> = {};
    participants.forEach((p) => {
      const rec = p.monthlyRecords[selectedMonth] || {
        distanceKm: 0,
        bonus80Km: 0,
        eventBonus: 0,
        activitiesCount: 0,
        longestActivityKm: 0,
      };
      map[p.id] = {
        distanceKm: rec.distanceKm || 0,
        bonus80Km: rec.bonus80Km !== undefined ? rec.bonus80Km : (rec.distanceKm >= 80 ? 50 : 0),
        eventBonus: rec.eventBonus || 0,
        activitiesCount: rec.activitiesCount || 0,
        longestActivityKm: rec.longestActivityKm || 0,
      };
    });
    setEditingScores(map);
  }, [selectedMonth, participants]);

  const handleScoreChange = (pId: string, field: string, val: number) => {
    setEditingScores((prev) => {
      const current = prev[pId] || { distanceKm: 0, bonus80Km: 0, eventBonus: 0, activitiesCount: 0, longestActivityKm: 0 };
      const updated = { ...current, [field]: Math.max(0, val) };
      // If distance changed, auto-suggest 80km bonus if >= 80
      if (field === 'distanceKm') {
        if (updated.distanceKm >= 80 && updated.bonus80Km === 0) {
          updated.bonus80Km = 50;
        } else if (updated.distanceKm < 80 && updated.bonus80Km === 50) {
          updated.bonus80Km = 0;
        }
      }
      return { ...prev, [pId]: updated };
    });
  };

  const handleSaveAllScores = () => {
    soundFX.playRankUp();
    const updated = participants.map((p) => {
      const edit = editingScores[p.id];
      if (!edit) return p;

      const currentRec = p.monthlyRecords[selectedMonth] || {
        month: selectedMonth,
        distanceKm: 0,
        distancePoints: 0,
        bonus80Km: 0,
        eventBonus: 0,
        totalBonus: 0,
        totalPoints: 0,
        rank: 1,
        previousRank: 1,
        activitiesCount: 0,
        longestActivityKm: 0,
        elevationGainMeters: 0,
      };

      const distPts = Math.round(edit.distanceKm * 10) / 10;
      const totalBonus = edit.bonus80Km + edit.eventBonus;
      const totalMonthPts = distPts + totalBonus;

      const newRec: MonthlyRecord = {
        ...currentRec,
        month: selectedMonth,
        distanceKm: edit.distanceKm,
        distancePoints: distPts,
        bonus80Km: edit.bonus80Km,
        eventBonus: edit.eventBonus,
        totalBonus,
        totalPoints: totalMonthPts,
        activitiesCount: edit.activitiesCount,
        longestActivityKm: edit.longestActivityKm,
      };

      return {
        ...p,
        monthlyRecords: {
          ...p.monthlyRecords,
          [selectedMonth]: newRec,
        },
      };
    });

    const recalculated = recalculateAllStats(updated);
    onUpdateParticipants(recalculated);

    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#00f0ff', '#fc5200'],
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const openAddModal = () => {
    setEditingParticipant(null);
    setPName('');
    setPEmail('');
    setPDept('Engineering & Tech');
    setPGender('Female');
    setPRole('Associate');
    setPAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    setPStrava('');
    setPMotto('');
    setShowAddParticipantModal(true);
  };

  const openEditModal = (p: Participant) => {
    setEditingParticipant(p);
    setPName(p.name);
    setPEmail(p.email);
    setPDept(p.department);
    setPGender(p.gender);
    setPRole(p.roleTitle);
    setPAvatar(p.avatarUrl);
    setPStrava(p.stravaHandle || '');
    setPMotto(p.motto || '');
    setShowAddParticipantModal(true);
  };

  const handleSaveParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName) return;

    let updatedList: Participant[];

    if (editingParticipant) {
      updatedList = participants.map((p) => {
        if (p.id === editingParticipant.id) {
          return {
            ...p,
            name: pName,
            email: pEmail || p.email,
            department: pDept,
            gender: pGender,
            roleTitle: pRole,
            avatarUrl: pAvatar || p.avatarUrl,
            stravaHandle: pStrava,
            motto: pMotto,
          };
        }
        return p;
      });
    } else {
      const newP: Participant = {
        id: `p-${Date.now()}`,
        name: pName,
        email: pEmail || `${pName.toLowerCase().replace(/\s+/g, '.')}@b2bcommerce.com`,
        department: pDept,
        gender: pGender,
        roleTitle: pRole,
        avatarUrl: pAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        joinDate: new Date().toISOString().split('T')[0],
        active: true,
        stravaHandle: pStrava,
        motto: pMotto,
        monthlyRecords: {
          june: { month: 'june', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
          july: { month: 'july', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
          august: { month: 'august', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
          september: { month: 'september', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
          october: { month: 'october', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
          november: { month: 'november', distanceKm: 0, distancePoints: 0, bonus80Km: 0, eventBonus: 0, totalBonus: 0, totalPoints: 0, rank: 1, previousRank: 1, activitiesCount: 0, longestActivityKm: 0, elevationGainMeters: 0 },
        },
        earnedBadges: [],
        totalDistanceKm: 0,
        totalPoints: 0,
        overallRank: participants.length + 1,
        previousOverallRank: participants.length + 1,
        longestSingleActivityKm: 0,
        totalActivities: 0,
        streakMonths: 0,
      };
      updatedList = [...participants, newP];
    }

    const recalculated = recalculateAllStats(updatedList);
    onUpdateParticipants(recalculated);
    setShowAddParticipantModal(false);
    soundFX.playRankUp();
  };

  const handleToggleActive = (pId: string) => {
    const updated = participants.map((p) => {
      if (p.id === pId) return { ...p, active: !p.active };
      return p;
    });
    const recalculated = recalculateAllStats(updated);
    onUpdateParticipants(recalculated);
  };

  // Export CSV
  const handleExportCSV = () => {
    soundFX.playRaceBeep();
    const headers = ['ID', 'Name', 'Department', 'Gender', 'Email', 'Active', 'Total Distance (KM)', 'Total Points', 'Rank', 'August Distance', 'August Points'];
    const rows = participants.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.department}"`,
      p.gender,
      p.email,
      p.active ? 'Yes' : 'No',
      p.totalDistanceKm,
      p.totalPoints,
      p.overallRank,
      p.monthlyRecords.august?.distanceKm || 0,
      p.monthlyRecords.august?.totalPoints || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Strava_Challenge_2026_Export_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse Bulk CSV
  const handleParseCSV = () => {
    try {
      if (!csvText.trim()) {
        setCsvParseError('Please paste CSV lines to import');
        return;
      }

      const lines = csvText.trim().split('\n');
      const updated = [...participants];

      lines.forEach((line) => {
        const parts = line.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const nameOrEmail = parts[0];
          const dist = parseFloat(parts[1]) || 0;
          const eventBonus = parts[2] ? parseFloat(parts[2]) : 25;

          const found = updated.find((p) => 
            p.name.toLowerCase() === nameOrEmail.toLowerCase() || 
            p.email.toLowerCase() === nameOrEmail.toLowerCase()
          );

          if (found) {
            const rec = found.monthlyRecords[selectedMonth] || {
              month: selectedMonth,
              distanceKm: 0,
              distancePoints: 0,
              bonus80Km: 0,
              eventBonus: 0,
              totalBonus: 0,
              totalPoints: 0,
              rank: 1,
              previousRank: 1,
              activitiesCount: 0,
              longestActivityKm: 0,
              elevationGainMeters: 0,
            };
            rec.distanceKm = dist;
            rec.bonus80Km = dist >= 80 ? 50 : 0;
            rec.eventBonus = eventBonus;
            found.monthlyRecords[selectedMonth] = rec;
          }
        }
      });

      const recalculated = recalculateAllStats(updated);
      onUpdateParticipants(recalculated);
      soundFX.playFanfare();
      setCsvText('');
      setCsvParseError('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setCsvParseError(`CSV Parse Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner */}
      <div className="glass-panel-emerald rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl glass-panel-emerald flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  ADMIN COMMAND CENTER
                </span>
                <span className="bg-emerald-400 text-black text-[10px] font-mono font-black px-1.5 py-0.2 rounded-md">
                  AUTHENTICATED
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight f1-font">
                SCORES ENTRY & CHALLENGE GOVERNANCE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white glass-panel hover:bg-white/10 px-3 py-2 rounded-xl transition cursor-pointer"
              title="Reload sample seed dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setAdminTab('scores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase transition cursor-pointer ${
            adminTab === 'scores' ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Monthly Score Entry</span>
        </button>

        <button
          onClick={() => setAdminTab('participants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase transition cursor-pointer ${
            adminTab === 'participants' ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Athletes ({participants.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('import-export')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase transition cursor-pointer ${
            adminTab === 'import-export' ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel / CSV Import & Export</span>
        </button>

        <button
          onClick={() => setAdminTab('season')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase transition cursor-pointer ${
            adminTab === 'season' ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Season Settings</span>
        </button>
      </div>

      {/* 3. Tab 1: Monthly Score Entry Grid */}
      {adminTab === 'scores' && (
        <div className="space-y-4">
          
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold uppercase">Select Target Month:</span>
              <div className="flex items-center gap-1 glass-panel p-1 rounded-xl">
                {MONTHS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setSelectedMonth(m.key)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition cursor-pointer ${
                      selectedMonth === m.key ? 'bg-[#FF5722] text-black shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAllScores}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? '✓ SAVED & RECALCULATED' : 'SAVE & RECALCULATE LEADERBOARD'}</span>
            </button>
          </div>

          {/* Scores Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="glass-panel border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Athlete</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center w-36">Logged Distance (KM)</th>
                    <th className="py-3 px-4 text-center w-28">80KM Bonus</th>
                    <th className="py-3 px-4 text-center w-28">Event Bonus</th>
                    <th className="py-3 px-4 text-center w-28">Activities</th>
                    <th className="py-3 px-4 text-right">Computed Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participants.map((p) => {
                    const edit = editingScores[p.id] || { distanceKm: 0, bonus80Km: 0, eventBonus: 0, activitiesCount: 0, longestActivityKm: 0 };
                    const computedPts = Math.round((edit.distanceKm + edit.bonus80Km + edit.eventBonus) * 10) / 10;

                    return (
                      <tr key={p.id} className="hover:bg-white/[0.04] transition">
                        <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                          <img src={p.avatarUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover border border-orange-500/40" />
                          <span className="truncate max-w-[150px]">{p.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                          {p.department.split(' ')[0]}
                        </td>

                        {/* Distance KM Input */}
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={edit.distanceKm}
                            onChange={(e) => handleScoreChange(p.id, 'distanceKm', parseFloat(e.target.value) || 0)}
                            className="w-28 glass-panel text-white text-center py-1 px-2 rounded-lg border border-white/20 focus:outline-none focus:border-orange-500 font-bold"
                          />
                        </td>

                        {/* 80KM Bonus */}
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="number"
                            value={edit.bonus80Km}
                            onChange={(e) => handleScoreChange(p.id, 'bonus80Km', parseInt(e.target.value) || 0)}
                            className={`w-20 glass-panel text-center py-1 px-2 rounded-lg border font-bold ${
                              edit.bonus80Km > 0 ? 'text-emerald-400 border-emerald-500/50' : 'text-slate-500 border-white/10'
                            }`}
                          />
                        </td>

                        {/* Event Bonus */}
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="number"
                            value={edit.eventBonus}
                            onChange={(e) => handleScoreChange(p.id, 'eventBonus', parseInt(e.target.value) || 0)}
                            className={`w-20 glass-panel text-center py-1 px-2 rounded-lg border font-bold ${
                              edit.eventBonus > 0 ? 'text-cyan-400 border-cyan-500/50' : 'text-slate-500 border-white/10'
                            }`}
                          />
                        </td>

                        {/* Activities count */}
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="number"
                            value={edit.activitiesCount}
                            onChange={(e) => handleScoreChange(p.id, 'activitiesCount', parseInt(e.target.value) || 0)}
                            className="w-20 glass-panel text-white text-center py-1 px-2 rounded-lg border border-white/20"
                          />
                        </td>

                        {/* Computed Points */}
                        <td className="py-2.5 px-4 text-right font-black text-white text-sm">
                          <span className="text-orange-400">{computedPts}</span> PTS
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. Tab 2: Manage Participants */}
      {adminTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white font-mono uppercase f1-font">
              REGISTERED ATHLETES ({participants.length})
            </h3>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 bg-[#FF5722] hover:bg-[#ff7043] text-black font-mono font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(255,87,34,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Athlete</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {participants.map((p) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl transition flex flex-col justify-between ${
                  p.active ? 'glass-panel glass-panel-hover' : 'glass-panel border-red-500/20 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img src={p.avatarUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-orange-500/40" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white truncate">{p.name}</h4>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        p.active ? 'glass-panel-emerald text-emerald-300' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {p.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="text-[11px] text-orange-400 truncate">{p.roleTitle}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.department}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="text-white font-bold">{p.totalDistanceKm} KM</span> • <span className="text-cyan-400">{p.totalPoints} PTS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 glass-panel hover:bg-white/10 text-slate-300 rounded-lg cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(p.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.active ? 'bg-red-950/40 text-red-400 border-red-500/30' : 'glass-panel-emerald text-emerald-400'
                      }`}
                      title={p.active ? 'Deactivate' : 'Activate'}
                    >
                      {p.active ? <Trash2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tab 3: Excel / CSV Import & Export */}
      {adminTab === 'import-export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Bulk Import */}
          <div className="glass-panel-orange rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-black text-white uppercase f1-font">
                  BULK CSV SCORES IMPORT
                </h4>
              </div>
              <span className="text-orange-400 font-bold uppercase">{selectedMonth}</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              Paste CSV data in the format: <br />
              <code className="text-orange-400">Name or Email, DistanceKm, EventBonus</code>
            </p>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
              placeholder={`Sarah Chen, 154.0, 25\nMarcus Vance, 148.6, 50\nElena Rostova, 145.2, 25`}
              className="w-full glass-panel text-white p-3 rounded-xl border border-white/20 focus:outline-none focus:border-orange-500 font-mono text-xs"
            />

            {csvParseError && (
              <div className="p-2.5 rounded-xl glass-panel border-red-500/30 text-red-400 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{csvParseError}</span>
              </div>
            )}

            <button
              onClick={handleParseCSV}
              className="w-full bg-[#FF5722] hover:bg-[#ff7043] text-black font-black py-2.5 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(255,87,34,0.4)]"
            >
              Parse & Update Monthly Standings
            </button>
          </div>

          {/* Bulk Export */}
          <div className="glass-panel-blue rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Download className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black text-white uppercase f1-font">
                  EXPORT OFFICIAL SPREADSHEETS
                </h4>
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                Download complete challenge records containing athlete mileage, points, rank movements, and department metrics.
              </p>

              <div className="glass-panel p-4 rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Total Exportable Records:</span>
                  <span className="text-white font-bold">{participants.length} Athletes</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Current Selected Stage:</span>
                  <span className="text-cyan-400 font-bold uppercase">{selectedMonth} 2026</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="w-full bg-[#00E5FF] hover:bg-[#33ebff] text-black font-black py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Spreadsheet</span>
            </button>
          </div>

        </div>
      )}

      {/* 6. Tab 4: Season Settings & Multi-Year Scalability */}
      {adminTab === 'season' && (
        <div className="glass-panel rounded-2xl p-6 space-y-6 font-mono text-xs max-w-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-black text-white uppercase f1-font">
              CHALLENGE SEASON CONFIGURATION
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-1">Season Name</label>
              <input
                type="text"
                value={season.seasonName}
                onChange={(e) => onUpdateSeason({ ...season, seasonName: e.target.value })}
                className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Current Active Stage Month</label>
                <select
                  value={season.currentActiveMonth}
                  onChange={(e) => onUpdateSeason({ ...season, currentActiveMonth: e.target.value as any })}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                >
                  {MONTHS.map((m) => (
                    <option key={m.key} value={m.key} className="bg-[#050505] text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Company Distance (KM)</label>
                <input
                  type="number"
                  value={season.targetCompanyDistanceKm}
                  onChange={(e) => onUpdateSeason({ ...season, targetCompanyDistanceKm: parseInt(e.target.value) || 15000 })}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Prize Gala Date</label>
              <input
                type="text"
                value={season.prizeDate}
                onChange={(e) => onUpdateSeason({ ...season, prizeDate: e.target.value })}
                className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Participant Modal */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-orange border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 font-mono text-xs">
            <h3 className="text-base font-black text-white uppercase tracking-tight f1-font">
              {editingParticipant ? 'EDIT ATHLETE PROFILE' : 'REGISTER NEW ATHLETE'}
            </h3>

            <form onSubmit={handleSaveParticipant} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Department</label>
                  <select
                    value={pDept}
                    onChange={(e) => setPDept(e.target.value as Department)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  >
                    <option value="Engineering & Tech" className="bg-[#050505] text-white">Engineering & Tech</option>
                    <option value="Sales & Business Dev" className="bg-[#050505] text-white">Sales & Business Dev</option>
                    <option value="Product & UX" className="bg-[#050505] text-white">Product & UX</option>
                    <option value="Operations & Logistics" className="bg-[#050505] text-white">Operations & Logistics</option>
                    <option value="Marketing & Growth" className="bg-[#050505] text-white">Marketing & Growth</option>
                    <option value="Finance & People" className="bg-[#050505] text-white">Finance & People</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Gender</label>
                  <select
                    value={pGender}
                    onChange={(e) => setPGender(e.target.value as Gender)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  >
                    <option value="Female" className="bg-[#050505] text-white">Female</option>
                    <option value="Male" className="bg-[#050505] text-white">Male</option>
                    <option value="Other" className="bg-[#050505] text-white">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={pRole}
                    onChange={(e) => setPRole(e.target.value)}
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Strava Handle</label>
                  <input
                    type="text"
                    value={pStrava}
                    onChange={(e) => setPStrava(e.target.value)}
                    placeholder="e.g. runner_pace"
                    className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={pAvatar}
                  onChange={(e) => setPAvatar(e.target.value)}
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20 text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Motto</label>
                <input
                  type="text"
                  value={pMotto}
                  onChange={(e) => setPMotto(e.target.value)}
                  placeholder="e.g. 5 AM workouts fuel all-day focus."
                  className="w-full glass-panel text-white p-2.5 rounded-xl border border-white/20"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5722] hover:bg-[#ff7043] text-black font-black cursor-pointer shadow-[0_0_15px_rgba(255,87,34,0.4)]"
                >
                  Save Athlete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
