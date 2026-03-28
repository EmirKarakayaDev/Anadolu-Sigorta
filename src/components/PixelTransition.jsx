import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../utils/audioManager';

export function PixelTransition({ onMidpoint, onComplete, isKiosk }) {
    const [phase, setPhase] = useState('entering');

    useEffect(() => {
        audioManager.play('gecis'); // Geçiş sesini SADECE BİR KEZ (başlangıçta) çal
    }, []);

    useEffect(() => {
        if (phase === 'entering') {
            const timer = setTimeout(() => {
                setPhase('covering');
                onMidpoint();

                setTimeout(() => {
                    setPhase('exiting');
                }, 600);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [phase, onMidpoint]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--as-blue)',
                boxShadow: '0 0 100px rgba(0,0,0,0.5)'
            }}
            initial={{ y: '100%' }}
            animate={phase === 'exiting' ? { y: '-100%' } : { y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }}
            onAnimationComplete={() => {
                if (phase === 'exiting') {
                    onComplete();
                }
            }}
        >
            <AnimatePresence>
                {phase !== 'exiting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <img 
                            src="/logo_trn.png" 
                            alt="Anadolu Sigorta" 
                            style={{ 
                                width: isKiosk ? '80vw' : '60vw', 
                                maxWidth: isKiosk ? '600px' : '300px',
                                filter: isKiosk ? 'drop-shadow(0 0 40px rgba(255,255,255,0.4))' : 'drop-shadow(0 0 20px rgba(255,255,255,0.4))'
                            }} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
