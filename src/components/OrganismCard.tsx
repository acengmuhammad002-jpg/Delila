import React, { useState } from 'react';
import { Organism, PopulationLevel } from '../types/ecosystem';
import { POPULATION_LABELS } from '../data/ecosystemData';
import { Info, X, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface OrganismCardProps {
  organism: Organism;
  currentPopulation?: PopulationLevel;
  isSelected?: boolean;
  onSelect?: () => void;
  showPopulation?: boolean;
  compact?: boolean;
  interactive?: boolean;
}

export const OrganismCard: React.FC<OrganismCardProps> = ({
  organism,
  currentPopulation,
  isSelected = false,
  onSelect,
  showPopulation = false,
  compact = false,
  interactive = true,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const popInfo = currentPopulation ? POPULATION_LABELS[currentPopulation] : null;

  const getRoleBadgeStyle = (role: Organism['trophicRole']) => {
    switch (role) {
      case 'produsen':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'konsumen_1':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'konsumen_2':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'konsumen_3':
      case 'konsumen_puncak':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const handleCardClick = () => {
    if (!interactive) return;
    sounds.playClick();
    if (onSelect) {
      onSelect();
    } else {
      setShowDetailModal(true);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className={`relative flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all cursor-pointer select-none ${
          isSelected
            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-102'
            : 'bg-emerald-950/70 border-emerald-700/50 hover:bg-emerald-900/80 hover:border-emerald-500/60'
        }`}
      >
        <span className="text-2xl">{organism.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{organism.name}</p>
          <p className="text-[10px] text-emerald-300 truncate">{organism.roleLabel}</p>
        </div>
        {showPopulation && popInfo && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${popInfo.badgeClass}`}
          >
            {popInfo.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200 select-none ${
          interactive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''
        } ${
          isSelected
            ? 'border-amber-400 bg-amber-950/40 ring-4 ring-amber-400/40 shadow-lg'
            : 'border-emerald-700/50 bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 hover:border-emerald-500/70'
        }`}
      >
        {/* Top badges */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
              organism.category === 'biotik'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
            }`}
          >
            {organism.category.toUpperCase()}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              setShowDetailModal(true);
            }}
            className="p-1 rounded-full text-emerald-400 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            title="Pelajari lebih detail"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Emoji illustration & Name */}
        <div className="my-1 flex flex-col items-center text-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition-transform">
            {organism.emoji}
          </div>
          <h3 className="mt-2 text-sm sm:text-base font-extrabold text-white">
            {organism.name}
          </h3>
          <p className="text-[10px] sm:text-xs italic text-emerald-300/80">
            {organism.scientificName}
          </p>
        </div>

        {/* Role badge */}
        <div className="mt-2 text-center">
          <span
            className={`inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${getRoleBadgeStyle(
              organism.trophicRole
            )}`}
          >
            {organism.roleLabel}
          </span>
        </div>

        {/* Optional Population Badge */}
        {showPopulation && popInfo && (
          <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-300/80 font-medium">Populasi:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded border text-[10px] ${popInfo.badgeClass}`}
            >
              {popInfo.label}
            </span>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowDetailModal(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-emerald-800/60 hover:bg-rose-600 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-emerald-800/80 border-2 border-emerald-500/50 flex items-center justify-center text-5xl shadow-md">
                {organism.emoji}
              </div>
              <div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    organism.category === 'biotik'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {organism.category.toUpperCase()} • {organism.dietLabel}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {organism.name}
                </h2>
                <p className="text-xs italic text-emerald-300">
                  {organism.scientificName}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="mt-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-900/50 border border-emerald-700/50">
                <h4 className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4" /> Peran dalam Ekosistem
                </h4>
                <p className="text-sm font-semibold text-white">
                  {organism.roleLabel}
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {organism.energyRoleDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-amber-300 mb-1">
                  Deskripsi Lengkap
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {organism.description}
                </p>
              </div>

              {organism.facts && organism.facts.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
                    <Zap className="h-4 w-4 text-amber-400" /> Fakta Sains Penting
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {organism.facts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Food & Eaten By relationships */}
              {organism.category === 'biotik' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase block mb-1">
                      🥗 Makanan / Sumber Energi:
                    </span>
                    <p className="text-xs text-slate-300">
                      {organism.foods.length > 0
                        ? organism.foods.join(', ')
                        : 'Fotosintesis (Cahaya Matahari & Air)'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800">
                    <span className="text-[11px] font-bold text-rose-400 uppercase block mb-1">
                      ⚠️ Dimangsa Oleh:
                    </span>
                    <p className="text-xs text-slate-300">
                      {organism.eatenBy.length > 0
                        ? organism.eatenBy.join(', ')
                        : 'Tidak ada (Konsumen Puncak)'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer action */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowDetailModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow cursor-pointer"
              >
                Tutup Kartu Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
