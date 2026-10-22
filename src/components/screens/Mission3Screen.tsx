import React, { useState } from 'react';
import { 
  ORGANISMS, 
  SIMULATION_SCENARIOS, 
  ECOLOGICAL_SOLUTIONS, 
  POPULATION_LABELS, 
  POPULATION_LEVEL_ORDER 
} from '../../data/ecosystemData';
import { PopulationLevel, SimulationScenario, EcologicalSolution } from '../../types/ecosystem';
import { simulateNextStep, SimulationResult } from '../../utils/simulationEngine';
import { CharacterGuide } from '../CharacterGuide';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity,
  Layers,
  Leaf
} from 'lucide-react';

interface Mission3ScreenProps {
  onComplete: (score: number) => void;
  onBackToMap: () => void;
}

export const Mission3Screen: React.FC<Mission3ScreenProps> = ({
  onComplete,
  onBackToMap,
}) => {
  const [mode, setMode] = useState<'skenario' | 'sandbox' | 'solusi'>('skenario');

  // Scenario Mode State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const currentScenario = SIMULATION_SCENARIOS[selectedScenarioIdx];

  const [scenarioStep, setScenarioStep] = useState<'prediksi' | 'hasil' | 'refleksi'>('prediksi');
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [scenarioPopulations, setScenarioPopulations] = useState<Record<string, PopulationLevel>>(
    currentScenario.initialPopulations
  );
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [scenarioCompletedMap, setScenarioCompletedMap] = useState<Record<string, boolean>>({});

  // Sandbox Mode State
  const [sandboxPopulations, setSandboxPopulations] = useState<Record<string, PopulationLevel>>({
    padi: 'sedang',
    belalang: 'sedang',
    tikus: 'sedang',
    katak: 'sedang',
    ular: 'sedang',
    elang: 'sedang',
  });
  const [sandboxHistory, setSandboxHistory] = useState<SimulationResult[]>([]);
  const [currentSandboxResult, setCurrentSandboxResult] = useState<SimulationResult | null>(null);
  const [seasonCount, setSeasonCount] = useState(0);

  // Ecological Solutions State
  const [selectedSolution, setSelectedSolution] = useState<EcologicalSolution | null>(null);
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  const [solutionScore, setSolutionScore] = useState(0);

  // --- SCENARIO HANDLERS ---
  const handleSelectScenario = (idx: number) => {
    sounds.playClick();
    setSelectedScenarioIdx(idx);
    setScenarioStep('prediksi');
    setSelectedPredictionId(null);
    setScenarioPopulations(SIMULATION_SCENARIOS[idx].initialPopulations);
  };

  const handleSelectPrediction = (id: string) => {
    sounds.playClick();
    setSelectedPredictionId(id);
  };

  const handleRunScenarioSimulation = () => {
    if (!selectedPredictionId) {
      sounds.playError();
      return;
    }
    sounds.playSimulationRun();
    setSimulationRunning(true);

    setTimeout(() => {
      setScenarioPopulations(currentScenario.expectedSimulatedPopulations);
      setSimulationRunning(false);
      setScenarioStep('hasil');
      sounds.playSuccess();
      setScenarioCompletedMap((prev) => ({
        ...prev,
        [currentScenario.id]: true,
      }));
    }, 800);
  };

  const handleResetScenario = () => {
    sounds.playClick();
    setScenarioPopulations(currentScenario.initialPopulations);
    setScenarioStep('prediksi');
    setSelectedPredictionId(null);
  };

  // --- SANDBOX HANDLERS ---
  const handleSandboxChangePop = (organismId: string, level: PopulationLevel) => {
    sounds.playClick();
    setSandboxPopulations((prev) => ({
      ...prev,
      [organismId]: level,
    }));
  };

  const handleRunSandboxStep = () => {
    sounds.playSimulationRun();
    const result = simulateNextStep(sandboxPopulations);
    setCurrentSandboxResult(result);
    setSandboxPopulations(result.nextPopulations);
    setSandboxHistory((prev) => [result, ...prev.slice(0, 4)]);
    setSeasonCount((prev) => prev + 1);

    if (result.healthStatus === 'Harmonis & Seimbang') {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const handleResetSandbox = () => {
    sounds.playClick();
    setSandboxPopulations({
      padi: 'sedang',
      belalang: 'sedang',
      tikus: 'sedang',
      katak: 'sedang',
      ular: 'sedang',
      elang: 'sedang',
    });
    setCurrentSandboxResult(null);
    setSandboxHistory([]);
    setSeasonCount(0);
  };

  // --- SOLUTION HANDLERS ---
  const handleSelectSolution = (sol: EcologicalSolution) => {
    sounds.playClick();
    setSelectedSolution(sol);
    setSolutionSubmitted(false);
  };

  const handleSubmitSolution = () => {
    if (!selectedSolution) return;
    sounds.playClick();
    setSolutionSubmitted(true);
    setSolutionScore(selectedSolution.score);

    if (selectedSolution.isEcological) {
      sounds.playFanfare();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } else {
      sounds.playError();
    }
  };

  const handleFinishMission3 = () => {
    sounds.playFanfare();
    // 25 points for scenarios + solution score (up to 10 points) = max 35 points
    const finalScore = 25 + (solutionScore || 10);
    onComplete(finalScore);
  };

  const sawahOrganisms = ORGANISMS.filter((o) => o.category === 'biotik');

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-teal-950 via-emerald-950 to-blue-950 border-2 border-teal-500/40 shadow-xl">
        <div>
          <span className="text-xs font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Misi 3: Menyelamatkan Keseimbangan (Simulasi Utama)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Laboratorium Simulasi Sebab-Akibat
          </h2>
          <p className="text-xs sm:text-sm text-teal-200/90 mt-1">
            Uji hipotesis populasi, amati perubahan dinamis sawah, dan tetapkan solusi ekologis yang bertanggung jawab!
          </p>
        </div>

        <button
          onClick={onBackToMap}
          className="shrink-0 px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Kembali ke Peta Misi
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex rounded-2xl bg-emerald-950/70 p-1.5 border border-emerald-700/50 gap-2 overflow-x-auto">
        <button
          onClick={() => {
            sounds.playClick();
            setMode('skenario');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            mode === 'skenario'
              ? 'bg-amber-400 text-emerald-950 shadow font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Skenario Terarah (A, B, C)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setMode('sandbox');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            mode === 'sandbox'
              ? 'bg-cyan-400 text-emerald-950 shadow font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Laboratorium Bebas (Sandbox)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setMode('solusi');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            mode === 'solusi'
              ? 'bg-emerald-400 text-emerald-950 shadow font-black'
              : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Tindakan & Solusi Ekologis</span>
          {solutionSubmitted && <CheckCircle2 className="h-4 w-4 text-emerald-900 ml-1" />}
        </button>
      </div>

      {/* ================= MODE 1: SKENARIO TERARAH ================= */}
      {mode === 'skenario' && (
        <div className="space-y-6">
          {/* Scenario Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SIMULATION_SCENARIOS.map((scen, idx) => {
              const isSelected = selectedScenarioIdx === idx;
              const isDone = scenarioCompletedMap[scen.id];

              return (
                <button
                  key={scen.id}
                  onClick={() => handleSelectScenario(idx)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/40 shadow-lg ring-2 ring-amber-400/40'
                      : 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-amber-300">
                      Skenario {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                    </span>
                    {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{scen.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{scen.summary}</p>
                </button>
              );
            })}
          </div>

          {/* Narrative & Perturbation Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Gangguan Lingkungan yang Terjadi:
              </span>
              <button
                onClick={handleResetScenario}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ulangi Skenario Ini
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{currentScenario.narrative}"
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
              <div className="text-xs sm:text-sm text-amber-200">
                <strong>Pemicu Gangguan:</strong> {currentScenario.perturbation.causeDescription}
              </div>
            </div>
          </div>

          {/* Sawah Ecosystem Population Meters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              Status Populasi Makhluk Hidup Sawah ({scenarioStep === 'hasil' ? 'Setelah Simulasi' : 'Kondisi Saat Ini'}):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {sawahOrganisms.map((org) => {
                const popLevel = scenarioPopulations[org.id] || 'sedang';
                const popMeta = POPULATION_LABELS[popLevel];
                const isPerturbed = currentScenario.perturbation.organismId === org.id;

                return (
                  <div
                    key={org.id}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isPerturbed
                        ? 'border-rose-400 bg-rose-950/40 ring-2 ring-rose-400/50 shadow-md'
                        : 'border-emerald-700/60 bg-emerald-950/70'
                    }`}
                  >
                    <span className="text-3xl">{org.emoji}</span>
                    <h5 className="mt-1 text-xs font-black text-white">{org.name}</h5>
                    <span className="text-[10px] text-emerald-300/80">{org.roleLabel}</span>

                    <div className="mt-2 w-full pt-1.5 border-t border-emerald-800/60">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold border block ${popMeta.badgeClass}`}
                      >
                        {popMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: PREDIKSI SISWA */}
          {scenarioStep === 'prediksi' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-400/60 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-400" />
                <h4 className="text-base font-black text-white">
                  Tahap 1: Buat Prediksi Bersama Kelas!
                </h4>
              </div>

              <p className="text-sm font-semibold text-emerald-200">
                {currentScenario.guidingQuestion}
              </p>

              <div className="space-y-2.5">
                {currentScenario.predictionOptions.map((opt) => {
                  const isSelected = selectedPredictionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectPrediction(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/20 text-white font-bold ring-2 ring-amber-400/40 shadow'
                          : 'border-emerald-800 bg-emerald-950/50 hover:bg-emerald-900 text-slate-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end pt-3">
                <button
                  disabled={!selectedPredictionId || simulationRunning}
                  onClick={handleRunScenarioSimulation}
                  className={`px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-xl transition-transform active:scale-95 cursor-pointer ${
                    selectedPredictionId && !simulationRunning
                      ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 animate-bounce'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>{simulationRunning ? 'Menghitung Dinamika Alam...' : 'Jalankan Simulasi!'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 & 3: HASIL SIMULASI & REFLEKSI */}
          {scenarioStep === 'hasil' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-400 shadow-xl space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  Hasil Nyata Simulasi Sebab-Akibat
                </h4>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-600/50">
                  Simulasi Sukses Dijalankan
                </span>
              </div>

              {/* Prediction evaluation */}
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-xs sm:text-sm space-y-2">
                <strong className="text-amber-300 block font-bold">
                  Evaluasi Prediksi Siswa:
                </strong>
                <p className="text-slate-200">
                  {currentScenario.predictionOptions.find((p) => p.id === selectedPredictionId)?.scientificFeedback}
                </p>
              </div>

              {/* Primary & Secondary Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs sm:text-sm">
                  <h5 className="font-bold text-amber-300 flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4" /> Dampak Langsung:
                  </h5>
                  <p className="text-slate-200">{currentScenario.primaryImpactSummary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 text-xs sm:text-sm">
                  <h5 className="font-bold text-teal-300 flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4" /> Dampak Tidak Langsung (Berantai):
                  </h5>
                  <p className="text-slate-200">{currentScenario.secondaryImpactSummary}</p>
                </div>
              </div>

              {/* Scientific principle & real world disclaimer */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800 text-xs space-y-1.5 text-slate-300">
                <strong className="text-emerald-300 block font-bold">
                  🔬 Landasan Ilmiah Keseimbangan Sawah:
                </strong>
                <p>{currentScenario.scientificExplanation}</p>
                <p className="text-slate-400 italic pt-1 border-t border-slate-800">
                  {currentScenario.realWorldContext}
                </p>
              </div>

              {/* Reflection prompt */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs sm:text-sm text-cyan-200">
                <strong>Pertanyaan Refleksi Kelas:</strong> "{currentScenario.reflectionQuestion}"
              </div>

              {/* Actions to continue */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetScenario}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Ulangi Skenario Ini
                </button>

                <div className="flex items-center gap-3">
                  {selectedScenarioIdx + 1 < SIMULATION_SCENARIOS.length ? (
                    <button
                      onClick={() => handleSelectScenario(selectedScenarioIdx + 1)}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer"
                    >
                      <span>Lanjut Skenario Berikutnya</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setMode('solusi');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl animate-bounce cursor-pointer"
                    >
                      <span>Lanjut ke Tindakan & Solusi Ekologis!</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 2: SANDBOX BEBAS ================= */}
      {mode === 'sandbox' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-cyan-500/50 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-cyan-400" />
                Laboratorium Simulasi Bebas Sawah
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-600/40">
                  Musim Tanam Ke: {seasonCount}
                </span>
                <button
                  onClick={handleResetSandbox}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Ubah populasi organisme sesukamu menggunakan tombol di bawah, lalu klik <strong>"Jalankan 1 Musim Tanam (+1 Step)"</strong> untuk melihat bagaimana jaring-jaring makanan bereaksi secara alami!
            </p>
          </div>

          {/* Interactive Population Sliders/Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sawahOrganisms.map((org) => {
              const currentPop = sandboxPopulations[org.id] || 'sedang';
              const popMeta = POPULATION_LABELS[currentPop];

              return (
                <div
                  key={org.id}
                  className="p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-700/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{org.emoji}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{org.name}</h4>
                        <span className="text-[10px] text-emerald-300">{org.roleLabel}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${popMeta.badgeClass}`}>
                      {popMeta.label}
                    </span>
                  </div>

                  {/* Level selection buttons */}
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {POPULATION_LEVEL_ORDER.map((lvl) => {
                      const isActive = currentPop === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => handleSandboxChangePop(org.id, lvl)}
                          className={`py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-emerald-950 font-black shadow ring-1 ring-amber-300 scale-105'
                              : 'bg-emerald-900/60 text-slate-300 hover:bg-emerald-800'
                          }`}
                          title={POPULATION_LABELS[lvl].label}
                        >
                          {lvl === 'sangat_sedikit' && 'Sgt Sedikit'}
                          {lvl === 'sedikit' && 'Sedikit'}
                          {lvl === 'sedang' && 'Sedang'}
                          {lvl === 'banyak' && 'Banyak'}
                          {lvl === 'sangat_banyak' && 'Sgt Banyak'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Big Simulation Control */}
          <div className="flex items-center justify-center py-2">
            <button
              onClick={handleRunSandboxStep}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-emerald-950 font-black text-base sm:text-lg flex items-center gap-3 shadow-2xl transition-transform active:scale-95 cursor-pointer ring-4 ring-cyan-400/40"
            >
              <Play className="h-6 w-6 fill-current" />
              <span>Jalankan 1 Musim Tanam (+1 Langkah Ekologi)</span>
            </button>
          </div>

          {/* Sandbox Live Health Dashboard */}
          {currentSandboxResult && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-cyan-400/60 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-black text-white">
                    Hasil Pengamatan Musim Tanam ke-{seasonCount}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentSandboxResult.overallDiagnosis}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-center">
                    <span className="text-[10px] text-emerald-300 uppercase block font-bold">Hasil Panen Padi</span>
                    <span className="text-base font-black text-amber-300">{currentSandboxResult.riceHarvestRate}%</span>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-center">
                    <span className="text-[10px] text-cyan-300 uppercase block font-bold">Keseimbangan</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${
                      currentSandboxResult.healthStatus === 'Harmonis & Seimbang'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : currentSandboxResult.healthStatus === 'Rawan Terganggu'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {currentSandboxResult.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Changes Detail List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-300 uppercase block">
                  Pergerakan Populasi & Alasan Sains:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {currentSandboxResult.changes.map((ch) => {
                    const org = ORGANISMS.find((o) => o.id === ch.organismId);
                    return (
                      <div
                        key={ch.organismId}
                        className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2.5"
                      >
                        <span className="text-2xl">{org?.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-white">{org?.name}:</strong>
                            <span className="text-slate-300 font-bold capitalize">
                              {ch.from.replace('_', ' ')} ➔ {ch.to.replace('_', ' ')}
                            </span>
                            {ch.direction === 'naik' && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
                            {ch.direction === 'turun' && <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">{ch.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODE 3: SOLUSI EKOLOGIS ================= */}
      {mode === 'solusi' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-500/50 shadow-xl space-y-2">
            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              Tantangan Keputusan: Menjaga Harmoni Sawah
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Sebagai Penjaga Ekosistem Muda, pilihlah tindakan terbaik untuk mengatasi gangguan hama di sawah tanpa merusak rantai makanan lainnya.
            </p>
          </div>

          <div className="space-y-3">
            {ECOLOGICAL_SOLUTIONS.map((sol) => {
              const isSelected = selectedSolution?.id === sol.id;
              return (
                <div
                  key={sol.id}
                  onClick={() => handleSelectSolution(sol)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/40 ring-2 ring-amber-400/50 shadow-lg'
                      : 'border-emerald-800 bg-emerald-950/60 hover:bg-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span className="text-xl">
                        {sol.isEcological ? '🌿' : '⚠️'}
                      </span>
                      {sol.title}
                    </h4>
                    <span className="text-xs font-bold text-amber-300">
                      {isSelected ? '✓ Terpilih' : 'Pilih'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {sol.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Evaluate Button & Feedback */}
          {selectedSolution && (
            <div className="space-y-4">
              {!solutionSubmitted ? (
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitSolution}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    Terapkan Tindakan Ini & Amati Hasilnya
                  </button>
                </div>
              ) : (
                <div className={`p-5 rounded-2xl border-2 space-y-3 animate-fade-in text-xs sm:text-sm ${
                  selectedSolution.isEcological
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/90 border-rose-400 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedSolution.isEcological ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
                    )}
                    <h4 className="text-base font-black text-white">
                      {selectedSolution.isEcological ? 'Tindakan Ekologis Bijaksana (+10 Poin)!' : 'Tindakan Berisiko Tinggi!'}
                    </h4>
                  </div>

                  <p className="leading-relaxed font-medium">
                    {selectedSolution.explanation}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-200">
                    <strong>Konsekuensi Bagi Sawah:</strong> {selectedSolution.consequences}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleFinishMission3}
                      className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm flex items-center gap-2 shadow-xl animate-bounce cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Selesaikan Pos 3 & Klaim {25 + solutionScore} Poin!</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
