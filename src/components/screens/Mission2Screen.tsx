import React, { useState } from 'react';
import { ORGANISMS, FOOD_CONNECTIONS, FOOD_CHAINS } from '../../data/ecosystemData';
import { Organism, FoodConnection } from '../../types/ecosystem';
import { CharacterGuide } from '../CharacterGuide';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Share2, 
  Plus, 
  Trash2, 
  AlertCircle,
  Zap,
  Shuffle
} from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Ensure it's not accidentally identical to the default order
  return shuffled;
}

interface Mission2ScreenProps {
  onComplete: (score: number) => void;
  onBackToMap: () => void;
}

export const Mission2Screen: React.FC<Mission2ScreenProps> = ({
  onComplete,
  onBackToMap,
}) => {
  const [activeLevel, setActiveLevel] = useState<'level1' | 'level2'>('level1');

  // LEVEL 1: Rantai Makanan Builder
  const [selectedChainIdx, setSelectedChainIdx] = useState(0);
  const currentChainTarget = FOOD_CHAINS[selectedChainIdx];
  const [chainSlots, setChainSlots] = useState<(string | null)[]>(
    new Array(currentChainTarget.sequence.length).fill(null)
  );
  const [level1Success, setLevel1Success] = useState(false);
  const [level1Feedback, setLevel1Feedback] = useState<string | null>(null);

  // Biological biotic organisms eligible for food chains in sawah - SHUFFLED / DIACAK!
  const [shuffledPool, setShuffledPool] = useState<Organism[]>(() =>
    shuffleArray(ORGANISMS.filter((o) => o.category === 'biotik'))
  );

  const handleShuffleOrganisms = () => {
    sounds.playClick();
    setShuffledPool(shuffleArray(ORGANISMS.filter((o) => o.category === 'biotik')));
  };

  // LEVEL 2: Jaring-Jaring Makanan Builder
  // User created connections: array of { fromId: string, toId: string }
  const [userConnections, setUserConnections] = useState<{ fromId: string; toId: string }[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [webChecked, setWebChecked] = useState(false);
  const [webResult, setWebResult] = useState<{
    correctLinks: { fromId: string; toId: string }[];
    missingLinks: FoodConnection[];
    wrongLinks: { fromId: string; toId: string; reason: string }[];
  } | null>(null);
  const [level2Success, setLevel2Success] = useState(false);

  // --- LEVEL 1 HANDLERS ---
  const handleSelectOrganismForSlot = (orgId: string) => {
    sounds.playClick();
    // Find first empty slot
    const emptyIndex = chainSlots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      const nextSlots = [...chainSlots];
      nextSlots[emptyIndex] = orgId;
      setChainSlots(nextSlots);
      setLevel1Feedback(null);
    }
  };

  const handleClearSlot = (index: number) => {
    sounds.playClick();
    const nextSlots = [...chainSlots];
    nextSlots[index] = null;
    setChainSlots(nextSlots);
    setLevel1Feedback(null);
  };

  const handleResetLevel1 = () => {
    sounds.playClick();
    setChainSlots(new Array(currentChainTarget.sequence.length).fill(null));
    setLevel1Feedback(null);
    setLevel1Success(false);
    setShuffledPool(shuffleArray(ORGANISMS.filter((o) => o.category === 'biotik')));
  };

  const handleCheckChain = () => {
    sounds.playClick();
    const isFull = chainSlots.every((s) => s !== null);
    if (!isFull) {
      setLevel1Feedback('Harap lengkapi semua posisi rantai makanan terlebih dahulu!');
      sounds.playError();
      return;
    }

    const isMatch = chainSlots.every((slot, idx) => slot === currentChainTarget.sequence[idx]);

    if (isMatch) {
      sounds.playSuccess();
      setLevel1Success(true);
      setLevel1Feedback('Luar biasa! Rantai makanan tersusun dengan urutan dan aliran energi yang sempurna!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      sounds.playError();
      // Provide intelligent feedback
      if (chainSlots[0] !== 'padi') {
        setLevel1Feedback('Ingat: Rantai makanan di sawah harus selalu diawali oleh produsen (Padi) sebagai sumber energi utama!');
      } else if (chainSlots[chainSlots.length - 1] !== 'elang') {
        setLevel1Feedback('Ingat: Posisi paling akhir ditempati oleh konsumen puncak (Elang).');
      } else {
        setLevel1Feedback('Ada urutan pemangsaan yang keliru. Perhatikan arah panah: Organisme dimakan ➔ Organisme yang memakan!');
      }
    }
  };

  const handleSwitchChainTarget = (idx: number) => {
    sounds.playClick();
    setSelectedChainIdx(idx);
    setChainSlots(new Array(FOOD_CHAINS[idx].sequence.length).fill(null));
    setLevel1Feedback(null);
    setLevel1Success(false);
    setShuffledPool(shuffleArray(ORGANISMS.filter((o) => o.category === 'biotik')));
  };

  // --- LEVEL 2 HANDLERS ---
  const handleNodeClick = (id: string) => {
    sounds.playClick();
    if (!selectedSourceId) {
      setSelectedSourceId(id);
    } else {
      if (selectedSourceId === id) {
        setSelectedSourceId(null);
        return;
      }
      // Add connection from selectedSourceId (makanan) to id (pemakan)
      const exists = userConnections.some(
        (c) => c.fromId === selectedSourceId && c.toId === id
      );
      if (exists) {
        // Toggle remove
        setUserConnections((prev) =>
          prev.filter((c) => !(c.fromId === selectedSourceId && c.toId === id))
        );
      } else {
        setUserConnections((prev) => [...prev, { fromId: selectedSourceId, toId: id }]);
      }
      setSelectedSourceId(null);
      setWebChecked(false);
    }
  };

  const handleRemoveConnection = (fromId: string, toId: string) => {
    sounds.playClick();
    setUserConnections((prev) =>
      prev.filter((c) => !(c.fromId === fromId && c.toId === toId))
    );
    setWebChecked(false);
  };

  const handleResetLevel2 = () => {
    sounds.playClick();
    setUserConnections([]);
    setSelectedSourceId(null);
    setWebChecked(false);
    setWebResult(null);
    setLevel2Success(false);
  };

  const handleCheckWeb = () => {
    sounds.playClick();
    const correctLinks: { fromId: string; toId: string }[] = [];
    const wrongLinks: { fromId: string; toId: string; reason: string }[] = [];

    userConnections.forEach((conn) => {
      const isValid = FOOD_CONNECTIONS.some(
        (fc) => fc.fromId === conn.fromId && fc.toId === conn.toId
      );
      if (isValid) {
        correctLinks.push(conn);
      } else {
        // Find if backwards
        const isBackwards = FOOD_CONNECTIONS.some(
          (fc) => fc.fromId === conn.toId && fc.toId === conn.fromId
        );
        const fromName = ORGANISMS.find((o) => o.id === conn.fromId)?.name || conn.fromId;
        const toName = ORGANISMS.find((o) => o.id === conn.toId)?.name || conn.toId;

        if (isBackwards) {
          wrongLinks.push({
            ...conn,
            reason: `Arah panah terbalik! ${toName} memakan ${fromName}, bukan sebaliknya. Panah harus dari makanan ➔ pemakan.`,
          });
        } else {
          wrongLinks.push({
            ...conn,
            reason: `${toName} tidak memakan ${fromName} dalam model ekosistem sawah ini.`,
          });
        }
      }
    });

    const missingLinks = FOOD_CONNECTIONS.filter((fc) => {
      return !userConnections.some((uc) => uc.fromId === fc.fromId && uc.toId === fc.toId);
    });

    setWebResult({ correctLinks, missingLinks, wrongLinks });
    setWebChecked(true);

    if (wrongLinks.length === 0 && missingLinks.length <= 1) {
      sounds.playFanfare();
      setLevel2Success(true);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } else {
      sounds.playError();
    }
  };

  const handleAutoConnectTemplate = () => {
    sounds.playClick();
    setUserConnections(FOOD_CONNECTIONS.map((fc) => ({ fromId: fc.fromId, toId: fc.toId })));
    setWebChecked(false);
  };

  const handleFinishMission2 = () => {
    sounds.playFanfare();
    // Award 45 points (20 for level 1 + 25 for level 2)
    onComplete(45);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-emerald-900/90 to-amber-950/90 border-2 border-amber-500/40 shadow-xl">
        <div>
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            Misi 2: Merangkai Hubungan Makanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Rantai Makanan & Jaring-Jaring Kehidupan
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
            Pelajari arah aliran energi: Panah menunjukkan siapa yang dimakan menuju siapa yang memakan!
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
        message="Arah panah pada rantai makanan sangat penting! Ingat prinsip emas: Panah selalu menunjuk dari Makanan ➔ Pemakan, melambangkan perpindahan energi!"
        tip="Padi memberi energi ke Belalang/Tikus, lalu diteruskan ke predator di atasnya!"
        mood="excited"
      />

      {/* Level Tabs */}
      <div className="flex rounded-2xl bg-emerald-950/70 p-1.5 border border-emerald-700/50 gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveLevel('level1');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLevel === 'level1'
              ? 'bg-amber-400 text-emerald-950 shadow font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Tingkat 1: Menyusun Rantai Makanan (20 Poin)</span>
          {level1Success && <CheckCircle2 className="h-4 w-4 text-emerald-700 ml-1" />}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveLevel('level2');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLevel === 'level2'
              ? 'bg-emerald-400 text-emerald-950 shadow font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Tingkat 2: Merangkai Jaring-Jaring Makanan (25 Poin)</span>
          {level2Success && <CheckCircle2 className="h-4 w-4 text-emerald-700 ml-1" />}
        </button>
      </div>

      {/* ================= LEVEL 1: RANTAI MAKANAN BUILDER ================= */}
      {activeLevel === 'level1' && (
        <div className="space-y-6">
          {/* Target Chain Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-300 uppercase">Pilih Tantangan Rantai:</span>
            {FOOD_CHAINS.map((chain, idx) => (
              <button
                key={chain.id}
                onClick={() => handleSwitchChainTarget(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedChainIdx === idx
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                    : 'bg-emerald-950/70 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-900'
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>

          {/* Interactive Chain Assembly Slots */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 border-2 border-emerald-500/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  Susun Urutan {currentChainTarget.name}
                </h3>
                <p className="text-xs text-emerald-300">
                  Klik kartu organisme di bawah untuk mengisi slot dari kiri ke kanan.
                </p>
              </div>

              <button
                onClick={handleResetLevel1}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Atur Ulang
              </button>
            </div>

            {/* Slots with directional arrows */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4 overflow-x-auto">
              {chainSlots.map((slotId, index) => {
                const org = slotId ? ORGANISMS.find((o) => o.id === slotId) : null;
                const isLast = index === chainSlots.length - 1;

                return (
                  <React.Fragment key={index}>
                    <div
                      onClick={() => slotId && handleClearSlot(index)}
                      className={`relative w-28 h-32 sm:w-32 sm:h-36 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                        org
                          ? 'bg-emerald-900/90 border-emerald-400 text-white shadow-lg hover:scale-105'
                          : 'bg-emerald-950/40 border-dashed border-emerald-700/60 text-emerald-400/50 hover:border-emerald-500'
                      }`}
                    >
                      {org ? (
                        <>
                          <span className="text-3xl sm:text-4xl">{org.emoji}</span>
                          <span className="mt-1 text-xs font-extrabold text-white leading-tight">
                            {org.name}
                          </span>
                          <span className="text-[9px] text-emerald-300">{org.roleLabel}</span>
                          <span className="absolute top-1 right-1 text-[10px] text-rose-400 font-bold hover:scale-125">
                            ✕
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-emerald-400/60">Posisi {index + 1}</span>
                          <span className="text-[10px] text-emerald-500/40">Klik Organisme</span>
                        </div>
                      )}
                    </div>

                    {!isLast && (
                      <div className="flex flex-col items-center px-1">
                        <ArrowRight className="h-6 w-6 text-amber-400 animate-pulse stroke-[3]" />
                        <span className="text-[9px] font-bold text-amber-300 uppercase hidden sm:block">
                          Energi
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Educational Arrow Explanation Box */}
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-600/40 flex items-center gap-2 text-xs text-emerald-200">
              <span className="text-amber-400 text-base font-bold">ℹ️</span>
              <span>
                <strong>Prinsip Ilmiah:</strong> Tanda panah (➔) menunjukkan arah perpindahan energi dari organisme yang dimakan menuju organisme yang memakannya.
              </span>
            </div>

            {/* Feedback Message */}
            {level1Feedback && (
              <div className={`p-4 rounded-2xl border-2 text-xs sm:text-sm animate-fade-in flex items-center gap-3 ${
                level1Success
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                  : 'bg-amber-950/90 border-amber-400 text-amber-200'
              }`}>
                {level1Success ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-400 shrink-0" />
                )}
                <p className="font-semibold">{level1Feedback}</p>
              </div>
            )}

            {/* Check Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCheckChain}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Periksa Rantai Makanan
              </button>

              {level1Success && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveLevel('level2');
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-xl animate-bounce cursor-pointer"
                >
                  <span>Lanjut ke Jaring-Jaring Makanan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Organism Selector Pool - SHUFFLED / DIACAK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Pilihan Organisme Sawah (Urutan Diacak - Klik untuk mengisi slot rantai)
              </h4>
              <button
                onClick={handleShuffleOrganisms}
                className="px-3 py-1 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 shadow transition-colors cursor-pointer"
                title="Acak ulang posisi kartu organisme"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Acak Ulang Posisi</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {shuffledPool.map((org) => {
                const isAlreadyUsed = chainSlots.includes(org.id);
                return (
                  <button
                    key={org.id}
                    disabled={isAlreadyUsed}
                    onClick={() => handleSelectOrganismForSlot(org.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                      isAlreadyUsed
                        ? 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                        : 'border-emerald-700/60 bg-emerald-950/70 hover:bg-emerald-900/90 hover:border-emerald-400 hover:scale-105 shadow-md'
                    }`}
                  >
                    <span className="text-3xl">{org.emoji}</span>
                    <span className="mt-1 text-xs font-black text-white">{org.name}</span>
                    <span className="text-[10px] text-emerald-300">{org.roleLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= LEVEL 2: JARING-JARING MAKANAN BUILDER ================= */}
      {activeLevel === 'level2' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-emerald-300 mb-1">
                Tantangan: Hubungkan Semua Rantai Menjadi Jaring-Jaring Makanan
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Langkah 1: Klik <strong className="text-amber-300">Organisme Makanan</strong>. Langkah 2: Klik <strong className="text-emerald-300">Organisme Pemakannya</strong> untuk membuat panah aliran energi!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAutoConnectTemplate}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                title="Bantuan: Hubungkan model sawah otomatis"
              >
                Bantuan Model
              </button>
              <button
                onClick={handleResetLevel2}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Interactive Visual Network Canvas */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 border-2 border-emerald-500/50 shadow-2xl min-h-[380px] flex flex-col justify-between select-none">
            {/* Instruction Banner inside network */}
            <div className="text-center text-xs text-emerald-300/80 mb-4">
              {selectedSourceId ? (
                <span className="font-bold text-amber-300 animate-pulse">
                  Sekarang klik organisme pemakan untuk {ORGANISMS.find((o) => o.id === selectedSourceId)?.name}!
                </span>
              ) : (
                <span>Klik salah satu organisme sebagai sumber energi (makanan)</span>
              )}
            </div>

            {/* Organism Nodes Grid - Shuffled */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {shuffledPool.map((org) => {
                const isSelected = selectedSourceId === org.id;
                // Count how many links go out of this org (foods) or into it
                const outgoing = userConnections.filter((c) => c.fromId === org.id).length;
                const incoming = userConnections.filter((c) => c.toId === org.id).length;

                return (
                  <button
                    key={org.id}
                    onClick={() => handleNodeClick(org.id)}
                    className={`p-3.5 rounded-2xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/50 scale-105 shadow-xl'
                        : 'border-emerald-700/60 bg-emerald-900/60 hover:bg-emerald-800 hover:border-emerald-400 shadow-md'
                    }`}
                  >
                    <span className="text-4xl">{org.emoji}</span>
                    <span className="mt-1.5 text-xs font-black text-white">{org.name}</span>
                    <span className="text-[10px] text-emerald-300">{org.roleLabel}</span>

                    {/* Connection Badges */}
                    <div className="mt-2 flex items-center gap-1 text-[9px] font-bold">
                      {outgoing > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" title="Memberi energi">
                          Dimakan: {outgoing}
                        </span>
                      )}
                      {incoming > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40" title="Menerima energi">
                          Memakan: {incoming}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* List of Connected Relationships */}
            <div className="mt-6 pt-4 border-t border-emerald-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center justify-between">
                <span>Hubungan Aliran Energi yang Telah Dibuat ({userConnections.length}):</span>
                <span className="text-[10px] text-emerald-400 normal-case font-medium">
                  Klik tanda ✕ untuk menghapus hubungan
                </span>
              </h4>

              {userConnections.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-dashed border-emerald-800 text-center text-xs text-slate-400">
                  Belum ada hubungan. Klik organisme makanan lalu klik pemakannya untuk membuat panah!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userConnections.map((conn, idx) => {
                    const fromOrg = ORGANISMS.find((o) => o.id === conn.fromId);
                    const toOrg = ORGANISMS.find((o) => o.id === conn.toId);

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-500/40 text-xs font-bold text-white shadow"
                      >
                        <span>{fromOrg?.emoji} {fromOrg?.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                        <span>{toOrg?.emoji} {toOrg?.name}</span>
                        <button
                          onClick={() => handleRemoveConnection(conn.fromId, conn.toId)}
                          className="ml-1 p-0.5 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Hapus hubungan ini"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scientific Validation Results */}
            {webChecked && webResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/50 space-y-3 animate-fade-in text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Hasil Evaluasi Jaring-Jaring Makanan:
                  </h4>
                  <span className="text-xs font-bold text-amber-300">
                    Benar: {webResult.correctLinks.length} | Salah: {webResult.wrongLinks.length} | Belum: {webResult.missingLinks.length}
                  </span>
                </div>

                {webResult.wrongLinks.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 space-y-1">
                    <strong className="block font-bold">⚠️ Hubungan yang Kurang Tepat:</strong>
                    {webResult.wrongLinks.map((wl, i) => (
                      <p key={i}>• {wl.reason}</p>
                    ))}
                  </div>
                )}

                {webResult.missingLinks.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 space-y-1">
                    <strong className="block font-bold">💡 Hubungan yang Belum Ditemukan:</strong>
                    {webResult.missingLinks.map((ml, i) => (
                      <p key={i}>• {ml.label} (Coba hubungkan {ml.fromId} ➔ {ml.toId})</p>
                    ))}
                  </div>
                )}

                {webResult.wrongLinks.length === 0 && webResult.missingLinks.length === 0 && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200">
                    🎉 Luar biasa! Seluruh jaring-jaring makanan sawah telah terhubung dengan tepat dan akurat secara sains!
                  </div>
                )}
              </div>
            )}

            {/* Check Button */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={handleCheckWeb}
                className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Periksa Jaring-Jaring Makanan
              </button>

              {level2Success && (
                <button
                  onClick={handleFinishMission2}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-xl animate-bounce cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Selesaikan Pos 2 & Klaim 45 Poin!</span>
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
