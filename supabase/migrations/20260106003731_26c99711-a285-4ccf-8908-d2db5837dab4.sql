-- Add foreign key relationships for sale_invoices and purchase_invoices to parties table
ALTER TABLE public.sale_invoices
ADD CONSTRAINT sale_invoices_party_id_fkey
FOREIGN KEY (party_id) REFERENCES public.parties(id);

ALTER TABLE public.purchase_invoices
ADD CONSTRAINT purchase_invoices_party_id_fkey
FOREIGN KEY (party_id) REFERENCES public.parties(id);