import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { EventEndedModal } from './EventEndedModal';
import { RewardsModal } from './RewardsModal';

export function MenuScreen({ onStart, isKiosk, savedUserData, onContinueWithSaved, onChangeSavedData, eventEnded }) {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

    useEffect(() => {
        if (isKiosk) audioManager.unmute();
        audioManager.startBGM(1);

        if (eventEnded && !sessionStorage.getItem('event_ended_shown')) {
            sessionStorage.setItem('event_ended_shown', '1');
            setIsEventModalOpen(true);
        }
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
                    <motion.img
                        src="/as_logo.svg"
                        alt="Anadolu Sigorta"
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    />

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
                                <button className="btn-outline" onClick={onChangeSavedData} style={{ width: '100%' }}>
                                    Farklı Oyuncu
                                </button>
                            </>
                        ) : (
                            <button className="btn-primary" onClick={onStart}>
                                Oyuna Başla
                            </button>
                        )}

                        {eventEnded && (
                            <button
                                onClick={() => setIsEventModalOpen(true)}
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
                                Yarışma Sonuçları
                            </button>
                        )}
                        {!eventEnded && (
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
                        )}
                    </motion.div>
                </div>
            </div>

            <EventEndedModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} isKiosk={isKiosk} />
            <RewardsModal isOpen={isRewardsModalOpen} onClose={() => setIsRewardsModalOpen(false)} isKiosk={isKiosk} />
        </motion.div>
    );
}
