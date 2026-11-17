-- SiteSwap: Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- MATERIALS catalog
-- ============================================================
CREATE TABLE IF NOT EXISTS materials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text UNIQUE NOT NULL,
  name_en       text NOT NULL,
  name_ta       text NOT NULL,
  unit          text NOT NULL,         -- 'nos', 'kg', 'bags', 'sqft', 'cft'
  kg_per_unit   numeric(10,4) NOT NULL,
  co2_per_kg    numeric(10,4) NOT NULL, -- embodied carbon kg CO2e per kg
  new_price_ref numeric(10,2) NOT NULL, -- current market reference price per unit (INR)
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text,
  phone      text,
  role       text DEFAULT 'both' CHECK (role IN ('seller','buyer','both','admin')),
  lang       text DEFAULT 'en' CHECK (lang IN ('en','ta')),
  area_text  text,
  location   geography(Point, 4326),
  is_admin   boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS listings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  material_id      uuid NOT NULL REFERENCES materials(id),
  qty_total        numeric(10,2) NOT NULL CHECK (qty_total > 0),
  qty_available    numeric(10,2) NOT NULL CHECK (qty_available >= 0),
  unit             text NOT NULL,
  qty_ai_estimate  numeric(10,2),
  ai_confidence    numeric(3,2),        -- 0.00 to 1.00
  condition        text NOT NULL CHECK (condition IN ('unused','good','fair','damaged')),
  original_price   numeric(10,2) NOT NULL CHECK (original_price > 0),
  ask_price        numeric(10,2) NOT NULL CHECK (ask_price > 0),
  negotiable       boolean DEFAULT false,
  photos           text[] DEFAULT '{}', -- Supabase Storage paths
  location         geography(Point, 4326) NOT NULL,
  area_text        text,
  pickup_type      text DEFAULT 'self' CHECK (pickup_type IN ('self','seller_delivers')),
  available_until  date,
  status           text DEFAULT 'active' CHECK (status IN ('draft','active','reserved','sold','expired','removed')),
  is_demo          boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listings_location_idx ON listings USING GIST (location);
CREATE INDEX IF NOT EXISTS listings_status_material_idx ON listings (status, material_id, created_at DESC);

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id          uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id            uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qty                 numeric(10,2) NOT NULL CHECK (qty > 0),
  status              text DEFAULT 'pending' CHECK (status IN ('pending','accepted','completed','declined','expired','cancelled')),
  expires_at          timestamptz DEFAULT (now() + interval '24 hours'),
  contact_revealed_at timestamptz,
  created_at          timestamptz DEFAULT now(),
  completed_at        timestamptz
);

-- ============================================================
-- WANTED REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS wanted_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id),
  qty         numeric(10,2) NOT NULL CHECK (qty > 0),
  max_price   numeric(10,2),
  radius_km   int DEFAULT 10 CHECK (radius_km IN (5,10,25)),
  location    geography(Point, 4326) NOT NULL,
  status      text DEFAULT 'active' CHECK (status IN ('active','matched','closed')),
  expires_at  timestamptz DEFAULT (now() + interval '30 days'),
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- IMPACT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS impact_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  uuid NOT NULL REFERENCES reservations(id),
  material_id     uuid NOT NULL REFERENCES materials(id),
  qty             numeric(10,2) NOT NULL,
  kg_diverted     numeric(12,4) NOT NULL,
  co2_avoided_kg  numeric(12,4) NOT NULL,
  money_saved     numeric(12,2) NOT NULL,
  is_demo         boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- RATINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS ratings (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id),
  rater_id       uuid NOT NULL REFERENCES profiles(id),
  rated_id       uuid NOT NULL REFERENCES profiles(id),
  score          int NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment        text,
  created_at     timestamptz DEFAULT now()
);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id),
  reporter_id uuid NOT NULL REFERENCES profiles(id),
  reason     text NOT NULL,
  status     text DEFAULT 'pending' CHECK (status IN ('pending','resolved','dismissed')),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       text NOT NULL,
  title      text NOT NULL,
  body       text,
  data       jsonb DEFAULT '{}',
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- TELEGRAM LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS telegram_links (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  chat_id    bigint NOT NULL,
  linked_at  timestamptz DEFAULT now()
);

