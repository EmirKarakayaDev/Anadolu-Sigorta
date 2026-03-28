import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../utils/audioManager';
import { Info } from 'lucide-react';
import { RewardsModal } from './RewardsModal';

export function MenuScreen({ onStart, isKiosk }) {
    const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

    useEffect(() => {
        audioManager.startBGM(1); // Menü müziği başlasın
    }, []);

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

                    {/* Action Button */}
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
                            onClick={() => setIsRewardsModalOpen(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '30px',
                                padding: isKiosk ? '16px 36px' : '8px 20px',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: isKiosk ? '12px' : '8px',
                                cursor: 'pointer',
                                fontSize: isKiosk ? '1.6rem' : '0.9rem',
                                fontWeight: 600,
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <Info size={isKiosk ? 32 : 18} /> Ödülleri Gör
                        </button>
                    </motion.div>
                </div>
            </div>

            {isKiosk && (
                <motion.img
                    src="/logo_trn.png"
                    alt="Kaybetmek Yok"
                    className="brand-logo kiosk-logo-fixed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                />
            )}

            <RewardsModal isOpen={isRewardsModalOpen} onClose={() => setIsRewardsModalOpen(false)} isKiosk={isKiosk} />
        </motion.div>
    );
}
