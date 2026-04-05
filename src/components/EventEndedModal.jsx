import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plane, X } from 'lucide-react';

const COMPETITION_TOP10 = [
    { first_name: 'Oguzhan', last_name: 'Yıldırım', score: 9300 },
    { first_name: 'Emir', last_name: 'Karakaya', score: 9250 },
    { first_name: 'Sedanur', last_name: 'Şentürk', score: 7650 },
    { first_name: 'Gizem', last_name: 'Gül', score: 6900 },
    { first_name: 'Tufan', last_name: 'Gül', score: 6150 },
    { first_name: 'Özge', last_name: 'Kaygısız', score: 5550 },
    { first_name: 'Oğuzhan', last_name: 'Nacak', score: 5450 },
    { first_name: 'Serdar', last_name: 'Yıldız', score: 4950 },
    { first_name: 'Egemen', last_name: 'Fedakar', score: 4650 },
    { first_name: 'İsmail Gökalp', last_name: 'Selen', score: 4500 },
];

function getRankBadge(index, isKiosk) {
    const size = isKiosk ? 40 : 22;
    if (index <= 2) {
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        return (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {index === 0 && (
                    <div style={{
                        position: 'absolute',
                        width: isKiosk ? '55px' : '30px',
                        height: isKiosk ? '55px' : '30px',
                        borderRadius: '50%',
                        background: 'rgba(255, 215, 0, 0.2)',
                        filter: 'blur(8px)'
                    }} />
                )}
                <Gift size={size} color={colors[index]} style={{ filter: `drop-shadow(0 0 5px ${colors[index]}66)` }} />
            </div>
        );
    }
    if (index <= 9) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={size} color="#3A7BD5" style={{ filter: 'drop-shadow(0 0 5px rgba(58,123,213,0.4))' }} />
            </div>
        );
    }
    return (
        <div style={{
            width: isKiosk ? '44px' : '26px',
            height: isKiosk ? '44px' : '26px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.06)',
            color: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: isKiosk ? '1.2rem' : '0.8rem'
        }}>
            {index + 1}
        </div>
    );
}

export function EventEndedModal({ isOpen, onClose, isKiosk }) {
    const [view, setView] = useState('announcement');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="event-ended-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: isKiosk ? '3rem' : '1.5rem'
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        key={view}
                        initial={{ scale: 0.92, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 16 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        style={{
                            background: 'white',
                            borderRadius: isKiosk ? '3rem' : '2rem',
                            width: '100%',
                            maxWidth: isKiosk ? '780px' : '420px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
                        }}
                    >
                        {view === 'announcement' ? (
                            <AnnouncementView
                                isKiosk={isKiosk}
                                onShowLeaderboard={() => setView('leaderboard')}
                                onClose={onClose}
                            />
                        ) : (
                            <LeaderboardView
                                isKiosk={isKiosk}
                                onBack={() => setView('announcement')}
                                onClose={onClose}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function AnnouncementView({ isKiosk, onShowLeaderboard, onClose }) {
    return (
        <>
            {/* Header */}
            <div style={{
                background: 'var(--as-blue)',
                padding: isKiosk ? '2.5rem 3rem' : '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <h2 style={{
                    color: 'white',
                    margin: 0,
                    fontWeight: 900,
                    fontSize: isKiosk ? '2.6rem' : '1.4rem'
                }}>
                    Etkinlik Sona Erdi
                </h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '50%',
                        width: isKiosk ? '64px' : '38px',
                        height: isKiosk ? '64px' : '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    <X size={isKiosk ? 32 : 20} />
                </button>
            </div>

            {/* Body */}
            <div style={{
                padding: isKiosk ? '3rem' : '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: isKiosk ? '2rem' : '1.2rem',
                flex: 1,
                overflowY: 'auto'
            }}>
                <p style={{
                    color: '#333',
                    fontSize: isKiosk ? '1.8rem' : '1rem',
                    lineHeight: 1.65,
                    margin: 0,
                    fontWeight: 500
                }}>
                    Etkinliğimiz sona ermiştir. Yarışma sonuçlarını aşağıdaki butondan görebilirsiniz. Katılımcılara teşekkür ederiz.
                </p>

                <div style={{
                    background: 'rgba(33, 88, 217, 0.07)',
                    border: '1px solid rgba(33, 88, 217, 0.18)',
                    borderRadius: isKiosk ? '1.5rem' : '1rem',
                    padding: isKiosk ? '1.8rem 2rem' : '1rem 1.2rem'
                }}>
                    <p style={{
                        color: 'var(--as-blue)',
                        fontSize: isKiosk ? '1.5rem' : '0.88rem',
                        margin: 0,
                        fontWeight: 600,
                        lineHeight: 1.6
                    }}>
                        Oyun hâlâ açık! Global liderlik tablosunda yerini almak için oynamaya devam edebilirsin.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: isKiosk ? '1rem' : '0.7rem', marginTop: isKiosk ? '1rem' : '0.4rem' }}>
                    <button
                        className="btn-primary"
                        onClick={onShowLeaderboard}
                    >
                        Yarışma Sonuçlarını Gör
                    </button>
                    <button
                        className="btn-outline"
                        onClick={onClose}
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </>
    );
}

function LeaderboardView({ isKiosk, onClose }) {
    return (
        <>
            {/* Header */}
            <div style={{
                background: 'var(--as-blue)',
                padding: isKiosk ? '2.5rem 3rem' : '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexShrink: 0
            }}>
                <h2 style={{
                    color: 'white',
                    margin: 0,
                    fontWeight: 900,
                    fontSize: isKiosk ? '2.2rem' : '1.3rem'
                }}>
                    Yarışma Sonuçları
                </h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '50%',
                        width: isKiosk ? '56px' : '34px',
                        height: isKiosk ? '56px' : '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    <X size={isKiosk ? 28 : 18} />
                </button>
            </div>

            {/* Scores */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: isKiosk ? '2rem 2.5rem' : '1rem 1.2rem' }}>
                {COMPETITION_TOP10.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: isKiosk ? '1.2rem 1.5rem' : '0.7rem 0.8rem',
                            borderRadius: isKiosk ? '1.5rem' : '0.8rem',
                            marginBottom: isKiosk ? '0.6rem' : '0.3rem',
                            background: i < 3 ? `rgba(${i === 0 ? '255,215,0' : i === 1 ? '192,192,192' : '205,127,50'}, 0.08)` : 'transparent'
                        }}
                    >
                        <div style={{ width: isKiosk ? '64px' : '36px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                            {getRankBadge(i, isKiosk)}
                        </div>
                        <div style={{ flex: 1, marginLeft: isKiosk ? '1.5rem' : '0.8rem', textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: isKiosk ? '1.6rem' : '0.95rem', color: '#222' }}>
                                {s.first_name} {s.last_name ? s.last_name[0] + '.' : ''}
                            </div>
                        </div>
                        <div style={{
                            fontWeight: 900,
                            fontSize: isKiosk ? '2rem' : '1.2rem',
                            color: i < 3 ? (i === 0 ? '#B8860B' : i === 1 ? '#666' : '#8B4513') : '#222'
                        }}>
                            {s.score}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
