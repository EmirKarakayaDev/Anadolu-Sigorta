import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTetris } from '../game/useTetris';
import { CanvasRenderer } from './CanvasRenderer';
import { COLS, ROWS, BLOCK_SIZE, COLORS, SHAPES, PIECE_ASSETS } from '../game/constants';
import { Trophy, Clock, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export function GameScreen({ onGameOver, settings }) {
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes game
    const [countdown, setCountdown] = useState(3);
    const [isCounting, setIsCounting] = useState(true);
    const [isMuted, setIsMuted] = useState(audioManager.getMuteStatus());

    const {
        grid, activePiece, ghostPiece, trail, clearingLines, clearingStage, nextPieces,
        score, gameOver, isSettling, feedback, isFastMode, setIsFastMode,
        move, rotate, drop, hardDrop, triggerGameOver
    } = useTetris({ isPaused: isCounting });

    const [images, setImages] = useState({});

    // Asset loading (Shared)
    useEffect(() => {
        const loadedImages = {};
        let loadedCount = 0;
        const pieceKeys = Object.keys(PIECE_ASSETS);
        const total = pieceKeys.length;

        pieceKeys.forEach((type) => {
            const img = new Image();
            img.onload = () => {
                loadedImages[type] = img;
                loadedCount++;
                if (loadedCount === total) {
                    setImages(loadedImages);
                }
            };
            img.src = PIECE_ASSETS[type];
        });
    }, []);

    // No more checkerboard, solid blue everywhere
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
    // Sayaç Mantığı (Sadece rakamı düşürür)
    useEffect(() => {
        // Oyun ekranına gelir gelmez menü müziğini kes
        audioManager.stopBGM();

        // 3-2-1 Sesini SADECE BİR KEZ (başlangıçta) çal
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
                    // Sayaç bitince Normal müziği başlat
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
    }, []);

    // Hız moduna göre müziği değiştir (Normal vs 2x)
    useEffect(() => {
        if (!isCounting && !gameOver) {
            audioManager.startBGM(isFastMode ? 3 : 2);
        }
    }, [isFastMode, isCounting, gameOver]);

    // Timer logic
    useEffect(() => {
        let gameFinishTimeout = null;
        let finalTransitionTimeout = null;

        if (isCounting) return; // Wait for countdown

        if (timeLeft <= 0 || gameOver) {
            if (!gameOverTriggeredRef.current) {
                gameOverTriggeredRef.current = true;
                
                // Dramatik Bekleyiş (0.5 Saniye Sadece Donup Kalıyoruz)
                gameFinishTimeout = setTimeout(() => {
                    if (!feedback) {
                        triggerGameOver();
                    }
                    
                    audioManager.fadeOutBGM(2000); 

                    // Yazının ekranda kaldığı o 2 saniyenin sonunda Skor Ekranına geç
                    finalTransitionTimeout = setTimeout(() => {
                        onGameOver(score);
                    }, 2000);

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
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
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
        setLastX(e.clientX);
        setLastY(e.clientY);
    };

    const handlePointerMove = (e) => {
        const interaction = interactionStartRef.current;
        if (!interaction || isCounting) return;

        const totalDx = Math.abs(e.clientX - interaction.x);
        const totalDy = Math.abs(e.clientY - interaction.y);

        interaction.totalDist = Math.max(interaction.totalDist || 0, totalDx, totalDy);

        if (!interaction.lock) {
            if (totalDx > 15) interaction.lock = 'horizontal';
            else if (totalDy > 15) interaction.lock = 'vertical';
        }

        if (interaction.lock === 'horizontal' || (!interaction.lock && totalDx > 15)) {
            const dragDist = e.clientX - lastX;
            // Sensitivity multiplier affects how much we need to drag (higher sensitivity = lower threshold)
            const threshold = 30 / settings.sensitivity; 
            if (Math.abs(dragDist) > threshold) {
                move(dragDist > 0 ? 1 : -1);
                setLastX(e.clientX);
            }
        }

        // Vertical Movement (Soft Drop)
        if (interaction.lock === 'vertical' || (!interaction.lock && totalDy > 20)) {
            const dragDistY = e.clientY - lastY;
            const vThreshold = 40 / settings.sensitivity;
            if (dragDistY > vThreshold) {
                drop();
                setLastY(e.clientY);
            }
        }
    };

    const handlePointerUp = (e) => {
        const interaction = interactionStartRef.current;
        if (!interaction || isCounting) return;

        const dy = e.clientY - interaction.y;
        const dt = Date.now() - interaction.time;
        const now = Date.now();
        const velocityY = dy / dt; // pixels per ms

        if (interaction.totalDist < 15 && (now - lastRotateTime.current > 200)) {
            rotate();
            lastRotateTime.current = now;
        }
        // HARD DROP: High speed flick
        else if (velocityY > 0.8 && dy > 100) {
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
            {/* Mute Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    const newMute = audioManager.toggleMute();
                    setIsMuted(newMute);
                }}
                style={{
                    position: 'absolute',
                    top: '1.2rem',
                    right: '1.2rem',
                    zIndex: 2000,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
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
                            background: 'transparent', // Karartma kaldırıldı
                            pointerEvents: 'none'
                        }}
                    >
                        <motion.span
                            style={{
                                color: '#FFFFFF',
                                fontSize: '1.4rem',
                                fontWeight: 900,
                                letterSpacing: '5px',
                                marginBottom: '1.5rem',
                                textShadow: '4px 4px 0px #1D1D46' // Belirgin sert gölge (3D efekti)
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
                                        fontSize: '12rem',
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
            <div className="game-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                width: '100%',
                maxWidth: '500px',
                flex: 1, // Ensures it takes full height
                padding: 0
            }}>

                {/* Reference-style Top Bar */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    width: '100%',
                    alignItems: 'stretch',
                    height: '80px'
                }}>
                    {/* Left: Score */}
                    <div className="glass-panel" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '4px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Skor</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{score}</span>
                    </div>
 
                    {/* Center: Timer */}
                    <div className="glass-panel" style={{
                        flex: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '4px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Süre</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
 
                    <div className="glass-panel" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '4px',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 900, letterSpacing: '1px' }}>Sıradaki</span>
                        <div style={{ padding: '5px', height: '50px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {nextPieces[0] && (
                                <NextPiecePreview piece={nextPieces[0]} images={images} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="game-main-area" style={{ position: 'relative', margin: 'auto 0' }}>
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
                                    background: feedback.text.includes('BİTTİ') ? 'var(--as-blue)' : (feedback.text === 'TETRIS' ? 'linear-gradient(to bottom, #FF8C42, #FF5E5B)' : 'var(--secondary)'),
                                    color: 'white',
                                    padding: '1.2rem 2.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 900,
                                    fontSize: feedback.text.includes('BİTTİ') ? '3rem' : (feedback.text === 'TETRIS' ? '3rem' : '2.2rem'),
                                    textShadow: '0 0 20px rgba(0,0,0,0.5)',
                                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                                    letterSpacing: '4px',
                                    transform: feedback.text.includes('BİTTİ') ? 'none' : 'skewX(-10deg)',
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
                        animate={
                            trail ? { y: [0, 8, -4, 2, 0] } : { y: 0 }
                        }
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                        style={{
                            padding: 0,
                            border: '2px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                            background: 'transparent',
                            borderRadius: 0,
                            backdropFilter: 'none',
                            WebkitBackdropFilter: 'none',
                            lineHeight: 0, // Prevents inline block extra space
                            display: 'flex',
                            originY: 1
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
                        />
                    </motion.div>
                </div>

                {/* Speed Button */}
                <button 
                  className={`btn-speed-filled ${isFastMode ? 'active' : ''}`}
                  disabled={isCounting || gameOver}
                  onClick={() => {
                      if (isCounting || gameOver) return;
                      setIsFastMode(!isFastMode);
                  }}
                  // Oyun kontrollerinin (döndürme gibi) buton tıklamasıyla karışmaması için durduruyoruz
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                >
                  {isFastMode ? 'Normal Hız' : '2x Hızlandır'}
                </button>
            </div>
        </motion.div>
    );
}

// Minimal preview renderer for the Next Piece
function NextPiecePreview({ piece, images }) {
    const canvasRef = useRef(null);
    const PREVIEW_BLOCK_SIZE = 12;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !images[piece.type]) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = images[piece.type];
        const dims = PIECE_DIMENSIONS[piece.type] || { w: 1, h: 1 };
        const unit = img.width / dims.w;
        const unitH = img.height / dims.h;

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

    const { PIECE_DIMENSIONS } = { PIECE_DIMENSIONS: {
        I: { w: 1, h: 4 }, J: { w: 2, h: 3 }, L: { w: 2, h: 3 }, O: { w: 2, h: 2 }, S: { w: 3, h: 2 }, T: { w: 3, h: 2 }, Z: { w: 3, h: 2 }
    }};

    return <canvas ref={canvasRef} width={60} height={60} />;
}
