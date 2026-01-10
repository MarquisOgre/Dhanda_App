-- Add TCS and TDS columns to items table
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS tcs_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS tds_rate numeric DEFAULT 0;

-- Create license_plans table for editable plans
CREATE TABLE IF NOT EXISTS public.license_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  duration_days integer NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.license_plans ENABLE ROW LEVEL SECURITY;

-- Create policies - anyone can view plans, admins can manage
CREATE POLICY "Anyone can view license plans" 
ON public.license_plans 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage license plans" 
ON public.license_plans 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default plans
INSERT INTO public.license_plans (plan_name, duration_days, price, description, sort_order) VALUES
('Free Trial', 30, 0, '30 days free trial with all features', 1),
('Silver', 30, 1200, '1 Month - 30 Days access', 2),
('Gold', 90, 6300, '3 Months - 90 Days access', 3),
('Platinum', 365, 10000, '1 Year - 365 Days access', 4)
ON CONFLICT DO NOTHING;