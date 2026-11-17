-- RLS Policies for SiteSwap
-- Run AFTER schema.sql

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wanted_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_links  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Profiles: public read"       ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: own insert"        ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: own update"        ON profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE POLICY "Listings: public read active"  ON listings FOR SELECT USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "Listings: seller insert"       ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Listings: seller update own"   ON listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Listings: admin delete"        ON listings FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE POLICY "Reservations: buyer or seller read" ON reservations FOR SELECT USING (
  buyer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM listings l WHERE l.id = listing_id AND l.seller_id = auth.uid())
);
CREATE POLICY "Reservations: buyer insert"    ON reservations FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Reservations: parties update"  ON reservations FOR UPDATE USING (
  buyer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM listings l WHERE l.id = listing_id AND l.seller_id = auth.uid())
);

-- ============================================================
-- WANTED REQUESTS
-- ============================================================
CREATE POLICY "Wanted: public read active"  ON wanted_requests FOR SELECT USING (status = 'active' OR buyer_id = auth.uid());
CREATE POLICY "Wanted: buyer insert"        ON wanted_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Wanted: buyer update own"    ON wanted_requests FOR UPDATE USING (auth.uid() = buyer_id);

-- ============================================================
-- IMPACT LOG (public read, server write via service_role)
-- ============================================================
CREATE POLICY "Impact: public read"  ON impact_log FOR SELECT USING (true);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "Notifs: own read"    ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifs: own update"  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- RATINGS
-- ============================================================
CREATE POLICY "Ratings: public read"   ON ratings FOR SELECT USING (true);
CREATE POLICY "Ratings: rater insert"  ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE POLICY "Reports: reporter insert"  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reports: admin read"       ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================================
-- TELEGRAM LINKS
-- ============================================================
CREATE POLICY "Telegram: own read/write"  ON telegram_links FOR ALL USING (auth.uid() = user_id);
