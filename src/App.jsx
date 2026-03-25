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

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MENU);
  const [userData, setUserData] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [lastSessionId, setLastSessionId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);
  const isSavingRef = React.useRef(false);

  const handleStart = () => {
    // Attempt fullscreen on first interaction for immersion
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
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
          <MenuScreen key="menu" onStart={handleStart} />
        )}
        {currentScreen === SCREENS.KVKK && (
          <KVKKScreen key="kvkk" onAccept={handleKVKKAccept} onDecline={handleReset} />
        )}
        {currentScreen === SCREENS.FORM && (
          <FormScreen key="form" onSubmit={handleFormSubmit} />
        )}
        {currentScreen === SCREENS.GAME && (
          <GameScreen key="game" onGameOver={handleGameOver} />
        )}
        {currentScreen === SCREENS.RESULT && (
          <ResultScreen key="result" score={finalScore} onReset={handleReset} onPlayAgain={handlePlayAgain} onShowLeaderboard={() => setCurrentScreen(SCREENS.LEADERBOARD)} />
        )}
        {currentScreen === SCREENS.LEADERBOARD && (
          <LeaderboardScreen key="leaderboard" onReset={handleReset} onPlayAgain={handlePlayAgain} lastSessionId={lastSessionId} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <PixelTransition
            key="pixel-transition"
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
