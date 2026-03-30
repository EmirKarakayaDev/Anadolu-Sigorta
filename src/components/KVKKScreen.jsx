import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function KVKKScreen({ onAccept, onDecline, isKiosk }) {
    const [isChecked, setIsChecked] = useState(false);
    const [showError, setShowError] = useState(false);
    const isMobile = window.innerWidth < 768;
    const pdfUrl = "https://www.anadolusigorta.com.tr/Files/GlobalDocument/kisisel_veri_basvuru_formu.pdf";

    const handleAcceptClick = () => {
        if (!isChecked) {
            setShowError(true);
            return;
        }
        onAccept();
    };

    const kvkkText = `
TİCARİ ELEKTRONİK İLETİ VE PAZARLAMA AYDINLATMA METNİ

Anadolu Anonim Türk Sigorta Şirketi (“Şirket” veya “Anadolu Sigorta”) olarak; veri sorumlusu sıfatıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“Kanun”) 10. maddesi kapsamında ticari elektronik ileti süreçleri kapsamında işlenen verilerinize ilişkin bilgilendirme aşağıda tarafınıza sunulmaktadır.

İŞLENEN KİŞİSEL VERİERİNİZ
Kanun uyarınca işlemeye konu olabilecek kişisel verileriniz şunlardır: Kimlik (ad, soyad), İletişim (telefon numarası, e-posta adresi), Pazarlama (alışveriş geçmişi bilgileri, kişiselleştirilmiş teklifler, anket, çerez kayıtları, kampanya çalışmasıyla elde edilen bilgiler), İşlem Güvenliği (ticari elektronik ileti ret/onay bilgileri, ticari elektronik ileti kayıtları).

KİŞİSEL VERİLERİNİZİN İŞLENME AMAÇLARI VE HUKUKİ SEBEPLERİ
Kişisel verileriniz, Şirket tarafından;
• Onay vermeniz halinde, Kanun’un 5. maddesinde yer alan ilgili kişinin açık rızası hukuki sebebine dayalı olarak; genel ve kişiselleştirilmiş kampanya, duyuru, reklam, teklif, pazarlama, avantaj, yeni ürün ve hizmet, yarışma, çekiliş, açılış, diğer etkinlikler, anket ve müşteri memnuniyeti faaliyetlerinin gerçekleştirilmesi kapsamında ticari elektronik ileti (SMS, arama, e-posta, whatsapp) gönderilmesi, web-push, app-push bildirimlerinin gönderilmesi, pop-up gösteriminin yapılması, elektronik ticaret faaliyetlerinin yürütülmesi amaçlarıyla işlenmektedir. Vermiş olduğunuz açık rızanızı her zaman gerekçesiz olarak geri alabileceğinizi belirtmek isteriz. Yürüttüğünüz işlemlerde ticari elektronik iletilere açık rıza vermek istemediğiniz takdirde, işlemlerinizi herhangi bir menfaat kaybı olmaksızın ve ticari elektronik ileti onayı gerekmeksizin aynı koşullar altında gerçekleştirebilirsiniz.

• Açık rızanız ile toplanan kişisel verileriniz, Kanun’un 5. maddesinde yer alan kanunlarda açıkça öngörülmesi ve veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması hukuki sebebine dayalı olarak; kanunlardan ve ikincil mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi, mevzuat, düzenleyici ve denetleyici faaliyetler kapsamında kanuna uygun talep ve zorunlulukların yerine getirilmesi, ticari elektronik ileti onay/ret ve kayıtlarının saklanması, bilgi güvenliği ve denetim faaliyetlerinin gerçekleştirilmesi amaçlarıyla işlenmektedir.

KİŞİSEL VERİLERİNİZİN ÜÇÜNCÜ KİŞİLERLE PAYLAŞILMASI
Kişisel verileriniz;
• İleti Yönetim Sistemi A.Ş. ile ilgili mevzuat, düzenleyici ve denetleyici faaliyetler kapsamında kanuna uygun talep ve zorunlulukların yerine getirilmesi, bu kapsamda alınan ticari elektronik ileti gönderimi onaylarının ve yapılan ret bildirimlerinin kaydedilebilmesi amacıyla veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması hukuki sebebine dayalı olarak,
• Hizmet tedarikçileri ile genel ve kişiselleştirilmiş kampanya, duyuru, reklam, teklif ve pazarlama faaliyetlerinin hazırlanması ve gönderilmesi kapsamında destek alınması ve 3. taraf firmalar ile ortak pazarlama faaliyetlerinin yürütülmesi ve ticari elektronik ileti gönderilmesi amaçlarıyla açık rıza hukuki sebebine dayalı olarak, Kanun’un kişisel verilerin aktarılmasına ilişkin 8. ve 9. maddesi uyarınca gerekli teknik ve idari tedbirler alınmak suretiyle, ilgili amacın gerçekleşmesi için gerekli olduğu ölçüde paylaşılmaktadır.

KİŞİSEL VERİLERİ TOPLAMA YÖNTEMİ
Kişisel verileriniz internet sitesi, mobil uygulamalar, çerezler, çağrı merkezi, elektronik araçlar aracılığıyla otomatik yollarla veya fiziksel formlar aracılığıyla otomatik olmayan yollarla toplanmaktadır.

İLGİLİ KİŞİLERİN HAKLARI
Kanun’un ilgili kişinin haklarını düzenleyen 11. maddesi kapsamındaki taleplerinizi, __PDF_URL__
adresinde yer alan başvuru formunda belirtilen bilgiler çerçevesinde iletebilirsiniz.

TİCARİ ELEKTRONİK İLETİ AÇIK RIZA METNİ

“Ticari Elektronik İleti Aydınlatma Metni” çerçevesinde yapılan bilgilendirme doğrultusunda Anadolu Sigorta tarafından tarafıma ticari elektronik ileti gönderilmesine ve bu amaçla tarafımla iletişime geçilmesine onay veriyorum.
    `;

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
                    <img
                        src={isKiosk ? "/as_logo.svg" : "/logo_trn.png"}
                        alt="Anadolu Sigorta"
                        className="brand-logo"
                        style={{ height: 'auto' }}
                    />

                    {/* Middle Block: başlık + scroll + checkbox — logo ile butonlar arasında ortalı */}
                    <div className="kvkk-mid-block" style={{
                        flex: isKiosk ? 1 : 'none',
                        minHeight: isKiosk ? 0 : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: isKiosk ? '1.5rem' : '1rem',
                    }}>
                        <h1 style={{
                            fontSize: isKiosk ? undefined : (isMobile ? '1.4rem' : '1.8rem'),
                            fontWeight: 800,
                            textAlign: 'center',
                            margin: '0'
                        }}>
                            Aydınlatma Metni
                        </h1>

                        <div className="kvkk-container" style={isKiosk ? { flex: 1, minHeight: 0 } : {}}>
                            {kvkkText.split("__PDF_URL__")[0]}
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    color: "#00A6FB",
                                    textDecoration: "underline",
                                    wordBreak: "break-all",
                                }}
                            >
                                {pdfUrl}
                            </a>
                            {kvkkText.split("__PDF_URL__")[1]}
                        </div>

                        {/* Checkbox - Immediately below the text box */}
                        <div className="checkbox-group" style={{
                            marginTop: '0',
                            marginBottom: isKiosk ? '0' : '1rem',
                            padding: isKiosk ? '0' : '0 8px'
                        }}>
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
                    </div>

                    {/* Block 3: Action Buttons at the extreme bottom */}
                    <div className="action-group" style={{
                        width: '100%',
                        display: 'flex',
                        gap: isKiosk ? '1.5rem' : '1rem',
                        flexDirection: (isKiosk || isMobile) ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: isKiosk ? '2rem' : 'auto',
                        paddingBottom: isKiosk ? '1rem' : '0'
                    }}>
                        <button
                            className="btn-primary"
                            style={{ flex: 1, width: '100%' }}
                            onClick={handleAcceptClick}
                        >
                            Onayla ve Devam Et
                        </button>
                        <button
                            className="btn-outline"
                            style={{ flex: 1, width: '100%' }}
                            onClick={onDecline}
                        >
                            Geri Dön
                        </button>
                    </div>
                </div>

                {isKiosk && (
                    <img
                        src="/logo_trn.png"
                        alt="Anadolu Sigorta"
                        className="brand-logo kiosk-logo-fixed"
                    />
                )}
            </div>
        </motion.div>
    );
}
