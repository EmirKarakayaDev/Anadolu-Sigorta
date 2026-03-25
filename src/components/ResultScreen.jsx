import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Trophy, Home } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export function ResultScreen({ score, onReset, onPlayAgain, onShowLeaderboard }) {
    useEffect(() => {
        audioManager.startBGM(4); // Skor ekranı müziğine geç (BGM 4)
    }, []);

    const isMobile = window.innerWidth < 768;

    return (
        <motion.div
            className="brand-layout-full" // Regular layout like Menu (3rem top, 0 bottom)
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="brand-screen">
                {/* Top Graphic - Fixed at top like Menu Logo */}
                <motion.img 
                    src="/logo_trn.png" 
                    alt="Kaybetmek Yok" 
                    className="brand-logo"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                />

                {/* Main Content (Score) - Centered in remaining space */}
                <motion.div 
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '1.5rem' // Logo ile metin grubu arasındaki mesafe
                    }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 style={{ 
                        fontSize: isMobile ? '1.8rem' : '2.5rem', 
                        fontWeight: 900, 
                        color: 'white',
                        margin: '0 0 1.2rem 0', // Alttaki box ile mesafe
                        textShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                        {score === 0 ? 'OYUN BİTTİ!' : 'TEBRİKLER!'}
                    </h2>

                    {/* Score Card */}
                    <div style={{
                        background: 'white',
                        padding: isMobile ? '1.5rem' : '2rem',
                        borderRadius: '2rem',
                        width: '100%',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ color: 'var(--as-blue)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '2px' }}>FİNAL SKORU</span>
                        <span style={{ 
                            fontSize: isMobile ? '4.5rem' : '5rem', 
                            fontWeight: 900, 
                            color: 'var(--as-blue)',
                            lineHeight: 1
                        }}>
                            {score}
                        </span>
                    </div>
                </motion.div>
 
                {/* Actions */}
                <motion.div 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.8rem',
                        marginTop: 'auto' // Butonları en alta iter
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <button className="btn-primary" onClick={onPlayAgain}>
                        Yeniden Oyna 
                    </button>
 
                    <button className="btn-outline" onClick={onShowLeaderboard}>
                        Skor Tablosu
                    </button>
 
                    <button className="btn-text-link" onClick={onReset}>
                        <Home size={16} /> Ana Ekran
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

