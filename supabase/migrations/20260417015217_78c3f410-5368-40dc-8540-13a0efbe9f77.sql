CREATE TABLE public.extension_login_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_extension_login_codes_code ON public.extension_login_codes(code);
CREATE INDEX idx_extension_login_codes_user ON public.extension_login_codes(user_id);

ALTER TABLE public.extension_login_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own login codes"
  ON public.extension_login_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own login codes"
  ON public.extension_login_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
