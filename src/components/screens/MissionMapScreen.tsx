import React from 'react';
import { 
  Compass, 
  Lock, 
  CheckCircle, 
  Play, 
  Star, 
  Award, 
  ArrowRight,
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { GameProgress } from '../../types/ecosystem';

interface MissionMapScreenProps {
  progress: GameProgress;
  onSelectMission: (missionId: string) => void;
  allUnlocked: boolean;
  onOpenTeacherGuide: () => void;
}

export const MissionMapScreen: React.FC<MissionMapScreenProps> = ({
  progress,
  onSelectMission,
  allUnlocked,
  onOpenTeacherGuide,
}) => {
  const missions = [
    {
      id: 'misi-1',
      title: 'Pos 1: Mengenal Ekosistem',
      subtitle: 'Komponen Biotik, Abiotik, dan Peran Makhluk Hidup',
      description: 'Jelajahi petak sawah dan temukan unsur biotik serta abiotik yang saling melengkapi.',
      scoreWeight: '20 Poin',
      isCompleted: progress.mission1Completed,
      score: progress.mission1Score,
      isUnlocked: true, // Always unlocked
      icon: '🌾',
      badgeClass: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'misi-2',
      title: 'Pos 2: Merangkai Hubungan',
      subtitle: 'Rantai Makanan & Jaring-Jaring Makanan Sawah',
      description: 'Rangkai hubungan makan dan dimakan dengan arah panah perpindahan energi yang benar.',
      scoreWeight: '45 Poin',
      isCompleted: progress.mission2Completed,
      score: progress.mission2Score,
      isUnlocked: allUnlocked || progress.mission1Completed,
      icon: '🕸️',
      badgeClass: 'from-amber-500 to-emerald-600',
    },
    {
      id: 'misi-3',
      title: 'Pos 3: Menyelamatkan Keseimbangan',
      subtitle: 'Simulasi Sebab-Akibat Perubahan Populasi',
      description: 'Uji dampak ledakan atau penurunan populasi dan tentukan solusi ekologis terbaik.',
      scoreWeight: '35 Poin',
      isCompleted: progress.mission3Completed,
      score: progress.mission3Score,
      isUnlocked: allUnlocked || progress.mission2Completed,
      icon: '⚖️',
      badgeClass: 'from-cyan-500 to-blue-600',
    },
  ];

  const allMissionsFinished = progress.mission1Completed && progress.mission2Completed && progress.mission3Completed;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-900/90 to-teal-950/90 border-2 border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-3xl shadow-lg shrink-0">
            🗺️
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="h-4 w-4" /> Peta Petualangan Sawah
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Pilih Pos Misi Penjaga Ekosistem
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              Selesaikan misi secara bertahap untuk membuka pos berikutnya dan menjaga keharmonisan alam!
            </p>
          </div>
        </div>

        {/* Total Score Meter */}
        <div className="shrink-0 flex items-center gap-3 bg-emerald-950/80 px-4 py-3 rounded-2xl border border-emerald-500/50">
          <Award className="h-8 w-8 text-amber-400" />
          <div>
            <span className="text-[10px] text-emerald-300 uppercase font-black tracking-wider block">
              Total Skor Akumulasi
            </span>
            <div className="text-2xl font-black text-amber-300">
              {progress.totalScore} <span className="text-xs text-slate-300">/ 100 Poin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Path / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {missions.map((mission, index) => {
          return (
            <div
              key={mission.id}
              className={`relative flex flex-col justify-between rounded-3xl border-3 p-6 transition-all duration-300 shadow-xl ${
                !mission.isUnlocked
                  ? 'border-slate-800 bg-slate-950/60 opacity-60'
                  : mission.isCompleted
                  ? 'border-emerald-400 bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 hover:scale-[1.02]'
                  : 'border-amber-400/80 bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-900 hover:scale-[1.02] ring-4 ring-amber-400/20'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${mission.badgeClass} flex items-center justify-center text-3xl shadow-md`}>
                    {mission.icon}
                  </div>

                  {mission.isCompleted ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      Selesai ({mission.score})
                    </span>
                  ) : !mission.isUnlocked ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                      <Lock className="h-3.5 w-3.5" />
                      Terkunci
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/40 animate-pulse">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Siap Dimainkan!
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-black text-amber-300 tracking-wider uppercase block">
                    Bobot: {mission.scoreWeight}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {mission.title}
                  </h3>
                  <h4 className="text-xs font-semibold text-emerald-300">
                    {mission.subtitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-6 pt-4 border-t border-emerald-800/60">
                {mission.isUnlocked ? (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectMission(mission.id);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ${
                      mission.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                    }`}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {mission.isCompleted ? 'Mainkan Ulang Pos Ini' : 'Mulai Misi Ini'}
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl bg-slate-900 text-slate-500 text-center text-xs font-bold flex items-center justify-center gap-2 select-none">
                    <Lock className="h-4 w-4" />
                    Selesaikan Pos Sebelumnya
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Stage: Post-Test & Rapor */}
      <div className={`p-6 rounded-3xl border-2 transition-all ${
        allMissionsFinished || allUnlocked
          ? 'bg-gradient-to-r from-amber-950/80 via-emerald-950 to-teal-950/80 border-amber-400 shadow-2xl'
          : 'bg-slate-950/60 border-slate-800 opacity-60'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
              🎓
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Tahap Penutup & Refleksi Akhir
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Asesmen Akhir & Rapor Penjaga Ekosistem
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Evaluasi pemahaman ilmiah secara menyeluruh, bandingkan dengan pre-test, dan dapatkan sertifikat penghargaan!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {allMissionsFinished || allUnlocked ? (
              <button
                onClick={() => {
                  sounds.playFanfare();
                  onSelectMission('post-test');
                }}
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Buka Asesmen & Rapor</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 font-bold flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Terbuka setelah 3 Misi Selesai
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Hint */}
      <div className="flex items-center justify-between text-xs text-emerald-300/80 px-2">
        <span className="italic">
          *Guru dapat menggunakan tombol "Buka Semua Misi" di Mode Guru jika ingin mendemonstrasikan pos tertentu.
        </span>
        <button
          onClick={onOpenTeacherGuide}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline cursor-pointer"
        >
          <BookOpen className="h-3.5 w-3.5" /> Buka Panduan Guru
        </button>
      </div>
    </div>
  );
};
