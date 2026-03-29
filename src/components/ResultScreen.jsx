import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Trophy, Home, Info } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { RewardsModal } from './RewardsModal';

export function ResultScreen({ score, onReset, onPlayAgain, onShowLeaderboard, isKiosk }) {
    const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

    useEffect(() => {
        audioManager.startBGM(4); // Skor ekranı müziğine geç (BGM 4)
    }, []);

    const isMobile = window.innerWidth < 768;

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
        <div className="brand-layout-full" style={{ paddingBottom: isKiosk ? undefined : 0 }}>
            <div className="brand-screen">
                {/* Top Graphic - Fixed at top like Menu Logo */}
                {/* Top Brand Logo */}
                <motion.img 
                    src="/beyaz_as_logo.png" 
                    alt="Anadolu Sigorta" 
                    className="brand-logo"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ width: isKiosk ? '280px' : '180px', height: 'auto', marginBottom: isKiosk ? '2rem' : '1rem' }}
                />

                {/* Main Content (Score) - Centered in remaining space */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <motion.div
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: isKiosk ? '0' : '0'
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div style={{ 
                        width: '100%', 
                        position: 'relative', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: isKiosk ? '2rem' : '1.2rem'
                    }}>
                        <h2 style={{ 
                            fontSize: isKiosk ? '3.5rem' : (isMobile ? '1.8rem' : '2.5rem'), 
                            fontWeight: 900, 
                            color: 'white',
                            margin: 0,
                            textAlign: 'center',
                            textShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}>
                            {score === 0 ? 'OYUN BİTTİ!' : 'TEBRİKLER!'}
                        </h2>
                        <button 
                            onClick={() => setIsRewardsModalOpen(true)}
                            style={{ 
                                position: 'absolute',
                                right: 0,
                                background: 'rgba(255,255,255,0.2)', 
                                border: '1px solid rgba(255,255,255,0.4)', 
                                borderRadius: '50%', 
                                width: isKiosk ? '64px' : '36px', 
                                height: isKiosk ? '64px' : '36px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <Info size={isKiosk ? 32 : 20} />
                        </button>
                    </div>

                    {/* Score Card */}
                    <div style={{
                        background: 'white',
                        padding: isKiosk ? '3rem' : (isMobile ? '1.5rem' : '2rem'),
                        borderRadius: isKiosk ? '3rem' : '2rem',
                        width: '100%',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isKiosk ? '1.5rem' : '0.8rem'
                    }}>
                        <span style={{ color: 'var(--as-blue)', fontWeight: 900, fontSize: isKiosk ? '2.2rem' : '1.2rem', letterSpacing: '4px', opacity: 0.7 }}>FİNAL SKORU</span>
                        <span style={{ 
                            fontSize: isKiosk ? '7.5rem' : (isMobile ? '4.5rem' : '5rem'), 
                            fontWeight: 900, 
                            color: 'var(--as-blue)',
                            lineHeight: 1
                        }}>
                            {score}
                        </span>
                    </div>
                </motion.div>
                </div>

                {/* Actions */}
                <motion.div 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: isKiosk ? '1.2rem' : '0.8rem',
                        alignItems: 'center',
                        marginTop: isKiosk ? '4rem' : 'auto' // Kioskta dikey merkezleme için auto'yu kaldırdık
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <button className="btn-primary" onClick={onShowLeaderboard}>
                        Skor Tablosu
                    </button>
 
                    {!isKiosk && (
                        <button className="btn-outline" onClick={onPlayAgain}>
                            Yeniden Oyna 
                        </button>
                    )}
 
                    <button className={isKiosk ? "btn-outline" : "btn-text-link"} onClick={onReset}>
                        <Home size={isKiosk ? 24 : 16} style={{ marginRight: isKiosk ? '12px' : '4px' }} /> Ana Ekran
                    </button>
                </motion.div>
            </div>

            {isKiosk && (
                <motion.img
                    src="/logo_trn.png"
                    alt="Anadolu Sigorta"
                    className="brand-logo kiosk-logo-fixed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                />
            )}

            <RewardsModal isOpen={isRewardsModalOpen} onClose={() => setIsRewardsModalOpen(false)} isKiosk={isKiosk} />
        </div>
        </motion.div>
    );
}

