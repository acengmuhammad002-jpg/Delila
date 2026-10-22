import React, { useState } from 'react';
import { GameProgress } from '../../types/ecosystem';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  TrendingUp, 
  RotateCcw, 
  Printer, 
  BookOpen, 
  Star, 
  Sparkles,
  Map,
  ShieldCheck,
  Users,
  Trophy,
  History,
  Check
} from 'lucide-react';

interface ReportScreenProps {
  progress: GameProgress;
  onSaveAndResetForNextGroup: (awardTitle: string) => void;
  onRestartGame: () => void;
  onNavigateToMap: () => void;
  onOpenTeacherGuide: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  progress,
  onSaveAndResetForNextGroup,
  onRestartGame,
  onNavigateToMap,
  onOpenTeacherGuide,
}) => {
  const totalScore = progress.totalScore;
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Determine award tier
  let awardTitle = 'Calon Penjaga Ekosistem';
  let awardBadge = '🌱';
  let awardColor = 'from-slate-400 to-emerald-500';
  let awardMessage = 'Awal yang baik! Kamu sudah mulai mengenal sawah. Teruslah mengamati alam dan temukan bagaimana makhluk hidup saling membutuhkan!';

  if (totalScore >= 90) {
    awardTitle = 'Penjaga Ekosistem Ahli';
    awardBadge = '👑';
    awardColor = 'from-amber-400 via-yellow-300 to-amber-500';
    awardMessage = 'Luar biasa! Pemahamanmu tentang aliran energi, jaring-jaring makanan, dan simulasi sebab-akibat sangat matang. Kamu layak menjadi teladan penjaga alam!';
  } else if (totalScore >= 75) {
    awardTitle = 'Penjaga Ekosistem Hebat';
    awardBadge = '🌟';
    awardColor = 'from-emerald-400 to-teal-500';
    awardMessage = 'Hebat sekali! Kamu memahami dengan baik bagaimana keseimbangan ekosistem bekerja dan mampu memprediksi dampak perubahan populasi dengan tepat!';
  } else if (totalScore >= 60) {
    awardTitle = 'Penjelajah Ekosistem';
    awardBadge = '🧭';
    awardColor = 'from-blue-400 to-cyan-500';
    awardMessage = 'Bagus! Kamu telah menjelajahi sawah dan memahami peran produsen serta konsumen. Sedikit latihan lagi untuk menguasai jaring-jaring makanan secara sempurna!';
  }

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleSaveAndNewGroup = () => {
    sounds.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setShowSavedFeedback(true);
    setTimeout(() => {
      onSaveAndResetForNextGroup(awardTitle);
    }, 1200);
  };

  const currentGroupName = progress.groupName || 'Kelompok Siswa';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in print:p-0 print:m-0">
      {/* Certificate / Award Hero */}
      <div className="relative overflow-hidden rounded-3xl border-3 border-amber-400 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 p-6 sm:p-10 shadow-2xl text-center space-y-4">
        <div className="absolute top-3 right-3 flex gap-1 opacity-40">
          <Star className="h-6 w-6 text-amber-400 fill-current" />
          <Star className="h-6 w-6 text-amber-400 fill-current" />
          <Star className="h-6 w-6 text-amber-400 fill-current" />
        </div>

        <div className={`h-24 w-24 mx-auto rounded-3xl bg-gradient-to-tr ${awardColor} flex items-center justify-center text-5xl shadow-xl`}>
          {awardBadge}
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            Sertifikat Pencapaian IPAS Kelas V SD
          </span>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-sm font-bold">
            <Users className="h-4 w-4" />
            <span>Dianugerahkan kepada: <strong className="text-white font-black">{currentGroupName}</strong></span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            {awardTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
            {awardMessage}
          </p>
        </div>

        {/* Big Total Score Display */}
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-emerald-900/60 border border-emerald-500/50 shadow-inner">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">
              Skor Total Petualangan:
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-300">
              {totalScore} <span className="text-sm font-normal text-slate-300">/ 100 Poin</span>
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mission Score Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-700/50 space-y-3">
          <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Rincian Skor Tiap Misi
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
              <span className="text-slate-200 font-semibold">Pos 1: Mengenal Ekosistem</span>
              <strong className="text-amber-300 font-black">{progress.mission1Score} / 20 Poin</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
              <span className="text-slate-200 font-semibold">Pos 2: Rantai & Jaring-Jaring</span>
              <strong className="text-amber-300 font-black">{progress.mission2Score} / 45 Poin</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
              <span className="text-slate-200 font-semibold">Pos 3: Simulasi & Solusi Ekologis</span>
              <strong className="text-amber-300 font-black">{progress.mission3Score} / 35 Poin</strong>
            </div>
          </div>
        </div>

        {/* Pre-Test vs Post-Test Comparison */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 space-y-3">
          <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Perbandingan Asesmen Awal & Akhir
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800">
              <span className="text-[10px] text-slate-400 font-bold block">Pre-Test (Awal)</span>
              <span className="text-2xl font-black text-white">
                {progress.preTestCompleted ? progress.preTestScore : 'Belum diisi'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-amber-500/50">
              <span className="text-[10px] text-amber-300 font-bold block">Post-Test (Akhir)</span>
              <span className="text-2xl font-black text-amber-300">
                {progress.postTestCompleted ? progress.postTestScore : 'Belum diisi'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 italic">
            *Hasil perbandingan ini digunakan untuk melihat perkembangan penalaran konsep dan refleksi kelas.
          </p>
        </div>
      </div>

      {/* Papan Riwayat Skor Kelompok Sebelumnya (Leaderboard) */}
      {progress.groupRecords && progress.groupRecords.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-400/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Papan Riwayat Skor Kelompok Kelas ({progress.groupRecords.length} Kelompok Tersimpan)
            </h3>
            <span className="text-xs text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-600/40 font-bold">
              Data Tersimpan Aman
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {progress.groupRecords.map((rec, idx) => (
              <div
                key={rec.id || idx}
                className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-7 w-7 rounded-xl font-black flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-amber-400 text-emerald-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-sm">{rec.groupName}</h5>
                    <p className="text-[10px] text-emerald-300">{rec.awardTitle} • {rec.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300">{rec.totalScore}</span>
                    <span className="text-[10px] text-slate-400 block">/ 100 Poin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mastered Concepts & Review Recommendations */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-600/40 space-y-4">
        <h3 className="text-base font-black text-white">
          Analisis Penguasaan Materi (IPAS Harmoni Ekosistem)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-2">
            <span className="text-emerald-300 font-bold uppercase flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Konsep yang Sudah Dikuasai:
            </span>
            <ul className="space-y-1.5 text-slate-200">
              <li>✓ Membedakan komponen biotik dan abiotik sawah.</li>
              <li>✓ Peran produsen (padi) sebagai fondasi aliran energi.</li>
              <li>✓ Arah panah perpindahan energi dari mangsa ke pemangsa.</li>
              <li>✓ Hubungan ketergantungan antarorganisme dalam jaring makanan.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
            <span className="text-amber-300 font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" /> Saran Aktivitas Tindak Lanjut:
            </span>
            <ul className="space-y-1.5 text-slate-200">
              <li>• Diskusikan di kelas mengapa burung hantu dan ular sawah sahabat petani.</li>
              <li>• Buat poster kampanye perlindungan predator sawah di mading sekolah.</li>
              <li>• Amati lingkungan sekitar sekolah: temukan 1 contoh produsen dan konsumen lokal.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Notification on Save */}
      {showSavedFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-emerald-950 font-black text-center text-sm shadow-xl flex items-center justify-center gap-2 animate-bounce">
          <Check className="h-5 w-5" />
          <span>Skor Kelompok "{currentGroupName}" Berhasil Disimpan! Memuat Ulang untuk Kelompok Berikutnya...</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToMap}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-700/50 cursor-pointer"
          >
            <Map className="h-4 w-4" />
            <span>Peta Petualangan</span>
          </button>

          <button
            onClick={onOpenTeacherGuide}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/40 cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>Panduan Guru</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Rapor</span>
          </button>
        </div>

        {/* Primary Reset & Save for Next Group Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAndNewGroup}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all ring-4 ring-amber-400/40 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 stroke-[3]" />
            <span>Muat Ulang Media (Simpan Skor & Mainkan Kelompok Baru)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