-- ============================================================
-- SEED: Materials catalog
-- ============================================================
INSERT INTO materials (key, name_en, name_ta, unit, kg_per_unit, co2_per_kg, new_price_ref) VALUES
  ('red_clay_brick',   'Red Clay Brick',      'சிவப்பு செங்கல்',      'nos',  2.85,  0.22,  7.00),
  ('fly_ash_brick',    'Fly Ash Brick',        'ஃபிளை ஆஷ் செங்கல்',   'nos',  2.60,  0.08,  6.00),
  ('solid_block',      'Solid Concrete Block', 'திட கான்கிரீட் பிளாக்','nos', 17.00,  0.14, 55.00),
  ('cement_bag',       'Cement Bag (50kg)',     'சிமென்ட் பை',          'bags',50.00,  0.82,420.00),
  ('tmt_steel',        'TMT Steel Bar',        'TMT எஃகு கம்பி',        'kg',   1.00,  1.46, 65.00),
  ('m_sand',           'M-Sand',               'M-மணல்',               'cft',  46.00,  0.005,35.00),
  ('blue_metal',       'Blue Metal / Jelly',   'நீல கல் / ஜெல்லி',    'cft',  44.00,  0.04, 40.00),
  ('river_sand',       'River Sand',           'ஆற்று மணல்',           'cft',  44.00,  0.01, 55.00),
  ('floor_tile',       'Floor Tile',           'தரை ஓடு',              'sqft',  2.20,  0.65, 45.00),
  ('tile_adhesive',    'Tile Adhesive Bag',    'ஓடு அட்மிக்ஸ் பை',    'bags', 20.00,  0.40,220.00),
  ('pvc_pipe',         'PVC Pipe (6ft)',        'PVC குழாய்',           'nos',   0.50,  2.50, 80.00),
  ('paint_bucket',     'Paint Bucket (10L)',    'பெயிண்ட் பக்கெட்',    'nos',  12.00,  2.90,850.00),
  ('wooden_plank',     'Wooden Plank',         'மர பலகை',              'nos',   8.00,  0.42,250.00)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- RPC: Get nearby listings (radius search)
-- ============================================================
CREATE OR REPLACE FUNCTION nearby_listings(
  lat          float8,
  lng          float8,
  radius_km    int DEFAULT 10,
  material_key text DEFAULT NULL,
  lim          int DEFAULT 20,
  off          int DEFAULT 0
)
RETURNS TABLE (
  id uuid, seller_id uuid, material_id uuid, qty_available numeric,
  unit text, condition text, ask_price numeric, original_price numeric,
  negotiable boolean, photos text[], area_text text, status text,
  is_demo boolean, created_at timestamptz,
  distance_m float8,
  material_key_out text, material_name_en text, material_name_ta text
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    l.id, l.seller_id, l.material_id, l.qty_available,
    l.unit, l.condition, l.ask_price, l.original_price,
    l.negotiable, l.photos, l.area_text, l.status,
    l.is_demo, l.created_at,
    ST_Distance(l.location::geography, ST_MakePoint(lng, lat)::geography) AS distance_m,
    m.key, m.name_en, m.name_ta
  FROM listings l
  JOIN materials m ON m.id = l.material_id
  WHERE l.status = 'active'
    AND ST_DWithin(l.location::geography, ST_MakePoint(lng, lat)::geography, radius_km * 1000)
    AND (material_key IS NULL OR m.key = material_key)
  ORDER BY distance_m ASC
  LIMIT lim OFFSET off;
$$;

-- ============================================================
-- RPC: Reveal contact (phone) — only for accepted reservations
-- ============================================================
CREATE OR REPLACE FUNCTION get_contact(res_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_phone text;
  v_buyer uuid;
  v_seller uuid;
BEGIN
  SELECT r.buyer_id, l.seller_id
  INTO v_buyer, v_seller
  FROM reservations r
  JOIN listings l ON l.id = r.listing_id
  WHERE r.id = res_id AND r.status = 'accepted';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found or not accepted';
  END IF;

  IF auth.uid() NOT IN (v_buyer, v_seller) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT phone INTO v_phone FROM profiles
  WHERE id = CASE WHEN auth.uid() = v_buyer THEN v_seller ELSE v_buyer END;

  -- Mark contact as revealed
  UPDATE reservations SET contact_revealed_at = now() WHERE id = res_id AND contact_revealed_at IS NULL;

  RETURN v_phone;
END;
$$;

-- ============================================================
-- RPC: Impact dashboard aggregates
-- ============================================================
CREATE OR REPLACE FUNCTION impact_summary(include_demo boolean DEFAULT false)
RETURNS json
LANGUAGE sql STABLE AS $$
  SELECT json_build_object(
    'kg_diverted',    COALESCE(SUM(CASE WHEN (is_demo = false OR include_demo) THEN kg_diverted END), 0),
    'co2_avoided_kg', COALESCE(SUM(CASE WHEN (is_demo = false OR include_demo) THEN co2_avoided_kg END), 0),
    'money_saved',    COALESCE(SUM(CASE WHEN (is_demo = false OR include_demo) THEN money_saved END), 0),
    'deals_count',    COUNT(CASE WHEN (is_demo = false OR include_demo) THEN 1 END)
  )
  FROM impact_log;
$$;
