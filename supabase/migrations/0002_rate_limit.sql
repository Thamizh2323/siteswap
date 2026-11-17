-- SiteSwap Migration 0002: Rate Limiting
-- Called from src/server/rate-limit.ts via service_role

CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count int NOT NULL DEFAULT 0
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY; -- no policies: no client access

CREATE OR REPLACE FUNCTION check_rate_limit(p_key text, p_limit int, p_window_seconds int)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v rate_limits;
BEGIN
  INSERT INTO rate_limits (key, window_start, count) VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                        THEN now() ELSE rate_limits.window_start END,
    count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
                 THEN 1 ELSE rate_limits.count + 1 END
  RETURNING * INTO v;
  RETURN v.count <= p_limit;
END $$;

-- Only the server (service_role) may call it, so users cannot burn each other's limits
REVOKE EXECUTE ON FUNCTION check_rate_limit(text, int, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(text, int, int) TO service_role;
