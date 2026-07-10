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
import { audioManager } from './utils/audioManager';
import { getEventConfig } from './eventConfig';

const LS_KEY = 'as_user_data';

const SCREENS = {
  MENU: 'menu',
  KVKK: 'kvkk',
  FORM: 'form',
  GAME: 'game',
  RESULT: 'result',
  LEADERBOARD: 'leaderboard'
};

// Etkinlik Lokasyonu Kontrolü
// Her lokasyon kendi QR/linkini ?event=<slug> parametresiyle taşır; veriler/davranış buna göre ayrışır.
const urlParams = new URLSearchParams(window.location.search);
const eventConfig = getEventConfig(urlParams.get('event'));

// Kiosk Modu Kontrolü
// Öncelik URL parametresi (?kiosk), alternatif olarak yüksek çözünürlüklü dikey ekran tespiti.
// Lokasyon kiosk girişine izin vermiyorsa (allowKiosk:false) hiçbir durumda kiosk moda geçilmez.
const isKiosk = !!eventConfig?.allowKiosk && (urlParams.has('kiosk') || window.screen.height >= 1800);

// Etkinlik durumu — true: etkinlik bitti (popup + sonuç butonu göster), false: etkinlik devam ediyor
const EVENT_ENDED = false;

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MENU);
  const [userData, setUserData] = useState(null);
  const [savedUserData, setSavedUserData] = useState(() => {
    if (isKiosk) return null;
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
  });
  const [finalScore, setFinalScore] = useState(0);
  const [lastSessionId, setLastSessionId] = useState(null);
  const [isTestSession, setIsTestSession] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);
  const isSavingRef = React.useRef(false);

  // Sayfa yüklendiğinde kiosk sınıflarını ekle
  React.useEffect(() => {
    if (isKiosk) {
      document.body.classList.add('kiosk');
    }
    return () => document.body.classList.remove('kiosk');
  }, []);

  const handleStart = () => {
    // Kullanıcı ilk etkileşimde AudioContext kilidi açılır, BGM'yi yeniden tetikle
    if (isKiosk) audioManager.startBGM(1);
    // Tarayıcı kısıtlamaları nedeniyle ilk etkileşimde tam ekranı tetikle
    try {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen().catch(() => { });
      } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }

    setCurrentScreen(SCREENS.KVKK);
  };
  const handleKVKKAccept = () => setCurrentScreen(SCREENS.FORM);

  const handleFormSubmit = (data) => {
    setIsTestSession(!!data.isTestEntry);
    setUserData(data);
    if (!isKiosk && !data.isTestEntry) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        setSavedUserData(data);
      } catch { }
    }
    setTransitionTarget(SCREENS.GAME);
    setIsTransitioning(true);
  };

  const handleContinueWithSaved = () => {
    if (!savedUserData) return;
    setUserData(savedUserData);
    setTransitionTarget(SCREENS.GAME);
    setIsTransitioning(true);
  };

  const handleChangeSavedData = () => {
    try { localStorage.removeItem(LS_KEY); } catch { }
    setSavedUserData(null);
    handleStart();
  };

  const handleGameOver = (score) => {
    if (isSavingRef.current) return;

    setFinalScore(score);
    if (userData) {
      isSavingRef.current = true;
      saveGameSession(userData, score, isTestSession, eventConfig.slug).then(result => {
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

  const handleBackToKVKK = () => {
    // Form ekranındaki "Geri Dön" aksiyonunda geçiş ekranı (PixelTransition) göstermeyelim.
    // Menü veya oyun ekranına gidildiğinde geçiş animasyonu korunuyor.
    setTransitionTarget(null);
    setIsTransitioning(false);
    setCurrentScreen(SCREENS.KVKK);
  };

  const handlePlayAgain = () => {
    setTransitionTarget(SCREENS.GAME);
    setIsTransitioning(true);
  };

  if (!eventConfig) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', color: 'white' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Etkinlik bağlantısı geçersiz</h2>
          <p>Lütfen etkinlik için verilen QR kodu/linki kullanın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {currentScreen === SCREENS.MENU && (
          <MenuScreen
            key="menu"
            onStart={handleStart}
            isKiosk={isKiosk}
            savedUserData={savedUserData}
            onContinueWithSaved={handleContinueWithSaved}
            onChangeSavedData={handleChangeSavedData}
            eventEnded={EVENT_ENDED}
            rewardsEnabled={eventConfig.rewardsEnabled}
          />
        )}
        {currentScreen === SCREENS.KVKK && (
          <KVKKScreen key="kvkk" onAccept={handleKVKKAccept} onDecline={handleReset} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.FORM && (
          <FormScreen key="form" onSubmit={handleFormSubmit} onBack={handleBackToKVKK} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.GAME && (
          <GameScreen key="game" onGameOver={handleGameOver} isKiosk={isKiosk} />
        )}
        {currentScreen === SCREENS.RESULT && (
          <ResultScreen key="result" score={finalScore} onReset={handleReset} onPlayAgain={handlePlayAgain} onShowLeaderboard={() => setCurrentScreen(SCREENS.LEADERBOARD)} isKiosk={isKiosk} rewardsEnabled={eventConfig.rewardsEnabled} />
        )}
        {currentScreen === SCREENS.LEADERBOARD && (
          <LeaderboardScreen key="leaderboard" onReset={handleReset} onPlayAgain={handlePlayAgain} lastSessionId={lastSessionId} isKiosk={isKiosk} isTestSession={isTestSession} finalScore={finalScore} eventEnded={EVENT_ENDED} rewardsEnabled={eventConfig.rewardsEnabled} table={eventConfig.table} viewTable={eventConfig.viewTable} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && (
          <PixelTransition
            key="pixel-transition"
            isKiosk={isKiosk}
            onMidpoint={() => {
              if (transitionTarget) {
                // Klavye ve odağı kapat
                document.activeElement?.blur();
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
