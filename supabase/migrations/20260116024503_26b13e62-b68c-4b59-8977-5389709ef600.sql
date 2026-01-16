-- Add new tax receivable/payable columns to business_settings
ALTER TABLE public.business_settings
  ADD COLUMN IF NOT EXISTS gst_receivable numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gst_payable numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tcs_receivable numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tcs_payable numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tds_receivable numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tds_payable numeric DEFAULT 0;

-- Drop old tax columns that are no longer needed
ALTER TABLE public.business_settings
  DROP COLUMN IF EXISTS default_tax_rate,
  DROP COLUMN IF EXISTS enable_tcs,
  DROP COLUMN IF EXISTS enable_tds,
  DROP COLUMN IF EXISTS tcs_percent,
  DROP COLUMN IF EXISTS tds_percent;