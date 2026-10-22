export type CategoryType = 'biotik' | 'abiotik';

export type TrophicRole = 
  | 'produsen'
  | 'konsumen_1'
  | 'konsumen_2'
  | 'konsumen_3'
  | 'konsumen_puncak'
  | 'dekomposer'
  | 'faktor_abiotik';

export type DietType = 'autotrof' | 'herbivora' | 'karnivora' | 'omnivora' | 'abiotik';

export type PopulationLevel = 'sangat_sedikit' | 'sedikit' | 'sedang' | 'banyak' | 'sangat_banyak';

export interface Organism {
  id: string;
  name: string;
  scientificName: string;
  category: CategoryType;
  trophicRole: TrophicRole;
  roleLabel: string;
  dietType: DietType;
  dietLabel: string;
  emoji: string;
  description: string;
  facts: string[];
  foods: string[]; // id of organisms it eats
  eatenBy: string[]; // id of organisms that eat it
  initialPopulation: PopulationLevel;
  minPopulation: PopulationLevel;
  maxPopulation: PopulationLevel;
  habitat: string;
  energyRoleDescription: string;
  xPos: number; // percentage in field illustration (0-100)
  yPos: number;
}

export interface FoodConnection {
  fromId: string; // The one being eaten (food / source of energy)
  toId: string;   // The eater (consumer / recipient of energy)
  label: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  summary: string;
  narrative: string;
  guidingQuestion: string;
  initialPopulations: Record<string, PopulationLevel>;
  perturbation: {
    organismId: string;
    newLevel: PopulationLevel;
    causeDescription: string;
  };
  predictionOptions: {
    id: string;
    text: string;
    isOptimal: boolean;
    scientificFeedback: string;
  }[];
  expectedSimulatedPopulations: Record<string, PopulationLevel>;
  primaryImpactSummary: string;
  secondaryImpactSummary: string;
  scientificExplanation: string;
  realWorldContext: string;
  reflectionQuestion: string;
}

export interface EcologicalSolution {
  id: string;
  title: string;
  description: string;
  isEcological: boolean;
  score: number;
  explanation: string;
  consequences: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  targetObjective: string;
}

export interface GroupScoreRecord {
  id: string;
  groupName: string;
  totalScore: number;
  awardTitle: string;
  preTestScore: number;
  postTestScore: number;
  mission1Score: number;
  mission2Score: number;
  mission3Score: number;
  date: string;
}

export interface GameProgress {
  groupName: string;
  preTestCompleted: boolean;
  preTestScore: number;
  mission1Completed: boolean;
  mission1Score: number;
  mission2Completed: boolean;
  mission2Score: number;
  mission3Completed: boolean;
  mission3Score: number;
  postTestCompleted: boolean;
  postTestScore: number;
  selectedSolutionId: string | null;
  totalScore: number;
  groupRecords: GroupScoreRecord[];
}

