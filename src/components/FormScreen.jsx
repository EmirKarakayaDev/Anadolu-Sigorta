import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    tcNumber: z.string().length(11, "T.C. Kimlik Numarası 11 hane olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    confirm: z.boolean().refine(v => v === true, "Onaylanmalıdır")
});

export function FormScreen({ onSubmit }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            confirm: false
        }
    });
    const isMobile = window.innerWidth < 768;

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
                    {/* Top Graphic - Fixed at top like Result Screen */}
                    <motion.img
                        src="/logo_trn.png"
                        alt="Kaybetmek Yok"
                        className="brand-logo"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    />

                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1 // Kalan alanı kaplaması için
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Name & Surname Group */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.8rem',
                            marginBottom: '0.8rem',
                            marginTop: '1rem'
                        }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Ad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input className={`form-input ${errors.firstName ? 'error' : ''}`} {...register('firstName')} placeholder="Ad" />
                                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Soyad <span style={{ color: '#FF6B6B' }}>*</span></label>
                                <input className={`form-input ${errors.lastName ? 'error' : ''}`} {...register('lastName')} placeholder="Soyad" />
                                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                            <label>E-posta <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input className={`form-input ${errors.email ? 'error' : ''}`} {...register('email')} placeholder="adiniz@ornek.com" />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        {/* T.C. Number */}
                        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                            <label>T.C. Kimlik Numarası <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                className={`form-input ${errors.tcNumber ? 'error' : ''}`}
                                {...register('tcNumber', {
                                    onChange: (e) => e.target.value = e.target.value.replace(/\D/g, '')
                                })}
                                placeholder="11 haneli T.C. kimlik numaranız"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={11}
                            />
                            {errors.tcNumber && <span className="form-error">{errors.tcNumber.message}</span>}
                        </div>

                        {/* Phone */}
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label>Telefon <span style={{ color: '#FF6B6B' }}>*</span></label>
                            <input
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                {...register('phone', {
                                    onChange: (e) => e.target.value = e.target.value.replace(/\D/g, '')
                                })}
                                placeholder="05xx xxx xx xx"
                                type="tel"
                                inputMode="numeric"
                                maxLength={11}
                            />
                            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                        </div>

                        {/* Checkboxes */}
                        <div style={{ marginBottom: '1.2rem' }}>
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="confirm"
                                    className={errors.confirm ? 'checkbox-error' : ''}
                                    {...register('confirm')}
                                />
                                <label htmlFor="confirm">Verdiğim bilgilerin doğruluğunu onaylıyorum <span style={{ color: '#FF6B6B' }}>*</span></label>
                            </div>
                        </div>

                        {/* Actions Group - Pushed to bottom */}
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <button type="submit" className="btn-primary">
                                Kaydet ve Başla
                            </button>

                            <button
                                type="button"
                                className="btn-text-link"
                                onClick={() => onSubmit({
                                    firstName: 'Test',
                                    lastName: 'Kullanıcı',
                                    email: 'test@test.com',
                                    tcNumber: '11111111111',
                                    phone: '5551112233',
                                    confirm: true
                                })}
                                style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}
                            >
                                Test Modu (Hızlı Geçiş)
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </motion.div>
    );
}
