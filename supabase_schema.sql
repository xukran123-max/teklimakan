-- =========================================================================
-- تەكلىماكان ئېلېكترونلۇق سودا سۇپىسى مەركىزىي سانلىق مەلۇمات ئامبىرى (Supabase SQL)
-- =========================================================================

-- 1. تاۋارلار جەدۋىلى (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  stock INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  rating_count INTEGER DEFAULT 1,
  image TEXT,
  description TEXT,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  approval_status TEXT DEFAULT 'تەستىقلاندى',
  language_scope TEXT DEFAULT 'all',
  merchant_badge TEXT DEFAULT 'ئىشەنچىلىك سودىگەر',
  agent_id TEXT,
  agent_name TEXT,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. زاكازلار جەدۋىلى (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal_cny NUMERIC DEFAULT 0,
  discount_cny NUMERIC DEFAULT 0,
  delivery_fee_cny NUMERIC DEFAULT 0,
  total_cny NUMERIC NOT NULL,
  total_formatted TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'ساقلاۋاتىدۇ',
  date TEXT,
  notes TEXT,
  language TEXT DEFAULT 'ug',
  currency TEXT DEFAULT 'TRY',
  tracking_carrier TEXT,
  tracking_number TEXT,
  shipped_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ۋاكالەتچىلەر جەدۋىلى (agents)
CREATE TABLE IF NOT EXISTS public.agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  status TEXT DEFAULT 'تەستىقلاندى',
  reputation TEXT DEFAULT 'ئىشەنچىلىك سودىگەر',
  can_publish_multilingual BOOLEAN DEFAULT false,
  authorized_brands JSONB DEFAULT '[]'::jsonb,
  registered_at TEXT,
  auth_expire_date TEXT,
  cert_code TEXT,
  products_count INTEGER DEFAULT 0,
  sales_total NUMERIC DEFAULT 0,
  monthly_sales NUMERIC DEFAULT 0,
  monthly_orders INTEGER DEFAULT 0,
  commission_rate NUMERIC DEFAULT 15,
  violations_count INTEGER DEFAULT 0,
  suspended_until TIMESTAMPTZ,
  suspension_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. كۇپونلار جەدۋىلى (coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  expire_date TEXT,
  usage_limit INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS (Row Level Security) كېلىشىملىرىنى ئېچىش
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ئەركىن ئوقۇش ۋە يېزىشقا رۇخسەت قىلىش (سودا تورى مەشغۇلاتى ئۈچۈن)
CREATE POLICY  Public read products ON public.products FOR SELECT USING (true);
CREATE POLICY Public insert/update products ON public.products FOR ALL USING (true);

CREATE POLICY Public read orders ON public.orders FOR SELECT USING (true);
CREATE POLICY Public insert/update orders ON public.orders FOR ALL USING (true);

CREATE POLICY Public read agents ON public.agents FOR SELECT USING (true);
CREATE POLICY Public insert/update agents ON public.agents FOR ALL USING (true);

CREATE POLICY Public read coupons ON public.coupons FOR SELECT USING (true);
CREATE POLICY Public insert/update coupons ON public.coupons FOR ALL USING (true);
