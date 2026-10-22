import React, { useState } from 'react';
import { POST_TEST_QUESTIONS } from '../../data/ecosystemData';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface PostTestScreenProps {
  onComplete: (score: number) => void;
  onBackToMap: () => void;
}

export const PostTestScreen: React.FC<PostTestScreenProps> = ({
  onComplete,
  onBackToMap,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = POST_TEST_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sounds.playSuccess();
      setCorrectCount((prev) => prev + 1);
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx + 1 < POST_TEST_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    }
  };

  const handleFinishAndShowReport = () => {
    sounds.playFanfare();
    const finalScore = Math.round((correctCount / POST_TEST_QUESTIONS.length) * 100);
    onComplete(finalScore);
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-amber-400/50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-2xl shadow">
            🎓
          </div>
          <div>
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
              Evaluasi Akhir Pembelajaran IPAS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Asesmen Pemahaman Siswa
            </h2>
          </div>
        </div>

        <button
          onClick={onBackToMap}
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-600/50 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Kembali ke Peta Misi
        </button>
      </div>

      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/50 shadow-2xl space-y-5">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60 text-xs">
            <span className="font-bold text-amber-300 uppercase tracking-wider">
              {currentQ.targetObjective}
            </span>
            <span className="font-black px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300">
              Soal {currentIdx + 1} dari {POST_TEST_QUESTIONS.length}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              let btnCls = 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900/70 text-slate-200';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnCls = 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold';
                } else if (idx === selectedOption) {
                  btnCls = 'border-rose-400 bg-rose-500/20 text-rose-200';
                } else {
                  btnCls = 'border-emerald-900/40 bg-emerald-950/20 opacity-40 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${btnCls}`}
                >
                  <span className="font-medium">{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-700/60 text-xs sm:text-sm animate-fade-in">
              <strong className="text-emerald-300 block mb-1">
                {selectedOption === currentQ.correctIndex ? '✅ Jawaban Benar!' : '💡 Pembahasan Konsep:'}
              </strong>
              <p className="text-slate-200 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-3">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <span>{currentIdx + 1 < POST_TEST_QUESTIONS.length ? 'Soal Selanjutnya' : 'Selesaikan Asesmen & Buka Rapor'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Summary Screen before Report */
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-emerald-950 border-2 border-amber-400 text-center space-y-6 shadow-2xl">
          <div className="h-24 w-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-emerald-950 flex items-center justify-center text-5xl shadow-xl animate-bounce">
            🏆
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Asesmen Akhir Berhasil Diselesaikan!
          </h3>

          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Hebat sekali! Kamu telah membuktikan pemahamanmu tentang harmoni dan keseimbangan ekosistem sawah.
          </p>

          <div className="inline-block p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/50 shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
              Skor Asesmen Akhir:
            </span>
            <span className="text-5xl font-black text-amber-300">
              {Math.round((correctCount / POST_TEST_QUESTIONS.length) * 100)}
            </span>
            <span className="text-xs text-slate-300 block mt-1">
              ({correctCount} dari {POST_TEST_QUESTIONS.length} pertanyaan dijawab dengan tepat)
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Ulangi Asesmen
            </button>

            <button
              onClick={handleFinishAndShowReport}
              className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-5 w-5" />
              <span>Buka Rapor Lengkap Penjaga Ekosistem</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
