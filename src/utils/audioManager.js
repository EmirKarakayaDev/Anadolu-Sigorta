import { Howl } from 'howler';

// Ses Efektleri (SFX)
const sfx = {
  move: new Howl({
    src: ['/audio/move.mp3'],
    volume: 0.15
  }),
  rotate: new Howl({
    src: ['/audio/move.mp3'], 
    volume: 0.15
  }),
  gecis: new Howl({
    src: ['/audio/gecis.mp3'],
    volume: 0.05
  }),
  clear: new Howl({
    src: ['/audio/gecis.mp3'],
    volume: 0.3
  }),
  countdown: new Howl({
    src: ['/audio/3-2-1.mp3'], 
    volume: 0.15
  })
};

// Arka Plan Müzikleri (BGM)
const bgms = {
  1: new Howl({ src: ['/audio/game_music.mp3'], loop: true, volume: 0.15 }),   // Menü
  2: new Howl({ src: ['/audio/Normal.mp3'], loop: true, volume: 0.15 }),       // Normal Oyun
  3: new Howl({ src: ['/audio/2x.mp3'], loop: true, volume: 0.15 }),           // 2x Oyun
  4: new Howl({ src: ['/audio/game_music_2.mp3'], loop: true, volume: 0.15 })  // Skor Ekranı
};

let currentBGM = null;
let currentBGMType = null;
let isMuted = false;
let isBackgrounded = false;
let wasPlayingBeforeBackground = {
  bgm: false,
  countdown: false
};

// Global visibility listener
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isBackgrounded = true;
    wasPlayingBeforeBackground.bgm = currentBGM && currentBGM.playing();
    wasPlayingBeforeBackground.countdown = sfx.countdown.playing();

    if (wasPlayingBeforeBackground.bgm) currentBGM.pause();
    if (wasPlayingBeforeBackground.countdown) sfx.countdown.pause();
  } else {
    isBackgrounded = false;
    if (!isMuted) {
      if (wasPlayingBeforeBackground.bgm && currentBGM) {
        currentBGM.play();
      }
      if (wasPlayingBeforeBackground.countdown && sfx.countdown.state() === 'loaded') {
        sfx.countdown.play();
      }
    }
    // Reset flags
    wasPlayingBeforeBackground.bgm = false;
    wasPlayingBeforeBackground.countdown = false;
  }
});

export const audioManager = {
  play: (soundName) => {
    if (isMuted || isBackgrounded) return;
    if (sfx[soundName]) {
      // If it's countdown, don't allow duplicate starts
      if (soundName === 'countdown' && sfx[soundName].playing()) return;
      sfx[soundName].play();
    }
  },

  // BGM Yönetimi (1: Menü, 2: Normal, 3: 2x, 4: Skor)
  startBGM: (type = 1) => {
    if (currentBGMType === type && currentBGM && currentBGM.playing()) return;
    
    // HEPSİNİ DURDUR (currentBGM dışındakiler zaten duruyor olmalı ama garanti alıyoruz)
    Object.values(bgms).forEach(b => {
        b.stop();
    });

    const targetBGM = bgms[type];
    if (targetBGM) {
        currentBGM = targetBGM;
        currentBGMType = type;
        if (!isMuted && !isBackgrounded) {
          targetBGM.play();
        }
    }
  },

  stopBGM: () => {
    Object.values(bgms).forEach(b => b.stop());
    currentBGM = null;
    currentBGMType = null;
  },

  // Müziği YAVAŞÇA sustur
  fadeOutBGM: (duration = 1500) => {
    if (!currentBGM) return;
    const currentVol = currentBGM.volume();
    currentBGM.fade(currentVol, 0, duration);
    setTimeout(() => {
        if (currentBGM && currentBGM.volume() === 0) {
            currentBGM.stop();
        }
    }, duration + 100);
  },

  toggleMute: () => {
    isMuted = !isMuted;
    Object.values(bgms).forEach(b => b.mute(isMuted));
    Object.values(sfx).forEach(s => s.mute(isMuted));
    
    if (!isMuted && currentBGM && !currentBGM.playing() && !isBackgrounded) {
        currentBGM.play();
    }
    
    localStorage.setItem('game_muted', isMuted);
    return isMuted;
  },

  getMuteStatus: () => isMuted
};

// Hatırlatıcı
if (localStorage.getItem('game_muted') === 'true') {
  isMuted = true;
  Object.values(bgms).forEach(b => b.mute(true));
  Object.values(sfx).forEach(s => s.mute(true));
}
