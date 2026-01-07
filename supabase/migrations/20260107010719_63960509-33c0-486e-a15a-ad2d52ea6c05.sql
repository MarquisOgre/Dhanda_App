-- Add TCS and TDS percentage columns to business_settings
ALTER TABLE public.business_settings
ADD COLUMN IF NOT EXISTS tcs_percent numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS tds_percent numeric DEFAULT 0;