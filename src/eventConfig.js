// Aynı gün, farklı lokasyonlarda düzenlenen etkinlikler için ayrı veri/görünüm ayarları.
// cvk mevcut/varsayılan lokasyon olduğu için linki değişmez (?event olmadan da çalışır).
// uludag için linke ayrıca ?event=uludag eklenir.
const DEFAULT_EVENT = 'cvk';

export const EVENTS = {
    uludag: {
        table: 'etkinlik_4_uludag',
        viewTable: 'etkinlik_4_uludag_derece',
        allowKiosk: true,
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
    const resolvedSlug = slug || DEFAULT_EVENT;
    return EVENTS[resolvedSlug] ? { slug: resolvedSlug, ...EVENTS[resolvedSlug] } : null;
}
