-- ================================================================
-- 🛡️ تەكلىماكان سودا سۇپىسى — 10 كۈندىن ئاشقان پۈتكەن/بىكار قىلىنغان زاكازلارنىڭ شەخسىي ئۇچۇرىنى يۇيۇش (Privacy Wipe)
-- كىرىم ھېساباتى، ئومۇمىي سودا سوممىسى ۋە تاۋار سانلىق مەلۇماتى پۈتۈنلەي ساقلىنىدۇ، پەقەت خېرىدارنىڭ ئىسمى، تېلېفونى ۋە ئادرېسى ئۆچۈرۈلىدۇ
-- Supabase SQL Editor غا چاپلاپ ئىجرا قىلىسىز
-- ================================================================

-- 1. orders جەدۋىلىگە completed_at ئىستونى قوشۇش (ئەگەر بولمىسا)
ALTER TABLE IF EXISTS public.orders 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NULL;

-- 2. 10 كۈن توشقان زاكازلارنىڭ شەخسىي ئۇچۇرىنى يۇيۇش فۇنكسىيەسى
CREATE OR REPLACE FUNCTION public.anonymize_expired_orders(days_threshold INT DEFAULT 10)
RETURNS INT AS $$
DECLARE
    affected_rows INT;
BEGIN
    UPDATE public.orders
    SET 
        customer = jsonb_build_object(
            'name', '[شەخسىي ئۇچۇر ئۆچۈرۈلدى]',
            'phone', '',
            'address', '',
            'city', '',
            'isAnonymized', true,
            'anonymizedAt', NOW()
        ),
        notes = '',
        tracking_number = NULL
    WHERE status IN ('تاماملاندى', 'بىكار قىلىندى')
      AND (
          customer IS NULL 
          OR (customer->>'isAnonymized') IS NULL 
          OR (customer->>'isAnonymized')::boolean = false
      )
      AND (
          COALESCE(
              completed_at, 
              shipped_at, 
              CASE 
                  WHEN date ~ '^\d{4}[-/]\d{2}[-/]\d{2}' THEN date::TIMESTAMPTZ 
                  ELSE NULL 
              END, 
              created_at, 
              NOW()
          ) < NOW() - (days_threshold || ' days')::INTERVAL
      );

    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. pg_cron ئارقىلىق ھەر كۈنى كېچە سائەت 03:00 دە ئاپتوماتىك قوزغىتىش (ئەگەر pg_cron قوزغىتىلغان بولسا)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.unschedule('anonymize-privacy-orders-daily');
        PERFORM cron.schedule(
            'anonymize-privacy-orders-daily',
            '0 3 * * *',
            'SELECT public.anonymize_expired_orders(10);'
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- pg_cron بولمىسا سۈكۈت قىلىپ ئۆتۈش
END $$;
