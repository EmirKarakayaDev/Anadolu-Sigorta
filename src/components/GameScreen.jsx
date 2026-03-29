import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTetris } from '../game/useTetris';
import { CanvasRenderer } from './CanvasRenderer';
import { COLS, ROWS, BLOCK_SIZE, COLORS, SHAPES, PIECE_ASSETS, PIECE_DIMENSIONS } from '../game/constants';
import { Trophy, Clock, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export function GameScreen({ onGameOver, isKiosk }) {
    const [timeLeft, setTimeLeft] = useState(120);
    const [countdown, setCountdown] = useState(3);
    const [isCounting, setIsCounting] = useState(true);
    const [isMuted, setIsMuted] = useState(audioManager.getMuteStatus());

    const {
        grid, activePiece, ghostPiece, trail, clearingLines, clearingStage, nextPieces,
        score, gameOver, isSettling, feedback, isFastMode, setIsFastMode,
        move, rotate, drop, hardDrop, triggerGameOver
    } = useTetris({ isPaused: isCounting });

    const [images, setImages] = useState({});
    const [imagesReady, setImagesReady] = useState(false);

    // SVG dosyalarını offscreen canvas'a önceden render et.
    // Chrome/Windows'ta SVG'lerin naturalWidth=0 dönmesi sorununu çözer.
    // Canvas .width/.height her zaman güvenilirdir.
    // DPR'a göre boyutlandırılır → yüksek yoğunluklu ekranlarda keskinlik.
    useEffect(() => {
        const loadedImages = {};
        let loadedCount = 0;
        const pieceKeys = Object.keys(PIECE_ASSETS);
        const total = pieceKeys.length;
        const dpr = window.devicePixelRatio || 1;
        const CELL_PX = Math.min(400, Math.ceil(200 * dpr)); // max 400px (bellek koruması)

        const finalize = () => {
            setImages(loadedImages);
            setImagesReady(true);
        };

        pieceKeys.forEach((type) => {
            const img = new Image();
            const dims = PIECE_DIMENSIONS[type];
            img.onload = () => {
                const offscreen = document.createElement('canvas');
                offscreen.width = dims.w * CELL_PX;
                offscreen.height = dims.h * CELL_PX;
                const ctx2d = offscreen.getContext('2d');
                ctx2d.imageSmoothingEnabled = true;
                ctx2d.imageSmoothingQuality = 'high';
                ctx2d.drawImage(img, 0, 0, offscreen.width, offscreen.height);
                loadedImages[type] = offscreen;
                loadedCount++;
                if (loadedCount === total) finalize();
            };
            img.onerror = () => {
                // Görsel yüklenemese bile oyunu bloklamaz
                loadedCount++;
                if (loadedCount === total) finalize();
            };
            img.src = PIECE_ASSETS[type];
        });
    }, []);

    // Arka plan rengini Anadolu Sigorta mavisine sabitle
    useEffect(() => {
        // Set body background color as fallback
        document.body.style.backgroundColor = 'var(--as-blue)';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver || isCounting) return; // Lock inputs during countdown
            if (e.key === 'ArrowLeft') move(-1);
            if (e.key === 'ArrowRight') move(1);
            if (e.key === 'ArrowUp') rotate();
            if (e.key === 'ArrowDown') drop();
            if (e.key === ' ') hardDrop();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move, rotate, drop, hardDrop, gameOver, isCounting]);

    const gameOverTriggeredRef = useRef(false);

    const audioPlayOnceRef = useRef(false);
    // Geri sayım ve müzik yönetimi.
    // Görseller tamamen hazır olmadan geri sayım başlamaz → animasyon ve
    // ilk parça, main thread yükleme baskısı olmadan pürüzsüz çalışır.
    useEffect(() => {
        if (!imagesReady) return;

        audioManager.stopBGM();

        if (!audioPlayOnceRef.current) {
            audioManager.play('countdown');
            audioPlayOnceRef.current = true;
        }

        let bgmTimeout = null;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsCounting(false);
                    bgmTimeout = setTimeout(() => {
                        audioManager.startBGM(2);
                    }, 50);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (bgmTimeout) clearTimeout(bgmTimeout);
        };
    }, [imagesReady]);

    // Hız moduna göre müziği değiştir (Normal vs 2x)
    useEffect(() => {
        if (!isCounting && !gameOver) {
            audioManager.startBGM(isFastMode ? 3 : 2);
        }
    }, [isFastMode, isCounting, gameOver]);

    // Timer logic
    // Oyun zamanlayıcısı ve bitiş senaryosu
    useEffect(() => {
        let gameFinishTimeout = null;
        let finalTransitionTimeout = null;

        if (isCounting) return;

        if (timeLeft <= 0 || gameOver) {
            if (!gameOverTriggeredRef.current) {
                gameOverTriggeredRef.current = true;

                gameFinishTimeout = setTimeout(() => {
                    if (!gameOver) triggerGameOver();

                    // Yazının ekranda kalma süresinden sonra skor ekranına geç
                    finalTransitionTimeout = setTimeout(() => {
                        onGameOver(score);
                    }, 1500);
                }, 500);
            }
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => {
            clearInterval(timer);
            if (gameFinishTimeout) clearTimeout(gameFinishTimeout);
            if (finalTransitionTimeout) clearTimeout(finalTransitionTimeout);
            if (!gameOver && timeLeft > 0) gameOverTriggeredRef.current = false;
        };
    }, [timeLeft, gameOver, onGameOver, score, isCounting]);

    useEffect(() => {
        if (!gameOver) {
            gameOverTriggeredRef.current = false;
        }
    }, [gameOver]);

    // Interaction handlers (Unified Pointer Events)
    const lastX = useRef(0);
    const lastY = useRef(0);
    const interactionStartRef = useRef(null);
    const lastRotateTime = useRef(0);

    const handlePointerDown = (e) => {
        if (!e.isPrimary || isCounting) return;

        interactionStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            time: Date.now(),
            totalDist: 0,
            lock: null
        };
        lastX.current = e.clientX;
        lastY.current = e.clientY;
    };

    const handlePointerMove = (e) => {
        const interaction = interactionStartRef.current;
        if (!interaction || isCounting) return;

        const totalDx = Math.abs(e.clientX - interaction.x);
        const totalDy = Math.abs(e.clientY - interaction.y);

        interaction.totalDist = Math.max(interaction.totalDist || 0, totalDx, totalDy);

        // Thresholds based on platform - Heavily increased for Kiosk to give more weight/control
        const moveThreshold = isKiosk ? 60 : 25;
        const dropThreshold = isKiosk ? 80 : 30;
        const lockThreshold = isKiosk ? 40 : 15;

        if (!interaction.lock) {
            if (totalDx > lockThreshold) interaction.lock = 'horizontal';
            else if (totalDy > lockThreshold) interaction.lock = 'vertical';
        }

        // Horizontal Movement (Continuous Swipe Support)
        if (interaction.lock === 'horizontal' || (!interaction.lock && totalDx > lockThreshold)) {
            const dragDist = e.clientX - lastX.current;
            const steps = Math.floor(Math.abs(dragDist) / moveThreshold);

            if (steps > 0) {
                const dir = dragDist > 0 ? 1 : -1;
                for (let i = 0; i < steps; i++) {
                    move(dir);
                }
                // Update reference by the exact steps distance to keep it steady
                lastX.current += steps * moveThreshold * dir;
            }
        }

        // Vertical Movement (Continuous Soft Drop Support)
        if (interaction.lock === 'vertical' || (!interaction.lock && totalDy > lockThreshold)) {
            const dragDistY = e.clientY - lastY.current;
            const stepsY = Math.floor(Math.abs(dragDistY) / dropThreshold);

            if (stepsY > 0 && dragDistY > 0) { // Only drop downwards
                for (let i = 0; i < stepsY; i++) {
                    drop();
                }
                lastY.current += stepsY * dropThreshold;
            }
        }
    };

    const handlePointerUp = (e) => {
        const interaction = interactionStartRef.current;
        if (!interaction || isCounting) return;

        const dy = e.clientY - interaction.y;
        const dt = Date.now() - interaction.time;
        const now = Date.now();
        const velocityY = dy / (dt || 1); // pixels per ms

        const tapThreshold = isKiosk ? 30 : 15;
        const flickThreshold = isKiosk ? 240 : 100;
        const velocityThreshold = isKiosk ? 1.0 : 0.8;

        if (interaction.totalDist < tapThreshold && (now - lastRotateTime.current > 200)) {
            rotate();
            lastRotateTime.current = now;
        }
        // HARD DROP: High speed flick
        else if (velocityY > velocityThreshold && dy > flickThreshold) {
            hardDrop();
        }

        interactionStartRef.current = null;
    };

    return (
        <motion.div
            className="brand-layout-full no-select game-screen-layout"
            style={{
                touchAction: 'none',
                position: 'relative',
                height: '100dvh',
                overflow: 'hidden',
                justifyContent: 'flex-start'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { interactionStartRef.current = null; }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Global Countdown Overlay */}
            <AnimatePresence>
                {isCounting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: isKiosk ? '42px' : '0',
                            paddingBottom: isKiosk ? '600px' : '0',
                            background: 'transparent', // Karartma kaldırıldı
                            pointerEvents: 'none'
                        }}
                    >
                        <motion.span
                            style={{
                                color: '#FFFFFF',
                                fontSize: isKiosk ? '2.8rem' : '1.4rem',
                                fontWeight: 900,
                                letterSpacing: '5px',
                                marginBottom: isKiosk ? '6rem' : '1.5rem',
                                textShadow: '4px 4px 0px #1D1D46'
                            }}
                        >
                            HAZIR MISIN?
                        </motion.span>
                        <div style={{
                            position: 'relative',
                            height: '10rem',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <AnimatePresence>
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 3, opacity: 0, rotate: -30 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 0.2, opacity: 0, rotate: 30 }}
                                    transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
                                    style={{
                                        position: 'absolute',
                                        fontSize: isKiosk ? '18rem' : '12rem',
                                        fontWeight: 900,
                                        // Ana dolgu ve Desen (Diamond Pattern simülasyonu)
                                        background: `
                                            linear-gradient(135deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%) -10px 0,
                                            linear-gradient(225deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%) -10px 0,
                                            linear-gradient(315deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%),
                                            linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%),
                                            linear-gradient(to bottom, #FFD166, #F7B500, #F27121)
                                        `,
                                        backgroundSize: '20px 20px, 20px 20px, 20px 20px, 20px 20px, 100% 100%',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        // Çok katmanlı çerçeve ve gölge (Sticker etkisi)
                                        filter: `
                                            /* Koyu Lacivert İç Kontur */
                                            drop-shadow(2px 2px 0px #1D1D46) 
                                            drop-shadow(-2px -2px 0px #1D1D46) 
                                            drop-shadow(2px -2px 0px #1D1D46) 
                                            drop-shadow(-2px 2px 0px #1D1D46)
                                            /* Kalın Beyaz Dış Çerçeve */
                                            drop-shadow(4px 4px 0px #FFFFFF)
                                            drop-shadow(-4px -4px 0px #FFFFFF)
                                            drop-shadow(4px -4px 0px #FFFFFF)
                                            drop-shadow(-4px 4px 0px #FFFFFF)
                                            drop-shadow(0px 0px 20px rgba(0,0,0,0.3))
                                        `,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1
                                    }}
                                >
                                    {countdown > 0 ? countdown : ''}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={isKiosk ? "brand-screen" : "game-container"}
                style={!isKiosk ? {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.2rem',
                    width: '100%',
                    maxWidth: '500px',
                    flex: 1,
                    padding: 0
                } : {}}
            >
                {/* Top Statistics Bar */}
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    style={{
                        display: 'flex',
                        gap: isKiosk ? '15px' : '8px',
                        width: '100%',
                        maxWidth: isKiosk ? '700px' : '100%',
                        margin: isKiosk ? '0 auto' : '0',
                        alignItems: 'stretch',
                        height: isKiosk ? '140px' : '82px',
                        position: 'relative'
                    }}
                >
                    {/* Left: Score */}
                    <div className="glass-panel" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: isKiosk ? '3px solid rgba(255, 255, 255, 0.6)' : '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: isKiosk ? '8px' : '4px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'none'
                    }}>
                        <span style={{ fontSize: isKiosk ? '1.4rem' : '0.75rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Skor</span>
                        <span style={{ fontSize: isKiosk ? '3rem' : '1.4rem', fontWeight: 900 }}>{score}</span>
                    </div>

                    {/* Center: Timer */}
                    <div className="glass-panel" style={{
                        flex: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: isKiosk ? '3px solid rgba(255, 255, 255, 0.6)' : '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: isKiosk ? '8px' : '4px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'none'
                    }}>
                        <span style={{ fontSize: isKiosk ? '1.4rem' : '0.75rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Süre</span>
                        <span style={{ fontSize: isKiosk ? '3rem' : '1.4rem', fontWeight: 900 }}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>

                    {/* Right: Next Piece */}
                    <div className="glass-panel" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: isKiosk ? '3px solid rgba(255, 255, 255, 0.6)' : '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: isKiosk ? '8px' : '4px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'none',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <span style={{ fontSize: isKiosk ? '1.4rem' : '0.75rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Sıradaki</span>
                        <div style={{ padding: '0px', height: isKiosk ? '72px' : '36px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {nextPieces[0] && (
                                <NextPiecePreview piece={nextPieces[0]} images={images} isKiosk={isKiosk} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Game Area Wrapper - flex:1 to fill remaining space, board centered inside */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    pointerEvents: 'none' // Transparent to gestures
                }}>
                    <div className="game-main-area" style={{ position: 'relative', pointerEvents: 'none' }}>
                        {/* Floating Score Feedback */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    key={feedback.id}
                                    initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -5 }}
                                    animate={{ opacity: 1, y: -20, scale: 1.2, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.5, y: -100 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        position: 'absolute',
                                        top: '40%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 100,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{
                                        background: feedback.text.includes('BİTTİ') ? 'var(--primary)' : (feedback.text === 'TETRIS' ? 'linear-gradient(to bottom, #FF8C42, #FF5E5B)' : 'var(--secondary)'),
                                        color: 'white',
                                        padding: '1.2rem 2.5rem',
                                        width: feedback.text.includes('BİTTİ') ? '92%' : 'auto',
                                        maxWidth: feedback.text.includes('BİTTİ') ? '450px' : 'none',
                                        borderRadius: '8px',
                                        fontWeight: 900,
                                        fontSize: feedback.text.includes('BİTTİ') ? '3rem' : (feedback.text === 'TETRIS' ? '3rem' : '2.2rem'),
                                        textShadow: '0 0 20px rgba(0,0,0,0.5)',
                                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                                        letterSpacing: '4px',
                                        transform: 'skewX(-10deg)',
                                        border: '4px solid white',
                                        whiteSpace: 'pre-line',
                                        textAlign: 'center',
                                        lineHeight: 1.1
                                    }}>
                                        {feedback.text}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Game Board */}
                        <motion.div
                            className="glass-panel checkerboard"
                            animate={trail ? { y: [0, 8, -4, 2, 0] } : { y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                padding: 0,
                                border: '2px solid rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                                background: 'transparent',
                                borderRadius: 0,
                                backdropFilter: 'none',
                                WebkitBackdropFilter: 'none',
                                lineHeight: 0,
                                display: 'flex',
                                originY: 1,
                                pointerEvents: 'none' // Ensure board doesn't eat gestures
                            }}
                        >
                            <CanvasRenderer
                                grid={grid}
                                activePiece={activePiece}
                                ghostPiece={ghostPiece}
                                trail={trail}
                                isSettling={isSettling}
                                clearingLines={clearingLines}
                                clearingStage={clearingStage}
                                images={images}
                                isKiosk={isKiosk}
                            />
                        </motion.div>

                        {/* Exterior Mute Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const newMute = audioManager.toggleMute();
                                setIsMuted(newMute);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                left: '100%',
                                marginLeft: isKiosk ? '15px' : '8px',
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '8px',
                                width: isKiosk ? '80px' : '42px',
                                height: isKiosk ? '80px' : '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                zIndex: 20,
                                backdropFilter: 'blur(5px)',
                                pointerEvents: 'auto' // Re-enable for the button
                            }}
                        >
                            {isMuted ? <VolumeX size={isKiosk ? 40 : 22} /> : <Volume2 size={isKiosk ? 40 : 22} />}
                        </button>
                    </div>
                </div>

                {/* Bottom Action Button */}
                {isKiosk ? (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '0' }}>
                        <button
                            className={`btn-speed-filled ${isFastMode ? 'active' : ''}`}
                            disabled={isCounting || gameOver}
                            onClick={() => {
                                if (isCounting || gameOver) return;
                                setIsFastMode(!isFastMode);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                        >
                            {isFastMode ? 'Normal Hız' : '2x Hızlandır'}
                        </button>
                    </div>
                ) : (
                    <button
                        className={`btn-speed-filled ${isFastMode ? 'active' : ''}`}
                        disabled={isCounting || gameOver}
                        onClick={() => {
                            if (isCounting || gameOver) return;
                            setIsFastMode(!isFastMode);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                    >
                        {isFastMode ? 'Normal Hız' : '2x Hızlandır'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// Minimal preview renderer for the Next Piece
function NextPiecePreview({ piece, images, isKiosk }) {
    const canvasRef = useRef(null);
    const PREVIEW_BLOCK_SIZE = isKiosk ? 16 : 12;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !images[piece.type]) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = images[piece.type];
        const dims = PIECE_DIMENSIONS[piece.type] || { w: 1, h: 1 };

        // Use natural dimensions for reliable SVG slicing
        const sW = img.naturalWidth || img.width;
        const sH = img.naturalHeight || img.height;

        const unit = sW / dims.w;
        const unitH = sH / dims.h;

        // Calculate actual bounds of blocks to center them
        let minX = 4, maxX = 0, minY = 4, maxY = 0;
        piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && typeof cell === 'object') {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            });
        });

        const pieceW = (maxX - minX + 1) * PREVIEW_BLOCK_SIZE;
        const pieceH = (maxY - minY + 1) * PREVIEW_BLOCK_SIZE;
        const startX = (canvas.width - pieceW) / 2;
        const startY = (canvas.height - pieceH) / 2;

        piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && typeof cell === 'object') {
                    const px = startX + (x - minX) * PREVIEW_BLOCK_SIZE;
                    const py = startY + (y - minY) * PREVIEW_BLOCK_SIZE;

                    ctx.save();
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.translate(px + PREVIEW_BLOCK_SIZE / 2, py + PREVIEW_BLOCK_SIZE / 2);
                    // Rotation is always 0 for preview
                    ctx.drawImage(
                        img,
                        cell.pX * unit, cell.pY * unitH, unit, unitH,
                        -PREVIEW_BLOCK_SIZE / 2, -PREVIEW_BLOCK_SIZE / 2,
                        PREVIEW_BLOCK_SIZE, PREVIEW_BLOCK_SIZE
                    );
                    ctx.restore();
                }
            });
        });
    }, [piece, images]);


    return <canvas ref={canvasRef} width={isKiosk ? 80 : 60} height={isKiosk ? 80 : 60} />;
}
