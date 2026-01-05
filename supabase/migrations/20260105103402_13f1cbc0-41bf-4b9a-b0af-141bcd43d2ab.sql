-- Add new columns to business_settings for invoice and tax settings
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS next_invoice_number integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS estimation_prefix text DEFAULT 'EST-',
ADD COLUMN IF NOT EXISTS purchase_prefix text DEFAULT 'PUR-',
ADD COLUMN IF NOT EXISTS default_payment_terms integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS gst_registration_type text DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS state_code text DEFAULT 'karnataka',
ADD COLUMN IF NOT EXISTS default_tax_rate numeric DEFAULT 18,
ADD COLUMN IF NOT EXISTS enable_tcs boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS enable_tds boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS paper_size text DEFAULT 'a4',
ADD COLUMN IF NOT EXISTS invoice_template text DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS show_logo_on_invoice boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_bank_details boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_qr_code boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_print_on_save boolean DEFAULT false;