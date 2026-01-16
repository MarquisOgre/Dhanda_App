-- Drop tax-related columns from items table
ALTER TABLE public.items 
DROP COLUMN IF EXISTS tax_rate,
DROP COLUMN IF EXISTS tcs_rate,
DROP COLUMN IF EXISTS tds_rate;

-- Ensure purchase_price and sale_price exist with correct defaults
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'items' AND column_name = 'purchase_price') THEN
        ALTER TABLE public.items ADD COLUMN purchase_price numeric(15,2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'items' AND column_name = 'sale_price') THEN
        ALTER TABLE public.items ADD COLUMN sale_price numeric(15,2) DEFAULT 0;
    END IF;
END $$;

-- Update unit default to 'Bottles'
ALTER TABLE public.items ALTER COLUMN unit SET DEFAULT 'Bottles';