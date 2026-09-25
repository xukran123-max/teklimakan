-- ================================================================
-- 📊 تەكلىماكان سودا سۇپىسى — ھەر ھەپتىنىڭ يەكشەنبە كۈنى سائەت 08:00 دە ۋاكالەتچىلەر خۇلاسىسى ۋە رېغبەتلەندۈرۈش
-- 1. پائال سېتىش قىلغان ۋاكالەتچىلەرنىڭ ماللىرى، ئەڭ كۆپ ساتقىنى، پىرسەنتى ۋە بېرىلىدىغان پۇلىنى قۇلۇپلاپ ساقلاش
-- 2. ھېچقانداق مال ساتالمىغانلارنى دوكلاتتىن چىقىرىۋېتىپ، ئۇلارغا ئارقا سۇپىدىن رېغبەتلەندۈرۈش خاتىرىسى قالدۇرۇش
-- Supabase SQL Editor غا چاپلاپ ئىجرا قىلىسىز
-- ================================================================

-- 1. ھەپتىلىك ۋاكالەتچى خۇلاسىسى ۋە چىقىم دوكلاتى جەدۋىلى قۇرۇش
CREATE TABLE IF NOT EXISTS public.agent_weekly_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_title TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    active_agents_count INT DEFAULT 0,
    zero_sales_agents_count INT DEFAULT 0,
    total_sales_revenue NUMERIC(12,2) DEFAULT 0,
    total_commission_payout NUMERIC(12,2) DEFAULT 0,
    payout_report JSONB DEFAULT '[]'::jsonb, -- پەقەت سېتىش قىلغان ۋاكالەتچىلەرلا بار
    encouragements_log JSONB DEFAULT '[]'::jsonb, -- نۆل سېتىش ۋاكالەتچىلىرىگە ئەۋەتىلگەن ئىلھاملاندۇرۇش خاتىرىسى
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS سىياسىتى
ALTER TABLE public.agent_weekly_summaries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'agent_weekly_summaries' AND policyname = 'Allow public read agent weekly summaries'
    ) THEN
        CREATE POLICY "Allow public read agent weekly summaries" 
        ON public.agent_weekly_summaries FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'agent_weekly_summaries' AND policyname = 'Allow service role insert agent weekly summaries'
    ) THEN
        CREATE POLICY "Allow service role insert agent weekly summaries" 
        ON public.agent_weekly_summaries FOR ALL USING (true);
    END IF;
END $$;

-- 2. ھەپتىلىك ئاپتوماتىك قۇلۇپلاش ۋە دوكلات ھاسىللاش فۇنكسىيەسى
CREATE OR REPLACE FUNCTION public.generate_weekly_agent_summary()
RETURNS JSONB AS $$
DECLARE
    v_period_title TEXT;
    v_start_time TIMESTAMPTZ;
    v_end_time TIMESTAMPTZ;
    v_active_count INT := 0;
    v_zero_count INT := 0;
    v_total_sales NUMERIC(12,2) := 0;
    v_total_commission NUMERIC(12,2) := 0;
    v_payout_list JSONB := '[]'::jsonb;
    v_encourage_list JSONB := '[]'::jsonb;
    v_new_record_id UUID;
    v_agent RECORD;
    v_agent_sales NUMERIC(12,2);
    v_agent_units INT;
    v_comm_rate NUMERIC;
    v_comm_payout NUMERIC(12,2);
    v_top_product_name TEXT;
    v_top_product_qty INT;
    v_msg TEXT;
