-- Create bank_transactions table to track bank account transactions
CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('in', 'out')),
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bank_transactions
CREATE POLICY "Admin/Supervisor can manage bank transactions"
ON public.bank_transactions
FOR ALL
USING (can_write(auth.uid()));

CREATE POLICY "Users can view family bank transactions"
ON public.bank_transactions
FOR SELECT
USING (user_id IN (SELECT get_family_user_ids(auth.uid())));

-- Add index for faster queries
CREATE INDEX idx_bank_transactions_bank_account ON public.bank_transactions(bank_account_id);
CREATE INDEX idx_bank_transactions_date ON public.bank_transactions(transaction_date DESC);