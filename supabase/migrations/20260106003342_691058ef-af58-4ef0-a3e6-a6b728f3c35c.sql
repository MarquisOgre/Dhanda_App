-- Update RLS policies for shared visibility across all users

-- 1. EXPENSES - Allow all authenticated users to view all expenses
DROP POLICY IF EXISTS "Users can view expenses" ON public.expenses;
CREATE POLICY "All authenticated users can view expenses" 
  ON public.expenses FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can insert expenses" ON public.expenses;
CREATE POLICY "Admin/Supervisor can insert expenses" 
  ON public.expenses FOR INSERT 
  WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update expenses" ON public.expenses;
CREATE POLICY "Admin/Supervisor can update expenses" 
  ON public.expenses FOR UPDATE 
  USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete expenses" ON public.expenses;
CREATE POLICY "Admin can delete expenses" 
  ON public.expenses FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));

-- 2. INVOICES (Sale Invoices & Purchase Invoices) - Allow all authenticated users to view
DROP POLICY IF EXISTS "Users can view invoices" ON public.invoices;
CREATE POLICY "All authenticated users can view invoices" 
  ON public.invoices FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can insert invoices" ON public.invoices;
CREATE POLICY "Admin/Supervisor can insert invoices" 
  ON public.invoices FOR INSERT 
  WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update invoices" ON public.invoices;
CREATE POLICY "Admin/Supervisor can update invoices" 
  ON public.invoices FOR UPDATE 
  USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete invoices" ON public.invoices;
CREATE POLICY "Admin can delete invoices" 
  ON public.invoices FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));

-- 3. PAYMENTS - Allow all authenticated users to view all payments
DROP POLICY IF EXISTS "Users can view payments" ON public.payments;
CREATE POLICY "All authenticated users can view payments" 
  ON public.payments FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can insert payments" ON public.payments;
CREATE POLICY "Admin/Supervisor can insert payments" 
  ON public.payments FOR INSERT 
  WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update payments" ON public.payments;
CREATE POLICY "Admin/Supervisor can update payments" 
  ON public.payments FOR UPDATE 
  USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete payments" ON public.payments;
CREATE POLICY "Admin can delete payments" 
  ON public.payments FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));

-- 4. BANK_ACCOUNTS - Allow all authenticated users to view all bank accounts
DROP POLICY IF EXISTS "Users can view bank accounts" ON public.bank_accounts;
CREATE POLICY "All authenticated users can view bank accounts" 
  ON public.bank_accounts FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can manage bank accounts" ON public.bank_accounts;
CREATE POLICY "Admin/Supervisor can manage bank accounts" 
  ON public.bank_accounts FOR ALL 
  USING (can_write(auth.uid()));

-- 5. CASH_TRANSACTIONS - Allow all authenticated users to view all cash transactions
DROP POLICY IF EXISTS "Users can view cash transactions" ON public.cash_transactions;
CREATE POLICY "All authenticated users can view cash transactions" 
  ON public.cash_transactions FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can manage cash transactions" ON public.cash_transactions;
CREATE POLICY "Admin/Supervisor can manage cash transactions" 
  ON public.cash_transactions FOR ALL 
  USING (can_write(auth.uid()));

-- 6. INVOICE_ITEMS - Allow all authenticated users to view all invoice items
DROP POLICY IF EXISTS "Users can view invoice items" ON public.invoice_items;
CREATE POLICY "All authenticated users can view invoice items" 
  ON public.invoice_items FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can manage invoice items" ON public.invoice_items;
CREATE POLICY "Admin/Supervisor can manage invoice items" 
  ON public.invoice_items FOR ALL 
  USING (can_write(auth.uid()));

-- 7. CATEGORIES - Allow all authenticated users to view all categories
DROP POLICY IF EXISTS "Users can view categories" ON public.categories;
CREATE POLICY "All authenticated users can view categories" 
  ON public.categories FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin/Supervisor can insert categories" ON public.categories;
CREATE POLICY "Admin/Supervisor can insert categories" 
  ON public.categories FOR INSERT 
  WITH CHECK (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin/Supervisor can update categories" ON public.categories;
CREATE POLICY "Admin/Supervisor can update categories" 
  ON public.categories FOR UPDATE 
  USING (can_write(auth.uid()));

DROP POLICY IF EXISTS "Admin can delete categories" ON public.categories;
CREATE POLICY "Admin can delete categories" 
  ON public.categories FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));