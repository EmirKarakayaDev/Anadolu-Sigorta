export const REWARDS_ENABLED = false; // Ödül olan etkinlikte true yap

export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const COLORS = {
    I: '#00D2FF',
    J: '#3A7BD5',
    L: '#F27121',
    O: '#FFD166',
    S: '#06D6A0',
    T: '#9D50BB',
    Z: '#EF476F'
};

export const SHAPES = {
    I: [
        [0, { pX: 0, pY: 0 }, 0, 0],
        [0, { pX: 0, pY: 1 }, 0, 0],
        [0, { pX: 0, pY: 2 }, 0, 0],
        [0, { pX: 0, pY: 3 }, 0, 0]
    ],
    J: [
        [0, { pX: 1, pY: 0 }, 0],
        [0, { pX: 1, pY: 1 }, 0],
        [{ pX: 0, pY: 2 }, { pX: 1, pY: 2 }, 0]
    ],
    L: [
        [{ pX: 0, pY: 0 }, 0, 0],
        [{ pX: 0, pY: 1 }, 0, 0],
        [{ pX: 0, pY: 2 }, { pX: 1, pY: 2 }, 0]
    ],
    O: [
        [{ pX: 0, pY: 0 }, { pX: 1, pY: 0 }],
        [{ pX: 0, pY: 1 }, { pX: 1, pY: 1 }]
    ],
    S: [
        [0, { pX: 1, pY: 0 }, { pX: 2, pY: 0 }],
        [{ pX: 0, pY: 1 }, { pX: 1, pY: 1 }, 0],
        [0, 0, 0]
    ],
    T: [
        [0, { pX: 1, pY: 0 }, 0],
        [{ pX: 0, pY: 0 }, { pX: 1, pY: 1 }, { pX: 2, pY: 0 }],
        [0, 0, 0]
    ],
    Z: [
        [{ pX: 0, pY: 0 }, { pX: 1, pY: 0 }, 0],
        [0, { pX: 1, pY: 1 }, { pX: 2, pY: 1 }],
        [0, 0, 0]
    ]
};

// Suitcase visual mapping
export const PIECES = Object.keys(SHAPES);

export const PIECE_ASSETS = {
    I: '/assets/TETRIS_BLOK_I.svg',
    J: '/assets/TETRIS_BLOK_TERS_L.svg',
    L: '/assets/TETRIS_BLOK_L.svg',
    O: '/assets/TETRIS_BLOK_4LU.svg',
    S: '/assets/TETRIS_BLOK_S.svg',
    T: '/assets/TETRIS_BLOK_T.svg',
    Z: '/assets/TETRIS_BLOK_Z.svg'
};

// Natural dimensions of pieces in their SVG assets
export const PIECE_DIMENSIONS = {
    I: { w: 1, h: 4 },
    J: { w: 2, h: 3 },
    L: { w: 2, h: 3 },
    O: { w: 2, h: 2 },
    S: { w: 3, h: 2 },
    T: { w: 3, h: 2 },
    Z: { w: 3, h: 2 }
};
