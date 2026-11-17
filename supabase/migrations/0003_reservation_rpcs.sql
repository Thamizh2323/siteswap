-- Migration 0003: Core Reservation & Impact Mutation RPCs
-- Enforces: No direct quantity or status updates from client.
-- Row locks prevent double-booking; phone reveals only after accept.

-- RPC: RESERVE LISTING -----------------------------------------------
CREATE OR REPLACE FUNCTION reserve_listing(p_listing uuid, p_qty numeric)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_l listings;
  v_id uuid;
  v_open int;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT count(*) INTO v_open FROM reservations
  WHERE buyer_id = auth.uid() AND status = 'pending';

  IF v_open >= 5 THEN
    RAISE EXCEPTION 'too many pending reservations';
  END IF;

  SELECT * INTO v_l FROM listings WHERE id = p_listing FOR UPDATE;
  IF NOT FOUND OR v_l.status <> 'active' THEN
    RAISE EXCEPTION 'listing unavailable';
  END IF;

  IF v_l.seller_id = auth.uid() THEN
    RAISE EXCEPTION 'cannot reserve own listing';
  END IF;

  IF p_qty <= 0 OR p_qty > v_l.qty_available THEN
    RAISE EXCEPTION 'invalid quantity';
  END IF;

  UPDATE listings
     SET qty_available = qty_available - p_qty,
         status = CASE WHEN qty_available - p_qty = 0 THEN 'reserved' ELSE status END
   WHERE id = p_listing;

  INSERT INTO reservations (listing_id, buyer_id, qty)
  VALUES (p_listing, auth.uid(), p_qty)
  RETURNING id INTO v_id;

  RETURN v_id;
END $$;

-- RPC: RESPOND RESERVATION (Seller Accept / Decline) ------------------
CREATE OR REPLACE FUNCTION respond_reservation(p_res uuid, p_accept boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_r reservations;
  v_l listings;
BEGIN
  SELECT * INTO v_r FROM reservations WHERE id = p_res FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;

  SELECT * INTO v_l FROM listings WHERE id = v_r.listing_id FOR UPDATE;
  IF v_l.seller_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF v_r.status <> 'pending' THEN
    RAISE EXCEPTION 'not pending';
  END IF;

  IF p_accept THEN
    UPDATE reservations
       SET status = 'accepted', contact_revealed_at = now()
     WHERE id = p_res;
  ELSE
    UPDATE reservations
       SET status = 'declined'
     WHERE id = p_res;

    UPDATE listings
       SET qty_available = qty_available + v_r.qty, status = 'active'
     WHERE id = v_l.id AND status IN ('active', 'reserved');
  END IF;
END $$;

-- RPC: REVEAL CONTACT (Phone only after accept or completion) ---------
CREATE OR REPLACE FUNCTION get_contact(p_res uuid)
RETURNS TABLE (name text, phone text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_r reservations;
  v_seller uuid;
BEGIN
  SELECT * INTO v_r FROM reservations WHERE id = p_res;
  IF NOT FOUND OR v_r.status NOT IN ('accepted', 'completed') THEN
    RAISE EXCEPTION 'not available';
  END IF;

  SELECT seller_id INTO v_seller FROM listings WHERE id = v_r.listing_id;
  IF auth.uid() = v_r.buyer_id THEN
    RETURN QUERY SELECT p.name, p.phone FROM profiles p WHERE p.id = v_seller;
  ELSIF auth.uid() = v_seller THEN
    RETURN QUERY SELECT p.name, p.phone FROM profiles p WHERE p.id = v_r.buyer_id;
  ELSE
    RAISE EXCEPTION 'forbidden';
  END IF;
END $$;

-- RPC: COMPLETE RESERVATION (Buyer confirms receipt + logs impact) ----
CREATE OR REPLACE FUNCTION complete_reservation(p_res uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_r reservations;
  v_l listings;
  v_m materials;
BEGIN
  SELECT * INTO v_r FROM reservations WHERE id = p_res FOR UPDATE;
  IF NOT FOUND OR v_r.buyer_id <> auth.uid() OR v_r.status <> 'accepted' THEN
    RAISE EXCEPTION 'invalid';
  END IF;

  SELECT * INTO v_l FROM listings WHERE id = v_r.listing_id FOR UPDATE;
  SELECT * INTO v_m FROM materials WHERE id = v_l.material_id;

  UPDATE reservations
     SET status = 'completed', completed_at = now()
   WHERE id = p_res;

  INSERT INTO impact_log (reservation_id, material_id, qty, kg_diverted, co2_avoided_kg, money_saved, is_demo)
  VALUES (
    p_res,
    v_m.id,
    v_r.qty,
    v_r.qty * v_m.kg_per_unit,
    v_r.qty * v_m.kg_per_unit * v_m.co2_per_kg,
    GREATEST(COALESCE(v_m.new_price_ref, v_l.original_price, v_l.ask_price) - v_l.ask_price, 0) * v_r.qty,
    v_l.is_demo
  );

  IF v_l.qty_available = 0 AND NOT EXISTS (
    SELECT 1 FROM reservations
     WHERE listing_id = v_l.id AND status IN ('pending', 'accepted')
  ) THEN
    UPDATE listings SET status = 'sold' WHERE id = v_l.id;
  END IF;
END $$;

-- RPC: EXPIRE PENDING RESERVATIONS (Called lazily on inbox load) -------
CREATE OR REPLACE FUNCTION expire_reservations()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT * FROM reservations WHERE status = 'pending' AND expires_at < now() FOR UPDATE LOOP
    UPDATE reservations SET status = 'expired' WHERE id = r.id;
    UPDATE listings
       SET qty_available = qty_available + r.qty, status = 'active'
     WHERE id = r.listing_id AND status IN ('active', 'reserved');
  END LOOP;
END $$;

-- RPC: PUBLIC IMPACT TOTALS ------------------------------------------
CREATE OR REPLACE FUNCTION impact_totals(p_include_demo boolean DEFAULT false)
RETURNS TABLE (tonnes numeric, co2_kg numeric, rupees numeric, deals bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(SUM(kg_diverted), 0) / 1000.0,
         COALESCE(SUM(co2_avoided_kg), 0),
         COALESCE(SUM(money_saved), 0),
         COUNT(*)
  FROM impact_log
  WHERE p_include_demo OR NOT is_demo;
$$;
