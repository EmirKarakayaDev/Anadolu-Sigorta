import { useState, useRef } from 'react';
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

export function FormScreen({ onSubmit, onBack, isKiosk }) {
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
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const isMobile = window.innerWidth < 768;

    const group1Fields = ['firstName', 'lastName', 'email'];

    // Render anında hesapla — klavye ilk açılışında da doğru konumda başlar
    const getKeyboardOffset = () => {
        if (!isKiosk || !activeField) return 0;
        const anchorEl = group1Fields.includes(activeField.name)
            ? emailRef.current
            : phoneRef.current;
        if (!anchorEl) return 0;
        const rect = anchorEl.getBoundingClientRect();
        return Math.max(0, window.innerHeight - rect.bottom - 12 - 640);
    };
    const keyboardOffset = getKeyboardOffset();

    const handleKey = (key) => {
        if (!activeField) return;
        const currentVal = watch(activeField.name) || '';

        // TC ve Telefon alanları için sadece rakam girişi ve 11 hane sınırı kontrolü
        if ((activeField.name === 'tcNumber' || activeField.name === 'phone')) {
            if (!/^\d+$/.test(key)) return;
            if (currentVal.length >= 11) return;
            const newVal = currentVal + key;
            setValue(activeField.name, newVal, { shouldValidate: true });
            return;
        }

        setValue(activeField.name, currentVal + key, { shouldValidate: true });
    };

    const handleBackspace = () => {
        if (!activeField) return;
        const currentVal = watch(activeField.name) || '';
        const newVal = currentVal.slice(0, -1);
        setValue(activeField.name, newVal, { shouldValidate: true });
    };

    // Maskeli input için onChange — gerçek değeri formdan alıp yeni karakteri ekle/sil
    const handleMaskedChange = (fieldName, e) => {
        if (isKiosk) return; // Kiosk sanal klavye ile yönetir
        const oldReal = watch(fieldName) || '';
        const raw = e.target.value;
        if (raw.length > oldReal.length) {
            // Kullanıcı yeni karakter ekledi — yıldızların sonrasını al
            const newChars = raw.slice(oldReal.length).replace(/\D/g, '');
            const newVal = (oldReal + newChars).slice(0, 11);
            setValue(fieldName, newVal, { shouldValidate: true });
        } else {
            // Backspace ile sildi
            setValue(fieldName, oldReal.slice(0, raw.length), { shouldValidate: true });
        }
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
                    // Mevcut input odağını kes
                    if (document.activeElement instanceof HTMLInputElement) {
                        document.activeElement.blur();
                    }
                }
            }}
        >
            <div className="brand-layout-full">

                <div className="brand-screen">
                    <motion.img
                        src={isKiosk ? "/as_logo.svg" : "/logo_trn.png"}
                        alt={isKiosk ? "Anadolu Sigorta" : "Kaybetmek Yok"}
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    />

                    <div className="form-mid-block" style={{
                        flex: isKiosk ? 1 : 'none',
                        minHeight: isKiosk ? 0 : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}>
                    <motion.h2
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: isKiosk ? undefined : (isMobile ? '1.4rem' : '1.8rem'),
                            fontWeight: 800,
                            color: 'white',
                            margin: isKiosk ? '0' : '0 0 1rem 0',
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
                            flex: isKiosk ? 1 : 'none'
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.8rem',
                            marginBottom: isKiosk ? 0 : '0.8rem',
                            marginTop: '0'
                        }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Ad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input
                                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                                    {...register('firstName')}
                                    placeholder="Ad"
                                    onFocus={() => {
                                        if (isKiosk) setActiveField({ name: 'firstName', type: 'text' });
                                    }}
                                    inputMode={isKiosk ? 'none' : 'text'}
                                    autoComplete="off"
                                />
                                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Soyad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input
                                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                                    {...register('lastName')}
                                    placeholder="Soyad"
                                    onFocus={() => {
                                        if (isKiosk) setActiveField({ name: 'lastName', type: 'text' });
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
                                    if (isKiosk) setActiveField({ name: 'email', type: 'text' });
                                }}
                                inputMode={isKiosk ? 'none' : 'email'}
                                autoComplete="off"
                            />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: isKiosk ? 0 : '0.8rem' }}>
                            <label>T.C. Kimlik Numarası <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                ref={(e) => register('tcNumber').ref(e)}
                                name="tcNumber"
                                className={`form-input ${errors.tcNumber ? 'error' : ''}`}
                                type="text"
                                placeholder="11 haneli T.C. kimlik numaranız"
                                inputMode={isKiosk ? 'none' : 'numeric'}
                                maxLength={11}
                                value={'*'.repeat((watch('tcNumber') || '').length)}
                                onChange={(e) => handleMaskedChange('tcNumber', e)}
                                onFocus={() => {
                                    if (isKiosk) setActiveField({ name: 'tcNumber', type: 'tel' });
                                }}
                                autoComplete="new-password"
                            />
                            {errors.tcNumber && <span className="form-error">{errors.tcNumber.message}</span>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Telefon <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                ref={(e) => {
                                    register('phone').ref(e);
                                    phoneRef.current = e;
                                }}
                                name="phone"
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                type="text"
                                placeholder="05xx xxx xx xx"
                                inputMode={isKiosk ? 'none' : 'numeric'}
                                maxLength={11}
                                value={'*'.repeat((watch('phone') || '').length)}
                                onChange={(e) => handleMaskedChange('phone', e)}
                                onFocus={() => {
                                    if (isKiosk) setActiveField({ name: 'phone', type: 'tel' });
                                }}
                                autoComplete="new-password"
                            />
                            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                        </div>

                        <div style={{ marginTop: '0.8rem', marginBottom: isKiosk ? '2rem' : '1rem' }}>
                            <div className="checkbox-group" style={{ padding: isKiosk ? '0' : '0 8px' }}>
                                <input
                                    type="checkbox"
                                    id="confirm"
                                    className={errors.confirm ? 'checkbox-error' : ''}
                                    {...register('confirm')}
                                />
                                <label htmlFor="confirm">Verdiğim bilgilerin doğruluğunu onaylıyorum <span style={{ color: '#FF6B6B' }}>*</span></label>
                            </div>
                        </div>
                    </motion.form>
                    </div>{/* /form-mid-block */}

                    {/* Alt Butonlar */}
                    <div className="action-group" style={{
                        marginTop: isKiosk ? '0' : 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
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
                        <button
                            type="button"
                            className="btn-outline"
                            style={{ flex: 1, width: '100%' }}
                            onClick={() => {
                                // Kiosk'ta klavyeyi kapat
                                setActiveField(null);
                                if (document.activeElement instanceof HTMLInputElement) {
                                    document.activeElement.blur();
                                }
                                onBack?.();
                            }}
                        >
                            Geri Dön
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
            </div>

            {/* Virtual Keyboard */}
            {isKiosk && (
                <VirtualKeyboard
                    visible={!!activeField}
                    type={activeField?.type}
                    isEmail={activeField?.name === 'email'}
                    keyboardOffset={keyboardOffset}
                    onKey={handleKey}
                    onBackspace={handleBackspace}
                    onSpace={() => handleKey(' ')}
                    onSuggestion={(domain) => {
                        const current = watch('email') || '';
                        const atIndex = current.indexOf('@');
                        const base = atIndex !== -1 ? current.slice(0, atIndex) : current;
                        setValue('email', base + domain, { shouldValidate: true });
                    }}
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
