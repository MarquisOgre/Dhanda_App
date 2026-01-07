-- Create units table for custom units of measure
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own units" 
ON public.units 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own units" 
ON public.units 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own units" 
ON public.units 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own units" 
ON public.units 
FOR DELETE 
USING (auth.uid() = user_id);