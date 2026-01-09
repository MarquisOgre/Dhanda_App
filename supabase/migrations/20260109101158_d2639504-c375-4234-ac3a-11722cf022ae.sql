-- Create active_sessions table to track simultaneous logins
CREATE TABLE public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  device_info TEXT,
  ip_address TEXT,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.active_sessions FOR SELECT
USING (auth.uid() = user_id);

-- Policy for users to insert their own sessions
CREATE POLICY "Users can insert their own sessions"
ON public.active_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own sessions
CREATE POLICY "Users can delete their own sessions"
ON public.active_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Policy for users to update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.active_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX idx_active_sessions_last_activity ON public.active_sessions(last_activity);