import { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, SHAPES, PIECES } from './constants';
import { audioManager } from '../utils/audioManager';

export function useTetris({ isPaused = false } = {}) {
    const [grid, setGrid] = useState(createEmptyGrid());
    const [activePiece, setActivePiece] = useState(null);
    const [nextPieces, setNextPieces] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isSettling, setIsSettling] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [ghostPiece, setGhostPiece] = useState(null);
    const [trail, setTrail] = useState(null);
    const [clearingLines, setClearingLines] = useState([]);
    const [clearingStage, setClearingStage] = useState(0); // 0 to 1
    const [isFastMode, setIsFastMode] = useState(false);

    const timerRef = useRef(null);
    const landLockRef = useRef(false);

    function createEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    const getRandomPiece = useCallback(() => {
        const type = PIECES[Math.floor(Math.random() * PIECES.length)];
        return {
            type,
            shape: SHAPES[type],
            pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
            rotation: 0
        };
    }, []);

    const initGame = useCallback(() => {
        setGrid(createEmptyGrid());
        setActivePiece(getRandomPiece());
        setNextPieces([getRandomPiece(), getRandomPiece(), getRandomPiece()]);
        setScore(0);
        setGameOver(false);
        setIsSettling(false); // Reset isSettling
        setFeedback(null); // Reset feedback
    }, [getRandomPiece]);

    const collision = useCallback((targetPiece, targetGrid) => { // Wrapped in useCallback
        for (let y = 0; y < targetPiece.shape.length; y++) {
            for (let x = 0; x < targetPiece.shape[y].length; x++) {
                if (targetPiece.shape[y][x] !== 0) {
                    const newX = targetPiece.pos.x + x;
                    const newY = targetPiece.pos.y + y;
                    if (
                        newX < 0 ||
                        newX >= COLS ||
                        newY >= ROWS ||
                        (newY >= 0 && targetGrid[newY][newX] !== 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []); // Empty dependency array as it only depends on constants

    const rotate = () => {
        if (!activePiece || gameOver || isSettling || isPaused) return; // Added isPaused check

        const newShape = activePiece.shape[0].map((_, i) =>
            activePiece.shape.map(row => row[i]).reverse()
        );

        const rotatedPiece = { ...activePiece, shape: newShape, rotation: (activePiece.rotation + 1) % 4 };

        // Wall Kick Logic: If rotation fails, try shifting left or right
        const xOffsets = [0, -1, 1, -2, 2];

        for (const offset of xOffsets) {
            const kickedPiece = {
                ...rotatedPiece,
                pos: { ...rotatedPiece.pos, x: rotatedPiece.pos.x + offset }
            };

            if (!collision(kickedPiece, grid)) {
                setActivePiece(kickedPiece);
                audioManager.play('rotate');
                return;
            }
        }
    };

    const move = (dir) => {
        if (!activePiece || gameOver || isSettling || isPaused) return; // Added isPaused check
        const movedPiece = { ...activePiece, pos: { ...activePiece.pos, x: activePiece.pos.x + dir } };
        if (!collision(movedPiece, grid)) {
            setActivePiece(movedPiece);
            audioManager.play('move');
        }
    };

    const activePieceRef = useRef(activePiece);
    const gridRef = useRef(grid);
    const nextPiecesRef = useRef(nextPieces);
    const gameOverRef = useRef(gameOver);

    useEffect(() => { activePieceRef.current = activePiece; }, [activePiece]);
    useEffect(() => { gridRef.current = grid; }, [grid]);
    useEffect(() => { nextPiecesRef.current = nextPieces; }, [nextPieces]);
    useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

    const triggerGameOver = useCallback(() => {
        setGameOver(true);
        setFeedback({ text: 'OYUN\nBİTTİ', id: Date.now() });
    }, []);

    const landPiece = useCallback((isHardDrop = false) => {
        if (!activePieceRef.current || gameOverRef.current || landLockRef.current) return;

        landLockRef.current = true;
        setIsSettling(isHardDrop ? 'hard' : true);

        // Standard Tetris "Settle" Delay
        setTimeout(() => {
            if (gameOverRef.current) {
                setIsSettling(false); // Ensure settling state is reset even if game over
                return;
            }

            const newGrid = gridRef.current.map(row => [...row]);
            activePieceRef.current.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const targetY = activePieceRef.current.pos.y + y;
                        const targetX = activePieceRef.current.pos.x + x;
                        if (targetY >= 0 && targetY < ROWS && targetX >= 0 && targetX < COLS) {
                            newGrid[targetY][targetX] = {
                                type: activePieceRef.current.type,
                                pX: value.pX,
                                pY: value.pY,
                                rotation: activePieceRef.current.rotation,
                                shape: activePieceRef.current.shape
                            };
                        }
                    }
                });
            });

            // Clear lines detection
            const linesToClear = [];
            newGrid.forEach((row, y) => {
                if (row.every(cell => cell !== 0)) {
                    linesToClear.push(y);
                }
            });

            const spawnNext = (finalGrid) => {
                const currentNextPieces = nextPiecesRef.current;
                if (!currentNextPieces || currentNextPieces.length === 0) {
                    // Fallback if ref is empty
                    const piece = getRandomPiece();
                    if (collision(piece, finalGrid)) {
                        triggerGameOver();
                    } else {
                        setActivePiece(piece);
                        setNextPieces([getRandomPiece(), getRandomPiece(), getRandomPiece()]);
                    }
                } else {
                    const [next, ...remaining] = currentNextPieces;
                    if (collision(next, finalGrid)) {
                        triggerGameOver();
                        setActivePiece(null);
                    } else {
                        setActivePiece(next);
                        setNextPieces([...remaining, getRandomPiece()]);
                    }
                }
                setIsSettling(false);
                landLockRef.current = false;
            };

            if (linesToClear.length > 0) {
                setGrid(newGrid);
                setActivePiece(null);
                setClearingLines(linesToClear);
                audioManager.play('clear');

                // Show feedback IMMEDIATELY when animation starts
                const linesCleared = linesToClear.length;
                const levels = { 1: 'GÜZEL', 2: 'HARİKA', 3: 'MUHTEŞEM', 4: 'TETRIS' };
                setFeedback({ text: levels[linesCleared], id: Date.now() });
                setTimeout(() => setFeedback(null), 600);

                let startTime = null;
                const duration = 600; // Biraz daha uzun ve belirgin olması için

                const animateClear = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    setClearingStage(progress);

                    if (progress < 1) {
                        requestAnimationFrame(animateClear);
                    } else {
                        // Animation complete
                        const linesCleared = linesToClear.length;
                        const filteredGrid = newGrid.filter((_, index) => !linesToClear.includes(index));
                        while (filteredGrid.length < ROWS) {
                            filteredGrid.unshift(Array(COLS).fill(0));
                        }

                        const multipliers = { 1: 100, 2: 300, 3: 700, 4: 1200 };
                        setScore(prev => prev + (multipliers[linesCleared] || linesCleared * 100));

                        setGrid(filteredGrid);
                        setClearingLines([]);
                        setClearingStage(0);
                        spawnNext(filteredGrid);
                    }
                };

                requestAnimationFrame(animateClear);
                return;
            }

            // No lines to clear, proceed normally
            setGrid(newGrid);
            spawnNext(newGrid);
        }, 150);
    }, [getRandomPiece, collision]);

    const drop = useCallback(() => { // Moved drop to top-level and wrapped in useCallback
        if (gameOverRef.current || !activePieceRef.current || isSettling || landLockRef.current || isPaused) return; // Added isPaused check

        const droppedPiece = {
            ...activePieceRef.current,
            pos: { ...activePieceRef.current.pos, y: activePieceRef.current.pos.y + 1 }
        };

        if (!collision(droppedPiece, gridRef.current)) {
            setActivePiece(droppedPiece);
        } else {
            // Land piece if it hit something (GameOver check is now handled in spawnNext for fairness)
            landPiece(); 
        }
    }, [landPiece, isSettling, collision, isPaused]); // Dependencies for drop

    const hardDrop = () => { // Refactored hardDrop
        if (gameOver || !activePiece || isSettling || landLockRef.current || isPaused) return; // Added isPaused check

        let currentPos = { ...activePiece.pos };
        const startY = currentPos.y;

        while (!collision({ ...activePiece, pos: { ...currentPos, y: currentPos.y + 1 } }, grid)) {
            currentPos.y += 1;
        }

        // Calculate the highest y position for each column of the active piece
        // so that the trail stops exactly at the top edge of each specific block column
        const colTops = new Map();
        activePiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const absX = currentPos.x + x;
                    const absY = currentPos.y + y;
                    if (!colTops.has(absX) || absY < colTops.get(absX)) {
                        colTops.set(absX, absY);
                    }
                }
            });
        });

        // Set the trail
        if (currentPos.y > startY) {
            setTrail({
                cols: Array.from(colTops.entries()).map(([x, endY]) => ({ x, endY })),
                startY: startY,
                type: activePiece.type,
                opacity: 1, // Keep opacity for a slight fade at the very end
                id: Date.now() // to force re-render if multiple fast drops
            });

            // Animate trail shrinking downwards (falling into the block) smoothly
            const duration = 200; // 200ms animation
            let startTime = null;

            const animateTrail = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Use a slight ease-in to make it feel like it's accelerating
                const easeProgress = progress * progress;

                const targetY = Math.min(...Array.from(colTops.values()));
                const newStartY = startY + ((targetY - startY) * easeProgress);
                const newOpacity = 1 - easeProgress;

                if (progress < 1) {
                    setTrail(prev => prev ? { ...prev, startY: newStartY, opacity: newOpacity } : null);
                    requestAnimationFrame(animateTrail);
                } else {
                    // Animasyon tamamen bitince temizle
                    setTrail(null);
                }
            };

            requestAnimationFrame(animateTrail);
        }

        // Update active piece position and then land it using the existing landPiece logic
        setActivePiece(prev => ({ ...prev, pos: currentPos }));
        landPiece(true); // Call the top-level landPiece with hardDrop flag
    };

    useEffect(() => {
        if (!activePiece && !gameOver && !isSettling && !isPaused) { // Added isPaused check
            initGame();
        }
    }, [activePiece, gameOver, initGame, isSettling, isPaused]); // Added isSettling to dependencies

    // Calculate ghost piece position
    useEffect(() => {
        if (!activePiece || gameOver) {
            setGhostPiece(null);
            return;
        }

        // Find the lowest valid position
        let currentPos = { ...activePiece.pos };
        while (!collision({ ...activePiece, pos: { ...currentPos, y: currentPos.y + 1 } }, grid)) {
            currentPos.y += 1;
        }

        setGhostPiece({ ...activePiece, pos: currentPos });
    }, [activePiece, grid, gameOver, collision]);

    useEffect(() => {
        if (!gameOver && !isSettling && !isPaused) { // Added isPaused check
            timerRef.current = setInterval(drop, isFastMode ? 400 : 800);
        }
        return () => clearInterval(timerRef.current);
    }, [drop, gameOver, isSettling, isPaused, isFastMode]); // Added isSettling to dependencies

    return { grid, activePiece, ghostPiece, trail, clearingLines, clearingStage, nextPieces, score, gameOver, isSettling, feedback, isFastMode, setIsFastMode, move, rotate, drop, hardDrop, initGame, triggerGameOver };
}
