-- Create sale_invoice_items table
CREATE TABLE public.sale_invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_invoice_id UUID NOT NULL REFERENCES public.sale_invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id),
  item_name TEXT NOT NULL,
  hsn_code TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'PCS',
  rate NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_invoice_items table
CREATE TABLE public.purchase_invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_invoice_id UUID NOT NULL REFERENCES public.purchase_invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id),
  item_name TEXT NOT NULL,
  hsn_code TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'PCS',
  rate NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.sale_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for sale_invoice_items
CREATE POLICY "Admin/Supervisor can manage sale invoice items" 
ON public.sale_invoice_items 
FOR ALL 
USING (can_write(auth.uid()));

CREATE POLICY "All authenticated users can view sale invoice items" 
ON public.sale_invoice_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- RLS policies for purchase_invoice_items
CREATE POLICY "Admin/Supervisor can manage purchase invoice items" 
ON public.purchase_invoice_items 
FOR ALL 
USING (can_write(auth.uid()));

CREATE POLICY "All authenticated users can view purchase invoice items" 
ON public.purchase_invoice_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Migrate existing data from invoice_items to new tables
INSERT INTO public.sale_invoice_items (sale_invoice_id, item_id, item_name, hsn_code, quantity, unit, rate, discount_percent, discount_amount, tax_rate, tax_amount, total, created_at)
SELECT sale_invoice_id, item_id, item_name, hsn_code, quantity, unit, rate, discount_percent, discount_amount, tax_rate, tax_amount, total, created_at
FROM public.invoice_items
WHERE sale_invoice_id IS NOT NULL;

INSERT INTO public.purchase_invoice_items (purchase_invoice_id, item_id, item_name, hsn_code, quantity, unit, rate, discount_percent, discount_amount, tax_rate, tax_amount, total, created_at)
SELECT purchase_invoice_id, item_id, item_name, hsn_code, quantity, unit, rate, discount_percent, discount_amount, tax_rate, tax_amount, total, created_at
FROM public.invoice_items
WHERE purchase_invoice_id IS NOT NULL;

-- Drop the old invoice_items table
DROP TABLE public.invoice_items;