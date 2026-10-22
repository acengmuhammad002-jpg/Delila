import React, { useState } from 'react';
import { ORGANISMS } from '../../data/ecosystemData';
import { Organism, CategoryType, TrophicRole } from '../../types/ecosystem';
import { OrganismCard } from '../OrganismCard';
import { CharacterGuide } from '../CharacterGuide';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Eye, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';

interface Mission1ScreenProps {
  onComplete: (score: number) => void;
  onBackToMap: () => void;
}

export const Mission1Screen: React.FC<Mission1ScreenProps> = ({
  onComplete,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'eksplorasi' | 'klasifikasi' | 'kuis'>('eksplorasi');
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(ORGANISMS[0]);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>(['padi']);

  // Classification Challenge State (Biotik vs Abiotik)
  const [classifications, setClassifications] = useState<Record<string, CategoryType | null>>({});
  const [classificationChecked, setClassificationChecked] = useState(false);
  const [classificationScore, setClassificationScore] = useState<number | null>(null);

  // Concept Questions State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const conceptQuestions = [
    {
      id: 1,
      question: 'Manakah di bawah ini yang merupakan komponen ABIOTIK (unsur tak hidup) di sawah?',
      options: ['Tanaman Padi dan Belalang', 'Katak dan Tikus Sawah', 'Cahaya Matahari, Air, dan Tanah', 'Ular Sawah dan Burung Elang'],
      correctIndex: 2,
      hint: 'Coba perhatikan apakah objek tersebut bernapas/tumbuh (makhluk hidup) atau unsur fisik lingkungan alam.',
      explanation: 'Benar sekali! Cahaya matahari, air, dan tanah adalah benda tak hidup (abiotik) yang menyediakan energi dan tempat hidup bagi makhluk hidup.',
    },
    {
      id: 2,
      question: 'Organisme manakah di sawah yang berperan sebagai PRODUSEN (penghasil makanan sendiri)?',
      options: ['Belalang Sawah', 'Tanaman Padi', 'Tikus Sawah', 'Ular Sawah'],
      correctIndex: 1,
      hint: 'Produsen adalah organisme autotrof yang melakukan fotosintesis membuat karbohidrat dengan bantuan cahaya matahari.',
      explanation: 'Tepat sekali! Tanaman padi adalah produsen. Padi menyerap energi matahari dan nutrisi tanah untuk menghasilkan daun dan bulir padi yang dimakan makhluk lain.',
    },
    {
      id: 3,
      question: 'Mengapa keberadaan tumbuhan hijau (padi) sangat penting bagi kelangsungan ekosistem sawah?',
      options: [
        'Karena padi menjadi satu-satunya sumber energi awal yang dapat dimakan oleh konsumen herbivora',
        'Karena padi memangsa hewan-hewan lain di sawah',
        'Karena padi dapat hidup tanpa sinar matahari sama sekali',
        'Karena padi dapat terbang menjauh saat ada bahaya'
      ],
      correctIndex: 0,
      hint: 'Ingat bagaimana energi matahari masuk pertama kali ke rantai makanan.',
      explanation: 'Hebat! Tumbuhan adalah gerbang utama masuknya energi matahari ke dalam dunia makhluk hidup. Tanpa produsen, seluruh konsumen tidak akan memiliki sumber makanan.',
    },
  ];

  const handleSelectOrganism = (org: Organism) => {
    sounds.playClick();
    setSelectedOrganism(org);
    if (!discoveredIds.includes(org.id)) {
      setDiscoveredIds((prev) => [...prev, org.id]);
    }
  };

  const handleAssignCategory = (orgId: string, cat: CategoryType) => {
    sounds.playClick();
    setClassifications((prev) => ({
      ...prev,
      [orgId]: cat,
    }));
    setClassificationChecked(false);
  };

  const handleCheckClassification = () => {
    sounds.playClick();
    let correct = 0;
    ORGANISMS.forEach((org) => {
      if (classifications[org.id] === org.category) {
        correct += 1;
      }
    });

    setClassificationScore(correct);
    setClassificationChecked(true);

    if (correct === ORGANISMS.length) {
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      sounds.playError();
    }
  };

  const handleCheckQuiz = () => {
    sounds.playClick();
    setQuizChecked(true);
    let allCorrect = true;
    conceptQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      sounds.playFanfare();
      setQuizFinished(true);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } else {
      sounds.playError();
    }
  };

  const handleCompleteMission = () => {
    sounds.playFanfare();
    // Award full 20 points
    onComplete(20);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-900/90 to-teal-950/90 border-2 border-emerald-500/40 shadow-xl">
        <div>
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Misi 1: Mengenal Ekosistem Sawah
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Jelajahi Alam & Temukan Peranannya
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            Klik objek untuk mengamati ciri biologisnya, lalu selesaikan tantangan klasifikasi dan kuis pemahaman!
          </p>
        </div>

        <button
          onClick={onBackToMap}
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Kembali ke Peta Misi
        </button>
      </div>

      {/* Guide Banner */}
      <CharacterGuide
        title="Kak Rimba"
        message="Selamat datang di petak sawah! Ekosistem terbentuk dari makhluk hidup (biotik) dan unsur tak hidup (abiotik). Coba klik dan amati seluruh 9 objek di bawah ini!"
        tip="Perhatikan perbedaan antara produsen pembuat makanan dan konsumen pemakan makanan!"
        mood={discoveredIds.length === ORGANISMS.length ? 'excited' : 'happy'}
      />

      {/* Stage Navigation Tabs */}
      <div className="flex rounded-2xl bg-emerald-950/70 p-1.5 border border-emerald-700/50 gap-1 overflow-x-auto">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('eksplorasi');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'eksplorasi'
              ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>1. Eksplorasi Sawah ({discoveredIds.length}/9 Ditemukan)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('klasifikasi');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'klasifikasi'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>2. Tantangan Klasifikasi</span>
          {classificationScore === ORGANISMS.length && (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-1" />
          )}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('kuis');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kuis'
              ? 'bg-cyan-400 text-emerald-950 shadow-md font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>3. Kuis Konsep Inti</span>
          {quizFinished && (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-1" />
          )}
        </button>
      </div>

      {/* TAB 1: EKSPLORASI SAWAH */}
      {activeTab === 'eksplorasi' && (
        <div className="space-y-6">
          {/* Interactive Landscape Display */}
          <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-600 select-none">
            {/* Sky, Sun & Clouds */}
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <span className="text-5xl animate-spin-slow">☀️</span>
              <div className="text-white drop-shadow text-xs font-bold">
                Matahari Sawah
              </div>
            </div>

            {/* Clouds */}
            <div className="absolute top-8 right-16 text-4xl opacity-80">☁️</div>
            <div className="absolute top-14 left-1/3 text-3xl opacity-70">☁️</div>

            {/* Mountains in background */}
            <div className="absolute bottom-28 left-0 right-0 h-32 opacity-40 pointer-events-none">
              <svg viewBox="0 0 1000 200" className="w-full h-full object-cover">
                <polygon points="0,200 200,60 400,200" fill="#047857" />
                <polygon points="300,200 550,40 800,200" fill="#065f46" />
                <polygon points="700,200 850,70 1000,200" fill="#064e3b" />
              </svg>
            </div>

            {/* Rice field terraces */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-900 via-emerald-800 to-emerald-700 border-t-4 border-amber-600/40">
              <div className="absolute inset-0 flex items-center justify-around opacity-30 text-3xl pointer-events-none">
                <span>🌾</span><span>🌾</span><span>🌾</span><span>🌾</span><span>🌾</span><span>🌾</span>
              </div>
            </div>

            {/* Hotspots for organisms */}
            {ORGANISMS.map((org) => {
              const isSelected = selectedOrganism?.id === org.id;
              const isDiscovered = discoveredIds.includes(org.id);

              return (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrganism(org)}
                  style={{ left: `${org.xPos}%`, top: `${org.yPos}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-400 text-emerald-950 scale-125 z-30 shadow-2xl ring-4 ring-amber-300'
                      : isDiscovered
                      ? 'bg-emerald-950/80 text-white hover:scale-110 hover:bg-emerald-900 z-20 shadow-lg border border-emerald-400/50'
                      : 'bg-emerald-950/90 text-white hover:scale-110 z-10 shadow border border-amber-400/80 animate-pulse'
                  }`}
                  title={`Klik untuk amati: ${org.name}`}
                >
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                    {org.emoji}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md shadow ${
                      isSelected
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-emerald-950/90 text-emerald-200'
                    }`}
                  >
                    {org.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Organism Detailed Inspector */}
          {selectedOrganism && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-500/50 shadow-2xl text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 shadow-lg shrink-0">
                  <div className="h-full w-full rounded-[22px] bg-emerald-950 flex items-center justify-center text-4xl sm:text-5xl">
                    {selectedOrganism.emoji}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        selectedOrganism.category === 'biotik'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      }`}
                    >
                      {selectedOrganism.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      • {selectedOrganism.roleLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {selectedOrganism.name}
                  </h3>
                  <p className="text-xs italic text-emerald-300">
                    {selectedOrganism.scientificName}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl leading-relaxed">
                    {selectedOrganism.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('klasifikasi');
                  }}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Lanjut ke Tantangan Klasifikasi</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Grid of all 9 items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Daftar Komponen Ekosistem Sawah (Klik untuk memeriksa)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {ORGANISMS.map((org) => {
                const isSelected = selectedOrganism?.id === org.id;
                return (
                  <OrganismCard
                    key={org.id}
                    organism={org}
                    isSelected={isSelected}
                    onSelect={() => handleSelectOrganism(org)}
                    interactive={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TANTANGAN KLASIFIKASI */}
      {activeTab === 'klasifikasi' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/40">
            <h3 className="text-base font-bold text-amber-300 mb-1">
              Tantangan: Kelompokkan Makhluk Hidup (Biotik) vs Unsur Tak Hidup (Abiotik)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Pilih tombol <strong className="text-emerald-300">BIOTIK</strong> atau <strong className="text-sky-300">ABIOTIK</strong> untuk setiap komponen di bawah ini. Setelah semua terisi, klik tombol "Periksa Klasifikasi"!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ORGANISMS.map((org) => {
              const currentChoice = classifications[org.id];
              const isChecked = classificationChecked;
              const isCorrect = isChecked && currentChoice === org.category;
              const isWrong = isChecked && currentChoice !== org.category;

              return (
                <div
                  key={org.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isCorrect
                      ? 'border-emerald-400 bg-emerald-950/70'
                      : isWrong
                      ? 'border-rose-400 bg-rose-950/30'
                      : 'border-emerald-800 bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{org.emoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{org.name}</h4>
                      <p className="text-[10px] text-emerald-300">{org.roleLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleAssignCategory(org.id, 'biotik')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currentChoice === 'biotik'
                          ? 'bg-emerald-500 text-emerald-950 shadow ring-2 ring-emerald-400'
                          : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                      }`}
                    >
                      Biotik
                    </button>
                    <button
                      onClick={() => handleAssignCategory(org.id, 'abiotik')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currentChoice === 'abiotik'
                          ? 'bg-sky-500 text-sky-950 shadow ring-2 ring-sky-400'
                          : 'bg-sky-950/60 text-sky-200 hover:bg-sky-900'
                      }`}
                    >
                      Abiotik
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Feedback Banner */}
          {classificationChecked && classificationScore !== null && (
            <div className={`p-4 rounded-2xl border-2 animate-fade-in flex items-center justify-between gap-4 ${
              classificationScore === ORGANISMS.length
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                : 'bg-amber-950/90 border-amber-400 text-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                {classificationScore === ORGANISMS.length ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="h-8 w-8 text-amber-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-black text-white">
                    {classificationScore === ORGANISMS.length
                      ? 'Luar Biasa! Semua Klasifikasi Benar (9/9)!'
                      : `Kamu menjawab benar ${classificationScore} dari 9 komponen.`}
                  </h4>
                  <p className="text-xs mt-0.5">
                    {classificationScore === ORGANISMS.length
                      ? 'Kamu sudah memahami perbedaan antara makhluk hidup (biotik) dan unsur tak hidup (abiotik).'
                      : 'Perhatikan tanda merah pada komponen yang belum tepat, lalu coba perbaiki lagi!'}
                  </p>
                </div>
              </div>

              {classificationScore === ORGANISMS.length && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('kuis');
                  }}
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span>Lanjut ke Kuis</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCheckClassification}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              Periksa Klasifikasi
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: KUIS KONSEP INTI */}
      {activeTab === 'kuis' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/40">
            <h3 className="text-base font-bold text-cyan-300 mb-1">
              3 Pertanyaan Pemahaman Harmoni Ekosistem
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Pilih jawaban terbaik bersama teman sekelas atau kelompok belajarmu.
            </p>
          </div>

          <div className="space-y-4">
            {conceptQuestions.map((q, qIdx) => {
              const selected = quizAnswers[qIdx];
              const isChecked = quizChecked;
              const isCorrect = isChecked && selected === q.correctIndex;
              const isWrong = isChecked && selected !== null && selected !== q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    isCorrect
                      ? 'border-emerald-400 bg-emerald-950/70'
                      : isWrong
                      ? 'border-rose-400 bg-rose-950/30'
                      : 'border-emerald-800 bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-400 uppercase">
                      Pertanyaan {qIdx + 1}
                    </span>
                    {isCorrect && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="h-4 w-4" /> Benar
                      </span>
                    )}
                    {isWrong && (
                      <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <X className="h-4 w-4" /> Perlu Dicoba Lagi
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                    {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selected === oIdx;
                      let btnCls = 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900 text-slate-200';
                      if (isOptionSelected) {
                        btnCls = 'border-amber-400 bg-amber-400/20 text-amber-200 font-bold ring-2 ring-amber-400/40';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            sounds.playClick();
                            setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                            setQuizChecked(false);
                          }}
                          className={`text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all cursor-pointer ${btnCls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isChecked && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-emerald-700/50 text-xs">
                      <p className="font-bold text-emerald-300">
                        {isCorrect ? '✅ Penjelasan Sains:' : '💡 Petunjuk Kak Rimba:'}
                      </p>
                      <p className="text-slate-200 mt-0.5">
                        {isCorrect ? q.explanation : q.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-300/80">
              *Jawab seluruh 3 soal untuk menyelesaikan Misi 1.
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCheckQuiz}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-emerald-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Periksa Jawaban Kuis
              </button>

              {quizFinished && (
                <button
                  onClick={handleCompleteMission}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-xl animate-bounce cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Selesaikan Pos 1 & Klaim 20 Poin!</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
