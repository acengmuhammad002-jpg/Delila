import { PopulationLevel } from '../types/ecosystem';

const LEVEL_TO_NUM: Record<PopulationLevel, number> = {
  sangat_sedikit: 1,
  sedikit: 2,
  sedang: 3,
  banyak: 4,
  sangat_banyak: 5,
};

const NUM_TO_LEVEL: Record<number, PopulationLevel> = {
  1: 'sangat_sedikit',
  2: 'sedikit',
  3: 'sedang',
  4: 'banyak',
  5: 'sangat_banyak',
};

function clampLevel(num: number): PopulationLevel {
  const clamped = Math.max(1, Math.min(5, Math.round(num)));
  return NUM_TO_LEVEL[clamped] || 'sedang';
}

export interface SimulationResult {
  nextPopulations: Record<string, PopulationLevel>;
  changes: {
    organismId: string;
    from: PopulationLevel;
    to: PopulationLevel;
    direction: 'naik' | 'turun' | 'tetap';
    reason: string;
  }[];
  healthScore: number; // 0 - 100
  healthStatus: 'Harmonis & Seimbang' | 'Rawan Terganggu' | 'Kritis / Terancam';
  riceHarvestRate: number; // 0 - 100%
  overallDiagnosis: string;
}

export function simulateNextStep(current: Record<string, PopulationLevel>): SimulationResult {
  const pPadi = LEVEL_TO_NUM[current.padi || 'sedang'];
  const pBelalang = LEVEL_TO_NUM[current.belalang || 'sedang'];
  const pTikus = LEVEL_TO_NUM[current.tikus || 'sedang'];
  const pKatak = LEVEL_TO_NUM[current.katak || 'sedang'];
  const pUlar = LEVEL_TO_NUM[current.ular || 'sedang'];
  const pElang = LEVEL_TO_NUM[current.elang || 'sedang'];

  // Impact on Padi:
  // Eaten by Belalang and Tikus
  let nextPadiNum = pPadi;
  const pestPressure = (pBelalang - 3) * 0.5 + (pTikus - 3) * 0.7;
  nextPadiNum -= pestPressure;

  // Impact on Belalang:
  // Gains energy from Padi, eaten by Katak
  let nextBelalangNum = pBelalang;
  const belalangFood = (pPadi - 3) * 0.4;
  const belalangPredation = (pKatak - 3) * 0.6;
  nextBelalangNum += belalangFood - belalangPredation;

  // Impact on Tikus:
  // Gains energy from Padi, eaten by Ular & Elang
  let nextTikusNum = pTikus;
  const tikusFood = (pPadi - 3) * 0.5;
  const tikusPredation = (pUlar - 3) * 0.6 + (pElang - 3) * 0.3;
  nextTikusNum += tikusFood - tikusPredation;

  // Impact on Katak:
  // Eats Belalang, eaten by Ular
  let nextKatakNum = pKatak;
  const katakFood = (pBelalang - 3) * 0.5;
  const katakPredation = (pUlar - 3) * 0.5;
  nextKatakNum += katakFood - katakPredation;

  // Impact on Ular:
  // Eats Katak & Tikus, eaten by Elang
  let nextUlarNum = pUlar;
  const ularFood = (pKatak - 3) * 0.3 + (pTikus - 3) * 0.5;
  const ularPredation = (pElang - 3) * 0.5;
  nextUlarNum += ularFood - ularPredation;

  // Impact on Elang:
  // Eats Ular & Tikus
  let nextElangNum = pElang;
  const elangFood = (pUlar - 3) * 0.4 + (pTikus - 3) * 0.3;
  nextElangNum += elangFood;

  const nextPopulations: Record<string, PopulationLevel> = {
    padi: clampLevel(nextPadiNum),
    belalang: clampLevel(nextBelalangNum),
    tikus: clampLevel(nextTikusNum),
    katak: clampLevel(nextKatakNum),
    ular: clampLevel(nextUlarNum),
    elang: clampLevel(nextElangNum),
  };

  const changes: SimulationResult['changes'] = [];
  const orgKeys = ['padi', 'belalang', 'tikus', 'katak', 'ular', 'elang'] as const;

  orgKeys.forEach((key) => {
    const from = current[key];
    const to = nextPopulations[key];
    const fromVal = LEVEL_TO_NUM[from];
    const toVal = LEVEL_TO_NUM[to];
    let direction: 'naik' | 'turun' | 'tetap' = 'tetap';
    let reason = 'Populasi stabil dalam batas toleransi wajar.';

    if (toVal > fromVal) {
      direction = 'naik';
      if (key === 'padi') reason = 'Tanaman padi tumbuh lebat karena tekanan hama rendah.';
      if (key === 'belalang') reason = 'Belalang bertambah karena ketersediaan padi melimpah atau katak berkurang.';
      if (key === 'tikus') reason = 'Tikus berkembang biak cepat karena predator alami (ular/elang) berkurang.';
      if (key === 'katak') reason = 'Katak bertambah karena mangsa (belalang) tersedia banyak.';
      if (key === 'ular') reason = 'Ular bertambah karena mangsa (tikus & katak) sangat melimpah.';
      if (key === 'elang') reason = 'Elang mendapat suplai makanan yang cukup dari ular dan tikus.';
    } else if (toVal < fromVal) {
      direction = 'turun';
      if (key === 'padi') reason = 'Tanaman padi tertekan akibat dimakan belalang atau hama tikus yang melonjak.';
      if (key === 'belalang') reason = 'Belalang berkurang karena dimangsa katak atau pakan daun padi menipis.';
      if (key === 'tikus') reason = 'Tikus berkurang karena diburu ular/elang atau kekurangan bulir padi.';
      if (key === 'katak') reason = 'Katak berkurang karena kekurangan belalang atau dimangsa banyak ular.';
      if (key === 'ular') reason = 'Ular kekurangan mangsa atau diburu oleh predator.';
      if (key === 'elang') reason = 'Elang kesulitan menemukan mangsa ular dan tikus.';
    }

    changes.push({
      organismId: key,
      from,
      to,
      direction,
      reason,
    });
  });

  // Calculate health score: deviation from balanced equilibrium (3)
  const deviations = Object.values(nextPopulations).map((lvl) => Math.abs(LEVEL_TO_NUM[lvl] - 3));
  const totalDev = deviations.reduce((a, b) => a + b, 0);
  const healthScore = Math.max(10, Math.round(100 - (totalDev / (deviations.length * 2)) * 90));

  let healthStatus: SimulationResult['healthStatus'] = 'Harmonis & Seimbang';
  if (healthScore < 50) {
    healthStatus = 'Kritis / Terancam';
  } else if (healthScore < 75) {
    healthStatus = 'Rawan Terganggu';
  }

  // Rice harvest calculation
  const padiLevelVal = LEVEL_TO_NUM[nextPopulations.padi];
  const riceHarvestRate = Math.round((padiLevelVal / 5) * 100);

  let overallDiagnosis = 'Ekosistem sawah dalam kondisi seimbang. Hubungan makan dan dimakan berjalan harmonis.';
  if (healthStatus === 'Kritis / Terancam') {
    overallDiagnosis = 'Peringatan: Keseimbangan ekosistem rusak parah! Salah satu populasi mengalami kepunahan lokal atau ledakan hama yang merugikan pertanian.';
  } else if (healthStatus === 'Rawan Terganggu') {
    overallDiagnosis = 'Perhatian: Ada indikasi ketimpangan jumlah predator atau mangsa. Sawah memerlukan pengamatan lebih lanjut.';
  }

  return {
    nextPopulations,
    changes,
    healthScore,
    healthStatus,
    riceHarvestRate,
    overallDiagnosis,
  };
}
