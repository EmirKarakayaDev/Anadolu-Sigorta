import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Info } from 'lucide-react';

export function RewardsModal({ isOpen, onClose, isKiosk }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 3000,
                        display: 'flex',
                        alignItems: isKiosk ? 'flex-start' : 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        paddingTop: isKiosk ? '320px' : '20px',
                        zIndex: 3000,
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20, transition: { duration: 0.15 } }}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: isKiosk ? '800px' : '450px',
                            borderRadius: isKiosk ? '2.5rem' : '1.5rem',
                            padding: isKiosk ? '3rem 2.5rem' : '1.5rem 1.2rem',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isKiosk ? '3rem' : '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: isKiosk ? '20px' : '10px' }}>
                                <div style={{ background: 'var(--as-blue)', padding: isKiosk ? '12px' : '8px', borderRadius: isKiosk ? '15px' : '10px', display: 'flex' }}>
                                    <Info size={isKiosk ? 32 : 24} color="white" />
                                </div>
                                <h2 style={{ color: 'var(--as-blue)', fontWeight: 900, fontSize: isKiosk ? '2.8rem' : '1.8rem', margin: 0 }}>Ödüller</h2>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(0,0,0,0.05)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: isKiosk ? '64px' : '42px',
                                    height: isKiosk ? '64px' : '42px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={isKiosk ? 32 : 24} color="#333" />
                            </button>
                        </div>

                        {/* Teaser metni */}
                        <p style={{ margin: 0, fontSize: isKiosk ? '1.3rem' : '0.85rem', color: '#222', fontWeight: 700, textAlign: 'center', lineHeight: 1.5 }}>
                            Bavulları doğru yerleştiren ilk 5 kişiden biri ol, çift kişilik konser bileti kazan!
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: isKiosk ? '1.5rem' : '1rem', marginTop: isKiosk ? '2rem' : '1.2rem' }}>
                            {/* 1-5 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: isKiosk ? '2rem' : '1.2rem', padding: isKiosk ? '1.8rem' : '1.2rem', background: 'rgba(58, 123, 213, 0.05)', borderRadius: isKiosk ? '2rem' : '1.5rem', border: '1px solid rgba(58, 123, 213, 0.15)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: isKiosk ? '80px' : '56px', height: isKiosk ? '80px' : '56px', background: 'rgba(58, 123, 213, 0.1)', borderRadius: isKiosk ? '1.2rem' : '1rem', flexShrink: 0 }}>
                                    <Gift size={isKiosk ? 48 : 32} color="#3A7BD5" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 900, color: '#3A7BD5', fontSize: isKiosk ? '1.6rem' : '1.1rem' }}>1 - 5. Sıra</div>
                                    <div style={{ color: '#555', fontSize: isKiosk ? '1.25rem' : '0.85rem', fontWeight: 700, marginTop: '2px' }}>Çift Kişilik Konser Bileti 🎫</div>
                                </div>
                            </div>
                        </div>

                        <p style={{ marginTop: isKiosk ? '2.5rem' : '1.8rem', fontSize: isKiosk ? '1.2rem' : '0.85rem', color: '#888', textAlign: 'center', fontWeight: 700, fontStyle: 'italic' }}>
                            Katılımınız için teşekkür ederiz!
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
