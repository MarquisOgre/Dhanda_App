-- Create sale_invoices table
CREATE TABLE public.sale_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  party_id UUID,
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL DEFAULT 'sale_invoice',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance_due NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  notes TEXT,
  terms TEXT,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_invoices table
CREATE TABLE public.purchase_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  party_id UUID,
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL DEFAULT 'purchase_invoice',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance_due NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  notes TEXT,
  terms TEXT,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.sale_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sale_invoices - SHARED VISIBILITY
CREATE POLICY "All authenticated users can view sale invoices"
  ON public.sale_invoices FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin/Supervisor can insert sale invoices"
  ON public.sale_invoices FOR INSERT
  WITH CHECK (can_write(auth.uid()));

CREATE POLICY "Admin/Supervisor can update sale invoices"
  ON public.sale_invoices FOR UPDATE
  USING (can_write(auth.uid()));

CREATE POLICY "Admin can delete sale invoices"
  ON public.sale_invoices FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for purchase_invoices - SHARED VISIBILITY
CREATE POLICY "All authenticated users can view purchase invoices"
  ON public.purchase_invoices FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin/Supervisor can insert purchase invoices"
  ON public.purchase_invoices FOR INSERT
  WITH CHECK (can_write(auth.uid()));

CREATE POLICY "Admin/Supervisor can update purchase invoices"
  ON public.purchase_invoices FOR UPDATE
  USING (can_write(auth.uid()));

CREATE POLICY "Admin can delete purchase invoices"
  ON public.purchase_invoices FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_sale_invoices_updated_at
  BEFORE UPDATE ON public.sale_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_invoices_updated_at
  BEFORE UPDATE ON public.purchase_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data from invoices table
INSERT INTO public.sale_invoices (
  id, user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
)
SELECT 
  id, user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
FROM public.invoices
WHERE invoice_type IN ('sale', 'sale_invoice', 'sale_return', 'sale_order', 'estimation', 'proforma', 'delivery_challan');

INSERT INTO public.purchase_invoices (
  id, user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
)
SELECT 
  id, user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
FROM public.invoices
WHERE invoice_type IN ('purchase', 'purchase_bill', 'purchase_invoice', 'purchase_return', 'purchase_order');