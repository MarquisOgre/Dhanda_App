-- Create backup_settings table
CREATE TABLE public.backup_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  auto_backup_enabled BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'daily',
  backup_time TIME DEFAULT '23:30:00',
  retention_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create backups table
CREATE TABLE public.backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  backup_name TEXT NOT NULL,
  backup_type TEXT NOT NULL DEFAULT 'auto',
  file_size TEXT,
  status TEXT DEFAULT 'success',
  backup_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.backup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for backup_settings
CREATE POLICY "Users can view own backup settings"
ON public.backup_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own backup settings"
ON public.backup_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backup settings"
ON public.backup_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for backups
CREATE POLICY "Users can view own backups"
ON public.backups
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own backups"
ON public.backups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can delete backups"
ON public.backups
FOR DELETE
USING (auth.uid() = user_id AND has_role(auth.uid(), 'admin'));

-- RLS policies for notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at on backup_settings
CREATE TRIGGER update_backup_settings_updated_at
BEFORE UPDATE ON public.backup_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();