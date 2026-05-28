-- ================================================
-- SUP Konyaaltı — Supabase Migration v2
-- Mevcut ayarlar tablosuna yeni sütunlar ekler
-- Supabase SQL Editor'de çalıştırın
-- ================================================

-- Google Sheets entegrasyonu için URL
ALTER TABLE public.ayarlar
  ADD COLUMN IF NOT EXISTS sheets_url TEXT DEFAULT '';

-- OpenWeather API anahtarı
ALTER TABLE public.ayarlar
  ADD COLUMN IF NOT EXISTS weather_api_key TEXT DEFAULT '';

-- Admin şifresi (admin paneli login için)
ALTER TABLE public.ayarlar
  ADD COLUMN IF NOT EXISTS admin_password TEXT DEFAULT 'sup2024';

-- Mevcut satırı güncelle (varsayılan değerler)
UPDATE public.ayarlar
SET
  sheets_url      = COALESCE(sheets_url, ''),
  weather_api_key = COALESCE(weather_api_key, ''),
  admin_password  = COALESCE(NULLIF(admin_password, ''), 'sup2024')
WHERE id = 1;

-- ================================================
-- NOT: Bu SQL'i çalıştırdıktan sonra admin panelinde
-- Fiyat & Ayarlar sayfasından Google Sheets URL ve
-- OpenWeather API anahtarını girebilirsiniz.
-- ================================================
