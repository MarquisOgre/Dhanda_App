-- Create table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only super admin can view contact submissions (we'll handle this in code)
CREATE POLICY "Super admin can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Super admin can update (mark as read)
CREATE POLICY "Super admin can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (public.is_super_admin(auth.uid()));

-- Create table for free trial requests
CREATE TABLE public.trial_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

-- Super admin can view all trial requests
CREATE POLICY "Super admin can view all trial requests" 
ON public.trial_requests 
FOR SELECT 
USING (public.is_super_admin(auth.uid()));

-- Anyone can submit trial request
CREATE POLICY "Anyone can submit trial request" 
ON public.trial_requests 
FOR INSERT 
WITH CHECK (true);

-- Super admin can update trial requests
CREATE POLICY "Super admin can update trial requests" 
ON public.trial_requests 
FOR UPDATE 
USING (public.is_super_admin(auth.uid()));