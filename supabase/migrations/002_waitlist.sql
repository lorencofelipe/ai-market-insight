-- Waitlist table for landing page email capture
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  source text DEFAULT 'landing_page',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Authenticated users can read" ON public.waitlist;

-- Allow anonymous inserts (public landing page, no auth required)
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can read (for admin dashboard later)
CREATE POLICY "Authenticated users can read" ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for fast duplicate checks
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Ensure permissions are explicitly set for the API
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.waitlist TO anon, authenticated, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Force API to reload schema cache
NOTIFY pgrst, 'reload schema';
