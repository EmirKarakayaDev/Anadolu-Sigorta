import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { VirtualKeyboard } from './VirtualKeyboard';

const schema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    tcNumber: z.string().length(11, "T.C. Kimlik Numarası 11 hane olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    confirm: z.boolean().refine(v => v === true, "Onaylanmalıdır")
});

export function FormScreen({ onSubmit, isKiosk, isTest }) {
    const { register, handleSubmit, setValue, watch, setFocus, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            confirm: false,
            firstName: '',
            lastName: '',
            email: '',
            tcNumber: '',
            phone: ''
        }
    });

    const [activeField, setActiveField] = useState(null);
    const [keyboardY, setKeyboardY] = useState(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const isMobile = window.innerWidth < 768;
    const hasErrors = Object.keys(errors).length > 0;

    const handleKey = (key) => {
        if (!activeField) return;
        const currentVal = watch(activeField.name) || '';

        // TC ve Telefon alanları için sadece rakam girişi ve 11 hane sınırı kontrolü
        if ((activeField.name === 'tcNumber' || activeField.name === 'phone')) {
            if (!/^\d+$/.test(key)) return;
            if (currentVal.length >= 11) return;
        }

        setValue(activeField.name, currentVal + key, { shouldValidate: true });
    };

    const handleBackspace = () => {
        if (!activeField) return;
        const currentVal = watch(activeField.name) || '';
        setValue(activeField.name, currentVal.slice(0, -1), { shouldValidate: true });
    };

    return (
        <motion.div
            className="screen no-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
                // Boşluklara tıklandığında klavyeyi ve odağı kapat
                if (isKiosk && e.target.tagName !== 'INPUT' && e.target.closest('.virtual-keyboard-container') === null) {
                    setActiveField(null);
                    setKeyboardY(null);
                    // Mevcut input odağını kes
                    if (document.activeElement instanceof HTMLInputElement) {
                        document.activeElement.blur();
                    }
                }
            }}
        >
            <div className="brand-layout-full">

                <div className="brand-screen">
                    {!isKiosk && (
                        <motion.img
                            src="/logo_trn.png"
                            alt="Kaybetmek Yok"
                            className="brand-logo"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        />
                    )}

                    <motion.h2
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: isKiosk ? undefined : (isMobile ? '1.4rem' : '1.8rem'),
                            fontWeight: 800,
                            color: 'white',
                            flex: 1,
                            margin: isKiosk ? '0 0 0.5rem 0' : '0 0 0 0',
                            textAlign: 'center'
                        }}
                    >
                        Giriş Formu
                    </motion.h2>

                    <motion.form
                        id="kiosk-form"
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1 
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.8rem',
                            marginBottom: 0,
                            marginTop: '0'
                        }}>
                            <div className="form-group">
                                <label>Ad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input
                                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                                    {...register('firstName')}
                                    placeholder="Ad"
                                    onFocus={() => {
                                        if (isKiosk && emailRef.current) {
                                            const rect = emailRef.current.getBoundingClientRect();
                                            setKeyboardY(rect.bottom + 15);
                                            setActiveField({ name: 'firstName', type: 'text' });
                                        }
                                    }}
                                    inputMode={isKiosk ? 'none' : 'text'}
                                    autoComplete="off"
                                />
                                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                            </div>
                            <div className="form-group">
                                <label>Soyad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input
                                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                                    {...register('lastName')}
                                    placeholder="Soyad"
                                    onFocus={() => {
                                        if (isKiosk && emailRef.current) {
                                            const rect = emailRef.current.getBoundingClientRect();
                                            setKeyboardY(rect.bottom + 15);
                                            setActiveField({ name: 'lastName', type: 'text' });
                                        }
                                    }}
                                    inputMode={isKiosk ? 'none' : 'text'}
                                    autoComplete="off"
                                />
                                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: isKiosk ? 0 : '0.8rem' }}>
                            <label>E-posta <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                {...register('email')}
                                ref={(e) => {
                                    register('email').ref(e);
                                    emailRef.current = e;
                                }}
                                placeholder="adiniz@ornek.com"
                                type={isKiosk ? 'text' : 'email'}
                                onFocus={() => {
                                    if (isKiosk && emailRef.current) {
                                        const rect = emailRef.current.getBoundingClientRect();
                                        setKeyboardY(rect.bottom + 15);
                                        setActiveField({ name: 'email', type: 'text' });
                                    }
                                }}
                                inputMode={isKiosk ? 'none' : 'email'}
                                autoComplete="off"
                            />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: isKiosk ? 0 : '0.8rem' }}>
                            <label>T.C. Kimlik Numarası <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                className={`form-input ${errors.tcNumber ? 'error' : ''}`}
                                {...register('tcNumber')}
                                placeholder="11 haneli T.C. kimlik numaranız"
                                type="text"
                                inputMode={isKiosk ? 'none' : 'numeric'}
                                maxLength={11}
                                onFocus={() => {
                                    if (isKiosk && phoneRef.current) {
                                        const rect = phoneRef.current.getBoundingClientRect();
                                        setKeyboardY(rect.bottom + 15);
                                        setActiveField({ name: 'tcNumber', type: 'tel' });
                                    }
                                }}
                                autoComplete="off"
                            />
                            {errors.tcNumber && <span className="form-error">{errors.tcNumber.message}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: isKiosk ? 0 : '0.8rem' }}>
                            <label>Telefon <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                {...register('phone', {
                                    onChange: (e) => e.target.value = e.target.value.replace(/\D/g, '')
                                })}
                                ref={(e) => {
                                    register('phone').ref(e);
                                    phoneRef.current = e;
                                }}
                                placeholder="05xx xxx xx xx"
                                type={isKiosk ? 'text' : 'tel'}
                                inputMode={isKiosk ? 'none' : 'numeric'}
                                maxLength={11}
                                onFocus={() => {
                                    if (isKiosk && phoneRef.current) {
                                        const rect = phoneRef.current.getBoundingClientRect();
                                        setKeyboardY(rect.bottom + 15);
                                        setActiveField({ name: 'phone', type: 'tel' });
                                    }
                                }}
                                autoComplete="off"
                            />
                            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                        </div>

                        {/* Checkbox - Metin kutusunun altında sabit mesafe */}
                        <div className="checkbox-group" style={{ 
                            marginTop: isKiosk ? '1.5rem' : '1.2rem',
                            marginBottom: isKiosk ? '2rem' : '0.5rem'
                        }}>
                            <input
                                type="checkbox"
                                id="confirm"
                                className={errors.confirm ? 'checkbox-error' : ''}
                                {...register('confirm')}
                            />
                            <label htmlFor="confirm">Verdiğim bilgilerin doğruluğunu onaylıyorum <span style={{ color: '#FF6B6B' }}>*</span></label>
                        </div>
                    </motion.form>

                    {/* Alt Butonlar */}
                    <div style={{
                        marginTop: isKiosk ? '0' : 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        alignItems: 'center',
                        width: '100%',
                        paddingBottom: isKiosk ? '1rem' : '0'
                    }}>
                        <button
                            type="submit"
                            form="kiosk-form"
                            className="btn-primary"
                        >
                            Kaydet ve Başla
                        </button>

                        {/* Hızlı test butonu (geliştirme modu) */}
                        {isTest && (
                            <button
                                type="button"
                                className="btn-text-link"
                                onClick={() => {
                                    setValue('firstName', 'Test');
                                    setValue('lastName', 'Kullanıcı');
                                    setValue('email', 'test@test.com');
                                    setValue('tcNumber', '11111111111');
                                    setValue('phone', '5551112233');
                                    setValue('confirm', true, { shouldValidate: true });
                                }}
                                style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}
                            >
                                Test Modu (Hızlı Geçiş)
                            </button>
                        )}
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
            </div>

            {/* Virtual Keyboard */}
            {isKiosk && (
                <VirtualKeyboard
                    visible={!!activeField}
                    y={keyboardY}
                    type={activeField?.type}
                    onKey={handleKey}
                    onBackspace={handleBackspace}
                    onSpace={() => handleKey(' ')}
                    onDone={() => {
                        const fieldsOrder = ['firstName', 'lastName', 'email', 'tcNumber', 'phone'];
                        const currentIndex = fieldsOrder.indexOf(activeField.name);

                        if (currentIndex < fieldsOrder.length - 1) {
                            // Bir sonraki alana odaklan
                            const nextField = fieldsOrder[currentIndex + 1];
                            setFocus(nextField);
                        } else {
                            // Son alandaysa klavyeyi kapat
                            setActiveField(null);
                            setKeyboardY(null);
                            if (document.activeElement instanceof HTMLInputElement) {
                                document.activeElement.blur();
                            }
                        }
                    }}
                />
            )}
        </motion.div>
    );
}
