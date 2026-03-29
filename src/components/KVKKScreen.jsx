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

    const kvkkText = `
KİŞİSEL VERİLERİN İŞLENMESİNDE UYULACAK ESASLARA İLİŞKİN PROTOKOL 

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

Bu protokol, 7 Nisan 2016 tarihli Resmi Gazete’de yayımlanan 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun amaçları doğrultusunda kişisel verilerin işlenmesi ve aktarılması hususunda uyulacak esasları içermek amacıyla ___/___/___ tarihinde iki (2) nüsha olarak imzalanmıştır. 

1. Madde – Tanımlar 
İşbu Protokol’de geçen; 
a) Veri Sorumlusu: Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi, 
b) Veri İşleyen: Veri Sorumlusu’nun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişiyi, 
c) Alt Veri İşleyen: Veri sorumlusu adına işlenen kişisel verileri Veri İşleyen’in ayrı bir yazılı sözleşme ile verdiği yetkiye dayalı olarak işleyen gerçek veya tüzel kişiyi, 
d) İlgili Kişi: Kişisel verisi işlenen gerçek kişiyi, 
e) Kişisel Veri: Hizmet kapsamında kimliği belirli veya belirlenebilir gerçek kişiye ilişkin işlenen her türlü işlemi kapsar. 
f) Özel Nitelikli Kişisel Veri: Kişilerin ırkı, etnik kökeni, siyasi düşüncesi, felsefi inancı, dini, mezhebi veya diğer inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri, 
g) Kişisel Verilerin İşlenmesi: Kişisel verilerin tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hâle getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi veriler üzerinde gerçekleştirilen her türlü işlemi, 
h) Kişisel Verilerin İmha Edilmesi: Kişisel Verilerin silinmesini, yok edilmesini veya anonim hale getirilmesini, 

i) Güvenlik İhlali: İşlenen kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesini, 
j) Kanun: 6698 sayılı Kişisel Verilerin Korunması Kanunu’nu, 
k) Kurul: Kişisel Verileri Koruma Kurulu’nu, 
l) Kurum: Kişisel Verileri Koruma Kurumu’nu 
m) Mevzuat: Kanun ile ikincil mevzuatı, Kurul tarafından alınan kararlar ile yayımlanan rehberlerin tamamını, 
n) Teknik ve İdari Tedbirler: Kanun’da belirtilen ve Kişisel Verilerin muhafazasını sağlamak, amacıyla uygun güvenlik düzeyini temin etmeye yönelik gerekli her türlü teknik ve idari tedbirleri ifade eder. 
Bu Protokol’de yer almayan tanımlar için mevzuatta yer alan tanımlar söz konusu olacaktır. 

2. Madde – Uygulama Alanı ve Veri İşleme Esasları 
İşbu Protokol, Taraflar arasında yürürlüğe girmiş ve/veya girecek tüm sözleşmelerde 6698 sayılı Kişisel Verilerin Korunması Kanunu’ndan ve kişisel verilerin korunmasına ilişkin yürürlükteki ve/veya yürürlüğe girebilecek sair mevzuattan doğan ve/veya doğabilecek yükümlülüklere ilişkin tüm hususlarda uygulanır. 

İşbu Protokol kapsamındaki işleme faaliyeti, Veri Sorumlusu sıfatını haiz Anadolu Anonim Türk Sigorta Şirketi ile Veri İşleyen sıfatını haiz _______________ arasında sözlü veya yazılı olarak ya da elektronik vasıtalarla ve sair şekillerde paylaşılacak her türlü Kişisel Veri aktarımından ibarettir. 

Veri İşleyen; söz konusu Kişisel Verileri mevzuata uygun olarak, işbu protokoldeki hüküm ve koşullar dâhilinde ve Kanun’un 4. maddesinde belirtilen ilkelere aykırı olmayacak şekilde işleyecektir. 

3. Madde – Veri İşleyen’in Yükümlülükleri 
Veri İşleyen, işbu sözleşme uyarınca Anadolu Sigorta adına kişisel veri işlediği hallerde; 
(a) yalnızca Anadolu Sigorta’nın talimatları doğrultusunda ve işbu Protokole uygun bir biçimde kişisel verileri işleyeceğini, herhangi bir sebeple talimatlara riayet edemeyecek durumda olması halinde Anadolu Sigorta’yı derhal bilgilendireceğini, 
(b) ancak taraflar arasındaki Sözleşme’nin gerektirdiği kapsamda, kişisel verilerin korunmasına ilişkin mevzuat çerçevesinde ve yalnızca Sözleşmede belirtilen amaçlarla bağlantılı, sınırlı ve ölçülü şekilde kişisel verileri işleyeceğini, 
(c) işlediği kişisel verilere ilişkin olarak süresiz sır saklama yükümlülüğüne tabi olacağını; 
(d) yalnızca Türkiye Cumhuriyeti sınırları dahilinde veri işleyeceğini; 
(e) kişisel verilerin hukuka aykırı olarak işlenmesini, bunlara hukuka aykırı olarak erişilmesini önlemeye, bunların muhafazasını sağlamaya; veri kaybı oluşmasını, verilerin yok olmasını, zarar görmesini, değiştirilmesini veya açıklanmasını engellemeye yönelik, söz konusu verinin niteliklerini, işleme faaliyetinin kapsamını ve ihlal halinde oluşacak zararın büyüklüğünü de göz önünde bulundurarak, gerekli teknik ve idari tedbirleri almayı; 
(f) Aktarıma konu Kişisel Verilerin doğru ve güncel olduğunu, 
(g) Talep halinde söz konusu Kişisel Verinin doğruluğunu teyit eder ilgili form, belge, görüntü ve bilgisayar kayıtları da dahil ve fakat bununla sınırlı olmaksızın her türlü bilgi ve/veya belgeyi Kanun’un amaçlarına uygun şekilde Anadolu Sigorta’ya ibraz edeceğini, 
(h) İşlediği Kişisel Verilere ilişkin olarak sır saklama yükümlülüğü altında bulunduğunu, bu yükümlülüğün iş ilişkisinin son bulması halinde de süresiz olarak devam edeceğini bildiğini, 
(i) verilerin bir kısmının veya tamamının yok edilmesi veya iade edilmesinin mevzuata aykırılık teşkil ettiği hallerde verileri gizli tutacağını ve veri saklama amacı haricinde herhangi bir amaçla işlemeyeceğini kabul, beyan ve taahhüt eder. 

4. Madde – Veri İşleyen’in Veri Sorumlusu Olarak Kabul Edileceği Haller 
Veri İşleyen; işbu Sözleşme kapsamındaki yükümlülüklerin dışında yahut bu yükümlülüklere aykırı olarak ve Anadolu Sigorta tarafından kendisine tanınan yetki dışında, veri işleme amaç ve vasıtalarını bizatihi kendi belirleyerek gerçekleştirdiği faaliyetler bakımından veri sorumlusu kabul edilecektir. Bu takdirde Anadolu Sigorta’nın herhangi bir zarara ve/veya kayba uğraması halinde; Veri İşleyen, veri sorumlusu sıfatını haiz olarak sebep olduğu tüm zarar, kayıp ve/veya harcamaları Anadolu Sigorta’nın ilk talebi üzerine derhal tazmin edeceğini taahhüt eder. 

Hizmetin niteliği gereği Tarafların veri sorumlusu olarak kabul edildiği veri işleme faaliyetleri söz konusu olduğu hallerde, her bir Taraf Mevzuat’ın veri sorumlusu bakımından getirdiği yükümlülüklere uygun hareket edecektir. 

5. Madde – Veri İşleyen’in Personeli 
Veri İşleyen, Kişisel Veriye erişimi olan personelinin güvenilirliğini temin bakımından gizlilik taahhütnameleri başta olmak üzere gerekli önlemlerini alacak, Kişisel Verilerin İşlenmesinde yalnızca kişisel verilerin korunması mevzuatı ve kişisel verilerin niteliği hakkında bilgilendirilmiş personel kullanacaktır. 

Veri İşleyen, kendisiyle paylaşılan veya Anadolu Sigorta adına elde ettiği kişisel verilere erişimi hizmet kapsamında gerekli minimum sayıda personel ile sınırlandıracak, bu personele düzenli farkındalık eğitimi sunacak ve bu kişisel verilere izinsiz erişimi engelleyecek politikalar yürütecektir. 

6. Madde – Aydınlatma ve Açık Rıza Yükümlülüklerinin Yerine Getirilmesi 
Taraflar arasındaki hizmetin niteliği çerçevesinde kişisel verilerin ilgili kişilerden doğrudan Veri İşleyen tarafından toplanmasının söz konusu olduğu hallerde Veri İşleyen; Anadolu Sigorta’nın yönlendirmelerine gereği gibi uyacağını ve bu kapsamda Anadolu Sigorta adına Kanun’un 10. maddesinde belirtilen aydınlatma yükümlülüğü ve gerekmesi halinde açık rızanın toplanması süreçlerini yerine getirecektir. Veri İşleyen, Anadolu Sigorta’nın talebi halinde paylaşılmak üzere, iletilen aydınlatma ve açık rıza metinlerine ilişkin kayıtları ispat edilebilir şekilde tutacaktır. 

7. Madde – Kişisel Verilerin 3. Kişilerle Paylaşımı 
Veri İşleyen kanunen yetkili idari veya adli makamlarca mevzuata uygun biçimde talep edilmedikçe, işbu protokolün açıkça izin verdiği haller haricinde ve hizmet zorunlu kılmadıkça kişisel verileri 3. kişilere aktarmayacak veya ifşa etmeyecektir. 

Veri işleyen, sözleşme konusu hizmeti ifa ederken, sözleşmeye konu kişisel verileri, alt veri işleyene aktarması gereken hallerde, veri sorumlusunu ispat edilebilir şekilde bilgilendirmeli ve yazılı onayını almalıdır. 

Veri İşleyen, alternatif olarak kullanacağı alt veri işleyenleri işbu Protokol’ün ekinde bir liste halinde önceden belirterek Anadolu Sigorta’nın onayını alabilir. Veri İşleyen, bu listeye yeni alt işverenlerin eklenmesini veya mevcut listenin değiştirilmesi talebini değişiklikten en az 15 (on beş) gün önce yazılı olarak Anadolu Sigorta’ya bildirecek ve onayını alacaktır. 

İşbu Protokol kapsamında onay verilen 3. Kişilerle Veri İşleyen tarafından kişisel veri paylaşılması halinde, söz konusu aktarımın güvenli bir şekilde sağlanmasından Veri İşleyen sorumlu olacaktır. Veri İşleyen, kişisel verilerin paylaşımına ilişkin olarak üçüncü kişilerle yapılan sözleşmenin asgari olarak işbu Protokol’deki yükümlülükleri ve korumayı içereceğini taahhüt eder. Anadolu Sigorta, söz konusu kişisel veri aktarımına ilişkin detaylı bilgi talep etme hakkına sahiptir. 

8. Madde – Teknik ve İdari Tedbirler 
Veri işleyen, hizmet kapsamında fiziksel ve elektronik her türlü ortamda işlediği kişisel verilere ilişkin olarak Kanun’un 12. maddesinin 1. fıkrasında düzenlenen yükümlülükler çerçevesinde kişisel verilerin hukuka aykırı olarak işlenmesinin önlenmesi, kişisel verilere hukuka aykırı olarak erişimin önlenmesi ve kişisel verilerin muhafazasını sağlamak amacıyla uygun güvenlik düzeyini sağlamakla yükümlüdür. 

Veri işleyen hizmet kapsamında özel nitelikli verilerin işlenmesi halinde; özel nitelikli kişisel verilerin işlenmesinde alınması gereken önlemler ile ilgili Kişisel Verileri Koruma Kurulunun 31/01/2018 tarihli ve 2018/10 sayılı kararında belirlenen asgari önlemleri almakla yükümlü olduğunu kabul eder. 

Veri İşleyen, kişisel verilerin işlendiği, muhafaza edildiği ve/veya erişildiği elektronik ortam başta olmak üzere tüm ortamların uygun güvenlik düzeyini sağlayacağını taahhüt eder. Kişisel verilerin kendisi tarafından tasarlanan herhangi bir yazılım/programa aktarıldığı hallerde söz konusu aktarımın ve kişisel verilerin saklandığı ortamların güvenliği için gerekli teknik ve idari bütün tedbirleri aldığını kabul eder. Bu konularla ilgili Veri İşleyen’in herhangi bir işlemi ve/veya ihmali nedeniyle Anadolu Sigorta’nın herhangi bir zarara ve/veya kayba uğraması halinde; Veri İşleyen, Anadolu Sigorta’nın söz konusu işlemlerden ve/veya ihmallerinden doğan tüm zarar, kayıp ve/veya harcamalarını Anadolu Sigorta’nın ilk talebi üzerine derhal tazmin edeceğini taahhüt eder. 

Veri İşleyen, Anadolu Sigorta’nın onayı doğrultusunda eriştiği kişisel veri bulunduran elektronik sistemlerin kullanımı kapsamında kendisine şifre tanımlanması halinde şifre güvenliği yükümlülüklerine uygun hareket edecektir. Tanımlanacak şifrelerin herhangi bir yere yazılmaması ve hiçbir koşulda yetkili olmayan bir kişiyle paylaşılmaması için gerekli tüm tedbirleri alacak ve personelini bilgilendirecektir. Şifrenin kullanıcı dışındaki kişiler tarafından öğrenilmesi yahut şifreye ilişkin şüpheli herhangi bir durumun mevcut olması halinde derhal Anadolu Sigorta’yı bilgilendirecektir. 

9. Madde – Bildirim Yükümlülüğü 
Veri İşleyen; veri işleme faaliyeti çerçevesinde herhangi bir Güvenlik İhlali tespit ettiğinde veya veri güvenliğine ilişkin şüphelendiği bir durumun mevcut olması halinde yahut İlgili Kişi tarafından kişisel verilerin korunması mevzuatı çerçevesinde Anadolu Sigorta’nın yükümlülüklerine ilişkin şikayet veya herhangi bir talepte bulunulması halinde, en geç bir (1) iş günü içerisinde Anadolu Sigorta’yı haberdar edecektir. Veri İşleyen, Anadolu Sigorta’ya kendisine iletilen her türlü ihlal, şikayet ve talep hakkında gerekli desteği verecek ve Anadolu Sigorta ile işbirliği yapacaktır. Burada sayılanlarla sınırlı olmamak üzere Veri İşleyen; 
(a) Anadolu Sigorta’ya ihlal, şikayet veya talebe ilişkin tüm detayları ileteceğini ve bu konuya ilişkin gerekli her türlü bilgi ve belgeyi sunacağını, 
(b) Kişisel verilerin yasa gereği açıklanması gerekli olduğu hallerde derhal Anadolu Sigorta'ya ihbarda bulunmayı, 
(c) Anadolu Sigorta’nın talimatları doğrultusunda veriye erişim taleplerini yerine getireceğini kabul, beyan ve taahhüt eder. 

10. Veri İşleyen’in Denetimi 
Veri İşleyen, işbu Protokol kapsamındaki kişisel verilerin işlenmesine ilişkin olarak gerekli olduğu hallerde Anadolu Sigorta’nın denetimine tabi olduğunu kabul and beyan eder. Anadolu Sigorta, denetim faaliyetlerinin Hizmet kapsamında belirtilen işleme faaliyetleriyle sınırlı olarak, Anadolu Sigorta bünyesinde yer alan ya da bağımsız üyelerden oluşan ve veri sorumlusu tarafından seçilen, gerekli mesleki niteliklere sahip ve gizlilik yükümlülüğüne tabi olan kişiler tarafından gerçekleştirileceğini taahhüt eder. 

Bu madde kapsamında Anadolu Sigorta tarafından gerçekleştirilecek denetleme sırasında Veri İşleyen soruların cevaplanması için yeterli uzmanlık ve yetki düzeyine sahip bir veya birden fazla personeli hazır bulunduracaktır. 

Veri işleyen işbu protokol kapsamındaki veri işlenmesine ilişkin tüm kayıt ve dokümanları Anadolu Sigorta’nın talebi halinde veri işlemenin mevzuata ve protokole uygunluğu bakımından incelenmesi için Anadolu Sigorta’ya gönderecektir. 

11. Madde – Rücu Şartları 
Veri İşleyen, yürüttüğü veri işleme faaliyetleri kapsamında Anadolu Sigorta’nın 3.kişilere karşı yükümlülüklerini göz önünde bulunduracaktır. Veri İşleyen’in işbu protokole aykırı davranması sebebiyle Anadolu Sigorta’nın dava sonucu veya ilama gerek kalmaksızın 3.kişilere herhangi bir tazminat veya ilgili mercilere idari para cezası ödemekle yükümlü kalması halinde; Anadolu Sigorta Veri İşleyen’e rücu edebilecektir. Bu durumda Veri İşleyen, Anadolu Sigorta’nın makul vekalet ücretleri ve yargılama masrafları da dahil tüm giderleri ilk talebinde, derhal, nakden ve defaten Anadolu Sigorta’ya ödeyecektir. 

12. Madde – Verilerin Silinmesi veya Yok Edilmesi 
Veri İşleyen, Anadolu Sigorta’nın talebi başta olmak üzere aralarındaki sözleşmenin feshedilmesi veya yürürlük süresinin sona ermesi halinde, Kanun ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen işlenmesini gerektiren sebeplerin ortadan kalkması halinde, işbu Protokol kapsamında aktarıma konu kişisel verileri, yedekleri ile birlikte Anadolu Sigorta’ya derhal geri göndereceğini ya da kişisel verileri tamamen sileceğini veya yok edeceğini, mevzuatta Veri İşleyen’in bu yükümlülüğü yerine getirmesini engelleyen hükümler varsa, aktarıma konu kişisel verilerin gizliliğini güvence altına almak için gerekli Teknik ve İdari tedbirleri alacağını ve veri işleme faaliyetini durduracağını kabul eder. 
Veri İşleyen, Taraflar arasındaki sözleşmenin yürürlükte olduğu süre boyunca da işlenmesini gerektiren sebeplerin ortadan kalktığı kişisel verileri yedekleri ile birlikte Anadolu Sigorta’ya geri gönderecek ya da kişisel verileri tamamen silecek veya yok edecektir. 

13. Madde – Sözleşmenin Süresi ve Fesih 
İşbu Protokol, Taraflarca imzalandığı tarihte yürürlüğe girer. Hizmet’in sunulmasına ilişkin taraflar arasında yapılmış ve/veya yapılacak sözleşmelerden herhangi birinin feshi halinde işbu sözleşme yürürlükte kalmaya devam eder. 

İşbu Protokol’ün herhangi bir hükmüne aykırılık halinde Anadolu Sigorta’nın ihtarına rağmen Veri İşleyen’e verilen 30 günlük süre içerisinde aykırılık giderilmezse Anadolu Sigorta Hizmet’in sunulmasına ilişkin taraflar arasında yapılmış ve/veya yapılacak tüm sözleşmeleri feshedebilir. 

14. Madde – Öncelikle Uygulanma 
İşbu Protokolün uygulama alanına giren hallerde, Protokol hükümleri ile Taraflar arasında yapılmış ve/veya yapılacak sözleşme hükümleri arasında ihtilaf çıktığında işbu Protokol hükümleri öncelikle uygulanır. Anadolu Sigorta bu hükmü değiştirmeye yönelik tüm icapları peşinen reddeder. 

TARAFLAR 

KURUM TİCARİ ADI: ANADOLU ANONİM TÜRK SİGORTA ŞİRKETİ 
KURUM TABELA ADI: 

EK 1: Protokol Kapsamında Kişisel Verisi Aktarılan Veri Konusu Kişi Grupları 
- Çalışan/Stajyer 
- Müşteri 
- Çalışan Adayı 
- Potansiyel Müşteri 
- Temsilciler 
- Veli/Vasi 
- Tedarikçi/İş Ortağı 
- Ziyaretçiler 

Protokol Kapsamında Aktarılan Kişisel Veri Kategorileri 
- Kimlik 
- Lokasyon 
- Özlük 
- Dernek Üyeliği 
- İşlem Güvenliği 
- Finans 

Veri Sorumlusu Adına İşlenen Kişisel Verilerin Aktarım Amaçları 
Lütfen aktarım amaçlarını belirtiniz.... 

Kullanılan Alt Veri İşleyenler 
Alt Veri İşleyenin Tam Adı | Adresi | Veri İşleyen’e Sunduğu Hizmet
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
                        src={isKiosk ? "/beyaz_as_logo.png" : "/logo_trn.png"}
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
                        gap: isKiosk ? '1.5rem' : 0,
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
                            {kvkkText}
                        </div>

                        {/* Checkbox - Immediately below the text box */}
                        <div className="checkbox-group" style={{
                            marginTop: isKiosk ? '0' : '1.5rem',
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
