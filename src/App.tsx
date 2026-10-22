import React, { useState, useEffect } from 'react';
import { GameProgress, GroupScoreRecord } from './types/ecosystem';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/screens/HomeScreen';
import { MissionMapScreen } from './components/screens/MissionMapScreen';
import { Mission1Screen } from './components/screens/Mission1Screen';
import { Mission2Screen } from './components/screens/Mission2Screen';
import { Mission3Screen } from './components/screens/Mission3Screen';
import { PostTestScreen } from './components/screens/PostTestScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { PreTestModal } from './components/PreTestModal';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY = 'misi_penjaga_ekosistem_state_v2';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isPreTestOpen, setIsPreTestOpen] = useState<boolean>(false);
  const [allUnlocked, setAllUnlocked] = useState<boolean>(false);

  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          groupName: parsed.groupName || 'Kelompok 1 (Elang)',
          preTestCompleted: parsed.preTestCompleted || false,
          preTestScore: parsed.preTestScore || 0,
          mission1Completed: parsed.mission1Completed || false,
          mission1Score: parsed.mission1Score || 0,
          mission2Completed: parsed.mission2Completed || false,
          mission2Score: parsed.mission2Score || 0,
          mission3Completed: parsed.mission3Completed || false,
          mission3Score: parsed.mission3Score || 0,
          postTestCompleted: parsed.postTestCompleted || false,
          postTestScore: parsed.postTestScore || 0,
          selectedSolutionId: parsed.selectedSolutionId || null,
          totalScore: parsed.totalScore || 0,
          groupRecords: parsed.groupRecords || [],
        };
      }
    } catch {
      // Fallback
    }
    return {
      groupName: 'Kelompok 1 (Elang)',
      preTestCompleted: false,
      preTestScore: 0,
      mission1Completed: false,
      mission1Score: 0,
      mission2Completed: false,
      mission2Score: 0,
      mission3Completed: false,
      mission3Score: 0,
      postTestCompleted: false,
      postTestScore: 0,
      selectedSolutionId: null,
      totalScore: 0,
      groupRecords: [],
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
    if (nextState) sounds.playClick();
  };

  const handleToggleProjectorMode = () => {
    setIsProjectorMode((prev) => !prev);
  };

  const handleUpdateGroupName = (name: string) => {
    setProgress((prev) => ({
      ...prev,
      groupName: name,
    }));
  };

  const handleStartAdventure = () => {
    if (!progress.preTestCompleted) {
      setIsPreTestOpen(true);
    } else {
      setCurrentScreen('map');
    }
  };

  const handlePreTestComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      preTestCompleted: true,
      preTestScore: score,
    }));
    setIsPreTestOpen(false);
    setCurrentScreen('map');
  };

  const handleMission1Complete = (score: number) => {
    setProgress((prev) => {
      const newM1 = Math.max(prev.mission1Score, score);
      const total = newM1 + prev.mission2Score + prev.mission3Score;
      return {
        ...prev,
        mission1Completed: true,
        mission1Score: newM1,
        totalScore: Math.min(100, total),
      };
    });
    setCurrentScreen('map');
  };

  const handleMission2Complete = (score: number) => {
    setProgress((prev) => {
      const newM2 = Math.max(prev.mission2Score, score);
      const total = prev.mission1Score + newM2 + prev.mission3Score;
      return {
        ...prev,
        mission2Completed: true,
        mission2Score: newM2,
        totalScore: Math.min(100, total),
      };
    });
    setCurrentScreen('map');
  };

  const handleMission3Complete = (score: number) => {
    setProgress((prev) => {
      const newM3 = Math.max(prev.mission3Score, score);
      const total = prev.mission1Score + prev.mission2Score + newM3;
      return {
        ...prev,
        mission3Completed: true,
        mission3Score: newM3,
        totalScore: Math.min(100, total),
      };
    });
    setCurrentScreen('map');
  };

  const handlePostTestComplete = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      postTestCompleted: true,
      postTestScore: score,
    }));
    setCurrentScreen('report');
  };

  // Muat Ulang Media tapi Simpan Skor Kelompok Sebelumnya
  const handleSaveAndResetForNextGroup = (awardTitle: string) => {
    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: GroupScoreRecord = {
      id: Date.now().toString(),
      groupName: progress.groupName.trim() || `Kelompok ${progress.groupRecords.length + 1}`,
      totalScore: progress.totalScore,
      awardTitle: awardTitle,
      preTestScore: progress.preTestScore,
      postTestScore: progress.postTestScore,
      mission1Score: progress.mission1Score,
      mission2Score: progress.mission2Score,
      mission3Score: progress.mission3Score,
      date: formattedDate,
    };

    const nextRecords = [newRecord, ...progress.groupRecords];
    const nextDefaultGroupName = `Kelompok ${nextRecords.length + 1}`;

    setProgress({
      groupName: nextDefaultGroupName,
      preTestCompleted: false,
      preTestScore: 0,
      mission1Completed: false,
      mission1Score: 0,
      mission2Completed: false,
      mission2Score: 0,
      mission3Completed: false,
      mission3Score: 0,
      postTestCompleted: false,
      postTestScore: 0,
      selectedSolutionId: null,
      totalScore: 0,
      groupRecords: nextRecords,
    });

    setAllUnlocked(false);
    setCurrentScreen('home');
  };

  const handleResetProgress = () => {
    const fresh: GameProgress = {
      groupName: 'Kelompok 1 (Elang)',
      preTestCompleted: false,
      preTestScore: 0,
      mission1Completed: false,
      mission1Score: 0,
      mission2Completed: false,
      mission2Score: 0,
      mission3Completed: false,
      mission3Score: 0,
      postTestCompleted: false,
      postTestScore: 0,
      selectedSolutionId: null,
      totalScore: 0,
      groupRecords: progress.groupRecords, // Preserve history records!
    };
    setProgress(fresh);
    setAllUnlocked(false);
    setCurrentScreen('home');
    setIsTeacherGuideOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-all ${
        isProjectorMode ? 'text-[1.125rem] contrast-125' : ''
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        totalScore={progress.totalScore}
        groupName={progress.groupName}
        onEditGroupName={() => setCurrentScreen('home')}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={handleToggleProjectorMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        onOpenHowToPlay={() => setCurrentScreen('home')}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartAdventure={handleStartAdventure}
            onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
            onStartPreTest={() => setIsPreTestOpen(true)}
            hasCompletedPreTest={progress.preTestCompleted}
            groupName={progress.groupName}
            onUpdateGroupName={handleUpdateGroupName}
            groupRecords={progress.groupRecords}
          />
        )}

        {currentScreen === 'map' && (
          <MissionMapScreen
            progress={progress}
            onSelectMission={(mId) => setCurrentScreen(mId)}
            allUnlocked={allUnlocked}
            onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
          />
        )}

        {currentScreen === 'misi-1' && (
          <Mission1Screen
            onComplete={handleMission1Complete}
            onBackToMap={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'misi-2' && (
          <Mission2Screen
            onComplete={handleMission2Complete}
            onBackToMap={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'misi-3' && (
          <Mission3Screen
            onComplete={handleMission3Complete}
            onBackToMap={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'post-test' && (
          <PostTestScreen
            onComplete={handlePostTestComplete}
            onBackToMap={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'report' && (
          <ReportScreen
            progress={progress}
            onSaveAndResetForNextGroup={handleSaveAndResetForNextGroup}
            onRestartGame={handleResetProgress}
            onNavigateToMap={() => setCurrentScreen('map')}
            onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
          />
        )}
      </main>

      {/* Pre-Test Modal */}
      <PreTestModal
        isOpen={isPreTestOpen}
        onClose={() => {
          setIsPreTestOpen(false);
          setCurrentScreen('map');
        }}
        onComplete={handlePreTestComplete}
      />

      {/* Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onUnlockAllMissions={() => {
          setAllUnlocked(true);
          setIsTeacherGuideOpen(false);
        }}
        onResetProgress={handleResetProgress}
        allUnlocked={allUnlocked}
      />
    </div>
  );
}
