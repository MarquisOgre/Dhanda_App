-- 1) Add new FK columns to invoice_items and payments
ALTER TABLE public.invoice_items
  ADD COLUMN IF NOT EXISTS sale_invoice_id uuid,
  ADD COLUMN IF NOT EXISTS purchase_invoice_id uuid;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS sale_invoice_id uuid,
  ADD COLUMN IF NOT EXISTS purchase_invoice_id uuid;

-- 2) Ensure all legacy invoices are present in the new tables (idempotent)
INSERT INTO public.sale_invoices (
  user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
)
SELECT
  i.user_id, i.party_id, i.invoice_number, i.invoice_type, i.invoice_date, i.due_date,
  i.subtotal, i.tax_amount, i.discount_amount, i.total_amount, i.paid_amount, i.balance_due,
  i.status, i.notes, i.terms, i.is_deleted, i.deleted_at, i.created_at, i.updated_at
FROM public.invoices i
WHERE i.invoice_type IN ('sale','sale_invoice','sale_return','sale_order','estimation','proforma','delivery_challan')
  AND NOT EXISTS (
    SELECT 1 FROM public.sale_invoices si
    WHERE si.user_id = i.user_id AND si.invoice_number = i.invoice_number
  );

INSERT INTO public.purchase_invoices (
  user_id, party_id, invoice_number, invoice_type, invoice_date, due_date,
  subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due,
  status, notes, terms, is_deleted, deleted_at, created_at, updated_at
)
SELECT
  i.user_id, i.party_id, i.invoice_number, i.invoice_type, i.invoice_date, i.due_date,
  i.subtotal, i.tax_amount, i.discount_amount, i.total_amount, i.paid_amount, i.balance_due,
  i.status, i.notes, i.terms, i.is_deleted, i.deleted_at, i.created_at, i.updated_at
FROM public.invoices i
WHERE i.invoice_type IN ('purchase','purchase_invoice','purchase_bill','purchase_return','purchase_order')
  AND NOT EXISTS (
    SELECT 1 FROM public.purchase_invoices pi
    WHERE pi.user_id = i.user_id AND pi.invoice_number = i.invoice_number
  );

-- 3) Migrate invoice_items links from legacy invoices.id to new invoice ids
UPDATE public.invoice_items ii
SET sale_invoice_id = si.id
FROM public.invoices i
JOIN public.sale_invoices si
  ON si.user_id = i.user_id AND si.invoice_number = i.invoice_number
WHERE ii.invoice_id = i.id
  AND i.invoice_type IN ('sale','sale_invoice','sale_return','sale_order','estimation','proforma','delivery_challan')
  AND ii.sale_invoice_id IS NULL;

UPDATE public.invoice_items ii
SET purchase_invoice_id = pi.id
FROM public.invoices i
JOIN public.purchase_invoices pi
  ON pi.user_id = i.user_id AND pi.invoice_number = i.invoice_number
WHERE ii.invoice_id = i.id
  AND i.invoice_type IN ('purchase','purchase_invoice','purchase_bill','purchase_return','purchase_order')
  AND ii.purchase_invoice_id IS NULL;

-- 4) Migrate payments links from legacy invoices.id to new invoice ids
UPDATE public.payments p
SET sale_invoice_id = si.id
FROM public.invoices i
JOIN public.sale_invoices si
  ON si.user_id = i.user_id AND si.invoice_number = i.invoice_number
WHERE p.invoice_id = i.id
  AND i.invoice_type IN ('sale','sale_invoice','sale_return','sale_order','estimation','proforma','delivery_challan')
  AND p.sale_invoice_id IS NULL;

UPDATE public.payments p
SET purchase_invoice_id = pi.id
FROM public.invoices i
JOIN public.purchase_invoices pi
  ON pi.user_id = i.user_id AND pi.invoice_number = i.invoice_number
WHERE p.invoice_id = i.id
  AND i.invoice_type IN ('purchase','purchase_invoice','purchase_bill','purchase_return','purchase_order')
  AND p.purchase_invoice_id IS NULL;

-- 5) Drop old FK constraints and invoice_id columns now that references are migrated
ALTER TABLE public.invoice_items
  DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey;

ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_invoice_id_fkey;

ALTER TABLE public.invoice_items
  DROP COLUMN IF EXISTS invoice_id;

ALTER TABLE public.payments
  DROP COLUMN IF EXISTS invoice_id;

-- 6) Add new FK constraints
ALTER TABLE public.invoice_items
  ADD CONSTRAINT invoice_items_sale_invoice_id_fkey
  FOREIGN KEY (sale_invoice_id) REFERENCES public.sale_invoices(id)
  ON DELETE CASCADE;

ALTER TABLE public.invoice_items
  ADD CONSTRAINT invoice_items_purchase_invoice_id_fkey
  FOREIGN KEY (purchase_invoice_id) REFERENCES public.purchase_invoices(id)
  ON DELETE CASCADE;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_sale_invoice_id_fkey
  FOREIGN KEY (sale_invoice_id) REFERENCES public.sale_invoices(id)
  ON DELETE SET NULL;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_purchase_invoice_id_fkey
  FOREIGN KEY (purchase_invoice_id) REFERENCES public.purchase_invoices(id)
  ON DELETE SET NULL;

-- 7) Finally drop the legacy invoices table
DROP TABLE IF EXISTS public.invoices;