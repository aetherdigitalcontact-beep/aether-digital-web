-- Add 2FA fields to accounts table
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS totp_secret TEXT,
ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT false;
