import { createClient } from '@supabase/supabase-js';

// TODO: Supabase panelinden kopyaladığın URL ve Anon Key'i buraya yapıştır
const supabaseUrl = 'https://qmofcxbomxxvgvbxhqbw.supabase.co';
const supabaseAnonKey = 'sb_publishable_hsVxf7PNVbY5I4-rGv25sg_WqLLgrv0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveGameSession = async (userData, score) => {
    // 1. Google Sheets (Excel) Kaydı (Tam Otomatik)
    const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbx4tfD9BnZT9ZX75zpzXsseyGDlL74vqcMr9Pl0-khJ_zCHmlU_tBhTroz7sLO_oFUmiA/exec';

    // Google'a veri gönder (Sessizce çalışsın, oyun akışını bloklamasın)
    fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script için bu gerekli
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            tcNumber: userData.tcNumber,
            score: score,
            deviceType: window.innerWidth > 1024 ? 'kiosk' : 'mobile'
        })
    }).catch(e => console.error("Google Sheets Hatası:", e));

    try {
        // 2. Supabase Kaydı (Edge Function üzerinden)
        const response = await fetch(`${supabaseUrl}/functions/v1/save-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
            },
            body: JSON.stringify({
                userData: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    tcNumber: userData.tcNumber,
                    deviceType: window.innerWidth > 1024 ? 'kiosk' : 'mobile'
                },
                score: score
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        return { success: true, id: result.id };
    } catch (e) {
        console.error("Supabase hata: ", e);
        return { success: false, error: e };
    }
};

export const getTopScores = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('top_scores')
            .select('id, first_name, last_name, score, created_at')
            .order('score', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Skor çekme hatası: ", e);
        return [];
    }
};

export const getUserRank = async (sessionId) => {
    if (!sessionId) return null;
    try {
        // 1. Önce bu oturumun puanını al
        const { data: sessionData, error: sError } = await supabase
            .from('sessions')
            .select('score')
            .eq('id', sessionId)
            .single();

        if (sError || !sessionData) throw sError;
        const userScore = sessionData.score;

        // 2. Bu puandan daha yüksek puan alan kaç kişi olduğunu say (+1 ekle)
        const { count, error: cError } = await supabase
            .from('top_scores')
            .select('*', { count: 'exact', head: true })
            .gt('score', userScore);

        if (cError) throw cError;

        return {
            rank: count + 1,
            score: userScore
        };
    } catch (e) {
        console.error("Sıralama hesaplama hatası: ", e);
        return null;
    }
};
