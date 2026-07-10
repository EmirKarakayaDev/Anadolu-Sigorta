// Aynı gün, farklı lokasyonlarda düzenlenen etkinlikler için ayrı veri/görünüm ayarları.
// QR kodları ?event=<slug> parametresiyle üretilir.
export const EVENTS = {
    uludag: {
        table: 'etkinlik_4_uludag',
        viewTable: 'etkinlik_4_uludag_derece',
        allowKiosk: false,
        rewardsEnabled: false,
    },
    cvk: {
        table: 'etkinlik_5_cvk',
        viewTable: 'etkinlik_5_cvk_derece',
        allowKiosk: true,
        rewardsEnabled: true,
    },
};

export function getEventConfig(slug) {
    return EVENTS[slug] ? { slug, ...EVENTS[slug] } : null;
}
