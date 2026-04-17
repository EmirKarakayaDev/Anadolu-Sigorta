import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

export function MenuScreen({ onStart, isKiosk, savedUserData, onContinueWithSaved, onChangeSavedData }) {
    useEffect(() => {
        if (isKiosk) audioManager.unmute(); // Kioskte her ana sayfaya dönüşte sesi aç
        audioManager.startBGM(1);
    }, []);

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="brand-layout-full" style={{ paddingBottom: isKiosk ? undefined : 0 }}>
                <div className="brand-screen">
                    {/* Top Logo */}
                    <motion.img
                        src="/as_logo.svg"
                        alt="Anadolu Sigorta"
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    />

                    {/* Center Graphic — flex:1 wrapper ile logo ve butonlar arasında tam ortada */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <motion.div
                            className="main-graphic"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                        >
                            <img src="/logo_trn.png" alt="Kaybetmek Yok" style={{ width: '100%' }} />
                        </motion.div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        className="action-group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingBottom: isKiosk ? '1rem' : '0' }}
                    >
                        {!isKiosk && savedUserData ? (
                            <>
                                <div style={{
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '16px',
                                    padding: '12px 20px',
                                    width: '100%',
                                    textAlign: 'center',
                                    color: 'white',
                                }}>
                                    <div style={{ fontSize: '0.78rem', opacity: 0.7, marginBottom: '2px' }}>Kayıtlı oyuncu</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                        {savedUserData.firstName} {savedUserData.lastName}
                                    </div>
                                </div>
                                <button className="btn-primary" onClick={onContinueWithSaved}>
                                    Devam Et
                                </button>
                                <button
                                    className="btn-outline"
                                    onClick={onChangeSavedData}
                                    style={{ width: '100%' }}
                                >
                                    Farklı Oyuncu
                                </button>
                            </>
                        ) : (
                            <button className="btn-primary" onClick={onStart}>
                                Oyuna Başla
                            </button>
                        )}

                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
