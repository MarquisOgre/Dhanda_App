-- Add parent_user_id column to profiles to track which admin created the user
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add parent_user_id column to user_roles as well
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_parent_user_id ON public.profiles(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_parent_user_id ON public.user_roles(parent_user_id);

-- Create a function to get family members (admin + their created users)
CREATE OR REPLACE FUNCTION public.get_family_user_ids(_user_id uuid)
RETURNS TABLE(family_user_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Get the admin (parent) of this user, or the user themselves if they are admin
  WITH user_parent AS (
    SELECT 
      COALESCE(p.parent_user_id, _user_id) as admin_id
    FROM public.profiles p
    WHERE p.user_id = _user_id
  )
  -- Return all users in this family (admin + their children)
  SELECT p.user_id as family_user_id
  FROM public.profiles p
  CROSS JOIN user_parent up
  WHERE 
    -- Include the admin themselves
    p.user_id = up.admin_id
    -- Or any user created by this admin
    OR p.parent_user_id = up.admin_id
    -- Or if the current user is the one checking
    OR p.user_id = _user_id;
$$;

-- Update license_settings defaults for new admins (max_users = 2, max_simultaneous_logins = 10)
-- First update existing records that have default values
UPDATE public.license_settings
SET max_users = 2, max_simultaneous_logins = 10
WHERE max_users = 5 AND max_simultaneous_logins = 3;

-- Alter default values for new records
ALTER TABLE public.license_settings 
ALTER COLUMN max_users SET DEFAULT 2,
ALTER COLUMN max_simultaneous_logins SET DEFAULT 10;

-- Drop old SELECT policies and create new ones that support family data sharing

-- ITEMS: Family data sharing
DROP POLICY IF EXISTS "Users can view own items" ON public.items;
CREATE POLICY "Users can view family items"
ON public.items FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- PARTIES: Family data sharing
DROP POLICY IF EXISTS "Users can view own parties" ON public.parties;
CREATE POLICY "Users can view family parties"
ON public.parties FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- SALE_INVOICES: Family data sharing
DROP POLICY IF EXISTS "Users can view own sale invoices" ON public.sale_invoices;
CREATE POLICY "Users can view family sale invoices"
ON public.sale_invoices FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- PURCHASE_INVOICES: Family data sharing
DROP POLICY IF EXISTS "Users can view own purchase invoices" ON public.purchase_invoices;
CREATE POLICY "Users can view family purchase invoices"
ON public.purchase_invoices FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- PAYMENTS: Family data sharing
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view family payments"
ON public.payments FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- EXPENSES: Family data sharing
DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
CREATE POLICY "Users can view family expenses"
ON public.expenses FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- CASH_TRANSACTIONS: Family data sharing
DROP POLICY IF EXISTS "Users can view own cash transactions" ON public.cash_transactions;
CREATE POLICY "Users can view family cash transactions"
ON public.cash_transactions FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- BANK_ACCOUNTS: Family data sharing
DROP POLICY IF EXISTS "Users can view own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can view family bank accounts"
ON public.bank_accounts FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- CATEGORIES: Family data sharing
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
CREATE POLICY "Users can view family categories"
ON public.categories FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- SALE_INVOICE_ITEMS: Family data sharing (via parent invoice)
DROP POLICY IF EXISTS "Users can view own sale invoice items" ON public.sale_invoice_items;
CREATE POLICY "Users can view family sale invoice items"
ON public.sale_invoice_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sale_invoices 
    WHERE sale_invoices.id = sale_invoice_items.sale_invoice_id 
    AND sale_invoices.user_id IN (SELECT get_family_user_ids(auth.uid()))
  )
);

-- PURCHASE_INVOICE_ITEMS: Family data sharing (via parent invoice)
DROP POLICY IF EXISTS "Users can view own purchase invoice items" ON public.purchase_invoice_items;
CREATE POLICY "Users can view family purchase invoice items"
ON public.purchase_invoice_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_invoices 
    WHERE purchase_invoices.id = purchase_invoice_items.purchase_invoice_id 
    AND purchase_invoices.user_id IN (SELECT get_family_user_ids(auth.uid()))
  )
);

-- BUSINESS_SETTINGS: Family data sharing
DROP POLICY IF EXISTS "Users can view own business settings" ON public.business_settings;
CREATE POLICY "Users can view family business settings"
ON public.business_settings FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- Update handle_new_user function to set parent_user_id when user is created by admin
-- Note: The parent_user_id will be set by the application code after signup