BEGIN
    v_end_time := NOW();
    v_start_time := NOW() - INTERVAL '7 days';
    v_period_title := TO_CHAR(v_start_time, 'YYYY-MM-DD') || ' دىن ' || TO_CHAR(v_end_time, 'YYYY-MM-DD') || ' غىچە (يەكشەنبە 08:00)';

    -- ۋاكالەتچىلەر ئۈستىدە دەۋرىيلەش
    FOR v_agent IN 
        SELECT id, name, phone, city, COALESCE(commission_rate, 15) AS commission_rate 
        FROM public.agents 
        WHERE status = 'تەستىقلاندى'
    LOOP
        -- شۇ ۋاكالەتچىنىڭ ئۆتكەن 7 كۈندىكى سېتىش مىقدارىنى ھېسابلاش
        SELECT 
            COALESCE(SUM((item->>'price')::NUMERIC * (item->>'quantity')::INT), 0),
            COALESCE(SUM((item->>'quantity')::INT), 0)
        INTO v_agent_sales, v_agent_units
        FROM public.orders o,
             jsonb_array_elements(o.items) item
        JOIN public.products p ON p.id = (item->>'id')::INT
        WHERE (p.agent_id = v_agent.id OR p.agent_name ILIKE '%' || v_agent.name || '%')
          AND o.created_at >= v_start_time
          AND o.status NOT IN ('بىكار قىلىندى', 'قايتۇرۇلدى');

        v_comm_rate := v_agent.commission_rate;
        v_comm_payout := ROUND(v_agent_sales * (v_comm_rate / 100.0), 2);

        -- سېتىش قىلغان بولسا -> چىقىم دوكلاتىغا قوشۇش
        IF v_agent_units > 0 AND v_agent_sales > 0 THEN
            -- ئەڭ كۆپ ساتقان مەھسۇلاتنى تېپىش
            SELECT item->>'name', SUM((item->>'quantity')::INT)
            INTO v_top_product_name, v_top_product_qty
            FROM public.orders o,
                 jsonb_array_elements(o.items) item
            JOIN public.products p ON p.id = (item->>'id')::INT
            WHERE (p.agent_id = v_agent.id OR p.agent_name ILIKE '%' || v_agent.name || '%')
              AND o.created_at >= v_start_time
              AND o.status NOT IN ('بىكار قىلىندى', 'قايتۇرۇلدى')
            GROUP BY item->>'name'
            ORDER BY SUM((item->>'quantity')::INT) DESC
            LIMIT 1;

            v_active_count := v_active_count + 1;
            v_total_sales := v_total_sales + v_agent_sales;
            v_total_commission := v_total_commission + v_comm_payout;

            v_payout_list := v_payout_list || jsonb_build_object(
                'agent_id', v_agent.id,
                'name', v_agent.name,
                'phone', v_agent.phone,
                'city', v_agent.city,
                'weekly_sales', v_agent_sales,
                'units_sold', v_agent_units,
                'top_selling_product', v_top_product_name || ' (' || v_top_product_qty || ' دانە)',
                'commission_rate', v_comm_rate,
                'payout_due', v_comm_payout
            );
        ELSE
            -- ھېچقانداق مال ساتالمىغان بولسا -> دوكلاتتىن چىقىرىۋېتىش، رېغبەتلەندۈرۈش ئۇچۇرى ھاسىللاش
            v_zero_count := v_zero_count + 1;
            v_msg := 'ھۆرمەتلىك ' || v_agent.name || '، بۇ ھەپتىلىك ھەمكارلىقىڭىزغا كۆپ تەشەككۈر! گەرچە بۇ ھەپتە تاۋارلىرىڭىزدىن زاكاز چىقمىغان بولسىمۇ، تەكلىماكان سۇپىمىزدا يېڭى پائالىيەت ۋە مەخسۇس ئېتىبار كۇپونلىرىمىز تەييارلاندى. ئىجتىمائىي تاراتقۇلاردا مەھسۇلات ئۇلانمىلىرىڭىزنى كۆپرەك ھەمبەھىرلەپ، كېلەر ھەپتىلىك ئالتۇن دەرىجىلىك يۇقىرى كىرىمگە بىرلىكتە ئېرىشەيلى! كۈچ چىقىرىڭ، بىز سىزنى باشتىن-ئاخىر قوللايمىز! 🌟 تەكلىماكان سودا تورى';

            v_encourage_list := v_encourage_list || jsonb_build_object(
                'agent_id', v_agent.id,
                'name', v_agent.name,
                'phone', v_agent.phone,
                'city', v_agent.city,
                'message', v_msg,
                'sent_at', NOW()
            );
        END IF;
    END LOOP;

    -- خۇلاسە خاتىرىسىنى كىرگۈزۈش
    INSERT INTO public.agent_weekly_summaries (
        period_title,
        active_agents_count,
        zero_sales_agents_count,
        total_sales_revenue,
        total_commission_payout,
        payout_report,
        encouragements_log
    ) VALUES (
        v_period_title,
        v_active_count,
        v_zero_count,
        v_total_sales,
        v_total_commission,
        v_payout_list,
        v_encourage_list
    ) RETURNING id INTO v_new_record_id;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_new_record_id,
        'period', v_period_title,
        'active_count', v_active_count,
        'zero_count', v_zero_count,
        'total_sales', v_total_sales,
        'total_commission', v_total_commission
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. pg_cron ئارقىلىق ھەر ھەپتىنىڭ يەكشەنبە كۈنى سائەت 08:00 دە ئاپتوماتىك قوزغىتىش (UTC 05:00 = تۈركىيە ۋاقتى 08:00)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.unschedule('weekly-agent-summary-sunday-8am');
        PERFORM cron.schedule(
            'weekly-agent-summary-sunday-8am',
            '0 5 * * 0', -- ھەر يەكشەنبە كۈنى UTC سائەت 05:00 (UTC+3 سائەت 08:00)
            $$SELECT public.generate_weekly_agent_summary()$$
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'pg_cron تەڭشەشتە ئەسكەرتىش: %', SQLERRM;
END $$;
