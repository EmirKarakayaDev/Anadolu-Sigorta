import React, { useRef, useEffect, useState } from 'react';
import { BLOCK_SIZE, COLORS, PIECE_ASSETS, PIECE_DIMENSIONS } from '../game/constants';

export function CanvasRenderer({ grid, activePiece, ghostPiece, trail, isSettling, clearingLines = [], clearingStage = 0, images = {} }) {
    const canvasRef = useRef(null);

    const drawBlock = (ctx, x, y, type, pX = 0, pY = 0, pShape = null, highlight = false, isGhost = false, isClearing = false, blockX = 0, rotation = 0) => {
        const size = BLOCK_SIZE;
        const px = x * BLOCK_SIZE;
        const py = y * BLOCK_SIZE;

        if (isClearing) {
            const distFromCenter = Math.abs(blockX - 4.5);
            const staggerDelay = distFromCenter / 5;
            const blockProgress = Math.max(0, Math.min(1, (clearingStage * 1.5) - (staggerDelay * 0.5)));

            const scale = 1 - blockProgress;
            const offset = (size * (1 - scale)) / 2;

            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.globalAlpha = (1 - blockProgress) * 0.8;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'white';
            ctx.roundRect(px + offset, py + offset, size * scale, size * scale, 6);
            ctx.fill();
            
            // Inner flash
            ctx.globalAlpha = Math.max(0, 1 - blockProgress * 2);
            ctx.fillRect(px, py, size, size);
            
            ctx.restore();
            return;
        }

        const img = images[type];
        if (img && !isGhost) {
            const dims = PIECE_DIMENSIONS[type] || { w: 1, h: 1 };
            const unit = img.width / dims.w;
            const unitH = img.height / dims.h;
            
            ctx.save();
            ctx.imageSmoothingEnabled = true;
            
            // Effect shadows
            if (highlight === 'hard') {
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'white';
            }

            // Move to center of block to rotate the texture
            ctx.translate(px + size / 2, py + size / 2);
            ctx.rotate((rotation * Math.PI) / 2);
            
            // Draw the slice (offset by -size/2 to keep it centered)
            ctx.drawImage(
                img, 
                pX * unit, pY * unitH, unit, unitH, 
                -size / 2, -size / 2, size, size
            );
            
            // Effect overlays
            if (highlight === 'hard') {
                // Parlaklık ve gölge (Hard Drop için)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fillRect(-size / 2, -size / 2, size, size);
            } else if (highlight === true) {
                // Kararma (Normal yerleşme için)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.fillRect(-size / 2, -size / 2, size, size);
            }
            
            ctx.restore();
            return;
        }

        // Fallback or Ghost
        if (isGhost) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(px + 2, py + 2, size - 4, size - 4, 4);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();
            return;
        }

        const color = COLORS[type] || '#ccc';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(px + 1, py + 1, size - 2, size - 2, 4);
        ctx.fill();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Base Grid Lines (Subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= grid[0].length; x++) {
            ctx.beginPath();
            ctx.moveTo(x * BLOCK_SIZE, 0);
            ctx.lineTo(x * BLOCK_SIZE, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= grid.length; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * BLOCK_SIZE);
            ctx.lineTo(canvas.width, y * BLOCK_SIZE);
            ctx.stroke();
        }

        // Draw Blocks
        grid.forEach((row, y) => {
            const isClearingLine = clearingLines.includes(y);
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const { type, pX, pY, rotation } = typeof cell === 'object' ? cell : { type: cell, pX: 0, pY: 0, rotation: 0 };
                    drawBlock(ctx, x, y, type, pX, pY, null, false, false, isClearingLine, x, rotation);
                }
            });
        });

        // Draw Ghost Piece
        if (ghostPiece && !isSettling) {
            ghostPiece.shape.forEach((row, matrixY) => {
                row.forEach((value, matrixX) => {
                    if (value && typeof value === 'object') {
                        drawBlock(
                            ctx,
                            ghostPiece.pos.x + matrixX,
                            ghostPiece.pos.y + matrixY,
                            ghostPiece.type,
                            value.pX, value.pY, null,
                            false,
                            true, // isGhost
                            false, 0,
                            ghostPiece.rotation
                        );
                    }
                });
            });
        }

        // Draw Trail (Trail logic stays procedural for simplicity)
        if (trail) {
            ctx.save();
            ctx.globalAlpha = trail.opacity || 1; 
            const color = COLORS[trail.type] || '#fff';
            trail.cols.forEach(col => {
                const x = col.x * BLOCK_SIZE;
                const startY_px = trail.startY * BLOCK_SIZE;
                const endY_px = col.endY * BLOCK_SIZE;
                const drawHeight = endY_px - startY_px;
                if (drawHeight > 0) {
                    const gradient = ctx.createLinearGradient(x, startY_px, x, endY_px);
                    gradient.addColorStop(0, 'rgba(255,255,255,0)');
                    gradient.addColorStop(1, color + '44');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, startY_px, BLOCK_SIZE, drawHeight);
                }
            });
            ctx.restore();
        }

        // Draw Active Piece
        if (activePiece) {
            activePiece.shape.forEach((row, matrixY) => {
                row.forEach((value, matrixX) => {
                    if (value && typeof value === 'object') {
                        drawBlock(
                            ctx,
                            activePiece.pos.x + matrixX,
                            activePiece.pos.y + matrixY,
                            activePiece.type,
                            value.pX, value.pY, null,
                            isSettling,
                            false, false, 0,
                            activePiece.rotation
                        );
                    }
                });
            });
        }
    }, [grid, activePiece, ghostPiece, trail, isSettling, clearingLines, clearingStage, images]);

    return <canvas ref={canvasRef} width={300} height={600} style={{ background: '#4a4a4a' }} />;
}

