-- Create license_settings table for remote license management
CREATE TABLE public.license_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expiry_date DATE NOT NULL DEFAULT '2026-03-31',
  license_type TEXT NOT NULL DEFAULT 'Professional',
  licensed_to TEXT DEFAULT 'Your Business Name',
  support_email TEXT DEFAULT 'support@dhandaapp.com',
  support_phone TEXT DEFAULT '+91 98765 43210',
  support_whatsapp TEXT DEFAULT '+919876543210',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.license_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read license settings (needed for license check)
CREATE POLICY "Anyone can view license settings"
ON public.license_settings
FOR SELECT
USING (true);

-- Only admins can manage license settings
CREATE POLICY "Admins can manage license settings"
ON public.license_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_license_settings_updated_at
BEFORE UPDATE ON public.license_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default license settings
INSERT INTO public.license_settings (expiry_date, license_type, licensed_to, support_email, support_phone, support_whatsapp)
VALUES ('2026-03-31', 'Professional', 'Your Business Name', 'support@dhandaapp.com', '+91 98765 43210', '+919876543210');