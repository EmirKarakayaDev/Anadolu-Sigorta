import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function KVKKScreen({ onAccept, onDecline, isKiosk }) {
    const [isChecked, setIsChecked] = useState(false);
    const [showError, setShowError] = useState(false);
    const isMobile = window.innerWidth < 768;

    const handleAcceptClick = () => {
        if (!isChecked) {
            setShowError(true);
            return;
        }
        onAccept();
    };

    const kvkkText = `KİŞİSEL VERİLERİN İŞLENMESİNDE UYULACAK ESASLARA İLİŞKİN PROTOKOL 

Taraflar: 

ANADOLU ANONİM TÜRK SİGORTA ŞİRKETİ 
Rüzgarlıbahçe Mah. Kavak Sok. No.31  
Kavacık-İstanbul 

KURUM TİCARİ ADI: 
KURUM TABELA ADI: 
Adres: 
İlçe/İl: 

Protokol içerisinde bundan sonra ANADOLU ANONİM TÜRK SİGORTA ŞİRKETİ, “ANADOLU SİGORTA”; ....................... / ........................... ise “...........................” olarak anılacaktır.

Protokolün Amacı ve Konusu: 

Bu protokol, 7 Nisan 2016 tarihli Resmi Gazete’de yayımlanan 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun amaçları doğrultusunda kişisel verilerin işlenmesi ve aktarılması hususunda uyulacak esasları içermek amacıyla ___/___/___ tarihinde iki (2) nüsha olarak imzalanmıştır.`;

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="brand-layout-full">
                <div className="brand-screen">
                    {!isKiosk && (
                        <img
                            src="/logo_trn.png"
                            alt="Anadolu Sigorta"
                            className="brand-logo"
                            style={{ height: 'auto' }}
                        />
                    )}

                    <h1 style={{
                        fontSize: isKiosk ? undefined : (isMobile ? '1.4rem' : '1.8rem'),
                        fontWeight: 800,
                        textAlign: 'center',
                        marginTop: '0',
                        marginBottom: isKiosk ? '1rem' : '-5px'
                    }}>
                        Aydınlatma Metni
                    </h1>

                    <div className="kvkk-container" style={{ flex: isKiosk ? 1 : 'none', width: '100%' }}>
                        {kvkkText}
                    </div>

                    {/* Footer Group (Sticky to Bottom) */}
                    <div style={{ 
                        marginTop: isKiosk ? '0' : 'auto', 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.1rem',
                        paddingBottom: isKiosk ? '1rem' : '0'
                    }}>
                        <div className="checkbox-group" style={{ marginTop: isKiosk ? '1.5rem' : '0', marginBottom: '0' }}>
                            <input 
                                type="checkbox" 
                                id="kvkk-confirm" 
                                className={showError && !isChecked ? 'checkbox-error' : ''} 
                                checked={isChecked}
                                onChange={(e) => {
                                    setIsChecked(e.target.checked);
                                    if (e.target.checked) setShowError(false);
                                }}
                            />
                            <label htmlFor="kvkk-confirm">
                                Aydınlatma metnini okudum ve onaylıyorum <span style={{ color: '#FF6B6B' }}>*</span>
                            </label>
                        </div>

                        <div className="action-group" style={{ 
                            width: '100%', 
                            display: 'flex', 
                            gap: isKiosk ? '1.5rem' : '1rem',
                            flexDirection: (isKiosk || isMobile) ? 'column' : 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '0'
                        }}>
                            <button className="btn-primary" style={{ flex: 1, width: '100%' }} onClick={handleAcceptClick}>
                                Onayla ve Devam Et
                            </button>
                            <button className="btn-outline" style={{ flex: 1, width: '100%' }} onClick={onDecline}>
                                Geri Dön
                            </button>
                        </div>
                    </div>
                </div>

                {isKiosk && (
                    <img src="/logo_trn.png" alt="Anadolu Sigorta" className="brand-logo kiosk-logo-fixed" />
                )}
            </div>
        </motion.div>
    );
}
