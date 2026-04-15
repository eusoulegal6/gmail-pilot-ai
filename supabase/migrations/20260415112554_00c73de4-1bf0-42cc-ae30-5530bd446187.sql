-- Create extension_settings table
CREATE TABLE public.extension_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  identity TEXT,
  reply_style TEXT,
  knowledge TEXT,
  signature TEXT,
  reply_decision_mode TEXT DEFAULT 'review',
  reply_decision_instructions TEXT,
  attention_rules_enabled BOOLEAN DEFAULT false,
  attention_rules JSONB DEFAULT '[]'::jsonb,
  allowed_senders TEXT[] DEFAULT '{}',
  ignored_senders TEXT[] DEFAULT '{}',
  ignored_subjects TEXT[] DEFAULT '{}',
  skip_replied_threads BOOLEAN DEFAULT true,
  skip_no_reply_senders BOOLEAN DEFAULT true,
  auto_send_first_contact_only BOOLEAN DEFAULT false,
  default_cc TEXT[] DEFAULT '{}',
  default_bcc TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.extension_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own settings"
ON public.extension_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.extension_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.extension_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
ON public.extension_settings FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_extension_settings_updated_at
BEFORE UPDATE ON public.extension_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create settings row on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.extension_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_settings
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_settings();