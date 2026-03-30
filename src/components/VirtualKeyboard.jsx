import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TURKISH_QWERTY = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
    ['SHIFT', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', '.', '-', '_'],
    ['SPACE', '@', 'BACKSPACE', 'DONE']
];

const NUMERIC_LAYOUT = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', 'BACKSPACE', 'DONE']
];

export function VirtualKeyboard({ visible, type = 'text', onKey, onDone, onBackspace, onSpace }) {
    const [isUpperCase, setIsUpperCase] = useState(false);
    const layout = type === 'tel' || type === 'number' ? NUMERIC_LAYOUT : TURKISH_QWERTY;

    const formatKey = (key) => {
        if (['SPACE', 'BACKSPACE', 'DONE', 'SHIFT', '@', '.', '-', '_'].includes(key)) return key;
        // Rakamlar büyük-küçük harf dönüşümüne girmez
        if (/^\d$/.test(key)) return key;
        if (isUpperCase) {
            // Türkçe büyük harf dönüşümü
            if (key === 'i') return 'İ';
            if (key === 'ı') return 'I';
            return key.toUpperCase();
        }
        return key;
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 500, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 500, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="virtual-keyboard-container no-select"
                >
                    <div className="keyboard-grid">
                        {layout.map((row, rowIndex) => (
                            <div key={rowIndex} className="keyboard-row">
                                {row.map((key) => {
                                    const displayKey = formatKey(key);
                                    const isSpecial = ['SPACE', 'BACKSPACE', 'DONE', 'SHIFT', '@', '.', '-', '_'].includes(key);
                                    const isDone = key === 'DONE';
                                    const isBackspace = key === 'BACKSPACE';
                                    const isSpace = key === 'SPACE';
                                    const isShift = key === 'SHIFT';

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            className={`keyboard-key ${isSpecial ? 'special' : ''} ${isDone ? 'done' : ''} ${isBackspace ? 'backspace' : ''} ${isSpace ? 'space' : ''} ${isShift && isUpperCase ? 'shift-active' : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (isDone) onDone();
                                                else if (isBackspace) onBackspace();
                                                else if (isSpace) onSpace();
                                                else if (isShift) setIsUpperCase(!isUpperCase);
                                                else {
                                                    onKey(displayKey);
                                                    // Eğer sadece ilk harf büyük olsun dersek burada shift'i kapatabiliriz.
                                                    // Ama şimdilik manuel kalsın.
                                                }
                                            }}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            {key === 'BACKSPACE' ? '⌫' : 
                                             key === 'DONE' ? 'TAMAM' : 
                                             key === 'SPACE' ? 'BOŞLUK' : 
                                             key === 'SHIFT' ? (isUpperCase ? '⬆' : '⬆') : 
                                             displayKey}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
