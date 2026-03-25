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
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3'],
    volume: 0.5
  }),
  countdown: new Howl({
    src: ['/audio/3-2-1.mp3'], // Yeni geri sayım sesi
    volume: 0.15
  }),
  gameover: null // Game over SFX kaldırıldı
};

// Arka Plan Müzikleri (BGM)
const bgms = {
  1: new Howl({ src: ['/audio/game_music.mp3'], loop: true, volume: 0.15 }),   // Menü
  2: new Howl({ src: ['/audio/Normal.mp3'], loop: true, volume: 0.15 }),       // Normal Oyun
  3: new Howl({ src: ['/audio/2x.mp3'], loop: true, volume: 0.15 }),           // 2x Oyun
  4: new Howl({ src: ['/audio/game_music_2.mp3'], loop: true, volume: 0.15 })  // Skor Ekranı
};

let currentBGM = null;
let isMuted = false;

export const audioManager = {
  play: (soundName) => {
    if (isMuted) return;
    if (sfx[soundName]) {
      sfx[soundName].play();
    }
  },

  // BGM Yönetimi (1: Menü, 2: Normal, 3: 2x, 4: Skor)
  startBGM: (type = 1) => {
    if (isMuted) return;
    
    // HEPSİNİ DURDUR
    Object.values(bgms).forEach(b => {
        if (b.playing()) b.stop();
    });

    const targetBGM = bgms[type];
    if (targetBGM) {
        targetBGM.play();
        currentBGM = targetBGM;
    }
  },

  stopBGM: () => {
    Object.values(bgms).forEach(b => b.stop());
    currentBGM = null;
  },

  // Müziği YAVAŞÇA sustur (Sinematik Final için)
  fadeOutBGM: (duration = 1500) => {
    if (!currentBGM) return;
    const currentVol = currentBGM.volume();
    currentBGM.fade(currentVol, 0, duration);
    // Tamamen sustuğunda stop yapıp temizlemesini bekle (Gecikmeli Stop)
    setTimeout(() => {
        if (currentBGM && currentBGM.volume() === 0) {
            currentBGM.stop();
        }
    }, duration + 100);
  },

  // Ducking kaldırıldı (isteğine binaen)
  duckBGM: () => {},

  toggleMute: () => {
    isMuted = !isMuted;
    Object.values(bgms).forEach(b => b.mute(isMuted));
    
    if (!isMuted && currentBGM && !currentBGM.playing()) {
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
}
