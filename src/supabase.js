import { createClient } from '@supabase/supabase-js';

// TODO: Supabase panelinden kopyaladığın URL ve Anon Key'i buraya yapıştır
const supabaseUrl = 'https://qmofcxbomxxvgvbxhqbw.supabase.co';
const supabaseAnonKey = 'sb_publishable_hsVxf7PNVbY5I4-rGv25sg_WqLLgrv0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveGameSession = async (userData, score) => {
    try {
        // API Bilgileri girildiyse veritabanına kaydet
        const { data, error } = await supabase
            .from('sessions')
            .insert([
                {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    tc_number: userData.tcNumber, // Eksik olan TC alanını ekledim
                    score: score,
                    device_type: window.innerWidth > 1024 ? 'kiosk' : 'mobile'
                }
            ])
            .select();

        if (error) throw error;
        return { success: true, id: data[0].id };
    } catch (e) {
        console.error("Supabase hata: ", e);
        return { success: false, error: e };
    }
};

export const getTopScores = async (limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
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
            .from('sessions')
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
