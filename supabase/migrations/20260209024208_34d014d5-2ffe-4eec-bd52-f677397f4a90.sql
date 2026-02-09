
-- Remove overly permissive policy - edge functions use service role which bypasses RLS
DROP POLICY IF EXISTS "Service can insert logs" ON public.query_logs;
