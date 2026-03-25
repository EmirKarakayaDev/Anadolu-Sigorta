import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Home, RefreshCcw, Loader2 } from 'lucide-react';
import { getTopScores, getUserRank } from '../supabase';

export function LeaderboardScreen({ onReset, onPlayAgain, lastSessionId }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRankData, setUserRankData] = useState(null);
    const userRowRef = useRef(null); // Kullanıcının bulunduğu satıra odaklanmak için
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        async function fetchScores() {
            setLoading(true);
            const topScores = await getTopScores(10);
            setScores(topScores);
            
            // Eğer aktif bir oturum varsa ve ilk 10'da değilse sıralamasını çek
            if (lastSessionId) {
                const isInTop10 = topScores.some(s => s.id === lastSessionId);
                if (!isInTop10) {
                    const rankInfo = await getUserRank(lastSessionId);
                    setUserRankData(rankInfo);
                } else {
                    setUserRankData(null);
                }
            }
            setLoading(false);
        }
        fetchScores();
    }, [lastSessionId]);

    // Loading bittiğinde ve veriler geldiğinde kullanıcının satırına odakla
    useEffect(() => {
        if (!loading && userRowRef.current) {
            const timer = setTimeout(() => {
                userRowRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 500); // Animasyonların oturması için ufak bir gecikme
            return () => clearTimeout(timer);
        }
    }, [loading, scores, userRankData]);

    const getRankBadge = (index) => {
        const size = 24;
        switch (index) {
            case 0: return (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.2)', filter: 'blur(8px)' }} />
                    <Trophy size={size} color="#FFD700" style={{ filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' }} />
                </div>
            );
            case 1: return (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Medal size={size} color="#C0C0C0" style={{ filter: 'drop-shadow(0 0 5px rgba(192, 192, 192, 0.4))' }} />
                </div>
            );
            case 2: return (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Medal size={size} color="#CD7F32" style={{ filter: 'drop-shadow(0 0 5px rgba(205, 127, 50, 0.4))' }} />
                </div>
            );
            default: return (
                <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'rgba(0,0,0,0.05)', 
                    color: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.9rem'
                }}>
                    {index + 1}
                </div>
            );
        }
    };

    return (
        <motion.div
            className="brand-layout-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="brand-screen" style={{ height: '100%' }}>
                {/* Top Graphic - Desktop Only for space efficiency */}
                {!isMobile && (
                    <motion.img 
                        src="/logo_trn.png" 
                        alt="Kaybetmek Yok" 
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    />
                )}

                {/* Header Title */}
                <div style={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    marginBottom: '1.2rem',
                    marginTop: isMobile ? '1.5rem' : '0' // Mobilde logo gidince başlığın tavanla bağı
                }}>
                    <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 900, color: 'white', margin: 0 }}>Liderlik Tablosu</h2>
                    <p style={{ 
                        color: 'white', 
                        fontSize: '1.15rem', 
                        margin: '0.3rem 0 0 0', 
                        fontWeight: 800,
                        letterSpacing: '0.5px' 
                    }}>
                        En İyi 10
                    </p>
                </div>

                {/* Score List Container */}
                <motion.div 
                    style={{
                        background: 'white',
                        borderRadius: '2rem',
                        width: '100%',
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        marginBottom: '1.2rem'
                    }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {loading ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px'
                                    }}
                                >
                                    <Loader2 size={40} color="var(--as-blue)" />
                                </motion.div>
                            </div>
                        ) : scores.length > 0 ? (
                            scores.map((s, i) => {
                                const isCurrent = s.id === lastSessionId;
                                return (
                                    <motion.div
                                        key={s.id}
                                        ref={isCurrent ? userRowRef : null}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.8rem 1rem',
                                            background: isCurrent ? 'rgba(33, 88, 217, 0.08)' : 'transparent',
                                            border: isCurrent ? '2px solid var(--as-blue)' : 'none',
                                            borderRadius: '1rem',
                                            margin: isCurrent ? '4px 0' : '0'
                                        }}
                                    >
                                    <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                                        {getRankBadge(i)}
                                    </div>
                                        <div style={{ flex: 1, marginLeft: '1rem', textAlign: 'left' }}>
                                            <div style={{ fontWeight: 800, color: isCurrent ? 'var(--as-blue)' : '#333' }}>
                                                {s.first_name} {s.last_name ? s.last_name[0] + '.' : ''}
                                                {isCurrent && <span style={{ marginLeft: '8px', fontSize: '0.6rem', background: 'var(--as-blue)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>SEN</span>}
                                            </div>
                                        </div>
                                        <div style={{ 
                                            fontWeight: 900, 
                                            fontSize: '1.4rem', 
                                            color: isCurrent ? 'var(--as-blue)' : '#222' 
                                        }}>
                                            {s.score}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                Henüz skor kaydı yok.
                            </div>
                        )}

                        {/* Sizin Sıralamanız (Eğer ilk 10'da değilse) */}
                        {!loading && userRankData && (
                            <div 
                                ref={userRowRef}
                                style={{
                                borderTop: '2px dashed rgba(33, 88, 217, 0.15)',
                                marginTop: '1rem',
                                paddingTop: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: 'rgba(33, 88, 217, 0.05)',
                                    borderRadius: '1.2rem',
                                    border: '1px solid rgba(33, 88, 217, 0.2)'
                                }}>
                                    <div style={{ width: '40px', textAlign: 'center', fontWeight: 900, fontSize: '0.9rem', color: '#666' }}>
                                        {userRankData.rank}.
                                    </div>
                                    <div style={{ flex: 1, marginLeft: '1rem', textAlign: 'left' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--as-blue)', fontSize: '1rem' }}>Sizin Sıralamanız</div>
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--as-blue)' }}>
                                        {userRankData.score}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
 
                {/* Footer Actions - Pushed to bottom */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
                    <button className="btn-primary" onClick={onPlayAgain}>
                        Yeniden Oyna
                    </button>
                    <button className="btn-text-link" onClick={onReset}>
                        <Home size={16} /> Ana Ekran
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

