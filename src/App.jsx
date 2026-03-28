import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormScreen } from './components/FormScreen';
import { KVKKScreen } from './components/KVKKScreen';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { PixelTransition } from './components/PixelTransition';

import { saveGameSession } from './supabase';

const SCREENS = {
  MENU: 'menu',
  KVKK: 'kvkk',
  FORM: 'form',
  GAME: 'game',
  RESULT: 'result',
  LEADERBOARD: 'leaderboard'
};

// Kiosk tespiti:
// 1. Öncelik: URL'de ?kiosk parametresi varsa (ör. https://site.com/?kiosk)
// 2. Fallback: Ekran yüksekliği 1800px ve üzeriyse (fiziksel kiosk ekranı)
const urlParams = new URLSearchParams(window.location.search);
const isKiosk = urlParams.has('kiosk') || window.screen.height >= 1800;

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MENU);
  const [userData, setUserData] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [lastSessionId, setLastSessionId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);
  const isSavingRef = React.useRef(false);

  // Kiosk modunda body'e .kiosk class'ı ekle
  React.useEffect(() => {
    if (isKiosk) {
      document.body.classList.add('kiosk');
    }
    return () => document.body.classList.remove('kiosk');
  }, []);

  const handleStart = () => {
    // Attempt fullscreen on first interaction for immersion (sadece mobil/desktop için, kiosk zaten tam ekran)
    if (!isKiosk) {
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => { });
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } catch (e) {
        console.warn("Fullscreen request failed", e);
      }
    }
    setCurrentScreen(SCREENS.KVKK);
  };
  const handleKVKKAccept = () => setCurrentScreen(SCREENS.FORM);

  const handleFormSubmit = (data) => {
    setUserData(data);
    setTransitionTarget(SCREENS.GAME);
    setIsTransitioning(true);
  };

  const handleGameOver = (score) => {
    if (isSavingRef.current) return;

    setFinalScore(score);
    if (userData) {
      isSavingRef.current = true;
      saveGameSession(userData, score).then(result => {
        if (result.success) {
          setLastSessionId(result.id);
        }
        isSavingRef.current = false;
      }).catch(err => {
        console.error("Save error:", err);
        isSavingRef.current = false;
      });
    }
    setCurrentScreen(SCREENS.RESULT);
  };

  const handleReset = () => {
    setTransitionTarget(SCREENS.MENU);
    setIsTransitioning(true);
  };

  const handlePlayAgain = () => {
    setTransitionTarget(SCREENS.GAME);
    setIsTransitioning(true);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {currentScreen === SCREENS.MENU && (
          <MenuScreen key="menu" onStart={handleStart} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.KVKK && (
          <KVKKScreen key="kvkk" onAccept={handleKVKKAccept} onDecline={handleReset} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.FORM && (
          <FormScreen key="form" onSubmit={handleFormSubmit} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.GAME && (
          <GameScreen key="game" onGameOver={handleGameOver} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.RESULT && (
          <ResultScreen key="result" score={finalScore} onReset={handleReset} onPlayAgain={handlePlayAgain} onShowLeaderboard={() => setCurrentScreen(SCREENS.LEADERBOARD)} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.LEADERBOARD && (
          <LeaderboardScreen key="leaderboard" onReset={handleReset} onPlayAgain={handlePlayAgain} lastSessionId={lastSessionId} isKiosk={isKiosk} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <PixelTransition
            key="pixel-transition"
            isKiosk={isKiosk}
            onMidpoint={() => {
              if (transitionTarget) {
                setCurrentScreen(transitionTarget);
              }
            }}
            onComplete={() => {
              setIsTransitioning(false);
              if (transitionTarget === SCREENS.MENU) {
                setUserData(null);
                setFinalScore(0);
              } else if (transitionTarget === SCREENS.GAME) {
                setFinalScore(0);
                setLastSessionId(null);
              }
              setTransitionTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
