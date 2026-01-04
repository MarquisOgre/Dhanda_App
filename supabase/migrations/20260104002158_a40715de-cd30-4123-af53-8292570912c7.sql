-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create parties table
CREATE TABLE public.parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  gstin TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  party_type TEXT DEFAULT 'customer',
  opening_balance DECIMAL(15,2) DEFAULT 0,
  credit_limit DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create items table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hsn_code TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sale_price DECIMAL(15,2) DEFAULT 0,
  purchase_price DECIMAL(15,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  unit TEXT DEFAULT 'PCS',
  opening_stock DECIMAL(15,2) DEFAULT 0,
  current_stock DECIMAL(15,2) DEFAULT 0,
  low_stock_alert DECIMAL(15,2) DEFAULT 10,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table (for all invoice types)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL, -- sale, purchase, sale_return, purchase_return, estimate, proforma, delivery_challan, sale_order, purchase_order
  party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  balance_due DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  notes TEXT,
  terms TEXT,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  hsn_code TEXT,
  quantity DECIMAL(15,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'PCS',
  rate DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_number TEXT NOT NULL,
  payment_type TEXT NOT NULL, -- payment_in, payment_out
  party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_mode TEXT DEFAULT 'cash',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_number TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_mode TEXT DEFAULT 'cash',
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  opening_balance DECIMAL(15,2) DEFAULT 0,
  current_balance DECIMAL(15,2) DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cash_transactions table
CREATE TABLE public.cash_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- cash_in, cash_out
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_settings table
CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_address TEXT,
  phone TEXT,
  email TEXT,
  gstin TEXT,
  pan TEXT,
  logo_url TEXT,
  invoice_prefix TEXT DEFAULT 'INV',
  invoice_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Create function to check if user can write (admin or supervisor)
CREATE OR REPLACE FUNCTION public.can_write(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'supervisor')
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Parties policies (all authenticated users can read, admin/supervisor can write)
CREATE POLICY "Users can view parties" ON public.parties FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert parties" ON public.parties FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update parties" ON public.parties FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete parties" ON public.parties FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Categories policies
CREATE POLICY "Users can view categories" ON public.categories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Items policies
CREATE POLICY "Users can view items" ON public.items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert items" ON public.items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update items" ON public.items FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete items" ON public.items FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Invoices policies
CREATE POLICY "Users can view invoices" ON public.invoices FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update invoices" ON public.invoices FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete invoices" ON public.invoices FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Invoice items policies
CREATE POLICY "Users can view invoice items" ON public.invoice_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid())
);
CREATE POLICY "Admin/Supervisor can manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_items.invoice_id AND user_id = auth.uid() AND public.can_write(auth.uid()))
);

-- Payments policies
CREATE POLICY "Users can view payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update payments" ON public.payments FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete payments" ON public.payments FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Expenses policies
CREATE POLICY "Users can view expenses" ON public.expenses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can insert expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin/Supervisor can update expenses" ON public.expenses FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));
CREATE POLICY "Admin can delete expenses" ON public.expenses FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Bank accounts policies
CREATE POLICY "Users can view bank accounts" ON public.bank_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can manage bank accounts" ON public.bank_accounts FOR ALL TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));

-- Cash transactions policies
CREATE POLICY "Users can view cash transactions" ON public.cash_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin/Supervisor can manage cash transactions" ON public.cash_transactions FOR ALL TO authenticated USING (auth.uid() = user_id AND public.can_write(auth.uid()));

-- Business settings policies
CREATE POLICY "Users can view own settings" ON public.business_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage settings" ON public.business_settings FOR ALL TO authenticated USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_parties_updated_at BEFORE UPDATE ON public.parties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_settings_updated_at BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign default role (first user gets admin, others get viewer)
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer');
  END IF;
  
  -- Create default business settings
  INSERT INTO public.business_settings (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();