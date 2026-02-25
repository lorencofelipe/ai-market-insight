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
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
