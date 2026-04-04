import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Loader2, Gift, Plane, Info } from 'lucide-react';
import { getTopScores, getUserRank, getRankByScore } from '../supabase';
import { RewardsModal } from './RewardsModal';

export function LeaderboardScreen({ onReset, onPlayAgain, lastSessionId, isKiosk, isTestSession, finalScore }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRankData, setUserRankData] = useState(null);
    const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
    const userRowRef = useRef(null); // Kullanıcının bulunduğu satıra odaklanmak için
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        async function fetchScores() {
            setLoading(true);
            const topScores = await getTopScores(10);
            setScores(topScores);
            
            // Eğer aktif bir oturum varsa ve ilk 10'da değilse sıralamasını çek
            if (isTestSession) {
                const rankInfo = await getRankByScore(finalScore);
                setUserRankData(rankInfo);
            } else if (lastSessionId) {
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

    // Loading bittiğinde ve veriler gelenlerde kullanıcının satırına odakla
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
        const size = isKiosk ? 48 : 26;
        const idx = Number(index);

        // 1-3: YDS + Koşu Kiti
        if (idx >= 0 && idx <= 2) {
            const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
            return (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx === 0 && <div style={{ position: 'absolute', width: isKiosk ? '65px' : '35px', height: isKiosk ? '65px' : '35px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.2)', filter: 'blur(8px)' }} />}
                    <Gift size={size} color={colors[idx]} style={{ filter: `drop-shadow(0 0 5px ${colors[idx]}66)` }} />
                </div>
            );
        }
        // 4-10: YDS
        if (idx >= 3 && idx <= 9) {
            return (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plane size={size} color="#3A7BD5" style={{ filter: 'drop-shadow(0 0 5px rgba(58, 123, 213, 0.4))' }} />
                </div>
            );
        }

        // 11+: Sadece sıra numarası
        return (
            <div style={{
                width: isKiosk ? '56px' : '32px',
                height: isKiosk ? '56px' : '32px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: isKiosk ? '1.4rem' : '0.9rem'
            }}>
                {idx + 1}
            </div>
        );
    };

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
        <div className="brand-layout-full" style={{ overflowY: 'hidden', paddingBottom: isKiosk ? undefined : 0 }}>
            <div className="brand-screen" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Top Graphic - Desktop Only for space efficiency */}
                {/* Top Brand Logo */}
                <motion.img 
                    src="/as_logo.svg" 
                    alt="Anadolu Sigorta" 
                    className="brand-logo"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ width: isKiosk ? undefined : '180px', height: 'auto', marginBottom: isKiosk ? undefined : '12px' }}
                />

                <div className="leaderboard-mid-block" style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: isKiosk ? '1.5rem' : 0,
                    marginTop: !isKiosk ? (isMobile ? '1.5rem' : '0') : undefined,
                }}>

                {/* Header Title + Subtitle Group */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isKiosk ? '0.5rem' : '0.2rem',
                    marginBottom: isKiosk ? '0' : '1rem'
                }}>
                    <div style={{
                        width: '100%',
                        position: 'relative',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <h2 style={{ fontSize: isKiosk ? '3.5rem' : (isMobile ? '1.8rem' : '2.2rem'), fontWeight: 900, color: 'white', margin: 0 }}>Liderlik Tablosu</h2>
                        <button
                            onClick={() => setIsRewardsModalOpen(true)}
                            style={{
                                position: 'absolute',
                                right: 0,
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.4)',
                                borderRadius: '50%',
                                width: isKiosk ? '80px' : '38px',
                                height: isKiosk ? '80px' : '38px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <Info size={isKiosk ? 40 : 22} />
                        </button>
                    </div>

                    <p style={{
                        color: 'white',
                        fontSize: isKiosk ? '1.8rem' : '1.15rem',
                        margin: 0,
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                        textAlign: 'center'
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
                        minHeight: 0, // Crucial for inner scroll
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        marginBottom: isKiosk ? '0' : '1.2rem'
                    }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '1rem' }}>
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
                                            padding: isKiosk ? '1.5rem 2rem' : '0.8rem 1rem',
                                            background: isCurrent ? 'rgba(33, 88, 217, 0.08)' : 'transparent',
                                            border: isCurrent ? '2px solid var(--as-blue)' : 'none',
                                            borderRadius: isKiosk ? '2rem' : '1rem',
                                            margin: isCurrent ? '8px 0' : '0'
                                        }}
                                    >
                                    <div style={{ width: isKiosk ? '80px' : '40px', display: 'flex', justifyContent: 'center' }}>
                                        {getRankBadge(i)}
                                    </div>
                                        <div style={{ flex: 1, marginLeft: isKiosk ? '2rem' : '1rem', textAlign: 'left' }}>
                                            <div style={{ fontWeight: 800, fontSize: isKiosk ? '1.8rem' : '1rem', color: isCurrent ? 'var(--as-blue)' : '#333' }}>
                                                {s.first_name} {s.last_name ? s.last_name[0] + '.' : ''}
                                                {isCurrent && <span style={{ marginLeft: '12px', fontSize: isKiosk ? '0.9rem' : '0.6rem', background: 'var(--as-blue)', color: 'white', padding: '4px 12px', borderRadius: '20px' }}>SEN</span>}
                                            </div>
                                        </div>
                                        <div style={{ 
                                            fontWeight: 900, 
                                            fontSize: isKiosk ? '2.5rem' : '1.4rem', 
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
                                ref={userRankData.rank > 10 ? userRowRef : null} // Sadece ilk 10'da değilse buraya odaklan
                                style={{
                                borderTop: '2px dashed rgba(33, 88, 217, 0.15)',
                                marginTop: '1rem',
                                paddingTop: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: isKiosk ? '1.5rem 2rem' : '0.8rem 1rem',
                                    background: 'rgba(33, 88, 217, 0.05)',
                                    borderRadius: isKiosk ? '2rem' : '1.2rem',
                                    border: '1px solid rgba(33, 88, 217, 0.2)'
                                }}>
                                    <div style={{ width: isKiosk ? '80px' : '40px', display: 'flex', justifyContent: 'center' }}>
                                        {getRankBadge(userRankData.rank - 1)}
                                    </div>
                                    <div style={{ flex: 1, marginLeft: isKiosk ? '2rem' : '1rem', textAlign: 'left' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--as-blue)', fontSize: isKiosk ? '1.8rem' : '1rem' }}>Sizin Sıralamanız</div>
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: isKiosk ? '2.5rem' : '1.4rem', color: 'var(--as-blue)' }}>
                                        {userRankData.score}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
 
                </div>{/* /leaderboard-mid-block */}

                {/* Footer Actions */}
                <div className="action-group" style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isKiosk ? '1.5rem' : '0.8rem',
                    marginTop: isKiosk ? '1.5rem' : 'auto',
                    paddingBottom: isKiosk ? '1rem' : '0'
                }}>
                    {!isKiosk && (
                        <button className="btn-primary" onClick={onPlayAgain}>
                            Yeniden Oyna
                        </button>
                    )}
                    <button className={isKiosk ? "btn-primary" : "btn-text-link"} onClick={onReset} style={isKiosk ? { fontSize: '1.4rem' } : {}}>
                        <Home size={isKiosk ? 24 : 16} style={{ marginRight: isKiosk ? '12px' : '4px' }} /> Ana Ekran
                    </button>
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
        </div>
        </motion.div>
    );
}

