-- Add TCS amount columns to sale_invoices and purchase_invoices
ALTER TABLE public.sale_invoices ADD COLUMN IF NOT EXISTS tcs_amount numeric DEFAULT 0;
ALTER TABLE public.purchase_invoices ADD COLUMN IF NOT EXISTS tcs_amount numeric DEFAULT 0;

-- Add license user limits to license_settings
ALTER TABLE public.license_settings ADD COLUMN IF NOT EXISTS max_users integer DEFAULT 5;
ALTER TABLE public.license_settings ADD COLUMN IF NOT EXISTS max_simultaneous_logins integer DEFAULT 3;