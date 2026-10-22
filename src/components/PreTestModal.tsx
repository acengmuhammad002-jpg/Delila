import React, { useState } from 'react';
import { PRE_TEST_QUESTIONS } from '../data/ecosystemData';
import { sounds } from '../utils/soundEffects';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const PreTestModal: React.FC<PreTestModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PRE_TEST_QUESTIONS[currentIdx];

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
    if (currentIdx + 1 < PRE_TEST_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleFinishAndStart = () => {
    sounds.playClick();
    const finalScore = Math.round((correctCount / PRE_TEST_QUESTIONS.length) * 100);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 p-6 sm:p-8 shadow-2xl text-slate-100">
        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Asesmen Awal (Pre-Test)
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Mari menguji pemahaman awal sebelum memulai petualangan!
                  </p>
                </div>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-900 border border-emerald-600/50 text-emerald-300">
                Soal {currentIdx + 1} dari {PRE_TEST_QUESTIONS.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="my-5">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                {currentQ.targetObjective}
              </span>
              <h4 className="mt-1 text-base sm:text-lg font-bold text-slate-100 leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900/60 hover:border-emerald-500 text-slate-200';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-400 bg-rose-500/20 text-rose-200';
                  } else {
                    btnStyle = 'border-emerald-900/40 bg-emerald-950/20 opacity-50 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="text-sm font-medium">{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Feedback */}
            {isAnswered && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-600/40 animate-fade-in">
                <p className="text-xs text-emerald-300 font-bold mb-1">
                  {selectedOption === currentQ.correctIndex ? '✅ Jawaban Benar!' : '💡 Penjelasan Ilmiah:'}
                </p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-800/60">
              <button
                onClick={onClose}
                className="text-xs text-emerald-300/80 hover:text-white underline cursor-pointer"
              >
                Lewati Asesmen Awal
              </button>

              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  {currentIdx + 1 < PRE_TEST_QUESTIONS.length ? 'Soal Berikutnya' : 'Lihat Hasil Pre-Test'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center py-4 space-y-4">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-amber-400 text-emerald-950 flex items-center justify-center text-4xl shadow-xl">
              <Award className="h-10 w-10 text-emerald-950" />
            </div>

            <h3 className="text-2xl font-black text-white">
              Asesmen Awal Selesai!
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Kamu menjawab benar <strong className="text-amber-300">{correctCount}</strong> dari <strong className="text-amber-300">{PRE_TEST_QUESTIONS.length}</strong> pertanyaan awal.
            </p>

            <div className="inline-block p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-center">
              <span className="text-xs text-emerald-300 font-bold uppercase block">Nilai Awal</span>
              <span className="text-4xl font-black text-amber-300">
                {Math.round((correctCount / PRE_TEST_QUESTIONS.length) * 100)}
              </span>
              <span className="text-xs text-slate-300 block mt-1">
                Jangan khawatir, kamu akan mempelajari semua konsep ini di 3 misi seru!
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ulangi
              </button>
              <button
                onClick={handleFinishAndStart}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-xl cursor-pointer"
              >
                Masuk ke Peta Misi
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
