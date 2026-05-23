/* =====================================================
   ICONZA — CLIENTE SUPABASE ÚNICO
   Carregar este arquivo ANTES de qualquer outro JS do iconza
   ===================================================== */

(function() {
  'use strict';

  // CONFIGURAÇÃO DO PROJETO
  const SUPABASE_URL = 'https://rwnedxbhlnvmqjsdzwyo.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_Xy_ApKKAENTC_JYpQ4ZH0A_rpSqairk';

  // Verifica se o SDK do Supabase está carregado
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('⚠ Supabase SDK não foi carregado. Adicione antes deste script:\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return;
  }

  // Cria cliente único (singleton)
  if (!window.sb) {
    window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }

  // Expõe configuração para outras partes do app
  window.ICONZA_CONFIG = {
    SUPABASE_URL,
    SUPABASE_KEY,
    SITE_URL: window.location.origin,
  };
})();
