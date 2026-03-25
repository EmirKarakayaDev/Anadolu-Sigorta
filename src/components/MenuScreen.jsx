import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';
import { Settings, Volume2, VolumeX, X, Sliders } from 'lucide-react';

export function MenuScreen({ onStart, settings, setSettings }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        audioManager.startBGM(1); // Menü müziği başlasın
    }, []);

    const toggleMute = () => {
        const newMute = audioManager.toggleMute();
        setSettings(prev => ({ ...prev, isMuted: newMute }));
    };

    const updateSensitivity = (val) => {
        const sensitivity = parseFloat(val);
        setSettings(prev => ({ ...prev, sensitivity }));
        localStorage.setItem('game_sensitivity', sensitivity);
    };

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="brand-layout-full">
                <div className="brand-screen">
                    {/* Top Logo */}
                    <motion.img
                        src="/beyaz_as_logo.png"
                        alt="Anadolu Sigorta"
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    />

                    {/* Center Graphic */}
                    <motion.div
                        className="main-graphic"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    >
                        <img src="/logo_trn.png" alt="Kaybetmek Yok" style={{ width: '100%' }} />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                    >
                        <button
                            className="btn-primary"
                            onClick={onStart}
                        >
                            Oyuna Başla
                        </button>

                        <button
                            className="btn-text-link"
                            onClick={() => setIsSettingsOpen(true)}
                            style={{ opacity: 0.8 }}
                        >
                            <Settings size={18} /> Ayarlar
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Settings Modal Overlay */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="settings-modal"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="settings-header">
                                <h3>AYARLAR</h3>
                                <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="settings-body">
                                {/* Sound Setting */}
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <Volume2 size={20} />
                                        <span>Ses</span>
                                    </div>
                                    <button 
                                        className={`toggle-btn ${settings.isMuted ? 'off' : 'on'}`}
                                        onClick={toggleMute}
                                    >
                                        {settings.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        {settings.isMuted ? 'Kapalı' : 'Açık'}
                                    </button>
                                </div>

                                {/* Sensitivity Setting */}
                                <div className="setting-item vertical">
                                    <div className="setting-info">
                                        <Sliders size={20} />
                                        <span>Hassasiyet (Kaydırma)</span>
                                        <span className="value-tag">{settings.sensitivity.toFixed(1)}x</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.5" 
                                        max="2.5" 
                                        step="0.1" 
                                        className="sensitivity-slider"
                                        value={settings.sensitivity}
                                        onChange={(e) => updateSensitivity(e.target.value)}
                                    />
                                    <div className="slider-labels">
                                        <span>Yavaş</span>
                                        <span>Hızlı</span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-primary" onClick={() => setIsSettingsOpen(false)} style={{ marginTop: '1rem' }}>
                                Tamam
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
