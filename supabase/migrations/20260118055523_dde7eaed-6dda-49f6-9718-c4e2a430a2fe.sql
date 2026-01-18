
-- Create a function to get the admin user_id for data insertion
-- Sub-users should insert data with their admin's user_id
CREATE OR REPLACE FUNCTION public.get_admin_user_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE user_hierarchy AS (
    -- Start with the current user
    SELECT p.user_id, p.parent_user_id
    FROM public.profiles p
    WHERE p.user_id = _user_id
    
    UNION ALL
    
    -- Go up the hierarchy to find the root admin
    SELECT p.user_id, p.parent_user_id
    FROM public.profiles p
    INNER JOIN user_hierarchy uh ON p.user_id = uh.parent_user_id
  )
  -- The root admin is the one with no parent
  SELECT user_id
  FROM user_hierarchy
  WHERE parent_user_id IS NULL
  LIMIT 1;
$$;

-- Also need to fix existing data: move Bharadwaj's data to MarquisOgre's user_id
-- First, let's update items
UPDATE public.items 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update parties
UPDATE public.parties 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update sale_invoices
UPDATE public.sale_invoices 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update purchase_invoices
UPDATE public.purchase_invoices 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update expenses
UPDATE public.expenses 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update payments
UPDATE public.payments 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update categories
UPDATE public.categories 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update cash_transactions
UPDATE public.cash_transactions 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update bank_accounts
UPDATE public.bank_accounts 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Update bank_transactions
UPDATE public.bank_transactions 
SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084'
WHERE user_id = '32e88c96-95cd-4f81-92b0-45dce6fd7f01';

-- Also update Bhupesh Kumar's data (another child of MarquisOgre)
UPDATE public.items SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.parties SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.sale_invoices SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.purchase_invoices SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.expenses SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.payments SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.categories SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.cash_transactions SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.bank_accounts SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
UPDATE public.bank_transactions SET user_id = '8b5bb7bc-7dae-435a-8573-afcc2d7b7084' WHERE user_id = 'dae96573-711a-4b68-a971-855be72b006e';
