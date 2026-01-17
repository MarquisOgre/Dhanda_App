
-- Drop existing permissive SELECT policies and recreate with user_id restriction

-- ITEMS: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view items" ON public.items;
CREATE POLICY "Users can view own items"
ON public.items FOR SELECT
USING (auth.uid() = user_id);

-- PARTIES: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view parties" ON public.parties;
CREATE POLICY "Users can view own parties"
ON public.parties FOR SELECT
USING (auth.uid() = user_id);

-- SALE_INVOICES: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view sale invoices" ON public.sale_invoices;
CREATE POLICY "Users can view own sale invoices"
ON public.sale_invoices FOR SELECT
USING (auth.uid() = user_id);

-- PURCHASE_INVOICES: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view purchase invoices" ON public.purchase_invoices;
CREATE POLICY "Users can view own purchase invoices"
ON public.purchase_invoices FOR SELECT
USING (auth.uid() = user_id);

-- PAYMENTS: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view payments" ON public.payments;
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (auth.uid() = user_id);

-- EXPENSES: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view expenses" ON public.expenses;
CREATE POLICY "Users can view own expenses"
ON public.expenses FOR SELECT
USING (auth.uid() = user_id);

-- CASH_TRANSACTIONS: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view cash transactions" ON public.cash_transactions;
CREATE POLICY "Users can view own cash transactions"
ON public.cash_transactions FOR SELECT
USING (auth.uid() = user_id);

-- BANK_ACCOUNTS: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can view own bank accounts"
ON public.bank_accounts FOR SELECT
USING (auth.uid() = user_id);

-- CATEGORIES: Fix SELECT policy
DROP POLICY IF EXISTS "All authenticated users can view categories" ON public.categories;
CREATE POLICY "Users can view own categories"
ON public.categories FOR SELECT
USING (auth.uid() = user_id);

-- SALE_INVOICE_ITEMS: Fix SELECT policy (check via parent invoice)
DROP POLICY IF EXISTS "All authenticated users can view sale invoice items" ON public.sale_invoice_items;
CREATE POLICY "Users can view own sale invoice items"
ON public.sale_invoice_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sale_invoices 
    WHERE sale_invoices.id = sale_invoice_items.sale_invoice_id 
    AND sale_invoices.user_id = auth.uid()
  )
);

-- PURCHASE_INVOICE_ITEMS: Fix SELECT policy (check via parent invoice)
DROP POLICY IF EXISTS "All authenticated users can view purchase invoice items" ON public.purchase_invoice_items;
CREATE POLICY "Users can view own purchase invoice items"
ON public.purchase_invoice_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_invoices 
    WHERE purchase_invoices.id = purchase_invoice_items.purchase_invoice_id 
    AND purchase_invoices.user_id = auth.uid()
  )
);
