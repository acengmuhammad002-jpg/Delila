import React from 'react';
import { 
  Home, 
  Map, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Presentation, 
  Trophy,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  totalScore: number;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTeacherGuide: () => void;
  onOpenHowToPlay: () => void;
  groupName?: string;
  onEditGroupName?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  totalScore,
  isProjectorMode,
  onToggleProjectorMode,
  soundEnabled,
  onToggleSound,
  onOpenTeacherGuide,
  onOpenHowToPlay,
  groupName,
  onEditGroupName,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-600/30 bg-emerald-950/90 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            title="Kembali ke Beranda"
          >
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="h-full w-full rounded-[10px] bg-emerald-950 flex items-center justify-center text-xl sm:text-2xl">
                🌾
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                Misi Penjaga Ekosistem
                <span className="hidden md:inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  IPAS Kelas V SD
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-300/80 font-medium hidden sm:block">
                Harmoni dalam Ekosistem Sawah
              </p>
            </div>
          </button>

          {/* Quick Nav to Map */}
          {currentScreen !== 'home' && currentScreen !== 'map' && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('map');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/80 text-emerald-100 text-xs font-semibold border border-emerald-600/40 transition-colors cursor-pointer"
            >
              <Map className="h-3.5 w-3.5 text-amber-400" />
              Peta Misi
            </button>
          )}
        </div>

        {/* Center: Team Name & Score Display */}
        <div className="flex items-center gap-2 sm:gap-3">
          {groupName && (
            <div
              onClick={onEditGroupName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-inner cursor-pointer hover:bg-amber-400/25 transition-colors"
              title="Klik untuk ubah nama kelompok"
            >
              <span className="text-sm">👥</span>
              <span className="max-w-[120px] sm:max-w-[180px] truncate">{groupName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-500/40 shadow-inner">
            <Trophy className="h-4 w-4 text-amber-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/90 leading-none">
                Skor Penjaga
              </span>
              <span className="text-sm sm:text-base font-black text-amber-300 leading-tight">
                {totalScore} <span className="text-xs font-normal text-emerald-200">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Modes */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Projector Mode Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleProjectorMode();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isProjectorMode
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md ring-2 ring-amber-400/50'
                : 'bg-emerald-900/60 text-emerald-200 border-emerald-600/40 hover:bg-emerald-800'
            }`}
            title={isProjectorMode ? 'Matikan Mode Proyektor' : 'Aktifkan Mode Proyektor (Teks Besar & Kontras Tinggi)'}
          >
            <Presentation className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">
              {isProjectorMode ? 'Mode Proyektor: ON' : 'Mode Proyektor'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            className="p-2 rounded-lg bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-600/40 transition-colors cursor-pointer"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-300" />
            ) : (
              <VolumeX className="h-4 w-4 text-rose-300" />
            )}
          </button>

          {/* Teacher Guide Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherGuide();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-colors cursor-pointer"
            title="Buka Panduan Fasilitasi & Mode Guru"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Mode Guru</span>
          </button>

          {/* How to play / Help */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="p-2 rounded-lg bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-600/40 transition-colors cursor-pointer"
            title="Petunjuk & Cara Bermain"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-lg bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-600/40 transition-colors cursor-pointer"
            title="Layar Penuh"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
