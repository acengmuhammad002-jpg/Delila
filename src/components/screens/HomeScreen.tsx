import React, { useState } from 'react';
import { 
  Play, 
  HelpCircle, 
  Target, 
  BookOpen, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Leaf,
  Sun,
  X,
  Users,
  Trophy,
  Edit3
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { GroupScoreRecord } from '../../types/ecosystem';

interface HomeScreenProps {
  onStartAdventure: () => void;
  onOpenTeacherGuide: () => void;
  onStartPreTest: () => void;
  hasCompletedPreTest: boolean;
  groupName: string;
  onUpdateGroupName: (name: string) => void;
  groupRecords: GroupScoreRecord[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartAdventure,
  onOpenTeacherGuide,
  onStartPreTest,
  hasCompletedPreTest,
  groupName,
  onUpdateGroupName,
  groupRecords,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const quickNames = [
    'Kelompok 1 (Elang)',
    'Kelompok 2 (Katak)',
    'Kelompok 3 (Padi)',
    'Kelompok 4 (Ular)',
    'Kelompok 5 (Tikus)',
  ];

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-900 p-4 sm:p-8">
      {/* Background Sawah Landscape Illustration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full object-cover" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <path d="M0 500 C300 450 600 550 900 480 C1200 420 1350 490 1440 470 L1440 800 L0 800 Z" fill="#047857" />
          <path d="M0 600 C400 560 800 640 1200 580 C1350 560 1400 590 1440 580 L1440 800 L0 800 Z" fill="#065f46" />
          <path d="M0 680 C350 640 700 720 1100 660 C1300 640 1400 670 1440 660 L1440 800 L0 800 Z" fill="#064e3b" />
          {/* Sun rays */}
          <circle cx="200" cy="150" r="100" fill="#fef08a" opacity="0.3" filter="blur(40px)" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-300 shadow-md backdrop-blur-md mb-4 animate-bounce">
          <Leaf className="h-4 w-4 text-emerald-400" />
          <span>Game Simulasi Interaktif & Petualangan IPAS Kelas V SD</span>
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>

        {/* Hero Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-md leading-tight">
          MISI PENJAGA <br />
          <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            EKOSISTEM
          </span>
        </h1>

        <p className="mt-2 text-lg sm:text-2xl font-bold text-amber-300 italic tracking-wide">
          “Amati Alam, Temukan Hubungan, Jaga Keseimbangan!”
        </p>

        {/* Team/Student Name Input Box - Prominent for classroom */}
        <div className="mt-5 w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-emerald-900/80 border-2 border-amber-400/80 shadow-2xl backdrop-blur-md text-left">
          <label className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-amber-400" />
            Masukkan Nama Kelompok atau Siswa:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={groupName}
              onChange={(e) => onUpdateGroupName(e.target.value)}
              placeholder="Contoh: Kelompok 1 (Elang Sawah) / Siti & Budi"
              className="w-full px-4 py-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/50 text-white placeholder-emerald-400/60 font-bold text-sm sm:text-base focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all"
            />
            <span className="absolute right-3.5 text-emerald-400 pointer-events-none">
              <Edit3 className="h-4 w-4" />
            </span>
          </div>

          {/* Quick Click Name Presets */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-emerald-300/80 font-semibold mr-1">
              Pilihan Cepat:
            </span>
            {quickNames.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  sounds.playClick();
                  onUpdateGroupName(preset);
                }}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  groupName === preset
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 font-black'
                    : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-200 border-emerald-700/60'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Guide Character Banner */}
        <div className="mt-5 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 backdrop-blur-md max-w-xl text-left shadow-lg">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
            🤠
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">
              Halo, {groupName || 'Sahabat Penjaga'}!
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              "Keseimbangan sawah sedang terganggu! Mari berdiskusi bersama dan selamatkan persawahan di 3 Pos Misi!"
            </p>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              sounds.playFanfare();
              onStartAdventure();
            }}
            className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 font-black text-base sm:text-lg flex items-center gap-3 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-amber-400/40"
          >
            <Play className="h-6 w-6 fill-current" />
            <span>Mulai Petualangan</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>

          {!hasCompletedPreTest && (
            <button
              onClick={() => {
                sounds.playClick();
                onStartPreTest();
              }}
              className="px-5 py-4 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold text-sm sm:text-base flex items-center gap-2 border border-emerald-500/50 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <HelpCircle className="h-5 w-5 text-amber-300" />
              <span>Asesmen Awal (Pre-Test)</span>
            </button>
          )}

          {groupRecords && groupRecords.length > 0 && (
            <button
              onClick={() => {
                sounds.playClick();
                setShowHistory(true);
              }}
              className="px-5 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm sm:text-base flex items-center gap-2 border border-amber-500/50 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Trophy className="h-5 w-5 text-amber-400" />
              <span>Riwayat Skor Kelompok ({groupRecords.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setShowHowToPlay(true);
            }}
            className="px-5 py-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-bold text-sm sm:text-base flex items-center gap-2 border border-emerald-700/60 transition-all active:scale-95 cursor-pointer"
          >
            <Compass className="h-5 w-5 text-emerald-400" />
            <span>Cara Bermain</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShowObjectives(true);
            }}
            className="px-5 py-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-bold text-sm sm:text-base flex items-center gap-2 border border-emerald-700/60 transition-all active:scale-95 cursor-pointer"
          >
            <Target className="h-5 w-5 text-emerald-400" />
            <span>Tujuan Belajar</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenTeacherGuide();
            }}
            className="px-5 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm sm:text-base flex items-center gap-2 border border-amber-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-5 w-5 text-amber-400" />
            <span>Panduan Guru</span>
          </button>
        </div>
      </div>

      {/* Modal: Riwayat Skor Kelompok */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-slate-900 to-emerald-950 p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                sounds.playClick();
                setShowHistory(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-emerald-800/60 hover:bg-rose-600 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-amber-400" />
              Papan Riwayat Skor Kelompok Kelas
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Daftar skor kelompok sebelumnya yang tersimpan di media pembelajaran ini:
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {groupRecords.map((rec, i) => (
                <div
                  key={rec.id || i}
                  className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-700/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{rec.groupName}</h4>
                      <p className="text-[11px] text-emerald-300">{rec.awardTitle} • {rec.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-300">{rec.totalScore}</span>
                    <span className="text-xs text-slate-400 block">/ 100 Poin</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}




      {/* Footer Info */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80 border-t border-emerald-800/40 gap-2">
        <span>Materi: Harmoni dalam Ekosistem • Kurikulum Merdeka IPAS Kelas V</span>
        <span>Dirancang Khusus untuk Tampilan Layar Laptop & Proyektor Kelas</span>
      </div>

      {/* Modal: Cara Bermain */}
      {showHowToPlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowHowToPlay(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-b from-emerald-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                sounds.playClick();
                setShowHowToPlay(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-emerald-800/60 hover:bg-rose-600 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
              <Compass className="h-6 w-6 text-amber-400" />
              Petunjuk Petualangan Penjaga Ekosistem
            </h3>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-200">
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50 flex items-start gap-3">
                <span className="h-7 w-7 rounded-lg bg-emerald-500 text-emerald-950 font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white block font-bold">Pos 1 — Mengenal Ekosistem (20 Poin)</strong>
                  Jelajahi petak sawah, temukan 9 komponen alami (padi, serangga, predator, sinar matahari, tanah, air), dan kelompokkan berdasarkan biotik/abiotik serta perannya.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50 flex items-start gap-3">
                <span className="h-7 w-7 rounded-lg bg-emerald-500 text-emerald-950 font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white block font-bold">Pos 2 — Merangkai Hubungan (45 Poin)</strong>
                  Susun rantai makanan dengan arah panah energi yang benar (Dimakan ➔ Pemakan). Hubungkan beberapa rantai menjadi jaring-jaring makanan yang utuh.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/50 flex items-start gap-3">
                <span className="h-7 w-7 rounded-lg bg-emerald-500 text-emerald-950 font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white block font-bold">Pos 3 — Menyelamatkan Keseimbangan (35 Poin)</strong>
                  Buat hipotesis/prediksi bersama teman sekelas, jalankan mesin simulasi sebab-akibat, amati dampak populasi, dan tentukan solusi ekologis terbaik!
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHowToPlay(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm cursor-pointer"
              >
                Saya Siap Bermain!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tujuan Pembelajaran */}
      {showObjectives && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowObjectives(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-400/50 bg-gradient-to-b from-emerald-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                sounds.playClick();
                setShowObjectives(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-emerald-800/60 hover:bg-rose-600 text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
              <Target className="h-6 w-6 text-amber-400" />
              Tujuan Pembelajaran IPAS Kelas V SD
            </h3>

            <p className="mt-2 text-xs text-emerald-200">
              Setelah menyelesaikan game simulasi ini, siswa diharapkan dapat:
            </p>

            <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-200">
              {[
                'Mengidentifikasi komponen biotik dan abiotik dalam ekosistem sawah.',
                'Menjelaskan peran produsen dan konsumen dalam hubungan makan dan dimakan.',
                'Membaca serta menyusun rantai makanan menggunakan arah panah yang benar (aliran energi).',
                'Menjelaskan bahwa beberapa rantai makanan saling berhubungan membentuk jaring-jaring makanan.',
                'Memprediksi dampak perubahan jumlah suatu populasi terhadap organisme lain dalam jaring-jaring makanan.',
                'Memilih tindakan yang sesuai untuk membantu menjaga keseimbangan ekosistem dan menjelaskan alasannya secara ilmiah.',
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-800">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowObjectives(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
